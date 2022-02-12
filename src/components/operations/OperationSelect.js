import React, { forwardRef } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { useOperationApi } from 'hooks/UseOperationApi';

const OperationSelect = forwardRef(function OperationSelect(props, ref) {
    const operationApi = useOperationApi();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {operationApi.operations.map(operation => (
                <Select.Option key={operation.id} value={operation.id}>
                    <Icon icon="circle" color={operation.color} text={operation.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

OperationSelect.displayName = 'ForwardRefOperationSelect';

export default OperationSelect;