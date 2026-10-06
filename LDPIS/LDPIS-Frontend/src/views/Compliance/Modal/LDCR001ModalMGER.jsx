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

export default function MaxWidthDialogMGER(props) {
  const { reviewedBy  } = props;
  const [getMGERdata, setgetMGERdata] = useState([]);
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
              axiosAPI.post("api/LDCR001/getMGERdata", data, defaultOptions),
          ]).then(([getMGERdataResponse]) => {
            setgetMGERdata(getMGERdataResponse.data);
                console.log(getMGERdata);
                
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
                            style={{ textAlign: 'center', marginTop: '35px', fontSize: '12px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            ERW PIPE DIVISION  -  KHOPOLI <br />
                            METALLOGRAPHIC EXAMINATION REPORT- PRODUCT MILL NO - {getMGERdata?.length > 0 ? (getMGERdata[0].MILL_NO) : ' '}
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px',fontSize: '7px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-14,Rev 05,Date 13.11.2021
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                          <Grid item xs={1.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                              <p>Client          </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade  </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={4.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].ORDER_ID : ' '}</p>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].PIPE_SIZE : ' '}</p>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].SPEC_GRD : ' '}  </p>
                              {/* <p>: {getMGERdata?.length > 0 ? getMGERdata[0].CD_GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].REP_NO : ' '} </p>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].CRT_DT : ' '}</p>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].GD_QAP_NO : ' '} </p>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].PROC_SHEET : ' '} </p>
                              <p>: {getMGERdata?.length > 0 ? getMGERdata[0].ID_TENPROC : ' '} </p>
                            </Grid>


                            <Grid item xs={12} style={{ fontSize: '8px', border: '1px solid black',  textAlign: 'center' }}>
                    
                    <Grid container style ={{display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>     
                    <Grid container xs = {12} >
                      <Grid item xs={0.5}  style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>SR.NO.</Grid>
                      <Grid item xs={0.8}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>PIPE NO.</Grid>
                      <Grid item xs={0.7}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>HEAT NO.</Grid>
                      

            <Grid item xs={4} colSpan={6} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
             <Grid container>
                <Grid item xs={12} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' , padding: '3px'}}>
                        OBSERVATIONS
                </Grid>

            <Grid item xs={8.5} style={{ fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black',borderRight : '1px solid black' }}><br/>MICRO(100X)<br/> Required Mean Grain Size No. ( {getMGERdata?.length > 0 ? getMGERdata[0].MEAN_GRAIN_SIZE : ' '})& finer<br/>(Mean Grain size Number)<br/></Grid>
            <Grid item xs={3.5} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',borderTop : '1px solid black' }}><br/><br/>MACRO (10X)<br/><br/></Grid>
            </Grid>
            </Grid>
            
            <Grid item xs={6}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>REMARKS</Grid>
                      
            {getMGERdata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
                           <Grid item xs={0.5}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', padding: '4px' }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                           <Grid item xs={0.8}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '3px' }}>{dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>
                           <Grid item xs={0.7}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '4px' }}>{dataRow.LOM_NO_CAST !== null ? dataRow.LOM_NO_CAST : <br />}</Grid>
                           <Grid item xs={2.8}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '4px' }}>{dataRow.TEST_PARA_VAL !== null ? dataRow.TEST_PARA_VAL : <br />}</Grid>
                           <Grid item xs={1.2}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '4px' }}>{dataRow.MACRO_FIELD !== null ? dataRow.MACRO_FIELD : <br />}</Grid>
                           <Grid item xs={6}    style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '3px' , textAlign: 'Left'}}>{dataRow.REMARKS_FIELD !== null ? dataRow.REMARKS_FIELD : <br />}</Grid>
                          </Grid>
                         ))}

{Array.from({ length: Math.max(0, rowsPerPage - getMGERdata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

                           <Grid item xs={0.5}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', padding: '4px' }}>{<br />}</Grid>
                           <Grid item xs={0.8}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '4px' }}>{<br />}</Grid>
                           <Grid item xs={0.7}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '4px' }}>{<br />}</Grid>
                           <Grid item xs={2.8}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '4px' }}>{<br />}</Grid>
                           <Grid item xs={1.2}  style={{ fontSize: '8px',   color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '4px' }}>{<br />}</Grid>
                           <Grid item xs={6}    style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black', borderLeft: '1px solid black', padding: '3px' , textAlign: 'Left'}}>{<br />}</Grid>
                          </Grid>
                         ))}
                    </Grid>  
                    </Grid>
                    <Grid>
                    </Grid>


          
          
                    <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Arial", padding: "2px"}}>
                
                         <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {12}> Grain Size Measurement as per comparison chart given in ASTM E 112 Latest Version </Grid>
                       <Grid item xs = {12}> All above results are conforming to {getMGERdata?.length > 0 ? getMGERdata[0].SPEC_GRD : ' '} & {getMGERdata?.length > 0 ? getMGERdata[0].GD_QAP_NO : ' '} </Grid>
                       <Grid item xs = {12}><br/></Grid>
                    </Grid>
                    <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold"}}>
                       <Grid item xs = {12}><br/></Grid>
                       <Grid item xs = {0.5}><br/></Grid>
                       <Grid item xs = {5}>TESTED BY: {getMGERdata?.length > 0 ? getMGERdata[0].INSPEC_NM : ' '} </Grid>
                       <Grid item xs = {4}>REVIEWED BY : {reviewedBy}</Grid>
                       <Grid item xs = {2.5}> INSPECTION AUTHORITY</Grid>
                       <Grid item xs = {12}><br/></Grid>
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