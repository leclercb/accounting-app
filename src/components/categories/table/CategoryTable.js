import React, { useEffect, useRef } from 'react';
import sortBy from 'lodash/sortBy';
import { ArrowKeyStepper, AutoSizer, MultiGrid } from 'react-virtualized';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import Constants from 'constants/Constants';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { getCategoryFields } from 'data/DataCategoryFields';
import { useAppApi } from 'hooks/UseAppApi';
import { useEditingCellApi } from 'hooks/UseEditingCellApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useCategoryApi } from 'hooks/UseCategoryApi';
import { getCategoryBackgroundColor, getCategoryForegroundColor } from 'utils/SettingUtils';
import 'components/categories/table/CategoryTable.css';

function CategoryTable({ type }) {
    const appApi = useAppApi();
    const editingCellApi = useEditingCellApi();
    const categoryApi = useCategoryApi();
    const settingsApi = useSettingsApi();

    const gridRef = useRef();

    const dataSource = categoryApi.getCategoriesForType(type);

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.recomputeGridSize();
        }
    }, [appApi.dataUuid]);

    const onUpdateCategory = category => {
        categoryApi.updateCategory(category);
    };

    const onResize = resizeHandler('categoryColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('categoryColumnOrder_', getCategoryFields(), settingsApi.settings, settingsApi.updateSettings);

    const sortedFields = sortBy(getCategoryFields(), field => ('categoryColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['categoryColumnOrder_' + field.id] : field.defaultOrder || 0);

    const getColumnWidth = columnIndex => {
        const field = sortedFields[columnIndex];
        const settingKey = 'categoryColumnWidth_' + field.id;
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
                    sortBy={settingsApi.settings.categoryColumnSorter ? settingsApi.settings.categoryColumnSorter.field : null}
                    sortDirection={settingsApi.settings.categoryColumnSorter ? settingsApi.settings.categoryColumnSorter.direction : null}
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
                dragType: 'category',
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
                    categoryApi.setSelectedCategoryIds(rowData.id);
                    return onUpdateCategory({
                        ...rowData,
                        ...allValues
                    });
                }}
                {...dndProps} />
        );
    };

    let scrollToIndex = undefined;

    if (categoryApi.selectedCategoryIds.length === 1) {
        const index = dataSource.findIndex(category => category.id === categoryApi.selectedCategoryIds[0]);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    if (editingCellApi.editingCell) {
        const index = dataSource.findIndex(category => category.id === editingCellApi.editingCell.objectId);

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
                        onScrollToChange={({ scrollToRow }) => categoryApi.setSelectedCategoryIds(dataSource[scrollToRow - 1].id)}>
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
                                    const category = dataSource[rowIndex - 1];
                                    const classNames = [];

                                    if (category && categoryApi.selectedCategoryIds.includes(category.id)) {
                                        classNames.push('category-selected');
                                    }

                                    style = {
                                        ...style,
                                        padding: '0px 5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    };

                                    if (category) {
                                        let foregroundColor = getCategoryForegroundColor();
                                        let backgroundColor = getCategoryBackgroundColor(category, rowIndex - 1, settingsApi.settings);

                                        if (categoryApi.selectedCategoryIds.includes(category.id)) {
                                            foregroundColor = Constants.selectionForegroundColor;
                                            backgroundColor = Constants.selectionBackgroundColor;
                                        }

                                        style.color = foregroundColor;
                                        style.backgroundColor = backgroundColor;
                                    }

                                    const onClick = async (event, rightClick) => {
                                        if (category) {
                                            multiSelectionHandler(
                                                rowData => rowData.id,
                                                dataSource,
                                                categoryApi.selectedCategoryIds,
                                                categoryApi.setSelectedCategoryIds,
                                                rightClick)({ event, rowData: category });
                                        } else if (!rightClick) {
                                            let direction = 'ascending';

                                            if (settingsApi.settings.categoryColumnSorter &&
                                                settingsApi.settings.categoryColumnSorter.field === field.id) {
                                                if (settingsApi.settings.categoryColumnSorter.direction === 'ascending') {
                                                    direction = 'descending';
                                                } else {
                                                    direction = null;
                                                }
                                            }

                                            if (direction) {
                                                await settingsApi.updateSettings({
                                                    categoryColumnSorter: {
                                                        field: field.id,
                                                        direction
                                                    }
                                                });
                                            } else {
                                                await settingsApi.updateSettings({
                                                    categoryColumnSorter: null
                                                });
                                            }
                                        }
                                    };

                                    const onDoubleClick = async () => {
                                        if (category) {
                                            categoryApi.setSelectedCategoryIds(category.id);
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

export default CategoryTable;