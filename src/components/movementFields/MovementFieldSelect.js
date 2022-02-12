import React, { forwardRef } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { useMovementFieldApi } from 'hooks/UseMovementFieldApi';

const MovementFieldSelect = forwardRef(function MovementFieldSelect(props, ref) {
    const movementFieldApi = useMovementFieldApi();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {movementFieldApi.movementFields.map(movementField => (
                <Select.Option key={movementField.id} value={movementField.id}>
                    <Icon icon="circle" color={movementField.color} text={movementField.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

MovementFieldSelect.displayName = 'ForwardRefMovementFieldSelect';

export default MovementFieldSelect;