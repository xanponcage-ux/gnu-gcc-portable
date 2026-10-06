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

export default function MaxWidthDialogVDIR(props) {
  const [getVdirdata, setgetVdirdata] = useState([]);
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
              axiosAPI.post("api/LDCR001/getVdirdata", data, defaultOptions),
          ]).then(([getVdirdataResponse]) => {
            setgetVdirdata(getVdirdataResponse.data);
                console.log(getVdirdata);
                
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
    const numPages = Math.max(1, Math.ceil(getVdirdata?.length / rowsPerPage));

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
          {getVdirdata?.length === 0 && !loading ? (
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
                            style={{ textAlign: 'center', marginTop: '35px', fontSize: '12px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            ERW PIPE DIVISION - KHOPOLI<br />
                            VISUAL & DIMENSIONAL INSPECTION REPORT- (MILL NO.- {getVdirdata?.length > 0 && getVdirdata[0].MILL_NO !== null ? getVdirdata[0].MILL_NO : '  '} )
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '8px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-08 Rev 08,Date 25.06.2026
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
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].MARK_CUST_NAME : '  '} </p>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].ORDER_NO       : '  '}</p>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].PIPE_SIZE      : '  '}  </p>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].SPEC_GRADE     : '  '}  </p>
                              {/* <p>: {getVdirdata?.length > 0 ? getVdirdata[0].CD_GRADE       : '  '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].REP_NO : '  '} </p>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].CRT_DT_FORMAT : '  ' }</p>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].QAP_NO        : '  ' }</p>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].PROC_SHEET    : '  ' }</p>
                              <p>: {getVdirdata?.length > 0 ? getVdirdata[0].PROCEDURE_NO    : '  ' }</p>
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '8px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                    <Grid item xs={0.25}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SN</Grid>
                      <Grid item xs={0.90}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO.</Grid>
                      <Grid item xs={0.65} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>HEAT NO.</Grid>

                      <Grid item xs={0.85} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         DIA. (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>BD</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>E</Grid>
            </Grid>
            </Grid>

            <Grid item xs={0.85} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         ORR (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>BD</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>E</Grid>
            </Grid>
            </Grid>

            <Grid item xs={0.85} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         THK (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>BD</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>E</Grid>
            </Grid>
            </Grid>

            <Grid item xs={0.85} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         BEVEL (°)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>FE</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>TE</Grid>
            </Grid>
            </Grid>

            <Grid item xs={0.85} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         RTF (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>FE</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>TE</Grid>
            </Grid>
            </Grid>
            <Grid item xs={0.85} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         SQR (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>FE</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>TE</Grid>
            </Grid>
            </Grid>

            <Grid item xs={0.85} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         ST (MM)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>F</Grid>
            <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>E</Grid>
            </Grid>
            </Grid>


                      <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>IDF** <br/> (D/H)</Grid>
                      <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ECN <br/> (%)</Grid>
                      <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>R.O.E</Grid>
                      <Grid item xs={0.5} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>VIS <br/> & WM</Grid>
                      <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>LEN <br/> (MTR)</Grid>
                      <Grid item xs={0.5} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>W.* <br/> (KG/MTR)</Grid>
                      <Grid item xs={0.60} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ASL No.</Grid>
                      <Grid item xs={0.65} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REM</Grid>
                      
                      <Grid item xs={1.15} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Specified <br/> Requirement</Grid>
                      
                      <Grid container direction="column" item xs = {0.65}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        Min.
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        Max.
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.42}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIA_MTR_BODY_MIN !== null ? getVdirdata[0].DIA_MTR_BODY_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIA_MTR_BODY_MAX !== null ? getVdirdata[0].DIA_MTR_BODY_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.43}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIA_MTR_END_MIN !== null ? getVdirdata[0].DIA_MTR_END_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIA_MTR_END_MAX !== null ? getVdirdata[0].DIA_MTR_END_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.42}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].OOR_BODY_MAX !== null ? getVdirdata[0].OOR_BODY_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.43}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].OOR_END_MAX !== null ? getVdirdata[0].OOR_END_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.42}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].WALL_THK_MIN !== null ? getVdirdata[0].WALL_THK_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].WALL_THK_MAX !== null ? getVdirdata[0].WALL_THK_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.43}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].WALL_THK_MIN !== null ? getVdirdata[0].WALL_THK_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].WALL_THK_MAX !== null ? getVdirdata[0].WALL_THK_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.42}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIM_BEVEL_AG_MIN !== null ? getVdirdata[0].DIM_BEVEL_AG_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIM_BEVEL_AG_MAX !== null ? getVdirdata[0].DIM_BEVEL_AG_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.43}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIM_BEVEL_AG_MIN !== null ? getVdirdata[0].DIM_BEVEL_AG_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].DIM_BEVEL_AG_MAX !== null ? getVdirdata[0].DIM_BEVEL_AG_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.42}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].ROUT_FACE_MIN !== null ? getVdirdata[0].ROUT_FACE_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].ROUT_FACE_MAX !== null ? getVdirdata[0].ROUT_FACE_MAX : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.43}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].ROUT_FACE_MIN !== null ? getVdirdata[0].ROUT_FACE_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].ROUT_FACE_MAX !== null ? getVdirdata[0].ROUT_FACE_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.42}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].SQUARNESS !== null ? getVdirdata[0].SQUARNESS : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.43}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].SQUARNESS !== null ? getVdirdata[0].SQUARNESS : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.42}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].STRAIGHTNESS_FUL !== null ? getVdirdata[0].STRAIGHTNESS_FUL : <br/>}
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.43}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        -
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].STRAIGHTNESS_END !== null ? getVdirdata[0].STRAIGHTNESS_END : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].IB_DEPTH !== null ? getVdirdata[0].IB_DEPTH : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].IB_HEIGHT !== null ? getVdirdata[0].IB_HEIGHT : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].ECN !== null ? getVdirdata[0].ECN : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].PIPE_LEN_MIN !== null ? getVdirdata[0].PIPE_LEN_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].PIPE_LEN_MAX !== null ? getVdirdata[0].PIPE_LEN_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.5}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].MD_WEIGHT_MIN !== null ? getVdirdata[0].MD_WEIGHT_MIN : <br/>}
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      {getVdirdata?.length > 0 && getVdirdata[0].MD_WEIGHT_MAX !== null ? getVdirdata[0].MD_WEIGHT_MAX : <br/>}
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.60}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.65}>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      {/* {Array.from({length: getVdirdata?.length}).map((_, i) => ( */}
                      {getVdirdata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                            <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{pageIndex * rowsPerPage + i + 1} </Grid>
                            <Grid item xs={0.90} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>

                            
                            <Grid item xs={0.65} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.LOM_NO_CAST !== null       ? dataRow.LOM_NO_CAST : <br />}</Grid>
                            <Grid item xs={0.42} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.DIA_BODY_10 !== null       ? formatValue(dataRow.DIA_BODY_10): <br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.DIA_END_10 !== null        ? formatValue(dataRow.DIA_END_10) : <br />}</Grid>
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.OUT_ROUND_BODY_10 !== null ? formatValue(dataRow.OUT_ROUND_BODY_10) : <br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.OUT_ROUND_END_10 !== null  ? formatValue(dataRow.OUT_ROUND_END_10) : <br />}</Grid>                     
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.WALL_THK_BODY_10 !== null  ? formatValue(dataRow.WALL_THK_BODY_10) : <br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.WALL_THK_END_10 !== null   ? formatValue(dataRow.WALL_THK_END_10) : <br />}</Grid>                    
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.B_ANGL_F_END_80 !== null   ? formatValue0D(dataRow.B_ANGL_F_END_80) : <br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.B_ANGL_T_END_80 !== null   ? formatValue0D(dataRow.B_ANGL_T_END_80) : <br />}</Grid>                     
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ROOTFACE_F_END_80 !== null ? formatValue1D(dataRow.ROOTFACE_F_END_80) : <br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ROOTFACE_T_END_80 !== null ? formatValue1D(dataRow.ROOTFACE_T_END_80) : <br />}</Grid>                    
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.SQ_F !== null              ? formatValue1D(dataRow.SQ_F) : <br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.SQ_T !== null              ? formatValue1D(dataRow.SQ_T) : <br />}</Grid>                     
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ST_BODY !== null           ? formatValue0D(dataRow.ST_BODY) : <br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ST_END !== null            ? formatValue0D(dataRow.ST_END) : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.IDF !== null               ? dataRow.IDF : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ECN !== null               ? dataRow.ECN : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.RADICAL !== null  ? dataRow.RADICAL : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ID_BATCH !== null ? 'OK' : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.PIPE_LNG_10 !== null ? formatValue(dataRow.PIPE_LNG_10) : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.WEIGHT !== null ?  formatValue(dataRow.WEIGHT) : <br />}</Grid>
                            <Grid item xs={0.60} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.ASL_NO_80 !== null ? dataRow.ASL_NO_80 : <br />}</Grid>
                            <Grid item xs={0.65} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'  }}>{dataRow.REMARK !== null ? dataRow.REMARK : <br />}</Grid>
                         </Grid>
                      ))}



