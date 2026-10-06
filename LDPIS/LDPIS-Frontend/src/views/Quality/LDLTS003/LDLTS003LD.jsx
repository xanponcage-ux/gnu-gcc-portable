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

export default function LDLTS003LD(props) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandTensile, setExpandTensile] = useState(true);
  const [expandChem, setExpandChem] = useState(true);
  const [expandImapact, setExpandImapact] = useState(true);
  const [expandDropWt, setExpandDropWt] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });

  const [tensileData, setTensileData] = useState({
    yieldStMin: "",
    yieldStMax: "",
    elongation: "",
    ysUtsRatio: "",
    utsMin: "",
    utsMax: "",
    maxHard: "",
    maxDiff: "",
    magnific: "",
    astmNo: "",
    weldUtsMin: "",
    weldUtsMax: "",
  });

  const [chemicalData, setChemicalData] = useState({
    carbonMin: "",
    carbonMax: "",
    molybMin: "",
    molybMax: "",
    mangMin: "",
    mangMax: "",
    phosMin: "",
    phosMax: "",
    alumMin: "",
    alumMax: "",
    niobiumMin: "",
    niobiumMax: "",
    sulphurMin: "",
    sulphurMax: "",
    vanadiumMin: "",
    vanadiumMax: "",
    alN: "",
    cuNi: "",
    nbVTi: "",
    nbVTiCuMo: "",
    ceiiw: "",
    cepcm: "",
    coprMin: "",
    coprMax: "",
    siliconMin: "",
    siliconMax: "",
    tiMin: "",
    tiMax: "",
    nickMin: "",
    nickMax: "",
    nitroMin: "",
    nitroMax: "",
    chromMin: "",
    chromMax: "",
    boronMin: "",
    boronMax: "",
    alSolMin: "",
    alSolMax: "",
    calcMin: "",
    calcMax: "",
  });

  const [impactData, setImpactData] = useState({
    indValBaseMetal: "",
    indValWeld: "",
    indValFl: "",
    impactSpecSize: "",
    avgValBaseMetal: "",
    avgValWeld: "",
    avgValFl: "",
    testingTemp: "",
    impactTestTemp: "",
    impactSaInd: "",
    impactSaAvg: "",
  });

  const [dwttData, setDwttData] = useState({
    dwttTestTemp: "",
    dwttEmpty: "",
    dwttIndSa: "",
    dwttAvgSa: "",
  });

  useEffect(() => {
    console.log("Inside sales details");
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
    setTensileData((prevState) => ({
      ...prevState,
      yieldStMin: "",
      yieldStMax: "",
      elongation: "",
      ysUtsRatio: "",
      utsMin: "",
      utsMax: "",
      maxHard: "",
      maxDiff: "",
      magnific: "",
      astmNo: "",
      weldUtsMin: "",
      weldUtsMax: "",
    }));
    setChemicalData((prevState) => ({
      ...prevState,
      carbonMin: "",
      carbonMax: "",
      molybMin: "",
      molybMax: "",
      mangMin: "",
      mangMax: "",
      phosMin: "",
      phosMax: "",
      alumMin: "",
      alumMax: "",
      niobiumMin: "",
      niobiumMax: "",
      sulphurMin: "",
      sulphurMax: "",
      vanadiumMin: "",
      vanadiumMax: "",
      alN: "",
      cuNi: "",
      nbVTi: "",
      nbVTiCuMo: "",
      ceiiw: "",
      cepcm: "",
      coprMin: "",
      coprMax: "",
      siliconMin: "",
      siliconMax: "",
      tiMin: "",
      tiMax: "",
      nickMin: "",
      nickMax: "",
      nitroMin: "",
      nitroMax: "",
      chromMin: "",
      chromMax: "",
      boronMin: "",
      boronMax: "",
      alSolMin: "",
      alSolMax: "",
      calcMin: "",
      calcMax: "",
    }));
    setImpactData((prevState) => ({
      ...prevState,
      indValBaseMetal: "",
      indValWeld: "",
      indValFl: "",
      impactSpecSize: "",
      avgValBaseMetal: "",
      avgValWeld: "",
      avgValFl: "",
      testingTemp: "",
      impactTestTemp: "",
      impactSaInd: "",
      impactSaAvg: "",
    }));
    setDwttData((prevState) => ({
      ...prevState,
      dwttTestTemp: "",
      dwttEmpty: "",
      dwttIndSa: "",
      dwttAvgSa: "",
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
      // validateUser(token);
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS003/getOrdDetailLD";
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
          setTensileData((prevState) => ({
            ...prevState,
            yieldStMin: res?.data[0]?.TPS_LD_YS_MIN || "",
            yieldStMax: res?.data[0]?.TPS_LD_YS_MAX || "",
            elongation: res?.data[0]?.TPS_LD_EL || "",
            ysUtsRatio: res?.data[0]?.TPS_LD_YS_UTS || "",
            utsMin: res?.data[0]?.TPS_LD_UTS_MIN || "",
            utsMax: res?.data[0]?.TPS_LD_UTS_MAX || "",
            maxHard: res?.data[0]?.TPS_LD_HARDNESS || "",
            maxDiff: res?.data[0]?.TPS_LD_HARD_DIFF || "",
            magnific: res?.data[0]?.TPS_LD_MAGNIFIC || "",
            astmNo: res?.data[0]?.TPS_LD_ASTM_NO || "",
            weldUtsMin: res?.data[0]?.TPS_LD_WELD_UTS_MIN || "",
            weldUtsMax: res?.data[0]?.TPS_LD_WELD_UTS_MAX || "",
          }));

          setChemicalData((prevState) => ({
            ...prevState,
            carbonMin: res?.data[0]?.TPS_LD_C_MIN || "",
            carbonMax: res?.data[0]?.TPS_LD_C || "",
            molybMin: res?.data[0]?.TPS_LD_MO_MIN || "",
            molybMax: res?.data[0]?.TPS_LD_MO || "",
            mangMin: res?.data[0]?.TPS_LD_MN_MIN || "",
            mangMax: res?.data[0]?.TPS_LD_MN_MAX || "",
            phosMin: res?.data[0]?.TPS_LD_P_MIN || "",
            phosMax: res?.data[0]?.TPS_LD_P_MAX || "",
            alumMin: res?.data[0]?.TPS_LD_AL_MIN || "",
            alumMax: res?.data[0]?.TPS_LD_AL || "",
            niobiumMin: res?.data[0]?.TPS_LD_NB_MIN || "",
            niobiumMax: res?.data[0]?.TPS_LD_NB || "",
            sulphurMin: res?.data[0]?.TPS_LD_S_MIN || "",
            sulphurMax: res?.data[0]?.TPS_LD_S || "",
            vanadiumMin: res?.data[0]?.TPS_LD_V_MIN || "",
            vanadiumMax: res?.data[0]?.TPS_LD_V || "",
            alN: res?.data[0]?.TPS_LD_AL_N || "",
            cuNi: res?.data[0]?.TPS_LD_CU_NI || "",
            nbVTi: res?.data[0]?.TPS_LD_NI_V_TI || "",
            nbVTiCuMo: res?.data[0]?.TPS_LD_NB_V_TI_CU_MO || "",
            ceiiw: res?.data[0]?.TPS_LD_CE_IIW || "",
            cepcm: res?.data[0]?.TPS_LD_CE_PCM || "",
            coprMin: res?.data[0]?.TPS_LD_CU_MIN || "",
            coprMax: res?.data[0]?.TPS_LD_CU || "",
            siliconMin: res?.data[0]?.TPS_LD_SI_MIN || "",
            siliconMax: res?.data[0]?.TPS_LD_SI || "",
            tiMin: res?.data[0]?.TPS_LD_TI_MIN || "",
            tiMax: res?.data[0]?.TPS_LD_TI || "",
            nickMin: res?.data[0]?.TPS_LD_NI_MIN || "",
            nickMax: res?.data[0]?.TPS_LD_NI || "",
            nitroMin: res?.data[0]?.TPS_LD_N_MIN || "",
            nitroMax: res?.data[0]?.TPS_LD_N || "",
            chromMin: res?.data[0]?.TPS_LD_CR_MIN || "",
            chromMax: res?.data[0]?.TPS_LD_CR || "",
            boronMin: res?.data[0]?.TPS_LD_B_MIN || "",
            boronMax: res?.data[0]?.TPS_LD_B || "",
            alSolMin: res?.data[0]?.TPS_LD_AL_SOL_MIN || "",
            alSolMax: res?.data[0]?.TPS_LD_AL_SOL_MAX || "",
            calcMin: res?.data[0]?.TPS_LD_CA_MIN || "",
            calcMax: res?.data[0]?.TPS_LD_CA || "",
          }));

          setImpactData((prevState) => ({
            ...prevState,
            indValBaseMetal: res?.data[0]?.TPS_LD_BASE1 || "",
            indValWeld: res?.data[0]?.TPS_LD_WELD1 || "",
            indValFl: res?.data[0]?.TPS_LD_FL1 || "",
            impactSpecSize: res?.data[0]?.TPS_LD_IMP_SPEC_SIZE || "",
            avgValBaseMetal: res?.data[0]?.TPS_LD_BASE2 || "",
            avgValWeld: res?.data[0]?.TPS_LD_WELD2 || "",
            avgValFl: res?.data[0]?.TPS_LD_FL2 || "",
            testingTemp: res?.data[0]?.TPS_LD_TEST_TEMP_IMP || "",
            impactTestTemp: res?.data[0]?.TPS_LD_IMP_TEST_TEMP || "",
            impactSaInd: res?.data[0]?.TPS_LD_SHEAR_IND || "",
            impactSaAvg: res?.data[0]?.TPS_LD_SHEAR_AVG || "",
          }));

          setDwttData((prevState) => ({
            ...prevState,
            dwttTestTemp: res?.data[0]?.TPS_LD_DWTT_TEST_TEMP || "",
            dwttEmpty: res?.data[0]?.TPS_LD_DWTT_EMPTY || "",
            dwttIndSa: res?.data[0]?.TPS_LD_DWTT_INDV_SA || "",
            dwttAvgSa: res?.data[0]?.TPS_LD_DWTT_AVG_SA || "",
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
            {/* Tensile Testing Grid */}
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
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        Tensile Testing
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      {/* <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip> */}
                      <Tooltip title={expandTensile ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandTensile(!expandTensile)}
                        >
                          {expandTensile ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandTensile && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
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
                              Yield Strength(Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="yieldStMin"
                              value={tensileData?.yieldStMin}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  yieldStMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Yield Strength(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="yieldStMax"
                              value={tensileData?.yieldStMax}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  yieldStMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              UTS (Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="utsMin"
                              value={tensileData?.utsMin}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  utsMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              UTS (Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="utsMax"
                              value={tensileData?.utsMax}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  utsMax: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              % Elongation
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="elongation"
                              value={tensileData?.elongation}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  elongation: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Max hard
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="maxHard"
                              value={tensileData?.maxHard}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  maxHard: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Magnific
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="magnific"
                              value={tensileData?.magnific}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  magnific: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              YS/UTS Ration(Max)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="ysUtsRatio"
                              value={tensileData?.ysUtsRatio}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  ysUtsRatio: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Max. Diff
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="maxDiff"
                              value={tensileData?.maxDiff}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  maxDiff: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              ASTM No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="astmNo"
                              value={tensileData?.astmNo}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  astmNo: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              WELD UTS MIN
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="weldUtsMin"
                              value={tensileData?.weldUtsMin}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  weldUtsMin: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              WELD UTS MAX
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="weldUtsMax"
                              value={tensileData?.weldUtsMax}
                              disabled={true}
                              onChange={(e) => {
                                setTensileData({
                                  ...tensileData,
                                  weldUtsMax: e.target.value?.toUpperCase(),
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

            {/* Chemical Analysis Grid*/}
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
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        Chemical Analysis
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      {/* <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip> */}
                      <Tooltip title={expandChem ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandChem(!expandChem)}
                        >
                          {expandChem ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandChem && (
                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={6}>
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
                                Carbon Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="carbonMin"
                                value={chemicalData?.carbonMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    carbonMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Carbon Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="carbonMax"
                                value={chemicalData?.carbonMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    carbonMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }} // Optional: add some spacing between label and input
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Molybdenum Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="molybMin"
                                value={chemicalData?.molybMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    molybMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Molybdenum Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="molybMax"
                                value={chemicalData?.molybMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    molybMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Manganese Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="mangMin"
                                value={chemicalData?.mangMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    mangMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Manganese Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="mangMax"
                                value={chemicalData?.mangMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    mangMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Phosphrous Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="phosMin"
                                value={chemicalData?.phosMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    phosMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Phosphrous Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="phosMax"
                                value={chemicalData?.phosMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    phosMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Aluminium Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="alumMin"
                                value={chemicalData?.alumMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    alumMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Aluminium Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="alumMax"
                                value={chemicalData?.alumMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    alumMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Niobium Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="niobiumMin"
                                value={chemicalData?.niobiumMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    niobiumMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Niobium Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="niobiumMin"
                                value={chemicalData?.niobiumMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    niobiumMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Sulphur Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="sulphurMin"
                                value={chemicalData?.sulphurMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    sulphurMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Sulphur Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="sulphurMax"
                                value={chemicalData?.sulphurMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    sulphurMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Vanadium Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="vanadiumMin"
                                value={chemicalData?.vanadiumMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    vanadiumMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Vanadium Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="vanadiumMax"
                                value={chemicalData?.vanadiumMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    vanadiumMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                AL/N
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="alN"
                                value={chemicalData?.alN}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    alN: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Cu+Ni
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="cuNi"
                                value={chemicalData?.cuNi}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    cuNi: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Nb+V+Ti
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="nbVTi"
                                value={chemicalData?.nbVTi}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    nbVTi: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Cr+Ni+Cu+Mo+V
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="nbVTiCuMo"
                                value={chemicalData?.nbVTiCuMo}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    nbVTiCuMo: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                CEIIW
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="ceiiw"
                                value={chemicalData?.ceiiw}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    ceiiw: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                CEPCM
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="cepcm"
                                value={chemicalData?.cepcm}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    cepcm: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Copper Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="coprMin"
                                value={chemicalData?.coprMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    coprMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Copper Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="coprMax"
                                value={chemicalData?.coprMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    coprMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Silicon Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="siliconMin"
                                value={chemicalData?.siliconMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    siliconMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Silicon Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="siliconMax"
                                value={chemicalData?.siliconMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    siliconMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Titanium Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="tiMin"
                                value={chemicalData?.tiMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    tiMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Titanium Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="tiMax"
                                value={chemicalData?.tiMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    tiMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Nickel Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="nickMin"
                                value={chemicalData?.nickMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    nickMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Nickel Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="nickMax"
                                value={chemicalData?.nickMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    nickMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Nitrogen Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="nitroMin"
                                value={chemicalData?.nitroMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    nitroMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Nitrogen Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="nitroMax"
                                value={chemicalData?.nitroMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    nitroMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Chrominum Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="chromMin"
                                value={chemicalData?.chromMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    chromMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Chrominum Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="chromMax"
                                value={chemicalData?.chromMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    chromMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Boron Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="boronMin"
                                value={chemicalData?.boronMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    boronMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Boron Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="boronMax"
                                value={chemicalData?.boronMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    boronMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                AL SOL MIN
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="alSolMin"
                                value={chemicalData?.alSolMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    alSolMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                AL SOL MAX
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="alSolMax"
                                value={chemicalData?.alSolMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    alSolMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Calcium Min(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="calcMin"
                                value={chemicalData?.calcMin}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    calcMin: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Calcium Max(%)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="calcMax"
                                value={chemicalData?.calcMax}
                                disabled={true}
                                onChange={(e) => {
                                  setChemicalData({
                                    ...chemicalData,
                                    calcMax: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}
              </Card>
            </Grid>

            {/* Impact Testing Grid*/}
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
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        Impact Testing
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      {/* <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip> */}
                      <Tooltip title={expandImapact ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandImapact(!expandImapact)}
                        >
                          {expandImapact ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandImapact && (
                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={6}>
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
                                Ind.Value-Base Metal
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="indValBaseMetal"
                                value={impactData?.indValBaseMetal}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    indValBaseMetal:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Ind.Value-Weld
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="indValWeld"
                                value={impactData?.indValWeld}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    indValWeld: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Ind.Value-FL
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="indValFl"
                                value={impactData?.indValFl}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    indValFl: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Impact Spec. Size
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="impactSpecSize"
                                value={impactData?.impactSpecSize}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    impactSpecSize:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Avg.Value-Base Metal
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="avgValBaseMetal"
                                value={impactData?.avgValBaseMetal}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    avgValBaseMetal:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Avg.Value-Weld
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="avgValWeld"
                                value={impactData?.avgValWeld}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    avgValWeld: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Avg.Value-FL
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="avgValFl"
                                value={impactData?.avgValFl}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    avgValFl: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Testing Temperature
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="testingTemp"
                                value={impactData?.testingTemp}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    testingTemp: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Impact Test Temp.
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="impactTestTemp"
                                value={impactData?.impactTestTemp}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    impactTestTemp:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                % Impact SA (IND)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="impactSaInd"
                                value={impactData?.impactSaInd}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    impactSaInd: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                % Impact SA (AVG)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="impactSaAvg"
                                value={impactData?.impactSaAvg}
                                disabled={true}
                                onChange={(e) => {
                                  setImpactData({
                                    ...impactData,
                                    impactSaAvg: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}
              </Card>
            </Grid>

            {/* Drop Wt Tear Test Grid */}
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
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        Drop Wt Tear Test
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      {/* <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip> */}
                      <Tooltip title={expandDropWt ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandDropWt(!expandDropWt)}
                        >
                          {expandDropWt ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandDropWt && (
                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={6}>
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
                                DWTT Test Temperature
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="dwttTestTemp"
                                value={dwttData?.dwttTestTemp}
                                disabled={true}
                                onChange={(e) => {
                                  setDwttData({
                                    ...dwttData,
                                    dwttTestTemp: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                DWTT Empty
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="dwttEmpty"
                                value={dwttData?.dwttEmpty}
                                disabled={true}
                                onChange={(e) => {
                                  setDwttData({
                                    ...dwttData,
                                    dwttEmpty: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                DWTT Individual SA
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="dwttIndSa"
                                value={dwttData?.dwttIndSa}
                                disabled={true}
                                onChange={(e) => {
                                  setDwttData({
                                    ...dwttData,
                                    dwttIndSa: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                DWTT Average SA
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="dwttAvgSa"
                                value={dwttData?.dwttAvgSa}
                                disabled={true}
                                onChange={(e) => {
                                  setDwttData({
                                    ...dwttData,
                                    dwttAvgSa: e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
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
