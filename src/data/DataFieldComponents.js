/* eslint react/display-name: 0 react/prop-types: 0 */

import React from 'react';
import moment from 'moment';
import { Checkbox, Input, InputNumber, Select, Tag } from 'antd';
import CategorySelect from 'components/categories/CategorySelect';
import CategoryTitle from 'components/categories/CategoryTitle';
import ColorPicker from 'components/common/ColorPicker';
import DatePicker from 'components/common/DatePicker';
import ExtendedDatePicker from 'components/common/ExtendedDatePicker';
import FileField from 'components/common/FileField';
import ConfidenceSelect from 'components/confidences/ConfidenceSelect';
import ConfidenceTitle from 'components/confidences/ConfidenceTitle';
import MovementFieldSelect from 'components/movementFields/MovementFieldSelect';
import MovementFieldTitle from 'components/movementFields/MovementFieldTitle';
import OperationSelect from 'components/operations/OperationSelect';
import OperationTitle from 'components/operations/OperationTitle';
import { toStringNumber } from 'utils/StringUtils';
import { getConditionsForType } from 'data/DataFieldRuleTypes';

export function getDefaultGetValueFromEvent(e) {
    if (!e || !e.target) {
        return e;
    }
    const { target } = e;
    return target.type === 'checkbox' ? target.checked : target.value;
}

export function getRenderForType(type, options, value, props = {}) {
    return getFieldComponents(type, options).render(value, props);
}

export function getInputForType(type, options, props = {}) {
    return getFieldComponents(type, options).input(props);
}

export function getSelectForType(type, props = {}) {
    return getFieldComponents(type).select(props);
}

