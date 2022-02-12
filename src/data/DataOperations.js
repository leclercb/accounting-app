import { addColorsToArray } from 'utils/ColorUtils';

export function getOperation(operationId) {
    return getOperations().find(operation => operation.id === operationId);
}

export function getOperations() {
    return addColorsToArray([
        {
            id: 'credit',
            title: 'Crédit'
        },
        {
            id: 'debit',
            title: 'Débit'
        }
    ]);
}