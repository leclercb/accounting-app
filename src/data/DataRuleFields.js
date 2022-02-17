import { t } from 'translations/i18n';
import { addColorsToArray } from 'utils/ColorUtils';

export function getRuleFields() {
    return addColorsToArray([
        {
            static: true,
            id: 'id',
            title: t('rule_field.id'),
            type: 'text',
            editable: false,
            visible: false
        },
        {
            static: true,
            id: 'title',
            title: t('rule_field.title'),
            type: 'text',
            editable: true
        },
        {
            static: true,
            id: 'color',
            title: t('rule_field.color'),
            type: 'color',
            editable: true,
            visible: false
        },
        {
            static: true,
            id: 'category',
            title: t('rule_field.category'),
            type: 'category',
            editable: true
        },
        {
            static: true,
            id: 'confidence',
            title: t('rule_field.confidence'),
            type: 'confidence',
            options: {
                type: 'automatic'
            },
            editable: true
        }
    ]);
}