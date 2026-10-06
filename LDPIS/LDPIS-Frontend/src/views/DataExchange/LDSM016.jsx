import React, { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ReactSelectCustom from "components/Select/ReactSelectCustom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import ReactMultiSelect from "components/Select/ReactMultiSelect";
import MonthPicker from "components/DateTime/MonthPicker";
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
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { GetAuthorization } from "utils";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DatePicker from "components/DateTime/DatePicker";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";

import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import Tooltip from "@mui/material/Tooltip";
import SaveIcon from "@mui/icons-material/Save";
import {
  getAccordionDetailsUtilityClass,
  getDialogActionsUtilityClass,
} from "@mui/material";
import { FlareSharp, ReplySharp } from "@mui/icons-material";
import { isValid } from "date-fns";

export default function LDSM016() {
  //initialization
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tableList, setTableList] = useState([]);
  const [inputSelection, setInputSelection] = useState({
    Plant: "",
    BatchId: "",
    CastNo: "",
  });

 

  const [selectedTable, setSelectedTable] = useState([]);
  const [columnList, setColumnList] = useState([]);
  const [columnTable, setColumnTable] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [displayTable, setDisplayTable] = useState([]);
  const [dispColumns, setDispColumns] = useState([]);
  const [primaryData, setPrimaryData] =useState([]);
  const [editColumns, setEditColumns] =useState([]);
  const [editcolumnTable, setEditColumnTable] = useState([]);
    //page load
  // useEffect(() => {
  //   async function fetchData() {
  //     if (serverDetails.devMode) {
  //       setRestricted(false);
  //     }
  //     if (initialLoad == false) {
  //       const response = await GetAuthorization();
  //       if (response) {
  //         validateUser();
  //         //page load functions here
  //         getTableList();
  //         setInitialLoad(true);
  //       }
  //     }
  //   }
  //   fetchData();
  // }, []);
  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true); 
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([getGroupPlantId(token.accessToken),getTableList(token.accessToken)]).finally(() => {
        setLoading(false);
      });
      //getTableList();
      // getProdCat();
    });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);
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
  //START Autorization Code
  //get auth token
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
  //validate user on page load
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
      var pageName = "LDSM016";
      console.log(plant);
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
  //get page authorization for user
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
  //END Autorization Code

  const handleTableChange = (value) => {
    if (value) {
      setSelectedTable(value);
      setColumnList([,]);
      // setInsertTableData([,]);
      // setScarpDt([,]);
    } else {
      setSelectedTable([]);
    }
  };
  //handle change event - input of Test Result
  const handleInputChange = (e) => {
    setInputSelection({
      ...inputSelection,
      [e.target.name]: e.target.value,
    });
  };

  //handle click event - Upload Test Result
  const handleUploadOnClick = () => {
    if (!inputSelection.Plant || inputSelection.Plant.length == 0) {
      alertify.error("Please select plant!");
      return;
    }
    if (!inputSelection.BatchId || inputSelection.BatchId.length == 0) {
      alertify.error("Please enter Batch No!");
      return;
    }
    UploadTestResultDetails(
      inputSelection.Plant.value,
      inputSelection.BatchId,
      inputSelection.CastNo,
      true
    );
  };

  //api call - get list authorised production stage
  const getTableList = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      setLoading(true);
      var url = "api/LDSM016/getTablesForEdit";
      axiosAPI
        .get(url, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            console.log(response.data);
            var items = [];
            response.data.map((row) => {
              console.log(row);
              var obj = new Object();
              obj.label = row.TABLES;
              obj.value = row.TABLES;
              items.push(obj);
            });
            console.log(items);
            setTableList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };
  // api to call - fetch coil id
 
  const getColumns = async (newToken = false) => {
    if (newToken) {
      const rsp = await GetAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    if (selectedTable.length == 0) {
      alertify.error("No Table selected");
      return;
    }


    var data = {
      table: selectedTable.value
    };

    setLoading(true);
    var url = "api/LDSM016/getColumnList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          if (response.data) {
            console.log(response.data);
            var rows = [];
            for (var i in response.data) {
              var rowdata = response.data[i];
              console.log(rowdata.COLUMN_NAME);
              rows.push({
                COLUMN_NAME: rowdata.COLUMN_NAME,
                COLUMNFILTER: ' '
              });
            }
            console.log(rows);
            setColumnList(rows);
            setDisplayTable([,]);
          } else {
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  const dColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      field: "COLUMN_NAME",
      title: "COLUMNS",
      hozAlign: "right",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.COLUMNS;
        row.update({
          COLUMNS: rl,
        });

      },
    },
    {
      field: "COLUMNFILTER",
      title: "Filter Condition",
      hozAlign: "left",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        var row = cell.getRow();
        var rl = cell._cell.row.data.COLUMNFILTER;
        row.update({
          COLUMNFILTER: rl,
        });

      },
    }
    ];   
  useEffect(() => {
    if (columnList && columnList.length > 0) {
      setColumnTable(
        new Tabulator("#columnTableDisp", {
          data:columnList,
          columns: dColumn,
          maxHeight: 350,
          layout: "fitDataStretch",
        })
      );
    }
  }, [columnList]);

  var editCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Column Name",
      field: "columnName",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },];
    useEffect(() => {
      if (editColumns && editColumns.length > 0) {
        // Transform editColumns to the format needed for the table data
        const tableData = editColumns.map(columnName => ({ columnName }));
        setEditColumnTable(
          new Tabulator("#editablecolumnTableDisp", {
            data:tableData,
            columns: editCol,
            maxHeight: 350,
            layout: "fitDataStretch",
          })
        );
      }
    }, [editColumns]);
  useEffect(() => {
    if (displayData && displayData.length > 0) {
      setDisplayTable(
        new Tabulator("#dataDisp", {
          data:displayData,
          columns: dispColumns,
          maxHeight: 500,
          layout: "fitDataStretch",
        })
      );
    }
  }, [displayData,dispColumns]);

  const Display = () => {
    if (selectedTable.value != undefined) {
      var selectedRows = columnTable.getSelectedRows();
      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });
      
      setLoading(true);

      var url = "";

      var data = {
        table: selectedTable.value ? selectedTable.value : "",
        dt: newData
      };
      // if (bUnit.label == "WIRE") {
      //     url = "api/LDSM005/CONFIRM_Wires";
      // } else {
      url = "api/LDSM016/getData";
      //}
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              alertify.error("No Data Found");
            } else {
              if (response.data.data.length == 0) {
                alertify.error("No Data Found");
                setDisplayData([]);
                setDispColumns([]); // Reset columns if no data
                setPrimaryData([]);
                setEditColumns([]);
                } else {
                  console.log(response.data.data);
                  //console.log(response.data.data);
                setDisplayData(response.data.data);
                setPrimaryData(response.data.primaryColumns);
                setEditColumns(response.data.editableColumns);
                
                // Dynamically set dispColumns based on the response
                // let firstRow = response.data.data[0];
                // let newColumns = Object.keys(firstRow).map((key) => ({
                // title:  key,  
                // field: key,
                // headerFilter: "input",
                // headerFilterPlaceholder: "search...",
                // }));
                const staticColumn = {
                  formatter: "rowSelection",
                  titleFormatter: "rowSelection",
                  hozAlign: "center",
                  download: false,
                  headerSort: false,
                  frozen: true,
                  };
                // Dynamically set dispColumns based on the response
                let firstRow = response.data.data[0];
                let newColumns = Object.keys(firstRow).map((key) => {
                  const isDecimal = (value) => {
                    // Check for null, non-numeric, or string type values
                    if (value === null || typeof value === 'string' || isNaN(value)) {
                    return false;
                    }
                    
                    // Check if the value is a valid decimal
                    return !Number.isInteger(parseFloat(value));
                    };
                    
                    const roundToThreeDecimals = (value) => {
                    // Ensure the value is parsed as a float and then rounded to three decimal places
                    return Number(parseFloat(value).toFixed(3));
                    };
                    
                    if (response.data.editableColumns.includes(key)) {
                    return {
                    field: key,
                    title: key,
                    hozAlign: "right",
                    headerFilter: "input",
                    headerFilterPlaceholder: "search...",
                    headerSort: false,
                    editor: "input",
                    formatter: function (cell, formatterParams) {
                    var value = cell.getValue();
                   
                    cell.getElement().style["background-color"] = "#DA8EE7";
                    cell.getElement().style["color"] = "#FFFFFF";
                    if(isDecimal(value))
                    return roundToThreeDecimals(value);
                  else return value;
                    },
                    cellEdited: (cell) => {
                    var row = cell.getRow();
                    var rl = cell._cell.row.data.COLUMNS;
                    row.update({
                    COLUMNS: rl,
                    });
                    },
                    };
                    } else {
                    return {
                    title: key,
                    field: key,
                    headerFilter: "input",
                    headerFilterPlaceholder: "search...",
                    formatter: (cell, formatterParams) => {
                    var value = cell.getValue();
                    if (isDecimal(value)) {
                    value = roundToThreeDecimals(value);
                    }
                    return value;
                    }
                    };
                    }
                    });
                // Add the static column before the dynamic columns
                newColumns = [staticColumn, ...newColumns];
                    console.log(newColumns);
                setDispColumns(newColumns); 
                }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Please Select Table!");
    }
  };
  //api call to update the record
  const updateData = () => {
    console.log("Hello");
    
    var selectedRows = displayTable.getSelectedRows();
    var selectedFirstTableData = [];
    selectedRows.forEach(function (item) {
    selectedFirstTableData.push(item._row.data);
    });

    var selectedEdit = editcolumnTable.getSelectedRows();
    var filterEditColumns = [];
    selectedEdit.forEach(function (item) {
      filterEditColumns.push(item._row.data);
    });
    //no row selected alert
    if (filterEditColumns.length == 0) {
      alertify.error("No Columns selected to Update");
      return;
    }
    if (selectedFirstTableData.length == 0) {
      alertify.error("No rows selected from Display Table");
      return;
    }

    if (selectedTable.length == 0) {
      alertify.error("No Table selected");
      return;
    }

    var data = {
      table: selectedTable.value,
      selectedFirstTableData: selectedFirstTableData,
      editableColumns: filterEditColumns,
      primaryData: primaryData
    };

    setLoading(true);

    var url = "api/LDSM016/updateRecord";

    // api call
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("Error saving Data");
          } else {
            alertify.success(`${response.data} row(s) saved!`);
            getData(token.accessToken);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };


  //api call - update Test Result details
  const UploadTestResultDetails = async (
    plantCd,
    batchId,
    castNo,
    newToken = false
  ) => {
    if (newToken) {
      const rsp = await GetAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    //getCoilId(plantCd,batchId);
    setSelectedCoilId("3420AS2070");

    setLoading(true);
    var url = "/api/LDSM016/uploadTestResultDetails";
    var data = {
      plantCd: plantCd,
      coilId: selectedCoilId,
      batchId: batchId,
      castNo: castNo,
    };

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.data.length > 0) {
          alertify.success(response.data[0]);
        } else {
          alertify.error("Error in uplaoding request!");
        }
      })
      .catch((e) => {
        alertify.error(
          "Error in uploading data, please try again! " + e.message
        );
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const downloadExcelcustomerTableData = () => {
    if (displayTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = displayTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var date = new Date();
    var fileName = "LDSM016 " + date.toString() + ".xlsx";
    displayTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Data Exchange"
        page="Update Record"
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
            <Grid container spacing={6} style={{ marginTop: "-1.5rem" }}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} style={{ marginTop: "1.5rem" }}>
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
                        <MDTypography variant="h6" color="white">
                          Update Data
                        </MDTypography>
                      </MDBox>
                      <MDBox px={3} py={1}>
                        <Grid container spacing={1}>
                          <Grid item xs={3} style={{ zIndex: 1 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Table
                            </MDTypography>
                            <ReactSelect
                              id="tableSelect"
                              options={tableList}
                              //isDisabled={tabValue == 1}
                              onChange={handleTableChange}
                              value={selectedTable}
                            />
                          </Grid>
                          
                          <Grid item xs={2}></Grid>
                          <Grid item xs={3}>
                            <MDButton
                              size="small"
                              color="info"
                              disabled={isReadWriteAccess}
                              style={{ marginTop: "1.5rem" }}
                              onClick={getColumns}
                            >
                              Search
                            </MDButton>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>
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
                          Columns and Filter
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                      <Tooltip title="Show Table Records" arrow>
                                  <IconButton
                                    color="white"
                                    onClick={Display}
                                  >
                                    <FormatListBulletedIcon />
                                  </IconButton>
                                </Tooltip>
                        {/* <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelcustomerTableData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                            </Tooltip>*/}
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
                      <Grid item xs={6} >
                        <div id="columnTableDisp"  />
                      </Grid>
                     <Grid item xs={6} >
                        <div id="editablecolumnTableDisp"  />
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
                          Records
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
                        <Tooltip title="Update Records" arrow>
                            <IconButton
                              id="updaterecord"
                              name="recordupdater"
                              color="white"
                              onClick={() => updateData()}
                            >
                              <SaveIcon />
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
                        <div id="dataDisp"  />
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
