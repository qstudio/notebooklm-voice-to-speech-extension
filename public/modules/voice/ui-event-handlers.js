
// Voice recognition UI event handlers for Google NotebookLM

/**
 * Sets up UI button handlers for the voice recorder
 * @param {SpeechRecognition} recognition - Speech recognition instance
 * @param {Object} recorderUI - The recorder UI elements
 * @returns {void}
 */
function setupUIEventHandlers(recognition, recorderUI) {
  // Set up record button
  recorderUI.recordButton.onclick = () => {
    if (recorderUI.recordButton.textContent === 'Stop Recording') {
      recognition.stop();
      
      if (typeof updateRecordingState === 'function') {
        updateRecordingState(recorderUI, false);
      } else {
        // Fallback update of recording state
        recorderUI.recordButton.textContent = 'Start Recording';
        recorderUI.recordButton.classList.remove('recording');
        if (recorderUI.recordingIndicator) {
          recorderUI.recordingIndicator.style.display = 'none';
        }
      }
    } else {
      recognition.start();
      
      if (typeof updateRecordingState === 'function') {
        updateRecordingState(recorderUI, true);
      } else {
        // Fallback update of recording state
        recorderUI.recordButton.textContent = 'Stop Recording';
        recorderUI.recordButton.classList.add('recording');
        if (recorderUI.recordingIndicator) {
          recorderUI.recordingIndicator.style.display = 'inline-block';
        }
      }
    }
  };
  
  // Set up add button
  recorderUI.addButton.onclick = () => {
    const text = recorderUI.textarea.value.trim();
    if (text) {
      // Try to add the text to the notebook
      if (typeof addTextToNotebook === 'function') {
        addTextToNotebook(text);
      } else {
        console.error('addTextToNotebook function not available');
        alert('Could not add text to notebook. The function is not available.');
      }
      recorderUI.element.remove();
    }
  };
  
  // Set up cancel button
  recorderUI.cancelButton.onclick = () => {
    recognition.stop();
    recorderUI.element.remove();
  };
}

// Make function globally available
window.setupUIEventHandlers = setupUIEventHandlers;
