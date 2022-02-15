import { parse } from 'csv-parse/dist/esm/sync';
import { updateProcess } from 'actions/ThreadActions';
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
import { getMovementFields } from 'data/DataMovementFields';
import { getMovements } from 'selectors/MovementSelectors';
import { getRules } from 'selectors/RuleSelectors';
import { getSettings } from 'selectors/SettingSelectors';
import { applyRule } from 'utils/RuleUtils';
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
                    columns: false,
                    skip_empty_lines: true
                });

                records.shift();

                const fields = getMovementFields(settings);

                return records.map(record => fields.reduce((movement, field) => {
                    if (field.csv && field.csv[bank]) {
                        const fieldConfig = field.csv[bank];
                        const value = record[fieldConfig.index];
                        movement[field.id] = fieldConfig.convert ? fieldConfig.convert(value, record) : value;
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
                const matchingRules = rules.filter(rule => applyRule(rule, movement, movementFields));

                if (movement.confidence === 'manual') {
                    return;
                }

                movement.category = null;
                movement.confidence = 'unknown';

                if (matchingRules.length === 1) {
                    movement.category = matchingRules[0].category;
                    movement.confidence = matchingRules[0].confidence;
                }

                if (matchingRules.length > 1) {
                    movement.category = null;
                    movement.confidence = 'error';
                }
            });

            await dispatch(setMovements(movements));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                title: 'Compute categories',
                error: error.toString()
            }));

            throw error;
        }
    };
}