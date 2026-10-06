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

export default function MaxWidthinternal(props) {
  const [getinternald, setgetinternald] = useState([]);
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
              axiosAPI.post("api/LDCR004/getinternaldata", data, defaultOptions),
          ]).then(([getinternaldResponse]) => {
            setgetinternald(getinternaldResponse.data);
                console.log(getinternald);
                
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
  
    const rowsPerPage = 10;
    const numPages = Math.max(1, Math.ceil(getinternald?.length / rowsPerPage));

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
          {getinternald?.length === 0 && !loading ? (
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
                            DATE SHEET INTERNAL COATING
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '12px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                           FORMAT NO : TSL/COAT/QC/F-48 Rev 04,Date 13.11.2021            _
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={1.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                              <p>Client        </p>  
                              <p>PO.No.         </p>
                              <p>Pipe Size           </p> 
                              <p>Specification  </p>
                              {/* <p>Acceptance Criteria</p>
                              <p>Process Sheet No</p> */}

                              {/* <p>Acceptance Criteria</p>
                              <p>Process Sheet No</p> */}
                              
                              
                              <p>Type of Coating  </p>
                            </Grid>
                            <Grid item xs={5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderleft: '1px solid black' }}>
                              <p>: {getinternald?.length > 0 ? getinternald[0].CLIENT : ' '} </p>
                              <p>: {getinternald?.length > 0 ? getinternald[0].PO_REF_NO : ' '}</p>
                              <p>: {getinternald?.length > 0  ? getinternald[0].PIPE_SIZE : ' '} </p>
                              <p>: {getinternald?.length > 0 ? getinternald[0].SPEC : ' '}  </p>

                              {/* <p>: {getinternald?.length > 0  ? getinternald[0].ACCEPTANCE_CRITERIA : ' '} </p>
                              <p>: {getinternald?.length > 0 ? getinternald[0].PROCESS_SHEET_NO : ' '} </p> */}
                              
                              <p>: {getinternald?.length > 0 ? getinternald[0].TYPE_OF_COATING : ' '}  </p>
                            </Grid>

                            <Grid item xs={1.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date & Shift           </p>
                              <p>Acceptance Criteria</p>
                              <p>Process Sheet No</p>
                              {/* <p>Pipe Size</p>
                              <p>Type of Coating  </p> */}
                              <p>Procedure/WI No.     </p>
                              {/* <p>Date of Coating   </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {getinternald?.length > 0  ? `${getinternald[0].REP_NO}-${pageIndex + 1}`: ' '} </p>
                              <p>: {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p>
                              <p>: {getinternald?.length > 0 ? getinternald[0].ACCEPTANCE_CRITERIA : ' '}  </p>
                              <p>: {getinternald?.length > 0  ? getinternald[0].PROCESS_SHEET_NO : ' '} </p>
                              {/* <p>: {getinternald?.length > 0  ? getinternald[0].TYPE_OF_COATING : ' '} </p> */}
                               <p>: {props?.wiNo} </p> 
                              {/* <p>: {getinternald?.length > 0  ? getinternald[0].PROCEDURE_WI_NO : ' '} </p> */}
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
                      <Grid item xs={3.1}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE DATA</Grid>
                      <Grid item xs={1.95}     style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>AMBIENT CONDITION</Grid>
                      <Grid item xs={2.8}     style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SURFACE PREPARATION</Grid>
                      <Grid item xs={2.76}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>THICKNESS</Grid>
                      <Grid item xs={0.59}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> <br /></Grid>
                      <Grid item xs={0.8}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CUT BACK</Grid>


                      <Grid item xs={0.4}     style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SR. <br />NO.</Grid>
                      <Grid item xs={0.6}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>External  <br /> Field No.</Grid>
                      <Grid item xs={0.6}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Pipe No.</Grid>
                      <Grid item xs={0.5}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Heat No.</Grid>
                      <Grid item xs={0.5}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Length  <br /> (Mtrs.)</Grid>
                      <Grid item xs={0.5}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ASL No.</Grid>  
                          

                      <Grid item xs={0.75}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Pipe Surface <br />  Temp.(°C)</Grid>
                      <Grid item xs={0.4}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Amb. <br />  Temp.(°C)</Grid>
                      <Grid item xs={0.4}      style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>RH%</Grid>
                      <Grid item xs={0.4}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Dew Point <br /> (°C)</Grid>
                      
                      <Grid item xs={0.6}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Dust <br />Contami<br />nation</Grid>
                      <Grid item xs={0.5}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Deg. Of <br />Cleanl<br />iness</Grid>
                      <Grid item xs={0.5}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Rough<br />ness<br /> (μm-Rz)</Grid>
                      <Grid item xs={0.6}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Salt Cont. <br /> (μg/cm³)</Grid>
                      <Grid item xs={0.6}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Visual of Blasted Surface</Grid>
                      
                      {/* <Grid item xs={0.62}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>WFT<br />  (μm)</Grid> */}
                                              <Grid item xs={2.76} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    <br />  WFT (μm)
                                                    </Grid>
                                                    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '1px' }}><br /> F END</Grid>
                                                    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '1px'}}><br /> T END</Grid>
                                              </Grid>
                                             </Grid>
                      <Grid item xs={0.59}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Visual of Coated Surface</Grid>
                      <Grid item xs={0.4}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>F-END <br /> (mm) </Grid>
                      <Grid item xs={0.4}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>T-END <br /> (mm) </Grid>

                      <Grid item xs={2.6}       style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center'  }}>Specified Requirement</Grid>
                                            <Grid item xs={0.5} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    Min
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>Max</Grid>
                                              </Grid>
                                             </Grid>

                                            <Grid item xs={0.75}  style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>at least 3°C <br /> above the Dew<br /> Point </Grid>
                                            
                                            <Grid item xs={0.4} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0 ? getinternald[0].AMB_TEMP_MIN : '-'}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getinternald?.length > 0 ? getinternald[0].AMB_TEMP_MAX : '-'}</Grid>
                                              </Grid>
                                             </Grid>
                                                <Grid item xs={0.4} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0 ? getinternald[0].RH : '-'}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>-</Grid>
                                              </Grid>
                                             </Grid>
                                            <Grid item xs={0.4} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0 ? getinternald[0].DEW_PIONT_MIN : '-'}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getinternald?.length > 0 ? getinternald[0].DEW_PIONT_MAX : '-'}</Grid>
                                              </Grid>
                                             </Grid>

                                         <Grid item xs={0.6} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    -{/* {getinternald?.length > 0 ? getinternald[0].DUST_CONTAMINATION_MIN : ' '} */}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getinternald?.length > 0 ? getinternald[0].DUST_CONTAMINATION_MAX : ' '}</Grid>
                                              </Grid>
                                             </Grid>
                                           <Grid item xs={0.5}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{getinternald?.length > 0 ? getinternald[0].DEGREE_OF_CLEAN : ' '}</Grid>
                                          {/* <Grid item xs={0.5}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SA 2½</Grid> */}
                                           <Grid item xs={0.5} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0 ? getinternald[0].ROUGHNESS_MIN : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getinternald?.length > 0 ? getinternald[0].ROUGHNESS_MAX : ' '}</Grid>
                                              </Grid>
                                             </Grid>
                                              <Grid item xs={0.6} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0 ? getinternald[0].SALT_CONT : '-'}
                                                    </Grid>
                                                    {/* <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>{getinternald?.length > 0 ? getinternald[0].TCP_CP2_AFWATEMP_QUEN_MAX : '-'}</Grid> */}
                                              </Grid>
                                             </Grid>
                          <Grid item xs={0.6}  style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>OK / NOT OK </Grid>
                          <Grid item xs={1.38}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>DFT-Min.406 micron </Grid>
                          <Grid item xs={1.38}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>DFT-Min.406 micron </Grid>
                          <Grid item xs={0.59}  style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>OK / NOT OK </Grid>
                          <Grid item xs={0.8}  style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>50 ± 10 mm. </Grid>

                     


                      {getinternald
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                            <Grid item xs={0.6}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_ASL_NO_80 !== null ? dataRow.TBP_ASL_NO_80 : <br />}</Grid>
                            <Grid item xs={0.6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_BATCH_NO !== null ? dataRow.TBP_BATCH_NO : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.HEAT_NO !== null ? dataRow.HEAT_NO : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.LENGTH !== null ? dataRow.LENGTH : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_ASL_NO_80 !== null ? Number(dataRow.TBP_ASL_NO_80).toFixed(0) : <br />}</Grid>

                            <Grid item xs={0.75}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.PIPE_SURF_MIN !== null ? Number(dataRow.PIPE_SURF_MIN).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.AMB_TEMP_MIN !== null ? Number(dataRow.AMB_TEMP_MIN).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.RH !== null ? dataRow.RH : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.DEW_PIONT_MAX !== null ? Number(dataRow.DEW_PIONT_MAX).toFixed(0) : <br />}</Grid>
                            
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.DUST_CONTAMINATION_MAX !== null ? Number(dataRow.DUST_CONTAMINATION_MAX).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.DEGREE_OF_CLEAN !== null ? Number(dataRow.DEGREE_OF_CLEAN).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.ROUGHNESS_MAX !== null ? Number(dataRow.ROUGHNESS_MAX).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.SALT_CONT !== null ? Number(dataRow.SALT_CONT).toFixed(0) : <br />}</Grid>
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.VISUAL_BLASTED !== null ? dataRow.VISUAL_BLASTED : <br />}</Grid>

                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.F_END1 !== null ? Number(dataRow.F_END1).toFixed(0) : <br />}</Grid>    
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.F_END2 !== null ? Number(dataRow.F_END2).toFixed(0) : <br />}</Grid>    
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.F_END3 !== null ? Number(dataRow.F_END3).toFixed(0) : <br />}</Grid>    
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.F_END4 !== null ? Number(dataRow.F_END4).toFixed(0) : <br />}</Grid>    
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.T_END1 !== null ? Number(dataRow.T_END1).toFixed(0) : <br />}</Grid>    
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.T_END2 !== null ? Number(dataRow.T_END2).toFixed(0) : <br />}</Grid>    
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.T_END3 !== null ? Number(dataRow.T_END3).toFixed(0) : <br />}</Grid>    
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.T_END4 !== null ? Number(dataRow.T_END4).toFixed(0) : <br />}</Grid>    
                            
                            <Grid item xs={0.59}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.VISUAL_COATED !== null ? dataRow.VISUAL_COATED : <br />}</Grid>                           
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.CUT_BACK_F !== null ? dataRow.CUT_BACK_F : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.CUT_BACK_T !== null ? dataRow.CUT_BACK_T : <br />}</Grid>
                         </Grid>
                      ))}


