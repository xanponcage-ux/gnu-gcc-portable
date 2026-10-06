import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import IconButton from "@mui/material/IconButton";
import { GetAuthorization } from "../../utils";
import routes from "routes"; // Assuming this is your main routes file
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../tabulatorCss.scss"; // Assuming this is a common CSS file
import MDInput from "components/MDInput";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";


// New imports for Tabs
import { AppBar, Tab, Tabs } from "@mui/material";

export default function LDLTS009() {
  const [loading, setLoading] = useState(false);
  const [isRestricted, setRestricted] = useState(true); // Default to restricted
  const [isReadWriteAccess, setReadWriteAccess] = useState(true); // Default to read-only

  // State for expanding/collapsing sections
  const [expandPanelTest, setExpandPanelTest] = useState(true);
  // New state for Viscosity Test section
  const [expandPanelViscosity, setExpandPanelViscosity] = useState(true);
  // Instrument Used section remains common and expanded by default
  const [expandInstrumentUsed, setExpandInstrumentUsed] = useState(true);

  // State for tab navigation
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  // State to hold all form data
  const [salesOrdId, setSalesOrdId] = useState([]);
  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });
  const [formData, setFormData] = useState({
    // Top Filter/Header Section
    RPTNO: "", // RPTNO
    CHARG: "", // CHARG
    PSNO: "", // PSNO
    CREATED_DT: "", // CREATED_DT (YYYY-MM-DD format for input type="date")
    PROD_DT: "", // PROD_DT (YYYY-MM-DD format for input type="date")
    // SHIFT: null, // PSHIFT (ReactSelect {label, value})
    SHIFT: null, // E Shift
    PSHIFT: null, // Shift

    // Panel Test / Porosity Test Section (Existing)
    // Row 1
    TEST_DESC: null, // TEST_DESC
    ACEPT_CRET: "", // ACEPT_CRET
    TEST_RESULT: "", // TEST_RESULT
    REMARK: "", // REMARK

    // Row 2
    CLIENT: null, // CLIENT (Assumed based on table structure)
    FOANO: "", // FOANO
    COAT_TYPE: "", // COAT_TYPE
    PIPE_SIZE: "", // PIPE_SIZE

    // Row 3
    REF_STD: null, // REF_STD (Assumed based on table structure)
    WINO: "", // WINO
    TR2: "", // TR
    REPORTNO: "", // REPORTNO

    // Row 4
    POSNR: null, // POSNR (Assumed based on table structure)
    AC: "", // AC
    TR: "", // TR2
    REM: "", // REM

    // Row 5
    TEST_DESC1: null, // TEST_DESC1 (Mapped from Excel)
    AC3: "", // AC3
    TR3: "", // TR3
    REM1: "", // REM1

    // Viscosity Test Section (NEW FIELDS)
    EPOXYBATCH: "",
    HARDNERBATCH: "",
    MAT_DESC: "",
    MAT_DESC1: "",

    // Viscosity Test Details Section (Row 1: Viscosity)
    TEST_DESC2: null, // DB column: TEST_DESC2
    TEST_METHOD: "", // DB column: TEST_METHOD
    REQUIRMENT: "", // DB column: REQUIRMENT
    TEST_RESULT: "", // Frontend state key, maps to DB column: TEST_RESULT_VT
    TIME: "", // DB column: TIME
    REMARK: "", // Frontend state key, maps to DB column: REMARK_VT

    // Viscosity Test Details Section (Row 2: Specific Gravity)
    TEST_DESC3: null, // DB column: TEST_DESC3
    TEST_METHOD1: "", // DB column: TEST_METHOD1
    REQUIRMENT1: "", // DB column: REQUIRMENT1
    TEST_RESULT1: "", // DB column: TEST_RESULT1
    TIME1: "", // DB column: TIME1
    REMARK1: "", // DB column: REMARK1

    // Viscosity Test Details Section (Row 3: Density)
    TEST_DESC4: null, // DB column: TEST_DESC4
    TEST_METHOD2: "", // DB column: TEST_METHOD2
    REQUIRMENT2: "", // DB column: REQUIRMENT2
    TEST_RESULT2: "", // DB column: TEST_RESULT2
    TIME2: "", // DB column: TIME2
    REMARK2: "", // DB column: REMARK2

    // Instrument Used Section (Existing - remains common)
    SRNO: "", // SRNO
    INSTRUMENT: "", // INSTRUMENT
    ID: "", // ID

    SRNO1: "", // SRNO1
    INSTRUMENT1: "", // INSTRUMENT1
    ID1: "", // ID1

    SRNO2: "", // SRNO2
    INSTRUMENT2: "", // INSTRUMENT2
    ID2: "", // ID2

    SRNO3: "", // SRNO3
    INSTRUMENT3: "", // INSTRUMENT3
    ID3: "", // ID3
  });

  // Dropdown options for Shift
  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];
  const [crdate, setcrdate] = useState("");
  const [dateandshift, setdateandshift] = useState([]);
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [selecteddate, setselecteddate] = React.useState(null);

  // Dropdown options for Test Description (from Additional Data) - Panel Test

  const [testType, setTestType] = useState("A");

  const TestDescriptionOptions = [
    { label: "Adhesion Test", value: "AD" },
    { label: "Bend Test", value: "BE" },
    { label: "Buchholz hardness test", value: "BU" },
    { label: "Curing Test", value: "CU" },
    { label: "Porosity Test", value: "P" },
  ];

  const TestDescriptionwaterline = [
  { label: "Pull of Adhesion Test", value: "PT" },
  { label: "Adhesion Test (Cross cut)", value: "CC" },
  { label: "Taber Abrasion test (Index)", value: "AI" },
  { label: "Taber Abrasion test (Weight Loss)", value: "AW" },
  { label: "Taber Abrasion test (Cycles Per Mil)", value: "AC" },
];

