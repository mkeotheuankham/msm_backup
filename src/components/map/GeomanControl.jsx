import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const GeomanControl = ({ activeTool, onCreate, onEdit, onDelete }) => {
  const map = useMap();

  useEffect(() => {
    if (!map?.pm) return;

    map.pm.addControls({
      position: "topleft",
      drawMarker: false,
      drawPolygon: false,
      drawPolyline: false,
      drawCircle: false,
      drawCircleMarker: false,
      drawRectangle: false,
      editMode: false,
      dragMode: false,
      cutPolygon: false,
      removalMode: false,
    });

    map.on("pm:create", (e) => onCreate?.(e));
    map.on("pm:edit", (e) => onEdit?.(e));
    map.on("pm:remove", (e) => onDelete?.(e));

    return () => {
      map.pm.disableDraw();
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalRemovalMode();
      map.off("pm:create");
      map.off("pm:edit");
      map.off("pm:remove");
    };
  }, [map, onCreate, onEdit, onDelete]);

  useEffect(() => {
    if (!map) return;

    map.pm.disableDraw(); // disable all draw modes first
    map.pm.disableGlobalEditMode();
    map.pm.disableGlobalRemovalMode();
    map.pm.disableGlobalCutMode();

    switch (activeTool) {
      case "point":
        map.pm.enableDraw("Marker");
        break;
      case "line":
        map.pm.enableDraw("Line");
        break;
      case "area":
        map.pm.enableDraw("Polygon");
        break;
      case "circlemarker":
        map.pm.enableDraw("CircleMarker");
        break;
      case "edit":
        map.pm.toggleGlobalEditMode();
        break;
      case "delete":
        map.pm.toggleGlobalRemovalMode();
        break;
      case "cut":
        map.pm.toggleGlobalCutMode();
        break;
      case "text":
        alert("Text drawing not implemented yet"); // หรือใช้ marker + popup
        break;
      default:
        break;
    }
  }, [activeTool, map]);

  return null;
};

export default GeomanControl;
