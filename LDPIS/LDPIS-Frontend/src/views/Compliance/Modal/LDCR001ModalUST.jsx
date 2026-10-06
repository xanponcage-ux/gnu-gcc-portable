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

export default function MaxWidthDialogUST(props) {
  const { reviewedBy,GainA,GainM  ,GainATR,GainMTR  ,equipmentmachine} = props;
  const [getautomaticweld, setgetautomaticweld] = useState([]);
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

        let formattedPipeno = [];
        if (props.pipeno && props.pipeno.from && Array.isArray(props.pipeno.from)) {
          formattedPipeno = props.pipeno.from.map(arr => arr[0]);
        }

        const data = {
          plant: props?.plant?.value ? props.plant.value : "",
          orderNo: props.orderNo ? props.orderNo : "",
          item: props.item ? props.item : "",
          matno: props.matno ? props.matno : "",
          inspector: props.inspector ? props.inspector : "",
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
          result: props.result,
          // pipeno: props.pipeno ? props.pipeno : "",
          pipeno: formattedPipeno,  //?
          mutverification : props.mutverification ? props.mutverification : "",
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
              axiosAPI.post("api/LDCR001/getautomaticweld", data, defaultOptions),
          ]).then(([getautomaticweldResponse]) => {
            setgetautomaticweld(getautomaticweldResponse.data);
                console.log(getautomaticweld);
                
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
    //
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

//   //const pageStyle = `
  // const pageStyle = `
//   @page {
//     size: A4 landscape;
//     margin: 1mm;
//   }
//   @media print {
//     body {
//       -webkit-print-color-adjust: exact;
//       zoom: 140%;
//     }
//   }
// `;

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

  const rowsPerPage = 30;
  const numPages = Math.max(1, Math.ceil(getautomaticweld?.length / rowsPerPage));

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
{getautomaticweld?.length === 0 && !loading ? (
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
                  style={{ textAlign: 'center', marginTop: '55px', fontSize: '14px', color: 'black', fontFamily: "Times New Roman" }}
                >
                  ERW PIPE DIVISION - KHOPOLI<br />
                  AUTOMATIC OFFLINE WELD ULTRASONIC TESTING REPORT (MILL NO.-{getautomaticweld?.length > 0 ? getautomaticweld[0].MILL_NO : ' '} )
                  <br />
                </MDTypography>
                <MDTypography
                  textTransform="capitalize"
                  variant="h1"
                  color={"dark"}
                  noWrap
                  style={{ textAlign: 'Right', marginTop: '5px',fontSize: '10px', color: 'black', fontFamily: "Times New Roman" }}
                >
                  TSL/ERW/QC/F-06,Rev 05,Date 13.11.2021
                </MDTypography>
              </Grid>
              <Grid item xs={12}>
                <Grid container style={{ fontSize: '9px'}}>
                <Grid item xs={2.3} style={{  color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                              <p>Client          </p>  
                              <p>S.O.No.         </p>
                              <p>Pipe Size      </p>
                              <p>Specification & Grade  </p>
                              {/* <p>Grade           </p> */}
                            </Grid>
                            <Grid item xs={3.7} style={{  color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px' }}>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].MARK_CUST_NAME : ' '} </p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].ORDER_ID : ' '}</p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].PIPE_SIZE : ' '}</p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].SPEC_GRADE : ' '}  </p>
                              {/* <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].GRADE : ' '}  </p> */}
                            </Grid>

                            <Grid item xs={2.5} style={{  color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                              <p>Report No</p>
                              <p>Date/Shift           </p>
                              <p>Acceptance Criteria  </p>
                              <p>Process Sheet No.</p>
                              <p>Procedure/WI No.     </p>
                            </Grid>
                            <Grid item xs={3.5} style={{  color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black' }}>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].REP_NO : ' '} </p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].CRT_DT_FORMAT : ' '} </p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].GD_QAP_NO : ' '} </p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].PROC_SHEET : ' '} </p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].PROCE_NO : ' '} </p>
                              <p>   {getautomaticweld?.length > 0 ? getautomaticweld[0].PROCE_NO1 : ' '} </p>
                            </Grid>
                            </Grid>

                            <Grid container style={{ fontSize: '8px'}}>
                <Grid item xs={2.55} style={{ color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black',borderLeft: '1px solid black',padding: '3px' }}>
                {equipmentmachine === "HAZ" ? (
                                <>
                              <p>Equipment Details(AUT UT)         </p>  
                              <p>Equipment Details(MUT)        </p>
                              <p>Angle Probe Detail (AUT)    </p>
                              <p>TR Probe Detail (AUT)</p>
                              <p>Probe Detail (MUT-Angle Probe)</p>
                              <p>Probe Detail (MUT-TR Probe)</p>
                              <p>Couplant Used       </p>
                              <p>Extent of Coverage     </p>
                              <p>E.C.M.U(Ref.Std.)-AUT     </p>
                              <p>E.C.M.U(Ref.Std.)-MUT     </p>
                              <p>Scanning Speed(MUT)     </p>
                              </>
                                 ) : (
                                <>
                              <p>Equipment Details(AUT UT)         </p>  
                              <p>Equipment Details(MUT)        </p>
                              <p>Probe Detail(AUT)    </p>
                              <p>Probe Detail(MUT-Angle Probe )</p>
                              <p>Couplant Used       </p>
                              <p>Extent of Coverage     </p>
                              <p>E.C.M.U(Ref.Std.)-AUT     </p>
                              <p>E.C.M.U(Ref.Std.)-MUT     </p>
                              <p>Scanning Speed(MUT)     </p>
                              </>
                               )}
                            </Grid>
                            
                            
                            <Grid item xs={3.45} style={{ color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px'}}>

                              {equipmentmachine === "BSEEL" ? (
                                <>
                                  <p>: BSEEL-14Channel</p>
                                  <p>: Modsonic(E-II),GE,EEC(AS414)</p>
                                  <p>: 8 X 9 mm,4 MHz, 45°</p>
                                  <p>: 8 X 9 mm,4 MHz, 45°</p>
                                  <p>: Water</p>
                                  <p>: 100% weld seam</p>
                                  <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].REF_STD_AUT : ' '} </p>
                                  <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].REF_STD_MUT : ' '} </p>
                                  <p>: 150 mm per sec. max.</p>
                                </>
                                 ) : equipmentmachine === "HAZ" ? (
                                   <>
                                  <p>: BSEEL-14Channel</p>
                                  <p>: Modsonic(E-II),GE,EEC(AS414)</p>
                                  <p>: 8 X 9 mm, 4 MHz, 45 °  </p> 
                                  <p>  &nbsp;&nbsp; 25 X 3 mm, 5 MHz, TR</p>
                                  <p>: 8 X 9 mm,4MHz,45° </p>
                                  <p>  &nbsp;&nbsp; Ø 10 mm, 4MHz,TR</p>
                                  <p>: Water</p>
                                  <p>: 100% weld seam</p>
                                  <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].REF_STD_AUT : ' '} </p>
                                  <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].REF_STD_MUT : ' '} </p>
                                  <p>: 150 mm per sec. max.</p>
                                   </>
                                 ) : (
                                <>
                                  <p>: GE Inspection Tech.,12Channel</p>
                                  <p>: Modsonic(E-II),GE,EEC(AS414)</p>
                                  <p>: Ø 10 mm,5 MHz, 45°</p>
                                  <p>: 8 X 9 mm,4 MHz, 45°</p>
                                  <p>: Water</p>
                                  <p>: 100% weld seam</p>
                                  <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].REF_STD_AUT : ' '} </p>
                                  <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].REF_STD_MUT : ' '} </p>
                                  <p>: 150 mm per sec. max.</p>
                                </>
                              )}
                            </Grid>

                            <Grid item xs={2.5} style={{ color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black', padding: '3px' }}>
                            {equipmentmachine === "HAZ" ? (
                              <>
                              <p>Threshold(AUT)         </p>  
                              <p>Threshold(MUT)        </p>
                              <p>Testing Mode    </p>
                              <p>Method of Testing   </p>
                              <p>Technique(AUT)</p>
                              <p>Technique(MUT)   </p>
                              <p>Gain(AUT-Angle Probe)   </p>
                              <p>Gain(AUT-TR Probe)   </p>
                              <p>Gain(MUT-Angle Probe)   </p>
                              <p>Gain(MUT-TR Probe)   </p>
                              <p>Scanning Speed(AUT)     </p>
                              </>
                            ) : (
                                <>
                              <p>Threshold(AUT)         </p>  
                              <p>Threshold(MUT)        </p>
                              <p>Testing Mode    </p>
                              <p>Method of Testing   </p>
                              <p>Technique(AUT)</p>
                              <p>Technique(MUT)   </p>
                              <p>Gain(AUT-Angle Probe)   </p>
                              <p>Gain(MUT-Angle Probe)   </p>
                              <p>Scanning Speed(AUT)     </p>
                              </>
                              )}
                            </Grid>
                            <Grid item xs={3.5} style={{ color: 'black', fontFamily: "Arial", fontWeight: 'bold', borderTop: '1px solid black',padding: '3px',borderRight: '1px solid black'}}>
                            {equipmentmachine === "HAZ" ? (
                              <>
                              <p>: 80% for flaw, 20% for Decoupling</p>
                              <p>: 100% for DAC</p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].TEST_MODE : ' '} </p>
                              <p>: Pulse Echo Method</p>
                              <p>: Angle Beam Technique</p>
                              <p>: Angle Beam Technique</p>
                              <p>: {GainA ? `${GainA} dB` : ' '}</p>
                              <p>: {GainATR ? `${GainATR} dB` : ' '}</p>
                              <p>: {GainM ? `${GainM} dB` : ' '}</p>
                              <p>: {GainMTR ? `${GainMTR} dB` : ' '}</p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].SCAN_SPEED_AUT + '  MPM' : ' '} </p>
                              </>
                            ) : (
                                <>
                              <p>: 80% for flaw, 20% for Decoupling</p>
                              <p>: 100% for DAC</p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].TEST_MODE : ' '} </p>
                              <p>: Pulse Echo Method</p>
                              <p>: Angle Beam Technique</p>
                              <p>: Angle Beam Technique</p>
                              <p>: {GainA ? `${GainA} dB` : ' '}</p>
                              <p>: {GainM ? `${GainM} dB` : ' '}</p>
                              <p>: {getautomaticweld?.length > 0 ? getautomaticweld[0].SCAN_SPEED_AUT + '  MPM' : ' '} </p>
                              </>
                              )}
                            </Grid>
                            </Grid>

                            <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                  <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                  
          <Grid container style={{ fontSize: '10px'}}>
            <Grid item xs={0.75}  style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center'  }}>SN.NO.</Grid>
            <Grid item xs={2}    style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center'  }}>PIPE NO.</Grid>
            <Grid item xs={1.25}  style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center'  }}>No. of AUT <br/> Indication</Grid>
            <Grid item xs={2.5} colSpan={6} style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  {/* <Grid item xs={12} style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', textAlign: 'center' ,fontSize: '10px'}}>
                         Untested Length {getautomaticweld?.length > 0 ? getautomaticweld[0].PROB  : ' '} mm <br/>
                         at end by angle & TR Probe

                  </Grid> */}
                  <Grid item xs={12} style={{ color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', textAlign: 'center', fontSize: '10px' }}>
  Untested Length {getautomaticweld?.length > 0 ? getautomaticweld[0].PROB : ' '} mm <br/>
  at end by {equipmentmachine === 'HAZ' ? 'angle & TR Probe' : 'angle Probe'}
</Grid>
            <Grid item xs={6} style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>F-END</Grid>
            <Grid item xs={6} style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>T-END</Grid>
            </Grid>
            </Grid>
            <Grid item xs={1.75} style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>Verification <br/> by MUT</Grid>
            <Grid item xs={1.75} style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '3px' ,display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>RESULT</Grid>
            <Grid item xs={2}  style={{  color: 'black', fontFamily: "Times New Roman", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center'  }}>REMARK</Grid>
          </Grid>

          {getautomaticweld
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
<Grid key={`data-${pageIndex}-${i}`} container>
            <Grid item xs={0.75}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}>{pageIndex * rowsPerPage + i + 1}</Grid>
            <Grid item xs={2}     style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}>{dataRow.BATCH_ID !== null ? dataRow.BATCH_ID : <br />}</Grid>
            <Grid item xs={1.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}>{dataRow.NO_IND_50 !== null ? dataRow.NO_IND_50 : <br />}</Grid>
            <Grid item xs={1.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}>{dataRow.MUT_F_END_50 !== null ? dataRow.MUT_F_END_50 : <br />}</Grid>
            <Grid item xs={1.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}>{dataRow.MUT_T_END_50 !== null ? dataRow.MUT_T_END_50 : <br />}</Grid>
            <Grid item xs={1.75}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}>{dataRow.MUT_RESULT_50 !== null ? dataRow.MUT_RESULT_50 : <br />}</Grid>
            <Grid item xs={1.75}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}>{dataRow.RESULT !== null ? dataRow.RESULT : <br />}</Grid>
            <Grid item xs={2}     style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}>{dataRow.REMARK !== null ? dataRow.REMARK : <br />}</Grid>
            </Grid>
          ))}


