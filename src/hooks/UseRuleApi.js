import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRuleIds } from 'actions/AppActions';
import { addRule, deleteRule, duplicateRule, updateRule } from 'actions/RuleActions';
import { getRules, getSelectedRuleIds, getSelectedRules } from 'selectors/RuleSelectors';

export function useRuleApi() {
    const dispatch = useDispatch();

    const rules = useSelector(getRules);

    const selectedRuleIds = useSelector(getSelectedRuleIds);
    const selectedRules = useSelector(getSelectedRules);

    const addRuleCallback = useCallback(
        rule => dispatch(addRule(rule)),
        [dispatch]
    );

    const duplicateRuleCallback = useCallback(
        rule => dispatch(duplicateRule(rule)),
        [dispatch]
    );

    const updateRuleCallback = useCallback(
        rule => dispatch(updateRule(rule)),
        [dispatch]
    );

    const deleteRuleCallback = useCallback(
        ruleId => dispatch(deleteRule(ruleId)),
        [dispatch]
    );

    const setSelectedRuleIdsCallback = useCallback(
        ruleIds => dispatch(setSelectedRuleIds(ruleIds)),
        [dispatch]
    );

    return {
        rules,
        selectedRuleIds,
        selectedRules,
        addRule: addRuleCallback,
        duplicateRule: duplicateRuleCallback,
        updateRule: updateRuleCallback,
        deleteRule: deleteRuleCallback,
        setSelectedRuleIds: setSelectedRuleIdsCallback
    };
}