import React, { useEffect, useState, useRef } from "react";
// code modified on 15-09-2025
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextareaAutosize from '@mui/material/TextareaAutosize';
// Material Dashboard 2 React components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import Switch from "@mui/material/Switch";
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
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// Data
import MDAlert from "components/MDAlert";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import TabIcon from "@mui/icons-material/Tab";
import Tooltip from "@mui/material/Tooltip";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";
import { GetAuthorization } from "utils";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
};

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

export default function QueryPage() {
    const [loading, setLoading] = React.useState(false);
    const [isAdmin, setAdmin] = React.useState(false);
    const [isRestricted, setRestricted] = React.useState(true);
    const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
    const [tabValue, setTabValue] = useState(0);
    const handleSetTabValue = (event, newValue) => {
        setTabValue(newValue);
    };
    const [plant, setPlant] = useState([
        { label: "-Select", value: "" },
        { label: "Select Operation", value: "SelectOperation" },
        { label: "Execute Operation", value: "ExecuteOperation" },
        { label: "DECLARE", value: "DECLARE" },
    ]);
    const [selectedPlant, setSelectedPlant] = React.useState(null);
    const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
    const [showSaveMsgError, setShowSaveMsgError] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const [queryState, setQueryState] = useState("");
    const [resultDataTable, setResultDataTable] = useState(null);
    const [resultData, setResultData] = useState([]);
    const [resultDataClm, setResultDataClm] = useState([]);
    const [resultExcData, setResultExeData] = useState(null);
    const [resultExcErrData, setResultExeErrData] = useState(null);

    const [allValues, setAllValues] = useState({
        Server: "",
        Port: "",
        DBName: "",
        testId: "",
        testCode: "",
    });
    const [valueRadio, setValueRadio] = React.useState("S");
    const [connMsg, setConnMsg] = React.useState("");

    function fetchData() {
        if (serverDetails.devMode) {
            setRestricted(false);
        }

        setLoading(true);
        GetAuthorization().then((token) => {
            validateUser(token);
            //page load functions here
            // getPlantList();
            Promise.all([getUserScreenAccess(token.accessToken)]).finally(() => {
                setLoading(false);
            });
        });
    }

    useEffect(() => {
        var o = localStorage.getItem("dbLogin");
        var salt = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
        if (o) {
            o = decodeURI(o);
            if (salt && o.indexOf(salt) != 0)
                throw new Error('object cannot be decrypted');
            o = o.substring(salt.length).split('');
            for (var i = 0, l = o.length; i < l; i++)
                if (o[i] == '{')
                    o[i] = '}';
                else if (o[i] == '}')
                    o[i] = '{';
            var d = JSON.parse(o.join(''));
            console.log(d, "+++++++++++");

            if (d) {
                setConnMsg("Connection Restored");
                var s = d.dbUri.split(/[:/]/);
                setAllValues({
                    Server: s[0],
                    Port: s[1],
                    DBName: s[2],
                    testId: d.testId,
                    testCode: d.testCode,
                });
            } else {
                setConnMsg("");
            }
        }
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
            var pageName = "LDSC003";

            var authDetails = await getScreenAuth(
                plant,
                userId,
                pageName,
                token.accessToken
            );

            if (authDetails) {
                setRestricted(false);
            } else {

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
        if (resultData && resultData.length > 0 && resultDataClm && resultDataClm.length > 0) {
            setResultDataTable(
                new Tabulator("#resulttable", {
                    data: resultData,
                    columns: resultDataClm,
                    maxHeight: 400,
                    layout: "fitDataFill",
                    pagination: "local", //enable local pagination.
                    paginationSize: 12,
                })
            );
        }
    }, [resultData, resultDataClm]);

    const getUserScreenAccess = async (accessToken) => {
        return new Promise((resolve) => {
            var defaultOptions = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            };

            let data = {
                user: serverDetails.PersonalNo,
            };

            var url = "api/users/execQueryScreenAccess";
            axiosAPI.post(url, data, defaultOptions).then((response) => {
                console.log(response.data.rows[0][0])
                if (response.statusText != "" && response.statusText != "OK") {
                    setLoading(false);
                } else {
                    if (response.data.rows[0][0] != 1) {
                        setRestricted(true);
                        setAdmin(false);
                        setLoading(false);
                    }
                    setLoading(false);
                }
            });
        });
    };

    const handlePlantChange = (value) => {
        setSelectedPlant(value);
        setQueryState("");
    };

    const checkQueryType = () => {
        var getLoc = localStorage.getItem("dbLogin");

        if (getLoc) {
            if (selectedPlant?.value == "ExecuteOperation") {
                var a = queryState.split(" ");
                if (a[0].toUpperCase() == "INSERT") {
                    ExecuteQuery();
                } else {
                    confirmExecQuery();
                }
            } else {
                ExecuteQuery();
            }
        } else {
            alertify.error("database connection could not establish, please check your configuration !!!")
        }

    };

    const confirmExecQuery = () => {
        setResultExeErrData('');
        setResultExeData('');
        if (!selectedPlant?.value) {
            alertify.error("Please select Type of query");
            return
        }
        if (queryState == "") {
            alertify.error("Please enter query");
            return
        }
        var url = "api/users/confirmExecQuery";
        var txt = queryState?.split("\n")?.join(' ');
        var t = txt.replace(/\n/g, '');
        var str = t.replace(/\s\s+/g, ' ');
        var b = str.replace(/"/g, "'");
        var data = {
            queryType: selectedPlant?.value,
            query: b,
            dt: localStorage.getItem("dbLogin")
        };

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
                        setResultExeErrData(response?.error?.response?.data?.name??"Something wents wrong!");
                    } if (response?.data?.rows) {
                        alertify.confirm(
                            `Number of rows will get effected = ${response?.data?.rows?.length}!`, "",
                            function () {
                                setTimeout(function () {
                                    alertify.confirm(
                                        `Do you want to Execute this?`, "",
                                        function () {
                                            ExecuteQuery();
                                        },
                                        function () {
                                            console.log("Cancel");
                                        }
                                    );
                                }, 1000)
                            },
                            function () {
                                console.log("Cancel");
                            }
                        );
                    } else {
                        setResultExeData(response?.data)
                    }
                })
                .finally((f) => {
                    setLoading(false);
                });
        });
    };

    const ExecuteQuery = () => {
        setResultExeErrData('');
        setResultExeData('');
        if (!selectedPlant?.value) {
            alertify.error("Please select Type of query");
            return
        }
        if (queryState == "") {
            alertify.error("Please enter query");
            return
        }
        var url = "api/users/execQuery";
        var txt = queryState?.split("\n")?.join(' ');
        var t = txt.replace(/\n/g, '');
        var str = t.replace(/\s\s+/g, ' ');
        var b = str.replace(/"/g, "'");


        var data = {
            queryType: selectedPlant?.value,
            query: b,
            dt: localStorage.getItem("dbLogin")
        };

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
                    console.log(response)
                    if (response.statusText != "" && response.statusText != "OK") {
                        setResultExeErrData(response?.error?.response?.data?.name??"Something wents wrong!");
                    } else {
                        if (selectedPlant?.value == "SelectOperation") {
                            setResultData(response.data[1]);
                            setResultDataClm(response.data[0]);
                        } else {
                            setResultExeData(response?.data)
                        }
                    }
                })
                .finally((f) => {
                    setLoading(false);
                });
        });
    };

    function encrypt(o, salt) {
        o = JSON.stringify(o).split('');
        for (var i = 0, l = o.length; i < l; i++)
            if (o[i] == '{')
                o[i] = '}';
            else if (o[i] == '}')
                o[i] = '{';
        return encodeURI(salt + o.join(''));
    }

    const testConnection = async () => {
        setConnMsg("")
        var url = "api/users/testConnection";
        if (allValues.Server == "" || allValues.Port == "" || allValues.DBName == "" || allValues.testId == "" || allValues.testCode == "") {
            alertify.error("All filds are mendetory !")
            return;
        }
        var data = {
            dbUri: `${allValues.Server + ':' + allValues.Port + '/' + allValues.DBName}`,
            testId: allValues.testId,
            testCode: allValues.testCode,
        };

        var salt = "21144S3984CEF5c659C44ZCK37299B4208375IG7DC792A30";
        var encrypted = encrypt(data, salt);
        localStorage.setItem("dbLogin", encrypted);
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
                        if (response?.data?.errorNum == 1017) {
                            alertify.error("Error: ORA-01017: invalid username/password; logon denied");
                            setConnMsg("Error: ORA-01017: invalid username/password; logon denied")
                            setLoading(false);
                        } else if (response?.data?.metaData != 0) {
                            setConnMsg("Connection Successful")
                        }
                        setLoading(false);
                    } else {
                        if (response?.data?.errorNum == 1017) {
                            alertify.error("Error: ORA-01017: invalid username/password; logon denied");
                            setConnMsg("Error: ORA-01017: invalid username/password; logon denied")
                            setLoading(false);
                        } else if (response?.data?.metaData != 0) {
                            setConnMsg("Connection Successful")
                        }
                        setLoading(false);

                    }
                })
                .finally((f) => {
                    setLoading(false);
                });
        });
    }

    const disconnect = async () => {
        localStorage.removeItem('dbLogin');
    }

    const handleChangeQuery = (e) => {
        console.log(e.target.value);
        setQueryState(e.target.value);
    };

    const handleChangeServerDetails = (e) => {
        setAllValues({ ...allValues, [e.target.name]: e.target.value });
    };

    const handleRadioChange = (event) => {
        setValueRadio(event.target.value);
    };

    return (
        <DashboardLayout>
            <DefaultNavbar
                routes={routes}
                module="Test Connection"
                page="Test Connection"
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
                            <Grid item xs={24}>
                                <Card>
                                    <MDBox
                                        mx={2}
                                        mt={-3}
                                        py={1}
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
                                                    Server Details
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    <MDBox px={3} py={3}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={1.5}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    Server*
                                                </MDTypography>
                                                <MDInput
                                                    label=""
                                                    name="Server"
                                                    inputProps={{ maxLength: 13 }}
                                                    value={allValues.Server || ""}
                                                    onChange={(e) => handleChangeServerDetails(e)}
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
                                                    Port*
                                                </MDTypography>
                                                <MDInput
                                                    label=""
                                                    name="Port"
                                                    inputProps={{ maxLength: 4 }}
                                                    value={allValues.Port || ""}
                                                    onChange={(e) => handleChangeServerDetails(e)}
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
                                                    DB Name*
                                                </MDTypography>
                                                <MDInput
                                                    label=""
                                                    name="DBName"
                                                    value={allValues.DBName || ""}
                                                    onChange={(e) => handleChangeServerDetails(e)}
                                                />
                                            </Grid>

                                            <Grid item xs={2}>
                                                <FormControl style={{ marginTop: "1rem" }}>
                                                    <RadioGroup
                                                        row
                                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                                        name="row-radio-buttons-group"
                                                        value={valueRadio}
                                                        onChange={handleRadioChange}
                                                    >
                                                        <FormControlLabel
                                                            value="S"
                                                            control={<Radio />}
                                                            label="SID"
                                                        />
                                                        <FormControlLabel
                                                            value="M"
                                                            control={<Radio />}
                                                            label="Service Name"
                                                        />
                                                    </RadioGroup>
                                                </FormControl>
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
                                                    Test Id*
                                                </MDTypography>
                                                <MDInput
                                                    label=""
                                                    name="testId"
                                                    inputProps={{ maxLength: 7 }}
                                                    value={allValues.testId || ""}
                                                    onChange={(e) => handleChangeServerDetails(e)}
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
                                                    Test Code*
                                                </MDTypography>
                                                <MDInput
                                                    type="password"
                                                    label=""
                                                    name="testCode"
                                                    value={allValues.testCode || ""}
                                                    onChange={(e) => handleChangeServerDetails(e)}
                                                />
                                            </Grid>

                                            <Grid item xs={1.3}>
                                                <MDButton
                                                    style={{ marginTop: "1.5rem" }}
                                                    size="small"
                                                    color="info"
                                                    onClick={() => testConnection(true)}
                                                >

                                                    Test Connection
                                                </MDButton>
                                            </Grid>
                                            <Grid item xs={1.3}>
                                                <MDButton
                                                    style={{ marginTop: "1.5rem" }}
                                                    size="small"
                                                    color="info"
                                                    onClick={() => disconnect(true)}
                                                >

                                                    Disconnect
                                                </MDButton>

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
                                                    {!connMsg && (
                                                        <h4 style={{ color: "red" }}>
                                                            All filds are mendetory !!!
                                                        </h4>
                                                    )}

                                                    {connMsg && (
                                                        <h4 style={{ color: "green" }}>
                                                            {connMsg}
                                                        </h4>
                                                    )}

                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </Grid>

                            <Grid item xs={24}>
                                <Card>
                                    <MDBox
                                        mx={2}
                                        mt={-3}
                                        py={1}
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
                                                    Test Connection
                                                </MDTypography>
                                            </Grid>
                                        </Grid>
                                    </MDBox>

                                    <MDBox px={3} py={3}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={3} style={{ zIndex: 5 }}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    Select Type of Query
                                                </MDTypography>
                                                <ReactSelect
                                                    id="plant"
                                                    options={plant}
                                                    onChange={handlePlantChange}
                                                    value={selectedPlant}
                                                />
                                            </Grid>

                                            <Grid item xs={6} style={{ zIndex: 5 }}>
                                                <MDTypography
                                                    fontWeight="regular"
                                                    fontSize="small"
                                                    textTransform="capitalize"
                                                    variant="h6"
                                                    color={"dark"}
                                                    noWrap
                                                >
                                                    Enter Query
                                                </MDTypography>
                                                <TextareaAutosize
                                                    maxRows={10}
                                                    aria-label="maximum height"
                                                    placeholder="Maximum 4 rows"
                                                    defaultValue=""
                                                    value={queryState}
                                                    onChange={(e) => handleChangeQuery(e)}
                                                    style={{ maxWidth: "100%", minWidth: "100%", height: "100%", borderRadius: "6px", backgroundColor: "#f5f5dc" }}
                                                />
                                            </Grid>

                                            <Grid item xs={1}>
                                                <MDButton
                                                    style={{ marginTop: "1.5rem" }}
                                                    size="small"
                                                    color="info"
                                                    onClick={() => checkQueryType(true)}
                                                >
                                                    {" "}
                                                    Execute{" "}
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Card>
                            </Grid>
                            <Grid item xs={12}>
                                {selectedPlant?.value == "SelectOperation" && (
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
                                                        Selected Data
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={2}></Grid>
                                                <Grid item xs={1}>

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
                                                    <div id="resulttable" />

                                                </Grid>
                                            </Grid>
                                        </MDBox>
                                    </Card>
                                )}
                                {selectedPlant?.value == "ExecuteOperation" && (
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
                                                        Execute Output
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={2}></Grid>
                                                <Grid item xs={1}>

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
                                                    {resultExcData && (
                                                        <h4 style={{ color: "green" }}>
                                                            {JSON.stringify(resultExcData, null, 2)}
                                                        </h4>
                                                    )}

                                                    {resultExcErrData && (
                                                        <h4 style={{ color: "red" }}>
                                                            {JSON.stringify(resultExcErrData, null, 2)}
                                                        </h4>
                                                    )}

                                                </Grid>
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
