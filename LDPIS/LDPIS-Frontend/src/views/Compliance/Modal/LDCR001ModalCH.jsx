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
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet//

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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import QRCode from "react-qr-code";
import { GetAuthorization } from "utils";
import { Zoom } from "@mui/material";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function MaxWidthDialogCH(props) {
  const [getChemData, setGetChemData] = useState([]);
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
  const { reviewedBy  } = props;

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
              axiosAPI.post("api/LDCR001/getchemdata", data, defaultOptions),
          ]).then(([getChemDataResponse]) => {
            setGetChemData(getChemDataResponse.data);
                console.log(getChemData);
                
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
  
    const rowsPerPage = 18;
    const numPages = Math.max(1, Math.ceil(getChemData?.length / rowsPerPage));

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
          {getChemData?.length === 0 && !loading ? (
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
                            style={{ textAlign: 'center', marginTop: '75px', fontSize: '15px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            ERW PIPE DIVISION - KHOPOLI [MILL NO. {getChemData?.length > 0 ? getChemData[0].MILL_NO : ' '}   ]<br />
                            CHEMICAL ANALYSIS REPORT - PRODUCT
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '7px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-16,Rev 05,Date 13.11.2021
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '4px' }}>
                              <p>Client        </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade  </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px',borderleft: '1px solid black' }}>
                              <p>: {getChemData?.length > 0 ? getChemData[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {getChemData?.length > 0 ? getChemData[0].ORDER_ID : ' '}</p>
                              <p>: {getChemData?.length > 0 ? getChemData[0].PIPE_SIZE : ' '}</p>
                              <p>: {getChemData?.length > 0 ? getChemData[0].SPEC_GRD : ' '}  </p>
                              {/* <p>: {getChemData?.length > 0 ? getChemData[0].CD_GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '4px' }}>
                              <p>Report No            </p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.    </p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '4px',borderRight: '1px solid black' }}>
                              <p>: {getChemData?.length > 0 ? getChemData[0].REP_NO : ' '} </p>
                              <p>: {getChemData?.length > 0 ? getChemData[0].CRT_DT : ' '} </p>
                              <p>: {getChemData?.length > 0 ? getChemData[0].GD_QAP_NO : ' '} </p>
                              <p>: {getChemData?.length > 0 ? getChemData[0].PROC_SHEET : ' '} </p>
                              <p>: {getChemData?.length > 0 ? getChemData[0].ID_MILLPROC : ' '} </p>
                            </Grid>
                            <Grid item xs={12} style={{ fontSize: '8px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                      <Grid item xs={0.25}  style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Sr. No.</Grid>
                      <Grid item xs={0.60}    style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Pipe No.</Grid>
                      <Grid item xs={0.40} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Heat No.</Grid>
                      <Grid item xs={10.75} colSpan={12} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                         <Grid container>
                            <Grid item xs={24} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center',padding: '3px' }}>
                                   % Chemical Composition
                            </Grid>
 
                      <Grid item xs={0.43} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>C</Grid>
                      <Grid item xs={0.43} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Mn</Grid>
                      <Grid item xs={0.43} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Si</Grid>
                      <Grid item xs={0.43} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>S</Grid>
                      <Grid item xs={0.43} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>P</Grid>
                      <Grid item xs={0.43} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Al</Grid>
                      <Grid item xs={0.44} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Al(Sol)</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Nb</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>V</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Ti</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Cr</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Mo</Grid>

                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Cu</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Ni</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>N</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>B</Grid>

                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Ca</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Nb + V</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Al/N</Grid>
                      <Grid item xs={0.42} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Cu+Ni</Grid>
                      <Grid item xs={0.45} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Nb+V<br/>+Ti</Grid>
                      <Grid item xs={0.7} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Cu+Ni+Cr<br/>+Mo+V</Grid>
                      <Grid item xs={0.50} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CE <br/> IIW</Grid>
                      <Grid item xs={0.50} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>CE <br/> PCM</Grid>

                      <Grid item xs={0.67} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px'  ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>Result</Grid>
                      <Grid item xs={0.7}style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Remarks</Grid>
                      </Grid>
                      </Grid>

                      <Grid item xs={0.85} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Specified Requirement</Grid>

                      <Grid container direction="column" item xs = {0.4}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                        (Min)
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                        (Max)
                      </Grid>
                      </Grid>
                      <Grid container direction="column" item xs = {0.40}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].C_MIN !== null ? getChemData[0].C_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].C_MAX !== null ? getChemData[0].C_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].MN_MIN !== null ? getChemData[0].MN_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].MN_MAX !== null  ? getChemData[0].MN_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].SI_MIN !== null ? getChemData[0].SI_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].SI_MAX !== null ? getChemData[0].SI_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.40}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].S_MIN !== null ? getChemData[0].S_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].S_MAX !== null ? getChemData[0].S_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].P_MIN !== null ? getChemData[0].P_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].P_MAX !== null ? getChemData[0].P_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.39}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].AL_MIN !== null ? getChemData[0].AL_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].AL_MAX !== null ? getChemData[0].AL_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.4}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].AL_S_MIN !== null ? getChemData[0].AL_S_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].AL_S_MAX !== null ? getChemData[0].AL_S_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].NB_MIN !== null ? getChemData[0].NB_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].NB_MAX !== null ? getChemData[0].NB_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].V_MIN !== null ? getChemData[0].V_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].V_MAX !== null ? getChemData[0].V_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].TI_MIN !== null ? getChemData[0].TI_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].TI_MAX !== null ? getChemData[0].TI_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CR_MIN !== null ? getChemData[0].CR_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CR_MAX !== null ? getChemData[0].CR_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].MO_MIN !== null ? getChemData[0].MO_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].MO_MAX !== null ? getChemData[0].MO_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CU_MIN !== null ? getChemData[0].CU_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CU_MAX !== null ? getChemData[0].CU_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].NI_MIN !== null ? getChemData[0].NI_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].NI_MAX !== null ? getChemData[0].NI_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].N_MIN !== null ? getChemData[0].N_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].N_MAX !== null ? getChemData[0].N_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].B_MIN !== null ? getChemData[0].B_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].B_MAX !== null ? getChemData[0].B_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CA_MIN !== null ? getChemData[0].CA_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CA_MAX !== null ? getChemData[0].CA_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.37}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].AL_N_MIN !== null ? getChemData[0].AL_N_MIN : <br/>} </p>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.38}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CU_NI_MAX !== null ? getChemData[0].CU_NI_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      {/* <Grid container direction="column" item xs = {0.27}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.27}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      </Grid> */}

                      <Grid container direction="column" item xs = {0.41}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].NB_V_TI_MAX !== null ? getChemData[0].NB_V_TI_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.62}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CR_NI_CU_MO_V_MAX !== null ? getChemData[0].CR_NI_CU_MO_V_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.44}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CEIIW_MAX !== null ? getChemData[0].CEIIW_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.45}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <p>{getChemData?.length > 0 && getChemData[0].CEPCM_MAX !== null ? getChemData[0].CEPCM_MAX : <br/>} </p>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.60}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      </Grid>

                      <Grid container direction="column" item xs = {0.63}>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      <Grid item xs={0.4} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
                      <br/>
                      </Grid>
                      </Grid>


                {/* {Array.from({length: Math.max(getChemData?.length, 10) }).map((_, i) => ( */}
                {getChemData
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                      <Grid container item xs={12} > 
                      <Grid item xs={0.25} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                      <Grid item xs={0.60} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>
                      <Grid item xs={0.4}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{dataRow.LOM_NO_CAST !== null ? dataRow.LOM_NO_CAST : <br />}</Grid>
                      <Grid container item xs={10.75}>
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.C !== null ?              dataRow.C?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.MN !== null ?             dataRow.MN?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.SI !== null ?             dataRow.SI?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.S !== null ?              dataRow.S?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.P !== null ?              dataRow.P?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.AL !== null ?             dataRow.AL?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.AL_S !== null ?           dataRow.AL_S?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.NB !== null ?             dataRow.NB?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.V !== null ?              dataRow.V?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.TI !== null ?             dataRow.TI?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.CR !== null ?             dataRow.CR?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.MO !== null ?             dataRow.MO?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.CU !== null ?             dataRow.CU?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.41}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.NI !== null ?             dataRow.NI?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.N !== null ?              dataRow.N?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.43}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.B !== null ?              dataRow.B?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.CA !== null ?             dataRow.CA?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.NB_V !== null ?           dataRow.NB_V?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.41}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.AL_N !== null ?           dataRow.AL_N?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.CU_NI !== null ?          dataRow.CU_NI?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.45}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {dataRow.NB_V_TI !== null ?        dataRow.NB_V_TI?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.7}   style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.CU_NI_CR_MO_V !== null ?  dataRow.CU_NI_CR_MO_V?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.49}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.CEIIW !== null ?          dataRow.CEIIW?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.50}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.CEPCM !== null ?          dataRow.CEPCM?.toFixed(4) : <br />}</Grid>
                      <Grid item xs={0.67}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.FPT_TEST_PARA_RESULT !== null ? dataRow.FPT_TEST_PARA_RESULT : <br />}</Grid>
                      <Grid item xs={0.72}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {dataRow.FPT_TEST_REMARK !== null ? dataRow.FPT_TEST_REMARK : <br />}</Grid>
                    </Grid>
                  </Grid>
               </Grid>
             ))}


