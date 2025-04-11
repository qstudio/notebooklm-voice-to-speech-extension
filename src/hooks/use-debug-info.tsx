
import { useState, useCallback } from 'react';

export function useDebugInfo() {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Add debug information with timestamp
  const addDebugInfo = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `${timestamp}: ${message}`]);
  }, []);

  // Clear debug logs
  const clearDebugInfo = useCallback(() => {
    setDebugInfo([]);
  }, []);

  return {
    debugInfo,
    addDebugInfo,
    clearDebugInfo
  };
}
