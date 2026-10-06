import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";

import Tata_Round_Blue_Logo from "../../../assets/img/Tata_Round_Blue_Logo.png";
import tatasteellimited from "../../../assets/img/tatasteellimited.jpeg";

import axiosAPI from "../../../axiosAPI";
import Preloader from "components/Preloader/Preloader";
import ReactToPrint from "react-to-print";
import { GetAuthorization } from "utils";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function DialogBlastingModel(props) {
  console.log("props: ", props);
  const { reviewedBy, instrumentName, instrumentId, wiNo } = props;

  const [blastingData, setBlastingData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [loading, setLoading] = React.useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  const instrumentHeader = {
    borderRight: "1px solid black",
    borderBottom: "1px solid black",
    textAlign: "center",
    fontWeight: "bold",
    padding: "3px",
    fontSize: "7px",
  };

  const instrumentValue = {
    borderRight: "1px solid black",
    textAlign: "center",
    fontWeight: "bold",
    padding: "4px",
    fontSize: "7px",
    minHeight: "22px",
  };

  useEffect(() => {
    if (props.open) {
      const data = {
        plant: props?.plant?.value ? props.plant.value : "",
        orderNo: props.orderNo ? props.orderNo : "",
        item: props.item ? props.item : "",
        matno: props.matno ? props.matno : "",
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
        shift: props?.shift?.value ? props.shift.value : "",
      };

      GetAuthorization()
        .then((token) => {
          const defaultOptions = {
            headers: {
              Authorization: "Bearer " + token.accessToken,
            },
          };

          setLoading(true);

          Promise.all([
            axiosAPI.post("api/LDCR002/getBlastingData", data, defaultOptions),
          ])
            .then(([response]) => {
              setBlastingData(response.data);
              setInitialLoad(true);
            })
            .finally(() => {
              setLoading(false);
            });
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [props.open]);

  const handleClose = () => {
    props.close(false);
  };

  const componentRef = React.useRef();

 const pageStyle = `
 @page {
    size:A4 landscape;
    margin:4mm;
  }

  @media print {

    body{
      -webkit-print-color-adjust: exact;
      zoom:143%;
    }

    .print-page{
      page-break-after:always;
      position:relative;
    }

    .print-page:last-child{
      page-break-after:avoid;
    }
  }
  `;

  const rowsPerPage = 5;
  const numPages = Math.max(1, Math.ceil(blastingData?.length / rowsPerPage));

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

          <MDBox px={3} py={1} ref={componentRef} style={{ display: "block" }}>
            {Array.from({ length: numPages }).map((_, pageIndex) => (
              <div key={pageIndex} className="print-page">
                <div className="print-container">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={tatasteellimited}
                      alt="TatasteellimitedLogo"
                      style={{
                        position: "absolute",
                        top: 5,
                        left: 11,
                        height: "15px",
                        margin: "15px",
                      }}
                    />
                    <img
                      src={Tata_Round_Blue_Logo}
                      alt="Tata Logo"
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 20,
                        height: "15px", // Adjust the height as needed
                        margin: "7.5px", // Adjust the margin as needed
                      }}
                    />
                    <Grid
                      container
                      style={{
                        height: "auto",
                        width: "100%",
                        // justifyContent: "center",
                        display: "flex",
                        border: "1px solid black",
                      }}
                    >
                      <Grid item xs={12}>
                        <MDTypography
                          variant="h1"
                          noWrap
                          style={{
                            textAlign: "center",
                            marginTop: "0px",
                            fontSize: "12px",
                            color: "black",
                            fontFamily: "Times New Roman",
                            borderLeft: "1px solid black",
                            borderRight: "2px solid black",
                            borderTop: "1px solid black",
                          }}
                        >
                          <br />
                          <br />
                          PIPE COATING DIVISION
                          <br />
                          PHOSPHATE APPLICATION & BLASTING INSPECTION REPORT
                          <br />
                          <br />
                        </MDTypography>

                        <MDTypography
                          variant="h1"
                          noWrap
                          style={{
                            textAlign: "right",
                            fontSize: "7px",
                            color: "black",
                            fontFamily: "Times New Roman",
                            borderLeft: "1px solid black",
                            borderRight: "2px solid black",
                          }}
                        >
                          FORMAT NO : TSL/COAT/QC/F-51 REV-03 DATE : 19.01.2023
                        </MDTypography>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container>
                          {/* PDF HEADER START */}
                          <Grid
                            item
                            xs={1.5}
                            style={{
                              fontSize: "7.5px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              borderLeft: "1px solid black",
                              // padding: "1px",
                            }}
                          >
                            <p>Client</p>
                            <p>PO No.</p>
                            <p>Specification</p>
                            <p>Acceptance Criteria</p>
                            <p>Process Sheet</p>
                          </Grid>

                          <Grid
                            item
                            xs={5}
                            style={{
                              fontSize: "7.5px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              // padding: "1px",
                            }}
                          >
                            <p>: {blastingData?.[0]?.CLIENT}</p>
                            <p>: {blastingData?.[0]?.PO_REF_NO}</p>
                            <p>: {blastingData?.[0]?.SPEC}</p>
                            <p>: {blastingData?.[0]?.ACCEPTANCE_CRITERIA}</p>
                            <p>: {blastingData?.[0]?.PROCESS_SHEET_NO}</p>
                          </Grid>

                          <Grid
                            item
                            xs={1.5}
                            style={{
                              fontSize: "7.5px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              // borderLeft: "1px solid black",
                              // padding: "1px",
                            }}
                          >
                            <p>Report No.</p>
                            <p>Date & Shift</p>
                            <p>Pipe Size</p>
                            <p>Type Of Coating</p>
                            <p>Procedure/WI No.</p>
                          </Grid>

                          <Grid
                            item
                            xs={4}
                            style={{
                              fontSize: "7.5px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              borderRight: "1px solid black",
                              // padding: "1px",
                            }}
                          >
                            <p>: {blastingData?.[0]?.REP_NO}</p>
                            <p>: {blastingData?.[0]?.DATE_SHIFT}</p>
                            <p>: {blastingData?.[0]?.PIPE_SIZE}</p>
                            <p>: {blastingData?.[0]?.TYPE_OF_COATING}</p>
                            <p>: {props?.wiNo}</p>
                            {/* <p>: {blastingData?.[0]?.PROCEDURE_WI_NO}</p> */}
                          </Grid>

                          {/* PDF HEADER END */}

                          <TableContainer
                            sx={{
                              width: "100%",
                              margin: 0,
                              padding: 0,
                              borderLeft: "1px solid black",
                              borderRight: "1px solid black",
                              borderBottom: "1px solid black",
                              borderTop: "1px solid black",
                              borderRadius: 0,
                              boxShadow: "none",
                              overflow: "hidden",
                            }}
                          >
                            {/* TABLE HEADER START */}
                            <Table
                              sx={{
                                tableLayout: "fixed",
                                width: "100%",
                                // minWidth: "1400px",
                                borderCollapse: "collapse",
                                margin: 0,
                                "& td,& th": {
                                  border: "1px solid black",
                                  fontSize: "4px",
                                  fontWeight: "bold",
                                  padding: "0.5px",
                                  lineHeight: "8px",
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                },
                              }}
                            >
                              {/* Header */}

                              <TableHead style={{ margin: 0, padding: 0 }}>
                                {/* HEADER ROW 1 */}

                                <TableRow>
                                  <TableCell rowSpan={2}>SR.NO.</TableCell>

                                  <TableCell rowSpan={2}>PIPE NO</TableCell>

                                  <TableCell rowSpan={2}>ASL NO</TableCell>

                                  <TableCell colSpan={2}>
                                    PIPE TEMP. BEFORE
                                  </TableCell>

                                  <TableCell rowSpan={2}>DWELL TIME (Sec.)</TableCell>

                                  <TableCell colSpan={2}>
                                    pH of PIPE SURFACE
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Visual Inspection <br /> After Acid
                                    wash/Cleaning
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Pressure Of DM Water wash(bar)
                                  </TableCell>

                                  <TableCell colSpan={4}>
                                    DM water flow rate(GPM)
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Preheating Temp. Of Air <br /> After water
                                    wash(°C)
                                  </TableCell>

                                  <TableCell rowSpan={2}>RH %</TableCell>

                                  <TableCell rowSpan={2}>
                                    Amb. Temp.(°C)
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Dew Point(°C)
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Pipe Surf. Temp(°C)
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Degree Of Cleanness
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Roughness(µm-Rz)
                                  </TableCell>

                                  <TableCell colSpan={2}>
                                    Degree Of Dust
                                  </TableCell>

                                  <TableCell rowSpan={2}>
                                    Salt Cont.(µg/cm2)
                                  </TableCell>

                                  <TableCell rowSpan={2}>Rem.</TableCell>
                                </TableRow>

                                {/* HEADER ROW 2 */}

                                <TableRow>
                                  <TableCell>BLASTING(°C)</TableCell>

                                  <TableCell>ACID WASH</TableCell>

                                  <TableCell>Before Water Wash</TableCell>

                                  <TableCell>After Water Wash</TableCell>

                                  <TableCell>FM1</TableCell>

                                  <TableCell>FM2</TableCell>

                                  <TableCell>FM3</TableCell>

                                  <TableCell>TOT</TableCell>

                                  <TableCell>Rating</TableCell>

                                  <TableCell>Class</TableCell>
                                </TableRow>

                                {/* Spcified Row */}
                                <TableRow>
                                  {/* S.NO */}
                                  <TableCell>Specified</TableCell>

                                  {/* PIPE NO */}
                                  <TableCell />

                                  {/* ASL */}
                                  <TableCell>Min</TableCell>

                                  {/* BLAST TEMP */}
                                  <TableCell>
                                    {blastingData?.[0]?.PTEMP_BEFORE_BLAST_MIN}
                                  </TableCell>

                                  {/* ACID TEMP */}
                                  <TableCell>
                                    {blastingData?.[0]?.PTEMP_BEFORE_ACID_MIN}
                                  </TableCell>

                                  {/* DWELL TIME */}
                                  <TableCell>
                                    {blastingData?.[0]?.TCP_CP1_DWEL_TIME}
                                  </TableCell>

                                  {/* pH BEFORE WATER */}
                                  <TableCell>
                                    1
                                    {/* {blastingData?.[0]?.TCP_CP1_PH_SUR_PIPE} */}
                                  </TableCell>

                                  {/* pH AFTER WATER */}
                                  <TableCell>
                                    6
                                    {/* {blastingData?.[0]?.TCP_CP1_PH_SUR_PIPE} */}
                                  </TableCell>

                                  {/* VISUAL */}
                                  <TableCell>-</TableCell>

                                  {/* PRESSURE */}
                                  <TableCell>-</TableCell>

                                  {/* FM1 */}
                                  <TableCell>-</TableCell>

                                  {/* FM2 */}
                                  <TableCell>-</TableCell>

                                  {/* FM3 */}
                                  <TableCell>-</TableCell>

                                  {/* TOT */}
                                  <TableCell>-</TableCell>

                                  {/* PREHEATING TEMP */}
                                  <TableCell>
                                    {blastingData?.[0]?.PREHEAT_TEMP_AIRMIN}
                                  </TableCell>

                                  {/* RH */}
                                  <TableCell>-</TableCell>

                                  {/* AMBIENT TEMP */}
                                  <TableCell>-</TableCell>

                                  {/* DEW POINT */}
                                  <TableCell>Dew Point +3°C</TableCell>

                                  {/* PIPE SURFACE TEMP */}
                                  <TableCell>-</TableCell>

                                  {/* DEGREE OF CLEANNESS */}
                                  <TableCell>
                                    {blastingData?.[0]?.TCP_CP1_DO_CLEAN}
                                  </TableCell>

                                  {/* ROUGHNESS */}
                                  <TableCell>
                                    {blastingData?.[0]?.ROUGHNESS_MIN}
                                  </TableCell>

                                  {/* DUST RATING */}
                                  <TableCell>-</TableCell>

                                  {/* DUST CLASS */}
                                  <TableCell>-</TableCell>

                                  {/* SALT CONTENT */}
                                  <TableCell>-</TableCell>

                                  {/* REMARK */}
                                  <TableCell>-</TableCell>
                                </TableRow>

                                {/* Requirement Row */}
                                <TableRow>
                                  {/* S.NO */}
                                  <TableCell>Requirement</TableCell>

                                  {/* PIPE NO */}
                                  <TableCell />

                                  {/* ASL */}
                                  <TableCell>Max</TableCell>

                                  {/* BLAST TEMP */}
                                  <TableCell>
                                    {blastingData?.[0]?.PTEMP_BEFORE_BLAST_MAX}
                                  </TableCell>

                                  {/* ACID TEMP */}
                                  <TableCell>
                                    {blastingData?.[0]?.PTEMP_BEFORE_ACID_MAX}
                                  </TableCell>

                                  {/* DWELL TIME */}
                                  <TableCell>
                                    {blastingData?.[0]?.TCP_CP1_DWEL_TIME}
                                  </TableCell>

                                  {/* pH BEFORE WATER */}
                                  <TableCell>
                                    2
                                    {/* {blastingData?.[0]?.TCP_CP1_PH_SUR_PIPE} */}
                                  </TableCell>

                                  {/* pH AFTER WATER */}
                                  <TableCell>
                                    7
                                    {/* {blastingData?.[0]?.TCP_CP1_PH_SUR_PIPE} */}
                                  </TableCell>

                                  {/* VISUAL */}
                                  <TableCell>-</TableCell>

                                  {/* PRESSURE */}
                                  <TableCell>-</TableCell>

                                  {/* FM1 */}
                                  <TableCell>-</TableCell>

                                  {/* FM2 */}
                                  <TableCell>-</TableCell>

                                  {/* FM3 */}
                                  <TableCell>-</TableCell>

                                  {/* TOT */}
                                  <TableCell>-</TableCell>

                                  {/* PREHEATING TEMP */}
                                  <TableCell>
                                    {blastingData?.[0]?.PREHEAT_TEMP_AIRMAX}
                                  </TableCell>

                                  {/* RH */}
                                  <TableCell>
                                    {blastingData?.[0]?.TCP_CP1_ABRA_HUMID}
                                  </TableCell>

                                  {/* AMBIENT TEMP */}
                                  <TableCell>-</TableCell>

                                  {/* DEW POINT */}
                                  <TableCell>-</TableCell>

                                  {/* PIPE SURFACE TEMP */}
                                  <TableCell>-</TableCell>

                                  {/* DEGREE OF CLEANNESS */}
                                  <TableCell>
                                    {blastingData?.[0]?.TCP_CP1_DO_LEAN}
                                  </TableCell>

                                  {/* ROUGHNESS */}
                                  <TableCell>
                                    {blastingData?.[0]?.ROUGHNESS_MAX}*{" "}
                                  </TableCell>

                                  {/* DUST RATING */}
                                  <TableCell>
                                    {
                                      blastingData?.[0]
                                        ?.DEGREE_DUST_RATE_LEVL_MAX
                                    }
                                  </TableCell>

                                  {/* DUST CLASS */}
                                  <TableCell>2</TableCell>

                                  {/* SALT CONTENT */}
                                  <TableCell>
                                    {blastingData?.[0]?.SALT_CONT_MAX}
                                  </TableCell>

                                  {/* REMARK */}
                                  <TableCell>-</TableCell>
                                </TableRow>

                                {/* Data Row */}
                                {blastingData.map((row, index) => (
                                  <TableRow key={index}>
                                    {/* S.NO */}
                                    <TableCell>{index + 1}</TableCell>

                                    {/* PIPE NO */}
                                    <TableCell>{row.TBP_BATCH_NO}</TableCell>

                                    {/* ASL NO */}
                                    <TableCell>{row.TBP_ASL_NO_80}</TableCell>

                                    {/* BLAST TEMP */}
                                    <TableCell>{row.BLAST}</TableCell>

                                    {/* ACID WASH TEMP */}
                                    <TableCell>{row.ACID_WASH}</TableCell>

                                    {/* DWELL TIME */}
                                    <TableCell>{row.TBP_DWELLTM_100}</TableCell>

                                    {/* pH BEFORE WATER */}
                                    <TableCell>{row.B_WATER}</TableCell>

                                    {/* pH AFTER WATER */}
                                    <TableCell>{row.A_WATER}</TableCell>

                                    {/* VISUAL INSPECTION */}
                                    <TableCell>
                                      {row.TBP_VISUAL_INSP_80}
                                    </TableCell>

                                    {/* PRESSURE OF DM WATER */}
                                    <TableCell>
                                      {row.PRESSURE_DM_WATER}
                                    </TableCell>

                                    {/* FM1 */}
                                    <TableCell>{row.FM_1}</TableCell>

                                    {/* FM2 */}
                                    <TableCell>{row.FM_2}</TableCell>

                                    {/* FM3 */}
                                    <TableCell>{row.FM_3}</TableCell>

                                    {/* TOTAL FLOW */}
                                    <TableCell>{row.TOT}</TableCell>

                                    {/* PREHEAT AFTER WATER */}
                                    <TableCell>
                                      {row.PREHEAT_AFTER_WATER}
                                    </TableCell>

                                    {/* RH */}
                                    <TableCell>{row.TBP_RH_100}</TableCell>

                                    {/* AMBIENT TEMP */}
                                    <TableCell>
                                      {row.TBP_AMBT_TMP_100}
                                    </TableCell>

                                    {/* DEW POINT */}
                                    <TableCell>{row.TBP_DEW_TMP_100}</TableCell>

                                    {/* PIPE SURFACE TEMP */}
                                    <TableCell>
                                      {Number(row.TBP_PIPSUR_TEMP_100).toFixed(1)}
                                    </TableCell>

                                    {/* DEGREE OF CLEANNESS */}
                                    <TableCell>
                                      {row.TBP_DEG_CLEAN_100}
                                    </TableCell>

                                    {/* ROUGHNESS */}
                                    <TableCell>{row.ROUGHNESS_MIN}</TableCell>

                                    {/* DUST RATING */}
                                     <TableCell>
                                      {Number(row.DUST_RATING).toFixed(0)}
                                    </TableCell>

                                    {/* DUST CLASS */}
                                   <TableCell>
                                      {Number(row.DUST_LEVEL).toFixed(0)}
                                    </TableCell>

                                    {/* SALT CONTENT */}
                                    <TableCell>
                                      {Number(row.TBP_SALT_CONTA_100).toFixed(1)}
                                    </TableCell>

                                    {/* REMARK */}
                                    <TableCell>{row.TBP_REMARK}</TableCell>
                                  </TableRow>
                                ))}
                              </TableHead>
                              <TableBody></TableBody>
                            </Table>
                          </TableContainer>

                          {/* RAW MATERIAL SECTION */}

                          <Grid
                            container
                            style={{
                              borderLeft: "1px solid black",
                              borderRight: "1px solid black",
                              borderBottom: "1px solid black",
                              fontSize: "7px",
                              fontWeight: "bold",
                            }}
                          >
                            <Grid
                              item
                              xs={3}
                              style={{
                                borderRight: "1px solid black",
                                padding: "4px",
                              }}
                            >
                              Raw Material Used : Phosphoric Acid
                            </Grid>

                            <Grid
                              item
                              xs={3}
                              style={{
                                borderRight: "1px solid black",
                                padding: "4px",
                              }}
                            >
                              Manufacturer : {blastingData?.[0]?.MANUFACTURE}
                            </Grid>

                            <Grid
                              item
                              xs={3}
                              style={{
                                borderRight: "1px solid black",
                                padding: "4px",
                              }}
                            >
                              Grade : {blastingData?.[0]?.GRADE}
                            </Grid>

                            <Grid
                              item
                              xs={3}
                              style={{
                                padding: "4px",
                              }}
                            >
                              Batch No : {blastingData?.[0]?.BATCH}
                            </Grid>
                          </Grid>

                          {/* ELAPSE TIME ROW */}

                          <Grid
                            container
                            style={{
                              borderLeft: "1px solid black",
                              borderRight: "1px solid black",
                              borderBottom: "1px solid black",
                              fontSize: "7px",
                              fontWeight: "bold",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              style={{
                                padding: "4px",
                              }}
                            >
                              ELAPSE TIME OBSERVED MAXIMUM 1 Hr. BETWEEN
                              BLASTING & COATING APPLICATION.
                            </Grid>
                          </Grid>

                          {/* CONFIRMATION ROW */}

                          <Grid
                            container
                            style={{
                              borderLeft: "1px solid black",
                              borderRight: "1px solid black",
                              borderBottom: "1px solid black",
                              fontSize: "7px",
                              fontWeight: "bold",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              style={{
                                padding: "4px",
                                minHeight: "22px",
                              }}
                            >
                              ABOVE RESULTS ARE CONFIRMING TO SPECIFICATION :
                              {blastingData?.[0]?.SPEC}
                              &nbsp; AND ACCEPTANCE CRITERIA :
                              {blastingData?.[0]?.ACCEPTANCE_CRITERIA}
                              &nbsp; AND FOUND SATISFACTORY.
                            </Grid>
                          </Grid>

                          {/* USED INSTRUMENT */}
                          <Grid
                            container
                            style={{
                              borderLeft: "1px solid black",
                              borderRight: "1px solid black",
                              borderBottom: "1px solid black",
                              fontSize: "7px",
                            }}
                          >
                            <Grid
                              item
                              xs={12}
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                                borderBottom: "1px solid black",
                                padding: "4px",
                              }}
                            >
                              USED INSTRUMENT
                            </Grid>

                            {/* Header */}

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT NAME
                            </Grid>

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT ID
                            </Grid>

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT NAME
                            </Grid>

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT ID
                            </Grid>

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT NAME
                            </Grid>

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT ID
                            </Grid>

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT NAME
                            </Grid>

                            <Grid item xs={1.5} style={instrumentHeader}>
                              INSTRUMENT ID
                            </Grid>

                            {/* Values */}

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentName1}
                            </Grid>

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentId1}
                            </Grid>

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentName2}
                            </Grid>

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentId2}
                            </Grid>

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentName3}
                            </Grid>

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentId3}
                            </Grid>

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentName4}
                            </Grid>

                            <Grid item xs={1.5} style={instrumentValue}>
                              {props?.instrumentId4}
                            </Grid>
                          </Grid>

                          {/* SIGNATURE */}

                          <Grid
                            item
                            xs={6}
                            style={{
                              fontSize: "9px",
                              fontWeight: "bold",
                              border: "1px solid black",
                              padding: "2px",
                              textAlign: "center",
                            }}
                          >
                            INSPECTED BY
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            style={{
                              fontSize: "9px",
                              fontWeight: "bold",
                              border: "1px solid black",
                              padding: "2px",
                              textAlign: "center",
                            }}
                          >
                            ACCEPTED BY
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            style={{
                              fontSize: "9px",
                              fontWeight: "bold",
                              border: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                            }}
                          >
                            <br />
                            <br />
                            <br />
                            {props?.reviewedBy}
                            <br />
                            (QC Engineer)
                            <br />
                          </Grid>

                          <Grid
                            item
                            xs={6}
                            style={{
                              fontSize: "9px",
                              fontWeight: "bold",
                              border: "1px solid black",
                              padding: "5px",
                              textAlign: "center",
                            }}
                          >
                            <br />
                            <br />
                            <br />
                            <br />
                            TPIA / CLIENT
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </div>
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
              pageStyle={pageStyle}
            />
          </Grid>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
