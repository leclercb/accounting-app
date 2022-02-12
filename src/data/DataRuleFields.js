import { addColorsToArray } from 'utils/ColorUtils';

export function getRuleField(ruleFieldId) {
    return getRuleFields().find(ruleField => ruleField.id === ruleFieldId);
}

export function getRuleFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: 'ID',
            type: 'text',
            editable: false,
            visible: false
        },
        {
            static: true,
            id: 'title',
            title: 'Titre',
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'color',
            title: 'Couleur',
            type: 'color',
            editable: true
        },
        {
            static: true,
            id: 'category',
            title: 'Catégorie',
            type: 'category',
            editable: true
        },
        {
            static: true,
            id: 'confidence',
            title: 'Confiance',
            type: 'confidence',
            editable: true
        }
    ]);
}