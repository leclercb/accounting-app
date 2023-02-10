import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMovementIds } from 'actions/AppActions';
import { addMovement, computeCategories, deleteMovement, duplicateMovement, loadMovementsFromFile, saveMovementsToFile, updateMovement } from 'actions/MovementActions';
import { getSelectedMovementIds, getSelectedMovements, getSortedMovements } from 'selectors/MovementSelectors';

export function useMovementApi() {
    const dispatch = useDispatch();

    const movements = useSelector(getSortedMovements);

    const selectedMovementIds = useSelector(getSelectedMovementIds);
    const selectedMovements = useSelector(getSelectedMovements);

    const setSelectedMovementIdsCallback = useCallback(
        movementIds => dispatch(setSelectedMovementIds(movementIds)),
        [dispatch]
    );

    const addMovementCallback = useCallback(
        movement => dispatch(addMovement(movement)),
        [dispatch]
    );

    const duplicateMovementCallback = useCallback(
        movement => dispatch(duplicateMovement(movement)),
        [dispatch]
    );

    const updateMovementCallback = useCallback(
        movement => dispatch(updateMovement(movement)),
        [dispatch]
    );

    const deleteMovementCallback = useCallback(
        movementId => dispatch(deleteMovement(movementId)),
        [dispatch]
    );

    const loadMovementsFromFileCallback = useCallback(
        (file, bank, saveFirst) => dispatch(loadMovementsFromFile(file, bank, saveFirst)),
        [dispatch]
    );

    const saveMovementsToFileCallback = useCallback(
        (file, data) => dispatch(saveMovementsToFile(file, data)),
        [dispatch]
    );

    const computeCategoriesCallback = useCallback(
        () => dispatch(computeCategories()),
        [dispatch]
    );

    return {
        movements,
        selectedMovementIds,
        selectedMovements,
        addMovement: addMovementCallback,
        duplicateMovement: duplicateMovementCallback,
        updateMovement: updateMovementCallback,
        deleteMovement: deleteMovementCallback,
        setSelectedMovementIds: setSelectedMovementIdsCallback,
        loadMovementsFromFile: loadMovementsFromFileCallback,
        saveMovementsToFile: saveMovementsToFileCallback,
        computeCategories: computeCategoriesCallback
    };
}