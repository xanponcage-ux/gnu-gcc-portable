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
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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
import Today from "@mui/icons-material/Today";
import MultipleSelect from "components/Select/MultiSelect";
import MonthPicker from "components/DateTime/MonthPicker";
import SaveIcon from "@mui/icons-material/Save";


export default function TTSC012() {
  const [loading, setLoading] = useState(true);
  const [isRestricted, setRestricted] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  // const planTableRef = useRef(null);
  const [planData, setPlanData] = useState([]);
  const [planDataTable, setPlanDataTable] = useState([]);
  const [date, setDate] = useState(null);
  const [monthPickerKey, setMonthPickerKey] = useState(0);

  const [isReadWriteAccess,setIsReadWriteAccess]=useState(false);

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
      var pageName = "TTSC012";
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
      var url = "api/ttsc012/getPlant";
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
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {

      });
      setLoading(false);
    });
  }

  // page load
  useEffect(() => {
    fetchData();
  }, []);
  console.log("isRestricted", isRestricted);

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
    }
    clearDate();
    setPlanData([]);
  };

  const handleClearAll = () => {
    setSelectedPlant(null);
    clearDate();
    setPlanData([]);
  }

  const clearDate=()=>{
    setDate(null)
    setMonthPickerKey((k) => k + 1); // 🔥 force reset
  }
  //const precise = (v, d = 3) => Number(Math.round(v + "e" + d) + "e-" + d);
  const getPlanData = async () => {
    if (selectedPlant == undefined || selectedPlant?.value == '') {
      alertify.error('Please select Plant');
      return;
    }

    // ✅ MonthYear validation
    if (!date) {
      alertify.error("Please select Month");
      return;
    }

    // ✅ Convert date → YYYYMM
    const monthYear = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
    // ✅ Extra safety check
    if (!/^\d{6}$/.test(monthYear)) {
      alertify.error("Invalid Month selected");
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
        Plant: selectedPlant?.value || '',
        MonthYear: date? `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`: "",
      };
      var url = "api/ttsc012/getPlanData";
      axiosAPI.post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            let responsedata = response.data;
            setPlanData(responsedata);
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
  // Optional: right-align header & cells for numeric columns
  // const rightAlign = { hozAlign: "center", headerHozAlign: "center" };


  const planColumns = [

    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerHozAlign: "center",
      width: 50,
      headerSort: false,
      cellClick: function (e, cell) {
        cell.getRow().toggleSelect();
      },
    },
    {
      title: "Plant",
      field: "PLANT_CD",
      headerHozAlign: "center",
      hozAlign: "center",
      width: 90,
      tooltip: true,
    },
    {
      title: "Year-Month",
      field: "YEARMON",
      headerHozAlign: "center",
      hozAlign: "center",
      width: 110,
    },
    {
      title: "Category Code",
      field: "CATEGORY_CODE",
      headerHozAlign: "left",
      hozAlign: "left",
      minWidth: 180,
      tooltip: true,
    },
    {
      title: "Category Name",
      field: "CATEGORY_NAME",
      headerHozAlign: "left",
      hozAlign: "left",
      minWidth: 300,
      tooltip: true,
    },
    {
      title: "ABP Value",
      field: "ABP_VALUE",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 130,
      editor: "number",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    // {
    //   title: "ABP Frequency",
    //   field: "ABP_FREQUENCY",
    //   headerHozAlign: "center",
    //   hozAlign: "center",
    //   width: 140,
    // },
    {
      title: "OSP Value",
      field: "OSP_VALUE",
      headerHozAlign: "right",
      hozAlign: "right",
      width: 130,
      editor: "number",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    // {
    //   title: "OSP Frequency",
    //   field: "OSP_FREQUENCY",
    //   headerHozAlign: "center",
    //   hozAlign: "center",
    //   width: 140,
    // },
  ];

  useEffect(() => {
    setPlanDataTable(  new Tabulator("#PlanDtl", {
    data: planData,
    columns: planColumns,
    layout: "fitColumns",
    height: "450px",
    selectable: true,       // 🔴 important
  })
  )
  }, [planData]);

  const savePlanData = async () => {


    if (!selectedPlant || !selectedPlant?.value) {
      alertify.error("Please select Plant");
      return;
    }
   
    let selectedRows = planDataTable?.getSelectedData(); 
    console.log('selectedRows->', selectedRows);

    if (selectedRows.length<1) {
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
        Plant: selectedPlant.value,
        UpdatedBy: serverDetails.PersonalNo,
        Rows: selectedRows,
      };

      const url = "api/ttsc012/savePlanData"; // <-- replace if different
      const resp = await axiosAPI.post(url, payload, defaultOptions);
      console.log('resp->', resp);
      if (resp?.status === 200) {
        alertify.success(`Saved successfully (${resp.data.succCount} row(s))`);
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
    const fileName = "TTSC012_Plan_details.xlsx";
     planDataTable.download("xlsx", fileName, {
      sheetName: "Plan Details",
      groupHeader: true,
      columnGroups: false,
      rowGroups: true,          // ✅ shows group rows in Excel

    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Common" page="Plant‑wise Plan Entry" />
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
                        onClick={ handleClearAll}
                      >
                        <ClearAllIcon />
                      </IconButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>
              <MDBox px={1} pt={1} pb={2}>
                <Grid container spacing={1}>
                  <Grid item xs={2.5} >
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
                   <Grid item xs={2.5}>
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                     Date
                    </MDTypography>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                    <MonthPicker
                      key={monthPickerKey}
                      id="Date"
                      value={date ?? null}
                      onChange={(d) => setDate(d)}
                    />
                      </MDTypography>
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
                      Plan Deatails
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
                        onClick={() => savePlanData(true)}
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
