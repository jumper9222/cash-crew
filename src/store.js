import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./features/transactions/transactionsSlice"
import friendsReducer from "./features/friends/friendsSlice"
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"

const persistedReducer = persistReducer(
    {
        key: 'root',
        storage
    },

)

export default configureStore({
    reducer: {
        transactions: transactionsReducer,
        friends: friendsReducer
    }
})