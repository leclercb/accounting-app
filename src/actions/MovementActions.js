import { t } from 'i18next';
import { parse } from 'papaparse';
import { v4 as uuid } from 'uuid';
import {
    addObject,
    deleteObject,
    duplicateObject,
    loadObjectsFromFile,
    saveObjectsToFile,
    setObjects,
    updateObject
} from 'actions/ObjectActions';
import { setMovementFile } from 'actions/SettingActions';
import { updateProcess } from 'actions/ThreadActions';
import { getMovementFields } from 'data/DataMovementFields';
import { getMovements } from 'selectors/MovementSelectors';
import { getRules } from 'selectors/RuleSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { assignCategoryToMovement } from 'utils/MovementUtils';
import { changeExtension } from 'utils/FileUtils';

export function loadMovementsFromFile(file, bank = null) {
    return async (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        await dispatch(setMovementFile(changeExtension(file, 'json')));

        return await dispatch(loadObjectsFromFile('movements', file, (file, data) => {
            if (file.endsWith('.csv')) {
                const records = parse(data, {
                    delimiter: ';',
                    skipEmptyLines: true
                }).data;

                records.shift();

                const fields = getMovementFields(settings);

                return records.map(record => fields.reduce((movement, field) => {
                    if (field.csv && field.csv[bank]) {
                        movement[field.id] = field.csv[bank](record);
                    }

                    return movement;
                }, {
                    id: uuid(),
                    confidence: 'unknown'
                }));
            }

            return JSON.parse(data);
        }));
    };
}

export function saveMovementsToFile(file, data) {
    return async dispatch => {
        await dispatch(setMovementFile(file));
        return await dispatch(saveObjectsToFile('movements', file, data));
    };
}

export function setMovements(movements) {
    return setObjects('movements', movements);
}

export function addMovement(movement, options = {}) {
    return addObject('movements', movement, options);
}

export function duplicateMovement(movement, options = {}) {
    return duplicateObject('movements', movement, options);
}

export function updateMovement(movement, options = {}) {
    return updateObject('movements', movement, options);
}

export function deleteMovement(movementId, options = {}) {
    return deleteObject('movements', movementId, options);
}

export function undoMovementStateUpdate() {
    return async dispatch => {
        dispatch({
            type: 'MOVEMENT_UNDO'
        });
    };
}

export function redoMovementStateUpdate() {
    return async dispatch => {
        dispatch({
            type: 'MOVEMENT_REDO'
        });
    };
}

export function computeCategories() {
    return async (dispatch, getState) => {
        const processId = uuid();
        const state = getState();

        try {
            const settings = getSettings(state);
            const movementFields = getMovementFields(settings);
            const movements = getMovements(state);
            const rules = getRules(state);

            movements.forEach(movement => {
                assignCategoryToMovement(movement, movementFields, rules);
            });

            await dispatch(setMovements(movements));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: t('compute_categories'),
                error: error.toString()
            }));

            throw error;
        }
    };
}