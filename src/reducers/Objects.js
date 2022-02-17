import { t } from 'translations/i18n';
import { clone, removePrivateKeys } from 'utils/ObjectUtils';

const Objects = property => (state = [], action) => {
    if (action.property !== property) {
        return state;
    }

    switch (action.type) {
        case 'SET_OBJECTS': {
            return [...(action.objects || [])];
        }
        case 'ADD_OBJECTS': {
            return addObjects(state, action);
        }
        case 'UPDATE_OBJECTS': {
            return updateObjects(state, action);
        }
        case 'DELETE_OBJECTS': {
            return deleteObjects(state, action);
        }
        default:
            return state;
    }
};

const addObjects = (state, action) => {
    const newState = [...state];

    for (let object of action.objects) {
        if (!object.id) {
            throw Error(t('object_id_missing'));
        }

        const index = newState.findIndex(o => o.id === object.id);

        if (index >= 0) {
            throw Error(t('object_duplicate', { objectId: object.id }));
        }

        const newObject = clone(object);

        removePrivateKeys(newObject);

        newState.push(newObject);
    }

    return newState;
};

const updateObjects = (state, action) => {
    let newState = [...state];

    for (let object of action.objects) {
        if (!object.id) {
            throw Error(t('object_id_missing'));
        }

        const index = newState.findIndex(o => o.id === object.id);

        if (index < 0) {
            throw Error(t('object_not_found', { objectId: object.id }));
        }

        const updatedObject = {
            ...object
        };

        removePrivateKeys(updatedObject);

        newState[index] = updatedObject;
    }

    return newState;
};

const deleteObjects = (state, action) => {
    const objectIds = action.objectIds;

    return state.filter(object => !objectIds.includes(object.id));
};

export default Objects;