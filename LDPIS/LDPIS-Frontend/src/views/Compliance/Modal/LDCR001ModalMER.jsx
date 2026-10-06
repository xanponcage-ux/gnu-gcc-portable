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
<MDBox px={3} py={1} 
ref={componentRef}
style={{ display: 'block' }}>
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
      style={{ height: '100mm', width: '160mm', justifyContent: 'center', display: 'flex' }}>
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
                  style={{ textAlign: 'center', marginTop: '75px', fontSize: '14px', color: 'black', fontFamily: "ArialBold" }}
                >
                  ERW PIPE DIVISION - KHOPOLI<br />
                  MECHANICAL TEST REPORT - RAW MATERIAL
                </MDTypography>
                <MDTypography
                  textTransform="capitalize"
                  variant="h1"
                  color={"dark"}
                  noWrap
                  style={{ textAlign: 'Right', marginTop: '5px',fontSize: '10px', color: 'black', fontFamily: "Arial" }}
                >
                  TSL/ERW/QC/F-11A,Rev 04,Date :{currentDate}
                </MDTypography>
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                    <p>Client              :</p>
                    <p>S.O.No.             :</p>
                    <p>Pipe Size          :</p>
                    <p>Specification  & Grade     :</p>
                    {/* <p>Grade               :</p> */}
                  </Grid>
                  <Grid item xs={6} style={{ fontSize: '10px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                    <p>Report No:           :</p>
                    <p>Date/Shift           :</p>
                    <p>Acceptance Criteria  :</p>
                    <p>Process Sheet No.    :</p>
                    <p>Procedure/WI No.     :</p>
                  </Grid>
                  <Grid item xs={12} style={{ fontSize: '10px', border: '1px solid black',  textAlign: 'center' }}>
                  
          <Grid container>
            <Grid item xs={0.5}  style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>Sr. No.</Grid>
            <Grid item xs={1.3}    style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>COIL NO.</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>HEAT NO.</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>LOCATION</Grid>

            <Grid item xs={6} colSpan={6} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px', textAlign: 'center' }}>
               <Grid container>
                  <Grid item xs={12} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', textAlign: 'center' }}>
                         Tensile Test
                  </Grid>

            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>WIDTH <br />(mm)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>THICK.<br />(mm)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>AREA <br />(mm²)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>MGL <br />(mm)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>YL <br /> (KN)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>YS <br /> (MPa)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>UTL <br />(KN)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>UTS <br />(MPa)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>FGL <br />(mm)</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>% EL</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>VS / UTS</Grid>
            <Grid item xs={1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '0px' }}>Broken <br />Location</Grid>
            </Grid>
            </Grid>
            <Grid item xs={1.1} style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>RESULTS</Grid>
            <Grid item xs={1.1}  style={{ fontSize: '5px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>REMARKS</Grid>
          </Grid>
          <Grid>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </Grid>
          <Grid container>
          <Grid item xs={6} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                    <p>Specified Requirements      Min.   Max.     Unit </p>
                    <p>Yield Strength      :</p>
                    <p>%El.........        :</p>
                    <p>YS/UTS Ratio        :</p>
                    <p>Procedure/WI No.    :</p>
          </Grid>
          <Grid item xs={6} style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                    <p>Instruments used for testing </p>
                    <p>UTM                        :</p>
                    <p>Extensometer Sr.No         :</p>
                    <p>Micrometer 0-25mm ID No.   :</p>
                    <p>Vernier Calliper ID No.    :</p>
          </Grid>
          </Grid>
          <Grid style={{  textAlign: 'left',fontSize: '6px', color: 'black', fontFamily: "Times New Roman", border: '1px solid black', padding: '1px' }}>
            LEGENDS: MGL-Marked Gauge Length,YL-Yield Load,YS-Yield Strength,UTL-Ultimate Tensile Strength,FGL-Final Gauge Length,EL-Elongation,BIW-Broken in Weld,BOW-Broken out of Weld
          </Grid>
          <Grid container style={{  textAlign: 'left',fontSize: '7px', color: 'black', fontFamily: "Times New Roman",fontWeight: "bold", border: '1px solid black', padding: '1px' }}>
             <Grid item xs = {12}>  <br/></Grid>
             <Grid item xs = {4}> Tested By- <br/> Name</Grid>
             <Grid item xs = {4}> Reviewed by- <br/> Name</Grid>
             <Grid item xs = {4}> Inspection Authority</Grid>
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
</MDBox>

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
