import {
    addObject,
    deleteObject,
    duplicateObject,
    loadObjectsFromFile,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';
import { getRandomColor } from 'utils/ColorUtils';

export function loadRulesFromFile(file) {
    return loadObjectsFromFile('rules', file);
}

export function saveRulesToFile(file, data) {
    return saveObjectsToFile('rules', file, data);
}

export function setRules(rules) {
    return setObjects('rules', rules);
}

export function addRule(rule, options = {}) {
    return addObject('rules', rule, options, {
        title: '',
        color: getRandomColor()
    });
}

export function duplicateRule(rule, options = {}) {
    return duplicateObject('rules', rule, options);
}

export function updateRule(rule, options = {}) {
    return updateObject('rules', rule, options);
}

export function deleteRule(ruleId, options = {}) {
    return deleteObject('rules', ruleId, options);
}

export function undoRuleStateUpdate() {
    return async dispatch => {
        dispatch({
            type: 'RULE_UNDO'
        });
    };
}

export function redoRuleStateUpdate() {
    return async dispatch => {
        dispatch({
            type: 'RULE_REDO'
        });
    };
}