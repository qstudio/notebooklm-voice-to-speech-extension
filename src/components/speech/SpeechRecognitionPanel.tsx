
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import LanguageSelector from '@/components/settings/LanguageSelector';
import TranscriptionTextarea from './TranscriptionTextarea';
import RecordingControls from './RecordingControls';

interface SpeechRecognitionPanelProps {
  language: string;
  onLanguageChange: (value: string) => void;
  transcript: string;
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onClear: () => void;
  addDebugInfo: (message: string) => void;
}

const SpeechRecognitionPanel: React.FC<SpeechRecognitionPanelProps> = ({
  language,
  onLanguageChange,
  transcript,
  isListening,
  onStartListening,
  onStopListening,
  onClear,
  addDebugInfo,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [textAreaContent, setTextAreaContent] = useState('');
  // Track the last transcript to prevent duplications
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');

  // Save cursor position when text area is focused or clicked
  const updateCursorPosition = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Handle recording control
  const handleRecordingToggle = () => {
    if (isListening) {
      onStopListening();
      addDebugInfo('Recording stopped');
    } else {
      // Focus the textarea and save cursor position before starting recording
      if (textareaRef.current) {
        textareaRef.current.focus();
        setCursorPosition(textareaRef.current.selectionStart);
      }
      // Reset transcript tracking for new recording session
      setLastProcessedTranscript('');
      onStartListening();
      addDebugInfo(`Recording started with language: ${language}`);
    }
  };

  // Handle textarea input (for manual typing)
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaContent(e.target.value);
    updateCursorPosition();
  };

  // Handle textarea interaction (keydown, mousedown, paste)
  const handleTextareaInteraction = () => {
    if (isListening) {
      onStopListening();
      addDebugInfo('Recording stopped due to user interaction with textarea');
    }
    updateCursorPosition();
  };

  // Save cursor position on selection change
  const handleSelectionChange = () => {
    updateCursorPosition();
  };

  // Handle copying text to clipboard
  const handleCopy = () => {
    addDebugInfo('Text copied to clipboard');
  };

  // Handle clearing text
  const handleClear = () => {
    onClear();
    setTextAreaContent('');
    setLastProcessedTranscript('');
  };

  // Update textarea with transcript (fixed to prevent duplicate text)
  useEffect(() => {
    if (isListening && transcript && transcript !== lastProcessedTranscript) {
      // Get current text and cursor position
      const currentText = textAreaContent;
      const insertPosition = cursorPosition !== null ? cursorPosition : currentText.length;
      
      // Only add the new part of the transcript to avoid duplication
      // If the transcript is completely new (different from last one)
      if (!transcript.startsWith(lastProcessedTranscript)) {
        // Completely new transcript - replace at cursor position
        const newText = 
          currentText.substring(0, insertPosition) + 
          transcript + 
          currentText.substring(insertPosition);
        
        setTextAreaContent(newText);
        
        // Log the change for debugging
        addDebugInfo(`New text "${transcript}" appended at position ${insertPosition}`);
      } else if (transcript.length > lastProcessedTranscript.length) {
        // Only append the new part of the transcript
        const newPart = transcript.substring(lastProcessedTranscript.length);
        
        const newText = 
          currentText.substring(0, insertPosition) + 
          newPart + 
          currentText.substring(insertPosition);
        
        setTextAreaContent(newText);
        
        // Log the change for debugging
        addDebugInfo(`New text "${newPart}" appended at position ${insertPosition}`);
      }
      
      // Move cursor to end of inserted text
      const newPosition = insertPosition + 
        (transcript.length - (lastProcessedTranscript ? lastProcessedTranscript.length : 0));
      
      // Set cursor position after component updates
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
        }
      }, 0);
      
      // Update the last processed transcript
      setLastProcessedTranscript(transcript);
    }
  }, [transcript, isListening, textAreaContent, cursorPosition, lastProcessedTranscript, addDebugInfo]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Speech Recognition</CardTitle>
        <CardDescription>
          Speak into your microphone and see the text appear below.
          Click or type to edit text manually (this will pause recording).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LanguageSelector value={language} onChange={onLanguageChange} />
        
        <TranscriptionTextarea 
          value={textAreaContent}
          onChange={handleTextareaChange}
          onInteraction={handleTextareaInteraction}
          onSelectionChange={handleSelectionChange}
          textareaRef={textareaRef}
        />
      </CardContent>
      <CardFooter>
        <RecordingControls
          isListening={isListening}
          textContent={textAreaContent}
          onToggleRecording={handleRecordingToggle}
          onClear={handleClear}
          onCopy={handleCopy}
        />
      </CardFooter>
    </Card>
  );
};

export default SpeechRecognitionPanel;
