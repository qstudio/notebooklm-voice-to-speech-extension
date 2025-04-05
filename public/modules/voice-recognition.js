
// Voice recognition functionality for Google NotebookLM
import { createRecorderUI, updateRecordingState } from './ui-components.js';
import { addTextToNotebook } from './text-insertion.js';

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
  
  // Create speech recognition instance
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure recognition
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US'; // Default to English
  
  // Create UI
  const recorderUI = createRecorderUI();
  document.body.appendChild(recorderUI.element);
  
  // Set up recognition events
  recognition.onstart = function() {
    console.log('Speech recognition started');
    updateRecordingState(recorderUI, true);
  };
  
  recognition.onend = function() {
    console.log('Speech recognition ended');
    updateRecordingState(recorderUI, false);
  };
  
  recognition.onresult = function(event) {
    console.log('Speech recognition result received');
    
    // Get transcript
    let finalTranscript = '';
    let interimTranscript = '';
    
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      
      if (event.results[i].isFinal) {
        finalTranscript += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    
    // Update textarea
    recorderUI.textarea.value = finalTranscript + interimTranscript;
  };
  
  recognition.onerror = function(event) {
    console.error('Speech recognition error', event.error);
    alert('Speech recognition error: ' + event.error);
    updateRecordingState(recorderUI, false);
  };
  
  // Set up button handlers
  recorderUI.recordButton.onclick = function() {
    if (recorderUI.recordButton.textContent === 'Stop Recording') {
      recognition.stop();
    } else {
      recognition.start();
    }
  };
  
  recorderUI.addButton.onclick = function() {
    const text = recorderUI.textarea.value.trim();
    if (text) {
      addTextToNotebook(text);
      recorderUI.element.remove();
    }
  };
  
  recorderUI.cancelButton.onclick = function() {
    recognition.stop();
    recorderUI.element.remove();
  };
  
  // Start recording
  recognition.start();
  updateRecordingState(recorderUI, true);
}
