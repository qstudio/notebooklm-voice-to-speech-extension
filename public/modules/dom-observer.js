
// DOM Observer functionality for Google NotebookLM

/**
 * Watch for changes to detect notebook UI
 */
function observeForNotebookUI() {
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
      
      // Use Angular-specific selectors with better matching for the labels
      // Check for modifying "Paste text" label to "Text"
      const pasteTextLabels = Array.from(addMaterialDialog.querySelectorAll('span[_ngcontent-ng-c\\d+], label[_ngcontent-ng-c\\d+], div[_ngcontent-ng-c\\d+]'));
      
      // Log all labels for debugging
      console.log('All dialog labels:', pasteTextLabels.map(el => el.textContent.trim()));
      
      pasteTextLabels.forEach(label => {
        // Exact match for "Paste text"
        if (label.textContent.trim() === 'Paste text') {
          console.log('Found "Paste text" label, changing to "Text"');
          label.textContent = 'Text';
        }
        // Exact match for "Copied text"
        if (label.textContent.trim() === 'Copied text') {
          console.log('Found "Copied text" label, changing to "Text or Speech"');
          label.textContent = 'Text or Speech';
        }
      });
      
      // Look for insert button to add "Speak text" button
      if (!addMaterialDialog.querySelector('.voice-to-text-speak-button')) {
        // Try to find the Insert/Add button using Angular attributes
        const dialogButtons = Array.from(addMaterialDialog.querySelectorAll('button[_ngcontent-ng-c\\d+]'));
        console.log('Found dialog buttons:', dialogButtons.map(b => b.textContent.trim()));
        
        const insertButton = dialogButtons.find(button => 
          button.textContent.trim().includes('Insert') || 
          button.textContent.trim().includes('Add')
        );
        
        if (insertButton) {
          console.log('Found Insert/Add button in dialog, adding Speak text button', insertButton);
          addSpeakButton(insertButton);
        } else {
          // Fallback to find any button that might be the insert button
          console.log('Could not find Insert/Add button with Angular attributes, trying alternative selectors');
          const fallbackButtons = Array.from(addMaterialDialog.querySelectorAll('button'));
          const fallbackInsertButton = fallbackButtons.find(button => 
            button.textContent.trim().includes('Insert') || 
            button.textContent.trim().includes('Add')
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

// Make the function globally available
window.observeForNotebookUI = observeForNotebookUI;
