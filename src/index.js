import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";
import "./styles/variables.css";
import { MapProvider } from "./context/MapContext";
import { ApiProvider } from "./context/ApiContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApiProvider>
      <MapProvider>
        <App />
      </MapProvider>
    </ApiProvider>
  </React.StrictMode>
);
