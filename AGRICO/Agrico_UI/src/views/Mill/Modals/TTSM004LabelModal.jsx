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
                              style={{
                                textAlign: 'left',
                                marginLeft: '50mm',
                                fontSize: '14px',
                                paddingTop: 0,
                                marginBottom: 10,
                              }}
                            >
                              {x?.PLANT === "0788" ? (
                                <>
                                  Village : Nifan & Savroli<br />
                                  P.O.Sajgaon, TAL- Khalapur <br />
                                  Khopoli, Dist.-Raigad, Maharashtra-410203- INDIA
                                </>
                              ) : (
                                "TUBES DIVISION, HOSUR"
                              )}
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
                              {x?.EOM_NO_PIECES}
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
                              <p>{x?.EOM_WORK_CENTER}</p>
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
                              {x?.EOM_MS_GROSS_CAL?.toFixed(2)} Kg
                            </Grid>
                            <Grid item xs={3} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Routing
                            </Grid>
                            <Grid item xs={4} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              {x?.EOM_PLANNED_PROC}
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
                              Heat No.
                            </Grid>
                            <Grid item xs={2.5} style={{ fontSize: '16px', color: 'black', fontFamily: "ArialBold", fontWeight: 'bold', border: '1px solid black', padding: '1px' }}>
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
                                value={`${x.BATCHID}, ,${x?.ORDERNO},${x?.ODIA?.toFixed(2)},${x?.THK?.toFixed(2)},${x?.LENGTH1?.toFixed(3)},${x?.EOM_MS_GROSS_CAL?.toFixed(2)},${x?.EOM_NO_PIECES}`}
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
                            {x?.PLANT === "0788" ? (
                                <>
                                  Village : Nifan & Savroli<br />
                                  P.O.Sajgaon, TAL- Khalapur <br />
                                  Khopoli, Dist.-Raigad, Maharashtra-410203- INDIA
                                </>
                              ) : (
                                "TUBES DIVISION, HOSUR"
                              )}
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
                              <p>{x?.EOM_NO_PIECES}</p>
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
                              {x?.EOM_MS_GROSS_CAL?.toFixed(2)} Kg
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
                              {x?.EOM_NO_CAST}
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
                                  {x?.EOM_PLANNED_PROC}
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
                                value={`${x.BATCHID}, ,${x?.ORDERNO},${x?.ODIA?.toFixed(2)} MM,${x?.THK?.toFixed(2)} MM,${x?.LENGTH1?.toFixed(3)} m,${x?.EOM_MS_GROSS_CAL?.toFixed(2)} Kg,${x?.EOM_NO_PIECES}`}
                                viewBox={`0 0 256 256`}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>}
                  </Grid>
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
