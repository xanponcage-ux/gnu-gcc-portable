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
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import ReactSelect from "components/Select/ReactSelect";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import alertify from "alertifyjs";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";


import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import moment from "moment";
import { GetAuthorization } from "utils";
import Preloader from "components/Preloader/Preloader";

export default function MaxWidthDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [delayBreakTable, setDelayBreakTable] = React.useState(null);
  // const [delayBreak, setDelayBreak] = useState([{},{},{}]);
  const [delayBreak, setDelayBreak] = React.useState([]);
  const [rsn, setRsn] = useState([]);
  const [rsnFetched, setRsnFetched] = useState(false);
  const [eqpFac, setEqpFaC] = useState([]);
  const [updData, setUpdData] = useState([]);
  const [insert, setInsert] = useState([]);

  const [loading, setLoading] = React.useState(false);
  //page load


  function fetchData() {
    reasonData(false);
  }

  useEffect(() => {
    if (props.open) {
      fetchData();
    }
  }, [props.open]);

  useEffect(() => {
    if (rsn && rsn.length > 0) {
      setRsnFetched(true);
    }
  }, [rsn]);


  const saveData = async (Duration) => {
    var data = delayBreakTable.getSelectedRows();
    let error = false;
    data.forEach((element) => {
      var durationValue = element._row.cells[2].value
      if (durationValue == null || typeof (durationValue) == undefined || durationValue == "") {
        error = true;
      }
    });

    //return; 
    if (1 == 0) {
      // alertify.error("Duration cannot be empty");
      //return ;
    }

    else {
      if (data !== "" && data !== null && data.length > 0) {
        if (typeof (data[0]) === 'undefined' || typeof (data[1]) === 'undefined' || typeof (data[2]) === 'undefined') {
          var msg = "Row cannot be empty";
          alertify.error(msg);
          props.close(false);
        }
        else {
          setLoading(true);
          GetAuthorization().then((token) => {
            var reason = data[0]._row.cells[1].value;
            var reason1 = data[1]._row.cells[1].value;
            var reason2 = data[2]._row.cells[1].value;
            var duration = Number(data[0]._row.cells[2].value);
            var duration1 = Number(data[1]._row.cells[2].value);
            var duration2 = Number(data[2]._row.cells[2].value);
            var remarks = data[0]._row.cells[3].value;
            var remarks1 = data[1]._row.cells[3].value;
            var remarks2 = data[2]._row.cells[3].value;
            var sum = duration + duration1 + duration2;
            if (Number(Duration) < Number(sum)) {
              var msg = "Sum Of all Delays is not equal to total Delays";
              alertify.error(msg);
              props.close(false);
            } else {
              saveDetails(reason, duration, remarks, token.accessToken);
              var total1 = Number(duration) + Number(duration1);
              var total2 = total1 + Number(duration2);
              if (isNaN(duration1) == false && Number(duration1) != 0) {
                insertData1(reason1, remarks1, duration, total1, token.accessToken);
                if (isNaN(duration2) == false && Number(duration2) != 0) {
                  insertData2(reason2, remarks2, total1, total2, token.accessToken);
                }
              }
            }
          })
        }
      }
      else if (data === "" || data === null || data.length === 0) {
        var msg = "Row cannot be empty";
        alertify.error(msg);
        props.close(false);
      } else {
      }
      props.close(false);
    }
  };


  //Reason data api call
  const reasonData = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      // props.setLoading(true);
      var url;
      var data = {

        plant: props.data.PLANT,
        Order1: props.data.ORDERNO,
        Item: props.data.ORDERITEM,
      };

      url = "api/LDSM020/getPlanModalData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {

            setDelayBreak(response.data);
          }
        })
        .finally((f) => {
          setLoading(false);
          // props.setLoading(false);
          return true;
          //  props.refreshTable(); //2nd api
        });
    })
  };


  const saveDetails = (reason, duration, remarks, newToken = false, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    updateData(reason, duration, remarks, false, accessToken);
    // props.closeModal(false);
  };


  const reqTypeOptions = {
    S: "STOCK TRANSFER",
    P: "PURCHASE",
  };
  //Update Data Api call
  const updateData = async (reason, duration, remarks, newToken = false, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    var newDuration = (Number(duration) * 60 * 60);
    var value = props.data.FAO_TM_STOP_ST
    var endDate = moment(props.data.FAO_TM_STOP_ST).add((newDuration), 'seconds');
    var date = new Date(value);
    var year = date.getFullYear();
    var month = date.getMonth();
    var dt = date.getDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    var newStDate =
      dt +
      "-" +
      months[month] +
      "-" +
      year +
      " " +
      date.toLocaleTimeString();



    var date1 = new Date(endDate);

    var year1 = date1.getFullYear();
    var month1 = date1.getMonth();
    var dt1 = date1.getDate();
    // var sec1=date1.getSeconds() +duration
    if (dt1 < 10) {
      dt1 = "0" + dt1;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    var newEndDate =
      dt1 +
      "-" +
      months[month1] +
      "-" +
      year1 +
      " " +
      date1.toLocaleTimeString();

    setLoading(true);
    var url = "api/tsmcdmf001/save-modal-data";
    axiosAPI
      .post(
        url,
        {
          endDate: newEndDate,
          reason,
          Reason: props.data.FAO_CD_OUTAGE,
          remarks,
          Remarks: props.data.FAO_REMARKS,
          FaqCD: props.data.FAO_CD_FAC_MAST,
          EquipCD: props.data.FAO_CD_EQP_MAST,
          OutageRsnDesc: "",
          p_line: props.filterData.selectBy,
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          PersonalNo: serverDetails.PersonalNo,
          plantCode: serverDetails.Plant,
          compCode: serverDetails.Company,
        },
        defaultOptions
      )
      .then(({ data: { eqpFacData, updateData }, status }) => {
        setEqpFaC(eqpFacData);
        setUpdData(updateData);
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(true); //2nd api
      });
  };


  //Insert data1 api call
  const insertData1 = (reason, remarks, duration, total, newToken = true, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    var newDuration = (Number(duration) * 3600);

    var newTotalDuration = (Number(total) * 3600);
    //  var newSec=(newDuration)
    var value = props.data.FAO_TM_STOP_ST
    var newDate = moment(props.data.FAO_TM_STOP_ST).add(newDuration, "seconds")
    var newEndDate = moment(props.data.FAO_TM_STOP_ST).add(newTotalDuration, "seconds")
    var date = new Date(newDate);
    var year = date.getFullYear();
    var month = date.getMonth();
    var dt = date.getDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    var newStDate =
      dt +
      "-" +
      months[month] +
      "-" +
      year +
      " " +
      date.toLocaleTimeString();
    var value1 = props.data.FAO_TM_STOP_EN

    //var newVal = new Date(value).toISOString().substring(0, 10);
    var date1 = new Date(newEndDate);
    var year1 = date1.getFullYear();
    var month1 = date1.getMonth();
    var dt1 = date1.getDate();
    if (dt1 < 10) {
      dt1 = "0" + dt1;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    var newEndDate =
      dt1 +
      "-" +
      months[month1] +
      "-" +
      year1 +
      " " +
      date1.toLocaleTimeString();
    setLoading(true);
    var url = "api/tsmcdmf001/insert-modal-data";
    axiosAPI
      .post(
        url,
        {
          endDate: newEndDate,
          reason,
          Reason: props.data.FAO_CD_OUTAGE,
          remarks,
          Remarks: props.data.FAO_REMARKS,
          FaqCD: props.data.FAO_CD_FAC_MAST,
          EquipCD: props.data.FAO_CD_EQP_MAST,
          OutageRsnDesc: "",
          p_line: props.filterData.selectBy,
          outDt: props.dateOnlyFunc(props.data.OUTAGE_DT),
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          operator: serverDetails.PersonalNo,
          plant: serverDetails.Plant,
          company: serverDetails.Company
        },
        defaultOptions
      )
      .then(({ data: { eqpFacData, insrtbrkData }, status }) => {
        setEqpFaC(eqpFacData);
        setInsert(insrtbrkData);
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(true); //2nd api
      });
  };

  //Insert data2 api call
  const insertData2 = async (reason, remarks, duration, total, newToken = true, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    var newDuration = (Number(duration) * 3600);

    var newTotalDuration = (Number(total) * 3600);
    //  var newSec=(newDuration)
    var value = props.data.FAO_TM_STOP_ST
    var newDate = moment(props.data.FAO_TM_STOP_ST).add(newDuration, "seconds");
    var newEndDate = moment(props.data.FAO_TM_STOP_ST).add(newTotalDuration, "seconds");
    var date = new Date(newDate);
    var year = date.getFullYear();
    var month = date.getMonth();
    var dt = date.getDate();
    if (dt < 10) {
      dt = "0" + dt;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    var newStDate =
      dt +
      "-" +
      months[month] +
      "-" +
      year +
      " " +
      date.toLocaleTimeString();
    var value1 = props.data.FAO_TM_STOP_EN

    //var newVal = new Date(value).toISOString().substring(0, 10);
    var date1 = new Date(newEndDate);
    var year1 = date1.getFullYear();
    var month1 = date1.getMonth();
    var dt1 = date1.getDate();
    if (dt1 < 10) {
      dt1 = "0" + dt1;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    var newEndDate =
      dt1 +
      "-" +
      months[month1] +
      "-" +
      year1 +
      " " +
      date1.toLocaleTimeString();
    setLoading(true);
    var url = "api/tsmcdmf001/insert-modal-data";
    axiosAPI
      .post(
        url,
        {
          endDate: newEndDate,
          reason,
          Reason: props.data.FAO_CD_OUTAGE,
          remarks,
          Remarks: props.data.FAO_REMARKS,
          FaqCD: props.data.FAO_CD_FAC_MAST,
          EquipCD: props.data.FAO_CD_EQP_MAST,
          OutageRsnDesc: "",
          p_line: props.filterData.selectBy,
          outDt: props.dateOnlyFunc(props.data.OUTAGE_DT),
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          operator: serverDetails.PersonalNo,
          plant: serverDetails.Plant,
          company: serverDetails.Company
        },
        defaultOptions
      )
      .then(({ data: { eqpFacData, insrtbrkData }, status }) => {
        setEqpFaC(eqpFacData);
        setInsert(insrtbrkData);
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(true); //2nd api
      });
  };


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // setOpen(false);
    props.close(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };
  useEffect(() => {
    if (delayBreak && delayBreak.length > 0) {
      setDelayBreakTable(
        new Tabulator("#planTableData", {
          data: delayBreak,
          columns: column,
          height: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [delayBreak]);

  const downloadExcelcustomerTableData = () => {
    var date = new Date();
    var fileName = "LDSM020" + ".xlsx";
    delayBreakTable.download("xlsx", fileName, {
      sheetName: "LDSM020" + "_" + props.data.EOP_ID_ORDER,
    });
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let startDate = props.data.FAO_TM_STOP_ST;
  var date = new Date(startDate);
  var year = date.getFullYear();
  var month = date.getMonth();
  var dt = date.getDate();
  var newStDate;
  if (startDate) {
    if (dt < 10) {
      dt = "0" + dt;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    var newStDate =
      dt +
      "-" +
      months[month] +
      "-" +
      year +
      " " +
      date.toLocaleTimeString();
  }
  let endDate = props.data.FAO_TM_STOP_EN;
  var date1 = new Date(endDate);
  var year1 = date1.getFullYear();
  var month1 = date1.getMonth();
  var dt1 = date1.getDate();
  var newEnDate;
  if (endDate) {
    if (dt1 < 10) {
      dt1 = "0" + dt1;
    }
    // if (month < 10) {
    //   month = "0" + month;
    // }
    newEnDate =
      dt +
      "-" +
      months[month1] +
      "-" +
      year1 +
      " " +
      date1.toLocaleTimeString();
  }
  const column = [
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch ID",
      field: "BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.",
      field: "NET_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "ManDt", "field": "MANDT", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "Order", "field": "VBELN", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "Item", "field": "POSNR", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "Plant", "field": "WERKS", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "Batch", "field": "CHARG", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "RM Mat No.", "field": "MATNR", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "Stop Type", "field": "STYPE", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "SFG Mat No.", "field": "AUFNR", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "Coil Length", "field": "LENGTH", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search...",formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3} },
    // { "title": "Order Length", "field": "ORD_LEN", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search...",formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3} },
    // { "title": "FG Qnty", "field": "FG_QTY", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search...",formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3} },
    // { "title": "SFG Qnty", "field": "SFG_QTY", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search...",formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3} },
    // { "title": "Raw Qnty", "field": "RAW_QTY", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." ,formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3}},
    // { "title": "SFG SO Qnty", "field": "SFG_SO_QTY", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." ,formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3}},
    // { "title": "Adjust Qnty", "field": "ADJUST_QTY", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." ,formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3}},
    // { "title": "SO Material No", "field": "SO_MATNR", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
    // { "title": "SFG Qnty", "field": "SFGSTK_QTY", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search...",formatter: "money",bottomCalc:"sum", bottomCalcParams:{precision:3} },
    // { "title": "Program Name", "field": "PROG_NAME", "headerFilter": "input", 
    // "headerFilterPlaceholder": "search..." },
  ];


  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>Linked Batch Details</DialogTitle>
        <DialogContent>

          <Grid item xs={12} style={{ marginTop: "30px" }}>
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
                <Grid item xs={3} >
                  <MDTypography variant="h6" color="white">
                    Linked Batch Data
                  </MDTypography>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={1}>
                  <Tooltip title="Download" >
                    <IconButton color="white" onClick={() => downloadExcelcustomerTableData()}>
                      <DownloadForOfflineIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox px={3} py={3}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                style={{ display: "none" }}
              ></Grid>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <div id="planTableData" />
                </Grid>
              </Grid>
            </MDBox>
          </Grid>


        </DialogContent>
        <DialogActions>
          {loading ? <Preloader /> : <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem" }}
          >
            <Button onClick={handleClose}>Close</Button>
            {/* <MDButton
              size="small"
              color="info"
              onClick={() =>saveData(props.data.DURATION)}
              style={{margin:"1.5rem"}}
            >
              Save
            </MDButton> */}
          </Grid>}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
