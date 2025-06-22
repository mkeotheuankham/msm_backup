import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Mitsamay Mapping</h1>
      <div className="header-actions">
        <button className="header-btn">Edit Setting</button>
        <button className="header-btn">Map Data</button>
        <button className="header-btn">Style Options</button>
        <button className="header-btn">Map Features</button>
        <button className="header-btn">Preferences</button>
      </div>
      {/* <div className="header-search">
        <input
          type="text"
          placeholder="Search features..."
          className="search-input"
        />
        <button className="search-btn">Search</button>
      </div> */}
    </header>
  );
};

export default Header;
