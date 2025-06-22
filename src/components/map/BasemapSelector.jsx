import React, { useEffect } from "react";
import { LayersControl, TileLayer } from "react-leaflet";

const BasemapSelector = () => {
  useEffect(() => {
    const layersControl = document.querySelector(".leaflet-control-layers");
    if (layersControl) {
      Object.assign(layersControl.style, {
        backgroundColor: "rgba(30, 30, 30, 0.5)", // สีพื้นหลังเข้มโปร่งแสง
        color: "#f0f0f0", // สีตัวอักษรสว่าง
        boxShadow: "none",
        backdropFilter: "blur(4px)",
        border: "1px solid #555",
        borderRadius: "8px",
        padding: "4px",
      });

      // สไตล์ของ label ด้านใน (ชื่อเลเยอร์)
      const labels = layersControl.querySelectorAll("label");
      labels.forEach((label) => {
        label.style.color = "#f0f0f0";
      });
    }
  }, []);

  return (
    <LayersControl position="topleft">
      <LayersControl.BaseLayer checked name="OpenStreetMap">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Stadia Satellite">
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Carto Voyager">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="ArcGIS Imagery">
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri"
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
};

export default BasemapSelector;
