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

export default function MaxWidthhotwaterimer(props) {
  const [gethotwater, setgethotwater] = useState([]);
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

  const { reviewedBy, instrumentName, instrumentId, wiNo } = props;

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
              axiosAPI.post("api/LDCR003/getHOTWATERIMMERSION48", data, defaultOptions),
          ]).then(([gethotwaterResponse]) => {
            setgethotwater(gethotwaterResponse.data);
                console.log(gethotwater);
                
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

      const formattedPrintDateShift = props?.printdate
  ? `${props.printdate.toLocaleDateString("en-GB").replace(/\//g, ".")} & ${
       props?.printShift?.value || ""
    }`
  : "";

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
    const numPages = Math.max(1, Math.ceil(gethotwater?.length / rowsPerPage));

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
          {gethotwater?.length === 0 && !loading ? (
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
                            style={{ textAlign: 'center', marginTop: '45px', fontSize: '17px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            PIPE COATING DIVISION <br />
                            LAB TEST REPORT
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '11px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                           FORMAT NO : TSL/COAT/QC/F-42 Rev 05,Date 13.11.2021            _
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={1.5} style={{ fontSize: '12.5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                              <p>Client        </p> 
                              <p>Project Name         </p> 
                              <p>PO.No.         </p>
                              <p>Pipe Size           </p>
                              {/* <p>Specification  </p> */}
                              <p>Type of Coating  </p>
                              {/* <p>Test Start Date </p>
                              <p>Test Finish Date  </p> */}
                            </Grid>
                            <Grid item xs={6} style={{ fontSize: '12.5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderleft: '1px solid black' }}>
                              <p>: {gethotwater?.length > 0 ? gethotwater[0].CLIENT : ' '} </p>
                              <p>: {gethotwater?.length > 0 ? gethotwater[0].PROJECTNAME : ' '}</p>
                              <p>: {gethotwater?.length > 0 ? gethotwater[0].PO_REF_NO : ' '} </p>
                              {/* <p>: {gethotwater?.length > 0 ? gethotwater[0].SPEC : ' '}  </p> */}
                              <p>: {gethotwater?.length > 0 ? gethotwater[0].PIPE_SIZE : ' '}  </p>
                              <p>: {gethotwater?.length > 0 ? gethotwater[0].TYPE_OF_COATING : ' '}  </p>
                              {/* <p>: {gethotwater?.length > 0 ? gethotwater[0].TEST_ED_DT : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={1.5} style={{ fontSize: '12.5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date & Shift           </p>
                              <p>Process Sheet No</p>
                              <p>Procedure/WI No.     </p>
                              <p>Production Date</p>
                              {/* <p>Test Finish Time  </p> */}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '12.5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {gethotwater?.length > 0  ? `${gethotwater[0].REP_NO}-${pageIndex + 1}` : ' '} </p>
                              <p>: {formattedPrintDateShift}</p>
                              <p>: {gethotwater?.length > 0  ? gethotwater[0].PROCESS_SHEET_NO : ' '} </p>
                              <p>: {props?.wiNo} </p>
                              <p>: {gethotwater?.length > 0  ? gethotwater[0].DATE_SHIFTQ : ' '} </p>
                              {/* <p>: {gethotwater?.length > 0  ? gethotwater[0].TEST_ED_TIME : ' '} </p> */}
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >

                      <Grid item xs={0.5}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SR.NO.</Grid>
                      <Grid item xs={2.9}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>MATERIAL DESCRIPTION</Grid>
                      <Grid item xs={1.1}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>BATCH NO.</Grid>
                      <Grid item xs={1.7}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>TEST DESCRIPTION</Grid>
                      <Grid item xs={1.7}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>TEST METHOD</Grid>
                      <Grid item xs={1.5}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REQUIREMENT</Grid>
                      <Grid item xs={1.5}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>TEST RESULT</Grid>
                      <Grid item xs={1.1}   style={{ fontSize: '12px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REMARKS</Grid>

                    
                      {gethotwater
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                            <Grid item xs={0.5}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'   }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                            <Grid item xs={2.9}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.MAT_DESC !== null ? dataRow.MAT_DESC : <br />}</Grid>
                            <Grid item xs={1.1}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'   }}>{dataRow.BATCH_NO !== null ? dataRow.BATCH_NO : <br />}</Grid>
                            <Grid item xs={1.7}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'   }}>{dataRow.TEST_DESC !== null ? dataRow.TEST_DESC : <br />}</Grid>
                            <Grid item xs={1.7}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>{dataRow.TEST_METHOD  !== null ? dataRow.TEST_METHOD: <br />}</Grid>
                            <Grid item xs={1.5}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'   }}>{dataRow.REQUIREMENT !== null ? dataRow.REQUIREMENT : <br />}</Grid>
                            <Grid item xs={1.5}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'   }}>{dataRow.TEST_RESULT1 !== null ? dataRow.TEST_RESULT1 : <br />}</Grid>
                            <Grid item xs={1.1}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderRight: '1px solid black', padding: '3px'   }}>{dataRow.REMARKS !== null ? dataRow.REMARKS : <br />}</Grid>
                         </Grid>
                      ))}


{Array.from({ length: Math.max(0, rowsPerPage - gethotwater.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

                            <Grid item xs={0.5}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>  {<br />}</Grid>
                            <Grid item xs={2.9}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>  {<br />}</Grid>
                            <Grid item xs={1.1}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>  {<br />}</Grid>
                            <Grid item xs={1.7}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}> {<br />}</Grid>
                            <Grid item xs={1.7}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}> {<br />}</Grid>
                            <Grid item xs={1.5}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}> {<br />}</Grid>
                            <Grid item xs={1.5}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}> {<br />}</Grid>
                            <Grid item xs={1.1}   style={{ fontSize: '11px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}> {<br />}</Grid>
                         </Grid>
                      ))}

                    </Grid>  
                    </Grid>
                    <Grid>
 </Grid>
                       <Grid container style={{textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black',padding: '4px',borderRight: '1px solid black' }}>
                       <Grid item xs = {0.1}>{<br/>}</Grid>
                       <Grid item xs = {11.9}>ABOVE RESULTS ARE CONFORMING TO SPECIFICATION: {gethotwater?.length > 0 ? gethotwater[0].SPEC : '  '} & QAPNO:{gethotwater?.length > 0 ? gethotwater[0].QAP_NO : '  '} </Grid>
                       
                       </Grid>

                     <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black' }}>
                      <Grid item xs={12}   style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center' }}>INSTRUMENT USED</Grid>
                      <Grid item xs={0.75} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center' }}>SR No.</Grid>
                      <Grid item xs={5.75} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center' }}>INSTRUMENT NAME</Grid>
                      <Grid item xs={5.5}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,  textAlign: 'Center' }}>INSTRUMENT ID/SERIAL NO.</Grid>
                       
                          <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>1<br/></Grid>
                          <Grid item xs={5.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>{props?.instrumentName1}</Grid>
                          <Grid item xs={5.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,  textAlign: 'Center'  }}>{props?.instrumentId1}</Grid>
                          {/* <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>2<br/></Grid>
                          <Grid item xs={5.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>{props?.instrumentName2}</Grid>
                          <Grid item xs={5.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,  textAlign: 'Center'  }}>{props?.instrumentId2}</Grid>
                          <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>3<br/></Grid>
                          <Grid item xs={7.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>{props?.instrumentName3}</Grid>
                          <Grid item xs={3.5}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,  textAlign: 'Center'  }}>{props?.instrumentId3}</Grid> */}
                          {/* <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>4<br/></Grid>
                          <Grid item xs={7.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>{props?.instrumentName4}</Grid>
                          <Grid item xs={3.5}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,  textAlign: 'Center'  }}>{props?.instrumentId4}</Grid>
                          <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>5<br/></Grid>
                          <Grid item xs={7.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px',  textAlign: 'Center'  }}>{props?.instrumentName5}</Grid>
                          <Grid item xs={3.5}    style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '4px'  ,  textAlign: 'Center'  }}>{props?.instrumentId5}</Grid> */}
                       </Grid>
                      

                    <Grid container style={{  textAlign: 'left',fontSize: '11px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                      
                          <Grid container style={{textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold' }}>
                               <Grid item xs={6.5}   style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',  textAlign: 'Center' }}>INSPECTED BY</Grid>
                               <Grid item xs={5.5}   style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px'  ,  textAlign: 'Center' }}>ACCEPTED BY</Grid>
                          </Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px'  ,  textAlign: 'Center'  }}> {props?.reviewedBy} <br/> (QC ENGINEER)</Grid>
                       <Grid item xs = {6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px'  ,  textAlign: 'Center'  }}> TPIA / CLIENT<br/></Grid>
                       <Grid item xs = {12}><br/></Grid>
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