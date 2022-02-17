import React, { forwardRef } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useConfidenceApi } from 'hooks/UseConfidenceApi';

const ConfidenceSelect = forwardRef(function ConfidenceSelect(props, ref) {
    const confidenceApi = useConfidenceApi();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {confidenceApi.confidences
                .filter(confidence => props.type ? confidence.type === props.type : true)
                .map(confidence => (
                    <Select.Option key={confidence.id} value={confidence.id}>
                        <Icon icon="circle" color={confidence.color} text={confidence.title} />
                    </Select.Option>
                ))}
        </Select>
    );
});

ConfidenceSelect.displayName = 'ForwardRefConfidenceSelect';

ConfidenceSelect.propTypes = {
    type: PropTypes.string
};

export default ConfidenceSelect;