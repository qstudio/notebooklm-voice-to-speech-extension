
// Main voice recognition module for Google NotebookLM

/**
 * Starts the voice recognition process
 * @returns {void}
 */
function startVoiceRecognition() {
  console.log('Starting voice recognition');
  
  // Check if browser supports speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition is not supported in your browser. Please try using Chrome.');
    return;
  }
  
  // Get user's preferred language from settings or use default
  chrome.storage.local.get(['voiceSettings'], (result) => {
    const settings = result.voiceSettings || { language: 'en-US' };
    console.log('Using speech recognition language:', settings.language);
    
    try {
      // Check if all required functions are available
      if (typeof createRecorderUI !== 'function') {
        throw new Error('createRecorderUI function not available');
      }
      
      if (typeof createSpeechRecognition !== 'function') {
        throw new Error('createSpeechRecognition function not available');
      }
      
      if (typeof setupRecognitionEvents !== 'function') {
        throw new Error('setupRecognitionEvents function not available');
      }
      
      if (typeof setupUIEventHandlers !== 'function') {
        throw new Error('setupUIEventHandlers function not available');
      }
      
      if (typeof updateRecordingState !== 'function') {
        throw new Error('updateRecordingState function not available');
      }
      
      // Initialize speech recognition
      const recognition = createSpeechRecognition(settings.language);
      
      // Create UI for recording
      const recorderUI = createRecorderUI();
      document.body.appendChild(recorderUI.element);
      
      // Set up recognition events
      setupRecognitionEvents(recognition, recorderUI);
      
      // Set up button handlers
      setupUIEventHandlers(recognition, recorderUI);
      
      // Start recording
      recognition.start();
      updateRecordingState(recorderUI, true);
    } catch (error) {
      console.error('Error initializing voice recognition:', error);
      alert('Failed to start voice recognition: ' + error.message);
    }
  });
}

// Make the dialog-specific function available globally
const startVoiceRecognitionForDialog = window.startVoiceRecognitionForDialog || function() {
  console.error('startVoiceRecognitionForDialog not yet loaded');
  alert('Speech recognition is still loading. Please try again in a moment.');
};

// Make functions globally available
window.startVoiceRecognition = startVoiceRecognition;
window.startVoiceRecognitionForDialog = startVoiceRecognitionForDialog;
