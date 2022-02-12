import PropTypes from 'prop-types';

export const RulePropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    category: PropTypes.string,
    confidence: PropTypes.string
});