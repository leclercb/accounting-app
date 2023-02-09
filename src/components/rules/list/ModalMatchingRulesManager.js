import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import Icon from 'components/common/Icon';
import MatchingRuleList from 'components/rules/list/MatchingRuleList';
import { useAppApi } from 'hooks/UseAppApi';
import { useMatchingRules } from 'hooks/UseMatchingRules';
import { useRuleApi } from 'hooks/UseRuleApi';

function ModalMatchingRulesManager() {
    const appApi = useAppApi();
    const matchingRules = useMatchingRules(appApi.matchingRulesManager.movementId);
    const ruleApi = useRuleApi();

    const [selectedRuleId, setSelectedRuleId] = useState(null);

    useEffect(() => {
        setSelectedRuleId(null);
    }, [matchingRules]);

    const onCloseMatchingRulesManager = () => {
        appApi.setMatchingRulesManagerOptions({ visible: false });
    };

    const onOpenRule = ruleId => {
        onCloseMatchingRulesManager();
        appApi.setSelectedView('rules');
        ruleApi.setSelectedRuleIds([ruleId]);
    };

    return (
        <Modal
            title={<Icon icon="columns" text="Matching Rules" />}
            open={appApi.matchingRulesManager.visible}
            width="50%"
            closable={false}
            onOk={onCloseMatchingRulesManager}
            onCancel={onCloseMatchingRulesManager}
            footer={(
                <Button onClick={onCloseMatchingRulesManager}>
                    Close
                </Button>
            )}>
            <MatchingRuleList
                rules={matchingRules}
                selectedRuleId={selectedRuleId}
                onRuleSelection={rule => setSelectedRuleId(rule.id)}
                onOpenRule={onOpenRule} />
        </Modal>
    );
}

export default ModalMatchingRulesManager;