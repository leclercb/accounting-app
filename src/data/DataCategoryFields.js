import { t } from 'i18next';
import { addColorsToArray } from 'utils/ColorUtils';

export function getCategoryFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: t('category_field.id'),
            type: 'category',
            editable: false,
            defaultOrder: 1
        },
        {
            static: true,
            id: 'lastBalance',
            title: t('category_field.lastBalance'),
            type: 'money',
            editable: false,
            defaultOrder: 2
        },
        {
            static: true,
            id: 'currentBalance',
            title: t('category_field.currentBalance'),
            type: 'money',
            editable: false,
            defaultOrder: 3
        }
    ]);
}