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
  
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [pipeNo, setPipeNo] = useState("");
  const [prodOrdNo, setProdOrdNo] = useState("");
  const [nxtproc, setNxtproc] = useState("100");
  const [nxtproc2, setNxtproc2] = useState("BLASTING");
  const [visualinspect, setVisualInspect] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedProcessDt, setSelectedProcessDt] = useState(null);
  const [time, setTime] = useState("");
  const [inspectorname, setInspectorName] = useState("");
  const [result, setResult] = useState("");
  const [selectedResult, setSelectedResult] = React.useState([]);
  const [selectedShift, setSelectedShift] = React.useState([]);  const [getInletTable, setInletTable] = useState([]);
  const [selectedInletTable, setSelectedInletTable] = useState(null);
  
  

  

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
      var pageName = "LDSM021";
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


    const updateData = async () => {
      
      console.log('hello')
      if (selectedHydraTable.getSelectedRows()?.length === 0) {
        alertify.error('Please Select Rows to Update');
        return;
      }
      
    let tableSelect = selectedHydraTable.getSelectedRows();
    let selectedData = tableSelect.map((row) => row?._row?.data);
   
    
      let data = {
           
           
           plant : '078',
           adid: serverDetails.PersonalNo,
           status: '1C',
           batchprocno : 3,
           currproc : nxtproc2 ? nxtproc2 : '',
           salesordno : salesOrdNo ? salesOrdNo : '',
           prodordno : prodOrdNo ? prodOrdNo : '',
           shift : shift ? shift : '',
          //  shiftdt: selectedShiftDt ? selectedShiftDt  : "",
            shiftdt: selectedShiftDt
              ? selectedShiftDt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
              : "",
           issexBatch : issexBatch ? issexBatch : "",
           material : material ? material : "",
           rowData: selectedData,
           

      };

    
      console.log("frontend",data)
      const url =  "api/LDS030/UpdateHydraData";
      
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
  
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              
              alertify.error("Error in Procedure");
              //setE1Table([,]);
            } else {
              var res= response.data[0]
              if (res[0] == 'N' ) {
                console.log("msg",res[0])
                alertify.error("Row Insertion Failed");
                //setE1Table([,]);
              } else {
                
                alertify.success("Row Inserted Successfully !!!");
  
              }
            }
          })
          
        
      });
    };

    
   

 


  

