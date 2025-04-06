
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
    console.log('Recording indicator added to DOM');
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Default to English
    
    // Try to get user's preferred language if available
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['voiceSettings'], (result) => {
        if (result && result.voiceSettings && result.voiceSettings.language) {
          recognition.lang = result.voiceSettings.language;
          console.log('Using speech recognition language:', recognition.lang);
        }
      });
    }
    
    // Current transcript
    let currentTranscript = '';
    
    // Event handlers
    recognition.onstart = () => {
      console.log('Recognition started');
    };
    
    recognition.onresult = (event) => {
      console.log('Recognition result received', event);
      currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      console.log('Current transcript:', currentTranscript);
      
      // Update the input field with the transcript
      if (inputField && inputField.tagName) {
        if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
          inputField.value = currentTranscript;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // Handle contenteditable
          inputField.innerHTML = currentTranscript;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        }
      } else {
        console.error('Input field is not valid:', inputField);
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
      console.log('Cleaning up recognition resources');
      if (recordingIndicator && recordingIndicator.parentNode) {
        recordingIndicator.parentNode.removeChild(recordingIndicator);
      }
      
      if (inputField) {
        inputField.removeAttribute('data-speech-target');
      }
    }
    
    // Stop button handler
    stopButton.addEventListener('click', () => {
      console.log('Stop button clicked');
      recognition.stop();
    });
    
    // First request microphone permission explicitly
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('Microphone permission granted');
        
        // Close the stream immediately as we don't need it, just the permission
        stream.getTracks().forEach(track => track.stop());
        
        // Start recording after permission is granted
        recognition.start();
        console.log('Recognition started after permission granted');
      })
      .catch(err => {
        console.error('Microphone permission denied:', err);
        alert('You need to allow microphone access for voice recognition to work.');
        cleanup();
      });
    
  } catch (error) {
    console.error('Error initializing dialog voice recognition:', error);
    alert('Failed to start voice recognition: ' + error.message);
  }
}

// Make the function globally available immediately
window.startVoiceRecognitionForDialog = startVoiceRecognitionForDialog;
