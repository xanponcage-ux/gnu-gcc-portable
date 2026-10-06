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
import Preloader from "components/Preloader/Preloader";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import ReactSelect from "components/Select/ReactSelect";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import alertify from "alertifyjs";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import moment from "moment";
import { responsiveFontSizes } from "@mui/material";

export default function MaxWidthDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [initialLoad, setInitialLoad] = useState(false);
  const [delayBreakTable, setDelayBreakTable] = React.useState(null);
  const [delayBreak, setDelayBreak] = useState([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }])
  const [rsn, setRsn] = useState([]);
  const [rsnFetched, setRsnFetched] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [agentCode, setAgentCode] = useState([]);
  const [delayAgencyValue, setDelayAgencyValue] = useState('');
  //page load
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
            reasonData(true);
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


  const saveData = async (Duration, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var data = delayBreakTable.getSelectedRows();
    if (data.length == 0) {
      var msg = "Please Select the row";
      alertify.error(msg);
    } //add validation here
    else {
      var reason = data[0] ? (data[0]._row.cells[1].value) : '';
      var reason1 = data[1] ? (data[1]._row.cells[1].value) : '';
      var reason2 = data[2] ? (data[2]._row.cells[1].value) : '';
      var reason3 = data[3] ? (data[3]._row.cells[1].value) : '';
      var reason4 = data[4] ? (data[4]._row.cells[1].value) : '';
      var delayAgency = data[0] ? (data[0]._row.cells[2].value) : '';
      var delayAgency1 = data[1] ? (data[1]._row.cells[2].value) : '';
      var delayAgency2 = data[2] ? (data[2]._row.cells[2].value) : '';
      var delayAgency3 = data[3] ? (data[3]._row.cells[2].value) : '';
      var delayAgency4 = data[4] ? (data[4]._row.cells[2].value) : '';
      var delayCode = data[0] ? (data[0]._row.cells[3].value) : '';
      var delayCode1 = data[1] ? (data[1]._row.cells[3].value) : '';
      var delayCode2 = data[2] ? (data[2]._row.cells[3].value) : '';
      var delayCode3 = data[3] ? (data[3]._row.cells[3].value) : '';
      var delayCode4 = data[4] ? (data[4]._row.cells[3].value) : '';
      var equipCode = data[0] ? (data[0]._row.cells[6].value) : '';
      var equipCode1 = data[1] ? (data[1]._row.cells[6].value) : '';
      var equipCode2 = data[2] ? (data[2]._row.cells[6].value) : '';
      var equipCode3 = data[3] ? (data[3]._row.cells[6].value) : '';
      var equipCode4 = data[4] ? (data[4]._row.cells[6].value) : '';
      var duration = data[0] ? (Number(data[0]._row.cells[7].value)) : 0;
      var duration1 = data[1] ? (Number(data[1]._row.cells[7].value)) : 0;
      var duration2 = data[2] ? (Number(data[2]._row.cells[7].value)) : 0;
      var duration3 = data[3] ? (Number(data[3]._row.cells[7].value)) : 0;
      var duration4 = data[4] ? (Number(data[4]._row.cells[7].value)) : 0;
      var remarks = data[0] ? (data[0]._row.cells[8].value) : '';
      var remarks1 = data[1] ? (data[1]._row.cells[8].value) : '';
      var remarks2 = data[2] ? (data[2]._row.cells[8].value) : '';
      var remarks3 = data[3] ? (data[3]._row.cells[8].value) : '';
      var remarks4 = data[4] ? (data[4]._row.cells[8].value) : '';
      var sum = duration + duration1 + duration2 + duration3 + duration4;
      if (
        reason === undefined ||
        reason1 === undefined ||
        reason2 === undefined ||
        reason3 === undefined ||
        reason4 === undefined ||
        delayAgency === undefined ||
        delayAgency1 === undefined ||
        delayAgency2 === undefined ||
        delayAgency3 === undefined ||
        delayAgency4 === undefined ||
        delayCode === undefined ||
        delayCode1 === undefined ||
        delayCode2 === undefined ||
        delayCode3 === undefined ||
        delayCode4 === undefined ||
        equipCode === undefined ||
        equipCode1 === undefined ||
        equipCode2 === undefined ||
        equipCode3 === undefined ||
        equipCode4 === undefined ||
        duration === NaN ||
        duration1 === NaN ||
        duration2 === NaN ||
        duration3 === NaN ||
        duration4 === NaN
      ) {
        var msg = "Please fill all the row data";
        alertify.error(msg);
      }
      else if (Number(Duration) < Number(sum)) {
        var msg = "Sum Of all Delays is not equal to total Delays";
        alertify.error(msg);

      }
      else if (Number(Duration) > Number(sum)) {
        var msg = "Sum Of all Delays is not equal to total Delays";
        alertify.error(msg);
      }
      else {
        updateData(reason, delayAgency, delayCode, equipCode, duration, remarks);
        var total1 = Number(duration) + Number(duration1);
        var total2 = total1 + Number(duration2);
        var total3 = total2 + Number(duration3);
        var total4 = total3 + Number(duration4);
        if (isNaN(duration1) == false && Number(duration1) != 0) {
          insertData1(reason1, delayAgency1, delayCode1, equipCode1, remarks1, duration, total1);
          if (isNaN(duration2) == false && Number(duration2) != 0) {
            insertData2(reason2, delayAgency2, delayCode2, equipCode2, remarks2, total1, total2);
            if (isNaN(duration3) == false && Number(duration3) != 0) {
              insertData3(reason3, delayAgency3, delayCode3, equipCode3, remarks3, total2, total3);
              if (isNaN(duration4) == false && Number(duration4) != 0) {
                insertData4(reason4, delayAgency4, delayCode4, equipCode4, remarks4, total3, total4);
              }
            }
          }
        }

        props.close(false);
      }
    }
  };

  //Reason data api call
  const reasonData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/tsmcdmf001/brkReasondata";
    axiosAPI
      .post(
        url,
        { plantCode: props.plant, compCode: serverDetails.Company, locationPlant: serverDetails.Plant },
        defaultOptions
      )
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = {};

          response.data.reasonData.map((row) => {
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
      });
  };


  //Update Data Api call
  const updateData = async (reason, delayAgency, delayCode, equipCode, duration, remarks, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var newDuration = Number(duration) * 60 * 60;
    var value = props.data.FAO_TM_STOP_ST;
    var endDate = moment(props.data.FAO_TM_STOP_ST).add(newDuration, "seconds");
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
      dt + "-" + months[month] + "-" + year + " " + date.toLocaleTimeString();

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
          // FaqCD: props.data.FAO_CD_FAC_MAST,
          EquipCD: equipCode,
          OutageRsnDesc: "",
          p_line: props.p_line,
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          PersonalNo: serverDetails.PersonalNo,
          plantCode: props.plant,
          compCode: serverDetails.Company,
          delayCode: delayCode,
          delayAgent: delayAgency,
        },
        defaultOptions
      )
      .then(({ data: { eqpFacData, updateData }, status }) => {
        if (updateData.rowsAffected >= 1) {
          alertify.success("Delay Data Updated Successfully");
        } else {
          alertify.error("Unable To Update Data");
        }
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(); //2nd api
      });
  };

  //Insert data1 api call
  const insertData1 = async (
    reason,
    delayAgency,
    delayCode,
    equipCode,
    remarks,
    duration,
    total,
    newToken = false
  ) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var newDuration = Number(duration) * 3600;
    var newTotalDuration = Number(total) * 3600;
    //  var newSec=(newDuration)
    var value = props.data.FAO_TM_STOP_ST;
    var newDate = moment(props.data.FAO_TM_STOP_ST).add(newDuration, "seconds");
    var newEndDate = moment(props.data.FAO_TM_STOP_ST).add(
      newTotalDuration,
      "seconds"
    );
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
      dt + "-" + months[month] + "-" + year + " " + date.toLocaleTimeString();
    var value1 = props.data.FAO_TM_STOP_EN;

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
          coilNo: props.data.FAO_ID_COIL,
          // FaqCD: props.data.FAO_CD_FAC_MAST,
          EquipCD: equipCode,
          OutageRsnDesc: "",
          p_line: props.p_line,
          outDt: props.data.OUTAGE_DT ? props.dateOnlyFunc(props.data.OUTAGE_DT) : props.data.OUTAGE_DT,
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          operator: serverDetails.PersonalNo,
          plant: props.plant,
          company: serverDetails.Company,
          delayCode: delayCode,
          delayAgent: delayAgency,
          resouceCode: props.resouceCode
        },
        defaultOptions
      )
      .then((response) => {
        if (response.data === 1) {
          alertify.success("Delay Data Added Successfully");
        } else {
          alertify.error("Unable To Add Data");
        }
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(); //2nd api
      });
  };

  //Insert data2 api call
  const insertData2 = async (
    reason,
    delayAgency,
    delayCode,
    equipCode,
    remarks,
    duration,
    total,
    newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var newDuration = Number(duration) * 3600;
    var newTotalDuration = Number(total) * 3600;
    //  var newSec=(newDuration)
    var value = props.data.FAO_TM_STOP_ST;
    var newDate = moment(props.data.FAO_TM_STOP_ST).add(newDuration, "seconds");
    var newEndDate = moment(props.data.FAO_TM_STOP_ST).add(
      newTotalDuration,
      "seconds"
    );
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
      dt + "-" + months[month] + "-" + year + " " + date.toLocaleTimeString();
    var value1 = props.data.FAO_TM_STOP_EN;

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
          coilNo: props.data.FAO_ID_COIL,
          EquipCD: equipCode,
          OutageRsnDesc: "",
          p_line: props.p_line,
          outDt: props.dateOnlyFunc(props.data.OUTAGE_DT),
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          operator: serverDetails.PersonalNo,
          plant: props.plant,
          company: serverDetails.Company,
          delayCode: delayCode,
          delayAgent: delayAgency,
          resouceCode: props.resouceCode
        },
        defaultOptions
      )
      .then((response) => {
        if (response.data === 1) {
          alertify.success("Delay Data Added Successfully");
        } else {
          alertify.error("Unable To Add Data");
        }
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(); //2nd api
      });
  };
  //insert data 3 api call
  const insertData3 = async (
    reason,
    delayAgency,
    delayCode,
    equipCode,
    remarks,
    duration,
    total,
    newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var newDuration = Number(duration) * 3600;
    var newTotalDuration = Number(total) * 3600;
    //  var newSec=(newDuration)
    var value = props.data.FAO_TM_STOP_ST;
    var newDate = moment(props.data.FAO_TM_STOP_ST).add(newDuration, "seconds");
    var newEndDate = moment(props.data.FAO_TM_STOP_ST).add(
      newTotalDuration,
      "seconds"
    );
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
      dt + "-" + months[month] + "-" + year + " " + date.toLocaleTimeString();
    var value1 = props.data.FAO_TM_STOP_EN;

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
          coilNo: props.data.FAO_ID_COIL,
          EquipCD: equipCode,
          OutageRsnDesc: "",
          p_line: props.p_line,
          outDt: props.dateOnlyFunc(props.data.OUTAGE_DT),
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          operator: serverDetails.PersonalNo,
          plant: props.plant,
          company: serverDetails.Company,
          delayCode: delayCode,
          delayAgent: delayAgency,
          resouceCode: props.resouceCode
        },
        defaultOptions
      )
      .then((response) => {
        if (response.data === 1) {
          alertify.success("Delay Data Added Successfully");
        } else {
          alertify.error("Unable To Add Data");
        }
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(); //2nd api
      });
  };
  //insert data 4 api call
  const insertData4 = async (
    reason,
    delayAgency,
    delayCode,
    equipCode,
    remarks,
    duration,
    total,
    newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var newDuration = Number(duration) * 3600;
    var newTotalDuration = Number(total) * 3600;
    //  var newSec=(newDuration)
    var value = props.data.FAO_TM_STOP_ST;
    var newDate = moment(props.data.FAO_TM_STOP_ST).add(newDuration, "seconds");
    var newEndDate = moment(props.data.FAO_TM_STOP_ST).add(
      newTotalDuration,
      "seconds"
    );
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
      dt + "-" + months[month] + "-" + year + " " + date.toLocaleTimeString();
    var value1 = props.data.FAO_TM_STOP_EN;

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
          coilNo: props.data.FAO_ID_COIL,
          EquipCD: equipCode,
          OutageRsnDesc: "",
          p_line: props.p_line,
          outDt: props.dateOnlyFunc(props.data.OUTAGE_DT),
          startDate: newStDate,
          Shift: props.data.FAO_CD_SH_OUTAGE,
          operator: serverDetails.PersonalNo,
          plant: props.plant,
          company: serverDetails.Company,
          delayCode: delayCode,
          delayAgent: delayAgency,
          resouceCode: props.resouceCode
        },
        defaultOptions
      )
      .then((response) => {
        if (response.data === 1) {
          alertify.success("Delay Data Added Successfully");
        } else {
          alertify.error("Unable To Add Data");
        }
      })
      .finally((f) => {
        setLoading(false);
        props.refreshTable(); //2nd api
      });
  };

  const delayCodeData = async (cellData, tableData, row, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    // setLoading(true);
    var url = "api/tsmcdmf001/delayCodeData";
    var data = {
      // plantCode: serverDetails.Plant,
      compCode: serverDetails.Company,
      agency: cellData,
      // p_line: selectedProcessLine ? selectedProcessLine.value : "",
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var itemsNew = [];
          response.data.map((row) => {
            var rowArr = row.split(":");
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[1] + "-" + rowArr[0];
            obj.value = rowArr[0];
            itemsNew.push(obj.label)
          });
          var tempArray = delayBreak;
          var result = tempArray.find((obj) => {
            return (obj.id === tableData.id)
          });
          var data = itemsNew;
          var options = {};
          data.map((d) => {
            options[d] = d;
          });
          result.DelayCodeUpdated = options;
          if (index > -1) {
            tempArray.splice(index, 1);
          }
          insertAt(tempArray, index, result);
          var table = row.table;
          table.replaceData(tempArray);

        }
      })
      .finally((f) => {
        setLoading(false);
        return true;
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // setOpen(false);
    props.close(false);
  };

  const insertAt = (array, index, data) => {
    array.splice(index, 0, data);
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

  //date time formatter
  var dateTimeOnly = function (value, data, type, params, column) {
    if (value) {
      //var newVal = new Date(value).toISOString().substring(0, 10);
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
      var newVal =
        dt + "-" + months[month] + "-" + year + " " + date.toLocaleTimeString();
      return newVal;
    }
    return value;
  };
  useEffect(() => {
    setDelayBreakTable(
      new Tabulator("#delayBreakTableData", {
        data: delayBreak, //link data to table
        columns: column,
        height: 400,
        layout: "fitColumns",
      })
    );
  }, [rsn]);

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
    var newStDate =
      dt + "-" + months[month] + "-" + year + " " + date.toLocaleTimeString();
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
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
      download: false,
    },
    {
      title: "Reason",
      editor: "list",
      editorParams: {
        showListOnEmpty: true,
        values: rsn,
        clearable: true,
        autocomplete: "true", allowEmpty: true, listOnEmpty: true, valuesLookup: true
      },
      formatter: "lookup",
      formatterParams: rsn,
    },
    {
      title: "Delay Agency",
      editor: "list",
      editorParams: {
        showListOnEmpty: true,
        values: props.delayAgent,
        clearable: true,
        autocomplete: "true", allowEmpty: true, listOnEmpty: true, valuesLookup: true
      },
      cellEdited: function (cell) {
        delayCodeData(cell._cell.value, cell._cell.row.data, cell._cell.row, true);
      },
      formatter: "lookup",
      formatterParams: props.delayAgent,
    },
    {
      title: "Delay Code",
      field: "DELAY_CODE",
      editor: "list",
      editorParams: function (cell) {
        var options = {
          allowEmpty: false,
          values: cell._cell.row.data.DelayCodeUpdated,
          clearable: true,
          autocomplete: "true", allowEmpty: true, listOnEmpty: true, valuesLookup: true
        }
        return options
        //callback
      },
    },
    {
      title: "Delay Code Updated",
      field: "DelayCodeUpdated",
      visible: false,
      download: false
    },
    {
      title: "rowID",
      field: "rowID",
      visible: false,
      download: false
    },
    {
      title: "Euip Code",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: props.equip,
      },
      formatter: "lookup",
      formatterParams: props.equip,
    },

    { title: "Duration", editor: "number" },
    { title: "Remarks", editor: "input" },
  ];

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          {loading && <Preloader />}
        </Grid>
        <DialogTitle>Delay Break</DialogTitle>
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
                  Plant
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="plant"
                  value={props.data.FAO_PLANT_CD}
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
                  Process Line
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="processLine"
                  value={props.data.FAO_CD_PROCESS}
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
                  Resource
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="resource"
                  value={props.data.FAO_RESOURCE}
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
                  Outage Date
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_order_no"
                  value={props.dateOnlyFunc(props.data.OUTAGE_DT)}
                  disabled
                ></MDInput>
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
                  Shift
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="wo_no"
                  value={props.data.FAO_CD_SH_OUTAGE}
                  disabled
                ></MDInput>
              </Grid>
              <Grid item xs={3.2}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Start Date
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={dateTimeOnly(props.data.FAO_TM_STOP_ST)}
                  disabled
                ></MDInput>
              </Grid>
              <Grid item xs={3.2}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Last Date
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={dateTimeOnly(props.data.FAO_TM_STOP_EN)}
                  disabled
                ></MDInput>
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
                  Duration
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={props.data.DURATION}
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
                  Remarks
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={props.data.FAO_REMARKS}
                  disabled
                ></MDInput>
              </Grid>
              <Grid item xs={5}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Reason
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={`${props.data.FAO_CD_OUTAGE}-${props.data.DESCP}`}
                  disabled
                ></MDInput>
              </Grid>
              {/* <Grid item xs={4.5}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Reason Description
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={props.data.DESCP}
                  disabled
                ></MDInput>
              </Grid> */}
              {/* <Grid item xs={1}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Coil No
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={props.data.FAO_ID_COIL}
                  disabled
                ></MDInput>
              </Grid> */}
              <Grid item xs={4}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Equip Code
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={props.data.FAO_CD_EQP_MAST}
                  disabled
                ></MDInput>
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
                 Facility Code
                </MDTypography>
                <MDInput
                  type="text"
                  fullWidth
                  name="sap_party_code"
                  value={props.data.FAO_CD_FAC_MAST}
                  disabled
                ></MDInput>
              </Grid> */}
            </Grid>
          </MDBox>
          <Grid item xs={12} style={{ marginTop: "2.5rem" }}>
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
                <Grid item xs={3}>
                  <MDTypography variant="h6" color="white">
                    Delay Break Table
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
                  <div id="delayBreakTableData" />
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
            <MDButton
              size="small"
              color="info"
              onClick={() => saveData(props.data.DURATION, true)}
              style={{ margin: "1.5rem" }}
            >
              Save
            </MDButton>
          </Grid>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
