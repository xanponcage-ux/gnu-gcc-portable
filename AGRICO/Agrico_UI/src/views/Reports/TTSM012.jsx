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

export default function TTSM012() {
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
    process: "",
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
    if (tabValue == 0) {
      if (inventoryData && inventoryData.length > 0) {
        setInventoryDataTable(
          new Tabulator("#inventoryTable", {
            //   pagination: "local", //enable local pagination.
            data: inventoryData,
            columns: inventoryInfoColumn,
            maxHeight: 400,
            layout: "fitDataFill",
          })
        );
      }
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
      var pageName = "TTSM012";

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

      var url = "api/ttsm007/getBUnitCd";
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

      var url = "api/ttsm007/GetCustDesc";
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

      var url = "api/ttsm007/GetOrdTyp";
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

      var url = "api/ttsm007/GetProdCat";
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

      var url = "api/ttsm003/odiafrm";
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

      var url = "api/ttsm003/odiato";
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
        // ProdFromDate : getProdFromDate(),
        // ProdToDate : getProdToDate(),
        // DespFromDate : getDespFromDate(),
        // DespToDate : getDespToDate()

        ProdFromDate: prodFrmDt
          ? prodFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        ProdToDate: prodToDt
          ? prodToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        DespFromDate: despFrmDt
          ? despFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        DespToDate: despToDt
          ? despToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        stockType: selectedStockType?.value ? selectedStockType.value : "",
      };

      data = { ...data, ...allValues };

      if (bUnit.label === "TUBES") {
        url = "api/ttsm012/getInventoryData";
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
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];

                rows.push({
                  CREATION_DATE: rowdata.CREATION_DATE,
                  PLANT: rowdata.PLANT,
                  STORAGE_LOC: rowdata.STORAGE_LOC,
                  CURRENT_WORK_CENTER: rowdata.CURRENT_WORK_CENTER,
                  PLANNED_WORK_CENTER: rowdata.PLANNED_WORK_CENTER,
                  NEXT_WORK_CENTER: rowdata.NEXT_WORK_CENTER,
                  PLANNED_CUST_NAME: rowdata.PLANNED_CUST_NAME,
                  RECVPLANT: rowdata.RECVPLANT,
                  BATCH_ID: rowdata.BATCH_ID,
                  THICK: rowdata.THICK,
                  WIDTH: rowdata.WIDTH,
                  IDIA: rowdata.IDIA,
                  LENGTH: rowdata.LENGTH,
                  NET_WT: rowdata.NET_WT,
                  CUST_ORDER: rowdata.CUST_ORDER,
                  CUST_ITEM: rowdata.CUST_ITEM,
                  ENC_ORDER_TYPE: rowdata.ENC_ORDER_TYPE,
                  ROLLING_LENGTH: rowdata.ROLLING_LENGTH,
                  NA: rowdata.NA,
                  SO_THICK: rowdata.SO_THICK,
                  SO_ODIA: rowdata.SO_ODIA,
                  SO_IDIA: rowdata.SO_IDIA,
                  SO_LENGTH: rowdata.SO_LENGTH,
                  SO_OD_TOL: rowdata.SO_OD_TOL,
                  SO_THICK_TOL: rowdata.SO_THICK_TOL,
                  SO_LENGTH_TOL: rowdata.SO_LENGTH_TOL,
                  SO_GRADE: rowdata.SO_GRADE,
                  ACTUAL_TDC: rowdata.ACTUAL_TDC,
                  PROD_CD: rowdata.PROD_CD,
                  QLTY: rowdata.QLTY,
                  PLANNED_ROUTE: rowdata.PLANNED_ROUTE,
                  SURFASE_SIZE: rowdata.SURFASE_SIZE,
                  SO_FINISH: rowdata.SO_FINISH,
                  FG_MATERIAL_NO: rowdata.FG_MATERIAL_NO,
                  FG_MATERIAL_DESC: rowdata.FG_MATERIAL_DESC,
                  PLANNED_STAGE_REMARK: rowdata.PLANNED_STAGE_REMARK,
                  PLANNED_HEADER_REMARK: rowdata.PLANNED_HEADER_REMARK,
                  UNRESTRICTED_STOCK: rowdata.UNRESTRICTED_STOCK,
                  GROSS_WT: rowdata.GROSS_WT,
                  MATERIAL_DESC: rowdata.MATERIAL_DESC,
                  STOCK_IN_QINSP: rowdata.STOCK_IN_QINSP,
                  BLOCKED_STOCK: rowdata.BLOCKED_STOCK,
                  BATCH_AGE: rowdata.BATCH_AGE,
                  STOCK_IN_TRANSIT: rowdata.STOCK_IN_TRANSIT,
                  MATERIAL_GROUP: rowdata.MATERIAL_GROUP,
                  MATERIAL_TYPE: rowdata.MATERIAL_TYPE,
                  SOURCE: rowdata.SOURCE,
                  CAST_NO: rowdata.CAST_NO,
                  DIVISON: rowdata.DIVISON,
                  HSN_CODE: rowdata.HSN_CODE,
                  PLAN_QUANTITY: rowdata.PLAN_QUANTITY,
                  NO_OF_PIECES: rowdata.NO_OF_PIECES,
                  PHYSICAL_LOC: rowdata.PHYSICAL_LOC,
                  UOM: rowdata.UOM,
                  PREV_PROC: rowdata.PREV_PROC,
                  CURR_PROC: rowdata.CURR_PROC,
                  NEXT_PROC: rowdata.NEXT_PROC,
                  STATUS: rowdata.STATUS,
                  PARENT_BATCH: rowdata.PARENT_BATCH,
                  MOTHER_BATCH: rowdata.MOTHER_BATCH,
                  MOTHER_BATCH_AGE: rowdata.MOTHER_BATCH_AGE,
                  MOTHER_BATCH_WT: rowdata.MOTHER_BATCH_WT,
                  RM_MATRL_NO: rowdata.RM_MATRL_NO,
                  RM_MATERIAL_DESC: rowdata.RM_MATERIAL_DESC,
                  ACTUAL_ROUTE: rowdata.ACTUAL_ROUTE,
                  PLANT_NM: rowdata.PLANT_NM,
                  SCRAP_WT: rowdata.SCRAP_WT,
                  MERGED_BATCH: rowdata.MERGED_BATCH,
                  PROD_STRT_TM: rowdata.PROD_STRT_TM,
                  PROD_END_TM: rowdata.PROD_END_TM,
                  PROCESSING_FLAG: rowdata.PROCESSING_FLAG,
                  EOM_OPER_COMMENT: rowdata.EOM_OPER_COMMENT,
                  STATUS_DESC: rowdata.STATUS_DESC,
                  EOM_SCRAP_REMARKS: rowdata.EOM_SCRAP_REMARKS,
                  WIP_MAT: rowdata.WIP_MAT,
                  WIP_MAT_DESC: rowdata.WIP_MAT_DESC,
                  FG_MAT_NO: rowdata.FG_MAT_NO,
                  FG_MAT_DESC: rowdata.FG_MAT_DESC,
                  SPEC: rowdata.SPEC,
                  EIC_TDC_ACTL: rowdata.EIC_TDC_ACTL
                });
              }

              setInventoryData(rows);
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

  const inventoryInfoColumn = [
    {
      title: "Creation Date",
      field: "CREATION_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Batch",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    //{ title: "Plant", field: "PLANT", headerFilter: "input", headerFilterPlaceholder: "search...", frozen: true, },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status Desc",
      field: "STATUS_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status Age(Days)",
      field: "STATUSAGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Stor Loc",
      field: "STORAGE_LOC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      //title: "Total Stock",
      title: "Stock(Net Wt)",
      field: "NET_WT",
      headerFilter: "input",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
      // formatter: "money",
    },
    {
      title: "Stock UOM", //"UOM",
      field: "UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap Wt(MT)",
      field: "SCRAP_WT",
      headerFilter: "input",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
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
      title: "Scheduled at workcenter",
      field: "PLANNED_WORK_CENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed from Workcenter",
      field: "CURRENT_WORK_CENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Workcenter",
      field: "NEXT_WORK_CENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Receive Plant",
      field: "RECVPLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "PLANNED_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickness Actual",
      field: "THICK",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
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
      title: "Width/OD Actual",
      field: "WIDTH",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "ID Actual",
    //   field: "IDIA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "FG Grade/ TDC",
      field: "ACTUAL_TDC",
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
      title: "Length Actual",
      field: "LENGTH",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
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
      title: "Rolling length",
      field: "ROLLING_LENGTH",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
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
      title: "Idia",
      field: "IDIA",
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
      title: "Planned Route",
      field: "PLANNED_ROUTE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Actual Route",
      field: "ACTUAL_ROUTE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "No of Pass",
    //   field: "SURFASE_SIZE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Previous Process",
      field: "PREV_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Process",
      field: "CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Process",
      field: "NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Order NO",
      field: "CUST_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Item",
      field: "CUST_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Type",
      field: "ENC_ORDER_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {                           // added by yogesh requested by Vedvraj Meshram on 07-04-2026
      title: "Specification",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "FG_MATERIAL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prime Tubes(Nos.)",
      field: "NO_OF_PIECES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    //{ title: "Planning No", field: "NA", headerFilter: "input", headerFilterPlaceholder: "search...", },
    //{ title: "Planned Sales Items", field: "CUST_ITEM", headerFilter: "input", headerFilterPlaceholder: "search...", },
    {
      title: "Order Thickness",
      field: "SO_THICK",
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
      title: "Order Odia",
      field: "SO_ODIA",
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
      title: "Order Idia",
      field: "SO_IDIA",
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
      title: "Order Length",
      field: "SO_LENGTH",
      headerFilter: "input",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "SO Grade",
    //   field: "SO_GRADE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },

    {
      title: "Pcode",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qcode",
      field: "QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant NM",
      field: "PLANT_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Finish",
      field: "NA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Planned Header Remark",
    //   field: "PLANNED_HEADER_REMARK",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Batch Age(Days)",
      field: "BATCH_AGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          // return value;
          //  return parseFloat(value).toFixed(3);
        }
        if (value >= 0 && value <= 30) {
          cell.getElement().style["background-color"] = "#04FF00";
          cell.getElement().style["color"] = "black";
        } else if (value > 30 && value <= 60) {
          cell.getElement().style["background-color"] = "#FFFF00";
          cell.getElement().style["color"] = "black";
        } else if (value > 61 && value <= 90) {
          cell.getElement().style["background-color"] = "#FFA500";
          cell.getElement().style["color"] = "black";
        } else if (value > 60) {
          cell.getElement().style["background-color"] = "#FF0000";
          cell.getElement().style["color"] = "black";
        }
        return parseFloat(value).toFixed(0);
      },
    },
    {
      title: "Material Group",
      field: "MATERIAL_GROUP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Material Type",
    //   field: "MATERIAL_TYPE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Source",
    //   field: "SOURCE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Cast Number",
      field: "CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Divison",
    //   field: "DIVISON",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "HSN Code",
    //   field: "HSN_CODE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Plan Quantity (Conc)",
    //   field: "PLAN_QUANTITY",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: "money",
    // },
    // {
    //   title: "Physical Location",
    //   field: "PHYSICAL_LOC",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Prod Date",
      field: "CREATION_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Planned Stage Remark",
    //   field: "PLANNED_STAGE_REMARK",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "SO OD tolerance",
    //   field: "SO_OD_TOL",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "SO Thick tolerance",
    //   field: "SO_THICK_TOL",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "SO Length tolerance",
    //   field: "SO_LENGTH_TOL",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    //{ title: "SEND_TO_SAP", field: "SEND_TO_SAP", headerFilter: "input", headerFilterPlaceholder: "search...", },
    {
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "MOTHER_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch Age(Days)",
      field: "MOTHER_BATCH_AGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "RM material no",
      field: "RM_MATRL_NO",
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
      title: "Merge Batch",
      field: "MERGED_BATCH",
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
      title: "Op Remarks",
      field: "EOM_OPER_COMMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "FG Material No.",
      field: "FG_MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Desc.",
      field: "FG_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const mergedInvColumns = [
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      //title: "Slit Coil",
      title: "Batch Id",
      field: "SLIT_COIL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      //title: "Slit Coil Qty",
      title: "Batch Qty",
      field: "SLIT_COIL_QTY",
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
      title: "Merged Batch",
      field: "MERGED_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Merged Batch Qty",
      field: "MERGED_BATCH_QTY",
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
      title: "FG Material No.",
      field: "FG_MATERIAL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Desc.",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Merged Date",
      field: "MERGE_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Merged By",
      field: "MERGED_BY_USER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Merged Type",
      field: "MERGED_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const reversedInfoColumns = [
    {
      field: "PLANT",
      title: "Plant",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "REVERSAL_DT",
      title: "Reversal Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "REVERSAL_DONE_BY",
      title: "Reversal Done By",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "BATCH_ID",
      title: "Batch Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "NET_WT",
      title: "Net Wt",
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
      field: "NET_WT_UOM",
      title: "Net Wt UOM",
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
      field: "BATCH_THK",
      title: "Batch THK",
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
      field: "BATCH_ODIA",
      title: "Batch Odia",
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
      field: "BATCH_LENGTH",
      title: "Batch Length",
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
      field: "BATCH_GRADE",
      title: "Batch Grade",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "BATCH_STATUS",
      title: "Batch Status",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PARENT_BATCH",
      title: "Parent Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "FIRST_PARENT",
      title: "First Parent",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MERGE_BT",
      title: "Merge BT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CAST_NO",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "IDIA",
      title: "Idia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ORDER1",
      title: "Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ITEM",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MATERIAL_NO",
      title: "Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PRODUCTION_DONE_BY_USR",
      title: "Production Done By User",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }
  ]

  useEffect(() => {
    if (tabValue == 2) {
      if (reversedInfoData && reversedInfoData.length > 0) {
        setReversedInfoTableData(
          new Tabulator("#reversedInfoTable", {
            data: reversedInfoData,
            columns: reversedInfoColumns,
            layout: "fitDataFill",
            maxHeight: 400,
          })
        );
      }
    }
  }, [reversedInfoData]);

  useEffect(() => {
    if (tabValue == 1) {
      if (mergedInvData && mergedInvData.length > 0) {
        setMergedInvTableData(
          new Tabulator("#mergedInvTable", {
            //   pagination: "local", //enable local pagination.
            data: mergedInvData,
            columns: mergedInvColumns,
            maxHeight: 400,
            layout: "fitColumns",
          })
        );
      }
    }
  }, [mergedInvData]);

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
        .replace(/ /g, "-").replace("Sept", "Sep")
      : "";

    var toDt = toDtMerg
      ? toDtMerg
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-").replace("Sept", "Sep")
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
      url = "api/ttsm012/mergedinv";
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
        mergeBatch: allValuesRev.mergeBatch
      };

      var url = "api/ttsm012/getReversedBatchInfo";

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
    var fileName = "TTSM012_GroundInventory " + date.toString() + ".xlsx";
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
    var fileName = "TTSM012_MergedInventory " + date.toString() + ".xlsx";
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
    var fileName = "TTSM012_ReversedInfo " + date.toString() + ".xlsx";
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
        page="Inventory Information"
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
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Ground Inventory" icon={<Today />} />
                    <Tab label="Merged Inventory" icon={<Today />} />
                    <Tab label="Reversed Batch Information" icon={<Today />} />
                  </Tabs>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                {tabValue == 0 && (
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
                        <Grid item xs={1}>
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
                          <MDInput
                            name="process"
                            value={allValues.process || ""}
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
                            Batch
                          </MDTypography>
                          <MDInput
                            name="batch"
                            value={allValues.batch || ""}
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
                            name="mbatch"
                            value={allValues.mbatch || ""}
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
                            Order
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
                            Item
                          </MDTypography>
                          <MDInput
                            name="item"
                            value={allValues.item || ""}
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
                            Order Type
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={ordType}
                            value={selectedOrderType}
                            onChange={handleOrdTypeChange}
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
                            Material No.
                          </MDTypography>
                          <MDInput
                            label=""
                            name="materialNo"
                            value={allValues.materialNo || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>
                        {/* <Grid item xs={1}>
                                              <MDTypography   fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap  >
                            TDC
                          </MDTypography>
                                                  <MDInput label="" name="tdc" value={allValues.tdc || ''} onChange={(e) => handleChange(e)} />
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
                        </Grid>
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
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Prod From Date
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
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Prod To Date
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
                            Desp. From Date
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
                            id="DespFrDate"
                            value={despFrmDt}
                            onChange={(date) => setDespFrmDt(date)}
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
                            Desp. To Date
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
                            id="DespToDate"
                            value={despToDt}
                            onChange={(date) => setDespToDt(date)}
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
                            Odia From
                          </MDTypography>

                          {/* <MDInput  type="number" name="widthFrm" value={allValues.widthFrm || ''} onChange={(e) => handleChange(e)} /> */}
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

                          {/* <MDInput  type="number" name="widthTo" value={allValues.widthTo || ''} onChange={(e) => handleChange(e)} /> */}
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
                        </Grid>
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
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllMerg(true)}
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
                            color={"dark"}
                            noWrap
                          >
                            Plant*
                          </MDTypography>
                          <ReactSelect
                            id="plantMerg"
                            options={plant}
                            value={selectedPlantMerg}
                            onChange={handlePlantChangeMerg}
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
                            name="batchMerg"
                            value={allValuesMerg.batchMerg || ""}
                            onChange={(e) => handleChangeMerg(e)}
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
                            Merged Batch
                          </MDTypography>
                          <MDInput
                            name="mergedBatchMerg"
                            value={allValuesMerg.mergedBatchMerg || ""}
                            onChange={(e) => handleChangeMerg(e)}
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
                            Merged Type
                          </MDTypography>
                          <ReactSelect
                            id="mergedType"
                            options={mergedTypeList}
                            value={selectedMergedTypeMerg}
                            onChange={handleMergedTypeChangeMerg}
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
                            From Date
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
                            id="fromDtMerg"
                            value={fromDtMerg}
                            onChange={(date) => setFromDtMerg(date)}
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
                            To Date
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
                            id="toDtMerg"
                            value={toDtMerg}
                            onChange={(date) => setToDtMerg(date)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getMergedInventory(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 2 && (
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
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllRev(true)}
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
                            color={"dark"}
                            noWrap
                          >
                            Plant*
                          </MDTypography>
                          <ReactSelect
                            id="plantMerg"
                            options={plant}
                            value={selectedPlantMerg}
                            onChange={handlePlantChangeMerg}
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
                            name="batchId"
                            value={allValuesRev.batchId || ""}
                            onChange={(e) => handleChangeRev(e)}
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
                            Mother Batch
                          </MDTypography>
                          <MDInput
                            name="mergeBatch"
                            value={allValuesRev.mergeBatch || ""}
                            onChange={(e) => handleChangeRev(e)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getReversedBatchInformation(true)}
                          >
                            Submit
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
                            Ground Inventory Data
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
                          <div id="inventoryTable" />
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
                        <Grid container spacing={3}>
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
                            Merged Inventory Data
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
                              onClick={() => downloadExcelMergedInv()}
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
                          <div id="mergedInvTable" />
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
                            Showing 1 to {mergedInvData.length} of{" "}
                            {mergedInvData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 2 && (
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
                            Reversed Batch Information
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>

                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelReversedInfo()}
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
                          <div id="reversedInfoTable" />

                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {reversedInfoData.length} of{" "}
                            {reversedInfoData.length} entries
                          </p>
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
