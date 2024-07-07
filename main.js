const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false // Disable context isolation for simplicity
    }
  });

  mainWindow.loadFile('index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Fetch available audio devices
  const { stdout, stderr } = spawn('python3', ['-m', 'sounddevice']);
  let availableDevices = '';

  stdout.on('data', (data) => {
    availableDevices += data.toString();
  });

  stdout.on('end', () => {
    mainWindow.webContents.send('audio-devices', availableDevices);
  });

  stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('start-audio-capture', (event, args) => {
  const { inputValue, outputValue } = args;

  if (!pythonProcess) {
    pythonProcess = spawn('python', ['denoiser/live.py', '--in', inputValue, '--out', outputValue]);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      mainWindow.webContents.send('audio-capture-status', data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      pythonProcess = null;
      mainWindow.webContents.send('audio-capture-status', 'Audio capturing stopped.');
    });
  }
});

ipcMain.on('stop-audio-capture', () => {
  if (pythonProcess) {
    pythonProcess.kill();
    pythonProcess = null;
    mainWindow.webContents.send('audio-capture-status', 'Audio capturing stopped.');
  }
});
