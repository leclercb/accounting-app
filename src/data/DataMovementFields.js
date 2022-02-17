import moment from 'moment';
import { t } from 'translations/i18n';
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
                kbc: {
                    index: 5,
                    convert: value => moment(value, 'DD-MM-YY').toISOString()
                }
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
                kbc: {
                    index: 14
                }
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
                kbc: {
                    index: 6
                }
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
                kbc: {
                    index: 17
                }
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
                kbc: {
                    index: 8,
                    convert: value => parseFloat(value.replace(/,/, '.'))
                }
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
                kbc: {
                    index: 3
                }
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