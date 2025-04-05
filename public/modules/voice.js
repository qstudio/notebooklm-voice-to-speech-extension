
// Voice recognition functionality for Google NotebookLM
import { createRecorderUI, addTextToNotebook, updateRecordingState } from './ui.js';

/**
 * Starts the voice recognition process
 * @returns {void}
 */
export function startVoiceRecognition() {
  // Check if browser supports speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition is not supported in your browser. Please try using Chrome.');
    return;
  }
  
  // Get user's preferred language from settings
  chrome.storage.local.get(['voiceSettings'], (result) => {
    const settings = result.voiceSettings || { language: 'en-US' };
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = settings.language;
    
    // Create UI for recording
    const recorderUI = createRecorderUI();
    document.body.appendChild(recorderUI.element);
    
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
    
    // Start recording
    recognition.start();
    updateRecordingState(recorderUI, true);
    
    // Set up button handlers
    recorderUI.recordButton.onclick = () => {
      if (recorderUI.recordButton.textContent === 'Stop Recording') {
        recognition.stop();
        updateRecordingState(recorderUI, false);
      } else {
        recognition.start();
        updateRecordingState(recorderUI, true);
      }
    };
    
    recorderUI.addButton.onclick = () => {
      const text = recorderUI.textarea.value.trim();
      if (text) {
        // Try to add the text to the notebook
        addTextToNotebook(text);
        recorderUI.element.remove();
      }
    };
    
    recorderUI.cancelButton.onclick = () => {
      recognition.stop();
      recorderUI.element.remove();
    };
  });
}

