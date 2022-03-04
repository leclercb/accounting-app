import { compareObjectsHierarchy } from 'utils/CompareUtils';

export function sortObjects(objects, fields, sorters, state) {
    if (!sorters) {
        sorters = [];
    }

    return objects.sort((a, b) => {
        let result = 0;

        for (let sorter of sorters) {
            const field = fields.find(field => field.id === sorter.field);
            const sortDirection = sorter.direction;

            if (!field || !sortDirection) {
                continue;
            }

            result = compareObjectsHierarchy(field, a, b, sortDirection, state);

            if (result !== 0) {
                break;
            }
        }

        if (result === 0) {
            const field = fields.find(field => field.id === 'title');

            if (field) {
                result = compareObjectsHierarchy(field, a, b, 'ascending', state);
            }
        }

        if (result === 0) {
            result = compareObjectsHierarchy(fields.find(field => field.id === 'id'), a, b, 'ascending', state);
        }

        return result;
    });
}