const activeTestDescriptionOptions =
  testType === "A"
    ? TestDescriptionOptions
    : TestDescriptionwaterline;

  // Dropdown options for Viscosity Test
  const ViscosityTestOptions = [
    { label: "Viscosity", value: "V" },
    { label: "Specific Gravity", value: "S" },
    { label: "Density", value: "D" },
  ];

  // Helper function to format Date objects to YYYY-MM-DD for input type="date"
  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // Handle cases where dateString might be in DD-MON-YYYY format
        const parts = dateString.split("-");
        if (parts.length === 3) {
          const day = parts[0];
          const month = parts[1];
          const year = parts[2];
          const monthNames = {
            JAN: "01",
            FEB: "02",
            MAR: "03",
            APR: "04",
            MAY: "05",
            JUN: "06",
            JUL: "07",
            AUG: "08",
            SEP: "09",
            OCT: "10",
            NOV: "11",
            DEC: "12",
          };
          if (monthNames[month.toUpperCase()]) {
            const formattedDate = `${year}-${monthNames[month.toUpperCase()]}-${day}`;
            return formattedDate;
          }
        }
        return "";
      }
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Helper function to format YYYY-MM-DD to DD-MON-YYYY for backend if needed
  const formatDateToBackend = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
         .replace(/ /g, "-").replace("Sept", "Sep");
    } catch (error) {
      console.error("Error formatting date for backend:", error);
      return null;
    }
  };

  // Helper function for Panel Test dropdowns to filter out already selected options
  const getAvailablePanelTestOptions = (currentField) => {
    const selectedValues = [
      formData.TEST_DESC?.value,
      formData.CLIENT?.value,
      formData.REF_STD?.value,
      formData.POSNR?.value,
      formData.TEST_DESC1?.value,
    ].filter(Boolean);

    // return TestDescriptionOptions.filter((option) => {
      return activeTestDescriptionOptions.filter((option) => {
      // Keep current selected value visible in its own dropdown
      if (option.value === formData[currentField]?.value) {
        return true;
      }
      // Remove values already selected elsewhere
      return !selectedValues.includes(option.value);
    });
  };

  // Helper function for Viscosity Test dropdowns to filter out already selected options
  const getAvailableViscosityTestOptions = (currentField) => {
    const selectedValues = [
      formData.TEST_DESC2?.value,
      formData.TEST_DESC3?.value,
      formData.TEST_DESC4?.value,
    ].filter(Boolean);

    return ViscosityTestOptions.filter((option) => {
      if (option.value === formData[currentField]?.value) {
        return true;
      }
      return !selectedValues.includes(option.value);
    });
  };

  // Page load effect for authorization
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        validateUser(token);
        getOrderId(token.accessToken);
      });
    }
    fetchData();
  }, []);

  const validateUser = async (token) => {
    try {
      let plant = "";
      let userDetails = jwt.verify(token.refreshToken, serverDetails.REFRESH_KEY);
      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (!serverDetails.PersonalNo) {
        window.location.href = "#/signin";
        return;
      }

      const userId = serverDetails.PersonalNo;
      const pageName = "LDLTS009"; // New page name

      const authDetails = await getScreenAuth(plant, userId, pageName, token.accessToken);

      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML === "Z") {
          setRestricted(true);
        } else if (authDetails.payload.PS_AUTH_DML === "Y") {
          // setAdmin(true); // Admin role, assuming not directly needed for this page
          if (authDetails.payload.LS_READ_WRITE_FLAG === "RL_RW") {
            setReadWriteAccess(false); // Can write
            alertify.success("You are authorized to make changes from this page");
          } else {
            setReadWriteAccess(true); // Read-only
            alertify.error("You are not authorized to make changes from this page");
          }
        } else {
          setReadWriteAccess(true); // Read-only
          alertify.error("You are not authorized to make changes from this page");
        }
      } else {
        setRestricted(true);
      }
    } catch (error) {
      console.error("Authorization error:", error);
      setRestricted(true);
      if (!serverDetails.devMode) {
        window.location.href = "#/signin";
      }
    }

    if (serverDetails.devMode) {
      setRestricted(false);
      setReadWriteAccess(false); // Allow write in dev mode
    }
  };

  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      const defaultOptions = {
        headers: { Authorization: "Bearer " + accessToken },
      };
      const url = "api/users/screenAuth";
      const data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            reject(null);
          } else {
            const encryptUserInfo = response.data;
            const authDetails = jwt.verify(encryptUserInfo, serverDetails.SCREEN_AUTH_KEY);
            if (authDetails) {
              resolve(authDetails);
            } else {
              reject(null);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching screen auth:", error);
          reject(error);
        });
    });

  const getdateandshift = (accessToken, CHARG) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        BATCH_ID: CHARG,
      };

      var url = "api/LDLTS005/getdateandshift";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText !== "" && res.statusText !== "OK") {
            alertify.error("Error fetching Data");
            return;
          }

          console.log("res.data: ", res.data);

          const items = res?.data?.map((row) => ({
            label: row.PROD_DATE,
            date: row.DATE_FR,
            value: row.SHIFT,
            prodDate: row.PROD_DATE,
          }));

          setdateandshift(items);

          if (items && items.length > 0) {
            const firstRecord = res.data[0];

            const firstDate = {
              label: items[0].date,
              value: items[0].date,
            };

            setselecteddate(firstDate);
            setcrdate(firstDate);

            const firstShift = {
              label: firstRecord.SHIFT,
              value: firstRecord.SHIFT,
            };

            setSelectedShift(firstShift);

            // Populate Date of Process and Shift fields
setFormData((prev) => ({
  ...prev,
  PROD_DT: formatDateToInput(firstRecord.PROD_DATE),
  PSHIFT: firstShift,
}));
          } else {
            setselecteddate(null);
            setcrdate(null);
            setSelectedShift(null);

            setFormData((prev) => ({
              ...prev,
              PROD_DT: "",
              SHIFT: null,
            }));
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const handlesalesOrdChange = async (e) => {
    setFilterData((prevState) => ({
      ...prevState,
      CHARG: e,
      item: null,
    }));

    setFormData((prev) => ({
      ...prev,
      CHARG: e, // Store complete object
    }));

    if (e) {
      const token = await GetAuthorization();
      // handleCheckData(); // This will be triggered by the useEffect below
      getdateandshift(token.accessToken, e.value);
    } else {
      setFormData((prev) => ({
        ...prev,
        CHARG: null,
        PROD_DT: "",
        SHIFT: null,
      }));

      handleClearAll();
    }
  };

  useEffect(() => {
    if (formData.CHARG?.value) {
      handleCheckData();
    }
  }, [formData.CHARG]);

  // Handle input changes for MDInput fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value?.toUpperCase(), // Convert to uppercase as per common practice
    }));
  };

  // Handle select changes for ReactSelect fields
  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption,
    }));
  };

  // Clear all form fields
  const handleClearAll = () => {
    setFormData({
      RPTNO: "",
      CHARG: "",
      PSNO: "",
      CREATED_DT: "",
      PROD_DT: "",
      SHIFT: null,
      PSHIFT: null,

      // Panel Test fields
      TEST_DESC: null,
      ACEPT_CRET: "",
      TEST_RESULT: "",
      REMARK: "",

      CLIENT: null,
      FOANO: "",
      COAT_TYPE: "",
      PIPE_SIZE: "",

      REF_STD: null,
      WINO: "",
      TR2: "",
      REPORTNO: "",

      POSNR: null,
      AC: "",
      TR: "",
      REM: "",

      TEST_DESC1: null,
      AC3: "",
      TR3: "",
      REM1: "",

      // Viscosity Test fields (NEW)
      EPOXYBATCH: "",
      HARDNERBATCH: "",
      MAT_DESC: "",
      MAT_DESC1: "",
      TEST_DESC2: null,
      TEST_METHOD: "",
      REQUIRMENT: "",
      TEST_RESULT: "", //TEST_RESULT_VT
      TIME: "",
      REMARK: "", //REMARK_VT
      TEST_DESC3: null,
      TEST_METHOD1: "",
      REQUIRMENT1: "",
      TEST_RESULT1: "",
      TIME1: "",
      REMARK1: "",
      TEST_DESC4: null,
      TEST_METHOD2: "",
      REQUIRMENT2: "",
      TEST_RESULT2: "",
      TIME2: "",
      REMARK2: "",

      // Instrument Used fields (Common)
      SRNO: "",
      INSTRUMENT: "",
      ID: "",

      SRNO1: "",
      INSTRUMENT1: "",
      ID1: "",

      SRNO2: "",
      INSTRUMENT2: "",
      ID2: "",

      SRNO3: "",
      INSTRUMENT3: "",
      ID3: "",
    });
    alertify.error("All fields cleared.");
  };

  // Fetch data based on Pipe No. and Process Sheet No.
  const handleCheckData = async () => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: { Authorization: "Bearer " + token.accessToken },
      };
      const url = "api/LDLTS009/getDetails"; // New A endpoint
      console.log(formData.CHARG, "formData.CHARG");
      const data = {
        CHARG: formData.CHARG?.value,
        PSNO: formData.PSNO || "",
      };

      const response = await axiosAPI.post(url, data, defaultOptions);

      if (response.statusText !== "OK" && response.status !== 200) {
        alertify.error("Error fetching Data: " + (response.data?.msg || "Unknown error"));
        handleClearAll();
        return;
      }

      if (response.data?.length === 0) {
        alertify.error("No Data Found");
        // Keep CHARG and PSNO, clear other fields
        setFormData((prev) => ({
          ...prev,
          RPTNO: "",
          // CREATED_DT: "",
          // PROD_DT: "",
          // SHIFT: null,

          // Panel Test fields
          TEST_DESC: null,
          ACEPT_CRET: "",
          TEST_RESULT: "",
          REMARK: "",
          CLIENT: null,
          FOANO: "",
          COAT_TYPE: "",
          PIPE_SIZE: "",
          REF_STD: null,
          WINO: "",
          TR2: "",
          REPORTNO: "",
          POSNR: null,
          AC: "",
          TR: "",
          REM: "",
          TEST_DESC1: null,
          AC3: "",
          TR3: "",
          REM1: "",

          // Viscosity Test fields (NEW)
          EPOXYBATCH: "",
          HARDNERBATCH: "",
          MAT_DESC: "",
          MAT_DESC1: "",
          TEST_DESC2: null,
          TEST_METHOD: "",
          REQUIRMENT: "",
          TEST_RESULT: "", //TEST_RESULT_VT
          TIME: "",
          REMARK: "", //REMARK_VT
          TEST_DESC3: null,
          TEST_METHOD1: "",
          REQUIRMENT1: "",
          TEST_RESULT1: "",
          TIME1: "",
          REMARK1: "",
          TEST_DESC4: null,
          TEST_METHOD2: "",
          REQUIRMENT2: "",
          TEST_RESULT2: "",
          TIME2: "",
          REMARK2: "",

          // Instrument Used fields (Common)
          SRNO: "",
          INSTRUMENT: "",
          ID: "",
          SRNO1: "",
          INSTRUMENT1: "",
          ID1: "",
          SRNO2: "",
          INSTRUMENT2: "",
          ID2: "",
          SRNO3: "",
          INSTRUMENT3: "",
          ID3: "",
        }));
        return;
      }

