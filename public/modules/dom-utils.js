
// DOM utility functions for Voice to Text for Google NotebookLM

/**
 * Logs the current DOM structure for debugging
 */
export function logCurrentDOM() {
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
export function findAddSourceButtons() {
  // First try to find buttons with Angular attributes
  const ngButtons = Array.from(document.querySelectorAll('button[_ngcontent-ng-c\\d+]'));
  const ngAddSourceButtons = ngButtons.filter(button => {
    const buttonText = button.textContent.toLowerCase();
    return buttonText.includes('add source') || 
           buttonText.includes('new source') ||
           buttonText.includes('add material');
  });
  
  if (ngAddSourceButtons.length > 0) {
    return ngAddSourceButtons;
  }
  
  // Fallback to regular buttons
  return Array.from(document.querySelectorAll('button')).filter(button => {
    const buttonText = button.textContent.toLowerCase();
    return buttonText.includes('add source') || 
           buttonText.includes('new source') ||
           buttonText.includes('add material');
  });
}

/**
 * Find the notebook UI element
 * @returns {Element|null} The notebook UI element or null
 */
export function findNotebookUI() {
  // Try different selectors in order of specificity
  return document.querySelector('[aria-label="Source Materials"]') || 
         document.querySelector('[data-testid="source-material-list"]') ||
         document.querySelector('[role="complementary"]') ||
         document.querySelector('[_ngcontent-ng-c\\d+][role="complementary"]');
}

/**
 * Find the add material dialog
 * @returns {Element|null} The dialog element or null
 */
export function findAddMaterialDialog() {
  // Look for Angular-specific dialog first
  const ngDialogs = document.querySelectorAll('[_ngcontent-ng-c\\d+][role="dialog"]');
  if (ngDialogs.length > 0) {
    console.log('Found Angular dialog');
    return ngDialogs[0];
  }
  
  // Fallback to standard dialog
  const dialog = document.querySelector('div[role="dialog"]');
  if (dialog) {
    console.log('Found standard dialog');
    return dialog;
  }
  
  return null;
}

/**
 * Find input field in dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The input field or null
 */
export function findInputField(dialog) {
  if (!dialog) return null;
  
  // Look for Angular-specific textarea first
  const ngTextarea = dialog.querySelector('textarea[_ngcontent-ng-c\\d+]');
  if (ngTextarea) {
    console.log('Found Angular textarea');
    return ngTextarea;
  }
  
  // Then try standard elements
  const textarea = dialog.querySelector('textarea');
  if (textarea) {
    console.log('Found standard textarea');
    return textarea;
  }
  
  const contentEditable = dialog.querySelector('[contenteditable="true"]');
  if (contentEditable) {
    console.log('Found contenteditable element');
    return contentEditable;
  }
  
  console.log('Could not find input field in dialog');
  return null;
}

/**
 * Find submit button in dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The submit button or null
 */
export function findSubmitButton(dialog) {
  if (!dialog) return null;
  
  // Look for Angular-specific submit button first
  const ngButtons = Array.from(dialog.querySelectorAll('button[_ngcontent-ng-c\\d+]'));
  console.log('Found Angular buttons in dialog:', ngButtons.map(b => b.textContent));
  
  const ngSubmitButton = ngButtons.find(btn => 
    btn.textContent.includes('Add') || btn.textContent.includes('Insert')
  );
  
  if (ngSubmitButton) {
    console.log('Found Angular submit button');
    return ngSubmitButton;
  }
  
  // Fallback to standard buttons
  const submitButton = dialog.querySelector('button[type="submit"]') ||
                       Array.from(dialog.querySelectorAll('button')).find(btn => 
                         btn.textContent.includes('Add') || btn.textContent.includes('Insert')
                       );
  
  if (submitButton) {
    console.log('Found standard submit button');
    return submitButton;
  }
  
  console.log('Could not find submit button in dialog');
  return null;
}
