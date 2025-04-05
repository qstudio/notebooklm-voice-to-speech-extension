
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, ArrowRight, HelpCircle } from 'lucide-react';

const ExtensionInfo: React.FC = () => {
  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="bg-primary text-white rounded-t-lg">
        <CardTitle className="text-xl flex items-center gap-2">
          <Mic className="h-5 w-5" /> Notebook Voice Scribe
        </CardTitle>
        <CardDescription className="text-primary-foreground opacity-90">
          Add source material to Google notebook using your voice
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Mic className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Voice Recording</h3>
              <p className="text-sm text-muted-foreground">
                Click the microphone button in the bottom right corner to start dictating source material.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Add to Notebook</h3>
              <p className="text-sm text-muted-foreground">
                Review the transcribed text and click "Add" to insert it as source material in your Google notebook.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-sm">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                This extension works best in Chrome with a good microphone. Make sure to grant microphone permissions when prompted.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-0">
        <p className="text-xs text-muted-foreground">
          Version 1.0
        </p>
        <Button variant="ghost" size="sm" className="text-xs">
          Report an issue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionInfo;
