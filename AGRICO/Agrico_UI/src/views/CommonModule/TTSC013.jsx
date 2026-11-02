import React, { useEffect, useState, useMemo, useRef } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ReactSelect from "components/Select/ReactSelect";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { Style } from "@mui/icons-material";
import DatePicker from "components/DateTime/DatePicker";
import SaveIcon from "@mui/icons-material/Save";


export default function TTSC013() {
  const [loading, setLoading] = useState(true);
  const [isRestricted, setRestricted] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  // const planTableRef = useRef(null);
  const [planData, setPlanData] = useState([]);
  const [planDataTable, setPlanDataTable] = useState([]);

  const [dateValueFrom, setDateValueFrom] = useState(null);
  const [dateValueTO, setDateValueTo] = useState(null);

  const [isReadWriteAccess, setIsReadWriteAccess] = useState(false);

  /** --------------- Authintication logic --------------- **/
  const getScreenAuth = (plantCd, userId, pageName, accessToken) => new Promise((resolve, reject) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    var url = "api/users/screenAuth";
    if (serverDetails.devMode == true) {
      // (userId = "198447"), (pageName = "TSMCPPF001");
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
        serverDetails.PersonalNo == ``
      ) {
        window.location.href = "#/signin";
      }
      var userId = serverDetails.PersonalNo;
      var pageName = "TTSC013";
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
          //   setRestricted(false); // Added temp to view screen
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW") {
            setIsReadWriteAccess(true);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
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
    }
    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
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
            // Promise.all([ getMatGrp(items[0], accessToken) ]).finally(() => {
            //     resolve();
            //   });
            resolve();
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      // Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {

      // });
      setLoading(false);
    });
  }

  // page load
  useEffect(() => {
    fetchData();
  }, []);

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
    }
    setDateValueFrom(null);
    setDateValueTo(null);
    setPlanData([]);
  };

  const handleClearAll = () => {
    setSelectedPlant(null);
    setDateValueFrom(null);
    setDateValueTo(null);
    setPlanData([]);
  }
  const getPlanData = async () => {
    // if (selectedPlant == undefined || selectedPlant?.value == '') {
    //   alertify.error('Please select Plant');
    //   return;
    // }
    var ProdDtFrm = document.getElementById("ProdDtFrm").value;
    var ProdDtTo = document.getElementById("ProdDtTo").value;

    if (ProdDtFrm == undefined || ProdDtFrm == '') {
      alertify.error('Please select from Date');
      return;
    }
    if (ProdDtTo == undefined || ProdDtTo == '') {
      alertify.error('Please select To Date');
      return;
    }

    if (new Date(ProdDtFrm) >= new Date(ProdDtTo)) {
      alertify.error('From Date cannot be greater than or equal To Date');
      return;
    }

    return new Promise(async (resolve, reject) => {
      setLoading(true);
      let token = await GetAuthorization()
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        // Plant: selectedPlant?.value || '',
        fromDate: ProdDtFrm || '',
        toDate: ProdDtTo || '',
      };
      var url = "api/ttsc013/getFgProdData";
      axiosAPI.post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            let responsedata = response.data;

            const formattedData = responsedata.map(item =>
              Object.fromEntries(
                Object.entries(item).map(([key, value]) => [
                  key, typeof value === "number" ? Number(value.toFixed(3)) : value
                ])
              )
            );
            setPlanData(formattedData);
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        }).finally(() => {
          setLoading(false);
        });
    });
  }

  // ✅ Helper function (best practice - reuse logic everywhere)
  function isYesterday(dateStr) {
    if (!dateStr) return false;
    const recordDate = new Date(dateStr);
    recordDate.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    return recordDate.getTime() === yesterday.getTime();
  }


  const planColumns = [

    {
      formatter: "rowSelection",
      // titleFormatter: "rowSelection",
      hozAlign: "center",
      headerHozAlign: "center",
      width: 50,
      headerSort: false,
      // ✅ only allow click if yesterdaych

      rowClick: function (e, row) {
        const table = row.getTable();
        const data = row.getData();

        if (isYesterday(data.MR_DATE)) {
          table.deselectRow();
          row.select();
        }
      }

    },
    {
      title: "Plant",
      field: "MR_PLANT",
      headerHozAlign: "center",
      hozAlign: "center",
      width: 100,
      tooltip: true,
    },
    {
      title: "Date",
      field: "MR_DATE",
      hozAlign: "center",
      headerHozAlign: "center",
      width: 120,
      formatter: function (cell) {
        const value = cell.getValue();
        if (!value) return "";
        const d = new Date(value);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1)
          .padStart(2, "0")}/${d.getFullYear()}`;
      },
    },

    {
      title: "Remarks",
      field: "MR_REMARKS",
      hozAlign: "left",
      headerHozAlign: "left",
      minWidth: 250,
      tooltip: true,
      // ✅ EDIT ONLY YESTERDAY
      editable: function (cell) {
        const data = cell.getRow().getData();
        return isYesterday(data.MR_DATE);
      },
      editor: function (cell, onRendered, success, cancel) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 100; // ✅ Max 100 chars
        input.value = cell.getValue() || "";

        onRendered(() => input.focus());
        // Restrict special characters
        input.addEventListener("input", (e) => {
          e.target.value = e.target.value.replace(/[^a-zA-Z0-9\s.,-]/g, "");
        });
        input.addEventListener("blur", () => success(input.value));
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter") success(input.value);
          if (e.key === "Escape") cancel();
        });

        return input;
      },
      // ✅ UI COLOR
      formatter: function (cell) {
        const value = cell.getValue();
        const data = cell.getRow().getData();
        const el = cell.getElement();
        if (isYesterday(data.MR_DATE)) {
          el.style.border = "2px solid green";// = "#8ee797";
          el.style.backgroundColor = "#d6f9d9";
          if (data.MR_PERCENTAGE < data.MR_MIN_PER) {
            el.style.border = "2px solid red";
            el.style.backgroundColor = "#ffebee";
          }
        }
        return value || "";
      },
    },
    {
      title: "ABP",
      field: "MR_ABP",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 120,
      editor: "number",
      editable: false, // ⬅️ makes the column read-only
    },
    {
      title: "OSP",
      field: "MR_OSP",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 120,
      // ✅ EDIT ONLY YESTERDAY
      // editable: function (cell) {
      //   const data = cell.getRow().getData();
      //   return isYesterday(data.MR_DATE);
      // },
      // editor: "number",
      // // ✅ UI COLOR
      // formatter: function (cell) {
      //   const value = cell.getValue();
      //   const data = cell.getRow().getData();
      //   const el = cell.getElement();
      //   if (isYesterday(data.MR_DATE)) {
      //     el.style.backgroundColor = "#DA8EE7";
      //     el.style.color = "#FFFFFF";
      //   }
      //   return value || "";
      // },
    },

    {
      title: "Production",
      field: "MR_PRODUCTION",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 140,
      editor: "number",
      editable: false, // ⬅️ makes the column read-only
    },
    {
      title: "MTD ABP",
      field: "MR_MTD_ABP",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 120,
      editable: false, // ⬅️ makes the column read-only
    },

    {
      title: "MTD OSP",
      field: "MR_MTD_OSP",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 120,
      editable: false, // ⬅️ makes the column read-only
    },

    {
      title: "MTD Production",
      field: "MR_MTD_PRODUCTION",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 150,
      editable: false, // ⬅️ makes the column read-only
    },

    {
      title: "Percentage",
      field: "MR_PERCENTAGE",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 130,
      editable: false, // ⬅️ makes the column read-only
      formatter: function (cell) {
        const val = cell.getValue();
        return val ? val + " %" : "";
      },
    },

    {
      title: "Min %",
      field: "MR_MIN_PER",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 100,
      editable: false, // ⬅️ makes the column read-only
    },


    {
      title: "Updated By",
      field: "MR_UPDATED_BY",
      headerHozAlign: "center",
      hozAlign: "center",
      width: 140,
      editable: false, // ⬅️ makes the column read-only
    },

    {
      title: "Updated Date",
      field: "MR_UPDATED_DATE",
      headerHozAlign: "center",
      hozAlign: "center",
      width: 160,
      formatter: function (cell) {
        const value = cell.getValue();
        if (!value) return "";
        return new Date(value).toLocaleString();
      },
      editable: false, // ⬅️ makes the column read-only
    },
    {
      title: "Created By",
      field: "MR_CREATED_BY",
      headerHozAlign: "center",
      hozAlign: "center",
      width: 140,
      editable: false, // ⬅️ makes the column read-only
    },

    {
      title: "Created Date",
      field: "MR_CREATED_DATE",
      headerHozAlign: "center",
      hozAlign: "center",
      width: 160,
      editable: false, // ⬅️ makes the column read-only
      formatter: function (cell) {
        const value = cell.getValue();
        if (!value) return "";
        return new Date(value).toLocaleString();
      },
    },

  ];

  useEffect(() => {
    setPlanDataTable(new Tabulator("#PlanDtl", {
      data: planData,
      columns: planColumns,
      layout: "fitColumns",
      height: "450px",
      selectable: true,       // 🔴 important
      // ✅ STEP 3 (GLOBAL CONTROL - MOST IMPORTANT)
      selectableCheck: function (row) {
        const data = row.getData();
        return isYesterday(data.MR_DATE);
      },
    })
    )
  }, [planData]);

  const updateRemarks = async () => {
    // if (!selectedPlant || !selectedPlant?.value) {
    //   alertify.error("Please select Plant");
    //   return;
    // }

    let selectedRows = planDataTable?.getSelectedData();
    console.log('selectedRows->', selectedRows);

    if (selectedRows.length < 1) {
      alertify.error("No rows selected to save changes");
      return;
    }

    if (!isReadWriteAccess) {
      alertify.error("You are not authorized to save changes");
      return;
    }
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: { Authorization: "Bearer " + token.accessToken },
      };
      // ✅ payload (adjust as backend expects)
      const payload = {
        // Plant: selectedPlant.value,
        // REMARKS: selectedRows[0].MR_REMARKS,
        // OSP: selectedRows[0].MR_OSP,
        selectedRows: selectedRows,
      };
      const url = "api/ttsc013/updateRemarks"; // <-- replace if different
      const resp = await axiosAPI.post(url, payload, defaultOptions);
      if (resp?.status === 200 && resp.data.message.includes('Y')) {
        alertify.success(resp.data.message + resp.data.count);
        getPlanData();
      } else {
        alertify.error("Save failed");
      }
    } catch (err) {
      alertify.error("Error saving data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPlanDataTable = () => {
    const rowCount = planDataTable.getDataCount();
    if (rowCount === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    const fileName = "TTSC013_Plan_details.xlsx";
    planDataTable.download("xlsx", fileName, {
      sheetName: "Plan Details",
      groupHeader: true,
      columnGroups: false,
      rowGroups: true,          // ✅ shows group rows in Excel

    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Common" page="Plant‑wise FG Prod Entry" />
      <Grid container direction="row" justifyContent="center" alignItems="center">
        {loading && <Preloader />}
      </Grid>
      {isRestricted && (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}
      {isRestricted == false && (
        <>
          <Grid item xs={12} pt={6}>
            <Card >
              <MDBox
                mx={2}
                mt={2}
                py={0}
                px={3}
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
                        onClick={handleClearAll}
                      >
                        <ClearAllIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox px={1} pt={1} pb={2}>
                <Grid container spacing={1}>
                  {/* <Grid item xs={2.5} >
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
                   */}
                  <Grid item xs={1}>
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                      Prod Date From
                    </MDTypography>
                    <DatePicker
                      id="ProdDtFrm"
                      value={dateValueFrom}
                      onChange={(date) => setDateValueFrom(date)}
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
                      Prod Date To{" "}
                    </MDTypography>
                    <DatePicker
                      id="ProdDtTo"
                      value={dateValueTO}
                      onChange={(date) => setDateValueTo(date)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <MDButton
                      style={{ marginTop: "1.5rem" }}
                      size="small"
                      color="info"
                      onClick={() => getPlanData()}
                    >
                      Submit
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
          <Grid mt={2}>
            <Card >
              <MDBox
                mx={2}
                mt={-3}
                py={0}
                px={3}
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
                      FG Prod Deatails
                    </MDTypography>
                  </Grid>
                  <Grid item xs={2}>
                    <Tooltip title="Download">
                      <IconButton
                        color="white"
                        onClick={() => downloadPlanDataTable(true)}
                      >
                        <DownloadForOfflineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Save" arrow>
                      <IconButton
                        color="white"
                        disabled={!isReadWriteAccess}
                        onClick={() => updateRemarks(true)}
                      >
                        <SaveIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox px={3} py={1.5}>
                <Grid>
                  <div id="PlanDtl" />
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </>
      )}
    </DashboardLayout>
  );
}
