import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components
import { useReactToPrint } from 'react-to-print';
// import html2canvas from "html2canvas";

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
import "chartjs-plugin-datalabels";
// import Issues from "../components/Issues";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);
import { add } from 'date-fns'


export default function LDSC010() {
    const [initialLoad, setInitialLoad] = useState(false);
    const [loading, setLoading] = React.useState(false);
    const [isAdmin, setAdmin] = React.useState(false);
    const [isRestricted, setRestricted] = React.useState(true);
    const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
    const [tubesDataTable, setTubesDataTable] = useState(null);
    const [pCat, setProdCat] = useState([]);
    const [plant, setPlant] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState([]);
    const [matGrp, setMatGrp] = React.useState([]);
    const [selectedMatGrp, setSelectedMatGrp] = React.useState([]);
    const [selectedFrmDt, setSelectedFrmDt] = useState(null);
    const [selectedToDt, setSelectedToDt] = useState(null);
    const [resultData, setResultData] = useState([]);
    const [resultDataTable, setResultDataTable] = useState(null);
    const [allValues, setAllValues] = useState({
        batch_id: "",
    });

    const [tabValue, setTabValue] = useState(0);
    const handleSetTabValue = (event, newValue) => setTabValue(newValue);

    const [RmReceivedOnDate, setRmReceivedOnDate] = useState([]);
    const [RmReceivedToDate, setRmReceivedToDate] = useState([]);
    const [AllotmentOnDate, setAllotmentOnDate] = useState([]);
    const [AllotmentToDate, setAllotmentToDate] = useState([]);
    const [TubeSchedulingOnDate, setTubeSchedulingOnDate] = useState([]);
    const [TubeSchedulingToDate, setTubeSchedulingToDate] = useState([]);
    const [TubeProductionOnDate, setTubeProductionOnDate] = useState([]);
    const [TubeProductionToDate, setTubeProductionToDate] = useState([]);
    const [PackingConfirmationOnDate, setPackingConfirmationOnDate] = useState([]);
    const [PackingConfirmationToDate, setgetPackingConfirmationToDate] = useState([]);

    const [InventorySumRm, setInventorySumRm] = useState([]);
    const [InventorySumWip, setInventorySumWip] = useState([]);
    const [InventorySumPendingUd, setInventorySumPendingUd] = useState([]);
    const [InventorySumFG, setInventorySumFG] = useState([]);

    const [StageWiseInventoryRm, setStageWiseInventoryRm] = useState([]);
    const [StageWiseInventoryPendingUd, setStageWiseInventoryPendingUd] = useState([]);
    const [StageWiseInventoryAnn, setStageWiseInventoryAnn] = useState([]);
    const [StageWiseInventoryColdDraw, setStageWiseInventoryColdDraw] = useState([]);
    const [StageWiseInventoryStp, setStageWiseInventoryStp] = useState([]);
    const [StageWiseInventoryCtl, setStageWiseInventoryCtl] = useState([]);
    const [StageWiseInventoryHydra, setStageWiseInventoryHydra] = useState([]);
    const [StageWiseInventoryEct, setStageWiseInventoryEct] = useState([]);
    const [StageWiseInventoryFG, setStageWiseInventoryFG] = useState([]);
    const [StageWiseInventoryFinalUd, setStageWiseInventoryFinalUd] = useState([]);
    const [StageWiseInventoryPacking, setStageWiseInventoryPacking] = useState([]);

    const [stageWiseGrAll, setStageWiseGrAll] = useState({
        RM_GROnDate: '',
        RM_GRToDate: '',
        SFG_ProdOnDate: '',
        SFG_ProdToDate: '',
        ANN_ProdOnDate: '',
        ANN_ProdToDate: '',
        STP_ProdOnDate: '',
        STP_ProdToDate: '',
        COLD_DProdOnDt: '',
        COLD_DProdToDt: '',
        CLT_ProdOnDate: '',
        CLT_ProdToDate: '',
        HYDRA_ProdOnDate: '',
        HYDRA_ProdToDate: '',
        ETC_ProdOnDate: '',
        ETC_ProdToDate: '',
        FG_OnDate: '',
        FG_ToDate: '',
        RM_GRCurrDate: '',
        SFG_ProdCurrDate: '',
        ANN_ProdCurrDate: '',
        STP_ProdCurrDate: '',
        COLD_DProdCurrDt: '',
        CLT_ProdCurrDate: '',
        HYDRA_ProdCurrDate: '',
        ETC_ProdCurrDate: '',
        FG_CurrDate: ''
    });

    const [fromDtMerg, setFromDtMerg] = useState(null);
    const [dataState, setDataState] = useState(null);
    const [chartState, setChartState] = useState(null);
    const [chartState2, setChartState2] = useState(null);
    const [chartState3, setChartState3] = useState(null);
    const [chartState4, setChartState4] = useState(null);

    const [fromProdDt, setFromProdDt] = useState(null);
    const [toProdDt, setToProdDt] = useState(null);

    const [resultDataGRTable, setResultGRDataTable] = useState(null);
    const [resultGRData, setResultGRData] = useState(null);
    const [resultGRColumn, setResultGRColumn] = useState([]);    
    const [prodFrmDt, setProdFrmDt] = useState(null);
    const [prodToDt, setProdToDt] = useState(null);
    const [daysArray, setDaysArray] = useState([ new Date() ]);

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
            var pageName = "LDSC010";

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


    const downloadExcelGRTableData = () => {
        if (resultGRData == null) {
          alertify.error("No Data exists in table for Downloading");
          return;
        }    
        var date = new Date();
        var fileName = "GR_Report " + date.toString() + ".xlsx";
        resultDataGRTable.download("xlsx", fileName, {
          sheetName: "Sheet1",
        });
      };

    let componentRef = useRef();
    const downloadExcelResultTable = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint : true,
        pageStyle :`
            @page {
            size: 600mm 1000mm;
            }

            @media all {
                .pagebreak {
                display: none;
                }
            }

            @media print {
                .pagebreak {
                page-break-before: none;
            }
            @media print{
                .noprint {
                    display:none
                }
            }
        `,
        documentTitle:"LDSC010-Khapoli-Report.pdf"
    });

    // const downloadExcelResultTable = async () => {
    //     const data = await html2canvas(document.querySelector("#pdf"));
    //     const img = data.toDataURL("image/png", );
    //     const createEl = document.createElement('a');
    //     createEl.href = img;
    //     createEl.download = "LDSC010-Khapoli-Report";
    //     createEl.click();
    //     createEl.remove();
    // }


    useEffect(() => {
        if (resultGRData && resultGRData.length > 0) {
            setResultGRDataTable(
                new Tabulator("#resultGRtable", {
                    data: resultGRData,
                    columns: resultGRColumn,
                    maxHeight: 400,
                    layout: "fitDataFill",
                })
            );
        }
    }, [resultGRData,resultGRColumn]);


    const handleClearAll = (newToken = false) => {
        setSelectedFrmDt(null);
        setSelectedToDt(null);
        setResultData([,]);
        setResultDataTable(null);
    };

    

    const handleClearGRAll = (newToken = false) => {
        setProdFrmDt(null);
        setProdToDt(null);
        setResultGRData([,]);
        setResultGRDataTable(null);
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
                        Promise.all([
                            getMatGrp(items[0], accessToken)
                          ]).finally(() => {
                            resolve();
                          });
                    }
                })
                .catch(() => {
                    resolve();
                });
        });
    };

    const getMatGrp = (value, accessToken) => {
        return new Promise((resolve) => {
          var defaultOptions = {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          };
    
          var url = "api/LDSC010/getMatGrp";
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
                console.log(response.data);
                response.data.map((row) => {
                  var obj = new Object();
                  console.log(row);
                  obj.label = row[0];
                  obj.value = row[0];
                  items.push(obj);
                });
                setMatGrp(items);
                console.log(matGrp);
              }
            })
            .finally((f) => {
              resolve();
            });
        });
      };

    
  const getResultGRData = async (newToken = false) => { 
    console.log(prodFrmDt);
    if (selectedPlant?.value === undefined) {
      alertify.error("Please select Plant");
      return;
    }
    if (!prodFrmDt) {
        alertify.error("Please select From Dt");
        return;
      }
      
      if (!prodToDt) {
        alertify.error("Please select To Dt");
        return;
      }
    //console.log("1 hai",prodFrmDt,prodToDt);
    var fromDt = prodFrmDt
      ? prodFrmDt
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/ /g, "-")
      : "";
    
      console.log(fromDt);

    var toDt = prodToDt
      ? prodToDt
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/ /g, "-")
      : "";
     
    if (Date(fromDt) > Date(toDt)) {
      alertify.error("From Date should be less than To Date");
      return;
    }
    console.log(fromDt,toDt);
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url;
      var data = {
        plant: selectedPlant?.value,
        fromDt: fromDt,
        toDt: toDt,
        matGrp: selectedMatGrp.label
      };

      data = { ...data};

      url = "api/LDSC010/getGRReportData";
      
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setResultGRData([,]);
            } else {
                setResultGRData(response.data[1]);
                setResultGRColumn(response.data[0]);   
            }
          }
        })
        .finally((f) => {
          setLoading(false);
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

            var d = {
                plant: selectedPlant?.value,
            };

            setLoading(true);
            var apiurl = [
                axiosAPI.post("api/LDSC010/getRmReceivedOnDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getRmReceivedToDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getAllotmentOnDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getAllotmentToDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getTubeSchedulingOnDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getTubeSchedulingToDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getTubeProductionOnDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getTubeProductionToDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getPackingConfirmationOnDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getPackingConfirmationToDate", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getInventorySumRm", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getInventorySumWip", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getInventorySumPendingUd", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getInventorySumFG", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryRm", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryPendingUd", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryAnn", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryColdDraw", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryStp", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryCtl", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryHydra", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryEct", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryFG", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryFinalUD", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseInventoryPacking", d, defaultOptions),
                axiosAPI.post("api/LDSC010/getStageWiseGrAllAPI", d, defaultOptions),
            ];

            Promise.all(apiurl)
                .then(
                    ([
                        getRmReceivedOnDate,
                        getRmReceivedToDate,
                        getAllotmentOnDate,
                        getAllotmentToDate,
                        getTubeSchedulingOnDate,
                        getTubeSchedulingToDate,
                        getTubeProductionOnDate,
                        getTubeProductionToDate,
                        getPackingConfirmationOnDate,
                        getPackingConfirmationToDate,
                        getInventorySumRm,
                        getInventorySumWip,
                        getInventorySumPendingUd,
                        getInventorySumFG,
                        getStageWiseInventoryRm,
                        getStageWiseInventoryPendingUd,
                        getStageWiseInventoryAnn,
                        getStageWiseInventoryColdDraw,
                        getStageWiseInventoryStp,
                        getStageWiseInventoryCtl,
                        getStageWiseInventoryHydra,
                        getStageWiseInventoryEct,
                        getStageWiseInventoryFG,
                        getStageWiseInventoryFinalUD,
                        getStageWiseInventoryPacking,
                        getStageWiseGrAllAPI
                    ]) => {

                        setRmReceivedOnDate(getRmReceivedOnDate.data[0]);
                        setRmReceivedToDate(getRmReceivedToDate.data[0]);
                        setAllotmentOnDate(getAllotmentOnDate.data[0]);
                        setAllotmentToDate(getAllotmentToDate.data[0]);
                        setTubeSchedulingOnDate(getTubeSchedulingOnDate.data[0]);
                        setTubeSchedulingToDate(getTubeSchedulingToDate.data[0]);
                        setTubeProductionOnDate(getTubeProductionOnDate.data[0]);
                        setTubeProductionToDate(getTubeProductionToDate.data[0]);
                        setPackingConfirmationOnDate(getPackingConfirmationOnDate.data[0]);
                        setgetPackingConfirmationToDate(getPackingConfirmationToDate.data[0]);

                        setInventorySumRm(getInventorySumRm.data[0]);
                        setInventorySumWip(getInventorySumWip.data[0]);
                        setInventorySumPendingUd(getInventorySumPendingUd.data[0]);
                        setInventorySumFG(getInventorySumFG.data[0]);

                        setStageWiseInventoryRm(getStageWiseInventoryRm.data[0]);
                        setStageWiseInventoryPendingUd(getStageWiseInventoryPendingUd.data[0]);
                        setStageWiseInventoryAnn(getStageWiseInventoryAnn.data[0]);
                        setStageWiseInventoryColdDraw(getStageWiseInventoryColdDraw.data[0]);
                        setStageWiseInventoryStp(getStageWiseInventoryStp.data[0]);
                        setStageWiseInventoryCtl(getStageWiseInventoryCtl.data[0]);
                        setStageWiseInventoryHydra(getStageWiseInventoryHydra.data[0]);
                        setStageWiseInventoryEct(getStageWiseInventoryEct.data[0]);
                        setStageWiseInventoryFG(getStageWiseInventoryFG.data[0]);
                        setStageWiseInventoryFinalUd(getStageWiseInventoryFinalUD.data[0]);
                        setStageWiseInventoryPacking(getStageWiseInventoryPacking.data[0]);


                        setStageWiseGrAll({
                            ...stageWiseGrAll,
                            RM_GROnDate: getStageWiseGrAllAPI.data.RM_GROnDate[0] ? getStageWiseGrAllAPI.data.RM_GROnDate[0].toFixed(2) : 0,
                            RM_GRToDate: getStageWiseGrAllAPI.data.RM_GRToDate[0] ? getStageWiseGrAllAPI.data.RM_GRToDate[0].toFixed(2) : 0,
                            SFG_ProdOnDate: getStageWiseGrAllAPI.data.SFG_ProdOnDate[0] ? getStageWiseGrAllAPI.data.SFG_ProdOnDate[0].toFixed(2) : 0,
                            SFG_ProdToDate: getStageWiseGrAllAPI.data.SFG_ProdToDate[0] ? getStageWiseGrAllAPI.data.SFG_ProdToDate[0].toFixed(2) : 0,
                            ANN_ProdOnDate: getStageWiseGrAllAPI.data.ANN_ProdOnDate[0] ? getStageWiseGrAllAPI.data.ANN_ProdOnDate[0].toFixed(2) : 0,
                            ANN_ProdToDate: getStageWiseGrAllAPI.data.ANN_ProdToDate[0] ? getStageWiseGrAllAPI.data.ANN_ProdToDate[0].toFixed(2) : 0,
                            STP_ProdOnDate: getStageWiseGrAllAPI.data.STP_ProdOnDate[0] ? getStageWiseGrAllAPI.data.STP_ProdOnDate[0].toFixed(2) : 0,
                            STP_ProdToDate: getStageWiseGrAllAPI.data.STP_ProdToDate[0] ? getStageWiseGrAllAPI.data.STP_ProdToDate[0].toFixed(2) : 0,
                            COLD_DProdOnDt: getStageWiseGrAllAPI.data.COLD_DProdOnDt[0] ? getStageWiseGrAllAPI.data.COLD_DProdOnDt[0].toFixed(2) : 0,
                            COLD_DProdToDt: getStageWiseGrAllAPI.data.COLD_DProdToDt[0] ? getStageWiseGrAllAPI.data.COLD_DProdToDt[0].toFixed(2) : 0,
                            CLT_ProdOnDate: getStageWiseGrAllAPI.data.CLT_ProdOnDate[0] ? getStageWiseGrAllAPI.data.CLT_ProdOnDate[0].toFixed(2) : 0,
                            CLT_ProdToDate: getStageWiseGrAllAPI.data.CLT_ProdToDate[0] ? getStageWiseGrAllAPI.data.CLT_ProdToDate[0].toFixed(2) : 0,
                            HYDRA_ProdOnDate: getStageWiseGrAllAPI.data.HYDRA_ProdOnDate[0] ? getStageWiseGrAllAPI.data.HYDRA_ProdOnDate[0].toFixed(2) : 0,
                            HYDRA_ProdToDate: getStageWiseGrAllAPI.data.HYDRA_ProdToDate[0] ? getStageWiseGrAllAPI.data.HYDRA_ProdToDate[0].toFixed(2) : 0,
                            ETC_ProdOnDate: getStageWiseGrAllAPI.data.ETC_ProdOnDate[0] ? getStageWiseGrAllAPI.data.ETC_ProdOnDate[0].toFixed(2) : 0,
                            ETC_ProdToDate: getStageWiseGrAllAPI.data.ETC_ProdToDate[0] ? getStageWiseGrAllAPI.data.ETC_ProdToDate[0].toFixed(2) : 0,
                            FG_OnDate: getStageWiseGrAllAPI.data.FG_OnDate[0] ? getStageWiseGrAllAPI.data.FG_OnDate[0].toFixed(2) : 0,
                            FG_ToDate: getStageWiseGrAllAPI.data.FG_ToDate[0] ? getStageWiseGrAllAPI.data.FG_ToDate[0].toFixed(2) : 0,

                            RM_GRCurrDate: getStageWiseGrAllAPI.data.RM_GRCurrDate[0] ? getStageWiseGrAllAPI.data.RM_GRCurrDate[0].toFixed(2) : 0,
                            SFG_ProdCurrDate: getStageWiseGrAllAPI.data.SFG_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.SFG_ProdCurrDate[0].toFixed(2) : 0,
                            ANN_ProdCurrDate: getStageWiseGrAllAPI.data.ANN_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.ANN_ProdCurrDate[0].toFixed(2) : 0,
                            STP_ProdCurrDate: getStageWiseGrAllAPI.data.STP_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.STP_ProdCurrDate[0].toFixed(2) : 0,
                            COLD_DProdCurrDt: getStageWiseGrAllAPI.data.COLD_DProdCurrDt[0] ? getStageWiseGrAllAPI.data.COLD_DProdCurrDt[0].toFixed(2) : 0,
                            CLT_ProdCurrDate: getStageWiseGrAllAPI.data.CLT_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.CLT_ProdCurrDate[0].toFixed(2) : 0,
                            HYDRA_ProdCurrDate: getStageWiseGrAllAPI.data.HYDRA_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.HYDRA_ProdCurrDate[0].toFixed(2) : 0,
                            ETC_ProdCurrDate: getStageWiseGrAllAPI.data.ETC_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.ETC_ProdCurrDate[0].toFixed(2) : 0,
                            FG_CurrDate: getStageWiseGrAllAPI.data.FG_CurrDate[0] ? getStageWiseGrAllAPI.data.FG_CurrDate[0].toFixed(2) : 0,

                        });


                        let Data = [
                            {
                                id: 1,
                                year: "RM",
                                userGain: getInventorySumRm.data[0][0].toFixed(0),
                                userLost: 823,
                            },
                            {
                                id: 2,
                                year: "WIP",
                                userGain: getInventorySumWip.data[0][0].toFixed(0),
                                userLost: 345,
                            },
                            {
                                id: 3,
                                year: "Pending for UD",
                                userGain: getInventorySumPendingUd.data[0][0].toFixed(0),
                                userLost: 555,
                            },
                            {
                                id: 4,
                                year: "FG",
                                userGain: getInventorySumFG.data[0][0].toFixed(0),
                                userLost: 4555,
                            }
                        ];

                        var chart = {
                            data: {
                                labels: Data.map((o) => o.year),
                                datasets: [
                                    {
                                        label: "Quantity in MT",
                                        backgroundColor: "rgba(100, 149, 237)",
                                        borderColor: "rgb(100, 149, 237)",
                                        borderWidth: 1,
                                        data: Data.map((o) => o.userGain),
                                    },
                                ],
                            },

                            options: {
                                responsive: true,
                                plugins: {
                                    datalabels: {
                                        display: true,
                                        color: "black",
                                        formatter: Math.round,
                                        anchor: "end",
                                        offset: -20,
                                        align: "start"
                                    },
                                    title: {
                                        display: true,
                                        text: "Category wise Ground  Stock",
                                    },
                                },
                                scales: {
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Quantity in (MT)',
                                            font: {
                                                size: 15
                                            }
                                        }
                                    }
                                }
                            },
                        };

                        let Data2 = [
                            {
                                id: 1,
                                year: "RM",
                                userGain: getStageWiseInventoryRm.data[0][0],
                                userLost: 823,
                            },
                            {
                                id: 2,
                                year: "Mill UD",
                                userGain: getStageWiseInventoryPendingUd.data[0][0],
                                userLost: 345,
                            },
                            {
                                id: 3,
                                year: "ANN",
                                userGain: getStageWiseInventoryAnn.data[0][0],
                                userLost: 555,
                            },
                            {
                                id: 4,
                                year: "STP",
                                userGain: getStageWiseInventoryStp.data[0][0],
                                userLost: 4555,
                            },
                            {
                                id: 5,
                                year: "COLD DRAW",
                                userGain: getStageWiseInventoryColdDraw.data[0][0],
                                userLost: 234,
                            },
                            {
                                id: 5,
                                year: "CTL",
                                userGain: getStageWiseInventoryCtl.data[0][0],
                                userLost: 234,
                            },
                            {
                                id: 5,
                                year: "HYDRA",
                                userGain: getStageWiseInventoryHydra.data[0][0],
                                userLost: 234,
                            },
                            {
                                id: 5,
                                year: "ECT",
                                userGain: getStageWiseInventoryEct.data[0][0],
                                userLost: 234,
                            },
                            {
                                id: 5,
                                year: "FINAL UD",
                                userGain: getStageWiseInventoryFinalUD.data[0][0],
                                userLost: 234,
                            },
                            {
                                id: 5,
                                year: "PACKING",
                                userGain: getStageWiseInventoryPacking.data[0][0],
                                userLost: 234,
                            },
                            {
                                id: 5,
                                year: "FG",
                                userGain: getStageWiseInventoryFG.data[0][0],
                                userLost: 234,
                            },
                        ];

                        var chart2 = {
                            data: {
                                labels: Data2.map((o) => o.year),
                                datasets: [
                                    {
                                        label: "Quantity in MT",
                                        backgroundColor: "rgba(100, 149, 237)",
                                        borderColor: "rgb(100, 149, 237)",
                                        borderWidth: 1,
                                        data: Data2.map((o) => o.userGain),
                                    },
                                ],
                            },
                            options: {
                                plugins: {
                                    datalabels: {
                                        display: true,
                                        color: "black",
                                        formatter: Math.round,
                                        anchor: "end",
                                        offset: -20,
                                        align: "start"
                                    },
                                    title: {
                                        display: true,
                                        text: "Stage wise Inventory",
                                    },
                                },
                                scales: {
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Quantity in (MT)',
                                            font: {
                                                size: 15
                                            }
                                        }
                                    }
                                }
                            },
                        };

                        let data3 = {
                            labels: ["RM GR", "SFG GR", "ANN GR", "COLD DRAW", "STP", "CTL", "HYDRA", "ECT", "FG"],
                            datasets: [{
                                label: 'PrevDt',
                                fill: true,
                                lineTension: 0.4,
                                pointBorderWidth: 2,
                                borderColor: "rgb(255, 99, 167)",
                                backgroundColor: "rgba(255, 0, 0)",
                                fill: {
                                    target: "origin", // 3. Set the fill options
                                    above: "rgba(255, 0, 0, 0.3)"
                                },
                                data: [
                                    getStageWiseGrAllAPI.data.RM_GROnDate[0] ? getStageWiseGrAllAPI.data.RM_GROnDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.SFG_ProdOnDate[0] ? getStageWiseGrAllAPI.data.SFG_ProdOnDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.ANN_ProdOnDate[0] ? getStageWiseGrAllAPI.data.ANN_ProdOnDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.STP_ProdOnDate[0] ? getStageWiseGrAllAPI.data.STP_ProdOnDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.COLD_DProdOnDt[0] ? getStageWiseGrAllAPI.data.COLD_DProdOnDt[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.CLT_ProdOnDate[0] ? getStageWiseGrAllAPI.data.CLT_ProdOnDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.HYDRA_ProdOnDate[0] ? getStageWiseGrAllAPI.data.HYDRA_ProdOnDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.ETC_ProdOnDate[0] ? getStageWiseGrAllAPI.data.ETC_ProdOnDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.FG_OnDate[0] ? getStageWiseGrAllAPI.data.FG_OnDate[0].toFixed(0) : 0
                                ]
                            },
                            {
                                label: 'OnDt',
                                fill: false,
                                lineTension: 0.4,
                                pointBorderWidth: 2,
                                borderColor: "rgb(0, 255, 0)",
                                backgroundColor: "rgba(0, 255, 0, 0.3)",
                                fill: "origin", // 3. Set the fill options
                                data: [
                                    getStageWiseGrAllAPI.data.RM_GRCurrDate[0] ? getStageWiseGrAllAPI.data.RM_GRCurrDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.SFG_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.SFG_ProdCurrDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.ANN_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.ANN_ProdCurrDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.STP_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.STP_ProdCurrDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.COLD_DProdCurrDt[0] ? getStageWiseGrAllAPI.data.COLD_DProdCurrDt[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.CLT_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.CLT_ProdCurrDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.HYDRA_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.HYDRA_ProdCurrDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.ETC_ProdCurrDate[0] ? getStageWiseGrAllAPI.data.ETC_ProdCurrDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.FG_CurrDate[0] ? getStageWiseGrAllAPI.data.FG_CurrDate[0].toFixed(0) : 0
                                ]
                            },
                        
                            {
                                label: 'Till Dt',
                                fill: false,
                                lineTension: 0.4,
                                pointBorderWidth: 2,
                                borderColor: "rgb(53, 162, 200)",
                                backgroundColor: "rgba(53, 162, 235, 0.3)",
                                fill: "origin", // 3. Set the fill options
                                data: [
                                    getStageWiseGrAllAPI.data.RM_GRToDate[0] ? getStageWiseGrAllAPI.data.RM_GRToDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.SFG_ProdToDate[0] ? getStageWiseGrAllAPI.data.SFG_ProdToDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.ANN_ProdToDate[0] ? getStageWiseGrAllAPI.data.ANN_ProdToDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.STP_ProdToDate[0] ? getStageWiseGrAllAPI.data.STP_ProdToDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.COLD_DProdToDt[0] ? getStageWiseGrAllAPI.data.COLD_DProdToDt[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.CLT_ProdToDate[0] ? getStageWiseGrAllAPI.data.CLT_ProdToDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.HYDRA_ProdToDate[0] ? getStageWiseGrAllAPI.data.HYDRA_ProdToDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.ETC_ProdToDate[0] ? getStageWiseGrAllAPI.data.ETC_ProdToDate[0].toFixed(0) : 0,
                                    getStageWiseGrAllAPI.data.FG_ToDate[0] ? getStageWiseGrAllAPI.data.FG_ToDate[0].toFixed(0) : 0
                                ]
                            }]
                        };

                        let data4 = {
                            labels: ["RM Received", "Allotment", "Tube Scheduling", "Tube Production", "Packing Confirmation"],
                            datasets: [{
                                label: 'PrevDt',
                                fill: true,
                                lineTension: 0.4,
                                pointBorderWidth: 2,
                                borderColor: "rgb(255, 99, 132)",
                                backgroundColor: "rgba(255, 0, 0)",
                                fill: {
                                    target: "origin", // 3. Set the fill options
                                    above: "rgba(255, 0, 0, 0.3)"
                                },
                                data: [
                                    getRmReceivedOnDate.data[0][0] ? getRmReceivedOnDate.data[0][0].toFixed(0) : 0,
                                    getAllotmentOnDate.data[0][0] ? getAllotmentOnDate.data[0][0].toFixed(0) : 0,
                                    getTubeSchedulingOnDate.data[0][0] ? getTubeSchedulingOnDate.data[0][0].toFixed(0) : 0,
                                    getTubeProductionOnDate.data[0][0] ? getTubeProductionOnDate.data[0][0].toFixed(0) : 0,
                                    getPackingConfirmationOnDate.data[0][0] ? getPackingConfirmationOnDate.data[0][0].toFixed(0) : 0
                                ]
                            },
                            {
                                label: 'Till Dt',
                                fill: false,
                                lineTension: 0.4,
                                pointBorderWidth: 2,
                                borderColor: "rgb(53, 162, 235)",
                                backgroundColor: "rgba(53, 162, 235, 0.3)",
                                fill: "origin",
                                data: [
                                    getRmReceivedToDate.data[0][0] ? getRmReceivedToDate.data[0][0].toFixed(0) : 0,
                                    getAllotmentToDate.data[0][0] ? getAllotmentToDate.data[0][0].toFixed(0) : 0,
                                    getTubeSchedulingToDate.data[0][0] ? getTubeSchedulingToDate.data[0][0].toFixed(0) : 0,
                                    getTubeProductionToDate.data[0][0] ? getTubeProductionToDate.data[0][0].toFixed(0) : 0,
                                    getPackingConfirmationToDate.data[0][0] ? getPackingConfirmationToDate.data[0][0].toFixed(0) : 0
                                ]
                            }],

                        };

                        setChartState(chart);
                        setChartState2(chart2);
                        setChartState3(data3);
                        setChartState4(data4);
                        setLoading(false);
                    }
                )
                .finally(() => {
                    setLoading(false);
                });
        });
    };

    var options = {
        responsive: true,
        plugins: {
            datalabels: {
                display: 'auto',
                color: "black",
                formatter: Math.round,
                anchor: "end",
                offset: -30,
                align: "start"
            },
            title: {
                display: true,
                text: 'Stage Wise GR',
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'GR Quantity (MT)',
                }
            }
        }
    };

    var options1 = {
        responsive: true,
        plugins: {
            datalabels: {
                display: 'auto',
                color: "black",
                formatter: Math.round,
                anchor: "end",
                offset: -30,
                align: "start"
            },
            title: {
                display: true,
                text: 'Stage wise stock',
            },
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: 'Quantity in (MT)',
                    font: {
                        size: 15
                    }
                }
            }
        }
    };

    const handlePlantChange = (value) => {
        if (value) {
            setSelectedPlant(value);
            setChartState(null);
            setChartState2(null);
            setChartState3(null);
            setChartState4(null);
            setRmReceivedOnDate([]);
            setRmReceivedToDate([]);
            setAllotmentOnDate([]);
            setAllotmentToDate([]);
            setTubeSchedulingOnDate([]);
            setTubeSchedulingToDate([]);
            setTubeProductionOnDate([]);
            setTubeProductionToDate([]);
            setPackingConfirmationOnDate([]);
            setgetPackingConfirmationToDate([]);
            setInventorySumRm([]);
            setInventorySumWip([]);
            setInventorySumPendingUd([]);
            setInventorySumFG([]);
            setStageWiseInventoryRm([]);
            setStageWiseInventoryPendingUd([]);
            setStageWiseInventoryAnn([]);
            setStageWiseInventoryColdDraw([]);
            setStageWiseInventoryStp([]);
            setStageWiseInventoryCtl([]);
            setStageWiseInventoryHydra([]);
            setStageWiseInventoryEct([]);
            setStageWiseInventoryFG([]);

            setStageWiseGrAll({
                ...stageWiseGrAll,
                RM_GROnDate: '',
                RM_GRToDate: '',
                SFG_ProdOnDate: '',
                SFG_ProdToDate: '',
                ANN_ProdOnDate: '',
                ANN_ProdToDate: '',
                STP_ProdOnDate: '',
                STP_ProdToDate: '',
                COLD_DProdOnDt: '',
                COLD_DProdToDt: '',
                CLT_ProdOnDate: '',
                CLT_ProdToDate: '',
                HYDRA_ProdOnDate: '',
                HYDRA_ProdToDate: '',
                ETC_ProdOnDate: '',
                ETC_ProdToDate: '',
                FG_OnDate: '',
                FG_ToDate: ''
            });
        }
    };

    const handleProcessChange = (value) => {
        setSelectedMatGrp(value);
        setResultGRDataTable([]);
      };    

    return (
        <DashboardLayout>
            <DefaultNavbar routes={routes} module="Reports" page="KPI Dashboard" />
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
                    <MDBox pt={6} pb={3} py={10} ref={componentRef} id="pdf">
                        <Grid container spacing={5}>
                        <Grid item xs={6}>
                            <AppBar position="static">
                            <Tabs
                                orientation={"horizontal"}
                                value={tabValue}
                                onChange={handleSetTabValue}
                            >
                                <Tab label="KPI Report" icon={<Today />} />
                                <Tab label="GR Report" icon={<Today />} />                                
                            </Tabs>
                            </AppBar>
                        </Grid>
                            <Grid item xs={12}>
                            {tabValue == 0 && (
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
                                            {/* <Grid item xs={1.5}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    From Date
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
                                            </Grid> */}
                                            {/* <Grid item xs={1.5}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    To Date
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
                                            </Grid> */}

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
                            )}
                            {tabValue == 1 && (
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
                                                        onClick={() => handleClearGRAll(true)}
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
                                                    Material Group{" "}
                                                </MDTypography>
                                                <ReactSelect
                                                    id="matGrp"
                                                    options={matGrp}
                                                    onChange={handleProcessChange}
                                                    value={selectedMatGrp}
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
                                                   Prod From Date*
                                                </MDTypography>

                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                ></MDTypography>

                                                <DatePicker
                                                    id="prodFrmDt"
                                                    value={prodFrmDt}
                                                    onChange={(date) => setProdFrmDt(date)}
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
                                                  Prod To Date*
                                                </MDTypography>

                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                ></MDTypography>

                                                <DatePicker
                                                    id="prodToDt"
                                                    value={prodToDt}
                                                    onChange={(date) => setProdToDt(date)}
                                                />
                                            </Grid>

                                            <Grid item xs={1}>
                                                <MDButton
                                                    style={{ marginTop: "1.5rem" }}
                                                    size="small"
                                                    color="info"
                                                    onClick={() => getResultGRData()}
                                                >
                                                    Submit
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            )}

                            </Grid>

                            <Grid item xs={12}>
                            {tabValue == 0 && (
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

                                    <MDBox px={4} py={4}>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                        ></Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {/* {chartState3 && (<div style={{ paddingLeft: "23rem", marginBottom: "1rem" }}>Stage Wise GR</div>)} */}
                                                {chartState3 && (
                                                    <Bar
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState3} options={options} />
                                                )}
                                            </Grid>



                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {chartState2 && (
                                                    <Bar
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState2.data}
                                                        options={chartState2.options}
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    <MDBox px={4} py={4}>
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                        ></Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {chartState && (
                                                    <Bar
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState.data}
                                                        options={chartState.options}
                                                    />
                                                )}
                                            </Grid>
                                            <Grid item xs={6} style={{ border: "1px solid #ccc" }}>
                                                {/* {chartState4 && (<div style={{ paddingLeft: "24rem", marginBottom: "1rem" }}>Stage wise stock</div>)} */}
                                                {chartState4 && (
                                                    <Line
                                                        height="350px"
                                                        width="700px"
                                                        data={chartState4}
                                                        options={options1}
                                                    />
                                                )}
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
                                                <TableContainer component={Paper} style={{ border: "1.6px solid #348eed" }}>
                                                    <Table
                                                        sx={{ minWidth: 500 }}
                                                        aria-label="caption table"
                                                    >
                                                        <caption></caption>
                                                        <TableHead style={{ display: "contents" }}>
                                                            <TableRow style={{ backgroundColor: "#ADD8E6" }}>
                                                                <TableCell align="left" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}> Stage Wise GR</TableCell>
                                                                <TableCell align="right">
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                </TableCell>
                                                                <TableCell align="center" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {/* GR Quantity */}
                                                                </TableCell>
                                                            </TableRow>

                                                            <TableRow>
                                                                <TableCell align="left"> </TableCell>                                                                
                                                                <Tooltip title="Yesterday's">
                                                                    <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                        {/* On Date */}
                                                                        PrevDt
                                                                    </TableCell>
                                                                </Tooltip>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {/* OnDt */}
                                                                     OnDt
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Till Dt
                                                                </TableCell>
                                                            </TableRow>

                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}
                                                                sx={{
                                                                    "&:last-child td, &:last-child th": {
                                                                        border: 0,
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    RM
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.RM_GROnDate
                                                                        ? stageWiseGrAll?.RM_GROnDate
                                                                        : 0}

                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.RM_GRCurrDate
                                                                        ? stageWiseGrAll?.RM_GRCurrDate
                                                                        : 0}
                                                                </TableCell>
                            
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.RM_GRToDate
                                                                        ? stageWiseGrAll?.RM_GRToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    SFG
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.SFG_ProdOnDate
                                                                        ? stageWiseGrAll?.SFG_ProdOnDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.SFG_ProdCurrDate
                                                                        ? stageWiseGrAll?.SFG_ProdCurrDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.SFG_ProdToDate
                                                                        ? stageWiseGrAll?.SFG_ProdToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    ANN
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.ANN_ProdOnDate
                                                                        ? stageWiseGrAll?.ANN_ProdOnDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.ANN_ProdCurrDate
                                                                        ? stageWiseGrAll?.ANN_ProdCurrDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.ANN_ProdToDate
                                                                        ? stageWiseGrAll?.ANN_ProdToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    STP
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.STP_ProdOnDate
                                                                        ? stageWiseGrAll?.STP_ProdOnDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.STP_ProdCurrDate
                                                                        ? stageWiseGrAll?.STP_ProdCurrDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.STP_ProdToDate
                                                                        ? stageWiseGrAll?.STP_ProdToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    COLD DRAW
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.COLD_DProdOnDt
                                                                        ? stageWiseGrAll?.COLD_DProdOnDt
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.COLD_DProdCurrDt
                                                                        ? stageWiseGrAll?.COLD_DProdCurrDt
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.COLD_DProdToDt
                                                                        ? stageWiseGrAll?.COLD_DProdToDt
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    CTL
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.CLT_ProdOnDate
                                                                        ? stageWiseGrAll?.CLT_ProdOnDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.CLT_ProdCurrDate
                                                                        ? stageWiseGrAll?.CLT_ProdCurrDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.CLT_ProdToDate
                                                                        ? stageWiseGrAll?.CLT_ProdToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    HYDRA
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.HYDRA_ProdOnDate
                                                                        ? stageWiseGrAll?.HYDRA_ProdOnDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.HYDRA_ProdCurrDate
                                                                        ? stageWiseGrAll?.HYDRA_ProdCurrDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.HYDRA_ProdToDate
                                                                        ? stageWiseGrAll?.HYDRA_ProdToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    ECT
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.ETC_ProdOnDate
                                                                        ? stageWiseGrAll?.ETC_ProdOnDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.ETC_ProdCurrDate
                                                                        ? stageWiseGrAll?.ETC_ProdCurrDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.ETC_ProdToDate
                                                                        ? stageWiseGrAll?.ETC_ProdToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    FG
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.FG_OnDate
                                                                        ? stageWiseGrAll?.FG_OnDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.FG_CurrDate
                                                                        ? stageWiseGrAll?.FG_CurrDate
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {stageWiseGrAll?.FG_ToDate
                                                                        ? stageWiseGrAll?.FG_ToDate
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>

                                            <Grid item xs={6} >
                                                <TableContainer component={Paper} style={{ border: "1.6px solid #348eed" }}>
                                                    <Table
                                                        sx={{ minWidth: 500 }}
                                                        aria-label="caption table"
                                                    >
                                                        <caption></caption>
                                                        <TableHead style={{ display: "contents" }}>
                                                            <TableRow style={{ backgroundColor: "#ADD8E6" }}>

                                                                <TableCell align="left" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Stage Wise Inventory
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {/* Stock */}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row">
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {/* On Date */}
                                                                    As On Date
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}
                                                                sx={{
                                                                    "&:last-child td, &:last-child th": {
                                                                        border: 0,
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    RM
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryRm[0]
                                                                        ? StageWiseInventoryRm[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Mill UD
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryPendingUd[0]
                                                                        ? StageWiseInventoryPendingUd[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    ANN
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryAnn[0]
                                                                        ? StageWiseInventoryAnn[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    STP
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryStp[0]
                                                                        ? StageWiseInventoryStp[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    COLD DRAW
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryColdDraw[0]
                                                                        ? StageWiseInventoryColdDraw[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    CTL
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryCtl[0]
                                                                        ? StageWiseInventoryCtl[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    HYDRA
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryHydra[0]
                                                                        ? StageWiseInventoryHydra[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    ECT
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryEct[0]
                                                                        ? StageWiseInventoryEct[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>

                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    FINAL UD
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryFinalUd[0]
                                                                        ? StageWiseInventoryFinalUd[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    PACKING
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryPacking[0]
                                                                        ? StageWiseInventoryPacking[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    FG
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {StageWiseInventoryFG[0]
                                                                        ? StageWiseInventoryFG[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>

                                            <Grid item xs={6} >
                                                <TableContainer component={Paper} style={{ border: "1.6px solid #348eed", marginTop: "-5rem" }}>
                                                    <Table
                                                        sx={{ minWidth: 500 }}
                                                        aria-label="caption table"
                                                    >
                                                        <caption></caption>
                                                        <TableHead style={{ display: "contents" }}>
                                                            <TableRow style={{ backgroundColor: "#ADD8E6" }}>
                                                                <TableCell align="left" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Inventory Summary
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {/* Stock (T) */}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell component="th" scope="row">
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    As On date
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}
                                                                sx={{
                                                                    "&:last-child td, &:last-child th": {
                                                                        border: 0,
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    RM
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {InventorySumRm[0]
                                                                        ? InventorySumRm[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    WIP(Pending for UD included)
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {InventorySumWip[0]
                                                                        ? InventorySumWip[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Pending for UD
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {InventorySumPendingUd[0]
                                                                        ? InventorySumPendingUd[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>    

                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    FG
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {InventorySumFG[0]
                                                                        ? InventorySumFG[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>

                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>

                                            <Grid item xs={6} >
                                                <TableContainer component={Paper} style={{ border: "1.6px solid #348eed" }}>
                                                    <Table
                                                        sx={{ minWidth: 500 }}
                                                        aria-label="caption table"
                                                    >
                                                        <caption></caption>
                                                        <TableHead style={{ display: "contents" }}>
                                                            <TableRow style={{ backgroundColor: "#ADD8E6" }}>
                                                                <TableCell align="left" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>Activity Wise Qty Recording</TableCell>
                                                                <TableCell align="right">
                                                                </TableCell>
                                                                <TableCell align="center" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {/* Stock */}
                                                                </TableCell>
                                                            </TableRow>

                                                            <TableRow>
                                                                <TableCell align="left"> </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    PrevDt
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Till Dt
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}
                                                                sx={{
                                                                    "&:last-child td, &:last-child th": {
                                                                        border: 0,
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    RM Received
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {RmReceivedOnDate[0]
                                                                        ? RmReceivedOnDate[0].toFixed(2)
                                                                        : 0}

                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {RmReceivedToDate[0]
                                                                        ? RmReceivedToDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Allotment
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {AllotmentOnDate[0]
                                                                        ? AllotmentOnDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {AllotmentToDate[0]
                                                                        ? AllotmentToDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Tube Scheduling
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {TubeSchedulingOnDate[0]
                                                                        ? TubeSchedulingOnDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {TubeSchedulingToDate[0]
                                                                        ? TubeSchedulingToDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Tube Production
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {TubeProductionOnDate[0]
                                                                        ? TubeProductionOnDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {TubeProductionToDate[0]
                                                                        ? TubeProductionToDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                            <TableRow style={{ border: "2px solid #ADD8E6" }}>
                                                                <TableCell component="th" scope="row" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    Packing Confirmation
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {PackingConfirmationOnDate[0]
                                                                        ? PackingConfirmationOnDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                                <TableCell align="right" style={{ fontSize: '17px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                                                                    {PackingConfirmationToDate[0]
                                                                        ? PackingConfirmationToDate[0].toFixed(2)
                                                                        : 0}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Grid>
                                        </Grid>

                                    </MDBox>
                                </Card>
                            )}
                            </Grid>
                            <Grid item xs={12}>
                            {tabValue == 1 && (
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
                                                    GR Report
                                                </MDTypography>
                                            </Grid>
                                            <Grid item xs={2}></Grid>
                                            <Grid item xs={1}>
                                                <Tooltip title="Download">
                                                    <IconButton
                                                        color="white"
                                                        onClick={() => downloadExcelGRTableData()}
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
                                           <div id="resultGRtable" />
                                         
                                         </Grid>
                                    </MDBox>
                                </Card>
                            )}
                            </Grid>
                        </Grid>
                    </MDBox>
                </>
            )}
        </DashboardLayout>
    );
}
