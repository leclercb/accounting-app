import React, { forwardRef } from 'react';
import { Select } from 'antd';
import Icon from 'components/common/Icon';
import { useCategoryApi } from 'hooks/UseCategoryApi';

const CategorySelect = forwardRef(function CategorySelect(props, ref) {
    const categoryApi = useCategoryApi();

    return (
        <Select ref={ref} allowClear={true} {...props}>
            {categoryApi.categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                    <Icon icon="circle" color={category.color} text={category.title} />
                </Select.Option>
            ))}
        </Select>
    );
});

CategorySelect.displayName = 'ForwardRefCategorySelect';

export default CategorySelect;