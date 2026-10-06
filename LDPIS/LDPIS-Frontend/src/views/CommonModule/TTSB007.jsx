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
import ExcelJS from "exceljs";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import MonthPicker from "components/DateTime/MonthPicker";
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
import { GetAuthorization } from "../../utils";
import "../../tabulatorCss.scss";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";

export default function TTSB007() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);
  const [resultData, setResultData] = useState([]);
  const [resultDataTable, setResultDataTable] = useState(null);
  const [allValues, setAllValues] = useState({
    batch_id: "",
  });

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [OnDateCoilReceiving, setgetOnDateCoilReceiving] = useState([]);
  const [OnDateWiderProduction, setgetOnDateWiderProduction] = useState([]);
  const [OnDateNarrowProduction, setgetOnDateNarrowProduction] = useState([]);
  const [OnDateTubeSchedule, setgetOnDateTubeSchedule] = useState([]);
  const [OnDateTubeProduction, setgetOnDateTubeProduction] = useState([]);
  const [OnDateCtlProduction, setgetOnDateCtlProduction] = useState([]);
  const [OnDatePacking, setgetOnDatePacking] = useState([]);
  const [OnDateDispatch, setgetOnDateDispatch] = useState([]);
  const [TillDateCoilReceiving, setgetTillDateCoilReceiving] = useState([]);
  const [TillDateWiderProduction, setgetTillDateWiderProduction] = useState([]);
  const [TillDateNarrowProduction, setgetTillDateNarrowProduction] = useState(
    []
  );
  const [TillDateTubeSchedule, setgetTillDateTubeSchedule] = useState([]);
  const [TillDateTubeProduction, setgetTillDateTubeProduction] = useState([]);
  const [TillDateCtlProduction, setgetTillDateCtlProduction] = useState([]);
  const [TillDatePacking, setgetTillDatePacking] = useState([]);
  const [TillDateDispatch, setgetTillDateDispatch] = useState([]);
  const [fromDtMerg, setFromDtMerg] = useState(null);

  const [tubeProdMonthlyReport, setgetTubeProdMonthlyReport] = useState([]);
  const [packingMonthlyReport, setgetPackingMonthlyReport] = useState([]);


  const [dataState, setDataState] = useState(null);
  const [chartState, setChartState] = useState(null);

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }

    GetAuthorization().then((token) => {
      validateUser(token);
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {

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
      var pageName = "LDSC006";

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

  const resultColumn = [
    {
      title: "Error Date",
      field: "ERROR_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Error1",
      field: "ERROR1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Error2",
      field: "ERROR2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Error3",
      field: "ERROR3",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadExcelResultTable = () => {
    //window.print();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = [
      { header: "", key: "name", width: 20 },
      { header: "As On Tonnage", key: "asontonnage", width: 25 },
      { header: "Till date (Monthly)", key: "tilldate", width: 10 },
    ];

    worksheet.addRow({
      name: "RM Receiving",
      asontonnage: OnDateCoilReceiving[0],
      tilldate: TillDateCoilReceiving[0],
    });
    worksheet.addRow({
      name: "Wider SLT Production",
      asontonnage: OnDateWiderProduction[0],
      tilldate: TillDateWiderProduction[0],
    });
    worksheet.addRow({
      name: "Narrow SLT Production",
      asontonnage: OnDateNarrowProduction[0],
      tilldate: TillDateNarrowProduction[0],
    });
    worksheet.addRow({
      name: "Tube Scheduling",
      asontonnage: OnDateTubeSchedule[0],
      tilldate: TillDateTubeSchedule[0],
    });
    worksheet.addRow({
      name: "Tube Production",
      asontonnage: OnDateTubeProduction[0],
      tilldate: TillDateTubeProduction[0],
    });
    worksheet.addRow({
      name: "CTL Production",
      asontonnage: OnDateCtlProduction[0],
      tilldate: TillDateCtlProduction[0],
    });
    worksheet.addRow({
      name: "Packing",
      asontonnage: OnDatePacking[0],
      tilldate: TillDatePacking[0],
    });
    worksheet.addRow({
      name: "Dispatch",
      asontonnage: OnDateDispatch[0],
      tilldate: TillDateDispatch[0],
    });
    worksheet.addRow({ name: "TC", asontonnage: 0, tilldate: 0 });

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      var date = new Date();
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "TTSB007 " + date.toString() + ".xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setResultData([,]);
    setResultDataTable(null);
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
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  const getAllapiDt = () => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var dt = new Date(fromDtMerg);
      var arr = [4, 5, 6, 7, 8, 9, 10, 11, 12];
      var yrt;
      var yrf;
      if (new Date(dt).getFullYear() == new Date().getFullYear() && arr.includes(new Date(dt).getMinutes + 1)) {
        yrt = "01-APR-" + new Date().getFullYear();
        yrf = "01-DEC-" + new Date().getFullYear();
      } else {
        var d = new Date().getFullYear() == (new Date(dt).getFullYear() - 1) ? new Date().getFullYear() : (new Date().getFullYear(dt) - 1);
        yrt = "01-APR-" + d;
        yrf = "01-DEC-" + new Date().getFullYear();
      }

      var fromDt = fromDtMerg ? fromDtMerg.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric", }).replace(/ /g, "-") : "";

      var datestr = fromDt.split('/');
      var day = datestr[0];
      var month = datestr[1];
      var year = datestr[2];

      var current_date = new Date();
      var current_month = current_date.getMonth() + 1;
      var curr_day = current_date.getDate();
      var curr_year = current_date.getFullYear();

      var firstdate = new Date(fromDtMerg.getFullYear(), fromDtMerg.getMonth(), 1);
      var lastdate = new Date(fromDtMerg.getFullYear(), fromDtMerg.getMonth() + 1, 0);
      var prevdate = new Date();
      prevdate.setDate(prevdate.getDate());

      var d;

      var timespan = {
        plant: selectedPlant?.value,
        firstDate: yrt,
        lastDate: yrf
      }

      if (current_month == month && curr_day >= day && curr_year == year) {
        d = {
          plant: selectedPlant?.value,
          firstDate: firstdate ? ("0" + firstdate.getDate()).slice(-2) + "-" + firstdate.toString().substr(4, 3) + "-" + firstdate.getFullYear() : "",
          lastDate: lastdate ? ("0" + lastdate.getDate()).slice(-2) + "-" + lastdate.toString().substr(4, 3) + "-" + lastdate.getFullYear() : "",
          prevDate: prevdate ? ("0" + prevdate.getDate()).slice(-2) + "-" + prevdate.toString().substr(4, 3) + "-" + prevdate.getFullYear() : "",
          chechCurMonth: true
        };
      } else {
        d = {
          plant: selectedPlant?.value,
          firstDate: firstdate ? ("0" + firstdate.getDate()).slice(-2) + "-" + firstdate.toString().substr(4, 3) + "-" + firstdate.getFullYear() : "",
          lastDate: lastdate ? ("0" + lastdate.getDate()).slice(-2) + "-" + lastdate.toString().substr(4, 3) + "-" + lastdate.getFullYear() : "",
          prevDate: prevdate ? ("0" + prevdate.getDate()).slice(-2) + "-" + prevdate.toString().substr(4, 3) + "-" + prevdate.getFullYear() : "",
          chechCurMonth: false
        };
      }


      setLoading(true);
      var apiurl = [
        axiosAPI.post("api/LDSC004/getOnDateCoilReceiving", d, defaultOptions),
        axiosAPI.post(
          "api/LDSC004/getOnDateWiderProduction",
          d,
          defaultOptions
        ),
        axiosAPI.post(
          "api/LDSC004/getOnDateNarrowProduction",
          d,
          defaultOptions
        ),
        axiosAPI.post("api/LDSC004/getOnDateTubeSchedule", d, defaultOptions),
        axiosAPI.post("api/LDSC004/getOnDateTubeProduction", d, defaultOptions),
        axiosAPI.post("api/LDSC004/getOnDateCtlProduction", d, defaultOptions),
        axiosAPI.post("api/LDSC004/getOnDatePacking", d, defaultOptions),
        axiosAPI.post("api/LDSC004/getOnDateDispatch", d, defaultOptions),
        axiosAPI.post(
          "api/LDSC004/getTillDateCoilReceiving",
          d,
          defaultOptions
        ),
        axiosAPI.post(
          "api/LDSC004/getTillDateWiderProduction",
          d,
          defaultOptions
        ),
        axiosAPI.post(
          "api/LDSC004/getTillDateNarrowProduction",
          d,
          defaultOptions
        ),
        axiosAPI.post("api/LDSC004/getTillDateTubeSchedule", d, defaultOptions),
        axiosAPI.post(
          "api/LDSC004/getTillDateTubeProduction",
          d,
          defaultOptions
        ),
        axiosAPI.post(
          "api/LDSC004/getTillDateCtlProduction",
          d,
          defaultOptions
        ),
        axiosAPI.post("api/LDSC004/getTillDatePacking", d, defaultOptions),
        axiosAPI.post("api/LDSC004/getTillDateDispatch", d, defaultOptions),

        axiosAPI.post("api/LDSC004/getTubeProdMonthlyReport", timespan, defaultOptions),
        axiosAPI.post("api/LDSC004/getPackingMonthlyReport", timespan, defaultOptions),
      ];

      Promise.all(apiurl)
        .then(
          ([
            getOnDateCoilReceiving,
            getOnDateWiderProduction,
            getOnDateNarrowProduction,
            getOnDateTubeSchedule,
            getOnDateTubeProduction,
            getOnDateCtlProduction,
            getOnDatePacking,
            getOnDateDispatch,
            getTillDateCoilReceiving,
            getTillDateWiderProduction,
            getTillDateNarrowProduction,
            getTillDateTubeSchedule,
            getTillDateTubeProduction,
            getTillDateCtlProduction,
            getTillDatePacking,
            getTillDateDispatch,
            getTubeProdMonthlyReport,
            getPackingMonthlyReport
          ]) => {
            setgetOnDateCoilReceiving(getOnDateCoilReceiving.data[0]);
            setgetOnDateWiderProduction(getOnDateWiderProduction.data[0]);
            setgetOnDateNarrowProduction(getOnDateNarrowProduction.data[0]);
            setgetOnDateTubeSchedule(getOnDateTubeSchedule.data[0]);
            setgetOnDateTubeProduction(getOnDateTubeProduction.data[0]);
            setgetOnDateCtlProduction(getOnDateCtlProduction.data[0]);
            setgetOnDatePacking(getOnDatePacking.data[0]);
            setgetOnDateDispatch(getOnDateDispatch.data[0]);
            setgetTillDateCoilReceiving(getTillDateCoilReceiving.data[0]);
            setgetTillDateWiderProduction(getTillDateWiderProduction.data[0]);
            setgetTillDateNarrowProduction(getTillDateNarrowProduction.data[0]);
            setgetTillDateTubeSchedule(getTillDateTubeSchedule.data[0]);
            setgetTillDateTubeProduction(getTillDateTubeProduction.data[0]);
            setgetTillDateCtlProduction(getTillDateCtlProduction.data[0]);
            setgetTillDatePacking(getTillDatePacking.data[0]);
            setgetTillDateDispatch(getTillDateDispatch.data[0]);
            setgetTubeProdMonthlyReport(getTubeProdMonthlyReport);
            setgetPackingMonthlyReport(getPackingMonthlyReport)

            let data2 = {
              // labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
              labels: getPackingMonthlyReport.data[1].map((o) => o.EPR_DT_PRODN),
              datasets: [
                {
                  label: "Tube Production",
                  data: getTubeProdMonthlyReport.data[1].map((o) => o.TB_PRD_TON),
                  fill: true,
                  backgroundColor: "rgba(75,192,192,0.2)",
                  borderColor: "rgba(75,192,192,1)"
                },
                {
                  label: "Packing",
                  data: getPackingMonthlyReport.data[1].map((o) => o.TOT_PACK_TON),
                  fill: false,
                  borderColor: "#742774"
                }
              ]
            };

            let Data = [
              {
                id: 1,
                year: d.firstDate + "On Date (Tube Production)",
                userGain: getOnDateTubeProduction.data[0][0],
                userLost: 823,
              },
              {
                id: 2,
                year: d.prevDate + "Till Date (Tube Production)",
                userGain: getTillDateTubeProduction.data[0][0],
                userLost: 345,
              },
              {
                id: 3,
                year: d.firstDate + "On Date (Packing)",
                userGain: getOnDatePacking.data[0][0],
                userLost: 555,
              },
              {
                id: 4,
                year: d.prevDate + "Till Date (Packing)",
                userGain: getTillDatePacking.data[0][0],
                userLost: 4555,
              },
            ];

            var chart = {
              data: {
                labels: Data.map((o) => o.year),
                datasets: [
                  {
                    label: "Qty (TON)",
                    backgroundColor: "rgba(0, 255, 0, 0.2)",
                    borderColor: "rgb(0, 255, 0)",
                    borderWidth: 1,
                    data: Data.map((o) => o.userGain),
                  },
                ],
              },
              options: {
                plugins: {
                  title: {
                    display: true,
                    text: "KPI Chart",
                  },
                },
              },
            };

            setChartState(data2);
            setLoading(false);
          }
        )
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
      setgetOnDateCoilReceiving([]);
      setgetOnDateWiderProduction([]);
      setgetOnDateNarrowProduction([]);
      setgetOnDateTubeSchedule([]);
      setgetOnDateTubeProduction([]);
      setgetOnDateCtlProduction([]);
      setgetOnDatePacking([]);
      setgetOnDateDispatch([]);
      setgetTillDateCoilReceiving([]);
      setgetTillDateWiderProduction([]);
      setgetTillDateNarrowProduction([]);
      setgetTillDateTubeSchedule([]);
      setgetTillDateTubeProduction([]);
      setgetTillDateCtlProduction([]);
      setgetTillDatePacking([]);
      setgetTillDateDispatch([]);
      setgetTubeProdMonthlyReport([]);
      setgetPackingMonthlyReport([]);
      setChartState(null);
    }
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Common" page="KPI Dashboard" />
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
                          Plant *
                        </MDTypography>
                        <ReactSelect
                          style={{
                            zIndex: 5,
                          }}
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
                          Month-Year
                        </MDTypography>

                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        ></MDTypography>

                        <MonthPicker
                          id="fromDtMerg"
                          value={fromDtMerg}
                          onChange={(date) => setFromDtMerg(date)}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getAllapiDt()}
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
                          KPI Report
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelResultTable()}
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
                      <Grid item xs={6}>
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 650 }}
                            aria-label="caption table"
                          >
                            <caption></caption>
                            <TableHead style={{ display: "contents" }}>
                              <TableRow>
                                <TableCell></TableCell>
                                <TableCell align="right">
                                  Current month On Date/ 1st Of month Qty (TON)
                                </TableCell>
                                <TableCell align="right">
                                  To Date Qty (TON)
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  RM Receiving
                                </TableCell>
                                <TableCell align="right">
                                  {OnDateCoilReceiving[0]
                                    ? OnDateCoilReceiving[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDateCoilReceiving[0]
                                    ? TillDateCoilReceiving[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  Wider SLT Production
                                </TableCell>
                                <TableCell align="right">
                                  {OnDateWiderProduction[0]
                                    ? OnDateWiderProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDateWiderProduction[0]
                                    ? TillDateWiderProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  Narrow SLT Production
                                </TableCell>
                                <TableCell align="right">
                                  {OnDateNarrowProduction[0]
                                    ? OnDateNarrowProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDateNarrowProduction[0]
                                    ? TillDateNarrowProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  Tube Scheduling
                                </TableCell>
                                <TableCell align="right">
                                  {OnDateTubeSchedule[0]
                                    ? OnDateTubeSchedule[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDateTubeSchedule[0]
                                    ? TillDateTubeSchedule[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  Tube Production
                                </TableCell>
                                <TableCell align="right">
                                  {OnDateTubeProduction[0]
                                    ? OnDateTubeProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDateTubeProduction[0]
                                    ? TillDateTubeProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  CTL Production
                                </TableCell>
                                <TableCell align="right">
                                  {OnDateCtlProduction[0]
                                    ? OnDateCtlProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDateCtlProduction[0]
                                    ? TillDateCtlProduction[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  Packing (Tube + CTL)
                                </TableCell>
                                <TableCell align="right">
                                  {OnDatePacking[0]
                                    ? OnDatePacking[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDatePacking[0]
                                    ? TillDatePacking[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow>
                              {/* <TableRow>
                                <TableCell component="th" scope="row">
                                  Dispatch
                                </TableCell>
                                <TableCell align="right">
                                  {OnDateDispatch[0]
                                    ? OnDateDispatch[0].toFixed(0)
                                    : 0}
                                </TableCell>
                                <TableCell align="right">
                                  {TillDateDispatch[0]
                                    ? TillDateDispatch[0].toFixed(0)
                                    : 0}
                                </TableCell>
                              </TableRow> */}

                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>
                      <Grid item xs={6}>
                        {/* dataState, chartState */}
                        {chartState && (
                          <Line data={chartState} />
                        )}
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
