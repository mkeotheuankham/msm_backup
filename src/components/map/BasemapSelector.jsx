// components/map/BasemapSelector.jsx
import React from "react";
import { LayersControl, TileLayer } from "react-leaflet";

const BasemapSelector = () => {
  return (
    <LayersControl position="topleft">
      <LayersControl.BaseLayer checked name="OpenStreetMap">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          minZoom={0}
          maxZoom={21}
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Stadia Satellite">
        <TileLayer
          url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg"
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          minZoom={0}
          maxZoom={21}
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="Carto Voyager">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          minZoom={0}
          maxZoom={21}
        />
      </LayersControl.BaseLayer>

      <LayersControl.BaseLayer name="ArcGIS Imagery">
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          minZoom={0}
          maxZoom={21}
        />
      </LayersControl.BaseLayer>
    </LayersControl>
  );
};

export default BasemapSelector;
