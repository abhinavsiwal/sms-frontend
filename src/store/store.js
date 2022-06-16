import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {

  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { PersistGate } from "redux-persist/integration/react";

import authReducer from './reducers/auth'
import studentReducer from './reducers/student'
import staffReducer from './reducers/staff'
import classReducer from './reducers/class'
import cartReducer from './reducers/cart';
const reducers = combineReducers({
    authReducer,
    studentReducer,
    staffReducer,
    classReducer,
    cartReducer
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["authReducer","cartReducer","classReducer"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
