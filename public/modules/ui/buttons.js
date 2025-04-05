
// Button creation and injection for Voice to Text for Google NotebookLM

/**
 * Add a "Speak text" button next to the Insert button
 * @param {Element} insertButton - The insert button
 * @returns {void}
 */
function addSpeakButton(insertButton) {
  if (!insertButton) {
    console.log('Insert button not provided');
    return;
  }
  
  // Don't add if already exists
  if (document.querySelector('.voice-to-text-speak-button')) {
    console.log('Speak button already exists, not adding again');
    return;
  }
  
  const parentElement = insertButton.parentElement;
  if (!parentElement) {
    console.log('Cannot find parent element of Insert button');
    return;
  }
  
  console.log('Adding Speak text button next to:', insertButton);
  
  const speakButton = document.createElement('button');
  speakButton.className = 'voice-to-text-speak-button mdc-button mat-mdc-button-base';
  speakButton.setAttribute('aria-label', 'Speak text');
  speakButton.setAttribute('type', 'button'); // Ensure it's not a submit button
  
  // Try to match the Insert button's styling as closely as possible
  try {
    // Copy class names that are likely for styling but avoid primary/submit classes
    const classesToCopy = Array.from(insertButton.classList)
      .filter(cls => !cls.includes('primary') && !cls.includes('submit') && !cls.includes('disabled'));
    
    speakButton.classList.add(...classesToCopy);
    
    // Force button styling overrides
    speakButton.style.marginLeft = '8px';
    speakButton.style.backgroundColor = '#f1f3f4';
    speakButton.style.color = '#5f6368';
  } catch (error) {
    console.error('Error copying button styles:', error);
  }
  
  // Create button content using DOM methods
  const buttonLabel = document.createElement('span');
  buttonLabel.className = 'mdc-button__label';
  
  // Create mic icon
  const micIcon = window.createSvgElement("M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19L12 22");
  micIcon.style.marginRight = "8px";
  micIcon.style.width = "16px";
  micIcon.style.height = "16px";
  
  // Add text to label
  const buttonText = document.createTextNode("Speak text");
  
  // Assemble the button
  buttonLabel.appendChild(buttonText);
  speakButton.appendChild(micIcon);
  speakButton.appendChild(buttonLabel);
  
  // Add persistent ripple span to match Material Design
  const rippleSpan = document.createElement('span');
  rippleSpan.className = 'mat-mdc-button-persistent-ripple mdc-button__ripple';
  speakButton.insertBefore(rippleSpan, speakButton.firstChild);
  
  // Add focus indicator
  const focusIndicator = document.createElement('span');
  focusIndicator.className = 'mat-focus-indicator';
  speakButton.appendChild(focusIndicator);
  
  // Add click event listener
  speakButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Speak text button clicked');
    
    // Call startVoiceRecognition with window scope
    if (typeof window.startVoiceRecognition === 'function') {
      window.startVoiceRecognition();
    } else {
      console.error('Voice recognition function not available');
      alert('Could not start voice recognition. Please try again.');
    }
  });
  
  // Try multiple insertion methods to ensure the button appears in the right place
  try {
    // Try to find the parent container that holds the buttons
    const buttonsContainer = parentElement.closest('.dialog-actions') || 
                             parentElement.closest('[mat-dialog-actions]') ||
                             parentElement;
    
    // Insert directly after the insert button
    insertButton.insertAdjacentElement('afterend', speakButton);
    console.log('Speak text button added successfully using insertAdjacentElement');
  } catch (error) {
    console.error('Error adding speak button with insertAdjacentElement:', error);
    
    try {
      // Method 2: Append to parent
      parentElement.appendChild(speakButton);
      console.log('Speak text button added to parent successfully');
    } catch (error2) {
      console.error('Error adding speak button to parent:', error2);
      
      try {
        // Method 3: Create a wrapper and replace the original button
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        
        // Clone the insert button and add it to the wrapper
        const newInsertButton = insertButton.cloneNode(true);
        wrapper.appendChild(newInsertButton);
        wrapper.appendChild(speakButton);
        
        // Replace the original button with the wrapper
        insertButton.parentElement.replaceChild(wrapper, insertButton);
        console.log('Created button wrapper with both buttons');
      } catch (error3) {
        console.error('All button insertion methods failed:', error3);
      }
    }
  }
}

/**
 * Inject voice button into the NotebookLM UI
 * @param {Element} targetElement - The target element to inject the button into
 * @returns {void}
 */
function injectVoiceButton(targetElement) {
  if (!targetElement) {
    console.error('No target element provided for voice button injection');
    return;
  }
  
  // Don't add if already exists
  if (document.querySelector('.voice-to-text-button')) {
    console.log('Voice button already exists, not adding again');
    return;
  }
  
  console.log('Injecting voice button into:', targetElement);
  
  // Create a button element
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
  
  // Create button content using DOM methods
  const buttonSpan = document.createElement('span');
  buttonSpan.style.display = 'flex';
  buttonSpan.style.alignItems = 'center';
  buttonSpan.style.padding = '8px 12px';
  
  // Create mic icon
  const micIcon = window.createSvgElement("M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19L12 22");
  micIcon.style.marginRight = "8px";
  
  // Add text
  const buttonText = document.createTextNode("Voice to Text");
  
  // Add icon and text to span
  buttonSpan.appendChild(micIcon);
  buttonSpan.appendChild(buttonText);
  
  // Add span to button
  voiceButton.appendChild(buttonSpan);
  
  // Add click event listener
  voiceButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Voice to Text button clicked');
    
    // Call startVoiceRecognition directly if available
    if (typeof window.startVoiceRecognition === 'function') {
      window.startVoiceRecognition();
    } else {
      console.error('Voice recognition function not available');
      alert('Could not start voice recognition. Please try again.');
    }
  });
  
  // Add to page - try multiple methods
  try {
    // Try method 1: Standard append
    targetElement.appendChild(voiceButton);
    console.log('Voice button injected successfully');
  } catch (error) {
    console.error('Error injecting voice button:', error);
    
    try {
      // Try method 2: Insert as first child
      targetElement.insertBefore(voiceButton, targetElement.firstChild);
      console.log('Voice button injected as first child');
    } catch (error2) {
      console.error('Error injecting voice button as first child:', error2);
      
      try {
        // Try method 3: Insert after a specific element
        const insertionPoint = targetElement.querySelector('div') || targetElement;
        insertionPoint.insertAdjacentElement('afterend', voiceButton);
        console.log('Voice button injected using insertAdjacentElement');
      } catch (error3) {
        console.error('All voice button injection methods failed:', error3);
      }
    }
  }
}

// Make functions globally available
window.addSpeakButton = addSpeakButton;
window.injectVoiceButton = injectVoiceButton;
