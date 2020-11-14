console.log("working")
//import fs from 'fs';
const { BrowserWindow, app } = require('electron')


function createWindow() {
    const win = new BrowserWindow({
        height: 800,
        width: 1200,
        backgroundColor: 'white',
        webPreferences: {
            nodeIntegration: false,
            worldSafeExecuteJavaScript: true,
            contextIsolation: true,
        }
    })

    win.loadFile('index.html');
}

app.whenReady().then(createWindow)