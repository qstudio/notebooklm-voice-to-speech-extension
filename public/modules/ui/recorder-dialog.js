
// Recorder dialog UI for Voice to Text for Google NotebookLM

/**
 * Creates and returns UI for the voice recorder
 * @returns {Object} Object containing UI elements
 */
function createRecorderUI() {
  const element = document.createElement('div');
  element.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 16px;
    z-index: 10000;
    width: 400px;
    max-width: 90vw;
    font-family: 'Google Sans', Arial, sans-serif;
  `;
  
  // Create header
  const header = document.createElement('h3');
  header.style.marginTop = '0';
  header.style.fontSize = '16px';
  header.style.display = 'flex';
  header.style.alignItems = 'center';
  
  const recordingIndicator = document.createElement('span');
  recordingIndicator.className = 'recording-indicator';
  recordingIndicator.style.display = 'none';
  
  header.appendChild(recordingIndicator);
  header.appendChild(document.createTextNode('Voice to Text'));
  
  // Create textarea
  const textarea = document.createElement('textarea');
  textarea.style.width = '100%';
  textarea.style.height = '120px';
  textarea.style.margin = '12px 0';
  textarea.style.padding = '8px';
  textarea.style.border = '1px solid #ddd';
  textarea.style.borderRadius = '4px';
  textarea.style.resize = 'none';
  textarea.setAttribute('placeholder', 'Speak now...');
  
  // Create buttons container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.display = 'flex';
  buttonsContainer.style.justifyContent = 'space-between';
  
  // Create record button
  const recordButton = document.createElement('button');
  recordButton.className = 'record-button';
  recordButton.style.cssText = `
    background: #4285f4;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  `;
  recordButton.textContent = 'Start Recording';
  
  // Create right buttons container
  const rightButtonsContainer = document.createElement('div');
  
  // Create cancel button
  const cancelButton = document.createElement('button');
  cancelButton.className = 'cancel-button';
  cancelButton.style.cssText = `
    background: #f1f3f4;
    color: #5f6368;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 8px;
  `;
  cancelButton.textContent = 'Cancel';
  
  // Create add button
  const addButton = document.createElement('button');
  addButton.className = 'add-button';
  addButton.style.cssText = `
    background: #4285f4;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  `;
  addButton.textContent = 'Add Text';
  
  // Assemble all elements
  rightButtonsContainer.appendChild(cancelButton);
  rightButtonsContainer.appendChild(addButton);
  
  buttonsContainer.appendChild(recordButton);
  buttonsContainer.appendChild(rightButtonsContainer);
  
  element.appendChild(header);
  element.appendChild(textarea);
  element.appendChild(buttonsContainer);
  
  return {
    element: element,
    textarea: textarea,
    recordButton: recordButton,
    addButton: addButton,
    cancelButton: cancelButton,
    recordingIndicator: recordingIndicator
  };
}

// Make function globally available
window.createRecorderUI = createRecorderUI;
