/**
 * Preload script for Electron
 * This script runs in a secure context between the main process and renderer
 * It exposes only safe, whitelisted APIs to the frontend
 */

const { contextBridge } = require('electron');

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // You can add custom APIs here if needed
  // For example:
  // getVersion: () => process.versions.electron
});

// Log that preload script loaded successfully
console.log('Preload script loaded successfully');