{Array.from({ length: Math.max(0, rowsPerPage - getautomaticweld.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>

            <Grid item xs={0.75}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px',display: 'flex', alignItems: 'center',  justifyContent: 'center' }}> {<br />}</Grid>
            <Grid item xs={2}     style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}> {<br />}</Grid>
            <Grid item xs={1.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}> {<br />}</Grid>
            <Grid item xs={1.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}> {<br />}</Grid>
            <Grid item xs={1.25}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}> {<br />}</Grid>
            <Grid item xs={1.75}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}> {<br />}</Grid>
            <Grid item xs={1.75}  style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}> {<br />}</Grid>
            <Grid item xs={2}     style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderBottom: '1px solid black',borderLeft: '1px solid black', padding: '3px' }}> {<br />}</Grid>
            </Grid>
          ))}

          
<Grid style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '3px' }}>
            AUT Calibration done at &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 
            and found satisfactory .MUT Calibration done at  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   and found satisfactory
          </Grid>
          <Grid style={{  textAlign: 'center',fontSize: '11px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '3px' }}>
            ABBREVIATION
            
          </Grid>
          <Grid container style={{  textAlign: 'left',fontSize: '10px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '3px' }}>
          <Grid item xs = {12}>
          {/* <Grid item xs = {12}>  <br/></Grid> */}
             AUT - Automatic Ultrasonic Testing, MUT -Manual Ultrasonic Testing , E.C.M.U - Equipment Calibration Method Used, <br/>
             FBH - Flat Bottom Hole, TDH - Through Drill Hole, DAC - Distance Amplitude Curve, Ref.Std. - Reference Standard, NA- Not Applicable <br/>
             D-Day,N-Night,F-Front,T-Tail,OD-Outer Diameter,WT-Wall Thickness,mm-Millimeter, BSEEL : Blue Star Engineering & Electronics Ltd.
          </Grid>
             <Grid item xs = {12}>  <br/></Grid>
             <Grid item xs = {12}>  <br/></Grid>
             <Grid item xs = {12}>  <br/></Grid>
             <Grid item xs = {4}> NDT UT LEVEL II <br/> NAME:  {getautomaticweld?.length > 0 ? getautomaticweld[0].INSP_NAME : ' '}</Grid>
             <Grid item xs = {4}></Grid>
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
