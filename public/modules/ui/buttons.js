
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
  speakButton.className = 'voice-to-text-speak-button';
  speakButton.setAttribute('aria-label', 'Speak text');
  speakButton.setAttribute('type', 'button'); // Ensure it's not a submit button
  
  // Match the insert button's styling as closely as possible
  try {
    // Copy class names that are likely for styling
    const classesToCopy = Array.from(insertButton.classList)
      .filter(cls => !cls.includes('primary') && !cls.includes('submit'));
    
    speakButton.classList.add(...classesToCopy);
    
    // Copy inline styles
    speakButton.style.cssText = window.getComputedStyle(insertButton).cssText;
    
    // Force button styling overrides
    speakButton.style.marginLeft = '8px';
  } catch (error) {
    console.error('Error copying button styles:', error);
  }
  
  // Fallback styling
  speakButton.style.cssText += `
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    padding: 8px 16px;
    background-color: #f1f3f4;
    color: #5f6368;
    border-radius: 4px;
    border: none;
    font-family: 'Google Sans', Arial, sans-serif;
    font-size: 14px;
    cursor: pointer;
  `;
  
  speakButton.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
    Speak text
  `;
  
  speakButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Speak text button clicked');
    
    // Call startVoiceRecognition directly if available
    if (typeof window.startVoiceRecognition === 'function') {
      window.startVoiceRecognition();
    } else {
      console.error('Voice recognition function not available');
      alert('Could not start voice recognition. Please try again.');
    }
  });
  
  // Try multiple insertion methods
  try {
    // Method 1: Insert after the insert button
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
  
  voiceButton.innerHTML = `
    <span style="display: flex; align-items: center; padding: 8px 12px; border-radius: 4px; background: #f1f3f4; margin: 8px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
        <line x1="12" x2="12" y1="19" y2="22"></line>
      </svg>
      Voice to Text
    </span>
  `;
  
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
