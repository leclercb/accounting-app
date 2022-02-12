import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import { Empty, Menu } from 'antd';
import ConditionTree from 'components/common/conditiontree/ConditionTree';
import RuleConditionForm from 'components/rules/conditiontree/RuleConditionForm';
import { FieldPropType } from 'proptypes/FieldPropTypes';

function RuleEmpty() {
    return (
        <Empty />
    );
}

function RuleConditionTree(props) {
    const createLeafObject = (parentCondition, key) => {
        const field = props.context.fields.find(field => field.id === key);

        if (!field) {
            throw new Error('Unknown condition field "' + key + '"');
        }

        return {
            id: uuid(),
            field: field.id,
            type: null,
            value: undefined
        };
    };

    const getLeafComponent = condition => {
        const field = props.context.fields.find(field => field.id === condition.field);

        if (!field) {
            return RuleEmpty;
        }

        return RuleConditionForm;
    };

    const onSaveCondition = condition => {
        if (props.updateRule) {
            props.updateRule({
                ...props.rule,
                condition
            });
        }
    };

    return (
        <ConditionTree
            disabled={!!props.disabled}
            condition={props.rule.condition}
            context={props.context}
            addMenuItems={rule => props.context.fields
                .filter(field => (field.title || '').includes(rule))
                .map(field => (<Menu.Item key={field.id}>{field.title}</Menu.Item>))}
            createLeafObject={createLeafObject}
            getLeafComponent={getLeafComponent}
            onSaveCondition={onSaveCondition} />
    );
}

RuleConditionTree.propTypes = {
    rule: PropTypes.object.isRequired,
    context: PropTypes.shape({
        fields: PropTypes.arrayOf(FieldPropType.isRequired).isRequired
    }).isRequired,
    disabled: PropTypes.bool,
    updateRule: PropTypes.func
};

export default RuleConditionTree;