{Array.from({ length: Math.max(0, rowsPerPage - getChemData.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>
                      <Grid container item xs={12} > 
                      <Grid item xs={0.25} style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{<br />}</Grid>
                      <Grid item xs={0.60} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{<br />}</Grid>
                      <Grid item xs={0.4}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{<br />}</Grid>
                      <Grid container item xs={10.75}>
                      {/* <Grid item xs={0.44}  style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {getChemData?.[i]?.C?.toFixed(4) || <br />}</Grid> */}
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.44}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.41}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.43}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.41}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.42}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.45}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}> {<br />}</Grid>
                      <Grid item xs={0.7}   style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.49}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.50}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />}</Grid>
                      <Grid item xs={0.67}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />} </Grid>
                      <Grid item xs={0.72}  style={{ fontSize: '6px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center'}}>  {<br />} </Grid>
                    </Grid>
                  </Grid>
               </Grid>
             ))}
                    
                    </Grid>
                    </Grid>
                    <Grid>


                        </Grid>


          
                    <Grid style={{  textAlign: 'left',fontSize: '9px', color: 'black', fontFamily: "Times New Roman", border: '1px solid black', padding: '2px' }}>
                      NOTE <br/>
                            CE(IIW) = C+(Mn/6)+(Cr+Mo+V)/5 + (Ni+Cu)/15
                      <br/>
                            CE(PCM) = C + Si/30 + Mn/20 + Cu/20 + Ni/60 + Cr/20 + Mo/15 + V/10 + 5B
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '2px' }}>
                    <Grid item xs = {12}>  <br/></Grid>
                    All above results are conforming to {getChemData?.length > 0 ?   getChemData[0].SPEC_GRD : ' '} & <span>  </span> <p> {getChemData?.length > 0 ?   getChemData[0].GD_QAP_NO : ' '}  </p>
                       <Grid item xs = {12}>  <br/></Grid>
                       <Grid item xs = {12}>  <br/></Grid>
                       <Grid item xs = {12}>  <br/></Grid>
                       <Grid item xs = {4}> Tested By <br/> Name: {getChemData?.length > 0 ? getChemData[0].INSPEC_NM : ' '} </Grid>
                       <Grid item xs = {4}> Reviewed By <br/> Name: {reviewedBy}</Grid>
                       <Grid item xs = {4}> Inspection Authority</Grid>
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