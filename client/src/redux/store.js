import {  combineReducers , configureStore } from "@reduxjs/toolkit";
import { persistReducer , persistStore } from "redux-persist";
import userReducer from "./user/userSlice.js";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const rootReducer = combineReducers({
    user: userReducer
});

const persistConfig = {
    key: 'root',
    storage, 
    version : 1, // Versioning for the persisted state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for non-serializable data
        }),
});

export const persistor = persistStore(store);