import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { AppBar, Tab, Tabs } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DeleteIcon from "@mui/icons-material/Delete";
import jwt from "jsonwebtoken";
import alertify from "alertifyjs";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

import { GetAuthorization } from "../../utils";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import routes from "routes";

import "../../alertify.css";
import "../../tabulatorCss.scss";

/**
 * LDLTS008 - Process Entry Sheet (Internal Coating)
 *
 * Important:
 * 1. Authorization/validation flow is kept same as LDLTS003.
 * 3. Sales Order and Item are NOT repeated inside the tab form body.
 * 4. All fields are read-only.
 * 5. Only parent-level Delete Process Sheet button is available.
 * 6. Layout is written manually to match the embedded screenshots:
 *    - multiple MDBox sections with headings
 *    - same sequence
 *    - units shown beside the fields
 *    - full-row fields retained where required
 */

const labelStyle = {
  marginTop: "8px",
  fontSize: "0.9rem",
};

const valueInputStyle = {
  marginLeft: "8px",
};

const selectContainerStyle = {
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  position: "relative",
  zIndex: 5,
};

const reactSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff",
    borderColor: state.isFocused ? "#1976d2" : "#ced4da",
    boxShadow: state.isFocused
      ? "0 0 0 1px #1976d2"
      : "none",
    minHeight: "38px",

    "&:hover": {
      borderColor: "#1976d2",
    },
  }),

  valueContainer: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#000", // IMPORTANT
    fontWeight: 500,
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#888",
  }),

  input: (provided) => ({
    ...provided,
    color: "#000",
  }),

  menu: (provided) => ({
    ...provided,
    backgroundColor: "#fff",
    zIndex: 9999,
  }),

  option: (provided, state) => ({
    ...provided,
    color: "#000",

    backgroundColor: state.isSelected
      ? "#1976d2"
      : state.isFocused
      ? "#e3f2fd"
      : "#fff",

    color: state.isSelected ? "#fff" : "#000",

    cursor: "pointer",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  dropdownIndicator: (provided) => ({
    ...provided,
    color: "#666",

    "&:hover": {
      color: "#1976d2",
    },
  }),
};

const UNITS = {
  CELSIUS: "\u00B0C",
  MICROGRAM_CM2: "\u00B5g/cm2",
  MICRON: "\u00B5m",
  MICRON_RA: "\u00B5m(Ra)",
};

const sectionBoxStyle = {
  border: "1px solid #dcdcdc",
  marginBottom: "1.25rem",
  paddingBottom: "0.8rem",
  background: "#ffffff",
};

const sectionTitleStyle = {
  borderBottom: "2px solid #03a9f4",
  padding: "4px 10px 2px 10px",
  marginBottom: "0.6rem",
};

const unitStyle = {
  marginTop: "8px",
  fontSize: "0.9rem",
  color: "blue",
  whiteSpace: "nowrap",
};

const getValue = (processData, field) => {
  if (!field) {
    return "";
  }

  if (Array.isArray(field)) {
    for (const key of field) {
      const value = processData?.[key];
      if (value !== null && value !== undefined && value !== "") {
        return value;
      }
    }
    return "";
  }

  const value = processData?.[field];

  if (value === null || value === undefined) {
    return "";
  }

  return value;
};

function FormSection({ title, children }) {
  return (
    <MDBox style={sectionBoxStyle}>
      <MDBox style={sectionTitleStyle}>
        <MDTypography
          fontWeight="regular"
          fontSize="small"
          textTransform="none"
          variant="h6"
          color="dark"
          style={{ fontSize: "0.95rem" }}
        >
          {title}
        </MDTypography>
      </MDBox>

      <MDBox px={2}>
        <Grid container spacing={1}>
          {children}
        </Grid>
      </MDBox>
    </MDBox>
  );
}

function LabelCell({ children, xs = 2, align = "left", noWrap = true }) {
  return (
    <Grid item xs={xs}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        textTransform="none"
        variant="h6"
        color="dark"
        style={{ ...labelStyle, textAlign: align }}
        noWrap={noWrap}
      >
        {children}
      </MDTypography>
    </Grid>
  );
}

function ValueCell({ processData, field, xs = 3 }) {
  return (
    <Grid item xs={xs}>
      <MDInput
        fullWidth
        value={getValue(processData, field)}
        disabled
        style={valueInputStyle}
      />
    </Grid>
  );
}

function UnitCell({ children, xs = 1 }) {
  return (
    <Grid item xs={xs}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        textTransform="none"
        variant="h6"
        color="dark"
        style={unitStyle}
        noWrap
      >
        {children}
      </MDTypography>
    </Grid>
  );
}

function EmptyCell({ xs = 1 }) {
  return <Grid item xs={xs}></Grid>;
}

function FormRow({ children }) {
  return (
    <Grid item xs={12}>
      <Grid container alignItems="center" spacing={1}>
        {children}
      </Grid>
    </Grid>
  );
}

function CompactRow({ children }) {
  return (
    <Grid item xs={12}>
      <MDBox
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          flexWrap: "nowrap",
          width: "100%",
          overflowX: "hidden",
          marginBottom: "4px",
        }}
      >
        {children}
      </MDBox>
    </Grid>
  );
}

