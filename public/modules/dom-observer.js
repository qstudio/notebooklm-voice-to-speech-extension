
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
      
      // Target the specific header to change
      const headers = addMaterialDialog.querySelectorAll('h1, h2, h3, h4, h5, h6, div');
      
      // Find the "Paste copied text" header specifically
      const pasteTextHeader = Array.from(headers).find(header => {
        const headerText = header.textContent.trim();
        return headerText === 'Paste copied text' || 
               headerText === 'Paste text' || 
               headerText.includes('Copied text');
      });
      
      if (pasteTextHeader) {
        console.log('Found paste text header:', pasteTextHeader.textContent);
        
        // Check if we've already modified it
        if (pasteTextHeader.textContent.trim() !== 'Text or Speech') {
          // Replace the text content directly
          const originalText = pasteTextHeader.textContent;
          console.log('Changing header from:', originalText, 'to: Text or Speech');
          
          // First try to find just the text node to modify
          let textNodeFound = false;
          for (let i = 0; i < pasteTextHeader.childNodes.length; i++) {
            const node = pasteTextHeader.childNodes[i];
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
              node.textContent = 'Text or Speech';
              textNodeFound = true;
              console.log('Successfully changed header text node to "Text or Speech"');
              break;
            }
          }
          
          // If no direct text node, replace the entire text
          if (!textNodeFound) {
            // Save any child elements
            const childElements = Array.from(pasteTextHeader.children);
            
            // Replace the text content
            pasteTextHeader.textContent = 'Text or Speech';
            
            // Re-add any child elements
            childElements.forEach(child => pasteTextHeader.appendChild(child));
            console.log('Successfully changed header element to "Text or Speech"');
          }
        }
      }
      
      // Look for the Insert button directly within the dialog using the exact attributes
      const insertButton = Array.from(addMaterialDialog.querySelectorAll('button')).find(button => {
        // Match by exact text content
        const buttonText = button.textContent.trim();
        return buttonText === 'Insert';
      });

      if (insertButton) {
        console.log('Found Insert button in dialog:', insertButton);
        
        // Make sure we haven't already added our button
        const speakButtonExists = addMaterialDialog.querySelector('.voice-to-text-speak-button');
        if (!speakButtonExists) {
          console.log('Adding Speak button next to Insert button');
          
          // Add the Speak button with a slight delay to ensure the DOM is stable
          setTimeout(() => {
            window.addSpeakButton(insertButton);
          }, 100);
        }
      }
    }
    
    // Continue checking for UI elements in the main interface
    window.identifyAndInjectVoiceButton();
  });
  
  // Observe all changes to the DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true
  });
  
  // Initial check for UI elements
  setTimeout(window.identifyAndInjectVoiceButton, 2000);
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
  
  // Log headings and labels
  const headingsAndLabels = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, label'));
  console.log(`Found ${headingsAndLabels.length} headings and labels:`);
  headingsAndLabels.forEach(el => {
    const text = el.textContent.trim();
    if (text) {
      console.log(`${el.nodeName}: "${text}"`);
    }
  });
  
  // Look specifically for "Add source" button which is our primary injection target
  const addSourceButtons = Array.from(document.querySelectorAll('button')).filter(button => {
    const text = button.textContent.trim().toLowerCase();
    return text.includes('add source') || text.includes('add sources') || text === 'add';
  });
  console.log(`Found ${addSourceButtons.length} "Add source" buttons:`, 
    addSourceButtons.map(btn => btn.textContent.trim()));
  
  // Find dialogs
  const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
  console.log(`Found ${dialogs.length} dialogs`);
  
  // Look for the Insert button in any dialogs
  if (dialogs.length > 0) {
    dialogs.forEach(dialog => {
      const insertButton = Array.from(dialog.querySelectorAll('button')).find(btn => 
        btn.textContent.trim() === 'Insert');
      if (insertButton) {
        console.log('Found Insert button in dialog:', insertButton);
      }
    });
  }
  
  console.log('=== END DOM STRUCTURE DEBUG ===');
}

/**
 * Identify notebook UI and inject voice button
 */
function identifyAndInjectVoiceButton() {
  // First, find the "Add source" button from the screenshots
  const addSourceButtons = Array.from(document.querySelectorAll('button')).filter(button => {
    const text = button.textContent.trim().toLowerCase();
    return text.includes('add source') || text === 'add';
  });
  
  // Look for button containing an SVG icon and text "Add source"
  const mainAddSourceButton = addSourceButtons.find(button => {
    return button.querySelector('svg') && 
           button.textContent.trim().includes('Add source');
  });
  
  if (mainAddSourceButton) {
    console.log('Found main Add source button:', mainAddSourceButton);
    
    // Check if Voice to Text button already exists
    if (!document.querySelector('.voice-to-text-button')) {
      // Create a voice button in the same container
      const container = mainAddSourceButton.closest('div, section, aside');
      
      if (container) {
        console.log('Found container for Add source button, injecting voice button here', container);
        
        // Create button based on the screenshot
        const voiceButton = document.createElement('button');
        voiceButton.className = 'voice-to-text-button';
        voiceButton.setAttribute('type', 'button');
        voiceButton.style.cssText = `
          width: 100%;
          padding: 10px;
          margin-top: 10px;
          border-radius: 8px;
          background: #f1f3f4;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #202124;
          font-family: 'Google Sans', Arial, sans-serif;
        `;
        
        // Use DOM methods to build the button content
        const buttonText = document.createTextNode("Voice to Text");
        
        // Create mic icon
        const micIcon = window.createSvgElement("M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19L12 22");
        micIcon.style.marginRight = "8px";
        
        voiceButton.appendChild(micIcon);
        voiceButton.appendChild(buttonText);
        
        // Add click handler
        voiceButton.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Voice to Text button clicked');
          
          if (typeof window.startVoiceRecognition === 'function') {
            window.startVoiceRecognition();
          } else {
            console.error('Voice recognition function not available');
            alert('Could not start voice recognition. Please try again.');
          }
        });
        
        // Insert after the Add source button
        container.insertBefore(voiceButton, mainAddSourceButton.nextSibling);
        console.log('Voice button injected successfully');
      } else {
        console.error('Could not find container for Add source button');
      }
    } else {
      console.log('Voice button already exists, not adding again');
    }
  } else {
    console.log('Could not find main Add source button');
    
    // Try alternative method - find the sources section
    const sourcesTitles = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, div')).filter(
      el => el.textContent.trim() === 'Sources'
    );
    
    if (sourcesTitles.length > 0) {
      console.log('Found Sources title:', sourcesTitles[0]);
      
      // Navigate up to find the parent container
      const sourcesSection = sourcesTitles[0].closest('div, section, aside');
      
      if (sourcesSection && !document.querySelector('.voice-to-text-button')) {
        console.log('Found Sources section, injecting voice button here', sourcesSection);
        window.injectVoiceButton(sourcesSection);
      }
    }
  }
}

// Make functions globally available
window.observeForNotebookUI = observeForNotebookUI;
window.debugDOMStructure = debugDOMStructure;
window.identifyAndInjectVoiceButton = identifyAndInjectVoiceButton;
