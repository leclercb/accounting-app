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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return !!conditionValue === !!objectValue;
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
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
                        title: 'Equals',
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
                        title: 'Does not equal',
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
                        title: 'Before',
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
                        title: 'Before or equals',
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
                        title: 'After',
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
                        title: 'After or equals',
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
                        title: 'Equals',
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
                        title: 'Does not equal',
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
                        title: 'Before',
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
                        title: 'Before or equals',
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
                        title: 'After',
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
                        title: 'After or equals',
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
                        title: 'Equals (compare date only)',
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
                        title: 'Does not equal (compare date only)',
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
                        title: 'Before (compare date only)',
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
                        title: 'Before or equals (compare date only)',
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
                        title: 'After (compare date only)',
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
                        title: 'After or equals (compare date only)',
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
                        title: 'Equals (compare date and time)',
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
                        title: 'Does not equal (compare date and time)',
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
                        title: 'Before (compare date and time)',
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
                        title: 'Before or equals (compare date and time)',
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
                        title: 'After (compare date and time)',
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
                        title: 'After or equals (compare date and time)',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    },
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) === (objectValue || 0);
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) !== (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) < (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) <= (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) > (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) === (objectValue || 0);
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) !== (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThan',
                        title: 'Greater than',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) < (objectValue || 0);
                        }
                    },
                    {
                        type: 'greaterThanOrEqual',
                        title: 'Greater than or equal',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) <= (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThan',
                        title: 'Less than',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || 0) > (objectValue || 0);
                        }
                    },
                    {
                        type: 'lessThanOrEqual',
                        title: 'Less than or equal',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
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
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            const objectValues = objectValue || [];
                            const conditionValues = conditionValue || [];

                            return conditionValues.every(conditionTag => objectValues.includes(conditionTag));
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
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
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            const objectTags = objectValue || [];
                            const conditionTags = conditionValue || [];

                            return conditionTags.every(conditionTag => objectTags.includes(conditionTag));
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'equalIgnoreCase',
                        title: 'Equals (ignore case)',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() === (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqualIgnoreCase',
                        title: 'Does not equal (ignore case)',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() !== (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'containIgnoreCase',
                        title: 'Contains (ignore case)',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').toUpperCase().includes((conditionValue || '').toUpperCase());
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'notContainIgnoreCase',
                        title: 'Does not contain (ignore case)',
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
                        title: 'Equals',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') === (objectValue || '');
                        }
                    },
                    {
                        type: 'equalIgnoreCase',
                        title: 'Equals (ignore case)',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() === (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'notEqual',
                        title: 'Does not equal',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '') !== (objectValue || '');
                        }
                    },
                    {
                        type: 'notEqualIgnoreCase',
                        title: 'Does not equal (ignore case)',
                        apply: (conditionValue, objectValue) => {
                            return (conditionValue || '').toUpperCase() !== (objectValue || '').toUpperCase();
                        }
                    },
                    {
                        type: 'contain',
                        title: 'Contains',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'containIgnoreCase',
                        title: 'Contains (ignore case)',
                        apply: (conditionValue, objectValue) => {
                            return (objectValue || '').toUpperCase().includes((conditionValue || '').toUpperCase());
                        }
                    },
                    {
                        type: 'notContain',
                        title: 'Does not contain',
                        apply: (conditionValue, objectValue) => {
                            return !(objectValue || '').includes(conditionValue || '');
                        }
                    },
                    {
                        type: 'notContainIgnoreCase',
                        title: 'Does not contain (ignore case)',
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