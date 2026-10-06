import React, { useEffect, useState, useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import Switch from "@mui/material/Switch";
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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// Data
import MDAlert from "components/MDAlert";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";

import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import TabIcon from "@mui/icons-material/Tab";
import Tooltip from "@mui/material/Tooltip";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { GetAuthorization } from "utils";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function LDSC001() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(false);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [selectedPlant, setSelectedPlant] = React.useState(null);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const [selectedProcLineData, setSelectedProcLineData] = useState([]);
  const [selectedProcPathData, setSelectedProcPathData] = useState([]);
  const [plant, setPlant] = useState([
    { label: "-Select", value: "" },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ]);
  const [selectedProcLineTable, setSelectedProcLineTable] = useState(null);
  const [selectedProcPathTable, setSelectedProcPathTable] = useState(null);
  const [allValues, setAllValues] = useState({
    plant: "",
    ym: "",
    order: "",
    item: "",
    prevMonth: false,
    openOrders: false,
  });

  
  const date = new Date();
  const formattedDate = date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-").replace("Sept", "Sep");
  const [scheduleConfFilter, setScheduleConfFilter] = useState({
    planDate: formattedDate,
  });
  

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      //page load functions here
      // getPlantList();
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }

  // Page Load
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (
      tabValue === 0 &&
      selectedProcLineData &&
      selectedProcLineData.length > 0
    ) {
      setSelectedProcLineTable(
        new Tabulator("#procLineTable", {
          maxHeight: 400,
          pagination: "local", //enable local pagination.
          paginationSize: 12,
          layout: "fitDataFill",
          data: selectedProcLineData,
          columns: procLineColumns,
        })
      );
    } else if (
      tabValue === 1 &&
      selectedProcPathData &&
      selectedProcPathData.length > 0
    ) {
      setSelectedProcPathTable(
        new Tabulator("#procPathTable", {
          // pagination: "local", //enable local pagination.
          // paginationSize: 12,
          layout: "fitColumns",
          data: selectedProcPathData,
          columns: procPathColumns,
        })
      );
    } 
      
    
  }, [
    tabValue,
    selectedProcLineData,
    selectedProcPathData,
   ]);

 

  const validateUser = async (token) => {
    try {
      var plant = "";
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
      var pageName = "LDSC001";

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

  //get Plant id
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
          resolve();
        });
    });
  };

  // Table Columns

  const procLineColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
    },
    {
      title: "Plant",
      field: "EPL_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Plant Name",
      field: "EPL_EPA_DESC",
      headerFilter: "input",
      width: 400,
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Process Line",
      field: "EPL_CD_PROCESS",
      headerFilter: "input",
      hozAlign: "center",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Process Line Description",
      field: "EPL_PROC_LINE_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    { "title": "Printer Id", "field": "EPL_ID_PRINTER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Process Sequence",
      field: "EPL_NO_PROC_SEQ",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
    },
    { "title": "Address", "field": "EPL_ADDRES", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Sap Interface Ind", "field": "EPL_SAP_INTERFACE_IND", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "REM1", "field": "EPL_REM1", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "REM2", "field": "EPL_REM2", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "REM3", "field": "EPL_REM3", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Cust Cd", "field": "EPL_CD_CUST", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Url", "field": "EPL_URL", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Server", "field": "EPL_SERVER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Activity Time", "field": "EPL_ACTIVITY_TIME", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Activity Flag", "field": "EPL_ACTIVITY_FLAG", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Consp Flag", "field": "EPL_CONSP_FLAT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Bussiness Unit", "field": "EPL_BUSINESS_UNIT", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Plng Flag", "field": "EPL_PLNG_FLAG", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Comp Cd", "field": "EPL_CD_COMP", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Activity Name", "field": "EPL_ACTIVITY_NM", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Thk Tol Flag", "field": "EPL_THK_TOL_FLAG", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Sr Comp Flag", "field": "EPL_SR_COMP_FLAG", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Active Plant FL", "field": "EPL_ACTIVE_PLANT_FL", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    { "title": "Busi Role", "field": "EPL_BUSI_ROLE", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Storage Location",
      field: "EPL_STOR_LOC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    { "title": "EPL_PRODUCTION_TYPE", "field": "EPL_PRODUCTION_TYPE", "headerFilter": "input", "headerFilterPlaceholder": "search..." }
  ];
  const procPathColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: 30,
    },
    
    {
      title: "Plant",
      field: "LPP_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Process Path ",
      field: "LPP_CD_PROC_PATH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Process Path No ",
      field: "LPP_NO_PROC_PATH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Process Path Desc",
      field: "LPP_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
   
    {
      title: "Product",
      field: "LPP_PRODUCT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Product Name",
      field: "LPP_PRODUCT_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width : 500
    },
    
    
   
   
  ];

  

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
    } else {
      setSelectedPlant([]);
    }

    // getCustDesc(value);
  };

  const getData = () => {
    if (!selectedPlant?.value) {
      alertify.error("Please select plant !!");
      setSelectedProcLineData([,]);
      setSelectedProcPathData([,]);
      
      return;
    }

    setLoading(true);
    var url;
    
    url = "api/LDSC001/getProdInqData";

    var data0 = {
      value: 0,
      plant: selectedPlant.value,
    };
    var data1 = {
      value: 1,
      plant: selectedPlant.value,
    };
   
   

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      setLoading(true);
      Promise.all([
        axiosAPI.post(url, data0, defaultOptions),
        axiosAPI.post(url, data1, defaultOptions),
        
      ])
        .then(([ProcLineData, ProcPathData]) => {
          if (ProcLineData) {
            if (ProcLineData.data[1].length != 0) {
              setSelectedProcLineData(ProcLineData.data[1]);
            } else {
              alertify.error("No Data Found");
              setSelectedProcLineData([,]);
            }
          }
          if (ProcPathData) {
            if (ProcPathData.data[1].length != 0) {
              setSelectedProcPathData(ProcPathData.data[1]);
            } else {
              alertify.error("No Data Found");
              setSelectedProcPathData([,]);
            }
          }
         
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const downloadExcelProcLineTableData = () => {
    if (selectedProcLineData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSC001_ProcLine " + ".xlsx";
    selectedProcLineTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelProcPathTableData = () => {
    if (selectedProcPathData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSC001_ProcPath " + ".xlsx";
    selectedProcPathTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };
 
  return (
    
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Common"
        page="Master screen for Process Line /Process Path "
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
            <Grid container spacing={4}>
             

              <Grid item xs={24}>
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
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={2} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Plant*{" "}
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          onChange={handlePlantChange}
                          value={selectedPlant}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                        >
                          {" "}
                          Submit{" "}
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              {/* create tabs */}
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                    indicatorColor="primary"
                    indicator={(props) => (
                      <div
                        style={{
                          backgroundColor: 'primary',
                          height: 3,
                          borderRadius: 3,
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          left: 0,
                          right: 0,
                        }}
                        />
                    )}
                    
                  >
                    <Tab label="Process Line Master" icon={<TabIcon />} />
                    <Tab label="Process Path Master" icon={<TabIcon />} />
                    
                  </Tabs>
                </AppBar>
              </Grid>
              {/* tabs controlled data */}
              <Grid item xs={12}>
                {tabValue == 0 && (
                  <>
                    <Card style={{ marginTop: "2rem" }}>
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
                              Proc Line Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadExcelProcLineTableData()}
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
                            <div id="procLineTable" />
                            
                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedProcLineData.length} of{" "}
                              {selectedProcLineData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
                {tabValue == 1 && (
                  <>
                    <Card style={{ marginTop: "2rem" }}>
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
                              Proc Path Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadExcelProcPathTableData()}
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
                            <div id="procPathTable" />
                            
                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedProcPathData.length} of{" "}
                              {selectedProcPathData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
                
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}

      
      
     
     