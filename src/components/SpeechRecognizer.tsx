
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Check, X, Clipboard, ClipboardCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/components/ui/use-toast';

interface SpeechRecognizerProps {
  onTranscriptComplete: (transcript: string) => void;
  language?: string;
}

const SpeechRecognizer: React.FC<SpeechRecognizerProps> = ({ 
  onTranscriptComplete,
  language = 'en-US'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const { 
    isListening, 
    transcript: liveTranscript, 
    startListening, 
    stopListening, 
    hasRecognitionSupport,
    error
  } = useSpeechRecognition();

  useEffect(() => {
    if (liveTranscript) {
      setTranscript(liveTranscript);
    }
  }, [liveTranscript]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  const handleToggleExpand = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else if (!isListening) {
      setIsExpanded(false);
      setTranscript('');
    }
  };

  const handleStartRecording = () => {
    if (!hasRecognitionSupport) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome.",
        variant: "destructive"
      });
      return;
    }
    startListening(language);
  };

  const handleStopRecording = () => {
    stopListening();
  };

  const handleConfirm = () => {
    if (transcript.trim()) {
      onTranscriptComplete(transcript);
      toast({
        title: "Source Material Added",
        description: "Your dictated text has been added as source material."
      });
      setIsExpanded(false);
      setTranscript('');
    } else {
      toast({
        title: "No Text to Add",
        description: "Please record or type some text first.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setTranscript('');
    stopListening();
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setIsCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Text copied to clipboard successfully."
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className={cn(
      "fixed bottom-8 right-8 z-50 flex flex-col items-end",
      isExpanded ? "w-80" : "w-auto"
    )}>
      {isExpanded && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 w-full slide-up">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Add Source Material</h3>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopy}
                disabled={!transcript}
                className="h-8 w-8 p-0"
              >
                {isCopied ? <ClipboardCheck className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <textarea
            ref={textareaRef}
            className="w-full h-32 p-2 border rounded-md mb-2 focus:outline-none focus:ring-1 focus:ring-primary"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Start speaking or type your source material here..."
          />
          
          <div className="flex justify-between">
            <div>
              {isListening ? (
                <Button 
                  onClick={handleStopRecording} 
                  variant="destructive" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <MicOff className="h-4 w-4" /> Stop
                </Button>
              ) : (
                <Button 
                  onClick={handleStartRecording} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Mic className="h-4 w-4" /> Record
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleCancel} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                variant="default" 
                size="sm"
                disabled={!transcript.trim()}
                className="flex items-center gap-1"
              >
                <Check className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Button
        onClick={handleToggleExpand}
        className={cn(
          "rounded-full w-14 h-14 shadow-lg flex items-center justify-center",
          isListening && "animate-pulse bg-red-500 hover:bg-red-600"
        )}
        variant="default"
      >
        {isListening ? (
          <Mic className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </Button>
    </div>
  );
};

export default SpeechRecognizer;
