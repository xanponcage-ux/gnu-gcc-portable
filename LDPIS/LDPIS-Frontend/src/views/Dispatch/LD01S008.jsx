import MDTypography from "components/MDTypography";
import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
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

export default function LD01S008() {
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
  const [pageAuth, setPageAuth] = useState(0);

  var customerTable = React.createRef();
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const statusOp = [
    { value: "WB", label: "WB", id: 1 },
    { value: "WF", label: "WF", id: 2 } // New option added
  ];

  const [selectedStatus, setSelectedStatus] = useState(statusOp[0]);

  const [selectedProdType, setSelectedProdType] = useState("");
  const [tableData, setTableData] = useState([]);
  const [table, setTable] = useState([]);



  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      setLoading(true);
      Promise.all([
        getGroupPlantId(token.accessToken),
        getPageAuth(token.accessToken),
      ]).finally(() => {
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
      var pageName = "LD01S006";

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
            serverDetails.Plant = items[0].value;
            setSelectedPlant(items[0]);
            resolve();
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  const handlePlantChange = (e) => {
    setSelectedPlant(e);
    setTableData([,]);
    setTable(null);
  };

  const handleSubmitBtn = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getBatchDetails(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getBatchDetails = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      if (!selectedPlant || selectedPlant === null) {
        alertify.error("Please select plant");
        resolve();
        return;
      }

      if (!selectedStatus || selectedStatus === null) {
        alertify.error("Please select Status");
        resolve();
        return;
      }

      var data = {
        plant: selectedPlant?.value,
        status: selectedStatus?.value,
        prodType: selectedProdType?.value,
      };

      var url = "api/LD01S008/getBatchDetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setTableData([,]);
            } else {
              setTableData(response.data);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  // const sendBtn = async () => {
  //   console.log("Inside Save Data");
  //   var selectedRows = table.getSelectedRows();

  //   var selectedData = [];
  //   selectedRows.forEach(function (item) {
  //     selectedData.push({
  //       batchId: item._row.data.ID_BATCH,
  //       status: item._row.data.STATUS,
  //     });
  //   });

  //   //no row selected alert
  //   if (selectedData.length == 0) {
  //     alertify.error("No rows selected from Display Table");
  //     return;
  //   }

  //   var data = {
  //     selectedData: selectedData,
  //     usr: serverDetails?.PersonalNo,
  //   };
  //   setLoading(true);
  //   GetAuthorization().then((token) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + token.accessToken,
  //       },
  //     };
  //     var url = "api/LD01S008/updateStatusBtn";
  //     axiosAPI
  //       .post(url, data, defaultOptions)
  //       .then((res) => {
  //         if (res.statusText != "" && res.statusText != "OK") {
  //           alertify.error("Error!");
  //           return;
  //         } else {
  //           console.log("res?.data: ", res?.data);
  //           console.log(res?.data?.length);
  //           // setTableData([,]);
  //           setLoading(false);
  //           handleSubmitBtn();
  //           if (res?.data?.pass?.length > 0) {
  //             alertify.success("Sent Successfully!");
  //             return;
  //           }
  //           if (res?.data?.fail?.length > 0) {
  //             alertify.error(
  //               "Request failed for batch: " + `${res?.data?.fail}`
  //             );
  //             return;
  //           }
  //         }
  //       })
  //       .catch(() => {
  //         setLoading(false);
  //       });
  //   });
  // };

  const sendBtn = async () => {
    var selectedRows = table.getSelectedRows();
// debugger
    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("Please select row");
      return;
    }

    var selectedData = [];
    selectedRows.forEach(function (item) {
      let batchId = item._row.data.ID_BATCH;
      let status = item._row.data.STATUS;

      selectedData.push({
        batchId: item._row.data.ID_BATCH,
        status: item._row.data.STATUS,
      });
    });

    if (selectedData.length == 0) {
      return;
    }

    var data = {
      selectedData: selectedData,
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD01S008/updateStatusBtn";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
             alertify.error(res?.data?.finRes);
             setLoading(false);
            return;
          } else {
            setLoading(false);
            handleSubmitBtn();
            if (res?.data?.finRes?.substr(0, 1) === "Y") {
              alertify.success(res?.data?.finRes);
              return;
            }
            // if (res?.data?.fail?.length > 0) {
            //   alertify.error(
            //     "Request failed for batch: " + `${res?.data?.fail}`
            //   );
            // }
            alertify.error(res?.data?.finRes);
            // alertify.error(res?.data?.finRes + ` ${res?.data?.fail}`);

            return;
          }
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setTable(
        new Tabulator("#table", {
          data: tableData,
          columns: tableCol,
          height: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [tableData]);

  const tableCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
      //   width: "2%",
    },
    {
      title: "Creation Date",
      field: "CREATION_TS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch ID",
      field: "ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mat no",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast No.",
      field: "CAST_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "ORDER_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt",
      field: "PIECE_ACTL",
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
      title: "Prev Proc",
      field: "PREV_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Curr Proc",
      field: "CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Planned proc",
      field: "PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Aim",
      field: "QLTY_AIM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Yard",
      field: "YARD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hold Flag",
      field: "FL_HOLD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Gross Wt",
      field: "GROSS_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Gross Wt",
      field: "GROSS_CAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },

    {
      title: "Piece cal",
      field: "PIECE_CAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Shift code",
      field: "SHIFT_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Parent Batch",
      field: "PAR_COIL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "FIRST_PAR_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed Proc",
      field: "PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Coil create ts",
      field: "COIL_CREATE_TS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Rec create ts",
      field: "REC_CREATE_TS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "TDC",
      field: "TDC_AIM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Tdc actl",
      field: "TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Oil type",
      field: "OIL_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "No pieces",
      field: "NO_PIECES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "EPA_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Pack code",
      field: "PACK_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Merge batch",
      field: "MERGE_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Mill no",
      field: "MILL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Prod Type",
      field: "PROD_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadExcelTableData = () => {
    var date = new Date();
    var fileName = "Table Data " + date.toString() + ".xlsx";
    table.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = () => {
    setSelectedPlant("");
    setTableData([,]);
    setTable(null);
    setSelectedStatus("");
    setSelectedProdType("");
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Dispatch"
        page="FG Enquiry & Decision"
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
                <>
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
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
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
                            Status*
                          </MDTypography>
                          <ReactSelect
                            id="status"
                            options={statusOp}
                            value={selectedStatus}
                            onChange={(e) => {
                              setSelectedStatus(e);
                              setTableData([,]);
                              setTable(null);
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
                            Data
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Send to FG Rework">
                            <IconButton
                              color="white"
                              disabled={isReadWriteAccess}
                              onClick={() => sendBtn(true)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelTableData()}
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
                          <div id="table" />

                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            <br />
                            Showing 1 to {tableData.length} of{" "}
                            {tableData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>

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
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
