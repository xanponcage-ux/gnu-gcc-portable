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



export default function MaxWidthDialogIP(props) {
  const { reviewedBy,specimen ,testMethod,SampleOrientation } = props;
  const [getImpactData, setGetImpactData] = useState([]);
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
              axiosAPI.post("api/LDCR001/getimpactdata", data, defaultOptions),
          ]).then(([getImpactDataResponse]) => {
            setGetImpactData(getImpactDataResponse.data);
                console.log(getImpactData);
                
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

  //const pageStyle = `
  const pageStyle = `
  @page {
    size: A4 landscape;
    margin: 4mm;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      zoom: 140%;
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
  
    const rowsPerPage = 5;
    const numPages = Math.max(1, Math.ceil(getImpactData?.length / rowsPerPage));

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
                    {getImpactData?.length === 0 && !loading ? (
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
                            style={{ textAlign: 'center', marginTop: '35px', fontSize: '14px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            ERW PIPE DIVISION - KHOPOLI<br />
                            IMPACT TEST REPORT - PRODUCT ( MILL NO.- {getImpactData?.length > 0 ? getImpactData[0].MILL_NO : ' '} )
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '8px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-12,Rev 06,Date 13.11.2021
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '1px' }}>
                              <p>Client          </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade  </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].ORDER_ID : ' '}</p>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].PIPE_SIZE : ' '}</p>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].SPEC_GRD : ' '}  </p>
                              {/* <p>: {getImpactData?.length > 0 ? getImpactData[0].CD_GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '1px' }}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid> 
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].REP_NO : ' '} </p>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].CRT_DT : ' '}</p>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].GD_QAP_NO : ' '} </p>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].PROC_SHEET : ' '} </p>
                              <p>: {getImpactData?.length > 0 ? getImpactData[0].ID_MILLPROC : ' '} </p>
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '8px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container >     
                    <Grid container xs = {12}>
                      <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'   ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>SR. NO.</Grid>
                      <Grid item xs={1.1}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>PIPE NO.</Grid>
                      <Grid item xs={0.8}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'      ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>HEAT NO.</Grid>
                      <Grid item xs={0.8}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px'      ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>LOCATION</Grid>

                      <Grid item xs={5.8} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                                   Charphy V-Notch <br/> Absorbed Energy (Joule)
                            </Grid>
 
                      <Grid item xs={3} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>1</Grid>
                      <Grid item xs={3} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>2</Grid>
                      <Grid item xs={3} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black',padding: '0px' }}>3</Grid>
                      <Grid item xs={3} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '0px' }}>AV.</Grid>
                      </Grid>
                      </Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>RESULTS</Grid>
                      <Grid item xs={2}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REMARKS</Grid>
                    </Grid>
                    </Grid>
                    <Grid>
                    {getImpactData
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                    <Grid item xs={0.5} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {pageIndex * rowsPerPage + i + 1}</Grid>
                      <Grid item xs={1.1} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign:'centre',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>
                      {dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>
                      <Grid item xs={0.8} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                      {dataRow.LOM_NO_CAST !== null ? dataRow.LOM_NO_CAST : <br />}</Grid>
                      <Grid item xs={0.8} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                                  Base
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                                  Weld
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                                  Haz
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', borderBottom:'1px solid black' ,padding: '0px',}}>
                                  % Shear
                            </Grid>
                        </Grid>
                        
                        </Grid>

                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {dataRow.BASE1 !== null ? dataRow.BASE1 : <br />}
                            {/* {getImpactData?.[i]?.BASE1?.toFixed(0) || <br />} */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {getImpactData?.[i]?.WELD1?.toFixed(0) || <br />} */}
                            {dataRow.WELD1 !== null ? dataRow.WELD1.toFixed(0) : <br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {getImpactData?.[i]?.HAZ1?.toFixed(0) || <br />} */}
                            {dataRow.HAZ1 !== null ? dataRow.HAZ1.toFixed(0) : <br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {/* {getImpactData?.[i]?.SA1?.toFixed(0) || <br />} */}
                            {dataRow.SA1 !== null ? dataRow.SA1.toFixed(0) : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        
                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {dataRow.BASE2 !== null ? dataRow.BASE2 : <br />}
                            {/* {getImpactData?.[i]?.BASE1?.toFixed(0) || <br />} */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {getImpactData?.[i]?.WELD1?.toFixed(0) || <br />} */}
                            {dataRow.WELD2 !== null ? dataRow.WELD2.toFixed(0) : <br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {getImpactData?.[i]?.HAZ1?.toFixed(0) || <br />} */}
                            {dataRow.HAZ2 !== null ? dataRow.HAZ2.toFixed(0) : <br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {/* {getImpactData?.[i]?.SA1?.toFixed(0) || <br />} */}
                            {dataRow.SA2 !== null ? dataRow.SA2.toFixed(0) : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {dataRow.BASE3 !== null ? dataRow.BASE3 : <br />}
                            {/* {getImpactData?.[i]?.BASE1?.toFixed(0) || <br />} */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {getImpactData?.[i]?.WELD1?.toFixed(0) || <br />} */}
                            {dataRow.WELD3 !== null ? dataRow.WELD3.toFixed(0) : <br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {/* {getImpactData?.[i]?.HAZ1?.toFixed(0) || <br />} */}
                            {dataRow.HAZ3 !== null ? dataRow.HAZ3.toFixed(0) : <br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {/* {getImpactData?.[i]?.SA1?.toFixed(0) || <br />} */}
                            {dataRow.SA3 !== null ? dataRow.SA3.toFixed(0) : <br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {dataRow.BASEAVG !== null ? dataRow.BASEAVG.toFixed(0) : <br />}
                            {/* {getImpactData?.[i]?.BASEAVG?.toFixed(0) || <br />} */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {dataRow.WELDAVG !== null ? dataRow.WELDAVG.toFixed(0) : <br />}
                            {/* {getImpactData?.[i]?.WELDAVG?.toFixed(0) || <br />} */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {dataRow.HAZAVG !== null ? dataRow.HAZAVG.toFixed(0) : <br />}
                            {/* {getImpactData?.[i]?.HAZAVG?.toFixed(0) || <br />} */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {dataRow.SA_AVG1 !== null ? dataRow.SA_AVG1.toFixed(0) : <br />}
                            {/* {getImpactData?.[i]?.SA_AVG1?.toFixed(0) || <br />} */}
                            </Grid>
                        </Grid>
                        </Grid>


                        <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                        {/* {getImpactData?.length > 0 ? getImpactData[i].TEST_PARA_RESULT :  <br/>} */}
                        {dataRow.SA_AVG1 !== null ? dataRow.TEST_PARA_RESULT : <br />}
                        {/* {getImpactData?.[i]?.TEST_PARA_RESULT || <br />} */}
                        </Grid>
                      <Grid item xs={2}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                      {/* {getImpactData?.length > 0 ? getImpactData[i].TEST_REMARK :  <br/>} */}
                      {dataRow.TEST_REMARK !== null ? dataRow.TEST_REMARK : <br />}
                      {/* {getImpactData?.[i]?.TEST_REMARK || <br />} */}

                        </Grid>
                        
                        </Grid>
             ))}

{Array.from({ length: Math.max(0, rowsPerPage - getImpactData.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

                    <Grid item xs={0.5} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>  {<br />}</Grid>
                      <Grid item xs={1.1} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign:'centre',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>
                      {<br />} </Grid>
                      <Grid item xs={0.8} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                      {<br />}</Grid>
                      <Grid item xs={0.8} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                                  Base
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                                  Weld
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                                  Haz
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', borderBottom:'1px solid black' ,padding: '0px',}}>
                                  % Shear
                            </Grid>
                        </Grid>
                        
                        </Grid>

                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        
                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={1.45} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderTop: '1px solid black', padding: '0px', }}>
                            {<br />}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderTop: '1px solid black', padding: '0px',}}>
                            {<br />}
                            </Grid>
                        </Grid>
                        </Grid>


                        <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                        {<br />}
                        </Grid>
                      <Grid item xs={2}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                      {<br />}

                        </Grid>
                        
                        </Grid>
             ))}

                  </Grid>
                    <Grid container>

                    <Grid item xs={1.4} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
<Grid container>
    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid black', padding: '0px' }}>
    <br/> Specified Requirements<br/>
    </Grid>
    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid black', padding: '0px' }}>
    Absorbed Energy (Joule)
    </Grid>
    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderBottom: '1px solid black', padding: '0px' }}>
    Shear Area (%)
    </Grid>
</Grid>
</Grid>


<Grid item xs={2.33} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
<Grid container>
    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', padding: '1px' }}>
        Base
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
        Ind
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
        Avg
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p> {getImpactData?.length > 0 && getImpactData[0].BASE_IND !== null ? getImpactData[0].BASE_IND : <br/>} </p>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p> {getImpactData?.length > 0  && getImpactData[0].BASE_AVG !== null ? getImpactData[0].BASE_AVG : <br/>} </p>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p>{getImpactData?.length > 0  && getImpactData[0].SHEAR_IND !== null? getImpactData[0].SHEAR_IND : <br/>} </p>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p>{getImpactData?.length > 0 && getImpactData[0].SHEAR_AVG !== null ? getImpactData[0].SHEAR_AVG : <br/>} </p>
    </Grid>
</Grid>
</Grid>
<Grid item xs={2.52} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
<Grid container>
    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '1px'}}>
        WELD
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
        Ind
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
        Avg
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p> {getImpactData?.length > 0  && getImpactData[0].WELD_IND !== null ? getImpactData[0].WELD_IND : <br/>} </p>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p>{getImpactData?.length > 0  && getImpactData[0].WELD_AVG !== null? getImpactData[0].WELD_AVG : <br/>} </p>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <br/>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <br/>
    </Grid>
</Grid>
</Grid>

<Grid item xs={2.5} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
<Grid container>
    <Grid item xs={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '1px'}}>
        HAZ
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
        Ind
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
        Avg
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p>{getImpactData?.length > 0  && getImpactData[0].HAZ_IND !== null ? getImpactData[0].HAZ_IND : <br/>} </p>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <p> {getImpactData?.length > 0 && getImpactData[0].HAZ_AVG !== null ? getImpactData[0].HAZ_AVG : <br/>} </p>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <br/>
    </Grid>
    <Grid item xs={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', border: '1px solid black', padding: '1px' }}>
    <br/>
    </Grid>
</Grid>
</Grid>

                        <Grid item xs={2.675} colSpan={6} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '0px', textAlign: 'center' }}>
                     <Grid container>
                        <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "Calibri", fontWeight: 'bold', textAlign: 'left',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>
                       
                               Specimen Sub Size :- {specimen} <br/>
                               (All the values are reported in full size<br/> specimen(10X10X55)mm)
                               <br/>
                       
                             
                        </Grid>
                        </Grid>
                        </Grid>

                        <Grid item xs={1.39} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid black', borderLeft: '1px solid black' ,padding: '3px' }}>
                           Temperature
                        </Grid>
                        <Grid item xs={2.33} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid black' , borderLeft: '1px solid black',padding: '3px'}}>
                        {getImpactData?.length > 0 ? getImpactData[0].TEMPERATURE  : <br/>}°C
                        </Grid>
                        <Grid item xs={2.52} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderRight: '1px solid black',padding: '3px'}}>
                        {getImpactData?.length > 0 ? getImpactData[0].TEMPERATURE  : <br/>}°C
                        </Grid>
                        <Grid item xs={2.52} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , borderRight: '1px solid black',padding: '3px'}}>
                        {getImpactData?.length > 0 ? getImpactData[0].TEMPERATURE  : <br/>}°C
                        </Grid>
                        <Grid item xs={2.575} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                        Sample Orientation :- {SampleOrientation}
                        </Grid>
                        </Grid>

                <Grid style={{  textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '1px' }}>
                  Note :- All the dimensions are taken with caliberated instruments   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                     Machine ID No.- 199765/2011(Model -Z/R RKP450)
                </Grid>
                <Grid style={{  textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '1px' }}>
                  ABBREVIATION - SA- Shear Area,IND - Individual ,AVG- Average
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp; 
                  &nbsp;&nbsp;&nbsp;&nbsp; 
                  Test Method :- {testMethod}
                </Grid>
                <Grid container style={{  textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '1px' }}>
                   <Grid item xs = {12}>  <br/></Grid>
                   <Grid item xs = {12}>  <br/></Grid>
                   <Grid item xs = {0.5}> <br/></Grid>
                   <Grid item xs = {4.5}> Tested By:  {getImpactData?.length > 0 ? getImpactData[0].TESTED_BY : ' '}</Grid>
                   <Grid item xs={4.5}>Reviewed by: {reviewedBy}</Grid>
                   <Grid item xs = {2.5}> Inspection Authority</Grid>
                   <Grid item xs = {12}>  <br/></Grid>
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
