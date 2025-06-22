import React from "react";
import DistrictSelector from "../components/ui/DistrictSelector";

const SidebarPanel = ({ districts, handleDistrictToggle }) => {
  return (
    <div
      style={{
        width: 280,
        backgroundColor: "#fff",
        boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        zIndex: 1000,
        position: "relative",
      }}
    >
      <DistrictSelector
        districts={districts}
        handleDistrictToggle={handleDistrictToggle}
      />
    </div>
  );
};

export default SidebarPanel;
