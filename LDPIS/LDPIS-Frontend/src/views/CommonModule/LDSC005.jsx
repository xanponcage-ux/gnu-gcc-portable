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
import SummarizeIcon from "@mui/icons-material/Summarize";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SegmentIcon from "@mui/icons-material/Segment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { GetAuthorization } from "utils";
import "../../tabulatorCss.scss";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import DeleteIcon from "@mui/icons-material/Delete";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

export default function LDSC005() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [resultDataTable, setResultDataTable] = useState(null);
  const [allValues, setAllValues] = useState({
    batch_id: "",
  });

  const [codeTyp, setCodeTyp] = useState([]);
  const [selectedCodeTyp, setSelectedCodeTyp] = useState([]);
  const [codeVal, setCodeVal] = useState([]);
  const [selectedCodeval, setSelectedCodeVal] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleChange = (e) => {
    if (e.target.name == "order" && e.target.value.length > 10) {
      alertify.error("Order Size can not be greater than 10");
    } else {
      setAllValues({ ...allValues, [e.target.name]: e.target.value });
    }
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([getCodeTypeSelect(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }

  //page load
  useEffect(() => {
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
      var pageName = "LD01S002";

      var authDetails = await getScreenAuth(plant, userId, pageName);

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

  const getCodeTypeSelect = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
      };
      var url = "api/LDSC005/getCodetyp";
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
              obj.value = row[0];
              items.push(obj);
            });
            setCodeTyp(items);
            setSelectedCodeTyp(items[0]);
            Promise.all([getCodeValueSelect(items[0], accessToken)]).finally(
              () => {
                resolve();
              }
            );
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

  const getCodeValueSelect = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSC005/getCodeVal";
      let data = {
        cdvalue: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[0];
              items.push(obj);
            });
            setCodeVal(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  useEffect(() => {
    if (resultData && resultData.length > 0) {
      setResultDataTable(
        new Tabulator("#resulttable", {
          data: resultData,
          columns: resultColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [resultData]);

  const getData = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        cdtype: selectedCodeTyp ? selectedCodeTyp.value : "",
        cdval: selectedCodeval ? selectedCodeval.value : "",
      };
      var url = "api/LDSC005/getRecords";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data found");
              setResultData([,]);
            } else {
              setResultData(response.data[1]);
            }
          }
        })
        .catch((error) => {
          setProdInquiryData([]);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const addRow = () => {
    resultDataTable.addRow(
      {
        CD_TYPE: "",
        CD_VALUE: "",
        CD_DESC: "",
      },
      true
    );
  };

  const insertDta = () => {
    var selectedRows = resultDataTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });

      var url = "api/LDSC005/insertRecords";

      axiosAPI
        .post(url, newData, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.errorString == "successfully recorded !") {
              alertify.success(response.data.errorString);
            } else {
              alertify.error(response.data.errorString);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const updateDta = () => {
    var selectedRows = resultDataTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });
      var url = "api/LDSC005/updateRecords";

      axiosAPI
        .post(url, newData, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.errorString == "successfully recorded !") {
              alertify.success(response.data.errorString);
            } else {
              alertify.error(response.data.errorString);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const deleteDta = () => {
    var selectedRows = resultDataTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });
      var url = "api/LDSC005/deleteRecords";

      axiosAPI
        .post(url, newData, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.errorString == "successfully recorded !") {
              alertify.success(response.data.errorString);
            } else {
              alertify.error(response.data.errorString);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const resultColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Code Type",
      field: "CD_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Code Value",
      field: "CD_VALUE",
      headerFilter: "input",
      width: 200,
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Code Description",
      field: "CD_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
  ];

  const downloadExcelResultTable = () => {
    if (resultDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = resultDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSC004_Coil_Interface_Exception_report" + ".xlsx";

    resultDataTable.download("xlsx", fileName, {
      sheetName: "LDSM014",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setResultData([,]);
    setResultDataTable(null);
  };

  const handleCodeTypeChange = (value) => {
    setSelectedCodeVal([]);
    if (value) {
      setLoading(true);
      setSelectedCodeTyp(value);
      GetAuthorization().then((token) => {
        Promise.all([getCodeValueSelect(value, token.accessToken)]).finally(
          () => {
            setLoading(false);
          }
        );
      });
    }
  };

  const handleCodeValueChange = (value) => {
    if (value) {
      setSelectedCodeVal(value);
    }
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Common"
        page="Master Records Entry"
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
                      <Grid item xs={2} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Code Type *{" "}
                        </MDTypography>
                        <ReactSelect
                          id="codeTyp"
                          options={codeTyp}
                          onChange={handleCodeTypeChange}
                          value={selectedCodeTyp}
                        />
                      </Grid>

                      <Grid item xs={2} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Code Value{" "}
                        </MDTypography>
                        <ReactSelect
                          id="codeVal"
                          options={codeVal}
                          onChange={handleCodeValueChange}
                          value={selectedCodeval}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData()}
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
                          Master Records Entry
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Insert">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => addRow(true)}
                          >
                            <AddCircleOutlineIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Insert">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => insertDta(true)}
                          >
                            <InsertCommentIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => updateDta(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => deleteDta(true)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title="Download">
                                                    <IconButton
                                                        color="white"
                                                        onClick={() => downloadExcelResultTable()}
                                                    >
                                                        <DownloadForOfflineIcon />
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
                        <div id="resulttable" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {resultData.length} of{" "}
                          {resultData.length} entries
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
