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

export default function LDLTS003ID(props) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandMill, setExpandMill] = useState(true);
  const [expandVDI, setExpandVDI] = useState(true);
  const [expandProced, setExpandProced] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });

  const [millData, setMillData] = useState({
    micrometer: "",
    odMicrometer: "",
    measureTape: "",
    other1: "",
    pipeTape: "",
    verCalliper: "",
    radiusGauge: "",
    other2: "",
    snapGauge: "",
    rightAngle: "",
    fillerGauge: "",
    other3: "",
  });

  const [vdiData, setVdiData] = useState({
    micrometer: "",
    pipeTape: "",
    steelScale: "",
    rootFaceGauge: "",
    odMicrometer: "",
    dMeter: "",
    fillerGauge: "",
    rightAngle: "",
    measureTape: "",
    verCalliper: "",
    angleProtector: "",
    radiusGauge: "",
    luxMeter: "",
    stEdge: "",
  });

  const [procedData, setProcedData] = useState({
    millProced: "",
    vdiProced: "",
    flatProced: "",
    eddyCurr: "",
    tensileProced: "",
    spectroProced: "",
    metallogProced: "",
    hydroProced: "",
    bodyUtProced: "",
    weldUtAuto: "",
    mpiProced: "",
    rbtProced: "",
    dwttProced: "",
    hardness: "",
    mutBody: "",
    mutWeld: "",
    impProced: "",
    cylHydro: "",
    endFacing: "",
  });

  useEffect(() => {
    console.log("Inside sales details");
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        //page load functions here
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
    setMillData((prevState) => ({
      ...prevState,
      micrometer: "",
      odMicrometer: "",
      measureTape: "",
      other1: "",
      pipeTape: "",
      verCalliper: "",
      radiusGauge: "",
      other2: "",
      snapGauge: "",
      rightAngle: "",
      fillerGauge: "",
      other3: "",
    }));
    setVdiData((prevState) => ({
      ...prevState,
      micrometer: "",
      pipeTape: "",
      steelScale: "",
      rootFaceGauge: "",
      odMicrometer: "",
      dMeter: "",
      fillerGauge: "",
      rightAngle: "",
      measureTape: "",
      verCalliper: "",
      angleProtector: "",
      radiusGauge: "",
      luxMeter: "",
      stEdge: "",
    }));
    setProcedData((prevState) => ({
      ...prevState,
      millProced: "",
      vdiProced: "",
      flatProced: "",
      eddyCurr: "",
      tensileProced: "",
      spectroProced: "",
      metallogProced: "",
      hydroProced: "",
      bodyUtProced: "",
      weldUtAuto: "",
      mpiProced: "",
      rbtProced: "",
      dwttProced: "",
      hardness: "",
      mutBody: "",
      mutWeld: "",
      impProced: "",
      cylHydro: "",
      endFacing: "",
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

      const url = "api/LDLTS003/getOrdDetailID";
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
          console.log("==> ", res.data);

          setMillData((prevState) => ({
            ...prevState,
            micrometer: res?.data[0]?.TPS_ID_MILMM || "",
            odMicrometer: res?.data[0]?.TPS_ID_MILOD || "",
            measureTape: res?.data[0]?.TPS_ID_MEASUR_TAPE || "",
            other1: res?.data[0]?.TPS_ID_MILOT2 || "",
            pipeTape: res?.data[0]?.TPS_ID_PIPE_TAPE || "",
            verCalliper: res?.data[0]?.TPS_ID_VER_CALLIPR || "",
            radiusGauge: res?.data[0]?.TPS_ID_RG || "",
            other2: res?.data[0]?.TPS_ID_MILOT3 || "",
            snapGauge: res?.data[0]?.TPS_ID_SG || "",
            rightAngle: res?.data[0]?.TPS_ID_RIGHT_ANGLE || "",
            fillerGauge: res?.data[0]?.TPS_ID_FILL_G_1 || "",
            other3: res?.data[0]?.TPS_ID_MILOT4 || "",
          }));

          setVdiData((prevState) => ({
            ...prevState,
            micrometer: res?.data[0]?.TPS_ID_MM_0_25 || "",
            pipeTape: res?.data[0]?.TPS_ID_PIPE_TAPE1 || "",
            steelScale: res?.data[0]?.TPS_ID_STL_SCALE || "",
            rootFaceGauge: res?.data[0]?.TPS_ID_ROOT_FC_G || "",
            odMicrometer: res?.data[0]?.TPS_ID_OD_MM || "",
            dMeter: res?.data[0]?.TPS_ID_D_METR || "",
            fillerGauge: res?.data[0]?.TPS_ID_FILL_G_2 || "",
            rightAngle: res?.data[0]?.TPS_ID_RGHT_ANG || "",
            measureTape: res?.data[0]?.TPS_ID_MESR_TAPE || "",
            verCalliper: res?.data[0]?.TPS_ID_VER_CALLIPR1 || "",
            angleProtector: res?.data[0]?.TPS_ID_ANG_PROTC || "",
            radiusGauge: res?.data[0]?.TPS_ID_RG1 || "",
            luxMeter: res?.data[0]?.TPS_ID_LIX_MTR || "",
            stEdge: res?.data[0]?.TPS_ID_STRT_EDGE || "",
          }));

          setProcedData((prevState) => ({
            ...prevState,
            millProced: res?.data[0]?.TPS_ID_MILLPROC || "",
            vdiProced: res?.data[0]?.TPS_ID_VDIPROC || "",
            flatProced: res?.data[0]?.TPS_ID_FLTPROC || "",
            eddyCurr: res?.data[0]?.TPS_ID_EDDYC || "",
            tensileProced: res?.data[0]?.TPS_ID_TENPROC || "",
            spectroProced: res?.data[0]?.TPS_ID_SPECPROC || "",
            metallogProced: res?.data[0]?.TPS_ID_METPROC || "",
            hydroProced: res?.data[0]?.TPS_ID_HYDRPROC || "",
            bodyUtProced: res?.data[0]?.TPS_ID_BODYUT || "",
            weldUtAuto: res?.data[0]?.TPS_ID_WELDUT || "",
            mpiProced: res?.data[0]?.TPS_ID_MPIPROC || "",
            rbtProced: res?.data[0]?.TPS_ID_RBTPROC || "",
            dwttProced: res?.data[0]?.TPS_ID_DWTTPROC || "",
            hardness: res?.data[0]?.TPS_ID_HARDN || "",
            mutBody: res?.data[0]?.TPS_ID_MANNUT || "",
            mutWeld: res?.data[0]?.TPS_ID_MWELDUT || "",
            impProced: res?.data[0]?.TPS_ID_IMPPROC || "",
            cylHydro: res?.data[0]?.TPS_ID_CYCHYDRO || "",
            endFacing: res?.data[0]?.TPS_ID_ENDFACE || "",
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
            {/* Mill Instruments Grid */}
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
                        Mill Instruments
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
                      <Tooltip title={expandMill ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandMill(!expandMill)}
                        >
                          {expandMill ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandMill && (
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
                              Micrometer (0-25)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="micrometer"
                              value={millData?.micrometer}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  micrometer: e.target.value?.toUpperCase(),
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
                              OD Micrometer
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="odMicrometer"
                              value={millData?.odMicrometer}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  odMicrometer: e.target.value?.toUpperCase(),
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
                              Measuring Tape
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="measureTape"
                              value={millData?.measureTape}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  measureTape: e.target.value?.toUpperCase(),
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
                              Other1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="other1"
                              value={millData?.other1}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  other1: e.target.value?.toUpperCase(),
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
                              Pipe Tape
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="pipeTape"
                              value={millData?.pipeTape}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  pipeTape: e.target.value?.toUpperCase(),
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
                              Ver. Calliper
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="verCalliper"
                              value={millData?.verCalliper}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  verCalliper: e.target.value?.toUpperCase(),
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
                              Radius Gauge
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="radiusGauge"
                              value={millData?.radiusGauge}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  radiusGauge: e.target.value?.toUpperCase(),
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
                              Other2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="other2"
                              value={millData?.other2}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  other2: e.target.value?.toUpperCase(),
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
                              Snap Gauge
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="snapGauge"
                              value={millData?.snapGauge}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  snapGauge: e.target.value?.toUpperCase(),
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
                              Right Angle
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="rightAngle"
                              value={millData?.rightAngle}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  rightAngle: e.target.value?.toUpperCase(),
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
                              Filler Gauge
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="fillerGauge"
                              value={millData?.fillerGauge}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  fillerGauge: e.target.value?.toUpperCase(),
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
                              Other3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="other3"
                              value={millData?.other3}
                              disabled={true}
                              onChange={(e) => {
                                setMillData({
                                  ...millData,
                                  other3: e.target.value?.toUpperCase(),
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

            {/* VDI Instruments Grid */}
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
                        VDI Instruments
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandVDI ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandVDI(!expandVDI)}
                        >
                          {expandVDI ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandVDI && (
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
                              Micrometer (0-25)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="micrometer"
                              value={vdiData?.micrometer}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  micrometer: e.target.value?.toUpperCase(),
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
                              OD Micrometer
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="odMicrometer"
                              value={vdiData?.odMicrometer}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  odMicrometer: e.target.value?.toUpperCase(),
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
                              Measuring Tape
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="measureTape"
                              value={vdiData?.measureTape}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  measureTape: e.target.value?.toUpperCase(),
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
                              Lux Meter
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="luxMeter"
                              value={vdiData?.luxMeter}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  luxMeter: e.target.value?.toUpperCase(),
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
                              Pipe Tape
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="pipeTape"
                              value={vdiData?.pipeTape}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  pipeTape: e.target.value?.toUpperCase(),
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
                              D.Meter
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="dMeter"
                              value={vdiData?.dMeter}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  dMeter: e.target.value?.toUpperCase(),
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
                              Ver. Calliper
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="verCalliper"
                              value={vdiData?.verCalliper}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  verCalliper: e.target.value?.toUpperCase(),
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
                              Straight Edge
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="stEdge"
                              value={vdiData?.stEdge}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  stEdge: e.target.value?.toUpperCase(),
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
                              Steel Scale
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="steelScale"
                              value={vdiData?.steelScale}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  steelScale: e.target.value?.toUpperCase(),
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
                              Filler Gauge
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="fillerGauge"
                              value={vdiData?.fillerGauge}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  fillerGauge: e.target.value?.toUpperCase(),
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
                              Angle Protector
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="angleProtector"
                              value={vdiData?.angleProtector}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  angleProtector: e.target.value?.toUpperCase(),
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
                              Root Face Gauge
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="rootFaceGauge"
                              value={vdiData?.rootFaceGauge}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  rootFaceGauge: e.target.value?.toUpperCase(),
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
                              Right Angle
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="rightAngle"
                              value={vdiData?.rightAngle}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  rightAngle: e.target.value?.toUpperCase(),
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
                              Radius Gauge
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="radiusGauge"
                              value={vdiData?.radiusGauge}
                              disabled={true}
                              onChange={(e) => {
                                setVdiData({
                                  ...vdiData,
                                  radiusGauge: e.target.value?.toUpperCase(),
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

            {/* Procedures Number Grid */}
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
                        Procedures Number
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandProced ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandProced(!expandProced)}
                        >
                          {expandProced ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandProced && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={4}>
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
                              Mill Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="millProced"
                              value={procedData?.millProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  millProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              Hydro Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="hydroProced"
                              value={procedData?.hydroProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  hydroProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              Hardness
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="hardness"
                              value={procedData?.hardness}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  hardness: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                              VDI Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="vdiProced"
                              value={procedData?.vdiProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  vdiProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              Body UT Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="bodyUtProced"
                              value={procedData?.bodyUtProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  bodyUtProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              MUT Body
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="mutBody"
                              value={procedData?.mutBody}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  mutBody: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                              Flatt. Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="flatProced"
                              value={procedData?.flatProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  flatProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              Weld UT Auto
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="weldUtAuto"
                              value={procedData?.weldUtAuto}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  weldUtAuto: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              MUT Weld
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="mutWeld"
                              value={procedData?.mutWeld}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  mutWeld: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                              Eddy Current
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="eddyCurr"
                              value={procedData?.eddyCurr}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  eddyCurr: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              MPI Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="mpiProced"
                              value={procedData?.mpiProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  mpiProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              IMP Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="impProced"
                              value={procedData?.impProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  impProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                              Tensile Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="tensileProced"
                              value={procedData?.tensileProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  tensileProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              RBT Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="rbtProced"
                              value={procedData?.rbtProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  rbtProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              Cyl. Hydro
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="cylHydro"
                              value={procedData?.cylHydro}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  cylHydro: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                              Spectro Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="spectroProced"
                              value={procedData?.spectroProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  spectroProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              DWTT Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="dwttProced"
                              value={procedData?.dwttProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  dwttProced: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}>
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
                              End facing
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="endFacing"
                              value={procedData?.endFacing}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  endFacing: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12} md={4}>
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
                              Metallog Procedure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="metallogProced"
                              value={procedData?.metallogProced}
                              disabled={true}
                              onChange={(e) => {
                                setProcedData({
                                  ...procedData,
                                  metallogProced: e.target.value?.toUpperCase(),
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
