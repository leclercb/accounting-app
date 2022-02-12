import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useMovementFieldApi } from 'hooks/UseMovementFieldApi';

function MovementFieldTitle(props) {
    const movementFieldApi = useMovementFieldApi();
    const movementField = movementFieldApi.movementFields.find(movementField => movementField.id === props.movementFieldId);

    return movementField ? (
        <Icon icon="circle" color={movementField.color} text={movementField.title} />
    ) : (<span>&nbsp;</span>);
}

MovementFieldTitle.propTypes = {
    movementFieldId: PropTypes.string
};

export default MovementFieldTitle;