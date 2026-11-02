import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ReactSelect from "components/Select/ReactSelect";
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
import ClearAllIcon from "@mui/icons-material/ClearAll";
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

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";
import { Padding } from "@mui/icons-material";

export default function SMCS002() {
const [loading, setLoading] = React.useState(true);
const [isAdmin, setAdmin] = React.useState(false);
const [isRestricted, setRestricted] = React.useState(true);
const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
const [plant, setPlant] = useState([]);
const [selectedPlant, setSelectedPlant] = React.useState([0]);
const [selectedDecision, setselectedDecision]=React.useState([]);
const [selectedStatus, setselectedStatus]=React.useState([]);
const [selectPcNo, setPcNo]=React.useState('');
const [selectedCaster, setCaster]=React.useState([]);
const [heatData, setHeatData] = React.useState([]);
const [heatTable, setHeatTable] = React.useState([]);
const [heatList, setHeatList] = React.useState([]);
const [selectedHeatNo, setSelectedHeatNo] = React.useState([]);

    const Decisionlist = [
        { label: 'ADVISED FOR INSPECTION', value: '1' },
        { label: 'INSPECTION PENDING AS PER PLAN', value: '2' },
        { label: 'CHEMISTRY NOT OK', value: '3' },
        { label: 'PARTIAL DECISION', value: '4' },
        { label: 'HOLD HEAT', value: '5' },
        { label: 'DIMENSION NOT OK', value: '6' }, //others -6,7,8
        { label: 'SURFACE NOT OK', value: '7' },
        { label: 'MACRO NOT OK', value: '8' },
    ]
    const Statuslist = [{ label: 'All', value: 'A' },
        { label: 'Normal and Reversed', value: 'N' },
        { label: 'Salvaged/Merged', value: 'S' },  
    ]
    const Casterlist =[ 
        { label: 'All' ,value:'A'},
        { label: 'L1C1', value: 'L1C1' },
        { label: 'L1C2', value: 'L1C2' },
        { label: 'L1C3', value: 'L1C3' },
    ]

    const heatTableColumn = [
        {
            formatter: "rowSelection",
            titleFormatter: "rowSelection",
            hozAlign: "center",
            download: false,
            headerSort: false,
            frozen: true,
        },
        {
            title: "Prod Date",
            field: "ODM_PROD_DT",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Heat No",
            field: "ODM_HEAT_NO",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Caster",
            field: "ODM_CASTER_NO",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Seq No",
            field: "SEQ_NO",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Aim Pc",
            field: "ODM_PC_NO",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Aim Grade",
            field: "AIM_GRADE",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "AimQnty(To)",
            field: "ODM_QNTY",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Pieces(Nos.)",
            field: "ODM_NO_OF_PCS",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Sec.(mm)",
            field: "ODM_SEC",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Len(m)",
            field: "ODM_LENGTH",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Param Dev",
            field: "DEV_PROC_PARAM",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Adv Tnsp",
            field: "ODM_ADVICE_INSP",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "INSP_PENDING_AS_PER_PLAN",
            field: "INSP_PENDING_AS_PER_PLAN",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Partial",
            field: "ODM_PARTIAL_TAG",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Auto Deci",
            field: "ODM_AUTO_DECI",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: " Qnty Pend",
            field: " ODM_QNTY_PENDING",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Chemistry",
            field: "Chemistry",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Dimension",
            field: "Dimension",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Surface",
            field: "Surface",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Macro ",
            field: "Macro",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Status",
            field: "STATUS",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Transition ",
            field: "TRANSITION",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Hold Status ",
            field: "ODM_HOLD_STATUS",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "HOld Remarks ",
            field: "ODM_HOLD_REM",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
        {
            title: "Release Remarks ",
            field: "ODM_UNHOLD_REM",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            // frozen: true,
        },
    ]

    const validateUser = async (token) => {
        try {
            var plant = "";
            // if (serverDetails.PersonalNo === ``)
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
            var pageName = "SMCS002";

            var authDetails = await getScreenAuth(
                plant,
                userId,
                pageName,
                token.accessToken
            );
            // commenting out the screen auth
            if (authDetails) {
                setRestricted(false);

                if (authDetails.payload.PS_AUTH_DML == "Z") {
                    setRestricted(true);
                    setRestricted(false); // Added temp to view screen 
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
                //  }
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
                        Promise.all([getHeatList(items[0].value)]).finally(() => {
                            resolve();
                        });
                    }
                })
                .catch((f) => {
                    resolve();
                });
        });
    };
    
    const getHeatList = (Plant) => {
        return new Promise((resolve) => {
            GetAuthorization().then((token) => {
                var defaultOptions = {
                    headers: {
                        Authorization: "Bearer " + token.accessToken,
                    },
                };

                let data = {
                    plant: Plant,
                    // Action: Action ? Action : ''
                    // adid: serverDetails.PersonalNo,
                };
                setLoading(false);
                var url = "api/smcs002/getHeatList";
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
                            setHeatList(items);
                            resolve();
                        }
                    }).catch((f) => {
                        resolve();
                    });
            });
        })
    };

    const getHeatDetails = () => {  
        if (selectedPlant?.value === undefined) {
            alertify.error("Please select Plant");
            return;
        }
        var ProdDtFrm = document.getElementById("prodStartDate").value.split("T")[0];
        var ProdDtTo = document.getElementById("prodEndDate").value.split("T")[0];
        console.log('ProdDtFrm->', ProdDtFrm);
        
        if (ProdDtFrm==''){
            alertify.error('Please select from Date.');
            return;
        }
        if (ProdDtTo ==''){
            alertify.error('Please select To Date.');
            return;
        }
        if (new Date(ProdDtFrm) >= new Date(ProdDtTo)) {
            alertify.error("From date can not  be greater To date.");
            return;
        }
        setLoading(true);
        GetAuthorization().then((token) => {
            var defaultOptions = {
                headers: {
                    Authorization: "Bearer " + token.accessToken,
                },
            };
            var url;
            var data = {
                plant: selectedPlant.value ? selectedPlant.value : '',
                ProdDtFrm: ProdDtFrm ? ProdDtFrm : '',
                ProdDtTo: ProdDtTo ? ProdDtTo : '',
                Decision:selectedDecision.value,
                HeatNo: selectedHeatNo?selectedHeatNo.value:'',
                PcNo:selectPcNo||'',  
                Caster: selectedCaster ? selectedCaster.value: '',    
                Status:selectedStatus?selectedStatus.value: '',   
            };

            console.log(data)

            url = "api/smcs002/getHeatDetails"

            axiosAPI
                .post(url, data, defaultOptions)
                .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                        //reject(response.statusText);
                    } else {
                        if (response.data[1].length !== 0) {
                            setHeatData(response.data[1]);
                        } else {
                            alertify.error("No Data Found");
                        }
                    }
                })
                .catch((error) => {
                    setHeatData([]);
                })
                .finally((f) => {
                    setLoading(false);
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
            //page load functions here
            Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
                setLoading(false);
            });
        });
    }
    //page load
    useEffect(() => {
        fetchData();
    }, []); 

    useEffect(() => {
        if (heatData) {
          setHeatTable(
              new Tabulator("#heatTable", {
              //   pagination: "local", //enable local pagination.
                  data: heatData,
              columns: heatTableColumn,
              height: 340,
              layout: "fitDataStretch",
            })
          );
        }
    }, [heatData]);

    const clearFilter = () => {
        setProcessChartNo(null);
        setVersion(null);
        setProductGroup(null);
        setProductGD(null);
    };
    
    const handlePlantChange = (value) => {
        setSelectedPlant(value);
    };

    const handleDecisionChange =(value)=>{
        setselectedDecision(value);
    }
    const handleStatusChange =(value)=>{
        setselectedStatus(value);
    }
    const handleCasterChange =(value)=>{
        setCaster(value);
    }
    const handleHeatChange=(value)=>{
        setSelectedHeatNo(value);
    }

    return(
        <DashboardLayout>
            <DefaultNavbar
                routes={routes}
                module="Scrap Management"
                page="Heat Pending for Decision"
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
                 <MDBox pt={10} pb={3} >
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
                                            <Grid item xs={0.9}>
                                                {/* for clearing the data of the filter */}
                                                <Tooltip title="Clear" arrow>
                                                    <IconButton
                                                        color="white"
                                                        onClick={() => clearFilter()}
                                                    >
                                                        <ClearAllIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    <MDBox px={1.5} py={1.5}
                                    >
                                        <Grid container spacing={1}>
                                            <Grid item xs={2.5}>
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
                                                    size="small"
                                                    id="plant"
                                                    options={plant}
                                                    onChange={handlePlantChange}
                                                    value={selectedPlant}
                                                />
                                            </Grid>
                                            <Grid item xs={1.2}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    {" "}
                                                    Prod From Date *
                                                </MDTypography>
                        
                                                <input
                                                    size="small"
                                                    type="date"
                                                    style={{ height: "37px" }}
                                                    id="prodStartDate"
                                                    
                                                />
                                            </Grid>
                                            <Grid item xs={1.2}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    {" "}
                                                    Prod To Date *
                                                </MDTypography>
                        
                                                <input
                                                    size="small"
                                                    type="date"
                                                    style={{ height: "37px" }}
                                                    // isDisabled={tabValue == 1}
                                                    id="prodEndDate"
                                                   
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
                                                    Decision Status *
                                                </MDTypography>
                                                <ReactSelect
                                                    size="small"
                                                    id="action"
                                                    options={Decisionlist}
                                                    onChange={handleDecisionChange}
                                                    value={selectedDecision}
                                                />
                                            </Grid>
                                            <Grid item xs={1.4}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    Heat No.
                                                </MDTypography>
                                                <ReactSelect
                                                    size="small"
                                                    id="action"
                                                    options={heatList}
                                                     onChange={handleHeatChange}
                                                    value={selectedHeatNo}
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
                                                    PC No.
                                                </MDTypography>
                                                <MDInput
                                                    size="small"
                                                    id="PcNo"
                                                    onChange={(e) => { setPcNo(e.target.value) }}
                                                    value={selectPcNo || ""}
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
                                                    Caster *
                                                </MDTypography>
                                                <ReactSelect
                                                    size="small"
                                                    id="action"
                                                    options={Casterlist}
                                                    onChange={handleCasterChange}
                                                    value={selectedCaster}
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
                                                    Status *
                                                </MDTypography>
                                                <ReactSelect
                                                    size="small"
                                                    id="action"
                                                    options={Statuslist}
                                                    onChange={handleStatusChange}
                                                    value={selectedStatus}
                                                />
                                            </Grid>
                                            
                                            <Grid item xs={1}>
                                                <MDButton
                                                    style={{ marginTop: "1.5rem" }}
                                                    size="small"
                                                    color="info"
                                                    onClick={() => getHeatDetails()}
                                                >
                                                    Submit
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                                <Card //style={{ height: '480px', overflow: 'hidden' ,marginTop:2 ,} }
                                >
                                    <MDBox px={1.5} py={2} >
                                        <Grid
                                            container
                                            direction="row"
                                            justifyContent="flex-end"
                                            alignItems="center"
                                        ></Grid>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12}>
                                                <div id="heatTable" />
                                                <br />
                                                <p
                                                    color="black"
                                                    style={{
                                                        color: "black",
                                                        paddingLeft: "1rem",
                                                        marginTop: "-1rem",
                                                    }}
                                                >
                                                    Showing 1 to {heatData.length} of{" "}
                                                    {heatData.length} entries
                                                </p>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                    <MDBox 
                                        sx={{position: 'fixed', bottom: 0, width:'95%'}}
                                        mx={2}
                                        mt={-3}
                                        py={0.25}
                                        px={2}
                                        lignItems="center"
                                        justifyContent="center"  
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
                                                <MDButton
                                                    // style={{ marginTop: "1rem" }}
                                                    size="small"
                                                    color="primary"
                                                // onClick={() => getData(true)}
                                                // onClick={() => getBusinessUnit(true)}
                                                >
                                                    Show Process Parameter
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.5}>
                                                <MDButton
                                                    size="small"
                                                    color="primary"
                                                // onClick={() => getData(true)}
                                                // onClick={() => getBusinessUnit(true)}
                                                >
                                                    Give Quality Decision
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <MDButton
                                                    size="small"
                                                    color="primary"
                                                // onClick={() => getData(true)}
                                                // onClick={() => getBusinessUnit(true)}
                                                >
                                                    Inspection Report Entry
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <MDButton
                                                    size="small"
                                                    color="primary"
                                                // onClick={() => getData(true)}
                                                // onClick={() => getBusinessUnit(true)}
                                                >
                                                    Advice For Inspections
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={2.5}>
                                                <MDButton
                                                    size="small"
                                                    color="primary"
                                                // onClick={() => getData(true)}
                                                // onClick={() => getBusinessUnit(true)}
                                                >
                                                    Declare To Give Decision In SAP
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1}>
                                                <MDButton
                                                    size="small"
                                                    color="primary"
                                                // onClick={() => getData(true)}
                                                // onClick={() => getBusinessUnit(true)}
                                                >
                                                    Hold Heat
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </Grid>
                        </Grid>
                    </MDBox>
                </>)}

        </DashboardLayout>
    )
}