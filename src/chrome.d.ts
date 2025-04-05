
// Type definitions for Chrome extension API
// This adds support for the chrome namespace in TypeScript

interface Chrome {
  runtime: {
    sendMessage: (message: any, callback?: (response: any) => void) => void;
    onMessage: {
      addListener: (callback: (request: any, sender: any, sendResponse: any) => void) => void;
    };
    lastError?: {
      message: string;
    };
  };
  storage: {
    local: {
      get: (keys: string | string[] | object, callback: (items: any) => void) => void;
      set: (items: object, callback?: () => void) => void;
    };
  };
  tabs: {
    query: (queryInfo: {active?: boolean, currentWindow?: boolean}, callback: (tabs: any[]) => void) => void;
    sendMessage: (tabId: number, message: any, callback?: (response: any) => void) => void;
  };
  scripting?: {
    executeScript: (options: {target: {tabId: number}, files: string[]}) => Promise<any>;
  };
}

declare global {
  interface Window {
    chrome: Chrome;
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
  
  const chrome: Chrome;
}

export {};
