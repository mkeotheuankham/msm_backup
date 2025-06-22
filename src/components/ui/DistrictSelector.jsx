import React from "react";

const DistrictSelector = ({ districts, handleDistrictToggle }) => {
  const controlPanelStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: "15px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    zIndex: 1000,
    maxHeight: "80vh",
    overflowY: "auto",
    backdropFilter: "blur(15px)",
    border: "1px solid rgba(255,255,255,0.15)",
    minWidth: "250px",
    color: "#fff",
  };

  return (
    <div style={controlPanelStyle}>
      <h3
        style={{
          margin: "0 0 15px 0",
          color: "#fff",
          textShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }}
      >
        ເລືອກເມືອງ
      </h3>
      {districts.map((d) => (
        <div key={d.name} style={{ margin: "8px 0" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={d.checked}
              onChange={() => handleDistrictToggle(d.name)}
              disabled={d.loading}
              style={{
                marginRight: "10px",
                width: "16px",
                height: "16px",
                cursor: "pointer",
                accentColor: d.color,
              }}
            />
            <span
              style={{
                color: d.color,
                fontWeight: "600",
                fontSize: "14px",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
              }}
            >
              {d.displayName}
              {d.loading && (
                <span style={{ color: "#ddd", fontSize: "12px" }}>
                  {" "}
                  (ກຳລັງໂຫຼດ...)
                </span>
              )}
              {d.error && (
                <span style={{ color: "#ff9999", fontSize: "12px" }}>
                  {" "}
                  (ຜິດພາດ)
                </span>
              )}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

export default DistrictSelector;
