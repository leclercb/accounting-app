import { createSelector } from 'reselect';

export const getRules = state => state.rules;

export const getSelectedRules = createSelector(
    getRules,
    state => state.app.selectedRuleIds,
    (rules, selectedRuleIds) => {
        return rules.filter(rule => selectedRuleIds.includes(rule.id));
    }
);

export const getSelectedRuleIds = createSelector(
    getSelectedRules,
    (selectedRules) => {
        return selectedRules.map(rule => rule.id);
    }
);