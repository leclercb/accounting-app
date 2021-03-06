import { t } from 'i18next';
import { getConditionsFieldTypeForType, getConditionsForType } from 'data/DataFieldRuleTypes';
import { getFieldType } from 'data/DataFieldTypes';
import { store } from 'store/Store';

export function toStringRuleCondition(condition, fields, state = store.getState()) {
    if (!condition) {
        return '';
    }

    return toStringCondition(condition, fields, state);
}

function toStringCondition(condition, fields, state) {
    if (!condition) {
        return '';
    }

    if (condition.operator) {
        if (!condition.conditions || condition.conditions.length === 0) {
            return '';
        }

        let tokens = [];

        condition.conditions.forEach(condition => {
            const token = toStringCondition(condition, fields, state);

            if (token) {
                tokens.push(token);
            }
        });

        switch (condition.operator) {
            case 'AND':
                return `(${tokens.join(` ${t('condition_tree.group.and')} `)})`;
            case 'OR':
                return `(${tokens.join(` ${t('condition_tree.group.or')} `)})`;
            case 'NOT':
                return `${t('condition_tree.group.not')} (${tokens.join(', ')})`;
            default:
                return '';
        }

    } else {
        const field = fields.find(field => field.id === condition.field);

        if (!field) {
            return '';
        }

        const conditionDesc = getConditionsForType(field.type).find(c => c.type === condition.type);

        if (!conditionDesc) {
            return '';
        }

        const conditionFieldType = getFieldType(getConditionsFieldTypeForType(field.conditionsFieldType || field.type), null);

        return `${field.title} ${conditionDesc.title.toLocaleLowerCase()} "${conditionFieldType.toString(condition.value, state)}"`;
    }
}