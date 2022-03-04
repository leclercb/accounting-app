import { createSelector } from 'reselect';
import { getMovementFields } from 'selectors/MovementFieldSelectors';
import { getMovementColumnSorter } from 'selectors/SettingSelectors';
import { sortObjects } from 'utils/SorterUtils';

export const canUndoMovementStateUpdate = state => state.movements.past.length > 0;
export const canRedoMovementStateUpdate = state => state.movements.future.length > 0;

export const getMovements = state => state.movements.present;

export const getMovement = (state, movementId) => getMovements(state).find(movement => movement.id === movementId);

export const getSortedMovements = createSelector(
    getMovements,
    getMovementFields,
    getMovementColumnSorter,
    (movements, movementFields, movementColumnSorter) => {
        return sortObjects(movements, movementFields, [movementColumnSorter], store.getState());
    }
);

export const getSelectedMovements = createSelector(
    getMovements,
    state => state.app.selectedMovementIds,
    (movements, selectedMovementIds) => {
        return movements.filter(movement => selectedMovementIds.includes(movement.id));
    }
);

export const getSelectedMovementIds = createSelector(
    getSelectedMovements,
    (selectedMovements) => {
        return selectedMovements.map(movement => movement.id);
    }
);
