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
import LDSM020PlanModal from "./Modals/LDSM020PlanModal";

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
  const [selectedOrderType, setSelectOrderType] = React.useState([]);
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
        getProdCat(token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
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
      var pageName = "LDSM020";

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
            ]).finally(() => {
              resolve();
            });
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

  useEffect(() => {
    if (tubesData && tubesData.length > 0) {
      setTubesDataTable(
        new Tabulator("#custTable", {
            height: 400,
            // frozenRows: 2,
            pagination: "local",
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

      var url = "api/LDSM007/GetCustDesc";
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
    });
  };

  const getOrdTyp = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/GetOrdTyp";
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
    });
  };

  const getProdCat = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM007/GetProdCat";
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
    });
  };

  const handlePlantChange = (value) => {
    //clear all data
    setSelectedPlant([]);
    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);
    setAllValues({});
    setSelectCustomerDesc([]);

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
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const getOdiaFrm = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM003/odiafrm";
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
    });
  };

  const getOdiaTo = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM003/odiato";
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
    });
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
        MatNo: allValues.materialNo ? allValues.materialNo : "",
        tdc: allValues.tdc ? allValues.tdc : "",
        thickFrm: thick1 ? thick1 : "",
        thickTo: thick2 ? thick2 : "",
        widthFrm: odia1 ? odia1 : "",
        widthTo: odia2 ? odia2 : "",
        cust: selectCustomerDesc.value ? selectCustomerDesc.value : "",
        // Plant: selectedPlant.value ? selectedPlant.value : "",
      };

      url = "api/LDSM020/getTubePlanData";

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
             
              setTubesData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };
  const getReftesh = () => {
    setLoading(true);
    console.log('LDSM020 1');
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log('LDSM020 2');
      axiosAPI
        .post("api/LDSM020/getRefresh", null, defaultOptions)
        .finally((f) => {
          console.log('LDSM020 3');
          setLoading(false);
        });
    });
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

  const TubePlanColumn = [
   
    {
      title: "Plant",
      field: "EOP_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Id",
      field: "EOP_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item No ",
      field: "EOP_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   // Ensure value is a number before calling toFixed
      //   var numValue = parseFloat(value);
      //   if (!isNaN(numValue)) {
      //     return numValue.toFixed(3);
      //   }
      //   return value; // Return original value if not a valid number
      // },
    },
    {
      title: "Qty",
      field: "EOP_QTY",
      width:100,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "BTR",
      field: "EOP_BTR",
      width:80,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "BTP",
      field: "EOP_BTP",
      width:80,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "BTD",
      field: "EOP_BTD",
      width:80,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "MILL SCH_QTY",
      field: "EOP_MILLSCH_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "FG QTY",
      field: "EOP_FG_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "WIP QTY",
      field: "EOP_WIP_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "DISP QTY",
      field: "EOP_DISP_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Thick",
      field: "EOP_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
    },
    {
      title: "Width",
      field: "EOP_SEC2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
    },
    {
      title: "LENGTH",
      field: "EOP_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Ensure value is a number before calling toFixed
        var numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          return numValue.toFixed(3);
        }
        return value; // Return original value if not a valid number
      },
    },
    {
      title: "TDC",
      field: "ENC_NO_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Type",
      field: "ENC_ORDER_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG MATNR",
      field: "EOP_FG_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG MATNR DESC",
      field: "EOP_FG_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "END CUST Code",
      field: "ENC_CD_END_CUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "CUST NAME",
      field: "ENC_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SHIP_TO_PRTY Code",
      field: "ENC_CD_SHIP_TO_PRTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SHIP_TO_PRTY DESC",
      field: "ENC_SHIP_TO_PRTY_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MARK CUST",
      field: "ENC_MARK_CUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MARK CUST NAME",
      field: "ENC_MARK_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "DT ORD FULFILL",
      field: "ENC_DT_ORD_FULFILL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material SPEC",
      field: "ENC_MATNR_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material IP",
      field: "ENC_MATNR_IP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Surface Finish",
      field: "ENC_SUR_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "END Finish",
      field: "ENC_END_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FIN COND",
      field: "ENC_FIN_COND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Geometry",
      field: "ENC_GEOMETRY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Crt Dt",
      field: "ENC_DT_ORD_CREATE",
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
    var fileName = "LDSM020_Order_Status" + ".xlsx";

    tubesDataTable.download("xlsx", fileName, {
      sheetName: "LDSM020",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);
    // setCustomerDesc([]);
    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);
    setAllValues({});
    setSelectCustomerDesc([]);
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
                          value={selectedPlant}
                          // onChange={({value }) => handlePlantChange(value)}
                          onChange={handlePlantChange}
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
                          Order
                        </MDTypography>

                        <MDInput
                          type="number"
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
                          type="number"
                          name="item"
                          value={allValues.item || ""}
                          onChange={(e) => handleChange(e)}
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
                          Material No.
                        </MDTypography>
                        <MDInput
                          name="materialNo"
                          value={allValues.materialNo || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid> */}
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

                      <Grid item xs={2}>
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
                          Thick From
                        </MDTypography>

                        <MDInput
                          type="number"
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
                          Thick To
                        </MDTypography>

                        <MDInput
                          type="number"
                          name="thikTo"
                          value={allValues.thikTo || ""}
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
                      <Grid item xs={1.25}>
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
                      <Grid item xs={0.75}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                        >
                          Submit
                        </MDButton>
                      </Grid>
                      <Grid item xs={0.75}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={getReftesh}
                          // disabled={isReadWriteAccess}
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
            <LDSM020PlanModal
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
