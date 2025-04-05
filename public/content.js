
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

// We'll use a more reliable script injection approach
function injectScript(file) {
  console.log('Injecting script:', file);
  const script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', chrome.runtime.getURL(file));
  script.onload = function() {
    console.log(`Script ${file} loaded successfully`);
  };
  script.onerror = function(error) {
    console.error(`Error loading script ${file}:`, error);
  };
  document.documentElement.appendChild(script);
  return script;
}

// Create a communication bridge between content script and injected script
window.addEventListener('message', function(event) {
  // We only accept messages from ourselves
  if (event.source !== window) return;
  
  if (event.data.type && event.data.type === 'FROM_PAGE_SCRIPT') {
    console.log('Content script received message from page script:', event.data);
    
    // Handle any requests from the injected script
    if (event.data.action === 'logMessage') {
      console.log('From injected script:', event.data.message);
    }
  }
});

// Inject core.js
const mainScript = injectScript('modules/core.js');

// Send a message to the page after script injection to initialize
setTimeout(() => {
  console.log('Attempting to initialize Voice to Text...');
  window.postMessage({ 
    type: 'FROM_CONTENT_SCRIPT', 
    action: 'initialize' 
  }, '*');
}, 1000);

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkContentScript") {
    console.log('Received checkContentScript message, responding with active status');
    sendResponse({ status: "active" });
  }
  return true;
});
