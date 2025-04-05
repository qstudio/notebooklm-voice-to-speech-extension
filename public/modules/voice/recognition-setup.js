
// Voice recognition setup for Google NotebookLM
import { updateRecordingState } from '../ui/recording-state.js';

/**
 * Creates and initializes a speech recognition instance
 * @param {string} language - The language to use for recognition
 * @returns {SpeechRecognition} Initialized recognition instance
 */
export function createSpeechRecognition(language = 'en-US') {
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
export function setupRecognitionEvents(recognition, recorderUI) {
  // Set up recognition events
  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    recorderUI.textarea.value = transcript;
  };
  
  recognition.onend = () => {
    updateRecordingState(recorderUI, false);
  };
  
  recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    alert(`Speech recognition error: ${event.error}`);
    recorderUI.element.remove();
  };
}
