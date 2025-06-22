import { createContext, useState } from "react";

export const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [activeLayer, setActiveLayer] = useState(
    process.env.REACT_APP_DEFAULT_MAP_LAYER || "standard"
  );

  const defaultCenter = process.env.REACT_APP_DEFAULT_MAP_CENTER
    ? process.env.REACT_APP_DEFAULT_MAP_CENTER.split(",").map(Number)
    : [51.505, -0.09];

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoomLevel, setZoomLevel] = useState(
    parseInt(process.env.REACT_APP_DEFAULT_ZOOM) || 13
  );
  const [markers, setMarkers] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState("");

  return (
    <MapContext.Provider
      value={{
        activeLayer,
        setActiveLayer,
        mapCenter,
        setMapCenter,
        zoomLevel,
        setZoomLevel,
        markers,
        setMarkers,
        selectedEndpoint,
        setSelectedEndpoint,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
