import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategoryIds } from 'actions/AppActions';
import { getComputedCategories, getComputedExpensesCategories, getComputedIncomeCategories, getSelectedCategories, getSelectedCategoryIds } from 'selectors/CategorySelectors';

export function useCategoryApi() {
    const dispatch = useDispatch();

    const categories = useSelector(getComputedCategories);
    const expensesCategories = useSelector(getComputedExpensesCategories);
    const incomeCategories = useSelector(getComputedIncomeCategories);

    const selectedCategoryIds = useSelector(getSelectedCategoryIds);
    const selectedCategories = useSelector(getSelectedCategories);

    const setSelectedCategoryIdsCallback = useCallback(
        ruleIds => dispatch(setSelectedCategoryIds(ruleIds)),
        [dispatch]
    );

    const getCategoriesForType = type => {
        switch (type) {
            case 'expenses':
                return expensesCategories;
            case 'income':
                return incomeCategories;
            default:
                return [];
        }
    }

    return {
        categories,
        expensesCategories,
        incomeCategories,
        selectedCategoryIds,
        selectedCategories,
        setSelectedCategoryIds: setSelectedCategoryIdsCallback,
        getCategoriesForType
    };
}