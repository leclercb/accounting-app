import { createSelector } from 'reselect';
import { getSettingValues } from 'data/DataSettings';
import { getSettings } from 'selectors/SettingSelectors';

export const getSettingsIncludingDefaults = createSelector(
    getSettings,
    (settings) => {
        return {
            ...getSettingValues(),
            ...settings
        };
    });