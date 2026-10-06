// This is for LAB Details code in process entry sheet..

import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import IconButton from "@mui/material/IconButton";
import { GetAuthorization } from "../../../utils";
import routes from "routes";
import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../../tabulatorCss.scss";
import MDInput from "components/MDInput";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function LDLTS003MD(props) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandMillGrid, setExpandMillGrid] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });

  const [millVisData, setMillVisData] = useState({
    coilWidth: "",
    slitWdMin: "",
    slitWdMax: "",
    slitThick: "",
    hfWeldTempMin: "",
    hfWeldTempMax: "",
    annlgTempMin: "",
    annlgTempMax: "",
    hfWeldKwMin: "",
    hfWeldKwMax: "",
    flatWeld: "",
    flatMatt: "",
    lineSpdMin: "",
    lineSpdMax: "",
    hydTestPres: "",
    holdTime: "",

    diaOfEndMin: "",
    diaOfEndMax: "",
    diaOfBodyMin: "",
    diaOfBodyMax: "",
    widthMin: "",
    widthMax: "",
    depthMin: "",
    depthMax: "",
    rocMax: "",
    twist: "",
    sqocMin: "",
    sqocMax: "",

    idBeadHeight: "",
    idBeadDepth: "",
    convexity: "",
    concavity: "",
    pipeLenMin: "",
    ecn: "",
    wallThickMin: "",
    wallThickMax: "",
    straightBody: "",
    straightEnds: "",
    pipeLenMax: "",
    rocMin: "",
    rootfaceMin: "",
    rootfaceMax: "",
    squarness: "",
    oorBody: "",
    oorEnd: "",
    ys: "",
    wtMinMt: "",
    wtMaxMt: "",
    bevelAngleMin: "",
    bevelAngleMax: "",
    smys: "",
  });

  //page load
  useEffect(() => {
    console.log("Inside Mill details");
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        if (props.ordId && props.itemNo) {
          handleDisplay(props.ordId, props.itemNo);
        }
      });
    }
    fetchData();
  }, [props.ordId, props.itemNo]);

  const handleClearAll = () => {
    // setFilterData((prevState) => ({
    //   ...prevState,
    //   saleOrd: null,
    //   item: null,
    //   delCond: null,
    // }));
    setMillVisData((prevState) => ({
      ...prevState,
      coilWidth: "",
      slitWdMin: "",
      slitWdMax: "",
      slitThick: "",
      hfWeldTempMin: "",
      hfWeldTempMax: "",
      annlgTempMin: "",
      annlgTempMax: "",
      hfWeldKwMin: "",
      hfWeldKwMax: "",
      flatWeld: "",
      flatMatt: "",
      lineSpdMin: "",
      lineSpdMax: "",
      hydTestPres: "",
      holdTime: "",

      diaOfEndMin: "",
      diaOfEndMax: "",
      diaOfBodyMin: "",
      diaOfBodyMax: "",
      widthMin: "",
      widthMax: "",
      depthMin: "",
      depthMax: "",
      rocMax: "",
      twist: "",
      sqocMin: "",
      sqocMax: "",

      idBeadHeight: "",
      idBeadDepth: "",
      convexity: "",
      concavity: "",
      pipeLenMin: "",
      ecn: "",
      wallThickMin: "",
      wallThickMax: "",
      straightBody: "",
      straightEnds: "",
      pipeLenMax: "",
      rocMin: "",
      rootfaceMin: "",
      rootfaceMax: "",
      squarness: "",
      oorBody: "",
      oorEnd: "",
      ys: "",
      wtMinMt: "",
      wtMaxMt: "",
      bevelAngleMin: "",
      bevelAngleMax: "",
      smys: "",
    }));
  };

  // Handle display data button

  const handleDisplay = async (ordId, itemNo) => {
    if (ordId === "" || itemNo === "") {
      handleClearAll();
    }

    let data1 = {
      orderId: ordId,
      itemNo: itemNo,
    };

    GetAuthorization().then((token) => {
      //   validateUser(token);
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS003/getOrdDetailMD";
      axiosAPI
        .post(url, data1, defaultOptions)
        .then((res) => {
          if (res.statusText !== "OK") {
            alertify.error("Error fetching Data");
            return;
          }
          if (res?.data?.length === 0) {
            alertify.error("No Data Found!");
            handleClearAll();
            return;
          }
          setMillVisData((prevState) => ({
            ...prevState,
            coilWidth: res?.data[0]?.TPS_MD_COIL_THK || "",
            slitWdMin: res?.data[0]?.TPS_MD_SLT_WIDTH_MIN || "",
            slitWdMax: res?.data[0]?.TPS_MD_SLT_WIDTH_MAX || "",
            slitThick: res?.data[0]?.TPS_MD_SLT_THK || "",
            hfWeldTempMin: res?.data[0]?.TPS_MD_WELD_TEMP_MIN || "",
            hfWeldTempMax: res?.data[0]?.TPS_MD_WELD_TEMP_MAX || "",
            annlgTempMin: res?.data[0]?.TPS_MD_WSA_TEMP_MIN || "",
            annlgTempMax: res?.data[0]?.TPS_MD_WSA_TEMP_MAX || "",
            hfWeldKwMin: res?.data[0]?.TPS_MD_WELD_KW_MIN || "",
            hfWeldKwMax: res?.data[0]?.TPS_MD_WELD_KW_MAX || "",
            flatWeld: res?.data[0]?.TPS_MD_FLAT_TEST_WELD || "",
            flatMatt: res?.data[0]?.TPS_MD_FLAT_TEST_MATT || "",
            lineSpdMin: res?.data[0]?.TPS_MD_LSPEED_MIN || "",
            lineSpdMax: res?.data[0]?.TPS_MD_LSPEED_MAX || "",
            hydTestPres: res?.data[0]?.TPS_MD_HYDRO_PRESS_TEST || "",
            holdTime: res?.data[0]?.TPS_MD_HOLD_TIME || "",

            diaOfEndMin: res?.data[0]?.TPS_MD_DIA_MTR_END_MIN || "",
            diaOfEndMax: res?.data[0]?.TPS_MD_DIA_MTR_END_MAX || "",
            diaOfBodyMin: res?.data[0]?.TPS_MD_DIA_MTR_BODY_MIN || "",
            diaOfBodyMax: res?.data[0]?.TPS_MD_DIA_MTR_BODY_MAX || "",
            widthMin: res?.data[0]?.TPS_MD_WIDTH_MN || "",
            widthMax: res?.data[0]?.TPS_MD_WIDTH_MX || "",
            depthMin: res?.data[0]?.TPS_MD_DEPTH_MN || "",
            depthMax: res?.data[0]?.TPS_MD_DEPTH_MX || "",
            rocMax: res?.data[0]?.TPS_MD_ROC || "",
            twist: res?.data[0]?.TPS_MD_TWIST || "",
            sqocMin: res?.data[0]?.TPS_MD_SQOC_MN || "",
            sqocMax: res?.data[0]?.TPS_MD_SQOC_MX || "",

            idBeadHeight: res?.data[0]?.TPS_MD_IDBEED || "",
            idBeadDepth: res?.data[0]?.TPS_MD_IDBEED_DEPTH || "",
            convexity: res?.data[0]?.TPS_MD_CONVEX || "",
            concavity: res?.data[0]?.TPS_MD_CONCAV || "",
            pipeLenMin: res?.data[0]?.TPS_MD_PIPE_LEN_MIN || "",
            ecn: res?.data[0]?.TPS_MD_ECN || "",
            wallThickMin: res?.data[0]?.TPS_MD_WALL_THK_MIN || "",
            wallThickMax: res?.data[0]?.TPS_MD_WALL_THK_MAX || "",
            straightBody: res?.data[0]?.TPS_MD_STRAIGHTNESS_FUL || "",
            straightEnds: res?.data[0]?.TPS_MD_STRAIGHTNESS_END || "",
            pipeLenMax: res?.data[0]?.TPS_MD_PIPE_LEN_MAX || "",
            rocMin: res?.data[0]?.TPS_MD_ROE || "",
            rootfaceMin: res?.data[0]?.TPS_MD_ROUT_FACE_MIN || "",
            rootfaceMax: res?.data[0]?.TPS_MD_ROUT_FACE_MAX || "",
            squarness: res?.data[0]?.TPS_MD_SQUARNESS || "",
            oorBody: res?.data[0]?.TPS_MD_OUT_OF_ROUNDNESS || "",
            oorEnd: res?.data[0]?.TPS_MD_OOREND || "",
            // ys: res?.data[0]?.TPS_ID_MILMM || "",
            wtMinMt: res?.data[0]?.TPS_MD_WEIGHT_MIN || "",
            wtMaxMt: res?.data[0]?.TPS_MD_WEIGHT_MAX || "",
            bevelAngleMin: res?.data[0]?.TPS_MD_DIM_BEVEL_AG_MIN || "",
            bevelAngleMax: res?.data[0]?.TPS_MD_DIM_BEVEL_AG_MAX || "",
            // smys: res?.data[0]?.TPS_ID_MILMM || "",
          }));
        })
        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Process Entry Sheet (Bare)"
      />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {loading && <Preloader />}
      </Grid>
      <>
        <MDBox pt={6} pb={3} py={1}>
          <Grid container spacing={4}>
            {/* Mill Rolling & Visual Inspection Grid */}
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
                    <Grid item xs={3}>
                      <MDTypography variant="h6" color="white">
                        Mill Rolling & Visual Inspection
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandMillGrid ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandMillGrid(!expandMillGrid)}
                        >
                          {expandMillGrid ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandMillGrid && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Coil Width
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="coilWidth"
                              value={millVisData?.coilWidth}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  coilWidth: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              HF Weld Temp.Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="hfWeldTempMin"
                              value={millVisData?.hfWeldTempMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  hfWeldTempMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              ℃
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              HF welder KW(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="hfWeldKwMin"
                              value={millVisData?.hfWeldKwMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  hfWeldKwMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Line Spd(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="lineSpdMin"
                              value={millVisData?.lineSpdMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  lineSpdMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              (Mtr/Min)
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Slit Width(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="slitWdMin"
                              value={millVisData?.slitWdMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  slitWdMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              HF Weld Temp.Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="hfWeldTempMax"
                              value={millVisData?.hfWeldTempMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  hfWeldTempMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              ℃
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              HF welder KW(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="hfWeldKwMax"
                              value={millVisData?.hfWeldKwMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  hfWeldKwMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Line Spd(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="lineSpdMax"
                              value={millVisData?.lineSpdMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  lineSpdMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              (Mtr/Min)
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Slit Width(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="slitWdMax"
                              value={millVisData?.slitWdMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  slitWdMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Annlg Temp(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="annlgTempMin"
                              value={millVisData?.annlgTempMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  annlgTempMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              ℃
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Flattening Weld
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="flatWeld"
                              value={millVisData?.flatWeld}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  flatWeld: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Hyd.Test Pres
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="hydTestPres"
                              value={millVisData?.hydTestPres}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  hydTestPres: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              (kg/cm2)
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Slit Thickness
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="slitThick"
                              value={millVisData?.slitThick}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  slitThick: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Annlg Temp(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="annlgTempMax"
                              value={millVisData?.annlgTempMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  annlgTempMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              ℃
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Flattening Matt.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="flatMatt"
                              value={millVisData?.flatMatt}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  flatMatt: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Holding Time
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="holdTime"
                              value={millVisData?.holdTime}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  holdTime: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              (Sec.)
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} style={{ margin: "10px" }}></Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Dia of End(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="diaOfEndMin"
                              value={millVisData?.diaOfEndMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  diaOfEndMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Dia of End(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="diaOfEndMax"
                              value={millVisData?.diaOfEndMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  diaOfEndMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Dia of Bd(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="diaOfBodyMin"
                              value={millVisData?.diaOfBodyMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  diaOfBodyMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Dia of Bd(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="diaOfBodyMax"
                              value={millVisData?.diaOfBodyMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  diaOfBodyMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Width (Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="widthMin"
                              value={millVisData?.widthMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  widthMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Width (Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="widthMax"
                              value={millVisData?.widthMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  widthMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Depth (Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="depthMin"
                              value={millVisData?.depthMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  depthMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Depth (Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="depthMax"
                              value={millVisData?.depthMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  depthMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              ROC (Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="rocMax"
                              value={millVisData?.rocMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  rocMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Twist
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="twist"
                              value={millVisData?.twist}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  twist: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              SQOC (Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="sqocMin"
                              value={millVisData?.sqocMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  sqocMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              SQOC (Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="sqocMax"
                              value={millVisData?.sqocMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  sqocMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} style={{ margin: "10px" }}></Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              ID BEAD Height
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="idBeadHeight"
                              value={millVisData?.idBeadHeight}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  idBeadHeight: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Wall Thick(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="wallThickMin"
                              value={millVisData?.wallThickMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  wallThickMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Root Face(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="rootfaceMin"
                              value={millVisData?.rootfaceMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  rootfaceMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Wt Min(MT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="wtMinMt"
                              value={millVisData?.wtMinMt}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  wtMinMt: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MTS
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              ID BEAD Depth
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="idBeadDepth"
                              value={millVisData?.idBeadDepth}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  idBeadDepth: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Wall Thick(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="wallThickMax"
                              value={millVisData?.wallThickMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  wallThickMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Root Face(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="rootfaceMax"
                              value={millVisData?.rootfaceMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  rootfaceMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Wt Max(MT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="wtMaxMt"
                              value={millVisData?.wtMaxMt}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  wtMaxMt: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MTS
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Convexity
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="convexity"
                              value={millVisData?.convexity}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  convexity: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Straightness Body
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="straightBody"
                              value={millVisData?.straightBody}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  straightBody: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Squarness
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="squarness"
                              value={millVisData?.squarness}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  squarness: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Bevel Angle
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="bevelAngleMin"
                              value={millVisData?.bevelAngleMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  bevelAngleMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              Min °
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Concavity
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="concavity"
                              value={millVisData?.concavity}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  concavity: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Straightness Ends
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="straightEnds"
                              value={millVisData?.straightEnds}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  straightEnds: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              OOR Body
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="oorBody"
                              value={millVisData?.oorBody}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  oorBody: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Bevel Angle
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="bevelAngleMax"
                              value={millVisData?.bevelAngleMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  bevelAngleMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              Max °
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Pipe Len (Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="pipeLenMin"
                              value={millVisData?.pipeLenMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  pipeLenMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MTR
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Pipe Len (Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="pipeLenMax"
                              value={millVisData?.pipeLenMax}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  pipeLenMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MTR
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              OOR End
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="oorEnd"
                              value={millVisData?.oorEnd}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  oorEnd: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              MM
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                              }}
                              noWrap
                            >
                              SMYS%
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="smys"
                              value={millVisData?.smys}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  smys: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              ECN%
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="ecn"
                              value={millVisData?.ecn}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  ecn: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              ROC (Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="rocMin"
                              value={millVisData?.rocMin}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  rocMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              YS
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="ys"
                              value={millVisData?.ys}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  ys: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      </>
    </DashboardLayout>
  );
}
