const { ipcRenderer } = require('electron');

document.getElementById('loginButton').addEventListener('click', () => {
    const term = document.getElementById('term').value;
    const location = document.getElementById('location').value;
    ipcRenderer.send('search', { term, location });
});