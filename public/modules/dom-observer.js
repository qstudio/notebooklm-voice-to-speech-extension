
// DOM Observer functionality for Google NotebookLM

/**
 * Watch for changes to detect notebook UI
 */
function observeForNotebookUI() {
  const observer = new MutationObserver((mutations) => {
    const dialogContainer = document.querySelector('mat-dialog-container[role="dialog"].mat-mdc-dialog-container');

    if (dialogContainer) {
      const formField = dialogContainer.querySelector('mat-form-field');

      if (formField) {
        console.log('Found the mat-form-field:', formField);

        // Check if the "Speech to Text" button already exists
        const existingButton = dialogContainer.querySelector('.speech-to-text-button');
        if (existingButton) {
          console.log('Speech to Text button already exists. Skipping addition.');
          return;
        }

        // Create the new button element
        const newButton = document.createElement('button');
        newButton.setAttribute('type', 'button');
        newButton.setAttribute('mat-flat-button', '');
        newButton.setAttribute('color', 'primary');
        newButton.className = 'mdc-button mat-mdc-button-base mdc-button--unelevated mat-mdc-unelevated-button mat-primary speech-to-text-button';

        // Create child elements for the button
        const rippleSpan = document.createElement('span');
        rippleSpan.className = 'mat-mdc-button-persistent-ripple mdc-button__ripple';

        const labelSpan = document.createElement('span');
        labelSpan.className = 'mdc-button__label';
        labelSpan.textContent = 'Speech to Text';

        const focusIndicatorSpan = document.createElement('span');
        focusIndicatorSpan.className = 'mat-focus-indicator';

        const touchTargetSpan = document.createElement('span');
        touchTargetSpan.className = 'mat-mdc-button-touch-target';

        // Append child elements to the button
        newButton.appendChild(rippleSpan);
        newButton.appendChild(labelSpan);
        newButton.appendChild(focusIndicatorSpan);
        newButton.appendChild(touchTargetSpan);

        // Add click event handler to the button
        newButton.addEventListener('click', () => {
          console.log('Speech to Text button clicked');
          
          // Find the input field in the dialog
          const inputField = dialogContainer.querySelector('textarea, input[type="text"], [contenteditable="true"]');
          
          if (inputField) {
            console.log('Found input field, starting voice recognition');
            
            // Call the dialog-specific voice recognition function
            if (typeof window.startVoiceRecognitionForDialog === 'function') {
              window.startVoiceRecognitionForDialog(inputField);
            } else {
              console.error('startVoiceRecognitionForDialog function not available');
              alert('Speech recognition is not available. Please try again later.');
            }
          } else {
            console.error('Could not find input field in dialog');
            alert('Could not find the input field. Please try again.');
          }
        });

        // Insert the new button before the mat-form-field
        formField.parentElement.insertBefore(newButton, formField);
        console.log('Speech to Text button added before the mat-form-field.');
      } else {
        console.error('mat-form-field not found!');
      }
    } else {
      console.log('Dialog container not found.');
    }
  });

  // Observe all changes to the DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });
}

/**
 * Debug function to log DOM structure
 */
function debugDOMStructure() {
  console.log('=== DOM STRUCTURE DEBUG ===');
  
  // Log document title and URL
  console.log('Page:', document.title, window.location.href);
  
  // Find main UI containers
  const mainContainers = Array.from(document.querySelectorAll('main, [role="main"], [role="complementary"]'));
  console.log(`Found ${mainContainers.length} main containers`);
  
  // Log buttons with text
  const allButtons = Array.from(document.querySelectorAll('button'));
  console.log(`Found ${allButtons.length} buttons on the page:`);
  allButtons.forEach(button => {
    const text = button.textContent.trim();
    if (text) {
      console.log(`Button: "${text}" - classes: ${button.className}`);
    }
  });
  
  // Look specifically for "Insert" button in dialogs
  const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
  console.log(`Found ${dialogs.length} dialogs`);
  
  if (dialogs.length > 0) {
    dialogs.forEach(dialog => {
      const insertButton = dialog.querySelector('button[mat-flat-button][type="submit"]');
      if (insertButton) {
        console.log('Found Insert button with specific selector in dialog:', insertButton);
      } else {
        const fallbackInsertButton = Array.from(dialog.querySelectorAll('button')).find(btn => 
          btn.textContent.trim() === 'Insert');
        if (fallbackInsertButton) {
          console.log('Found Insert button with fallback in dialog:', fallbackInsertButton);
        }
      }
      
      // Look for heading elements
      const headers = Array.from(dialog.querySelectorAll('h1, h2, h3, h4, h5, h6, span[class*="title"]'));
      console.log(`Found ${headers.length} headers in dialog:`);
      headers.forEach(header => {
        console.log(`Header: "${header.textContent.trim()}" - classes: ${header.className}`);
      });
    });
  }
  
  console.log('=== END DOM STRUCTURE DEBUG ===');
}

/**
 * This function is now deprecated - we'll focus only on the dialog
 */
function identifyAndInjectVoiceButton() {
  // console.log('identsifyAndInjectVoiceButton is now deprecated');
  // We're not adding the button to the main interface anymore
}

// Make functions globally available
window.observeForNotebookUI = observeForNotebookUI;
// window.debugDOMStructure = debugDOMStructure;
// window.identifyAndInjectVoiceButton = identifyAndInjectVoiceButton;
