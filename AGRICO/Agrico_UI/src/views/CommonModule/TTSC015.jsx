// 2
import React, { useState, useEffect, useRef, useCallback } from 'react';


// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

// Material Dashboard 2 React components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import alertify from "alertifyjs";
import "../../alertify.css";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import IconButton from "@mui/material/IconButton";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BackupIcon from "@mui/icons-material/Backup";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// Data
import FileSaver from "file-saver";
import MDAlert from "components/MDAlert";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import TabIcon from "@mui/icons-material/Tab";
import Tooltip from "@mui/material/Tooltip";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { GetAuthorization } from "utils";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useDropzone } from "react-dropzone";
import ImageIcon from "@mui/icons-material/Image";
import PanToolIcon from '@mui/icons-material/PanTool';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RefreshIcon from '@mui/icons-material/Refresh'; // For Reset
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // For Add Circle
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'; // For Add Square
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'; // For Delete
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';


// Helper function for accessibility props for tabs
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function ttsc015() {
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState(null);
  const [isRestricted, setRestricted] = React.useState(false);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [TdcList, setTdcList] = useState([]);
  const [selectedTdc, setSelectedTdc] = React.useState("");

  const [spec, setSpec] = useState([]);
  const [selectedspec, setselectedspec] = React.useState("");

  const [selectedGradeData, setselectedGradeData] = useState([]);
  const [selectedGradeTable, setselectedGradeTable] = useState(null);

  // New states for Status, Batch ID, and Size & Grade
  const [statusOptions, setStatusOptions] = useState([]); // Renamed to avoid conflict with `status` for API calls
  const [selectedstatus, setselectedstatus] = React.useState(null);

  const [batchIdOptions, setBatchIdOptions] = useState([]); // Renamed from `batchId`
  const [selectedbatchId, setselectedbatchId] = React.useState(null);

  const [size, setSize] = useState("");
  const [matnr, setmatnr] = useState("");
  const [matnrdesc, setmatnrdesc] = useState("");
  const [qty, setQty] = useState("");

  // New states for Tube Counting feature
  const [uploadedFile, setUploadedFile] = useState(null);
  const [returnimage, setreturnimage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  // const [confidence, setConfidence] = useState(0.60); // Default from image
  const [batchId, setBatchId] = useState(""); // This is for the image counting batch ID, distinct from selectedbatchId
  const [selectedDate, setSelectedDate] = useState(new Date()); // Default to today
  const [selectedShift, setSelectedShift] = useState({
    label: "A",
    value: "A",
  }); // Default from image
  const [countedBy, setCountedBy] = useState(""); // Will be set from userDetails
  const [countingResults, setCountingResults] = useState(null); // To store results from tube counting API
  // For hidden file input
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  /////
  const [aiCrtubeCount, setAiCrtubeCount] = useState(0);
  const [aiSqtubeCount, setAiSqtubeCount] = useState(0);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);

  // New states for image manipulation
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [drawingMode, setDrawingMode] = useState('viewing'); // 'viewing', 'add-circle', 'add-square', 'delete'
  const [drawnShapes, setDrawnShapes] = useState([]); // { id, type: 'circle'|'square', x, y, size, color, isAI: boolean }
  const canvasRef = useRef(null);
  const imageObjRef = useRef(null); // To store the actual Image object for drawing
  const isPanningRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const [selectedShapeIdForDeletion, setSelectedShapeIdForDeletion] = useState(null);
  const fileInputRef = useRef(null); // Ensure fileInputRef is defined here

  // Derived counts: Sum of AI counts and manually added shapes
  const manualCrtubeCount = drawnShapes.filter(shape => shape.type === 'circle').length;
  const manualSqtubeCount = drawnShapes.filter(shape => shape.type === 'square').length;
  const crtubeCount = aiCrtubeCount + manualCrtubeCount;
  const sqtubeCount = aiSqtubeCount + manualSqtubeCount;
  // Mode for encircling / cropping
// Add 'crop-roi' or 'encircle' to drawingMode options
const [roiPath, setRoiPath] = useState([]); // Array of {x, y} points in original image coordinates
const isDrawingRoiRef = useRef(false);
const [croppedFile, setCroppedFile] = useState(null); // The cropped File/Blob to send to API


  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const [previewMeta, setPreviewMeta] = useState({
    BATCHID: "",
    SIZE1: "",
    NO_PCS_SQ: "",
    NO_PCS_CR: "",
    CRTDT: "",
    CRTBY: "",
    PLANT: "",
    SHIFT: "",
  });

  // State for tab navigation
  const [tabValue, setTabValue] = React.useState(0); // 0 for Tube Counting, 1 for Report

  // Options for the Shift dropdown
  const shiftOptions = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ];
  const [reportData, setreportData] = React.useState([]);
  const [reportDataTable, setreportDataTable] = useState(null);
  // const [crtubeCount, setcrTubeCount] = useState(0);
  // const [sqtubeCount, setsqTubeCount] = useState(0);
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(15); // default fallback

  // Derived counts from drawnShapes

  // Helper function to determine the current shift based on time
  const determineCurrentShift = () => {
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour >= 6 && currentHour < 14) {
      return { label: "A", value: "A" }; // 6:00 AM to 2:00 PM
    } else if (currentHour >= 14 && currentHour < 22) {
      return { label: "B", value: "B" }; // 2:00 PM to 10:00 PM
    } else {
      return { label: "C", value: "C" }; // 10:00 PM to 6:00 AM (includes 22:00 to 23:59 and 00:00 to 05:59)
    }
  };

  // Helper to convert polygon ROI into a cropped image File
