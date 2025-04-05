
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
      
      // Try to find textareas, inputs or editable content elements in the dialog
      const textInputs = addMaterialDialog.querySelectorAll('textarea, input[type="text"], [contenteditable="true"]');
      console.log('Dialog text inputs:', textInputs.length, textInputs);
      
      // Find all the labels and headings within the dialog
      const labels = Array.from(addMaterialDialog.querySelectorAll('label, h1, h2, h3, h4, h5, h6, div > span'));
      console.log('Dialog labels:', labels.map(label => ({
        text: label.textContent.trim(),
        nodeName: label.nodeName,
        classes: label.className
      })));
      
      // Try to modify labels with exact text content match
      labels.forEach(label => {
        const text = label.textContent.trim();
        if (text === 'Paste text' || text === 'Copied text') {
          console.log(`Found "${text}" label, changing to "Text or Speech"`, label);
          label.textContent = 'Text or Speech';
        }
      });
      
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
    
    // Check for source material panel to add Voice button
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
  
  // Look specifically for source material sections
  const sourceMaterialSections = Array.from(document.querySelectorAll(
    '[aria-label="Source Materials"], [data-testid="source-material-list"], [role="complementary"]'
  ));
  console.log(`Found ${sourceMaterialSections.length} potential source material sections`);
  
  // Find dialogs
  const dialogs = Array.from(document.querySelectorAll('[role="dialog"]'));
  console.log(`Found ${dialogs.length} dialogs`);
  
  console.log('=== END DOM STRUCTURE DEBUG ===');
}

/**
 * Identify notebook UI and inject voice button
 */
function identifyAndInjectVoiceButton() {
  // Try multiple strategies to find the source material panel
  const potentialPanels = [
    ...document.querySelectorAll('[aria-label="Source Materials"]'),
    ...document.querySelectorAll('[data-testid="source-material-list"]'),
    ...document.querySelectorAll('[role="complementary"]'),
    ...document.querySelectorAll('aside'),
    ...document.querySelectorAll('.source-material-panel, .sidebar, .side-panel')
  ];
  
  console.log(`Found ${potentialPanels.length} potential source material panels`);
  
  // Find all "Add source" buttons throughout the page
  const addSourceButtons = Array.from(document.querySelectorAll('button')).filter(button => {
    const text = button.textContent.trim().toLowerCase();
    return text.includes('add source') || text.includes('add material');
  });
  
  console.log(`Found ${addSourceButtons.length} "Add source" buttons`);
  
  if (addSourceButtons.length > 0) {
    // Find the closest parent that might be the source panel
    const button = addSourceButtons[0];
    let panel = button.closest('[role="complementary"]') || 
                button.closest('aside') ||
                button.parentElement;
    
    if (panel && !panel.querySelector('.voice-to-text-button')) {
      console.log('Found source panel with Add source button, injecting voice button', panel);
      window.injectVoiceButton(panel);
    } else if (!document.querySelector('.voice-to-text-button')) {
      // If we can't find a proper panel, inject near the button
      console.log('Injecting voice button near Add source button');
      const container = document.createElement('div');
      container.style.marginTop = '8px';
      button.parentElement.insertBefore(container, button.nextSibling);
      window.injectVoiceButton(container);
    }
  } else if (potentialPanels.length > 0 && !document.querySelector('.voice-to-text-button')) {
    // If we found panels but no Add source button
    console.log('Injecting voice button in first potential panel');
    window.injectVoiceButton(potentialPanels[0]);
  }
}

// Make functions globally available
window.observeForNotebookUI = observeForNotebookUI;
window.debugDOMStructure = debugDOMStructure;
window.identifyAndInjectVoiceButton = identifyAndInjectVoiceButton;
