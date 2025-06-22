import React from "react";
import MapPage from "./pages/MapPage";
import "./styles/global.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

function App() {
  return (
    <div className="app">
      <MapPage />
    </div>
  );
}

export default App;
