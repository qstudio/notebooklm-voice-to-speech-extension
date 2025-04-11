
import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionHook {
  transcript: string;
  isListening: boolean;
  hasRecognitionSupport: boolean;
  startListening: (language?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
}

// Define the SpeechRecognition types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionError extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionClass {
  new (): SpeechRecognitionInstance;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
}

export const useSpeechRecognition = (): SpeechRecognitionHook => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognitionInstance | null>(null);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setHasRecognitionSupport(true);
      
      // Create a speech recognition instance
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      // Configure recognition instance
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = useCallback((language?: string) => {
    if (recognition && !isListening) {
      try {
        // Reset any previous errors
        setError(null);
        
        // Reset transcript when starting new recognition session
        setTranscript('');
        
        // Set language if provided
        if (language) {
          recognition.lang = language;
        }
        
        // Set up event handlers just before starting
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          // Get current transcript from latest result
          if (event.results.length > 0) {
            const current = event.results[event.results.length - 1];
            if (current.isFinal || true) { // Always use the latest result
              const currentText = current[0].transcript.trim();
              setTranscript(currentText);
            }
          }
        };
        
        recognition.onerror = (event: SpeechRecognitionError) => {
          console.error('Speech recognition error:', event.error);
          let errorMessage = 'Unknown speech recognition error';
          
          switch(event.error) {
            case 'no-speech':
              errorMessage = 'No speech was detected. Please try again.';
              break;
            case 'aborted':
              errorMessage = 'Speech recognition was aborted.';
              break;
            case 'audio-capture':
              errorMessage = 'No microphone was found or microphone is not working.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your connection.';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone permission was denied. Please allow microphone access.';
              break;
            case 'service-not-allowed':
              errorMessage = 'The speech recognition service is not allowed.';
              break;
            case 'bad-grammar':
              errorMessage = 'There was an error with the speech grammar.';
              break;
            case 'language-not-supported':
              errorMessage = 'The language is not supported.';
              break;
          }
          
          setError(errorMessage);
          setIsListening(false);
        };
        
        recognition.onend = () => {
          console.log("Speech recognition ended");
          setIsListening(false);
        };
        
        recognition.start();
        setIsListening(true);
        console.log("Speech recognition started with language:", language || 'en-US');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setError('Failed to start speech recognition. Please try again.');
        setIsListening(false);
      }
    }
  }, [recognition, isListening]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
      console.log("Speech recognition stopped manually");
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    console.log("Transcript reset");
  }, []);

  return {
    transcript,
    isListening,
    hasRecognitionSupport,
    startListening,
    stopListening,
    resetTranscript,
    error
  };
};
