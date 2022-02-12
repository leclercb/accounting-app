import { useSelector } from 'react-redux';
import { getConfidences } from 'data/DataConfidences';
import { getConfidenceStats } from 'selectors/ConfidenceSelectors';

export function useConfidenceApi() {
    const confidences = getConfidences();
    const confidenceStats = useSelector(getConfidenceStats);

    return {
        confidences,
        confidenceStats
    };
}