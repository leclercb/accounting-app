import { t } from 'i18next';
import { v4 as uuid } from 'uuid';
import { updateProcess } from 'actions/ThreadActions';
import {
    exists,
    getPathSync,
    getProcessEnv,
    readFile,
    readdir,
    remove,
    writeFile
} from 'utils/ElectronIpc';

/**
 * Loads the data from the provided file.
 * 
 * @param {*} property The name of the property being loaded
 * @param {*} file A string
 */
export function loadFromFile(property, file, converter) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: t('load_from_file', { property: t(property) })
        }));

        try {
            await exists(file);
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return null;
        }

        try {
            let data = null;

            data = await readFile(file, 'utf8');

            data = converter ? converter(file, data) : JSON.parse(data);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));

            return data;
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

/**
 * Saves the provided data into the file.
 * 
 * @param {*} property The name of the property being saved
 * @param {*} file A string
 * @param {*} data The data to save
 */
export function saveToFile(property, file, data) {
    return async dispatch => {
        const processId = uuid();

        dispatch(updateProcess({
            id: processId,
            state: 'RUNNING',
            title: t('save_to_file', { property: t(property) })
        }));

        try {
            const content = JSON.stringify(data, null, 4);

            await writeFile(file, content);

            dispatch(updateProcess({
                id: processId,
                state: 'COMPLETED'
            }));
        } catch (error) {
            dispatch(updateProcess({
                id: processId,
                state: 'ERROR',
                error: error.toString()
            }));

            throw error;
        }
    };
}

export async function readBufferFromFile(file) {
    return await readFile(file);
}

export async function saveBufferToFile(file, buffer) {
    await writeFile(file, buffer);
}

export function getUserDataPath() {
    return getPathSync('userData');
}

export async function getDataFolder(settings) {
    const env = await getProcessEnv();

    if (env.ACCOUNTING_DATA_FOLDER) {
        return env.ACCOUNTING_DATA_FOLDER;
    }

    return settings.dataFolder;
}

export async function readDirectory(path) {
    return await readdir(path);
}

export async function deletePath(path, dataFolder) {
    if (path && (path.startsWith(getUserDataPath()) || path.startsWith(dataFolder))) {
        await remove(path);
    }
}