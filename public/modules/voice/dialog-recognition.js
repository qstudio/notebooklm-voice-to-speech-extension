
// Dialog-specific voice recognition for Google NotebookLM

/**
 * Starts voice recognition specifically for a dialog input field
 * @param {HTMLElement} inputField - The input field to transcribe text into
 * @returns {void}
 */
function startVoiceRecognitionForDialog(inputField) {
  console.log('Starting voice recognition for dialog input field');
  
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
      // Create a simplified UI indicator for recording
      const recordingIndicator = document.createElement('div');
      recordingIndicator.className = 'dialog-recording-indicator';
      recordingIndicator.style.position = 'fixed';
      recordingIndicator.style.top = '10px';
      recordingIndicator.style.right = '10px';
      recordingIndicator.style.padding = '10px';
      recordingIndicator.style.background = 'rgba(234, 67, 53, 0.9)';
      recordingIndicator.style.color = 'white';
      recordingIndicator.style.borderRadius = '4px';
      recordingIndicator.style.zIndex = '10000';
      recordingIndicator.innerHTML = '<span style="display: inline-block; width: 12px; height: 12px; background-color: white; border-radius: 50%; margin-right: 8px; animation: pulse 1.5s infinite;"></span> Recording...';
      recordingIndicator.style.fontFamily = 'Google Sans, Arial, sans-serif';
      recordingIndicator.style.fontSize = '14px';
      
      // Add a stop button to the indicator
      const stopButton = document.createElement('button');
      stopButton.textContent = 'Stop';
      stopButton.style.marginLeft = '10px';
      stopButton.style.background = 'white';
      stopButton.style.color = '#ea4335';
      stopButton.style.border = 'none';
      stopButton.style.borderRadius = '4px';
      stopButton.style.padding = '4px 8px';
      stopButton.style.cursor = 'pointer';
      recordingIndicator.appendChild(stopButton);
      
      document.body.appendChild(recordingIndicator);
      
      // Initialize speech recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // Configure recognition
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = settings.language;
      
      // Current transcript
      let currentTranscript = '';
      
      // Event handlers
      recognition.onresult = (event) => {
        currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        
        // Update the input field with the transcript
        if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
          inputField.value = currentTranscript;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // Handle contenteditable
          inputField.innerHTML = currentTranscript;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        alert(`Speech recognition error: ${event.error}`);
        cleanup();
      };
      
      recognition.onend = () => {
        console.log('Recognition ended');
        cleanup();
      };
      
      // Function to clean up
      function cleanup() {
        if (recordingIndicator && recordingIndicator.parentNode) {
          recordingIndicator.parentNode.removeChild(recordingIndicator);
        }
        
        if (inputField) {
          inputField.removeAttribute('data-speech-target');
        }
      }
      
      // Stop button handler
      stopButton.addEventListener('click', () => {
        recognition.stop();
      });
      
      // Start recording
      recognition.start();
      
    } catch (error) {
      console.error('Error initializing dialog voice recognition:', error);
      alert('Failed to start voice recognition: ' + error.message);
    }
  });
}

// Make the function globally available
window.startVoiceRecognitionForDialog = startVoiceRecognitionForDialog;
