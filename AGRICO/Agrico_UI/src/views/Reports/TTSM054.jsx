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
import MultipleSelect from "components/Select/MultiSelect";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
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
import PrintIcon from "@mui/icons-material/Print";

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

export default function TTSM054() {
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setAdmin] = React.useState(false);
    const [isRestricted, setRestricted] = React.useState(true);
    const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

    const [tabValue, setTabValue] = useState(0);
    const handleSetTabValue = (event, newValue) => setTabValue(newValue);

    const [plant, setPlant] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState([]);


    // filter dispatch
    const [selectedFrmDt, setSelectedFrmDt] = useState(null);
    const [selectedToDt, setSelectedToDt] = useState(null);
    const [dispatchData, setDispatchData] = useState([]);
    const [dispatchTableData, setDispatchTableData] = useState(null);

    const [matno, setmatno] = React.useState([]);
    const [selectedMATno, setselectMATno] = React.useState([]);
    const [selectedDOrdId, setSelectedDOrdId] = useState('');
    const [selectedDOrdItem, setSelectedDOrdItem] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    // filter scheduled
    const [schdFrmDt, setSchdFrmDt] = useState(null);
    const [schdToDt, setSchdToDt] = useState(null);
    const [selectedOrdId, setSelectedOrdId] = useState('');
    const [selectedOrdItem, setSelectedOrdItem] = useState('');
    const [selectedSDivision, setSelectedSDivision] = useState('');
    // const [process, setProcess] = useState([]);
    // const [selectedProcess, setSelectedProcess] = React.useState(null);
    const [ordType, setOrdType] = useState([]);
    const [selectedOrderType, setSelectOrderType] = React.useState([]);
    const [plannedBatchData, setPlannedBatchData] = useState([]);
    const [plannedBatchTable, setPlannedBatchTable] = useState([]);


    // Reusable helper to show "-" for null/undefined/empty strings
    const dashFormatter = function (cell) {
        const v = cell.getValue();
        if (v === null || v === undefined || v === "") return "-";
        return v;
    };

    // Number formatter with thousands separator (no decimals by default)
    const numberFormatter = function (cell) {
        const v = cell.getValue();
        if (v === null || v === undefined || v === "") return "-";
        // Keep integers as-is; show up to 3 decimals for non-integers
        const isInt = Number.isInteger(Number(v));
        return isInt ? Number(v).toLocaleString() : Number(v).toLocaleString(undefined, { maximumFractionDigits: 3 });
    };

    // Date formatter for ISO strings like "2026-02-19T18:30:00.000Z"
    const isoDateFormatter = function (cell) {
        const v = cell.getValue();
        if (!v) return "-";
        // Safe parse for ISO; display as yyyy-MM-dd HH:mm (local time)
        const d = new Date(v);
        if (isNaN(d.getTime())) return v; // fallback to raw if parse fails
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    /**
 * Calculate number of pieces from total weight
 * @returns {number} no of pieces (rounded)
 */
    function getNoOfPiecesFromWeight({
        weightKg,
        od,
        id = 0,
        thickness,
        length,
        prodName = 'ERW'
    }) {
        let wtPerPiece = 0;

        if (prodName === 'ERW') {
            if (id > 0) {
                wtPerPiece =
                    (((od + id) - 2 * thickness) *
                        thickness *
                        0.0157 *
                        (length * 1000)) / 1000;
            } else {
                wtPerPiece =
                    ((od - thickness) *
                        thickness *
                        0.02465 *
                        (length * 1000)) / 1000;
            }
        }

        if (prodName === 'CEW') {
            wtPerPiece =
                (od - thickness) *
                thickness *
                0.02465 *
                length;
        }

        if (wtPerPiece <= 0) return 0;

        return Math.round(weightKg / wtPerPiece);
    }


    const dispatchColumns = [
        {
            title: "ODIA",
            field: "EOM_ODIA",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "THICK",
            field: "EOM_SEC1",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "WIDTH",
            field: "EOM_SEC2",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "LENGTH",
            field: "EOM_LENGTH",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "PLANT",
            field: "EOM_CD_EPA",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },

        {
            title: "MATERIAL_GROUP",
            field: "MATERIAL_GROUP",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "EOM_NO_INVOICE",
            field: "EOM_NO_INVOICE",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },

        {
            title: "EOM_DT_INVOICE",
            field: "EOM_DT_INVOICE",
            headerFilter: "input",
            hozAlign: "left",
            sorter: "datetime",
            formatter: isoDateFormatter,
        },
        {
            title: "BATCH_ID",
            field: "EOM_ID_BATCH",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "FG_MATERIAL_NO",
            field: "FG_MATERIAL_NO",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "FG_MATERIAL_DESC",
            field: "FG_MATERIAL_DESC",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "CUST_ORDER",
            field: "EOM_ID_ORDER_CUS",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "CUST_ITEM",
            field: "EOM_ID_ORD_ITEM_CUS",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "GROSS_WT",
            field: "EOM_MS_GROSS_ACTL",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "NET_WT",
            field: "EOM_MS_GROSS_CAL",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "UOM",
            field: "UOM",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "NO_OF_PIECES",
            field: "EOM_NO_PIECES",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },

        {
            title: "ENC_CD_END_CUST",
            field: "ENC_CD_END_CUST",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "ENC_MARK_CUST",
            field: "ENC_MARK_CUST",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "ENC_ORDER_TYPE",
            field: "ENC_ORDER_TYPE",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "ENC_ROADDEST_DESC",
            field: "ENC_ROADDEST_DESC",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "ENC_ROAD_DEST",
            field: "ENC_ROAD_DEST",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "ENC_SALES_OFF",
            field: "ENC_SALES_OFF",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "DIVISION",
            field: "DIVISION",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },

        {
            title: "RECVPLANT",
            field: "RECVPLANT",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "CamNo",
            field: "CamNo",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "Delivery",
            field: "Delivery",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "DistributionChanel",
            field: "DistributionChanel",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "QtyNo",
            field: "QtyNo",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "RateUnit",
            field: "RateUnit",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },

        // Title kept as "Sales Organisation" but mapping to the provided key ENC_WO_PLANT
        {
            title: "Sales Organisation",
            field: "ENC_WO_PLANT",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            title: "SalesUnit",
            field: "SalesUnit",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },

        {
            title: "TotalValue",
            field: "TotalValue",
            headerFilter: "input",
            hozAlign: "right",
            sorter: "number",
            formatter: numberFormatter,
        },
        {
            title: "Vechile No",
            field: "VechileNo",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
    ];

    const planningDetailsClm = [
        {
            field: "CUST_NAME",
            title: "Customer Name",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "WORK_CENT",
            title: "Work Centre",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "SFG_MATERIAL_NO",
            title: "SFG Material No.",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "SFG_MATERIAL_DESC",
            title: "SFG Material Desc.",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "GI_MATERIAL",
            title: "GI Material",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "GI_MATERIAL_DESC",
            title: "GI Material Desc.",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "GRADE",
            title: "Grade/TDC",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },

        {
            field: "GI_BATCH",
            title: "GI Batch",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: function (cell, formatterParams) {
                var value = cell.getValue();
                cell.getElement().style["background-color"] = "#DA8EE7";
                cell.getElement().style["color"] = "#FFFFFF";
                return value;
            },
            // cellClick: function (e, cell) {
            //     displaySlitCoilDetails(cell);
            // },
        },
        {
            field: "GI_QNTY",
            title: "GI Qty.(KG)",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            bottomCalc: "sum",
            bottomCalcParams: { precision: 3 },
            formatter: numberFormatter,
        },
        {
            field: "FG_MATNR",
            title: "FG Material No.",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "FG_MATNR_DESC",
            title: "FG Material Desc.",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "MILL_LENGTH",
            title: "Mill Length(MM)",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: numberFormatter,
        },
        {
            field: "NO_OF_PIECES",
            title: "NO of PCS (Manual)",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: function (cell, formatterParams) {
                cell.getData()?.EOM_NO_PIECES
                
               let value= getNoOfPiecesFromWeight({
                   weightKg:cell.getData() ?. GI_QNTY,
                   od : cell.getData() ?. CUST_OD,
                   id : cell.getData() ?. IDIA,
                   thickness : cell.getData() ?.CUST_THK,
                   length : cell.getData() ?.CUST_LENGTH,
                    prodName : 'ERW'
                })
                return value;
            },
        },

        {
            field: "CUST_OD",
            title: "Odia",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: numberFormatter,
        },
        {
            field: "IDIA",
            title: "ID",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "CUST_THK",
            title: "Thick",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: numberFormatter,
        },

        {
            field: "CUST_LENGTH",
            title: "Length",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: numberFormatter,
        },
        {
            title: "DIVISION",
            field: "DIVISION",
            headerFilter: "input",
            hozAlign: "left",
            formatter: dashFormatter,
        },
        {
            field: "END_FINISH",
            title: "Final Cond. (Mannual)",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },

        {
            field: "CUST_ORD",
            title: "Cust. Order",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "CUST_ITEM",
            title: "Cust. Item",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "PLANNED_PROC",
            title: "Planned Path",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "ID_WRK_INST",
            title: "Mill No.",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "CREATION_DT",
            title: "Creation Date",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "SHIFT",
            title: "Shift",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "BATCH_STATUS",
            title: "Batch Status",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "PDI_STATUS",
            title: "Pdi Status",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "PLANNING_REMARKS",
            title: "Planning Remarks",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            field: "MULTIPLE_LEN",
            title: "Multiple Length",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            title: "WIP Material No.",
            field: "WIP_MAT",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            title: "WIP Material Desc",
            field: "WIP_MAT_DESC",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            title: "Cast No.",
            field: "CAST_NO",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        }
    ];

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
            var pageName = "TTSM054";

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
                        // Promise.all([getProcDetails(items[0], accessToken)]).finally(() => {
                        // });
                        resolve();
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
            var url = "api/TTSM054/getFGMAT";
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
                        // response.data.map((row) => {
                        //   console.log(row);
                        //   var obj = new Object();
                        //   obj.label = row[0];
                        //   obj.value = row[0];
                        //   items.push(obj);
                        // });
                        response.data?.map((x) =>
                            x ? items.push(x) : null
                        );
                        console.log(items);
                        setmatno(items);
                    }
                })
                .finally((f) => {
                    resolve();
                });
        });
    };

    const handleOrderChange = (value) => {
        setSelectOrderType(value);
        setCustomerTable([,]);
        // setSlitCoilData([,]);
    };

    useEffect(() => {
        setDispatchTableData(
            new Tabulator('#dispatchTable', {
                data: dispatchData,
                columns: dispatchColumns,
                pagination: "local", //enable local pagination.
                paginationSize: 12, 
                maxHeight: 400,
                layout: "fitDataFill",
            })
        )
    }, [dispatchData])

    useEffect(() => {
        if (plannedBatchData && plannedBatchData.length > 0) {
            setPlannedBatchTable(
                new Tabulator("#planningDtl", {
                    pagination: "local", //enable local pagination.
                    paginationSize: 12,
                    data: plannedBatchData,
                    // columns: gvCoilClm,
                    columns: planningDetailsClm,
                    maxHeight: 400,
                    layout: "fitDataFill",
                })
            );
        }
    }, [plannedBatchData]);

    const handlePlantChange = (value) => {
        setSelectedFrmDt(null);
        setSelectedToDt(null);
        setSelectedPlant(value);
        GetAuthorization().then((data) => {
            Promise.all([getProcDetails(value, data.accessToken)]).finally(() => {
                setLoading(false);
            });
        });
    };

    const handleMatChange = (value) => {
        setselectMATno(value);
    };

    const getDispatchData = () => {
        if (!selectedPlant?.value) {
            alertify.error("Please select Plant");
            return;
        }
        if (!selectedFrmDt) {
            alertify.error("Please select From Date");
            return;
        }
        if (!selectedToDt) {
            alertify.error("Please select To Date");
            return;
        }
        var url;
        console.log(selectedMATno)
        console.log('selectedFrmDt', selectedFrmDt);
        var data = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            matno: selectedMATno ? selectedMATno : "",
            FrDate: selectedFrmDt ? ("0" + selectedFrmDt.getDate()).slice(-2) +
                "-" + selectedFrmDt.toString().substr(4, 3) + "-" + selectedFrmDt.getFullYear() : "",
            ToDate: selectedToDt
                ? ("0" + selectedToDt.getDate()).slice(-2) + "-" +
                selectedToDt.toString().substr(4, 3) + "-" + selectedToDt.getFullYear() : "",
            OrderId: selectedDOrdId,
            OrderItem: selectedDOrdItem,
            division: selectedDivision,
        };
        url = "api/TTSM054/getDispatchData";
        console.log('data->', data);

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
                        if (response.data?.length == 0) {
                            alertify.error("No Data found");
                            setDispatchData([,]);
                        } else {
                            setDispatchData(response.data);
                        }
                    }
                })
                .finally((f) => {
                    setLoading(false);
                });
        });
    };

    const getPlanningData = () => {
        if (!selectedPlant?.value) {
            alertify.error("Please select Plant");
            return;
        }
        console.log('schdFrmDt', schdFrmDt);
        if (!schdFrmDt) {
            alertify.error("Please select From Date");
            return;
        }
        console.log('schdToDt', schdToDt);
        if (!schdToDt) {
            alertify.error("Please select To Date");
            return;
        }
        var url;
        console.log(selectedMATno)
        console.log('selectedFrmDt', selectedFrmDt);
        var data = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            // matno: selectedMATno ? selectedMATno.value : "",
            FrDate: schdFrmDt ? ("0" + schdFrmDt.getDate()).slice(-2) +
                "-" + schdFrmDt.toString().substr(4, 3) + "-" + schdFrmDt.getFullYear() : "",
            ToDate: schdToDt
                ? ("0" + schdToDt.getDate()).slice(-2) + "-" +
                schdToDt.toString().substr(4, 3) + "-" + schdToDt.getFullYear() : "",
            OrderId: selectedOrdId,
            OrderItem: selectedOrdItem,
            division: selectedSDivision,
        };
        url = "api/TTSM054/getPlanningData";

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
                        if (response.data?.length == 0) {
                            alertify.error("No Data found");
                            setPlannedBatchData([,]);
                        } else {
                            setPlannedBatchData(response.data);
                        }
                    }
                })
                .finally((f) => {
                    setLoading(false);
                });
        });
    };

    const formatNumber = (value) => {
        return value ? parseFloat(value).toFixed(3) : value;
    }
    const downloadExcelDispachedTable = () => {
        if (dispatchTableData == null) {
            alertify.error("No Data exists in table for Downloading");
            return;
        }

        var len = dispatchTableData.getData();
        if (len == 0) {
            alertify.error("No Data exists in table for Downloading");
            return;
        }
        var date = new Date();
        var fileName = "TTSM054_Dispatch_Report" + ".xlsx";

        dispatchTableData.download("xlsx", fileName, {
            sheetName: "TTSM054",
        });
    };

    const downloadExcelPlannedBatchTable = () => {
        if (plannedBatchTable == null) {
            alertify.error("No Data exists in table for Downloading");
            return;
        }

        var len = plannedBatchTable.getData();
        if (len == 0) {
            alertify.error("No Data exists in table for Downloading");
            return;
        }
        var date = new Date();
        var fileName = "TTSM054_Planned_Report" + ".xlsx";

        plannedBatchTable.download("xlsx", fileName, {
            sheetName: "TTSM054",
        });
    };

    const handleClearAll = (newToken = false) => {
        setSelectedPlant([]);
        // setAllValues({});
        setSelectedFrmDt(null);
        setSelectedToDt(null);
        setSchdToDt(null);
        setSchdFrmDt(null);
        setDispatchData([,]);
        setSelectedOrdItem('');
        setSelectedOrdId('');
        setSelectedDOrdItem('');
        setSelectedDOrdId('');
        setSelectedDivision('');
        setSelectedSDivision('');
        // setFGMATDataTable(null);
        setselectMATno([]);
    };

    return (
        <DashboardLayout>
            <DefaultNavbar routes={routes} module="Reports" page="Dispatch Batch wise report" />
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
                    <MDBox pt={7} pb={2} >
                        <Grid container spacing={5}>
                            <Grid item xs={6}>
                                <AppBar position="static">
                                    <Tabs
                                        orientation={"horizontal"}
                                        value={tabValue}
                                        onChange={handleSetTabValue}
                                    >
                                        <Tab label="Dispatch Report" icon={<Today />} />
                                        <Tab label="Issued Batch" icon={<Today />} />
                                    </Tabs>
                                </AppBar>
                            </Grid>
                            <Grid item xs={12}>
                                {tabValue == 0 && (
                                    <Card>
                                        <MDBox
                                            mx={2}
                                            mt={-4}
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
                                                        Plant <span style={{ color: "red" }}>*</span>
                                                    </MDTypography>
                                                    <ReactSelect
                                                        id="plant"
                                                        options={plant}
                                                        value={selectedPlant}
                                                        onChange={handlePlantChange}
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
                                                        From Date <span style={{ color: "red" }}>*</span>{" "}
                                                    </MDTypography>
                                                    <DatePicker
                                                        id="frmDt"
                                                        value={selectedFrmDt}
                                                        onChange={(date) => setSelectedFrmDt(date)}
                                                    />
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Tooltip title="Data till 6 months before this date">
                                                        <MDTypography // Assuming MDTypography is your custom Typography component
                                                            fontWeight="regular"
                                                            fontSize="small"
                                                            textTransform="capitalize"
                                                            variant="h6"
                                                            color={"dark"}
                                                            noWrap
                                                        >
                                                            To Date<span style={{ color: "red" }}>*</span>
                                                        </MDTypography>
                                                    </Tooltip>
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
                                                        Order{" "}
                                                    </MDTypography>
                                                    <MDInput
                                                        name="order"
                                                        value={selectedDOrdId || ""}
                                                        onChange={(e) => setSelectedDOrdId(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={0.75}>
                                                    <MDTypography
                                                        fontWeight="regular"
                                                        fontSize="small"
                                                        textTransform="capitalize"
                                                        variant="h6"
                                                        color={"dark"}
                                                        noWrap
                                                    >
                                                        Item{" "}
                                                    </MDTypography>
                                                    <MDInput
                                                        name="item"
                                                        value={selectedDOrdItem || ""}
                                                        onChange={(e) => setSelectedDOrdItem(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={0.75}>
                                                    <MDTypography
                                                        fontWeight="regular"
                                                        fontSize="small"
                                                        textTransform="capitalize"
                                                        variant="h6"
                                                        color={"dark"}
                                                        noWrap
                                                    >
                                                        Division{" "}
                                                    </MDTypography>
                                                    <MDInput
                                                        name="item"
                                                        value={selectedDivision || ""}
                                                        onChange={(e) => setSelectedDivision(e.target.value)}
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
                                                        Material Type{" "}
                                                    </MDTypography>
                                                    <MultipleSelect
                                                        id="MaterialType"
                                                        value={selectedMATno}
                                                        setValue={handleMatChange}
                                                        data={matno}
                                                        placeholder={"--Select--"}
                                                    />
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <MDButton
                                                        style={{ marginTop: "1.5rem" }}
                                                        size="small"
                                                        color="info"
                                                        onClick={() => getDispatchData(true)}
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
                                            mt={-4}
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
                                                <Grid item xs={2}></Grid>
                                                <Grid item xs={1}>
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
                                        <MDBox px={3} py={2}>
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
                                                        Plant<span style={{ color: "red" }}>*</span>{" "}
                                                    </MDTypography>
                                                    <ReactSelect
                                                        id="plant"
                                                        options={plant}
                                                        value={selectedPlant || ""}
                                                        onChange={handlePlantChange}
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
                                                        Schedule Date From{" "}<span style={{ color: "red" }}>*</span>{" "}
                                                    </MDTypography>
                                                    <DatePicker
                                                        id="frmDt"
                                                        value={schdFrmDt}
                                                        onChange={(date) => setSchdFrmDt(date)}
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
                                                        Schedule Date To{" "}<span style={{ color: "red" }}>*</span>{" "}
                                                    </MDTypography>
                                                    <DatePicker
                                                        id="toDt"
                                                        value={schdToDt}
                                                        onChange={(date) => setSchdToDt(date)}
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
                                                        options={process}
                                                        value={selectedProcess || ""}
                                                        onChange={handleProcessChange}
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
                                                        Order{" "}
                                                    </MDTypography>
                                                    <MDInput
                                                        name="order"
                                                        value={selectedOrdId || ""}
                                                        onChange={(e) => setSelectedOrdId(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={0.75}>
                                                    <MDTypography
                                                        fontWeight="regular"
                                                        fontSize="small"
                                                        textTransform="capitalize"
                                                        variant="h6"
                                                        color={"dark"}
                                                        noWrap
                                                    >
                                                        Item{" "}
                                                    </MDTypography>
                                                    <MDInput
                                                        name="item"
                                                        value={selectedOrdItem || ""}
                                                        onChange={(e) => setSelectedOrdItem(e.target.value)}
                                                    />
                                                </Grid>
                                                <Grid item xs={0.75}>
                                                    <MDTypography
                                                        fontWeight="regular"
                                                        fontSize="small"
                                                        textTransform="capitalize"
                                                        variant="h6"
                                                        color={"dark"}
                                                        noWrap
                                                    >
                                                        Division{" "}
                                                    </MDTypography>
                                                    <MDInput
                                                        name="Division"
                                                        value={selectedSDivision || ""}
                                                        onChange={(e) => setSelectedSDivision(e.target.value)}
                                                    />
                                                </Grid>
                                                {/* <Grid item xs={1}>
                                                    <MDTypography
                                                        fontWeight="regular"
                                                        fontSize="small"
                                                        textTransform="capitalize"
                                                        variant="h6"
                                                        color={"dark"}
                                                        noWrap
                                                    >
                                                        Batch Id{" "}
                                                    </MDTypography>
                                                    <MDInput
                                                        name="batchId"
                                                        value={allValues.batchId || ""}
                                                        onChange={(e) => handleChange(e)}
                                                    />
                                                </Grid> */}
                                                {/* <Grid item xs={1.2}>
                                                    <MDTypography
                                                        fontWeight="regular"
                                                        fontSize="small"
                                                        textTransform="capitalize"
                                                        variant="h6"
                                                        color={"dark"}
                                                        noWrap
                                                    >
                                                        Order Type{" "}
                                                    </MDTypography>
                                                    <ReactSelect
                                                        id="ordTyp"
                                                        options={ordType}
                                                        value={selectedOrderType}
                                                        onChange={handleOrderChange}
                                                    />
                                                </Grid> */}

                                                <Grid item xs={1}>
                                                    <MDButton
                                                        style={{ marginTop: "1rem" }}
                                                        //size="small"
                                                        color="info"
                                                        onClick={() => getPlanningData(true)}
                                                    >
                                                        {" "}
                                                        Submit{" "}
                                                    </MDButton>{" "}
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
                                                        Dispatch batch Data
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={2}></Grid>
                                                <Grid item xs={1}>
                                                    <Tooltip title="Download">
                                                        <IconButton
                                                            color="white"
                                                            onClick={() => downloadExcelDispachedTable()}
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

                                                    <div id="dispatchTable" >
                                                        <style>
                                                            {`.tabulator-group-header {
                                                            font-weight: bold;
                                                            }

                                                            .tabulator-group-header .count {
                                                            background-color: #ccc;
                                                            margin-left: 10px;
                                                            padding: 2px 5px;
                                                            border-radius: 3px;
                                                            }
                                                            `}
                                                        </style>
                                                    </div>
                                                    <br />
                                                    <p
                                                        color="black"
                                                        style={{
                                                            color: "black",
                                                            paddingLeft: "1rem",
                                                            marginTop: "-1rem",
                                                        }}
                                                    >
                                                        Showing 1 to {dispatchData.length} of {dispatchData.length}{" "}
                                                        entries
                                                    </p>
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
                                                        {/* Receive Raw Material */}
                                                        Planning Details
                                                    </MDTypography>
                                                </Grid>
                                                <Grid item xs={2}></Grid>
                                                <Grid item xs={1}>
                                                    <Tooltip title="Download" arrow>
                                                        <IconButton
                                                            color="white"
                                                            onClick={() => downloadExcelPlannedBatchTable()}
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
                                                    <div id="planningDtl" />
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
