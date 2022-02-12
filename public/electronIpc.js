const { app, dialog, ipcMain, shell, BrowserWindow } = require('electron');
const log = require('electron-log');
const fse = require('fs-extra');
const os = require('os');
const path = require('path');

function initializeIpc() {
    ipcMain.handle('app-get-path', (event, p) => {
        return app.getPath(p);
    });

    ipcMain.on('app-get-path-sync', (event, p) => {
        event.returnValue = app.getPath(p);
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
}

module.exports = {
    initializeIpc
};