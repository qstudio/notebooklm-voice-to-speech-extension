
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Info } from 'lucide-react';
import LanguageSelector from '@/components/settings/LanguageSelector';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/components/ui/use-toast';

const SpeechDemo: React.FC = () => {
  const [language, setLanguage] = useState('en-US');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { toast } = useToast();
  
  const { 
    transcript, 
    isListening, 
    hasRecognitionSupport, 
    startListening, 
    stopListening, 
    resetTranscript,
    error
  } = useSpeechRecognition();

  // Ref to auto-scroll debug info
  const debugContainerRef = useRef<HTMLDivElement>(null);

  // Add debug information with timestamp
  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `${timestamp}: ${message}`]);
  };

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    addDebugInfo(`Language changed to ${value}`);
  };

  // Handle recording control
  const handleRecordingToggle = () => {
    if (isListening) {
      stopListening();
      addDebugInfo('Recording stopped');
    } else {
      resetTranscript();
      startListening(language);
      addDebugInfo(`Recording started with language: ${language}`);
    }
  };

  // Handle copy to clipboard
  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript)
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

  // Clear transcript
  const handleClear = () => {
    resetTranscript();
    addDebugInfo('Transcript cleared');
  };

  // Clear debug logs
  const handleClearLogs = () => {
    setDebugInfo([]);
  };

  // Auto-scroll debug info
  useEffect(() => {
    if (debugContainerRef.current) {
      debugContainerRef.current.scrollTop = debugContainerRef.current.scrollHeight;
    }
  }, [debugInfo]);

  // Log errors to debug
  useEffect(() => {
    if (error) {
      addDebugInfo(`Error: ${error}`);
    }
  }, [error]);

  // Log transcript changes
  useEffect(() => {
    if (isListening && transcript) {
      addDebugInfo(`Transcript updated (${transcript.length} chars)`);
    }
  }, [transcript, isListening]);

  // Initial check for browser support
  useEffect(() => {
    if (hasRecognitionSupport) {
      addDebugInfo('Speech recognition is supported in this browser');
    } else {
      addDebugInfo('Speech recognition is NOT supported in this browser');
    }
  }, [hasRecognitionSupport]);

  if (!hasRecognitionSupport) {
    return (
      <div className="container py-10">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Speech to Text Demo</CardTitle>
            <CardDescription className="text-center">
              Sorry, your browser does not support the Web Speech API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              Please try using a Chromium-based browser like Chrome, Edge, or Brave.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Speech to Text Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Speech Recognition Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Speech Recognition</CardTitle>
            <CardDescription>
              Speak into your microphone and see the text appear below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <LanguageSelector value={language} onChange={handleLanguageChange} />
            
            <div className="mt-4">
              <Textarea 
                placeholder="Transcript will appear here..." 
                value={transcript} 
                readOnly 
                className="min-h-[200px] resize-none"
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
              <Button onClick={handleClear} variant="outline" disabled={!transcript}>
                Clear
              </Button>
              <Button onClick={handleCopy} variant="outline" disabled={!transcript}>
                Copy
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Debug Info Card */}
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Debug Information</CardTitle>
              <CardDescription>
                Real-time logs to debug recognition issues
              </CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearLogs}
              disabled={debugInfo.length === 0}
            >
              Clear Logs
            </Button>
          </CardHeader>
          <CardContent>
            <div 
              ref={debugContainerRef}
              className="bg-muted p-2 rounded text-xs font-mono h-[350px] overflow-auto"
            >
              {debugInfo.length > 0 ? (
                <ul className="space-y-1">
                  {debugInfo.map((info, index) => (
                    <li key={index} className="border-b border-muted-foreground/20 pb-1">
                      {info}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Info className="mr-2 h-4 w-4" /> No logs yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpeechDemo;
