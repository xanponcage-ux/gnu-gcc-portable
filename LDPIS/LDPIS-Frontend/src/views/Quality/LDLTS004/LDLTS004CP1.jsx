// This is for LAB Details code in Process Entry Sheet(Internal)..

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

export default function LDLTS004CP1(props) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandMillGrid, setExpandMillGrid] = useState(true);
  const [expandBarePipe, setExpandBarePipe] = useState(true);
  const [expandDIWash, setExpandDIWash] = useState(true);
  const [expandAbrBlst, setExpandAbrBlst] = useState(true);
  const [expandChromAppl, setExpandChromAppl] = useState(true);
  const [expandPhsTreat, setExpandPhsTreat] = useState(true);
  const [expandCoatAppl, setExpandCoatAppl] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });

  const [millVisData, setMillVisData] = useState({
    TCP_CP1_VERIF_BPIPE: "",
    TCP_CP1_VISUAL_INSP: "",
    TCP_CP1_INSP_ABRAS: "",
    TCP_CP1_REL_HUMID: "",
    TCP_CP1_HTEMP_MIN: "",
    TCP_CP1_HTEMP_MAX: "",
    TCP_CP1_SALT_TEST: "",
    TCP_CP1_ABRA_HUMID: "",
    TCP_CP1_DO_CLEAN: "",
    TCP_CP1_SRUF_MIN: "",
    TCP_CP1_SRUF_MAX: "",
    TCP_CP1_AP_30X: "",
    TCP_CP1_DG_DUST_MAX: "",
    TCP_CP1_ID_CLEAN_BPIPE: "",
    TCP_CP1_VISUAL_CHK: "",
    TCP_CP1_SALT_CONT: "",
    TCP_CP1_PH_CONCENT: "",
    TCP_CP1_PH_SUR_PIPE: "",
    TCP_CP1_PRE_HEAT_MIN: "",
    TCP_CP1_PRE_HEAT_MAX: "",
    TCP_CP1_DWEL_TIME: "",
    TCP_CP1_DIHIGH_PRESU_MIN: "",
    TCP_CP1_DIHIGH_PRESU_MAX: "",
    TCP_CP1_VISUAL_APPEA: "",
    TCP_CP1_HEATAIRTEMP_MIN: "",
    TCP_CP1_HEATAIRTEMP_MAX: "",
    TCP_CP1_DIWFLOW_MIN: "",
    TCP_CP1_DIWFLOW_MAX: "",
    TCP_CP1_CHPHEATEMP_MIN: "",
    TCP_CP1_CHPHEATEMP_MAX: "",
    TCP_CP1_CHSOL_TEMP: "",
    TCP_CP1_CH_APPLI: "",
    TCP_CP1_CO_APPLI: "",
    TCP_CP1_PH_FBEAPP_MIN: "",
    TCP_CP1_PH_FBEAPP_MAX: "",
    TCP_CP1_ADHEFLIM_MIN: "",
    TCP_CP1_ADHEFLIM_MAX: "",
    TCP_CP1_PEFFLIM_TEMP_MIN: "",
    TCP_CP1_PEFFLIM_TEMP_MAX: "",
    TCP_CP1_QUENTEMP_MIN: "",
    TCP_CP1_QUENTEMP_MAX: "",
    TCP_CP1_DEWPOINT_MIN: "",
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
      TCP_CP1_VERIF_BPIPE: "",
      TCP_CP1_VISUAL_INSP: "",
      TCP_CP1_INSP_ABRAS: "",
      TCP_CP1_REL_HUMID: "",
      TCP_CP1_HTEMP_MIN: "",
      TCP_CP1_HTEMP_MAX: "",
      TCP_CP1_SALT_TEST: "",
      TCP_CP1_ABRA_HUMID: "",
      TCP_CP1_DO_CLEAN: "",
      TCP_CP1_SRUF_MIN: "",
      TCP_CP1_SRUF_MAX: "",
      TCP_CP1_AP_30X: "",
      TCP_CP1_DG_DUST_MAX: "",
      TCP_CP1_ID_CLEAN_BPIPE: "",
      TCP_CP1_VISUAL_CHK: "",
      TCP_CP1_SALT_CONT: "",
      TCP_CP1_PH_CONCENT: "",
      TCP_CP1_PH_SUR_PIPE: "",
      TCP_CP1_PRE_HEAT_MIN: "",
      TCP_CP1_PRE_HEAT_MAX: "",
      TCP_CP1_DWEL_TIME: "",
      TCP_CP1_DIHIGH_PRESU_MIN: "",
      TCP_CP1_DIHIGH_PRESU_MAX: "",
      TCP_CP1_VISUAL_APPEA: "",
      TCP_CP1_HEATAIRTEMP_MIN: "",
      TCP_CP1_HEATAIRTEMP_MAX: "",
      TCP_CP1_DIWFLOW_MIN: "",
      TCP_CP1_DIWFLOW_MAX: "",
      TCP_CP1_CHPHEATEMP_MIN: "",
      TCP_CP1_CHPHEATEMP_MAX: "",
      TCP_CP1_CHSOL_TEMP: "",
      TCP_CP1_CH_APPLI: "",
      TCP_CP1_CO_APPLI: "",
      TCP_CP1_PH_FBEAPP_MIN: "",
      TCP_CP1_PH_FBEAPP_MAX: "",
      TCP_CP1_ADHEFLIM_MIN: "",
      TCP_CP1_ADHEFLIM_MAX: "",
      TCP_CP1_PEFFLIM_TEMP_MIN: "",
      TCP_CP1_PEFFLIM_TEMP_MAX: "",
      TCP_CP1_QUENTEMP_MIN: "",
      TCP_CP1_QUENTEMP_MAX: "",
      TCP_CP1_DEWPOINT_MIN: "",
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

      const url = "api/LDLTS004/getOrdDetailMD";
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
            TCP_CP1_VERIF_BPIPE: res?.data[0]?.TCP_CP1_VERIF_BPIPE,
            TCP_CP1_VISUAL_INSP: res?.data[0]?.TCP_CP1_VISUAL_INSP,
            TCP_CP1_INSP_ABRAS: res?.data[0]?.TCP_CP1_INSP_ABRAS,
            TCP_CP1_REL_HUMID: res?.data[0]?.TCP_CP1_REL_HUMID,
            TCP_CP1_HTEMP_MIN: res?.data[0]?.TCP_CP1_HTEMP_MIN,
            TCP_CP1_HTEMP_MAX: res?.data[0]?.TCP_CP1_HTEMP_MAX,
            TCP_CP1_SALT_TEST: res?.data[0]?.TCP_CP1_SALT_TEST,
            TCP_CP1_ABRA_HUMID: res?.data[0]?.TCP_CP1_ABRA_HUMID,
            TCP_CP1_DO_CLEAN: res?.data[0]?.TCP_CP1_DO_CLEAN,
            TCP_CP1_SRUF_MIN: res?.data[0]?.TCP_CP1_SRUF_MIN,
            TCP_CP1_SRUF_MAX: res?.data[0]?.TCP_CP1_SRUF_MAX,
            TCP_CP1_AP_30X: res?.data[0]?.TCP_CP1_AP_30X,
            TCP_CP1_DG_DUST_MAX: res?.data[0]?.TCP_CP1_DG_DUST_MAX,
            TCP_CP1_ID_CLEAN_BPIPE: res?.data[0]?.TCP_CP1_ID_CLEAN_BPIPE,
            TCP_CP1_VISUAL_CHK: res?.data[0]?.TCP_CP1_VISUAL_CHK,
            TCP_CP1_SALT_CONT: res?.data[0]?.TCP_CP1_SALT_CONT,
            TCP_CP1_PH_CONCENT: res?.data[0]?.TCP_CP1_PH_CONCENT,
            TCP_CP1_PH_SUR_PIPE: res?.data[0]?.TCP_CP1_PH_SUR_PIPE,
            TCP_CP1_PRE_HEAT_MIN: res?.data[0]?.TCP_CP1_PRE_HEAT_MIN,
            TCP_CP1_PRE_HEAT_MAX: res?.data[0]?.TCP_CP1_PRE_HEAT_MAX,
            TCP_CP1_DWEL_TIME: res?.data[0]?.TCP_CP1_DWEL_TIME,
            TCP_CP1_DIHIGH_PRESU_MIN: res?.data[0]?.TCP_CP1_DIHIGH_PRESU_MIN,
            TCP_CP1_DIHIGH_PRESU_MAX: res?.data[0]?.TCP_CP1_DIHIGH_PRESU_MAX,
            TCP_CP1_VISUAL_APPEA: res?.data[0]?.TCP_CP1_VISUAL_APPEA,
            TCP_CP1_HEATAIRTEMP_MIN: res?.data[0]?.TCP_CP1_HEATAIRTEMP_MIN,
            TCP_CP1_HEATAIRTEMP_MAX: res?.data[0]?.TCP_CP1_HEATAIRTEMP_MAX,
            TCP_CP1_DIWFLOW_MIN: res?.data[0]?.TCP_CP1_DIWFLOW_MIN,
            TCP_CP1_DIWFLOW_MAX: res?.data[0]?.TCP_CP1_DIWFLOW_MAX,
            TCP_CP1_CHPHEATEMP_MIN: res?.data[0]?.TCP_CP1_CHPHEATEMP_MIN,
            TCP_CP1_CHPHEATEMP_MAX: res?.data[0]?.TCP_CP1_CHPHEATEMP_MAX,
            TCP_CP1_CHSOL_TEMP: res?.data[0]?.TCP_CP1_CHSOL_TEMP,
            TCP_CP1_CH_APPLI: res?.data[0]?.TCP_CP1_CH_APPLI,
            TCP_CP1_CO_APPLI: res?.data[0]?.TCP_CP1_CO_APPLI,
            TCP_CP1_PH_FBEAPP_MIN: res?.data[0]?.TCP_CP1_PH_FBEAPP_MIN,
            TCP_CP1_PH_FBEAPP_MAX: res?.data[0]?.TCP_CP1_PH_FBEAPP_MAX,
            TCP_CP1_ADHEFLIM_MIN: res?.data[0]?.TCP_CP1_ADHEFLIM_MIN,
            TCP_CP1_ADHEFLIM_MAX: res?.data[0]?.TCP_CP1_ADHEFLIM_MAX,
            TCP_CP1_PEFFLIM_TEMP_MIN: res?.data[0]?.TCP_CP1_PEFFLIM_TEMP_MIN,
            TCP_CP1_PEFFLIM_TEMP_MAX: res?.data[0]?.TCP_CP1_PEFFLIM_TEMP_MAX,
            TCP_CP1_QUENTEMP_MIN: res?.data[0]?.TCP_CP1_QUENTEMP_MIN,
            TCP_CP1_QUENTEMP_MAX: res?.data[0]?.TCP_CP1_QUENTEMP_MAX,
            TCP_CP1_DEWPOINT_MIN: res?.data[0]?.TCP_CP1_DEWPOINT_MIN,
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
            {/* Inspection Of Bare Pipes Grid */}
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
                        Inspection of Bare Pipes
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandBarePipe ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandBarePipe(!expandBarePipe)}
                        >
                          {expandBarePipe ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandBarePipe && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12}>
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
                              Verification ECT
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_VERIF_BPIPE"
                              value={millVisData?.TCP_CP1_VERIF_BPIPE}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_VERIF_BPIPE:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              Visual Inspection
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_VISUAL_INSP"
                              value={millVisData?.TCP_CP1_VISUAL_INSP}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_VISUAL_INSP:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              Inspec.of Abrasive
                            </MDTypography>
                          </Grid>
                          <Grid item xs={10}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_INSP_ABRAS"
                              value={millVisData?.TCP_CP1_INSP_ABRAS}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_INSP_ABRAS:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              Relative Humidity
                            </MDTypography>
                          </Grid>
                          <Grid item xs={10}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_REL_HUMID"
                              value={millVisData?.TCP_CP1_REL_HUMID}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_REL_HUMID:
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
                          <Grid item xs={6.2}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Pre Heating Temp
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_HTEMP _MIN"
                              value={millVisData?.TCP_CP1_HTEMP_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_HTEMP_MIN:
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_HTEMP _MAX"
                              value={millVisData?.TCP_CP1_HTEMP_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_HTEMP_MAX:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2.1}>
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
                      <Grid item xs={12} md={4}>
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
                              Salt Contamination Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_SALT_TEST"
                              value={millVisData?.TCP_CP1_SALT_TEST}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_SALT_TEST:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "4px" }}
                            />
                          </Grid>
                          <Grid item xs={2.1}>
                            <MDTypography
                              style={{
                                marginTop: "8px",
                                fontSize: "0.9rem",
                                color: "blue",
                              }}
                            >
                              µg/cm²
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}
              </Card>
            </Grid>
            {/* DI Water Wash */}
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
                        DI Water Wash
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandDIWash ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandDIWash(!expandDIWash)}
                        >
                          {expandDIWash ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandDIWash && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6}>
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
                              High Pres Wash
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DIHIGH_PRESU_MIN"
                              value={millVisData?.TCP_CP1_DIHIGH_PRESU_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DIHIGH_PRESU_MIN:
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DIHIGH_PRESU_MAX"
                              value={millVisData?.TCP_CP1_DIHIGH_PRESU_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DIHIGH_PRESU_MAX:
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
                              BAR
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={6}>
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
                              Heating Air Temp Min.
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_HEATAIRTEMP_MIN"
                              value={millVisData?.TCP_CP1_HEATAIRTEMP_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_HEATAIRTEMP_MIN:
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_HEATAIRTEMP_MAX"
                              value={millVisData?.TCP_CP1_HEATAIRTEMP_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_HEATAIRTEMP_MAX:
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
                              ℃
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={6}>
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
                              DI Water Flow Rt Min
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DIWFLOW_MIN"
                              value={millVisData?.TCP_CP1_DIWFLOW_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DIWFLOW_MIN:
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DIWFLOW_MAX"
                              value={millVisData?.TCP_CP1_DIWFLOW_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DIWFLOW_MAX:
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
                              Lit/Sqm
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={1.9}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Visual Appearance
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_VISUAL_APPEA"
                              value={millVisData?.TCP_CP1_VISUAL_APPEA}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_VISUAL_APPEA:
                                    e.target.value?.toUpperCase(),
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
            {/* Inspection After Abresive Blasting */}
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
                        Inspection After Abresive Blasting
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandAbrBlst ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandAbrBlst(!expandAbrBlst)}
                        >
                          {expandAbrBlst ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandAbrBlst && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12}>
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
                              Abrasive Humidity
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_ABRA_HUMID"
                              value={millVisData?.TCP_CP1_ABRA_HUMID}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_ABRA_HUMID:
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
                              Degree of Cleannes
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DO_CLEAN"
                              value={millVisData?.TCP_CP1_DO_CLEAN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DO_CLEAN:
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
                              Surface Rz Profile
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
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_SRUF_MIN"
                              value={millVisData?.TCP_CP1_SRUF_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_SRUF_MIN:
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_SRUF_MAX"
                              value={millVisData?.TCP_CP1_SRUF_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_SRUF_MAX:
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
                              µm
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              Anchor Pattern 30X
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_AP_30X"
                              value={millVisData?.TCP_CP1_AP_30X}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_AP_30X: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
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
                              Degree Of Dust Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DG_DUST_MAX"
                              value={millVisData?.TCP_CP1_DG_DUST_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DG_DUST_MAX:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container alignItems="center" spacing={0.5}>
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
                              Salt Contamination Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_SALT_CONT"
                              value={millVisData?.TCP_CP1_SALT_CONT}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_SALT_CONT:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "4px" }}
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
                              µg/cm²
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              ID Cleaning B Pipe
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_ID_CLEAN_BPIPE"
                              value={millVisData?.TCP_CP1_ID_CLEAN_BPIPE}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_ID_CLEAN_BPIPE:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              Visual Check
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_VISUAL_CHK"
                              value={millVisData?.TCP_CP1_VISUAL_CHK}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_VISUAL_CHK:
                                    e.target.value?.toUpperCase(),
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
            {/* Chromate Application */}
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
                        Chromate Application
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandChromAppl ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandChromAppl(!expandChromAppl)}
                        >
                          {expandChromAppl ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandChromAppl && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={5}>
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
                              Pre Heating Temp
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1.2}>
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
                              id="TCP_CP1_CHPHEATEMP_MIN"
                              value={millVisData?.TCP_CP1_CHPHEATEMP_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_CHPHEATEMP_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={2}>
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_CHPHEATEMP_MAX"
                              value={millVisData?.TCP_CP1_CHPHEATEMP_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_CHPHEATEMP_MAX:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Solution Temperature
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_CHSOL_TEMP"
                              value={millVisData?.TCP_CP1_CHSOL_TEMP}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_CHSOL_TEMP:
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
                              ℃
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              Chromate Application
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_CH_APPLI"
                              value={millVisData?.TCP_CP1_CH_APPLI}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_CH_APPLI:
                                    e.target.value?.toUpperCase(),
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
            {/* Phosphoric Acid Treatment */}
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
                        Phosphoric Acid Treatment
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandPhsTreat ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandPhsTreat(!expandPhsTreat)}
                        >
                          {expandPhsTreat ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandPhsTreat && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={12}>
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
                              pH & Concentration
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_PH_CONCENT"
                              value={millVisData?.TCP_CP1_PH_CONCENT}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PH_CONCENT:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              pH of Pipe Surface
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_PH_SUR_PIPE"
                              value={millVisData?.TCP_CP1_PH_SUR_PIPE}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PH_SUR_PIPE:
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
                          <Grid item xs={6.1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Pre Heating Temp.
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
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_PRE_HEAT_MIN"
                              value={millVisData?.TCP_CP1_PRE_HEAT_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PRE_HEAT_MIN:
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
                              id="TCP_CP1_PRE_HEAT_MAX"
                              value={millVisData?.TCP_CP1_PRE_HEAT_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PRE_HEAT_MAX:
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
                              ℃
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
                              DWELL Time
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DWEL_TIME"
                              value={millVisData?.TCP_CP1_DWEL_TIME}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DWEL_TIME:
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
                              Sec
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}
              </Card>
            </Grid>
            {/* Coating Application */}
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
                        Coating Application
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandCoatAppl ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandCoatAppl(!expandCoatAppl)}
                        >
                          {expandCoatAppl ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandCoatAppl && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      {/* <Grid item xs={12} md={12}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={1.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Coating Application
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_CO_APPLI"
                              value={millVisData?.TCP_CP1_CO_APPLI}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_CO_APPLI:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px", display: "none" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid> 
                      */}

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6.1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Pre Heat FBE App
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1.3}>
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
                          <Grid item xs={4.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_PH_FBEAPP_MIN"
                              value={millVisData?.TCP_CP1_PH_FBEAPP_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PH_FBEAPP_MIN:
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_PH_FBEAPP_MAX"
                              value={millVisData?.TCP_CP1_PH_FBEAPP_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PH_FBEAPP_MAX:
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
                              ℃
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
                              Adhsv Film Temp
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1.5}>
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
                          <Grid item xs={4.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_ADHEFLIM_MIN"
                              value={millVisData?.TCP_CP1_ADHEFLIM_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_ADHEFLIM_MIN:
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
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_ADHEFLIM_MAX"
                              value={millVisData?.TCP_CP1_ADHEFLIM_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_ADHEFLIM_MAX:
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
                              ℃
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={6.1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              PE Film Temp
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1.3}>
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
                          <Grid item xs={4.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_PEFFLIM_TEMP_MIN"
                              value={millVisData?.TCP_CP1_PEFFLIM_TEMP_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PEFFLIM_TEMP_MIN:
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_PEFFLIM_TEMP_MAX"
                              value={millVisData?.TCP_CP1_PEFFLIM_TEMP_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_PEFFLIM_TEMP_MAX:
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
                              ℃
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
                              Quench Temp
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1.5}>
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
                          <Grid item xs={4.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_QUENTEMP_MIN"
                              value={millVisData?.TCP_CP1_QUENTEMP_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_QUENTEMP_MIN:
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
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_QUENTEMP_MAX"
                              value={millVisData?.TCP_CP1_QUENTEMP_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_QUENTEMP_MAX:
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
                              ℃
                            </MDTypography>
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
                              Dew Point Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={0.7}>
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
                          <Grid item xs={2.2}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_DEWPOINT_MIN"
                              value={millVisData?.TCP_CP1_DEWPOINT_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setMillVisData({
                                  ...millVisData,
                                  TCP_CP1_DEWPOINT_MIN:
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
                              ℃
                            </MDTypography>
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
