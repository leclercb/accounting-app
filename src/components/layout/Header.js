import React from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Icon from 'components/common/Icon';
import { useAppApi } from 'hooks/UseAppApi';
import { useMovementApi } from 'hooks/UseMovementApi';
import { useRuleApi } from 'hooks/UseRuleApi';
import { autoFill, exists, openWebsite, showOpenDialog } from 'utils/ElectronIpc';
import { changeExtension } from 'utils/FileUtils';

function Header() {
    const { t } = useTranslation();

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
            if (!filePath.endsWith('.json') && exists(changeExtension(filePath, 'json'))) {
                const override = await new Promise(resolve => {
                    Modal.confirm({
                        title: 'Un fichier "Accounting" existe déjà, êtes-vous sûr de vouloir l\'écraser ?',
                        icon: <ExclamationCircleOutlined />,
                        okText: 'Oui',
                        cancelText: 'Non',
                        onOk() {
                            resolve(true);
                        },
                        onCancel() {
                            resolve(false);
                        }
                    });
                });

                if (!override) {
                    return;
                }
            }

            await movementApi.loadMovementsFromFile(filePath, 'kbc');

        }
    };

    const onSaveMovements = async () => {
        if (appApi.movementFile) {
            await movementApi.saveMovementsToFile(appApi.movementFile, movementApi.movements);
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
        openWebsite();
    };

    const onAutoFill = async () => {
        autoFill({ value: 'XYZ' });
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
            <Button.Group style={{ marginRight: 20 }}>
                <Button
                    className={appApi.selectedView === 'expenses' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('expenses')}>
                    <Icon icon="right-from-bracket" text={t('settings.selectedView_expenses')} />
                </Button>
                <Button
                    className={appApi.selectedView === 'income' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('income')}>
                    <Icon icon="right-to-bracket" text={t('settings.selectedView_income')} />
                </Button>
                <Button
                    className={appApi.selectedView === 'movements' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('movements')}>
                    <Icon icon="up-right-and-down-left-from-center" text={t('settings.selectedView_movements')} />
                </Button>
                <Button
                    className={appApi.selectedView === 'rules' ? 'selected-view' : ''}
                    onClick={() => appApi.setSelectedView('rules')}>
                    <Icon icon="ruler-combined" text={t('settings.selectedView_rules')} />
                </Button>
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {createButton('save', 'Sauver', onSave, false)}
                {createButton('cog', 'Préférences', onSetSettingsVisible, false)}
            </Button.Group>
            <Button.Group style={{ marginRight: 20 }}>
                {appApi.selectedView === 'expenses' ? createButton('folder-open', 'Ouvrir le site', onOpenWebsite, false) : null}
                {appApi.selectedView === 'expenses' ? createButton('pencil', 'Remplissage automatique', onAutoFill, false) : null}
                {appApi.selectedView === 'rules' ? createButton('plus', 'Ajouter une règle', onAddRule, false) : null}
                {appApi.selectedView === 'movements' ? createButton('folder-open', 'Charger des mouvements', onLoadMovements, false) : null}
                {appApi.selectedView === 'movements' ? createButton('save', 'Sauver les mouvements', onSaveMovements, false) : null}
                {appApi.selectedView === 'movements' ? createButton('wand-magic-sparkles', 'Calculer les catégories', onComputeCategories, false) : null}
            </Button.Group>
        </>
    );
}

export default Header;