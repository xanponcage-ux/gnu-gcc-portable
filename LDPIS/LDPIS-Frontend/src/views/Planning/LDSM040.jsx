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
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import PrintIcon from "@mui/icons-material/Print";
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
import { GetAuthorization } from "utils";
import { exportExcelFile } from "./ExcelExportHelper";
import { format } from 'date-fns';

export default function LDSM040() {
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
  const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [selectedSchedule, setSelectScheduleType] = React.useState({
    label: "Coil Schedule",
    value: "1",
  });
  const [selectedAction, setSelectActionType] = React.useState([]);
  const [customerDesc, setCustomerDesc] = useState([]);
  const [process, setProcess] = useState([]);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [tracking, setTracking] = React.useState([]);
  const [selectedProcess, setSelectedProcess] = React.useState(null);
  const [bUnit, setBunit] = React.useState([]);
  const [selectStatus, setSelectStatus] = React.useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const [selectTracking, setSelectTracking] = useState([]);
  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [slitCoilData, setSlitCoilData] = useState([]);
  const [slitCoilDataTable, setSlitCoilDataTable] = useState(null);

  const [filter, setFilter] = useState(defaultHrForm);
  const [getCustomerTable, setCustomerTable] = React.useState([]);
  const [getCustomerData, setCustomerData] = React.useState([]);
  const [selectedCustomerTable, setSelectedCustomerTable] = useState(null);
  const [selectedCustomerData, setSelectedCustomerData] = useState(null);
  const [sourcePlantFetched, setSourcePlantFetched] = useState(false);
  const [prodnDt, setProdnDt] = useState(null);
  const [schdFrmDt, setSchdFrmDt] = useState(null);
  const [schdToDt, setSchdToDt] = useState(null);

  const [workCenter, setWorkCenter] = useState({});
  const [selectedWorkCenter, setSelectedWorkCenter] = React.useState(null);

  const [TdcList, setTdcList] = useState([]);
  const [selectedTdc, setSelectedTdc] = React.useState(null);

  var customerTable = React.createRef();
  // const componentRef = React.useRef();
  const [allValues, setAllValues] = useState({
    order: "",
    item: "",
    batchId: "",
    prodnDt: "",
    tdc: "",
    Odia: "",
    Idia: "",
    Thick: "",
  });

  const status = [
    { label: "WC-Waiting for confirmation", value: "WC" },
    { label: "CN-Confirmed", value: "CN" },
  ];

  const scheduleTyp = [
    { label: "Coil Schedule", value: "1" },
    { label: "WIP Schedule", value: "2" },
  ];

  const action = [
    { label: "Download All", value: "1" },
    { label: "Download With SCO Only", value: "2" },
  ];

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
    });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //     getDataPrintBtnSubmit();
  // }, [selectedPlant]);

  useEffect(() => {
    if (getCustomerTable && getCustomerTable.length > 0) {
      setSelectedCustomerTable(
        new Tabulator("#selCustomerTable", {
          // pagination: "local", //enable local pagination.
          // paginationSize: 12,
          data: getCustomerTable,
          // columns: gvCoilClm,
          columns: planningDetailsClm,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [getCustomerTable]);

  useEffect(() => {
    if (getCustomerData && getCustomerData.length > 0) {
      setSelectedCustomerData(
        new Tabulator("#selCustomerData", {
          // pagination: "local", //enable local pagination.
          // paginationSize: 12,
          data: getCustomerData,
          // columns: gvCoilClm,
          columns: customColumnData,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [getCustomerData]);

  //use Effect to render display data
  useEffect(() => {
    if (slitCoilData && slitCoilData.length > 0) {
      setSlitCoilDataTable(
        new Tabulator("#slitcoildetails", {
          data: slitCoilData,
          columns: slitCoilColumn,
          height: "100%",
          layout: "fitDataFill",
        })
      );
    }
  }, [slitCoilData]);

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
      var pageName = "LDSM040";

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
              getProcess(items[0], accessToken),
              getCustDesc(items[0], accessToken),
              getTracking(items[0], accessToken),
              getOrdTyp(items[0], accessToken),
              getBusinessCd(items[0], accessToken),
              getWorkCenter(items[0], accessToken),
              getTdcList(items[0], accessToken),
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

  const getProcess = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM040/getProcDesc";
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
            setProcess(items);
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

      var url = "api/LDSM040/getCustDesc";
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

  const getTracking = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM040/getTracking";
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
            setTracking(items);
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

      var url = "api/LDSM040/getOrderType";
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
  const getWorkCenter = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM040/getWorkCenter";
      let data = {
        Plant: selectedPlant ? selectedPlant.value : "",
        // Process: selectedProcess ? selectedProcess.value : ""
        Process: value ? value.value : selectedProcess.value,
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
            setWorkCenter(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getTdcList = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM040/getTdcList";
      let data = {
        plant: value.value,
        // Plant: selectedPlant ? selectedPlant.value : "",
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
              obj.label = row;
              obj.value = row;
              items.push(obj);
            });
            setTdcList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    handleClearAll();
    setSelectedPlant(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
    if (value?.value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getProcess(value, token.accessToken),
          getCustDesc(value, token.accessToken),
          getTracking(value, token.accessToken),
          getOrdTyp(value, token.accessToken),
          getBusinessCd(value, token.accessToken),
          getWorkCenter(value, token.accessToken),
          getTdcList(value, token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleProcessChange = (value) => {
    setSelectedProcess(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getWorkCenter(value, token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };
  const handleWorkCenterChange = (value) => {
    setSelectedWorkCenter(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
  };
  const handleTdcChange = (value) => {
    setSelectedTdc(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
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

  const handleStatusChange = (value) => {
    setSelectStatus(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
  };

  const handleCustomerChange = (value) => {
    setSelectCustomerDesc(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
  };

  const handleTrackingChange = (value) => {
    setSelectTracking(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
  };

  const handleOrderChange = (value) => {
    setSelectOrderType(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
  };

  const handleScheduleTypChange = (value) => {
    setSelectScheduleType(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
  };

  const handleActionChange = (value) => {
    setSelectActionType(value);
    setCustomerTable([,]);
    setSlitCoilData([,]);
  };

  //Print Icon Btn
  const getDataPrintBtnSubmit = () => {
    if (!selectedPlant?.value?.length) {
      // alertify.error("Please Select Plant!");
    } else if (!selectedSchedule?.value?.length > 0) {
      // alertify.error("Please Select Schedule Type!");
    } else {
      var schudlDtFrm = schdFrmDt
        ? schdFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "";
      var schudlDtTo = schdToDt
        ? schdToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "";
      var prdnDt = prodnDt
        ? prodnDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "";
      // selectedAction.value

      if (schudlDtFrm > schudlDtTo) {
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
        var url = "api/LDSM040/getCustData";
        var data = {
          Plant: selectedPlant ? selectedPlant.value : "",
          Process: selectedProcess ? selectedProcess.value : "",
          Status: selectStatus ? selectStatus.value : "",
          Batch: allValues.batchId,
          Order_Type: selectedOrderType ? selectedOrderType.label : "",
          TDC: allValues.tdc,
          SchTyp: selectedSchedule ? selectedSchedule.value : "1",
          Order: allValues.order,
          Order_Item: allValues.item,
          Customer_code: selectCustomerDesc ? selectCustomerDesc.value : "",
          SchDt_from: schudlDtFrm,
          SchDt_To: schudlDtTo,
          Prdn_Dt: prdnDt,
          Tracking: selectTracking.value ? selectTracking.value : "",
          WorkCenter: selectedWorkCenter ? selectedWorkCenter.value : "",
          Odia: allValues.Odia,
          Idia: allValues.Idia,
          Thick: allValues.Thick,
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              if (response.data[1].length == 0) {
                alertify.error("No Data Found");
                setCustomerData([,]);
              } else {
                let tabledata = response.data[1].map((e) => {
                  return {
                    ...e,
                    CUST_OD: e.CUST_OD ? e.CUST_OD.toFixed(2) : 0,
                    IDIA: e.IDIA ? e.IDIA.toFixed(2) : 0,
                    CUST_THK: e.CUST_THK ? e.CUST_THK.toFixed(2) : 0,
                    THICK: e.THICK ? e.THICK.toFixed(2) : 0,
                    CUST_LENGTH: e.CUST_LENGTH ? e.CUST_LENGTH.toFixed(3) : 0,
                    GI_QNTY: e.GI_QNTY ? parseInt(e.GI_QNTY) : 0,
                    MILL_LENGTH: e.MILL_LENGTH ? e.MILL_LENGTH.toFixed(3) : 0,
                    SFG_MATERIAL_NO: e.SFG_MATERIAL_NO ? e.SFG_MATERIAL_NO : 0,
                    ID_WRK_INST: e.ID_WRK_INST ? e.ID_WRK_INST : 0,
                    EWI_INP_JAC_GRD: e.EWI_INP_JAC_GRD ? e.EWI_INP_JAC_GRD : 0,
                    SFG_MATERIAL_DESC: e.SFG_MATERIAL_DESC
                      ? e.SFG_MATERIAL_DESC
                      : 0,
                    GI_MATERIAL: e.GI_MATERIAL ? e.GI_MATERIAL : 0,
                    GI_MATERIAL_DESC: e.GI_MATERIAL_DESC
                      ? e.GI_MATERIAL_DESC
                      : 0,
                    GRADE: e.GRADE ? e.GRADE : 0,
                    GI_BATCH: e.GI_BATCH ? e.GI_BATCH : 0,
                    FG_MATNR: e.FG_MATNR ? e.FG_MATNR : 0,
                    FG_MATNR_DESC: e.FG_MATNR_DESC ? e.FG_MATNR_DESC : 0,
                    No_of_Pieces: e.No_of_Pieces ? e.No_of_Pieces : 0,
                    END_FINISH: e.END_FINISH ? e.END_FINISH : 0,
                    CUST_ORD: e.CUST_ORD ? e.CUST_ORD : 0,
                    CUST_ITEM: e.CUST_ITEM ? e.CUST_ITEM : 0,
                    CREATED_BY: serverDetails.PersonalNo,
                    GEOMETRY: e.GEOMETRY ? e.GEOMETRY : 0,
                  };
                });
                setCustomerData(tabledata);
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    }
  };

  const getDataBtnSubmit = () => {
    if (!selectedPlant?.value?.length) {
      alertify.error("Please Select Plant!");
    } else if (!selectedSchedule?.value?.length > 0) {
      alertify.error("Please Select Schedule Type!");
    } else {
      // var schudlDtFrm = document.getElementById("scheduleDtFrm").value;
      // var schudlDtTo = document.getElementById("scheduleDtTo").value;
      // var prodnDt = document.getElementById("prodnDt").value;

      var schudlDtFrm = schdFrmDt
        ? schdFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "";
      var schudlDtTo = schdToDt
        ? schdToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "";
      var prdnDt = prodnDt
        ? prodnDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "";
      // selectedAction.value

      if (schudlDtFrm > schudlDtTo) {
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
        var url = "api/LDSM040/getCoils";
        var data = {
          Plant: selectedPlant ? selectedPlant.value : "",
          Process: selectedProcess ? selectedProcess.value : "",
          Status: selectStatus ? selectStatus.value : "",
          Batch: allValues.batchId,
          Order_Type: selectedOrderType ? selectedOrderType.label : "",
          TDC: allValues.tdc,
          SchTyp: selectedSchedule ? selectedSchedule.value : "1",
          Order: allValues.order,
          Order_Item: allValues.item,
          Customer_code: selectCustomerDesc ? selectCustomerDesc.value : "",
          SchDt_from: schudlDtFrm,
          SchDt_To: schudlDtTo,
          Prdn_Dt: prdnDt,
          Tracking: selectTracking.value ? selectTracking.value : "",
          WorkCenter: selectedWorkCenter ? selectedWorkCenter.value : "",
          Odia: allValues.Odia,
          Idia: allValues.Idia,
          Thick: allValues.Thick,
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              if (response.data[1].length == 0) {
                alertify.error("No Data Found");
                setCustomerTable([,]);
                setSlitCoilData([,]);
              } else {
                let tabledata = response.data[1].map((e) => {
                  return {
                    ...e,
                    CUST_OD: e.CUST_OD ? e.CUST_OD.toFixed(3) : 0,
                    IDIA: e.IDIA ? e.IDIA.toFixed(3) : 0,
                    CUST_THK: e.CUST_THK ? e.CUST_THK.toFixed(3) : 0,
                    CUST_LENGTH: e.CUST_LENGTH ? e.CUST_LENGTH.toFixed(3) : 0,
                    GI_QNTY: e.GI_QNTY ? e.GI_QNTY.toFixed(3) : 0,
                    MILL_LENGTH: e.MILL_LENGTH ? e.MILL_LENGTH.toFixed(3) : 0,
                    SFG_MATERIAL_NO: e.SFG_MATERIAL_NO ? e.SFG_MATERIAL_NO : 0,
                    ID_WRK_INST: e.ID_WRK_INST ? e.ID_WRK_INST : 0,
                    EWI_INP_JAC_GRD: e.EWI_INP_JAC_GRD ? e.EWI_INP_JAC_GRD : 0,
                    SFG_MATERIAL_DESC: e.SFG_MATERIAL_DESC
                      ? e.SFG_MATERIAL_DESC
                      : 0,
                    GI_MATERIAL: e.GI_MATERIAL ? e.GI_MATERIAL : 0,
                    GI_MATERIAL_DESC: e.GI_MATERIAL_DESC
                      ? e.GI_MATERIAL_DESC
                      : 0,
                    GRADE: e.GRADE ? e.GRADE : 0,
                    GI_BATCH: e.GI_BATCH ? e.GI_BATCH : 0,
                    FG_MATNR: e.FG_MATNR ? e.FG_MATNR : 0,
                    FG_MATNR_DESC: e.FG_MATNR_DESC ? e.FG_MATNR_DESC : 0,
                    No_of_Pieces: e.No_of_Pieces ? e.No_of_Pieces : 0,
                    END_FINISH: e.END_FINISH ? e.END_FINISH : 0,
                    CUST_ORD: e.CUST_ORD ? e.CUST_ORD : 0,
                    CUST_ITEM: e.CUST_ITEM ? e.CUST_ITEM : 0,
                  };
                });
                setCustomerTable(tabledata);
              }
            }
          })
          .finally((f) => {
            setLoading(false);
            getDataPrintBtnSubmit();
          });
      });
    }
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

  const gvCoilClm = [
    {
      field: "EWI_ID_BATCH",
      title: "Batch ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_FIRST_PAR",
      title: "Mother Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellClick: function (e, cell) {
        displaySlitCoilDetails(cell);
      },
    },
    {
      field: "LOM_SEC1",
      title: "Inp Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_SEC2",
      title: "Inp Width/Odia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_MS_GROSS_CAL",
      title: "Inp Wt.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_CD_YRD",
      title: "Yard",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_LOC_X",
      title: "X",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_LOC_Y",
      title: "Y",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_POS",
      title: "Pos",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EPL_PROC_LINE_DESC",
      title: "Proc Line",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CD_PROCESS",
      title: "Next Process",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_COMBINATION",
      title: "Combination",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_PACK",
      title: "No Part",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_SEC1",
      title: "Ord Thick",
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
      field: "EWI_SEC2",
      title: "Ord Width/Odia",
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
      field: "EWI_LENGTH",
      title: "Ord Length",
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
      field: "EWI_NO_PIECES",
      title: "No of Pcs",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "NO_PKTS1",
      title: "No Pkts",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_STACK",
      title: "No Stack ",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "NO_PALLETTES",
      title: "No Pallettes",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PIECE_WT",
      title: "Piece Wt",
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
      field: "EWI_UOM",
      title: "Piece Wt (UOM)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_CD_QLTY",
      title: "Quality",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GRADE_DESC",
      title: "Grade Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_TDC_ACTL",
      title: "Inp TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_TDC",
      title: "Out TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SCHEDULE_DT",
      title: "Schedule Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLAN_PRODN_DT",
      title: "Plan Prodn Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_PRIORITY",
      title: "Grp(1,2.)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SCH_AGE",
      title: "Schd Age",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "BATCH_AGE",
      title: "Batch Age",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_SCHEDULE",
      title: "Schedule Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_OFF_CUT_REMARKS",
      title: "Off Cut Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_REMARKS",
      title: "Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_ORDER_CUS",
      title: "Customer Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_ORD_ITEM_CUS",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "field": "LOM_ID_ORDER_CUS", "title": "Curr Order", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "LOM_ID_ORD_ITEM_CUS", "title": "Curr Item", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "ENC_ORDER_TYPE",
      title: "Order Type",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_NO_TRACKING",
      title: "Tracking No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_NO_MATNR",
      title: "Ord Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_MAX_PIECE_WT",
      title: "Max Wt",
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
      field: "EWI_MIN_PIECE_WT",
      title: "Min Wt",
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
      field: "EWI_IDIA",
      title: "Idia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_SCO_ORDER",
      title: "SCO Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_SCO_ITEM",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "DESTINATION",
      title: "Destination",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_MS_INPUT",
      title: "Planned Wt",
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
      field: "LOM_NO_MATNR",
      title: "Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_SETUP",
      title: "Setup Cd",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_CD_PROD",
      title: "Prod",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EDGE",
      title: "Mother Batch Edge",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_ORDER_EDGE",
      title: "Order Edge",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SALVAGING_REMARKS",
      title: "Salvaging Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_INP_JAC_GRD",
      title: "SFG Material No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_CUST_NAME",
      title: "Customer Name",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_PKG_TYP",
      title: "Package Type",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "IDIA",
      title: "Coil I-Dia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MARK_CUSTOMER",
      title: "Mark Cust.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "field": "TABLE_DATA", "title": "Table Data", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "INV_TAG", "title": "Inv Tag", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "LYS",
      title: "YS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "UTS",
      title: "UTS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "field": "PASSED_PROC", "title": "CRM Passed Process", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "ENC_SHIP_TO_PRTY_DESC",
      title: "Ship to Party Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PRV_SPC_OPR_COMNTS",
      title: "Previous SPC Operator Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const customColumnData = [
    {
      field: "WORK_CENT",
      title: "Work Centre",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CUST_OD",
      title: "Tube OD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "IDIA",
      title: "Tube ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CUST_THK",
      title: "Tube Thickness",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MILL_LENGTH",
      title: "Tube Rolling Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CUST_LENGTH",
      title: "Tube Order Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GEOMETRY",
      title: "Geometry",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GI_QNTY",
      title: "Tube Order Qty",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GRADE",
      title: "Tube Grade",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "END_FINISH",
      title: "End Finish",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CUST_NAME",
      title: "Customer Name",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_ID_ORDER",
      title: "Sales Order No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_NO_ITEM",
      title: "Sales Item No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "WIDTH",
      title: "RM Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "THICK",
      title: "RM Thickness",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SUR_FINISH",
      title: "RM Surface Finish",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "TDC",
      title: "RM TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GI_BATCH",
      title: "RM Batch no.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GI_QNTY",
      title: "RM Batch Qty",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLANNED_PROC",
      title: "Next Process",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLANNING_REMARKS",
      title: "Special Instruction",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CREATED_BY",
      title: "Creation By",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CREATION_DT",
      title: "Rolling Plan Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const planningDetailsClm = [
    {
      field: "CUST_NAME",
      title: "Customer Name",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "WORK_CENT",
      title: "Work Centre",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //     "field": "LOM_SEC1", "title": "Production Order", "headerFilter": "input", "headerFilterPlaceholder": "search..."
    // },
    {
      field: "SFG_MATERIAL_NO",
      title: "SFG Material No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SFG_MATERIAL_DESC",
      title: "SFG Material Desc.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GI_MATERIAL",
      title: "GI Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GI_MATERIAL_DESC",
      title: "GI Material Desc.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GRADE",
      title: "Grade/TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "GI_BATCH",
      title: "GI Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellClick: function (e, cell) {
        displaySlitCoilDetails(cell);
      },
    },
    {
      field: "GI_QNTY",
      title: "GI Qty.(KG)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "FG_MATNR",
      title: "FG Material No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "FG_MATNR_DESC",
      title: "FG Material Desc.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MILL_LENGTH",
      title: "Mill Length(MM)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "No_of_Pieces",
      title: "NO of PCS (Manual)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "CUST_OD",
      title: "Odia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "IDIA",
      title: "ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CUST_THK",
      title: "Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "CUST_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "END_FINISH",
      title: "Final Cond. (Mannual)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      field: "CUST_ORD",
      title: "Cust. Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CUST_ITEM",
      title: "Cust. Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLANNED_PROC",
      title: "Planned Path",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "field": "SLIT_BATCH", "title": "Slit Batch", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "SLIT_BATCH_QTY", "title": "Slit Batch Qty", "headerFilter": "input", "headerFilterPlaceholder": "search..."
    //         , formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return value.toFixed(3);
    //         }
    //         return value
    //     }
    // },
    // { "field": "MERGED_BATCH", "title": "Merged Batch", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "ID_WRK_INST",
      title: "Mill No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    //    { "field": "GRADE", "title": "Grade", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      field: "CREATION_DT",
      title: "Creation Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SHIFT",
      title: "Shift",
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
      field: "PDI_STATUS",
      title: "Pdi Status",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLANNING_REMARKS",
      title: "Planning Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MULTIPLE_LEN",
      title: "Multiple Length",
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
      title: "Cast No.",
      field: "CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }
  ];

  const displaySlitCoilDetails = (cell) => {
    var data = {
      plant: selectedPlant.value,
      // mother_batch: cell._cell.row.data.LOM_ID_FIRST_PAR
      mother_batch: cell._cell.row.data.GI_BATCH,
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM040/getslitcoildetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setSlitCoilData([,]);
            } else {
              var rows = [];

              setSlitCoilData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const slitCoilColumn = [
    {
      field: "PLANT",
      title: "Plant",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SLIT_COIL",
      title: "Slit Coil",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SLIT_COIL_QTY",
      title: "Slit Coil Qty",
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
      field: "MERGED_BATCH",
      title: "Marged Batch",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MERGED_BATCH_QTY",
      title: "Marged Batch Qty",
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
      field: "FG_MATERIAL_NO",
      title: "Material No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "FG_MATERIAL_DESC",
      title: "Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }, //Material desc all per 012 query and creationDt and creation buy
    {
      field: "MERGE_DT",
      title: "Creation Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    // { "field": "ERD_FLG_MAXWT", "title": "Max Wt", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_FLG_SEND_SAP", "title": "Send to SAP", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_REC_CRT_DT", "title": "Created Date", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_NO_PCS", "title": "No of Pcs", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_NEW_MATNR", "title": "New Material", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_MOV_IND", "title": "Mov Ind", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_NO_INV", "title": "No Inv", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_NO_DELIVERY", "title": "No Devlivery", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_DELV_ITEM", "title": "Delivery Item", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ERD_REC_STATUS", "title": "Rec Status", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
  ];

  const gvcoildisplayClm = [
    {
      field: "EWI_ID_BATCH",
      title: "Batch Id",
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
      field: "LOM_SEC1",
      title: "Inp Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_SEC2",
      title: "Inp Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_MS_GROSS_CAL",
      title: "Inp Wt.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EDGE",
      title: "Edge",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOC",
      title: "Location(X Y Yrd Pos)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_SETUP",
      title: "Setup Code",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EPL_PROC_LINE_DESC",
      title: "Process",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "CD_PROCESS",
      title: "Next Process",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_COMBINATION",
      title: "Combination",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_PACK",
      title: "No Part",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_PRIORITY",
      title: "Priority",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SCH_AGE",
      title: "Schedule Age",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "BATCH_AGE",
      title: "Mother Batch Age at SPC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_SEC2",
      title: "Out Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_LENGTH",
      title: "Out Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_PIECES",
      title: "No of Pieces per packet",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "NO_PKTS1",
      title: "No Of Packets",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_STACK",
      title: "No of Stacks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_MS_INPUT",
      title: "Planned Wt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_CD_QLTY",
      title: "Qlty Cd",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GRADE_DESC",
      title: "Grade Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_TDC_ACTL",
      title: "Inp TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_TDC",
      title: "Out TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_MAX_PIECE_WT",
      title: "Max Wt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_MIN_PIECE_WT",
      title: "Min Wt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_IDIA",
      title: "Idia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PLAN_PRODN_DT",
      title: "Schedule Release Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SCHEDULE_DT",
      title: "Schedule Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_SCHEDULE",
      title: "Id Schedule",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_OFF_CUT_REMARKS",
      title: "Off Cut Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_REMARKS",
      title: "Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_NO_MATNR",
      title: "Matnr(mother)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_ORDER_CUS",
      title: "Customer Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_ID_ORD_ITEM_CUS",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_ORDER_CUS",
      title: "Current Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LOM_ID_ORD_ITEM_CUS",
      title: "Current Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_ORDER_TYPE",
      title: "Order Type",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_NO_TRACKING",
      title: "Tracking No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_CD_PROD",
      title: "Prod cd",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EDGE",
      title: "Mother Batch EDGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_ORDER_EDGE",
      title: "Order Edge",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_NO_MATNR",
      title: "Matnr(Order)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_SCO_ORDER",
      title: "SCO No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_NO_SCO_ITEM",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_SEC1",
      title: "Out Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SALVAGING_REMARKS",
      title: "Salvaging Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_INP_JAC_GRD",
      title: "Plan Fg Grade",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_CUST_NAME",
      title: "Customer Name",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EWI_PKG_TYP",
      title: "Package Type",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "IDIA",
      title: "Coil I-Dia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MARK_CUSTOMER",
      title: "Mark Customer",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "TABLE_DATA",
      title: "Table Data",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "INV_TAG",
      title: "Inv Tag",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "LYS",
      title: "YS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "UTS",
      title: "UTS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PASSED_PROC",
      title: "CRM Passed Process",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ENC_SHIP_TO_PRTY_DESC",
      title: "Ship to Party Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  //Print Icon
  const downloadCustomerTableData = async (newToken = false) => {
    if (selectedCustomerData == null) {
      alertify.error("No Data exists for Downloading");
      return;
    }
    var len = selectedCustomerData.getData();
    if (len == 0) {
      alertify.error("No Data exists for Downloading");
      return;
    }
    //var date = new Date();
    var date = format(new Date(), 'dd-MMM-yyyy kk:mm:ss')
    var fileName = "Planning format " + date.toString() + ".xlsx";
    // selectedCustomerData.print(false, true);
    selectedCustomerData.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };
  const downloadPdfcustomerTableData = async (newToken = false) => {
    if (selectedCustomerTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = selectedCustomerTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    //var date = new Date();    
    var date = format(new Date(), 'dd-MMM-yyyy kk:mm:ss')
    var fileName = "LDSM040 " + date.toString() + ".pdf";
    selectedCustomerTable.download("pdf", fileName, {
      orientation: "landscape",
      title: "Planning details",
      autoTable: function (doc) {
        return {
          styles: { cellPadding: 2, fontSize: 3 },
          roundToPrecision: {
            length: 2,
          },
        };
      },
    });
  };

  const downloadExcelcustomerTableData = async (newToken = false) => {
    if (selectedCustomerTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedCustomerTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    //var date = new Date();    
    var date = format(new Date(), 'dd-MMM-yyyy kk:mm:ss')
    var fileName = "LDSM040 " + date.toString() + ".xlsx";
    selectedCustomerTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelSlitCoilDetails = async (newToken = false) => {
    if (!slitCoilData) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = slitCoilDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    //var date = new Date();    
    var date = format(new Date(), 'dd-MMM-yyyy kk:mm:ss')
    var fileName = "LDSM040_Slit_Coil_Details " + date.toString() + ".xlsx";
    slitCoilDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);
    setSelectedProcess(null);
    setSelectStatus([]);
    setSelectOrderType([]);
    setSelectCustomerDesc([]);
    setSelectTracking([]);
    setSelectScheduleType([]);
    setAllValues({});
    setSchdFrmDt(null);
    setSchdToDt(null);
    setProdnDt(null);
    setCustomerTable([]);
    setSelectedCustomerTable(null);
    setSlitCoilData([,]);
    setSlitCoilDataTable(null);
    //setSelectedProcess([]);
    setSelectedWorkCenter(null);
    setTdcList(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Scheduling/ Work Instruction planning report"
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
                          Plant<span style={{ color: "red" }}>*</span>{" "}
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          value={selectedPlant || ""}
                          //value={selectedPlant}
                          //value={selectedPlant.value != undefined ? selectedPlant : plant[0]}
                          onChange={handlePlantChange}
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
                          Process{" "}
                        </MDTypography>
                        <ReactSelect
                          id="process"
                          options={process}
                          value={selectedProcess || ""}
                          onChange={handleProcessChange}
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

                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Batch Id{" "}
                        </MDTypography>
                        <MDInput
                          name="batchId"
                          value={allValues.batchId || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>

                      {/* <Grid item xs={1}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Status </MDTypography>
                                                <ReactSelect
                                                    id="status"
                                                    options={status}
                                                    value={selectStatus}
                                                    onChange={handleStatusChange}
                                                />
                                            </Grid>

                                            <Grid item xs={1}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Prodn Dt </MDTypography>
                                                <DatePicker id="prodnDt" value={prodnDt} onChange={(date) => setProdnDt(date)} />
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
                          Customer{" "}
                        </MDTypography>
                        <ReactSelect
                          id="customer"
                          options={customerDesc}
                          value={selectCustomerDesc || ""}
                          onChange={handleCustomerChange}
                        />
                      </Grid>

                      {/* <Grid item xs={1.5}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Tracking </MDTypography>
                                                <ReactSelect
                                                    id="tracking"
                                                    options={tracking}
                                                    value={selectTracking || ""}
                                                    onChange={handleTrackingChange}
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
                          Schedule Date From{" "}
                        </MDTypography>
                        <DatePicker
                          id="scheduleDtFrm"
                          value={schdFrmDt}
                          onChange={(date) => setSchdFrmDt(date)}
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
                          Schedule Date To{" "}
                        </MDTypography>
                        <DatePicker
                          id="scheduleDtTo"
                          value={schdToDt}
                          onChange={(date) => setSchdToDt(date)}
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
                          Order Type{" "}
                        </MDTypography>
                        <ReactSelect
                          id="ordTyp"
                          options={ordType}
                          value={selectedOrderType}
                          onChange={handleOrderChange}
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
                          Grade/TDC
                        </MDTypography>
                        {/* <MDInput name="tdc"
                                                 value={allValues.tdc || ''} 
                                                 onChange={(e) => handleChange(e)}
                                                  /> */}
                        <ReactSelect
                          id="tdc"
                          options={TdcList}
                          value={selectedTdc}
                          onChange={handleTdcChange}
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
                          Schedule Type{" "}
                        </MDTypography>
                        <ReactSelect
                          id="scheduleTyp"
                          options={scheduleTyp}
                          value={selectedSchedule}
                          onChange={handleScheduleTypChange}
                        />
                      </Grid>

                      {/* <Grid item xs={2}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Action </MDTypography>
                                                <ReactSelect
                                                    id="action"
                                                    options={action}
                                                    value={setSelectActionType || ""}
                                                    onChange={handleActionChange}
                                                />
                                            </Grid> */}
                      <Grid item xs={2.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Work Center
                        </MDTypography>
                        <ReactSelect
                          id="WorkCenter"
                          options={workCenter}
                          value={selectedWorkCenter}
                          onChange={handleWorkCenterChange}
                        />
                      </Grid>
                      {/* <Grid item ms={4} xs={2}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >
                                                 Mill No. 
                                                </MDTypography>
                                                <MDInput name="MillNo" value={allValues.MillNo || ''} onChange={(e) => handleChange(e)} />
                                            </Grid> */}

                      <Grid item xs={0.75}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          ODIA
                        </MDTypography>
                        <MDInput
                          name="Odia"
                          type="number"
                          value={allValues.Odia || ""}
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
                          IDIA
                        </MDTypography>
                        <MDInput
                          name="Idia"
                          type="number"
                          value={allValues.Idia || ""}
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
                          Thick
                        </MDTypography>
                        <MDInput
                          name="Thick"
                          type="number"
                          value={allValues.Thick || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      {/* <Grid item xs={.75}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >
                                                Grade
                                                </MDTypography>
                                                <MDInput name="Thick" value={allValues.MillNo || ''} onChange={(e) => handleChange(e)} />
                                            </Grid> */}
                      <Grid item xs={2}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          //size="small"
                          color="info"
                          onClick={() => getDataBtnSubmit(true)}
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
                          {/* Receive Raw Material */}
                          Planning Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        {/* <Tooltip title="Save Plan" arrow>
                                                    <IconButton color="white">
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip> */}
                        <Tooltip title="Download" arrow>
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelcustomerTableData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download" arrow>
                          {/* <IconButton color="white" onClick={() => downloadCustomerTableData()}>
                                                        <PrintIcon />
                                                    </IconButton> */}

                          <IconButton
                            color="white"
                            onClick={() => exportExcelFile(getCustomerData)}
                          >
                            <PrintIcon />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Download" arrow >
                                                    <IconButton color="white" onClick={() => downloadPdfcustomerTableData()}>
                                                        <PictureAsPdfIcon />
                                                    </IconButton>
                                                </Tooltip> */}
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
                        <div id="selCustomerData" style={{ display: "none" }} />
                        {/* <br />
                                                <p color="black" style={{
                                                    color: "black", paddingLeft: "1rem", marginTop: "-1rem"
                                                }}>Showing 1 to {getCustomerTable.length} of {getCustomerTable.length} entries</p> */}
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
                          Slit Coil Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        {/* <Tooltip title="Save Plan" arrow>
                                                    <IconButton color="white">
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip> */}
                        <Tooltip title="Download" arrow>
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelSlitCoilDetails()}
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
                        <div id="slitcoildetails" />
                        <br />
                        {/* <p color="black" style={{
                                                    color: "black", paddingLeft: "1rem", marginTop: "-1rem"
                                                }}>Showing 1 to {slitCoilData.length} of {slitCoilData.length} entries</p> */}
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
