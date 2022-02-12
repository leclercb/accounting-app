import { getOperations } from 'data/DataOperations';

export function useOperationApi() {
    const operations = getOperations();

    return {
        operations
    };
}