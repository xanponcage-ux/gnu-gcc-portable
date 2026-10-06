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

export default function LDLTS003GD(props) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandGauge, setExpandGauge] = useState(true);
  const [expandOffBody, setExpandOffBody] = useState(true);
  const [expandOffWeld, setExpandOffWeld] = useState(true);
  const [expandParInsp, setExpandParInsp] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });

  const [gaugeData, setGaugeData] = useState({
    gaugeId: "",
    gaugeRange: "",
    calibDate: "",
    calibDueDate: "",
  });

  const [offBodyUtData, setOffBodyUtData] = useState({
    probDet: "",
    testMode: "",
    refStandAut: "",
    scanSpdBut: "",
    refStandMut: "",
    gain: "",
  });

  const [offWeldUtData, setOffWeldUtData] = useState({
    probDet: "",
    untestAngProb: "",
    refStandAut: "",
    circumTrProb: "",
    refStandMut: "",
    testMode: "",
  });

  const [magPartInspData, setMagPartInspData] = useState({
    currentUsed: "",
    scanSpdAut: "",
    calStand: "",
    medium: "",
    batchConc: "",
    resMagnetism: "",
    technique: "",
    qapNum: "",
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
    setGaugeData((prevState) => ({
      ...prevState,
      gaugeId: "",
      gaugeRange: "",
      calibDate: "",
      calibDueDate: "",
    }));
    setOffBodyUtData((prevState) => ({
      ...prevState,
      probDet: "",
      testMode: "",
      refStandAut: "",
      scanSpdBut: "",
      refStandMut: "",
      gain: "",
    }));
    setOffWeldUtData((prevState) => ({
      ...prevState,
      probDet: "",
      untestAngProb: "",
      refStandAut: "",
      circumTrProb: "",
      refStandMut: "",
      testMode: "",
    }));
    setMagPartInspData((prevState) => ({
      ...prevState,
      currentUsed: "",
      scanSpdAut: "",
      calStand: "",
      medium: "",
      batchConc: "",
      resMagnetism: "",
      technique: "",
      qapNum: "",
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

      const url = "api/LDLTS003/getOrdDetailGD";
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
          setGaugeData((prevState) => ({
            ...prevState,
            gaugeId: res?.data[0]?.TPS_GD_GAUGEID || "",
            gaugeRange: res?.data[0]?.TPS_GD_GAIN_RANGE || "",
            calibDate: res?.data[0]?.TPS_GD_CALDATE || "",
            calibDueDate: res?.data[0]?.TPS_GD_CALDUEDT || "",
          }));
          setOffBodyUtData((prevState) => ({
            ...prevState,
            probDet: res?.data[0]?.TPS_GD_BPROB || "",
            testMode: res?.data[0]?.TPS_GD_TEST_MODE_1 || "",
            refStandAut: res?.data[0]?.TPS_GD_BAUT || "",
            scanSpdBut: res?.data[0]?.TPS_GD_SCAN_SPD_BUT || "",
            refStandMut: res?.data[0]?.TPS_GD_BMUT || "",
            gain: res?.data[0]?.TPS_GD_GAIN || "",
          }));
          setOffWeldUtData((prevState) => ({
            ...prevState,
            probDet: res?.data[0]?.TPS_GD_WPROB || "",
            untestAngProb: res?.data[0]?.TPS_GD_UT_LENANG_PROB || "",
            refStandAut: res?.data[0]?.TPS_GD_WAUT || "",
            circumTrProb: res?.data[0]?.TPS_GD_UT_CIR_LENTR_PROB || "",
            refStandMut: res?.data[0]?.TPS_GD_WMUT || "",
            testMode: res?.data[0]?.TPS_GD_TEST_MODE_2 || "",
          }));
          setMagPartInspData((prevState) => ({
            ...prevState,
            currentUsed: res?.data[0]?.TPS_GD_CUSED || "",
            scanSpdAut: res?.data[0]?.TPS_GD_SCAN_SPD_AUT || "",
            // calStand: res?.data[0]?.TPS_LD_YS_MIN || "",
            medium: res?.data[0]?.TPS_GD_MEDIUM || "",
            batchConc: res?.data[0]?.TPS_GD_BATHCONC || "",
            resMagnetism: res?.data[0]?.TPS_GD_RESIDUAL_MAGNTSM || "",
            technique: res?.data[0]?.TPS_GD_TECHNIQUE || "",
            qapNum: res?.data[0]?.TPS_GD_QAP_NO || "",
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
            {/* Gauge Testing Grid */}
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
                        Gauge Details
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandGauge ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandGauge(!expandGauge)}
                        >
                          {expandGauge ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandGauge && (
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
                              Gauge ID
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="gaugeId"
                              value={gaugeData?.gaugeId}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  gaugeId: e.target.value?.toUpperCase(),
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
                              Calib Date
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="calibDate"
                              value={gaugeData?.calibDate}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  calibDate: e.target.value?.toUpperCase(),
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
                              Gauge Range
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="gaugeRange"
                              value={gaugeData?.gaugeRange}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  gaugeRange: e.target.value?.toUpperCase(),
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
                              Calib.Due Date
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="calibDueDate"
                              value={gaugeData?.calibDueDate}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  calibDueDate: e.target.value?.toUpperCase(),
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

            {/* Offline Body UT Grid */}
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
                        Offline Body UT
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandOffBody ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandOffBody(!expandOffBody)}
                        >
                          {expandOffBody ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandOffBody && (
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
                              Prob Det (MUT-TR)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="probDet"
                              value={offBodyUtData?.probDet}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offBodyUtData,
                                  probDet: e.target.value?.toUpperCase(),
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
                              Testing Mode
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="testMode"
                              value={offBodyUtData?.testMode}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offBodyUtData,
                                  testMode: e.target.value?.toUpperCase(),
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
                              Ref.Standard (AUT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="refStandAut"
                              value={offBodyUtData?.refStandAut}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offBodyUtData,
                                  refStandAut: e.target.value?.toUpperCase(),
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
                              Scan Speed (BUT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="scanSpdBut"
                              value={offBodyUtData?.scanSpdBut}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offBodyUtData,
                                  scanSpdBut: e.target.value?.toUpperCase(),
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
                              Ref.Standard (MUT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="refStandMut"
                              value={offBodyUtData?.refStandMut}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offBodyUtData,
                                  refStandMut: e.target.value?.toUpperCase(),
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
                              Gain
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="gain"
                              value={offBodyUtData?.gain}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offBodyUtData,
                                  gain: e.target.value?.toUpperCase(),
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

            {/* Offline Weld UT Grid */}
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
                        Offline Weld UT
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandOffWeld ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandOffWeld(!expandOffWeld)}
                        >
                          {expandOffWeld ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandOffWeld && (
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
                              Prob Det (MUT-TR)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="probDet"
                              value={offWeldUtData?.probDet}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offWeldUtData,
                                  probDet: e.target.value?.toUpperCase(),
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
                              Untested Length Angle Prob
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="untestAngProb"
                              value={offWeldUtData?.untestAngProb}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offWeldUtData,
                                  untestAngProb: e.target.value?.toUpperCase(),
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
                              Ref.Standard (AUT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="refStandAut"
                              value={offWeldUtData?.refStandAut}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offWeldUtData,
                                  refStandAut: e.target.value?.toUpperCase(),
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
                              Circumference Len TR Probe
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="circumTrProb"
                              value={offWeldUtData?.circumTrProb}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offWeldUtData,
                                  circumTrProb: e.target.value?.toUpperCase(),
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
                              Ref.Standard (MUT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="refStandMut"
                              value={offWeldUtData?.refStandMut}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offWeldUtData,
                                  refStandMut: e.target.value?.toUpperCase(),
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
                              Testing Mode
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="testMode"
                              value={offWeldUtData?.testMode}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...offWeldUtData,
                                  testMode: e.target.value?.toUpperCase(),
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

            {/* Mangnetic Part Insp Grid */}
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
                        Magnetic Particle Inspection
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandParInsp ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandParInsp(!expandParInsp)}
                        >
                          {expandParInsp ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandParInsp && (
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
                              Current Used(A)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="currentUsed"
                              value={magPartInspData?.currentUsed}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  currentUsed: e.target.value?.toUpperCase(),
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
                              Scanning Speed(AUT)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="scanSpdAut"
                              value={magPartInspData?.scanSpdAut}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  scanSpdAut: e.target.value?.toUpperCase(),
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
                              Cal.Standard
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="calStand"
                              value={magPartInspData?.calStand}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  calStand: e.target.value?.toUpperCase(),
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
                              Medium
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="medium"
                              value={magPartInspData?.medium}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  medium: e.target.value?.toUpperCase(),
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
                              Batch Concentrate
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="batchConc"
                              value={magPartInspData?.batchConc}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  batchConc: e.target.value?.toUpperCase(),
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
                              Residual Magnetism
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="resMagnetism"
                              value={magPartInspData?.resMagnetism}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  resMagnetism: e.target.value?.toUpperCase(),
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
                              Technique
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="technique"
                              value={magPartInspData?.technique}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  technique: e.target.value?.toUpperCase(),
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
                              QAP Number
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="qapNum"
                              value={magPartInspData?.qapNum}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...magPartInspData,
                                  qapNum: e.target.value?.toUpperCase(),
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
