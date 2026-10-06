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

export default function MaxWidthDialogMRR(props) {
  const { reviewedBy  } = props;
  const [getMRRdata, setgetMRRdata] = useState([]);
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

        const data = {
          plant: props?.plant?.value ? props.plant.value : "",
          orderNo: props.orderNo ? props.orderNo : "",
          item: props.item ? props.item : "",
          matno: props.matno ? props.matno : "",
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
          shift: props.shift ? props.shift : "",
          slitNo: props.slitNo && props.slitNo?.value?.length > 0 ? props.slitNo?.value : "",
          pipeno: props.selectedpipelist ? props.selectedpipelist : "",
          // pipeno: pipeValue?.from ? pipeValue.from : "",
          // rmno: props.rmno ? props.rmno : "",  //
        };
        console.log('MRRdata---->',data);

        GetAuthorization().then((token) => {
            const defaultOptions = {
                headers: {
                    Authorization: "Bearer " + token.accessToken,
                },
            };
            setLoading(true);
            Promise.all([
              axiosAPI.post("api/LDCR001/getMRRdata", data, defaultOptions),
          ]).then(([getMRRdataResponse]) => {
            setgetMRRdata(getMRRdataResponse.data);
                console.log(getMRRdata);
                
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
    size: A4 potrait;
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
  
    const rowsPerPage = 35;
    const numPages = Math.max(1, Math.ceil(getMRRdata?.length / rowsPerPage));

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
          {getMRRdata?.length === 0 && !loading ? (
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
                top: 12,
                left: 10,
                height: '20px', // Adjust the height as needed
                margin: '10px' // Adjust the margin as needed
              }}
            />
              <img
              src={Tata_Round_Blue_Logo}
              alt="Tata Logo"
              style={{
                position: 'absolute',
                top: 12,
                right: 10,
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
                            style={{ textAlign: 'center', marginTop: '0px', fontSize: '15px', color: 'black', fontFamily: "Times New Roman" ,borderLeft:'1px solid black',borderRight:'2px solid black',borderTop:'1px solid black'}}
                          >
                            <br />
                            <br />
                            <br />
                    
                            ERW PIPE DIVISION - KHOPOLI <br />
                            MILL REPORT - ROUND PIPE (MILL NO.- {getMRRdata?.length > 0 ? getMRRdata[0].MILL_NO : ' '} )
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right',fontSize: '7px', color: 'black', fontFamily: "Times New Roman" ,borderLeft:'1px solid black',borderRight:'2px solid black'}}
                          >
                            TSL/ERW/QC/F-03,Rev 05,Date 13.11.2021            _
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                          <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '1px' }}>
                              <p>Client        </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade  </p>
                             
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderleft: '1px solid black' }}>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].ORDER_ID : ' '}</p>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].PIPE_SIZE : ' '}</p>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].SPEC_GRD : ' '}  </p>
                             
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '1px' ,borderLeft: '1px solid black'}}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].REP_NO : ' '} </p>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].PROD_DATE : ' '} </p>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].GD_QAP_NO : ' '} </p>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].PROC_SHEET : ' '} </p>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].ID_MILLPROC : ' '} </p>
                            </Grid>
                            
                            {props.slitNo && props.slitNo?.value?.length > 0 ? <>
                              <Grid item xs={1} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px' ,borderLeft: '1px solid black'}}>
                             <p>Coil No.</p>
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px' }}>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].ID_FIRST_PAR : ' '} </p>
                            </Grid>
                              <Grid item xs={1} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px' ,borderLeft: '1px solid black'}}>
                             <p>Slit No.</p>
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px' }}>
                              <p>: {props.slitNo?.value} </p>
                            </Grid>
                            </> : <>
                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px' ,borderLeft: '1px solid black'}}>
                             <p>Coil No.</p>
                            </Grid>

                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px' }}>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].ID_FIRST_PAR : ' '} </p>
                            </Grid></>}

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px' ,borderLeft: '1px solid black' }}>
                             <p>Heat No.</p>
                            </Grid>

                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                              <p>: {getMRRdata?.length > 0 ? getMRRdata[0].NO_CAST : ' '} </p>
                            </Grid>

                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                    <Grid item xs={0.5}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SNo</Grid>
                      <Grid item xs={1.2}    style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO.</Grid>
                      <Grid item xs={1.4  } colSpan={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center',padding : '1px' }}>
                         Diameter (mm)
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>BD</Grid>
            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>E</Grid>
            </Grid>
            </Grid>

            <Grid item xs={1.1} colSpan={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         ORR
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>BD</Grid>
            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>E</Grid>
            </Grid>
            </Grid>

            <Grid item xs={1.1} colSpan={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         ST
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>F</Grid>
            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>E</Grid>
            </Grid>
            </Grid>

            <Grid item xs={0.66} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>IB <br/> (D/H)</Grid>
            <Grid item xs={0.655} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>WT <br/> MM </Grid>
            <Grid item xs={0.655} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>LEN <br/> (MTR) </Grid>

            <Grid item xs={1.6} colSpan={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         FLAT
                  </Grid>

            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>0°</Grid>
            <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>90°</Grid>
            </Grid>
            </Grid>

                      <Grid item xs={0.79} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>RBT</Grid>
                      <Grid item xs={0.8} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>RESULT</Grid>
                      <Grid item xs={1.53} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REM</Grid>

                      <Grid item xs={1.1} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Specified <br/> Requirement</Grid>
                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        Min.
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        Max.
                      </Grid>
                      </Grid>

                      
                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].DIA_BODY_MIN !== null ? getMRRdata[0].DIA_BODY_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].DIA_BODY_MAX !== null ? getMRRdata[0].DIA_BODY_MAX : <br/>} </p>
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].DIA_END_MIN !== null ? Number(getMRRdata[0].DIA_END_MIN).toFixed(2)  : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].DIA_END_MAX !== null ? Number(getMRRdata[0].DIA_END_MAX).toFixed(2)  : <br/>} </p>
                      </Grid>
                      </Grid>
                      

                      <Grid container direction="column" item xs = {0.55}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].OOR_BODY_MAX !== null ? getMRRdata[0].OOR_BODY_MAX : <br/>} </p>
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.55}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].OOR_END_MAX !== null ? getMRRdata[0].OOR_END_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.55}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].STRAIGHTNESS_FULL !== null ? getMRRdata[0].STRAIGHTNESS_FULL : <br/>} </p>
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.55}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].STRAIGHTNESS_END !== null ? getMRRdata[0].STRAIGHTNESS_END : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.66}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].IB_DEPTH_MIN !== null ? getMRRdata[0].IB_DEPTH_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].IB_HEIGHT_MAX !== null ? getMRRdata[0].IB_HEIGHT_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.655}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].WALL_THK_MIN !== null ? getMRRdata[0].WALL_THK_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].WALL_THK_MAX !== null ? getMRRdata[0].WALL_THK_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.655}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].PIPE_LEN_MIN !== null ? getMRRdata[0].PIPE_LEN_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRdata?.length > 0 && getMRRdata[0].PIPE_LEN_MAX !== null ? getMRRdata[0].PIPE_LEN_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.8}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.8}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.79}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.8}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {1.54}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      {getMRRdata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
        <Grid item xs={0.5}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{pageIndex * rowsPerPage + i + 1} </Grid>
        <Grid item xs={1.2}   style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.ID_BATCH !== null          ? dataRow.ID_BATCH : <br />}</Grid>
        <Grid item xs={0.7}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.DIA_BODY_10 !== null            ? Number(dataRow.DIA_BODY_10).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.7}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.DIA_END_10 !== null             ? Number(dataRow.DIA_END_10).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.55}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.OUT_ROUND_BODY_10 !== null       ? Number(dataRow.OUT_ROUND_BODY_10).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.55}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.OUT_ROUND_END_10 !== null      ? Number(dataRow.OUT_ROUND_END_10).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.55}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.STRAIGHTNESS_F_END_10 !== null  ? Number(dataRow.STRAIGHTNESS_F_END_10).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.55}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.STRAIGHTNESS_T_END_10 !== null  ? Number(dataRow.STRAIGHTNESS_T_END_10).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.65}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.ID_FLASH_10 !== null            ? Number(dataRow.ID_FLASH_10).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.65}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.WALL_THICK_END !== null                 ? Number(dataRow.WALL_THICK_END).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.65}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.LENGTH_MTR !== null             ? Number(dataRow.LENGTH_MTR).toFixed(2) : <br />}</Grid>
        <Grid item xs={0.8}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.FLATNG_0_O_10 !== null     ? dataRow.FLATNG_0_O_10 : <br />}</Grid>
        <Grid item xs={0.8}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.FLATNG_90_O_10 !== null    ? dataRow.FLATNG_90_O_10 : <br />}</Grid>
        <Grid item xs={0.8}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.RBT_10 !== null            ? dataRow.RBT_10 : <br />}</Grid>
        <Grid item xs={0.8}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.RESULT !== null            ? dataRow.RESULT : <br />}</Grid>
        <Grid item xs={1.55}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.REMARKS !== null           ? dataRow.REMARKS : <br />}</Grid>
    </Grid>
))}


