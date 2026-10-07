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
  
  const [rmBatchId, setrmBatchId] = useState(null)
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [inspectorname, setInspectorName] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [SHIFT,setSHIFT] = useState([]);
  const [SHIFT_DATE,setSHIFT_DATE] = useState(null);
  const [result, setResult] = useState("");
  const [selectedResult, setSelectedResult] = React.useState([]);
  const [selectedProcessDt, setSelectedProcessDt] = useState(null);
  const [selectedShift, setSelectedShift] = React.useState([]);  const [time, setTime] = useState("");
  const [pipetempbeforechromate, setPipeTempBeforeChromate] = useState("");
  const [visualofchromateapp, setVisualofChromateApp] = useState("");
  const [chromatesolutionapp, setChromateSolApp] = useState("");
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("C");
  const [pipetempafterchromateapp, setPipeTempAfterChromateApp] = useState("");
  const [pipetempfbeapp1, setPipeTempFBEApp1] = useState("");
  const [pipetempfbeapp2, setPipeTempFBEApp2] = useState("");
  const [adhesivefilmtemp, setAdhesiveFilmTemp] = useState("");
  const [peppfilmtemp, setPEPPFilmTemp] = useState("");
  const [watertempbeforequenching, setWaterTempBeforeQuenching] = useState("");
  const [watertempafterquenching, setWaterTempAfterQuenching] = useState("");
  const [chromateManufacturer, setChromateManufacturer] = useState("");
  const [epoxyManufacturer, setEpoxyManufacturer] = useState("");
  const [adhensiveManufacturer, setAdhensiveManufacturer] = useState("");
  const [peppManufacturer, setPeppManufacturer] = useState("");

  const [remarks, setRemarks] = useState("");
  const [epoxyguns0124, setEpoxyGuns0124] = useState("");
  const [airpressure, setAirPressure] = useState("");
  const [flowrate, setFlowRate] = useState("");
  const [rawmaterial, setRawMaterial] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [Cgrade, setCGrade] = useState("");
  const [batch1, setBatch1] = useState("");
  const [Egrade, setEGrade] = useState("");
  const [batch2, setBatch2] = useState("");
  const [Agrade, setAGrade] = useState("");
  const [batch3, setBatch3] = useState("");
  const [PEgrade, setPEGrade] = useState("");
  const [batch4, setBatch4] = useState("");
  const [linespeed, setLineSpeed] = useState("");
  const [dewpointepoxy, setDewPointEpoxy] = useState("");
  const [dewpointepoxy1, setDewPointEpoxy1] = useState("");

  const [noofepoxygun, setNoofEpoxyGun] = useState("");
  const [hdpescrew1, setHdpeScrew1] = useState("");
  const [hdpescrew2, setHdpeScrew2] = useState("");
  const [adhesiveExtrpm, setAdhesiveExtrRPM] = useState("");
  const [peExtRPM2, setPeExtRPM2] = useState("");
  const [peppExtrpm1, setPePpExtrRPM1] = useState("");
  const [A1, setA1] = useState("");
  const [A2, setA2] = useState("");
  const [A3, setA3] = useState("");
  const [A4, setA4] = useState("");
  const [A5, setA5] = useState("");
  const [A6, setA6] = useState("");
  const [A7, setA7] = useState("");
  const [A8, setA8] = useState("");
  const [A9, setA9] = useState("");
  const [A10, setA10] = useState("");
  const [A11, setA11] = useState("");
  const [A12, setA12] = useState("");
  const [B1, setB1] = useState("");
  const [B2, setB2] = useState("");
  const [B3, setB3] = useState("");
  const [B4, setB4] = useState("");
  const [B5, setB5] = useState("");
  const [B6, setB6] = useState("");
  const [B7, setB7] = useState("");
  const [B8, setB8] = useState("");
  const [B9, setB9] = useState("");
  const [B10, setB10] = useState("");
  const [B11, setB11] = useState("");
  const [B12, setB12] = useState("");

  const [FA1, setFA1] = useState("");
  const [FA2, setFA2] = useState("");
  const [FA3, setFA3] = useState("");
  const [FA4, setFA4] = useState("");
  const [FA5, setFA5] = useState("");
  const [FA6, setFA6] = useState("");
  const [FA7, setFA7] = useState("");
  const [FA8, setFA8] = useState("");
  const [FA9, setFA9] = useState("");
  const [FA10, setFA10] = useState("");
  const [FA11, setFA11] = useState("");
  const [FA12, setFA12] = useState("");
  const [FB1, setFB1] = useState("");
  const [FB2, setFB2] = useState("");
  const [FB3, setFB3] = useState("");
  const [FB4, setFB4] = useState("");
  const [FB5, setFB5] = useState("");
  const [FB6, setFB6] = useState("");
  const [FB7, setFB7] = useState("");
  const [FB8, setFB8] = useState("");
  const [FB9, setFB9] = useState("");
  const [FB10, setFB10] = useState("");
  const [FB11, setFB11] = useState("");
  const [FB12, setFB12] = useState("");
  const [getAppTable, setAppTable] = useState([]);
  const [selectedAppTable, setSelectedAppTable] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [expanded2, setExpanded2] = useState(true);

  

 //page load
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


