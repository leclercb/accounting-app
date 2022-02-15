import { createSelector } from 'reselect';

export const canUndoRuleStateUpdate = state => state.rules.past.length > 0;
export const canRedoRuleStateUpdate = state => state.rules.future.length > 0;

export const getRules = state => state.rules.present;

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