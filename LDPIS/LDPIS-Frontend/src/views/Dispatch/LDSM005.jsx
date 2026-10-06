import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import PrintIcon from "@mui/icons-material/Print";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
// Data
import SummarizeIcon from "@mui/icons-material/Summarize";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import MDAlert from "components/MDAlert";
import LDSM005LabelModal from "./Modals/LDSM005LabelModal";
import "../../tabulatorCss.scss";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { GetAuthorization } from "../../utils";
import LDSM005ScrapModal from "./Modals/LDSM005ScrapModal";
import LDSM005DefectRecordingModal from "./Modals/LDSM005DefectRecordingModal";
import axios from 'axios';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ReceiptIcon from '@mui/icons-material/Receipt';

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import ReactToPrint from 'react-to-print';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';


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

export default function LDSM005() {
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectStatus, setSelectStatus] = React.useState({
    label: "KB - Ready for Schedule / Processing  (Packaging)",
    value: "KB",
  });
  const [selectStatusCommercial, setSelectStatusCommercial] = React.useState({
    label: "KB - Ready for Schedule / Processing  (Packaging)",
    value: "KB",
  },{
    label: "WB - Ready for Schedule / Processing  (DESPATCH)",
    value: "WB",
  });
  
  //const [selectStatus, setSelectStatus] = React.useState({value:"KB"});
  const [isConfirm, setConfirm] = React.useState(true);
  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [tableData, setCustomerTable] = React.useState([]);
  const [selectedCustomerTable, setSelectedCustomerTable] = useState(null);

  const [tableKbData, setCustomerKbTable] = React.useState([]);
  const [selectedCustomerKbTable, setSelectedCustomerKbTable] = useState(null);

  const [tableKbScrapData, setCustomerKbScrapTable] = React.useState([]);
  const [selectedCustomerKbScrapTable, setSelectedCustomerKbScrapTable] = useState(null);

  const [selectPeocessId, setPeocessId] = React.useState([]);
  const [selectOrdTypeId, setOrdTypeId] = React.useState([]);
  const [selectOdiaList, setOdiaList] = React.useState([]);
  const [selectedOdia, setOdia] = React.useState([]);
  const [selectCustomerId, setCustomerId] = React.useState([]);
  const [bUnit, setBunit] = React.useState([]);
  const [selectedProcess, setSelectProcess] = React.useState([]);
  const [selectPname, setPname] = React.useState([]);
  const [selectedPname, setSelectPname] = React.useState([]);
  const [selectedOrd, setSelectOrdTyp] = React.useState([]);
  const [selectedCustomer, setSelectCustomer] = React.useState([]);
  const [stsList, setStsList] = useState([]);
  const [stsListComm,setStsListComm] =React.useState([{
    label: "KB - Ready for Schedule / Processing  (Packaging)",
    value: "KB",
  }
  ,{
    label: "WB - Ready for DISPATCH   (Packaging)",
    value: "WB",
  }
]);
  const [primeRsnList, setPrimeRsnList] = useState([]);
  const [labelDialogData, setLabelDialogData] = useState([]);
  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    status: "KB",
    tdc: "",
    order: "",
    item: "",
    batch: "",
    mBatch: "",
    custCd: "",
    prodCd: "",
    qualityCd: "",
    thikFrm: "",
    thikTo: "",
    // widthFrm: "",
    // widthTo: "",
    sco: "",
    //tracking: ""
  });
  const [labelModalOpen, setLabelModalOpen] = useState(null);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [dateValueFrom, setDateValueFrom] = useState(null);
  const [dateValueTO, setDateValueTo] = useState(null);
  const [PcsFlag, setPcsFlag] = useState(true);
  const [NetWtFlag, setNetWtFlag] = useState(true);
  const [GrossWtFlag, setGrossWtFlag] = useState(true);
  const [LocFlag, setLocFlag] = useState(true);
  const [pkgDateValueFrom, setPkgDateValueFrom] = useState(null);
  const [pkgDateValueTo, setPkgDateValueTo] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [showScrapModal, setShowScrapModal] = React.useState(false);
  const [showScrapKbModal, setShowScrapKbModal] = React.useState(false);
  const [scrapFlag, setScrapFlag] = useState("");
  const [scrapKbFlag, setScrapKbFlag] = useState("");
  const [actVal, setActVal] = useState(false);
  const [resultGenTubeData, setResultGenTubeData] = useState([]);
  const [resultGenTubeDataTable, setResultGenTubeDataTable] = useState(null);
  const [batchId, setBatchId] = useState([]);
  const [commRecorder,setCommRecorder] =useState(null);
  const [selectedBatchId, setSelectedBatchId] = React.useState([]);
  const [plantTube, setPlantTube] = useState([]);
  const [selectedPlantTube, setSelectedPlantTube] = React.useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [scrapMatTable, setScrapMatTable] = useState(null);
  const [scrapMatData, setScrapMatData] = useState([]);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [totalScrapWt, setTotalScrapWt] = useState(0);
  const [sumPrimeTubes, setSumPrimeTubes] = useState(0);
  const [showScrapWt, setShowScrapWt] = useState(false);
  const [isEnableQty, setIsEnableQty] = useState(false);

  const [open, setOpen] = React.useState(false);
  const [textValue, setTextValue] = React.useState("");

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const [isParentData, setIsParentData] = React.useState(true);

  <LDSM005ScrapModal toChild={isParentData} sendToParent={setIsParentData} />;

  function fetchData(data) {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    //page load functions here
    setLoading(true);
    Promise.all([
      getGroupPlantId(data.accessToken),
      getProdCat(data.accessToken),
      getStatusList(data.accessToken),
      getGroupPlantIdTube(data.accessToken),
      getCommRecorder(data.accessToken)
    ]).finally(() => {
      setLoading(false);
    });
  }
  const getCommRecorder = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      let data = {
        User: serverDetails.PersonalNo,
      };
      var url = "api/LDSM005/getCommRecorder";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            let found = false;
            for (let i = 0; i < response.data.length; i++) {
              if (response.data[i].includes(serverDetails.PersonalNo)) {
                found = true;
                break;
              }
            }
          
            if (found) {
              setCommRecorder('Y');
            } else {
              setCommRecorder('N');
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };
  
  //page load
  useEffect(() => {
    GetAuthorization().then((data) => {
      validateUser(data);
      fetchData(data);
    });
  }, []);

  useEffect(() => {
    if (
      primeRsnList &&
      selectedCustomerTable === null &&
      tableData?.length > 0
    ) {
      setSelectedCustomerTable(
        new Tabulator("#selCustomerTable", {
          pagination: "local", //enable local pagination.
          paginationSize: 12,
          data: tableData,
          columns: customerOrderColumn,
        })
      );
    } else if (tableData?.length === 0) {
      setSelectedCustomerTable(null);
    }
  }, [primeRsnList, tableData]);
  // scrap details
  useEffect(() => {
    if (scrapFlag == "1") {
      confirmCoil(true);
    }
  }, [scrapFlag]);

  useEffect(() => {
    if (scrapFlag == "2") {
      getDataBtnSubmit(true);
    }
  }, [scrapFlag]);
  //Ended

  useEffect(() => {
    if (resultGenTubeData && resultGenTubeData.length > 0) {
      setResultGenTubeDataTable(
        new Tabulator("#resultGentubetable", {
          data: resultGenTubeData,
          columns: genTubeColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [resultGenTubeData]);

  useEffect(() => {
    if (tableKbData && tableKbData.length > 0) {
      setSelectedCustomerKbTable(
        new Tabulator("#selCustomerKbTable", {
          pagination: "local",
          paginationSize: 12,
          data: tableKbData,
          columns: customerOrderKbColumn,
          selectable: 1,
        })
      );
    }
  }, [tableKbData]);

  useEffect(() => {
    if (tableKbScrapData && tableKbScrapData?.length > 0) {
      setSelectedCustomerKbScrapTable(
        new Tabulator("#scrapMatTableDivKB", {
          data: tableKbScrapData,
          columns: column_defect_recording,
          height: 300,
          layout: "fitColumns",
        })
      );
    }
  }, [tableKbScrapData]);

  const formulaKbCalc = (cell) => {
    var selectedRows = selectedCustomerKbTable.getSelectedRows();

    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push(item._row.data);
    });

    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
     
      let d = {
        plant: selectedPlant.value ? selectedPlant.value : '',
        procPath: selectedData[0].PLAN_PATH //props.inputValues.LOM_PLANNED_PROC
      };
      axiosAPI
        .post("api/LDSM034/getpphProductName", d, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var pName = response.data[0][0];
            let data = {
              plant: selectedPlant.value ? selectedPlant.value : '',
              batch_id: cell.getData()?.TBD_ID_BATCH,
              prod_name: pName,
              no_pcs: cell.getData()?.TBD_DEFECT_NO_PCS,
              length: 0,
              p_od: 0,
              p_id: 0,
              p_thk: 0,
            };
            axiosAPI
              .post("api/LDSM005/getPieceActl", data, defaultOptions)
              .then((response) => {
                if (response.statusText != "" && response.statusText != "OK") {
                } else {
                  if (cell.getData()?.TBD_DEFECT_NO_PCS == "0") {
                    cell.getRow()?.update({ TBD_DEFECT_WT: 0 });
                  } else if (cell.getData()?.TBD_DEFECT_NO_PCS == "") {
                    cell.getRow()?.update({ TBD_DEFECT_WT: "" });
                  } else {
                    cell.getRow()?.update({ TBD_DEFECT_WT: response.data[0][0] });
                  }
                }
              });
          }
        });
    });
  };


  const column_defect_recording = [
    {
      title: "Defect Code",
      field: "ESR_RSN_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Defect Description",
      field: "ESR_RSN_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "30%",
    },
    {
      title: "",
      field: "TBD_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "30%",
      visible: false
    },
    {
      title: "No. of Defective Tubes",
      field: "TBD_DEFECT_NO_PCS",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "30%",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: function (cell) {
        /*** fetch function for piece act */
        formulaKbCalc(cell);
      },
    },
    {
      title: "Defect Wt",
      field: "TBD_DEFECT_WT",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "30%",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      //visible: showScrapWt,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editor: "input",
      cellEdited: (cell) => {
        let defect_Wt = cell._cell.row.data.TBD_DEFECT_WT1;
        let defect_Wt_m = cell._cell.row.data.TBD_DEFECT_WT;
        if (totalScrapWt < defect_Wt_m && selectedStatus.value === "MQ") {
          alertify.error("Modify Defect Wt cannot be greater than Scrap Wt!");
          var row = cell.getRow();
          row.update({
            TBD_DEFECT_WT: defect_Wt,
          });
          return;
        }

      },
    },
  ];

  useEffect(() => {
    if (tableKbData.length != 0 && selectedCustomerKbTable != null) {
      selectedCustomerKbTable.on("rowSelectionChanged", function (data, rows) {
        if (data.length == 1) {
          displayScrapBatchPcsChange(data[0]);
        } else {
          setScrapMatData([,]);
        }
        return;
      });
    }
  }, [selectedCustomerKbTable]);

  const customerOrderKbColumn = [
    {
      formatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      cellClick: function (e, cell) {
        console.log(cell, e)
      }
    },
    {
      field: "LOM_ID_BATCH",
      title: "Batch ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "FG_MAT_NO",
      title: "FG Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "FG_MATERIAL_DESC",
      title: "FG Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "REMARKS",
      title: "Op Remarks",
      hozAlign: "left",
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
        var rl = cell._cell.row.data.REMARKS;
        row.update({
          REMARKS: rl,
        });

      },
    },
    {
      field: "LOM_ODIA",
      title: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_IDIA",
      title: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_SEC1",
      title: "Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: selectedPlant.value == "0789",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_CD_YRD",
      title: "Loc",
      //editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editorParams: {
        elementAttributes: {
          maxlength: "4",
        },
      },
      formatter: function (cell, formatterParams) {
        //cell.getElement().style["background-color"] = "#DA8EE7";
        //cell.getElement().style["color"] = "#FFFFFF";

        var value = cell.getValue();
        return value;
      },
      //editor: "input",
      cellEdited: (cell) => {
        var Loc = cell._cell.row.data.LOM_CD_YRD;
        var Loc1 = cell._cell.row.data.LOM_CD_YRD1;
        if (Loc.length > 4) {
          alertify.error(
            "Location value length should not be greater than four!"
          );
          var row = cell.getRow();
          row.update({
            LOM_CD_YRD: Loc1,
          });
          setNetWtFlag(false);
          return;
        } else {
          setNetWtFlag(true);
          var row = cell.getRow();
          row.update({
            LOM_CD_YRD: Loc,
          });
        }
      },
    },
    {
      field: "LOM_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor: "input",
      visible: selectedPlant.value == "0788",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        //cell.getElement().style["background-color"] = "#DA8EE7";
        //cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },

    {
      title: "Hidden",
      field: "LOM_NO_PIECES1",
      visible: false,
    },
    {
      field: "LOM_NO_PIECES",
      title: "Pcs",
      //editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
      //editor: "input",
      cellEdited: (cell) => {
        
        console.log(cell.getData().IsSelected);
        if (cell.getData().IsSelected == true) {
          var Pcs = cell._cell.row.data.LOM_NO_PIECES1;
          var Pcs_m = cell._cell.row.data.LOM_NO_PIECES;
          var ProductName = cell._cell.row.data.PPH_PRODUCT_NM;

          if (ProductName == "CEW" && selectedPlant.value == "0788") {
            var row = cell.getRow();
            row.update({
              LOM_NO_PIECES: Pcs_m,
            });
            setPcsFlag(true);
          } else {
            if (Pcs < Pcs_m) {
              alertify.error("Modify Pcs cannot be greater than current Pcs!");
              var row = cell.getRow();
              row.update({
                LOM_NO_PIECES: Pcs,
              });
              setPcsFlag(false);
              return;
            } else {
              setPcsFlag(true);
            }
          }

          if (actVal == false) {

            if (ProductName === "ERW") {
              GetAuthorization().then((token) => {
                var defaultOptions = {
                  headers: {
                    Authorization: "Bearer " + token.accessToken,
                  },
                };
                setLoading(true);
                let data = {
                  plant: selectedPlant.value,
                  batch_id: cell.getData()?.LOM_ID_BATCH,
                  prod_name: ProductName,
                  no_pcs: cell.getData()?.LOM_NO_PIECES,
                  length: cell.getData()?.LOM_LENGTH,
                  p_od: cell.getData()?.LOM_ODIA,
                  p_id: cell.getData()?.LOM_IDIA,
                  p_thk: cell.getData()?.LOM_SEC1,
                };

                axiosAPI
                  .post("api/LDSM005/getPieceActl", data, defaultOptions)
                  .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                      setLoading(false);
                    } else {
                      setLoading(false);

                      cell.getRow()?.update({ LOM_MS_PIECE_ACTL: response?.data[0][0] });
                      var NetWt = cell._cell.row.data.LOM_MS_PIECE_ACTL1;
                      var NetWt_m = cell._cell.row.data.LOM_MS_PIECE_ACTL;

                      if (NetWt < NetWt_m) {
                        alertify.error(`Modify Net Wt.-${NetWt_m} cannot be greater than current Net Wt.-${NetWt}`);
                        var row = cell.getRow();
                        row.update({
                          LOM_MS_PIECE_ACTL: NetWt,
                        });
                        setNetWtFlag(false);
                        return;
                      }

                      if (NetWt_m < NetWt) {
                        displayScrapBatchPcsChange(cell._cell.row.data);
                        return;
                      }

                    }
                  });
              });
            }

            if (ProductName == "CEW") {
              GetAuthorization().then((token) => {
                var defaultOptions = {
                  headers: {
                    Authorization: "Bearer " + token.accessToken,
                  },
                };
                setLoading(true);
                let data = {
                  plant: selectedPlant.value,
                  batch_id: cell.getData()?.LOM_ID_BATCH,
                  prod_name: ProductName,
                  no_pcs: cell.getData()?.LOM_NO_PIECES,
                  length: cell.getData()?.LOM_LENGTH,
                  p_od: cell.getData()?.LOM_ODIA,
                  p_id: cell.getData()?.LOM_IDIA,
                  p_thk: cell.getData()?.LOM_SEC1,
                };
                axiosAPI
                  .post("api/LDSM005/getPieceActl", data, defaultOptions)
                  .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                      setLoading(false);
                    } else {
                      setLoading(false);
                      cell.getRow()?.update({ LOM_MS_PIECE_ACTL: response?.data[0][0] });
                      var NetWt = cell._cell.row.data.LOM_MS_PIECE_ACTL1;
                      var NetWt_m = cell._cell.row.data.LOM_MS_PIECE_ACTL;

                      if (NetWt >= NetWt_m && ProductName == "CEW" && selectedPlant.value == "0788") {
                      } else if (NetWt < NetWt_m) {
                        alertify.error(`Modify Net Wt-${NetWt_m} cannot be greater than current net wt-${NetWt}`);
                        var row = cell.getRow();
                        row.update({
                          LOM_MS_PIECE_ACTL: NetWt,
                        });
                        setNetWtFlag(false);
                        return;
                      }

                      if (ProductName == "CEW" && selectedPlant.value == "0788") {
                        displayScrapBatchPcsChange(cell._cell.row.data);
                        return;
                      } else if (NetWt_m < NetWt) {
                        displayScrapBatchPcsChange(cell._cell.row.data);
                        return;
                      }

                    }
                  });
              });
            }


          }
        } else {
          alertify.error("Please select checkbox first")
        }
      },
    },
    {
      title: "Net Wt Hidden",
      field: "LOM_MS_PIECE_ACTL1",
      visible: false,
    },
    {
      field: "LOM_MS_PIECE_ACTL",
      title: "Net Wt",
      //editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        //cell.getElement().style["background-color"] = "#DA8EE7";
        //cell.getElement().style["color"] = "#FFFFFF";

        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      //editor: "input",
      cellEdited: (cell) => {
        var NetWt = Number(cell._cell.row.data.LOM_MS_PIECE_ACTL1);
        var NetWt_m = Number(cell._cell.row.data.LOM_MS_PIECE_ACTL);
        var Pcs = Number(cell._cell.row.data.LOM_NO_PIECES1);
        var Pcs_m = Number(cell._cell.row.data.LOM_NO_PIECES);

        if (NetWt < NetWt_m) {
          alertify.error(
            "Modify Net Wt cannot be greater than current net wt!"
          );
          var row = cell.getRow();
          row.update({
            LOM_MS_PIECE_ACTL: NetWt,
          });
          setNetWtFlag(false);
          return;
        }
        else {
          setNetWtFlag(true);
          var row = cell.getRow();
          if (Pcs == Pcs_m) {
            alertify.error("Please modify Pcs value also!");
            row.update({
              LOM_MS_PIECE_ACTL: NetWt,
            });
            setPcsFlag(false);
            return;
          }
          row.update({
            LOM_MS_PIECE_ACTL: NetWt_m,
          }); // +++ Added for scrap validation.
          if (NetWt > NetWt_m) {
            displayScrapBatchPcsChange(cell._cell.row.data);
            return;
          }
          // +++ Ended for scrap validation.
        }
      },
    },
    {
      title: "Gross Wt Hidden",
      field: "LOM_MS_GROSS_ACTL1",
      visible: false,
    },
    {
      field: "LOM_MS_GROSS_ACTL",
      title: "Gross Wt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
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
      field: "LOM_UOM",
      title: "UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Loc Hidden",
      field: "LOM_CD_YRD1",
      visible: false,
    },

    {
      field: "LOM_TDC_ACTL",
      title: "Grade",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_PROD",
      title: "Product Cd",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "LOM_CD_QLTY_ACTL",
      title: "Qlty",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },

    {
      field: "LOM_ID_ORDER_CUS",
      title: "Customer Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_ORD_ITEM_CUS",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "ORDER_TYPE",
      title: "Order Type",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "CUSTOMER_NAME",
      title: "Customer",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "LOM_CD_STATUS",
      title: "Status",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "STATUS_DESC",
      title: "Status Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_NO_CAST",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_FL_SEND_SAP",
      title: "Send sap",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_FIRST_PAR",
      title: "Mother Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_PAR_COIL_NO",
      title: "Parent Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_PASSED_PROC",
      title: "Passed Proc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_PREV_PROC",
      title: "Prev",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_CURR_PROC",
      title: "Curr",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_NEXT_PROC",
      title: "Next",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLAN_PATH",
      title: "Plan Path",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PRODUCT_NM",
      title: "Product Name",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_DT_PIECE_UPD",
      title: "Fg Declare dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_SHIFT",
      title: "Shift",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "AGE",
      title: "Age(Days)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_OP_DECSN",
      title: "Operator",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PARTY_DESC",
      title: "Ship to Party",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "STORAGE_LOC",
      title: "Storage Location",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "MARK_CUST",
      title: "Mark Customer",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MKCUSTOMER_NAME",
      title: "Mark Customer Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_TS_CREATION",
      title: "Production Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          //var newVal = new Date(value).toISOString().substring(0, 10);
          var date = new Date(value);
          var year = date.getFullYear();
          var month = date.getMonth();
          var dt = date.getDate();
          if (dt < 10) {
            dt = "0" + dt;
          }
          // if (month < 10) {
          //   month = "0" + month;
          // }
          var newVal =
            dt +
            "-" +
            months[month] +
            "-" +
            year +
            " " +
            date.toLocaleTimeString("en-US", {
              hour12: false,
            });
          return newVal;
        }
        return value;
      },
      headerFilter: "input",
    },
    {
      field: "PACKING_DT",
      title: "Packing Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PACKING_SHFT",
      title: "Packing Shift",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PACKED_BY",
      title: "Packed By",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MATNR",
      title: "Batch Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SPECEFICATION",
      title: "Spec",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MATR_DESC",
      title: "Batch Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CURR_WORK_CENT",
      title: "Work Center",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const validateUser = async (token) => {
    try {
      var plant = "";
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
      var pageName = "LDSM005";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

      if (authDetails) {
        // if (authDetails.payload.PS_AUTH_USER_SCR != "Y") {
        //   setRestricted(true);
        // } else {
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

  const getGroupPlantId = (accessToken) => {
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
              getProcDescval(items[0], accessToken),
              getOrderTypeVal(items[0], accessToken),
              getOdiaList(items[0], accessToken),
              getCustDescVal(items[0], accessToken),
              getProductName(items[0], accessToken)
            ]).finally(() => {
              resolve();
            });
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  const getProcDescval = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM005/getProcDesc";
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
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });
            setPeocessId(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getProductName = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM005/getpphProductName";
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
              obj.value = row[0];
              items.push(obj);
            });
            setPname(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getOrderTypeVal = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM005/getOrderType";
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
            setOrdTypeId(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getCustDescVal = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM005/getCustDesc";
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
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });
            setCustomerId(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getProdCat = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/GetProdCat";
      axiosAPI
        .post(url, {}, defaultOptions)
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
            setProdCat(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getStatusList = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM005/getStsList";
      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0] + " - " + row[1];
              obj.value = row[0];
              items.push(obj);
            });
            
            setStsList(items);
          }
          console.log(stsList);
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getSecRsns = async (plant, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      try {
        var url = "api/LDSM005/getSecRsns";
        var data = { Plant: plant.value };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              var items = {};
              response.data.map((row) => {
                items[row[1]] = row[1] + "--" + row[2];
              });

              setPrimeRsnList(items);
            }
          })
          .finally((f) => {
            resolve();
          });
      } catch {
        resolve();
      }
    });
  };

  const getBusinessCd = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/getBUnitCd";
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
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });

            setBunit(items[0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getOdiaList = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM005/getOdiaList";
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
              // var obj = new Object();
              // obj.label = parseFloat(value).toFixed(3);
              // obj.value = row[0];
              // items.push(obj);
              var obj = new Object();
              obj.label = parseFloat(row[1]).toFixed(3);
              obj.value = row[0];
              items.push(obj);
            });
            setOdiaList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
      setSelectProcess([]);
      setSelectStatus({
        label: "KB - Ready for Schedule / Processing  (Packaging)",
        value: "KB",
      });
      setCustomerTable([]);
      //Added by Tej on date 16-01-2023.
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(false);
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getProcDescval(value, data.accessToken),
          getOrderTypeVal(value, data.accessToken),
          getCustDescVal(value, data.accessToken),
          getBusinessCd(value, data.accessToken),
          getSecRsns(value, data.accessToken),
          getOdiaList(value, data.accessToken),
          getProductName(value, data.accessToken)
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      setSelectedPlant("");
    }
  };

  const handleProcessChange = (value) => {
    setSelectProcess(value);
    setCustomerTable([]);
  };

  const handlePnameChange = (value) => {
    if (value) {
      setSelectPname(value);
      setCustomerTable([]);
    } else {
      setSelectPname([]);
    }
  };

  const handleStatusChange = (value) => {
    setSelectStatus(value);
    setCustomerTable([]);
  };
  const handleStatusChangeCommercial = (value) => {
    setSelectStatusCommercial(value);
    setCustomerKbTable([]);
  };

  const handleOrdTypChange = (value) => {
    setSelectOrdTyp(value);
    setCustomerTable([]);
  };

  const handleOdiaChange = (value) => {
    setOdia(value);
    setCustomerTable([]);
  };

  const handleCustomerChange = (value) => {
    setSelectCustomer(value);
    setCustomerTable([]);
  };

  const getDataBtnSubmit = () => {
    if (selectedPlant.value != undefined) {

      setLoading(true);
      setConfirm(true);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(false);
      setPcsFlag(true);
      setNetWtFlag(true);
      setGrossWtFlag(true);
      setScrapFlag("");

      var url;
      var data;
      var receiDtFrm = document.getElementById("receiDtFrm").value;
      var receiDtTo = document.getElementById("receiDtTo").value;

      var pkgDtFrm = document.getElementById("pkgDtFrm").value;
      var pkgDtTo = document.getElementById("pkgDtTo").value;

      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        Process: selectedProcess ? selectedProcess.value : "",
        PName: selectedPname ? selectedPname.value : "",
        // Status: allValues.status,
        Status: selectStatus ? selectStatus : "",
        Order_ID: allValues.order,
        OrderItem: allValues.item,
        batch: allValues.batch,
        Mbatch: allValues.mBatch,
        ProdCd: allValues.prodCd,
        QltyCd: allValues.qualityCd,
        // Thick1: allValues.thikTo,
        // Thick2: allValues.thikFrm,
        Thick1: allValues.thikFrm,
        Thick2: allValues.thikTo,
        // Width1: allValues.widthFrm,
        // Width2: allValues.widthTo,
        TDC: allValues.tdc,
        SCO: allValues.sco,
        OrderType: selectedOrd,
        ProdDtFrom: receiDtFrm,
        ProdDtTo: receiDtTo,
        Customer: selectedCustomer ? selectedCustomer.value : "",
        Odia: selectedOdia ? selectedOdia.value : "",
        PkgDtFrom: pkgDtFrm,
        PkgDtTo: pkgDtTo,
      };

      // if (bUnit.label == "WIRE") {
      //     url = "api/LDSM005/getCoils_Wires";
      // } else {
      url = "api/LDSM005/getCoils";
      //}

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
              if (response.data[1].length != 0) {
                setCustomerTable([]);
                setCustomerTable(response.data[1]);
              } else {
                setCustomerTable([]);
                alertify.error("No Data Found");
              }
            }
          })
          .catch((error) => {
            setCustomerTable([]);
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Please Select Plant!");
    }
  };

  const getKBDataBtnSubmit = () => {
    if (selectedPlant.value != undefined) {
      setLoading(true);
      setScrapKbFlag("");
      var url;

      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        Process: selectedProcess ? selectedProcess.value : "",
        PName: selectedPname ? selectedPname.value : "",
        Status: selectStatusCommercial ? selectStatusCommercial : "",
        Order_ID: allValues.order,
        OrderItem: allValues.item,
        batch: allValues.batch,
        Mbatch: allValues.mBatch,
        ProdCd: allValues.prodCd,
        QltyCd: allValues.qualityCd,
        Thick1: allValues.thikFrm,
        Thick2: allValues.thikTo,
        TDC: allValues.tdc,
        SCO: allValues.sco,
        OrderType: selectedOrd,
        Customer: selectedCustomer ? selectedCustomer.value : "",
        Odia: selectedOdia ? selectedOdia.value : "",
      };

      url = "api/LDSM005/getKbCoils";

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
              if (response.data[1].length != 0) {
                setCustomerKbTable(response.data[1]);
              } else {
                setCustomerKbTable([]);
                alertify.error("No Data Found");
              }
            }
          })
          .catch((error) => {
            setCustomerKbTable([]);
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Please Select Plant!");
    }
  };

  const displayScrapBatchPcsChange = (dt) => {
    console.log(dt);
    setLoading(true);
    var data = {
      Plant: selectedPlant.value ? selectedPlant.value : "",
      userId: serverDetails.PersonalNo,
      Batch: dt.LOM_ID_BATCH,
      MBatch: dt.LOM_ID_FIRST_PAR,
      Process: selectedPlant.value == "0788" ? "K" : dt.LOM_CD_CURR_PROC,
    };

    let url = "api/LDSM005/getScrapDetails";

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      setLoading(true);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var result = response.data[1];
            let finalData = [];
            for (var i in result) {
              var rowdata = result[i];
              finalData.push({
                id: rowdata.SR_NO,
                SCRAP_BATCH_ID: rowdata.SCRAP_BATCH_ID,
                NO_OF_SCRAP_TUBES: rowdata.NO_OF_SCRAP_TUBES
                  ? rowdata.NO_OF_SCRAP_TUBES
                  : "",
                SCRAP_WT: rowdata.SCRAP_WT ? rowdata.SCRAP_WT : "",
                CD_CURR_PROC: "W",
                CD_NEXT_PROC: "W",
                CD_PROD: "",
                NO_TDC: "",
                BATCH_TYPE: "COMSCRP",
                CD_QLTY: "SCRP",
                FG_MATNR: rowdata.SCRP_MATNR ? rowdata.SCRP_MATNR : "",
                SCRP_MATNR: rowdata.SCRP_MATNR ? rowdata.SCRP_MATNR : "",
                MATERIAL_DESC: rowdata.MATERIAL_DESC
                  ? rowdata.MATERIAL_DESC
                  : "",
                IDIA: 0,
                ODIA: 0,
                SEC1: 0,
                SEC2: 0,
                LENGTH: 0,
              });
            }
            setScrapMatData(finalData);
          }
        })
        .catch((error) => {
          setScrapMatData([]);
        })
        .finally((f) => {
          setLoading(false);
        });
    });

  };


  const options = {
    height: 400,
    pagination: "local",
    paginationSize: 200,
    layout: "fitDataFill",
    downloadDataFormatter: (data) => data,
    downloadReady: (fileContents, blob) => blob,
    // responsiveLayout:"collapse",
    // responsiveLayoutCollapseStartOpen:false,
  }; ``

  var delayIcon = (cell, formatterParams, onRendered) => {
    return "<i class='fa-solid fa-square' style='color:#49a3f1'></i>";
  };

  const customerOrderColumn = [
    // {
    //     formatter: "rowSelection",
    //    // titleFormatter: "rowSelection",
    //     hozAlign: "center",
    //     download: false,
    //     headerSort: false,
    //     frozen: true

    // },
    // {
    //   title:
    //     '<input type="checkbox" class="select-all-row" aria-label="select all rows" />',
    //   field: "IsSelected",
    //   formatter: function (cell, formatterParams, onRendered) {
    //     return '<input type="checkbox" class="select-row" aria-label="select this row" />';
    //   },
    //   width: 50,
    //   headerSort: false,
    //   headerFilter: false,
    //   cssClass: "text-center",
    //   frozen: true,
    //   tooltips: false,
    //   resizable: false,
    //   cellClick: function (e, cell) {
    //     var element = cell.getElement();
    //     var chkbox = element.querySelector(".select-row");

    //     if (cell.getData().IsSelected) {
    //       cell.getRow().deselect();
    //       document.querySelector(".select-all-row").checked = false;
    //     } else {
    //       cell.getRow().select();
    //       if (
    //         cell.getColumn().getTable().getSelectedRows().length ===
    //         cell.getColumn().getTable().getDataCount()
    //       ) {
    //         document.querySelector(".select-all-row").checked = true;
    //       }
    //     }
    //     chkbox.checked = !cell.getData().IsSelected;
    //     cell.getData().IsSelected = !cell.getData().IsSelected;
    //     if (isReadWriteAccess == false) {
    //       setConfirm(false);
    //     }
    //   },
    //   headerClick: function (e, column) {
    //     if (
    //       column.getTable().getSelectedRows().length !==
    //       column.getTable().getDataCount()
    //     ) {
    //       document
    //         .querySelectorAll(".select-row,.select-all-row")
    //         .forEach((cb) => (cb.checked = true));
    //       column.getTable().selectRow();
    //     } else {
    //       document
    //         .querySelectorAll(".select-row,.select-all-row")
    //         .forEach((cb) => (cb.checked = false));
    //       column.getTable().deselectRow();
    //     }
    //     column
    //       .getCells()
    //       .forEach(
    //         (cell) => (cell.getData().IsSelected = !cell.getData().IsSelected)
    //       );
    //   },
    // },

    {
      title: '',
      field: "IsSelected",
      formatter: function (cell, formatterParams, onRendered) {
        return '<input type="checkbox" class="select-row" aria-label="select this row" />';
      },
      width: 50,
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
        } else {
          cell.getRow().select();
        }
        chkbox.checked = !cell.getData().IsSelected;
        cell.getData().IsSelected = !cell.getData().IsSelected;
        if (isReadWriteAccess == false) {
          setConfirm(false);
        }
      },
     headerClick: null ,//function (e, column) {
    //     if (
    //       column.getTable().getSelectedRows().length !==
    //       column.getTable().getDataCount()
    //     ) {
    //       document
    //         .querySelectorAll(".select-row,.select-all-row")
    //         .forEach((cb) => (cb.checked = true));
    //       column.getTable().selectRow();
    //     } else {
    //       document
    //         .querySelectorAll(".select-row,.select-all-row")
    //         .forEach((cb) => (cb.checked = false));
    //       column.getTable().deselectRow();
    //     }
    //     column
    //       .getCells()
    //       .forEach(
    //         (cell) => (cell.getData().IsSelected = !cell.getData().IsSelected)
    //       );
    //   },

    },
    {
      field: "LOM_ID_BATCH",
      title: "Batch ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "FG_MAT_NO",
      title: "FG Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "FG_MATERIAL_DESC",
      title: "FG Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "field": "LOM_CD_QLTY_ACTL", "title": "Qlty", "headerFilter": "input", "headerFilterPlaceholder": "search...", frozen: true },
    // // { "field": "GRADE_DESC", "title": "Grade Desc", "headerFilter": "input", "headerFilterPlaceholder": "search...", frozen: true },
    // { "field": "LOM_ID_ORDER_CUS", "title": "Customer Order", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_ID_ORD_ITEM_CUS", "title": "Item", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "LOM_ODIA",
      title: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_IDIA",
      title: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      }
    },
    {
      field: "FG_SPEC",
      title: "FG_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false
    },
    {
      field: "LOM_SEC1",
      title: "Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: selectedPlant.value == "0789",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_CD_YRD",
      title: "Loc",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editorParams: {
        elementAttributes: {
          maxlength: "4",
        },
      },
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";

        var value = cell.getValue();
        return value;
      },
      editor: "input",
      cellEdited: (cell) => {
        var Loc = cell._cell.row.data.LOM_CD_YRD;
        var Loc1 = cell._cell.row.data.LOM_CD_YRD1;
        if (Loc.length > 4) {
          alertify.error(
            "Location value length should not be greater than four!"
          );
          var row = cell.getRow();
          row.update({
            LOM_CD_YRD: Loc1,
          });
          setNetWtFlag(false);
          return;
        } else {
          setNetWtFlag(true);
          var row = cell.getRow();
          row.update({
            LOM_CD_YRD: Loc,
          });
        }
      },
    },
    {
      field: "LOM_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      visible: selectedPlant.value == "0788",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    // { "field": "LOM_NO_PIECES", "title": "Pcs", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_MS_PIECE_ACTL", "title": "Net Wt", "headerFilter": "input", "headerFilterPlaceholder": "search...", bottomCalc:"sum", bottomCalcParams:{precision:3} },
    {
      title: "Hidden",
      field: "LOM_NO_PIECES1",
      visible: false,
    },
    {
      field: "LOM_NO_PIECES",
      title: "Pcs",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editor: "input",
      cellEdited: (cell) => {
        console.log(cell.getData().IsSelected);
        if (cell.getData().IsSelected == true) {
          var Pcs = cell._cell.row.data.LOM_NO_PIECES1;
          var Pcs_m = cell._cell.row.data.LOM_NO_PIECES;
          var ProductName = cell._cell.row.data.PPH_PRODUCT_NM;

          if (ProductName == "CEW" && selectedPlant.value == "0788") {
            var row = cell.getRow();
            row.update({
              LOM_NO_PIECES: Pcs_m,
            });
            setPcsFlag(true);
          } else {
            if (Pcs < Pcs_m) {
              alertify.error("Modify Pcs cannot be greater than current Pcs!");
              var row = cell.getRow();
              row.update({
                LOM_NO_PIECES: Pcs,
              });
              setPcsFlag(false);
              return;
            } else {
              setPcsFlag(true);
            }
          }

          if (actVal == false) {

            if (ProductName === "ERW") {
              GetAuthorization().then((token) => {
                var defaultOptions = {
                  headers: {
                    Authorization: "Bearer " + token.accessToken,
                  },
                };
                setLoading(true);
                let data = {
                  plant: selectedPlant.value,
                  batch_id: cell.getData()?.LOM_ID_BATCH,
                  prod_name: ProductName,
                  no_pcs: cell.getData()?.LOM_NO_PIECES,
                  length: cell.getData()?.LOM_LENGTH,
                  p_od: cell.getData()?.LOM_ODIA,
                  p_id: cell.getData()?.LOM_IDIA,
                  p_thk: cell.getData()?.LOM_SEC1,
                };

                axiosAPI
                  .post("api/LDSM005/getPieceActl", data, defaultOptions)
                  .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                      setLoading(false);
                    } else {
                      setLoading(false);

                      cell.getRow()?.update({ LOM_MS_PIECE_ACTL: response?.data[0][0] });
                      var NetWt = cell._cell.row.data.LOM_MS_PIECE_ACTL1;
                      var NetWt_m = cell._cell.row.data.LOM_MS_PIECE_ACTL;

                      if (NetWt < NetWt_m) {
                        alertify.error(`Modify Net Wt.-${NetWt_m} cannot be greater than current Net Wt.-${NetWt}`);
                        var row = cell.getRow();
                        row.update({
                          LOM_MS_PIECE_ACTL: NetWt,
                        });
                        setNetWtFlag(false);
                        return;
                      }

                      if (NetWt_m < NetWt) {
                        setNetWtFlag(true);
                        setSelectedData(cell._cell.row.data);
                        setShowScrapModal(true);
                        setScrapFlag("0");
                        return;
                      }

                    }
                  });
              });
            }

            if (ProductName == "CEW") {
              GetAuthorization().then((token) => {
                var defaultOptions = {
                  headers: {
                    Authorization: "Bearer " + token.accessToken,
                  },
                };
                setLoading(true);
                let data = {
                  plant: selectedPlant.value,
                  batch_id: cell.getData()?.LOM_ID_BATCH,
                  prod_name: ProductName,
                  no_pcs: cell.getData()?.LOM_NO_PIECES,
                  length: cell.getData()?.LOM_LENGTH,
                  p_od: cell.getData()?.LOM_ODIA,
                  p_id: cell.getData()?.LOM_IDIA,
                  p_thk: cell.getData()?.LOM_SEC1,
                };
                axiosAPI
                  .post("api/LDSM005/getPieceActl", data, defaultOptions)
                  .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                      setLoading(false);
                    } else {
                      setLoading(false);
                      cell.getRow()?.update({ LOM_MS_PIECE_ACTL: response?.data[0][0] });
                      var NetWt = cell._cell.row.data.LOM_MS_PIECE_ACTL1;
                      var NetWt_m = cell._cell.row.data.LOM_MS_PIECE_ACTL;

                      if (NetWt >= NetWt_m && ProductName == "CEW" && selectedPlant.value == "0788") {
                      } else if (NetWt < NetWt_m) {
                        alertify.error(`Modify Net Wt-${NetWt_m} cannot be greater than current net wt-${NetWt}`);
                        var row = cell.getRow();
                        row.update({
                          LOM_MS_PIECE_ACTL: NetWt,
                        });
                        setNetWtFlag(false);
                        return;
                      }

                      if (ProductName == "CEW" && selectedPlant.value == "0788") {
                        setNetWtFlag(true);
                        setSelectedData(cell._cell.row.data);
                        setShowScrapModal(true);
                        setScrapFlag("0");
                        return;
                      } else if (NetWt_m < NetWt) {
                        setNetWtFlag(true);
                        setSelectedData(cell._cell.row.data);
                        setShowScrapModal(true);
                        setScrapFlag("0");
                        return;
                      }

                    }
                  });
              });
            }


          }
        } else {
          alertify.error("Please select checkbox first")
        }
      },
    },
    {
      title: "Net Wt Hidden",
      field: "LOM_MS_PIECE_ACTL1",
      visible: false,
    },
    {
      field: "LOM_MS_PIECE_ACTL",
      title: "Net Wt",
      editor: "input",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";

        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      editor: "input",
      cellEdited: (cell) => {
        var NetWt = Number(cell._cell.row.data.LOM_MS_PIECE_ACTL1);
        var NetWt_m = Number(cell._cell.row.data.LOM_MS_PIECE_ACTL);
        var Pcs = Number(cell._cell.row.data.LOM_NO_PIECES1);
        var Pcs_m = Number(cell._cell.row.data.LOM_NO_PIECES);

        if (NetWt < NetWt_m) {
          alertify.error(
            "Modify Net Wt cannot be greater than current net wt!"
          );
          var row = cell.getRow();
          row.update({
            LOM_MS_PIECE_ACTL: NetWt,
          });
          setNetWtFlag(false);
          return;
        }
        else {
          setNetWtFlag(true);
          var row = cell.getRow();
          if (Pcs == Pcs_m) {
            alertify.error("Please modify Pcs value also!");
            row.update({
              LOM_MS_PIECE_ACTL: NetWt,
            });
            setPcsFlag(false);
            return;
          }
          row.update({
            LOM_MS_PIECE_ACTL: NetWt_m,
          }); // +++ Added for scrap validation.
          if (NetWt > NetWt_m) {
            setSelectedData(cell._cell.row.data);
            setShowScrapModal(true);
            setScrapFlag("0");
            return;
          }
          // +++ Ended for scrap validation.
        }
      },
    },
    {
      title: "Gross Wt Hidden",
      field: "LOM_MS_GROSS_ACTL1",
      visible: false,
    },
    {
      field: "LOM_MS_GROSS_ACTL",
      title: "Gross Wt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      // editor: "input", cellEdited: (cell) => {
      //     var GrossWt = (cell._cell.row.data.LOM_MS_GROSS_ACTL1);
      //     var GrossWt_m = (cell._cell.row.data.LOM_MS_GROSS_ACTL);
      //     if (GrossWt < GrossWt_m) {
      //         alertify.error("Modify Gross Wt cannot be greater than current Gross wt!");
      //         // var row = cell.getRow();
      //         // row.update({
      //         //   "LOM_MS_GROSS_ACTL": GrossWt
      //         // });
      //         setGrossWtFlag(false);
      //         return;
      //     } else {
      //         setGrossWtFlag(true);
      //     }
      // }
    },
    {
      field: "LOM_UOM",
      title: "UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Loc Hidden",
      field: "LOM_CD_YRD1",
      visible: false,
    },
    // {
    //     "field": "LOM_ODIA", "title": "ODIA", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return parseFloat(value).toFixed(3);
    //         }
    //         return value;
    //     }
    // },
    // {
    //     "field": "LOM_SEC2", "title": "Width", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return parseFloat(value).toFixed(3);
    //         }
    //         return value;
    //     }
    // },
    {
      field: "LOM_TDC_ACTL",
      title: "Grade",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_PROD",
      title: "Product Cd",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "LOM_CD_QLTY_ACTL",
      title: "Qlty",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    // { "field": "GRADE_DESC", "title": "Grade Desc", "headerFilter": "input", "headerFilterPlaceholder": "search...", frozen: true },
    {
      field: "LOM_ID_ORDER_CUS",
      title: "Customer Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_ORD_ITEM_CUS",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "field": "FG_MAT_NO", "title": "FG Material No", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "FG_MATERIAL_DESC", "title": "FG Material Desc", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "ORDER_TYPE",
      title: "Order Type",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //     "field": "LOM_CD_YRD", "title": "Loc",
    //     editor: "input", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     editorParams: {
    //         elementAttributes: {
    //           maxlength: "4",
    //         },
    //       },
    //     formatter: function (cell, formatterParams) {
    //         cell.getElement().style["background-color"] = "#DA8EE7";
    //         cell.getElement().style["color"] = "#FFFFFF";

    //         var value = cell.getValue();
    //         return value;
    //     },
    //      editor: "input", cellEdited: (cell) => {

    //         var Loc = (cell._cell.row.data.LOM_CD_YRD);
    //         var Loc1 = (cell._cell.row.data.LOM_CD_YRD1);
    //          if (Loc.length > 4) {
    //             alertify.error("Location value length should not be greater than four!");
    //             var row = cell.getRow();
    //             row.update({
    //               "LOM_CD_YRD": Loc1
    //             });;
    //             setNetWtFlag(false)
    //             return;
    //         } else {
    //             setNetWtFlag(true);
    //             var row = cell.getRow();
    //             row.update({
    //                 "LOM_CD_YRD": Loc
    //             });
    //         }
    //     },
    // },
    //{ "field": "STORAGE_LOCATION", "title": "Storage Loc", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_ID_ORDER", "title": "SCO Order", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_NO_ITEM", "title": "Item", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "CUSTOMER_NAME",
      title: "Customer",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //     "field": "SEC_RSN", "title": "Prime II Rsn Cd", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     editor: "list",
    //     editorParams: {
    //       allowEmpty: true,
    //       showListOnEmpty: true,
    //       values: primeRsnList,
    //     },
    //     formatter:"lookup",
    //     formatterParams:primeRsnList
    // },

    // {
    //     "field": "txtSecondsRsnDesc", "title": "Prime II Rsn Desc", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         cell.getElement().style["background-color"] = "#DA8EE7";
    //         cell.getElement().style["color"] = "#FFFFFF";
    //         return value;
    //     }
    // },
    {
      field: "LOM_CD_STATUS",
      title: "Status",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "STATUS_DESC",
      title: "Status Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_NO_CAST",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_FL_SEND_SAP",
      title: "Send sap",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_FIRST_PAR",
      title: "Mother Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_PAR_COIL_NO",
      title: "Parent Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_PASSED_PROC",
      title: "Passed Proc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_PREV_PROC",
      title: "Prev",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_CURR_PROC",
      title: "Curr",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_NEXT_PROC",
      title: "Next",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLAN_PATH",
      title: "Plan Path",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PRODUCT_NM",
      title: "Product Name",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_DT_PIECE_UPD",
      title: "Fg Declare dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_SHIFT",
      title: "Shift",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "AGE",
      title: "Age(Days)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_OP_DECSN",
      title: "Operator",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PARTY_DESC",
      title: "Ship to Party",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "STORAGE_LOC",
      title: "Storage Location",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    //{ "field": "PACKAGE_TYPE", "title": "Pkg Type", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_IDIA", "title": "IDIA", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // {
    //     "field": "LOM_ODIA", "title": "ODIA", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return parseFloat(value).toFixed(3);
    //         }
    //         return value;
    //     }
    // },
    //{ "field": "PRODUCT_DESC", "title": "Product Description", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_SLIT_STATUS", "title": "Slit Status", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_YIELD_STRENGTH", "title": "Yield Strength", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_TENTATIVE_LENGTH", "title": "Tentative Length", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_FINAL_JAC_GRD", "title": "Plan Fg Grade", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    //{ "field": "LOM_FINAL_JAC_GRD", "title": "Source Coil id", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "MARK_CUST",
      title: "Mark Customer",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MKCUSTOMER_NAME",
      title: "Mark Customer Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_TS_CREATION",
      title: "Production Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          //var newVal = new Date(value).toISOString().substring(0, 10);
          var date = new Date(value);
          var year = date.getFullYear();
          var month = date.getMonth();
          var dt = date.getDate();
          if (dt < 10) {
            dt = "0" + dt;
          }
          // if (month < 10) {
          //   month = "0" + month;
          // }
          var newVal =
            dt +
            "-" +
            months[month] +
            "-" +
            year +
            " " +
            date.toLocaleTimeString("en-US", {
              hour12: false,
            });
          return newVal;
        }
        return value;
      },
      headerFilter: "input",
    },
    {
      field: "PACKING_DT",
      title: "Packing Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PACKING_SHFT",
      title: "Packing Shift",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PACKED_BY",
      title: "Packed By",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MATNR",
      title: "Batch Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SPECEFICATION",
      title: "Spec",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MATR_DESC",
      title: "Batch Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CURR_WORK_CENT",
      title: "Work Center",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // { "field": "ssi_acceptable_mass", "title": "Acceptable Mass", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "SSI_YIELD_APPROVAL", "title": "Approval arrival at a time of planning", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "", "title": "Attachment and Remarks for Prime II workflow", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // {
    //     "field": "txtIdia", "title": "Idia", editor: "input", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         cell.getElement().style["background-color"] = "#409aef";
    //         return value;
    //     }
    // }
  ];

  var dateOnly = function (value, data, type, params, column) {
    if (value) {
      //var newVal = new Date(value).toISOString().substring(0, 10);
      var date = new Date(value);
      var year = date.getFullYear();
      var month = date.getMonth();
      var dt = date.getDate();

      if (dt < 10) {
        dt = "0" + dt;
      }
      var newVal = dt + "-" + months[month] + "-" + year;
      return newVal;
    }
    return value;
  };

  //date time formatter
  var dateTimeOnly = function (value, data, type, params, column) {
    if (value) {
      //var newVal = new Date(value).toISOString().substring(0, 10);
      var date = new Date(value);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var dt = date.getDate();

      if (dt < 10) {
        dt = "0" + dt;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var newVal =
        dt + "/" + month + "/" + year + " " + date.toLocaleTimeString();
      return newVal;
    }
    return value;
  };

  //decimal formatter
  var decimalFormat = function (value, data, type, params, column) {
    if (value) {
      var decVal = value.toFixed(3);
      return decVal;
    }
    return value;
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const downloadExcelcustomerTableData = () => {
    if (tableData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "LDSM005 " + date.toString() + ".xlsx";
    selectedCustomerTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleLabelModalOpen = (type) => {
    var selectedRows = selectedCustomerTable.getSelectedRows();
    let counter = false;
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
      if (!counter && item._row.data?.LOM_CD_STATUS !== 'WB') {
        counter = true
      }
    });
    if (newData.length !== 1) {
      alertify.error("Please select a single row to print the label");
      return;
    } else if (counter) {
      alertify.error("Only WB batches allowed for FG LABEL");
      return;
    } else {
      setLabelModalOpen(type);
      setLabelDialogData(newData);
    }
  };

  const accessLabelDialogData = () => {
    return labelDialogData;
  };

  const confirmCoil = () => {
    if (selectedPlant.value != undefined) {
      var selectedRows = selectedCustomerTable.getSelectedRows();
      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });
      if (newData.length == 0) {
        alertify.error("Please select atleast 1 row to confirm !");
        return;
      }
      if (PcsFlag == false) {
        alertify.error("Modify Pcs cannot be greater than current Pcs!");
        return;
      }
      if (NetWtFlag == false) {
        alertify.error("Modify Net Wt cannot be greater than current net wt!");
        return;
      }
      if (GrossWtFlag == false) {
        alertify.error(
          "Modify Gross Wt cannot be greater than current Gross wt!"
        );
        return;
      }

      if (LocFlag == false) {
        alertify.error(
          "Modify Location value length not be greater than four!"
        );
        return;
      }
      if (scrapFlag == "0") {
        alertify.error("Please provide the scrap details!");
        return;
      }
      setLoading(true);

      var url = "";

      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        dt: newData,
        userId: serverDetails.PersonalNo,
        scrapFlag: scrapFlag,
      };
      // if (bUnit.label == "WIRE") {
      //     url = "api/LDSM005/CONFIRM_Wires";
      // } else {
      url = "api/LDSM005/CONFIRM";
      //}
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response) {
              var results = response.data;
              if (results) {
                if (results.includes("N-")) {
                  setShowSaveMsgSuccess(false);
                  setShowSaveMsgError(true);
                  setSaveMsg(results);
                  alertify.error(
                    `${results?.substring(0, 100)} ${results.length > 100 ? "..." : ""
                    }`
                  );
                  setConfirm(true);
                } else {
                  setShowSaveMsgSuccess(true);
                  setShowSaveMsgError(false);
                  setSaveMsg(results);
                  alertify.success(
                    `${results?.substring(0, 100)} ${results.length > 100 ? "..." : ""
                    }`
                  );
                  setCustomerTable([]); //Added by Tej.
                  setConfirm(true);
                }
              } else {
                setShowSaveMsgSuccess(false);
                setShowSaveMsgError(true);
                alertify.error("Error Occured !");
                setSaveMsg("Error Occured !");
              }
            } else {
              alertify.error("No Data Found");
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Please Select Plant!");
    }
  };

  const clearFilter = () => {
    setSelectedPlant([]);
    setSelectPname([]);
    setSelectStatus([]);
    setSelectProcess([]);
    setSelectOrdTyp([]);
    setSelectCustomer([]);
    setAllValues({});
    // setGridData([]);
    setCustomerTable([]);
    setDateValueFrom(null);
    setDateValueTo(null);
    setPkgDateValueFrom(null);
    setPkgDateValueTo(null);
    setSelectedCustomerTable(null);
  };

  function MyVerticallyCenteredModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Modal heading
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Modal</h4>
          <p>Message!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  const getGroupPlantIdTube = async (accessToken) => {
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
            setPlantTube(items);
            setSelectedPlantTube(items[0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChangeTube = (value) => {
    setSelectedPlantTube(value);
    GetAuthorization().then((token) => {
      Promise.all([getBatch(value, token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getBatch = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      if (value?.value) {
        var url = "api/LDSM005/getBatchId";
        axiosAPI
          .post(url, { plant: value.value, status: "" }, defaultOptions)
          .then((response) => {
            if (response?.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              var items = [];
              response?.data?.map((row) => {
                var obj = new Object();
                obj.label = row[0];
                obj.value = row[0];
                items.push(obj);
              });
              setBatchId(items);
            }
          })
          .finally(() => {
            resolve();
          });
      } else {
        resolve();
      }
    });
  };

  const handleBatchIdChange = (value) => {
    setSelectedBatchId(value);
  };

  const generateIndividualTube = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: selectedPlant.value,
        batch: selectedBatchId.value,
      };

      var url = "api/LDSM005/getIndTubesData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data found");
            } else {
              setResultGenTubeData(response.data[0]);
            }
          }
        })
        .catch((error) => { })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const downloadExcelGenTubeResultTable = () => {
    if (resultGenTubeDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = resultGenTubeDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM005_Ind_Tubes" + ".xlsx";

    resultGenTubeDataTable.download("xlsx", fileName, {
      sheetName: "LDSM005",
    });
  };

  const genTubeColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Code Type",
      field: "CD_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
  ];

  useEffect(() => {
    if (scrapMatData && scrapMatData?.length > 0) {
      setScrapMatTable(
        new Tabulator("#scrapMatTableDiv", {
          data: scrapMatData,
          columns: scrapMatColumn,
          maxHeight: 400,
          layout: "fitDataFill",

        })
      );
    }
  }, [scrapMatData]);

  const formulaCalc = (cell) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      let dt = selectedCustomerKbTable.getData();
      let d = {
        plant: selectedPlant.value ? selectedPlant.value : '',
        procPath: dt[0].PLAN_PATH
      };
      axiosAPI
        .post("api/LDSM034/getpphProductName", d, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var pName = response.data[0][0];
            let data = {
              plant: selectedPlant.value,
              batch_id: dt[0].LOM_ID_BATCH,
              prod_name: pName,
              no_pcs: cell.getData()?.NO_OF_SCRAP_TUBES,
              length: 0,
              p_od: 0,
              p_id: 0,
              p_thk: 0,
            };
            axiosAPI
              .post("api/LDSM005/getPieceActl", data, defaultOptions)
              .then((response) => {
                if (response.statusText != "" && response.statusText != "OK") {
                } else {
                  if (cell.getData()?.NO_OF_SCRAP_TUBES == "0") {
                    cell.getRow()?.update({ SCRAP_WT: 0 });
                  } else if (cell.getData()?.NO_OF_SCRAP_TUBES == "") {
                    cell.getRow()?.update({ SCRAP_WT: "" });
                  } else {
                    cell.getRow()?.update({ SCRAP_WT: response.data[0][0] });
                  }
                }
              });
          }
        });
    });
  };

  const scrapMatColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      width: 5,
    },
    {
      title: "Scrap Batch Id",
      field: "SCRAP_BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 220,
    },
    {
      title: "Scrap Tubes(nos)",
      field: "NO_OF_SCRAP_TUBES",
      headerFilter: "input",
      editor: "number",
      width: 200,
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";

        if (value) {
          return parseInt(value);
        }
        return value;
      },
      cellEdited: function (cell) {
        /*** fetch function for piece act */
        formulaCalc(cell);
        this.recalc();
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Scrap Wt. (KG)",
      field: "SCRAP_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 220,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    // {
    //   title: "Defect Recording",
    //   formatter: listBtn2,
    //   cellClick: btncallback2,
    //   align: "center",
    // },
    {
      title: "Scrap Material No ",
      field: "SCRP_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 180,
    },
    {
      title: "Scrap Material Desc",
      field: "MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
  ];

  const SaveKBbatches = () => {
    if (selectedPlant.value != undefined) {
      var selectedRows = selectedCustomerKbTable.getSelectedRows();
      var selectedRowsScrap = scrapMatTable.getSelectedRows();

      if (selectedRows.length == 0) {
        alertify.error("Please select rows");
        return;
      }

      if (!selectedRows[0]._row.data.REMARKS || selectedRows[0]._row.data.REMARKS.length < 3) {
        alertify.error("Please give Remarks.");
        return;
      }

      if (selectedRowsScrap.length == 0) {
        alertify.error("Please select rows");
        return;
      }
      if (selectedRowsScrap.length > 1 ) {
        alertify.error("Please select only one row");
        return;
      }
      var calcResults = scrapMatTable.getCalcResults();

// If we have bottom calculations in our table, they will be stored in the 'bottom' property
      if (calcResults && calcResults.bottom) {
// Access the sum of the 'SCRAP_WT' column from the bottom calculations
        var scrapWtSum = calcResults.bottom["SCRAP_WT"];
        var scrapPcSum = Number(calcResults.bottom["NO_OF_SCRAP_TUBES"]).toFixed(0);
      }
      var totalwt=(Number(selectedRows[0]._row.data.LOM_MS_PIECE_ACTL)).toFixed(3);
      var totalpcs=(Number(selectedRows[0]._row.data.LOM_NO_PIECES)).toFixed(0);
      console.log(scrapWtSum,totalwt);
      console.log(totalpcs,scrapPcSum);
      if (totalpcs < scrapPcSum) {
        alertify.error("Total Scrap tubes should be less than or equal  to  total pcs displayed in above table!");
        return;
      }
      if (scrapWtSum != totalwt) {
        alertify.error("Total Scrap Wt should be equal to  total wt displayed in above table!");
        return;
      }
      var newData = [];
      selectedRowsScrap.forEach(function (item) {
        var rowdata=item._row.data;
        // if (rowdata.NO_OF_SCRAP_TUBES == "") {
        //   alertify.error("Scrap tubes(nos) cannot blank !");
        //   return;
        // }
        if (!(Number(rowdata.SCRAP_WT) > 0) || rowdata.SCRAP_WT == "") {
          alertify.error("Scrap Wt cannot blank!");
          return;
        }
        newData.push(item._row.data);
      });

      setLoading(true);

      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        scrapDt: newData,
        dt: selectedRows[0]._row.data,
        userId: serverDetails.PersonalNo
      };

      var url = "api/LDSM005/saveKbBatches";

      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.data) {
              var res = response.data;
              console.log(res);
              console.log(res?.[0]);
              if (res.includes("N-")) {
                alertify.error(res?.[0])
              } else {
                setScrapMatData([,]);
                getKBDataBtnSubmit();
                alertify.success(res?.[0])
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Please Select Plant!");
    }
  };

  const handelDownloadFGLable = () => {
  
    if (selectStatus.value != "WB") {
      alertify.error("Print label only working for WB status");
      return;
    };

    var selectedRows = selectedCustomerTable.getSelectedRows();
    if (selectedRows.length != 1) {
      alertify.error("Please select one rows");
      return;
    }

    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });

    var data = {
      plant: selectedPlant.value ? selectedPlant.value : "",
      fg_mat: selectedRows[0]._row.data.FG_MAT_NO,
      fg_mat_spc: selectedRows[0]._row.data.FG_SPEC,
    };

    var url = "api/LDSM005/printFGLabel";

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response?.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            console.log(response);
            var store_hsn = "";
            var hsn_cd = response.data.res_hsn.rows[0][0];
            var app_id = response.data.res_application?.rows != 0 ? response.data.res_application?.rows[0][0] : 0;
            var grade = response.data.res_grade.rows.length != 0 ? response.data.res_grade.rows[0] : ['', '', ''];

            if (hsn_cd == 7304) {
              store_hsn = "Steel Tubes / Pipes"
            } else {
              store_hsn = "Steel Tubes / Pipes"
            }
            var d;
            var c;

            for (var i = 0; i < newData.length; i++) {
              var a = document.body.appendChild(document.createElement("a"));
              a.download = `${newData[i]?.LOM_ID_BATCH}` + "_FG" + ".txt";
              var b = "";
              var dateSplit = newData[i]?.LOM_TS_CREATION.split(" ");

              d = [
                'INPUT OFF',
                'VERBOFF',
                'INPUT ON',
                'SYSVAR(48) = 0',
                'ERROR 15,"FONT NOT FOUND"',
                'ERROR 18,"DISK FULL"',
                'ERROR 26,"PARAMETER TOO LARGE"',
                'ERROR 27,"PARAMETER TOO SMALL"',
                'ERROR 37,"CUTTER DEVICE NOT FOUND"',
                'ERROR 1003,"FIELD OUT OF LABEL"',
                'SYSVAR(35)=0',
                'OPEN "tmp:setup.sys" FOR OUTPUT AS #1',
                'PRINT#1,"Printing,Media,Print Area,Media Margin (X),0"',
                'PRINT#1,"Printing,Media,Clip Default,On"',
                'CLOSE #1',
                'SETUP "tmp:setup.sys"',
                'KILL "tmp:setup.sys"',
                'CLIP ON',
                'CLIP BARCODE ON',
                'LBLCOND 3,2',
                'CLL',
                'OPTIMIZE "BATCH" ON',
                `${grade?.[1]?.trim()?.length > 0 ?'PP340,1000': ''}`,
                `${grade?.[1]?.trim()?.length > 0 ? 'PRIMAGE "HSMISI.PCX"':''}`,
                'PP10,430',
                'PRIMAGE "HSMTATASTEEL.PCX"',
                'PP284,57:AN7',
                'DIR4',
                'NASC 8',
                'FT "Inter SemiBold",10,0,104',
                'PT "BATCH"',
                'PP315,56:FT "Inter Black",14,0,82',
                'PT ' + `"${newData?.[i]?.LOM_ID_BATCH}"`,
                'PP90,450:FT "Inter SemiBold",11,0,84',
                'PT "TUBES DIVISION ,'+ `${selectedPlant.value =='0788' ? "KHOPOLI" :(selectedPlant.value =='0789' ? "HOSUR" :"")}"`,
                'PP695,63:BARSET "CODE128B",2,1,3,71',
                'PB ' + `"${newData?.[i]?.LOM_ID_BATCH}, ${newData?.[i]?.LOM_MS_GROSS_CAL}  KG"`,
                'PP761,64:FT "Univers Bold"',
                'FONTSIZE 10',
                'FONTSLANT 0',
                'PT ' + `"${newData?.[i]?.LOM_ID_BATCH + "; "+ newData?.[i]?.LOM_MS_GROSS_CAL+ "; " + newData?.[i]?.LOM_SEC2 + " X "+ newData?.[i]?.LOM_SEC1 + " X " + newData?.[i]?.LOM_LENGTH}"`,
                'PP387,56:FT "Inter SemiBold",9,0,104',
                'PT "Grade"',
                'PP419,58:FT "Inter Black",11,0,89',
                'PT ' + `"${grade?.[0].length > 0?grade?.[0]:''}"`,
                'PP475,56:FT "Inter SemiBold",9,0,104',
                'PT "Material Desc"',
                'PP269,630:FT "Inter SemiBold",10,0,93',
                'PT "Cast No"',
                'PP303,630:FT "Inter Black",10,0,88',
                'PT ' + `"${newData?.[i]?.LOM_NO_CAST}"`,
                'PP203,56:AN1',
                'DIR1',
                'PX1092,65,3',
                'PP545,1146:DIR2',
                'PL1088,3',
                'PP38,58:DIR1',
                'PX224,147,3',
                'PP72,115:AN7',
                'DIR4',
                'FT "Inter Black",8,0,146',
                'PT "MADE"',
                'PP103,147:FT "Inter Black",8,0,173',
                'PT "IN"',
                'PP134,115:FT "Inter Black",8,0,146',
                'PT "INDIA"',
                'PP374,630:FT "Inter SemiBold",9,0,104',
                'PT "Net Weight"',
                'PP334,1018:FT "Inter SemiBold",6,0,99',
                'PT '+`"${grade?.[0]?.length > 0 && grade?.[1]?.trim()?.length > 0 ?grade?.[0]:''}"`,
                'PP456,1018:FT "Inter SemiBold",6,0,72',
                'PT  '+ `"${grade?.[1]?.trim()?.length > 0 ?grade?.[1]:''}"`,
                'PP44,1148:DIR1',
                'BARSET "QRCODE",1,1,4,2,1',
                'PB ' + `"https://madeinindia.qcin.org/product-details/${app_id}/${newData?.[i]?.LOM_ID_BATCH}"`,
                'PP208,407:DIR4',
                'FT "Inter Black"',
                'FONTSIZE 16',
                'FONTSLANT 0',
                'PT '+`"${store_hsn}"`,
                'PP399,630:FT "Inter Black",10,0,104',
                'PT ' + `"${newData?.[i]?.LOM_MS_GROSS_CAL} KG"`,
                'PP558,64:FT "Inter SemiBold",7,0,99',
                'PT "MATERIAL NUMBER"',
                'PP558,283:FT "Inter Black",7,0,84',
                'PT ' + `"${newData?.[i]?.MATNR}"`,
                'PP558,619:FT "Inter SemiBold",7,0,99',
                'PT ""',
                'PP618,618:FT "Inter SemiBold",7,0,99',
                'PT "DATE"',
                'PP618,679:FT "Inter Black",7,0,84',
                'PT ' + `"${dateSplit}"`,
                'PP646,616:FT "Inter SemiBold",7,0,99',
                'PT "Shift"',
                'PP646,678:FT "Inter Black",7,0,84',
                'PT ' + `"${newData?.[i]?.LOM_CD_SHIFT}"`,
                'PP583,615:FT "Inter Black",7,0,84',
                'PT ""', /*0035050343( 0035050343)*/
                'PP507,55:FT "Inter Black",10,0,104',
                'PT ' + `"${newData?.[i]?.MATR_DESC}"`,
                'PP447,628:FT "Inter SemiBold",9,0,104',
                'PT "Nos"',
                'PP473,630:FT "Inter Black",10,0,104',
                'PT ' + `"${newData?.[i]?.LOM_NO_PIECES}"`,
                'PP592,64:FT "Inter SemiBold",7,0,99',
                'PT "Sales Order/Item No"',
                'PP592,282:FT "Inter Black",7,0,84',
                'PT ' + `"${newData?.[i]?.LOM_ID_ORDER} / ${newData?.[i]?.LOM_ID_ORD_ITEM_CUS}"`,
                'PP624,64:FT "Inter SemiBold",9,0,104',
                'PT "Customer"',
                'PP630,197:FT "Inter Black",7,0,84',
                'PT ' + `"${newData?.[i]?.CUSTOMER_NAME}"`,
                'LAYOUT RUN ""',
                'PF',
                'PRINT KEY OFF'
            ];

            c = [<>
                <div>INPUT OFF</div>
                <div>VERBOFF</div>
                <div>INPUT ON</div>
                <div>SYSVAR(48) = 0</div>
                <div>ERROR 15,"FONT NOT FOUND"</div>
                <div>ERROR 18,"DISK FULL"</div>
                <div>ERROR 26,"PARAMETER TOO LARGE"</div>
                <div>ERROR 27,"PARAMETER TOO SMALL"</div>
                <div>ERROR 37,"CUTTER DEVICE NOT FOUND"</div>
                <div>ERROR 1003,"FIELD OUT OF LABEL"</div>
                <div>SYSVAR(35)=0</div>
                <div>OPEN "tmp:setup.sys" FOR OUTPUT AS #1</div>
                <div>PRINT#1,"Printing,Media,Print Area,Media Margin (X),0"</div>
                <div>PRINT#1,"Printing,Media,Clip Default,On"</div>
                <div>CLOSE #1</div>
                <div>SETUP "tmp:setup.sys"</div>
                <div>KILL "tmp:setup.sys"</div>
                <div>CLIP ON</div>
                <div>CLIP BARCODE ON</div>
                <div>LBLCOND 3,2</div>
                <div>CLL</div>
                <div>OPTIMIZE "BATCH" ON</div>
                <div>{grade?.[1]?.trim()?.length > 0 ? 'PP340,1000': ''}</div>
                <div>{grade?.[1]?.trim()?.length > 0 ? 'PRIMAGE "HSMISI.PCX"':''}</div>
                <div>PP10,430</div>
                <div>PRIMAGE "HSMTATASTEEL.PCX"</div>
                <div>PP284,57:AN7</div>
                <div>DIR4</div>
                <div>NASC 8</div>
                <div>FT "Inter SemiBold",10,0,104</div>
                <div>PT "BATCH"</div>
                <div>PP315,56:FT "Inter Black",14,0,82</div>
                <div>PT "{newData?.[i]?.LOM_ID_BATCH}"</div>
                <div>PP90,450:FT "Inter SemiBold",11,0,84</div>
                <div>PT "TUBES DIVISION , {selectedPlant.value =='0788' ? "KHOPOLI" :(selectedPlant.value =='0789' ? "HOSUR" :"")}"</div>
                <div>PP695,63:BARSET "CODE128B",2,1,3,71</div>
                <div>PB "{newData?.[i]?.LOM_ID_BATCH}, {newData?.[i]?.LOM_MS_GROSS_CAL} KG"</div>
                <div>PP761,64:FT "Univers Bold"</div>
                <div>FONTSIZE 10</div>
                <div>FONTSLANT 0</div>
                <div>PT "{newData?.[i]?.LOM_ID_BATCH + "; "+ newData?.[i]?.LOM_MS_GROSS_CAL+ "; " + newData?.[i]?.LOM_SEC2 + " X "+ newData?.[i]?.LOM_SEC1 + " X " + newData?.[i]?.LOM_LENGTH}"</div>
                <div>PP387,56:FT "Inter SemiBold",9,0,104</div>
                <div>PT "Grade"</div>
                <div>PP419,58:FT "Inter Black",11,0,89</div>
                <div>PT "{grade?.[0]?.length > 0?grade?.[0]:''}"</div>
                <div>PP475,56:FT "Inter SemiBold",9,0,104</div>
                <div>PT "Material Desc"</div>
                <div>PP269,630:FT "Inter SemiBold",10,0,93</div>
                <div>PT "Cast No"</div>
                <div>PP303,630:FT "Inter Black",10,0,88</div>
                <div>PT "{newData?.[i]?.LOM_NO_CAST}"</div>
                <div>PP203,56:AN1</div>
                <div>DIR1</div>
                <div>PX1092,65,3</div>
                <div>PP545,1146:DIR2</div>
                <div>PL1088,3</div>
                <div>PP38,58:DIR1</div>
                <div>PX224,147,3</div>
                <div>PP72,115:AN7</div>
                <div>DIR4</div>
                <div>FT "Inter Black",8,0,146</div>
                <div>PT "MADE"</div>
                <div>PP103,147:FT "Inter Black",8,0,173</div>
                <div>PT "IN"</div>
                <div>PP134,115:FT "Inter Black",8,0,146</div>
                <div>PT "INDIA"</div>
                <div>PP374,630:FT "Inter SemiBold",9,0,104</div>
                <div>PT "Net Weight"</div>
                <div>PP334,1018:FT "Inter SemiBold",6,0,99</div>
                <div>PT "{grade?.[0]?.length > 0 && grade?.[1]?.trim().length > 0?grade?.[0]:''}"</div>
                <div>PP456,1018:FT "Inter SemiBold",6,0,72</div>
                <div>PT "{grade?.[1]?.trim().length > 0?grade?.[1]:''}"</div>
                <div>PP44,1148:DIR1</div>
                <div>BARSET "QRCODE",1,1,4,2,1</div>
                <div>PB "https://madeinindia.qcin.org/product-details/{app_id}/{newData?.[i]?.LOM_ID_BATCH}"</div>
                <div>PP208,407:DIR4</div>
                <div>FT "Inter Black"</div>
                <div>FONTSIZE 16</div>
                <div>FONTSLANT 0</div>
                <div>PT "{store_hsn}"</div>
                <div>PP399,630:FT "Inter Black",10,0,104</div>
                <div>PT "{newData?.[i]?.LOM_MS_GROSS_CAL} KG"</div>
                <div>PP558,64:FT "Inter SemiBold",7,0,99</div>
                <div>PT "MATERIAL NUMBER"</div>
                <div>PP558,283:FT "Inter Black",7,0,84</div>
                <div>PT "{newData?.[i]?.MATNR}"</div>
                <div>PP558,619:FT "Inter SemiBold",7,0,99</div>
                <div>PT ""</div> {/*PROD ORDER*/}
                <div>PP618,618:FT "Inter SemiBold",7,0,99</div>
                <div>PT "DATE"</div>
                <div>PP618,679:FT "Inter Black",7,0,84</div>
                <div>PT "{dateSplit}"</div>
                <div>PP646,616:FT "Inter SemiBold",7,0,99</div>
                <div>PT "Shift"</div>
                <div>PP646,678:FT "Inter Black",7,0,84</div>
                <div>PT "{newData?.[i]?.LOM_CD_SHIFT}"</div>
                <div>PP583,615:FT "Inter Black",7,0,84</div>
                <div>PT ""</div>
                <div>PP507,55:FT "Inter Black",10,0,104</div>
                <div>PT "{newData?.[i]?.MATR_DESC}"</div>
                <div>PP447,628:FT "Inter SemiBold",9,0,104</div>
                <div>PT "Nos"</div>
                <div>PP473,630:FT "Inter Black",10,0,104</div>
                <div>PT "{newData?.[i]?.LOM_NO_PIECES}"</div>
                <div>PP592,64:FT "Inter SemiBold",7,0,99</div>
                <div>PT "Sales Order/Item No"</div>
                <div>PP592,282:FT "Inter Black",7,0,84</div>
                <div>PT "{newData?.[i]?.LOM_ID_ORDER} / {newData?.[i]?.LOM_ID_ORD_ITEM_CUS}"</div>
                <div>PP624,64:FT "Inter SemiBold",9,0,104</div>
                <div>PT "Customer"</div>
                <div>PP630,197:FT "Inter Black",7,0,84</div>
                <div>PT "{newData?.[i]?.CUSTOMER_NAME}"</div>
                <div>LAYOUT RUN ""</div>
                <div>PF</div>
                <div>PRINT KEY OFF</div>
            </>];

              for (var i = 0; i < d.length; i++) {
                b += d[i] + "\r\n";
              }
              b = encodeURIComponent(b);
              a.href = "data:text/html," + b;
              a.click();
            }
            setOpen(true);
            setTextValue(c);
          }

        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const componentRef = React.useRef();

  const divStyle = {
    padding: "10px",
    margin: "5px",
    fontSize: "6.5px",
    height: "100%", /* Use 100% here to support printing more than a single page*/
    margin: "0",
    padding: "0",
    overflow: "hidden",
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Dispatch"
        page="Packing & Declare FG"
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
        open={open}>
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}>
          Print made in india FG Label
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <MDBox px={3} py={3} ref={componentRef}>
              <Grid container spacing={1}>
                <div style={divStyle}>
                  {textValue}
                </div>
              </Grid>
            </MDBox>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <MDButton size="small" color="info" onClick={printTxt()} > Print </MDButton> */}
          <ReactToPrint
            trigger={() => <MDButton size="small" color="info" >
              Print
            </MDButton>}
            content={() => componentRef.current}
          />
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
                    <Tab
                      label="Confirm packing"
                      icon={<FormatListBulletedIcon />}
                    />
                    <Tab
                      label="Generate Individual Tube"
                      icon={<SummarizeIcon />}
                    />
                    <Tab
                      label="Commercial packing Confirmation"
                      icon={<SummarizeIcon />}
                    />
                  </Tabs>
                </AppBar>
              </Grid>

              <Grid item xs={12}>
                {tabValue == 0 && (
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
                            Filters
                          </MDTypography>
                        </Grid>
                        {(dateValueFrom == null || tableData.length === 0) && (
                          <Grid item xs={1.6}>
                            <Tooltip title="Clear" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  onClick={() => clearFilter()}
                                >
                                  <ClearAllIcon />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Grid>
                        )}
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={1}>
                        <Grid item xs={2} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Plant<span style={{ color: "red" }}>*</span>
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            onChange={handlePlantChange}
                            value={selectedPlant}
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
                            Process{" "}
                          </MDTypography>
                          <ReactSelect
                            id="process"
                            options={selectPeocessId}
                            onChange={handleProcessChange}
                            value={selectedProcess}
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
                            Status{" "}
                          </MDTypography>
                          <ReactSelect
                            id="status"
                            options={stsList}
                            onChange={handleStatusChange}
                            value={selectStatus}
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
                            Order{" "}
                          </MDTypography>
                          <MDInput
                            name="order"
                            value={allValues.order || ""}
                            onChange={(e) => handleChange(e)}
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
                            Item{" "}
                          </MDTypography>
                          <MDInput
                            name="item"
                            value={allValues.item || ""}
                            onChange={(e) => handleChange(e)}
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
                            Batch{" "}
                          </MDTypography>
                          <MDInput
                            name="batch"
                            value={allValues.batch || ""}
                            onChange={(e) => handleChange(e)}
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
                            M Batch{" "}
                          </MDTypography>
                          <MDInput
                            name="mBatch"
                            value={allValues.mBatch || ""}
                            onChange={(e) => handleChange(e)}
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
                            Order Type{" "}
                          </MDTypography>
                          <ReactSelect
                            id="ordtyp"
                            options={selectOrdTypeId}
                            onChange={handleOrdTypChange}
                            value={selectedOrd}
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
                            {" "}
                            Production Date From
                          </MDTypography>
                          <DatePicker
                            id="receiDtFrm"
                            value={dateValueFrom}
                            onChange={(date) => setDateValueFrom(date)}
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
                            Production Date To{" "}
                          </MDTypography>
                          <DatePicker
                            id="receiDtTo"
                            value={dateValueTO}
                            onChange={(date) => setDateValueTo(date)}
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
                            {" "}
                            Thick From
                          </MDTypography>
                          <MDInput
                            name="thikFrm"
                            value={allValues.thikFrm || ""}
                            onChange={(e) => handleChange(e)}
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
                            Thick To{" "}
                          </MDTypography>
                          <MDInput
                            name="thikTo"
                            value={allValues.thikTo || ""}
                            onChange={(e) => handleChange(e)}
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
                            ODIA
                          </MDTypography>
                          <ReactSelect
                            id="ODIA"
                            options={selectOdiaList}
                            onChange={handleOdiaChange}
                            value={selectedOdia}
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
                            Customer{" "}
                          </MDTypography>
                          <ReactSelect
                            id="customer"
                            options={selectCustomerId}
                            onChange={handleCustomerChange}
                            value={selectedCustomer}
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
                            {" "}
                            Package Date From
                          </MDTypography>
                          <DatePicker
                            id="pkgDtFrm"
                            value={pkgDateValueFrom}
                            onChange={(date) => setPkgDateValueFrom(date)}
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
                            Package Date To{" "}
                          </MDTypography>
                          <DatePicker
                            id="pkgDtTo"
                            value={pkgDateValueTo}
                            onChange={(date) => setPkgDateValueTo(date)}
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
                            Product Name{" "}
                          </MDTypography>
                          <ReactSelect
                            id="Pname"
                            options={selectPname}
                            onChange={handlePnameChange}
                            value={selectedPname}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <MDButton
                            size="small"
                            color="info"
                            onClick={() => getDataBtnSubmit()}
                            style={{ marginTop: "1.5rem" }}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 1 && (
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
                            Filters
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
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
                        <Grid item xs={2} style={{ zIndex: 5 }}>
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
                            options={plantTube}
                            onChange={handlePlantChangeTube}
                            value={selectedPlantTube}
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
                            Batch{" "}
                          </MDTypography>
                          <ReactSelect
                            id="batchId"
                            options={batchId}
                            value={selectedBatchId}
                            onChange={handleBatchIdChange}
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => generateIndividualTube()}
                          >
                            Generate Individual Tube
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 2 && (commRecorder == 'Y') && (
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
                            Filters
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}>
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
                        <Grid item xs={2} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Plant<span style={{ color: "red" }}>*</span>
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
                            Status{" "}
                          </MDTypography>
                          <ReactSelect
                            id="status"
                            options={stsListComm}
                            onChange={handleStatusChangeCommercial}
                            value={selectStatusCommercial}
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
                            Batch{" "}
                          </MDTypography>
                          <MDInput
                            name="batch"
                            value={allValues.batch || ""}
                            onChange={(e) => handleChange(e)}
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
                            M Batch{" "}
                          </MDTypography>
                          <MDInput
                            name="mBatch"
                            value={allValues.mBatch || ""}
                            onChange={(e) => handleChange(e)}
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
                            {" "}
                            Package Date From
                          </MDTypography>
                          <DatePicker
                            id="pkgDtFrm"
                            value={pkgDateValueFrom}
                            onChange={(date) => setPkgDateValueFrom(date)}
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
                            Package Date To{" "}
                          </MDTypography>
                          <DatePicker
                            id="pkgDtTo"
                            value={pkgDateValueTo}
                            onChange={(date) => setPkgDateValueTo(date)}
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
                            Product Name{" "}
                          </MDTypography>
                          <ReactSelect
                            id="Pname"
                            options={selectPname}
                            onChange={handlePnameChange}
                            value={selectedPname}
                          />
                        </Grid>

                        <Grid item xs={2}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getKBDataBtnSubmit()}
                          >
                            Display
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
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
                            Package Material & Declare FG
                          </MDTypography>
                        </Grid>

                        <Grid item xs={2}>
                          <Tooltip title="Confirm" arrow>
                            <span>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess || isConfirm}
                                onClick={() => confirmCoil(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="FG Print Label" arrow>
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => handleLabelModalOpen("FG")}
                              >
                                <PrintIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          <Tooltip title="Print made in india FG Label" arrow>
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => handelDownloadFGLable()}
                              >
                                <ReceiptIcon />
                              </IconButton>
                            </span>
                          </Tooltip>
                          {/* <Tooltip title="SFG Print Label" arrow>
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => handleLabelModalOpen("SFG")}
                              >
                                <PrintIcon />
                              </IconButton>
                            </span>
                          </Tooltip> */}

                          <Tooltip title="Download" arrow>
                            <span>
                              <IconButton
                                color="white"
                                onClick={() => downloadExcelcustomerTableData()}
                              >
                                <DownloadForOfflineIcon />
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
                      <Grid container>
                        <Grid item xs={12}>
                          {tableData?.length > 0 ? (
                            <div id="selCustomerTable" />
                          ) : null}
                          <LDSM005LabelModal
                            open={labelModalOpen !== null}
                            close={() => setLabelModalOpen(null)}
                            inputValues={accessLabelDialogData}
                            plant={selectedPlant}
                            type={labelModalOpen}
                          />
                          <LDSM005ScrapModal
                            open={showScrapModal}
                            close={setShowScrapModal}
                            sendToParent={setScrapFlag}
                            inputValues={selectedData}
                            plant={selectedPlant}
                          />
                          {showSaveMsgError && (
                            <Grid item xs={12}>
                              <MDAlert color="error" dismissible>
                                <MDTypography
                                  variant="body2"
                                  fontWeight="medium"
                                  color="white"
                                >
                                  {saveMsg}
                                </MDTypography>
                              </MDAlert>
                            </Grid>
                          )}
                          {showSaveMsgSuccess && (
                            <Grid item xs={12}>
                              <MDAlert color="success" dismissible>
                                <MDTypography
                                  variant="body2"
                                  fontWeight="medium"
                                  color="white"
                                  fontSize="lg"
                                  textTransform="capitalize"
                                >
                                  {saveMsg}
                                </MDTypography>
                              </MDAlert>
                            </Grid>
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
                            Showing 1 to {tableData.length} of{" "}
                            {tableData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                      <br />
                      <Grid container style={{ display: "none" }}>
                        <Grid item xs={2}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              display: "inline-block",
                              backgroundColor: "dodgerblue",
                            }}
                          ></div>
                          <label
                            style={{ color: "black", marginLeft: "0.1rem" }}
                          >
                            Not Applicable{" "}
                          </label>
                        </Grid>

                        <Grid item xs={2}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              display: "inline-block",
                              backgroundColor: "yellow",
                            }}
                          ></div>
                          <label
                            style={{ color: "black", marginLeft: "0.1rem" }}
                          >
                            Pending for Submission
                          </label>
                        </Grid>

                        <Grid item xs={2}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              display: "inline-block",
                              backgroundColor: "orange",
                            }}
                          ></div>
                          <label
                            style={{ color: "black", marginLeft: "0.1rem" }}
                          >
                            Pending for Approval
                          </label>
                        </Grid>

                        <Grid item xs={2}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              display: "inline-block",
                              backgroundColor: "red",
                            }}
                          ></div>
                          <label
                            style={{ color: "black", marginLeft: "0.1rem" }}
                          >
                            Workflow Rejected
                          </label>
                        </Grid>

                        <Grid item xs={2}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              display: "inline-block",
                              backgroundColor: "green",
                            }}
                          ></div>
                          <label
                            style={{ color: "black", marginLeft: "0.1rem" }}
                          >
                            Workflow Approved
                          </label>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 1 && (
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
                            Generate Individual Tube
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelGenTubeResultTable()}
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
                          <div id="resultGentubetable" />
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 2 && (
                  <>
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
                              Display KB batches
                            </MDTypography>
                          </Grid>


                          <Grid item xs={2}>
                            <Tooltip title="Confirm" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  disabled={isReadWriteAccess}
                                  onClick={() => SaveKBbatches(true)}
                                >
                                  <SaveIcon />
                                </IconButton>
                              </span>
                            </Tooltip>

                            <Tooltip title="Download" arrow>
                              <span>
                                <IconButton
                                  color="white"
                                  onClick={() => downloadExcelcustomerTableData()}
                                >
                                  <DownloadForOfflineIcon />
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
                        <Grid container>
                          <Grid item xs={12}>
                            {tableKbData?.length > 0 ? (
                              <div id="selCustomerKbTable" />
                            ) : null}

                            <LDSM005DefectRecordingModal
                              open={showScrapKbModal}
                              close={setShowScrapKbModal}
                              sendToParent={setScrapKbFlag}
                              inputValues={selectedData}
                              plant={selectedPlant}
                            />
                          </Grid>
                        </Grid>

                      </MDBox>
                    </Card>

                    <br />
                    <br />

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
                              Scrap Details
                            </MDTypography>
                          </Grid>

                          <Grid item xs={2}></Grid>
                          <Grid item xs={1}>

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
                            <div id="scrapMatTableDiv" />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
