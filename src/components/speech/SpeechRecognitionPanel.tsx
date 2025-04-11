
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

  // Save cursor position when text area is focused or clicked
  const updateCursorPosition = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
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

  // Update textarea with transcript directly from the hook
  useEffect(() => {
    if (transcript) {
      // Only update if the transcript has changed from previous state
      if (transcript !== previousTranscript) {
        setTextAreaContent(transcript);
        setPreviousTranscript(transcript);
        addDebugInfo(`Transcript updated: "${transcript.substring(0, 30)}${transcript.length > 30 ? '...' : ''}"`);
        
        // Set cursor position to end of text
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            const newPosition = transcript.length;
            textareaRef.current.setSelectionRange(newPosition, newPosition);
            setCursorPosition(newPosition);
          }
        }, 0);
      }
    }
  }, [transcript, previousTranscript, addDebugInfo]);

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
