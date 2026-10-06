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
import UpgradeIcon from "@mui/icons-material/Upgrade";
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
import ClearAllIcon from "@mui/icons-material/ClearAll";

import "../../tabulatorCss.scss";

export default function TubePlanning() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [ordType, setOrdType] = useState([]);
  const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [customerDesc, setCustomerDesc] = useState([]);
  const [fgDataTable, setFGDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [upType, setUpType] = useState([]);
  const [selectedUpType, setSelectedUpType] = useState(null);
  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [action, setAction] = useState([]);
  const [selectedAction, setSelectedAction] = useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [fgData, setFGData] = React.useState([]);
  const [uploadTypeList, setUploadTypeList] = useState([]);
  const [ordFrmDt, setOrdFrmDt] = useState("");
  const [ordToDt, setOrdToDt] = useState("");

  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    batch: "",
    mBatch: "",
    scorder: "",
    scoitem: "",
    order: "",
    item: "",
  });

  const handleChange = (e) => {
    setFGData([,]);
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };
  const upload_type = [
    { label: "ALL", value: "" },
    { label: "FG", value: "F" },
    { label: "Scrap", value: "S" },
  ];
  const status_type = [
    { label: "ALL", value: "" },
    { label: "E - Error", value: "E" },
    { label: "Y - Success", value: "Y" },
    { label: "A - Active", value: "A" },
  ];
  const action_type = [
    { label: "ALL", value: "" },
    { label: "A - Active", value: "A" },
    { label: "Y - Success", value: "Y" },
  ];
  //page load
  useEffect(() => {
    async function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }

      if (initialLoad == false) {
        const response = await getAuthorization();
        if (response) {
          validateUser();
          //page load functions here
          getGroupPlantId();
          getUploadType();
          setInitialLoad(true);
        }
      }
    }
    fetchData();
  }, []);

  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      var url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tmm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tmm_accessToken", response.data.accessToken);
            localStorage.setItem(
              "tmm_refreshToken",
              response.data.refreshToken
            );
            resolve(response.data);
          }
        });
    });

  const validateUser = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    setLoading(true);
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          localStorage.getItem("tmm_refreshToken"),
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
      var pageName = "LDSM022";

      var authDetails = await getScreenAuth(plant, userId, pageName);

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
    } finally {
      setLoading(false);
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
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

  const getGroupPlantId = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    let data = {
      adid: serverDetails.PersonalNo,
    };
    var url = "api/common/getGroupPlant";
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
          setPlant(items);
          setSelectedPlant(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getUploadType = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    let data = {
      adid: serverDetails.PersonalNo,
    };
    var url = "api/LDSM022/getUploadType";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[0];
            obj.value = rowArr[1];
            items.push(obj);
          });
          setUploadTypeList(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (fgData && fgData.length > 0) {
      setFGDataTable(
        new Tabulator("#fgTable", {
          height: 400,
          data: fgData,
          columns: FinishedGoodColumn,
          layout: "fitDataFill",
        })
      );
    }
  }, [fgData]);

  //for dateTime
  //date formatter
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
      //  if (month < 10) {
      //    month = "0" + month;
      //  }
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

  const getCustDesc = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
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
        setLoading(false);
      });
  };

  const updateFGData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var selectedRows = fgDataTable.getSelectedRows();
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });

    if (newData.length == 0) {
      alertify.error("No rows selected !");
      return;
    }

    if (!selectedAction) {
      alertify.error("Please select action !");
      return;
    }
    if (!selectedAction.value || selectedAction.value.length == 0) {
      alertify.error("Please select action !");
      return;
    }

    setLoading(true);

    var data = {
      new_status: selectedAction.value,
      selectedData: newData,
      userId: serverDetails.PersonalNo,
    };

    setLoading(true);

    var url = "api/LDSM022/updateFGData";

    // api call
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
          alertify.error("Error Inserting Data");
        } else {
          alertify.success(`${response.data} row(s) updated successfully!`);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setFGData([,]);
    //  alert(selectedPlant.value)
    //getCustDesc(value);
    // getOrdTyp(value);
  };
  const handleUploadChange = (value) => {
    setSelectedUpType(value);
    setFGData([,]);
  };
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    setFGData([,]);
  };
  const handleActionChange = (value) => {
    setSelectedAction(value);
    setFGData([,]);
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

  const dateGap = (dateA, dateB) => {
    const date1 = new Date(dateA);
    const date2 = new Date(dateB);
    const diffTime = date2 - date1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    if (!selectedPlant) {
      alertify.error("Please select Plant !");
      return;
    }

    if (ordFrmDt === "" || ordToDt === "") {
      alertify.error("Please select Date !");
      return;
    }
    if (dateGap(ordFrmDt, ordToDt) > 60) {
      alertify.error("Date Range should not be more than 60!");
      return;
    }
    if (dateGap(ordFrmDt, ordToDt) < 0) {
      alertify.error("To Date should be greater than From Date!");
      return;
    }

    if (selectedPlant?.value.length == 0) {
      alertify.error("Please select Plant !");
      return;
    }
    setLoading(true);
    var url;
    // alert(selectedPlant.value);
    var data = {
      plant: selectedPlant?.value,
      upType: selectedUpType?.value,
      batch: allValues?.batch,
      mBatch: allValues?.mBatch,
      status: selectedStatus?.value,
      order: allValues?.order,
      item: allValues?.item,
      Upload_Date_From: ordFrmDt,
      Upload_Date_To: ordToDt,
    };

    url = "api/LDSM022/getFGData";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          setFGData(response.data);

          if (response.data.length == 0) {
            alertify.error("No Data Found");
            setFGData([,]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  const clearFilter = () => {
    setSelectedPlant(null);
    setOrdFrmDt("");
    setOrdToDt("");
    setSelectedUpType(null);
    setSelectedStatus([]);
    setSelectedAction([]);
    setAllValues({
      batch: "",
      mBatch: "",
      scorder: "",
      scoitem: "",
      order: "",
      item: "",
    });
    setFGData([,]);
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

  const FinishedGoodColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
    },
    {
      title: "Timestamp",
      field: "TIME_STAMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //     title: "Timestamp",
    //     field: "TIME_STAMP",
    //     headerFilterPlaceholder: "search...",
    //     accessorDownload: dateTimeOnly,
    //     formatterParams: {
    //         inputFormat: "YYYY-MM-DD",
    //         outputFormat: "DD/MM/YY",
    //         invalidPlaceholder: "(invalid date)",
    //     },
    //     frozen: true, "headerFilter": "input", "headerFilterPlaceholder": "search..."
    // },
    {
      title: "Batch",
      field: "BATCH",
      headerFilterPlaceholder: "search...",
      frozen: true,
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MBatch",
      field: "MOTHER_BATCH_ID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.",
      field: "NET_WT",
      headerFilterPlaceholder: "search...",
      formatter: "money",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: (cell, formatterParams) => {
        return Number(cell.getValue()).toFixed(3);
      },
    },
    {
      title: "Gross Wt.",
      field: "GRS_QTY",
      headerFilterPlaceholder: "search...",
      formatter: "money",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: (cell, formatterParams) => {
        return Number(cell.getValue()).toFixed(3);
      },
    },
    {
      title: "Scrap Wt.",
      field: "SCRAP_WT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: (cell, formatterParams) => {
        return Number(cell.getValue()).toFixed(3);
      },
    },
    {
      title: "Inv. Loss Wt.",
      field: "INV_LOSS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: (cell, formatterParams) => {
        return Number(cell.getValue()).toFixed(3);
      },
    },
    {
      title: "No Pieces",
      field: "NO_PIECES",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "SCO_ORDER_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "SCO_ORDER_ITEM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Status",
      field: "STATUS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Error Cd",
      field: "ERROR_CD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No",
      field: "MATERIAL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Process Time",
      field: "PROCESS_TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "System Upload Time",
      field: "SYS_UPLOAD_TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "CUSTOMER_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Storage Location",
      field: "STOR_LOC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Start Time",
      field: "STRT_TM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "End Time",
      field: "END_TM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Work Center",
      field: "WORK_CENT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Other Info",
      field: "OTHER_INFO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
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
    if (fgDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = fgDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "TubesPlanningData " + date.toString() + ".xlsx";
    fgDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Data Exchange"
        page="SAP & MES Interface errors(FG)"
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

                  <MDBox px={3} py={3}>
                    <Grid container spacing={2.5}>
                      <Grid item xs={2.5} style={{ zIndex: 5 }}>
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
                          value={selectedPlant}
                          // onChange={({value }) => handlePlantChange(value)}
                          onChange={handlePlantChange}
                        />
                      </Grid>
                      {/* <Grid item xs={1.75} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Upload Type
                          {/* <span style={{ color: 'red' }}>*</span> 
                        </MDTypography>
                        <ReactSelect
                          id="upload_type"
                          options={uploadTypeList}
                          value={selectedUpType}
                          //onChange={({value }) => handlePlantChange(value)}
                          onChange={handleUploadChange}
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
                          Batch
                        </MDTypography>
                        <MDInput
                          label=""
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
                          MBatch Id
                        </MDTypography>
                        <MDInput
                          label=""
                          name="mBatch"
                          value={allValues.mBatch || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      <Grid item xs={1.25} style={{ zIndex: 5 }}>
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
                        <ReactSelect
                          id="status"
                          options={status_type}
                          value={selectedStatus}
                          // onChange={({value }) => handlePlantChange(value)}
                          onChange={handleStatusChange}
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
                          label=""
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
                          Upload From Date
                          <span style={{ color: "red" }}>*</span>
                        </MDTypography>

                        <MonthPicker
                          id="OrddtFrDate"
                          value={ordFrmDt}
                          onChange={(date) => setOrdFrmDt(date)}
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
                          Upload To Date<span style={{ color: "red" }}>*</span>
                        </MDTypography>
                        <MonthPicker
                          id="OrddtTmDate"
                          value={ordToDt}
                          onChange={(date) => setOrdToDt(date)}
                        />
                      </Grid>

                      {/* <Grid item xs={2} style={{ zIndex: 4 }}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    Action
                                                </MDTypography>
                                                <ReactSelect
                                                    id="action"
                                                    options={action_type}
                                                    value={selectedAction}
                                                    // onChange={({value }) => handlePlantChange(value)}
                                                    onChange={handleActionChange}
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
                          Upload Finished Good Stock
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        {/* <Tooltip title="update">
                                                    <IconButton color="white" disabled={isReadWriteAccess} onClick={() => updateFGData(true)}>
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
                        <div id="fgTable" />

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
                          Showing 1 to {fgData.length} of {fgData.length}{" "}
                          entries
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
