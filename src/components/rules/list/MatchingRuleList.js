import React from 'react';
import { Button, List } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

function MatchingRuleList(props) {
    return (
        <React.Fragment>
            <List
                size="small"
                bordered={true}
                dataSource={props.rules}
                style={{ minHeight: 200, maxHeight: 200, overflowY: 'auto' }}
                renderItem={item => (
                    <List.Item
                        onClick={() => props.onRuleSelection(item)}
                        className={item.id === props.selectedRuleId ? 'selected-list-item' : null}>
                        <Icon icon="circle" color={item.color} text={item.title} />
                    </List.Item>
                )}
            />
            <Button onClick={() => props.onOpenRule(props.selectedRuleId)} style={{ marginTop: 5 }} disabled={!props.selectedRuleId}>
                <Icon icon="folder-open" text="Open rule" />
            </Button>
        </React.Fragment>
    );
}

MatchingRuleList.propTypes = {
    rules: PropTypes.array.isRequired,
    selectedRuleId: PropTypes.string,
    onRuleSelection: PropTypes.func.isRequired,
    onOpenRule: PropTypes.func.isRequired
};

export default MatchingRuleList;