
import React, { useState, useEffect } from 'react';
import SettingsPanel from '@/components/SettingsPanel';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [language, setLanguage] = useState('en-US');
  const { toast } = useToast();
  const [currentPath, setCurrentPath] = useState('');

  // Debug - log component mount and current path
  useEffect(() => {
    const path = window.location.hash || 'No hash';
    console.log('Index component mounted, current hash:', path);
    setCurrentPath(path);
  }, []);

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
        {/* Debug info - remove in production */}
        <div className="bg-amber-50 p-2 mb-4 text-xs text-amber-800 rounded border border-amber-200">
          Current path: {currentPath}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-gray-100 flex flex-col items-center">
          <h2 className="text-lg font-medium mb-3 text-center">Try Speech Recognition Demo</h2>
          <p className="text-sm text-muted-foreground mb-5 text-center max-w-md">
            Test the speech recognition functionality directly in your browser without installing the extension.
          </p>
          
          <div className="flex gap-4 w-full max-w-md">
            <Link to="/demo" className="w-full">
              <Button variant="default" size="lg" className="w-full gap-2 justify-center bg-green-500 hover:bg-green-600">
                <Mic className="h-5 w-5" />
                Open Demo
              </Button>
            </Link>
          </div>
          
          {/* Direct hash link as fallback */}
          <div className="mt-4 text-sm">
            <p>If the button doesn't work, try <a href="#/demo" className="text-blue-500 underline">this direct link</a></p>
          </div>
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
