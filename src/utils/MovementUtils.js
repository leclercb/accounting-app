import { v4 as uuid } from 'uuid';
import { applyRuleCondition } from 'utils/RuleUtils';
import { getCategory } from 'data/DataCategories';

export function getMatchingRules(movement, movementFields, rules) {
    if (!movement) {
        return [];
    }

    return rules.filter(rule => {
        if (!rule.category || !rule.confidence) {
            return false;
        }

        const condition = getEnhancedRuleCondition(rule);
        return applyRuleCondition(condition, movement, movementFields);
    });
}

export function assignCategoryToMovement(movement, movementFields, rules) {
    if (movement.confidence === 'manual') {
        return;
    }

    const matchingRules = getMatchingRules(movement, movementFields, rules);

    movement.category = null;
    movement.confidence = 'unknown';

    if (matchingRules.length === 1) {
        movement.category = matchingRules[0].category;
        movement.confidence = matchingRules[0].confidence;
    }

    if (matchingRules.length > 1) {
        movement.category = null;
        movement.confidence = 'error';
    }
}

export function getEnhancedRuleCondition(rule) {
    return addAmountConditionBasedOnCategory(rule.condition, rule.category);
}

function addAmountConditionBasedOnCategory(condition, categoryId) {
    const category = getCategory(categoryId);

    if (!category) {
        return condition;
    }

    let type;

    switch (category.type) {
        case 'expenses':
            type = 'lessThan';
            break;
        case 'income':
            type = 'greaterThanOrEqual';
            break;
    }

    return {
        id: uuid(),
        operator: 'AND',
        conditions: [
            {
                id: uuid(),
                field: 'amount',
                type,
                value: 0
            },
            condition
        ]
    };
}