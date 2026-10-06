import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
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
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "../../tabulatorCss.scss";
import * as XLSX from "xlsx";

export default function TubePlanning() {
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


  const [pipenoList, setPipeNoList] = useState([]);

  const [RMList, setRMList] = useState([]); // Options for Parent Batch dropdown
  const [rmBatchId, setrmBatchId] = useState(null); // Selected Parent Batch value
  const [allPipeNoList, setAllPipeNoList] = useState([]); // All pipe numbers fetched from API for the selected mill
  const [filteredPipeNoList, setFilteredPipeNoList] = useState([]); // Pipe numbers displayed in dropdown (filtered by parent batch)
  const [pipeno, setPipeNo] = useState(null); // Selected Pipe ID value
  const [selectedMill, setSelectedMill] = useState({ label: "", value: "" }); // Added MILL state

  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("3");
  const [inspector, setInspector] = useState("");
  const [result, setResult] = useState([]);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [pono, setPoNo] = useState("");
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [selectedCalibDt, setSelectedCalibDt] = useState(null);
  const [selectedCalibDueDt, setSelectedCalibDueDt] = useState(null);
  const [selectedShiftDt, setSelectedShiftDt] = useState(null);
  const [SHIFT, setSHIFT] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  //const [selectedShift, setSelectedShift] = React.useState(null);
  const [issexBatch, setIsExBatch] = useState("");
  const [gaugeId, setGaugeId] = useState("");
  const [gaugeId2, setGaugeId2] = useState("");
  const [gaugerange, setGaugeRange] = useState("");
  const [material, setMaterial] = useState("");
  const [remark, setRemark] = useState("");
  const [getHydraTable, setHydraTable] = useState([]);
  const [expanded, setExpanded] = useState(true);
  const [selectedHydraTable, setSelectedHydraTable] = useState(null);
  //const [valueRadio, setValueRadio] = React.useState("3C");
  const [holdRsnOps, setHoldRsnOps] = useState([]);

  const [uploadedExcelData, setUploadedExcelData] = useState([]);
  const excelFileInputRef = useRef(null);

  var customerTable = React.createRef();

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
      var pageName = "LD03S001";
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
          getAllPipeNoList(data.accessToken, selectedMill.value), // Pass selectedMill.value here
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
    getHoldRsn();
  }, []);

  const getRmList = async (accessToken, millValue) => {
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
      status: "3C",
      mill : millValue, // Use the mill value passed
    };
    //console.log("status",data.status)
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

  const getNxtProc = async (accessToken, pipeno) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      CURR_PROC: "3",
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
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

  const getAllPipeNoList = async (accessToken, millValue) => { // millValue is now a required parameter
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "3C",
      rmBatch: rmBatchId ? rmBatchId.value : "", // Use current rmBatchId state
      mill : millValue, // Use the mill value passed
    };
    var url = "api/LD02S001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            obj.parentCoilNo = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });

          setAllPipeNoList(items); // Store all pipes for the current mill

          // Filter based on existing rmBatchId, if any. If mill changed, rmBatchId should be null here.
          if (rmBatchId) {
            setFilteredPipeNoList(items.filter(pipe => pipe.parentCoilNo === rmBatchId.value));
          } else {
            setFilteredPipeNoList(items); // If no parent batch, show all pipes for the new mill
          }
          setPipeNo(null); // Clear selected pipe ID to avoid showing a pipe that might not exist in the new mill's list
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

  const getHoldRsn = async () => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      setLoading(true);
      let data = {};
      var url = "api/LD02S001/getHoldRsn";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            console.log(response.data);
            let options = response?.data?.map((row, index) => {
              return {
                key: index,
                value: row["CD_VALUE"],
                label: row["CD_VALUE"] + " - " + row["CD_DESC"],
              };
            });
            setHoldRsnOps(options);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleMillChange = (value) => {
    setSelectedMill(value);
    setrmBatchId(null); // Clear parent batch
    setPipeNo(null);    // Clear pipe ID
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setHydraTable([]);
    setSelectedHydraTable(null);
    // Fetch new pipe list for the selected mill, with no parent batch initially
    GetAuthorization().then((token) => {
      getAllPipeNoList(token.accessToken, value.value); // Pass the new mill value
    getRmList(token.accessToken, value.value);
    });
  };


  const handleRMBatchChange = (value) => {
    // debugger
    setrmBatchId(value); // Set the selected parent batch
    setPipeNo(null); // Clear selected Pipe ID when Parent Batch changes

    // Filter pipe list based on selected parent batch
    let newFilteredPipes = [];
    if (value) {
      newFilteredPipes = allPipeNoList.filter(pipe => pipe.parentCoilNo === value.value);
    } else {
      newFilteredPipes = allPipeNoList; // If no parent batch selected, show all pipes for the current mill
    }
    setFilteredPipeNoList(newFilteredPipes);

    setHydraTable([]);
    setSelectedHydraTable(null);
    handleClearVal(true);

    // Removed auto-selection logic based on user preference
  };


  const handlePipeNoChange = (value) => {
    setPipeNo(value); // value is now the full object { label, value, parentCoilNo }

    // Update rmBatchId based on the selected Pipe ID's parentCoilNo
    if (value && value.parentCoilNo) {
      setrmBatchId({ label: value.parentCoilNo, value: value.parentCoilNo });
    } else {
      // setrmBatchId(null); // Clear parent batch if pipe is cleared or has no parentCoilNo
    }

    setHydraTable([]);
    setSelectedHydraTable(null);
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

  const handleClearVal = (newToken = false) => {
             setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setNxtproc("");
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setInspector("");
    setSelectedResult(null);
    setSelectedCalibDt(null);
    setSelectedCalibDueDt(null);
    setSelectedShiftDt(null);
    setGaugeId("");
    setGaugeId2("");
    setGaugeRange("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setRemark("");
    setHydraTable([]);
    setSelectedHydraTable(null);
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

  const updateData = async (newToken = false) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    const token = await GetAuthorization();

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    var selectedRows = selectedHydraTable.getSelectedRows();
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
        CD_PROC: item._row.data.CUR_PROC ? item._row.data.CUR_PROC : "",
        BATCH_PROC_NO: "3",
        NEXT_PROC: item._row.data.NXT_PROC ? item._row.data.NXT_PROC : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: selectedShift ? selectedShift : "",
        WEIGHT: "",
        STATUS: "3C",
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
        REMARK: item._row.data.REMARKS ? item._row.data.REMARKS : "",
        HEAT_NO: "",
        INSP_NAME: item._row.data.INSPECTOR ? item._row.data.INSPECTOR : "",
        PIPE_OD_10: item._row.data.OD ? item._row.data.OD : "",
        PIPE_THK_10: item._row.data.THICK ? item._row.data.THICK : "",
        PIPE_LNG_10: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        GAUGE_ID: item._row.data.GAUGE_ID ? item._row.data.GAUGE_ID : "",
        GAUGE_ID_2: item._row.data.GAUGE_ID_2 ? item._row.data.GAUGE_ID_2 : "",
        CALIB_DT: item._row.data.CALIB_DT ? item._row.data.CALIB_DT : "",
        CALIB_DUE_DT: item._row.data.CALIB_DUE_DT
          ? item._row.data.CALIB_DUE_DT
          : "",
        GAUGE_RANGE: item._row.data.GAUGE_RANGE
          ? item._row.data.GAUGE_RANGE
          : "",
        HOLD_RSN: item._row.data.HOLD_REASON ? item._row.data.HOLD_REASON : "",
      });
    });

    let data = {
      selectedRowsData: newData,
    };
    console.log('insertTempData',data)
    var url = "api/LD03S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        console.log(response?.data);
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
          return;
          //alertify.error(response.data);
        } else {
          var res = response.data[0][0];
          if (res == "Y") {
            alertify.success(response?.data?.[0]);
            // alertify.success("Row Inserted Successfully !!!");
            setSelectedHydraTable(null);
            setHydraTable([]);
            handleClearAll();
            handleClearMain();
            fetchDetails();
          } else {
            //alertify.error("Row Insertion Failed");
            alertify.alert(response?.data[0]);
            // setSelectedHydraTable(null)
            // setHydraTable([])
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleClearAll = (newToken = false) => {
             setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setInspector("");
    setSelectedResult(null); // Changed to null for ReactSelect
    setSelectedCalibDt(null);
    setSelectedCalibDueDt(null);
    setSelectedShiftDt(null);
    setGaugeId("");
    setGaugeId2("");
    setGaugeRange("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setRemark("");
    setSHIFT_DATE("");
    setHydraTable([]);
    setSelectedHydraTable(null);
  };

  const clearFilterOnDate = () => {
    setHydraTable([]);
    setSelectedHydraTable(null);
  };

  const handleClearMain = (newToken = false) => {
             setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setPipeNo(null); // Changed from "" to null for ReactSelect
    setrmBatchId(null); // Changed from "" to null for ReactSelect
    setSelectedMill({ label: "", value: "" }); // Reset mill to default
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setSalesOrdNo("");
    setHydraTable([]);
    setSelectedHydraTable(null);
    // After clearing, refetch pipe list for the default mill and no parent batch
    GetAuthorization().then((token) => {
      getAllPipeNoList(token.accessToken, ""); // Refetch with default mill
      getRmList(token.accessToken, "");
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

  useEffect(() => {
    if (getHydraTable?.length > 0) {
      const table = new Tabulator("#hydraTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getHydraTable,
        columns: hydraColumn,
        height: 400,
        layout: "fitDataFill",
      });

      setSelectedHydraTable(table);
    } else {
      setSelectedHydraTable(null);
    }
  }, [getHydraTable]);

  // const bindHydraData = async () => {
  //   try {
  //     setLoading(true);
  //     setHydraTable([]);
  //     setSelectedHydraTable(null);

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


  //     let data = {
  //       rmBatchId: rmBatchId ? rmBatchId.value : "",
  //       Result: selectedResult ? selectedResult.value : "",
  //       Inspector: inspector ? inspector : "",
  //       prodstartdt: prodStartDateInput ? prodStartDateInput : "",
  //       prodenddt: prodEndDateInput ? prodEndDateInput : "",
  //     };

  //     console.log("DATA30", data);

  //     if (data.rmBatchId == "" || data.Inspector == "" || data.Result == "") {
  //       alertify.error("All Feilds marked * are mandatory. Kindly Fill.");
  //       return;
  //     }
  //     if (
  //       gaugeId === "" ||
  //       gaugeId2 === "" ||
  //       gaugerange === "" ||
  //       remark === "" ||
  //       selectedCalibDt === null ||
  //       selectedCalibDueDt === null
  //     ) {
  //       alertify.error("All Feilds marked * are mandatory. Kindly Fill.");
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
  //         .replace(/ /g, " - ");
  //     };

  //     const formattedDate = formatDateToDDMMYYYY(new Date());
  //     const formattedTime = new Date().toTimeString().split(" ")[0];
  //     const calibdate = formatDate(selectedCalibDt);
  //     const calibduedate = formatDate(selectedCalibDueDt);

  //     let requestData = {
  //       RM_BATCH: rmBatchId?.value || "",
  //       STATUS: "3C",
  //       mill: selectedMill.value, // Pass the selected mill
  //     };

  //     if (pipeno && pipeno.value) {
  //       requestData.PIPE_NO = pipeno.value;
  //     } else {
  //       requestData.PIPE_NO = "";
  //     }

  //     console.log("requestData: ", requestData);

  //     let response = await axiosAPI.post(
  //       "api/LD03S001/getFillData",
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

  //     let dummyData = response.data.map((row) => ({
  //       CUR_PROC: nxtproc2 ? nxtproc2 : "",
  //       NXT_PROC: row.NEXT_PROC || "",
  //       PLAN_PROC: row.PLAN_PROC || "",
  //       PIPE_NO: row.TBP_BATCH_NO || "",
  //       OD: row.TBP_PIPE_OD_10 || "0",
  //       THICK: row.TBP_PIPE_THK_10 || "0",
  //       LENGTH: row.TBP_PIPE_LNG_10 || "0",
  //       MATERIAL: row.TBP_NO_MATNR || "",
  //       DATE: formattedDate,
  //       TIME: formattedTime,
  //       INSPECTOR: inspector || "",
  //       CALIB_DT: calibdate || "",
  //       CALIB_DUE_DT: calibduedate || "",
  //       GAUGE_ID: gaugeId || "",
  //       GAUGE_ID_2: gaugeId2 || "",
  //       GAUGE_RANGE: gaugerange || "",
  //       RESULT: selectedResult.value || "",
  //       REMARKS: remark || "",
  //       ORDER_NO: row.ORDER_NO || "",
  //       ITEM: row.ITEM || "",
  //       CUST_NAME: row.CUST_NAME || "",
  //     }));

  //     setHydraTable(dummyData);
  //     return dummyData;
  //   } catch (error) {
  //     alertify.error("Error fetching data.");
  //     setHydraTable([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const bindHydraData = async () => {
  try {
    setLoading(true);
    setHydraTable([]);
    setSelectedHydraTable(null);

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
    // If no Excel is uploaded, validate the form fields
    if (uploadedExcelData.length === 0) {
      if (
        !rmBatchId ||
        !inspector ||
        !selectedResult ||
        !gaugeId ||
        !gaugeId2 ||
        !gaugerange ||
        !remark ||
        !selectedCalibDt ||
        !selectedCalibDueDt
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
    // const formattedDate = formatDateToDDMMYYYY(currentDate);
    // const formattedTime = currentDate.toTimeString().split(" ")[0];

    let apiFetchedData = [];

    // 3. Data Fetching Logic
    if (uploadedExcelData.length > 0) {
          
      if (
        // !rmBatchId ||
        !inspector ||
        !selectedResult ||
        !gaugeId ||
        !gaugeId2 ||
        !gaugerange ||
        !remark ||
        !selectedCalibDt ||
        !selectedCalibDueDt
      ) {
        alertify.error("All fields marked * are mandatory for manual entry.");
        setLoading(false);
        return;
      }
    

      // Process unique Pipe Numbers from Excel
      const uniquePipeNos = [
        ...new Set(uploadedExcelData.map((row) => row["Pipe_No"]).filter(Boolean)),
      ];

      for (const pipeNum of uniquePipeNos) {
        let dataForApi = {
          RM_BATCH: "XX",
          STATUS: "3C",
          mill: selectedMill.value,
          PIPE_NO: pipeNum,
        };
        
        const response = await axiosAPI.post(
          "api/LD03S001/getFillData",
          dataForApi,
          defaultOptions
        );

        if (response.status === 200 && response.data && response.data.length > 0) {
          apiFetchedData.push(...response.data);
        }
      }
    } else {
      // Standard Manual Fetch
      let data = {
        // RM_BATCH: rmBatchId?.value || "",
        RM_BATCH: rmBatchId.value ? rmBatchId.value : "XX", 
        STATUS: "3C",
        mill: selectedMill.value,
        PIPE_NO: pipeno?.value || "",
      };

      const response = await axiosAPI.post(
        "api/LD03S001/getFillData",
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

    // 5. Map API results to Table Format (Merging Excel data if available)
    // const calibdate = selectedCalibDt ? formatDateToDDMMYYYY(selectedCalibDt) : "";
    // const calibduedate = selectedCalibDueDt ? formatDateToDDMMYYYY(selectedCalibDueDt) : "";

          const formatDate = (dateString) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "";

        return date
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace("Sept", "Sep")
          .toUpperCase()
          .replace(/ /g, " - ");
      };

      const formattedDate = formatDateToDDMMYYYY(new Date());
      const formattedTime = new Date().toTimeString().split(" ")[0];
      const calibdate = formatDate(selectedCalibDt);
      const calibduedate = formatDate(selectedCalibDueDt);
    let finalTableData = apiFetchedData.map((row) => {
      const excelRow = excelDataMap[row.TBP_BATCH_NO];

      // Excel values take priority over form state
      return {
        CUR_PROC: nxtproc2 || "3",
        NXT_PROC: row.NEXT_PROC || "",
        PLAN_PROC: row.PLAN_PROC || "",
        TBP_PAR_COIL_NO: row.TBP_PAR_COIL_NO || "",
        PIPE_NO: row.TBP_BATCH_NO || "",
        OD: row.TBP_PIPE_OD_10 || "0",
        THICK: row.TBP_PIPE_THK_10 || "0",
        LENGTH: row.TBP_PIPE_LNG_10 || "0",
        MATERIAL: row.TBP_NO_MATNR || "",
        DATE: formattedDate,
        TIME: formattedTime,
        INSPECTOR: excelRow?.["Inspector Name"] || inspector || "",
        CALIB_DT: calibdate,
        CALIB_DUE_DT: calibduedate,
        GAUGE_ID: gaugeId || "",
        GAUGE_ID_2: gaugeId2 || "",
        GAUGE_RANGE: gaugerange || "",
        RESULT: excelRow?.["Result"] || selectedResult?.value || "",
        REMARKS: excelRow?.["Remarks"] || remark || "",
        ORDER_NO: row.ORDER_NO || "",
        ITEM: row.ITEM || "",
        CUST_NAME: row.CUST_NAME || "",
        HOLD_REASON: excelRow?.["Hold Reason"] || "",
      };
    });

    setHydraTable(finalTableData);
    alertify.success("Data loaded successfully.");
  } catch (error) {
    alertify.error("Error fetching data: " + error.message);
    setHydraTable([]);
  } finally {
    setLoading(false);
  }
};


  const setTableNull = () => {
    setHydraTable([]);
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

            setSHIFT_DATE(response.data?.[0]?.[1]);
            setSelectedShift(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
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

  const handleResultChange = (value) => {
    setSelectedResult(value);
  };
  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const hydraColumn = [
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
      formatter: "money",
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
      cellEdited: function (cell) {
        var row = cell.getRow();
        var resVal = cell.getValue();

        if (resVal === "OK" || resVal === "NOT OK") {
          row.update({
            HOLD_REASON: "",
          });
        }

        // updating bg of HOLD Reason based on result value
        row.getCell("HOLD_REASON").getElement().style["background-color"] =
          resVal === "HOLD" ? "#DA8EE7" : "white";
        row.getCell("HOLD_REASON").getElement().style["color"] =
          resVal === "HOLD" ? "#FFFFFF" : "black";
      },
    },
    {
      title: "Hold Reason",
      field: "HOLD_REASON",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "select",
      editorParams: {
        values: holdRsnOps,
      },
      validator: function (value, cell) {
        return value ? true : false;
      },
      editable: function (cell) {
        const resultValue = cell.getRow().getData().RESULT;
        return resultValue === "HOLD";
      },
      formatter: function (cell) {
        const value = cell.getValue();
        const resultValue = cell.getRow().getData().RESULT;
        if (resultValue === "HOLD") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
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
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Curr proc",
      field: "CUR_PROC",
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
      title: "Planned Proc",
      field: "PLAN_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
        {
      title: "TBP_PAR_COIL_NO",
      field: "TBP_PAR_COIL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      visible: false,    //CHANGEX
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
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Inspector",
      field: "INSPECTOR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },

    {
      title: "Calib Dt",
      field: "CALIB_DT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Calib Due Date",
      field: "CALIB_DUE_DT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Gauge ID 1",
      field: "GAUGE_ID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Gauge ID 2",
      field: "GAUGE_ID_2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Gauge Range",
      field: "GAUGE_RANGE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
  ];

  const downloadExcelHydraTableData = () => {
    console.log("Downloading");
    if (selectedHydraTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedHydraTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD03S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedHydraTable.download("xlsx", fileName, {
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
    "Pipe_No"
  ];

  const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
  ws["!cols"] = [{ wch: 10 }, { wch: 14 }];    // Set column widths in the excel sheet

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Hydro Testing Template");
  
  XLSX.writeFile(wb, "Hydro_Testing_30_Template.xlsx");
};



  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="30 - Hydro Testing" />
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
                          Hydro Testing
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
                    {/* New MILL dropdown */}
                    <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          MILL
                        </MDTypography>
                        <ReactSelect
                          id="millSelect"
                          options={[{ label: "MILL 1", value: "1" }, { label: "MILL 2", value: "2" }]}
                          onChange={handleMillChange}
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
                          Pipe ID
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
                          style={{ height: "37px" }}
                          id="prodEndDate"
                          onChange={(e) => {
                            var d = new Date(e.target.value);
                            var d = new Date(e.target.value);
                            var year = d.getFullYear();
                            var month = ("0" + (d.getMonth() + 1)).slice(-2);
                            var day = ("0" + d.getDate()).slice(-2);
                            var hours = ("0" + d.getHours()).slice(-2);
                            var minutes = ("0" + d.getMinutes()).slice(-2);
                            var oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;

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
                          value={selectedShift}
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
                          Entry of Hydra Testing
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
                        <Grid item xs={1.5}>
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

                        <Grid item xs={1.4}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Gauge Id 1*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="gaugeid"
                            value={gaugeId}
                            onChange={(e) => {
                              setGaugeId(e.target.value), setTableNull();
                            }}
                          />
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
                            Gauge Id 2*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="gaugeid2"
                            value={gaugeId2}
                            onChange={(e) => {
                              setGaugeId2(e.target.value), setTableNull();
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
                            Gauge Range*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="gaugerange"
                            value={gaugerange}
                            onChange={(e) => {
                              setGaugeRange(e.target.value), setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.7}>
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
                              setRemark(e.target.value), setTableNull();
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
                            Calib Date*{" "}
                          </MDTypography>
                          <DatePicker
                            id="frmDt"
                            value={selectedCalibDt}
                            onChange={(date) => {
                              setSelectedCalibDt(date), setTableNull();
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
                            Calib Due Date*{" "}
                          </MDTypography>
                          <DatePicker
                            id="frmDt"
                            value={selectedCalibDueDt}
                            onChange={(date) => {
                              setSelectedCalibDueDt(date), setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => bindHydraData()}
                          >
                            Fill Data
                          </MDButton>
                        </Grid>

                         <Grid item xs={6}>
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
                          HYDRO TESTING DATA
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
                            onClick={() => downloadExcelHydraTableData()}
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
                        {getHydraTable?.length > 0 && (
                          <div id="hydraTableContainer" />
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
                          Showing 1 to {getHydraTable.length} of{" "}
                          {getHydraTable.length} entries
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