const fetchedData = response.data[0];

const dbTestType = (fetchedData.TEST_TYPE || "").toUpperCase();
const selectedTestType = (testType || "").toUpperCase();

// If user selected WATER but record is API
if (selectedTestType === "W" && dbTestType === "A") {
alertify.error(
`API data already exists for Batch Id ${formData.CHARG?.value}. Water Line data cannot be filled.`
);
  return;
}

// If user selected API but record is WATER
if (selectedTestType === "A" && dbTestType === "W") {
alertify.error(
`Water Line data already exists for Batch Id ${formData.CHARG?.value}. API data cannot be filled.`
);
  return;
}

if (
  tabValue === 1 &&
  dbTestType &&
  dbTestType !== "V"
) {
  alertify.error(
    `Data already exists with Test Type ${dbTestType}`
  );
  return;
}

if (
  tabValue === 0 &&
  dbTestType === "V"
) {
  alertify.error(
    `Viscosity Test data already exists for Batch Id ${formData.CHARG?.value}`
  );
  return;
}
      setFormData((prev) => ({
        ...prev,
        RPTNO: fetchedData.RPTNO || "",
        // CHARG: fetchedData.CHARG || "", // Already set by user input
        // PSNO: fetchedData.PSNO || "", // Already set by user input
        CREATED_DT: formatDateToInput(fetchedData.CREATED_DT),
        PROD_DT: formatDateToInput(fetchedData.PROD_DT),
SHIFT: fetchedData.SHIFT
  ? ShiftType.find((s) => s.value === fetchedData.SHIFT)
  : null,

PSHIFT: fetchedData.PSHIFT
  ? ShiftType.find((s) => s.value === fetchedData.PSHIFT)
  : null,

        // Panel Test / Porosity Test Section
        TEST_DESC: fetchedData.TEST_DESC
          ? activeTestDescriptionOptions.find((td) => td.value === fetchedData.TEST_DESC)
          : null,
        ACEPT_CRET: fetchedData.ACEPT_CRET || "",
        TEST_RESULT: fetchedData.TEST_RESULT || "",
        REMARK: fetchedData.REMARK || "",

        CLIENT: fetchedData.CLIENT
          ? activeTestDescriptionOptions.find((td) => td.value === fetchedData.CLIENT)
          : null,
        FOANO: fetchedData.FOANO || "",
        COAT_TYPE: fetchedData.COAT_TYPE || "",
        PIPE_SIZE: fetchedData.PIPE_SIZE || "",

        REF_STD: fetchedData.REF_STD
          ? activeTestDescriptionOptions.find((td) => td.value === fetchedData.REF_STD)
          : null,
        WINO: fetchedData.WINO || "",
        TR2: fetchedData.TR || "",
        REPORTNO: fetchedData.REPORTNO || "",

        POSNR: fetchedData.POSNR
          ? activeTestDescriptionOptions.find((td) => td.value === fetchedData.POSNR)
          : null,
        AC: fetchedData.AC || "",
        TR: fetchedData.TR2 || "",
        REM: fetchedData.REM || "",

        TEST_DESC1: fetchedData.TEST_DESC1
          ? activeTestDescriptionOptions.find((td) => td.value === fetchedData.TEST_DESC1)
          : null,
        AC3: fetchedData.AC3 || "",
        TR3: fetchedData.TR3 || "",
        REM1: fetchedData.REM1 || "",

        // Viscosity Test Section (NEW)
        EPOXYBATCH: fetchedData.EPOXYBATCH || "",
        HARDNERBATCH: fetchedData.HARDNERBATCH || "",
        MAT_DESC: fetchedData.MAT_DESC || "",
        MAT_DESC1: fetchedData.MAT_DESC1 || "",

        TEST_DESC2: fetchedData.TEST_DESC2
          ? ViscosityTestOptions.find((td) => td.value === fetchedData.TEST_DESC2)
          : null,
        TEST_METHOD: fetchedData.TEST_METHOD || "",
        REQUIRMENT: fetchedData.REQUIRMENT || "",
        TEST_RESULT: fetchedData.TEST_RESULT || "", // Mapped from new DB column TEST_RESULT_VT
        TIME: fetchedData.TIME || "",
        REMARK: fetchedData.REMARK || "", // Mapped from new DB column REMARK_VT

        TEST_DESC3: fetchedData.TEST_DESC3
          ? ViscosityTestOptions.find((td) => td.value === fetchedData.TEST_DESC3)
          : null,
        TEST_METHOD1: fetchedData.TEST_METHOD1 || "",
        REQUIRMENT1: fetchedData.REQUIRMENT1 || "",
        TEST_RESULT1: fetchedData.TEST_RESULT1 || "",
        TIME1: fetchedData.TIME1 || "",
        REMARK1: fetchedData.REMARK1 || "",

        TEST_DESC4: fetchedData.TEST_DESC4
          ? ViscosityTestOptions.find((td) => td.value === fetchedData.TEST_DESC4)
          : null,
        TEST_METHOD2: fetchedData.TEST_METHOD2 || "",
        REQUIRMENT2: fetchedData.REQUIRMENT2 || "",
        TEST_RESULT2: fetchedData.TEST_RESULT2 || "",
        TIME2: fetchedData.TIME2 || "",
        REMARK2: fetchedData.REMARK2 || "",

        // Instrument Used Section (Common)
        SRNO: fetchedData.SRNO || "",
        INSTRUMENT: fetchedData.INSTRUMENT || "",
        ID: fetchedData.ID || "",

        SRNO1: fetchedData.SRNO1 || "",
        INSTRUMENT1: fetchedData.INSTRUMENT1 || "",
        ID1: fetchedData.ID1 || "",

        SRNO2: fetchedData.SRNO2 || "",
        INSTRUMENT2: fetchedData.INSTRUMENT2 || "",
        ID2: fetchedData.ID2 || "",

        SRNO3: fetchedData.SRNO3 || "",
        INSTRUMENT3: fetchedData.INSTRUMENT3 || "",
        ID3: fetchedData.ID3 || "",
      }));
