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
import MonthPicker from "components/DateTime/DatePicker";
let ldHolDetData=null;
export default function LDLTS005LD(props) {
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
    ACP_SDATE_48H2:"",
    ACP_STIME_48H2:"",
    ACP_EDATE_48H2:"",
    ACP_ETIME_48H2:"",
    ACP_TEST_RESULT:"",
    ACP_TEST_RESULT1:"",
    ACP_TEST_RESULT2:"",
    ACP_H48_INS_NAME:"",
    ACP_H48_INS_ID:"",
    ACP_ADH48_WINO:"",
    ACP_RAW_MAT1:"",
    ACP_RAW_MAT2:"",
    ACP_RAW_MAT3:"",
    ACP_MFACTURE1:"",
    ACP_MFACTURE2:"",
    ACP_MFACTURE3:"",
    ACP_BATCH1:"",
    ACP_BATCH2:"",
    ACP_BATCH3:"",
    ACP_GRADE1:"",
    ACP_GRADE2:"",
    ACP_GRADE3:""
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
        //       PRD_DATE_120: "",
        // PRD_SHIFT_120: "",
      ACP_SDATE_48H2:"",
  ACP_STIME_48H2:"",
  ACP_EDATE_48H2:"",
  ACP_ETIME_48H2:"",
  ACP_TEST_RESULT:"",
  ACP_TEST_RESULT1:"",
  ACP_TEST_RESULT2:"",
  ACP_H48_INS_NAME:"",
  ACP_H48_INS_ID:"",
  ACP_ADH48_WINO:"",
  ACP_RAW_MAT1:"",
  ACP_RAW_MAT2:"",
  ACP_RAW_MAT3:"",
  ACP_MFACTURE1:"",
  ACP_MFACTURE2:"",
  ACP_MFACTURE3:"",
  ACP_BATCH1:"",
  ACP_BATCH2:"",
  ACP_BATCH3:"",
  ACP_GRADE1:"",
  ACP_GRADE2:"",
  ACP_GRADE3:"",
    }));
    
  };

  // Handle display data button
  useEffect(() => {
    ldHolDetData = holDetData;
  }, [holDetData]); 
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
            ACP_SDATE_48H2:res?.data[0]?.ACP_SDATE_48H2,
            ACP_STIME_48H2:res?.data[0]?.ACP_STIME_48H2,
            ACP_EDATE_48H2:res?.data[0]?.ACP_EDATE_48H2,
            ACP_ETIME_48H2:res?.data[0]?.ACP_ETIME_48H2,
            ACP_TEST_RESULT:res?.data[0]?.ACP_TEST_RESULT,
            ACP_TEST_RESULT1:res?.data[0]?.ACP_TEST_RESULT1,
            ACP_TEST_RESULT2:res?.data[0]?.ACP_TEST_RESULT2,
            ACP_H48_INS_NAME:res?.data[0]?.ACP_H48_INS_NAME,
            ACP_H48_INS_ID:res?.data[0]?.ACP_H48_INS_ID,
            ACP_ADH48_WINO:res?.data[0]?.ACP_ADH48_WINO,
            ACP_RAW_MAT1:res?.data[0]?.ACP_RAW_MAT1,
            ACP_RAW_MAT2:res?.data[0]?.ACP_RAW_MAT2,
            ACP_RAW_MAT3:res?.data[0]?.ACP_RAW_MAT3,
            ACP_MFACTURE1:res?.data[0]?.ACP_MFACTURE1,
            ACP_MFACTURE2:res?.data[0]?.ACP_MFACTURE2,
            ACP_MFACTURE3:res?.data[0]?.ACP_MFACTURE3,
            ACP_BATCH1:res?.data[0]?.ACP_BATCH1,
            ACP_BATCH2:res?.data[0]?.ACP_BATCH2,
            ACP_BATCH3:res?.data[0]?.ACP_BATCH3,
            ACP_GRADE1:res?.data[0]?.ACP_GRADE1,
            ACP_GRADE2:res?.data[0]?.ACP_GRADE2,
            ACP_GRADE3:res?.data[0]?.ACP_GRADE3
          }));
         
        })

        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };


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
          48 Hour Adhession Test
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
                              value={formatDateTimeLocal(holDetData?.ACP_SDATE_48H2)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  ACP_SDATE_48H2: dateTimeValue,
                                  ACP_STIME_48H2: timePart, // Update the separate time field
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
                              value={formatDateTimeLocal(holDetData?.ACP_EDATE_48H2)}
                              onChange={(e) => {
                                const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                setHolDetData((prev) => ({
                                  ...prev,
                                  ACP_EDATE_48H2: dateTimeValue,
                                  ACP_ETIME_48H2: timePart, // Update the separate time field
                                }));
                              }}
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="ACP_H48_INS_NAME"
                              value={holDetData?.ACP_H48_INS_NAME}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_H48_INS_NAME: e.target.value?.toUpperCase(),
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
                              id="ACP_ADH48_WINO"
                              value={holDetData?.ACP_ADH48_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_ADH48_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={6}>
                         {/* comment line to add space in screen  */}
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7}>
                            <MDInput
                              fullWidth
                              id="ACP_H48_INS_ID"
                              value={holDetData?.ACP_H48_INS_ID}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_H48_INS_ID: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Sample 1
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_TEST_RESULT"
                              value={holDetData?.ACP_TEST_RESULT}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_TEST_RESULT: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Sample 2
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_TEST_RESULT1"
                              value={holDetData?.ACP_TEST_RESULT1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_TEST_RESULT1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Sample 3
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_TEST_RESULT2"
                              value={holDetData?.ACP_TEST_RESULT2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_TEST_RESULT2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>



                        <Grid item xs={12} md={4}>
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
                              Raw Material Used Test 1
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_RAW_MAT1"
                              value={holDetData?.ACP_RAW_MAT1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_RAW_MAT1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      
                        <Grid item xs={12} md={4}>
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
                              Raw Material Used Test 2
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_RAW_MAT2"
                              value={holDetData?.ACP_RAW_MAT2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_RAW_MAT2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Raw Material Used Test 3
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_RAW_MAT3"
                              value={holDetData?.ACP_RAW_MAT3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_RAW_MAT3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Manufacturer Test 1
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_MFACTURE1"
                              value={holDetData?.ACP_MFACTURE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_MFACTURE1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Manufacturer Test 2
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_MFACTURE2"
                              value={holDetData?.ACP_MFACTURE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_MFACTURE2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Manufacturer Test 3
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_MFACTURE3"
                              value={holDetData?.ACP_MFACTURE3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_MFACTURE3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Batch 1
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_BATCH1"
                              value={holDetData?.ACP_BATCH1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_BATCH1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Batch 2
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_BATCH2"
                              value={holDetData?.ACP_BATCH2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_BATCH2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Batch 3
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_BATCH3"
                              value={holDetData?.ACP_BATCH3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_BATCH3: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Grade 1
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_GRADE1"
                              value={holDetData?.ACP_GRADE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_GRADE1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Grade 2
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_GRADE2"
                              value={holDetData?.ACP_GRADE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_GRADE2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Grade 3
                            </MDTypography>
                          </Grid>
                            <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="ACP_GRADE3"
                              value={holDetData?.ACP_GRADE3}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  ACP_GRADE3: e.target.value?.toUpperCase(),
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
export {  ldHolDetData };