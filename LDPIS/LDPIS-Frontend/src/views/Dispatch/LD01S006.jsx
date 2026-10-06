// A. Frontend
import React, { useEffect, useState, useRef, forwardRef } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import SearchIcon from "@mui/icons-material/Search";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import { GetAuthorization } from "../../utils";
import "../../tabulatorCss.scss";
import MDAlert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import BrandingWatermarkIcon from '@mui/icons-material/BrandingWatermark';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
// Import Material-UI Dialog components
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import MonthPicker from "components/DateTime/MonthPicker"; // Removed this import

// Import for DatePicker (changed from DateTimePicker)
import { DatePicker } from '@mui/x-date-pickers/DatePicker'; // Changed from DateTimePicker to DatePicker
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';


export default function LD01S006() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [materialNo, setMaterialNo] = useState([]);
  const [castNoList, setCastNoList] = useState([]);
  const [selectedCastNo, setSelectedCastNo] = useState([]);
  const [selectedMaterialNo, setSelectedMaterialNo] = useState([]);
  const [finalMergedQnty, setFinalMergedQnty] = useState(0);
  const [finalMergedPcs, setFinalMergedPcs] = useState(0);
  const [totalActualQnty, setTotalActualQnty] = useState(0);
  const [totalActualPcs, setTotalActualPcs] = useState(0);
  const [upType, setUpType] = useState([]);
  const [selectedUpType, setSelectedUpType] = useState([]);
  const [status, setStatus] = useState([]);
  // Add this with other useState declarations near the top
const [showUnmergeConfirmDialog, setShowUnmergeConfirmDialog] = useState(false);


  var mergedQnty = 0,
    mergedPcs = 0;

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [targetMatNoList, setTargetMatNoList] = useState([]);
  const [momWidthOdia, setMomWidthOdia] = useState([]);

  const [pageAuth, setPageAuth] = useState(0);

  var customerTable = React.createRef();

  const [statusMerging, setStatusMerging] = useState([]);
  const [selectedStatusMerging, setSelectedStatusMerging] = useState([]);

  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [plantInv, setPlantInv] = useState([]);
  const [valueRadio, setValueRadio] = React.useState("M");
  const [selectedPlantInv, setSelectedPlantInv] = useState("");
  const [statusOp, setStatusOp] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  // Changed initial state to null, will be set after statusOp is loaded
  const [selectedStatusInv, setSelectedStatusInv] = useState(null);

  // New states for Pallet Inventory date filters
  const [fromDateInv, setFromDateInv] = useState(null);
  const [toDateInv, setToDateInv] = useState(null);

  const prodType = [
    { value: "BARE", label: "BARE - Bare", id: 1 },
    { value: "EC", label: "EC - External Coating", id: 2 },
    { value: "IC", label: "IC - Internal Coating", id: 1 },
    {
      value: "ECIC",
      label: "ECIC - External Coating with Internal Coating",
      id: 1,
    },
  ];
  const [selectedProdType, setSelectedProdType] = useState("");
  const [palletTableData, setPalletTableData] = useState([]);
  const [palletTable, setPalletTable] = useState(null); // Initialize as null
  const [palletInvTableData, setPalletInvTableData] = useState([]);
  const [palletInvTable, setPalletInvTable] = useState(null); // Initialize as null
  const [selectedPlantMerging, setSelectedPlantMerging] = useState({});
  const [mergingTableData, setMergingTableData] = useState([]);
  const [selectedMergingTableData, setSelectedMergingTableData] = useState([]);

  const [uploadedExcelColumnData, setUploadedExcelColumnData] = useState([]);
  const fileInputRef = useRef(null);
  // New state for the modal
  const [showModal, setShowModal] = useState(false);
  // const [modalInputValue, setModalInputValue] = useState('');
  const [modalInputValue, setModalInputValue] = useState("KPMP"); // Default value
  // New state for the dynamically fetched initial pallet ID prefix
  const [initialPalletPrefix, setInitialPalletPrefix] = useState("KPMP"); // Default to KPMP


  // const handleExcelUpload = (event) => {
  //   debugger
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       try {
  //         const data = new Uint8Array(e.target.result);
  //         const workbook = XLSX.read(data, { type: "array" });
  //         const sheetName = workbook.SheetNames[0];
  //         const worksheet = XLSX.Sheets[sheetName];
  //         const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  //         if (json.length > 0 && Array.isArray(json[0])) {
  //           // Filter out undefined, null, and empty string values
  //           const columnData = json.map(row => row[0]).filter(value => value !== undefined && value !== null && String(value).trim() !== '');
  //           setUploadedExcelColumnData(columnData);
  //           alertify.success(`Successfully uploaded ${columnData.length} items from Excel.`);
  //           console.log("Uploaded Excel Data:", columnData);
  //         } else {
  //           alertify.error("No valid data found in the Excel file or incorrect format. Please ensure it's a single column with no header.");
  //           setUploadedExcelColumnData([]);
  //         }
  //       } catch (error) {
  //         alertify.error("Error reading Excel file: " + error.message);
  //         console.error("Error reading Excel file:", error);
  //         setUploadedExcelColumnData([]);
  //       }
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };

  const handleExcelUpload = (event) => {
  const file = event.target.files[0];

  if (!file) {
    alertify.error("No file selected");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = e.target.result;

      //  Read workbook properly
      const workbook = XLSX.read(data, { type: "array" });

      //  Validate sheet names
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error("No sheets found in the Excel file.");
      }

      const sheetName = workbook.SheetNames[0];

      if (!workbook.Sheets[sheetName]) {
        throw new Error(`Sheet '${sheetName}' not found.`);
      }

      const worksheet = workbook.Sheets[sheetName];

      //  Convert to JSON safely
      const json = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "", // prevents undefined errors
      });

      if (!json || json.length === 0) {
        throw new Error("Excel sheet is empty.");
      }

      //  Extract first column (Batch IDs)
      const columnData = json
        .map((row) => row[0])
        .filter(
          (value) =>
            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""
        )
        .map((value) => String(value).trim()); // normalize

      if (columnData.length === 0) {
        throw new Error("No valid Batch IDs found in first column.");
      }

      setUploadedExcelColumnData(columnData);

      alertify.success(
        `Successfully uploaded ${columnData.length} items from Excel.`
      );

      console.log("Uploaded Excel Data:", columnData);
    } catch (error) {
      console.error("Excel Upload Error:", error);
      alertify.error("Error reading Excel file: " + error.message);
      setUploadedExcelColumnData([]);
    }
  };

  reader.onerror = () => {
    alertify.error("Failed to read file.");
  };

  reader.readAsArrayBuffer(file);
};

   const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    setPalletTableData([,]); 
    setPalletTable(null); 

    console.log("hello153")
  };

