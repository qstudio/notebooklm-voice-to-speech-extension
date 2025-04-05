
// Button creation and injection for Voice to Text for Google NotebookLM

/**
 * Add a "Speak text" button next to the Insert button
 * @param {Element} insertButton - The insert button
 * @returns {void}
 */
export function addSpeakButton(insertButton) {
  if (!insertButton || document.querySelector('.voice-to-text-speak-button')) {
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
  
  // Try to copy attributes from the original button to match styling
  try {
    // Copy Angular attributes if they exist
    const ngAttributes = Array.from(insertButton.attributes)
      .filter(attr => attr.name.startsWith('_ng') || attr.name.startsWith('ng-'));
    
    ngAttributes.forEach(attr => {
      speakButton.setAttribute(attr.name, attr.value);
    });
  } catch (error) {
    console.error('Error copying Angular attributes:', error);
  }
  
  // Fallback styling
  speakButton.style.cssText = `
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
    // Import startVoiceRecognition dynamically to avoid circular dependencies
    import('../voice/index.js').then(module => {
      module.startVoiceRecognition();
    }).catch(error => {
      console.error('Error loading voice recognition module:', error);
      alert('Could not start voice recognition. Please try again.');
    });
  });
  
  // Insert after the insert button
  try {
    insertButton.insertAdjacentElement('afterend', speakButton);
    console.log('Speak text button added successfully');
  } catch (error) {
    console.error('Error adding speak button:', error);
    
    // Alternative method: add to parent
    try {
      parentElement.appendChild(speakButton);
      console.log('Speak text button added to parent successfully');
    } catch (error2) {
      console.error('Error adding speak button to parent:', error2);
    }
  }
}

/**
 * Inject voice button into the NotebookLM UI
 * @param {Element} targetElement - The target element to inject the button into
 * @returns {void}
 */
export function injectVoiceButton(targetElement) {
  // Don't add if already exists
  if (document.querySelector('.voice-to-text-button')) {
    return;
  }
  
  // Create a button element
  const voiceButton = document.createElement('button');
  voiceButton.className = 'voice-to-text-button';
  
  // Try to copy Angular attributes if they exist
  try {
    const ngAttributes = Array.from(targetElement.attributes)
      .filter(attr => attr.name.startsWith('_ng') || attr.name.startsWith('ng-'));
    
    ngAttributes.forEach(attr => {
      voiceButton.setAttribute(attr.name, attr.value);
    });
  } catch (error) {
    console.error('Error copying Angular attributes:', error);
  }
  
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
  voiceButton.addEventListener('click', () => {
    console.log('Voice to Text button clicked');
    // Import startVoiceRecognition dynamically to avoid circular dependencies
    import('../voice/index.js').then(module => {
      module.startVoiceRecognition();
    }).catch(error => {
      console.error('Error loading voice recognition module:', error);
      alert('Could not start voice recognition. Please try again.');
    });
  });
  
  // Add to page
  try {
    targetElement.appendChild(voiceButton);
    console.log('Voice button injected successfully');
  } catch (error) {
    console.error('Error injecting voice button:', error);
    
    // Try to find a better insertion point
    try {
      const insertionPoint = targetElement.querySelector('div') || targetElement;
      insertionPoint.appendChild(voiceButton);
      console.log('Voice button injected into alternative element successfully');
    } catch (error2) {
      console.error('Failed to inject voice button at alternative position:', error2);
    }
  }
}
