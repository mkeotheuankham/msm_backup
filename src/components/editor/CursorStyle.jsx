// CursorStyle.js
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const CursorStyle = ({ cursorType = "grab" }) => {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    container.style.cursor = cursorType;

    // ເມື່ອກົດຄລິກທີ່ແຜນທີ່
    const handleMouseDown = () => {
      container.style.cursor = "grabbing";
    };

    // ເມື່ອປ່ອຍຄລິກ
    const handleMouseUp = () => {
      container.style.cursor = cursorType;
    };

    map.on("mousedown", handleMouseDown);
    map.on("mouseup", handleMouseUp);

    return () => {
      container.style.cursor = "";
      map.off("mousedown", handleMouseDown);
      map.off("mouseup", handleMouseUp);
    };
  }, [map, cursorType]);

  return null;
};

export default CursorStyle;
