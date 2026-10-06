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
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import ReactSelect from "components/Select/ReactSelect";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import alertify from "alertifyjs";
import Tata_Round_Blue_Logo from "../../../assets/img/Tata_Round_Blue_Logo.png"
import tatasteellimited from "../../../assets/img/tatasteellimited.jpeg"
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";
import Preloader from "components/Preloader/Preloader";
import logo from "../../../assets/img/Tata_White.png";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import FindInPageIcon from "@mui/icons-material/FindInPage";;
import Barcode from 'react-barcode';
import ReactToPrint from 'react-to-print';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import QRCode from "react-qr-code";
import { GetAuthorization } from "utils";
import { Zoom } from "@mui/material";

export default function MaxWidthDialogVDIRS(props) {
  const [getVdirSdata, setgetVdirSdata] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [reqType, setReqType] = React.useState({
    value: "S",
    label: "STOCK TRANSFER",
  });
  const [initialLoad, setInitialLoad] = useState(false);
  const [sourcePlantList, setSourcePlantList] = React.useState([]);

  const [sourcePlant, setSourcePlant] = React.useState([]);
  const [crTableData, setCRTableData] = useState([]);
  const [crTable, setCRTable] = useState(null)
  const reqTypeOptions = [
    { value: "S", label: "STOCK TRANSFER" },
    { value: "P", label: "PURCHASE" },
  ];
  const [loading, setLoading] = React.useState(false);
  const [plant, setPlant] = useState([]);
  const [sfgData, setSfgData] = useState([]);
  const currentDate = DateTime.now().toFormat('dd.MM.yyyy');

  useEffect(() => {
    if (props.open) {
        let varData = [];
        if (Array.isArray(props.inputValues)) {
            props.inputValues.forEach((x) => {
                if (x.ID_BATCH) {
                    varData.push(x.ID_BATCH);
                }
            });
        }

        
        let formattedPipeno = [];
        if (props.pipeno && props.pipeno.from && Array.isArray(props.pipeno.from)) {
          formattedPipeno = props.pipeno.from.map(arr => arr[0]);
        }

        const data = {
          plant: props?.plant?.value ? props.plant.value : "",
          orderNo: props.orderNo ? props.orderNo : "",
          item: props.item ? props.item : "",
          matno: props.matno ? props.matno : "",
          shift: props.shift ? props.shift : "",
          // crdate: props.crdate ? props.crdate : "",  // Ensure crdate is included
          crdate: props.crdate
          ? props.crdate
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
              .replace(/ /g, "-")
              .replace("Sept", "Sep")
          : "",  
          heatno: props.heatno ? props.heatno : "",
          // pipeno: props.pipeno ? props.pipeno : "",
          pipeno: formattedPipeno,  //
        };

        GetAuthorization().then((token) => {
            const defaultOptions = {
                headers: {
                    Authorization: "Bearer " + token.accessToken,
                },
            };
            setLoading(true);
            Promise.all([
              axiosAPI.post("api/LDCR001/getVdirSdata", data, defaultOptions),
          ]).then(([getVdirSdataResponse]) => {
            setgetVdirSdata(getVdirSdataResponse.data);
                console.log(getVdirSdata);
                
                setInitialLoad(true);
            }).finally(() => {
                setLoading(false);
            });
        }).catch((error) => {
            console.error("Authorization error:", error);
            setLoading(false);
        });
    }
}, [props.open]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    //setOpen(false); 
    props.close(false);
  };

  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tcm_accessToken"),
        },
      };
      var url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tcm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tcm_accessToken", response.data.accessToken);
            localStorage.setItem(
              "tcm_refreshToken",
              response.data.refreshToken
            );
            resolve(response.data);
          }
        });
    });

  const componentRef = React.useRef();
  //const pageStyle = `
  const pageStyle = `
  @page {
    size: A4 landscape;
    margin: 4mm;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      zoom: 100%;
    }
    .print-page {
      page-break-after: always; /* Forces a page break after each .print-page div */
      position: relative; /* Add this to make it a positioning context for absolute children */
    }
    .print-page:last-child {
      page-break-after: avoid; /* Prevents an extra blank page at the end */
    }
  }
  `;
  
    const rowsPerPage = 15;
    const numPages = Math.max(1, Math.ceil(getVdirSdata?.length / rowsPerPage));


  function formatValue(value) {
    return value !== null ? parseFloat(value).toFixed(2) : <br />;
  }

  function formatValue1D(value) {
    return value !== null ? parseFloat(value).toFixed(1) : <br />;
  }

  function formatValue0D(value) {
    return value !== null ? parseFloat(value).toFixed(0) : <br />;
  }

