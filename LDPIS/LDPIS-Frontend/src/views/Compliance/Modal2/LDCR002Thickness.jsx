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

export default function MaxWidthDialogThick(props) {
  const [getthick, setgetthick] = useState([]);
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
              axiosAPI.post("api/LDCR002/getthickness", data, defaultOptions),
          ]).then(([getthickResponse]) => {
            setgetthick(getthickResponse.data);
                console.log(getthick);
                
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
  
    const rowsPerPage = 12;
    const numPages = Math.max(1, Math.ceil(getthick?.length / rowsPerPage));

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
          {getthick?.length === 0 && !loading ? (
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
                            COATING THICKNESS INSPECTION REPORT
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '12px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                           FORMAT.NO : TSL/COAT/QC/F-53 Rev 02,Date 13.11.2021            _
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
                              <p>: {getthick?.length > 0 ? getthick[0].CLIENT : ' '} </p>
                              <p>: {getthick?.length > 0 ? getthick[0].PO_REF_NO : ' '}</p>
                              <p>: {getthick?.length > 0 ? getthick[0].SPEC : ' '}  </p>
                              <p>: {getthick?.length > 0 ? getthick[0].ACCEPTANCE_CRITERIA : ' '}  </p>
                              <p>: {getthick?.length > 0  ? getthick[0].PROCESS_SHEET_NO : ' '} </p>
                              {/* <p>: {getthick?.length > 0  ? getthick[0].ACCEPTANCE_CRITERIA : ' '} </p>
                              <p>: {getthick?.length > 0 ? getthick[0].PROCESS_SHEET_NO : ' '} </p> */}
                              
                              {/* <p>: {getthick?.length > 0 ? getthick[0].TYPE_OF_COATING : ' '}  </p> */}
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
                              <p>: {getthick?.length > 0  ? `${getthick[0].REP_NO}-${pageIndex + 1}`: ' '} </p>
                              <p>: {getthick?.length > 0  ? getthick[0].DATE_SHIFT : ' '} </p>
                              <p>: {getthick?.length > 0  ? getthick[0].PIPE_SIZE : ' '} </p>
                              <p>: {getthick?.length > 0  ? getthick[0].TYPE_OF_COATING : ' '} </p>
                               <p>: {props?.wiNo} </p> 
                              {/* <p>: {getthick?.length > 0  ? getthick[0].PROCEDURE_WI_NO : ' '} </p> */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                      <Grid item xs={0.5}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SR.NO.</Grid>
                      <Grid item xs={1}       style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO</Grid>
                      <Grid item xs={0.75}    style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>ASL NO</Grid>
            
                                            <Grid item xs={4.8} colSpan={6} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                                              <Grid container>
                                                    <Grid item xs={12} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                                                    TOTAL COATING THICKNESS MINIMUM {getthick?.length > 0  ? getthick[0].TCP_CP2_TOT_CTHICK_MIN : ' '}  (MM) REQUIRED THICKNESS
                                                    </Grid>
                                                    <Grid item xs={3} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>3 O'CLOCK</Grid>
                                                    <Grid item xs={3} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>6 O'CLOCK</Grid>
                                                    <Grid item xs={3} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black', padding: '3px' }}>9 O'CLOCK</Grid>
                                                    <Grid item xs={3} style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' , padding: '3px'}}>12 O'CLOCK</Grid>
                                              </Grid>
                                             </Grid>                                           

                      <Grid item xs={0.75}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>VISUAL OF COATED PIPE</Grid>
                      <Grid item xs={0.75}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>COATING STATUS</Grid>
                      <Grid item xs={2.15}      style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>TEST ON PIPE</Grid>
                      <Grid item xs={1.3}       style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REMARKS / <br /> QUENCHING TEMP (°C)</Grid>

                      {getthick
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                            <Grid item xs={0.5}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                            <Grid item xs={1}    style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_BATCH_NO !== null ? dataRow.TBP_BATCH_NO : <br />}</Grid>
                            <Grid item xs={0.75} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_ASL_NO_80 !== null ? dataRow.TBP_ASL_NO_80 : <br />}</Grid>
                            
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_1_120 !== null ? Number(dataRow.TBP_COT_THK_1_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_2_120 !== null ? Number(dataRow.TBP_COT_THK_2_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_3_120 !== null ? Number(dataRow.TBP_COT_THK_3_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_4_120 !== null ? Number(dataRow.TBP_COT_THK_4_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_5_120 !== null ? Number(dataRow.TBP_COT_THK_5_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_6_120 !== null ? Number(dataRow.TBP_COT_THK_6_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_7_120 !== null ? Number(dataRow.TBP_COT_THK_7_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_8_120 !== null ? Number(dataRow.TBP_COT_THK_8_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COT_THK_9_120 !== null ? Number(dataRow.TBP_COT_THK_9_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>{dataRow.TBP_COT_THK_10_120 !== null ? Number(dataRow.TBP_COT_THK_10_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>{dataRow.TBP_COT_THK_11_120 !== null ? Number(dataRow.TBP_COT_THK_11_120).toFixed(2) : <br />}</Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>{dataRow.TBP_COT_THK_12_120 !== null ? Number(dataRow.TBP_COT_THK_12_120).toFixed(2) : <br />}</Grid>
                            
                            <Grid item xs={0.75}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COAT_STAS_120 !== null ? dataRow.TBP_COAT_STAS_120 : <br />}</Grid>
                            <Grid item xs={0.75}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_COAT_STAS_120 !== null ? dataRow.TBP_COAT_STAS_120 : <br />}</Grid>
                            <Grid item xs={2.15} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TEST_NAME !== null ? dataRow.TEST_NAME : <br />}</Grid>
                            <Grid item xs={1.3}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px'  }}>{dataRow.TBP_QTEMP_120 !== null ? dataRow.TBP_QTEMP_120 : <br />}</Grid>
                         </Grid>
                      ))}


{Array.from({ length: Math.max(0, rowsPerPage - getthick.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

                            <Grid item xs={0.5}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={1}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.75}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.4}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>

                            <Grid item xs={0.75}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={0.75}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={2.15}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            <Grid item xs={1.3}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '5px' }}>  {<br />} </Grid>
                            
                         </Grid>
                      ))}

                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>


                      <Grid container style={{textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                               <Grid item xs = {0.1}>{<br/>}</Grid>
                               <Grid item xs = {11.9}>ABOVE RESULTS ARE CONFORMING TO SPECIFICATION: {getthick?.length > 0 ? getthick[0].SPEC : '  '} & QAPNO:{getthick?.length > 0 ? getthick[0].ACCEPTANCE_CRITERIA : '  '} AND FOUND SATISFACTORY</Grid>
                       </Grid>
                      {/* <Grid container style={{textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                               <Grid item xs = {0.1}>{<br/>}</Grid>
                               <Grid item xs = {11.9}>REMARKS : 1.PIPE MARKING DETAILS AS PER PIPE MILL TALLY SHEET EXCEPT CUTTING PIPE LENGTH AFTER COATING.</Grid>
                               <Grid item xs = {0.1}>{<br/>}</Grid>
                               <Grid item xs = {11.9}>2.VISUAL INSPECTION ,MARKING OF PIPES,BARCODE STICKER ,CUT BACK,BAVEL ANGLE,INSIDE CLEANING,PIPE NUMBER,EACH PIPE HOLIDAY TESTING & LOW STRESSHARD PUNCG CHECKED ALSO VERIFY BY TPI & FOUND SATISFACTORY AS PER APPROVED QAP.</Grid>
                       </Grid> */}

                     <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black' }}>
                      <Grid item xs={12}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5px',  textAlign: 'Center' }}>INSTRUMENT USED</Grid>
                      {/* <Grid item xs={0.75} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>SR No.</Grid> */}
                      <Grid item xs={3} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                      <Grid item xs={3} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>INSTRUMENT ID</Grid>
                      <Grid item xs={3} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                      <Grid item xs={3} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center' }}>INSTRUMENT ID</Grid>
                      {/* <Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                      <Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>INSTRUMENT ID</Grid>
                      <Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                      <Grid item xs={1.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>INSTRUMENT ID</Grid> */}
                       

                      <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}>{props?.instrumentName}  {<br/>} </Grid>
                      <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center'  }}>{props?.instrumentId} </Grid>
                      
                      <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',  textAlign: 'Center'  }}>{props?.instrumentName2}</Grid>
                      <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px'  ,  textAlign: 'Center'  }}>{props?.instrumentId2}</Grid>
                      
                      {/* <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center'  }}>{props?.instrumentName3}</Grid>
                      <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center'  }}>{props?.instrumentId3}</Grid>
                      
                      <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center'  }}>{props?.instrumentName4}</Grid>
                      <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center'  }}>{props?.instrumentId4}</Grid> */}
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