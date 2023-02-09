import { t } from 'i18next';
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import { addColorsToArray } from 'utils/ColorUtils';

export function getMovementFields(settings) {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: t('movement_field.id'),
            type: 'text',
            editable: false,
            visible: false,
            defaultOrder: 1
        },
        {
            static: true,
            id: 'date',
            title: t('movement_field.date'),
            type: 'date',
            options: {
                dateFormat: settings.dateFormat
            },
            editable: false,
            defaultOrder: 2,
            csv: {
                kbc: record => dayjs(record[5], 'DD-MM-YY').toISOString(),
                ing: record => dayjs(record[4], 'DD-MM-YY').toISOString()
            }
        },
        {
            static: true,
            id: 'counterpartyName',
            title: t('movement_field.counterpartyName'),
            type: 'text',
            editable: false,
            defaultOrder: 3,
            csv: {
                kbc: record => record[14],
                ing: record => getFieldValueFromINGColumn(record[8], 'Vers') || getFieldValueFromINGColumn(record[9], 'De')
            },
            conditionsFieldType: 'selectTags',
            createConditionFromFieldValue: value => ({
                id: uuid(),
                field: 'counterpartyName',
                type: 'containIgnoreCase',
                value: [value]
            }),
            addValueToCondition: (value, condition) => {
                condition.value = [...(condition.value || []), value];
            }
        },
        {
            static: true,
            id: 'description',
            title: t('movement_field.description'),
            type: 'text',
            editable: false,
            defaultOrder: 4,
            csv: {
                kbc: record => record[6],
                ing: record => record[9] || record[8]
            },
            conditionsFieldType: 'selectTags',
            createConditionFromFieldValue: value => ({
                id: uuid(),
                field: 'description',
                type: 'containIgnoreCase',
                value: [value]
            }),
            addValueToCondition: (value, condition) => {
                condition.value = [...(condition.value || []), value];
            }
        },
        {
            static: true,
            id: 'structuredCommunication',
            title: t('movement_field.structuredCommunication'),
            type: 'text',
            editable: false,
            defaultOrder: 5,
            csv: {
                kbc: record => record[16],
                ing: record => {
                    const value = getFieldValueFromINGColumn(record[8], 'Communication');
                    return value.startsWith('***') ? value : '';
                }
            },
            conditionsFieldType: 'selectTags',
            createConditionFromFieldValue: value => ({
                id: uuid(),
                field: 'structuredCommunication',
                type: 'equal',
                value: [value]
            }),
            addValueToCondition: (value, condition) => {
                condition.value = [...(condition.value || []), value];
            }
        },
        {
            static: true,
            id: 'freeCommunication',
            title: t('movement_field.freeCommunication'),
            type: 'text',
            editable: false,
            defaultOrder: 5,
            csv: {
                kbc: record => record[17],
                ing: record => {
                    const value = getFieldValueFromINGColumn(record[8], 'Communication');
                    return !value.startsWith('***') ? value : '';
                }
            },
            conditionsFieldType: 'selectTags',
            createConditionFromFieldValue: value => ({
                id: uuid(),
                field: 'freeCommunication',
                type: 'containIgnoreCase',
                value: [value]
            }),
            addValueToCondition: (value, condition) => {
                condition.value = [...(condition.value || []), value];
            }
        },
        {
            static: true,
            id: 'amount',
            title: t('movement_field.amount'),
            type: 'money',
            editable: false,
            defaultOrder: 6,
            csv: {
                kbc: record => parseFloat(record[8].replace(/,/, '.')),
                ing: record => parseFloat(record[6].replace(/,/, '.'))
            }
        },
        {
            static: true,
            id: 'currency',
            title: t('movement_field.currency'),
            type: 'text',
            editable: false,
            defaultOrder: 7,
            csv: {
                kbc: record => record[3],
                ing: record => record[7]
            }
        },
        {
            static: true,
            id: 'category',
            title: t('movement_field.category'),
            type: 'category',
            editable: true,
            defaultOrder: 8
        }
    ]);
}

// Examples:
// Virement instantané en euros: Business'Bank On-line            - 162,51         Vers: eurofides - BE36363055303881                                              Instantané le 08/01 - 18:46:06                                                  Communication: ***224/0403/30023***             
// Virement en euros (SEPA)                                                        De: WORLDLINK                                                                       CONFERENCE ON JEWISH CLAIMS CLAIMS CONFERENCE PAYMENT OPERATIONS DE             TMENT 1359 BROADWAY,20TH FLOOR , RM. 2020                                                                                          Etats-Unis d'Amérique                                             IBAN: IE91CITI99005123687003                                                    Donneur d'ordre final :                                                          CLAIMS CONFERENCE                                                                                                       Communication :                                                                  CLAIMS CONFERENCE IN RE ARTICLE 2 FUND RESTITUTION QUARTERLY PAYMENT           Info personnelle: A2F08429839W0077                                                                                                                                                                       

function getFieldValueFromINGColumn(value, field) {
    const tokens = value.trim().replace(/\s*:\s*/g, ':').split('     ').filter(token => !!token).map(token => token.trim());
    const token = tokens.find(token => token.startsWith(field + ':'));

    if (!token) {
        return '';
    }

    return token.substring(field.length + 1);
}