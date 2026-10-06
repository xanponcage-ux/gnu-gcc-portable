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
import LDSM020PlanModal from "./Modals/LDSM020PlanModal";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";

export default function LDSM018() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);

  const [selectedFrmDtRls, setSelectedFrmDtRls] = useState(null);
  const [selectedToDtRls, setSelectedToDtRls] = useState(null);

  const [holdData, setHoldData] = useState([]);
  const [holdDataTable, setHoldDataTable] = useState(null);
  const [allValues, setAllValues] = useState({
    batch_id: "",
    mBatch: "",
  });

  const [processDetails, setProcessDetails] = React.useState([]);
  const [selectedProcess, setSelectProcess] = React.useState([]);

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
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
        setLoading(false);
      });
      //   getProdCat();
    });
  }

  //page load
  useEffect(() => {
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
      var pageName = "LDSM018";

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
            Promise.all([getProcDetails(items[0], accessToken)]).finally(() => {
              resolve();
            });
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getProcDetails = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM018/getProcDesc";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });
            setProcessDetails(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  useEffect(() => {
    if (holdData && holdData.length > 0) {
      setHoldDataTable(
        new Tabulator("#holdtable", {
          data: holdData,
          columns: holdColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [holdData]);

  //   const getProdCat = (accessToken) => {
  //     return new Promise((resolve) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + accessToken,
  //       },
  //     };

  //     setLoading(true);
  //     var url = "api/LDSM007/GetProdCat";
  //     axiosAPI
  //       .post(url, defaultOptions)
  //       .then((response) => {
  //         if (response.statusText != "" && response.statusText != "OK") {
  //           //reject(response.statusText);
  //         } else {
  //           var items = [];
  //           response.data.map((row) => {
  //             var obj = new Object();
  //             obj.label = row[0];
  //             obj.value = row[1];
  //             items.push(obj);
  //           });
  //           setProdCat(items);
  //         }
  //       })
  //       .finally((f) => {
  //         resolve()
  //       });
  //    })
  //  };

  const handlePlantChange = (value) => {
    //clear all data
    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setSelectedFrmDtRls(null);
    setSelectedToDtRls(null);
    setHoldData([,]);
    setHoldDataTable(null);
    //end clear all data

    setSelectedPlant(value);

    GetAuthorization().then((data) => {
      Promise.all([getProcDetails(value, data.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleProcessChange = (value) => {
    setSelectProcess(value);
    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setSelectedFrmDtRls(null);
    setSelectedToDtRls(null);
    setHoldData([,]);
    setHoldDataTable(null);
  };

  const getHoldData = () => {
    if (!selectedPlant?.value) {
      alertify.error("Please select Plant");
      return;
    }
    var url;

    var data = {
      plant: selectedPlant.value ? selectedPlant.value : "",
      process: selectedProcess ? selectedProcess.value : "",
      // frmDt: selectedFrmDt ? selectedFrmDt.toLocaleDateString('en-GB', {
      //   day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-') : "",
      // toDt: selectedToDt ? selectedToDt.toLocaleDateString('en-GB', {
      //   day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-') : ""

      frmDt: selectedFrmDt
        ? ("0" + selectedFrmDt.getDate()).slice(-2) +
          "-" +
          selectedFrmDt.toString().substr(4, 3) +
          "-" +
          selectedFrmDt.getFullYear()
        : "",
      toDt: selectedToDt
        ? ("0" + selectedToDt.getDate()).slice(-2) +
          "-" +
          selectedToDt.toString().substr(4, 3) +
          "-" +
          selectedToDt.getFullYear()
        : "",
        frmDtRls: selectedFrmDtRls
        ? ("0" + selectedFrmDtRls.getDate()).slice(-2) +
          "-" +
          selectedFrmDtRls.toString().substr(4, 3) +
          "-" +
          selectedFrmDtRls.getFullYear()
        : "",
      toDtRls: selectedToDtRls
        ? ("0" + selectedToDtRls.getDate()).slice(-2) +
          "-" +
          selectedToDtRls.toString().substr(4, 3) +
          "-" +
          selectedToDtRls.getFullYear()
        : "",
    };

    if (data.plant == "") {
      alertify.error("Please select Plant");
      return;
    }

    if (
      (data.frmDt == "" && data.toDt != "") ||
      (data.frmDt != "" && data.toDt == "")
    ) {
      alertify.error("Hold From Date and To Date both are required.");
      return;
    }
    if (selectedFrmDt?.getTime() > selectedToDt?.getTime()) {
      alertify.error("From Date can not be greater than To Date");
      return;
    }

    if (
      (data.frmDtRls == "" && data.toDtRls != "") ||
      (data.frmDtRls != "" && data.toDtRls == "")
    ) {
      alertify.error("Release From Date and To Date both are required.");
      return;
    }
    if (selectedFrmDtRls?.getTime() > selectedToDtRls?.getTime()) {
      alertify.error("From Date can not be greater than To Date");
      return;
    }

    data = { ...allValues, ...data };

    url = "api/LDSM018/getholddata";

    setLoading(true);
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
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data found");
              setHoldData([,]);
            } else {
              setHoldData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const holdColumn = [
    {
      title: "Hold Dt",
      field: "HOLD_DT",
      width: "170",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          const d = new Date(value);
                   return (
            ("0" + d.getDate()).slice(-2) +
            "-" +
            d.toString().substr(4, 3) +
            "-" +
            d.getFullYear() +
            " " +
            ("0" + d.getHours()).slice(-2) +
            ":" +
            ("0" + d.getMinutes()).slice(-2) +
            ":" +
            ("0" + d.getSeconds()).slice(-2)
          );
        }

        return value;
      },
    },
    {
      title: "Release Dt",
      field: "RELEASE_DT",
      width: "170",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          const d = new Date(value);
                   return (
            ("0" + d.getDate()).slice(-2) +
            "-" +
            d.toString().substr(4, 3) +
            "-" +
            d.getFullYear() +
            " " +
            ("0" + d.getHours()).slice(-2) +
            ":" +
            ("0" + d.getMinutes()).slice(-2) +
            ":" +
            ("0" + d.getSeconds()).slice(-2)
          );
        }

        return value;
      },
    },
    { title: "Batch", field: "BATCHID", width: "100",frozen: true },
    { title: "Status", field: "LOM_CD_STATUS", width: "80" },
    {
      title: "Batch Wt",
      field: "LOM_MS_GROSS_CAL",
      width: "100",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Thick",
      field: "LOM_SEC1",
      width: "100",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia/Width",
      field: "LOM_SEC2",
      width: "120",
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
      field: "LOM_LENGTH",
      width: "80",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { title: "Batch Wt UOM", field: "LOM_UOM", width: "150" },
    { title: "Hold Rsn", field: "HOLD_RSN", width: "100" },
    { title: "Hold Desc", field: "HOLD_DESC", width: "100" },
    { title: "Operation Remarks", field: "OP_REMARKS", width: "170" },
    { title: "Hold By", field: "HOLD_BY", width: "100" },
    { title: "Material No", field: "MATERIAL_NO", width: "170" },
    { title: "Material Desc", field: "MATERIAL_DESC", width: "200" },
    { title: "Status Desc", field: "CD_DESC", width: "200" },
    { title: "Customer Name", field: "ENC_CUST_NAME", width: "200" },
    { title: "Order", field: "LOM_ID_ORDER_CUS", width: "150" },
    { title: "Item", field: "LOM_ID_ORD_ITEM_CUS", width: "100" },
    { title: "Curr Proc", field: "LOM_CD_CURR_PROC", width: "100" },
    { title: "Next Proc", field: "LOM_CD_NEXT_PROC", width: "100" },
    { title: "TDC / Grade", field: "LOM_TDC_ACTL", width: "120" },
    { title: "Prod Code", field: "LOM_CD_PROD", width: "110" },
    { title: "Quality", field: "LOM_CD_QLTY_ACTL", width: "100" },
  ];

  const downloadExcelHoldTable = () => {
    if (holdDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = holdDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM018_Hold_Hold_Report" + ".xlsx";

    holdDataTable.download("xlsx", fileName, {
      sheetName: "LDSM018",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);

    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);

    setSelectedFrmDtRls(null);
    setSelectedToDtRls(null);

    setHoldData([,]);
    setHoldDataTable(null);
    setSelectProcess([]);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Reports" page="Hold Report" />
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
                      <Grid item xs={2.5} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Plant*
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          value={selectedPlant}
                          onChange={handlePlantChange}
                        />
                      </Grid>
                      {/* <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Process{" "}
                        </MDTypography>
                        <ReactSelect
                          id="process"
                          options={processDetails}
                          onChange={handleProcessChange}
                          value={selectedProcess}
                        />
                      </Grid> */}

                      <Grid item xs={1.25}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Batch ID
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="batch_id"
                          value={allValues.batch_id || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>

                      {/* <Grid item xs={1.25}>
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
                          type="text"
                          name="mBatch"
                          value={allValues.mBatch || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid> */}
                      <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          {" "}
                          Hold From Date{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedFrmDt}
                          onChange={(date) => setSelectedFrmDt(date)}
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
                          {" "}
                          Hold To Date{" "}
                        </MDTypography>
                        <DatePicker
                          id="toDt"
                          value={selectedToDt}
                          onChange={(date) => setSelectedToDt(date)}
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
                          {" "}
                          Relase From Date{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedFrmDtRls}
                          onChange={(date) => setSelectedFrmDtRls(date)}
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
                          {" "}
                          Release To Date{" "}
                        </MDTypography>
                        <DatePicker
                          id="toDtRls"
                          value={selectedToDtRls}
                          onChange={(date) => setSelectedToDtRls(date)}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getHoldData(true)}
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
                          Hold Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelHoldTable()}
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
                        <div id="holdtable" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {holdData.length} of{" "}
                          {holdData.length} entries
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
