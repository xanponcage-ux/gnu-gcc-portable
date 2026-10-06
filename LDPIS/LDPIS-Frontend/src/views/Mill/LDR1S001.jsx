import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import MonthPicker from "components/DateTime/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { GetAuthorization } from "utils";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";

export default function LDR1S001() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [rawMatTable, setrawMatTable] = useState(null);

  
  
  const [RMList, setRMList] = useState([]);
  const [rmBatchId, setrmBatchId] = useState(null)
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [process, setProcess] = useState(null);
  //const [valueRadio, setValueRadio] = React.useState("P");
  const [nxtproc, setNxtproc] = useState("30");
  const [nxtproc2, setNxtproc2] = useState("Final Inspection (0090)");
  const [inspector, setInspector] = useState("");
  const [partCount, setPartCount] = useState(0);
  const [RESULT,setRESULT] = useState([]);
  //const [selectedResult, setSelectedResult] = React.useState(null);
  const [pono, setPoNo] = useState("");
  const [salesOrdNo, setSalesOrdNo] = useState("");

  const [angle, setAngle] = useState("");
  const [selectedCalibDueDt, setSelectedCalibDueDt] = useState(null);
  const [selectedShiftDt, setSelectedShiftDt] = useState(null);
  const [issexBatch, setIsExBatch] = useState("");
  const [material, setMaterial] = useState("");
  const [remark, setRemark] = useState("");
  const [getEndFacingTable, setEndFacingTable] = useState([]);
  //const [selectedEndFacingTable, setSelectedEndFacingTable] = useState(null);
  const [pipeCreationTableData, setPipeCreationTableData] = useState([]);
  const [pipeCreationTable, setPipeCreationTable] = useState(null);
  //const [valueRadio, setValueRadio] = React.useState("2C");
  const [SHIFT,setSHIFT] = useState("");
  const [SHIFT_DATE,setSHIFT_DATE] = useState("");
  //const [filter, setFilter] = useState(defaultHrForm);
  //const [rawMatData, setRawMatData] = React.useState([]);
  var customerTable = React.createRef();
  //const [orderwiseProd, setOrderwiseProd] = useState([]);
  const [orderwiseProdData, setOrderwiseProdData] = useState(null);

  const [allValues, setAllValues] = useState({
    
    pipeNo: "",
    nxtproc: nxtproc ? nxtproc : "",
    inspector: "",
    result: "",
    pono: "",
    selectedCalibDt: null,
    selectedCalibDueDt: null,
    selectedShiftDt: null,
    selectedGaugeId: null,
    gaugerange: "",
    material: "",
    remark: "",

  });
  // const handleRadioChange = (event) => {
  //   const newValue = event.target.value;
  //   setValueRadio(newValue);
    
  //   console.log(event.target.value)
  //   //console.log(valueRadio)
  //   setRMList([])
  //   setrmBatchId(null)
  //   setPipeNoList([])
  //   setPipeNo(null)
  //   setEndFacingTable([])  
  //   if (event.target.value) {
  //     setLoading(true);
  //     GetAuthorization().then((data) => {
  //       Promise.all([
  //         getRmList(data.accessToken,newValue),
  //         getPipeNoList(data.accessToken),
          
  //       ]).finally(() => {
  //         setLoading(false);
  //       });
  //     });
  //   }
  //};

  
  // const handleRadioChange = (event) => {
  //   setValueRadio(event.target.value);
  //   if(event.target.value==="NP")
  //     setPartCount(1);
  //   selectedEndFacingTable([])  
  // };
  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  

  const fetchDetails = () => {
    setLoading(true);
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([
          getRmList(data.accessToken,"RC"),
          getPipeNoList(data.accessToken,"RC"),
          
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };
  //page load
  useEffect(() => {
    fetchDetails();
  }, []);

 

  const clearFilterOnDate = () => {
    //setOrderwiseProd([,]);
    //setPipeCreationTableData([,]);
  };
  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log(value);
      var url = "api/LD01S001/getTataDate";
      let data = {
        prodEndDt: value,
      };
      console.log(data);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            // if (response.data.length == 0) {
            //   alertify.error("No Data Found");
            //   setDateValue([,]);
            //   setLoading(false);
            // }
            var rows = [];
            
            console.log(response.data?.[0]?.[1]);
            setSHIFT_DATE(response.data?.[0]?.[1]);
            setSHIFT(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  

  const downloadExcelcustomerTableData = () => {
    console.log("Downloading");
    if (selectedEndFacingTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedEndFacingTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDR1S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedEndFacingTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const getorderwiseProdData = () => {
    setLoading(true);
    if (rmBatchId.value == "" || rmBatchId.value == null) {
      alertify.error("RM Batch Id Should Not Be Blank");
      setLoading(false);
      return;
    } 
    {
    var prodStartDateVal = document.getElementById("prodStartDate").value;
    var prodEndDateVal = document.getElementById("prodEndDate").value;
    var currentTime = new Date();

        // Step 2: Convert prodEndDateVal to a Date object
        var prodEndDateCheck = new Date(prodEndDateVal);

        // Step 3: Compare prodEndDate with the current time
        if (prodEndDateCheck > currentTime) {
          // Step 4: Display an error message using alertify.error
          alertify.error("The selected end date is greater than the current time.");
          setLoading(false);
          return;
        }
        if (new Date(prodStartDateVal) >= new Date(prodEndDateVal)) {
          alertify.error("Start time should be before end time");
          setLoading(false);
          return;
        }
       // if (prevRecorder !== 'Y') {
          var hoursDifference = (currentTime - prodStartDateVal) / (1000 * 60 * 60);
          if (hoursDifference > 72) {
              alertify.error("Start date must be within 72 hours of the current time.");
              setLoading(false);
              return;
          }
      //}
        if (prodStartDateVal != "") {
          var d = new Date(prodStartDateVal);
          // var prodStartDt =
          //   ("0" + d.getDate()).slice(-2) +
          //   "-" +
          //   d.toString().substr(4, 3) +
          //   "-" +
          //   d.getFullYear();
        } else {
          alertify.error("Please select Prod Start Dt for batch create");
          setLoading(false);
          return;
        }
        if (prodEndDateVal != "") {
          // var d = new Date(prodEndDateVal);
          // var prodEndDt =
          //   ("0" + d.getDate()).slice(-2) +
          //   "-" +
          //   d.toString().substr(4, 3) +
          //   "-" +
          //   d.getFullYear();
        } else {
          alertify.error("Please select Prod End Dt for batch create");
          setLoading(false);
          return;
        }
    }
    var data = {
          RM_BATCH: rmBatchId.value
        };
      
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post("api/LDR1S001/getorderwiseProdData", data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            setLoading(false);
          } else {
            console.log(response?.data);
            setOrderwiseProdData(response?.data);
            setLoading(false);
          }
        });
    });
  };

 

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

  const validateUser = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    setLoading(true);
    try {
      var plant = "";

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
      var pageName = "LD01S003";
      var authDetails = await getScreenAuth(plant,userId,pageName);
      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW") {
            setReadWriteAccess(false);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page"
            );
          }
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

    

  const updateApi = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedEndFacingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }


    const formatDate = (dateString) => {
      if (!dateString) return ""; 
  
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ""; 
  
      return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
      }).replace("Sept", "Sep").toUpperCase().replace(/ /g, "-");
  };
  
  // Get and format the dates
  var prodStartDateVal = formatDate(document.getElementById("prodStartDate").value);
  var prodEndDateVal = formatDate(document.getElementById("prodEndDate").value);
    
    // var prodStartDateVal = document.getElementById("prodStartDate").value;
    // var prodEndDateVal = document.getElementById("prodEndDate").value;
     var newData = [];
     selectedRows.forEach(function (item) {
      newData.push({
        
        PLANT : '0780',
        BATCH_NO: item._row.data.PIPE_NO ? item._row.data.PIPE_NO : "",
        CD_PROC: item._row.data.CUR_PROC ? item._row.data.CUR_PROC : "",
        BATCH_PROC_NO: "0",
        NEXT_PROC: item._row.data.NXT_PROC ? item._row.data.NXT_PROC : "",
        PROD_DATE: SHIFT_DATE ,
        SHIFT: SHIFT ? SHIFT : "",
        WEIGHT: "",
        STATUS: statusValue,
        PAR_COIL_NO: rmBatchId.value ? rmBatchId.value : "",
        ID_FIRST_PAR: "",
        ID_ORDER_NO: "0",
        ITEM_NO: "",
        QUALITY_CD: "",
        MATNR: material ? material : "",
        FLAG: "",
        START_DT: prodStartDateVal,
        END_DT: prodEndDateVal,
        RESULT: item._row.data.RESULT ? item._row.data.RESULT : "",
        REMARK: item._row.data.REMARK ? item._row.data.REMARK : "",
        HEAT_NO: "",
        INSP_NAME: item._row.data.INSPECTOR ? item._row.data.INSPECTOR : "",
        PIPE_OD_10: item._row.data.PIPE_OD ? item._row.data.PIPE_OD : "",
        PIPE_THK_10: item._row.data.PIPE_THICK ? item._row.data.PIPE_THICK : "",
        PIPE_LNG_10: item._row.data.PIPE_LEN ? item._row.data.PIPE_LEN : "",
        ANGLE: item._row.data.ANGLE ? item._row.data.ANGLE : "",



      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData
      
    };
    var url = "api/LDR1S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          var res= response.data[0]
          if (res == 'N' ) {
            //console.log("msg",res[0])
            alertify.error("Row Insertion Failed");
            //setE1Table([,]);
          } else {
            
            alertify.success("Row Inserted Successfully !!!");

          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  
  // const getMatNo = async (value,accessToken) => {
  //   // if (newToken) {
  //   //   const rsp = await getAuthorization();
  //   // }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + accessToken,
  //     },
  //   };

  //   //setLoading(true);
  //   let data = {
  //     RM_BATCH: value.value? value.value : "",
  //   };
  //   console.log("datarm",data)
    
  //   var url = "api/LDR1S001/getMatNo";
  //   axiosAPI
  //     .post(url, data, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         var items = [];
  //         console.log(response.data);
  //         response.data.map((row) => {
  //           console.log(row);
  //           var obj = new Object();
  //           obj.label = row.LOM_NO_MATNR;
  //           obj.value = row.LOM_NO_MATNR;
  //           items.push(obj);
  //         });
  //         console.log("material",items[0].value)
  //         setMaterial(items[0].value);
  //         Promise.all([
           
  //         ])
          
  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };

  // const getPoNo = async (value,accessToken) => {
  //   // if (newToken) {
  //   //   const rsp = await getAuthorization();
  //   // }
  //   var defaultOptions = {
  //     headers: {
  //       Authorization: "Bearer " + accessToken,
  //     },
  //   };

  //   //setLoading(true);
  //   let data = {
  //     RM_BATCH: value.value? value.value : "",
  //     PIPE_NO: pipeno.value ? pipeno.value : "",
  //   };
  //   console.log("datarm",data)
    
  //   var url = "api/LDR1S001/getPoNo";
  //   axiosAPI
  //     .post(url, data, defaultOptions)
  //     .then((response) => {
  //       if (response.statusText != "" && response.statusText != "OK") {
  //         //reject(response.statusText);
  //       } else {
  //         var items = [];
  //         console.log(response.data);
  //         response.data.map((row) => {
  //           console.log(row);
  //           var obj = new Object();
  //           obj.label = row.LOM_ID_ORDER_CUS;
  //           obj.value = row.LOM_ID_ORDER_CUS;
  //           items.push(obj);
  //         });
  //         console.log("pono",items[0].value)
  //         setPoNo(items[0].value)
  //         //setMaterial(items[0].value);
  //         Promise.all([
           
  //         ])
          
  //       }
  //     })
  //     .finally((f) => {
  //       setLoading(false);
  //     });
  // };


  const getRmList = async (accessToken,status) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };


    //setLoading(true);
    let data = {
      status: status,
      pipeno: pipeno ? pipeno : "",
    };
    console.log("status",data)
    var url = "api/LDR1S001/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_PAR_COIL_NO;
            obj.value = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });
          setRMList(items);
          Promise.all([
           getPipeNoList("",accessToken,data.status),
          //  getMatNo("",accessToken),
          //  getPoNo("",accessToken,data.pipeno)
          ])
          
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getPipeNoList = async (value,accessToken,status) => {
   
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    
    let data = {
      status: status,
      rmBatch : value.value? value.value : "",
    };
    var url = "api/LDR1S001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            items.push(obj);
          });
          
          setPipeNoList(items)
          if(items.length > 0){
            setPipeNo(items[0])
          }
          else{
            setPipeNo(null)
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleRMBatchChange = (value) => {
    //console.log(value);
    
    setPipeNo(null)
    setrmBatchId(value);
    let status;
    if(process?.value)
    {
     status=process.value;
    }
    else status="1P";
    //let pipeno = pipeno
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getPipeNoList(value, data.accessToken,status),
         
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
    //console.log(rmBatchId);
  };

  const handlePipeNoChange = (value) => {
    //console.log(value);
    setPipeNo(value);
    //console.log(rmBatchId);
    //let pipeno = pipeno
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
         // getPoNo(value,data.accessToken)
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  
  const handleMain = (newToken = false) => {
    setPipeNo("")
    setrmBatchId("")
    selectedEndFacingTable([])    
  };

  const handleClearAll = (newToken = false) => {
    
    setInspector("")
    setRemark("")
    setRESULT("")
    setPartCount(1)
    setPipeCreationTableData([])

  };

  // const search = async () => {
    
  //   console.log(valueRadio)
   //   };

  // const fillData = async () => {


  //   //selectedEndFacingTable([])
  //   const formatDateToDDMMYYYY = (date) => {
  //     if (!date) return "";
  //     const d = new Date(date);
  //     const day = String(d.getDate()).padStart(2, '0');
  //     const month = String(d.getMonth() + 1).padStart(2, '0');
  //     const year = d.getFullYear();
  //     return `${day}-${month}-${year}`;
  // };
  //   var data = {
  //     rmBatchId : rmBatchId.value ? rmBatchId.value: "",
  //     pipeno : pipeno.value ? pipeno.value : "",
  //     inspector : inspector ? inspector : "",
  //     result : RESULT ? RESULT : "",
  //     pono : pono ? pono : "",
  //     angle : angle ? angle : "",
  //     shift : selectedShiftDt ? (selectedShiftDt) : "",
  //     issexBatch : issexBatch ? issexBatch : "",
  //     material : material ? material : "",
  //     remark : remark ? remark : "",

  //   };

    
  //   console.log("mandfield",data)

  //   // if (data.rmBatchId == "" || data.pipeno == "" || data.pono == "" || data.inspector == "" || data.angle == ""  || data.shift == null || data.issexBatch == "" || data.material == "" || data.remark == "" || data.result == "") {
  //   //   alertify.error("Please Mandatory Fields");
  //   //   return;
  //   // }
  //   //const dummyData =  bindEndFacingData();

  //   console.log("dummydata",dummyData)
  //   const table = new Tabulator("#endFacingTableContainer", {
  //       pagination: "local",
  //       paginationSize: 12,
  //       data: dummyData, 
  //       columns: endFacingColumn,
  //       height: 400,
  //       layout: "fitDataFill",
  //     });

      
  //     setSelectedEndFacingTable(table)
  //     // const table1 = setSelectedHydraTable();
  //     //  table1.addRow(newRow);
  //     return;
  //   };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

const fillData = async () => {
  setLoading(true);
  try {
      const token = await GetAuthorization();
      const defaultOptions = {
          headers: {
              Authorization: "Bearer " + token.accessToken,
          },
      };
      const dummyData = [];
      const pipeid = {
        RM_BATCH: pipeno.value || ""
    };
    let loopCounter=1;
    
      const url1 = "api/LDR1S001/getPipeInfo";
      const info = await axiosAPI.post(url1, pipeid, defaultOptions);
      console.log(info?.data[0])
      if (info?.status !== 200 || !info?.data || !info?.data[0] ) {
          alertify.error("Failed to retrieve PIPE Info.");
          setLoading(false);
          return; // Stop execution if API call fails
      }
      console.log("hello")
      const pipeInfo = info.data[0];
      console.log(pipeInfo)
      console.log(pipeInfo?.LOM_SEC1)

            for (let i = 0; i < loopCounter; i++) {
                const data = {
                    PIPEID: pipeno.value,
                    CURR_PROC: "T",
                    //RESULT: RESULT.value,
                    REMARK: remark,
                    PARTNO: partCount,
                    RM_BATCH:info?.data[0]?.LOM_ID_PAR_COIL_NO,
                    WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL,
                    NEXT_PROC: "2",
                    EWI_ID_ORDER_CUS: pipeInfo?.LOM_ID_ORDER_CUS,
                    EWI_ID_ORD_ITEM_CUS:   pipeInfo?.LOM_ID_ORD_ITEM_CUS,
                    EWI_SEC1: pipeInfo?.LOM_SEC1,
                    EWI_SEC2: pipeInfo?.LOM_SEC2,
                    EWI_LENGTH: pipeInfo?.LOM_LENGTH,
                    INSPECTOR: inspector
                };
                dummyData.push(data);
            }
      setPipeCreationTableData(dummyData);
  } catch (error) {
      alertify.error("Error filling data: " + error);
  } finally {
      setLoading(false);
  }
};


 


  const handleResultChange = (value) => {
    setRESULT(value)
  };


  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];

  const bindEndFacingData = async () => {
    try {
        const token = await GetAuthorization();
        const defaultOptions = {
            headers: {
                Authorization: "Bearer " + token.accessToken,
            },
        };
        console.log("hello")
        const currentDate = new Date();
        const formattedDate = formatDateToDDMMYYYY(currentDate);
        const formattedTime = currentDate.toTimeString().split(" ")[0];

        let requestData = {
            RM_BATCH: rmBatchId?.value || "",
            status: process?.value || "1P",
        };

        if (pipeno && pipeno?.value) {
          requestData.PIPE_NO = pipeno.value;
        }
        else {
          requestData.PIPE_NO = "";
        }
        console.log(requestData)
        const response = await axiosAPI.post("api/LDR1S001/getFillData", requestData, defaultOptions);
        
        if (response.status !== 200 || !response.data) {
            throw new Error("Invalid response from API");
        }
        const columns = response.data[0].map(col => ({
          title: col.title,
          field: col.field,
          headerFilterPlaceholder: "search...",
          headerFilter: "input",
        }));
  
        // Add additional columns fixed as per your requirements
        const additionalColumns = [
          {
            formatter: "rowSelection",
            titleFormatter: "rowSelection",
            hozAlign: "center",
            headerSort: false,
          },
        //   {
        //     title: "Result",
        //     field: "RESULT",
        //     headerFilterPlaceholder: "search...",
        //     headerFilter: "input",
        //     //editable: true,
        //     editor: "list", // Use the new list editor
        //     // editorParams: {
        //     //     // Define the list of options as an array of objects
        //     //     values: [
        //     //         { value: "OK", label: "OK" },
        //     //         { value: "NOT OK", label: "NOT OK" },
        //     //     ],
        //     // },
        //     editorParams:{
        //       values: {"OK":"OK","NOT OK":"NOT OK"}
        //     }, 
        //     formatter: function (cell) {
        //         const value = cell.getValue();
        //         cell.getElement().style["background-color"] = "#DA8EE7";
        //         cell.getElement().style["color"] = "#FFFFFF";
        //         return value;
        //     },
        // },
        {
          title: "Remark",
          field: "REMARK",
          headerFilterPlaceholder: "search...",
          headerFilter: "input",
          editor: "input",
        }
         ];
  
        // Combine the columns
        setEndFacingColumnDescriptions([...additionalColumns,...columns]);
        const dummyData = response.data[1].map((row) => {
          // Create a new object for each row
          const newDataObject = {};

          // Populate dynamically based on the column headers
          columns.forEach(col => {
              newDataObject[col.field] = row[col.field] !== undefined ? row[col.field] : "";
          });

          // Add inspector, RESULT, and REMARK fields with default values (you may have your logic for fetching these values)
          newDataObject.INSPECTOR = inspector || ""; // Assuming inspector is defined elsewhere in your component
          //newDataObject.RESULT = RESULT.value || ""; // Assuming RESULT is defined elsewhere in your component
          newDataObject.REMARK = remark || ""; // Assuming remark is defined elsewhere in your component
          
          return newDataObject;
        });
        return dummyData; 
    } catch (error) {
        //console.error("Error fetching API data:", error);
        alertify.error("Error fetching data.");
        return [];
    } finally {
        setLoading(false);
    }
};

const confirm = async (newToken = false) => {
  if (pipeCreationTableData.length !== 0) {
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

    var url;
    var tableData = pipeCreationTable.getData();
    if (inspector.length == 0) {
      alertify.error("Please enter Inspector Name");
      return;
    }
    var newReworkData = [];
    // Step 4: Extract data from selected rows
    tableData.forEach(function (item) {
      console.log(item);
      newReworkData.push(item);
    });
    console.log(newReworkData)
  
    // const totalPartPipes = pipeCreationTable.getCalcResults()?.bottom?.PIPE_WEIGHT;
    // let motherTotal = parseFloat(newReworkData?.[0]?.WEIGHT);
    //   const tolerance = 0.00001; //Slightly smaller than the rounding precision

     
    //   if (
    //     newReworkData.length > 0 &&
    //     Math.abs(totalPartPipes - motherTotal) > tolerance
    //   ) {
    //     alertify.error("Total Mother weight not equal to parted pipes weight.");
    //     return;
    //   }
      
   
    var data = {
      newReworkData: newReworkData,
      parting:"",
    };
    console.log(data)
    setLoading(true);
    url = "api/LDR1S001/insertpipedetails";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          console.log(response.data);
          if (response?.data?.errorString?.[0] === "Y") {
            alertify.success("Rework Recorded  successfully");
            handleClearAll(true);
          } else {
            alertify.error(response?.data?.errorString);
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    setLoading(false);
    alertify.error("No data available for  details !");
  }
};

useEffect(() => {
  // if (
  //   pipeCreationTableData &&
  //   pipeCreationTableData.length > 0
  // ) {
    console.log(pipeCreationTableData);
  const table = new Tabulator("#pipeCreationTable", {
    pagination: "local",
    paginationSize: 12,
    data: pipeCreationTableData,
    columns: pipeCreationColumn,
    //height: 400,
    layout: "fitDataFill",
});

setPipeCreationTable(table);

// }
}, [ pipeCreationTableData]);

const pipeCreationColumn = [
  // {
  //   formatter: "rowSelection",
  //   titleFormatter: "rowSelection",
  //   hozAlign: "center",
  //   headerSort: false,
  // },  
{
title: "Quality Operation",
field: "CURR_PROC",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: false
},
{
title: "Pipe Id",
field: "PIPEID",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: false
},
// {
//   title: "Result",
//   field: "RESULT",
//   headerFilterPlaceholder: "search...",
//   headerFilter: "input",
//   headerFilterPlaceholder: "search...",
//   editor: "input"
//   },
{
title: "Remark",
field: "REMARK",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: "input"
},
{
  title: "No Of parts",
  field: "PARTNO",
  headerFilterPlaceholder: "search...",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  editor: false
},
{
title: "RM Coil",
field: "RM_BATCH",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: false
},
{
title: "RM Weight(Kg)",
field: "WEIGHT",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: false,
formatter: function (cell, formatterParams) {
  var value = cell.getValue();
  if (value) {
    return value.toFixed(3);
  }
  return value;
},
},
{
  title: "Decision",
  field: "DECISION",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  editor: "list",
  editorParams: {
      allowEmpty: false,
      showListOnEmpty: true,
      values: [
          { label: "Downgrade", value: "DOWN" },
          { label: "Scrap", value: "SCRAP" },
          { label: "Pass", value: "PASS" },
      ],
  },
  formatter: function (cell) {
      var value = cell.getValue();
      cell.getElement().style["background-color"] = "#DA8EE7";
      cell.getElement().style["color"] = "#FFFFFF";
      return value;
  },
  cellEdited: function (cell) {
      // Get the new value that was selected
      var newValue = cell.getValue();

      // Get all rows in the table
      var allRows = cell.getTable().getRows();

      // Set the new value for the same field in all rows
      allRows.forEach(row => {
          row.update({ DECISION: newValue }); // Update the row data
      });
  }
},  
{
title: "Thickness",
field: "EWI_SEC1",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: false,
width: 100 
},
{
title: "Odia",
field: "EWI_SEC2",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: false,
width: 100 
},
{
title: "Length",
field: "EWI_LENGTH",
headerFilterPlaceholder: "search...",
headerFilter: "input",
headerFilterPlaceholder: "search...",
editor: false,
width: 100 
},
{
  title: "Inspector",
  field: "INSPECTOR",
  headerFilterPlaceholder: "search...",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  editor : "input"
  },

]

const endFacingColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    // {
    //   title: "CUR PROC",
    //   field: "CUR_PROC",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   //editor : "input"
    // },

    // {
    //   title: "Next Proc",
    //   field: "NXT_PROC",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   //editor : "input"
    // },

    {
      title: "Pipe No",
      field: "LOM_ID_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "RM Batch",
      field: "LOM_ID_PAR_COIL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "Pipe OD",
      field: "LOM_SEC2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },

    {
      title: "Pipe Thick",
      field: "LOM_SEC1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },

    {
      title: "Pipe Len",
      field: "LOM_LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },

    {
      title: "Inspector",
      field: "INSPECTOR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    // {
    //   title: "Result",
    //   field: "RESULT",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   editable: true,
    //   editor: "select",
    //   editorParams: {
    //     values: {
    //       "ok": "OK",
    //       "notok": "NOT OK",
    //       "hold": "HOLD"
    //     }
    //   },
    //   defaultValue: "ok",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    // },
    {
      title: "Remark",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    }
  ];


  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="11 - ReWork"
      />
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
            <Grid container spacing={5}>
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
                      <Grid item xs={2}>
                        <MDTypography variant="h6" color="white">
                          Filter
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
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

                  <MDBox px={3} py={3}>
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
                        RM Batch *
                      </MDTypography>
                      
                      <ReactSelect
                        id="rmList"
                        options={RMList}
                        onChange={handleRMBatchChange}
                        variant="h6"
                        value={rmBatchId}
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
                        Pipe No *
                      </MDTypography>
                      
                      <ReactSelect
                        id="pipenoList"
                        options={pipenoList}
                        onChange={handlePipeNoChange}

                        //onChange={handlePipeNoChange}
                        variant="h6"
                        value={pipeno}
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
                        Process *
                      </MDTypography>
                      
                      <ReactSelect
                        id="process"
                        options={[
                          { label: "10", value: "1P" },
                          { label: "20", value: "2P" },
                          { label: "30", value: "3P" },
                          { label: "40", value: "4P" },
                          { label: "50", value: "5P" },
                          { label: "60", value: "6P" },
                        ]}
                        onChange={handleProcessChange}
                        variant="h6"
                        value={process}
                      />
                    </Grid> */}
                      {/* <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Sales Ord No*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="salesOrdNo"
                          value={salesOrdNo}
                          onChange={(e) => setSalesOrdNo(e.target.value)}
                        />
                      </Grid> */}
                                


                      {/* <Grid item xs={3}>
                            <FormControl>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Function
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueRadio}
                                onChange={handleRadioChange}
                                
                              >
                                <FormControlLabel
                                  value="2C"
                                  control={<Radio />}
                                  label="Normal"
                                />
                                <FormControlLabel
                                  value="2P"
                                  control={<Radio />}
                                  label="Hold"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid> */}

                      {/* <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                        >
                          Submit
                        </MDButton>
                      </Grid> */}
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              {/* <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={0.25}
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
                      <Grid item xs={2}>
                        <MDTypography variant="h6" color="white">
                          Visual Inspection  DATA
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={2}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div id="orderwiseProd" />
                        
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid> */}



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

                      <Grid item xs={2}>
                        <MDTypography variant="h6" color="white">
                          Data
                        </MDTypography>
                      </Grid>


                      <Grid item xs={2}></Grid>
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

                  <MDBox px={3} py={3}>
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
                          Inspector*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="inspector"
                          value={inspector}
                          onChange={(e) => setInspector(e.target.value)}
                        />
                      </Grid>
                      {/* <Grid item xs={1.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Result*
                            </MDTypography>
                            <ReactSelect
                          options={ResultType}
                          onChange={handleResultChange}
                          value={RESULT}
                        />
                        </Grid> */}
                      

                      <Grid item xs={6.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Remark*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="remark"
                          value={remark}
                          onChange={(e) => setRemark(e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6.5}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => fillData()}
                        >
                          Fill Data
                        </MDButton>
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
                    py={0.25}
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
                      <Grid item xs={2}>
                        <MDTypography variant="h6" color="white">
                          Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton color="white" onClick={() => confirm(true)}>
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelcustomerTableData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={2}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {pipeCreationTableData && <div id="pipeCreationTable" />}


                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {pipeCreationTableData.length} of{" "}
                          {pipeCreationTableData.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
