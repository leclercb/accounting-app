import dayjs from 'dayjs';
import { getSettingValues, isCoreSetting } from 'data/DataSettings';
import { setElectronLoggerLevel } from 'utils/LogUtils';

const Settings = () => (state = {
    ...getSettingValues()
}, action) => {
    switch (action.type) {
        case 'SET_SETTINGS': {
            const coreSettings = {};

            if (!action.core) {
                Object.keys(state).forEach(settingId => {
                    if (isCoreSetting(settingId)) {
                        coreSettings[settingId] = state[settingId];
                    }
                });
            }

            const settings = {
                ...getSettingValues(),
                ...action.settings,
                ...coreSettings
            };

            onUpdateSettings(settings);

            return settings;
        }
        case 'UPDATE_SETTINGS': {
            const settings = {
                ...state,
                ...action.settings
            };

            onUpdateSettings(settings);

            return settings;
        }
        default:
            return state;
    }
};

function onUpdateSettings(settings) {
    setElectronLoggerLevel(settings.electronLoggerLevel || 'info');

    // TODO fix me for dayjs
    /*
    moment.updateLocale('en', {
        week: {
            dow: settings.firstDayOfWeek || 0
        }
    });
    */
}

export default Settings;