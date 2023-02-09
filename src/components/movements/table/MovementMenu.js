import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';
import CategoryTitle from 'components/categories/CategoryTitle';
import Icon from 'components/common/Icon';
import RuleTitle from 'components/rules/RuleTitle';
import { useAppApi } from 'hooks/UseAppApi';
import { useCategoryApi } from 'hooks/UseCategoryApi';
import { useMovementApi } from 'hooks/UseMovementApi';
import { useRuleApi } from 'hooks/UseRuleApi';
import { FieldPropType } from 'proptypes/FieldPropTypes';
import { MovementPropType } from 'proptypes/MovementPropTypes';
import { toString } from 'utils/StringUtils';

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
                    onAddToRule(action.ruleId);
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
        const value = selectedMovements[0][field.id];

        let rule = {
            title: toString(value),
            condition: {
                id: uuid(),
                operator: 'AND',
                conditions: [
                    field.createConditionFromFieldValue(value)
                ]
            }
        };

        rule = await ruleApi.addRule(rule);
        ruleApi.setSelectedRuleIds(rule.id);
        appApi.setSelectedView('rules');
    };

    const onAddToRule = ruleId => {
        const value = selectedMovements[0][field.id];

        const rule = ruleApi.rules.find(rule => rule.id === ruleId);

        if (!rule.condition) {
            rule.condition = {
                id: uuid(),
                operator: 'AND',
                conditions: [
                    field.createConditionFromFieldValue(value)
                ]
            };
        } else if (rule.condition.operator) {
            const condition = (rule.condition.conditions || []).find(condition => condition.field === field.id);

            if (condition) {
                field.addValueToCondition(value, condition);
            } else {
                rule.condition.conditions = [
                    ...(rule.condition.conditions || []),
                    field.createConditionFromFieldValue(value)
                ];
            }
        } else {
            return;
        }

        ruleApi.updateRule(rule);
        ruleApi.setSelectedRuleIds(rule.id);
        appApi.setSelectedView('rules');
    };

    const onAssignCategory = categoryId => {
        selectedMovements.forEach(movement => {
            movementApi.updateMovement({
                ...movement,
                category: categoryId,
                confidence: 'manual'
            });
        });
    };

    const menu = (
        <Menu
            onClick={onClick}
            style={{ width: 300 }}>
            <Menu.SubMenu
                key="assignCategory"
                title={(<Icon icon="plus" text="Assigner la catégorie" />)}>
                <Menu.SubMenu
                    key="assignCategoryExpense"
                    title={(<Icon icon="plus" text="Dépenses" />)}>
                    {categoryApi.expensesCategories.map(category => (
                        <Menu.Item key={category.id} action={{ type: 'assignCategory', categoryId: category.id }}>
                            <CategoryTitle categoryId={category.id} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
                <Menu.SubMenu
                    key="assignCategoryIncome"
                    title={(<Icon icon="plus" text="Revenus" />)}>
                    {categoryApi.incomeCategories.map(category => (
                        <Menu.Item key={category.id} action={{ type: 'assignCategory', categoryId: category.id }}>
                            <CategoryTitle categoryId={category.id} />
                        </Menu.Item>
                    ))}
                </Menu.SubMenu>
            </Menu.SubMenu>
            {selectedMovements.length === 1 && field.createConditionFromFieldValue && (
                <Menu.Item key="addRule" action={{ type: 'addRule' }}>
                    <Icon icon="plus" text="Créer une règle" />
                </Menu.Item>
            )}
            {selectedMovements.length === 1 && field.createConditionFromFieldValue && field.addValueToCondition && (
                <Menu.SubMenu
                    key="addToRule"
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
                open={visible}
                onOpenChange={setVisible}>
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