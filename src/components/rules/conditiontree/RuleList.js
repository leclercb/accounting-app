import React from 'react';
import { v4 as uuid } from 'uuid';
import PropTypes from 'prop-types';
import { Button, List } from 'antd';
import Icon from 'components/common/Icon';
import LeftRight from 'components/common/LeftRight';
import { createActions } from 'utils/CategoryListUtils';

function RuleList(props) {
    const createNewRule = () => {
        return {
            condition: {
                id: uuid(),
                operator: 'AND',
                conditions: []
            }
        };
    };

    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.rules}
                style={{ minHeight: 400, maxHeight: 400, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onRuleSelection(item)}
                        className={item.id === props.selectedRuleId ? 'selected-list-item' : null}>
                        <LeftRight right={createActions(item, () => props.duplicateRule(item), () => props.deleteRule(item.id))}>
                            <Icon icon="circle" color={item.color} text={item.title} />
                        </LeftRight>
                    </List.Item>
                )}
            />
            <Button onClick={() => props.addRule(createNewRule())} style={{ marginTop: 5 }}>
                <Icon icon="plus" text="Add" />
            </Button>
        </React.Fragment>
    );
}

RuleList.propTypes = {
    rules: PropTypes.array.isRequired,
    selectedRuleId: PropTypes.string,
    addRule: PropTypes.func.isRequired,
    duplicateRule: PropTypes.func.isRequired,
    deleteRule: PropTypes.func.isRequired,
    onRuleSelection: PropTypes.func.isRequired
};

export default RuleList;