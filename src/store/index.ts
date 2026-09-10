import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./slices/authSlice";
import sidebarReducer from "./slices/sidebarSlice";
import themeReducer from "./slices/themeSlice";

const storage = {
  getItem: (key: string) => Promise.resolve(window.localStorage.getItem(key)),

  setItem: (key: string, value: string) => Promise.resolve(window.localStorage.setItem(key, value)),

  removeItem: (key: string) => Promise.resolve(window.localStorage.removeItem(key))
};

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  sidebar: sidebarReducer
});

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
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
      }
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
