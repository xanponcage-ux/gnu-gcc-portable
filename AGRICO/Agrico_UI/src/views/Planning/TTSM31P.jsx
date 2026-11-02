import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useCallback,
} from "react";

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
import MDAlert from "@mui/material/Alert";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePickerDis";
import DateTimePicker from "components/DateTime/MuiDateTimePicker";
import Checkbox from "@mui/material/Checkbox";
import ButtonGroup from "@mui/material/ButtonGroup";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import FunctionsIcon from "@mui/icons-material/Functions";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TabIcon from "@mui/icons-material/Tab";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
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
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PropTypes from "prop-types";
//import { styled } from '@mui/material/styles';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
//import IconButton from '@mui/material/IconButton';
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import moment from "moment";
import { DateTime } from "luxon";
import {
  ResetTvRounded,
  SettingsInputComponentTwoTone,
} from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { GetAuthorization } from "utils";
import addMinutes from "date-fns/fp";
import GetAppIcon from "@mui/icons-material/GetApp";
import ReceiptIcon from '@mui/icons-material/Receipt';
import VisibilityIcon from "@mui/icons-material/Visibility";

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

export default function TTSM004() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [processListItems, setProcessListItems] = useState([]);
  const [processListItemsTable, setProcessListItemsTable] = useState([]);
  const [odia, setOdia] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectedProcess, setSelectedProcess] = React.useState([]);
  const [wCenter, setwCenter] = React.useState([]);
  const [selectedWorkCenter, setSelectedWorkCenter] = React.useState([]);
  const [selMbatch, setSelectMbatch] = React.useState([]);
  const [selDbatch, setSelectDbatch] = React.useState([]);
  const [selectIdea, setSelectIdea] = React.useState([]);
  const [selectOdia, setSelectOdia] = React.useState([]);
  const [dateValue, setDateValue] = useState(null);
  const [insertTable, setInsertTable] = useState(null);
  const [insertTableData, setInsertTableData] = React.useState([]);
  const [scarpDt, setScarpDt] = React.useState([]);
  const [modifyTableData, setModifyTableData] = React.useState([]);

  const [insertScrapTable, setInsertScrapTable] = useState(null);
  const [modifyTable, setModifyTable] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [gridModal, setSelectedGridTableModal] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [motherBatch, setMotherBatch] = useState([]);
  const [daughterBatch, setDaughterBatch] = useState([]);
  const [gridtbl, setSelectedGridTable] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);
  var customerTable = React.createRef();
  const [selectedRsnModalTable, setSelectRsnItemModal] = useState(null);
  const [rsnDt, setRsnListDt] = useState([]);
  const [cellPosition, setSelectedCellPosition] = useState(null);
  const [reasonDetailsTable, setReasonDetailsTable] = useState([]);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [scrapMatDescList, setScrapMatDescList] = useState([]);
  const [weightBtnSts, setWeightBtnSts] = useState(false);
  const [scheduleBtnSts, setScheduleBtnSts] = useState(false);
  const [workCenter, setWorkCenter] = React.useState([]);
  const [productionType, setProductionType] = React.useState("");
  const [qtyType, setQtyType] = React.useState("");
  const [allValues, setAllValues] = useState({
    batchIdMother: "",
    batchIdDaughter: "",
    order: "",
    item: "",
    remarks: "",
  });
  const [tabValue, setTabValue] = useState(0);
  const [sumNetWt, setSumNetWt] = useState(0);
  const [sumSchWt, setSumSchWt] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [valueRadio, setValueRadio] = React.useState("S");
  const [Merge, setMergetype] = useState(true);
  const [mergeSchedule, setMergetypeSchedule] = useState(true);
  const [copyPrimeDt, setCopyPrimeDT] = React.useState([]);
  const [printBtn, setprintBtn] = useState(true);

  const iDia = [{ label: "True", value: "0" }];

  var flagCopy = false;

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([
        getGroupPlantId(token.accessToken),
        getReasonList(token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  }

  //page load
  useEffect(() => {
    document.body.style.zoom = "90%";
    fetchData();
  }, []);

  var dateEditor = (cell, onRendered, success, cancel, editorParams) => {
    var editor = document.createElement("input");
    editor.value = cell.getValue();

    var datepicker = flatpickr(editor, {
      enableTime: true,
      dateFormat: "j-n-Y H:i",
      onClose: (selectedDates, dateStr, instance) => {
        success(dateStr);
        instance.destroy();
      },
    });

    onRendered(() => {
      editor.focus();
    });

    return editor;
  };

  var dateEditorLux = function (
    cell,
    onRendered,
    success,
    cancel,
    editorParams
  ) {
    //cell - the cell component for the editable cell
    //onRendered - function to call when the editor has been rendered
    //success - function to call to pass thesuccessfully updated value to Tabulator
    //cancel - function to call to abort the edit and return to a normal cell
    //editorParams - params object passed into the editorParams column definition property

    //create and style editor
    var editor = document.createElement("input");

    editor.setAttribute("type", "datetime-local");

    //create and style input
    editor.style.padding = "3px";
    editor.style.width = "100%";
    editor.style.boxSizing = "border-box";

    //Disable date
    var today = new Date();
    var day = today.getDate();
    // Set month to string to add leading 0
    var mon = new String(today.getMonth() + 1); //January is 0!
    var yr = today.getFullYear();
    if (mon.length < 2) {
      mon = "0" + mon;
    }
    if (day.length < 2) {
      day = "0" + day;
    }
    var date = new String(day + "/" + mon + "/" + yr);
    editor.disabled = false;
    editor.setAttribute("max", date);
    //Disable date

    //Set value of editor to the current value of the cell
    var cellVal = cell.getValue();
    if (cellVal) {
      editor.value = DateTime.fromFormat(
        cell.getValue(),
        "dd/MM/yyyy HH:mm"
      ).toFormat("yyyy-MM-dd HH:mm");
    } else {
      var today = DateTime.now().toFormat("dd/MM/yyyy HH:mm");
      editor.value = DateTime.fromFormat(today, "dd/MM/yyyy HH:mm").toFormat(
        "yyyy-MM-dd HH:mm"
      );
      //editor.value = DateTime.now().toISO();
    }

    //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
    onRendered(function () {
      editor.focus();
      editor.style.css = "100%";
    });

    //when the value has been set, trigger the cell to update
    function successFunc() {
      success(DateTime.fromISO(editor.value).toFormat("dd/MM/yyyy HH:mm"));
    }

    editor.addEventListener("change", successFunc);
    editor.addEventListener("blur", successFunc);
    //return the editor element
    return editor;
  };

  var dateEditorDisabled = function (
    cell,
    onRendered,
    success,
    cancel,
    editorParams
  ) {
    //create and style editor
    var editor = document.createElement("input");

    editor.setAttribute("type", "datetime-local");

    //Disable date
    // var today = new Date();
    // var day = today.getDate();

    // Set month to string to add leading 0
    // var mon = new String(today.getMonth() + 1); //January is 0!
    // var yr = today.getFullYear();

    // if (mon.length < 2) { mon = "0" + mon; }
    // if (day.length < 2) { day = "0" + day; }

    // var date = new String(yr + '-' + mon + '-' + day);

    // editor.disabled = false;
    // editor.setAttribute('max', date);
    //Disable date

    //create and style input
    editor.style.padding = "3px";
    editor.style.width = "100%";
    editor.style.boxSizing = "border-box";

    //Set value of editor to the current value of the cell
    var cellVal = cell.getValue();
    if (cellVal) {
      editor.value = DateTime.fromFormat(
        cell.getValue(),
        "dd/MM/yyyy HH:mm"
      ).toFormat("yyyy-MM-dd HH:mm");
    } else {
      var today = DateTime.now().toFormat("dd/MM/yyyy HH:mm");
      editor.value = DateTime.fromFormat(today, "dd/MM/yyyy HH:mm").toFormat(
        "yyyy-MM-dd HH:mm"
      );
      //editor.value = DateTime.now().toISO();
    }

    //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
    onRendered(function () {
      editor.focus();
      editor.style.css = "100%";
    });

    //when the value has been set, trigger the cell to update
    function successFunc() {
      success(DateTime.fromISO(editor.value).toFormat("dd/MM/yyyy HH:mm"));
    }

    editor.addEventListener("change", successFunc);
    editor.addEventListener("blur", successFunc);
    //return the editor element
    return editor;
  };

  useEffect(() => {
    if (
      tabValue == 0 &&
      insertTableData &&
      insertTableData.length > 0 &&
      (scrapMatDescList &&
        Object.keys(scrapMatDescList).length === 0 &&
        Object.getPrototypeOf(scrapMatDescList) === Object.prototype) == false
    ) {
      setInsertTable(
        new Tabulator("#insertTableDiv", {
          height: 250,
          data: insertTableData,
          columns: insertColumns,
        })
      );

      setInsertScrapTable(
        new Tabulator("#scarpTableDiv", {
          height: 250,
          data: scarpDt,
          columns: scrapColumns,
        })
      );
    }
  }, [tabValue, insertTableData, scrapMatDescList, scarpDt]);

  useEffect(() => {
    if (tabValue == 2 && modifyTableData && modifyTableData.length > 0) {
      setModifyTable(
        new Tabulator("#modifyTableDiv", {
          height: 400,
          data: modifyTableData,
          columns: modifyColumns,
        })
      );
    }
  }, [tabValue, modifyTableData]);

  useEffect(() => {
    if (tabValue == 0 && rsnDt && rsnDt.length > 0) {
      setSelectRsnItemModal(
        new Tabulator("#modalTable", {
          height: 300,
          pagination: "local",
          paginationSize: 200,
          data: rsnDt,
          columns: rnsItmClm,
        })
      );
    }
  }, [rsnDt]);

  var rnsItmClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Reason Code",
      field: "CD_HOLD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Reason Description",
      field: "CD_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const gridCol = [
    {
      formatter: "rowSelection",
      visible: mergeSchedule,
      width: 50,
      hozAlign: "center",
      frozen: true,
      headerSort: false,
    },
    { field: "EOM_ID_BATCH", title: "Batch Id", width: 150 },
    { field: "EOM_CD_QLTY_ACTL", title: "Qlty" },
    {
      field: "EOM_SEC1",
      title: "Thick",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      field: "EOM_SEC2",
      title: "Odia/Width",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Plan Wt.",
      field: "PLAN_WT",
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
      title: "Schedule Wt. " + qtyType + "",
      field: "SCHD_WT",
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
      field: "INPUT_WT",
      title: "Input Wt. (Ton)",
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
      field: "PROC_WT",
      title: "Proc Wt. (Ton)",
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
      title: "Res Wt. (Ton)",
      field: "EOM_MS_GROSS_CAL",
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
    { title: "Status", field: "EOM_CD_STATUS" },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
    },
    { title: "Plan Proc", field: "EOM_PLANNED_PROC" },
    { title: "Planning Remarks", field: "PLANNING_REMARKS", width: 200 },
    { title: "FG Material", field: "FG_MATERIAL" },
    { title: "FG Material Desc", field: "FG_MATERIAL_DESC" },
    { title: "Order", field: "CUST_ORD" },
    { title: "Item", field: "CUST_ITEM" },
    { title: "RM Material", field: "RM_MATERIAL" },
    { title: "RM Material Desc", field: "RM_MATERIAL_DESC" },
    { title: "SFG Material", field: "SFG_MATERIAL" },
    { title: "SFG Material Desc", field: "SFG_MATERIAL_DESC" },
    { title: "Grade", field: "GRADE" },
    { title: "Work Center", field: "WORK_CENTER" },
    {
      field: "EOM_LENGTH",
      title: "Input Length",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { field: "EOM_TDC_ACTL", title: "Tdc" },

    {
      title: "Scrap Wt. (Ton)",
      field: "EOM_MS_SCRAP",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { title: "Schedule CRT Date", field: "SCHD_CRT_DT" },
    { title: "Customer Name", field: "CUST_NM" },
  ];

  useEffect(() => {
    if (tabValue == 0 && gridData && gridData.length > 0) {
      setSelectedGridTable(
        new Tabulator("#gridTable", {
          data: gridData,
          columns: gridCol,
          layout: "fitDataFill",
          height: 250,
        })
      );
    }
  }, [gridData]);

  useEffect(() => {
    setTimeout(() => {
      //added timout and useeffect for performance issue --- sourav
      if (selMbatch ? selMbatch.value : null != null) {
        if (gridtbl != null) {
          gridtbl.selectRow();
        }
      }
    }, 1000);
  }, [gridtbl]);

  const validateUser = async (token) => {
    try {
      var plant = "";
      var userDetails = jwt.verify(
        token.refreshToken,
        serverDetails.REFRESH_KEY
      );
      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "TTSM031";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

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
        // }
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
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/users/screenAuth";

      if (serverDetails.devMode == true) {
        //(userId = "198447"), (pageName = "TSMCPPF001");
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response?.statusText != "" && response?.statusText != "OK") {
          reject(null);
        } else {
          var encryptUserInfo = response?.data;
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

  const getGroupPlantId = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
        //serverDetails.PersonalNo
      };
      var url = "api/ttsm031/getGroupPlant";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
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
            Promise.all([
              getProcessList(items[0], accessToken),
              //getDaughterBatch(items[0], accessToken),
              getScrapMatNo(items[0], accessToken),
              //getNoMergeDetails(items[0], accessToken),
            ]).finally(() => {
              resolve();
            });
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getProcessList = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm031/getProcessList";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            var items = [];
            var tableItems = {};
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[1];
              items.push(obj);
              tableItems[row[0]] = row[1];
            });
            setProcessListItems(items);
            setProcessListItemsTable(tableItems);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getMotherBatch = async (value) => {
    setSelectMbatch([]);
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/ttsm031/getMCoilList";
      let data = {
        Plant: selectedPlant.value,
        Process: selectedProcess.value,
        workCenter: value ? value.value : "",
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data) {
              var items = [];
              response.data.map((row) => {
                var obj = new Object();
                obj.label = row[0];
                obj.value = row[0];
                items.push(obj);
              });
              setMotherBatch(items);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getMotherBatchProcess = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm031/getMCoilList";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
        workCenter: "",
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            if (response.data) {
              var items = [];
              response.data.map((row) => {
                var obj = new Object();
                obj.label = row[0];
                obj.value = row[0];
                items.push(obj);
              });
              setMotherBatch(items);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  // const getDaughterBatch = async (value, accessToken) => {
  //     return new Promise((resolve) => {
  //         var defaultOptions = {
  //             headers: {
  //                 Authorization: "Bearer " + accessToken,
  //             },
  //         };

  //         var url = "api/ttsm031/getDaugherCoil";
  //         let data = {
  //             Plant: value.value,
  //         };
  //         axiosAPI
  //             .post(url, data, defaultOptions)
  //             .then((response) => {
  //                 if (response.statusText != "" && response.statusText != "OK") {
  //                     //reject(response.statusText);
  //                     resolve();
  //                 } else {
  //                     if (response.data) {
  //                         var items = [];
  //                         response.data.map((row) => {
  //                             var obj = new Object();
  //                             var rowArr = row.split(":");
  //                             obj.label = rowArr[0];// + "-" + rowArr[1];
  //                             obj.value = rowArr[0];
  //                             items.push(obj);
  //                         });
  //                         setDaughterBatch(items);
  //                     } else {
  //                         resolve()
  //                         //alertify.error("No Data Found");
  //                     }
  //                 }
  //             })
  //             .finally((f) => {
  //                 resolve();
  //             });
  //     });
  // };

  const getODIA = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/ttsm031/getODIA";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            var items = response.data.map(([value]) => ({
              label: value.toFixed(3),
              value,
            }));
            setOdia(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getShift = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      setLoading(true);
      var url = "api/ttsm031/getShiftStatus";

      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            setSelectedStatus({ value: response.data[0][0] });
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    clearFilterOnPlant();
    setSelectedPlant(value);
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getProcessList(value, token.accessToken),
          // getDaughterBatch(value, token.accessToken),
          getScrapMatNo(value, token.accessToken),
          //getNoMergeDetails(value, token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleProcessChange = (value) => {
    setSelectedProcess(value);
    if (Merge == false) {
      if (value ? value.value == "M" : null) {
        setMergetype(false);
      } else {
        setMergetype(true);
      }
    }
    if (value) {
      setSelectMbatch([]);
      setGridData([,]);
      setInsertTableData([,]);
      setScarpDt([,]);
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getODIA(value, token.accessToken),
          getPType(value, token.accessToken),
          getWorkCenterFilter(value, token.accessToken),
          getMotherBatchProcess(value, token.accessToken),
          getShift(token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  // const getNoMergeDetails = async (value, accessToken) => {
  //     return new Promise((resolve) => {
  //         var defaultOptions = {
  //             headers: {
  //                 Authorization: "Bearer " + accessToken,
  //             },
  //         };

  //         var url = "api/ttsm031/getNoMergeDetails";
  //         let data = {
  //             Plant: value.value,
  //         };
  //         axiosAPI
  //             .post(url, data, defaultOptions)
  //             .then((response) => {
  //                 if (response.statusText != "" && response.statusText != "OK") {
  //                     //reject(response.statusText);
  //                     resolve()
  //                 } else {
  //                     if (response.data.rows[0][0] == "MERGE") {
  //                         setMergetype(false);
  //                         setMergetypeSchedule(true);
  //                     } else if (response.data.rows[0][0] == "NO-MERGE") {
  //                         setMergetype(true);
  //                         setMergetypeSchedule(false);
  //                     }
  //                 }
  //             })
  //             .finally((f) => {
  //                 resolve()
  //             });
  //     })
  // };

  const handleWorkCenterChange = (value) => {
    setSelectedWorkCenter(value);
    if (value) {
      getMotherBatch(value);
      setGridData([,]);
      setInsertTableData([,]);
      setScarpDt([,]);
    }
  };

  const getWorkCenterFilter = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm031/getWorkCenterDropdown";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            let item = [];
            response.data.map((j, i) => {
              //let a = j;
              const a = j.split(":");
              //let b = d[0].split(/\s/).join("");
              item.push({ label: a[0] + "--" + a[1], value: a[0] });
            });
            setwCenter(item);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getPType = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm031/getProductionType";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            setProductionType(response.data[0][0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleStusChange = (value) => {
    setSelectedStatus(value);
  };

  const handleMotherBatchChange = (value) => {
    setSelectMbatch(value);
    setGridData([,]);
    setInsertTableData([,]);
    setScarpDt([,]);
  };

  const handleDaughterBatchChange = (value) => {
    setSelectDbatch(value);
    setGridData([,]);
    setInsertTableData([,]);
    setScarpDt([,]);
  };

  const handleIdeaChange = (value) => {
    setSelectIdea(value);
  };

  const handleOdiaChange = (value) => {
    setSelectOdia(value);
    setGridData([,]);
    setInsertTableData([,]);
    setScarpDt([,]);
  };

  async function callBatchArr(res, prodDt, defaultOptions) {
    var url = "api/ttsm031/getBatchCount";
    var batchArr = [];
    setLoading(true);
    for (let i = 0; i < res.length; i++) {
      var batchd = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        ProdDate: prodDt,
        MBatch: selMbatch ? selMbatch.value : "",
        status: selectedStatus.value,
        Process: selectedProcess.value,
        count: i + 1,
      };
      axiosAPI
        .post(url, batchd, defaultOptions)
        .then(async (resp) => {
          if (resp.statusText != "" && resp.statusText != "OK") {
            setLoading(false);
          } else {
            setLoading(false);
            var d = resp.data[0][0];
            batchArr.push(await d);
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    }
    setLoading(false);
    return batchArr;
  }

  function generateDatabaseDateTime(date) {
    const p = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
      .formatToParts(date)
      .reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
      }, {});

    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
  }

  const getData = async () => {
    if (selectedPlant != null) {
      setInsertTableData([,]);
      setSumNetWt(0);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(false);
      setSaveMsg("");
      setWeightBtnSts(false);
      setLoading(true);

      const formatDate = new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      var prodStartDateVal = document.getElementById("prodStartDate").value;
      var prodEndDateVal = document.getElementById("prodEndDate").value;
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };

        if (tabValue == 0) {
          if (selectedProcess == null || selectedProcess.value == undefined) {
            alertify.error("Please select Process");
            setLoading(false);
            return;
          }
          if (dateValue != null) {
            var d = new Date(dateValue);
            var prodDt =
              ("0" + d.getDate()).slice(-2) +
              "-" +
              d.toString().substr(4, 3) +
              "-" +
              d.getFullYear();
          } else {
            alertify.error("Please select Prod Dt for batch create");
            setLoading(false);
            return;
          }

          if (prodStartDateVal != "") {
            var d = new Date(prodStartDateVal);
            var prodStartDt =
              ("0" + d.getDate()).slice(-2) +
              "-" +
              d.toString().substr(4, 3) +
              "-" +
              d.getFullYear();
          } else {
            alertify.error("Please select Prod Start Dt for batch create");
            setLoading(false);
            return;
          }

          if (prodEndDateVal != "") {
            var d = new Date(prodEndDateVal);
            var prodEndDt =
              ("0" + d.getDate()).slice(-2) +
              "-" +
              d.toString().substr(4, 3) +
              "-" +
              d.getFullYear();
          } else {
            alertify.error("Please select Prod End Dt for batch create");
            setLoading(false);
            return;
          }

          if (selectedProcess.value != "M" && selMbatch == null) {
            alertify.error("Please select Mother Batch");
            setLoading(false);
            return;
          }

          var urlbatchDtl = "api/ttsm031/getBatchDtl";
          var databatchDtl = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Batch: selMbatch ? selMbatch.value : "",
            ProcLine: selectedProcess ? selectedProcess.value : "",
            workcenter: selectedWorkCenter?.value
              ? selectedWorkCenter.value
              : null,
          };
          axiosAPI
            .post(urlbatchDtl, databatchDtl, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                //reject(response.statusText);
              } else {
                if (response.data[1]) {
                  setGridData(response.data[1]);
                  setLoading(false);
                } else {
                  alertify.error("No Data Found");
                  setGridData([,]);
                  setLoading(false);
                }
              }
            })
            .catch((error) => {
              setLoading(false);
            });

          var pushBatch;
          var urlpdi = "api/ttsm031/getPdiDtl";

          var datapdi = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Batch: selMbatch ? selMbatch.value : "",
            Process: selectedProcess.value,
            ProdDate: prodDt,
            MBatch: selMbatch ? selMbatch.value : "",
            BusUnit: "TUBES",
            Odia: selectOdia.value ? selectOdia.value : "",
            status: selectedStatus.value,
          };
          axiosAPI
            .post(urlpdi, datapdi, defaultOptions)
            .then(async (response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                //reject(response.statusText);
              } else {
                if (response.data == false) {
                  alertify.error(
                    "Mill code not found please correct the schedule"
                  );
                  return;
                }
                if (response.data[1].length != 0) {
                  var res = response.data[1];

                  let a = new Date(prodStartDateVal);
                  let b = new Date(prodEndDateVal);
                  let dtDiff = (b - a) / 1000 / 60;

                  let batchCnt = response.data[1].length;
                  let dtAdd = parseInt(dtDiff / batchCnt);

                  let arrStartDt = [];
                  let arrEndDt = [];
                  for (let i = 0; i < batchCnt; i++) {
                    let d1 = new Date(a);
                    d1.setMinutes(a.getMinutes() + dtAdd);
                    arrStartDt.push(generateDatabaseDateTime(new Date(a)));
                    arrEndDt.push(generateDatabaseDateTime(new Date(d1)));
                    a = d1;
                  }

                  //Call Batch multiple times
                  if (res.length > 1) {
                    //var batchArr = await callBatchArr(res, prodDt, defaultOptions);
                    pushBatch = res;
                    let q = pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
                    setQtyType(q);
                    // call work center api //
                    var urlworkcenter = "api/ttsm031/getWorkCenterDropdown";
                    var dataObj = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      Process: selectedProcess.value,
                      MatNo: pushBatch[0].SFG_MAT,
                      MBatch: selMbatch.value,
                    };

                    axiosAPI
                      .post(urlworkcenter, dataObj, defaultOptions)
                      .then((response) => {
                        if (
                          response.statusText != "" &&
                          response.statusText != "OK"
                        ) {
                        } else {
                          let resArr = [];
                          var tableItems = {};
                          if (response.data) {
                            response.data.map((row) => {
                              var rowArr = row.split(":");
                              tableItems[rowArr[0]] = rowArr[0];
                            });

                            let keys = Object.keys(tableItems);
                            for (let i = 0; i < keys.length; i++) {
                              resArr.push({
                                x: keys[i],
                                y: workCenter[keys[i]],
                              });
                            }

                            setWorkCenter(tableItems);
                            var batchResult = pushBatch.map(function (el, i) {
                              var o = Object.assign({}, el);
                              //o.BATCH_ID = batchArr[i] ? batchArr[i] : "";
                              o.ddlWorkCenter = resArr[0] ? resArr[0].x : "";
                              o.prdPStartDt = arrStartDt[i]
                                ? arrStartDt[i]
                                : "";
                              o.prdPEndDt = arrEndDt[i] ? arrEndDt[i] : "";
                              return o;
                            });
                            // var dt = [];
                            // var sum = 5 + batchResult.length;
                            // for (let i = 0; i < sum; i++) {
                            //   if (batchResult[i] != undefined) {
                            //     dt.push(batchResult[i]);
                            //   } else {
                            //     dt.push({ id: i + 1 });
                            //   }
                            // }

                            setInsertTableData(batchResult);
                          } else {
                            alertify.error("No Work Center Found !!");
                          }
                        }
                      })
                      .finally((f) => {});
                  } else {
                    var url = "api/ttsm031/getBatchCount";
                    var batchd = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      ProdDate: prodDt,
                      MBatch: selMbatch ? selMbatch.value : "",
                      status: selectedStatus.value,
                      Process: selectedProcess.value,
                      count: 1,
                    };
                    axiosAPI
                      .post(url, batchd, defaultOptions)
                      .then((resp) => {
                        if (resp.statusText != "" && resp.statusText != "OK") {
                        } else {
                          var d = resp.data[0];
                          pushBatch = res;
                          let q =
                            pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
                          setQtyType(q);
                          // call work center api //
                          var urlworkcenter =
                            "api/ttsm031/getWorkCenterDropdown";
                          var dataObj = {
                            Plant: selectedPlant.value
                              ? selectedPlant.value
                              : "",
                            Process: selectedProcess.value,
                            MatNo: pushBatch[0].SFG_MAT,
                            MBatch: selMbatch.value,
                          };

                          axiosAPI
                            .post(urlworkcenter, dataObj, defaultOptions)
                            .then((response) => {
                              if (
                                response.statusText != "" &&
                                response.statusText != "OK"
                              ) {
                              } else {
                                let resArr = [];
                                var tableItems = {};
                                if (response.data) {
                                  response.data.map((row) => {
                                    var rowArr = row.split(":");
                                    tableItems[rowArr[0]] = rowArr[0];
                                  });

                                  let keys = Object.keys(tableItems);
                                  for (let i = 0; i < keys.length; i++) {
                                    resArr.push({
                                      x: keys[i],
                                      y: workCenter[keys[i]],
                                    });
                                  }

                                  setWorkCenter(tableItems);
                                  var batchResult = pushBatch.map(function (
                                    el,
                                    i
                                  ) {
                                    var o = Object.assign({}, el);
                                    o.BATCH_ID = d[i] ? d[i] : "";
                                    o.prdPStartDt = arrStartDt[i]
                                      ? arrStartDt[i]
                                      : "";
                                    o.prdPEndDt = arrEndDt[i]
                                      ? arrEndDt[i]
                                      : "";
                                    o.ddlWorkCenter = resArr[0]
                                      ? resArr[0].x
                                      : "";
                                    return o;
                                  });

                                  var dt = [];
                                  var sum = 5 + batchResult.length;
                                  for (let i = 0; i < sum; i++) {
                                    if (batchResult[i] != undefined) {
                                      dt.push(batchResult[i]);
                                    } else {
                                      dt.push({ id: i + 1 });
                                    }
                                  }

                                  setInsertTableData(dt);
                                  return;
                                } else {
                                  alertify.error("No Work Center Found !!");
                                }
                              }
                            });
                        }
                      })
                      .catch((error) => {});
                  }
                  //Call Batch multiple times
                } else {
                  setInsertTableData([
                    {},
                    ...[...Array(4)].map((it, i) => ({ id: i + 1 })),
                  ]);
                  setSumNetWt(0);
                  alertify.error("No Data Found");
                }
              }
            })
            .catch((error) => {})
            .finally((f) => {
              // Call Scrap Table
              var scarpUrl = "api/ttsm031/getScrapProductionTable";
              var d = {
                Plant: selectedPlant.value ? selectedPlant.value : "",
                MBatch: selMbatch ? selMbatch.value : "",
                Process: selectedProcess.value,
              };

              axiosAPI
                .post(scarpUrl, d, defaultOptions)
                .then((response) => {
                  if (
                    response.statusText != "" &&
                    response.statusText != "OK"
                  ) {
                  } else {
                    var result = response.data[1].map(function (el) {
                      var o = Object.assign({}, el);
                      o.ORDER_ID = pushBatch
                        ? pushBatch[0].EWI_ID_ORDER_CUS
                        : "";
                      o.ITEM = pushBatch
                        ? pushBatch[0].EWI_ID_ORD_ITEM_CUS
                        : "";
                      return o;
                    });
                    setScarpDt(result);
                  }
                })
                .finally((f) => {});
              // Call Scrap Table End
            });
        }
        if (tabValue == 2) {
          var url = "api/ttsm031/getBatchDtlforLP";
          if (selectedPlant == null) {
            alertify.error("Please select Plant");
            setLoading(false);
            return;
          }
          // if (selDbatch == null || selDbatch.length == 0) {
          //   alertify.error("Please select Daughter Batch");
          //   setLoading(false);
          //   return;
          // }
          var data = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            MBatch: selMbatch.value ? selMbatch.value : "",
            DBatch: selDbatch.value ? selDbatch.value : "",
          };

          axiosAPI
            .post(url, data, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                //reject(response.statusText);
              } else {
                if (response.data[1].length != 0) {
                  var res = response.data[1];
                  setModifyTableData([...res]);
                  setLoading(false);
                  setprintBtn(false);
                } else {
                  setModifyTableData([,]);
                  alertify.error("No Data Found");
                  setLoading(false);
                  setprintBtn(true);
                }
              }
            })
            .catch((error) => {
              setLoading(false);
            })
            .finally((f) => {
              setLoading(false);
            });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
      alertify.error("Please Select Plant!");
    }
  };

  const convertToDate = (str) => {
    try {
      var dateTimeArr = str.split(" ");
      var dateArr = dateTimeArr[0].split("/");
      var timeArr = dateTimeArr[1].split(":");
      var newDate = new Date(
        Number(dateArr[2]),
        Number(dateArr[1]) - 1,
        Number(dateArr[0]),
        Number(timeArr[0]),
        Number(timeArr[1])
      );
      return newDate;
    } catch {
      return null;
    }
  };

  const onClickOutside = (e) => {
    if (insertTable != null) {
      var selectedRows = insertTable.getSelectedRows();
      if (selectedRows.length == 0) {
        alertify.error("Please select Prime Production table rows");
        return;
      }
    }

    if (insertScrapTable != null) {
      var selectedRowsScrap = insertScrapTable.getSelectedRows();
      if (selectedRowsScrap.length == 0) {
        alertify.error("Please select Scrap Production table rows");
        return;
      }
    }
  };

  React.useEffect(() => {
    //added useEffect for hang issue --- sourav
    if (scheduleBtnSts == true) {
      gridtbl?.on("rowSelectionChanged", function (data, rows) {
        setWeightBtnSts(false);
        setSumNetWt(0);
        setSumSchWt(0);
        setInsertTableData([,]);
        setScarpDt([,]);
      });
    }
  }, [scheduleBtnSts, gridtbl]);

  if (insertScrapTable != null) {
    insertScrapTable.on("rowSelectionChanged", function (data, rows) {
      if (weightBtnSts == true) {
        setWeightBtnSts(false);
        setSumNetWt(0);
        setSumSchWt(0);
      }
    });
  }

  if (insertTable != null) {
    insertTable.on("rowSelectionChanged", function (data, rows) {
      if (weightBtnSts == true) {
        setWeightBtnSts(false);
        setSumNetWt(0);
        setSumSchWt(0);
      }
    });
  }

  const insertSlitProd = async () => {
    var selectedRows = insertTable.getSelectedRows();
    var selectedRowsScrap = insertScrapTable.getSelectedRows();
    var url = "api/ttsm031/insertSlitProd";
    var newData = [];
    var scrapData = [];

    var invalidRow = false;
    var errDateMissing = false;
    var errDateValid = false;
    var errReason = false;
    var errRemarks = false;
    var totalNetWt = 0;
    var resWtBalance = 0;
    var errDateValidchk = true;
    selectedRows.forEach(function (item) {
      var start = item._row.data.prdPStartDt;
      var end = item._row.data.prdPEndDt;
      if (!start || start == "") {
        alertify.error("Both production start and end dates are required !");
        invalidRow = true;
        errDateMissing = true;
      }
      if (!end || end == "") {
        alertify.error("Both production start and end dates are required !");
        invalidRow = true;
        errDateMissing = true;
      }

      var startDt = convertToDate(start);
      var endDt = convertToDate(end);

      var difference = endDt.getTime() - startDt.getTime();
      var resultInMinutes = Math.round(difference / 60000);
      // Reducing the time duration for Husor plant.
      //if (resultInMinutes < 30) {
      //if (resultInMinutes < 10) {
      //     errDateValidchk = false;
      //     alertify.error("Minimum activity duration should be more than 10 min ! ");
      //     return;
      //} else
      if (resultInMinutes < 0) {
        errDateValidchk = false;
        alertify.error(
          "Prod start date should be greater than prod end date ! "
        );
        return;
      } else if (resultInMinutes > 150) {
        errDateValidchk = false;
        alertify.error(
          "Maximum activity duration should not exceed 150 min ! "
        );
        return;
      }

      if (startDt > endDt) {
        alertify.error("Production end date cannot be prior to start date !");
        invalidRow = true;
        errDateValid = true;
      } else {
        var timeDiff = (endDt - startDt) / (1000 * 60 * 60); // time diff in hrs
        item._row.data.prdTimeDiff = timeDiff;
      }

      var rsnSelect = item._row.data.ddlRsnHold;
      if (!rsnSelect) {
        item.ddlRsnHold = "N";
      } else {
        if (rsnSelect == "Y") {
          var code = item._row.data.CD_HOLD;
          if (!code || code == "") {
            alertify.error("Please select reason");
            invalidRow = true;
            errReason = true;
          }
          var remarks = item._row.data.HOLD_OP_REMARKS;
          if (!remarks || remarks.length == 0) {
            alertify.error("Please fill operator remarks");
            invalidRow = true;
            errRemarks = true;
          }
        }
      }
      totalNetWt += Number(item._row.data.EWI_MS_PIECE_ACTL);
      newData.push(item._row.data);
    });

    if (errDateValidchk == false) {
      return;
    }

    selectedRowsScrap.forEach(function (item) {
      var rsnSelect = item._row.data.ddlRsnHold;
      if (!rsnSelect) {
        item.ddlRsnHold = "P1";
      } else {
        if (rsnSelect == "Y") {
          var code = item._row.data.CD_HOLD;
          if (!code || code == "") {
            alertify.error("Please select reason");
            invalidRow = true;
            errReason = true;
          }
        }
      }

      totalNetWt += Number(item._row.data.NET_WT);
      scrapData.push(item._row.data);
    });

    var batchDetails = gridData[0];
    var resWt_batchDtl = batchDetails.EOM_MS_GROSS_CAL;
    var scrpWt_batchDtl = batchDetails.EOM_MS_SCRAP;
    var schdlWt_batchDtl = batchDetails.SCHD_WT;

    setSumNetWt(totalNetWt);
    if (invalidRow) {
      if (errDateMissing) {
        alertify.error("Both production start and end dates are required !");
      }
      if (errDateValid) {
        alertify.error("Production end date cannot be prior to start date !");
      }
      if (errReason) {
        alertify.error("Please select reason");
      }
      if (errRemarks) {
        alertify.error("Please select remarks");
      }
      return;
    }

    resWtBalance = Number(scrpWt_batchDtl) - totalNetWt;
    if (resWtBalance < 0) {
      resWtBalance = 0;
    }
    var prdPDt = "";
    if (dateValue != null) {
      // var prdPDtStr = dateValue.toLocaleDateString('en-GB', {
      //     day: '2-digit', month: 'short', year: 'numeric'
      // });
      // prdPDt = prdPDtStr.replace('/', '-').replace('/', '-');
      var d = new Date(dateValue);
      prdPDt =
        ("0" + d.getDate()).slice(-2) +
        "-" +
        d.toString().substr(4, 3) +
        "-" +
        d.getFullYear();
    }

    var setBatchType = "";
    var selectedGridTable = gridtbl.getData();

    if (valueRadio == "M") {
      setBatchType = selectedGridTable[0].EOM_ID_BATCH;
    } else {
      var selectedRows = gridtbl.getSelectedRows();
      let d = selectedRows[0]._row.data.EOM_ID_BATCH;
      if (selMbatch.length != 0 || selMbatch.value != undefined) {
        setBatchType = selMbatch.value;
      } else {
        setBatchType = d;
      }
    }
    var data = {
      newData: newData,
      scrapData: scrapData,
      user: serverDetails.PersonalNo,
      Plant: selectedPlant.value ? selectedPlant.value : "",
      Batch: setBatchType, //Merge Batch/ Mother Batch
      Process: selectedProcess.value,
      ProdDate: prdPDt,
      Shift: selectedStatus.value,
      MBatch: selMbatch.value,
      BusUnit: "TUBES",
      Odia: selectOdia.value ? selectOdia.value : "",
      status: selectedStatus.value,
      order: "", //allValues.order,
      item: "", //allValues.item,
      totalNetWt: totalNetWt,
      resWt: resWtBalance,
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            setLoading(false);
            if (response.data) {
              var res = response.data.errorString.toString();
              if (res.toString().startsWith("N-")) {
                setShowSaveMsgSuccess(false);
                setShowSaveMsgError(true);
                setSaveMsg(res);
              } else {
                setShowSaveMsgSuccess(true);
                setShowSaveMsgError(false);
                setSaveMsg(res);
                setInsertTableData([,]);
                setScarpDt([,]);
                setGridData([,]);
              }
            } else {
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
              setSaveMsg("Error Occured !");
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
      setLoading(false);
    });
  };

  const checkWeightCalculation = async () => {
    debugger;
    var selectedRows = insertTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select Prime Production table rows");
      return;
    }
    var totalPrimeWt = 0;
    selectedRows.forEach(function (item) {
      totalPrimeWt += Number(item._row.data.EWI_MS_PIECE_ACTL);
    });

    let netWtScrap = 0;
    var selectedRowsScrap = insertScrapTable.getSelectedRows();

    var totalScrapWt = 0;
    selectedRowsScrap.forEach(function (item) {
      totalScrapWt += Number(item._row.data.NET_WT);
    });

    var sumPrimeScrap = Number(totalPrimeWt) + Number(totalScrapWt);
    var totalInputWt = 0;
    if (valueRadio == "M") {
      var selectedGridTable = gridtbl.getData();
      selectedGridTable.forEach(function (item) {
        totalInputWt += Number(item.PLAN_WT);
      });
    } else {
      var selectedGridTable = gridtbl.getSelectedRows();
      selectedGridTable.forEach(function (item) {
        totalInputWt += Number(item._row.data.PLAN_WT);
      });
    }

    var primeScrap = sumPrimeScrap.toFixed(3);
    var totalResWt = totalInputWt.toFixed(3);
    setSumSchWt(totalInputWt);
    setSumNetWt(totalPrimeWt);

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/ttsm031/getResqtyval";
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : null,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            debugger;
            var resqtyvalresp = Number(response.data[0][0]);
            if(primeScrap !=  totalResWt){
              alertify.error( "Sum of prime & Scrap(" + primeScrap + ") should match with Plan Wt(" + totalResWt + ")." );
              return;
            }
            if (selectedRowsScrap.length == 0) {
              alertify.confirm(
                "Scrap row is not selected , in this case scrap will not be posted. Will you continue without scrap ?",
                "",
                function () {
                  setSumSchWt(totalInputWt);
                  setSumNetWt(sumPrimeScrap);
                 
                  //totalInputWt= calculated res wt. (04.12.23)/ sumPrimeScrap <= totalInputWt
                  if (
                    totalResWt - primeScrap <= resqtyvalresp &&
                    totalResWt - primeScrap > 0
                  ) {
                    alertify.error( "Total Net wt(Prime + Scrap)(" + primeScrap + ") must be equal to Res wt(" + totalResWt + ")." );
                    setWeightBtnSts(false);
                    return;
                  } else if (totalResWt - primeScrap > resqtyvalresp || totalResWt == primeScrap) {
                    setWeightBtnSts(true);
                  } else {
                    alertify.error( "Total Net wt(Prime + Scrap)(" + primeScrap + ") must be equal to Res wt(" + totalResWt + ")." );
                    setWeightBtnSts(false);
                    return;
                  }
                },
                function () {
                  setWeightBtnSts(false);
                }
              );
            } else {
              setSumSchWt(totalInputWt);
              setSumNetWt(sumPrimeScrap);
             
              if (
                totalResWt - primeScrap <= resqtyvalresp &&
                totalResWt - primeScrap > 0
              ) {  
                alertify.error( "Total Net wt(Prime + Scrap)(" + primeScrap + ") must be equal to Res wt(" + totalResWt + ")." );
                setWeightBtnSts(false);
                return;
              } else if (totalResWt - primeScrap > resqtyvalresp || totalResWt == primeScrap) {
                setWeightBtnSts(true);
                return;
              } else {
                alertify.error( "Total Net wt(Prime + Scrap)(" + primeScrap + ") must be equal to Res wt(" + totalResWt + ")." );
                setWeightBtnSts(false);
                return;
              }
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  // const modifyCoil = async () => {
  //     var selectedRows = modifyTable.getSelectedRows();
  //     if (selectedRows.length == 0) {
  //         alertify.error("Please select table rows");

  //         return;
  //     }

  //     var url = "api/ttsm031/modifyCoilDetails";
  //     var newData = [];
  //     var invalidRow = false;
  //     var errDateMissing = false;
  //     var errDateValid = false;
  //     var errReason = false;
  //     var errRemarks = false;
  //     var totalNetWt = 0;
  //     var resWtBalance = 0;

  //     var batchDetails = gridData[0];

  //     var resWt_batchDtl = batchDetails.EOM_MS_GROSS_CAL;

  //     selectedRows.forEach(function (item) {
  //         {
  //             var remarks = item._row.data.HOLD_OP_REMARKS;
  //             if (!remarks || remarks.length == 0) {
  //                 //alertify.error("Please fill operator remarks");
  //                 invalidRow = true;
  //                 errRemarks = true;
  //             }
  //         }
  //         newData.push(item._row.data);
  //     });

  //     if (invalidRow) {
  //         if (errRemarks) {
  //             alertify.error("Please select remarks");
  //         }
  //         return;
  //     }
  //     setLoading(true);

  //     var prdPDt = "";
  //     if (dateValue != null) {
  //         var prdPDtStr = dateValue.toLocaleDateString('en-GB', {
  //             day: '2-digit', month: 'short', year: 'numeric'
  //         });
  //         prdPDt = prdPDtStr.replace('/', '-').replace('/', '-');

  //     }

  //     GetAuthorization().then((token) => {
  //         var defaultOptions = {
  //             headers: {
  //                 Authorization: "Bearer " + token.accessToken,
  //             },
  //         };
  //         var data = {
  //             newData: newData,
  //             user: serverDetails.PersonalNo,
  //             Plant: selectedPlant.value ? selectedPlant.value : "",
  //             resWt: resWt_batchDtl
  //         };

  //         axiosAPI
  //             .post(url, data, defaultOptions)
  //             .then((response) => {
  //                 if (response.statusText != "" && response.statusText != "OK") {
  //                     //reject(response.statusText);
  //                 } else {
  //                     if (response.data) {

  //                         var res = response.data.errorString.toString();
  //                         if (res.includes("Error")) {
  //                             setShowSaveMsgSuccess(false);
  //                             setShowSaveMsgError(true);
  //                             setSaveMsg(res);
  //                         }
  //                         else {
  //                             setShowSaveMsgSuccess(true);
  //                             setShowSaveMsgError(false);
  //                             setSaveMsg(res);
  //                         }

  //                     } else {
  //                         setShowSaveMsgSuccess(false);
  //                         setShowSaveMsgError(true);
  //                         setSaveMsg("Error Occured !");
  //                     }
  //                 }
  //             })
  //             .finally((f) => {
  //                 setLoading(false);
  //             });
  //     })
  // };

  const addInvScrap = async () => {
    insertTable.updateRow(1, { BATCH_ID: "1", EWI_CD_QLTY: "SCRP" });
    insertTable.updateRow(2, { BATCH_ID: "2", EWI_CD_QLTY: "INVL" });
  };

  const addInvScrapTbl = async () => {};

  var copyArr = [];

  const copyTable = async (cell) => {
    if (cell._cell.row.data.EWI_ID_ORDER_CUS != undefined) {
      copyArr = [];
      let dt = cell._cell.row.data;
      copyArr.push(dt);
      alertify.success("Copied!!");
      flagCopy = true;
    } else if (
      cell._cell.row.data.EWI_ID_ORDER_CUS == undefined &&
      flagCopy == false
    ) {
      alertify.error("Please click on row which you want to copy !!");
      flagCopy = false;
    } else {
      // if (productionType != "SFG") {
      //     alertify.error("Extra lot creation is not applicable for WIP Production");
      //     return;
      // };

      var array = insertTableData;
      var data = cell.getRow().getData();
      setSelectedCellPosition(cell._cell.row.position);
      var index = array.findIndex(({ id }) => id === cell._cell.row.data.id);

      if (dateValue != null) {
        // var prodDt = dateValue.toLocaleDateString('en-GB', {
        //     day: '2-digit', month: 'short', year: 'numeric'
        // }).replace(/ /g, '-');
        var d = new Date(dateValue);
        var prodDt =
          ("0" + d.getDate()).slice(-2) +
          "-" +
          d.toString().substr(4, 3) +
          "-" +
          d.getFullYear();
      } else {
        alertify.error("Please select Prod Dt for batch create");
        return;
      }

      setLoading(true);
      var url = "api/ttsm031/getBatchCount";
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        ProdDate: prodDt,
        MBatch: selMbatch.value,
        status: selectedStatus.value,
        Process: selectedProcess.value,
        count: cell._cell.row.position,
      };
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              array[index] = {
                id: cell._cell.row.position - 1,
                EWI_ID_WRK_INST: "", //insertTableData[0].EWI_ID_WRK_INST,
                BATCH_ID: response.data[0][0],
                EWI_ID_SCHEDULE: copyArr[0].EWI_ID_SCHEDULE,
                EWI_ID_ORDER_CUS: copyArr[0].EWI_ID_ORDER_CUS,
                EWI_ID_ORD_ITEM_CUS: copyArr[0].EWI_ID_ORD_ITEM_CUS,
                RM_PROD: copyArr[0].RM_PROD,
                EWI_CD_PROD: copyArr[0].EWI_CD_PROD,
                GRD_DESC: copyArr[0].GRD_DESC,
                EWI_CD_QLTY: copyArr[0].EWI_CD_QLTY,
                EWI_SEC1: copyArr[0].EWI_SEC1,
                NEXT_PROC: copyArr[0].NEXT_PROC,
                EWI_SEC2: copyArr[0].EWI_SEC2,
                EWI_LENGTH: copyArr[0].EWI_LENGTH,
                EWI_NO_PIECES: copyArr[0].EWI_NO_PIECES,
                EWI_MS_PIECE_ACTL: copyArr[0].EWI_MS_PIECE_ACTL,
                ddlWorkCenter: copyArr[0].ddlWorkCenter,
                EWI_MS_PIECE_ACTL: copyArr[0].EWI_MS_PIECE_ACTL,
                FG_MAT: copyArr[0].FG_MAT,
                FG_MAT_DESC: copyArr[0].FG_MAT_DESC,
                SFG_MAT: copyArr[0].SFG_MAT,
                RM_MAT: copyArr[0].RM_MAT,
                RM_MAT_DESC: copyArr[0].RM_MAT_DESC,
                ODIA: copyArr[0].ODIA,
                IDIA: copyArr[0].IDIA,
                SPEC: copyArr[0].SPEC,
                EWI_PLANNED_PROC: copyArr[0].EWI_PLANNED_PROC,
              };
              var table = cell._cell.row.table;
              table.replaceData(array);
              setInsertTableData(array);
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    }
  };

  const insertAt = (array, index, data) => {
    array.splice(index, 0, data);
  };

  //update total field in table
  const updateGrossWt = (props) => {
    setWeightBtnSts(false);
    //identify action row
    var cellData = props._cell.row.data;
    var rowId = cellData.BATCH_ID;
    var tempArray = insertTableData;
    //find row
    var result = tempArray.find((obj) => {
      return obj.BATCH_ID === rowId;
    });

    //calculate total
    var netWt = result.EWI_MS_PIECE_ACTL;
    var grossWt = netWt;
    result.GROSS_WT = grossWt;

    const index = tempArray.indexOf(result);
    if (index > -1) {
      tempArray.splice(index, 1);
    }

    insertAt(tempArray, index, result);
    var table = props._cell.row.table;
    table.replaceData(tempArray);
    //this.setState({dataRowsInventory:tempArray});
    return props._cell.row.data.EWI_MS_PIECE_ACTL;
  };

  const updateGrossWtScrap = (props) => {
    //identify action row
    var cellData = props._cell.row.data;
    var rowId = cellData.SCRAP_BATCH_ID;

    var tempArray = scarpDt;

    //find row
    var result = tempArray.find((obj) => {
      return obj.SCRAP_BATCH_ID === rowId;
    });

    //calculate total
    var netWt = result.NET_WT;
    var grossWt = netWt;
    result.GROSS_WT = grossWt;

    const index = tempArray.indexOf(result);
    if (index > -1) {
      tempArray.splice(index, 1);
    }

    insertAt(tempArray, index, result);
    var table = props._cell.row.table;
    table.replaceData(tempArray);
  };

  const rsnChange = async (cell, newToken) => {
    if (cell._cell.row.data.ddlRsnHold == "Y") {
      setSelectedCellPosition(cell._cell.row.position);
      setOpen(true);
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      var url = "api/ttsm031/getRsnDetails";
      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            setRsnListDt(response.data[1]);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    }
  };

  const getReasonList = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm031/getRsnDetails";
      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var tableItems = {};
            response.data.map((row) => {
              var rowArr = row.split(":");
              tableItems[rowArr[0]] = rowArr[0] + "--" + rowArr[1];
            });
            setReasonDetailsTable(tableItems);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  //scrap material api call
  const getScrapMatNo = async (plant, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm048/scrapmatno";
      var data = {
        plant: plant.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var items = {};
            response.data.map((row) => {
              var obj = new Object();
              var rowArr = row.split(":");
              obj.label = rowArr[0] + "-" + rowArr[1];
              obj.value = rowArr[0];
              items[obj.value] = obj.label;
            });
            setScrapMatDescList(items);
          }
        })
        .finally((f) => {
          resolve();
          return true;
        });
    });
  };

  //check for editable field
  var editCheckFGMat = function (cell) {
    var data = cell.getRow().getData();
    return data.EWI_CD_QLTY == "SCRP" || data.EWI_CD_QLTY == "INVL";
  };

  function formatTooltip(cell) {
    if (gridtbl != null) {
      let selectedTable = gridtbl.getData();
      var substr = /C/;
      var rollingLengthVal;
      var found = substr.test(selectedTable[0].EOM_PLANNED_PROC);
      if (found) {
        rollingLengthVal = `Math.round(6000 / LENGTH + 3) * LENGTH + 120`;
      } else {
        rollingLengthVal = `LENGTH * 1000`;
      }
      return rollingLengthVal;
    } else {
      return "";
    }
  }

  var editCheck = function (cell) {
    var isEditable = false;
    if (cell._cell.row.data.EWI_PLANNED_PROC == "MCKW") {
      isEditable = true;
    }
    return isEditable;
  };

  const insertColumns = [
    {
      title:
        '<input type="checkbox" class="select-all-row" aria-label="select all rows" />',
      field: "IsSelected",
      formatter: function (cell, formatterParams, onRendered) {
        return '<input type="checkbox" class="select-row" aria-label="select this row" />';
      },
      width: 50,
      headerSort: false,
      headerFilter: false,
      cssClass: "text-center",
      frozen: true,
      //tooltips: false,
      resizable: false,
      cellClick: function (e, cell) {
        var element = cell.getElement();
        var chkbox = element.querySelector(".select-row");

        if (cell.getData().IsSelected) {
          cell.getRow().deselect();
          document.querySelector(".select-all-row").checked = false;
        } else {
          cell.getRow().select();
          if (
            cell.getColumn().getTable().getSelectedRows().length ===
            cell.getColumn().getTable().getDataCount()
          ) {
            document.querySelector(".select-all-row").checked = true;
          }
        }
        chkbox.checked = !cell.getData().IsSelected;
        cell.getData().IsSelected = !cell.getData().IsSelected;
      },
      headerClick: function (e, column) {
        if (
          column.getTable().getSelectedRows().length !==
          column.getTable().getDataCount()
        ) {
          document
            .querySelectorAll(".select-row,.select-all-row")
            .forEach((cb) => (cb.checked = true));
          column.getTable().selectRow();
        } else {
          document
            .querySelectorAll(".select-row,.select-all-row")
            .forEach((cb) => (cb.checked = false));
          column.getTable().deselectRow();
        }
        column
          .getCells()
          .forEach(
            (cell) => (cell.getData().IsSelected = !cell.getData().IsSelected)
          );
      },
    },
    {
      field: "EWI_ID_WRK_INST",
      title: "ID PDI",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      frozen: true,
      // cellClick: function (e, cell) {
      //   {
      //     copyTable(cell, true);
      //   }
      // },
    },
    {
      field: "BATCH_ID",
      title: "Batch No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 150,
      frozen: true,
      cellClick: function (e, cell) {
        {
          //SLIT_BATCH_ID
          copyTable(cell, true);
        }
      },
    },

    {
      field: "EWI_ID_SCHEDULE",
      title: "Schedule Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      visible: false,
      frozen: true,
    },

    {
      field: "EWI_ID_ORDER_CUS",
      title: "Order Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      frozen: true,
    },
    {
      field: "EWI_ID_ORD_ITEM_CUS",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      field: "ODIA",
      title: "Odia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      field: "IDIA",
      title: "Idia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "Qlty",
      field: "EWI_CD_QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Grade",
      field: "EWI_NO_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Thick",
      field: "EWI_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      field: "EWI_SEC2",
      title: "Width/Odia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "EWI_LENGTH",
      title: "Length(m)",
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
    // {
    //   field: "rollingLength",
    //   title: "Rolling length(mm)",
    //   tooltip: formatTooltip,
    //   editable: editCheck,
    //   editor: "input",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   headerSort: false,
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     var rLength = 0;
    //     if (value == undefined) {
    //       var row = cell.getRow();
    //       // let selectedTable = gridtbl.getSelectedRows();
    //       let selectedTable = gridtbl.getData();
    //       var substr = /C/; //Finding CTL Process
    //       if (
    //         selectedTable.length != 0 &&
    //         cell._cell.row.data.EWI_LENGTH != undefined
    //       ) {
    //         // var found = substr.test(selectedTable[0]._row.data.EOM_PLANNED_PROC);
    //         var found = substr.test(selectedTable[0].EOM_PLANNED_PROC);
    //         if (found) {
    //           var d = parseFloat(cell._cell.row.data.EWI_LENGTH);
    //           rLength = ((6000 / (d + 3)) * d + 120).toFixed(3);
    //           row.update({
    //             rollingLength: rLength,
    //           });
    //           return rLength;
    //         } else {
    //           rLength = (
    //             parseFloat(cell._cell.row.data.EWI_LENGTH) * 1000
    //           ).toFixed(3);
    //           row.update({
    //             rollingLength: rLength,
    //           });
    //           return rLength;
    //         }
    //       }
    //     } else {
    //       return value;
    //     }

    //     return rLength;
    //   },
    //   cellEdited: (cell) => {
    //     var rl = cell._cell.row.data.rollingLength;
    //     var row = cell.getRow();
    //     row.update({
    //       rollingLength: rl,
    //     });
    //     return;
    //   },
    // },
    // {
    //   field: "EWI_NO_PIECES",
    //   title: "No of pcs",
    //   hozAlign: "right",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   headerSort: false,
    // editor: "input",
    // formatter: function (cell, formatterParams) {
    //   var value = cell.getValue();
    //   cell.getElement().style["background-color"] = "#DA8EE7";
    //   cell.getElement().style["color"] = "#FFFFFF";
    //   return value;
    // },
    // },
    {
      field: "EWI_MS_PIECE_ACTL",
      title: "Net Wt. " + qtyType + "",
      hozAlign: "right",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 150,
      editor: "input",
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        var value = cell.getValue();
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else if (value != "") {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        } else {
          return 0;
        }
      },
      //cellEdited: updateGrossWt,
      cellEdited: (cell) => {
        setWeightBtnSts(false);
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },

    {
      field: "prdPStartDt",
      title: "Prod Start Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 210,
      // editor: dateEditorLux,
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
    },
    {
      field: "prdPEndDt",
      title: "Prod End Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 210,
      // editor: dateEditorLux,
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
    },

    {
      field: "prdTimeDiff",
      title: "prdTimeDiff",
      visible: false,
      download: false,
    },
    {
      field: "ddlWorkCenter",
      title: "Work Center",
      hozAlign: "center",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "200",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: workCenter,
      },
      //formatter: "lookup",
      formatterParams: workCenter,
      // defaultValue: workCenter,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "NEXT_PROC",
      title: "Next Proc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: processListItemsTable,
      },
      //formatter: "lookup",
      formatterParams: processListItemsTable,
    },
    {
      field: "ddlRsnHold",
      title: "Hold Flag",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "select",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: [
          { label: "Y", value: "Y" },
          { label: "N", value: "N" },
        ],
      },
    },
    {
      field: "CD_HOLD",
      title: "Hold Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      minWidth: 200,
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: reasonDetailsTable,
      },
      //formatter: "lookup",
      formatterParams: reasonDetailsTable,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "HOLD_OP_REMARKS",
      title: "Operator Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      minWidth: 200,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "FG_MAT",
      title: "FG Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editable: editCheckFGMat,
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: scrapMatDescList,
      },
      //formatter: "lookup",
      formatterParams: scrapMatDescList,
    },
    {
      title: "FG Material Desc",
      field: "FG_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SFG_MAT",
      title: "SFG Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SFG_MAT_DESC",
      title: "SFG Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "RM_MAT",
      title: "RM Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "RM_MAT_DESC",
      title: "RM Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SPEC",
      title: "Spec",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const scrapColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    // {
    //     "title": "ID PDI", "field": "IDPDI", "headerFilter": "input", "headerFilterPlaceholder": "search...", width: 200, frozen: true, formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         cell.getElement().style["background-color"] = "#DA8EE7";
    //         cell.getElement().style["color"] = "#FFFFFF";
    //         return value;
    //     }
    // },
    {
      title: "Scrap Batch Id",
      field: "SCRAP_BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 250,
      frozen: true,
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
      frozen: true,
      width: 200,
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 100,
    },
    {
      title: "QLTY",
      field: "QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 200,
    },
    {
      title: "Net Wt. " + qtyType + "",
      field: "NET_WT",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 200,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else if (value != "") {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        } else {
          return 0;
        }
      },
      //cellEdited: updateGrossWtScrap,
      cellEdited: (cell) => {
        setWeightBtnSts(false);
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
  ];

  // const modifyColumns = [
  //   {
  //     formatter: "rowSelection",
  //     titleFormatter: "rowSelection",
  //     hozAlign: "center",
  //     download: false,
  //     headerSort: false,
  //     frozen: true,
  //   },
  //   // {
  //   //     "field": "EOM_ID_WRK_INST", "title": "ID PDI", "headerFilter": "input", "headerFilterPlaceholder": "search...",headerSort:false, frozen: true,
  //   // },
  //   {
  //     field: "EOM_ID_BATCH",
  //     title: "Batch No",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     width: 150,
  //     frozen: true,
  //   },
  //   // {
  //   //     "field": "EOM_ID_SCHEDULE", "title": "Schedule Id", "headerFilter": "input", "headerFilterPlaceholder": "search...",headerSort:false, visible:false, frozen: true,
  //   // },
  //   {
  //     field: "EOM_ID_ORDER_CUS",
  //     title: "Order Id",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     frozen: true,
  //     editor: "input",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       cell.getElement().style["background-color"] = "#DA8EE7";
  //       cell.getElement().style["color"] = "#FFFFFF";
  //       return value;
  //     },
  //   },
  //   {
  //     field: "EOM_ID_ORD_ITEM_CUS",
  //     title: "Item",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     editor: "number",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       cell.getElement().style["background-color"] = "#DA8EE7";
  //       cell.getElement().style["color"] = "#FFFFFF";
  //       return value;
  //     },
  //   },
  //   {
  //     field: "RM_PROD",
  //     title: "RM Prod Code",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //   },
  //   {
  //     field: "EOM_CD_PROD",
  //     title: "FG Prod",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //   },
  //   {
  //     title: "Qlty",
  //     field: "EOM_CD_QLTY",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //   },
  //   {
  //     title: "Grade",
  //     field: "GRD_DESC",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //   },
  //   {
  //     title: "Thick",
  //     field: "EOM_SEC1",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value;
  //     },
  //   },
  //   {
  //     field: "EOM_SEC2",
  //     title: "Width/Odia",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value;
  //     },
  //   },
  //   {
  //     field: "EOM_LENGTH",
  //     title: "Length",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       return value;
  //     },
  //   },
  //   {
  //     field: "EOM_NO_PIECES",
  //     title: "No of pcs",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     editor: "number",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       cell.getElement().style["background-color"] = "#DA8EE7";
  //       cell.getElement().style["color"] = "#FFFFFF";
  //       return value;
  //     },
  //   },
  //   {
  //     field: "EOM_MS_PIECE_ACTL",
  //     title: "Net Wt.",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     editor: "number",
  //     formatter: function (cell, formatterParams) {
  //       cell.getElement().style["background-color"] = "#DA8EE7";
  //       cell.getElement().style["color"] = "#FFFFFF";
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value;
  //     },
  //     //cellEdited: updateGrossWt,
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },
  //   {
  //     field: "EOM_MS_GROSS_ACTL",
  //     title: "Gross Wt.",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value;
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },

  //   {
  //     field: "prdPStartDt",
  //     title: "Prod Start Dt",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     width: 180,
  //   },
  //   {
  //     field: "prdPEndDt",
  //     title: "Prod End Dt",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     width: 180,
  //   },
  //   {
  //     field: "prdTimeDiff",
  //     title: "prdTimeDiff",
  //     visible: false,
  //     download: false,
  //   },
  //   {
  //     field: "EOM_CD_PREV_PROC",
  //     title: "Next Proc",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     //formatter: "lookup",
  //     formatterParams: processListItemsTable,
  //   },
  //   {
  //     field: "EOM_CD_CURR_PROC",
  //     title: "Next Proc",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     //formatter: "lookup",
  //     formatterParams: processListItemsTable,
  //   },
  //   {
  //     field: "EOM_CD_NEXT_PROC",
  //     title: "Next Proc",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     editor: "list",
  //     editorParams: {
  //       allowEmpty: false,
  //       showListOnEmpty: true,
  //       values: processListItemsTable,
  //     },
  //     //formatter: "lookup",
  //     formatterParams: processListItemsTable,
  //   },
  //   {
  //     field: "EOM_FL_HOLD",
  //     title: "Hold Flag",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //   },
  //   {
  //     field: "RSN_HOLD",
  //     title: "Rsn Hold",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     minWidth: 200,
  //   },
  //   {
  //     field: "HOLD_REMARKS",
  //     title: "Hold Operator Remarks",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     minWidth: 200,
  //   },
  //   {
  //     field: "HOLD_OP_REMARKS",
  //     title: "Production Operator Remarks",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     headerSort: false,
  //     minWidth: 200,
  //     editor: "input",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       cell.getElement().style["background-color"] = "#DA8EE7";
  //       cell.getElement().style["color"] = "#FFFFFF";
  //       return value;
  //     },
  //   },
  //   {
  //     field: "EOM_NO_MATNR",
  //     title: "FG Material",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "FG Material Desc",
  //     field: "MAT_DESC",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     field: "SFG_MAT",
  //     title: "SFG Material",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     field: "SFG_MAT",
  //     title: "SFG Material Desc",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     field: "RM_MAT",
  //     title: "RM Material",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     field: "RM_MAT_DESC",
  //     title: "RM Material Desc",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     field: "EOM_ODIA",
  //     title: "Odia",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     field: "EOM_IDIA",
  //     title: "Idia",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   { title: "UOM", field: "EOM_UOM" },
  // ];
  const modifyColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
      width: 50,
    },
    {
      field: "PLANT",
      title: "Plant",
      headerFilter: "input",
      frozen: true,
    },
    {
      field: "BATCHID",
      title: "Batch No",
      headerFilter: "input",
      frozen: true,
    },
    {
      field: "ORDERNO",
      title: "Order No",
      headerFilter: "input",
    },
    {
      field: "ORDERITEM",
      title: "Item",
      headerFilter: "input",
    },
    {
      field: "GRADE",
      title: "Grade",
      headerFilter: "input",
    },
    {
      field: "CD_STATUS",
      title: "Status",
      headerFilter: "input",
    },
    {
      field: "ODIA",
      title: "OD",
      headerFilter: "input",
      formatter: cell => {
        const value = cell.getValue();
        return value != null ? Number(value).toFixed(3) : "";
      },
    },
    {
      field: "THK",
      title: "Thickness",
      headerFilter: "input",
      formatter: cell => {
        const value = cell.getValue();
        return value != null ? Number(value).toFixed(3) : "";
      },
    },
    {
      field: "IDIA",
      title: "ID",
      headerFilter: "input",
      formatter: cell => {
        const value = cell.getValue();
        return value != null ? Number(value).toFixed(3) : "";
      },
    },
    {
      field: "LENGTH1",
      title: "Length",
      headerFilter: "input",
      formatter: cell => {
        const value = cell.getValue();
        return value != null ? Number(value).toFixed(3) : "";
      },
    },
    {
      field: "EOM_NO_PIECES",
      title: "No Of Pieces",
      headerFilter: "input",
      bottomCalc: "sum",
    },
    {
      field: "EOM_MS_GROSS_CAL_1",
      title: "Gross Wt (Ton)",
      headerFilter: "input",
      formatter: cell => {
        const value = cell.getValue();
        return value != null ? Number(value).toFixed(3) : "";
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "EOM_MS_GROSS_CAL",
      title: "Gross Wt (Kg)",
      headerFilter: "input",
      bottomCalc: "sum",
    },
    {
      field: "NEXT_PROC",
      title: "Next Proc",
      headerFilter: "input",
    },
    {
      field: "PROCESS_PATH_DESC",
      title: "Process Path",
      headerFilter: "input",
      minWidth: 180,
    },
    {
      field: "PARENT_BATCH",
      title: "Parent Batch",
      headerFilter: "input",
    },
    {
      field: "MOTHER_COIL",
      title: "Mother Coil",
      headerFilter: "input",
    },
    {
      field: "RM_MATERIAL",
      title: "RM Material",
      headerFilter: "input",
    },
    {
      field: "RM_MATERIAL_DESC",
      title: "RM Material Desc",
      headerFilter: "input",
      minWidth: 250,
    },
    {
      field: "SFG_MATERIAL",
      title: "SFG Material",
      headerFilter: "input",
    },
    {
      field: "SFG_MATERIAL_DESC",
      title: "SFG Material Desc",
      headerFilter: "input",
      minWidth: 250,
    },
    {
      field: "FG_MATERIAL",
      title: "FG Material",
      headerFilter: "input",
    },
    {
      field: "FG_MATERIAL_DESC",
      title: "FG Material Desc",
      headerFilter: "input",
      minWidth: 250,
    },
    {
      field: "EOM_TS_CREATION",
      title: "Creation Date",
      headerFilter: "input",
      width: 150,
    },
    {
      field: "TUBE_PROD_DT",
      title: "Tube Prod Date",
      headerFilter: "input",
      width: 150,
    },
    {
      field: "CUST_NM",
      title: "Customer",
      headerFilter: "input",
      minWidth: 250,
    },
    {
      field: "EWI_WRK_CENTER_NO",
      title: "Work center",
      headerFilter: "input",
      minWidth: 250,
    },
  ];

  const clearFilter = () => {
    setSelectedPlant([]);
    setSelectedProcess([]);
    setSelectMbatch([]);
    setSelectOdia([]);
    setSelectIdea([]);
    setAllValues({});
    setSelectedWorkCenter([]);
    setGridData([]);
    setInsertTableData([,]);
    setSumNetWt(0);
    setDateValue(null);
    setStartDateValue(null);
    setEndDateValue(null);
    setScarpDt([,]);
  };

  const clearFilterOnPlant = () => {
    setSelectedProcess([]);
    setSelectMbatch([]);
    setSelectOdia([]);
    setSelectIdea([]);
    setAllValues({});
    setMotherBatch([]);
    setGridData([]);
    setSelectedWorkCenter([]);
    setInsertTableData([,]);
    setSumNetWt(0);
    setDateValue(null);
    setStartDateValue(null);
    setEndDateValue(null);
    setScarpDt([,]);
  };

  const clearFilterOnDate = () => {
    setGridData([,]);
    setInsertTableData([,]);
    setScarpDt([,]);
  };

  const statusList = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
  ];

  const handleClickOpen = (cell) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    var rsnDt = selectedRsnModalTable.getSelectedRows();
    var selectedTable = insertTable.getData();
    if (rsnDt.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    var table = selectedTable;
    var index;
    var clickPos = cellPosition - 1;
    if (cellPosition !== null && cellPosition !== 1) {
      index = insertTableData.findIndex(({ id }) => id === clickPos);
    } else {
      index = 0;
    }
    var array = insertTableData;
    array[index] = {
      id: index,
      EWI_ID_WRK_INST: insertTableData[0].EWI_ID_WRK_INST,
      EWI_ID_SCHEDULE: insertTableData[0].EWI_ID_SCHEDULE,
      EWI_ID_ORDER_CUS: insertTableData[0].EWI_ID_ORDER_CUS,
      EWI_ID_ORD_ITEM_CUS: insertTableData[0].EWI_ID_ORD_ITEM_CUS,
      RM_PROD: insertTableData[0].RM_PROD,
      EWI_CD_PROD: insertTableData[0].EWI_CD_PROD,
      CD_HOLD: rsnDt[0]._row.data.CD_HOLD,
      CD_DESC: rsnDt[0]._row.data.CD_DESC,
      EWI_SEC2: insertTableData[0].EWI_SEC2,
      Qlty: insertTableData[0].Qlty,
      Thick: insertTableData[0].Thick,
      ddlRsnHold: "Y",
      NEXT_PROC: insertTableData[0].NEXT_PROC,
      EWI_LENGTH: insertTableData[0].EWI_LENGTH,
      EWI_NO_PIECES: insertTableData[0].EWI_NO_PIECES,
      EWI_MS_PIECE_ACTL: insertTableData[0].EWI_MS_PIECE_ACTL,
      EWI_MS_PIECE_ACTL: insertTableData[0].EWI_MS_PIECE_ACTL,
      FG_MAT: insertTableData[0].FG_MAT,
      FG_MAT_DESC: insertTableData[0].FG_MAT_DESC,
      SFG_MAT: insertTableData[0].SFG_MAT,
      RM_MAT: insertTableData[0].RM_MAT,
      RM_MAT_DESC: insertTableData[0].RM_MAT_DESC,
      ODIA: insertTableData[0].ODIA,
      IDIA: insertTableData[0].IDIA,
      GRD_DESC: insertTableData[0].GRD_DESC,
      EWI_CD_QLTY: insertTableData[0].EWI_CD_QLTY,
      EWI_SEC1: insertTableData[0].EWI_SEC1,
    };
    insertTable.replaceData(array);
    setInsertTableData(array);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    setInsertTableData([,]);
    setScarpDt([,]);
  };

  const checkScheduleType = async () => {
    var selectedRows = gridtbl.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select Schedule Details Table");
      return;
    }

    var totalInputWt = 0;
    let mrArr = [];
    let MutiRowDataSelectorConst = true;
    let selectedRowVar = {
      EOM_ID_BATCH: selectedRows[0]._row.data.EOM_ID_BATCH,
      INPUT_WT: selectedRows[0]._row.data.INPUT_WT,
      EOM_PLANNED_PROC: selectedRows[0]._row.data.EOM_PLANNED_PROC,
    };

    selectedRows.forEach(function (item) {
      totalInputWt += Number(item._row.data.INPUT_WT);
      let d = item._row.data.EOM_ID_BATCH.substring(0, 2);
      if (d == "MR") {
        mrArr.push(d);
      }

      if (
        selectedRowVar.EOM_ID_BATCH !== item._row.data.EOM_ID_BATCH ||
        selectedRowVar.INPUT_WT !== item._row.data.INPUT_WT ||
        selectedRowVar.EOM_PLANNED_PROC !== item._row.data.EOM_PLANNED_PROC
      ) {
        MutiRowDataSelectorConst = false;
      }
    });

    if (!MutiRowDataSelectorConst) {
      alertify.error(
        "Selected Batch Id, Plan Proc and Work Center should be same!"
      );
      return;
    }

    if (mrArr.length <= 1 || mrArr.length === 0) {
    } else {
      alertify.error("Only single merged batch can be processed at a time");
      return;
    }

    setSumSchWt(totalInputWt);
    setScheduleBtnSts(true);

    var sumScheduleWt = 0;
    selectedRows.forEach((item) => {
      sumScheduleWt += parseFloat(item._row.data.INPUT_WT);
    });

    if (selectedRows.length > 5) {
      alertify.error("Please select Only 5 Coils !!");
      return;
    }

    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });
    if (dateValue != null) {
      // var prodDt = dateValue.toLocaleDateString('en-GB', {
      //     day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-');
      var d = new Date(dateValue);
      var prodDt =
        ("0" + d.getDate()).slice(-2) +
        "-" +
        d.toString().substr(4, 3) +
        "-" +
        d.getFullYear();
    } else {
      alertify.error("Please select Prod Dt for batch create");
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      if (valueRadio == "M") {
        var check = selectedRows[0]._row.data.EOM_ID_BATCH.substring(0, 2);
        if (check == "MR") {
          var url = "/api/ttsm031/getPdiDtlMultiLot";
          var data = {
            newData: newData,
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Batch: selectedRows[0]._row.data.EOM_ID_BATCH,
            Process: selectedProcess.value,
            ProdDate: prodDt,
            MBatch: selectedRows[0]._row.data.EOM_ID_BATCH,
            BusUnit: "TUBES",
            Odia: selectOdia.value ? selectOdia.value : null,
            status: selectedStatus.value,
          };

          axiosAPI
            .post(url, data, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
              } else {
                if (response.data[1].length != 0) {
                  var res = response.data[1];

                  var url = "api/ttsm031/getBatchCount";
                  //Call Batch multiple times
                  var batchArr = [];
                  for (let i = 0; i < res.length; i++) {
                    var batchd = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      ProdDate: prodDt,
                      MBatch: selMbatch ? selMbatch.value : "",
                      status: selectedStatus.value,
                      Process: selectedProcess.value,
                      count: i + 1,
                    };
                    axiosAPI
                      .post(url, batchd, defaultOptions)
                      .then((res) => {
                        if (res.statusText != "" && res.statusText != "OK") {
                          //reject(response.statusText);
                        } else {
                          batchArr.push(res.data[0]);
                        }
                      })
                      .catch((error) => {});
                  }
                  //Call Batch multiple times

                  var pushBatch = res;
                  let q = pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
                  setQtyType(q);
                  // call work center api //
                  var url = "api/ttsm031/getWorkCenterDropdown";
                  var dataObj = {
                    Plant: selectedPlant.value ? selectedPlant.value : "",
                    Process: selectedProcess.value,
                    MatNo: pushBatch[0].SFG_MAT,
                    MBatch: selMbatch ? selMbatch.value : "",
                  };

                  axiosAPI
                    .post(url, dataObj, defaultOptions)
                    .then((response) => {
                      if (
                        response.statusText != "" &&
                        response.statusText != "OK"
                      ) {
                      } else {
                        let resArr = [];
                        var tableItems = {};
                        if (response.data) {
                          response.data.map((row) => {
                            var rowArr = row.split(":");
                            tableItems[rowArr[0]] = rowArr[0];
                          });
                          let keys = Object.keys(tableItems);
                          for (let i = 0; i < keys.length; i++) {
                            resArr.push({
                              x: keys[i],
                              y: workCenter[keys[i]],
                            });
                          }
                          setWorkCenter(tableItems);

                          var batchResult = pushBatch.map(function (el, i) {
                            var o = Object.assign({}, el);
                            o.BATCH_ID = batchArr[i] ? batchArr[i][0] : "";
                            o.ddlWorkCenter = resArr[0] ? resArr[0].x : "";
                            return o;
                          });

                          var dt = [];
                          var sum = 5 + batchResult.length;
                          for (let i = 0; i < sum; i++) {
                            if (batchResult[i] != undefined) {
                              dt.push(batchResult[i]);
                            } else {
                              dt.push({ id: i + 1 });
                            }
                          }
                          setInsertTableData(dt);
                        } else {
                          alertify.error("No Work Center Found !!");
                        }
                      }
                    })
                    .finally((f) => {});
                } else {
                  setInsertTableData([
                    {},
                    ...[...Array(4)].map((it, i) => ({ id: i + 1 })),
                  ]);
                  setSumNetWt(0);
                  alertify.error("No Data Found");
                }
              }
            })
            .finally((f) => {
              setLoading(false);
            });
        } else {
          var url = "/api/ttsm170/getMbatch";
          var iCoil = Array.prototype.map
            .call(selectedRows, function (item) {
              return item._row.data.EOM_ID_BATCH;
            })
            .join(",");

          var data = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            InputCoil: iCoil,
            coilLength: selectedRows.length,
            adid: serverDetails.PersonalNo,
            P_SCH_TYPE_FL: valueRadio,
          };

          if (selectedRows.length > 0) {
            axiosAPI
              .post(url, data, defaultOptions)
              .then((response) => {
                if (response.statusText != "" && response.statusText != "OK") {
                } else {
                  if (response.data) {
                    var check = response.data.substring(0, 1);
                    if (check == "Y") {
                      var str = response.data.slice(2);
                      var table = [];
                      selectedRows.forEach(function (item) {
                        table.push(item._row.data);
                      });
                      table.forEach((obj) => (obj["EOM_ID_BATCH"] = str));
                      gridtbl.replaceData(table);

                      var urlCrt = "/api/ttsm031/getCRTScheduleMerge";
                      var data = {
                        adid: serverDetails.PersonalNo,
                        PlanPath: selectedRows[0]._row.data.EOM_PLANNED_PROC, //Plan Proc
                        Plant: selectedPlant.value ? selectedPlant.value : "",
                        Process: selectedProcess.value
                          ? selectedProcess.value
                          : "",
                        ORD_ID: selectedRows[0]._row.data.CUST_ORD,
                        ORD_ITM: selectedRows[0]._row.data.CUST_ITEM,
                        ORD_QTY: sumScheduleWt, //selectedRows[0]._row.data.EOM_CD_QLTY_ACTL,
                        IDIA: selectedRows[0]._row.data.EOM_SEC1,
                        ODIA: selectedRows[0]._row.data.EOM_SEC2,
                        LENGTH: selectedRows[0]._row.data.EOM_LENGTH,
                        THICK: selectedRows[0]._row.data.EOM_SEC1,
                        GRADE: selectedRows[0]._row.data.GRADE,
                        MATNR: selectedRows[0]._row.data.FG_MATERIAL, // FG_Material
                        PROS_WT: sumScheduleWt,
                        GALVY_WT: 0,
                        rollchange: selectedRows[0]._row.data.WORK_CENTER,
                        MOTHER_BATCH: str,
                        CL_WT: sumScheduleWt,
                        CL_MATNR: selectedRows[0]._row.data.RM_MATERIAL, //RM_Material
                        FG_WT: sumScheduleWt,
                        P_SCH_TYPE_FL: valueRadio,
                        EOP_SFG_MATNR_BOM:
                          selectedRows[0]._row.data.SFG_MATERIAL, //SGF Material
                        P_NOMINATE_BATCH:
                          selectedRows[0]._row.data.EOM_ID_BATCH,
                        P_NOMINATE_MATNR: selectedRows[0]._row.data.RM_MATERIAL, //RM_Material
                      };

                      axiosAPI
                        .post(urlCrt, data, defaultOptions)
                        .then((response) => {
                          if (
                            response.statusText != "" &&
                            response.statusText != "OK"
                          ) {
                          } else {
                            if (response) {
                              var results = response.data.outBinds.LS_OUT_FLAG;
                              if (results) {
                                if (results.startsWith("Y-")) {
                                  setLoading(true);
                                  var url = "/api/ttsm031/getPdiDtlMultiLot";
                                  var data = {
                                    newData: newData,
                                    Plant: selectedPlant.value
                                      ? selectedPlant.value
                                      : "",
                                    Batch: str,
                                    Process: selectedProcess.value,
                                    ProdDate: prodDt,
                                    MBatch: str,
                                    BusUnit: "TUBES",
                                    Odia: selectOdia.value
                                      ? selectOdia.value
                                      : null,
                                    status: selectedStatus.value,
                                  };

                                  axiosAPI
                                    .post(url, data, defaultOptions)
                                    .then((response) => {
                                      if (
                                        response.statusText != "" &&
                                        response.statusText != "OK"
                                      ) {
                                      } else {
                                        if (response.data[1].length != 0) {
                                          var res = response.data[1];

                                          var url = "api/ttsm031/getBatchCount";
                                          //Call Batch multiple times
                                          var batchArr = [];
                                          for (let i = 0; i < res.length; i++) {
                                            var batchd = {
                                              Plant: selectedPlant.value
                                                ? selectedPlant.value
                                                : "",
                                              ProdDate: prodDt,
                                              MBatch: selMbatch
                                                ? selMbatch.value
                                                : "",
                                              status: selectedStatus.value,
                                              Process: selectedProcess.value,
                                              count: i + 1,
                                            };
                                            axiosAPI
                                              .post(url, batchd, defaultOptions)
                                              .then((res) => {
                                                if (
                                                  res.statusText != "" &&
                                                  res.statusText != "OK"
                                                ) {
                                                  //reject(response.statusText);
                                                } else {
                                                  batchArr.push(res.data[0]);
                                                }
                                              })
                                              .catch((error) => {});
                                          }

                                          //Call Batch multiple times
                                          var pushBatch = res;
                                          let q =
                                            pushBatch[0].EWI_UOM == "TO"
                                              ? "(Ton)"
                                              : "(Kg)";
                                          setQtyType(q);
                                          // call work center api //
                                          var url =
                                            "api/ttsm031/getWorkCenterDropdown";
                                          var dataObj = {
                                            Plant: selectedPlant.value
                                              ? selectedPlant.value
                                              : "",
                                            Process: selectedProcess.value,
                                            MatNo: pushBatch[0].SFG_MAT,
                                            MBatch: selMbatch
                                              ? selMbatch.value
                                              : "",
                                          };

                                          axiosAPI
                                            .post(url, dataObj, defaultOptions)
                                            .then((response) => {
                                              if (
                                                response.statusText != "" &&
                                                response.statusText != "OK"
                                              ) {
                                              } else {
                                                let resArr = [];
                                                var tableItems = {};
                                                if (response.data) {
                                                  response.data.map((row) => {
                                                    var rowArr = row.split(":");
                                                    tableItems[rowArr[0]] =
                                                      rowArr[0];
                                                  });
                                                  let keys =
                                                    Object.keys(tableItems);
                                                  for (
                                                    let i = 0;
                                                    i < keys.length;
                                                    i++
                                                  ) {
                                                    resArr.push({
                                                      x: keys[i],
                                                      y: workCenter[keys[i]],
                                                    });
                                                  }
                                                  setWorkCenter(tableItems);

                                                  var batchResult =
                                                    pushBatch.map(function (
                                                      el,
                                                      i
                                                    ) {
                                                      var o = Object.assign(
                                                        {},
                                                        el
                                                      );
                                                      o.BATCH_ID = batchArr[i]
                                                        ? batchArr[i][0]
                                                        : "";
                                                      o.ddlWorkCenter =
                                                        resArr[0]
                                                          ? resArr[0].x
                                                          : "";
                                                      return o;
                                                    });

                                                  var dt = [];
                                                  var sum =
                                                    5 + batchResult.length;
                                                  for (
                                                    let i = 0;
                                                    i < sum;
                                                    i++
                                                  ) {
                                                    if (
                                                      batchResult[i] !=
                                                      undefined
                                                    ) {
                                                      dt.push(batchResult[i]);
                                                    } else {
                                                      dt.push({ id: i + 1 });
                                                    }
                                                  }
                                                  setInsertTableData(dt);
                                                } else {
                                                  alertify.error(
                                                    "No Work Center Found !!"
                                                  );
                                                }
                                              }
                                            })
                                            .finally((f) => {});
                                        } else {
                                          setInsertTableData([
                                            {},
                                            ...[...Array(4)].map((it, i) => ({
                                              id: i + 1,
                                            })),
                                          ]);
                                          setSumNetWt(0);
                                          alertify.error("No Data Found");
                                        }
                                      }
                                    })
                                    .finally((f) => {
                                      setLoading(false);
                                    });
                                } else {
                                  alertify.error("Error create schedule");
                                }
                              } else {
                                alertify.error("Error!!!");
                              }
                            } else {
                              alertify.error("No Data Found");
                            }
                          }
                        })
                        .finally((f) => {
                          setLoading(false);
                        });
                    } else {
                      alertify.error("No mother batch found !");
                    }
                  } else {
                    alertify.error("No Data Found !");
                  }
                }
              })
              .finally((f) => {
                setLoading(false);
              });
          }
        }
      } else {
        setLoading(true);
        var url = "/api/ttsm031/getPdiDtlSingleLot";
        var data = {
          newData: newData,
          Plant: selectedPlant.value ? selectedPlant.value : "",
          Batch: selMbatch ? selMbatch.value : "",
          Process: selectedProcess.value,
          ProdDate: prodDt,
          MBatch: selMbatch ? selMbatch.value : "",
          BusUnit: "TUBES",
          Odia: selectOdia.value ? selectOdia.value : "",
          status: selectedStatus.value,
        };

        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              if (response.data[1].length != 0) {
                var res = response.data[1];

                var url = "api/ttsm031/getBatchCount";
                //Call Batch multiple times
                var batchArr = [];
                for (let i = 0; i < res.length; i++) {
                  var batchd = {
                    Plant: selectedPlant.value ? selectedPlant.value : "",
                    ProdDate: prodDt,
                    MBatch: selMbatch ? selMbatch.value : "",
                    status: selectedStatus.value,
                    Process: selectedProcess.value,
                    count: i + 1,
                  };
                  axiosAPI
                    .post(url, batchd, defaultOptions)
                    .then((res) => {
                      if (res.statusText != "" && res.statusText != "OK") {
                        //reject(response.statusText);
                      } else {
                        batchArr.push(res.data[0]);
                      }
                    })
                    .catch((error) => {});
                }

                //Call Batch multiple times
                var pushBatch = res;
                let q = pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
                setQtyType(q);
                // call work center api //
                var url = "api/ttsm031/getWorkCenterDropdown";
                var dataObj = {
                  Plant: selectedPlant.value ? selectedPlant.value : "",
                  Process: selectedProcess.value,
                  MatNo: pushBatch[0].SFG_MAT,
                  MBatch: selMbatch ? selMbatch.value : "",
                };

                axiosAPI
                  .post(url, dataObj, defaultOptions)
                  .then((response) => {
                    if (
                      response.statusText != "" &&
                      response.statusText != "OK"
                    ) {
                    } else {
                      if (response.data) {
                        let resArr = [];
                        var tableItems = {};
                        response.data.map((row) => {
                          var rowArr = row.split(":");
                          tableItems[rowArr[0]] = rowArr[0];
                        });
                        let keys = Object.keys(tableItems);
                        for (let i = 0; i < keys.length; i++) {
                          resArr.push({
                            x: keys[i],
                            y: workCenter[keys[i]],
                          });
                        }
                        setWorkCenter(tableItems);
                        var batchResult = pushBatch.map(function (el, i) {
                          var o = Object.assign({}, el);
                          o.BATCH_ID = batchArr[i] ? batchArr[i][0] : "";
                          o.ddlWorkCenter = pushBatch[0]
                            ? pushBatch[0].EWI_CAMP_NO
                            : "";
                          return o;
                        });

                        var dt = [];
                        var sum = 5 + batchResult.length;
                        for (let i = 0; i < sum; i++) {
                          if (batchResult[i] != undefined) {
                            dt.push(batchResult[i]);
                          } else {
                            dt.push({ id: i + 1 });
                          }
                        }
                        setInsertTableData(dt);
                      } else {
                        alertify.error("No Work Center Found !!");
                      }
                    }
                  })
                  .finally((f) => {
                    // Call Scrap Table
                    var scarpUrl = "api/ttsm031/getScrapProductionTable";
                    var d = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      MBatch: selMbatch ? selMbatch.value : "",
                      Process: selectedProcess.value,
                    };

                    axiosAPI
                      .post(scarpUrl, d, defaultOptions)
                      .then((response) => {
                        if (
                          response.statusText != "" &&
                          response.statusText != "OK"
                        ) {
                        } else {
                          var result = response.data[1].map(function (el) {
                            var o = Object.assign({}, el);
                            o.ORDER_ID = pushBatch
                              ? pushBatch[0].EWI_ID_ORDER_CUS
                              : "";
                            o.ITEM = pushBatch
                              ? pushBatch[0].EWI_ID_ORD_ITEM_CUS
                              : "";
                            return o;
                          });
                          setScarpDt(result);
                        }
                      })
                      .finally((f) => {});
                    // Call Scrap Table End
                  });
              } else {
                setInsertTableData([
                  {},
                  ...[...Array(4)].map((it, i) => ({ id: i + 1 })),
                ]);
                setSumNetWt(0);
                alertify.error("No Data Found");
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      }
      setLoading(false);
    });
  };
  const handelPrintLable = () => {

      var selectedRows = modifyTable.getSelectedRows();
      if (selectedRows.length !== 1) {
        alertify.error("Please select one row");
        return;
      }
      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });
      let content = "";
      newData.forEach((item) => {
        const labelDatahoney = [
          "INPUT OFF",
          "VERBOFF",
          "INPUT ON",
          "SYSVAR(48) = 0",
          'ERROR 15,"FONT NOT FOUND"',
          'ERROR 18,"DISK FULL"',
          'ERROR 26,"PARAMETER TOO LARGE"',
          'ERROR 27,"PARAMETER TOO SMALL"',
          'ERROR 37,"CUTTER DEVICE NOT FOUND"',
          'ERROR 1003,"FIELD OUT OF LABEL"',
          "SYSVAR(35)=0",
          'OPEN "tmp:setup.sys" FOR OUTPUT AS #1',
          'PRINT#1,"Printing,Media,Print Area,Media Margin (X),0"',
          'PRINT#1,"Printing,Media,Clip Default,On"',
          "CLOSE #1",
          'SETUP "tmp:setup.sys"',
          'KILL "tmp:setup.sys"',
          "CLIP ON",
          "CLIP BARCODE ON",
          "LBLCOND 3,2",
          "CLL",
          'OPTIMIZE "BATCH" ON',
          "PP74,380:AN7",
          "NASC 8",
          'FT "Univers Condensed Bold",19,0,74',
          'PT "TATA STEEL TUBES DIVISION HOSOUR ."',
          'PP52,181:FT "Univers Condensed Bold",9,0,136',
          'PT "Batch:"',
          'PP52,262:FT "Univers Condensed Bold",9,0,136',
          'PT "Width:"',
          'PP52,220:FT "Univers Condensed Bold",9,0,136',
          'PT "Thickness:"',
          'PP52,307:FT "Univers Condensed Bold",9,0,136',
          'PT "Grade:"',
          'PP52,93:FT "Univers Condensed Bold",9,0,136',
          'PT "Remark:"',
          'PP52,139:FT "Univers Condensed Bold",9,0,152',
          'PT "Weight:"',
          "PP47,317:AN1",
          "PL717,3",
          'PP153,306:AN7',
          'FT "Univers Condensed Bold",10,0,136',
          `PT "${item?.GRADE}"`,
          'PP143,263:FT "Univers Condensed Bold",10,0,136',
          `PT "${item?.ODIA}"`,
          'PP205,221:FT "Univers Condensed Bold",10,0,136',
          `PT "${item?.THK}"`,
          'PP164,180:FT "Univers Condensed Bold",10,0,136',
          `PT "${item?.BATCHID}"`,
          'PP178,140:FT "Univers Condensed Bold",10,0,136',
          `PT "${item?.EOM_MS_GROSS_CAL_1}"`,
          'PP179,94:FT "Univers Condensed Bold",10,0,136',
          `PT " "`,
          'PP52,49:FT "Univers Condensed Bold",10,0,129',
          'PT "M/C No:"',
          'PP403,271:FT "Univers Condensed Bold",10,0,136',
          'PT "Mother Batch:"',
          'PP403,228:FT "Univers Condensed Bold",10,0,121',
          'PT "Date & Shift:"',
          'PP403,311:FT "Univers Condensed Bold",10,0,136',
          'PT "SO No:"',
          'PP537,311:FT "Univers Condensed Bold",10,0,143',
          `PT "${item?.ORDERNO}"`,
          'PP612,271:FT "Univers Condensed Bold",10,0,107',
          `PT "${item?.PARENT_BATCH}"`,
          'PP584,227:FT "Univers Condensed Bold",9,0,120',
          `PT "${item?.TUBE_PROD_DT}"`,
          'PP178,47:FT "Univers Condensed Bold",10,0,136',
          `PT "${item?.EWI_WRK_CENTER_NO}"`,
          'PP610,175:BARSET "QRCODE",1,1,4,2,1',
          `PB "${item?.BATCHID},${item?.ODIA},${item?.THK},${item?.GRADE},${item?.EOM_MS_GROSS_CAL_1},${item?.ORDERNO},${item?.PARENT_BATCH}"`,
          'LAYOUT RUN ""',
          'PF',
          'PRINT KEY OFF'
        ];
        content += labelDatahoney.join("\r\n") + "\n\n";
      });

      const newWindow = window.open("", "_blank");
      newWindow.document.write("<html><head><title>Label Data</title></head><body><pre>");
      newWindow.document.write(content);
      newWindow.document.write("</pre></body></html>");
      newWindow.document.close();
    };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="HR/CR Scheduling"
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
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        ></BootstrapDialogTitle>
        <DialogContent>
          <div id="modalTable"></div>
          <Grid item xs={6}>
            <MDTypography
              fontWeight="regular"
              fontSize="small"
              textTransform="capitalize"
              variant="h6"
              color={"dark"}
              noWrap
            >
              Remarks{" "}
            </MDTypography>
            <MDInput
              name="remarks"
              value={allValues.remarks || ""}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {isRestricted == false && (
        <MDBox pt={1} pb={3} py={1}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={1}
                  mt={-2}
                  py={-0.25}
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
                      <MDTypography variant="h6" color="white">
                        {productionType} Production
                      </MDTypography>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title="Clear" arrow>
                        <IconButton color="white" onClick={() => clearFilter()}>
                          <ClearAllIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                <MDBox px={3} py={3}>
                  <Grid container spacing={1}>
                    <Grid item xs={2.5} style={{ zIndex: 5 }}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        Plant *{" "}
                      </MDTypography>
                      <ReactSelect
                        id="plant"
                        options={plant}
                        onChange={handlePlantChange}
                        value={selectedPlant}
                      />
                    </Grid>
                    <Grid item xs={1.5} style={{ zIndex: 5 }}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        Process *{" "}
                      </MDTypography>
                      <ReactSelect
                        id="process"
                        options={processListItems}
                        onChange={handleProcessChange}
                        value={selectedProcess}
                        disabled={tabValue == 2}
                      />
                    </Grid>
                    <Grid item xs={1.5} style={{ zIndex: 4 }}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        Work Center{" "}
                      </MDTypography>
                      <ReactSelect
                        id="wCenter"
                        options={wCenter}
                        onChange={handleWorkCenterChange}
                        value={selectedWorkCenter}
                        disabled={tabValue == 2}
                      />
                    </Grid>

                    <Grid item xs={1.5} style={{ zIndex: 5 }}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        Mother Batch *{" "}
                      </MDTypography>
                      <ReactSelect
                        id="batchIdMother"
                        options={motherBatch}
                        onChange={handleMotherBatchChange}
                        value={selMbatch}
                        disabled={tabValue == 2}
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
                        Prod Start Date *
                      </MDTypography>

                      <input
                        type="datetime-local"
                        style={{ height: "37px" }}
                        id="prodStartDate"
                        disabled={tabValue == 2}
                        onChange={(e) => {
                          var d = new Date(e.target.value);
                          var prodDt =
                            ("0" + d.getDate()).slice(-2) +
                            "-" +
                            d.toString().substr(4, 3) +
                            "-" +
                            d.getFullYear();
                          setDateValue(prodDt), clearFilterOnDate();
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
                        Prod End Date *
                      </MDTypography>

                      <input
                        type="datetime-local"
                        style={{ height: "37px" }}
                        id="prodEndDate"
                        disabled={tabValue == 2}
                        onChange={(e) => {
                          clearFilterOnDate();
                        }}
                      />
                    </Grid>

                    <Grid item xs={1.5} marginLeft={2}>
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
                      <MDInput name="Pdate" value={dateValue}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <p align="center">Action</p>
                      <AppBar position="static">
                        <Tabs
                          orientation={"horizontal"}
                          value={tabValue}
                          onChange={handleSetTabValue}
                          sx={{ "& .MuiTabs-flexContainer": { gap: "20px",},}}
                        >
                          <Tab label="Insert" />
                          <Tab label="Modify" disabled />
                          <Tab label="Generate Label" />
                        </Tabs>
                      </AppBar>
                    </Grid>

                    <Grid item xs={1.25}>
                      <MDButton
                        style={{ marginTop: "1.5rem" }}
                        size="small"
                        color="info"
                        onClick={() => getData(true)}
                      >
                        {" "}
                        Submit{" "}
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </Grid>

            {tabValue == 0 && (
              <>
                {selectedProcess != null && selectedProcess.value != "M" && (
                  <>
                    <Grid item xs={12}>
                      <div id="gridTable" />
                      <br />
                    </Grid>
                  </>
                )}

                {selectedProcess != null && selectedProcess.value == "M" && (
                  <>
                    <Grid item xs={12}>
                      <Card style={{ marginTop: "2rem" }}>
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
                            <Grid item xs={3}>
                              <MDTypography variant="h6" color="white">
                                Schedule Details (Total Schedule Wt. :{" "}
                                {sumSchWt.toFixed(3)} {qtyType}
                              </MDTypography>
                            </Grid>
                            <Grid item xs={1}>
                              <Tooltip title="Show Coil Details" arrow>
                                <IconButton
                                  disabled={!mergeSchedule}
                                  color="white"
                                  onClick={() => checkScheduleType(true)}
                                >
                                  <FormatListBulletedIcon />
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
                              <div id="gridTable" />
                            </Grid>
                          </Grid>
                        </MDBox>
                      </Card>
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-5}
                      py={0}
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
                        <Grid item xs={6}>
                          <MDTypography variant="h6" color="white">
                            Prime Production (Total Net Wt. :{" "}
                            {sumNetWt.toFixed(3)} {qtyType} )
                          </MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          {!weightBtnSts && (
                            <Tooltip title="Weight Calculation" arrow>
                              <IconButton
                                color="white"
                                onClick={() => checkWeightCalculation()}
                              >
                                <FunctionsIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {/* {setWeightBtnSts} */}

                          {weightBtnSts && (
                            <Tooltip title="Save" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => insertSlitProd(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
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
                          <div id="insertTableDiv" />

                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {insertTableData.length} of{" "}
                            {insertTableData.length} entries
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
                        <Grid item xs={1}></Grid>
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
              </>
            )}
            {tabValue == 1 && (
              <>
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
                            Record Production
                          </MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Save" arrow>
                            <IconButton
                              color="white"
                              disabled={isReadWriteAccess}
                              onClick={() => modifyCoil(true)}
                            >
                              <SaveIcon />
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
                          <div id="modifyTableDiv" />
                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {insertTableData.length} of{" "}
                            {insertTableData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              </>
            )}
            {tabValue == 2 && (
                <>
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
                              Recorded Production
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1.5}>
                            <Tooltip title="Download Label" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={printBtn}
                                  // onClick={() => handelDownloadLable()}
                                >
                                  <GetAppIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            {/* added for label printing */}
                            <Tooltip title="Print Label" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={printBtn}
                                  onClick={() => handelPrintLable()}
                                >
                                  <ReceiptIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="WIP Print Preview" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={printBtn}
                                  // onClick={() => handleLabelModalOpen("WIP")}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </span>
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
                            <div id="modifyTableDiv" />
                            <br />
                          </Grid>
                        </Grid>
                      </MDBox>
                      {/* Print Modal */}
                      <MDBox px={3} py={2}>
                        <Grid container>
                          <Grid item xs={12}>
                            {/* <TTSM004LabelModal
                              open={labelModalOpen !== null}
                              close={() => setLabelModalOpen(null)}
                              inputValues={accessLabelDialogData}
                              type={labelModalOpen}
                              plant={selectedPlant}
                            /> */}
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                </>
              )}
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
      )}
    </DashboardLayout>
  );
}
