import React, { useEffect, useState, useRef } from "react";
import Papa from "papaparse";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

const PointMarker = React.memo(({ position, data, index, markerRefs }) => {
  const markerRef = useRef();

  useEffect(() => {
    if (markerRef.current && markerRefs) {
      markerRefs.current.push(markerRef.current);
      // ເປີດ Popup ທັນທີເມື່ອ Marker ຖືກສ້າງ
      markerRef.current.openPopup();
    }
  }, [markerRefs]);

  const pointIcon = L.divIcon({
    html: `
      <div style="
        background: ${index % 2 === 0 ? "#e53935" : "#1e88e5"};
        width: 14px;
        height: 14px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 7px;
        text-align: center;
        line-height: 7px;
        border: 1px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
      ">
        ${index + 1}
      </div>
    `,
    className: "",
    iconSize: [10, 10],
    iconAnchor: [8.5, 8.5],
  });

  return (
    <Marker position={position} icon={pointIcon} ref={markerRef}>
      <Popup>
        <div style={{ minWidth: "50px" }}>
          <div style={{ marginBottom: "5px" }}>
            <strong>ຕຳແໜ່ງ:</strong>
            <div>Latitude: {parseFloat(data.Latitude).toFixed(4)}</div>
            <div>Longitude: {parseFloat(data.Longitude).toFixed(4)}</div>
          </div>
          {data.Code && (
            <div style={{ marginBottom: "5px" }}>
              <strong>ລະຫັດ:</strong> {data.Code}
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
});

const CSVFileLocal = () => {
  const [data, setData] = useState(null);
  const markerRefs = useRef([]);

  useEffect(() => {
    fetchCSVData();
  }, []);

  const fetchCSVData = async () => {
    try {
      const file = process.env.PUBLIC_URL + "/assets/point.csv";
      const response = await fetch(file);
      const text = await response.text();
      const result = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      const filteredData = result.data.filter(
        (item) => item.Latitude && item.Longitude
      );
      setData(filteredData);
    } catch (error) {
      console.error("Error loading CSV data:", error);
    }
  };

  // ຟັງຊັນເປີດ Popup ທັງໝົດ
  const openAllPopups = () => {
    markerRefs.current.forEach((marker) => {
      if (marker && marker.openPopup) {
        marker.openPopup();
      }
    });
  };

  // ເປີດ Popup ທັງໝົດເມື່ອ data ມາ
  useEffect(() => {
    if (data && data.length > 0) {
      openAllPopups();
    }
  }, [data]);

  return data
    ? data.map((item, index) => (
        <PointMarker
          key={index}
          position={[item.Latitude, item.Longitude]}
          data={item}
          index={index}
          markerRefs={markerRefs}
        />
      ))
    : null;
};

export default CSVFileLocal;
