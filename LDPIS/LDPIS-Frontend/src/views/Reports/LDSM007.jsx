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
import MultipleSelect from "../../components/Select/MultiSelect";
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
import { getStepButtonUtilityClass } from "@mui/material";
import { GetAuthorization } from "utils";

export default function LDSM007() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [ordType, setOrdType] = useState([]);
  const [odiaFromValue, setOdiaFromValue] = useState([]);
  const [odiaToValue, setOdiaToValue] = useState([]);
  const [thickValue, setThickValue] = useState({
    from: [],
    to: [],
  });
  const [lengthValue, setLengthValue] = useState({
    from: [],
    to: [],
  });
  const [thickData, setThickData] = useState([]);
  const [odiaData, setOdiaData] = useState([]);
  const [lengthData, setLengthData] = useState([]);
  const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [customerDesc, setCustomerDesc] = useState([]);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [bUnit, setBunit] = React.useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [getCustomerTable, setCustomerTable] = React.useState([]);
  const [selectedCustomerTable, setSelectedCustomerTable] = useState(null);
  const [sourcePlantFetched, setSourcePlantFetched] = useState(false);
  //const [slitPlan, setSlitPlan] = useState([]);
  const [selectedSlitPlan, setSelectedSlitPlan] = React.useState([]);

  const slitPlanList = [
    { label: "TUBES", value: "TUBES" },
    { label: "SLIT", value: "SLIT" },
  ];

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
    widthFrm: "",
    widthTo: "",
    tdc: "",
    OrddtFrDt: "",
    OrddtTmDt: "",
    DispFrDt: "",
    DispToDt: "",
  });

  const handleChange = (e) => {
    if (getCustomerTable?.length > 0) {
      setCustomerTable([]);
    }
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const handleNameChange = (val, name) => {
    if (getCustomerTable?.length > 0) {
      setCustomerTable([]);
    }
    const varVal = { ...allValues };
    varVal[name] = val;

    setAllValues(varVal);
  };

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

  //validate user
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
      var pageName = "LDSM007";

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

  //screen auth
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

  // use effect to set table data
  useEffect(() => {
    setSelectedCustomerTable(
      new Tabulator("#selCustomerTable", {
        pagination: "local", //enable local pagination.
        paginationSize: 12,
        data: getCustomerTable,
        columns: customerOrderColumn,
      })
    );
  }, [getCustomerTable]);

  //get group plant code
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
              getBusinessCd(items[0], accessToken),
              getOdia(items[0], accessToken),
              getCustDesc(items[0], accessToken),
              getOrdTyp(items[0], accessToken),
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

  const clearFilter = () => {
    if (getCustomerTable?.length > 0) {
      setCustomerTable([]);
    }
    setOdiaFromValue([]);
    setOdiaToValue([]);
    setSelectOrderType([]);
    setSelectedPlant([]);
    setSelectCustomerDesc([]);
    setOdiaData([]);
    setLengthData([]);
    setThickData([]);
    setCustomerDesc([]);
    setOrdType([]);
    setSelectedSlitPlan([]);
    setAllValues({
      order: "",
      item: "",
      materialNo: "",
      trackNo: "",
      prodCD: "",
      qultyCd: "",
      thikFrm: "",
      thikTo: "",
      widthFrm: "",
      widthTo: "",
      tdc: "",
      OrddtFrDt: "",
      OrddtTmDt: "",
      DispFrDt: "",
      DispToDt: "",
    });
    setThickValue({
      from: [],
      to: [],
    });
    setLengthValue({
      from: [],
      to: [],
    });
    setState({
      checkedA: true,
    });
  };

  // get customer description
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

  const getOdia = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/odiaList";
      let data = {
        plant: value.value,
      };
      Promise.all([
        axiosAPI.post("api/LDSM007/odiaList", data, defaultOptions),
        axiosAPI.post("api/LDSM007/lengthList", data, defaultOptions),
        axiosAPI.post("api/LDSM007/thickList", data, defaultOptions),
      ])
        .then(([odiaListData, lengthListData, thickListData]) => {
          if (
            odiaListData?.statusText != "" &&
            odiaListData?.statusText != "OK"
          ) {
            //reject(odiaListData?.statusText);
          } else if (odiaListData?.data?.length) {
            let varData = [];
            odiaListData?.data?.map((x) => varData.push(x.toFixed(2)));
            setOdiaData(varData);
          }

          if (
            lengthListData?.statusText != "" &&
            lengthListData?.statusText != "OK"
          ) {
            //reject(lengthListData?.statusText);
          } else if (lengthListData?.data?.length) {
            let varData = [];
            lengthListData?.data?.map((x) => varData.push(x.toFixed(2)));
            setLengthData(varData);
          }

          if (
            thickListData?.statusText != "" &&
            thickListData?.statusText != "OK"
          ) {
            //reject(thickListData?.statusText);
          } else if (thickListData?.data?.length) {
            let varData = [];
            thickListData?.data?.map((x) => varData.push(x.toFixed(2)));
            setThickData(varData);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  //get order type
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

  //get product category
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

  //plant change handler
  const handlePlantChange = (value) => {
    clearFilter();
    setCustomerTable([]);
    setSelectedPlant(value);
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getCustDesc(value, token.accessToken),
          getOrdTyp(value, token.accessToken),
          getBusinessCd(value, token.accessToken),
          getOdia(value, token.accessToken),
        ]).then(() => {
          setLoading(false);
        });
      });
    }
  };

  // get business code
  const getBusinessCd = (value, accessToken) => {
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

  //handle order type change
  const handleSlitPlanChange = (value) => {
    if (getCustomerTable?.length > 0) {
      setCustomerTable([]);
    }
    setSelectedSlitPlan(value);
  };

  // handle customer change
  const handleCustomerChange = (value) => {
    if (getCustomerTable?.length > 0) {
      setCustomerTable([]);
    }
    setSelectCustomerDesc(value);
  };

  //handle order type change
  const handleOrdTypeChange = (value) => {
    if (getCustomerTable?.length > 0) {
      setCustomerTable([]);
    }
    setSelectOrderType(value);
  };

  //get table data(customer order information)
  const getData = () => {
    if (
      odiaFromValue?.length > 0 &&
      odiaToValue.length > 0 &&
      (odiaFromValue?.length <= 1 || odiaToValue?.length <= 1)
    ) {
      if (
        (odiaFromValue.length > 0 ? Number(odiaFromValue[0]) : 0) >
        (odiaToValue.length > 0 ? Number(odiaToValue[0]) : 0)
      ) {
        alertify.error("Please Select the Odia Properly!");
        return;
      }
    }
    if (
      lengthValue?.from?.length > 0 &&
      lengthValue?.to?.length > 0 &&
      (lengthValue?.from?.length <= 1 || lengthValue?.to?.length <= 1)
    ) {
      if (
        (lengthValue?.from.length > 0 ? Number(lengthValue?.from[0]) : 0) >
        (lengthValue?.to?.length > 0 ? Number(lengthValue?.to[0]) : 0)
      ) {
        alertify.error("Please Select the Length Properly!");
        return;
      }
    }

    if (
      thickValue?.from?.length > 0 &&
      thickValue?.to?.length > 0 &&
      (thickValue?.from?.length <= 1 || thickValue?.to?.length <= 1)
    ) {
      if (
        (thickValue?.from.length > 0 ? Number(thickValue?.from[0]) : 0) >
        (thickValue?.to?.length > 0 ? Number(thickValue?.to[0]) : 0)
      ) {
        alertify.error("Please Select the Thick Properly!");
        return;
      }
    }

    if (selectedPlant?.value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };

        var url;
        
        var data = {
          Plant: selectedPlant?.value,
          Order1: allValues?.order,
          Item: allValues?.item,
          MatNo: allValues?.materialNo,
          Customer: selectCustomerDesc?.value ? selectCustomerDesc.value : "",
          OrdStAs: state.checkedA ? "A" : "C",
          OrdTyp: selectedOrderType?.label ? selectedOrderType.label : "",
          OrddtFr: allValues.OrddtFrDt,
          OrddtTm: allValues.OrddtTmDt,
          DispFr: allValues.DispFrDt,
          DispTo: allValues.DispToDt,
          ThickFr: thickValue.from.length > 1 ? [] : thickValue.from,
          ThickTo: thickValue.to.length > 1 ? [] : thickValue.to,
          WidthFr: odiaToValue.length > 1 ? [] : odiaFromValue,
          WidthTo: odiaFromValue.length > 1 ? [] : odiaToValue,
          LengthFrm: lengthValue.from.length > 1 ? [] : lengthValue.from,
          LengthTo: lengthValue.to.length > 1 ? [] : lengthValue.to,
          SlitPlan: selectedSlitPlan?.value ? selectedSlitPlan.value : "",
        };

        if (bUnit.label == "TUBES" || bUnit.label == "LP") {
          url = "api/LDSM007/GetOrderDT_Tubes";
        } else {
          url = "api/LDSM007/GetOrderDT";
        }
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              if (response.data[1].length > 0) {
                setCustomerTable(response.data[1]);
                setSourcePlantFetched(true);
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
      alertify.error("Please Select Plant!");
    }
  };

  // handle change switch
  const handleChangeSwitch = (event) => {
    if (getCustomerTable?.length > 0) {
      setCustomerTable([]);
    }
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  //table options
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

  //table column
  const customerOrderColumn = [
    // { "title": "DRAFT MASS", "field": "DRAFTMASS", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Order Id",
      field: "ORDERID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          const d = new Date();
          // const formattedDate = date.toLocaleDateString('en-GB', {
          //     day: 'numeric', month: 'short', year: 'numeric'
          // }).replace(/ /g, '-');
          var formattedDate =
            ("0" + d.getDate()).slice(-2) +
            "-" +
            d.toString().substr(4, 3) +
            "-" +
            d.getFullYear();

          const days =
            (new Date(formattedDate) -
              new Date(cell._cell.row.data.DELIVERYDATE)) /
            (1000 * 60 * 60 * 24);

          // .....Color is not required as of now. If required then please use below code...

          // if (days < 15) {
          //     cell.getElement().style["background-color"] = "#80FF00";
          // }
          // if (days > 15 && days <= 25) {
          //     cell.getElement().style["background-color"] = "#ff5722";
          //     cell.getElement().style["color"] = "#FFFFFF";
          // }
          // if (days > 25 && days <= 30) {
          //     cell.getElement().style["background-color"] = "#b2102f";
          //     cell.getElement().style["color"] = "#FFFFFF";
          // }
          // if (days > 30) {
          //     cell.getElement().style["background-color"] = "#212121";
          //     cell.getElement().style["color"] = "#FFFFFF";
          // }
        }
        return value;
      },
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Ordtype",
      field: "ORDTYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "OrdDescription",
      field: "DESCRIPTION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      bottomCalc: () => "Total (All Page Total)",
    },
    {
      title: "Order Qnt(Ton)",
      field: "ORD_TONN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: (cell, formatterParams) => {
        return Number(cell.getValue()).toFixed(3);
      },
    },
    {
      title: "Dispatchable",
      field: "DISPATCHABLE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: (cell, formatterParams) => {
        return Number(cell.getValue()).toFixed(3);
      },
    },
    {
      title: "Dispatched",
      field: "DISPATCHED",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: (cell, formatterParams) => {
        return Number(cell.getValue()).toFixed(3);
      },
    },
    {
      title: "Customer Code",
      field: "CUSTOMER_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "CUSTOMER_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Matnr",
      field: "MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Matnrdesc",
      field: "MATNRDESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    // {
    //   title: "Width",
    //   field: "WIDTH",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: "money",
    // },
    {
      title: "Idia",
      field: "ENC_IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia/Width",
      field: "ENC_ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Length",
      field: "ORDLENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "FGPLANGRADE", "field": "FGPLANGRADE", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "QLTYCD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TDC",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ORD CRT DT",
      field: "ORD_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Delivery Date",
      field: "DELIVERYDATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "DISPATCHWEEK", "field": "DISPATCHWEEK", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "ORD_REL_DT", "field": "ORD_REL_DT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "TRACKINGNO", "field": "TRACKINGNO", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "ShipToPartyId",
      field: "SHIPTOPARTYID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ShipToPartyDesc",
      field: "ENC_SHIP_TO_PRTY_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "MinWt", "field": "MINWT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "MaxWt", "field": "MAXWT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "AimWt", "field": "AIMWT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Road Dest",
      field: "ENC_ROAD_DEST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rail Dest",
      field: "ENC_RAIL_DEST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "ExtraToOrder", "field": "EXTRATOORDER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Mark Cust",
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
    // { "title": "ORDERCLOSEDT", "field": "ORDERCLOSEDT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "ORDERDWNLDDT", "field": "ORDERDWNLDDT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "VENDORPANEL", "field": "VENDORPANEL", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "ORDERAGE", "field": "ORDERAGE", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "MINTHICK", "field": "MINTHICK", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "MAXTHICK", "field": "MAXTHICK", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "ACTTHICK", "field": "ACTTHICK", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "MINWIDTH", "field": "MINWIDTH", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "MAXWIDTH", "field": "MAXWIDTH", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "ACTWIDTH", "field": "ACTWIDTH", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "MINLENGTH", "field": "MINLENGTH", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "MAXLENGTH", "field": "MAXLENGTH", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "ACTLENGTH", "field": "ACTLENGTH", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" },
    // { "title": "ORDERCOLOR", "field": "ORDERCOLOR", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "BUFFERSIZE", "field": "BUFFERSIZE", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "INVENTORYVALUE", "field": "INVENTORYVALUE", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Ord Status",
      field: "ORD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Slit Plan",
      field: "ENC_SLIT_PLAN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Min Thick",
      field: "MINTHICK",
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
      field: "MAXTHICK",
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
      field: "MINWIDTH",
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
      field: "MAXWIDTH",
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
      title: "Min Length",
      field: "MINLENGTH",
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
      title: "Max Length",
      field: "MAXLENGTH",
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
      title: "Spec",
      field: "SPEC",
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
      title: "Surface Finish",
      field: "SUR_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "End Finish",
      field: "END_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
   
  ];

  //download data to excel
  const downloadExcelcustomerTableData = () => {
    var date = new Date();
    var fileName = "CustomerOrderInformation " + ".xlsx";
    selectedCustomerTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Reports" page="Tube Order book" />
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
                      <Grid item xs={0.9}>
                        <Tooltip title="Clear" arrow>
                          <IconButton color="white" onClick={clearFilter}>
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={2.25} py={2.25}>
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
                          value={allValues.order || ""}
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
                          Item{" "}
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="item"
                          value={allValues.item || ""}
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
                          Material No.{" "}
                        </MDTypography>
                        <MDInput
                          type="number"
                          name="materialNo"
                          value={allValues.materialNo || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ zIndex: 4 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Slit Plan{" "}
                        </MDTypography>
                        <ReactSelect
                          id="slitPlan"
                          options={slitPlanList}
                          onChange={handleSlitPlanChange}
                          value={selectedSlitPlan}
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
                          {" "}
                          Customer{" "}
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={customerDesc}
                          onChange={handleCustomerChange}
                          value={selectCustomerDesc}
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
                          Ord Status{" "}
                        </MDTypography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography>Active</Typography>

                          <Switch
                            color="info"
                            checked={state.checkedA}
                            onChange={handleChangeSwitch}
                            name="checkedA"
                            //inputProps={{ "aria-label": "secondary checkbox" }}
                          />
                          <Typography>Close</Typography>
                        </Stack>
                      </Grid>
                    </Grid>

                    <Grid container spacing={1}>
                      <Grid item xs={1.5} style={{ zIndex: 4 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Ord Typ{" "}
                        </MDTypography>
                        <ReactSelect
                          id="ordTyp"
                          options={ordType}
                          onChange={handleOrdTypeChange}
                          value={selectedOrderType}
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
                          Order Date From{" "}
                        </MDTypography>
                        <DatePicker
                          id="OrddtFrDate"
                          value={allValues.OrddtFrDt}
                          onChange={(date) =>
                            handleNameChange(date, "OrddtFrDt")
                          }
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
                          Order Date To{" "}
                        </MDTypography>
                        <DatePicker
                          id="OrddtTmDate"
                          value={allValues.OrddtTmDt}
                          onChange={(date) =>
                            handleNameChange(date, "OrddtTmDt")
                          }
                        />
                      </Grid>

                      {/* <Grid item xs={1.25}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Despatch Date From </MDTypography>
                                                <DatePicker id="DispFrDate" value={allValues.DispFrDt} onChange={(date) => handleNameChange(date, 'DispFrDt')} />
                                            </Grid>
                                            <Grid item xs={1.25}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Despatch Date To </MDTypography>
                                                <DatePicker id="DispToDate" value={allValues.DispToDt} onChange={(date) => handleNameChange(date, 'DispToDt')} />
                                            </Grid> */}

                      {lengthValue?.to?.length <= 1 ? (
                        <Grid item xs={lengthValue?.from?.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Length From{" "}
                          </MDTypography>
                          {/* <MDInput type="number" name="thikFrm" value={allValues.thikFrm || ''} onChange={(e) => handleChange(e)} /> */}
                          <MultipleSelect
                            value={lengthValue.from}
                            setValue={(val) => {
                              if (getCustomerTable?.length > 0) {
                                setCustomerTable([]);
                              }
                              setLengthValue({ ...lengthValue, from: val });
                            }}
                            data={lengthData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}
                      {lengthValue?.from?.length <= 1 ? (
                        <Grid item xs={lengthValue?.to?.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Length To{" "}
                          </MDTypography>
                          {/* <MDInput type="number" name="thikTo" value={allValues.thikTo || ''} onChange={(e) => handleChange(e)} /> */}
                          <MultipleSelect
                            value={lengthValue.to}
                            setValue={(val) => {
                              if (getCustomerTable?.length > 0) {
                                setCustomerTable([]);
                              }
                              setLengthValue({ ...lengthValue, to: val });
                            }}
                            data={lengthData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}
                      {thickValue?.to?.length <= 1 ? (
                        <Grid item xs={thickValue?.from?.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Thick From{" "}
                          </MDTypography>
                          {/* <MDInput type="number" name="thikFrm" value={allValues.thikFrm || ''} onChange={(e) => handleChange(e)} /> */}
                          <MultipleSelect
                            value={thickValue.from}
                            setValue={(val) => {
                              if (getCustomerTable?.length > 0) {
                                setCustomerTable([]);
                              }
                              setThickValue({ ...thickValue, from: val });
                            }}
                            data={thickData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}
                      {thickValue?.from?.length <= 1 ? (
                        <Grid item xs={thickValue?.to?.length > 1 ? 2 : 1}>
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
                          {/* <MDInput type="number" name="thikTo" value={allValues.thikTo || ''} onChange={(e) => handleChange(e)} /> */}
                          <MultipleSelect
                            value={thickValue?.to}
                            setValue={(val) => {
                              if (getCustomerTable?.length > 0) {
                                setCustomerTable([]);
                              }
                              setThickValue({ ...thickValue, to: val });
                            }}
                            data={thickData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}

                      {odiaToValue.length <= 1 ? (
                        <Grid item xs={odiaFromValue.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Odia/Width From{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={odiaFromValue}
                            setValue={(val) => {
                              {
                                if (getCustomerTable?.length > 0) {
                                  setCustomerTable([]);
                                }
                                setOdiaFromValue(val);
                              }
                            }}
                            data={odiaData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}

                      {odiaFromValue.length <= 1 ? (
                        <Grid item xs={odiaToValue.length > 1 ? 2 : 1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Odia/Width To{" "}
                          </MDTypography>
                          <MultipleSelect
                            value={odiaToValue}
                            setValue={(val) => {
                              {
                                if (getCustomerTable?.length > 0) {
                                  setCustomerTable([]);
                                }
                                setOdiaToValue(val);
                              }
                            }}
                            data={odiaData}
                            placeholder={"--Select--"}
                          />
                        </Grid>
                      ) : null}

                      <Grid item xs={1}>
                        {" "}
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                        >
                          {" "}
                          Submit{" "}
                        </MDButton>{" "}
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
                          Customer Order Information
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download" arrow>
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
                        <div id="selCustomerTable" />
                        <br />
                        {/* <p color="black" style={{
                                                    color: "black", paddingLeft: "1rem", marginTop: "-1rem"
                                                }}>Showing 1 to {getCustomerTable.length} of {getCustomerTable.length} entries</p> */}
                        {/* <br/> */}
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item xs={1}>
                        <Box display="flex">
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#80FF00",
                              "&:hover": {
                                backgroundColor: "success.main",
                                opacity: [0.9, 0.8, 0.7],
                              },
                            }}
                          />
                          <MDTypography fontSize={15}>
                            {" < 15 Days"}
                          </MDTypography>
                        </Box>
                      </Grid>

                      <Grid item xs={1.2}>
                        <Box display="flex">
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#ff5722",
                              "&:hover": {
                                backgroundColor: "#ff5722",
                                opacity: [0.9, 0.8, 0.7],
                              },
                            }}
                          />
                          <MDTypography fontSize={15}>
                            {"< 16 to 25 Days"}
                          </MDTypography>
                        </Box>
                      </Grid>
                      <Grid item xs={1.2}>
                        <Box display="flex">
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#b2102f",
                              "&:hover": {
                                backgroundColor: "#b2102f",
                                opacity: [0.9, 0.8, 0.7],
                              },
                            }}
                          />
                          <MDTypography fontSize={15}>
                            {"< 26 to 30 Days"}
                          </MDTypography>
                        </Box>
                      </Grid>
                      <Grid item xs={1}>
                        <Box display="flex">
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              backgroundColor: "#212121",
                              "&:hover": {
                                backgroundColor: "#212121",
                                opacity: [0.9, 0.8, 0.7],
                              },
                            }}
                          />
                          <MDTypography fontSize={15}>
                            {"> 30 Days"}
                          </MDTypography>
                        </Box>
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
