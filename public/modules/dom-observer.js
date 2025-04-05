
// DOM Observer functionality for Google NotebookLM

/**
 * Watch for changes to detect notebook UI
 */
function observeForNotebookUI() {
  console.log('Setting up mutation observer for NotebookLM UI');
  
  // Debug the initial DOM to understand structure
  window.debugDOMStructure();
  
  const observer = new MutationObserver((mutations) => {
    // Periodically log structure to debug
    if (Math.random() < 0.05) {
      window.debugDOMStructure();
    }
    
    // Look for the dialog that appears when adding text
    const addMaterialDialog = document.querySelector('div[role="dialog"]');
    if (addMaterialDialog) {
      console.log('Found add material dialog:', addMaterialDialog);
      
      // Find the header text to change in the dialog
      const headers = Array.from(addMaterialDialog.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      const pasteTextHeader = headers.find(header => {
        const headerText = header.textContent.trim();
        return headerText === 'Paste copied text' || 
               headerText === 'Paste text' || 
               headerText.includes('Copied text');
      });
      
      if (pasteTextHeader) {
        console.log('Found paste text header:', pasteTextHeader.textContent);
        
        // Check if we've already modified it
        if (!pasteTextHeader.hasAttribute('data-modified')) {
          console.log('Changing header from:', pasteTextHeader.textContent, 'to: Text or Speech');
          
          // Find the actual text element
          const textElements = pasteTextHeader.querySelectorAll('span');
          let targetElement = pasteTextHeader;
          
          if (textElements.length > 0) {
            // Find the span that contains the text
            for (const span of textElements) {
              if (span.textContent.trim() === 'Paste copied text') {
                targetElement = span;
                break;
              }
            }
          }
          
          // Update the text content
          targetElement.textContent = 'Text or Speech';
          pasteTextHeader.setAttribute('data-modified', 'true');
          console.log('Successfully changed header to "Text or Speech"');
        }
      }
      
      // Specifically look for the Insert button in the paste-text component
      // Using a more reliable and specific selector
      const pasteTextComponents = addMaterialDialog.querySelectorAll('paste-text, [class*="paste-text"], form');
      
      if (pasteTextComponents.length > 0) {
        console.log('Found paste text component:', pasteTextComponents[0]);
        
        // Look for the Insert button within the paste-text component
        pasteTextComponents.forEach(component => {
          const insertButton = Array.from(component.querySelectorAll('button')).find(button => {
            return button.textContent.trim() === 'Insert';
          });
          
          if (insertButton) {
            console.log('Found Insert button in paste-text component:', insertButton);
            
            // Check if we've already added our button
            const speakButtonExists = component.querySelector('.voice-to-text-speak-button');
            if (!speakButtonExists) {
              console.log('Adding Speak button next to Insert button');
              
              // Add the Speak button with a slight delay to ensure the DOM is stable
              setTimeout(() => {
                window.addSpeakButton(insertButton);
              }, 100);
            }
          }
        });
      }
    }
    
    // Do NOT add the Voice to Text button in the main interface anymore
    // We'll focus solely on the dialog Insert button
  });
  
  // Observe all changes to the DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
  
  // Initial check for UI elements (only once at the beginning)
  setTimeout(window.debugDOMStructure, 2000);
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
      const insertButton = Array.from(dialog.querySelectorAll('button')).find(btn => 
        btn.textContent.trim() === 'Insert');
      if (insertButton) {
        console.log('Found Insert button in dialog:', insertButton);
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
  console.log('identifyAndInjectVoiceButton is now deprecated');
  // We're not adding the button to the main interface anymore
}

// Make functions globally available
window.observeForNotebookUI = observeForNotebookUI;
window.debugDOMStructure = debugDOMStructure;
window.identifyAndInjectVoiceButton = identifyAndInjectVoiceButton;
