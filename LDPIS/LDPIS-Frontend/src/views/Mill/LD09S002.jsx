import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { GetAuthorization } from "../../utils";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../tabulatorCss.scss";
import MDInput from "components/MDInput";

export default function LD09S002() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [table, setTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [pipeOptions, setPipeOptions] = useState([]);
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");

  useEffect(() => {
    let active = true;
    setPipeOptions([]);
    if (selectedPlant?.value) {
      GetAuthorization().then((token) => axiosAPI.post(
        "api/LD09S002/getPipeNoList", { plant: selectedPlant.value },
        { headers: { Authorization: "Bearer " + token.accessToken } }
      )).then((response) => {
        if (active) setPipeOptions(response.data);
      }).catch(() => { if (active) alertify.error("Could not load Pipe No list."); });
    }
    return () => { active = false; };
  }, [selectedPlant?.value]);
  const [mBatch, setMBatch] = useState("");
  const [thick, setThick] = useState("");
  const [odia, setOdia] = useState("");

  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        validateUser(token);
        //page load functions here
        getGroupPlantId(token.accessToken);
      });
    }
    fetchData();
  }, []);

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
      var pageName = "LD09S002";

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

  const getGroupPlantId = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
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
            setLoading(false);
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

            setLoading(false);
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  // Destroy the old grid when filters change, preventing stale selection saves.
  useEffect(() => {
    if (!tableData.length) {
      setTable(null);
      return;
    }
    const grid = new Tabulator("#table", {
      data: tableData, columns: tableCol, height: 380, layout: "fitDataFill",
    });
    setTable(grid);
    return () => grid.destroy();
  }, [tableData]);

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setBatchId("");
    setOrdNo("");
    setOrdItem("");
    setTableData([]);
  };

  const handlePipeNoChange = (value) => {
    setBatchId(value?.value || "");
    setOrdNo(String(value?.orderNo ?? ""));
    setOrdItem(String(value?.orderItem ?? ""));
    setTableData([]);
  };

  const handleOrderNoChange = (event) => {
    if (batchId) setOrdItem("");
    setOrdNo(event.target.value);
    setBatchId("");
    setTableData([]);
  };

  const handleOrderItemChange = (event) => {
    setOrdItem(event.target.value);
    setBatchId("");
    setTableData([]);
  };

  const fetchTableData = () => {
    console.log("Inside fetchTableData");
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getCoilData(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getCoilData = (accessToken) => {
    return new Promise((resolve) => {
      var data = {
        plant: selectedPlant ? selectedPlant.value : "",
        batchId: String(batchId || "").trim(),
        ordNo: batchId ? "" : ordNo.trim(),
        ordItem: batchId ? "" : ordItem.trim(),
        mBatch: mBatch ? mBatch : "",
        thick: thick ?? "",
        odia: odia ?? "",
      };
      if (!data.plant) {
        alertify.error("Please select Plant ID");
        resolve();
        return;
      }
      if (!data.batchId && (!data.ordNo || !data.ordItem)) {
        alertify.error("Please select Pipe No or enter both Order No and Order Item.");
        resolve();
        return;
      }
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LD09S002/getcoils";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found!");
              setTableData([]);
              return;
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

  const saveData = async () => {
    console.log("Inside Save Data");
    var selectedRows = table?.getSelectedRows() || [];

    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        BATCH_ID: item._row.data.BATCH_ID,
      });
    });

    //no row selected alert
    if (selectedData.length == 0) {
      alertify.error("No rows selected from Display Table");
      return;
    }
    var data = {
      selectedData: selectedData,
      plantCd: selectedPlant?.value,
    };
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD09S002/saveData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!-Insuffiecient Privilege");
            // console.log()
            return;
          } else {
            if (res?.data?.substr(0, 1) === "Y") {
              alertify.success(res?.data);
              fetchTableData();
              setLoading(false);
            } else {
              alertify.error(res?.data);
              setLoading(false);
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  const tableCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Prodn Date",
      field: "PROD_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch ID",
      field: "BATCH_ID",
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
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "ODIA",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "TDC",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Net Wt",
      field: "NET_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Cast No.",
      field: "CAST_NO",
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
      title: "Sample Tag",
      field: "SAMPLE_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Pass Proc",
      field: "PASS_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Proc",
      field: "PREV_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "Plan Proc",
      field: "PLAN_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Cd",
      field: "PROD_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "QLTY_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Gross Wt",
      field: "GROSS_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Cust Order",
      field: "CUST_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Cust Item",
      field: "CUST_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },

    {
      title: "Yard",
      field: "YARD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },

    {
      title: "Hold Flag.",
      field: "HOLD_FL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      visible: false,
    },
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
  ];

  const downloadTableExcel = () => {
    if (tableData.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Pipe Decision" + ".xlsx";
    table.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);
    setBatchId("");
    setMBatch("");
    setOrdNo("");
    setOrdItem("");
    setThick("");
    setOdia("");
    setTableData([]);
    setTable(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
              routes={routes}
              module="Mill"
              page="XX- Receive at Ex Coating"
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

                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={1.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Plant <span style={{ color: "red" }}>*</span>
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
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
                            Pipe No
                          </MDTypography>
                          <ReactSelect
                            id="batchId"
                            options={pipeOptions}
                            value={pipeOptions.find((option) => option.value === batchId) || null}
                            onChange={handlePipeNoChange}
                          />
                        </Grid>
                        <Grid item xs={1.5}>
                          <MDTypography fontWeight="regular" fontSize="small" variant="h6">Order No</MDTypography>
                          <MDInput name="ordNo" value={ordNo} onChange={handleOrderNoChange} />
                        </Grid>
                        <Grid item xs={1}>
                          <MDTypography fontWeight="regular" fontSize="small" variant="h6">Order Item</MDTypography>
                          <MDInput name="ordItem" value={ordItem} onChange={handleOrderItemChange} />
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
                            Mother Batch
                          </MDTypography>
                          <MDInput
                            id="mBatch"
                            value={mBatch}
                            onChange={(e) => {
                              setMBatch(
                                e.target.value.toUpperCase().slice(0, 10)
                              );
                              setTableData([]);
                            }}
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
                            Thick
                          </MDTypography>
                          <MDInput
                            id="mBatch"
                            value={thick}
                            onChange={(e) => {
                              setThick(
                                e.target.value.toUpperCase().slice(0, 10)
                              );
                              setTableData([]);
                            }}
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
                            Odia
                          </MDTypography>
                          <MDInput
                            id="mBatch"
                            value={odia}
                            onChange={(e) => {
                              setOdia(
                                e.target.value.toUpperCase().slice(0, 10)
                              );
                              setTableData([]);
                            }}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => fetchTableData(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
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
                          Batch Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Pass">
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
                            onClick={() => downloadTableExcel()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div id="table" />
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

