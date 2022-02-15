import { createSelector } from 'reselect';

export const canUndoMovementStateUpdate = state => state.movements.past.length > 0;
export const canRedoMovementStateUpdate = state => state.movements.future.length > 0;

export const getMovements = state => state.movements.present;

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