import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUserFromDB, setUserDoc, updateBasicInfo } from "./currentUserActions";

const currentUserSlice = createSlice({
    name: 'currentUser',
    initialState: {
        displayName: '',
        email: '',
        phoneNumber: '',
        photoURL: '',
        uid: '',
        birthday: '',
        gender: '',
        loading: false,
        settings: {
            defaultCurrency: 'MYR',
            categories: [
                'Eating Out',
                'Groceries',
                'Utilities',
                'Transaportation',
                'Shopping',
                'Pets'
            ]
        }
    },
    reducers: {
        clearUser(state) {
            state.displayName = '';
            state.email = '';
            state.phoneNumber = '';
            state.photoURL = '';
            state.uid = '';
            state.birthday = '';
            state.gender = '';
            state.settings = {
                defaultCurrency: 'MYR',
                categories: [
                    'Eating Out',
                    'Groceries',
                    'Utilities',
                    'Transaportation',
                    'Shopping',
                    'Pets'
                ]
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setUserDoc.pending, (state) => {
            state.loading = true;
            console.log('Storing user data in database...')
        });
        builder.addCase(setUserDoc.fulfilled, (state, action) => {
            const { displayName, email, phoneNumber, photoURL, uid } = action.payload;
            state.displayName = displayName;
            state.email = email;
            state.phoneNumber = phoneNumber;
            state.photoURL = photoURL;
            state.uid = uid;
            state.loading = false;
            console.log('User data stored in database and redux successfully.')
        });
        builder.addCase(setUserDoc.rejected, (state, action) => {
            state.loading = false;
            console.log('Error storing user data in database: ', action.error.message)
        });

        builder.addCase(getCurrentUserFromDB.pending, (state) => {
            state.loading = true;
            console.log('Getting user data from database...')
        });
        builder.addCase(getCurrentUserFromDB.fulfilled, (state, action) => {
            console.log('getCurrentUser fulfilled: ', action.payload)
            const currentUser = action.payload;
            state.displayName = currentUser?.displayName || ''
            state.email = currentUser?.email || ''
            state.phoneNumber = currentUser?.phoneNumber || ''
            state.photoURL = currentUser?.photoURL || ''
            state.uid = currentUser?.uid || ''
            state.gender = currentUser?.gender || ''
            state.birthday = currentUser?.birthday || ''
            state.loading = false;
            console.log('Successfully fetched user from database.')
        });
        builder.addCase(getCurrentUserFromDB.rejected, (state, action) => {
            state.loading = false;
            console.log('Error storing user data in database: ', action.error.message)
        });

        builder.addCase(updateBasicInfo.pending, (state) => {
            state.loading = true;
            console.log('Updating user basic info...')
        });
        builder.addCase(updateBasicInfo.fulfilled, (state, action) => {
            const { displayName, photoURL, birthday, gender } = action.payload;
            state.displayName = displayName;
            state.photoURL = photoURL;
            state.birthday = birthday;
            state.gender = gender;
            state.loading = false;
            console.log(state)
            console.log('User basic info updated successfully.')
        });
        builder.addCase(updateBasicInfo.rejected, (state, action) => {
            state.loading = false;
            console.error('Failed to update user basic info: ', action.error.message)
        });
    }
})

export const { clearUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;