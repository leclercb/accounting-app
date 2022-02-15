import { getConditionsFieldTypeForType, getConditionsForType } from 'data/DataFieldRuleTypes';
import { getFieldType } from 'data/DataFieldTypes';
import { store } from 'store/Store';

export function toStringRule(rule, fields, state = store.getState()) {
    if (!rule || !rule.condition) {
        return '';
    }

    return _toStringRule(rule.condition, fields, state);
}

function _toStringRule(condition, fields, state) {
    if (!condition) {
        return '';
    }

    if (condition.operator) {
        if (!condition.conditions || condition.conditions.length === 0) {
            return '';
        }

        let tokens = [];

        condition.conditions.forEach(condition => {
            const token = _toStringRule(condition, fields, state);

            if (token) {
                tokens.push(token);
            }
        });

        switch (condition.operator) {
            case 'AND':
                return `(${tokens.join(' and ')})`;
            case 'OR':
                return `(${tokens.join(' or ')})`;
            case 'NOT':
                return `not (${tokens.join(', ')})`;
            default:
                return '';
        }

    } else {
        const field = fields.find(field => field.id === condition.field);

        if (!field) {
            return '';
        }

        const conditionDesc = getConditionsForType(field.type).find(c => c.type === condition.type);
        const conditionFieldType = getFieldType(getConditionsFieldTypeForType(field.type), null);

        return `${field.title} ${conditionDesc.title.toLocaleLowerCase()} ${conditionFieldType.toString(condition.value, state)}`;
    }
}