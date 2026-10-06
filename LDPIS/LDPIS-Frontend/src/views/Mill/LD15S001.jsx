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
import MDAlert from "@mui/material/Alert";

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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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

import "../../tabulatorCss.scss";
import { set } from "date-fns";

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

  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  
  const [rmBatchId, setrmBatchId] = useState(null)
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("G"); // Current Process, from screenshot it looks like 'CA I.' is Next Process
  // const [salesOrdNo, setSalesOrdNo] = useState(""); // Removed from UI
  const [ordNo, setOrdNo] = useState(""); // Removed from UI
  const [ordItem, setOrdItem] = useState(""); // Removed from UI
  const [custName, setCustName] = useState(""); // Removed from UI
  const [SHIFT,setSHIFT] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [SHIFT_DATE,setSHIFT_DATE] = useState(null);
  const [RESULT, setRESULT] = useState([]);
  const [selectedResult, setSelectedResult] = React.useState(null);
   
  // const [TBP_VISUAL_INSP_80, setTBP_VISUAL_INSP_80] = useState("");

  // New states based on screenshot and TBP fields
  const [tbpVisualInsp80, setTbpVisualInsp80] = useState(""); // Inspector
  const [tbpAmbTmp100, setTbpAmbTmp100] = useState(""); // AMB Temp.
  const [tbpRh100, setTbpRh100] = useState(""); // RH
  const [tbpDewTemp100, setTbpDewTemp100] = useState(""); // Dew Point
  const [tbpWftF1150, setTbpWftF1150] = useState(""); // F END 1
  const [tbpWftF2150, setTbpWftF2150] = useState(""); // F END 2
  const [tbpWftF3150, setTbpWftF3150] = useState(""); // F END 3
  const [tbpWftF4150, setTbpWftF4150] = useState(""); // F END 4
  const [tbpWftT1150, setTbpWftT1150] = useState(""); // T END 1
  const [tbpWftT2150, setTbpWftT2150] = useState(""); // T END 2
  const [tbpWftT3150, setTbpWftT3150] = useState(""); // T END 3
  const [tbpWftT4150, setTbpWftT4150] = useState(""); // T END 4
  const [Cut_Back_F_End, setTbpMeFend150] = useState(""); //Cut Back F End
  const [Cut_Back_T_End, setTbpUmeTend150] = useState(""); // Cut Back T End
  const [tbpRmUse1150, setTbpRmUse1150] = useState(""); // Raw Material Used -> Base
  const [Base_Batch_No, setBase_Batch_No] = useState(""); // Raw Material Used -> Agent
  const [tbpRmUse3150, setTbpRmUse3150] = useState(""); // Raw Material Used -> 3
  const [Hardner_Batch_No, setHardner_Batch_No] = useState(""); // Raw Material Used -> 4
  const [tbpBaseManufacturer, settbpBaseManufacturer] = useState(""); // Assuming this is for Grade 1 (Base Manufacturer)
  const [Hardner_Manf, setHardner_Manf] = useState(""); // Grade 2
  const [tbpGrade3, setTbpGrade3] = useState(""); // Grade 3
  const [tbpGrade4, setTbpGrade4] = useState(""); // Grade 4
  const [Base_Grade, setBase_Grade] = useState(""); // Base Grade -> Batch 1
  const [Hardner_Grade, setHardner_Grade] = useState(""); // Base Grade -> Batch 2
  const [tbpBatch3150, setTbpBatch3150] = useState(""); // Base Grade -> Batch 3
  const [tbpBatch4150, setTbpBatch4150] = useState(""); // Base Grade -> Batch 4
  const [tbpBatch5150, setTbpBatch5150] = useState(""); // Batch 5
  const [tbpLineSpeed150, setTbpLineSpeed150] = useState(""); // Line Speed
  const [tbpMixPaintRatio, setTbpMixPaintRatio] = useState(""); // Mix Paint Ratio
  const [dateOfProcess, setDateOfProcess] = useState(null); // Date Of Process from screenshot
  const [timeOfProcess, setTimeOfProcess] = useState(""); // Time from screenshot
  const [inspectorRemarks, setInspectorRemarks] = useState(""); // Remarks from screenshot

  const [getBlastAppTable, setBlastAppTable] = useState([]);
  const [selectedBlastAppTable, setSelectedBlastAppTable] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const [TBP_VISUAL_INSP_80, setTBP_VISUAL_INSP_80] = useState("OK");

  const visualOptions = [
  { label: "OK", value: "OK" },
  { label: "NOT OK", value: "NOT OK" },
];

  

  const fetchDetails = () => {
    setLoading(true);
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([getPipeNoList(data.accessToken)]).finally(() => {
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
      var pageName = "LD15S001";
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

  const handleResultChange = (value) => {
    setSelectedResult(value)
   
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value)
   
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

    const setTableNull = () => {
      setBlastAppTable([])
      
    };

    const getNxtProc = async (accessToken,pipeno) => {
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
        CURR_PROC: "G",
        PIPE_NO: pipeno?.value || "",
        
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
           setNxtproc(items[0]?.value || "")
            
            
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };


    const getOrdDetails = async (accessToken,pipeno) => {
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
        PIPE_NO: pipeno?.value || "",
      };
      console.log("datarm", data)
  
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
            console.log("items", items[0]?.value)
            setOrdNo(items[0]?.value || "")
            setOrdItem(orditem[0]?.value || "")
            setCustName(custname[0]?.value || "")
  
            Promise.all([
  
            ])
  
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };
    
    useEffect(() => {
      if (getBlastAppTable?.length > 0) {
        const table = new Tabulator("#BlastAppTableContainer", {
          pagination: "local",
          paginationSize: 12,
          data: getBlastAppTable,
          columns: BlastAppColumns,
          height: 400,
          layout: "fitDataFill",
        });
  
        setSelectedBlastAppTable(table);
      } else {
        setSelectedBlastAppTable(null)
      }
    }, [getBlastAppTable])

    const clearFilterOnDate = () => {
      setBlastAppTable([]);
      setSelectedBlastAppTable(null);
    };


  

    const handleClearMain = (newToken = false) => {
      handleClearAll();
      setPipeNo(null)
      setrmBatchId(null)
      setOrdNo("")
      setOrdItem("")
      setCustName("")
      setNxtproc("")
      setSelectedShift(null);
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      setSHIFT("");
      setSHIFT_DATE(null);
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
      // Clear all new fields
      setTBP_VISUAL_INSP_80("OK"); // Reset to default "OK"
      setTbpVisualInsp80("");
      setTbpAmbTmp100("");
      setTbpRh100("");
      setTbpDewTemp100("");
      setTbpWftF1150("");
      setTbpWftF2150("");
      setTbpWftF3150("");
      setTbpWftF4150("");
      setTbpWftT1150("");
      setTbpWftT2150("");
      setTbpWftT3150("");
      setTbpWftT4150("");
      setTbpMeFend150("");
      setTbpUmeTend150("");
      setTbpRmUse1150("");
      setBase_Batch_No("");
      setTbpRmUse3150("");
      setHardner_Batch_No("");
      settbpBaseManufacturer("");
      setHardner_Manf("");
      setTbpGrade3("");
      setTbpGrade4("");
      setBase_Grade("");
      setHardner_Grade("");
      setTbpBatch3150("");
      setTbpBatch4150("");
      setTbpBatch5150("");
      setTbpLineSpeed150("");
      setTbpMixPaintRatio("");
      setDateOfProcess(null);
      setTimeOfProcess("");
      setInspectorRemarks("");

      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      setSelectedResult(null)
      
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
        var url = "api/LD15S001/getTataDate";
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
             
              var rows = [];
              
              console.log(response.data?.[0]?.[1]);
              setSHIFT_DATE(response.data?.[0]?.[1]);
              //setSHIFT(response.data?.[0]?.[0]);
              setLoading(false);
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    };

    const getPipeNoList = async (accessToken) => {
    
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
    
      
      let data = {
        status: 'GC',
        rmBatch: "",
        
      };
      var url = "api/LD12S001/getPipeNoList";
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
            
            setPipeNoList(items)
            setPipeNo(null)
            setrmBatchId(null)
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };

    const handleClearVal = (newToken = false) => {
      setPipeNo(null)
      setSelectedShift(null);
      // Clear all new fields
      setTBP_VISUAL_INSP_80("OK"); // Reset to default "OK"
      setTbpVisualInsp80("");
      setTbpAmbTmp100("");
      setTbpRh100("");
      setTbpDewTemp100("");
      setTbpWftF1150("");
      setTbpWftF2150("");
      setTbpWftF3150("");
      setTbpWftF4150("");
      setTbpWftT1150("");
      setTbpWftT2150("");
      setTbpWftT3150("");
      setTbpWftT4150("");
      setTbpMeFend150("");
      setTbpUmeTend150("");
      setTbpRmUse1150("");
      setBase_Batch_No("");
      setTbpRmUse3150("");
      setHardner_Batch_No("");
      settbpBaseManufacturer("");
      setHardner_Manf("");
      setTbpGrade3("");
      setTbpGrade4("");
      setBase_Grade("");
      setHardner_Grade("");
      setTbpBatch3150("");
      setTbpBatch4150("");
      setTbpBatch5150("");
      setTbpLineSpeed150("");
      setTbpMixPaintRatio("");
      setDateOfProcess(null);
      setTimeOfProcess("");
      setInspectorRemarks("");

      setOrdNo("")
      setOrdItem("")
      setCustName("")
      setSelectedResult(null)
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
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
    
    const handlePipeNoChange = (value) => {
      setPipeNo(value);
      setrmBatchId(
        value?.parentCoilNo
          ? { label: value.parentCoilNo, value: value.parentCoilNo }
          : null
      );
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setNxtproc("");
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      handleClearAll(true)
      if (value) {
        setLoading(true);
        GetAuthorization().then((data) => {
          Promise.all([
            getOrdDetails(data.accessToken,value),
            getNxtProc(data.accessToken,value)
  
          ]).finally(() => {
            setLoading(false);
          });
        });
      } else {
        setrmBatchId(null);
      }
    };

    const handleOrderNoChange = (event) => {
      const value = event.target.value;

      if (pipeno?.value) {
        setOrdItem("");
      }

      setOrdNo(value);
      setPipeNo(null);
      setrmBatchId(null);
      setCustName("");
      setNxtproc("");
      setBlastAppTable([]);
      setSelectedBlastAppTable(null);
    };

    const handleOrderItemChange = (event) => {
      setOrdItem(event.target.value);
      setPipeNo(null);
      setrmBatchId(null);
      setCustName("");
      setNxtproc("");
      setBlastAppTable([]);
      setSelectedBlastAppTable(null);
    };

  
  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

  
  const bindBlastAppData = async () => {
    try {
      setLoading(true);
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      var prodStartDateInput = document.getElementById("prodStartDate").value;
    var prodEndDateInput = document.getElementById("prodEndDate").value;
    var currentTime = new Date(); 
    var prodEndDateCheck = new Date(prodEndDateInput);

    //if productionendDt is greater than currentdate check
    if (prodEndDateCheck > currentTime) {
     
      alertify.error("The selected end date is greater than the current time.");
      setLoading(false);
      return;
    }
    //if startdt is greater than endDt
    if (new Date(prodStartDateInput) >= new Date(prodEndDateInput)) {
      alertify.error("Start time should be before end time");
      setLoading(false);
      return;
    }
    
    // startdt must be in 72 hours of current date
    var hoursDifference = (currentTime - new Date(prodStartDateInput)) / (1000 * 60 * 60); // Corrected calculation
    if (hoursDifference > 72) {
      alertify.error(
        "Start date must be within 72 hours of the current time."
      );
      setLoading(false);
      return;
    }
    if (prodStartDateInput == "") {
      alertify.error("Please select Prod Start Dt");
      setLoading(false);
      return;
    }
    if (prodEndDateInput == "") {
      alertify.error("Please select Prod End Dt");
      setLoading(false);
      return;
    }
      const hasPipeNo = Boolean(pipeno?.value);
      const hasOrderNo = Boolean(String(ordNo || "").trim());
      const hasOrderItem = Boolean(
        typeof ordItem === "string"
          ? String(ordItem).trim()
          : ordItem && ordItem.value
          ? String(ordItem.value).trim()
          : String(ordItem || "").trim()
      );

      if (!hasPipeNo && !hasOrderNo && !hasOrderItem) {
        alertify.error(
          "Please select Pipe No or enter both Order No and Order Item"
        );
        return;
      }

      if (!hasPipeNo && hasOrderNo !== hasOrderItem) {
        alertify.error("Both Order No and Order Item are required");
        return;
      }

      if (
        !SHIFT_DATE ||
        !selectedShift?.value ||
        !String(tbpVisualInsp80 || "").trim() ||
        !selectedResult?.value ||
        !String(inspectorRemarks || "").trim() ||
        !String(tbpWftF1150 || "").trim() ||
        !String(tbpWftF2150 || "").trim() ||
        !String(tbpWftF3150 || "").trim() ||
        !String(tbpWftF4150 || "").trim() ||
        !String(tbpWftT1150 || "").trim() ||
        !String(tbpWftT2150 || "").trim() ||
        !String(tbpWftT3150 || "").trim() ||
        !String(tbpWftT4150 || "").trim()
      ) {
        alertify.error("All fields marked * are mandatory. Kindly fill.");
        return;
      }

        const token = await GetAuthorization();
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
  
     
      //const processdt = formatDate(selectedProcessDt);
      const currentDate = new Date();
      const formattedDate = formatDateToDDMMYYYY(currentDate);
      const formattedTime = currentDate.toTimeString().split(" ")[0];
      let requestData = {
        RM_BATCH: hasPipeNo ? rmBatchId?.value || "" : "",
        STATUS: "GC",
        PIPE_NO: hasPipeNo ? pipeno.value : "",
        ORDNO: hasPipeNo ? "" : String(ordNo || "").trim(),
        ORDITEM: hasPipeNo
          ? ""
          : typeof ordItem === "string"
          ? String(ordItem).trim()
          : ordItem && ordItem.value
          ? String(ordItem.value).trim()
          : String(ordItem || "").trim(),
      };
  
      
      let response = await axiosAPI.post("api/LD15S001/getFillData", requestData, defaultOptions);
  
      console.log("response", response);
      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid response from API");
      }
      if (response.data.length == 0)
      {
       
        alertify.error("NO Data Found in V_BARE_PDO");
        return;
      }

        let BlastAppData = response.data.map((row) => ({
  C_PRC: nxtproc2 || "",
  N_PRC: row.NEXT_PROC || nxtproc || "",

  PIPE_NO: row.TBP_BATCH_NO || "",

  DATE: SHIFT_DATE || "",
  TIME: timeOfProcess || "",

  RESULT: selectedResult?.value || "",

  SHIFT: selectedShift?.value || "",

  HOLD_REASON: inspectorRemarks || "",
  INSPECT_NAME: tbpVisualInsp80 || "",

  ORDER_NO: row.ORDER_NO || ordNo || "",
  ITEM: row.ITEM || ordItem || "",
  PARENT_BATCH: row.LOM_ID_PAR_COIL_NO || rmBatchId?.value || "",

  TBP_NO_MATNR: row.TBP_NO_MATNR || "",
  TBP_WEIGHT: row.TBP_WEIGHT || "",
  TBP_ID_FIRST_PAR: row.TBP_ID_FIRST_PAR || "",
  TBP_QUALITY_CD: row.TBP_QUALITY_CD || "",
  TBP_CD_FLAG: row.TBP_CD_FLAG || "",

  /* -------------------------
     VISUAL INSPECTION
     ------------------------- */

  TBP_VISUAL_INSP_80:
    TBP_VISUAL_INSP_80 ||
    row.TBP_VISUAL_INSP_80 ||
    "",

  TBP_ASL_NO_80:
    row.TBP_ASL_NO_80 || "",

  TBP_FLD_NO_130:
    row.TBP_FLD_NO_130 || "",

  /* -------------------------
     ENVIRONMENT
     ------------------------- */

  TBP_AMBT_TMP_100:
    tbpAmbTmp100 ||
    row.TBP_AMBT_TMP_100 ||
    "",

  TBP_RH_100:
    tbpRh100 ||
    row.TBP_RH_100 ||
    "",

  TBP_DEW_TEMP_100:
    tbpDewTemp100 ||
    row.TBP_DEW_TEMP_100 ||
    "",

  /* -------------------------
     WFT VALUES
     ------------------------- */

  TBP_WFT_F1_150:
    tbpWftF1150 ||
    row.TBP_WFT_F1_150 ||
    "",

  TBP_WFT_F2_150:
    tbpWftF2150 ||
    row.TBP_WFT_F2_150 ||
    "",

  TBP_WFT_F3_150:
    tbpWftF3150 ||
    row.TBP_WFT_F3_150 ||
    "",

  TBP_WFT_F4_150:
    tbpWftF4150 ||
    row.TBP_WFT_F4_150 ||
    "",

  TBP_WFT_T1_150:
    tbpWftT1150 ||
    row.TBP_WFT_T1_150 ||
    "",

  TBP_WFT_T2_150:
    tbpWftT2150 ||
    row.TBP_WFT_T2_150 ||
    "",

  TBP_WFT_T3_150:
    tbpWftT3150 ||
    row.TBP_WFT_T3_150 ||
    "",

  TBP_WFT_T4_150:
    tbpWftT4150 ||
    row.TBP_WFT_T4_150 ||
    "",

  /* -------------------------
     COATING WT
     ------------------------- */

  TBP_COT_WT_IN_150:
    row.TBP_COT_WT_IN_150 || "",

  /* -------------------------
     CUT BACK
     ------------------------- */

  TBP_ME_FEND_150:
    Cut_Back_F_End ||
    row.TBP_ME_FEND_150 ||
    "",

  TBP_UME_TEND_150:
    Cut_Back_T_End ||
    row.TBP_UME_TEND_150 ||
    "",

  /* -------------------------
     RAW MATERIAL USED
     ------------------------- */

  TBP_RMUSE1_150:
    tbpBaseManufacturer ||
    row.TBP_RMUSE1_150 ||
    "",

  TBP_RMUSE2_150:
    Base_Batch_No ||
    row.TBP_RMUSE2_150 ||
    "",

  TBP_RMUSE3_150:
    Hardner_Grade ||
    row.TBP_RMUSE3_150 ||
    "",

  TBP_RMUSE4_150:
    tbpGrade3 ||
    row.TBP_RMUSE4_150 ||
    "",

  TBP_RMUSE5_150:
    tbpGrade4 ||
    row.TBP_RMUSE5_150 ||
    "",

  /* -------------------------
     BATCHS / GRADES
     ------------------------- */

  TBP_BATCH1_150:
    Base_Grade ||
    row.TBP_BATCH1_150 ||
    "",

  TBP_BATCH2_150:
    Hardner_Manf ||
    row.TBP_BATCH2_150 ||
    "",

  TBP_BATCH3_150:
    Hardner_Batch_No ||
    tbpBatch3150 ||
    row.TBP_BATCH3_150 ||
    "",

  TBP_BATCH4_150:
    tbpBatch4150 ||
    row.TBP_BATCH4_150 ||
    "",

  TBP_BATCH5_150:
    tbpBatch5150 ||
    row.TBP_BATCH5_150 ||
    "",

  /* -------------------------
     PROCESS PARAMETERS
     ------------------------- */

  TBP_LINES_SPED_150:
    tbpLineSpeed150 ||
    row.TBP_LINES_SPED_150 ||
    "",

  TBP_MIXPAINT_RATIO:
    tbpMixPaintRatio ||
    row.TBP_MIXPAINT_RATIO ||
    "",

  TBP_QUANTITY_150:
    row.TBP_QUANTITY_150 || "",

  /* -------------------------
     SAMPLE
     ------------------------- */

  TBP_SAMPLE_10:
    row.TBP_SAMPLE_10 || "NO",

  /* -------------------------
     WORKCENTER
     ------------------------- */

  TBP_WORK_CENTER:
    row.TBP_WORK_CENTER || "",
}));
  
      console.log("BlastAppData",BlastAppData)
      setBlastAppTable(BlastAppData)
      
  
    } catch (error) {
      alertify.error("Error fetching data.");
      console.error(error);
      
    } finally {
      setLoading(false);
    }
  };

  
const updateData = async () => {
  // Reset message states
  setShowSaveMsgSuccess(false);
  setShowSaveMsgError(false);
  setSaveMsg("");

  const token = await GetAuthorization();
  const defaultOptions = {
    headers: {
      Authorization: "Bearer " + token.accessToken,
    },
  };

  if (!selectedBlastAppTable) {
    const msg = "No rows available";
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(true);
    setSaveMsg(msg);
    alertify.error(msg);
    return;
  }

  const selectedRows = selectedBlastAppTable.getSelectedRows();

  if (selectedRows.length === 0) {
    const msg = "Please select rows";
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(true);
    setSaveMsg(msg);
    alertify.error(msg);
    return;
  }

  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");

    return `${d}-${m}-${y} ${h}:${min}`;
  };

  const prodStartDateVal =
    document.getElementById("prodStartDate")?.value || "";

  const prodEndDateVal =
    document.getElementById("prodEndDate")?.value || "";

  const prodstartdt = formatDate(new Date(prodStartDateVal));
  const prodenddt = formatDate(new Date(prodEndDateVal));

  const newData = [];
  let hasError = false;

  for (const item of selectedRows) {
    if (hasError) break;

    const pipeNo = item._row.data.PIPE_NO;

    // --- Validation for Result ---
    const resultValue = item._row.data.RESULT;
    if (!resultValue || String(resultValue).trim() === "") {
      const msg = `Result cannot be empty for Pipe No: ${pipeNo}.`;
      alertify.error(msg);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(true);
      setSaveMsg(msg);
      hasError = true;
      continue;
    }

    // --- Validation for Hold Reason (if Result is HOLD) ---
    if (resultValue === "HOLD") {
      const holdReason = item._row.data.HOLD_REASON;
      if (!holdReason || String(holdReason).trim() === "") {
        const msg = `Hold Reason cannot be empty for Pipe No: ${pipeNo} when Result is HOLD.`;
        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        hasError = true;
        continue;
      }
    }

    // --- Validation for Parent Batch (PAR_COIL_NO) ---
    const parentBatchValue =
      item._row.data.PARENT_BATCH || rmBatchId?.value || "";
    if (!parentBatchValue || String(parentBatchValue).trim() === "") {
      const msg = `Parent Batch cannot be empty for Pipe No: ${pipeNo}.`;
      alertify.error(msg);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(true);
      setSaveMsg(msg);
      hasError = true;
      continue;
    }

    // --- Build Data Object ---
    newData.push({
      PLANT: "0780",
      BATCH_NO: pipeNo ?? null,
      CD_PROC: item._row.data.C_PRC ?? null,
      C_PRC: item._row.data.C_PRC ?? null,
      BATCH_PROC_NO: "0",
      NEXT_PROC: item._row.data.N_PRC ?? null,
      PROD_DATE: SHIFT_DATE,
      SHIFT: item._row.data.SHIFT ?? null,
      STATUS: "GC",
      TBP_WEIGHT: item._row.data.TBP_WEIGHT ?? null,
      PAR_COIL_NO: parentBatchValue ?? null,
      TBP_ID_FIRST_PAR: item._row.data.TBP_ID_FIRST_PAR ?? null,
      ID_ORDER_NO: item._row.data.ORDER_NO ?? ordNo ?? null,
      ITEM_NO: item._row.data.ITEM ?? ordItem ?? null,
      TBP_QUALITY_CD: item._row.data.TBP_QUALITY_CD ?? null,
      NO_MATNR: item._row.data.TBP_NO_MATNR ?? null,
      TBP_CD_FLAG: item._row.data.TBP_CD_FLAG ?? null,
      START_DT: prodstartdt,
      END_DT: prodenddt,
      RESULT: resultValue ?? null,
      INSP_NAME: item._row.data.INSPECT_NAME ?? null,
      HOLD_RSN: item._row.data.HOLD_REASON ?? null,
      TBP_REMARK: item._row.data.HOLD_REASON ?? null,
      TBP_VISUAL_INSP_80: item._row.data.TBP_VISUAL_INSP_80 ?? null,
      TBP_ASL_NO_80: item._row.data.TBP_ASL_NO_80 ?? null,
      TBP_FLD_NO_130: item._row.data.TBP_FLD_NO_130 ?? null,
      TBP_AMBT_TMP_100: item._row.data.TBP_AMBT_TMP_100 ?? null,
      TBP_RH_100: item._row.data.TBP_RH_100 ?? null,
      TBP_DEW_TEMP_100: item._row.data.TBP_DEW_TEMP_100 ?? null,
      TBP_WFT_F1_150: item._row.data.TBP_WFT_F1_150 ?? null,
      TBP_WFT_F2_150: item._row.data.TBP_WFT_F2_150 ?? null,
      TBP_WFT_F3_150: item._row.data.TBP_WFT_F3_150 ?? null,
      TBP_WFT_F4_150: item._row.data.TBP_WFT_F4_150 ?? null,
      TBP_WFT_T1_150: item._row.data.TBP_WFT_T1_150 ?? null,
      TBP_WFT_T2_150: item._row.data.TBP_WFT_T2_150 ?? null,
      TBP_WFT_T3_150: item._row.data.TBP_WFT_T3_150 ?? null,
      TBP_WFT_T4_150: item._row.data.TBP_WFT_T4_150 ?? null,
      TBP_COT_WT_IN_150: item._row.data.TBP_COT_WT_IN_150 ?? null,
      TBP_ME_FEND_150: item._row.data.TBP_ME_FEND_150 ?? null,
      TBP_UME_TEND_150: item._row.data.TBP_UME_TEND_150 ?? null,
      TBP_RMUSE1_150: item._row.data.TBP_RMUSE1_150 ?? null,
      TBP_RMUSE2_150: item._row.data.TBP_RMUSE2_150 ?? null,
      TBP_RMUSE3_150: item._row.data.TBP_RMUSE3_150 ?? null,
      TBP_RMUSE4_150: item._row.data.TBP_RMUSE4_150 ?? null,
      TBP_RMUSE5_150: item._row.data.TBP_RMUSE5_150 ?? null,
      TBP_BATCH1_150: item._row.data.TBP_BATCH1_150 ?? null,
      TBP_BATCH2_150: item._row.data.TBP_BATCH2_150 ?? null,
      TBP_BATCH3_150: item._row.data.TBP_BATCH3_150 ?? null,
      TBP_BATCH4_150: item._row.data.TBP_BATCH4_150 ?? null,
      TBP_BATCH5_150: item._row.data.TBP_BATCH5_150 ?? null,
      TBP_LINES_SPED_150: item._row.data.TBP_LINES_SPED_150 ?? null,
      TBP_MIXPAINT_RATIO: item._row.data.TBP_MIXPAINT_RATIO ?? null,
      TBP_QUANTITY_150: item._row.data.TBP_QUANTITY_150 ?? null,
      TBP_WORK_CENTER: item._row.data.TBP_WORK_CENTER ?? null,
      TBP_SHIFT_DN: item._row.data.SHIFT ?? null,
      TBP_SAMPLE_10: item._row.data.TBP_SAMPLE_10 ?? "NO",
    });
  }

  if (hasError) {
    setLoading(false);
    return;
  }

  setLoading(true);

  axiosAPI
    .post(
      "api/LD15S001/insertTempData",
      { selectedRowsData: newData },
      defaultOptions
    )
    .then((response) => {
      if (response.statusText !== "" && response.statusText !== "OK") {
        const errMsg =
          response?.error?.response?.data?.message ||
          "An error occurred.";
        alertify.error(errMsg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(errMsg);
      } else {
        if (response.data?.failedCount > 0) {
          if (response.data?.successCount > 0) {
            setBlastAppTable([]);
            setSelectedBlastAppTable(null);
          }
          showErrorAlert(response.data?.message);
          setShowSaveMsgSuccess(false);
          setShowSaveMsgError(true);
          setSaveMsg(response.data?.message);
        } else {
          alertify.success(response.data?.message || "Row Inserted Successfully !!!");
          setShowSaveMsgSuccess(true);
          setShowSaveMsgError(false);
          setSaveMsg(response.data?.message || "Row Inserted Successfully !!!");
          setSelectedBlastAppTable(null);
          setBlastAppTable([]);
          handleClearAll();
          handleClearMain();
          fetchDetails();
        }
      }
    })
    .catch((error) => {
      console.error("Error during update:", error);
      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update data.";
      alertify.error(errMsg);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(true);
      setSaveMsg(errMsg);
    })
    .finally(() => {
      setLoading(false);
    });
};

const showErrorAlert = (errorMessage) => {
  const styleErrorDialog = () => {
    const dialog = document.querySelector(".alertify .ajs-dialog");
    const header = document.querySelector(".alertify .ajs-header");
    const body = document.querySelector(".alertify .ajs-body");
    const content = document.querySelector(".alertify .ajs-content");
    const footer = document.querySelector(".alertify .ajs-footer");
    const commands = document.querySelector(".alertify .ajs-commands");
    const closeBtn = document.querySelector(".alertify .ajs-close");
    const okBtn = document.querySelector(".alertify .ajs-ok");

    if (dialog) {
      dialog.style.padding = "0";
      dialog.style.borderRadius = "6px";
      dialog.style.overflow = "hidden";
      dialog.style.maxWidth = "560px";
      dialog.style.backgroundColor = "#fff";
    }

    if (header) {
      header.style.margin = "0";
      header.style.padding = "16px 24px";
      header.style.backgroundColor = "#dc3545";
      header.style.color = "#fff";
      header.style.fontSize = "18px";
      header.style.fontWeight = "bold";
    }

    if (commands) {
      commands.style.top = "18px";
      commands.style.right = "18px";
      commands.style.margin = "0";
      commands.style.zIndex = "10";
    }

    if (closeBtn) {
      closeBtn.style.filter = "brightness(0) invert(1)";
      closeBtn.style.opacity = "1";
    }

    if (body) {
      body.style.margin = "0";
      body.style.padding = "0";
      body.style.minHeight = "auto";
    }

    if (content) {
      content.style.padding = "24px";
      content.style.color = "#333";
      content.style.fontSize = "16px";
      content.style.fontWeight = "normal";
      content.style.lineHeight = "1.5";
      content.style.whiteSpace = "pre-wrap";
    }

    if (footer) {
      footer.style.margin = "0";
      footer.style.padding = "12px 20px 18px 20px";
      footer.style.backgroundColor = "#fff";
      footer.style.borderTop = "none";
    }

    if (okBtn) {
      okBtn.style.minWidth = "100px";
      okBtn.style.minHeight = "38px";
      okBtn.style.border = "1px solid #333";
      okBtn.style.backgroundColor = "#fff";
      okBtn.style.color = "#111";
      okBtn.style.fontSize = "15px";
      okBtn.style.fontWeight = "500";
      okBtn.style.borderRadius = "3px";
    }
  };

  alertify
    .alert()
    .set({
      title: "Error:",
      message: errorMessage,
      labels: {
        ok: "OK",
      },
      onshow: styleErrorDialog,
      onfocus: styleErrorDialog,
    })
    .show();
};



 
  const BlastAppColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Cur Proc",
      field: "C_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Nxt Proc",
      field: "N_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    // {
    //   title: "Asl No",
    //   field: "ASL_NO",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   editor: "input",
    // },
    { title: "Tag", 
      field: "TBP_SAMPLE_10",
       headerFilter: "input", 
       editable: true, editor: "select",
        editorParams: { values: { NO: "NO", YES: "YES" } },
        formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      }, },
    // {
    //   title: "Date",
    //   field: "DATE",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    // },
    // {
    //   title: "Time",
    //   field: "TIME",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    // },
    {
      title: "Result",
      field: "RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          "OK": "OK",
          "NOT OK": "NOT OK",
          "HOLD": "HOLD"
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Inspector",
      field: "INSPECT_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
      field: "HOLD_REASON",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input", 
      width: 150,
      validator: function(value, cell) {
        return value ? true : false; 
      },
      editable: function(cell) {
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
      title: "Material No", // Updated title
      field: "TBP_NO_MATNR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    // New/Updated columns from the list
    {
      title: "Visual Of coated surface", // Updated title
      field: "TBP_VISUAL_INSP_80",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    { title: "AMB temperature", field: "TBP_AMBT_TMP_100", headerFilter: "input",editable: true, editor: "input" }, // Updated title
    { title: "RH", field: "TBP_RH_100", headerFilter: "input",editable: true, editor: "input" }, // Title already correct
    { title: "Dew Point", field: "TBP_DEW_TEMP_100", headerFilter: "input",editable: true, editor: "input" }, // Updated title
    { title: "F End 1", field: "TBP_WFT_F1_150", headerFilter: "input", editable: true, editor: "input" }, // Added and made editable
    { title: "F End 2", field: "TBP_WFT_F2_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "F End 3", field: "TBP_WFT_F3_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "F End 4", field: "TBP_WFT_F4_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "T End 1", field: "TBP_WFT_T1_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "T End 2", field: "TBP_WFT_T2_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "T End 3", field: "TBP_WFT_T3_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "T End 4", field: "TBP_WFT_T4_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "Cut Back FEND", field: "TBP_ME_FEND_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "Cut Back TEND", field: "TBP_UME_TEND_150", headerFilter: "input", editable: true, editor: "input" }, // Updated title
    { title: "Base Manufacturer", field: "TBP_RMUSE1_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Base Batch No", field: "TBP_RMUSE2_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Hardner Grade", field: "TBP_RMUSE3_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "RM Use 4", field: "TBP_RMUSE4_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "RM Use 5", field: "TBP_RMUSE5_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Base Grade", field: "TBP_BATCH1_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Hardner Manufacturer", field: "TBP_BATCH2_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Hardner Batch No", field: "TBP_BATCH3_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Batch 4", field: "TBP_BATCH4_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Batch 5", field: "TBP_BATCH5_150", headerFilter: "input", editable: true, editor: "input" }, // Added
    { title: "Line Speed", field: "TBP_LINES_SPED_150", headerFilter: "input", editable: true, editor: "input" },
    { title: "Mix Paint Ratio", field: "TBP_MIXPAINT_RATIO", headerFilter: "input", editable: true, editor: "input" },
    { title: "Quantity", field: "TBP_QUANTITY_150", headerFilter: "input", editable: true, editor: "input" }, // Added
    
  ];

  const downloadExcelBlastAppTableData = () => {
    console.log("Downloading");
    if (selectedBlastAppTable == null) { // Changed from selectedInletTable
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = selectedBlastAppTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD15S001" + ".xlsx";
    window.XLSX = XLSX;
    selectedBlastAppTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };


  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Internal Blasting & Application stage inspection(150)"
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
                        Api Coating Plant
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
                        Pipe No *
                      </MDTypography>
                      
                      <ReactSelect
                        id="pipenoList"
                        options={pipenoList}
                        onChange={handlePipeNoChange}
                        variant="h6"
                        value={pipeno}
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
                        Order No *
                      </MDTypography>
                      <MDInput
                        name="ordNo"
                        value={ordNo}
                        onChange={handleOrderNoChange}
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
                        Order Item *
                      </MDTypography>
                      <MDInput
                        name="ordItem"
                        value={ordItem}
                        onChange={handleOrderItemChange}
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
                          // Extract components
                          var year = d.getFullYear();
                          var month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are 0-based
                          var day = ('0' + d.getDate()).slice(-2);
                          var hours = ('0' + d.getHours()).slice(-2);
                          var minutes = ('0' + d.getMinutes()).slice(-2);
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
                      <MDInput name="Pdate" id="Pdate" iseditable="false" value={SHIFT_DATE} />
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
                          Shift*
                        </MDTypography>
                        <ReactSelect
                          options={ShiftType}
                          onChange={(e) => {
                            handleShiftChange(e);
                            
                          }}
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
            Application Internal Coating
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
        <Grid container spacing={1}>
          {/* 1. AMB Temp */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              AMB Temp.
            </MDTypography>
            <MDInput value={tbpAmbTmp100} onChange={(e) => setTbpAmbTmp100(e.target.value)} />
          </Grid>

          {/* 2. RH */}
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              RH
            </MDTypography>
            <MDInput value={tbpRh100} onChange={(e) => setTbpRh100(e.target.value)} />
          </Grid>

          {/* 3. Dew Point */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Dew Point
            </MDTypography>
            <MDInput value={tbpDewTemp100} onChange={(e) => setTbpDewTemp100(e.target.value)} />
          </Grid>

          {/* 4. Visual of coated surface */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Visual of coated surface
            </MDTypography>
            <ReactSelect
              options={visualOptions}
              value={visualOptions.find((opt) => opt.value === TBP_VISUAL_INSP_80) || null}
              onChange={(e) => setTBP_VISUAL_INSP_80(e.value)}
            />
          </Grid>

          {/* 5.1 to 5.4: F END Measurements */}
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              F END 1 *
            </MDTypography>
            <MDInput value={tbpWftF1150} onChange={(e) => setTbpWftF1150(e.target.value)} />
          </Grid>
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              F END 2 *
            </MDTypography>
            <MDInput value={tbpWftF2150} onChange={(e) => setTbpWftF2150(e.target.value)} />
          </Grid>
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              F END 3 *
            </MDTypography>
            <MDInput value={tbpWftF3150} onChange={(e) => setTbpWftF3150(e.target.value)} />
          </Grid>
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              F END 4 *
            </MDTypography>
            <MDInput value={tbpWftF4150} onChange={(e) => setTbpWftF4150(e.target.value)} />
          </Grid>

          {/* 5.5 to 5.8: T END Measurements */}
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              T END 1 *
            </MDTypography>
            <MDInput value={tbpWftT1150} onChange={(e) => setTbpWftT1150(e.target.value)} />
          </Grid>
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              T END 2 *
            </MDTypography>
            <MDInput value={tbpWftT2150} onChange={(e) => setTbpWftT2150(e.target.value)} />
          </Grid>
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              T END 3 *
            </MDTypography>
            <MDInput value={tbpWftT3150} onChange={(e) => setTbpWftT3150(e.target.value)} />
          </Grid>
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              T END 4 *
            </MDTypography>
            <MDInput value={tbpWftT4150} onChange={(e) => setTbpWftT4150(e.target.value)} />
          </Grid>

          {/* 6. Cut Back F End */}
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Cut Back F End
            </MDTypography>
            <MDInput value={Cut_Back_F_End} onChange={(e) => setTbpMeFend150(e.target.value)} />
          </Grid>

          {/* 7. Cut Back T End */}
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Cut Back T End
            </MDTypography>
            <MDInput value={Cut_Back_T_End} onChange={(e) => setTbpUmeTend150(e.target.value)} />
          </Grid>

          {/* 8. Base Manufacturer */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Base Manufacturer
            </MDTypography>
            <MDInput value={tbpBaseManufacturer} onChange={(e) => settbpBaseManufacturer(e.target.value)} />
          </Grid>

          {/* 9. Base Grade */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Base Grade
            </MDTypography>
            <MDInput value={Base_Grade} onChange={(e) => setBase_Grade(e.target.value)}/>
          </Grid>

          {/* 10. Base Batch No */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Base Batch No
            </MDTypography>
            <MDInput value={Base_Batch_No} onChange={(e) => setBase_Batch_No(e.target.value)} />
          </Grid>

          {/* 11. Hardner Manufacturer */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Hardner Manufacturer
            </MDTypography>
            <MDInput value={Hardner_Manf} onChange={(e) => setHardner_Manf(e.target.value)}/>
          </Grid>

          {/* 12. Hardner Grade */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Hardner Grade
            </MDTypography>
            <MDInput value={Hardner_Grade} onChange={(e) => setHardner_Grade(e.target.value)}/>
          </Grid>

          {/* 13. Hardner Batch No */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
             Hardner Batch No
            </MDTypography>
            <MDInput value={Hardner_Batch_No} onChange={(e) => setHardner_Batch_No(e.target.value)}/>
          </Grid>

          {/* 14. Mix Paint Ratio */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Mix Paint Ratio
            </MDTypography>
            <MDInput value={tbpMixPaintRatio} onChange={(e) => setTbpMixPaintRatio(e.target.value)} />
          </Grid>

          {/* 14 (SS Labels both as 14). Inspector */}
          <Grid item xs={1}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Inspector *
            </MDTypography>
            <MDInput value={tbpVisualInsp80} onChange={(e) => setTbpVisualInsp80(e.target.value)} />
          </Grid>

          {/* 15. Result */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Result *
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

          {/* 16. Remarks */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Remarks *
            </MDTypography>
            <MDInput value={inspectorRemarks} onChange={(e) => setInspectorRemarks(e.target.value)} />
          </Grid>

          {/* 17. Line Speed */}
          <Grid item xs={1.5}>
            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap>
              Line Speed
            </MDTypography>
            <MDInput value={tbpLineSpeed150} onChange={(e) => setTbpLineSpeed150(e.target.value)} />
          </Grid>

          {/* Fill Data Button */}
          <Grid item xs={1}>
            <MDButton
              style={{ marginTop: "1.5rem" }}
              size="small"
              color="info"
              onClick={() => bindBlastAppData()}
            >
              Fill Data
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
                      <Grid item xs={5}>
                        <MDTypography variant="h6" color="white">
                        Application Internal Coating Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                                                    <IconButton color="white"  onClick={() => updateData()}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelBlastAppTableData()}
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
                      {getBlastAppTable?.length > 0 && <div id="BlastAppTableContainer" />}

                       
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getBlastAppTable.length} of{" "}
                          {getBlastAppTable.length} entries
                        </p>
                      </Grid>
                    </Grid>
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