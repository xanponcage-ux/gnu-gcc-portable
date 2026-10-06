import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import moment from "moment";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactMultiSelect from "components/Select/ReactMultiSelect";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddModal from "./AddModal";
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
// const [open, setOpen] = React.useState(false);

// Data
import routes from "routes";
import SaveModal from "./SaveModal";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Chip from "@mui/material/Chip";
import "../../tabulatorCss.scss";
import { propTypes } from "react-barcode/lib/react-barcode";
import { experimentalStyled } from "@mui/material";
import { GetAuthorization } from "utils";


const defaultvalues = {
  selectShift: "",
  EqpCD: "",
  FaqCD: "",
};

export default function LDLTS08D() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [delayManagementTable, setDelayManagementTable] = React.useState(null);
  // const [filter, setFilter] = useState("All");
  const [filter, setFilter] = useState(defaultvalues);
  const [totalCount, setTotalCount] = useState([]);
  const [DelayInHrs, setDelayInHrs] = useState("");
  const [workingHrs, setWorkingHrs] = useState("");
  const [totalHrs, setTotalHrs] = useState("");
  const [mttr, setMttr] = useState([]);
  const [linUtil, setLinUtil] = useState("");
  const [mtbf, setMtbf] = useState([]);
  const [delayData, setDelayData] = useState([]);
  const [totalDelays, setTotalDelays] = useState(0); // State to store the total 
  const [equip, setEquip] = useState([]);
  const [fac, setFac] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [reason, setReason] = useState([]);
  const [reasonDesc, setReasonDesc] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [delayUnbookChecked, setDelayUnbookChecked] = useState(false);

  const [nullrem, setNullrem] = useState(false); 

  const [agentCode, setAgentCode] = useState([]);
  const [agentCodeAdd, setAgentCodeAdd] = useState([]);
  const [delayAgent, setDelayAgent] = useState([]);
  const [delayAgentAdd, setDelayAgentAdd] = useState([]);
  const [selectedDelayAgency, setSelectedDelayAgency] = useState(null);
  const [processLine, setProcessLine] = useState([]);
  const [selectedProcessLine, setSelectedProcessLine] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState("");
  const [resource, setResource] = useState([]);
  const [selectedResource, setSelectedResource] = React.useState([]);
  

  const [subequip, setsubequip] = useState([]);
  const [selectedsubequip , setselectedsubequip] = React.useState("");
  const [iseditable, setiseditable] = useState(false);

  const [notification, setnotification] = useState(0);
  const [RunnHrs, setRunnHrs] = useState(0);

  const [saveAgentCode, setSaveAgentCode] = useState([]);
  const [visibilty, setVisibility] = useState([]);
  const [dateValue, setDateValue] = useState();
  const [dateValueTo, setDateValueTo] = useState();
  const [selectShift, setSelectShift] = useState('');

  const Shift = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    // { label: "G", value: "G" },
  ];
  const [selectpreviousmonth, setselectpreviousmonth] = useState('');
  const previousmonth = [
    { label: "1 Month",   value: "1" },
    { label: "2 Months",  value: "2" },
    { label: "3 Months",  value: "3" },
    { label: "4 Months",  value: "4" },
    { label: "5 Months",  value: "5" },
    { label: "6 Months",  value: "6" },
    { label: "7 Months",  value: "7" },
    { label: "8 Months",  value: "8" },
    { label: "9 Months",  value: "9" },
    { label: "10 Months", value: "10" },
    { label: "11 Months", value: "11" },
    { label: "12 Months", value: "12" },
  ];
  
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  // const handleDelayAgencyChange = async (selectedOption) => {
  //   setSelectedDelayAgency(selectedOption);

  //   if (selectedOption) {
  //     // Fetch Sub Equipment data based on the selected Delay Agency
  //     const rsp = await getAuthorization();
  //     const selectedValues = selectedResource.map(option => option.value); // Assuming selectedResource is defined
  //     subequipmentdisplay(selectedProcessLine.value, rsp.accessToken, selectedValues);
  //   } else {
  //     setSubequip([]); // Clear Sub Equipment if no Delay Agency is selected
  //   }
  // };

  const handleDelayAgencyChange = (selectedOption) => {
    setSelectedDelayAgency(selectedOption);
  
    if (selectedOption) {
      // Fetch Sub Equipment data based on the selected Delay Agency
      getAuthorization().then((rsp) => {
        const selectedValues = selectedResource.map(option => option.value); // Assuming selectedResource is defined
  
        // Use Promise.all to handle multiple asynchronous operations if needed
        Promise.all([
          subequipmentdisplay(selectedProcessLine.value, rsp.accessToken, selectedValues)
        ]).catch((error) => {
          console.error("Error fetching sub equipment data:", error);
        });
      });
    } else {
      setSubequip([]); // Clear Sub Equipment if no Delay Agency is selected
    }
  };
  

  

  useEffect(() => {
    async function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }

      if (initialLoad == false) {
        const response = await getAuthorization();
        if (response) {
          validateUser();
          setInitialLoad(true);
          plantList();

        }
      }
    }
    fetchData();
  }, []);


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
//   const handleClearAll = () => {
// // debugger
//    setSelectedPlant([]);
//    setSelectedProcessLine([]);
     
//     setResource([]);
//     setSelectedResource("");
//     setsubequip([]); 
//     setselectedsubequip(""); 
    
//     setDateValue(null);
//     setDateValueTo(null);

//     setSelectShift([]);
//     setselectpreviousmonth([]);
//     setDelayData([]);
//     setEquip([]);
//     setFac([]);
//     setDelayInHrs("");
//     setTotalCount([]);
//     setTotalHrs("");
//     setWorkingHrs("");
//     setMttr([]);
//     setLinUtil("");
//     setMtbf([]);
//   }


