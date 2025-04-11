
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, ClipboardCopy, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecordingControlsProps {
  isListening: boolean;
  textContent: string;
  onToggleRecording: () => void;
  onClear: () => void;
  onCopy: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isListening,
  textContent,
  onToggleRecording,
  onClear,
  onCopy,
}) => {
  const { toast } = useToast();

  // Handle copy to clipboard
  const handleCopy = () => {
    if (textContent) {
      navigator.clipboard.writeText(textContent)
        .then(() => {
          toast({
            title: "Copied to clipboard",
            description: "Text has been copied to clipboard successfully",
          });
        })
        .catch(err => {
          toast({
            title: "Failed to copy",
            description: "Could not copy text to clipboard",
            variant: "destructive"
          });
        });
    }
    // Call the parent onCopy for any additional logic
    onCopy();
  };

  return (
    <div className="flex justify-between flex-wrap gap-2">
      <Button 
        onClick={onToggleRecording} 
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
          onClick={onClear} 
          variant="outline"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Clear
        </Button>
        <Button 
          onClick={handleCopy} 
          variant="outline" 
          disabled={!textContent}
        >
          <ClipboardCopy className="mr-2 h-4 w-4" /> Copy
        </Button>
      </div>
    </div>
  );
};

export default RecordingControls;
