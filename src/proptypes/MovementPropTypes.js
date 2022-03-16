import PropTypes from 'prop-types';

export const MovementPropType = PropTypes.shape({
    id: PropTypes.string.isRequired,
    category: PropTypes.string
});