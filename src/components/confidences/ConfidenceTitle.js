import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useConfidenceApi } from 'hooks/UseConfidenceApi';

function ConfidenceTitle(props) {
    const confidenceApi = useConfidenceApi();
    const confidence = confidenceApi.confidences.find(confidence => confidence.id === props.confidenceId);

    return confidence ? (
        <Icon icon="circle" color={confidence.color} text={confidence.title} />
    ) : (<span>&nbsp;</span>);
}

ConfidenceTitle.propTypes = {
    confidenceId: PropTypes.string
};

export default ConfidenceTitle;