import React, { useState, useEffect } from "react";
import {
  FiMap,
  FiEdit2,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiSave,
  FiGlobe,
  FiSearch,
  FiX,
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
  canUndo,
  canRedo,
}) => {
  const [language, setLanguage] = useState("la");
  const [currentDrawType, setCurrentDrawType] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const t = (en, la) => (language === "en" ? en : la);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "la" : "en"));
  };

  const handleDrawClick = (type) => {
    if (currentDrawType === type) {
      // Cancel drawing if same tool is clicked again
      setCurrentDrawType(null);
      setActiveDrawType(null);
      setIsDrawing(false);
    } else {
      setCurrentDrawType(type);
      setActiveDrawType(type);
      setIsDrawing(true);
    }
  };

  const cancelDrawing = () => {
    setCurrentDrawType(null);
    setActiveDrawType(null);
    setIsDrawing(false);
  };

  useEffect(() => {
    if (!activeTool) {
      setCurrentDrawType(null);
      setIsDrawing(false);
    }
  }, [activeTool]);

  return (
    <div
      style={{
        position: "absolute",
        top: 160,
        left: 10,
        background: "rgba(0, 0, 0, 0.5)",
        padding: "10px 10px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        zIndex: 1002,
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "all 0.3s ease",
        animation: "fadeSlideIn 0.4s ease-out",
      }}
    >
      {/* Cancel drawing button (visible when drawing) */}
      {isDrawing && (
        <button
          onClick={cancelDrawing}
          style={{
            ...buttonStyle,
            background: "rgba(255, 50, 50, 0.7)",
            color: "white",
            fontWeight: 600,
            justifyContent: "center",
          }}
        >
          <FiX /> {t("Cancel Drawing", "ຍົກເລີກການແຕ້ມ")}
        </button>
      )}

      {/* Draw Tools */}
      <DropdownButton
        icon={<FiMap />}
        label={`${t("Draw", "ວາດ")}`}
        isActive={isDrawing}
        items={[
          {
            name: "draw_polygon",
            label: t("Polygon", "ພື້ນທີ່"),
            onClick: () => handleDrawClick("polygon"),
            active: currentDrawType === "polygon",
            icon: <FiMap style={{ transform: "rotate(45deg)" }} />,
          },
          {
            name: "draw_polyline",
            label: t("Line", "ເສັ້ນ"),
            onClick: () => handleDrawClick("polyline"),
            active: currentDrawType === "polyline",
            icon: <FiEdit2 />,
          },
          {
            name: "draw_marker",
            label: t("Point", "ຈຸດ"),
            onClick: () => handleDrawClick("marker"),
            active: currentDrawType === "marker",
            icon: <FaRuler size={14} />,
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
        style={{
          ...buttonStyle,
          transition: "all 0.2s ease",
          opacity: canUndo ? 1 : 0.5,
          cursor: canUndo ? "pointer" : "not-allowed",
        }}
        title="Undo"
        onClick={canUndo ? onUndo : null}
      >
        <FiRotateCcw /> {t("Undo", "ກັບຄືນ")}
      </button>
      <button
        style={{
          ...buttonStyle,
          transition: "all 0.2s ease",
          opacity: canRedo ? 1 : 0.5,
          cursor: canRedo ? "pointer" : "not-allowed",
        }}
        title="Redo"
        onClick={canRedo ? onRedo : null}
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
        @keyframes fadeSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-15px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        button:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.2) !important;
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
  border: "1px solid rgba(255,255,255,0.3)",
  padding: "8px 12px",
  borderRadius: "8px",
  fontSize: "14px",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: 500,
  backdropFilter: "blur(8px)",
  color: "#fff",
  transition: "all 0.2s ease",
};

export default FloatingButtons;
