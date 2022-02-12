export function getConfidence(confidenceId) {
    return getConfidences().find(confidence => confidence.id === confidenceId);
}

export function getConfidences() {
    return [
        {
            id: 'unknown',
            title: 'Inconnu',
            color: '#fdfefe'
        },
        {
            id: 'automaticLow',
            title: 'Automatique Faible',
            color: '#fcf3cf'
        },
        {
            id: 'automaticHigh',
            title: 'Automatique Elevé',
            color: '#a2d9ce'
        },
        {
            id: 'manual',
            title: 'Manuel',
            color: '#aed6f1'
        },
        {
            id: 'error',
            title: 'Erreur',
            color: '#e6b0aa'
        }
    ];
}