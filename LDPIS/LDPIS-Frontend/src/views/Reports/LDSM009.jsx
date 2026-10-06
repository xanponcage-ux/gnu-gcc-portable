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

export default function LDSM009() {
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
  const [reportData, setReportData] = React.useState([]);
  const [reportTable, setReportTable] = useState(null);
  const [selectedShift, setSelectedShift] = useState([]);
  const [prodType, setProdType] = useState(null);

  var customerTable = React.createRef();
  const [dateValueFrom, setDateValueFrom] = useState(null);
  const [dateValueTO, setDateValueTo] = useState(null);
  const [SchedDtValueFrom, setSchedDtValueFrom] = useState(null);
  const [SchedDtValueTo, setSchedDtValueTo] = useState(null);

  const [chartState1, setChartState1] = useState(null);

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
  // useEffect(() => {
  //   if (prodInquiryData) {
  //     setprodInquiryTable(
  //       new Tabulator("#inquiryTable", {
  //         //   pagination: "local", //enable local pagination.
  //         data: prodInquiryData,
  //         columns: prodInquiryColumn,
  //         layout: "fitDataFill",
  //       })
  //     );
  //   }
  // }, [prodInquiryData]);

  // useEffect(() => {
  //   if(reportTable){
  //   const newData = reportTable.getData();
  //   if(newData)
  //   {
  //     let data1 = {
  //       labels: ["MTMILL_1","MTMILL_2","MTMILL_3","MTMILL_4","MTMILL_7","TOTAL"],
  //       datasets: [{
  //           label: 'On Date',
  //           fill: true,
  //           lineTension: 0.4,
  //           pointBorderWidth: 2,
  //           borderColor: "rgb(255, 99, 132)",
  //           backgroundColor: "rgba(255, 0, 0)",
  //           fill: {
  //               target: "origin", // 3. Set the fill options
  //               above: "rgba(255, 0, 0, 0.3)"
  //           },
  //           data: [
  //              newData.TubMillYld3[0] ? newData.TubMillYld3[0].toFixed(0) : 0,
  //              newData.TubMillYld3[1] ? newData.TubMillYld3[1].toFixed(0) : 0,
  //              newData.TubMillYld3[2] ? newData.TubMillYld3[2].toFixed(0) : 0,
  //              newData.TubMillYld3[3] ? newData.TubMillYld3[3].toFixed(0) : 0,
  //              newData.TubMillYld3[4] ? newData.TubMillYld3[4].toFixed(0) : 0,
  //              newData.TubMillYld3[5] ? newData.TubMillYld3[5].toFixed(0) : 0
  //             //  newData.TubMillYld3[6] ? getStageWiseGrAllAPI.data.HYDRA_ProdOnDate[0].toFixed(0) : 0,
  //             //  newData.TubMillYld3[7] ? getStageWiseGrAllAPI.data.ETC_ProdOnDate[0].toFixed(0) : 0,
  //             //  newData.TubMillYld3[] ? getStageWiseGrAllAPI.data.FG_OnDate[0].toFixed(0) : 0
  //           ]
  //       }]
  //   };
  //   setChartState1(data1);
  //   }
  // }
  // }, [reportTable]);

  useEffect(() => {
    
    if (reportData) {
      setReportTable(
        new Tabulator("#reportTable", {
          //   pagination: "local", //enable local pagination.
          data: reportData,
          cellEdited: (cell) => {
            // cell - cell component for the edited cell
            const newData = reportTable.getData();
            setReportData(newData); // update the state with the new table data
            },
          columns: reportTableColumns,
          //height: 200,
          layout: "fitData",
        })
      );
    }
  }, [reportData]);

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
      var pageName = "LDSM009";

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
            Promise.all([getProcessList(items[0], accessToken), getProductName(items[0], accessToken)]).finally(() => {
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

      // var url = "api/LDSM007/GetCustDesc";
      var url = "api/LDSM009/getProcess";
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

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setProdInquiryData([]);
    setReportData([]);
    setChartState1(null);
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
    setReportData([]);

  };
  const handleNextProcessChange = (value) => {
    setSelectedNextProcess(value);
    setProdInquiryData([]);
    setReportData([]);
  };

  const shiftList = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
  ];

  const handleReportChange = (value) => {
    setSelectedReport(value);
    setProdInquiryData([]);
    setReportData([]);
  };

  const handleOrdTypeChange = (value) => {
    setSelectOrderType(value);
    setProdInquiryData([]);
    setReportData([]);
  };

  const handlePCatChange = (value) => {
    setSelectPcat(value);
    setProdInquiryData([]);
    setReportData([]);
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
      url = "api/LDSM009/getProdInqData";

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

  const getReportData = () => {
    //   getBusinessUnit();
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }
    if (selectedPlant?.value != '0788') {
      alertify.error("This functionality is not available for this Plant ");
      return;
    }
    if(!dateValueFrom  || !dateValueTO  ){
      alertify.error("Both From and To date are mandatory");
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
      url = "api/LDSM009/getReportData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data[1]) {
              console.log(response.data[1]);
              setReportData(response.data[1]);
              console.log(reportData);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .catch((error) => {
          setReportData([]);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };


 
  const prodInquiryColumn = [
    {
      title: "Batch",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    // { "title": "Batch", "field": "LOM_ID_BATCH", "headerFilter": "input", "headerFilterPlaceholder": "search...",frozen:true },
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
    {
      title: "Material No",
      field: "LOM_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc",
      field: "MATR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "LOM_CD_STATUS",
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
      title: "TDC / Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Prod",
      field: "LOM_CD_PROD",
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

    //     { "title": "Gross Wt.", "field": "LOM_MS_GROSS_ACTL", "headerFilter": "input", "headerFilterPlaceholder": "search..." ,
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
    //{ "title": "Inv Loss", "field": "LOM_INV_LOSS", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    //{ "title": "Scrap Batch Id", "field": "SCRAP_BATCH_ID", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Customer Order",
      field: "LOM_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No.",
      field: "LOM_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Type",
      field: "ORD_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "SCO Order", "field": "LOM_ID_ORDER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "SCO Item", "field": "LOM_NO_ITEM", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Customer",
      field: "CUSTOMER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "Mark Customer", "field": "LOM_MK_CUSTOMER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    //{ "title": "Tracking No", "field": "TRACK_NO", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Prod Date",
      field: "EPR_DT_PRODN_TATA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Time",
      field: "EPR_TM_PRODN_TATA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Shift",
      field: "EPR_CD_SHIFT",
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
      field: "LOM_PASSED_PROC",
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
      field: "LOM_ID_OP_DECSN",
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

    // { "title": "Material No", "field": "LOM_NO_MATNR", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
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
    //{ "title": "Pallet Type", "field": "LOM_PALLET_CODE", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
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
    }
  ];
  const reportTableColumns = [
    {
      title: "Workcenter",
      field: "WORKCENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "slit_cons_ONDT(MT)",
      field: "SLIT_CONSUMED_ONDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#8CA0A4";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "A Prime wt_ONDT(MT)",
      field: "PRIME_WEIGHT_ONDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: function(values, data, calcParams){
        // values - array of column values passed from bottomCalcParams
        // data - all table data
        // calcParams - params passed from the bottomCalcParams function
       
        if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
          // Calculate the percentage
          
          var first = calcParams.valuesToSum[0];
          var second = calcParams.valuesToSum[1];
          var percentage = second !== 0 ? (first / second) * 100 : 0;
          return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
          }
          
          return 'N/A'; // Return 'N/A' if the conditions are not met
        },
        bottomCalcParams: function paramLookup(values, data){
        // values - array of column values
        // data - all table data
        
        // Filter the data to find rows where RED is 1
        let valuesToSum = [];
        data.forEach(function(row){
        if(row.WORKCENTER === 'TOTAL'){
        valuesToSum.push(row.PRIME_WEIGHT_ONDT);
        valuesToSum.push(row.SLIT_CONSUMED_ONDT);
        }
        });
        return {valuesToSum};
        },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
},
{
      title: "B open wt_ONDT(MT)",
      field: "OPEN_TUBE_WEIGHT_ONDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: function(values, data, calcParams){
        // values - array of column values passed from bottomCalcParams
        // data - all table data
        // calcParams - params passed from the bottomCalcParams function
        
        if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
          // Calculate the percentage
          var first = calcParams.valuesToSum[0];
          var second = calcParams.valuesToSum[1];
          var percentage = second !== 0 ? (first / second) * 100 : 0;
          return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
          }
          
          return 'N/A'; // Return 'N/A' if the conditions are not met
        },
        bottomCalcParams: function paramLookup(values, data){
        // values - array of column values
        // data - all table data
        
        // Filter the data to find rows where RED is 1
        let valuesToSum = [];
        data.forEach(function(row){
        if(row.WORKCENTER === 'TOTAL'){
        valuesToSum.push(row.OPEN_TUBE_WEIGHT_ONDT);
        valuesToSum.push(row.SLIT_CONSUMED_ONDT);
        }
        });
        return {valuesToSum};
        },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
},
{
      title: "C CQ wt_ONDT(MT)",
      field: "CQ_TUBE_WEIGHT_ONDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: function(values, data, calcParams){
        // values - array of column values passed from bottomCalcParams
        // data - all table data
        // calcParams - params passed from the bottomCalcParams function
        
        if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
          // Calculate the percentage
          var first = calcParams.valuesToSum[0];
          var second = calcParams.valuesToSum[1];
          var percentage = second !== 0 ? (first / second) * 100 : 0;
          return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
          }
          
          return 'N/A'; // Return 'N/A' if the conditions are not met
        },
        bottomCalcParams: function paramLookup(values, data){
        // values - array of column values
        // data - all table data
        
        // Filter the data to find rows where RED is 1
        let valuesToSum = [];
        data.forEach(function(row){
        if(row.WORKCENTER === 'TOTAL'){
        valuesToSum.push(row.CQ_TUBE_WEIGHT_ONDT);
        valuesToSum.push(row.SLIT_CONSUMED_ONDT);
        }
        });
        return {valuesToSum};
        },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
},
{
      title: "D Scarf wt_ONDT(MT)",
      field: "SCARFING_WEIGHT_ONDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: function(values, data, calcParams){
        // values - array of column values passed from bottomCalcParams
        // data - all table data
        // calcParams - params passed from the bottomCalcParams function
        
        if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
          // Calculate the percentage
          var first = calcParams.valuesToSum[0];
          var second = calcParams.valuesToSum[1];
          var percentage = second !== 0 ? (first / second) * 100 : 0;
          return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
          }
          
          return 'N/A'; // Return 'N/A' if the conditions are not met
        },
        bottomCalcParams: function paramLookup(values, data){
        // values - array of column values
        // data - all table data
        
        // Filter the data to find rows where RED is 1
        let valuesToSum = [];
        data.forEach(function(row){
        if(row.WORKCENTER === 'TOTAL'){
        valuesToSum.push(row.SCARFING_WEIGHT_ONDT);
        valuesToSum.push(row.SLIT_CONSUMED_ONDT);
        }
        });
        return {valuesToSum};
        },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
},
{
      title: "E strip end wt_ONDT(MT)",
      field: "STRIP_END_WEIGHT_ONDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: function(values, data, calcParams){
        // values - array of column values passed from bottomCalcParams
        // data - all table data
        // calcParams - params passed from the bottomCalcParams function
        
        if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
          // Calculate the percentage
          var first = calcParams.valuesToSum[0];
          var second = calcParams.valuesToSum[1];
          var percentage = second !== 0 ? (first / second) * 100 : 0;
          return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
          }
          
          return 'N/A'; // Return 'N/A' if the conditions are not met
        },
        bottomCalcParams: function paramLookup(values, data){
        // values - array of column values
        // data - all table data
        
        // Filter the data to find rows where RED is 1
        let valuesToSum = [];
        data.forEach(function(row){
        if(row.WORKCENTER === 'TOTAL'){
        valuesToSum.push(row.STRIP_END_WEIGHT_ONDT);
        valuesToSum.push(row.SLIT_CONSUMED_ONDT);
        }
        });
        return {valuesToSum};
        },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
},
{
      title: "F Tube End wt_ONDT(MT)",
      field: "TUBE_END_WEIGHT_ONDT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: function(values, data, calcParams){
        // values - array of column values passed from bottomCalcParams
        // data - all table data
        // calcParams - params passed from the bottomCalcParams function
        
        if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
          // Calculate the percentage
          var first = calcParams.valuesToSum[0];
          var second = calcParams.valuesToSum[1];
          var percentage = second !== 0 ? (first / second) * 100 : 0;
          return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
          }
          
          return 'N/A'; // Return 'N/A' if the conditions are not met
        },
        bottomCalcParams: function paramLookup(values, data){
        // values - array of column values
        // data - all table data
        
        // Filter the data to find rows where RED is 1
        let valuesToSum = [];
        data.forEach(function(row){
        if(row.WORKCENTER === 'TOTAL'){
        valuesToSum.push(row.TUBE_END_WEIGHT_ONDT);
        valuesToSum.push(row.SLIT_CONSUMED_ONDT);
        }
        });
        return {valuesToSum};
        },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
},
    {
      title: "slit_cons_TODT(MT)",
      field: "SLIT_CONSUMED",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#8CA0A4";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
},
{
  title: "A Prime wt_TODT(MT)",
  field: "PRIME_WEIGHT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  bottomCalc: function(values, data, calcParams){
    // values - array of column values passed from bottomCalcParams
    // data - all table data
    // calcParams - params passed from the bottomCalcParams function
    
    if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
      // Calculate the percentage
      var first = calcParams.valuesToSum[0];
      var second = calcParams.valuesToSum[1];
      var percentage = second !== 0 ? (first / second) * 100 : 0;
      return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
      }
      
      return 'N/A'; // Return 'N/A' if the conditions are not met
    },
    bottomCalcParams: function paramLookup(values, data){
    // values - array of column values
    // data - all table data
    
    // Filter the data to find rows where RED is 1
    let valuesToSum = [];
    data.forEach(function(row){
    if(row.WORKCENTER === 'TOTAL'){
    valuesToSum.push(row.PRIME_WEIGHT);
    valuesToSum.push(row.SLIT_CONSUMED);
    }
    });
    return {valuesToSum};
        },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
},
{
  title: "B Open TODT(MT)",
  field: "OPEN_TUBE_WEIGHT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  bottomCalc: function(values, data, calcParams){
    // values - array of column values passed from bottomCalcParams
    // data - all table data
    // calcParams - params passed from the bottomCalcParams function
    
    if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
      // Calculate the percentage
      var first = calcParams.valuesToSum[0];
      var second = calcParams.valuesToSum[1];
      var percentage = second !== 0 ? (first / second) * 100 : 0;
      return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
      }
      
      return 'N/A'; // Return 'N/A' if the conditions are not met
    },
    bottomCalcParams: function paramLookup(values, data){
    // values - array of column values
    // data - all table data
    
    // Filter the data to find rows where RED is 1
    let valuesToSum = [];
    data.forEach(function(row){
    if(row.WORKCENTER === 'TOTAL'){
    valuesToSum.push(row.OPEN_TUBE_WEIGHT);
    valuesToSum.push(row.SLIT_CONSUMED);
    }
    });
    return {valuesToSum};
        },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
},
{
  title: "C CQ wt_TODT(MT)",
  field: "CQ_TUBE_WEIGHT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  bottomCalc: function(values, data, calcParams){
    // values - array of column values passed from bottomCalcParams
    // data - all table data
    // calcParams - params passed from the bottomCalcParams function
    
    if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
      // Calculate the percentage
      var first = calcParams.valuesToSum[0];
      var second = calcParams.valuesToSum[1];
      var percentage = second !== 0 ? (first / second) * 100 : 0;
      return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
      }
      
      return 'N/A'; // Return 'N/A' if the conditions are not met
    },
    bottomCalcParams: function paramLookup(values, data){
    // values - array of column values
    // data - all table data
    
    // Filter the data to find rows where RED is 1
    let valuesToSum = [];
    data.forEach(function(row){
    if(row.WORKCENTER === 'TOTAL'){
    valuesToSum.push(row.CQ_TUBE_WEIGHT);
    valuesToSum.push(row.SLIT_CONSUMED);
    }
    });
    return {valuesToSum};
        },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
},
{
  title: "D Scarf wt_TODT(MT)",
  field: "SCARFING_WEIGHT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  bottomCalc: function(values, data, calcParams){
    // values - array of column values passed from bottomCalcParams
    // data - all table data
    // calcParams - params passed from the bottomCalcParams function
    
    if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
      // Calculate the percentage
      var first = calcParams.valuesToSum[0];
      var second = calcParams.valuesToSum[1];
      var percentage = second !== 0 ? (first / second) * 100 : 0;
      return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
      }
      
      return 'N/A'; // Return 'N/A' if the conditions are not met
    },
    bottomCalcParams: function paramLookup(values, data){
    // values - array of column values
    // data - all table data
    
    // Filter the data to find rows where RED is 1
    let valuesToSum = [];
    data.forEach(function(row){
    if(row.WORKCENTER === 'TOTAL'){
    valuesToSum.push(row.SCARFING_WEIGHT);
    valuesToSum.push(row.SLIT_CONSUMED);
    }
    });
    return {valuesToSum};
        },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
},
{
  title: "E strip end wt_TODT(MT)",
  field: "STRIP_END_WEIGHT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  bottomCalc: function(values, data, calcParams){
    // values - array of column values passed from bottomCalcParams
    // data - all table data
    // calcParams - params passed from the bottomCalcParams function
    
    if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
      // Calculate the percentage
      var first = calcParams.valuesToSum[0];
      var second = calcParams.valuesToSum[1];
      var percentage = second !== 0 ? (first / second) * 100 : 0;
      return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
      }
      
      return 'N/A'; // Return 'N/A' if the conditions are not met
    },
    bottomCalcParams: function paramLookup(values, data){
    // values - array of column values
    // data - all table data
    
    // Filter the data to find rows where RED is 1
    let valuesToSum = [];
    data.forEach(function(row){
    if(row.WORKCENTER === 'TOTAL'){
    valuesToSum.push(row.STRIP_END_WEIGHT);
    valuesToSum.push(row.SLIT_CONSUMED);
    }
    });
    return {valuesToSum};
        },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
},
{
  title: "F Tube End wt_TODT(MT)",
  field: "TUBE_END_WEIGHT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  bottomCalc: function(values, data, calcParams){
    // values - array of column values passed from bottomCalcParams
    // data - all table data
    // calcParams - params passed from the bottomCalcParams function
    
    if(calcParams && calcParams.valuesToSum && calcParams.valuesToSum.length === 2){
      // Calculate the percentage
      var first = calcParams.valuesToSum[0];
      var second = calcParams.valuesToSum[1];
      var percentage = second !== 0 ? (first / second) * 100 : 0;
      return percentage.toFixed(2) + '%'; // Return the result as a string with a percentage sign
      }
      
      return 'N/A'; // Return 'N/A' if the conditions are not met
    },
    bottomCalcParams: function paramLookup(values, data){
    // values - array of column values
    // data - all table data
    
    // Filter the data to find rows where RED is 1
    let valuesToSum = [];
    data.forEach(function(row){
    if(row.WORKCENTER === 'TOTAL'){
    valuesToSum.push(row.TUBE_END_WEIGHT);
    valuesToSum.push(row.SLIT_CONSUMED);
    }
    });
    return {valuesToSum};
        },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    cell.getElement().style["background-color"] = "#FFFFFF";
        cell.getElement().style["color"] = "#000000";
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
},
{
  title: "MillYldOnDt% wrt Prime",
  field: "TubMillYld1",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  mutator: function  (value, data, type, mutatorParams, cell)  {
    const primeTubeWeight = data.PRIME_WEIGHT_ONDT;
    const openTubeWeight = data.OPEN_TUBE_WEIGHT_ONDT;
    const cqTubeWeight = data.CQ_TUBE_WEIGHT_ONDT;
    const sum = primeTubeWeight + openTubeWeight + cqTubeWeight;
    
    if (primeTubeWeight && openTubeWeight && cqTubeWeight && sum !== 0) {
    const xyzValue = (primeTubeWeight / sum) * 100;
    return xyzValue.toFixed(2);
    }
    
    return "0.00"; // Return the original value if the condition is not met
    },
  formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#8CA0A4";
        cell.getElement().style["color"] = "#FFFFFF";
  //   const primeTubeWeight = cell.getRow().getCell("PRIME_WEIGHT_ONDT").getValue();
  //   const openTubeWeight = cell.getRow().getCell("OPEN_TUBE_WEIGHT_ONDT").getValue();
  //   const cqTubeWeight = cell.getRow().getCell("CQ_TUBE_WEIGHT_ONDT").getValue();
  //   const sum=(primeTubeWeight+openTubeWeight+cqTubeWeight);
  //   if (primeTubeWeight && openTubeWeight && cqTubeWeight &&  sum!== 0) {
  //   const xyzValue = (primeTubeWeight / sum) * 100;
  //   row.update({id:"TubMillYld1" +  cell.getRow().getData().id});
  //   return xyzValue.toFixed(2);
  // }
  return cell.getValue();
},
},
{
  title: "MillYldToDt% wrt Prime",
  field: "TubMillYld2",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  mutator: function  (value, data, type, mutatorParams, cell)  {
    const primeTubeWeight = data.PRIME_WEIGHT;
    const openTubeWeight = data.OPEN_TUBE_WEIGHT;
    const cqTubeWeight = data.CQ_TUBE_WEIGHT;
    const sum = primeTubeWeight + openTubeWeight + cqTubeWeight;
    
    if (primeTubeWeight && openTubeWeight && cqTubeWeight && sum !== 0) {
    const xyzValue = (primeTubeWeight / sum) * 100;
    return xyzValue.toFixed(2);
    }
    
    return "0.00"; // Return the original value if the condition is not met
    },
  formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#8CA0A4";
        cell.getElement().style["color"] = "#FFFFFF";
  //   const primeTubeWeight = cell.getRow().getCell("PRIME_WEIGHT_ONDT").getValue();
  //   const openTubeWeight = cell.getRow().getCell("OPEN_TUBE_WEIGHT_ONDT").getValue();
  //   const cqTubeWeight = cell.getRow().getCell("CQ_TUBE_WEIGHT_ONDT").getValue();
  //   const sum=(primeTubeWeight+openTubeWeight+cqTubeWeight);
  //   if (primeTubeWeight && openTubeWeight && cqTubeWeight &&  sum!== 0) {
  //   const xyzValue = (primeTubeWeight / sum) * 100;
  //   row.update({id:"TubMillYld1" +  cell.getRow().getData().id});
  //   return xyzValue.toFixed(2);
  // }
  return cell.getValue();
},
},
{
  title: "MillYldOnDt% wrt Slit",
  field: "TubMillYld3",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  mutator: function  (value, data, type, mutatorParams, cell)  {
    const primeTubeWeight = data.PRIME_WEIGHT_ONDT;
    const slitTubeWeight = data.SLIT_CONSUMED_ONDT;
    //const sum = primeTubeWeight + openTubeWeight + cqTubeWeight;
    
    if (primeTubeWeight && slitTubeWeight && slitTubeWeight !== 0) {
    const xyzValue = (primeTubeWeight / slitTubeWeight) * 100;
    return xyzValue.toFixed(2);
    }
    
    return "0.00"; // Return the original value if the condition is not met
    },
  formatter: function (cell, formatterParams) {
    cell.getElement().style["background-color"] = "#8CA0A4";
        cell.getElement().style["color"] = "#FFFFFF";
    // const primeTubeWeight = cell.getRow().getCell("PRIME_WEIGHT_ONDT").getValue();
    // const slitTubeWeight = cell.getRow().getCell("SLIT_CONSUMED_ONDT").getValue();
    // if (primeTubeWeight && slitTubeWeight && slitTubeWeight!== 0) {
    // const xyzValue = (primeTubeWeight / slitTubeWeight) * 100;
    // return xyzValue.toFixed(2);
  // }
  return cell.getValue();
},
},
{
  title: "MillYldToDt% wrt Slit",
  field: "TubMillYld4",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  mutator: function  (value, data, type, mutatorParams, cell)  {
    const primeTubeWeight = data.PRIME_WEIGHT;
    const slitTubeWeight = data.SLIT_CONSUMED;
    //const sum = primeTubeWeight + openTubeWeight + cqTubeWeight;
    
    if (primeTubeWeight && slitTubeWeight && slitTubeWeight !== 0) {
    const xyzValue = (primeTubeWeight / slitTubeWeight) * 100;
    return xyzValue.toFixed(2);
    }
    
    return "0.00"; // Return the original value if the condition is not met
    },
  formatter: function (cell, formatterParams) {
    cell.getElement().style["background-color"] = "#8CA0A4";
        cell.getElement().style["color"] = "#FFFFFF";
  //   const primeTubeWeight = cell.getRow().getCell("PRIME_WEIGHT").getValue();
  //   const slitTubeWeight = cell.getRow().getCell("SLIT_CONSUMED").getValue();
  //   if (primeTubeWeight && slitTubeWeight && slitTubeWeight!== 0) {
  //   const xyzValue = (primeTubeWeight / slitTubeWeight) * 100;
  //   return xyzValue.toFixed(2);
  // }
  return cell.getValue();
},
}
  ];
 
  const clearFilter = () => {
    setSelectedPlant([]);
    setSelectedProcess([]);
    setSelectedNextProcess([]);
    setChartState1(null);
    // setSelectProcess([]);
    // setSelectOrdTyp([]);
    // setSelectCustomer([]);
    setAllValues({});
    // setGridData([]);
    setProdInquiryData([]);
    setReportData([]);
    setDateValueFrom(null);
    setDateValueTo(null);
    setSchedDtValueFrom(null);
    setSchedDtValueTo(null);
    setProdType(null);
    // setSelectedCustomerTable(null)
  };

  const downloadExcelcustomerTableData = () => {
    // const newData = reportTable.getData();
    //         setReportData(newData); 
    // console.log(reportData);
    if (reportData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM009 "+ ".xlsx";
    reportTable.download("xlsx", fileName, {
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
  var options = {
    responsive: true,
    plugins: {
        datalabels: {
            display: 'auto',
            color: "black",
            formatter: Math.round,
            anchor: "end",
            offset: -30,
            align: "start"
        },
        title: {
            display: true,
            text: 'Today Tube Mill Yield %(Wt.of Prime tube/Wt.Of slit consumed)',
        },
    },
    scales: {
        y: {
            title: {
                display: true,
                text: 'Yield Per cent',
            }
        }
    }
};

  const handlePnameChange = (value) => {
    if (value) {
      setSelectPname(value);
      setProdInquiryData([]);
      setReportData([]);
    } else {
      setSelectPname([]);
    }
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Reports"
        page="Yield Report"
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
                    <Grid container spacing={1.5}>
                      <Grid item xs={1.7}>
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
                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getReportData(true)}
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
                          Tube Mill Production & Yield Report from MES
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
                      <Grid item xs={12} >
                        <div id="reportTable"  />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {reportData.length} of{" "}
                          {reportData.length} entries
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
                                        py={1.5}
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
                                                    Yield Graph
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={2}></Grid>
                                            <Grid item xs={1}>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    <MDBox px={4} py={4}>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                        ></Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {/* {chartState3 && (<div style={{ paddingLeft: "23rem", marginBottom: "1rem" }}>Stage Wise GR</div>)} */}
                                                {chartState1 && (
                                                    <Line
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState1}
                                                        options={options} />
                                                )}
                                            </Grid>



                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {chartState1 && (
                                                    <Line
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState1}
                                                        options={options} />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    <MDBox px={4} py={4}>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                        ></Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {chartState1 && (
                                                    <Line
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState1}
                                                        options={options} />
                                                )}
                                            </Grid>
                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {/* {chartState4 && (<div style={{ paddingLeft: "24rem", marginBottom: "1rem" }}>Stage wise stock</div>)} */}
                                                {chartState1 && (
                                                    <Line
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState1}
                                                        options={options} />
                                                )}
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
