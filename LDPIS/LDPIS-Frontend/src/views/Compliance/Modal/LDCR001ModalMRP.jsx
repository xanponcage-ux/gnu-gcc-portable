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

export default function MaxWidthDialogMRP(props) {
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
  // const currentDate = DateTime.now().toFormat('dd.MM.yyyy'); // DateTime is not defined, assuming it's from Luxon or similar
  const [getmechanicaldata, setgetmechanicaldata] = useState([]);

  const testMethodLabels = {
    "1": "ASTM A 370 Latest Edition",
    "2": "IS 1608-1 Latest Edition",
    "3": "ISO 6892-1 Latest Edition"
  };


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
        console.log('data', data);
        setLoading(true);
        Promise.all([
          axiosAPI.post("api/LDCR001/getmechanicaldata", data, defaultOptions),
        ]).then(([getmechanicaldataResponse]) => {
          setgetmechanicaldata(getmechanicaldataResponse?.data);
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
  }, [props.open, props.orderNo]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
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
      zoom: 110%;
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

  const rowsPerPage = 7; // Number of visual rows per page
  // numPages is calculated based on each visual row using 2 data items
  const numPages = Math.max(1, Math.ceil((getmechanicaldata?.length || 0) / (rowsPerPage * 2)));


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
          {getmechanicaldata?.length === 0 && !loading ? (
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
              <SentimentDissatisfiedIcon fontSize="large" sx={{ color: 'error.main', mb: 2 }} /> {/* Larger icon */}
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
                            style={{ textAlign: 'center', marginTop: '55px', fontSize: '16px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            <br />
                            ERW PIPE DIVISION - KHOPOLI <br />
                            MECHANICAL TEST REPORT - PRODUCT (MILL NO. - {getmechanicaldata?.length > 0 ? getmechanicaldata[0]?.MILL_NO : ' '})
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'Right', marginTop: '5px', fontSize: '7px', color: 'black', fontFamily: "Times New Roman" }}
                          >
                            TSL/ERW/QC/F-11,Rev 05,Date 13.11.2021
                          </MDTypography>

                          <Grid item xs={12}>
                          <Grid container>
                              <Grid item xs={2.2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '4px' }}>
                                <p>Client </p>
                                <p>S.O.No. </p>
                                <p>Pipe Size </p>
                                <p>Specification & Grade </p>
                              </Grid>
                              <Grid item xs={3.8} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '4px' }}>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].MARK_CUST_NAME : ' '}</p>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].ORDER_ID : ' '}</p>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].PIPE_SIZE : ' '} </p>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].SPEC : ' '} </p>
                              </Grid>

                              <Grid item xs={2.2} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '4px', borderLeft: '1px solid black'}}>
                                <p>Report No</p>
                                <p>Date/Shift </p>
                                <p>Acceptance Criteria </p>
                                <p>Process Sheet No.</p>
                                <p>Procedure/WI No. </p>
                              </Grid>
                              <Grid item xs={3.8} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', padding: '4px', borderRight: '1px solid black' }}>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].REP_NO : ' '}</p>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].CRT_DT : ' '}</p>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].GD_QAP_NO : ' '} </p>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].PROC_SHEET : ' '} </p>
                                <p>: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].ID_TENPROC : ' '} </p>
                              </Grid>

                              <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black', textAlign: 'center' }}>

                                <Grid container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Grid container xs={12} >
                                    <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SR<br />NO</Grid>
                                    <Grid item xs={1.1} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>PIPE NO.</Grid>
                                    <Grid item xs={0.8} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>HEAT NO.</Grid>
                                    <Grid item xs={0.9} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>LOCATION</Grid>
                                    <Grid item xs={6.8} colSpan={6} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', textAlign: 'center' }}>
                                      <Grid container>
                                        <Grid item xs={12} style={{ fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          Tensile TEST
                                        </Grid>

                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>WIDTH <br /> (mm)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>THICK <br /> (mm)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>AREA <br /> (mm²)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>MGL <br /> (mm)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '5px',  color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>YL ({props.ysyl})<br /> (KN)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '5px',  color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>YS ({props.ysyl})<br /> (MPa)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>UTL <br /> (KN)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>UTS <br /> (MPa)</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>FGL <br /> (mm)</Grid>
                                        <Grid item xs={0.98}  style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>%EL</Grid>
                                        <Grid item xs={1}     style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black', borderRight: '1px solid black', padding: '3px' }}>YS/UTS</Grid>
                                        <Grid item xs={1.02}  style={{ fontSize: '7px',  color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', borderTop: '1px solid black' , padding: '3px'}}>Broken <br /> Location</Grid>
                                      </Grid>
                                    </Grid>
                                    <Grid item xs={0.75} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>RESULTS</Grid>
                                    <Grid item xs={1.25} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>REMARKS</Grid>

                                    {Array.from({ length: rowsPerPage }).map((_, i) => {
  const dataIndex1 = pageIndex * rowsPerPage * 2 + 2 * i;
  const dataIndex2 = pageIndex * rowsPerPage * 2 + 2 * i + 1;

  const rowData1 = getmechanicaldata?.[dataIndex1];
  const rowData2 = getmechanicaldata?.[dataIndex2];

  return (
    <Grid key={`data-row-${pageIndex}-${i}`} container>
      <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {rowData1 || rowData2 ? (pageIndex * rowsPerPage + i + 1) : <></>}
      </Grid>
      <Grid item xs={1.1} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {rowData1?.BATCH_ID !== null && rowData1?.BATCH_ID !== undefined ? rowData1.BATCH_ID : <></>}
      </Grid>
      <Grid item xs={0.8} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {rowData1?.LOM_NO_CAST !== null && rowData1?.LOM_NO_CAST !== undefined ? rowData1.LOM_NO_CAST : <></>}
      </Grid>
  
      <Grid container direction="column" item xs={0.9}>
        <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
          
          {rowData1?.CD_LOC || <br/>}
          
        </Grid>
        <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
          
          {rowData2?.CD_LOC || <br/>}
          
        </Grid>
      </Grid>
  
      <Grid container direction="column" item xs={0.575}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.WIDTH !== undefined && rowData1?.WIDTH !== null ? rowData1.WIDTH.toFixed(2) : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.WIDTH !== undefined && rowData2?.WIDTH !== null ? rowData2.WIDTH.toFixed(2) : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.565}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.THICKNESS !== undefined && rowData1?.THICKNESS !== null ? rowData1.THICKNESS.toFixed(2) : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.THICKNESS !== undefined && rowData2?.THICKNESS !== null ? rowData2.THICKNESS.toFixed(2) : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.565}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.AREA !== undefined && rowData1?.AREA !== null && rowData1.AREA !== 0 ? rowData1.AREA.toFixed(0) : rowData1?.AREA === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.AREA !== undefined && rowData2?.AREA !== null && rowData2.AREA !== 0 ? rowData2.AREA.toFixed(0) : rowData2?.AREA === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.565}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    
    {rowData1?.MGL !== undefined && rowData1?.MGL !== null && rowData1.MGL !== 0 ? rowData1.MGL.toFixed(0) : rowData1?.MGL === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    
    {rowData2?.MGL !== undefined && rowData2?.MGL !== null && rowData2.MGL !== 0 ? rowData2.MGL.toFixed(0) : rowData2?.MGL === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.565}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.YL !== undefined && rowData1?.YL !== null && rowData1.YL !== 0 ? rowData1.YL.toFixed(2) : rowData1?.YL === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.YL !== undefined && rowData2?.YL !== null && rowData2.YL !== 0 ? rowData2.YL.toFixed(2) : rowData2?.YL === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.565}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.YS !== undefined && rowData1?.YS !== null && rowData1.YS !== 0 ? rowData1.YS.toFixed(0) : rowData1?.YS === 0 ? '-' : <br/>}
  
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.YS !== undefined && rowData2?.YS !== null && rowData2.YS !== 0 ? rowData2.YS.toFixed(0) : rowData2?.YS === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.565}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.UTL !== undefined && rowData1?.UTL !== null && rowData1.UTL !== 0 ? rowData1.UTL.toFixed(2) : rowData1?.UTL === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.UTL !== undefined && rowData2?.UTL !== null && rowData2.UTL !== 0 ? rowData2.UTL.toFixed(2) : rowData2?.UTL === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.56}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.UTS !== undefined && rowData1?.UTS !== null && rowData1.UTS !== 0 ? rowData1.UTS.toFixed(0) : rowData1?.UTS === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.UTS !== undefined && rowData2?.UTS !== null && rowData2.UTS !== 0 ? rowData2.UTS.toFixed(0) : rowData2?.UTS === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.565}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.FGL !== undefined && rowData1?.FGL !== null && rowData1.FGL !== 0 ? rowData1.FGL.toFixed(2) : rowData1?.FGL === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.FGL !== undefined && rowData2?.FGL !== null && rowData2.FGL !== 0 ? rowData2.FGL.toFixed(2) : rowData2?.FGL === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.55}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.EL !== undefined && rowData1?.EL !== null && rowData1.EL !== 0 ? rowData1.EL.toFixed(2) : rowData1?.EL === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.EL !== undefined && rowData2?.EL !== null && rowData2.EL !== 0 ? rowData2.EL.toFixed(2) : rowData2?.EL === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.55}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.YS_UTS !== undefined && rowData1?.YS_UTS !== null && rowData1.YS_UTS !== 0 ? rowData1.YS_UTS.toFixed(2) : rowData1?.YS_UTS === 0 ? '-' : <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.YS_UTS !== undefined && rowData2?.YS_UTS !== null && rowData2.YS_UTS !== 0 ? rowData2.YS_UTS.toFixed(2) : rowData2?.YS_UTS === 0 ? '-' : <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.61}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.BROKEN_LOC || <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.BROKEN_LOC || <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={0.75}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.TEST_PARA_RESULT || <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.TEST_PARA_RESULT || <br/>}
    
  </Grid>
  </Grid>
  
  <Grid container direction="column" item xs={1.25}>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData1?.TEST_REMARK || <br/>}
    
  </Grid>
  <Grid item xs={0.4} style={{ fontSize: '9px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '2px' }}>
    
    {rowData2?.TEST_REMARK || <br/>}
    
  </Grid>
      </Grid>
    </Grid>
  );
  })}
                                      </Grid>
                                      </Grid>
                                      <Grid>
                                      </Grid>


                              </Grid>
                              <Grid container>
                                <Grid item xs={2.2} style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                                  <p style={{ textAlign: 'left', fontSize: '8.5px' }}>Specified Requirements </p>
                                  <p><br /> </p>
                                  <p>Yield Strength </p>
                                  <p>Tensile Strength at base </p>
                                  <p>Tensile Strength at Weld </p>
                                  <p>%El.............. </p>
                                  <p>YS/UTS Ratio </p>
                                </Grid>

                                <Grid item xs={0.5} style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                                  <p><br /></p>
                                  <p><br /></p>
                                  <p><br /></p>
                                  <p><br /></p>
                                  <p><br /></p>
                                  <p><br /></p>
                                  <p><br /></p>
                                </Grid>

                                <Grid item xs={0.8} style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                                  <p style={{ textAlign: 'left', fontSize: '8.5px' }}> <span>Min.</span></p>
                                  <p><br /></p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].YIELD_STRENGTH_MIN !== null ? getmechanicaldata[0].YIELD_STRENGTH_MIN : <br />}</p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].TENSILE_STRENGTH_BASE_MIN !== null ? getmechanicaldata[0].TENSILE_STRENGTH_BASE_MIN : <br />}</p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].TENSILE_STRENGTH_WELD_MIN !== null ? getmechanicaldata[0].TENSILE_STRENGTH_WELD_MIN : <br />}</p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].ELONGATION !== null ? getmechanicaldata[0].ELONGATION : <br />}</p>
                                  <p><br /></p>
                                  <p><br /></p>
                                </Grid>
                                <Grid item xs={0.8} style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                                  <p style={{ textAlign: 'left', fontSize: '8.5px' }}> <span>Max.</span></p>
                                  <p><br /></p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].YIELD_STRENGTH_MAX !== null ? getmechanicaldata[0].YIELD_STRENGTH_MAX : <br />}</p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].TENSILE_STRENGTH_BASE_MAX !== null ? getmechanicaldata[0].TENSILE_STRENGTH_BASE_MAX : <br />}</p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].TENSILE_STRENGTH_WELD_MAX !== null ? getmechanicaldata[0].TENSILE_STRENGTH_WELD_MAX : <br />}</p>
                                  <p><br /></p>
                                  <p>{getmechanicaldata?.length > 0 && getmechanicaldata[0].YS_UTS_RATIO !== null ? getmechanicaldata[0].YS_UTS_RATIO : <br />}</p>
                                  <p><br /></p>
                                </Grid>
                                <Grid item xs={1.2} style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                                  <p style={{ textAlign: 'left', fontSize: '8.5px' }}> <span>Unit.</span></p>
                                  <p><br /></p>
                                  <p>MPa</p>
                                  <p>MPa</p>
                                  <p>MPa</p>
                                  <p>%</p>
                                  <p><br /></p>
                                  <p><br /></p>
                                </Grid>

                                <Grid item xs={2.5} style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '2px' }}>
                                  <p style={{ textAlign: 'left', fontSize: '8.5px' }}>Instruments used for testing </p>
                                  <p><br /> </p>
                                  <p>UTM </p>
                                  <p>Extensometer Sr.No </p>
                                  <p>Micrometer 0-25mm ID No. </p>
                                  <p>Vernier Calliper ID No. </p>
                                  <p>Test Method </p>
                                </Grid>
                                <Grid item xs={3.5} style={{ textAlign: 'left', fontSize: '8px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', padding: '3px' }}>
                                  <p> <br /></p>
                                  <p> <br /></p>
                                  <p>: 199892(Model-Z1200) </p>
                                  <p>: 269852 </p>
                                  <p>: 67052100 </p>
                                  <p>: BSL/VC 02/19030</p>
                                  <p>: {testMethodLabels[props.testMethod]}</p>
                                </Grid>
                              </Grid>
                              <Grid style={{ textAlign: 'left', fontSize: '10px', color: 'black', border: '1px solid black', padding: '3px' }}>
                                LEGENDS: MGL - Marked Gauge Length, YL-Yield Load, YS - Yield Strength, FGL - Final Gauge Length, EL - Elongation, BIW - Broken in Weld, BOW - Broken out of Weld,
                                UTL - Ultimate Tensile Load ,UTS - Ultimate Tensile Strength , LBT - Longitudinal Base Tensile ,TBT - Transverse Base Tensile ,TWT - Transverse Weld Tensile, PS - Proof Stress,EUL - Extension Under Load
                              </Grid>

                              <Grid container style={{ textAlign: 'left', fontSize: '10px', color: 'black', fontFamily: "Times New Roman", fontWeight: "bold", border: '1px solid black', padding: '3px' }}>
                                All above results are conforming to {getmechanicaldata?.length > 0 ? getmechanicaldata[0].SPEC : ' '} & <span> </span> <p> {getmechanicaldata?.length > 0 ? getmechanicaldata[0].GD_QAP_NO : ' '} </p>
                                <Grid item xs={12}> <br /></Grid>
                                <Grid item xs={0.5}> <br /></Grid>
                                <Grid item xs={4.5}> Tested By: {getmechanicaldata?.length > 0 ? getmechanicaldata[0].TESTED_BY : ' '}</Grid>
                                <Grid item xs={4}> Reviewed by: {props.reviewedBy}</Grid>
                                <Grid item xs={3}> Inspection Authority</Grid>
                                <Grid item xs={12} style={{ textAlign: 'left', fontSize: '5px' }}> <br /></Grid>
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
