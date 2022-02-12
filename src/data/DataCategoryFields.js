import { addColorsToArray } from 'utils/ColorUtils';

export function getCategoryField(categoryFieldId) {
    return getCategoryFields().find(categoryField => categoryField.id === categoryFieldId);
}

export function getCategoryFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'Catégorie',
            type: 'category',
            editable: false,
            defaultOrder: 1
        },
        {
            static: true,
            id: 'lastBalance',
            title: 'Dernier solde annuel',
            type: 'money',
            editable: false,
            defaultOrder: 2
        },
        {
            static: true,
            id: 'currentBalance',
            title: 'Solde annuel actuel',
            type: 'money',
            editable: false,
            defaultOrder: 3
        }
    ]);
}