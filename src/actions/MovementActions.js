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
import { getMovementFields } from 'data/DataMovementFields';
import { getMovements } from 'selectors/MovementSelectors';
import { applyRule } from 'utils/RuleUtils';
import { getRules } from 'selectors/RuleSelectors';
import { setMovementFile } from 'actions/AppActions';

export function loadMovementsFromFile(file, bank) {
    return async dispatch => {
        await dispatch(setMovementFile(file));

        return await dispatch(loadObjectsFromFile('movements', file, (file, data) => {
            if (file.endsWith('.csv')) {
                const records = parse(data, {
                    delimiter: ';',
                    columns: false,
                    skip_empty_lines: true
                });

                records.shift();

                const fields = getMovementFields();

                return records.map(record => fields.reduce((movement, field) => {
                    if (field.csv && field.csv[bank]) {
                        const fieldConfig = field.csv[bank];
                        const value = record[fieldConfig.index];
                        movement[field.id] = fieldConfig.convert ? fieldConfig.convert(value, record) : value;
                    }

                    return movement;
                }, {
                    id: uuid()
                }));
            }

            return JSON.parse(data);
        }));
    }
}

export function saveMovementsToFile(file, data) {
    return async dispatch => {
        await dispatch(setMovementFile(file));
        return await dispatch(saveObjectsToFile('movements', file, data));
    }
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

export function computeCategories() {
    return async (dispatch, getState) => {
        const processId = uuid();
        const state = getState();

        try {
            const movementFields = getMovementFields();
            const movements = getMovements(state);
            const rules = getRules(state);

            movements.forEach(movement => {
                const matchingRules = rules.filter(rule => applyRule(rule, movement, movementFields));

                if (movement.confidence === 'manual') {
                    return;
                }

                movement.category = null;
                movement.confidence = null;

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