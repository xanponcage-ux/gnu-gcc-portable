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
import MDAlert from "@mui/material/Alert";
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

export default function LDLTS006() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [table, setTable] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [mBatch, setMBatch] = useState("");
  const [downMatl, setDownMatl] = useState([]);
  const [scrapMatl, setScrapMatl] = useState([]);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

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
      var pageName = "LDLTS006";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );
      console.log(authDetails);
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

  //use Effect to render display data
  useEffect(() => {
    if (tableData && tableData.length > 0) {
      setTable(
        new Tabulator("#table", {
          data: tableData,
          columns: tableCol,
          height: 380,
          layout: "fitDataFill",
          // selectable: 1,
          pagination: true,
          paginationSize: 10,
          paginationSizeSelector: [10, 30, 60, 80],
          paginationCounter: "rows",
        })
      );
    }
  }, [tableData, downMatl, scrapMatl]);

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setTableData([]);
    setTable(null);
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
        batchId: batchId ? batchId : "",
        mBatch: mBatch ? mBatch : "",
      };
      if (!data.plant) {
        alertify.error("Please select Plant ID");
        resolve();
        return;
      }
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDLTS006/getcoils";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found!");
              setTableData([,]);
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
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    console.log("Inside Save Data");
    var selectedRows = table.getSelectedRows();

    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("Please select row");
      return;
    }

    var selectedData = [];
    selectedRows.forEach(function (item) {
      let dec = item._row.data.DECISION;

      if (dec === "" || dec === null || dec === undefined) {
        alertify.error("Please select Decision");
        return;
      }

      let dMatl = item._row.data.DOWN_MATL;
      let sMatl = item._row.data.SCRAP_MATL;

      if (dec === "DOWNGRADE" && dMatl === "") {
        alertify.error("Downgrade Material is mandatory to DOWNGRADE");
        return;
      }
      if (dec === "SCRAP" && sMatl === "") {
        alertify.error("Scrap Material is mandatory to SCRAP");
        return;
      }

      selectedData.push({
        batchId: item._row.data.BATCH_ID,
        decision: dec ?? "",
        downMatl: dMatl ?? "",
        scrapMatl: sMatl ?? "",
      });
    });

    //Added to handle if scrap or downgrade matl is not selected even when row is selected
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
      var url = "api/LDLTS006/saveData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error(response?.error?.response.data?.name);
          } else {
            if (response.data.startsWith("Y-")) {
              alertify.success("Release  successfull");
              fetchTableData();
              setShowSaveMsgSuccess(true);
              setShowSaveMsgError(false);
              setSaveMsg(response?.data);
              handleClearAll(true);
            } else {
              fetchTableData();
              alertify.error(response?.data);
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
              setSaveMsg(response?.data);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const getDownMatl = (batchMatl) => {
    console.log("Inside down matl");
    setLoading(true);
    GetAuthorization().then((token) => {
      var data = {
        plant: selectedPlant ? selectedPlant.value : "",
        batchMatl: batchMatl ? batchMatl : "",
      };
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDLTS006/getDownMatl";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!");
            setLoading(false);
            return;
          } else {
            var rows = [];
            for (var i in res.data) {
              rows.push({
                key: res?.data?.[i]?.DOWN_MATL,
                value: res?.data?.[i]?.DOWN_MATL,
              });
            }
            console.log("rows: ", rows);
            setDownMatl(rows);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
          resolve();
        });
    });
  };

  const getScrapMatl = (batchMatl) => {
    console.log("Inside SCRAP matl");
    setLoading(true);
    GetAuthorization().then((token) => {
      var data = {
        plant: selectedPlant ? selectedPlant.value : "",
      };
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDLTS006/getScrapMatl";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            var rows = [];
            for (var i in res.data) {
              rows.push({
                key: res?.data?.[i]?.SCRAP_MATL,
                value: res?.data?.[i]?.SCRAP_MATL,
              });
            }
            console.log("rows: ", rows);
            setScrapMatl(rows);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
          // resolve();
        });
    });
  };

  function createReadOnlyInput(cell) {
    var editor = document.createElement("input");
    editor.readOnly = true;
    editor.style.padding = "3px";
    editor.style.width = "100%";
    editor.value = cell.getValue() || "";
    editor.addEventListener("blur", function () {
      success(editor.value);
    });
    return editor;
  }

  function createSelectEditor(options, cell, success) {
    console.log("Inside create");
    console.log("options:: ", options);
    console.log("cell: ", cell);
    var editor1 = document.createElement("select");
    options.forEach((item) => {
      var option = document.createElement("option");
      option.value = item.value;
      option.text = item.key;
      editor1.appendChild(option);
    });
    editor1.value = cell.getValue();
    editor1.style.padding = "3px";
    editor1.style.width = "100%";
    editor1.addEventListener("change", function () {
      success(editor1.value);
      // var row = cell.getRow();
      // row.update({ REMARKS: "" });
    });
    return editor1;
  }

  function updateCellBg(cell, color) {
    cell.getElement().style["background-color"] = color;
    cell.getElement().style["color"] =
      color === "#DA8EE7" ? "#FFFFFF" : "black";
    cell.getElement().innerHTML = cell.getValue();
  }

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
  title: "Decision",
  field: "DECISION",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  width: "150",
  // Remove the editor since we don't need manual selection
  // editor: "list",
  // editorParams: { ... },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    // Auto-set to PASS if empty
    if (!value || value === "") {
      cell.setValue("PASS");
      value = "PASS";
    }
    cell.getElement().style["background-color"] = "#90EE90"; // Light green for PASS
    cell.getElement().style["color"] = "#000000";
    return value;
  },
  // Remove cellEdited since no editing is needed
},

    // {
    //   title: "Downgrade Matl",
    //   field: "DOWN_MATL",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   width: "150",
    //   editor: function (cell, onRendered, success, cancel, editorParams) {
    //     const decision = cell.getRow().getData().DECISION;
    //     console.log("decision: ", decision);
    //     console.log("downMatl++ ", downMatl);
    //     var editor =
    //       decision === "DOWNGRADE"
    //         ? createSelectEditor(downMatl, cell, success)
    //         : createReadOnlyInput(cell);
    //     onRendered(() => editor.focus());
    //     return editor;
    //   },
    //   formatter: function (cell) {
    //     const decision = cell.getRow().getData().DECISION;
    //     cell.getElement().style["background-color"] =
    //       decision === "DOWNGRADE" ? "#DA8EE7" : "white";
    //     cell.getElement().style["color"] =
    //       decision === "DOWNGRADE" ? "#FFFFFF" : "black";
    //     return cell.getValue();
    //   },
    // },
    // {
    //   title: "Scrap Matl",
    //   field: "SCRAP_MATL",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   width: "150",
    //   editor: function (cell, onRendered, success, cancel, editorParams) {
    //     const decision = cell.getRow().getData().DECISION;
    //     console.log("decision: ", decision);
    //     console.log("scrapMatl++ ", scrapMatl);
    //     var editor =
    //       decision === "SCRAP"
    //         ? createSelectEditor(scrapMatl, cell, success)
    //         : createReadOnlyInput(cell);
    //     onRendered(() => editor.focus());
    //     return editor;
    //   },
    //   formatter: function (cell) {
    //     const decision = cell.getRow().getData().DECISION;
    //     cell.getElement().style["background-color"] =
    //       decision === "SCRAP" ? "#DA8EE7" : "white";
    //     cell.getElement().style["color"] =
    //       decision === "SCRAP" ? "#FFFFFF" : "black";
    //     return cell.getValue();
    //   },
    // },
    {
      title: "Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
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
      title: "Width",
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
      title: "Grade",
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
      title: "Tagged Batch",
      field: "TAGGED_BATCH",
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
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
    setTableData([,]);
    setTable(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Pipe Decision Screen(External)"
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
                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
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

                        <Grid item xs={2}>
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
                            id="batchId"
                            value={batchId}
                            onChange={(e) => {
                              setBatchId(
                                e.target.value.toUpperCase().slice(0, 10)
                              );
                              setTableData([,]);
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
                            Mother Batch
                          </MDTypography>
                          <MDInput
                            id="mBatch"
                            value={mBatch}
                            onChange={(e) => {
                              setMBatch(
                                e.target.value.toUpperCase().slice(0, 10)
                              );
                              setTableData([,]);
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
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
