import { compareObjectsHierarchy } from 'utils/CompareUtils';

export function sortObjects(objects, fields, field, sortDirection, state) {
    return objects.sort((a, b) => {
        let result = 0;

        if (result === 0) {
            result = compareObjectsHierarchy(fields.find(f => f.id === field), a, b, sortDirection, state);
        }

        if (result === 0) {
            result = compareObjectsHierarchy(fields.find(f => f.id === 'title'), a, b, 'ascending', state);
        }

        if (result === 0) {
            result = compareObjectsHierarchy(fields.find(f => f.id === 'id'), a, b, 'ascending', state);
        }

        return result;
    });
}