import React, { useEffect, useRef } from 'react';
import sortBy from 'lodash/sortBy';
import { ArrowKeyStepper, AutoSizer, MultiGrid } from 'react-virtualized';
import CellRenderer from 'components/common/table/CellRenderer';
import { ResizableAndMovableColumn, moveHandler, resizeHandler } from 'components/common/table/ResizableAndMovableColumn';
import { multiSelectionHandler } from 'components/common/table/VirtualizedTable';
import RuleMenu from 'components/rules/table/RuleMenu';
import Constants from 'constants/Constants';
import { getWidthForType, isAlwaysInEditionForType } from 'data/DataFieldTypes';
import { getRuleFields } from 'data/DataRuleFields';
import { useAppApi } from 'hooks/UseAppApi';
import { useEditingCellApi } from 'hooks/UseEditingCellApi';
import { useSettingsApi } from 'hooks/UseSettingsApi';
import { useRuleApi } from 'hooks/UseRuleApi';
import { getRuleBackgroundColor, getRuleForegroundColor } from 'utils/SettingUtils';
import 'components/rules/table/RuleTable.css';

function RuleTable() {
    const appApi = useAppApi();
    const editingCellApi = useEditingCellApi();
    const ruleApi = useRuleApi();
    const settingsApi = useSettingsApi();

    const gridRef = useRef();

    const dataSource = ruleApi.rules;

    useEffect(() => {
        if (gridRef.current) {
            gridRef.current.recomputeGridSize();
        }
    }, [appApi.dataUuid]);

    const onUpdateRule = rule => {
        ruleApi.updateRule(rule);
    };

    const onResize = resizeHandler('ruleColumnWidth_', settingsApi.updateSettings);
    const onMove = moveHandler('ruleColumnOrder_', getRuleFields(), settingsApi.settings, settingsApi.updateSettings);

    const sortedFields = sortBy(getRuleFields(), field => ('ruleColumnOrder_' + field.id) in settingsApi.settings ? settingsApi.settings['ruleColumnOrder_' + field.id] : field.defaultOrder || 0);

    const getColumnWidth = columnIndex => {
        const field = sortedFields[columnIndex];
        const settingKey = 'ruleColumnWidth_' + field.id;
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
                    sortBy={settingsApi.settings.ruleColumnSorter ? settingsApi.settings.ruleColumnSorter.field : null}
                    sortDirection={settingsApi.settings.ruleColumnSorter ? settingsApi.settings.ruleColumnSorter.direction : null}
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
                dragType: 'rule',
                dropType: [],
                dndData: {
                    object: rowData,
                    rowData
                }
            };
        }

        return (
            <RuleMenu selectedRules={ruleApi.selectedRules}>
                <CellRenderer
                    record={rowData}
                    field={field}
                    value={cellData}
                    onChange={allValues => {
                        ruleApi.setSelectedRuleIds(rowData.id);
                        return onUpdateRule({
                            ...rowData,
                            ...allValues
                        });
                    }}
                    {...dndProps} />
            </RuleMenu>
        );
    };

    let scrollToIndex = undefined;

    if (ruleApi.selectedRuleIds.length === 1) {
        const index = dataSource.findIndex(rule => rule.id === ruleApi.selectedRuleIds[0]);

        if (index >= 0) {
            scrollToIndex = index;
        }
    }

    if (editingCellApi.editingCell) {
        const index = dataSource.findIndex(rule => rule.id === editingCellApi.editingCell.objectId);

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
                        onScrollToChange={({ scrollToRow }) => ruleApi.setSelectedRuleIds(dataSource[scrollToRow - 1].id)}>
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
                                    const rule = dataSource[rowIndex - 1];
                                    const classNames = [];

                                    if (rule && ruleApi.selectedRuleIds.includes(rule.id)) {
                                        classNames.push('rule-selected');
                                    }

                                    style = {
                                        ...style,
                                        padding: '0px 5px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    };

                                    if (rule) {
                                        let foregroundColor = getRuleForegroundColor();
                                        let backgroundColor = getRuleBackgroundColor(rule, rowIndex - 1, settingsApi.settings);

                                        if (ruleApi.selectedRuleIds.includes(rule.id)) {
                                            foregroundColor = Constants.selectionForegroundColor;
                                            backgroundColor = Constants.selectionBackgroundColor;
                                        }

                                        style.color = foregroundColor;
                                        style.backgroundColor = backgroundColor;
                                    }

                                    const onClick = async (event, rightClick) => {
                                        if (rule) {
                                            multiSelectionHandler(
                                                rowData => rowData.id,
                                                dataSource,
                                                ruleApi.selectedRuleIds,
                                                ruleApi.setSelectedRuleIds,
                                                rightClick)({ event, rowData: rule });
                                        } else if (!rightClick) {
                                            let direction = 'ascending';

                                            if (settingsApi.settings.ruleColumnSorter &&
                                                settingsApi.settings.ruleColumnSorter.field === field.id) {
                                                if (settingsApi.settings.ruleColumnSorter.direction === 'ascending') {
                                                    direction = 'descending';
                                                } else {
                                                    direction = null;
                                                }
                                            }

                                            if (direction) {
                                                await settingsApi.updateSettings({
                                                    ruleColumnSorter: {
                                                        field: field.id,
                                                        direction
                                                    }
                                                });
                                            } else {
                                                await settingsApi.updateSettings({
                                                    ruleColumnSorter: null
                                                });
                                            }
                                        }
                                    };

                                    const onDoubleClick = async () => {
                                        if (rule) {
                                            ruleApi.setSelectedRuleIds(rule.id);
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

export default RuleTable;