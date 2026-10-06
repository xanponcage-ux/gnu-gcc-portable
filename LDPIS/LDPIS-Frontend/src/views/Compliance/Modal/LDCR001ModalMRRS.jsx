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

export default function MaxWidthDialogMRRS(props) {
  const { reviewedBy  } = props;
  const [getMRRSdata, setgetMRRSdata] = useState([]);
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
          pipeno: props.selectedpipelist ? props.selectedpipelist : "",
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
              axiosAPI.post("api/LDCR001/getMRRSdata", data, defaultOptions),
          ]).then(([getMRRSdataResponse]) => {
            setgetMRRSdata(getMRRSdataResponse.data);
                console.log(getMRRSdata);
                
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
    const numPages = Math.max(1, Math.ceil(getMRRSdata?.length / rowsPerPage));


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
          {getMRRSdata?.length === 0 && !loading ? (
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
                            MILL REPORT - SECTION PIPE (MILL NO.- {getMRRSdata?.length > 0 ? getMRRSdata[0].MILL_NO : ' '} )
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right',fontSize: '7px', color: 'black', fontFamily: "Times New Roman" ,borderLeft:'1px solid black',borderRight:'2px solid black'}}
                          >
                            TSL/ERW/QC/F-03A,Rev 03,Date 13.11.2021            _
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '4px' }}>
                              <p>Client        </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification  & Grade </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px',borderleft: '1px solid black' }}>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].ORDER_ID     : ' '}</p>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].PIPE_SIZE : ' '}</p>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].SPEC_GRD : ' '}  </p>
                              {/* <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].CD_GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '1px' ,borderLeft: '1px solid black'}}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px',borderRight: '1px solid black' }}>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].REP_NO : ' '} </p>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].CRT_DT : ' '} </p>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].QAP_NO : ' '} </p>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].PROC_SHEET : ' '} </p>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].ID_MILLPROC : ' '} </p>
                            </Grid>
                            

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px' ,borderLeft: '1px solid black'}}>
                             <p>Coil No.</p>
                            </Grid>

                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px' }}>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].ID_FIRST_PAR : ' '} </p>
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px' ,borderLeft: '1px solid black' }}>
                             <p>Heat No.</p>
                            </Grid>

                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px',borderRight: '1px solid black' }}>
                              <p>: {getMRRSdata?.length > 0 ? getMRRSdata[0].NO_CAST : ' '} </p>
                            </Grid>

                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                      <Grid item xs={0.5}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SNo</Grid>
                      <Grid item xs={1.75}    style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SECTION NO.</Grid>
                      

                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Depth (mm)</Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Width (mm) </Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>WT (mm) </Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>TWIST </Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SOC<br/>(°)</Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ROC<br/>(mm) </Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ST<br/>(mm) </Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CNVX<br/>(mm) </Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CNCV<br/>(mm) </Grid>
                      <Grid item xs={0.7} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>LEN<br/>(MTR) </Grid>

                      <Grid item xs={1}    style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>RESLT </Grid>
                      <Grid item xs={1.75} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REM </Grid>
                      
                      <Grid item xs={1.60} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Specified <br/> Requirement</Grid>
                      <Grid container direction="column" item xs = {0.64}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        Min.
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        Max.
                      </Grid>
                      </Grid>

                      
                      <Grid container direction="column" item xs = {0.71}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].DEPTH_MIN !== null ? getMRRSdata[0].DEPTH_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].DEPTH_MAX !== null ? getMRRSdata[0].DEPTH_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].WIDTH_MIN !== null ? getMRRSdata[0].WIDTH_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].WIDTH_MAX !== null ? getMRRSdata[0].WIDTH_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].WEIGHT_MIN !== null ? getMRRSdata[0].WEIGHT_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].WEIGHT_MAX !== null ? getMRRSdata[0].WEIGHT_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].TWIST_MAX !== null ? getMRRSdata[0].TWIST_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].SQOC_MIN !== null ? getMRRSdata[0].SQOC_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].SQOC_MAX !== null ? getMRRSdata[0].SQOC_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].ROC_MAX !== null ? getMRRSdata[0].ROC_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].STRAIGHTNESS_FULL !== null ? getMRRSdata[0].STRAIGHTNESS_FULL : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].CONVEX_MAX !== null ? getMRRSdata[0].CONVEX_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      -
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].CONCAVE_MAX !== null ? getMRRSdata[0].CONCAVE_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.7}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].LEN_MIN !== null ? getMRRSdata[0].LEN_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <p>{getMRRSdata?.length > 0 && getMRRSdata[0].LEN_MAX !== null ? getMRRSdata[0].LEN_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {1}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {1.75}>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      </Grid>
                      </Grid>
                      

                      {getMRRSdata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
        <Grid item xs={0.5}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{pageIndex * rowsPerPage + i + 1}</Grid>
        <Grid item xs={1.75} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.DEPTH_10 !== null ? dataRow.DEPTH_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.WIDTHS_10 !== null ? dataRow.WIDTHS_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.WEIGHT !== null ? dataRow.WEIGHT : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.TWIST_10 !== null ? dataRow.TWIST_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.SQOC_10 !== null ? dataRow.SQOC_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.ROC_10 !== null ? dataRow.ROC_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.STRAIGHTNESS_F_END_10 !== null ? dataRow.STRAIGHTNESS_F_END_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.CONVX_10 !== null ? dataRow.CONVX_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.CONCV_10 !== null ? dataRow.CONCV_10 : <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.LENGTH_MTR !== null ? dataRow.LENGTH_MTR : <br />}</Grid>
        <Grid item xs={1}    style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.RESULT !== null ? dataRow.RESULT : <br />}</Grid>
        <Grid item xs={1.75} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{dataRow.MILL_RMK_10 !== null ? dataRow.MILL_RMK_10 : <br />}</Grid>
    </Grid>
))}

{Array.from({ length: Math.max(0, rowsPerPage - getMRRSdata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>
        <Grid item xs={0.5}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{<br />} </Grid>
        <Grid item xs={1.75} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={0.7}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={1}    style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
        <Grid item xs={1.75} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' }}>{ <br />}</Grid>
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
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].MICROMETR_0_25 : ' '}</Grid>
<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>2</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>OD Micrometer</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].OD_MICROMETER : ' '}</Grid>
<Grid item xs={0.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>3</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Measuring Tape</Grid>
<Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].MEASURING_TAPE : ' '}</Grid>

<Grid item xs={12} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Welding Parameters</Grid>

<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Welding <br/> Temp (°C)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Mill<br/>Speed (Mtr/Min.)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Current<br/>(Amp.)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Temp Before<br/>Quenching</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Voltage (V)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Frequency<br/>(Khz)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Seam<br/>Norm. Temp (°C)</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>Welding Power<br/>(KW)</Grid>

<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].WLD_TEMP_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].MILL_SPD_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].CURRENTT_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].TEMP_QN_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].VOLTAGE_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].FREQUENCY_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].NORMZ_TEMP_10 : ' '}</Grid>
<Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   }}>{getMRRSdata?.length > 0 ? getMRRSdata[0].WELD_POWER_10 : ' '}</Grid>


                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>


          
                    <Grid style={{  fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                        ABBREVIATION
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '11px', color: 'black', fontFamily: "Arial", padding: "2px"}}>
                    
                       <Grid item xs = {12} style = {{ borderBottom: '1px solid black' }}>ODB-OD BEAD, IDB-ID BEAD, OL-OVERLAP, SC-SCRATCH, CJ-COIL JOINT, NSA- NOT SEAM ANNELING, OS-OPEN SEAM, TM-TOOL MARK, OOR - OUT OF ROUNDNESS, ST-STRAIGHTNESS, IDF - ID
BEAD FLASH, D-DEPTH OF GROOVE, H -HEIGHT OF BEAD, RESLT - RESULT, ROC-RADIUS OF CORNER, SOC-SQUARENESS OF CORNER, LEN-LENGTH, CNVX-CONVEXITY, CNCV-CONCAVITY,
<br/>REM-REMARKS, PR-PROCESS REJECTION
                        </Grid>
                         <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '12px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {0.25}><br/></Grid>
                       <Grid item xs = {3.75}> ENGINEER(QC) <br/> Name : {getMRRSdata?.length > 0 ? getMRRSdata[0].INSP_NAME : ' '}</Grid>
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