"use client";
import { combineReducers, configureStore  } from "@reduxjs/toolkit";
import user from "./reducer/user";
import officials from "./reducer/officials";
import alluser from "./reducer/resident";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default local storage
import document from "./reducer/document";


const persistConfig = {
  key: "root",
  storage,
  // No whitelist or blacklist
};

const rootReducer = combineReducers({
  user: user,
  officials: officials,
  alluser: alluser,
  document: document,
  //add all your reducers here
},);

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,

 });


 export const persistor = persistStore(store);