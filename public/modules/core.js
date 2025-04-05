
// Core functionality for Voice to Text for Google NotebookLM

(function() {
  console.log('Core.js script loaded and executing');
  
  // Import all necessary functionality from modular files
  import('./dom-observer.js')
    .then(module => {
      window.VoiceToTextNLM = {
        observeForNotebookUI: module.observeForNotebookUI
      };
      console.log('DOM Observer module loaded successfully');
    })
    .catch(error => {
      console.error('Error loading DOM Observer module:', error);
    });
  
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
    
    // Use the imported function if available
    if (window.VoiceToTextNLM && window.VoiceToTextNLM.observeForNotebookUI) {
      window.VoiceToTextNLM.observeForNotebookUI();
    } else {
      console.error('Voice to Text initialization function not found!');
      
      // Try to import the module again as a fallback
      import('./dom-observer.js')
        .then(module => {
          console.log('DOM Observer module loaded as fallback');
          module.observeForNotebookUI();
        })
        .catch(error => {
          console.error('Failed to load DOM Observer module as fallback:', error);
        });
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
