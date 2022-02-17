import React from 'react';
import { Checkbox, Modal, message } from 'antd';
import moment from 'moment';
import { getUserDataPath } from 'actions/ActionUtils';
import { loadData, saveData } from 'actions/AppActions';
import { checkForUpdates } from 'actions/AutoUpdaterActions';
import FileField from 'components/common/FileField';
import ProLockedMessage from 'components/pro/ProLockedMessage';
import ProUnlockedMessage from 'components/pro/ProUnlockedMessage';
import { getLicenseInfo } from 'selectors/AppSelectors';
import { store } from 'store/Store';
import { copyFile, getLogFile, showSaveDialog } from 'utils/ElectronIpc';
import i18n, { t } from 'translations/i18n';

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
            title: t('settings.general'),
            icon: 'home',
            settings: [
                {
                    id: 'language',
                    title: t('settings.language'),
                    type: 'select',
                    value: 'info',
                    editable: true,
                    options: {
                        values: i18n.languages.map(language => ({
                            title: language,
                            value: language
                        }))
                    },
                    core: true
                },
                {
                    id: 'checkVersion',
                    title: t('settings.checkVersion'),
                    type: 'button',
                    value: async (settings, updateSettings, dispatch) => {
                        await dispatch(checkForUpdates(false));
                    },
                    editable: true
                },
                {
                    id: 'movementFile',
                    title: t('settings.movementFile'),
                    type: 'text',
                    value: null,
                    editable: false,
                    core: true
                },
                {
                    id: 'dataFolder',
                    title: t('settings.dataFolder'),
                    type: 'text',
                    value: getUserDataPath(),
                    editable: false,
                    core: true
                },
                {
                    id: 'changeDataFolder',
                    title: t('settings.changeDataFolder'),
                    type: 'button',
                    value: (settings, updateSettings, dispatch) => {
                        return new Promise((resolve, reject) => {
                            let dataFolder = null;
                            let copy = false;

                            Modal.confirm({
                                title: t('settings.changeDataFolder'),
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
                                            {t('settings.changeDataFolder_copy')}
                                            <br />
                                            {t('settings.changeDataFolder_override')}
                                        </Checkbox>
                                    </React.Fragment>
                                ),
                                okText: t('settings.changeDataFolder_change'),
                                onOk: async () => {
                                    try {
                                        if (dataFolder) {
                                            await dispatch(saveData());
                                            await updateSettings({ dataFolder });
                                            await dispatch(saveData({ coreSettingsOnly: !copy }));
                                            await dispatch(loadData());
                                        } else {
                                            message.error(t('settings.changeDataFolder_select_folder'));
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
                    title: t('settings.useTray'),
                    type: 'boolean',
                    value: false,
                    editable: true,
                    core: true
                },
                {
                    id: 'confirmBeforeClosing',
                    title: t('settings.confirmBeforeClosing'),
                    type: 'boolean',
                    value: false,
                    editable: true
                }
            ]
        },
        {
            id: 'license',
            title: t('settings.license'),
            icon: 'key',
            settings: [
                {
                    id: 'license',
                    title: t('settings.license'),
                    type: 'textarea',
                    options: {
                        autoSize: {
                            minRows: 3,
                            maxRows: 3
                        }
                    },
                    value: null,
                    editable: true
                },
                {
                    id: 'licenseInfo',
                    title: '',
                    type: 'component',
                    value: () => { // eslint-disable-line react/display-name
                        const licenseInfo = getLicenseInfo(store.getState());

                        if (licenseInfo) {
                            return (<ProUnlockedMessage licenseInfo={licenseInfo} />);
                        } else {
                            return (<ProLockedMessage info={true} />);
                        }
                    },
                    editable: false
                }
            ]
        },
        {
            id: 'dateTime',
            title: t('settings.dateTime'),
            icon: 'calendar-alt',
            settings: [
                {
                    id: 'firstDayOfWeek',
                    title: t('settings.firstDayOfWeek'),
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: t('settings.firstDayOfWeek_monday'),
                                value: 1
                            },
                            {
                                title: t('settings.firstDayOfWeek_sunday'),
                                value: 0
                            }
                        ]
                    },
                    value: 1,
                    editable: true
                },
                {
                    id: 'dateFormat',
                    title: t('settings.dateFormat'),
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
                    title: t('settings.timeFormat'),
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
            id: 'theme',
            title: t('settings.theme'),
            icon: 'paint-roller',
            settings: [
                {
                    id: 'resetDefaultColors',
                    title: t('settings.resetDefaultColors'),
                    type: 'button',
                    value: async (settings, updateSettings) => {
                        await updateSettings({
                            evenColor: '#fafafa',
                            oddColor: '#e3ebf2'
                        });
                    },
                    editable: true
                },
                {
                    id: 'evenColor',
                    title: t('settings.evenColor'),
                    type: 'color',
                    value: '#fafafa',
                    editable: true
                },
                {
                    id: 'oddColor',
                    title: t('settings.oddColor'),
                    type: 'color',
                    value: '#e3ebf2',
                    editable: true
                }
            ]
        },
        {
            id: 'window',
            title: t('settings.window'),
            icon: 'desktop',
            settings: [
                {
                    id: 'selectedView',
                    title: t('settings.selectedView'),
                    type: 'select',
                    options: {
                        values: [
                            {
                                title: t('settings.selectedView_expenses'),
                                value: 'expenses'
                            },
                            {
                                title: t('settings.selectedView_income'),
                                value: 'income'
                            },
                            {
                                title: t('settings.selectedView_movements'),
                                value: 'movements'
                            },
                            {
                                title: t('settings.selectedView_rules'),
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
                    title: t('settings.windowSizeWidth'),
                    type: 'number',
                    value: 1024,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowSizeHeight',
                    title: t('settings.windowSizeHeight'),
                    type: 'number',
                    value: 768,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionX',
                    title: t('settings.windowPositionX'),
                    type: 'number',
                    value: null,
                    editable: false,
                    visible: false,
                    core: true
                },
                {
                    id: 'windowPositionY',
                    title: t('settings.windowPositionY'),
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
            title: t('settings.advanced'),
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
                    title: t('settings.saveElectronLogs'),
                    type: 'button',
                    value: async () => {
                        const result = await showSaveDialog({
                            filters: [
                                {
                                    name: t('settings.saveElectronLogs_log_files'),
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