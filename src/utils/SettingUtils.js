import moment from 'moment';
import { isCoreSetting } from 'data/DataSettings';
import { getConfidence } from 'data/DataConfidences';

export function filterSettings(settings, core) {
    const newSettings = {};

    Object.keys(settings).forEach(settingId => {
        if ((core && isCoreSetting(settingId)) || (!core && !isCoreSetting(settingId))) {
            newSettings[settingId] = settings[settingId];
            return;
        }
    });

    return newSettings;
}

export function formatDate(date, settings, showTime = true) {
    if (!showTime) {
        return moment(date).format(settings.dateFormat);
    }

    return moment(date).format(`${settings.dateFormat} ${settings.timeFormat}`);
}

export function getCategoryForegroundColor() {
    return 'initial';
}

export function getCategoryBackgroundColor(category, index, settings) {
    return index % 2 === 0 ? settings.evenColor : settings.oddColor;
}

export function getMovementForegroundColor() {
    return 'initial';
}

export function getMovementBackgroundColor(movement) {
    const confidence = getConfidence(movement.confidence);
    return confidence ? confidence.color : 'initial';
}

export function getRuleForegroundColor() {
    return 'initial';
}

export function getRuleBackgroundColor(rule) {
    const confidence = getConfidence(rule.confidence);
    return confidence ? confidence.color : 'initial';
}