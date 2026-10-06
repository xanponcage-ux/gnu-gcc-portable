// This is for LAB Details code in Lab Test(External)..

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
import MonthPicker from "components/DateTime/DatePicker";
let fdHolDetData=null;
export default function LDLTS005FD(props) {
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
    PSNO: "1",
    LCP_DOC_TEST1:"",
    LCP_DOC_TEST2:"",
    LCP_DOC_TEST3:"",
    LCP_DOC_TEST4:"",
    LCP_TAG_TEST1:"",
    LCP_TAG_TEST2:"",
    LCP_TAG_TEST3:"",
    LCP_TAG_TEST4:"",
    LCP_DOC_REMARKS:"",
    LCP_DOC_INS_NAME:"",
    LCP_DOC_INS_ID:"",
    LCP_DOC_WINO:"",
    LCP_SDATE_24H1:"",
    LCP_STIME_24H1:"",
    LCP_EDATE_24H1:"",
    LCP_ETIME_24H1:"",
    LCP_ADHT_MIN:"",
    LCP_ADHT_MIN_1:"",
    LCP_ADHT_MIN_2:"",
    LCP_H24_INS_NAME:"",
    LCP_H24_INS_ID:"",
    LCP_ADH24_WINO:"",
    LCP_CROSS_SECTION1:"",
    LCP_CROSS_SECTION2:"",
    LCP_INTERFACE1:"",
    LCP_INTERFACE2:"",
    LCP_PRO_INS_NAME:"",
    LCP_FLX_INS_ID:"",
    LCP_PORP_WINO:"",
    LCP_FLEXTEST1:"",
    LCP_FLEXTEST2:"",
    LCP_FLEXTEST3:"",
    LCP_FLEXTEST4:"",
    LCP_FLEXTEST5:"",
    LCP_FLX_INS_NAME:"",
    LCP_PRO_INS_ID:"",
    LCP_FLEX_WINO:"",
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
        if (props.ordId ) {
          handleDisplay(props.ordId,"");
        }
      });
    }
    fetchData();
  }, [props.ordId]);

  const handleClearAll = () => {
    // setFilterData((prevState) => ({
    //   ...prevState,
    //   saleOrd: null,
    //   item: null,
    //   delCond: null,
    // }));
    setHolDetData((prevState) => ({
      ...prevState,
      PSNO: "1",
      LCP_DOC_TEST1:"",
      LCP_DOC_TEST2:"",
      LCP_DOC_TEST3:"",
      LCP_DOC_TEST4:"",
      LCP_TAG_TEST1:"",
      LCP_TAG_TEST2:"",
      LCP_TAG_TEST3:"",
      LCP_TAG_TEST4:"",
      LCP_DOC_REMARKS:"",
      LCP_DOC_INS_NAME:"",
      LCP_DOC_INS_ID:"",
      LCP_DOC_WINO:"",
      LCP_SDATE_24H1:"",
      LCP_STIME_24H1:"",
      LCP_EDATE_24H1:"",
      LCP_ETIME_24H1:"",
      LCP_ADHT_MIN:"",
      LCP_ADHT_MIN_1:"",
      LCP_ADHT_MIN_2:"",
      LCP_H24_INS_NAME:"",
      LCP_H24_INS_ID:"",
      LCP_ADH24_WINO:"",
      LCP_CROSS_SECTION1:"",
      LCP_CROSS_SECTION2:"",
      LCP_INTERFACE1:"",
      LCP_INTERFACE2:"",
      LCP_PRO_INS_NAME:"",
      LCP_FLX_INS_ID:"",
      LCP_PORP_WINO:"",
      LCP_FLEXTEST1:"",
      LCP_FLEXTEST2:"",
      LCP_FLEXTEST3:"",
      LCP_FLEXTEST4:"",
      LCP_FLEXTEST5:"",
      LCP_FLX_INS_NAME:"",
      LCP_PRO_INS_ID:"",
      LCP_FLEX_WINO:"",
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
    if (ordId === "" ) {
      handleClearAll();
    }

    let data1 = {
      orderId: ordId,
      itemNo: "",
    };

    GetAuthorization().then((token) => {
      //   validateUser(token);
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS005/getOrdDetailID";
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
            PSNO: res?.data[0]?.PSNO,
            LCP_DOC_TEST1: res?.data[0]?.LCP_DOC_TEST1,
            LCP_DOC_TEST2: res?.data[0]?.LCP_DOC_TEST2,
            LCP_DOC_TEST3: res?.data[0]?.LCP_DOC_TEST3,
            LCP_DOC_TEST4: res?.data[0]?.LCP_DOC_TEST4,
            LCP_TAG_TEST1: res?.data[0]?.LCP_TAG_TEST1,
            LCP_TAG_TEST2: res?.data[0]?.LCP_TAG_TEST2,
            LCP_TAG_TEST3: res?.data[0]?.LCP_TAG_TEST3,
            LCP_TAG_TEST4: res?.data[0]?.LCP_TAG_TEST4,
            LCP_DOC_REMARKS: res?.data[0]?.LCP_DOC_REMARKS,
            LCP_DOC_INS_NAME: res?.data[0]?.LCP_DOC_INS_NAME,
            LCP_DOC_INS_ID: res?.data[0]?.LCP_DOC_INS_ID,
            LCP_DOC_WINO: res?.data[0]?.LCP_DOC_WINO,
            LCP_SDATE_24H1: res?.data[0]?.LCP_SDATE_24H1,
            LCP_STIME_24H1: res?.data[0]?.LCP_STIME_24H1,
            LCP_EDATE_24H1: res?.data[0]?.LCP_EDATE_24H1,
            LCP_ETIME_24H1: res?.data[0]?.LCP_ETIME_24H1,
            LCP_ADHT_MIN: res?.data[0]?.LCP_ADHT_MIN,
            LCP_ADHT_MIN_1: res?.data[0]?.LCP_ADHT_MIN_1,
            LCP_ADHT_MIN_2: res?.data[0]?.LCP_ADHT_MIN_2,
            LCP_H24_INS_NAME: res?.data[0]?.LCP_H24_INS_NAME,
            LCP_H24_INS_ID: res?.data[0]?.LCP_H24_INS_ID,
            LCP_ADH24_WINO: res?.data[0]?.LCP_ADH24_WINO,
            LCP_CROSS_SECTION1: res?.data[0]?.LCP_CROSS_SECTION1,
            LCP_CROSS_SECTION2: res?.data[0]?.LCP_CROSS_SECTION2,
            LCP_INTERFACE1: res?.data[0]?.LCP_INTERFACE1,
            LCP_INTERFACE2: res?.data[0]?.LCP_INTERFACE2,
            LCP_PRO_INS_NAME: res?.data[0]?.LCP_PRO_INS_NAME,
            LCP_FLX_INS_ID: res?.data[0]?.LCP_FLX_INS_ID,
            LCP_PORP_WINO: res?.data[0]?.LCP_PORP_WINO,
            LCP_FLEXTEST1: res?.data[0]?.LCP_FLEXTEST1,
            LCP_FLEXTEST2: res?.data[0]?.LCP_FLEXTEST2,
            LCP_FLEXTEST3: res?.data[0]?.LCP_FLEXTEST3,
            LCP_FLEXTEST4: res?.data[0]?.LCP_FLEXTEST4,
            LCP_FLEXTEST5: res?.data[0]?.LCP_FLEXTEST5,
            LCP_FLX_INS_NAME: res?.data[0]?.LCP_FLX_INS_NAME,
            LCP_PRO_INS_ID: res?.data[0]?.LCP_PRO_INS_ID,
            LCP_FLEX_WINO: res?.data[0]?.LCP_FLEX_WINO,
          })        
          );
          console.log(holDetData)
        })
         .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };
  
  useEffect(() => {
    fdHolDetData = holDetData;
  }, [holDetData]); 


  const formatDateTimeLocal = (value) => {
    if (!value) return "";

    const dt = new Date(value);

    if (isNaN(dt.getTime())) return "";

    return new Date(
      dt.getTime() - dt.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
  };
  

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Lab Test(External)"
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
                        Degree of Cure
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
                      
               
                    <Grid item xs={8} md={8}>
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
                              Degree of Cure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_TEST1"
                              value={holDetData?.LCP_DOC_TEST1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_TEST1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                      <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_TEST2"
                              value={holDetData?.LCP_DOC_TEST2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_TEST2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_TEST3"
                              value={holDetData?.LCP_DOC_TEST3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_TEST3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                       <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_TEST4"
                              value={holDetData?.LCP_DOC_TEST4}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_TEST4: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                     <Grid item xs={4} md={4}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_INS_NAME"
                              value={holDetData?.LCP_DOC_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                    <Grid item xs={8} md={8}>
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
                              Delta Tg Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_TAG_TEST1"
                              value={holDetData?.LCP_TAG_TEST1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_TAG_TEST1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                           <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_TAG_TEST2"
                              value={holDetData?.LCP_TAG_TEST2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_TAG_TEST2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_TAG_TEST3"
                              value={holDetData?.LCP_TAG_TEST3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_TAG_TEST3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="LCP_TAG_TEST4"
                              value={holDetData?.LCP_TAG_TEST4}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_TAG_TEST4: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>

                        </Grid>
                      </Grid>
                   <Grid item xs={4} md={4}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_INS_ID"
                              value={holDetData?.LCP_DOC_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                    <Grid item xs={8} md={8}>
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
                              Remarks
                            </MDTypography>
                          </Grid>
                          <Grid item xs={10}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_REMARKS"
                              value={holDetData?.LCP_DOC_REMARKS}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_REMARKS: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={4} md={4}>
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
                              Procedure /WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_DOC_WINO"
                              value={holDetData?.LCP_DOC_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_DOC_WINO: e.target.value?.toUpperCase(),
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
                        24 Hour Adhesion Test
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
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


                    <Grid item xs={8} md={8}>
                        <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={3.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              
                            </MDTypography>
                          </Grid>
                          <Grid item xs={4.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Start Date and Time
                            </MDTypography>
                          </Grid>
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
                               End Date and Time
                            </MDTypography>
                          </Grid>

                        </Grid>
                      </Grid>
                      <Grid item xs={4} md={4}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_H24_INS_NAME"
                              value={holDetData?.LCP_H24_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_H24_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                    <Grid item xs={8} md={8}>
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
                              24 Hour Test
                            </MDTypography>
                          </Grid>
<Grid item xs={5}>
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={4}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        textTransform="capitalize"
        variant="h6"
        color={"dark"}
        noWrap
      >
      </MDTypography>
    </Grid>

    <Grid item xs={6}>
<MDInput
  type="datetime-local"
  value={formatDateTimeLocal(holDetData?.LCP_SDATE_24H1)}
onChange={(e) => {
  const dateTimeValue = e.target.value;

  setHolDetData((prev) => ({
    ...prev,
    LCP_SDATE_24H1: dateTimeValue,
    LCP_STIME_24H1: dateTimeValue
      ? dateTimeValue.substring(11, 16)
      : "",
  }));
}}
/>
    </Grid>
  </Grid>
</Grid>
<Grid item xs={3}>
  <Grid container alignItems="center" spacing={1}>
    <Grid item xs={4}>
      <MDTypography
        fontWeight="regular"
        fontSize="small"
        textTransform="capitalize"
        variant="h6"
        color={"dark"}
        noWrap
      >
      </MDTypography>
    </Grid>

    <Grid item xs={6}>
<MDInput
  type="datetime-local"
  value={formatDateTimeLocal(holDetData?.LCP_EDATE_24H1)}
onChange={(e) => {
  const dateTimeValue = e.target.value;

  setHolDetData((prev) => ({
    ...prev,
    LCP_EDATE_24H1: dateTimeValue,
    LCP_ETIME_24H1: dateTimeValue
      ? dateTimeValue.substring(11, 16)
      : "",
  }));
}}
/>
    </Grid>
  </Grid>
</Grid>
                        </Grid>
                      </Grid>
                                          <Grid item xs={4} md={4}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_H24_INS_ID"
                              value={holDetData?.LCP_H24_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_H24_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={8} md={8}>
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
                              24 Hour Adhesion
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3.1}>
                            <MDInput
                              fullWidth
                              id="LCP_ADHT_MIN"
                              value={holDetData?.LCP_ADHT_MIN}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_ADHT_MIN: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                       <Grid item xs={3.1}>
                            <MDInput
                              fullWidth
                              id="LCP_ADHT_MIN_1"
                              value={holDetData?.LCP_ADHT_MIN_1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_ADHT_MIN_1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                     <Grid item xs={3.2}>
                            <MDInput
                              fullWidth
                              id="LCP_ADHT_MIN_2"
                              value={holDetData?.LCP_ADHT_MIN_2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_ADHT_MIN_2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>


                    <Grid item xs={4} md={4}>
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_ADH24_WINO"
                              value={holDetData?.LCP_ADH24_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_ADH24_WINO: e.target.value?.toUpperCase(),
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
                        Porosity Test
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
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
                      

                    <Grid item xs={8} md={8}>
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
                              Cross Section 1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={10}>
                            <MDInput
                              fullWidth
                              id="LCP_CROSS_SECTION1"
                              value={holDetData?.LCP_CROSS_SECTION1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_CROSS_SECTION1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

             <Grid item xs={4} md={4}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_PRO_INS_NAME"
                              value={holDetData?.LCP_PRO_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_PRO_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                    <Grid item xs={8} md={8}>
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
                              Cross Section 2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={10}>
                            <MDInput
                              fullWidth
                              id="LCP_CROSS_SECTION2"
                              value={holDetData?.LCP_CROSS_SECTION2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_CROSS_SECTION2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                                          <Grid item xs={4} md={4}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_PRO_INS_ID"
                              value={holDetData?.LCP_PRO_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_PRO_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={8} md={8}>
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
                              Interface Poros1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={10}>
                            <MDInput
                              fullWidth
                              id="LCP_INTERFACE1"
                              value={holDetData?.LCP_INTERFACE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_INTERFACE1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4} md={4}>
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_PORP_WINO"
                              value={holDetData?.LCP_PORP_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_PORP_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid> 
                    <Grid item xs={8} md={8}>
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
                              Interface Poros2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={10}>
                            <MDInput
                              fullWidth
                              id="LCP_INTERFACE2"
                              value={holDetData?.LCP_INTERFACE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_INTERFACE2: e.target.value?.toUpperCase(),
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
                        Flexibility Report Test FBE
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
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
                      
                    <Grid item xs={4} md={4}>
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
                              Flexibilty Test1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LCP_FLEXTEST1"
                              value={holDetData?.LCP_FLEXTEST1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLEXTEST1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
          <Grid item xs={4} md={4}>
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
                              Flexibilty Test4
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="LCP_FLEXTEST4"
                              value={holDetData?.LCP_FLEXTEST4}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLEXTEST4: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4} md={4}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_FLX_INS_NAME"
                              value={holDetData?.LCP_FLX_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLX_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={4} md={4}>
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
                              Flexibilty Test2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LCP_FLEXTEST2"
                              value={holDetData?.LCP_FLEXTEST2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLEXTEST2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                 <Grid item xs={4} md={4}>
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
                              Flexibilty Test5
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="LCP_FLEXTEST5"
                              value={holDetData?.LCP_FLEXTEST5}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLEXTEST5: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                   <Grid item xs={4} md={4}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_FLX_INS_ID"
                              value={holDetData?.LCP_FLX_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLX_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={4} md={4}>
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
                              Flexibilty Test3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LCP_FLEXTEST3"
                              value={holDetData?.LCP_FLEXTEST3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLEXTEST3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
          <Grid item xs={4} md={4}>
                       
                      </Grid>
                    <Grid item xs={4} md={4}>
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
                              Procedure /WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LCP_FLEX_WINO"
                              value={holDetData?.LCP_FLEX_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LCP_FLEX_WINO: e.target.value?.toUpperCase(),
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
export {  fdHolDetData };