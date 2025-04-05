
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
  
  element.innerHTML = `
    <h3 style="margin-top: 0; font-size: 16px; display: flex; align-items: center;">
      <span class="recording-indicator" style="display: none;"></span>
      Voice to Text
    </h3>
    <textarea style="width: 100%; height: 120px; margin: 12px 0; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: none;" 
              placeholder="Speak now..."></textarea>
    <div style="display: flex; justify-content: space-between;">
      <button class="record-button" style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Start Recording
      </button>
      <div>
        <button class="cancel-button" style="background: #f1f3f4; color: #5f6368; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 8px;">
          Cancel
        </button>
        <button class="add-button" style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
          Add Text
        </button>
      </div>
    </div>
  `;
  
  return {
    element: element,
    textarea: element.querySelector('textarea'),
    recordButton: element.querySelector('.record-button'),
    addButton: element.querySelector('.add-button'),
    cancelButton: element.querySelector('.cancel-button'),
    recordingIndicator: element.querySelector('.recording-indicator')
  };
}

// Make function globally available
window.createRecorderUI = createRecorderUI;
