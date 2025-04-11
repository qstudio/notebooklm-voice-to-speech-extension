
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, MicOff, ClipboardCopy, Trash2 } from 'lucide-react';
import LanguageSelector from '@/components/settings/LanguageSelector';
import { useToast } from '@/hooks/use-toast';

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
  const [insertedText, setInsertedText] = useState('');
  const { toast } = useToast();

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
      // Clear inserted text tracking for new recording session
      setInsertedText('');
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

  // Handle copy to clipboard
  const handleCopy = () => {
    if (textAreaContent) {
      navigator.clipboard.writeText(textAreaContent)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Text has been copied to clipboard successfully",
          });
          addDebugInfo('Text copied to clipboard');
        })
        .catch(err => {
          toast({
            title: "Failed to copy",
            description: "Could not copy text to clipboard",
            variant: "destructive"
          });
          addDebugInfo(`Copy failed: ${err.message}`);
        });
    }
  };

  // Update textarea with transcript
  useEffect(() => {
    if (isListening && transcript && transcript.trim() !== '') {
      // Only process if we have new transcribed text to insert
      if (transcript !== insertedText) {
        // Get current text and cursor position
        const currentText = textAreaContent;
        const insertPosition = cursorPosition !== null ? cursorPosition : currentText.length;
        
        // Insert the new text at cursor position
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
        setInsertedText(transcript);
        
        addDebugInfo(`New text "${transcript}" appended at position ${insertPosition}`);
      }
    }
  }, [transcript, isListening, textAreaContent, cursorPosition, insertedText, addDebugInfo]);

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
        
        <div className="mt-4">
          <Textarea 
            ref={textareaRef}
            placeholder="Start recording or type here..." 
            className="min-h-[200px] resize-none"
            value={textAreaContent}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaInteraction}
            onMouseDown={handleTextareaInteraction}
            onPaste={handleTextareaInteraction}
            onClick={handleTextareaInteraction}
            onSelect={handleSelectionChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap gap-2">
        <Button 
          onClick={handleRecordingToggle} 
          variant={isListening ? "destructive" : "default"}
        >
          {isListening ? (
            <>
              <MicOff className="mr-2 h-4 w-4" /> Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" /> Start Recording
            </>
          )}
        </Button>
        <div className="space-x-2">
          <Button 
            onClick={() => {
              onClear();
              setTextAreaContent('');
              setInsertedText('');
            }} 
            variant="outline"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear
          </Button>
          <Button 
            onClick={handleCopy} 
            variant="outline" 
            disabled={!textAreaContent}
          >
            <ClipboardCopy className="mr-2 h-4 w-4" /> Copy
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SpeechRecognitionPanel;
