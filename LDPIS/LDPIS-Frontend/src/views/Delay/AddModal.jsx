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
// import moment from 'moment';


import Preloader from "components/Preloader/Preloader";
import { GetAuthorization } from "utils";

const shiftList = [
  { value: "1", label: "A" },
  { value: "2", label: "B" },
  { value: "3", label: "C" },
  //{ value: "4", label: "G" },
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
  const [selectedResource, setSelectedResource] = React.useState("");
  const [iseditable, setiseditable] = useState(false);

  const [masterID, setmasterID] = useState(false);

  const [subequip, setsubequip] = useState([]);
  const [selectedsubequip , setselectedsubequip] = React.useState("");

  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectedProcessLine, setSelectedProcessLine] = React.useState([]);
  
  const [selectedAgentCode, setSelectedAgentCode] = React.useState([]);
  const [selectedAgent, setSelectedAgent] = React.useState([]);
  //const [selectedReason, setSelectedReason] = React.useState([]);
  const [selectedEquip, setSelectedEquip] = React.useState({});
  const [curDate, setCurDate] = React.useState(new Date());
  
  // const [curParameters, setCurParameters] = useState({
  //   curStartTime: curDate,
  //   curEndTime: curDate,
  // });

  const [curParameters, setCurParameters] = useState({
    curStartTime: null,
    curEndTime: null,
  });

  // const [curDuration, setCurDuration] = useState(0);

  const [curDuration, setCurDuration] = useState(0);
  const [delayCategory, setDelayCategory] = useState("");

  //page load
  useEffect(() => {
    if (open) {
      handleAgentChange({
        label: '',
        value: ''
      })
      handleResourceChange({
        label: '',
        value: ''
      })
      handlesubequipChange({
        label: '',
        value: ''
      })
      setInitialLoad(true);
      plantList();
    }
  }, [open]);

  // function millisToHoursAndMinutes(millis) {
  //   const hours = Math.floor(millis / 3600000);
  //   const minutes = Math.floor((millis % 3600000) / 60000);
  //   return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  // }

  function millisToMinutesAndSeconds(millis) {
    var totalMinutes = Math.floor(millis / 60000);
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  useEffect(() => {
    console.log('curParameters.curEndTime',curParameters.curEndTime)
    if (curParameters.curEndTime && curParameters.curStartTime && curParameters.curEndTime !== null && curParameters.curEndTime !== 'null') {
      const durationInMilliseconds = curParameters.curEndTime - curParameters.curStartTime;
      setCurDuration(millisToMinutesAndSeconds(durationInMilliseconds));
    } else {
      setCurDuration(0); // Reset duration if end time is not set
    }
  }, [curParameters]);
  
  // React.useEffect(() => {
  //   setCurDuration(
  //     millisToHoursAndMinutes(
  //       curParameters.curEndTime - curParameters.curStartTime
  //     )
  //   );
  // }, [curParameters]);




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
  const handleAgentChange = async (value) => {
    console.log(value)
    handleAgentCodeChange({
      label: '',
      value: ''
    })
    setSelectedAgent(value);
    setselectedsubequip({}); // Clear the Sub Equipment selection
    if (value) {
      // delayCodeData(value.value, true);
      descEditID(value.value);
    }
    if (value?.value) {
      await subequipmentData(value.value); // Call the function to fetch data
    }
  };

  const handleAgentCodeChange = (value) => {
    setSelectedAgentCode(value);
    // setReason(value?.label?.substring(value?.label?.indexOf('-') + 1));
    setReason(value.label);
  };
  const handleShiftChange = (value) => {
    setSelectedShift(value.label);
  };


  const hanclecategory = (value) => {
    setDelayCategory(value);
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
      var url = "api/LDLTS08D/processLine";
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

  const descEditID = async (value, newToken = false) => {
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      const url = "api/LDLTS08D/descEditID";
      const data = {
        USERIDPNO: serverDetails.PersonalNo,
        DELAYADATA: value,
      };
      console.log('---descEditID-->', data);

      const response = await axiosAPI.post(url, data, defaultOptions);

      // Check if response.data has the expected format/
      if (response.data && response.data.rows) {
        console.log(response.data.rows[0]);
        console.log(response.data);
        const items = response.data.rows.map((row) => {
          return { value: row[0] }; 
        });
        setiseditable(response.data.rows[0] > 0); 
      } else {
        console.error("Unexpected response format:", response.data);
        setiseditable(false); 
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      setiseditable(false); // Keep disabled on error
    } finally {
      setLoading(false);
    }
  };

  const getMasterID = async (value, newToken = false) => {
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      const url = "api/LDLTS08D/getMasterID";
      const data = {
        USERIDPNO: serverDetails.PersonalNo,
      };
      console.log('---getMasterID-->', data);

      const response = await axiosAPI.post(url, data, defaultOptions);

      if (response.data && response.data.rows) {
        console.log(response.data.rows[0]);
        console.log(response.data);
        const items = response.data.rows.map((row) => {
          return { value: row[0] }; 
        });
        setmasterID(response.data.rows[0] > 0); 
      } else {
        console.error("Unexpected response format:", response.data);
        setmasterID(false); 
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      setmasterID(false); // Keep disabled on error
    } finally {
      setLoading(false);
    }
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
      var url = "api/LDLTS08D/delayAgency";    //Delay Agency
      var data = {
      plantCode: selectedPlant?.value || "0780",
      // line: value
      line: value?.substring(0, 4)
              // compCode: serverDetails.Company,
        // locationPlant: serverDetails.Plant,
      };
      console.log(data);
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

  const delayCodeData = async (DA, newToken = false) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDLTS08D/delayCodeData";   //Delay Code
      var data = {
        plantCode: selectedPlant?.value || "0780",
        compCode: serverDetails.Company,
        agency: selectedAgent ? selectedAgent?.value : "",
        p_line: selectedProcessLine ? selectedProcessLine.value : "",
        DA: DA,
      };

console.log('data',data);

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
      var url = "api/LDLTS08D/equipData";
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
    var url = "api/LDLTS08D/addReasonData";
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
      var url = "api/LDLTS08D/resourceData";
      var data = {
        plantCode: selectedPlant?.value,
        compCode: serverDetails?.Company,
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
              // obj.label = rowArr[1];;
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

  const subequipmentData = async (cda, newToken = false) => {
    debugger
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      //vendor List api call
      var url = "api/LDLTS08D/subequipmentData";
      console.log(selectedResource?.value);
      var data = {
        plantCode: selectedPlant?.value,
        compCode: serverDetails?.Company,
        // eqicd: eqicd,
        eqicd: selectedResource?.value?.slice(0, 4),
        // cda: selectedAgent.value,
        cda: cda,
      };
      console.log('data --- >',data)
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
              obj.label = rowArr[0] + "-" + rowArr[1];
              // obj.label =  rowArr[1];
              obj.value = rowArr[0];
              items.push(obj);
            });
            setsubequip(items);
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
      var url = "api/LDLTS08D/plantList";
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
            if (items.length > 0) {
              // setSelectedPlant(items[0]); // Set the first item as selected
            }
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
    handlesubequipChange({
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
    handlesubequipChange({
      label: '',
      value: ''
    })
    setSelectedPlant(value);
    if (value) {
      processLineData(value.value);
      // resourceData(value.value);
      equipData(value.value);
      //reasonData(value.value);
      // delayAgentData(value.value);
    }
  };

  //Resouce
const handleResourceChange = async (value) => {
  handleAgentChange({
    label: '',
    value: ''
  });
  handlesubequipChange({
    label: '',
    value: ''
  });

  setSelectedResource(value);
  delayAgentData(value.value);
};


  const handlesubequipChange = (value) => {
    setselectedsubequip(value);
    setSelectedAgentCode({}); // Clear the Delay Code
    if (value) {
      delayCodeData(value.value, true);
      // descEditID(value.value);
    }
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
    console.log(selectedProcessLine, selectedAgentCode, selectedResource,curDuration);

    // New check for startDate being more than 48 hours in the past
    const fortyEightHoursInMillis = 48 * 60 * 60 * 1000;
    if (newDate.getTime() - startDate.getTime() > fortyEightHoursInMillis) {
      alertify.error("Delay should be booked within 2 days"); // Assuming "3 days" is the intended message for >48 hours
      setLoading(false);
      return;
    }

    if (curParameters.curEndTime <= curParameters.curStartTime) {
      alertify.error("End date should be greater than start date");
      setLoading(false);
      return;
    }

    // Check for selectedPlant, ensuring it's not null or empty
    if (!selectedPlant || (typeof selectedPlant === "object" && (!selectedPlant.label || !selectedPlant.value))) {
      alertify.error("Plant Should Not Be Blank");
      setLoading(false);
      return;
    } 
    
    // Check for selectedProcessLine
    if (!selectedProcessLine || (typeof selectedProcessLine === "object" && (!selectedProcessLine.label || !selectedProcessLine.value))) {
      alertify.error("Process Line Code Should Not Be Blank");
      setLoading(false);
      return;
    }
    
    // Check for selectedResource
    if (!selectedResource || (typeof selectedResource === "object" && (!selectedResource.label || !selectedResource.value))) {
      alertify.error("Line/Equipment Should Not Be Blank");
      setLoading(false);
      return;
    }

    // Check for selectedAgent
    if (!selectedAgent || (typeof selectedAgent === "object" && (!selectedAgent.label || !selectedAgent.value))) {
      alertify.error("Delay Agency Should Not Be Blank");
      setLoading(false);
      return;
    }

    //Check for selectedResource
    if (!selectedsubequip || (typeof selectedsubequip === "object" && (!selectedsubequip.label || !selectedsubequip.value))) {
      alertify.error("Sub Equipment Should Not Be Blank");
      setLoading(false);
      return;
    }
    

    
    // Check for selectedAgentCode
    if (!selectedAgentCode || (typeof selectedAgentCode === "object" && (!selectedAgentCode.label || !selectedAgentCode.value))) {
      alertify.error("Delay Code Should Not Be Blank");
      setLoading(false);
      return;
    }

    if (iseditable && (!remark || remark.trim() === "" || remark === null)) {
      alertify.error("Description should not be blank when editable");
      return;
    }
    if (isDurationExceeded) {
      alertify.error("Duration cannot exceed 8 hours");
      return;
    }
    
    // // Check for selectedEquip
    // if (!selectedEquip || (typeof selectedEquip === "object" && (!selectedEquip.label || !selectedEquip.value))) {
    //   alertify.error("Equipment Should Not Be Blank");
    //   setLoading(false);
    //   return;
    // }
    
    // Check for curDuration
    function parseDuration(duration) {
      if (!duration) return 0; // Handle undefined or null
      const parts = duration.split(':').map(part => parseInt(part, 10));
      return parts.length === 2 ? parts[0] * 60 + parts[1] : parts[0]; // Convert to total seconds
    }
    const totalDurationInSeconds = parseDuration(curDuration);
      if (totalDurationInSeconds === 0) {
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
        var url = "api/LDLTS08D/insertDelayData";
        var data = {
          compCode: serverDetails.Company,
          plantCode: selectedPlant.value,
          shift: selectedShift,
          reason: reason,
          remark: remark,
          coilNo: coilNo,
          equipCode: delayCategory,
          createdUser: serverDetails.PersonalNo,
          fromDate: fromDate,
          toDate: toDate,
          delayCode: selectedAgentCode ? selectedAgentCode.value : "",
          delayAgent: selectedAgent ? selectedAgent.value : "",
          processLine: selectedProcessLine.value,
          resouceCode: selectedResource.value?.trim(),
          subequipcd: selectedsubequip.value?.trim(),
          // cat: s
        };
        console.log('dataModal1',data)

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
    const date = new Date(e.target.value);
    setCurParameters((prev) => ({
      ...prev,
      curStartTime: date,
    }));
  };

  // Function to handle end time change
  const handleEndTimeChangeCur = (e) => {
    const date = new Date(e.target.value);
    setCurParameters((prev) => ({
      ...prev,
      curEndTime: date,
    }));
  };

  // const handleStartTimeChangeCur = (e) => {
  //   setCurParameters({
  //     ...curParameters,
  //     curStartTime: e,
  //   });
  // };
  // const handleEndTimeChangeCur = (e) => {
  //   setCurParameters({
  //     ...curParameters,
  //     curEndTime: e,
  //   });
  // };

  // function millisToMinutesAndSeconds(millis) {
  //   var minutes = Math.floor(millis / 60000);
  //   var seconds = ((millis % 60000) / 1000).toFixed(0);
  //   var hours = (minutes/60).toFixed(0);
  //   var aminutes = Math.floor(millis - (hours*60) / 60000).toFixed(2);
  //   // return hours+ "."+ minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  //   return hours + ":" + aminutes;
  // }

  function millisToMinutesAndSeconds(millis) {
    // Calculate total minutes
    var totalMinutes = Math.floor(millis / 60000);
    
    // Calculate hours and remaining minutes
    var hours = Math.floor(totalMinutes / 60);
    var minutes = totalMinutes % 60;
    
    // Format hours and minutes to ensure two digits
    var formattedHours = hours.toString().padStart(2, '0');
    var formattedMinutes = minutes.toString().padStart(2, '0');
    
    // Return the formatted time in HH:MM format
    return formattedHours + ":" + formattedMinutes;
}


  React.useEffect(() => {
    setCurDuration(
      millisToMinutesAndSeconds(
        curParameters.curEndTime - curParameters.curStartTime
      )
    );
  }, [curParameters]);

  useEffect(() => {
    if (curParameters.curEndTime && curParameters.curStartTime) {
      const durationInMilliseconds = curParameters.curEndTime - curParameters.curStartTime;
      const totalMinutes = Math.floor(durationInMilliseconds / 60000);
      if (totalMinutes > 120) {
        setDelayCategory("Cat - 1");
      } else if (totalMinutes > 60) {
        setDelayCategory("Cat - 2");
      } else {
        setDelayCategory("Cat - 3");
      }
      setCurDuration(millisToMinutesAndSeconds(durationInMilliseconds));
    } else {
      // Reset duration and category if end time isn't set
      setCurDuration("00:00");
      setDelayCategory("");
    }
  }, [curParameters]);
  

// useEffect(() => {
//   const durationInMilliseconds = curParameters.curEndTime - curParameters.curStartTime;

//   // Only update delay category if curEndTime is set
//   if (curParameters.curEndTime) {
//     const totalMinutes = Math.floor(durationInMilliseconds / 60000);
//     if (totalMinutes > 120) {
//       setDelayCategory("Cat - 1");
//     } else if (totalMinutes > 60) {
//       setDelayCategory("Cat - 2");
//     } else if (totalMinutes < 0.00000000000001) {
//       setDelayCategory("");
//     } else {
//       setDelayCategory("Cat - 3");
//     }
//   } else {
//     // Reset category if end time isn't set
//     setDelayCategory("");
//   }

//   setCurDuration(millisToMinutesAndSeconds(durationInMilliseconds));
// }, [curParameters]);
//added by yogesh on 29-07-2026 to prevent addition of delay more than 8hr in single shift.
  const isDurationExceeded = React.useMemo(() => {
    if (!curDuration || curDuration === "00:00") return false;
    const [hours, minutes] = curDuration.split(":").map(Number);
    return hours * 60 + minutes > 480;
  }, [curDuration]);

  return (
    <React.Fragment>
      <Tooltip title="Add">
        <IconButton color="white" onClick={handleClickOpen}>
          <LibraryAddIcon />
        </IconButton>
      </Tooltip>

      <Dialog
        fullWidth={fullWidth}
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
        <DialogTitle>Book Delay Data</DialogTitle>
        <DialogContent>
          <MDBox px={3} py={1} style={{ height: "22rem" }}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  1.Plant*
                </MDTypography>
                <ReactSelect options={plant} 
                                  value={{
                                    label: selectedPlant?.label,
                                    value: selectedPlant?.value
                                  }}
                                  onChange={handlePlantChange} />
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
                  2.Process*
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

              <Grid item xs={2.5}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  3.Line/Equipment*{/* Equipment -- name was changed in place of Resource*/}
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

              <Grid item xs={2.5}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  4 .Delay Agency*
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
              <Grid item xs={3}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                  5.Sub Equipment*
                </MDTypography>
                <ReactSelect
                  options={subequip}
                  value={{
                    label: selectedsubequip?.label,
                    value: selectedsubequip?.value
                  }}
                  onChange={handlesubequipChange}
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
                  6.Delay Code*
                </MDTypography>
                <ReactSelect
                  id="delayCode"
                  value={{
                    label: selectedAgentCode?.label,
                    value: selectedAgentCode?.value
                  }}
                  options={agentCodeAdd}
                  onChange={handleAgentCodeChange}
                  style={{ marginTop: "1rem" }}

                  maxMenuHeight={220}
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
                  7.Start Date and Time*
                </MDTypography>
                <MuiDateTimePicker
                  id="curStartTime"
                  value={curParameters.curStartTime}
                  onChange={handleStartTimeChangeCur}
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
                  8.End Date and Time*
                </MDTypography>
                <MuiDateTimePicker
                  id="curEndTime"
                  value={curParameters.curEndTime}
                  onChange={handleEndTimeChangeCur}
                />
              </Grid> */}


<Grid item xs={2.5}>
  <MDTypography
    fontWeight="regular"
    fontSize="small"
    textTransform="capitalize"
    variant="h6"
    color={"dark"}
    noWrap
  >
    7. Start Date and Time*
  </MDTypography>
  <input
    type="datetime-local"
    id="curStartTime"
    value={curParameters.curStartTime ? moment(curParameters.curStartTime).format('YYYY-MM-DDTHH:mm') : ''}
    onChange={handleStartTimeChangeCur}
    style={{ height: "37px" ,width: "250px"}}
  />
</Grid>

<Grid item xs={2.5}>
  <MDTypography
    fontWeight="regular"
    fontSize="small"
    textTransform="capitalize"
    variant="h6"
    color={"dark"}
    noWrap
  >
    8. End Date and Time*
  </MDTypography>
  <input
    type="datetime-local"
    id="curEndTime"
    value={curParameters.curEndTime ? moment(curParameters.curEndTime).format('YYYY-MM-DDTHH:mm') : ''}
    onChange={handleEndTimeChangeCur}
    style={{ height: "37px" ,width: "250px"}}
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
                  Duration (in HH:MM)
                </MDTypography>
                <MDInput
                  type="text"
                  id="slitcount"
                  value={curDuration?.toString()}
                  inputProps={{ maxLength: 30 }}
                  maxMenuHeight={220}
                  sx={{"& .MuiInputBase-root": { 
                    backgroundColor: isDurationExceeded ? "#ffebee" : "inherit",
                    border: isDurationExceeded ? "2px solid red" : "",
                  },
                  }}
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
                  Delay category
                </MDTypography>
                <ReactSelect
                  id="delayCategory"
                  value={{
                    label: delayCategory,
                    value: delayCategory
                  }}

                            options={[
            { label: "Cat - 1", value: "Cat-1" },
            { label: "Cat - 2", value: "Cat-2" },
            { label: "Cat - 3", value: "Cat-3" }
          ]}
          isDisabled={true} // Make the dropdown read-only
          // iseditable = {false}
                  onChange={hanclecategory}
                  style={{ marginTop: "1rem" }}

                  maxMenuHeight={220}
                />
              </Grid>

              {/* <Grid item xs={1.7}>
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
              </Grid> */}

              {/* <Grid item xs={3}>
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
                  id="Reason"
                  value={reason}
                  fullWidth
                  onChange={() => { }}
                  maxMenuHeight={220}
                />
              </Grid> */}
              <Grid item xs={6}>
                <MDTypography
                  fontWeight="regular"
                  fontSize="small"
                  textTransform="capitalize"
                  variant="h6"
                  color={"dark"}
                  noWrap
                >
                   Description
                   {/* {iseditable && '*'} */}
                </MDTypography>
                <MDInput
                  type="text"
                  id="slitcount"
                  value={remark}
                  fullWidth
                  onChange={handleRemarkchange}
                  maxMenuHeight={220}
                  // disabled={!iseditable} 
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
              ADD.
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
