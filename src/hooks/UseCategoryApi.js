import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedCategoryIds } from 'actions/AppActions';
import { getComputedCategories, getSelectedCategories, getSelectedCategoryIds, getSortedComputedExpensesCategories, getSortedComputedIncomeCategories } from 'selectors/CategorySelectors';

export function useCategoryApi() {
    const dispatch = useDispatch();

    const categories = useSelector(getComputedCategories);
    const expensesCategories = useSelector(getSortedComputedExpensesCategories);
    const incomeCategories = useSelector(getSortedComputedIncomeCategories);

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
    };

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