const cropImageFromRoi = (imgObj, points) => {
  if (!points || points.length < 3) return null;

  // 1. Calculate bounding box of the encircled points
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.max(0, Math.min(...xs));
  const maxX = Math.min(imgObj.naturalWidth, Math.max(...xs));
  const minY = Math.max(0, Math.min(...ys));
  const maxY = Math.min(imgObj.naturalHeight, Math.max(...ys));

  const cropWidth = maxX - minX;
  const cropHeight = maxY - minY;

  if (cropWidth <= 10 || cropHeight <= 10) {
    showMessage("Selected region is too small.", "error");
    return null;
  }

  // 2. Offscreen canvas to crop the bounding box
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = cropWidth;
  cropCanvas.height = cropHeight;
  const cropCtx = cropCanvas.getContext("2d");

  // Optional: Apply clipping path if you want an exact polygon mask,
  // or simple bounding box crop (standard for CV models):
  cropCtx.drawImage(
    imgObj,
    minX,
    minY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise((resolve) => {
    cropCanvas.toBlob(
      (blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const file = new File([blob], `cropped_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        const previewUrl = URL.createObjectURL(blob);
        resolve({ file, previewUrl });
      },
      "image/jpeg",
      0.95
    );
  });
};


  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token); // validateUser will now set 'countedBy'
      // Set the initial shift based on current time
      setSelectedShift(determineCurrentShift());
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }
  useEffect(() => {
    fetchData();
    getSpecList();
    fetchMaxFileSize(); // ✅ add this
  }, []);

  // Effect to fetch Status options when selectedPlant changes
  useEffect(() => {
    if (selectedPlant?.value) {
      setLoading(true);
      GetAuthorization()
        .then((token) => {
          getStatusList(selectedPlant.value, token.accessToken);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setStatusOptions([]);
      setselectedstatus(null);
      setBatchIdOptions([]);
      setselectedbatchId(null);
      setSize("");
      setmatnr("");
      setQty("");
    }
  }, [selectedPlant]);

  // Effect to fetch Batch ID options when selectedPlant or selectedstatus changes
  useEffect(() => {
    if (selectedPlant?.value && selectedstatus?.value) {
      setLoading(true);
      GetAuthorization()
        .then((token) => {
          getBatchIDList(
            selectedPlant.value,
            selectedstatus.value,
            tabValue,
            token.accessToken,
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setBatchIdOptions([]);
      setselectedbatchId(null);
      setSize("");
      setmatnr("");
      setQty("");
    }
  }, [selectedPlant, selectedstatus, tabValue]);

  // Effect to fetch Size when selectedPlant or selectedbatchId changes
  useEffect(() => {
    if (selectedPlant?.value && selectedbatchId?.value) {
      setLoading(true);
      GetAuthorization()
        .then((token) => {
          getSizeValue(
            selectedPlant.value,
            selectedbatchId.value,
            token.accessToken,
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setSize("");
      setmatnr("");
      setQty("");
    }
  }, [selectedPlant, selectedbatchId]);

  useEffect(() => {
    if (tabValue === 1) {
      // Only run if the Report tab is active
      // If a plant is selected, fetch data. Otherwise, clear existing data.
      if (selectedPlant?.value) {
        // getData();
      } else {
        // If no plant is selected, clear the report table
        setreportData([]);
        if (reportDataTable) {
          reportDataTable.destroy();
          setreportDataTable(null);
        }
      }
    } else {
      // If not on the report tab, clear the report data to avoid stale data when switching back
      setreportData([]);
      if (reportDataTable) {
        reportDataTable.destroy();
        setreportDataTable(null);
      }
    }
  }, [tabValue, selectedPlant, selectedstatus, selectedbatchId]); // Dependencies: tabValue and report filters

  useEffect(() => {
    console.log("drawnShapes state updated:", drawnShapes);
    console.log("Current crtubeCount:", crtubeCount);
    console.log("Current sqtubeCount:", sqtubeCount);
  }, [drawnShapes, crtubeCount, sqtubeCount]); // Add crtubeCount and sqtubeCount to dependencies for clarity

  // Effect to load image into Image object and draw on canvas

    // Effect to load image into Image object and draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      if (imageObjRef.current) {
        const img = imageObjRef.current;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        // Calculate aspect ratios for 'contain' behavior
        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = naturalWidth / naturalHeight;

        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (imageAspect > canvasAspect) {
          drawWidth = canvas.width * zoomLevel;
          drawHeight = drawWidth / imageAspect;
        } else {
          drawHeight = canvas.height * zoomLevel;
          drawWidth = drawHeight * imageAspect;
        }

        offsetX = (canvas.width - drawWidth) / 2 + panOffset.x;
        offsetY = (canvas.height - drawHeight) / 2 + panOffset.y;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Draw shapes
        drawnShapes.forEach(shape => {
          // ... existing shape drawing logic ...
        });

        // ==========================================
        // 👉 PASTE IT RIGHT HERE (AFTER drawnShapes)
        // ==========================================
        if (roiPath && roiPath.length > 1) {
          const displayedImageScale = drawWidth / naturalWidth;
          const displayedImageOffsetX = offsetX;
          const displayedImageOffsetY = offsetY;

          ctx.strokeStyle = "#00e676"; // Bright green for ROI loop
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();

          const startX = displayedImageOffsetX + roiPath[0].x * displayedImageScale;
          const startY = displayedImageOffsetY + roiPath[0].y * displayedImageScale;
          ctx.moveTo(startX, startY);

          for (let i = 1; i < roiPath.length; i++) {
            const px = displayedImageOffsetX + roiPath[i].x * displayedImageScale;
            const py = displayedImageOffsetY + roiPath[i].y * displayedImageScale;
            ctx.lineTo(px, py);
          }

          ctx.stroke();
          ctx.setLineDash([]); // Reset dash for subsequent drawing operations
        }
      }
    };

    draw(); // Initial draw

    // ... resizeObserver logic ...

  // ==========================================
  // 👉 ALSO ADD `roiPath` TO THIS DEPENDENCY ARRAY:
  // ==========================================
  }, [imagePreviewUrl, zoomLevel, panOffset, drawnShapes, selectedShapeIdForDeletion, roiPath]);


  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const ctx = canvas.getContext('2d');

  //   const draw = () => {
  //     ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

  //     if (imageObjRef.current) {
  //       const img = imageObjRef.current;
  //       const naturalWidth = img.naturalWidth;
  //       const naturalHeight = img.naturalHeight;

  //       // Calculate aspect ratios for 'contain' behavior
  //       const canvasAspect = canvas.width / canvas.height;
  //       const imageAspect = naturalWidth / naturalHeight;

  //       let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

  //       if (imageAspect > canvasAspect) {
  //         // Image is wider than canvas, fit by width
  //         drawWidth = canvas.width * zoomLevel;
  //         drawHeight = drawWidth / imageAspect;
  //       } else {
  //         // Image is taller than canvas, fit by height
  //         drawHeight = canvas.height * zoomLevel;
  //         drawWidth = drawHeight * imageAspect;
  //       }

  //       // Center the image initially, then apply pan offset
  //       offsetX = (canvas.width - drawWidth) / 2 + panOffset.x;
  //       offsetY = (canvas.height - drawHeight) / 2 + panOffset.y;

  //       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

  //       // Draw shapes
  //       drawnShapes.forEach(shape => {
  //         // Convert shape coordinates (which are in original image space) to canvas coordinates
  //         const displayedImageScale = drawWidth / naturalWidth;
  //         const displayedImageOffsetX = offsetX;
  //         const displayedImageOffsetY = offsetY;

  //         const shapeX = displayedImageOffsetX + shape.x * displayedImageScale;
  //         const shapeY = displayedImageOffsetY + shape.y * displayedImageScale;

  //         ctx.strokeStyle = shape.color;
  //         ctx.lineWidth = 2;

  //         if (shape.type === 'circle') {
  //           const radius = shape.size * displayedImageScale;
  //           ctx.beginPath();
  //           ctx.arc(shapeX, shapeY, radius, 0, 2 * Math.PI);
  //           ctx.stroke();
  //         } else if (shape.type === 'square') {
  //           const side = shape.size * displayedImageScale;
  //           ctx.strokeRect(shapeX - side / 2, shapeY - side / 2, side, side); // Center the square
  //         }

  //         // Highlight selected shape for deletion
  //         if (shape.id === selectedShapeIdForDeletion) {
  //           ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow highlight
  //           if (shape.type === 'circle') {
  //             const radius = shape.size * displayedImageScale;
  //             ctx.beginPath();
  //             ctx.arc(shapeX, shapeY, radius, 0, 2 * Math.PI);
  //             ctx.fill();
  //           } else if (shape.type === 'square') {
  //             const side = shape.size * displayedImageScale;
  //             ctx.fillRect(shapeX - side / 2, shapeY - side / 2, side, side);
  //           }
  //         }
  //       });
  //     }
  //   };

  //   draw(); // Initial draw
    
    

  //   // Handle canvas resize to maintain responsiveness
  //   const resizeObserver = new ResizeObserver(() => {
  //     const parent = canvas.parentElement;
  //     if (parent) {
  //       canvas.width = parent.clientWidth;
  //       canvas.height = parent.clientHeight;
  //       draw(); // Redraw on resize
  //     }
  //   });

  //   const parent = canvas.parentElement;
  //   if (parent) {
  //     canvas.width = parent.clientWidth;
  //     canvas.height = parent.clientHeight;
  //     resizeObserver.observe(parent);
  //   }

  //   return () => {
  //     if (parent) {
  //       resizeObserver.unobserve(parent);
  //     }
  //   };
  // }, [imagePreviewUrl, zoomLevel, panOffset, drawnShapes, selectedShapeIdForDeletion]);

  // Effect to load image into Image object and draw on canvas
  useEffect(() => {
    if (imagePreviewUrl) {
      const img = new Image();
      img.onload = () => {
        imageObjRef.current = img;
        // Reset zoom/pan/shapes/AI counts when new image loads
        setZoomLevel(1);
        setPanOffset({ x: 0, y: 0 });
        setDrawnShapes([]); // Clear shapes for new image
        setSelectedShapeIdForDeletion(null);

        // --- NEW/MODIFIED LOGIC FOR CANVAS SIZING ON IMAGE LOAD ---
        const canvas = canvasRef.current;
        if (canvas && img.naturalWidth && img.naturalHeight) {
          const parent = canvas.parentElement;
          if (parent) {
            const parentWidth = parent.clientWidth;
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            canvas.width = parentWidth;
            canvas.height = parentWidth / aspectRatio;
            // Initial draw after setting dimensions
            // No need to call draw() here, as the main drawing useEffect will trigger
            // due to imagePreviewUrl change, which will then use these new dimensions.
          }
        }
      };
      img.src = imagePreviewUrl;
    } else {
      imageObjRef.current = null;
      setDrawnShapes([]);
      setSelectedShapeIdForDeletion(null);
      setAiCrtubeCount(0); // Reset AI counts when no image
      setAiSqtubeCount(0); // Reset AI counts when no image
    }
  }, [imagePreviewUrl]);


  // Effect to draw on canvas and handle resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

      if (imageObjRef.current) {
        const img = imageObjRef.current;
        const naturalWidth = img.naturalWidth;
        const naturalHeight = img.naturalHeight;

        // The canvas's internal dimensions (canvas.width, canvas.height)
        // are now set to match the image's aspect ratio by the image loading useEffect
        // and the ResizeObserver. So, we can draw the image to fill the canvas.
        // The 'contain' logic below will ensure it fits perfectly if canvas dimensions
        // already match image aspect ratio, or handle slight differences.

        const canvasAspect = canvas.width / canvas.height;
        const imageAspect = naturalWidth / naturalHeight;

        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

        if (imageAspect > canvasAspect) {
          drawWidth = canvas.width * zoomLevel;
          drawHeight = drawWidth / imageAspect;
        } else {
          drawHeight = canvas.height * zoomLevel;
          drawWidth = drawHeight * imageAspect;
        }

        offsetX = (canvas.width - drawWidth) / 2 + panOffset.x;
        offsetY = (canvas.height - drawHeight) / 2 + panOffset.y;

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        // Draw shapes
        drawnShapes.forEach(shape => {
          // Convert shape coordinates (which are in original image space) to canvas coordinates
          const displayedImageScale = drawWidth / naturalWidth;
          const displayedImageOffsetX = offsetX;
          const displayedImageOffsetY = offsetY;

          const shapeX = displayedImageOffsetX + shape.x * displayedImageScale;
          const shapeY = displayedImageOffsetY + shape.y * displayedImageScale;

          ctx.strokeStyle = shape.color;
          ctx.lineWidth = 2;

          if (shape.type === 'circle') {
            const radius = shape.size * displayedImageScale;
            ctx.beginPath();
            ctx.arc(shapeX, shapeY, radius, 0, 2 * Math.PI);
            ctx.stroke();
          } else if (shape.type === 'square') {
            const side = shape.size * displayedImageScale;
            ctx.strokeRect(shapeX - side / 2, shapeY - side / 2, side, side); // Center the square
          }

          // Highlight selected shape for deletion
          if (shape.id === selectedShapeIdForDeletion) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.3)'; // Yellow highlight
            if (shape.type === 'circle') {
              const radius = shape.size * displayedImageScale;
              ctx.beginPath();
              ctx.arc(shapeX, shapeY, radius, 0, 2 * Math.PI);
              ctx.fill();
            } else if (shape.type === 'square') {
              const side = shape.size * displayedImageScale;
              ctx.fillRect(shapeX - side / 2, shapeY - side / 2, side, side);
            }
          }
        });

        if (roiPath && roiPath.length > 1) {
          const displayedImageScale = drawWidth / naturalWidth;
          const displayedImageOffsetX = offsetX;
          const displayedImageOffsetY = offsetY;

          ctx.strokeStyle = "#00e676"; // Bright green for ROI loop
          ctx.lineWidth = 2.5;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();

          const startX = displayedImageOffsetX + roiPath[0].x * displayedImageScale;
          const startY = displayedImageOffsetY + roiPath[0].y * displayedImageScale;
          ctx.moveTo(startX, startY);

          for (let i = 1; i < roiPath.length; i++) {
            const px = displayedImageOffsetX + roiPath[i].x * displayedImageScale;
            const py = displayedImageOffsetY + roiPath[i].y * displayedImageScale;
            ctx.lineTo(px, py);
          }

          ctx.stroke();
          ctx.setLineDash([]); // Reset dash for subsequent drawing operations
        }
      }
    };

    draw(); // Initial draw

    // Handle canvas resize to maintain responsiveness
    const resizeObserver = new ResizeObserver(() => {
      const parent = canvas.parentElement;
      if (parent && imageObjRef.current) { // Only resize if an image is loaded
        const img = imageObjRef.current;
        const parentWidth = parent.clientWidth;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        canvas.width = parentWidth;
        canvas.height = parentWidth / aspectRatio;
        draw(); // Redraw on resize
      } else if (parent) {
        // If no image, set canvas to parent's size (e.g., default 300px height if MDBox had it)
        // Or you can set a fixed default size for the canvas when no image is present.
        canvas.width = parent.clientWidth;
        // For height, you might want a default if no image, e.g., 300px or parent.clientHeight
        // Let's use a default height for the canvas when no image is loaded
        canvas.height = 300; // Example default height, adjust as needed
        draw(); // Clear canvas
      }
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    }

    return () => {
      if (parent) {
        resizeObserver.unobserve(parent);
      }
    };
  }, [imagePreviewUrl, zoomLevel, panOffset, drawnShapes, selectedShapeIdForDeletion, roiPath]);



  // Cleanup for object URL
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);


  const getSpecList = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/ttsc015/getSpecList";
      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            items.push({
              value: "ALL",
              label: "ALL",
            });
            response.data.map((row) => {
              // console.log(row)
              var obj = new Object();
              obj.value = row[0];
              obj.label = row[0];
              items.push(obj);
            });

            setSpec(items);
            if (items.length > 0) {
              setselectedspec(items[0]);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  // Function to get Status list
  const getStatusList = (plantValue, accessToken) => {
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    const url = "api/ttsc015/getStatus";
    axiosAPI
      .post(url, { plant: plantValue }, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          alertify.error("Failed to fetch status list.");
          setStatusOptions([]);
          setselectedstatus(null);
        } else {
          const items = response.data.map((row) => ({
            value: row[0],
            label: row[0],
          }));
          setStatusOptions(items);
          if (items.length > 0) {
            setselectedstatus(items[0]);
          } else {
            setselectedstatus(null);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching status list:", error);
        alertify.error("An error occurred while fetching status list.");
        setStatusOptions([]);
        setselectedstatus(null);
      });
  };

  // Function to get Batch ID list
  const getBatchIDList = (plantValue, statusValue, tabValue, accessToken) => {
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    const url = "api/ttsc015/getBatchID";
    axiosAPI
      .post(
        url,
        { plant: plantValue, status: statusValue, flag: tabValue },
        defaultOptions,
      )
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          alertify.error("Failed to fetch Batch ID list.");
          setBatchIdOptions([]);
          setselectedbatchId(null);
        } else {
          const items = response.data.map((row) => ({
            value: row[0],
            label: row[0],
          }));
          setBatchIdOptions(items);
          if (items.length > 0) {
            // setselectedbatchId(items[0]);
          } else {
            setselectedbatchId(null);
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching Batch ID list:", error);
        alertify.error("An error occurred while fetching Batch ID list.");
        setBatchIdOptions([]);
        setselectedbatchId(null);
      });
  };

  // Function to get Size value
  const getSizeValue = (plantValue, batchIdValue, accessToken) => {
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    const url = "api/ttsc015/getsize";
    axiosAPI
      .post(url, { plant: plantValue, Batch: batchIdValue }, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          alertify.error("Failed to fetch Size.");
          setSize("");
          setmatnr("");
          setQty("");
          setmatnrdesc("");
        } else {
          // Assuming the API returns a single value or the first item of an array
          if (response.data && response.data.length > 0) {
            setSize(response.data[0][0]); // Assuming the size is the first element of the first row
            setmatnr(response.data[0][1]);
             setmatnrdesc(response.data[0][3]);
            // setmatnrdesc("");
            // Convert to number and format to 3 decimal places
            const quantity = parseFloat(response.data[0][2]);
            setQty(isNaN(quantity) ? "" : quantity.toFixed(3));
          } else {
            setSize("");
            setmatnr("");
            setQty("");
            setmatnrdesc("");
          }
        }
      })
      .catch((error) => {
        console.error("Error fetching Size:", error);
        alertify.error("An error occurred while fetching Size.");
        setSize("");
        setmatnr("");
        setQty("");
      });
  };

  // MODIFIED useEffect for reportData to handle Tabulator lifecycle
  useEffect(() => {
    if (tabValue === 1) {
      // Ensures this only runs when the "Report" tab is active
      if (reportData && reportData.length > 0) {
        // Destroy existing Tabulator instance if it exists before re-creating
        if (reportDataTable) {
          reportDataTable.destroy();
        }
        setreportDataTable(
          new Tabulator("#reportTable", {
            // Initializes Tabulator targeting the div with id "reportTable"
            data: reportData, // Populates the table with the fetched data
            columns: reportInfoColumn,
            maxHeight: 400,
            layout: "fitDataFill",
          }),
        );
      } else {
        // If reportData is empty or null, ensure the table is cleared/destroyed if it exists
        if (reportDataTable) {
          reportDataTable.destroy(); // Destroy existing Tabulator instance
          setreportDataTable(null);
        }
      }
    } else {
      // If tabValue is not 1 (i.e., not on the Report tab), destroy the table instance
      if (reportDataTable) {
        reportDataTable.destroy();
        setreportDataTable(null);
      }
    }
  }, [reportData, tabValue]); // Dependency array: runs when reportData or tabValue changes

  useEffect(() => {
    if (selectedGradeData) {
      setselectedGradeTable(
        new Tabulator("#gradeTable", {
          maxHeight: 300,
          layout: "fitDataFill",
          data: selectedGradeData,
          columns: gradelistcolumn,
        }),
      );
    }
  }, [selectedGradeData]);

  const validateUser = async (token) => {
    try {
      var plant = "";
      {
        var userDetails = jwt.verify(
          token.refreshToken,
          serverDetails.REFRESH_KEY,
        );

        plant = userDetails.payload.plant;
        serverDetails.PersonalNo = userDetails.payload.id;
        serverDetails.Plant = userDetails.payload.plant;
        serverDetails.Company = userDetails.payload.company;
      }

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "TTSC001";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken,
      );

      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW") {
            setReadWriteAccess(false);
            alertify.success(
              "You are authorized to make changes from this page",
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page",
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page",
          );
        }
        setCountedBy(userDetails.payload.id); // Set countedBy here after successful auth
      } else {
        setRestricted(true);
        setAdmin(false);
        setCountedBy(""); // Clear if not authorized
      }
    } catch {
      setRestricted(true);
      setAdmin(false);
      setCountedBy(""); // Clear if error
      if (serverDetails.devMode == false) {
        window.location.href = "#/signin";
      }
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
      setCountedBy("DEV_USER"); // Example for dev mode
    }
  };

  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/users/screenAuth";

      if (serverDetails.devMode == true) {
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          reject(null);
        } else {
          var encryptUserInfo = response.data;
          var authDetails = jwt.verify(
            encryptUserInfo,
            serverDetails.SCREEN_AUTH_KEY,
          );
          if (authDetails) {
            resolve(authDetails);
          } else {
            reject(null);
          }
        }
      });
    });

  const getGroupPlantId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
      };
      var url = "api/common/getGroupPlant";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[1];
              items.push(obj);
            });

            setPlant(items);
            if (items.length > 0) {
              setSelectedPlant(items[0]);
              // Trigger fetching status list for the initial plant
              // This is now handled by the useEffect for selectedPlant
              // getStatusList(items[0].value, accessToken);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const fetchMaxFileSize = async () => {
    try {
      const token = await GetAuthorization();

      const response = await axiosAPI.post(
        "api/ttsc015/getTxtdownloadsize",
        { flag: "Y" },   //  pass flag = "Y"
        {
          headers: { Authorization: "Bearer " + token.accessToken },
        }
      );

      if (response?.data?.length > 0) {
        const size = parseFloat(response.data[0][0]);
        if (!isNaN(size)) {
          setMaxFileSizeMB(size);
        }
      }
    } catch (error) {
      console.error("Error fetching MBSIZE:", error);
    }
  };
  ``

  const getGradeInfo = () => {
    if (selectedspec === null) {
      alertify.error("Please select Spec");
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/ttsc015/getGradeInfo";

      let data = {
        spec: selectedspec.value,
        status: selectedstatus?.value, // Use optional chaining
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            if (response.data[1]) {
              setselectedGradeData(response.data[1]);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .catch((error) => {
          setselectedGradeData([]);
          // setprodInquiryTable(null);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const gradelistcolumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
      download: false,
    },
    {
      title: "Spec",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 70,
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // width: 100,
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 220,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Created On",
      field: "CRTDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 140,
    },
    {
      title: "Created by",
      field: "CRTBY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 140,
    },
    {
      title: "Updated On",
      field: "CRTDT", // This seems like a typo, should it be UPDDT?
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 140,
    },
    {
      title: "Updated by",
      field: "CRTBY", // This seems like a typo, should it be UPDBY?
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 140,
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 120,
    },
  ];

  // MODIFIED getData function to correctly process response.data
  const getData = () => {
    if (selectedPlant?.value === undefined || selectedPlant?.value === null) {
      alertify.error("Please select Plant");
      setreportData([]); // Clear data if plant is not selected
      if (reportDataTable) {
        // Destroy table if it exists
        reportDataTable.destroy();
        setreportDataTable(null);
      }
      return;
    }
    if (selectedstatus === "" || selectedstatus === undefined || selectedstatus === null) {
      alertify.error("Please select Status");
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/ttsC015/GetreportTubecnt";
      var data = {
        plant: selectedPlant?.value,
        status: selectedstatus?.value || "", // Pass selected status
        Batchid: selectedbatchId?.value || "", // Pass selected batch ID
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            alertify.error("Failed to fetch report data.");
            setreportData([]);
            if (reportDataTable) {
              reportDataTable.destroy();
              setreportDataTable(null);
            }
          } else {
            // The controller returns an array where response.data[1] contains the actual rows
            const fetchedRows = response.data[1];
            if (fetchedRows && fetchedRows.length > 0) {
              setreportData(fetchedRows);
            } else {
              alertify.error("No Data Found");
              setreportData([]);
              if (reportDataTable) {
                reportDataTable.destroy();
                setreportDataTable(null);
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching report data:", error);
          alertify.error("An error occurred while fetching report data.");
          setreportData([]);
          if (reportDataTable) {
            reportDataTable.destroy();
            setreportDataTable(null);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  // Custom formatter function for the "Link" column to display an icon and open image preview on click
  const imageFormatter = function (cell, formatterParams, onRendered) {
    const sftpPath = cell.getValue();
    const cellContainer = document.createElement("div"); // Create a container for the icon
    cellContainer.style.display = "flex";
    cellContainer.style.justifyContent = "center";
    cellContainer.style.alignItems = "center";
    cellContainer.style.height = "100%"; // Ensure it fills the cell height
    cellContainer.style.cursor = "pointer";
    cellContainer.title = sftpPath
      ? `Click to view: ${sftpPath}`
      : "No image link";

    if (!sftpPath) {
      cellContainer.innerHTML =
        '<span style="color: #999; font-size: 0.8em;">N/A</span>';
      return cellContainer;
    }

    // Create an icon element using an SVG for direct embedding.
    // This SVG corresponds to the Material Design "Image" icon.
    const iconSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#1976d2">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>
  `;
    cellContainer.innerHTML = iconSvg;

    // Attach the click handler to the container
    cellContainer.onclick = (event) => {
      event.stopPropagation(); // Prevent potential row click events from Tabulator

      const rowData = cell.getRow().getData(); // ✅ get full row

      setPreviewMeta({
        BATCHID: rowData.BATCHID,
        SIZE1: rowData.SIZE1,
        NO_PCS_SQ: rowData.NO_PCS_SQ,
        NO_PCS_CR: rowData.NO_PCS_CR,
        CRTDT: rowData.CRTDT,
        CRTBY: rowData.CRT_ID,
        PLANT: rowData.PLANT,
        SHIFT: rowData.SHIFT,
      });

      setLoading(true); // Show loading indicator

      GetAuthorization()
        .then((token) => {
          axiosAPI
            .get(
              `/api/ttsc015/image?filePath=${encodeURIComponent(sftpPath)}`,
              {
                responseType: "blob",
                headers: {
                  Authorization: "Bearer " + token.accessToken,
                },
              },
            )
            .then((response) => {
              const imageUrl = URL.createObjectURL(response.data);
              setPreviewImage(imageUrl);
              setPreviewOpen(true);
            })
            .catch((error) => {
              console.error("Error fetching image for preview:", error);
              alertify.error("Failed to load image for preview.");
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error(
            "Error getting authorization token for preview:",
            error,
          );
          alertify.error("Authentication error for image preview.");
          setLoading(false);
        });
    };

    // Return the DOM element to Tabulator
    return cellContainer;
  };

  const reportInfoColumn = [
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // width: "5%",
    },
    {
      title: "Batch ID",
      field: "BATCHID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      // width: "8%",
    },
    {
      title: "Cast No",
      field: "EOM_NO_CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      // width: "8%",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // width: "6%",
    },
        {
      title: "Grade",
      field: "ENC_MK_SPEC_COMPLETE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // width: "6%",
    },
    {
      title: "Size",
      field: "SIZE1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // width: "8%",
    },

    {
      //title: "Total\xa0Stock",
      title: "Qty (Ton)",
      field: "QTY",
      // width: "7%",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      hozAlign: "right", // Added for right alignment
      headerFilter: "input", // Added headerFilter
      headerFilterPlaceholder: "search...",
      // formatter: "money",
    },

    {
      title: "Material No.", //"UOM",
      field: "MATNR",
      // width: "11%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
        {
      title: "Material Desc", //"UOM",
      field: "ENC_ORD_DESC",
      // width: "11%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order No", //"UOM",
      field: "EOM_ID_ORDER_CUS",
      // width: "6%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
        {
      title: "Item No", //"UOM",
      field: "EOM_ID_ORD_ITEM_CUS",
      // width: "4%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name", //"UOM",
      field: "ENC_CUST_NAME",
      // width: "10%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // {
    //   title: "LINK",
    //   field: "LINK1",
    //   headerFilter: "input",
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }\n    return value;\n   },\n    headerFilterPlaceholder: "search...",\n    },
    {
      title: "Created On",
      field: "CRTDT",
      // width: "11%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Shift", //"UOM",
      field: "SHIFT",
      // width: "6%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CRT_ID",
      // width: "8%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Pcs Square",
      field: "NO_PCS_SQ",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right", // Added for right alignment
      // width: "8%",
      bottomCalc: "sum",
      // bottomCalcParams: { precision: 3 },
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value) {
      //     return value.toFixed(3);
      //   }\n  //   return value;\n  // },
    },
    {
      title: "Pcs Circular",
      field: "NO_PCS_CR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right", // Added for right alignment
      // width: "8%",
      bottomCalc: "sum",
      // bottomCalcParams: { precision: 3 },
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value) {
      //     return value.toFixed(3);
      //   }\n  //   return value;\n  // },
    },
    {
      title: "Preview",
      field: "LINK1",
      // width: "12%",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      download: false,
      formatter: imageFormatter, // Use the new custom image formatter
    },

    // {
    //   title: "Confidence",
    //   field: "CONFI",
    //   // disable,
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   hozAlign: "right", // Added for right alignment
    //   width: "8%",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(2);
    //     }
    //     return value;
    //   },
    // },
  ];

  const handleOrdTypeChange = (value) => {
    // setSelectOrderType(value); // This state is not defined, commenting out
  };

  const downloadExcelBOMTableData = () => {
    if (selectedGradeData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "ttsc015 " + date.toString() + ".xlsx";
    selectedGradeTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const checkTxtDownloadAllowed = async () => {
    try {
      const token = await GetAuthorization();

      const response = await axiosAPI.post(
        "api/ttsc015/getTxtdownloadflag",
        { plant: selectedPlant?.value },
        {
          headers: { Authorization: "Bearer " + token.accessToken },
        }
      );

      if (response?.data?.length > 0) {
        const cnt = response.data[0][0];
        return cnt > 0; // ✅ condition
      }

      return false;
    } catch (error) {
      console.error("Error checking TXT flag:", error);
      return false;
    }
  };

  const handleplantChange = (value) => {
    setSelectedPlant(value);
    // Clear dependent states
    setselectedstatus(null);
    setStatusOptions([]);
    setselectedbatchId(null);
    setBatchIdOptions([]);
     setmatnrdesc("");
    setSize("");
    setmatnr("");
    setQty("");
  };

  const handlebatchId = (value) => {
    setselectedbatchId(value);
    // Clear dependent states
    setSize("");
    setmatnr("");
    setQty("");
    setmatnrdesc("");
    setreportData([]);
    if (reportDataTable) {
      // Ensure to destroy Tabulator instance
      reportDataTable.destroy();
      setreportDataTable(null);
    }
  };

  const handlestatuschange = (value) => {
    setselectedstatus(value);
    // Clear dependent states
    setselectedbatchId(null);
    setBatchIdOptions([]);
    setSize("");
    setmatnr("");
    setmatnrdesc("");
    setQty("");
    setreportData([]);
    if (reportDataTable) {
      // Ensure to destroy Tabulator instance
      reportDataTable.destroy();
      setreportDataTable(null);
    }
  };

  // New handlers for Tube Counting feature
  const handleFileChange = (event) => {
    resetUploadState(); // Clear previous data and state
    setselectedbatchId(null);
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setUploadedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      showMessage("Please select Batch ID", "success")
    } else {
      showMessage("Please upload a PNG, JPEG, or JPG image.", "error")
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    resetUploadState(); // Clear previous data and state
    const file = event.dataTransfer.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setUploadedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      showMessage("Please drop a PNG, JPEG, or JPG image.", "error");
      setUploadedFile(null);
      setImagePreviewUrl(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // const handleConfidenceChange = (event, newValue) => { // Confidence state is commented out
  //   setConfidence(newValue);
  // };

  const handleBatchIdChange = (event) => setBatchId(event.target.value);
  // const handleSizeChange = (event) => setSize(event.target.value); // This will now be populated by API
  const handleDateChange = (date) => setSelectedDate(date);
  const handleShiftChange = (value) => setSelectedShift(value);

  const handleCountTubes = () => {
    if (!uploadedFile) {
      showMessage("Please upload an image first.", "error")
      return;
    }
    if (!selectedbatchId) {
      showMessage("Please select Batch ID", "error")
      return;
    } const MAX_FILE_SIZE_MB = maxFileSizeMB || 16; const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (uploadedFile.size > MAX_FILE_SIZE_BYTES) {
      showMessage(`File size exceeds ${MAX_FILE_SIZE_MB} MB`, "error");
      return;
    }
    setLoading(true);
    GetAuthorization().then(async (token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
          "Content-Type": "multipart/form-data",
        },
      };
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const url = "api/ttsc015/tubecountapi";
      await axiosAPI
        .post(url, formData, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            alertify.error(
              "Failed to count tubes. Please check the image or input data.",
            );
            setLoading(false);
          } else if (response.data?.AIResp){
            showMessage("Tube counted successfully!", "success");

            const aiResp = response.data?.AIResp;
            setCountingResults(aiResp);
            setZoomLevel(1);
            setIsDrawingEnabled(true);
            if (aiResp?.boxes) {
              for (let i = 0; i < aiResp?.boxes?.length; i++) {
                const baseSize = aiResp?.boxes[i]?.x2 - aiResp?.boxes[i]?.x1;
                const newCircle = {
                  id: Number(aiResp?.count_cls_0) > 0?`circle-${Date.now()}` : `square-${Date.now()}`,
                  type: Number(aiResp?.count_cls_0) > 0? 'circle' : 'square',
                  x: aiResp?.boxes[i]?.x1 + ((aiResp?.boxes[i]?.x2 - aiResp?.boxes[i]?.x1) / 2),
                  y: aiResp?.boxes[i]?.y1 + ((aiResp?.boxes[i]?.y2 - aiResp?.boxes[i]?.y1) /2),
                  // size: 20, // Fixed radius for manual circles
                  size: baseSize / (zoomLevel * 2),   // ✅ dynamic size
                  color: 'lightgreen',
                  isAI: false,
                };
                setDrawnShapes(prev => [...prev, newCircle]);
                showMessage("Position added.", "info");
              }
              draw();
            } else {
              setDrawnShapes([]);
            }
            if (aiResp?.image) {
              const base64Image = "data:image/jpg;base64," + aiResp.image;

              setreturnimage(aiResp.image);
              setImagePreviewUrl(base64Image);   // ✅ THIS LINE IS KEY
            }
            // --- MODIFIED LOGIC HERE ---
            // The API provides count_cls_0 and count_cls_1 directly, not detected_boxes.

            // setAiCrtubeCount(Number(aiResp?.count_cls_0) || 0);
            // setAiSqtubeCount(Number(aiResp?.count_cls_1) || 0);


            const crCount = Number(aiResp?.count_cls_0) || 0;
            const sqCount = Number(aiResp?.count_cls_1) || 0;

            setAiCrtubeCount(crCount);
            setAiSqtubeCount(sqCount);

            // ✅ Enable drawing ONLY if condition met



            // Clear any manually drawn shapes when a new AI count is performed,
            // as the AI is not providing bounding boxes to draw.

            setLoading(false);
          } else {
            showMessage("Something wents wrong!", "Error");
            setLoading(false);
          }
        })
        .catch((error) => {
          // console.error("Error during tube counting API call:", error);
          // alertify.error("An error occurred while counting tubes.");
          setLoading(false);
        });
    });
  };


  const handleDownloadResults = async () => {
    if (!imageObjRef.current) {
      alertify.error("No image available to save results.");
      return;
    }

    try {
      setLoading(true);
      const token = await GetAuthorization();
      const isAllowed = await checkTxtDownloadAllowed();

      // 1. Create a new canvas to draw the final image with all shapes
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

      const img = imageObjRef.current; // The original uploaded image
      tempCanvas.width = img.naturalWidth;
      tempCanvas.height = img.naturalHeight;
      tempCtx.drawImage(img, 0, 0); // Draw original image

      // Draw ALL current drawnShapes onto this temp canvas (at original image scale)
      drawnShapes.forEach(shape => {
        tempCtx.strokeStyle = shape.color;
        tempCtx.lineWidth = 4; // Thicker lines for download
        if (shape.type === 'circle') {
          tempCtx.beginPath();
          tempCtx.arc(shape.x, shape.y, shape.size, 0, 2 * Math.PI);
          tempCtx.stroke();
        } else if (shape.type === 'square') {
          const halfSide = shape.size / 2;
          tempCtx.strokeRect(shape.x - halfSide, shape.y - halfSide, shape.size, shape.size);
        }
      });

      // Get base64 of the modified image
      const modifiedImageBase64 = tempCanvas.toDataURL('image/jpeg', 0.95).split(',')[1]; // Get base64 part

      const payload = {
        dt: [
          {
            PLANT: selectedPlant?.value,
            BATCHID: selectedbatchId?.value,
            STATUS: selectedstatus?.value,
            QTY: qty,
            MATNR: matnr,
            MATNRDESC: matnrdesc,
            LINK1: "", // This might be updated by the backend
            NO_PCS_CR: crtubeCount, // Use derived counts
            NO_PCS_SQ: sqtubeCount, // Use derived counts
            CONFI: countingResults?.confidence || "0.7",
            SIZE1: size,
            SHIFT: selectedShift.value,
          },
        ],
      };

      // Upload the modified image
      await axiosAPI.post(
        "api/ttsc015/uploadTubeImage",
        {
          imageBase64: "data:image/jpeg;base64," + modifiedImageBase64, // Use the modified image
          plant: selectedPlant?.value,
          batchId: selectedbatchId?.value,
          status: selectedstatus?.value,
          qty: qty,
          matnr: matnr,
          matnrdesc: matnrdesc,
          no_pcs_SQ: sqtubeCount, // Use derived counts
          no_pcs_CR: crtubeCount, // Use derived counts
          confi: countingResults?.confidence || "0.7",
          SIZE1: size,
          SHIFT: selectedShift.value,
        },
        {
          headers: { Authorization: "Bearer " + token.accessToken },
        }
      );

      // ONLY download TXT when allowed
      if (isAllowed) {
        const textContent = `
Tube Counting Result
------------------------
Plant               : ${payload.dt[0].PLANT}
Batch ID            : ${payload.dt[0].BATCHID}
Status              : ${payload.dt[0].STATUS}
Quantity            : ${payload.dt[0].QTY}
No of Circular Tubes: ${payload.dt[0].NO_PCS_CR}
No of Square Tubes  : ${payload.dt[0].NO_PCS_SQ}
Size                : ${payload.dt[0].SIZE1}
Counted By          : ${countedBy}
Date                : ${selectedDate?.toISOString().split("T")[0]}
Shift               : ${payload.dt[0].SHIFT}
`;

        const blob = new Blob([textContent], {
          type: "text/plain;charset=utf-8",
        });

        const fileName = `TubeCounting_${payload.dt[0].BATCHID || "unknown"}.txt`;

        FileSaver.saveAs(blob, fileName);
        showMessage("Result saved successfully", "success");
      } else if (!isAllowed) {
        showMessage("Result saved successfully", "success");
      }

      // Reset ALWAYS
      resetUploadState(); // Use the consolidated reset function
      setselectedbatchId(null); // Keep this specific clear
    } catch (error) {
      console.error("Insert error:", error);
      alertify.error("Failed to save data.");
    } finally {
      setLoading(false);
    }
  };


  // Handler for tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setselectedbatchId(null);
  };

  const downloadExcelcustomerTableData = () => {
    if (reportDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = reportDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "TTSM012_Groundreport " + date.toString() + ".xlsx";
    reportDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  // Handler for Clear All button in the Report tab
  const handleClearAll = () => {
    setSelectedPlant(null);
    setselectedstatus(null);
    setStatusOptions([]);
    setselectedbatchId(null);
    setBatchIdOptions([]);
    setSize("");
    setmatnr("");
    setQty("");
    setreportData([]);
    if (reportDataTable) {
      // Ensure to destroy Tabulator instance
      reportDataTable.destroy();
      setreportDataTable(null);
    }
    // Re-fetch initial plant list if needed, or rely on initial fetchData
    // fetchData(); // This would re-fetch initial plant list and trigger subsequent effects
  };

  const resetUploadState = () => {
    setIsDrawingEnabled(false);
    setselectedbatchId(null);
    setUploadedFile(null);
    setImagePreviewUrl(null);
    setreturnimage(null);
    setCountingResults(null);
    setDrawnShapes([]);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setDrawingMode('viewing');
    setSelectedShapeIdForDeletion(null);
    setAiCrtubeCount(0);
    setAiSqtubeCount(0);
  };


  const handleDownloadPreview = async () => {
    if (!previewImage) return;

    try {
      const img = new Image();
      img.crossOrigin = "anonymous"; // important if blob/remote

      img.src = previewImage;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas size same as image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // ✅ Styling for text box
        const padding = 20;
        const lineHeight = 28;
        let startY = padding + 20;

        ctx.font = "18px Arial";
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;

        // ✅ Prepare text data
        const lines = [
          `Batch ID: ${previewMeta.BATCHID || "N/A"}`,
          `Size: ${previewMeta.SIZE1 || "N/A"}`,
          `Date: ${previewMeta.CRTDT + " ( Shift " + previewMeta.SHIFT + " )" || "N/A"}`,
          // `Shift: ${previewMeta.SHIFT || "N/A"}`,
        ];

        if (Number(previewMeta.NO_PCS_CR) > 0) {
          lines.push(`Tube Count Circular: ${previewMeta.NO_PCS_CR}`);
        }

        if (Number(previewMeta.NO_PCS_SQ) > 0) {
          lines.push(`Tube Count Square: ${previewMeta.NO_PCS_SQ}`);
        }

        lines.push(`Counted By: ${previewMeta.CRTBY || "N/A"}`);

        // ✅ Draw background box (semi-transparent)
        const boxHeight = lines.length * lineHeight + 20;
        const boxWidth = 380;

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(10, 10, boxWidth, boxHeight);

        // ✅ Draw text
        ctx.fillStyle = "#ffffff";

        lines.forEach((line, index) => {
          const y = startY + index * lineHeight;

          ctx.strokeText(line, 20, y); // outline
          ctx.fillText(line, 20, y);   // fill
        });

        // ✅ Convert to JPEG and download
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = `${previewMeta.PLANT + "_" + previewMeta.BATCHID || "image"}.jpg`;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, "image/jpeg", 0.95);
      };
    } catch (error) {
      console.error("Download error:", error);
      alertify.error("Failed to download image");
    }
  };

  // --- Image Manipulation Functions ---

  // Utility to convert mouse event coordinates to image coordinates on the canvas
  const getTransformedPoint = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || !imageObjRef.current) return null;

    // const rect = canvas.getBoundingClientRect();
    // // const mouseX = clientX - rect.left;
    // // const mouseY = clientY - rect.top;

    //  const scaleX = canvas.width / rect.width;
    // const scaleY = canvas.height / rect.height;

    // const mouseX = (clientX - rect.left - window.scrollX) * scaleX;
    // const mouseY = (clientY - rect.top - window.scrollY) * scaleY;

    // const img = imageObjRef.current;
    // const naturalWidth = img.naturalWidth;
    // const naturalHeight = img.naturalHeight;

    // const canvasAspect = canvas.width / canvas.height;
    // const imageAspect = naturalWidth / naturalHeight;

    // let displayedImageWidth, displayedImageHeight, displayedImageOffsetX, displayedImageOffsetY;

    // if (imageAspect > canvasAspect) {
    //   // Image is wider than canvas, fit by width
    //   displayedImageWidth = canvas.width * zoomLevel;
    //   displayedImageHeight = displayedImageWidth / imageAspect;
    // } else {
    //   // Image is taller than canvas, fit by height
    //   displayedImageHeight = canvas.height * zoomLevel;
    //   displayedImageWidth = displayedImageHeight * imageAspect;
    // }

    // // Calculate the position of the displayed image on the canvas
    // displayedImageOffsetX = (canvas.width - displayedImageWidth) / 2 + panOffset.x;
    // displayedImageOffsetY = (canvas.height - displayedImageHeight) / 2 + panOffset.y;

    // // Convert mouse coordinates to coordinates relative to the displayed image
    // const relativeX = mouseX - displayedImageOffsetX;
    // const relativeY = mouseY - displayedImageOffsetY;

    // // Convert relative coordinates to original image coordinates
    // const imageX = relativeX / (displayedImageWidth / naturalWidth);
    // const imageY = relativeY / (displayedImageHeight / naturalHeight);

    // // Check if click is within the displayed image bounds
    // // if (imageX >= 0 && imageX <= naturalWidth && imageY >= 0 && imageY <= naturalHeight) {
    //   return { x: imageX, y: imageY };
    // // }
    // return null;
    const rect = canvas.getBoundingClientRect();

    // 1. Calculate internal canvas scaling (CSS size vs. internal resolution)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // 2. Get mouse position relative to canvas (Corrected: clientX/Y - rect.left/top automatically handles scroll)
    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    const img = imageObjRef.current;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = naturalWidth / naturalHeight;

    let displayedImageWidth, displayedImageHeight;

    // 3. Calculate displayed dimensions based on aspect ratio fit (Corrected syntax)
    if (imageAspect > canvasAspect) {
      // Image is wider than canvas, fit by width
      displayedImageWidth = canvas.width * zoomLevel;
      displayedImageHeight = displayedImageWidth / imageAspect;
    } else {
      // Image is taller than canvas, fit by height
      displayedImageHeight = canvas.height * zoomLevel;
      displayedImageWidth = displayedImageHeight * imageAspect;
    }

    // 4. Calculate the rendering offset of the image on the canvas (centering + pan)
    const displayedImageOffsetX = (canvas.width - displayedImageWidth) / 2 + panOffset.x;
    const displayedImageOffsetY = (canvas.height - displayedImageHeight) / 2 + panOffset.y;

    // 5. Convert mouse coordinates to coordinates relative to the displayed image
    const relativeX = mouseX - displayedImageOffsetX;
    const relativeY = mouseY - displayedImageOffsetY;

    // 6. Scale relative coordinates back to original image dimensions
    const imageX = relativeX / (displayedImageWidth / naturalWidth);
    const imageY = relativeY / (displayedImageHeight / naturalHeight);

    // 7. Check if the click is within the actual image boundaries (Corrected syntax)
    if (imageX >= 0 && imageX <= naturalWidth && imageY >= 0 && imageY <= naturalHeight) {
      return { x: imageX, y: imageY };
    }

    return null; // Clicked on the canvas background/letterbox area
  }, [zoomLevel, panOffset]);

  // Utility to find if a shape exists at given image coordinates
  const getShapeAtImageCoordinates = useCallback((imageX, imageY) => {
    const tolerance = 10; // pixels in original image scale for click detection
    for (const shape of drawnShapes) {
      if (shape.type === 'circle') {
        const distance = Math.sqrt(
          Math.pow(imageX - shape.x, 2) + Math.pow(imageY - shape.y, 2)
        );
        if (distance <= shape.size + tolerance) {
          return shape;
        }
      } else if (shape.type === 'square') {
        const halfSide = shape.size / 2;
        if (
          imageX >= shape.x - halfSide - tolerance &&
          imageX <= shape.x + halfSide + tolerance &&
          imageY >= shape.y - halfSide - tolerance &&
          imageY <= shape.y + halfSide + tolerance
        ) {
          return shape;
        }
      }
    }
    return null;
  }, [drawnShapes]);

  // Handle canvas click for adding/deleting shapes
  const handleCanvasClick = useCallback((e) => {
    if (drawingMode === 'viewing' || !imageObjRef.current) return; // Don't add shapes in viewing mode

    const imageCoords = getTransformedPoint(e.clientX, e.clientY);
    if (!imageCoords) {
      setSelectedShapeIdForDeletion(null); // Clicked outside image, deselect
      return;
    }

    const { x: imageX, y: imageY } = imageCoords;
    
    if (drawingMode === 'add-circle') {
      const baseSize = 50;
      const newCircle = {
        id: `circle-${Date.now()}`,
        type: 'circle',
        x: imageX,
        y: imageY,
        // size: 20, // Fixed radius for manual circles
        size: baseSize / (zoomLevel * 2),   // ✅ dynamic size
        color: 'yellow',
        isAI: false,
      };
      setDrawnShapes(prev => [...prev, newCircle]);
      showMessage("Circular tube added.", "info");
    } else if (drawingMode === 'add-square') {
      const baseSize = 50;
      const newSquare = {
        id: `square-${Date.now()}`,
        type: 'square',
        x: imageX,
        y: imageY,
        // size: 30, // Fixed side for manual squares
        size: baseSize / (zoomLevel * 2),
        color: 'yellow',
        isAI: false,
      };
      setDrawnShapes(prev => [...prev, newSquare]);
      showMessage("Square tube added.", "info");
    } else if (drawingMode === 'delete') {
      const clickedShape = getShapeAtImageCoordinates(imageX, imageY);
      if (clickedShape) {
        if (selectedShapeIdForDeletion === clickedShape.id) {
          // Confirm deletion
          setDrawnShapes(prev => prev.filter(s => s.id !== clickedShape.id));
          setSelectedShapeIdForDeletion(null); // Deselect after deletion
          showMessage(`${clickedShape.type} tube deleted.`, "info");
        } else {
          // Select for deletion
          setSelectedShapeIdForDeletion(clickedShape.id);
          showMessage(`Click again to delete the ${clickedShape.type} tube.`, 'info');
        }
      } else {
        setSelectedShapeIdForDeletion(null); // Clicked outside any shape, deselect
      }
    }
  }, [drawingMode, getTransformedPoint, getShapeAtImageCoordinates, drawnShapes, selectedShapeIdForDeletion, showMessage]);

  // Handle zoom in/out
  const handleZoom = (direction) => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.1 : prev / 1.1;
      return Math.max(0.1, Math.min(5, newZoom)); // Limit zoom between 0.1x and 5x
    });
  };

  // Reset zoom and pan
  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setDrawingMode('viewing');
    setSelectedShapeIdForDeletion(null);
  };

  // Pan handlers
  // const handleMouseDown = useCallback((e) => {
  //   if (drawingMode === 'viewing') {
  //     isPanningRef.current = true;
  //     lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  //     e.currentTarget.style.cursor = 'crosshair';
  //   }
  // }, [drawingMode]);

  // const handleMouseMove = useCallback((e) => {
  //   if (isPanningRef.current && drawingMode === 'viewing') {
  //     const dx = e.clientX - lastMousePosRef.current.x;
  //     const dy = e.clientY - lastMousePosRef.current.y;
  //     setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  //     lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  //   }
  // }, [drawingMode]);

  // const handleMouseUp = useCallback((e) => {
  //   isPanningRef.current = false;
  //   e.currentTarget.style.cursor = 'crosshair';
  // }, []);

  const handleMouseDown = useCallback(
  (e) => {
    if (drawingMode === "viewing") {
      isPanningRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.style.cursor = "grabbing";
    } else if (drawingMode === "encircle") {
      const coords = getTransformedPoint(e.clientX, e.clientY);
      if (coords) {
        isDrawingRoiRef.current = true;
        setRoiPath([coords]);
      }
    }
  },
  [drawingMode, getTransformedPoint]
);

