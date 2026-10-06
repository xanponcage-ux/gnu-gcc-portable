import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useCallback,
} from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDAlert from "@mui/material/Alert";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ReactSelect from "components/Select/ReactSelect";
import Draggable from 'react-draggable';
import DatePicker from "components/DateTime/DatePickerDis";
import ReactToPrint from "react-to-print";
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
import LDSM004LabelModal from "./Modals/LDSM004LabelModal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import PrintIcon from "@mui/icons-material/Print";
import GetAppIcon from "@mui/icons-material/GetApp";
import FormHelperText from "@mui/material/FormHelperText";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import FunctionsIcon from "@mui/icons-material/Functions";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import TabIcon from "@mui/icons-material/Tab";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import moment from "moment";
import { DateTime } from "luxon";
import { GetAuthorization } from "utils";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CallSplitIcon from '@mui/icons-material/CallSplit';
import Paper, { PaperProps } from '@mui/material/Paper';


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

export default function LDSM004() {
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
  const [shift, setShift] = React.useState([]);
  const [dateValue, setDateValue] = useState(null);
  const [prevRecorder,setPrevRecorder] =useState(null);
  const [insertTable, setInsertTable] = useState(null);
  const [insertTableData, setInsertTableData] = React.useState([]);
  const [scarpDt, setScarpDt] = React.useState([]);
  const [modifyTableData, setModifyTableData] = React.useState([]);
  const [insertScrapTable, setInsertScrapTable] = useState(null);
  const [modifyTable, setModifyTable] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [gridData, setGridData] = useState([]);
  const [motherBatch, setMotherBatch] = useState([]);
  const [editableusers, setEditableUsers] = useState(false);
  const [userID,setUserID]= useState(null);
  const [daughterBatch, setDaughterBatch] = useState([]);
  const [gridtbl, setSelectedGridTable] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([
    { value: "A", label: "A" },
  ]);
  const [labelDialogData, setLabelDialogData] = useState([]);
  var customerTable = React.createRef();
  const [selectedRsnModalTable, setSelectRsnItemModal] = useState(null);
  const [rsnDt, setRsnListDt] = useState([]);

  const [intrmMatl, setIntrmMatl] = useState([]);
  const [openIM, setOpenIM] = React.useState(false);

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
  //const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [valueRadio, setValueRadio] = React.useState("S");
  const [Merge, setMergetype] = useState(true);
  const [mergeSchedule, setMergetypeSchedule] = useState(true);
  const [odiaUpdatedRow, setOdiaUpdatedRow] = useState(null);
  const [finalnetWtAllotP, setFinalnetWtAllotP] = useState(0);
  const [finalnetWtAllotS, setFinalnetWtAllotS] = useState(0);
  const [gridScheduleWt, setGridScheduleWt] = useState(0);
  const [chemBlock, setChemBlock] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(null);
  const [printBtn, setprintBtn] = useState(true);
  const [ProductName, setProductName] = useState("");
  const [tabValuem, setTabValuem] = useState(0);
  const handleSetTabValuem = (event, newValue) => {
    setTabValuem(newValue);
  };
  const [openTxt, setOpenTxt] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");

  const [revMerge, setRevMerge] = useState([]);
  const [selectRevMerge, setSelectRevMerge] = React.useState([]);

  var flagCopy = false;

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 0) {
      setSelectDbatch([]);
    }
  };

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
    getUserIdsEditableMass();
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

  // var dateEditorLux = function (
  //   cell,
  //   onRendered,
  //   success,
  //   cancel,
  //   editorParams
  // ) {
  //   //cell - the cell component for the editable cell
  //   //onRendered - function to call when the editor has been rendered
  //   //success - function to call to pass thesuccessfully updated value to Tabulator
  //   //cancel - function to call to abort the edit and return to a normal cell
  //   //editorParams - params object passed into the editorParams column definition property

  //   //create and style editor
  //   var editor = document.createElement("input");

  //   editor.setAttribute("type", "datetime-local");

  //   //create and style input
  //   editor.style.padding = "3px";
  //   editor.style.width = "100%";
  //   editor.style.boxSizing = "border-box";

  //   //Disable date
  //   var today = new Date();
  //   var day = today.getDate();
  //   // Set month to string to add leading 0
  //   var mon = new String(today.getMonth() + 1); //January is 0!
  //   var yr = today.getFullYear();
  //   if (mon.length < 2) {
  //     mon = "0" + mon;
  //   }
  //   if (day.length < 2) {
  //     day = "0" + day;
  //   }
  //   var date = new String(day + "/" + mon + "/" + yr);
  //   editor.disabled = false;
  //   editor.setAttribute("max", date);
  //   //Disable date

  //   //Set value of editor to the current value of the cell
  //   var cellVal = cell.getValue();
  //   if (cellVal) {
  //     editor.value = DateTime.fromFormat(
  //       cell.getValue(),
  //       "dd/MM/yyyy HH:mm"
  //     ).toFormat("yyyy-MM-dd HH:mm");
  //   } else {
  //     var today = DateTime.now().toFormat("dd/MM/yyyy HH:mm");
  //     editor.value = DateTime.fromFormat(today, "dd/MM/yyyy HH:mm").toFormat(
  //       "yyyy-MM-dd HH:mm"
  //     );
  //     //editor.value = DateTime.now().toISO();
  //   }

  //   //set focus on the select box when the editor is selected (timeout allows for editor to be added to DOM)
  //   onRendered(function () {
  //     editor.focus();
  //     editor.style.css = "100%";
  //   });

  //   //when the value has been set, trigger the cell to update
  //   function successFunc() {
  //     success(DateTime.fromISO(editor.value).toFormat("dd/MM/yyyy HH:mm"));
  //   }

  //   editor.addEventListener("change", successFunc);
  //   editor.addEventListener("blur", successFunc);
  //   //return the editor element
  //   return editor;
  // };

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
      insertTableData.length > 0
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
  }, [tabValue, insertTableData, scarpDt]);

  useEffect(() => {
    if (tabValue == 1 && modifyTableData && modifyTableData.length > 0) {
      setModifyTable(
        new Tabulator("#modifyTableDiv", {
          height: 400,
          data: modifyTableData,
          columns: modifyColumns,
        })
      );
    }
  }, [tabValue, modifyTableData]);

  var sumPrime = 0;
  var sumScrap = 0;
  var sumGrid = 0;
  function formatToOracleDate(date) {
    const year = date.getFullYear();
    let month = date.getMonth() + 1; // JavaScript months are 0-based
    let day = date.getDate();

    // Ensure month and day are two digits
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;

    // Construct Oracle date format string
    const oracleDate = year + '-' + month + '-' + day;

    return oracleDate;
}
  useEffect(() => {
    if (gridData.length != 0 && gridtbl != null) {
      gridtbl.on("rowSelectionChanged", function (data, rows) {
        var sum = 0;
        data.forEach((item) => {
          sum += parseFloat(item.SCHD_WT);
        });
        sumGrid = sum;
        console.log(sumGrid);
        setGridScheduleWt(sumGrid);
      });
    }

    if (insertTableData.length != 0 && insertTable != null) {
      insertTable.on("rowSelectionChanged", function (data, rows) {
        var sum = 0;
        data.forEach((item) => {
          if (!isNaN(item.EWI_MS_PIECE_ACTL)) {
            sum += parseFloat(item.EWI_MS_PIECE_ACTL);
          } else {
            alertify.error(item.EWI_MS_PIECE_ACTL + " Not an number");
            return;
          }
        });
        sumPrime = sum;
        console.log(sumPrime);
        setFinalnetWtAllotP(sumPrime);
      });
    }

    if (insertScrapTable != null && scarpDt?.length != 0) {
      insertScrapTable.on("rowSelectionChanged", function (data, rows) {
        var sum = 0;
        data?.forEach((item) => {
          if (!isNaN(item.NET_WT)) {
            sum += parseFloat(item.NET_WT);
          } else {
            alertify.error(item.NET_WT + " Not an number");
            return;
          }
        });
        sumScrap = sum;
        console.log("508",sumPrime);
        console.log("509",sumScrap);
        setFinalnetWtAllotS(sumScrap);
        //setFinalnetWtAllotP(sumPrime);
      });
    }
  }, [insertTable, insertScrapTable]);

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

  useEffect(() => {
    if (tabValue == 0 && intrmMatl && intrmMatl.length > 0) {
      setSelectRsnItemModal(
        new Tabulator("#modalTable", {
          height: 300,
          pagination: "local",
          paginationSize: 200,
          data: intrmMatl,
          columns: intrmMatlCLM,
        })
      );
    }
  }, [intrmMatl]);

  var intrmMatlCLM = [
    {
      title: "INTMDT MAT",
      field: "TIM_INTMDT_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }
  ];

  var rnsItmClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Size",
      field: "THK_LEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Multiple Length",
      field: "SFG_LEN",
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
    },
    {
      field: "LOM_ID_BATCH",
      title: "Mother Batch",
      width: 150,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "RM Material",
      field: "RM_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "RM Material Desc",
      field: "RM_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Grade",
      field: "GRADE",
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
      title: "Slit Width",
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
      title: "Schedule Wt. " + qtyType + "",
      field: "SCHD_WT",
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
      title: "Status",
      field: "LOM_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "FG Material Group",
      field: "PRINT_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Plan Proc",
      field: "LOM_PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Customer Name",
      field: "CUST_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },

    {
      title: "FG Material",
      field: "FG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "FG Material Desc",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Order",
      field: "CUST_ORD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Item",
      field: "CUST_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Cust No",
      field: "LOM_NO_CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material",
      field: "SFG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "SFG Material Desc",
      field: "SFG_MATERIAL_DESC",
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
      title: "Work Center",
      field: "WORK_CENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      field: "LOM_LENGTH",
      title: "Input Length",
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
      field: "LOM_TDC_ACTL",
      title: "M Batch TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      field: "INPUT_WT",
      title: "Input Wt. (Ton)",
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
      field: "PROC_WT",
      title: "Proc Wt. (Ton)",
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
      title: "Res Wt. (Ton)",
      field: "LOM_MS_GROSS_CAL",
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
      title: "Scrap Wt. (Ton)",
      field: "LOM_MS_SCRAP",
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
      title: "Schedule CRT Date",
      field: "SCHD_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Planning Remarks",
      field: "PLANNING_REMARKS",
      width: 200,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },

    {
      title: "Next Proc",
      field: "NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
    {
      title: "FG Thk",
      field: "ORD_THK",
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
      title: "FG Odia",
      field: "ORD_ODIA",
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
    { title: "FG Idia", field: "ORD_IDIA" },
    {
      title: "FG Length Min",
      field: "ORD_MIN_LENGTH",
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
      title: "FG Length Max",
      field: "ORD_MAX_LENGTH",
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
      title: "WRK INST",
      field: "EWI_ID_WRK_INST",
      headerFilter: "input",
      visible: false,
      headerFilterPlaceholder: "search...",

    },
    {
      title: "Order Qty (in sales Unit)",
      field: "SALES_QTY",
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
      field: "SALES_QTY_UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sales unit PCS(ERW)",
      field: "SALES_UNIT_PCS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

    },
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

  useEffect(() => {
    // This will run when `userID` changes
    console.log(userID);
    getUserIdsEditableMass();
    }, [userID]);

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
      var pageName = "LDSM004";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );
      console.log(serverDetails.PersonalNo);
      setUserID(serverDetails.PersonalNo);
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
      };
      var url = "api/common/getGroupPlant";
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
              getDaughterBatch(items[0], accessToken),
              getScrapMatNo(items[0], accessToken),
              getNoMergeDetails(items[0], accessToken),
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

      var url = "api/LDSM004/getProcess";
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
              obj.label = row[1];
              obj.value = row[0];
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

      var url = "api/LDSM004/getMCoilList";
      let data = {
        Plant: selectedPlant.value,
        Process: selectedProcess.value,
        workCenter: value ? value.value : "",
        radioType: valueRadio
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

      var url = "api/LDSM004/getMCoilList";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
        workCenter: "",
        radioType: valueRadio
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

  const getDaughterBatch = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM004/getDaugherCoil";
      let data = {
        Plant: value.value,
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
                var rowArr = row.split(":");
                obj.label = rowArr[0]; // + "-" + rowArr[1];
                obj.value = rowArr[0];
                items.push(obj);
              });
              setDaughterBatch(items);
            } else {
              resolve();
              //alertify.error("No Data Found");
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getODIA = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM004/getODIA";
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
      var url = "api/LDSM004/getShiftStatus";

      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            setSelectedStatus({
              value: response.data[0][0],
              label: response.data[0][0],
            });
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
          getDaughterBatch(value, token.accessToken),
          getScrapMatNo(value, token.accessToken),
          getNoMergeDetails(value, token.accessToken),
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
          getGorkCenterFilter(value, token.accessToken),
          getMotherBatchProcess(value, token.accessToken),
          getShift(token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const getNoMergeDetails = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM004/getNoMergeDetails";
      let data = {
        Plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            if (response.data.rows[0][0] == "MERGE") {
              setMergetype(false);
              setMergetypeSchedule(true);
            } else if (response.data.rows[0][0] == "NO-MERGE") {
              setMergetype(true);
              setMergetypeSchedule(false);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleWorkCenterChange = (value) => {
    setSelectedWorkCenter(value);
    if (value) {
      getMotherBatch(value);
      setGridData([,]);
      setInsertTableData([,]);
      setScarpDt([,]);
    }
  };

  const getGorkCenterFilter = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM004/getWorkCenter";
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
              var a = j;
              var d = a[0].split(",");
              var trim = d[0].split(/\s/).join("");
              item.push({ label: d[0] + "--" + d[1], value: trim });
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

      var url = "api/LDSM004/getProductionType";
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

  const handleRmageChange = (value) => {
    setSelectRevMerge(value);
  };

  const handleMotherBatchChange = (value) => {
    if (value) {
      setSelectMbatch(value);
      setGridData([,]);
      setInsertTableData([,]);
      setScarpDt([,]);
    } else {
      setSelectMbatch([]);
    }
  };

  const handleDaughterBatchChange = (value) => {
    if (value) {
      setSelectDbatch(value);
      setGridData([,]);
      setInsertTableData([,]);
      setScarpDt([,]);
      setModifyTableData([,]);
    } else {
      setSelectDbatch([]);
    }
  };

  const handleOdiaChange = (value) => {
    if (value) {
      setSelectOdia(value);
      setGridData([,]);
      setInsertTableData([,]);
      setScarpDt([,]);
    } else {
      setSelectOdia([]);
    }
  };

  async function callBatchArr(res, prodDt, defaultOptions) {
    var url = "api/LDSM004/getBatchCount";
    var batchArr = [];
    console.log("shift 1562",shift,shift);
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < res.length; i++) {
        var batchd = {
          Plant: selectedPlant.value ? selectedPlant.value : "",
          ProdDate: prodDt,
          MBatch: selMbatch ? selMbatch.value : "",
          status: shift ? shift : "",
          Process: selectedProcess.value,
          count: i,
        };
        
        await axiosAPI
          .post(url, batchd, defaultOptions)
          .then(async (resp) => {
            if (resp.statusText != "" && resp.statusText != "OK") {
            } else {
              batchArr.push(await resp.data[0][0]);
            }
          })
          .catch((error) => { });
      }
      resolve(batchArr);
    });
  }

  async function callBatchArrSingle(res, prodDt, mbatch, defaultOptions) {
    var url = "api/LDSM004/getBatchCount";
    console.log("shift 1580",shift,shift);
    var batchArr = [];
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < res.length; i++) {
        var batchd = {
          Plant: selectedPlant.value ? selectedPlant.value : "",
          ProdDate: prodDt,
          MBatch: selMbatch.value ? selMbatch.value : mbatch.LOM_ID_BATCH,
          status: shift ? shift : "",
          Process: selectedProcess.value,
          count: i,
        };
        await axiosAPI
          .post(url, batchd, defaultOptions)
          .then(async (resp) => {
            if (resp.statusText != "" && resp.statusText != "OK") {
            } else {
              batchArr.push(await resp.data[0][0]);
            }
          })
          .catch((error) => { });
      }
      resolve(batchArr);
    });
  }

  async function callBatchArrMulti(res, prodDt, defaultOptions) {
    var url = "api/LDSM004/getBatchCount";
    console.log("shift 1608",shift,shift);
    var batchArr = [];
    return new Promise(async (resolve, reject) => {
      for (let i = 0; i < res.length; i++) {
        var batchd = {
          Plant: selectedPlant.value ? selectedPlant.value : "",
          ProdDate: prodDt,
          MBatch: selMbatch.value ? selMbatch.value : res[i].BATCH_ID,
          status: shift ? shift : "",
          Process: selectedProcess.value,
          count: i,
        };
        await axiosAPI
          .post(url, batchd, defaultOptions)
          .then(async (resp) => {
            if (resp.statusText != "" && resp.statusText != "OK") {
            } else {
              batchArr.push(await resp.data[0][0]);
            }
          })
          .catch((error) => { });
      }
      resolve(batchArr);
    });
  }

  function generateDatabaseDateTime(date) {
    const p = new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
      }, {});

    return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}:${p.second}`;
  }


  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log(value);
      var url = "api/LDSM004/getTataDate";
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
            console.log(response.data?.[0]?.[0],response.data?.[0]?.[1]);
            
            setDateValue(response.data?.[0]?.[1]);
            setShift(response.data?.[0]?.[0]);
            setSelectedStatus(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };
  const getPrevRecorder = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log(value);
      var url = "api/LDSM004/getPrevRecorder";
      let data = {
        User: userID,
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
            let found = false;
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].includes(userID)) {
                found = true;
                break;
              }
            }
          
            if (found) {
              setPrevRecorder('Y');
            } else {
              setPrevRecorder('N');
            }
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };
  const getData = async () => {
    getPrevRecorder(userID);
    console.log(prevRecorder);
    if (selectedPlant != null) {
      setInsertTableData([,]);
      setSumNetWt(0);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(false);
      setSaveMsg("");
      setWeightBtnSts(false);
      setLoading(true);
      if (valueRadio == "S") {
        //setMergetypeSchedule(false);
      };

      if (valueRadio == "U" && !selMbatch.value) {
        alertify.error("Please select Mother Batch");
        setLoading(false);
        setGridData([,]);
        setInsertTableData([,]);
        setScarpDt([,]);
        return;
      };   


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

         
        var prodStartDateVal = document.getElementById("prodStartDate").value;
        var prodEndDateVal = document.getElementById("prodEndDate").value;
        var currentTime = new Date();

        // Step 2: Convert prodEndDateVal to a Date object
        var prodEndDateCheck = new Date(prodEndDateVal);

        // Step 3: Compare prodEndDate with the current time
        if (prodEndDateCheck > currentTime) {
          // Step 4: Display an error message using alertify.error
          alertify.error("The selected end date is greater than the current time.");
          setLoading(false);
          return;
        }
        if (new Date(prodStartDateVal) >= new Date(prodEndDateVal)) {
          alertify.error("Start time should be before end time");
          setLoading(false);
          return;
        }
        if (prevRecorder !== 'Y') {
          var hoursDifference = (currentTime - prodStartDateVal) / (1000 * 60 * 60);
          if (hoursDifference > 72) {
              alertify.error("Start date must be within 72 hours of the current time.");
              setLoading(false);
              return;
          }
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
        console.log(dateValue);
          if (dateValue != null) {
            var d = new Date(dateValue);
            var prodDt =
              ("0" + d.getDate()).slice(-2) +
              "-" +
              d.toString().substr(4, 3) +
              "-" +
              d.getFullYear();

            //======================
            var prodDtCheck = new Date(dateValue)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
              .replace(/ /g, "/");
            var datestr = prodDtCheck.split("/");
            var day = datestr[0];
            var month = datestr[1];
            var year = datestr[2];

            var currentdate = new Date();
            var cur_month = currentdate.getMonth() + 1;
            var cur_day = currentdate.getDate();
            var cur_year = currentdate.getFullYear();

            var oneDaysAgo = new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 1
            ).getDate();
            var twoDaysAgo = new Date(
              new Date().valueOf() - 1000 * 60 * 60 * 24 * 2
            ).getDate();

            var date = new Date(dateValue);
            var monthEndDay = new Date(
              date.getFullYear(),
              date.getMonth() + 0,
              0
            );
            var monthEndDate = monthEndDay.getDate();
            var c = cur_month - 1;
            if(prevRecorder =='Y' && month == cur_month && year ==cur_year){}
            else {
            if (cur_year == year ) {
              if (cur_month == month && cur_day == day) {
              } else if (oneDaysAgo == day) {
              } else if (twoDaysAgo == day) {
              } else if (day == cur_day || (day == monthEndDate && month == c)) {
              } else {
                alertify.error(
                  "Selected production date should be in current month or only last day production is possible in the previous month"
                );
                setLoading(false);
                return;
              }
            } else {
              alertify.error(
                "Selected production date should be in current month or only last day production is possible in the previous month"
              );
              setLoading(false);
              return;
            }
          }
         }else {
            alertify.error("Please select Prod Dt for batch create");
            setLoading(false);
            return;
          }
        

          if (selectedProcess.value != "M" && selMbatch == null) {
            alertify.error("Please select Mother Batch");
            setLoading(false);
            return;
          }

          var setPdidtForScrap;
          var urlbatchDtl = "api/LDSM004/getBatchDtl";
          var databatchDtl = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Batch: selMbatch ? selMbatch.value : "",
            ProcLine: selectedProcess ? selectedProcess.value : "",
            workcenter: selectedWorkCenter?.value
              ? selectedWorkCenter.value
              : null,
            recordType: valueRadio
          };

          axiosAPI
            .post(urlbatchDtl, databatchDtl, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                //reject(response.statusText);
              } else {
                if (response.data[1]) {
                  setPdidtForScrap = response.data[1];
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
          var urlpdi = "api/LDSM004/getPdiDtl";
          var datapdi = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Batch: selMbatch ? selMbatch.value : "",
            Process: selectedProcess.value,
            ProdDate: prodDt,
            MBatch: selMbatch ? selMbatch.value : "",
            BusUnit: "TUBES",
            Odia: selectOdia.value ? selectOdia.value : "",
            status: shift ? shift : "",
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
                  console.log("Hello 1853");
                  var res = response.data[1];
                  let a = new Date(prodStartDateVal);
                  let b = new Date(prodEndDateVal);
                  let dtDiff = (b - a) / 1000 / 60;

                  let batchCnt = response.data[1].length;
                  let dtAdd = parseInt(dtDiff / 1);
                  let arrStartDt = [];
                  let arrEndDt = [];
                  for (let i = 0; i < 1; i++) { ////  for just first row getting date otherwise batchcnt
                    let d1 = new Date(a);
                    d1.setMinutes(a.getMinutes() + dtAdd);
                    arrStartDt.push(generateDatabaseDateTime(new Date(a)));
                    arrEndDt.push(generateDatabaseDateTime(new Date(d1)));
                    console.log(arrEndDt,arrStartDt,d1);
                    a = d1;
                     }
                  pushBatch = res;
                   console.log(pushBatch);
                  if (res.length > 1) {
                    var batchArr = await callBatchArr(
                      res,
                      prodDt,
                      defaultOptions
                    );

                    let q = pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
                    setQtyType(q);

                    var d = {
                      plant: selectedPlant.value ? selectedPlant.value : "",
                      procPath: setPdidtForScrap[0].LOM_PLANNED_PROC,
                    };
                    var d2 = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      Process: selectedProcess.value,
                      MatNo: pushBatch[0].SFG_MAT,
                      MBatch: selMbatch.value,
                    };
                    var d3 = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      MBatch: selMbatch.value
                        ? selMbatch.value
                        : setPdidtForScrap[0].LOM_ID_BATCH,
                      Process: selectedProcess.value,
                    };
                    console.log(" hello  1901");
                    Promise.all([
                      axiosAPI.post(
                        "api/LDSM004/getpphProductName",
                        d,
                        defaultOptions
                      ),
                      axiosAPI.post(
                        "api/LDSM004/getWorkCenterDropdown",
                        d2,
                        defaultOptions
                      ),
                      axiosAPI.post(
                        "api/LDSM004/getScrapProductionTable",
                        d3,
                        defaultOptions
                      ),
                    ])
                      .then(
                        ([
                          getProductName,
                          getWorkCenterDropdown,
                          scrapProductionDt,
                        ]) => {

                          if (getProductName) {
                            setProductName(getProductName.data[0][0]);
                          }

                          if (getWorkCenterDropdown) {
                            if (getWorkCenterDropdown.data.length != 0) {
                              let resArr = [];
                              var tableItems = {};
                              if (getWorkCenterDropdown.data) {
                                getWorkCenterDropdown.data.map((row) => {
                                  var rowArr = row.split(":");
                                  tableItems[rowArr[0]] = rowArr[0];
                                });

                                setWorkCenter(tableItems);

                                var batchResult = pushBatch.map(function (
                                  el,
                                  i
                                ) {
                                  console.log("hello 1925");
                                  var o = Object.assign({}, el);
                                  o.BATCH_ID = batchArr[i] ? batchArr[i] : "";
                                  o.P_NAME = getProductName.data[0]
                                    ? getProductName.data[0][0]
                                    : "";
                                  o.EWI_SEC1 = el.EWI_SEC1.toFixed(3);
                                  o.EWI_SEC2 = el.EWI_SEC2
                                    ? el.EWI_SEC2.toFixed(3)
                                    : 0;
                                  o.EWI_LENGTH = el.EWI_LENGTH.toFixed(3);
                                  o.IDIA = el?.IDIA ? el.IDIA.toFixed(3) : 0;
                                  o.EWI_MS_PIECE_ACTL =
                                    el.EWI_MS_PIECE_ACTL.toFixed(3);
                                    o.ddlWorkCenter = pushBatch[i]
                                    ? pushBatch[i].EWI_CAMP_NO
                                    : "";
                                  o.NO_PASS = 0;
                                  o.prdPStartDt = arrStartDt[i]
                                ? arrStartDt[i]
                                : "";
                              o.prdPEndDt = arrEndDt[i] ? arrEndDt[i] : "";
                                  return o;
                                });
                                console.log("hello 1949");
                                let dt = [];
                                let sum = 24 + batchResult.length;
                                for (let i = 0; i < sum; i++) {
                                  if (batchResult[i] != undefined) {
                                    dt.push(batchResult[i]);
                                  } else {
                                    dt.push({ id: i + 1 });
                                  }
                                }
                                console.log("1978",dt);
                                setInsertTableData(dt);
                              } else {
                                alertify.error("No Work Center Found !!");
                              }
                            }
                          }

                          if (scrapProductionDt) {
                            if (scrapProductionDt.data[1].length != 0) {
                              var rs = scrapProductionDt.data[1].map(function (
                                el
                              ) {
                                var o = Object.assign({}, el);
                                o.P_NAME = getProductName.data[0]
                                  ? getProductName.data[0][0]
                                  : "";
                                o.ORDER_ID = pushBatch
                                  ? pushBatch[0].EWI_ID_ORDER_CUS
                                  : "";
                                o.ITEM = pushBatch
                                  ? pushBatch[0].EWI_ID_ORD_ITEM_CUS
                                  : "";
                                return o;
                              });
                              setScarpDt(rs);
                            } else {
                              setScarpDt([,]);
                            }
                          }
                        }
                      )
                      .finally(() => {
                        setLoading(false);
                      });
                  } else {
                    var dt1 = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      ProdDate: prodDt,
                      MBatch: selMbatch ? selMbatch.value : "",
                      status: shift ? shift : "",
                      Process: selectedProcess.value,
                      count: 0,
                    };

                    var dt2 = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      Process: selectedProcess.value,
                      MatNo: pushBatch[0].SFG_MAT,
                      MBatch: selMbatch.value,
                    };

                    var dt3 = {
                      Plant: selectedPlant.value ? selectedPlant.value : "",
                      MBatch: selMbatch.value
                        ? selMbatch.value
                        : setPdidtForScrap[0].LOM_ID_BATCH,
                      Process: selectedProcess.value,
                    };

                    var dt4 = {
                      plant: selectedPlant.value ? selectedPlant.value : "",
                      procPath: setPdidtForScrap[0].LOM_PLANNED_PROC,
                    };
                    console.log("shift 2160",shift,shift);
                    Promise.all([
                      axiosAPI.post(
                        "api/LDSM004/getBatchCount",
                        dt1,
                        defaultOptions
                      ),
                      axiosAPI.post(
                        "api/LDSM004/getWorkCenterDropdown",
                        dt2,
                        defaultOptions
                      ),
                      axiosAPI.post(
                        "api/LDSM004/getScrapProductionTable",
                        dt3,
                        defaultOptions
                      ),
                      axiosAPI.post(
                        "api/LDSM004/getpphProductName",
                        dt4,
                        defaultOptions
                      ),
                    ])
                      .then(
                        ([
                          batchCountDt,
                          workCenterDt,
                          scrapProductionDt,
                          getProductName,
                        ]) => {
                          var d;

                          if (batchCountDt) {
                            d = batchCountDt.data[0];
                            let q =
                              pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
                            setQtyType(q);
                          }

                          if (workCenterDt) {
                            var tableItems = {};
                            if (workCenterDt.data) {
                              workCenterDt.data.map((row) => {
                                var rowArr = row.split(":");
                                tableItems[rowArr[0]] = rowArr[0];
                              });

                              setWorkCenter(tableItems);

                              var batchResult = pushBatch.map(function (el, i) {
                                var o = Object.assign({}, el);
                                o.BATCH_ID = d[i] ? d[i] : "";
                                o.P_NAME = getProductName.data[0]
                                  ? getProductName.data[0][0]
                                  : "";
                                o.NO_PASS = 0;
                                o.EWI_SEC1 = el.EWI_SEC1.toFixed(3);
                                o.EWI_SEC2 = el.EWI_SEC2
                                  ? el.EWI_SEC2.toFixed(3)
                                  : 0;
                                o.EWI_LENGTH = el.EWI_LENGTH.toFixed(3);
                                o.IDIA = el?.IDIA ? el.IDIA.toFixed(3) : 0;
                                o.EWI_MS_PIECE_ACTL =
                                  el.EWI_MS_PIECE_ACTL.toFixed(3);
                                o.ddlWorkCenter = pushBatch[i]
                                  ? pushBatch[i].EWI_CAMP_NO
                                  : "";
                                  o.prdPStartDt = arrStartDt[i]
                                  ? arrStartDt[i]
                                  : "";
                                o.prdPEndDt = arrEndDt[i] ? arrEndDt[i] : "";
                                return o;
                              });

                              let dt = [];
                              let sum = 24 + batchResult.length;
                              for (let i = 0; i < sum; i++) {
                                if (batchResult[i] !== undefined) {
                                  dt.push(batchResult[i]);
                                } else {
                                  dt.push({ id: i + 1 });
                                }
                              }
                              console.log(dt);
                              setInsertTableData(dt);
                            } else {
                              alertify.error("No Work Center Found !!");
                            }
                          }

                          if (scrapProductionDt) {
                            if (scrapProductionDt.data[1].length != 0) {
                              var rs = scrapProductionDt.data[1].map(function (
                                el
                              ) {
                                var o = Object.assign({}, el);
                                o.P_NAME = getProductName.data[0]
                                  ? getProductName.data[0][0]
                                  : "";
                                o.ORDER_ID = pushBatch
                                  ? pushBatch[0].EWI_ID_ORDER_CUS
                                  : "";
                                o.ITEM = pushBatch
                                  ? pushBatch[0].EWI_ID_ORD_ITEM_CUS
                                  : "";
                                return o;
                              });
                              setScarpDt(rs);
                            } else {
                              setScarpDt([,]);
                            }
                          }

                          if (getProductName) {
                            setProductName(getProductName.data[0][0]);
                          }
                        }
                      )
                      .finally(() => {
                        setLoading(false);
                      });
                  }
                } else {
                  setInsertTableData([
                    {},
                    ...[...Array(24)].map((it, i) => ({ id: i + 1 })),
                  ]);
                  setSumNetWt(0);
                  alertify.error("No Data Found");
                }
              }
            })
            .catch((error) => {
              setLoading(false);
            });
        }
        if (tabValue == 1) {
          var url = "api/LDSM004/getBatchDtlforLP";
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
            MBatch: "",
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

  const callReverseUnmerge = async () => {
    var selectedRows = gridtbl.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select Schedule Details Table");
      return;
    }

    var motherBatchArr = [];
    selectedRows.forEach(function (item) {
      motherBatchArr.push(item._row.data.LOM_ID_BATCH);
    });

    setLoading(true);
    var url = "api/LDSM004/callUNMERGE";
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var data = {
        mBatchArr: motherBatchArr,
        user: serverDetails.PersonalNo,
        Plant: selectedPlant.value ? selectedPlant.value : "",
        ProcLine: selectedProcess ? selectedProcess.value : "",
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            setLoading(false);
            alertify.success(response.data.errorString);
            getData();
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const checkScheduleType = async () => {

    var selectedRows = gridtbl.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select Schedule Details Table");
      return;
    }
    var prodStartDateVal = document.getElementById("prodStartDate").value;
    var prodEndDateVal = document.getElementById("prodEndDate").value;
    var currentTime = new Date();

    // Step 2: Convert prodEndDateVal to a Date object
    var prodEndDateCheck = new Date(prodEndDateVal);
    let a = new Date(prodStartDateVal);
    let b = new Date(prodEndDateVal);
    let dtDiff = (b - a) / 1000 / 60;

    //let batchCnt = response.data[1].length;
    let dtAdd = parseInt(dtDiff / 1);
    let arrStartDt = [];
    let arrEndDt = [];
    for (let i = 0; i < 1; i++) { ////  for just first row getting date otherwise batchcnt
      let d1 = new Date(a);
      d1.setMinutes(a.getMinutes() + dtAdd);
      arrStartDt.push(generateDatabaseDateTime(new Date(a)));
      arrEndDt.push(generateDatabaseDateTime(new Date(d1)));
      console.log(arrEndDt,arrStartDt,d1);
      a = d1;
       }
    console.log("array start dt",arrStartDt,arrEndDt);
    

    var totalScheduleWt = 0;
    let mrArr = [];
    let MutiRowDataSelectorConst = true;

    let selectedRowVar = {
      WORK_CENTER: selectedRows[0]._row.data.WORK_CENTER,
      LOM_PLANNED_PROC: selectedRows[0]._row.data.LOM_PLANNED_PROC,
      LOM_SEC1: selectedRows[0]._row.data.LOM_SEC1,
      LOM_SEC2: selectedRows[0]._row.data.LOM_SEC2,
      GRADE: selectedRows[0]._row.data.GRADE,
      CUST_ORD: selectedRows[0]._row.data.CUST_ORD,
      CUST_ITEM: selectedRows[0]._row.data.CUST_ITEM,
      LOM_NO_CAST: selectedRows[0]._row.data.LOM_NO_CAST,
    };

    selectedRows.forEach(function (item) {
      totalScheduleWt += Number(item._row.data.SCHD_WT);
      let d = item._row.data.LOM_ID_BATCH.substring(0, 2);
      if (d == "MR") {
        mrArr.push(d);
      }
      //LDSM004 - In merging , thickness , od , grade , order, item should be same

      if (
        selectedRowVar.WORK_CENTER !== item._row.data.WORK_CENTER ||
        selectedRowVar.LOM_PLANNED_PROC !== item._row.data.LOM_PLANNED_PROC ||
        selectedRowVar.LOM_SEC1 !== item._row.data.LOM_SEC1 ||
        selectedRowVar.LOM_SEC2 !== item._row.data.LOM_SEC2 ||
        selectedRowVar.GRADE !== item._row.data.GRADE ||
        selectedRowVar.CUST_ORD !== item._row.data.CUST_ORD ||
        selectedRowVar.CUST_ITEM !== item._row.data.CUST_ITEM ||
        selectedRowVar.LOM_NO_CAST !== item._row.data.LOM_NO_CAST
      ) {
        MutiRowDataSelectorConst = false;
      }
    });

    if (!MutiRowDataSelectorConst) {
      alertify.error(
        "Selected Plan Proc, Work Center, Grade, Thickness, Cast No, Odia and Order Item should be same!"
      );
      return;
    }

    if (mrArr.length <= 1 || mrArr.length === 0) {
    } else {
      alertify.error("Only single merged batch can be processed at a time");
      return;
    }

    setSumSchWt(totalScheduleWt);
    setScheduleBtnSts(true);

    var sumScheduleWt = 0;
    selectedRows.forEach((item) => {
      sumScheduleWt += parseFloat(item._row.data.SCHD_WT);
    });

    if (selectedRows.length > 15) {
      alertify.error("Please select Only 15 Coils !!");
      return;
    }

    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });
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
        var check = selectedRows[0]._row.data.LOM_ID_BATCH.substring(0, 2);
        if (check == "MR") {

          var checkCnurl = '/api/LDSM004/getBatchstatuscn';
          var batArr = [];
          selectedRows.forEach((item) => {
            batArr.push(item._row.data.LOM_ID_BATCH)
          });

          var workInstArr = [];
          selectedRows.forEach((item) => {
            workInstArr.push(item._row.data.EWI_ID_WRK_INST)
          });

          var dtBatch = {
            coil: batArr,
            workInstNo: workInstArr,
            Plant: selectedPlant.value ? selectedPlant.value : "",
          };

          axiosAPI.post(checkCnurl, dtBatch, defaultOptions).then(async (response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {

              if (response.data == true) {
                var url = "/api/LDSM004/getPdiDtlMultiLot";
                var dmalti = {
                  newData: newData,
                  Plant: selectedPlant.value ? selectedPlant.value : "",
                  Batch: selectedRows[0]._row.data.LOM_ID_BATCH,
                  Process: selectedProcess.value,
                  ProdDate: prodDt,
                  MBatch: selectedRows[0]._row.data.LOM_ID_BATCH,
                  BusUnit: "TUBES",
                  Odia: selectOdia.value ? selectOdia.value : null,
                  status: shift ? shift : "",
                };

                axiosAPI.post(url, dmalti, defaultOptions).then(async (response) => {
                  if (response.statusText != "" && response.statusText != "OK") {
                  } else {
                    if (response.data[1].length != 0) {
                      var res = response.data[1];
                      var batchArr = await callBatchArrMulti(
                        res,
                        prodDt,
                        defaultOptions
                      );

                      var pushBatch = res;
                      let q = pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
                      setQtyType(q);

                      var dtmulti1 = {
                        Plant: selectedPlant.value ? selectedPlant.value : "",
                        Process: selectedProcess.value,
                        MatNo: pushBatch[0].SFG_MAT,
                        MBatch: selMbatch.value
                          ? selMbatch.value
                          : selectedRows[0]._row.data.LOM_ID_BATCH,
                      };

                      var dtmulti2 = {
                        Plant: selectedPlant.value ? selectedPlant.value : "",
                        MBatch: selMbatch.value
                          ? selMbatch.value
                          : selectedRows[0]._row.data.LOM_ID_BATCH,
                        Process: selectedProcess.value,
                      };

                      var dtmulti3 = {
                        plant: selectedPlant.value ? selectedPlant.value : "",
                        odia: pushBatch[0].EWI_SEC2,
                        order: pushBatch[0].EWI_ID_ORDER_CUS,
                        item: pushBatch[0].EWI_ID_ORD_ITEM_CUS,
                      };

                      Promise.all([
                        axiosAPI.post(
                          "api/LDSM004/getWorkCenterDropdown",
                          dtmulti1,
                          defaultOptions
                        ),
                        axiosAPI.post(
                          "api/LDSM004/getScrapProductionTable",
                          dtmulti2,
                          defaultOptions
                        ),
                        axiosAPI.post(
                          "api/LDSM004/getLengthList",
                          dtmulti3,
                          defaultOptions
                        ),
                      ])
                        .then(([workCenterDt, scrapProductionDt, getLengthList]) => {
                          if (workCenterDt) {
                            let resArr = [];
                            var tableItems = {};
                            if (workCenterDt.data) {
                              workCenterDt.data.map((row) => {
                                var rowArr = row.split(":");
                                tableItems[rowArr[0]] = rowArr[0];
                              });

                              setWorkCenter(tableItems);

                              var batchResult = pushBatch.map(function (el, i) {
                                var o = Object.assign({}, el);
                                o.NO_PASS = 0;
                                o.BATCH_ID = batchArr[i] ? batchArr[i] : "";
                                o.ddlWorkCenter = pushBatch[i]
                                  ? pushBatch[i].EWI_CAMP_NO
                                  : "";
                                o.EWI_SEC1 = el.EWI_SEC1.toFixed(3);
                                o.EWI_SEC2 = el.EWI_SEC2 ? el.EWI_SEC2.toFixed(3) : 0;
                                o.EWI_LENGTH = el.EWI_LENGTH.toFixed(3);
                                o.IDIA = el?.IDIA ? el.IDIA.toFixed(3) : 0;
                                o.EWI_MS_PIECE_ACTL = el.EWI_MS_PIECE_ACTL.toFixed(3);
                                o.prdPStartDt = arrStartDt[i]
                                ? arrStartDt[i]
                                : "";
                              o.prdPEndDt = arrEndDt[i] ? arrEndDt[i] : "";
                                return o;
                              });

                              let dt = [];
                              let sum = 24 + batchResult.length;
                              for (let i = 0; i < sum; i++) {
                                if (batchResult[i] != undefined) {
                                  dt.push(batchResult[i]);
                                } else {
                                  dt.push({ id: i + 1 });
                                }
                              }
                              console.log("2501",dt);
                              setInsertTableData(dt);
                            } else {
                              alertify.error("No Work Center Found !!");
                            }
                          }

                          if (scrapProductionDt) {
                            if (scrapProductionDt.data[1].length != 0) {
                              var rs = scrapProductionDt.data[1].map(function (el) {
                                var o = Object.assign({}, el);
                                o.ORDER_ID = pushBatch
                                  ? pushBatch[0].EWI_ID_ORDER_CUS
                                  : "";
                                o.ITEM = pushBatch
                                  ? pushBatch[0].EWI_ID_ORD_ITEM_CUS
                                  : "";
                                return o;
                              });
                              setScarpDt(rs);
                            } else {
                              setScarpDt([,]);
                            }
                          }

                          if (getLengthList) {
                          }
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    } else {
                      setInsertTableData([
                        {},
                        ...[...Array(24)].map((it, i) => ({ id: i + 1 })),
                      ]);
                      setSumNetWt(0);
                      alertify.error("No Data Found");
                    }
                  }
                });
              } else {
                alertify.error("Only CN Batch can merge")
              }
            }
          });


        } else {
          var checkCnurl = '/api/LDSM004/getBatchstatuscn';
          var batArr = [];
          selectedRows.forEach((item) => {
            batArr.push(item._row.data.LOM_ID_BATCH)
          });

          var workInstArr = [];
          selectedRows.forEach((item) => {
            workInstArr.push(item._row.data.EWI_ID_WRK_INST)
          });

          var dtBatch = {
            coil: batArr,
            workInstNo: workInstArr,
            Plant: selectedPlant.value ? selectedPlant.value : "",
          };
          axiosAPI.post(checkCnurl, dtBatch, defaultOptions).then(async (response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {

              if (response.data == true) {
                var url = "/api/LDSM004/getMbatch";
                var iCoil = Array.prototype.map
                  .call(selectedRows, function (item, index) {
                    return item._row.data.LOM_ID_BATCH + "-" + selectedRows[index]._row.data.EWI_ID_WRK_INST;
                  })
                  .join(",");

                var data = {
                  Plant: selectedPlant.value ? selectedPlant.value : "",
                  InputCoil: iCoil,
                  coilLength: selectedRows.length,
                  adid: serverDetails.PersonalNo,
                  P_SCH_TYPE_FL: valueRadio,
                };

                if (selectedRows.length > 1) {
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
                            table.forEach((obj) => (obj["LOM_ID_BATCH"] = str));
                            gridtbl.replaceData(table);

                            var sum = 0;
                            table.forEach((item) => {
                              sum += parseFloat(item.SCHD_WT);
                            });

                            setGridScheduleWt(sum);

                            var urlCrt = "/api/LDSM004/getCRTScheduleMerge";
                            var data = {
                              adid: serverDetails.PersonalNo,
                              PlanPath: selectedRows[0]._row.data.LOM_PLANNED_PROC, //Plan Proc
                              Plant: selectedPlant.value ? selectedPlant.value : "",
                              Process: selectedProcess.value
                                ? selectedProcess.value
                                : "",
                              ORD_ID: selectedRows[0]._row.data.CUST_ORD,
                              ORD_ITM: selectedRows[0]._row.data.CUST_ITEM,
                              ORD_QTY: sumScheduleWt, //selectedRows[0]._row.data.LOM_CD_QLTY_ACTL,
                              IDIA: selectedRows[0]._row.data.LOM_SEC1,
                              ODIA: selectedRows[0]._row.data.LOM_SEC2,
                              LENGTH: selectedRows[0]._row.data.LOM_LENGTH,
                              THICK: selectedRows[0]._row.data.LOM_SEC1,
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
                                selectedRows[0]._row.data.LOM_ID_BATCH,
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
                                        var url = "/api/LDSM004/getPdiDtlMultiLot";
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
                                          status: shift
                                            ? shift
                                            : "",
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
                                                console.log("shift 2802",shift);
                                                var url = "api/LDSM004/getBatchCount";
                                                //Call Batch multiple times
                                                var batchArr = [];
                                                for (let i = 0; i < res.length; i++) {
                                                  var batchd = {
                                                    Plant: selectedPlant.value
                                                      ? selectedPlant.value
                                                      : "",
                                                    ProdDate: prodDt,
                                                    MBatch: selMbatch.value
                                                      ? selMbatch.value
                                                      : res[0].BATCH_ID,
                                                    status: shift
                                                      ? shift
                                                      : "",
                                                    Process: selectedProcess.value,
                                                    count: i,
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
                                                    .catch((error) => { });
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
                                                  "api/LDSM004/getWorkCenterDropdown";
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
                                                            o.NO_PASS = 0;
                                                            o.BATCH_ID = batchArr[i]
                                                              ? batchArr[i][0]
                                                              : "";
                                                            o.EWI_SEC1 =
                                                              el.EWI_SEC1.toFixed(3);
                                                            o.EWI_SEC2 = el.EWI_SEC2
                                                              ? el.EWI_SEC2.toFixed(3)
                                                              : 0;
                                                            o.EWI_LENGTH =
                                                              el.EWI_LENGTH.toFixed(
                                                                3
                                                              );
                                                            o.IDIA = el?.IDIA
                                                              ? el.IDIA.toFixed(3)
                                                              : 0;
                                                            o.EWI_MS_PIECE_ACTL =
                                                              el.EWI_MS_PIECE_ACTL.toFixed(
                                                                3
                                                              );
                                                              o.prdPStartDt = arrStartDt[i]
                                                              ? arrStartDt[i]
                                                              : "";
                                                            o.prdPEndDt = arrEndDt[i] ? arrEndDt[i] : "";        
                                                            o.ddlWorkCenter =
                                                              pushBatch[i]
                                                                ? pushBatch[i]
                                                                  .EWI_CAMP_NO
                                                                : "";
                                                            return o;
                                                          });

                                                        let dt = [];
                                                        let sum =
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
                                                        console.log("hello 2827");
                                                        setInsertTableData(dt);
                                                      } else {
                                                        alertify.error(
                                                          "No Work Center Found !!"
                                                        );
                                                      }
                                                    }
                                                  })
                                                  .finally((f) => { });
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
                        // Call scarp table after show coil details exc //

                        var scarpUrl = "api/LDSM004/getScrapProductionTable";
                        var d = {
                          Plant: selectedPlant.value ? selectedPlant.value : "",
                          MBatch: selMbatch.value
                            ? selMbatch.value
                            : selectedRows[0]._row.data.LOM_ID_BATCH,
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
                              var result = response.data[1];
                              setScarpDt(result);
                            }
                          })
                          .finally((f) => { });
                        // Call scarp table after show coil details exc //
                      }
                    })
                    .finally((f) => {
                      setLoading(false);
                    });
                } else {
                  setLoading(false);
                  alertify.error("Single batch can't merge.");
                  return;
                }
              } else {
                alertify.error("Only CN Batch can merge")
              }
            }
          });
        }
      } else {
        setLoading(true);
        var url = "/api/LDSM004/getPdiDtlSingleLot";
        var datasl = {
          newData: newData,
          Plant: selectedPlant.value ? selectedPlant.value : "",
          Batch: selMbatch
            ? selMbatch.value
            : selectedRows[0]._row.data.LOM_ID_BATCH,
          Process: selectedProcess.value,
          ProdDate: prodDt,
          MBatch: selMbatch.value
            ? selMbatch.value
            : selectedRows[0]._row.data.LOM_ID_BATCH,
          BusUnit: "TUBES",
          Odia: selectOdia.value ? selectOdia.value : "",
          status: shift ? shift : "",
        };

        axiosAPI.post(url, datasl, defaultOptions).then(async (response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            if (response.data[1].length != 0) {
              var res = response.data[1];

              var batchArr = await callBatchArrSingle(
                res,
                prodDt,
                selectedRows[0]._row.data,
                defaultOptions
              );

              var pushBatch = res;
              let q = pushBatch[0].EWI_UOM == "TO" ? "(Ton)" : "(Kg)";
              setQtyType(q);

              var dtsl1 = {
                Plant: selectedPlant.value ? selectedPlant.value : "",
                Process: selectedProcess.value,
                MatNo: pushBatch[0].SFG_MAT,
                MBatch: selMbatch.value
                  ? selMbatch.value
                  : selectedRows[0]._row.data.LOM_ID_BATCH,
              };

              var dtsl2 = {
                Plant: selectedPlant.value ? selectedPlant.value : "",
                MBatch: selMbatch.value
                  ? selMbatch.value
                  : selectedRows[0]._row.data.LOM_ID_BATCH,
                Process: selectedProcess.value,
              };

              var dtsl3 = {
                plant: selectedPlant.value ? selectedPlant.value : "",
                odia: pushBatch[0].EWI_SEC2,
                order: pushBatch[0].EWI_ID_ORDER_CUS,
                item: pushBatch[0].EWI_ID_ORD_ITEM_CUS,
              };

              Promise.all([
                axiosAPI.post(
                  "api/LDSM004/getWorkCenterDropdown",
                  dtsl1,
                  defaultOptions
                ),
                axiosAPI.post(
                  "api/LDSM004/getScrapProductionTable",
                  dtsl2,
                  defaultOptions
                ),
                axiosAPI.post(
                  "api/LDSM004/getLengthList",
                  dtsl3,
                  defaultOptions
                ),
              ]).then(([workCenterDt, scrapProductionDt, getLengthList]) => {
                if (workCenterDt) {
                  if (workCenterDt.data) {
                    var tableItems = {};
                    workCenterDt.data.map((row) => {
                      var rowArr = row.split(":");
                      tableItems[rowArr[0]] = rowArr[0];
                    });

                    setWorkCenter(tableItems);

                    var batchResult = pushBatch.map(function (el, i) {
                      var o = Object.assign({}, el);
                      o.NO_PASS = 0;
                      o.BATCH_ID = batchArr[i] ? batchArr[i] : "";
                      o.EWI_SEC1 = el.EWI_SEC1.toFixed(3);
                      o.EWI_SEC2 = el.EWI_SEC2 ? el.EWI_SEC2.toFixed(3) : 0;
                      o.EWI_LENGTH = el.EWI_LENGTH.toFixed(3);
                      o.IDIA = el?.IDIA ? el.IDIA.toFixed(3) : 0;
                      o.EWI_MS_PIECE_ACTL = el.EWI_MS_PIECE_ACTL.toFixed(3);
                      o.prdPStartDt = arrStartDt[i]
                                ? arrStartDt[i]
                                : "";
                              o.prdPEndDt = arrEndDt[i] ? arrEndDt[i] : "";
                      o.ddlWorkCenter = pushBatch[i]
                        ? pushBatch[i].EWI_CAMP_NO
                        : "";
                      return o;
                    });

                    let dt = [];
                    let sum = 24 + batchResult.length;
                    for (let i = 0; i < sum; i++) {
                      if (batchResult[i] != undefined) {
                        dt.push(batchResult[i]);
                      } else {
                        dt.push({ id: i + 1 });
                      }
                    }
                    console.log("hello 3024");
                    setInsertTableData(dt);
                  } else {
                    alertify.error("No Work Center Found !!");
                  }
                }

                if (scrapProductionDt) {
                  if (scrapProductionDt.data[1].length != 0) {
                    var rs = scrapProductionDt.data[1].map(function (el) {
                      var o = Object.assign({}, el);
                      o.ORDER_ID = pushBatch
                        ? pushBatch[0].EWI_ID_ORDER_CUS
                        : "";
                      o.ITEM = pushBatch
                        ? pushBatch[0].EWI_ID_ORD_ITEM_CUS
                        : "";
                      return o;
                    });
                    setScarpDt(rs);
                  } else {
                    setScarpDt([,]);
                  }
                }

                if (getLengthList) {
                }
              });
            } else {
              setInsertTableData([
                {},
                ...[...Array(24)].map((it, i) => ({ id: i + 1 })),
              ]);
              setSumNetWt(0);
              alertify.error("No Data Found");
            }
          }
        });
      }
      setLoading(false);
    });
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

  const insertCoil = async () => {
    //console.log(shift,shift);
    if (shift == null ) {
      alertify.error("Please select Shift");
      setLoading(false);
      return;
    }

    var selectedRowsPrime = insertTable.getSelectedRows();
    if (selectedRowsPrime.length == 0) {
      alertify.error("Please select Prime Production table rows");
      return;
    }
    var totalPrimeWt = 0;
    selectedRowsPrime.forEach(function (item) {
      if(item._row.data.EWI_MS_PIECE_ACTL < 5)
       {alertify.error("Prime Batch mass can't be less than 5");
       return;}
      totalPrimeWt += Number(item._row.data.EWI_MS_PIECE_ACTL);
    });

    let netWtScrap = 0;
    var selectedRowsScrapWt = insertScrapTable.getSelectedRows();

    var totalScrapWt = 0;
    selectedRowsScrapWt.forEach(function (item) {
      totalScrapWt += Number(item._row.data.NET_WT);
    });

    var sumPrimeScrap = totalPrimeWt + totalScrapWt;
    var totalScheduleWt = 0;
    if (valueRadio == "M") {
      var selectedGridTable = gridtbl.getData();
      selectedGridTable.forEach(function (item) {
        totalScheduleWt += Number(item.SCHD_WT);
      });
    } else {
      var selectedGridTable = gridtbl.getSelectedRows();
      selectedGridTable.forEach(function (item) {
        totalScheduleWt += Number(item._row.data.SCHD_WT);
      });
    }

    setSumSchWt(totalScheduleWt);
    setSumNetWt(totalPrimeWt);

    if (sumPrimeScrap.toFixed(3) == totalScheduleWt.toFixed(3)) {
      setWeightBtnSts(true);
    } else {
      alertify.error(
        "Tota net wt(Prime + Scrap) must be equal to schedule wt."
      );
      setWeightBtnSts(false);
      return;
    }
    //====================================
    var selectedRows = insertTable.getSelectedRows();
    var selectedRowsScrap = insertScrapTable.getSelectedRows();

    var url = "api/LDSM004/insertCoilDetails";
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
    var checkNetWt = true;

    selectedRows.forEach(function (item) {
      var start = item._row.data.prdPStartDt;
      var end   = item._row.data.prdPEndDt;
      console.log(start,end);
      if (parseFloat(item._row.data.EWI_MS_PIECE_ACTL) >= 0.1) {
      } else {
        checkNetWt = false;
        return;
      }

      // if (!start || start == "") {
      //   alertify.error("Both production start and end dates are required !");
      //   invalidRow = true;
      //   errDateMissing = true;
      // }
      // if (!end || end == "") {
      //   alertify.error("Both production start and end dates are required !");
      //   invalidRow = true;
      //   errDateMissing = true;
      // }

      var startDt = convertToDate(start);
      var endDt = convertToDate(end);

      // let milliseconds = Math.abs(startDt - endDt);
      // let hours = milliseconds / 36e5;
      // if (hours > 24) {
      //     alertify.error("Production start date and end date must different 24 hours ! ");
      //     return;
      // }

      // var difference = endDt?.getTime() - startDt?.getTime();
      // var resultInMinutes = Math.round(difference / 60000);

      // if (resultInMinutes < 10) {
      //   errDateValidchk = false;
      //   alertify.error(
      //     "Minimum activity duration should be more than 10 min ! "
      //   );
      //   return;
      // } else if (resultInMinutes > 600) {
      //   errDateValidchk = false;
      //   alertify.error(
      //     "Maximum activity duration should not exceed 600 min ! "
      //   );
      //   return;
      // }

      // if (startDt > endDt) {
      //   alertify.error("Production end date cannot be prior to start date !");
      //   invalidRow = true;
      //   errDateValid = true;
      // } else {
      //   var timeDiff = (endDt - startDt) / (1000 * 60 * 60); // time diff in hrs
      //   item._row.data.prdTimeDiff = timeDiff;
      // }

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

      if (parseFloat(item._row.data.NET_WT) >= 0.1) {
      } else {
        checkNetWt = false;
        return;
      }

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

    if (checkNetWt == false) {
      alertify.error("Selected row Net Wt. should more than 0");
      return;
    }

    var batchDetails = gridData[0];
    var resWt_batchDtl = batchDetails.LOM_MS_GROSS_CAL;
    var scrpWt_batchDtl = batchDetails.LOM_MS_SCRAP;
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

    var d = new Date(dateValue);
    var prdPDt =
      ("0" + d.getDate()).slice(-2) +
      "-" +
      d.toString().substr(4, 3) +
      "-" +
      d.getFullYear();

    var setBatchType = "";
    var selectedGridTable = gridtbl.getData();

    var checkFlag = false;
    selectedGridTable.forEach(function (item) {
      if (item.NEXT_PROC && item.FG_MATERIAL && item.SFG_MATERIAL) {
        checkFlag = true;
      }
    });

    if (!checkFlag && selectedProcess.value=='M') {
      alertify.error(
        "FG, SFG and Next Process required for create schedule !!!"
      );
      return;
    }

    if (valueRadio == "M") {
      setBatchType = selectedGridTable[0].LOM_ID_BATCH;
    } else {
      var selectedRows = gridtbl.getSelectedRows();
      let d = selectedRows[0]._row.data.LOM_ID_BATCH;
      if (selMbatch.length != 0 || selMbatch.value != undefined) {
        setBatchType = selMbatch.value;
      } else {
        setBatchType = d;
      }
    }
    //console.log(shift,shift);
    var data = {
      newData: newData,
      scrapData: scrapData,
      user: serverDetails.PersonalNo,
      Plant: selectedPlant.value ? selectedPlant.value : "",
      Batch: setBatchType, //Merge Batch/ Mother Batch
      Process: selectedProcess.value,
      ProdDate: prdPDt,
      Shift: shift ? shift : "",
      MBatch: selMbatch.value,
      BusUnit: "TUBES",
      Odia: selectOdia.value ? selectOdia.value : "",
      status: shift ? shift : "",
      order: "", //allValues.order,
      item: "", //allValues.item,
      totalNetWt: totalNetWt,
      resWt: resWtBalance,
      recordTyp: valueRadio,
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
              if (res.includes("N-")) {
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

    var sumPrimeScrap = totalPrimeWt + totalScrapWt;
    var totalScheduleWt = 0;
    if (valueRadio == "M") {
      var selectedGridTable = gridtbl.getData();
      selectedGridTable.forEach(function (item) {
        totalScheduleWt += Number(item.SCHD_WT);
      });
    } else {
      var selectedGridTable = gridtbl.getSelectedRows();
      selectedGridTable.forEach(function (item) {
        totalScheduleWt += Number(item._row.data.SCHD_WT);
      });
    }

    setSumSchWt(totalScheduleWt);
    setSumNetWt(totalPrimeWt);

    if (selectedRowsScrap.length == 0) {
      alertify.confirm(
        "Scrap row is not selected , in this case scrap will not be posted. Will you continue without scrap ?",
        "",
        function () {
          setSumSchWt(totalScheduleWt);
          setSumNetWt(sumPrimeScrap);
          if (sumPrimeScrap.toFixed(3) == totalScheduleWt.toFixed(3)) {
            setWeightBtnSts(true);
          } else {
            alertify.error(
              "Tota net wt(Prime + Scrap) must be equal to schedule wt."
            );
            setWeightBtnSts(false);
            return;
          }
        },
        function () {
          setWeightBtnSts(false);
        }
      );
    } else {
      setSumSchWt(totalScheduleWt);
      setSumNetWt(sumPrimeScrap);
      if (sumPrimeScrap.toFixed(3) == totalScheduleWt.toFixed(3)) {
        setWeightBtnSts(true);
      } else {
        alertify.error(
          "Tota net wt(Prime + Scrap) must be equal to schedule wt."
        );
        setWeightBtnSts(false);
        return;
      }
    }
  };

  const modifyCoil = async () => {
    var selectedRows = modifyTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select table rows");
      return;
    }

    var url = "api/LDSM004/modifyCoilDetails";
    var newData = [];
    var resWt_batchDtl = "";

    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var data = {
        newData: newData,
        user: serverDetails.PersonalNo,
        Plant: selectedPlant.value ? selectedPlant.value : "",
        resWt: resWt_batchDtl,
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data) {
              var res = response.data.errorString.toString();
              if (res.includes("Error")) {
                setShowSaveMsgSuccess(false);
                setShowSaveMsgError(true);
                setSaveMsg(res);
              } else {
                setShowSaveMsgSuccess(true);
                setShowSaveMsgError(false);
                setSaveMsg(res);
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
    });
  };

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
      //   alertify.error(
      //     "Extra lot creation is not applicable for WIP Production"
      //   );
      //   return;
      // }

      var array = insertTableData;
      var data = cell.getRow().getData();
      setSelectedCellPosition(cell._cell.row.position);
      var index = array.findIndex(({ id }) => id === cell._cell.row.data.id);

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
        return;
      }

      setLoading(true);
      var url = "api/LDSM004/getBatchCount";
      console.log("shift 3722",shift);
      var selectedRows = gridtbl.getSelectedRows();
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        ProdDate: prodDt,
        MBatch: selMbatch.value
          ? selMbatch.value
          : selectedRows[0]._row.data.LOM_ID_BATCH,
        status: shift ? shift : "",
        Process: selectedProcess.value,
        count: cell._cell.row.position - 1,
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
                NO_PASS: 0,
                EWI_LENGTH: copyArr[0].EWI_LENGTH,
                EWI_NO_PIECES: copyArr[0].EWI_NO_PIECES,
                EWI_MS_PIECE_ACTL: copyArr[0].EWI_MS_PIECE_ACTL,
                ddlWorkCenter: copyArr[0].ddlWorkCenter,
                EWI_MS_PIECE_ACTL: copyArr[0].EWI_MS_PIECE_ACTL,
                FG_MAT: copyArr[0].FG_MAT,
                FG_MAT_DESC: copyArr[0].FG_MAT_DESC,
                SFG_MAT: copyArr[0].SFG_MAT,
                SFG_MAT_DESC: copyArr[0].SFG_MAT_DESC,
                RM_MAT: copyArr[0].RM_MAT,
                RM_MAT_DESC: copyArr[0].RM_MAT_DESC,
                ODIA: copyArr[0].ODIA,
                IDIA: copyArr[0].IDIA,
                SPEC: copyArr[0].SPEC,
                EWI_PLANNED_PROC: copyArr[0].EWI_PLANNED_PROC,
                P_NAME: copyArr[0].P_NAME,
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
      var url = "api/LDSM004/getRsnDetails";
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

      var url = "api/LDSM004/getRsnDetails";
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

      var url = "api/LDSM004/scrapmatno";
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
      var found = substr.test(selectedTable[0].LOM_PLANNED_PROC);
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

  let listBtn = function (value, data, cell, row, options) {
    return `<i class='fa-solid fa-square' style='color:#49a3f1'></i>`;
  };

  let listBtn2 = function (value, data, cell, row, options) {
    return `<i class='fa-solid fa-square' style='color:green; margin-left: 2rem;'></i>`;
  };

  let btncallback = function (e, cell) {
    let dt = cell.getData();
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM004/getLengthList";
      var d = {
        plant: selectedPlant.value ? selectedPlant.value : "",
        odia: dt.EWI_SEC2,
        order: dt.EWI_ID_ORDER_CUS,
        item: dt.EWI_ID_ORD_ITEM_CUS,
      };

      axiosAPI.post(url, d, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          if (response) {
            if (response.data[1].length != 0) {
              setOpen(true);
              setRsnListDt(response.data[1]);
            } else {
              alertify.error("No data found!");
            }
          }
        }
      });
    });
  };

  let btncallback2 = function (e, cell) {
    let dt = cell.getData();
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM004/getIntrmMatl";
      var d = {
        plant: selectedPlant.value ? selectedPlant.value : "",
        fg_mat: dt.FG_MAT,
        p_line: selectedProcess.value ? selectedProcess.value : ""
      };

      axiosAPI.post(url, d, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          if (response) {
            if (response.data[1].length != 0) {
              setOpenIM(true);
              setIntrmMatl(response.data[1]);
            } else {
              alertify.error("No data found!");
            }
          }
        }
      });
    });
  }

  const handleClose = () => {
    setOpen(false);
    var rsnDt = selectedRsnModalTable.getSelectedRows();
    if (rsnDt.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    odiaUpdatedRow.update({
      EWI_LENGTH: rsnDt[0]._row.data.SFG_LEN,
    });
    return;
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCloseIM = () => {
    setOpenIM(false);
  };

  const handleCancelIM = () => {
    setOpenIM(false);
  };

  const formulaCalc = (cell) => {
    setLoading(true);
    var selectedRows = gridtbl.getSelectedRows();
    let thick = selectedRows[0]._row.data.LOM_SEC1;
    console.log(thick);
    var data;
    if (selectedPlant.value == "0788") {
      if (selectedProcess.value == "M") {
        data = {
          P_PLANT: selectedPlant.value,
          P_BATCH_ID: selMbatch.value,
          P_PROD_NAME: cell.getData()?.P_NAME ? cell.getData()?.P_NAME : ProductName,
          P_NO_PCS: cell.getData()?.EWI_NO_PIECES,
          P_LENGTH: cell.getData()?.EWI_LENGTH,
          P_OD: cell.getData()?.EWI_SEC2,
          P_ID: cell.getData()?.IDIA,
          P_THICKNESS: thick ? thick : 0,
        };
      } else {
        data = {
          P_PLANT: selectedPlant.value,
          P_BATCH_ID: selMbatch.value,
          P_PROD_NAME: cell.getData()?.P_NAME ? cell.getData()?.P_NAME : ProductName,
          P_NO_PCS: cell.getData()?.EWI_NO_PIECES,
          P_LENGTH: cell.getData()?.EWI_LENGTH,
          P_OD: cell.getData()?.EWI_SEC2,
          P_ID: cell.getData()?.IDIA,
          P_THICKNESS: cell.getData()?.EWI_SEC1,
        };
      }

    } else {
      data = {
        P_PLANT: selectedPlant.value,
        P_BATCH_ID: selMbatch.value,
        P_PROD_NAME: null,
        P_NO_PCS: cell.getData()?.EWI_NO_PIECES,
        P_LENGTH: cell.getData()?.EWI_LENGTH,
        P_OD: cell.getData()?.EWI_SEC2,
        P_ID: cell.getData()?.IDIA,
        P_THICKNESS: cell.getData()?.EWI_SEC1,
      };
    }

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post("api/LDSM004/getPieceActl", data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            setLoading(false);
          } else {
            setLoading(false);
            cell.getRow()?.update({ EWI_MS_PIECE_ACTL: response.data[0][0] });
          }
        });
    });
  };

  const insertColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      field: "EWI_ID_WRK_INST",
      title: "ID PDI",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      frozen: true,
      cellClick: function (e, cell) {
        {
          copyTable(cell, true);
        }
      },
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
          copyTable(cell, true);
        }
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
      field: "EWI_ID_SCHEDULE",
      title: "Schedule Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      visible: false,
      frozen: true,
    },

    {
      field: "EWI_SEC2",
      title: "H.OD.",
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
          setWeightBtnSts(false);
          formulaCalc(cell);
        }
      },
    },
    {
      field: "IDIA",
      title: "H.ID.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
        var rl = cell._cell.row.data.IDIA;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            IDIA: 0,
          });
        } else {
          row.update({
            IDIA: rl,
          });
          setWeightBtnSts(false);
          formulaCalc(cell);
        }

      },
    },
    {
      title: "THK.",
      field: "EWI_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
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
          setWeightBtnSts(false);
          formulaCalc(cell);
        }
      },
    },
    {
      field: "EWI_LENGTH",
      title: "Length(m)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          var row = cell.getRow();
          setOdiaUpdatedRow(row);
        }

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
          setWeightBtnSts(false);
          formulaCalc(cell);
        }

      },
    },
    {
      title: "",
      formatter: listBtn,
      cellClick: btncallback,
      width: 40,
      align: "center",
    },
    {
      title: "Intrm Matl",
      formatter: listBtn2,
      cellClick: btncallback2,
      align: "center",
    },
    {
      field: "ODIA",
      title: "Odia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      visible: false,
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
        var rl = cell._cell.row.data.ODIA;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            ODIA: 0,
          });
        } else {
          row.update({
            ODIA: rl,
          });
          setWeightBtnSts(false);
          formulaCalc(cell);
        }
      },
    },
    {
      title: "No Of PASS",
      field: "NO_PASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "number",
      visible: false,
      editorParams: {
        min: 0,
        max: 99,
        step: 10,
        elementAttributes: {
          maxlength: "10",
        },
        mask: "99",
        selectContents: true,
        verticalNavigation: "table",
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value);
            return d;
          }
        }
      },
      cellEdited: (cell) => {
        setWeightBtnSts(false);
        formulaCalc(cell);
      },
    },
    {
      field: "rollingLength",
      title: "Hollow Length(mm)",
      // editable: editCheck,
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        var rLength = 0;
        if (value == undefined) {
          var row = cell.getRow();
          // let selectedTable = gridtbl.getSelectedRows();
          let selectedTable = gridtbl.getData();
          var substr = /C/; //Finding CTL Process
          if (
            selectedTable.length != 0 &&
            cell._cell.row.data.EWI_LENGTH != undefined
          ) {
            // var found = substr.test(selectedTable[0]._row.data.LOM_PLANNED_PROC);
            var found = substr.test(selectedTable[0].LOM_PLANNED_PROC);

            if (found) {
              if (
                cell._cell.row.data.SFG_MAT == "" ||
                cell._cell.row.data.SFG_MAT == null
              ) {
                rLength = (
                  parseFloat(cell._cell.row.data.EWI_LENGTH) * 1000
                ).toFixed(3);
                row.update({
                  rollingLength: rLength,
                });
                return rLength;
              } else {
                // rLength = await callRollingApi(cell._cell.row.data.SFG_MAT);
                GetAuthorization().then((token) => {
                  var defaultOptions = {
                    headers: {
                      Authorization: "Bearer " + token.accessToken,
                    },
                  };

                  var url = "api/LDSM004/getRollingLen";
                  var data = { SFGNo: cell._cell.row.data.SFG_MAT };
                  axiosAPI
                    .post(url, data, defaultOptions)
                    .then((response) => {
                      if (
                        response.statusText != "" &&
                        response.statusText != "OK"
                      ) {
                      } else {
                        rLength = (
                          parseFloat(response?.data?.rows[0][0]) * 1000
                        ).toFixed(3);
                        row.update({
                          rollingLength: rLength,
                        });
                        return rLength;
                      }
                    })
                    .finally((f) => { });
                });
              }
            } else {
              rLength = (
                parseFloat(cell._cell.row.data.EWI_LENGTH) * 1000
              ).toFixed(3);
              row.update({
                rollingLength: rLength,
              });
              return rLength;
            }
          }
        } else {
          return value;
        }
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.rollingLength;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            rollingLength: 0,
          });
        } else {
          row.update({
            rollingLength: rl,
          });
          return;
        }
      },
    },
    {
      field: "EWI_NO_PIECES",
      title: "NOS",
      hozAlign: "right",
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
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.EWI_NO_PIECES;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            EWI_NO_PIECES: 0,
          });
        } else {
          row.update({
            EWI_NO_PIECES: rl,
          });
          setWeightBtnSts(false);
          formulaCalc(cell);
        }

      },
    },
    {
      field: "EWI_MS_PIECE_ACTL",
      title: "Net Wt. " + qtyType + "",
      hozAlign: "right",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 150,
      editable: function(cell) {
        return (editableusers  || selectedProcess.value != "M"  || selectedPlant.value != "0788");
        },
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var editor = document.createElement("input");
        // editor.readOnly = true;
        editor.style.padding = "3px";
        editor.style.width = "100%";
        editor.style.boxSizing = "border-box";

        editor.value = cell.getValue() ? cell.getValue() : "";

        onRendered(function () {
          editor.focus();
          editor.style.css = "100%";
        });

        function successFunc() {
          success(editor.value);
        }

        editor.addEventListener("change", successFunc);
        editor.addEventListener("blur", successFunc);

        return editor;
      },
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
      cellEdited: (cell) => {
        setWeightBtnSts(false);
        var row = cell.getRow();
        var rl = cell._cell.row.data.EWI_MS_PIECE_ACTL;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            EWI_MS_PIECE_ACTL: 0,
          });
        } else {
          row.update({
            EWI_MS_PIECE_ACTL: rl,
          });
          let isSelected = false;
          if (row?._row?.modules?.select?.selected) {
            setChemBlock(true);
            isSelected = true;
          }

          var EWI_MS_PIECE_ACTL = cell._cell.row.data.EWI_MS_PIECE_ACTL;
          if (isSelected) {
            row.deselect();
          }

          row.update({
            EWI_MS_PIECE_ACTL: EWI_MS_PIECE_ACTL,
          });
          return;
        }
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
      iseditable: "false",
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
      iseditable: "false",
      width: 210,
    //  editor: dateEditorLux,
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
      formatter: "lookup",
      formatterParams: workCenter,
      defaultValue: workCenter,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Grade",
      field: "GRD_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
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
      formatter: "lookup",
      formatterParams: processListItemsTable,
    },
    {
      field: "ddlRsnHold",
      title: "Rsn Hold",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "select",
      visible: false,
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
      title: "Rsn Hold Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      minWidth: 200,
      editor: "list",
      visible: false,
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: reasonDetailsTable,
      },
      formatter: "lookup",
      formatterParams: reasonDetailsTable,
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
      formatter: "lookup",
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
      title: "Qlty",
      field: "EWI_CD_QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
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
    {
      field: "LOM_NO_PIECES",
      title: "No of pcs",
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
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.LOM_NO_PIECES;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            LOM_NO_PIECES: 0,
          });
        } else {
          row.update({
            LOM_NO_PIECES: rl,
          });
          setWeightBtnSts(false);
          setLoading(true);
          var data;
          if (selectedPlant.value == "0788") {
            data = {
              P_PLANT: selectedPlant.value,
              P_BATCH_ID: selMbatch.value,
              P_PROD_NAME: cell.getData()?.P_NAME ? cell.getData()?.P_NAME : ProductName,
              P_NO_PCS: cell.getData()?.LOM_NO_PIECES,
              P_LENGTH: insertTableData[0]?.EWI_LENGTH,
              P_OD: insertTableData[0]?.EWI_SEC2,
              P_ID: insertTableData[0]?.IDIA,
              P_THICKNESS: insertTableData[0]?.EWI_SEC1,
            };
          } else {
            data = {
              P_PLANT: selectedPlant.value,
              P_BATCH_ID: selMbatch.value,
              P_NO_PCS: cell.getData()?.LOM_NO_PIECES,
              P_LENGTH: insertTableData[0]?.EWI_LENGTH,
              P_OD: insertTableData[0]?.EWI_SEC2,
              P_ID: insertTableData[0]?.IDIA,
              P_THICKNESS: insertTableData[0]?.EWI_SEC1,
            };
          }

          GetAuthorization().then((token) => {
            var defaultOptions = {
              headers: {
                Authorization: "Bearer " + token.accessToken,
              },
            };
            axiosAPI
              .post("api/LDSM004/getPieceActl", data, defaultOptions)
              .then((response) => {
                if (response.statusText != "" && response.statusText != "OK") {
                  setLoading(false);
                } else {
                  cell.getRow()?.update({ NET_WT: response.data[0][0] });
                  setLoading(false);
                }
              });
          });
        }
      },
    },
    {
      title: "Net Wt. " + qtyType + "",
      field: "NET_WT",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 200,
      // editableusers,
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
      cellEdited: (cell) => {
        setWeightBtnSts(false);
        var row = cell.getRow();
        var rl = cell._cell.row.data.NET_WT;
        if (isNaN(rl)) {
          alertify.error("Please enter a valid number");
          row.update({
            NET_WT: 0,
          });
        } else {
          row.update({
            NET_WT: rl,
          });
          let isSelected = false;
          if (row?._row?.modules?.select?.selected) {
            setChemBlock(true);
            isSelected = true;
          }

          var EWI_MS_PIECE_ACTL = cell._cell.row.data.EWI_MS_PIECE_ACTL;
          if (isSelected) {
            row.deselect();
          }

          row.update({
            EWI_MS_PIECE_ACTL: EWI_MS_PIECE_ACTL,
          });
          return;

        }
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
      width: 100,
    },
    {
      title: "QLTY",
      field: "QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
  ];

  const modifyColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "80",
      headerSort: false,
    },
    {
      title: "Batch Id",
      field: "BATCHID",
      headerFilter: "input",
      width: "200",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: "150",
      //editor: "input",
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
    },
    {
      title: "Thick",
      field: "THK",
      headerFilter: "input",
      width: "150",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      //editor: "input",
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
    },
    {
      title: "Idia",
      field: "IDIA",
      width: "150",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      //editor: "input",
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
    },
    {
      title: "Length",
      field: "LENGTH1",
      headerFilter: "input",
      width: "150",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      //editor: "input",
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
    },
    {
      title: "Net Wt",
      field: "LOM_MS_GROSS_CAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "100",
      headerSort: false,
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "100",
      headerSort: false,
    },
    {
      title: "Pieces",
      field: "LOM_NO_PIECES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "100",
      headerSort: false,
    },
    {
      title: "Order",
      field: "ORDERNO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Item",
      field: "ORDERITEM",
      headerFilter: "input",
      width: "90",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Process",
      field: "LOM_PASSED_PROC",
      headerFilter: "input",
      width: "90",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Work Center",
      field: "LOM_WORK_CENTER",
      headerFilter: "input",
      width: "90",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      width: "150",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Mother Coil",
      field: "MOTHER_COIL",
      headerFilter: "input",
      width: "150",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Batch Status",
      field: "CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Customer",
      field: "CUST_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Cust No",
      field: "LOM_NO_CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Spec",
      field: "SPECEFICATION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "NEXT_PROC_DESC",
      title: "Proc Desc.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false
    },
    {
      title: "FG Material",
      field: "FG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "FG Material Desc",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "SFG Material",
      field: "SFG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "SFG Material Desc",
      field: "SFG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "RM Material",
      field: "RM_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "RM Material Desc",
      field: "RM_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      field: "PACKING_SHFT",
      title: "Packing Shift",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_PLANNED_PROC",
      title: "Route",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PROD_DT",
      title: "Prod DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PACKED_BY",
      title: "Packed By",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
    setGridData([,]);
    setInsertTableData([,]);
    setSumNetWt(0);
    setDateValue(null);
    setScarpDt([,]);
  };

  const clearFilterOnPlant = () => {
    setSelectedProcess([]);
    setSelectMbatch([]);
    setSelectOdia([]);
    setSelectIdea([]);
    setAllValues({});
    setMotherBatch([]);
    setEditableUsers([]);
    setGridData([]);
    setSelectedWorkCenter([]);
    setInsertTableData([,]);
    setSumNetWt(0);
    setDateValue(null);
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

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    setGridData([,]);
    setInsertTableData([,]);
    setScarpDt([,]);
    getMotherBatchUnmerge(event.target.value);
  };

  const getMotherBatchUnmerge = async (value) => {

    setSelectMbatch([]);
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM004/getMCoilList";
      let data = {
        Plant: selectedPlant.value,
        Process: selectedProcess.value,
        workcenter: "",
        radioType: value,

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

  const getUserIdsEditableMass = async (value) => {
    setEditableUsers([]);
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM004/getUserIdsEditableMass";
      let data = {
        Plant: selectedPlant.value,
        UserId: userID
      };
      console.log(data,userID);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data) {
              var items = [];
              console.log(response.data);
              response.data.map((row) => {
                var obj = new Object();
                console.log(row[0]);  
                items.push(row[0]);
              });
              console.log(items[0]);
              setEditableUsers(items[0]);
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

  const handleLabelModalOpen = (type) => {
    var selectedRows = modifyTable.getSelectedRows();
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });

    if (newData.length == 0 || newData.length > 1) {
      alertify.error("Please select a single row to print the label");
      return;
    } else {
      setLabelModalOpen(type);
      setLabelDialogData(newData);
    }
  };

  const accessLabelDialogData = () => {
    return labelDialogData;
  };

  const handelDownloadLable = () => {
    var selectedRows = modifyTable.getSelectedRows();
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });

    if (newData.length == 0) {
      alertify.error("Please select a row");
      return;
    }

    for (var i = 0; i < newData.length; i++) {
      var a = document.body.appendChild(document.createElement("a"));
      a.download = selectedRows[0]._row.data.BATCHID + "_" + "WIP" + ".txt"; //batchid_currentprocess_WIP.txt
      var b = "";
      var d = [
        "stxL",
        "D11",
        "PF",
        "SF",
        "H10",
        "491100300220066" + `${newData[i].TUBE_PROD_DT}`,
        "491100300930041TATA STEEL LIMITED",
        "1X1100000070047L002573",
        "1X1100000130010B374562001001",
        "491100301550066" + `${newData[i].CD_STATUS}`,
        "491100300220091CUSTOMER NAME",
        "491100301550091" + `${newData[i].CUST_NM}`,
        "491100303560067REGION",
        "491100304720064" + `${""}`,
        "491100303560093NEXT PROCESS",
        "491100304720093" + `${newData[i].NEXT_PROC}`,
        "1X1100000070095L002573",
        "1X1100003490048L047002",
        "1X1100004640047L048002",
        "1X1100003510071L002229",
        "491100300190116SFG MATERIAL DESC.",
        "491100301760117111105607-" + `${newData[i].FG_MATERIAL_DESC}`,
        "49110030330031367.00X63.00X2.000X6.0000",
        "491100300190140" + `${newData[i].BATCHID}`,
        "4911003017601403721BK2010",
        "491100300190162MILL LENGTH MTRS.",
        "49110030176016" + `${newData[i].LENGTH1}`,
        "491100300190186QTY. NOS.",
        "491100301760186" + `${newData[i].LOM_NO_PIECES}`,
        "491100300190210QTY. KG",
        "491100301760210" + `${newData[i].LOM_MS_GROSS_CAL}`,
        "491100300190258GRADE",
        "491100301760258" + `${newData[i].GRADE}`,
        "491100300190234QTY. MTRS.",
        "491100301760234" + `${""}`,
        "491100300190309FG MATERIAL DESC.",
        "491100300190342CRNT MTRL. DESC.",
        "491100301760343111105607-PTM-O-N-PRP-AD-FC-",
        "491100300190376PROCESS PATH",
        "4911003017603131932027" + `${newData[i].PROCESS_PATH_DESC}`,
        "491100301760377" + `${newData[i].PROCESS_PATH_DESC}`,
        "49110030360011981.20X2.300X3.9800",
        "49110030360034581.20X2.300X3.9800",
        "1W1d6605004020143Customer Order / Item:" +
        `${newData[i].ORDERNO}` +
        "/" +
        `${newData[i].ORDERITEM}` +
        "," +
        "Batch Id:" +
        `${newData[i].BATCHID}` +
        "," +
        "No of Tube:" +
        `${newData[i].LOM_NO_PIECES}` +
        "," +
        "Quantity (KG):" +
        `${newData[i].LOM_MS_GROSS_CAL}` +
        "," +
        "Grade:" +
        `${newData[i].GRADE}`,
        "Q0001",
        "E",
      ];

      for (var i = 0; i < d.length; i++) {
        b += d[i] + "\r\n";
      }
      b = encodeURIComponent(b);
      a.href = "data:text/html," + b;
      a.click();
    }
  };

  const componentRef = React.useRef();

  const handleClickOpenTxt = () => {
    var selectedRows = modifyTable.getSelectedRows();
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });

    setOpenTxt(true);
  };

  const handleCloseTxt = () => {
    setOpenTxt(false);
  };

  const downloadExcelScheduleDetails = () => {
    if (gridtbl == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = gridtbl.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var fileName = "LDSM004" + ".xlsx";
    gridtbl.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelPrimeTable = () => {
    if (insertTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = insertTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var fileName = "LDSM004" + ".xlsx";
    insertTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

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

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Production Recording"
        code="LDSM004"
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

      {/* Intrm Matl Modal */}
      <BootstrapDialog
        onClose={handleCloseIM}
        //aria-labelledby="customized-dialog-title"
        open={openIM}
        //maxWidth="xl"
        fullWidth="true"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleCloseIM}
        ></BootstrapDialogTitle>
        <DialogContent>
          <div id="modalTable"></div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancelIM}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>
      {/* Intrm Matl Modal */}

      {/* Text File print generate */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openTxt}
        onClose={handleCloseTxt}
      >
        <DialogTitle>Print Label</DialogTitle>
        <DialogContent>
          {loading && <Preloader />}

          <MDBox px={3} py={1} ref={componentRef}>
            {modifyTable?.getSelectedRows()?.map((x, i) => (
              <React.Fragment key={i}>
                <>
                  <div>stxL,</div>
                  <div>D11,</div>
                  <div>PF,</div>
                  <div>SF,</div>
                  <div>H10,</div>
                  <div>491100300220066{x?._row?.data?.TUBE_PROD_DT},</div>
                  <div>491100300930041TATA STEEL LIMITED,</div>
                  <div>1X1100000070047L002573,</div>
                  <div>1X1100000130010B374562001001,</div>
                  <div>491100301550066{x?._row?.data?.CD_STATUS},</div>
                  <div>491100300220091CUSTOMER NAME,</div>
                  <div>491100301550091{x?._row?.data?.CUST_NM},</div>
                  <div>491100303560067REGION,</div>
                  <div>491100304720064{""},</div>
                  <div>491100303560093NEXT PROCESS,</div>
                  <div>491100304720093{x?._row?.data?.NEXT_PROC},</div>
                  <div>1X1100000070095L002573,</div>
                  <div>1X1100003490048L047002,</div>
                  <div>1X1100004640047L048002,</div>
                  <div>1X1100003510071L002229,</div>
                  <div>491100300190116SFG MATERIAL DESC.,</div>
                  <div>
                    491100301760117111105607-
                    {x?._row?.data?.FG_MATERIAL_DESC},
                  </div>
                  <div>49110030330031367.00X63.00X2.000X6.0000,</div>
                  <div>491100300190140{x?._row?.data?.BATCHID},</div>
                  <div>4911003017601403721BK2010,</div>
                  <div>491100300190162MILL LENGTH MTRS.,</div>
                  <div>49110030176016{x?._row?.data?.LENGTH1},</div>
                  <div>491100300190186QTY. NOS.,</div>
                  <div>491100301760186{x?._row?.data?.LOM_NO_PIECES},</div>
                  <div>491100300190210QTY. KG,</div>
                  <div>491100301760210{x?._row?.data?.LOM_MS_GROSS_CAL},</div>
                  <div>491100300190258GRADE,</div>
                  <div>491100301760258{x?._row?.data?.GRADE},</div>
                  <div>491100300190234QTY. MTRS.,</div>
                  <div>491100301760234{""},</div>
                  <div>491100300190309FG MATERIAL DESC.,</div>
                  <div>491100300190342CRNT MTRL. DESC.,</div>
                  <div>491100301760343111105607-PTM-O-N-PRP-AD-FC-,</div>
                  <div>491100300190376PROCESS PATH,</div>
                  <div>
                    4911003017603131932027
                    {x?._row?.data?.PROCESS_PATH_DESC},
                  </div>
                  <div>491100301760377{x?._row?.data?.PROCESS_PATH_DESC},</div>
                  <div>49110030360011981.20X2.300X3.9800,</div>
                  <div>49110030360034581.20X2.300X3.9800,</div>
                  <div>
                    "1W1d6605004020143Customer Order / Item:"
                    {x?._row?.data?.ORDERNO} /{x?._row?.data?.ORDERITEM}, "Batch
                    Id:"
                    {x?._row?.data?.BATCHID}, "No of Tube:"
                    {x?._row?.data?.LOM_NO_PIECES}, "Quantity (KG):"
                    {x?._row?.data?.LOM_MS_GROSS_CAL},"Grade:"
                    {x?._row?.data?.GRADE}`,
                  </div>
                  <div>Q0001,</div>
                  <div>E,</div>
                </>
              </React.Fragment>
            ))}
          </MDBox>

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem" }}
          >
            <Button onClick={handleCloseTxt}>Close</Button>
            <ReactToPrint
              trigger={() => (
                <MDButton size="small" color="info">
                  Print
                </MDButton>
              )}
              content={() => componentRef.current}
            />
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      {/* Text File print generate */}

      {isRestricted == false && (
        <>
          <MDBox pt={6} pb={3} py={10}>
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
                          <IconButton
                            color="white"
                            onClick={() => clearFilter()}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={3} style={{ zIndex: 5 }}>
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
                      <Grid item xs={2} style={{ zIndex: 5 }}>
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
                          isDisabled={tabValue == 1}
                          onChange={handleProcessChange}
                          value={selectedProcess}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ zIndex: 4 }}>
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
                          isDisabled={tabValue == 1}
                          onChange={handleWorkCenterChange}
                          value={selectedWorkCenter}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ zIndex: 5 }}>
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
                        {tabValue == 0 && (
                          <>
                            <ReactSelect
                              id="batchIdMother"
                              options={motherBatch}
                              isDisabled={tabValue == 1}
                              onChange={handleMotherBatchChange}
                              value={selMbatch}
                            />
                          </>
                        )}
                        {tabValue == 1 && (
                          <>
                            <ReactSelect
                              id="batchIdMother"
                              options={[]}
                              isDisabled={tabValue == 1}
                              onChange={handleMotherBatchChange}
                              value={[]}
                            />
                          </>
                        )}
                      </Grid>
                      <Grid item xs={2} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Daughter Batch{" "}
                        </MDTypography>
                        <ReactSelect
                          id="batchIdDaughter"
                          options={daughterBatch}
                          isDisabled={tabValue == 0}
                          onChange={handleDaughterBatchChange}
                          value={selDbatch}
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
                          O-Dia/Width
                        </MDTypography>
                        <ReactSelect
                          id="oDia"
                          options={odia}
                          isDisabled={tabValue == 1}
                          onChange={handleOdiaChange}
                          value={selectOdia}
                        />
                      </Grid>
                      {/* <Grid item xs={1.25}>
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

                        {/* {tabValue == 0 && (
                          <DatePicker
                            id="receiDtFrm"
                            value={dateValue}
                            onChange={(date) => {
                              setDateValue(date);
                              clearFilterOnDate();
                            }}
                            disableFuture={true}
                          />
                          )}
                        {tabValue == 1 && (
                          <ReactSelect
                            id="Date"
                            options={odia}
                            isDisabled={tabValue == 1}
                            onChange={handleOdiaChange}
                            value={selectOdia}
                          />
                        )}
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
                        {" "}
                        Prod Start Date *
                      </MDTypography>

                      <input
                        type="datetime-local"
                        //step="1" // Allows selection of seconds
                        style={{ height: "37px" }}
                        id="prodStartDate"
                        disabled={tabValue === 1}
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
                        isDisabled={tabValue == 1}
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
                      <MDInput name="Pdate" iseditable="false" value={dateValue} />
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
                        {/* <ReactSelect
                          id="Shift*"
                          options={statusList}
                          iseditable="false"
                          isDisabled={tabValue == 1}
                          onChange={handleStusChange}
                          value={selectedStatus}
                        /> */}
                        <MDInput name="Shift" iseditable="false" value={shift} />
                      </Grid>
                      {/* <Grid item xs={1.5} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Reverse Merging
                        </MDTypography>
                        <ReactSelect
                          id="rMarge"
                          options={revMerge}
                          isDisabled={tabValue == 1}
                          onChange={handleRmageChange}
                          value={selectRevMerge}
                        />
                      </Grid> */}

                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="midium"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          style={{ marginLeft: "10rem" }}
                          noWrap
                        >
                          Action{" "}
                        </MDTypography>
                        <AppBar position="static">
                          <Tabs
                            orientation={"horizontal"}
                            value={tabValue}
                            onChange={handleSetTabValue}
                            textColor="secondary"
                            indicatorColor="secondary"
                          >
                            <Tab label="Insert" />
                            {/* <Tab label="Modify" /> */}
                            <Tab label="Generate Label" />
                          </Tabs>
                        </AppBar>
                      </Grid>
                      {tabValue == 0 && (
                        <>
                          <Grid item xs={3}>
                            <FormControl>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Record Type
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueRadio}
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="S"
                                  disabled={Merge}
                                  control={<Radio />}
                                  label="Do not merge"
                                />
                                <FormControlLabel
                                  value="M"
                                  disabled={Merge}
                                  control={<Radio />}
                                  label="Merge"
                                />
                                <FormControlLabel
                                  value="U"
                                  disabled={Merge}
                                  control={<Radio />}
                                  label="Unmerge"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                        </>
                      )}

                      <Grid item xs={1}>
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
                                    disabled={!mergeSchedule || valueRadio == "S" || valueRadio == "U"}
                                    color="white"
                                    onClick={() => checkScheduleType(true)}
                                  >
                                    <FormatListBulletedIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Unmerge Coil" arrow>
                                  <IconButton
                                    disabled={valueRadio == "M" || valueRadio == "S"}
                                    color="white"
                                    onClick={() => callReverseUnmerge(true)}
                                  >
                                    <CallSplitIcon />
                                  </IconButton>

                                </Tooltip>
                                <Tooltip title="Download" arrow>
                                  <IconButton
                                    color="white"
                                    onClick={() => downloadExcelScheduleDetails()}
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
                              Prime Production (Total Net Wt. :{" "}
                              {sumNetWt.toFixed(3)} {qtyType}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography variant="h6" color="white">
                              Remaining Wt :{" "}
                              {(
                                gridScheduleWt -
                                (finalnetWtAllotP + finalnetWtAllotS)
                              ).toFixed(3)}
                              {/* gridScheduleWt= { gridScheduleWt}
                           finalnetWtAllotP=   { finalnetWtAllotP}
                            finalnetWtAllotS=  { finalnetWtAllotS} */}
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

                            {weightBtnSts && (
                              <Tooltip title="Save" arrow>
                                <IconButton
                                  color="white"
                                  disabled={isReadWriteAccess}
                                  onClick={() => insertCoil(true)}
                                >
                                  <SaveIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Download" arrow>
                              <IconButton
                                color="white"
                                onClick={() => downloadExcelPrimeTable()}
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
                            <Tooltip title="Download Label" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={printBtn}
                                  onClick={() => handelDownloadLable()}
                                >
                                  <GetAppIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            {/* <Tooltip title="Print" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={printBtn}
                                  onClick={() => handleClickOpenTxt()}
                                >
                                  <PrintIcon />
                                </IconButton>
                              </span>
                            </Tooltip> */}
                            <Tooltip title="SFG Print Preview" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={printBtn}
                                  onClick={() => handleLabelModalOpen('SFG')}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            <Tooltip title="WIP Print Preview" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={printBtn}
                                  onClick={() => handleLabelModalOpen("WIP")}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                            {/* <Tooltip title="Save" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => modifyCoil(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip> */}
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
                            <LDSM004LabelModal
                              open={labelModalOpen !== null}
                              close={() => setLabelModalOpen(null)}
                              inputValues={accessLabelDialogData}
                              type={labelModalOpen}
                              plant={selectedPlant}
                            />
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
        </>
      )}
    </DashboardLayout>
  );
}
