import React, { useEffect, useState, useRef, forwardRef } from "react";

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
import Preloader from "components/Preloader/Preloader";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DatePicker from "components/DateTime/DatePicker";

import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import ReactSelect from "components/Select/ReactSelect";
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
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import TTSM020PlanModal from "./Modals/TTSM020PlanModal";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";

export default function TubePlanning() {
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
  // const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [customerDesc, setCustomerDesc] = useState([]);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);


  const [odiaFrmList, setOdiaFrmList] = useState([]);
  const [odiaToList, setOdiaToList] = useState([]);
  const [selectedOdiaFrm, setSelectedOdiaFrm] = useState([]);
  const [selectedOdiaTo, setSelectedOdiaTo] = useState([]);
  const [ordDtFrm, setordDtFrm] = useState(null);
  const [ordDtTo, setordDtTo] = useState(null);

  const [orderType, setorderType] = useState([]);
  const [selectedorderType, setSelectedorderType] = useState([]);

  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [tubesData, setTubesData] = React.useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);

  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    order: "",
    item: "",
    div: "",
    orderType: "",
    materialNo: "",
    trackNo: "",
    prodCD: "",
    qultyCd: "",
    thikFrm: "",
    thikTo: "",
    // widthFrm: "",
    // widthTo: "",
    tdc: "",
  });

  const handleChange = (e) => {
    if (e.target.name == "order" && e.target.value.length > 10) {
      alertify.error("Order Size can not be greater than 10");
    } else {
      setAllValues({ ...allValues, [e.target.name]: e.target.value });
    }
  };

  var printIcon = function (cell, formatterParams, onRendered) {
    return "<i class='fa-solid fa-square' style='color:#49a3f1'></i>";
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
        getProdCat(token.accessToken)
      ]).finally(() => {
        setLoading(false);
      })
    })
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);


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
      var pageName = "TTSM020";

      var authDetails = await getScreenAuth(plant, userId, pageName, token.accessToken);


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
            alertify.success("You are authorized to make changes from this page");
          } else {
            setReadWriteAccess(true);
            alertify.error("You are not authorized to make changes from this page");
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
            Promise.all([
              getCustDesc(items[0], accessToken),
              getOrdTyp(items[0], accessToken),
              getOdiaFrm(items[0], accessToken),
              getOdiaTo(items[0], accessToken),
              getOrderType(items[0], accessToken)
            ]).finally(() => {
              resolve()
            })
          }
        })
        .catch((f) => {
          resolve();
        });
    })
  };

  useEffect(() => {
    if (tubesData && tubesData.length > 0) {
      setTubesDataTable(
        new Tabulator("#custTable", {
          //   height: 500,
          //   frozenRows: 2,
            pagination: "local", //enable local pagination.
            paginationSize: 12, 
            data: tubesData,
          columns: TubePlanColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [tubesData]);

  const getCustDesc = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm007/GetCustDesc";
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
            setCustomerDesc(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    })
  };

  const getOrdTyp = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm007/GetOrdTyp";
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
            setOrdType(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    })
  };

  const getProdCat = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/ttsm007/GetProdCat";
      axiosAPI
        .post(url, null, defaultOptions)
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
    })
  };

  const handlePlantChange = (value) => {
    //clear all data
    setSelectedPlant([]);
    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);
    setSelectedorderType([]);
    setAllValues({});
    setSelectCustomerDesc([]);
    setordDtFrm(null);
    setordDtTo(null);

    setTubesData([,]);
    setTubesDataTable(null);
    //end clear all data

    setSelectedPlant(value);
    //  alert(selectedPlant.value)
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getCustDesc(value, token.accessToken),
          getOrdTyp(value, token.accessToken),
          getOdiaFrm(value, token.accessToken),
          getOdiaTo(value, token.accessToken),
          getOrderType(value, token.accessToken)
        ]).finally(() => {
          setLoading(false);
        })
      })
    }
  };

  const getOdiaFrm = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm003/odiafrm";
      let data = {
        plant: value.value
      }
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row.toFixed(3);
              obj.value = row.toFixed(3);
              items.push(obj);
            });
            setOdiaFrmList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    })
  };

  const getOdiaTo = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm003/odiato";
      let data = {
        plant: value.value
      }
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row.toFixed(3);
              obj.value = row.toFixed(3);
              items.push(obj);
            });
            setOdiaToList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    })
  };

  const getOrderType = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/ttsm020/getOrderType";
      let data = {
        plant: value.value
        
      }
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
            setorderType(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    })
  };

  const handleCustomerChange = (value) => {
    if (value) {
      setSelectCustomerDesc(value);
    } else {
      setSelectCustomerDesc([]);
    }
  };

  const handleOdiaFrmChange = (e) => {
    if (e) {
      setSelectedOdiaFrm(e);
    } else {
      setSelectedOdiaFrm([]);
    }
  };

  const handleOrderTypechange = (value) => {
    setSelectedorderType(value);
  }

  const handleOdiaToChange = (e) => {
    if (e) {
      setSelectedOdiaTo(e);
    } else {
      setSelectedOdiaTo([]);
    }
  };

  const handleOrdTypeChange = (value) => {
    setSelectOrderType(value);
  };

  const handlePCatChange = (value) => {
    setSelectPcat(value);
  };

  const getData = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url;
      var thick1 = allValues.thikFrm;
      var thick2 = allValues.thikTo;
      if (thick1 == "" && thick2 != "") {
        thick1 = allValues.thikTo;
        thick2 = allValues.thikTo;
      } else if (thick2 == "" && thick1 != "") {
        thick1 = allValues.thikFrm;
        thick2 = allValues.thikFrm;
      } else if (thick1 > thick2) {
        thick1 = "0";
        thick2 = "0";
        alertify.error("Thickness from cannot be greater than Thickness To");
        return;
      }
      var odia1 = selectedOdiaFrm.value;
      var odia2 = selectedOdiaTo.value;
      if (odia1 == "" && odia2 != "") {
        odia1 = selectedOdiaFrm.value;
        odia2 = selectedOdiaTo.value;
      } else if (odia2 == "" && odia1 != "") {
        odia1 = selectedOdiaFrm.value;
        odia2 = selectedOdiaTo.value;
      } else if (odia1 > odia2) {
        odia1 = "0";
        odia2 = "0";
        alertify.error("Width from cannot be greater than Width To");
        return;
      }
      var data = {
        plant: selectedPlant.value ? selectedPlant.value : "",
        Order1: allValues.order ? allValues.order : "",
        Item: allValues.item ? allValues.item : "",
        div: allValues.div ? allValues.div : "",
        orderType: selectedorderType.value ? selectedorderType.value : "",
        MatNo: allValues.materialNo ? allValues.materialNo : "",
        tdc: allValues.tdc ? allValues.tdc : "",
        thickFrm: thick1 ? thick1 : "",
        thickTo: thick2 ? thick2 : "",
        widthFrm: odia1 ? odia1 : "",
        widthTo: odia2 ? odia2 : "",
        cust: selectCustomerDesc.value ? selectCustomerDesc.value : "",
        ORDDTFROM: ordDtFrm
        ? ("0" + new Date(ordDtFrm).getDate()).slice(-2) +
          "-" +
          new Date(ordDtFrm).toString().substr(4, 3) +
          "-" +
          new Date(ordDtFrm).getFullYear()
        : "",
        ORDDTTO: ordDtTo
        ? ("0" + new Date(ordDtTo).getDate()).slice(-2) +
          "-" +
          new Date(ordDtTo).toString().substr(4, 3) +
          "-" +
          new Date(ordDtTo).getFullYear()
        : "",
        // Plant: selectedPlant.value ? selectedPlant.value : "",
      };

      console.log("Selected Order Type:", selectedorderType.value);


      url = "api/ttsm020/getTubePlanData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data found");
              setTubesData([,]);
            } else {
              //   var rows = [];
              // for (var i in response.data) {
              //   var rowdata = response.data[i];
              //   rows.push({
              //     rowId : i,
              //     ALLOTED_TO				     : rowdata.ALLOTED_TO ,	
              //     BALANCE_TO_PLAN_TO : rowdata.BALANCE_TO_PLAN_TO ,
              //     BTA_RM : rowdata.BTA_RM ,
              //     BTF : rowdata.BTF ,
              //     BTR : rowdata.BTR ,
              //     CITY : rowdata.CITY ,
              //     COMP : rowdata. ,
              //     CUST_CODE : rowdata. ,
              //     CUST_NM : rowdata. ,
              //     DISPATCHED_TO : rowdata. ,
              //     END_FINISH : rowdata. ,
              //     FG_KG : rowdata. ,
              //     FG_MATNR : rowdata. ,
              //     FG_MATNR_DESC : rowdata. ,
              //     FINISH : rowdata. ,
              //     IDIA : rowdata. ,
              //     LENGTH : rowdata. ,
              //     MAT_GROUP : rowdata. ,
              //     ODIA : rowdata. ,
              //     ORDERITEM : rowdata. ,
              //     ORDERNO : rowdata. ,
              //     ORDER_ACTIVE_FLAG : rowdata. ,
              //     ORDER_CRT_DT : rowdata. ,
              //     ORDER_EDGE : rowdata. ,
              //     ORD_QTY : rowdata. ,
              //     PENDING_FOR_PKG_KG : rowdata. ,
              //     PLANT : rowdata. ,
              //     QA_KG : rowdata. ,
              //     REGION : rowdata. ,
              //     RM_FREE_STOCK_TO : rowdata. ,
              //     RM_MATNR : rowdata. ,
              //     RM_MATNR_DESC : rowdata. ,
              //     SALES_OFFICE : rowdata. ,
              //     SALES_ORG : rowdata. ,
              //     SCHEDULE_IN_KG : rowdata. ,
              //     SFG_MATNR : rowdata. ,
              //     SFG_MATNR_DESC : rowdata. ,
              //     STATUS : rowdata. ,
              //     THICKNESS : rowdata. ,
              //     WIDTH_ODIA : rowdata. ,
              //     WIP_KG : rowdata. ,

              //   });
              // }
              setTubesData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    })
  };
  const getReftesh = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      axiosAPI
        .post("api/ttsm020/getRefresh", null, defaultOptions)
        .finally((f) => {
          setLoading(false);
        });
    })
  };

  const handleClickOpen = async (cell) => {
    setModalData(cell._cell.row.data);
    setShowModal(true);
  };

  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
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

  // const TubePlanColumn1 = [
  //   {
  //     title: "Plant",
  //     field: "PLANT",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     frozen: true,
  //   },
  //   {
  //     title: "Order No",
  //     field: "ORDERNO",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     frozen: true,
  //   },
  //   {
  //     formatter: printIcon,
  //     width: 40,
  //     align: "center",
  //     cellClick: function (e, cell) {
  //       handleClickOpen(cell);
  //     },
  //     frozen: true,
  //   },
  //   {
  //     title: "Item",
  //     field: "ORDERITEM",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     frozen: true,
  //   },
  //   {
  //     title: "Thickness",
  //     field: "THICKNESS",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     // formatter: "money",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //   },

  //   {
  //     title: "Width/Odia",
  //     field: "WIDTH_ODIA",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //   },
  //   {
  //     title: "Customer Code",
  //     field: "CUST_CODE",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Custome Name",
  //     field: "CUST_NM",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Order Qty.(TON)",
  //     field: "ORD_QTY",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     //   formatter: "money",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },

  //   {
  //     title: "FG(KG)",
  //     field: "FG_KG",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },

  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },

  //   {
  //     title: "WIP(KG)",
  //     field: "WIP_KG",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     //   formatter: "money",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },
  //   {
  //     title: "BTF(TON)",
  //     field: "BTF",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var data = cell.getData();
  //       // Order qty - ( FG/1000)
  //       // var value = data.ORD_QTY - ((data.FG_KG/1000));
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },

  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },
  //   {
  //     title: "BTR(TON)",
  //     field: "BTR",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var data = cell.getData();
  //       // Order qty - ( FG/1000 + WIP/1000 )
  //       // var value = data.ORD_QTY - ((data.FG_KG/1000) + (data.WIP_KG/1000));
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },

  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },
  //   {
  //     title: "Alloted(TON)",
  //     field: "ALLOTED_TO",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },

  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },

  //   {
  //     title: "BTA RM(TON)",
  //     field: "BTA",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       // var data = cell.getData();
  //       // Order qty - ( FG/1000 + WIP/1000 + ALLOTED)
  //       // var value = data.ORD_QTY - ((data.FG_KG/1000) + (data.WIP_KG/1000) + data.ALLOTED_TO);
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },

  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },

  //   {
  //     title: "Length",
  //     field: "LENGTH",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     // formatter: "money",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //   },
  //   {
  //     title: "Finish",
  //     field: "FINISH",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Idia",
  //     field: "IDIA",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //   },
  //   {
  //     title: "Odia",
  //     field: "ODIA",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //   },

  //   {
  //     title: "FG Material",
  //     field: "FG_MATNR",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "FG Material Desc",
  //     field: "FG_MATNR_DESC",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "SFG Material",
  //     field: "SFG_MATNR",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "SFG Material Desc",
  //     field: "SFG_MATNR_DESC",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "RM Material",
  //     field: "RM_MATNR",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "RM Material Desc",
  //     field: "RM_MATNR_DESC",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },

  //   {
  //     title: "City",
  //     field: "CITY",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Order Edge",
  //     field: "ORDER_EDGE",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Order Creation Date",
  //     field: "ORDER_CRT_DT",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Region",
  //     field: "REGION",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Status",
  //     field: "STATUS",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "MAT GROUP",
  //     field: "MAT_GROUP",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "End Finish",
  //     field: "END_FINISH",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Comp.",
  //     field: "COMP",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Order Active Flag",
  //     field: "ORDER_ACTIVE_FLAG",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },


  //   {
  //     title: "Balance to Plan(TON)",
  //     field: "BALANCE_TO_PLAN_TO",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     //   formatter: "money",
  //     formatter: function (cell, formatterParams) {


  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },


  //   {
  //     title: "QA(KG)",
  //     field: "QA_KG",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },
  //   {
  //     title: "Schedule(KG)",
  //     field: "SCHEDULE_IN_KG",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },

  //   {
  //     title: "Pending for Pkg(KG)",
  //     field: "PENDING_FOR_PKG_KG",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },
  //   {
  //     title: "RM Free Stock(TON)",
  //     field: "RM_FREE_STOCK_TO",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     //   formatter: "money",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },
  //   {
  //     title: "Dispatched Qty.(TON)",
  //     field: "DISPATCHED_TO",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //     //   formatter: "money",
  //     formatter: function (cell, formatterParams) {
  //       var value = cell.getValue();
  //       if (value) {
  //         return value.toFixed(3);
  //       }
  //       return value
  //     },
  //     bottomCalc: "sum",
  //     bottomCalcParams: { precision: 3 },
  //   },


  //   // { "title": "Grade", "field": "GRADEDESC", "headerFilter": "input", "headerFilterPlaceholder": "search..." },

  //   // {
  //   //   title: "Order Balance Qty(C = A-B)",
  //   //   field: "EOP_BAL_QTY",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },

  //   // {
  //   //   title: "Net Balance Qty (E = C-D)",
  //   //   field: "EOP_NET_BAL_QTY",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },

  //   // {
  //   //   title: "WIP attached with Order Qty(G)",
  //   //   field: "EOP_WIP_SO_QTY",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   //   formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },
  //   // {
  //   //   title: "Total WIP Qty(H = F+G)",
  //   //   field: "EOP_TOT_WIP",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },

  //   // {
  //   //   title: "RM Qty avaliable for order",
  //   //   field: "EOP_RM_QTY",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },
  //   // {
  //   //   title: "RM Qty required for order",
  //   //   field: "EOP_REQ_RM_QTY",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },
  //   // {
  //   //   title: "RM Qty Shortfall",
  //   //   field: "EOP_RM_QTY_SHORTFALL",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },
  //   // {
  //   //   title: "Ref Standard",
  //   //   field: "EOP_REF_STD",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // },
  //   // { "title": "MAT DESC", "field": "EOP_RM_MATNR_DESC", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
  //   // {
  //   //   title: "Ship To Party",
  //   //   field: "EOP_SHIP_TO",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // },
  //   // {
  //   //   title: "Ship To Party Desc",
  //   //   field: "Ship_To_Party_Desc",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // },

  //   // {
  //   //   title: "SO ASSIGN STOCK QTY.",
  //   //   field: "EOP_SO_ASSIGNED_QTY",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },
  //   // {
  //   //   title: "TOTAL SO PRODUCTION QTY.",
  //   //   field: "EOP_TOT_SO_PROD_QTY",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   },
  //   //   bottomCalc: "sum",
  //   //   bottomCalcParams: { precision: 3 },
  //   // },
  //   // {
  //   //   title: "RAW MATERIAL PCODE",
  //   //   field: "EOP_RM_MATNR_PCODE",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // },
  //   // {
  //   //   title: "RAW MATERIAL QCODE",
  //   //   field: "EOP_RM_MATNR_QCODE",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // },
  //   // {
  //   //   title: "RAW MATERIAL THICK",
  //   //   field: "EOP_RM_MATNR_THK",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // //   formatter: "money",
  //   // formatter: function (cell, formatterParams) {
  //   //     var value = cell.getValue();
  //   //     if (value) {
  //   //         return value.toFixed(3);
  //   //     }
  //   //     return value
  //   //   }
  //   // },
  //   // {
  //   //   title: "RAW MATERIAL WIDTH",
  //   //   field: "EOP_RM_MATNR_WIDTH",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   //   formatter: "money",
  //   // },
  //   // {
  //   //   title: "RAW MATERIAL TDC",
  //   //   field: "RAW_MATERIAL_TDC",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   //   formatter: "money",
  //   // },
  //   // {
  //   //   title: "OLD MAT CODE",
  //   //   field: "EOP_OLD_MATNR",
  //   //   headerFilter: "input",
  //   //   headerFilterPlaceholder: "search...",
  //   // },
  //   {
  //     title: "Sales Organisation",
  //     field: "SALES_ORG",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },
  //   {
  //     title: "Sales Office",
  //     field: "SALES_OFFICE",
  //     headerFilter: "input",
  //     headerFilterPlaceholder: "search...",
  //   },

  // ];

  const TubePlanColumn = [
    // {
    //   title: "Plant",
    //   field: "EOP_CD_EPA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   frozen: true,
    // },
    {
      title: "Order Creation Dt",
      field: "ORD_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      width: 150,
    },
    // {
    //   formatter: printIcon,
    //   width: 40,
    //   align: "center",
    //   cellClick: function (e, cell) {
    //     handleClickOpen(cell);
    //   },
    //   frozen: true,
    //   download: false,
    // },
    {
      title: "Order",
      field: "ORDER_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Item",
      field: "ORDER_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Ord Type",
      field: "ORDER_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Division",
      field: "DIVISION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sales Office",
      field: "SALESOFFICE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "MARKCUSTNM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
    },
        {
      title: "FG Material",
      field: "FGMATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Desc",
      field: "FGMATERIALDESC",
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
      title: "Odia",
      field: "ODIA_WIDTH",
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
      title: "Thickness",
      field: "THICKNESS",
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
      field: "LENGTH1",
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
      title: "Receive Plant",
      field: "RECVPLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Quantity",
      field: "ORDQTY",
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
      title: "FG Tonnage",
      field: "FG_TON",
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
      title: "WIP Tonnage",
      field: "WIP_TON",
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
      title: "GR Quantity",
      field: "GR_QTY",
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
      title: "Balance To GR",
      field: "BAL_TO_GR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerTooltip: "Bal to GR = Order Qty - GR Qty",
      tooltip: "Bal to GR = Order Qty - GR Qty"
    },
    {
      title: "BTR Tonnage",
      field: "BTR_TON",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerTooltip: "Bal to Roll = Order Qty-WIP Qty-GR Qty",
      tooltip: "Bal to Roll = Order Qty-WIP Qty-GR Qty"
    },
    {
      title: "RM Alloted",
      field: "RMALLOTED",
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
      title: "BTA RM Tonnage",
      field: "BTA_RM_TON",
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
      title: "BTD",
      field: "BTD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerTooltip: "BTD = Ord QTY - DISP QTY",
      tooltip: "BTD = Ord QTY - DISP QTY"
    },
    {
      title: "Age in Days",
      field: "AGE_DAYS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material No.",
      field: "SFGMATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material Desc",
      field: "SFGMATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Tdc",
      field: "RM_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Odia",
      field: "SFG_ODIA",
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
      title: "SFG Idia",
      field: "SFG_IDIA",
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
      title: "SFG Thickness",
      field: "SFG_THK",
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
      title: "SFG Length",
      field: "SFG_LENGTH",
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
      title: "FG Pcode",
      field: "FG_PCODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Grade",
      field: "FG_GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sales Organisation",
      field: "SALESORG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ship To Party",
      field: "SHIP_TO_PARTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 250,
    },
    {
      title: "Material Group",
      field: "MAT_GRP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Spec",
      field: "MATERIAL_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Draw Type",
      field: "DRAWTYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Surface Finish",
      field: "SURFFINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Category",
      field: "CATEG",
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
      title: "Geometry",
      field: "GEOMETRY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Dispatched",
      field: "DISPATCHED",
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
      title: "RM Material No.",
      field: "RMMATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material Desc",
      field: "RMMATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "City",
      field: "EOP_CITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Edge",
      field: "ORDER_EDGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Region",
      field: "EOP_REGION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Company Code",
      field: "COMP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Status",
      field: "ORDER_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Balance to Plan (Ton)",
      field: "EOP_BAL_TO_PLAN",
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
      title: "QA (Ton)",
      field: "EOP_QA",
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
      title: "Schedule(TON)",
      field: "EOP_SCHEDULED",
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
      title: "Pending for PKG (TON)",
      field: "EOP_PKG",
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
      title: "RM Free Stock(TON)",
      field: "EOP_FREE_FG_STOCK",
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
      title: "BTF",
      field: "BTF",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerTooltip: "Order Quantity - FG QTY",
      tooltip: "Order Quantity - FG QTY"
    },
    {
      title: "Plant",
      field: "EOP_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer code",
      field: "CUST_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Fulfillment Date",
      field: "DT_ORD_FULFILL",
      headerFilter: "input",  
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Fulfillment Lead Days",
      field: "LEAD_DAY",
      headerFilter: "input",  
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Last Refresh Time",
      field: "LAST_REFRESH_TIME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }
  ];

  // const downloadExcelcustomerTableData = () => {
  //     var table = customerTable.table;
  //     let date = new Date();
  //     table.download(
  //         "xlsx",
  //         "customerTable" + date.toString() + ".xlsx",
  //         { sheetName: "MyData" }
  //     );
  // };
  const downloadExcelcustomerTableData = () => {
    if (tubesDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = tubesDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "TTSM020_Order_Status" + ".xlsx";


    tubesDataTable.download("xlsx", fileName, {
      sheetName: "TTSM020",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);
    // setCustomerDesc([]);
    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);
    setSelectedorderType([]);
    setAllValues({});
    setSelectCustomerDesc([]);
    setordDtFrm(null);
    setordDtTo(null);
    setTubesData([,]);
    setTubesDataTable(null);
  };

  return (
    <DashboardLayout>
            <DefaultNavbar
        routes={routes}
        module="Reports"
        page="Order Progress Report"
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
                      <Grid item xs={1.75} style={{ zIndex: 5 }}>
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
                          value={selectedPlant}
                          // onChange={({value }) => handlePlantChange(value)}
                          onChange={handlePlantChange}
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
                          Order
                        </MDTypography>

                        <MDInput
                          // type="number"
                          name="order"
                          value={allValues.order || ""}
                          //   inputProps={{ maxLength: 10 }}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      <Grid item xs={0.5}>
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
                          // type="number"
                          name="item"
                          value={allValues.item || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      <Grid item xs={0.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Division
                        </MDTypography>

                        <MDInput
                          // type="number"
                          name="div"
                          value={allValues.div || ""}
                          //   inputProps={{ maxLength: 10 }}
                          onChange={(e) => handleChange(e)}
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
                          Order Type
                        </MDTypography>

                        {/* <MDInput
                          type="number"
                          label=""
                          name="widthFrm"
                          value={allValues.widthFrm || ""}
                          onChange={(e) => handleChange(e)}
                        /> */}
                        <ReactSelect
                          id="orderType"
                          options={orderType}
                          value={selectedorderType}
                          onChange={handleOrderTypechange}
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
                          Material No.
                        </MDTypography>
                        <MDInput
                          name="materialNo"
                          value={allValues.materialNo || ""}
                          onChange={(e) => handleChange(e)}
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
                          TDC
                        </MDTypography>
                                                <MDInput name="tdc" value={allValues.tdc || ''} onChange={(e) => handleChange(e)} />
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
                          Customer
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={customerDesc}
                          value={selectCustomerDesc}
                          onChange={handleCustomerChange}
                        />
                      </Grid> */}

                      {/* <Grid item xs={.75}>
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
                          type="number"
                          name="thikFrm"
                          value={allValues.thikFrm || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid> */}
                      {/* <Grid item xs={.75}>
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
                          type="number"
                          name="thikTo"
                          value={allValues.thikTo || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid> */}

<Grid item xs={0.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Ord Date From{" "}
                        </MDTypography>
                        <DatePicker
                          id="orderDtFrm"
                          value={ordDtFrm}
                          onChange={(date) => setordDtFrm(date)}
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
                          Ord Date To{" "}
                        </MDTypography>
                        <DatePicker
                          id="orderDtTo"
                          value={ordDtTo}
                          onChange={(date) => setordDtTo(date)}
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
                          Odia From
                        </MDTypography>

                        {/* <MDInput
                          type="number"
                          label=""
                          name="widthFrm"
                          value={allValues.widthFrm || ""}
                          onChange={(e) => handleChange(e)}
                        /> */}
                        <ReactSelect
                          id="odiafrm"
                          options={odiaFrmList}
                          value={selectedOdiaFrm}
                          onChange={handleOdiaFrmChange}
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
                          Odia To
                        </MDTypography>

                        {/* <MDInput
                          type="number"
                          label=""
                          name="widthTo"
                          value={allValues.widthTo || ""}
                          onChange={(e) => handleChange(e)}
                        /> */}
                        <ReactSelect
                          id="odiato"
                          options={odiaToList}
                          value={selectedOdiaTo}
                          onChange={handleOdiaToChange}
                        />
                      </Grid>
                      <Grid item xs={.70}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                        >
                          Submit
                        </MDButton>
                      </Grid>
                      <Grid item xs={.70}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={getReftesh}
                          disabled={isReadWriteAccess}
                        >
                          Refresh
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
                          Order Progress
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
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
                        <div id="custTable" />

                        {/* <ReactTabulator
                                                    id="getCustomerTable"
                                                    ref={ref => { customerTable = ref }}
                                                    columns={TubePlanColumn} data={tubesData} options={options}
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
                          Showing 1 to {tubesData.length} of {tubesData.length}{" "}
                          entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
          {showModal && (
            <TTSM020PlanModal
              close={setShowModal}
              refreshTable={getData}
              data={modalData}
              //     dateOnlyFunc={dateOnly}
              //  dateTimeFunc={dateTimeOnly}
              //  setLoading = {setLoading}
              filterData={filter}
              open={showModal}
            // reason={reason}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
