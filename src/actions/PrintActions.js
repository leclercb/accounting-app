import { t } from 'i18next';
import sortBy from 'lodash/sortBy';
import { v4 as uuid } from 'uuid';
import { getDataFolder, saveBufferToFile } from 'actions/ActionUtils';
import { updateProcess } from 'actions/ThreadActions';
import { getCategoryFields } from 'data/DataCategoryFields';
import { getMovementFields } from 'data/DataMovementFields';
import { getMovementFile, getSettings } from 'selectors/SettingSelectors';
import { ensureDir, joinSync, openPath } from 'utils/ElectronIpc';
import { printDocument, printTable } from 'utils/PrintUtils';

export function printExpenses(categories) {
    return printCategories(categories, 'expenses.pdf', t('expenses'), t('print_expenses'));
}

export function printIncome(categories) {
    return printCategories(categories, 'income.pdf', t('income'), t('print_income'));
}

export function printCategories(categories, fileName = 'categories.pdf', documentTitle = t('categories'), processTitle = t('print_categories')) {
    return (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const movementFile = getMovementFile(state);

        const fields = getCategoryFields();
        const sortedFields = sortBy(fields, field => settings['categoryColumnOrder_' + field.id] || 0);
        const sortedAndFilteredFields = sortedFields.filter(field => settings['categoryColumnVisible_' + field.id] !== false);

        return printObjects(
            dispatch,
            state,
            sortedAndFilteredFields,
            categories,
            fileName,
            documentTitle,
            movementFile,
            processTitle);
    };
}

export function printMovements(movements) {
    return (dispatch, getState) => {
        const state = getState();
        const settings = getSettings(state);

        const movementFile = getMovementFile(state);

        const fields = getMovementFields(settings);
        const sortedFields = sortBy(fields, field => settings['movementColumnOrder_' + field.id] || 0);
        const sortedAndFilteredFields = sortedFields.filter(field => settings['movementColumnVisible_' + field.id] !== false);

        return printObjects(
            dispatch,
            state,
            sortedAndFilteredFields,
            movements,
            'movements.pdf',
            t('movements'),
            movementFile,
            t('print_movements'));
    };
}

async function printObjects(dispatch, state, fields, objects, fileName, documentTitle, documentSubTitle, processTitle) {
    const processId = uuid();

    dispatch(updateProcess({
        id: processId,
        state: 'RUNNING',
        title: processTitle
    }));

    try {
        const doc = printDocument(documentTitle, documentSubTitle, 'l');
        printTable(doc, null, fields, objects, state);

        const dataFolder = await getDataFolder(getSettings(state));
        const path = joinSync(dataFolder, 'temp');
        const file = joinSync(path, fileName);

        await ensureDir(path);
        await saveBufferToFile(file, new Uint8Array(doc.output('arraybuffer')));

        await openPath(file);

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
}