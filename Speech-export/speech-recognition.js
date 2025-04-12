
/**
 * Speech Recognition Standalone Implementation
 * A framework-independent implementation of speech-to-text functionality.
 */

document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const languageSelect = document.getElementById('language');
  const transcriptionTextarea = document.getElementById('transcription');
  const toggleRecordingButton = document.getElementById('toggleRecording');
  const clearTranscriptionButton = document.getElementById('clearTranscription');
  const copyTranscriptionButton = document.getElementById('copyTranscription');
  const debugLogs = document.getElementById('debugLogs');
  const clearLogsButton = document.getElementById('clearLogs');

  // State
  let isListening = false;
  let recognition = null;
  let currentCursorPosition = 0;
  let isInitialRecording = true;
  let previousTranscript = '';

  // Debug logging
  function addDebugInfo(message) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false });
    const logEntry = document.createElement('div');
    logEntry.className = 'debug-log-entry';
    
    const timeSpan = document.createElement('span');
    timeSpan.className = 'debug-log-time';
    timeSpan.textContent = `[${timeString}]`;
    
    logEntry.appendChild(timeSpan);
    logEntry.appendChild(document.createTextNode(' ' + message));
    
    debugLogs.appendChild(logEntry);
    debugLogs.scrollTop = debugLogs.scrollHeight;
  }

  // Clear debug logs
  function clearDebugLogs() {
    debugLogs.innerHTML = '';
    addDebugInfo('Debug logs cleared');
  }

  // Check browser support for speech recognition
  function checkBrowserSupport() {
    const hasRecognitionSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    
    if (hasRecognitionSupport) {
      addDebugInfo('Speech recognition is supported in this browser');
      return true;
    } else {
      addDebugInfo('Speech recognition is NOT supported in this browser');
      alert('Your browser does not support the Web Speech API. Please try using Chrome, Edge, or Safari.');
      toggleRecordingButton.disabled = true;
      return false;
    }
  }

  // Initialize speech recognition
  function initializeSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure recognition settings
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = languageSelect.value;
    
    // Set up event handlers
    recognition.onresult = handleRecognitionResult;
    recognition.onerror = handleRecognitionError;
    recognition.onend = handleRecognitionEnd;
    
    addDebugInfo(`Speech recognition initialized with language: ${recognition.lang}`);
  }

  // Handle speech recognition results
  function handleRecognitionResult(event) {
    if (event.results.length > 0) {
      const current = event.results[event.results.length - 1];
      if (current.isFinal) {
        const currentText = current[0].transcript.trim();
        previousTranscript = currentText;
        
        if (isInitialRecording || transcriptionTextarea.value.length === 0) {
          // Replace entire content for initial recording
          transcriptionTextarea.value = currentText;
          addDebugInfo(`Transcript updated (initial): "${truncateText(currentText, 30)}"`);
        } else {
          // Insert at cursor position for subsequent recordings
          const beforeCursor = transcriptionTextarea.value.substring(0, currentCursorPosition);
          const afterCursor = transcriptionTextarea.value.substring(currentCursorPosition);
          
          // Combine text: text before cursor + new transcript + text after cursor
          transcriptionTextarea.value = beforeCursor + currentText + afterCursor;
          
          // Calculate new cursor position (after the newly inserted text)
          currentCursorPosition += currentText.length;
          
          // Update textarea cursor position
          updateTextareaCursor();
          
          addDebugInfo(`Transcript updated (append): "${truncateText(currentText, 30)}"`);
        }
      }
    }
  }

  // Handle speech recognition errors
  function handleRecognitionError(event) {
    let errorMessage = 'Unknown speech recognition error';
    
    switch(event.error) {
      case 'no-speech':
        errorMessage = 'No speech was detected. Please try again.';
        break;
      case 'aborted':
        errorMessage = 'Speech recognition was aborted.';
        break;
      case 'audio-capture':
        errorMessage = 'No microphone was found or microphone is not working.';
        break;
      case 'network':
        errorMessage = 'Network error occurred. Please check your connection.';
        break;
      case 'not-allowed':
        errorMessage = 'Microphone permission was denied. Please allow microphone access.';
        break;
      case 'service-not-allowed':
        errorMessage = 'The speech recognition service is not allowed.';
        break;
      case 'bad-grammar':
        errorMessage = 'There was an error with the speech grammar.';
        break;
      case 'language-not-supported':
        errorMessage = 'The language is not supported.';
        break;
    }
    
    addDebugInfo(`Error: ${errorMessage}`);
    updateRecordingState(false);
  }

  // Handle speech recognition ending
  function handleRecognitionEnd() {
    addDebugInfo('Speech recognition ended');
    updateRecordingState(false);
  }

  // Start speech recognition
  function startListening() {
    if (!recognition) {
      initializeSpeechRecognition();
    } else {
      // Update language setting
      recognition.lang = languageSelect.value;
    }
    
    // Focus the textarea and save cursor position
    transcriptionTextarea.focus();
    currentCursorPosition = transcriptionTextarea.selectionStart;
    isInitialRecording = transcriptionTextarea.value.length === 0;
    previousTranscript = '';
    
    try {
      recognition.start();
      updateRecordingState(true);
      addDebugInfo(`Recording started with language: ${languageSelect.value} at cursor position: ${currentCursorPosition}`);
    } catch (error) {
      addDebugInfo(`Error starting recognition: ${error.message}`);
      alert(`Error starting speech recognition: ${error.message}`);
    }
  }

  // Stop speech recognition
  function stopListening() {
    if (recognition) {
      recognition.stop();
      addDebugInfo('Recording stopped manually');
    }
  }

  // Toggle recording state
  function toggleRecording() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }

  // Update recording state UI
  function updateRecordingState(listening) {
    isListening = listening;
    
    if (isListening) {
      toggleRecordingButton.classList.add('recording');
      toggleRecordingButton.innerHTML = '<span class="recording-indicator"></span> Stop Recording';
    } else {
      toggleRecordingButton.classList.remove('recording');
      toggleRecordingButton.innerHTML = '<span class="mic-icon">🎤</span> Start Recording';
    }
  }

  // Clear transcription
  function clearTranscription() {
    transcriptionTextarea.value = '';
    previousTranscript = '';
    isInitialRecording = true;
    addDebugInfo('Transcription cleared');
  }

  // Copy transcription to clipboard
  function copyTranscription() {
    if (transcriptionTextarea.value) {
      navigator.clipboard.writeText(transcriptionTextarea.value)
        .then(() => {
          addDebugInfo('Text copied to clipboard');
          alert('Text copied to clipboard');
        })
        .catch(err => {
          addDebugInfo(`Failed to copy: ${err}`);
          alert('Failed to copy text to clipboard');
        });
    } else {
      addDebugInfo('Nothing to copy');
    }
  }

  // Update textarea cursor position
  function updateTextareaCursor() {
    setTimeout(() => {
      transcriptionTextarea.focus();
      transcriptionTextarea.setSelectionRange(currentCursorPosition, currentCursorPosition);
    }, 0);
  }

  // Handle textarea interaction
  function handleTextareaInteraction() {
    if (isListening) {
      stopListening();
      addDebugInfo('Recording stopped due to user interaction with textarea');
    }
    currentCursorPosition = transcriptionTextarea.selectionStart;
  }

  // Save cursor position on selection change
  function handleSelectionChange() {
    currentCursorPosition = transcriptionTextarea.selectionStart;
  }

  // Helper function to truncate text for logging
  function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // Event Listeners
  toggleRecordingButton.addEventListener('click', toggleRecording);
  clearTranscriptionButton.addEventListener('click', clearTranscription);
  copyTranscriptionButton.addEventListener('click', copyTranscription);
  clearLogsButton.addEventListener('click', clearDebugLogs);
  
  // Textarea event listeners
  transcriptionTextarea.addEventListener('keydown', handleTextareaInteraction);
  transcriptionTextarea.addEventListener('mousedown', handleTextareaInteraction);
  transcriptionTextarea.addEventListener('mouseup', handleSelectionChange);
  transcriptionTextarea.addEventListener('click', handleSelectionChange);
  transcriptionTextarea.addEventListener('select', handleSelectionChange);
  
  // Language change event
  languageSelect.addEventListener('change', function() {
    addDebugInfo(`Language changed to ${this.value}`);
    if (recognition) {
      // Update language without restarting recognition
      recognition.lang = this.value;
    }
  });

  // Initialize
  checkBrowserSupport();
  addDebugInfo('Speech recognition module initialized');
});
