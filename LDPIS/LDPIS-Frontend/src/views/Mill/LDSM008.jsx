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

export default function LDSM008() {
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
  const [milUtil, setMilUtil] = useState("");
  const [mtbf, setMtbf] = useState([]);
  const [delayData, setDelayData] = useState([]);
  const [equip, setEquip] = useState([]);
  const [fac, setFac] = useState([]);
  const [deleteData, setDeleteData] = useState([]);
  const [reason, setReason] = useState([]);
  const [reasonDesc, setReasonDesc] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [delayUnbookChecked, setDelayUnbookChecked] = useState(false);
  const [agentCode, setAgentCode] = useState([]);
  const [agentCodeAdd, setAgentCodeAdd] = useState([]);
  const [delayAgent, setDelayAgent] = useState([]);
  const [delayAgentAdd, setDelayAgentAdd] = useState([]);
  const [processLine, setProcessLine] = useState([]);
  const [selectedProcessLine, setSelectedProcessLine] = React.useState("");
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState("");
  const [resource, setResource] = useState([]);
  const [selectedResource, setSelectedResource] = React.useState("");
  const [saveAgentCode, setSaveAgentCode] = useState([]);
  const [visibilty, setVisibility] = useState([]);
  const [dateValue, setDateValue] = useState();
  const [dateValueTo, setDateValueTo] = useState();
  const [selectShift, setSelectShift] = useState('');

  const Shift = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ];
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

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
          // delayAgentData(selectedPlant?.value, false);
          // processLineData();
          // delayCodeData();
          plantList();

        }
      }
    }
    fetchData();
  }, []);

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
  const handleClearAll = () => {
    // setProcessLine([]);
    // setResource([]);
    setDateValue(null);
    setDateValueTo(null);
    setSelectShift([]);
    setDelayData([]);
    setEquip([]);
    setFac([]);
    setDelayInHrs("");
    setTotalCount([]);
    setTotalHrs("");
    setWorkingHrs("");
    setMttr([]);
    setMilUtil("");
    setMtbf([]);
  }

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
      var pageName = "LDSM008";
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

  //Get Data Api Call
  const getData = async (newToken = false) => {
    var fromDate = document.getElementById("fromDate").value;
    var toDate = document.getElementById("toDate").value;
    var newFromDate = new Date(fromDate);
    var newToDate = new Date(toDate);
    if (newFromDate > newToDate) {
      alertify.error("From Date Should Not Be Greater Than To Date");
    }
    else if (selectedPlant === "" || selectedPlant === null) {
      alertify.error("Plant Should Not Be Blank");
    }
    else if (selectedProcessLine === "" || selectedProcessLine === null) {
      alertify.error("Process Line Code Should Not Be Blank");
    }
    else {
      if (newToken) {
        const rsp = await getAuthorization();
      }

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      }
      setLoading(true);
      var url = "api/LDSM008/getData";
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
        resouceCode: selectedResource?.value,
      };
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
              setEquip([]);
              setFac([]);
              setDelayInHrs("");
              setTotalCount([]);
              setTotalHrs("");
              setWorkingHrs("");
              setMttr([]);
              setMilUtil("");
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
                  FAO_PLANT_CD: (rowdata.PLANTDESC) ? (rowdata.FAO_PLANT_CD + " " + "-" + " " + rowdata.PLANTDESC) : rowdata.FAO_PLANT_CD
                });
                tot_duration += parseFloat((new Date(rowdata.FAO_TM_STOP_EN) - new Date(rowdata.FAO_TM_STOP_ST)));
              }
              setDelayData(rows);
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
              setMilUtil(MilUt);
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
    var url = "api/LDSM008/equipData";
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
    var url = "api/LDSM008/processLine";
    var data = {
      plantCode: value,
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

    setLoading(true);
    //vendor List api call
    var url = "api/LDSM008/resourceData";
    var data = {
      plantCode: selectedPlant.value,
      compCode: serverDetails.Company,
      shiftCode: selectShift?.value,
      stageCd: value?.split(" - ")[0]
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
            obj.label = rowArr[0]?.replace("undefined:", '') + "-" + rowArr[1].replace("undefined:", '');
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
    var url = "api/LDSM008/plantList";
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
    var url = "api/LDSM008/delayAgentData";
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
  const delayCodeData = (agency) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      setLoading(true);

      var url = "/api/LDSM008/delayCodeData";
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
      var url = "api/LDSM008/updateData";
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
                remarks: cellData.FAO_REMARKS,
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

  //CheckBox function
  const handleDelayUnBookChange = (e) => {
    setDelayUnbookChecked(!delayUnbookChecked);
  };

  // process dropdown function
  const handleProcessChange = async (value) => {
    setSelectedProcessLine(value);
    setResource([]);
    if (value) {
      const rsp = await getAuthorization();
      resourceData(value.label)
    }
  };
  //plant

  const handlePlantChange = async (value) => {
    setSelectedPlant(value);
    if (value) {
      const rsp = await getAuthorization();
      setProcessLine([]);
      processLineData(value.value);
      // resourceData(value.value);
      delayAgentData(value.value);
      reasonData(value.value);
      equipData(value.value);
    }
  };

  //Resouce
  const handleResourceChange = (value) => {
    setSelectedResource(value);

  };

  //Bind delay code
  const BindDelayCodeDetails = async (item, label) => {
    var newItem = item.split("-");
    if (typeof item !== "undefined") {
      const results = await delayCodeData(newItem[0]);
      var arr = [];
      results.map((row) => {
        var obj = new Object();
        var rowArr = row.split(":");
        var obj = new Object();
        var rowArr = row.split(":");
        obj.label = rowArr[1] + "-" + rowArr[0];
        obj.value = rowArr[1];
        if (label) {
          arr.push(obj.label)
        } else {
          arr.push(obj.value)
        }
      });
      return arr;
    } else {
      alertify.error("No delay code data available");
      return [];
    }
  };
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
  //column data
  const dataCol = [
    {
      title: "Update",
      formatter: updateIcon,
      cellClick: function (e, cell) {
        updateData(cell, false);
      },
      download: false,
      frozen: true,
    },
    {
      title: "Delete",
      formatter: deleteIcon,
      cellClick: function (e, cell) {
        updateData(cell, true);
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
      editor: "list",
      editorParams: {
        showListOnEmpty: true,
        values: plant,
        clearable: true,
        autocomplete: "true", listOnEmpty: true, valuesLookup: true
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Process Line",
      field: "FAO_CD_PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }, {
      title: "Resource",
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
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Start Date",
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
      title: "End Date",
      field: "FAO_TM_STOP_EN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      accessorDownload: dateTimeOnly,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
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
      editor: "datetime",
      cellEdited: (cell) => {

        cell.getRow().update({
          "DURATION": millisToMinutesAndSeconds(new Date(cell.getValue()) - new Date(cell._cell.row.data.FAO_TM_STOP_ST))
        })

      }
    },
    {
      title: "Duration",
      field: "DURATION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      accessorDownload: decimalFormat,
      formatter: function (cell, formatterParams) {
        var value = millisToMinutesAndSeconds(new Date(cell._cell.row.data.FAO_TM_STOP_EN) - new Date(cell._cell.row.data.FAO_TM_STOP_ST))?.toString();
        if (value) {
          var decVal = value;
          return decVal;
        }
        return value;
      },
    },
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
        let varParam = '';
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      formatterParams: delayAgent,
    },
    {
      title: "Delay Agency Desc",
      field: "DELAY_AGENT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search..."
    },
    {
      title: "Delay Code",
      field: "FAO_CD_OUTAGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "list",
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return cell.getValue();
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
    },
    {
      title: "Delay Reason",
      field: "FAO_DELAY_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Delay Code Updated",
      field: "DelayCodeUpdated",
      visible: false,
      download: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var row = cell.getColumn();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
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
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    // {
    //   title: "Equip Code",
    //   field: "FAO_CD_EQP_MAST",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "list",
    //   editorParams: {
    //     allowEmpty: false,
    //     showListOnEmpty: true,
    //     values: equip,
    //   },
    // },
    {
      title: "Creation Time",
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
      title: "Modified Time",
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
      title: "Created User",
      field: "FAO_CREATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Modified User",
      field: "FAO_UPDATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="Delay Recording" />
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
                          Filters
                        </MDTypography>
                      </Grid>
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
                          Plant
                        </MDTypography>
                        <ReactSelect
                          options={plant}
                          value={selectedPlant}
                          onChange={handlePlantChange}
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
                          Process Line *
                        </MDTypography>
                        <ReactSelect
                          options={processLine}
                          onChange={handleProcessChange}
                        />
                      </Grid>
                      <Grid item xs={1.8}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Work Center
                        </MDTypography>
                        <ReactSelect
                          options={resource}
                          onChange={handleResourceChange}
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
                          From Date
                        </MDTypography>
                        {/* <DatePicker id="fromDate" /> */}
                        <DatePicker id="fromDate" value={dateValue} onChange={(date) => setDateValue(date)} />
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
                          To Date
                        </MDTypography>
                        {/* <DatePicker id="toDate" /> */}
                        <DatePicker id="toDate" value={dateValueTo} onChange={(date) => setDateValueTo(date)} />
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
                          options={Shift}
                          value={selectShift}
                          onChange={(data) =>
                            setSelectShift(data)
                          }
                        />
                      </Grid>
                      <Grid item xs={1.5} style={{ marginTop: "1rem" }}>
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
                            label="Show Unbook Delay"
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
                          Display
                        </MDButton>
                      </Grid>
                    </Grid>
                    <Grid container spacing={12}>
                      <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`Total Available Time: ${totalHrs}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`Delay in Hrs: ${DelayInHrs}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`Running Hrs: ${workingHrs}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`Mill Util.: ${milUtil}`}
                          variant="outlined"
                          color="primary"
                        />
                      </Grid>
                      {/* <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`MTBF: ${mtbf}`}
                          variant="outlined"
                          color="primary"
                          disabled
                        />
                      </Grid>
                      <Grid item xs={2} style={{ marginTop: "1rem" }}>
                        <Chip
                          label={`MTTR: ${typeof mttr === "undefined" ? 0 : mttr
                            }`}
                          variant="outlined"
                          color="primary"
                          disabled
                        />
                      </Grid> */}
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
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
                      <Grid item xs={3}>
                        <MDTypography variant="h6" color="white">
                          Delay Management Data
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
                        <AddModal
                          getData={getData}
                          delayAgentAdd={delayAgentAdd}
                          agentCodeAdd={agentCodeAdd}
                        />
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
              plant={selectedPlant.value}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