export function getFieldComponents(type, options) {
    let configuration = null;

    const removeExtraProps = props => {
        const { ...wrappedProps } = props;
        delete wrappedProps.fieldMode;
        delete wrappedProps.onCommit;
        delete wrappedProps.onStopEdition;
        return wrappedProps;
    };

    const emptyOnCommit = () => { };

    switch (type) {
        case 'boolean': {
            configuration = {
                render: value => <Checkbox checked={!!value} />,
                input: props => (
                    <Checkbox
                        onChange={props.onCommit || emptyOnCommit}
                        data-prevent-default={true}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'category': {
            configuration = {
                render: value => (
                    <CategoryTitle categoryId={value} />
                ),
                input: props => (
                    <CategorySelect
                        onBlur={props.onCommit}
                        onClear={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'color': {
            configuration = {
                render: value => <ColorPicker color={value} />,
                input: props => (
                    <ColorPicker
                        onClose={props.onCommit}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'confidence': {
            configuration = {
                render: value => (
                    <ConfidenceTitle confidenceId={value} />
                ),
                input: props => (
                    <ConfidenceSelect
                        onBlur={props.onCommit}
                        onClear={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'date': {
            const extended = options && options.extended === true;
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';

            configuration = {
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(dateFormat) : (<span>&nbsp;</span>);
                },
                input: props => {
                    if (extended) {
                        return (
                            <ExtendedDatePicker
                                defaultOpened={props.fieldMode === 'table'}
                                onChange={() => {
                                    if (props.onCommit) {
                                        props.onCommit();
                                    }
                                }}
                                onOpenChange={status => {
                                    if (!status) {
                                        if (props.onStopEdition) {
                                            props.onStopEdition();
                                        }
                                    }
                                }}
                                format={dateFormat}
                                {...removeExtraProps(props)} />
                        );
                    }

                    return (
                        <DatePicker
                            defaultOpened={props.fieldMode === 'table'}
                            onChange={() => {
                                if (props.onCommit) {
                                    props.onCommit();
                                }
                            }}
                            onOpenChange={status => {
                                if (!status) {
                                    if (props.onStopEdition) {
                                        props.onStopEdition();
                                    }
                                }
                            }}
                            format={dateFormat}
                            {...removeExtraProps(props)} />
                    );
                }
            };

            break;
        }
        case 'dateTime': {
            const extended = options && options.extended === true;
            const dateFormat = options && options.dateFormat ? options.dateFormat : 'DD/MM/YYYY';
            const timeFormat = options && options.timeFormat ? options.timeFormat : 'HH:mm';

            configuration = {
                render: value => {
                    if (extended && Number.isInteger(value)) {
                        return value;
                    }

                    return value ? moment(value).format(`${dateFormat} ${timeFormat}`) : (<span>&nbsp;</span>);
                },
                input: props => {
                    if (extended) {
                        return (
                            <ExtendedDatePicker
                                defaultOpened={props.fieldMode === 'table'}
                                onChange={() => {
                                    if (props.onCommit) {
                                        props.onCommit();
                                    }
                                }}
                                onOpenChange={status => {
                                    if (!status) {
                                        if (props.onStopEdition) {
                                            props.onStopEdition();
                                        }
                                    }
                                }}
                                showTime={{ format: timeFormat }}
                                format={`${dateFormat} ${timeFormat}`}
                                {...removeExtraProps(props)} />
                        );
                    }

                    return (
                        <DatePicker
                            defaultOpened={props.fieldMode === 'table'}
                            onChange={() => {
                                if (props.onCommit) {
                                    props.onCommit();
                                }
                            }}
                            onOpenChange={status => {
                                if (!status) {
                                    if (props.onStopEdition) {
                                        props.onStopEdition();
                                    }
                                }
                            }}
                            showTime={{ format: timeFormat }}
                            format={`${dateFormat} ${timeFormat}`}
                            {...removeExtraProps(props)} />
                    );
                }
            };

            break;
        }
        case 'file': {
            configuration = {
                render: value => (
                    <FileField value={value} readOnly={true} />
                ),
                input: props => (
                    <FileField
                        onBlur={props.onCommit}
                        onPressEnter={props.onCommit}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'money': {
            const currency = options && options.currency ? options.currency : '€';

            configuration = {
                render: value => value ? toStringNumber(value, currency + ' ') : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        onBlur={props.onCommit}
                        formatter={value => toStringNumber(value, currency + ' ')}
                        parser={value => value.replace(currency + ' ', '')}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'movementField': {
            configuration = {
                render: value => (
                    <MovementFieldTitle movementFieldId={value} />
                ),
                input: props => (
                    <MovementFieldSelect
                        onBlur={props.onCommit}
                        onClear={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'number': {
            const min = options && options.min ? options.min : -Infinity;
            const max = options && options.max ? options.max : Infinity;

            configuration = {
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <InputNumber
                        onBlur={props.onCommit}
                        min={min}
                        max={max}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'operation': {
            configuration = {
                render: value => (
                    <OperationTitle operationId={value} />
                ),
                input: props => (
                    <OperationSelect
                        onBlur={props.onCommit}
                        onClear={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'select': {
            let values = options && options.values ? options.values : [];
            values = Array.isArray(values) ? values : [values];

            configuration = {
                render: value => (
                    value ? value : <span>&nbsp;</span>
                ),
                input: props => (
                    <Select
                        onBlur={props.onCommit}
                        onClear={props.onCommit}
                        dropdownMatchSelectWidth={false}
                        {...removeExtraProps(props)}>
                        {values.map(value => {
                            value = typeof value === 'object' ? value : {
                                title: value,
                                value
                            };

                            return (
                                <Select.Option key={value.value} value={value.value}>
                                    {value.title}
                                </Select.Option>
                            );
                        })}
                    </Select>
                )
            };

            break;
        }
        case 'selectMultiple': {
            let values = options && options.values ? options.values : [];
            values = Array.isArray(values) ? values : [values];

            configuration = {
                render: values => (
                    values ? values.map(value => (<Tag key={value}>{value}</Tag>)) : <span>&nbsp;</span>
                ),
                input: props => {
                    return (
                        <Select
                            onBlur={props.onCommit}
                            onClear={props.onCommit}
                            dropdownMatchSelectWidth={false}
                            mode="multiple"
                            {...removeExtraProps(props)}>
                            {values.map(value => {
                                value = typeof value === 'object' ? value : {
                                    title: value,
                                    value
                                };

                                return (
                                    <Select.Option key={value.value} value={value.value}>
                                        {value.title}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                }
            };

            break;
        }
        case 'selectTags': {
            let values = options && options.values ? options.values : [];
            values = Array.isArray(values) ? values : [values];

            configuration = {
                render: values => (
                    values ? values.map(value => (<Tag key={value}>{value}</Tag>)) : <span>&nbsp;</span>
                ),
                input: props => {
                    return (
                        <Select
                            onBlur={props.onCommit}
                            onClear={props.onCommit}
                            dropdownMatchSelectWidth={false}
                            mode="tags"
                            {...removeExtraProps(props)}>
                            {values.map(value => {
                                value = typeof value === 'object' ? value : {
                                    title: value,
                                    value
                                };

                                return (
                                    <Select.Option key={value.value} value={value.value}>
                                        {value.title}
                                    </Select.Option>
                                );
                            })}
                        </Select>
                    );
                }
            };

            break;
        }
        case 'textarea': {
            const autoSize = options && options.autoSize ? options.autoSize : false;

            configuration = {
                render: value => (
                    <Input.TextArea
                        value={value}
                        readOnly={true}
                        autoSize={autoSize} />
                ),
                input: props => (
                    <Input.TextArea
                        onBlur={props.onCommit}
                        autoSize={autoSize}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
        case 'text':
        default: {
            configuration = {
                render: value => value ? value : <span>&nbsp;</span>,
                input: props => (
                    <Input
                        onBlur={props.onCommit}
                        onPressEnter={props.onCommit}
                        {...removeExtraProps(props)} />
                )
            };

            break;
        }
    }

    configuration.select = props => (
        <Select
            dropdownMatchSelectWidth={false}
            placeholder="Condition"
            {...props}>
            {getConditionsForType(type).filter(condition => condition.visible !== false).map(condition => (
                <Select.Option
                    key={condition.type}
                    value={condition.type}>
                    {condition.title}
                </Select.Option>
            ))}
        </Select>
    );

    return configuration;
}