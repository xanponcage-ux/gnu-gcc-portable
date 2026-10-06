import React, { useEffect, useState, useRef, forwardRef, useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import Divider from "@mui/material/Divider";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import DeleteIcon from "@mui/icons-material/Delete";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
//import 'tabulator-tables/dist/css/tabulator.min.css';
import ClearAllIcon from "@mui/icons-material/ClearAll";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SaveIcon from "@mui/icons-material/Save";
import ReorderIcon from '@mui/icons-material/Reorder';
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
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

import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import "../../tabulatorCss.scss";
import card from "assets/theme-dark/components/card";
import { GetAuthorization } from "utils";
var scheduleDtRef;
//const [scheduleDtRef, setScheduleDtRef] = useState(null);

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

export default function LD01S004() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [plant, setPlant] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState([]);
  const [transferSchedules, setTransferSchedules] = useState([]);
  const [selectedTransferSchedule, setSelectedTransferSchedule] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({
    label: "Pending",
    value: "A",
  });
  const [selectedPlant, setSelectedPlant] = React.useState([]);

  const [rmDetailsData, setRmDetailsData] = React.useState([]);
  const [scheduleDetailsData, setScheduleDetailsData] = React.useState([]);
  const [computeDt, setComputeRet] = React.useState([]);
  const [tableDt, setClickTableDt] = useState(null);
  const [rmDetailsDataTable, setRmDetailsDataTable] = useState(null);
  const [isTreeExpanded, setIsTreeExpanded] = useState(true);
  const [scheduleDtDetails, setScheduleDataDetailsTable] = React.useState(null);
  const [counter, setCounter] = useState(0);
  const [empCounter, setEmpCounter] = useState(0);
  const [rmTable, setSelectRmTable] = React.useState([]);
  const [batchRowOrder, setBatchRowOrder] = React.useState([]);
  const [orderTable, setOrderTable] = React.useState([]);
  const [rmOrderData, setRmOrderData] = React.useState([]);
  const [orderDetails, setOrderDetails] = React.useState([]);
  const [allValues, setAllValues] = useState({
    batch: "",
    thikFrm: "",
    thikTo: "",
    widthFrm: "",
    widthTo: "",
  });
  const [CamputeStatus, setCamputeStatus] = useState(false);

  //const statusList = [{ label: "VF", value: "VF" }];
  //const [selectedStatus, setSelectedStatus] = useState([]);
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
          getScheduleId();
          getTransferScheduleId();
          setInitialLoad(true);
          setCamputeStatus(false);
        }
      }
    }
    fetchData();
  }, []);

  const isBatchRow = (data) => data?.ROW_TYPE === "BATCH";
  const isOrderRow = (data) => data?.ROW_TYPE === "ORDER";

  const format3 = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = Number(value);
    return Number.isNaN(num) ? value : num.toFixed(3);
  };

  const getOrderId = (row) => row?.ORDER_ID ?? row?.EWI_ID_ORDER_CUS ?? "";
  const getOrderItem = (row) => row?.ORDER_ITEM ?? row?.EWI_ID_ORD_ITEM_CUS ?? "";

  const makeOrderChildRow = (row) => ({
  ROW_TYPE: "ORDER",
  EWI_ID_BATCH: row?.EWI_ID_BATCH ?? "",
  ORDER_ID: getOrderId(row),
  ORDER_ITEM: getOrderItem(row),
  ORDER_MASS: row?.ORDER_MASS ?? row?.MASS ?? row?.EWI_MS_PIECE_ACTL ?? "",
  ORDER_THICKNESS: row?.ORDER_THICKNESS ?? row?.SEC1 ?? row?.EWI_SEC1 ?? "",
  ORDER_FG_THICKNESS:
    row?.ORDER_FG_THICKNESS ?? row?.FG_THICKNESS ?? row?.ENC_SEC1_MAX ?? "",
  ORDER_WIDTH: row?.ORDER_WIDTH ?? row?.SEC2 ?? row?.EWI_SEC2 ?? "",
  ORDER_LENGTH: row?.ORDER_LENGTH ?? row?.LEN ?? row?.EWI_LENGTH ?? "",

  // NEW: No of Tubes from V_WORK_INST.EWI_COMBINATION
  NO_OF_TUBES:
    row?.EWI_COMBINATION ??
    "",

  // Keep parent-only fields blank in child rows.
  NEWPRIORITY: null,
  PRIORITY: null,
  EWI_CD_STATUS: "",
  SCHEDULE_ID: "",
  SC_CR_DT: "",
  MILL: "",
});

  const stripChildrenForApi = (rowData) => {
    const { _children, ROW_TYPE, rowType, ...batchOnlyData } = rowData || {};
    return batchOnlyData;
  };

  const buildBatchOrderTree = (batchRows = [], orderRows = []) => {
    const batchMap = new Map();

    const parentRows = (batchRows || []).map((batch) => {
      const parent = {
        ...batch,
        ROW_TYPE: "BATCH",
        ORDER_COUNT: batch?.ORDER_COUNT ?? 0,
        _children: Array.isArray(batch?._children)
          ? batch._children.map((child) => makeOrderChildRow(child))
          : [],
      };

      batchMap.set(parent.EWI_ID_BATCH, parent);
      return parent;
    });

    (orderRows || []).forEach((order) => {
      const batchId = order?.EWI_ID_BATCH;
      if (!batchId) return;

      let parent = batchMap.get(batchId);

      // Fallback: if backend sends an order row whose batch parent is missing,
      // create a minimal parent so that the row is still visible.
      if (!parent) {
        parent = {
          ...order,
          ROW_TYPE: "BATCH",
          ORDER_ID: "",
          ORDER_ITEM: "",
          ORDER_COUNT: 0,
          _children: [],
        };
        batchMap.set(batchId, parent);
        parentRows.push(parent);
      }

      parent._children.push(makeOrderChildRow(order));
      parent.ORDER_COUNT = parent._children.length;
    });

    parentRows.forEach((parent) => {
      parent.ORDER_COUNT = parent._children?.length || parent.ORDER_COUNT || 0;
    });

    return parentRows;
  };

  const normalizeScheduleRows = (rows = []) => {
    if (!Array.isArray(rows)) return [];

    // If backend already sends nested _children rows, only enforce ROW_TYPE.
    if (rows.some((row) => Array.isArray(row?._children))) {
      return rows.map((row) => ({
        ...row,
        ROW_TYPE: row?.ROW_TYPE || "BATCH",
        ORDER_COUNT: row?.ORDER_COUNT ?? row?._children?.length ?? 0,
        _children: Array.isArray(row?._children)
          ? row._children.map((child) => makeOrderChildRow(child))
          : [],
      }));
    }

    // If backend sends one flat row for each order, group those rows by Batch ID.
    // If backend still sends only one aggregate row per batch, this will still work,
    // but it can only show the single order returned by that old aggregate query.
    const parentMap = new Map();
    const parentRows = [];

    rows.forEach((row) => {
      const batchId = row?.EWI_ID_BATCH;
      if (!batchId) return;

      let parent = parentMap.get(batchId);
      const hasOrderDetail = Boolean(getOrderId(row) || getOrderItem(row));

      if (!parent) {
        parent = {
          ...row,
          ROW_TYPE: "BATCH",
          ORDER_ID: "",
          ORDER_ITEM: "",
          ORDER_COUNT: 0,
          _children: [],
        };
        parentMap.set(batchId, parent);
        parentRows.push(parent);
      }

      if (hasOrderDetail) {
        parent._children.push(makeOrderChildRow(row));
        parent.ORDER_COUNT = parent._children.length;
      }
    });

    return parentRows;
  };

  const rmColumn = [
    {
      title: "",
      formatter: function (cell) {
        const rowData = cell.getRow().getData();

        // Child order rows should not have checkbox.
        if (isOrderRow(rowData)) {
          return "";
        }

        // PR rows should not be selectable.
        if (rowData.EWI_CD_STATUS === "PR") {
          return "";
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "tabulator-row-select-checkbox";
        checkbox.checked = cell.getRow().isSelected();

        checkbox.addEventListener("change", function (e) {
          e.stopPropagation();
          const row = cell.getRow();

          if (checkbox.checked) {
            row.select();
          } else {
            row.deselect();
          }
        });

        return checkbox;
      },
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
      width: 45,
    },
    {
      title: "Batch ID / Order Row",
      field: "EWI_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      width: 190,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();

        if (isOrderRow(rowData)) {
          return `<span style="color:#6c757d;">Order Detail</span>`;
        }

        return rowData.EWI_ID_BATCH || "";
      },
    },
    {
      title: "Parent Batch",
      field: "LOM_ID_FIRST_PAR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 140,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData) ? "" : cell.getValue();
      },
    },
    {
      title: "Priority",
      field: "PRIORITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 100,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData) ? "" : cell.getValue();
      },
    },
    {
      title: "New Priority",
      field: "NEWPRIORITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 120,
      editable: function (cell) {
        const rowData = cell.getRow().getData();
        return isBatchRow(rowData) && rowData.EWI_CD_STATUS !== "PR";
      },
      editor: function (cell, onRendered, success, cancel) {
        const table = cell.getTable();

        // Only parent Batch rows participate in sequencing.
        const totalRows = table
          .getData()
          .filter((row) => row.ROW_TYPE === "BATCH").length;

        const editor = document.createElement("input");
        editor.setAttribute("type", "number");
        editor.style.padding = "4px";
        editor.style.width = "100%";
        editor.style.boxSizing = "border-box";
        editor.style.height = "100%";
        editor.value = cell.getValue();
        editor.setAttribute("min", 1);
        editor.setAttribute("max", totalRows);
        editor.setAttribute("step", 1);

        function commitValue() {
          let value = parseInt(editor.value, 10);

          if (Number.isNaN(value) || value < 1) {
            value = 1;
          } else if (value > totalRows) {
            value = totalRows;
          }

          success(value);
        }

        onRendered(function () {
          editor.focus();
          editor.select();
        });

        editor.addEventListener("change", commitValue);
        editor.addEventListener("blur", commitValue);
        editor.addEventListener("keydown", function (e) {
          if (e.key === "Escape") {
            cancel();
          }

          if (e.key === "Enter") {
            commitValue();
          }
        });

        return editor;
      },
      formatter: function (cell) {
        const rowData = cell.getRow().getData();

        if (isOrderRow(rowData)) {
          return "";
        }

        cell.getElement().style.backgroundColor = "#DA8EE7";
        cell.getElement().style.color = "#FFFFFF";

        return cell.getValue();
      },
    },
    {
      title: "Schedule Status",
      field: "EWI_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 140,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData) ? "" : cell.getValue();
      },
    },
    {
      title: "Thickness",
      field: "SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 110,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData)
          ? format3(rowData.ORDER_THICKNESS)
          : format3(cell.getValue());
      },
    },
    {
      title: "FG Thickness",
      field: "FG_THICKNESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 130,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData)
          ? format3(rowData.ORDER_FG_THICKNESS)
          : format3(cell.getValue());
      },
    },
    {
      title: "Width",
      field: "SEC2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 110,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData)
          ? format3(rowData.ORDER_WIDTH)
          : format3(cell.getValue());
      },
    },
    {
      title: "Length",
      field: "LEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 110,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData)
          ? format3(rowData.ORDER_LENGTH)
          : format3(cell.getValue());
      },
    },
    {
      title: "Mass",
      field: "MASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 110,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData)
          ? format3(rowData.ORDER_MASS)
          : format3(cell.getValue());
      },
    },
    {
      title: "Order Count",
      field: "ORDER_COUNT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 120,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();

        if (isOrderRow(rowData)) {
          return "";
        }

        const count = cell.getValue();
        if (!count) return "";

        return `${count} order${Number(count) > 1 ? "s" : ""}`;
      },
    },
    {
      title: "Order",
      field: "ORDER_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();

        if (isOrderRow(rowData)) {
          return `<b>${rowData.ORDER_ID || ""}</b>`;
        }

        return "";
      },
    },
    {
      title: "Item",
      field: "ORDER_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 100,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData) ? rowData.ORDER_ITEM || "" : "";
      },
    },
    {
      title: "No of Tubes",
      field: "NO_OF_TUBES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 130,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();

        // No of Tubes is order-wise, so show only on ORDER child rows
        if (!isOrderRow(rowData)) {
          return "";
        }

        return rowData.NO_OF_TUBES ?? rowData.EWI_COMBINATION ?? "";
      },
    },
    {
      title: "Schedule Id",
      field: "SCHEDULE_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 140,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData) ? "" : cell.getValue();
      },
    },
    {
      title: "Schedule Creation Date",
      field: "SC_CR_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 170,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData) ? "" : cell.getValue();
      },
    },
    {
      title: "Mill",
      field: "MILL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 100,
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        return isOrderRow(rowData) ? "" : cell.getValue();
      },
    },
  ];

  useEffect(() => {
    let table = null;

    if (rmDetailsData?.length > 0) {
      table = new Tabulator("#rmDetailsTable", {
        data: rmDetailsData,
        columns: rmColumn,
        height: 350,
        layout: "fitDataFill",

        // Option 1: Batch rows as parent, Order rows as children.
        dataTree: true,
        dataTreeStartExpanded: true,
        dataTreeChildField: "_children",
        dataTreeElementColumn: "EWI_ID_BATCH",
        dataTreeChildIndent: 20,

        // Parent filtering/sorting should not accidentally hide order children.
        dataTreeFilter: false,
        dataTreeSort: false,

        selectableRows: true,
        selectableRowsCheck: function (row) {
          const rowData = row.getData();

          // Only parent Batch rows should be selectable.
          if (rowData.ROW_TYPE === "ORDER") {
            return false;
          }

          // Existing PR restriction.
          if (rowData.EWI_CD_STATUS === "PR") {
            return false;
          }

          return true;
        },
        rowFormatter: function (row) {
          const rowData = row.getData();
          const rowEl = row.getElement();

          rowEl.classList.remove("batch-parent-row", "order-child-row");

          if (rowData.ROW_TYPE === "ORDER") {
            rowEl.classList.add("order-child-row");
            rowEl.style.backgroundColor = "#f8f9fa";
            rowEl.style.color = "#344767";
            rowEl.style.fontSize = "12px";
            rowEl.style.fontWeight = "400";
            return;
          }

          rowEl.classList.add("batch-parent-row");
          rowEl.style.fontWeight = "600";

          if (rowData.EWI_CD_STATUS === "PR") {
            rowEl.style.backgroundColor = "red";
            rowEl.style.color = "white";
            rowEl.style.opacity = "0.7";
          } else {
            rowEl.style.backgroundColor = "";
            rowEl.style.color = "";
            rowEl.style.opacity = "";
          }
        },
      });

      setRmDetailsDataTable(table);
      setIsTreeExpanded(true);
    } else {
      setRmDetailsDataTable(null);
    }

    return () => {
      if (table) {
        table.destroy();
      }
    };
  }, [rmDetailsData]);

  // const getNewRowOrder = () => {
  //   console.log("hello");
  //   const updatedData = rmDetailsDataTable.getData();
  //   const reorderedData = updatedData
  //     .filter((row) => row.ROW_TYPE === "BATCH")
  //     .map((row, index) => ({
  //       EWI_ID_BATCH: row.EWI_ID_BATCH,
  //       rowNumber: index + 1,
  //     }));
  //   setBatchRowOrder(reorderedData);
  //   console.log(reorderedData);
  // };

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
      var pageName = "LD01S004";

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
    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    setLoading(true);
    let data = {
      adid: serverDetails.PersonalNo,
    };
    var url = "api/LD01S004/getGroupPlant";
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
    if (value) {
      getProcessData(value);
      getBatchIdList(value);
      getProcessList(value);
    }
  };

  const handleschedulechange = (value) => {
    setSelectedSchedule(value);
    setAllValues({});

    setRmDetailsData([]);
    setScheduleDetailsData([]);

    // if (value) {
    //   getProcessData(value);
    //   getBatchIdList(value);
    //   getProcessList(value);
    // }
  };

  const handlesTransferSchedulechange = (value) => {
    setSelectedTransferSchedule(value);
    //setAllValues({});

    // setRmDetailsData([]);
    // setScheduleDetailsData([]);

    // if (value) {
    //   getProcessData(value);
    //   getBatchIdList(value);
    //   getProcessList(value);
    // }
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setRmDetailsData([]);
    setScheduleDetailsData([]);
    console.log(value?.value);
    getScheduleId(false, value?.value);
    //setAllValues({});

    // if (value) {
    //   getProcessData(value);
    //   getBatchIdList(value);
    //   getProcessList(value);
    // }
  };

  const getCoils = async (newToken = false) => {
    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    if (!selectedSchedule || selectedSchedule?.value === "") {
      alertify.error("schedule cannot be blank");
      return;
    }

    const [value1, value2, value3] = selectedSchedule.value.split("#");

    const data = {
      Plant: selectedPlant.value,
      scheduleID: value1,
      status: selectedStatus.value === "A" ? "WC" : "CN",
    };

    const url = "api/LD01S004/getCoils";

    setLoading(true);

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          return;
        }

        const parentRows = response.data?.[1] || [];
        const orderRows = response.data?.[2] || [];

        // Preferred backend response:
        // response.data[1] = one parent row per Batch ID
        // response.data[2] = order rows for those Batch IDs
        //
        // Also supports response.data[1] already containing _children,
        // or response.data[1] being a flat order-level result set.
        const tableRows = orderRows.length > 0
          ? buildBatchOrderTree(parentRows, orderRows)
          : normalizeScheduleRows(parentRows);

        if (tableRows.length === 0) {
          alertify.error("No Data Found");
        } else {
          setRmDetailsData(tableRows);
        }
      })
      .catch((error) => {
        handleAxiosError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };


  // Helper function for error handling
  const handleAxiosError = (error) => {
    if (error.response) {
      alertify.error(error.response.data.message || "Error fetching orders.");
    } else if (error.request) {
      alertify.error("No response received from the server.");
    } else {
      alertify.error("Error in setting up the request.");
    }
  };

  const getScheduleId = async (newToken = false, status = null) => {
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

    setLoading(true);
    console.log(status);
    let data = {
      status: status ?? selectedStatus?.value,
    };
    console.log(data);
    var url = "api/LD01S004/getSchedules";
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
              row[0] + " | " + row[1] + " | " + row[2] + " | " + row[3]+" | "+ row[4];
            obj.value = row[0] + "#" + row[3] + "#" + row[2];
            items.push(obj);
            console.log(obj);
          });
          console.log(items);
          setSchedules(items);
          setSelectedSchedule(items[0]);

          // setTransferSchedules(items);
          // setSelectedTransferSchedule(items[0]);

        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getTransferScheduleId = async (newToken = false, status = null) => {
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

    setLoading(true);
    console.log(status);
    let data = {
      status: "AC",
    };
    console.log(data);
    var url = "api/LD01S004/getSchedules";
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
              row[0] + " | " + row[1] + " | " + row[2] + " | " + row[3]+" | "+ row[4];
            obj.value = row[0] + "#" + row[3] + "#" + row[2];
            items.push(obj);
            console.log(obj);
          });
          console.log(items);
          setTransferSchedules(items);
          setSelectedTransferSchedule(items[0]);

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

  const deleteCoil = () => {
    const selectedRows = rmDetailsDataTable
      ?.getSelectedRows()
      ?.filter((row) => row.getData().ROW_TYPE === "BATCH") || [];

    if (selectedRows.length === 0) {
      alertify.error("Please select batch rows");
      return;
    }

    setLoading(true);

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const newData = selectedRows.map((item) =>
        stripChildrenForApi(item.getData())
      );

      const url = "api/LD01S004/deleteCoil";

      axiosAPI
        .post(url, newData, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            return;
          }

          if (response.data) {
            const res = response.data.errorString.toString();

            if (res.includes("N-")) {
              alertify.error(res);
            } else {
              alertify.success(res);
            }

            setRmDetailsData([]);
            setSelectedStatus([]);
            getScheduleId();
            getTransferScheduleId();
          } else {
            alertify.success("Error Occured !");
            setRmDetailsData([]);
          }
        })
        .catch((error) => {
          handleAxiosError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const transferSchedule = () => {
    const selectedRows = rmDetailsDataTable
      ?.getSelectedRows()
      ?.filter((row) => row.getData().ROW_TYPE === "BATCH") || [];

    if (selectedRows.length === 0) {
      alertify.error("Please select batch rows");
      return;
    }

    const newData = selectedRows.map((item) =>
      stripChildrenForApi(item.getData())
    );

    const [value1, value2, value3] = selectedTransferSchedule?.value.split("#");

    console.log(newData?.[0]?.MILL, value2);

    if (newData?.[0]?.MILL != value2) {
      alertify.error("Mill of new and old schedule should be same");
      return;
    }

    const data = {
      rowData: newData,
      scheduleID: value1,
    };

    const url = "api/LD01S004/transferSchedule";

    setLoading(true);

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            return;
          }

          if (response.data) {
            const res = response.data.errorString.toString();

            if (res.includes("N-")) {
              alertify.error(res);
            } else {
              alertify.success(res);
            }

            setRmDetailsData([]);
            setSelectedStatus([]);
            getScheduleId();
            getTransferScheduleId();
          } else {
            alertify.success("Error Occured !");
            setRmDetailsData([]);
            getScheduleId();
            getTransferScheduleId();
          }
        })
        .catch((error) => {
          handleAxiosError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const confirm = async (newToken = false, action) => {
    if (rmDetailsData.length === 0) {
      setLoading(false);
      alertify.error("No data available schedule details !");
      return;
    }

    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    const allRows = rmDetailsDataTable?.getData() || [];

    // Only parent Batch rows participate in resequencing.
    const batchRows = allRows.filter((row) => row.ROW_TYPE === "BATCH");
    const totalRows = batchRows.length;

    if (totalRows === 0) {
      alertify.error("No batch rows available for sequencing.");
      return;
    }

    const newPriorities = batchRows.map((row) => Number(row.NEWPRIORITY));

    const hasInvalidPriority = newPriorities.some(
      (priority) =>
        Number.isNaN(priority) ||
        priority < 1 ||
        priority > totalRows
    );

    if (hasInvalidPriority) {
      alert(
        "Validation Error: 'New Priority' should contain valid values from 1 to " +
          totalRows +
          "."
      );
      return;
    }

    const uniquePriorities = new Set(newPriorities);

    if (uniquePriorities.size !== totalRows) {
      alert(
        "Validation Error: 'New Priority' column contains duplicate values or missing values. Please ensure each Batch has a unique priority from 1 to " +
          totalRows +
          "."
      );
      return;
    }

    const sortedPriorities = Array.from(uniquePriorities).sort((a, b) => a - b);

    for (let i = 0; i < totalRows; i++) {
      if (sortedPriorities[i] !== i + 1) {
        alert(
          "Validation Error: 'New Priority' column does not contain a complete sequence from 1 to " +
            totalRows +
            ". Please ensure all priorities are set correctly."
        );
        return;
      }
    }

    const rowData = batchRows.map((row) => ({
      EWI_BATCH_ID: row.EWI_ID_BATCH,
      priority: Number(row.NEWPRIORITY),
    }));

    const [value1, value2, value3] = selectedSchedule?.value.split("#");

    const data = {
      rowData: rowData,
      scheduleID: value1,
      count: value3,
      action: action,
    };

    console.log(data);

    setLoading(true);

    const url = "api/LD01S004/confirm";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          return;
        }

        console.log(response);

        if (response?.data) {
          const res = response.data?.toString();

          if (res.includes("N-")) {
            alertify.error(res);
          } else {
            alertify.success(res);
          }

          setRmDetailsData([]);
          setSelectedStatus([]);
          getScheduleId();
          getTransferScheduleId();
        }
      })
      .catch((error) => {
        handleAxiosError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clearFilter = () => {
    setSelectedPlant([]);
    setAllValues({});
    setRmDetailsData([]);
    setRmOrderData([]);
    setScheduleDetailsData([]);
    setSelScheduleDetailsData([,]);
  };

  const toggleExpandCollapseAll = () => {
    if (!rmDetailsDataTable || rmDetailsData.length === 0) {
      alertify.error("No table data available");
      return;
    }

    const shouldExpand = !isTreeExpanded;

    rmDetailsDataTable.getRows().forEach((row) => {
      const rowData = row.getData();
      const hasChildren =
        Array.isArray(rowData?._children) && rowData._children.length > 0;

      if (!hasChildren) return;

      if (shouldExpand) {
        row.treeExpand?.();
      } else {
        row.treeCollapse?.();
      }
    });

    setIsTreeExpanded(shouldExpand);
  };

  const getExcelExportRows = () => {
    const tableRows = rmDetailsDataTable?.getData() || rmDetailsData || [];
    const exportRows = [];

    tableRows.forEach((batch) => {
      if (batch?.ROW_TYPE === "ORDER") return;

      const children = Array.isArray(batch?._children) ? batch._children : [];

      exportRows.push({
        ROW_LEVEL: "BATCH",
        BATCH_ID: batch?.EWI_ID_BATCH || "",
        PARENT_BATCH: batch?.LOM_ID_FIRST_PAR || "",
        PRIORITY: batch?.PRIORITY ?? "",
        NEW_PRIORITY: batch?.NEWPRIORITY ?? "",
        SCHEDULE_STATUS: batch?.EWI_CD_STATUS || "",
        SCHEDULE_ID: batch?.SCHEDULE_ID || "",
        THICKNESS: format3(batch?.SEC1),
        FG_THICKNESS: format3(batch?.FG_THICKNESS),
        WIDTH: format3(batch?.SEC2),
        LENGTH: format3(batch?.LEN),
        MASS: format3(batch?.MASS),
        ORDER_COUNT: children.length || batch?.ORDER_COUNT || 0,
        ORDER_ID: "",
        ORDER_ITEM: "",
        ORDER_THICKNESS: "",
        NO_OF_TUBES: "",
        ORDER_FG_THICKNESS: "",
        ORDER_WIDTH: "",
        ORDER_LENGTH: "",
        ORDER_MASS: "",
        SCHEDULE_CREATION_DATE: batch?.SC_CR_DT || "",
        MILL: batch?.MILL || "",
      });

      children.forEach((order) => {
        exportRows.push({
          ROW_LEVEL: "ORDER",
          BATCH_ID: order?.EWI_ID_BATCH || batch?.EWI_ID_BATCH || "",
          PARENT_BATCH: "",
          PRIORITY: "",
          NEW_PRIORITY: "",
          SCHEDULE_STATUS: "",
          SCHEDULE_ID: batch?.SCHEDULE_ID || "",
          THICKNESS: "",
          FG_THICKNESS: "",
          WIDTH: "",
          LENGTH: "",
          MASS: "",
          ORDER_COUNT: "",
          ORDER_ID: getOrderId(order),
          ORDER_ITEM: getOrderItem(order),
          ORDER_THICKNESS: format3(order?.ORDER_THICKNESS),
          ORDER_FG_THICKNESS: format3(order?.ORDER_FG_THICKNESS),
          ORDER_WIDTH: format3(order?.ORDER_WIDTH),
          ORDER_LENGTH: format3(order?.ORDER_LENGTH),
          ORDER_MASS: format3(order?.ORDER_MASS),
          NO_OF_TUBES:order?.NO_OF_TUBES ??order?.EWI_COMBINATION ??"",
          SCHEDULE_CREATION_DATE: "",
          MILL: "",
        });
      });
    });

    return exportRows;
  };

  const downloadOrderList = () => {
    if (rmDetailsData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    const exportRows = getExcelExportRows();

    if (exportRows.length === 0) {
      alertify.error("No rows available for Downloading");
      return;
    }

    const exportColumns = [
      { title: "Row Type", field: "ROW_LEVEL" },
      { title: "Batch ID", field: "BATCH_ID" },
      { title: "Parent Batch", field: "PARENT_BATCH" },
      { title: "Priority", field: "PRIORITY" },
      { title: "New Priority", field: "NEW_PRIORITY" },
      { title: "Schedule Status", field: "SCHEDULE_STATUS" },
      { title: "Schedule ID", field: "SCHEDULE_ID" },
      { title: "Thickness", field: "THICKNESS" },
      { title: "FG Thickness", field: "FG_THICKNESS" },
      { title: "Width", field: "WIDTH" },
      { title: "Length", field: "LENGTH" },
      { title: "Mass", field: "MASS" },
      { title: "Order Count", field: "ORDER_COUNT" },
      { title: "Order ID", field: "ORDER_ID" },
      { title: "Order Item", field: "ORDER_ITEM" },
      { title: "No of Tubes", field: "NO_OF_TUBES" },
      { title: "Order Thickness", field: "ORDER_THICKNESS" },
      { title: "Order FG Thickness", field: "ORDER_FG_THICKNESS" },
      { title: "Order Width", field: "ORDER_WIDTH" },
      { title: "Order Length", field: "ORDER_LENGTH" },
      { title: "Order Mass", field: "ORDER_MASS" },
      { title: "Schedule Creation Date", field: "SCHEDULE_CREATION_DATE" },
      { title: "Mill", field: "MILL" },
    ];

    const fileName = `LD01S004_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // Tree-data download from the visible Tabulator can produce broken/nested Excel.
    // So create a temporary flat Tabulator only for the export.
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-10000px";
    tempContainer.style.top = "-10000px";
    tempContainer.style.width = "1px";
    tempContainer.style.height = "1px";
    tempContainer.style.overflow = "hidden";
    document.body.appendChild(tempContainer);

    const tempTable = new Tabulator(tempContainer, {
      data: exportRows,
      columns: exportColumns,
      layout: "fitDataFill",
    });

    setTimeout(() => {
      tempTable.download("xlsx", fileName, {
        sheetName: "ScheduleDetails",
      });

      setTimeout(() => {
        tempTable?.destroy();
        tempContainer?.remove();
      }, 500);
    }, 300);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Schedule Confirmation/Deletion"
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

                      <MDBox px={3} py={3}>
                        <Grid container spacing={1.5}>
                          <Grid item xs={2.5} style={{ zIndex: 5 }}>
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

                          <Grid item xs={3} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Schd Id | Schd Crt Dt | No of coil in Schd |
                              MILLNO | Status*
                            </MDTypography>
                            <ReactSelect
                              id="schid"
                              options={schedules}
                              onChange={handleschedulechange}
                              value={selectedSchedule}
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
                              Schedule Status*
                            </MDTypography>
                            <ReactSelect
                              id="schdStatus"
                              options={[
                                { label: "Confirmed", value: "C" },
                                { label: "Pending", value: "A" },
                              ]}
                              onChange={handleStatusChange}
                              value={selectedStatus}
                            />
                          </Grid>

                          {/* <Grid></Grid>
                          <br /> */}
                          <Grid item xs={0.5}>
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
                            xs={0.25}
                            style={{ display: "flex", alignItems: "center" ,marginLeft:"1rem"}}
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
                          <Grid item xs={3  } style={{ zIndex: 5 ,alignItems: "left" }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Schd Id | Schd Crt Dt | No of coil in Schd |
                              MILLNO | Status*
                            </MDTypography>
                            <ReactSelect
                              id="schid"
                              options={transferSchedules}
                              onChange={handlesTransferSchedulechange}
                              value={selectedTransferSchedule}
                            />
                          </Grid>

                          <Grid item xs={1}>
                            <MDButton
                              style={{
                                marginTop: "1.5rem",
                                whiteSpace: "nowrap", // Prevent text wrapping
                                backgroundColor: "#FFA500",
                                color: "#FFFFFF",
                              }}
                              size="small"
                              onClick={() => transferSchedule()}
                            >
                              Transfer
                            </MDButton>
                          </Grid>
                          {/* {JSON.stringify(scheduleDetailsData)} */}
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
                        <Grid item xs={3}></Grid>
                        <Grid item xs={3}>
                        <Tooltip title="Delete">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => deleteCoil(true)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={isTreeExpanded ? "Collapse All" : "Expand All"}
                          arrow
                        >
                          <IconButton
                            color="white"
                            onClick={() => toggleExpandCollapseAll()}
                          >
                            {isTreeExpanded ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
                          </IconButton>
                        </Tooltip>

                        {/* <Grid item xs={1}> */}
                                <Tooltip title="Download" arrow>
                                  <IconButton
                                    color="white"
                                    onClick={() => downloadOrderList()}
                                  >
                                    <DownloadForOfflineIcon />
                                  </IconButton>
                                </Tooltip>
                              {/* </Grid> */}
                              
                                   <Tooltip title="Rearrange" arrow>
                                   <IconButton
                                     color="primary" // Or "white" if you have custom theming for it
                                     disabled={isReadWriteAccess}
                                     onClick={() => confirm(true, "REARRANGE")}
                                   >
                                     <ReorderIcon /> {/* Using the ReorderIcon */}
                                   </IconButton>
                                 </Tooltip>
                                

                        {selectedStatus?.value === "A" && (
                          
                            <Tooltip title="Confirm" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => confirm(true,"UPDATESTATUS")}
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
                          {rmDetailsData.length > 0 && (
                            <div id="rmDetailsTable"></div>
                          )}
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                }
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}