import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { RulePropType } from 'proptypes/RulePropTypes';
import { getDefaultFormItemLayout, onCommitForm } from 'utils/FormUtils';
import { getInputForType } from 'data/DataFieldComponents';
import { getValuePropNameForType } from 'data/DataFieldTypes';
import { getRuleFields } from 'data/DataRuleFields';

function RuleForm({ rule, updateRule }) {
    const [form] = Form.useForm();

    const fields = getRuleFields();

    const formItemLayout = getDefaultFormItemLayout();

    const titleRef = useRef(null);

    useEffect(() => {
        form.resetFields();

        if (titleRef.current && !rule.title) {
            titleRef.current.focus();
        }
    }, [rule]); // eslint-disable-line react-hooks/exhaustive-deps

    const onCommit = () => onCommitForm(form, rule, updateRule);

    return (
        <Form form={form} initialValues={rule} {...formItemLayout}>
            {fields.filter(field => field.visible !== false).map(field => (
                <Form.Item
                    key={field.id}
                    name={field.id}
                    label={field.title}
                    valuePropName={getValuePropNameForType(field.type)}>
                    {getInputForType(
                        field.type,
                        field.options,
                        {
                            ref: field.id === 'firstName' ? titleRef : undefined,
                            onCommit: () => onCommitForm(form, rule, updateRule)
                        })}
                </Form.Item>
            ))}
        </Form >
    );
}

RuleForm.propTypes = {
    rule: RulePropType.isRequired,
    updateRule: PropTypes.func,
    disabled: PropTypes.bool
};

export default RuleForm;