//   const qrValue = () => {
//     var val = "";
//     val = props.inputValues().EOM_ID_BATCH + "," + Number(props.inputValues().EOM_ODIA).toFixed(2) + "," + Number(props.inputValues().EOM_IDIA).toFixed(2)
//       + "," + Number(props.inputValues().EOM_SEC1).toFixed(2).toFixed(2)
//       + "," + Number(props.inputValues().EOM_LENGTH).toFixed(2).toFixed(2)
//       + Number(props.inputValues().EOM_ID_ORDER);

//     return val;
//   }

//   const cDate = () => {
//     let varDate = new Date()
//     return varDate.getDate()?.toString() + '/' + (varDate.getMonth()?.toString()?.length > 1 ? varDate.getMonth() : '0' + varDate.getMonth()) + '/' + varDate.getFullYear()?.toString()
//   }
//   console.log(props?.inputValues())
  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogContent>
          {loading && <Preloader />}
          {getVdirSdata?.length === 0 && !loading ? (
            <MDBox
           sx={{
             display: 'flex',
             flexDirection: 'column', // Arrange items vertically
             alignItems: 'center',
             justifyContent: 'center',
             height: '400px',
             width: '100%',
             textAlign: 'center', // Center text within the box
             backgroundColor: 'rgba(255, 0, 0, 0.05)', // A very subtle red background
             borderRadius: '8px',
             border: '1px dashed #ef5350', // A dashed red border
             p: 3, // Padding
           }}
         >
           <SentimentDissatisfiedIcon fontSize="large" sx={{  color: 'error.main', mb: 2 }} /> {/* Larger icon */}
           <MDTypography
             variant="h3" // Slightly larger and more prominent heading
             color="error"
             fontWeight="bold"
             mb={1} // Margin bottom for spacing
           >
             No Records Found
           </MDTypography>
           <MDTypography
             variant="body2" // Subtitle for more detail
             color="textSecondary" // A softer color for the subtitle
           >
            <br />
             It seems there's no data matching your criteria at the moment.
             <br />
             Please adjust your Filters and try again!
           </MDTypography>
         </MDBox>
          ) : (
          <MDBox px={3} py={1} 
          ref={componentRef}
          style={{ display: 'block' }}>
                                                {Array.from({ length: numPages }).map((_, pageIndex) => (
<div key={pageIndex} className="print-page">
           <div className="print-container">
              <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
              src={tatasteellimited}
              alt="TatasteellimitedLogo"
              style={{
                position: 'absolute',
                top: 10,
                left: 22,
                height: '20px', // Adjust the height as needed
                margin: '20px' // Adjust the margin as needed
              }}
            />
              <img
              src={Tata_Round_Blue_Logo}
              alt="Tata Logo"
              style={{
                position: 'absolute',
                top: 18,
                right: 40,
                height: '20px', // Adjust the height as needed
                margin: '10px' // Adjust the margin as needed
              }}
            />
<Grid container style={{ height: 'auto', width: '100%', justifyContent: 'center', display: 'flex', border: '1px solid black', padding: 'px' }}>

                        <Grid item xs={12}>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'center', marginTop: '45px', fontSize: '14px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            ERW PIPE DIVISION - KHOPOLI <br />
                            VISUAL & DIMENSIONAL INSPECTION REPORT-SECTION (MILL NO.- {getVdirSdata?.length > 0 && getVdirSdata[0].MILL_NO !== null ? getVdirSdata[0].MILL_NO : '  '} )
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '8px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-08A,Rev 05,Date 25.06.2026
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                              <p>Client         </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade  </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderleft: '1px solid black' }}>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].MARK_CUST_NAME : '  '} </p>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].ORDER_NO       : '  '}</p>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].PIPE_SIZE      : '  '}  </p>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].SPEC_GRADE     : '  '}  </p>
                              {/* <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].GRADE       : '  '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].REP_NO : '  '} </p>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].CRT_DT : '  ' }</p>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].QAP_NO        : '  ' }</p>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].PROC_SHEET    : '  ' }</p>
                              <p>: {getVdirSdata?.length > 0 ? getVdirSdata[0].PROCEDURE_NO    : '  ' }</p>
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '8px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                      <Grid item xs={0.25}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SN</Grid>
                      <Grid item xs={1}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO.</Grid>
                      <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>HEAT NO.</Grid>

                      <Grid item xs={1} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         DEPTH (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>D1</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>D2</Grid>
            </Grid>
            </Grid>

            <Grid item xs={1} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         WIDTH (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>W1</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>W2</Grid>
            </Grid>
            </Grid>

            <Grid item xs={1} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         THK (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>T1</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>T2</Grid>
            </Grid>
            </Grid>

            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ROC <br/> (MM)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ST <br/> (MM)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>TW. <br/> (MM)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CONVEX<br/> (MM)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CONVT.<br/> (MM)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>IBH<br/> (MM)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SOC<br/> (°)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>VIS <br/> & WM</Grid>
            <Grid item xs={0.6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>LEN <br/> (MTR)</Grid>
            <Grid item xs={0.6} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>W.<br/> (KG/MTR)</Grid>
            <Grid item xs={1}   style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REM</Grid>


            <Grid item xs={1.25} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Specified <br/> Requirement</Grid>
                      <Grid container direction="column" item xs = {0.75}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                        Min.
                      </Grid>
                      <Grid item xs={0.64} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                        Max.
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].DEPTH_MIN !== null ? getVdirSdata[0].DEPTH_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].DEPTH_MAX !== null ? getVdirSdata[0].DEPTH_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].DEPTH_MIN !== null ? getVdirSdata[0].DEPTH_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].DEPTH_MAX !== null ? getVdirSdata[0].DEPTH_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WIDTH_MIN !== null ? getVdirSdata[0].WIDTH_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WIDTH_MAX !== null ? getVdirSdata[0].WIDTH_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WIDTH_MIN !== null ? getVdirSdata[0].WIDTH_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WIDTH_MAX !== null ? getVdirSdata[0].WIDTH_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WALL_THK_MIN !== null ? getVdirSdata[0].WALL_THK_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WALL_THK_MAX !== null ? getVdirSdata[0].WALL_THK_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WALL_THK_MIN !== null ? getVdirSdata[0].WALL_THK_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WALL_THK_MAX !== null ? getVdirSdata[0].WALL_THK_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].ROC_MIN !== null ? getVdirSdata[0].ROC_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].ROC_MAX !== null ? getVdirSdata[0].ROC_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].STRAIGHTNESS !== null ? getVdirSdata[0].STRAIGHTNESS : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].TWIST !== null ? getVdirSdata[0].TWIST : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].CONVEX !== null ? getVdirSdata[0].CONVEX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].CONCAV !== null ? getVdirSdata[0].CONCAV : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].IB_DEPTH !== null ? getVdirSdata[0].IB_DEPTH : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].IB_HEIGHT !== null ? getVdirSdata[0].IB_HEIGHT : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].SQOC_MIN !== null ? getVdirSdata[0].SQOC_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].SQOC_MAX !== null ? getVdirSdata[0].SQOC_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].PIPE_LEN_MIN !== null ? getVdirSdata[0].PIPE_LEN_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].PIPE_LEN_MAX !== null ? getVdirSdata[0].PIPE_LEN_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WEIGHT_MIN !== null ? getVdirSdata[0].WEIGHT_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      {getVdirSdata?.length > 0 && getVdirSdata[0].WEIGHT_MAX !== null ? getVdirSdata[0].WEIGHT_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {1}>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      {/* {Array.from({length: getVdirSdata?.length}).map((_, i) => ( */}
                      {getVdirSdata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                            <Grid item xs={0.25}style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                            <Grid item xs={1}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>
                            <Grid item xs={0.75}style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.HEAT_NO !== null ? dataRow.HEAT_NO : <br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.DEPTH_MIN_80 !== null ? formatValue0D(dataRow.DEPTH_MIN_80) : <br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.DEPTH_MAX_80 !== null ? formatValue0D(dataRow.DEPTH_MAX_80) : <br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.WID_MIN_80 !== null   ? formatValue0D(dataRow.WID_MIN_80) : <br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.WID_MAX_80 !== null   ? formatValue0D(dataRow.WID_MAX_80) : <br />}</Grid>                     
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.WALL_THK_BODY_10 !== null ? formatValue(dataRow.WALL_THK_BODY_10) : <br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.WALL_THK_END_10 !== null ?  formatValue(dataRow.WALL_THK_END_10) : <br />}</Grid>                    
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.ROC_10 !== null ?          formatValue0D(dataRow.ROC_10) : <br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.STRGHTNES_F_END !== null ? formatValue0D(dataRow.STRGHTNES_F_END) : <br />}</Grid>                     
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.TWIST_10 !== null ?        formatValue0D(dataRow.TWIST_10) : <br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.CONVX_10 !== null ?        formatValue0D(dataRow.CONVX_10) : <br />}</Grid>                    
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.CONCV_10 !== null ?        formatValue0D(dataRow.CONCV_10) : <br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.ID_FLASH_10 !== null ?    formatValue1D(dataRow.ID_FLASH_10) : <br />}</Grid>                     
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.SQOC_10 !== null ?        formatValue0D(dataRow.SQOC_10) : <br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.VISUAL_INSP_80 !== null ? dataRow.VISUAL_INSP_80 : <br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.PIPE_LNG_10 !== null ?    formatValue(dataRow.PIPE_LNG_10) : <br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.WEIGHT !== null ?         formatValue(dataRow.WEIGHT) : <br />}</Grid>
                            <Grid item xs={1}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> {dataRow.REMARK !== null ? dataRow.REMARK : <br />}</Grid>
                         </Grid>
                      ))}


