import { t } from 'translations/i18n';
import moment from 'moment';

export function getConditionsForType(type) {
    return getFieldFilterType(type).conditions;
}

export function getConditionsFieldTypeForType(type) {
    return getFieldFilterType(type).conditionsFieldType;
}

function getFieldFilterType(type) {
    switch (type) {
        case 'boolean': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue === !!objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue !== !!objectValue;
                        }
                    }
                ],
                conditionsFieldType: 'boolean'
            };
        }
        case 'category': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    }
                ],
                conditionsFieldType: 'category'
            };
        }
        case 'color': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    }
                ],
                conditionsFieldType: 'color'
            };
        }
        case 'date': {
            return {
                conditions: [
                    {
                        type: 'dateEqual',
                        title: t('condition.dateEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateNotEqual',
                        title: t('condition.dateNotEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateBefore',
                        title: t('condition.dateBefore'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateBeforeOrEqual',
                        title: t('condition.dateBeforeOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfter',
                        title: t('condition.dateAfter'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfterOrEqual',
                        title: t('condition.dateAfterOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeEqual',
                        title: t('condition.dateTimeEqual'),
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeNotEqual',
                        title: t('condition.dateTimeNotEqual'),
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeBefore',
                        title: t('condition.dateTimeBefore'),
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeBeforeOrEqual',
                        title: t('condition.dateTimeBeforeOrEqual'),
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeAfter',
                        title: t('condition.dateTimeAfter'),
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeAfterOrEqual',
                        title: t('condition.dateTimeAfterOrEqual'),
                        visible: false,
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'day');
                        }
                    }
                ],
                conditionsFieldType: 'date'
            };
        }
        case 'dateTime': {
            return {
                conditions: [
                    {
                        type: 'dateEqual',
                        title: t('condition.dateEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateNotEqual',
                        title: t('condition.dateNotEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'day');
                        }
                    },
                    {
                        type: 'dateBefore',
                        title: t('condition.dateBefore'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateBeforeOrEqual',
                        title: t('condition.dateBeforeOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfter',
                        title: t('condition.dateAfter'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateAfterOrEqual',
                        title: t('condition.dateAfterOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'day');
                        }
                    },
                    {
                        type: 'dateTimeEqual',
                        title: t('condition.dateTimeEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return true;
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(conditionValue).isSame(moment(objectValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeNotEqual',
                        title: t('condition.dateTimeNotEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue && !objectValue) {
                                return false;
                            }

                            if (!conditionValue || !objectValue) {
                                return true;
                            }

                            return !moment(conditionValue).isSame(moment(objectValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeBefore',
                        title: t('condition.dateTimeBefore'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isBefore(moment(conditionValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeBeforeOrEqual',
                        title: t('condition.dateTimeBeforeOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrBefore(moment(conditionValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeAfter',
                        title: t('condition.dateTimeAfter'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isAfter(moment(conditionValue), 'minute');
                        }
                    },
                    {
                        type: 'dateTimeAfterOrEqual',
                        title: t('condition.dateTimeAfterOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            if (Number.isInteger(conditionValue)) {
                                conditionValue = moment().add(Number.parseInt(conditionValue), 'day').toISOString();
                            }

                            if (!conditionValue || !objectValue) {
                                return false;
                            }

                            return moment(objectValue).isSameOrAfter(moment(conditionValue), 'minute');
                        }
                    }
                ],
                conditionsFieldType: 'dateTime'
            };
        }
        case 'file': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    },
                    {
                        type: 'contain',
                        title: t('condition.contain'),
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'notContain',
                        title: t('condition.notContain'),
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue || '');
                        }
                    }
                ],
                conditionsFieldType: 'file'
            };
        }
        case 'money': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) === (objectValue || 0);
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) !== (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: t('condition.greaterThan'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) < (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: t('condition.greaterThanOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) <= (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThan',
                        title: t('condition.lessThan'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) > (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: t('condition.lessThanOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) >= (objectValue || 0);
                        }
                    }
                ],
                conditionsFieldType: 'money'
            };
        }
        case 'number': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) === (objectValue || 0);
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) !== (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: t('condition.greaterThan'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) < (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: t('condition.greaterThanOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) <= (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThan',
                        title: t('condition.lessThan'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) > (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: t('condition.lessThanOrEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) >= (objectValue || 0);
                        }
                    }
                ],
                conditionsFieldType: 'number'
            };
        }
        case 'select': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    }
                ],
                conditionsFieldType: 'select'
            };
        }
        case 'selectMultiple': {
            return {
                conditions: [
                    {
                        type: 'contain',
                        title: t('condition.contain'),
                        apply: (conditionValue, objectValue) => {
                            const objectValues = objectValue || [];
                            const conditionValues = conditionValue || [];

                            return conditionValues.every(conditionTag => objectValues.includes(conditionTag));
                        }
                    },
                    {
                        type: 'notContain',
                        title: t('condition.notContain'),
                        apply: (conditionValue, objectValue) => {
                            const objectValues = objectValue || [];
                            const conditionValues = conditionValue || [];

                            return !conditionValues.every(conditionTag => objectValues.includes(conditionTag));
                        }
                    }
                ],
                conditionsFieldType: 'selectMultiple'
            };
        }
        case 'selectTags': {
            return {
                conditions: [
                    {
                        type: 'contain',
                        title: t('condition.contain'),
                        apply: (conditionValue, objectValue) => {
                            const objectTags = objectValue || [];
                            const conditionTags = conditionValue || [];

                            return conditionTags.every(conditionTag => objectTags.includes(conditionTag));
                        }
                    },
                    {
                        type: 'notContain',
                        title: t('condition.notContain'),
                        apply: (conditionValue, objectValue) => {
                            const objectTags = objectValue || [];
                            const conditionTags = conditionValue || [];

                            return !conditionTags.every(conditionTag => objectTags.includes(conditionTag));
                        }
                    }
                ],
                conditionsFieldType: 'selectTags'
            };
        }
        case 'textarea': {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'equalIgnoreCase',
                        title: t('condition.equalIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() === (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqualIgnoreCase',
                        title: t('condition.notEqualIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() !== (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'contain',
                        title: t('condition.contain'),
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'containIgnoreCase',
                        title: t('condition.containIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').toUpperCase().includes((conditionValue || '').toUpperCase());
                        }
                    },
                    {
                        type: 'notContain',
                        title: t('condition.notContain'),
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'notContainIgnoreCase',
                        title: t('condition.notContainIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').toUpperCase().includes((conditionValue || '').toUpperCase());
                        }
                    }
                ],
                conditionsFieldType: 'textarea'
            };
        }
        case 'text':
        default: {
            return {
                conditions: [
                    {
                        type: 'equal',
                        title: t('condition.equal'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'equalIgnoreCase',
                        title: t('condition.equalIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() === (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'notEqual',
                        title: t('condition.notEqual'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqualIgnoreCase',
                        title: t('condition.notEqualIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() !== (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'contain',
                        title: t('condition.contain'),
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'containIgnoreCase',
                        title: t('condition.containIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').toUpperCase().includes((conditionValue || '').toUpperCase());
                        }
                    },
                    {
                        type: 'notContain',
                        title: t('condition.notContain'),
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'notContainIgnoreCase',
                        title: t('condition.notContainIgnoreCase'),
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').toUpperCase().includes((conditionValue || '').toUpperCase());
                        }
                    }
                ],
                conditionsFieldType: 'text'
            };
        }
    }
}