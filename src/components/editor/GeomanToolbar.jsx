import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const GeomanToolbar = ({
  onFeatureCreate = () => {},
  onFeatureRemove = () => {},
  onFeatureClick = () => {},
}) => {
  const map = useMap();

  useEffect(() => {
    console.log("map.pm:", map.pm);
    if (!map.pm) return; // ກວດສອບວ່າ geoman ໄດ້ຖືກເພີ່ມແລ້ວບໍ່

    // ເພີ່ມ Geoman controls
    map.pm.addControls({
      position: "topleft",
      drawMarker: true,
      drawPolyline: true,
      drawRectangle: true,
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      removalMode: true,
    });

    // ຈັດການເຫດການເມື່ອສ້າງ feature ໃໝ່
    const handleCreate = (e) => {
      const layer = e.layer;
      const feature = {
        id: L.stamp(layer),
        layer: layer,
        type: e.shape,
        latlng: layer.getLatLng?.(),
        latlngs: layer.getLatLngs?.(),
        createdAt: new Date().toISOString(),
      };

      onFeatureCreate(feature);

      layer.on("click", () => {
        onFeatureClick(feature);
      });
    };

    // ຈັດການເຫດການເມື່ອລຶບ feature
    const handleRemove = (e) => {
      onFeatureRemove(L.stamp(e.layer));
    };

    map.on("pm:create", handleCreate);
    map.on("pm:remove", handleRemove);

    return () => {
      map.off("pm:create", handleCreate);
      map.off("pm:remove", handleRemove);
      map.pm?.removeControls();
    };
  }, [map, onFeatureCreate, onFeatureRemove, onFeatureClick]);

  return null;
};

export default GeomanToolbar;
