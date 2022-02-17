import moment from 'moment';
import { getCategories } from 'data/DataCategories';
import { getConfidences } from 'data/DataConfidences';
import { getMovementFields } from 'data/DataMovementFields';
import { getOperations } from 'data/DataOperations';
import { getSettings } from 'selectors/SettingSelectors';
import { t } from 'translations/i18n';
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
                title: t('field_type.boolean'),
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
                title: t('field_type.category'),
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
                title: t('field_type.color'),
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
                title: t('field_type.confidence'),
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
                title: t('field_type.date'),
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
                        title: t('field_option.dateFormat'),
                        type: 'text'
                    }
                ]
            };
        }
        case 'dateTime': {
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';
            const timeFormat = options && options.timeFormat ? options.timeFormat : 'HH:mm';

            return {
                title: t('field_type.dateTime'),
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
                        title: t('field_option.dateFormat'),
                        type: 'text'
                    },
                    {
                        id: 'timeFormat',
                        title: t('field_option.timeFormat'),
                        type: 'text'
                    }
                ]
            };
        }
        case 'file': {
            return {
                title: t('field_type.file'),
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
                title: t('field_type.money'),
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value, currency + ' '),
                options: [
                    {
                        id: 'currency',
                        title: t('field_option.currency'),
                        type: 'text'
                    }
                ]
            };
        }
        case 'movementField': {
            return {
                title: t('field_type.movementField'),
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
                title: t('field_type.number'),
                allowCreation: true,
                width: 150,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareNumbers(a, b),
                toString: value => toStringNumber(value),
                options: [
                    {
                        id: 'min',
                        title: t('field_option.min'),
                        type: 'number'
                    },
                    {
                        id: 'max',
                        title: t('field_option.max'),
                        type: 'number'
                    }
                ]
            };
        }
        case 'operation': {
            return {
                title: t('field_type.operation'),
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
                title: t('field_type.select'),
                allowCreation: true,
                width: 200,
                alwaysInEdition: false,
                valuePropName: 'value',
                compare: (a, b) => compareStrings(a, b),
                toString: value => toString(value),
                options: [
                    {
                        id: 'values',
                        title: t('field_option.values'),
                        type: 'selectTags'
                    }
                ]
            };
        }
        case 'selectMultiple': {
            return {
                title: t('field_type.selectMultiple'),
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
                title: t('field_type.selectTags'),
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
                title: t('field_type.textarea'),
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
                title: t('field_type.text'),
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