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

export default function MaxWidthDialogDROP(props) {
  const [getDROPdata, setgetDROPdata] = useState([]);
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
              axiosAPI.post("api/LDCR001/getDROPdata", data, defaultOptions),
          ]).then(([getDROPdataResponse]) => {
            setgetDROPdata(getDROPdataResponse.data);
                console.log(getDROPdata);
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
  
    const rowsPerPage = 6;
    const numPages = Math.max(1, Math.ceil(getDROPdata?.length / rowsPerPage));


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
                    {getDROPdata?.length === 0 && !loading ? (
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
                top: 20,
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
                            style={{ textAlign: 'center', marginTop: '0px', fontSize: '12px', color: 'black', fontFamily: "Times New Roman" ,borderLeft:'1px solid black',borderRight:'2px solid black',borderTop:'1px solid black'}}
                          >
                            <br />
                            <br />
                            ERW PIPE DIVISION - KHOPOLI <br />
                            DROP WEIGHT TEAR TEST REPORT - PRODUCT (MILL NO.- {getDROPdata?.length > 0 ? getDROPdata[0].MILL_NO : ' '} )
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right',fontSize: '8px', color: 'black', fontFamily: "Times New Roman" ,borderLeft:'1px solid black',borderRight:'2px solid black'}}
                          >
                            TSL/ERW/QC/F-13,Rev 06,Date 13.11.2021            _
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '1px' }}>
                              <p>Client        </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification  & Grade </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderleft: '1px solid black' }}>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].ORDER_ID : ' '}</p>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].PIPE_SIZE1 : ' '}</p>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].SPEC_GRD : ' '}  </p>
                              {/* <p>: {getDROPdata?.length > 0 ? getDROPdata[0].CD_GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '1px' ,borderLeft: '1px solid black'}}>
                              <p>Report No</p>
                              <p>Date          </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '1px',borderRight: '1px solid black' }}>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].REP_NO : ' '} </p>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].CRT_DT : ' '} </p>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].GD_QAP_NO : ' '} </p>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].PROC_SHEET : ' '} </p>
                              <p>: {getDROPdata?.length > 0 ? getDROPdata[0].PROC_NO : ' '} </p>
                            </Grid>

                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                      <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SR.NO</Grid>
                      <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO.</Grid>
                      <Grid item xs={1}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>HEAT NO.</Grid>
                      <Grid item xs={1}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>THICKNESS</Grid>
                      
                      <Grid item xs={2.25} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                        <Grid container>
                              <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                                     Cleavage Fracture <br/> Length
                              </Grid>
                              <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>A (mm)</Grid>
                              <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>B (mm)</Grid>
                        </Grid>
                       </Grid>

                       <Grid item xs={2.25} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                        <Grid container>
                              <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                                 % SHEAR AREA  <br/>  
                              </Grid>
                              <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}>INDIVIDUAL</Grid>
                              <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}>AVERAGE</Grid>
                        </Grid>
                       </Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>RESULT</Grid>
                      <Grid item xs={2.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REMARK</Grid>
                      {getDROPdata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>

                              <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>{pageIndex * rowsPerPage + i + 1} </Grid>
                              <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>{dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>
                              <Grid item xs={1}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.LOM_NO_CAST !== null ? dataRow.LOM_NO_CAST : <br />}</Grid>
                              
                              <Grid container direction="column" item xs = {1}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {dataRow.THICK1 !== null ? dataRow.THICK1?.toFixed(2) : <br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {dataRow.THICK2 !== null ? dataRow.THICK2?.toFixed(2) : <br />}
                              </Grid>
                              </Grid>

                              <Grid container direction="column" item xs = {1.11}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {dataRow.LEN_A1 !== null ? dataRow.LEN_A1?.toFixed(0) : <br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {dataRow.LEN_A2 !== null ? dataRow.LEN_A2?.toFixed(0) : <br />}
                              </Grid>
                              </Grid>

                              <Grid container direction="column" item xs = {1.14}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {dataRow.LEN_B1 !== null ? dataRow.LEN_B1?.toFixed(0) : <br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>
                              {dataRow.LEN_B2 !== null ? dataRow.LEN_B2?.toFixed(0) : <br />}
                              </Grid>
                              </Grid>

                              <Grid container direction="column" item xs = {1.12}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {dataRow.INDV1 !== null ? dataRow.INDV1?.toFixed(0) : <br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {dataRow.INDV1 !== null ? dataRow.INDV2?.toFixed(0) : <br />}
                              </Grid>
                              </Grid>

                              <Grid item xs={1.13} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>{dataRow.AVGDWTT !== null ? dataRow.AVGDWTT?.toFixed(0) : <br />}</Grid>
                              <Grid item xs={1}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>{dataRow.FPT_TEST_PARA_RESULT !== null ? dataRow.FPT_TEST_PARA_RESULT : <br />}</Grid>
                              <Grid item xs={2.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>{dataRow.TEST_REMARK !== null ? dataRow.TEST_REMARK : <br />}</Grid>
                             </Grid>
                      ))}
                      
                      {Array.from({ length: Math.max(0, rowsPerPage - getDROPdata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>


                              <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />} </Grid>
                              <Grid item xs={1.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>{<br />}</Grid>
                              <Grid item xs={1}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{<br />}</Grid>
                              
                              <Grid container direction="column" item xs = {1}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {<br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {<br />}
                              </Grid>
                              </Grid>

                              <Grid container direction="column" item xs = {1.11}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {<br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {<br />}
                              </Grid>
                              </Grid>

                              <Grid container direction="column" item xs = {1.14}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {<br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>
                              {<br />}
                              </Grid>
                              </Grid>

                              <Grid container direction="column" item xs = {1.12}>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {<br />}
                              </Grid>
                              <Grid item xs={0.4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>
                              {<br />}
                              </Grid>
                              </Grid>

                              <Grid item xs={1.13} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                              <Grid item xs={1}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                              <Grid item xs={2.25} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '1px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{<br />}</Grid>
                             </Grid>
                      ))}

                      <Grid item xs = {12}><br/></Grid>
                      <Grid item xs={3.25} style={{ textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}><br/>Specimen Size (length X Width X Thick.) mm<br/><br/></Grid>
                      <Grid item xs={3.265} style={{ textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}><br/>&nbsp;&nbsp;&nbsp;&nbsp; (305 X 76.2 X{getDROPdata?.length ? ( getDROPdata[0].SPECIMEN_THIK !== null ? getDROPdata[0].SPECIMEN_THIK : <br />) : <br />}) mm</Grid>
                      <Grid item xs={3} style={{ textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '1px' }}><br/>Shear Area Calculation<br/><br/></Grid>
                      <Grid item xs={2.485} style={{ textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '1px' }}><br/>Where<br/> </Grid>

                      <Grid item xs={2} style={{ textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}><br/><br/>Specified Requirement<br/><br/><br/></Grid>
                      
                      <Grid container direction="column" item xs = {1.25}>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                       Test Temperature
                       <br/>
                       <br/>
                      </Grid>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/><br/>
                       % Shear Area
                       <br/><br/>
                      </Grid>
                      </Grid>
                      
                      <Grid container direction="column" item xs = {3.265}>
                      <Grid item xs={1} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                      <br/>
                      {getDROPdata?.length ? (   getDROPdata[0].TEST_TEMP !== null ?    'at '+       getDROPdata[0].TEST_TEMP   + '°C'        : <br />) : <br />}
                      
                       <br/>
                      </Grid>
                      <Grid container direction="row" item xs = {3.265}>
                           <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5.5px' }}>Individual</Grid>
                           <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '5.5px' }}>Average</Grid>
                           <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}><br/>{getDROPdata?.length ? (getDROPdata[0].SA_INDV !== null ? getDROPdata[0].SA_INDV: <br />) : <br />}</Grid>
                           <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}><br/>{getDROPdata?.length ? (getDROPdata[0].SA_AVG !== null ? getDROPdata[0].SA_AVG: <br />) : <br />}</Grid>
                      </Grid>
                      </Grid>

                      <Grid item xs={2.6} style={{ textAlign: 'left',fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', padding: '1px' }}>       
                         <Grid variant="caption" sx={{ fontSize: '6px', color: 'black' }}>
                         <br/>
                            % Shear Area = <span style={{ display: 'inline-block', verticalAlign: 'middle', textAlign: 'center' }}>
                              <span style={{ borderBottom: '1px solid black', display: 'block', paddingBottom: '2px' }}>(71-2T) t<sub>s</sub> - 3/4(A x B)</span>
                              <span style={{ paddingTop: '2px', display: 'block' }}>(71-2T)t<sub>s</sub></span>
                            </span> X 100
                          </Grid>
                      </Grid>

                      
                      <Grid item xs={2.885} style={{ textAlign: 'left',fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', padding: '1px' }}>
                                      A = The Width of cleavage fracture at <br/>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;the "one t" line beneath the notch (mm).<br/>
                                      B = The Length of cleavage fracture in <br/>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;between the "two t" line(mm).<br/>
                                      t<sub>s</sub> = DWTT specimen Thickness (mm).<br/>
                                      T = Neglected regions for shear area evaluation<br/>
                                      
                      </Grid>

                    </Grid>  
                    </Grid>
                    <Grid>
                   </Grid>

                   <Grid item xs = {12} style={{  textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold",padding: '3px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; All above results are conforming to {getDROPdata?.length > 0 ? getDROPdata[0].SPEC_GRD : ' '} and {getDROPdata?.length > 0 ? getDROPdata[0].GD_QAP_NO : ' '}.</Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '8px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                    <Grid item xs = {12}> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Test Method : API RP 5L3 Latest Edition.</Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {0.25}><br/></Grid>
                       <Grid item xs = {3.75}> TESTED BY <br/> NAME   {getDROPdata?.length ? (getDROPdata[0].TESTED_BY !== null ? getDROPdata[0].TESTED_BY: <br />) : <br />} </Grid>
                       <Grid item xs = {1}><br/></Grid>
                       <Grid item xs = {3}> Reviewed by:  {props.reviewedBy}</Grid>
                       <Grid item xs = {2}><br/></Grid>
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