const handleFilterByExcelData = () => {
  if (uploadedExcelColumnData.length === 0) {
    alertify.error("Please upload an Excel file with Batch IDs first.");
    return;
  }

  if (palletTableData.length === 0) {
    alertify.warning("No data in the pallet table to filter.");
    setUploadedExcelColumnData([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  //  normalize for safe compare
  const excelSet = new Set(
    uploadedExcelColumnData.map((v) => String(v).trim().toUpperCase())
  );

  const filteredData = palletTableData.filter((row) =>
    excelSet.has(String(row.ID_BATCH).trim().toUpperCase())
  );

  if (filteredData.length > 0) {
    setPalletTableData(filteredData);
    alertify.success(
      `Filtered ${palletTableData.length - filteredData.length} rows. Showing ${filteredData.length}`
    );
  } else {
    setPalletTableData([]);
    alertify.warning("No matching batch IDs found.");
  }

  // clear
  setUploadedExcelColumnData([]);
  if (fileInputRef.current) fileInputRef.current.value = "";
};


  // --- REVISED INITIAL DATA FETCHING LOGIC ---
  function fetchData() {
    setLoading(true); // <--- IMPORTANT: Set loading to true IMMEDIATELY when fetch starts

    GetAuthorization()
      .then(async (token) => {
        if (serverDetails.devMode) {
          setRestricted(false);
        }

        // Validate user first. If validation fails, it will reject and be caught below.
        await validateUser(token);

        // Fetch other initial data in parallel
        // getGroupPlantId now resolves with the initialSelectedPlant
        const [plantResponse, pageAuthResponse, initialPalletIdResponse] = await Promise.all([
          getGroupPlantId(token.accessToken),
          getPageAuth(token.accessToken),
          getInitialpalletID(token.accessToken), // Call the new API for initial pallet ID
        ]);

        // After getGroupPlantId resolves and updates `selectedPlant`, `getMergingStatusList` can use it.
        // We ensure getMergingStatusList is called after the plant data is ready.
        if (plantResponse && plantResponse.selectedPlant) {
            const fetchedStatusOptions = await getMergingStatusList(plantResponse.selectedPlant, token.accessToken);
            if(fetchedStatusOptions.length > 0) {
                setSelectedStatus(fetchedStatusOptions[0]); // Set default status for creation tab
                setSelectedStatusInv(fetchedStatusOptions[0]); // Set default status for inventory tab
            }
        }

        // Set the initial pallet prefix from the API response
        if (initialPalletIdResponse && initialPalletIdResponse.length > 0) {
          setInitialPalletPrefix(initialPalletIdResponse[0].CD_VALUE);
        }

      })
      .catch((error) => {
        console.error("Error during page initialization:", error);
        alertify.error("Failed to load page data. Please check your authorization and network connection.");
        setRestricted(true); // Ensure restricted state is set on any initial fetch error
        // Optionally, redirect to signin if GetAuthorization fails fundamentally
        if (error?.message?.includes("Authorization failed") || error?.message?.includes("JWT verification failed")) { 
          if (serverDetails.devMode === false) {
             window.location.href = "#/signin";
          }
        }
      })
      .finally(() => {
        setLoading(false); // <--- IMPORTANT: ALWAYS hide preloader when all promises are settled
      });
  }

  // --- useEffect to trigger initial data fetch ---
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array ensures it runs only once on component mount

  // --- REVISED PROMISE FUNCTIONS TO ENSURE PROPER REJECT/RESOLVE ---

  const validateUser = async (token) => {
    try {
      var plant = "";
      var userDetails = jwt.verify(
        token.refreshToken,
        serverDetails.REFRESH_KEY
      );

      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        throw new Error("Personal number not found in token."); // Throw error to reject promise
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LD01S006";

      // Await getScreenAuth, if it rejects, this try-catch will catch it.
      const authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML === "Z") { // Strict equality
          setRestricted(true);
          setAdmin(false);
          alertify.error("You are authorized only to view this page."); // More specific message
          throw new Error("View-only authorization."); // Propagate specific error
        } else if (authDetails.payload.PS_AUTH_DML === "Y") { // Strict equality
          setAdmin(true);

          if (authDetails.payload.LS_READ_WRITE_FLAG === "RL_RW") { // Strict equality
            setReadWriteAccess(false);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page"
            );
            // Even if DML is 'Y', if not RL_RW, changes are restricted.
            // This might not be a full rejection of validation, but an info state.
            // Depending on desired strictness, could throw error here too.
          }
        } else {
          // If authDetails exist but DML is neither Y nor Z, it's still restricted access
          setRestricted(true);
          setAdmin(false);
          alertify.error(
            "You are not authorized to view or make changes from this page"
          );
          throw new Error("Unauthorized access level."); // Propagate error
        }
      } else {
        setRestricted(true);
        setAdmin(false);
        alertify.error("Authorization details not found.");
        throw new Error("Authorization details not found."); // Propagate error
      }
    } catch (error) {
      console.error("Validation error:", error);
      setRestricted(true);
      setAdmin(false);
      // Only redirect if not in dev mode and it's a critical auth failure
      if (serverDetails.devMode === false && !error.message.includes("Personal number not found")) {
        window.location.href = "#/signin";
      }
      throw error; // Re-throw to propagate the rejection to fetchData's catch
    }

    if (serverDetails.devMode === true) { // Strict equality
      setRestricted(false);
      setAdmin(true);
      // Ensure read/write access is true by default in dev mode for testing
      setReadWriteAccess(false); 
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

      if (serverDetails.devMode === true) { // Strict equality
        //(userId = "198447"), (pageName = "TSMCPPF001"); // Dev mode override can be handled here if needed
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") { // Strict equality
          reject(new Error("API error for screenAuth: " + response.statusText));
        } else {
          var encryptUserInfo = response.data;
          try {
            var authDetails = jwt.verify(
              encryptUserInfo,
              serverDetails.SCREEN_AUTH_KEY
            );
            resolve(authDetails);
          } catch (jwtError) {
            reject(new Error("JWT verification failed for screenAuth: " + jwtError.message));
          }
        }
      }).catch((error) => {
        console.error("Network or API call error for screenAuth:", error);
        reject(error); // Propagate network/API call errors
      });
    });

  const getMergingStatusList = (value, accessToken) => {
    return new Promise((resolve, reject) => { // Added reject
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LD01S006/getMergingStatus";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") { // Strict equality
            reject(new Error("Failed to fetch merging status: " + response.statusText));
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[0];
              items.push(obj);
            });
            setStatusOp(items);
            resolve(items); // Resolve with the items array
          }
        })
        .catch((error) => {
          console.error("Error in getMergingStatusList:", error);
          reject(error); // Propagate network/API call errors
        });
    });
  };

  const getPageAuth = (accessToken) => { // This is for `api/LDSM048/getauth`
    return new Promise((resolve, reject) => { // Added reject
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        pno: serverDetails.PersonalNo,
      };
      var url = "api/LDSM048/getauth";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") { // Strict equality
            reject(new Error("Failed to fetch page authorization from LDSM048: " + response.statusText));
          } else {
            setPageAuth(response.data);
            resolve(response.data); // Resolve with the data
          }
        })
        .catch((error) => {
          console.error("Error in getPageAuth (LDSM048):", error);
          reject(error); // Propagate network/API call errors
        });
    });
  };

  const getGroupPlantId = (accessToken) => {
    return new Promise((resolve, reject) => { // Added reject
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
          if (response.statusText !== "" && response.statusText !== "OK") { // Strict equality
            reject(new Error("Failed to fetch group plant ID: " + response.statusText));
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[1];
              items.push(obj);
            });
            setPlant(items);
            setPlantInv(items);
            let initialSelectedPlant = null;
            if (items.length > 0) {
              serverDetails.Plant = items[0].value;
              setSelectedPlant(items[0]);
              setSelectedPlantInv(items[0]);
              initialSelectedPlant = items[0];
            }
            // Resolve with the selected plant to allow chaining for getMergingStatusList
            resolve({ selectedPlant: initialSelectedPlant, items: items }); 
          }
        })
        .catch((error) => {
          console.error("Error in getGroupPlantId:", error);
          reject(error); // Propagate network/API call errors
        });
    });
  };

  // New API call function for getInitialpalletID
  const getInitialpalletID = (accessToken) => {
    return new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LD01S006/getInitialpalletID";
      axiosAPI
        .post(url, {}, defaultOptions) // No data needed for this API call
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            reject(new Error("Failed to fetch initial pallet ID: " + response.statusText));
          } else {
            resolve(response.data);
          }
        })
        .catch((error) => {
          console.error("Error in getInitialpalletID:", error);
          reject(error);
        });
    });
  };


  const handlePlantChange = (e) => {
    setSelectedPlant(e);
    setPalletTableData([]); // Use empty array, not [, ]
    setPalletTable(null); // Destroy old Tabulator instance
  };

  const handlePlantChangeInv = (e) => {
    setSelectedPlantInv(e);
    setPalletInvTableData([]); // Use empty array, not [, ]
    setPalletInvTable(null); // Destroy old Tabulator instance
  };

  const handleSubmitBtn = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      // Pass uploadedExcelColumnData to getPalletData if relevant for filtering/querying
      Promise.all([getPalletData(token.accessToken, uploadedExcelColumnData)])
        .catch((error) => {
          console.error("Error in handleSubmitBtn:", error);
          alertify.error("Failed to fetch pallet data: " + (error.message || "Unknown error"));
        })
        .finally(() => {
          setLoading(false);
      });
    }).catch(authError => {
        console.error("Authorization error for handleSubmitBtn:", authError);
        alertify.error("Authorization failed. Please log in again.");
        setLoading(false);
    });
  };

  const getPalletData = (accessToken, uploadedBatchIds = []) => { // Accept uploadedBatchIds
    return new Promise((resolve, reject) => { // Added reject
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      if (!selectedPlant || selectedPlant === null) {
        alertify.error("Please select plant");
        resolve(); // Resolve to prevent the main loading from getting stuck
        return;
      }

      if (!selectedStatus || selectedStatus === null) {
        alertify.error("Please select Status");
        resolve(); // Resolve to prevent the main loading from getting stuck
        return;
      }

      var data = {
        plant: selectedPlant?.value,
        status: selectedStatus?.value,
        prodType: selectedProdType?.value,
        action:valueRadio,
        // Conditionally send uploadedBatchIds if the array is not empty
        uploadedBatchIds: uploadedBatchIds.length > 0 ? uploadedBatchIds : undefined, 
      };

      var url = "api/LD01S006/getPalletData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") { // Strict equality
            alertify.error("Error fetching pallet data!"); 
            setPalletTableData([]); 
            reject(new Error("API error for getPalletData: " + response.statusText)); // Reject
          } else {
            if (!response.data || response.data.length === 0) { // Check for empty or null data
              alertify.error("No Data Found");
              setPalletTableData([,]); // Changed to empty array for consistency
            } else {
              setPalletTableData(response.data);
            }
            resolve(); // Resolve on success
          }
        })
        .catch((error) => {
            console.error("Error in getPalletData:", error);
            alertify.error("Failed to fetch pallet data: " + (error.message || "Network error"));
            setPalletTableData([]);
            reject(error); // Reject on network or other errors
        });
    });
  };

  const handleSubmitBtnInv = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getPalletInvData(token.accessToken, fromDateInv, toDateInv)]) // Pass date filters
        .catch((error) => {
            console.error("Error in handleSubmitBtnInv:", error);
            alertify.error("Failed to fetch pallet inventory data: " + (error.message || "Unknown error"));
        })
        .finally(() => {
          setLoading(false);
      });
    }).catch(authError => {
        console.error("Authorization error for handleSubmitBtnInv:", authError);
        alertify.error("Authorization failed. Please log in again.");
        setLoading(false);
    });
  };

  const getPalletInvData = (accessToken, fromDate = null, toDate = null) => { // Added fromDate, toDate
    return new Promise((resolve, reject) => { // Added reject
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      if (!selectedPlantInv || selectedPlantInv === null) {
        alertify.error("Please select plant");
        resolve(); // Resolve to prevent stuck loading
        return;
      }

      if (!selectedStatusInv || selectedStatusInv === null) {
        alertify.error("Please select Status");
        resolve(); // Resolve to prevent stuck loading
        return;
      }

      // Date validation
      if (fromDate && toDate && moment(fromDate).isAfter(moment(toDate))) {
        alertify.error("From Date cannot be greater than To Date.");
        resolve();
        return;
      }


      var data = {
        plant: selectedPlantInv?.value,
        status: selectedStatusInv?.value,
        // Format dates to 'DD-MM-YYYY' for the backend (date only, no time)
        // fromDate: fromDate ? moment(fromDate).format('DD-MM-YYYY') : null,
        // toDate: toDate ? moment(toDate).format('DD-MM-YYYY') : null,
        fromDate: fromDate
          ? fromDate
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep")
          : "",
        toDate: toDate
          ? toDate
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep")
          : "",
      };

      var url = "api/LD01S006/getPalletInvData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") { // Strict equality
            alertify.error("Error fetching pallet inventory data!");
            setPalletInvTableData([]);
            reject(new Error("API error for getPalletInvData: " + response.statusText)); // Reject
          } else {
            if (!response.data || response.data.length === 0) { // Check for empty or null data
              alertify.error("No Data Found");
              setPalletInvTableData([]);
            } else {
              setPalletInvTableData(response.data);
            }
            resolve(); // Resolve on success
          }
        })
        .catch((error) => {
            console.error("Error in getPalletInvData:", error);
            alertify.error("Failed to fetch pallet inventory data: " + (error.message || "Network error"));
            setPalletInvTableData([]);
            reject(error); // Reject on network or other errors
        });
    });
  };

  // Modified handlepopup to open the modal
  const handlepopup = () => {
    var selectedRows = palletTable?.getSelectedRows();
    var isUnmerge = String(valueRadio).toUpperCase() === "U";
    if (!isUnmerge) {
      if (selectedRows.length < 2) {
        alertify.error("Please select more then one row!");
        return;
      }};;
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setModalInputValue(initialPalletPrefix); // Clear input when closing
  };

  const handleSaveModalData = () => {
    // debugger
  //  alertify.error("Clicked");
   console.log(modalInputValue);

    if (!modalInputValue.trim()) {
      alertify.error("Please enter Pallet ID");
      return;
    }

    if (modalInputValue.length !== 10) {
      alertify.error("Pallet ID must be 10 characters long.");
      return;
    }

    const alphanumericRegex = /^[A-Z0-9]+$/;
    if (!alphanumericRegex.test(modalInputValue)) {
        alertify.error("Pallet ID must contain only Uppercase alphanumeric characters");
        return;
    }
    // New validation for prefixes: initialPalletPrefix, KPMP, or KPAP
    const startsWithInitial = modalInputValue.startsWith(initialPalletPrefix);
    const startsWithKPMP = modalInputValue.startsWith("KPMP");
    const startsWithKPAP = modalInputValue.startsWith("KPAP");

    if (!startsWithInitial && !startsWithKPMP && !startsWithKPAP) {
      alertify.error(`Pallet ID must start with ${initialPalletPrefix}, KPMP, or KPAP.`);
      return;
    }


    setLoading(true);
    GetAuthorization()
      .then((token) => {
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        const data = {
          PELLETID: modalInputValue, // Data from the text box
          plant: selectedPlant?.value, // Example: include selected plant
        };
        const url = "api/LD01S006/getcheckMergebatch"; // Placeholder API endpoint

        axiosAPI
          .post(url, data, defaultOptions)
          .then((res) => {
            console.log(res);
            console.log(res.data);
            if (res.statusText !== "" && res.statusText !== "OK") {
              alertify.error("Error saving modal data: " + res.statusText);
            } else {
              if (res.data && res.data.length > 0 && res.data[0].CNT === 0) {
                // alertify.success("Data saved successfully!");
                handleCloseModal(); // Close modal on success
                saveData(modalInputValue); // Call saveData with the modal input value
              } else if (res.data && res.data.length > 0 && res.data[0].CNT === 1){
                alertify.error("Enter Different Pellet ID " + modalInputValue + " already Available.");
              } else {
                 alertify.error("Failed to save data: " + (res.data?.message || "Unknown error"));
              }
            }
          })
          .catch((error) => {
            console.error("Error saving modal data:", error);
            alertify.error("Failed to save modal data: " + (error.message || "Network error"));
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((authError) => {
        console.error("Authorization error for saving modal data:", authError);
        alertify.error("Authorization failed. Please log in again.");
        setLoading(false);
      });
  };

  const saveData = (palletIdFromModal = null) => {
  setShowSaveMsgSuccess(false);
  setShowSaveMsgError(false);
  setSaveMsg("");
  var selectedRows = palletTable?.getSelectedRows();

  // Check if it's an unmerge operation
  var isUnmerge = String(valueRadio).toUpperCase() === "U";

  // **NEW: Validation for Unmerge - Only ONE row should be selected**
  if (isUnmerge) {
    if (!selectedRows || selectedRows.length === 0) {
      alertify.error("Please select a pallet to unmerge!");
      return;
    }
    if (selectedRows.length > 1) {
      alertify.error("Unmerge can only be done for ONE pallet at a time. Please select only one row.");
      return;
    }
    // **NEW: Show confirmation dialog before proceeding with unmerge**
    setShowUnmergeConfirmDialog(true);
    return; // Stop here, actual unmerge will be called from confirmation dialog
  }

  // For Merge operation, continue with existing validation
  if (!isUnmerge) {
    if (selectedRows.length < 2) {
      alertify.error("Please select more than one row!");
      return;
    }
    let MutiRowDataSelectorConst = true;

    let selectedRowVar = {
      MAT_NO: selectedRows[0]._row.data.MAT_NO,
      CAST_NO: selectedRows[0]._row.data.CAST_NO,
      THICK: selectedRows[0]._row.data.THICK,
      ODIA: selectedRows[0]._row.data.ODIA,
      ITEM: selectedRows[0]._row.data.ITEM,
      ORDER: selectedRows[0]._row.data.ORDER_ID,
    };
    selectedRows.forEach(function (item) {
      if (selectedRowVar.MAT_NO !== item._row.data.MAT_NO) {
        MutiRowDataSelectorConst = false;
      }

      if (selectedStatus?.value === "WB") {
        if (
          selectedRowVar.ITEM !== item._row.data.ITEM ||
          selectedRowVar.ORDER !== item._row.data.ORDER_ID
        ) {
          MutiRowDataSelectorConst = false;
        }
      }
    });
    if (!MutiRowDataSelectorConst) {
      let msg =
        "Selected Material No for WF or Order No, Item for WB should be same!";
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(true);
      setSaveMsg(msg);
      alertify.error(msg);
      return;
    }
  }

  // Proceed with actual save/merge operation (unmerge is now handled via confirmation)
  performSaveOperation(palletIdFromModal, isUnmerge);
};

const performSaveOperation = (palletIdFromModal = null, isUnmerge = false) => {
  var selectedRows = palletTable?.getSelectedRows();
  var selectedData = [];

  selectedRows.forEach(function (item) {
    if (isUnmerge) {
      selectedData.push({
        batchId: item._row.data.ERD_ID_NEW_BATCH,
      });
    } else {
      selectedData.push({
        batchId: item._row.data.ID_BATCH,
        netWt: item._row.data.PIECE_ACTL,
        matNo: item._row.data.MAT_NO,
        prodType: item._row.data.PROD_TYPE,
      });
    }
  });

  setLoading(true);
  GetAuthorization()
    .then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        selectedData: selectedData,
        user: serverDetails.PersonalNo,
        ...(valueRadio.toUpperCase() === "M" && palletIdFromModal && { PELLETID: palletIdFromModal }),
      };

      // Choose URL based on operation type
      var url = isUnmerge
        ? "api/LD01S006/savePalletUnmerge"
        : "api/LD01S006/savePalletData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText !== "" && res.statusText !== "OK") {
            alertify.error("Error saving data!");
          } else {
            const ok = res?.data?.result?.substr(0, 1) === "Y";
            const mergeIdText = res?.data?.mergeId ? " with ID: " + res.data.mergeId : "";
            if (ok) {
              if (isUnmerge) {
                alertify.success("Pallet Unmerge successful" + mergeIdText);
                setSaveMsg("Pallet Unmerge successful" + mergeIdText);
              } else {
                alertify.success("Pallet Creation successful" + mergeIdText);
                setSaveMsg("Pallet Creation successful" + mergeIdText);
              }
              handleSubmitBtn(); // Refresh data after save/unmerge
              setShowSaveMsgSuccess(true);
              setShowSaveMsgError(false);
            } else {
              const errMsg = (res?.data?.result || "Operation failed") + (res?.data?.mergeId ? " " + res.data.mergeId : "");
              if (isUnmerge) {
                alertify.error("Pallet Unmerge failed: " + errMsg);
                setSaveMsg("Pallet Unmerge failed: " + errMsg);
              } else {
                alertify.error(errMsg);
                setSaveMsg(errMsg);
              }
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
            }
          }
        })
        .catch((error) => {
          console.error("Error saving pallet data:", error);
          alertify.error("Failed to save data: " + (error.message || "Network error"));
          setShowSaveMsgSuccess(false);
          setShowSaveMsgError(true);
          setSaveMsg("Failed to save data: " + (error.message || "Network error"));
        })
        .finally(() => {
          setLoading(false);
        });
    })
    .catch((authError) => {
      console.error("Authorization error for saveData:", authError);
      alertify.error("Authorization failed. Please log in again.");
      setLoading(false);
    });
};



  useEffect(() => {
    // This effect runs whenever palletTableData, palletInvTableData, or tabValue changes
    if (tabValue === 0) { // Strict equality
      // Destroy existing table if it exists before creating a new one
      if (palletTable) {
        palletTable.destroy();
        setPalletTable(null); // Clear ref
      }
      if (palletTableData && palletTableData.length > 0) {
        setPalletTable(
          new Tabulator("#palletTable", {
            data: palletTableData,
            columns: valueRadio=== "U" ? palletInvColUnmerge : palletCol,
            height: 400,
            layout: "fitDataFill",
          })
        );
      }
    } else if (tabValue === 1) { // Strict equality
      // Destroy existing table if it exists before creating a new one
      if (palletInvTable) {
        palletInvTable.destroy();
        setPalletInvTable(null); // Clear ref
      }
      if (palletInvTableData && palletInvTableData.length > 0) {
        setPalletInvTable(
          new Tabulator("#palletInvTable", {
            data: palletInvTableData,
            columns: palletInvCol,
            height: 400,
            layout: "fitDataFill",
            pagination: true,
            paginationSize: 10,
            paginationSizeSelector: [10, 20, 30, 40],
            paginationCounter: "rows",
          })
        );
      }
    }
    // Cleanup function for useEffect
    return () => {
      if (palletTable) {
        palletTable.destroy();
        setPalletTable(null);
      }
      if (palletInvTable) {
        palletInvTable.destroy();
        setPalletInvTable(null);
      }
    };
  }, [palletTableData, palletInvTableData, tabValue, valueRadio]); // Added valueRadio to dependencies for column change

  const palletCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
      //   width: "2%",
    },
    {
      title: "Creation Date",
      field: "CREATION_TS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch ID",
      field: "ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mat no",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No.",
      field: "CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "ORDER_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt",
      field: "PIECE_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Proc",
      field: "PREV_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Curr Proc",
      field: "CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Planned proc",
      field: "PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
        {
      title: "Final Rem 1 (80)",
      field: "FINAL_RMK_1_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
            {
      title: "Final Rem 2 (80)",
      field: "FINAL_RMK_2_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Aim",
      field: "QLTY_AIM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Yard",
      field: "YARD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hold Flag",
      field: "FL_HOLD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Gross Wt",
      field: "GROSS_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Gross Wt",
      field: "GROSS_CAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },

    {
      title: "Piece cal",
      field: "PIECE_CAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Shift code",
      field: "SHIFT_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Parent Batch",
      field: "PAR_COIL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "FIRST_PAR_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed Proc",
      field: "PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Coil create ts",
      field: "COIL_CREATE_TS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Rec create ts",
      field: "REC_CREATE_TS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "TDC",
      field: "TDC_AIM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Tdc actl",
      field: "TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Oil type",
      field: "OIL_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "No pieces",
      field: "NO_PIECES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "EPA_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Pack code",
      field: "PACK_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Merge batch",
      field: "MERGE_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Mill no",
      field: "MILL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Prod Type",
      field: "PROD_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const palletInvCol = [
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Id",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Pallet Batch Id",
      field: "PALLET_BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Qty",
      field: "BATCH_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Pallet Batch Qty",
      field: "PALLET_BATCH_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Max Wt",
      field: "MAXWT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Send SAP",
      field: "SEND_SAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Rec Crt Dt",
      field: "REC_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rec Crt Id",
      field: "REC_CRT_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "No Pcs",
      field: "NO_PCS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "New Material No",
      field: "NEW_MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Mov Ind",
      field: "MOV_IND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "No  Inv",
      field: "NO_INV",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "No Delv",
      field: "DELV_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Prog Id",
      field: "PROG_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Rec Status",
      field: "REC_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Upd Dt",
      field: "UPD_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Upd By",
      field: "UPD_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];
  const palletInvColUnmerge = [
  {
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    hozAlign: "center",
    download: false,
    headerSort: false,
    frozen: true,
    //   width: "2%",
  },
  {
    title: "New Batch ID",
    field: "ERD_ID_NEW_BATCH",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Plant Code",
    field: "ERD_CD_EPA",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Status",
    field: "ERD_CD_STATUS",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Batch Quantity",
    field: "ERD_BATCH_QTY",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "New Batch Quantity",
    field: "ERD_NEW_BATCH_QTY",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Material Number",
    field: "ERD_NO_MATNR",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Max Weight Flag",
    field: "ERD_FLG_MAXWT",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Send to SAP Flag",
    field: "ERD_FLG_SEND_SAP",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Record Creation Date",
    field: "ERD_REC_CRT_DT",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Record Creation User ID",
    field: "ERD_REC_CRT_UID",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
];


  const downloadExcelPalletTableData = () => {
    var date = new Date();
    var fileName = "Pallet Creation Data " + date.toString() + ".xlsx";
    palletTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = () => {
    // For Pallet Creation tab (tabValue 0)
    setSelectedPlant("");
    setSelectedStatus("");
    setSelectedProdType("");
    setPalletTableData([]);
    setPalletTable(null);
    setUploadedExcelColumnData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // For Pallet Inventory tab (tabValue 1)
    setSelectedPlantInv("");
    setSelectedStatusInv(null);
    setFromDateInv(null); // Clear from date
    setToDateInv(null); // Clear to date
    setPalletInvTableData([]);
    setPalletInvTable(null);

    // General messages
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Dispatch"
        page="Pallet Creation Screen"
      />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {loading && <Preloader />}
      </Grid>
      {isRestricted && !loading && ( // Only show "not authorized" message if not loading
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
      {isRestricted === false && (
        <>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab
                      label="Pallet Creation"
                      value={0}
                      icon={<CallMergeIcon />}
                    />
                    <Tab
                      label="Pallet Inventory"
                      value={1}
                      icon={<MoveUpIcon />}
                    />
                  </Tabs>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                {tabValue === 0 && (
                  <>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={0.25}
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
                                onClick={handleClearAll}
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>

                      <MDBox px={3} py={3}>
                        <Grid container spacing={2}>
                          <Grid item xs={2.5} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Plant *
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plant}
                              value={selectedPlant}
                              onChange={handlePlantChange}
                            />
                          </Grid>
                          <Grid item xs={1.5} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Status*
                            </MDTypography>
                            <ReactSelect
                              id="status"
                              options={statusOp}
                              value={selectedStatus}
                              onChange={(e) => {
                                setSelectedStatus(e);
                                setPalletTableData([]); 
                                setPalletTable(null);
                              }}
                            />
                          </Grid>
                          <Grid item xs={2.5} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Product Type
                            </MDTypography>
                            <ReactSelect
                              id="prodType"
                              options={prodType}
                              value={selectedProdType}
                              onChange={(e) => {
                                setSelectedProdType(e);
                                setPalletTableData([]); 
                                setPalletTable(null);
                              }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControl style={{ marginLeft: "2rem" }}>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Action
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueRadio}
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="M"
                                  control={<Radio />}
                                  label="Merge"
                                //disabled={!isFirstDayOfMonth} // Disable based on condition
                                />
                                <FormControlLabel
                                  value="U"
                                  control={<Radio />}
                                  label="Unmerge"
                                //disabled={!isFirstDayOfMonth} // Disable based on condition
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={handleSubmitBtn}
                            >
                              Submit
                            </MDButton>
                          </Grid>
                          <Grid item xs={3} style={{ zIndex: 1 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            // sx={{ position: 'absolute', top: '0' }}                       
                               >
                              Upload Batch IDs (Excel)
                            </MDTypography>
                            <MDInput
                              type="file"
                              inputRef={fileInputRef}
                              onChange={handleExcelUpload}
                              accept=".xlsx, .xls"
                              sx={{ width: '100%', marginTop: '0.5rem' }}
                              helperText={
                                uploadedExcelColumnData.length > 0
                                  ? `${uploadedExcelColumnData.length} items loaded.`
                                  : ""
                              }
                              // Helper text style adjustment if needed (can be put in sx if MDInput passes it down)
                              FormHelperTextProps={{
                                sx: {
                                  color: 'text.secondary', // Material-UI default for helper text
                                }
                              }}
                            />
                            </Grid>
                            <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.8rem" }}
                              size="small"
                              color="primary" // You can choose your preferred color
                              onClick={handleFilterByExcelData}
                              disabled={uploadedExcelColumnData.length === 0||valueRadio==="U"} // Disable if no data is uploaded
                            >
                              Filter by Excel
                            </MDButton>
                            </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                    <Grid margin={"2rem"}></Grid>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
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
                              Pallet Data
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}></Grid>
                          <Grid item xs={1}>
                            {valueRadio === "M" && (
                              <Tooltip title="Assign Pallet ID">
                                <IconButton
                                  color="white"
                                  disabled={isReadWriteAccess}
                                  onClick={handlepopup}
                                >
                                  <BrandingWatermarkIcon />
                                </IconButton>
                              </Tooltip>
                            )}

                            {valueRadio === "U" && (
                              <Tooltip title="Save">
                                <IconButton
                                  color="white"
                                  disabled={isReadWriteAccess}
                                  onClick={saveData}
                                >
                                  <SaveIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={downloadExcelPalletTableData}
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
                            <div id="palletTable" />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              <br />
                              Showing 1 to {palletTableData.length} of{" "}
                              {palletTableData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>

                    <Grid margin={"1rem"}></Grid>
                    {showSaveMsgError && (
                      <Grid item xs={12}>
                        <MDAlert
                          color="error"
                          severity="error"
                          variant="filled"
                          onClose={() => {
                            setShowSaveMsgError(false);
                          }}
                        >
                          <MDTypography variant="body2" color="white">
                            <MDTypography
                              variant="body2"
                              fontWeight="medium"
                              color="white"
                            >
                              {saveMsg}
                            </MDTypography>
                          </MDTypography>
                        </MDAlert>
                      </Grid>
                    )}
                    {showSaveMsgSuccess && (
                      <Grid item xs={12}>
                        <MDAlert
                          color="success"
                          variant="filled"
                          onClose={() => {
                            setShowSaveMsgSuccess(false);
                          }}
                        >
                          <MDTypography variant="body2" color="white">
                            <MDTypography
                              variant="body2"
                              fontWeight="medium"
                              color="white"
                              fontSize="lg"
                              textTransform="capitalize"
                            >
                              {saveMsg}
                            </MDTypography>
                          </MDTypography>
                        </MDAlert>
                      </Grid>
                    )}
                  </>
                )}

                {tabValue === 1 && (
                  <>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={0}
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
                                onClick={handleClearAll} // Removed redundant true
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>

                      <MDBox px={3} py={3}>
                        {/* Wrap the date pickers with LocalizationProvider */}
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <Grid container spacing={2}>
                            <Grid item xs={2.5} style={{ zIndex: 5 }}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                Plant *
                              </MDTypography>
                              <ReactSelect
                                id="plantInv"
                                options={plantInv}
                                value={selectedPlantInv}
                                onChange={handlePlantChangeInv}
                              />
                            </Grid>
                            <Grid item xs={1.5}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                Status
                              </MDTypography>
                              <ReactSelect
                                id="status"
                                options={statusOp}
                                value={selectedStatusInv}
                                onChange={(e) => {
                                  setSelectedStatusInv(e);
                                  setPalletInvTableData([]);
                                  setPalletInvTable(null);
                                }}
                              />
                            </Grid>
                            {/* New Date Filters for Pallet Inventory */}
                            <Grid item xs={1.5}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                From Date
                              </MDTypography>
                              {/* Removed empty MDTypography */}
                              <DatePicker
                                value={fromDateInv}
                                onChange={(newValue) => setFromDateInv(newValue ? newValue.toDate() : null)}
                                renderInput={(params) => <MDInput {...params} fullWidth />}
                                inputFormat="DD-MM-YYYY"
                              />
                            </Grid>
                            <Grid item xs={1.5}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                To Date
                              </MDTypography>
                              {/* Removed empty MDTypography */}
                              <DatePicker
                                value={toDateInv}
                                onChange={(newValue) => setToDateInv(newValue ? newValue.toDate() : null)}
                                renderInput={(params) => <MDInput {...params} fullWidth />}
                                inputFormat="DD-MM-YYYY"
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <MDButton
                                style={{ marginTop: "1.5rem" }}
                                size="small"
                                color="info"
                                onClick={handleSubmitBtnInv}
                              >
                                Submit
                              </MDButton>
                            </Grid>
                          </Grid>
                        </LocalizationProvider> {/* Closing LocalizationProvider */}
                      </MDBox>
                    </Card>
                    <Grid margin={"2rem"}></Grid>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={0.5}
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
                              Pallet Inventory
                            </MDTypography>
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
                            <div id="palletInvTable" />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              <br />
                              Showing 1 to {palletInvTableData.length} of{" "}
                              {palletInvTableData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>     )}

      {/* The Modal Component */}
<Dialog open={showModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Enter Pallet ID
    <IconButton aria-label="close" onClick={handleCloseModal} sx={{ color: 'error.main' }}>
      <DisabledByDefaultRoundedIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent>

<TextField
  autoFocus
  margin="dense"
  id="modal-input"
  label="Pallet ID"
  type="text"
  fullWidth
  variant="outlined"
  value={modalInputValue}
  helperText={`Note: First 4 characters should be ${initialPalletPrefix} or KPAP`} // Dynamic helper text
  onChange={(e) => {
    let inputValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Determine if the input starts with any of the allowed prefixes
    const startsWithInitial = inputValue.startsWith(initialPalletPrefix);
    const startsWithKPAP = inputValue.startsWith("KPAP");

    // If it doesn't start with any of the allowed prefixes, and it's not empty,
    // then prepend the initialPalletPrefix.
    if (inputValue.length > 0 && !startsWithInitial && !startsWithKPAP) {
      inputValue = initialPalletPrefix + inputValue;
    }

    // Keep max 10 characters
    inputValue = inputValue.slice(0, 10);

    setModalInputValue(inputValue);
  }}
/>

  </DialogContent>
  <DialogActions>
    <MDButton
      onClick={handleSaveModalData}
      color="info"
      disabled={isReadWriteAccess || !modalInputValue.trim()}
    >
      Save
    </MDButton>
  </DialogActions>
</Dialog>
    {/* Unmerge Confirmation Dialog */}
<Dialog 
  open={showUnmergeConfirmDialog} 
  onClose={() => setShowUnmergeConfirmDialog(false)} 
  fullWidth 
  maxWidth="sm"
>
  <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    Confirm Unmerge Operation
    <IconButton 
      aria-label="close" 
      onClick={() => setShowUnmergeConfirmDialog(false)} 
      sx={{ color: 'error.main' }}
    >
      <DisabledByDefaultRoundedIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent>
    <MDTypography variant="body1" color="text">
      Are you sure you want to unmerge the selected pallet?
    </MDTypography>
    <MDTypography variant="body2" color="warning" sx={{ mt: 2 }}>
      **Warning:** This action will split the pallet back into its original batches. This operation cannot be undone easily.
    </MDTypography>
  </DialogContent>

  <DialogActions>
    <MDButton
      onClick={() => setShowUnmergeConfirmDialog(false)}
      color="secondary"
    >
      Cancel
    </MDButton>
    <MDButton
      onClick={() => {
        setShowUnmergeConfirmDialog(false);
        performSaveOperation(null, true); // true indicates unmerge operation
      }}
      color="error"
      variant="contained"
    >
      Confirm Unmerge
    </MDButton>
  </DialogActions>
</Dialog>

    </DashboardLayout>
  );
}