
// Core functionality for Voice to Text for Google NotebookLM

(function() {
  /**
   * Main initialization function
   */
  function initializeVoiceToText() {
    // Send a log message back to content script
    window.postMessage({
      type: 'FROM_PAGE_SCRIPT',
      action: 'logMessage',
      message: 'Voice to Text initialized successfully!'
    }, '*');
    
    // Wait for all dependencies to be available before initializing
    // This ensures that all functions are loaded in the global scope
    checkDependenciesAndInit();
  }
  
  /**
   * Check if all required dependencies are loaded and initialize
   */
  function checkDependenciesAndInit() {
    const requiredFunctions = [
      'observeForNotebookUI',
      'addSpeakButton',
      'startVoiceRecognitionForDialog'
    ];
    
    const missingFunctions = requiredFunctions.filter(fn => typeof window[fn] !== 'function');
    
    if (missingFunctions.length === 0) {
      window.observeForNotebookUI();
    } else {
      // console.log('Some dependencies are not loaded yet:', missingFunctions);
      setTimeout(checkDependenciesAndInit, 1000);
    }
  }
  
  // Listen for messages from content script
  window.addEventListener('message', function(event) {
    // We only accept messages from ourselves
    if (event.source !== window) return;
    
    if (event.data.type && event.data.type === 'FROM_CONTENT_SCRIPT') {
      if (event.data.action === 'initialize') {
        initializeVoiceToText();
      }
    }
  });
  
  // Signal that we're ready to the content script
  window.postMessage({
    type: 'FROM_PAGE_SCRIPT',
    action: 'logMessage',
    message: 'Core.js loaded and ready!'
  }, '*');
})();
