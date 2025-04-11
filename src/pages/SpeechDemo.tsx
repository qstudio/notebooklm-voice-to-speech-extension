
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useDebugInfo } from '@/hooks/use-debug-info';
import SpeechRecognitionPanel from '@/components/speech/SpeechRecognitionPanel';
import DebugInfoPanel from '@/components/speech/DebugInfoPanel';

const SpeechDemo: React.FC = () => {
  const [language, setLanguage] = useState('en-US');
  const { debugInfo, addDebugInfo, clearDebugInfo } = useDebugInfo();
  
  const { 
    transcript, 
    isListening, 
    hasRecognitionSupport, 
    startListening, 
    stopListening, 
    resetTranscript,
    error
  } = useSpeechRecognition();

  // Handle language change
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    addDebugInfo(`Language changed to ${value}`);
  };

  // Start listening with the selected language
  const handleStartListening = () => {
    resetTranscript();
    startListening(language);
  };

  // Log errors to debug
  useEffect(() => {
    if (error) {
      addDebugInfo(`Error: ${error}`);
    }
  }, [error, addDebugInfo]);

  // Initial check for browser support
  useEffect(() => {
    if (hasRecognitionSupport) {
      addDebugInfo('Speech recognition is supported in this browser');
    } else {
      addDebugInfo('Speech recognition is NOT supported in this browser');
    }
  }, [hasRecognitionSupport, addDebugInfo]);

  if (!hasRecognitionSupport) {
    return (
      <div className="container py-10">
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Speech to Text Demo</h2>
          <p className="text-center mb-4">
            Sorry, your browser does not support the Web Speech API.
          </p>
          <p className="text-center">
            Please try using a Chromium-based browser like Chrome, Edge, or Brave.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Speech to Text Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Speech Recognition Panel */}
        <SpeechRecognitionPanel
          language={language}
          onLanguageChange={handleLanguageChange}
          transcript={transcript}
          isListening={isListening}
          onStartListening={handleStartListening}
          onStopListening={stopListening}
          onClear={resetTranscript}
          addDebugInfo={addDebugInfo}
        />

        {/* Debug Info Panel */}
        <DebugInfoPanel 
          debugInfo={debugInfo}
          onClearLogs={clearDebugInfo}
        />
      </div>
    </div>
  );
};

export default SpeechDemo;
