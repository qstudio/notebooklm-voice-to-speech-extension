
// Main voice recognition module for Google NotebookLM
import { createRecorderUI } from '../ui/recorder-dialog.js';
import { updateRecordingState } from '../ui/recording-state.js';
import { createSpeechRecognition, setupRecognitionEvents } from './recognition-setup.js';
import { setupUIEventHandlers } from './ui-event-handlers.js';

/**
 * Starts the voice recognition process
 * @returns {void}
 */
export function startVoiceRecognition() {
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
      alert('Failed to start voice recognition. Please try again.');
    }
  });
}
