import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/common/Icon';
import { useCategoryApi } from 'hooks/UseCategoryApi';

function CategoryTitle(props) {
    const categoryApi = useCategoryApi();
    const category = categoryApi.categories.find(category => category.id === props.categoryId);

    return category ? (
        <Icon icon="circle" color={category.color} text={category.title} />
    ) : (<span>&nbsp;</span>);
}

CategoryTitle.propTypes = {
    categoryId: PropTypes.string
};

export default CategoryTitle;