import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import CategoryTitle from 'components/categories/CategoryTitle';
import Icon from 'components/common/Icon';
import RuleTitle from 'components/rules/RuleTitle';
import { useAppApi } from 'hooks/UseAppApi';
import { useCategoryApi } from 'hooks/UseCategoryApi';
import { useMovementApi } from 'hooks/UseMovementApi';
import { useRuleApi } from 'hooks/UseRuleApi';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { MovementPropType } from 'proptypes/MovementPropTypes';

function MovementMenu({ selectedMovements, field, children }) {
    const appApi = useAppApi();
    const categoryApi = useCategoryApi();
    const movementApi = useMovementApi();
    const ruleApi = useRuleApi();

    const [visible, setVisible] = useState(false);

    const onClick = ({ item }) => {
        if (item.props.action) {
            const action = item.props.action;

            switch (action.type) {
                case 'addRule':
                    onAddRule();
                    break;
                case 'addToRule':
                    onAddToRule(action.ruleId)
                    break;
                case 'assignCategory':
                    onAssignCategory(action.categoryId);
                    break;
                default:
                    break;
            }
        }

        setVisible(false);
    };

    const onAddRule = async () => {
        let rule = {};

        rule = await ruleApi.addRule(rule);
        ruleApi.setSelectedRuleIds(rule.id);
        appApi.setSelectedView('rules');
    };

    const onAddToRule = ruleId => {
        const rule = ruleApi.find(rule => rule.id === ruleId);

        ruleApi.updateRule(rule);
        ruleApi.setSelectedRuleIds(rule.id);
        appApi.setSelectedView('rules');
    }

    const onAssignCategory = categoryId => {
        selectedMovements.forEach(movement => {
            movementApi.updateMovement({
                ...movement,
                category: categoryId
            });
        });
    };

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 300 }}>
            <Menu.SubMenu
                key={"assignCategory"}
                title={(<Icon icon="plus" text="Assigner la catégorie" />)}>
                <Menu.SubMenu
                    key={"assignCategoryExpense"}
                    title={(<Icon icon="plus" text="Dépenses" />)}>
                    {categoryApi.expensesCategories.map(category => (
                        <Menu.Item key={category.id} action={{ type: 'assignCategory', categoryId: category.id }}>
                            <CategoryTitle categoryId={category.id} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key={"assignCategoryIncome"}
                    title={(<Icon icon="plus" text="Revenus" />)}>
                    {categoryApi.incomeCategories.map(category => (
                        <Menu.Item key={category.id} action={{ type: 'assignCategory', categoryId: category.id }}>
                            <CategoryTitle categoryId={category.id} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            </Menu.SubMenu>
            {selectedMovements.length === 1 && (
                <Menu.Item key="addRule" action={{ type: 'addRule' }}>
                    <Icon icon="plus" text="Créer une règle" />
                </Menu.Item>
            )}
            {selectedMovements.length === 1 && (
                <Menu.SubMenu
                    key={"addToRule"}
                    title={(<Icon icon="plus" text="Ajouter à la règle" />)}>
                    {ruleApi.rules.map(rule => (
                        <Menu.Item key={rule.id} action={{ type: 'addToRule', ruleId: rule.id }}>
                            <RuleTitle ruleId={rule.id} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            )}
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

MovementMenu.propTypes = {
    selectedMovements: PropTypes.arrayOf(MovementPropType.isRequired).isRequired,
    field: FieldPropType.isRequired,
    children: PropTypes.node.isRequired
};

export default MovementMenu;