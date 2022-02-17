import moment from 'moment';
import { getSettingValues, isCoreSetting } from 'data/DataSettings';
import { setElectronLoggerLevel } from 'utils/LogUtils';
import i18n from 'translations/i18n';

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

    i18n.changeLanguage(settings.language);

    moment.updateLocale('en', {
        week: {
            dow: settings.firstDayOfWeek || 0
        }
    });
}

export default Settings;