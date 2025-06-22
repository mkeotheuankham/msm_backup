import React, { useState } from "react";
import {
  MapContainer,
  LayersControl,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Header from "../components/ui/Header";
import FeatureEditor from "../components/editor/FeatureEditor";
import "./MapPage.css";
import CursorStyle from "../components/editor/CursorStyle"; // ນຳເຂົ້າ CursorStyle

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
  iconUrl: require("leaflet/dist/images/marker-icon.png").default,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
});

const MapPage = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  const layers = [
    {
      name: "OSM Standard",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      checked: true,
    },
    {
      name: "Stadia Satellite",
      url: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg",
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
    },
    {
      name: "Carto Voyager",
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    },
    {
      name: "ArcGIS Imagery",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
  ];

  const handleMapClick = (e) => {
    const newMarker = {
      position: [e.latlng.lat, e.latlng.lng],
      name: `Marker ${markers.length + 1}`,
      type: "point",
    };
    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);
  };

  return (
    <div className="map-page">
      <Header />
      <div className="map-container">
        <MapContainer
          center={[17.985375, 103.968534]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          onClick={handleMapClick}
        >
          {/* ເພີ່ມ CursorStyle ເຂົ້າໄປໃນ MapContainer */}
          <CursorStyle cursorType="crosshair" />

          <LayersControl position="topright">
            {layers.map((layer, index) => (
              <LayersControl.BaseLayer
                key={index}
                name={layer.name}
                checked={layer.checked}
              >
                <TileLayer
                  url={layer.url}
                  attribution={layer.attribution}
                  minZoom={0}
                  maxZoom={21}
                  detectRetina={true}
                />
              </LayersControl.BaseLayer>
            ))}

            {markers.map((marker, index) => (
              <Marker key={index} position={marker.position}>
                <Popup>
                  <div>
                    <h3>{marker.name}</h3>
                    <p>Type: {marker.type}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayersControl>
        </MapContainer>
        <FeatureEditor
          selectedMarker={selectedMarker}
          setSelectedMarker={setSelectedMarker}
          setMarkers={setMarkers}
          markers={markers}
        />
      </div>
    </div>
  );
};

export default MapPage;
