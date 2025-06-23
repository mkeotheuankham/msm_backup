import React, { useState, useCallback, useRef, useEffect } from "react";
import { MapContainer, ZoomControl } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import { saveAs } from "file-saver";
import DistrictSelector from "../components/ui/DistrictSelector";
import LoadingBar from "../components/ui/LoadingBar";
import FloatingButtons from "../components/ui/FloatingButtons";
import ParcelLayer from "../components/map/ParcelLayer";
import BasemapSelector from "../components/map/BasemapSelector";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-measure";
import "leaflet.polylinemeasure";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure.css";

// Fix default marker icons
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
  const mapRef = useRef(null);
  const drawnItemsRef = useRef(new L.FeatureGroup());
  const redoStack = useRef([]);
  const undoStack = useRef([]);
  const [activeDrawType, setActiveDrawType] = useState(null);
  const [drawer, setDrawer] = useState(null);

  // Update map bounds based on loaded parcels
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

  // Get style for parcels based on district
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

  // Create popup content for parcels
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

  // Handle feature interaction
  const onEachFeature = useCallback(
    (feature, layer) => {
      if (feature.properties) {
        layer.bindPopup(createPopupContent(feature.properties));
      }
    },
    [createPopupContent]
  );

  // Fetch district data
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

  // Toggle district selection
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

  // Cancel request on unmount
  useEffect(() => {
    return () => {
      if (cancelRequest.current) {
        cancelRequest.current("Component unmounted");
      }
    };
  }, []);

  // Drawing functions
  const handleUndo = () => {
    const layers = drawnItemsRef.current.getLayers();
    if (layers.length > 0) {
      const lastLayer = layers[layers.length - 1];
      drawnItemsRef.current.removeLayer(lastLayer);
      redoStack.current.push(lastLayer);
      undoStack.current = undoStack.current.slice(0, -1);
    }
  };

  const handleRedo = () => {
    const layer = redoStack.current.pop();
    if (layer) {
      drawnItemsRef.current.addLayer(layer);
      undoStack.current.push(layer);
    }
  };

  const handleSave = () => {
    const geojson = drawnItemsRef.current.toGeoJSON();
    if (geojson.features.length === 0) {
      alert("No drawings to save");
      return;
    }
    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, "drawn_layers.geojson");
  };

  const handleUploadCSV = () => {
    alert("Upload CSV function will be implemented later");
  };

  // ໃນ useEffect ສຳລັບການແຕ້ມ
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    // ເພີ່ມ drawn items ເຂົ້າໃນ map
    map.addLayer(drawnItemsRef.current);

    // ສ້າງ draw control
    const drawControl = new L.Control.Draw({
      position: "topright",
      draw: {
        polygon: {
          shapeOptions: {
            color: "#3388ff",
            fillColor: "#3388ff",
            fillOpacity: 0.5,
            weight: 3,
          },
          allowIntersection: false,
          showArea: true,
        },
        polyline: {
          shapeOptions: {
            color: "#ff5733",
            weight: 4,
          },
        },
        marker: {
          icon: new L.Icon.Default(),
        },
        circle: false,
        rectangle: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItemsRef.current,
        remove: true,
      },
    });

    map.addControl(drawControl);

    // ຈັດການເມື່ອສ້າງ layer ໃໝ່
    const handleCreate = (e) => {
      const layer = e.layer;
      drawnItemsRef.current.addLayer(layer);
      undoStack.current.push(layer);
      redoStack.current = [];
      setActiveDrawType(null); // ລະບົບສະຖານະເມື່ອແຕ້ມແລ້ວ
    };

    map.on(L.Draw.Event.CREATED, handleCreate);

    return () => {
      map.removeControl(drawControl);
      map.off(L.Draw.Event.CREATED, handleCreate);
    };
  }, []);

  // ໃນ useEffect ສຳລັບ activeDrawType
  useEffect(() => {
    if (!mapRef.current || !activeDrawType) return;
    const map = mapRef.current;

    let drawingTool = null;

    switch (activeDrawType) {
      case "polygon":
        drawingTool = new L.Draw.Polygon(map, {
          shapeOptions: {
            color: "#3388ff",
            fillColor: "#3388ff",
            fillOpacity: 0.5,
            weight: 3,
          },
        });
        break;
      case "polyline":
        drawingTool = new L.Draw.Polyline(map, {
          shapeOptions: {
            color: "#ff5733",
            weight: 4,
          },
        });
        break;
      case "marker":
        drawingTool = new L.Draw.Marker(map);
        break;
      default:
        return;
    }

    if (drawingTool) {
      drawingTool.enable();
    }

    return () => {
      if (drawingTool) {
        drawingTool.disable();
      }
    };
  }, [activeDrawType]);

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      <LoadingBar isLoading={isLoading} loadingProgress={loadingProgress} />
      <FloatingButtons
        activeTool={activeDrawType}
        setActiveTool={setActiveDrawType}
        onUploadCSV={handleUploadCSV}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={handleSave}
        setActiveDrawType={setActiveDrawType}
        canUndo={undoStack.current.length > 0}
        canRedo={redoStack.current.length > 0}
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
      </MapContainer>
      <DistrictSelector
        districts={districts}
        handleDistrictToggle={handleDistrictToggle}
      />
    </div>
  );
};

export default MapPage;
