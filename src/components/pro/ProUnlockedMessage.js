import React from 'react';
import { Empty } from 'antd';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import Constants from 'constants/Constants';

export function ProUnlockedMessage({ licenseInfo }) {
    return (
        <Empty
            image={(<Icon color={Constants.fadeIconColor} icon="lock-open" size={64} />)}
            description={(
                <span>
                    Accounting Pro has been successfully activated !<br />
                    <strong>Email: </strong>{licenseInfo.email}<br />
                    {licenseInfo.expirationDate && (
                        <React.Fragment>
                            <strong>Expiration Date: </strong>{licenseInfo.expirationDate}<br />
                        </React.Fragment>
                    )}
                </span>
            )} />
    );
}

ProUnlockedMessage.propTypes = {
    licenseInfo: PropTypes.object
};

export default ProUnlockedMessage;