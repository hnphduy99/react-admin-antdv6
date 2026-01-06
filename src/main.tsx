import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App.tsx";
import { setupMocks } from "./mocks";
import "./i18n/config";
import "./index.css";
import { persistor, store } from "./store";

if (import.meta.env.DEV) {
  setupMocks();
}

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
