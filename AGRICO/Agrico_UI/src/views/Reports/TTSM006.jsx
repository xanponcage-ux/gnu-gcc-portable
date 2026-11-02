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

export default function TTSM006() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [ordType, setOrdType] = useState([]);
  const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [processList, setProcessList] = useState([]);
  const [matGrp, setMatGrp] = React.useState([]);
  const [selectedMatGrp, setSelectedMatGrp] = React.useState([]);
  const [reportDesc, setReportDesc] = useState([]);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectedProcess, setSelectedProcess] = React.useState([]);
  const [selectedNextProcess, setSelectedNextProcess] = React.useState([]);
  const [selectedReport, setSelectedReport] = useState([]);
  const [prodInquiryData, setProdInquiryData] = React.useState([]);
  const [prodInquiryTable, setprodInquiryTable] = useState(null);
  const [selectedShift, setSelectedShift] = useState([]);
  const [prodType, setProdType] = useState(null);

  var customerTable = React.createRef();
  const [dateValueFrom, setDateValueFrom] = useState(null);
  const [dateValueTO, setDateValueTo] = useState(null);
  const [SchedDtValueFrom, setSchedDtValueFrom] = useState(null);
  const [SchedDtValueTo, setSchedDtValueTo] = useState(null);
  const [allValues, setAllValues] = useState({
    // order: "",
    // item: "",
    Batch_Id: "",
    MBatch_Id: "",
    // prodCD: "",
    // qultyCd: "",
    thikMax: "",
    thikMin: "",
    widthMax: "",
    widthMin: "",
    // nxtProcess: "",
    // tdc: "",
  });
  const [selectPname, setPname] = React.useState([]);
  const [selectedPname, setSelectPname] = React.useState([]);

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
      //page load functions here
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
        setLoading(false);
      });
      // getProdCat();
    });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (prodInquiryData) {
      setprodInquiryTable(
        new Tabulator("#inquiryTable", {
          //   pagination: "local", //enable local pagination.
          data: prodInquiryData,
          columns: prodInquiryColumn,
          height: 400,
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
      var pageName = "TTSM006";

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

  const getGroupPlantId = (accessToken) => {
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
            Promise.all([getProcessList(items[0], accessToken), getProductName(items[0], accessToken),getMatGrp(items[0], accessToken)]).finally(() => {
              resolve();
            });
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

  const getProcessList = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      // var url = "api/ttsm007/GetCustDesc";
      var url = "api/ttsm006/getProcess";
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
            setProcessList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getMatGrp = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm006/getMatGrp";
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
            console.log(response.data);
            response.data.map((row) => {
              var obj = new Object();
              console.log(row);
              obj.label = row[0];
              obj.value = row[0];
              items.push(obj);
            });
            setMatGrp(items);
            console.log(matGrp);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setProdInquiryData([]);
    if (value) {
      setProcessList(0);
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([getProcessList(value, token.accessToken), getProductName(value, token.accessToken)]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleProcessChange = (value) => {
    setSelectedProcess(value);
    setProdInquiryData([]);
  };
  const handleMatChange = (value) => {
    setSelectedMatGrp(value);
    setProdInquiryData([]);
  };
  const handleNextProcessChange = (value) => {
    setSelectedNextProcess(value);
    setProdInquiryData([]);
  };

  const shiftList = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
  ];

  const handleReportChange = (value) => {
    setSelectedReport(value);
    setProdInquiryData([]);
  };

  const handleOrdTypeChange = (value) => {
    setSelectOrderType(value);
    setProdInquiryData([]);
  };

  const handlePCatChange = (value) => {
    setSelectPcat(value);
    setProdInquiryData([]);
  };

  const getData = () => {
    //   getBusinessUnit();
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
      // var data = {
      //     plant: selectedPlant.value,
      //     // BUnit :value[0]
      // };
      var ProdDtFrm = document.getElementById("ProdDtFrm").value;
      var ProdDtTo = document.getElementById("ProdDtTo").value;
      // var SchedDtFrm = document.getElementById("SchedDtFrm").value;
      // var SchedDtTo = document.getElementById("SchedDtTo").value;

      var data = {
        plant: selectedPlant ? selectedPlant.value : "",
        Process: selectedProcess ? selectedProcess.value : "",
        pname: selectedPname ? selectedPname.value  : "",
        matGrp: selectedMatGrp ? selectedMatGrp.value : "",
        //NextProcess: selectedNextProcess ? selectedNextProcess : "",
        // Order_ID: allValues.order,
        // OrderItem: allValues.item,
        Batch_Id: allValues.Batch_Id,
        MBatch_Id: allValues.MBatch_Id,
        ThickMax: allValues.thikMax,
        ThickMin: allValues.thikMin,
        WidthMax: allValues.widthMax,
        WidthMin: allValues.widthMin,
        //shift: selectedShift ? selectedShift.value : "",
        ProdDtFrom: ProdDtFrm,
        ProdDtTo: ProdDtTo,
        prodType: prodType !== null ? prodType?.value : "",
        // SchedDtFrom: SchedDtFrm,
        // SchedDtTo: SchedDtTo,
      };
      url = "api/ttsm006/getProdInqData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data[1]) {
              setProdInquiryData(response.data[1]);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .catch((error) => {
          setProdInquiryData([]);
          // setprodInquiryTable(null);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
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
  };

  const prodInquiryColumn = [
    {
      title: "Batch",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    // { "title": "Batch", "field": "EOM_ID_BATCH", "headerFilter": "input", "headerFilterPlaceholder": "search...",frozen:true },
    // { "title": "PLANT", "field": "PLANT", "headerFilter": "input", "headerFilterPlaceholder": "search...", frozen: true },
    {
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Mother Batch",
      field: "MOTHER_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Process",
      field: "EPR_CD_PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Current Stage MAT. No",
    //   field: "EOM_NO_MATNR",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Current Stage MAT. Desc",
    //   field: "MATR_DESC",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Status",
      field: "EOM_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Net Wt (Ton)",
    //   field: "NET_WT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    // },
    {
      title: "Mill Wt (Ton)",
      field: "MILL_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "Thickness",
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
      title: "Width / Odia",
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
      title: "FG Grade/ TDC",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Actual TDC",
      field: "EIC_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Prod",
      field: "EOM_CD_PROD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Quality",
      field: "BATCHQLTYCD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Length (M)",
      field: "LENGTH",
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
      title: "Semi finish length (M)",
      field: "SEMI_FINISH_LENGTH",
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
      //title: "Mill Length",
      title: "SFG Length",
      field: "MILL_LENGTH",
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
      title: "No of Pieces",
      field: "EPR_NO_PIECES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    //{ "title": "UOM", "field": "UOM", "headerFilter": "input", "headerFilterPlaceholder": "search..." },

    //     { "title": "Gross Wt.", "field": "EOM_MS_GROSS_ACTL", "headerFilter": "input", "headerFilterPlaceholder": "search..." ,
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    //  },
    {
      title: "Planned Wt(Ton)",
      field: "PLANNED_WT",
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
    //     "title": "Scrap Wt(Ton)", "field": "MS_SCRAP", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    // },
    {
      title: "Yield %",
      field: "Yield_perc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill Speed (MPM)",
      field: "EPR_MILL_SPEED",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Draw Bench Speed(%)",
      field: "EPR_BENCH_SPEED",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Furnace Temperature (°C)",
      field: "EPR_FURNACE_TEMP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Furnace Speed (MPH)",
      field: "EPR_FURNACE_SPEED",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    //{ "title": "Inv Loss", "field": "EOM_INV_LOSS", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    //{ "title": "Scrap Batch Id", "field": "SCRAP_BATCH_ID", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Customer Order",
      field: "EOM_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No.",
      field: "EOM_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Type",
      field: "ORD_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "SCO Order", "field": "EOM_ID_ORDER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "SCO Item", "field": "EOM_NO_ITEM", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Customer",
      field: "CUSTOMER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "Mark Customer", "field": "EOM_MK_CUSTOMER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    //{ "title": "Tracking No", "field": "TRACK_NO", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Prod Date",
      field: "EPR_DT_PRODN_TATA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Prod Time",
    //   field: "EPR_TM_PRODN_TATA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Shift",
      field: "EPR_CD_SHIFT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod strt time",
      field: "PROD_STRT_TM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod end time",
      field: "PROD_END_TM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No",
      field: "EPR_NO_CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passesd Process",
      field: "EOM_PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status Description",
      field: "STATUS_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ship To Party",
      field: "SHIP_TO_PARTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "EPR_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Operator Id",
      field: "EOM_ID_OP_DECSN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

  
    {
      title: "SF CQ tube Wt(KG)",
      field: "SF_CQ_TUBE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SF open Wt(KG)",
      field: "SF_OPEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap Wt(KG)",
      field: "SCRAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // { "title": "Material No", "field": "EOM_NO_MATNR", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "Material Desc", "field": "MATR_DESC", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // {
    //     "title": "M Batch Weight(MT)", "field": "M_BATCH_WEIGHT", "headerFilter": "input", "headerFilterPlaceholder": "search...",
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    // },
    {
      title: "Intendent Customer",
      field: "INTENDENT_CUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "M Batch Quality",
      field: "M_BATCHQLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "M Batch TDC",
      field: "M_BATCH_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "M Batch Thick",
      field: "M_BATCH_THICK",
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
      title: "M Batch Width",
      field: "M_BATCH_WIDTH",
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
      title: "Mother Batch Wt(Ton)",
      field: "MOTHER_BATCH_WT",
      headerFilter: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap/COMM Material No",
      field: "SCRP_MATERIAL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap/COMM Material Desc",
      field: "SCRP_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material No",
      field: "RM_MATERIAL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material Desc",
      field: "RM_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {                             // added by yogesh requested by Vedvraj Meshram on 07-04-2026
      title: "Specification",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material No",
      field: "FG_MAT_NO",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Desc",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Semi Finish M No",
      field: "SEMI_FINISH_MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Semi Finish Description",
      field: "SEMI_FINISH_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Work Center",
      field: "EPR_WORK_CENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "SFG Material Desc",
    //   field: "SFG_MATERIAL_DESC",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    //{ "title": "Pallet Type", "field": "EOM_PALLET_CODE", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Current Process",
      field: "CURR_PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Process",
      field: "NEXT_PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Process",
      field: "PREV_PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    
    {
      title: "Processing Flag",
      field: "PROCESSING_FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rec Creation date",
      field: "REC_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill Order",
      field: "EPR_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill Item",
      field: "EPR_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill Thk",
      field: "EPR_SEC1",
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
      title: "Mill Odia",
      field: "EPR_SEC2",
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
      title: "Mill Length",
      field: "EPR_LENGTH",
      headerFilter: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill Idia",
      field: "EPR_IDIA",
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
      title: "WIP Material No.",
      field: "WIP_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WIP Material Desc",
      field: "WIP_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Product Name",
      field: "PRODUCT_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Op Remarks",
      field: "OP_REMARK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Commercial Remark",
      field: "COMM_REMARK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Group",
      field: "MATGRP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }

  ];
  //Mill Thk , Mill Odia, Mill Length, Mill Idia
  //EPR_SEC1 , EPR_SEC2,EPR_LENGTH , EPR_IDIA
  const clearFilter = () => {
    setSelectedPlant([]);
    setSelectedProcess([]);
    setSelectedNextProcess([]);
    // setSelectProcess([]);
    // setSelectOrdTyp([]);
    // setSelectCustomer([]);
    setAllValues({});
    // setGridData([]);
    setProdInquiryData([]);
    setDateValueFrom(null);
    setDateValueTo(null);
    setSchedDtValueFrom(null);
    setSchedDtValueTo(null);
    setProdType(null);
    // setSelectedCustomerTable(null)
  };

  const downloadExcelcustomerTableData = () => {
    if (prodInquiryData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "TTSM006 " + date.toString() + ".xlsx";
    prodInquiryTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const getProductName = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm005/getpphProductName";
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

  const handlePnameChange = (value) => {
    if (value) {
      setSelectPname(value);
      setProdInquiryData([]);
    } else {
      setSelectPname([]);
    }
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
                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Plant *
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
                          Process
                        </MDTypography>
                        <ReactSelect
                          id="process"
                          options={processList}
                          onChange={handleProcessChange}
                          value={selectedProcess}
                        />
                      </Grid>
                      <Grid item xs={1.6}>
                        <MDTypography
                          fontWeight="regular"
                         fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Prod Type
                        </MDTypography>
                        <ReactSelect
                          id="prod_type"
                          options={[
                            {
                              label: "All",
                              value: "",
                            },
                            {
                              label: "Scrap",
                              value: 1,
                            },
                            {
                              label: "Non Scrap",
                              value: 2,
                            },
                            {
                              label: "Commercial",
                              value: 3,
                            },
                          ]}
                          onChange={(e) => setProdType(e)}
                          value={prodType}
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
                          Batch
                        </MDTypography>
                        <MDInput
                          name="Batch_Id"
                          value={allValues.Batch_Id || ""}
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
                          MBatch
                        </MDTypography>
                        <MDInput
                          name="MBatch_Id"
                          value={allValues.MBatch_Id || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      {/* <Grid item xs={1}>
                                             
                                            <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                          Order
                        </MDTypography>
                                                   
                                                        <MDInput  name="order" value={allValues.order || ''} onChange={(e) => handleChange(e)} />
                                                      
                                                   
                                               
                                            </Grid>
                                            <Grid item xs={0.50}>
                                             
                                            <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                          Item
                        </MDTypography>
                                                 <MDInput  type="number" name="item" value={allValues.item || ''} onChange={(e) => handleChange(e)} />
                                            
                                        
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
                          Thick Min
                        </MDTypography>

                        <MDInput
                          type="number"
                          name="thikMin"
                          value={allValues.thikMin || ""}
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
                          Thick Max
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="thikMax"
                          value={allValues.thikMax || ""}
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
                          Width/Odia Min
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="widthMin"
                          value={allValues.widthMin || ""}
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
                          Width/Odia Max
                        </MDTypography>

                        <MDInput
                          type="number"
                          name="widthMax"
                          value={allValues.widthMax || ""}
                          onChange={(e) => handleChange(e)}
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
                                                    Material Group{" "}
                                                </MDTypography>
                                                <ReactSelect
                                                    id="matGrp"
                                                    options={matGrp}
                                                    onChange={handleMatChange}
                                                    value={selectedMatGrp}
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
                          Prod Date From
                        </MDTypography>
                        <DatePicker
                          id="ProdDtFrm"
                          value={dateValueFrom}
                          onChange={(date) => setDateValueFrom(date)}
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
                          Prod Date To{" "}
                        </MDTypography>
                        <DatePicker
                          id="ProdDtTo"
                          value={dateValueTO}
                          onChange={(date) => setDateValueTo(date)}
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
                      {/* <Grid item xs={.85}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >
                                                    Sched Crt Date From
                                                </MDTypography>
                                                <DatePicker id="SchedDtFrm" value={SchedDtValueFrom} onChange={(date) => setSchedDtValueFrom(date)} />
                                            </Grid>
                                            <Grid item xs={.85}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >
                                                    Sched Crt Date To </MDTypography>
                                                <DatePicker id="SchedDtTo" value={SchedDtValueTo} onChange={(date) => setSchedDtValueTo(date)} />
                                            </Grid> */}

                      {/* <Grid item xs={1.25}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Shift </MDTypography>
                                                <ReactSelect
                                                    id="Shift"
                                                    options={shiftList}
                                                    onChange={handleShiftChange}
                                                    value={selectedShift}
                                                />
                                            </Grid> */}
                      {/* <Grid item xs={1}>
                                            <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                     Prod Cd
                        </MDTypography>
                                                <MDInput label="" name="prodCd" type="number" value={allValues.prodCd || ''} onChange={(e) => handleChange(e)} />
                                            </Grid> */}
                      {/* {<Grid item xs={2.}>
                                            <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                    Next Process
                        </MDTypography>
                            <ReactSelect
                                id="process"
                                options={processList}
                                onChange={handleNextProcessChange}
                                value={selectedNextProcess}
                            /> 
                           </Grid>
                         } */}
                      {/* <Grid item xs={2}>
                                            <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Report Type
                        </MDTypography>
                                                <ReactSelect
                                                    id="plant"
                                                    options={reportDesc}
                                                    onChange={handleReportChange}
                                                />
                                            </Grid> */}

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
                      {/* <Grid item xs={1} style={{ marginTop: "1rem" }}>

<MDButton
                                                                size=""
                                                                color="success"
                                                                onClick={() => getData(true)}>
                                                                Stk on 1st
                                                            </MDButton>
</Grid> */}
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
                        <div id="inquiryTable" />
                        {/* <ReactTabulator
                                                    id="getCustomerTable"
                                                    ref={ref => { customerTable = ref }}
                                                    columns={inventoryInfoColumn} data={getCustomerTable} options={options}
                                                /> */}
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
