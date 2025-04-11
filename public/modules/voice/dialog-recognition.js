// Dialog-specific voice recognition for Google NotebookLM

/**
 * Starts voice recognition specifically for a dialog input field
 * @param {HTMLElement} inputField - The input field to transcribe text into
 * @returns {void}
 */
function startVoiceRecognitionForDialog(inputField) {
  // console.log('Starting voice recognition for dialog input field');
  
  // Check if browser supports speech recognition
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert('Speech recognition is not supported in your browser. Please try using Chrome.');
    return;
  }
  
  // If there's already an active recognition, stop it first
  if (window.currentDialogRecognition) {
    window.currentDialogRecognition.stop();
    window.currentDialogRecognition = null;
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
    
    // Create indicator span using DOM methods instead of innerHTML
    const pulseSpan = document.createElement('span');
    pulseSpan.style.display = 'inline-block';
    pulseSpan.style.width = '12px';
    pulseSpan.style.height = '12px';
    pulseSpan.style.backgroundColor = 'white';
    pulseSpan.style.borderRadius = '50%';
    pulseSpan.style.marginRight = '8px';
    pulseSpan.style.animation = 'pulse 1.5s infinite';
    
    const textNode = document.createTextNode(' Recording...');
    
    recordingIndicator.appendChild(pulseSpan);
    recordingIndicator.appendChild(textNode);
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
    // console.log('Recording indicator added to DOM');
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    // Store the recognition instance globally so it can be stopped later
    window.currentDialogRecognition = recognition;
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Default to English
    
    // Current transcript
    let currentTranscript = '';
    
    // Ensure the event listener is added only once
    recognition.onresult = (event) => {
      currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      // Update the input field with the transcript
      if (inputField && inputField.tagName) {
        if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
          inputField.value = currentTranscript;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else if (inputField.isContentEditable) {
          // Handle contenteditable safely without using innerHTML
          while (inputField.firstChild) {
            inputField.removeChild(inputField.firstChild);
          }
          inputField.appendChild(document.createTextNode(currentTranscript));
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // console.warn('Input field is neither input/textarea nor contenteditable:', inputField);
        }
      } else {
        // console.error('Input field is not valid:', inputField);
      }
    };
    
    recognition.onerror = (event) => {
      // console.error('Recognition error:', event.error);
      alert(`Speech recognition error: ${event.error}`);
      cleanup();
    };
    
    recognition.onend = () => {
      // console.log('Recognition ended');
      cleanup();
    };
    
    // Function to clean up
    function cleanup() {
      // console.log('Cleaning up recognition resources');
      if (window.currentDialogRecognition) {
        window.currentDialogRecognition.onresult = null;
        window.currentDialogRecognition.onerror = null;
        window.currentDialogRecognition.onend = null;
        window.currentDialogRecognition = null;
      }

      if (recordingIndicator && recordingIndicator.parentNode) {
        recordingIndicator.parentNode.removeChild(recordingIndicator);
      }
      
      if (inputField) {
        inputField.removeAttribute('data-speech-target');
      }
    }
    
    // Stop button handler
    stopButton.addEventListener('click', () => {
      // console.log('Stop button clicked');
      recognition.stop();
    });
    
    // Add event listeners to Insert and Cancel buttons
    setTimeout(() => {
      const dialog = document.querySelector('mat-dialog-container[role="dialog"]');
      if (dialog) {
        // Find the Insert button
        const insertButton = Array.from(dialog.querySelectorAll('button')).find(button => {
          const text = button.textContent.trim();
          return text === 'Insert' || text === 'Add';
        });
        
        if (insertButton) {
          // console.log('Found Insert button, adding stop recognition event');
          insertButton.addEventListener('click', function() {
            // console.log('Insert button clicked, stopping recognition');
            if (window.currentDialogRecognition) {
              window.currentDialogRecognition.stop();
            }
          });
        }
        
        // Find the Cancel button
        const cancelButton = Array.from(dialog.querySelectorAll('button')).find(button => {
          const text = button.textContent.trim();
          return text === 'Cancel';
        });
        
        if (cancelButton) {
          // console.log('Found Cancel button, adding stop recognition event');
          cancelButton.addEventListener('click', function() {
            // console.log('Cancel button clicked, stopping recognition');
            if (window.currentDialogRecognition) {
              window.currentDialogRecognition.stop();
            }
          });
        }
      }
    }, 500);
    
    // First request microphone permission explicitly
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        // console.log('Microphone permission granted');
        
        // Close the stream immediately as we don't need it, just the permission
        stream.getTracks().forEach(track => track.stop());
        
        // Start recording after permission is granted
        recognition.start();
        // console.log('Recognition started after permission granted');
      })
      .catch(err => {
        // console.error('Microphone permission denied:', err);
        alert('You need to allow microphone access for voice recognition to work.');
        cleanup();
      });
    
  } catch (error) {
    // console.error('Error initializing dialog voice recognition:', error);
    alert('Failed to start voice recognition: ' + error.message);
  }
}

// Make the function globally available immediately
window.startVoiceRecognitionForDialog = startVoiceRecognitionForDialog;
