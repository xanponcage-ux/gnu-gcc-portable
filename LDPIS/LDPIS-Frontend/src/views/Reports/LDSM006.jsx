import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
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
import { CircularProgress } from "@mui/material";
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
import IconButton from "@mui/material/IconButton";
import ClearAllIcon from "@mui/icons-material/ClearAll";
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
import { GetAuthorization } from "utils";
import { devNull } from "os";
import { isNull } from "util";

export default function LDSM006() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [batch, setBatch] = useState("");
  const [Mbatch, setMBatch] = useState("");
  const [Pbatch, setPBatch] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [status, setStatus] = useState("");
  const [matnrNo, setMatnrNo] = useState("");
  const [selectedProdStartDt, setSelectedProdStartdt] = useState(null);
  const [selectedProdEndDt, setSelectedProdEndDt] = useState(null);
  const [selectedProc, setSelectedProc] = React.useState(null);
  const [prodInquiryData, setProdInquiryData] = React.useState([]);
  const [prodInquiryTable, setprodInquiryTable] = useState(null);
  const [SHIFT, setSHIFT] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [proc, setProc] = useState([]);
  const [qltycd, setQltyCd] = useState([]);
  const [selectedQltycd, setSelectedQltyCd] = React.useState(null);
  const tableRef = useRef(null);
  var customerTable = React.createRef();
  const [dateValueFrom, setDateValueFrom] = useState(null);
  const [dateValueTO, setDateValueTo] = useState(null);
  const [SchedDtValueFrom, setSchedDtValueFrom] = useState(null);
  const [SchedDtValueTo, setSchedDtValueTo] = useState(null);

  const [selectPname, setPname] = React.useState([]);
  const [selectedPname, setSelectPname] = React.useState([]);

  const [selectedMillNo, setSelectedMillNo] = useState("");
  const [millNo, setMillNo] = useState([
    { label: "MILL 1", value: "1" },
    { label: "MILL 2", value: "2" },
  ]);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      Promise.all([]).finally(() => {
        setLoading(false);
      });
    });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);

  const handleShiftChange = (value) => {
    setSelectedShift(value)
   
  };

  const numericFormatter = (cell) => {
  const value = cell?.getValue();

  if (value === null || value === undefined || value === "") {
    return value;
  }

  const num = Number(value);

  return !isNaN(num) ? num?.toFixed(3) : value;
};

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];
  const decimalFormatter = function (cell) {
  const value = cell.getValue();

  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  const num = Number(value);

  return isNaN(num) ? value : num.toFixed(3);
};

  const prodInquiryColumn = [
    {
      title: "Plant",
      field: "TBP_PLANT_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Id",
      field: "TBP_BATCH_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Curr Proc",
      field: "TBP_CD_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Proc No",
      field: "TBP_BATCH_PROC_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Nxt Proc",
      field: "TBP_NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Dt",
      field: "TBP_PROD_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Shift",
      field: "TBP_SHIFT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Weight (KG)",
      field: "TBP_WEIGHT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      cellEdited: function (cell) {},
    },
    {
      title: "Status",
      field: "TBP_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill No.",
      field: "MILL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Parent Batch",
      field: "TBP_PAR_COIL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "TBP_ID_FIRST_PAR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Heat NO",
      field: "TBP_HEAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord No",
      field: "TBP_ID_ORDER_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "TBP_ITEM_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Order",
      field: "CURR_ORD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Item",
      field: "CURR_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "External Seq No",
      field: "EXTERNAL_SEQ_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Cust Name",
      field: "MARK_CUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Grade",
      field: "ORD_GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Qlty Cd",
      field: "TBP_QUALITY_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mat No",
      field: "TBP_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },    
    {
      title: "Mat Desc",
      field: "MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Flag",
      field: "TBP_CD_FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Start Dt",
      field: "TBP_PROD_START_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod End Dt",
      field: "TBP_PROD_END_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Result",
      field: "TBP_RESULT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Remark",
      field: "TBP_REMARK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Heat No",
      field: "TBP_HEAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Inspector",
      field: "TBP_INSP_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "OD",
      field: "LOM_SEC2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Thick",
      field: "LOM_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Length",
      field: "LOM_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Flating0O10",
      field: "TBP_FLATNG_0_O_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Flating90O10",
      field: "TBP_FLATNG_90_O_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RBT10",
      field: "TBP_RBT_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Dia End10",
      field: "TBP_DIA_END_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Dia Body10",
      field: "TBP_DIA_BODY_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Round Body10",
      field: "TBP_OUT_ROUND_BODY_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Round End10",
      field: "TBP_OUT_ROUND_END_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Wall Thk Body10",
      field: "TBP_WALL_THK_BODY_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Wall Thk End10",
      field: "TBP_WALL_THK_END_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Strghtness TEnd10",
      field: "TBP_STRGHTNES_T_END_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Sqoc10",
      field: "TBP_SQOC_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Roc10",
      field: "TBP_ROC_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Flash Id10",
      field: "TBP_ID_FLASH_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Convx10",
      field: "TBP_CONVX_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Concv10",
      field: "TBP_CONCV_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Twist10",
      field: "TBP_TWIST_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Depth10",
      field: "TBP_DEPTH_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Width10",
      field: "TBP_WIDTHS_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Sample10",
      field: "TBP_SAMPLE_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WildTemp10",
      field: "TBP_WLD_TEMP_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill Spd10",
      field: "TBP_MILL_SPD_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current10",
      field: "TBP_CURRENTT_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Temp QN10",
      field: "TBP_TEMP_QN_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Voltage10",
      field: "TBP_VOLTAGE_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Frequency10",
      field: "TBP_FREQUENCY_10",
      headerFilter: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Norm Remp10",
      field: "TBP_NORMZ_TEMP_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Weld Power10",
      field: "TBP_WELD_POWER_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill Rmk10",
      field: "TBP_MILL_RMK_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Angle20",
      field: "TBP_ANGLE_20",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Gauge Id30",
      field: "TBP_GAUGE_ID_30",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Calib Dt30",
      field: "TBP_CALIB_DATE_30",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Calib DueDt30",
      field: "TBP_CALIB_DUE_DT_30",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Gauge Range30",
      field: "TBP_GAUGE_RANGE_30",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Obsv FEnd40",
      field: "TBP_OBSV_F_END_40",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Obsv TEnd40",
      field: "TBP_OBSV_T_END_40",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Res MGFEnd40",
      field: "TBP_RES_MG_F_END_40",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Res MGTEnd40",
      field: "TBP_RES_MG_T_END_40",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Ind No50",
      field: "TBP_NO_IND_50",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Mut Result50",
      field: "TBP_MUT_RESULT_50",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mut FEnd50",
      field: "TBP_MUT_F_END_50",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mut TEnd50",
      field: "TBP_MUT_T_END_50",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Calib Rmk50",
      field: "TBP_CALB_RMK_50",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "UT Rmk50",
      field: "TBP_UT_REMARK_50",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Visual Insp80",
      field: "TBP_VISUAL_INSP_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ecn Percen80",
      field: "TBP_ECN_PERCEN_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Angl FEnd80",
      field: "TBP_B_ANGL_F_END_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },

    {
      title: "Angl TEnd80",
      field: "TBP_B_ANGL_T_END_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "RootFace FEnd80",
      field: "TBP_ROOTFACE_F_END_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "RootFace TEnd80",
      field: "TBP_ROOTFACE_T_END_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Strghtness FEnd80",
      field: "TBP_STRGHTNES_F_END_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Squ FEnd80",
      field: "TBP_SQU_F_END_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Squ TEnd80",
      field: "TBP_SQU_T_END_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Asl No80",
      field: "TBP_ASL_NO_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Wid Min80",
      field: "TBP_WID_MIN_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Wid Max80",
      field: "TBP_WID_MAX_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Depth Min80",
      field: "TBP_DEPTH_MIN_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Depth Max80",
      field: "TBP_DEPTH_MAX_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Vdi FinRmk1 80",
      field: "TBP_VDI_FINAL_RMK_1_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Vdi FinRmk2 80",
      field: "TBP_VDI_FINAL_RMK_2_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Len Ft80",
      field: "TBP_LEN_FT_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Len Inch80",
      field: "TBP_LEN_INCH_80",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Create Dt",
      field: "TBP_CREATE_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Create User",
      field: "TBP_CREATE_USER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Updated on",
      field: "TBP_UPDATED_ON",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated By",
      field: "TBP_UPDATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "PipTmp BeBlst100",
      field: "TBP_PIPTMP_BEBLST_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "PipTmp BeAcid100",
      field: "TBP_PIPTMP_BEACID_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },

    {
      title: "Ph BeaAcid100",
      field: "TBP_PH_BEACID_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {         
      title: "Ph AfAcid100",
      field: "TBP_PH_AFACID_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "DwellTM100",
      field: "TBP_DWELLTM_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "PreDM WA100",
      field: "TBP_PREDM_WA_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Dmwa Fra1 100",
      field: "TBP_DMWA_FRA_1_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },

    {
      title: "Dmwa Fra2 100",
      field: "TBP_DMWA_FRA_2_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Dmwa Fra3 100",
      field: "TBP_DMWA_FRA_3_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirTem AftWa100",
      field: "TBP_AIRTEM_AFTWA_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Rh100",
      field: "TBP_RH_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Ambt Tmp100",
      field: "TBP_AMBT_TMP_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Dew Tmp100",
      field: "TBP_DEW_TMP_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Pipsur Tmp100",
      field: "TBP_PIPSUR_TEMP_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Deg Clean100",
      field: "TBP_DEG_CLEAN_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Rough100",
      field: "TBP_ROUGH_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Dust Lvlra100",
      field: "TBP_DUST_LVLRA_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Dust Lvlcl100",
      field: "TBP_DUST_LVLCL_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Salt Conta100",
      field: "TBP_SALT_CONTA_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Phosacid M100",
      field: "TBP_PHOSACID_M_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Phosacid Gr100",
      field: "TBP_PHOSACID_GR_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Phosacid Bh100",
      field: "TBP_PHOSACID_BH_100",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },

    {
      title: "PipTemp BeCrm110",
      field: "TBP_PIPTMP_BECRM_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Chrm Vis110",
      field: "TBP_CHRM_VISUAL_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Chrm Tmp110",
      field: "TBP_CHRM_TMP_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "PipTmp Afcrm110",
      field: "TBP_PIPTMP_AFCRM_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "PipTmp BefBe100",
      field: "TBP_PIPTMP_BEFBE_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Tmp Adhef Fil110",
      field: "TBP_TMP_ADHEF_FIL_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Tmp PeFlim110",
      field: "TBP_TMP_PEFILM_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "QunWa Betmp110",
      field: "TBP_QUN_WA_BETMP_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "QunWa Aftmp110",
      field: "TBP_QUN_WA_AFTMP_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun1 110",
      field: "TBP_EPGUN_1_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun2 110",
      field: "TBP_EPGUN_2_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun3 110",
      field: "TBP_EPGUN_3_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun4 110",
      field: "TBP_EPGUN_4_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun5 110",
      field: "TBP_EPGUN_5_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun6 110",
      field: "TBP_EPGUN_6_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun7 110",
      field: "TBP_EPGUN_7_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun8 110",
      field: "TBP_EPGUN_8_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun9 110",
      field: "TBP_EPGUN_9_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun10 110",
      field: "TBP_EPGUN_10_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun11 110",
      field: "TBP_EPGUN_11_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun12 110",
      field: "TBP_EPGUN_12_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun13 110",
      field: "TBP_EPGUN_13_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun14 110",
      field: "TBP_EPGUN_14_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun15 110",
      field: "TBP_EPGUN_15_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun16 110",
      field: "TBP_EPGUN_16_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun17 110",
      field: "TBP_EPGUN_17_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun18 110",
      field: "TBP_EPGUN_18_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun19 110",
      field: "TBP_EPGUN_19_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun20 110",
      field: "TBP_EPGUN_20_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun21 110",
      field: "TBP_EPGUN_21_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun22 110",
      field: "TBP_EPGUN_22_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun23 110",
      field: "TBP_EPGUN_23_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Epgun24 110",
      field: "TBP_EPGUN_24_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress1 110",
      field: "TBP_AIRPRESS_1_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress2 110",
      field: "TBP_AIRPRESS_2_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress3 110",
      field: "TBP_AIRPRESS_3_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress4 110",
      field: "TBP_AIRPRESS_4_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress5 110",
      field: "TBP_AIRPRESS_5_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress6 110",
      field: "TBP_AIRPRESS_6_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress7 110",
      field: "TBP_AIRPRESS_7_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress8 110",
      field: "TBP_AIRPRESS_8_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress9 110",
      field: "TBP_AIRPRESS_9_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress10 110",
      field: "TBP_AIRPRESS_10_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress11 110",
      field: "TBP_AIRPRESS_11_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress12 110",
      field: "TBP_AIRPRESS_12_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress13 110",
      field: "TBP_AIRPRESS_13_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress14 110",
      field: "TBP_AIRPRESS_14_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress15 110",
      field: "TBP_AIRPRESS_15_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress16 110",
      field: "TBP_AIRPRESS_16_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress17 110",
      field: "TBP_AIRPRESS_17_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress18 110",
      field: "TBP_AIRPRESS_18_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress19 110",
      field: "TBP_AIRPRESS_19_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress20 110",
      field: "TBP_AIRPRESS_20_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress21 110",
      field: "TBP_AIRPRESS_21_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress22 110",
      field: "TBP_AIRPRESS_22_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress23 110",
      field: "TBP_AIRPRESS_23_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "AirPress24 110",
      field: "TBP_AIRPRESS_24_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate1 110",
      field: "TBP_FLWRATE_1_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate2 110",
      field: "TBP_FLWRATE_2_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate3 110",
      field: "TBP_FLWRATE_3_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate4 110",
      field: "TBP_FLWRATE_4_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate5 110",
      field: "TBP_FLWRATE_5_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate6 110",
      field: "TBP_FLWRATE_6_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate7 110",
      field: "TBP_FLWRATE_7_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate8 110",
      field: "TBP_FLWRATE_8_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate9 110",
      field: "TBP_FLWRATE_9_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate10 110",
      field: "TBP_FLWRATE_10_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate11 110",
      field: "TBP_FLWRATE_11_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate12 110",
      field: "TBP_FLWRATE_12_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate13 110",
      field: "TBP_FLWRATE_13_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate14 110",
      field: "TBP_FLWRATE_14_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate15 110",
      field: "TBP_FLWRATE_15_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate16 110",
      field: "TBP_FLWRATE_16_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate17 110",
      field: "TBP_FLWRATE_17_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate18 110",
      field: "TBP_FLWRATE_18_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate19 110",
      field: "TBP_FLWRATE_19_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate20 110",
      field: "TBP_FLWRATE_20_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate21 110",
      field: "TBP_FLWRATE_21_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate22 110",
      field: "TBP_FLWRATE_22_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate23 110",
      field: "TBP_FLWRATE_23_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "FlwRate24 110",
      field: "TBP_FLWRATE_24_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Rm1 110",
      field: "TBP_RM_1_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rm2 110",
      field: "TBP_RM_2_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rm3 110",
      field: "TBP_RM_3_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rm4 110",
      field: "TBP_RM_4_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Manfact1 110",
      field: "TBP_MANFACT_1_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Manfact2 110",
      field: "TBP_MANFACT_2_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Manfact3 110",
      field: "TBP_MANFACT_3_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Manfact4 110",
      field: "TBP_MANFACT_4_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Chrm Gr110",
      field: "TBP_CHRM_GR_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Epoxy Gr110",
      field: "TBP_EPOXY_GR_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Adha Gr110",
      field: "TBP_ADHA_GR_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Pepp Gr110",
      field: "TBP_PEPP_GR_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Chrom Bh110",
      field: "TBP_CHROM_BH_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Epxy Bh110",
      field: "TBP_EPXY_BH_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Adha Bh110",
      field: "TBP_ADHA_BH_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Pepp Bh110",
      field: "TBP_PEPP_BH_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Lines Sped110",
      field: "TBP_LINES_SPED_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Epxy Dwpt110",
      field: "TBP_EPXY_DWPT_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Epgun No110",
      field: "TBP_NO_EPGUN_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hdpe Rpm01 110",
      field: "TBP_HDPE_RPM01_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Adhe Rpm110",
      field: "TBP_ADHE_RPM_110",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "CotThk1 120",
      field: "TBP_COT_THK_1_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk2 120",
      field: "TBP_COT_THK_2_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk3 120",
      field: "TBP_COT_THK_3_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk4 120",
      field: "TBP_COT_THK_4_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk5 120",
      field: "TBP_COT_THK_5_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk6 120",
      field: "TBP_COT_THK_6_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk7 120",
      field: "TBP_COT_THK_7_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk8 120",
      field: "TBP_COT_THK_8_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk9 120",
      field: "TBP_COT_THK_9_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk10 120",
      field: "TBP_COT_THK_10_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk11 120",
      field: "TBP_COT_THK_11_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotThk12 120",
      field: "TBP_COT_THK_12_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "CotWt Vs120",
      field: "TBP_COT_WT_VS_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: decimalFormatter
    },
    {
      title: "Coat Stas120",
      field: "TBP_COAT_STAS_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Test Pip120",
      field: "TBP_TEST_PIP_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Lab Tst120",
      field: "TBP_LAB_TST_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Fld Tst120",
      field: "TBP_FLD_TEST_120",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cb FEnd130",
      field: "TBP_CB_FEND_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cb Tend130",
      field: "TBP_CB_TEND_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ep Fend130",
      field: "TBP_EP_FEND_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ep Tend130",
      field: "TBP_EP_TEND_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ca Fend130",
      field: "TBP_CA_FEND_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ca Tend130",
      field: "TBP_CA_TEND_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Holidat 130",
      field: "TBP_HOLIDAT_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Resumg1 130",
      field: "TBP_RESUMG_1_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Resumg2 130",
      field: "TBP_RESUMG_2_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Resumg3 130",
      field: "TBP_RESUMG_3_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Resumg4 130",
      field: "TBP_RESUMG_4_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FStation 130",
      field: "TBP_FSTATION_130",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WorkCenter",
      field: "TBP_WORK_CENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rec CrtDt",
      field: "TBP_REC_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rec CrtBy",
      field: "TBP_REC_CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hold Rsn",
      field: "TBP_HOLD_RSN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sample Tag",
      field: "TBP_SAMPL_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    if (prodInquiryData && prodInquiryData.length > 0) {
      //setLoading(true);
      setprodInquiryTable(
        new Tabulator("#inquiryTable", {
          pagination: "local",
          paginationSize: 15,
          data: prodInquiryData,
          columns: prodInquiryColumn,
          // height: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [prodInquiryData]);

  const validateUser = async (token) => {
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          token.refreshToken,
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
      var pageName = "LDSM006";

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

  const clearFilterOnDate = () => {
    setProdInquiryData([]);
    setSelectedShift("");
    setprodInquiryTable(null);
  };

  const procList = [
    { value: "1", label: "10" },
    { value: "2", label: "20" },
    { value: "3", label: "30" },
    { value: "4", label: "40" },
    { value: "5", label: "50" },
    { value: "6", label: "60" },
    { value: "8", label: "80" },
    { value: "A", label: "90" },
    { value: "B", label: "100" },
    { value: "C", label: "110" },
    { value: "D", label: "120" },
    { value: "E", label: "130" },
    { value: "F", label: "150" },
    { value: "W", label: "W" },
  ];

  const qltyList = [
    { value: "PRIME", label: "PRIME" },
    { value: "SCRP", label: "SCRAP" },
  ];

  const handleProcListChange = (value) => {
    setSelectedProc(value);
    setProdInquiryData([]);
  };

  const handleQltyCdChange = (value) => {
    setSelectedQltyCd(value);
    setProdInquiryData([]);
  };

  const setTableNull = () => {
    setProdInquiryData([]);
  };

  const getData = () => {
    setLoading(true);
    GetAuthorization().then(async (token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
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
      const prodStartDt = formatDate(selectedProdStartDt);
      const prodEndDt = formatDate(selectedProdEndDt);
      console.log("prodstartdt", prodStartDt);
      console.log("prodstartdt", prodStartDt);
      var currentTime = new Date();
      var prodEndDateCheck = new Date(prodEndDt);
      if (prodEndDateCheck > currentTime) {
        alertify.error("The selected EndDt is greater than the current Date.");
        setLoading(false);
        return;
      }
      //if startdt is greater than endDt
      if (new Date(prodStartDt) > new Date(prodEndDt)) {
        alertify.error("StartDt must be less than EndDt");
        setLoading(false);
        return;
      }

      var data = {
        //Proc : selectedProc.value ? selectedProc.value : "",
        Batch: batch ? batch : "",
        MBatch: Mbatch ? Mbatch : "",
        PBatch: Pbatch ? Pbatch : "",
        OrdNo: ordNo ? ordNo : "",
        OrdItem: ordItem ? ordItem : "",
        Status: status ? status : "",
        MatnrNo: matnrNo ? matnrNo : "",
        QltyCd: selectedQltycd?.value ? selectedQltycd?.value : "",
        ProdDtFrom: prodStartDt ? prodStartDt : "",
        ProdDtTo: prodEndDt ? prodEndDt : "",
        shift:selectedShift?.value,
        millNo: selectedMillNo?.value ? selectedMillNo?.value : "",
      };
      if (selectedProc && selectedProc.value) {
        data.Proc = selectedProc.value;
      } else {
        data.Proc = "";
      }
      url = "api/LDSM006/getProdInqData";

      setLoading(true);

      await axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setProdInquiryData([]);
              setLoading(false);
            } else {
              setProdInquiryData(response.data);
              setLoading(false);
            }
            
          }
        })
        .catch((error) => {
          setProdInquiryData([]);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const clearFilter = () => {
    setSelectedProc(null);
    setBatch("");
    setMBatch("");
    setOrdNo("");
    setOrdItem("");
    setSelectedShift("");
    setStatus("");
    setMatnrNo("");
    setSelectedQltyCd(null);
    setSelectedProdStartdt(null);
    setSelectedProdEndDt(null);
    setProdInquiryData([]);
    setprodInquiryTable(null);
  };

  const downloadExcelInquiryTableData = () => {
    if (prodInquiryData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM006 " + ".xlsx";
    prodInquiryTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Reports"
        page="Production Inquiry"
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
                    py={0.25}
                    px={2}
                    // py={0.25}
                    // px={1}
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
                      <Grid item xs={0.9}>
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
                    <Grid container spacing={2}>
                      <Grid item xs={1.2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Proc Line*
                        </MDTypography>
                        <ReactSelect
                          options={procList}
                          onChange={(e) => {
                            handleProcListChange(e);
                            setTableNull();
                          }}
                          value={selectedProc}
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
                          Batch*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="batch"
                          value={batch}
                          onChange={(e) => {
                            setBatch(e.target.value);
                            setTableNull();
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
                          Pbatch*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Pbatch"
                          value={Pbatch}
                          onChange={(e) => {
                            setPBatch(e.target.value);
                            setTableNull();
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
                          Mbatch*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="Mbatch"
                          value={Mbatch}
                          onChange={(e) => {
                            setMBatch(e.target.value);
                            setTableNull();
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
                          Ord No*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="ordNo"
                          value={ordNo}
                          onChange={(e) => {
                            setOrdNo(e.target.value);
                            setTableNull();
                          }}
                        />
                      </Grid>
                      <Grid item xs={0.7}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Ord Item*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="ordItem"
                          value={ordItem}
                          onChange={(e) => {
                            setOrdItem(e.target.value);
                            setTableNull();
                          }}
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
                          Status*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="status"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                            setTableNull();
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
                          Material No*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="matnrNo"
                          value={matnrNo}
                          onChange={(e) => {
                            setMatnrNo(e.target.value);
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
                          {" "}
                          Prod Start Dt*{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedProdStartDt}
                          onChange={(date) => {
                            setSelectedProdStartdt(date), setTableNull();
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
                          Prod End Dt*{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedProdEndDt}
                          onChange={(date) => {
                            setSelectedProdEndDt(date), setTableNull();
                          }}
                        />
                      </Grid>
                      <Grid item xs={1.3}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Qlty Type*
                        </MDTypography>
                        <ReactSelect
                          options={qltyList}
                          onChange={(e) => {
                            handleQltyCdChange(e);
                            setTableNull();
                          }}
                          value={selectedQltycd}
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
                          Mill No.
                        </MDTypography>
                        <ReactSelect
                          id="millNO"
                          options={millNo}
                          value={selectedMillNo}
                          onChange={(e) => {
                            setSelectedMillNo(e);
                            setTableNull();
                          }}
                        />
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
                        <ReactSelect
                          options={ShiftType}
                          onChange={(e) => {
                            handleShiftChange(e);
                            
                          }}
                          value={selectedShift}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                          // onClick={() => getBusinessUnit(true)}
                        >
                          Submit
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
                          Production Inquiry Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        {/* <Tooltip title="Save Plan" arrow>
                                                    <IconButton color="white">
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip> */}
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelInquiryTableData()}
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
                        {prodInquiryData?.length > 0 && (
                          <div id="inquiryTable" />
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
                          Showing 1 to {prodInquiryData.length} of{" "}
                          {prodInquiryData.length} entries
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
