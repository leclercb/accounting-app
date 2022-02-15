import { getCategories } from 'data/DataCategories';
import { getConfidences } from 'data/DataConfidences';
import { getMovementFields } from 'data/DataMovementFields';
import { getOperations } from 'data/DataOperations';
import moment from 'moment';
import { getSettings } from 'selectors/SettingSelectors';
import {
    compareBooleans,
    compareDates,
    compareNumbers,
    compareObjects,
    compareStrings
} from 'utils/CompareUtils';
import {
    toString,
    toStringArray,
    toStringBoolean,
    toStringDate,
    toStringNumber,
    toStringObject
} from 'utils/StringUtils';

export function getFieldTypes() {
    return [
        'boolean',
        'category',
        'color',
        'confidence',
        'date',
        'dateTime',
        'file',
        'money',
        'movementField',
        'number',
        'operation',
        'select',
        'selectMultiple',
        'selectTags',
        'text',
        'textarea'
    ];
}

export function getWidthForType(type) {
    return getFieldType(type).width;
}

export function isAlwaysInEditionForType(type) {
    return getFieldType(type).alwaysInEdition;
}

export function getValuePropNameForType(type) {
    return getFieldType(type).valuePropName;
}

export function getCompareForType(type, a, b, state) {
    return getFieldType(type).compare(a, b, state);
}

export function getToStringForType(type, options, value, state) {
    return getFieldType(type, options).toString(value, state);
}

export function getFieldType(type, options) {
    switch (type) {
        case 'boolean': {
            return {
                title: 'Boolean',
                allowCreation: true,
                width: 80,
                alwaysInEdition: true,
                valuePropName: 'checked',
                compare: (a, b) => compareBooleans(a, b),
                toString: value => toStringBoolean(value),
                options: []
            };
        }
        case 'category': {
            return {
                title: 'Category',
                allowCreation: true,
                width: 200,
                alwaysInEdition: true,
                valuePropName: 'value',
                compare: (a, b) => compareObjects(a, b, getCategories()),
                toString: (value) => toStringObject(value, getCategories()),
                options: []
            };
        }
        case 'color': {
            return {
                title: 'Color',
                allowCreation: true,
                width: 100,
                alwaysInEdition: false,
                valuePropName: 'color',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
        case 'confidence': {
            return {
                title: 'Confidence',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareObjects(a, b, getConfidences()),
                toString: (value) => toStringObject(value, getConfidences()),
                options: []
            };
        }
        case 'date': {
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';

            return {
                title: 'Date',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => {
                    if (Number.isInteger(a)) {
                        a = moment().add(Number.parseInt(a), 'day').toISOString();
                    }

                    if (Number.isInteger(b)) {
                        b = moment().add(Number.parseInt(b), 'day').toISOString();
                    }

                    return compareDates(a, b, false);
                },
                toString: value => {
                    if (Number.isInteger(value)) {
                        value = moment().add(Number.parseInt(value), 'day').toISOString();
                    }

                    return toStringDate(value, dateFormat);
                },
                options: [
                    {
                        id: 'dateFormat',
                        title: 'Date format',
                        type: 'text'
                    }
                ]
            };
        }
        case 'dateTime': {
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';
            const timeFormat = options && options.timeFormat ? options.timeFormat : 'HH:mm';

            return {
                title: 'Date time',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => {
                    if (Number.isInteger(a)) {
                        a = moment().add(Number.parseInt(a), 'day').toISOString();
                    }

                    if (Number.isInteger(b)) {
                        b = moment().add(Number.parseInt(b), 'day').toISOString();
                    }

                    return compareDates(a, b, true);
                },
                toString: value => {
                    if (Number.isInteger(value)) {
                        value = moment().add(Number.parseInt(value), 'day').toISOString();
                    }

                    return toStringDate(value, `${dateFormat} ${timeFormat}`);
                },
                options: [
                    {
                        id: 'dateFormat',
                        title: 'Date format',
                        type: 'text'
                    },
                    {
                        id: 'timeFormat',
                        title: 'Time format',
                        type: 'text'
                    }
                ]
            };
        }
        case 'file': {
            return {
                title: 'File',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
        case 'money': {
            const currency = options && options.currency ? options.currency : '€';

            return {
                title: 'Money',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, currency + ' '),
                options: [
                    {
                        id: 'currency',
                        title: 'Currency',
                        type: 'text'
                    }
                ]
            };
        }
        case 'movementField': {
            return {
                title: 'Mouvement Field',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b, state) => compareObjects(a, b, getMovementFields(getSettings(state))),
                toString: (value, state) => toStringObject(value, getMovementFields(getSettings(state))),
                options: []
            };
        }
        case 'number': {
            return {
                title: 'Number',
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                options: [
                    {
                        id: 'min',
                        title: 'Minimum',
                        type: 'number'
                    },
                    {
                        id: 'max',
                        title: 'Maximum',
                        type: 'number'
                    }
                ]
            };
        }
        case 'operation': {
            return {
                title: 'Operation',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareObjects(a, b, getOperations()),
                toString: (value) => toStringObject(value, getOperations()),
                options: []
            };
        }
        case 'select': {
            return {
                title: 'Select',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };
        }
        case 'selectMultiple': {
            return {
                title: 'Select Multiple',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };
        }
        case 'selectTags': {
            return {
                title: 'Select Tags',
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: () => 0,
                toString: value => toStringArray(value),
                options: [
                    {
                        id: 'values',
                        title: 'Values',
                        type: 'selectTags'
                    }
                ]
            };
        }
        case 'textarea': {
            return {
                title: 'Text Area',
                allowCreation: false,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
        case 'text':
        default: {
            return {
                title: 'Text',
                allowCreation: true,
                width: 250,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: []
            };
        }
    }
}