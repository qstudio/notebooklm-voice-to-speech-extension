
// Core functionality for Voice to Text for Google NotebookLM
import { logCurrentDOM, findAddMaterialDialog, findNotebookUI, findAddSourceButtons } from './dom-utils.js';
import { injectVoiceButton, addSpeakButton } from './ui.js';

/**
 * Main initialization function
 */
export function initializeVoiceToText() {
  console.log('Initializing Voice to Text for Google NotebookLM');
  
  // Look for notebook UI elements and inject our voice button
  observeForNotebookUI();
}

/**
 * Watch for changes to detect notebook UI
 */
export function observeForNotebookUI() {
  console.log('Setting up mutation observer for NotebookLM UI');
  
  // Debug DOM on initialization
  logCurrentDOM();
  
  const observer = new MutationObserver((mutations) => {
    // Debug current DOM structure occasionally
    if (Math.random() < 0.05) {
      logCurrentDOM();
    }
    
    // Look for the dialog that appears when adding text
    const addMaterialDialog = findAddMaterialDialog();
    if (addMaterialDialog) {
      console.log('Found add material dialog:', addMaterialDialog);
      
      // Check for modifying "Paste text" label to "Text"
      const pasteTextLabels = addMaterialDialog.querySelectorAll('span, label, div');
      pasteTextLabels.forEach(label => {
        if (label.textContent === 'Paste text') {
          console.log('Found "Paste text" label, changing to "Text"');
          label.textContent = 'Text';
        }
        if (label.textContent === 'Copied text') {
          console.log('Found "Copied text" label, changing to "Text or Audio"');
          label.textContent = 'Text or Audio';
        }
      });
      
      // Look for insert button to add "Speak text" button
      const dialogButtons = Array.from(addMaterialDialog.querySelectorAll('button'));
      const insertButton = dialogButtons.find(button => 
        button.textContent.includes('Insert') || 
        button.textContent.includes('Add')
      );
      
      if (insertButton && !addMaterialDialog.querySelector('.voice-to-text-speak-button')) {
        console.log('Found Insert/Add button in dialog, adding Speak text button', insertButton);
        addSpeakButton(insertButton);
      }
    }
    
    // Check for "Add source" button in the main UI
    const addSourceButtons = findAddSourceButtons();
    
    if (addSourceButtons.length > 0) {
      console.log('Found Add source buttons:', addSourceButtons);
    }
    
    // Add voice button to source material panel if it exists
    const notebookUI = findNotebookUI();
    
    if (notebookUI && !document.querySelector('.voice-to-text-button')) {
      console.log('Found NotebookLM UI, injecting voice button', notebookUI);
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

