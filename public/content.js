
// Voice to Text for Google NotebookLM - Content Script
import { initializeVoiceToText } from './modules/core.js';

console.log('Voice to Text for Google NotebookLM content script loaded');

// Add some basic styles
const style = document.createElement('style');
style.textContent = `
  .voice-to-text-button {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .voice-to-text-speak-button:hover {
    background-color: #e8eaed;
  }
  
  .record-button.recording {
    background: #ea4335 !important;
  }
`;
document.head.appendChild(style);

// Start the extension
console.log('Starting Voice to Text for Google NotebookLM extension');
initializeVoiceToText();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkContentScript") {
    console.log('Received checkContentScript message, responding with active status');
    sendResponse({ status: "active" });
  }
  return true;
});
