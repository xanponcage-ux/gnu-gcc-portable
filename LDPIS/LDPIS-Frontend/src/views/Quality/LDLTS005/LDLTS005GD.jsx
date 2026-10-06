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
let gdHolDetData = null;
export default function LDLTS005GD(props) {
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
    LP3_SDATE_CATH: "",
    LP3_STIME_CATH: "",
    LP3_EDATE_CATH: "",
    LP3_ETIME_CATH: "",
    LP3_CTH_INS_NAME: "",
    LP3_CTH_INS_ID: "",
    LP3_CATH_WINO: "",
    LP3_CDTEST_24H_48H: "",
    LP3_RAW_MAT1: "",
    LP3_RAW_MAT2: "",
    LP3_RAW_MAT3: "",
    LP3_MFACTURE1: "",
    LP3_MFACTURE2: "",
    LP3_MFACTURE3: "",
    LP3_GRADE1: "",
    LP3_GRADE2: "",
    LP3_GRADE3: "",
    LP3_BATCH1: "",
    LP3_BATCH2: "",
    LP3_BATCH3: "",
    LP3_FLEX_3LPE_T1: "",
    LP3_FLEX_3LPE_T2: "",
    LP3_FLEX_3LPE_T3: "",
    LP3_FLX3_INS_NAME: "",
    LP3_FLX3_INS_ID: "",
    LP3_FLEX_WINO: "",
    LP3_INITIAL_COLD: "",
    LP3_FINALRD_COLD: "",
    LP3_RESULT_COLD: "",
    LP3_INITIAL_COLD1: "",
    LP3_FINALRD_COLD1: "",
    LP3_RESULT_COLD1: "",
    LP3_INITIAL_COLD2: "",
    LP3_FINALRD_COLD2: "",
    LP3_RESULT_COLD2: "",
    LP3_SDATE_INDT: "",
    LP3_EDATE_INDT: "",
    LP3_STIME_INDT: "",
    LP3_ETIME_INDT: "",
    LP3_INITIAL_HOT: "",
    LP3_FINALRD_HOT: "",
    LP3_RESULT_HOT: "",
    LP3_INITIAL_HOT1: "",
    LP3_FINALRD_HOT1: "",
    LP3_RESULT_HOT1: "",
    LP3_INITIAL_HOT2: "",
    LP3_FINALRD_HOT2: "",
    LP3_RESULT_HOT2: "",
    LP3_IND_INS_NAME: "",
    LP3_IND_INS_ID: "",
    LP3_INDT_WINO: "",
    LP3_ELONG_TEST1: "",
    LP3_ELONG_TEST2: "",
    LP3_ELONG_TEST3: "",
    LP3_ELONG_TEST4: "",
    LP3_ELONG_TEST5: "",
    LP3_ELONG_TEST6: "",
    LP3_ELG_INS_NAME: "",
    LP3_ELG_INS_ID: "",
    LP3_ELG_WINO: "",
  });



  useEffect(() => {
    console.log("Inside sales details");
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        if (props.ordId) {
          handleDisplay(props.ordId, "");
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
      LP3_SDATE_CATH: "",
      LP3_STIME_CATH: "",
      LP3_EDATE_CATH: "",
      LP3_ETIME_CATH: "",
      LP3_CTH_INS_NAME: "",
      LP3_CTH_INS_ID: "",
      LP3_CATH_WINO: "",
      LP3_CDTEST_24H_48H: "",
      LP3_RAW_MAT1: "",
      LP3_RAW_MAT2: "",
      LP3_RAW_MAT3: "",
      LP3_MFACTURE1: "",
      LP3_MFACTURE2: "",
      LP3_MFACTURE3: "",
      LP3_GRADE1: "",
      LP3_GRADE2: "",
      LP3_GRADE3: "",
      LP3_BATCH1: "",
      LP3_BATCH2: "",
      LP3_BATCH3: "",
      LP3_FLEX_3LPE_T1: "",
      LP3_FLEX_3LPE_T2: "",
      LP3_FLEX_3LPE_T3: "",
      LP3_FLX3_INS_NAME: "",
      LP3_FLX3_INS_ID: "",
      LP3_FLEX_WINO: "",
      LP3_INITIAL_COLD: "",
      LP3_FINALRD_COLD: "",
      LP3_RESULT_COLD: "",
      LP3_INITIAL_COLD1: "",
      LP3_FINALRD_COLD1: "",
      LP3_RESULT_COLD1: "",
      LP3_INITIAL_COLD2: "",
      LP3_FINALRD_COLD2: "",
      LP3_RESULT_COLD2: "",
      LP3_SDATE_INDT: "",
      LP3_EDATE_INDT: "",
      LP3_STIME_INDT: "",
      LP3_ETIME_INDT: "",
      LP3_INITIAL_HOT: "",
      LP3_FINALRD_HOT: "",
      LP3_RESULT_HOT: "",
      LP3_INITIAL_HOT1: "",
      LP3_FINALRD_HOT1: "",
      LP3_RESULT_HOT1: "",
      LP3_INITIAL_HOT2: "",
      LP3_FINALRD_HOT2: "",
      LP3_RESULT_HOT2: "",
      LP3_IND_INS_NAME: "",
      LP3_IND_INS_ID: "",
      LP3_INDT_WINO: "",
      LP3_ELONG_TEST1: "",
      LP3_ELONG_TEST2: "",
      LP3_ELONG_TEST3: "",
      LP3_ELONG_TEST4: "",
      LP3_ELONG_TEST5: "",
      LP3_ELONG_TEST6: "",
      LP3_ELG_INS_NAME: "",
      LP3_ELG_INS_ID: "",
      LP3_ELG_WINO: "",
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
            //                PRD_DATE_120: res?.data[0]?.PRD_DATE_120,
            // PRD_SHIFT_120: res?.data[0]?.PRD_SHIFT_120,
            LP3_SDATE_CATH: res?.data[0]?.LP3_SDATE_CATH,
            LP3_STIME_CATH: res?.data[0]?.LP3_STIME_CATH,
            LP3_EDATE_CATH: res?.data[0]?.LP3_EDATE_CATH,
            LP3_ETIME_CATH: res?.data[0]?.LP3_ETIME_CATH,
            LP3_CTH_INS_NAME: res?.data[0]?.LP3_CTH_INS_NAME,
            LP3_CTH_INS_ID: res?.data[0]?.LP3_CTH_INS_ID,
            LP3_CATH_WINO: res?.data[0]?.LP3_CATH_WINO,
            LP3_CDTEST_24H_48H: res?.data[0]?.LP3_CDTEST_24H_48H,
            LP3_RAW_MAT1: res?.data[0]?.LP3_RAW_MAT1,
            LP3_RAW_MAT2: res?.data[0]?.LP3_RAW_MAT2,
            LP3_RAW_MAT3: res?.data[0]?.LP3_RAW_MAT3,
            LP3_MFACTURE1: res?.data[0]?.LP3_MFACTURE1,
            LP3_MFACTURE2: res?.data[0]?.LP3_MFACTURE2,
            LP3_MFACTURE3: res?.data[0]?.LP3_MFACTURE3,
            LP3_GRADE1: res?.data[0]?.LP3_GRADE1,
            LP3_GRADE2: res?.data[0]?.LP3_GRADE2,
            LP3_GRADE3: res?.data[0]?.LP3_GRADE3,
            LP3_BATCH1: res?.data[0]?.LP3_BATCH1,
            LP3_BATCH2: res?.data[0]?.LP3_BATCH2,
            LP3_BATCH3: res?.data[0]?.LP3_BATCH3,
            LP3_FLEX_3LPE_T1: res?.data[0]?.LP3_FLEX_3LPE_T1,
            LP3_FLEX_3LPE_T2: res?.data[0]?.LP3_FLEX_3LPE_T2,
            LP3_FLEX_3LPE_T3: res?.data[0]?.LP3_FLEX_3LPE_T3,
            LP3_FLX3_INS_NAME: res?.data[0]?.LP3_FLX3_INS_NAME,
            LP3_FLX3_INS_ID: res?.data[0]?.LP3_FLX3_INS_ID,
            LP3_FLEX_WINO: res?.data[0]?.LP3_FLEX_WINO,
            LP3_INITIAL_COLD: res?.data[0]?.LP3_INITIAL_COLD,
            LP3_FINALRD_COLD: res?.data[0]?.LP3_FINALRD_COLD,
            LP3_RESULT_COLD: res?.data[0]?.LP3_RESULT_COLD,
            LP3_INITIAL_COLD1: res?.data[0]?.LP3_INITIAL_COLD1,
            LP3_FINALRD_COLD1: res?.data[0]?.LP3_FINALRD_COLD1,
            LP3_RESULT_COLD1: res?.data[0]?.LP3_RESULT_COLD1,
            LP3_INITIAL_COLD2: res?.data[0]?.LP3_INITIAL_COLD2,
            LP3_FINALRD_COLD2: res?.data[0]?.LP3_FINALRD_COLD2,
            LP3_RESULT_COLD2: res?.data[0]?.LP3_RESULT_COLD2,
            LP3_SDATE_INDT: res?.data[0]?.LP3_SDATE_INDT,
            LP3_EDATE_INDT: res?.data[0]?.LP3_EDATE_INDT,
            LP3_STIME_INDT: res?.data[0]?.LP3_STIME_INDT,
            LP3_ETIME_INDT: res?.data[0]?.LP3_ETIME_INDT,
            LP3_INITIAL_HOT: res?.data[0]?.LP3_INITIAL_HOT,
            LP3_FINALRD_HOT: res?.data[0]?.LP3_FINALRD_HOT,
            LP3_RESULT_HOT: res?.data[0]?.LP3_RESULT_HOT,
            LP3_INITIAL_HOT1: res?.data[0]?.LP3_INITIAL_HOT1,
            LP3_FINALRD_HOT1: res?.data[0]?.LP3_FINALRD_HOT1,
            LP3_RESULT_HOT1: res?.data[0]?.LP3_RESULT_HOT1,
            LP3_INITIAL_HOT2: res?.data[0]?.LP3_INITIAL_HOT2,
            LP3_FINALRD_HOT2: res?.data[0]?.LP3_FINALRD_HOT2,
            LP3_RESULT_HOT2: res?.data[0]?.LP3_RESULT_HOT2,
            LP3_IND_INS_NAME: res?.data[0]?.LP3_IND_INS_NAME,
            LP3_IND_INS_ID: res?.data[0]?.LP3_IND_INS_ID,
            LP3_INDT_WINO: res?.data[0]?.LP3_INDT_WINO,
            LP3_ELONG_TEST1: res?.data[0]?.LP3_ELONG_TEST1,
            LP3_ELONG_TEST2: res?.data[0]?.LP3_ELONG_TEST2,
            LP3_ELONG_TEST3: res?.data[0]?.LP3_ELONG_TEST3,
            LP3_ELONG_TEST4: res?.data[0]?.LP3_ELONG_TEST4,
            LP3_ELONG_TEST5: res?.data[0]?.LP3_ELONG_TEST5,
            LP3_ELONG_TEST6: res?.data[0]?.LP3_ELONG_TEST6,
            LP3_ELG_INS_NAME: res?.data[0]?.LP3_ELG_INS_NAME,
            LP3_ELG_INS_ID: res?.data[0]?.LP3_ELG_INS_ID,
            LP3_ELG_WINO: res?.data[0]?.LP3_ELG_WINO
          }));

        })

        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  useEffect(() => {
    gdHolDetData = holDetData;
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
                              START DATE
                            </MDTypography>
                          </Grid>

                          <Grid item xs={7}>
                            <MDInput
                              type="datetime-local"
                              fullWidth
                              value={formatDateTimeLocal(holDetData?.LP3_SDATE_CATH)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  LP3_SDATE_CATH: dateTimeValue,
                                  LP3_STIME_CATH: timePart, // Update the separate time field
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
                              END DATE
                            </MDTypography>
                          </Grid>

                          <Grid item xs={7}>
                            <MDInput
                              type="datetime-local"
                              fullWidth
                              value={formatDateTimeLocal(holDetData?.LP3_EDATE_CATH)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  LP3_EDATE_CATH: dateTimeValue,
                                  LP3_ETIME_CATH: timePart, // Update the separate time field
                                }));
                              }}
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LP3_CTH_INS_NAME"
                              value={holDetData?.LP3_CTH_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_CTH_INS_NAME: e.target.value?.toUpperCase(),
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
                          {/* <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="LP3_ETIME_CATH"
                              value={holDetData?.LP3_ETIME_CATH}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ETIME_CATH: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid> */}
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LP3_CTH_INS_ID"
                              value={holDetData?.LP3_CTH_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_CTH_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              CD Test 24H /48H
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="LP3_CDTEST_24H_48H"
                              value={holDetData?.LP3_CDTEST_24H_48H}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_CDTEST_24H_48H: e.target.value?.toUpperCase(),
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LP3_CATH_WINO"
                              value={holDetData?.LP3_CATH_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_CATH_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Raw Material Used
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="LP3_RAW_MAT1"
                              value={holDetData?.LP3_RAW_MAT1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RAW_MAT1: e.target.value?.toUpperCase(),
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
                              Manufacturer
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_MFACTURE1"
                              value={holDetData?.LP3_MFACTURE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_MFACTURE1: e.target.value?.toUpperCase(),
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
                              Grade
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_GRADE1"
                              value={holDetData?.LP3_GRADE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_GRADE1: e.target.value?.toUpperCase(),
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
                              Batch Number
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_BATCH1"
                              value={holDetData?.LP3_BATCH1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_BATCH1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Raw Material Used
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="LP3_RAW_MAT2"
                              value={holDetData?.LP3_RAW_MAT2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RAW_MAT2: e.target.value?.toUpperCase(),
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
                              Manufacturer
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_MFACTURE2"
                              value={holDetData?.LP3_MFACTURE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_MFACTURE2: e.target.value?.toUpperCase(),
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
                              Grade
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_GRADE2"
                              value={holDetData?.LP3_GRADE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_GRADE2: e.target.value?.toUpperCase(),
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
                              Batch Number
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_BATCH2"
                              value={holDetData?.LP3_BATCH2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_BATCH2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
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
                              Raw Material Used
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="LP3_RAW_MAT3"
                              value={holDetData?.LP3_RAW_MAT3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RAW_MAT3: e.target.value?.toUpperCase(),
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
                              Manufacturer
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_MFACTURE3"
                              value={holDetData?.LP3_MFACTURE3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_MFACTURE3: e.target.value?.toUpperCase(),
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
                              Grade
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_GRADE3"
                              value={holDetData?.LP3_GRADE3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_GRADE3: e.target.value?.toUpperCase(),
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
                              Batch Number
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_BATCH3"
                              value={holDetData?.LP3_BATCH3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_BATCH3: e.target.value?.toUpperCase(),
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
                        Flexibility Test Report for 3LPE Pipe
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

                      <Grid item xs={6} md={6}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              3LPE Tset Result
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FLEX_3LPE_T1"
                              value={holDetData?.LP3_FLEX_3LPE_T1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FLEX_3LPE_T1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FLEX_3LPE_T2"
                              value={holDetData?.LP3_FLEX_3LPE_T2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FLEX_3LPE_T2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FLEX_3LPE_T3"
                              value={holDetData?.LP3_FLEX_3LPE_T3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FLEX_3LPE_T3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={6} md={6}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LP3_FLX3_INS_NAME"
                              value={holDetData?.LP3_FLX3_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FLX3_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} md={6}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
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
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="LP3_FLEX_WINO"
                              value={holDetData?.LP3_FLEX_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FLEX_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} md={6}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="LP3_FLX3_INS_ID"
                              value={holDetData?.LP3_FLX3_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FLX3_INS_ID: e.target.value?.toUpperCase(),
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
                        Indentation Test Report
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

                      <Grid item xs={4.5} md={4.5}>
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
                              Cold Initial Test
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Initial
                            </MDTypography>
                          </Grid>
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
                              Final Reading
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
                              Result
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={5} md={5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={3.3}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Hot Initial Test
                            </MDTypography>
                          </Grid>
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
                              Initial
                            </MDTypography>
                          </Grid>
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
                              Final Reading
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
                              Result
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* <Grid item xs={2} md={2}>
                     <Grid container alignItems="center" spacing={1}> 
                      </Grid>
                      </Grid> */}
                      <Grid item xs={4.5} md={4.5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              CD Test 1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_INITIAL_COLD"
                              value={holDetData?.LP3_INITIAL_COLD}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_INITIAL_COLD: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FINALRD_COLD"
                              value={holDetData?.LP3_FINALRD_COLD}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FINALRD_COLD: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_RESULT_COLD"
                              value={holDetData?.LP3_RESULT_COLD}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RESULT_COLD: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4.5} md={4.5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Hot Test 1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_INITIAL_HOT"
                              value={holDetData?.LP3_INITIAL_HOT}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_INITIAL_HOT: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FINALRD_HOT"
                              value={holDetData?.LP3_FINALRD_HOT}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FINALRD_HOT: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_RESULT_HOT"
                              value={holDetData?.LP3_RESULT_HOT}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RESULT_HOT: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3} md={3}>
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_IND_INS_NAME"
                              value={holDetData?.LP3_IND_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_IND_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4.5} md={4.5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              CD Test 2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_INITIAL_COLD1"
                              value={holDetData?.LP3_INITIAL_COLD1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_INITIAL_COLD1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FINALRD_COLD1"
                              value={holDetData?.LP3_FINALRD_COLD1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FINALRD_COLD1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_RESULT_COLD1"
                              value={holDetData?.LP3_RESULT_COLD1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RESULT_COLD1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4.5} md={4.5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Hot Test 2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_INITIAL_HOT1"
                              value={holDetData?.LP3_INITIAL_HOT1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_INITIAL_HOT1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FINALRD_HOT1"
                              value={holDetData?.LP3_FINALRD_HOT1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FINALRD_HOT1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_RESULT_HOT1"
                              value={holDetData?.LP3_RESULT_HOT1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RESULT_HOT1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3} md={3}>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_IND_INS_ID"
                              value={holDetData?.LP3_IND_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_IND_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={4.5} md={4.5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              CD Test 3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_INITIAL_COLD2"
                              value={holDetData?.LP3_INITIAL_COLD2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_INITIAL_COLD2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FINALRD_COLD2"
                              value={holDetData?.LP3_FINALRD_COLD2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FINALRD_COLD2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_RESULT_COLD2"
                              value={holDetData?.LP3_RESULT_COLD2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RESULT_COLD2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4.5} md={4.5}>
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item xs={2.5}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              Hot Test 3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_INITIAL_HOT2"
                              value={holDetData?.LP3_INITIAL_HOT2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_INITIAL_HOT2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_FINALRD_HOT2"
                              value={holDetData?.LP3_FINALRD_HOT2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_FINALRD_HOT2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <MDInput
                              fullWidth
                              id="LP3_RESULT_HOT2"
                              value={holDetData?.LP3_RESULT_HOT2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_RESULT_HOT2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3} md={3}>
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
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_INDT_WINO"
                              value={holDetData?.LP3_INDT_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_INDT_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4.75} md={4.75}>
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
                              START DATE
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              type="datetime-local"
                              fullWidth
                              value={formatDateTimeLocal(holDetData?.LP3_SDATE_INDT)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  LP3_SDATE_INDT: dateTimeValue,
                                  LP3_STIME_INDT: timePart, // Update the separate time field
                                }));
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={4.75} md={4.75}>
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
                              END DATE
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              type="datetime-local"
                              fullWidth
                              value={formatDateTimeLocal(holDetData?.LP3_EDATE_INDT)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  LP3_EDATE_INDT: dateTimeValue,
                                  LP3_ETIME_INDT: timePart, // Update the separate time field
                                }));
                              }}
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
                        Elongnation Test Report
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

                      <Grid item xs={3.5} md={3.5}>
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
                              Elong Test Result1
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_ELONG_TEST1"
                              value={holDetData?.LP3_ELONG_TEST1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELONG_TEST1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3.5} md={3.5}>
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
                              Elong Test Result4
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_ELONG_TEST4"
                              value={holDetData?.LP3_ELONG_TEST4}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELONG_TEST4: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={5} md={5}>
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
                              id="LP3_ELG_INS_NAME"
                              value={holDetData?.LP3_ELG_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELG_INS_NAME: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3.5} md={3.5}>
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
                              Elong Test Result2
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_ELONG_TEST2"
                              value={holDetData?.LP3_ELONG_TEST2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELONG_TEST2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3.5} md={3.5}>
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
                              Elong Test Result5
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_ELONG_TEST5"
                              value={holDetData?.LP3_ELONG_TEST5}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELONG_TEST5: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={5} md={5}>
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
                              id="LP3_ELG_INS_ID"
                              value={holDetData?.LP3_ELG_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELG_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3.5} md={3.5}>
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
                              Elong Test Result3
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_ELONG_TEST3"
                              value={holDetData?.LP3_ELONG_TEST3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELONG_TEST3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>


                      <Grid item xs={3.5} md={3.5}>
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
                              Elong Test Result6
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_ELONG_TEST6"
                              value={holDetData?.LP3_ELONG_TEST6}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELONG_TEST6: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>


                      <Grid item xs={5} md={5}>
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="LP3_ELG_WINO"
                              value={holDetData?.LP3_ELG_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  LP3_ELG_WINO: e.target.value?.toUpperCase(),
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
export { gdHolDetData };