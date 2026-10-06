import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
// Material Dashboard 2 React components
import { GetAuthorization } from "utils";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import MonthPicker from "components/DateTime/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import FormLabel from "@mui/material/FormLabel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import * as XLSX from "xlsx";

import "../../tabulatorCss.scss";

export default function LDS060() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [rawMatTable, setrawMatTable] = useState(null);

  const [inspectorname, setinspectorname] = useState([]);
  const [inspectorID, setinspectorID] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);

  const [RMList, setRMList] = useState([]); // Options for Parent Batch dropdown
  const [rmBatchId, setrmBatchId] = useState(null); // Selected Parent Batch value
  const [allPipeNoList, setAllPipeNoList] = useState([]); // All pipe numbers fetched from API (filtered by mill)
  const [filteredPipeNoList, setFilteredPipeNoList] = useState([]);

  // --- NEW STATE FOR MILL FILTER ---
  const [selectedMill, setSelectedMill] = useState(null);
  const millOptions = [
    { label: "MILL 1", value: "1" },
    { label: "MILL 2", value: "2" },
  ];
  // --- END NEW STATE ---


  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("60");
  const [inspector, setInspector] = useState("");
  const [RESULT, setRESULT] = useState([]);
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [SHIFT, setSHIFT] = useState("");
  const [SHIFT_DATE, setSHIFT_DATE] = useState("");
  const [pono, setPoNo] = useState("");
  const [noInd, setNoInd] = useState("");
  const [TEnd, setTEnd] = useState("");
  const [FEnd, setFEnd] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [selectedCalibDueDt, setSelectedCalibDueDt] = useState(null);
  const [selectedShiftDt, setSelectedShiftDt] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);
  const [time, setTime] = useState("");
  const [issexBatch, setIsExBatch] = useState("");
  const [selectedGaugeId, setSelectedGaugeId] = useState(null);
  const [gaugerange, setGaugeRange] = useState("");
  const [material, setMaterial] = useState("");
  const [Cremark, setCRemark] = useState("");
  const [mutresult, setMUTResult] = useState("");
  const [getBodyUTTable, setBodyUTTable] = useState([]);
  const [selectedBodyUTTable, setSelectedBodyUTTable] = useState(null);
  //const [valueRadio, setValueRadio] = React.useState("6C");
  const [date, setDate] = useState(null);
  const [shift, setShift] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [selectedResult, setSelectedResult] = React.useState([]);

  const [remark, setRemark] = useState("");
  const [LREMARK, setLREMARK] = useState([]);
  const [utRemark, setUtRemark] = useState("");
  const [LUT_REMARK, setLUT_REMARK] = useState([]);

    const [uploadedExcelData, setUploadedExcelData] = useState([]);
    const excelFileInputRef = useRef(null);

  const UTResultType = [
    { label: "OK", value: "OK" },
    { label: "OD INDICATION", value: "OD INDICATION" },
    { label: "ID INDICATION", value: "ID INDICATION" },
    { label: "INTERNAL HOLD", value: "INTERNAL HOLD" },
    { label: "CALIBRATION PIPE", value: "CALIBRATION PIPE" },
    { label: "BYPASS", value: "BYPASS" },
  ];

    const remarklist = [
    { label: "OK", value: "OK" },
    { label: "CRACK", value: "CRACK" },
    { label: "ID EDGE", value: "ID EDGE" },
    { label: "ID BEAD", value: "ID BEAD" },
    { label: "LOF", value: "LOF" },
    { label: "OVERLAP", value: "OVERLAP" },
  ];

  //page load
  const fetchDetails = () => {
    setLoading(true);
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([
          getRmList(data.accessToken, selectedMill),
          getinspectorlist(data.accessToken),
          // getPipeNoList(data.accessToken),
          getAllPipeNoList(data.accessToken, selectedMill), // --- MODIFIED: Pass selectedMill ---
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };
  //page load
  useEffect(() => {
    fetchDetails();
  }, []);

  const getRmList = async (accessToken, millValue = null) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      status: "6C",
      mill: millValue ? millValue.value : "", // --- MODIFIED: Include mill value ---
    };

    var url = "api/LD02S001/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_PAR_COIL_NO;
            obj.value = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });
          setRMList(items);
          // setrmBatchId(items[0]);
          // Promise.all([
          //   getPipeNoList("", accessToken),
          //   //getMatNo("",accessToken),
          //   getPoNo("", accessToken, data.pipeno),
          // ]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };


  const getinspectorlist = async (accessToken) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      process: "60",
    };
    console.log("process--->",data)
    var url = "api/LD04S001/getinspectorlist";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.INSPECTOR_NAME;
            obj.value = row.INSPECTOR_NAME;
            items.push(obj);
          });
          setinspectorname(items);
          // setinspectorID(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };


  const getPipeNoList = async (value, accessToken, status) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "6C",
      rmBatch: value.value ? value.value : "",
    };
    var url = "api/LD02S001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];

          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            items.push(obj);
          });
          //console.log("items60",items)
          setPipeNoList(items);
          if (items.length > 0) {
            setPipeNo(items[0]);
          } else {
            setPipeNo(null);
          }
          Promise.all([
            getOrdDetails(accessToken, items[0]),
            // getNxtProc(accessToken, items[0]),
          ]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };


  const getAllPipeNoList = async (accessToken, millValue = null) => { // --- MODIFIED: Added millValue parameter ---
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "6C",
      rmBatch: "",
      mill: millValue ? millValue.value : "", // --- MODIFIED: Include mill value ---
    };
    var url = "api/LD02S001/getPipeNoList"; // Assuming this API endpoint supports 'mill' filtering
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];

          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            obj.parentCoilNo = row.LOM_ID_PAR_COIL_NO;
            obj.mill = row.MILL; // Assuming 'MILL' field comes from the API
            items.push(obj);
          });

          setAllPipeNoList(items); // Store all pipes (now potentially filtered by mill)
          setFilteredPipeNoList(items); // Initially, filtered list is the same as all pipes

          // If the previously selected pipe is no longer in the list, clear it
          if (pipeno && !items.some(item => item.value === pipeno.value)) {
            setPipeNo(null);
            setrmBatchId(null); // Also clear parent batch if pipe is no longer valid
          }
          // If a mill is selected and rmBatchId is already set, re-filter by rmBatchId
          if (millValue && rmBatchId) {
            handleRMBatchChange(rmBatchId);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const setTableNull = () => {
    setBodyUTTable([]);
  };
  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log(value);
      var url = "api/LD02S001/getTataDate";
      let data = {
        prodEndDt: value,
      };
      console.log(data);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            // if (response.data.length == 0) {
            //   alertify.error("No Data Found");
            //   setDateValue([,]);
            //   setLoading(false);
            // }
            var rows = [];

            console.log(response.data?.[0]?.[1]);
            setSHIFT_DATE(response.data?.[0]?.[1]);
            setSHIFT(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const downloadExcelBodyUTTableData = () => {
    console.log("Downloading");
    if (selectedBodyUTTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedBodyUTTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD06S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedBodyUTTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleRMBatchChange = (value) => {
    handleClearAll(); // Clear individual entry fields when parent batch changes
    setrmBatchId(value); // Set the selected parent batch
    console.log(value)

    // Filter pipe list based on selected parent batch from the *already mill-filtered* allPipeNoList
    let newFilteredPipes = [];
    setBodyUTTable([]);
    setSelectedBodyUTTable(null);

    if (value) {
      newFilteredPipes = allPipeNoList.filter(pipe => pipe.parentCoilNo === value.value);
    } else {
      newFilteredPipes = allPipeNoList; // If no parent batch selected, show all pipes (from the selected mill)
      setrmBatchId(null); 
    }
    setFilteredPipeNoList(newFilteredPipes);

    if (newFilteredPipes.length > 0 && value !== null) {
      // Automatically select the first pipe from the filtered list
      handlePipeNoChange(newFilteredPipes[0]);
    } else {
      setPipeNo(null);
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setNxtproc("");
    }
  };

  const handleinspectorname = (value) => {
    setinspectorID(value);
  };

  // --- NEW HANDLER FOR MILL DROPDOWN ---
  const handleMillChange = (value) => {
    setSelectedMill(value);
    // Clear other related selections to avoid inconsistencies when mill changes
    setPipeNo(null);
    setrmBatchId(null);
    setBodyUTTable([]);
    setSelectedBodyUTTable(null);
    setFilteredPipeNoList([]); // Clear pipes until new ones are fetched

    setLoading(true);
    GetAuthorization().then((token) => {
      getAllPipeNoList(token.accessToken, value), // Re-fetch pipes based on new mill
      getRmList(token.accessToken, value) 
      .finally(() => {
          setLoading(false);
        });
    });
  };
  // --- END NEW HANDLER ---

  const handlePipeNoChange = (value) => {
    setPipeNo(value); // value is now the full object { label, value, parentCoilNo, mill }

    // Update rmBatchId based on the selected Pipe ID's parentCoilNo
    if (value && value.parentCoilNo) {
      setrmBatchId({ label: value.parentCoilNo, value: value.parentCoilNo });
    } else {
      // setrmBatchId(null); // Clear parent batch if pipe is cleared or has no parentCoilNo
    }
    setBodyUTTable([]);
    setSelectedBodyUTTable(null);
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([getOrdDetails(data.accessToken, value)]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      var url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tmm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tmm_accessToken", response.data.accessToken);
            localStorage.setItem(
              "tmm_refreshToken",
              response.data.refreshToken
            );
            resolve(response.data);
          }
        });
    });

  const validateUser = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    setLoading(true);
    try {
      var plant = "";

      {
        var userDetails = jwt.verify(
          localStorage.getItem("tmm_refreshToken"),
          serverDetails.REFRESH_KEY
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
      var pageName = "LD06S001";
      var authDetails = await getScreenAuth(plant, userId, pageName);
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
              "You are authorized to make changes from this page"
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page"
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page"
          );
        }
      } else {
        setRestricted(true);
        setAdmin(false);
      }
    } catch {
      setRestricted(true);
      setAdmin(false);
      if (serverDetails.devMode == false) {
        window.location.href = "#/signin";
      }
    } finally {
      setLoading(false);
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      var url = "api/users/screenAuth";

      if (serverDetails.devMode == true) {
        //(userId = "198447"), (pageName = "TSMCPPF001");
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          reject(null);
        } else {
          var encryptUserInfo = response.data;
          var authDetails = jwt.verify(
            encryptUserInfo,
            serverDetails.SCREEN_AUTH_KEY
          );
          if (authDetails) {
            resolve(authDetails);
          } else {
            reject(null);
          }
        }
      });
    });

  const handleResultChange = (value) => {
    setSelectedResult(value);
  };

  const handleUTRemarkChange = (value) => {
    setUtRemark(value.value);
    setLUT_REMARK(value);
  };

    const handleRemarkChange = (value) => {
      setLREMARK(value);
      setRemark(value.value)
      // setREMARK(value.value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];

  const optList = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];
  const optList2 = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "NA", value: "NA" },
  ];

  const handleClearMain = (newToken = false) => {
                 setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    handleClearAll();
    setSelectedMill(null); // --- MODIFIED: Clear selected mill ---
    setPipeNo("");
    setUtRemark("");
    setrmBatchId("");
    setinspectorID("");
    setSHIFT_DATE("");
    setSHIFT("");
    setSalesOrdNo("");
    setPoNo("");
    // --- MODIFIED: Re-fetch all pipes (or default mill) after clearing ---
    setLoading(true);
    GetAuthorization().then((token) => {
      getAllPipeNoList(token.accessToken, null), // Fetch all pipes as if no mill was selected
      getRmList(token.accessToken, null) 
      .finally(() => {
          setLoading(false);
        });
    });
    // --- END MODIFIED ---

    const prodDateInput = document.getElementById("Pdate");
    if (prodDateInput) {
      prodDateInput.value = null;
    }

    const prodStartDateInput = document.getElementById("prodStartDate");
    if (prodStartDateInput) {
      prodStartDateInput.value = "";
    }

    const prodEndDateInput = document.getElementById("prodEndDate");
    if (prodEndDateInput) {
      prodEndDateInput.value = "";
    }
    setBodyUTTable([]);
    setSelectedResult([]);
    setSelectedBodyUTTable(null);
  };

  const handleClearAll = (newToken = false) => {
                 setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setInspector("");
    setUtRemark("");
    setinspectorID("");
    //setPoNo("")
    setNoInd("");
    setRESULT("");
    setFEnd("");
    setDate("");
    setShift("");
    setIsExBatch("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setMUTResult("");
    setRemark("");
    setUtRemark("");
    setLUT_REMARK("");
    setLREMARK("");
    setRemark("");
    setCRemark("");
    setTEnd("");
    setRemark("");
    setUtRemark("");
    setBodyUTTable([]);
    setSelectedBodyUTTable(null);
    setSelectedResult([]);
  };

  const getPoNo = async (rmbatch, accessToken, value) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      RM_BATCH: rmbatch.value ? rmbatch.value : "",
      PIPE_NO: value.value ? value.value : "",
    };
    console.log("datarm", data);

    var url = "api/LD06S001/getPoNo";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_ORDER_CUS;
            obj.value = row.LOM_ID_ORDER_CUS;
            items.push(obj);
          });
          //console.log("pono",items[0].value)
          setPoNo(items[0].value);
          //setMaterial(items[0].value);
          Promise.all([]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getOrdDetails = async (accessToken, pipeno) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      //RM_BATCH: value.value ? value.value : "",
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    console.log("datarm", data);

    var url = "api/LD02S001/getOrderDetails";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          var orditem = [];
          var custname = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_ORDER_CUS;
            obj.value = row.LOM_ID_ORDER_CUS;
            items.push(obj);
          });
          response.data.map((row) => {
            console.log(row);
            var obj1 = new Object();
            obj1.label = row.LOM_ID_ORD_ITEM_CUS;
            obj1.value = row.LOM_ID_ORD_ITEM_CUS;
            orditem.push(obj1);
          });
          response.data.map((row) => {
            console.log(row);
            var obj2 = new Object();
            obj2.label = row.ENC_CUST_NAME;
            obj2.value = row.ENC_CUST_NAME;
            custname.push(obj2);
          });
          console.log("items", items[0].value);
          setOrdNo(items[0].value);
          setOrdItem(orditem[0].value);
          setCustName(custname[0].value);

          Promise.all([]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const clearFilterOnDate = () => {
    setBodyUTTable([]);
    setSelectedBodyUTTable(null);
  };

  // const bindBODYUTData = async () => {
  //   debugger
  //   try {
  //     setLoading(true);
  //     setBodyUTTable([]);
  //     setSelectedBodyUTTable(null);
  //     var prodStartDateInput = document.getElementById("prodStartDate").value;
  //     var prodEndDateInput = document.getElementById("prodEndDate").value;
  //     var currentTime = new Date();
  //     var prodEndDateCheck = new Date(prodEndDateInput);

  //     //if productionendDt is greater than currentdate check
  //     if (prodEndDateCheck > currentTime) {
  //       alertify.error(
  //         "The selected end date is greater than the current time."
  //       );
  //       setLoading(false);
  //       return;
  //     }
  //     //if startdt is greater than endDt
  //     if (new Date(prodStartDateInput) >= new Date(prodEndDateInput)) {
  //       alertify.error("Start time should be before end time");
  //       setLoading(false);
  //       return;
  //     }


  //     if (prodStartDateInput == "") {
  //       alertify.error("Please select Prod Start Dt");
  //       setLoading(false);
  //       return;
  //     }
  //     if (prodEndDateInput == "") {
  //       alertify.error("Please select Prod End Dt");
  //       setLoading(false);
  //       return;
  //     }

  //     var hoursDifference =
  //     (new Date(prodEndDateInput) - new Date(prodStartDateInput)) / (1000 * 60 * 60);
  //     console.log('currentTime--------- >',currentTime);
  //     console.log('prodStartDateInput-- >',prodStartDateInput);
  //   if (hoursDifference > 5) {
  //     alertify.error(
  //       "Date and Time difference should not be more than 5 Hrs"
  //     );
  //     setLoading(false);
  //     return;
  //   }

  //     // let data = {
  //     //   rmBatchId: rmBatchId ? rmBatchId : "",
  //     //   Result: selectedResult ? selectedResult : "",
  //     //   // Inspector: inspector ? inspector : "",
  //     //   Inspector: inspectorID ? inspectorID : "",
  //     //   prodstartdt: prodStartDateInput.value ? prodStartDateInput.value : "",
  //     //   prodenddt: prodEndDateInput.value ? prodEndDateInput.value : "",
  //     // };

  //     let data = {
  //       rmBatchId: rmBatchId ? rmBatchId.value : "",
  //       Result: selectedResult ? selectedResult.value : "",
  //       Inspector: inspectorID ? inspectorID : "",
  //       prodstartdt: prodStartDateInput ? prodStartDateInput : "",
  //       prodenddt: prodEndDateInput ? prodEndDateInput : "",
  //       mill: selectedMill?.value || "", // --- MODIFIED: Add selected mill to the request ---
  //     };

  //     console.log("DATA60", data);

  //     if (data.rmBatchId == "" || data.Inspector == "" || data.Result == "") {
  //       alertify.error("All feilds marked * are mandatory. Kindly Fill");
  //       return;
  //     }

  //     if (
  //       !noInd ||
  //       !FEnd ||
  //       !mutresult ||
  //       !TEnd ||
  //       !Cremark ||
  //       !utRemark ||
  //       !remark
  //     ) {
  //       alertify.error("All feilds marked * are mandatory. Kindly Fill");
  //       return;
  //     }

  //     const token = await GetAuthorization();
  //     const defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + token.accessToken,
  //       },
  //     };

  //     const currentDate = new Date();
  //     const formattedDate = formatDateToDDMMYYYY(new Date());
  //     const formattedTime = currentDate.toTimeString().split(" ")[0];

  //     let requestData = {
  //       RM_BATCH: rmBatchId?.value || "",
  //       STATUS: "6C",
  //       MILL: selectedMill?.value || "", // --- MODIFIED: Add selected mill to the request ---
  //     };

  //     if (pipeno && pipeno.value) {
  //       requestData.PIPE_NO = pipeno.value;
  //     } else {
  //       requestData.PIPE_NO = "";
  //     }

  //     console.log("requestData: ", requestData);

  //     let response = await axiosAPI.post(
  //       "api/LD06S001/getFillData",
  //       requestData,
  //       defaultOptions
  //     );

  //     console.log("response", response);
  //     if (response.status !== 200 || !response.data) {
  //       throw new Error("Invalid response from API");
  //     }
  //     if (response.data.length == 0) {
  //       alertify.error("NO Data Found in V_BARE_PDO");
  //       return;
  //     }

  //     // let UTData = response.data.map((row) => ({
  //       let UTData = response.data.map((row) => {
  //         const noOfIndication = noInd ? parseInt(noInd, 10) : 0;
  //         let mutResultValue = mutresult ? mutresult?.value : "";

  //         if (noOfIndication === 0) {
  //           mutResultValue = "NA";
  //         }
  //         return {
  //       CURR_PROC: "6",
  //       NXT_PROC: row.NEXT_PROC || "",
  //       PIPE_NO: row.TBP_BATCH_NO || "",
  //       HEAT: row.HEAT || "",
  //       OD: row.TBP_PIPE_OD_10 || "0",
  //       THICK: row.TBP_PIPE_THK_10 || "0",
  //       LENGTH: row.TBP_PIPE_LNG_10 || "0",
  //       MATERIAL: row.TBP_NO_MATNR || "",
  //       DATE: formattedDate,
  //       TIME: formattedTime,
  //       INSPECTOR: inspector || "",
  //       NO_OF_IND: noInd || "",
  //       MUT_RESULT: mutResultValue,
  //       MUT_F_END: FEnd?.value || "",
  //       MUT_T_END: TEnd?.value || "",
  //       RESULT: selectedResult.value || "",
  //       REMARK: remark || "",
  //       CALIB_REMARK: Cremark || "",
  //       UT_REMARK: utRemark || "",
  //       ORDER_NO: row.ORDER_NO || "",
  //       ITEM: row.ITEM || "",
  //       CUST_NAME: row.CUST_NAME || "",
  //       PLAN_PROC: row.PLAN_PROC || "",
  //     // }));
  //   };
  // });

  //     setBodyUTTable(UTData);
  //   } catch (error) {
  //     alertify.error("Error fetching data...");
  //     setBodyUTTable([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const bindBODYUTData = async () => {
  try {
    setLoading(true);
    setBodyUTTable([]);
    setSelectedBodyUTTable(null);

    const prodStartDateInput = document.getElementById("prodStartDate").value;
    const prodEndDateInput = document.getElementById("prodEndDate").value;
    const currentTime = new Date();
    const prodEndDateCheck = new Date(prodEndDateInput);

    // 1. Date Validations
    if (!prodStartDateInput || !prodEndDateInput) {
      alertify.error("Production Start Date and End Date are mandatory.");
      setLoading(false);
      return;
    }

    if (prodEndDateCheck > currentTime) {
      alertify.error("The selected end date is greater than the current time.");
      setLoading(false);
      return;
    }

    if (new Date(prodStartDateInput) >= new Date(prodEndDateInput)) {
      alertify.error("Start time should be before end time");
      setLoading(false);
      return;
    }

    const hoursDifference =
      (new Date(prodEndDateInput) - new Date(prodStartDateInput)) / (1000 * 60 * 60);
    if (hoursDifference > 5) {
      alertify.error("Date and Time difference should not be more than 5 Hrs");
      setLoading(false);
      return;
    }

    // 2. Mandatory Field Validation (Conditional for Excel)
    if (uploadedExcelData.length === 0) {
      if (
        !rmBatchId ||
        !inspectorID ||
        !selectedResult ||
        !noInd ||
        !FEnd ||
        !mutresult ||
        !TEnd ||
        !Cremark ||
        !utRemark ||
        !remark
      ) {
        alertify.error("All fields marked * are mandatory for manual entry.");
        setLoading(false);
        return;
      }
    }

    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    const currentDate = new Date();
    const formattedDate = formatDateToDDMMYYYY(currentDate);
    const formattedTime = currentDate.toTimeString().split(" ")[0];

    let apiFetchedData = [];

    // 3. Fetch Data Logic
    if (uploadedExcelData.length > 0) {
            if (
        // !rmBatchId ||
        !inspectorID ||
        !selectedResult ||
        // !noInd ||
        !FEnd ||
        !mutresult ||
        !TEnd ||
        !Cremark ||
        !utRemark ||
        !remark
      ) {
        alertify.error("All fields marked * are mandatory for manual entry.");
        setLoading(false);
        return;
      }
      const uniquePipeNos = [
        ...new Set(uploadedExcelData.map((row) => row["Pipe_No"]).filter(Boolean)),
      ];

      for (const pipeNum of uniquePipeNos) {
        let dataForApi = {
          RM_BATCH: "XX",
          STATUS: "6C",
          mill: selectedMill?.value || "",
          PIPE_NO: pipeNum,
        };
        const response = await axiosAPI.post(
          "api/LD06S001/getFillData",
          dataForApi,
          defaultOptions
        );
        if (response.status === 200 && response.data && response.data.length > 0) {
          apiFetchedData.push(...response.data);
        }
      }
    } else {
      let data = {
        RM_BATCH: rmBatchId?.value || "XX",
        STATUS: "6C",
        mill: selectedMill?.value || "",
        PIPE_NO: pipeno?.value || "",
      };
      const response = await axiosAPI.post(
        "api/LD06S001/getFillData",
        data,
        defaultOptions
      );
      apiFetchedData = response.data;
    }

    if (!apiFetchedData || apiFetchedData.length === 0) {
      alertify.error("No Data Found in V_BARE_PDO");
      setLoading(false);
      return;
    }

    // 4. Create Map for Excel Overrides
    const excelDataMap = uploadedExcelData.reduce((acc, row) => {
      if (row["Pipe_No"]) acc[row["Pipe_No"]] = row;
      return acc;
    }, {});

    // 5. Map API results to Table Format
    let UTData = apiFetchedData.map((row) => {
      const excelRow = excelDataMap[row.TBP_BATCH_NO];

      // Merge Logic: Excel value > Form State
      const finalNoInd = excelRow?.["No Of Indication"] ?? noInd;
      const finalInsp = excelRow?.["Inspector Name"] ?? inspectorID?.label;
      
      const noOfIndication = finalNoInd ? parseInt(finalNoInd, 10) : 0;
      let mutResultValue = mutresult ? mutresult?.value : "";

      if (noOfIndication === 0) {
        mutResultValue = "NA";
      }

      return {
        CURR_PROC: "6",
        NXT_PROC: row.NEXT_PROC || "",
        PLAN_PROC: row.PLAN_PROC || "",
        TBP_PAR_COIL_NO: row.TBP_PAR_COIL_NO || "",
        PIPE_NO: row.TBP_BATCH_NO || "",
        HEAT: row.HEAT || "",
        OD: row.TBP_PIPE_OD_10 || "0",
        THICK: row.TBP_PIPE_THK_10 || "0",
        LENGTH: row.TBP_PIPE_LNG_10 || "0",
        MATERIAL: row.TBP_NO_MATNR || "",
        DATE: formattedDate,
        TIME: formattedTime,
        INSPECTOR: finalInsp || "",
        NO_OF_IND: finalNoInd,
        MUT_RESULT: mutResultValue,
        MUT_F_END: FEnd?.value || "",
        MUT_T_END: TEnd?.value || "",
        RESULT: selectedResult?.value || "",
        REMARK: remark || "",
        CALIB_REMARK: Cremark || "",
        UT_REMARK: utRemark || "",
        ORDER_NO: row.ORDER_NO || "",
        ITEM: row.ITEM || "",
        CUST_NAME: row.CUST_NAME || "",
      };
    });

    setBodyUTTable(UTData);
  } catch (error) {
    alertify.error("Error fetching data: " + error.message);
    setBodyUTTable([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    if (getBodyUTTable?.length > 0) {
      const table = new Tabulator("#BODYUTTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getBodyUTTable,
        columns: BODYUTColumn,
        height: 400,
        layout: "fitDataFill",
      });

      setSelectedBodyUTTable(table);
    } else {
      setSelectedBodyUTTable(null);
    }
  }, [getBodyUTTable]);

  const BODYUTColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "HEAT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "No. Of Ind",
    //   field: "NO_OF_IND",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    // },
    {
      title: "No Of Ind",
      field: "NO_OF_IND",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      // --- START MODIFICATION ---
      cellEdited: function(cell){
        const noOfIndValue = parseInt(cell.getValue(), 10);
        const row = cell.getRow();
        const currentMutResult = row.getData().MUT_RESULT;

        if (noOfIndValue === 0) {
          row.update({"MUT_RESULT": "NA"});
        } else {
          // If NO_OF_IND is not 0, and MUT_RESULT was "NA" (likely set by the 0 rule),
          // reset MUT_RESULT to "OK". Otherwise, leave it as is.
          if (currentMutResult === "NA") {
             row.update({"MUT_RESULT": "OK"});
          }
        }
      }
      // --- END MODIFICATION ---
    },
    {
      title: "Mut Result",
      field: "MUT_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
          NA: "NA",
        },
      },
      defaultValue: "OK",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        return value;
      },
    },
    {
      title: "Hold Reason",
      field: "HOLD_REASON",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      width: 150,
      validator: function (value, cell) {
        return value ? true : false;
      },
      editable: function (cell) {
        const resultValue = cell.getRow().getData().RESULT;
        return resultValue === "HOLD";
      },
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Result",
      field: "RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
          HOLD: "HOLD",
        },
      },
      defaultValue: "OK",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "UT Remark",
      field: "UT_REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Calib Remark",
      field: "CALIB_REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Mut F-End",
      field: "MUT_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "OK",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        return value;
      },
    },
    {
      title: "Mut T-End",
      field: "MUT_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "OK",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        return value;
      },
    },
    {
      title: "Curr Proc",
      field: "CURR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Nxt Proc",
      field: "NXT_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Date",
      field: "DATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceeditor: "input",
    },
    {
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Pipe OD",
      field: "OD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          value = parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Thick",
      field: "THICK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Remarks",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Material No",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order No.",
      field: "ORDER_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },

    {
      title: "Planned Proc",
      field: "PLAN_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
      {
      title: "TBP_PAR_COIL_NO",
      field: "TBP_PAR_COIL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      visible: false,    //CHANGEX
    },

    {
      title: "Inspector",
      field: "INSPECTOR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
  ];

  const getNxtProc = async (accessToken, pipeno) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      CURR_PROC: "6",
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    //console.log("status",data.status)
    var url = "api/LD03S001/getnxtproc";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.NXTPROC;
            obj.value = row.NXTPROC;
            items.push(obj);
          });
          setNxtproc(items[0].value);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const updateData = async (newToken = false) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    const token = await GetAuthorization();

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken, //localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedBodyUTTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }
    setLoading(true);
    const formatDate = (date) => {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear();
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      // const s = date.getSeconds().toString().padStart(2, '0');
      return `${d}-${m}-${y} ${h}:${min}`;
    };

    var prodStartDateVal = document.getElementById("prodStartDate").value;
    var prodEndDateVal = document.getElementById("prodEndDate").value;
    var startDate = new Date(prodStartDateVal);
    var endDate = new Date(prodEndDateVal);
    var prodstartdt = formatDate(startDate);
    var prodenddt = formatDate(endDate);

    var newData = [];
    selectedRows.forEach(function (item) {
        let finalParCoilNo = "";
    if (uploadedExcelData.length > 0) {
      // If Excel is used, prioritize the value from the table row data
      finalParCoilNo = item._row.data.TBP_PAR_COIL_NO ? item._row.data.TBP_PAR_COIL_NO : "";
    } else {
      // If manual entry, prioritize the rmBatchId state, fallback to row data
      finalParCoilNo = rmBatchId ? rmBatchId.value : item._row.data.TBP_PAR_COIL_NO;
    }
      newData.push({
        PLANT: "0780",
        BATCH_NO: item._row.data.PIPE_NO ? item._row.data.PIPE_NO : "",
        CD_PROC: item._row.data.CURR_PROC ? item._row.data.CURR_PROC : "",
        BATCH_PROC_NO: "6",
        NEXT_PROC: item._row.data.NXT_PROC ? item._row.data.NXT_PROC : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: SHIFT ? SHIFT : "",
        WEIGHT: "",
        STATUS: "6C",
        // PAR_COIL_NO: rmBatchId.value ? rmBatchId.value : "",
        // PAR_COIL_NO: rmBatchId ? rmBatchId.value : "",
        // PAR_COIL_NO: rmBatchId ? rmBatchId.value : item._row.data.TBP_PAR_COIL_NO, // Corrected to use rmBatchId.value //CHANGEX
         PAR_COIL_NO: finalParCoilNo, // Applied conditional logic here
        ID_FIRST_PAR: "",
        ID_ORDER_NO: item._row.data.ORDER_NO ? item._row.data.ORDER_NO : "",
        ITEM_NO: item._row.data.ITEM ? item._row.data.ITEM : "",
        QUALITY_CD: "",
        MATNR: item._row.data.MATERIAL ? item._row.data.MATERIAL : "",
        FLAG: "",
        START_DT: prodstartdt,
        END_DT: prodenddt,
        RESULT: item._row.data.RESULT ? item._row.data.RESULT : "",
        REMARK: item._row.data.REMARK ? item._row.data.REMARK : "",
        HEAT_NO: "",
        // INSP_NAME: inspector ? inspector : "",
        INSP_NAME: inspectorID.value ? inspectorID.value : "",
        // INSP_NAME: item._row.data.INSPECTOR ? item._row.data.INSPECTOR : "",
        PIPE_OD_10: item._row.data.OD ? item._row.data.OD : "",
        PIPE_THK_10: item._row.data.THICK ? item._row.data.THICK : "",
        PIPE_LNG_10: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        NO_IND_50: item._row.data.NO_OF_IND ? item._row.data.NO_OF_IND : 0,
        MUT_RESULT_50: item._row.data.MUT_RESULT
          ? item._row.data.MUT_RESULT
          : "",
        MUT_F_END_50: item._row.data.MUT_F_END ? item._row.data.MUT_F_END : "",
        MUT_T_END_50: item._row.data.MUT_T_END ? item._row.data.MUT_T_END : "",
        CALB_RMK_50: item._row.data.CALIB_REMARK
          ? item._row.data.CALIB_REMARK
          : "",
        UT_REMARK_50: item._row.data.UT_REMARK ? item._row.data.UT_REMARK : "",
        HOLD_RSN: item._row.data.HOLD_REASON ? item._row.data.HOLD_REASON : "",
        MILL: selectedMill?.value || "", // --- MODIFIED: Include mill in update payload ---
      });
    });

    let data = {
      selectedRowsData: newData,
    };
    var url = "api/LD06S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          var res = response.data[0][0];
          if (res == "Y") {
            //console.log("msg",res[0])
            alertify.success(response?.data?.[0]);
            // alertify.success("Row Inserted Successfully !!!");
            setBodyUTTable([]);
            setSelectedBodyUTTable(null);
            handleClearAll();
            handleClearMain();
            fetchDetails();
          } else {
            alertify.alert(response?.data[0]);
            // setBodyUTTable([]);
            // setSelectedBodyUTTable(null)
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
  
          if (json.length > 0) {
            setUploadedExcelData(json);
            alertify.success(`Successfully loaded ${json.length} rows from Excel.`);
          } else {
            alertify.error("No valid data found in the Excel file.");
            setUploadedExcelData([]);
          }
        } catch (error) {
          alertify.error("Error reading Excel file: " + error.message);
          setUploadedExcelData([]);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  
  const handleClearFileInput = () => {
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = "";
    }
    setUploadedExcelData([]);
  };
  
  // const handleDownloadTemplate = () => {
  //   const templateHeaders = [
  //     "Pipe_No", 
  //     "No Of Indication"
  //   ];
  //   const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "50-Inspec_Template");
  //   XLSX.writeFile(wb, "Inspection_50_Template.xlsx");
  // };
  
  
  const handleDownloadTemplate = () => {
      const templateHeaders = [
    "Pipe_No", 
    "No Of Indication"
    ];
  
    const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
    ws["!cols"] = [{ wch: 10 }, { wch: 14 }];    // Set column widths in the excel sheet
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Body UT Template");
    
    XLSX.writeFile(wb, "Body_UT_60_Template.xlsx");
  };


  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="60 - Body UT" />
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
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <Card>
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
                          Filter
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearMain(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>

                      
                     <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Mill
                        </MDTypography>
                        <ReactSelect
                          id="millList"
                          options={millOptions}
                          onChange={handleMillChange}
                          variant="h6"
                          value={selectedMill}
                        />
                      </Grid>
 
                      <Grid item xs={1.75}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Parent Batch*
                        </MDTypography>

                        <ReactSelect
                          id="rmList"
                          options={RMList}
                          onChange={handleRMBatchChange}
                          variant="h6"
                          value={rmBatchId}
                        />
                      </Grid>

                      <Grid item xs={1.75}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Pipe No
                        </MDTypography>

                        <ReactSelect
                          id="pipenoList"
                          options={filteredPipeNoList}
                          onChange={handlePipeNoChange}
                          variant="h6"
                          value={pipeno}
                        />
                      </Grid>



                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Prod Start Date *
                        </MDTypography>

                        <input
                          type="datetime-local"
                          //step="1" // Allows selection of seconds
                          style={{ height: "37px" }}
                          id="prodStartDate"
                        />
                      </Grid>

                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Prod End Date *
                        </MDTypography>

                        <input
                          type="datetime-local"
                          //step="1" // Allows selection of seconds
                          style={{ height: "37px" }}
                          id="prodEndDate"
                          onChange={(e) => {
                            var d = new Date(e.target.value);
                            var d = new Date(e.target.value);
                            // Extract components
                            var year = d.getFullYear();
                            var month = ("0" + (d.getMonth() + 1)).slice(-2); // Months are 0-based
                            var day = ("0" + d.getDate()).slice(-2);
                            var hours = ("0" + d.getHours()).slice(-2);
                            var minutes = ("0" + d.getMinutes()).slice(-2);
                            //var seconds = ('0' + d.getSeconds()).slice(-2);

                            // Format to Oracle date string
                            var oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;

                            //console.log(oracleDate);
                            getTataDate(oracleDate);
                            clearFilterOnDate();
                          }}
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
                          {" "}
                          Prod Date *
                        </MDTypography>
                        <MDInput
                          name="Pdate"
                          iseditable="false"
                          value={SHIFT_DATE}
                        />
                      </Grid>
                      <Grid item xs={1} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Shift
                        </MDTypography>
                        <MDInput
                          name="Shift"
                          iseditable="false"
                          value={SHIFT}
                        />
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
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
                          Entry of Body UT
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Show Elements">
                          <IconButton
                            color="white"
                            aria-label="toggle"
                            onClick={() => setExpanded(!expanded)}
                          >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>
                  {expanded && (
                    <MDBox px={3} py={3}>
                      <Grid container spacing={2}>
                        {/* <Grid item xs={0.7}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Nxt Proc*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="nxtproc"
                            disabled={true}
                            value={nxtproc}
                            readOnly={true}
                            onChange={(e) => setNxtproc(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={0.7}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Curr Proc*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="nxtproc2"
                            disabled={true}
                            value={nxtproc2}
                            readOnly={true}
                            onChange={(e) => setNxtproc2(e.target.value)}
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
                            Inspector*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="inspector"
                            value={inspector}
                            onChange={(e) => {
                              setInspector(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid> */}

                        <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                           Inspector*
                        </MDTypography>

                        <ReactSelect
                          id="isnplistList"
                          options={inspectorname}
                          onChange={handleinspectorname}
                          variant="h6"
                          value={inspectorID}
                        />
                      </Grid>

                        {/* <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Order No*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="ordNo"
                            value={ordNo}
                            onChange={(e) => {
                              setOrdNo(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={0.7}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Order Item*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="ordItem"
                            value={ordItem}
                            onChange={(e) => {
                              setOrdItem(e.target.value);
                              setTableNull();
                            }}
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
                            Cust Name*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="custName"
                            value={custName}
                            onChange={(e) => {
                              setCustName(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid> */}
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            No of Indication
                          </MDTypography>
                          <MDInput
                            label=""
                            name="No Of Indication"
                            value={noInd}
                            onChange={(e) => {
                              setNoInd(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        {/* <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Date
                          </MDTypography>
                          <DatePicker
                            id="Dt"
                            value={date}
                            onChange={(date) => {
                              setDate(date);
                              setTableNull();
                            }}
                          />
                        </Grid> */}

                        {/* <Grid item xs={1.3}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Iss.Ex.Batch*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="issexBatch"
                            value={issexBatch}
                            onChange={(e) => setIsExBatch(e.target.value)}
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
                          Material
                        </MDTypography>
                        <MDInput
                          label=""
                          name="material"
                          value={material}
                          disabled={true}
                          onChange={(e) => setMaterial(e.target.value)}
                        />
                      </Grid> */}
                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Calib Remark*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="remark"
                            value={Cremark}
                            onChange={(e) => {
                              setCRemark(e.target.value);
                              setTableNull();
                            }}
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
    UT Remark*
  </MDTypography>
  <ReactSelect
    options={UTResultType}
    // onChange={handleUTRemarkChange} 
    onChange={(e) => {
      handleUTRemarkChange(e);
      setTableNull();
    }}// Use the correct handler
    value={LUT_REMARK}
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
    Remark*
  </MDTypography>
  <ReactSelect
    options={remarklist}
    // onChange={handleRemarkChange} 
    onChange={(e) => {
      handleRemarkChange(e);
      setTableNull();
    }}// Use the correct handler
    value={LREMARK}
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
                            UT Remark*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="utRemark"
                            value={utRemark}
                            onChange={(e) => {
                              setUtRemark(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Remark*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="remark"
                            value={remark}
                            onChange={(e) => {
                              setRemark(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid> */}
                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            MUT Result*
                          </MDTypography>
                          <ReactSelect
                            options={optList2}
                            onChange={(e) => {
                              setMUTResult(e);
                              setTableNull();
                            }}
                            value={mutresult}
                          />
                          {/* <MDInput
                            label=""
                            name="mutresult"
                            value={mutresult}
                            onChange={(e) => {
                              setMUTResult(e.target.value);
                              setTableNull();
                            }}
                          /> */}
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
                            MUT F-END
                          </MDTypography>
                          <ReactSelect
                            options={optList}
                            onChange={(e) => {
                              setFEnd(e);
                              setTableNull();
                            }}
                            value={FEnd}
                          />
                          {/* <MDInput
                            label=""
                            name="FEnd"
                            value={FEnd}
                            onChange={(e) => {
                              setFEnd(e.target.value);
                              setTableNull();
                            }}
                          /> */}
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
                            MUT T-END*
                          </MDTypography>
                          <ReactSelect
                            options={optList}
                            onChange={(e) => {
                              setTEnd(e);
                              setTableNull();
                            }}
                            value={TEnd}
                          />
                          {/* <MDInput
                            label=""
                            name="TEnd"
                            value={TEnd}
                            onChange={(e) => {
                              setTEnd(e.target.value);
                              setTableNull();
                            }}
                          /> */}
                        </Grid>
                        <Grid item xs={1.4}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Result*
                          </MDTypography>
                          <ReactSelect
                            options={ResultType}
                            onChange={(e) => {
                              handleResultChange(e);
                              setTableNull();
                            }}
                            value={selectedResult}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => bindBODYUTData()}
                          >
                            Fill Data
                          </MDButton>
                        </Grid>

                        <Grid item xs={2.8}>
                           {/* Space */}
                        </Grid>

                        {/* Inside the expanded MDBox of Entry of Inspection card */}
<Grid item xs={2.5} style={{ zIndex: 0 }}>
  <MDTypography
    fontWeight="regular"
    fontSize="small"
    textTransform="capitalize"
    variant="h6"
    color={"dark"}
    noWrap
  >
    Upload Inspection Data (Excel)
  </MDTypography>
  <MDInput
    type="file"
    inputRef={excelFileInputRef}
    onChange={handleExcelUpload}
    onClick={handleClearFileInput}
    accept=".xlsx, .xls"
    sx={{ width: "100%", marginTop: "0.5rem" }}
    helperText={
      uploadedExcelData.length > 0
        ? `${uploadedExcelData.length} items loaded.`
        : ""
    }
  />
</Grid>

<Grid item xs={2}>
  <MDButton
    style={{ marginTop: "2rem" }}
    size="small"
    color="success"
    onClick={handleDownloadTemplate}
  >
    Download Template
  </MDButton>
</Grid>
                      </Grid>
                    </MDBox>
                  )}
                </Card>
              </Grid>

              <Grid item xs={12}>
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
                          Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => updateData(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelBodyUTTableData()}
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
                        {getBodyUTTable?.length > 0 && (
                          <div id="BODYUTTableContainer" />
                        )}

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getBodyUTTable.length} of{" "}
                          {getBodyUTTable.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
