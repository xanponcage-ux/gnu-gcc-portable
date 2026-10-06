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
import ReactToPrint from "react-to-print";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import QRCode from "react-qr-code";
import { GetAuthorization } from "utils";

export default function MaxWidthDialog(props) {
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");

  const [loading, setLoading] = React.useState(false);
  const [plant, setPlant] = useState([]);
  const [sfgData, setSfgData] = useState([]);
  //page load

  useEffect(() => {
    if (props.open) {
      let varData = [];
      props?.inputValues()?.map((x) => varData.push(x));
    }
  }, [props.open]);

  const handleClose = () => {
    props.close(false);
  };

  const componentRef = React.useRef();

  const cDate = () => {
    let varDate = new Date();
    return (
      varDate.getDate()?.toString() +
      "/" +
      (varDate.getMonth()?.toString()?.length > 1
        ? varDate.getMonth()
        : "0" + varDate.getMonth()) +
      "/" +
      varDate.getFullYear()?.toString()
    );
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleClose}
      >
        <DialogTitle>{props.type} Print Label</DialogTitle>
        <DialogContent>
          {loading && <Preloader />}

          <MDBox px={3} py={1} ref={componentRef}>
            {props?.inputValues()?.map((x, i) => (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Grid key={i} style={{ height: '100mm', width: '160mm', justifyContent: 'center', display: 'flex' }}>
                  <Grid item xs={12}>
                    {props.type === 'SFG' ? <Grid container direction="row" justifyContent="center" alignItems="center">
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
                            style={{ textAlign: 'left', marginLeft: '50mm', fontSize: '14px', paddingTop: 0, marginBottom: 10 }}
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
                              <p>{x?.CUST_NM}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Product Desc.</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.FG_MATERIAL_DESC}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Order/Item</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.ORDERNO} / {x?.ORDERITEM}</p>
                            </Grid>
                            <Grid item xs={1.8} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Batch No.</p>
                            </Grid>
                            <Grid item xs={3.2} style={{ fontSize: '26px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.BATCHID}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>OD/Width</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.ODIA?.toFixed(2)} MM</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              No. of Tubes
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_NO_PIECES}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>ID/Height</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.IDIA?.toFixed(2)} MM</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Mill No.</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_WORK_CENTER}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Thickness
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.THK?.toFixed(2)} MM
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }} >
                              <p>Shift</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.PACKING_SHFT}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Specification
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.SPECEFICATION}
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Length
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LENGTH1?.toFixed(3)} m
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Cust. Grade
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.GRADE}
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Net Weight
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_MS_GROSS_CAL?.toFixed(2)} Kg
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Routing
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_PLANNED_PROC}
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Heat No.
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
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
                                  {x?.PROD_DT}
                                </Grid>
                                <Grid item xs={5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Created By
                                </Grid>
                                <Grid item xs={7} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.PACKED_BY}
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={.1}></Grid>
                            <Grid item xs={3} >
                              <QRCode
                                style={{ height: "80px", maxWidth: "80px", width: "75px" }}
                                value={`${x.BATCHID}, ,${x?.ORDERNO},${x?.ODIA?.toFixed(2)},${x?.THK?.toFixed(2)},${x?.LENGTH1?.toFixed(3)},${x?.LOM_MS_GROSS_CAL?.toFixed(2)},${x?.LOM_NO_PIECES}`}
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
                            fontWeight="bold"
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
                            style={{ textAlign: 'left', marginLeft: '50mm', paddingTop: 0, fontSize: '14px', marginBottom: 10, marginBottom: 0 }}
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
                              <p>{x?.CUST_NM}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>SFG Desc.</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.SFG_MATERIAL_DESC}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>FG Desc.</p>
                            </Grid>
                            <Grid item xs={9} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.FG_MATERIAL_DESC}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Order/Item</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.ORDERNO} / {x?.ORDERITEM}</p>
                            </Grid>
                            <Grid item xs={1.8} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Batch No.</p>
                            </Grid>
                            <Grid item xs={3.2} style={{ fontSize: '26px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x.BATCHID}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Date
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.PROD_DT}
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Shift</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x.PACKING_SHFT}</p>
                            </Grid>

                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>Specification</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.SPECEFICATION}</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Cust. Grade
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.GRADE}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>OD/Width</p>
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.ODIA?.toFixed(2)} MM</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }} >
                              <p>No. of Tubes</p>
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              <p>{x?.LOM_NO_PIECES}</p>
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              ID/Height
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.IDIA?.toFixed(2)} MM
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Net Weight
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_MS_GROSS_CAL?.toFixed(2)} Kg
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Thickness
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.THK?.toFixed(2)} MM
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Heat No.
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LOM_NO_CAST}
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Length
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.LENGTH1?.toFixed(3)} m
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Next Stage
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.NEXT_PROC_DESC}
                            </Grid>
                            <Grid item xs={7} sx={{ mt: "20px" }}>
                              <Grid container>
                                <Grid item xs={5.15} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  Routing
                                </Grid>
                                <Grid item xs={6.85} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                                  {x?.LOM_PLANNED_PROC}
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
                            <Grid item xs={3} >
                              <QRCode
                                style={{ height: "80px", maxWidth: "80px", width: "75px" }}
                                value={`${x.BATCHID}, ,${x?.ORDERNO},${x?.ODIA?.toFixed(2)} MM,${x?.THK?.toFixed(2)} MM,${x?.LENGTH1?.toFixed(3)} m,${x?.LOM_MS_GROSS_CAL?.toFixed(2)} Kg,${x?.LOM_NO_PIECES}`}
                                viewBox={`0 0 256 256`}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>}
                  </Grid>

                  {/* <React.Fragment key={i}>
                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Grid item xs={10}>
                        <Grid
                          container
                          spacing={1}
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Grid item xs={12}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="large"
                              textTransform="capitalize"
                              variant="h1"
                              color={"dark"}
                              noWrap
                            >
                              TATA STEEL LIMITED
                            </MDTypography>
                          </Grid>
                          <Grid item xs={12}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h5"
                              color={"dark"}
                              noWrap
                            >
                              {props.plant.label}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={12}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h5"
                              color={"dark"}
                              noWrap
                            >
                              {plant[0]}
                            </MDTypography>
                          </Grid>
                          <Grid item xs={12}>
                            <MDTypography
                              fontWeight="bold"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h5"
                              color={"dark"}
                              noWrap
                            >
                              {plant[1]}
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={2}></Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={1}
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <TableContainer
                        style={{
                          margin: 20,
                          minWidth: 650,
                          maxHeight: "100%",
                          overflow: "hidden",
                          pageBreakAfter: "always",
                        }}
                      >
                        <Table size="small" aria-label="a dense table">
                          <TableBody>
                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid> {x?.TUBE_PROD_DT}</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>{x?.CD_STATUS}</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>REGION</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>{ }</Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>CUST. NAME</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>{x?.CUST_NM}</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>NEXT PROCESS</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>
                                    <b>{x?.NEXT_PROC}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>SFG MATERIAL DESC.</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>{x?.SFG_MATERIAL_DESC}</Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>BATCH NO.</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    {" "}
                                    <b>{x?.BATCHID}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>MILL LENGTH MTRS.</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    <b>{x?.LENGTH1}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>QTY. NOS.</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    <b>{x?.LOM_NO_PIECES}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                              <TableCell rowSpan={5} align="center">
                                <Grid container>
                                  <Grid
                                    style={{
                                      marginRight: "-4rem",
                                    }}
                                  >
                                    <QRCode
                                      size={230}
                                      value={`Cust. Order / Item: ${x?.ORDERNO?.toString() +
                                        " / " +
                                        x?.ORDERITEM?.toString()
                                        },Batch Id: ${x?.BATCHID?.toString()},Grade: ${x?.GRADE?.toString()},Length (${x?.LENGTH1?.toString()}),Mother Coil: ${x?.MOTHER_COIL?.toString()},Parent Batch: ${x?.PARENT_BATCH?.toString()}`}
                                      viewBox={`0 0 256 256`}
                                    />
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>QTY. KG</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    <b>{x?.LOM_MS_GROSS_CAL}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>QTY. MTRS.</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid></Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>GRADE</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    <b>{x?.GRADE}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>FG MATERIAL DESC.</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    <b>{x?.FG_MATERIAL_DESC}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>CRNT MTRL. DESC.</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    <b>{x?.RM_MATERIAL_DESC}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>

                            <TableRow>
                              <TableCell
                                scope="row"
                                style={{ borderRight: "1px solid lightgray" }}
                              >
                                <Grid container>
                                  <Grid>PROCESS PATH</Grid>
                                </Grid>
                              </TableCell>
                              <TableCell>
                                <Grid container>
                                  <Grid>
                                    <b>{x?.PROCESS_PATH_DESC}</b>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </React.Fragment> */}
                </Grid>
              </div>
            ))}
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
              trigger={() => (
                <MDButton size="small" color="info">
                  Print
                </MDButton>
              )}
              content={() => componentRef.current}
            />
          </Grid>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
