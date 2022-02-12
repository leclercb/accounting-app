import { store } from 'store/Store';
import {
    saveData,
    setSettingManagerOptions
} from 'actions/AppActions';

export function initializeShortcuts() {
    const { ipcRenderer } = window.electron;

    ipcRenderer.on('menu-save', async () => {
        await executeSave();
    });

    ipcRenderer.on('menu-settings', async () => {
        await executeSettings();
    });
}

async function executeSave() {
    await store.dispatch(saveData());
}

async function executeSettings() {
    await store.dispatch(setSettingManagerOptions({ visible: true }));
}