import { createSelector } from "@reduxjs/toolkit";

const getCategories = state => state.currentUser.settings.categories;

export const categoriesArray = createSelector(
    [getCategories],
    (categories) => {
        const array = Object.entries(categories).map(([id, { emoji, name, parentCategoryID }]) => {
            return { value: id, label: emoji + ' ' + name, parentCategoryID };
        })
        console.log('categories array:', array)
        return array
    }
)