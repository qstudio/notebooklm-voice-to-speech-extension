
// UI Components for Voice to Text for Google NotebookLM
import { startVoiceRecognition } from './voice-recognition.js';

/**
 * Creates and returns UI for the voice recorder
 * @returns {Object} Object containing UI elements
 */
export function createRecorderUI() {
  const element = document.createElement('div');
  element.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    z-index: 10000;
    width: 400px;
    max-width: 90vw;
    font-family: 'Google Sans', Arial, sans-serif;
  `;
  
  element.innerHTML = `
    <h3 style="margin-top: 0; font-size: 16px; display: flex; align-items: center;">
      <span class="recording-indicator" style="display: none;"></span>
      Voice to Text
    </h3>
    <textarea style="width: 100%; height: 120px; margin: 12px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: none;" 
              placeholder="Speak now..."></textarea>
    <div style="display: flex; justify-content: space-between;">
      <button class="record-button" style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Start Recording
      </button>
      <div>
        <button class="cancel-button" style="background: #f1f3f4; color: #5f6368; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
          Cancel
        </button>
        <button class="add-button" style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Add Text
        </button>
      </div>
    </div>
  `;
  
  return {
    element: element,
    textarea: element.querySelector('textarea'),
    recordButton: element.querySelector('.record-button'),
    addButton: element.querySelector('.add-button'),
    cancelButton: element.querySelector('.cancel-button'),
    recordingIndicator: element.querySelector('.recording-indicator')
  };
}

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

/**
 * Add a "Speak text" button next to the Insert button
 * @param {Element} insertButton - The insert button
 * @returns {void}
 */
export function addSpeakButton(insertButton) {
  if (!insertButton || document.querySelector('.voice-to-text-speak-button')) {
    return;
  }
  
  const parentElement = insertButton.parentElement;
  if (!parentElement) {
    console.log('Cannot find parent element of Insert button');
    return;
  }
  
  console.log('Adding Speak text button next to:', insertButton);
  
  const speakButton = document.createElement('button');
  speakButton.className = 'voice-to-text-speak-button';
  speakButton.setAttribute('aria-label', 'Speak text');
  speakButton.style.cssText = `
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    padding: 8px 16px;
    background-color: #f1f3f4;
    color: #5f6368;
    border-radius: 4px;
    border: none;
    font-family: 'Google Sans', Arial, sans-serif;
    font-size: 14px;
    cursor: pointer;
  `;
  
  speakButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
    Speak text
  `;
  
  speakButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Speak text button clicked');
    startVoiceRecognition();
  });
  
  // Insert after the insert button
  insertButton.insertAdjacentElement('afterend', speakButton);
  console.log('Speak text button added successfully');
}

/**
 * Inject voice button into the NotebookLM UI
 * @param {Element} targetElement - The target element to inject the button into
 * @returns {void}
 */
export function injectVoiceButton(targetElement) {
  // Create a button element
  const voiceButton = document.createElement('button');
  voiceButton.className = 'voice-to-text-button';
  voiceButton.innerHTML = `
    <span style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; background: #f1f3f4; margin: 8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" x2="12" y1="19" y2="22"></line>
      </svg>
      Voice to Text
    </span>
  `;
  
  // Add click event listener
  voiceButton.addEventListener('click', () => {
    console.log('Voice to Text button clicked');
    startVoiceRecognition();
  });
  
  // Add to page
  targetElement.appendChild(voiceButton);
  console.log('Voice button injected successfully');
}
