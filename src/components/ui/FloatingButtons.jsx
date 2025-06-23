import React, { useState } from "react";
import {
  FiMap,
  FiEdit2,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiSave,
  FiGlobe,
  FiSearch,
} from "react-icons/fi";
import { FaRuler } from "react-icons/fa";
import DropdownButton from "./DropdownButton";

const FloatingButtons = ({
  activeTool,
  setActiveTool,
  onUploadCSV,
  onUndo,
  onRedo,
  onSave,
  setActiveDrawType,
}) => {
  const [language, setLanguage] = useState("la"); // 'la' = Lao, 'en' = English
  const [currentDrawType, setCurrentDrawType] = useState(null);
  const isActive = (tool) => currentDrawType === tool;
  const t = (en, la) => (language === "en" ? en : la);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "la" : "en"));
  };

  const handleDrawClick = (type) => {
    setActiveDrawType(type);
    setCurrentDrawType(type);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 10,
        background: "rgba(0, 0, 0, 0.1)",
        padding: "10px 10px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1002,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        transition: "all 0.3s ease",
        animation: "fadeIn 0.4s ease-out",
      }}
    >
      {/* Draw Tools */}
      <DropdownButton
        icon={<FiMap />}
        label={`${t("Draw", "ວາດ")}`}
        items={[
          {
            name: "draw_polygon",
            label: t("Polygon", "ພື້ນທີ່"),
            onClick: () => handleDrawClick("polygon"),
            active: isActive("polygon"),
          },
          {
            name: "draw_polyline",
            label: t("Line", "ເສັ້ນ"),
            onClick: () => handleDrawClick("polyline"),
            active: isActive("polyline"),
          },
          {
            name: "draw_marker",
            label: t("Point", "ຈຸດ"),
            onClick: () => handleDrawClick("marker"),
            active: isActive("marker"),
          },
        ]}
      />

      {/* Upload Tools */}
      <DropdownButton
        icon={<FiUpload />}
        label={`${t("Upload", "ອັບໂຫຼດ")}`}
        items={[
          { name: "csv", label: "CSV", onClick: onUploadCSV },
          {
            name: "shp",
            label: "Shapefile",
            onClick: () => alert("Upload Shapefile"),
          },
          { name: "kml", label: "KML", onClick: () => alert("Upload KML") },
          {
            name: "geojson",
            label: "GeoJSON",
            onClick: () => alert("Upload GeoJSON"),
          },
        ]}
      />

      {/* Search */}
      <button
        style={{ ...buttonStyle, transition: "all 0.2s ease" }}
        title={t("Search", "ຄົ້ນຫາ")}
        onClick={() => alert("Search function")}
      >
        <FiSearch /> {t("Search", "ຄົ້ນຫາ")}
      </button>

      {/* Command Buttons */}
      <button
        style={{ ...buttonStyle, transition: "all 0.2s ease" }}
        title="Undo"
        onClick={onUndo}
      >
        <FiRotateCcw /> {t("Undo", "ກັບຄືນ")}
      </button>
      <button
        style={{ ...buttonStyle, transition: "all 0.2s ease" }}
        title="Redo"
        onClick={onRedo}
      >
        <FiRotateCw /> {t("Redo", "ທຳຊ້ຳ")}
      </button>
      <button
        style={{
          ...buttonStyle,
          background: "rgba(0, 123, 255, 0.8)",
          color: "#fff",
          border: "none",
          fontWeight: 600,
          transition: "all 0.2s ease",
        }}
        title="Save"
        onClick={onSave}
      >
        <FiSave /> {t("Save", "ບັນທຶກ")}
      </button>

      {/* Language Switch */}
      <button
        onClick={toggleLanguage}
        style={{
          ...buttonStyle,
          marginTop: 4,
          justifyContent: "center",
          fontWeight: 500,
        }}
        title="Toggle Language"
      >
        <FiGlobe /> {language === "en" ? "ປ່ຽນເປັນລາວ" : "Switch to English"}
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover {
          transform: scale(1.05);
        }
        .dropdown-item.active {
          background-color: #0d6efd !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

const buttonStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255,255,255,0.2)",
  padding: "6px 10px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: 500,
  backdropFilter: "blur(8px)",
  color: "#fff",
};

export default FloatingButtons;
