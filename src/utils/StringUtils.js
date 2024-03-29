import dayjs from 'dayjs';

export function toString(value) {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }

    return String(value);
}

export function toStringBoolean(value) {
    return toString(!!value);
}

export function toStringObject(value, objects) {
    const object = objects.find(object => object.id === value);
    return object ? object.title : '';
}

export function toStringDate(value, format) {
    if (!value) {
        return '';
    }

    return dayjs(value).format(format);
}

export function toStringArray(value) {
    if (!value) {
        return '';
    }

    return value.join(', ');
}

export function toStringNumber(value, prefix = '', suffix = '') {
    if (typeof value === 'undefined' || value === null) {
        return '';
    }

    return prefix + value.toFixed(2) + suffix;
}