import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import { store } from "./store";
import "./styles/global.css";
import "./styles/tailwind.css";
import "./styles/leaflet.css";
import "leaflet/dist/leaflet.css";
import { AlertProvider } from "./context/AlertContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AlertProvider>
        <App />
      </AlertProvider>
    </Provider>
  </StrictMode>
);
