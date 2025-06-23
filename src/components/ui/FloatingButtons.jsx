import React from "react";
import {
  FiCircle,
  FiTrendingUp,
  FiMap,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiSave,
} from "react-icons/fi";

const tools = [
  { name: "point", label: "Point", icon: <FiCircle /> },
  { name: "line", label: "Line", icon: <FiTrendingUp /> },
  { name: "area", label: "Area", icon: <FiMap /> },
];

const FloatingButtons = ({
  activeTool,
  setActiveTool,
  onUploadCSV,
  onUndo,
  onRedo,
  onSave,
}) => {
  const handleToggle = (toolName) => {
    setActiveTool((prev) => (prev === toolName ? null : toolName));
  };

  const baseStyle = {
    background: "rgba(255, 255, 255, 0.25)",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s",
    fontWeight: 500,
    backdropFilter: "blur(4px)",
  };

  const getButtonStyle = (isActive) => ({
    ...baseStyle,
    color: isActive ? "#fff" : "#333",
    background: isActive ? "rgba(0, 123, 255, 0.9)" : baseStyle.background,
    border: isActive ? "none" : baseStyle.border,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(255, 255, 255, 0.2)",
        padding: "10px 14px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        display: "flex",
        gap: "10px",
        zIndex: 1002,
        backdropFilter: "blur(6px)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      {tools.map((tool) => (
        <button
          key={tool.name}
          style={getButtonStyle(activeTool === tool.name)}
          onClick={() => handleToggle(tool.name)}
          title={`Draw ${tool.label}`}
        >
          {tool.icon}
          {tool.label}
        </button>
      ))}

      <div style={{ width: 1, background: "rgba(0,0,0,0.15)" }} />

      <button style={baseStyle} title="Upload CSV" onClick={onUploadCSV}>
        <FiUpload />
        Upload CSV
      </button>
      <button style={baseStyle} title="Undo" onClick={onUndo}>
        <FiRotateCcw />
        Undo
      </button>
      <button style={baseStyle} title="Redo" onClick={onRedo}>
        <FiRotateCw />
        Redo
      </button>
      <button
        style={{
          ...baseStyle,
          background: "#007bff",
          color: "#fff",
          border: "none",
          fontWeight: 600,
        }}
        title="Save"
        onClick={onSave}
      >
        <FiSave />
        Save
      </button>
    </div>
  );
};

export default FloatingButtons;
