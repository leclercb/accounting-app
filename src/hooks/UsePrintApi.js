import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { printCategories, printExpenses, printIncome, printMovements } from 'actions/PrintActions';

export function usePrintApi() {
    const dispatch = useDispatch();

    const printCategoriesCallback = useCallback(
        categories => dispatch(printCategories(categories)),
        [dispatch]
    );

    const printExpensesCallback = useCallback(
        categories => dispatch(printExpenses(categories)),
        [dispatch]
    );

    const printIncomeCallback = useCallback(
        categories => dispatch(printIncome(categories)),
        [dispatch]
    );

    const printMovementsCallback = useCallback(
        movements => dispatch(printMovements(movements)),
        [dispatch]
    );

    return {
        printCategories: printCategoriesCallback,
        printExpenses: printExpensesCallback,
        printIncome: printIncomeCallback,
        printMovements: printMovementsCallback
    };
}