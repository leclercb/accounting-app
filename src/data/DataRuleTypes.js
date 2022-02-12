import { addColorsToArray } from 'utils/ColorUtils';

export function getRuleType(ruleTypeId) {
    return getRuleTypes().find(ruleType => ruleType.id === ruleTypeId);
}

export function getRuleTypes() {
    return addColorsToArray([
        {
            id: 'includes',
            title: 'Contient'
        }
    ]);
}