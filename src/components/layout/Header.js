import React from 'react';
import { Button, Tooltip } from 'antd';
import Icon from 'components/common/Icon';
import { useAppApi } from 'hooks/UseAppApi';
import { useMovementApi } from 'hooks/UseMovementApi';
import { useRuleApi } from 'hooks/UseRuleApi';
import { showOpenDialog } from 'utils/ElectronIpc';

function Header() {
    const appApi = useAppApi();
    const movementApi = useMovementApi();
    const ruleApi = useRuleApi();

    const onSave = () => {
        appApi.saveData();
    };

    const onSetSettingsVisible = () => {
        appApi.setSettingManagerOptions({ visible: true });
    };

    const onLoadMovements = async () => {
        const result = await showOpenDialog({
            filters: [
                {
                    name: 'Accounting Files',
                    extensions: ['csv', 'json']
                }
            ],
            properties: [
                'openFile'
            ]
        });

        let filePath = result.filePaths && result.filePaths.length === 1 ? result.filePaths[0] : null;

        if (!result.canceled && filePath) {
            await movementApi.loadMovementsFromFile(filePath, 'kbc');
        }
    };

    const onComputeCategories = async () => {
        await movementApi.computeCategories();
    };

    const onAddRule = async () => {
        let rule = {};

        rule = await ruleApi.addRule(rule);
        ruleApi.setSelectedRuleIds(rule.id);
        appApi.setEditingCell(rule.id, 'title');
    };

    const createButton = (icon, text, onClick, disabled = false) => {
        const button = (
            <Button onClick={onClick} disabled={disabled}>
                <Icon icon={icon} />
            </Button>
        );

        if (disabled) {
            return button;
        }

        return (
            <Tooltip placement="bottom" title={text}>
                {button}
            </Tooltip>
        );
    };

    return (
        <>
            <Button.Group style={{ marginRight: 20 }} className="joyride-header-selected-view">
                <Button
                    type={appApi.selectedView === 'expenses' ? 'primary' : 'default'}
                    onClick={() => appApi.setSelectedView('expenses')}>
                    <Icon icon="tasks" text="Dépenses" />
                </Button>
                <Button
                    type={appApi.selectedView === 'income' ? 'primary' : 'default'}
                    onClick={() => appApi.setSelectedView('income')}>
                    <Icon icon="tasks" text="Revenus" />
                </Button>
                <Button
                    type={appApi.selectedView === 'movements' ? 'primary' : 'default'}
                    onClick={() => appApi.setSelectedView('movements')}>
                    <Icon icon="tasks" text="Mouvements" />
                </Button>
                <Button
                    type={appApi.selectedView === 'rules' ? 'primary' : 'default'}
                    onClick={() => appApi.setSelectedView('rules')}>
                    <Icon icon="tasks" text="Règles" />
                </Button>
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {appApi.selectedView === 'rules' ? createButton('plus', 'Add Rule', onAddRule, false) : null}
                {appApi.selectedView === 'movements' ? createButton('plus', 'Load Movements', onLoadMovements, false) : null}
                {appApi.selectedView === 'movements' ? createButton('plus', 'Compute Categories', onComputeCategories, false) : null}
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {createButton('save', 'Save', onSave, false)}
                {createButton('cog', 'Settings', onSetSettingsVisible, false)}
            </Button.Group>
        </>
    );
}

export default Header;