const handleMouseMove = useCallback(
  (e) => {
    if (isPanningRef.current && drawingMode === "viewing") {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    } else if (isDrawingRoiRef.current && drawingMode === "encircle") {
      const coords = getTransformedPoint(e.clientX, e.clientY);
      if (coords) {
        setRoiPath((prev) => [...prev, coords]);
      }
    }
  },
  [drawingMode, getTransformedPoint]
);

const handleMouseUp = useCallback(async () => {
  if (drawingMode === "viewing") {
    isPanningRef.current = false;
  } else if (isDrawingRoiRef.current && drawingMode === "encircle") {
    isDrawingRoiRef.current = false;

    if (roiPath.length > 5 && imageObjRef.current) {
      // Create cropped image
      const result = await cropImageFromRoi(imageObjRef.current, roiPath);
      if (result) {
        setUploadedFile(result.file); // Set as active file for API
        setImagePreviewUrl(result.previewUrl); // Show cropped region on canvas
        setDrawingMode("viewing");
        setRoiPath([]);
        showMessage("Encircled region cropped as new active image.", "success");
      }
    }
  }
}, [drawingMode, roiPath]);


  const handleMouseLeave = useCallback((e) => {
    isPanningRef.current = false;
    e.currentTarget.style.cursor = 'default';
  }, []);

  


  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Common"
        page={tabValue === 0 ? "Tube Counting" : "Tube Counting Report"} // Dynamic page title
      />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {loading && <Preloader />}
      </Grid>
      {isRestricted && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}

      {isRestricted == false && (
        <>
          <MDBox pt={1} pb={0} py={6}>
            <AppBar
              position="static"
              sx={{ backgroundColor: "transparent", boxShadow: "none" }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="tube counting tabs"
              >
                <Tab label="Tube Counting" {...a11yProps(0)} />
                <Tab label="Tube Counting Report" {...a11yProps(1)} />
              </Tabs>
            </AppBar>
          </MDBox>

          {tabValue === 0 && (
            <MDBox pt={3} pb={0} py={-5}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-5}
                      py={1}
                      px={2}
                      variant="gradient"
                      bgColor="info"
                      borderRadius="lg"
                      coloredShadow="info"
                    >
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Grid item xs={2}>
                          <MDTypography variant="h6" color="white">
                            Tube Counting
                          </MDTypography>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={4}>
                        {/* Left side: Image Upload and Confidence Slider */}
                        <Grid item xs={12} md={7}>
                          {/* New control buttons for image manipulation */}
                          <MDBox
                            mt={0}
                            mb={2}
                            display="flex"
                            justifyContent="center"
                            gap={1}
                            flexWrap="wrap"
                            // disabled={!isDrawingEnabled}
                            sx={{
                              opacity: isDrawingEnabled ? 1 : 0.5,
                              pointerEvents: isDrawingEnabled ? "auto" : "none",
                            }}
                          >

                            <MDButton
                              variant={drawingMode === 'viewing' ? "gradient" : "outlined"}
                              color="info"
                              onClick={() => setDrawingMode('viewing')}
                              startIcon={<PanToolIcon />}
                              size="small"
                              disabled={!isDrawingEnabled}
                            >
                              PAN
                            </MDButton>
                            <MDButton
                              variant={drawingMode === 'add-circle' ? "gradient" : "outlined"}
                              color="info"
                              onClick={() => setDrawingMode('add-circle')}
                              startIcon={<AddCircleOutlineIcon />}
                              size="small"
                              disabled={!isDrawingEnabled}
                            >
                              Add Circle
                            </MDButton>
                            <MDButton
                              variant={drawingMode === 'add-square' ? "gradient" : "outlined"}
                              color="info"
                              onClick={() => setDrawingMode('add-square')}
                              startIcon={<AddBoxOutlinedIcon />}
                              size="small"
                              disabled={!isDrawingEnabled}
                            >
                              Add Square
                            </MDButton>
                            <MDButton
                              variant={drawingMode === 'delete' ? "gradient" : "outlined"}
                              color="error"
                              onClick={() => setDrawingMode('delete')}
                              startIcon={<DeleteOutlineIcon />}
                              size="small"
                              disabled={!isDrawingEnabled}
                            >
                              Delete
                            </MDButton>
                            <MDButton
                              variant="outlined"
                              color="info"
                              onClick={() => handleZoom('in')}
                              startIcon={<ZoomInIcon />}
                              size="small"
                              disabled={!isDrawingEnabled}
                            >
                              Zoom In
                            </MDButton>
                            <MDButton
                              variant="outlined"
                              color="info"
                              onClick={() => handleZoom('out')}
                              startIcon={<ZoomOutIcon />}
                              size="small"
                              disabled={!isDrawingEnabled}
                            >
                              Zoom Out
                            </MDButton>
                            <MDButton
                              variant="outlined"
                              color="secondary"
                              onClick={handleReset}
                              startIcon={<RefreshIcon />}
                              size="small"
                              disabled={!isDrawingEnabled}
                            >
                              Reset
                            </MDButton>
                          </MDBox>
                           <MDBox
                            mt={0}
                            mb={2}
                            display="flex"
                            justifyContent="center"
                            gap={1}
                            flexWrap="wrap"
                            // disabled={!isDrawingEnabled}
                            // sx={{
                            //   opacity: isDrawingEnabled ? 1 : 0.5,
                            //   pointerEvents: isDrawingEnabled ? "auto" : "none",
                            // }}
                          >
                          <MDButton
                              variant={drawingMode === "encircle" ? "gradient" : "outlined"}
  color="warning"
  onClick={() => {
    setDrawingMode(drawingMode === "encircle" ? "viewing" : "encircle");
    setRoiPath([]);
  }}
  startIcon={<AddCircleOutlineIcon />}
  size="small"
  disabled={!uploadedFile}
>
  {drawingMode === "encircle" ? "Drawing ROI..." : "Encircle Part"}
</MDButton>
                          </MDBox>

                          <MDBox
    border="2px dashed"
    borderColor="grey.400"
    borderRadius="lg"
    p={0}
    textAlign="center"
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    minHeight="300px"
    sx={{
        // Conditional cursor: 'pointer' when no image for upload, otherwise drawing/panning cursors
        cursor: imagePreviewUrl
            ? (drawingMode === 'viewing' ? (isPanningRef.current ? 'grabbing' : 'crosshair') : 'crosshair')
            : 'pointer',
        "&:hover": { borderColor: "info.main" },
        overflow: 'hidden',
        position: 'relative',
    }}
    // Apply onClick for upload ONLY when no image is present
    onClick={!imagePreviewUrl ? triggerFileInput : undefined}
    onDrop={handleDrop}
    onDragOver={handleDragOver}
>

                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              accept=".png, .jpeg, .jpg"
                              onChange={handleFileChange}
                            />
                            {imagePreviewUrl ? (
                              <canvas
                                ref={canvasRef}
                                style={{
                                  // maxWidth: "100%",
                                  // maxHeight: "100%",
                                 width: "70%",
                                 height: "60%",
                                  display: 'block',
                                  // Canvas itself handles its own cursor and click events for drawing/panning
                                  cursor: drawingMode === 'viewing' ? (isPanningRef.current ? 'grabbing' : 'crosshair') : 'crosshair',
                                }}
                                onClick={handleCanvasClick} // Apply handleCanvasClick directly to the canvas
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                              />
                            ) : (
                              <>
                                <CloudUploadIcon sx={{ fontSize: 60, color: "grey.500" }} />
                                <MDTypography variant="h5" color="text" mt={2}>
                                  For Tube counting
                                </MDTypography>
                                <MDTypography variant="h6" color="text" mt={2}>
                                  Click here to upload or drag and drop
                                </MDTypography>
                                <MDTypography variant="caption" color="text">
                                  PNG, JPG, or other image formats
                                </MDTypography>
                              </>
                            )}
                          </MDBox>

                          <MDBox mt={3} display="flex" flexDirection="column" alignItems="center">

                            <MDBox
                              position="relative"
                              width="100%"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                            >
                              {/* Left aligned button */}
                              <MDButton
                                variant="gradient"
                                color="dark"
                                onClick={resetUploadState}
                                disabled={!uploadedFile || loading}
                                startIcon={<AddPhotoAlternateIcon />}
                                sx={{
                                  position: "absolute",
                                  left: 0,     // 👈 left aligned
                                }}
                              >
                                Change Image
                              </MDButton>

                              {/* Center aligned buttons */}
                              <MDBox display="flex" justifyContent="center" gap={2}>
                                <MDButton
                                  variant="gradient"
                                  color="info"
                                  onClick={handleCountTubes}
                                  disabled={!uploadedFile || loading || !selectedbatchId}
                                  startIcon={<LibraryAdd />}
                                >
                                  Count Tubes
                                </MDButton>

                                {(drawnShapes.length > 0 || countingResults) && (
                                  <MDButton
                                    variant="gradient"
                                    color="success"
                                    onClick={handleDownloadResults}
                                    startIcon={<DownloadForOfflineIcon />}
                                    disabled={isRestricted || loading}
                                  >
                                    Save Result
                                  </MDButton>
                                )}
                              </MDBox>
                            </MDBox>

                            <MDTypography
                              variant="caption"
                              color="text"
                              mt={1.5}
                              sx={{ fontStyle: "italic" }}
                            >
                              NOTE - Tube Counting is powered by TDA
                            </MDTypography>

                          </MDBox>
                        </Grid>

                        {/* Right side: Batch Information */}
                        <Grid item xs={12} md={5}>
                          <MDBox
                            p={2}
                            borderRadius="lg"
                            bgColor="background.paper"
                            sx={{ border: "1px solid #e0e0e0" }}
                          >
                            <MDTypography variant="h5" mb={2}>
                              Batch Information
                            </MDTypography>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={5} style={{ zIndex: 5 }}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  textTransform="capitalize"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Plant*
                                </MDTypography>
                                <ReactSelect
                                  id="plant"
                                  options={plant}
                                  onChange={handleplantChange}
                                  value={selectedPlant}
                                />
                              </Grid>

                              <Grid item xs={3} style={{ zIndex: 5 }}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  textTransform="capitalize"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Status
                                </MDTypography>
                                <ReactSelect
                                  id="status"
                                  options={statusOptions}
                                  onChange={handlestatuschange}
                                  value={selectedstatus}
                                />
                              </Grid>

                              <Grid item xs={4} style={{ zIndex: 5 }}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  textTransform="capitalize"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Batch ID
                                </MDTypography>
                                <ReactSelect
                                  id="batchId"
                                  options={batchIdOptions}
                                  onChange={handlebatchId}
                                  value={selectedbatchId}
                                />
                              </Grid>
                            </Grid>
                            {/* Row 1: Size + Material No */}
                            <Grid container spacing={2}>
                              <Grid item xs={5}>
                                <MDTypography variant="caption" mb={0.5}>
                                  Size (Thickness X Width X Length)
                                </MDTypography>
                                <MDInput fullWidth value={size} disabled />
                              </Grid>
                              <Grid item xs={3}>
                                <MDTypography variant="caption" mb={0.5}>
                                  Qty
                                </MDTypography>
                                <MDInput fullWidth value={qty} disabled />
                              </Grid>

                              <Grid item xs={4}>
                                <MDTypography variant="caption" mb={0.5}>
                                  Material No.
                                </MDTypography>
                                <MDInput fullWidth value={matnr} disabled />
                              </Grid>
                               <Grid item xs={12}>
                                <MDTypography variant="caption" mb={0.5}>
                                  Material Desc
                                </MDTypography>
                                <MDInput fullWidth value={matnrdesc} disabled />
                              </Grid>
                            </Grid>

                            {/* Row 2: Qty + Counted By */}
                            <Grid container spacing={2} mt={1}>
                              <Grid item xs={4.5}>
                                <MDTypography variant="caption">
                                  Date
                                </MDTypography>
                                <DatePicker
                                  value={selectedDate}
                                  onChange={handleDateChange}
                                  inputFormat="MMMM D, YYYY"
                                  renderInput={(params) => (
                                    <MDInput {...params} fullWidth />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={3}>
                                <MDTypography variant="caption" mb={0.5}>
                                  Counted By
                                </MDTypography>
                                <MDInput fullWidth value={countedBy} disabled />
                              </Grid>

                              <Grid item xs={4} style={{ zIndex: 2 }}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  textTransform="capitalize"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Shift
                                </MDTypography>
                                <ReactSelect
                                  id="Shift"
                                  options={shiftOptions}
                                  onChange={handleShiftChange}
                                  value={selectedShift}
                                />
                              </Grid>

                              <Grid item xs={4}>
                                <MDBox mb={2}>
                                  <MDTypography
                                    variant="caption"
                                    display="block"
                                    mb={0.5}
                                  >
                                    No of Tubes Circular
                                  </MDTypography>
                                  <MDInput
                                    fullWidth
                                    value={crtubeCount} // This will now reflect aiCrtubeCount + manualCrtubeCount
                                    disabled
                                  />
                                </MDBox>
                              </Grid>
                              <Grid item xs={4}>
                                <MDBox mb={2}>
                                  <MDTypography
                                    variant="caption"
                                    display="block"
                                    mb={0.5}
                                  >
                                    No of Tubes Square
                                  </MDTypography>
                                  <MDInput
                                    fullWidth
                                    value={sqtubeCount} // This will now reflect aiSqtubeCount + manualSqtubeCount
                                    disabled
                                  />
                                </MDBox>
                              </Grid>

                            </Grid>
                          </MDBox>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          )}
          <Grid item xs={12}>
            {tabValue == 1 && (
              <Card>
                {/* <MDBox
                                          mx={2}
                                          mt={-3}
                                          py={1}
                                          px={2}
                                          variant="gradient"
                                          bgColor="info"
                                          borderRadius="lg"
                                          coloredShadow="info"
                                      >
                                          <MDTypography variant="h6" color="white">
                                         Filters
                                          </MDTypography>
                                      </MDBox> */}
                <MDBox
                  mx={2}
                  mt={-3}
                  py={1}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        Filters
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={1}>
                      <Tooltip title="Clear All">
                        <IconButton
                          color="white"
                          onClick={handleClearAll} // Use the new handleClearAll
                        >
                          <ClearAllIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox px={3} py={3}>
                  <Grid container spacing={1.5}>
                    <Grid item xs={3}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"red"}
                        noWrap
                      >
                        {" "}
                        Plant <span style={{ color: "red" }}>*</span>
                      </MDTypography>
                      <ReactSelect
                        id="plant"
                        options={plant}
                        value={selectedPlant}
                        onChange={handleplantChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        Status{" "}
                      </MDTypography>
                      <ReactSelect
                        id="status"
                        options={statusOptions}
                        onChange={handlestatuschange}
                        value={selectedstatus}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ zIndex: 2 }}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        Batch ID{" "}
                      </MDTypography>
                      <ReactSelect
                        id="batchId"
                        options={batchIdOptions}
                        onChange={handlebatchId}
                        value={selectedbatchId}
                      />
                    </Grid>
                    {/* <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Order Type
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={ordType}
                            value={selectedOrderType}
                            onChange={handleOrdTypeChange}
                          />
                        </Grid> */}

                    {/* <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Stock Type
                          </MDTypography>
                          <ReactSelect
                            id="stockType"
                            options={StockType}
                            value={selectedStockType}
                            onChange={handleStockTypeChange}
                          />
                        </Grid> */}
                    <Grid item xs={1}>
                      <MDButton
                        style={{ marginTop: "1.5rem" }}
                        size="small"
                        color="info"
                        onClick={
                          getData
                        } /* Changed from onClick={() => getData(true)} */
                      >
                        Submit
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            )}
          </Grid>

          {tabValue == 1 && (
            <Card>
              <MDBox
                mx={2}
                mt={-1}
                py={0.25}
                px={1}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <Grid
                  container
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={2}>
                    <MDTypography variant="h6" color="white">
                      Tube Counting Report
                    </MDTypography>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={1}>
                    {/* <Tooltip title="Save Plan">
                                                      <IconButton color="white">
                                                          <SaveIcon />
                                                      </IconButton>
                                                  </Tooltip> */}
                    <Tooltip title="Download">
                      <IconButton
                        color="white"
                        onClick={() => downloadExcelcustomerTableData()}
                      >
                        <DownloadForOfflineIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>

              <MDBox px={3} py={2}>
                <Grid
                  container
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                ></Grid>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <div id="reportTable" />
                    <br />
                    <p
                      color="black"
                      style={{
                        color: "black",
                        paddingLeft: "1rem",
                        marginTop: "-1rem",
                      }}
                    >
                      Showing 1 to {reportData.length} of{" "}
                      {reportData.length} entries
                    </p>
                  </Grid>
                  <Grid container spacing={3}></Grid>
                </Grid>
              </MDBox>
            </Card>
          )}
        </>
      )}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Image Preview
          <IconButton
            onClick={() => setPreviewOpen(false)}
            style={{ position: "absolute", right: 10, top: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {previewImage && (
            <>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "16px",
                }}
              />

              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                sx={{
                  backgroundColor: "#f5f5f5",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                <Typography variant="body1">
                  <strong>Batch ID:</strong> {previewMeta.BATCHID || "N/A"}
                </Typography>

                <Typography variant="body1">
                  <strong>Size:</strong> {previewMeta.SIZE1 || "N/A"}
                </Typography>

                <Typography variant="body1">
                  <strong>Date:</strong> {previewMeta.CRTDT || "N/A"}
                </Typography>

                <Typography variant="body1">
                  <strong>Shift:</strong> {previewMeta.SHIFT || "N/A"}
                </Typography>

                {previewMeta.NO_PCS_CR > 0 && (
                  <Typography variant="body1">
                    <strong>Tube Count Circular:</strong> {previewMeta.NO_PCS_CR}
                  </Typography>
                )}

                {previewMeta.NO_PCS_SQ > 0 && (
                  <Typography variant="body1">
                    <strong>Tube Count Square:</strong> {previewMeta.NO_PCS_SQ}
                  </Typography>
                )}
                <Typography variant="body1">
                  <strong>Counted By:</strong> {previewMeta.CRTBY || "N/A"}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>

        {/* ✅ NEW DOWNLOAD BUTTON */}
        <DialogActions>
          <MDButton
            variant="gradient"
            color="success"
            onClick={handleDownloadPreview}
            startIcon={<DownloadForOfflineIcon />}
            disabled={!previewImage}
          >
            Download JPEG
          </MDButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          width: "100%",
          left: 0,
          right: 0,
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}
