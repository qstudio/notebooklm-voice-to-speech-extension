
import React, { useState } from 'react';
import SettingsPanel from '@/components/SettingsPanel';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [language, setLanguage] = useState('en-US');
  const { toast } = useToast();

  const handleSettingsChange = (settings: any) => {
    if (settings.language) {
      setLanguage(settings.language);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="max-w-xl mx-auto mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2 text-center">Voice to Text for Google NotebookLM</h1>
        <p className="text-center text-muted-foreground text-sm">Add source material using voice dictation</p>
      </header>

      <main className="max-w-2xl mx-auto w-full sm:w-[600px] md:w-[600px]">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-100">
          <h2 className="text-lg font-medium mb-4">Speech Recognition Demo</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Test the speech recognition functionality directly in your browser without installing the extension.
          </p>
          <Link to="/demo" className="inline-block w-full">
            <Button className="w-full gap-2 justify-center">
              <Mic className="h-4 w-4" />
              Open Speech Demo
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        
        <SettingsPanel onSettingsChange={handleSettingsChange} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Navigate to Google NotebookLM to use the voice dictation feature with the extension.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Look for the "Speak" button when adding source material.
          </p>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>Made by Alined</p>
      </footer>
    </div>
  );
};

export default Index;
