import { createSelector } from 'reselect';
import { getMovementFields as getMovementFieldsFromData } from 'data/DataMovementFields';
import { getSettings } from 'selectors/SettingSelectors';

export const getMovementFields = createSelector(
    getSettings,
    (settings) => {
        return getMovementFieldsFromData(settings);
    }
);
