import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./pages/MapPage";
// import MapWithAPI from "./pages/MapWithAPI";
// import MapWithPagination from "./pages/MapWithPagination";
// import MapWithClustering from "./pages/MapWithClustering";
// import DistrictMapWithLayers from "./pages/DistrictMapWithLayers";
import "./styles/global.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

function App() {
  return (
    <div className="app">
      <MapPage />
      {/* <MapWithAPI /> */}
      {/* <MapWithPagination /> */}
      {/* <MapWithClustering /> */}
      {/* <DistrictMapWithLayers /> */}
    </div>
  );
}

export default App;