const handleClearAll = () => {
  setSelectedPlant(null);
  setSelectedProcessLine([]);
  setSelectedResource([]);
  setSelectedDelayAgency(null);
  setsubequip([]);
  setselectedsubequip(null);
  setDateValue(null);
  setDateValueTo(null);
  setSelectShift(null);
  setselectpreviousmonth(null);
  setDelayData([]);
  setEquip([]);
  setFac([]);
  setDelayInHrs("");
  setTotalCount([]);
  setTotalHrs("");
  setWorkingHrs("");
  setMttr([]);
  setLinUtil("");
  setMtbf([]);
  setTotalDelays(0);
};


  // const handleClearAllScrap = (newToken = false) => {
  //   setAllValues({});
  //   setSelectedPlant([]);
  //   setSelectedProcess([]);
  //   setSelectedStatus([]);
  //   setSelectedAction([]);
  //   setProcFrmDt(null);
  //   setProcToDt(null);
  //   setDecFrmDt(null);
  //   setDecToDt(null);
  //   setScrapData([,]);
  //   setScrapDataTable(null);
  //   setSelectedTonnage([]);
  // };


  // useEffect(() => {
  //   const calWorkingHrs = (totalHrs - DelayInHrs)<=0?0:(totalHrs - DelayInHrs);
  //             //console.log(DelayInHrs,totalHrs,calWorkingHrs);
  //             setWorkingHrs(calWorkingHrs?.toFixed(2)); 
             
  //   }, [totalHrs,DelayInHrs]);

  //   useEffect(() => { 
  //               setMilUtil(((workingHrs / totalHrs) * 100)?.toFixed(2));
  //     }, [workingHrs,totalHrs]);

  const insertAt = (array, index, data) => {
    array.splice(index, 0, data);
  };
  // user validation
  const validateUser = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    setLoading(true);
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          localStorage.getItem("tmm_refreshToken"),
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
      var pageName = "LDLTS08D";
      var authDetails = await getScreenAuth(plant, userId, pageName);
      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          alertify.success("You are authorized to make changes from this page");
        } else {
          alertify.error(
            "You are not authorized to make changes from this page"
          );
        }
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
    } finally {
      setLoading(false);
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  //Screen Authentication
  const getScreenAuth = (plantCd, userId, pageName) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
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
        console.log('----->', data);
  
        const response = await axiosAPI.post(url, data, defaultOptions);
  
        // Check if response.data has the expected format
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


    const getNotification = async (userId) => {
      try {
        const token = await GetAuthorization();
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
  
        // setLoading(true);
        const url = "api/LDLTS08D/notification";
        const data = {
          USERIDPNO: serverDetails.PersonalNo,
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
          setnotification(response.data.rows[0]); 
        } else {
          console.error("Unexpected response format:", response.data);
          setnotification(0); 
        }
      } catch (error) {
        console.error("Error while fetching data:", error);
        setnotification(0); // Keep disabled on error
      } finally {
        setLoading(false);
      }
    };

    
    // const getRunnHrs = async (userId) => {
      const getRunnHrs = async (selectedResource) => {    
      try {
        const token = await GetAuthorization();
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
  
        // setLoading(true);
        const url = "api/LDLTS08D/getRunnHrs";
        const data = {
          // USERIDPNO: serverDetails.PersonalNo,
          Plant: selectedPlant?.value,
          Process: selectedProcessLine?.value,
          LINEEQ: selectedResource.length > 0 ? selectedResource.map(option => option.value).join(',') : null,
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
          setRunnHrs(response.data.rows[0]); 
        } else {
          console.error("Unexpected response format:", response.data);
          setRunnHrs(0); 
        }
      } catch (error) {
        console.error("Error while fetching data:", error);
        setRunnHrs(0); 
      } finally {
        setLoading(false);
      }
    };


  //Get Data Api Call
  const getData = async (newToken = false) => {
    // debugger
    var fromDate = document.getElementById("fromDate").value;
    var toDate = document.getElementById("toDate").value;
    var newFromDate = new Date(fromDate);
    var newToDate = new Date(toDate);
    // console.log('selectedProcessLine',selectedProcessLine);
    if (newFromDate > newToDate) {
      alertify.error("From Date Should Not Be Greater Than To Date");
    }
    else if (selectedPlant === "" || selectedPlant === null) {
      alertify.error("Plant Should Not Be Blank");
    }
    
    else if (selectedProcessLine === "" || selectedProcessLine === null || selectedProcessLine.length === 0) {
      alertify.error("Process Line Should Not Be Blank");
    }
    // else if (selectedResource === "" || selectedResource === null) {
    //   alertify.error("Line/Equipment Code Should Not Be Blank");
    // }
    else {
      if (newToken) {
        const rsp = await getAuthorization();
      }
      var userId = serverDetails.PersonalNo;
      const notificationValue = await getNotification(userId);
      if (notificationValue) {
        console.log("Notification Value:", notificationValue);
        // Handle the notification value as needed
      }

      const RunnHrs = await getRunnHrs(selectedProcessLine);
      if (RunnHrs) {
        console.log("RunnHrs:", RunnHrs);
        // Handle the notification value as needed
      }

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      }
      setLoading(true);
      var url = "api/LDLTS08D/getData";
      var dateFrom = dateValue?.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace(/ /g, '-');

      var dateTo = dateValueTo?.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace(/ /g, '-');

      var data = {
        ...filter,
        shift: selectShift?.value,
        plantCode: selectedPlant?.value,
        fromDate: fromDate,
        toDate: toDate,
        processLine: selectedProcessLine?.value,
        subequipCode: selectedsubequip?.value,
        previousMonth: selectpreviousmonth?.value,
        nullrem: nullrem ? '1' : '0',
        DA: selectedDelayAgency?.value,
        // resouceCode: selectedResource?.value,//
        // resouceCode: selectedResource.map(option => option.value).join(','), // Join selected 
        resouceCode: selectedResource.length > 0 ? selectedResource.map(option => option.value).join('\',\'') : null,
      };
      console.log('data.resouceCode',data.resouceCode);
      console.log('dataLDLTS08D',data)

      console.log('subequipCodevalue',selectedsubequip?.value);

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error(
              "No Delay Data Has Been Received Between " + fromDate + " To " + toDate
            );
          }
          else {

            if (response.data?.length === 0) {
              alertify.error(
                "No Delay Data Has Been Received Between " +
                fromDate +
                " To " +
                toDate
              );
              setDelayData([]);
              setTotalDelays(0); // Set total delays to 0 if no data
              setEquip([]);
              setFac([]);
              setDelayInHrs("");
              setTotalCount([]);
              setTotalHrs("");
              setWorkingHrs("");
              setMttr([]);
              setLinUtil("");
              setMtbf([]);
            } else {
              var rows = [];
              let tot_duration = 0;
              for (var i in response.data) {
                var rowdata = response.data[i];
                let varParam = ''
                Object.keys(delayAgent)?.map((x) => {
                  if (x === rowdata.FAO_DELAY_AGENT) {
                    varParam = delayAgent[x].replace(x + '-', '');
                    return varParam?.length > 0 ? varParam : ''
                  }
                })
                rows.push({
                  DESCP: rowdata.DESCP,
                  //DURATION: rowdata.DURATION,
                  DURATION: (parseFloat((new Date(rowdata.FAO_TM_STOP_EN) - new Date(rowdata.FAO_TM_STOP_ST)))) / 60000,
                  FAO_CD_EQP_MAST: rowdata.FAO_CD_EQP_MAST,
                  FAO_CD_FAC_MAST: rowdata.FAO_CD_FAC_MAST,
                  FAO_CD_OUTAGE: rowdata.FAO_CD_OUTAGE,
                  FAO_CD_SH_OUTAGE: rowdata.FAO_CD_SH_OUTAGE,
                  FAO_CD_TRBL_TYP: rowdata.FAO_CD_TRBL_TYP,
                  FAO_DT_PIECE_UPD: rowdata.FAO_DT_PIECE_UPD,
                  FAO_ID_COIL: rowdata.FAO_ID_COIL,
                  FAO_CREATED_BY: rowdata.FAO_CREATED_BY,
                  FAO_REMARKS: rowdata.FAO_REMARKS,
                  FAO_TM_STOP_EN: rowdata.FAO_TM_STOP_EN,
                  FAO_TM_STOP_ST: rowdata.FAO_TM_STOP_ST,
                  FAO_TS_REC_CREATE: rowdata.FAO_TS_REC_CREATE,
                  FAO_DT_OUTAGE: rowdata.FAO_DT_OUTAGE,
                  MODIFY_DATE: rowdata.FAO_TS_UPDATE_DB,
                  FAO_UPDATED_BY: rowdata.FAO_UPDATED_BY,
                  DELAY_AGENT: rowdata.FAO_DELAY_AGENT,
                  DELAY_AGENT_DESC: varParam,
                  FAO_DELAY_CODE: rowdata.FAO_DELAY_CODE,
                  NEWDATE: rowdata.NEWDATE,
                  FAO_CD_PROCESS: (rowdata.PROCEDESC) ? (rowdata.FAO_CD_PROCESS + " " + "-" + " " + rowdata.PROCEDESC) : rowdata.FAO_CD_PROCESS,
                  FAO_RESOURCE: (rowdata.RESDESC) ? (rowdata.FAO_RESOURCE + " " + "-" + " " + rowdata.RESDESC) : rowdata.FAO_RESOURCE,
                  FAO_SUBEQUIP: (rowdata.RESDESC) ? (rowdata.FAO_SUBEQUIP + " " + "-" + " " + rowdata.RESDESC) : rowdata.FAO_SUBEQUIP,
                  FAO_PLANT_CD: (rowdata.PLANTDESC) ? (rowdata.FAO_PLANT_CD + " " + "-" + " " + rowdata.PLANTDESC) : rowdata.FAO_PLANT_CD
                });
                tot_duration += parseFloat((new Date(rowdata.FAO_TM_STOP_EN) - new Date(rowdata.FAO_TM_STOP_ST)));
              }
              setDelayData(rows);
              setTotalDelays(rows.length); // Update the total number of delays
              // var eqpdata = [];
              // response.data.eqpData.map((row) => {
              //   var obj = new Object();
              //   var rowArr = row.split(":");
              //   obj.label = rowArr[0] + "-" + rowArr[1];
              //   obj.value = rowArr[0];
              //   eqpdata.push(obj);
              // });
              // setEquip(eqpdata);
              // setFac(response.data.facData);
              // setDelayInHrs(Number(response.data.totalDelay).toFixed(2));
              const delayHrs = tot_duration / 3600000;
              setDelayInHrs(delayHrs?.toFixed(2));
              setTotalCount(response.data?.length);

              // const currentDate = new Date();
              // const currentDay = (currentDate.getDate() - 1) * 24;
              // const currentHour = currentDate.getHours();
              // const totalHrs = currentHour + currentDay;
              var total;
              var date1 = new Date(fromDate); 
              var date2 = new Date(toDate);
              if(fromDate==="" && toDate==="")
              total=0;
              else 
              {
                
                if(selectShift?.value)
              {
                total=(((date2.getTime() - date1.getTime()) + (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))/3;
              }
               else total=(((date2.getTime() - date1.getTime()) + (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              }
              //totalHrs Total avaialble time
              setTotalHrs(total);
              
              var calWorkingHrs = (total - delayHrs)<=0?0:(total - delayHrs);
              calWorkingHrs=calWorkingHrs?.toFixed(2);
              setWorkingHrs(calWorkingHrs);
              var MilUt=((calWorkingHrs / total) * 100)?.toFixed(2);
              // var MilUt = Math.max(0, totalHrs - RunnHrs)?.toFixed(2);
              setLinUtil(MilUt);
              setMtbf((calWorkingHrs / response.data?.length)?.toFixed(2));
              setMttr((delayHrs / response.data?.length)?.toFixed(2));
            }
          }
                  })
        .finally((f) => {
                    setLoading(false);
        });
    }
  };

  const getDatanotification = async (newToken = false) => {
    // debugger
    var fromDate = document.getElementById("fromDate").value;
    var toDate = document.getElementById("toDate").value;
    var newFromDate = new Date(fromDate);
    var newToDate = new Date(toDate);
    // console.log('selectedProcessLine',selectedProcessLine);
    if (newFromDate > newToDate) {
      alertify.error("From Date Should Not Be Greater Than To Date");
    }
    else if (selectedPlant === "" || selectedPlant === null) {
      alertify.error("Plant Should Not Be Blank");
    }
    
    else if (selectedProcessLine === "" || selectedProcessLine === null || selectedProcessLine.length === 0) {
      alertify.error("Process Line Should Not Be Blank");
    }
    // else if (selectedResource === "" || selectedResource === null) {
    //   alertify.error("Line/Equipment Code Should Not Be Blank");
    // }
    else {
      if (newToken) {
        const rsp = await getAuthorization();
      }
      var userId = serverDetails.PersonalNo;
      const notificationValue = await getNotification(userId);
      if (notificationValue) {
        console.log("Notification Value:", notificationValue);
        // Handle the notification value as needed
      }

      const RunnHrs = await getRunnHrs(selectedProcessLine);
      if (RunnHrs) {
        console.log("RunnHrs:", RunnHrs);
        // Handle the notification value as needed
      }

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      }
      setLoading(true);
      var url = "api/LDLTS08D/getDatanotification";
      var dateFrom = dateValue?.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace(/ /g, '-');

      var dateTo = dateValueTo?.toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }).replace(/ /g, '-');

      var data = {
        ...filter,
        shift: selectShift?.value,
        plantCode: selectedPlant?.value,
        fromDate: fromDate,
        toDate: toDate,
        processLine: selectedProcessLine?.value,
        subequipCode: selectedsubequip?.value,
        previousMonth: selectpreviousmonth?.value,
        nullrem:  '1',
        DA: selectedDelayAgency?.value,
        // resouceCode: selectedResource?.value,//
        // resouceCode: selectedResource.map(option => option.value).join(','), // Join selected 
        resouceCode: selectedResource.length > 0 ? selectedResource.map(option => option.value).join('\',\'') : null,
      };
      console.log('data.resouceCode',data.resouceCode);
      console.log('dataLDLTS08D',data)

      console.log('subequipCodevalue',selectedsubequip?.value);

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error(
              "No Delay Data Has Been Received Between " + fromDate + " To " + toDate
            );
          }
          else {

            if (response.data?.length === 0) {
              alertify.error(
                "No Delay Data Has Been Received Between " +
                fromDate +
                " To " +
                toDate
              );
              setDelayData([]);
              setTotalDelays(0); // Set total delays to 0 if no data
              setEquip([]);
              setFac([]);
              setDelayInHrs("");
              setTotalCount([]);
              setTotalHrs("");
              setWorkingHrs("");
              setMttr([]);
              setLinUtil("");
              setMtbf([]);
            } else {
              var rows = [];
              let tot_duration = 0;
              for (var i in response.data) {
                var rowdata = response.data[i];
                let varParam = ''
                Object.keys(delayAgent)?.map((x) => {
                  if (x === rowdata.FAO_DELAY_AGENT) {
                    varParam = delayAgent[x].replace(x + '-', '');
                    return varParam?.length > 0 ? varParam : ''
                  }
                })
                rows.push({
                  DESCP: rowdata.DESCP,
                  //DURATION: rowdata.DURATION,
                  DURATION: (parseFloat((new Date(rowdata.FAO_TM_STOP_EN) - new Date(rowdata.FAO_TM_STOP_ST)))) / 60000,
                  FAO_CD_EQP_MAST: rowdata.FAO_CD_EQP_MAST,
                  FAO_CD_FAC_MAST: rowdata.FAO_CD_FAC_MAST,
                  FAO_CD_OUTAGE: rowdata.FAO_CD_OUTAGE,
                  FAO_CD_SH_OUTAGE: rowdata.FAO_CD_SH_OUTAGE,
                  FAO_CD_TRBL_TYP: rowdata.FAO_CD_TRBL_TYP,
                  FAO_DT_PIECE_UPD: rowdata.FAO_DT_PIECE_UPD,
                  FAO_ID_COIL: rowdata.FAO_ID_COIL,
                  FAO_CREATED_BY: rowdata.FAO_CREATED_BY,
                  FAO_REMARKS: rowdata.FAO_REMARKS,
                  FAO_TM_STOP_EN: rowdata.FAO_TM_STOP_EN,
                  FAO_TM_STOP_ST: rowdata.FAO_TM_STOP_ST,
                  FAO_TS_REC_CREATE: rowdata.FAO_TS_REC_CREATE,
                  FAO_DT_OUTAGE: rowdata.FAO_DT_OUTAGE,
                  MODIFY_DATE: rowdata.FAO_TS_UPDATE_DB,
                  FAO_UPDATED_BY: rowdata.FAO_UPDATED_BY,
                  DELAY_AGENT: rowdata.FAO_DELAY_AGENT,
                  DELAY_AGENT_DESC: varParam,
                  FAO_DELAY_CODE: rowdata.FAO_DELAY_CODE,
                  NEWDATE: rowdata.NEWDATE,
                  FAO_CD_PROCESS: (rowdata.PROCEDESC) ? (rowdata.FAO_CD_PROCESS + " " + "-" + " " + rowdata.PROCEDESC) : rowdata.FAO_CD_PROCESS,
                  FAO_RESOURCE: (rowdata.RESDESC) ? (rowdata.FAO_RESOURCE + " " + "-" + " " + rowdata.RESDESC) : rowdata.FAO_RESOURCE,
                  FAO_SUBEQUIP: (rowdata.RESDESC) ? (rowdata.FAO_SUBEQUIP + " " + "-" + " " + rowdata.RESDESC) : rowdata.FAO_SUBEQUIP,
                  FAO_PLANT_CD: (rowdata.PLANTDESC) ? (rowdata.FAO_PLANT_CD + " " + "-" + " " + rowdata.PLANTDESC) : rowdata.FAO_PLANT_CD
                });
                tot_duration += parseFloat((new Date(rowdata.FAO_TM_STOP_EN) - new Date(rowdata.FAO_TM_STOP_ST)));
              }
              setDelayData(rows);
              setTotalDelays(rows.length); // Update the total number of delays
              // var eqpdata = [];
              // response.data.eqpData.map((row) => {
              //   var obj = new Object();
              //   var rowArr = row.split(":");
              //   obj.label = rowArr[0] + "-" + rowArr[1];
              //   obj.value = rowArr[0];
              //   eqpdata.push(obj);
              // });
              // setEquip(eqpdata);
              // setFac(response.data.facData);
              // setDelayInHrs(Number(response.data.totalDelay).toFixed(2));
              const delayHrs = tot_duration / 3600000;
              setDelayInHrs(delayHrs?.toFixed(2));
              setTotalCount(response.data?.length);

              // const currentDate = new Date();
              // const currentDay = (currentDate.getDate() - 1) * 24;
              // const currentHour = currentDate.getHours();
              // const totalHrs = currentHour + currentDay;
              var total;
              var date1 = new Date(fromDate); 
              var date2 = new Date(toDate);
              if(fromDate==="" && toDate==="")
              total=0;
              else 
              {
                
                if(selectShift?.value)
              {
                total=(((date2.getTime() - date1.getTime()) + (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))/3;
              }
               else total=(((date2.getTime() - date1.getTime()) + (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
              }
              //totalHrs Total avaialble time
              setTotalHrs(total);
              
              var calWorkingHrs = (total - delayHrs)<=0?0:(total - delayHrs);
              calWorkingHrs=calWorkingHrs?.toFixed(2);
              setWorkingHrs(calWorkingHrs);
              var MilUt=((calWorkingHrs / total) * 100)?.toFixed(2);
              // var MilUt = Math.max(0, totalHrs - RunnHrs)?.toFixed(2);
              setLinUtil(MilUt);
              setMtbf((calWorkingHrs / response.data?.length)?.toFixed(2));
              setMttr((delayHrs / response.data?.length)?.toFixed(2));
            }
          }
                  })
        .finally((f) => {
                    setLoading(false);
        });
    }
  };

  // reason data
  const reasonData = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
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
  // Equip code data
  const equipData = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/LDLTS08D/equipData";
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

          setEquip(items);
        }
      })
      .finally((f) => {
        setLoading(false);
        return true;
        //  props.refreshTable(); //2nd api
      });
  };

  //process line
  const processLineData = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    //vendor List api call
    var url = "api/LDLTS08D/processLine";
    var data = {
      plantCode: value,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText)''
        } else {
          var items = [];
          var items = [{ label: "ALL PROCESS", value: "ALL" }]; // Add the ALL option
          response.data.map((row) => {
            var obj = new Object();
            obj.value = row[0];
            obj.label = row[1];
           
            items.push(obj);
            console.log(obj.value);
            console.log(obj.label);
          });
          setProcessLine(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  //Resource List
  const resourceData = async (value, newToken = false) => {
    // debugger;
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    console.log(value);
    setLoading(true);
    //vendor List api call //
    var url = "api/LDLTS08D/resourceData";
    console.log(value);
    var data = {
      plantCode: selectedPlant.value,
      compCode: serverDetails.Company,
      shiftCode: selectShift?.value,
      // stageCd: value?.split(" - ")[0],
      stageCd: value,
    };
    // console.log(response.data); // Log the response data
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
            obj.label = rowArr[0]?.replace("undefined:", '') + "-" + rowArr[1].replace("undefined:", '');
            // obj.label = rowArr[1].replace("undefined:", '');
            obj.value = rowArr[0]?.trim();
            items.push(obj);
          });
          setResource(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };



  const resourceDataall = async (value, newToken = false) => {
    // debugger;
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    console.log(value);
    setLoading(true);
    //vendor List api call //
    var url = "api/LDLTS08D/resourceDataall";
    console.log(value);
    var data = {
      plantCode: selectedPlant.value,
      compCode: serverDetails.Company,
      shiftCode: selectShift?.value,
      // stageCd: value?.split(" - ")[0],
      stageCd: value,
    };
    // console.log(response.data); // Log the response data
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
            obj.label = rowArr[0]?.replace("undefined:", '') + "-" + rowArr[1].replace("undefined:", '');
            // obj.label = rowArr[1].replace("undefined:", '');
            obj.value = rowArr[0]?.trim();
            items.push(obj);
          });
          setResource(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  

  // const subequipmentdisplay = async (processValue, newToken = false) => {
  //   // debugger;
  //   if (newToken) {
  //     const rsp = await getAuthorization();
  //   }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
  //     },
  //   };

  //   setLoading(true);
  //   //vendor List api call
  //   var url = "api/LDLTS08D/subequipmentdisplay";
  //   console.log(selectedPlant.value);
  //   console.log(selectedResource.value);
  //   var data = {
  //     plantCode: selectedPlant.value,
  //     compCode: serverDetails.Company,
  //     processValue: processValue,
  //      resouceCode: selectedResource.length > 0 ? selectedResource.map(option => option.value).join('\',\'') : null,
  //     // eqicd: selectedResource.value,
  //   };
  //   console.log('data',data);
  //   axiosAPI
  //     .post(url, data, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         var items = [];
  //         response.data.map((row) => {
  //           var obj = new Object();
  //           var rowArr = row.split(",");
  //           obj.label = rowArr[0]?.replace("undefined:", '') + "-" + rowArr[1].replace("undefined:", '');
  //           // obj.label = rowArr[1].replace("undefined:", '');
  //           obj.value = rowArr[0]?.trim();
  //           items.push(obj);
  //         });
  //         setsubequip(items);
  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };



  const subequipmentdisplay = async (processValue, accessToken, resouceCode) => {
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
  
    const data = {
      plantCode: selectedPlant?.value || "0780",
      compCode: serverDetails?.Company,
      processValue: processValue,
      eqicd: selectedResource?.value,
      resouceCode: resouceCode,
    };
    
  
    try {
      const response = await axiosAPI.post("api/LDLTS08D/subequipmentdisplay", data, defaultOptions);
      if (response.status === 200) {
        const items = response.data.map(row => {
          const [value, label] = row.split(",");
          return { label: `${value} - ${label}`, value: value.trim() };
        });
        setsubequip(items);
      }
    } catch (error) {
      console.error("Error fetching subequipment data:", error);
    } finally {
      setLoading(false);
    }
  };

  
  //plant List
  const plantList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    //vendor List api call
    var url = "api/LDLTS08D/plantList";
    var data = {
      adid: serverDetails.PersonalNo
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
          setSelectedPlant(items[0]);
          processLineData(items[0].value)
          delayAgentData(items[0].value, false);
          reasonData(items[0].value, false);
          equipData(items[0].value, false);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  //delay
  const delayAgentData = async (value, newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    setLoading(true);
    var url = "api/LDLTS08D/delayAgentData";
    var data = {
      plantCode: value,
      compCode: serverDetails.Company,
      locationPlant: serverDetails.Plant
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
          setDelayAgentAdd(items);
          var itemsNew = {};
          var resonDesci;
          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[1] + "-" + rowArr[0];
            resonDesci = rowArr[0];
            obj.value = rowArr[1];
            itemsNew[obj.value] = obj.label;
          });
          setDelayAgent(itemsNew);
        }
      })
      .finally((f) => {
        setLoading(false);
        return true;
        //  props.refreshTable(); //2nd api
      });
  };
  const delayCodedisplay = (agency) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      setLoading(true);

      var url = "/api/LDLTS08D/delayCodedisplay";
      var data = {
        plantCode: selectedPlant.value,
        compCode: serverDetails.Company,
        agency: agency,
        p_line: selectedProcessLine ? selectedProcessLine?.value : ""
      };
      console.log(selectedPlant.value,data);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else if (response.data.length > 0) {
            resolve(response.data);
          } else {
            resolve(null);
          }
        })
        .catch((e) => {
          alertify.error(
            "Error in retriving data, please try again! " + e.message
          );
          resolve(null);
        })
        .finally((f) => {
          setLoading(false);
        });
    });



    const delayCodeft = (agency) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      setLoading(true);

      var url = "/api/LDLTS08D/delayCodeft";
      var data = {
        plantCode: selectedPlant.value,
        compCode: serverDetails.Company,
        agency: agency,
        p_line: selectedProcessLine ? selectedProcessLine?.value : ""
      };
      console.log(selectedPlant.value,data);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else if (response.data.length > 0) {
            resolve(response.data);
          } else {
            resolve(null);
          }
        })
        .catch((e) => {
          alertify.error(
            "Error in retriving data, please try again! " + e.message
          );
          resolve(null);
        })
        .finally((f) => {
          setLoading(false);
        });
    });



  const showBreakWindow = async (cell) => {
    if (cell._cell.row.data.NEWDATE > 3) {
      alertify.error("Delay should be book within 3 day");
    }
    else {
      setModalData(cell._cell.row.data);
      setShowModal(true);
    }
  };

  

  //Update Data Api Call
  const updateData = async (cell, isDelete) => {
    if (cell._cell.row.data.NEWDATE > 3) {
      alertify.error("Delay should be book within 3 day");
    }
    else {
      setLoading(true);
      var url = "api/LDLTS08D/updateData";
      const cellData = cell._cell.row.data;
      var startDate = new Date(cellData.FAO_TM_STOP_ST);
      var fromDate = ('0' + startDate.getDate()).slice(-2) + '-' + startDate.toString().substr(4, 3) + '-' + startDate.getFullYear() + ' ' + startDate.getHours() + ':' + startDate.getMinutes();

      var endDate = new Date(cellData.FAO_TM_STOP_EN);
      var toDate = ('0' + endDate.getDate()).slice(-2) + '-' + endDate.toString().substr(4, 3) + '-' + endDate.getFullYear() + ' ' + endDate.getHours() + ':' + endDate.getMinutes();

      var value3 = cellData.FAO_DT_OUTAGE;
      var date3 = new Date(value3);
      var year3 = date3.getFullYear();
      var month3 = date3.getMonth();
      var dt3 = date3.getDate();
      if (dt3 < 10) {
        dt3 = "0" + dt3;
      }
      var newOutDate = dt3 + "-" + months[month3] + "-" + year3 + " " + date3.toLocaleTimeString("en-GB");
      GetAuthorization()
        .then((token) => {
          var defaultOptions = {
            headers: {
              Authorization: "Bearer " + token.accessToken,
            },
          };
          axiosAPI
            .post(
              url,
              {
                // remarks: cellData.FAO_REMARKS,
                remarks: cellData.FAO_REMARKS || ' ',
                reason: cellData.FAO_CD_OUTAGE,
                stDate: fromDate,
                enDate: toDate,
                outageDt: newOutDate,
                p_line: selectedProcessLine ? selectedProcessLine.value : "",
                eqpMast: " ",
                faqMast: cellData.FAO_CD_FAC_MAST,
                plantCode: cellData.FAO_PLANT_CD,
                compCode: serverDetails.Company,
                modify_user: serverDetails.PersonalNo,
                delayCode: cellData.FAO_DELAY_CODE,
                delayAgent: cellData.DELAY_AGENT,
                processCd: cellData.FAO_CD_PROCESS,
                resource: cellData.FAO_RESOURCE,
                subequip: cellData.FAO_SUBEQUIP,
                isDelete: isDelete
              },
              defaultOptions
            )
            .then((response) => {
                            if (Number(response.data) > 0) {
                alertify.success(`Data ${isDelete ? 'deleted' : 'updated'} successfully`);
                getData();
              } else {
                alertify.error(response?.error?.response?.data ? response.error.response.data?.toString() : 'Data not updated');
              }
            })
            .catch(e => {
              alertify.error(e.data?.toString());
            })
            .finally((f) => {
              setLoading(false);
            });
        })
    }
  };

  //set table data
  useEffect(() => {
    setDelayManagementTable(
      new Tabulator("#delayManagement", {
        data: delayData, //link data to table
        columns: dataCol,
        height: 400,
        layout: "fitDataFill",
        pagination: "local",
        paginationSize: 12,
      })
    );
  }, [delayData, reason, delayAgent, agentCode]);

  //excel download function
  const downloadDelayMngmtData = () => {
    if (delayManagementTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = delayManagementTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Delay Recording Data.xlsx";
    delayManagementTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  //date formatter
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
      var newVal = dt + "-" + months[month] + "-" + year;
      return newVal;
    }
    return value;
  };

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

  //decimal formatter
  var decimalFormat = function (value, data, type, params, column) {
    if (value) {
      var decVal = value.toFixed(3);
      return decVal;
    }
    return value;
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
  // const handlePlantChange = async (value) => {
  //   // handleProcessChange({
  //   //   label: '',
  //   //   value: ''
  //   // })
  //   // handlesubequipChange({
  //   //   label: '',
  //   //   value: ''
  //   // })
  //   setSelectShift([]);
  //   setselectpreviousmonth([]);
    
  //   //setSelectedProcessLine("");
  //   setSelectedResource("");
    
    
  //   setSelectedPlant(value);
  //   console.log(value.value);
  //   if (value) {
  //     const rsp = await getAuthorization();
  //     setProcessLine([]);
  //     processLineData(value.value);
  //     // resourceData(value.value);
  //     delayAgentData(value.value);
  //     reasonData(value.value);
  //     equipData(value.value);
  //     descEditID(value.value);
  //     subequipmentdisplay(value.value);
  //   }
  // };

  const handlePlantChange = (value) => {
    setSelectShift([]);
    setselectpreviousmonth([]);
    setSelectedResource([]);

    setSelectedProcessLine([]);
    setSelectedResource(null);
    setSelectedDelayAgency(null);
    setsubequip([]);
    setselectedsubequip(null);

    setSelectedPlant(value);

  
    if (value) {
      setProcessLine([]);
      setLoading(true);

      GetAuthorization().then((rsp) => {
        Promise.all([
          processLineData(value.value),
          delayAgentData(value.value),
          reasonData(value.value),
          equipData(value.value),
          descEditID(value.value),
          subequipmentdisplay(value.value)
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };
  
  

  //CheckBox function
  const handleDelayUnBookChange = (e) => {
    setDelayUnbookChecked(!delayUnbookChecked);
  };

  const handleNullremChange = () => {
    setNullrem(!nullrem); 
  };

  // process dropdown function
  // const handleProcessChange = async (value) => {
  //   setSelectedProcessLine(value);
  //   setResource([]);
  //   setsubequip([]); // Clear sub-equipment when process changes
  //   if (value && value.value !== "ALL") { 
  //     const rsp = await getAuthorization();
  //     resourceData(value.value);
  //     subequipmentdisplay(value.value); // Fetch sub-equipment data based on process
  //   }
  // };
  //plant

  const handleProcessChange = (value) => {
    setSelectedProcessLine(value);
    setResource([]);
    setsubequip([]); 

    if (value && value.value !== "ALL") {
      console.log(value.value);
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          resourceData(value.value,data.accessToken),
          subequipmentdisplay(value.value,data.accessToken),
        // getRmList(data.accessToken,value.value),
        // getPipeNoList(data.accessToken,value.value),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
    else{
      console.log(value.value);
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          resourceDataall(value.value,data.accessToken),
          subequipmentdisplay(value.value,data.accessToken),
        // getRmList(data.accessToken,value.value),
        // getPipeNoList(data.accessToken,value.value),
        ]).finally(() => {
          setLoading(false);
        });
      });

    }
  };



  // const handleResourceChange = async (selectedOptions) => {
  //   setSelectedResource(selectedOptions || []); // Ensure it is always an array
  //   if (selectedOptions.length > 0) {
  //     const rsp = await getAuthorization();
  //     const selectedValues = selectedOptions.map(option => option.value); // Extracting values for the query
  //     subequipmentdisplay(selectedValues);
  //   } else {
  //     setsubequip([]); // Reset if no selection
  //   }
  // };

  const handleResourceChange = (selectedOptions) => {
    setSelectedResource(selectedOptions || []); // Ensure it is always an array
    if (selectedOptions.length > 0) {
      const selectedValues = selectedOptions.map(option => option.value); // Extracting values for the query
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          subequipmentdisplay(selectedProcessLine.value, data.accessToken, selectedValues),
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      setsubequip([]); // Reset if no selection
    }
  };
  

  

  const handlesubequipChange = (value) => {
    console.log(value);
    setselectedsubequip(value);

  };


  //Bind delay code
  const BindDelayCodeDetails = async (item, label) => {
    if (typeof item !== "undefined") {
      var newItem = item.split("-");
      const results = await delayCodedisplay(newItem[0]);

      if (results) {
          var arr = [];
          results.map((row) => {
              var obj = new Object();
              var rowArr = row.split(":");
              obj.label = rowArr[1] + "-" + rowArr[0];
              obj.value = rowArr[1];
              if (label) {
                  arr.push(obj.label);
              } else {
                  arr.push(obj.label);
              }
          });
          return arr;
      } else {
          alertify.error("No delay code data available");
          return [];
      }
  } else {
      alertify.error("No delay code data available");
      return [];
  }
};

const durationFormatter = (cell, formatterParams) => {
  const startTime = new Date(cell._cell.row.data.FAO_TM_STOP_ST);
  const endTime = new Date(cell._cell.row.data.FAO_TM_STOP_EN);
  const durationInMillis = endTime - startTime;

  if (!isNaN(durationInMillis)) {
    const hours = durationInMillis / 3600000; // Convert milliseconds to hours
    return hours.toFixed(2); // Format to two decimal places
  }
  return "0.00"; // Default value if there's an error
};


// const durationFormatter = (cell, formatterParams) => {
//   const startTime = new Date(cell._cell.row.data.FAO_TM_STOP_ST);
//   const endTime = new Date(cell._cell.row.data.FAO_TM_STOP_EN);
//   const durationInMillis = endTime - startTime;

//   if (!isNaN(durationInMillis)) {
//     const hours = Math.floor(durationInMillis / 3600000);
//     const minutes = Math.floor((durationInMillis % 3600000) / 60000);
//     return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Format to HH:MM
//   }
//   return "00:00"; // Default value if there's an error
// };


  // const BindDelayCodeDetails = async (item, label) => {
  //   var newItem = item.split("-");
  //   if (typeof item !== "undefined") {
  //     const results = await delayCodedisplay(newItem[0]);
  //     var arr = [];
  //     results.map((row) => {
  //       var obj = new Object();
  //       var rowArr = row.split(":");
  //       var obj = new Object();
  //       var rowArr = row.split(":");
  //       obj.label = rowArr[1] + "-" + rowArr[0];
  //       obj.value = rowArr[1];
  //       if (label) {
  //         arr.push(obj.label)
  //       } else {
  //         arr.push(obj.value)
  //       }
  //     });
  //     return arr;
  //   } else {
  //     alertify.error("No delay code data available");
  //     return [];
  //   }
  // };
  
  var updateIcon = (cell, formatterParams, onRendered) => {
    return "<i class='fa-solid fa-floppy-disk' style='color:#49a3f1'></i>";
  };

  var deleteIcon = (cell, formatterParams, onRendered) => {
    return "<i class='fa-solid fa-trash' style='color:#49a3f1'></i>";
  };
  var breakIcon = (cell, formatterParams, onRendered) => {
    return "<i class='fa-solid fa-table-columns' style='color:#49a3f1'></i>";
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  const processFormatter = (cell, formatterParams) => {
    const value = cell.getValue();
    let displayValue = value;
  
    // Define a mapping of process codes to descriptions
    const processDescriptions = {
      TCEW: "Tube CEW",
      TERW: "Tube ERW",
      // Add more mappings as needed
    };
  
    // Append the description if available
    if (processDescriptions[value]) {
      displayValue = `${value} - ${processDescriptions[value]}`;
    }
  
    return displayValue;
  };

  //column data
  const dataCol = [
    // {
    //   title: "Save",
    //   formatter: updateIcon,
    //   cellClick: function (e, cell) {
    //     updateData(cell, false);
    //   },
    //   download: false,
    //   frozen: true,
    // },
    {
      title: "Save",
      formatter: updateIcon,
      cellClick: function (e, cell) {
        // Show a confirmation dialog before deleting
        alertify.confirm(
          "Save Confirmation",
          "Are you sure you want to Save this record ?",
          function () {
            // If the user confirms, proceed with the deletion
            updateData(cell, false);
          },
          function () {
            // If the user cancels, do nothing
            alertify.error("Save Action canceled");
          }
        );
      },
      download: false,
      frozen: true,
    },
    // {
    //   title: "Break",
    //   formatter: breakIcon,

    //   cellClick: function (e, cell) {
    //     showBreakWindow(cell);
    //   },
    //   frozen: true,
    // },
    {
      title: "Outage Date",
      field: "FAO_DT_OUTAGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      accessorDownload: dateOnly,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          //var newVal = new Date(value).toISOString().substring(0, 10);
          var date = new Date(value);
          var year = date.getFullYear();
          var month = date.getMonth();
          var dt = date.getDate();
          if (dt < 10) {
            dt = "0" + dt;
          }
          var newVal = dt + "-" + months[month] + "-" + year;
          return newVal;
        }
        return value;
      },
      frozen: true,
    },
    {
      title: "Shift",
      field: "FAO_CD_SH_OUTAGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "FAO_PLANT_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "list",
      // editorParams: {
      //   showListOnEmpty: true,
      //   values: plant,
      //   clearable: true,
      //   autocomplete: "true", listOnEmpty: true, valuesLookup: true
      // },
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   var row = cell.getColumn();
      //   cell.getElement().style["background-color"] = "#85aedf";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
    },
    {
      title: "Process",
      field: "FAO_CD_PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: processFormatter, // Use the custom formatter

      accessorDownload: function (value, data, type, params, column) {
        const processDescriptions = {
          TCEW: "Tube CEW",
          TERW: "Tube ERW",
          // Add more mappings as needed
        };
        let label = processDescriptions[value];
        return `${value} - ${label}`; // e.g., "1 - Active"
      },

    }, 
    {
      title: "Line/Equipment",    //Equipment was added instead of resource
      field: "FAO_RESOURCE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "list",
      editorParams: {
        showListOnEmpty: true,
        values: resource,
        clearable: false,
        autocomplete: "true", allowEmpty: true, listOnEmpty: true
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var label = resource.find(item => item.value === value)?.label || value;
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#85aedf";
        cell.getElement().style["color"] = "#FFFFFF";
        // return value;
        // return `${value} - ${label}`; // Concatenate value and label
        return label; // Concatenate value and label
      },
      accessorDownload: function (value, data, type, params, column) {
        let label = resource.find(item => item.value === value)?.label || value;
        return `${label}`; // e.g., "1 - Active"
      }

    },
    {
      title: "Sub Equipment",  
      field: "FAO_SUBEQUIP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
      editor: "list",
      editorParams: {
        showListOnEmpty: true,
        values: subequip,
        clearable: false,
        autocomplete: "true", allowEmpty: true, listOnEmpty: true
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var label = subequip.find(item => item.value === value)?.label || value;
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#85aedf";
        cell.getElement().style["color"] = "#FFFFFF";
        // return value;
        //  return `${value} - ${label}`; // Concatenate value and label
        return label; // Concatenate value and label
      },
      accessorDownload: function (value, data, type, params, column) {
        let label = subequip.find(item => item.value === value)?.label || value;
        return ` ${label}`; // e.g., "1 - Active"
      }

    },

    {
      title: "Start Date and Time",
      field: "FAO_TM_STOP_ST",
      accessorDownload: dateTimeOnly,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          //var newVal = new Date(value).toISOString().substring(0, 10);
          var date = new Date(value);
          var year = date.getFullYear();
          var month = date.getMonth();
          var dt = date.getDate();
          if (dt < 10) {
            dt = "0" + dt;
          }
          var newVal =
            dt +
            "-" +
            months[month] +
            "-" +
            year +
            " " +
            date.toLocaleTimeString("en-GB");
          return newVal;
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "End Date and Time",
      field: "FAO_TM_STOP_EN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      accessorDownload: dateTimeOnly,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#85aedf";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          var date = new Date(value);
          var year = date.getFullYear();
          var month = date.getMonth();
          var dt = date.getDate();
          if (dt < 10) {
            dt = "0" + dt;
          }
          var newVal =
            dt +
            "-" +
            months[month] +
            "-" +
            year +
            " " +
            date.toLocaleTimeString("en-GB");
          return newVal;
        }
        return value;
      },
      editor: "datetime",
      cellEdited: (cell) => {
        const startTime = new Date(cell._cell.row.data.FAO_TM_STOP_ST);
        const endTime = new Date(cell.getValue());
        const durationInHours = (endTime - startTime) / 3600000;
    
        // Update the duration field
        cell.getRow().update({
          "DURATION": millisToMinutesAndSeconds(endTime - startTime)
        });
    
        // Update the delay category based on the new duration
        let delayCategory = "Cat - 3 (Delay < 1Hr)";
        if (durationInHours > 2) {
          delayCategory = "Cat - 1 (Delay > 2Hrs)";
        } else if (durationInHours > 1) {
          delayCategory = "Cat - 2 (Delay > 1Hr)";
        }
    
        cell.getRow().update({
          "FAO_CD_EQP_MAST": delayCategory
        });
      }
    },
    
    // {
    //   title: "Duration (in Hrs)",
    //   field: "DURATION",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   accessorDownload: decimalFormat,
    //   formatter: function (cell, formatterParams) {
    //     var durationInHours = (new Date(cell._cell.row.data.FAO_TM_STOP_EN) - new Date(cell._cell.row.data.FAO_TM_STOP_ST)) / 3600000;
    //     if (!isNaN(durationInHours)) {
    //       return durationInHours.toFixed(2); // Format to 2 decimal places
    //     }
    //     return "0.00"; // Default value if there's an error
    //   },
    // },

    {
      // title: "Duration (in HH:MM)",
      title: "Duration (in Hrs)",
      field: "DURATION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: durationFormatter,
    },

    // {
    //   title: "Delay Category",
    //   field: "FAO_CD_EQP_MAST",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "RCFA Category",
      field: "FAO_CD_EQP_MAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        const durationInHours = (new Date(cell.getRow().getData().FAO_TM_STOP_EN) - new Date(cell.getRow().getData().FAO_TM_STOP_ST)) / 3600000;
        if (durationInHours > 2) {
          return "Cat - 1 (Delay > 2Hrs)";
        } else if (durationInHours > 1) {
          return "Cat - 2 (Delay > 1Hr)";
        } else {
          return "Cat - 3 (Delay < 1Hr)";
        }
      },
      accessorDownload: function (cell, data, type, params, column) {
        const durationInHours = (new Date(data.FAO_TM_STOP_EN) - new Date(data.FAO_TM_STOP_ST)) / 3600000;
        if (durationInHours > 2) {
          return "Cat - 1 (Delay > 2Hrs)";
        } else if (durationInHours > 1) {
          return "Cat - 2 (Delay > 1Hr)";
        } else {
          return "Cat - 3 (Delay < 1Hr)";
        }
      }
    },
    // {
    //   title: "Delay Agency1",
    //   field: "DELAY_AGENT",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: iseditable ? "list" : false, // Editable only if iseditable is true
    //   editorParams: {
    //     showListOnEmpty: true,
    //     values: delayAgent,
    //     clearable: true,
    //     autocomplete: "true",
    //     allowEmpty: true,
    //     listOnEmpty: true,
    //     valuesLookup: true
    //   },
    //   cellEdited: function (cell) {
    //     Object.keys(delayAgent)?.map((x) => {
    //       if (x === cell.getValue()) {
    //         let varParam = '';
    //         varParam = delayAgent[x].replace(x + '-', '');
    //         cell.getRow()?.update({
    //           DELAY_AGENT_DESC: varParam?.length > 0 ? varParam : cell._cell.row.data.DELAY_AGENT_DESC
    //         });
    //       }
    //     })
    //   },
    //   formatter: function (cell) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#85aedf";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   }
    // },
    {
      title: "Delay Agency",
      field: "DELAY_AGENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "list",
      editorParams: {
        showListOnEmpty: true,
        values: delayAgent,
        clearable: true,
        autocomplete: "true", allowEmpty: true, listOnEmpty: true, valuesLookup: true
        //callback
      },
      cellEdited: function (cell) {
        /*** fetch function for piece act */
        Object.keys(delayAgent)?.map((x) => {
          if (x === cell.getValue()) {
            let varParam = '';
            varParam = delayAgent[x].replace(x + '-', '');
            cell.getRow()?.update({
              DELAY_AGENT_DESC: varParam?.length > 0 ? varParam : cell._cell.row.data.DELAY_AGENT_DESC
            });
          }
        })
      },
      // formatter: "lookup",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        const label = delayAgent[value] || '';
        const displayValue = `${value} - ${label.replace(value + '-', '')}`;
        let varParam = '';
        cell.getElement().style["background-color"] = "#85aedf";
        cell.getElement().style["color"] = "#FFFFFF";
        return displayValue;
      },
      formatterParams: delayAgent,
      accessorDownload: function (value, data, type, params, column) {
        let label = delayAgent[value] || '';
        return `${label}`; // e.g., "1 - Active"
      }
    },
    // {
    //   title: "Delay Agency Desc",
    //   field: "DELAY_AGENT_DESC",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search..."
    // },
    {
      title: "Delay Code",
      field: "FAO_CD_OUTAGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "list",
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#85aedf";
        cell.getElement().style["color"] = "#FFFFFF";
        // return cell.getValue();

        const outageCode = cell.getValue();
        const delayCode = cell.getRow().getData().FAO_DELAY_CODE;
        console.log("outageCode",outageCode);
        console.log("delayCode",delayCode);
        // return `${outageCode} - ${delayCode}`; // Concatenate the codes
        return `${delayCode}`; // Concatenate the codes
      },
      cellEdited: function (cell) {
        /*** fetch function for piece act */
        let list = BindDelayCodeDetails(cell._cell.row.data.DELAY_AGENT, true);
        list.then((lst) => {
          lst?.map((x) => {
           
            if (x?.includes(cell._cell.row.data.FAO_CD_OUTAGE?.trim())) {
              let varParam = ''
              varParam = x?.replace(cell._cell.row.data.FAO_CD_OUTAGE?.trim() + '-', '')
              cell.getRow()?.update({
                FAO_DELAY_CODE: varParam?.length > 0 ? varParam : cell._cell.row.data.FAO_DELAY_CODE
              });
            }
          })
        })
      },
      editorParams: {
        showListOnEmpty: true,
        clearable: false,
        autocomplete: "true", allowEmpty: true, listOnEmpty: true, valuesLookup: true,
        valuesLookup: function (cell) {
          var list = BindDelayCodeDetails(cell._cell.row.data.DELAY_AGENT);
          return list;
        },
      },
      accessorDownload: function (value, data, type, params, column) {
        const delayCode = data.FAO_DELAY_CODE;
        // console.log("delayCode", delayCode);
        return `${delayCode}`;
      }
    },
    // {
    //   title: "Delay Reason",
    //   field: "FAO_DELAY_CODE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Delay Code Updated",
      field: "DelayCodeUpdated",
      visible: false,
      download: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#85aedf";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Description",   //REMARKS
      field: "FAO_REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editorParams: {
        search: true,
        selectContents: true,
        elementAttributes: {
          maxlength: "50", //set the maximum character length of the input element to 10 characters
        },
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#85aedf";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Creation Date and Time",
      field: "FAO_TS_REC_CREATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      accessorDownload: dateTimeOnly,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          //var newVal = new Date(value).toISOString().substring(0, 10);
          var date = new Date(value);
          var year = date.getFullYear();
          var month = date.getMonth();
          var dt = date.getDate();
          if (dt < 10) {
            dt = "0" + dt;
          }
          var newVal =
            dt +
            "-" +
            months[month] +
            "-" +
            year +
            " " +
            date.toLocaleTimeString("en-GB");
          return newVal;
        }
        return value;
      },
    },
   
    {
      title: "Created User",
      field: "FAO_CREATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Modified Date And Time",
      field: "MODIFY_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      accessorDownload: dateTimeOnly,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
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
            date.toLocaleTimeString("en-GB");
          return newVal;
        }
        return value;
      },
    },
    {
      title: "Modified User",
      field: "FAO_UPDATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Delete",
    //   formatter: deleteIcon,
    //   cellClick: function (e, cell) {
    //     updateData(cell, true);
    //   },
    //   download: false,
    //   // frozen: true,
    // },
    {
      title: "Delete",
      formatter: deleteIcon,
      cellClick: function (e, cell) {
        // Show a confirmation dialog before deleting
        alertify.confirm(
          "Delete Confirmation",
          "Are you sure you want to delete this record ?",
          function () {
            // If the user confirms, proceed with the deletion
            updateData(cell, true);
          },
          function () {
            // If the user cancels, do nothing
            alertify.error("Delete action canceled");
          }
        );
      },
      download: false,
      // frozen: true,
    }
  ];

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Delay Management" page="Delay Recording" />
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
            <Grid container spacing={6}>
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
                          Book Delay
                        </MDTypography>
                      </Grid>

                      <Grid item xs={7}>
                      </Grid>

                      <Grid item xs={2}>
                        
                        <AddModal
                          getData={getData}
                          delayAgentAdd={delayAgentAdd}
                          agentCodeAdd={agentCodeAdd}
                        />
                            <MDTypography  variant="h8" color="white" style={{ marginRight: '0.5rem' }}>
                              Book Delay
                            </MDTypography>

                      <Badge badgeContent={notification} color="error">
                          <NotificationsIcon 
                          style={{ color: "white" }} 
                          onClick={() => {
                            getDatanotification(true);
                            // setNullrem(true); // This line will select the checkbox
                          }}
                          
                          
                          />
                      </Badge>

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
                          Search Delay
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Clear All">
                          {/* <IconButton */}
                            {/* color="white" */}
                            {/* // onClick={() => handleClearAll(true)} */}
                            <IconButton color="white" onClick={handleClearAll}>
                          {/* > */}
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                        {/* <MDTypography variant="button" color="White" style={{ marginLeft: '0.5rem' }}>
    Clear all
  </MDTypography> */}

  <MDTypography  variant="h8" color="white" style={{ marginRight: '0.5rem' }}>
                              Clear All
                            </MDTypography>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox px={3} py={1}>
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
                          Plant*
                        </MDTypography>
                        <ReactSelect
                          options={plant}
                          value={selectedPlant}
                          onChange={handlePlantChange}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Process*
                        </MDTypography>
                        <ReactSelect
                          options={processLine}
                          onChange={handleProcessChange}
                        />
                      </Grid>

                      {/* <Grid item xs={1.6}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Line/Equipment 
                        </MDTypography>
                        <ReactSelect
                          options={resource}
                          onChange={handleResourceChange}
                        />
                      </Grid> */}

