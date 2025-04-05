
# Voice to Text for Google NotebookLM

This Chrome extension allows you to add source material to Google NotebookLM using voice dictation.

## Setup Instructions

### Converting Icons
Before loading the extension, you need to convert the base64 icon files to PNG:

1. Run the conversion script:
```
node scripts/convert-icons.js
```

This will create the proper PNG files in the `public/icons` directory.

### Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top-right corner
3. Click "Load unpacked"
4. Select the `public` directory from this project
5. The extension should now be loaded and available in your Chrome browser

## Features

- Speech-to-text conversion for adding source material to Google NotebookLM
- Multiple language support for voice recognition
- Customizable settings for automatic insertion and confirmation

## Usage

1. Navigate to Google NotebookLM
2. Look for the "Speak" button when adding source material
3. Click the button and start speaking
4. Your dictation will be converted to text and added as source material

## Settings

You can configure the extension by clicking on its icon in the Chrome toolbar:

- **Recognition Language**: Choose your preferred language for speech recognition
- **Auto-insert after speaking**: Automatically insert text when you stop speaking
- **Confirm before adding**: Ask for confirmation before automatically adding text
