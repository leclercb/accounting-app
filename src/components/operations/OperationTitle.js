import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useOperationApi } from 'hooks/UseOperationApi';

function OperationTitle(props) {
    const operationApi = useOperationApi();
    const operation = operationApi.operations.find(operation => operation.id === props.operationId);

    return operation ? (
        <Icon icon="circle" color={operation.color} text={operation.title} />
    ) : (<span>&nbsp;</span>);
}

OperationTitle.propTypes = {
    operationId: PropTypes.string
};

export default OperationTitle;