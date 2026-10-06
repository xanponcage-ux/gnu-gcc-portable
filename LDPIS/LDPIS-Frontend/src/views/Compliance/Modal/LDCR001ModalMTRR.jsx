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

export default function MaxWidthDialogMTRR(props) {
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
  const [getmechanicaldata, setgetmechanicaldata] = useState([]);

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
              axiosAPI.post("api/LDCR002/getmechanicaldata", data, defaultOptions),
          ]).then(([getmechanicaldataResponse]) => {
            setgetmechanicaldata(getmechanicaldataResponse.data);
                console.log(getmechanicaldata);
                
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
  
    const rowsPerPage = 35;
    const numPages = Math.max(1, Math.ceil(getMGERdata?.length / rowsPerPage));

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
          {getMGERdata?.length === 0 && !loading ? (
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
                top: 10,
                right: 35,
                height: '20px', // Adjust the height as needed
                margin: '10px' // Adjust the margin as needed
              }}
            />
                <Grid 
                
                // key={i} 
                style={{ height: '120mm', width: '160mm', justifyContent: 'center', display: 'flex' }}>
                  <Grid item xs={12}>

                    <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center" marginTop={'-45px'}>
                     
                   </Grid>
                    

                    <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                      <Grid item xs={12}>

                        <Grid item xs={12}>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'center', marginTop: '75px', fontSize: '12px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            ERW PIPE DIVISION - KHOPOLI <br />
                            MECHANICAL TEST  REPORT - RAW (MILL NO. - ) 
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '7px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-11,Rev 05,Date 13.11.2021
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '1px' }}>
                              <p>Client       </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade  </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderleft: '1px solid black' }}>
                              <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].ENC_MARK_CUST_NAME : ' ' }</p>
                              <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].ORDER_ID : ' '}</p>
                              <p>: </p>
                              <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].SPEC_GRD : ' '}  </p>
                              {/* <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].CD_GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '1px' ,borderLeft: '1px solid black'}}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                              <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].REP_NO : ' ' }</p>
                              <p>: </p>
                              <p>: </p>
                              <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].PROC_SHEET : ' '}  </p>
                              <p>: </p>
                            </Grid>

                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                      <Grid item xs={0.5}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SR<br/>NO</Grid>
                      <Grid item xs={1}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO.</Grid>
                      <Grid item xs={0.8}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>HEAT NO.</Grid>
                      <Grid item xs={0.8}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>LOCATION</Grid>
                      <Grid item xs={6.9} colSpan={6} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center'  }}>
                         Tensile Test
                  </Grid>

                             <Grid item xs={1.05} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>WIDTH <br/> (mm)</Grid>
                             <Grid item xs={0.95} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>THICK <br/> (mm)</Grid>
                             <Grid item xs={1.05} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>AREA <br/> (mm²)</Grid>
                             <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>MGL <br/> (mm)</Grid>
                             <Grid item xs={0.95} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>YL <br/> (KN)</Grid>
                             <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>YS <br/> (MPa)</Grid>
                             <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>UTL <br/> (KN)</Grid>
                             <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>UTS <br/> (MPa)</Grid>
                             <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}>FGL <br/> (mm)</Grid>
                             <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}><br/> % EL</Grid>
                             <Grid item xs={0.95} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' , padding: '2px'}}><br/> YS / UTS</Grid>
                             <Grid item xs={1.05} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black', padding: '2px' }}>Broken <br/> Location</Grid>
                             </Grid>
                             </Grid>
                      <Grid item xs={1} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>RESULTS</Grid>
                      <Grid item xs={1} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REMARKS</Grid>
                     
                      {/* {Array.from({length: Math.max(getmechanicaldata?.length, 4) }).map((_, i) => ( */}
                         {Array.from({length: Math.max(4, 4) }).map((_, i) => (
                  <Grid key={i} container>
                      <Grid container>

                      <Grid item xs={0.5} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{i < getmechanicaldata?.length ? i + 1 :  <br />}</Grid>
                      <Grid item xs={1} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {getmechanicaldata?.length > 0 ? getmechanicaldata[0].LOM_ID_BATCH : ' '}</Grid>
                      <Grid item xs={0.8} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {getmechanicaldata?.length > 0 ? getmechanicaldata[0].LOM_NO_CAST : ' '}</Grid>

                      <Grid container direction="column" item xs = {0.8}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>TBT<br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>TWT<br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.6}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       {getmechanicaldata?.length > 0 && getmechanicaldata[0].FPT_CD_LOC === 'TBT' ? getmechanicaldata[11].FPT_TEST_PARA_VAL.toFixed(3) :' '} 
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      {getmechanicaldata?.length > 0 && getmechanicaldata[16].FPT_CD_LOC === 'TWT' ? getmechanicaldata[28].FPT_TEST_PARA_VAL.toFixed(3) : ' '} 
                      <br/><br/>
                      </Grid>
                      </Grid>



                      <Grid container direction="column" item xs = {0.55}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      
                      <Grid container direction="column" item xs = {0.59}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      
                      <Grid container direction="column" item xs = {0.58}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      
                      <Grid container direction="column" item xs = {0.55}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      
                      <Grid container direction="column" item xs = {0.57}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.58}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.56}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.57}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.57}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.57}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.61}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {1}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {1}>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                       <br/>
                       
                       <br/><br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      
                      <br/><br/>
                      </Grid>
                      </Grid>
                      </Grid>
                      </Grid>
             ))}

                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>


          
 <Grid container>
                    <Grid item xs={2.2} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px' }}>
                              <p style={{  textAlign: 'left',fontSize: '8.5px'}}>Specified Requirements  </p>
                              <p><br/> </p>
                              <p>Yield Strength      </p>
                              <p>Tensile Strength at base      </p>
                              <p>Tensile Strength at Weld      </p>
                              <p>%El..............        </p>
                              <p>YS/UTS Ratio        </p>
                    </Grid>

                    <Grid item xs={0.5} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                    </Grid>

                    <Grid item xs={0.8} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                              <p style={{  textAlign: 'left',fontSize: '8.5px'}}> <span>Min.</span></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                    </Grid>
                    <Grid item xs={0.8} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                    <p style={{  textAlign: 'left',fontSize: '8.5px'}}> <span>Max.</span></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                    </Grid>
                    <Grid item xs={1.2} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                    <p style={{  textAlign: 'left',fontSize: '8.5px'}}> <span>Unit.</span></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                              <p><br/></p>
                    </Grid>               

                    <Grid item xs={2.5} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px' }}>
                              <p style={{  textAlign: 'left',fontSize: '8.5px'}}>Instruments used for testing </p>
                              <p><br/>                      </p>
                              <p>UTM                        </p>
                              <p>Extensometer Sr.No         </p>
                              <p>Micrometer 0-25mm ID No.   </p>
                              <p>Vernier Calliper ID No.    </p>
                              <p>Test Method    </p>
                    </Grid>
                    <Grid item xs={3.5} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                              <p> <br/></p>
                              <p> <br/></p>
                              <p>:  199892(Model-Z1200)</p>
                              <p>:  269852</p>
                              <p>:  BSL/VC 02/19030</p>
                              <p>:</p>
                              <p>:</p>
                    </Grid>
                    </Grid>
                    <Grid style={{  textAlign: 'left',fontSize: '6px', color: 'black',border: '1px solid black', padding: '1px' }}>
                      LEGENDS: MGL -  Marked Gauge Length, YL-Yield Load, YS - Yield Strength, UTL - Ultimate Tensile Strength, FGL - Final Gauge Length, EL - Elongation, BIW - Broken in Weld, BOW - Broken out of Weld
                    </Grid>

                    <Grid container style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '1px' }}>
                    All above results are conforming to APL 5L(46TH EDITION 2018)
                       <Grid item xs = {12}>  <br/></Grid>
                       <Grid item xs = {12}>  <br/></Grid>
                       <Grid item xs = {0.5}>  <br/></Grid>
                       <Grid item xs = {3.5}> Tested By:</Grid>
                       <Grid item xs = {4}> Reviewed by:</Grid>
                       <Grid item xs = {4}> Inspection Authority</Grid>
                       <Grid item xs = {12}>  <br/></Grid>
                    </Grid>
                           
                    </Grid>
 
                            
                            <Grid item xs={1}></Grid>
                          </Grid>
                        </Grid>
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
            />
          </Grid>
        </DialogContent>
        
      </Dialog>
    </React.Fragment >
  );
}