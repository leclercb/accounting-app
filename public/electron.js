process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app } = require('electron');
const log = require('electron-log');

const { initializeIpc } = require('./electronIpc.js');
const { initializeMenu } = require('./electronMenu.js');
const { createMainWindow, getCoreSettings, getDefaultWindow } = require('./electronUtils.js');

const settings = getCoreSettings();
log.transports.file.level = settings.electronLoggerLevel || 'info';

log.info('Starting Accouting');

initializeIpc();
initializeMenu();

app.on('ready', () => {
    createMainWindow(settings);
});

app.on('window-all-closed', () => {
    log.info('Quit');
    app.quit();
});

app.on('open-url', (event, url) => {
    event.preventDefault();
    log.info('Open URL', url);

    let window = getDefaultWindow();

    if (window) {
        window.webContents.send('open-url', url);
    }
});