<Grid item xs={1.4}>
  <MDTypography
    fontWeight="regular"
    fontSize="small"
    textTransform="capitalize"
    variant="h6"
    color={"dark"}
    noWrap
  >
    Line/Equipment
  </MDTypography>
  <ReactSelect
    options={resource}
    isMulti // Allow multi-selection
    onChange={handleResourceChange}
  />
</Grid>

                       <Grid item xs={1.4}>
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
                           options={delayAgentAdd} // Use the options from delayAgentData
                           value={selectedDelayAgency}
                          //  onChange={(selectedOption) => setSelectedDelayAgency(selectedOption)}
                           onChange={handleDelayAgencyChange}
                         />
                       </Grid>

                      <Grid item xs={1.4}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Sub Equipment {/* Equipment Was replaced instead of work centre */}
                        </MDTypography>
                        <ReactSelect
                          options={subequip}
                          onChange={handlesubequipChange}
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
                          From Date
                        </MDTypography>
                        {/* <DatePicker id="fromDate" /> */}
                        <DatePicker id="fromDate" value={dateValue} onChange={(date) => setDateValue(date)} />
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
                          To Date
                        </MDTypography>
                        {/* <DatePicker id="toDate" /> */}
                        <DatePicker id="toDate" value={dateValueTo} onChange={(date) => setDateValueTo(date)} />
                      </Grid>
                      <Grid item xs={0.80}>
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
                          options={Shift}
                          value={selectShift}
                          onChange={(data) =>
                            setSelectShift(data)
                          }
                        />
                      </Grid>
                      <Grid item xs={1.15}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Prior Months
                        </MDTypography>
                        <ReactSelect
                          options={previousmonth}
                          value={selectpreviousmonth}
                          onChange={(data) =>{
                            setselectpreviousmonth(data);
                            setDateValue(null); 
                            setDateValueTo(null); 
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={0.75} style={{ marginTop: "1rem" }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={delayUnbookChecked}
                                onChange={handleDelayUnBookChange}
                                inputProps={{ "aria-label": "controlled" }}
                                name="custUnchange"
                                color="primary"
                              />
                            }
                            label="Unbook Delay"
                          />
                        </FormGroup>
                      </Grid> */}

                      <Grid item xs={0.75} style={{ marginTop: "1rem" }}>
                        <FormGroup>
                          <FormControlLabel
                            control={
                              <Checkbox
                                defaultChecked={nullrem}
                                onChange={handleNullremChange}
                                inputProps={{ "aria-label": "controlled" }}
                                name="nullrem"
                                color="primary"
                              />
                            }
                            label="Delay Without Desc"
                          />
                        </FormGroup>
                      </Grid>

                      <Grid>
                        <MDButton
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                          style={{ marginTop: "1.5rem" }}
                        >
                          Search
                        </MDButton>
                      </Grid>
                    </Grid>
                    <Grid container spacing={26}>
                    <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`No of delays: ${totalDelays}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>

                      <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`God Hrs: ${totalHrs}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`Delay in Hrs: ${DelayInHrs}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
                        <Chip
                          // label={`Running Hrs: ${RunnHrs}`}
                          // label={`Running Hrs: ${workingHrs}`}
                          label={`Running Hrs: ${Math.max(0, totalHrs - DelayInHrs)}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`Available Rate: ${linUtil}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`MTBF: ${mtbf}`}
                          variant="outlined"
                          color="primary"
                          // disabled
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`MTTR: ${typeof mttr === "undefined" ? 0 : mttr
                            }`}
                          variant="outlined"
                          color="primary"
                          // disabled
                        />
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12}>
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
                      <Grid item xs={2.5}>
                        <MDTypography variant="h6" color="white">
                          Searched Delay Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Download" arrow>
                          <IconButton
                            color="white"
                            onClick={() => downloadDelayMngmtData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                        
                        {/* <AddModal
                          getData={getData}
                          delayAgentAdd={delayAgentAdd}
                          agentCodeAdd={agentCodeAdd}
                        />
                          <MDTypography  variant="h8" color="white" style={{ marginRight: '0.5rem' }}>
                             Book Delay
                           </MDTypography> */}
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
                        {/* <ReactTabulator
                            ref={(ref) => {
                              prevMonthRef = ref;
                            }}
                            id="prevMonthTable"
                            columns={rmColumns}
                            data={delayManagementData}
                            options={options}
                          /> */}
                        <div id="delayManagement" />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                         <span>
                            <b>Note:</b> The records where St. time is coloured
                               have been LEFT OUT of MTBF calculations
                          </span>
          
                  </Grid> */}
                      {/* <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                         <span>
                            MTBF (Where from and to date are selected) = ((To
                            Date - From Date) - Sum of duration of records with
                            outage PZFL, XZCO, XZSC, XZSE ) / MTBF count
                          </span>
                    </Grid> */}
                      {/* <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                      >
                         <span>
                            MTBF (Where date and shift are selected) = (8 - Sum
                            of duration of records with outage PZFL, XZCO, XZSC,
                            XZSE ) / MTBF count
                          </span>
                      </Grid> */}
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
          {showModal && (
            <SaveModal
              close={setShowModal}
              refreshTable={getData}
              data={modalData}
              dateOnlyFunc={dateOnly}
              dateTimeFunc={dateTimeOnly}
              p_line={selectedProcessLine ? selectedProcessLine.value : ""}
              filterData={filter}
              open={showModal}
              reason={reason}
              delayAgent={delayAgent}
              equip={equip}
              resouceCode={selectedResource.value}
              subequipCode={selectedsubequip.value}
              plant={selectedPlant.value}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
