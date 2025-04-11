
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Settings, RefreshCw } from 'lucide-react';
import LanguageSelector from '@/components/settings/LanguageSelector';

interface SettingsPanelProps {
  onSettingsChange?: (settings: any) => void;
}

interface SettingsState {
  language: string;
}

const defaultSettings: SettingsState = {
  language: navigator.language || 'en-US'
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from Chrome storage or use browser's language
    if (typeof window !== 'undefined' && 'chrome' in window && window.chrome.runtime) {
      window.chrome.runtime.sendMessage(
        { action: 'getSettings' },
        (response) => {
          if (response && response.status === 'success') {
            setSettings(response.settings);
          } else {
            // If no settings found, use browser's language
            setSettings({ language: navigator.language || 'en-US' });
          }
          setIsLoading(false);
        }
      );
    } else {
      // Not running in a Chrome extension context, use browser's language
      setSettings({ language: navigator.language || 'en-US' });
      setIsLoading(false);
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Save to Chrome storage if in extension context
    if (typeof window !== 'undefined' && 'chrome' in window && window.chrome.runtime) {
      window.chrome.runtime.sendMessage(
        { action: 'saveSettings', settings: newSettings },
        (response) => {
          if (response && response.status === 'saved') {
            if (onSettingsChange) {
              onSettingsChange(newSettings);
            }
          }
        }
      );
    } else {
      // For development/preview mode
      if (onSettingsChange) {
        onSettingsChange(newSettings);
      }
    }
  };

  const resetSettings = () => {
    const newSettings = { language: navigator.language || 'en-US' };
    setSettings(newSettings);
    
    if (typeof window !== 'undefined' && 'chrome' in window && window.chrome.runtime) {
      window.chrome.runtime.sendMessage(
        { action: 'saveSettings', settings: newSettings },
        (response) => {
          if (response && response.status === 'saved') {
            toast({
              title: "Settings Reset",
              description: "Language has been reset to browser default."
            });
            
            if (onSettingsChange) {
              onSettingsChange(newSettings);
            }
          }
        }
      );
    } else {
      toast({
        title: "Settings Reset",
        description: "Language has been reset to browser default."
      });
      
      if (onSettingsChange) {
        onSettingsChange(newSettings);
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center h-40">
          <div className="animate-spin">
            <RefreshCw className="h-8 w-8 text-primary/50" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" /> Extension Settings
        </CardTitle>
        <CardDescription>
          Configure the language for speech recognition
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageSelector 
          value={settings.language} 
          onChange={(value) => handleSettingChange('language', value)}
        />
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetSettings}
        >
          Reset to Browser Default
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsPanel;