function CompactLabel({ children, width = 120, align = "left" }) {
  return (
    <MDTypography
      fontWeight="regular"
      fontSize="small"
      textTransform="none"
      variant="h6"
      color="dark"
      style={{
        ...labelStyle,
        width,
        minWidth: width,
        textAlign: align,
        fontSize: "0.82rem",
        whiteSpace: "nowrap",
        overflow: "visible",
      }}
    >
      {children}
    </MDTypography>
  );
}

function CompactInput({ processData, field, width = 90, flex = "0 0 auto" }) {
  return (
    <MDBox style={{ width, minWidth: width, flex }}>
      <MDInput
        fullWidth
        value={getValue(processData, field)}
        disabled
        style={{ marginLeft: 0 }}
      />
    </MDBox>
  );
}

function CompactUnit({ children, width = 55 }) {
  return (
    <MDTypography
      fontWeight="regular"
      fontSize="small"
      textTransform="none"
      variant="h6"
      color="dark"
      style={{
        ...unitStyle,
        width,
        minWidth: width,
        fontSize: "0.82rem",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </MDTypography>
  );
}

function SimpleWideRow({ label, field, processData, inputXs = 8 }) {
  return (
    <FormRow>
      <LabelCell xs={2}>{label}</LabelCell>
      <ValueCell xs={inputXs} processData={processData} field={field} />
    </FormRow>
  );
}

function SimpleFullRow({ label, field, processData }) {
  return (
    <FormRow>
      <LabelCell xs={2}>{label}</LabelCell>
      <ValueCell xs={9} processData={processData} field={field} />
    </FormRow>
  );
}

function MinMaxBlock({
  label,
  minField,
  maxField,
  processData,
  unit,
  labelXs = 2,
  fieldXs = 1,
  unitXs = 1,
}) {
  return (
    <>
      <LabelCell xs={labelXs}>{label}</LabelCell>
      <LabelCell xs={0.5} align="right">
        Min
      </LabelCell>
      <ValueCell xs={fieldXs} processData={processData} field={minField} />
      <LabelCell xs={0.5} align="right">
        Max
      </LabelCell>
      <ValueCell xs={fieldXs} processData={processData} field={maxField} />
      {unit ? <UnitCell xs={unitXs}>{unit}</UnitCell> : <EmptyCell xs={unitXs} />}
    </>
  );
}

function SalesDetails({ processData }) {
  return (
    <Grid item xs={12}>
      <Card>
        <MDBox px={0} py={2}>
          <FormSection title="General Sales Data">
            <FormRow>
              <LabelCell xs={2}>Process Sheet No</LabelCell>
              <ValueCell xs={2} processData={processData} field="TPI_SD_PROC_SHEET" />
              <LabelCell xs={2}>Process Sheet Date</LabelCell>
              <ValueCell xs={2} processData={processData} field="TPI_CRT_DT" />
            </FormRow>

            <FormRow>
              <LabelCell xs={2}>Client Name</LabelCell>
              <ValueCell xs={2} processData={processData} field="TPI_SD_CUST_CD" />
              <ValueCell
                xs={7}
                processData={processData}
                field={["TPI_SD_CUST_DESC", "CUST_DESC", "CUSTOMER_NAME"]}
              />
            </FormRow>

            <SimpleFullRow
              label="PO Number"
              field={["TPI_PO_NUMBER", "TPI_PO_ITEM_NO", "PO_NUMBER"]}
              processData={processData}
            />

            <FormRow>
              <LabelCell xs={2}>Order Quantity</LabelCell>
              <ValueCell
                xs={3}
                processData={processData}
                field={["TPI_ORDER_QTY", "ORDER_QUANTITY", "TPI_SD_QAP_NO1"]}
              />
              <LabelCell xs={1}>Grade</LabelCell>
              <ValueCell xs={2} processData={processData} field={["TPI_SD_GRADE", "GRADE"]} />
            </FormRow>

            <FormRow>
              <LabelCell xs={2}>OD(MM)</LabelCell>
              <ValueCell xs={2} processData={processData} field={["TPI_SD_OD", "ODIA", "OD"]} />
              <LabelCell xs={1}>Thk(MM)</LabelCell>
              <ValueCell xs={2} processData={processData} field={["TPI_SD_THK", "THICK", "THK"]} />
              <LabelCell xs={1}>Len(MTR)</LabelCell>
              <ValueCell xs={3} processData={processData} field={["TPI_SD_LEN", "LEN", "LENGTH"]} />
            </FormRow>

            <SimpleFullRow
              label="Bare Spec.& Grade"
              field={["TPI_SD_SPEC_GRADE", "SPEC_GRADE", "TPI_SD_TECH_SPEC"]}
              processData={processData}
            />

            <SimpleWideRow
              label="Coating Type"
              field={["TPI_SD_COAT_TYPE", "TPI_SD_IC_TYPE"]}
              processData={processData}
              inputXs={6}
            />

            <SimpleWideRow
              label="QAP Number"
              field="TPI_SD_QAP_NO"
              processData={processData}
              inputXs={6}
            />

            <SimpleFullRow
              label="Technical specif."
              field="TPI_SD_TECH_SPEC"
              processData={processData}
            />

            <SimpleFullRow
              label="PO.Ref.No."
              field="TPI_SD_POREF_NO"
              processData={processData}
            />

            <SimpleFullRow
              label="Procedure / WI No"
              field={["TPI_SD_PRO_WINO", "TPI_PROC_WI_NO"]}
              processData={processData}
            />

            <SimpleWideRow
              label="Inspection Agency"
              field="TPI_SD_INSP_AGEN"
              processData={processData}
              inputXs={5}
            />
          </FormSection>
        </MDBox>
      </Card>
    </Grid>
  );
}

function CoatingProcessOne({ processData }) {
  return (
    <Grid item xs={12}>
      <Card>
        <MDBox px={0} py={2}>
          <FormSection title="Inspection of Bare/Coated Pipes">
            <SimpleWideRow
              label="Verification ECT"
              field="TPI_CP1_VERIF_BPIPE"
              processData={processData}
              inputXs={6}
            />

            <SimpleWideRow
              label="Visual Inspection"
              field="TPI_CP1_VISUAL_INSP"
              processData={processData}
              inputXs={6}
            />

            <SimpleWideRow
              label="Inspec.of Abrasive"
              field="TPI_CP1_INSP_ABRAS"
              processData={processData}
              inputXs={7}
            />

            <SimpleWideRow
              label="Relative Humidity"
              field="TPI_CP1_REL_HUMID"
              processData={processData}
              inputXs={7}
            />

            <FormRow>
              <MinMaxBlock
                label="Pre Heating Temp."
                minField="TPI_CP1_HTEMP_MIN"
                maxField="TPI_CP1_HTEMP_MAX"
                processData={processData}
                unit={UNITS.CELSIUS}
                labelXs={2}
                fieldXs={1}
              />
              <LabelCell xs={2}>Salt Contamination Test</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_CP1_SALT_TEST" />
              <UnitCell xs={1}>{UNITS.MICROGRAM_CM2}</UnitCell>
            </FormRow>
          </FormSection>

          <FormSection title="Inspection After Abresive Blasting">
            <SimpleWideRow
              label="Relative Humidity"
              field="TPI_CP1_ABRA_HUMID"
              processData={processData}
              inputXs={7}
            />

            <FormRow>
              <LabelCell xs={2}>Degree of Cleannes</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_CP1_DO_CLEAN" />
              <LabelCell xs={2}>Surface Rz Profile</LabelCell>
              <LabelCell xs={0.5} align="right">
                Min
              </LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_CP1_SRUF_MIN" />
              <LabelCell xs={0.5} align="right">
                Max
              </LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_CP1_SRUF_MAX" />
              <UnitCell xs={1}>{UNITS.MICRON}</UnitCell>
            </FormRow>

            <SimpleWideRow
              label="Anchor Pattern 30X"
              field="TPI_CP1_AP_30X"
              processData={processData}
              inputXs={7}
            />

            <FormRow>
              <LabelCell xs={2}>Degree Of Dust Max</LabelCell>
              <ValueCell xs={2} processData={processData} field="TPI_CP1_DG_DUST_MAX" />
              <LabelCell xs={2}>Salt Contamination Test</LabelCell>
              <ValueCell xs={2} processData={processData} field="TPI_CP1_SALT_CONT" />
              <UnitCell xs={1}>{UNITS.MICROGRAM_CM2}</UnitCell>
            </FormRow>

            <SimpleWideRow
              label="ID Cleaning B Pipe"
              field="TPI_CP1_ID_CLEAN_BPIPE"
              processData={processData}
              inputXs={7}
            />

            <SimpleWideRow
              label="Visual Check"
              field="TPI_CP1_VISUAL_CHK"
              processData={processData}
              inputXs={7}
            />

            <FormRow>
              <MinMaxBlock
                label="Pipe surface Temp."
                minField="TPI_CP1_PRE_HEAT_MIN"
                maxField="TPI_CP1_PRE_HEAT_MAX"
                processData={processData}
                unit={UNITS.CELSIUS}
                labelXs={2}
                fieldXs={1}
              />
            </FormRow>

            <FormRow>
              <MinMaxBlock
                label="Dew point Temp."
                minField="TPI_CP1_HEATAIRTEMP_MIN"
                maxField="TPI_CP1_HEATAIRTEMP_MAX"
                processData={processData}
                unit={UNITS.CELSIUS}
                labelXs={2}
                fieldXs={1}
              />
            </FormRow>

            <FormRow>
              <MinMaxBlock
                label="Ambient Temp."
                minField="TPI_CP1_CHPHEATEMP_MIN"
                maxField="TPI_CP1_CHPHEATEMP_MAX"
                processData={processData}
                unit={UNITS.CELSIUS}
                labelXs={2}
                fieldXs={1}
              />
              <LabelCell xs={1.5}>DWELL Time</LabelCell>
              <ValueCell xs={1.5} processData={processData} field="TPI_CP1_DWEL_TIME" />
              <UnitCell xs={1}>Sec</UnitCell>
            </FormRow>
          </FormSection>
        </MDBox>
      </Card>
    </Grid>
  );
}

function CoatingProcessTwo({ processData }) {
  return (
    <Grid item xs={12}>
      <Card>
        <MDBox px={0} py={2}>
          <FormSection title="Coating Application">
            <CompactRow>
              <CompactLabel width={140}>WET Film Thickness</CompactLabel>
              <CompactLabel width={30} align="right">Min</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_CP2_ADHE_THICK_MIN" />
              <CompactLabel width={35} align="right">Max</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_CP2_ADHE_THICK_MAX" />
              <CompactUnit width={55}>{UNITS.MICRON}</CompactUnit>
              <CompactLabel width={230}>RECORDING OF BATCH. NO.-Base</CompactLabel>
              <CompactInput width={140} processData={processData} field="TPI_LD_MSHORT_GRRATIO" />
              <CompactLabel width={155}>Mix Paint-Ratio(Part-A)</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_CP2_TEMP_AQUEN_MIN" />
            </CompactRow>

            <CompactRow>
              <CompactLabel width={140}>DRY Film Thickness</CompactLabel>
              <CompactLabel width={30} align="right">Min</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_CP2_CTHICK_EPOXY_MIN" />
              <CompactLabel width={35} align="right">Max</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_CP2_CTHICK_EPOXY_MAX" />
              <CompactUnit width={55}>{UNITS.MICRON}</CompactUnit>
              <CompactLabel width={230}>RECORDING OF BATCH. NO.-Hardner</CompactLabel>
              <CompactInput width={140} processData={processData} field="TPI_CP2_COMP_AIR" />
              <CompactLabel width={155}>Mix Paint-Ratio(Part-B)</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_CP2_TEMP_AQUEN_MAX" />
            </CompactRow>

            <SimpleFullRow
              label="Visual Inspection"
              field="TPI_CP2_VS_INSP_CPIPE"
              processData={processData}
            />
          </FormSection>

          <FormSection title="Final Coating">
            <FormRow>
              <MinMaxBlock
                label="Cut Back (mm)"
                minField="TPI_CP2_CUT_BACK_MIN"
                maxField="TPI_CP2_CUT_BACK_MAX"
                processData={processData}
                labelXs={1.5}
                fieldXs={1}
              />
              <LabelCell xs={2}>Roughness of ID Coating</LabelCell>
              <LabelCell xs={0.5} align="right">
                Min
              </LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_CP2_TOT_CTHICK_MIN" />
              <LabelCell xs={0.5} align="right">
                Max
              </LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_CP2_TOT_CTHICK_MAX" />
              <UnitCell xs={1}>{UNITS.MICRON_RA}</UnitCell>
            </FormRow>

            <SimpleFullRow
              label="Barcode Level"
              field="TPI_CP2_BARCODE"
              processData={processData}
            />

            <SimpleFullRow
              label="Stencil/Marking"
              field="TPI_CP2_STENCILLING_MARK"
              processData={processData}
            />

            <FormRow>
              <LabelCell xs={2}>Color Band</LabelCell>
              <ValueCell xs={5} processData={processData} field="TPI_CP2_COLOR_CODE" />
              <LabelCell xs={2}>Pipe Identifican</LabelCell>
              <ValueCell xs={3} processData={processData} field="TPI_CP2_PIPE_IDENTIF" />
            </FormRow>

            <FormRow>
              <LabelCell xs={2}>Low Stress punch</LabelCell>
              <ValueCell xs={5} processData={processData} field="TPI_CP2_LOW_STRES_PUNCH" />
              <LabelCell xs={2}>visual check</LabelCell>
              <ValueCell xs={2} processData={processData} field="TPI_CP2_VIS_CHECK" />
            </FormRow>

            <FormRow>
              <LabelCell xs={2}>Coating Repair</LabelCell>
              <ValueCell xs={5} processData={processData} field="TPI_CP2_COATING_REPAIR" />
              <LabelCell xs={2}>Residual Magnetism</LabelCell>
              <ValueCell xs={3} processData={processData} field="TPI_CP2_RESU_MG" />
            </FormRow>
          </FormSection>
        </MDBox>
      </Card>
    </Grid>
  );
}

function LabDetails({ processData }) {
  return (
    <Grid item xs={12}>
      <Card>
        <MDBox px={0} py={2}>
          <FormSection title="Raw Material Testing">
            <FormRow>
              <MinMaxBlock
                label="Mix Paint Viscosity"
                minField="TPI_LD_ALK_MIN"
                maxField="TPI_LD_ALK_MAX"
                processData={processData}
                unit="sec"
                labelXs={2}
                fieldXs={1}
              />
            </FormRow>

            <FormRow>
              <MinMaxBlock
                label="Density"
                minField="TPI_LD_CHROM_SOL_MIN"
                maxField="TPI_LD_CHROM_SOL_MAX"
                processData={processData}
                labelXs={2}
                fieldXs={1}
              />
            </FormRow>

            <FormRow>
              <MinMaxBlock
                label="Specific Gravity"
                minField="TPI_LD_CLORID_SOL_MIN"
                maxField="TPI_LD_CLORID_SOL_MAX"
                processData={processData}
                labelXs={2}
                fieldXs={1}
              />
            </FormRow>

            <SimpleWideRow
              label="QA of Compressed Air"
              field="TPI_LD_COMP_AIR"
              processData={processData}
              inputXs={6}
            />
          </FormSection>

          <FormSection title="TESTING IN CURED PAINT FILM ON PANELS">
            <CompactRow>
              <CompactLabel width={170}>POROSITY TEST</CompactLabel>
              <CompactLabel width={30} align="right">Min</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_LD_DEGREE_CURE_MIN" />
              <CompactLabel width={35} align="right">Max</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_LD_DEGREE_CURE_MAX" />
              <CompactLabel width={75}>REF STD</CompactLabel>
              <CompactInput width={300} flex="1 1 300px" processData={processData} field="TPI_LD_DCURE_REFSTD" />
            </CompactRow>

            <CompactRow>
              <CompactLabel width={170}>BUCHHOLZ HARDNESS</CompactLabel>
              <CompactLabel width={30} align="right">Min</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_LD_DH_MIN" />
              <CompactLabel width={35} align="right">Max</CompactLabel>
              <CompactInput width={80} processData={processData} field="TPI_LD_DH_MAX" />
              <CompactLabel width={75}>REF STD</CompactLabel>
              <CompactInput width={300} flex="1 1 300px" processData={processData} field="TPI_LD_24H_REFSTD" />
            </CompactRow>

            <CompactRow>
              <CompactLabel width={170}>ADHESION TEST</CompactLabel>
              <CompactInput width={520} flex="1 1 520px" processData={processData} field="TPI_LD_FLEXI_FBE" />
              <CompactLabel width={75}>REF STD</CompactLabel>
              <CompactInput width={300} flex="1 1 300px" processData={processData} field="TPI_LD_INTERPORO_REFSTD" />
            </CompactRow>

            <CompactRow>
              <CompactLabel width={170}>BEND TEST</CompactLabel>
              <CompactInput width={520} flex="1 1 520px" processData={processData} field="TPI_LD_INTERPORO_MIN" />
              <CompactLabel width={75}>REF STD</CompactLabel>
              <CompactInput width={300} flex="1 1 300px" processData={processData} field="TPI_LD_CS_REFSTD" />
            </CompactRow>

            <CompactRow>
              <CompactLabel width={170}>CURING TEST</CompactLabel>
              <CompactInput width={520} flex="1 1 520px" processData={processData} field="TPI_LD_CS_MIN" />
              <CompactLabel width={75}>REF STD</CompactLabel>
              <CompactInput width={300} flex="1 1 300px" processData={processData} field="TPI_LD_FLEX_REFSTD" />
            </CompactRow>
          </FormSection>
        </MDBox>
      </Card>
    </Grid>
  );
}

function InstrumentDetails({ processData }) {
  return (
    <Grid item xs={12}>
      <Card>
        <MDBox px={0} py={2}>
          <FormSection title="Holiday Detector">
            <FormRow>
              <LabelCell xs={3}>Holiday Detector Min</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_HOLI_DETEC_MIN" />
              <UnitCell xs={1}>Kv</UnitCell>
              <EmptyCell xs={1} />
              <LabelCell xs={3}>Holiday Detector Max</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_HOLI_DETEC_MAX" />
              <UnitCell xs={1}>Kv</UnitCell>
            </FormRow>
          </FormSection>

          <FormSection title="Coating Thickness Gauge">
            <FormRow>
              <LabelCell xs={3}>Coating Thickness Gauge Min</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_COAT_THKGAUGE_MIN" />
              <UnitCell xs={1}>%</UnitCell>
              <EmptyCell xs={1} />
              <LabelCell xs={3}>Coating Thickness Gauge Max</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_COAT_THKGAUGE_MAX" />
              <UnitCell xs={1}>%</UnitCell>
            </FormRow>
          </FormSection>

          <FormSection title="Roughness Tester">
            <FormRow>
              <LabelCell xs={3}>Roughness Testter Min</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_ROUGH_TEST_MIN" />
              <UnitCell xs={1}>%</UnitCell>
              <EmptyCell xs={1} />
              <LabelCell xs={3}>Roughness Testter Max</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_ROUGH_TEST_MAX" />
              <UnitCell xs={1}>%</UnitCell>
            </FormRow>
          </FormSection>

          <FormSection title="Digital Temp.Gauge">
            <FormRow>
              <LabelCell xs={3}>Digital Temp.Gauge Min</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_DIGITEMP_GAUG_MIN" />
              <UnitCell xs={1}>%</UnitCell>
              <EmptyCell xs={1} />
              <LabelCell xs={3}>Digital Temp.Gauge Max</LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_ID_DIGITEMP_GAUG_MAX" />
              <UnitCell xs={1}>%</UnitCell>
            </FormRow>
          </FormSection>
        </MDBox>
      </Card>
    </Grid>
  );
}

function FieldTest({ processData }) {
  return (
    <Grid item xs={12}>
      <Card>
        <MDBox px={0} py={2}>
          <FormSection title="Partially Coated & 3LPE Testing">
            <SimpleWideRow
              label="Adhession V Cut Test"
              field="TPI_FD_ADHESION_VCUT_TEST"
              processData={processData}
              inputXs={4}
            />

            <FormRow>
              <LabelCell xs={2}>Pull of Adhesion</LabelCell>
              <LabelCell xs={0.5} align="right">
                Min
              </LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_FD_3LPE_HOLIDAY_MIN" />
              <LabelCell xs={0.5} align="right">
                Max
              </LabelCell>
              <ValueCell xs={1} processData={processData} field="TPI_FD_3LPE_HOLIDAY_MAX" />
              <UnitCell xs={1}>PSI</UnitCell>
            </FormRow>

            <SimpleFullRow
              label="Cross Cut Test"
              field="TPI_FD_IMPACT_TEST"
              processData={processData}
            />
          </FormSection>
        </MDBox>
      </Card>
    </Grid>
  );
}

export default function LDLTS008() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
  });

  const [processData, setProcessData] = useState({});

  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }

      GetAuthorization().then((token) => {
        validateUser(token);
        getOrderId(token.accessToken);
      });
    }

    fetchData();
  }, []);

  const validateUser = async (token) => {
    try {
      let plant = "";

      const userDetails = jwt.verify(
        token.refreshToken,
        serverDetails.REFRESH_KEY
      );

      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ""
      ) {
        window.location.href = "#/signin";
      }

      const userId = serverDetails.PersonalNo;
      const pageName = "LDLTS003";

      const authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

      if (authDetails) {
        setRestricted(false);

        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);

          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW") {
            setReadWriteAccess(false);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page"
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page"
          );
        }
      } else {
        setRestricted(true);
        setAdmin(false);
      }
    } catch {
      setRestricted(true);
      setAdmin(false);

      if (serverDetails.devMode == false) {
        window.location.href = "#/signin";
      }
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      const url = "api/users/screenAuth";
      const data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          reject(null);
        } else {
          const encryptUserInfo = response.data;
          const authDetails = jwt.verify(
            encryptUserInfo,
            serverDetails.SCREEN_AUTH_KEY
          );

          if (authDetails) {
            resolve(authDetails);
          } else {
            reject(null);
          }
        }
      });
    });

  const getOrderId = (accessToken) => {
    return new Promise((resolve) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      const data = {
        plant: "0780",
      };

      const url = "api/LDLTS008/getOrderId";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error fetching Data");
            return;
          }

          const items = [];

          res?.data?.map((row) => {
            const orderId = row.ENC_ID_ORDER ?? row.TPI_ORDER_ID ?? row.ORDER_ID;

            if (orderId) {
              items.push({
                label: orderId,
                value: orderId,
              });
            }
          });

          setSalesOrdId(items);
        })
        .finally(() => resolve());
    });
  };

  const getItemNo = (accessToken, ordId) => {
    return new Promise((resolve) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      const data = {
        orderId: ordId,
      };

      const url = "api/LDLTS008/getItemNo";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error fetching Data");
            return;
          }

          const items = [];

          res?.data?.map((row) => {
            const itemNo = row.ENC_NO_ITEM ?? row.TPI_ORDER_ITEM ?? row.ITEM_NO;

            if (itemNo) {
              items.push({
                label: itemNo,
                value: itemNo,
              });
            }
          });

          setItemData(items);
        })
        .finally(() => resolve());
    });
  };

  const getProcessSheetData = async (ordId, itemNo) => {
    if (!ordId || !itemNo) {
      handleClearAll(false);
      return;
    }

    setLoading(true);

    const data = {
      orderId: ordId,
      itemNo: itemNo,
    };

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS008/getProcessSheetData";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText !== "OK") {
            alertify.error("Error fetching Data");
            return;
          }

          if (!res?.data || res?.data?.length === 0) {
            alertify.error("No Data Found!");
            setProcessData({});
            return;
          }

          const rowData = Array.isArray(res.data) ? res.data[0] : res.data;
          setProcessData(rowData ?? {});
        })
        .catch((error) => {
          alertify.error("Error fetching data: " + error);
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const DeleteProcesssheet = async () => {
    const ordId = filterData?.saleOrd?.value;
    const itemNo = filterData?.item?.value;
    const pno = serverDetails.PersonalNo;

    if (!ordId || !itemNo) {
      alertify.error("Please select both Sales Order and Item");
      return;
    }

    const data = {
      orderId: ordId,
      itemNo: itemNo,
      pno: pno,
    };

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS008/DeleteProcesssheet";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText !== "OK") {
            alertify.error("Error fetching Data");
            return;
          }

          if (res?.data?.rowsAffected > 0) {
            alertify.success("Process Sheet Deleted!");
            handleClearAll(true);
            return;
          } else {
            alertify.error("Failed to delete process sheet");
            return;
          }
        })
        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  const handlesalesOrdChange = async (e) => {
    console.log("Selected Order:", e);
    setFilterData((prevState) => ({
      ...prevState,
      saleOrd: e,
      item: null,
    }));

    setItemData([]);
    setProcessData({});

    if (e) {
      await GetAuthorization().then((token) => {
        validateUser(token);
        getItemNo(token.accessToken, e.value);
      });
    } else {
      handleClearAll(true);
    }
  };

  const handleItemChange = (e) => {
    console.log("Selected Item:", e);
    setFilterData((prevState) => ({
      ...prevState,
      item: e,
    }));

    if (e === null) {
      setProcessData({});
      return;
    }

    getProcessSheetData(filterData?.saleOrd?.value, e.value);
  };

  const handleClearAll = (clearFilters = true) => {
    if (clearFilters) {
      setFilterData({
        saleOrd: null,
        item: null,
      });

      setItemData([]);
    }

    setProcessData({});
  };

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Process Entry Sheet (Internal Coating)"
      />

      <Grid container direction="row" justifyContent="center" alignItems="center">
        {loading && <Preloader />}
      </Grid>

      {isRestricted && (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}

      {isRestricted == false && (
        <>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={0.25}
                    px={2}
                    variant="gradient"
                    bgColor="info"
                    borderRadius="lg"
                    coloredShadow="info"
                  >
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Grid item xs={10}>
                        <MDTypography variant="h6" color="white">
                          Filter
                        </MDTypography>
                      </Grid>

                      <Grid item>
                        <Tooltip title="Delete Process Sheet">
                          <IconButton
                            color="white"
                            onClick={DeleteProcesssheet}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>

                      <Grid item>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={4}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="none"
                                variant="h6"
                                color="dark"
                                style={labelStyle}
                                noWrap
                              >
                                Sales Order
                              </MDTypography>
                            </Grid>

                            <Grid item xs={7.5}>
                              <MDBox style={selectContainerStyle}>
                                <ReactSelect
                                  id="saleOrd"
                                  options={salesOrdId}
                                  onChange={handlesalesOrdChange}
                                  value={filterData?.saleOrd}
                                  style={{
                                    ...valueInputStyle,
                                    backgroundColor: "#ffffff",
                                  }}
                                  styles={reactSelectStyles}
                                />
                              </MDBox>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={4}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="none"
                                variant="h6"
                                color="dark"
                                style={labelStyle}
                                noWrap
                              >
                                Item
                              </MDTypography>
                            </Grid>

                            <Grid item xs={6}>
                              <MDBox style={selectContainerStyle}>
                                <ReactSelect
                                  id="item"
                                  options={itemData}
                                  onChange={handleItemChange}
                                  value={filterData?.item}
                                  style={{
                                    ...valueInputStyle,
                                    backgroundColor: "#ffffff",
                                  }}
                                  styles={reactSelectStyles}
                                />
                              </MDBox>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>

            <Grid margin={1.5}></Grid>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation="horizontal"
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Sales Details" />
                    <Tab label="Coating Process-I" />
                    <Tab label="Coating Process-II" />
                    <Tab label="Lab Details" />
                    <Tab label="Instrument Details" />
                    <Tab label="Field Test" />
                  </Tabs>
                </AppBar>
              </Grid>

              {tabValue == 0 && <SalesDetails processData={processData} />}
              {tabValue == 1 && <CoatingProcessOne processData={processData} />}
              {tabValue == 2 && <CoatingProcessTwo processData={processData} />}
              {tabValue == 3 && <LabDetails processData={processData} />}
              {tabValue == 4 && <InstrumentDetails processData={processData} />}
              {tabValue == 5 && <FieldTest processData={processData} />}
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}