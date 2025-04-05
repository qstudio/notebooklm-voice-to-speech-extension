
// DOM Observer functionality for Google NotebookLM
import { logCurrentDOM, findAddMaterialDialog, findAddSourceButtons, findNotebookUI } from './dom-utils.js';
import { addSpeakButton, injectVoiceButton } from './ui/buttons.js';

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
      
      // Use Angular-specific selectors for the labels
      // Check for modifying "Paste text" label to "Text"
      const pasteTextLabels = addMaterialDialog.querySelectorAll('span[_ngcontent-ng-c\\d+], label[_ngcontent-ng-c\\d+], div[_ngcontent-ng-c\\d+]');
      pasteTextLabels.forEach(label => {
        // Log each label to debug
        console.log('Checking label:', label.textContent);
        
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
      if (!addMaterialDialog.querySelector('.voice-to-text-speak-button')) {
        // Try to find the Insert/Add button using Angular attributes
        const dialogButtons = Array.from(addMaterialDialog.querySelectorAll('button[_ngcontent-ng-c\\d+]'));
        console.log('Found dialog buttons:', dialogButtons.map(b => b.textContent));
        
        const insertButton = dialogButtons.find(button => 
          button.textContent.includes('Insert') || 
          button.textContent.includes('Add')
        );
        
        if (insertButton) {
          console.log('Found Insert/Add button in dialog, adding Speak text button', insertButton);
          addSpeakButton(insertButton);
        } else {
          // Fallback to find any button that might be the insert button
          console.log('Could not find Insert/Add button with Angular attributes, trying alternative selectors');
          const fallbackButtons = Array.from(addMaterialDialog.querySelectorAll('button'));
          const fallbackInsertButton = fallbackButtons.find(button => 
            button.textContent.includes('Insert') || 
            button.textContent.includes('Add')
          );
          
          if (fallbackInsertButton) {
            console.log('Found Insert/Add button with fallback method, adding Speak text button', fallbackInsertButton);
            addSpeakButton(fallbackInsertButton);
          }
        }
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
