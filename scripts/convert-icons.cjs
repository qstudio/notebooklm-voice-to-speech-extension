
// This script converts the base64 encoded icon files to PNG files
const fs = require('fs');
const path = require('path');

// Ensure directories exist
const iconDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Function to convert base64 to PNG
const convertBase64ToPng = (base64Path, pngPath) => {
  try {
    // Read the base64 file
    const base64Content = fs.readFileSync(base64Path, 'utf8');
    
    // Extract just the base64 data (remove any prefixes if present)
    const base64Data = base64Content.replace(/^data:image\/png;base64,/, '');
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Write the PNG file
    fs.writeFileSync(pngPath, imageBuffer);
    
    console.log(`Converted ${base64Path} to ${pngPath}`);
  } catch (error) {
    console.error(`Error converting ${base64Path}:`, error.message);
  }
};

// Convert all icon files
const iconSizes = [16, 48, 128];
iconSizes.forEach(size => {
  const base64Path = path.join(__dirname, `../public/icons/icon${size}.png.base64`);
  const pngPath = path.join(iconDir, `icon${size}.png`);
  
  // Check if base64 file exists
  if (fs.existsSync(base64Path)) {
    convertBase64ToPng(base64Path, pngPath);
  } else {
    console.warn(`Warning: ${base64Path} does not exist.`);
  }
});

console.log('Icon conversion complete!');
