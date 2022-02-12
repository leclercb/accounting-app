import { getConfidences } from 'data/DataConfidences';

export function useConfidenceApi() {
    const confidences = getConfidences();

    return {
        confidences
    };
}