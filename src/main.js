const { BrowserWindow} = require('electron')

let window;

//Creacion de ventanas
function createWindow() {

    window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true
        }
    })
    window.loadFile('src/ui/gestion.html');
}

function prueba() {
    console.log('Esta funcioanando la funcion desde el main');
}


module.exports = {
    createWindow,
    prueba
}