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

export default function DialogINLETModel(props) {
  console.log("props: ", props);
  const { reviewedBy, instrumentName, instrumentId, wiNo } = props;

  const [inletdata, setInletData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("md");
  const [loading, setLoading] = React.useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

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
            axiosAPI.post("api/LDCR002/getInletData", data, defaultOptions),
          ])
            .then(([response]) => {
              setInletData(response.data);
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
    size:A4 portrait;
    margin:4mm;
  }

  @media print {

    body{
      -webkit-print-color-adjust: exact;
      zoom:130%;
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

  const rowsPerPage = 25;

  const numPages = Math.max(1, Math.ceil(inletdata?.length / rowsPerPage));

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
                        justifyContent: "center",
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
                          BARE PIPE INSPECTION REPORT
                          <br />
                          {/* <br /> */}
                        </MDTypography>

                        <MDTypography
                          variant="h1"
                          noWrap
                          style={{
                            textAlign: "right",
                            fontSize: "8px",
                            color: "black",
                            fontFamily: "Times New Roman",
                            borderLeft: "1px solid black",
                            borderRight: "2px solid black",
                          }}
                        >
                          FORMAT NO : TSL/COAT/QC/F-03 REV.05 DATE : 13.11.2021
                        </MDTypography>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container>
                          <Grid
                            item
                            xs={2}
                            style={{
                              fontSize: "8px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              borderLeft: "1px solid black",
                              padding: "2px",
                            }}
                          >
                            <p>Date & Shift</p>
                            <p>Client</p>
                            <p>PO No.</p>
                            <p>Specification</p>
                            <p>Acceptance Criteria</p>
                            <p>Process Sheet No.</p>
                            <p>Procedure/WI No.</p>
                            <p>Pipe Size</p>
                            <p>Type Of Coating</p>
                          </Grid>

                          <Grid
                            item
                            xs={7}
                            style={{
                              fontSize: "8px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              padding: "2px",
                            }}
                          >
                            <p>: {inletdata?.[0]?.DATE_SHIFT}</p>

                            <p>: {inletdata?.[0]?.CLIENT}</p>

                            <p>: {inletdata?.[0]?.PO_REF_NO}</p>

                            <p>: {inletdata?.[0]?.SPEC}</p>

                            <p>: {inletdata?.[0]?.ACCEPTANCE_CRITERIA}</p>

                            <p>: {inletdata?.[0]?.PROCESS_SHEET_NO}</p>

                            <p>: {props?.wiNo}</p>

                            {/* <p>: {inletdata?.[0]?.PROCEDURE_WI_NO}</p> */}

                            <p>: {inletdata?.[0]?.PIPE_SIZE}</p>

                            <p>: {inletdata?.[0]?.TYPE_OF_COATING}</p>
                          </Grid>

                          <Grid
                            item
                            xs={1.05}
                            style={{
                              fontSize: "8px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              // borderLeft: "1px solid black",
                              padding: "2px",
                            }}
                          >
                            <p>Report No.</p>
                          </Grid>

                          <Grid
                            item
                            xs={1.95}
                            style={{
                              fontSize: "8px",
                              color: "black",
                              fontWeight: "bold",
                              borderTop: "1px solid black",
                              borderRight: "1px solid black",
                              padding: "2px",
                            }}
                          >
                            <p>: {inletdata?.[0]?.REP_NO}</p>
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            style={{
                              fontSize: "7.5px",
                              border: "1px solid black",
                              textAlign: "Left",
                            }}
                          >
                            <Grid
                              container
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Grid container xs={12}>
                                {/* TABLE HEADER */}

                                <Grid
                                  item
                                  xs={0.5}
                                  style={{
                                    fontSize: "8px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                >
                                  SR No.
                                </Grid>

                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                >
                                  Pipe No.
                                </Grid>

                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                >
                                  Heat No.
                                </Grid>

                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                >
                                  Length (Mtrs.)
                                </Grid>

                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                >
                                  ASL No.
                                </Grid>

                                <Grid
                                  item
                                  xs={3.5}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                >
                                  Visual Inspection
                                </Grid>

                                {/* DATA ROWS */}

                                {inletdata
                                  .slice(
                                    pageIndex * rowsPerPage,
                                    (pageIndex + 1) * rowsPerPage
                                  )
                                  .map((row, i) => (
                                    <Grid
                                      key={`data-${pageIndex}-${i}`}
                                      container
                                    >
                                      <Grid
                                        item
                                        xs={0.5}
                                        style={{
                                          fontSize: "9px",
                                          color: "black",
                                          fontWeight: "bold",
                                          borderBottom: "1px solid black",
                                          borderLeft: "1px solid black",
                                          padding: "3px",
                                          textAlign: "center",
                                        }}
                                      >
                                        
                                        {pageIndex * rowsPerPage + i + 1}
                                      </Grid>

                                      <Grid
                                        item
                                        xs={2}
                                        style={{
                                          fontSize: "9px",
                                          color: "black",
                                          fontWeight: "bold",
                                          borderBottom: "1px solid black",
                                          borderLeft: "1px solid black",
                                          padding: "3px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.TBP_BATCH_NO}
                                      </Grid>

                                      <Grid
                                        item
                                        xs={2}
                                        style={{
                                          fontSize: "9px",
                                          color: "black",
                                          fontWeight: "bold",
                                          borderBottom: "1px solid black",
                                          borderLeft: "1px solid black",
                                          padding: "3px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.HEAT_NO}
                                      </Grid>

                                      <Grid
                                        item
                                        xs={2}
                                        style={{
                                          fontSize: "9px",
                                          color: "black",
                                          fontWeight: "bold",
                                          borderBottom: "1px solid black",
                                          borderLeft: "1px solid black",
                                          padding: "3px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.LENGTH}
                                      </Grid>

                                      <Grid
                                        item
                                        xs={2}
                                        style={{
                                          fontSize: "9px",
                                          color: "black",
                                          fontWeight: "bold",
                                          borderBottom: "1px solid black",
                                          borderLeft: "1px solid black",
                                          padding: "3px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.TBP_ASL_NO_80}
                                      </Grid>

                                      <Grid
                                        item
                                        xs={3.5}
                                        style={{
                                          fontSize: "9px",
                                          color: "black",
                                          fontWeight: "bold",
                                          borderBottom: "1px solid black",
                                          borderLeft: "1px solid black",
                                          padding: "3px",
                                          textAlign: "center",
                                        }}
                                      >
                                        {row.TBP_VISUAL_INSP_80}
                                      </Grid>
                                    </Grid>
                                  ))}

                                {/* EMPTY ROWS */}

                                {Array.from({
                                  length: Math.max(
                                    0,
                                    rowsPerPage -
                                      inletdata.slice(
                                        pageIndex * rowsPerPage,
                                        (pageIndex + 1) * rowsPerPage
                                      ).length
                                  ),
                                }).map((_, i) => (
                                  <Grid
                                    key={`empty-${pageIndex}-${i}`}
                                    container
                                  >
                                    <Grid
                                      item
                                      xs={0.5}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                    >
                                      <br />
                                      
                                    
                                    </Grid>

                                    <Grid
                                      item
                                      xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                    />

                                    <Grid
                                      item
                                      xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                    />

                                    <Grid
                                      item
                                      xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                    />

                                    <Grid
                                      item
                                      xs={2}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                    />

                                    <Grid
                                      item
                                      xs={3.5}
                                  style={{
                                    fontSize: "10px",
                                    color: "black",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "2px",
                                    textAlign: "center",
                                  }}
                                    />
                                  </Grid>
                                ))}

                                {/* REMARKS */}

                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    border: "1px solid black",
                                    padding: "2px",
                                    fontSize: "9px",
                                    fontWeight: "bold",
                                    // fontFamily: "Times New Roman",
                                    color: "black",
                                    lineHeight: "11px",
                                  }}
                                >
                                  REMARKS: (1) Pipe No., Heat No., Length (Mtrs),
                                  ASL No. Checked w.r.t. Tally sheet of Bare
                                  Pipes.
                                  <br />
                                   (2) Visual Inspection of Bare Pipe like
                                  Surface Defect, Bevel Damage, Grease, Oil etc.
                                  On Pipe Surface.
                                </Grid>

                                {/* SPECIFICATION CONFIRMATION */}

                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    border: "1px solid black",
                                    padding: "4px",
                                    fontSize: "7px",
                                    fontWeight: "bold",
                                    fontFamily: "Arial",
                                    color: "black",
                                    lineHeight: "12px",
                                  }}
                                >
                                  ABOVE RESULTS ARE CONFIRMING TO SPECIFICATION:
                                  -{inletdata?.[0]?.SPEC}
                                  {" & QAP NO : "}
                                  {inletdata?.[0]?.ACCEPTANCE_CRITERIA}
                                  {" AND FOUND SATISFACTORY."}
                                </Grid>

                                {/* <Grid
                                  item
                                  xs={12}
                                  style={{
                                    fontSize: "6px",
                                    color: "black",
                                    border: "1px solid black",
                                    padding: "4px",
                                  }}
                                >
                                  <b>REMARKS :</b>
                                  <br />
                                  (1) Pipe No., Heat No., Length(Mtrs.), ASL No.
                                  Checked w.r.t. tally sheet of bare pipes.
                                  <br />
                                  (2) Visual Inspection of Bare Pipe like
                                  Surface Defect, Bevel Damage, Grease, Oil etc.
                                  on Pipe Surface.
                                </Grid> */}

                                {/* INSTRUMENT */}
                                <Grid
                                  item
                                  xs={12}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontSize: "9px",
                                    fontWeight: "bold",
                                    padding: "3px",
                                  }}
                                >
                                  USED INSTRUMENT
                                </Grid>

                                <Grid
                                  item
                                  xs={1}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                >
                                  SR.NO.
                                </Grid>

                                <Grid
                                  item
                                  xs={5}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                >
                                  INSTRUMENT NAME
                                </Grid>

                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                  }}
                                >
                                  INSTRUMENT ID / SERIAL NO
                                </Grid>

                                <Grid
                                  item
                                  xs={1}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                  }}
                                >
                                  1
                                </Grid>

                                <Grid
                                  item
                                  xs={5}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                  }}
                                >
                                  {props.instrumentName}
                                </Grid>

                                <Grid
                                  item
                                  xs={6}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                  }}
                                >
                                  {props.instrumentId}
                                </Grid>

                                {/* <Grid
                                  item
                                  xs={6}
                                  style={{
                                    fontSize: "8px",
                                    fontWeight: "bold",
                                    border: "1px solid black",
                                    padding: "3px",
                                    textAlign: "center",
                                  }}
                                >
                                  USED INSTRUMENT
                                </Grid>

                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  SR No.
                                </Grid>

                                <Grid
                                  item
                                  xs={5}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Instrument Name
                                </Grid>

                                <Grid
                                  item
                                  xs={5}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: "8px",
                                  }}
                                >
                                  Instrument ID / Serial No
                                </Grid>

                                <Grid
                                  item
                                  xs={2}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontSize: "8px",
                                  }}
                                >
                                  1
                                </Grid>

                                <Grid
                                  item
                                  xs={5}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontSize: "8px",
                                  }}
                                >
                                  {instrumentName}
                                </Grid>

                                <Grid
                                  item
                                  xs={5}
                                  style={{
                                    border: "1px solid black",
                                    textAlign: "center",
                                    fontSize: "8px",
                                  }}
                                >
                                  {instrumentId}
                                </Grid> */}

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
