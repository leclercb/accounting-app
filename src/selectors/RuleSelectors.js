import { createSelector } from 'reselect';
import { getMovementFields } from 'data/DataMovementFields';
import { getMovement } from 'selectors/MovementSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { compareStrings } from 'utils/CompareUtils';
import { getMatchingRules } from 'utils/MovementUtils';

export const canUndoRuleStateUpdate = state => state.rules.past.length > 0;
export const canRedoRuleStateUpdate = state => state.rules.future.length > 0;

export const getRules = state => state.rules.present;

export const getSortedRules = createSelector(
    getRules,
    (rules) => {
        return rules.sort((a, b) => compareStrings(a.title, b.title));
    }
);

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

export const getMatchingRulesSelector = () => createSelector(
    (state, movementId) => getMovement(state, movementId),
    getRules,
    getSettings,
    (movement, rules, settings) => {
        return getMatchingRules(movement, getMovementFields(settings), rules);
    }
);