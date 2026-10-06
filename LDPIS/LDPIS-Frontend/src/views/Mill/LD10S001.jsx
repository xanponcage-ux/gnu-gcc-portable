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
import { setTransparentNavbar } from "context";

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
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [prodOrdNo, setProdOrdNo] = useState("");
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("B");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [ptempbeforeblast, setPTempBeforeBlast] = useState("");
  const [ptempbeforeacidwash, setPTempBeforeAcidWash] = useState("");
  const [phbeforeacidwash, setPhBeforeAcidWash] = useState("");
  const [phafteracidwash, setPhAfterAcidWash] = useState("");
  const [dwelltime, setDwellTime] = useState("");
  const [pressuredmwash, setPressureDmWash] = useState("");
  const [dmwaterflowrate1, setDmWaterFlowRate1] = useState("");
  const [dmwaterflowrate2, setDmWaterFlowRate2] = useState("");
  const [dmwaterflowrate3, setDmWaterFlowRate3] = useState("");
  const [preheatairafterwaterwash, setPreHeatAirAfterWaterWash] = useState("");
  const [relhumid, setRelhumid] = useState("");
  const [ambtemp, setAmbtemp] = useState("");
  const [dewpointtemp, setDewPointTemp] = useState("");
  const [pipesurfacetemp, setPipeSurfaceTemp] = useState("");
  const [degreeofcleanliness, setDegreeofCleanliness] = useState("");
  const [roughness, setRoughness] = useState("");
  const [dustlevelrating, setDustLevelRating] = useState("");
  const [dustlevelclass, setDustLevelClass] = useState("");
  const [saltcontamination, setSaltContamination] = useState("");
  const [remarks, setRemarks] = useState("");
  const [phosacidmanufact, setPhosAcidManuFact] = useState("");
  const [phosacidgrade, setPhosAcidGrade] = useState("");
  const [phosacidbatch, setPhosAcidBatch] = useState("");
  const [inspectorname, setInspectorName] = useState("");
  const [selectedProcessDt, setSelectedProcessDt] = useState(null);
  const [shift, setShift] = useState([]);
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [time, setTime] = useState("");
  const [visualinsp, setVisualInsp] = useState("")
  const [result, setResult] = useState("");
  const [selectedResult, setSelectedResult] = React.useState([]);
  const [getBlastTable, setBlastTable] = useState([]);
  const [selectedBlastTable, setSelectedBlastTable] = useState(null);
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pono, setPoNo] = useState("");
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeNo, setPipeNo] = useState(null);
  const [SHIFT, setSHIFT] = useState("");
  const [SHIFT_DATE, setSHIFT_DATE] = useState("");
  const [expanded, setExpanded] = useState(true);
  

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
      var pageName = "LD10S001";
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


    const updateData = async (newToken = false) => {
      console.log("ehee");
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
    
      var selectedRows = selectedBlastTable.getSelectedRows();
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
      var prodstartdt = formatDate(startDate)
      var prodenddt = formatDate(endDate)
      
    
    
      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push({
          PLANT: '0780',
          PIPE_NO: item._row.data.PIPE_NO ?? null,
          PLAN_PROC: "B",
          BATCH_PROC_NO: 11,
          NEXT_PROC: item._row.data.NEXT_PROC ?? "B",
          PROCESS_DT: SHIFT_DATE,
          SHIFT: selectedShift?.value ?? null,
          WEIGHT: item._row.data.WEIGHT ?? null,
          STATUS: "AC",
          PAR_COIL_NO: item._row.data.PARENT_BATCH ?? rmBatchId?.value ?? null,
          ID_FIRST_PAR: null,
          ORDER_NO: item._row.data.ORDER_NO ?? null,
          ITEM: item._row.data.ITEM ?? null,
          CUST_NAME: item._row.data.CUST_NAME ?? null,
          // ITEM: ordItem ? ordItem : "0",
          QUALITY_CD: null,
          MATNR: item._row.data.MATERIAL ?? null,
          FLAG: null,
          // ASL_NO: item._row.data.ASL_NO ? item._row.data.ASL_NO : "",
          START_DT: prodstartdt,
          END_DT: prodenddt,
          RESULT: item._row.data.RESULT ?? null,
          REMARK: item._row.data.REMARKS ?? null,
          HEAT_NO: item._row.data.HEAT_NO ?? null,
          INSP_NAME: item._row.data.INSP_NAME ?? null,
          PTEMP_BEFORE_BLAST: item._row.data.PTEMP_BEFORE_BLAST ?? null,
          PTEMP_BEFORE_ACID_WASH: item._row.data.PTEMP_BEFORE_ACID_WASH ?? null,
          PH_BEFORE_ACID_WASH: item._row.data.PH_BEFORE_ACID_WASH ?? null,
          PH_AFTER_ACID_WASH: item._row.data.PH_AFTER_ACID_WASH ?? null,
          VISUAL_INSP: item._row.data.VISUAL_INSP ?? null,
          DWELL_TIME: item._row.data.DWELL_TIME ?? null,
          PRESS_DM_WASH: item._row.data.PRESS_DM_WASH ?? null,
          DM_WATER_FLOW_RATE1: item._row.data.DM_WATER_FLOW_RATE1 ?? null,
          DM_WATER_FLOW_RATE2: item._row.data.DM_WATER_FLOW_RATE2 ?? null,
          DM_WATER_FLOW_RATE3: item._row.data.DM_WATER_FLOW_RATE3 ?? null,
          PRE_HEAT_AIR_AFTER_WATER_WASH: item._row.data.PREHEAT_AIR_AFTER_WATER_WASH ?? null,
          REL_HUMID: item._row.data.REL_HUMID ?? null,
          AMB_TEMP: item._row.data.AMB_TEMP ?? null,
          DEW_POINT_TEMP: item._row.data.DEW_POINT_TEMP ?? null,
          PIPE_SURFACE_TEMP: item._row.data.PIPE_SURFACE_TEMP ?? null,
          DEGREE_CLEANLINESS: item._row.data.DEGREE_CLEANLINESS ?? null,
          ROUGHNESS: item._row.data.ROUGHNESS ?? null,
          DUST_LEVEL_RATING: item._row.data.DUST_LEVEL_RATING ?? null,
          DUST_LEVEL_CLASS: item._row.data.DUST_LEVEL_CLASS ?? null,
          SALT_CONTAMIN: item._row.data.SALT_CONTAMIN ?? null,
          PHOS_ACID_MATERIAL: item._row.data.PHOS_ACID_MATERIAL ?? null,
          PHOS_ACID_GRADE: item._row.data.PHOS_ACID_GRADE ?? null,
          PHOS_ACID_BATCH: item._row.data.PHOS_ACID_BATCH ?? null,
          LENGTH: item._row.data.LENGTH ?? null,
          HOLD_REASON: item._row.data.HOLD_REASON ?? null
        });
      });
      console.log(newData)
      setLoading(true);
      let data = {
        selectedRowsData: newData
        
      };
      var url = "api/LD10S001/insertTempData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error in Procedure");
          } else {
            var res= response.data[0][0]
            if (res == 'Y' ) {
              alertify.success("Row Inserted Successfully !!!");
              setSelectedBlastTable(null)
              setBlastTable([])
              handleClearAll();
              handleClearMain();
              fetchDetails();
              
            } else {
              const errorMessage =response?.data[0] ||  "Unexpected error occurred.";


             showErrorAlert(errorMessage);
              // alertify.alert(response?.data[0])
              // setSelectedBlastTable(null)
              // setBlastTable([])
    
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };

    const handleClearVal = (newToken = false) => {
      setPipeNo(null)
      setNxtproc("")
      setSHIFT_DATE(null)
      setSelectedShift(null)
      setSelectedResult(null)
      setPTempBeforeBlast("");
      setPTempBeforeAcidWash("");
      setPhBeforeAcidWash("");
      setPhAfterAcidWash("");
       setDwellTime("");
       setOrdNo("")
       setOrdItem("")
       setCustName("")
       setPressureDmWash("");
       setDmWaterFlowRate1("");
       setDmWaterFlowRate2("");
       setDmWaterFlowRate3("");
       setPreHeatAirAfterWaterWash("");
       setRelhumid("");
       setAmbtemp("");
       setDewPointTemp("");
       setPipeSurfaceTemp("");
       setDegreeofCleanliness("");
       setRoughness("");
       setDustLevelRating("");
       setDustLevelClass("");
       setSaltContamination("");
       setRemarks("");
       setPhosAcidManuFact("");
       setPhosAcidGrade("");
       setPhosAcidBatch("");
       setInspectorName("");
       setSelectedProcessDt(null);
       setShift("");
       setTime("");
       setVisualInsp("");
       setSelectedResult("");
         
       setOrdNo("")
        setOrdItem("")
         setCustName("")
     
      setBlastTable([])
      setSelectedBlastTable(null)
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

    const handleVal = (newToken = false) => {
     
      setSHIFT_DATE(null)
      setSelectedShift(null)
      setSelectedResult(null)
      setPTempBeforeBlast("");
      setPTempBeforeAcidWash("");
      setPhBeforeAcidWash("");
      setPhAfterAcidWash("");
       setDwellTime("");
       setOrdNo("")
       setOrdItem("")
       setCustName("")
       setPressureDmWash("");
       setDmWaterFlowRate1("");
       setDmWaterFlowRate2("");
       setDmWaterFlowRate3("");
       setPreHeatAirAfterWaterWash("");
       setRelhumid("");
       setAmbtemp("");
       setDewPointTemp("");
       setPipeSurfaceTemp("");
       setDegreeofCleanliness("");
       setRoughness("");
       setDustLevelRating("");
       setDustLevelClass("");
       setSaltContamination("");
       setRemarks("");
       setPhosAcidManuFact("");
       setPhosAcidGrade("");
       setPhosAcidBatch("");
       setInspectorName("");
       setSelectedProcessDt(null);
       setShift("");
       setTime("");
       setVisualInsp("");
       setSelectedResult("");
         
      setOrdNo("")
      setOrdItem("")
      setCustName("")
     
      setBlastTable([])
      setSelectedBlastTable(null)
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
    setPTempBeforeBlast("");
    setPTempBeforeAcidWash("");
    setPhBeforeAcidWash("");
    setPhAfterAcidWash("");
    setDwellTime("");
    setPressureDmWash("");
    setDmWaterFlowRate1("");
    setDmWaterFlowRate2("");
    setDmWaterFlowRate3("");
    setPreHeatAirAfterWaterWash("");
    setRelhumid("");
    setAmbtemp("");
    setDewPointTemp("");
    setPipeSurfaceTemp("");
    setDegreeofCleanliness("");
    setRoughness("");
    setDustLevelRating("");
    setDustLevelClass("");
    setSaltContamination("");
    setRemarks("");
    setPhosAcidManuFact("");
    setPhosAcidGrade("");
    setPhosAcidBatch("");
    setInspectorName("");
    setSelectedProcessDt(null);
    setShift("");
    setTime("");
    setVisualInsp("");
    setSelectedResult("");
    setBlastTable([])
    setSelectedBlastTable(null)

  };

  const handleClearMain = (newToken = false) => {
    setPipeNo(null)
    setrmBatchId(null)
    setOrdNo("")
    setOrdItem("")
    setCustName("")
    setNxtproc("")
    setSHIFT_DATE("")
    setSelectedShift(null);
    setBlastTable([])
    setSelectedBlastTable(null)

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



  const setTableNull = () => {
    setBlastTable([]);
  }

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
      CURR_PROC: "B",
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



  useEffect(() => {
    if (getBlastTable?.length > 0) {
      // Align Flow columns and add editable guards
      try {
        BlastColumns.forEach((col) => {
          if (!col || !col.field) return;
          // DM water flow columns should be right aligned
          if (["DM_WATER_FLOW_RATE1", "DM_WATER_FLOW_RATE2", "DM_WATER_FLOW_RATE3"].includes(col.field)) {
            col.hozAlign = "right";
          }
          // Add editable guard for columns with an editor, excluding RESULT/HOLD_REASON
          if (col.editor && col.field !== "RESULT" && col.field !== "HOLD_REASON") {
            col.editable = function (cell) {
              return String(cell.getRow().getData().RESULT || "").toUpperCase() === "OK";
            };
          }
        });
      } catch (e) {
        console.error("Error aligning BlastColumns:", e);
      }

      const table = new Tabulator("#BlastTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getBlastTable,
        columns: BlastColumns,
        // height: 400,
        // initialSort: [
        //   { column: "ORDER_NO", dir: "asc" },
        //   { column: "ITEM", dir: "asc" },
        //   { column: "TBP_DIA_END_10", dir: "asc" },
        // ],
        layout: "fitDataFill",
      });

      setSelectedBlastTable(table);
    } else {
      setSelectedBlastTable(null)
    }
  }, [getBlastTable])


  const bindBlastData = async () => {
  try {
    setLoading(true);
    setBlastTable([]);
    setSelectedBlastTable(null);

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
    var hoursDifference = (currentTime - prodStartDateInput) / (1000 * 60 * 60);
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

    const normalizedOrderNo = String(ordNo ?? "").trim();
    const normalizedOrderItem = String(ordItem ?? "").trim();
    const hasPipeNo = Boolean(pipeNo?.value);
    const hasOrderNo = Boolean(normalizedOrderNo);
    const hasOrderItem = Boolean(normalizedOrderItem);

    if (!hasPipeNo && !hasOrderNo && !hasOrderItem) {
      alertify.error(
        "Please select Pipe No or enter both Order No and Order Item."
      );
      setLoading(false);
      return;
    }

    if (!hasPipeNo && hasOrderNo !== hasOrderItem) {
      alertify.error("Both Order No and Order Item are required.");
      setLoading(false);
      return;
    }

    // Updated validation: Only check mandatory fields after shift
    if (!visualinsp || visualinsp.trim() === "") {
      alertify.error("Please enter Visual Inspection.");
      setLoading(false);
      return;
    }

    if (!degreeofcleanliness || degreeofcleanliness.trim() === "") {
      alertify.error("Please enter Degree of Cleanliness.");
      setLoading(false);
      return;
    }

    if (!remarks || remarks.trim() === "") {
      alertify.error("Please enter Remarks.");
      setLoading(false);
      return;
    }

    // if (!selectedProcessDt) {
    //   alertify.error("Please select Date of Process.");
    //   setLoading(false);
    //   return;
    // }

    if (!selectedResult || !selectedResult.value) {
      alertify.error("Please select Result.");
      setLoading(false);
      return;
    }

    if (!inspectorname || inspectorname.trim() === "") {
      alertify.error("Please enter Inspector Name.");
      setLoading(false);
      return;
    }

    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    let requestData = {
      RM_BATCH: hasPipeNo ? rmBatchId?.value || "" : "",
      STATUS: 'BC',
      PIPE_NO: hasPipeNo ? pipeNo.value : "",
      ORDNO: hasPipeNo ? "" : normalizedOrderNo,
      ORDITEM: hasPipeNo ? "" : normalizedOrderItem
    };

    
    const response = await axiosAPI.post("api/LD10S001/getFillData", requestData, defaultOptions);

    if (response.status !== 200 || !response.data) {
      throw new Error("Invalid response from API");
    }
    if (response.data.length == 0)
    {
     
      alertify.error("NO Data Found in V_BARE_PDO");
      setLoading(false);
      return;
    }


    console.log("response",response)

    const formatDate = (dateString) => {
      if (!dateString) return ""; 
  
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; 
  
      return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
      }).replace("Sept", "Sep").toUpperCase().replace(/ /g, "-");
    };
    const processdate = formatDate(selectedProcessDt);


    var prodStartDateVal = formatDate(document.getElementById("prodStartDate").value);
    var prodEndDateVal = formatDate(document.getElementById("prodEndDate").value);

    let dummyData = response.data.map( (row) => ({
      PLANT: '0780',
      PIPE_NO: row.TBP_BATCH_NO || "",
      TBP_DIA_END_10: row.TBP_DIA_END_10 || "",
      C_PRC: "B",
      PLAN_PROC : row.PLAN_PROC ? row.PLAN_PROC : "",
      BATCH_PROC_NO: 11,
      NEXT_PROC: row.NEXT_PROC ? row.NEXT_PROC : "C",
      // PROCESS_DT: processdate ? processdate : "",
      SHIFT: SHIFT ? SHIFT : "" ,
      WEIGHT: '',
      STATUS: 'BC',
      PARENT_BATCH:
        row.LOM_ID_PAR_COIL_NO || rmBatchId?.value || "",
      PAR_COIL_NO:
        row.LOM_ID_PAR_COIL_NO || rmBatchId?.value || "",
      ID_FIRST_PAR : '',
      ORDER_NO: row.ORDER_NO ? row.ORDER_NO : "0",
      ITEM: row.ITEM ? row.ITEM : "0",
      CUST_NAME: row.CUST_NAME ? row.CUST_NAME : "0",
      QUALITY_CD: '',
      MATERIAL : row.TBP_NO_MATNR ? row.TBP_NO_MATNR : "",
      FLAG: '',
      ASL_NO: row.TBP_ASL_NO_80 ? row.TBP_ASL_NO_80 : "",
      START_DT: prodStartDateVal,
      END_DT: prodEndDateVal,
      RESULT: selectedResult.value ? selectedResult.value : "",
      REMARKS: remarks ? remarks : "",
      HEAT_NO: row.TBP_HEAT_NO ? row.TBP_HEAT_NO : "",
      INSP_NAME: inspectorname ? inspectorname : "",
      PTEMP_BEFORE_BLAST: ptempbeforeblast ? ptempbeforeblast : "",
      PTEMP_BEFORE_ACID_WASH: ptempbeforeacidwash ? ptempbeforeacidwash : "",
      PH_BEFORE_ACID_WASH: phbeforeacidwash ? phbeforeacidwash : "",
      PH_AFTER_ACID_WASH: phafteracidwash ? phafteracidwash : "",
      VISUAL_INSP:visualinsp ? visualinsp: "",
      DWELL_TIME: dwelltime ? dwelltime : "",
      PRESS_DM_WASH: pressuredmwash ? pressuredmwash : "",
      DM_WATER_FLOW_RATE1: dmwaterflowrate1 ? dmwaterflowrate1 : "",
      DM_WATER_FLOW_RATE2: dmwaterflowrate2 ? dmwaterflowrate2 : "",
      DM_WATER_FLOW_RATE3: dmwaterflowrate3 ? dmwaterflowrate3 : "",
      PREHEAT_AIR_AFTER_WATER_WASH: preheatairafterwaterwash ? preheatairafterwaterwash : "",
      REL_HUMID: relhumid ? relhumid : "",
      AMB_TEMP: ambtemp ? ambtemp : "",
      DEW_POINT_TEMP: dewpointtemp ? dewpointtemp : "",
      PIPE_SURFACE_TEMP: pipesurfacetemp ? pipesurfacetemp : "",
      DEGREE_CLEANLINESS: degreeofcleanliness ? degreeofcleanliness : "",
      ROUGHNESS: roughness ? roughness : "",
      DUST_LEVEL_RATING: dustlevelrating ? dustlevelrating : "",
      DUST_LEVEL_CLASS: dustlevelclass ? dustlevelclass : "",
      SALT_CONTAMIN: saltcontamination ? saltcontamination : "",
      PHOS_ACID_MATERIAL: phosacidmanufact?phosacidmanufact:"",
      PHOS_ACID_GRADE: phosacidgrade ? phosacidgrade : "",
      PHOS_ACID_BATCH: phosacidbatch ? phosacidbatch : "",
      LENGTH: row.TBP_PIPE_LNG_10 ? row.TBP_PIPE_LNG_10 : "0",
      ODIA: row.LOM_SEC2 ?row.LOM_SEC2 :0,
      THICKNESS: row.LOM_SEC1 ?row.LOM_SEC1 :0,
      WEIGHT:row.LOM_MS_PIECE_ACTL ?row.LOM_MS_PIECE_ACTL :0,
    }) );
    console.log("dummydata",dummyData)

    setBlastTable(dummyData);
    
  } catch (error) {
    //console.error("Error fetching API data:", error);
    alertify.error("Error fetching data.");

  } finally {
    setLoading(false);
  }
  
};


  const clearFilterOnDate = () => {
    setBlastTable([])
    setSelectedBlastTable(null)
    
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
            //setSHIFT(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleResultChange = (value) => {
    setSelectedResult(value)

  };
  
  const handleShiftChange = (value) => {
    setSelectedShift(value)
   
  };

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const getMatNo = async (value, accessToken, pipeNo) => {
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
      RM_BATCH: value.value ? value.value : "",
      PIPE_NO: pipeNo ? pipeNo : ""
    };
    console.log("datarm", data)

    var url = "api/LD02S001/getMatNo";
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
            obj.label = row.LOM_NO_MATNR;
            obj.value = row.LOM_NO_MATNR;
            items.push(obj);
          });
          console.log("material", items[0].value)
          setMaterial(items[0].value);
          Promise.all([

          ])

        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getPoNo = async (value, accessToken) => {
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
      RM_BATCH: value.value ? value.value : "",
      PIPE_NO: pipeNo.value ? pipeNo.value : "",
    };
    console.log("datarm", data)

    var url = "api/LD02S001/getPoNo";
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
          console.log("pono", items[0].value)
          setPoNo(items[0].value)
          //setMaterial(items[0].value);
          Promise.all([

          ])

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
  const getPipeNoList = async (accessToken) => {

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };


    let data = {
      status: 'BC',
      rmBatch: "",

    };
    var url = "api/LD10S001/getPipeNoList";
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

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setrmBatchId(
      value?.parentCoilNo
        ? { label: value.parentCoilNo, value: value.parentCoilNo }
        : null
    );
    setBlastTable([])
    setSelectedBlastTable(null)
    handleVal(true)
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
      setrmBatchId(null)
      setOrdNo("")
      setOrdItem("")
      setCustName("")
      setNxtproc("")
    }
  };

  const handleOrderNoChange = (event) => {
    const value = event.target.value;

    // Editing an Order after selecting a Pipe switches to Order-Item search.
    // Clear the Item auto-filled for the previously selected Pipe.
    if (pipeNo?.value) {
      setOrdItem("");
    }

    setOrdNo(value);
    setPipeNo(null);
    setrmBatchId(null);
    setCustName("");
    setNxtproc("");
    setBlastTable([]);
    setSelectedBlastTable(null);
  };

  const handleOrderItemChange = (event) => {
    setOrdItem(event.target.value);
    setPipeNo(null);
    setrmBatchId(null);
    setCustName("");
    setNxtproc("");
    setBlastTable([]);
    setSelectedBlastTable(null);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    // { label: "HOLD", value: "HOLD" },
  ];

  const BlastColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Seq No",
      field: "TBP_DIA_END_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      sorter: "number",
      hozAlign: "center",
      frozen: true,
    },
    //
    {
      title: "C Proc",
      field: "C_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Plan Proc",
      field: "PLAN_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "N Prc",
      field: "NEXT_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Order No",
      field: "ORDER_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Order Item",
      field: "ITEM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    }, {
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
          // "HOLD": "HOLD"
        }
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
      title: "Hold Reason",
      field: "HOLD_REASON",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
     visible:false,
     
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
      title: "ASLNo",
      field: "ASL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Material No",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    
    {
      title: "Pipe Temp",
      field: "PTEMP_BEFORE_BLAST",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Pipe Temp A",
      field: "PTEMP_BEFORE_ACID_WASH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Dwell Time",
      field: "DWELL_TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "PH Before Wash",
      field: "PH_BEFORE_ACID_WASH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },

    {
      title: "PH After Wash",
      field: "PH_AFTER_ACID_WASH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Visual Inspection",
      field: "VISUAL_INSP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Water Press",
      field: "PRESS_DM_WASH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "FM1",
      field: "DM_WATER_FLOW_RATE1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "FM2",
      field: "DM_WATER_FLOW_RATE2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "FM3",
      field: "DM_WATER_FLOW_RATE3",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Air Temp",
      field: "PREHEAT_AIR_AFTER_WATER_WASH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "RH%",
      field: "REL_HUMID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "AMB TEMP",
      field: "AMB_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Dew Point",
      field: "DEW_POINT_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Pipe Surface Temp",
      field: "PIPE_SURFACE_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Cleanliness",
      field: "DEGREE_CLEANLINESS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Roughness",
      field: "ROUGHNESS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Dust Level",
      field: "DUST_LEVEL_RATING",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Dust Level Class",
      field: "DUST_LEVEL_CLASS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Salt Level",
      field: "SALT_CONTAMIN",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Phosphoric Acid Material",
      field: "PHOS_ACID_MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Phosphoric Acid Grade",
      field: "PHOS_ACID_GRADE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Phos.Batch",
      field: "PHOS_ACID_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
   
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return parseFloat(value)?.toFixed(2);
        }
        return value;
      },
    },
    {
      title: "Thick",
      field: "THICKNESS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return parseFloat(value)?.toFixed(2);
        }
        return value;
      },
    },
    {
      title: "Weight",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return parseFloat(value)?.toFixed(2);
        }
        return value;
      },
    },
    {
      title: "Heat No",
      field: "HEAT_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input"
    },


    // {
    //   title: "Process Dt",
    //   field: "PROCESS_DT",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input"
    // },
  ];

  const downloadExcelBlastTableData = () => {
    console.log("Downloading");
    if (selectedBlastTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedBlastTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDS100" + ".xlsx";

    window.XLSX = XLSX;

    selectedBlastTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };


  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Blasting stage inspection (100)"
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
                          Screen required for entry
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
                          Pipe No
                        </MDTypography>

                        <ReactSelect
                          id="pipenoList"
                          options={pipenoList}
                          onChange={handlePipeNoChange}
                          variant="h6"
                          value={pipeNo}
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
                          Order No
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
                          Order Item
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

                            console.log(oracleDate);
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
                      <Grid item xs={1}>
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
                          Entry of Blasting stage inspection
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
                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"

                          color={"dark"}
                          noWrap
                        >
                          PTemp Before Blast
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="ptempbeforeblast"

                          value={ptempbeforeblast}
                          onChange={(e) =>
                            {
                              setPTempBeforeBlast(e.target.value)
                              setTableNull();
                            }
                          }
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                         <Tooltip title="PTemp Before AcidWash" arrow placement="top">
                        <MDTypography
                              variant="h6"
                              fontWeight="regular"
                              fontSize="small"
                              color="dark"
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "nowrap",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                }}
                              >
                                <span
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  
                                  PTemp Before AcidWash
                                  
                                </span>

                                
                              </Box>
                            </MDTypography>
                            </Tooltip>
                        <MDInput
                          label=""
                          name="ptempbeforeacidwash"

                          value={ptempbeforeacidwash}
                          onChange={(e) =>
                              {
                                setPTempBeforeAcidWash(e.target.value)
                                setTableNull();
                              }
                          }
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
                          PH Before Acid Wash
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="phbeforeacidwash"

                          value={phbeforeacidwash}
                          onChange={(e) => {

                            setPhBeforeAcidWash(e.target.value)
                            setTableNull()
                          } }
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
                          PH After Acid Wash
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="phafteracidwash"
                          value={phafteracidwash}
                          onChange={(e) => {
                            setPhAfterAcidWash(e.target.value)
                            setTableNull();
                          }}
                        />
                      </Grid>

                      <Grid item xs={1.5} >
                        <Tooltip title="Visual Insp(Outside&Inside)*" arrow placement="top">
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Visual Insp* (Outside&Inside)
                        </MDTypography>
                          </Tooltip>
                        <MDInput
                          label=""
                          name="visualinsp"
                          value={visualinsp}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setVisualInsp(e.target.value)
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
                          Dwell time
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dwelltime"
                          value={dwelltime}
                          onChange={(e) => {
                            setDwellTime(e.target.value)
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
                          Pressure of DM Wash
                        </MDTypography>
                        <MDInput
                          label=""
                          name="pressuredmwash"
                          value={pressuredmwash}
                          onChange={(e) => {
                            setPressureDmWash(e.target.value)
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
                          DM Waterflow Rate1
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dmwaterflowrate1"
                          value={dmwaterflowrate1}
                          onChange={(e) => {
                            setDmWaterFlowRate1(e.target.value)
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
                          DM Waterflow Rate2
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dmwaterflowrate2"
                          value={dmwaterflowrate2}
                          onChange={(e) => {
                            setDmWaterFlowRate2(e.target.value)
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
                          DM Waterflow Rate3
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dmwaterflowrate3"
                          value={dmwaterflowrate3}
                          onChange={(e) => {
                            setDmWaterFlowRate3(e.target.value)
                            setTableNull();
                          }}
                        />
                      </Grid>

                     <Grid item xs={1.5}>
                         <Tooltip title="PTemp of Air after Waterwash" arrow placement="top">
                        <MDTypography
                              variant="h6"
                              fontWeight="regular"
                              fontSize="small"
                              color="dark"
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexWrap: "nowrap",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                }}
                              >
                                <span
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  
                                  PTemp of Air after Waterwash
                                  
                                </span>

                                
                              </Box>
                            </MDTypography>
                        </Tooltip>

                        <MDInput
                          label=""
                          name="preheatairafterwaterwash"
                          value={preheatairafterwaterwash}
                          onChange={(e) => {
                            setPreHeatAirAfterWaterWash(e.target.value);
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
                          Relative Humidity
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="relhumid"
                          value={relhumid}
                          onChange={(e) => {
                            setRelhumid(e.target.value)
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
                          Ambient Temp
                        </MDTypography>
                        <MDInput
                          label=""
                          name="ambtemp"
                          value={ambtemp}
                          onChange={(e) => {
                            setAmbtemp(e.target.value)
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
                          Dew Point Temp
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dewpointtemp"
                          value={dewpointtemp}
                          onChange={(e) => {
                            setDewPointTemp(e.target.value)
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
                          Pipe Surface Temp
                        </MDTypography>
                        <MDInput
                          label=""
                          name="pipesurfacetemp"
                          value={pipesurfacetemp}
                          onChange={(e) => {
                            setPipeSurfaceTemp(e.target.value)
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
                          Degree of Cleanliness*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="degreeofcleanliness"
                          value={degreeofcleanliness}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setDegreeofCleanliness(e.target.value)
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
                          Roughness
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="roughness"
                          value={roughness}
                          onChange={(e) => {
                            setRoughness(e.target.value)
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
                          Dust Level-Rating
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dustlevelrating"
                          value={dustlevelrating}
                          onChange={(e) => {
                            setDustLevelRating(e.target.value)
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
                          Dust Level-Class
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dustlevelclass"
                          value={dustlevelclass}
                          onChange={(e) => {
                            setDustLevelClass(e.target.value)
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
                          Salt Contamination
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="saltcontamination"
                          value={saltcontamination}
                          onChange={(e) => {
                            setSaltContamination(e.target.value)
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
                          name="remarks"
                          value={remarks}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setRemarks(e.target.value)
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
                          PhosphoricAcid Material
                        </MDTypography>
                        <MDInput
                          label=""
                          name="phosacidmanufact"
                          value={phosacidmanufact}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setPhosAcidManuFact(e.target.value)
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
                          PhosphoricAcid Grade
                        </MDTypography>
                        <MDInput
                          label=""
                          name="phosacidgrade"
                          value={phosacidgrade}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setPhosAcidGrade(e.target.value)
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
                          PhosphoricAcid Batch
                        </MDTypography>
                        <MDInput
                          label=""
                          name="phosacidbatch"
                          value={phosacidbatch}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) =>{
                            setPhosAcidBatch(e.target.value)
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
                          Inspector Name*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="inspectorname"
                          value={inspectorname}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setInspectorName(e.target.value)
                            setTableNull();
                          }}
                        />
                      </Grid>

                      {/* <Grid item xs={1.5}>
                        <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap > Date of process* </MDTypography>
                        <DatePicker id="prcdt" value={selectedProcessDt} onChange={(date) => {
                          setSelectedProcessDt(date)
                          setTableNull();
                        }} />
                      </Grid> */}

                      {/* <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Time*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="time"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
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
                          onChange={handleResultChange}
                          value={selectedResult}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => bindBlastData()}
                        >
                          Fill Data
                        </MDButton>
                      </Grid>

                      <Grid item xs={6}>
                        <MDBox
                          sx={{
                            mt: "1.55rem",
                            px: 1,
                            py: 0.5,
                            border: "1px solid #ddd",
                            borderRadius: "5px",
                            backgroundColor: "#fafafa",
                            fontSize: "10.5px",
                            lineHeight: 1.2,
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <Box component="span">
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                width: 12,
                                height: 12,
                                backgroundColor: "#dac292",
                                border: "1px solid #b8a174",
                                mr: 0.5,
                                verticalAlign: "middle",
                              }}
                            />
                            Text field
                          </Box>

                          <Box component="span">
                            <Box
                              component="span"
                              sx={{
                                display: "inline-block",
                                width: 12,
                                height: 12,
                                backgroundColor: "#fff",
                                border: "1px solid #bfc3c7",
                                mr: 0.5,
                                verticalAlign: "middle",
                              }}
                            />
                            Numeric field
                          </Box>

                          

                          <Box component="span">
                            <Box
                              component="span"
                              sx={{
                                // color: "red",
                                fontWeight: "bold",
                              }}
                            >
                              *
                            </Box>{" "}
                            Mandatory
                          </Box>
                        </MDBox>
                      </Grid>

                    </Grid>
                  </MDBox>)}
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
                          Blast stage Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton color="white" onClick={() => updateData()}>
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelBlastTableData()}
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
                      {getBlastTable?.length > 0 &&<div id="BlastTableContainer" />}


                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getBlastTable.length} of{" "}
                          {getBlastTable.length} entries
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