import React, { useState } from 'react';
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

    const [websiteWindow, setWebsiteWindow] = useState(null);

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

    const onSaveMovements = async () => {
        let file = appApi.movementFile;
        if (file) {
            file = file.substr(0, file.lastIndexOf('.')) + '.json';
            await movementApi.saveMovementsToFile(file, movementApi.movements);
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

    const onOpenWebsite = async () => {
        setWebsiteWindow(window.open('https://google.be', 'website'));
    };

    const onAutoFill = async () => {
        websiteWindow.document.getElementsByName('q')[0].value = 'Working...';
    };

    const createButton = (icon, text, onClick, disabled = false) => {
        const button = (
            <Button onClick={onClick} disabled={disabled}>
                <Icon icon={icon} text={text} />
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
                    className={appApi.selectedView === 'expenses' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('expenses')}>
                    <Icon icon="tasks" text="Dépenses" />
                </Button>
                <Button
                    className={appApi.selectedView === 'income' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('income')}>
                    <Icon icon="tasks" text="Revenus" />
                </Button>
                <Button
                    className={appApi.selectedView === 'movements' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('movements')}>
                    <Icon icon="tasks" text="Mouvements" />
                </Button>
                <Button
                    className={appApi.selectedView === 'rules' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('rules')}>
                    <Icon icon="tasks" text="Règles" />
                </Button>
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {createButton('save', 'Sauver', onSave, false)}
                {createButton('cog', 'Préférences', onSetSettingsVisible, false)}
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {appApi.selectedView === 'expenses' ? createButton('folder-open', 'Ouvrir le site', onOpenWebsite, false) : null}
                {appApi.selectedView === 'expenses' ? createButton('cog', 'Remplissage automatique', onAutoFill, false) : null}
                {appApi.selectedView === 'rules' ? createButton('plus', 'Ajouter une règle', onAddRule, false) : null}
                {appApi.selectedView === 'movements' ? createButton('folder-open', 'Charger des mouvements', onLoadMovements, false) : null}
                {appApi.selectedView === 'movements' ? createButton('save', 'Sauver les mouvements', onSaveMovements, false) : null}
                {appApi.selectedView === 'movements' ? createButton('server', 'Calculer les catégories', onComputeCategories, false) : null}
            </Button.Group>
        </>
    );
}

export default Header;