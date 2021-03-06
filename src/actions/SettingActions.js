import {
    loadFromFile,
    saveToFile
} from 'actions/ActionUtils';
import { getSettings } from 'selectors/SettingSelectors';

export const loadSettingsFromFile = (file, core = false) => {
    return async dispatch => {
        const data = await dispatch(loadFromFile('settings', file));
        await dispatch(setSettings(data, core));
    };
};

export function saveSettingsToFile(file, data) {
    return saveToFile('settings', file, data);
}

export const setSettings = (settings, core = false) => {
    return async dispatch => {
        await dispatch({
            type: 'SET_SETTINGS',
            core,
            settings
        });
    };
};

export function updateSettings(settings) {
    return async (dispatch, getState) => {
        await dispatch({
            type: 'UPDATE_SETTINGS',
            settings
        });

        return getSettings(getState());
    };
}

export function setSelectedView(view) {
    return updateSettings({
        selectedView: view
    });
}

export function setMovementFile(movementFile) {
    return updateSettings({
        movementFile
    });
}