const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;
let backendServer;

// Start the backend server
function startBackendServer() {
  return new Promise((resolve, reject) => {
    try {
      // Import the server
      const serverModule = require('./cash-health-server.js');
      backendServer = serverModule.server;

      // Wait a bit for server to start
      setTimeout(() => {
        console.log('Backend server started successfully');
        resolve();
      }, 1000);
    } catch (error) {
      console.error('Error starting backend server:', error);
      reject(error);
    }
  });
}

// Create the main application window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'), // Optional: add an icon
    title: 'Cash Health Tracker',
    backgroundColor: '#e0f7fa'
  });

  // Load the frontend HTML
  mainWindow.loadFile('cash-health.html');

  // Open DevTools in development mode (optional)
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Create application menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow.reload();
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About Cash Health Tracker',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About Cash Health Tracker',
              message: 'Cash Health Tracker',
              detail: 'Version 1.0.0\n\nTrack your business cash flow and financial health.\n\nBuilt with Electron + Express + SQLite'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  try {
    // Start backend server first
    await startBackendServer();

    // Then create window
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Clean up on quit
app.on('before-quit', () => {
  console.log('Shutting down backend server...');
  if (backendServer) {
    backendServer.close();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});
