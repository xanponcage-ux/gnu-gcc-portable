// This is for LAB Details code in Lab Test..

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
let idHolDetData=null;
export default function LDLTS005ID(props) {
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

  const [holDetData, setHolDetData] = useState({
    PSNO: "1",
        //     PRD_DATE_120: "",
        // PRD_SHIFT_120: "",
    CDT_SDATE_CATH1: "",
    CDT_STIME_CATH1: "",
    CDT_EDATE_CATH1: "",
    CDT_ETIME_CATH1: "",
    CDT_CD_MIN: "",
    CDT_CDTEST_28D_30DH: "",
    CDT_RAW_MAT1: "",
    CDT_RAW_MAT2: "",
    CDT_RAW_MAT3: "",
    CDT_MFACTURE1: "",
    CDT_MFACTURE2: "",
    CDT_MFACTURE3: "",
    CDT_DSB_INS_NAME: "",
    CDT_DSB_INS_ID: "",
    CDT_DISBOND_WINO: "",
    CDT_BATCH1: "",
    CDT_BATCH2: "",
    CDT_BATCH3: "",
    CDT_GRADE1: "",
    CDT_GRADE2: "",
    CDT_GRADE3: "",
    CDT_TENSILE: "",
    CDT_TAN_INS_NAME: "",
    CDT_TAN_INS_ID: "",
    CDT_TENSIL_WINO: "",
    CDT_HARDNESS: "",
    CDT_HRD_INS_NAME: "",
    CDT_HRD_INS_ID: "",
    CDT_HARD_WINO: "",
    CDT_PRDSTABL_MIN: "",
    CDT_STB_INS_NAME: "",
    CDT_STB_INS_ID: "",
    CDT_STABILITY_WINO: ""

  });

  

  useEffect(() => {
    console.log("Inside sales details");
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
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
        //        PRD_DATE_120: "",
        // PRD_SHIFT_120: "",
      CDT_SDATE_CATH1: "",
CDT_STIME_CATH1: "",
CDT_EDATE_CATH1: "",
CDT_ETIME_CATH1: "",
CDT_CD_MIN: "",
CDT_CDTEST_28D_30DH: "",
CDT_RAW_MAT1: "",
CDT_RAW_MAT2: "",
CDT_RAW_MAT3: "",
CDT_MFACTURE1: "",
CDT_MFACTURE2: "",
CDT_MFACTURE3: "",
CDT_DSB_INS_NAME: "",
CDT_DSB_INS_ID: "",
CDT_DISBOND_WINO: "",
CDT_BATCH1: "",
CDT_BATCH2: "",
CDT_BATCH3: "",
CDT_GRADE1: "",
CDT_GRADE2: "",
CDT_GRADE3: "",
CDT_TENSILE: "",
CDT_TAN_INS_NAME: "",
CDT_TAN_INS_ID: "",
CDT_TENSIL_WINO: "",
CDT_HARDNESS: "",
CDT_HRD_INS_NAME: "",
CDT_HRD_INS_ID: "",
CDT_HARD_WINO: "",
CDT_PRDSTABL_MIN: "",
CDT_STB_INS_NAME: "",
CDT_STB_INS_ID: "",
CDT_STABILITY_WINO: "",
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

      const url = "api/LDLTS005/getOrdDetailGD";
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
          setHolDetData((prevState) => ({
            ...prevState,
            PSNO: res?.data[0]?.PSNO,
            //             PRD_DATE_120: res?.data[0]?.PRD_DATE_120,
            // PRD_SHIFT_120: res?.data[0]?.PRD_SHIFT_120,
               CDT_SDATE_CATH1:res?.data[0]?.CDT_SDATE_CATH1,
               CDT_STIME_CATH1:res?.data[0]?.CDT_STIME_CATH1,
               CDT_EDATE_CATH1:res?.data[0]?.CDT_EDATE_CATH1,
               CDT_ETIME_CATH1:res?.data[0]?.CDT_ETIME_CATH1,
               CDT_CD_MIN:res?.data[0]?.CDT_CD_MIN,
               CDT_CDTEST_28D_30DH:res?.data[0]?.CDT_CDTEST_28D_30DH,
               CDT_RAW_MAT1:res?.data[0]?.CDT_RAW_MAT1,
               CDT_RAW_MAT2:res?.data[0]?.CDT_RAW_MAT2,
               CDT_RAW_MAT3:res?.data[0]?.CDT_RAW_MAT3,
               CDT_MFACTURE1:res?.data[0]?.CDT_MFACTURE1,
               CDT_MFACTURE2:res?.data[0]?.CDT_MFACTURE2,
               CDT_MFACTURE3:res?.data[0]?.CDT_MFACTURE3,
               CDT_DSB_INS_NAME:res?.data[0]?.CDT_DSB_INS_NAME,
               CDT_DSB_INS_ID:res?.data[0]?.CDT_DSB_INS_ID,
               CDT_DISBOND_WINO:res?.data[0]?.CDT_DISBOND_WINO,
               CDT_BATCH1:res?.data[0]?.CDT_BATCH1,
               CDT_BATCH2:res?.data[0]?.CDT_BATCH2,
               CDT_BATCH3:res?.data[0]?.CDT_BATCH3,
               CDT_GRADE1:res?.data[0]?.CDT_GRADE1,
               CDT_GRADE2:res?.data[0]?.CDT_GRADE2,
               CDT_GRADE3:res?.data[0]?.CDT_GRADE3,
               CDT_TENSILE:res?.data[0]?.CDT_TENSILE,
               CDT_TAN_INS_NAME:res?.data[0]?.CDT_TAN_INS_NAME,
               CDT_TAN_INS_ID:res?.data[0]?.CDT_TAN_INS_ID,
               CDT_TENSIL_WINO:res?.data[0]?.CDT_TENSIL_WINO,
               CDT_HARDNESS:res?.data[0]?.CDT_HARDNESS,
               CDT_HRD_INS_NAME:res?.data[0]?.CDT_HRD_INS_NAME,
               CDT_HRD_INS_ID:res?.data[0]?.CDT_HRD_INS_ID,
               CDT_HARD_WINO:res?.data[0]?.CDT_HARD_WINO,
               CDT_PRDSTABL_MIN:res?.data[0]?.CDT_PRDSTABL_MIN,
               CDT_STB_INS_NAME:res?.data[0]?.CDT_STB_INS_NAME,
               CDT_STB_INS_ID:res?.data[0]?.CDT_STB_INS_ID,
               CDT_STABILITY_WINO:res?.data[0]?.CDT_STABILITY_WINO,
          }));
         
        })

        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  useEffect(() => {
    idHolDetData = holDetData;
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
        <Grid item xs={6}>
          <MDTypography variant="h6" color="white">
          Cathodic Disbondment Test
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
         
        <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              START DATE & TIME
                            </MDTypography>
                          </Grid>

                          <Grid item xs={7}>
                            <MDInput
                              type="datetime-local"
                              fullWidth
                              value={formatDateTimeLocal(holDetData?.CDT_SDATE_CATH1)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  CDT_SDATE_CATH1: dateTimeValue,
                                  CDT_STIME_CATH1: timePart, // Update the separate time field
                                }));
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={4.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              variant="h6"
                              color="dark"
                            >
                              END DATE & TIME
                            </MDTypography>
                          </Grid>

                          <Grid item xs={7}>
                            <MDInput
                              type="datetime-local"
                              fullWidth
                              value={formatDateTimeLocal(holDetData?.CDT_EDATE_CATH1)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  CDT_EDATE_CATH1: dateTimeValue,
                                  CDT_ETIME_CATH1: timePart, // Update the separate time field
                                }));
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                                          <Grid item xs={12} md={6}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_DSB_INS_NAME"
                              value={holDetData?.CDT_DSB_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_DSB_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={11}>
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
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={11}>
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

                        </Grid>
                      </Grid>
                                          <Grid item xs={12} md={6}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_DSB_INS_ID"
                              value={holDetData?.CDT_DSB_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_DSB_INS_ID: e.target.value?.toUpperCase(),
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
                              CD Test 28D/30D N
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_CD_MIN"
                              value={holDetData?.CDT_CD_MIN}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_CD_MIN: e.target.value?.toUpperCase(),
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
                              CD Test 28D/30D HOT
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_CDTEST_28D_30DH"
                              value={holDetData?.CDT_CDTEST_28D_30DH}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_CDTEST_28D_30DH: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                                          <Grid item xs={12} md={6}>
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_DISBOND_WINO"
                              value={holDetData?.CDT_DISBOND_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_DISBOND_WINO: e.target.value?.toUpperCase(),
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
                              Raw Material Used
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_RAW_MAT1"
                              value={holDetData?.CDT_RAW_MAT1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_RAW_MAT1: e.target.value?.toUpperCase(),
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
                              Manufacturer T1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_MFACTURE1"
                              value={holDetData?.CDT_MFACTURE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_MFACTURE1: e.target.value?.toUpperCase(),
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
                              Batch Number 1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_BATCH1"
                              value={holDetData?.CDT_BATCH1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_BATCH1: e.target.value?.toUpperCase(),
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
                              Grade 1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="CDT_GRADE1"
                              value={holDetData?.CDT_GRADE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_GRADE1: e.target.value?.toUpperCase(),
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
                              Raw Material Used
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_RAW_MAT2"
                              value={holDetData?.CDT_RAW_MAT2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_RAW_MAT2: e.target.value?.toUpperCase(),
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
                              Manufacturer T2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_MFACTURE2"
                              value={holDetData?.CDT_MFACTURE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_MFACTURE2: e.target.value?.toUpperCase(),
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
                              Batch Number 2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_BATCH2"
                              value={holDetData?.CDT_BATCH2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_BATCH2: e.target.value?.toUpperCase(),
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
                              Grade 2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="CDT_GRADE2"
                              value={holDetData?.CDT_GRADE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_GRADE2: e.target.value?.toUpperCase(),
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
                              Raw Material Used
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_RAW_MAT3"
                              value={holDetData?.CDT_RAW_MAT3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_RAW_MAT3: e.target.value?.toUpperCase(),
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
                              Manufacturer T3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_MFACTURE3"
                              value={holDetData?.CDT_MFACTURE3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_MFACTURE3: e.target.value?.toUpperCase(),
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
                              Batch Number 3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_BATCH3"
                              value={holDetData?.CDT_BATCH3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_BATCH3: e.target.value?.toUpperCase(),
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
                              Grade 3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="CDT_GRADE3"
                              value={holDetData?.CDT_GRADE3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_GRADE3: e.target.value?.toUpperCase(),
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
        <Grid item xs={6}>
          <MDTypography variant="h6" color="white">
          Tensile Test Report
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
                    <Grid item xs={12} md={2}>
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
                              Tensile Result
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_TENSILE"
                              value={holDetData?.CDT_TENSILE}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_TENSILE: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3.5}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="CDT_TAN_INS_NAME"
                              value={holDetData?.CDT_TAN_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_TAN_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="CDT_TENSIL_WINO"
                              value={holDetData?.CDT_TENSIL_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_TENSIL_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3.5}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="CDT_TAN_INS_ID"
                              value={holDetData?.CDT_TAN_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_TAN_INS_ID: e.target.value?.toUpperCase(),
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
        <Grid item xs={6}>
          <MDTypography variant="h6" color="white">
            Hardness Test Report	
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
          
        <Grid item xs={12} md={2}>
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
                              Hardness Result
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_HARDNESS"
                              value={holDetData?.CDT_HARDNESS}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_HARDNESS: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3.5}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="CDT_HRD_INS_NAME"
                              value={holDetData?.CDT_HRD_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_HRD_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                                          <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="CDT_HARD_WINO"
                              value={holDetData?.CDT_HARD_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_HARD_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid> 
                    <Grid item xs={12} md={3.5}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="CDT_HRD_INS_ID"
                              value={holDetData?.CDT_HRD_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_HRD_INS_ID: e.target.value?.toUpperCase(),
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
        <Grid item xs={6}>
          <MDTypography variant="h6" color="white">
            Product Stability Test	
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
          
        <Grid item xs={12} md={2}>
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
                              Stability Result
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="CDT_PRDSTABL_MIN"
                              value={holDetData?.CDT_PRDSTABL_MIN}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_PRDSTABL_MIN: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3.5}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="CDT_STB_INS_NAME"
                              value={holDetData?.CDT_STB_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_STB_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                                          <Grid item xs={12} md={3}>
                        <Grid container alignItems="center" spacing={1}>
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="CDT_STABILITY_WINO"
                              value={holDetData?.CDT_STABILITY_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_STABILITY_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    <Grid item xs={12} md={3.5}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="CDT_STB_INS_ID"
                              value={holDetData?.CDT_STB_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  CDT_STB_INS_ID: e.target.value?.toUpperCase(),
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
export { idHolDetData };