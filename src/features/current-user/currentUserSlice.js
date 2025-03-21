import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUserFromDB, setUserDoc, updateBasicInfo } from "./currentUserActions";

const categories = {
    fb000: { name: "Food & Beverages", type: "Need", emoji: "🍔", parentCategory: null, parentCategoryID: null },
    fb001: { name: "Groceries", type: "Need", emoji: "🥖", parentCategory: "Food & Beverages", parentCategoryID: "fb000" },
    fb002: { name: "Eating Out", type: "Want", emoji: "🍽️", parentCategory: "Food & Beverages", parentCategoryID: "fb000" },
    fb003: { name: "Snacks", type: "Want", emoji: "🥯", parentCategory: "Food & Beverages", parentCategoryID: "fb000" },
    fb004: { name: "Drinks", type: "Want", emoji: "🧋", parentCategory: "Food & Beverages", parentCategoryID: "fb000" },

    tr000: { name: "Transportation", type: "Need", emoji: "🚆", parentCategory: null, parentCategoryID: null },
    tr001: { name: "Public Transportation", type: "Need", emoji: "🚆", parentCategory: "Transportation", parentCategoryID: "tr000" },
    tr002: { name: "Petrol", type: "Need", emoji: "⛽", parentCategory: "Transportation", parentCategoryID: "tr000" },
    tr003: { name: "Parking", type: "Need", emoji: "🅿️", parentCategory: "Transportation", parentCategoryID: "tr000" },
    tr004: { name: "Toll", type: "Need", emoji: "🛣️", parentCategory: "Transportation", parentCategoryID: "tr000" },
    tr005: { name: "Car Payments", type: "Need", emoji: "🚗", parentCategory: "Transportation", parentCategoryID: "tr000" },
    tr006: { name: "Car Maintenance", type: "Need", emoji: "🔧", parentCategory: "Transportation", parentCategoryID: "tr000" },
    tr007: { name: "Registration/License", type: "Need", emoji: "📄", parentCategory: "Transportation", parentCategoryID: "tr000" },

    ho000: { name: "Home", type: "Need", emoji: "🏠", parentCategory: null, parentCategoryID: null },
    ho001: { name: "Rent", type: "Need", emoji: "🏠", parentCategory: "Home", parentCategoryID: "ho000" },
    ho002: { name: "Household Supplies", type: "Need", emoji: "🧼", parentCategory: "Home", parentCategoryID: "ho000" },
    ho003: { name: "Home Maintenance", type: "Need", emoji: "🛠️", parentCategory: "Home", parentCategoryID: "ho000" },
    ho004: { name: "Furniture", type: "Need", emoji: "🛋️", parentCategory: "Home", parentCategoryID: "ho000" },
    ho005: { name: "Mortgage", type: "Savings", emoji: "🏡", parentCategory: "Home", parentCategoryID: "ho000" },

    ut000: { name: "Utilities", type: "Need", emoji: "📃", parentCategory: null, parentCategoryID: null },
    ut001: { name: "Water", type: "Need", emoji: "💧", parentCategory: "Utilities", parentCategoryID: "ut000" },
    ut002: { name: "Electric", type: "Need", emoji: "⚡", parentCategory: "Utilities", parentCategoryID: "ut000" },
    ut003: { name: "Internet", type: "Need", emoji: "🛜", parentCategory: "Utilities", parentCategoryID: "ut000" },
    ut004: { name: "Phone", type: "Need", emoji: "📶", parentCategory: "Utilities", parentCategoryID: "ut000" },
    ut005: { name: "Gas", type: "Need", emoji: "🍳", parentCategory: "Utilities", parentCategoryID: "ut000" },
    ut006: { name: "Sanitation", type: "Need", emoji: "💩", parentCategory: "Utilities", parentCategoryID: "ut000" },

    en000: { name: "Entertainment", type: "Want", emoji: "🎭", parentCategory: null, parentCategoryID: null },
    en001: { name: "Movie", type: "Want", emoji: "🎬", parentCategory: "Entertainment", parentCategoryID: "en000" },
    en002: { name: "Video Games", type: "Want", emoji: "🎮", parentCategory: "Entertainment", parentCategoryID: "en000" },
    en003: { name: "Concerts/Shows", type: "Want", emoji: "🎫", parentCategory: "Entertainment", parentCategoryID: "en000" },
    en004: { name: "Music", type: "Want", emoji: "🎵", parentCategory: "Entertainment", parentCategoryID: "en000" },
    en005: { name: "Hobbies", type: "Want", emoji: "🪴", parentCategory: "Entertainment", parentCategoryID: "en000" },

    tv000: { name: "Travel", type: "Want", emoji: "🏝️", parentCategory: null, parentCategoryID: null },
    tv001: { name: "Flight", type: "Want", emoji: "✈️", parentCategory: "Travel", parentCategoryID: "tv000" },
    tv002: { name: "Bus", type: "Want", emoji: "🚌", parentCategory: "Travel", parentCategoryID: "tv000" },
    tv003: { name: "Train", type: "Want", emoji: "🚄", parentCategory: "Travel", parentCategoryID: "tv000" },
    tv004: { name: "Hotels", type: "Want", emoji: "🏨", parentCategory: "Travel", parentCategoryID: "tv000" },

    hm000: { name: "Health & Medical", type: "Need", emoji: "⚕️", parentCategory: null, parentCategoryID: null },
    hm001: { name: "Doctor Consultation", type: "Need", emoji: "🩺", parentCategory: "Health & Medical", parentCategoryID: "hm000" },
    hm002: { name: "Medicine", type: "Need", emoji: "💊", parentCategory: "Health & Medical", parentCategoryID: "hm000" },
    hm003: { name: "Emergency", type: "Need", emoji: "🚑", parentCategory: "Health & Medical", parentCategoryID: "hm000" },

    in000: { name: "Insurance", type: "Need", emoji: "📃", parentCategory: null, parentCategoryID: null },
    in001: { name: "Medical Insurance", type: "Need", emoji: "⚕️", parentCategory: "Insurance", parentCategoryID: "in000" },
    in002: { name: "Car Insurance", type: "Need", emoji: "🚘", parentCategory: "Insurance", parentCategoryID: "in000" },
    in003: { name: "Home Insurance", type: "Need", emoji: "🏠", parentCategory: "Insurance", parentCategoryID: "in000" },

    pr000: { name: "Personal", type: "Need", emoji: "👤", parentCategory: null, parentCategoryID: null },
    pr001: { name: "Pharmacy", type: "Need", emoji: "💊", parentCategory: "Personal", parentCategoryID: "pr000" },

    pt000: { name: "Pets", type: "Need", emoji: "😺", parentCategory: null, parentCategoryID: null },
    pt001: { name: "Pet Food", type: "Need", emoji: "🐈", parentCategory: "Pets", parentCategoryID: "pt000" },
    pt002: { name: "Vet bills", type: "Need", emoji: "🩺", parentCategory: "Pets", parentCategoryID: "pt000" },
    pt003: { name: "Pet Supplies", type: "Need", emoji: "🥎", parentCategory: "Pets", parentCategoryID: "pt000" },

    iv000: { name: "Investments", type: "Savings", emoji: "📈", parentCategory: null, parentCategoryID: null },
    iv001: { name: "Retirement Fund", type: "Savings", emoji: "👴", parentCategory: "Investments", parentCategoryID: "iv000" },

    gf000: { name: "Gifts", type: "Want", emoji: "🎁", parentCategory: null, parentCategoryID: null },
    gf001: { name: "Donation", type: "Want", emoji: "❤️", parentCategory: "Gifts", parentCategoryID: "gf000" },

    sh000: { name: "Shopping", type: "Want", emoji: "🛍️", parentCategory: null, parentCategoryID: null },
    sh001: { name: "Gadgets", type: "Want", emoji: "📱", parentCategory: "Shopping", parentCategoryID: "sh000" },
    sh002: { name: "Clothes", type: "Need", emoji: "👕", parentCategory: "Shopping", parentCategoryID: "sh000" },
}

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
            categories: categories
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
                categories: categories
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