import moment from 'moment';
import { getCompareForType } from 'data/DataFieldTypes';

export function compareBooleans(a, b) {
    const boolA = a ? true : false;
    const boolB = b ? true : false;
    return boolA - boolB;
}

export function compareDates(a, b, useTime) {
    if (a === b) {
        return 0;
    }

    if (!a) {
        return 1;
    }

    if (!b) {
        return -1;
    }

    return moment(a).diff(moment(b), useTime ? 'minute' : 'day');
}

export function compareNumbers(a, b) {
    const numA = a ? a : 0;
    const numB = b ? b : 0;
    return numA - numB;
}

export function compareObjects(a, b, objects) {
    const objectA = objects.find(object => object.id === a);
    const objectB = objects.find(object => object.id === b);

    return compareStrings(objectA ? objectA.title : '', objectB ? objectB.title : '');
}

export function compareObjectsHierarchy(field, a, b, sortDirection, state) {
    const valueA = a[field.id];
    const valueB = b[field.id];

    let result = getCompareForType(field.type, valueA, valueB, state);

    if (sortDirection === 'descending') {
        result *= -1;
    }

    return result;
}

export function compareStrings(a, b) {
    return (a || '').localeCompare((b || ''), undefined, { sensitivity: 'base' });
}