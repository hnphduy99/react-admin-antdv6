import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import sidebarReducer from "./slices/sidebarSlice";

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
