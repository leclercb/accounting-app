import React from 'react';
import { Checkbox, Modal, message } from 'antd';
import { loadData, saveData } from 'actions/AppActions';
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
            title: 'General',
            icon: 'home',
            settings: [
                {
                    id: 'dataFolder',
                    title: 'Data folder location',
                    type: 'text',
                    value: getUserDataPath(),
                    editable: false,
                    core: true
                },
                {
                    id: 'changeDataFolder',
                    title: 'Change data folder location',
                    type: 'button',
                    value: (settings, updateSettings, dispatch) => {
                        return new Promise((resolve, reject) => {
                            let dataFolder = null;
                            let copy = false;

                            Modal.confirm({
                                title: 'Change data folder location',
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
                                            Copy current data to the new data folder location.
                                            <br />
                                            This will override any data in the selected folder !
                                        </Checkbox>
                                    </React.Fragment>
                                ),
                                okText: 'Change',
                                onOk: async () => {
                                    try {
                                        if (dataFolder) {
                                            await dispatch(saveData());
                                            await updateSettings({ dataFolder });
                                            await dispatch(saveData({ coreSettingsOnly: !copy }));
                                            await dispatch(loadData());
                                        } else {
                                            message.error('Please select a data folder');
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
                    id: 'confirmBeforeClosing',
                    title: 'Confirm before closing',
                    type: 'boolean',
                    value: false,
                    editable: true
                }
            ]
        },
        {
            id: 'theme',
            title: 'Theme & Colors',
            icon: 'paint-roller',
            settings: [
                {
                    id: 'resetDefaultColors',
                    title: 'Reset default colors',
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
                    title: 'Even color',
                    type: 'color',
                    value: '#fafafa',
                    editable: true
                },
                {
                    id: 'oddColor',
                    title: 'Odd color',
                    type: 'color',
                    value: '#e3ebf2',
                    editable: true
                }
            ]
        },
        {
            id: 'window',
            title: 'Window',
            icon: 'desktop',
            settings: [
                {
                    id: 'selectedView',
                    title: 'Selected view',
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
                    value: 'task',
                    editable: false,
                    visible: true
                },
                {
                    id: 'windowSizeWidth',
                    title: 'Window size - Width',
                    type: 'number',
                    value: 1024,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowSizeHeight',
                    title: 'Window size - Height',
                    type: 'number',
                    value: 768,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionX',
                    title: 'Window position - X',
                    type: 'number',
                    value: null,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionY',
                    title: 'Window position - Y',
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
            title: 'Advanced',
            icon: 'radiation',
            settings: [
                {
                    id: 'electronLoggerLevel',
                    title: 'Electron logger level',
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
                    title: 'Save Electron logs',
                    type: 'button',
                    value: async () => {
                        const result = await showSaveDialog({
                            filters: [
                                {
                                    name: 'Log Files',
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