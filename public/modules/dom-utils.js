
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
  return document.querySelector('[aria-label="Source Materials"]') || 
         document.querySelector('[data-testid="source-material-list"]') ||
         document.querySelector('[role="complementary"]');
}

/**
 * Find the add material dialog
 * @returns {Element|null} The dialog element or null
 */
export function findAddMaterialDialog() {
  return document.querySelector('div[role="dialog"]');
}

/**
 * Find input field in dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The input field or null
 */
export function findInputField(dialog) {
  if (!dialog) return null;
  return dialog.querySelector('textarea') || 
         dialog.querySelector('[contenteditable="true"]');
}

/**
 * Find submit button in dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The submit button or null
 */
export function findSubmitButton(dialog) {
  if (!dialog) return null;
  
  const submitButton = dialog.querySelector('button[type="submit"]') ||
                       Array.from(dialog.querySelectorAll('button')).find(btn => 
                         btn.textContent.includes('Add') || btn.textContent.includes('Insert')
                       );
  return submitButton;
}
