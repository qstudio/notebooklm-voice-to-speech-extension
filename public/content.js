
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
  
  .recording-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #ea4335;
    border-radius: 50%;
    margin-right: 8px;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(style);

// Inject script with better error handling
function injectScript(file) {
  return new Promise((resolve, reject) => {
    console.log('Injecting script:', file);
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL(file));
    
    script.onload = function() {
      console.log(`Script ${file} loaded successfully`);
      resolve(file);
    };
    
    script.onerror = function(error) {
      console.error(`Error loading script ${file}:`, error);
      reject(error);
    };
    
    document.documentElement.appendChild(script);
  });
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

// Sequentially inject scripts
async function injectAllScripts() {
  try {
    // Inject the main module script first
    await injectScript('modules/core.js');
    console.log('All scripts injected successfully');
    
    // Initialize Voice to Text
    setTimeout(() => {
      console.log('Initializing Voice to Text...');
      window.postMessage({ 
        type: 'FROM_CONTENT_SCRIPT', 
        action: 'initialize' 
      }, '*');
    }, 500);
  } catch (error) {
    console.error('Error injecting scripts:', error);
  }
}

// Start injecting scripts
injectAllScripts();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkContentScript") {
    console.log('Received checkContentScript message, responding with active status');
    sendResponse({ status: "active" });
  }
  return true;
});
