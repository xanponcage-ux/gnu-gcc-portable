import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import ReactSelect from "components/Select/ReactSelect";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import alertify from "alertifyjs";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import IconButton from "@mui/material/IconButton";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import MDAlert from "components/MDAlert";
import DateTimePicker from "components/DateTime/DatePicker";
import { Co2Sharp } from "@mui/icons-material";
import { getAutoHeightDuration } from "@mui/material/styles/createTransitions";
import MuiDateTimePicker from "components/DateTime/MuiDateTimePicker";
import "moment/locale/en-gb.js";
import moment from "moment";

import Preloader from "components/Preloader/Preloader";
import { GetAuthorization } from "utils";

const shiftList = [
  { value: "1", label: "A" },
  { value: "2", label: "B" },
  { value: "3", label: "C" },
];

const ProcessLine = [
  { label: "PLTCM-P", value: "P" },
  { label: "CPL1-C", value: "C" },
  { label: "CPL2-T", value: "T" },
];

export default function MaxWidthDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const [initialLoad, setInitialLoad] = useState(false);
  const [reason, setReason] = useState("");
  const [equipAdd, setEquip] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [reasonDesc, setReasonDesc] = React.useState("");
  const [selectedShift, setSelectedShift] = React.useState("A");
  const [remark, setRemark] = useState("");
  const [coilNo, setCoilNo] = useState("");
  // const [selectedProcess, setSelectedProcess]= React.useState('P');
  const [agentCodeAdd, setAgentCodeAdd] = useState([]);
  const [delayAgency, setDelayAgency] = useState([]);
  const [processLine, setProcessLine] = useState([]);
  const [plant, setPlant] = useState([]);
  const [resource, setResource] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectedProcessLine, setSelectedProcessLine] = React.useState([]);
  const [selectedResource, setSelectedResource] = React.useState("");
  const [selectedAgentCode, setSelectedAgentCode] = React.useState([]);
  const [selectedAgent, setSelectedAgent] = React.useState([]);
  //const [selectedReason, setSelectedReason] = React.useState([]);
  const [selectedEquip, setSelectedEquip] = React.useState({});
  const [curDate, setCurDate] = React.useState(new Date());
  const [curParameters, setCurParameters] = useState({
    curStartTime: curDate,
    curEndTime: curDate,
  });
  const [curDuration, setCurDuration] = useState(0);

  //page load
  useEffect(() => {
    if (open) {
      handleAgentChange({
        label: '',
        value: ''
      })
      setInitialLoad(true);
      plantList();
    }
  }, [open]);




  //months list for date formatter
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
        dt +
        "-" +
        months[month] +
        "-" +
        year +
        " " +
        date.toLocaleTimeString("en-US", {
          hour12: false,
        });
      return newVal;
    }
    return value;
  };

  var dateOnly = function (value, data, type, params, column) {
    if (value) {
      //var newVal = new Date(value).toISOString().substring(0, 10);
      var date = new Date(value);
      var year = date.getFullYear();
      var month = date.getMonth();
      var dt = date.getDate();

      if (dt < 10) {
        dt = "0" + dt;
      }
      //  if (month < 10) {
      //    month = "0" + month;
      //  }
      var newVal = dt + "-" + months[month] + "-" + year;
      return newVal;
    }
    return value;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setRemark("");
    setCoilNo("");
    setSelectedPlant([]);
    setSelectedProcessLine([]);
    //setSelectedReason([]);
    setSelectedEquip({});
    setSelectedAgent([]);
  };

  const handleReasonChange = (e) => {
    // setReasonDesc(value.value);
    // setSelectedReason(value);
    setReason(e.target.value);
    //setSelectedReason(e.target.value);
  };

  const handleEquipChange = (value) => {
    setSelectedEquip(value);
  };
  const handleAgentChange = (value) => {
    handleAgentCodeChange({
      label: '',
      value: ''
    })
    setSelectedAgent(value);
    if (value) {
      delayCodeData(value.value, true);
    }
  };

  const handleAgentCodeChange = (value) => {
    setSelectedAgentCode(value);
    setReason(value?.label?.substring(value?.label?.indexOf('-') + 1));
  };
  const handleShiftChange = (value) => {
    setSelectedShift(value.label);
  };

  //process line
  const processLineData = async (value, newToken = false) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      //vendor List api call
      var url = "api/LDSM008/processLine";
      var data = {
        plantCode: value,
        compCode: serverDetails.Company,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });
            setProcessLine(items);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    })
  };

  //delay
  const delayAgentData = async (value, newToken = false) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      setLoading(true);
      var url = "api/LDSM008/delayAgentData";
      var data = {
        plantCode: value,
        compCode: serverDetails.Company,
        locationPlant: serverDetails.Plant,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            var row;
            response.data.map((row) => {
              var obj = new Object();
              var rowArr = row.split(":");
              obj.label = rowArr[1] + "-" + rowArr[0];
              obj.value = rowArr[1];
              items.push(obj);
            });
            setDelayAgency(items);
          }
        })
        .finally((f) => {
          setLoading(false);
          return true;
          //  props.refreshTable(); //2nd api
        });
    })
  };

  const delayCodeData = async (agency, newToken = false) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM008/delayCodeData";
      var data = {
        plantCode: selectedPlant.value,
        compCode: serverDetails.Company,
        agency: agency,
        p_line: selectedProcessLine ? selectedProcessLine.value : "",
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            var row;
            response.data.map((row) => {
              var obj = new Object();
              var rowArr = row.split(":");
              obj.label = rowArr[1] + "-" + rowArr[0];
              obj.value = rowArr[1];
              items.push(obj);
            });
            setAgentCodeAdd(items);
          }
        })
        .finally((f) => {
          setLoading(false);
          return true;
          //  props.refreshTable(); //2nd api
        });
    })
  };

  //equip data
  const equipData = async (value, newToken = false) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      setLoading(true);
      var url = "api/LDSM008/equipData";
      var data = {
        plantCode: value,
        compCode: serverDetails.Company,
        p_line: selectedProcessLine ? selectedProcessLine.value : "",
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            var row;
            response.data.map((row) => {
              var obj = new Object();
              var rowArr = row.split(":");
              obj.label = rowArr[0] + "-" + rowArr[1];
              obj.value = rowArr[0];
              items.push(obj);
            });
            setEquip(items);
          }
        })
        .finally((f) => {
          setLoading(false);
          return true;
          //  props.refreshTable(); //2nd api
        });
    })
  };

  // reason data
  const reasonData = async (value, newToken = false) => {

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/LDSM008/addReasonData";
    var data = {
      plantCode: value,
      compCode: serverDetails.Company,
      locationPlant: serverDetails.Plant,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          var row;
          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[0] + "-" + rowArr[1];
            obj.value = rowArr[0];
            items.push(obj);
          });

          setReason(items);
        }
      })
      .finally((f) => {
        setLoading(false);
        return true;
        //  props.refreshTable(); //2nd api
      });
  };

  //Resource List
  const resourceData = async (value, newToken = false) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      //vendor List api call
      var url = "api/LDSM008/resourceData";
      var data = {
        plantCode: selectedPlant.value,
        compCode: serverDetails.Company,
        shiftCode: "A",
        stageCd: value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              var rowArr = row.split(",");
              obj.label = rowArr[0] + "-" + rowArr[1];;
              obj.value = rowArr[0];
              items.push(obj);
            });
            setResource(items);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    })
  };

  //plant List
  const plantList = async (newToken = false) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      //vendor List api call
      var url = "api/LDSM008/plantList";
      var data = {
        adid: serverDetails.PersonalNo,
        // plantCode: serverDetails.Plant,
        // compCode: serverDetails.Company,
      };
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
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    })
  };
  const handleRemarkchange = (e) => {
    setRemark(e.target.value);
  };

  // process dropdown function
  const handleProcessChange = async (value) => {
    handleResourceChange({
      label: '',
      value: ''
    })
    setSelectedProcessLine(value);
    if (value) {
      resourceData(value.value);
    }
  };
  //plant
  const handlePlantChange = async (value) => {
    handleProcessChange({
      label: '',
      value: ''
    })
    setSelectedPlant(value);
    if (value) {
      processLineData(value.value);
      // resourceData(value.value);
      equipData(value.value);
      //reasonData(value.value);
      delayAgentData(value.value);
    }
  };

  //Resouce
  const handleResourceChange = (value) => {
    handleAgentChange({
      label: '',
      value: ''
    })
    setSelectedResource(value);
  };
  const handleCoilChange = (e) => {
    setCoilNo(validationFormatter(e.target.value));
  };

  //Validation Formatter
  var validationFormatter = function (value) {
    if (value) {
      var formattedValue = value.toUpperCase().replace(/[^A-Z0-9]+/gi, "");
      return formattedValue;
    }
    return value;
  };
  const insertRow = async (newToken = false) => {
    var newDate = new Date();
    var time = newDate.toLocaleTimeString();
    // var fromDate = document.getElementById("curStartTime").value
    // var toDate = document.getElementById("curEndTime").value

    var startDate = curParameters?.curStartTime;
    var fromDate = ('0' + startDate.getDate()).slice(-2) + '-' + startDate.toString().substr(4, 3) + '-' + startDate.getFullYear() + ' ' + startDate.getHours() + ':' + startDate.getMinutes();

    var endDate = curParameters?.curEndTime;
    var toDate = ('0' + endDate.getDate()).slice(-2) + '-' + endDate.toString().substr(4, 3) + '-' + endDate.getFullYear() + ' ' + endDate.getHours() + ':' + endDate.getMinutes();

    if (selectedPlant == "" || selectedPlant == null) {
      alertify.error("Plant Should Not Be Blank");
      setLoading(false);
      return;
    } else if (selectedProcessLine == "" || selectedProcessLine == null) {
      alertify.error("Process Line Code Should Not Be Blank");
      setLoading(false);
      return;
    } else if (selectedResource == "" || selectedResource == null) {
      alertify.error("Resource Should Not Be Blank");
      setLoading(false);
      return;
    }
    // else if (selectedAgent == "" || selectedAgent == null) {
    //   alertify.error("Delay Agency Should Not Be Blank");
    //   setLoading(false);
    //   return;
    // }
    else if (selectedAgentCode == "" || selectedAgentCode == null) {
      alertify.error("Delay Code Should Not Be Blank");
      setLoading(false);
      return;
    }
    else if (selectedEquip == "" || selectedEquip == null) {
      alertify.error("Equipment Should Not Be Blank");
      setLoading(false);
      return;
    }
    if (curDuration == "" || selectedEquip == null || curDuration == 0) {
      alertify.error("Duration Should Not Be 0");
      setLoading(false);
      return;
    }
    else {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };

        setLoading(true);
        var url = "api/LDSM008/insertDelayData";
        var data = {
          compCode: serverDetails.Company,
          plantCode: selectedPlant.value,
          shift: selectedShift,
          reason: reason,
          remark: remark,
          coilNo: coilNo,
          equipCode: selectedEquip?.value ?? "Z",
          createdUser: serverDetails.PersonalNo,
          fromDate: fromDate,
          toDate: toDate,
          delayCode: selectedAgentCode ? selectedAgentCode.value : "",
          delayAgent: selectedAgent ? selectedAgent.value : "",
          processLine: selectedProcessLine.value,
          resouceCode: selectedResource.value?.trim(),
        };

        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            console.log(response)
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
              alertify.error("Error: " + response?.error?.response?.data?.toString());
              //alertify.error(response.error.response.data);
            } else {
              if (response.data.rowsAffected > 0) {
                alertify.success("Delay Data Added Successfully");
                props.getData();
                setLoading(false);
                handleClose();
              } else {
                alertify.error("Unable To Add Data");
                handleClose();
                setLoading(false);
              }
            }
          })

          .finally((f) => {
            setLoading(false);
          });
      })
    }
  };

  //Date time formatter
  //date time formatter
  var dateTimeOnly = function (value, data, type, params, column) {
    if (value) {
      //var newVal = new Date(value).toISOString().substring(0, 10);
      var date = new Date(value);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var dt = date.getDate();

      if (dt < 10) {
        dt = "0" + dt;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var newVal =
        dt + "/" + month + "/" + year + " " + date.toLocaleTimeString();
      return newVal;
    }
    return value;
  };

  const handleStartTimeChangeCur = (e) => {
    setCurParameters({
      ...curParameters,
      curStartTime: e,
    });
  };
  const handleEndTimeChangeCur = (e) => {
    setCurParameters({
      ...curParameters,
      curEndTime: e,
    });
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  React.useEffect(() => {
    setCurDuration(
      millisToMinutesAndSeconds(
        curParameters.curEndTime - curParameters.curStartTime
      )
    );
  }, [curParameters]);

  return (
    <React.Fragment>
      <Tooltip title="Add">
        <IconButton color="white" onClick={handleClickOpen}>
          <LibraryAddIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        fullWidth={fullWidth}
        //maxWidth={maxWidth}
        maxWidth={fullWidth}
        open={open}
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
        <DialogTitle>Add Delay Management Data</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          <MDBox px={3} py={1} style={{ height: "20rem" }}>
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
                  Plant
                </MDTypography>
                <ReactSelect options={plant} onChange={handlePlantChange} />
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
                  Process Line
                </MDTypography>
                <ReactSelect
                  options={processLine}
                  value={{
                    label: selectedProcessLine?.label,
                    value: selectedProcessLine?.value
                  }}
                  onChange={handleProcessChange}
                />
              </Grid>
              <Grid item xs={2.25}>
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
                <ReactSelect
                  options={resource}
                  value={{
                    label: selectedResource?.label,
                    value: selectedResource?.value
                  }}
                  onChange={handleResourceChange}
                />
              </Grid>
              <Grid item xs={1.7}>
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
                <MuiDateTimePicker
                  id="curStartTime"
                  value={curParameters.curStartTime}
                  onChange={handleStartTimeChangeCur}
                />
              </Grid>
              <Grid item xs={1.7}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  End Date
                </MDTypography>
                <MuiDateTimePicker
                  id="curEndTime"
                  value={curParameters.curEndTime}
                  onChange={handleEndTimeChangeCur}
                />
              </Grid>
              <Grid item xs={.7}>
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
                  id="slitcount"
                  value={curDuration?.toString()}
                  inputProps={{ maxLength: 30 }}
                  maxMenuHeight={220}
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
                  Shift
                </MDTypography>
                <ReactSelect
                  id="Shift"
                  options={shiftList}
                  defaultValue={shiftList[0]}
                  onChange={handleShiftChange}
                  style={{ marginTop: "1rem" }}
                />
              </Grid>
              <Grid item xs={4}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Delay Agency
                </MDTypography>
                <ReactSelect
                  id="delayAgent"
                  options={delayAgency}
                  value={{
                    label: selectedAgent?.label,
                    value: selectedAgent?.value
                  }}
                  onChange={handleAgentChange}
                  style={{ marginTop: "1rem" }}
                  maxMenuHeight={220}
                />
              </Grid>
              <Grid item xs={4}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Delay Code
                </MDTypography>
                <ReactSelect
                  id="delayCode"
                  value={{
                    label: selectedAgentCode?.value,
                    value: selectedAgentCode?.value
                  }}
                  options={agentCodeAdd}
                  onChange={handleAgentCodeChange}
                  style={{ marginTop: "1rem" }}

                  maxMenuHeight={220}
                />
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
                  Reason
                </MDTypography>
                {/* <ReactSelect
                  id="Reason"
                  options={reason}
                  onChange={handleReasonChange}
                  style={{ marginTop: "1rem" }}
                  maxMenuHeight={220}
                /> */}

                <MDInput
                  type="text"
                  id="Reason"
                  value={reason}
                  fullWidth
                  onChange={() => { }}
                  maxMenuHeight={220}
                />
              </Grid>
              {/* <Grid item xs={4}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Equipment Code
                </MDTypography>
                <ReactSelect
                  id="EquipCode"
                  options={equipAdd}
                  onChange={handleEquipChange}
                  style={{ marginTop: "1rem" }}
                  maxMenuHeight={200}
                />
              </Grid> */}
              <Grid item xs={5}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  Description
                </MDTypography>
                <MDInput
                  type="text"
                  id="slitcount"
                  value={remark}
                  fullWidth
                  onChange={handleRemarkchange}
                  // inputProps={{ maxLength: 30 }}
                  maxMenuHeight={220}
                />
              </Grid>
            </Grid>
          </MDBox>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem", marginLeft: "100rem" }}
          >
            <MDButton
              size="small"
              color="info"
              style={{ marginTop: "1.5rem" }}
              onClick={insertRow}
            >
              Add
            </MDButton>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem" }}
          >
            <Button style={{ marginTop: "1.5rem" }} onClick={handleClose}>
              Close
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