{Array.from({ length: Math.max(0, rowsPerPage - getMRRdata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>
        <Grid item xs={0.5}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{<br />} </Grid>
        <Grid item xs={1.2}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{<br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.55} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.55} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.55} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.55} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.65} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.65} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.65} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.8}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.8}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.8}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.8}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={1.55} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
    </Grid>
))}

                    
<Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}><br/></Grid>

<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>S No.</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Instrument Name</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>ID No.</Grid>
<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>S No.</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Instrument Name</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>ID No.</Grid>
<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>S No.</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Instrument Name</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>ID No.</Grid>

<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>1</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Micrometer (0-25)</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].MICROMETER_0_25 : ' '}</Grid>
<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>2</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>OD Micrometer</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].OD_MICROMETER : ' '}</Grid>
<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>3</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Measuring Tape</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].MEASURING_TAPE : ' '}</Grid>

<Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Welding Parameters</Grid>

<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Welding <br/> Temp (°C)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Mill<br/>Speed (Mtr/Min.)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Current<br/>(Amp.)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Temp Before<br/>Quenching</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Voltage (V)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Frequency<br/>(Khz)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Seam<br/>Norm. Temp (°C)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Welding Power<br/>(KW)</Grid>

<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].WELD_TEMP_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].MILL_SPEED_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].CURRENT_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].TEMP_QN_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].VOLTAGE_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].FREQUENCY_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].NORMZ_TEMP_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRdata?.length > 0 ? getMRRdata[0].WELD_POWER_10 : ' '}</Grid>


