import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
// Material Dashboard 2 React components
import { GetAuthorization } from "utils";
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { set } from "date-fns";

export default function TubePlanning() {
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
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("G");
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [SHIFT,setSHIFT] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [SHIFT_DATE,setSHIFT_DATE] = useState(null);
  const [RESULT, setRESULT] = useState([]);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [pipesurfacetemp, setPipeSurfaceTemp] = useState("");
  const [getBlastAppTable, setBlastAppTable] = useState([]);
  const [selectedBlastAppTable, setSelectedBlastAppTable] = useState(null);
  const [expanded, setExpanded] = useState(true);
  

  

  const fetchDetails = () => {
    setLoading(true);
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([
          getRmList(data.accessToken),
          getPipeNoList(data.accessToken),
          
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
      var pageName = "LD15S001";
      var authDetails = await getScreenAuth(plant, userId, pageName);
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

  const handleResultChange = (value) => {
    setSelectedResult(value)
   
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value)
   
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

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

    const setTableNull = () => {
      setBlastAppTable([])
      
    };

    const getNxtProc = async (accessToken,pipeno) => {
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
        CURR_PROC: "G",
        PIPE_NO: pipeno.value ? pipeno.value : "",
        
      };
      //console.log("status",data.status)
      var url = "api/LD03S001/getnxtproc";
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
              obj.label = row.NXTPROC;
              obj.value = row.NXTPROC;
              items.push(obj);
            });
           setNxtproc(items[0].value)
            
            
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };


    const getOrdDetails = async (accessToken,pipeno) => {
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
        //RM_BATCH: value.value ? value.value : "",
        PIPE_NO: pipeno.value ? pipeno.value : "",
      };
      console.log("datarm", data)
  
      var url = "api/LD02S001/getOrderDetails";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            var orditem = [];
            var custname = [];
            console.log(response.data);
            response.data.map((row) => {
              console.log(row);
              var obj = new Object();
              obj.label = row.LOM_ID_ORDER_CUS;
              obj.value = row.LOM_ID_ORDER_CUS;
              items.push(obj);
            });
            response.data.map((row) => {
              console.log(row);
              var obj1 = new Object();
              obj1.label = row.LOM_ID_ORD_ITEM_CUS;
              obj1.value = row.LOM_ID_ORD_ITEM_CUS;
              orditem.push(obj1);
            });
            response.data.map((row) => {
              console.log(row);
              var obj2 = new Object();
              obj2.label = row.ENC_CUST_NAME;
              obj2.value = row.ENC_CUST_NAME;
              custname.push(obj2);
            });
            console.log("items",items[0].value)
            setOrdNo(items[0].value)
            setOrdItem(orditem[0].value)
            setCustName(custname[0].value)
  
            Promise.all([
  
            ])
  
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };
    
    useEffect(() => {
      if (getBlastAppTable?.length > 0) {
        const table = new Tabulator("#BlastAppTableContainer", {
          pagination: "local",
          paginationSize: 12,
          data: getBlastAppTable,
          columns: BlastAppColumns,
          height: 400,
          layout: "fitDataFill",
        });
  
        setSelectedBlastAppTable(table);
      } else {
        setSelectedBlastAppTable(null)
      }
    }, [getBlastAppTable])

    const clearFilterOnDate = () => {
      setBlastAppTable([]);
      setSelectedBlastAppTable(null);
    };


  

    const handleClearMain = (newToken = false) => {
      setPipeNo("")
      setrmBatchId("")
      setSelectedShift(null);
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      setSHIFT("");
      setSHIFT_DATE(null);
    const prodDateInput = document.getElementById("Pdate");
      if (prodDateInput) {
        prodDateInput.value = null;
      }
  
      const prodStartDateInput = document.getElementById("prodStartDate");
      if (prodStartDateInput) {
        prodStartDateInput.value = "";
      }
  
      const prodEndDateInput = document.getElementById("prodEndDate");
      if (prodEndDateInput) {
        prodEndDateInput.value = "";
      }
      
     
    };

    const handleClearAll = (newToken = false) => {
      setPipeSurfaceTemp("")
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      setOrdNo("")
      setOrdItem("")
      setCustName("")
      setSelectedResult(null)
      
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
        var url = "api/LD15S001/getTataDate";
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
             
              var rows = [];
              
              console.log(response.data?.[0]?.[1]);
              setSHIFT_DATE(response.data?.[0]?.[1]);
              //setSHIFT(response.data?.[0]?.[0]);
              setLoading(false);
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    };

    const getRmList = async (accessToken) => {
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
        status: 'GC',
      };
      //console.log("status",data)
      var url = "api/LD15S001/getRmList";
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
            setrmBatchId(items[0]);

            Promise.all([
             getPipeNoList(items[0],accessToken),
             
            ])
            
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };
    
    const getPipeNoList = async (value,accessToken) => {
    
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
    
      
      let data = {
        status: 'GC',
        rmBatch : value.value? value.value : "",
        
      };
      var url = "api/LD12S001/getPipeNoList";
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
            Promise.all([
              getOrdDetails(accessToken,items[0]),
              getNxtProc(accessToken,items[0])
              
            ])
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    };

    const handleClearVal = (newToken = false) => {
      setPipeNo("")
      setSelectedShift(null);
      setPipeSurfaceTemp("")
      setOrdNo("")
      setOrdItem("")
      setCustName("")
      setSelectedResult(null)
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      const prodDateInput = document.getElementById("Pdate");
      if (prodDateInput) {
        prodDateInput.value = null;
      }
  
      const prodStartDateInput = document.getElementById("prodStartDate");
      if (prodStartDateInput) {
        prodStartDateInput.value = "";
      }
  
      const prodEndDateInput = document.getElementById("prodEndDate");
      if (prodEndDateInput) {
        prodEndDateInput.value = "";
      }
    };
    
    const handleRMBatchChange = (value) => {
      
      setPipeNo(null)
      setrmBatchId(value);
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      handleClearVal(true)
      if (value) {
        setLoading(true);
        GetAuthorization().then((data) => {
          Promise.all([
            getPipeNoList(value, data.accessToken),
            
          ]).finally(() => {
            setLoading(false);
          });
        });
      }
      //console.log(rmBatchId);
    };
    
    const handlePipeNoChange = (value) => {
      
      setPipeNo(value);
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      //handleClearVal(true)
      if (value) {
        setLoading(true);
        GetAuthorization().then((data) => {
          Promise.all([
            getOrdDetails(data.accessToken,value),
            getNxtProc(data.accessToken,value)
  
          ]).finally(() => {
            setLoading(false);
          });
        });
      }
    };


  
  

  
  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
};

  
  const bindBlastAppData = async () => {
    try {
      setLoading(true);
      setBlastAppTable([])
      setSelectedBlastAppTable(null)
      var prodStartDateInput = document.getElementById("prodStartDate").value;
    var prodEndDateInput = document.getElementById("prodEndDate").value;
    var currentTime = new Date(); 
    var prodEndDateCheck = new Date(prodEndDateInput);

    //if productionendDt is greater than currentdate check
    if (prodEndDateCheck > currentTime) {
     
      alertify.error("The selected end date is greater than the current time.");
      setLoading(false);
      return;
    }
    //if startdt is greater than endDt
    if (new Date(prodStartDateInput) >= new Date(prodEndDateInput)) {
      alertify.error("Start time should be before end time");
      setLoading(false);
      return;
    }
    
    // startdt must be in 72 hours of current date
    var hoursDifference = (currentTime - prodStartDateInput) / (1000 * 60 * 60);
    if (hoursDifference > 72) {
      alertify.error(
        "Start date must be within 72 hours of the current time."
      );
      setLoading(false);
      return;
    }
    if (prodStartDateInput == "") {
      alertify.error("Please select Prod Start Dt");
      setLoading(false);
      return;
    }
    if (prodEndDateInput == "") {
      alertify.error("Please select Prod End Dt");
      setLoading(false);
      return;
    }
        
        
        let data ={
          rmBatchId : rmBatchId ? rmBatchId : "",
          prodstartdt : prodStartDateInput.value ? prodStartDateInput.value : "",
          prodenddt : prodEndDateInput.value ? prodEndDateInput.value : ""
        }
  
  
  
       // console.log("DATA150",data)
  
        if (data.rmBatchId == "" ) {
                alertify.error("Please enter mandatory fields.");
                 return;
        }
        const token = await GetAuthorization();
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
  
     
      //const processdt = formatDate(selectedProcessDt);
      const currentDate = new Date();
      const formattedDate = formatDateToDDMMYYYY(currentDate);
      const formattedTime = currentDate.toTimeString().split(" ")[0];
     let requestData = {
        RM_BATCH: rmBatchId?.value || "",
        STATUS: 'GC'
        
      };
  
     
      if (pipeno && pipeno.value) {
        requestData.PIPE_NO = pipeno.value;
      }
      else{
        requestData.PIPE_NO = "";
      }
  
      

      let response = await axiosAPI.post("api/LD15S001/getFillData", requestData, defaultOptions);
  
      console.log("response", response);
      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid response from API");
      }
      if (response.data.length == 0)
      {
       
        alertify.error("NO Data Found in V_BARE_PDO");
        return;
      }


      let BlastAppData = response.data.map((row) => ({
              C_PRC : nxtproc2 ? nxtproc : "",
              N_PRC : nxtproc ? nxtproc : "",
              PIPE_NO: row.TBP_BATCH_NO ? row.TBP_BATCH_NO : "",
              PIPE_SURFACE_TEMP: pipesurfacetemp ? pipesurfacetemp : "",
              DATE: formattedDate,
              TIME : formattedTime,
              RESULT: selectedResult.value ? selectedResult.value : "",
              
             
        }));
  
      console.log("BlastAppData",BlastAppData)
      setBlastAppTable(BlastAppData)
      
  
    } catch (error) {
      alertify.error("Error fetching data.");
      
    } finally {
      setLoading(false);
    }
  };

  
  const updateData = async (newToken = false) => {
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
  
    var selectedRows = selectedBlastAppTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }

    // const formatDate = (date) => {
    //   const d = date.getDate().toString().padStart(2, "0");
    //   const m = (date.getMonth() + 1).toString().padStart(2, "0"); 
    //   const y = date.getFullYear();
    //   const h = date.getHours().toString().padStart(2, "0");
    //   const min = date.getMinutes().toString().padStart(2, "0");
    //   // const s = date.getSeconds().toString().padStart(2, '0');
    //   return `${d}-${m}-${y} ${h}:${min}`;
    // };
  
    const formatDate = (date) => {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0"); 
      const y = date.getFullYear();
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      // const s = date.getSeconds().toString().padStart(2, '0');
      return `${d}-${m}-${y} ${h}:${min}`;
    };
    var prodStartDateVal = document.getElementById("prodStartDate").value;
    var prodEndDateVal = document.getElementById("prodEndDate").value;
    var startDate = new Date(prodStartDateVal);
    var endDate = new Date(prodEndDateVal);
    var prodstartdt = formatDate(startDate)
    var prodenddt = formatDate(endDate)
    
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push({
        PLANT : '0780',
        BATCH_NO: item._row.data.PIPE_NO ? item._row.data.PIPE_NO : "",
        C_PRC: item._row.data.C_PRC ? item._row.data.C_PRC : "",
        BATCH_PROC_NO: "0",
        NEXT_PROC: item._row.data.N_PRC ? item._row.data.N_PRC : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: selectedShift.value ? selectedShift.value : "",
        STATUS: "GC",
        PAR_COIL_NO: rmBatchId.value ? rmBatchId.value : "",
        ID_ORDER_NO:  ordNo ? ordNo : "0",
        NO_MATNR: "0",
        START_DT: prodstartdt,
        END_DT: prodenddt,
        RESULT: item._row.data.RESULT ? item._row.data.RESULT : "",
        PIPE_SUR: item._row.data.PIPE_SURFACE_TEMP ? item._row.data.PIPE_SURFACE_TEMP : "",
        HOLD_RSN: item._row.data.HOLD_REASON ? item._row.data.HOLD_REASON : "",

        
  
  
      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData
      
    };
    var url = "api/LD15S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          var res= response.data[0]
          if (res == 'Y' ) {
            alertify.success("Row Inserted Successfully !!!");
            setBlastAppTable([]);
            setSelectedBlastAppTable(null)
            handleClearAll();
            handleClearMain();
            fetchDetails();
          } else {
            
            alertify.alert(response?.data[0])
           
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

 
  const BlastAppColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Cur Proc",
      field: "C_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
     
    },
    {
      title: "Nxt Proc",
      field: "N_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
     
    },
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Pipe Surface Temp",
      field: "PIPE_SURFACE_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Date",
      field: "DATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },

    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Result",
      field: "RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          "OK": "OK",
          "NOT OK": "NOT OK",
          "HOLD": "HOLD"
        }
      },
      //defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
  },
  {
    title: "Hold Reason",
    field: "HOLD_REASON",
    headerFilterPlaceholder: "search...",
    headerFilter: "input",
    editor: "input", 
    width: 150,
    validator: function(value, cell) {
      
      return value ? true : false; 
    },
    editable: function(cell) {
      
      const resultValue = cell.getRow().getData().RESULT; 
      return resultValue === "HOLD"; 
    },
    formatter: function (cell) {
      const value = cell.getValue();
      cell.getElement().style["background-color"] = "#DA8EE7";
      cell.getElement().style["color"] = "#FFFFFF";
      return value;
    },
  },
   
     
  ];

  const downloadExcelBlastAppTableData = () => {
    //console.log("Downloading");
    if (selectedInletTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedBlastAppTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD15S001" + ".xlsx";

    window.XLSX = XLSX;

    selectedBlastAppTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };


  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Internal Blasting & Application stage inspection(150)"
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
                        Screen required for entry
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearMain(true)}
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
                        variant="h6"
                        value={pipeno}
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
                        {" "}
                        Prod Start Date *
                      </MDTypography>

                      <input
                        type="datetime-local"
                        //step="1" // Allows selection of seconds
                        style={{ height: "37px" }}
                        id="prodStartDate"
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
                        {" "}
                        Prod End Date *
                      </MDTypography>

                      <input
                        type="datetime-local"
                        //step="1" // Allows selection of seconds
                        style={{ height: "37px" }}
                        id="prodEndDate"
                        onChange={(e) => {
                          var d = new Date(e.target.value);
                          var d = new Date(e.target.value);
                          // Extract components
                          var year = d.getFullYear();
                          var month = ('0' + (d.getMonth() + 1)).slice(-2); // Months are 0-based
                          var day = ('0' + d.getDate()).slice(-2);
                          var hours = ('0' + d.getHours()).slice(-2);
                          var minutes = ('0' + d.getMinutes()).slice(-2);
                          //var seconds = ('0' + d.getSeconds()).slice(-2);

                          // Format to Oracle date string
                          var oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;

                          //console.log(oracleDate);
                          getTataDate(oracleDate);
                          clearFilterOnDate();
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
                        {" "}
                        Prod Date *
                      </MDTypography>
                      <MDInput name="Pdate" id="Pdate" iseditable="false" value={SHIFT_DATE} />
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
                          Shift*
                        </MDTypography>
                        <ReactSelect
                          options={ShiftType}
                          onChange={(e) => {
                            handleShiftChange(e);
                            
                          }}
                          value={selectedShift}
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

                       <Grid item xs={2}>
                        <MDTypography variant="h6" color="white">
                          Entry of Blast&App stage Inspect
                        </MDTypography>
                      </Grid>
                      

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Show Elements">
                        <IconButton
                            color="white"
                            aria-label="toggle"
                            onClick={() => setExpanded(!expanded)}
                        >
                           {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                        </Tooltip>
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
                  {expanded && (
                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                    <Grid item xs={0.7}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          disabled={true}
                          noWrap
                        >
                          Nxt Proc*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="nxtproc"
                          disabled={true}
                          value={nxtproc}
                          readOnly={true}
                          onChange={(e) => setNxtproc()}
                        />
                      </Grid>
                      
                    <Grid item xs={0.7}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          disabled={true}
                          noWrap
                        >
                          Curr Proc*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="nxtproc2"
                          value={nxtproc2}
                          disabled={true}
                          onChange={(e) => setNxtproc2(e.target.value)}
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
                          Pipe Surface temperature*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="pipesurfacetemp"
                          value={pipesurfacetemp}
                          onChange={(e) => {
                            setPipeSurfaceTemp(e.target.value)
                            setTableNull()}}
                          
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
                          Order No*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="ordNo"
                          value={ordNo}
                          onChange={(e) => { 
                            setOrdNo(e.target.value)
                            setTableNull();
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
                          Order Item*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="ordItem"
                          value={ordItem}
                          onChange={(e) => {
                            setOrdItem(e.target.value)
                            setTableNull();
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
                          Cust Name*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="custName"
                          value={custName}
                          onChange={(e) => {setCustName(e.target.value)
                            setTableNull();
                          }}
                          
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
                          Result*
                        </MDTypography>
                        <ReactSelect
                          options={ResultType}
                          onChange={(e) => {
                            handleResultChange(e);
                            setTableNull();
                          }}
                          value={selectedResult}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => bindBlastAppData()}
                        >
                          Fill Data
                        </MDButton>
                      </Grid>
                     </Grid>
                  </MDBox>)}
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
                        Blast & App stage Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                                                    <IconButton color="white"  onClick={() => updateData()}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelBlastAppTableData()}
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
                      {getBlastAppTable?.length > 0 && <div id="BlastAppTableContainer" />}

                       
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getBlastAppTable.length} of{" "}
                          {getBlastAppTable.length} entries
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
