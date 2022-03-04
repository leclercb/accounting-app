import { getCategories } from 'data/DataCategories';
import { getCategoryFields } from 'data/DataCategoryFields';
import { createSelector } from 'reselect';
import { getMovements } from 'selectors/MovementSelectors';
import { getCategoryColumnSorter } from 'selectors/SettingSelectors';
import { sortObjects } from 'utils/SorterUtils';

export const getComputedCategories = createSelector(
    getMovements,
    (movements) => {
        const categories = getCategories().map(category => {
            let lastBalance = 0;
            let currentBalance = 0;

            movements.forEach(movement => {
                if (movement.category === category.id) {
                    currentBalance += movement.amount;
                }
            });

            return {
                ...category,
                lastBalance: Math.abs(lastBalance),
                currentBalance: Math.abs(currentBalance)
            };
        });

        return categories;
    }
);

export const getComputedExpensesCategories = createSelector(
    getComputedCategories,
    (categories) => {
        return categories.filter(category => category.type === 'expenses');
    }
);

export const getComputedIncomeCategories = createSelector(
    getComputedCategories,
    (categories) => {
        return categories.filter(category => category.type === 'income');
    }
);

export const getSortedComputedExpensesCategories = createSelector(
    getComputedExpensesCategories,
    getCategoryColumnSorter,
    (categories, categoryColumnSorter) => {
        return sortObjects(categories, getCategoryFields(), [categoryColumnSorter], store.getState());
    }
);

export const getSortedComputedIncomeCategories = createSelector(
    getComputedIncomeCategories,
    getCategoryColumnSorter,
    (categories, categoryColumnSorter) => {
        return sortObjects(categories, getCategoryFields(), [categoryColumnSorter], store.getState());
    }
);

export const getSelectedCategories = createSelector(
    getComputedCategories,
    state => state.app.selectedCategoryIds,
    (categories, selectedCategoryIds) => {
        return categories.filter(category => selectedCategoryIds.includes(category.id));
    }
);

export const getSelectedCategoryIds = createSelector(
    getSelectedCategories,
    (selectedCategories) => {
        return selectedCategories.map(category => category.id);
    }
);