
import React, { useState } from 'react';
import SettingsPanel from '@/components/SettingsPanel';
import { useToast } from '@/components/ui/use-toast';

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
      <header className="max-w-md mx-auto mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2 text-center">Voice to Text for Google NotebookLM</h1>
        <p className="text-center text-muted-foreground text-sm">Add source material using voice dictation</p>
      </header>

      <main className="max-w-md mx-auto">
        <SettingsPanel onSettingsChange={handleSettingsChange} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Navigate to Google NotebookLM to use the voice dictation feature.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Look for the "Speak" button when adding source material.
          </p>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-xs text-muted-foreground">
        <p>© 2025 Voice to Text for Google NotebookLM</p>
      </footer>
    </div>
  );
};

export default Index;
