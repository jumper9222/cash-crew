import { createSlice } from "@reduxjs/toolkit";
import { addFriend, fetchFriendsByUserId } from "./friendsAsyncThunks";

const friendsSlice = createSlice({
    name: 'friends',
    initialState: {
        friends: {},
        loading: false
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(addFriend.pending, (state) => {
            state.loading = true;
            console.log('Attempting to add friend...')
        });
        builder.addCase(addFriend.fulfilled, (state, action) => {
            const { email, uid, ...rest } = action.payload;
            console.log(action.payload)
            state.friends[email] = { email, ...rest }
            console.log('Friend added successfully.', state.friends)
            state.loading = false;
        });
        builder.addCase(addFriend.rejected, (state, action) => {
            console.log('Attempt to add friend failed: ', action.error.message)
            state.loading = false;
        });
        builder.addCase(fetchFriendsByUserId.pending, (state) => {
            state.loading = true;
            console.log('Fetching friends from firestore...')
        })
        builder.addCase(fetchFriendsByUserId.fulfilled, (state, action) => {
            const friends = action.payload;
            console.log(action.payload)
            state.friends = friends.map(({ email, uid, ...rest }) => {
                return state.friends[email] = { email, ...rest }
            })
            console.log('Friends fetched successfully.', state.friends)
            state.loading = false;
        });
        builder.addCase(fetchFriendsByUserId.rejected, (state, action) => {
            console.log('Attempt to fetch friends failed: ', action.error.message)
            state.loading = false;
        });
    }
})

export default friendsSlice.reducer;