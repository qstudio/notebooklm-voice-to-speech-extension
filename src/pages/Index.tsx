import React, { useState, useRef } from 'react';
import SpeechRecognizer from '@/components/SpeechRecognizer';
import NotebookSimulator, { NotebookSimulatorRef } from '@/components/NotebookSimulator';
import ExtensionInfo from '@/components/ExtensionInfo';
import SettingsPanel from '@/components/SettingsPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
const Index = () => {
  const [sourceMaterials, setSourceMaterials] = useState<string[]>([]);
  const [language, setLanguage] = useState('en-US');
  const notebookSimulatorRef = useRef<NotebookSimulatorRef>(null);
  const {
    toast
  } = useToast();
  const handleTranscriptComplete = (transcript: string) => {
    setSourceMaterials([...sourceMaterials, transcript]);

    // In a real Chrome extension, we would inject the transcript into Google's notebook
    // Here we're just simulating that behavior for the preview
    if (notebookSimulatorRef.current) {
      notebookSimulatorRef.current.addSourceMaterial(transcript);
    }

    // If running in extension context, send to active tab
    if (typeof window !== 'undefined' && 'chrome' in window && window.chrome.runtime) {
      window.chrome.runtime.sendMessage({
        action: "addSourceMaterial",
        text: transcript
      }, response => {
        if (response && response.status === "error") {
          toast({
            title: "Error Adding Source Material",
            description: response.message || "Failed to add source material to Google Notebook.",
            variant: "destructive"
          });
        }
      });
    }
  };
  const handleSettingsChange = (settings: any) => {
    if (settings.language) {
      setLanguage(settings.language);
    }
  };
  return <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <header className="max-w-4xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">NotebookLM Voice to Text Chrome Extension</h1>
        <p className="text-center text-muted-foreground">Add source material to Google notebooklm using voice dictation</p>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <Tabs defaultValue="simulator" className="w-full">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
            <TabsTrigger value="simulator">Demo Simulator</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="about">About Extension</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulator" className="mt-6">
            <NotebookSimulator ref={notebookSimulatorRef} />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <SettingsPanel onSettingsChange={handleSettingsChange} />
          </TabsContent>
          
          <TabsContent value="about" className="mt-6">
            <ExtensionInfo />
          </TabsContent>
        </Tabs>
        
        {/* This would be the actual Chrome extension button overlay */}
        <SpeechRecognizer onTranscriptComplete={handleTranscriptComplete} language={language} />
      </main>
      
      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>© 2025 Alined AI - NotebookLM Voice to Text Extension</p>
      </footer>
    </div>;
};
export default Index;