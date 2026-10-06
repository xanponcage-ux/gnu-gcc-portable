import React, { useEffect, useState, useRef, forwardRef, useMemo } from "react";

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

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";

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
import RefreshIcon from "@mui/icons-material/Refresh";

import "../../tabulatorCss.scss";
import { BorderColor } from "@mui/icons-material";

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

  const [inspector, setInspector] = useState("");
  const [result, setResult] = useState("");
  const [selectedResult, setSelectedResult] = React.useState([]);
  const [selectedCalibDt, setSelectedCalibDt] = useState(null);
  const [selectedCalibDueDt, setSelectedCalibDueDt] = useState(null);
  const [selectedShiftDt, setSelectedShiftDt] = useState(null);
  const [time, setTime] = useState("");
  const [issexBatch, setIsExBatch] = useState("");
  const [selectedGaugeId, setSelectedGaugeId] = useState(null);
  const [gaugerange, setGaugeRange] = useState("");
  const [material, setMaterial] = useState("");
  const [remark, setRemark] = useState("");
  const [pipeCreationTableData, setPipeCreationTableData] = useState([]);
  const [pipeCreationTable, setPipeCreationTable] = useState(null);
  const [orderwiseProd, setOrderwiseProd] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [holdReasonOptions, setHoldReasonOptions] = useState([]);
  const [RMList, setRMList] = useState([]);
  const [orderwiseProdData, setOrderwiseProdData] = useState(null);
  const [valueRadio, setValueRadio] = React.useState("1C");
  const [scrapDt, setScrapDt] = React.useState([]);
  const [scrapTable, setScrapTable] = useState(null);
  ////////////////////////////////////////////////////-USEstate for one time entry
  const [CURR_PROC, setCURR_PROC] = useState("");
  const [NEXT_PROC, setNEXT_PROC] = useState("");
  const [millNo, setMillNo] = useState(null);
  const [DIA_BODY, setDIA_BODY] = useState("");
  const [DIA_END, setDIA_END] = useState("");
  const [WALL_THK_BODY, setWALL_THK_BODY] = useState("");
  const [PIPE_LNG, setPIPE_LNG] = useState("");
  const [DEPTH, setDEPTH] = useState("");
  const [WLD_TEMP, setWLD_TEMP] = useState("");
  const [TEMP_QN, setTEMP_QN] = useState("");
  const [MILL_RMK, setMILL_RMK] = useState("");
  const [SHIFT_DATE, setSHIFT_DATE] = useState("");
  const [RBT, setRBT] = useState("");
  const [WALL_THK_END, setWALL_THK_END] = useState("");
  const [ID_FLASH, setID_FLASH] = useState("");
  const [WIDTHS, setWIDTHS] = useState("");
  const [CURRENTT, setCURRENTT] = useState("");
  const [FREQUENCY, setFREQUENCY] = useState("");
  const [INSP_NAME, setINSP_NAME] = useState("");
  const [SHIFT, setSHIFT] = useState("");
  const [FLATNG_0_O, setFLATNG_0_O] = useState("");
  const [STRGHTNES_F_END, setSTRGHTNES_F_END] = useState("");
  const [STRGHTNES_T_END, setSTRGHTNES_T_END] = useState("");
  const [TWIST, setTWIST] = useState("");
  const [VOLTAGE, setVOLTAGE] = useState("");
  const [WELD_POWER, setWELD_POWER] = useState("");
  const [REMARK, setREMARK] = useState("");
  const [RESULT, setRESULT] = useState("");
  const [FLATNG_90_O, setFLATNG_90_O] = useState("");
  const [SQOC, setSQOC] = useState("");
  const [OUT_ROUND_BODY, setOUT_ROUND_BODY] = useState("");
  const [CONCV, setCONCV] = useState("");
  const [NORMZ_TEMP, setNORMZ_TEMP] = useState("");
  const [SAMPLE, setSAMPLE] = useState("");
  const [BATCH_NO, setBATCH_NO] = useState("");
  const [MATE_NO, setMATE_NO] = useState("");
  const [ROC, setROC] = useState("");
  const [OUT_ROUND_END, setOUT_ROUND_END] = useState("");
  const [CONVX, setCONVX] = useState("");
  const [MILL_SPD, setMILL_SPD] = useState("");
  const [remScrapWt, setRemScrapWt] = useState(0);
  const [fldType, setFldType] = useState("");
  const [geometry, setGeometry] = useState("");
  const [isSecNA, setIsSecNA] = useState(false);
  const [isFinNA, setIsFinNA] = useState(false);
  const [isNFinNA, setIsNFinNA] = useState(false);
  const [isCA, setIsCA] = useState(false);
  const [pipeWtChngFlag, setPipeWtChngFlag] = React.useState(false);

  const flatList = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];

  //const [filter, setFilter] = useState(defaultHrForm);
  //const [rawMatData, setRawMatData] = React.useState([]);
  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    inspector: "",
    result: "",
    selectedCalibDt: null,
    selectedCalibDueDt: null,
    selectedShiftDt: null,
    selectedGaugeId: null,
    gaugerange: "",
    material: "",
    remark: "",
    pipeCreationTable: [],
  });

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  //page load
  useEffect(() => {
    async function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }

      if (initialLoad == false) {
        const response = await getAuthorization();
        if (response) {
          validateUser();
          getScheduleId();
          setInitialLoad(true);
        }
      }
    }
    fetchData();
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

  useEffect(() => {
    if (pipeCreationTableData && pipeCreationTableData.length > 0) {
      // console.log(pipeCreationTableData);
      const table = new Tabulator("#pipeCreationTable", {
        pagination: "local",
        paginationSize: 12,
        data: pipeCreationTableData,
        columns: pipeCreationColumn,
        rowFormatter: colorPipeRowBySequence,
        //height: 400,
        layout: "fitDataFill",
      });

      setPipeCreationTable(table);

      setScrapTable(
        new Tabulator("#scarpTableDiv", {
          //height: 250,
          data: scrapDt,
          columns: scrapColumns,
        })
      );
    }
  }, [pipeCreationTableData, scrapDt]);

  const scrapColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "ID PDI",
      field: "IDPDI",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
      visible: false,
      frozen: true,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "P_NAME",
      title: "P_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      visible: false,
    },
    {
      title: "Material",
      field: "MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Material Desc",
      field: "MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    // {
    //   field: "LOM_NO_PIECES",
    //   title: "No of pcs",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   headerSort: false,
    //   editor: "input",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    //   cellEdited: (cell) => {
    //     var row = cell.getRow();
    //     var rl = cell._cell.row.data.LOM_NO_PIECES;
    //     if (isNaN(rl)) {
    //       alertify.error("Please enter a valid number");
    //       row.update({
    //         LOM_NO_PIECES: 0,
    //       });
    //     } else {
    //       row.update({
    //         LOM_NO_PIECES: rl,
    //       });
    //       // setLoading(true);
    //       // var data;
    //       // if (selectedPlant.value == "0788") {
    //       //   data = {
    //       //     P_PLANT: selectedPlant.value,
    //       //     P_BATCH_ID: selMbatch.value,
    //       //     P_PROD_NAME: cell.getData()?.P_NAME ? cell.getData()?.P_NAME : ProductName,
    //       //     P_NO_PCS: cell.getData()?.LOM_NO_PIECES,
    //       //     P_LENGTH: insertTableData[0]?.EWI_LENGTH,
    //       //     P_OD: insertTableData[0]?.EWI_SEC2,
    //       //     P_ID: insertTableData[0]?.IDIA,
    //       //     P_THICKNESS: insertTableData[0]?.EWI_SEC1,
    //       //   };
    //       // } else {
    //       //   data = {
    //       //     P_PLANT: selectedPlant.value,
    //       //     P_BATCH_ID: selMbatch.value,
    //       //     P_NO_PCS: cell.getData()?.LOM_NO_PIECES,
    //       //     P_LENGTH: insertTableData[0]?.EWI_LENGTH,
    //       //     P_OD: insertTableData[0]?.EWI_SEC2,
    //       //     P_ID: insertTableData[0]?.IDIA,
    //       //     P_THICKNESS: insertTableData[0]?.EWI_SEC1,
    //       //   };
    //       // }

    //       // GetAuthorization().then((token) => {
    //       //   var defaultOptions = {
    //       //     headers: {
    //       //       Authorization: "Bearer " + token.accessToken,
    //       //     },
    //       //   };
    //       //   axiosAPI
    //       //     .post("api/LDSM004/getPieceActl", data, defaultOptions)
    //       //     .then((response) => {
    //       //       if (response.statusText != "" && response.statusText != "OK") {
    //       //         setLoading(false);
    //       //       } else {
    //       //         cell.getRow()?.update({ NET_WT: response.data[0][0] });
    //       //         setLoading(false);
    //       //       }
    //       //     });
    //       // });
    //     }
    //   },
    // },
    {
      title: "Weight(Kg) ",
      field: "NET_WT",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 200,
      validator: [
        "integer",
        {
          type: "min",
          parameters: 0,
          message: "Weight cannot be in decimal",
        },
      ],
      // editableusers,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value !== "") {
            return Math.floor(parseInt(value));
          }
        }
        return 0;
        // if (value != undefined) {
        //   if (value.length == 5 && value != undefined) {
        //     return value;
        //   } else if (value != "") {
        //     var d = parseFloat(value).toFixed(3);
        //     return d;
        //   }
        // } else {
        //   return 0;
        // }
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.NET_WT;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          return 0;
          // row.update({
          //   NET_WT: 0,
          // });
        } else {
          const intValue = Math.floor(parseInt(rl));
          return intValue;
          // row.update({
          //   NET_WT: intValue,
          // });
          // let isSelected = false;
          // if (row?._row?.modules?.select?.selected) {
          //   setChemBlock(true);
          //   isSelected = true;
          // }

          // var EWI_MS_PIECE_ACTL = cell._cell.row.data.EWI_MS_PIECE_ACTL;
          // if (isSelected) {
          //   row.deselect();
          // }

          // row.update({
          //   EWI_MS_PIECE_ACTL: EWI_MS_PIECE_ACTL,
          // });
          // return;
        }
      },
      editorParams: {
        selectContents: true,
        mask: "9999999",
        maskAutoTrim: true,
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Scrap Batch Id",
      field: "SCRAP_BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 250,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Order Id",
      field: "ORDER_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "QLTY",
      field: "QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
  ];
  const downloadExcelScrapTable = () => {
    if (insertScrapTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = insertScrapTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var fileName = "LDSM004" + ".xlsx";
    insertScrapTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

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
      var pageName = "LD01S001";
      var authDetails = await getScreenAuth(plant, userId, pageName);
      if (authDetails) {
        setRestricted(false);
        console.log(authDetails.payload);
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
  // Check if today is the first day of the month
  const isFirstDayOfMonth = new Date().getDate() === 1;
  // const testDate = new Date(2023, 8, 1); // September is month 8 (0-based index)
  // const isFirstDayOfMonth = testDate.getDate() === 1;

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

  const getScheduleId = async (newToken = false) => {
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

    setLoading(true);
    let data = {
      status: valueRadio,
    };
    var url = "api/LD01S001/getSchedules";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            // if (row[3] == "1") {
            //   setMillNo({ label: "MILL1", value: "MILL1" });
            // } else {
            //   setMillNo({ label: "MILL2", value: "MILL2" });
            // }

            obj.label =
              row[0] + " | " + row[1] + " | " + row[2] + " | " + row[3];
            obj.value = row[0] + "#" + row[3] + "#" + row[2];
            items.push(obj);
            console.log(obj);
          });
          console.log(items);
          setSchedules(items);
          // setSelectedSchedule(items[0]);
          //setMillNo(items[0])
          // setPlant(items);
          // setSelectedPlant(items[0]);
          // getProcessData(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handleScheduleChange = (value) => {
    handleClearMain();
    let mill = value?.label?.slice(-1);
    setSelectedSchedule(value);
    if (mill === "1") {
      // setMillNo({ label: "MILL1", value: "MILL1" });
      setMillNo("MILL1");
    } else {
      setMillNo("MILL2");
    }
  };

  const handleMillNoChange = (value) => {
    setMillNo(value);
  };

  const clearFilterOnDate = () => {
    setOrderwiseProd([,]);
    setPipeCreationTableData([,]);
  };
  // const updateData = async () => {
  //   console.log("hello");
  //   if (pipeCreationTable.getSelectedRows()?.length === 0) {
  //     alertify.error("Please Select Rows to Update");
  //     return;
  //   }

  //   let tableSelect = pipeCreationTable.getSelectedRows();
  //   let selectedData = tableSelect.map((row) => row?._row?.data);
  //   let data = {
  //     rowData: selectedData,
  //   };
  //   const url = "api/LDS030/UpdateHydraData";

  //   GetAuthorization().then((token) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + token.accessToken,
  //       },
  //     };

  //     axiosAPI.post(url, data, defaultOptions).then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         alertify.error("Updation Failed");
  //         //setE1Table([,]);
  //       } else {
  //         if (response.data == 0) {
  //           alertify.error("Updation Failed");
  //           //setE1Table([,]);
  //         } else {
  //           alertify.success("Updation Successfull.");
  //         }
  //       }
  //     });
  //   });
  // };

  const handleClearData = (newToken = false) => {
    setCURR_PROC("");
    setNEXT_PROC("");
    setMillNo(null);
    setDIA_BODY("");
    setDIA_END("");
    setWALL_THK_BODY("");
    setPIPE_LNG("");
    setDEPTH("");
    setWLD_TEMP("");
    setTEMP_QN("");
    setMILL_RMK("");
    // setRBT("");
    setWALL_THK_END("");
    setID_FLASH("");
    setWIDTHS("");
    setCURRENTT("");
    setFREQUENCY("");
    setINSP_NAME("");
    setFLATNG_0_O("");
    setSTRGHTNES_F_END("");
    setSTRGHTNES_T_END("");
    setTWIST("");
    setVOLTAGE("");
    setWELD_POWER("");
    setFLATNG_90_O("");
    setSQOC("");
    setOUT_ROUND_BODY("");
    setCONCV("");
    setNORMZ_TEMP("");
    setSAMPLE("");
    // setBATCH_NO("");
    // setMATE_NO("");
    setROC("");
    setOUT_ROUND_END("");
    setCONVX("");
    setMILL_SPD("");
    setRESULT("");
    setPipeCreationTable(null);
    setPipeCreationTableData([,]);
    setScrapTable(null);
    setScrapDt([,]);
  };

  const handleClearMain = (newToken = false) => {
    handleClearData();
    setSelectedSchedule([]);
    setSHIFT_DATE("");
    setSHIFT("");
    setOrderwiseProdData([,]);
    const prodStartDateInput = document.getElementById("prodStartDate");
    if (prodStartDateInput) {
      prodStartDateInput.value = "";
    }

    const prodEndDateInput = document.getElementById("prodEndDate");
    if (prodEndDateInput) {
      prodEndDateInput.value = "";
    }
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);

    handleClearMain();
  };
  const getorderwiseProdData = () => {
    setLoading(true);
    if (!selectedSchedule || selectedSchedule?.value === "") {
      alertify.error("schedule cannot be blank");
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
      //Start and end time diff should not be more then 5
      var hoursDifference =
        (new Date(prodEndDateVal) - new Date(prodStartDateVal)) /
        (1000 * 60 * 60);
      if (hoursDifference > 5) {
        alertify.error(
          "Difference between Start and End Prod Dt cannot be more than 5 Hrs"
        );
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
    const [value1, value2, value3] = selectedSchedule.value.split("#");
    var data = {
      RM_BATCH: value1, // scheduleid
    };

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post("api/LD01S001/getorderwiseProdData", data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            setLoading(false);
          } else {
            let nextProc = response?.data?.orderwiseData[0]?.NEXT_PROC;
            setNEXT_PROC(nextProc);
            let type = response?.data?.orderwiseData[0]?.EWI_ROUTE_CD;
            setFldType(type);
            let geo = response?.data?.orderwiseData[0]?.GEOMETRY;
            setGeometry(geo);

            const orderwiseDataWithSequence = (response?.data?.orderwiseData || []).map(
              (row, index) => ({
                ...row,
                USER_SEQ:
                  row.USER_SEQ !== undefined && row.USER_SEQ !== null && row.USER_SEQ !== ""
                    ? Number(row.USER_SEQ)
                    : index + 1,
              })
            );
            setOrderwiseProdData(orderwiseDataWithSequence);
            // Transform holdReasonData into the desired object format
            let options = response?.data?.holdReasonData.map((row, index) => {
              return {
                key: index,
                value: row["CD_VALUE"],
                label: row["CD_VALUE"] + " - " + row["CD_DESC"],
              };
            });
            // const formattedHoldReasonOptions = response.data.holdReasonData.reduce((acc, item) => {
            //   acc[item.CD_VALUE||item.CD_DESC] = item.CD_VALUE;
            //   return acc;
            //    }, {});
            //    console.log()
            // Set the hold reason options
            setHoldReasonOptions(options);

            // Fetch the mill number from the response, assuming it holds a valid option
            const selectedMillNo =
              response?.data?.orderwiseData?.[0]?.EWI_WRK_CENTER_NO;
            console.log(selectedMillNo);
            // Create the object to match your options structure, ensuring it exists in your options
            const availableOptions = [
              { label: "MILL1", value: "MILL1" },
              { label: "MILL2", value: "MILL2" },
            ];

            const millOption = availableOptions.find(
              (option) => option.value === selectedMillNo
            );
            const newMillNo = millOption || null; // If not found, set to null to clear
            // Update the mill number state
            //setMillNo(newMillNo);
            setLoading(false);
          }
        });
    });
  };

  useEffect(() => {
    // if(orderDetails && orderDetails.length > 0){
    setOrderwiseProd(
      new Tabulator("#orderwiseProd", {
        //height: 300,
        // pagination: "local",
        //paginationSize: 20,
        data: orderwiseProdData,
        columns: orderwiseProdColumn,
      })
    );
  }, [rmBatchId, SHIFT_DATE, orderwiseProdData]);


  const sequenceRowColors = [
    "#FFF8E1",
    "#E3F2FD",
    "#E8F5E9",
    "#F3E5F5",
    "#FBE9E7",
    "#E0F2F1",
  ];

  const getOrderItemKey = (row = {}) => {
    return `${row.EWI_ID_ORDER_CUS || ""}#${row.EWI_ID_ORD_ITEM_CUS || ""}`;
  };

  const getOrderItemLabel = (row = {}) => {
    return `${row.EWI_ID_ORDER_CUS || ""} | ${row.EWI_ID_ORD_ITEM_CUS || ""}`;
  };

  const getOrderItemEditorValues = () => {
    const rows = orderwiseProd?.getData?.() || orderwiseProdData || [];
    return rows.reduce((acc, row) => {
      const key = getOrderItemKey(row);
      if (key !== "#") {
        acc[key] = getOrderItemLabel(row);
      }
      return acc;
    }, {});
  };

  const getOrderItemRowByKey = (key) => {
    const rows = orderwiseProd?.getData?.() || orderwiseProdData || [];
    return rows.find((row) => getOrderItemKey(row) === key);
  };

  const validateOrderwiseSequence = (rows = []) => {
    if (!rows || rows.length === 0) {
      return { isValid: false, message: "No order-item rows available." };
    }

    const seqValues = rows.map((row) => Number(row.USER_SEQ));
    const invalidRows = rows.filter(
      (row) =>
        row.USER_SEQ === undefined ||
        row.USER_SEQ === null ||
        row.USER_SEQ === "" ||
        !Number.isInteger(Number(row.USER_SEQ)) ||
        Number(row.USER_SEQ) <= 0
    );

    if (invalidRows.length > 0) {
      return {
        isValid: false,
        message: "Sequence must be a positive whole number for every order-item row.",
      };
    }

    const duplicateSeq = seqValues.filter(
      (seq, index) => seqValues.indexOf(seq) !== index
    );

    if (duplicateSeq.length > 0) {
      return {
        isValid: false,
        message: `Duplicate sequence number found: ${[...new Set(duplicateSeq)].join(", ")}`,
      };
    }

    const sortedSeq = [...seqValues].sort((a, b) => a - b);
    for (let i = 0; i < sortedSeq.length; i++) {
      if (sortedSeq[i] !== i + 1) {
        return {
          isValid: false,
          message: "Sequence numbers must be continuous without gaps, starting from 1.",
        };
      }
    }

    return { isValid: true };
  };

  const getSortedOrderwiseRowsBySequence = () => {
    const rows = orderwiseProd?.getData?.() || [];
    return [...rows].sort((a, b) => Number(a.USER_SEQ) - Number(b.USER_SEQ));
  };

  const colorPipeRowBySequence = (row) => {
    const rowData = row.getData();
    const seq = Number(rowData.SOURCE_SEQ);
    const rowElement = row.getElement();
    if (Number.isInteger(seq) && seq > 0) {
      rowElement.style.backgroundColor =
        sequenceRowColors[(seq - 1) % sequenceRowColors.length];
    } else {
      rowElement.style.backgroundColor = "";
    }
  };

  const validatePipeCountAgainstOrderItems = (pipeRows = [], scheduleRows = []) => {
    const expectedCountMap = scheduleRows.reduce((acc, row) => {
      acc[getOrderItemKey(row)] = Number(row.TUBE_COUNT || 0);
      return acc;
    }, {});

    const actualCountMap = pipeRows.reduce((acc, row) => {
      const key = getOrderItemKey(row);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const allKeys = new Set([
      ...Object.keys(expectedCountMap),
      ...Object.keys(actualCountMap),
    ]);

    for (const key of allKeys) {
      const expected = expectedCountMap[key] || 0;
      const actual = actualCountMap[key] || 0;
      if (expected !== actual) {
        const displayKey = key.replace("#", " | ");
        return {
          isValid: false,
          message: `Tube count mismatch for Order-Item ${displayKey}. Expected ${expected}, found ${actual}.`,
        };
      }
    }

    return { isValid: true };
  };

  const orderwiseProdColumn = [
    {
      title: "Seq",
      field: "USER_SEQ",
      width: 80,
      frozen: true,
      headerSort: false,
      hozAlign: "right",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        const value = Number(cell.getValue());
        const row = cell.getRow();
        if (!Number.isInteger(value) || value <= 0) {
          alertify.error("Sequence must be a positive whole number");
          row.update({ USER_SEQ: "" });
          return;
        }
        row.update({ USER_SEQ: value });
        setPipeCreationTableData([]);
        setScrapDt([]);
      },
    },
    {
      title: "Parent Batch",
      field: "EWI_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
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
      hozAlign: "right",
    },
    {
      field: "LOM_MS_PIECE_ACTL",
      title: "RM Wt.(Ton)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      hozAlign: "right",
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
      hozAlign: "right",
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
      hozAlign: "right",
      // editor: "input",
      width: 100,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
      // cellEdited: (cell) => {
      //   var row = cell.getRow();
      //   var rl = cell._cell.row.data.EWI_SEC1;
      //   setPipeCreationTableData([,]);
      //   setScrapDt([,]);
      //   if (isNaN(rl)) {
      //     alertify.error("Please enter a valid number");
      //     row.update({
      //       EWI_SEC1: 0,
      //     });
      //   } else {
      //     row.update({
      //       EWI_SEC1: rl,
      //     });
      //     // setWeightBtnSts(false);
      //     // formulaCalc(cell);
      //   }
      // },
    },
    {
      field: "EWI_SEC2",
      title: "ODIA",
      width: 100,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      hozAlign: "right",
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
        setPipeCreationTableData([,]);
        setScrapDt([,]);
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
      title: "Length(mm)",
      width: 100,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      hozAlign: "right",
      // editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var val = parseFloat(value).toFixed(3);
            return val;
          }
        }
      },
      // cellEdited: (cell) => {
      //   var row = cell.getRow();
      //   var rl = cell._cell.row.data.EWI_LENGTH;
      //   setPipeCreationTableData([,]);
      //   setScrapDt([,]);
      //   if (isNaN(rl)) {
      //     alertify.error("Please enter a valid number");
      //     row.update({
      //       EWI_LENGTH: 0,
      //     });
      //   } else {
      //     row.update({
      //       EWI_LENGTH: rl,
      //     });
      //     // setWeightBtnSts(false);
      //     // formulaCalc(cell);
      //   }
      // },
    },
    {
      title: "No of Tubes Scheduled",
      field: "EWI_COMBINATION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      field: "TUBE_COUNT",
      title: "No Of Pipes",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      hozAlign: "right",
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
        setPipeCreationTableData([,]);
        setScrapDt([,]);
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
    {
      title: "Planned Proc",
      field: "EWI_PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No.",
      field: "LOM_NO_CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material No.",
      field: "EWI_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material No.",
      field: "EWI_FG_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material No.",
      field: "EWI_SFG_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Type",
      field: "EWI_ROUTE_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  //Added for mandatory and non-mandatory fields for API & non - API
  const fldTypeDes = () => {
    if (fldType === "CS-NA") {
      if (
        !WALL_THK_BODY ||
        !PIPE_LNG ||
        !DEPTH ||
        !WLD_TEMP ||
        !MILL_RMK ||
        !WALL_THK_END ||
        !ID_FLASH ||
        !WIDTHS ||
        !CURRENTT ||
        !FREQUENCY ||
        !INSP_NAME ||
        !STRGHTNES_F_END ||
        !TWIST ||
        !VOLTAGE ||
        !WELD_POWER ||
        !SQOC ||
        !CONCV ||
        // !BATCH_NO ||
        // !MATE_NO ||
        !ROC ||
        !CONVX ||
        !MILL_SPD ||
        !RESULT
      ) {
        alertify.error("Enter all Mandatory feilds!");
        setLoading(false);
        return 0;
      }
    } else if (fldType === "CFIN-NA") {
      if (
        !DIA_BODY ||
        !DIA_END ||
        !WALL_THK_BODY ||
        !PIPE_LNG ||
        !WLD_TEMP ||
        !MILL_RMK ||
        !WALL_THK_END ||
        !ID_FLASH ||
        !CURRENTT ||
        !FREQUENCY ||
        !INSP_NAME ||
        !STRGHTNES_F_END ||
        !VOLTAGE ||
        !WELD_POWER ||
        // !FLATNG_90_O ||
        !OUT_ROUND_BODY ||
        // !BATCH_NO ||
        // !MATE_NO ||
        !MILL_SPD ||
        !RESULT
      ) {
        alertify.error("Enter all Mandatory feilds!");
        setLoading(false);
        return 0;
      }
    } else if (fldType === "CNFIN-NA") {
      if (
        !DIA_BODY ||
        !DIA_END ||
        !WALL_THK_BODY ||
        !PIPE_LNG ||
        !WLD_TEMP ||
        !MILL_RMK ||
        !WALL_THK_END ||
        !ID_FLASH ||
        !CURRENTT ||
        !FREQUENCY ||
        !INSP_NAME ||
        !STRGHTNES_F_END ||
        !VOLTAGE ||
        !WELD_POWER ||
        // !FLATNG_90_O ||
        !OUT_ROUND_BODY ||
        // !BATCH_NO ||
        // !MATE_NO ||
        !MILL_SPD ||
        !RESULT
      ) {
        alertify.error("Enter all Mandatory feilds!");
        setLoading(false);
        return 0;
      }
    } else if (fldType === "C-A") {
      if (
        !DIA_BODY ||
        !DIA_END ||
        !WALL_THK_BODY ||
        !PIPE_LNG ||
        !WLD_TEMP ||
        !TEMP_QN ||
        !MILL_RMK ||
        // !RBT ||
        !WALL_THK_END ||
        !ID_FLASH ||
        !CURRENTT ||
        !FREQUENCY ||
        !INSP_NAME ||
        // !FLATNG_0_O ||
        !STRGHTNES_F_END ||
        !STRGHTNES_T_END ||
        !VOLTAGE ||
        !WELD_POWER ||
        // !FLATNG_90_O ||
        !OUT_ROUND_BODY ||
        !NORMZ_TEMP ||
        // !BATCH_NO ||
        // !MATE_NO ||
        !OUT_ROUND_END ||
        !MILL_SPD ||
        !RESULT
      ) {
        alertify.error("Enter all Mandatory feilds!");
        setLoading(false);
        return 0;
      }
    }
  };

  const fillData = async () => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      //To check mandatory feilds
      let flag = fldTypeDes();
      if (flag === 0) {
        return;
      }

      const orderwiseProdRows = orderwiseProd?.getData?.() || [];
      const sequenceValidation = validateOrderwiseSequence(orderwiseProdRows);
      if (!sequenceValidation.isValid) {
        alertify.error(sequenceValidation.message);
        return;
      }

      const sortedOrderwiseRows = getSortedOrderwiseRowsBySequence();
      const dummyData = [];
      var rmBatch;
      let sumTubes = 0;
      let seq = 0;
      for (const row of sortedOrderwiseRows) {
        sumTubes += Number(row.TUBE_COUNT);
      }
      console.log("sumTubes: ", sumTubes);

      for (const row of sortedOrderwiseRows) {
        rmBatch = row.EWI_ID_BATCH;
        if (row.TUBE_COUNT === "" || Number(row.TUBE_COUNT) === 0) {
          alertify.error("Please fill No. of Tubes");
          return;
        }

        const tubeCount = Number(row.TUBE_COUNT || 0);
        console.log("inside outer loop:", tubeCount);
        for (let i = 0; i < tubeCount; i++) {
          const url1 = "api/LD01S001/getPipeId";
          seq = Number(seq) + 1;
          console.log("inside inner loop:", seq);
          // Function to increment the date by one day
          function incrementDate(dateString) {
            const dateParts = dateString.split("-");
            const date = new Date(
              `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`
            ); // Convert to YYYY-MM-DD
            date.setDate(date.getDate() + 1); // Increment by one day
            return date
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep");
          }

          let prodDt;

          if (valueRadio === "1C") {
            prodDt = SHIFT_DATE; // Keep the original date
          } else if (valueRadio === "1P") {
            prodDt = incrementDate(SHIFT_DATE); // Increment the date
          }
          let data1 = {
            prodDt: prodDt,
            millNo: millNo === "MILL2" || millNo?.value === "MILL2" ? "2" : "1",
            seqNo: seq,
          };

          const resp = await axiosAPI.post(url1, data1, defaultOptions);

          if (
            resp.status !== 200 ||
            !resp.data ||
            !resp.data[0] ||
            !resp.data[0].PIPEID
          ) {
            alertify.error("Failed to retrieve PIPEID.");
            setLoading(false);
            return;
          }
          const new_pipeid = resp.data[0].PIPEID;
          const url2 = "api/LD01S001/getPipeWeight";
          const weightCallPara = {
            p_plant: "0780",
            p_batch_id: rmBatch,
            p_length: PIPE_LNG || "", // Always use current user input
            p_od: String(row.EWI_SEC2) || "",
            p_thickness: WALL_THK_END || "", // Always use current user input
            p_depth: DEPTH ?? "",
            p_width: WIDTHS ?? "",
            p_geo: geometry ?? "",
          };

          const resp2 = await axiosAPI.post(
            url2,
            weightCallPara,
            defaultOptions
          );
          if (
            resp2.status !== 200 ||
            !resp2.data ||
            !resp2.data[0] ||
            !resp2.data[0].WEIGHT
          ) {
            alertify.error("Failed to retrieve weight.");
            setLoading(false);
            return; // Stop execution if API call fails
          }

          const weight = Number(resp2?.data[0]?.WEIGHT);
          const data = {
            PIPEID: new_pipeid || "",
            CURR_PROC: "10",
            RM_BATCH: rmBatch,
            WEIGHT: weight,
            NEXT_PROC: row.NEXT_PROC, //"20",
            MILL_NO: millNo?.value || millNo || "",
            DIA_BODY: DIA_BODY || "",
            DIA_END: DIA_END || "",
            WALL_THK_BODY: WALL_THK_BODY || "",
            PIPE_LNG: PIPE_LNG || "",
            DEPTH: DEPTH || "",
            LOM_SAMPL_TAG: "",
            WLD_TEMP: WLD_TEMP || "",
            TEMP_QN: TEMP_QN || "",
            MILL_RMK: MILL_RMK || "",
            SHIFT_DATE: SHIFT_DATE || "",
            WALL_THK_END: WALL_THK_END || "",
            ID_FLASH: ID_FLASH || "",
            WIDTHS: WIDTHS || "",
            CURRENTT: CURRENTT || "",
            FREQUENCY: FREQUENCY || "",
            INSP_NAME: INSP_NAME || "",
            SHIFT: SHIFT || "",
            FLATNG_0_O: "", //FLATNG_0_O?.value || "",
            STRGHTNES_F_END: STRGHTNES_F_END || "",
            STRGHTNES_T_END: STRGHTNES_T_END || "",
            TWIST: TWIST || "",
            VOLTAGE: VOLTAGE || "",
            WELD_POWER: WELD_POWER || "",
            REMARK: REMARK || "",
            RESULT: RESULT.value || "",
            FLATNG_90_O: "", //FLATNG_90_O?.value || "",
            SQOC: SQOC || "",
            OUT_ROUND_BODY: OUT_ROUND_BODY || "",
            CONCV: CONCV || "",
            NORMZ_TEMP: NORMZ_TEMP || "",
            SAMPLE: SAMPLE || "",
            ROC: ROC || "",
            OUT_ROUND_END: OUT_ROUND_END || "",
            CONVX: CONVX || "",
            MILL_SPD: MILL_SPD || "",
            ORDER_ITEM_KEY: getOrderItemKey(row),
            ORDER_ITEM_LABEL: getOrderItemLabel(row),
            SOURCE_SEQ: Number(row.USER_SEQ),
            EWI_ID_ORDER_CUS: row.EWI_ID_ORDER_CUS || "",
            EWI_ID_ORD_ITEM_CUS: row.EWI_ID_ORD_ITEM_CUS || "",
            EWI_SEC1: row.EWI_SEC1 || "",
            EWI_SEC2: row.EWI_SEC2 || "",
            EWI_LENGTH: row.EWI_LENGTH || "",
            EWI_SFG_MATNR: row.EWI_SFG_MATNR || "",
          };
          dummyData.push(data);
        }
        console.log("at end of outer loop seq", seq);
      }
      setPipeCreationTableData(dummyData);

      const scrapData = {
        RM_BATCH: rmBatch,
        SHIFT_DATE: SHIFT_DATE,
      };

      const scrapResponse = await axiosAPI.post(
        "api/LD01S001/getScrapProductionTable",
        scrapData,
        defaultOptions
      );
      if (scrapResponse.status === 200) {
        console.log(scrapResponse.data);
        setScrapDt(scrapResponse.data);
      } else {
        alertify.error("Failed to retrieve scrap data.");
      }
    } catch (error) {
      console.log("error: ", error);
      alertify.error("Error filling data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const reCalculatePipeWt = async (
    odiaVal,
    thickVal,
    lengthVal,
    depthVal,
    widthVal,
    rmBatchVal
  ) => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log("pipeCreationTableData: ", pipeCreationTableData);
      console.log("pipeCreationTable: ", pipeCreationTable);
      // setPipeWtChngFlag(false);

      let rmBatch =
        rmBatchVal || orderwiseProd?.getData?.()?.[0]?.EWI_ID_BATCH || "";

      const url = "api/LD01S001/getPipeWeight";
      const weightCallPara = {
        p_plant: "0780",
        p_batch_id: rmBatch,
        p_length: lengthVal || "",
        p_od: odiaVal || "",
        p_thickness: thickVal || "",
        p_depth: depthVal ?? "",
        p_width: widthVal ?? "",
        p_geo: geometry ?? "",
      };

      const resp = await axiosAPI.post(url, weightCallPara, defaultOptions);

      if (
        resp.status !== 200 ||
        !resp.data ||
        !resp.data[0] ||
        !resp.data[0].WEIGHT
      ) {
        alertify.error("Failed to retrieve weight.");
        setLoading(false);
        return;
      }
      const weight = resp.data[0].WEIGHT;
      return weight;
    } catch (error) {
      console.log("error: ", error);
      alertify.error("Error filling data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const validateData = async () => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let odiaVal = orderwiseProd?.getData?.()?.[0]?.EWI_SEC2;
      let thickVal = WALL_THK_END;
      let lengthVal = PIPE_LNG;
      let depthVal = DEPTH;
      let widthVal = WIDTHS;

      let weight = await reCalculatePipeWt(
        odiaVal,
        thickVal,
        lengthVal,
        depthVal,
        widthVal
      );

      const url = "api/LD01S001/validateData";
      const data = {
        p_batchid: orderwiseProd?.getData()[0].EWI_ID_BATCH ?? "",
        p_ord: orderwiseProd?.getData()[0].EWI_ID_ORDER_CUS ?? "",
        p_item: orderwiseProd?.getData()[0].EWI_ID_ORD_ITEM_CUS ?? "",
        p_TBP_WEIGHT: weight ?? "",
        p_TBP_PAR_COIL_NO: orderwiseProd?.getData?.()?.[0]?.EWI_ID_BATCH ?? "",
        p_TBP_ID_FIRST_PAR: orderwiseProd?.getData?.()?.[0]?.EWI_ID_BATCH ?? "",
        p_TBP_HEAT_NO: "",
        p_TBP_PIPE_OD_10: odiaVal ?? "",
        p_TBP_PIPE_THK_10: thickVal ?? "",
        p_TBP_PIPE_LNG_10: lengthVal ?? "",
        p_TBP_FLATNG_0_O_10: "",
        p_TBP_FLATNG_90_O_10: "",
        p_TBP_RBT_10: "",
        p_TBP_DIA_END_10: DIA_END ?? "",
        p_TBP_DIA_BODY_10: DIA_BODY ?? "",
        p_TBP_OUT_ROUND_BODY_10: OUT_ROUND_BODY ?? "",
        p_TBP_OUT_ROUND_END_10: OUT_ROUND_END ?? "",
        p_TBP_WALL_THK_BODY_10: WALL_THK_BODY ?? "",
        p_TBP_WALL_THK_END_10: WALL_THK_END ?? "",
        p_TBP_STRGHTNES_F_END_10: STRGHTNES_F_END ?? "",
        p_TBP_STRGHTNES_T_END_10: STRGHTNES_T_END ?? "",
        p_TBP_SQOC_10: SQOC ?? "",
        p_TBP_ROC_10: ROC ?? "",
        p_TBP_ID_FLASH_10: ID_FLASH ?? "",
        p_TBP_CONVX_10: CONVX ?? "",
        p_TBP_CONCV_10: CONCV ?? "",
        p_TBP_TWIST_10: TWIST ?? "",
        p_TBP_DEPTH_10: depthVal ?? "",
        p_TBP_WIDTHS_10: widthVal ?? "",
        p_TBP_SAMPLE_10: SAMPLE ?? "",
        p_TBP_WLD_TEMP_10: WLD_TEMP ?? "",
        p_TBP_MILL_SPD_10: MILL_SPD ?? "",
        p_TBP_CURRENTT_10: CURRENTT ?? "",
        p_TBP_TEMP_QN_10: TEMP_QN ?? "",
        p_TBP_VOLTAGE_10: VOLTAGE ?? "",
        p_TBP_FREQUENCY_10: FREQUENCY ?? "",
        p_TBP_NORMZ_TEMP_10: NORMZ_TEMP ?? "",
        p_TBP_WELD_POWER_10: WELD_POWER ?? "",
        p_TBP_MILL_RMK_10: MILL_RMK ?? "",
      };

      const resp = await axiosAPI.post(url, data, defaultOptions);

      if (resp?.data?.substr(0, 1) === "Y") {
        alertify.success(resp?.data);
        return;
      } else {
        alertify.error(resp?.data);
        return;
      }
    } catch (error) {
      console.log("error: ", error);
      alertify.error("Error filling data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const pipeWtValue = useMemo(() => {
    return pipeCreationTable?.getCalcResults?.()?.bottom?.WEIGHT;
  }, [pipeCreationTable]);

  //Added for calculation remaining scrap wt
  useEffect(() => {
    console.log("Inside rem sc calc");
    let weight = pipeCreationTableData[0]?.WEIGHT;
    let noPipe = 0;
    let netWt = 0;
    if (orderwiseProdData?.length > 0) {
      for (let i = 0; i < orderwiseProdData?.length; i++) {
        noPipe += Number(orderwiseProdData[i]?.TUBE_COUNT);
        netWt += Number(
          orderwiseProdData[i]?.EWI_MS_PIECE_ACTL?.toFixed(3) * 1000
        );
      }
    }

    let pipeWtSum = Number(
      pipeCreationTable?.getCalcResults?.()?.bottom?.WEIGHT
    );
    console.log("pipeWtSum: ", pipeWtSum);

    console.log(
      "=>",
      JSON.stringify(pipeCreationTable?.getCalcResults?.()?.bottom?.WEIGHT)
      // pipeCreationTable?.getCalcResults?.()?.bottom?.WEIGHT
      // JSON.stringify(pipeCreationTable?.getCalcResults?.()?.bottom)
    );
    console.log("pipeWtSum: ", pipeWtSum);
    // console.log("noPipe: ", noPipe);
    // console.log("netWt: ", netWt);
    // let totalPrimewt = weight * noPipe;
    // console.log("totalPrimewt: ", totalPrimewt);
    // let remWt = netWt - totalPrimewt;
    let remWt = Number(netWt) - Number(pipeWtSum);
    console.log("remWt: ", remWt);
    setRemScrapWt(() => remWt);
  }, [
    // pipeCreationTableData?.length,
    fillData,
    reCalculatePipeWt,
    pipeWtValue,
    orderwiseProdData,
    // pipeCreationTableData,
    // pipeCreationTable?.getCalcResults?.()?.bottom?.WEIGHT,
  ]);

  const confirm = async (newToken = false) => {
    if (pipeCreationTableData.length !== 0) {
      // if (newToken) {
      //   const rsp = await getAuthorization();
      // }
      const token = await GetAuthorization();
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken, //localStorage.getItem("tmm_accessToken"),
        },
      };

      var url;
      var pipecreationdata = pipeCreationTable.getData();

      const totals = pipeCreationTable.getCalcResults();
      let totalPrimewt = Number(totals?.bottom?.WEIGHT);

      var selectedScrapRows = scrapTable.getSelectedRows();
      let totalScrapWt = 0;
      // Calculate the sum of scrap rows
      for (let row of selectedScrapRows) {
        totalScrapWt += Number(row?._row?.data?.NET_WT);
      }
      var schedrows = orderwiseProd.getData();
      const pipeCountValidation = validatePipeCountAgainstOrderItems(
        pipecreationdata,
        schedrows
      );
      if (!pipeCountValidation.isValid) {
        alertify.error(pipeCountValidation.message);
        return;
      }
      if (selectedScrapRows.length == 0) {
        alertify.error("Please select Scrap rows");
        return;
      }
      var newDataSched = [];
      // Extract data from selected rows
      schedrows.forEach(function (item) {
        console.log("item: ", item);
        newDataSched.push(item);
      });
      var newDataScrap = [];
      selectedScrapRows.forEach(function (item) {
        newDataScrap.push(item._row.data);
      });
      var newDataPrime = [];
      pipecreationdata.forEach(function (item) {
        newDataPrime.push(item);
      });
      // Compare totalPrimeWt with newDataSched.LOM_MS_PIECE_ACTL
      // Round the second value to three decimal places
      let roundedValue = parseFloat(
        newDataSched[0].LOM_MS_PIECE_ACTL.toFixed(3) * 1000
      );
      const tolerance = 0.00001; //Slightly smaller than the rounding precision

      if (
        newDataSched.length > 0 &&
        Math.abs(roundedValue - (totalPrimewt + totalScrapWt)) > tolerance
      ) {
        alertify.error(
          "Total (Prime+Scrap) weight not equal to available Rm Mass.Short By " +
            String(roundedValue - (totalPrimewt + totalScrapWt))
        );
        return;
      }
      var prodStartDateVal = document.getElementById("prodStartDate").value;
      var prodEndDateVal = document.getElementById("prodEndDate").value;
      var data = {
        newDataPrime: newDataPrime,
        newDataSched: newDataSched,
        newDataScrap: newDataScrap,
        prdPStartDt: prodStartDateVal,
        prdPEndDt: prodEndDateVal,
        matNo: "",//orderwiseProdData[0]?.EWI_SFG_MATNR ?? "",
      };
      setLoading(true);
      url = "api/LD01S001/insertCoilDetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            const errorString = response.data?.errorString;
            if (errorString && errorString.startsWith("N")) {
              alertify.error(errorString);
              return;
            } else {
              alertify.success(errorString);
              setPipeCreationTableData([]);
              setOrderwiseProdData([]);
              setScrapDt([]);
              handleClearData();
              getScheduleId();
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      alertify.error("No data available schedule details !");
    }
  };

  useEffect(() => {
    // This effect will run whenever millNo changes
    // and will trigger a re-render to update the UI.
    console.log("millNo changed:", millNo);
  }, [millNo]);

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

  const handleResultChange = (value) => {
    setRESULT(value);
    setPipeCreationTableData([,]);
  };
  const handleFlat0 = (value) => {
    setFLATNG_0_O(value);
    setPipeCreationTableData([,]);
  };
  const handleFlat90 = (value) => {
    setFLATNG_90_O(value);
    setPipeCreationTableData([,]);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];
  function incrementPipeId(currentPipeId) {
    // Basic validation for PIPEID format
    if (typeof currentPipeId !== "string" || currentPipeId.length !== 9) {
      console.warn(
        "Invalid PIPEID format detected for increment:",
        currentPipeId
      );
      // Return the original ID or handle error as per application needs
      return currentPipeId;
    }

    const prefix = currentPipeId.substring(0, 2); // "TP"
    const numericPartStr = currentPipeId.substring(2); // e.g., "1000001"

    let numericValue = parseInt(numericPartStr, 10);

    // Check if parsing was successful and the numeric part is valid
    if (isNaN(numericValue)) {
      console.warn("Failed to parse numeric part of PIPEID:", numericPartStr);
      return currentPipeId;
    }

    numericValue++; // Increment the integer value

    let newNumericPartStr = numericValue.toString();

    // Pad with leading zeros to ensure it's always 7 characters long
    // Example: 9 becomes "0000009", 10 becomes "0000010"
    while (newNumericPartStr.length < 7) {
      newNumericPartStr = "0" + newNumericPartStr;
    }
    console.log(prefix + newNumericPartStr);
    return prefix + newNumericPartStr;
  }
  function handleIncrementButtonClick(cell) {
    const clickedRow = cell.getRow();
    const table = clickedRow.getTable(); // Get the Tabulator table instance
    const allRows = table.getRows(); // Get all row components in the table

    let foundClickedRow = false;
    let currentPipeIdForNextRow = null; // This will hold the PIPEID to be used for the current row's update

    // Iterate through all rows starting from the beginning of the table
    for (let i = 0; i < allRows.length; i++) {
      const currentRow = allRows[i];

      // Find the clicked row to establish the starting point for incrementing
      if (currentRow === clickedRow) {
        foundClickedRow = true;
        // Get the PIPEID of the clicked row to start the increment sequence
        currentPipeIdForNextRow = currentRow.getData().PIPEID;
      }

      // Once the clicked row is found, process it and all subsequent rows
      if (foundClickedRow) {
        // Ensure we have a valid PIPEID to increment from
        if (currentPipeIdForNextRow) {
          // Generate the new PIPEID for the current row
          const newPipeId = incrementPipeId(currentPipeIdForNextRow);

          // Update the PIPEID field of the current row in the Tabulator table
          // This will visually update the table
          currentRow.update({ PIPEID: newPipeId });

          // Set the newly generated PIPEID as the base for the next row's increment
          currentPipeIdForNextRow = newPipeId;
        } else {
          console.error(
            "Critical error: Initial PIPEID for increment sequence was null or invalid after finding clicked row."
          );
          break; // Stop processing if initial PIPEID is invalid unexpectedly
        }
      }
    }
  }
  const pipeCreationColumn = [
    // {
    //   formatter: "rowSelection",
    //   titleFormatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    // },
    {
      title: "++",
      width: 50, // Adjust width to comfortably fit the button
      hozAlign: "center", // Center the button horizontally
      frozen: true,
      formatter: function (cell, formatterParams, onRendered) {
        // This formatter returns the HTML for a button.
        // A class `pipe-increment-button` is added for easier event delegation.
        return "<button class='pipe-increment-button'>+</button>";
      },
      cellClick: function (e, cell) {
        // This event listener is attached to the cell.
        // We check if the actual clicked element *within* the cell is our button.
        if (e.target.classList.contains("pipe-increment-button")) {
          // ADDED: Confirmation dialog
          if (window.confirm("Do you want to increment?")) {
            handleIncrementButtonClick(cell);
          }
        }
      },
    },
    {
      title: "Pipe Id",
      field: "PIPEID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      frozen: true,
    },
    {
      title: "Result",
      field: "RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      frozen: true,
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
      title: "Remark",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Hold Reason",
      field: "HOLD_REASON",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      width: 180,
      editor: "select", // Use "select" if you want to allow selecting from a dropdown menu
      editorParams: {
        values: holdReasonOptions,
      },
      validator: function (value, cell) {
        // Optionally validate value
        return value ? true : false; // Ensure some value is selected
      },
      editable: function (cell) {
        // Check if 'Result' field is 'HOLD'
        const resultValue = cell.getRow().getData().RESULT; // Get the current row
        return resultValue === "HOLD"; // Return true if it is editable
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
      cellEdited: function (cell) {
        var row = cell.getRow();
        var selectedValue = cell.getValue();
        const selectedOption = holdReasonOptions.find(
          (option) => option.value === selectedValue
        );
        let remarkValue = "";

        if (selectedOption && selectedOption.label) {
          // Extract the part after " - "
          const parts = selectedOption.label.split(" - ");
          if (parts.length > 1) {
            remarkValue = parts[1];
          } else {
            remarkValue = selectedOption.label; // Set full label if no " - "
          }
        }

        // Update Remarks and Mill Remarks value
        row.update({
          REMARK: remarkValue,
          MILL_RMK: remarkValue,
        });
      },
    },

    {
      title: "Mill Remarks",
      field: "MILL_RMK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Weight(Kg)",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      bottomCalc: "sum",
      // bottomCalcParams: { precision: 3 },
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "Sample TAG",
      field: "LOM_SAMPL_TAG",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "select",
      editable: true,
      editorParams: {
        values: {
          "": "--Select--",
          Y: "Y",
          A: "A",
        },
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: function (cell) {
        var value = cell.getValue();
        return value;
      },
    },

    {
      title: "Thick",
      field: "EWI_SEC1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          value = parseFloat(value).toFixed(2);
        }
        return value;
      },
    },
    {
      title: "Odia",
      field: "EWI_SEC2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          value = parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Pipe Len(mm)",
      field: "PIPE_LNG",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: async function (cell) {
        var value = cell.getValue();
        // setPipeWtChngFlag(true);
        let odiaVal = cell?.getData()?.EWI_SEC2;
        let thickVal = cell?.getData()?.WALL_THK_END;
        let lengthVal = cell?.getData()?.PIPE_LNG;
        let depthVal = cell?.getData()?.DEPTH;
        let widthVal = cell?.getData()?.WIDTHS;
        let pipeWt = await reCalculatePipeWt(
          odiaVal,
          thickVal,
          lengthVal,
          depthVal,
          widthVal
        );
        // console.log("pipeWt: ", pipeWt);
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWt,
        });
        return value;
      },
    },
    {
      title: "Wall Thk End",
      field: "WALL_THK_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: async function (cell) {
        var value = cell.getValue();
        // setPipeWtChngFlag(true);
        let odiaVal = cell?.getData()?.EWI_SEC2;
        let thickVal = cell?.getData()?.WALL_THK_END;
        let lengthVal = cell?.getData()?.PIPE_LNG;
        let depthVal = cell?.getData()?.DEPTH;
        let widthVal = cell?.getData()?.WIDTHS;
        let pipeWt = await reCalculatePipeWt(
          odiaVal,
          thickVal,
          lengthVal,
          depthVal,
          widthVal
        );
        // console.log("pipeWt: ", pipeWt);
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWt,
        });
        return value;
      },
    },

    {
      title: "Depth(mm)",
      field: "DEPTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: async function (cell) {
        var value = cell.getValue();
        // setPipeWtChngFlag(true);
        let odiaVal = cell?.getData()?.EWI_SEC2;
        let thickVal = cell?.getData()?.WALL_THK_END;
        let lengthVal = cell?.getData()?.PIPE_LNG;
        let depthVal = cell?.getData()?.DEPTH;
        let widthVal = cell?.getData()?.WIDTHS;
        let pipeWt = await reCalculatePipeWt(
          odiaVal,
          thickVal,
          lengthVal,
          depthVal,
          widthVal
        );
        // console.log("pipeWt: ", pipeWt);
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWt,
        });
        return value;
      },
    },
    {
      title: "Width",
      field: "WIDTHS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: async function (cell) {
        var value = cell.getValue();
        // setPipeWtChngFlag(true);
        let odiaVal = cell?.getData()?.EWI_SEC2;
        let thickVal = cell?.getData()?.WALL_THK_END;
        let lengthVal = cell?.getData()?.PIPE_LNG;
        let depthVal = cell?.getData()?.DEPTH;
        let widthVal = cell?.getData()?.WIDTHS;
        let pipeWt = await reCalculatePipeWt(
          odiaVal,
          thickVal,
          lengthVal,
          depthVal,
          widthVal
        );
        // console.log("pipeWt: ", pipeWt);
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWt,
        });
        return value;
      },
    },
    {
      title: "Wall Thk Body",
      field: "WALL_THK_BODY",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    // {
    //   title: "Length",
    //   field: "EWI_LENGTH",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: false,
    // },

    {
      title: "Diameter Body",
      field: "DIA_BODY",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Diameter End",
      field: "DIA_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Welding Temp",
      field: "WLD_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Temp Quench",
      field: "TEMP_QN",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Shfit Date",
      field: "SHIFT_DATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    // {
    //   title: "RBT",
    //   field: "RBT",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    //   visible: false,
    // },
    {
      title: "Id Flash",
      field: "ID_FLASH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Current",
      field: "CURRENTT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Frequency",
      field: "FREQUENCY",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Inspector",
      field: "INSP_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Shift",
      field: "SHIFT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    // {
    //   title: "Flattening 0Â°",
    //   field: "FLATNG_0_O",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    // },
    {
      title: "Straight Full",
      field: "STRGHTNES_F_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Straight End",
      field: "STRGHTNES_T_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Twist",
      field: "TWIST",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Voltage",
      field: "VOLTAGE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Welding Power",
      field: "WELD_POWER",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    // {
    //   title: "Flattening 90Â°",
    //   field: "FLATNG_90_O",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    // },
    {
      title: "SOC",
      field: "SQOC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "OOR Body",
      field: "OUT_ROUND_BODY",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Concavity",
      field: "CONCV",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Normalize Temp",
      field: "NORMZ_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Sample",
      field: "SAMPLE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    // {
    //   title: "Iss.Batch",
    //   field: "BATCH_NO",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    // },
    // {
    //   title: "Material",
    //   field: "MATE_NO",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    // },
    {
      title: "ROC",
      field: "ROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "OOR End",
      field: "OUT_ROUND_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Convexity",
      field: "CONVX",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "MillSpeed",
      field: "MILL_SPD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "RM Coil",
      field: "RM_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "Order-Item",
      field: "ORDER_ITEM_KEY",
      width: 240,
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "select",
      editorParams: function () {
        return {
          values: getOrderItemEditorValues(),
        };
      },
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        const value = cell.getValue();
        const sourceRow = getOrderItemRowByKey(value);
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return sourceRow ? getOrderItemLabel(sourceRow) : rowData.ORDER_ITEM_LABEL || value;
      },
      cellEdited: async function (cell) {
        const selectedKey = cell.getValue();
        const selectedOrderItem = getOrderItemRowByKey(selectedKey);
        if (!selectedOrderItem) {
          alertify.error("Invalid Order-Item selected");
          return;
        }

        const row = cell.getRow();
        const rowData = row.getData();
        const pipeWt = await reCalculatePipeWt(
          selectedOrderItem.EWI_SEC2,
          rowData.WALL_THK_END,
          rowData.PIPE_LNG,
          rowData.DEPTH,
          rowData.WIDTHS,
          rowData.RM_BATCH
        );

        row.update({
          ORDER_ITEM_KEY: getOrderItemKey(selectedOrderItem),
          ORDER_ITEM_LABEL: getOrderItemLabel(selectedOrderItem),
          SOURCE_SEQ: Number(selectedOrderItem.USER_SEQ),
          EWI_ID_ORDER_CUS: selectedOrderItem.EWI_ID_ORDER_CUS || "",
          EWI_ID_ORD_ITEM_CUS: selectedOrderItem.EWI_ID_ORD_ITEM_CUS || "",
          EWI_SEC1: selectedOrderItem.EWI_SEC1 || "",
          EWI_SEC2: selectedOrderItem.EWI_SEC2 || "",
          EWI_LENGTH: selectedOrderItem.EWI_LENGTH || "",
          EWI_SFG_MATNR: selectedOrderItem.EWI_SFG_MATNR || "",
          NEXT_PROC: selectedOrderItem.NEXT_PROC || rowData.NEXT_PROC || "",
          WEIGHT: pipeWt,
        });
        row.reformat();
      },
    },
    {
      title: "Order",
      field: "EWI_ID_ORDER_CUS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "Item",
      field: "EWI_ID_ORD_ITEM_CUS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      hozAlign: "right",
    },
    {
      title: "Mill No",
      field: "MILL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      // isDisabled: true,
      hozAlign: "right",
    },
    {
      title: "Curr Proc",
      field: "CURR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      hozAlign: "right",
    },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      hozAlign: "right",
    },
    {
      title: "SFG MAT",
      field: "EWI_SFG_MATNR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      hozAlign: "right",
    },
  ];

  const downloadExcelHydraTableData = () => {
    console.log("Downloading");
    if (pipeCreationTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = pipeCreationTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDS030" + ".xlsx";

    window.XLSX = XLSX;

    pipeCreationTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const preventInput = (e) => {
    e.preventDefault();
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Visual Inpsection (10)"
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
                          Visual Inspection -10
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
                      <Grid item xs={12} md={7}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Schd Id | Schd Crt Dt | No of coil in Schd |
                              MILLNO *
                            </MDTypography>
                            <ReactSelect
                              id="rmList"
                              options={schedules}
                              onChange={handleScheduleChange}
                              variant="h6"
                              value={selectedSchedule}
                            />
                          </Grid>

                          <Grid item xs={3}>
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

                          <Grid item xs={3}>
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
                                var month = ("0" + (d.getMonth() + 1)).slice(
                                  -2
                                ); // Months are 0-based
                                var day = ("0" + d.getDate()).slice(-2);
                                var hours = ("0" + d.getHours()).slice(-2);
                                var minutes = ("0" + d.getMinutes()).slice(-2);
                                //var seconds = ('0' + d.getSeconds()).slice(-2);

                                // Format to Oracle date string
                                var oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;

                                console.log(oracleDate);
                                getTataDate(oracleDate);
                                clearFilterOnDate();
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Grid item xs={3}>
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
                          <Grid item xs={1.5} style={{ zIndex: 3 }}>
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
                            {/* <ReactSelect
                          id="Shift*"
                          options={statusList}
                          iseditable="false"
                          isDisabled={tabValue == 1}
                          onChange={handleStusChange}
                          value={selectedStatus}
                        /> */}
                            <MDInput
                              name="Shift"
                              iseditable="false"
                              value={SHIFT}
                            />
                          </Grid>
                          <Grid item xs={1.5}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getorderwiseProdData(true)}
                            >
                              {" "}
                              Submit{" "}
                            </MDButton>
                          </Grid>
                          <Grid item xs={6}>
                            <FormControl style={{ marginLeft: "2rem" }}>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Pipe Month
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueRadio}
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="1C"
                                  control={<Radio />}
                                  label="Normal"
                                  disabled={!isFirstDayOfMonth} // Disable based on condition
                                />
                                <FormControlLabel
                                  value="1P"
                                  control={<Radio />}
                                  label="Next Month"
                                  disabled={!isFirstDayOfMonth} // Disable based on condition
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </Grid>
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
                          Visual Inspection DATA
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
                          Entry of Visual Inpsection
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Box
                        sx={{
                          backgroundColor: "#dac292",
                          padding: "0.25rem 0.5rem", // Reduced padding
                          borderRadius: "4px",
                          textAlign: "center",
                          fontSize: "0.8rem", // Optional: reduce font size
                        }}
                      >
                        TEXT FIELD
                      </Box>
                      <Grid item xs={1}>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearData(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                      {/* <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Next Process
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Next Process"
                          value={NEXT_PROC}
                          disabled={true}
                          onKeyDown={preventInput}
                          onChange={(e) => setNEXT_PROC(e.target.value)}
                        />
                      </Grid> */}
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Mill No
                        </MDTypography>

                        <MDInput
                          id="MillNo"
                          value={millNo}
                          onChange={handleMillNoChange}
                          onKeyDown={preventInput}
                          disabled={true}
                        />

                        {/* <ReactSelect
                          id="MillNo"
                          options={[
                            { label: "MILL1", value: "MILL1" },
                            { label: "MILL2", value: "MILL2" },
                          ]}
                          onChange={handleMillNoChange}
                          variant="h6"
                          value={millNo}
                          isDisabled={true}
                        /> */}
                      </Grid>
                      {/* <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Quality Operation*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Quality Operation"
                          value={CURR_PROC}
                          onChange={(e) => setCURR_PROC(e.target.value)}
                        />
                      </Grid> */}

                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Diameter Body
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Diameter Body"
                          value={DIA_BODY}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setDIA_BODY(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Diameter End
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Diameter End"
                          value={DIA_END}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setDIA_END(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Wall Thick Body
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Wall Thick Body"
                          value={WALL_THK_BODY}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setWALL_THK_BODY(e.target.value);
                            setPipeCreationTableData([,]);
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
                          Pipe Length (MM)
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Pipe Length"
                          value={PIPE_LNG}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setPIPE_LNG(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Depth (MM)
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Depth"
                          value={DEPTH}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setDEPTH(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Welding Temp
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Welding Temp"
                          value={WLD_TEMP}
                          style={{ backgroundColor: "#dac292" }}
                          // inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setWLD_TEMP(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Temp Quench
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Temp Quench"
                          value={TEMP_QN}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setTEMP_QN(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Mill Remarks
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Mill Remarks"
                          value={MILL_RMK}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setMILL_RMK(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          RBT
                        </MDTypography>
                        <MDInput
                          label=""
                          name="RBT"
                          value={RBT}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setRBT(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
                        />
                      </Grid> */}
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Wall Thick End
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Wall Thick End"
                          value={WALL_THK_END}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setWALL_THK_END(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Id Flash
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Id Flash"
                          value={ID_FLASH}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setID_FLASH(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Width (MM)
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Width"
                          value={WIDTHS}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setWIDTHS(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Current
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Current"
                          value={CURRENTT}
                          style={{ backgroundColor: "#dac292" }}
                          // inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setCURRENTT(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Frequency
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Frequency"
                          value={FREQUENCY}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setFREQUENCY(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Inspector
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Inspector"
                          value={INSP_NAME}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setINSP_NAME(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Straight Full
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Straight Full"
                          value={STRGHTNES_F_END}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setSTRGHTNES_F_END(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Straight End
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Straight End"
                          value={STRGHTNES_T_END}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setSTRGHTNES_T_END(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Twist
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Twist"
                          value={TWIST}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setTWIST(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Voltage
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Voltage"
                          value={VOLTAGE}
                          style={{ backgroundColor: "#dac292" }}
                          // inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setVOLTAGE(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Welding Power
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Welding Power"
                          value={WELD_POWER}
                          style={{ backgroundColor: "#dac292" }}
                          // inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setWELD_POWER(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={1}>
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
                              name="Remark"
                              value={REMARK}
                              onChange={(e) => setREMARK(e.target.value)}
                            />
                        </Grid> */}

                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          SOC
                        </MDTypography>
                        <MDInput
                          label=""
                          name="SOC"
                          value={SQOC}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setSQOC(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          OOR Body
                        </MDTypography>
                        <MDInput
                          label=""
                          name="OOR Body"
                          value={OUT_ROUND_BODY}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setOUT_ROUND_BODY(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Concavity
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Concavity"
                          value={CONCV}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setCONCV(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Normalize Temp
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Normalize Temp"
                          value={NORMZ_TEMP}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setNORMZ_TEMP(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Sample
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Sample"
                          value={SAMPLE}
                          style={{ backgroundColor: "#dac292" }}
                          onChange={(e) => {
                            setSAMPLE(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Iss.Batch*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Iss.Batch"
                          value={BATCH_NO}
                          inputProps={{ type: "number" }}
                          onChange={(e) => setBATCH_NO(e.target.value)}
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
                          Material*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Material"
                          value={MATE_NO}
                          inputProps={{ type: "number" }}
                          onChange={(e) => setMATE_NO(e.target.value)}
                        />
                      </Grid> */}
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          ROC
                        </MDTypography>
                        <MDInput
                          label=""
                          name="ROC"
                          value={ROC}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setROC(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          OOR End
                        </MDTypography>
                        <MDInput
                          label=""
                          name="OOR End"
                          value={OUT_ROUND_END}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setOUT_ROUND_END(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          Convexity
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Convexity"
                          value={CONVX}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setCONVX(e.target.value);
                            setPipeCreationTableData([,]);
                          }}
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
                          MillSpeed
                        </MDTypography>
                        <MDInput
                          label=""
                          name="MillSpeed"
                          value={MILL_SPD}
                          inputProps={{ type: "number" }}
                          onChange={(e) => {
                            setMILL_SPD(e.target.value);
                            setPipeCreationTableData([,]);
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
                          Flattening 0Â°
                        </MDTypography>
                        <ReactSelect
                          options={flatList}
                          onChange={handleFlat0}
                          value={FLATNG_0_O}
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
                          Flattening 90Â°
                        </MDTypography>
                        <ReactSelect
                          options={flatList}
                          onChange={handleFlat90}
                          value={FLATNG_90_O}
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
                          Result
                        </MDTypography>
                        <ReactSelect
                          options={ResultType}
                          onChange={handleResultChange}
                          value={RESULT}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => fillData()}
                        >
                          Fill Data
                        </MDButton>
                      </Grid>
                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => validateData()}
                        >
                          Validate
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
                          Visual Inspection DATA
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={2}>
                        {/* <Tooltip title="Weight Refresh">
                          <IconButton
                            color="white"
                            // disabled={!pipeWtChngFlag}
                            onClick={() => ReCalculatePipeWt()}
                          >
                            <RefreshIcon />
                          </IconButton>
                        </Tooltip> */}
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            // disabled={pipeWtChngFlag}
                            onClick={() => confirm()}
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
                        <div id="pipeCreationTable" />

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {pipeCreationTableData.length} of{" "}
                          {pipeCreationTableData.length} entries
                        </p>
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
                          Scrap Production
                        </MDTypography>
                      </Grid>
                      {Number.isFinite(remScrapWt) && remScrapWt !== 0 && (
                        <Grid item xs={2}>
                          <MDTypography color="white">
                            {"Remaining Scrap Wt: " + remScrapWt?.toFixed(3)}
                          </MDTypography>
                        </Grid>
                      )}
                      <Grid item xs={1}>
                        <Tooltip title="Download" arrow>
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelScrapTable()}
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
                        <div id="scarpTableDiv" />
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