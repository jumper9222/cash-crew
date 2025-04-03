import { createSlice } from "@reduxjs/toolkit";
import { addFriend, fetchFriendsByEmail } from "./friendsActions";
import { getCurrentUserFromDB } from "../current-user/currentUserActions";

const friendsSlice = createSlice({
    name: 'friends',
    initialState: {
        friends: {},
        friendEmails: [],
        loading: false
    },
    reducers: {
        clearFriends(state) {
            state.friends = {};
            state.friendEmails = [];
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addFriend.pending, (state) => {
            state.loading = true;
            console.log('Attempting to add friend...')
        });
        builder.addCase(addFriend.fulfilled, (state, action) => {
            const { email, ...rest } = action.payload;
            console.log(action.payload)
            state.friends = { ...state.friends, [email]: { email, ...rest } }
            state.friendEmails = [...state.friendEmails, email]
            console.log('Friend added successfully.', state.friends)
            state.loading = false;
        });
        builder.addCase(addFriend.rejected, (state, action) => {
            console.log('Attempt to add friend failed: ', action.error.message)
            state.loading = false;
        });
        builder.addCase(fetchFriendsByEmail.pending, (state) => {
            state.loading = true;
            console.log('Fetching friends from firestore...')
        })
        builder.addCase(fetchFriendsByEmail.fulfilled, (state, action) => {
            const friends = action.payload;
            if (!friends) {
                console.log('You have no friends 😢')
                return
            }

            console.log('fetchFriendsByEmail: ', action.payload)
            state.friends = friends.reduce((accu, { uid, ...rest }) => {
                accu[uid] = { uid, ...rest }
                return accu
            }, {})
            console.log('Friends fetched successfully.', state.friends)
            state.loading = false;
        });
        builder.addCase(fetchFriendsByEmail.rejected, (state, action) => {
            console.log('Attempt to fetch friends failed: ', action.error.message)
            state.loading = false;
        });
        builder.addCase(getCurrentUserFromDB.fulfilled, (state, action) => {
            const { friends } = action.payload;
            state.friendEmails = action.payload.friends ? [...friends] : [];
            state.loading = false;
            console.log('Successfully fetched friends emails array: ', state.friendEmails)
        });
    }
})

export const { clearFriends } = friendsSlice.actions;
export default friendsSlice.reducer;