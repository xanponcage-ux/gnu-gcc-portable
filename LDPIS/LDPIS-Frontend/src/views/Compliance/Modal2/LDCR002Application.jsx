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

export default function MaxWidthDialogapplication(props) {
  const [getapplication, setgetapplication] = useState([]);
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

  // const { reviewedBy  } = props
      const { reviewedBy, instrumentName, instrumentId, wiNo ,repairmat } = props;

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
          pipeno: props.pipeno ? props.pipeno : "",
          // rmno: props.rmno ? props.rmno : "",  //
        };

        GetAuthorization().then((token) => {
            const defaultOptions = {
                headers: {
                    Authorization: "Bearer " + token.accessToken,
                },
            };
            setLoading(true);
            Promise.all([
              axiosAPI.post("api/LDCR002/getapplicationdata", data, defaultOptions),
          ]).then(([getapplicationResponse]) => {
            setgetapplication(getapplicationResponse.data);
                console.log(getapplication);
                
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
  
    const rowsPerPage = 3;
    const numPages = Math.max(1, Math.ceil(getapplication?.length / rowsPerPage));

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
        {/* <DialogTitle>{props.type} Print Label</DialogTitle> */}
        <DialogContent>
          {loading && <Preloader />}
          {getapplication?.length === 0 && !loading ? (
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
                top: 7,
                left: 12,
                height: '30px', // Adjust the height as needed
                margin: '10px' // Adjust the margin as needed
              }}
            />
              <img
              src={Tata_Round_Blue_Logo}
              alt="Tata Logo"
              style={{
                position: 'absolute',
                top: 12,
                right: 20,
                height: '30px', // Adjust the height as needed
                margin: '7px' // Adjust the margin as needed
              }}
            />



<Grid container style={{ height: 'auto', width: '100%', justifyContent: 'center', display: 'flex', border: '1px solid black', padding: 'px' }}>
                      

                        <Grid item xs={12}>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'center', marginTop: '55px', fontSize: '16px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            PIPE COATING DIVISION <br />
                            CHROMATE & COATING APPLICATION INSPECTION REPORT
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '12px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                           FORMAT NO : TSL/COAT/QC/F-52 Rev 03,Date 19.01.2023            _
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={1.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                              <p>Client        </p>  
                              <p>PO.No.         </p>
                              <p>Specification  </p>
                              <p>Acceptance Criteria</p>
                              <p>Process Sheet No</p>

                              {/* <p>Acceptance Criteria</p>
                              <p>Process Sheet No</p> */}
                              {/* <p>Pipe Size           </p>  */}
                              
                              {/* <p>Type of Coating  </p> */}
                            </Grid>
                            <Grid item xs={5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderleft: '1px solid black' }}>
                              <p>: {getapplication?.length > 0 ? getapplication[0].CLIENT : ' '} </p>
                              <p>: {getapplication?.length > 0 ? getapplication[0].PO_REF_NO : ' '}</p>
                              <p>: {getapplication?.length > 0 ? getapplication[0].SPEC : ' '}  </p>
                              <p>: {getapplication?.length > 0 ? getapplication[0].ACCEPTANCE_CRITERIA : ' '}  </p>
                              <p>: {getapplication?.length > 0  ? getapplication[0].PROCESS_SHEET_NO : ' '} </p>
                              {/* <p>: {getapplication?.length > 0  ? getapplication[0].ACCEPTANCE_CRITERIA : ' '} </p>
                              <p>: {getapplication?.length > 0 ? getapplication[0].PROCESS_SHEET_NO : ' '} </p> */}
                              
                              {/* <p>: {getapplication?.length > 0 ? getapplication[0].TYPE_OF_COATING : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={1.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date & Shift           </p>
                              <p>Pipe Size</p>
                              <p>Type of Coating  </p>
                              <p>Procedure/WI No.     </p>
                              {/* <p>Date of Coating   </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {getapplication?.length > 0  ? `${getapplication[0].REP_NO}-${pageIndex + 1}`: ' '} </p>
                              <p>: {getapplication?.length > 0  ? getapplication[0].DATE_SHIFT : ' '} </p>
                              <p>: {getapplication?.length > 0  ? getapplication[0].PIPE_SIZE : ' '} </p>
                              <p>: {getapplication?.length > 0  ? getapplication[0].TYPE_OF_COATING : ' '} </p>
                               <p>: {props?.wiNo} </p> 
                              {/* <p>: {getapplication?.length > 0  ? getapplication[0].PROCEDURE_WI_NO : ' '} </p> */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>    
                          {/* <Grid item xs={2.5} colSpan={6} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                            <Grid container>
                                  <Grid item xs={12} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                  PIPE DATA
                                  </Grid>
                                  <Grid item xs={2} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>SR.NO.</Grid>
                                  <Grid item xs={5} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>PIPE NO</Grid>
                                  <Grid item xs={5} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>ASL NO</Grid>
                            </Grid>
                           </Grid>  
                           <Grid item xs={3} colSpan={6} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                            <Grid container>
                                  <Grid item xs={12} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                  CHROMATE APPLICATION
                                  </Grid>
                                  <Grid item xs={4} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>PIPE TEMP BEFORE CHROMATE (°C)</Grid>
                                  <Grid item xs={4} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>VISUAL OF CHROMATE APPLICATION</Grid>
                                  <Grid item xs={4} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>CHROMATE SOLUTION TEMP (°C)</Grid>
                            </Grid>
                           </Grid>  
                          <Grid item xs={6.5} colSpan={6} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                            <Grid container>
                                  <Grid item xs={12} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                  COATING APPLICATION
                                  </Grid>
                                  <Grid item xs={1.75} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>PIPE TEMP AFTER CHROMATE APPLICATION (°C)</Grid>
                                  <Grid item xs={1.75} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>PIPE TEMP BEFORE FBE APPLICATION (°C)</Grid>
                                  <Grid item xs={1.75} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>ADHESIVE FILM Temp. (°C)</Grid>
                                  <Grid item xs={1.75} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>PE/PP FILM Temp. (°C)</Grid>
                                  <Grid item xs={1.75} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>WATER TEMP BEFORE QUENCHING</Grid>
                                  <Grid item xs={1.75} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>WATER TEMP AFTER QUENCHING</Grid>
                                  <Grid item xs={1.5} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>REMARK</Grid>
                            </Grid>
                           </Grid>   */}


                    <Grid container xs = {12} >
                      <Grid item xs={2.17}    style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE DATA</Grid>
                      <Grid item xs={2.9}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CHROMATE APPLICATION</Grid>
                      <Grid item xs={6.93}    style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>COATING APPLICATION</Grid>

                      <Grid item xs={0.5}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SR.NO.</Grid>
                      <Grid item xs={1}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO</Grid>
                      <Grid item xs={0.67}    style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ASL NO</Grid>
                                                

                      <Grid item xs={1}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE TEMP BEFORE CHROMATE (°C)</Grid>
                      <Grid item xs={1}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>VISUAL OF CHROMATE APPLICATION</Grid>
                      <Grid item xs={0.9}      style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CHROMATE SOLUTION TEMP (°C)</Grid>

                      <Grid item xs={0.99}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE TEMP AFTER CHROMATE APPLICATION (°C)</Grid>
                      <Grid item xs={0.99}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE TEMP BEFORE FBE APPLICATION (°C)</Grid>
                      <Grid item xs={0.99}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ADHESIVE FILM Temp. (°C)</Grid>
                      <Grid item xs={0.99}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PE/PP FILM Temp. (°C)</Grid>
                      <Grid item xs={0.99}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>WATER TEMP BEFORE QUENCHING</Grid>
                      <Grid item xs={0.99}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>WATER TEMP AFTER QUENCHING</Grid>
                      <Grid item xs={0.99}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REMARK</Grid>
                     
                      <Grid item xs={1.5}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center'  }}>Specified</Grid>
                                            <Grid item xs={0.67} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    Min
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>Max</Grid>
                                              </Grid>
                                             </Grid>
                                            <Grid item xs={1} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getapplication?.length > 0 ? getapplication[0].PIPE_TEMP_B4CHROM_MIN : '-'}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].PIPE_TEMP_B4CHROM_MAX : '-'}</Grid>
                                              </Grid>
                                             </Grid>
                                                <Grid item xs={1} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    -
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>-</Grid>
                                              </Grid>
                                             </Grid>
                                            <Grid item xs={0.9} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    -
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].CHROM_SOL_TEMP_MAX : '-'}</Grid>
                                              </Grid>
                                             </Grid>

                                         <Grid item xs={0.99} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    -
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].CHROM_SOL_TEMP_MAX : ' '}</Grid>
                                              </Grid>
                                             </Grid>
                                           <Grid item xs={0.99} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getapplication?.length > 0 ? getapplication[0].TCP_CP1_PH_FBEAPP_MIN : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].TCP_CP1_PH_FBEAPP_MAX : ' '}</Grid>
                                              </Grid>
                                             </Grid>
                                                                                      <Grid item xs={0.99} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MAX : '-'}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MAX : '-'}</Grid>
                                              </Grid>
                                             </Grid>
                                                                                      <Grid item xs={0.99} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MIN : '-'}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MAX : '-'}</Grid>
                                              </Grid>
                                             </Grid>
                                                                                      <Grid item xs={0.99} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MIN : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MAX : ' '}</Grid>
                                              </Grid>
                                             </Grid>
                                                                                      <Grid item xs={0.99} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MIN : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getapplication?.length > 0 ? getapplication[0].TCP_CP2_AFWATEMP_QUEN_MIN : ' '}</Grid>
                                              </Grid>
                                             </Grid>
                                             <Grid item xs={0.99} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    <br/>
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{<br/>}</Grid>
                                              </Grid>
                                             </Grid>

                     


                      {getapplication
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                            <Grid item xs={0.5}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                            <Grid item xs={1}    style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_BATCH_NO !== null ? dataRow.TBP_BATCH_NO : <br />}</Grid>
                            <Grid item xs={0.67} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_ASL_NO_80 !== null ? dataRow.TBP_ASL_NO_80 : <br />}</Grid>
                            
                            <Grid item xs={1}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_PIPTMP_BECRM_110 !== null ? Number(dataRow.TBP_PIPTMP_BECRM_110).toFixed(0) : <br />}</Grid>
                            <Grid item xs={1}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_CHRM_VISUAL_110 !== null ? dataRow.TBP_CHRM_VISUAL_110 : <br />}</Grid>
                            <Grid item xs={0.9}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.CHRO_SOL_TEMP !== null ? Number(dataRow.CHRO_SOL_TEMP).toFixed(0) : <br />}</Grid>
                            
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_PIPTMP_AFCRM_110 !== null ? Number(dataRow.TBP_PIPTMP_AFCRM_110).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_PIPTMP_BEFBE_110 !== null ? Number(dataRow.TBP_PIPTMP_BEFBE_110).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_TMP_ADHEF_FIL_110 !== null ? Number(dataRow.TBP_TMP_ADHEF_FIL_110).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_TMP_PEFILM_110 !== null ? Number(dataRow.TBP_TMP_PEFILM_110).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_QUN_WA_BETMP_110 !== null ? Number(dataRow.TBP_QUN_WA_BETMP_110).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_QUN_WA_AFTMP_110 !== null ? Number(dataRow.TBP_QUN_WA_AFTMP_110).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_REMARK !== null ? dataRow.TBP_REMARK : <br />}</Grid>
                         </Grid>
                      ))}


