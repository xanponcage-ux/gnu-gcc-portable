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
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";
import Preloader from "components/Preloader/Preloader";
import logo from "../../../assets/img/tatablackandwhite.png";

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

export default function MaxWidthDialog(props) {
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
  //page load
  useEffect(() => {
    if (props.open) {
      let url = "api/ttsm005/getPlantAddress";
      let varData = [];
      props?.inputValues()?.map((x) => varData.push(x.EOM_ID_BATCH))
      var data = {
        Plant: props?.plant?.value ? props.plant.value : "",
        userId: serverDetails.PersonalNo,
        Batch: varData
      };
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        setLoading(true);
        Promise.all([
          axiosAPI.post("api/ttsm005/getPlantAddress", data, defaultOptions),
          axiosAPI.post("api/ttsm005/getSFGDetails", data, defaultOptions)
        ]).then(([getPlantAddressData, getSFGDetailsData]) => {
          if (getPlantAddressData?.data?.length > 0) {
            setPlant(getPlantAddressData?.data ? getPlantAddressData?.data[0] : [])
          } else if (getPlantAddressData?.length === 0) {
            setPlant([])
          }

          if (getSFGDetailsData?.data?.length > 0) {
            setSfgData(getSFGDetailsData?.data ? getSFGDetailsData.data : [])
          } else if (getSFGDetailsData?.length === 0) {
            setSfgData([])
          }

        }).finally(() => {
          setLoading(false);
        })
      })
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

  const qrValue = () => {
    var val = "";
    val = props.inputValues().EOM_ID_BATCH + "," + Number(props.inputValues().EOM_ODIA).toFixed(2) + "," + Number(props.inputValues().EOM_IDIA).toFixed(2)
      + "," + Number(props.inputValues().EOM_SEC1).toFixed(2).toFixed(2)
      + "," + Number(props.inputValues().EOM_LENGTH).toFixed(2).toFixed(2)
      + Number(props.inputValues().EOM_ID_ORDER);

    return val;
  }

  const cDate = () => {
    let varDate = new Date()
    return varDate.getDate()?.toString() + '/' + (varDate.getMonth()?.toString()?.length > 1 ? varDate.getMonth() : '0' + varDate.getMonth()) + '/' + varDate.getFullYear()?.toString()
  }
  console.log(props?.inputValues())
  return (
    <React.Fragment>
      {/* <Tooltip title="Coil List" arrow>
        <IconButton color="white" onClick={handleClickOpen}>
          <FindInPageIcon />
        </IconButton>
      </Tooltip> */}
      {/* open={props.open} */}
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>{props.type} Print Label</DialogTitle>
        <DialogContent>
          {loading && <Preloader />}
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          <MDBox px={3} py={1} ref={componentRef} style={{ display: 'block' }}>
            {props?.inputValues()?.map((x, i) =>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid key={i} style={{ height: '100mm', width: '160mm', justifyContent: 'center', display: 'flex' }}>
                  <Grid item xs={12}>
                    {props.type === 'FG-MD' ? 

                    <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center" marginTop={'-45px'}>
                      <Grid item xs={12} style={{ transform: 'scale(0.8)', transformOrigin: 'top centre' }}>

                        <Grid item xs={12} style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}>
                          {/* <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'center', marginTop: '25px', fontSize: '24px', color: 'black', fontFamily: "ArialBold" }}
                          > */}
                          <div style={{ height: '80px', width: '130px', fontWeight: 'bold', border: '1px solid black', paddingTop: '10px', textAlign: 'center' ,fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold',}}>MADE <br /> IN <br /> INDIA</div>
                          <div style={{ justifyContent: 'space-between' }}>
                            <div style={{ height: '28px', overflow: 'hidden' }}>
                              <img
                                src={logo}
                                alt="logo"
                                style={{ width: "11rem" }}
                              />
                            </div>
                            <MDTypography
                              textTransform="capitalize"
                              noWrap
                              style={{ textAlign: 'center', fontSize: '15px', paddingTop: 0, marginBottom: 10, marginBottom: 0,fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', }}
                            >
                              TUBES DIVISION , {x.plant === '0788' ? "KHOPOLI" : x.plant == '0789' ? "HOSUR" : ""}
                            </MDTypography>
                          </div>
                          <div>
                            <QRCode
                              style={{ height: "80px", maxWidth: "80px", width: "75px" }}
                              value={`https://madeinindia.qcin.org/product-details/${x?.app_id}/${x?.EOM_ID_BATCH}`}
                              viewBox={`0 0 256 256`} />
                          </div>
                          {/* </MDTypography> */}
                        </Grid>
                        <Grid item xs={12}>
                          <div style={{ textAlign: 'center', border: '1px solid black', padding: '5px', marginBottom: '8px',fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', }}>
                            <h3>Steel Tubes / Pipes</h3>
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={2} style = {{fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold'}}>
                            <Grid item xs={6}>
                              <label>Batch</label>
                              <h3 style = {{fontSize: '20px'}}>{x?.EOM_ID_BATCH}</h3>
                            </Grid>
                            <Grid item xs={6} >
                              <label  style={{ marginLeft: '100px' }}>Cast No</label>
                              <h3  style={{ marginLeft: '100px' }}>{x?.EOM_NO_CAST}</h3>
                            </Grid>
                            <Grid item xs={6}>
                              <label>GRADE</label>
                              {/* <h3>{x?.grade?.[0]?.length > 0 && x?.grade?.[1]?.trim()?.length > 0 ? x?.grade?.[0] : ''}</h3> */}
                              {/* SPECEFICATION */}
                              <h3>{x?.SPECEFICATION}</h3>
                            </Grid>
                            <Grid item xs={6}>
                              <label style={{ marginLeft: '100px' }}>Net Weight</label>
                              <h3 style={{ marginLeft: '100px' }}>{x?.EOM_MS_GROSS_CAL} KG</h3>
                            </Grid>
                            <Grid item xs={6}>
                              <h3></h3>
                            </Grid>
                            <Grid item xs={6}>
                              <label style={{ marginLeft: '100px' }}>NOS</label>
                              <h3 style={{ marginLeft: '100px' }}>{x?.EOM_NO_PIECES}</h3>
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: '-38px' }}>
                              <label>Material Desc</label>
                              <h3>{x?.MATR_DESC}</h3>
                            </Grid>
                            <Grid item xs={12}>
                              <div style={{ borderBottom: '1px solid black', marginTop: '-10px', marginBottom: '20px' }}></div>
                            </Grid>
                            <Grid item xs={8} style={{ display: 'flex', marginTop: '-30px' }}>
                              Material Number
                              <h4 style={{ marginLeft: '45px' }}>{x?.MATNR}</h4>
                            </Grid>
                            {/* <Grid item xs={4} style={{ display: 'flex', marginTop: '-30px' }}>
                              M Batch No 
                              <h4 style={{ marginLeft: '5px' }}>{x?.EOM_ID_FIRST_PAR}</h4>
                            </Grid> */}
                            <Grid item xs={8} style={{ display: 'flex', paddingTop: '5px' }}>
                              Sales Order/Item No
                              <h4 style={{ marginLeft: '20px' }}>{x?.EOM_ID_ORDER}/{x.EOM_ID_ORD_ITEM_CUS}</h4>
                            </Grid>
                            <Grid item xs={4} style={{ display: 'flex', paddingTop: '5px',marginLeft: '-10px' }}>
                              Date
                              <h4 style={{ marginLeft: '1px' }}>{x?.EOM_DT_PIECE_UPD.split("")}</h4>
                            </Grid>
                            <Grid item xs={8} style={{ display: 'flex', paddingTop: '5px' }}>
                              Customer
                              <h4 style={{ marginLeft: '10px' }}>{x?.CUSTOMER_NAME}</h4>
                            </Grid>
                            <Grid item xs={4} style={{ display: 'flex', paddingTop: '5px' }}>
                              Shift
                              <h4 style={{ marginLeft: '10px' }}>{x?.EOM_CD_SHIFT}</h4>
                            </Grid>
                            <Grid item xs={12} style={{zoom: .8}}>
                              <Barcode
                                height={50}
                                fontSize={20}
                                format="CODE128" 
                                style={{zoom: .8}}
                                className='barcodeClass'
                                textAlign="left"
                                //format="CODE128" 
                                value={x?.EOM_ID_BATCH + ";" + x?.EOM_MS_GROSS_CAL + ";" + x?.EOM_SEC2?.toFixed(2) + "X" + x?.EOM_SEC1?.toFixed(2) + "X" + x?.EOM_LENGTH?.toFixed(2)} />
                            </Grid>
                            <Grid item xs={12} style={{ marginTop: '-10px' }}></Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid> : props.type === 'SFG' ? 

                    <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                      <Grid item xs={12}>

                        <Grid item xs={12}>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'center', marginTop: '25px', fontSize: '24px', color: 'black', fontFamily: "ArialBold" }}
                          >
                            TATA STEEL LIMITED
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            noWrap
                            style={{ textAlign: 'left', marginLeft: '50mm', fontSize: '14px', paddingTop: 0, marginBottom: 10, marginBottom: 0 }}
                          >
                            Village : Nifan & Savroli<br /> P.O.Sajgaon, TAL- Khalapur <br />
                            Khopoli, Dist.-Raigad, Maharashtra-410203- INDIA
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Cust. Name</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.CUSTOMER_NAME}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Product Description</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.FG_MATERIAL_DESC}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Order/Item</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_ID_ORDER_CUS} / {x.EOM_ID_ORD_ITEM_CUS}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Batch/Lot No.</p>
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_ID_BATCH}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>OD/Width</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_ODIA?.toFixed(2)}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              No. of Tubes
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_NO_PIECES}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>ID/Height</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_IDIA?.toFixed(2)}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Mill No.</p>
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_WORK_CENTER}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Thickness
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_SEC1?.toFixed(2)}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }} >
                              <p>Shift</p>
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.PACKING_SHFT}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Length
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_LENGTH?.toFixed(3)}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Specification
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {''}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Cust. Grade
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_TDC_ACTL}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Net Weight
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_MS_PIECE_ACTL}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Routing
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_PLANNED_PROC}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Heat No.
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_NO_CAST}
                            </Grid>
                            <Grid item xs={7} >
                              <Grid container sx={{ mt: '20px' }}>
                                <Grid item xs={12}></Grid>
                                <Grid item xs={12}></Grid>
                                <Grid item xs={5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Date
                                </Grid>
                                <Grid item xs={7} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.EOM_TS_CREATION}
                                </Grid>
                                <Grid item xs={5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Created By
                                </Grid>
                                <Grid item xs={7} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.PACKED_BY}
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={1}></Grid>
                            <Grid item xs={3} sx={{ mt: 1 }}>
                              <QRCode
                                style={{ height: "80px", maxWidth: "80px", width: "75px" }}
                                value={`${x.EOM_ID_BATCH}, ,${x?.EOM_ID_ORDER_CUS},${x?.EOM_ODIA?.toFixed(2)} MM,${x?.EOM_SEC1?.toFixed(2)} MM,${x?.EOM_LENGTH?.toFixed(3)} m,${x?.EOM_MS_GROSS_ACTL?.toFixed(2)} Kg,${x?.EOM_NO_PIECES}`}
                                viewBox={`0 0 256 256`}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid> :
                      <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                          <MDTypography
                            textTransform="capitalize"
                            variant="h1"
                            color={"dark"}
                            noWrap
                            style={{ textAlign: 'center', marginTop: '25px', fontSize: '24px', color: 'black', fontFamily: "ArialBold" }}
                          >
                            TATA STEEL LIMITED
                          </MDTypography>
                          <MDTypography
                            textTransform="capitalize"
                            noWrap
                            style={{ textAlign: 'left', marginLeft: '50mm', fontSize: '14px', paddingTop: 0, marginBottom: 10, marginBottom: 0 }}
                          >
                            Village : Nifan & Savroli<br /> P.O.Sajgaon, TAL- Khalapur <br />
                            Khopoli, Dist.-Raigad, Maharashtra-410203- INDIA
                          </MDTypography>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Cust. Name</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.CUSTOMER_NAME}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Product Desc.</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x.FG_MATERIAL_DESC}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Specification
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.SPECEFICATION}
                            </Grid>
                            {/* <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Port of Destination</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{''}</p>
                            </Grid> */}
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Order/Item</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x.EOM_ID_ORDER_CUS} / {x.EOM_ID_ORD_ITEM_CUS}</p>
                            </Grid>
                            <Grid item xs={1.8} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Batch No.</p>
                            </Grid>
                            <Grid item xs={3.2} style={{ fontSize: '26px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x.EOM_ID_BATCH}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>OD/Width</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_ODIA?.toFixed(2)} MM</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>No. of Tubes</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_NO_PIECES}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>ID/Height</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_IDIA?.toFixed(2)} MM</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }} >
                              <p>Heat No.</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.EOM_NO_CAST}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Thickness
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_SEC1?.toFixed(2)} MM
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Cust. Grade
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_TDC_ACTL}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Length
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_LENGTH?.toFixed(3)} m
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Net Weight
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_MS_PIECE_ACTL} Kg
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Port of Dest.</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{''}</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Gross Weight
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_MS_GROSS_ACTL} Kg
                            </Grid>
                            <Grid item xs={7} >
                              <Grid container>
                                <Grid item xs={5.15} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Packing Date
                                </Grid>
                                <Grid item xs={6.85} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.PACKING_DT}
                                </Grid>
                                <Grid item xs={5.15} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Shift
                                </Grid>
                                <Grid item xs={6.85} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.PACKING_SHFT}
                                </Grid>
                                <Grid item xs={5.15} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Created By
                                </Grid>
                                <Grid item xs={6.85} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.PACKED_BY}
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={.1}></Grid>
                            <Grid item xs={3}>
                              <QRCode
                                style={{ height: "80px", maxWidth: "80px", width: "75px" }}
                                value={`${x.EOM_ID_BATCH}, ,${x?.EOM_ID_ORDER_CUS},${x?.EOM_ODIA?.toFixed(2)} MM,${x?.EOM_SEC1?.toFixed(2)} MM,${x?.EOM_LENGTH?.toFixed(3)} m,${x?.EOM_MS_GROSS_ACTL?.toFixed(2)} Kg,${x?.EOM_NO_PIECES}`}
                                viewBox={`0 0 256 256`}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>}
                  </Grid>

                  {/* <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center"> */}

                  {/* <TableContainer style={{
                    margin: 20, minWidth: 650, maxHeight: "100%",
                    overflow: "hidden",
                    pageBreakAfter: "always"
                  }}>
                    <Table size="small" aria-label="a dense table">
                      <TableBody>

                        <TableRow>
                          <TableCell scope="row">
                            Cust. Order / Item
                          </TableCell>
                          <TableCell align="left">{x?.EOM_ID_ORDER_CUS + ' / ' + x?.EOM_ID_ORD_ITEM_CUS}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row" style={{ borderRight: '1px solid lightgray' }}>
                            <Grid container>
                              <Grid item xs={6}>
                                Date
                              </Grid>
                              <Grid item xs={6} align="left">
                                {cDate()}
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container>
                              <Grid item xs={6}>
                                Shift
                              </Grid>
                              <Grid item xs={6} align="left">
                                {x?.EOM_CD_SHIFT}
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row" style={{ borderRight: '1px solid lightgray' }}>
                            <Grid container>
                              <Grid item xs={6}>
                                MBatch Id
                              </Grid>
                              <Grid item xs={6} align="left">
                                {x?.EOM_ID_FIRST_PAR}
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container>
                              <Grid item xs={6} style={{ whiteSpace: 'nowrap' }}>
                                Batch Id
                              </Grid>
                              <Grid item xs={6} align="left">
                                {x?.EOM_ID_BATCH}
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row">
                            SFG Material
                          </TableCell>
                          <TableCell align="left">{sfgData[i]?.EWI_SFG_MATNR + ' - ' + sfgData[i]?.MAT_DESC}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row">
                            Cust. Name
                          </TableCell>
                          <TableCell align="left">{x?.CUSTOMER_NAME}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row">
                            FG Material
                          </TableCell>
                          <TableCell align="left">{Number(x?.MATNR).toString() + ' - ' + x?.MATR_DESC}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row" style={{ borderRight: '1px solid lightgray' }}>
                            <Grid container>
                              <Grid item xs={6}>
                                No of Tube
                              </Grid>
                              <Grid item xs={6} align="left">
                                {x?.EOM_NO_PIECES}
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container>
                              <Grid item xs={6}>
                                Quantity ({x?.EOM_UOM})
                              </Grid>
                              <Grid item xs={6} align="left">
                                {x?.EOM_MS_GROSS_ACTL}
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row">
                            Grade
                          </TableCell>
                          <TableCell align="left">{x?.EOM_TDC_ACTL}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left"><QRCode
                            size={150}
                            style={{ height: "auto", maxWidth: "150px", width: "150px" }}
                            value={`Cust. Order / Item: ${x?.EOM_ID_ORDER_CUS?.toString() + ' / ' + x?.EOM_ID_ORD_ITEM_CUS?.toString()},Batch Id: ${x?.EOM_ID_BATCH?.toString()},No of Tube: ${x?.EOM_NO_PIECES?.toString()},Quantity (${x?.EOM_UOM?.toString()}): ${x?.EOM_MS_GROSS_ACTL?.toString()},Grade: ${x?.EOM_TDC_ACTL?.toString()}`}
                            viewBox={`0 0 256 256`}
                          /></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer> */}

                  {/* </Grid> */}
                </Grid>
              </div>
            )}

          </MDBox>

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
            style={{ marginTop: "0.5rem" }}
          >
            <Button onClick={handleClose}>Close</Button>

            {/* <MDButton
              size="small"
              color="info"
             
            >
              Print
            </MDButton> */}
            <ReactToPrint
              trigger={() => <MDButton size="small" color="info" >
                Print
              </MDButton>}
              content={() => componentRef.current}
            />
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </React.Fragment >
  );
}