const handleClearAll = (newToken = false) => {
    
    setVisualInspect("");
    setRemarks("");
    setSelectedProcessDt(null);
    setTime("");
    setInspectorName("");
    setSelectedResult("");
    setSelectedShift("");    
    setInletTable([])
    selectedInletTable(null)
    
    };

  const handleClearMain = (newToken = false) => {
    setSalesOrdNo("")
    setPipeNo("")
    setProdOrdNo("")
    
   
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value)
   
  };
  
  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ];

  
  const fillData = async () => {
    

    var data = {

      nxtproc : nxtproc ? nxtproc : "",
      nxtproc2 : nxtproc2 ? nxtproc2 : "",
      prodOrdNo: prodOrdNo ? prodOrdNo : "" ,
      pipeNo : pipeNo ? pipeNo : "",
      visualinspect : visualinspect ? visualinspect : "",
      remarks : remarks ? remarks : "",
      processdt : selectedProcessDt ? selectedProcessDt : "",
      time : time ? time : "",
      inspectorname : inspectorname ? inspectorname : "",
      shift : selectedShift ? selectedShift : "",      

    };

    if (data.prodOrdNo == "" || data.pipeNo == "" ||data.nxtproc == "" || data.nxtproc2 == "" || data.visualinspect == "" || data.remarks == ""  ||  data.processdt == "" || data.time == "" || data.inspectorname == "" || data.shift == "" ) {
      alertify.error("Please Fill Mandatory Fields");
      return;
    }
    const dummyData = await bindInletData();
    const table = new Tabulator("#InletTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: dummyData, 
        columns: InletColumns,
        height: 400,
        layout: "fitDataFill",
      });

      
      setSelectedInletTable(table)
      
      return;
    };

  
    const bindInletData = () => {
      const dummyData = Array.from({ length: 10 }).map(() => {
          const currentDate = new Date();
  
          
          const formatDateToDDMMYYYY = (date) => {
              if (!date) return "";
              const d = new Date(date);
              const day = String(d.getDate()).padStart(2, '0');
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const year = d.getFullYear();
              return `${day}-${month}-${year}`;
          };
  
          const formattedDate = formatDateToDDMMYYYY(currentDate); 
          const formattedTime = currentDate.toTimeString().split(" ")[0];
          
          
          
          
           
  
          return {
              
              SR_NO : '',
              C_PROC : '90',
              N_PROC : nxtproc ? nxtproc : "",
              PIPE_NO: pipeNo ? pipeNo : "",
              ASL_NO : '',
              LENGTH : '',
              HEAT_NO : '',
              RESULT: selectedResult.label ? selectedResult.label : "",
              VISUAL_INSPECT : visualinspect ? visualinspect : "",
              REMARKS : remarks ? remarks : "",
              INSPECT_NAME : inspectorname ? inspectorname : "",
              WEIGHT : '',
              PROCESS_DT: selectedProcessDt
              ? selectedProcessDt
             .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              })
            .replace(/ /g, "-").replace("Sept", "Sep")
              : "",
              TIME : time ? time : "",
              MATERIAL : '',
              
              
              

          };
      });
      return dummyData;
      //setHydraTable(dummyData);
  };

  const handleResultChange = (value) => {
    setSelectedResult(value)
   
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];

  const InletColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Sr No",
      field: "SR_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "C Prc",
      field: "C_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "N Prc",
      field: "N_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
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
      title: "ASL No",
      field: "ASL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Heat No",
      field: "HEAT_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
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
          "ok": "OK",
          "notok": "NOT OK",
          "hold": "HOLD"
        }
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Visual",
      field: "VISUAL_INSPECT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },

    {
      title: "Inspector",
      field: "INSPECT_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Weight",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
   
    {
      title: "Process Dt",
      field: "PROCESS_DT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
    
    
    {
      title: "Material",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
   
      
     
  ];

  const downloadExcelInletTableData = () => {
    console.log("Downloading");
    if (selectedInletTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedInletTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDS090" + ".xlsx";

    window.XLSX = XLSX;

    selectedInletTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };


  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Inlet stage inspection (90)"
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
                          Sales Order No
                        </MDTypography>
                        <MDInput
                          label=""
                          name="salesordno"
                          value={salesOrdNo}
                          onChange={(e) => setSalesOrdNo(e.target.value)}
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
                          Pipe No
                        </MDTypography>
                        <MDInput
                          label=""
                          name="pipeNo"
                          value={pipeNo}
                          onChange={(e) => setPipeNo(e.target.value)}
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
                          Production Order No*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="prodOrd"
                          value={prodOrdNo}
                          onChange={(e) => setProdOrdNo(e.target.value)}
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
                          Entry of Inlet stage Inspection
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
                      
                    <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Nxt Proc*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="nxtproc"
                          value={nxtproc}
                          disabled={true}
                          onChange={(e) => setNxtproc(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={1.5} mt={3}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          
                        </MDTypography>
                        <MDInput
                          label=""
                          name="nxtproc2"
                          value={nxtproc2}
                          disabled={true}
                          onChange={(e) => setNxtproc2(e.target.value)}
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
                          Inspector*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="inspectorname"
                          value={inspectorname}
                          onChange={(e) => setInspectorName(e.target.value)}
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
                          Result*
                        </MDTypography>
                        <ReactSelect
                          options={ResultType}
                          onChange={handleResultChange}
                          value={selectedResult}
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
                          Visual Inspection*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="visualinspect"
                          
                          value={visualinspect}
                          onChange={(e) => setVisualInspect(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                            <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap > Date of process* </MDTypography>
                            <DatePicker id="prcdt" value={selectedProcessDt} onChange={(date) => setSelectedProcessDt(date)} />
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
                          Time*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="time"
                          
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                        />
                      </Grid>

                     
                      
                      
                      <Grid item xs={1.3}>
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
                          onChange={handleShiftChange}
                          value={selectedShift}
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
                       Remarks*
                      </MDTypography>
                      <MDInput
                       label=""
                       name="remarks"
                      
                       value={remarks}
                       onChange={(e) => setRemarks(e.target.value)}
                         />
                      </Grid>
                      
                       
                      
                    
                      
                     
                      <Grid item xs={1}>
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
                        Inlet stage Data
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
                            onClick={() => downloadExcelInletTableData()}
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
                        <div id="InletTableContainer" />

                       
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getInletTable.length} of{" "}
                          {getInletTable.length} entries
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