{Array.from({ length: Math.max(0, rowsPerPage - getapplication.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

                            <Grid item xs={0.5}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={1}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.67}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            
                            <Grid item xs={1}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={1}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.9}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.99}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                           
                            
                         </Grid>
                      ))}

                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>

                     <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black' }}>
                       <Grid item xs={2.16} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>Number Of Epoxy Guns</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A1</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A2</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A3</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A4</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A5</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A6</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A7</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A8</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A9</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A10</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A11</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>A12</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B1</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B2</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B3</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B4</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B5</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B6</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B7</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B8</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B9</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B10</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B11</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>B12</Grid>

                       <Grid item xs={2.16} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>AIR PRESSURE Kg/cm²</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_1_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_2_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_3_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_4_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_5_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_6_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_7_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_8_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_9_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_10_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_11_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_12_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_13_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_14_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_15_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_16_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_17_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_18_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_19_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_20_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_21_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_22_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_23_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_AIRPRESS_34_110 : ' '} </Grid>

                       <Grid item xs={2.16} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>FLOW RATE %</Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_1_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_2_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_3_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_4_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_5_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_6_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_7_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_8_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_9_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_10_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_11_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_12_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_13_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_14_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_15_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_16_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_17_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_18_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_19_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_20_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_21_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_22_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_23_110 : ' '} </Grid>
                       <Grid item xs={0.41} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}> {getapplication?.length > 0  ? getapplication[0].TBP_FLWRATE_34_110 : ' '} </Grid>
                     </Grid>

                      <Grid container style={{textAlign: 'left', fontSize: '4px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                               <Grid item xs = {12}>{<br/>}</Grid>
                               {/* <Grid item xs = {11.9}>ABOVE RESULTS ARE CONFORMING TO SPECIFICATION: {getapplication?.length > 0 ? getapplication[0].SPEC : '  '} & QAPNO:{getapplication?.length > 0 ? getapplication[0].ACCEPTANCE_CRITERIA : '  '} AND FOUND SATISFACTORY</Grid> */}
                       </Grid>
                      <Grid container style={{textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                               <Grid item xs = {0.1}>{<br/>}</Grid>
                               <Grid item xs = {11.9}>ABOVE RESULTS ARE CONFORMING TO SPECIFICATION: {getapplication?.length > 0 ? getapplication[0].SPEC : '  '} & QAPNO:{getapplication?.length > 0 ? getapplication[0].ACCEPTANCE_CRITERIA : '  '} AND FOUND SATISFACTORY</Grid>
                       </Grid>

                     <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black' }}>
                      <Grid item xs={12}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',  textAlign: 'Left' }}>Raw Material Used:</Grid>
                           <Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>SR.NO.</Grid>
                           <Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>Raw Material</Grid>
                           <Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>Manufacturer</Grid>
                           <Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>Grade</Grid>
                           <Grid item xs={1} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>Batch No.</Grid>
                           <Grid item xs={1} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>Line Speed <br />  (Mtr./Min)</Grid>
                           <Grid item xs={1.9} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>Dew Point for Coating <br /> Application (°C)</Grid>
                           <Grid item xs={1} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>Number of Epoxy Gun</Grid>                       
                           <Grid item xs={1} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>HDPE SCrew <br />  RPM</Grid>    
                           <Grid item xs={1.1} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>Adhesive Screw <br />  RPM.</Grid>    

                           {Array.from({ length: 4 }).map((_, rowIndex) => (
  <React.Fragment key={rowIndex}>
    <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px', textAlign: 'Center' }}>
     {rowIndex + 1}
    </Grid>
    <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px', textAlign: 'Center' }}>
      {(rowIndex === 0  && getapplication?.length > 0) ? getapplication[0].TBP_RM_1_110 :  <br />}
      {(rowIndex === 1  && getapplication?.length > 0) ? getapplication[0].TBP_RM_2_110 :  <br />}
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_RM_3_110 :  <br />}
      {(rowIndex === 3  && getapplication?.length > 0) ? getapplication[0].TBP_RM_4_110 :  <br />}
    </Grid>
    <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px', textAlign: 'Center' }}>
      {(rowIndex === 0  && getapplication?.length > 0) ? getapplication[0].TBP_MANFACT_1_110 :  <br />}
      {(rowIndex === 1  && getapplication?.length > 0) ? getapplication[0].TBP_MANFACT_2_110 :  <br />}
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_MANFACT_3_110 :  <br />}
      {(rowIndex === 3  && getapplication?.length > 0) ? getapplication[0].TBP_MANFACT_4_110 :  <br />}
    </Grid>
    <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px', textAlign: 'Center' }}>
      {(rowIndex === 0  && getapplication?.length > 0) ? getapplication[0].TBP_CHRM_GR_110 :  <br />}
      {(rowIndex === 1  && getapplication?.length > 0) ? getapplication[0].TBP_EPOXY_GR_110 :  <br />}
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_ADHA_GR_110 :  <br />}
      {(rowIndex === 3  && getapplication?.length > 0) ? getapplication[0].TBP_PEPP_GR_110 :  <br />}
    </Grid>
    <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px', textAlign: 'Center' }}>
      {(rowIndex === 0  && getapplication?.length > 0) ? getapplication[0].TBP_CHROM_BH_110 :  <br />}
      {(rowIndex === 1  && getapplication?.length > 0) ? getapplication[0].TBP_EPXY_BH_110 :  <br />}
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_ADHA_BH_110 :  <br />}
      {(rowIndex === 3  && getapplication?.length > 0) ? getapplication[0].TBP_PEPP_BH_110 :  <br />}
    </Grid>
    <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderRight: '1px solid black',padding: '1px', textAlign: 'Center' }}>
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_LINES_SPED_110 :  <br />}
    </Grid>
    <Grid item xs={1.9} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderRight: '1px solid black',padding: '1px', textAlign: 'Center' }}>
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_EPXY_DWPT_110 :  <br />}
    </Grid>
    <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderRight: '1px solid black',padding: '1px', textAlign: 'Center' }}>
       {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_NO_EPGUN_110 :  <br />}
    </Grid>
    <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',  borderRight: '1px solid black',padding: '1px', textAlign: 'Center' }}>
      {rowIndex === 0 ? 1 : <br />}
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_HDPE_RPM01_110 :  <br />}
    </Grid>
    <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',  borderRight: '1px solid black',padding: '1px', textAlign: 'Center' }}>
      {rowIndex === 0 ? 2 : <br />}
      {rowIndex === 2 ? '-' : <br />}
    </Grid>
    <Grid item xs={1.1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderRight: '1px solid black', padding: '1px', textAlign: 'Center' }}>
      {(rowIndex === 2  && getapplication?.length > 0) ? getapplication[0].TBP_ADHE_RPM_110 :  <br />}
    </Grid>
  </React.Fragment>
))}

                            {/* <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}> <br /> </Grid>
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center'}}> <br /> </Grid>       
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}> <br /> </Grid>
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center'}}> <br /> </Grid>
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center'  }}> <br /> </Grid>
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center'}}> <br /> </Grid>      
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}> <br /> </Grid>
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center'}}> <br /> </Grid>
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center'  }}> <br /> </Grid>
                            <Grid item xs={1.2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center'}}> <br /> </Grid> */}
                      </Grid>

                     <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black' }}>
                      <Grid item xs={12}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',  textAlign: 'Center' }}>INSTRUMENT USED</Grid>

                           <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                           <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>INSTRUMENT ID</Grid>
                           <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                           <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>INSTRUMENT ID</Grid>
                           <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                           <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>INSTRUMENT ID</Grid>
                       

                           <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}>{props?.instrumentName1}  {<br/>} </Grid>
                           <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center'  }}>{props?.instrumentId1} </Grid>       
                           <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}>{props?.instrumentName2}</Grid>
                           <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center'  }}>{props?.instrumentId2}</Grid>
                           <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center'  }}>{props?.instrumentName3}</Grid>
                           <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center'  }}>{props?.instrumentId3}</Grid>
                      </Grid>
                       

                    <Grid container style={{  textAlign: 'left',fontSize: '11px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                      
                          <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                               <Grid item xs={6}   style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>INSPECTED BY</Grid>
                               <Grid item xs={6}   style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>ACCEPTED BY</Grid>
                          </Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px'  ,  textAlign: 'Center'  }}> {props?.reviewedBy} <br/> (QC ENGINEER)</Grid>
                       <Grid item xs = {6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px'  ,  textAlign: 'Center'  }}> TPIA / CLIENT<br/></Grid>
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