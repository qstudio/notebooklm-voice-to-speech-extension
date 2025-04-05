
// Voice Scribe for Google Notebook - Content Script
console.log("Voice Scribe for Google Notebook extension loaded");

// Global state for our recorder
let recorderActive = false;
let recorderElement = null;

// Function to observe DOM changes and detect when we're in Google NotebookLM
const observeForNotebook = () => {
  // Watch for changes to the DOM to detect when we're in a Google Notebook
  const observer = new MutationObserver((mutations) => {
    if (!document.querySelector('.voice-scribe-button')) {
      // Look for possible source material sections
      const possibleTargets = [
        document.querySelector('[aria-label="Source Materials"]'),
        document.querySelector('.source-material-section'),
        document.querySelector('[role="complementary"]'),
        // Add more selectors as Google might change their UI
      ].filter(Boolean);

      // Try to find the add source material button or section
      for (const target of possibleTargets) {
        if (target) {
          const addButtons = target.querySelectorAll('button');
          for (const button of addButtons) {
            if (button.textContent && 
                (button.textContent.includes('Add') || 
                 button.textContent.includes('New'))) {
              
              // Found a potential insertion point, inject our button next to it
              injectVoiceButton(button.parentElement);
              break;
            }
          }
        }
      }
    }
  });

  // Start observing document
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
};

// Function to inject our voice button into the Google Notebook UI
const injectVoiceButton = (targetElement) => {
  if (!targetElement || document.querySelector('.voice-scribe-button')) {
    return; // Don't inject twice
  }

  // Create button element
  const voiceButton = document.createElement('button');
  voiceButton.className = 'voice-scribe-button';
  voiceButton.innerHTML = `
    <div style="display: flex; align-items: center; gap: 4px; padding: 8px 12px; border-radius: 4px; cursor: pointer; background-color: #f1f3f4; color: #202124;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" x2="12" y1="19" y2="22"></line>
      </svg>
      <span>Voice Add</span>
    </div>
  `;
  
  // Add click event to open our recorder UI
  voiceButton.addEventListener('click', () => {
    showRecorder();
  });
  
  // Add to page
  targetElement.appendChild(voiceButton);
};

// Function to show the voice recorder interface
const showRecorder = () => {
  if (recorderActive) {
    return; // Don't show multiple recorders
  }
  
  recorderActive = true;
  
  // Create recorder UI
  recorderElement = document.createElement('div');
  recorderElement.className = 'voice-scribe-recorder';
  recorderElement.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); width: 300px; z-index: 9999; overflow: hidden;">
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e0e0e0; background: #f8f9fa;">
        <h3 style="margin: 0; font-size: 16px; color: #202124;">Voice Scribe</h3>
        <button class="voice-close-btn" style="background: none; border: none; cursor: pointer; color: #5f6368; font-size: 18px;">&times;</button>
      </div>
      
      <div style="padding: 16px;">
        <textarea class="voice-transcript" style="width: 100%; height: 120px; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 16px; font-family: Arial, sans-serif; resize: none;" placeholder="Your dictated text will appear here..."></textarea>
        
        <div style="display: flex; justify-content: space-between;">
          <button class="voice-record-btn" style="display: flex; align-items: center; gap: 4px; padding: 8px 12px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
            <span>Record</span>
          </button>
          
          <div>
            <button class="voice-cancel-btn" style="padding: 8px 12px; background: #f1f3f4; color: #5f6368; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px;">Cancel</button>
            <button class="voice-add-btn" style="padding: 8px 12px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;" disabled>Add</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add to page
  document.body.appendChild(recorderElement);
  
  // Get needed elements
  const closeBtn = recorderElement.querySelector('.voice-close-btn');
  const recordBtn = recorderElement.querySelector('.voice-record-btn');
  const cancelBtn = recorderElement.querySelector('.voice-cancel-btn');
  const addBtn = recorderElement.querySelector('.voice-add-btn');
  const transcriptArea = recorderElement.querySelector('.voice-transcript');
  
  // Set up events
  closeBtn.addEventListener('click', () => {
    closeRecorder();
  });
  
  cancelBtn.addEventListener('click', () => {
    closeRecorder();
  });
  
  let recognition = null;
  let isRecording = false;
  
  recordBtn.addEventListener('click', () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });
  
  addBtn.addEventListener('click', () => {
    const text = transcriptArea.value.trim();
    if (text) {
      addSourceMaterial(text);
      closeRecorder();
    }
  });
  
  transcriptArea.addEventListener('input', () => {
    // Enable/disable the Add button based on content
    addBtn.disabled = !transcriptArea.value.trim();
  });
  
  function startRecording() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Try using Chrome.');
      return;
    }
    
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        transcriptArea.value = transcript;
        addBtn.disabled = !transcript.trim();
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
      };
      
      recognition.onend = () => {
        stopRecording();
      };
      
      recognition.start();
      isRecording = true;
      recordBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="6" width="12" height="12" rx="2" ry="2"></rect>
        </svg>
        <span>Stop</span>
      `;
      recordBtn.style.background = '#d93025';
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }
  
  function stopRecording() {
    if (recognition) {
      recognition.stop();
      recognition = null;
    }
    isRecording = false;
    recordBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" x2="12" y1="19" y2="22"></line>
      </svg>
      <span>Record</span>
    `;
    recordBtn.style.background = '#1a73e8';
  }
};

// Function to close the recorder
const closeRecorder = () => {
  if (recorderElement) {
    document.body.removeChild(recorderElement);
    recorderElement = null;
    recorderActive = false;
  }
};

// Function to add text to Google Notebook
const addSourceMaterial = (text) => {
  // Try to find the Add button for sources
  const possibleAddButtons = [
    ...document.querySelectorAll('button'),
    ...document.querySelectorAll('[role="button"]')
  ].filter(el => {
    const content = el.textContent.toLowerCase().trim();
    return (content.includes('add source') || 
            content.includes('new source') || 
            content.includes('add material'));
  });
  
  if (possibleAddButtons.length > 0) {
    // Click the add source button
    possibleAddButtons[0].click();
    
    // Now we need to wait for the input field to appear
    setTimeout(() => {
      // Try to find the input field or textarea
      const inputField = document.querySelector('textarea[placeholder*="source"], textarea[aria-label*="source"], input[placeholder*="source"]');
      
      if (inputField) {
        // Set the value and dispatch events to trigger any listeners
        inputField.value = text;
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Find the confirm/add/save button
        setTimeout(() => {
          const confirmButtons = [
            ...document.querySelectorAll('button'),
            ...document.querySelectorAll('[role="button"]')
          ].filter(el => {
            const content = el.textContent.toLowerCase().trim();
            return (content === 'add' || 
                    content === 'save' || 
                    content === 'confirm' || 
                    content === 'create');
          });
          
          if (confirmButtons.length > 0) {
            confirmButtons[0].click();
          }
        }, 300);
      }
    }, 300);
  } else {
    // Fallback - send a message to the background script to handle it
    chrome.runtime.sendMessage({
      action: "addSourceMaterial",
      text: text
    });
  }
};

// Start observing for the notebook interface
observeForNotebook();

// Listen for messages from the popup/background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "addSourceMaterial" && request.text) {
    addSourceMaterial(request.text);
    sendResponse({ status: "added" });
  }
});
