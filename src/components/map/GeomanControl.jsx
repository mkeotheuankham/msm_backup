import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";

const GeomanControl = ({ activeTool, onCreate, onEdit, onDelete }) => {
  const map = useMap();

  useEffect(() => {
    if (!map?.pm) return;

    // 💡 เพิ่ม Geoman control toolbar (1 ครั้ง)
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

    // 📌 ตรวจสอบ draw modes ที่มีให้ใช้
    console.log("Available draw modes:", Object.keys(map.pm.Draw));

    // 🪝 Event listener
    map.on("pm:create", (e) => onCreate?.(e));
    map.on("pm:edit", (e) => onEdit?.(e));
    map.on("pm:remove", (e) => onDelete?.(e));

    return () => {
      map.pm.disableDraw();
      map.off("pm:create");
      map.off("pm:edit");
      map.off("pm:remove");
    };
  }, [map, onCreate, onEdit, onDelete]);

  useEffect(() => {
    if (!map?.pm) return;

    // ปิดโหมดวาดก่อน
    map.pm.disableDraw("Marker");
    map.pm.disableDraw("Polygon");
    map.pm.disableDraw("Line");

    // ✅ เลือกเปิดเฉพาะ activeTool
    switch (activeTool) {
      case "point":
        map.pm.enableDraw("Marker", { snappable: true });
        break;

      case "line":
        if ("Line" in map.pm.Draw) {
          map.pm.enableDraw("Line", { snappable: true });
        } else {
          console.warn("Draw mode 'Line' is not available.");
        }
        break;

      case "area":
        map.pm.enableDraw("Polygon", { snappable: true });
        break;

      default:
        break;
    }
  }, [activeTool, map]);

  return null;
};

export default GeomanControl;
