import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { createLocalStorage } from "./createLocalStorage";
import authReducer from "./slices/authSlice";
import sidebarReducer from "./slices/sidebarSlice";
import themeReducer from "./slices/themeSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  sidebar: sidebarReducer
});

const storage = createLocalStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["theme", "auth"] // Only persist theme and auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/REGISTER",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/PAUSE"
        ]
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