alertify.success(
  dbTestType === "A"
    ? "Data loaded successfully for API." 
    : "Data loaded successfully for Water Line."
);
    } catch (error) {
      console.error("Error in handleCheckData:", error);
      alertify.error("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const getOrderId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        plant: "0780",
        FLAG: "Y", /// MIght be changed later
      };
      var url = "api/LDLTS005/getOrderId";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error: " + res?.error?.response?.data?.toString());
            return;
          } else {
            var items = [];
            console.log(res?.data);
            res?.data?.map((row) => {
              var obj = new Object();
              obj.label = row.LOM_ID_BATCH;
              obj.value = row.LOM_ID_BATCH;
              items.push(obj);
            });
            setSalesOrdId(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  // Save/Update data
const handleSave = async () => {
  if (!formData.CHARG) {
    alertify.error("Batch Id is mandatory.");
    return;
  }
  if (isReadWriteAccess) {
    alertify.error("You do not have write access to save changes.");
    return;
  }

    if (!formData.CREATED_DT) {
    alertify.error("Shift Date is mandatory.");
    setLoading(false); // Ensure loading state is reset
    return;
  }
  if (!formData.PROD_DT) {
    alertify.error("Date of Process is mandatory.");
    setLoading(false); // Ensure loading state is reset
    return;
  }

  setLoading(true);
  try {
    const token = await GetAuthorization();
    const defaultOptions = {
      headers: { Authorization: "Bearer " + token.accessToken },
    };
    const url = "api/LDLTS009/insertUpdateDetails"; // New A endpoint

    // Helper to nullify panel test fields
    const nullifyPanelTestFields = () => {
      return {
        TEST_DESC: null,
        ACEPT_CRET: null,
        // TEST_RESULT: null,
        // REMARK: null,
        CLIENT: null,
        FOANO: null,
        COAT_TYPE: null,
        PIPE_SIZE: null,
        REF_STD: null,
        WINO: null,
        TR2: null,
        REPORTNO: null,
        POSNR: null,
        AC: null,
        TR: null,
        REM: null,
        TEST_DESC1: null,
        AC3: null,
        TR3: null,
        REM1: null,
      };
    };

    // Helper to nullify viscosity test *details* fields (excluding header batch fields)
    const nullifyViscosityTestDetailsFields = () => {
      return {
        TEST_DESC2: null,
        TEST_METHOD: null,
        REQUIRMENT: null,
        // TEST_RESULT: null, // This maps to TEST_RESULT_VT in DB
        TIME: null,
        // REMARK: null, // This maps to REMARK_VT in DB

        TEST_DESC3: null,
        TEST_METHOD1: null,
        REQUIRMENT1: null,
        TEST_RESULT1: null,
        TIME1: null,
        REMARK1: null,

        TEST_DESC4: null,
        TEST_METHOD2: null,
        REQUIRMENT2: null,
        TEST_RESULT2: null,
        TIME2: null,
        REMARK2: null,
      };
    };

    // Base data that is always sent (Header and Instrument Used)
    let dataToSend = {
      MANDT: "600",
      PLANT: serverDetails.Plant || "0780",
      CHARG: formData.CHARG?.value,
      PSNO: formData.PSNO || "",
      TEST_TYPE: tabValue === 1 ? "V" : testType,

      RPTNO: formData.RPTNO,
      CREATED_DT: formatDateToBackend(formData.CREATED_DT),
      PROD_DT: formatDateToBackend(formData.PROD_DT),
PSHIFT: formData.PSHIFT?.value || null,
SHIFT: formData.SHIFT?.value || null,

      // Instrument Used Section (Common - always included)
      SRNO: formData.SRNO,
      INSTRUMENT: formData.INSTRUMENT,
      ID: formData.ID,
      SRNO1: formData.SRNO1,
      INSTRUMENT1: formData.INSTRUMENT1,
      ID1: formData.ID1,
      SRNO2: formData.SRNO2,
      INSTRUMENT2: formData.INSTRUMENT2,
      ID2: formData.ID2,
      SRNO3: formData.SRNO3,
      INSTRUMENT3: formData.INSTRUMENT3,
      ID3: formData.ID3,

      CREATED_BY: serverDetails.PersonalNo,
      UPDATED_BY: serverDetails.PersonalNo,
    };

    if (tabValue === 0) {
      // Panel Test / Porosity Test tab is active
      let panelTestMapping = {};
const panelTestRows =
  testType === "A"
    ? [
        {
          test: "AD",
          acceptance: formData.ACEPT_CRET,
          result: formData.TEST_RESULT,
          remark: formData.REMARK,
        },
        {
          test: "BE",
          acceptance: formData.FOANO,
          result: formData.COAT_TYPE,
          remark: formData.PIPE_SIZE,
        },
        {
          test: "BU",
          acceptance: formData.WINO,
          result: formData.TR2,
          remark: formData.REPORTNO,
        },
        {
          test: "CU",
          acceptance: formData.AC,
          result: formData.TR,
          remark: formData.REM,
        },
        {
          test: "P",
          acceptance: formData.AC3,
          result: formData.TR3,
          remark: formData.REM1,
        },
      ]
    : [
        {
          test: formData.TEST_DESC?.value,
          acceptance: formData.ACEPT_CRET,
          result: formData.TEST_RESULT,
          remark: formData.REMARK,
        },
        {
          test: formData.CLIENT?.value,
          acceptance: formData.FOANO,
          result: formData.COAT_TYPE,
          remark: formData.PIPE_SIZE,
        },
        {
          test: formData.REF_STD?.value,
          acceptance: formData.WINO,
          result: formData.TR2,
          remark: formData.REPORTNO,
        },
        {
          test: formData.POSNR?.value,
          acceptance: formData.AC,
          result: formData.TR,
          remark: formData.REM,
        },
        {
          test: formData.TEST_DESC1?.value,
          acceptance: formData.AC3,
          result: formData.TR3,
          remark: formData.REM1,
        },
      ];

      // Initialize panelTestMapping with nulls for all possible fields
      panelTestMapping = nullifyPanelTestFields();

         if (testType === "A") {
  panelTestRows.forEach((row) => {
    switch (row.test) {
      case "AD":
        panelTestMapping.TEST_DESC = "AD";
        panelTestMapping.ACEPT_CRET = row.acceptance;
        panelTestMapping.TEST_RESULT = row.result;
        panelTestMapping.REMARK = row.remark;
        break;

      case "BE":
        panelTestMapping.CLIENT = "BE";
        panelTestMapping.FOANO = row.acceptance;
        panelTestMapping.COAT_TYPE = row.result;
        panelTestMapping.PIPE_SIZE = row.remark;
        break;

      case "BU":
        panelTestMapping.REF_STD = "BU";
        panelTestMapping.WINO = row.acceptance;
        panelTestMapping.TR2 = row.result;
        panelTestMapping.REPORTNO = row.remark;
        break;

      case "CU":
        panelTestMapping.POSNR = "CU";
        panelTestMapping.AC = row.acceptance;
        panelTestMapping.TR = row.result;
        panelTestMapping.REM = row.remark;
        break;

      case "P":
        panelTestMapping.TEST_DESC1 = "P";
        panelTestMapping.AC3 = row.acceptance;
        panelTestMapping.TR3 = row.result;
        panelTestMapping.REM1 = row.remark;
        break;
    }
  });
}else if (testType === "W") {
  panelTestMapping = {
    TEST_DESC: formData.TEST_DESC?.value || null,
    ACEPT_CRET: formData.ACEPT_CRET || null,
    TEST_RESULT: formData.TEST_RESULT || null,
    REMARK: formData.REMARK || null,

    CLIENT: formData.CLIENT?.value || null,
    FOANO: formData.FOANO || null,
    COAT_TYPE: formData.COAT_TYPE || null,
    PIPE_SIZE: formData.PIPE_SIZE || null,

    REF_STD: formData.REF_STD?.value || null,
    WINO: formData.WINO || null,
    TR2: formData.TR2 || null,
    REPORTNO: formData.REPORTNO || null,

    POSNR: formData.POSNR?.value || null,
    AC: formData.AC || null,
    TR: formData.TR || null,
    REM: formData.REM || null,

    TEST_DESC1: formData.TEST_DESC1?.value || null,
    AC3: formData.AC3 || null,
    TR3: formData.TR3 || null,
    REM1: formData.REM1 || null,
  };
}

if (tabValue === 0){
        dataToSend = {
        ...dataToSend,
        ...panelTestMapping,
        // When Panel Test tab is active, explicitly nullify all Viscosity Test related fields,
        // including the header fields like EPOXYBATCH, MAT_DESC, etc.
        TEST_RESULT: formData.TEST_RESULT,
        REMARK: formData.REMARK,
        EPOXYBATCH: null,
        HARDNERBATCH: null,
        MAT_DESC: null,
        MAT_DESC1: null,
        ...nullifyViscosityTestDetailsFields(), // Nullify only the details part
      };
} else if
(tabValue === 1){
        dataToSend = {
        ...dataToSend,
        ...viscosityTestMapping,
        // When Panel Test tab is active, explicitly nullify all Viscosity Test related fields,
        // including the header fields like EPOXYBATCH, MAT_DESC, etc.
        TEST_RESULT: formData.TEST_RESULT,
        REMARK: formData.REMARK,
        EPOXYBATCH: formData.EPOXYBATCH || null,
        HARDNERBATCH: formData.HARDNERBATCH || null,
        MAT_DESC: formData.MAT_DESC || null,
        MAT_DESC1: formData.MAT_DESC1 || null,
        ...nullifyPanelTestFields(), // Nullify only the details part
      };
}

    } else if (tabValue === 1) {
      // Viscosity Test tab is active
      let viscosityTestMapping = {};
      const viscosityTestRows = [
        {
          test: formData.TEST_DESC2?.value,
          method: formData.TEST_METHOD,
          requirement: formData.REQUIRMENT,
          result: formData.TEST_RESULT,
          time: formData.TIME,
          remark: formData.REMARK,
        },
        {
          test: formData.TEST_DESC3?.value,
          method: formData.TEST_METHOD1,
          requirement: formData.REQUIRMENT1,
          result: formData.TEST_RESULT1,
          time: formData.TIME1,
          remark: formData.REMARK1,
        },
        {
          test: formData.TEST_DESC4?.value,
          method: formData.TEST_METHOD2,
          requirement: formData.REQUIRMENT2,
          result: formData.TEST_RESULT2,
          time: formData.TIME2,
          remark: formData.REMARK2,
        },
      ];

      // Initialize viscosityTestMapping with nulls for only the *details* fields
      viscosityTestMapping = nullifyViscosityTestDetailsFields();

      viscosityTestRows.forEach((row) => {
        switch (row.test) {
          case "V":
            viscosityTestMapping.TEST_DESC2 = "V";
            viscosityTestMapping.TEST_METHOD = row.method;
            viscosityTestMapping.REQUIRMENT = row.requirement;
            viscosityTestMapping.TEST_RESULT = row.result;
            viscosityTestMapping.TIME = row.time;
            viscosityTestMapping.REMARK = row.remark;
            break;
          case "S":
            viscosityTestMapping.TEST_DESC3 = "S";
            viscosityTestMapping.TEST_METHOD1 = row.method;
            viscosityTestMapping.REQUIRMENT1 = row.requirement;
            viscosityTestMapping.TEST_RESULT1 = row.result;
            viscosityTestMapping.TIME1 = row.time; // Corrected typo
            viscosityTestMapping.REMARK1 = row.remark; // Corrected typo
            break;
          case "D":
            viscosityTestMapping.TEST_DESC4 = "D";
            viscosityTestMapping.TEST_METHOD2 = row.method;
            viscosityTestMapping.REQUIRMENT2 = row.requirement;
            viscosityTestMapping.TEST_RESULT2 = row.result;
            viscosityTestMapping.TIME2 = row.time; // Corrected typo
            viscosityTestMapping.REMARK2 = row.remark; // Corrected typo
            break;
          default:
            break;
        }
      });

      dataToSend = {
        ...dataToSend,
        // Viscosity Test Header Section (Epoxy/Hardner Batch) - these should come from formData
        EPOXYBATCH: formData.EPOXYBATCH || null,
        HARDNERBATCH: formData.HARDNERBATCH || null,
        MAT_DESC: formData.MAT_DESC || null,
        MAT_DESC1: formData.MAT_DESC1 || null,
        ...viscosityTestMapping, // This now only contains the test details, not the header fields
        ...nullifyPanelTestFields(), // Explicitly nullify panel test fields
      };
    }
    // If no tab is selected or an unexpected tabValue, dataToSend will only contain header and instrument fields.

    const response = await axiosAPI.post(url, dataToSend, defaultOptions);

    if (response.statusText !== "OK" && response.status !== 200) {
      alertify.error("Error saving Data: " + (response.data?.msg || "Unknown error"));
      return;
    }

    const result = response.data;
    if (result?.msg) {
      result.msg.toUpperCase().startsWith("Y")
        ? alertify.success(result.msg)
        : alertify.error(result.msg);
    } else {
      alertify.success("Data saved successfully!");
    }
  } catch (error) {
    console.error("Error in handleSave:", error);
  let errorMessage = "Failed to save data. Please try again.";

    // Check if the error is an Axios error with a response from the server
    if (error.response && error.response.data && error.response.data.msg) {
      errorMessage = "Error saving Data: " + error.response.data.msg;
    } else if (error.message) {
      // Fallback for other types of errors that might have a message property
      errorMessage = "Error saving Data: " + error.message;
    }

    alertify.error(errorMessage);
  } finally {
    setLoading(false);
  }
};


  const handleBatchIdInput = (e) => {
  const value = e.target.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "") // only alphanumeric
    .slice(0, 10); // max 10 characters

  setFormData((prev) => ({
    ...prev,
    CHARG: {
      label: value,
      value: value,
    },
  }));
};

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Panel Test / Porosity Test"
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
      {!isRestricted && (
        <>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
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
                      <Grid item xs={6}>
                        <MDTypography variant="h6" color="white">
                          Filter
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Clear All">
                          <IconButton color="white" onClick={handleClearAll}>
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={1}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                              noWrap
                            >
                              Report No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="RPTNO"
                              value={formData.RPTNO}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                              }}
                              noWrap
                            >
                              Batch Id
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <ReactSelect
                              id="CHARG"
                              options={salesOrdId}
                              onChange={handlesalesOrdChange}
                              value={formData.CHARG}
                              style={{ marginLeft: "8px" }}
                              // Add this prop to render the dropdown menu directly into the document body.
                              // This helps prevent z-index and overflow issues with parent containers.
                              menuPortalTarget={document.body}
                              // Optionally, you can also apply a high z-index to the menu portal itself
                              // if other elements on the page also use high z-indices.
                              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            />
                          </Grid>
                        </Grid>
                      </Grid> */}
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                              }}
                              noWrap
                            >
                              Batch Id
                              <span style={{ color: "red" }}> *</span>
                            </MDTypography>
                          </Grid>

                          <Grid item xs={8}>
                            {tabValue === 0 ? (
                              <ReactSelect
                                id="CHARG"
                                options={salesOrdId}
                                onChange={handlesalesOrdChange}
                                value={formData.CHARG}
                                style={{ marginLeft: "8px" }}
                                menuPortalTarget={document.body}
                                styles={{
                                  menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                  }),
                                }}
                              />
                            ) : (
                              <MDInput
                                fullWidth
                                id="CHARG"
                                value={formData.CHARG?.value || ""}
                                onChange={handleBatchIdInput}
                                inputProps={{
                                  maxLength: 10,
                                  pattern: "[A-Za-z0-9]*",
                                }}
                                disabled={isReadWriteAccess}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Process Sheet No. */}
                      <Grid item xs={12} md={1.5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={8}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                              noWrap
                            >
                              Process Sheet No.
                              
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="PSNO"
                              value={formData.PSNO}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                              visible={false}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Shift Date */}
                      <Grid item xs={12} md={2}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                              noWrap
                            >
                              Shift Date:
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              type="date"
                              fullWidth
                              id="CREATED_DT"
                              value={formData.CREATED_DT}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

