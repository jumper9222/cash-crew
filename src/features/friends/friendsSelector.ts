import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export const getFriends = (state: RootState) => state.friends.friends;

export const selectFriendById = (id: string) =>
  createSelector([getFriends], (friends) => {
    return friends[id];
  });

export const selectFriendDisplayNameById = (id: string) =>
  createSelector([getFriends], (friends) => {
    return friends[id]?.displayName || friends[id].email;
  });
