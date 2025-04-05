
// Voice Scribe for Google Notebook - Background Script

// Set up initial state
chrome.runtime.onInstalled.addListener(() => {
  console.log('Voice Scribe for Google Notebook extension installed');
  
  // Set default options
  chrome.storage.local.set({
    voiceScribeSettings: {
      language: 'en-US',
      autoInsert: false,
      confirmBeforeAdd: true
    }
  });
});

// Handle messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
  
  // Handle adding source material
  if (request.action === "addSourceMaterial") {
    // If the request comes from popup, forward it to the active tab
    if (!sender.tab) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes('notebook.google.com')) {
          console.log('Forwarding message to tab:', tabs[0].id);
          chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
            sendResponse(response);
          });
          return true; // Indicates we want to send a response asynchronously
        } else {
          console.log('No Google Notebook tab found');
          sendResponse({ 
            status: "error", 
            message: "No Google Notebook tab found. Please open Google Notebook in a tab." 
          });
        }
      });
      return true; // Indicates we want to send a response asynchronously
    }
    // If it's already from content script, handle it here
    sendResponse({ status: "received" });
  }
  
  // Handle saving settings
  if (request.action === "saveSettings") {
    chrome.storage.local.set({ voiceScribeSettings: request.settings }, () => {
      sendResponse({ status: "saved" });
    });
    return true; // Indicates we want to send a response asynchronously
  }
  
  // Handle getting settings
  if (request.action === "getSettings") {
    chrome.storage.local.get(['voiceScribeSettings'], (result) => {
      sendResponse({ 
        status: "success", 
        settings: result.voiceScribeSettings || {
          language: 'en-US',
          autoInsert: false,
          confirmBeforeAdd: true
        }
      });
    });
    return true; // Indicates we want to send a response asynchronously
  }
});

// Listen for tab updates to inject our content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('notebook.google.com')) {
    console.log('Google Notebook page detected, checking if content script is running');
    
    // Check if our content script is already running
    chrome.tabs.sendMessage(tabId, { action: "checkPresence" }, (response) => {
      if (chrome.runtime.lastError || !response) {
        console.log('Content script not running, injecting now');
        // Content script not running, force inject
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        }).then(() => {
          console.log('Content script injected successfully');
        }).catch(error => {
          console.error('Error injecting content script:', error);
        });
      } else {
        console.log('Content script already running');
      }
    });
  }
});

// Log when the extension is activated
console.log('Voice Scribe for Google Notebook background script activated');
