const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Menu events
  onMenuNewCheque: (callback) => ipcRenderer.on('menu-new-cheque', callback),
  onMenuExportPdf: (callback) => ipcRenderer.on('menu-export-pdf', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  
  // Platform info
  platform: process.platform,
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // File operations (if needed in the future)
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  saveFile: (filePath, data) => ipcRenderer.invoke('save-file', filePath, data)
});

// Security: Remove node integration
delete window.require;
delete window.exports;
delete window.module;
