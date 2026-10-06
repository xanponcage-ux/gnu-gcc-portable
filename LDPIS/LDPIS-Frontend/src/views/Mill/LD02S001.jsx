import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
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
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { GetAuthorization } from "utils";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
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

  const [RMList, setRMList] = useState([]); // Options for Parent Batch dropdown
  const [rmBatchId, setrmBatchId] = useState(null); // Selected Parent Batch value
  const [allPipeNoList, setAllPipeNoList] = useState([]); // All pipe numbers fetched from API for the current mill
  const [filteredPipeNoList, setFilteredPipeNoList] = useState([]); // Pipe numbers displayed in dropdown (filtered by parent batch)
  const [pipeno, setPipeNo] = useState(null); // Selected Pipe ID value
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("2");
  const [inspector, setInspector] = useState("");
  const [RESULT, setRESULT] = useState([]);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [pono, setPoNo] = useState("");
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [SHIFT, setSHIFT] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [angle, setAngle] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [material, setMaterial] = useState("");
  const [remark, setRemark] = useState("");
  const [getEndFacingTable, setEndFacingTable] = useState([]);
  const [selectedEndFacingTable, setSelectedEndFacingTable] = useState(null);
  const [holdRsnOps, setHoldRsnOps] = useState([]);
  //const [valueRadio, setValueRadio] = React.useState("2C");
  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  //const [filter, setFilter] = useState(defaultHrForm);
  //const [rawMatData, setRawMatData] = React.useState([]);
  var customerTable = React.createRef();
  //const [orderwiseProd, setOrderwiseProd] = useState([]);
  const [orderwiseProdData, setOrderwiseProdData] = useState(null);
  const [expanded, setExpanded] = useState(true);
  
    const [uploadedExcelData, setUploadedExcelData] = useState([]);
    const excelFileInputRef = useRef(null);

  // New state for selected mill
  const [selectedMill, setSelectedMill] = useState({ label: "", value: "" });

  const [allValues, setAllValues] = useState({
    pipeNo: "",
    nxtproc: nxtproc ? nxtproc : "",
    inspector: "",
    result: "",
    pono: "",
    selectedCalibDt: null,
    selectedCalibDueDt: null,
    selectedShiftDt: null,
    selectedGaugeId: null,
    gaugerange: "",
    material: "",
    remark: "",
  });

  const MillType = [
    { label: "MILL 1", value: "1" },
    { label: "MILL 2", value: "2" },
  ];

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const fetchDetails = () => {
    setLoading(true);

    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);

        Promise.all([
          getRmList(data.accessToken, selectedMill), // Populates RMList
          getAllPipeNoList(data.accessToken, selectedMill), // Pass initial selectedMill
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };

  useEffect(() => {
    fetchDetails();
    getHoldRsn();
  }, []);

  // useEffect(() => {
  //  setInspector(serverDetails.PersonalNo);
  // }, []);

  const setTableNull = () => {
    setEndFacingTable([]);
  };

  // const getInspector = async (userid) => {

  //   setInspector(userid);

  // }

  const clearFilterOnDate = () => {
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
  };
  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD02S001/getTataDate";
      let data = {
        prodEndDt: value,
      };
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

  const downloadExcelRMTableData = () => {
    if (selectedEndFacingTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedEndFacingTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD02S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedEndFacingTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
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
      var pageName = "LD02S001";
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

  const updateApi = async (newToken = false) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    const token = await GetAuthorization();
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken, //localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedEndFacingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }

    // const formatDate = (dateString) => {
    //   if (!dateString) return "";

    //   const date = new Date(dateString);
    //   if (isNaN(date.getTime())) return "";

    //   return date.toLocaleDateString("en-GB", {
    //     day: "2-digit",
    //     month: "short",
    //     year: "numeric",
    //   }).replace("Sept", "Sep").toUpperCase().replace(/ /g, "-");
    // };
    const formatDate = (date) => {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear();
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      // const s = date.getSeconds().toString().padStart(2, '0');
      return `${d}-${m}-${y} ${h}:${min}`;
    };
    // var prodStartDateVal = formatDate(document.getElementById("prodStartDate").value);
    // var prodEndDateVal = formatDate(document.getElementById("prodEndDate").value);
    var currentTime = new Date();
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
        BATCH_PROC_NO: "2",
        NEXT_PROC: item._row.data.NXT_PROC ? item._row.data.NXT_PROC : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: selectedShift ? selectedShift : "",
        WEIGHT: "",
        STATUS: "2C",
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
        INSP_NAME: item._row.data.INSPECTOR ? item._row.data.INSPECTOR : "",
        PIPE_OD_10: item._row.data.PIPE_OD ? item._row.data.PIPE_OD : "",
        PIPE_THK_10: item._row.data.PIPE_THICK ? item._row.data.PIPE_THICK : "",
        PIPE_LNG_10: item._row.data.PIPE_LEN ? item._row.data.PIPE_LEN : "",
        ANGLE: item._row.data.ANGLE ? item._row.data.ANGLE : "",
        HOLD_RSN: item._row.data.HOLD_REASON ? item._row.data.HOLD_REASON : "",
      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    console.log('LD02S001',data);
    var url = "api/LD02S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error(response?.error?.response.data?.name);
        } else {
          var res = response.data[0][0];
          if (res == "Y") {
            alertify.success(response?.data?.[0]);
            setEndFacingTable([]);
            setSelectedEndFacingTable(null);
            handleMain();
            // fetchDetails(); // Removed as handleMain already calls it
          } else {
            //alertify.error(response?.data[0]);
            alertify.alert(response?.data[0]);
          }
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
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_ORDER_CUS;
            obj.value = row.LOM_ID_ORDER_CUS;
            items.push(obj);
          });
          response.data.map((row) => {
            var obj1 = new Object();
            obj1.label = row.LOM_ID_ORD_ITEM_CUS;
            obj1.value = row.LOM_ID_ORD_ITEM_CUS;
            orditem.push(obj1);
          });
          response.data.map((row) => {
            var obj2 = new Object();
            obj2.label = row.ENC_CUST_NAME;
            obj2.value = row.ENC_CUST_NAME;
            custname.push(obj2);
          });
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

  const getRmList = async (accessToken, currentMill = null) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "2C",
      mill: currentMill.value ? currentMill.value : "",
    };
    var url = "api/LD02S001/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
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
      CURR_PROC: "2",
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
          response.data.map((row) => {
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

  // Modified to accept a mill parameter
  const getAllPipeNoList = async (accessToken, currentMill = null ) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "2C",
      mill: currentMill.value ? currentMill.value : "",
      rmBatch: "",
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
            obj.parentCoilNo = row.LOM_ID_PAR_COIL_NO; // Store parent coil number
            items.push(obj);
          });

          setAllPipeNoList(items); // Store all pipes for the current mill

          // Re-filter if a parent batch is already selected, otherwise show all for the new mill
          if (rmBatchId && rmBatchId.value) {
            const reFilteredPipes = items.filter(pipe => pipe.parentCoilNo === rmBatchId.value);
            setFilteredPipeNoList(reFilteredPipes);
            // If the previously selected pipe is no longer in the new filtered list, clear it.
            if (pipeno && !reFilteredPipes.some(pipe => pipe.value === pipeno.value)) {
                setPipeNo(null);
                setOrdNo("");
                setOrdItem("");
                setCustName("");
                setNxtproc("");
            }
          } else {
              setFilteredPipeNoList(items); // If no parent batch selected, show all pipes for the new mill
              setPipeNo(null); // Clear pipe selection if no parent batch is selected
              setOrdNo("");
              setOrdItem("");
              setCustName("");
              setNxtproc("");
          }
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

  // New handler for mill change
  const handleMillChange = (value) => {
                 setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setSelectedMill(value); // Update the selected mill
    setrmBatchId(null); // Clear selected Parent Batch
    setPipeNo(null); // Clear selected Pipe ID
    setOrdNo(""); // Clear order details
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setEndFacingTable([]); // Clear table data
    setSelectedEndFacingTable(null);
    setSelectedShift(null); // Clear shift selection
    setSelectedResult(null); // Clear result selection
    setAngle(""); // Clear angle
    setInspector(""); // Clear inspector
    setSHIFT_DATE(null); // Clear shift date
    setMaterial(""); // Clear material
    setRemark(""); // Clear remark
    setRESULT(""); // Clear result

    // Clear input fields directly as handleClearVal might be too broad now
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

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        getAllPipeNoList(data.accessToken, value).finally(() => { // Call API with new mill value
          setLoading(false);
        });
        getRmList(data.accessToken, value).finally(() => { // Call API with new mill value
          setLoading(false);
        });
      });
    } else {
    //   // If mill selection is cleared (though ReactSelect usually doesn't allow this without a clear button)
    //   // setAllPipeNoList([]);
    //   // setFilteredPipeNoList([]);
    GetAuthorization().then((data) => {
      getAllPipeNoList(data.accessToken, "").finally(() => { // Call API with new mill value
        setLoading(false);
      });
      getRmList(data.accessToken, "").finally(() => { // Call API with new mill value
        setLoading(false);
      });
    });
    }
  }
  ;


  const handleRMBatchChange = (value) => {
    // debugger
    setrmBatchId(value); // Set the selected parent batch
    console.log(value)

    // Filter pipe list based on selected parent batch
    let newFilteredPipes = [];
    if (value) {
      newFilteredPipes = allPipeNoList.filter(pipe => pipe.parentCoilNo === value.value);
    } else {
      newFilteredPipes = allPipeNoList; // If no parent batch selected, show all pipes for the current mill
    }
    setFilteredPipeNoList(newFilteredPipes);

    // Clear UI specific fields, but not the mill or parent batch itself
    setPipeNo(null); // Clear selected Pipe ID
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    setSelectedShift(null);
    setSelectedResult(null);
    setAngle("");
    setInspector("");
    setSHIFT_DATE(null);
    setMaterial("");
    setRemark("");
    setRESULT("");

    // Clear input fields directly as handleClearVal might be too broad now
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

    if (newFilteredPipes.length > 0 && value !== null) {
      // If there are filtered pipes and a parent batch is selected, try to select the first one.
      // This will trigger handlePipeNoChange and update details.
      handlePipeNoChange(newFilteredPipes[0]);
    }
    // If no pipes match the filter or parent batch is cleared, pipeno is already set to null above.
  };

  const handlePipeNoChange = (value) => {
    setPipeNo(value); // value is now the full object { label, value, parentCoilNo }

    // If a pipe is selected, ensure rmBatchId is consistent or set if null.
    // Only update rmBatchId if it's currently null or if the selected pipe's parent coil number differs from the current rmBatchId.
    if (value && value.parentCoilNo && (!rmBatchId || rmBatchId.value !== value.parentCoilNo)) {
      setrmBatchId({ label: value.parentCoilNo, value: value.parentCoilNo });
    } else if (!value) {
      // If pipe is cleared, and rmBatchId was implicitly set by a pipe selection (i.e., not manually chosen), clear rmBatchId too.
      // This logic is a bit tricky; for simplicity, if a pipe is cleared, we reset rmBatchId as well, assuming it was tied.
      // If rmBatchId was explicitly selected, the user would re-select it.
      // setrmBatchId(null);
    }

    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    // handleClearVal(true); // Do not call handleClearVal here, as it might clear rmBatchId which was just set.
    // Clear other related fields more granularly
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setSelectedShift(null);
    setSelectedResult(null);
    setAngle("");
    setInspector("");
    setSHIFT_DATE(null);
    setMaterial("");
    setRemark("");
    setRESULT("");

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
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    setNxtproc("");
    setSelectedShift(null);
    setSelectedResult(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setAngle("");
    setInspector("");
    setSHIFT_DATE(null);
    setRemark("");
    setRESULT("");
    // Do NOT clear rmBatchId or pipeno here, as this is often called for partial clears.
    // Use handleMain for a full clear.
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

  const handleMain = (newToken = false) => {
                 setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    // Reset all fields to their initial empty/default state
    setPipeNo(null);
    setrmBatchId(null);
    setSelectedMill({ label: "MILL 1", value: "1" }); // Explicitly reset mill
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    setSelectedShift(null);
    setSelectedResult(null);
    setAngle("");
    setInspector("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setSHIFT_DATE(null);
    setMaterial("");
    setRemark("");
    setRESULT("");
    setAllPipeNoList([]); // Clear all pipes as mill is reset
    setFilteredPipeNoList([]); // Clear filtered pipes

    // Clear input fields
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

    // After resetting all states, re-fetch initial data for the default mill.
    // This will implicitly call getAllPipeNoList for MILL 1 and getRmList.
    fetchDetails(); // Re-initialize data for the default MILL 1
  };


  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (getEndFacingTable?.length > 0) {
      const table = new Tabulator("#endFacingTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getEndFacingTable,
        columns: endFacingColumn,
        height: 400,
        layout: "fitDataFill",
      });

      setSelectedEndFacingTable(table);
    } else {
      setSelectedEndFacingTable(null);
    }
  }, [getEndFacingTable]);

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

  // const bindEndFacingData = async () => {
  //   try {
  //     setLoading(true);
  //     setEndFacingTable([]);
  //     setSelectedEndFacingTable(null);
  //     var prodStartDateInput = document.getElementById("prodStartDate").value;
  //     var prodEndDateInput = document.getElementById("prodEndDate").value;
  //     var currentTime = new Date();

  //     //if productionendDt is greater than currentdate check
  //     var prodEndDateCheck = new Date(prodEndDateInput);

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

  //                        var hoursDifference =
  //                        (new Date(prodEndDateInput) - new Date(prodStartDateInput)) / (1000 * 60 * 60);
  //                        console.log('currentTime--------- >',currentTime);
  //                        console.log('prodStartDateInput-- >',prodStartDateInput);
  //                      if (hoursDifference > 5) {
  //                        alertify.error(
  //                          "Date and Time difference should not be more than 5 Hrs"
  //                        );
  //                        setLoading(false);
  //                        return;
  //                      }

  //     let data = {
  //       rmBatchId: rmBatchId ? rmBatchId.value : "",
  //       Result: selectedResult ? selectedResult.value : "",
  //       Inspector: inspector ? inspector : "",
  //       prodstartdt: prodStartDateInput ? prodStartDateInput : "",
  //       prodenddt: prodEndDateInput ? prodEndDateInput : "",
  //     };

  //     if (data.rmBatchId == "") {
  //       alertify.error("Please enter Batch Id!");
  //       return;
  //     }
  //     if (data.Inspector == "") {
  //       alertify.error("Please enter Inspector!");
  //       return;
  //     }
  //     if (data.Result == "") {
  //       alertify.error("Please select Result!");
  //       return;
  //     }
  //     if (angle == "") {
  //       alertify.error("Please enter Angle value!");
  //       return;
  //     }
  //     if (remark == "") {
  //       alertify.error("Please enter Remarks!");
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

  //     const currentDate = new Date();
  //     const formattedDate = formatDateToDDMMYYYY(currentDate);
  //     const formattedTime = currentDate.toTimeString().split(" ")[0];

  //     let requestData = {
  //       RM_BATCH: rmBatchId.value || "",
  //       STATUS: "2C",
  //       MILL: selectedMill.value, // Pass the selected mill value to the API
  //     };

  //     if (pipeno && pipeno.value) {
  //       requestData.PIPE_NO = pipeno.value;
  //     } else {
  //       requestData.PIPE_NO = "";
  //     }

  //     const response = await axiosAPI.post(
  //       "api/LD02S001/getFillData",
  //       requestData,
  //       defaultOptions
  //     );

  //     if (response.status !== 200 || !response.data) {
  //       throw new Error("Invalid response from API");
  //     }
  //     if (response.data.length == 0) {
  //       alertify.error("NO Data Found in V_BARE_PDO");
  //       return;
  //     }

  //     let dummyData = response.data.map((row) => ({
  //       CUR_PROC: nxtproc2 ? nxtproc2 : "",
  //       NXT_PROC: row.NEXT_PROC || "", //nxtproc ? nxtproc : "",
  //       PLAN_PROC: row.PLAN_PROC || "", //nxtproc ? nxtproc : "",
  //       //PIPE_NO: row.TBP_BATCH_NO || "",
  //       PIPE_NO: row.TBP_BATCH_NO || "",
  //       PIPE_OD: row.TBP_PIPE_OD_10 || "",
  //       PIPE_THICK: row.TBP_PIPE_THK_10 || "",
  //       PIPE_LEN: row.TBP_PIPE_LNG_10 || "",
  //       MATERIAL: row.TBP_NO_MATNR || "",
  //       ORDER_NO: row.ORDER_NO || "",
  //       ITEM: row.ITEM || "",
  //       CUST_NAME: row.CUST_NAME || "",
  //       DATE: formattedDate,
  //       TIME: formattedTime,
  //       INSPECTOR: inspector || "",
  //       ANGLE: angle || "",
  //       RESULT: selectedResult.value || "",
  //       REMARK: remark || "",
  //     }));
  //     setEndFacingTable(dummyData);
  //   } catch (error) {
  //     //console.error("Error fetching API data:", error);
  //     alertify.error("Error fetching data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const bindEndFacingData = async () => {
  try {
    setLoading(true);
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);

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
      if (!rmBatchId) {
        alertify.error("Please enter Batch Id!");
        setLoading(false);
        return;
      }
      if (!inspector) {
        alertify.error("Please enter Inspector!");
        setLoading(false);
        return;
      }
      if (!selectedResult) {
        alertify.error("Please select Result!");
        setLoading(false);
        return;
      }
      if (angle === "") {
        alertify.error("Please enter Angle value!");
        setLoading(false);
        return;
      }
      if (remark === "") {
        alertify.error("Please enter Remarks!");
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

    // 3. Data Fetching Logic
    if (uploadedExcelData.length > 0) {

      // if (!rmBatchId) {
      //   alertify.error("Please enter Batch Id!");
      //   setLoading(false);
      //   return;
      // }
      if (!inspector) {
        alertify.error("Please enter Inspector!");
        setLoading(false);
        return;
      }
      if (!selectedResult) {
        alertify.error("Please select Result!");
        setLoading(false);
        return;
      }
      if (angle === "") {
        alertify.error("Please enter Angle value!");
        setLoading(false);
        return;
      }
      if (remark === "") {
        alertify.error("Please enter Remarks!");
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
          STATUS: "2C",
          MILL: selectedMill.value,
          PIPE_NO: pipeNum,
        };

        const response = await axiosAPI.post(
          "api/LD02S001/getFillData",
          dataForApi,
          defaultOptions
        );

        if (response.status === 200 && response.data && response.data.length > 0) {
          apiFetchedData.push(...response.data);
        }
      }
    } else {
      // Standard Manual Fetch
      let requestData = {
        RM_BATCH: rmBatchId?.value || "",
        STATUS: "2C",
        MILL: selectedMill.value,
        PIPE_NO: pipeno?.value || "",
      };

      const response = await axiosAPI.post(
        "api/LD02S001/getFillData",
        requestData,
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
    let finalTableData = apiFetchedData.map((row) => {
      const excelRow = excelDataMap[row.TBP_BATCH_NO];

      // Excel values take priority over form state where applicable
      return {
        CUR_PROC: nxtproc2 ? nxtproc2 : "",
        NXT_PROC: row.NEXT_PROC || "",
        PLAN_PROC: row.PLAN_PROC || "",
        TBP_PAR_COIL_NO: row.TBP_PAR_COIL_NO || "",
        PIPE_NO: row.TBP_BATCH_NO || "",
        PIPE_OD: row.TBP_PIPE_OD_10 || "",
        PIPE_THICK: row.TBP_PIPE_THK_10 || "",
        PIPE_LEN: row.TBP_PIPE_LNG_10 || "",
        MATERIAL: row.TBP_NO_MATNR || "",
        ORDER_NO: row.ORDER_NO || "",
        ITEM: row.ITEM || "",
        CUST_NAME: row.CUST_NAME || "",
        DATE: formattedDate,
        TIME: formattedTime,
        INSPECTOR: excelRow?.["Inspector"] || inspector || "",
        ANGLE: excelRow?.["Angle"] || angle || "",
        RESULT: excelRow?.["Result"] || selectedResult?.value || "",
        REMARK: excelRow?.["Remark"] || remark || "",
        HOLD_REASON: excelRow?.["Hold Reason"] || "",
      };
    });

    setEndFacingTable(finalTableData);
    alertify.success("Data loaded successfully.");
  } catch (error) {
    alertify.error("Error fetching data: " + error.message);
    setEndFacingTable([]);
  } finally {
    setLoading(false);
  }
};


  const endFacingColumn = [
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
      field: "PIPE_OD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      title: "Pipe Thick",
      field: "PIPE_THICK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Pipe Len",
      field: "PIPE_LEN",
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
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Material No",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      title: "Next Proc",
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
      title: "Inspector",
      field: "INSPECTOR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Angle",
      field: "ANGLE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
  ];

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
    XLSX.utils.book_append_sheet(wb, ws, "End Facing Template");
    
    XLSX.writeFile(wb, "End_Facing_20_Template.xlsx");
  };


  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="20 - End Facing" />
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
          <MDBox pt={0} pb={0} py={10}>
            <Grid container spacing={5}>
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
                          Filter
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleMain(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                                                                  {/* NEW MILL DROPDOWN */}
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
                          id="millList"
                          options={MillType}
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
                          Pipe ID
                        </MDTypography>

                        <ReactSelect
                          id="pipenoList"
                          options={filteredPipeNoList} // Use filtered list for display
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

                      {/* <Grid item xs={1.2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Shift*
                        </MDTypography>
                        <ReactSelect
                          options={ShiftType}
                          onChange={(e) => {
                            handleShiftChange(e);
                          }}
                          value={selectedShift}
                        />
                      </Grid> */}
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <MDBox px={3} py={2}>
                    <Grid container spacing={2}>
                      {/* Cause Curr proc, next proc is now added in grid */}
                      {/* <Grid item xs={0.7}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          disabled={true}
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
                          onChange={(e) => setNxtproc()}
                        />
                      </Grid>
                      <Grid item xs={0.7}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          disabled={true}
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

                      <Grid item xs={1.3}>
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

                      {/* Cause order, item, cust name is now added in grid */}
                      {/* <Grid item xs={1}>
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
                          Ord Item*
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
                      <Grid item xs={1.6}>
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

                      <Grid item xs={0.7}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Angle*{" "}
                        </MDTypography>
                        <MDInput
                          id="angle"
                          value={angle}
                          onChange={(e) => {
                            setAngle(e.target.value);
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
                          Remarks*
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
                      </Grid>

                      <Grid item xs={1} mt={3}>
                        <MDButton
                          //style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => bindEndFacingData()}
                        >
                          Fill Data
                        </MDButton>
                      </Grid>
                        <Grid item xs={1}>
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
                          End Facing Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => updateApi(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelRMTableData()}
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
                        {getEndFacingTable?.length > 0 && (
                          <div id="endFacingTableContainer" />
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
                          Showing 1 to {getEndFacingTable.length} of{" "}
                          {getEndFacingTable.length} entries
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
