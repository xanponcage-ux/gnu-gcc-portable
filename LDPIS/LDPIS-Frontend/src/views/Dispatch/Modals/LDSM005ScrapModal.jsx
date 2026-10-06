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
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
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


export default function LDSM005ScrapModal(props) {
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

  //page load
  useEffect(() => {
    if (props.open) {
      let url = "api/LDSM005/getScrapDetails";
      let varData = [];
      //props?.inputValues()?.map((x) => varData.push(x.LOM_ID_BATCH))
      //LOM_PLANNED_PROC

      var data = {
        Plant: props?.plant?.value ? props.plant.value : "",
        userId: serverDetails.PersonalNo,
        Batch: props.inputValues.LOM_ID_BATCH,
        MBatch: props.inputValues.LOM_ID_FIRST_PAR,
        Process: props.plant.value == "0788" ? "K" : props.inputValues.LOM_CD_CURR_PROC, //{added santanu 1/9/24}
      };
      let totalScrap = (
        Number(props.inputValues.LOM_MS_PIECE_ACTL1) -
        Number(props.inputValues.LOM_MS_PIECE_ACTL)
      ).toFixed(3);

      let totalNoScrap = (
        Number(props.inputValues.LOM_NO_PIECES1) -
        Number(props.inputValues.LOM_NO_PIECES)
      ).toFixed(3);
      setTotalScrapWt(totalScrap);
      var totalNoScrp = totalNoScrap >= 0 ? totalNoScrap : 0;
      setTotalNoScrapTubes(totalNoScrp);

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
              var result = response.data[1];
              let finalData = [];
              for (var i in result) {
                var rowdata = result[i];
                finalData.push({
                  id: rowdata.SR_NO,
                  SCRAP_BATCH_ID: rowdata.SCRAP_BATCH_ID,
                  NO_OF_SCRAP_TUBES: rowdata.NO_OF_SCRAP_TUBES
                    ? rowdata.NO_OF_SCRAP_TUBES
                    : "",
                  SCRAP_WT: rowdata.SCRAP_WT ? rowdata.SCRAP_WT : "",
                  CD_CURR_PROC: "W",
                  CD_NEXT_PROC: "W",
                  CD_PROD: "",
                  NO_TDC: "",
                  BATCH_TYPE: "SCRAP",
                  CD_QLTY: "SCRP",
                  FG_MATNR: rowdata.SCRP_MATNR ? rowdata.SCRP_MATNR : "",
                  SCRP_MATNR: rowdata.SCRP_MATNR ? rowdata.SCRP_MATNR : "",
                  MATERIAL_DESC: rowdata.MATERIAL_DESC
                    ? rowdata.MATERIAL_DESC
                    : "",
                  IDIA: 0,
                  ODIA: 0,
                  SEC1: 0,
                  SEC2: 0,
                  LENGTH: 0,
                });
              }
              setScrapMatData(finalData);
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
  }, [props.open, props.inputValues.LOM_NO_PIECES1]);

  const formulaCalc = (cell) => {

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      let d = {
        plant: props?.plant?.value ? props.plant.value : "",
        procPath: props.inputValues.LOM_PLANNED_PROC
      };
      axiosAPI
        .post("api/LDSM034/getpphProductName", d, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var pName = response.data[0][0];
            let data = {
              plant: props?.plant?.value ? props.plant.value : "",
              batch_id: props.inputValues.LOM_ID_BATCH,
              prod_name: pName,
              no_pcs: cell.getData()?.NO_OF_SCRAP_TUBES,
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
                  if (cell.getData()?.NO_OF_SCRAP_TUBES == "0") {
                    cell.getRow()?.update({ SCRAP_WT: 0 });
                  } else if (cell.getData()?.NO_OF_SCRAP_TUBES == "") {
                    cell.getRow()?.update({ SCRAP_WT: "" });
                  } else {
                    cell.getRow()?.update({ SCRAP_WT: response.data[0][0] });
                  }
                }
              });
          }
        });
    });
  };

  const handleClose = () => {
    props.close(false);
    props.sendToParent("2");
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

  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tcm_accessToken"),
        },
      };
      var url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tcm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tcm_accessToken", response.data.accessToken);
            localStorage.setItem(
              "tcm_refreshToken",
              response.data.refreshToken
            );
            resolve(response.data);
          }
        });
    });
  useEffect(() => {
    if (scrapMatData && scrapMatData?.length > 0) {
      setScrapMatTable(
        new Tabulator("#scrapMatTableDiv", {
          data: scrapMatData,
          columns: scrapMatColumn,
          height: 300,
          layout: "fitColumns",
        })
      );
    }
  }, [scrapMatData]);
  //Added as on date 28-12-2023 for scrap validation.
  useEffect(() => {
    if (scrapMatData.length != 0 && scrapMatTable != null) {
      scrapMatTable.on("rowSelectionChanged", function (data, rows) {
        var sumNo = 0;
        var sumWt = 0;
        data.forEach((item) => {
          sumNo += parseFloat(item.NO_OF_SCRAP_TUBES);
        });
        var mNoScrap = (Number(sumNo)).toFixed(3);
        mNoScrap = mNoScrap || 0
        data.forEach((item) => {
          sumWt += parseFloat(item.SCRAP_WT);
        });
        var mScrapWt = (Number(sumWt)).toFixed(3);
        // document.getElementById("select-row").addEventListener("click", function(){
        //   scrapMatTable.selectedRows(1);
        // });

        if (mNoScrap == "NaN") {
          scrapMatTable.deselectRow(document.getElementById("select-row"));
          alertify.error("Please enter Scrap Tubes(nos) !");
          return;
        }
        if (Number(mNoScrap) > Number(totalNoScrapTubes)) {
          scrapMatTable.deselectRow();
          alertify.error(
            "Scrap tubes(nos) should not be greater than total scrap tubes(nos) !"
          );
          mNoScrap = 0;
          return;
        }
        if (mScrapWt > totalScrapWt) {
          scrapMatTable.deselectRow();
          alertify.error("Scrap Wt should not be greater than total scrap wt !");
          return;
        }
        setIsEnableQty(
          Number(mNoScrap) === Number(totalNoScrapTubes)
        );
      });
    }
  });


  const scrapMatColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      width: 5,
    },
    {
      title: "Scrap Batch Id",
      field: "SCRAP_BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 120,
    },
    {
      title: "Scrap Tubes(nos)",
      field: "NO_OF_SCRAP_TUBES",
      headerFilter: "input",
      editor: "number",
      width: 150,
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";

        if (value) {
          return parseInt(value);
        }
        return value;
      },
      cellEdited: function (cell) {
        /*** fetch function for piece act */
        formulaCalc(cell);
        this.recalc();
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Scrap Wt. (KG)",
      field: "SCRAP_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 120,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      cellEdited: function (cell) {
        setIsEnableQty(
          Number(
            cell.getColumn()?._column?.cells[
              cell.getColumn()?._column?.cells.length - 1
            ]?.value
          ) === Number(totalScrapWt)
        );
      },
    },
    {
      title: "Scrap Material No ",
      field: "SCRP_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 180,
    },
    {
      title: "Scrap Material Desc",
      field: "MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 300,
    },
  ];
  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={props.open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle>Scrap Details</DialogTitle>
      <DialogContent>
        {loading && <Preloader />}
        {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
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
                    Scrap Details &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <MDTypography variant="p" color="white">
                      Total Scrap Tubes(nos) : {totalNoScrapTubes}
                    </MDTypography>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <MDTypography variant="p" color="white">
                      Total Scrap Wt(KG) : {totalScrapWt}
                    </MDTypography>
                  </MDTypography>
                </Grid>
                <Grid item xs={2}>
                  {/* <Tooltip title="Save" arrow> */}
                  <span>
                    <IconButton
                      color="white"
                      disabled={!isEnableQty}
                      onClick={() => getInsertScrapDetails(true)}
                    >
                      <SaveIcon />
                    </IconButton>
                  </span>
                  {/* </Tooltip> */}
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
                  <div id="scrapMatTableDiv" />
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
