import React, { useEffect, useRef } from 'react';
import sortBy from 'lodash/sortBy';
import { ArrowKeyStepper, AutoSizer, MultiGrid } from 'react-virtualized';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import Constants from 'constants/Constants';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { useAppApi } from 'hooks/UseAppApi';
import { useEditingCellApi } from 'hooks/UseEditingCellApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useMovementApi } from 'hooks/UseMovementApi';
import { getMovementBackgroundColor, getMovementForegroundColor } from 'utils/SettingUtils';
import 'components/movements/table/MovementTable.css';
import { useMovementFieldApi } from 'hooks/UseMovementFieldApi';

function MovementTable() {
    const appApi = useAppApi();
    const editingCellApi = useEditingCellApi();
    const movementApi = useMovementApi();
    const movementFieldApi = useMovementFieldApi();
    const settingsApi = useSettingsApi();

    const gridRef = useRef();

    const dataSource = movementApi.movements;

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.recomputeGridSize();
        }
    }, [appApi.dataUuid]);

    const onUpdateMovement = movement => {
        movementApi.updateMovement({
            ...movement,
            confidence: 'manual'
        });
    };

    const onResize = resizeHandler('movementColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('movementColumnOrder_', movementFieldApi.movementFields, settingsApi.settings, settingsApi.updateSettings);

    const sortedFields = sortBy(movementFieldApi.movementFields, field => ('movementColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['movementColumnOrder_' + field.id] : field.defaultOrder || 0);

    const getColumnWidth = columnIndex => {
        const field = sortedFields[columnIndex];
        const settingKey = 'movementColumnWidth_' + field.id;
        let width = Number(settingsApi.settings[settingKey]);

        if (!width || width < 10) {
            width = getWidthForType(field.type);
        }

        return width;
    };

    let totalWidth = 0;

    sortedFields.forEach((field, index) => {
        totalWidth += getColumnWidth(index);
    });

    const getCellRenderer = ({ columnIndex, rowIndex }) => { // eslint-disable-line react/prop-types
        const field = sortedFields[columnIndex];

        if (rowIndex === 0) {
            return (
                <ResizableAndMovableColumn
                    dataKey={field.id}
                    label={(<strong>{field.title}</strong>)}
                    sortBy={settingsApi.settings.movementColumnSorter ? settingsApi.settings.movementColumnSorter.field : null}
                    sortDirection={settingsApi.settings.movementColumnSorter ? settingsApi.settings.movementColumnSorter.direction : null}
                    onResize={async data => {
                        await onResize(data, field.id, getColumnWidth(columnIndex) + data.deltaX);

                        if (gridRef.current && data.stop) {
                            gridRef.current.recomputeGridSize();
                        }
                    }}
                    onMove={async (dragColumn, dropColumn) => {
                        await onMove(dragColumn.dataKey, dropColumn.dataKey);
                        gridRef.current.recomputeGridSize();
                    }} />
            );
        }

        const rowData = dataSource[rowIndex - 1];
        const cellData = rowData[field.id];

        let dndProps = {};

        if (!isAlwaysInEditionForType(field.type)) {
            dndProps = {
                dndEnabled: true,
                dragType: 'movement',
                dropType: [],
                dndData: {
                    object: rowData,
                    rowData
                }
            };
        }

        return (
            <CellRenderer
                record={rowData}
                field={field}
                value={cellData}
                onChange={allValues => {
                    movementApi.setSelectedMovementIds(rowData.id);
                    return onUpdateMovement({
                        ...rowData,
                        ...allValues
                    });
                }}
                {...dndProps} />
        );
    };

    let scrollToIndex = undefined;

    if (movementApi.selectedMovementIds.length === 1) {
        const index = dataSource.findIndex(movement => movement.id === movementApi.selectedMovementIds[0]);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    if (editingCellApi.editingCell) {
        const index = dataSource.findIndex(movement => movement.id === editingCellApi.editingCell.objectId);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    return (
        <div style={{ height: 'calc(100%)' }}>
            <AutoSizer>
                {({ width, height }) => (
                    <ArrowKeyStepper
                        columnCount={sortedFields.length}
                        rowCount={dataSource.length + 1}
                        mode="cells"
                        isControlled={true}
                        disabled={scrollToIndex === undefined}
                        scrollToRow={scrollToIndex !== undefined ? scrollToIndex + 1 : undefined}
                        onScrollToChange={({ scrollToRow }) => movementApi.setSelectedMovementIds(dataSource[scrollToRow - 1].id)}>
                        {({ onSectionRendered }) => (
                            <MultiGrid
                                ref={gridRef}
                                width={width}
                                height={height}
                                scrollToRow={scrollToIndex ? scrollToIndex + 1 : undefined}
                                onSectionRendered={onSectionRendered}
                                columnCount={sortedFields.length}
                                columnWidth={({ index }) => getColumnWidth(index)}
                                estimatedColumnSize={totalWidth / sortedFields.length}
                                fixedColumnCount={0}
                                rowHeight={40}
                                rowCount={dataSource.length + 1}
                                fixedRowCount={1}
                                cellRenderer={({ columnIndex, rowIndex, key, style }) => {
                                    const field = sortedFields[columnIndex];
                                    const movement = dataSource[rowIndex - 1];
                                    const classNames = [];

                                    if (movement && movementApi.selectedMovementIds.includes(movement.id)) {
                                        classNames.push('movement-selected');
                                    }

                                    style = {
                                        ...style,
                                        padding: '0px 5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    };

                                    if (movement) {
                                        let foregroundColor = getMovementForegroundColor();
                                        let backgroundColor = getMovementBackgroundColor(movement, rowIndex - 1, settingsApi.settings);

                                        if (movementApi.selectedMovementIds.includes(movement.id)) {
                                            foregroundColor = Constants.selectionForegroundColor;
                                            backgroundColor = Constants.selectionBackgroundColor;
                                        }

                                        style.color = foregroundColor;
                                        style.backgroundColor = backgroundColor;
                                    }

                                    const onClick = async (event, rightClick) => {
                                        if (movement) {
                                            multiSelectionHandler(
                                                rowData => rowData.id,
                                                dataSource,
                                                movementApi.selectedMovementIds,
                                                movementApi.setSelectedMovementIds,
                                                rightClick)({ event, rowData: movement });
                                        } else if (!rightClick) {
                                            let direction = 'ascending';

                                            if (settingsApi.settings.movementColumnSorter &&
                                                settingsApi.settings.movementColumnSorter.field === field.id) {
                                                if (settingsApi.settings.movementColumnSorter.direction === 'ascending') {
                                                    direction = 'descending';
                                                } else {
                                                    direction = null;
                                                }
                                            }

                                            if (direction) {
                                                await settingsApi.updateSettings({
                                                    movementColumnSorter: {
                                                        field: field.id,
                                                        direction
                                                    }
                                                });
                                            } else {
                                                await settingsApi.updateSettings({
                                                    movementColumnSorter: null
                                                });
                                            }
                                        }
                                    };

                                    const onDoubleClick = async () => {
                                        if (movement) {
                                            movementApi.setSelectedMovementIds(movement.id);
                                        } else {
                                            await onResize({ stop: true }, field.id, getWidthForType(field.type));

                                            if (gridRef.current) {
                                                gridRef.current.recomputeGridSize();
                                            }
                                        }
                                    };

                                    return (
                                        <div
                                            key={key}
                                            style={style}
                                            className={classNames.join(' ')}
                                            onClick={event => onClick(event, false)}
                                            onDoubleClick={onDoubleClick}
                                            onContextMenu={event => onClick(event, true)}>
                                            {getCellRenderer({ columnIndex, rowIndex })}
                                        </div>
                                    );
                                }} />
                        )}
                    </ArrowKeyStepper>
                )}
            </AutoSizer>
        </div>
    );
}

export default MovementTable;