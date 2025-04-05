
// Text insertion functions for Voice to Text for Google NotebookLM
import { findInputField, findSubmitButton, findAddMaterialDialog, findAddSourceButtons } from '../dom-utils.js';

/**
 * Add text to the notebook
 * @param {string} text - The text to add
 * @returns {void}
 */
export function addTextToNotebook(text) {
  console.log('Attempting to add text to notebook:', text.substring(0, 50) + '...');
  
  // Look for active dialog first (in case we're already in the add material dialog)
  const activeDialog = findAddMaterialDialog();
  if (activeDialog) {
    console.log('Found active dialog, trying to add text directly');
    
    // Find the input field
    const inputField = findInputField(activeDialog);
                      
    if (inputField) {
      console.log('Found input field in dialog, adding text');
      
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
        const submitButton = findSubmitButton(activeDialog);
                            
        if (submitButton) {
          console.log('Found submit button in dialog, clicking it');
          submitButton.click();
          alert('Text added successfully!');
        } else {
          console.log('Could not find submit button in dialog');
          alert('Could not find the submit button. Please add the text manually.');
        }
      }, 500);
      
      return;
    }
  }
  
  // If no active dialog, look for the add source button
  const addSourceButtons = findAddSourceButtons();
  
  if (addSourceButtons.length > 0) {
    console.log('Found Add source button, clicking it');
    
    // Click the button to open the add source dialog
    addSourceButtons[0].click();
    
    // Wait for dialog to appear
    setTimeout(() => {
      // Find the input field
      const dialog = findAddMaterialDialog();
      if (!dialog) {
        console.log('Could not find dialog after clicking Add source button');
        alert('Could not find the dialog. Please add the text manually.');
        return;
      }
      
      const inputField = findInputField(dialog);
                        
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
          const submitButton = findSubmitButton(dialog);
                              
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
    }, 1000);
  } else {
    console.log('Could not find Add Source button');
    alert('Could not find the Add Source button. The UI may have changed.');
  }
}
