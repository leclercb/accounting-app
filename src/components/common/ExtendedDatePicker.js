import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { InputNumber, Switch } from 'antd';
import DatePicker from 'components/common/DatePicker';
import Spacer from 'components/common/Spacer';

class ExtendedDatePicker extends React.Component {
    constructor(props) {
        super(props);

        this.onSwitchChange = this.onSwitchChange.bind(this);
        this.onNumberChange = this.onNumberChange.bind(this);
    }

    onSwitchChange(checked) {
        if (this.props.onChange) {
            this.props.onChange(checked ? 0 : dayjs().toISOString());
        }
    }

    onNumberChange(value) {
        if (this.props.onChange) {
            this.props.onChange(Number.isInteger(value) ? value : 0);
        }
    }

    render() {
        return (
            <React.Fragment>
                <Switch
                    checked={Number.isInteger(this.props.value)}
                    onChange={this.onSwitchChange}
                    checkedChildren="Use number of days from now"
                    unCheckedChildren="Use fixed date"
                    style={{ marginRight: 10 }}
                    disabled={this.props.disabled} />
                {Number.isInteger(this.props.value) ?
                    (
                        <React.Fragment>
                            <InputNumber {...this.props} onChange={this.onNumberChange} />
                            <Spacer />
                            <span>({dayjs().add(this.props.value, 'day').format(this.props.format)})</span>
                        </React.Fragment>
                    ) : (
                        <DatePicker {...this.props} />
                    )}
            </React.Fragment>
        );
    }
}

ExtendedDatePicker.propTypes = {
    format: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string
    ]),
    onChange: PropTypes.func,
    onOpenChange: PropTypes.func,
    disabled: PropTypes.bool
};

export default ExtendedDatePicker;