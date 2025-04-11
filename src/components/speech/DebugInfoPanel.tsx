
import React, { useRef, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface DebugInfoPanelProps {
  debugInfo: string[];
  onClearLogs: () => void;
}

const DebugInfoPanel: React.FC<DebugInfoPanelProps> = ({ debugInfo, onClearLogs }) => {
  // Ref to auto-scroll debug info
  const debugContainerRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll debug info
  useEffect(() => {
    if (debugContainerRef.current) {
      debugContainerRef.current.scrollTop = debugContainerRef.current.scrollHeight;
    }
  }, [debugInfo]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">Debug Information</CardTitle>
          <CardDescription>
            Real-time logs to debug recognition issues
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearLogs}
          disabled={debugInfo.length === 0}
        >
          Clear Logs
        </Button>
      </CardHeader>
      <CardContent>
        <div 
          ref={debugContainerRef}
          className="bg-muted p-2 rounded text-xs font-mono h-[350px] overflow-auto"
        >
          {debugInfo.length > 0 ? (
            <ul className="space-y-1">
              {debugInfo.map((info, index) => (
                <li key={index} className="border-b border-muted-foreground/20 pb-1">
                  {info}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <Info className="mr-2 h-4 w-4" /> No logs yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfoPanel;
