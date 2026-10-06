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

export default function MaxWidthDialogHRD(props) {
  const { reviewedBy,specimen,testMethodhrd } = props;
  const [gethardnessdata, setgethardnessdata] = useState([]);
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
              axiosAPI.post("api/LDCR001/gethardnessdata", data, defaultOptions),
          ]).then(([gethardnessdataResponse]) => {
            setgethardnessdata(gethardnessdataResponse.data);
                console.log(gethardnessdata);
                
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
  
    const rowsPerPage = 7;
    const numPages = Math.max(1, Math.ceil(gethardnessdata?.length / rowsPerPage));

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
          {gethardnessdata?.length === 0 && !loading ? (
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

                        <Grid item xs={12}>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'center', marginTop: '65px', fontSize: '15px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            ERW PIPE DIVISION - KHOPOLI<br />
                            HARDNESS TEST REPORT - PRODUCT [ MILL NO.- {gethardnessdata?.length > 0 ? gethardnessdata[0].MILL_NO : ' '} ]
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px', fontSize: '10px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-15,Rev 05,Date 13.11.2021
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={2} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '7px' }}>
                              <p>Client        </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification  & Grade </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '7px',borderRight: '1px solid black' }}>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].ORDER_ID : ' '}</p>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].PIPE_SIZE : ' '}</p>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].SPEC_GRADE : ' '}  </p>
                              {/* <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].CD_GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '7px' }}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid> 
                            <Grid item xs={4} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '7px',borderRight: '1px solid black' }}>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].REP_NO : ' '} </p>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].CRT_DT : ' '}</p>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].GD_QAP_NO : ' '} </p>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].PROC_SHEET : ' '} </p>
                              <p>: {gethardnessdata?.length > 0 ? gethardnessdata[0].ID_MILLPROC : ' '} </p>
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                            
                    <Grid container >   
                    <Grid item xs={12}  style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px'   ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Required Values(Max) : 248 HV10</Grid>  
                    <Grid container xs = {12}>
                    
                      <Grid item xs={0.5}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px'   ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>SR. NO.</Grid>
                      <Grid item xs={1.5}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>PIPE NO.</Grid>
                      <Grid item xs={1}    style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px'      ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>HEAT NO.</Grid>

                      <Grid item xs={6.5} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                                   CORRESPONDING HARDNESS VALUES
                            </Grid>
 
                      <Grid item xs={3.3} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>BASE - L</Grid>
                      <Grid item xs={2.2} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>HAZ-L</Grid>
                      <Grid item xs={1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>WELD</Grid>
                      <Grid item xs={2.2} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>HAZ-R</Grid>
                      <Grid item xs={3.3} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '0px' }}>BASE-R</Grid>
                     
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>1</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>6</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>7</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>12</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>13</Grid>
                      <Grid item xs={1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>18</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>19</Grid>                  
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>24</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>25</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>30</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '0px' }}>31</Grid>
                      
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>2</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>5</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>8</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>11</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>14</Grid>
                      <Grid item xs={1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>17</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>20</Grid>                  
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>23</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>26</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>29</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '0px' }}>32</Grid>
                      
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>3</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>4</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>9</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>10</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>15</Grid>
                      <Grid item xs={1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>16</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>21</Grid>                  
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>22</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>27</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>28</Grid>
                      <Grid item xs={1.1} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '0px' }}>33</Grid>
                      
                      </Grid>
                      </Grid>

                      <Grid item xs={1} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '0.3px'}}>
                                   <br/>GRADIENT<br/>
                            </Grid>
                      <Grid item xs={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '7px' }}><br/>Min<br/></Grid>
                      <Grid item xs={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '7px' }}><br/>Max<br/></Grid>
                      </Grid>
                      </Grid>
                      <Grid item xs={1.5} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>VARIANCE <br/> ( 80 MAX )</Grid>
                    </Grid>
                    </Grid>
                    <Grid>

                    {gethardnessdata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                  <Grid container xs = {12}>
                    <Grid container xs = {12}>
                    <Grid item xs={0.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                      <Grid item xs={1.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px', textAlign:'centre' }}>
                      {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].ID_BATCH : ' '} */}
                      {/* {gethardnessdata?.[i]?.ID_BATCH || <br />} */}
                      {dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}
                      </Grid>
                      <Grid item xs={1} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                      {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].LOM_NO_CAST : ' '} */}
                      {/* {gethardnessdata?.[i]?.LOM_NO_CAST || <br />} */}
                      {dataRow.LOM_NO_CAST !== null ? dataRow.LOM_NO_CAST : <br />}
                      </Grid>
                      <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L1 : <br/>}   */}
                            {/* {gethardnessdata?.[i]?.BASE_L1 || <br />} */}
                            {dataRow.BASE_L1 !== null ? dataRow.BASE_L1 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L2 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L2 || <br />} */}
                            {dataRow.BASE_L2 !== null ? dataRow.BASE_L2 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L3 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L3 || <br />} */}
                            {dataRow.BASE_L3 !== null ? dataRow.BASE_L3 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L6 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L6 || <br />} */}
                            {dataRow.BASE_L6 !== null ? dataRow.BASE_L6 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L5 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L5 || <br />} */}
                            {dataRow.BASE_L5 !== null ? dataRow.BASE_L5 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L4 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L4 || <br />} */}
                            {dataRow.BASE_L4 !== null ? dataRow.BASE_L4 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.58} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L7 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L7 || <br />} */}
                            {dataRow.BASE_L7 !== null ? dataRow.BASE_L7 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L8 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L8 || <br />} */}
                            {dataRow.BASE_L8 !== null ? dataRow.BASE_L8 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_L9 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_L9 || <br />} */}
                            {dataRow.BASE_L9 !== null ? dataRow.BASE_L9 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_L12 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_L12 || <br />} */}
                            {dataRow.HAZ_L12 !== null ? dataRow.HAZ_L12 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_L11 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_L11 || <br />} */}
                            {dataRow.HAZ_L11 !== null ? dataRow.HAZ_L11 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_L10 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_L10 || <br />} */}
                            {dataRow.HAZ_L10 !== null ? dataRow.HAZ_L10 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.59} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_L13 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_L13 || <br />} */}
                            {dataRow.HAZ_L13 !== null ? dataRow.HAZ_L13 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_L14 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_L14 || <br />} */}
                            {dataRow.HAZ_L14 !== null ? dataRow.HAZ_L14 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_L15 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_L15 || <br />} */}
                            {dataRow.HAZ_L15 !== null ? dataRow.HAZ_L15 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.55} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].WELD_18 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.WELD_18 || <br />} */}
                            {dataRow.WELD_18 !== null ? dataRow.WELD_18 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].WELD_17 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.WELD_17 || <br />} */}
                            {dataRow.WELD_17 !== null ? dataRow.WELD_17 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].WELD_16 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.WELD_16 || <br />} */}
                            {dataRow.WELD_16 !== null ? dataRow.WELD_16 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_R19 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_R19 || <br />} */}
                            {dataRow.HAZ_R19 !== null ? dataRow.HAZ_R19 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_R20 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_R20 || <br />} */}
                            {dataRow.HAZ_R20 !== null ? dataRow.HAZ_R20 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_R21 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_R21 || <br />} */}
                            {dataRow.HAZ_R21 !== null ? dataRow.HAZ_R21 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.58} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_R24 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_R24 || <br />} */}
                            {dataRow.HAZ_R24 !== null ? dataRow.HAZ_R24 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_R23 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_R23 || <br />} */}
                            {dataRow.HAZ_R23 !== null ? dataRow.HAZ_R23 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].HAZ_R22 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.HAZ_R22 || <br />} */}
                            {dataRow.HAZ_R22 !== null ? dataRow.HAZ_R22 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.59} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R25 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R25 || <br />} */}
                            {dataRow.BASE_R25 !== null ? dataRow.BASE_R25 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R26 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R26 || <br />} */}
                            {dataRow.BASE_R26 !== null ? dataRow.BASE_R26 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R27 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R27 || <br />} */}
                            {dataRow.BASE_R27 !== null ? dataRow.BASE_R27 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.60} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R30 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R30 || <br />} */}
                            {dataRow.BASE_R30 !== null ? dataRow.BASE_R30 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R29 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R29 || <br />} */}
                            {dataRow.BASE_R29 !== null ? dataRow.BASE_R29 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R28 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R28 || <br />} */}
                            {dataRow.BASE_R28 !== null ? dataRow.BASE_R28 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.61} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R31 : <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R31 || <br />} */}
                            {dataRow.BASE_R31 !== null ? dataRow.BASE_R31 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R32 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R32 || <br />} */}
                            {dataRow.BASE_R32 !== null ? dataRow.BASE_R32 : <br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {gethardnessdata?.length > 0 ? gethardnessdata[i].BASE_R33 :  <br/>} */}
                            {/* {gethardnessdata?.[i]?.BASE_R33 || <br />} */}
                            {dataRow.BASE_R33 !== null ? dataRow.BASE_R33 : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.5} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                        {dataRow.GRN_MIN !== null ? dataRow.GRN_MIN : <br />}
                        {/* {gethardnessdata?.[i]?.GRN_MIN || <br />} */}
                        </Grid>

                        <Grid item xs={0.5} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                        {dataRow.GRN_MAX !== null ? dataRow.GRN_MAX : <br />}
                        {/* {gethardnessdata?.[i]?.GRN_MAX || <br />} */}
                        </Grid>
                      <Grid item xs={1.5}  style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                      {dataRow.GRN_VARIANCE !== null ? dataRow.GRN_VARIANCE : <br />}
                      {/* {gethardnessdata?.[i]?.GRN_VARIANCE || <br />} */}
                        </Grid>

                        
                        </Grid>

                      </Grid>
                      </Grid>
                      
             ))}


