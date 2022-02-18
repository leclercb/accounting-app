import React from 'react';
import { Col, Divider, Empty, Row } from 'antd';
import RuleConditionTree from 'components/rules/conditiontree/RuleConditionTree';
import RuleForm from 'components/rules/conditiontree/RuleForm';
import RuleList from 'components/rules/conditiontree/RuleList';
import { useMovementFieldApi } from 'hooks/UseMovementFieldApi';
import { useRuleApi } from 'hooks/UseRuleApi';
import { getRandomColor } from 'utils/ColorUtils';

function RuleView() {
    const movementFieldApi = useMovementFieldApi();
    const ruleApi = useRuleApi();

    const selectedRuleId = ruleApi.selectedRuleIds.length === 1 ? ruleApi.selectedRuleIds[0] : null;

    const onAddRule = async rule => {
        rule = await ruleApi.addRule(rule);
        ruleApi.setSelectedRuleIds(rule.id);
    };

    const onDuplicateRule = async rule => {
        rule = await ruleApi.duplicateRule({
            ...rule,
            color: getRandomColor()
        });
        ruleApi.setSelectedRuleIds(rule.id);
    };

    const selectedRule = ruleApi.rules.find(rule => rule.id === selectedRuleId);

    return (
        <div style={{ margin: 30 }}>
            <Row>
                <Col span={6}>
                    <RuleList
                        rules={ruleApi.rules}
                        selectedRuleId={selectedRuleId}
                        addRule={onAddRule}
                        duplicateRule={onDuplicateRule}
                        deleteRule={ruleApi.deleteRule}
                        onRuleSelection={rule => ruleApi.setSelectedRuleIds(rule.id)} />
                </Col>
                <Col span={1} />
                <Col span={17}>
                    {selectedRule ? (
                        <React.Fragment>
                            <RuleForm
                                key={selectedRuleId}
                                rule={selectedRule}
                                updateRule={ruleApi.updateRule} />
                            <Divider>Filters</Divider>
                            <RuleConditionTree
                                key={'conditionTree_' + selectedRuleId}
                                rule={selectedRule}
                                context={{
                                    fields: movementFieldApi.movementFields
                                }}
                                updateRule={ruleApi.updateRule} />
                        </React.Fragment>
                    ) : (<Empty description="Veuillez sélectionner une règle" />)}
                </Col>
            </Row>
        </div>
    );
}

export default RuleView;