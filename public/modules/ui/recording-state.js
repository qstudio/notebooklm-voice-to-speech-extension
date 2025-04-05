
/**
 * Update the UI to show recording state
 * @param {Object} recorderUI - The recorder UI elements
 * @param {boolean} isRecording - Whether recording is active
 */
export function updateRecordingState(recorderUI, isRecording) {
  if (isRecording) {
    recorderUI.recordButton.textContent = 'Stop Recording';
    recorderUI.recordButton.classList.add('recording');
    recorderUI.recordingIndicator.style.display = 'inline-block';
  } else {
    recorderUI.recordButton.textContent = 'Start Recording';
    recorderUI.recordButton.classList.remove('recording');
    recorderUI.recordingIndicator.style.display = 'none';
  }
}
