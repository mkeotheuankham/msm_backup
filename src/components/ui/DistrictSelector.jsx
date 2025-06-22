import React, { useState } from "react";

const DistrictSelector = ({ districts, handleDistrictToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarStyle = {
    position: "fixed",
    right: isOpen ? "0" : "-250px", // ขวาเหมือนเดิม
    top: "20px",
    width: "250px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    transition: "right 0.3s ease",
    zIndex: 1000,
    padding: "15px",
    borderRadius: "5px 0 0 5px",
    boxShadow: "-2px 0 10px rgba(0,0,0,0.5)",
    maxHeight: "90vh",
    overflowY: "auto",
    fontFamily: "Phetsarath OT, sans-serif",
  };

  const toggleButtonContainerStyle = {
    position: "fixed",
    right: isOpen ? "250px" : "0",
    top: "30px",
    zIndex: 999,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "right 0.3s ease",
  };

  const toggleButtonStyle = {
    width: "40px",
    height: "40px",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    border: "none",
    borderRadius: "5px 0 0 5px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    marginBottom: "6px",
  };

  const verticalLabelStyle = {
    writingMode: "vertical-rl",
    transform: "rotate(180deg)",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    color: "white",
    padding: "5px 2px",
    borderRadius: "5px 0 0 5px",
    fontSize: "18px",
    textAlign: "center",
  };

  return (
    <>
      {/* ปุ่ม toggle + ป้าย label แนวตั้ง */}
      <div style={toggleButtonContainerStyle}>
        <button style={toggleButtonStyle} onClick={toggleSidebar}>
          {isOpen ? "×" : "≡"}
        </button>
        <div style={verticalLabelStyle}>ແຜນທີ່ຕອນດິນ</div>
      </div>

      {/* Sidebar ด้านขวา */}
      <div style={sidebarStyle}>
        <h3 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>ເລືອກເມືອງ</h3>
        {districts.map((d) => (
          <div key={d.name} style={{ margin: "6px 0" }}>
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
                  fontWeight: "bold",
                  fontSize: "15px",
                }}
              >
                {d.displayName}
              </span>
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default DistrictSelector;
