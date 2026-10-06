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
import "tabulator-tables/dist/css/tabulator_simple.min.css";
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
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";
import moment from "moment";

export default function LDSM024() {
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
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState({});
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const [inventoryData, setInventoryData] = React.useState([]);
  const [inventoryDataTable, setInventoryDataTable] = useState(null);
  const [bUnit, setBunit] = useState([]);

  const [odiaFrmList, setOdiaFrmList] = useState([]);
  const [odiaToList, setOdiaToList] = useState([]);
  const [selectedOdiaFrm, setSelectedOdiaFrm] = useState([]);
  const [selectedOdiaTo, setSelectedOdiaTo] = useState([]);
  const [selectedStockType, setSelectedStockType] = useState([]);

  //const [selectedStockType, setSelectStockType] = React.useState({ label: "RM", value: "1" });

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [getCustomerTable, setCustomerTable] = React.useState([]);

  const [prodFrmDt, setProdFrmDt] = useState(null);
  const [prodToDt, setProdToDt] = useState(null);
  const [despFrmDt, setDespFrmDt] = useState(null);
  const [despToDt, setDespToDt] = useState(null);

  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    batch: "",
    mbatch: "",
    order: "",
    item: "",
    materialNo: "",
    status: "",
    thikFrm: "",
    thikTo: "",
    // widthFrm: "",
    // widthTo: "",
  });

  const [allValuesMerg, setAllValuesMerg] = useState({
    batchMerg: "",
    mergedBatchMerg: "",
  });

  const [allValuesRev, setAllValuesRev] = useState({
    batchId: "",
    mergeBatch: "",
  });

  const [selectedPlantMerg, setSelectedPlantMerg] = useState([]);
  const [selectedMergedTypeMerg, setSelectedMergedTypeMerg] = useState({
    label: "COIL",
    value: "B",
  });
  const [fromDtMerg, setFromDtMerg] = useState(null);
  const [toDtMerg, setToDtMerg] = useState(null);
  const [mergedInvData, setMergedInvData] = useState([]);
  const [mergedInvTableData, setMergedInvTableData] = useState(null);

  const [reversedInfoData, setreversedInfoData] = useState([]);
  const [reversedInfoTableData, setReversedInfoTableData] = useState(null);

  const handleChangeMerg = (e) => {
    if (e.target.name == "batchMerg" && e.target.value?.length > 10) {
      alertify.error("Batch Size can not be greater than 10");
    } else if (
      e.target.name == "mergedBatchMerg" &&
      e.target.value?.length > 10
    ) {
      alertify.error("Merged Batch Size can not be greater than 10");
    } else {
      setAllValuesMerg({ ...allValuesMerg, [e.target.name]: e.target?.value });
    }
  };

  const handleChangeRev = (e) => {
    setAllValuesRev({ ...allValuesRev, [e.target.name]: e.target?.value });
  };

  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const mergedTypeList = [
    { label: "ALL", value: "ALL" },
    { label: "COIL", value: "B" },
    { label: "SFG", value: "S" },
    { label: "FG", value: "F" },
  ];

  const StockType = [
    { label: "RM", value: "RM" },
    { label: "WIP", value: "WIP" },
    { label: "SCRAP", value: "SCRAP" },
    { label: "FG", value: "FG" },
  ];

  //page load
  useEffect(() => {
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
    fetchData();
  }, []);

  useEffect(() => {
    if (inventoryData && inventoryData.length > 0) {
      setInventoryDataTable(
        new Tabulator("#inventoryTable", {
          data: inventoryData,
          columns: selectedProcess?.value == 1 ? inventoryInfoColumn10 : inventoryInfoColumn80,
          height: 400,
          layout: "fitDataFill",
          pagination: "local",
          paginationSize: 10,
          paginationSizeSelector: [10, 20, 40, 60],
        })
      );
    } else {
      setInventoryDataTable(null)
    }
  }, [inventoryData]);

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
      var pageName = "LDSM024";

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

            //page_load plant setup for ground inventory
            setSelectedPlant(items[0]);
            Promise.all([
              getCustDesc(items[0], accessToken),
              getOrdTyp(items[0], accessToken),
              getBusinessCd(items[0], accessToken),
              getOdiaFrm(items[0], accessToken),
              getOdiaTo(items[0], accessToken),
            ]).finally(() => {
              resolve();
            });

            //page_load plant setup for merged inventory
            setSelectedPlantMerg(items[0]);
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

  const getBusinessCd = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/getBUnitCd";
      let data = {
        plant: value?.value,
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

  const getCustDesc = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/GetCustDesc";
      let data = {
        plant: value?.value,
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
        plant: value?.value,
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

  const handlePlantChange = (value) => {
    //clear prefilled data
    setSelectCustomerDesc([]);
    setSelectOrderType([]);
    setAllValues({});
    setProdFrmDt(null);
    setProdToDt(null);
    setDespFrmDt(null);
    setDespToDt(null);

    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);
    setSelectedStockType([]);

    setInventoryDataTable(null);
    setInventoryData([,]);
    //clear filter end

    setSelectedPlant(value);
    //     alert( setSelectedPlant(value));
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getCustDesc(value, token.accessToken),
          getOrdTyp(value, token.accessToken),
          getBusinessCd(value, token.accessToken),
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
        plant: value?.value,
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
        plant: value?.value,
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
    setSelectCustomerDesc(value);
  };

  const handleOrdTypeChange = (value) => {
    setSelectOrderType(value);
  };

  const handlePCatChange = (value) => {
    setSelectPcat(value);
  };

  //get date helper
  const getProdFromDate = () => {
    var dt = document.getElementById("OrddtFrDate")?.value;
    return dt;
  };

  const getProdToDate = () => {
    var dt = document.getElementById("OrddtToDate")?.value;
    return dt;
  };

  const getDespFromDate = () => {
    var dt = document.getElementById("DespFrDate")?.value;
    return dt;
  };

  const getDespToDate = () => {
    var dt = document.getElementById("DespToDate")?.value;
    return dt;
  };

  const getData = () => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then

    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }
    if ((selectedProcess?.value === undefined)) {
      alertify.error("Please select Process");
      return;
    }

    // if (prodToDt === undefined || prodToDt === null || prodFrmDt === undefined || prodFrmDt === null) {
    //   alertify.error("Please select Dates");
    //   return;
    // }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
      var data = {
        plant: selectedPlant?.value,
        orderType: selectedOrderType?.label,
        customer: selectCustomerDesc?.value,
        widthFrm: selectedOdiaFrm?.value ? selectedOdiaFrm.value : "",
        widthTo: selectedOdiaTo?.value ? selectedOdiaTo.value : "",
        process: selectedProcess?.value ?? '',
        ProdFromDate: prodFrmDt
          ? prodFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-")
            .replace("Sept", "Sep")
          : "",
        ProdToDate: prodToDt
          ? prodToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-")
            .replace("Sept", "Sep")
          : "",
        DespFromDate: despFrmDt
          ? despFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-")
            .replace("Sept", "Sep")
          : "",
        DespToDate: despToDt
          ? despToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-")
            .replace("Sept", "Sep")
          : "",
        stockType: selectedStockType?.value ? selectedStockType.value : "",
      };

      data = { ...data, ...allValues };

      if (bUnit.label === "TUBES") {
        url = "api/LDSM024/getInventoryData";
      }

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            // setInventoryData(response.data);
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setInventoryData([,]);
            } else {
              setInventoryData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const handleOdiaFrmChange = (e) => {
    setSelectedOdiaFrm(e);
  };

  const handleOdiaToChange = (e) => {
    setSelectedOdiaTo(e);
  };

  const handleStockTypeChange = (e) => {
    setSelectedStockType(e);
    setInventoryDataTable(null);
    setInventoryData([,]);
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

  const inventoryInfoColumn10 = [

    {
      title: "PLANT",
      field: "TCY_CD_PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true
    },
    {
      title: "CD PROC",
      field: "TCY_CD_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "SO NO",
      field: "TCY_ORDER_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ITEM NO",
      field: "TCY_ITEM_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "CUST NAME",
      field: "TCY_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ORD QNTY",
      field: "TCY_ORD_QNTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material",
      field: "TCY_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "PIPE OD",
      field: "TCY_PIPE_OD_10",
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
      title: "GRADE",
      field: "TCY_GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SPEC",
      field: "TCY_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "THICKNESS",
      field: "TCY_THICKNESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM",
      field: "TCY_RM_ISSUE",
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
      title: "PRIME",
      field: "TCY_PRIME",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "WIP",
    //   field: "TCY_WIP",
    //   headerFilter: "input",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "DOWNGRADE",
    //   field: "TCY_DOWNGRADE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "HOLD",
      field: "TCY_HOLD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "NOT OK",
      field: "TCY_NOT_OK",
      headerFilter: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "SCRAP",
      field: "TCY_SCRAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "YEILD",
      field: "TCY_YEILD",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "DT FROM",
      field: "TCY_REP_DT_FROM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return moment(
            value
          ).format("DD-MMM-YYYY")
        }
        return value;
      },
    },
    {
      title: "DT TO",
      field: "TCY_REP_DT_TO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return moment(
            value
          ).format("DD-MMM-YYYY")
        }
        return value;
      },
    },

    // {
    //   title: "ETO",
    //   field: "TCY_ETO",
    //   headerFilter: "input",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "ETO TILL DT",
    //   field: "TCY_ETO_TILLDT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "PRIME TILL DT",
    //   field: "TCY_PRIME_TILLDT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // }
  ];
  const inventoryInfoColumn80 = [

    {
      title: "PLANT",
      field: "TCY_CD_PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true
    },
    {
      title: "CD PROC",
      field: "TCY_CD_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "SO NO",
      field: "TCY_ORDER_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ITEM NO",
      field: "TCY_ITEM_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "CUST NAME",
      field: "TCY_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ORD QNTY",
      field: "TCY_ORD_QNTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material",
      field: "TCY_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "PIPE OD",
      field: "TCY_PIPE_OD_10",
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
      title: "GRADE",
      field: "TCY_GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SPEC",
      field: "TCY_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "THICKNESS",
      field: "TCY_THICKNESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM",
      field: "TCY_RM_ISSUE",
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
      title: "PRIME",
      field: "TCY_PRIME",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WIP",
      field: "TCY_WIP",
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
      title: "DOWNGRADE",
      field: "TCY_DOWNGRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "HOLD",
    //   field: "TCY_HOLD",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "NOT OK",
    //   field: "TCY_NOT_OK",
    //   headerFilter: "input",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value.toFixed(3);
    //     }
    //     return value;
    //   },
    //   headerFilterPlaceholder: "search...",
    //   hozAlign: "right",
    // },
    {
      title: "SCRAP",
      field: "TCY_SCRAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "YEILD",
      field: "TCY_YEILD",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "DT FROM",
      field: "TCY_REP_DT_FROM",
      headerFilter: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return moment(
            value
          ).format("DD-MMM-YYYY")
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    {
      title: "DT TO",
      field: "TCY_REP_DT_TO",
      headerFilter: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return moment(
            value
          ).format("DD-MMM-YYYY")
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },

    {
      title: "ETO",
      field: "TCY_ETO",
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
      title: "ETO TILL DT",
      field: "TCY_ETO_TILLDT",
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
      title: "PRIME TILL DT",
      field: "TCY_PRIME_TILLDT",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }
  ];

  const handlePlantChangeMerg = (e) => {
    //handle clear all
    setAllValuesMerg({});
    setFromDtMerg(null);
    setToDtMerg(null);
    setSelectedMergedTypeMerg([]);
    setMergedInvData([,]);
    setMergedInvTableData(null);
    //end handle clear all
    setSelectedPlantMerg(e);
  };

  const handleMergedTypeChangeMerg = (e) => {
    setSelectedMergedTypeMerg(e);
  };

  const getMergedInventory = async (newToken = false) => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then

    if (selectedPlantMerg?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }

    var fromDt = fromDtMerg
      ? fromDtMerg
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")
        .replace("Sept", "Sep")
      : "";

    var toDt = toDtMerg
      ? toDtMerg
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-")
        .replace("Sept", "Sep")
      : "";

    if (fromDt > toDt) {
      alertify.error("From Date should be less than To Date");
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
      var data = {
        plant: selectedPlantMerg?.value,
        mergedType: selectedMergedTypeMerg?.value,
        fromDt: fromDt,
        toDt: toDt,
      };

      data = { ...data, ...allValuesMerg };

      // if (bUnit.label === "TUBES") {
      url = "api/LDSM024/mergedinv";
      // }

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setMergedInvData([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];

                rows.push({
                  rowId: i,
                  FG_MATERIAL_DESC: rowdata.FG_MATERIAL_DESC,
                  FG_MATERIAL_NO: rowdata.FG_MATERIAL_NO,
                  MERGED_BATCH: rowdata.MERGED_BATCH,
                  MERGED_BATCH_QTY: rowdata.MERGED_BATCH_QTY,
                  MERGED_BY_USER: rowdata.MERGED_BY_USER,
                  MERGE_DT: rowdata.MERGE_DT,
                  PLANT: rowdata.PLANT,
                  SLIT_COIL: rowdata.SLIT_COIL,
                  SLIT_COIL_QTY: rowdata.SLIT_COIL_QTY,
                  MERGED_TYPE: rowdata.MERGED_TYPE,
                });
              }
              setMergedInvData(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getReversedBatchInformation = async () => {
    if (selectedPlantMerg?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }

    // if (allValuesRev?.batchId == "" || allValuesRev?.mergeBatch == "") {
    //   alertify.error("Please select batch Or Mother Batch");
    //   return;
    // }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        plant: selectedPlantMerg?.value,
        batchId: allValuesRev.batchId,
        mergeBatch: allValuesRev.mergeBatch,
      };

      var url = "api/LDSM024/getReversedBatchInfo";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setreversedInfoData([,]);
            } else {
              setreversedInfoData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const downloadExcelcustomerTableData = () => {
    // var table = customerTable.table;
    // let date = new Date();
    // table.download(
    //     "xlsx",
    //     "customerTable" + date.toString() + ".xlsx",
    //     { sheetName: "MyData" }
    // );

    if (inventoryDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = inventoryDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "LDSM024_Yield_Report " + ".xlsx";
    inventoryDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelMergedInv = () => {
    if (mergedInvTableData == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = mergedInvTableData.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "LDSM024_MergedInventory " + date.toString() + ".xlsx";
    mergedInvTableData.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelReversedInfo = () => {
    if (reversedInfoTableData == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = reversedInfoTableData.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "LDSM024_ReversedInfo " + date.toString() + ".xlsx";
    reversedInfoTableData.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = () => {
    setSelectCustomerDesc([]);
    setSelectedPlant([]);
    setSelectOrderType([]);
    setAllValues({});
    setProdFrmDt(null);
    setProdToDt(null);
    setDespFrmDt(null);
    setDespToDt(null);

    setSelectedOdiaFrm([]);
    setSelectedOdiaTo([]);

    setInventoryDataTable(null);
    setInventoryData([,]);
  };

  const handleClearAllMerg = () => {
    setSelectedPlantMerg([]);
    setAllValuesMerg({});
    setFromDtMerg(null);
    setToDtMerg(null);
    setSelectedMergedTypeMerg([]);
    setMergedInvData([,]);
    setMergedInvTableData(null);
  };

  const handleClearAllRev = () => {
    setreversedInfoData([,]);
    setReversedInfoTableData(null);
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
                  {/* <MDBox
                                          mx={2}
                                          mt={-3}
                                          py={1}
                                          px={2}
                                          variant="gradient"
                                          bgColor="info"
                                          borderRadius="lg"
                                          coloredShadow="info"
                                      >
                                          <MDTypography variant="h6" color="white">
                                         Filters
                                          </MDTypography>
                                      </MDBox> */}
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
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
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
                    <Grid container spacing={1.5}>
                      <Grid item xs={3}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"red"}
                          noWrap
                        >
                          {" "}
                          Plant <span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          value={selectedPlant}
                          onChange={handlePlantChange}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"red"}
                          noWrap
                        >
                          {" "}
                          Process <span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <ReactSelect
                          id="Process"
                          options={[{
                            value: 1,
                            label: 1
                          }, {
                            value: 8,
                            label: 8
                          }]}
                          value={selectedProcess}
                          onChange={(val) => { setInventoryData([]); setSelectedProcess(val) }}
                        />
                      </Grid>

                      {/* <Grid item xs={1.5}>
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
                        <ReactSelect
                          id="plant"
                          options={ordType}
                          value={selectedOrderType}
                          onChange={handleOrdTypeChange}
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
                          Material No.
                        </MDTypography>
                        <MDInput
                          label=""
                          name="materialNo"
                          value={allValues.materialNo || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid> */}
                      {/* <Grid item xs={1}>
                                              <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                            TDC
                          </MDTypography>
                                                  <MDInput label="" name="tdc" value={allValues.tdc || ''} onChange={(e) => handleChange(e)} />
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
                          Status
                        </MDTypography>
                        <MDInput
                          label=""
                          textTransform="uppercase"
                          name="status"
                          value={allValues.status || ""}
                          onChange={(e) => handleChange(e)}
                          onInput={toInputUppercase} // apply on input which do you want to be capitalize
                          // onChange={(e) => e.target.value = ("" + e.target.value).toUpperCase() => handleChange(e)}
                        />
                      </Grid> */}
                      {/* <Grid item xs={1}>
                                              <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                            FG Age
                          </MDTypography>
                                                  <MDInput label="" name="fgAge" type="number" value={allValues.fgAge || ''} onChange={(e) => handleChange(e)} />
                                              </Grid> */}
                      {/* <Grid item xs={1}>
                                              <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                            M Age
                          </MDTypography>
                                                  <MDInput label="" name="mAge" type="number" value={allValues.mAge || ''} onChange={(e) => handleChange(e)} />
                                              </Grid> */}
                      {/* <Grid item xs={2}>
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
                      {/*                                           
                                              <Grid item xs={1}>
                                              <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                            Track No.
                          </MDTypography>
  
                                                  <MDInput label="" name="trackNo" type="number" value={allValues.trackNo || ''} onChange={(e) => handleChange(e)} />
                                              </Grid> */}
                      {/* <Grid item xs={1}>
                                              <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                            Prod Cd
                          </MDTypography>
  
                                                  <MDInput label="" name="prodCD" value={allValues.prodCD || ''} onChange={(e) => handleChange(e)} />
                                              </Grid> */}
                      {/* <Grid item xs={1}>
                                              <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                            Qlty Cd.
                          </MDTypography>
                                                  <MDInput label="" name="qultyCd" value={allValues.qultyCd || ''} onChange={(e) => handleChange(e)} />
                                              </Grid> */}
                      <Grid item xs={1.2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          From Date<span style={{ color: "red" }}>*</span>
                        </MDTypography>

                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        ></MDTypography>

                        <MonthPicker
                          id="OrddtFrDate"
                          value={prodFrmDt}
                          onChange={(date) => setProdFrmDt(date)}
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
                          To Date<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        ></MDTypography>
                        <MonthPicker
                          id="OrddtToDate"
                          value={prodToDt}
                          onChange={(date) => setProdToDt(date)}
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
                          Thickness From
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="thikFrm"
                          value={allValues.thikFrm || ""}
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
                          Thickness To
                        </MDTypography>

                        <MDInput
                          type="number"
                          name="thikTo"
                          value={allValues.thikTo || ""}
                          onChange={(e) => handleChange(e)}
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
                          Odia From
                        </MDTypography>

                        
                        <ReactSelect
                          id="odiafrm"
                          options={odiaFrmList}
                          value={selectedOdiaFrm}
                          onChange={handleOdiaFrmChange}
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
                          Odia To
                        </MDTypography>

                        
                        <ReactSelect
                          id="odiato"
                          options={odiaToList}
                          value={selectedOdiaTo}
                          onChange={handleOdiaToChange}
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
                          Stock Type
                        </MDTypography>
                        <ReactSelect
                          id="stockType"
                          options={StockType}
                          value={selectedStockType}
                          onChange={handleStockTypeChange}
                        />
                      </Grid> */}
                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
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
                          Yield Data
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
                        {inventoryData.length > 0 && <div id="inventoryTable" />}
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
                          Showing 1 to {inventoryData.length} of{" "}
                          {inventoryData.length} entries
                        </p>
                      </Grid>
                      {/* <Grid container spacing={3}>
                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#04FF00",
                                "&:hover": {
                                  backgroundColor: "#70FF6E",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{" 0 to 30 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>

                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#FFFF00",
                                "&:hover": {
                                  backgroundColor: "#FFFF63",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{" 31 to 60 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>
                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#FFA500",
                                "&:hover": {
                                  backgroundColor: "#FFA500",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{" 61 to 90 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>
                        <Grid item xs={1.2}>
                          <Box display="flex">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                backgroundColor: "#FF0000",
                                "&:hover": {
                                  backgroundColor: "#FA4949",
                                  opacity: [0.9, 0.8, 0.7],
                                },
                              }}
                            />
                            <MDTypography fontSize={15}>
                              &nbsp;{"> 90 Days"}
                            </MDTypography>
                          </Box>
                        </Grid>
                      </Grid> */}
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
