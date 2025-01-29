import { createSelector } from "@reduxjs/toolkit";

const getFriends = state => state.friends.friends

export const selectFriendById = (id) => createSelector(
    [getFriends],
    (friends) => {
        return friends[id]
    }
)

export const selectFriendDisplayNameById = (id) => createSelector(
    [getFriends],
    (friends) => {
        return friends[id]?.displayName || friends[id].email
    }
)