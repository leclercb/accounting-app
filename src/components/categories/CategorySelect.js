import React, { forwardRef } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { useCategoryApi } from 'hooks/UseCategoryApi';

const CategorySelect = forwardRef(function CategorySelect(props, ref) {
    const categoryApi = useCategoryApi();

    return (
        <Select
            ref={ref}
            allowClear={true}
            showSearch={true}
            filterOption={(input, option) => (option.props.title || '').toLowerCase().includes(input)}
            {...props}>
            <Select.OptGroup label="Dépenses">
                {categoryApi.expensesCategories.map(category => (
                    <Select.Option key={category.id} value={category.id} title={category.title}>
                        <Icon icon="circle" color={category.color} text={category.title} />
                    </Select.Option>
                ))}
            </Select.OptGroup>
            <Select.OptGroup label="Revenus">
                {categoryApi.incomeCategories.map(category => (
                    <Select.Option key={category.id} value={category.id} title={category.title}>
                        <Icon icon="circle" color={category.color} text={category.title} />
                    </Select.Option>
                ))}
            </Select.OptGroup>
        </Select>
    );
});

CategorySelect.displayName = 'ForwardRefCategorySelect';

export default CategorySelect;