{Array.from({ length: Math.max(0, rowsPerPage - gethardnessdata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

                  <Grid container xs = {12}>
                    <Grid container xs = {12}>
                    <Grid item xs={0.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>{<br />}</Grid>
                      <Grid item xs={1.5} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px', textAlign:'centre' }}>
                      {<br />}
                      </Grid>
                      <Grid item xs={1} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                      {<br />}
                      </Grid>
                      <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.58} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.59} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.55} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.6} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.58} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.59} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.60} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.61} colSpan={6} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={0.5} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                        {<br />}
                        </Grid>

                        <Grid item xs={0.5} style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                        {<br />}
                        </Grid>
                      <Grid item xs={1.5}  style={{  fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '7px' }}>
                      {<br />}
                        </Grid>

                        
                        </Grid>

                      </Grid>
                      </Grid>
                      
             ))}


                  </Grid>

                    <Grid style={{  textAlign: 'left', fontSize: '12px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold",  padding: '7px' }}>
                    {/* <Grid style={{ textAlign: 'left',  fontSize: '10px', color: 'black', border: '1px solid black', padding: '7px' }}> */}
                    <Grid item xs = {12}>  <br/></Grid>
                    <Grid item xs = {2}>  <br/></Grid>
                    <Grid item xs = {10}>  Machine ID No. : 124505/2012(Model-ZHV30),DS251876(Model-Durascan 70G5) <br/>
                    All above results are conforming to {gethardnessdata?.length > 0 ? gethardnessdata[0].SPEC_GRADE : ' '} &
                            {gethardnessdata?.length > 0 ? gethardnessdata[0].GD_QAP_NO : ' '}
                    {/* & {gethardnessdata?.length > 0 ? gethardnessdata[0].GD_QAP_NO : ' '} */}
                    
                     <br/>
                    Test Method : {testMethodhrd}
                    </Grid>
                    </Grid>
                    <Grid container style={{  textAlign: 'left', fontSize: '12px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", padding: '7px' }}>
                       <Grid item xs = {12}>  <br/></Grid>
                       <Grid item xs = {0.5}> <br/></Grid>
                       <Grid item xs = {4.5}> Tested By:  {gethardnessdata?.length > 0 ? gethardnessdata[0].TESTED_BY : ' '}</Grid>
                       <Grid item xs={4.5}>Reviewed by: {reviewedBy}</Grid>
                       <Grid item xs = {2.5}> Inspection Authority</Grid>
                       <Grid item xs = {12}>  <br/></Grid>
                    </Grid>

                  </Grid>       
                            
                            <Grid item xs={1}></Grid>
                          </Grid>
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
