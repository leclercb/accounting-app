import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useRuleApi } from 'hooks/UseRuleApi';
import { RulePropType } from 'proptypes/RulePropTypes';
import { getRandomColor } from 'utils/ColorUtils';

function RuleMenu({ selectedRules, children }) {
    const ruleApi = useRuleApi();

    const [visible, setVisible] = useState(false);

    const onClick = ({ item }) => {
        if (item.props.action) {
            const action = item.props.action;

            switch (action.type) {
                case 'duplicate':
                    selectedRules.forEach(rule => onDuplicateRule(rule));
                    break;
                case 'remove':
                    onRemoveRules(selectedRules.map(rule => rule.id));
                    break;
                default:
                    break;
            }
        }

        setVisible(false);
    };

    const onDuplicateRule = rule => {
        ruleApi.duplicateRule({
            ...rule,
            color: getRandomColor()
        });
    };

    const onRemoveRules = ruleIds => {
        ruleApi.deleteRule(ruleIds);
    };

    const suffix = `${selectedRules.length} rule${selectedRules.length > 1 ? 's' : ''}`;

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 300 }}>
            <Menu.Item key="duplicate" action={{ type: 'duplicate' }}>
                <Icon icon="copy" text={`Duplicate ${suffix}`} />
            </Menu.Item>
            <Menu.Item key="remove" action={{ type: 'remove' }}>
                <Icon icon="trash-alt" text={`Remove ${suffix}`} />
            </Menu.Item>
        </Menu>

    );

    // Dropdown trigger is not working in React Virtualized Grid
    return (
        <div
            onClick={() => setVisible(false)}
            onContextMenu={event => {
                setVisible(true);
                event.preventDefault();
            }}
            style={{ flexGrow: 1, maxWidth: '100%' }}>
            <Dropdown
                overlay={menu}
                trigger={['contextMenu']}
                visible={visible}
                onVisibleChange={setVisible}>
                {children}
            </Dropdown>
        </div>
    );
}

RuleMenu.propTypes = {
    selectedRules: PropTypes.arrayOf(RulePropType.isRequired).isRequired,
    children: PropTypes.node.isRequired
};

export default RuleMenu;