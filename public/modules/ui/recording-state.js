
// Recording state management for Voice to Text for Google NotebookLM

/**
 * Updates the UI to reflect the current recording state
 * @param {Object} recorderUI - The recorder UI elements
 * @param {boolean} isRecording - Whether recording is active
 * @returns {void}
 */
function updateRecordingState(recorderUI, isRecording) {
  if (!recorderUI || !recorderUI.recordButton) return;
  
  if (isRecording) {
    recorderUI.recordButton.textContent = 'Stop Recording';
    recorderUI.recordButton.classList.add('recording');
    if (recorderUI.recordingIndicator) {
      recorderUI.recordingIndicator.style.display = 'inline-block';
    }
  } else {
    recorderUI.recordButton.textContent = 'Start Recording';
    recorderUI.recordButton.classList.remove('recording');
    if (recorderUI.recordingIndicator) {
      recorderUI.recordingIndicator.style.display = 'none';
    }
  }
}

// Make function globally available
window.updateRecordingState = updateRecordingState;
