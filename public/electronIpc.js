const { app, dialog, ipcMain, shell, BrowserWindow } = require('electron');
const { autoUpdater, CancellationToken } = require('electron-updater');
const log = require('electron-log');
const fse = require('fs-extra');
const os = require('os');
const path = require('path');

let websiteWindow = null;

function initializeIpc(setQuitInitiated) {
    ipcMain.handle('app-get-path', (event, p) => {
        return app.getPath(p);
    });

    ipcMain.on('app-get-path-sync', (event, p) => {
        event.returnValue = app.getPath(p);
    });

    ipcMain.handle('app-get-version', () => {
        return app.getVersion();
    });

    ipcMain.handle('app-set-badge-count', (event, count) => {
        app.setBadgeCount(count);
    });

    ipcMain.handle('auto-updater-check-updates', () => {
        return autoUpdater.checkForUpdates();
    });

    ipcMain.handle('auto-updater-download-update', async event => {
        const downloadProgressHandler = info => {
            event.sender.send('download-progress', info);
        };

        const updateDownloadedHandler = info => {
            autoUpdater.removeListener('download-progress', downloadProgressHandler);
            autoUpdater.removeListener('update-downloaded', updateDownloadedHandler);
            event.sender.send('update-downloaded', info);
        };

        autoUpdater.on('download-progress', downloadProgressHandler);
        autoUpdater.on('update-downloaded', updateDownloadedHandler);

        try {
            return await autoUpdater.downloadUpdate(new CancellationToken());
        } catch (e) {
            autoUpdater.removeListener('download-progress', downloadProgressHandler);
            autoUpdater.removeListener('update-downloaded', updateDownloadedHandler);
            throw e;
        }
    });

    ipcMain.handle('auto-updater-quit-and-install', () => {
        autoUpdater.quitAndInstall();
    });

    ipcMain.handle('current-window-close', event => {
        BrowserWindow.fromWebContents(event.sender).close();
    });

    ipcMain.handle('current-window-get-position', event => {
        return BrowserWindow.fromWebContents(event.sender).getPosition();
    });

    ipcMain.handle('current-window-get-size', event => {
        return BrowserWindow.fromWebContents(event.sender).getSize();
    });

    ipcMain.handle('dialog-show-open-dialog', (event, options) => {
        return dialog.showOpenDialog(options);
    });

    ipcMain.handle('dialog-show-save-dialog', (event, options) => {
        return dialog.showSaveDialog(options);
    });

    ipcMain.handle('fse-access', (event, p) => {
        return fse.access(p, fse.constants.F_OK);
    });

    ipcMain.handle('fse-copy-file', (event, src, dest) => {
        return fse.copyFile(src, dest);
    });

    ipcMain.handle('fse-ensure-dir', (event, p) => {
        return fse.ensureDir(p);
    });

    ipcMain.handle('fse-lstat', (event, p) => {
        return fse.lstat(p);
    });

    ipcMain.handle('fse-read-file', (event, p, encoding) => {
        return fse.readFile(p, encoding);
    });

    ipcMain.handle('fse-readdir', (event, p) => {
        return fse.readdir(p);
    });

    ipcMain.handle('fse-remove', (event, p) => {
        return fse.remove(p);
    });

    ipcMain.handle('fse-write-file', (event, file, data) => {
        return fse.writeFile(file, data);
    });

    ipcMain.handle('initiate-quit', () => {
        setQuitInitiated(true);
    });

    ipcMain.handle('log', (event, type, ...params) => {
        log[type](...params);
    });

    ipcMain.handle('log-get-file', () => {
        return log.transports.file.resolvePath;
    });

    ipcMain.handle('log-set-level', (event, level) => {
        log.transports.file.level = level;
    });

    ipcMain.handle('os-platform', () => {
        return os.platform();
    });

    ipcMain.handle('path-dirname', (event, p) => {
        return path.dirname(p);
    });

    ipcMain.on('path-join-sync', (event, ...paths) => {
        event.returnValue = path.join(...paths);
    });

    ipcMain.handle('process-get-env', () => {
        return {
            ACCOUNTING_DATA_FOLDER: process.env.ACCOUNTING_DATA_FOLDER
        };
    });

    ipcMain.handle('shell-open-external', (event, url) => {
        shell.openExternal(url);
    });

    ipcMain.handle('shell-open-path', (event, p) => {
        shell.openPath(p);
    });

    ipcMain.handle('open-website', () => {
        const url = 'https://www.google.be';

        if (!websiteWindow) {
            websiteWindow = new BrowserWindow(Object.assign({
                show: false,
                icon: path.join(__dirname, 'resources', 'images', 'logo.png'),
                webPreferences: {
                    contextIsolation: true,
                    enableRemoteModule: false,
                    nodeIntegration: false,
                    preload: path.join(__dirname, 'electronPreload.js'),
                    webSecurity: false
                }
            }));

            websiteWindow.setAlwaysOnTop(true);

            websiteWindow.loadURL(url);

            websiteWindow.once('ready-to-show', () => {
                websiteWindow.show();
            });

            websiteWindow.on('close', () => {
                websiteWindow = null;
            });

            return;
        }

        websiteWindow.loadURL(url);
        websiteWindow.show();
    });

    ipcMain.handle('auto-fill', (event, options) => {
        websiteWindow.webContents.executeJavaScript(`document.getElementsByName('q')[0].value="${options.value}"`);
    });
}

module.exports = {
    initializeIpc
};