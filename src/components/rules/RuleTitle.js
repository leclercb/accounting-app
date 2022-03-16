import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useRuleApi } from 'hooks/UseRuleApi';

function RuleTitle(props) {
    const ruleApi = useRuleApi();
    const rule = ruleApi.rules.find(rule => rule.id === props.ruleId);

    return rule ? (
        <Icon icon="circle" color={rule.color} text={rule.title} />
    ) : (<span>&nbsp;</span>);
}

RuleTitle.propTypes = {
    ruleId: PropTypes.string
};

export default RuleTitle;