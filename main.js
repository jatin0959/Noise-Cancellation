const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow; // Reference to the main window (if needed)

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // Enable Node.js integration
    }
  });

  // Load the index.html of the app.
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  // Open DevTools - Remove this line for production
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create the main window when Electron has finished initializing
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common for applications and their menu bar to stay active until the user quits explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// On macOS, recreate a window if there are none when the dock icon is clicked and there are no other windows open.
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});



// Example of creating a new window using a menu item or event
// Here, you can call createNewWindow() when you want to create a new window, for example, from a menu item or an event handler.
