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


import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import moment from "moment";

export default function MaxWidthDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [initialLoad, setInitialLoad] = useState(false);
  const [delayBreakTable, setDelayBreakTable] = React.useState(null);
  const [delayBreak, setDelayBreak] = useState([{}, {}, {}, {}]);
  const [rsn, setRsn] = useState([]);
  const [rsnFetched, setRsnFetched] = useState(false);
  const [eqpFac, setEqpFaC] = useState([]);
  const [updData, setUpdData] = useState([]);
  const [insert, setInsert] = useState([]);

  const [scrapMatDescList, setScrapMatDescList] = useState([]);
  const [totalScrapQty, setTotalScrapQty] = useState(0);

  const [loading, setLoading] = React.useState(false);
  //page load
  const [ReasonCat, setReasonCat] = React.useState(false);
  // [
  //   { label: "QUALITY-EPA PROCESSING", value: "QUALITY-EPA PROCESSING" },
  //   { label: "QUALITY-aRM / MATERIAL", value: "QUALITY-aRM / MATERIAL" },
  //   { label: "PLANNING", value: "PLANNING" },
  //   { label: "NOMINAL", value: "NOMINAL" },
  //   { label: "MARKETING", value: "MARKETING" },
  //   { label: "CSD - LOGISTICS", value: "CSD - LOGISTICS" },
  // ];

  const [enableCheck, setEnableCheck] = useState(true);


  var totalQtyTemp = 0;

  //get Authorization
  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      var url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tmm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tmm_accessToken", response.data.accessToken);
            localStorage.setItem(
              "tmm_refreshToken",
              response.data.refreshToken
            );
            resolve(response.data);
          }
        });
    });


  useEffect(() => {
    if (props.open) {
      async function fetchData() {
        {
          const response = await getAuthorization();
          if (response) {
            reasonData(false);
            getScrapMatNo();
            getReasonCategory();
            setInitialLoad(true);
          }
        }
      }
      fetchData();
    }
  }, [props.open]);

  useEffect(() => {
    if (rsn && rsn.length > 0) {
      setRsnFetched(true);
    }
  }, [rsn]);


  const saveMaintainReason = async (newToken = false, Duration) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };


    var selectedRows = delayBreakTable.getSelectedRows();

    var selectedData = [];
    selectedRows.forEach(function (item) {
      if (item._row.data.SCRAP_QTY) {
        selectedData.push({
          rsnCat: item._row.data.RSN_CAT,
          rsnCd: item._row.data.RSN_CD,
          scrapQty: item._row.data.SCRAP_QTY,
          scrpMatNo: item._row.data.SCRAP_MAT,
        });
      }
    });


    setLoading(true);

    if (selectedData.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    var data = {
      plant: serverDetails.Plant,
      batch: props.data.LOM_ID_BATCH,
      totalScrapQty: totalScrapQty,
      actualScrapQty: props.data.LOM_MS_GROSS_CAL,
      process: props.data.CURR_PROC,
      selectedData: selectedData,
    };
    setLoading(true);

    var url = "api/LDSM048/maintainreason";

    //   api call
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
          alertify.error("Error Saving Data");
        } else {
          if (response.data == "Y") {
            alertify.success("Saved successfully !");
            props.refreshTable();
          }
          else {
            alertify.error("Error saving data !");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });

    // let error = false;
    // data.forEach((element) => {
    //   var durationValue= element._row.cells[2].value
    //   if (durationValue==null || typeof(durationValue)==undefined || durationValue=="") {        
    //     error = true;      
    //   }
    // });

    // //return; 
    // if (1==0) {
    //  // alertify.error("Duration cannot be empty");
    //   //return ;
    // }

    // else {
    //   if (data !== "" && data !== null && data.length > 0) {
    //     if(typeof(data[0])==='undefined'||typeof(data[1])==='undefined'||typeof(data[2])==='undefined'){
    //       var msg = "Row cannot be empty";
    //       alertify.error(msg);
    //       props.close(false);
    //     }
    //     else{
    //     var reason = data[0]._row.cells[1].value;
    //     var reason1 = data[1]._row.cells[1].value;
    //     var reason2 = data[2]._row.cells[1].value;
    //     var duration = Number(data[0]._row.cells[2].value);
    //     var duration1 = Number( data[1]._row.cells[2].value);
    //     var duration2 = Number( data[2]._row.cells[2].value);
    //     var remarks = data[0]._row.cells[3].value;
    //     var remarks1 = data[1]._row.cells[3].value;
    //     var remarks2 = data[2]._row.cells[3].value;
    //     var sum=duration+duration1+duration2;
    //     if (Number(Duration)<Number(sum))
    //     {
    //     var msg = "Sum Of all Delays is not equal to total Delays";
    //     alertify.error(msg);
    //     props.close(false);
    //    }else{
    //     saveDetails(reason, duration, remarks);
    //     var total1 = Number(duration) + Number(duration1);
    //     var total2 = total1 + Number(duration2);
    //     if (isNaN(duration1) == false && Number(duration1) != 0) {
    //       insertData1(reason1, remarks1, duration, total1);
    //       if (isNaN(duration2) == false && Number(duration2) != 0) {
    //         insertData2(reason2, remarks2, total1, total2);
    //       }
    //     }
    //   }
    // }
    //   }
    //   else if (data === "" || data === null || data.length === 0) {
    //     var msg = "Row cannot be empty";
    //     alertify.error(msg);
    //     props.close(false);
    //   } else {
    //   }
    //   props.close(false);
    // }
  };


  //Reason data api call
  const reasonData = async (newToken = false, rsnCat) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/LDSM048/scraprsn";
    var data = {
      plant: serverDetails.Plant,
      rsnCat: rsnCat
    }


    axiosAPI
      .post(url,
        data,
        defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = {};

          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[0] + "-" + rowArr[1];
            obj.value = rowArr[0];
            items[obj.value] = obj.label;
          });
          setRsn(items);
        }
      })
      .finally((f) => {
        setLoading(false);
        return true;
        //  props.refreshTable(); //2nd api
      });
  };

  const getReasonCategory = async (newToken = false, rsnCat) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/LDSM048/getReasonCategory";
    var data = {};


    axiosAPI
      .post(url,
        data,
        defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = {};

          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[0] + "-" + rowArr[1];
            obj.value = rowArr[0];
            items[obj.value] = obj.label;
          });
          setReasonCat(items);
        }
      })
      .finally((f) => {
        setLoading(false);
        //  props.refreshTable(); //2nd api
      });
  };

  //scrap material api call
  const getScrapMatNo = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/LDSM048/scrapmatno"
    var data = {
      plant: serverDetails.Plant
    }


    axiosAPI
      .post(url,
        data,
        defaultOptions)
      .then((response) => {

        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = {};

          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[0] + "-" + rowArr[1];
            obj.value = rowArr[0];
            items[obj.value] = obj.label;
          });
          setScrapMatDescList(items);
        }
      })
      .finally((f) => {
        setLoading(false);
        return true;
        //  props.refreshTable(); //2nd api
      });
  };




  const saveDetails = async (reason, duration, remarks, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    updateData(reason, duration, remarks, false);
    // props.closeModal(false);
  };


  const reqTypeOptions = {
    S: "STOCK TRANSFER",
    P: "PURCHASE",
  };
  //Update Data Api call
  const updateData = async (reason, duration, remarks, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
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


    //var newVal = new Date(value).toISOString().substring(0, 10);
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
  const insertData1 = async (reason, remarks, duration, total, newToken = true) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
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
  const insertData2 = async (reason, remarks, duration, total, newToken = true) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
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
    // setDelayBreakTable(
    //   new Tabulator("#reasonTableData", {
    //     data:delayBreak, //link data to table
    //     columns:column,
    //     height: "100%",
    //     layout: "fitColumns",
    //   })
    // );

    if ((ReasonCat
      && Object.keys(ReasonCat).length === 0
      && Object.getPrototypeOf(ReasonCat) === Object.prototype) == false &&
      (rsn
        && Object.keys(rsn).length === 0
        && Object.getPrototypeOf(rsn) === Object.prototype) == false
      && (scrapMatDescList
        && Object.keys(scrapMatDescList).length === 0
        && Object.getPrototypeOf(scrapMatDescList) === Object.prototype) == false) {

      setDelayBreakTable(
        new Tabulator("#reasonTableData", {
          data: delayBreak, //link data to table
          columns: column,
          height: "100%",
          layout: "fitColumns",
        })
      );
    }
  }, [rsn, ReasonCat, scrapMatDescList, delayBreak]);


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


  const handlerScrapQtyEdit = (cell) => {
    // var tempSum = totalScrapQty + Number(cell._cell.row.data.SCRAP_QTY);
    totalQtyTemp += Number(cell._cell.row.data.SCRAP_QTY)

    setTotalScrapQty(totalQtyTemp);
  }

  const handleRsnCatChange = (cell) => {
    reasonData(false, cell._cell.row.data.RSN_CAT);

  }

  const calculateTotalQty = (cell) => {

    var selectedRows = delayBreakTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }

    var total = 0;
    selectedRows.forEach(function (item) {
      if (item._row.data.SCRAP_QTY) {
        total += Number(item._row.data.SCRAP_QTY);
      }
    });



    if (props.data.LOM_MS_GROSS_CAL == total) {
      setEnableCheck(false);
    }
    else {
      setEnableCheck(true);
      alertify.error("Total Qty can't be more than Actual Scrap Qty");
    }

    setTotalScrapQty(total);
  }

  const enableCheckBtn = (val) => {
    setEnableCheck(val);
  }

  const column = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true

    },
    {
      title: "Reason Category",
      field: "RSN_CAT",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: ReasonCat,
      },
      cellEdited: handleRsnCatChange,
      formatter: "lookup",
      formatterParams: ReasonCat
    },
    {
      title: "Reason Code",
      field: "RSN_CD",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: rsn

      }, formatter: "lookup",
      formatterParams: rsn

    },
    {
      title: "Scrap Qty",
      field: "SCRAP_QTY",
      editor: "number",
      // cellEdited : handlerScrapQtyEdit
      cellEdited: function (cell) {
        setEnableCheck(true)
      },

    },
    {
      title: "Scrap Material",
      editor: "list",
      field: "SCRAP_MAT",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: scrapMatDescList

      },
    }

  ];


  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>Scrap Details</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          <MDBox px={3} py={1}>
            <Grid container spacing={1}>

              <Grid item xs={3}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Batch Id
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="wo_no"
                  value={props.data.LOM_ID_BATCH}
                  disabled
                ></MDInput>
              </Grid>


              <Grid item xs={3}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Process
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={props.data.CURR_PROC}
                  disabled
                ></MDInput>
              </Grid>
              <Grid item xs={3}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Actual Scrap
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={Number(props.data.LOM_MS_GROSS_CAL).toFixed(3)}
                  disabled
                ></MDInput>
              </Grid>
            </Grid>
          </MDBox>
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
                    Reason Table
                  </MDTypography>
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
                  <div id="reasonTableData" />
                  <br />
                  <div>
                    <p
                      color="black"
                      style={{
                        color: "black",
                        paddingLeft: "1rem",
                        marginTop: "-1rem",
                      }}
                    >Total Qty : <span style={{ color: props.data.LOM_MS_GROSS_CAL == totalScrapQty ? "green" : "red" }}>{totalScrapQty}</span></p>
                    <br />

                  </div>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>


        </DialogContent>
        <DialogActions>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem" }}
          >
            <Button onClick={handleClose}>Close</Button>

            {enableCheck &&
              <MDButton
                size="small"
                color="info"
                onClick={() => calculateTotalQty()}
                style={{ margin: "1.5rem" }}
              >
                Check
              </MDButton>
            }
            {/* disabled = {props.data.LOM_MS_GROSS_CAL == totalScrapQty ? false : true} */}
            {!enableCheck &&
              <MDButton
                size="small"
                color="info"
                onClick={() => saveMaintainReason(true, props.data.DURATION)}
                style={{ margin: "1.5rem" }}
              >
                Save
              </MDButton>
            }
          </Grid>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
