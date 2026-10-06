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

export default function LDLTS004GD(props) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandGauge, setExpandGauge] = useState(true);
  const [expCoatPipe, setExpCoatPipe] = useState(true);
  const [expFinCoat, setExpFinCoat] = useState(true);
  const [expandParInsp, setExpandParInsp] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });

  const [gaugeData, setGaugeData] = useState({
    TCP_CP2_AFWATEMP_QUEN_MIN: "",
    TCP_CP2_AFWATEMP_QUEN_MAX: "",
    TCP_CP2_ADHE_THICK_MIN: "",
    TCP_CP2_ADHE_THICK_MAX: "",
    TCP_CP2_CTHICK_EPOXY_MIN: "",
    TCP_CP2_CTHICK_EPOXY_MAX: "",
    TCP_CP2_TOT_CTHICK_MIN: "",
    TCP_CP2_TOT_CTHICK_MAX: "",
    TCP_CP2_TEMP_AQUEN_MIN: "",
    TCP_CP2_TEMP_AQUEN_MAX: "",
    TCP_CP2_VS_INSP_CPIPE: "",
    TCP_CP2_CUT_BACK_MIN: "",
    TCP_CP2_CUT_BACK_MAX: "",
    TCP_CP2_EPOXY_BND_MIN: "",
    TCP_CP2_EPOXY_BND_MAX: "",
    TCP_CP2_BEVEL_ANGLE_MIN: "",
    TCP_CP2_BEVEL_ANGLE_MAX: "",
    TCP_CP2_BARCODE: "",
    TCP_CP2_STENCILLING_MARK: "",
    TCP_CP2_COLOR_CODE: "",
    TCP_CP2_LOW_STRES_PUNCH: "",
    TCP_CP2_COATING_REPAIR: "",
    TCP_CP2_PIPE_IDENTIF: "",
    TCP_CP2_VIS_CHECK: "",
    TCP_CP2_RESU_MG: "",
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
      TCP_CP2_AFWATEMP_QUEN_MIN: "",
      TCP_CP2_AFWATEMP_QUEN_MAX: "",
      TCP_CP2_ADHE_THICK_MIN: "",
      TCP_CP2_ADHE_THICK_MAX: "",
      TCP_CP2_CTHICK_EPOXY_MIN: "",
      TCP_CP2_CTHICK_EPOXY_MAX: "",
      TCP_CP2_TOT_CTHICK_MIN: "",
      TCP_CP2_TOT_CTHICK_MAX: "",
      TCP_CP2_TEMP_AQUEN_MIN: "",
      TCP_CP2_TEMP_AQUEN_MAX: "",
      TCP_CP2_VS_INSP_CPIPE: "",
      TCP_CP2_CUT_BACK_MIN: "",
      TCP_CP2_CUT_BACK_MAX: "",
      TCP_CP2_EPOXY_BND_MIN: "",
      TCP_CP2_EPOXY_BND_MAX: "",
      TCP_CP2_BEVEL_ANGLE_MIN: "",
      TCP_CP2_BEVEL_ANGLE_MAX: "",
      TCP_CP2_BARCODE: "",
      TCP_CP2_STENCILLING_MARK: "",
      TCP_CP2_COLOR_CODE: "",
      TCP_CP2_LOW_STRES_PUNCH: "",
      TCP_CP2_COATING_REPAIR: "",
      TCP_CP2_PIPE_IDENTIF: "",
      TCP_CP2_VIS_CHECK: "",
      TCP_CP2_RESU_MG: "",
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

      const url = "api/LDLTS004/getOrdDetailGD";
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
            TCP_CP2_AFWATEMP_QUEN_MIN: res?.data[0]?.TCP_CP2_AFWATEMP_QUEN_MIN,
            TCP_CP2_AFWATEMP_QUEN_MAX: res?.data[0]?.TCP_CP2_AFWATEMP_QUEN_MAX,
            TCP_CP2_ADHE_THICK_MIN: res?.data[0]?.TCP_CP2_ADHE_THICK_MIN,
            TCP_CP2_ADHE_THICK_MAX: res?.data[0]?.TCP_CP2_ADHE_THICK_MAX,
            TCP_CP2_CTHICK_EPOXY_MIN: res?.data[0]?.TCP_CP2_CTHICK_EPOXY_MIN,
            TCP_CP2_CTHICK_EPOXY_MAX: res?.data[0]?.TCP_CP2_CTHICK_EPOXY_MAX,
            TCP_CP2_TOT_CTHICK_MIN: res?.data[0]?.TCP_CP2_TOT_CTHICK_MIN,
            TCP_CP2_TOT_CTHICK_MAX: res?.data[0]?.TCP_CP2_TOT_CTHICK_MAX,
            TCP_CP2_TEMP_AQUEN_MIN: res?.data[0]?.TCP_CP2_TEMP_AQUEN_MIN,
            TCP_CP2_TEMP_AQUEN_MAX: res?.data[0]?.TCP_CP2_TEMP_AQUEN_MAX,
            TCP_CP2_VS_INSP_CPIPE: res?.data[0]?.TCP_CP2_VS_INSP_CPIPE,
            TCP_CP2_CUT_BACK_MIN: res?.data[0]?.TCP_CP2_CUT_BACK_MIN,
            TCP_CP2_CUT_BACK_MAX: res?.data[0]?.TCP_CP2_CUT_BACK_MAX,
            TCP_CP2_EPOXY_BND_MIN: res?.data[0]?.TCP_CP2_EPOXY_BND_MIN,
            TCP_CP2_EPOXY_BND_MAX: res?.data[0]?.TCP_CP2_EPOXY_BND_MAX,
            TCP_CP2_BEVEL_ANGLE_MIN: res?.data[0]?.TCP_CP2_BEVEL_ANGLE_MIN,
            TCP_CP2_BEVEL_ANGLE_MAX: res?.data[0]?.TCP_CP2_BEVEL_ANGLE_MAX,
            TCP_CP2_BARCODE: res?.data[0]?.TCP_CP2_BARCODE,
            TCP_CP2_STENCILLING_MARK: res?.data[0]?.TCP_CP2_STENCILLING_MARK,
            TCP_CP2_COLOR_CODE: res?.data[0]?.TCP_CP2_COLOR_CODE,
            TCP_CP2_LOW_STRES_PUNCH: res?.data[0]?.TCP_CP2_LOW_STRES_PUNCH,
            TCP_CP2_COATING_REPAIR: res?.data[0]?.TCP_CP2_COATING_REPAIR,
            TCP_CP2_PIPE_IDENTIF: res?.data[0]?.TCP_CP2_PIPE_IDENTIF,
            TCP_CP2_VIS_CHECK: res?.data[0]?.TCP_CP2_VIS_CHECK,
            TCP_CP2_RESU_MG: res?.data[0]?.TCP_CP2_RESU_MG,
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
            {/* Thickness of Coating Pipe */}
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
                        Thickness of Coating Pipe
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expCoatPipe ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpCoatPipe(!expCoatPipe)}
                        >
                          {expCoatPipe ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expCoatPipe && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={3}>
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
                              Water Temp Quench
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
                              After
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_AFWATEMP_QUEN_MIN"
                              value={gaugeData?.TCP_CP2_AFWATEMP_QUEN_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_AFWATEMP_QUEN_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
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
                              Before
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_AFWATEMP_QUEN_MAX"
                              value={gaugeData?.TCP_CP2_AFWATEMP_QUEN_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_AFWATEMP_QUEN_MAX:
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
                              Adhesive Thickness
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_ADHE_THICK_MIN"
                              value={gaugeData?.TCP_CP2_ADHE_THICK_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_ADHE_THICK_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
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
                              id="TCP_CP2_ADHE_THICK_MAX"
                              value={gaugeData?.TCP_CP2_ADHE_THICK_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_ADHE_THICK_MAX:
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

                      <Grid item xs={12} md={3}>
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
                              Coat Epoxy Thickness
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_CTHICK_EPOXY_MIN"
                              value={gaugeData?.TCP_CP2_CTHICK_EPOXY_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_CTHICK_EPOXY_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
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
                              id="TCP_CP2_CTHICK_EPOXY_MAX"
                              value={gaugeData?.TCP_CP2_CTHICK_EPOXY_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_CTHICK_EPOXY_MAX:
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
                      <Grid item xs={12} md={3}>
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
                              Total Coating Thick
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_TOT_CTHICK_MIN"
                              value={gaugeData?.TCP_CP2_TOT_CTHICK_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_TOT_CTHICK_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
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
                              id="TCP_CP2_TOT_CTHICK_MAX"
                              value={gaugeData?.TCP_CP2_TOT_CTHICK_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_TOT_CTHICK_MAX:
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
                              mm
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={12}>
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
                              Visual Inspection
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_VS_INSP_CPIPE"
                              value={gaugeData?.TCP_CP2_VS_INSP_CPIPE}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_VS_INSP_CPIPE:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
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
                              Pipe temp.after Quenching
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
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_TEMP_AQUEN_MIN"
                              value={gaugeData?.TCP_CP2_TEMP_AQUEN_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_TEMP_AQUEN_MIN:
                                    e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid
                          container
                          alignItems="center"
                          spacing={1}
                          style={{ display: "flex", flexDirection: "row" }}
                        >
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
                              Max
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_TEMP_AQUEN_MAX"
                              value={gaugeData?.TCP_CP2_TEMP_AQUEN_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_TEMP_AQUEN_MAX:
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

            {/* Final Coating */}
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
                        Final Coating
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expFinCoat ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpFinCoat(!expFinCoat)}
                        >
                          {expFinCoat ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expFinCoat && (
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
                              Barcode Level
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_BARCODE"
                              value={gaugeData?.TCP_CP2_BARCODE}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_BARCODE:
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
                              Stencil/Marking
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9.5}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_STENCILLING_MARK"
                              value={gaugeData?.TCP_CP2_STENCILLING_MARK}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_STENCILLING_MARK:
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
                              Color Band
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_COLOR_CODE"
                              value={gaugeData?.TCP_CP2_COLOR_CODE}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_COLOR_CODE:
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
                              Indentation Temperature (Room)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_PIPE_IDENTIF"
                              value={gaugeData?.TCP_CP2_PIPE_IDENTIF}
                              disabled={true}
                              
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_PIPE_IDENTIF:
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
                              Indentation Temp. (Hot)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_LOW_STRES_PUNCH"
                              value={gaugeData?.TCP_CP2_LOW_STRES_PUNCH}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_LOW_STRES_PUNCH:
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
                              visual check
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_VIS_CHECK"
                              value={gaugeData?.TCP_CP2_VIS_CHECK}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_VIS_CHECK:
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
                              Coating Repair
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_COATING_REPAIR"
                              value={gaugeData?.TCP_CP2_COATING_REPAIR}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_COATING_REPAIR:
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
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_RESU_MG"
                              value={gaugeData?.TCP_CP2_RESU_MG}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_RESU_MG:
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
                              Cut Back (mm)
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
                              id="TCP_CP2_CUT_BACK_MIN"
                              value={gaugeData?.TCP_CP2_CUT_BACK_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_CUT_BACK_MIN:
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
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_CUT_BACK_MAX"
                              value={gaugeData?.TCP_CP2_CUT_BACK_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_CUT_BACK_MAX:
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
                              Epoxy Band(mm)
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
                              id="TCP_CP2_EPOXY_BND_MIN"
                              value={gaugeData?.TCP_CP2_EPOXY_BND_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_EPOXY_BND_MIN:
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
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_EPOXY_BND_MAX"
                              value={gaugeData?.TCP_CP2_EPOXY_BND_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_EPOXY_BND_MAX:
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
                              Bevel Angel°
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
                              id="TCP_CP2_BEVEL_ANGLE_MIN"
                              value={gaugeData?.TCP_CP2_BEVEL_ANGLE_MIN}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_BEVEL_ANGLE_MIN:
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
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="TCP_CP2_BEVEL_ANGLE_MAX"
                              value={gaugeData?.TCP_CP2_BEVEL_ANGLE_MAX}
                              disabled={true}
                              onChange={(e) => {
                                setGaugeData({
                                  ...gaugeData,
                                  TCP_CP2_BEVEL_ANGLE_MAX:
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
          </Grid>
        </MDBox>
      </>
    </DashboardLayout>
  );
}
