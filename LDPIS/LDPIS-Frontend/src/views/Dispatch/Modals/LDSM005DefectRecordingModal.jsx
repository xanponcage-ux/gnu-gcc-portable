import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import ReactSelect from "components/Select/ReactSelect";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import alertify from "alertifyjs";
import { TabulatorFull as Tabulator } from "tabulator-tables"; 
import "tabulator-tables/dist/css/tabulator_simple.min.css"; 
import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";
import Preloader from "components/Preloader/Preloader";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import Barcode from "react-barcode";
import ReactToPrint from "react-to-print";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import QRCode from "react-qr-code";
import { GetAuthorization } from "utils";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import SaveIcon from "@mui/icons-material/Save";
import { func } from "prop-types";
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

export default function LDSM005DefectRecordingModal(props) {
    const [open, setOpen] = React.useState(false);
    const [fullWidth, setFullWidth] = React.useState(true);
    const [maxWidth, setMaxWidth] = React.useState("lg");
    const [loading, setLoading] = React.useState(false);
    const [plant, setPlant] = useState([]);
    const [scrapMatData, setScrapMatData] = useState([]);
    const [empCounter, setEmpCounter] = useState(0);
    const [totalScrapWt, setTotalScrapWt] = useState(0);
    const [scrapWt, setScrapWt] = useState(0);
    const [totalNoScrapTubes, setTotalNoScrapTubes] = useState(0);
    const [noScrapTubes, setNoScrapTubes] = useState(0);
    const [scrapMatTable, setScrapMatTable] = useState(null);
    const [isEnableQty, setIsEnableQty] = useState(false);
    const [sumPrimeTubes, setSumPrimeTubes] = useState(0);
    const [showScrapWt, setShowScrapWt] = useState(false);


    //page load
    useEffect(() => {
        if (props.open) {
            console.log(props, "++++++++++++++");
            let url = "api/LDSM034/defectrecording";
            var selectedRows = [1]; 
            var selectedData = [];
            selectedRows.forEach(function (item) {
                selectedData.push({
                    MOTHER_BATCH: props.inputValues.kbDt.LOM_ID_PAR_COIL_NO,
                    BATCH_ID: props.inputValues.kbDt.LOM_ID_BATCH, 
                    PROCESS: props.inputValues.kbDt.LOM_PASSED_PROC,
                });
            });

            var data = {
                plant: props?.plant?.value ? props.plant.value : "",
                selectedData: selectedData,
            };

            GetAuthorization().then((token) => {
                var defaultOptions = {
                    headers: {
                        Authorization: "Bearer " + token.accessToken,
                    },
                };
                setLoading(true);
                axiosAPI
                    .post(url, data, defaultOptions)
                    .then((response) => {
                        if (response.statusText != "" && response.statusText != "OK") {
                        } else {
                            var rows = [];
                            for (var i in response.data) {
                                var rowdata = response.data[i];
                                rows.push({
                                    ESR_RSN_CD: rowdata.ESR_RSN_CD,
                                    ESR_RSN_DESC: rowdata.ESR_RSN_DESC,
                                    TBD_DEFECT_NO_PCS: rowdata.TBD_DEFECT_NO_PCS,
                                    TBD_DEFECT_WT: rowdata.TBD_DEFECT_WT,
                                    TBD_DEFECT_WT1: rowdata.TBD_DEFECT_WT1,
                                });
                            }
                            setScrapMatData(rows);
                            getScrapWt(token.accessToken)
                        }
                    })
                    .catch((error) => {
                        setScrapMatData([]);
                    })
                    .finally((f) => {
                        setLoading(false);
                    });
            });
        }
    }, [props.open]);

    useEffect(() => {
        if (scrapMatData && scrapMatData?.length > 0) {
            setScrapMatTable(
                new Tabulator("#scrapMatTableDivKB", {
                    data: scrapMatData,
                    columns: column_defect_recording,
                    height: 300,
                    layout: "fitColumns",
                })
            );
        }
    }, [scrapMatData]);


    const column_defect_recording = [
        {
            title: "Defect Code",
            field: "ESR_RSN_CD",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
        },
        {
            title: "Defect Description",
            field: "ESR_RSN_DESC",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",

            width: "30%",
        },
        {
            title: "No. of Defective Tubes",
            field: "TBD_DEFECT_NO_PCS",
            editor: "input",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            width: "30%",
            bottomCalc: "sum",
            bottomCalcParams: { precision: 3 },
            formatter: function (cell, formatterParams) {
                var value = cell.getValue();
                cell.getElement().style["background-color"] = "#DA8EE7";
                cell.getElement().style["color"] = "#FFFFFF";
                return value;
            },
            cellEdited: function (cell) {
                /*** fetch function for piece act */
                formulaCalc(cell);
            },
        },
        {
            title: "Defect Wt",
            field: "TBD_DEFECT_WT",
            editor: "input",
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            width: "30%",
            bottomCalc: "sum",
            bottomCalcParams: { precision: 3 },
            //visible: showScrapWt,
            formatter: function (cell, formatterParams) {
                var value = cell.getValue();
                cell.getElement().style["background-color"] = "#DA8EE7";
                cell.getElement().style["color"] = "#FFFFFF";
                return value;
            },
            editor: "input",
            cellEdited: (cell) => {
                let defect_Wt = cell._cell.row.data.TBD_DEFECT_WT1;
                let defect_Wt_m = cell._cell.row.data.TBD_DEFECT_WT;
                if (totalScrapWt < defect_Wt_m && selectedStatus.value === "MQ") {
                    alertify.error("Modify Defect Wt cannot be greater than Scrap Wt!");
                    var row = cell.getRow();
                    row.update({
                        TBD_DEFECT_WT: defect_Wt,
                    });
                    return;
                }

            },
        },
    ];


    const formulaCalc = (cell) => {

        GetAuthorization().then((token) => {
            var defaultOptions = {
                headers: {
                    Authorization: "Bearer " + token.accessToken,
                },
            };
            debugger;
            let d = {
                plant: props?.plant?.value ? props.plant.value : "",
                procPath: props.inputValues.kbDt.LOM_PLANNED_PROC //props.inputValues.LOM_PLANNED_PROC
            };
            axiosAPI
                .post("api/LDSM034/getpphProductName", d, defaultOptions)
                .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                    } else {
                        var pName = response.data[0][0];
                        let data = {
                            plant: props?.plant?.value ? props.plant.value : "",
                            batch_id: props.inputValues.kbDt.LOM_ID_BATCH,
                            prod_name: pName,
                            no_pcs: cell.getData()?.TBD_DEFECT_NO_PCS,
                            length: 0,
                            p_od: 0,
                            p_id: 0,
                            p_thk: 0,
                        };
                        axiosAPI
                            .post("api/LDSM005/getPieceActl", data, defaultOptions)
                            .then((response) => {
                                if (response.statusText != "" && response.statusText != "OK") {
                                } else {
                                    if (cell.getData()?.TBD_DEFECT_NO_PCS == "0") {
                                        cell.getRow()?.update({ TBD_DEFECT_WT: 0 });
                                    } else if (cell.getData()?.TBD_DEFECT_NO_PCS == "") {
                                        cell.getRow()?.update({ TBD_DEFECT_WT: "" });
                                    } else {
                                        cell.getRow()?.update({ TBD_DEFECT_WT: response.data[0][0] });
                                    }
                                }
                            });
                    }
                });
        });
    };

    const handleClose = () => {
        props.close(false);
        props.sendToParent("");
    };

    const getInsertScrapDetails = ({ scrap, setScrapFlag }) => {
        var selectedRows = scrapMatTable.getSelectedRows();
        var newData = [];

        selectedRows.forEach(function (item) {
            newData.push(item._row.data);
        });
        debugger;
        if (newData.length == 0) {
            alertify.error("Please select atleast 1 row to save !");
            props.open(true);
            return;
        }
        if (noScrapTubes > totalNoScrapTubes) {
            alertify.error(
                "Scrap tubes(nos) should not be greater than total scrap tubes(nos) !"
            );
            return;
        }
        if (scrapWt > totalScrapWt) {
            alertify.error("Scrap Wt should not be greater than total scrap wt !");
            return;
        }
        newData.push({
            id: newData.length + 1,
            SCRAP_BATCH_ID: props.inputValues.LOM_ID_BATCH,
            NO_OF_SCRAP_TUBES: props.inputValues.LOM_NO_PIECES1 - totalNoScrapTubes,
            SCRAP_WT: props.inputValues.LOM_MS_PIECE_ACTL1 - totalScrapWt,
            CD_CURR_PROC: props.inputValues.LOM_CD_CURR_PROC,
            CD_NEXT_PROC: props.inputValues.LOM_CD_NEXT_PROC,
            CD_PROD: props.inputValues.LOM_CD_PROD,
            NO_TDC: props.inputValues.LOM_TDC_ACTL,
            BATCH_TYPE: "FG",
            CD_QLTY: props.inputValues.LOM_CD_QLTY_ACTL,
            FG_MATNR: props.inputValues.FG_MAT_NO,
            SCRP_MATNR: "",
            IDIA: props.inputValues.LOM_IDIA,
            ODIA: props.inputValues.LOM_ODIA,
            SEC1: props.inputValues.LOM_SEC1,
            SEC2: props.inputValues.LOM_SEC2,
            LENGTH: props.inputValues.LOM_LENGTH,
        });
        //setLoading(true);
        GetAuthorization().then((token) => {
            var defaultOptions = {
                headers: {
                    Authorization: "Bearer " + token.accessToken,
                },
            };

            var rows = [];
            for (var i in newData) {
                var rowdata = newData[i];
                if (rowdata.NO_OF_SCRAP_TUBES == "" && props?.plant?.value != "0788") {
                    alertify.error("Scrap tubes(nos) cannot blank !");
                    return;
                }
                debugger;
                if (!(Number(rowdata.SCRAP_WT) > 0) || rowdata.SCRAP_WT == "") {
                    alertify.error("Scrap Wt cannot blank!");
                    return;
                }
                rows.push({
                    ID_FIRST_PAR: props.inputValues.LOM_ID_BATCH,
                    ID_BATCH: rowdata.SCRAP_BATCH_ID,
                    CD_PROCESS: props.inputValues.LOM_CD_CURR_PROC,
                    BATCH_TYPE: rowdata.BATCH_TYPE,
                    CD_CURR_PROC: rowdata.CD_CURR_PROC,
                    CD_NEXT_PROC: rowdata.CD_NEXT_PROC,
                    CD_QLTY: rowdata.CD_QLTY,
                    CD_PROD: rowdata.CD_PROD,
                    NO_TDC: rowdata.NO_TDC,
                    MS_PIECE_ACTL: rowdata.SCRAP_WT,
                    MS_GROSS_CAL: rowdata.SCRAP_WT,
                    NO_PIECES: rowdata.BATCH_TYPE == "FG" ? parseInt(props.inputValues.LOM_NO_PIECES) : rowdata.NO_OF_SCRAP_TUBES, //{added santanu 1/22/24}
                    IDIA: rowdata.IDIA,
                    ODIA: rowdata.ODIA,
                    SEC1: rowdata.SEC1,
                    SEC2: rowdata.SEC2,
                    LENGTH: rowdata.LENGTH,
                    ROLLING_LENGTH: props.inputValues.LOM_LENGTH,
                    NO_CAST: props.inputValues.LOM_NO_CAST,
                    DT_PRODN_TATA: props.inputValues.LOM_TS_CREATION,
                    CD_SHIFT: props.inputValues.LOM_CD_SHIFT,
                    ID_ORDER: props.inputValues.LOM_ID_ORDER_CUS,
                    NO_ITEM: props.inputValues.LOM_ID_ORD_ITEM_CUS,
                    MS_INPUT: rowdata.SCRAP_WT,
                    YIELD_PERC: 0,
                    UOM: props.inputValues.LOM_UOM,
                    PROD_STRT_TM: props.inputValues.LOM_TS_CREATION,
                    PROD_END_TM: props.inputValues.LOM_TS_CREATION,
                    STOR_LOC: props.inputValues.STORAGE_LOC,
                    FG_MATNR: rowdata.FG_MATNR,
                    RM_MATNR: props.inputValues.RM_MATNR,
                    SFG_MATNR: props.inputValues.SFG_MATNR,
                    SCRP_MATNR: rowdata.SCRP_MATNR,
                    TS_REC_CREATE: props.inputValues.LOM_TS_CREATION,
                    OPR_COMMENT: "",
                    LOM_CD_YRD: props.inputValues.LOM_CD_YRD
                });
            }

            var data = {
                Plant: props?.plant?.value ? props.plant.value : "",
                dt: rows,
                userId: serverDetails.PersonalNo,
            };
            var url = "api/LDSM005/getInsertScrapDetails";
            axiosAPI
                .post(url, data, defaultOptions)
                .then((response) => {
                    if (response.statusText != "" && response.statusText != "OK") {
                        //reject(response.statusText);
                    } else {
                        if (response.data.errorString == "Y") {
                            props.sendToParent("1");
                            alertify.success("Scrap details successfully saved!");
                        } else {
                            props.sendToParent("0");
                            alertify.error(response.data.errorString);
                        }
                    }
                })
                .catch((error) => {
                    setLoading(false);
                })
                .finally((f) => {
                    setLoading(false);
                    props.close(false);
                });
        });
    };

    const getScrapWt = (accessToken) => {
        return new Promise((resolve) => {
            var defaultOptions = {
                headers: {
                    Authorization: "Bearer " + accessToken,
                },
            };

            var selectedRows = [1]; 
            var selectedData = [];
            selectedRows.forEach(function (item) {
                selectedData.push({
                    MOTHER_BATCH: props.inputValues.kbDt.LOM_ID_PAR_COIL_NO,
                    BATCH_ID: props.inputValues.kbDt.LOM_ID_BATCH, 
                    PROCESS: props.inputValues.kbDt.LOM_PASSED_PROC,
                });
            });
            var data = {
                plant: props?.plant?.value ? props.plant.value : "",
                selectedData: selectedData,
            };

            var url = "api/LDSM034/getScrapWt";

            axiosAPI
                .post(url, data, defaultOptions)
                .then(
                    (response) => {

                        if (response.statusText != "" && response.statusText != "OK") {
                            //reject(response.statusText);
                        } else {
                            setTotalScrapWt(response.data[0].SCRAP_WT.toFixed(3));
                            setSumPrimeTubes(response.data[0].LOM_NO_PIECES);
                            setShowScrapWt(true);
                        }
                    },
                    [showScrapWt]
                )
                .finally((f) => {
                    resolve();
                });
        });

    };

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={props.open}
            onClose={handleClose}
            PaperComponent={PaperComponent}
            aria-labelledby="draggable-dialog-title">
            <DialogTitle>Scrap Details</DialogTitle>
            <DialogContent>
                {loading && <Preloader />}

                <Grid item xs={12}>
                    <Card>
                        <MDBox
                            mx={1}
                            mt={0}
                            py={0.025}
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
                                <Grid item xs={10}>
                                    <MDTypography variant="h6" color="white">
                                        Defect Recording
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <MDTypography variant="p" color="white">
                                            Scrap Tubes(nos) :
                                            {sumPrimeTubes}
                                        </MDTypography>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                                        <MDTypography variant="p" color="white">
                                            Scrap Wt(KG) : {totalScrapWt}
                                        </MDTypography>

                                    </MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                    <span>
                                        <IconButton
                                            color="white"
                                            //disabled={!isEnableQty}
                                            onClick={() => getInsertScrapDetails(true)}>
                                            <SaveIcon />
                                        </IconButton>
                                    </span>
                                </Grid>
                            </Grid>
                        </MDBox>

                        <MDBox mx={1} mt={-3} px={1} py={3}>
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                            ></Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <div id="scrapMatTableDivKB" />
                                </Grid>
                            </Grid>
                        </MDBox>
                    </Card>
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    style={{ marginTop: "0.5rem" }}
                >
                    <Button onClick={handleClose}>Close</Button>
                </Grid>
            </DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
    );
}
