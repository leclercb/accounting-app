import { createSelector } from 'reselect';
import { getConfidences } from 'data/DataConfidences';
import { getMovements } from 'selectors/MovementSelectors';

export const getConfidenceStats = createSelector(
    getMovements,
    (movements) => {
        return getConfidences().map(confidence => ({
            ...confidence,
            count: movements.filter(movement => movement.confidence === confidence.id).length
        }));
    }
);