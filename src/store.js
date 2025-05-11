import { combineReducers, configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./features/transactions/transactionsSlice"
import friendsReducer from "./features/friends/friendsSlice"
import currentUserReducer from "./features/current-user/currentUserSlice"
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"

const rootReducer = combineReducers({
    transactions: transactionsReducer,
    friends: friendsReducer,
    currentUser: currentUserReducer
});

const persistConfig = {
    key: 'root',
    storage,
    version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
            }
        })
});

export const persistor = persistStore(store);
export default store;