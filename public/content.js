
// Voice to Text for Google NotebookLM - Content Script

console.log('Voice to Text for Google NotebookLM content script loaded');

// Main initialization function
function initializeVoiceToText() {
  console.log('Initializing Voice to Text for Google NotebookLM');
  
  // Look for notebook UI elements and inject our voice button
  observeForNotebookUI();
}

// Watch for changes to detect notebook UI
function observeForNotebookUI() {
  console.log('Setting up mutation observer for NotebookLM UI');
  
  const observer = new MutationObserver((mutations) => {
    // Debug current DOM structure periodically
    if (Math.random() < 0.05) { // Only log occasionally to avoid flooding
      console.log('Current DOM structure:', document.body.innerHTML.substring(0, 200) + '...');
      console.log('Looking for NotebookLM UI elements...');
    }
    
    // Check for the Add Source button or panel
    const addSourceButtons = Array.from(document.querySelectorAll('button')).filter(button => {
      return button.textContent.includes('Add source') || 
             button.textContent.includes('New source') ||
             button.textContent.includes('Add material');
    });
    
    // Check for modifying "Paste text" label to "Text"
    const pasteTextLabels = document.querySelectorAll('span');
    pasteTextLabels.forEach(label => {
      if (label.textContent === 'Paste text') {
        console.log('Found "Paste text" label, changing to "Text"');
        label.textContent = 'Text';
      }
    });
    
    // Check for modifying "Copied text" label to "Text or Audio"
    const copiedTextLabels = document.querySelectorAll('span');
    copiedTextLabels.forEach(label => {
      if (label.textContent === 'Copied text') {
        console.log('Found "Copied text" label, changing to "Text or Audio"');
        label.textContent = 'Text or Audio';
      }
    });
    
    // Check for insert button to add "Speak text" button
    const insertButtons = Array.from(document.querySelectorAll('button')).filter(button => {
      return button.textContent.includes('Insert');
    });
    
    if (insertButtons.length > 0 && !document.querySelector('.voice-to-text-speak-button')) {
      console.log('Found Insert button, adding Speak text button');
      const insertButton = insertButtons[0];
      addSpeakButton(insertButton);
    }
    
    // Add voice button to source material panel if it exists
    const notebookUI = document.querySelector('[aria-label="Source Materials"]') || 
                       document.querySelector('[data-testid="source-material-list"]') ||
                       document.querySelector('[role="complementary"]');
    
    if (notebookUI && !document.querySelector('.voice-to-text-button')) {
      console.log('Found NotebookLM UI, injecting voice button');
      injectVoiceButton(notebookUI);
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
}

// Add a "Speak text" button next to the Insert button
function addSpeakButton(insertButton) {
  if (!insertButton || document.querySelector('.voice-to-text-speak-button')) {
    return;
  }
  
  const parentElement = insertButton.parentElement;
  if (!parentElement) {
    console.log('Cannot find parent element of Insert button');
    return;
  }
  
  const speakButton = document.createElement('button');
  speakButton.className = 'voice-to-text-speak-button';
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
    startVoiceRecognition();
  });
  
  // Insert after the insert button
  insertButton.insertAdjacentElement('afterend', speakButton);
  console.log('Speak text button added successfully');
}

// Inject our voice button into the NotebookLM UI
function injectVoiceButton(targetElement) {
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
    startVoiceRecognition();
  });
  
  // Add to page
  targetElement.appendChild(voiceButton);
  console.log('Voice button injected successfully');
}

// Start voice recognition
function startVoiceRecognition() {
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
      recorderUI.recordButton.textContent = 'Start Recording';
      recorderUI.recordButton.classList.remove('recording');
    };
    
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
      alert(`Speech recognition error: ${event.error}`);
      recorderUI.element.remove();
    };
    
    // Start recording
    recognition.start();
    recorderUI.recordButton.textContent = 'Stop Recording';
    recorderUI.recordButton.classList.add('recording');
    
    // Set up button handlers
    recorderUI.recordButton.onclick = () => {
      if (recorderUI.recordButton.textContent === 'Stop Recording') {
        recognition.stop();
        recorderUI.recordButton.textContent = 'Start Recording';
        recorderUI.recordButton.classList.remove('recording');
      } else {
        recognition.start();
        recorderUI.recordButton.textContent = 'Stop Recording';
        recorderUI.recordButton.classList.add('recording');
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

// Create UI for the voice recorder
function createRecorderUI() {
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
    <h3 style="margin-top: 0; font-size: 16px;">Voice to Text</h3>
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
    cancelButton: element.querySelector('.cancel-button')
  };
}

// Add text to the notebook
function addTextToNotebook(text) {
  console.log('Attempting to add text to notebook:', text.substring(0, 50) + '...');
  
  // Look for the add source button
  const addSourceButtons = Array.from(document.querySelectorAll('button')).filter(button => {
    return button.textContent.includes('Add source') || 
           button.textContent.includes('New source') ||
           button.textContent.includes('Add material');
  });
  
  if (addSourceButtons.length > 0) {
    console.log('Found Add source button, clicking it');
    
    // Click the button to open the add source dialog
    addSourceButtons[0].click();
    
    // Wait for dialog to appear
    setTimeout(() => {
      // Find the input field
      const inputField = document.querySelector('div[role="dialog"] textarea') || 
                         document.querySelector('div[role="dialog"] [contenteditable="true"]');
                         
      if (inputField) {
        console.log('Found input field, adding text');
        
        // Set the text
        if (inputField.tagName === 'TEXTAREA' || inputField.tagName === 'INPUT') {
          inputField.value = text;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          // Handle contenteditable
          inputField.innerHTML = text;
          inputField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        
        // Find submit button and click it
        setTimeout(() => {
          const submitButton = document.querySelector('div[role="dialog"] button[type="submit"]') ||
                              Array.from(document.querySelectorAll('div[role="dialog"] button')).find(btn => 
                                btn.textContent.includes('Add') || btn.textContent.includes('Insert')
                              );
                              
          if (submitButton) {
            console.log('Found submit button, clicking it');
            submitButton.click();
            alert('Text added successfully!');
          } else {
            console.log('Could not find submit button');
            alert('Could not find the submit button. Please add the text manually.');
          }
        }, 500);
      } else {
        console.log('Could not find input field');
        alert('Could not find the input field. Please add the text manually.');
      }
    }, 500);
  } else {
    console.log('Could not find Add Source button');
    alert('Could not find the Add Source button. The UI may have changed.');
  }
}

// Add some basic styles
const style = document.createElement('style');
style.textContent = `
  .voice-to-text-button {
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .voice-to-text-speak-button:hover {
    background-color: #e8eaed;
  }
  
  .record-button.recording {
    background: #ea4335 !important;
  }
`;
document.head.appendChild(style);

// Start the extension
initializeVoiceToText();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkContentScript") {
    sendResponse({ status: "active" });
  }
  return true;
});
