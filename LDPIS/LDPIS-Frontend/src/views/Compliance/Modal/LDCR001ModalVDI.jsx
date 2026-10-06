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
import FindInPageIcon from "@mui/icons-material/FindInPage";
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

// Assuming DateTime is imported from luxon or similar library
// If not, you might need to import it or use standard Date object.
// import { DateTime } from 'luxon'; // Uncomment if using luxon

export default function MaxWidthDialogVDIR(props) {
  const [getVdidata, setgetVdidata] = useState([]);
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
  // const currentDate = DateTime.now().toFormat('dd.MM.yyyy'); // Uncomment if using luxon

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
      };

      GetAuthorization().then((token) => {
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        setLoading(true);
        Promise.all([
          axiosAPI.post("api/LDCR001/getVdidata", data, defaultOptions),
        ]).then(([getVdidataResponse]) => {
          setgetVdidata(getVdidataResponse.data);
          // console.log(getVdidataResponse.data); // Log the response data directly
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
    props.close(false);
  };

  // This getAuthorization function is defined but not used in the provided code.
  // The useEffect uses GetAuthorization from utils.
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

  // Add .print-page class to pageStyle for page breaks
//   //const pageStyle = `
  // const pageStyle = `
//   @page {
//     size: A4 landscape;
//     margin: 5mm;
//   }
//   @media print {
//     body {
//       -webkit-print-color-adjust: exact;
//       zoom: 140%;
//     }
//     .print-page {
//       page-break-after: always; /* Forces a page break after each .print-page div */
//     }
//     .print-page:last-child {
//       page-break-after: avoid; /* Prevents an extra blank page at the end */
//     }
//   }
// `;

const pageStyle = `
@page {
  size: A4 landscape;
  margin: 5mm;
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

  // Calculate number of pages needed
  const rowsPerPage = 25;
  const numPages = Math.max(1, Math.ceil(getVdidata?.length / rowsPerPage));

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
          {getVdidata?.length === 0 && !loading ? (
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
                    {/* Logos - these will now repeat on each page */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <img
                        src={tatasteellimited}
                        alt="TatasteellimitedLogo"
                        style={{
                          position: 'absolute',
                          top: 7,
                          left: 2,
                          height: '20px',
                          margin: '20px'
                        }}
                      />
                      <img
                        src={Tata_Round_Blue_Logo}
                        alt="Tata Logo"
                        style={{
                          position: 'absolute',
                          top: 15,
                          right: 4,
                          height: '20px',
                          margin: '10px'
                        }}
                      />
                    </div>

                    <Grid container style={{ height: 'auto', width: '100%', justifyContent: 'center', display: 'flex', border: '1px solid black', padding: 'px' }}>

                      {/* Report Title and Header - repeated on each page */}
                      <Grid item xs={12}>
                        <MDTypography
                          textTransform="capitalize"
                          variant="h1"
                          color={"dark"}
                          noWrap
                          style={{ textAlign: 'center', marginTop: '35px', fontSize: '12px', color: 'black', fontFamily: "Times New Roman" }}
                        >
                          ERW PIPE DIVISION - KHOPOLI <br />
                          VDI ANNEXURE - 1 (VDI REPORT - (MILL NO.-{getVdidata?.length > 0 && getVdidata[0].MILL_NO !== null ? getVdidata[0].MILL_NO : ' '} ))
                        </MDTypography>
                        <MDTypography
                          textTransform="capitalize"
                          variant="h1"
                          color={"dark"}
                          noWrap
                          style={{ textAlign: 'Right', marginTop: '5px', fontSize: '8px', color: 'black', fontFamily: "Times New Roman" }}
                        >
                          TSL/ERW/QC/F-08-ANNEXURE - 1,Rev 01,Date 13.11.2021
                        </MDTypography>
                      </Grid>

                      {/* Client and Report No. - repeated on each page */}
                      <Grid item xs={12}>
                        <Grid container>
                          <Grid item xs={2} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderLeft: '1px solid black', padding: '1px' }}>
                            <p>Client </p>
                            <p>Report No. </p>
                          </Grid>
                          <Grid item xs={10} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '1px', borderLeft: '1px solid black' }}>
                            <p>: {getVdidata?.length > 0 ? getVdidata[0].ORDER_NO : ' '} </p>
                            <p>: {getVdidata?.length > 0 ? getVdidata[0].REPO_NO : ''}</p>
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Table Headers - repeated on each page */}
                      <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black', textAlign: 'center' }}>
                        <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Grid container xs={12} >
                            <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SR.NO.</Grid>
                            <Grid item xs={2.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>PIPE NO.</Grid>

                            <Grid item xs={1.5} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                              <Grid container>
                                <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>OD (MM)</Grid>
                                <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>F/E</Grid>
                                <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black' }}>T/E</Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={1.5} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                              <Grid container>
                                <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>ORR (MM)</Grid>
                                <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>F/E</Grid>
                                <Grid item xs={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black' }}>T/E</Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={2} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                              <Grid container>
                                <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>THK BODY(MM)</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>0°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}> 90°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>180°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black' }}>270°</Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={2} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                              <Grid container>
                                <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>THK F/E(MM)</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>0°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}> 90°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>180°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black' }}>270°</Grid>
                              </Grid>
                            </Grid>

                            <Grid item xs={2} colSpan={6} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
                              <Grid container>
                                <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>THK T/E (MM)</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>0°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}> 90°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black' }}>180°</Grid>
                                <Grid item xs={3} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black' }}>270°</Grid>
                              </Grid>
                            </Grid>
                          </Grid>

                          {/* Data rows for the current page */}
                          {getVdidata
                            .slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage)
                            .map((dataRow, i) => (
                              <Grid key={`data-${pageIndex}-${i}`} container>
                                <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{pageIndex * rowsPerPage + i + 1}</Grid>
                                <Grid item xs={2.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.ID_BATCH !== null ? dataRow.ID_BATCH : <br />}</Grid>
                                <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.BODY_DIA !== null ? dataRow.BODY_DIA.toFixed(2) : <br />}</Grid>
                                <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.END_DIA !== null ? dataRow.END_DIA.toFixed(2) : <br />}</Grid>
                                <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.BODY_OUT_ROUND !== null ? dataRow.BODY_OUT_ROUND.toFixed(2) : <br />}</Grid>
                                <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.END_OUT_ROUND !== null ? dataRow.END_OUT_ROUND.toFixed(2) : <br />}</Grid>
                                <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.REMARK !== null ? dataRow.REMARK : <br />}</Grid>
                                <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.BODY_WALL_THICKNESS !== null ? dataRow.BODY_WALL_THICKNESS.toFixed(2) : <br />}</Grid>
                                <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{dataRow.END_WALL_THICKNESS !== null ? dataRow.END_WALL_THICKNESS.toFixed(2) : <br />}</Grid>
                              </Grid>
                            ))}

                          {/* Fill remaining rows with empty data if less than 10 for the current page */}
                          {Array.from({ length: Math.max(0, rowsPerPage - getVdidata.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage).length) }).map((_, i) => (
                            <Grid key={`empty-${pageIndex}-${i}`} container>
                              <Grid item xs={0.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={2.5} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={0.75} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                              <Grid item xs={2} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '0.1px solid black', padding: '1px' }}>{<br />}</Grid>
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>

                      {/* Abbreviations and Signatures - repeated on each page */}
                      <Grid container style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "Arial", padding: "2px" }}>
                        <Grid item xs={12}><br /></Grid>
                        <Grid item xs={12}> ABBREVIATION : TE-TAIL END, FE-FRONT END, BD-BODY, OOR-OUT OF ROUNDNESS, THK-WALL THICKNESS, OD-OUTER DIA METER </Grid>
                        <Grid item xs={12}><br /></Grid>
                      </Grid>
                      <Grid container style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "Times New Roman", fontWeight: "bold" }}>
                        <Grid item xs={12}><br /></Grid>
                        <Grid item xs={0.5}><br /></Grid>
                        <Grid item xs={2.5}> ENGINEER(QC): {getVdidata?.length > 0 ? getVdidata[0].TESTED_BY : ' '} </Grid>
                        <Grid item xs={6}><br /></Grid>
                        <Grid item xs={3}> INSPECTION AUTHORITY</Grid>
                        <Grid item xs={12}><br /></Grid>
                      </Grid>

                      <Grid item xs={1}></Grid>
                    </Grid>
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
