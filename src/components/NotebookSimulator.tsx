
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Book, FileText } from 'lucide-react';

interface SourceMaterial {
  id: string;
  text: string;
  timestamp: Date;
}

export interface NotebookSimulatorRef {
  addSourceMaterial: (text: string) => void;
}

const NotebookSimulator = forwardRef<NotebookSimulatorRef, {}>((props, ref) => {
  const [sourceMaterials, setSourceMaterials] = useState<SourceMaterial[]>([]);
  const [activeTab, setActiveTab] = useState('notebook');

  const addSourceMaterial = (text: string) => {
    const newMaterial: SourceMaterial = {
      id: Date.now().toString(),
      text,
      timestamp: new Date()
    };
    setSourceMaterials([...sourceMaterials, newMaterial]);
    setActiveTab('sources');
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    addSourceMaterial
  }));

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md">
      <CardHeader className="bg-secondary/50 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Book className="h-5 w-5" /> Google Notebook Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start px-4 pt-2 bg-secondary/30">
            <TabsTrigger value="notebook" className="flex items-center gap-1">
              <Book className="h-4 w-4" /> Notebook
            </TabsTrigger>
            <TabsTrigger value="sources" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Source Material ({sourceMaterials.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="notebook" className="p-4">
            <div className="min-h-[300px] border border-dashed rounded-md p-4 bg-white">
              <h2 className="text-lg font-medium mb-4">My Research Notes</h2>
              <p className="text-muted-foreground text-sm mb-6">
                This is a simulation of a Google notebook. In a real extension, your voice transcription would be added to the actual notebook source material list.
              </p>
              
              <div className="flex flex-col gap-2">
                {sourceMaterials.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <p>Recent source materials:</p>
                    <ul className="list-disc pl-5">
                      {sourceMaterials.slice(0, 3).map(material => (
                        <li key={material.id} className="text-sm">
                          {material.text.substring(0, 60)}{material.text.length > 60 ? '...' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No source materials added yet. Use the microphone button to add some!
                  </p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sources" className="p-4">
            <div className="min-h-[300px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Source Materials</h3>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="h-3 w-3" /> Add Source
                </Button>
              </div>
              
              {sourceMaterials.length > 0 ? (
                <div className="space-y-3">
                  {sourceMaterials.map(material => (
                    <div key={material.id} className="border rounded-md p-3 bg-white">
                      <p className="text-sm">{material.text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Added {material.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] border border-dashed rounded-md p-4">
                  <FileText className="h-10 w-10 text-muted-foreground opacity-30 mb-2" />
                  <p className="text-muted-foreground text-sm">No source materials added yet.</p>
                  <p className="text-muted-foreground text-xs">Use the microphone button to add sources via voice</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-secondary/20 py-2 px-4">
        <p className="text-xs text-muted-foreground">
          This is a simulation for demonstration purposes
        </p>
      </CardFooter>
    </Card>
  );
});

NotebookSimulator.displayName = 'NotebookSimulator';

export default NotebookSimulator;
