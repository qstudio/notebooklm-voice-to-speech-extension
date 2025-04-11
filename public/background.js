
// Voice to Text for Google NotebookLM - Background Script

// Set up initial state
chrome.runtime.onInstalled.addListener(() => {
  // Get browser's language or use default
  const browserLanguage = navigator.language || 'en-US';
  
  // Set default options
  chrome.storage.local.set({
    voiceSettings: {
      language: browserLanguage
    }
  });
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle getting settings
  if (request.action === "getSettings") {
    chrome.storage.local.get(['voiceSettings'], (result) => {
      // If no settings found, use browser's language
      const settings = result.voiceSettings || {
        language: navigator.language || 'en-US'
      };
      
      sendResponse({ 
        status: "success", 
        settings: settings
      });
    });
    return true; // Keep the message channel open for async response
  }
  
  // Handle saving settings
  if (request.action === "saveSettings") {
    chrome.storage.local.set({ voiceSettings: request.settings }, () => {
      sendResponse({ status: "saved" });
    });
    return true; // Keep the message channel open for async response
  }
});
