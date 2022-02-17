import { t } from 'i18next';
import { addColorsToArray } from 'utils/ColorUtils';

export function getOperation(operationId) {
    return getOperations().find(operation => operation.id === operationId);
}

export function getOperations() {
    return addColorsToArray([
        {
            id: 'credit',
            title: t('operation.credit')
        },
        {
            id: 'debit',
            title: t('operation.debit')
        }
    ]);
}