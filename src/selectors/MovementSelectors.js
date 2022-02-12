import { createSelector } from 'reselect';

export const getMovements = state => state.movements;

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