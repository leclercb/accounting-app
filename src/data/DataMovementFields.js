import moment from 'moment';
import { addColorsToArray } from 'utils/ColorUtils';

export function getMovementField(movementFieldId) {
    return getMovementFields().find(movementField => movementField.id === movementFieldId);
}

export function getMovementFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'date',
            title: 'Date',
            type: 'date',
            editable: false,
            defaultOrder: 1,
            csv: {
                kbc: {
                    index: 5,
                    convert: value => moment(value, "DD-MM-YY").toISOString()
                }
            }
        },
        {
            static: true,
            id: 'counterpartyName',
            title: 'Nom Contrepartie',
            type: 'text',
            editable: false,
            defaultOrder: 2,
            csv: {
                kbc: {
                    index: 14
                }
            }
        },
        {
            static: true,
            id: 'description',
            title: 'Description',
            type: 'text',
            editable: false,
            defaultOrder: 3,
            csv: {
                kbc: {
                    index: 6
                }
            }
        },
        {
            static: true,
            id: 'freeCommunication',
            title: 'Communication Libre',
            type: 'text',
            editable: false,
            defaultOrder: 4,
            csv: {
                kbc: {
                    index: 17
                }
            }
        },
        {
            static: true,
            id: 'amount',
            title: 'Montant',
            type: 'money',
            editable: false,
            defaultOrder: 5,
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
            title: 'Devise',
            type: 'text',
            editable: false,
            defaultOrder: 6,
            csv: {
                kbc: {
                    index: 3
                }
            }
        },
        {
            static: true,
            id: 'category',
            title: 'Catégorie',
            type: 'category',
            editable: true,
            defaultOrder: 6
        }
    ]);
}