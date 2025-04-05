
// Voice recognition UI event handlers for Google NotebookLM
import { updateRecordingState } from '../ui/recording-state.js';
import { addTextToNotebook } from '../ui/text-insertion.js';

/**
 * Sets up UI button handlers for the voice recorder
 * @param {SpeechRecognition} recognition - Speech recognition instance
 * @param {Object} recorderUI - The recorder UI elements
 * @returns {void}
 */
export function setupUIEventHandlers(recognition, recorderUI) {
  // Set up record button
  recorderUI.recordButton.onclick = () => {
    if (recorderUI.recordButton.textContent === 'Stop Recording') {
      recognition.stop();
      updateRecordingState(recorderUI, false);
    } else {
      recognition.start();
      updateRecordingState(recorderUI, true);
    }
  };
  
  // Set up add button
  recorderUI.addButton.onclick = () => {
    const text = recorderUI.textarea.value.trim();
    if (text) {
      // Try to add the text to the notebook
      addTextToNotebook(text);
      recorderUI.element.remove();
    }
  };
  
  // Set up cancel button
  recorderUI.cancelButton.onclick = () => {
    recognition.stop();
    recorderUI.element.remove();
  };
}
