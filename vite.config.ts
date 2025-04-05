
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readFileSync, writeFileSync } from 'fs';

// Custom plugin to remove GPT Engineer script from the index.html during build
const removeGptEngineerScript = () => {
  return {
    name: 'remove-gpt-engineer-script',
    closeBundle() {
      try {
        // Path to the built index.html
        const htmlPath = path.resolve(__dirname, 'public/index.html');
        // Read the file
        let html = readFileSync(htmlPath, 'utf-8');
        // Remove the GPT Engineer script tag
        html = html.replace(/<script src="https:\/\/cdn\.gpteng\.co\/gptengineer\.js".*?><\/script>/g, '<!-- GPT Engineer script removed for production build -->');
        // Write the modified file
        writeFileSync(htmlPath, html);
        console.log('Successfully removed GPT Engineer script from production build');
      } catch (error) {
        console.error('Error removing GPT Engineer script:', error);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    mode === 'production' && removeGptEngineerScript(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Build directly to public directory for Chrome extension
  build: {
    outDir: 'public',
    emptyOutDir: false, // Don't delete the existing icons and manifest
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    }
  }
}));
