import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loadData,
    saveData,
    setEditingCell,
    setSettingManagerOptions
} from 'actions/AppActions';
import { setSelectedView } from 'actions/SettingActions';
import { checkIsBusy } from 'actions/ThreadActions';
import {
    getDataUuid,
    getEditingCell,
    getSettingManager,
    getStartDate
} from 'selectors/AppSelectors';
import { getSelectedView } from 'selectors/SettingSelectors';

export function useAppApi() {
    const dispatch = useDispatch();

    const dataUuid = useSelector(getDataUuid);
    const startDate = useSelector(getStartDate);
    const selectedView = useSelector(getSelectedView);
    const editingCell = useSelector(getEditingCell);
    const settingManager = useSelector(getSettingManager);

    const loadDataCallback = useCallback(
        () => dispatch(loadData()),
        [dispatch]
    );

    const saveDataCallback = useCallback(
        options => dispatch(saveData(options)),
        [dispatch]
    );

    const setSelectedViewCallback = useCallback(
        view => dispatch(setSelectedView(view)),
        [dispatch]
    );

    const setEditingCellCallback = useCallback(
        (objectId, fieldId) => dispatch(setEditingCell(objectId, fieldId)),
        [dispatch]
    );

    const setSettingManagerOptionsCallback = useCallback(
        options => dispatch(setSettingManagerOptions(options)),
        [dispatch]
    );

    const checkIsBusyCallback = useCallback(
        (fn, silent) => dispatch(checkIsBusy(fn, silent)),
        [dispatch]
    );

    return {
        dataUuid,
        startDate,
        selectedView,
        editingCell,
        settingManager,
        loadData: loadDataCallback,
        saveData: saveDataCallback,
        setSelectedView: setSelectedViewCallback,
        setEditingCell: setEditingCellCallback,
        setSettingManagerOptions: setSettingManagerOptionsCallback,
        checkIsBusy: checkIsBusyCallback
    };
}