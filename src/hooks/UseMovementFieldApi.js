import { getMovementFields } from 'data/DataMovementFields';

export function useMovementFieldApi() {
    const movementFields = getMovementFields();

    return {
        movementFields
    };
}