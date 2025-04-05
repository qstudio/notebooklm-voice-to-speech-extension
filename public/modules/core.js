
// Core functionality for Voice to Text for Google NotebookLM

(function() {
  console.log('Core.js script loaded and executing');
  
  /**
   * Main initialization function
   */
  function initializeVoiceToText() {
    console.log('Initializing Voice to Text for Google NotebookLM');
    
    // Send a log message back to content script
    window.postMessage({
      type: 'FROM_PAGE_SCRIPT',
      action: 'logMessage',
      message: 'Voice to Text initialized successfully!'
    }, '*');
    
    // Initialize the DOM observer directly instead of using dynamic import
    if (typeof observeForNotebookUI === 'function') {
      console.log('DOM Observer function found, initializing');
      observeForNotebookUI();
    } else {
      console.error('DOM Observer function not found');
    }
  }
  
  // Listen for messages from content script
  window.addEventListener('message', function(event) {
    // We only accept messages from ourselves
    if (event.source !== window) return;
    
    if (event.data.type && event.data.type === 'FROM_CONTENT_SCRIPT') {
      console.log('Page script received message from content script:', event.data);
      
      if (event.data.action === 'initialize') {
        console.log('Received initialize command from content script');
        initializeVoiceToText();
      }
    }
  });
  
  // Signal that we're ready to the content script
  console.log('Signaling core.js is ready');
  window.postMessage({
    type: 'FROM_PAGE_SCRIPT',
    action: 'logMessage',
    message: 'Core.js loaded and ready!'
  }, '*');
})();
