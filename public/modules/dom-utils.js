
// DOM utility functions for Voice to Text for Google NotebookLM

/**
 * Creates an SVG element with all its child elements
 * @param {string} svgPath - The SVG path data (can include multiple paths separated by spaces)
 * @param {number} width - SVG width
 * @param {number} height - SVG height 
 * @returns {SVGElement} The created SVG element
 */
function createSvgElement(svgPath, width = 16, height = 16) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width.toString());
  svg.setAttribute("height", height.toString());
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  
  // Handle multiple path strings (separated by spaces)
  const pathParts = svgPath.split('M').filter(Boolean);
  
  pathParts.forEach(pathPart => {
    // Create path element
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", 'M' + pathPart.trim());
    svg.appendChild(path);
  });
  
  return svg;
}

/**
 * Find all Add Source buttons throughout the page
 * @returns {Array<Element>} Array of found buttons
 */
function findAddSourceButtons() {
  return Array.from(document.querySelectorAll('button')).filter(button => {
    const text = button.textContent.trim().toLowerCase();
    return text.includes('add source') || text.includes('add material') || text === 'add';
  });
}

/**
 * Find active add material dialog
 * @returns {Element|null} The dialog element if found
 */
function findAddMaterialDialog() {
  return document.querySelector('div[role="dialog"]');
}

/**
 * Find input field in a dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The input field if found
 */
function findInputField(dialog) {
  return dialog.querySelector('textarea, input[type="text"], [contenteditable="true"]');
}

/**
 * Find submit button in a dialog
 * @param {Element} dialog - The dialog element
 * @returns {Element|null} The submit button if found
 */
function findSubmitButton(dialog) {
  const allButtons = Array.from(dialog.querySelectorAll('button'));
  return allButtons.find(button => {
    const text = button.textContent.trim();
    return text === 'Insert' || text === 'Add';
  });
}

// Make functions globally available
window.createSvgElement = createSvgElement;
window.findAddSourceButtons = findAddSourceButtons;
window.findAddMaterialDialog = findAddMaterialDialog;
window.findInputField = findInputField;
window.findSubmitButton = findSubmitButton;
