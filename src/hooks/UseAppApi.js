import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loadData,
    saveData,
    setEditingCell,
    setMovementTableScrollProps,
    setSettingManagerOptions
} from 'actions/AppActions';
import { setMovementFile, setSelectedView } from 'actions/SettingActions';
import { checkIsBusy } from 'actions/ThreadActions';
import {
    getDataUuid,
    getEditingCell,
    getMovementTableScrollProps,
    getSettingManager,
    getStartDate,
    isPro
} from 'selectors/AppSelectors';
import { getMovementFile, getSelectedView } from 'selectors/SettingSelectors';

export function useAppApi() {
    const dispatch = useDispatch();

    const dataUuid = useSelector(getDataUuid);
    const startDate = useSelector(getStartDate);
    const pro = useSelector(isPro);
    const selectedView = useSelector(getSelectedView);
    const editingCell = useSelector(getEditingCell);
    const movementTableScrollProps = useSelector(getMovementTableScrollProps);
    const settingManager = useSelector(getSettingManager);
    const movementFile = useSelector(getMovementFile);

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

    const setMovementTableScrollPropsCallback = useCallback(
        scrollProps => dispatch(setMovementTableScrollProps(scrollProps)),
        [dispatch]
    );

    const setSettingManagerOptionsCallback = useCallback(
        options => dispatch(setSettingManagerOptions(options)),
        [dispatch]
    );

    const setMovementFileCallback = useCallback(
        movementFile => dispatch(setMovementFile(movementFile)),
        [dispatch]
    );

    const checkIsBusyCallback = useCallback(
        (fn, silent) => dispatch(checkIsBusy(fn, silent)),
        [dispatch]
    );

    return {
        dataUuid,
        startDate,
        isPro: pro,
        selectedView,
        editingCell,
        movementTableScrollProps,
        settingManager,
        movementFile,
        loadData: loadDataCallback,
        saveData: saveDataCallback,
        setSelectedView: setSelectedViewCallback,
        setEditingCell: setEditingCellCallback,
        setMovementTableScrollProps: setMovementTableScrollPropsCallback,
        setSettingManagerOptions: setSettingManagerOptionsCallback,
        setMovementFile: setMovementFileCallback,
        checkIsBusy: checkIsBusyCallback
    };
}