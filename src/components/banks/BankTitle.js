import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { getBanks } from 'data/DataBanks';

function BankTitle(props) {
    const bank = getBanks().find(bank => bank.id === props.bankId);

    return bank ? (
        <Icon icon="circle" color={bank.color} text={bank.title} />
    ) : (<span>&nbsp;</span>);
}

BankTitle.propTypes = {
    bankId: PropTypes.string
};

export default BankTitle;