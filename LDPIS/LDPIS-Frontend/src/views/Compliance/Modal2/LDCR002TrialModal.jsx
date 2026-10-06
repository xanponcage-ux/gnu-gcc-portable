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

export default function MaxWidthDialogTrial(props) {
  const [gettrialdata, setgettrialdata] = useState([]);
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
      const { reviewedBy, instrumentName, instrumentId,  instrumentName2, instrumentId2 ,wiNo } = props;

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
              axiosAPI.post("api/LDCR002/gettrialdata", data, defaultOptions),
          ]).then(([gettrialdataResponse]) => {
            setgettrialdata(gettrialdataResponse.data);
                console.log(gettrialdata);
                
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
    const numPages = Math.max(1, Math.ceil(gettrialdata?.length / rowsPerPage));

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
          {gettrialdata?.length === 0 && !loading ? (
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
                            style={{ textAlign: 'center', marginTop: '80px', fontSize: '18px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            PIPE COATING DIVISION <br />
                            TRIAL PIPE REPORT
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '10px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                           FORMAT NO : TSL/COAT/QC/F-07 Rev 05,Date 13.11.2021            _
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={1.5} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                              <p>Client        </p>  
                              <p>PO.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade </p>
                              <p>Type of Coating  </p>
                            </Grid>
                            <Grid item xs={5.1} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderleft: '1px solid black' }}>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].ORDER_ID : ' '}</p>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].PIPE_SIZE : ' '} </p>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].SPEC_GRD : ' '}  </p>
                               <p>: {gettrialdata?.length > 0 ? gettrialdata[0].COATING_TYPE : ' '}  </p>
                            </Grid>

                            <Grid item xs={1.5} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date & Shift           </p>
                              <p>Acceptance Criteria  </p> 
                              <p>Process Sheet</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={3.9} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].REP_NO : ' '} </p>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].DATE_SHIFTQ : ' '} </p>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].GD_QAP_NO : ' '} </p>
                              <p>: {gettrialdata?.length > 0 ? gettrialdata[0].PROC_SHEET : ' '} </p>
                               <p>: {props?.wiNo} </p> 
                              {/* <p>: {gettrialdata?.length > 0 ? gettrialdata[0].PROCEDURE_WI_NO : ' '} </p> */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '11px', border: '1px solid black',  textAlign: 'center' }}>
                    <Grid item xs={12} style={{ fontSize: '14px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px' ,  textAlign: 'Left'}}>
                        <p>Pipe no: {gettrialdata?.length > 0 ? gettrialdata[0].PIPE_NO : ' '} </p>
                    </Grid>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                                          <Grid container xs = {12} >
                                               <Grid container xs = {12} >
                                                  <Grid item xs={12} style={{ fontSize: '14px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '6px' ,  textAlign: 'Center'}}>
                                                      Epoxy Thickness (Micron) Required Thickness Min {gettrialdata?.length > 0 ? gettrialdata[0].EPOXY_MIN : ' '} Microns
                                                  </Grid>
                                                  <Grid item xs={1.2} style={{ fontSize: '14px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '6px' ,  textAlign: 'Center', display: 'flex', alignItems: 'center' ,  justifyContent: 'center'  }}>Position</Grid> 
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               0°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_0D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_0D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'}}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_0D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               90°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_90D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_90D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'}}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_90D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               180°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_180D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_180D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'}}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_180D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               270°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_270D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_270D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'}}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_EPOXY_270D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                                                  
                                               </Grid>
                      
                                               <Grid container xs = {12} >
                                                  <Grid item xs={12} style={{ fontSize: '14px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '6px' ,  textAlign: 'Center'}}>
                                                  Epoxy+Adhesive Thickness (micron) Required Thickness Min {gettrialdata?.length > 0 ? gettrialdata[0].EPOXY_ADHE_MIN : ' '} Microns
                                                  </Grid>
                                                  <Grid item xs={1.2} style={{ fontSize: '14px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '6px' ,  textAlign: 'Center', display: 'flex', alignItems: 'center'  ,  justifyContent: 'center' }}>Position</Grid> 
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               0°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_0D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_0D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_0D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               90°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_90D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_90D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_90D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               180°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_180D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_180D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_180D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               270°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_270D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_270D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_ADHESIV_270D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                                                  
                                               </Grid>
                      
                                               <Grid container xs = {12} >
                                                  <Grid item xs={12} style={{ fontSize: '14px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '6px' ,  textAlign: 'Center'}}>
                                                  Total Coating Thickness (mm) Required Thickness Min {gettrialdata?.length > 0 ? gettrialdata[0].COATING_THICK : ' '} MM
                                                  </Grid>
                                                  <Grid item xs={1.2} style={{ fontSize: '14px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '6px' ,  textAlign: 'Center', display: 'flex', alignItems: 'center' ,  justifyContent: 'center' ,  justifyContent: 'center'  }}>Position</Grid> 
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               0°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_0D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_0D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_0D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               90°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_90D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_90D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_90D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               180°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_180D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_180D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_180D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                      
                                                  <Grid item xs={2.7} colSpan={6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                                        <Grid container>
                                                               <Grid item xs={12} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '5px'}}>
                                                               270°
                                                               </Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_270D1 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '5px' }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_270D2 : ' '}</Grid>
                                                           <Grid item xs={4} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '5px'                                }}>{gettrialdata?.length > 0 ? gettrialdata[0].FTP_TOTCOAT_270D3 : ' '}</Grid>
                                                         </Grid>
                                                  </Grid>
                                                  
                                               </Grid>
                                          </Grid> 
                    </Grid>
                    <Grid>
 </Grid>

                      <Grid container style={{textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '7px',borderRight: '1px solid black' }}>
                               <Grid item xs = {0.05}>{<br/>}</Grid>
                               <Grid item xs = {11.9}>ABOVE RESULTS ARE CONFORMING TO SPECIFICATION: {gettrialdata?.length > 0 ? gettrialdata[0].SPEC_GRD : '  '} & QAPNO:{gettrialdata?.length > 0 ? gettrialdata[0].GD_QAP_NO : '  '} AND FOUND SATISFACTORY</Grid>
                       </Grid>

                     <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black' }}>
                      <Grid item xs={12}    style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px', textAlign: 'Center' }}>USED INSTRUMENT</Grid>
                      <Grid item xs={0.75}  style={{ fontSize: '9px',  color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center' }}>S No.</Grid>
                      <Grid item xs={2.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                      <Grid item xs={3}     style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,textAlign: 'Center' }}>INSTRUMENT ID/SERIAL NO.</Grid>
                      <Grid item xs={0.75}  style={{ fontSize: '9px',  color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center' }}>S No.</Grid>
                      <Grid item xs={2.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                      <Grid item xs={3}     style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,textAlign: 'Center' }}>INSTRUMENT ID/SERIAL NO.</Grid>
                       
                      <Grid item xs={0.75}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}>1</Grid>
                      <Grid item xs={2.25}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Left'  }}>{props?.instrumentName}</Grid>
                      <Grid item xs={3}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,textAlign: 'Left'}}>{props?.instrumentId}</Grid>
                      <Grid item xs={0.75}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}>2</Grid>
                      <Grid item xs={2.25}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Left'  }}>{props?.instrumentName2}</Grid>
                      <Grid item xs={3}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,textAlign: 'Left'}}>{props?.instrumentId2}</Grid>
                       </Grid>
                       

                    <Grid container style={{  textAlign: 'left',fontSize: '11px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                      
                          <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                               <Grid item xs={6}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',  textAlign: 'Center' }}>INSPECTED BY</Grid>
                               <Grid item xs={6}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px'  ,  textAlign: 'Center' }}>ACCEPTED BY</Grid>
                          </Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px'  ,  textAlign: 'Center'  }}> {props?.reviewedBy} <br/> (QC ENGINEER)</Grid>
                       <Grid item xs = {6} style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px'  ,  textAlign: 'Center'  }}> TPIA / CLIENT<br/></Grid>
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