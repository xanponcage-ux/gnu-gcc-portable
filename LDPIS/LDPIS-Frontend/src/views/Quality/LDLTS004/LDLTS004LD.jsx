// This is for LAB Details code in Process Entry Sheet(Internal)(Internal)..

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

export default function LDLTS004LD(props) {
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

  const [diwaterData, setDiwaterData] = useState({
    TCP_LD_MSHORT_GRRATIO: "",
    TCP_LD_PH_CON_MIN: "",
    TCP_LD_PH_CON_MAX: "",
    TCP_LD_TURBID_MAX: "",
    TCP_LD_ALK_MIN: "",
    TCP_LD_ALK_MAX: "",
    TCP_LD_COMP_AIR: "",
    TCP_LD_CONDUCT_MAX: "",
    TCP_LD_SULFATE_MAX: "",
    TCP_LD_PH_MIN: "",
    TCP_LD_PH_MAX: "",
    TCP_LD_CHROM_SOL_MIN: "",
    TCP_LD_CHROM_SOL_MAX: "",
    TCP_LD_CLORID_SOL_MIN: "",
    TCP_LD_CLORID_SOL_MAX: "",
    TCP_LD_HARDNESS: "",
    TCP_LD_CLORID_MAX: "",
  });

  const [fbeData, setFbeData] = useState({
    TCP_LD_DEGREE_CURE_MIN: "",
    TCP_LD_DEGREE_CURE_MAX: "",
    TCP_LD_DCURE_REFSTD: "",
    TCP_LD_TAG_MIN: "",
    TCP_LD_TAG_MAX: "",
    TCP_LD_FLEXI_FBE: "",
    TCP_LD_FLEX_REFSTD: "",
    TCP_LD_24H_ADHETEST_MIN: "",
    TCP_LD_24H_ADHETEST_MAX: "",
    TCP_LD_ADHETEST_UNIT: "",
    TCP_LD_24H_REFSTD: "",
    TCP_LD_DH_MIN: "",
    TCP_LD_DH_MAX: "",
    TCP_LD_REF_STD: "",
    TCP_LD_TEST_DUR: "",
    TCP_LD_OPR_TEMP: "",
    TCP_LD_INTERPORO_MIN: "",
    TCP_LD_INTERPORO_REFSTD: "",
    TCP_LD_CS_MIN: "",
    TCP_LD_CS_REFSTD: "",
  });

  const [lpeData, setLpeData] = useState({
    TCP_LD_INDEN_HOT_MAX: "",
    TCP_LD_INDEN_ROM_MAX: "",
    TCP_LD_IND_REFSTD: "",
    TCP_LD_ELONG_TEST_MIN: "",
    TCP_LD_HOTWATER_MIN: "",
    TCP_LD_48H_REFSTD: "",
    TCP_LD_ELON_REFSTD: "",
    TCP_LD_PRDSTABL_MIN: "",
    TCP_LD_ELONG_REFSTD: "",
    TCP_LD_TENSILE_REFSTD: "",
    TCP_LD_FLEX_3LPE: "",
    TCP_LD_3LPE_REFSTD: "",
    TCP_LD_HARDH_REFSTD: "",
    TCP_LD_CD_48H_MIN: "",
    TCP_LD_CD_48H_MAX: "",
    TCP_LD_CD_48H_REFSTD: "",
    TCP_LD_CD_48H_TESTDUR: "",
    TCP_LD_CD_48H_OPR_TEMP: "",
    TCP_LD_CD_28D_MIN: "",
    TCP_LD_CD_28D_MAX: "",
    TCP_LD_CD_28D_REFSTD: "",
    TCP_LD_CD_28D_TESTDUR: "",
    TCP_LD_CD_28D_OPRTEMP: "",
    TCP_LD_CD_28DN_MIN: "",
    TCP_LD_CD_28DN_MAX: "",
    TCP_LD_CD_28DN_REFSTD: "",
    TCP_LD_28DN_TESTDUR: "",
    TCP_LD_28DN_OPRTEMP: "",
    // Temporary display fields moved from CP2 (no backend key change)
    TCP_CP2_PIPE_IDENTIF: "",
    TCP_CP2_LOW_STRES_PUNCH: "",
  });

  // const [dwttData, setDwttData] = useState({
  //   dwttTestTemp: "",
  //   dwttEmpty: "",
  //   dwttIndSa: "",
  //   dwttAvgSa: "",
  // });

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
    setDiwaterData((prevState) => ({
      ...prevState,
      TCP_LD_MSHORT_GRRATIO: "",
      TCP_LD_PH_CON_MIN: "",
      TCP_LD_PH_CON_MAX: "",
      TCP_LD_TURBID_MAX: "",
      TCP_LD_ALK_MIN: "",
      TCP_LD_ALK_MAX: "",
      TCP_LD_COMP_AIR: "",
      TCP_LD_CONDUCT_MAX: "",
      TCP_LD_SULFATE_MAX: "",
      TCP_LD_PH_MIN: "",
      TCP_LD_PH_MAX: "",
      TCP_LD_CHROM_SOL_MIN: "",
      TCP_LD_CHROM_SOL_MAX: "",
      TCP_LD_CLORID_SOL_MIN: "",
      TCP_LD_CLORID_SOL_MAX: "",
      TCP_LD_HARDNESS: "",
      TCP_LD_CLORID_MAX: "",
    }));
    setFbeData((prevState) => ({
      ...prevState,
      TCP_LD_DEGREE_CURE_MIN: "",
      TCP_LD_DEGREE_CURE_MAX: "",
      TCP_LD_DCURE_REFSTD: "",
      TCP_LD_TAG_MIN: "",
      TCP_LD_TAG_MAX: "",
      TCP_LD_FLEXI_FBE: "",
      TCP_LD_FLEX_REFSTD: "",
      TCP_LD_24H_ADHETEST_MIN: "",
      TCP_LD_24H_ADHETEST_MAX: "",
      TCP_LD_ADHETEST_UNIT: "",
      TCP_LD_24H_REFSTD: "",
      TCP_LD_DH_MIN: "",
      TCP_LD_DH_MAX: "",
      TCP_LD_REF_STD: "",
      TCP_LD_TEST_DUR: "",
      TCP_LD_OPR_TEMP: "",
      TCP_LD_INTERPORO_MIN: "",
      TCP_LD_INTERPORO_REFSTD: "",
      TCP_LD_CS_MIN: "",
      TCP_LD_CS_REFSTD: "",
    }));
    setLpeData((prevState) => ({
      ...prevState,
      TCP_LD_INDEN_HOT_MAX: "",
      TCP_LD_INDEN_ROM_MAX: "",
      TCP_LD_IND_REFSTD: "",
      TCP_LD_ELONG_TEST_MIN: "",
      TCP_LD_HOTWATER_MIN: "",
      TCP_LD_48H_REFSTD: "",
      TCP_LD_ELON_REFSTD: "",
      TCP_LD_PRDSTABL_MIN: "",
      TCP_LD_ELONG_REFSTD: "",
      TCP_LD_TENSILE_REFSTD: "",
      TCP_LD_FLEX_3LPE: "",
      TCP_LD_3LPE_REFSTD: "",
      TCP_LD_HARDH_REFSTD: "",
      TCP_LD_CD_48H_MIN: "",
      TCP_LD_CD_48H_MAX: "",
      TCP_LD_CD_48H_REFSTD: "",
      TCP_LD_CD_48H_TESTDUR: "",
      TCP_LD_CD_48H_OPR_TEMP: "",
      TCP_LD_CD_28D_MIN: "",
      TCP_LD_CD_28D_MAX: "",
      TCP_LD_CD_28D_REFSTD: "",
      TCP_LD_CD_28D_TESTDUR: "",
      TCP_LD_CD_28D_OPRTEMP: "",
      TCP_LD_CD_28DN_MIN: "",
      TCP_LD_CD_28DN_MAX: "",
      TCP_LD_CD_28DN_REFSTD: "",
      TCP_LD_28DN_TESTDUR: "",
      TCP_LD_28DN_OPRTEMP: "",
    }));
    // setDwttData((prevState) => ({
    //   ...prevState,
    //   dwttTestTemp: "",
    //   dwttEmpty: "",
    //   dwttIndSa: "",
    //   dwttAvgSa: "",
    // }));
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

      const url = "api/LDLTS004/getOrdDetailLD";
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
          setDiwaterData((prevState) => ({
            ...prevState,
            TCP_LD_MSHORT_GRRATIO: res?.data[0]?.TCP_LD_MSHORT_GRRATIO,
            TCP_LD_PH_CON_MIN: res?.data[0]?.TCP_LD_PH_CON_MIN,
            TCP_LD_PH_CON_MAX: res?.data[0]?.TCP_LD_PH_CON_MAX,
            TCP_LD_TURBID_MAX: res?.data[0]?.TCP_LD_TURBID_MAX,
            TCP_LD_ALK_MIN: res?.data[0]?.TCP_LD_ALK_MIN,
            TCP_LD_ALK_MAX: res?.data[0]?.TCP_LD_ALK_MAX,
            TCP_LD_COMP_AIR: res?.data[0]?.TCP_LD_COMP_AIR,
            TCP_LD_CONDUCT_MAX: res?.data[0]?.TCP_LD_CONDUCT_MAX,
            TCP_LD_SULFATE_MAX: res?.data[0]?.TCP_LD_SULFATE_MAX,
            TCP_LD_PH_MIN: res?.data[0]?.TCP_LD_PH_MIN,
            TCP_LD_PH_MAX: res?.data[0]?.TCP_LD_PH_MAX,
            TCP_LD_CHROM_SOL_MIN: res?.data[0]?.TCP_LD_CHROM_SOL_MIN,
            TCP_LD_CHROM_SOL_MAX: res?.data[0]?.TCP_LD_CHROM_SOL_MAX,
            TCP_LD_CLORID_SOL_MIN: res?.data[0]?.TCP_LD_CLORID_SOL_MIN,
            TCP_LD_CLORID_SOL_MAX: res?.data[0]?.TCP_LD_CLORID_SOL_MAX,
            TCP_LD_HARDNESS: res?.data[0]?.TCP_LD_HARDNESS,
            TCP_LD_CLORID_MAX: res?.data[0]?.TCP_LD_CLORID_MAX,
          }));

          setFbeData((prevState) => ({
            ...prevState,
            TCP_LD_DEGREE_CURE_MIN: res?.data[0]?.TCP_LD_DEGREE_CURE_MIN,
            TCP_LD_DEGREE_CURE_MAX: res?.data[0]?.TCP_LD_DEGREE_CURE_MAX,
            TCP_LD_DCURE_REFSTD: res?.data[0]?.TCP_LD_DCURE_REFSTD,
            TCP_LD_TAG_MIN: res?.data[0]?.TCP_LD_TAG_MIN,
            TCP_LD_TAG_MAX: res?.data[0]?.TCP_LD_TAG_MAX,
            TCP_LD_FLEXI_FBE: res?.data[0]?.TCP_LD_FLEXI_FBE,
            TCP_LD_FLEX_REFSTD: res?.data[0]?.TCP_LD_FLEX_REFSTD,
            TCP_LD_24H_ADHETEST_MIN: res?.data[0]?.TCP_LD_24H_ADHETEST_MIN,
            TCP_LD_24H_ADHETEST_MAX: res?.data[0]?.TCP_LD_24H_ADHETEST_MAX,
            TCP_LD_ADHETEST_UNIT: res?.data[0]?.TCP_LD_ADHETEST_UNIT,
            TCP_LD_24H_REFSTD: res?.data[0]?.TCP_LD_24H_REFSTD,
            TCP_LD_DH_MIN: res?.data[0]?.TCP_LD_DH_MIN,
            TCP_LD_DH_MAX: res?.data[0]?.TCP_LD_DH_MAX,
            TCP_LD_REF_STD: res?.data[0]?.TCP_LD_REF_STD,
            TCP_LD_TEST_DUR: res?.data[0]?.TCP_LD_TEST_DUR,
            TCP_LD_OPR_TEMP: res?.data[0]?.TCP_LD_OPR_TEMP,
            TCP_LD_INTERPORO_MIN: res?.data[0]?.TCP_LD_INTERPORO_MIN,
            TCP_LD_INTERPORO_REFSTD: res?.data[0]?.TCP_LD_INTERPORO_REFSTD,
            TCP_LD_CS_MIN: res?.data[0]?.TCP_LD_CS_MIN,
            TCP_LD_CS_REFSTD: res?.data[0]?.TCP_LD_CS_REFSTD,
          }));

          setLpeData((prevState) => ({
            ...prevState,
            TCP_LD_INDEN_HOT_MAX: res?.data[0]?.TCP_LD_INDEN_HOT_MAX,
            TCP_LD_INDEN_ROM_MAX: res?.data[0]?.TCP_LD_INDEN_ROM_MAX,
            TCP_LD_IND_REFSTD: res?.data[0]?.TCP_LD_IND_REFSTD,
            TCP_LD_ELONG_TEST_MIN: res?.data[0]?.TCP_LD_ELONG_TEST_MIN,
            TCP_LD_HOTWATER_MIN: res?.data[0]?.TCP_LD_HOTWATER_MIN,
            TCP_LD_48H_REFSTD: res?.data[0]?.TCP_LD_48H_REFSTD,
            TCP_LD_ELON_REFSTD: res?.data[0]?.TCP_LD_ELON_REFSTD,
            TCP_LD_PRDSTABL_MIN: res?.data[0]?.TCP_LD_PRDSTABL_MIN,
            TCP_LD_ELONG_REFSTD: res?.data[0]?.TCP_LD_ELONG_REFSTD,
            TCP_LD_TENSILE_REFSTD: res?.data[0]?.TCP_LD_TENSILE_REFSTD,
            TCP_LD_FLEX_3LPE: res?.data[0]?.TCP_LD_FLEX_3LPE,
            TCP_LD_3LPE_REFSTD: res?.data[0]?.TCP_LD_3LPE_REFSTD,
            TCP_LD_HARDH_REFSTD: res?.data[0]?.TCP_LD_HARDH_REFSTD,
            TCP_LD_CD_48H_MIN: res?.data[0]?.TCP_LD_CD_48H_MIN,
            TCP_LD_CD_48H_MAX: res?.data[0]?.TCP_LD_CD_48H_MAX,
            TCP_LD_CD_48H_REFSTD: res?.data[0]?.TCP_LD_CD_48H_REFSTD,
            TCP_LD_CD_48H_TESTDUR: res?.data[0]?.TCP_LD_CD_48H_TESTDUR,
            TCP_LD_CD_48H_OPR_TEMP: res?.data[0]?.TCP_LD_CD_48H_OPR_TEMP,
            TCP_LD_CD_28D_MIN: res?.data[0]?.TCP_LD_CD_28D_MIN,
            TCP_LD_CD_28D_MAX: res?.data[0]?.TCP_LD_CD_28D_MAX,
            TCP_LD_CD_28D_REFSTD: res?.data[0]?.TCP_LD_CD_28D_REFSTD,
            TCP_LD_CD_28D_TESTDUR: res?.data[0]?.TCP_LD_CD_28D_TESTDUR,
            TCP_LD_CD_28D_OPRTEMP: res?.data[0]?.TCP_LD_CD_28D_OPRTEMP,
            TCP_LD_CD_28DN_MIN: res?.data[0]?.TCP_LD_CD_28DN_MIN,
            TCP_LD_CD_28DN_MAX: res?.data[0]?.TCP_LD_CD_28DN_MAX,
            TCP_LD_CD_28DN_REFSTD: res?.data[0]?.TCP_LD_CD_28DN_REFSTD,
            TCP_LD_28DN_TESTDUR: res?.data[0]?.TCP_LD_28DN_TESTDUR,
            TCP_LD_28DN_OPRTEMP: res?.data[0]?.TCP_LD_28DN_OPRTEMP,
          }));

          // setDwttData((prevState) => ({
          //   ...prevState,
          //   dwttTestTemp: res?.data[0]?.TPS_LD_DWTT_TEST_TEMP || "",
          //   dwttEmpty: res?.data[0]?.TPS_LD_DWTT_EMPTY || "",
          //   dwttIndSa: res?.data[0]?.TPS_LD_DWTT_INDV_SA || "",
          //   dwttAvgSa: res?.data[0]?.TPS_LD_DWTT_AVG_SA || "",
          // }));
        })

        .catch((error) => alertify.error("Error fetching data: " + error));

        // Fetch CP2 fields from GD so moved fields show in LD tab (temporary frontend-only mapping)
        const urlGD = "api/LDLTS004/getOrdDetailGD";
        axiosAPI.post(urlGD, data1, defaultOptions).then((resGD) => {
          if (resGD?.statusText === "OK" && resGD?.data?.length > 0) {
            setLpeData((prevState) => ({
              ...prevState,
              TCP_CP2_PIPE_IDENTIF: resGD?.data[0]?.TCP_CP2_PIPE_IDENTIF || "",
              TCP_CP2_LOW_STRES_PUNCH: resGD?.data[0]?.TCP_CP2_LOW_STRES_PUNCH || "",
            }));
          }
        }).catch(() => {
          // ignore GD fetch errors for now
        });
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Process Entry Sheet (External)"
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
                        DI Water and Chromate Application
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
                      <Grid item xs={12} md={5}>
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
                              Mix Shots & Grit Ratio
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_MSHORT_GRRATIO"
                              value={diwaterData?.TCP_LD_MSHORT_GRRATIO}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_MSHORT_GRRATIO:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "-1rem" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
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
                              Phosphoric  Concontratn
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                          <MDInput
                              fullWidth
                              id="TCP_LD_PH_CON_MIN"
                              value={diwaterData?.TCP_LD_PH_CON_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_PH_CON_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              // style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                          <MDInput
                              fullWidth
                              id="TCP_LD_PH_CON_MAX"
                              value={diwaterData?.TCP_LD_PH_CON_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_PH_CON_MAX:
                                    e.target.value?.toUpperCase(),
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
                              %
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
                              style={{ marginTop: "2px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Turbidity Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_TURBID_MAX"
                              value={diwaterData?.TCP_LD_TURBID_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_TURBID_MAX:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                               style={{ marginLeft: "3.3rem" }}
                            />
                          </Grid>
                          <Grid item xs={4}>
                            <MDTypography
                              style={{
                                fontSize: "0.9rem",
                                color: "blue",
                                marginLeft:"3rem"
                              }}
                            >
                              NTU
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Grid item xs={2}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Alkalinity
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem", }}
                              noWrap
                            >
                              Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                          <MDInput
                              fullWidth
                              id="TCP_LD_ALK_MIN"
                              value={diwaterData?.TCP_LD_ALK_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_ALK_MIN: e.target.value?.toUpperCase(),
                                });
                              }}
                               style={{ marginRIght: "-2rem" }}
                            />
                          </Grid>
                       
                          <Grid item xs={1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem"}}
                              noWrap
                            >
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                          <MDInput
                              fullWidth
                              id="TCP_LD_ALK_MAX"
                              value={diwaterData?.TCP_LD_ALK_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_ALK_MAX: e.target.value?.toUpperCase(),
                                });
                              }}
                              //  style={{ marginLeft: "-6rem" }}
                            />
                          </Grid>
                          <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                                // marginLeft: "-6rem" 
                              }}
                            >
                              mg/L
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      
                      <Grid item xs={12} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={3}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft:"-2rem" }}
                              noWrap
                            >
                              QA of Compressed Air
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_COMP_AIR"
                              value={diwaterData?.TCP_LD_COMP_AIR}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_COMP_AIR:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              // style={{ marginLeft: "8px" }}
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
                              Conductivity Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_CONDUCT_MAX"
                              value={diwaterData?.TCP_LD_CONDUCT_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_CONDUCT_MAX:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              // style={{ marginLeft: "1.5rem" }}
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
                               {'\u00B5'}mho/cm
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
                              Sulphate as SO4 Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_SULFATE_MAX"
                              value={diwaterData?.TCP_LD_SULFATE_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_SULFATE_MAX:
                                    e.target.value?.toUpperCase(),
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
                              mg/L
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
                              pH Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_PH_MIN"
                              value={diwaterData?.TCP_LD_PH_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_PH_MIN: e.target.value?.toUpperCase(),
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
                              pH Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_PH_MAX"
                              value={diwaterData?.TCP_LD_PH_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_PH_MAX: e.target.value?.toUpperCase(),
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
                              Chromate Solutn. Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_CHROM_SOL_MIN"
                              value={diwaterData?.TCP_LD_CHROM_SOL_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_CHROM_SOL_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "-0.1rem" }}
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
                              %
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
                              Chromate Solutn. Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_CHROM_SOL_MAX"
                              value={diwaterData?.TCP_LD_CHROM_SOL_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_CHROM_SOL_MAX:
                                    e.target.value?.toUpperCase(),
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
                              %
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
                              Chloride Check Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_CLORID_SOL_MIN"
                              value={diwaterData?.TCP_LD_CLORID_SOL_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_CLORID_SOL_MIN:
                                    e.target.value?.toUpperCase(),
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
                              ppm
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
                              Chloride Check Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_CLORID_SOL_MAX"
                              value={diwaterData?.TCP_LD_CLORID_SOL_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_CLORID_SOL_MAX:
                                    e.target.value?.toUpperCase(),
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
                              ppm
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
                              Hardness
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_HARDNESS"
                              value={diwaterData?.TCP_LD_HARDNESS}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_HARDNESS:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "-0.1rem" }}
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
                              Chloride as CL Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_LD_CLORID_MAX"
                              value={diwaterData?.TCP_LD_CLORID_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDiwaterData({
                                  ...diwaterData,
                                  TCP_LD_CLORID_MAX:
                                    e.target.value?.toUpperCase(),
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
                              mg/L
                            </MDTypography>
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
                        Test on Partially FBE & Partially FBE + Adhesive Coated Pipe
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
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Degree of Cure Min
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_DEGREE_CURE_MIN"
                                value={fbeData?.TCP_LD_DEGREE_CURE_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_DEGREE_CURE_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              %
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
                                Degree of Cure Max
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_DEGREE_CURE_MAX"
                                value={fbeData?.TCP_LD_DEGREE_CURE_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_DEGREE_CURE_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                            %
                            </MDTypography>
                          </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5}>
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
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_DCURE_REFSTD"
                                value={fbeData?.TCP_LD_DCURE_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_DCURE_REFSTD:
                                      e.target.value?.toUpperCase(),
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
                              🏳️
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
                                Tg Min
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_TAG_MIN"
                                value={fbeData?.TCP_LD_TAG_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_TAG_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
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
                                Tg Max
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_TAG_MAX"
                                value={fbeData?.TCP_LD_TAG_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_TAG_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
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
                        <Grid item xs={12} md={8}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Flexibility FBE
                              </MDTypography>
                            </Grid>
                            <Grid item xs={10}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_FLEXI_FBE"
                                value={fbeData?.TCP_LD_FLEXI_FBE}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_FLEXI_FBE:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "1.5rem" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft:"2rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_FLEX_REFSTD"
                                value={fbeData?.TCP_LD_FLEX_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_FLEX_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                24H Adhesion Test Min
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_24H_ADHETEST_MIN"
                                value={fbeData?.TCP_LD_24H_ADHETEST_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_24H_ADHETEST_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                //  style={{ marginLeft: "-2rem" }}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_24H_ADHETEST_MAX"
                                value={fbeData?.TCP_LD_24H_ADHETEST_MAX                                }
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_24H_ADHETEST_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                // style={{ marginLeft: "2rem" }}
                              />
                            </Grid>
                            <Grid item xs={3}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_ADHETEST_UNIT"
                                value={fbeData?.TCP_LD_ADHETEST_UNIT}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_ADHETEST_UNIT:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                // style={{ marginLeft: "2rem" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        
                        <Grid item xs={12} md={2} ></Grid>
                        <Grid item xs={12} md={4}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft: "2rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_24H_REFSTD"
                                value={fbeData?.TCP_LD_24H_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_24H_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                CD Test 
                              </MDTypography>
                            </Grid>
                            <Grid item xs={1}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Min
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2.5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_DH_MIN"
                                value={fbeData?.TCP_LD_DH_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_DH_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1.5}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                            mm
                            </MDTypography>
                          </Grid>
                            <Grid item xs={2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Max
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_DH_MAX"
                                value={fbeData?.TCP_LD_DH_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_DH_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                // style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                            mm
                            </MDTypography>
                          </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={2}></Grid>
                        <Grid item xs={12} md={4}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem", marginLeft: "2rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_REF_STD"
                                value={fbeData?.TCP_LD_REF_STD}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_REF_STD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={1}></Grid>
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
                                Test Duration
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_TEST_DUR"
                                value={fbeData?.TCP_LD_TEST_DUR}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_TEST_DUR:
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
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Operating temp.
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_OPR_TEMP"
                                value={fbeData?.TCP_LD_OPR_TEMP}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_OPR_TEMP:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
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
                        <Grid item xs={12} md={8}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                PT(Interface Porosity)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_INTERPORO_MIN"
                                value={fbeData?.TCP_LD_INTERPORO_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_INTERPORO_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft: "2rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_INTERPORO_REFSTD"
                                value={fbeData?.TCP_LD_INTERPORO_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_INTERPORO_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={8}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                PT(Cross Section)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CS_MIN"
                                value={fbeData?.TCP_LD_CS_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_CS_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" ,marginLeft: "2rem"}}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CS_REFSTD"
                                value={fbeData?.TCP_LD_CS_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setFbeData({
                                    ...fbeData,
                                    TCP_LD_CS_REFSTD:
                                      e.target.value?.toUpperCase(),
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
                        Testing on 3LPE Coated Pipes
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
                        <Grid item xs={12} md={6}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Indentation(HOT)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_INDEN_HOT_MAX"
                                value={lpeData?.TCP_LD_INDEN_HOT_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_INDEN_HOT_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                             mm
                            </MDTypography>
                          </Grid>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft:"-1rem" }}
                                noWrap
                              >
                                Indentation(Room Temp)
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_INDEN_ROM_MAX"
                                value={lpeData?.TCP_LD_INDEN_ROM_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_INDEN_ROM_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                             mm
                            </MDTypography>
                          </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_IND_REFSTD"
                                value={lpeData?.TCP_LD_IND_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_IND_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* After Elongation Test row */}
<Grid item xs={12} md={3}>
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={6}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        textTransform="capitalize"
        variant="h6"
        color="dark"
        style={{ marginTop: "8px", fontSize: "0.9rem" }}
        noWrap
      >
        Elongation Test
      </MDTypography>
    </Grid>
    <Grid item xs={5}>
      <MDInput
        fullWidth
        id="TCP_LD_ELONG_TEST_MIN"
        value={lpeData?.TCP_LD_ELONG_TEST_MIN}
        disabled={true}
        onChange={(e) => {
          setLpeData({
            ...lpeData,
            TCP_LD_ELONG_TEST_MIN: e.target.value?.toUpperCase(),
          });
        }}
        style={{ marginLeft: "8px" }}
      />
    </Grid>
    <Grid item xs={1}>
      <MDTypography
        style={{
          marginTop: "8px",
          fontSize: "0.9rem",
          color: "blue",
        }}
      >
        %
      </MDTypography>
    </Grid>
  </Grid>
</Grid>

{/* INSERT NEW ROW HERE */}
<Grid item xs={12}>
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={12} md={6}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={5}>
          <MDTypography
            fontWeight="regular"
            fontSize="small"
            textTransform="capitalize"
            variant="h6"
            color="dark"
            style={{ marginTop: "8px", fontSize: "0.9rem" }}
            noWrap
          >
            Indentation Temperature (Room)
          </MDTypography>
        </Grid>
        <Grid item xs={6}>
          <MDInput
            fullWidth
            id="TCP_CP2_PIPE_IDENTIF"
            value={lpeData?.TCP_CP2_PIPE_IDENTIF}
            disabled={true}
            onChange={(e) => {
              setLpeData({
                ...lpeData,
                TCP_CP2_PIPE_IDENTIF: e.target.value?.toUpperCase(),
              });
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <MDTypography
            style={{
              marginTop: "8px",
              fontSize: "0.9rem",
              color: "blue",
            }}
          >
            mm
          </MDTypography>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={12} md={6}>
      <Grid container alignItems="center" spacing={1}>
        <Grid item xs={5}>
          <MDTypography
            fontWeight="regular"
            fontSize="small"
            textTransform="capitalize"
            variant="h6"
            color="dark"
            style={{ marginTop: "8px", fontSize: "0.9rem" }}
            noWrap
          >
            Indentation Temp. (Hot)
          </MDTypography>
        </Grid>
        <Grid item xs={6}>
          <MDInput
            fullWidth
            id="TCP_CP2_LOW_STRES_PUNCH"
            value={lpeData?.TCP_CP2_LOW_STRES_PUNCH}
            disabled={true}
            onChange={(e) => {
              setLpeData({
                ...lpeData,
                TCP_CP2_LOW_STRES_PUNCH: e.target.value?.toUpperCase(),
              });
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <MDTypography
            style={{
              marginTop: "8px",
              fontSize: "0.9rem",
              color: "blue",
            }}
          >
            mm
          </MDTypography>
        </Grid>
      </Grid>
    </Grid>
  </Grid>
</Grid>

{/* Continue with HOT Water Immersion row */}
<Grid item xs={12} md={6}>
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={3}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        textTransform="capitalize"
        variant="h6"
        color="dark"
        style={{ marginTop: "8px", fontSize: "0.9rem" }}
        noWrap
      >
        HOT Water Immersion
      </MDTypography>
    </Grid>
    <Grid item xs={8}>
      <MDInput
        fullWidth
        id="TCP_LD_HOTWATER_MIN"
        value={lpeData?.TCP_LD_HOTWATER_MIN}
        disabled={true}
        onChange={(e) => {
          setLpeData({
            ...lpeData,
            TCP_LD_HOTWATER_MIN: e.target.value?.toUpperCase(),
          });
        }}
        style={{ marginLeft: "8px" }}
      />
    </Grid>
    <Grid item xs={1}>
      <MDTypography
        style={{
          marginTop: "8px",
          fontSize: "0.9rem",
          color: "blue",
        }}
      >
        mm
      </MDTypography>
    </Grid>
  </Grid>
</Grid>

                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_48H_REFSTD"
                                value={lpeData?.TCP_LD_48H_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_48H_REFSTD:
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
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Tensile Test
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_ELON_REFSTD"
                                value={lpeData?.TCP_LD_ELON_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_ELON_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Product Stability
                              </MDTypography>
                            </Grid>
                            <Grid item xs={8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_PRDSTABL_MIN"
                                value={lpeData?.TCP_LD_PRDSTABL_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_PRDSTABL_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                             mm
                            </MDTypography>
                          </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_ELONG_REFSTD"
                                value={lpeData?.TCP_LD_ELONG_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_ELONG_REFSTD:
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
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Tensile REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_TENSILE_REFSTD"
                                value={lpeData?.TCP_LD_TENSILE_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_TENSILE_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Flexibility 3LPE
                              </MDTypography>
                            </Grid>
                            <Grid item xs={8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_FLEX_3LPE"
                                value={lpeData?.TCP_LD_FLEX_3LPE}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_FLEX_3LPE:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                             mm
                            </MDTypography>
                          </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={3}>
                                <Tooltip title="Hardness Test" arrow>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Hardness Test
                              </MDTypography>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={9}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_3LPE_REFSTD"
                                value={lpeData?.TCP_LD_3LPE_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_3LPE_REFSTD:
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
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Hardness REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_HARDH_REFSTD"
                                value={lpeData?.TCP_LD_HARDH_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_HARDH_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* <Grid item xs={12} md={3}>
                        </Grid>
                        <Grid item xs={12} md={3}>
                        </Grid>
                        <Grid item xs={12} md={3}>
                              </Grid>*/}
                        <Grid item xs={12} md={7}> 
                          <Grid container alignItems="center" spacing={0}>
                            <Grid item xs={2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                CD 48 Hour Min
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_48H_MIN"
                                value={lpeData?.TCP_LD_CD_48H_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_48H_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft:"0.5rem" }}
                                noWrap
                              >
                                Max
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_48H_MAX"
                                value={lpeData?.TCP_LD_CD_48H_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_48H_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={0.5}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                             mm
                            </MDTypography>
                          </Grid>
                            <Grid item xs={1}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3.5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_48H_REFSTD"
                                value={lpeData?.TCP_LD_CD_48H_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_48H_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={2.2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Test Duration
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2.8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_48H_TESTDUR"
                                value={lpeData?.TCP_LD_CD_48H_TESTDUR}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_48H_TESTDUR:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={3.2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Operating temp.
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2.8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_48H_OPR_TEMP"
                                value={lpeData?.TCP_LD_CD_48H_OPR_TEMP}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_48H_OPR_TEMP:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
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
                        <Grid item xs={12} md={7}>
                          <Grid container alignItems="center" spacing={0}>
                            <Grid item xs={2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                CD 28D / 30D H
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28D_MIN"
                                value={lpeData?.TCP_LD_CD_28D_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28D_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft:"0.5rem"  }}
                                noWrap
                              >
                              Max
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28D_MAX"
                                value={lpeData?.TCP_LD_CD_28D_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28D_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "-0.1rem" }}
                              />
                            </Grid>
                            <Grid item xs={0.5}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                             mm
                            </MDTypography>
                          </Grid>
                            <Grid item xs={1}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3.5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28D_REFSTD"
                                value={lpeData?.TCP_LD_CD_28D_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28D_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={2.2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Test Duration
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2.8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28D_TESTDUR"
                                value={lpeData?.TCP_LD_CD_28D_TESTDUR}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28D_TESTDUR:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={3.2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Operating temp.
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2.8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28D_OPRTEMP"
                                value={lpeData?.TCP_LD_CD_28D_OPRTEMP}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28D_OPRTEMP:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
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
                        <Grid item xs={12} md={7}>
                          <Grid container alignItems="center" spacing={0}>
                            <Grid item xs={2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                CD 28D / 30D N
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28DN_MIN"
                                value={lpeData?.TCP_LD_CD_28DN_MIN}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28DN_MIN:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem",marginLeft:"0.5rem" }}
                                noWrap
                              >
                                Max
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28DN_MAX"
                                value={lpeData?.TCP_LD_CD_28DN_MAX}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28DN_MAX:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "-0.1rem" }}
                              />
                            </Grid>
                            <Grid item xs={0.5}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                             mm
                            </MDTypography>
                          </Grid>
                            <Grid item xs={1}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                REF STD
                              </MDTypography>
                            </Grid>
                            <Grid item xs={3.5}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_CD_28DN_REFSTD"
                                value={lpeData?.TCP_LD_CD_28DN_REFSTD}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_CD_28DN_REFSTD:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={5}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={2.2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Test Duration
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2.8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_28DN_TESTDUR"
                                value={lpeData?.TCP_LD_28DN_TESTDUR}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_28DN_TESTDUR:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={3.2}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{ marginTop: "8px", fontSize: "0.9rem" }}
                                noWrap
                              >
                                Operating temp.
                              </MDTypography>
                            </Grid>
                            <Grid item xs={2.8}>
                              <MDInput
                                fullWidth
                                id="TCP_LD_28DN_OPRTEMP"
                                value={lpeData?.TCP_LD_28DN_OPRTEMP}
                                disabled={true}
                                onChange={(e) => {
                                  setLpeData({
                                    ...lpeData,
                                    TCP_LD_28DN_OPRTEMP:
                                      e.target.value?.toUpperCase(),
                                  });
                                }}
                                style={{ marginLeft: "0px" }}
                              />
                            </Grid>
                            <Grid item xs={1}>
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
