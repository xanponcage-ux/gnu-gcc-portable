import React, { useEffect, useState, useRef, forwardRef, useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Divider from "@mui/material/Divider";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DeleteIcon from "@mui/icons-material/Delete";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import ComputeIcon from "@mui/icons-material/FactCheck";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import CloseIcon from "@mui/icons-material/Close";
// Data
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import MDAlert from "@mui/material/Alert";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import card from "assets/theme-dark/components/card";
import { GetAuthorization } from "utils";
// var scheduleDtRef;


function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function LD01S002() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [plant, setPlant] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [scheduleMill, setScheduleMill] = useState(["1"]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectedMill, setSelectedMill] = useState([]);
  const [rmDetailsData, setRmDetailsData] = React.useState([]);
  const [scheduleDetailsData, setScheduleDetailsData] = React.useState([]);
  const [computeDt, setComputeRet] = React.useState([]);
  const [tableDt, setClickTableDt] = useState(null);
  const [rmDetailsDataTable, setRmDetailsDataTable] = useState(null);
  const [scheduleDtDetails, setScheduleDataDetailsTable] = React.useState(null);
  const [counter, setCounter] = useState(0);
  const [empCounter, setEmpCounter] = useState(0);
  const [rmTable, setSelectRmTable] = React.useState([]);
  const [orderTable, setOrderTable] = React.useState(null);
  const [rmOrderData, setRmOrderData] = React.useState([]);
  const [orderTableNonBOM, setOrderTableNonBOM] = React.useState(null);
  const [rmOrderDataNonBOM, setRmOrderDataNonBOM] = React.useState([]);
  const [orderDetails, setOrderDetails] = React.useState([]);
  const [scheduleDtRef, setScheduleDtRef] = useState(null);
  const [allValues, setAllValues] = useState({
    batch: "",
    thikFrm: "",
    thikTo: "",
    widthFrm: "",
    widthTo: "",
  });
  const [CamputeStatus, setCamputeStatus] = useState(false);

  //const statusList = [{ label: "VF", value: "VF" }];
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedCoilWidth, setSelectedCoilWidth] = useState([0]);
  const date = new Date();
  const formattedDate = date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-")
    .replace("Sept", "Sep");
  const [scheduleConfFilter, setScheduleConfFilter] = useState({
    planDate: formattedDate,
  });

  const [selectScheduleDetData, setSelScheduleDetailsData] = useState([]);
  const [Merge, setMergetype] = useState(false);
  const [selectedMergeDt, setSelectMergeDt] = useState(null);
  const [batchDDL3, setBatchDDL3] = useState([]);
  const [statusListRej, setStatusListRej] = useState([
    { label: "-Select", value: "0" },
    { label: "CN Confirmed", value: "CN" },
    { label: "WC Waiting for Confirmation", value: "WC" },
  ]);
  const [statusList, setStatusList] = useState([]);
  const [selectedWorkCenter, setSelectedWorkCenter] = React.useState([]);
  const [wCenter, setwCenter] = React.useState([]);
  const [selectedStatusRej, setSelectedStatusRej] = React.useState([]);
  const [selectedBatchIdValue, setSelectedBatchIdValue] = React.useState([]);
  const [processDDL2, setProcessDDL2] = useState([]);
  const [orderIdIndex, setOrderIdClickIndex] = React.useState(null);

  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const handleStatusChange = (value) => {
    if (value) {
      setSelectedStatus(value);
      setRmDetailsData([]);
      setScheduleDetailsData([]);
    } else {
      setSelectedStatus([]);
    }
  };

  const netWt = [
    { label: "0", value: "0" },
    { label: "<=20", value: "20" },
    { label: ">20", value: "21" },
  ];

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const coilTypeList = [
    { label: "RM Coil", value: "RM_Coil" },
    { label: "Parted Coil", value: "Parted_Coil" },
    { label: "All", value: "All" },
  ];

  const [selectedCoilType, setSelectedCoilType] = useState(coilTypeList[0]);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [totalAimWt, setTotalAimWt] = useState(0);
  const [calPlantWt, setCalPlantWt] = useState(0);

  const [chemSelectionData, setChemSelectionData] = useState([]);
  const [chemData, setChemData] = useState([]);
  const [chemBlock, setChemBlock] = useState(false);

  const scheduleDetailsTableClm = [
  {
    title: "Batch ID",
    field: "txtSchBatch",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Order ID",
    field: "txtSchOrder",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Item No",
    field: "txtSchItem",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Prod cd",
    field: "txtSchProdCd",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Qlty cd",
    field: "txtSchQltycd",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
  },
  {
    title: "Rm Wt (MT)",
    field: "txtSchRmwt",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    formatter: function (cell) {
      var value = cell.getValue();
      if (value) {
        return parseFloat(value).toFixed(3);
      }
      return value;
    },
  },
  {
    title: "Odia (mm)",
    field: "txtSchOdia",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    editor: "input",
    formatter: function (cell) {
      var value = cell.getValue();
      if (value) {
        return parseFloat(value).toFixed(3);
      }
      return value;
    },
  },
  {
    title: "Length(m)",
    field: "txtSchLength",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    // editor: "input",
  },
  {
    title: "Idia(mm)",
    field: "txtSchIdia",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    editor: "input",
  },
  {
    title: "Bal To Plan",
    field: "txtSchBTS",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    editor: "input",
  },
  {
    title: "Thick",
    field: "txtSchThick",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    formatter: function (cell) {
      var value = cell.getValue();
      if (value) {
        return parseFloat(value).toFixed(3);
      }
      return value;
    },
  },
  {
    title: "Tdc",
    field: "txtSchTdc",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    formatter: function (cell) {
      var value = cell.getValue();
      return value;
    },
  },
  {
    title: "Mill No",
    field: "txtSchMill",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    editable: false,
    formatter: function () {
      return "MILL" + scheduleMill;
    },
  },
  {
  field: "txtSchPlantwt",
  title: "Plan Wt",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  headerSort: false,
  width: 100,
  editor: "number",
  formatter: function (cell) {
    var value = cell.getValue();

    cell.getElement().style["background-color"] = "#DA8EE7";
    cell.getElement().style["color"] = "#FFFFFF";

    if (value !== undefined && value !== null && value !== "") {
      return parseFloat(value).toFixed(3);
    }

    return value;
  },
  cellEdited: (cell) => {
    var row = cell.getRow();
    var rowData = cell._cell.row.data;
    var planWt = rowData.txtSchPlantwt;

    // Validate plan weight
    if (isNaN(planWt)) {
      alertify.error("Please enter a valid number for Plan Wt");
      row.update({
        txtSchPlantwt: 0,
      });
      return;
    }

    // Recalculate No. of Tubes using the formula
    var tonnage = parseFloat(planWt) || 0;
    var od = parseFloat(rowData.txtSchOdia) || 0;
    var rmThk = parseFloat(rowData.txtSchThick) || 0;
    var length = parseFloat(rowData.txtSchLength) || 1; // Avoid division by zero

    var noOfTubes = 0;

    if (od > 0 && rmThk > 0 && length > 0) {
      noOfTubes = tonnage / (((od - rmThk) * rmThk * 0.02466) / 1000) / length;
    }

    // Round to nearest integer and convert to string (varchar backend)
    var noOfTubesString = Math.round(noOfTubes).toString();

    // Update the row with new values
    row.update({
      txtSchPlantwt: parseFloat(planWt).toFixed(3),
      txtSchNoTubes: noOfTubesString,
    });
  },
  bottomCalc: "sum",
  bottomCalcParams: { precision: 3 },
},
  // NEW COLUMN START
  {
    field: "txtSchNoTubes",
    title: "No of Tubes",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    headerSort: false,
    width: 130,
    editor: "input",
    formatter: function (cell) {
      var value = cell.getValue();

      // Pink column
      cell.getElement().style["background-color"] = "#FFC0CB";
      cell.getElement().style["color"] = "#000000";

      return value;
    },
    cellEdited: (cell) => {
      var row = cell.getRow();
      var value = cell.getValue();

      // Backend expects varchar, so always keep it as string
      var stringValue =
        value === null || value === undefined ? "" : String(value).trim();

      // Allow blank or integer-only string
      if (stringValue !== "" && !/^\d+$/.test(stringValue)) {
        alertify.error("Please enter a valid integer value for No of Tubes");

        row.update({
          txtSchNoTubes: "",
        });

        return;
      }

      row.update({
        txtSchNoTubes: stringValue,
      });
    },
  },
  // NEW COLUMN END

  {
    field: "txtSchRemarks",
    title: "Remarks",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    headerSort: false,
    editor: "input",
    width: 200,
    formatter: function (cell) {
      var value = cell.getValue();

      cell.getElement().style["background-color"] = "#DA8EE7";
      cell.getElement().style["color"] = "#FFFFFF";

      return value;
    },
    cellEdited: (cell) => {
      var row = cell.getRow();
      var rl = cell._cell.row.data.txtSchPlantwt;

      row.update({
        txtSchPlantwt: rl,
      });
    },
  },
];

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
          //page load functions here
          getGroupPlantId();
          setSchedules([]);
          getScheduleId();
          setInitialLoad(true);
          setCamputeStatus(false);
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (rmDetailsDataTable && rmDetailsData?.length > 0) {
      rmDetailsDataTable?.on("rowSelected", function (selectedData) {
        setRmOrderData([]);
        setRmOrderDataNonBOM([]);
        setScheduleDetailsData([]);
      });
      rmDetailsDataTable?.on("rowDeselected", function (selectedData) {
        setRmOrderData([]);
        setRmOrderDataNonBOM([]);
        setScheduleDetailsData([]);
      });
    }
  }, [rmDetailsDataTable]);

  

  useEffect(() => {
    //if (rmDetailsData?.length > 0) {
      const table =new Tabulator("#rmDetailsTable", {
        data: rmDetailsData,
        columns: gvCoilsClm,
        height: 250,
        layout: "fitDataFill",
        //selectableRows: 1,
      })
      setRmDetailsDataTable(table);
    // } else {
    //   console.log("Hello1")
    //   setRmDetailsDataTable(null);
    // }
    // return () => {
    //   console.log("Hello2")
    //   rmDetailsDataTable?.destroy();
    // };
  }, [rmDetailsData]);

  useEffect(() => {
   // if (scheduleDetailsData?.length > 0) {
      const table =new Tabulator("#scheduleDetailsTable", {
        data: scheduleDetailsData,
        columns: scheduleDetailsTableClm,
        height: 200,
        layout: "fitDataFill",
      })
      setScheduleDtRef(table);
    // } else {
    //   setScheduleDtRef(null);
    // }
    // return () => {
    //   scheduleDtRef?.destroy();
    // };
  }, [scheduleDetailsData, scheduleMill]);

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
      //if (serverDetails.PersonalNo === ``)
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
      var pageName = "LD01S002";

      var authDetails = await getScreenAuth(plant, userId, pageName);

      if (authDetails) {
        // if (authDetails.payload.PS_AUTH_USER_SCR != "Y") {
        //   console.log("restricted true ")
        //setRestricted(true);
        // } else {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          console.log("restricted true 1059");
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
        // }
      } else {
        console.log("restricted true 1082 ");
        setRestricted(true);
        setAdmin(false);
      }
    } catch {
      console.log("restricted true 1087");
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

  const getGroupPlantId = async (newToken = false) => {
    

    
    let data = {
      adid: serverDetails.PersonalNo,
    };
    setLoading(true);
    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };
    var url = "api/LD01S002/getGroupPlant";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row[0];
            obj.value = row[1];
            items.push(obj);
          });
          setPlant(items);
          setSelectedPlant(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handlePlantChange = (value) => {
    setAllValues({});

    setRmDetailsData([]);
    setScheduleDetailsData([]);
    setClickTableDt(null);
    setSelectedCoilType(coilTypeList[0]);

    setSelectedPlant(value);
    // if (value) {
    //   getProcessData(value);
    //   getBatchIdList(value);
    //   getProcessList(value);
    // }
  };

  const handleschedulechange = (value) => {
    console.log(value);

    const [value1, value2, value3] = value.value.split("#");
    //value.value=value1;

    setSelectedSchedule(value);
    setScheduleMill(value2);
    console.log(value2);
    setSelectedSchedule(value);
    setAllValues({});
    setRmDetailsData([]);
    setScheduleDetailsData([]);
    setRmDetailsDataTable(null);
    setScheduleDtRef(null);
    setClickTableDt(null);
    setSelectedCoilType(coilTypeList[0]);

    // if (value) {
    //   getProcessData(value);
    //   getBatchIdList(value);
    //   getProcessList(value);
    // }
  };
  const handleMillChange = (value) => {
    setSelectedMill(value);
    setSelectedSchedule(null);
    //setAllValues({});

    setRmDetailsData([]);
    console.log("Hello");
    setRmDetailsDataTable(null);
    setScheduleDetailsData([]);
    setScheduleDtRef(null);
    setClickTableDt(null);
    setSelectedCoilType(coilTypeList[0]);

    // if (value) {
    //   getProcessData(value);
    //   getBatchIdList(value);
    //   getProcessList(value);
    // }
  };
  const handleCoilTypeChange = (e) => {
    setSelectedCoilType(e);
  };

  const handleTonChange = (value) => {
    setSelectedTon(value);
  };

  // const handleProcessChange = (value) => {
  //   setSelectedStatus([]);
  //   if (value) {
  //     setSelectedProcess(value);
  //     getStatusList(value);
  //     setRmDetailsData([]);
  //     setScheduleDetailsData([]);
  //   }
  // };

  const addEmptyRows = async () => {
    //setCounter(counter + 1);
    setCamputeStatus(false);
    var array = scheduleDetailsData;
    // var addAimWt = 0;
    // var planWt = 0;
    // planWt = Number(array[0].txtSchPlantwt);
    // addAimWt = Number(totalAimWt) + Number(array[0].txtSchAimWt);
    // if (addAimWt > planWt) {
    //   alertify.error("Aim wt can't be greater than Plan wt !!!");
    //   setLoading(false);
    //   return;
    // }
    setEmpCounter(empCounter + 1);
    array[empCounter] = {
      id: empCounter,
      ddlSchStCD: "A01",
      ddlSchProcLn: selectedProcess.label,
      txtSchBatch: array[0].txtSchBatch,
      ddlProcRt: array[0].ddlProcRt,
      txtSchOrd: array[0].txtSchOrd,
      txtSchItem: array[0].txtSchItem,
      txtSchScoOrd: array[0].txtSchScoOrd,
      txtSchScoItem: array[0].txtSchScoItem,
      txtSchProdCd: array[0].txtSchProdCd,
      txtSchQltycd: array[0].txtSchQltycd,
      txtSchIdia: array[0].txtSchIdia,
      txtSchMinwt: array[0].txtSchMinwt,
      txtSchMaxwt: array[0].txtSchMaxwt,
      txtSchThick: array[0].txtSchThick,
      //txtSchWidth: array[0].txtSchWidth,
      txtSchWidth: 0,
      txtSchLength: array[0].txtSchLength,
      ddlSchOfcut: "N",
      txtSchTdc: array[0].txtSchTdc,
      txtSchPlantwt: "",
      txtSchPktwt: array[0].txtSchPktwt,
      txtSchNoslt: array[0].txtSchNoslt ? array[0].txtSchNoslt : 1,
      txtSchNoPcs: array[0].txtSchNoPcs,
      txtSchNoStk: array[0].txtSchNoStk,
      txtSchNoPkt: array[0].txtSchNoPkt,
      //txtSchAimWt: array[0].txtSchAimWt,
      txtSchPkgTyp: array[0].txtSchPkgTyp,
      txtSchPkgDesc: array[0].txtSchPkgDesc,
      txtSchRwrkInd: array[0].txtSchRwrkInd,
      txtSchNoPart: array[0].txtSchNoPart,
      txtSchPlanRsn: array[0].txtSchPlanRsn,
      txtSchPlanRsnCode: array[0].txtSchPlanRsnCode,
      txtSchPlanRsnDesc: array[0].txtSchPlanRsnDesc,
      txtSchRemark: array[0].txtSchRemark,
      txtSchPlanfgGrd: array[0].txtSchPlanfgGrd,
      txtOrdMinWidth: array[0].txtOrdMinWidth,
      txtOrdMaxWidth: array[0].txtOrdMaxWidth,
      delete: "",
    };
    //setTotalAimWt(addAimWt);
    // setCalPlantWt(planWt);
    // scheduleDtDetails.replaceData(array);
    setScheduleDetailsData(array);
    setCamputeStatus(false);
  };

  const deleteCell = async (cell) => {
    let filteredCoils = scheduleDetailsData.filter(
      (item) => item.id !== cell._cell.row.data.id
    );
    // scheduleDtDetails.replaceData(filteredCoils);
    // setScheduleDetailsData(filteredCoils);
    setScheduleDetailsData(filteredCoils);
    setCamputeStatus(false);
  };

  const copyTable = async (cell) => {
    setCounter(counter + 1);
    var array = scheduleDetailsData;
    var txtAimWt =
      (parseFloat(cell._cell.row.data.LOM_SEC2) /
        parseFloat(cell._cell.row.data.LOM_SEC2)) *
      parseFloat(cell._cell.row.data.GROSS_CAL);
    array[counter] = {
      id: counter,
      ddlSchStCD: "A01",
      ddlSchProcLn: selectedProcess.label,
      txtSchBatch: cell._cell.row.data.LOM_ID_BATCH,
      ddlProcRt: "",
      txtSchOrd: "",
      txtSchItem: "",
      txtSchScoOrd: "",
      txtSchScoItem: "",
      txtSchProdCd: cell._cell.row.data.LOM_CD_PROD,
      txtSchQltycd: cell._cell.row.data.LOM_CD_QLTY_ACTL,
      txtSchIdia: cell._cell.row.data.LOM_IDIA,
      txtSchMinwt: "",
      txtSchMaxwt: "",
      txtSchThick: cell._cell.row.data.LOM_SEC1,
      txtSchWidth: cell._cell.row.data.LOM_SEC2,
      txtSchLength: cell._cell.row.data.LOM_LENGTH,
      ddlSchOfcut: "N",
      txtSchTdc: cell._cell.row.data.LOM_TDC_ACTL,
      txtSchPlantwt: cell._cell.row.data.GROSS_CAL,
      txtSchPktwt: "",
      txtSchNoslt: "",
      txtSchNoPcs: "",
      txtSchNoStk: "",
      txtSchNoPkt: "",
      txtSchAimWt: txtAimWt.toFixed(3) /******** */,
      txtSchPkgTyp: "",
      txtSchPkgDesc: "",
      txtSchRwrkInd: "",
      txtSchNoPart: 1,
      txtSchPlanRsn: "",
      txtSchPlanRsnCode: "",
      txtSchPlanRsnDesc: "",
      txtSchRemark: "",
      txtSchPlanfgGrd: "",
      delete: "",
    };

    // scheduleDtDetails.replaceData(array);
    setScheduleDetailsData(array);
    setClickTableDt(cell._cell.row.data);
  };

  const getCoils = async (newToken = false) => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
     setLoading(true);
    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };
    if (!selectedSchedule || selectedSchedule?.value === "") {
      alertify.error("schedule ID needs to be selected");
      return;
    }
    setScheduleDetailsData([]);
    setRmOrderData([]);
    setRmOrderDataNonBOM([]);
    setClickTableDt(null);
    setLoading(true);
    setComputeRet([]);
    setCamputeStatus(false);
    var url;

    var data = {
      Plant: selectedPlant.value,
      BatchId: allValues.batch ? allValues.batch : "",
      ThickFR: allValues ? allValues.thikFrm : "",
      ThickTo: allValues.thikTo ? allValues.thikTo : "",
      WidthFr: allValues.widthFrm ? allValues.widthFrm : "",
      WidthTo: allValues.widthTo ? allValues.widthTo : "",
    };

    url = "api/LD01S002/getCoils";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          if (response.data[1].length == 0) {
            alertify.error("No Data Found");
          } else {
            setRmDetailsData(response.data[1]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const generateScheduleId = async (newToken = false) => {
    
    console.log(selectedMill?.value);
    if (!selectedMill || selectedMill?.value === "") {
      alertify.error("Mill No is needed to generate Schedule");
      return;
    }

    if (!(window.confirm("Do you want to generate MILL"+selectedMill?.value+" schedule?"))) {
      alertify.error("Schedule not generated");
      return;
  }
  setLoading(true);
  const token = await GetAuthorization();
  const defaultOptions = {
    headers: {
      Authorization: "Bearer " + token.accessToken,
    },
  };
    let data = {
      plant: selectedPlant?.value,
      mill: selectedMill?.value,
    };
    var url = "api/LD01S002/generateScheduleId";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        console.log(
          response?.error,
          response?.error?.response.data?.name,
          response?.data?.name
        );
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error(response?.error?.response.data?.name);
        } else {
          var res = response.data[0];
          if (res == "N") {
            //console.log("msg",res[0])
            alertify.error("Schedule Id generation failed");
            //setE1Table([,]);
          } else {
            getScheduleId();
            alertify.success("Schedule Id generated Successfully");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  // const getOrders = async (newToken = false) => {
  //   if (newToken) {
  //     const rsp = await getAuthorization();
  //   }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
  //     },
  //   };

  //   var selectedRows = rmDetailsDataTable.getSelectedRows();
  //   if (selectedRows.length == 0) {
  //     alertify.error("Please select rows");
  //     return;
  //   }

  //   var newData = [];
  //   selectedRows.forEach(function (item) {
  //     newData.push(item._row.data);
  //   });

  //   var url;
  //   setLoading(true);
  //   url = "api/LD01S002/getOrders";

  //   axiosAPI
  //     .post(url, newData, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         if (response.data[1].length == 0) {
  //           alertify.error("No Data Found");
  //         } else {
  //           setRmOrderData(response.data);
  //         }
  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };
  const getOrders = async (newToken = false) => {
    const url = "api/LD01S002/getOrders";

    // Function to set up headers
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

    const selectedRows = rmDetailsDataTable.getSelectedRows();
    if (selectedRows.length === 0) {
      alertify.error("Please select rows");
      return;
    }

    // New validation check starts here!
    if (selectedRows.length > 1) {
      const firstRowData = selectedRows[0]._row.data;
      const materialNo = firstRowData.MATERIL_NO;
      const lomSec1 = firstRowData.LOM_SEC1;
      const lomSec2 = firstRowData.LOM_SEC2;
      const lomTdcActl = firstRowData.LOM_TDC_ACTL; // Added this based on your prompt, assuming it's also part of the check

      for (let i = 1; i < selectedRows.length; i++) {
        const currentRowData = selectedRows[i]._row.data;
        if (
          currentRowData.MATERIL_NO !== materialNo ||
          currentRowData.LOM_SEC1 !== lomSec1 ||
          currentRowData.LOM_SEC2 !== lomSec2 ||
          currentRowData.LOM_TDC_ACTL !== lomTdcActl // Check LOM_TDC_ACTL as well
        ) {
          alertify.error("All selected rows must have the same MATERIAL NO, Thickness,Width and TDC values.");
          return; // Stop execution if discrepancy found
        }
      }
    }
    // New validation check ends here!

    const newData = selectedRows.map((item) => item._row.data);

    //const defaultOptions = getHeaders(); // Use the helper function to get headers
    setLoading(true);

    try {
      const response = await axiosAPI.post(url, newData, defaultOptions);
      console.log(response);
      if (response?.status === 200) {
        if (response?.data?.length == 0) {
          alertify.error("No Bom orders  found");
        } else setRmOrderData(response.data);
      } else {
        console.log(response);
        // Handle non-200 responses elegantly
        alertify.error(
          response?.data?.message || "An unexpected error occurred."
        );
      }
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
      getOrdersNonBOM();
    }
  };

  const getOrdersNonBOM = async (newToken = false) => {
    const url = "api/LD01S002/getOrdersNonBOM";
    // Function to set up headers
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
    const selectedRows = rmDetailsDataTable.getSelectedRows();
    if (selectedRows.length === 0) {
      alertify.error("Please select rows");
      return;
    }
     // New validation check starts here!
     if (selectedRows.length > 1) {
      const firstRowData = selectedRows[0]._row.data;
      const materialNo = firstRowData.MATERIL_NO;
      const lomSec1 = firstRowData.LOM_SEC1;
      const lomSec2 = firstRowData.LOM_SEC2;
      const lomTdcActl = firstRowData.LOM_TDC_ACTL; // Added this based on your prompt, assuming it's also part of the check

      for (let i = 1; i < selectedRows.length; i++) {
        const currentRowData = selectedRows[i]._row.data;
        if (
          currentRowData.MATERIL_NO !== materialNo ||
          currentRowData.LOM_SEC1 !== lomSec1 ||
          currentRowData.LOM_SEC2 !== lomSec2 ||
          currentRowData.LOM_TDC_ACTL !== lomTdcActl // Check LOM_TDC_ACTL as well
        ) {
          alertify.error("All selected rows must have the same MATERIAL NO, Thickness,Width and TDC values.");
          return; // Stop execution if discrepancy found
        }
      }
    }
    const newData = selectedRows.map((item) => item._row.data);
    //const defaultOptions = getHeaders(); // Use the helper function to get headers
    setLoading(true);
    try {
      const response = await axiosAPI.post(url, newData, defaultOptions);
      if (response?.status === 200) {
        if (response?.data?.length == 0) {
          alertify.error("No Non BOM orders found");
        } else setRmOrderDataNonBOM(response.data);
      } else {
        // Handle non-200 responses elegantly
        alertify.error(
          response?.data?.message || "An unexpected error occurred."
        );
      }
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for error handling
  const handleAxiosError = (error) => {
    console.log(error);
    if (error.response) {
      alertify.error(error.response.data.message || "Error fetching orders.");
    } else if (error.request) {
      alertify.error("No response received from the server.");
    } else {
      alertify.error("Error in setting up the request.");
    }
  };

  const getScheduleId = async (newToken = false) => {
    setLoading(true);
    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    
    let data = {
      adid: serverDetails.PersonalNo,
    };
    var url = "api/LD01S002/getSchedules";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            console.log(row, row[0], row[1], row[2]);
            obj.label =
              row[0] + " | " + row[1] + " | " + row[2] + " | " + row[3];
            obj.value = row[0] + "#" + row[3] + "#" + row[2];
            items.push(obj);
            console.log(obj);
          });
          console.log(items);
          setSchedules(items);
          //setSelectedSchedule(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  let pad = (width, string, padding) => {
    return width <= string.length
      ? string
      : pad(width, padding + string, padding);
  };

 const getSchedule = async (newToken = false) => {
  var selectedRmRows = rmDetailsDataTable.getSelectedRows();
  var selectedOrderRows = orderTable.getSelectedRows();
  var selectedNonBOMOrderRows = orderTableNonBOM.getSelectedRows();

  selectedOrderRows = [...selectedOrderRows, ...selectedNonBOMOrderRows];

  setShowSaveMsgSuccess(false);
  setShowSaveMsgError(false);
  setSaveMsg("");

  if (selectedRmRows.length === 0) {
    alertify.error("Please select RM rows");
    return;
  }

  if (selectedOrderRows.length === 0) {
    alertify.error("Please select Order rows");
    return;
  }

  var newDataRm = [];
  selectedRmRows.forEach(function (item) {
    newDataRm.push(item._row.data);
  });

  var newDataOrd = [];
  selectedOrderRows.forEach(function (item) {
    newDataOrd.push(item._row.data);
  });

  var scheduleData = [];

  const roundToThreeDecimals = (num) => {
    return Math.round(num * 1000) / 1000;
  };

  // Helper function to calculate No. of Tubes
  const calculateNoOfTubes = (tonnage, od, rmThk, length) => {
    if (od > 0 && rmThk > 0 && length > 0) {
      const noOfTubes = tonnage / (((od - rmThk) * rmThk * 0.02466) / 1000) / length;
      return Math.round(noOfTubes).toString();
    }
    return "";
  };

  if (newDataRm.length > 1) {
    if (newDataOrd.length !== 1) {
      alertify.error(
        "When multiple RM rows are selected, exactly one Order row must be selected."
      );
      return;
    }

    const singleOrderItem = newDataOrd[0];

    newDataRm.forEach(function (rmItem) {
      var scheduleItem = {
        txtSchBatch: rmItem.LOM_ID_BATCH,
        txtSchOrder: singleOrderItem.ENC_ID_ORDER,
        txtSchItem: singleOrderItem.ENC_NO_ITEM,
        txtSchProdCd: singleOrderItem.PROD_CD,
        txtSchQltycd: singleOrderItem.QLTY_CD,
        txtSchRmwt: rmItem.LOM_MS_PIECE_ACTL,
        txtSchOdia: singleOrderItem.WIDTH,
        txtSchIdia: singleOrderItem.IDIA,
        txtSchBTS: singleOrderItem.BTS,
        txtSchThick: singleOrderItem.THICK,
        txtSchTdc: singleOrderItem.TDC,
        txtSchLength: singleOrderItem.LNGTH || 1, // Default to 1 if not available
        txtSchNoTubes: "",
      };

      scheduleData.push(scheduleItem);
    });
  } else {
    newDataOrd.forEach(function (orderItem) {
      var scheduleItem = {
        txtSchBatch: newDataRm[0].LOM_ID_BATCH,
        txtSchOrder: orderItem.ENC_ID_ORDER,
        txtSchItem: orderItem.ENC_NO_ITEM,
        txtSchProdCd: orderItem.PROD_CD,
        txtSchQltycd: orderItem.QLTY_CD,
        txtSchRmwt: newDataRm[0].LOM_MS_PIECE_ACTL,
        txtSchOdia: orderItem.WIDTH,
        txtSchIdia: orderItem.IDIA,
        txtSchBTS: orderItem.BTS,
        txtSchThick: orderItem.THICK,
        txtSchTdc: orderItem.TDC,
        txtSchLength: orderItem.LNGTH || 1,
        txtSchNoTubes: "",
      };

      scheduleData.push(scheduleItem);
    });
  }

  const batchInfo = {};

  scheduleData.forEach((item) => {
    const batchId = item.txtSchBatch;

    if (!batchInfo[batchId]) {
      batchInfo[batchId] = {
        totalRmwt: roundToThreeDecimals(parseFloat(item.txtSchRmwt)),
        count: 0,
      };
    }

    batchInfo[batchId].count++;
  });

  scheduleData.forEach((item) => {
    const batchId = item.txtSchBatch;
    const info = batchInfo[batchId];

    if (info && info.count > 1) {
      item.txtSchPlantwt = roundToThreeDecimals(info.totalRmwt / info.count);
    } else {
      item.txtSchPlantwt = roundToThreeDecimals(parseFloat(item.txtSchRmwt));
    }

    // Calculate No. of Tubes using the formula
    item.txtSchNoTubes = calculateNoOfTubes(
      item.txtSchPlantwt,
      parseFloat(item.txtSchOdia) || 0,
      parseFloat(item.txtSchThick) || 0,
      parseFloat(item.txtSchLength) || 1
    );
  });

  console.log(scheduleData);
  setScheduleDetailsData(scheduleData);
};





const confirm = async (newToken = false) => {
  setShowSaveMsgSuccess(false);
  setShowSaveMsgError(false);
  setSaveMsg("");

  console.log("inside Confirm");

  if (scheduleDetailsData.length !== 0) {
    var url;
    var scheduleTableRefDt = scheduleDtRef.getData();

    console.log("scheduleTableRefDt on this call:", scheduleTableRefDt);

    var selectedRmRows = rmDetailsDataTable.getSelectedRows();

    var selectedOrdRows = orderTable.getSelectedRows();
    var selectedOrdRowsNonBOM = orderTableNonBOM.getSelectedRows();

    selectedOrdRows = [...selectedOrdRows, ...selectedOrdRowsNonBOM];

    if (selectedRmRows.length == 0) {
      alertify.error("Please select Rm rows");
      return;
    }

    if (selectedOrdRows.length == 0) {
      alertify.error("Please select Order rows");
      return;
    }

    if (selectedSchedule.length == 0) {
      alertify.error("Please select Schedule");
      return;
    }

    const batchPlanWtSums = {};
    const batchRmwtRefs = {};

    const orderItemPlanWtSums = {};
    const orderItemBTSRefs = {};

    for (let row of scheduleTableRefDt) {
      console.log("inside loop of schedules");

      // NEW VALIDATION FOR NO OF TUBES
      // Keep as varchar/string, but allow only blank or integer string
      const noOfTubes =
        row.txtSchNoTubes === null || row.txtSchNoTubes === undefined
          ? ""
          : String(row.txtSchNoTubes).trim();

      if (noOfTubes !== "" && !/^\d+$/.test(noOfTubes)) {
        let msg =
          "Please enter a valid integer value for No of Tubes for Batch " +
          row.txtSchBatch;

        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        return;
      }

      // Update row value as string so backend receives varchar
      row.txtSchNoTubes = noOfTubes;

      if (row.txtSchOdia !== scheduleTableRefDt[0].txtSchOdia) {
        alertify.error("Orders need to have same Odia.");
        return;
      }

      if (parseFloat(row.txtSchPlantwt) > parseFloat(row.txtSchBTS)) {
        let msg =
          "for order " +
          row.txtSchOrder +
          " and item " +
          row.txtSchItem +
          " plan wt can't be greater than BTP";

        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        return;
      }

      const currentBatch = row.txtSchBatch;

      batchPlanWtSums[currentBatch] =
        (batchPlanWtSums[currentBatch] || 0) +
        parseFloat(row.txtSchPlantwt);

      if (!(currentBatch in batchRmwtRefs)) {
        batchRmwtRefs[currentBatch] = parseFloat(row.txtSchRmwt);
      }

      const orderItemKey = `${row.txtSchOrder}#${row.txtSchItem}`;

      orderItemPlanWtSums[orderItemKey] =
        (orderItemPlanWtSums[orderItemKey] || 0) +
        parseFloat(row.txtSchPlantwt);

      if (!(orderItemKey in orderItemBTSRefs)) {
        orderItemBTSRefs[orderItemKey] = parseFloat(row.txtSchBTS);
      }
    }

    const tolerance = 0.00001;

    console.log(
      "inside loop of schedules just outside check",
      batchPlanWtSums,
      batchRmwtRefs
    );

    for (const batchId in batchPlanWtSums) {
      const sumPlantWtForBatch = batchPlanWtSums[batchId];
      const rmwtRefForBatch = batchRmwtRefs[batchId];

      console.log(batchId, sumPlantWtForBatch, rmwtRefForBatch);

      if (
        typeof rmwtRefForBatch !== "number" ||
        isNaN(rmwtRefForBatch) ||
        Math.abs(sumPlantWtForBatch - rmwtRefForBatch) > tolerance
      ) {
        let msg = `For PIPE ID ${batchId}, the total planned weight (${sumPlantWtForBatch.toFixed(
          3
        )}) does not match the available RM weight (${
          rmwtRefForBatch?.toFixed(3) || "N/A"
        }).`;

        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        return;
      }
    }

    for (const orderItemKey in orderItemPlanWtSums) {
      const sumPlantWtForOrderItem = orderItemPlanWtSums[orderItemKey];
      const btsRefForOrderItem = orderItemBTSRefs[orderItemKey];

      const [orderId, itemId] = orderItemKey.split("#");

      if (sumPlantWtForOrderItem > btsRefForOrderItem + tolerance) {
        let msg = `For Order ${orderId} and Item ${itemId}, the total planned weight (${sumPlantWtForOrderItem.toFixed(
          3
        )}) exceeds the BTS value (${btsRefForOrderItem.toFixed(3)}).`;

        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        return;
      }
    }

    if (
      !window.confirm(
        "Do you want to generate MILL" + scheduleMill + " schedule?"
      )
    ) {
      alertify.error("Schedule not generated");
      return;
    }

    var newDataRm = [];

    selectedRmRows.forEach(function (item) {
      newDataRm.push(item._row.data);
    });

    var newDataOrd = [];

    selectedOrdRows.forEach(function (item) {
      console.log(item);
      newDataOrd.push(item._row.data);
    });

    var newDataSched = [];

    // IMPORTANT:
    // txtSchNoTubes is explicitly converted to string/varchar here
    scheduleTableRefDt.forEach(function (item) {
      console.log(item);

      const noOfTubes =
        item.txtSchNoTubes === null || item.txtSchNoTubes === undefined
          ? ""
          : String(item.txtSchNoTubes).trim();

      newDataSched.push({
        ...item,

        // backend receives varchar/string
        txtSchNoTubes: noOfTubes,
      });
    });

    const [value1, value2, value3] = selectedSchedule?.value.split("#");

    var data = {
      newDataRm: newDataRm,
      newDataOrd: newDataOrd,
      newDataSched: newDataSched,
      scheduleId: value1,
      schedulePriority: value3,
    };

    console.log("Final Confirm Payload:", data);

    setLoading(true);

    const token = await GetAuthorization();

    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    url = "api/LD01S002/confirm";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        console.log(response.data);

        if (response.statusText != "" && response.statusText != "OK") {
          console.log(response?.error?.response?.data?.message);

          alertify.error(response.data);
          setShowSaveMsgSuccess(false);
          setShowSaveMsgError(true);
          setSaveMsg(response?.error?.response?.data?.message);
        } else {
          if (response.data.includes("N-")) {
            alertify.error(response.data);
            setShowSaveMsgSuccess(false);
            setShowSaveMsgError(true);
            setSaveMsg(response.data);
          } else {
            alertify.success(response.data);
            setShowSaveMsgSuccess(true);
            setShowSaveMsgError(false);
            setSaveMsg(response.data);

            setRmDetailsData([]);
            setRmDetailsDataTable(null);

            setRmOrderData([]);
            setOrderTable(null);

            setRmOrderDataNonBOM([]);
            setOrderTableNonBOM(null);

            setScheduleDetailsData([]);
            setScheduleDtRef(null);

            setSchedules([]);
            setSelectedSchedule(null);
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
  //if (rmOrderData?.length > 0) {
    const table =new Tabulator("#rmOrderTable", {
      data: rmOrderData,
      columns: orderDetailsColumn,
      layout: "fitDataFill",
      height: 200,
    })
    setOrderTable(table);
  // } else {
  //   setOrderTable(null);
  // }
  // return () => {
  //   orderTable?.destroy();
  // };
}, [rmOrderData]);

useEffect(() => {
  //if (rmOrderDataNonBOM?.length > 0) {
    const table =new Tabulator("#rmOrderTableNonBOM", {
      data: rmOrderDataNonBOM,
      columns: orderDetailsColumn,
      layout: "fitDataFill",
      height: 200,
    })
    setOrderTableNonBOM(table);
  // } else {
  //   setOrderTableNonBOM(null);
  // }
  // return () => {
  //   orderTableNonBOM?.destroy();
  // };
}, [rmOrderDataNonBOM]);



  useEffect(() => {
    if (orderTable && rmOrderData?.length > 0) {
      orderTable?.on("rowSelected", function (selectedData) {
        setScheduleDetailsData([]);
        setScheduleDtRef(null);
      });
      orderTable?.on("rowDeselected", function (selectedData) {
        setScheduleDetailsData([]);
        setScheduleDtRef(null);
      });
    }
  }, [orderTable]);
  useEffect(() => {
    if (orderTableNonBOM && rmOrderDataNonBOM?.length > 0) {
      orderTableNonBOM?.on("rowSelected", function (selectedData) {
        setScheduleDetailsData([]);
        setScheduleDtRef(null);
      });
      orderTableNonBOM?.on("rowDeselected", function (selectedData) {
        setScheduleDetailsData([]);
        setScheduleDtRef(null);
      });
    }
  }, [orderTableNonBOM]);

  var orderDetailsColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Customer Name",
      field: "SOLD_CUST_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Customer Name",
      field: "ENC_MARK_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Id",
      field: "ENC_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No",
      field: "ENC_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "FG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc.",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      //title: "Order Qty(MT)",
      title: "Order Qty.(TON)",
      // field: "ENC_ORD_QUANTITY",
      field: "ORDER_QTY_MT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          // return value;
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      //title: "Balance to Produce(MT)",
      title: "BTP(With Tolerance)",
      field: "BTS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      //title: "Balance to Produce(MT)",
      title: "BTR(Without Tolerance)",
      field: "BTR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "FG(TON)",
      field: "FG_STOCK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "WIP(TON)",
      field: "WIP_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
          //return value;
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    // {
    //   title: "BTF(TON)",
    //   field: "BTF",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   tooltip: "Order Qty - FG",
    //   formatter: function (cell, formatterParams) {
    //     var data = cell.getData();
    //     // Order qty - ( FG/1000)
    //     // var value = data.ORD_QTY - ((data.FG_KG/1000));
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },

    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    // },
    // {
    //   title: "BTR(TON)",
    //   field: "BTR",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   tooltip: "Order Qty - ( FG + WIP )",
    //   formatter: function (cell, formatterParams) {
    //     var data = cell.getData();
    //     // Order qty - ( FG/1000 + WIP/1000 )
    //     // var value = data.ORD_QTY - ((data.FG_KG/1000) + (data.WIP_KG/1000));
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },

    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    // },
    // {
    //   title: "Alloted(TON)",
    //   field: "ALLOTED_QTY",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       //return value.toFixed(3);
    //       return value;
    //     }
    //     return value;
    //   },
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    // },
    // {
    //   title: "BTA RM(TON)",
    //   field: "BTA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   tooltip: "Order Qty - (FG + WIP + ALLOTED)",
    //   formatter: function (cell, formatterParams) {
    //     // var data = cell.getData();
    //     // Order qty - ( FG/1000 + WIP/1000 + ALLOTED)
    //     // var value = data.ORD_QTY - ((data.FG_KG/1000) + (data.WIP_KG/1000) + data.ALLOTED_TO);
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    // },
    {
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LNGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Grade",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "QLTY_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Order Type",
      field: "ENC_ORDER_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Creation Date",
      field: "ENC_DT_ORD_CREATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      sorter: "datetime",
      sorterParams: {
        format: "dd-MMM-yy HH:mm:ss",
        alignEmptyValues: "top",
      },
    },
    {
      title: "Item Type",
      field: "ITEM_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill",
      field: "MILL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Draw Type",
      field: "DRAW_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Geometry",
      field: "GEOMETRY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Category",
      field: "CATEGORY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Spec",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Sur Finish",
      field: "SUR_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "End Finish",
      field: "END_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Class",
      field: "CLASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ins Code",
      field: "INS_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Out Dia",
      field: "OUT_DIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "In Dia",
      field: "IN_DIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },

    {
      title: "Ageing Days",
      field: "AGENING_DAYS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "RM Without BOM(MT)",
    //   field: "COIL_WITHOUT_BOM_COUNT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "RM With BOM(MT)",
    //   field: "COIL_WITH_BOM_COUNT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },

    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "SFG Material",
      field: "TMM_SFG_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
      // cellClick: function (e, cell) {
      //   handleClickOpen(cell, "SFG");
      // },
    },
    {
      title: "SFG material Desc",
      field: "TMM_SFG_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material",
      field: "TMM_RM_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
      // cellClick: function (e, cell) {
      //   handleClickOpen(cell, "RM");
      // },
    },
    {
      title: "RM Material Desc",
      field: "TMM_RM_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Group",
      field: "MATERIAL_GRP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Spec",
      field: "MATNR_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material IP",
      field: "MATNR_IP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Order Qty.(MT)",
    //   field: "ORDER_QTY_MT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    // },

    // {
    //   title: "Delv. Status",
    //   field: "OVERALL_DELV_STATUS",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Sales Office",
      field: "SALES_OFFICE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Qty (in sales Unit)",
      field: "ORD_QNTY_IN_SALES_UNIT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Sales Unit",
      field: "SALES_UNIT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "ENC_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const gvCoilsClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      field: "LOM_ID_BATCH",
      title: "Batch",
      width: 100,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellClick: function (e, cell) {
        {
          //copyTable(cell);
        }
      },
    },
    {
      field: "LOM_ID_PAR_COIL_NO",
      title: "Parent Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_PROD",
      title: "Prod",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_QLTY_ACTL",
      title: "Qlty",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MATERIL_NO",
      title: "Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MATERIAL_DESC",
      title: "Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MK_CUSTOMER",
      title: "Intended Customer",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_SEC1",
      title: "Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_SEC2",
      title: "Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //     field: "LOM_LENGTH", title: "Length", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    // },
    {
      field: "LOM_TDC_ACTL",
      title: "Tdc/Grade",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "UTS",
      field: "UTS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "YS",
      title: "YS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_MS_PIECE_ACTL",
      title: "Net Wt(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "GROSS_CAL",
      title: "Res Wt(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "LOM_CD_STATUS",
      title: "Status",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Age (Days)",
      field: "AGE_DAYS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   field: "LOM_MS_SCRAP",
    //   title: "Scrap Wt",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // // { field: "LOM_ID_ORDER_CUS", title: "Order ID", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // {
    //   title: "Yrd",
    //   field: "LOM_CD_YRD",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Loc X",
    //   field: "LOM_ID_LOC_X",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Loc Y",
    //   field: "LOM_ID_LOC_Y",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Loc Z",
    //   field: "LOM_ID_POS",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      field: "LOM_IDIA",
      title: "Idia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   field: "GRADE_DESC",
    //   title: "Grade",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
  ];

  const clearFilter = () => {
    setSelectedPlant([]);
    setAllValues({});
    setRmDetailsData([]);
    setRmDetailsDataTable(null);
    setRmOrderData([]);
    setOrderTable(null);
    setRmOrderDataNonBOM([]);
    setOrderTableNonBOM(null);
    setScheduleDetailsData([]);
    setSelScheduleDetailsData([,]);
    setScheduleDtRef(null);
  };

  const downloadOrderList = async (newToken = false) => {
    var date = new Date();
    var fileName = "LD01S002 " + date.toString() + ".xlsx";
    gridModal.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };
  const downloadOrderNonBOM = () => {
    if (rmOrderDataNonBOM.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Order_Non_BOM " + ".xlsx";
    orderTableNonBOM.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Scheduling For LDP"
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
                  {
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
                              Filters
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title="Clear All">
                              <IconButton
                                color="white"
                                onClick={() => clearFilter(true)}
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>

                      <MDBox px={6} py={3}>
                        <Grid container spacing={1.5}>
                          <Grid item xs={1.5} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Plant*
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plant}
                              onChange={handlePlantChange}
                              value={selectedPlant}
                            />
                          </Grid>

                          <Grid item xs={1.25}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Batch Id
                            </MDTypography>
                            <MDInput
                              label=""
                              name="batch"
                              value={allValues.batch || ""}
                              onChange={(e) => handleChange(e)}
                            />
                          </Grid>

                          {/* <Grid item xs={0.65}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Thick From
                            </MDTypography>
                            <MDInput
                              name="thikFrm"
                              type="number"
                              value={allValues.thikFrm || ""}
                              onChange={(e) => handleChange(e)}
                            />
                          </Grid>

                          <Grid item xs={0.65}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Thick To
                            </MDTypography>
                            <MDInput
                              name="thikTo"
                              type="number"
                              value={allValues.thikTo || ""}
                              onChange={(e) => handleChange(e)}
                            />
                          </Grid>

                          <Grid item xs={0.65}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Width From
                            </MDTypography>
                            <MDInput
                              name="widthFrm"
                              type="number"
                              value={allValues.widthFrm || ""}
                              onChange={(e) => handleChange(e)}
                            />
                          </Grid>

                          <Grid item xs={0.65}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Width To
                            </MDTypography>
                            <MDInput
                              name="widthTo"
                              type="number"
                              value={allValues.widthTo || ""}
                              onChange={(e) => handleChange(e)}
                            />
                          </Grid> */}

                          <Grid item xs={3} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Schd ID | Schd Dt | Coils in Schd | Mill No*
                            </MDTypography>
                            <ReactSelect
                              id="schid"
                              options={schedules}
                              onChange={handleschedulechange}
                              value={selectedSchedule}
                            />
                          </Grid>
                          <Grid item xs={0.5}>
                            <Tooltip title="refersh">
                              <IconButton
                                color="black"
                                aria-label="toggle"
                                onClick={() => getScheduleId()}
                              >
                                &#10227;
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getCoils(true)}
                            >
                              Submit
                            </MDButton>
                          </Grid>
                          <Grid
                            item
                            xs={0.5}
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Divider
                              orientation="vertical"
                              variant="middle"
                              color="red"
                              flexItem
                              sx={{
                                borderWidth: 4,
                                my: 0,
                              }}
                            />
                          </Grid>
                          {/* <Divider orientation="vertical" variant="middle" color="black" flexItem sx={{
                          borderWidth: 4, // Thicker divider
                          my: 0, // Remove top and bottom margins
                        }} /> */}
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Mill No.*
                            </MDTypography>
                            <ReactSelect
                              id="millNo"
                              options={[
                                { label: "MILL1", value: "1" },
                                { label: "MILL2", value: "2" },
                              ]}
                              onChange={handleMillChange}
                              value={selectedMill}
                            />
                          </Grid>

                          <Grid item xs={2}>
                            <MDButton
                              style={{
                                marginTop: "1.5rem",
                                whiteSpace: "nowrap", // Prevent text wrapping
                                backgroundColor: "#FFA500",
                                color: "#FFFFFF",
                              }}
                              size="small"
                              onClick={() => generateScheduleId(true)}
                            >
                              Generate Schedule Id
                            </MDButton>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  }
                </Card>
              </Grid>
              <Grid item xs={12}>
                {
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={1.25}
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
                            Raw Material Details
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Get Orders">
                            <IconButton
                              color="white"
                              onClick={() => {
                                getOrders();
                              }}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div id="rmDetailsTable" />

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {rmDetailsData.length} of{" "}
                          {rmDetailsData.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </Card>
                }
              </Grid>
              <Grid item xs={12}>
                {
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={1.25}
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
                            Order Details(Matching with BOM)
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Create PDIs">
                            <IconButton
                              color="white"
                              onClick={() => getSchedule()}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div id="rmOrderTable" />

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {rmOrderData.length} of{" "}
                          {rmOrderData.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </Card>
                }
              </Grid>
              <Grid item xs={12}>
                {
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={1.25}
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
                            Order Details(not matching with BOM)
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                          <Tooltip title="Create PDIs">
                            <IconButton
                              color="white"
                              onClick={() => getSchedule()}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadOrderNonBOM()}
                            >
                              <DownloadForOfflineIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div id="rmOrderTableNonBOM" />

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {rmOrderDataNonBOM.length} of{" "}
                          {rmOrderDataNonBOM.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </Card>
                }
              </Grid>
              <Grid item xs={12}>
                {
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-3}
                      py={0.25}
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
                            Schedule Details
                          </MDTypography>
                        </Grid>
                        {/* <Grid Item xs={1}>                                                                                
                                                <p color="white"> {(totalAimWt.toFixed(3))}</p>
                                                </Grid> */}
                        <Grid item xs={1}>
                          {
                            <Tooltip title="Confirm" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => confirm(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          }
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
                          <div id="scheduleDetailsTable" />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                }
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
                      if (tabValue == 0) {
                        setInsertTableData([]);
                      }
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
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
