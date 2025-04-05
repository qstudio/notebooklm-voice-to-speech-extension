
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
      
      // Set up event handlers
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionError) => {
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
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = useCallback((language?: string) => {
    if (recognition && !isListening) {
      try {
        // Reset any previous errors
        setError(null);
        
        // Set language if provided
        if (language) {
          recognition.lang = language;
        }
        
        recognition.start();
        setIsListening(true);
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
    }
  }, [recognition, isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
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

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionClass;
    webkitSpeechRecognition?: SpeechRecognitionClass;
  }
}
