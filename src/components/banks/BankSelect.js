import React, { forwardRef } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { getBanks } from 'data/DataBanks';

const BankSelect = forwardRef(function BankSelect(props, ref) {
    return (
        <Select ref={ref} allowClear={true} {...props}>
            {getBanks().map(bank => (
                <Select.Option key={bank.id} value={bank.id}>
                    <Icon icon="circle" color={bank.color} text={bank.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

BankSelect.displayName = 'ForwardRefBankSelect';

export default BankSelect;