{Array.from({ length: Math.max(0, rowsPerPage - getVdirdata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>
                            <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />} </Grid>
                            <Grid item xs={0.90} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>

                            
                            <Grid item xs={0.65} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                     
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                    
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                     
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                    
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>                     
                            <Grid item xs={0.42} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.43} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.60} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{<br />}</Grid>
                            <Grid item xs={0.65} style={{fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'  }}>{<br />}</Grid>
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
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_MM_0_25    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>2</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>OD Micrometer</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_OD_MM    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>3</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Measuring Tape</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_MESR_TAPE    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>4</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Pie Tape</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_PIPE_TAPE1    : '  ' }</Grid>

                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>5</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>D Meter</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_D_METR    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>6</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Vernier Calliper</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_VER_CALLIPR1    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>7</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Steel Scale</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_STL_SCALE    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>8</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Filler Gauge</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_FILL_G_2    : '  ' }</Grid>

                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>9</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Angle Protractor</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_ANG_PROTC    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>10</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Root Face Gauge</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_ROOT_FC_G    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>11</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Right Angle</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].TPS_ID_RGHT_ANG    : '  ' }</Grid>
                      <Grid item xs={0.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>12</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>Weighing Machine</Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' }}>{getVdirdata?.length > 0 ? getVdirdata[0].WGH_MC_ID    : '  ' }</Grid>

                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>


          
                    <Grid style={{  textAlign: 'center',fontSize: '10px', color: 'black', fontFamily: "Times New Roman", border: '1px solid black', padding: '3px' }}>
                        ABBREVIATION
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Arial", padding: "2px"}}>
                    
                       <Grid item xs = {12}>TE-TAIL END, FE-FRONT END, F-FULL LENGTH, E-ENDS, VIS-VISUAL, BD-BODY, OOR-OUT OF ROUNDNESS, THK-WALL THICKNESS, RTF-ROOT FACE, SQR-SQUARENESS, <br/>
                        ST-STRAIGHTNESS, LEN-LENGTH, OD-OUTER DIA METER, ID-INNER DIA METER, IDF - ID BEAD FLASH, ECN-ECCENTRICITY, ROE-RADIAL OFFSET OF EDGE, D- DEPTH,<br/>
                         H-HEIGHT, WM- WORKMANSHIP, W - WEIGHT, MIN- MINIMUM, MAX - MAXIMUM, REM- REMARKS</Grid>
                         <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}> * THE NOMINAL MASS OF A PIPE IS THE PRODUCT OF ITS LENGTH AND ITS MASS PER UNIT LENGTH </Grid>
                       <Grid item xs = {12}>OBSERVED LIGHT INTENSITY -</Grid>
                       <Grid item xs = {12}> MARKING ARE VERIFIED AS PER PROCESS SHEET NO. {getVdirdata?.length > 0 ? getVdirdata[0].PROC_SHEET    : '  ' } AND FOUND OK</Grid>
                       <Grid item xs = {12}> ALL ABOVE PIPES ARE CONFORMING TO SPECIFICATION {getVdirdata?.length > 0 ? getVdirdata[0].SPEC_GRADE    : '  ' }  & QAP NO.  {getVdirdata?.length > 0 ? getVdirdata[0].QAP_NO    : '  ' } </Grid>
                       <Grid item xs = {12}>AND RELEASE FOR</Grid>
                       <Grid item xs = {12}>** IDF Height/Depth - Unit of measurement is mm</Grid>
                       {/* <Grid item xs = {12}><br/></Grid> */}
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                       <Grid item xs = {12}><br/></Grid>
                       
                       <Grid item xs = {0.25}><br/></Grid>
                       <Grid item xs = {3.75}> ENGINEER(QC) <br/> Name:{getVdirdata?.length > 0 ? getVdirdata[0].TESTED_BY    : '  ' }</Grid>
                       <Grid item xs = {6}><br/></Grid>
                       <Grid item xs = {2}> Inspection Authority</Grid>
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