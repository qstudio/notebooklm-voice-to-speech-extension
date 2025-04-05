
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
      
      // Look for the "Add source", "Add sources" or "Paste copied text" header to identify dialog type
      const dialogHeaders = Array.from(addMaterialDialog.querySelectorAll('h1, h2, h3, h4, h5, h6, div'));
      const textDialogHeaders = dialogHeaders.filter(header => {
        const headerText = header.textContent.trim().toLowerCase();
        return headerText.includes('paste copied text') || 
               headerText.includes('paste text') || 
               headerText.includes('copied text');
      });
      
      if (textDialogHeaders.length > 0) {
        console.log('Found paste text dialog header:', textDialogHeaders[0].textContent);
        
        // Try to modify labels with exact text content match
        textDialogHeaders.forEach(label => {
          const text = label.textContent.trim();
          if (text === 'Paste text' || text === 'Copied text' || text === 'Paste copied text') {
            console.log(`Found "${text}" label, changing to "Text or Speech"`, label);
            
            // First try to modify just the text node
            const childNodes = Array.from(label.childNodes);
            childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.trim() === text) {
                  node.textContent = "Text or Speech";
                }
              }
            });
            
            // If that fails, try the safer way (this method preserves child elements)
            if (label.textContent.trim() !== "Text or Speech") {
              // Clone children before changing
              const fragmentClone = document.createDocumentFragment();
              Array.from(label.childNodes).forEach(child => {
                if (child.nodeType !== Node.TEXT_NODE) {
                  fragmentClone.appendChild(child.cloneNode(true));
                }
              });
              
              // Clear and reset with new text
              label.textContent = "Text or Speech";
              label.appendChild(fragmentClone);
            }
          }
        });
      }
      
      // Find all buttons in the dialog
      const dialogButtons = Array.from(addMaterialDialog.querySelectorAll('button'));
      console.log('Dialog buttons:', dialogButtons.map(button => ({
        text: button.textContent.trim(),
        classes: button.className
      })));
      
      // Look for Insert/Add buttons with text content
      const insertButton = dialogButtons.find(button => {
        const buttonText = button.textContent.trim();
        return buttonText === 'Insert' || buttonText === 'Add';
      });
      
      if (insertButton && !addMaterialDialog.querySelector('.voice-to-text-speak-button')) {
        console.log('Found Insert/Add button in dialog, adding Speak text button next to it');
        
        // Add the speak button with a delay to ensure DOM is stable
        setTimeout(() => {
          window.addSpeakButton(insertButton);
        }, 100);
      }
    }
    
    // Enhance button targeting for the main source panel
    window.identifyAndInjectVoiceButton();
  });
  
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