{Array.from({ length: Math.max(0, rowsPerPage - getVdirSdata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>
                            <Grid item xs={0.25}style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}> { <br />}</Grid>
                            <Grid item xs={0.75}style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={1}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                     
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                    
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                     
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                    
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                     
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={1}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                         </Grid>
                      ))}

                      <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}><br/></Grid>

                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>SN</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Instrument Name</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>ID No.</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>SN</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Instrument Name</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>ID No.</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>SN</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Instrument Name</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>ID No.</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>SN</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Instrument Name</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>ID No.</Grid>

<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>1</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Micro Meter (0-25 MM)</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].ID_MM_0_25    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>2</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>OD Micrometer</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].ID_OD_MM    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>3</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Measuring Tape</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].MESR_TAPE    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>4</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Pie Tape</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].PIPE_TAPE1    : '  ' }</Grid>

<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>5</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>D Meter</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].D_METR    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>6</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Vernier Calliper</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].VER_CALLIPR1    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>7</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Steel Scale</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].STL_SCALE    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>8</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Filler Gauge</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].FILL_G_2    : '  ' }</Grid>

<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>9</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Angle Protractor</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].ANG_PROTC    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>10</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Root Face Gauge</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].ROOT_FC_G    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>11</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Right Angle</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].RGHT_ANG    : '  ' }</Grid>
<Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>12</Grid>
<Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Weighing Machine</Grid>
<Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirSdata?.length > 0 ? getVdirSdata[0].WEIGHING_MC_ID    : '  ' }</Grid>


                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>


          
                    <Grid style={{  textAlign: 'center',fontSize: '10px', color: 'black', fontFamily: "Times New Roman", border: '1px solid black', padding: '3px' }}>
                        ABBREVIATION
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Arial", padding: "2px"}}>
                    
                       <Grid item xs = {12}>SOC-SQUARNESS OF CORNER, ROC - RADIUS OF CORNER, VIS - VISUAL, THK - THICKNESS, LEN-LENGTH, TW- TWIST, CONVX-CONVEXITY, CONVT-CONCAVITY, ST-STRAIGHTNESS,<br/>
                        IBH-HEIGHT OF INSIDE BEAD, WM-WORKMANSHIP, WT-WEIGHT, MIN-MINIMUM, MAX MAXIMUM, REM - REMARKS</Grid>
                         <Grid item xs = {12}><br/></Grid>
                    <Grid item xs = {12} style={{fontFamily: "ArialBold", fontWeight: 'bold'}}>  </Grid>
                       <Grid item xs = {12}><br/></Grid>
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {0.25}><br/></Grid>
                       <Grid item xs = {3.75}> ENGINEER(QC) <br/> Name : {getVdirSdata?.length > 0 ? getVdirSdata[0].TESTED_BY    : '  ' }</Grid>
                       <Grid item xs = {6}><br/></Grid>
                       <Grid item xs = {2}> Inspection Authority</Grid>
                       <Grid item xs = {12}><br/></Grid>
                    </Grid>

                  </Grid>       
                            
                            <Grid item xs={1}></Grid>
                          </Grid>
                        </Grid>
                      </Grid>

              </div>
              </div>
              </div>
              ))}
          </MDBox>
           )}

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem" }}
          >
            <Button onClick={handleClose}>Close</Button>
            <ReactToPrint
              trigger={() => <MDButton size="small" color="info" >
                Print
              </MDButton>}
              content={() => componentRef.current}
              pageStyle={pageStyle}
            />
          </Grid>
        </DialogContent>
        
      </Dialog>
    </React.Fragment >
  );
}