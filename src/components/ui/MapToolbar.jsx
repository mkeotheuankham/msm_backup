import React from "react";

const MapToolbar = () => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 280,
        right: 0,
        height: 48,
        backgroundColor: "white",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 16px",
        zIndex: 1002,
      }}
    >
      <div>
        <button>History</button>
        <button>Export</button>
        <button>GPS Traces</button>
      </div>
      <div>
        <button>Undo</button>
        <button>Redo</button>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: 4,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default MapToolbar;
