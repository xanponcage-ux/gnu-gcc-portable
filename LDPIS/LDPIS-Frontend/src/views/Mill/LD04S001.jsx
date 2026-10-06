import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
// Material Dashboard 2 React components
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
import { GetAuthorization } from "utils";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import * as XLSX from "xlsx";

export default function TubePlanning() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [inspectorname, setinspectorname] = useState([]);
  const [inspectorID, setinspectorID] = useState(null);
  // const [inspList, setinspList] = useState([]);
  const [RMList, setRMList] = useState([]); // Options for Parent Batch dropdown
  const [rmBatchId, setrmBatchId] = useState(null); // Selected Parent Batch value
  const [allPipeNoList, setAllPipeNoList] = useState([]); // All pipe numbers fetched from API
  const [filteredPipeNoList, setFilteredPipeNoList] = useState([]); // Pipe numbers displayed in dropdown (filtered)
  const [pipeno, setPipeNo] = useState(null);
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("4");
  const [inspector, setInspector] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [obfend, setObFend] = useState("");
  const [resfend, setResFend] = useState("");
  const [SHIFT, setSHIFT] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  const [iexBatch, setIexBatch] = useState("");
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [pono, setPoNo] = useState("");
  const [obstend, setObsTEnd] = useState("");
  const [restend, setResTend] = useState("");
  const [result, setResult] = useState("");
  const [selectedResult, setSelectedResult] = React.useState([]);
  const [material, setMaterial] = useState("");
  const [remark, setRemark] = useState("");
  const [selectedCalibDueDt, setSelectedCalibDueDt] = useState(null);
  const [getMPITable, setMPITable] = useState([]);
  const [selectedMPITable, setSelectedMPITable] = useState(null);
  //const [valueRadio, setValueRadio] = React.useState("4C");
  const [expanded, setExpanded] = useState(true);
    const [uploadedExcelData, setUploadedExcelData] = useState([]);
    const excelFileInputRef = useRef(null);

  // New state for Mill selection
  const [selectedMill, setSelectedMill] = useState({ label: "", value: "" });
  const millOptions = [
    { label: "MILL 1", value: "1" },
    { label: "MILL 2", value: "2" },
  ];


  //const [filter, setFilter] = useState(defaultHrForm);
  //const [rawMatData, setRawMatData] = React.useState([]);
  var customerTable = React.createRef();

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
          getRmList(data.accessToken, selectedMill.value),
          getinspectorlist(data.accessToken),
          getAllPipeNoList(data.accessToken, selectedMill.value),
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

  const setTableNull = () => {
    setMPITable([]);
  };

  useEffect(() => {
    if (getMPITable?.length > 0) {
      const table = new Tabulator("#mpiTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getMPITable,
        columns: mpiColumn,
        height: 400,
        layout: "fitDataFill",
      });

      setSelectedMPITable(table);
    } else {
      setSelectedMPITable(null);
    }
  }, [getMPITable]);

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
      var pageName = "LD04S001";
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

  const getRmList = async (accessToken,mill) => {
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
      status: "4C",
      mill: mill,
    };
    //console.log("status",data)
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
      process: "40",
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

  const getPipeNoList = async (value, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "4C",
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

          // setPipeNoList(items); // This seems to be an old state variable
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


  const getAllPipeNoList = async (accessToken, mill) => { // Added 'mill' parameter
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "4C",
      rmBatch: "",
      mill: mill, // Pass the selected mill to the API
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
            obj.parentCoilNo = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });

          setAllPipeNoList(items); // Store all pipes
          setFilteredPipeNoList(items);

          // console.log("items30", items);
          // setPipeNoList(items);
          // if (items.length > 0) {
          //   setPipeNo(items[0]);
          // } else {
          //   setPipeNo(null);
          // }
          // Promise.all([
          //   getOrdDetails(accessToken, items[0]),
          //   getNxtProc(accessToken, items[0]),
          // ]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleRMBatchChange = (value) => {
    // handleClearMain(); // This might be too aggressive, better to selectively clear
    setrmBatchId(value); // Set the selected parent batch
    setPipeNo(null); // Clear selected Pipe No when Parent Batch changes
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setMPITable([]);
    setSelectedMPITable(null);


    // Filter pipe list based on selected parent batch
    let newFilteredPipes = [];
    if (value) {
      newFilteredPipes = allPipeNoList.filter(pipe => pipe.parentCoilNo === value.value);
    } else {
      newFilteredPipes = allPipeNoList; // If no parent batch selected, show all pipes
    }
    setFilteredPipeNoList(newFilteredPipes);

    if (newFilteredPipes.length > 0 && value !== null) {
      // Automatically select the first pipe from the filtered list
      // This will trigger handlePipeNoChange and update pipeno, rmBatchId, and other details.
      handlePipeNoChange(newFilteredPipes[0]);
    } else {
      setPipeNo(null); // Ensure pipeno is null if no pipes match
    }
    //console.log(rmBatchId);
  };

  const handleinspectorname = (value) => {
    setinspectorID(value);
  };


  const handlePipeNoChange = (value) => {
    setPipeNo(value); // value is now the full object { label, value, parentCoilNo }

    // Update rmBatchId based on the selected Pipe ID's parentCoilNo
    if (value && value.parentCoilNo) {
      setrmBatchId({ label: value.parentCoilNo, value: value.parentCoilNo });
    } else {
      // setrmBatchId(null); // Clear parent batch if pipe is cleared or has no parentCoilNo
    }

    setMPITable([]);
    setSelectedMPITable(null);
    // handleClearVal(true); // Do not call handleClearVal here, as it might clear rmBatchId which was just set.

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getOrdDetails(data.accessToken, value), // Pass the full object
          getNxtProc(data.accessToken, value), // Pass the full object
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      // If pipe is cleared, also clear order details and next proc
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setNxtproc("");
    }
  };

  const handleMillChange = (value) => {
    setSelectedMill(value);
    // Clear related fields when mill changes
    setrmBatchId(null);
    setPipeNo(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setMPITable([]);
    setSelectedMPITable(null);
    setFilteredPipeNoList([]); // Clear filtered pipes until new list is fetched

    setLoading(true);
    GetAuthorization().then((data) => {
      getAllPipeNoList(data.accessToken, value ? value.value : "").finally(() => {
        setLoading(false);
      });
      getRmList(data.accessToken, value ? value.value : "").finally(() => {
        setLoading(false);
      });
    });
  };


  const handleClearVal = (newToken = false) => {
    setMPITable([]);
    setSelectedMPITable(null);
    setSelectedShift("");
    setSHIFT_DATE(null);
    setInspector("");
    setObFend("");
    setResFend("");
    setObsTEnd("");
    setResTend("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setSHIFT("");
    setIexBatch("");
    setSelectedResult(null);
    setRemark("");

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
      CURR_PROC: "4",
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

  const handleClearMain = (newToken = false) => {
                 setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    handleClearAll();
    setPipeNo(null); // Changed from "" to null for ReactSelect
    setrmBatchId(null); // Changed from "" to null for ReactSelect
    setinspectorID(null); // Changed from "" to null for ReactSelect
    setSelectedMill({ label: "", value: "" }); // Reset mill to default
    setMPITable([]);
    setSelectedMPITable(null);
    setSelectedShift("");
    setSHIFT_DATE(null);
    setPoNo("");
    // When clearing main, re-fetch all pipes for the default mill
    GetAuthorization().then((data) => {
      getAllPipeNoList(data.accessToken, ""); // Assuming "MILL 1" is default
    });
    GetAuthorization().then((data) => {
      getRmList(data.accessToken, ""); // Assuming "MILL 1" is default
    });

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
  };

  const handleClearAll = (newToken = false) => {
                 setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setInspector("");
    setinspectorID(null); // Changed from "" to null for ReactSelect
    setObFend("");
    setResFend("");
    setObsTEnd("");
    setResTend("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setSelectedShift("");
    setIexBatch("");
    setSelectedResult(null); // Changed from null for ReactSelect
    setRemark("");
    setMPITable([]);
    setSelectedMPITable(null);
  };

  const handleResultChange = (value) => {
    setSelectedResult(value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];

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

    var selectedRows = selectedMPITable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }

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
        CD_PROC: item._row.data.CUR_PROC ? item._row.data.CUR_PROC : "",
        BATCH_PROC_NO: "4",
        NEXT_PROC: item._row.data.NXT_PROC ? item._row.data.NXT_PROC : "",
        // NEXT_PROC: nxtproc ? nxtproc : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: SHIFT ? SHIFT : "",
        WEIGHT: "",
        STATUS: "4C",
        // PAR_COIL_NO: rmBatchId.value ? rmBatchId.value : "",
        // PAR_COIL_NO: rmBatchId ? rmBatchId.value : "",
        // PAR_COIL_NO: rmBatchId ? rmBatchId.value : item._row.data.TBP_PAR_COIL_NO, // Corrected to use rmBatchId.value //CHANGEX
         PAR_COIL_NO: finalParCoilNo, // Applied conditional logic here
        ID_FIRST_PAR: "",
        ID_ORDER_NO: item._row.data.ORDER_NO ? item._row.data.ORDER_NO : "", //ordNo ? ordNo : "0",
        ITEM_NO: item._row.data.ITEM ? item._row.data.ITEM : "", //ordItem ? ordItem : "0",
        QUALITY_CD: "",
        MATNR: item._row.data.MATERIAL ? item._row.data.MATERIAL : "",
        FLAG: "",
        START_DT: prodstartdt,
        END_DT: prodenddt,
        RESULT: item._row.data.RESULT ? item._row.data.RESULT : "",
        REMARK: item._row.data.REMARK ? item._row.data.REMARK : "",
        HEAT_NO: "",
        INSP_NAME: inspectorID.value ? inspectorID.value : "",
        // INSP_NAME: item._row.data.INSPECTOR ? item._row.data.INSPECTOR : "",
        PIPE_OD_10: item._row.data.OD ? item._row.data.OD : "",
        PIPE_THK_10: item._row.data.THICK ? item._row.data.THICK : "",
        PIPE_LNG_10: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        OBSV_F_END: item._row.data.OBSV_F_END ? item._row.data.OBSV_F_END : "",
        OBSV_T_END: item._row.data.OBSV_T_END ? item._row.data.OBSV_T_END : "",
        RES_MG_F_END: item._row.data.RES_MG_F_END
          ? item._row.data.RES_MG_F_END
          : "",
        RES_MG_T_END: item._row.data.RES_MG_T_END
          ? item._row.data.RES_MG_T_END
          : "",
        HOLD_RSN: item._row.data.HOLD_REASON ? item._row.data.HOLD_REASON : "",
      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    var url = "api/LD04S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          var res = response.data[0][0];
          if (res == "Y") {
            alertify.success(response?.data?.[0]);
            // alertify.success("Row Inserted Successfully !!!");
            setMPITable([]);
            setSelectedMPITable(null);
            handleClearAll();
            handleClearMain();
            fetchDetails();
          } else {
            alertify.alert(response?.data[0]);
            // setMPITable([]);
            // setSelectedMPITable(null)
          }
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

  // const bindMPIData = async () => {
  //   debugger
  //   try {
  //     setLoading(true);
  //     setMPITable([]);
  //     setSelectedMPITable(null);
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


  //     var hoursDifference =
  //       (new Date(prodEndDateInput) - new Date(prodStartDateInput)) / (1000 * 60 * 60);
  //     console.log('currentTime--------- >', currentTime);
  //     console.log('prodStartDateInput-- >', prodStartDateInput);
  //     if (hoursDifference > 5) {
  //       alertify.error(
  //         "Date and Time difference should not be more than 5 Hrs"
  //       );
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

  //     let data = {
  //       rmBatchId: rmBatchId ? rmBatchId.value : "",
  //       Result: selectedResult ? selectedResult.value : "",
  //       Inspector: inspectorID ? inspectorID.value : "", // Use inspectorID.value
  //       prodstartdt: prodStartDateInput ? prodStartDateInput : "",
  //       prodenddt: prodEndDateInput ? prodEndDateInput : "",
  //       mill: selectedMill.value, // Pass the selected mill to getFillData
  //     };

  //     console.log("DATA40", data);

  //     if (data.rmBatchId == "" || data.Inspector == "" || data.Result == "") {
  //       alertify.error("All Fields marked * are mandatory. Kindly Fill.");
  //       setLoading(false); // Make sure to stop loading on error
  //       return;
  //     }
  //     if (!obfend || !restend || !obstend || !resfend || !remark) {
  //       alertify.error("All Fields marked * are mandatory. Kindly Fill.");
  //       setLoading(false); // Make sure to stop loading on error
  //       return;
  //     }
  //     const token = await GetAuthorization();
  //     const defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + token.accessToken,
  //       },
  //     };

  //     const formatDate = (dateString) => {
  //       if (!dateString) return "";

  //       const date = new Date(dateString);
  //       if (isNaN(date.getTime())) return "";

  //       return date
  //         .toLocaleDateString("en-GB", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "numeric",
  //         })
  //         .replace("Sept", "Sep")
  //         .toUpperCase()
  //         .replace(/ /g, "-");
  //     };

  //     const formattedDate = formatDateToDDMMYYYY(new Date());
  //     const formattedTime = new Date().toTimeString().split(" ")[0];

  //     // console.log("rmBatchId: ", rmBatchId);
  //     // console.log("pipeno: ", pipeno);

  //     let requestData = {
  //       RM_BATCH: rmBatchId?.value || "",
  //       STATUS: "4C",
  //       mill: selectedMill.value, // Pass the selected mill to getFillData
  //     };

  //     if (pipeno && pipeno.value) {
  //       requestData.PIPE_NO = pipeno.value;
  //     } else {
  //       requestData.PIPE_NO = "";
  //     }

  //     console.log("requestData: ", requestData);

  //     let response = await axiosAPI.post(
  //       "api/LD04S001/getFillData",
  //       requestData,
  //       defaultOptions
  //     );

  //     console.log("response", response);
  //     if (response.status !== 200 || !response.data) {
  //       throw new Error("Invalid response from API");
  //     }
  //     if (response.data.length == 0) {
  //       alertify.error("NO Data Found in V_BARE_PDO");
  //       setLoading(false); // Make sure to stop loading on error
  //       return;
  //     }

  //     let mpiData = response.data.map((row) => ({
  //       CUR_PROC: "4",
  //       NXT_PROC: row.NEXT_PROC || "",
  //       PIPE_NO: row.TBP_BATCH_NO || "",
  //       OD: row.TBP_PIPE_OD_10 || "0",
  //       THICK: row.TBP_PIPE_THK_10 || "0",
  //       LENGTH: row.TBP_PIPE_LNG_10 || "0",
  //       MATERIAL: row.TBP_NO_MATNR || "",
  //       DATE: formattedDate,
  //       TIME: formattedTime,
  //       OBSV_F_END: obfend || "0",
  //       OBSV_T_END: obstend || "0",
  //       RES_MG_F_END: resfend || "0",
  //       RES_MG_T_END: restend || "0",
  //       RESULT: selectedResult.value || "",
  //       REMARK: remark || "",
  //       ORDER_NO: row.ORDER_NO || "",
  //       ITEM: row.ITEM || "",
  //       CUST_NAME: row.CUST_NAME || "",
  //       PLAN_PROC: row.PLAN_PROC || "",
  //     }));

  //     setMPITable(mpiData);
  //     //return mpiData
  //     //setHydraTable(dummyData); // Update table data
  //   } catch (error) {
  //     console.error("Error in bindMPIData:", error);
  //     alertify.error("Error fetching data. " + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const bindMPIData = async () => {
  try {
    setLoading(true);
    setMPITable([]);
    setSelectedMPITable(null);

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
        !obfend ||
        !restend ||
        !obstend ||
        !resfend ||
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

    const formattedDate = formatDateToDDMMYYYY(new Date());
    const formattedTime = new Date().toTimeString().split(" ")[0];

    let apiFetchedData = [];

    // 3. Fetch Data Logic
    if (uploadedExcelData.length > 0) {

            if (
        !inspectorID ||
        !selectedResult ||
        !obfend ||
        // !restend ||
        !obstend ||
        // !resfend ||
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
          STATUS: "4C",
          mill: selectedMill.value,
          PIPE_NO: pipeNum,
        };
        const response = await axiosAPI.post(
          "api/LD04S001/getFillData",
          dataForApi,
          defaultOptions
        );
        if (response.status === 200 && response.data && response.data.length > 0) {
          apiFetchedData.push(...response.data);
        }
      }
    } else {
      let data = {
        RM_BATCH: rmBatchId?.value || "",
        STATUS: "4C",
        mill: selectedMill.value,
        PIPE_NO: pipeno?.value || "",
      };
      const response = await axiosAPI.post(
        "api/LD04S001/getFillData",
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
    let mpiData = apiFetchedData.map((row) => {
      const excelRow = excelDataMap[row.TBP_BATCH_NO];

      // Merge Logic: Excel value > Form State > Default "0"
      const finalResTend = excelRow?.["Res Mag T End(Gauss)"] ?? restend ?? "0";
      const finalResFend = excelRow?.["Res Mag F End(Gauss)"] ?? resfend ?? "0";

      return {
        CUR_PROC: "4",
        NXT_PROC: row.NEXT_PROC || "",
        PIPE_NO: row.TBP_BATCH_NO || "",
        OD: row.TBP_PIPE_OD_10 || "0",
        THICK: row.TBP_PIPE_THK_10 || "0",
        LENGTH: row.TBP_PIPE_LNG_10 || "0",
        MATERIAL: row.TBP_NO_MATNR || "",
        DATE: formattedDate,
        TIME: formattedTime,
        OBSV_F_END: obfend || "0",
        OBSV_T_END: obstend || "0",
        RES_MG_F_END: finalResFend,
        RES_MG_T_END: finalResTend,
        RESULT: selectedResult?.value || "",
        REMARK: remark || "",
        ORDER_NO: row.ORDER_NO || "",
        ITEM: row.ITEM || "",
        CUST_NAME: row.CUST_NAME || "",
        PLAN_PROC: row.PLAN_PROC || "",
        TBP_PAR_COIL_NO: row.TBP_PAR_COIL_NO || "",
      };
    });

    setMPITable(mpiData);
  } catch (error) {
    console.error("Error in bindMPIData:", error);
    alertify.error("Error fetching data: " + error.message);
  } finally {
    setLoading(false);
  }
};


  const mpiColumn = [
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
    },
    {
      title: "Pipe OD",
      field: "OD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      formatter: "money",
    },
    {
      title: "Remarks",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
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
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
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
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Curr Proc",
      field: "CUR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Nxt Proc",
      field: "NXT_PROC",
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
      title: "Material No",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Date",
      field: "DATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Obs F End",
      field: "OBSV_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },

    {
      title: "Obs T End ",
      field: "OBSV_T_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "RM F End",
      field: "RES_MG_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "RM T End",
      field: "RES_MG_T_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
  ];

  const clearFilterOnDate = () => {
    setMPITable([]);
    setSelectedMPITable(null);
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

  const downloadExcelMPITableData = () => {
    console.log("Downloading");
    if (selectedMPITable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedMPITable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD04S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedMPITable.download("xlsx", fileName, {
      sheetName: "Sheet1",
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
      "Res Mag T End(Gauss)",
      "Res Mag F End(Gauss)"
    ];
  
    const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
    ws["!cols"] = [{ wch: 10 }, { wch: 14 }];    // Set column widths in the excel sheet
  
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MPI Template");
    
    XLSX.writeFile(wb, "MPI_40_Template.xlsx");
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="40 - MPI" />
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
                          API PROCESS ENTRY
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

                    <Grid item xs={1.75}>
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
                          id="millSelect"
                          options={millOptions}
                          onChange={handleMillChange}
                          variant="h6"
                          value={selectedMill}
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
                          {/* Parent Batch* */}
                           {uploadedExcelData.length === 0 ? "Parent Batch*" : "Parent Batch"}
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
                          id="Pdate"
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

                      {/* <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Sales Ord No*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="salesOrdNo"
                          value={salesOrdNo}
                          onChange={(e) => setSalesOrdNo(e.target.value)}
                        />
                      </Grid> */}

                      {/* <Grid item xs={3}>
                            <FormControl>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Function
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueRadio}
                                //onChange={handleRadioChange}
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="4C"
                                  control={<Radio />}
                                  label="Normal"
                                />
                                <FormControlLabel
                                  value="4P"
                                  control={<Radio />}
                                  label="Hold"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid> */}

                      {/* <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                        >
                          Submit
                        </MDButton>
                      </Grid> */}
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
                          Magnetic Particle Testing
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
                            value={nxtproc}
                            disabled={true}
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
                            value={nxtproc2}
                            disabled={true}
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
                              setInspector(e.target.value), setTableNull();
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
                        {/* <Grid item xs={1.5}>
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
                        <Grid item xs={1.5}>
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

                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Obs F End*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="obfend"
                            value={obfend}
                            onChange={(e) => {
                              setObFend(e.target.value), setTableNull();
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
                            
                            {uploadedExcelData.length === 0 ? "Res Mag T End(Gauss)*" : "Res Mag T End(Gauss)"}
                          </MDTypography>
                          <MDInput
                            label=""
                            name="restend"
                            value={restend}
                            onChange={(e) => {
                              setResTend(e.target.value), setTableNull();
                            }}
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
                        {" "}
                        Shift Dt *
                      </MDTypography>
                      <MDInput name="Pdate" id="Pdate" iseditable="false" value={SHIFT_DATE} />
                    </Grid> */}

                        {/* <Grid item xs={1.4}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            I Ex Batch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="iexbatch"
                            value={iexBatch}
                            onChange={(e) => {
                              setIexBatch(e.target.value), setTableNull();
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
                            Obs T End*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="obstend"
                            value={obstend}
                            onChange={(e) => {
                              setObsTEnd(e.target.value), setTableNull();
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
                            
                             {uploadedExcelData.length === 0 ? "Res Mag F End(Gauss)*" : "Res Mag F End(Gauss)"}
                          </MDTypography>
                          <MDInput
                            label=""
                            name="resfend"
                            value={resfend}
                            onChange={(e) => {
                              setResFend(e.target.value), setTableNull();
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

                        {/* <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                         Material*
                        </MDTypography>
                        <MDInput
                          label=""z
                          disabled={true}
                          name="material"
                          value={material}
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
                            Remarks*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="remark"
                            value={remark}
                            onChange={(e) => {
                              setRemark(e.target.value), setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => bindMPIData()}
                          >
                            Fill Data
                          </MDButton>
                        </Grid>

                        <Grid item xs={6.5}>
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
                          Magnetic Particle Data
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
                            onClick={() => downloadExcelMPITableData()}
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
                        {getMPITable?.length > 0 && (
                          <div id="mpiTableContainer" />
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
                          Showing 1 to {getMPITable.length} of{" "}
                          {getMPITable.length} entries
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
