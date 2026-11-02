// AllInOneDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import alertify from "alertifyjs";
import "../../alertify.css";
// MUI + MD components (only from your allowed list)
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import ReactSelect from "components/Select/ReactSelect";
import serverDetails from "../../variables/serverDetails";
import { GetAuthorization } from "../../utils";
import axiosAPI from "../../axiosAPI";
import jwt from "jsonwebtoken";
import Preloader from "components/Preloader/Preloader";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Icons (allowed list)
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

// Chart.js (allowed)
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
Chart.register(ChartDataLabels);

// Utilities (allowed)
import ExcelJS from "exceljs";
import { useReactToPrint } from "react-to-print";
import { use } from "react";


export default function TTSM049() {
    // --- State ---
    const [loading, setLoading] = React.useState(true);
    const [isRestricted, setRestricted] = React.useState(false); // Temp false.
    const [isAdmin, setAdmin] = React.useState(false);
    const [plant, setPlant] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState([]);
    const [totalQty, setTotalQty] = useState(0);
    const [filters, setFilters] = useState({
        sfgSize: null,        // ✅ single value
        sfgThickness: null,  // ✅ single value
        sfgGrad: null,       // ✅ TCD_SFG_GRAD
        sfgOdia: null,       // ✅ TCD_SFG_ODIA
        //fg filter
        fgPcode: null,       // ✅ single value
        fgGrade: null,
        fgOdia: null,        // ✅ TCD_OD
        fgThickness: null,   // ✅ TCD_THICKNESS
        segment: [],
        zone: [],
        mill: [],
    });
    const [rawData, setRawData] = useState([]);     // FULL API data

    /** --------------- Authintication logic --------------- **/
    const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
        new Promise((resolve, reject) => {
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
            var pageName = "TTSM049";
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

    const getCampaignDashBoardData = async () => {
        if (selectedPlant == undefined || selectedPlant?.value == '') {
            alertify.error('Please select Plant');
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
            };
            var url = "api/TTSM049/getCampaignDashBoardData";
            axiosAPI.post(url, data, defaultOptions)
                .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                        reject(response.statusText);
                    } else {
                        setRawData(response.data || []);
                        // setCampaignDashBoardData(response.data);
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
    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, }));
    };

    // Prepairing DropDown list from raw data.
    const sfgSizeOptions = React.useMemo(() => {
        const vals = [...new Set(rawData.map(r => r.TCD_SIZE).filter(v => v != null))];
        return vals.sort((a, b) => a - b).map(v => ({ label: v, value: v }));
    }, [rawData]);

    const sfgThicknessOptions = React.useMemo(() => {
        const vals = [...new Set(rawData.map(r => r.TCD_SFG_THICKNESS).filter(v => v != null))];
        return vals.sort((a, b) => a - b).map(v => ({ label: v, value: v }));
    }, [rawData]);

    const fgPcodeOptions = React.useMemo(() => {
        const vals = [...new Set(rawData.map(r => r.TCD_FG_PCODE).filter(Boolean))];
        return vals.map(v => ({ label: v, value: v }));
    }, [rawData]);

    const sfgGradeOptions = React.useMemo(() => {
        const vals = [...new Set(rawData.map(r => r.TCD_SFG_GRAD).filter(Boolean))];
        return vals.map(v => ({ label: v, value: v }));
    }, [rawData]);

    const sfgOdiaOptions = React.useMemo(() => {
        const vals = [...new Set(rawData.map(r => r.TCD_SFG_ODIA).filter(v => v != null))];
        return vals.sort((a, b) => a - b).map(v => ({ label: v, value: v }));
    }, [rawData]);

    const fgOdiaOptions = React.useMemo(() => {
        const vals = [...new Set(rawData.map(r => r.TCD_OD).filter(v => v != null))];
        return vals.sort((a, b) => a - b).map(v => ({ label: v, value: v }));
    }, [rawData]);

    const fgThicknessOptions = React.useMemo(() => {
        const vals = [...new Set(rawData.map(r => r.TCD_THICKNESS).filter(v => v != null))];
        return vals.sort((a, b) => a - b).map(v => ({ label: v, value: v }));
    }, [rawData]);

    //---- sected rows-----
    const filteredRows = React.useMemo(() => {
        let rows = rawData;

        // ✅ SFG SIZE
        if (filters.sfgSize) {
            rows = rows.filter((r) => r.TCD_SIZE === filters.sfgSize.value);
        }

        // ✅ SFG THICKNESS
        if (filters.sfgThickness) {
            rows = rows.filter((r) => Number(r.TCD_SFG_THICKNESS) === Number(filters.sfgThickness.value));
        }

        // ✅ FG PCODE
        if (filters.fgPcode) {
            rows = rows.filter((r) => r.TCD_FG_PCODE === filters.fgPcode.value);
        }


        if (filters.sfgGrad) {
            rows = rows.filter(
                r => r.TCD_SFG_GRAD === filters.sfgGrad.value
            );
        }

        if (filters.sfgOdia) {
            rows = rows.filter(
                r => Number(r.TCD_SFG_ODIA) === Number(filters.sfgOdia.value)
            );
        }

        if (filters.fgOdia) {
            rows = rows.filter(
                r => Number(r.TCD_OD) === Number(filters.fgOdia.value)
            );
        }

        if (filters.fgThickness) {
            rows = rows.filter(
                r => Number(r.TCD_THICKNESS) === Number(filters.fgThickness.value)
            );
        }

        // ✅ EXISTING FILTERS (already working)
        if (filters.segment.length > 0) {
            const set = new Set(filters.segment);
            rows = rows.filter(r => set.has(r.TCD_MATERIAL_GROUP));
        }

        if (filters.zone.length > 0) {
            const set = new Set(filters.zone);
            rows = rows.filter(r => set.has(r.TCD_ZONE));
        }

        if (filters.mill.length > 0) {
            const set = new Set(filters.mill);
            rows = rows.filter(r => set.has(r.TCD_TUBE_MILL));
        }
        return rows;
    }, [rawData, filters]);


    const summaryData = React.useMemo(() => {
        const sum = (key) =>
            filteredRows.reduce((a, r) => a + (Number(r[key]) || 0), 0);

        return [
            { label: "SAP BTP", value: sum("TCD_MES_BTP") },
            { label: "Bal to Despatch", value: sum("TCD_BTD") },
            { label: "Despatched", value: sum("TCD_DISPATCHED") },
            { label: "Sign Off SKUs", value: sum("TCD_SIGN_OFF2") },
            { label: "GR Done", value: sum("TCD_GR_DONE") },
            { label: "Bal to GR", value: sum("TCD_BALANCE_TO_GR") },
            { label: "Current WIP (Ord)", value: sum("TCD_CURRENT_WIP_ORD") },
            { label: "Current FG (Mat)", value: sum("TCD_CURRENT_FG_MAT") },
            { label: "Bal To Roll MES", value: sum("TCD_BTR_MES") },
            { label: "Slit Covered >5MT", value: sum("TCD_SLIT_5MT") },
            { label: "CRM FG", value: sum("TCD_CRM_FG_1") },
            { label: "CRM CRS", value: sum("TCD_CRM_CRS_1") },
            { label: "CRM WIP", value: sum("TCD_CRM_WIP_1") },
            { label: "Bal Slit Required", value: sum("TCD_BAL_SLIT_REQUIRED") },
            { label: "CRM BTD", value: sum("TCD_CRM_BALANCE_TO_DESPATCH") },
            { label: "Ground HR Stock", value: sum("TCD_GROUND_HR_STOCK") },
        ];
    }, [filteredRows]);

    const SEGMENT_OPTS = ["APH", "COR", "BOT", "CEW", "ERW"];
    const ZONE_OPTS = ["North", "West", "South", "East", "Boiler"];
    const MILL_OPTS = ["Mill-1", "Mill-2", "Mill-3", "Mill-4", "Mill-5", "Mill-7"];

    // --- Chart config (Chart.js + datalabels) ---
    const chartData = React.useMemo(() => ({
        labels: summaryData.map((d) => d.label),
        datasets: [{
            label: "SUMMARY",
            data: summaryData.map((d) => d.value),
            backgroundColor: "#1976d2",
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.7,
        },],
    }), [summaryData]
    );

    useEffect(() => {
        const allowedLabels = ["CRM WIP", "Current FG (Mat)", "Current WIP (Ord)", "Slit Covered >5MT"];

        const total = summaryData.reduce((acc, item) => {
            return allowedLabels.includes(item.label)? acc + (Number(item.value) || 0): acc;
        }, 0);

        setTotalQty(total.toFixed(3));
    }, [summaryData]);

    const chartOptions = React.useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                color: "#111",
                anchor: "end",
                align: "end",
                offset: 2,
                font: { size: 10, weight: "bold" },
                formatter: (v) => (v ? v.toLocaleString() : ""),
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw?.toLocaleString?.() || ctx.raw}`,
                },
            },
        },
        scales: {
            x: { ticks: { maxRotation: 0, minRotation: 0, autoSkip: false, font: { size: 10 } }, },
            y: { beginAtZero: true, ticks: { font: { size: 10 } }, },
        },
    }), []);

    // --- Handlers ---

    const toggleInArray = (key, value) =>
        setFilters((old) => {
            const exists = old[key].includes(value);
            const next = exists ? old[key].filter((x) => x !== value) : [...old[key], value];
            return { ...old, [key]: next };
        });

    const clearGroup = (key) => setFilters((old) => ({ ...old, [key]: [] }));
    const clearAll = () =>{
        setFilters({
            sfgSize: null,
            sfgThickness: null,
            sfgOd: null,
            sfgGrad: null,
            //fg filter
            fgPcode: null,
            fgOd: null,
            fgThick: null,
            fgGrade: null,
            segment: [],
            zone: [],
            mill: [],
        });
        setRawData([]);
    }
    // Excel export (ExcelJS only)
    const exportToExcel = async () => {
        const wb = new ExcelJS.Workbook();
        const ws = wb.addWorksheet("Summary");
        ws.columns = [
            { header: "Metric", key: "label", width: 28 },
            { header: "Value", key: "value", width: 14 },
        ];
        summaryData.forEach((row) => ws.addRow(row));
        const buf = await wb.xlsx.writeBuffer();
        const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "summary_dummy.xlsx";
        a.click();
        URL.revokeObjectURL(url);
    };

    // Print only the chart area
    const chartPrintRef = useRef(null);
    const handlePrint = useReactToPrint({ content: () => chartPrintRef.current });

    const handlePlantChange = (value) => {
        if (value) {
            setSelectedPlant(value);
        }
        setRawData([]);
    };


    return (
        <DashboardLayout>
            <DefaultNavbar routes={routes} module="Reports" page="Module Dashboard" />
            <Grid mb={10}
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
            >
                {loading && (<Preloader />)}
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
            {isRestricted == false && (<>
                {/* Left quick filter panel */}
                <Card>
                    <Grid item xs={12}>
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
                                <Grid item xs={4}></Grid>
                                <Grid item xs={2}>
                                    <Tooltip title="Clear all">
                                        <IconButton color="white" onClick={clearAll} >
                                            <ClearAllIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Export to Excel">
                                        <IconButton color="white" onClick={exportToExcel} >
                                            <DownloadForOfflineIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Print chart">
                                        <IconButton color="white" onClick={handlePrint} >
                                            <Icon>print</Icon>
                                        </IconButton>
                                    </Tooltip>
                                    {/* </Box> */}
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Grid>

                    <MDBox p={2}>
                        <Grid //spacing={1}
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center">
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
                            <Grid item xs={1}>
                                <MDButton
                                    style={{ marginTop: "1.5rem" }}
                                    size="small"
                                    color="info"
                                    onClick={() => getCampaignDashBoardData()}
                                >
                                    Submit
                                </MDButton>
                            </Grid>
                            {/* Need to add filter od fg all*/}
                            <Grid item xs={1.5} >
                                <MDTypography
                                    fontWeight="regular"
                                    fontSize="small"
                                    textTransform="capitalize"
                                    variant="h6"
                                    color={"dark"}
                                    noWrap
                                >
                                    SFG Size
                                </MDTypography>
                                <ReactSelect
                                    id="sfgSize"
                                    options={sfgSizeOptions}
                                    value={filters.sfgSize}
                                    onChange={(val) => updateFilter("sfgSize", val)}
                                />
                            </Grid>
                            <Grid item xs={1} >
                                <MDTypography
                                    fontWeight="regular"
                                    fontSize="small"
                                    textTransform="capitalize"
                                    variant="h6"
                                    color={"dark"}
                                    noWrap
                                >
                                    SFG Thickness
                                </MDTypography>
                                <ReactSelect
                                    id="sfgThickness"
                                    options={sfgThicknessOptions}
                                    value={filters.sfgThickness}
                                    onChange={(val) => updateFilter("sfgThickness", val)}
                                />
                            </Grid>
                            <Grid item xs={1} >
                                <MDTypography
                                    fontWeight="regular"
                                    fontSize="small"
                                    textTransform="capitalize"
                                    variant="h6"
                                    color={"dark"}
                                    noWrap
                                >
                                    FG Pcode
                                </MDTypography>
                                <ReactSelect
                                    id="fgPcode"
                                    options={fgPcodeOptions}
                                    value={filters.fgPcode}
                                    onChange={(val) => updateFilter("fgPcode", val)}
                                />
                            </Grid>
                            <Grid item xs={1} >
                                <MDTypography
                                    fontWeight="regular"
                                    fontSize="small"
                                    textTransform="capitalize"
                                    variant="h6"
                                    color={"dark"}
                                    noWrap
                                >
                                    SFG Grade
                                </MDTypography>
                                <ReactSelect
                                    id="sfgGrad"
                                    options={sfgGradeOptions}
                                    value={filters.sfgGrad}
                                    onChange={(val) => updateFilter("sfgGrad", val)}
                                />
                            </Grid>
                            <Grid item xs={1} >
                                <MDTypography
                                    fontWeight="regular"
                                    fontSize="small"
                                    textTransform="capitalize"
                                    variant="h6"
                                    color={"dark"}
                                    noWrap
                                >
                                    SFG OD
                                </MDTypography>
                                <ReactSelect
                                    id="sfgOdia"
                                    options={sfgOdiaOptions}
                                    value={filters.sfgOdia}
                                    onChange={(val) => updateFilter("sfgOdia", val)}
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
                                    FG OD
                                </MDTypography>
                                <ReactSelect
                                    id="sfgGrad"
                                    options={fgOdiaOptions}
                                    value={filters.fgOdia}
                                    onChange={(val) => updateFilter("fgOdia", val)}
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
                                    FG Thickness
                                </MDTypography>
                                <ReactSelect
                                    id="sfgGrad"
                                    options={fgThicknessOptions}
                                    value={filters.fgThickness}
                                    onChange={(val) => updateFilter("fgThickness", val)}
                                />
                            </Grid>
                            <Grid item xs={4}>
                            </Grid>
                            <Grid item xs={1.5} >
                                <Tooltip title="CRM WIP + Current FG (Mat) + Current WIP (Ord) + Slit Covered > 5MT">
                                    <MDTypography variant="h6" fontWeight="bold">
                                        Total Qty
                                    </MDTypography>
                                </Tooltip>
                                <MDInput
                                    name="totalQty"
                                    value={totalQty || ""}
                                    inputProps={{ readOnly: true }}
                                />
                                {/* <MDTypography variant="h6" color="info" >
                                    {totalQty.toLocaleString()} MT
                                </MDTypography> */}
                            </Grid>
                        </Grid>
                    </MDBox>
                </Card>
                {/* Main content */}
                <Grid item xs={12} pt={1}>
                    <Card>
                        <MDBox p={2} >
                            {/* Top filters: SEGMENT / ZONE / MILL */}
                            <Grid container
                                spacing={1}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center">
                                {/* SEGMENT */}
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined">
                                        <Box p={1.2} display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>SEGMENT</Typography>
                                            <IconButton size="small" onClick={() => clearGroup("segment")}><ClearAllIcon fontSize="small" /></IconButton>
                                        </Box>
                                        <FormGroup>
                                            <Box px={1.2} pb={1} display="flex" alignItems="center" justifyContent="space-between">
                                                {SEGMENT_OPTS.map((opt) => (
                                                    <FormControlLabel
                                                        key={opt}
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={filters.segment.includes(opt)}
                                                                onChange={() => toggleInArray("segment", opt)}
                                                            />
                                                        }
                                                        label={<Typography variant="caption">{opt}</Typography>}
                                                    />
                                                ))}
                                            </Box>
                                        </FormGroup>
                                    </Paper>
                                </Grid>

                                {/* ZONE */}
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined">
                                        <Box p={1.2} display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>ZONE</Typography>
                                            <IconButton size="small" onClick={() => clearGroup("zone")}><ClearAllIcon fontSize="small" /></IconButton>
                                        </Box>
                                        <FormGroup>
                                            <Box px={1.2} pb={1} display="flex" alignItems="center" justifyContent="space-between">
                                                {ZONE_OPTS.map((opt) => (
                                                    <FormControlLabel
                                                        key={opt}
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={filters.zone.includes(opt)}
                                                                onChange={() => toggleInArray("zone", opt)}
                                                            />
                                                        }
                                                        label={<Typography variant="caption">{opt}</Typography>}
                                                    />
                                                ))}
                                            </Box>
                                        </FormGroup>
                                    </Paper>
                                </Grid>

                                {/* MILL */}
                                <Grid item xs={12} md={4}>
                                    <Paper variant="outlined">
                                        <Box p={1.2} display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography variant="caption" sx={{ fontWeight: 700 }}>Mill no.</Typography>
                                            <IconButton size="small" onClick={() => clearGroup("mill")}><ClearAllIcon fontSize="small" /></IconButton>
                                        </Box>
                                        <FormGroup>
                                            <Box px={1} pb={1} display="flex" alignItems="center" justifyContent="space-between">
                                                {MILL_OPTS.map((opt) => (
                                                    <FormControlLabel
                                                        key={opt}
                                                        control={
                                                            <Checkbox
                                                                size="small"
                                                                checked={filters.mill.includes(opt)}
                                                                onChange={() => toggleInArray("mill", opt)}
                                                            />
                                                        }
                                                        label={<Typography variant="caption">{opt}</Typography>}
                                                    />
                                                ))}
                                            </Box>
                                        </FormGroup>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </Grid>
                {/* Summary area */}
                <Grid m={1}>
                    <Box mt={2} sx={{ bgcolor: "primary.main", borderRadius: 6, p: { xs: 1, md: 2 } }}>
                        <Paper elevation={0} sx={{ p: 2, borderRadius: 4, minHeight: 380 }}>
                            <Typography variant="subtitle2" align="center" sx={{ fontWeight: 700, mb: 1 }}>
                                SUMMARY
                            </Typography>
                            <Box ref={chartPrintRef} sx={{ height: 360, mt: 2 }}>
                                <Bar data={chartData} options={chartOptions} />
                            </Box>
                        </Paper>
                    </Box>
                    <Box mt={1} display="flex" justifyContent="flex-end">
                        <Typography variant="caption" color="text.secondary">
                            All data from Module
                        </Typography>
                    </Box>
                </Grid>
            </>)}
        </DashboardLayout>
    );
}