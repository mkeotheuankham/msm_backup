import React from "react";
import {
  FiMap,
  FiEdit2,
  FiUpload,
  FiRotateCcw,
  FiRotateCw,
  FiSave,
  FiGlobe,
  FiScissors,
  FiLayers,
  FiZoomIn,
  FiZoomOut,
  FiInfo,
  FiTrash2,
} from "react-icons/fi";
import { FaRuler, FaRulerCombined } from "react-icons/fa";
import { MdOutlineAreaChart } from "react-icons/md";

const FloatingButtons = ({
  onUploadCSV,
  onUndo,
  onRedo,
  onSave,
  setActiveTool,
  canUndo,
  canRedo,
  activeTool,
  onEdit,
  onDelete,
  onCut,
  onMeasure,
  onMeasureArea,
  onShowInfo,
  onZoomIn,
  onZoomOut,
  language,
  setLanguage,
}) => {
  const t = (en, la) => (language === "en" ? en : la);

  // ປຸ່ມເຄື່ອງມືຕົ້ນຕໍ
  const mainTools = [
    {
      name: "select",
      icon: <FiLayers />,
      label: t("Select", "ເລືອກ"),
      action: () => setActiveTool("select"),
    },
    {
      name: "edit",
      icon: <FiEdit2 />,
      label: t("Edit", "ແກ້ໄຂ"),
      action: onEdit,
    },
    {
      name: "delete",
      icon: <FiTrash2 />,
      label: t("Delete", "ລຶບ"),
      action: onDelete,
    },
    {
      name: "cut",
      icon: <FiScissors />,
      label: t("Cut", "ຕັດ"),
      action: onCut,
    },
    {
      name: "measure",
      icon: <FaRuler />,
      label: t("Measure", "ວັດແທກ"),
      action: onMeasure,
    },
    {
      name: "measureArea",
      icon: <MdOutlineAreaChart />,
      label: t("Measure Area", "ວັດແທກພື້ນທີ່"),
      action: onMeasureArea,
    },
    {
      name: "info",
      icon: <FiInfo />,
      label: t("Info", "ຂໍ້ມູນ"),
      action: onShowInfo,
    },
  ];

  // ປຸ່ມການແຕ້ມ
  const drawTools = [
    {
      name: "polygon",
      icon: <FiMap style={{ transform: "rotate(45deg)" }} />,
      label: t("Polygon", "ພື້ນທີ່"),
      action: () => setActiveTool("polygon"),
    },
    {
      name: "polyline",
      icon: <FiEdit2 />,
      label: t("Line", "ເສັ້ນ"),
      action: () => setActiveTool("polyline"),
    },
    {
      name: "marker",
      icon: <FaRulerCombined size={14} />,
      label: t("Point", "ຈຸດ"),
      action: () => setActiveTool("marker"),
    },
    {
      name: "rectangle",
      icon: <FiMap />,
      label: t("Rectangle", "ຮູບສີ່ແຈ"),
      action: () => setActiveTool("rectangle"),
    },
    {
      name: "circle",
      icon: <FiMap />,
      label: t("Circle", "ວົງມົນ"),
      action: () => setActiveTool("circle"),
    },
  ];

  return (
    <div className="vertical-toolbar">
      {/* ປຸ່ມ Upload CSV */}
      <button
        className={`tool-button ${activeTool === "upload" ? "active" : ""}`}
        onClick={onUploadCSV}
        title={t("Upload CSV", "ເພີ່ມ CSV")}
      >
        <FiUpload />
        <span className="button-label">{t("Upload", "ເພີ່ມ")}</span>
      </button>

      {/* ປຸ່ມການແຕ້ມ */}
      <div className="tool-section">
        <h4 className="section-title">{t("Draw Tools", "ເຄື່ອງມືການແຕ້ມ")}</h4>
        {drawTools.map((tool) => (
          <button
            key={tool.name}
            className={`tool-button ${
              activeTool === tool.name ? "active" : ""
            }`}
            onClick={tool.action}
            title={tool.label}
          >
            {tool.icon}
            <span className="button-label">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* ປຸ່ມເຄື່ອງມືຕົ້ນຕໍ */}
      <div className="tool-section">
        <h4 className="section-title">{t("Main Tools", "ເຄື່ອງມືຫຼັກ")}</h4>
        {mainTools.map((tool) => (
          <button
            key={tool.name}
            className={`tool-button ${
              activeTool === tool.name ? "active" : ""
            }`}
            onClick={tool.action}
            title={tool.label}
          >
            {tool.icon}
            <span className="button-label">{tool.label}</span>
          </button>
        ))}
      </div>

      {/* ປຸ່ມ Zoom */}
      <div className="tool-section">
        <h4 className="section-title">{t("Zoom", "ຂະຫຍາຍ/ຍ້ອນ")}</h4>
        <div className="zoom-controls">
          <button onClick={onZoomIn} title={t("Zoom In", "ຂະຫຍາຍ")}>
            <FiZoomIn />
            <span className="button-label">{t("Zoom In", "ຂະຫຍາຍ")}</span>
          </button>
          <button onClick={onZoomOut} title={t("Zoom Out", "ຍ້ອນອອກ")}>
            <FiZoomOut />
            <span className="button-label">{t("Zoom Out", "ຍ້ອນອອກ")}</span>
          </button>
        </div>
      </div>

      {/* ປຸ່ມ Undo/Redo/Save */}
      <div className="tool-section">
        <h4 className="section-title">{t("Actions", "ການກະທຳ")}</h4>
        <button
          className={`tool-button ${!canUndo ? "disabled" : ""}`}
          onClick={canUndo ? onUndo : null}
          title={t("Undo", "ກັບຄືນ")}
        >
          <FiRotateCcw />
          <span className="button-label">{t("Undo", "ກັບຄືນ")}</span>
        </button>
        <button
          className={`tool-button ${!canRedo ? "disabled" : ""}`}
          onClick={canRedo ? onRedo : null}
          title={t("Redo", "ທຳຊ້ຳ")}
        >
          <FiRotateCw />
          <span className="button-label">{t("Redo", "ທຳຊ້ຳ")}</span>
        </button>
        <button
          className="tool-button save-button"
          onClick={onSave}
          title={t("Save", "ບັນທຶກ")}
        >
          <FiSave />
          <span className="button-label">{t("Save", "ບັນທຶກ")}</span>
        </button>
      </div>

      {/* ປຸ່ມປ່ຽນພາສາ */}
      <button
        className="tool-button language-button"
        onClick={() => setLanguage(language === "en" ? "la" : "en")}
        title={t("Toggle Language", "ປ່ຽນພາສາ")}
      >
        <FiGlobe />
        <span className="button-label">
          {language === "en" ? "ພາສາລາວ" : "English"}
        </span>
      </button>

      <style jsx>{`
        .vertical-toolbar {
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.8);
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 1000;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          max-height: 90vh;
          overflow-y: auto;
        }

        .tool-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
        }

        .section-title {
          color: rgba(255, 255, 255, 0.7);
          font-size: 12px;
          margin: 4px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .tool-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px 12px;
          border-radius: 6px;
          color: white;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }

        .tool-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .tool-button.active {
          background: rgba(0, 123, 255, 0.8);
          border-color: rgba(0, 123, 255, 0.9);
        }

        .tool-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .save-button {
          background: rgba(0, 123, 255, 0.8);
          border-color: rgba(0, 123, 255, 0.9);
        }

        .language-button {
          margin-top: 8px;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
        }

        .zoom-controls {
          display: flex;
          gap: 8px;
        }

        .zoom-controls button {
          flex: 1;
        }

        .button-label {
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .vertical-toolbar {
            top: auto;
            bottom: 10px;
            left: 10px;
            transform: none;
            flex-direction: row;
            max-height: none;
            max-width: 90vw;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 8px;
          }

          .tool-section {
            flex-direction: row;
            border-bottom: none;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 0;
            padding-right: 12px;
            margin-right: 12px;
          }

          .section-title {
            display: none;
          }

          .tool-button {
            min-width: 40px;
            justify-content: center;
            padding: 8px;
          }

          .button-label {
            display: none;
          }

          .zoom-controls {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingButtons;
