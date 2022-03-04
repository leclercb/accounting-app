import { useSelector } from 'react-redux';
import { getMovementFields } from 'selectors/MovementFieldSelectors';

export function useMovementFieldApi() {
    const movementFields = useSelector(getMovementFields);

    return {
        movementFields
    };
}