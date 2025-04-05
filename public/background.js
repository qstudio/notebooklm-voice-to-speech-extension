
// Voice to Text for Google NotebookLM - Background Script

// Set up initial state
chrome.runtime.onInstalled.addListener(() => {
  console.log('Voice to Text for Google NotebookLM extension installed');
  
  // Set default options
  chrome.storage.local.set({
    voiceSettings: {
      language: 'en-US',
      autoInsert: false,
      confirmBeforeAdd: true
    }
  });
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  // Handle getting settings
  if (request.action === "getSettings") {
    chrome.storage.local.get(['voiceSettings'], (result) => {
      sendResponse({ 
        status: "success", 
        settings: result.voiceSettings || {
          language: 'en-US',
          autoInsert: false,
          confirmBeforeAdd: true
        }
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

console.log('Voice to Text for Google NotebookLM background script loaded');