const setTableNull = () => {
  setAppTable([])
  
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
useEffect(() => {
  if (getAppTable?.length > 0) {
    // Align Epoxy columns left and Flow columns right and add editable guards
    try {
      AppColumns.forEach((col) => {
        if (!col || !col.field) return;
        // Epoxy-related fields should be left aligned for readability
        if (["EPOXYGUN", "DEW_POINT_EPOXY", "EPOXY_MANUFACT", "EPOXY_GRADE", "EPOXY_BATCH"].includes(col.field)) {
          col.hozAlign = "left";
        }
        // Flow-related FA/FB fields should be right aligned
        if (/^(FA|FB)\d+$/.test(col.field)) {
          col.hozAlign = "right";
        }
        // Add editable guard for columns with an editor, excluding RESULT and HOLD_REASON
        if (col.editor && col.field !== "RESULT" && col.field !== "HOLD_REASON") {
          col.editable = function (cell) {
            return String(cell.getRow().getData().RESULT || "").toUpperCase() === "OK";
          };
        }
      });
    } catch (e) {
      console.error("Error aligning AppColumns:", e);
    }

    const table = new Tabulator("#AppTableContainer", {
      pagination: "local",
      paginationSize: 15,
      data: getAppTable,
      columns: AppColumns,
      // height: undefined, // let Tabulator determine height / single scroll
      // initialSort: [
      //   { column: "ORDER_NO", dir: "asc" },
      //   { column: "ITEM", dir: "asc" },
      //   { column: "TBP_DIA_END_10", dir: "asc" },
      // ],
      layout: "fitDataFill",
    });

    setSelectedAppTable(table);
  } else {
    setSelectedAppTable(null)
  }
}, [getAppTable])

  
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
      var pageName = "LD11S001";
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

  

    const getPipeNoList = async (accessToken) => {
    
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
    
      
      let data = {
        status: 'CC',
        rmBatch : "",
        
      };
      var url = "api/LD11S001/getPipeNoList";
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
      setAppTable([])
      setSelectedAppTable(null)
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

      // Editing an order auto-filled from Pipe switches to Order-Item search.
      // Do not retain the Item belonging to the previously selected Pipe.
      if (pipeno?.value) {
        setOrdItem("");
      }

      setOrdNo(value);
      setPipeNo(null);
      setrmBatchId(null);
      setCustName("");
      setNxtproc("");
      setAppTable([]);
      setSelectedAppTable(null);
    };

    const handleOrderItemChange = (event) => {
      setOrdItem(event.target.value);
      setPipeNo(null);
      setrmBatchId(null);
      setCustName("");
      setNxtproc("");
      setAppTable([]);
      setSelectedAppTable(null);
    };

    const handleClearVal = (newToken = false) => {
      setPipeNo(null)
      setNxtproc("")
      setSHIFT_DATE(null)
      setSelectedShift(null)
      setSelectedResult(null)
      setInspectorName("");
      setSelectedResult([]);
      setSelectedProcessDt(null)
      setPipeTempBeforeChromate("")
      setVisualofChromateApp("")
      setPipeTempFBEApp2("")
      setNoofEpoxyGun("")
      setChromateSolApp("")
      setWaterTempBeforeQuenching("")
      setWaterTempAfterQuenching("")
      setAdhesiveExtrRPM("")
      setPePpExtrRPM1("")
      setPipeTempAfterChromateApp("")
      setAdhesiveFilmTemp("")
      setPEPPFilmTemp("")
      setLineSpeed("")
      setDewPointEpoxy("")
      setChromateManufacturer("")
      setEpoxyManufacturer("")
      setAdhensiveManufacturer("")
      setPeppManufacturer("")
      setCGrade("")
      setBatch1("")
      setEGrade("")
      setBatch2("")
      setAGrade("")
      setBatch3("")
      setPEGrade("")
      setBatch4("")
      setRemarks("")
      setPeExtRPM2("")
     
      setA1("");
      setA2("");
      setA3("");
      setA4("");
      setA5("");
      setA6("");
      setA7("");
      setA8("");
      setA9("");
      setA10("");
      setA11("");
      setA12("");
      setB1("");
      setB2("");
      setB3("");
      setB4("");
      setB5("");
      setB6("");
      setB7("");
      setB8("");
      setB9("");
      setB10("");
      setB11("");
      setB12("");
      setFA1("");
      setFA2("");
      setFA3("");
      setFA4("");
      setFA5("");
      setFA6("");
      setFA7("");
      setFA8("");
      setFA9("");
      setFA10("");
      setFA11("");
      setFA12("");
      setFB1("");
      setFB2("");
      setFB3("");
      setFB4("");
      setFB5("");
      setFB6("");
      setFB7("");
      setFB8("");
      setFB9("");
      setFB10("");
      setFB11("");
      setFB12("");
      setAppTable([])
      setSelectedAppTable(null)
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
      setInspectorName("");
      setSelectedResult([]);
      setSelectedProcessDt(null)
      setPipeTempBeforeChromate("")
      setVisualofChromateApp("")
      setPipeTempFBEApp2("")
      setNoofEpoxyGun("")
      setChromateSolApp("")
      setWaterTempBeforeQuenching("")
      setWaterTempAfterQuenching("")
      setAdhesiveExtrRPM("")
      setPePpExtrRPM1("")
      setPipeTempAfterChromateApp("")
      setAdhesiveFilmTemp("")
      setPEPPFilmTemp("")
      setLineSpeed("")
      setDewPointEpoxy("")
      setChromateManufacturer("")
      setEpoxyManufacturer("")
      setAdhensiveManufacturer("")
      setPeppManufacturer("")
      setCGrade("")
      setBatch1("")
      setEGrade("")
      setBatch2("")
      setAGrade("")
      setBatch3("")
      setPEGrade("")
      setBatch4("")
      setRemarks("")
      setPeExtRPM2("")
      setOrdNo("")
      setOrdItem("")
      setCustName("")
      setA1("");
      setA2("");
      setA3("");
      setA4("");
      setA5("");
      setA6("");
      setA7("");
      setA8("");
      setA9("");
      setA10("");
      setA11("");
      setA12("");
      setB1("");
      setB2("");
      setB3("");
      setB4("");
      setB5("");
      setB6("");
      setB7("");
      setB8("");
      setB9("");
      setB10("");
      setB11("");
      setB12("");
      setFA1("");
      setFA2("");
      setFA3("");
      setFA4("");
      setFA5("");
      setFA6("");
      setFA7("");
      setFA8("");
      setFA9("");
      setFA10("");
      setFA11("");
      setFA12("");
      setFB1("");
      setFB2("");
      setFB3("");
      setFB4("");
      setFB5("");
      setFB6("");
      setFB7("");
      setFB8("");
      setFB9("");
      setFB10("");
      setFB11("");
      setFB12("");
      setAppTable([])
      setSelectedAppTable(null)
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
      CURR_PROC: "C",
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


  


    const updateData = async (newToken = false) => {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
    
      var selectedRows = selectedAppTable.getSelectedRows();
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
          PLANT: "0780",
          BATCH_NO: item._row.data.PIPE_NO ?? null,
          CD_PROC: item._row.data.CURR_PROC ?? null,
          PLAN_PROC: item._row.data.PLAN_PROC ?? null,
          ORDER_NO: item._row.data.ORDER_NO ?? null,
          ITEM: item._row.data.ITEM ?? null,
          CUST_NAME: item._row.data.CUST_NAME ?? null,
          BATCH_PROC_NO: "0",
          NEXT_PROC: item._row.data.NEXT_PROC ?? null,
          PROD_DATE: SHIFT_DATE,
          SHIFT: selectedShift?.value ?? null,
          WEIGHT: item._row.data.WEIGHT ?? null,
          STATUS: "CC",
          PAR_COIL_NO: item._row.data.PARENT_BATCH ?? rmBatchId?.value ?? null,
          ID_FIRST_PAR: null,
          QUALITY_CD: null,
          MATNR: item._row.data.MATERIAL ?? null,
          FLAG: null,
          START_DT: prodstartdt,
          END_DT: prodenddt,
          RESULT: item._row.data.RESULT ?? null,
          REMARK: item._row.data.REMARKS ?? null,
          HEAT_NO: item._row.data.HEAT_NO ?? null,
          INSP_NAME: inspectorname ?? null,
          PIPE_LNG_10: item._row.data.LENGTH ?? null,
          PIPTMP_BECRM_110: item._row.data.PIPE_TEMP_BEFORE_CHROMATE ?? null,
          CHRM_VISUAL_110: item._row.data.VISUAL_CHROMATE_APP ?? null,
          CHRM_TMP_110: item._row.data.SOLUTION_C_TEMP ?? null,
          PIPTMP_AFCRM_110: item._row.data.PIPTMP_AFCRM_110 ?? null,
          PIPTMP_BEFBE_110: item._row.data.PIPTMP_BEFBE_110 ?? null,
          TMP_ADHEF_FIL_110: item._row.data.ADHESIVE_FILM_TEMP ?? null,
          TMP_PEFILM_110: item._row.data.PEPP_FILM_TEMP ?? null,
          QUN_WA_BETMP_110: item._row.data.WATER_TEMP_BEFORE_QUENCHING ?? null,
          QUN_WA_AFTMP_110: item._row.data.WATER_TEMP_AFTER_QUENCHING ?? null,
          EPGUN_1_110: item._row.data.A1 ?? null,
          EPGUN_2_110: item._row.data.A2 ?? null,
          EPGUN_3_110: item._row.data.A3 ?? null,
          EPGUN_4_110: item._row.data.A4 ?? null,
          EPGUN_5_110: item._row.data.A5 ?? null,
          EPGUN_6_110: item._row.data.A6 ?? null,
          EPGUN_7_110: item._row.data.A7 ?? null,
          EPGUN_8_110: item._row.data.A8 ?? null,
          EPGUN_9_110: item._row.data.A9 ?? null,
          EPGUN_10_110: item._row.data.A10 ?? null,
          EPGUN_11_110: item._row.data.A11 ?? null,
          EPGUN_12_110: item._row.data.A12 ?? null,
          EPGUN_13_110: item._row.data.B1 ?? null,
          EPGUN_14_110: item._row.data.B2 ?? null,
          EPGUN_15_110: item._row.data.B3 ?? null,
          EPGUN_16_110: item._row.data.B4 ?? null,
          EPGUN_17_110: item._row.data.B5 ?? null,
          EPGUN_18_110: item._row.data.B6 ?? null,
          EPGUN_19_110: item._row.data.B7 ?? null,
          EPGUN_20_110: item._row.data.B8 ?? null,
          EPGUN_21_110: item._row.data.B9 ?? null,
          EPGUN_22_110: item._row.data.B10 ?? null,
          EPGUN_23_110: item._row.data.B11 ?? null,
          EPGUN_24_110: item._row.data.B12 ?? null,
          AIRPRESS_1_110: null,
          AIRPRESS_2_110: null,
          AIRPRESS_3_110: null,
          AIRPRESS_4_110: null,
          AIRPRESS_5_110: null,
          AIRPRESS_6_110: null,
          AIRPRESS_7_110: null,
          AIRPRESS_8_110: null,
          AIRPRESS_9_110: null,
          AIRPRESS_10_110: null,
          AIRPRESS_11_110: null,
          AIRPRESS_12_110: null,
          AIRPRESS_13_110: null,
          AIRPRESS_14_110: null,
          AIRPRESS_15_110: null,
          AIRPRESS_16_110: null,
          AIRPRESS_17_110: null,
          AIRPRESS_18_110: null,
          AIRPRESS_19_110: null,
          AIRPRESS_20_110: null,
          AIRPRESS_21_110: null,
          AIRPRESS_22_110: null,
          AIRPRESS_23_110: null,
          AIRPRESS_24_110: null,
          FLWRATE_1_110: item._row.data.FA1 ?? null,
          FLWRATE_2_110: item._row.data.FA2 ?? null,
          FLWRATE_3_110: item._row.data.FA3 ?? null,
          FLWRATE_4_110: item._row.data.FA4 ?? null,
          FLWRATE_5_110: item._row.data.FA5 ?? null,
          FLWRATE_6_110: item._row.data.FA6 ?? null,
          FLWRATE_7_110: item._row.data.FA7 ?? null,
          FLWRATE_8_110: item._row.data.FA8 ?? null,
          FLWRATE_9_110: item._row.data.FA9 ?? null,
          FLWRATE_10_110: item._row.data.FA10 ?? null,
          FLWRATE_11_110: item._row.data.FA11 ?? null,
          FLWRATE_12_110: item._row.data.FA12 ?? null,
          FLWRATE_13_110: item._row.data.FB1 ?? null,
          FLWRATE_14_110: item._row.data.FB2 ?? null,
          FLWRATE_15_110: item._row.data.FB3 ?? null,
          FLWRATE_16_110: item._row.data.FB4 ?? null,
          FLWRATE_17_110: item._row.data.FB5 ?? null,
          FLWRATE_18_110: item._row.data.FB6 ?? null,
          FLWRATE_19_110: item._row.data.FB7 ?? null,
          FLWRATE_20_110: item._row.data.FB8 ?? null,
          FLWRATE_21_110: item._row.data.FB9 ?? null,
          FLWRATE_22_110: item._row.data.FB10 ?? null,
          FLWRATE_23_110: item._row.data.FB11 ?? null,
          FLWRATE_24_110: item._row.data.FB12 ?? null,
          RM_1_110: null,
          RM_2_110: null,
          RM_3_110: null,
          RM_4_110: null,
          MANFACT_1_110: item._row.data.CHROM_MANUFACT ?? null,
          MANFACT_2_110: item._row.data.EPOXY_MANUFACT ?? null,
          MANFACT_3_110: item._row.data.ADHENSIVE_MANUFACT ?? null,
          MANFACT_4_110: item._row.data.PEPP_MANUFACT ?? null,
          CHRM_GR_110: item._row.data.CHROMATE_GRADE ?? null,
          EPOXY_GR_110: item._row.data.EPOXY_GRADE ?? null,
          ADHA_GR_110: item._row.data.ADHESIVE_GRADE ?? null,
          PEPP_GR_110: item._row.data.PEPP_GRADE ?? null,
          CHROM_BH_110: item._row.data.CHROMATE_BATCH ?? null,
          EPXY_BH_110: item._row.data.EPOXY_BATCH ?? null,
          ADHA_BH_110: item._row.data.ADHESIVE_BATCH ?? null,
          PEPP_BH_110: item._row.data.PEPP_BATCH ?? null,
          LINES_SPED_110: item._row.data.LINE_SPEED ?? null,
          EPXY_DWPT_110: item._row.data.DEW_POINT_EPOXY ?? null,
          NO_EPGUN_110: item._row.data.EPOXYGUN ?? null,
          HDPE_RPM01_110: item._row.data.PEPP_RPM1 ?? null,
          HDPE_RPM02_110: item._row.data.PEPP_RPM2 ?? null,
          ADHE_RPM_110: item._row.data.ADHESIVE_SCREW_RPM ?? null,
          HOLD_RSN: item._row.data.HOLD_REASON ?? null,
        });
      });
      setLoading(true);
      let data = {
        selectedRowsData: newData
        
      };
      var url = "api/LD11S001/insertTempData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error in Procedure");
          } else {
          if (response.data.failedCount > 0 && response.data.successfulPipes?.length) {
            const saved = new Set(response.data.successfulPipes);
            selectedAppTable.getRows().forEach((row) => {
              if (saved.has(String(row.getData().PIPE_NO))) row.delete();
            });
          }
            if (response.data.successCount > 0 && response.data.failedCount === 0) {
              alertify.success(response.data.message);
              setSelectedAppTable(null)
              setAppTable([]);
              handleClearAll();
              handleClearMain();
              handleEpoxyFlow();
              fetchDetails();
             
            } else {
              
              showErrorAlert(response.data.message)
             
    
            }
          }
        })
        .finally((f) => {
          setLoading(false);
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
        console.log(value);
        var url = "api/LD11S001/getTataDate";
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

    
   
const handleClearAll = (newToken = false) => {
    
    setInspectorName("");
    setSelectedResult([]);
    setSelectedProcessDt(null)
    setPipeTempBeforeChromate("")
    setVisualofChromateApp("")
    setPipeTempFBEApp2("")
    setNoofEpoxyGun("")
    setChromateSolApp("")
    setWaterTempBeforeQuenching("")
    setWaterTempAfterQuenching("")
    setAdhesiveExtrRPM("")
    setPePpExtrRPM1("")
    setPipeTempAfterChromateApp("")
    setAdhesiveFilmTemp("")
    setPEPPFilmTemp("")
    setLineSpeed("")
    setDewPointEpoxy("")
    setChromateManufacturer("")
    setEpoxyManufacturer("")
    setAdhensiveManufacturer("")
    setPeppManufacturer("")
    setCGrade("")
    setBatch1("")
    setEGrade("")
    setBatch2("")
    setAGrade("")
    setBatch3("")
    setPEGrade("")
    setBatch4("")
    setRemarks("")
    setPeExtRPM2("")
    setAppTable([])
    setSelectedAppTable(null)
    
    };

    const handleClearMain = (newToken = false) => {
      setPipeNo(null)
      setrmBatchId(null)
      setOrdNo("")
      setOrdItem("")
      setCustName("")
      setNxtproc("")
      setAppTable([])
      setSelectedAppTable(null)
      setSelectedShift(null);
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
  
  const handleEpoxyFlow = (newToken = false) => {
    setA1("");
      setA2("");
      setA3("");
      setA4("");
      setA5("");
      setA6("");
      setA7("");
      setA8("");
      setA9("");
      setA10("");
      setA11("");
      setA12("");
      setB1("");
      setB2("");
      setB3("");
      setB4("");
      setB5("");
      setB6("");
      setB7("");
      setB8("");
      setB9("");
      setB10("");
      setB11("");
      setB12("");
      setFA1("");
      setFA2("");
      setFA3("");
      setFA4("");
      setFA5("");
      setFA6("");
      setFA7("");
      setFA8("");
      setFA9("");
      setFA10("");
      setFA11("");
      setFA12("");
      setFB1("");
      setFB2("");
      setFB3("");
      setFB4("");
      setFB5("");
      setFB6("");
      setFB7("");
      setFB8("");
      setFB9("");
      setFB10("");
      setFB11("");
      setFB12("");

  };

  const clearFilterOnDate = () => {
    setAppTable([]);
    setSelectedAppTable(null);
  };

  

  const bindAppData = async () => {
  try {
    setLoading(true);
    setAppTable([])
    setSelectedAppTable(null)
    
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

    // Modified validation - only check mandatory fields
    if (!inspectorname || String(inspectorname || "").trim() === "") {
      alertify.error("Inspector Name is mandatory. Please fill it.");
      setLoading(false);
      return;
    }

    if (!selectedResult || !selectedResult.value) {
      alertify.error("Result is mandatory. Please select it.");
      setLoading(false);
      return;
    }

    // if (!selectedProcessDt) {
    //   alertify.error("Date of Process is mandatory. Please select it.");
    //   setLoading(false);
    //   return;
    // }

    if (!remarks || String(remarks || "").trim() === "") {
      alertify.error("Remarks is mandatory. Please fill it.");
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
      setLoading(false);
      return;
    }

    if (!hasPipeNo && hasOrderNo !== hasOrderItem) {
      alertify.error("Both Order No and Order Item are required");
      setLoading(false);
      return;
    }
      
    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

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

    const formattedTime = new Date().toTimeString().split(" ")[0];
    
    const processDt = formatDate(selectedProcessDt);
    
    let requestData = {
      RM_BATCH: hasPipeNo ? rmBatchId?.value || "" : "",
      STATUS: 'CC',
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

    console.log("requestData: ", requestData);
    console.log("formValues -> inspectorname:", inspectorname, "selectedResult:", selectedResult, "selectedProcessDt:", selectedProcessDt, "pipeno:", pipeno, "ordNo:", ordNo, "ordItem:", ordItem, "rmBatchId:", rmBatchId);

    let response;
    try {
      response = await axiosAPI.post("api/LD11S001/getFillData", requestData, defaultOptions);
      console.log("response (full):", response);
    } catch (err) {
      console.error("axios post failed:", err);
      alertify.error("Error contacting server: " + (err?.message || err));
      setLoading(false);
      return;
    }

    if (response.status !== 200 || !response.data) {
      console.error("Invalid response object:", response);
      throw new Error("Invalid response from API");
    }
    if (response.data.length == 0)
    {
     
      alertify.error("NO Data Found in V_BARE_PDO");
      return;
    }

    let appData = response.data.map((row) => ({
      CURR_PROC : 'C',
      NEXT_PROC : row.NEXT_PROC ? row.NEXT_PROC : "",
      PLAN_PROC : row.PLAN_PROC ? row.PLAN_PROC : "",
      TBP_DIA_END_10: row.TBP_DIA_END_10 || "",
      PIPE_NO: row.TBP_BATCH_NO ? row.TBP_BATCH_NO : "",
      ASL_NO: row.TBP_ASL_NO_80 ? row.TBP_ASL_NO_80 : "",
      REMARKS: remarks ? remarks : "" ,
      ORDER_NO : row.ORDER_NO ? row.ORDER_NO : "",
      ITEM : row.ITEM ? row.ITEM : "",
      PARENT_BATCH: row.LOM_ID_PAR_COIL_NO || rmBatchId?.value || "",
      CUST_NAME : row.CUST_NAME ? row.CUST_NAME : "",
      PIPE_TEMP_BEFORE_CHROMATE: pipetempbeforechromate ? pipetempbeforechromate : "",
      VISUAL_CHROMATE_APP: visualofchromateapp ? visualofchromateapp : "",
      SOLUTION_C_TEMP: chromatesolutionapp ? chromatesolutionapp : "",
      PIPTMP_AFCRM_110:pipetempafterchromateapp?pipetempafterchromateapp:"",
      PIPTMP_BEFBE_110:pipetempfbeapp2?pipetempfbeapp2:"",
      ADHESIVE_FILM_TEMP : adhesivefilmtemp ? adhesivefilmtemp : "",
      PEPP_FILM_TEMP : peppfilmtemp ? peppfilmtemp : "",
      WATER_TEMP_BEFORE_QUENCHING : watertempbeforequenching ? watertempbeforequenching : "",
      WATER_TEMP_AFTER_QUENCHING : watertempafterquenching ? watertempafterquenching : "",
      LINE_SPEED : linespeed ? linespeed : "",
      DEW_POINT_EPOXY: dewpointepoxy ? dewpointepoxy : "",
      EPOXYGUN: noofepoxygun ? noofepoxygun : "",
      ADHESIVE_SCREW_RPM : adhesiveExtrpm ? adhesiveExtrpm : "",
      PEPP_RPM1: peppExtrpm1 ? peppExtrpm1 : "",
      PEPP_RPM2: peExtRPM2? peExtRPM2 : "",
      RESULT: selectedResult.value ? selectedResult.value : "",
      CHROM_MANUFACT : chromateManufacturer ? chromateManufacturer : "",
      CHROMATE_GRADE: Cgrade ? Cgrade : "",
      CHROMATE_BATCH: batch1 ? batch1 : "",
      EPOXY_MANUFACT : epoxyManufacturer ? epoxyManufacturer : "",
      EPOXY_GRADE: Egrade ? Egrade : "",
      EPOXY_BATCH: batch2 ? batch2 : "",
      ADHENSIVE_MANUFACT : adhensiveManufacturer ? adhensiveManufacturer : "",
      ADHESIVE_GRADE: Agrade ? Agrade : "",
      ADHESIVE_BATCH: batch3 ? batch3 : "",
      PEPP_MANUFACT : peppManufacturer ? peppManufacturer : "",
      PEPP_GRADE: PEgrade ? PEgrade : "",
      PEPP_BATCH: batch4 ? batch4 : "",
      
      A1: A1 ? A1 : "",
      A2: A2 ? A2 : "",
      A3: A3 ? A3 : "",
      A4: A4 ? A4 : "",
      A5: A5 ? A5 : "",
      A6: A6  ? A6 : "",
      A7: A7 ? A7 : "",
      A8: A8 ? A8 : "",
      A9: A9 ? A9 : "",
      A10: A10 ? A10 : "",
      A11: A11 ? A11 : "",
      A12: A12 ? A12 : "",
      B1: B1 ? B1 : "",
      B2: B2 ? B2 : "",
      B3: B3 ? B3 : "",
      B4: B4 ? B4 : "",
      B5: B5 ? B5 : "",
      B6: B6 ? B6 : "",
      B7: B7 ? B7 : "",
      B8: B8 ? B8 : "",
      B9: B9 ? B9 : "",
      B10: B10 ? B10 : "",
      B11: B11 ? B11 : "",
      B12: B12 ? B12 : "",
      FA1: FA1 ? FA1 : "",
      FA2: FA2 ? FA2 : "",
      FA3: FA3 ? FA3 : "",
      FA4: FA4 ? FA4 : "",
      FA5: FA5 ? FA5 : "",
      FA6: FA6 ? FA6 : "",
      FA7: FA7 ? FA7 : "",
      FA8: FA8 ? FA8 : "",
      FA9: FA9 ? FA9 : "",
      FA10: FA10 ? FA10 : "",
      FA11: FA11 ? FA11 : "",
      FA12: FA12 ? FA12 : "",
      FB1: FB1 ? FB1 : "",
      FB2: FB2 ? FB2 : "",
      FB3: FB3 ? FB3 : "",
      FB4: FB4 ? FB4 : "",
      FB5: FB5 ? FB5 : "",
      FB6: FB6 ? FB6 : "",
      FB7: FB7 ? FB7 : "",
      FB8: FB8 ? FB8 : "",
      FB9: FB9 ? FB9 : "",
      FB10: FB10 ? FB10 : "",
      FB11: FB11 ? FB11 : "",
      FB12: FB12 ? FB12 : "",
      LENGTH: row.TBP_PIPE_LNG_10 ? row.TBP_PIPE_LNG_10 : "0",
      HEAT_NO : row.TBP_HEAT_NO ? row.TBP_HEAT_NO : "",
      MATERIAL : row.TBP_NO_MATNR ? row.TBP_NO_MATNR : "" ,
      PROCESS_DT: SHIFT_DATE,
      TIME : formattedTime ? formattedTime : "",
      
    }));
    console.log("AppDatta",appData)
    setAppTable(appData)
    

  } catch (error) {
    console.error("bindAppData error:", error);
    if (error?.response) {
      console.error("error.response:", error.response);
      alertify.error("Server error: " + (error.response?.data?.message || error.response.statusText || error.response.status));
    } else {
      alertify.error("Error fetching data: " + (error?.message || error));
    }
  } finally {
    setLoading(false);
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
    // { label: "HOLD", value: "HOLD" },
  ];

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const AppColumns = [
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
      frozen: true,
    },
    {
      title: "C Proc",
      field: "CURR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "N Proc",
      field: "NEXT_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plan Proc",
      field: "PLAN_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "ASL No",
      field: "ASL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
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
      editor : "input",
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
      title: "Pipe Temp Before Chromate",
      field: "PIPE_TEMP_BEFORE_CHROMATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Visual Chromate App",
      field: "VISUAL_CHROMATE_APP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Solution C Temp",
      field: "SOLUTION_C_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    
    
    {
      title: "PipeTemp After Chomate",
      field: "PIPTMP_AFCRM_110",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "PipeTemp Before FBE",
      field: "PIPTMP_BEFBE_110",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "ADHE Film Temp",
      field: "ADHESIVE_FILM_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "PE Film Temp",
      field: "PEPP_FILM_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "WTB Quench",
      field: "WATER_TEMP_BEFORE_QUENCHING",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "WTA Quench",
      field: "WATER_TEMP_AFTER_QUENCHING",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Line Speed",
      field: "LINE_SPEED",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Dew Point epoxy",
      field: "DEW_POINT_EPOXY",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "EpoxyGun",
      field: "EPOXYGUN",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "ADHE RPM",
      field: "ADHESIVE_SCREW_RPM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "PEPP RPM1",
      field: "PEPP_RPM1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "PEPP RPM2",
      field: "PEPP_RPM2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    
      {
        title: "Chromate Manufact",
        field: "CHROM_MANUFACT",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Chromate Grade",
        field: "CHROMATE_GRADE",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Chromate Batch",
        field: "CHROMATE_BATCH",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Epoxy Manufact",
        field: "EPOXY_MANUFACT",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Epoxy Grade",
        field: "EPOXY_GRADE",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Epoxy Batch",
        field: "EPOXY_BATCH",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Adhesive Manufact",
        field: "ADHENSIVE_MANUFACT",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Adhesive Grade",
        field: "ADHESIVE_GRADE",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "Adhesive Batch",
        field: "ADHESIVE_BATCH",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "PE/PP Grade",
        field: "PEPP_GRADE",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "PE/PP Batch",
        field: "PEPP_BATCH",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A1",
        field: "A1",
        headerFilterPlaceholder: "search...",
        hozAlign: "left",
        editor: "input",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A2",
        field: "A2",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A3",
        field: "A3",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A4",
        field: "A4",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A5",
        field: "A5",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A6",
        field: "A6",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A7",
        field: "A7",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A8",
        field: "A8",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A9",
        field: "A9",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A10",
        field: "A10",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A11",
        field: "A11",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "A12",
        field: "A12",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B1",
        field: "B1",
        headerFilterPlaceholder: "search...",
        hozAlign: "left",
        editor: "input",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B2",
        field: "B2",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B3",
        field: "B3",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B4",
        field: "B4",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B5",
        field: "B5",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B6",
        field: "B6",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      
      {
        title: "B7",
        field: "B7",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B8",
        field: "B8",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B9",
        field: "B9",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B10",
        field: "B10",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B11",
        field: "B11",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "B12",
        field: "B12",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA1",
        field: "FA1",
        headerFilterPlaceholder: "search...",
        hozAlign: "right",
        editor: "input",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA2",
        field: "FA2",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA3",
        field: "FA3",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA4",
        field: "FA4",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA5",
        field: "FA5",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA6",
        field: "FA6",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA7",
        field: "FA7",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA8",
        field: "FA8",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA9",
        field: "FA9",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA10",
        field: "FA10",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA11",
        field: "FA11",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FA12",
        field: "FA12",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "FB1",
        field: "FB1",
        headerFilterPlaceholder: "search...",
        hozAlign: "right",
        editor: "input",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB2",
        field: "FB2",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB3",
        field: "FB3",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB4",
        field: "FB4",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB5",
        field: "FB5",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB6",
        field: "FB6",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB7",
        field: "FB7",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB8",
        field: "FB8",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB9",
        field: "FB9",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB10",
        field: "FB10",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB11",
        field: "FB11",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        editor: "input"
      },
      {
        title: "FB12",
        field: "FB12",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor : "input"
      },
      {
        title: "length",
        field: "LENGTH",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
      },
      {
        title: "Heat No",
        field: "HEAT_NO",
        headerFilterPlaceholder: "search...",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
     },
     
     {
      title: "Material",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
   
   
    // {
    //   title: "Dt of Proc",
    //   field: "PROCESS_DT",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
      
    // },
    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    
  ];

  const downloadExcelAppTableData = () => {
    console.log("Downloading");
    if (selectedAppTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedAppTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD11S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedAppTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };


  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Application stage inspection (110)"
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
                          Entry of App Stage Inspection 
                        </MDTypography>
                      </Grid>
                      

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                      <Tooltip title="show elements">
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
                    <Grid container spacing={1.5}>
                      
                   
                    
                      
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
                          name="inspectorname"
                          value={inspectorname}
                          onChange={(e) => setInspectorName(e.target.value)}
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
                          onChange={handleResultChange}
                          value={selectedResult}
                        />
                      </Grid>
                      
                        
                      {/* <Grid item xs={1.5}>
                            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap > Date of process* </MDTypography>
                            <DatePicker id="prcdt" value={selectedProcessDt} onChange={(date) => setSelectedProcessDt(date)} />
                      </Grid> */}


                      <Grid item xs={1.5}>
                        <Tooltip title="Pipe Temp Before Chrom" arrow placement="top">
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
                                  
                                  Pipe Temp Before Chrom
                                  
                                </span>

                                
                              </Box>
                            </MDTypography>
                            </Tooltip>
                        <MDInput
                          label=""
                          name="pipetempbeforechromate"
                          value={pipetempbeforechromate}
                          onChange={(e) => setPipeTempBeforeChromate(e.target.value)}
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
                          Visual of Chromate App
                        </MDTypography>
                        <MDInput
                          label=""
                          name="visualofchromateapp"
                          style={{ backgroundColor: "#dac292" }}
                          value={visualofchromateapp}
                          onChange={(e) => setVisualofChromateApp(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                         <Tooltip title="Chromate Solution Temp" arrow placement="top">
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
                                  
                                  Chromate Solution Temp
                                  
                                </span>

                                
                              </Box>
                            </MDTypography>
                            </Tooltip>
                        <MDInput
                          label=""
                          name="chromatesolutionapp"
                          value={chromatesolutionapp}
                          onChange={(e) => setChromateSolApp(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.5}>
                        <Tooltip title="PipeTemp AfterChromApp" arrow placement="top">
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          PipeTemp AfterChromApp
                        </MDTypography>
                        </Tooltip>
                        <MDInput
                          label=""
                          name="pipetempafterchromateapp"
                          value={pipetempafterchromateapp}
                          onChange={(e) => setPipeTempAfterChromateApp(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.5}>
                         <Tooltip title="PipeTemp FBEApp Induct-II" arrow placement="top">
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
                                  
                                  PipeTemp FBEApp Induct-II
                                  
                                </span>

                                
                              </Box>
                            </MDTypography>
                            </Tooltip>
                        <MDInput
                          label=""
                          name="pipetempfbeapp2"
                          value={pipetempfbeapp2}
                          onChange={(e) => setPipeTempFBEApp2(e.target.value)}
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
                          Adhesive Film Temp
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="adhesivefilmtemp"
                          value={adhesivefilmtemp}
                          onChange={(e) => setAdhesiveFilmTemp(e.target.value)}
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
                          PE/PP FilmTemp
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="peppfilmtemp"
                          value={peppfilmtemp}
                          onChange={(e) => setPEPPFilmTemp(e.target.value)}
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
                          WaterTemp beforeQuench
                        </MDTypography>
                        <MDInput
                          label=""
                          name="watertempbeforequenching"
                          value={watertempbeforequenching}
                          onChange={(e) => setWaterTempBeforeQuenching(e.target.value)}
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
                          WaterTemp AfterQuench
                        </MDTypography>
                        <MDInput
                          label=""
                          name="watertempafterquenching"
                          value={watertempafterquenching}
                          onChange={(e) => setWaterTempAfterQuenching(e.target.value)}
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
                          Chromate Manufacturer
                        </MDTypography>
                        <MDInput
                          label=""
                          name="chromateManufacturer"
                          style={{ backgroundColor: "#dac292" }}
                          value={chromateManufacturer}
                          onChange={(e) => setChromateManufacturer(e.target.value)}
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
                          Chromate Grade
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Cgrade"
                          value={Cgrade}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => setCGrade(e.target.value)}
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
                          Batch1
                        </MDTypography>
                        <MDInput
                          label=""
                          name="batch1"
                          style={{ backgroundColor: "#dac292" }}
                          value={batch1}
                          onChange={(e) => setBatch1(e.target.value)}
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
                          Epoxy Manufacturer
                        </MDTypography>
                        <MDInput
                          label=""
                          name="epoxyManufacturer"
                          value={epoxyManufacturer}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => setEpoxyManufacturer(e.target.value)}
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
                          Epoxy Grade
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Egrade"
                          style={{ backgroundColor: "#dac292" }}
                          value={Egrade}
                          onChange={(e) => setEGrade(e.target.value)}
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
                          Batch2
                        </MDTypography>
                        <MDInput
                          label=""
                          name="batch2"
                          style={{ backgroundColor: "#dac292" }}
                          value={batch2}
                          onChange={(e) => setBatch2(e.target.value)}
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
                          Adhensive Manufacturer
                        </MDTypography>
                        <MDInput
                          label=""
                          name="adhensiveManufacturer"
                          value={adhensiveManufacturer}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => setAdhensiveManufacturer(e.target.value)}
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
                          Adhesive Grade
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Agrade"
                          value={Agrade}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => setAGrade(e.target.value)}
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
                          Batch3
                        </MDTypography>
                        <MDInput
                          label=""
                          name="batch3"
                          style={{ backgroundColor: "#dac292" }}
                          value={batch3}
                          onChange={(e) => setBatch3(e.target.value)}
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
                          PE/PP Manufacturer
                        </MDTypography>
                        <MDInput
                          label=""
                          name="peppManufacturer"
                          style={{ backgroundColor: "#dac292" }}
                          value={peppManufacturer}
                          onChange={(e) => setPeppManufacturer(e.target.value)}
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
                          PE/PP Grade
                        </MDTypography>
                        <MDInput
                          label=""
                          name="PEgrade"
                          value={PEgrade}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => setPEGrade(e.target.value)}
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
                          Batch4
                        </MDTypography>
                        <MDInput
                          label=""
                          name="batch4"
                          value={batch4}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => setBatch4(e.target.value)}
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
                          LineSpeed(Mtr/min)
                        </MDTypography>
                        <MDInput
                          label=""
                          name="linespeed"
                          value={linespeed}
                          onChange={(e) => setLineSpeed(e.target.value)}
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
                          DewPoint of epoxy
                        </MDTypography>
                        <MDInput
                          label=""
                          name="dewpointepoxy"
                          value={dewpointepoxy}
                          onChange={(e) => setDewPointEpoxy(e.target.value)}
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
                          No.of EpoxyGun
                        </MDTypography>
                        <MDInput
                          label=""
                          name="noofepoxygun"
                          value={noofepoxygun}
                          onChange={(e) => setNoofEpoxyGun(e.target.value)}
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
                          PE/PP ExtruderRPM1
                        </MDTypography>
                        <MDInput
                          label=""
                          name="peppExtrpm1"
                          value={peppExtrpm1}
                          onChange={(e) => setPePpExtrRPM1(e.target.value)}
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
                          PE/PP Extruder RPM2
                        </MDTypography>
                        <MDInput
                          label=""
                          name="peExtRPM2"
                          value={peExtRPM2}
                          onChange={(e) => setPeExtRPM2(e.target.value)}
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
                          Adhesive ExtruderRPM
                        </MDTypography>
                        <MDInput
                          label=""
                          name="adhesiveExtrpm"
                          value={adhesiveExtrpm}
                          onChange={(e) => setAdhesiveExtrRPM(e.target.value)}
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
                          onChange={(e) => setRemarks(e.target.value)}
                        />
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
                          Entry of Epoxy/Flowrate
                        </MDTypography>
                      </Grid>
                       
                      

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                      <Tooltip title="Show Elements">
                        <IconButton
                            color="white"
                            aria-label="toggle"
                            onClick={() => setExpanded2(!expanded2)}
                        >
                           {expanded2 ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear">
                          <IconButton
                            color="white"
                            onClick={() => handleEpoxyFlow(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>
                  {expanded2 && (
                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                  
                      <Grid item xs={12}>Epoxyguns(Kg/cm2)</Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A1
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A1"
                          value={A1}
                          onChange={(e) => setA1(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A2
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A2"
                          value={A2}
                          onChange={(e) => setA2(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A3
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A3"
                          value={A3}
                          onChange={(e) => setA3(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A4
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A4"
                          value={A4}
                          onChange={(e) => setA4(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A5
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A5"
                          value={A5}
                          onChange={(e) => setA5(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A6
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A6"
                          value={A6}
                          onChange={(e) => setA6(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A7
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A7"
                          value={A7}
                          onChange={(e) => setA7(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A8
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A8"
                          value={A8}
                          onChange={(e) => setA8(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A9
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A9"
                          value={A9}
                          onChange={(e) => setA9(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A10
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A10"
                          value={A10}
                          onChange={(e) => setA10(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A11
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A11"
                          value={A11}
                          onChange={(e) => setA11(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A12
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="A12"
                          value={A12}
                          onChange={(e) => setA12(e.target.value)}
                        />
                      </Grid>

                     


                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B1
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B1"
                          value={B1}
                          onChange={(e) => setB1(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B2
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B2"
                          value={B2}
                          onChange={(e) => setB2(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B3
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B3"
                          value={B3}
                          onChange={(e) => setB3(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B4
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B4"
                          value={B4}
                          onChange={(e) => setB4(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B5
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B5"
                          value={B5}
                          onChange={(e) => setB5(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B6
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B6"
                          value={B6}
                          onChange={(e) => setB6(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B7
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B7"
                          value={B7}
                          onChange={(e) => setB7(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B8
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B8"
                          value={B8}
                          onChange={(e) => setB8(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B9
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B9"
                          value={B9}
                          onChange={(e) => setB9(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B10
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B10"
                          value={B10}
                          onChange={(e) => setB10(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B11
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B11"
                          value={B11}
                          onChange={(e) => setB11(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B12
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="B12"
                          value={B12}
                          onChange={(e) => setB12(e.target.value)}
                        />
                      </Grid>

                     

                      <Grid item xs={12}></Grid>
                      <Grid item xs={12}> Flow Rate(kg/cm2)</Grid>
                     
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A1
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA1"
                          value={FA1}
                          onChange={(e) => setFA1(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                         A2
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA2"
                          value={FA2}
                          onChange={(e) => setFA2(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A3
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA3"
                          value={FA3}
                          onChange={(e) => setFA3(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A4
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA4"
                          value={FA4}
                          onChange={(e) => setFA4(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A5
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA5"
                          value={FA5}
                          onChange={(e) => setFA5(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                           A6
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA6"
                          value={FA6}
                          onChange={(e) => setFA6(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A7
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA7"
                          value={FA7}
                          onChange={(e) => setFA7(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A8
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA8"
                          value={FA8}
                          onChange={(e) => setFA8(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A9
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA9"
                          value={FA9}
                          onChange={(e) => setFA9(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A10
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA10"
                          value={FA10}
                          onChange={(e) => setFA10(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                           A11
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FA11"
                          value={FA11}
                          onChange={(e) => setFA11(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          A12
                        </MDTypography>
                        <MDInput
                          label=""
                          sx={{ "& input": {textAlign: "right",},}}
                          name="FA12"
                          value={FA12}
                          onChange={(e) => setFA12(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B1
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB1"
                          value={FB1}
                          onChange={(e) => setFB1(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B2
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB2"
                          value={FB2}
                          onChange={(e) => setFB2(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B3
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB3"
                          value={FB3}
                          onChange={(e) => setFB3(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B4
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB4"
                          value={FB4}
                          onChange={(e) => setFB4(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B5
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB5"
                          value={FB5}
                          onChange={(e) => setFB5(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B6
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB6"
                          value={FB6}
                          onChange={(e) => setFB6(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B7
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB7"
                          value={FB7}
                          onChange={(e) => setFB7(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B8
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB8"
                          value={FB8}
                          onChange={(e) => setFB8(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B9
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB9"
                          value={FB9}
                          onChange={(e) => setFB9(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B10
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB10"
                          value={FB10}
                          onChange={(e) => setFB10(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B11
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB11"
                          value={FB11}
                          onChange={(e) => setFB11(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          B12
                        </MDTypography>
                        <MDInput
                          label=""
sx={{ "& input": {textAlign: "right",},}}
                          name="FB12"
                          value={FB12}
                          onChange={(e) => setFB12(e.target.value)}
                        />
                      </Grid>
                      
                      
                  <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => bindAppData()}
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
                                                    <IconButton color="white"  onClick={() => updateData()}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelAppTableData()}
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
                      {getAppTable?.length > 0 && <div id="AppTableContainer" />}

                       
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getAppTable.length} of{" "}
                          {getAppTable.length} entries
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
