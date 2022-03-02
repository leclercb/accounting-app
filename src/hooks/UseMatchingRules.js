import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getMatchingRulesSelector } from 'selectors/RuleSelectors';

export function useMatchingRules(movementId) {
    const getMatchingRules = useMemo(getMatchingRulesSelector, []);
    const matchingRules = useSelector(state => getMatchingRules(state, movementId));
    return matchingRules;
}