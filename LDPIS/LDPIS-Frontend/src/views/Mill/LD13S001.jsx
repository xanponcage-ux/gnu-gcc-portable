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

  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("E");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [inspectorname, setInspectorName] = useState("");
  const [selectedProcessDt, setSelectedProcessDt] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [SHIFT, setSHIFT] = useState([]);
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  const [result, setResult] = useState("");
  const [selectedResult, setSelectedResult] = React.useState([]);
  const [selectedHoliday, setSelectedHoliday] = React.useState([]);
  const [selectedFinalStation, setSelectedFinalStation] = React.useState([]);
  const [salesord, setSalesOrd] = useState("");
  const [lineitem, setLineItem] = useState("");
  const [cutbackfend, setCutBackFEnd] = useState("");
  const [cutbacktend, setCutBackTEnd] = useState("");
  const [epoxybandfend, setEpoxyBandFEnd] = useState("");
  const [epoxybandtend, setEpoxyBandTEnd] = useState("");
  const [cutbackanglefend, setCutBackAngleFEnd] = useState("");
  const [cutbackangletend, setCutBackAngleTEnd] = useState("");
  const [rmg1, setRMG1] = useState("");
  const [rmg2, setRMG2] = useState("");
  const [rmg3, setRMG3] = useState("");
  const [rmg4, setRMG4] = useState("");
  const [coatwt, setCoatWt] = useState("");
  const [selectedInspDate, setSelectedInspDate] = useState(null);
  const [getLPETable, setLPETable] = useState([]);
  const [selectedLPETable, setSelectedLPETable] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [expanded1, setExpanded1] = useState(true);

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
      var pageName = "LD13S001";
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

  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log(value);
      var url = "api/LD13S001/getTataDate";
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
  const getPipeNoList = async (accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "EC",
      rmBatch: "",
    };
    var url = "api/LD13S001/getPipeNoList";
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

          setPipeNoList(items);
          setPipeNo(null);
          setrmBatchId(null);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const setTableNull = () => {
    setLPETable([]);
  };

  useEffect(() => {
    if (getLPETable?.length > 0) {
      const table = new Tabulator("#LPETableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getLPETable,
        columns: LPEColumns,
        // height: 200,
        // initialSort: [
        //   { column: "ORDER_NO", dir: "asc" },
        //   { column: "ITEM", dir: "asc" },
        //   { column: "TBP_DIA_END_10", dir: "asc" },
        // ],
        layout: "fitDataFill",
      });

      setSelectedLPETable(table);
    } else {
      setSelectedLPETable(null);
    }
  }, [getLPETable]);

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setrmBatchId(
      value?.parentCoilNo
        ? { label: value.parentCoilNo, value: value.parentCoilNo }
        : null
    );
    setLPETable([]);
    setSelectedLPETable(null);
    handleClearVal(true);

    // handleClearVal clears Pipe as part of the old RM-Batch flow, so restore
    // the selected Pipe after clearing the dependent process fields.
    setPipeNo(value);

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getOrdDetails(data.accessToken, value),
          getNxtProc(data.accessToken, value),
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      setrmBatchId(null);
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setNxtproc("");
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
    setLPETable([]);
    setSelectedLPETable(null);
  };

  const handleOrderItemChange = (event) => {
    setOrdItem(event.target.value);
    setPipeNo(null);
    setrmBatchId(null);
    setCustName("");
    setNxtproc("");
    setLPETable([]);
    setSelectedLPETable(null);
  };

  const handleClearVal = (newToken = false) => {
    setPipeNo(null);
    setNxtproc("");
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setCutBackFEnd("");
    setCutBackTEnd("");
    setEpoxyBandFEnd("");
    setEpoxyBandTEnd("");
    setCutBackAngleFEnd("");
    setCutBackAngleTEnd("");
    setRMG1("");
    setRMG2("");
    setRMG3("");
    setRMG4("");
    setCoatWt("");
    setRemarks("");
    setInspectorName("");
    setSelectedResult("");
    setSalesOrd("");
    setSelectedHoliday("");
    setSelectedFinalStation("");
    setSelectedInspDate(null);
    setLineItem("");
    setLPETable([]);
    setSelectedLPETable(null);
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
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setCutBackFEnd("");
    setCutBackTEnd("");
    setEpoxyBandFEnd("");
    setEpoxyBandTEnd("");
    setCutBackAngleFEnd("");
    setCutBackAngleTEnd("");
    setRMG1("");
    setRMG2("");
    setRMG3("");
    setRMG4("");
    setCoatWt("");
    setRemarks("");
    setInspectorName("");
    setSelectedResult("");
    setSalesOrd("");
    setSelectedHoliday("");
    setSelectedFinalStation("");
    setSelectedInspDate(null);
    setLineItem("");
    setLPETable([]);
    setSelectedLPETable(null);
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
      CURR_PROC: "E",
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
          setNxtproc(items[0]?.value || "");
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
      PIPE_NO: pipeno?.value || "",
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
          setOrdNo(items[0]?.value || "");
          setOrdItem(orditem[0]?.value || "");
          setCustName(custname[0]?.value || "");

          Promise.all([]);
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

    var selectedRows = selectedLPETable.getSelectedRows();
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
      newData.push({
        PLANT: "0780",
        BATCH_NO: item._row.data.PIPE_NO ?? null,
        C_PROC: item._row.data.C_PRC ?? null,
        BATCH_PROC_NO: "0",
        NEXT_PROC: item._row.data.N_PRC ?? null,
        PROD_DATE: SHIFT_DATE,
        SHIFT: selectedShift?.value ?? null,
        WEIGHT: item._row.data.WEIGHT ?? null,
        STATUS: "EC",
        PAR_COIL_NO: item._row.data.PARENT_BATCH ?? rmBatchId?.value ?? null,
        ID_FIRST_PAR: null,
        ID_ORDER_NO: item._row.data.ORDER_NO ?? null,
        ITEM_NO: item._row.data.ITEM ?? null,
        QUALITY_CD: null,
        MATNR: item._row.data.MATERIAL ?? null,
        FLAG: null,
        START_DT: prodstartdt,
        END_DT: prodenddt,
        RESULT: item._row.data.RESULT ?? null,
        REMARK: item._row.data.REMARK ?? null,
        HEAT_NO: item._row.data.HEAT_NO ?? null,
        INSP_NAME: item._row.data.INSPECTOR ?? null,
        PIPE_LNG_10: item._row.data.LENGTH ?? null,
        CB_FEND_130: item._row.data.CUT_BACK_F_END ?? null,
        CB_TEND_130: item._row.data.CUT_BACK_T_END ?? null,
        EP_FEND_130: item._row.data.EPOXY_BAND_F_END ?? null,
        EP_TEND_130: item._row.data.EPOXY_BAND_T_END ?? null,
        CA_FEND_130: item._row.data.CUT_ANGEL_F_END ?? null,
        CA_TEND_130: item._row.data.CUT_ANGEL_T_END ?? null,
        HOLIDAT_130: item._row.data.HOLIDAY_TEST ?? null,
        RESUMG_1_130: item._row.data.RM_G1 ?? null,
        RESUMG_2_130: item._row.data.RM_G2 ?? null,
        RESUMG_3_130: item._row.data.RM_G3 ?? null,
        RESUMG_4_130: item._row.data.RM_G4 ?? null,
        FSTATION_130: item._row.data.FINAL_STATION ?? null,
        HOLD_RSN: item._row.data.HOLD_REASON ?? null,
        FIELD_NO: item._row.data.FIELD_NO ?? null,
      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    var url = "api/LD13S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          var res = response.data[0][0];
          if (res == "Y") {
            alertify.success("Row Inserted Successfully !!!");
            setLPETable([]);
            setSelectedLPETable(null);
            handleClearAll();
            handleClearMain();
            handleAllBelow();
            fetchDetails();
          } else {
            // alertify.alert(response?.data[0]);
            showErrorAlert(response?.data[0]);
            // setLPETable([]);
            // setSelectedLPETable(null)
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleClearAll = (newToken = false) => {
    setInspectorName("");
    setSelectedResult("");
    setSalesOrd("");
    setSelectedHoliday("");
    setSelectedFinalStation("");
    setSelectedInspDate(null);
    setLineItem("");
    setLPETable([]);
    setSelectedLPETable(null);
  };

  const handleClearMain = (newToken = false) => {
    handleClearAll();
    handleAllBelow();
    setPipeNo(null);
    setrmBatchId(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setSelectedShift(null);
    setLPETable([]);
    setSelectedLPETable(null);
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

  const handleAllBelow = (newToken = false) => {
    setCutBackFEnd("");
    setCutBackTEnd("");
    setEpoxyBandFEnd("");
    setEpoxyBandTEnd("");
    setCutBackAngleFEnd("");
    setCutBackAngleTEnd("");
    setRMG1("");
    setRMG2("");
    setRMG3("");
    setRMG4("");
    setCoatWt("");
    setRemarks("");
    setLPETable([]);
    setSelectedLPETable(null);
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const bindLPEData = async () => {
  try {
    setLoading(true);
    setLPETable([]);
    setSelectedLPETable(null);
    
    var prodStartDateInput = document.getElementById("prodStartDate").value;
    var prodEndDateInput = document.getElementById("prodEndDate").value;
    var currentTime = new Date();
    var prodEndDateCheck = new Date(prodEndDateInput);

    // Validation: End date should not be greater than current time
    if (prodEndDateCheck > currentTime) {
      alertify.error(
        "The selected end date is greater than the current time."
      );
      setLoading(false);
      return;
    }

    // Validation: Start date should be before end date
    if (new Date(prodStartDateInput) >= new Date(prodEndDateInput)) {
      alertify.error("Start time should be before end time");
      setLoading(false);
      return;
    }

    // Validation: Start date must be within 72 hours of current date
    var hoursDifference =
      (currentTime - new Date(prodStartDateInput)) / (1000 * 60 * 60);
    if (hoursDifference > 72) {
      alertify.error(
        "Start date must be within 72 hours of the current time."
      );
      setLoading(false);
      return;
    }

    // Validation: Prod Start Date is required
    if (prodStartDateInput == "") {
      alertify.error("Please select Prod Start Dt");
      setLoading(false);
      return;
    }

    // Validation: Prod End Date is required
    if (prodEndDateInput == "") {
      alertify.error("Please select Prod End Dt");
      setLoading(false);
      return;
    }

    const hasPipeNo = Boolean(pipeno?.value);
    const hasOrderNo = Boolean(String(ordNo || "").trim());
    const hasOrderItem = Boolean(typeof ordItem === "string" ? ordItem.trim() : (ordItem && ordItem.value ? String(ordItem.value).trim() : String(ordItem || "").trim()));

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

    let data = {
      Result: selectedResult ? selectedResult : "",
      Inspector: inspectorname ? inspectorname : "",
      prodstartdt: prodStartDateInput ? prodStartDateInput : "",
      prodenddt: prodEndDateInput ? prodEndDateInput : "",
    };

    // Mandatory field validation: Inspector and Result
    if (data.Inspector == "" || data.Result == "") {
      alertify.error("All fields marked * are mandatory. Kindly fill.");
      setLoading(false);
      return;
    }

    // **UPDATED MANDATORY FIELD VALIDATION**
    // Only the following fields are mandatory (as per your requirement):
    // Result, Holiday, Final Station, Final Insp. Date, Remarks, Inspector, Shift
    if (
      !selectedResult ||
      !selectedResult.value ||
      !selectedHoliday ||
      !selectedHoliday.value ||
      !selectedFinalStation ||
      !selectedFinalStation.value ||
      !selectedInspDate ||
      !remarks ||
      !inspectorname ||
      !selectedShift ||
      !selectedShift.value
    ) {
      alertify.error("All fields marked * are mandatory. Kindly fill.");
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

      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace("Sept", "Sep")
        .toUpperCase()
        .replace(/ /g, "-");
    };

    const Finaldt = formatDate(selectedInspDate);
    const formattedDate = formatDateToDDMMYYYY(new Date());
    const formattedTime = new Date().toTimeString().split(" ")[0];

    let requestData = {
      RM_BATCH: hasPipeNo ? rmBatchId?.value || "" : "",
      STATUS: "EC",
      PIPE_NO: hasPipeNo ? pipeno.value : "",
      ORDNO: hasPipeNo ? "" : String(ordNo || "").trim(),
      ORDITEM: hasPipeNo ? "" : (typeof ordItem === "string" ? ordItem.trim() : (ordItem && ordItem.value ? String(ordItem.value).trim() : String(ordItem || "").trim())),
    };

    let response = await axiosAPI.post(
      "api/LD13S001/getFillData",
      requestData,
      defaultOptions
    );

    console.log("response", response);
    if (response.status !== 200 || !response.data) {
      throw new Error("Invalid response from API");
    }

    if (response.data.length == 0) {
      alertify.error("NO Data Found in V_BARE_PDO");
      setLoading(false);
      return;
    }

    let LPEData = response.data.map((row) => ({
      C_PRC: nxtproc2 ? nxtproc2 : "",
      N_PRC: row.NEXT_PROC || nxtproc || "",
      PIPE_NO: row.TBP_BATCH_NO ? row.TBP_BATCH_NO : "",
      TBP_DIA_END_10: row.TBP_DIA_END_10 || "",
      LENGTH: row.TBP_PIPE_LNG_10 ? row.TBP_PIPE_LNG_10 : "0",
      PROC_DT: formattedDate,
      COAT_WT: row.COAT_WT ? row.COAT_WT : "",
      FIELD_NO: "",
      REMARKS: remarks ? remarks : "",
      FIELD_TEST: "",
      CUT_BACK_F_END: cutbackfend ? cutbackfend : "",
      CUT_BACK_T_END: cutbacktend ? cutbacktend : "",
      EPOXY_BAND_F_END: epoxybandfend ? epoxybandfend : "",
      EPOXY_BAND_T_END: epoxybandtend ? epoxybandtend : "",
      CUT_ANGEL_F_END: cutbackanglefend ? cutbackanglefend : "",
      CUT_ANGEL_T_END: cutbackangletend ? cutbackangletend : "",
      HOLIDAY_TEST: selectedHoliday.value ? selectedHoliday.value : "",
      RM_G1: rmg1 ? rmg1 : "",
      RM_G2: rmg2 ? rmg2 : "",
      RM_G3: rmg3 ? rmg3 : "",
      RM_G4: rmg4 ? rmg4 : "",
      FINAL_STATION: selectedFinalStation.value
        ? selectedFinalStation.value
        : "",
      FINAL_STATION_DT: Finaldt ? Finaldt : "",
      INSPECT_NAME: inspectorname ? inspectorname : "",
      RESULT: selectedResult.value ? selectedResult.value : "",
      HEAT_NO: row.TBP_HEAT_NO ? row.TBP_HEAT_NO : "",
      MATERIAL: row.TBP_NO_MATNR ? row.TBP_NO_MATNR : "",
      TIME: formattedTime,
      ORDER_NO: row.ORDER_NO || "",
      ITEM: row.ITEM || "",
      PARENT_BATCH: row.LOM_ID_PAR_COIL_NO || rmBatchId?.value || "",
      CUST_NAME: row.CUST_NAME || "",
      PLAN_PROC: row.PLAN_PROC || "",
      ASL_NO: row.ASL_NO || "",
      WEIGHT: row.WEIGHT || "",
      FIELD_TEST: row.FIELD_TEST || "",
    }));

    console.log("LPEData", LPEData);
    setLPETable(LPEData);
  } catch (error) {
    console.error("Error fetching data:", error);
    alertify.error("Error fetching data.");
  } finally {
    setLoading(false);
  }
};


  const handleResultChange = (value) => {
    setSelectedResult(value);
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };

  const handleHolidayChange = (value) => {
    setSelectedHoliday(value);
  };

  const handleFinalStationChange = (value) => {
    setSelectedFinalStation(value);
  };

  const clearFilterOnDate = () => {
    setLPETable([]);
    setSelectedLPETable(null);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
  ];

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const HolidayType = [
    { label: "15_KV_OK", value: "15_KV_OK" },
    { label: "25_KV_OK", value: "25_KV_OK" },
  ];

  const FinalStationType = [
    { label: "VISUAL_OK", value: "VISUAL_OK" },
    { label: "REPAIR", value: "REPAIR" },
    { label: "REJECT", value: "REJECT" },
  ];

  const LPEColumns = [
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
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "ASL No",
      field: "ASL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
          // "NOT OK": "NOT OK",
          // HOLD: "HOLD",
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
      title: "Remarks",
      field: "REMARKS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      width: 150,
      visible:false,
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
      title: "Field No",
      field: "FIELD_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Weight(MTs)",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Coat Wt(MTs)",
      field: "COAT_WT",
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
      field: "C_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Next Proc",
      field: "N_PRC",
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
      title: "Dt of Proc",
      field: "PROC_DT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Field Test",
      field: "FIELD_TEST",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "CB F End",
      field: "CUT_BACK_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },

    {
      title: "CB T End",
      field: "CUT_BACK_T_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "EB F End",
      field: "EPOXY_BAND_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "EB T End",
      field: "EPOXY_BAND_T_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "CA F End",
      field: "CUT_ANGEL_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "CA T End",
      field: "CUT_ANGEL_T_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Holiday",
      field: "HOLIDAY_TEST",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "RM G1",
      field: "RM_G1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "RM G2",
      field: "RM_G2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "RM G3",
      field: "RM_G3",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "RM G4",
      field: "RM_G4",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Final Station",
      field: "FINAL_STATION",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Fin Station Dt",
      field: "FINAL_STATION_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Inspector",
      field: "INSPECT_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },

    {
      title: "Heat No",
      field: "HEAT_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    
    {
      title: "Material",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
  ];

  const downloadExcelLPETableData = () => {
    console.log("Downloading");
    if (selectedLPETable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedLPETable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD13S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedLPETable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="3LPE Final stage inspection(130)"
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
                          Entry of LPE stage Inspect
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
                          Coating Quantity & Field No
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
                            Inspector*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="inspectorname"
                            value={inspectorname}
                            onChange={(e) => {
                              setInspectorName(e.target.value), setTableNull();
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
                        <Grid item xs={1.8}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Holiday*
                          </MDTypography>
                          <ReactSelect
                            options={HolidayType}
                            onChange={(e) => {
                              handleHolidayChange(e);
                              setTableNull();
                            }}
                            value={selectedHoliday}
                          />
                        </Grid>
                        <Grid item xs={1.8}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Final Station*
                          </MDTypography>
                          <ReactSelect
                            options={FinalStationType}
                            onChange={(e) => {
                              handleFinalStationChange(e);
                              setTableNull();
                            }}
                            value={selectedFinalStation}
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
                            {" "}
                            Final Insp.Date*{" "}
                          </MDTypography>
                          <DatePicker
                            id="inspdate"
                            value={selectedInspDate}
                            onChange={(date) => {
                              setSelectedInspDate(date), setTableNull();
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
                            Line Item*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="lineitem"
                            value={lineitem}
                            onChange={(e) => {
                              setLineItem(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid> */}
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
                      <Grid item xs={3.5}>
                        <MDTypography variant="h6" color="white">
                          Cut Back/Epoxy Band and residual Magnetism
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Show Elements">
                          <IconButton
                            color="white"
                            aria-label="toggle"
                            onClick={() => setExpanded1(!expanded1)}
                          >
                            {expanded1 ? (
                              <ExpandLessIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleAllBelow(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>
                  {expanded1 && (
                    <MDBox px={3} py={3}>
                      <Grid container spacing={1}>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Cut Back FEnd
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="cutbackfend"
                            value={cutbackfend}
                            onChange={(e) => {
                              setCutBackFEnd(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Cut Back TEnd
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="cutbacktend"
                            value={cutbacktend}
                            onChange={(e) => {
                              setCutBackTEnd(e.target.value);
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
                            CutBack Angle FEnd
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="cutbackanglefend"
                            value={cutbackanglefend}
                            onChange={(e) => {
                              setCutBackAngleFEnd(e.target.value);
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
                            CutBack Angle TEnd
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="cutbackangletend"
                            value={cutbackangletend}
                            onChange={(e) => {
                              setCutBackAngleTEnd(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Epoxy Band FEnd
                          
                          </MDTypography>
                          <MDInput
                            label=""
                            name="epoxybandfend"
                            value={epoxybandfend}
                            onChange={(e) => {
                              setEpoxyBandFEnd(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Epoxy Band TEnd
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="epoxybandtend"
                            value={epoxybandtend}
                            onChange={(e) => {
                              setEpoxyBandTEnd(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            RM G1
                          </MDTypography>
                          <MDInput
                            label=""
                            name="rmg1"
                            value={rmg1}
                            style={{ backgroundColor: "#dac292" }}
                            onChange={(e) => {
                              setRMG1(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            RM G2
                          </MDTypography>
                          <MDInput
                            label=""
                            name="rmg2"
                            value={rmg2}
                            style={{ backgroundColor: "#dac292" }}
                            onChange={(e) => {
                              setRMG2(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            RM G3
                          </MDTypography>
                          <MDInput
                            label=""
                            name="rmg3"
                            style={{ backgroundColor: "#dac292" }}
                            value={rmg3}
                            onChange={(e) => {
                              setRMG3(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>
                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            RM G4
                          </MDTypography>
                          <MDInput
                            label=""
                            name="rmg4"
                            value={rmg4}
                            style={{ backgroundColor: "#dac292" }}
                            onChange={(e) => {
                              setRMG4(e.target.value);
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
                            Coat Wt*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="coatwt"
                            value={coatwt}
                            onChange={(e) => {
                              setCoatWt(e.target.value);
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
                            Remarks*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="remarks"
                            style={{ backgroundColor: "#dac292" }}
                            value={remarks}
                            onChange={(e) => {
                              setRemarks(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => bindLPEData()}
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
                          3LPE Final stage Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => updateData()}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelLPETableData()}
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
                        {getLPETable?.length > 0 && (
                          <div id="LPETableContainer" />
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
                          Showing 1 to {getLPETable.length} of{" "}
                          {getLPETable.length} entries
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