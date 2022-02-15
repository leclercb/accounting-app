import React from 'react';
import { Checkbox, Modal, message } from 'antd';
import moment from 'moment';
import { loadData, saveData } from 'actions/AppActions';
import { checkForUpdates } from 'actions/AutoUpdaterActions';
import { getUserDataPath } from 'actions/ActionUtils';
import FileField from 'components/common/FileField';
import { copyFile, getLogFile, showSaveDialog } from 'utils/ElectronIpc';

export function isCoreSetting(settingId) {
    return !!getCategories().find(category => {
        return category.settings.find(setting => {
            return setting.id === settingId && setting.core === true;
        });
    });
}

export function getSettingValues() {
    const settings = {};

    getCategories().forEach(category => {
        const categorySettings = getCategorySettings(category);

        categorySettings.forEach(setting => {
            switch (setting.type) {
                case 'button':
                case 'component':
                case 'label':
                    break;
                case 'sorters':
                case 'timeDurations':
                default:
                    settings[setting.id] = setting.value;
                    break;
            }
        });
    });

    return settings;
}

export function getCategorySettings(category) {
    if (!category) {
        return [];
    }

    const settings = [...category.settings];

    return settings;
}

export function getCategories() {
    return [
        {
            id: 'general',
            title: 'Général',
            icon: 'home',
            settings: [
                {
                    id: 'checkVersion',
                    title: 'Check version',
                    type: 'button',
                    value: async (settings, updateSettings, dispatch) => {
                        await dispatch(checkForUpdates(false));
                    },
                    editable: true
                },
                {
                    id: 'movementFile',
                    title: 'Fichier des mouvements courants',
                    type: 'text',
                    value: null,
                    editable: false,
                    core: true
                },
                {
                    id: 'dataFolder',
                    title: 'Dossier des données',
                    type: 'text',
                    value: getUserDataPath(),
                    editable: false,
                    core: true
                },
                {
                    id: 'changeDataFolder',
                    title: 'Changer le dossier des données',
                    type: 'button',
                    value: (settings, updateSettings, dispatch) => {
                        return new Promise((resolve, reject) => {
                            let dataFolder = null;
                            let copy = false;

                            Modal.confirm({
                                title: 'Changer le dossier des données',
                                content: (
                                    <React.Fragment>
                                        <FileField
                                            onChange={value => dataFolder = value}
                                            options={{
                                                properties: [
                                                    'openDirectory'
                                                ]
                                            }}
                                            style={{
                                                width: 400,
                                                marginBottom: 10
                                            }} />
                                        <Checkbox
                                            onChange={event => copy = event.target.checked}>
                                            Copier les données courantes vers le nouveau dossier.
                                            <br />
                                            Ceci va écraser toutes les données de ce dossier !
                                        </Checkbox>
                                    </React.Fragment>
                                ),
                                okText: 'Changer',
                                onOk: async () => {
                                    try {
                                        if (dataFolder) {
                                            await dispatch(saveData());
                                            await updateSettings({ dataFolder });
                                            await dispatch(saveData({ coreSettingsOnly: !copy }));
                                            await dispatch(loadData());
                                        } else {
                                            message.error('Veuillez sélectionner un dossier pour vos données');
                                        }

                                        resolve();
                                    } catch (error) {
                                        reject(error);
                                    }
                                },
                                onCancel: () => {
                                    resolve();
                                },
                                width: 500
                            });
                        });
                    },
                    editable: true,
                    core: true
                },
                {
                    id: 'useTray',
                    title: 'Use system tray instead of task bar',
                    type: 'boolean',
                    value: false,
                    editable: true,
                    core: true
                },
                {
                    id: 'confirmBeforeClosing',
                    title: 'Confirmer avant de quitter',
                    type: 'boolean',
                    value: false,
                    editable: true
                }
            ]
        },
        {
            id: 'theme',
            title: 'Thème & Couleurs',
            icon: 'paint-roller',
            settings: [
                {
                    id: 'resetDefaultColors',
                    title: 'Remettre les couleurs par défaut',
                    type: 'button',
                    value: async (settings, updateSettings) => {
                        await updateSettings({
                            evenColor: '#fafafa',
                            oddColor: '#e3ebf2',
                            dueTodayForegroundColor: '#1b5e20',
                            overdueForegroundColor: '#b71c1c'
                        });
                    },
                    editable: true
                },
                {
                    id: 'evenColor',
                    title: 'Couleur pair',
                    type: 'color',
                    value: '#fafafa',
                    editable: true
                },
                {
                    id: 'oddColor',
                    title: 'Couleur impair',
                    type: 'color',
                    value: '#e3ebf2',
                    editable: true
                }
            ]
        },
        {
            id: 'date',
            title: 'Date & Heure',
            icon: 'calendar-alt',
            settings: [
                {
                    id: 'firstDayOfWeek',
                    title: 'Premier jour de la semaine',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'Lundi',
                                value: 1
                            },
                            {
                                title: 'Dimanche',
                                value: 0
                            }
                        ]
                    },
                    value: 1,
                    editable: true
                },
                {
                    id: 'dateFormat',
                    title: 'Format des dates',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: `DD/MM/YYYY (${moment().format('DD/MM/YYYY')})`,
                                value: 'DD/MM/YYYY'
                            },
                            {
                                title: `DD-MM-YYYY (${moment().format('DD-MM-YYYY')})`,
                                value: 'DD-MM-YYYY'
                            },
                            {
                                title: `DD.MM.YYYY (${moment().format('DD.MM.YYYY')})`,
                                value: 'DD.MM.YYYY'
                            },
                            {
                                title: `MM/DD/YYYY (${moment().format('MM/DD/YYYY')})`,
                                value: 'MM/DD/YYYY'
                            },
                            {
                                title: `MM-DD-YYYY (${moment().format('MM-DD-YYYY')})`,
                                value: 'MM-DD-YYYY'
                            },
                            {
                                title: `MM.DD.YYYY (${moment().format('MM.DD.YYYY')})`,
                                value: 'MM.DD.YYYY'
                            },
                            {
                                title: `YYYY/MM/DD (${moment().format('YYYY/MM/DD')})`,
                                value: 'YYYY/MM/DD'
                            },
                            {
                                title: `YYYY-MM-DD (${moment().format('YYYY-MM-DD')})`,
                                value: 'YYYY-MM-DD'
                            },
                            {
                                title: `YYYY.MM.DD (${moment().format('YYYY.MM.DD')})`,
                                value: 'YYYY.MM.DD'
                            },
                            {
                                title: `ddd DD/MM/YYYY (${moment().format('ddd DD/MM/YYYY')})`,
                                value: 'ddd DD/MM/YYYY'
                            },
                            {
                                title: `ddd DD-MM-YYYY (${moment().format('ddd DD-MM-YYYY')})`,
                                value: 'ddd DD-MM-YYYY'
                            },
                            {
                                title: `ddd DD.MM.YYYY (${moment().format('ddd DD.MM.YYYY')})`,
                                value: 'ddd DD.MM.YYYY'
                            },
                            {
                                title: `ddd MM/DD/YYYY (${moment().format('ddd MM/DD/YYYY')})`,
                                value: 'ddd MM/DD/YYYY'
                            },
                            {
                                title: `ddd MM-DD-YYYY (${moment().format('ddd MM-DD-YYYY')})`,
                                value: 'ddd MM-DD-YYYY'
                            },
                            {
                                title: `ddd MM.DD.YYYY (${moment().format('ddd MM.DD.YYYY')})`,
                                value: 'ddd MM.DD.YYYY'
                            },
                            {
                                title: `ddd YYYY/MM/DD (${moment().format('ddd YYYY/MM/DD')})`,
                                value: 'ddd YYYY/MM/DD'
                            },
                            {
                                title: `ddd YYYY-MM-DD (${moment().format('ddd YYYY-MM-DD')})`,
                                value: 'ddd YYYY-MM-DD'
                            },
                            {
                                title: `ddd YYYY.MM.DD (${moment().format('ddd YYYY.MM.DD')})`,
                                value: 'ddd YYYY.MM.DD'
                            }
                        ]
                    },
                    value: 'DD/MM/YYYY',
                    editable: true
                },
                {
                    id: 'timeFormat',
                    title: 'Format des heures',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'HH:mm',
                                value: 'HH:mm'
                            },
                            {
                                title: 'hh:mm a',
                                value: 'hh:mm a'
                            }
                        ]
                    },
                    value: 'HH:mm',
                    editable: true
                }
            ]
        },
        {
            id: 'window',
            title: 'Fenêtre',
            icon: 'desktop',
            settings: [
                {
                    id: 'selectedView',
                    title: 'Vue sélectionnée',
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: 'Dépenses',
                                value: 'expenses'
                            },
                            {
                                title: 'Revenus',
                                value: 'income'
                            },
                            {
                                title: 'Mouvements',
                                value: 'movements'
                            },
                            {
                                title: 'Règles',
                                value: 'rules'
                            }
                        ]
                    },
                    value: 'movements',
                    editable: false,
                    visible: true
                },
                {
                    id: 'windowSizeWidth',
                    title: 'Taille de la fenêtre - Largeur',
                    type: 'number',
                    value: 1024,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowSizeHeight',
                    title: 'Taille de la fenêtre - Hauteur',
                    type: 'number',
                    value: 768,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionX',
                    title: 'Position de la fenêtre - X',
                    type: 'number',
                    value: null,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionY',
                    title: 'Position de la fenêtre - Y',
                    type: 'number',
                    value: null,
                    editable: false,
                    visible: false,
                    core: true
                }
            ]
        },
        {
            id: 'advanced',
            title: 'Avancé',
            icon: 'radiation',
            settings: [
                {
                    id: 'electronLoggerLevel',
                    title: 'Niveau de log d\'Electron',
                    type: 'select',
                    value: 'info',
                    editable: true,
                    options: {
                        values: [
                            {
                                title: 'Error',
                                value: 'error'
                            },
                            {
                                title: 'Warning',
                                value: 'warn'
                            },
                            {
                                title: 'Info',
                                value: 'info'
                            },
                            {
                                title: 'Debug',
                                value: 'debug'
                            }
                        ]
                    },
                    core: true
                },
                {
                    id: 'saveElectronLogs',
                    title: 'Sauver les logs d\'Electron',
                    type: 'button',
                    value: async () => {
                        const result = await showSaveDialog({
                            filters: [
                                {
                                    name: 'Fichiers de log',
                                    extensions: ['log']
                                }
                            ]
                        });

                        if (!result.canceled && result.filePath) {
                            await copyFile(await getLogFile(), result.filePath);
                        }
                    },
                    editable: true
                }
            ]
        }
    ];
}