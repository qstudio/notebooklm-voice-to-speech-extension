
// Voice recognition setup for Google NotebookLM

/**
 * Creates and initializes a speech recognition instance
 * @param {string} language - The language to use for recognition
 * @returns {SpeechRecognition} Initialized recognition instance
 */
function createSpeechRecognition(language = 'en-US') {
  // Initialize speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure basic properties
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = language;
  
  return recognition;
}

/**
 * Sets up the event handlers for speech recognition
 * @param {SpeechRecognition} recognition - Speech recognition instance
 * @param {Object} recorderUI - The recorder UI elements
 * @returns {void}
 */
function setupRecognitionEvents(recognition, recorderUI) {
  // Set up recognition events
  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    recorderUI.textarea.value = transcript;
  };
  
  recognition.onend = () => {
    if (typeof updateRecordingState === 'function') {
      updateRecordingState(recorderUI, false);
    } else {
      console.error('updateRecordingState function not available');
      // Fallback update of recording state
      if (recorderUI.recordButton) {
        recorderUI.recordButton.textContent = 'Start Recording';
        recorderUI.recordButton.classList.remove('recording');
      }
      if (recorderUI.recordingIndicator) {
        recorderUI.recordingIndicator.style.display = 'none';
      }
    }
  };
  
  recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    alert(`Speech recognition error: ${event.error}`);
    recorderUI.element.remove();
  };
}

// Make functions globally available
window.createSpeechRecognition = createSpeechRecognition;
window.setupRecognitionEvents = setupRecognitionEvents;