<Grid item xs={12} md={2}>
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={4}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        variant="h6"
        color="dark"
        noWrap
      >
        E Shift:
      </MDTypography>
    </Grid>

    <Grid item xs={8}>
      <ReactSelect
        options={ShiftType}
        onChange={(selectedOption) =>
          handleSelectChange("SHIFT", selectedOption)
        }
        value={formData.SHIFT}
        isDisabled={isReadWriteAccess}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
      />
    </Grid>
  </Grid>
</Grid>

                      {/* Date of Process */}
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                              noWrap
                            >
                              Date of Process:
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              type="date"
                              fullWidth
                              id="PROD_DT"
                              value={formData.PROD_DT}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Shift */}
                      <Grid item xs={12} md={3}>
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={4}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        variant="h6"
        color="dark"
        noWrap
      >
        Shift:
      </MDTypography>
    </Grid>

    <Grid item xs={8}>
      <ReactSelect
        options={ShiftType}
        onChange={(selectedOption) =>
          handleSelectChange("PSHIFT", selectedOption)
        }
        value={formData.PSHIFT}
        isDisabled={isReadWriteAccess}
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        }}
      />
    </Grid>
  </Grid>
</Grid>


                      {tabValue === 0 && (
                        <Grid item xs={12} md={3}>
                          <FormControl>
                            <RadioGroup
                              row
                              value={testType}
                              // disabled={!!formData.CHARG}
                              onChange={(e) => {
                                setTestType(e.target.value);
                                handleClearAll();

                                // Clear existing panel test selections when switching
                                setFormData((prev) => ({
                                  ...prev,
                                  TEST_DESC: null,
                                  CLIENT: null,
                                  REF_STD: null,
                                  POSNR: null,
                                  TEST_DESC1: null,
                                }));
                              }}
                            >
                              <FormControlLabel
                                value="A"
                                control={<Radio />}
                                label="API"
                              />
                              <FormControlLabel
                                value="W"
                                control={<Radio />}
                                label="Water Line"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      )}

                      {/* Save Button */}

                      <Grid item xs={12} md={3}>
                        <MDButton
                          size="small"
                          color="info"
                          onClick={handleSave}
                          disabled={isReadWriteAccess}
                          style={{ marginLeft: "1rem" }}
                        >
                          Save
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>

            <Grid margin={1.5}></Grid>

            {/* Tabs for Panel Test and Viscosity Test */}
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                  >
                    <Tab label="Panel Test / Porosity Test" />
                    <Tab label="Viscosity Test" />
                  </Tabs>
                </AppBar>
              </Grid>

              {/* Tab Content */}
              {tabValue === 0 && (
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-1}
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
                        <Grid item xs={6}>
                          <MDTypography variant="h6" color="white">
                            PANEL TEST / POROSITY TEST
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title={expandPanelTest ? "Hide" : "Show"}>
                            <IconButton
                              color="white"
                              aria-label="toggle"
                              onClick={() =>
                                setExpandPanelTest(!expandPanelTest)
                              }
                            >
                              {expandPanelTest ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    {expandPanelTest && (
                      <MDBox px={3} py={1}>
                        <Grid container spacing={1}>
                          {/* Header Row */}
                          <Grid item xs={3}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Test Description
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Acceptance Criteria
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Test Result
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Remarks
                            </MDTypography>
                          </Grid>

                          {/* Row 1 */}
                          <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions("TEST_DESC")}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC", selectedOption)
                              }
                              value={formData.TEST_DESC}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                          {/* <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions(
                                "TEST_DESC",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC", selectedOption)
                              }
                              value={
                                testType === "A"
                                  ? { label: "Adhesion Test", value: "AD" }
                                  : formData.TEST_DESC
                              }
                              isDisabled={
                          isReadWriteAccess     
                              }
                            />
                          </Grid> */}
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="ACEPT_CRET"
                              value={formData.ACEPT_CRET}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TEST_RESULT"
                              value={formData.TEST_RESULT}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="REMARK"
                              value={formData.REMARK}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>

                          {/* Row 2 */}
                                                    <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions("CLIENT")}
                              onChange={(selectedOption) =>
                                handleSelectChange("CLIENT", selectedOption)
                              }
                              value={formData.CLIENT}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                          {/* <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions(
                                "TEST_DESC",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC", selectedOption)
                              }
                              value={
                                testType === "A"
                                  ? { label: "Bend Test", value: "BE" }
                                  : formData.TEST_DESC
                              }
                              isDisabled={
                          isReadWriteAccess     
                              }
                            />
                          </Grid> */}
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="FOANO"
                              value={formData.FOANO}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="COAT_TYPE"
                              value={formData.COAT_TYPE}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="PIPE_SIZE"
                              value={formData.PIPE_SIZE}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>

                          {/* Row 3 */}
                                                    <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions("REF_STD")}
                              onChange={(selectedOption) =>
                                handleSelectChange("REF_STD", selectedOption)
                              }
                              value={formData.REF_STD}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                          {/* <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions(
                                "TEST_DESC",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC", selectedOption)
                              }
                              value={
                                testType === "A"
                                  ? { label: "Buchholz hardness test", value: "BU" }
                                  : formData.TEST_DESC
                              }
                              isDisabled={
                          isReadWriteAccess     
                              }
                            />
                          </Grid> */}
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="WINO"
                              value={formData.WINO}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TR2"
                              value={formData.TR2}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="REPORTNO"
                              value={formData.REPORTNO}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>

                          {/* Row 4 */}
                         <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions("POSNR")}
                              onChange={(selectedOption) =>
                                handleSelectChange("POSNR", selectedOption)
                              }
                              value={formData.POSNR}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                          {/* <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions(
                                "TEST_DESC",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC", selectedOption)
                              }
                              value={
                                testType === "A"
                                  ? { label: "Curing Test", value: "CU" }
                                  : formData.TEST_DESC
                              }
                              isDisabled={
                          isReadWriteAccess     
                              }
                            />
                          </Grid> */}
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="AC"
                              value={formData.AC}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TR"
                              value={formData.TR}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="REM"
                              value={formData.REM}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>

                          {/* Row 5 */}
                          <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions("TEST_DESC1")}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC1", selectedOption)
                              }
                              value={formData.TEST_DESC1}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                                                    {/* <Grid item xs={3}>
                            <ReactSelect
                              options={getAvailablePanelTestOptions(
                                "TEST_DESC",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC", selectedOption)
                              }
                              value={
                                testType === "A"
                                  ? { label: "Porosity Test", value: "P" }
                                  : formData.TEST_DESC1
                              }
                              isDisabled={
                                testType === "A" || isReadWriteAccess
                              }
                            />
                          </Grid> */}
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="AC3"
                              value={formData.AC3}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TR3"
                              value={formData.TR3}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="REM1"
                              value={formData.REM1}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                        </Grid>
                      </MDBox>
                    )}
                  </Card>
                </Grid>
              )}

              {tabValue === 1 && (
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-1}
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
                        <Grid item xs={6}>
                          <MDTypography variant="h6" color="white">
                            VISCOSITY TEST
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip
                            title={expandPanelViscosity ? "Hide" : "Show"}
                          >
                            <IconButton
                              color="white"
                              aria-label="toggle"
                              onClick={() =>
                                setExpandPanelViscosity(!expandPanelViscosity)
                              }
                            >
                              {expandPanelViscosity ? (
                                <ExpandLessIcon />
                              ) : (
                                <ExpandMoreIcon />
                              )}
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    {expandPanelViscosity && (
                      <MDBox px={3} py={1}>
                        <Grid container spacing={1} mb={2}>
                          {/* Epoxy / Base Batch & Material Description */}
                          <Grid item xs={12} md={6}>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item xs={5}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Epoxy / Base Batch
                                </MDTypography>
                              </Grid>
                              <Grid item xs={7}>
                                <MDInput
                                  fullWidth
                                  id="EPOXYBATCH"
                                  value={formData.EPOXYBATCH}
                                  onChange={handleInputChange}
                                  disabled={isReadWriteAccess}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item xs={5}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Epoxy / Base Material Description
                                </MDTypography>
                              </Grid>
                              <Grid item xs={7}>
                                <MDInput
                                  fullWidth
                                  id="MAT_DESC"
                                  value={formData.MAT_DESC}
                                  onChange={handleInputChange}
                                  disabled={isReadWriteAccess}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* Hardner / Agent Batch & Material Description */}
                          <Grid item xs={12} md={6}>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item xs={5}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Hardner / Agent Batch
                                </MDTypography>
                              </Grid>
                              <Grid item xs={7}>
                                <MDInput
                                  fullWidth
                                  id="HARDNERBATCH"
                                  value={formData.HARDNERBATCH}
                                  onChange={handleInputChange}
                                  disabled={isReadWriteAccess}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item xs={5}>
                                <MDTypography
                                  fontWeight="regular"
                                  fontSize="small"
                                  variant="h6"
                                  color="dark"
                                  noWrap
                                >
                                  Hardner / Agent Material Description
                                </MDTypography>
                              </Grid>
                              <Grid item xs={7}>
                                <MDInput
                                  fullWidth
                                  id="MAT_DESC1"
                                  value={formData.MAT_DESC1}
                                  onChange={handleInputChange}
                                  disabled={isReadWriteAccess}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                          {/* Header Row */}
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Test Description
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Test Method
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Requirement
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Test Result
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Time
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              Remarks
                            </MDTypography>
                          </Grid>

                          {/* Row 1: Viscosity */}
                          <Grid item xs={2}>
                            <ReactSelect
                              options={getAvailableViscosityTestOptions(
                                "TEST_DESC2",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC2", selectedOption)
                              }
                              value={formData.TEST_DESC2}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TEST_METHOD"
                              value={formData.TEST_METHOD}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="REQUIRMENT"
                              value={formData.REQUIRMENT}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TEST_RESULT" //TEST_RESULT_VT
                              value={formData.TEST_RESULT} //TEST_RESULT_VT
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TIME"
                              type="time"
                              value={formData.TIME}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="REMARK" //REMARK_VT
                              value={formData.REMARK} //REMARK_VT
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>

                          {/* Row 2: Specific Gravity */}
                          <Grid item xs={2}>
                            <ReactSelect
                              options={getAvailableViscosityTestOptions(
                                "TEST_DESC3",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC3", selectedOption)
                              }
                              value={formData.TEST_DESC3}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TEST_METHOD1"
                              value={formData.TEST_METHOD1}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="REQUIRMENT1"
                              value={formData.REQUIRMENT1}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TEST_RESULT1"
                              value={formData.TEST_RESULT1}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TIME1"
                              type="time"
                              value={formData.TIME1}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="REMARK1"
                              value={formData.REMARK1}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>

                          {/* Row 3: Density */}
                          <Grid item xs={2}>
                            <ReactSelect
                              options={getAvailableViscosityTestOptions(
                                "TEST_DESC4",
                              )}
                              onChange={(selectedOption) =>
                                handleSelectChange("TEST_DESC4", selectedOption)
                              }
                              value={formData.TEST_DESC4}
                              isDisabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TEST_METHOD2"
                              value={formData.TEST_METHOD2}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="REQUIRMENT2"
                              value={formData.REQUIRMENT2}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TEST_RESULT2"
                              value={formData.TEST_RESULT2}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TIME2"
                              type="time"
                              value={formData.TIME2}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="REMARK2"
                              value={formData.REMARK2}
                              onChange={handleInputChange}
                              disabled={isReadWriteAccess}
                            />
                          </Grid>
                        </Grid>
                      </MDBox>
                    )}
                  </Card>
                </Grid>
              )}
            </Grid>

            <Grid margin={1.5}></Grid>

            {/* Instrument Used Section (COMMON - outside tabs) */}
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-1}
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
                      <Grid item xs={6}>
                        <MDTypography variant="h6" color="white">
                          Instrument Used
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title={expandInstrumentUsed ? "Hide" : "Show"}>
                          <IconButton
                            color="white"
                            aria-label="toggle"
                            onClick={() =>
                              setExpandInstrumentUsed(!expandInstrumentUsed)
                            }
                          >
                            {expandInstrumentUsed ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  {expandInstrumentUsed && (
                    <MDBox px={3} py={1}>
                      <Grid container spacing={1}>
                        {/* Header Row */}
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="small"
                            variant="h6"
                            color="dark"
                          >
                            SR. NO.
                          </MDTypography>
                        </Grid>
                        <Grid item xs={6}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="small"
                            variant="h6"
                            color="dark"
                          >
                            INSTRUMENT NAME
                          </MDTypography>
                        </Grid>
                        <Grid item xs={5}>
                          <MDTypography
                            fontWeight="bold"
                            fontSize="small"
                            variant="h6"
                            color="dark"
                          >
                            INSTRUMENT ID / SERIAL
                          </MDTypography>
                        </Grid>

                        {/* Row 1 */}
                        <Grid item xs={1}>
                          <MDInput
                            fullWidth
                            id="SRNO"
                            value={formData.SRNO}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MDInput
                            fullWidth
                            id="INSTRUMENT"
                            value={formData.INSTRUMENT}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <MDInput
                            fullWidth
                            id="ID"
                            value={formData.ID}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>

                        {/* Row 2 */}
                        <Grid item xs={1}>
                          <MDInput
                            fullWidth
                            id="SRNO1"
                            value={formData.SRNO1}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MDInput
                            fullWidth
                            id="INSTRUMENT1"
                            value={formData.INSTRUMENT1}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <MDInput
                            fullWidth
                            id="ID1"
                            value={formData.ID1}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>

                        {/* Row 3 */}
                        <Grid item xs={1}>
                          <MDInput
                            fullWidth
                            id="SRNO2"
                            value={formData.SRNO2}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MDInput
                            fullWidth
                            id="INSTRUMENT2"
                            value={formData.INSTRUMENT2}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <MDInput
                            fullWidth
                            id="ID2"
                            value={formData.ID2}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>

                        {/* Row 4 */}
                        <Grid item xs={1}>
                          <MDInput
                            fullWidth
                            id="SRNO3"
                            value={formData.SRNO3}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <MDInput
                            fullWidth
                            id="INSTRUMENT3"
                            value={formData.INSTRUMENT3}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <MDInput
                            fullWidth
                            id="ID3"
                            value={formData.ID3}
                            onChange={handleInputChange}
                            disabled={isReadWriteAccess}
                          />
                        </Grid>
                      </Grid>
                    </MDBox>
                  )}
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
