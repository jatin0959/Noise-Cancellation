const { ipcRenderer } = require('electron');

ipcRenderer.on('audio-devices', (event, devices) => {
  document.getElementById('audioDevices').textContent = devices;
});

document.getElementById('startButton').addEventListener('click', () => {
  const inputValue = document.getElementById('inputValue').value;
  const outputValue = document.getElementById('outputValue').value;
  
  ipcRenderer.send('start-audio-capture', { inputValue, outputValue });
  document.getElementById('status').textContent = 'Status: Audio capturing and processing...';
});

document.getElementById('stopButton').addEventListener('click', () => {
  ipcRenderer.send('stop-audio-capture');
  document.getElementById('status').textContent = 'Status: Stopping audio capture...';
});

ipcRenderer.on('audio-capture-status', (event, status) => {
  document.getElementById('status').textContent = `Status: ${status}`;
});
