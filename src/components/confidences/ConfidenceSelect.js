import React, { forwardRef } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { useConfidenceApi } from 'hooks/UseConfidenceApi';

const ConfidenceSelect = forwardRef(function ConfidenceSelect(props, ref) {
    const confidenceApi = useConfidenceApi();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {confidenceApi.confidences.map(confidence => (
                <Select.Option key={confidence.id} value={confidence.id}>
                    <Icon icon="circle" color={confidence.color} text={confidence.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

ConfidenceSelect.displayName = 'ForwardRefConfidenceSelect';

export default ConfidenceSelect;