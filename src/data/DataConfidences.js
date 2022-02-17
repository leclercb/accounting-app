import { t } from 'i18next';

export function getConfidence(confidenceId) {
    return getConfidences().find(confidence => confidence.id === confidenceId);
}

export function getConfidences() {
    return [
        {
            id: 'unknown',
            title: t('confidence.unknown'),
            color: '#fdfefe'
        },
        {
            id: 'automaticLow',
            title: t('confidence.automaticLow'),
            color: '#fcf3cf',
            type: 'automatic'
        },
        {
            id: 'automaticHigh',
            title: t('confidence.automaticHigh'),
            color: '#a2d9ce',
            type: 'automatic'
        },
        {
            id: 'manual',
            title: t('confidence.manual'),
            color: '#aed6f1'
        },
        {
            id: 'error',
            title: t('confidence.error'),
            color: '#e6b0aa'
        }
    ];
}