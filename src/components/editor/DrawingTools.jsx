import React, { useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const DrawingTool = () => {
  const mapCenter = [17.985375, 103.968534]; // ພິກັດກາງປະເທດລາວ
  const zoomLevel = 7;

  useEffect(() => {
    // ໃຫ້ແນ່ໃຈວ່າ icon ຖືກຕັ້ງຄ່າຢ່າງຖືກຕ້ອງ
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);

  const _onCreate = (e) => {
    const layer = e.layer;
    const layerType = e.layerType;
    const geoJSON = layer.toGeoJSON();

    console.log("Layer created:", {
      type: layerType,
      geoJSON: geoJSON,
    });
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <FeatureGroup>
          {/* ຈະເພີ່ມ drawing control ໃນ useEffect */}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default DrawingTool;
