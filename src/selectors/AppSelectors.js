import { createSelector } from 'reselect';
import { getSettings } from 'selectors/SettingSelectors';
import { verifyLicense } from 'utils/LicenseUtils';

export const getLicenseInfo = createSelector(
    getSettings,
    (settings) => {
        return verifyLicense(settings.license) || null;
    }
);

export const isPro = createSelector(
    getLicenseInfo,
    (licenseInfo) => {
        return !!licenseInfo;
    }
);

export const getDataUuid = state => state.app.dataUuid;
export const getStartDate = state => state.app.startDate;

export const getEditingCell = state => state.app.editingCell;

export const getMovementTableScrollProps = state => state.app.movementTableScrollProps;

export const getMatchingRulesManager = state => state.app.matchingRulesManager;
export const getSettingManager = state => state.app.settingManager;