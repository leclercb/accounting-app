import { message } from 'antd';
import {
    saveData,
    setSettingManagerOptions
} from 'actions/AppActions';
import { redoMovementStateUpdate, undoMovementStateUpdate } from 'actions/MovementActions';
import { redoRuleStateUpdate, undoRuleStateUpdate } from 'actions/RuleActions';
import { canRedoMovementStateUpdate, canUndoMovementStateUpdate } from 'selectors/MovementSelectors';
import { canRedoRuleStateUpdate, canUndoRuleStateUpdate } from 'selectors/RuleSelectors';
import { getSelectedView } from 'selectors/SettingSelectors';
import { store } from 'store/Store';
import { t } from 'translations/i18n';

export function initializeShortcuts() {
    const { ipcRenderer } = window.electron;

    ipcRenderer.on('menu-save', async () => {
        await executeSave();
    });

    ipcRenderer.on('menu-settings', async () => {
        await executeSettings();
    });

    ipcRenderer.on('menu-undo', async () => {
        await executeUndo();
    });

    ipcRenderer.on('menu-redo', async () => {
        await executeRedo();
    });
}

async function executeSave() {
    await store.dispatch(saveData());
}

async function executeSettings() {
    await store.dispatch(setSettingManagerOptions({ visible: true }));
}

async function executeUndo() {
    const state = store.getState();
    const selectedView = getSelectedView(state);

    switch (selectedView) {
        case 'movements':
            if (canUndoMovementStateUpdate(state)) {
                await store.dispatch(undoMovementStateUpdate());
                message.success(t('undo_action'));
            } else {
                message.warning(t('nothing_to_undo'));
            }
            break;
        case 'rules':
            if (canUndoRuleStateUpdate(state)) {
                await store.dispatch(undoRuleStateUpdate());
                message.success(t('undo_action'));
            } else {
                message.warning(t('nothing_to_undo'));
            }
            break;
        default:
            break;
    }
}

async function executeRedo() {
    const state = store.getState();
    const selectedView = getSelectedView(state);

    switch (selectedView) {
        case 'note':
            if (canRedoMovementStateUpdate(state)) {
                await store.dispatch(redoMovementStateUpdate());
                message.success(t('redo_action'));
            } else {
                message.warning(t('nothing_to_redo'));
            }
            break;
        case 'task':
        case 'taskCalendar':
            if (canRedoRuleStateUpdate(state)) {
                await store.dispatch(redoRuleStateUpdate());
                message.success(t('redo_action'));
            } else {
                message.warning(t('nothing_to_redo'));
            }
            break;
        default:
            break;
    }
}