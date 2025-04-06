
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Settings, RefreshCw } from 'lucide-react';
import LanguageSelector from '@/components/settings/LanguageSelector';
import FeatureToggles from '@/components/settings/FeatureToggles';

interface SettingsPanelProps {
  onSettingsChange?: (settings: any) => void;
}

interface SettingsState {
  language: string;
  autoInsert: boolean;
  confirmBeforeAdd: boolean;
}

const defaultSettings: SettingsState = {
  language: 'en-US',
  autoInsert: false,
  confirmBeforeAdd: true
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from Chrome storage
    if (typeof window !== 'undefined' && 'chrome' in window && window.chrome.runtime) {
      window.chrome.runtime.sendMessage(
        { action: 'getSettings' },
        (response) => {
          if (response && response.status === 'success') {
            setSettings(response.settings);
          }
          setIsLoading(false);
        }
      );
    } else {
      // Not running in a Chrome extension context
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
    setSettings(defaultSettings);
    
    if (typeof window !== 'undefined' && 'chrome' in window && window.chrome.runtime) {
      window.chrome.runtime.sendMessage(
        { action: 'saveSettings', settings: defaultSettings },
        (response) => {
          if (response && response.status === 'saved') {
            toast({
              title: "Settings Reset",
              description: "All settings have been reset to default values."
            });
            
            if (onSettingsChange) {
              onSettingsChange(defaultSettings);
            }
          }
        }
      );
    } else {
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values."
      });
      
      if (onSettingsChange) {
        onSettingsChange(defaultSettings);
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
          Configure how Speech to Text works with Google NotebookLM
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LanguageSelector 
          value={settings.language} 
          onChange={(value) => handleSettingChange('language', value)}
        />

        <FeatureToggles 
          autoInsert={settings.autoInsert}
          confirmBeforeAdd={settings.confirmBeforeAdd}
          onAutoInsertChange={(checked) => handleSettingChange('autoInsert', checked)}
          onConfirmBeforeAddChange={(checked) => handleSettingChange('confirmBeforeAdd', checked)}
        />
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={resetSettings}
        >
          Reset to Defaults
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsPanel;
