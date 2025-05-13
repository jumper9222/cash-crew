import { createSlice } from "@reduxjs/toolkit";
import { addFriend, fetchCurrentUserFriends } from "./friendsActions";
import { getCurrentUserFromDB } from "../current-user/currentUserActions";
import { Friend, FriendsState } from "../../types/friends.types";

const initialState: FriendsState = {
  friends: {},
  friendEmails: [],
  loading: false,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState: initialState,
  reducers: {
    clearFriends(state) {
      return (state = initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addFriend.pending, (state) => {
        state.loading = true;
        console.log("Attempting to add friend...");
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        if (!action.payload) return;

        const { email, ...rest } = action.payload;
        console.log(action.payload);
        state.friends = { ...state.friends, [email]: { email, ...rest } };
        state.friendEmails = [...state.friendEmails, email];
        console.log("Friend added successfully.", state.friends);
        state.loading = false;
      })
      .addCase(addFriend.rejected, (state, action) => {
        console.log("Attempt to add friend failed: ", action.error.message);
        state.loading = false;
      })
      .addCase(fetchCurrentUserFriends.pending, (state) => {
        state.loading = true;
        console.log("Fetching friends from firestore...");
      })
      .addCase(fetchCurrentUserFriends.fulfilled, (state, action) => {
        const friends = action.payload;
        if (!friends) {
          console.log("You have no friends 😢");
          return;
        }

        console.log("fetchFriendsByEmail: ", action.payload);
        state.friends = friends.reduce((accu, { uid, ...rest }) => {
          accu[uid] = { uid, ...rest };
          return accu;
        }, {} as Record<string, Friend>);
        console.log("Friends fetched successfully.", state.friends);
        state.loading = false;
      })
      .addCase(fetchCurrentUserFriends.rejected, (state, action) => {
        console.log("Attempt to fetch friends failed: ", action.error.message);
        state.loading = false;
      })
      .addCase(getCurrentUserFromDB.fulfilled, (state, action) => {
        const { friends } = action.payload;
        state.friendEmails = action.payload.friends ? [...friends] : [];
        state.loading = false;
        console.log(
          "Successfully fetched friends emails array: ",
          state.friendEmails
        );
      });
  },
});

export const { clearFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
