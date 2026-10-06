// This is for LAB Details code in Process Entry Sheet(External)..

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

export default function LDLTS004FD(props) {
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
    TCP_FD_HOLIDAY_FBE_TEST: "",
    TCP_FD_ADHESION_VCUT_TEST: "",
    TCP_FD_3LPE_HOLIDAY_MIN: "",
    TCP_FD_3LPE_HOLIDAY_MAX: "",
    TCP_FD_PEEL_COLD_TEST: "",
    TCP_FD_PEEL_TEMP_COLD: "",
    TCP_FD_PEEL_TEST_HOT: "",
    TCP_FD_PEEL_TEMP_HOT: "",
    TCP_FD_IMPACT_TEST: "",
    TCP_FD_ENTRAP_TEST: "",
  });
  // //Coating Thickness Gauge
  //   const [coatThickGaugeData, setCoatThickGaugeData] = useState({
  //     TCP_ID_COAT_THKGAUGE_MIN:"",
  //     TCP_ID_COAT_THKGAUGE_MAX:"",
  //   });

  //   const [roughTesterData, setRoughTesterData] = useState({
  //     TCP_ID_ROUGH_TEST_MIN: "",
  //     TCP_ID_ROUGH_TEST_MAX: "",

  //   });

  //   const [digiTempData, setDigiTempData] = useState({
  //     TCP_ID_DIGITEMP_GAUG_MIN: "",
  //     TCP_ID_DIGITEMP_GAUG_MAX: "",
  //   });

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
      TCP_FD_HOLIDAY_FBE_TEST: "",
      TCP_FD_ADHESION_VCUT_TEST: "",
      TCP_FD_3LPE_HOLIDAY_MIN: "",
      TCP_FD_3LPE_HOLIDAY_MAX: "",
      TCP_FD_PEEL_COLD_TEST: "",
      TCP_FD_PEEL_TEMP_COLD: "",
      TCP_FD_PEEL_TEST_HOT: "",
      TCP_FD_PEEL_TEMP_HOT: "",
      TCP_FD_IMPACT_TEST: "",
      TCP_FD_ENTRAP_TEST: "",
    }));
    // setCoatThickGaugeData((prevState) => ({
    //   ...prevState,
    //   TCP_ID_COAT_THKGAUGE_MIN:"",
    //   TCP_ID_COAT_THKGAUGE_MAX:"",
    // }));
    // setRoughTesterData((prevState) => ({
    //   ...prevState,
    //   TCP_ID_ROUGH_TEST_MIN: "",
    //   TCP_ID_ROUGH_TEST_MAX: "",
    // }));
    // setRoughTesterData((prevState) => ({
    //   ...prevState,
    //   TCP_ID_DIGITEMP_GAUG_MIN: "",
    // TCP_ID_DIGITEMP_GAUG_MAX: "",
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
            TCP_FD_HOLIDAY_FBE_TEST: res?.data[0]?.TCP_FD_HOLIDAY_FBE_TEST,
            TCP_FD_ADHESION_VCUT_TEST: res?.data[0]?.TCP_FD_ADHESION_VCUT_TEST,
            TCP_FD_3LPE_HOLIDAY_MIN: res?.data[0]?.TCP_FD_3LPE_HOLIDAY_MIN,
            TCP_FD_3LPE_HOLIDAY_MAX: res?.data[0]?.TCP_FD_3LPE_HOLIDAY_MAX,
            TCP_FD_PEEL_COLD_TEST: res?.data[0]?.TCP_FD_PEEL_COLD_TEST,
            TCP_FD_PEEL_TEMP_COLD: res?.data[0]?.TCP_FD_PEEL_TEMP_COLD,
            TCP_FD_PEEL_TEST_HOT: res?.data[0]?.TCP_FD_PEEL_TEST_HOT,
            TCP_FD_PEEL_TEMP_HOT: res?.data[0]?.TCP_FD_PEEL_TEMP_HOT,
            TCP_FD_IMPACT_TEST: res?.data[0]?.TCP_FD_IMPACT_TEST,
            TCP_FD_ENTRAP_TEST: res?.data[0]?.TCP_FD_ENTRAP_TEST,
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
                        Partially Coated and 3LPE Testing
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
                              FBE Holiday Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_HOLIDAY_FBE_TEST"
                              value={holDetData?.TCP_FD_HOLIDAY_FBE_TEST}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_HOLIDAY_FBE_TEST:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              // style={{ marginRight: "5rem" }}
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
                             Voltage
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={4}></Grid>
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
                              Adhession V Cut Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_ADHESION_VCUT_TEST"
                              value={holDetData?.TCP_FD_ADHESION_VCUT_TEST}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_ADHESION_VCUT_TEST:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "0rem" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}></Grid>
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
                              3LPE Holiday (Min)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_3LPE_HOLIDAY_MIN"
                              value={holDetData?.TCP_FD_3LPE_HOLIDAY_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_3LPE_HOLIDAY_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "0rem" }}
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
                             KV
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
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_3LPE_HOLIDAY_MAX"
                              value={holDetData?.TCP_FD_3LPE_HOLIDAY_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_3LPE_HOLIDAY_MAX:
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
                             KV
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}></Grid>
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
                              Peel Test ( Cold )
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_PEEL_COLD_TEST"
                              value={holDetData?.TCP_FD_PEEL_COLD_TEST}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_PEEL_COLD_TEST:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "0rem" }}
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
                            N/mm
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
                              Temp(°C)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_PEEL_TEMP_COLD"
                              value={holDetData?.TCP_FD_PEEL_TEMP_COLD}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_PEEL_TEMP_COLD:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}></Grid>
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
                              Peel Test ( Hot )
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_PEEL_TEST_HOT"
                              value={holDetData?.TCP_FD_PEEL_TEST_HOT}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_PEEL_TEST_HOT:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "0rem" }}
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
                            N/mm
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
                              Temp(°C)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_PEEL_TEMP_HOT"
                              value={holDetData?.TCP_FD_PEEL_TEMP_HOT}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_PEEL_TEMP_HOT:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={3}></Grid>
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
                              Impact Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_IMPACT_TEST"
                              value={holDetData?.TCP_FD_IMPACT_TEST}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_IMPACT_TEST:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "0rem" }}
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
                              Air Entrapment Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_FD_ENTRAP_TEST"
                              value={holDetData?.TCP_FD_ENTRAP_TEST}
                              disabled={true}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  TCP_FD_ENTRAP_TEST:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "0rem" }}
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
