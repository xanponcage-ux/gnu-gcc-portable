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
      let url = "api/LDSM005/getPlantAddress";
      let varData = [];
      props?.inputValues()?.map((x) => varData.push(x.LOM_ID_BATCH))
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
          axiosAPI.post("api/LDSM005/getPlantAddress", data, defaultOptions),
          axiosAPI.post("api/LDSM005/getSFGDetails", data, defaultOptions)
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
    val = props.inputValues().LOM_ID_BATCH + "," + Number(props.inputValues().LOM_ODIA).toFixed(2) + "," + Number(props.inputValues().LOM_IDIA).toFixed(2)
      + "," + Number(props.inputValues().LOM_SEC1).toFixed(2).toFixed(2)
      + "," + Number(props.inputValues().LOM_LENGTH).toFixed(2).toFixed(2)
      + Number(props.inputValues().LOM_ID_ORDER);

    return val;
  }

  const cDate = () => {
    let varDate = new Date()
    return varDate.getDate()?.toString() + '/' + (varDate.getMonth()?.toString()?.length > 1 ? varDate.getMonth() : '0' + varDate.getMonth()) + '/' + varDate.getFullYear()?.toString()
  }

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
                    {props.type === 'SFG' ? <Grid container spacing={1} direction="row" justifyContent="center" alignItems="center">
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
                              <p>{x?.LOM_ID_ORDER_CUS} / {x.LOM_ID_ORD_ITEM_CUS}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Batch/Lot No.</p>
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_ID_BATCH}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>OD/Width</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_ODIA?.toFixed(2)}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              No. of Tubes
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_NO_PIECES}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>ID/Height</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_IDIA?.toFixed(2)}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Mill No.</p>
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_WORK_CENTER}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Thickness
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_SEC1?.toFixed(2)}
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
                              {x?.LOM_LENGTH?.toFixed(3)}
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
                              {x?.LOM_TDC_ACTL}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Net Weight
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_MS_PIECE_ACTL}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Routing
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_PLANNED_PROC}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Heat No.
                            </Grid>
                            <Grid item xs={2} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_NO_CAST}
                            </Grid>
                            <Grid item xs={7} >
                              <Grid container sx={{ mt: '20px' }}>
                                <Grid item xs={12}></Grid>
                                <Grid item xs={12}></Grid>
                                <Grid item xs={5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Date
                                </Grid>
                                <Grid item xs={7} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.LOM_TS_CREATION}
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
                                value={`${x.LOM_ID_BATCH}, ,${x?.LOM_ID_ORDER_CUS},${x?.LOM_ODIA?.toFixed(2)} MM,${x?.LOM_SEC1?.toFixed(2)} MM,${x?.LOM_LENGTH?.toFixed(3)} m,${x?.LOM_MS_GROSS_ACTL?.toFixed(2)} Kg,${x?.LOM_NO_PIECES}`}
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
                              <p>{x.LOM_ID_ORDER_CUS} / {x.LOM_ID_ORD_ITEM_CUS}</p>
                            </Grid>
                            <Grid item xs={1.8} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Batch No.</p>
                            </Grid>
                            <Grid item xs={3.2} style={{ fontSize: '26px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x.LOM_ID_BATCH}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>OD/Width</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_ODIA?.toFixed(2)} MM</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>No. of Tubes</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_NO_PIECES}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>ID/Height</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_IDIA?.toFixed(2)} MM</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }} >
                              <p>Heat No.</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_NO_CAST}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Thickness
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_SEC1?.toFixed(2)} MM
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Cust. Grade
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_TDC_ACTL}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Length
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_LENGTH?.toFixed(3)} m
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Net Weight
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_MS_PIECE_ACTL} Kg
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
                              {x?.LOM_MS_GROSS_ACTL} Kg
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
                                value={`${x.LOM_ID_BATCH}, ,${x?.LOM_ID_ORDER_CUS},${x?.LOM_ODIA?.toFixed(2)} MM,${x?.LOM_SEC1?.toFixed(2)} MM,${x?.LOM_LENGTH?.toFixed(3)} m,${x?.LOM_MS_GROSS_ACTL?.toFixed(2)} Kg,${x?.LOM_NO_PIECES}`}
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
                          <TableCell align="left">{x?.LOM_ID_ORDER_CUS + ' / ' + x?.LOM_ID_ORD_ITEM_CUS}</TableCell>
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
                                {x?.LOM_CD_SHIFT}
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
                                {x?.LOM_ID_FIRST_PAR}
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container>
                              <Grid item xs={6} style={{ whiteSpace: 'nowrap' }}>
                                Batch Id
                              </Grid>
                              <Grid item xs={6} align="left">
                                {x?.LOM_ID_BATCH}
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
                                {x?.LOM_NO_PIECES}
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell>
                            <Grid container>
                              <Grid item xs={6}>
                                Quantity ({x?.LOM_UOM})
                              </Grid>
                              <Grid item xs={6} align="left">
                                {x?.LOM_MS_GROSS_ACTL}
                              </Grid>
                            </Grid>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell scope="row">
                            Grade
                          </TableCell>
                          <TableCell align="left">{x?.LOM_TDC_ACTL}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell align="left"><QRCode
                            size={150}
                            style={{ height: "auto", maxWidth: "150px", width: "150px" }}
                            value={`Cust. Order / Item: ${x?.LOM_ID_ORDER_CUS?.toString() + ' / ' + x?.LOM_ID_ORD_ITEM_CUS?.toString()},Batch Id: ${x?.LOM_ID_BATCH?.toString()},No of Tube: ${x?.LOM_NO_PIECES?.toString()},Quantity (${x?.LOM_UOM?.toString()}): ${x?.LOM_MS_GROSS_ACTL?.toString()},Grade: ${x?.LOM_TDC_ACTL?.toString()}`}
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
