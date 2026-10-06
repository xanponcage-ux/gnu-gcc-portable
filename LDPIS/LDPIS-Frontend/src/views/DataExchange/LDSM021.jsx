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
import DatePicker from "components/DateTime/DatePicker";
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
import ClearAllIcon from "@mui/icons-material/ClearAll";
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
  const [rawMatTable, setrawMatTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [upType, setUpType] = useState([]);
  const [selectedUpType, setSelectedUpType] = useState([]);
  const [status, setStatus] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [action, setAction] = useState([]);
  const [selectedAction, setSelectedAction] = useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };

  const [filter, setFilter] = useState(defaultHrForm);
  const [rawMatData, setRawMatData] = React.useState([]);
  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    batch: "",
    invoice: "",
    delivery: "",
  });
  const [uploadFrmDt, setUploadFrmDt] = useState(null);
  const [uploadToDt, setUploadToDt] = useState(null);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

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
          //getGroupPlantId();
          //     getProdCat();
          //setSelectedPlant(PlantType[0].value)
          setInitialLoad(true);
        }
      }
    }
    fetchData();
  }, []);
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

  const PlantType = [
    { label: "3734 - Virtual Location", value: "3734" },
    { label: "0780 - LDP Plant", value: "0780" },
    
  ];
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
      var pageName = "LDSM021";
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

  // const getGroupPlantId = async (newToken = false) => {
  //   if (newToken) {
  //     const rsp = await getAuthorization();
  //   }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
  //     },
  //   };

  //   setLoading(true);
  //   let data = {
  //     adid: serverDetails.PersonalNo,
  //   };
  //   var url = "api/common/getGroupPlant";
  //   axiosAPI
  //     .post(url, data, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         var items = [];
  //         response.data.map((row) => {
  //           var obj = new Object();
  //           obj.label = row[0];
  //           obj.value = row[1];
  //           items.push(obj);
  //         });
  //         setPlant(items);
  //         setSelectedPlant(items[0]);
  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };

  useEffect(() => {
    if (rawMatData && rawMatData.length > 0) {
      setrawMatTable(
        new Tabulator("#rmTable", {
          height: 400,
          //frozenRows: 2,
          //   pagination: "local", //enable local pagination.
          data: rawMatData,
          columns: RawMaterialColumns,
          layout: "fitDataStretch",
        })
      );
    }
  }, [rawMatData]);
  const handleClearAll = (newToken = false) => {
    setAllValues({});
    setUploadFrmDt(null);
    setUploadToDt(null);

    setSelectedStatus([]);
    setSelectedAction([]);

    setRawMatData([,]);
  };

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setUploadFrmDt(null);
    setUploadToDt(null);
    setSelectedStatus([]);
    setSelectedAction([]);
    setRawMatData([,]);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    console.log(selectedStatus)
    setRawMatData([,]);
  };

  const handleActionChange = (value) => {
    setSelectedAction(value);
    setRawMatData([,]);
  };

  const handlePCatChange = (value) => {
    setSelectPcat(value);
    setRawMatData([,]);
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
    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }
    setLoading(true);
    var url;
    var CLIENT_ID = "600";
    //  var invoiceNum=document.getElementById("yearMonth").value;
    // alert(selectedPlant.value);

    var data = {
      WERKS: selectedPlant?.value,
      CLIENT_ID,
      batch: allValues.batch,
      status: selectedStatus?.value,
      invoice: allValues.invoice,
      // Upload_Date_From: document.getElementById("OrddtFrDate").value,
      // Upload_Date_To: document.getElementById("OrddtTmDate").value,
      Upload_Date_From: uploadFrmDt
        ? uploadFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      Upload_Date_To: uploadToDt
        ? uploadToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
        : "",
      delivery: allValues.delivery,
      action: selectedAction?.value,
    };

    console.log("data21",data)

    url = "api/LDSM021/getRMData";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          //consolre
          console.log("response",response)
          if (response.data.length == 0) {
            alertify.error("No Data Found");
            setRawMatData([,]);
          }
          var rows = [];
          //loop thru data and create json for table
          for (var i in response.data) {
            var rowdata = response.data[i];
            rows.push({
              rowId: i,
              TIME_STAMP: rowdata.TIME_STAMP,
              BATCH_ID: rowdata.BATCH_ID,
              INVOICE_NO: rowdata.INVOICE_NO,
              INVOICE_DATE: rowdata.INVOICE_DATE,
              DELIVERY_NO: rowdata.DELIVERY_NO,
              WEIGHT: rowdata.WEIGHT,
              RFC_STATUS: rowdata.RFC_STATUS,
              STATUS: rowdata.STATUS,
              MATERIAL_NO: rowdata.MATERIAL_NO,
              REMARKS: rowdata.REMARKS,
              DOCUMENT_NO: rowdata.DOCUMENT_NO,
            });
          }
          setRawMatData(rows);

          setRawMatData(response.data);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const statusList = [
    { value: "", label: "ALL" },
    { value: "E", label: "E - Error" },
    { value: "Y", label: "Y - Success" },
    { value: "A", label: "A - Active" },
  ];

  const actionList = [
    { value: "Y", label: "Y-Success" },
    { value: "A", label: "A-Active" },
  ];

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

  const RawMaterialColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Timestamp",
      field: "TIMESTAMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Id",
      field: "BATCH_ID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Invoice No",
      field: "INVOICE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Invoice Date",
      field: "INVOICE_DATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Delivery No.",
      field: "DELIVERY_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Weight",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Material No.",
      field: "MATERIAL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Transfer Status",
      field: "RFC_STATUS",
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
      title: "Remarks",
      field: "REMARKS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Document No",
      field: "DOCUMENT_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadExcelcustomerTableData = () => {
    if (rawMatTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = rawMatTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "LDSM021 " + date.toString() + ".xlsx";
    rawMatTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const updateRMData = async (newToken = false) => {
    if (selectedPlant.value != undefined) {
      if (newToken) {
        const rsp = await getAuthorization();
      }
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      var selectedRows = rawMatTable.getSelectedRows();
      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });

      if (newData.length == 0) {
        alertify.error("No rows selected !");
        return;
      }

      if (!action) {
        alertify.error("Please select action !");
        return;
      }
      if (!action.value || action.value.length == 0) {
        alertify.error("Please select action !");
        return;
      }
      setLoading(true);
      var url = "api/LDSM021/updateRMData";

      var data = {
        new_status: action.value,
        dt: newData,
        userId: serverDetails.PersonalNo,
      };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (Number(response.data) == 0) {
              alertify.error("Could not update");
            } else {
              alertify.success(
                Number(response.data) + " rows modified successfully !"
              );
              getData();
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    } else {
      alertify.error("Please Select Plant!");
    }
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Data Exchange"
        page="SAP & MES interface errors(RM)"
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
                      <Grid item xs={2.5} style={{ zIndex: 5 }}>
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
                          options={PlantType}
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
                          Upload From Date
                        </MDTypography>

                        {/* <DatePicker id="OrddtFrDate" /> */}
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
                          value={uploadFrmDt}
                          onChange={(date) => setUploadFrmDt(date)}
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
                          Upload To Date
                        </MDTypography>
                        {/* <DatePicker id="OrddtTmDate" /> */}
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        ></MDTypography>

                        <MonthPicker
                          id="OrddtTmDate"
                          value={uploadToDt}
                          onChange={(date) => setUploadToDt(date)}
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
                          Batch Id
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
                          Invoice No
                        </MDTypography>
                        <MDInput
                          label=""
                          name="invoice"
                          value={allValues.invoice || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Status Cd
                        </MDTypography>
                        <ReactSelect
                          id="status"
                          options={statusList}
                          value={selectedStatus}
                          // onChange={({value }) => handlePlantChange(value)}
                          onChange={(e) => {handleStatusChange(e)}}
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
                          Delivery No
                        </MDTypography>
                        <MDInput
                          name="delivery"
                          value={allValues.delivery || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      {/* <Grid item xs={1.5} style={{ zIndex: 5 }}>
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
                                                    options={actionList}
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
                          Raw Material Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        {/* <Tooltip title="Update">
                                                    <IconButton color="white" disabled={isReadWriteAccess} onClick={() => updateRMData(true)}>
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
                        <div id="rmTable" />

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
                          Showing 1 to {rawMatData.length} of{" "}
                          {rawMatData.length} entries
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
