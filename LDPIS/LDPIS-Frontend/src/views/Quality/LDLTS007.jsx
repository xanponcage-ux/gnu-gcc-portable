import React, { useEffect, useState, useRef, forwardRef } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// import TabIcon from "@mui/icons-material/Tab";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import SearchIcon from "@mui/icons-material/Search";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import { GetAuthorization } from "../../utils";
import "../../tabulatorCss.scss";
import MDAlert from "@mui/material/Alert";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
} from "@mui/material";

export default function LD01S006() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [pageAuth, setPageAuth] = useState(0);
  var customerTable = React.createRef();
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [parentBatch, setParentBatch] = useState("");
  const [mBatch, setMBatch] = useState("");
  const [tagBatch, setTagBatch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNewTagBatch, setSelectedNewTagBatch] = useState("");
  const [batchOptions, setBatchOptions] = useState([]);

  const [tagTable1Data, setTagTable1Data] = useState([]);
  const [tagTable1, setTagTable1] = useState([]);
  const [tagTable2Data, setTagTable2Data] = useState([]);
  const [tagTable2, setTagTable2] = useState([]);

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      setLoading(true);
      Promise.all([getPageAuth(token.accessToken)]).finally(() => {
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
      var pageName = "LDLTS007";

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

  const getPageAuth = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        pno: serverDetails.PersonalNo,
      };
      var url = "api/LDSM048/getauth";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            setPageAuth(response.data);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleSubmitBtn = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getTab1Data(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getTab1Data = (accessToken) => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    setLoading(false);
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      if (
        (!parentBatch || parentBatch === null) &&
        (!tagBatch || tagBatch === null)
      ) {
        alertify.error("Please fill Parent Batch");
        resolve();
        return;
      }
      refreshTable();
      var data = {
        parentBatch: parentBatch,
        mBatch: mBatch,
        tagBatch: tagBatch,
      };

      var url = "api/LDLTS007/getTab1Data";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setTagTable1Data([,]);
            } else {
              setTagTable1Data(response.data);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const saveData = async () => {
    var selRowsTable2 = tagTable2.getSelectedRows();

    let cntTotal = tagTable2Data?.length;
    let cntSelRows = selRowsTable2?.length;
    if (cntSelRows == 0) {
      alertify.error("Please select at least one row!");
      return;
    }

    var pipeIdNewTagBatchLs = [];

    let singleNewTagBatch;
    if (cntSelRows == 1) {
      singleNewTagBatch = selRowsTable2[0]?._row.data.BATCH_ID;
      tagTable2Data.forEach(function (item) {
        pipeIdNewTagBatchLs.push({
          pipeId: item?.BATCH_ID,
          newTagBatch: singleNewTagBatch,
        });
      });
      await finalSaveData(pipeIdNewTagBatchLs);
    } else if (cntTotal == cntSelRows) {
      selRowsTable2.forEach(function (item) {
        pipeIdNewTagBatchLs.push({
          pipeId: item._row.data.BATCH_ID,
          newTagBatch: item._row.data.BATCH_ID,
        });
      });
      await finalSaveData(pipeIdNewTagBatchLs);
    } else {
      const batches = selRowsTable2.map((item) => item._row.data.BATCH_ID);
      setBatchOptions(batches);
      setOpenDialog(true); // Open the dialog
      return;
    }
  };

  const finalSaveData = async (pipeIdNewTagBatchLs) => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    setLoading(true);
    var selRowsTable1 = tagTable1?.getSelectedRows()?.[0]?._row?.data;
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      let data = {
        pipeIdNewTagBatchLs: pipeIdNewTagBatchLs,
        oldTagBatch: selRowsTable1?.TAGGED_BATCH ?? "",
        user: serverDetails.PersonalNo,
      };

      var url = "api/LDLTS007/saveData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!");
            setLoading(false);
          } else {
            console.log("res?.data: ", res?.data);
            if (res?.data?.substr(0, 1) === "Y") {
              alertify.success(res?.data);
              handleSubmitBtn();
              setShowSaveMsgSuccess(true);
              setShowSaveMsgError(false);
              setSaveMsg(res?.data);
              setLoading(false);
              return;
            } else {
              alertify.error(res?.data);
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
              setSaveMsg(res?.data);
              setLoading(false);
              return;
            }
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  const handleBatchSelect = (batchId) => {
    setSelectedNewTagBatch(batchId);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = async () => {
    var pipeIdNewTagBatchLs = [];
    tagTable2Data.forEach(function (item) {
      pipeIdNewTagBatchLs.push({
        pipeId: item?.BATCH_ID,
        newTagBatch: batchOptions.includes(item?.BATCH_ID)
          ? item.BATCH_ID
          : selectedNewTagBatch,
      });
    });
    await finalSaveData(pipeIdNewTagBatchLs);
    setOpenDialog(false);
  };

  useEffect(() => {
    if (tabValue == 0) {
      if (tagTable1Data && tagTable1Data.length > 0) {
        let varTable = new Tabulator("#tagTable1", {
          data: tagTable1Data,
          columns: sampleTagCol,
          height: 400,
          layout: "fitDataFill",
          selectable: 1,
        });
        varTable.on("rowSelected", function (row) {
          const data = row.getData();
          let tagBatchId = data?.TAGGED_BATCH;
          fetchTagData(tagBatchId);
        });
        varTable.on("rowDeselected", function (row) {
          setTagTable2(null);
          setTagTable2Data([,]);
        });
        setTagTable1(varTable);
      }
    }
  }, [tagTable1Data, tabValue]);

  useEffect(() => {
    if (tabValue == 0) {
      if (tagTable2Data && tagTable2Data.length > 0) {
        setTagTable2(
          new Tabulator("#tagTable", {
            data: tagTable2Data,
            columns: TagCol,
            height: 400,
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [tagTable2Data, tabValue]);

  const fetchTagData = async (batchId) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      return new Promise((resolve) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };

        var data = {
          batchId: batchId,
        };

        var url = "api/LDLTS007/fetchTagData";

        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              alertify.error("No Data Found");
            } else {
              if (response.data.length == 0) {
                alertify.error("No Data Found");
                setTagTable2Data([,]);
              } else {
                setTagTable2Data(response.data);
              }
            }
          })
          .finally((f) => {
            resolve();
            setLoading(false);
          });
      });
    });
  };

  const sampleTagCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Batch ID",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Tagged Batch ID",
      field: "TAGGED_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "S Tag",
      field: "SAMPL_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Thick",
      field: "THK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
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
      title: "Create Dt",
      field: "CREATION_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const TagCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Batch ID of Tagged Batch",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Create Dt",
      field: "CREATION_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
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
      title: "Tagged Batch ID",
      field: "TAGGED_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      visible: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "S Tag",
      field: "SAMPL_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
  ];

  const downloadExcelPalletTableData = () => {
    var date = new Date();
    var fileName = "Sample Tag Re-Tag Data " + date.toString() + ".xlsx";
    tagTable2.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = () => {
    refreshTable();
    setMBatch("");
    setParentBatch("");
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
  };

  const refreshTable = () => {
    setTagTable2(null);
    setTagTable2Data([,]);
    setTagTable1(null);
    setTagTable1Data([,]);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Quality" page="Bare Re Tagging" />
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
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Select a Tagged Batch ID</DialogTitle>
            <div>
              {batchOptions.map((batchId) => (
                <div key={batchId}>
                  <Checkbox
                    checked={selectedNewTagBatch === batchId}
                    onChange={() => handleBatchSelect(batchId)}
                  />
                  {batchId}
                </div>
              ))}
            </div>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleDialogConfirm} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Sample Tag Re-Tag" value={0} />
                    <Tab label="Flattening Tag Re-Tag" value={1} />
                  </Tabs>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                {tabValue == 0 && (
                  <>
                    <MDBox pt={6} pb={3} py={1}>
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
                                  onClick={() => handleClearAll(true)}
                                >
                                  <ClearAllIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </MDBox>

                        <MDBox px={3} py={3}>
                          <Grid container spacing={2}>
                            <Grid item xs={2}>
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
                                id="mBatch"
                                value={mBatch}
                                onChange={(e) => {
                                  setMBatch(e.target.value);
                                  refreshTable();
                                }}
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
                                Parent Batch*
                              </MDTypography>
                              <MDInput
                                id="pBatch"
                                value={parentBatch}
                                onChange={(e) => {
                                  setParentBatch(e.target.value);
                                  refreshTable();
                                }}
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
                                Tag Batch*
                              </MDTypography>
                              <MDInput
                                id="tagBatch"
                                value={tagBatch}
                                onChange={(e) => {
                                  setTagBatch(e.target.value);
                                  refreshTable();
                                }}
                              />
                            </Grid>

                            <Grid item xs={1}>
                              <MDButton
                                style={{ marginTop: "1.5rem" }}
                                size="small"
                                color="info"
                                onClick={() => handleSubmitBtn(true)}
                              >
                                Submit
                              </MDButton>
                            </Grid>
                          </Grid>
                        </MDBox>
                      </Card>
                      <Grid margin={"2rem"}></Grid>
                      <Grid container spacing={4}>
                        <Grid item xs={8}>
                          <Card>
                            <MDBox
                              mx={2}
                              mt={-3}
                              py={1}
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
                                    Original Tag Info
                                  </MDTypography>
                                </Grid>
                              </Grid>
                            </MDBox>

                            <MDBox px={3} py={2}>
                              <Grid item xs={12}>
                                <div id="tagTable1" />

                                <p
                                  color="black"
                                  style={{
                                    color: "black",
                                    paddingLeft: "1rem",
                                    marginTop: "-1rem",
                                  }}
                                >
                                  <br />
                                  Showing 1 to {tagTable1Data.length} of{" "}
                                  {tagTable1Data.length} entries
                                </p>
                              </Grid>
                            </MDBox>
                          </Card>
                        </Grid>

                        <Grid item xs={4}>
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
                                <Grid item xs={5}>
                                  <MDTypography variant="h6" color="white">
                                    Modification Window
                                  </MDTypography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={3}>
                                  <Tooltip title="Save">
                                    <IconButton
                                      color="white"
                                      disabled={isReadWriteAccess}
                                      onClick={() => saveData(true)}
                                    >
                                      <SaveIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Download">
                                    <IconButton
                                      color="white"
                                      onClick={() =>
                                        downloadExcelPalletTableData()
                                      }
                                    >
                                      <DownloadForOfflineIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Grid>
                              </Grid>
                            </MDBox>

                            <MDBox px={3} py={2}>
                              <Grid item xs={12}>
                                <div id="tagTable" />

                                <p
                                  color="black"
                                  style={{
                                    color: "black",
                                    paddingLeft: "1rem",
                                    marginTop: "-1rem",
                                  }}
                                >
                                  <br />
                                  Showing 1 to {tagTable2Data.length} of{" "}
                                  {tagTable2Data.length} entries
                                </p>
                              </Grid>
                            </MDBox>
                          </Card>
                        </Grid>
                      </Grid>
                    </MDBox>
                    <Grid margin={"1rem"}></Grid>
                    {showSaveMsgError && (
                      <Grid item xs={12}>
                        <MDAlert
                          color="error"
                          severity="error"
                          variant="filled"
                          onClose={() => {
                            setShowSaveMsgError(false);
                          }}
                        >
                          <MDTypography variant="body2" color="white">
                            <MDTypography
                              variant="body2"
                              fontWeight="medium"
                              color="white"
                            >
                              {saveMsg}
                            </MDTypography>
                          </MDTypography>
                        </MDAlert>
                      </Grid>
                    )}
                    {showSaveMsgSuccess && (
                      <Grid item xs={12}>
                        <MDAlert
                          color="success"
                          variant="filled"
                          onClose={() => {
                            setShowSaveMsgSuccess(false);
                            if (tabValue == 0) {
                              setInsertTableData([]);
                            }
                          }}
                        >
                          <MDTypography variant="body2" color="white">
                            <MDTypography
                              variant="body2"
                              fontWeight="medium"
                              color="white"
                              fontSize="lg"
                              textTransform="capitalize"
                            >
                              {saveMsg}
                            </MDTypography>
                          </MDTypography>
                        </MDAlert>
                      </Grid>
                    )}
                  </>
                )}

                {tabValue == 1 && <></>}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