</Grid>  
</Grid>
<Grid>
</Grid>



<Grid style={{  fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
  ABBREVIATION
</Grid>
<Grid container style={{  textAlign: 'left',fontSize: '12px', color: 'black', fontFamily: "Arial", padding: "2px"}}>

 <Grid item xs = {12} style = {{ borderBottom: '1px solid black' }}>ODB-OD BEAD, IDB-ID BEAD, OL-OVERLAP, SC-SCRATCH, CJ-COIL JOINT, NSA-NOT SEAM ANNEALING, OS-OPEN SEAM, TM-TOOL MARK, OOR-OUT OF ROUNDNESS,
 <br/> 
 ST-STRAIGHTNESS, IDF-ID BEAD FLASH, D-DEPTH OF GROOVE, H-HEIGHT OF BEAD, LEN - LENGTH, RESLT-RESULT, REM-REMARKS, PR-PROCESS REJECTION
  </Grid>
   <Grid item xs = {12}><br/></Grid>
 <Grid item xs = {12}><br/></Grid>
</Grid>
<Grid container style={{  textAlign: 'left',fontSize: '12px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
 <Grid item xs = {12}><br/></Grid>
 <Grid item xs = {12}><br/></Grid>
 <Grid item xs = {0.25}><br/></Grid>
 <Grid item xs = {3.75}> ENGINEER(QC) <br/> Name:{getMRRdata?.length > 0 ? getMRRdata[0].INSP_NAME : ' '}</Grid>
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