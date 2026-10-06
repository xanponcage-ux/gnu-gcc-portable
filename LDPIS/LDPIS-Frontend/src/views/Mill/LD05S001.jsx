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
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

  const [inspectorname, setinspectorname] = useState([]);
  const [inspectorID, setinspectorID] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);

  const [RMList, setRMList] = useState([]); // Options for Parent Batch dropdown
  const [rmBatchId, setrmBatchId] = useState(null); // Selected Parent Batch value
  const [allPipeNoList, setAllPipeNoList] = useState([]); // All pipe numbers fetched from API (specific to selected mill)
  const [filteredPipeNoList, setFilteredPipeNoList] = useState([]);
  const [mutresult, setMUTResult] = useState("");
  const [pono, setPoNo] = useState("");
  const [issexBatch, setIsExBatch] = useState("");
  const [getUPTable, setUPTable] = useState([]);
  const [selectedUPTable, setSelectedUPTable] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const [CURR_PROC, setCURR_PROC] = useState("50");
  const [NEXT_PROC, setNEXT_PROC] = useState("");
  const [INSP_NAME, setINSP_NAME] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [MATE_NO, setMATE_NO] = useState("");
  const [NO_IND, setNO_IND] = useState("");
  const [CALB_RMK, setCALB_RMK] = useState("");
  const [MUT_F_END, setMUT_F_END] = useState("");
  const [MUT_T_END, setMUT_T_END] = useState("");
  const [SHIFT, setSHIFT] = useState("");
  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  const [date, setDate] = useState(null);
  const [REMARK, setREMARK] = useState("");
  const [LREMARK, setLREMARK] = useState([]);
  const [UT_REMARK, setUT_REMARK] = useState("");
  const [LUT_REMARK, setLUT_REMARK] = useState([]);
  const [RESULT, setRESULT] = useState([]);
  const [UTremark, setUTremark] = useState([]);
  const [valueRadio, setValueRadio] = React.useState("5C");
  // Added state for Mill dropdown, defaulted to "MILL 1"
  const [selectedMill, setSelectedMill] = useState({ label: "", value: "" });

  const [uploadedExcelData, setUploadedExcelData] = useState([]);
