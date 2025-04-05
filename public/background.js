
// Voice Scribe for Google Notebook - Background Script

// Set up initial state
chrome.runtime.onInstalled.addListener(() => {
  console.log('Voice Scribe for Google Notebook extension installed');
  
  // You could set default options here
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
  // Handle adding source material
  if (request.action === "addSourceMaterial") {
    // If the request comes from popup, forward it to the active tab
    if (!sender.tab) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes('notebook.google.com')) {
          chrome.tabs.sendMessage(tabs[0].id, request, (response) => {
            sendResponse(response);
          });
          return true; // Indicates we want to send a response asynchronously
        } else {
          sendResponse({ status: "error", message: "No Google Notebook tab found" });
        }
      });
      return true; // Indicates we want to send a response asynchronously
    }
    // If it's already from content script, handle it here
    sendResponse({ status: "received" });
  }
});

// Listen for tab updates to inject our content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('notebook.google.com')) {
    // We could check if our content script is already running
    // and only inject if needed
    chrome.tabs.sendMessage(tabId, { action: "checkPresence" }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not running, force inject
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['content.js']
        });
      }
    });
  }
});
