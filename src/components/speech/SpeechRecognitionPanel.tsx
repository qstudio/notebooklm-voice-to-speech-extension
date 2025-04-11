
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
  const [previousTranscript, setPreviousTranscript] = useState('');

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
      // Reset previous transcript for new recording session
      setPreviousTranscript('');
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
    setPreviousTranscript('');
  };

  // Update textarea with transcript
  useEffect(() => {
    if (isListening && transcript && transcript !== previousTranscript) {
      // Get current text and cursor position
      const currentText = textAreaContent;
      const insertPosition = cursorPosition !== null ? cursorPosition : currentText.length;
      
      // Only insert the new part of the transcript
      const newText = 
        currentText.substring(0, insertPosition) + 
        transcript + 
        currentText.substring(insertPosition);
      
      // Update the text area content
      setTextAreaContent(newText);
      
      // Move cursor to end of inserted text
      const newPosition = insertPosition + transcript.length;
      
      // Set cursor position after component updates
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition);
        }
      }, 0);
      
      // Save what we've inserted to avoid duplication
      setPreviousTranscript(transcript);
      
      addDebugInfo(`New text "${transcript}" appended at position ${insertPosition}`);
    }
  }, [transcript, isListening, textAreaContent, cursorPosition, previousTranscript, addDebugInfo]);

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
