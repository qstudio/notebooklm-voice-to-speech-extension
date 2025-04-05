import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Settings, Languages, RefreshCw } from 'lucide-react';

// Language options for speech recognition
const LANGUAGE_OPTIONS = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'zh-CN', label: 'Chinese (Simplified)' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'hi-IN', label: 'Hindi' },
  { value: 'ru-RU', label: 'Russian' }
];

interface SettingsPanelProps {
  onSettingsChange?: (settings: any) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState({
    language: 'en-US',
    autoInsert: false,
    confirmBeforeAdd: true
  });
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
    const defaultSettings = {
      language: 'en-US',
      autoInsert: false,
      confirmBeforeAdd: true
    };
    
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
          Configure how Voice Scribe works with Google Notebook
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="language" className="flex items-center gap-1">
              <Languages className="h-4 w-4" /> Recognition Language
            </Label>
          </div>
          <Select 
            value={settings.language} 
            onValueChange={(value) => handleSettingChange('language', value)}
          >
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map(lang => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            The language used for speech recognition.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-insert" className="cursor-pointer">
              Auto-insert after speaking
            </Label>
            <Switch 
              id="auto-insert" 
              checked={settings.autoInsert}
              onCheckedChange={(checked) => handleSettingChange('autoInsert', checked)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Automatically insert text when you stop speaking.
          </p>

          <div className="flex items-center justify-between">
            <Label htmlFor="confirm-add" className="cursor-pointer">
              Confirm before adding
            </Label>
            <Switch 
              id="confirm-add" 
              checked={settings.confirmBeforeAdd}
              onCheckedChange={(checked) => handleSettingChange('confirmBeforeAdd', checked)}
              disabled={!settings.autoInsert}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Ask for confirmation before automatically adding text.
          </p>
        </div>
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
