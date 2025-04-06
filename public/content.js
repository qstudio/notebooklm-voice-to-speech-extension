// Voice to Text for Google NotebookLM - Content Script

// console.log('Voice to Text for Google NotebookLM content script loaded');

// Add some basic styles
const style = document.createElement('style');
style.textContent = `
  .voice-to-text-button {
    background: none;
    border: none;
    cursor: pointer;
    margin: 8px 0;
    display: block;
    width: 100%;
  }
  
  .voice-to-text-speak-button {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    padding: 8px 16px;
    background-color: #f1f3f4;
    color: #5f6368;
    border-radius: 4px;
    border: none;
    font-family: 'Google Sans', Arial, sans-serif;
    font-size: 14px;
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
  
  .dialog-recording-indicator span {
    animation: pulse 1.5s infinite;
  }
  
  .dialog-recording-indicator {
    z-index: 10000 !important; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;
document.head.appendChild(style);

// Inject script with better error handling
function injectScript(file) {
  return new Promise((resolve, reject) => {
    // console.log('Injecting script:', file);
    const script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.runtime.getURL(file));
    
    script.onload = function() {
      // console.log(`Script ${file} loaded successfully`);
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
    // console.log('Content script received message from page script:', event.data);
    
    // Handle any requests from the injected script
    if (event.data.action === 'logMessage') {
      // console.log('From injected script:', event.data.message);
    }
    
    // Relay messages to background script if needed
    if (event.data.action === 'relayToBackground') {
      chrome.runtime.sendMessage(event.data.message)
        .then(response => {
          // console.log('Background response:', response);
          // Relay back to page script if needed
          window.postMessage({
            type: 'FROM_CONTENT_SCRIPT',
            action: 'backgroundResponse',
            data: response
          }, '*');
        })
        .catch(error => {
          console.error('Error sending message to background:', error);
        });
    }
  }
});

// Sequentially inject scripts in the correct order
async function injectAllScripts() {
  try {
    // First inject utility modules
    await injectScript('modules/dom-utils.js');
    
    // Then inject UI modules
    await injectScript('modules/ui/recording-state.js');
    await injectScript('modules/ui/buttons.js');
    await injectScript('modules/ui/text-insertion.js');
    await injectScript('modules/ui/recorder-dialog.js');
    
    // Then inject voice modules (important order)
    await injectScript('modules/voice/dialog-recognition.js');
    await injectScript('modules/voice/recognition-setup.js');
    await injectScript('modules/voice/ui-event-handlers.js');
    await injectScript('modules/voice/index.js');
    
    // Then inject DOM observer
    await injectScript('modules/dom-observer.js');
    
    // Finally inject the main module script
    await injectScript('modules/core.js');
    
    // console.log('All scripts injected successfully');
    
    // Ensure initialization is triggered after scripts are loaded
    setTimeout(() => {
      // console.log('Initializing Voice to Text...');
      window.postMessage({ 
        type: 'FROM_CONTENT_SCRIPT', 
        action: 'initialize' 
      }, '*');
    }, 2500); // Increased timeout to ensure all scripts are fully processed
  } catch (error) {
    console.error('Error injecting scripts:', error);
  }
}

// Start injecting scripts when the DOM is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  injectAllScripts();
} else {
  document.addEventListener('DOMContentLoaded', injectAllScripts);
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkContentScript") {
    // console.log('Received checkContentScript message, responding with active status');
    sendResponse({ status: "active" });
  }
  return true;
});
