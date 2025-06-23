import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import GeomanControl from "../components/map/GeomanControl";
import DistrictSelector from "../components/ui/DistrictSelector";
import LoadingBar from "../components/ui/LoadingBar";
import FloatingButtons from "../components/ui/FloatingButtons";
import ParcelLayer from "../components/map/ParcelLayer";
import BasemapSelector from "../components/map/BasemapSelector";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-measure";
import "leaflet.polylinemeasure";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure.css";

// ຕັ້ງຄ່າໄອຄອນ Marker ເລີ່ມຕົ້ນ
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapPage = () => {
  const [districts, setDistricts] = useState([
    {
      name: "chanthabury",
      displayName: "ຈັນທະບູລີ",
      endpoint: "https://msmapi.up.railway.app/api/rest/chanthabury",
      dataKey: "cadastre_parcel_details_0101",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#3388ff",
      hasLoaded: false,
    },
    {
      name: "sikodtabong",
      displayName: "ສີໂຄດຕະບອງ",
      endpoint: "https://msmapi.up.railway.app/api/rest/sikodtabong",
      dataKey: "cadastre_parcel_details_0102",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#ff5733",
      hasLoaded: false,
    },
    {
      name: "xaisettha",
      displayName: "ໄຊເສດຖາ",
      endpoint: "https://msmapi.up.railway.app/api/rest/xaisettha",
      dataKey: "cadastre_parcel_details_0103",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#33ff57",
      hasLoaded: false,
    },
    {
      name: "sisattanak",
      displayName: "ສີສັດຕະນາກ",
      endpoint: "https://msmapi.up.railway.app/api/rest/sisattanak",
      dataKey: "cadastre_parcel_details_0104",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#5733ff",
      hasLoaded: false,
    },
    {
      name: "naxaithong",
      displayName: "ນາຊາຍທອງ",
      endpoint: "https://msmapi.up.railway.app/api/rest/naxaithong",
      dataKey: "cadastre_parcel_details_0105",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#ff33f5",
      hasLoaded: false,
    },
    {
      name: "xaithany",
      displayName: "ໄຊທານີ",
      endpoint: "https://msmapi.up.railway.app/api/rest/xaithany",
      dataKey: "cadastre_parcel_details_0106",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#33fff5",
      hasLoaded: false,
    },
    {
      name: "hadxaifong",
      displayName: "ຫາດຊາຍຟອງ",
      endpoint: "https://msmapi.up.railway.app/api/rest/hadxaifong",
      dataKey: "cadastre_parcel_details_0107",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#f5ff33",
      hasLoaded: false,
    },
    {
      name: "xangthong",
      displayName: "ສັງທອງ",
      endpoint: "https://msmapi.up.railway.app/api/rest/xangthong",
      dataKey: "cadastre_parcel_details_0108",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#ff8c33",
      hasLoaded: false,
    },
    {
      name: "pakngum",
      displayName: "ປາກງື່ມ",
      endpoint: "https://msmapi.up.railway.app/api/rest/pakngum",
      dataKey: "cadastre_parcel_details_0109",
      checked: false,
      parcels: [],
      loading: false,
      error: null,
      color: "#8c33ff",
      hasLoaded: false,
    },
  ]);

  const [bounds, setBounds] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const cancelRequest = useRef(null);

  // ອັບເດດຂອບເຂດຂອງແຜນທີ່
  const updateBounds = useCallback(() => {
    const allParcels = districts
      .flatMap((d) => (d.checked && d.parcels ? d.parcels : []))
      .filter(Boolean);

    if (allParcels.length > 0) {
      const coords = allParcels
        .flatMap(
          (parcel) =>
            parcel.geom?.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) || []
        )
        .filter((coords) => coords.length > 0);

      if (coords.length > 0) {
        setBounds(L.latLngBounds(coords));
      }
    }
  }, [districts]);

  // ຮູບແບບຂອງດິນ
  const getParcelStyle = useCallback(
    (districtName) => {
      const district = districts.find((d) => d.name === districtName);
      return district
        ? {
            fillColor: district.color,
            weight: 1,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.7,
          }
        : {};
    },
    [districts]
  );

  // ສ້າງເນື້ອຫາ Popup
  const createPopupContent = useCallback(
    (properties) => {
      const {
        owners,
        parcelno,
        area,
        landusetype,
        road,
        parcel_village,
        districtName,
      } = properties;
      const districtColor =
        districts.find((d) => d.displayName === districtName)?.color ||
        "#3388ff";

      return `
      <div style="
        min-width: 250px;
        background-color: rgba(0, 0, 0, 0.25);
        border-radius: 8px;
        padding: 12px;
        backdrop-filter: blur(20px);
        box-shadow: 0 2px 15px rgba(0,0,0,0.3);
        font-family: 'Noto Sans Lao', sans-serif;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.1);
      ">
        <h4 style="
          margin-top: 0; 
          margin-bottom: 10px; 
          color: ${districtColor};
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          font-weight: 600;
        ">
          ${districtName || "ບໍ່ມີຂໍ້ມູນ"}
        </h4>
        <div style="
          border-top: 1px solid rgba(255,255,255,0.1); 
          padding-top: 8px;
        ">
          <p style="margin: 6px 0; font-size: 14px;"><b>ເຈົ້າຂອງ:</b> ${
            owners || "ບໍ່ມີຂໍ້ມູນ"
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><b>ເລກທີ່ດິນ:</b> ${
            parcelno || "ບໍ່ມີຂໍ້ມູນ"
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><b>ເນື້ອທີ່:</b> ${
            area ? `${area} m²` : "ບໍ່ມີຂໍ້ມູນ"
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><b>ປະເພດການນຳໃຊ້:</b> ${
            landusetype || "ບໍ່ມີຂໍ້ມູນ"
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><b>ຖະໜົນ:</b> ${
            road || "ບໍ່ມີຂໍ້ມູນ"
          }</p>
          <p style="margin: 6px 0; font-size: 14px;"><b>ບ້ານ:</b> ${
            parcel_village || "ບໍ່ມີຂໍ້ມູນ"
          }</p>
        </div>
      </div>
    `;
    },
    [districts]
  );

  // ຈັດການກັບແຕ່ລະລັກສະນະຂອງດິນ
  const onEachFeature = useCallback(
    (feature, layer) => {
      if (feature.properties) {
        layer.bindPopup(createPopupContent(feature.properties));
      }
    },
    [createPopupContent]
  );

  // ດຶງຂໍ້ມູນເມືອງ
  const fetchDistrictData = useCallback(
    async (districtName) => {
      const districtIndex = districts.findIndex((d) => d.name === districtName);
      if (districtIndex === -1) return;

      try {
        setIsLoading(true);
        setLoadingProgress(10);

        setDistricts((prev) =>
          prev.map((d, i) =>
            i === districtIndex ? { ...d, loading: true, error: null } : d
          )
        );

        const district = districts[districtIndex];
        const response = await axios.get(district.endpoint, {
          cancelToken: new axios.CancelToken(
            (c) => (cancelRequest.current = c)
          ),
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 90) / (progressEvent.total || 100)
            );
            setLoadingProgress(10 + percentCompleted);
          },
        });

        if (response.data?.[district.dataKey]) {
          setLoadingProgress(95);
          const validParcels = response.data[district.dataKey].filter(
            (parcel) => parcel?.geom?.type === "Polygon"
          );

          setDistricts((prev) =>
            prev.map((d, i) =>
              i === districtIndex
                ? {
                    ...d,
                    parcels: validParcels,
                    loading: false,
                    hasLoaded: true,
                  }
                : d
            )
          );
          updateBounds();
        }
      } catch (err) {
        if (!axios.isCancel(err)) {
          setDistricts((prev) =>
            prev.map((d, i) =>
              i === districtIndex
                ? { ...d, loading: false, error: err.message }
                : d
            )
          );
        }
      } finally {
        setLoadingProgress(100);
        setTimeout(() => {
          setLoadingProgress(0);
          setIsLoading(false);
        }, 500);
      }
    },
    [districts, updateBounds]
  );

  // ສະຫຼັບການເລືອກເມືອງ
  const handleDistrictToggle = useCallback(
    (districtName) => {
      setDistricts((prev) => {
        const updated = prev.map((d) =>
          d.name === districtName ? { ...d, checked: !d.checked } : d
        );

        const district = updated.find((d) => d.name === districtName);
        if (district.checked && !district.hasLoaded) {
          fetchDistrictData(districtName);
        } else {
          updateBounds();
        }
        return updated;
      });
    },
    [fetchDistrictData, updateBounds]
  );

  // ຍົກເລີກຄຳຂໍ້ມູນເມື່ອຄອມໂພເນັນຖືກລົບ
  useEffect(() => {
    return () => {
      if (cancelRequest.current) {
        cancelRequest.current("ຍົກເລີກຄຳຂໍ້ມູນເນື່ອງຈາກຄອມໂພເນັນຖືກລົບ");
      }
    };
  }, []);

  // สร้าง state เก็บ layer ที่วาด
  const [drawnLayers, setDrawnLayers] = useState([]);
  const [activeTool, setActiveTool] = useState(null);

  // ฟังก์ชันจัดการ event create ของ Geoman
  const handleCreate = (e) => {
    const layer = e.layer;

    setDrawnLayers((prev) => [...prev, layer]);
    console.log("Created layer:", layer);
  };

  // ฟังก์ชัน Undo (ลบ layer ล่าสุด)
  const handleUndo = () => {
    setDrawnLayers((prev) => {
      if (prev.length === 0) return prev;
      const newLayers = prev.slice(0, prev.length - 1);
      return newLayers;
    });
  };

  // ฟังก์ชัน Redo (ถ้ามีประวัติไว้เก็บไว้ ต้องทำเพิ่มเอง)
  const handleRedo = () => {
    // สำหรับตัวอย่างนี้ยังไม่ทำ
    alert("Redo ยังไม่พร้อมใช้งาน");
  };

  // ฟังก์ชัน Save
  const handleSave = () => {
    const geojsons = drawnLayers.map((layer) => layer.toGeoJSON());
    console.log("Saved GeoJSON:", geojsons);
    alert("บันทึกข้อมูลลง console แล้ว");
  };

  const handleUploadCSV = () => {
    alert("Upload CSV ยังไม่พร้อมใช้งาน");
  };

  const handleEdit = (e) => {
    console.log("Edited layers:", e.layers);
    alert("แก้ไขรูปทรงแล้ว");
  };

  const handleDelete = (e) => {
    console.log("Deleted layers:", e.layers);
    alert("ลบรูปทรงแล้ว");
  };

  // เมื่อ drawnLayers เปลี่ยน ต้องอัพเดต map
  // ใช้ useEffect เพื่อเพิ่ม/ลบ layers บน map
  const mapRef = useRef(null);

  // ... (imports และโค้ดอื่น ๆ คงเดิม)

  // useEffect เพิ่ม Layer ที่วาดใหม่
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    map.eachLayer((layer) => {
      if (
        layer?.pm?.enabled ||
        drawnLayers.find((l) => l._leaflet_id === layer._leaflet_id) ===
          undefined
      ) {
        // do nothing เพราะอาจเป็น basemap หรืออื่น ๆ
      }
    });

    drawnLayers.forEach((layer) => {
      if (!map.hasLayer(layer)) {
        layer.addTo(map);
      }
    });
  }, [drawnLayers]);

  // ✅ useEffect สำหรับ Measure Tool
  useEffect(() => {
    if (!mapRef.current || activeTool !== "measure") return;

    const map = mapRef.current;

    const control = L.control.polylineMeasure({
      position: "topleft",
      unit: "metres",
      showBearings: false,
      clearMeasurementsOnStop: false,
      showUnitControl: true,
      tempLine: {
        color: "#00f",
        weight: 2,
      },
      fixedLine: {
        color: "#006",
        weight: 2,
      },
      startCircle: {
        color: "#000",
        weight: 1,
      },
      endCircle: {
        color: "#000",
        weight: 1,
      },
    });

    map.addControl(control);
    control._startMeasuring();

    return () => {
      map.removeControl(control);
    };
  }, [activeTool]);

  // ✅ เพิ่ม useEffect สำหรับ Text Tool
  useEffect(() => {
    if (!mapRef.current || activeTool !== "text") return;

    const map = mapRef.current;

    const handleClick = (e) => {
      const text = prompt("Enter text:");
      if (text) {
        const marker = L.marker(e.latlng, {
          icon: L.divIcon({
            className: "custom-text-label",
            html: `<div style='color:white; background:rgba(0,0,0,0.6); padding:2px 6px; border-radius:4px; font-size:14px;'>${text}</div>`,
          }),
          interactive: false,
        });
        marker.addTo(map);
      }
    };

    map.on("click", handleClick);

    return () => {
      map.off("click", handleClick);
    };
  }, [activeTool]);

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <LoadingBar isLoading={isLoading} loadingProgress={loadingProgress} />

      <FloatingButtons
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        onUploadCSV={handleUploadCSV}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
      />

      <MapContainer
        center={bounds ? bounds.getCenter() : [17.985375, 103.968534]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
        zoomControl={false}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <BasemapSelector />

        <ZoomControl position="bottomright" />
        <ParcelLayer
          districts={districts}
          getParcelStyle={getParcelStyle}
          onEachFeature={onEachFeature}
        />

        <GeomanControl
          activeTool={activeTool}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </MapContainer>

      <DistrictSelector
        districts={districts}
        handleDistrictToggle={handleDistrictToggle}
      />
    </div>
  );
};

export default MapPage;
