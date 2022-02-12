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

export function updateSettings(settings, options) {
    options = Object.assign({
        skipServerUpdate: false,
        skipDiff: false
    }, options);

    return async (dispatch, getState) => {
        const oldSettings = getSettings(getState());

        await dispatch({
            type: 'UPDATE_SETTINGS',
            settings
        });

        const newSettings = getSettings(getState());

        await dispatch({
            type: 'POST_UPDATE_SETTINGS',
            settings,
            oldSettings,
            newSettings,
            options
        });

        return newSettings;
    };
}

export function setSelectedView(view) {
    return updateSettings({
        selectedView: view
    }, { skipServerUpdate: true });
}