import React, { useEffect, useState, useRef, forwardRef, useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SaveIcon from "@mui/icons-material/Save";
import ComputeIcon from "@mui/icons-material/FactCheck";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
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
import Today from "@mui/icons-material/Today";

import LDSM170 from "views/Planning/LDSM31S";
import LDSM004 from "./LD50S004";

import "../../tabulatorCss.scss";
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

export default function LD50S003() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [plant, setPlant] = useState([]);
  const [process, setProcess] = useState([]);
  const [selectedProcess, setSelectedProcess] = React.useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectedTon, setSelectedTon] = React.useState([]);

  const [rmDetailsData, setRmDetailsData] = React.useState([]);
  const [scheduleDetailsData, setScheduleDetailsData] = React.useState([]);
  const [computeDt, setComputeRet] = React.useState([]);
  const [tableDt, setClickTableDt] = useState(null);
  const [rmDetailsDataTable, setRmDetailsDataTable] = useState(null);
  const [scheduleDtDetails, setScheduleDataDetailsTable] = React.useState(null);
  const [dateValue, setDateValue] = useState(null);
  const [dateValueTo, setDateValueTo] = useState(null);
  const [counter, setCounter] = useState(0);
  const [plannedPath, setPlannedPath] = React.useState([]);
  const [empCounter, setEmpCounter] = useState(0);
  const [btnSts, setBtnStatus] = React.useState(true);
  const [txtSts, setTxtStatus] = React.useState(false);
  const [rmTable, setSelectRmTable] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [gridModal, setSelectedGridTableModal] = useState(null);
  const [orderDetails, setOrderDetails] = React.useState([]);
  const [allValues, setAllValues] = useState({
    status: "VF",
    batch: "",
    tdc: "",
    prodCD: "",
    order: "",
    item: "",
    thikFrm: "",
    thikTo: "",
    widthFrm: "",
    widthTo: "",
  });
  const [ordTypList, setOrdTypList] = useState([]);
  const [selectedOrdTyp, setSelectedOrdTyp] = useState([]);
  const [CamputeStatus, setCamputeStatus] = useState(false);
  const [tdcList, setTdcList] = useState([]);
  const [selectedTdc, setSelectedTdc] = useState([]);

  const [modalFiled, setModalFiled] = useState({
    order: "",
    item: "",
    tdc: "",
    prodCd: "",
    thick: "",
    width: "",
    ordTyp: "",
  });
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
  const [selectedSchedulingConfirmTable, setSelectedSchedulConfirmTable] =
    useState(null);
  const [selectScheduleDetData, setSelScheduleDetailsData] = useState([]);
  const [Merge, setMergetype] = useState(false);
  const [selectedMergeDt, setSelectMergeDt] = useState(null);
  const [mbatchDetailsData, setMbatchDetailsData] = React.useState([]);
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
  const [selectedProcessdr, setSelectedProcessdr] = React.useState([]); //setSelectedProcessdr
  const [orderIdIndex, setOrderIdClickIndex] = React.useState(null);

  const handleStatusChange = (value) => {
    if (value) {
      setSelectedStatus(value);
      setRmDetailsData([]);
      setScheduleDetailsData([]);
    } else {
      setSelectedStatus([]);
    }
  };

  const handleModalChange = (e) => {
    setModalFiled({ ...modalFiled, [e.target.name]: e.target.value });
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
      title: "Setup CD",
      field: "ddlSchStCD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
          { label: "None", value: "" },
          { label: "", value: "-1" },
          { label: "A01", value: "A01" },
          { label: "A02", value: "A02" },
          { label: "A03", value: "A03" },
          { label: "A04", value: "A04" },
          { label: "A05", value: "A05" },
          { label: "A06", value: "A06" },
          { label: "A07", value: "A07" },
          { label: "A08", value: "A08" },
          { label: "A09", value: "A09" },
          { label: "A10", value: "A10" },
        ],
      },
    },
    {
      title: "Batch ID",
      field: "txtSchBatch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "txtSchPlannedPath",
      title: "Planned Path",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      // editor: "list",
      // editorParams: {
      //   allowEmpty: false,
      //   showListOnEmpty: true,
      //   values: plannedPath,
      // },
      // formatter: "lookup",
      // formatterParams: plannedPath
      formatter: function (cell, formatterParams) {
        // Value changed from dropdown to SKW
        // var value = cell.getValue();
        var value = "SKW";
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },

    {
      title: "Action",
      field: "action",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          SLIT: "SLIT",
          REWIND: "REWIND",
        },
      },
      // defaultValue: "SLIT",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: function (cell) {
        let cellVal = cell.getValue();
        const row = cell.getRow();
        var coilWidth = rmTable.LOM_SEC2;
        var netWt = rmTable?.LOM_MS_PIECE_ACTL?.toFixed(3);
        // console.log("coilWidth: ", coilWidth);
        // console.log("netWt: ", netWt);

        if (cellVal === "REWIND") {
          row.update({
            txtSchOrd: "",
            txtSchWidth: coilWidth,
            txtSchNoslt: "1",
            txtSchAimWt: netWt,
          });

          const table = cell.getTable();
          const allRows = table.getRows();
          allRows.forEach((currentRow) => {
            if (currentRow !== row) {
              table.deleteRow(currentRow);
            }
          });
          const widthCell = row.getCell("txtSchWidth");
          widthCell.invalidate();

          const aimWtCell = row.getCell("txtSchAimWt");
          aimWtCell.invalidate();
        }

        const orderIdCell = row.getCell("txtSchOrd").getElement();
        orderIdCell.innerHTML = row.getCell("txtSchOrd").getValue();
        orderIdCell.style["background-color"] =
          cellVal === "REWIND" ? "white" : "#DA8EE7";
        orderIdCell.style["color"] = cellVal !== "REWIND" ? "black" : "#FFFFFF";

        const widthCell = row.getCell("txtSchWidth").getElement();
        widthCell.innerHTML = row.getCell("txtSchWidth").getValue();
        widthCell.style["background-color"] =
          cellVal === "REWIND" ? "white" : "#DA8EE7";
        widthCell.style["color"] = cellVal !== "REWIND" ? "black" : "#FFFFFF";

        const noSltCell = row.getCell("txtSchNoslt").getElement();
        noSltCell.innerHTML = row.getCell("txtSchNoslt").getValue();
        noSltCell.style["background-color"] =
          cellVal === "REWIND" ? "white" : "#DA8EE7";
        noSltCell.style["color"] = cellVal !== "REWIND" ? "black" : "#FFFFFF";

        const aimWtCell = row.getCell("txtSchAimWt").getElement();
        aimWtCell.innerHTML = row.getCell("txtSchAimWt").getValue();
        aimWtCell.style["background-color"] =
          cellVal === "REWIND" ? "white" : "#DA8EE7";
        aimWtCell.style["color"] = cellVal !== "REWIND" ? "black" : "#FFFFFF";
      },
      cellClick: function (e, cell) {
        {
          setCamputeStatus(false);
        }
      },
    },
    {
      title: "Order Id",
      field: "txtSchOrd",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editorParams: {
        hasValue: function (cell) {
          return cell.getRow().getData().action !== "REWIND";
        },
      },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        var actionValue = cell?.getRow()?.getData()?.action;
        // console.log("actionValue: ", actionValue);

        if (actionValue === "SLIT") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          cell.getElement().removeAttribute("readonly");
          return value;
        } else if (actionValue === "REWIND") {
          // cell.setValue("");
          cell.getElement().style["background-color"] = "white";
          cell.getElement().style["color"] = "black";
          cell.getElement().setAttribute("readonly", true);
          // return "";
        } else {
          cell.getElement().removeAttribute("readonly");
        }
      },
      cellClick: async function (e, cell) {
        {
          var actionValue = cell.getRow().getData().action;
          var tdcVal = cell.getRow().getData().txtSchTdc;
          var batchId = cell.getRow().getData().txtSchBatch;

          console.log("tdcVal: ", tdcVal);
          if (actionValue === "SLIT") {
            setSelectedTdc([]);
            await getEquivTdc(tdcVal, batchId);
            setOrderIdClickIndex(cell._cell.row.position);
            setCamputeStatus(false);
            loadOrderModal(cell);
            setOrderDetails([,]);
          }
        }
      },
    },
    {
      title: "Item",
      field: "txtSchItem",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    // { title: "Sco Order", field: "txtSchScoOrd", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { title: "Item", field: "txtSchScoItem", "headerFilter": "input", "headerFilterPlaceholder": "search..." },

    {
      title: "Thick",
      field: "txtSchThick",
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
      title: "Width",
      field: "txtSchWidth",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editorParams: {
        hasValue: function (cell) {
          return cell.getRow().getData().action !== "REWIND";
        },
      },
      cellEdited: (cell) => {
        setCamputeStatus(false);
        var coilWidth = rmTable.LOM_SEC2;
        var resWt = rmTable.GROSS_CAL;
        //let plantWt = rmTable.GROSS_CAL;

        var SchWidth = cell._cell.row.data.txtSchWidth;
        var mWidth = Number(SchWidth);
        let OrdMinWidth = cell._cell.row.data.txtOrdMinWidth;
        let OrdMaxWidth = cell._cell.row.data.txtOrdMaxWidth;

        if (
          Number(mWidth) > Number(OrdMaxWidth) ||
          Number(mWidth) < Number(OrdMinWidth)
        ) {
          cell._cell.row.updateData({ txtSchWidth: OrdMaxWidth });
          alertify.error(
            "Width not in range " + OrdMinWidth + " and " + OrdMaxWidth + " !!!"
          );
          setLoading(false);
          return;
        }
        var calAimWt =
          (cell._cell.row.data.txtSchWidth *
            cell._cell.row.data.txtSchNoslt *
            rmTable.GROSS_CAL) /
          rmTable.LOM_SEC2;
        if (
          Number(mWidth) > Number(coilWidth) ||
          Number(calAimWt.toFixed(3)) > Number(resWt.toFixed(3))
        ) {
          cell._cell.row.updateData({ txtSchWidth: rmTable.LOM_SEC2 });
          alertify.error("Width can't be greater than coil width !!!");
          setLoading(false);
          return;
        }
        // cell._cell.row.updateData({ txtSchAimWt: calAimWt.toFixed(3) });
        //Validation added to check Aim wt should not exceed the Plan wt.
        let calWt = 0;
        calWt = Number(totalAimWt) - Number(calPlantWt);
        setCalPlantWt(calWt);
        let mAimWt = 0;
        mAimWt = (
          Number(calWt) + Number(cell._cell.row.data.txtSchAimWt)
        ).toFixed(3);
        if (mAimWt > resWt) {
          alertify.error("Calculated Aim Wt can't be greater than Plan wt !!!");
          setLoading(false);
          return;
        }
        setTotalAimWt(Number(mAimWt));
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var actionValue = cell?.getRow()?.getData()?.action;
        var coilWidth = rmTable.LOM_SEC2;

        if (actionValue === "SLIT") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          cell.getElement().removeAttribute("readonly");
          return value;
        } else if (actionValue === "REWIND") {
          cell.getElement().style["background-color"] = "white";
          cell.getElement().style["color"] = "black";
          cell.getElement().setAttribute("readonly", true);
          return coilWidth;
        } else {
          cell.getElement().removeAttribute("readonly");
        }
      },
    },
    // {
    //   field: "ddlSchOfcut",
    //   title: "Offcut",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   headerSort: false,
    //   editor: "select",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    //   editorParams: {
    //     allowEmpty: false,
    //     showListOnEmpty: true,
    //     values: [
    //       { label: "Y", value: "Y" },
    //       { label: "N", value: "N" },
    //     ],
    //   },
    // },
    {
      title: "Tdc",
      field: "txtSchTdc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Plan wt",
      field: "txtSchPlantwt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "number",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
    },
    {
      title: "No Slits/Bndls",
      field: "txtSchNoslt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "number",
      editorParams: {
        hasValue: function (cell) {
          return cell.getRow().getData().action !== "REWIND";
        },
      },
      cellEdited: (cell) => {
        setCamputeStatus(false);
        var resWt = rmTable.GROSS_CAL;
        var orderWidth = cell._cell.row.data.txtSchWidth;
        var noSlt = cell?.getValue();
        var coilWidth = rmTable.LOM_SEC2;
        var netWt = rmTable.LOM_MS_PIECE_ACTL;
        // var calAimWt =
        //   (cell._cell.row.data.txtSchWidth *
        //     cell._cell.row.data.txtSchNoslt *
        //     rmTable.GROSS_CAL) /
        //   rmTable.LOM_SEC2;
        var calAimWt = ((orderWidth * noSlt) / coilWidth) * netWt;
        if (calAimWt > resWt) {
          cell._cell.row.updateData({ txtSchNoslt: rmTable.LOM_NO_PIECES });
          cell._cell.row.updateData({ txtSchAimWt: "1" });

          alertify.error("Calculated Aim Wt can't be greater than Plan wt !!!");
          setLoading(false);
          return;
        }
        console.log("totalAimWt: ", totalAimWt);
        // cell._cell.row.updateData({ txtSchAimWt: calAimWt.toFixed(3) });
        //Validation added to check Aim wt should not exceed the Plan wt.
        var mAimWt = totalAimWt + cell._cell.row.data.txtSchAimWt;
        console.log("mAimWt: ", mAimWt);
        console.log("resWt: ", resWt);
        if (mAimWt > resWt) {
          cell._cell.row.updateData({ txtSchNoslt: rmTable.LOM_NO_PIECES });
          alertify.error("Aim Wt can't be greater than Plan wt !!!");
          setLoading(false);
          return;
        }
        let row = cell.getRow();
        if (calAimWt < resWt) {
          row.update({
            txtSchAimWt: calAimWt.toFixed(3),
          });
        } else {
          cell._cell.row.updateData({ txtSchNoslt: rmTable.LOM_NO_PIECES });
          alertify.error("Aim Wt can't be greater than Plan wt !!!");
          return;
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var actionValue = cell?.getRow()?.getData()?.action;

        if (actionValue === "SLIT") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          cell.getElement().removeAttribute("readonly");
          return value;
        } else if (actionValue === "REWIND") {
          cell.getElement().style["background-color"] = "white";
          cell.getElement().style["color"] = "black";
          cell.getElement().setAttribute("readonly", true);
          return "1";
        } else {
          cell.getElement().removeAttribute("readonly");
        }
      },
    },
    {
      title: "No Pcs",
      field: "txtSchNoPcs",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      visible: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Aim wt",
      field: "txtSchAimWt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "number",
      editorParams: {
        hasValue: function (cell) {
          return cell.getRow().getData().action !== "REWIND";
        },
      },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        var actionValue = cell?.getRow()?.getData()?.action;
        var netWt = rmTable?.LOM_MS_PIECE_ACTL?.toFixed(3);
        console.log("netWt: ", netWt);

        if (actionValue === "SLIT") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          cell.getElement().removeAttribute("readonly");
          return value;
        } else {
          cell.getElement().style["background-color"] = "white";
          cell.getElement().style["color"] = "black";
          cell.getElement().removeAttribute("readonly");
          return netWt;
        }
      },
      cellClick: function (e, cell) {
        {
          setCamputeStatus(false);
        }
      },
    },
    {
      title: "No Part",
      field: "txtSchNoPart",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      visible: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
      field: "txtSchRemark",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      minWidth: 200,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
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
      title: "Idia",
      field: "txtSchIdia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "input",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
    },
    {
      title: "Min Wt",
      field: "txtSchMinwt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Max Wt",
      field: "txtSchMaxwt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "",
      field: "",
      formatter: "buttonCross",
      cellClick: function (e, cell) {
        {
          var subAimWt = 0;
          subAimWt =
            Number(totalAimWt) - Number(cell._cell.row.data.txtSchAimWt);
          setTotalAimWt(subAimWt);

          deleteCell(cell);
        }
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
          getOrdTyp();
          //   getProdCat();
          setInitialLoad(true);
          setCamputeStatus(false);
        }
      }
    }
    fetchData();
  }, []);

  // useEffect(() => {
  //   if (tabValue == 0 && insertTableData) {
  //     setChemError(false);
  //     const varData = [];
  //     chemSelectionData?.map((x) =>
  //       varData.push({
  //         CD_EPA: selectedPlant?.value,
  //         ORDER_NO: selectedOrder,
  //         ITEM_NO: selectedItem,
  //         BATCH_ID: x.BATCH_ID,
  //       })
  //     );

  //     if (varData?.length > 0 && selectedOrder?.length > 0 && !chemBlock) {
  //       setLoading(true);
  //       GetAuthorization().then((token) => {
  //         var defaultOptions = {
  //           headers: {
  //             Authorization: "Bearer " + token.accessToken,
  //           },
  //         };
  //         axiosAPI
  //           .post("api/LDSM001/chemChk", { data: varData }, defaultOptions)
  //           .then((response) => {
  //             if (response.statusText != "" && response.statusText != "OK") {
  //               //reject(response.statusText);
  //             } else {
  //               if (response?.data) {
  //                 response.data?.map((x) => {
  //                   if (x.MESSAGE?.slice(0, 2) === "N-") {
  //                     setChemError(true);
  //                   }
  //                 });
  //               }
  //               setChemData(response.data);
  //             }
  //           })
  //           .finally(() => {
  //             setLoading(false);
  //           });
  //       });
  //     } else if (!chemBlock) {
  //       setChemData([]);
  //     }
  //   }
  // }, [chemSelectionData]);

  useEffect(() => {
    setRmDetailsDataTable(
      new Tabulator("#rmDetailsTable", {
        data: rmDetailsData,
        columns: gvCoilsClm,
        height: 250,
        layout: "fitDataFill",
      })
    );
  }, [rmDetailsData, plannedPath]);

  useEffect(() => {
    //if (scheduleDetailsData && scheduleDetailsData.length > 0) {
    scheduleDtRef = new Tabulator("#scheduleDetailsTable", {
      data: scheduleDetailsData,
      columns: scheduleDetailsTableClm,
      height: 200,
      layout: "fitDataFill",
    });
    //}
  }, [scheduleDetailsData, scheduleDetailsTableClm]);

  const scheduleConfirmColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: 50,
    },
    {
      title: "Batch Id",
      field: "EWI_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "EWI_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "EWI_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "EWI_SEC2",
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
      title: "IDia",
      field: "EWI_IDIA",
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
      title: "Status",
      field: "EWI_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt",
      field: "EWI_MS_PIECE_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 100,
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Net Wt UOM",
      field: "EWI_UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule Date",
      field: "CR_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "ENC_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material No",
      field: "FG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Description",
      field: "FG_MATERIAL_DESC",
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
      title: "SFG Description",
      field: "SFG_MATERIAL_DESC",
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
      title: "RM Description",
      field: "RM_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Tube Grade",
      field: "TUBE_GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule Id",
      field: "EWI_ID_SCHEDULE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Logical Id",
      field: "EWI_L_SCO_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Priority",
      field: "EWI_PRIORITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Work Center",
      field: "WORK_CENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule CRT By",
      field: "SCHD_CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule Date",
      field: "SCHD_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Route",
      field: "ROUTE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    if (selectScheduleDetData && selectScheduleDetData.length > 0) {
      setSelectedSchedulConfirmTable(
        new Tabulator("#schedulingConfirmTable", {
          height: 400,
          layout: "fitDataFill",
          data: selectScheduleDetData,
          columns: scheduleConfirmColumns,
        })
      );
    }
  }, [selectScheduleDetData]);

  const mergeDetailsClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      width: 50,
    },
    {
      title: "Plant",
      field: "ERD_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Merge Batch",
      field: "MERGE_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Component Batch",
      field: "COMPONENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Component Batch Qty(kg)",
      field: "COMPONENT_BATCH_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Send Sap Flag",
      field: "SEND_SAP_FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Creation Date",
      field: "CREATION_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CREATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    if (tabValue === 2 && mbatchDetailsData && mbatchDetailsData.length > 0) {
      setSelectMergeDt(
        new Tabulator("#mergeTable", {
          height: 300,
          layout: "fitColumns",
          data: mbatchDetailsData,
          columns: mergeDetailsClm,
          selectable: 1,
        })
      );
    }
  }, [mbatchDetailsData]);

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
      var pageName = "LD50S003";

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
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    let data = {
      adid: serverDetails.PersonalNo,
    };
    var url = "api/LD50S003/getGroupPlant";
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
          getProcessData(items[0]);
          getBatchIdList(items[0]);
          getProcessList(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getOrdTyp = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    let data = {
      adid: serverDetails.PersonalNo,
    };
    var url = "api/LD50S003/getordtyp";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row;
            obj.value = row;
            items.push(obj);
          });
          setOrdTypList(items);
          // setPlant(items);
          // setSelectedPlant(items[0]);
          // getProcessData(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getEquivTdc = async (tdc, batchId) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    let data = {
      tdc: tdc,
      batchId: batchId,
    };
    console.log("data:: ", data);
    setLoading(true);
    var url = "api/LD50S003/getEquivTdc";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((res) => {
        if (res.statusText != "" && res.statusText != "OK") {
          //reject(response.statusText);
        } else {
          console.log("res?.data: ", res?.data);
          var items = [];
          res.data.map((row) => {
            console.log("row: ", row);
            var obj = new Object();
            obj.label = row[0];
            obj.value = row[0];
            items.push(obj);
          });
          setTdcList(items);
          const defaultTdc = items.find((item) => item.value === tdc);
          if (defaultTdc) {
            setSelectedTdc(defaultTdc);
          }
          setLoading(false);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getProcessData = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/LD50S003/getProcessList";

    let data = {
      plant: value.value,
    };

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
          setProcess(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleOrdTypeChange = (e) => {
    setSelectedOrdTyp(e);
  };

  const handleTdcChange = (e) => {
    console.log("e: ", e);
    setSelectedTdc(e);
    setOrderDetails([,]);
  };

  const handlePlantChange = (value) => {
    setSelectedProcess([]);
    setAllValues({});
    setDateValue(null);
    setDateValueTo(null);
    setRmDetailsData([]);
    setScheduleDetailsData([]);
    setClickTableDt(null);
    setSelectedCoilType(coilTypeList[0]);
    setProcess([]);

    setSelectedPlant(value);
    if (value) {
      getProcessData(value);
      getBatchIdList(value);
      getProcessList(value);
    }
  };

  const handleCoilTypeChange = (e) => {
    setSelectedCoilType(e);
  };

  const handleTonChange = (value) => {
    setSelectedTon(value);
  };

  const handleProcessChangeDisRej = (value) => {
    if (value) {
      setSelectedProcessdr(value);
      getGorkCenterFilter(value);
    }
  };

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
      txtSchPlannedPath: array[0].txtSchPlannedPath,
      action: "",
      txtSchOrd: "", //array[0].txtSchOrd,
      txtSchItem: "", //array[0].txtSchItem,
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
      txtSchPlantwt: array[0].txtSchPlantwt,
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
    setScheduleDetailsData(filteredCoils);
    setCamputeStatus(false);
  };

  const getCoils = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setScheduleDetailsData([]);
    setModalFiled({});
    setClickTableDt(null);
    setLoading(true);
    setComputeRet([]);
    setCamputeStatus(false);
    var url;

    if (dateValue != null) {
      var recvDt = dateValue
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/ /g, "-")
        .replace("Sept", "Sep");
    }
    if (dateValueTo != null) {
      var recvDtTo = dateValueTo
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/ /g, "-")
        .replace("Sept", "Sep");
    }

    var data = {
      Plant: selectedPlant.value,
      Tonn: selectedTon.value ? selectedTon.value : "",
      Status: selectedStatus.value ? selectedStatus.value : selectedStatus,
      //Status: allValues.status ? allValues.status : "",
      BatchId: allValues.batch ? allValues.batch : "",
      ThickFR: allValues ? allValues.thikFrm : "",
      ThickTo: allValues.thikTo ? allValues.thikTo : "",
      WidthFr: allValues.widthFrm ? allValues.widthFrm : "",
      WidthTo: allValues.widthTo ? allValues.widthTo : "",
      Tdc: allValues.tdc ? allValues.tdc : "",
      ProdCd: allValues.prodCD ? allValues.prodCD : "",
      rcvDtFr: recvDt ? recvDt : "",
      rcvdtTo: recvDtTo ? recvDtTo : "",
      order: allValues.order ? allValues.order : "",
      item: allValues.item ? allValues.item : "",
      coilType:
        selectedCoilType && selectedCoilType.value
          ? selectedCoilType.value
          : "",
    };

    url = "api/LD50S003/getCoils";

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
            getPlanPathWire(true);
          }
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

  const compute = async (newToken = false) => {
    var scheduleTableRefDt = scheduleDtRef.getData();

    if (!scheduleTableRefDt[0].txtSchPlannedPath) {
      alertify.error("Please select planned path from schedule details table");
      setReadWriteAccess(true);
      return;
    }

    if (
      scheduleTableRefDt[0].action === "SLIT" &&
      !scheduleTableRefDt[0].txtSchOrd
    ) {
      alertify.error("Please select order from schedule details table");
      setReadWriteAccess(true);
      return;
    }

    if (
      scheduleTableRefDt[0].action === "SLIT" &&
      !scheduleTableRefDt[0].txtSchItem
    ) {
      alertify.error("Please select item from schedule details table");
      setReadWriteAccess(true);
      return;
    }
    if (!scheduleTableRefDt[0].txtSchTdc) {
      alertify.error("Please select TDC in schedule details table");
      setReadWriteAccess(true);
      return;
    }
    let mWidth = 0;
    let planWt = 0;
    let mAimWt = 0;
    let sumAimWtFix = 0;
    let finalAimWt = 0;
    let fixAimWt = 0;

    for (let i = 0; i < scheduleTableRefDt.length; i++) {
      mWidth = scheduleTableRefDt[i].txtSchWidth;
      mAimWt = scheduleTableRefDt[i].txtSchAimWt;
      planWt = scheduleTableRefDt[0].txtSchPlantwt;
      let currentSetupCd = scheduleTableRefDt[0]?.ddlSchStCD;
      let sumAimWt = 0;

      if (scheduleTableRefDt[i].action === "SLIT" && mWidth <= 0) {
        alertify.error("Width can't be blank!!!");
        setReadWriteAccess(true);
        return;
      }

      finalAimWt = finalAimWt + Number(mAimWt);
      fixAimWt = finalAimWt?.toFixed(3);
      // finalWidth = Number(finalWidth) + Number(mWidth);
      // if (finalWidth > selectedCoilWidth) {
      //   alertify.error("Width can't be greater than coil width.");
      //   setReadWriteAccess(true);
      //   return;
      // }
    }

    // if (
    //   scheduleTableRefDt[0].action === "SLIT" &&
    //   Number(fixAimWt) !== Number(planWt)
    // ) {
    //   alertify.error(
    //     `Aim wt - ${fixAimWt} should be equal to Plan wt - ${planWt}`
    //   );
    //   setReadWriteAccess(true);
    //   return;
    // }

    var hash = Object.create(null);
    var result = [];
    scheduleTableRefDt.forEach(function (o) {
      if (!hash[o.ddlSchStCD]) {
        hash[o.ddlSchStCD] = { ddlSchStCD: o.ddlSchStCD, txtSchWidth: 0 };
        result.push(hash[o.ddlSchStCD]);
      }
      hash[o.ddlSchStCD].txtSchWidth += +o.txtSchWidth;
    });

    for (let i = 0; i < result.length; i++) {
      if (result[i].txtSchWidth > selectedCoilWidth) {
        alertify.error("Width can't be greater than coil width.");
        setReadWriteAccess(true);
        return;
      }
    }

    if (scheduleDetailsData.length !== 0) {
      if (newToken) {
        const rsp = await getAuthorization();
      }
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      setLoading(true);
      var url;

      let data = [];
      let dataArr = scheduleDetailsData;
      // console.log("scheduleDetailsData: ", scheduleDetailsData);
      // console.log("=> ", rmDetailsDataTable?.getSelectedRows()[0]?._row?.data);
      for (let i = 0; i < dataArr.length; i++) {
        let x = scheduleDetailsData[i];
        data.push({
          plant: selectedPlant.value,
          batch: x?.txtSchBatch,
          process: "S",
          wrkInst: "",
          thick: x?.txtSchThick,
          width: x?.txtSchWidth,
          length: 0, //Length not present in grid
          prodCd: x?.txtSchProdCd,
          qltyCd: x?.txtSchQltycd,
          priority: "1",
          schdId: "1",
          combn: "",
          pageId: "LD50S003",
          planWt: x?.txtSchPlantwt,
          schWt: x?.txtSchAimWt,
          tdc: x?.txtSchTdc,
          coilWt:
            rmDetailsDataTable?.getSelectedRows()[0]?._row?.data
              ?.LOM_MS_PIECE_ACTL,
          noSlit: x?.txtSchNoslt,
          noPart: x?.txtSchNoPart,
          setupCd: x?.ddlSchStCD,
          ordNo: x?.action === "REWIND" ? "SC88888888" : x?.txtSchOrd,
          ordItem: x?.action === "REWIND" ? "0" : x?.txtSchItem,
          // planProc: x?.txtSchPlannedPath,
          planProc: "SKW",
          remarks: x?.txtSchRemark,
          action: x?.action,
        });
      }

      console.log("data: ", data);

      url = "api/LD50S003/compute";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            console.log("++> ", response);
            if (response?.data?.substr(0, 1) === "Y") {
              setBtnStatus(false);
              setTxtStatus(true);
              setCamputeStatus(true);
              setReadWriteAccess(false);
              alertify.success(
                "All Checks Computed Successfully. Please Press Confirm Button To Confirm PDIs !"
              );
            } else if (response?.data?.substr(0, 1) === "N") {
              alertify.error(`${response?.data}`);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    } else {
      alertify.error("No data available schedule details !");
    }
  };

  const confirm = async (newToken = false) => {
    if (scheduleDetailsData.length !== 0) {
      if (newToken) {
        const rsp = await getAuthorization();
      }
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      if (dateValue != null) {
        var recvDt = dateValue
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-")
          .replace("Sept", "Sep");
      }
      if (dateValueTo != null) {
        var recvDtTo = dateValueTo
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .replace(/ /g, "-")
          .replace("Sept", "Sep");
      }

      var url;

      var scheduleTableRefDt = scheduleDtRef.getData();

      var data = {
        plant: selectedPlant.value,
        batchId:
          rmDetailsDataTable?.getSelectedRows()[0]?._row?.data?.LOM_ID_BATCH,
      };
      setLoading(true);
      url = "api/LD50S003/confirm";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.outBinds.LS_OUT_FLAG.includes("Y")) {
              alertify.success(response.data.outBinds.LS_OUT_FLAG);
              setLoading(false);
            } else {
              alertify.error(response.data.outBinds.LS_OUT_FLAG);
              setLoading(false);
            }
          }
          getCoils(true);
          setCamputeStatus(false);
          setScheduleDetailsData([]);
          setLoading(false);
        })
        .finally((f) => {
          setLoading(false);
        });
      //};
    } else {
      setLoading(false);
      alertify.error("No data available schedule details !");
    }
  };

  const gvCoilsClm = [
    {
      title:
        '<input type="checkbox" class="select-all-row" aria-label="select all rows" />',
      field: "IsSelected",
      formatter: function (cell, formatterParams, onRendered) {
        return '<input type="checkbox" class="select-row" aria-label="select this row" />';
      },
      width: 30,
      headerSort: false,
      headerFilter: false,
      cssClass: "text-center",
      frozen: true,
      tooltips: false,
      resizable: false,
      cellClick: function (e, cell) {
        var element = cell.getElement();
        var chkbox = element.querySelector(".select-row");
        if (cell.getData().IsSelected) {
          cell.getRow().deselect();
          document.querySelector(".select-all-row").checked = false;
        } else {
          document
            .querySelectorAll(".select-row,.select-all-row")
            .forEach((cb) => (cb.checked = false));
          cell.getColumn().getTable().deselectRow();

          cell.getRow().select();
          if (
            cell.getColumn().getTable().getSelectedRows().length ===
            cell.getColumn().getTable().getDataCount()
          ) {
            document.querySelector(".select-all-row").checked = true;
          }
          setCounter(0);
          //var array = scheduleDetailsData;
          var txtSchWidthSc = cell.getData().LOM_SEC2;
          setSelectedCoilWidth(cell.getData().LOM_SEC2); //Added on date 22-03-2023
          //Added to path the default parameter in order filter popup.
          // modalFiled.tdc = cell.getData().LOM_TDC_ACTL;
          setSelectedTdc(cell.getData().LOM_TDC_ACTL);
          modalFiled.thick = cell.getData().LOM_SEC1.toFixed(3);

          setSelectRmTable(cell.getData());
          setScheduleDetailsData(null);
          let array = scheduleDetailsData.filter((item) => item.id == 0);
          array[counter] = {
            id: counter,
            ddlSchStCD: "A01",
            ddlSchProcLn: selectedProcess.label,
            txtSchBatch: cell.getData().LOM_ID_BATCH,
            ddlProcRt: "",
            // txtSchPlannedPath: Object.keys(plannedPath)[0],
            txtSchPlannedPath: "SKW",
            txtSchOrd: "",
            txtSchItem: "",
            txtSchScoOrd: "",
            txtSchScoItem: "",
            txtSchProdCd: cell.getData().LOM_CD_PROD,
            txtSchQltycd: cell.getData().LOM_CD_QLTY_ACTL,
            txtSchIdia: cell.getData().LOM_IDIA,
            txtSchMinwt: "",
            txtSchMaxwt: "",
            txtSchThick: cell.getData().LOM_SEC1,
            txtSchWidth: cell.getData().LOM_SEC2,
            txtSchLength: cell.getData().LOM_LENGTH,
            ddlSchOfcut: "N",
            txtSchTdc: cell.getData().LOM_TDC_ACTL,
            txtSchPlantwt: cell.getData().LOM_MS_PIECE_ACTL.toFixed(3),
            txtSchPktwt: "",
            txtSchNoslt: 1,
            txtSchNoPcs: "",
            txtSchNoStk: "",
            txtSchNoPkt: "",
            // txtSchAimWt: (
            //   (txtSchWidthSc / cell.getData().LOM_SEC2) *
            //   cell.getData().GROSS_CAL
            // ).toFixed(3) /******** */,
            txtSchAimWt: cell.getData().LOM_MS_PIECE_ACTL.toFixed(3),
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
          setScheduleDetailsData(array);
          setClickTableDt(cell.getData());
        }
        chkbox.checked = !cell.getData().IsSelected;
        cell.getData().IsSelected = !cell.getData().IsSelected;
        setEmpCounter(1);

        setCalPlantWt(Number(array[0].txtSchPlantwt));
        setTotalAimWt(Number(array[0].txtSchAimWt));
      },
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
      title: "Mark Customer",
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
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
    setSelectedProcess([]);
    setAllValues({});
    setDateValue(null);
    setDateValueTo(null);
    setRmDetailsData([]);
    setScheduleDetailsData([]);
    setClickTableDt(null);
    setSelectedCoilType([]);
    setSelectedStatus([]);
    setScheduleConfFilter({});
    setMbatchDetailsData([]);
    setSelectedProcessdr([]);
    setSelectedBatchIdValue([]);
    setSelectedStatusRej([]);
    setSelectedWorkCenter([]);
    setSelScheduleDetailsData([,]);
  };

  const orderColumn = [
    {
      formatter: "rowSelection",
      //titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Order Id",
      field: "ENC_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Item No",
      field: "ENC_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "ENC_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Qty.(TON)",
      field: "ENC_ORD_QUANTITY",
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
    // {
    //   title: "BTP(MT)",
    //   field: "SLT_BTP",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //     "title": "BTP", "field": "BTP_SLT", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    // },
    {
      title: "DELV DT",
      field: "ENC_DT_DELV",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Customer",
      field: "ENC_MARK_CUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Cust Name",
      field: "ENC_MARK_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TDC/Grade",
      field: "ENC_NO_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Min Thick",
      field: "ENC_SEC1_MIN",
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
      title: "Max Thick",
      field: "ENC_SEC1_MAX",
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
      title: "Min Width",
      field: "ENC_SEC2_MIN",
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
      title: "Max Width",
      field: "ENC_SEC2_MAX",
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
      field: "ENC_LENGTH_MAX",
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
    // { "title": "NO TRACKING", "field": "ENC_NO_TRACKING", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "DESPATCHED",
      field: "DESP",
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
      title: "DISPATCHABLE",
      field: "DISPL",
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
      title: "LINKED",
      field: "LINKED",
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
      title: "Customer Code",
      field: "ENC_CD_END_CUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "ENC_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material",
      field: "ENC_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc",
      field: "MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Product Cd",
      field: "ENC_CD_PROD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Crt Dt",
      field: "ENC_DT_ORD_CREATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Desc",
      field: "ENC_ORD_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ROADDEST DESC",
      field: "ENC_ROADDEST_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RAILDEST DESC",
      field: "ENC_RAILDEST_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    // if(orderDetails && orderDetails.length > 0){
    setSelectedGridTableModal(
      new Tabulator("#modalTable", {
        height: 300,
        pagination: "local",
        paginationSize: 20,
        data: orderDetails,
        columns: orderColumn,
        selectable: 1,
      })
    );
    // }
  }, [orderDetails]);

  const handleClose = () => {
    setOpen(false);
    var selectedRows = gridModal.getSelectedRows();
    var getIndex = orderIdIndex - 1;
    var array = scheduleDetailsData;
    var index = array.findIndex(({ id }) => id === getIndex);

    var orderWidth = selectedRows[0]._row.data.ENC_SEC2_MAX;
    var noSlt = 1;
    var coilWidth = rmTable.LOM_SEC2;
    var netWt = rmTable.LOM_MS_PIECE_ACTL;

    var calAimWt = ((orderWidth * noSlt) / coilWidth) * netWt;

    // var calAimWt =
    //   (selectedRows[0]._row.data.ENC_SEC2_MAX *
    //     rmTable.LOM_NO_PIECES *
    //     rmTable.GROSS_CAL) /
    //   rmTable.LOM_SEC2;

    array[index] = {
      id: index,
      ddlSchStCD: "A01",
      ddlSchProcLn: selectedProcess.label,
      txtSchBatch: array[index].txtSchBatch,
      ddlProcRt: array[index].ddlProcRt,
      txtSchPlannedPath: array[index].txtSchPlannedPath,
      action: array[index].action,
      txtSchScoOrd: array[index].txtSchScoOrd,
      txtSchScoItem: array[index].txtSchScoItem,
      txtSchIdia: selectedRows[0]._row.data.ENC_IDIA,
      txtSchMinwt: selectedRows[0]._row.data.ENC_MIN_PIECE_WT,
      txtSchMaxwt: selectedRows[0]._row.data.ENC_MAX_PIECE_WT,
      txtSchThick: array[index].txtSchThick,
      ddlSchOfcut: "N",
      txtSchPlantwt: array[index].txtSchPlantwt,
      txtSchPktwt: array[index].txtSchPktwt,
      txtSchNoslt: array[index].txtSchNoslt ? array[index].txtSchNoslt : 1,
      txtSchNoPcs: array[index].txtSchNoPcs,
      txtSchNoStk: array[index].txtSchNoStk,
      txtSchNoPkt: array[index].txtSchNoPkt,
      txtSchPkgTyp: array[index].txtSchPkgTyp,
      txtSchPkgDesc: array[index].txtSchPkgDesc,
      txtSchRwrkInd: array[index].txtSchRwrkInd,
      txtSchNoPart: array[index].txtSchNoPart,
      txtSchPlanRsn: array[index].txtSchPlanRsn,
      txtSchPlanRsnCode: array[index].txtSchPlanRsnCode,
      txtSchPlanRsnDesc: array[index].txtSchPlanRsnDesc,
      txtSchRemark: array[index].txtSchRemark,
      txtSchPlanfgGrd: array[index].txtSchPlanfgGrd,
      txtSchOrd: selectedRows[0]._row.data.ENC_ID_ORDER,
      txtSchItem: selectedRows[0]._row.data.ENC_NO_ITEM,
      txtSchWidth: selectedRows[0]._row.data.ENC_SEC2_MAX,
      txtSchLength: selectedRows[0]._row.data.ENC_LENGTH_MAX,
      txtSchQltycd: selectedRows[0]._row.data.ENC_CD_QLTY,
      txtSchProdCd: selectedRows[0]._row.data.ENC_CD_PROD,
      txtSchTdc: selectedRows[0]._row.data.ENC_NO_TDC,
      txtOrdMinWidth: selectedRows[0]._row.data.ENC_SEC2_MIN,
      txtOrdMaxWidth: selectedRows[0]._row.data.ENC_SEC2_MAX,
      txtSchAimWt: calAimWt.toFixed(3), //rmTable?.GROSS_CAL?.toFixed(3), //calAimWt.toFixed(3),
      delete: "",
    };

    setScheduleDetailsData(array);
  };

  const loadOrderModal = async (newToken = false, cell) => {
    //modalFiled.thick : "A"
    //var selectedRows =  scheduleDetailsData[2].txtSchWidth;
    setOpen(true);
  };

  const getOrderList = async (newToken = false) => {
    console.log("selectedTdc: ", selectedTdc);
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    if (selectedTdc?.length === 0 || selectedTdc === null) {
      alertify.error("Please select TDC");
      return;
    }
    var data = {
      Plant: selectedPlant.value,
      OrdId: modalFiled.order,
      OrdItem: modalFiled.item,
      OrdLength: "",
      OrdQltycd: "",
      OrdTdc: selectedTdc?.value ?? "", //modalFiled.tdc,
      //OrdProd: modalFiled.prodCd,
      OrdThick: modalFiled.thick,
      OrdWidth: modalFiled.width,
      OrdType: selectedOrdTyp.value,
      ProcessLine: selectedProcess.value,
    };
    setLoading(true);
    var url = "api/LD50S003/getOrdFilter";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          console.log("response.data: ", response.data[1]);
          if (response?.data[1]?.length === 0) {
            alertify.error("No Data Found!");
            return;
          }
          if (response.data[1]) {
            setOrderDetails(response.data[1]);
          } else {
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getPlanPathWire = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var data = {
      Plant: selectedPlant.value,
      SchPLine: selectedProcess.value,
      FltPLine: selectedProcess.value,
    };

    setLoading(true);
    var url = "api/LD50S003/getPlanPath";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          if (response.data) {
            var items = {};
            response.data.map((row) => {
              var rowArr = row.split(":");
              var obj = new Object();
              var rowArr = row.split(":");
              obj.label = rowArr[0] + "--" + rowArr[1];
              obj.value = rowArr[0];
              items[obj.value] = obj.label;
            });
            setPlannedPath(items);
          } else {
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const downloadOrderList = async (newToken = false) => {
    var date = new Date();
    var fileName = "LD50S003 " + date.toString() + ".xlsx";
    gridModal.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const saveInquiry = async () => {
    if (!selectedPlant.value) {
      alertify.error("Please select plant");
      return;
    }

    if (dateValue != null) {
      var prdPDt = dateValue
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")
        .replace("Sept", "Sep");
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "/api/LD50S003/getInqDetl";
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : null,
        Process: selectedProcess.value ? selectedProcess.value : null,
        BatchID: selectedBatchIdValue.value ? selectedBatchIdValue.value : null,
        Status: selectedStatusRej.value ? selectedStatusRej.value : "",
        OrdID: scheduleConfFilter.order ? scheduleConfFilter.order : null,
        OrdItm: scheduleConfFilter.item ? scheduleConfFilter.item : null,
        Prod_DT: prdPDt,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            if (response.data[1].length > 0) {
              setSelScheduleDetailsData(response.data[1]);
            } else {
              alertify.error("No Data Found");
              setSelScheduleDetailsData([,]);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const onClickDelete = async () => {
    var url = "/api/LD50S003/getScheduleDel";

    var selectedRows = selectedSchedulingConfirmTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    var newData = [];

    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });
    setLoading(true);
    if (
      selectedRows[0]._row.data.EWI_CD_STATUS == "WC" ||
      selectedRows[0]._row.data.EWI_CD_STATUS == "CN"
    ) {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        var data = {
          Plant: selectedPlant.value ? selectedPlant.value : null,
          dt: newData,
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              var results = response.data.outBinds.LS_OUT_FLAG;
              if (results) {
                alertify.success(results);
                saveInquiry();
              } else {
                alertify.error("No Data Found");
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Operation only available for WC And CN Status");
      setLoading(false);
      return;
    }
  };

  // const onClickDeleteMergeDetails = async () => {
  //   var selectedRowsSchConfirm =
  //     selectedSchedulingConfirmTable.getSelectedRows();
  //   if (selectedRowsSchConfirm.length == 0) {
  //     alertify.error("No rows selected");
  //     setLoading(false);
  //     return;
  //   }
  //   setLoading(true);
  //   GetAuthorization().then((token) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + token.accessToken,
  //       },
  //     };
  //     if (
  //       selectedRowsSchConfirm[0]._row.data.EWI_CD_STATUS == "WC" ||
  //       selectedRowsSchConfirm[0]._row.data.EWI_CD_STATUS == "CN"
  //     ) {
  //       var url = "/api/LD50S003/getScheduleDelMerge";

  //       var selectedRows = selectedMergeDt.getSelectedRows();
  //       if (selectedRows.length == 0) {
  //         alertify.error("No rows selected");
  //         setLoading(false);
  //         return;
  //       }

  //       var data = {
  //         Plant: scheduleConfFilter.plant.value,
  //         dt: selectedRowsSchConfirm[0]._row.data,
  //         dt2: selectedRows[0]._row.data,
  //       };
  //       axiosAPI
  //         .post(url, data, defaultOptions)
  //         .then((response) => {
  //           if (response.statusText != "" && response.statusText != "OK") {
  //           } else {
  //             var results = response.data.outBinds.LS_OUT_FLAG;
  //             if (results) {
  //               alertify.success(results);
  //               getMergeBatchDt();
  //             } else {
  //               alertify.error("No Data Found");
  //             }
  //           }
  //         })
  //         .finally((f) => {
  //           setLoading(false);
  //         });
  //     } else {
  //       alertify.error("Operation only available for WC And CN Status");
  //       setLoading(false);
  //       return;
  //     }
  //   });
  // };

  const getGorkCenterFilter = async (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD50S003/getWorkCenter";
      let data = {
        Plant: selectedPlant.value,
        Process: value ? value.value : "",
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
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
          setLoading(false);
        });
    });
  };

  const getBatchIdList = async (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "/api/LD50S003/getBatchId";
      let Plant = value ? value.value : "";
      axiosAPI
        .post(url, { Plant }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = response.data.map(([value]) => ({
              label: value,
              value,
            }));
            setBatchDDL3(items);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleWorkCenterChange = (value) => {
    if (value) {
      setSelScheduleDetailsData([,]);
      setSelectedWorkCenter(value);
    }
  };

  const handleStatusRejChange = (value) => {
    if (value) {
      setSelScheduleDetailsData([,]);
      setSelectedStatusRej(value);
    }
  };

  const handleBatchIdChange = (value) => {
    if (value) {
      setSelScheduleDetailsData([,]);
      setSelectedBatchIdValue(value);
    }
  };

  // const getMergeBatchDt = async () => {
  //   var selectedRows = selectedSchedulingConfirmTable.getSelectedRows();
  //   if (selectedRows.length == 0) {
  //     alertify.error("No rows selected");
  //     setLoading(false);
  //     return;
  //   }

  //   if (selectedRows.length > 1) {
  //     alertify.error("Only one row can be selected !");
  //     return;
  //   }

  //   var data = {
  //     Plant: selectedPlant.value,
  //     batchId: selectedRows[0]._row.data.EWI_ID_BATCH,
  //   };

  //   setLoading(true);
  //   GetAuthorization().then((token) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + token.accessToken,
  //       },
  //     };
  //     var url = "api/LD50S003/getMergeBatchDetails";
  //     axiosAPI
  //       .post(url, data, defaultOptions)
  //       .then((response) => {
  //         if (response.statusText != "" && response.statusText != "OK") {
  //           //reject(response.statusText);
  //         } else {
  //           if (response.data[1].length != 0) {
  //             setMbatchDetailsData(response.data[1]);
  //             setBtnStatus(true);
  //           } else {
  //             alertify.error("No Data Found");
  //             setMbatchDetailsData([]);
  //           }
  //         }
  //       })
  //       .finally((f) => {
  //         setLoading(false);
  //       });
  //   });
  // };

  const getProcessList = async (value) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      let data = {
        plant: value.value,
      };

      var url = "/api/LD50S003/getProcessList";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
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
            setProcessDDL2(items);
          }
        })
        .finally((f) => {});
    });
  };

  // const getStatusList = async (value) => {
  //   GetAuthorization().then((token) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + token.accessToken,
  //       },
  //     };
  //     let data = {
  //       process: value ? value.value : "",
  //     };

  //     var url = "/api/LD50S003/getStatusList";
  //     axiosAPI
  //       .post(url, data, defaultOptions)
  //       .then((response) => {
  //         if (response.statusText != "" && response.statusText != "OK") {
  //         } else {

  //           var items = [];
  //           response.data.map((row) => {
  //             var obj = new Object();
  //             obj.label = row[1];
  //             obj.value = row[1];
  //             items.push(obj);
  //           });
  //           setStatusList(items);
  //           var CSVOf_arr = items.map((item) => { return item.label });

  //           setSelectedStatus(CSVOf_arr);
  //         }
  //       })
  //       .finally((f) => { });
  //   });
  // };

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
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        open={open}
        // maxWidth="lg"
        maxWidth="xl"
        fullWidth="true"
        // height="auto"
      >
        <BootstrapDialogTitle id="draggable-dialog-title" onClose={handleClose}>
          Order Details
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <MDBox px={1} py={1}>
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
                    Order
                  </MDTypography>
                  <MDInput
                    name="order"
                    value={modalFiled.order || ""}
                    onChange={(e) => handleModalChange(e)}
                  />
                </Grid>
                <Grid item xs={0.75}>
                  <MDTypography
                    fontWeight="regular"
                    fontSize="small"
                    textTransform="capitalize"
                    variant="h6"
                    color={"dark"}
                    noWrap
                  >
                    Item
                  </MDTypography>
                  <MDInput
                    name="item"
                    value={modalFiled.item || ""}
                    onChange={(e) => handleModalChange(e)}
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
                    TDC
                  </MDTypography>
                  <ReactSelect
                    id="tdc"
                    value={selectedTdc}
                    options={tdcList}
                    onChange={handleTdcChange}
                    variant="h6"
                  />
                  {/* <MDInput
                    name="tdc"
                    value={modalFiled.tdc || ""}
                    onChange={(e) => handleModalChange(e)}
                    disabled
                  /> */}
                </Grid>
                {/* <Grid item xs={3}>
                                    <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Prod CD</MDTypography>
                                    <MDInput name="prodCd" value={modalFiled.prodCd || ''} onChange={(e) => handleModalChange(e)} />
                                </Grid> */}
                <Grid item xs={2} style={{ zIndex: 5 }}>
                  <MDTypography
                    fontWeight="regular"
                    fontSize="small"
                    textTransform="capitalize"
                    variant="h6"
                    color={"dark"}
                    noWrap
                  >
                    Order Type
                  </MDTypography>
                  {/* <MDInput name="ordTyp" value={modalFiled.ordTyp || ''} onChange={(e) => handleModalChange(e)} /> */}
                  <ReactSelect
                    id="ordtyp"
                    options={ordTypList}
                    onChange={handleOrdTypeChange}
                    variant="h6"
                    value={selectedOrdTyp}
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
                    Thick From
                  </MDTypography>
                  <MDInput
                    name="thick"
                    value={modalFiled.thick || ""}
                    onChange={(e) => handleModalChange(e)}
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
                    Thick
                  </MDTypography>
                  <MDInput
                    name="thick"
                    value={modalFiled.thick || ""}
                    onChange={(e) => handleModalChange(e)}
                    disabled
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
                    Width From
                  </MDTypography>
                  <MDInput
                    name="width"
                    value={modalFiled.width || ""}
                    onChange={(e) => handleModalChange(e)}
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
                    Width
                  </MDTypography>
                  <MDInput
                    name="width"
                    value={modalFiled.width || ""}
                    onChange={(e) => handleModalChange(e)}
                  />
                </Grid>
                <Grid item xs={1}>
                  <MDButton
                    style={{ marginTop: "1.5rem" }}
                    size="small"
                    color="info"
                    onClick={() => getOrderList(true)}
                  >
                    {" "}
                    Display{" "}
                  </MDButton>
                </Grid>
                <Grid item xs={1}>
                  <MDButton
                    style={{ marginTop: "1.5rem" }}
                    size="small"
                    color="info"
                    onClick={() => downloadOrderList(true)}
                  >
                    {" "}
                    Download{" "}
                  </MDButton>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
          <br />
          <Grid item xs={12}>
            <div id="modalTable"></div>
          </Grid>
        </DialogContent>
        <DialogActions>
          <MDButton
            style={{ marginTop: "1.5rem" }}
            size="small"
            color="info"
            onClick={handleClose}
          >
            {" "}
            Ok{" "}
          </MDButton>
        </DialogActions>
      </BootstrapDialog>
      {isRestricted == false && (
        <>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Schedule Details" icon={<Today />} />
                    <Tab label="Schedule Display/Rejection" icon={<Today />} />
                    <Tab label="Production Recording" icon={<Today />} />
                    {/* <Tab label="Schedule confirmation" icon={<Today />} /> */}
                  </Tabs>
                </AppBar>
              </Grid>
              {tabValue == 2 && (
                <Grid mx={0} mt={-4} py={1.25} px={1} item xs={12}>
                  <Card>
                    <LDSM004 />
                  </Card>
                </Grid>
              )}
              {tabValue == 1 && (
                <Grid item xs={12}>
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
                        <Grid container spacing={1.5}>
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
                              Plant *{" "}
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plant}
                              onChange={handlePlantChange}
                              value={selectedPlant}
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
                              Process{" "}
                            </MDTypography>
                            <ReactSelect
                              id="process"
                              options={processDDL2}
                              onChange={handleProcessChangeDisRej}
                              value={selectedProcessdr}
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
                              Batch ID{" "}
                            </MDTypography>
                            <ReactSelect
                              options={batchDDL3}
                              value={selectedBatchIdValue}
                              onChange={handleBatchIdChange}
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
                              Status{" "}
                            </MDTypography>
                            <ReactSelect
                              id="status"
                              options={statusListRej}
                              value={selectedStatusRej}
                              onChange={handleStatusRejChange}
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
                              Work Center{" "}
                            </MDTypography>
                            <ReactSelect
                              id="wCenter"
                              options={wCenter}
                              value={selectedWorkCenter}
                              onChange={handleWorkCenterChange}
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
                              {" "}
                              Order{" "}
                            </MDTypography>
                            <MDInput
                              name="order"
                              value={scheduleConfFilter?.order ?? ""}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  order: e.target.value,
                                })
                              }
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
                              {" "}
                              Item{" "}
                            </MDTypography>
                            <MDInput
                              name="item"
                              value={scheduleConfFilter?.item ?? ""}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  item: e.target.value,
                                })
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
                              Plan Production Date *
                            </MDTypography>
                            <DatePicker
                              id="prodPlnDt"
                              value={dateValue}
                              onChange={(date) => setDateValue(date)}
                            />
                          </Grid>
                        </Grid>

                        <Grid container spacing={1.5}>
                          <Grid item xs={1}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ marginTop: "1.5rem" }}
                              onClick={() => saveInquiry(true)}
                            >
                              Enquiry
                            </MDButton>
                          </Grid>
                          <Grid item xs={1}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ marginTop: "1.5rem" }}
                              onClick={() => onClickDelete(true)}
                            >
                              Delete
                            </MDButton>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                  <Grid item xs={12}>
                    <Card style={{ marginTop: "2rem" }}>
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
                              Scheduling Details
                            </MDTypography>
                          </Grid>

                          {/* <Grid item xs={1}>
                            <Tooltip title="Show Merge Batch Details" arrow>
                              <IconButton
                                color="white"
                                onClick={() => getMergeBatchDt(true)}
                              >
                                <FormatListBulletedIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid> */}
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          style={{ display: "none" }}
                        >
                          <Grid item xs={2}></Grid>
                          <Grid item xs={2}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ margin: "0.5rem" }}
                            >
                              Download
                            </MDButton>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="schedulingConfirmTable" />
                            Showing 1 to {selectScheduleDetData.length} of{" "}
                            {selectScheduleDetData.length} entries
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                    {/* {Merge != true && (
                      <Card style={{ marginTop: "2rem" }}>
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
                                Merge Detail
                              </MDTypography>
                            </Grid>
                            <Grid item xs={1}>
                              <Tooltip title="Delete" arrow>
                                <IconButton
                                  color="white"
                                  disabled={isReadWriteAccess}
                                  onClick={() =>
                                    onClickDeleteMergeDetails(true)
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </MDBox>
                        <MDBox px={3} py={3}>
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ display: "none" }}
                          >
                            <Grid item xs={2}></Grid>
                            <Grid item xs={2}></Grid>
                          </Grid>

                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <div id="mergeTable" />
                            </Grid>
                          </Grid>
                        </MDBox>
                      </Card>
                    )} */}
                  </Grid>
                </Grid>
              )}
              <Grid item xs={12}>
                <Card>
                  {tabValue == 0 && (
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
                          {/* <Grid item xs={1.5} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Process*
                            </MDTypography>
                            <ReactSelect
                              id="process"
                              options={process}
                              onChange={handleProcessChange}
                              value={selectedProcess}
                            />
                          </Grid> */}
                          {/* <Grid item xs={1.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Status
                            </MDTypography>
                            <ReactSelect
                              id="status"
                              options={statusList}
                              value={selectedStatus}
                              onChange={handleStatusChange}
                            />
                          </Grid> */}
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

                          <Grid item xs={0.65}>
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
                          </Grid>

                          {/* <Grid item xs={1.25} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Coil Type{" "}
                            </MDTypography>
                           
                            <ReactSelect
                              id="coiltype"
                              options={coilTypeList}
                              value={selectedCoilType}
                              onChange={handleCoilTypeChange}
                            />
                          </Grid> */}
                          {/* <Grid item xs={2} style={{ zIndex: 5 }}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    Net wt.
                                                </MDTypography>
                                                <ReactSelect
                                                    id="netWt"
                                                    options={netWt}
                                                    onChange={handleTonChange}
                                                />
                                            </Grid> */}
                          <Grid></Grid>
                          <br />
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
                          {/* {JSON.stringify(scheduleDetailsData)} */}
                        </Grid>
                      </MDBox>
                    </Card>
                  )}
                </Card>
              </Grid>
              <Grid item xs={12}>
                {tabValue == 0 && (
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
                )}
              </Grid>
              <Grid item xs={12}>
                {tabValue == 0 && (
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
                            <Tooltip title="Add">
                              <IconButton
                                color="white"
                                onClick={() => addEmptyRows(true)}
                              >
                                <LibraryAddIcon />
                              </IconButton>
                            </Tooltip>
                          }

                          {
                            <Tooltip title="Compute" arrow>
                              <IconButton
                                color="white"
                                onClick={() => compute(true)}
                              >
                                <ComputeIcon />
                              </IconButton>
                            </Tooltip>
                          }
                          {CamputeStatus && (
                            <Tooltip title="Confirm" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => confirm(true)}
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
                          <div id="scheduleDetailsTable" />
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "mediumvioletred",
                                "&:hover": {
                                  backgroundColor: "mediumvioletred",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              {"setup cd"}
                            </MDTypography>
                          </Box>
                        </Grid>
                        <Grid item xs={1}>
                          <Box display="flex">
                            <MDTypography fontSize={15}>
                              {"OrdClosure Est:"}
                            </MDTypography>
                          </Box>
                        </Grid>
                        <Grid item xs={1}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "yellow",
                                "&:hover": {
                                  backgroundColor: "yellow",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              {" 2-7 days"}
                            </MDTypography>
                          </Box>
                        </Grid>

                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "red",
                                "&:hover": {
                                  backgroundColor: "red",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              {" <2 days"}
                            </MDTypography>
                          </Box>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
