process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const { app } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const { initializeIpc } = require('./electronIpc.js');
const { initializeMenu } = require('./electronMenu.js');
const { createMainWindow, createTray, getCoreSettings, getDefaultWindow } = require('./electronUtils.js');

const settings = getCoreSettings();
log.transports.file.level = settings.electronLoggerLevel || 'info';

log.info('Starting Accouting');

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.logger = log;

// eslint-disable-next-line no-unused-vars
let tray = null; // To avoid being garbage collected
let quitInitiated = false;

initializeIpc(value => quitInitiated = value);
initializeMenu();

app.on('ready', () => {
    createMainWindow(settings, () => quitInitiated);

    if (settings.useTray) {
        tray = createTray(); // eslint-disable-line no-unused-vars
    }
});

app.on('before-quit', () => {
    quitInitiated = true;
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