const excelFileInputRef = useRef(null);

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
          getAllPipeNoList(data.accessToken, selectedMill.value), // Pass initial selectedMill
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
      var pageName = "LD05S001";
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

  const getRmList = async (accessToken, mill = selectedMill.value) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    let data = {
      status: "5C",
      mill: mill,
    };
    var url = "api/LD02S001/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
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

  const getinspectorlist = async (accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      process: "50",
    };
    // console.log("process--->", data)
    var url = "api/LD04S001/getinspectorlist";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          // console.log(response.data);
          response.data.map((row) => {
            // console.log(row);
            var obj = new Object();
            obj.label = row.INSPECTOR_NAME;
            obj.value = row.INSPECTOR_NAME;
            items.push(obj);
          });
          setinspectorname(items);
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
      status: "5C",
      rmBatch: value.value ? value.value : "",
    };
    var url = "api/LD05S001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            items.push(obj);
          });

          setPipeNoList(items);
          if (items.length > 0) {
            setPipeNo(items[0]);
          } else {
            setPipeNo(null);
          }
          Promise.all([
            getOrdDetails(accessToken, items[0]),
          ]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getAllPipeNoList = async (accessToken, mill = selectedMill.value) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "5C",
      rmBatch: "",
      mill: mill ? mill : "",
    };
    var url = "api/LD02S001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            obj.parentCoilNo = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });

          setAllPipeNoList(items); // Store all pipes for the selected mill
          setFilteredPipeNoList(items); // Initially show all pipes for the selected mill
          setPipeNo(null); // Clear selected pipe when mill data changes
          setrmBatchId(null); // Clear parent batch when mill data changes
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getPoNo = async (rmbatch, accessToken, value) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    let data = {
      RM_BATCH: rmbatch.value ? rmbatch.value : "",
      PIPE_NO: value.value ? value.value : "",
    };
    var url = "api/LD05S001/getPoNo";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_ORDER_CUS;
            obj.value = row.LOM_ID_ORDER_CUS;
            items.push(obj);
          });
          setPoNo(items[0].value);
          Promise.all([]);
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
      CURR_PROC: "5",
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    var url = "api/LD03S001/getnxtproc";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.NXTPROC;
            obj.value = row.NXTPROC;
            items.push(obj);
          });
          setNEXT_PROC(items[0].value);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleMillChange = (value) => {
    setSelectedMill(value);
    setPipeNo(null); // Clear selected pipe when mill changes
    setrmBatchId(null); // Clear parent batch when mill changes
    setUPTable([]); // Clear table data
    setSelectedUPTable(null); // Clear selected table rows
    setOrdNo(""); // Clear order details
    setOrdItem("");
    setCustName("");
    setSHIFT_DATE(null);
    setSHIFT("");

    setLoading(true);
    GetAuthorization().then((data) => {
      // Refetch all pipe numbers for the newly selected mill
      getAllPipeNoList(data.accessToken, value.value);
      getRmList(data.accessToken, value.value);
    }).finally(() => {
      setLoading(false);
    });
    // GetAuthorization().then((data) => {
    //   // Refetch all pipe numbers for the newly selected mill
    //   getRmList(data.accessToken, value.value);
    // }).finally(() => {
    //   setLoading(false);
    // });
  };

  const handleRMBatchChange = (value) => {
    setrmBatchId(value);
    setPipeNo(null); // Clear selected pipe when parent batch changes
    setUPTable([]); // Clear table data
    setSelectedUPTable(null); // Clear selected table rows
    setOrdNo(""); // Clear order details
    setOrdItem("");
    setCustName("");
    setSHIFT_DATE(null);
    setSHIFT("");

    // Filter pipe list based on selected parent batch from the pipes available for the current mill
    let newFilteredPipes = [];
    if (value) {
      newFilteredPipes = allPipeNoList.filter(pipe => pipe.parentCoilNo === value.value);
    } else {
      newFilteredPipes = allPipeNoList; // If no parent batch selected, show all pipes from current mill
    }
    setFilteredPipeNoList(newFilteredPipes);

    if (newFilteredPipes.length > 0 && value !== null) {
      handlePipeNoChange(newFilteredPipes[0]);
    }
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
      // setrmBatchId(null); // This case might occur if filtering clears the parent batch, but handleRMBatchChange already covers this.
    }
    setUPTable([]);
    setSelectedUPTable(null);
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([getOrdDetails(data.accessToken, value)]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      // If no pipe is selected, clear order details
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setSHIFT_DATE(null);
      setSHIFT("");
    }
  };

  const getOrdDetails = async (accessToken, pipeno) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    var url = "api/LD02S001/getOrderDetails";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
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

  const handleClearAll = (newToken = false) => {
         setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setINSP_NAME("");
    setinspectorID("");
    setDate(null);
    setIsExBatch("");
    setMUTResult("");
    setNO_IND("");
    setCALB_RMK("");
    setMUT_F_END("");
    setMUT_T_END("");
    setSHIFT_DATE(null);
    setREMARK("");
    setUT_REMARK("");
    setLREMARK("");
    setLUT_REMARK("");
    setRESULT("");
    setUTremark("");
    setUPTable([]); // Changed from [,] to [] for empty table
    setSelectedUPTable(null);
  };

  const handleClearMain = (newToken = false) => {
    handleClearAll();
     setUploadedExcelData([]);
  if (excelFileInputRef.current) {
    excelFileInputRef.current.value = "";
  }
    setPipeNo(null); // Changed from "" to null for ReactSelect
    setPoNo("");
    setrmBatchId(null); // Changed from "" to null for ReactSelect
    setinspectorID(null); // Changed from "" to null for ReactSelect
    setUPTable([]);
    setSelectedUPTable(null);
    setSHIFT("");
    setSHIFT_DATE(null);
    setSelectedMill({ label: "", value: "" }); // Reset mill to default

    setLoading(true);
    GetAuthorization().then((data) => {
      // Refetch all pipes for the default mill after clearing
      getAllPipeNoList(data.accessToken, "");
      getRmList(data.accessToken, "");
    }).finally(() => {
      setLoading(false);
    });
    // GetAuthorization().then((data) => {
    //   // Refetch all pipes for the default mill after clearing
    //   getRmList(data.accessToken, "");
    // }).finally(() => {
    //   setLoading(false);
    // });

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

  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${d}-${m}-${y} ${h}:${min}`;
  };

  const updateData = async (newToken = false) => {
    const token = await GetAuthorization();

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    var selectedRows = selectedUPTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }

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
        BATCH_PROC_NO: "5",
        NEXT_PROC: item._row.data.NXT_PROC ? item._row.data.NXT_PROC : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: SHIFT ? SHIFT : "",
        WEIGHT: "",
        STATUS: "5C",
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
        INSP_NAME: inspectorID.value ? inspectorID.value : "",
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
      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    var url = "api/LD05S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          var res = response.data[0][0];
          if (res == "Y") {
            alertify.success(response?.data?.[0]);
            setUPTable([]);
            setSelectedUPTable(null);
            handleClearAll();
            handleClearMain();
            fetchDetails();
          } else {
            alertify.error(response?.data[0]);
            return;
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

const bindUPData = async () => {
  try {
    setLoading(true);
    setUPTable([]);
    setSelectedUPTable(null);

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
      // console.log('rmBatchId.value',rmBatchId);

      if (
        !rmBatchId ||
        !inspectorID ||
        RESULT.length === 0 ||
        !NO_IND ||
        !MUT_F_END ||
        !mutresult ||
        !MUT_T_END ||
        !CALB_RMK ||
        !LUT_REMARK ||
        !LREMARK
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
        RESULT.length === 0 ||
        // !NO_IND ||
        !MUT_F_END ||
        !mutresult ||
        !MUT_T_END ||
        !CALB_RMK ||
        !LUT_REMARK ||
        !LREMARK
      ) {
        alertify.error("All fields marked * are mandatory for manual entry.");
        setLoading(false);
        return;
      }

      const uniquePipeNos = [
        ...new Set(uploadedExcelData.map((row) => row["Pipe_No"]).filter(Boolean)),
      ];

      for (const pipeNum of uniquePipeNos) {
        // console.log('inside',rmBatchId.value);
        let dataForApi = {
          RM_BATCH:  "XX" , 
          STATUS: "5C",
          mill: selectedMill.value,
          PIPE_NO: pipeNum,
        };
        const response = await axiosAPI.post(
          "api/LD05S001/getFillData",
          dataForApi,
          defaultOptions
        );
        if (response.status === 200 && response.data && response.data.length > 0) {
          apiFetchedData.push(...response.data);
        }
      }
    } else {
       console.log('Outside',rmBatchId.value);
      let data = {
        
        // RM_BATCH: rmBatchId.value,
        RM_BATCH: rmBatchId.value ? rmBatchId.value : "XX", 
        STATUS: "5C",
        mill: selectedMill.value,
        PIPE_NO: pipeno?.value || "",
      };
      const response = await axiosAPI.post(
        "api/LD05S001/getFillData",
        data,
        defaultOptions
      );
      apiFetchedData = response.data;
    }

    if (!apiFetchedData || apiFetchedData.length === 0) {
      alertify.error("No Data Found");
      setLoading(false);
      return;
    }

    // 4. Create Map for Excel Overrides
    const excelDataMap = uploadedExcelData.reduce((acc, row) => {
      if (row["Pipe_No"]) acc[row["Pipe_No"]] = row;
      return acc;
    }, {});

    // 5. Map API results to Table Format
    let UptData = apiFetchedData.map((row) => {
      const excelRow = excelDataMap[row.TBP_BATCH_NO];

      // Merge Logic: Excel value > Form State > Default
      const finalNoInd = excelRow?.["No Of Indication"] ?? NO_IND;
      const finalInsp = excelRow?.["Inspector Name"] ?? inspectorID?.value;
      
      const noOfIndication = finalNoInd ? parseInt(finalNoInd, 10) : 0;
      let mutResultValue = mutresult ? mutresult?.value : "";

      if (noOfIndication === 0) {
        mutResultValue = "NA";
      }

      return {
        CURR_PROC: "5",
        NXT_PROC: row.NEXT_PROC || "",
        PLAN_PROC: row.PLAN_PROC || "",
        TBP_PAR_COIL_NO: row.TBP_PAR_COIL_NO || "",
        PIPE_NO: row.TBP_BATCH_NO || "",
        HEAT: row.HEAT || "",
        OD: row.TBP_PIPE_OD_10 || "",
        THICK: row.TBP_PIPE_THK_10 || "",
        LENGTH: row.TBP_PIPE_LNG_10 || "",
        MATERIAL: row.TBP_NO_MATNR || "",
        DATE: formattedDate,
        TIME: formattedTime,
        NO_OF_IND: finalNoInd,
        INSP_NAME: finalInsp,
        MUT_RESULT: mutResultValue,
        UT_REMARK: UT_REMARK || "",
        CALIB_REMARK: CALB_RMK || "",
        MUT_F_END: MUT_F_END?.value || "",
        MUT_T_END: MUT_T_END?.value || "",
        SHIFT: SHIFT || "",
        REMARK: REMARK || "",
        RESULT: RESULT.value || "",
        ORDER_NO: row.ORDER_NO || "",
        ITEM: row.ITEM || "",
        CUST_NAME: row.CUST_NAME || "",
      };
    });

    setUPTable(UptData);
  } catch (error) {
    alertify.error("Error fetching data: " + error.message);
  } finally {
    setLoading(false);
  }
};


  const handleResultChange = (value) => {
    setRESULT(value);
  };

  const handleUTRemarkChange = (value) => {
    setUT_REMARK(value.value);
    setLUT_REMARK(value);
  };

  const handleRemarkChange = (value) => {
    setLREMARK(value);
    setREMARK(value.value)
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
  XLSX.utils.book_append_sheet(wb, ws, "Inspection Template");
  
  XLSX.writeFile(wb, "Inspection_50_Template.xlsx");
};



  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];

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

  const optList = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];
  const optList2 = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "NA", value: "NA" },
  ];

  useEffect(() => {
    if (getUPTable?.length > 0) {
      const table = new Tabulator("#UPTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getUPTable,
        columns: UPColumn,
        height: 400,
        layout: "fitDataFill",
      });

      setSelectedUPTable(table);
    } else {
      // Clear the table if getUPTable is empty or null
      if (document.getElementById("UPTableContainer")) {
        // Clear previous table content if it exists
        document.getElementById("UPTableContainer").innerHTML = "";
      }
      setSelectedUPTable(null);
    }
  }, [getUPTable]);

  const UPColumn = [
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
      editor: "input",
    },
    {
      title: "Cast No",
      field: "HEAT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
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
      editor: "input",
      formatter: "plaintext",
    },
    {
      title: "Calib Remark",
      field: "CALIB_REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Mut F-End(Weld)",
      field: "MUT_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      title: "Mut T-End(Weld)",
      field: "MUT_T_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      editor: "input",
    },
    {
      title: "Nxt Proc",
      field: "NXT_PROC",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Shift",
      field: "SHIFT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Date",
      field: "DATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Pipe Od",
      field: "OD",
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
      title: "Thick",
      field: "THICK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Remarks",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: "plaintext",
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
  ];

  const downloadExcelUPTableData = () => {
    console.log("Downloading");
    if (selectedUPTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedUPTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD05S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedUPTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD05S001/getTataDate";
      let data = {
        prodEndDt: value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var rows = [];

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

  const setTableNull = () => {
    setUPTable([]);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="50 - Inspection" />
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
                          Inspection - 50
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
                    <Grid container spacing={1.75}>

                       {/* --- START MODIFICATION: Add MILL dropdown --- */}
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
                          options={[
                            { label: "MILL 1", value: "1" },
                            { label: "MILL 2", value: "2" },
                          ]}
                          value={selectedMill}
                          onChange={handleMillChange}
                          variant="h6"
                        />
                      </Grid>
                      {/* --- END MODIFICATION --- */}

                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >      
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

                      <Grid item xs={1.75}>
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

                      <Grid item xs={1.75}>
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
                            // Extract components
                            var year = d.getFullYear();
                            var month = ("0" + (d.getMonth() + 1)).slice(-2); // Months are 0-based
                            var day = ("0" + d.getDate()).slice(-2);
                            var hours = ("0" + d.getHours()).slice(-2);
                            var minutes = ("0" + d.getMinutes()).slice(-2);

                            var oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                            getTataDate(oracleDate);
                            // Assuming clearFilterOnDate is defined elsewhere or should be removed.
                            // If it's meant to clear date filters in the main component, you'd need to define it.
                            // For now, it's commented out to prevent error if undefined.
                            // clearFilterOnDate();
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
                          Entry of Inpsection
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip
                          title={expanded ? "Hide Elements" : "Show Elements"}
                        >
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
                      <Grid container spacing={1}>
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

                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                             {uploadedExcelData.length === 0 ? "No Of Indication*" : "No Of Indication"}
                          </MDTypography>
                          <MDInput
                            label=""
                            name="No Of Indication"
                            value={NO_IND}
                            onChange={(e) => {
                              setNO_IND(e.target.value);
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
                            Calib Remark*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="Calib Remark"
                            value={CALB_RMK}
                            onChange={(e) => {
                              setCALB_RMK(e.target.value);
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
                            onChange={(e) => {
                              handleUTRemarkChange(e);
                              setTableNull();
                            }}
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
                            onChange={(e) => {
                              handleRemarkChange(e);
                              setTableNull();
                            }}
                            value={LREMARK}
                          />
                        </Grid>

                        <Grid item xs={1.3}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Iss Ex Batch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="issexBatch"
                            value={issexBatch}
                            onChange={(e) => {
                              setIsExBatch(e.target.value);
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
                            Mut F-End(Weld)*
                          </MDTypography>
                          <ReactSelect
                            options={optList}
                            onChange={(e) => {
                              setMUT_F_END(e);
                              setTableNull();
                            }}
                            value={MUT_F_END}
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
                            Mut T-End(Weld)*
                          </MDTypography>
                          <ReactSelect
                            options={optList}
                            onChange={(e) => {
                              setMUT_T_END(e);
                              setTableNull();
                            }}
                            value={MUT_T_END}
                          />
                        </Grid>
                        <Grid item xs={1.3}>
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
                            value={RESULT}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => bindUPData()}
                          >
                            Fill Data
                          </MDButton>
                        </Grid>

                        <Grid item xs={1.5}>
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
                          Inspection Data
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
                            onClick={() => downloadExcelUPTableData()}
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
                        <div id="UPTableContainer" />

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getUPTable.length} of{" "}
                          {getUPTable.length} entries
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
