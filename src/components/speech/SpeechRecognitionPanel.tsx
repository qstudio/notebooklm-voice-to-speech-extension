
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
  const [lastTranscriptLength, setLastTranscriptLength] = useState(0);
  const { toast } = useToast();

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
    // Save cursor position for future recording
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Handle textarea interaction (keydown, mousedown, paste)
  const handleTextareaInteraction = () => {
    if (isListening) {
      onStopListening();
      addDebugInfo('Recording stopped due to user interaction with textarea');
    }
    
    // Save cursor position for future recording
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
  };

  // Save cursor position on selection change
  const handleSelectionChange = () => {
    if (textareaRef.current) {
      setCursorPosition(textareaRef.current.selectionStart);
    }
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
    if (isListening && transcript) {
      // Only proceed if we have new transcript text (compared to last update)
      if (transcript.length !== lastTranscriptLength) {
        setLastTranscriptLength(transcript.length);
        
        // Use the complete transcript as the text area content
        setTextAreaContent(transcript);
        
        // Log the update (but only when the length changes to avoid spam)
        addDebugInfo(`New transcript received: "${transcript.slice(-20)}..."`);
      }
    }
  }, [transcript, isListening, addDebugInfo, lastTranscriptLength]);

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
              setLastTranscriptLength(0);
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