{Array.from({ length: Math.max(0, rowsPerPage - getinternald.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

                            <Grid item xs={0.4}   style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>

                            <Grid item xs={0.75}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.6}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>

                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.345}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                           
                            <Grid item xs={0.59}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid> 
                         </Grid>
                      ))}

                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>


                      <Grid container style={{textAlign: 'left', fontSize: '4px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                               <Grid item xs = {12}>{<br/>}</Grid>
                               {/* <Grid item xs = {11.9}>ABOVE RESULTS ARE CONFORMING TO SPECIFICATION: {getinternald?.length > 0 ? getinternald[0].SPEC : '  '} & QAPNO:{getinternald?.length > 0 ? getinternald[0].ACCEPTANCE_CRITERIA : '  '} AND FOUND SATISFACTORY</Grid> */}
                       </Grid>
                      <Grid container style={{textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                               <Grid item xs = {0.1}>{<br/>}</Grid>
                               <Grid item xs = {11.9}>REMARKS :- ABOVE RESULTS ARE CONFORMING TO SPECIFICATION: {getinternald?.length > 0 ? getinternald[0].SPEC : '  '} 
                                {/* & QAPNO:{getinternald?.length > 0 ? getinternald[0].ACCEPTANCE_CRITERIA : '  '} */}
                                 AND FOUND SATISFACTORY</Grid>
                       </Grid>


                     <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black' }}>
                      {/* <Grid item xs={12}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',  textAlign: 'Center' }}>INSTRUMENT USED</Grid> */}

                           <Grid item xs={0.75} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>SR.NO.</Grid>
                           <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>RAW MATERIAL</Grid>
                           <Grid item xs={3} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>MANUFACTURER</Grid>
                           <Grid item xs={3.75} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>GRADE</Grid>
                           <Grid item xs={1.25} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>BATCH NO.</Grid>
                           <Grid item xs={1.25} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>Micture RAatio of  <br /> Part A : Part B</Grid>
                       

                                        <Grid item xs={0.75} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    1
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>
                                                    2
                                                    </Grid>
                                              </Grid>
                                        </Grid>
                                         <Grid item xs={2} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    BASE
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>
                                                    HARDNER
                                                    </Grid>
                                              </Grid>
                                        </Grid>
                                            <Grid item xs={3} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0  ? getinternald[0].BASE_MANUFACTURER : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>
                                                    {getinternald?.length > 0  ? getinternald[0].HARDNER_MANUFACTURER : ' '}
                                                    </Grid>
                                              </Grid>
                                        </Grid>
                                        <Grid item xs={3.75} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0  ? getinternald[0].BASE_GRADE : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>
                                                    {getinternald?.length > 0  ? getinternald[0].HARDNER_GRADE : ' '}
                                                    </Grid>
                                              </Grid>
                                        </Grid>
                                                                                   
                                             <Grid item xs={1.25} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    {getinternald?.length > 0  ? getinternald[0].BASE_BATCH_NO : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>
                                                    {getinternald?.length > 0  ? getinternald[0].HARDNER_BATCH_NO : ' '}
                                                    </Grid>
                                              </Grid>
                                        </Grid>

                                                                                    <Grid item xs={1.25} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    <br/>{getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '}
                                                    </Grid>
                                                    {/* <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>F END</Grid> */}
                                                    {/* <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>
                                                    {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '}
                                                    </Grid> */}
                                              </Grid>
                                        </Grid>

                           {/* <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'}}> <p> 1 </p> </Grid> */}
                           {/* <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p> </Grid>       
                           <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'   }}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p></Grid>
                           <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p></Grid> */}
                           {/* <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center'   }}> <p> {getinternald?.length > 0  ? getinternald[0].ID_BATCH : ' '} </p></Grid> */}
                        {/* <Grid item xs={1.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center'}}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p></Grid> */}

                           {/* <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'}}> <p> 2 </p> </Grid> */}
                           {/* <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p> </Grid>       
                           <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'   }}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p></Grid>
                           <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p></Grid>
                           <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center'   }}> <p> {getinternald?.length > 0  ? getinternald[0].ID_BATCH : ' '} </p></Grid>
                        <Grid item xs={1.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center'}}> <p> {getinternald?.length > 0  ? getinternald[0].DATE_SHIFT : ' '} </p></Grid> */}
                      </Grid>
                       

                    <Grid container style={{  textAlign: 'left',fontSize: '11px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                      
                          {/* <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                               <Grid item xs={6}   style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>INSPECTED BY</Grid>
                               <Grid item xs={6}   style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>ACCEPTED BY</Grid>
                          </Grid> */}
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