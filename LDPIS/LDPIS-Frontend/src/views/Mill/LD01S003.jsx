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
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";

export default function LD01S003() {
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

  const [RMList, setRMList] = useState([]);
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [process, setProcess] = useState(null);
  const [nxtproc, setNxtproc] = useState("30");
  const [nxtproc2, setNxtproc2] = useState("Final Inspection (0090)");
  const [inspector, setInspector] = useState("");
  const [RESULT, setRESULT] = useState([]);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [pono, setPoNo] = useState("");
  const [salesOrdNo, setSalesOrdNo] = useState("");

  const [angle, setAngle] = useState("");
  const [selectedCalibDueDt, setSelectedCalibDueDt] = useState(null);
  const [selectedShiftDt, setSelectedShiftDt] = useState(null);
  const [issexBatch, setIsExBatch] = useState("");
  const [material, setMaterial] = useState("");
  const [endFacingColumnDescriptions, setEndFacingColumnDescriptions] =
    useState([]);
  const [endFacingData, setEndFacingData] = useState([]);
  const [remark, setRemark] = useState("");
  const [getEndFacingTable, setEndFacingTable] = useState([]);
  const [selectedEndFacingTable, setSelectedEndFacingTable] = useState(null);
  //const [valueRadio, setValueRadio] = React.useState("2C");
  const [SHIFT, setSHIFT] = useState("");
  const [SHIFT_DATE, setSHIFT_DATE] = useState("");
  //const [filter, setFilter] = useState(defaultHrForm);
  //const [rawMatData, setRawMatData] = React.useState([]);
  var customerTable = React.createRef();
  //const [orderwiseProd, setOrderwiseProd] = useState([]);
  const [orderwiseProdData, setOrderwiseProdData] = useState(null);

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
  // const handleRadioChange = (event) => {
  //   const newValue = event.target.value;
  //   setValueRadio(newValue);

  //   console.log(event.target.value)
  //   //console.log(valueRadio)
  //   setRMList([])
  //   setrmBatchId(null)
  //   setPipeNoList([])
  //   setPipeNo(null)
  //   setEndFacingTable([])
  //   if (event.target.value) {
  //     setLoading(true);
  //     GetAuthorization().then((data) => {
  //       Promise.all([
  //         getRmList(data.accessToken,newValue),
  //         getPipeNoList(data.accessToken),

  //       ]).finally(() => {
  //         setLoading(false);
  //       });
  //     });
  //   }
  //};

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
          getRmList(data.accessToken, "1P"),
          getPipeNoList(data.accessToken, "1P"),
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

  const clearFilterOnDate = () => {
    //setOrderwiseProd([,]);
    //setPipeCreationTableData([,]);
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
      var url = "api/LD01S001/getTataDate";
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

  const orderwiseProdColumn = [
    {
      title: "Order Id",
      field: "EWI_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No",
      field: "EWI_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EOM_MS_PIECE_ACTL",
      title: "RM Wt.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
    },
    {
      field: "EWI_MS_PIECE_ACTL",
      title: "Schd. Wt.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
    },
    {
      field: "EWI_SEC1",
      title: "Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.EWI_SEC1;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            EWI_SEC1: 0,
          });
        } else {
          row.update({
            EWI_SEC1: rl,
          });
          // setWeightBtnSts(false);
          // formulaCalc(cell);
        }
      },
    },
    {
      field: "EWI_SEC2",
      title: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.EWI_SEC2;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            EWI_SEC2: 0,
          });
        } else {
          row.update({
            EWI_SEC2: rl,
          });
          // setWeightBtnSts(false);
          // formulaCalc(cell);
        }
      },
    },
    {
      field: "EWI_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.EWI_LENGTH;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            EWI_LENGTH: 0,
          });
        } else {
          row.update({
            EWI_LENGTH: rl,
          });
          // setWeightBtnSts(false);
          // formulaCalc(cell);
        }
      },
    },
    {
      field: "TUBE_COUNT",
      title: "No Of Tubes",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(0);
            return d;
          }
        }
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.TUBE_COUNT;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            TUBE_COUNT: 0,
          });
        } else {
          row.update({
            TUBE_COUNT: rl,
          });
          // setWeightBtnSts(false);
          // formulaCalc(cell);
        }
      },
    },
  ];

  const downloadExcelcustomerTableData = () => {
    console.log("Downloading");
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
    var fileName = "LD01S003" + ".xlsx";

    window.XLSX = XLSX;

    selectedEndFacingTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const getorderwiseProdData = () => {
    setLoading(true);
    if (rmBatchId.value == "" || rmBatchId.value == null) {
      alertify.error("RM Batch Id Should Not Be Blank");
      setLoading(false);
      return;
    }
    {
      var prodStartDateVal = document.getElementById("prodStartDate").value;
      var prodEndDateVal = document.getElementById("prodEndDate").value;
      var currentTime = new Date();

      // Step 2: Convert prodEndDateVal to a Date object
      var prodEndDateCheck = new Date(prodEndDateVal);

      // Step 3: Compare prodEndDate with the current time
      if (prodEndDateCheck > currentTime) {
        // Step 4: Display an error message using alertify.error
        alertify.error(
          "The selected end date is greater than the current time."
        );
        setLoading(false);
        return;
      }
      if (new Date(prodStartDateVal) >= new Date(prodEndDateVal)) {
        alertify.error("Start time should be before end time");
        setLoading(false);
        return;
      }
      // if (prevRecorder !== 'Y') {
      var hoursDifference = (currentTime - prodStartDateVal) / (1000 * 60 * 60);
      if (hoursDifference > 72) {
        alertify.error(
          "Start date must be within 72 hours of the current time."
        );
        setLoading(false);
        return;
      }
      //}
      if (prodStartDateVal != "") {
        var d = new Date(prodStartDateVal);
        // var prodStartDt =
        //   ("0" + d.getDate()).slice(-2) +
        //   "-" +
        //   d.toString().substr(4, 3) +
        //   "-" +
        //   d.getFullYear();
      } else {
        alertify.error("Please select Prod Start Dt for batch create");
        setLoading(false);
        return;
      }
      if (prodEndDateVal != "") {
        // var d = new Date(prodEndDateVal);
        // var prodEndDt =
        //   ("0" + d.getDate()).slice(-2) +
        //   "-" +
        //   d.toString().substr(4, 3) +
        //   "-" +
        //   d.getFullYear();
      } else {
        alertify.error("Please select Prod End Dt for batch create");
        setLoading(false);
        return;
      }
    }
    var data = {
      RM_BATCH: rmBatchId.value,
    };

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post("api/LD01S003/getorderwiseProdData", data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            setLoading(false);
          } else {
            console.log(response?.data);
            setOrderwiseProdData(response?.data);
            setLoading(false);
          }
        });
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
      var pageName = "LD01S003";
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

  const handleProcessChange = (value) => {
    setProcess(value);
    setPipeNo("");
    setrmBatchId("");
    setSelectedEndFacingTable([]);

    if (value) {
      console.log(value.value);
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getRmList(data.accessToken, value.value),
          getPipeNoList(data.accessToken, value.value),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const updateApi = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedEndFacingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }

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

    // Get and format the dates
    var prodStartDateVal = formatDate(
      document.getElementById("prodStartDate").value
    );
    var prodEndDateVal = formatDate(
      document.getElementById("prodEndDate").value
    );

    // var prodStartDateVal = document.getElementById("prodStartDate").value;
    // var prodEndDateVal = document.getElementById("prodEndDate").value;
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push({
        PLANT: "0780",
        BATCH_NO: item._row.data.PIPE_NO ? item._row.data.PIPE_NO : "",
        CD_PROC: item._row.data.CUR_PROC ? item._row.data.CUR_PROC : "",
        BATCH_PROC_NO: "0",
        NEXT_PROC: item._row.data.NXT_PROC ? item._row.data.NXT_PROC : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: SHIFT ? SHIFT : "",
        WEIGHT: "",
        STATUS: statusValue,
        PAR_COIL_NO: rmBatchId.value ? rmBatchId.value : "",
        ID_FIRST_PAR: "",
        ID_ORDER_NO: "0",
        ITEM_NO: "",
        QUALITY_CD: "",
        MATNR: material ? material : "",
        FLAG: "",
        START_DT: prodStartDateVal,
        END_DT: prodEndDateVal,
        RESULT: item._row.data.RESULT ? item._row.data.RESULT : "",
        REMARK: item._row.data.REMARK ? item._row.data.REMARK : "",
        HEAT_NO: "",
        INSP_NAME: item._row.data.INSPECTOR ? item._row.data.INSPECTOR : "",
        PIPE_OD_10: item._row.data.PIPE_OD ? item._row.data.PIPE_OD : "",
        PIPE_THK_10: item._row.data.PIPE_THICK ? item._row.data.PIPE_THICK : "",
        PIPE_LNG_10: item._row.data.PIPE_LEN ? item._row.data.PIPE_LEN : "",
        ANGLE: item._row.data.ANGLE ? item._row.data.ANGLE : "",
      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    var url = "api/LD01S003/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          var res = response.data[0];
          if (res == "N") {
            //console.log("msg",res[0])
            alertify.error("Row Insertion Failed");
            //setE1Table([,]);
          } else {
            alertify.success("Row Inserted Successfully !!!");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  // const getMatNo = async (value,accessToken) => {
  //   // if (newToken) {
  //   //   const rsp = await getAuthorization();
  //   // }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + accessToken,
  //     },
  //   };

  //   //setLoading(true);
  //   let data = {
  //     RM_BATCH: value.value? value.value : "",
  //   };
  //   console.log("datarm",data)

  //   var url = "api/LD01S003/getMatNo";
  //   axiosAPI
  //     .post(url, data, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         var items = [];
  //         console.log(response.data);
  //         response.data.map((row) => {
  //           console.log(row);
  //           var obj = new Object();
  //           obj.label = row.LOM_NO_MATNR;
  //           obj.value = row.LOM_NO_MATNR;
  //           items.push(obj);
  //         });
  //         console.log("material",items[0].value)
  //         setMaterial(items[0].value);
  //         Promise.all([

  //         ])

  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };

  // const getPoNo = async (value,accessToken) => {
  //   // if (newToken) {
  //   //   const rsp = await getAuthorization();
  //   // }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + accessToken,
  //     },
  //   };

  //   //setLoading(true);
  //   let data = {
  //     RM_BATCH: value.value? value.value : "",
  //     PIPE_NO: pipeno.value ? pipeno.value : "",
  //   };
  //   console.log("datarm",data)

  //   var url = "api/LD01S003/getPoNo";
  //   axiosAPI
  //     .post(url, data, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         var items = [];
  //         console.log(response.data);
  //         response.data.map((row) => {
  //           console.log(row);
  //           var obj = new Object();
  //           obj.label = row.LOM_ID_ORDER_CUS;
  //           obj.value = row.LOM_ID_ORDER_CUS;
  //           items.push(obj);
  //         });
  //         console.log("pono",items[0].value)
  //         setPoNo(items[0].value)
  //         //setMaterial(items[0].value);
  //         Promise.all([

  //         ])

  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };

  const getRmList = async (accessToken, status) => {
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
      status: status,
      pipeno: pipeno ? pipeno : "",
    };
    console.log("status", data);
    var url = "api/LD01S003/getRmList";
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
          Promise.all([
            getPipeNoList("", accessToken, data.status),
            //  getMatNo("",accessToken),
            //  getPoNo("",accessToken,data.pipeno)
          ]);
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
      status: status,
      rmBatch: value.value ? value.value : "",
    };
    var url = "api/LD01S003/getPipeNoList";
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

          setPipeNoList(items);
          if (items.length > 0) {
            setPipeNo(items[0]);
          } else {
            setPipeNo(null);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleRMBatchChange = (value) => {
    //console.log(value);

    setPipeNo(null);
    setrmBatchId(value);
    setEndFacingData([]);

    let status;
    if (process?.value) {
      status = process.value;
    } else status = "1P";
    //let pipeno = pipeno
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([getPipeNoList(value, data.accessToken, status)]).finally(
          () => {
            setLoading(false);
          }
        );
      });
    }
    //console.log(rmBatchId);
  };

  const handlePipeNoChange = (value) => {
    //console.log(value);
    setPipeNo(value);
    setEndFacingData([]);
    //console.log(rmBatchId);
    //let pipeno = pipeno
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          // getPoNo(value,data.accessToken)
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleMain = (newToken = false) => {
    setPipeNo("");
    setrmBatchId("");
    selectedEndFacingTable([]);
  };

  const handleClearAll = (newToken = false) => {
    setInspector("");
    setProcess(null);
    setSelectedResult(null);
    setPipeNo(null);
    setrmBatchId(null);
    setRemark("");
    setRESULT("");
    setEndFacingData([]);
  };

  // const search = async () => {

  //   console.log(valueRadio)
  //   };

  // const fillData = async () => {

  //   //selectedEndFacingTable([])
  //   const formatDateToDDMMYYYY = (date) => {
  //     if (!date) return "";
  //     const d = new Date(date);
  //     const day = String(d.getDate()).padStart(2, '0');
  //     const month = String(d.getMonth() + 1).padStart(2, '0');
  //     const year = d.getFullYear();
  //     return `${day}-${month}-${year}`;
  // };
  //   var data = {
  //     rmBatchId : rmBatchId.value ? rmBatchId.value: "",
  //     pipeno : pipeno.value ? pipeno.value : "",
  //     inspector : inspector ? inspector : "",
  //     result : RESULT ? RESULT : "",
  //     pono : pono ? pono : "",
  //     angle : angle ? angle : "",
  //     shift : selectedShiftDt ? (selectedShiftDt) : "",
  //     issexBatch : issexBatch ? issexBatch : "",
  //     material : material ? material : "",
  //     remark : remark ? remark : "",

  //   };

  //   console.log("mandfield",data)

  //   // if (data.rmBatchId == "" || data.pipeno == "" || data.pono == "" || data.inspector == "" || data.angle == ""  || data.shift == null || data.issexBatch == "" || data.material == "" || data.remark == "" || data.result == "") {
  //   //   alertify.error("Please Mandatory Fields");
  //   //   return;
  //   // }
  //   //const dummyData =  bindEndFacingData();

  //   console.log("dummydata",dummyData)
  //   const table = new Tabulator("#endFacingTableContainer", {
  //       pagination: "local",
  //       paginationSize: 12,
  //       data: dummyData,
  //       columns: endFacingColumn,
  //       height: 400,
  //       layout: "fitDataFill",
  //     });

  //     setSelectedEndFacingTable(table)
  //     // const table1 = setSelectedHydraTable();
  //     //  table1.addRow(newRow);
  //     return;
  //   };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fillData = async () => {
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    console.log(rmBatchId, pipeno);
    if (!rmBatchId?.value && !pipeno?.value) {
      alertify.error("Please Select either a single Pipe or Just a RM batch");
      return;
    }

    try {
      // Fetch data only once

      const dummyData = await bindEndFacingData();

      if (!dummyData || dummyData.length === 0) {
        alertify.error("No data found.");
        return;
      }
      console.log(endFacingColumnDescriptions, dummyData);
      setEndFacingData(dummyData);
      setSelectedEndFacingTable(
        new Tabulator("#endFacingTableContainer", {
          pagination: "local",
          paginationSize: 12,
          data: dummyData, // Set fetched data
          columns: endFacingColumnDescriptions, // Ensure column definitions are correct
          height: 400,
          layout: "fitDataFill",
        })
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      alertify.error("Error fetching data.");
    }
  };

  const handleResultChange = (value) => {
    setRESULT(value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];

  const bindEndFacingData = async () => {
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log("hello");
      const currentDate = new Date();
      const formattedDate = formatDateToDDMMYYYY(currentDate);
      const formattedTime = currentDate.toTimeString().split(" ")[0];

      let requestData = {
        RM_BATCH: rmBatchId?.value || "",
        status: process?.value || "1P",
      };

      if (pipeno && pipeno?.value) {
        requestData.PIPE_NO = pipeno.value;
      } else {
        requestData.PIPE_NO = "";
      }
      console.log(requestData);
      const response = await axiosAPI.post(
        "api/LD01S003/getFillData",
        requestData,
        defaultOptions
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid response from API");
      }
      const columns = response.data[0].map((col) => {
        if (col.field.startsWith("TBP")) {
          return {
            title: col.title,
            field: col.field,
            headerFilterPlaceholder: "search...",
            headerFilter: "input",
            editor: "select",
            editorParams: {
              values: {
                OK: "OK",
                "NOT OK": "NOT OK",
              },
            },
            formatter: function (cell, formatterParams) {
              var value = cell.getValue();
              return value;
            },
          };
        } else {
          return {
            title: col.title,
            field: col.field,
            headerFilterPlaceholder: "search...",
            headerFilter: "input",
          };
        }
      });

      // Add additional columns fixed as per your requirements
      const additionalColumns = [
        {
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          hozAlign: "center",
          headerSort: false,
        },
        {
          title: "Result",
          field: "RESULT",
          headerFilterPlaceholder: "search...",
          headerFilter: "input",
          //editable: true,
          editor: "list", // Use the new list editor
          // editorParams: {
          //     // Define the list of options as an array of objects
          //     values: [
          //         { value: "OK", label: "OK" },
          //         { value: "NOT OK", label: "NOT OK" },
          //     ],
          // },
          editorParams: {
            values: { OK: "OK", "NOT OK": "NOT OK" },
          },
          formatter: function (cell) {
            const value = cell.getValue();
            cell.getElement().style["background-color"] = "#DA8EE7";
            cell.getElement().style["color"] = "#FFFFFF";
            return value;
          },
        },
        {
          title: "Remark",
          field: "REMARK",
          headerFilterPlaceholder: "search...",
          headerFilter: "input",
          editor: "input",
        },
      ];

      // Combine the columns
      setEndFacingColumnDescriptions([...additionalColumns, ...columns]);
      const dummyData = response.data[1].map((row) => {
        // Create a new object for each row
        const newDataObject = {};

        // Populate dynamically based on the column headers
        columns.forEach((col) => {
          newDataObject[col.field] =
            row[col.field] !== undefined ? row[col.field] : "";
        });

        // Add inspector, RESULT, and REMARK fields with default values (you may have your logic for fetching these values)
        newDataObject.INSPECTOR = inspector || ""; // Assuming inspector is defined elsewhere in your component
        newDataObject.RESULT = RESULT.value || ""; // Assuming RESULT is defined elsewhere in your component
        newDataObject.REMARK = remark || ""; // Assuming remark is defined elsewhere in your component

        return newDataObject;
      });
      return dummyData;
    } catch (error) {
      //console.error("Error fetching API data:", error);
      alertify.error("Error fetching data.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (newToken = false) => {
    if (endFacingData.length !== 0) {
      // if (newToken) {
      //   const rsp = await getAuthorization();
      // }
      const token = await GetAuthorization();

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,//localStorage.getItem("tmm_accessToken"),
        },
      };

      var url;
      var holdData = selectedEndFacingTable.getSelectedRows();
      if (inspector.length == 0) {
        alertify.error("Please enter Inspector Name");
        return;
      }
      var newDataHold = [];
      // Step 4: Extract data from selected rows
      holdData.forEach(function (item) {
        console.log(item);
        newDataHold.push(item._row.data);
      });

      console.log(newDataHold);
      console.log(process);
      var data = {
        newDataHold: newDataHold,
        process: process?.value ? process?.value : "1P",
        inspector: inspector,
      };
      console.log(data);

      setLoading(true);
      url = "api/LD01S003/confirm";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data == "Y") {
              alertify.success("Hold Released  successfully");

              setEndFacingData([]);
              handleClearAll(true);
            } else {
              alertify.error(response.data);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      alertify.error("No data available for  details !");
    }
  };

  useEffect(() => {
    if (endFacingColumnDescriptions && endFacingColumnDescriptions.length > 0) {
      //if (endFacingData && endFacingData.length > 0) {

      setSelectedEndFacingTable(
        new Tabulator("#endFacingTableContainer", {
          pagination: "local",
          paginationSize: 12,
          data: endFacingData, // Set fetched data
          columns: endFacingColumnDescriptions, // Ensure column definitions are correct
          height: 400,
          layout: "fitDataFill",
        })
      );
      // }
    }
  }, [endFacingColumnDescriptions, endFacingData]);

  const endFacingColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    // {
    //   title: "CUR PROC",
    //   field: "CUR_PROC",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   //editor : "input"
    // },

    // {
    //   title: "Next Proc",
    //   field: "NXT_PROC",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   //editor : "input"
    // },

    {
      title: "Pipe No",
      field: "LOM_ID_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "RM Batch",
      field: "LOM_ID_PAR_COIL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "Pipe OD",
      field: "LOM_SEC2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },

    {
      title: "Pipe Thick",
      field: "LOM_SEC1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },

    {
      title: "Pipe Len",
      field: "LOM_LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
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
      title: "Result",
      field: "RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          ok: "OK",
          notok: "NOT OK",
          hold: "HOLD",
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
      title: "Remark",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
  ];

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="11 - Hold Handling" />
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
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

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
                          RM Batch *
                        </MDTypography>

                        <ReactSelect
                          id="rmList"
                          options={RMList}
                          onChange={handleRMBatchChange}
                          variant="h6"
                          value={rmBatchId}
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
                          Pipe No *
                        </MDTypography>

                        <ReactSelect
                          id="pipenoList"
                          options={pipenoList}
                          onChange={handlePipeNoChange}
                          //onChange={handlePipeNoChange}
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
                          Process *
                        </MDTypography>

                        <ReactSelect
                          id="process"
                          options={[
                            { label: "10", value: "1P" },
                            { label: "20", value: "2P" },
                            { label: "30", value: "3P" },
                            { label: "40", value: "4P" },
                            { label: "50", value: "5P" },
                            { label: "60", value: "6P" },
                          ]}
                          onChange={handleProcessChange}
                          variant="h6"
                          value={process}
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
                                onChange={handleRadioChange}
                                
                              >
                                <FormControlLabel
                                  value="2C"
                                  control={<Radio />}
                                  label="Normal"
                                />
                                <FormControlLabel
                                  value="2P"
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

              {/* <Grid item xs={12}>
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
                          Visual Inspection  DATA
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      
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
                        <div id="orderwiseProd" />
                        
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid> */}

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
                          Data
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
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
                          name="inspector"
                          value={inspector}
                          onChange={(e) => setInspector(e.target.value)}
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
                          value={RESULT}
                        />
                      </Grid>

                      <Grid item xs={6.5}>
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
                          onChange={(e) => setRemark(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6.5}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => fillData()}
                        >
                          Fill Data
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
                          Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => confirm(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelcustomerTableData()}
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
                        {getEndFacingTable && (
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
