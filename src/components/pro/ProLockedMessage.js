import React from 'react';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';

export function ProLockedMessage({ info }) {
    let description = 'This feature requires a Accounting Pro license !';

    if (info) {
        description = 'Accounting Pro has not been activated !';
    }

    return (
        <Empty
            image={(<Icon color="#ffecb3" icon="lock" size={64} />)}
            description={description} />
    );
}

ProLockedMessage.propTypes = {
    info: PropTypes.bool
};

export default ProLockedMessage;