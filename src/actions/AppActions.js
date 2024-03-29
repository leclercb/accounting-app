import { t } from 'i18next';
import dayjs from 'dayjs';
import { ActionCreators } from 'redux-undo';
import { v4 as uuid } from 'uuid';
import { getDataFolder, getUserDataPath } from 'actions/ActionUtils';
import { loadMovementsFromFile, saveMovementsToFile } from 'actions/MovementActions';
import { loadRulesFromFile, saveRulesToFile } from 'actions/RuleActions';
import { loadSettingsFromFile, saveSettingsToFile, updateSettings } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { getMovements } from 'selectors/MovementSelectors';
import { getRules } from 'selectors/RuleSelectors';
import { getMovementFile, getSettings } from 'selectors/SettingSelectors';
import { ensureDir, joinSync } from 'utils/ElectronIpc';
import { filterSettings } from 'utils/SettingUtils';

export function loadData(options) {
    return loadDataFromFile(options);
}

export function loadDataFromFile(options) {
    return _loadDataFromFile(null, options);
}

export function _loadDataFromFile(path, options) {
    options = Object.assign({
        skipSettings: false
    }, options);

    return async (dispatch, getState) => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: t('load_database'),
            notify: true
        }));

        try {
            if (!options.skipSettings) {
                await dispatch(loadSettingsFromFile(joinSync(getUserDataPath(), 'coreSettings.json'), true));
            }

            if (!path) {
                path = await getDataFolder(getState().settings);
            }

            const getFile = name => {
                return joinSync(path, name);
            };

            const promises = [
                dispatch(loadRulesFromFile(getFile('rules.json')))
            ];

            let movementFile = getMovementFile(getState());

            if (movementFile) {
                promises.push(dispatch(loadMovementsFromFile(movementFile)));
            }

            if (!options.skipSettings) {
                promises.unshift(dispatch(loadSettingsFromFile(getFile('settings.json'))));
            }

            await Promise.all(promises);

            await dispatch(ActionCreators.clearHistory());
            await dispatch(refreshDataUuid());

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return getState();
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export function saveData(options) {
    return async dispatch => {
        await dispatch(saveDataToFile(options));

        await dispatch(updateSettings({
            lastSaveDate: dayjs().toISOString()
        }));
    };
}

export function saveDataToFile(options) {
    return _saveDataToFile(null, options);
}

export function _saveDataToFile(path, options) {
    options = Object.assign({
        coreSettingsOnly: false,
        message: null
    }, options);

    return async (dispatch, getState) => {
        const processId = uuid();
        const state = getState();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: options.message ? options.message : t('save_database'),
            notify: true
        }));

        try {
            if (!path) {
                path = await getDataFolder(getState().settings);
            }

            await ensureDir(path);

            const promises = [
                dispatch(saveSettingsToFile(joinSync(getUserDataPath(), 'coreSettings.json'), filterSettings(getSettings(state), true)))
            ];

            if (!options.coreSettingsOnly) {
                const getFile = name => {
                    return joinSync(path, name);
                };

                promises.push(
                    dispatch(saveSettingsToFile(getFile('settings.json'), filterSettings(getSettings(state), false))),
                    dispatch(saveRulesToFile(getFile('rules.json'), getRules(state)))
                );

                const movementFile = getMovementFile(state);

                if (movementFile) {
                    promises.push(dispatch(saveMovementsToFile(movementFile, getMovements(state))));
                }
            }

            await Promise.all(promises);

            await dispatch(ActionCreators.clearHistory());

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

function refreshDataUuid() {
    return async dispatch => {
        dispatch({
            type: 'SET_DATA_UUID',
            uuid: uuid()
        });
    };
}

export function setEditingCell(objectId, fieldId) {
    return async dispatch => {
        dispatch({
            type: 'SET_EDITING_CELL',
            objectId,
            fieldId
        });
    };
}

export function setSelectedCategoryIds(categoryIds) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_CATEGORY_IDS',
            categoryIds
        });
    };
}

export function setSelectedMovementIds(movementIds) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_MOVEMENT_IDS',
            movementIds
        });
    };
}

export function setSelectedRuleIds(ruleIds) {
    return async dispatch => {
        dispatch({
            type: 'SET_SELECTED_RULE_IDS',
            ruleIds
        });
    };
}

export function setMovementTableScrollProps(scrollProps) {
    return async dispatch => {
        dispatch({
            type: 'SET_MOVEMENT_TABLE_SCROLL_PROPS',
            scrollProps
        });
    };
}

export function setMatchingRulesManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_MATCHING_RULES_MANAGER_OPTIONS',
            ...options
        });
    };
}

export function setSettingManagerOptions(options) {
    return async dispatch => {
        dispatch({
            type: 'SET_SETTING_MANAGER_OPTIONS',
            ...options
        });
    };
}