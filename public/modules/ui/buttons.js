
// Button creation and injection for Voice to Text for Google NotebookLM

/**
 * Add a "Speak text" button next to the Insert button
 * @param {Element} insertButton - The insert button
 * @returns {void}
 */
function addSpeakButton(insertButton) {
  if (!insertButton) {
    console.error('Insert button not provided');
    return;
  }
  
  // Don't add if already exists
  const existingButton = document.querySelector('.voice-to-text-speak-button');
  if (existingButton) {
    console.log('Speak button already exists, not adding again');
    return;
  }
  
  console.log('Adding Speak text button next to:', insertButton);
  
  const speakButton = document.createElement('button');
  speakButton.className = 'voice-to-text-speak-button';
  speakButton.setAttribute('aria-label', 'Speak text');
  speakButton.setAttribute('type', 'button'); // Ensure it's not a submit button
  
  // Try to copy the styles of the Insert button
  try {
    const buttonClasses = Array.from(insertButton.classList);
    
    // Copy classes but exclude some specific ones
    const classesToCopy = buttonClasses.filter(cls => 
      !cls.includes('disabled') && 
      !cls.includes('primary') && 
      !cls.includes('unelevated')
    );
    
    speakButton.classList.add(...classesToCopy);
    speakButton.classList.add('mat-mdc-button-base');
    
    // Force some styling to make it look like a secondary button
    speakButton.style.marginLeft = '8px';
    speakButton.style.backgroundColor = '#f1f3f4';
    speakButton.style.color = '#5f6368';
  } catch (error) {
    console.error('Error copying button styles:', error);
  }
  
  // Create button content using DOM methods to match Angular Material style
  const rippleSpan = document.createElement('span');
  rippleSpan.className = 'mat-mdc-button-persistent-ripple mdc-button__ripple';
  speakButton.appendChild(rippleSpan);
  
  // Create mic icon
  const micIcon = window.createSvgElement("M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19L12 22");
  micIcon.style.marginRight = "8px";
  micIcon.style.width = "16px";
  micIcon.style.height = "16px";
  speakButton.appendChild(micIcon);
  
  // Add the label span
  const buttonLabel = document.createElement('span');
  buttonLabel.className = 'mdc-button__label';
  buttonLabel.textContent = "Speak text";
  speakButton.appendChild(buttonLabel);
  
  // Add focus indicator
  const focusIndicator = document.createElement('span');
  focusIndicator.className = 'mat-focus-indicator';
  speakButton.appendChild(focusIndicator);
  
  // Add touch target for mobile
  const touchTarget = document.createElement('span');
  touchTarget.className = 'mat-mdc-button-touch-target';
  speakButton.appendChild(touchTarget);
  
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
  
  // Insert the button after the Insert button
  try {
    // Get the parent of the Insert button
    const buttonParent = insertButton.parentElement;
    if (!buttonParent) {
      throw new Error('Insert button has no parent element');
    }
    
    // Insert directly after the insert button
    insertButton.insertAdjacentElement('afterend', speakButton);
    console.log('Speak text button added successfully using insertAdjacentElement');
    return;
  } catch (insertError) {
    console.error('Error inserting button after Insert button:', insertError);
    
    // Try to find a form or container element
    try {
      const form = insertButton.closest('form');
      if (form) {
        form.appendChild(speakButton);
        console.log('Speak text button added to form');
        return;
      }
    } catch (formError) {
      console.error('Error adding button to form:', formError);
    }
    
    // Last resort - try to add it to the parent of the parent
    try {
      const grandparent = insertButton.parentElement?.parentElement;
      if (grandparent) {
        grandparent.appendChild(speakButton);
        console.log('Speak text button added to grandparent');
      }
    } catch (grandparentError) {
      console.error('Error adding button to grandparent:', grandparentError);
    }
  }
}

// This function is now deprecated - we'll focus only on the dialog
function injectVoiceButton(targetElement) {
  console.log('injectVoiceButton is now deprecated');
  // We're not adding this button to the main interface anymore
}

// Make functions globally available
window.addSpeakButton = addSpeakButton;
window.injectVoiceButton = injectVoiceButton;
