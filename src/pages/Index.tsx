
import React, { useState, useRef } from 'react';
import SpeechRecognizer from '@/components/SpeechRecognizer';
import NotebookSimulator, { NotebookSimulatorRef } from '@/components/NotebookSimulator';
import ExtensionInfo from '@/components/ExtensionInfo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [sourceMaterials, setSourceMaterials] = useState<string[]>([]);
  const notebookSimulatorRef = useRef<NotebookSimulatorRef>(null);

  const handleTranscriptComplete = (transcript: string) => {
    setSourceMaterials([...sourceMaterials, transcript]);
    
    // In a real Chrome extension, we would inject the transcript into Google's notebook LM
    // Here we're just simulating that behavior
    if (notebookSimulatorRef.current) {
      notebookSimulatorRef.current.addSourceMaterial(transcript);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">
          Voice Scribe for Google Notebook
        </h1>
        <p className="text-center text-muted-foreground">
          Add source material to Google notebook using voice dictation
        </p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <Tabs defaultValue="simulator" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="simulator">Demo Simulator</TabsTrigger>
            <TabsTrigger value="about">About Extension</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulator" className="mt-6">
            <NotebookSimulator ref={notebookSimulatorRef} />
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <ExtensionInfo />
          </TabsContent>
        </Tabs>
        
        {/* This would be the actual Chrome extension button overlay */}
        <SpeechRecognizer onTranscriptComplete={handleTranscriptComplete} />
      </main>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© 2025 Voice Scribe Extension | Privacy Policy</p>
      </footer>
    </div>
  );
};

export default Index;
