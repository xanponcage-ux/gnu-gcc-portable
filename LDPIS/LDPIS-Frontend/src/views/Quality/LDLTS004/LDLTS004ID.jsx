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

export default function LDLTS004ID(props) {
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
  //Instrument Details(Holiday Detector)
  const [holDetData, setHolDetData] = useState({
    TCP_ID_HOLI_DETEC_MIN: "",
    TCP_ID_HOLI_DETEC_MAX: "",
  });
  //Coating Thickness Gauge
  const [coatThickGaugeData, setCoatThickGaugeData] = useState({
    TCP_ID_COAT_THKGAUGE_MIN: "",
    TCP_ID_COAT_THKGAUGE_MAX: "",
  });

  const [roughTesterData, setRoughTesterData] = useState({
    TCP_ID_ROUGH_TEST_MIN: "",
    TCP_ID_ROUGH_TEST_MAX: "",
  });

  const [digiTempData, setDigiTempData] = useState({
    TCP_ID_DIGITEMP_GAUG_MIN: "",
    TCP_ID_DIGITEMP_GAUG_MAX: "",
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
    setHolDetData((prevState) => ({
      ...prevState,
      TCP_ID_HOLI_DETEC_MIN: "",
      TCP_ID_HOLI_DETEC_MAX: "",
    }));
    setCoatThickGaugeData((prevState) => ({
      ...prevState,
      TCP_ID_COAT_THKGAUGE_MIN: "",
      TCP_ID_COAT_THKGAUGE_MAX: "",
    }));
    setRoughTesterData((prevState) => ({
      ...prevState,
      TCP_ID_ROUGH_TEST_MIN: "",
      TCP_ID_ROUGH_TEST_MAX: "",
    }));
    setDigiTempData((prevState) => ({
  ...prevState,
  TCP_ID_DIGITEMP_GAUG_MIN: "",
  TCP_ID_DIGITEMP_GAUG_MAX: "",
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

      const url = "api/LDLTS004/getOrdDetailID";
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

          setHolDetData((prevState) => ({
            ...prevState,
            TCP_ID_HOLI_DETEC_MIN: res?.data[0]?.TCP_ID_HOLI_DETEC_MIN || "",
            TCP_ID_HOLI_DETEC_MAX: res?.data[0]?.TCP_ID_HOLI_DETEC_MAX || "",
          }));

          setCoatThickGaugeData((prevState) => ({
            ...prevState,
            TCP_ID_COAT_THKGAUGE_MIN:
              res?.data[0]?.TCP_ID_COAT_THKGAUGE_MIN || "",
            TCP_ID_COAT_THKGAUGE_MAX:
              res?.data[0]?.TCP_ID_COAT_THKGAUGE_MAX || "",
          }));

          setRoughTesterData((prevState) => ({
            ...prevState,
            TCP_ID_ROUGH_TEST_MIN: res?.data[0]?.TCP_ID_ROUGH_TEST_MIN || "",
            TCP_ID_ROUGH_TEST_MAX: res?.data[0]?.TCP_ID_ROUGH_TEST_MAX || "",
          }));
          setDigiTempData((prevState) => ({
            ...prevState,
            TCP_ID_DIGITEMP_GAUG_MIN:
              res?.data[0]?.TCP_ID_DIGITEMP_GAUG_MIN || "",
            TCP_ID_DIGITEMP_GAUG_MAX:
              res?.data[0]?.TCP_ID_DIGITEMP_GAUG_MAX || "",
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
                        Coating Thickness Gauge
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
                      <Grid item xs={12} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Holiday Detector Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_HOLI_DETEC_MIN"
                              value={holDetData?.TCP_ID_HOLI_DETEC_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_ID_HOLI_DETEC_MIN:
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
                             KV
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Holiday Detector Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_HOLI_DETEC_MAX"
                              value={holDetData?.TCP_ID_HOLI_DETEC_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_ID_HOLI_DETEC_MAX:
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
                             KV
                            </MDTypography>
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
                    <Grid item xs={6}>
                      <MDTypography variant="h6" color="white">
                        Holiday Detector
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
                  <MDBox px={5} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={5}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Coating Thickness Gauge Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_COAT_THKGAUGE_MIN"
                              value={
                                coatThickGaugeData?.TCP_ID_COAT_THKGAUGE_MIN
                              }
                              disabled={true}
                              onChange={(e) => {
                                setCoatThickGaugeData({
                                  ...coatThickGaugeData,
                                  TCP_ID_COAT_THKGAUGE_MIN:
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
                      <Grid item xs={12} md={5}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Coating Thickness Gauge Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_COAT_THKGAUGE_MAX"
                              value={
                                coatThickGaugeData?.TCP_ID_COAT_THKGAUGE_MAX
                              }
                              disabled={true}
                              onChange={(e) => {
                                setCoatThickGaugeData({
                                  ...coatThickGaugeData,
                                  TCP_ID_COAT_THKGAUGE_MAX:
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
                             KV
                            </MDTypography>
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
                        Roughness Tester
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
                      <Grid item xs={12} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Roughness Tester Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_ROUGH_TEST_MIN"
                              value={roughTesterData?.TCP_ID_ROUGH_TEST_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setRoughTesterData({
                                  ...roughTesterData,
                                  TCP_ID_ROUGH_TEST_MIN:
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
                      <Grid item xs={12} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Roughness Tester Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_ROUGH_TEST_MAX"
                              value={roughTesterData?.TCP_ID_ROUGH_TEST_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setRoughTesterData({
                                  ...roughTesterData,
                                  TCP_ID_ROUGH_TEST_MAX:
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
                        Digital Temp. Gauge
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
                      <Grid item xs={12} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Digital Temp.Gauge Min
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_DIGITEMP_GAUG_MIN"
                              value={digiTempData?.TCP_ID_DIGITEMP_GAUG_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setDigiTempData({
                                  ...digiTempData,
                                  TCP_ID_DIGITEMP_GAUG_MIN:
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
                      <Grid item xs={12} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={7}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Digital Temp.Gauge Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="TCP_ID_DIGITEMP_GAUG_MAX"
                              value={digiTempData?.TCP_ID_DIGITEMP_GAUG_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setDigiTempData({
                                  ...digiTempData,
                                  TCP_ID_DIGITEMP_GAUG_MAX:
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
