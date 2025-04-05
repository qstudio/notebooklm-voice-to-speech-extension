
// Voice to Text for Google NotebookLM - Content Script

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

// We'll use a script injection approach instead of ES6 imports
function injectScript(file) {
  const script = document.createElement('script');
  script.setAttribute('type', 'module');
  script.setAttribute('src', chrome.runtime.getURL(file));
  document.body.appendChild(script);
  return script;
}

// Inject our main module script
const mainScript = injectScript('modules/core.js');
mainScript.onload = function() {
  // Initialize via window function that our modules will expose
  console.log('Starting Voice to Text for Google NotebookLM extension');
  if (window.VoiceToTextNLM && window.VoiceToTextNLM.initialize) {
    window.VoiceToTextNLM.initialize();
  } else {
    console.error('Voice to Text initialization function not found');
  }
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkContentScript") {
    console.log('Received checkContentScript message, responding with active status');
    sendResponse({ status: "active" });
  }
  return true;
});
