import React from "react";
import { GeoJSON } from "react-leaflet";

const ParcelLayer = ({ districts, getParcelStyle, onEachFeature }) => {
  return districts
    .filter((d) => d.checked && d.parcels?.length)
    .flatMap((d) =>
      d.parcels.map((p) => (
        <GeoJSON
          key={`${d.name}-${p.gid || Math.random()}`}
          data={{
            type: "Feature",
            geometry: p.geom,
            properties: { ...p, districtName: d.displayName },
          }}
          style={getParcelStyle(d.name)}
          onEachFeature={onEachFeature}
        />
      ))
    );
};

export default ParcelLayer;
