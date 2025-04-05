
// DOM utility functions for Voice to Text for Google NotebookLM

/**
 * Logs the current DOM structure for debugging
 */
function logCurrentDOM() {
  console.log('Current DOM structure:');
  
  // Log all buttons
  const allButtons = document.querySelectorAll('button');
  console.log(`Found ${allButtons.length} buttons on the page:`);
  allButtons.forEach(button => {
    if (button.textContent.trim()) {
      console.log(`- Button text: "${button.textContent.trim()}"`);
    }
  });
  
  // Log Angular-specific elements
  const ngElements = document.querySelectorAll('[_ngcontent-ng-c\\d+]');
  console.log(`Found ${ngElements.length} Angular elements`);
  
  // Log spans with Angular attributes
  const ngSpans = document.querySelectorAll('span[_ngcontent-ng-c\\d+]');
  console.log(`Found ${ngSpans.length} Angular spans`);
  ngSpans.forEach(span => {
    if (span.textContent.trim()) {
      console.log(`- Angular span text: "${span.textContent.trim()}"`);
    }
  });
  
  // Log dialogs
  const dialogs = document.querySelectorAll('[role="dialog"]');
  console.log(`Found ${dialogs.length} dialogs on the page`);
  
  // Log potential source material panels
  const panels = document.querySelectorAll('[role="complementary"]');
  console.log(`Found ${panels.length} complementary panels on the page`);
}

/**
 * Find add source buttons in the UI
 * @returns {Array} Array of found buttons
 */
function findAddSourceButtons() {
  // First look for buttons with specific text
  const allButtons = Array.from(document.querySelectorAll('button'));
  return allButtons.filter(button => {
    const buttonText = button.textContent.toLowerCase().trim();
    return buttonText.includes('add source') || 
           buttonText.includes('new source') ||
           buttonText.includes('add material');
  });
}

/**
 * Find the notebook UI element
 * @returns {Element|null} The notebook UI element or null
 */
function findNotebookUI() {
  // Try different selectors in order of specificity
  return document.querySelector('[aria-label="Source Materials"]') || 
         document.querySelector('[data-testid="source-material-list"]') ||
         document.querySelector('[role="complementary"]') ||
         document.querySelector('aside');
}

/**
 * Find the add material dialog
 * @returns {Element|null} The dialog element or null
 */
function findAddMaterialDialog() {
  // Look for dialog role
  return document.querySelector('div[role="dialog"]');
}

/**
 * Find input field in dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The input field or null
 */
function findInputField(dialog) {
  if (!dialog) return null;
  
  // Try to find textarea first (most likely)
  const textarea = dialog.querySelector('textarea');
  if (textarea) {
    console.log('Found textarea');
    return textarea;
  }
  
  // Then try contenteditable
  const contentEditable = dialog.querySelector('[contenteditable="true"]');
  if (contentEditable) {
    console.log('Found contenteditable element');
    return contentEditable;
  }
  
  // Then try text input
  const textInput = dialog.querySelector('input[type="text"]');
  if (textInput) {
    console.log('Found text input');
    return textInput;
  }
  
  console.log('Could not find input field in dialog');
  return null;
}

/**
 * Find submit button in dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The submit button or null
 */
function findSubmitButton(dialog) {
  if (!dialog) return null;
  
  // Look for buttons in dialog
  const dialogButtons = Array.from(dialog.querySelectorAll('button'));
  console.log('Found buttons in dialog:', dialogButtons.map(b => b.textContent.trim()));
  
  // First try to find by text content
  const submitTextPatterns = ['add', 'insert', 'save', 'submit'];
  
  const textMatchButton = dialogButtons.find(btn => {
    const text = btn.textContent.trim().toLowerCase();
    return submitTextPatterns.some(pattern => text.includes(pattern));
  });
  
  if (textMatchButton) {
    console.log('Found submit button by text match');
    return textMatchButton;
  }
  
  // Then try to find by type attribute
  const submitTypeButton = dialog.querySelector('button[type="submit"]');
  if (submitTypeButton) {
    console.log('Found submit button by type attribute');
    return submitTypeButton;
  }
  
  // Fallback to primary/confirm button based on position or style
  if (dialogButtons.length > 0) {
    // Usually the rightmost/last button is submit/confirm
    const lastButton = dialogButtons[dialogButtons.length - 1];
    console.log('Using last button as submit button fallback');
    return lastButton;
  }
  
  console.log('Could not find submit button in dialog');
  return null;
}

// Make all functions globally available
window.logCurrentDOM = logCurrentDOM;
window.findAddSourceButtons = findAddSourceButtons;
window.findNotebookUI = findNotebookUI;
window.findAddMaterialDialog = findAddMaterialDialog;
window.findInputField = findInputField;
window.findSubmitButton = findSubmitButton;
