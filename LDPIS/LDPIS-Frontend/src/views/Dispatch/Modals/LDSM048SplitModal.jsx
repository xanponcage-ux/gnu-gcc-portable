// import * as React from 'react';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MDInput from "components/MDInput";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import serverDetails from "../../../variables/serverDetails";
import axiosAPI from "../../../axiosAPI";
import Grid from "@mui/material/Grid";
import alertify from "alertifyjs";
import "../../../alertify.css";
import Preloader from "../../../components/Preloader/Preloader";
import React, { useEffect, useState } from "react";
import { GetAuthorization } from "utils";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

export default function AlertDialog(props) {
  //   const [open, setOpen] = React.useState(props.open);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");

  const [splitData, setSplitData] = useState([]);
  const [splitTableData, setSplitTableData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEnableQnt, setIsEnableQnt] = useState(false);
  const [isEnablePc, setIsEnablePc] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const [pieceActlQty, setPieceActlQty] = useState(0);
  const [modifyNoOfPcs, setModifyNoOfPcs] = useState(0);
  // const [totalSplitQty, setTotalSplitQty] = useState(0);
  // const [totalSplitPcs, setTotalSplitPcs] = useState(0);
  // var totsplitqty = 0 , totsplitpcs = 0;
  const [selectedTableData, setSelectedTableData] = useState(0);
  const [rndLenChecked, setRndLenChecked] = React.useState(false);
  const [lenValue, setLenValue] = useState(0);

  const splitColumn = [
    {
      title: "Batch ID",
      field: "BATCH_ID",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Length(MTR)",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      editor: "number",
      visible: rndLenChecked,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: function (cell) {
        var d = cell.getRow();
        let data = {
          plant: props.splitModalData.sDt.LOM_CD_EPA,
          batch_id: props.splitModalData.sDt.LOM_ID_BATCH,
          prod_name: props.splitModalData.sDt.PRODUCT_NM,
          no_pcs: d?._row?.data?.PCS,
          length: d?._row?.data?.LENGTH,
          p_od: 0,
          p_id: 0,
          p_thk: 0,
        };
        GetAuthorization().then((token) => {
          var defaultOptions = {
            headers: {
              Authorization: "Bearer " + token.accessToken,
            },
          };
          axiosAPI
            .post("api/LDSM048/getPieceActl", data, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                reject(null);
              } else {
                let row = cell.getRow();
                row.update({
                  QTY: response.data[0][0],
                });
                setIsEnablePc(
                  Number(
                    cell.getColumn()?._column?.cells[
                      cell.getColumn()?._column?.cells.length - 1
                    ]?.value
                  ) ===
                  Number(props.splitModalData.sDt?.LOM_NO_PIECES?.toFixed(3))
                );
              }
            });
        });
      },
    },
    {
      title: "Number of pieces",
      field: "PCS",
      headerFilterPlaceholder: "search...",
      editor: "number",
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
        var d = cell.getRow();
        let data = {
          plant: props.splitModalData.sDt.LOM_CD_EPA,
          batch_id: props.splitModalData.sDt.LOM_ID_BATCH,
          prod_name: props.splitModalData.sDt.PRODUCT_NM,
          no_pcs: d?._row?.data?.PCS,
          length: d?._row?.data?.LENGTH,
          p_od: 0,
          p_id: 0,
          p_thk: 0,
        };
        GetAuthorization().then((token) => {
          var defaultOptions = {
            headers: {
              Authorization: "Bearer " + token.accessToken,
            },
          };
          axiosAPI
            .post("api/LDSM048/getPieceActl", data, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                reject(null);
              } else {
                let row = cell.getRow();
                row.update({
                  QTY: response.data[0][0],
                });
                setIsEnablePc(
                  Number(
                    cell.getColumn()?._column?.cells[
                      cell.getColumn()?._column?.cells.length - 1
                    ]?.value
                  ) ===
                  Number(props.splitModalData.sDt?.LOM_NO_PIECES?.toFixed(3))
                );
              }
            });
        });
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Qty(KG)",
      field: "QTY",
      headerFilterPlaceholder: "search...",
      editor: "number",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        // setIsEnableQnt(
        //   Number(
        //     cell.getColumn()?._column?.cells[
        //       cell.getColumn()?._column?.cells.length - 1
        //     ]?.value
        //   ) === Number(props.splitModalData.sDt?.LOM_MS_GROSS_CAL?.toFixed(3))
        // );
        return value;
      },

      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      cellEdited: function (cell) { },
    },
    {
      field: "DelinkOrderFlag",
      title: "Delink Order Flag",
      headerFilterPlaceholder: "search...",
      editor: "select",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: [
          { label: "YES", value: "YES" },
          { label: "NO", value: "NO" },
        ],
      },
    },
  ];

  useEffect(() => {
    if (splitData?.length > 0 && splitTableData === null) {
      setSplitTableData(
        new Tabulator("#splittab", {
          data: splitData, //link data to table
          columns: splitColumn,
          height: 400,
          layout: "fitColumns",
        })
      );
    } else if (splitData.length === 0) {
      setSplitTableData(null);
    }
  }, [splitData]);

  const getSplitBatch = () => {
    debugger;
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        batchId: props.splitModalData.sDt.LOM_ID_BATCH,
        plant: props.splitModalData.sDt.LOM_CD_EPA,
        splitNo: props.splitNo,
      };
      var url;
      if (props.splitType == "A") {
        if (props.splitModalData.bDt.dt.STATUS == "VF") {
          url = "api/LDSM048/getsplitbatchRM";
        } else {
          url = "api/LDSM048/getsplitbatch";
        }
      } else {
        url = "api/LDSM048/getsplitbatchActal";
      }

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              items.push({
                BATCH_ID: row,
                LENGTH: props.splitModalData.bDt.dt.LENGTH1,
                PCS: "",
                QTY: "",
                DelinkOrderFlag: "NO",
              });
            });
            setLoading(false);
            setSplitTableData(null);
            setSplitData(items);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    if (splitData && splitData.length == 0) {
      getSplitBatch();
    }
  }, [props.splitNo]);

  const handleClose = () => {
    props.close(false);
  };

  const getSptSplitBatchDetails = (plant, mainBatch, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      // setSelectedSplitTableData

      var data = {
        plant: plant,
        splitted_batch: mainBatch,
      };

      var url = "api/LDSM048/getsplitbatchdetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              // setSptBatchDetails([,]);

              props.setSptSplitBatchDetails([]);
            } else {
              //handling response data
              // var rows = [];
              // for (var i in response.data) {
              //   var rowdata = response.data[i];
              //   rows.push({
              //     rowId : i,
              //     LOM_ID_BATCH: rowdata.LOM_ID_BATCH,
              //     LOM_CD_EPA: rowdata.LOM_CD_EPA,
              //     LOM_CD_STATUS: rowdata.LOM_CD_STATUS,
              //     LOM_MS_GROSS_CAL : rowdata.LOM_MS_GROSS_CAL,
              //     LOM_NO_PIECES  : rowdata.LOM_NO_PIECES
              //   });
              // }
              // setSptBatchDetails(response.data);
              props.setSptSplitBatchDetails(response.data);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleSplitClick = () => {
    debugger;
    var splitdata = splitTableData?.getData(),
      totSplitQty = 0,
      totSplitPcs = 0;

    splitdata?.forEach(function (item) {
      totSplitQty += Number(item.QTY);
      totSplitPcs += Number(item.PCS);
    });

    if (props.splitModalData.sDt.LOM_MS_GROSS_CAL == 0) {
      alertify.error("Batch Quantity is Zero");
      return;
    }

    if (totSplitQty == 0) {
      alertify.error(
        "Quantity must not be NULL or ZERO for the splitted batches"
      );
      return;
    }

    if (props.splitModalData.sDt.LOM_NO_PIECES == "1" && props.splitModalData.bDt.dt.STATUS != "VF") {
      alertify.error("Split is not possible for 1 piece.");
      return;
    }

    if (totSplitQty > props.splitModalData.sDt.LOM_MS_GROSS_CAL) {
      alertify.error("Total Quantity exceeds the Batch Quantity");
      return;
    }

    if (totSplitPcs > props.splitModalData.sDt.LOM_NO_PIECES) {
      alertify.error("Total Pieces exceeds the Batch Pieces");
      return;
    }

    if (totSplitPcs != props.splitModalData.sDt.LOM_NO_PIECES) {
      alertify.error("Total Split pieces should be equal to number of pieces.");
      return;
    }

    if (totSplitQty != props.splitModalData.sDt.LOM_MS_GROSS_CAL) {
      alertify.error("Total Split Qty should be equal to Batch Quantity.");
      return;
    }
    var data = {
      splitdata: splitdata,
      plant: serverDetails.Plant,
      mainBatch: props.splitModalData.sDt.LOM_ID_BATCH,
      mainBatchQty: props.splitModalData.sDt.LOM_MS_GROSS_CAL,
      mainBatchPcs: props.splitModalData.sDt.LOM_NO_PIECES,
      bUnit: "TUBES",
      splitNo: props.splitNo,
      splitQty: totSplitQty,
      splitPcs: totSplitPcs,
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM048/savesplitbatch";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          var msg = "";

          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.res_n.length == 0) {
              msg = "All Coil/Batch Splitted successfully";
            } else {
              msg += "Coil ID : ";
              response.data.res_n.map((val) => {
                msg += val.toString() + ", ";
              });
              if (response.data.res_y.length == 0) {
                msg += "failed.";
              } else {
                msg += " failed and rest are successful.";
              }
            }
            alertify.success(msg);
            getSptSplitBatchDetails(
              data.plant,
              data.mainBatch,
              token.accessToken
            );
            props.setSplitTableData([,]);
            props.setSelectedSplitTableData(null);
            props.getSptBatchDetails();
          }
        })
        .finally((f) => {
          setLoading(false);
          props.close(false);
          // props.loading(true);
        });
    });
  };

  const handleLengthChange = (e) => {
    setRndLenChecked(e.target.checked);
  };

  useEffect(() => {
    setSplitTableData(
      new Tabulator("#splittab", {
        data: splitData, //link data to table
        columns: splitColumn,
        height: 400,
        layout: "fitColumns",
      })
    );
  }, [rndLenChecked]);

  return (
    <div>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Split "}</DialogTitle>
        {loading ? (
          <Preloader />
        ) : (
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {/* Enter number of splits you want to create? */}
            </DialogContentText>

            <Grid item xs={12}>
              <div>
                <br />
                <p
                  color="black"
                  style={{
                    color: "black",
                    paddingLeft: "1rem",
                    marginTop: "-1rem",
                  }}
                >
                  Batch ID : {props.splitModalData.sDt.LOM_ID_BATCH}
                </p>
                <br />
                <p
                  color="black"
                  style={{
                    color: "black",
                    paddingLeft: "1rem",
                    marginTop: "-1rem",
                  }}
                >
                  Batch Qty :{" "}
                  {props.splitModalData.sDt.LOM_MS_GROSS_CAL
                    ? props.splitModalData.sDt.LOM_MS_GROSS_CAL.toFixed(3)
                    : ""}{" "}
                </p>
                <br />
                <p
                  color="black"
                  style={{
                    color: "black",
                    paddingLeft: "1rem",
                    marginTop: "-1rem",
                  }}
                >
                  Batch Pcs :{" "}
                  {props.splitModalData.sDt.LOM_NO_PIECES
                    ? props.splitModalData.sDt.LOM_NO_PIECES.toFixed(3)
                    : ""}{" "}
                </p>
              </div>
              <div>
                <FormControlLabel
                  label="Enter Random Length"
                  control={<Checkbox />}
                  //onChange={(e) => setRndLenChecked(e.target.checked)}
                  onChange={(e) => handleLengthChange(e)}
                />
              </div>
              <div id="splittab" />
            </Grid>
          </DialogContent>
        )}
        {!loading ? (
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button
              onClick={() => handleSplitClick(true)}
              disabled={!isEnablePc}
            >
              Split
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </div>
  );
}
