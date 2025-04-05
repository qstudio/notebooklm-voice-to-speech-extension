
// Core functionality for Voice to Text for Google NotebookLM

// Import functionality from our modules
import { observeForNotebookUI, logCurrentDOM } from './dom-observer.js';
import { startVoiceRecognition } from './voice-recognition.js';

// Create a global namespace for our extension
window.VoiceToTextNLM = {};

/**
 * Main initialization function
 */
function initializeVoiceToText() {
  console.log('Initializing Voice to Text for Google NotebookLM');
  
  // Look for notebook UI elements and inject our voice button
  observeForNotebookUI();
}

// Make sure initialize is exposed to the window object
window.VoiceToTextNLM.initialize = initializeVoiceToText;

// Also expose the startVoiceRecognition function for direct access
window.VoiceToTextNLM.startVoiceRecognition = startVoiceRecognition;
