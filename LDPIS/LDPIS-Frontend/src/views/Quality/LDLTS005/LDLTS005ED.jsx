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
let edHolDetData=null;
export default function LDLTS005ED(props) {
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
    PRT_FEND1:"",
    PRT_MIDLE1:"",
    PRT_TEND1:"",
    PRT_TEMP1:"",
    PRT_FEND2:"",
    PRT_MIDLE2:"",
    PRT_TEND2:"",
    PRT_TEMP2:"",
    PRT_PEL_SRNO1:"",
    PRT_PEL_INS_NAME1:"",
    PRT_PEL_INS_ID1:"",
    PRT_PEEL_WINO:"",
    PRT_PEEL_DATE:"",
    PRT_PEEL_SHIFT:"",
    PRT_AIR_ENT_TEST:"",
    PRT_AIRENT_WINO:"",
    PRT_AIR_SRNO1:"",
    PRT_AIR_INS_NAME1:"",
    PRT_AIR_INS_ID1:"",
    PRT_REPAIR_AREA:"",
    PRT_REPAIR_HOLIDAY:"",
    PRT_REPAIR_RESULT:"",
    PRT_REP_SRNO1:"",
        PRT_REP_SRNO2:"",
    PRT_REP_INS_NAME1:"",
    PRT_REP_INS_NAME2:"",
    PRT_REP_INS_ID1:"",
    PRT_REP_INS_ID2:"",
    PRT_REPAIR_WINO    :"",
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

useEffect(() => {
   edHolDetData = holDetData;
}, [holDetData]); 

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
      PRT_FEND1:"",
PRT_MIDLE1:"",
PRT_TEND1:"",
PRT_TEMP1:"",
PRT_FEND2:"",
PRT_MIDLE2:"",
PRT_TEND2:"",
PRT_TEMP2:"",
PRT_PEL_SRNO1:"",
PRT_PEL_INS_NAME1:"",
PRT_PEL_INS_ID1:"",
PRT_PEEL_WINO:"",
PRT_PEEL_DATE:"",
PRT_PEEL_SHIFT:"",
PRT_AIR_ENT_TEST:"",
PRT_AIRENT_WINO:"",
PRT_AIR_SRNO1:"",
PRT_AIR_INS_NAME1:"",
PRT_AIR_INS_ID1:"",
PRT_REPAIR_AREA:"",
PRT_REPAIR_HOLIDAY:"",
PRT_REPAIR_RESULT:"",
PRT_REP_SRNO1:"",
PRT_REP_SRNO2:"",
PRT_REP_INS_NAME1:"",
PRT_REP_INS_NAME2:"",
PRT_REP_INS_ID1:"",
PRT_REP_INS_ID2:"",
PRT_REPAIR_WINO    :"",
    }));
    
};
  
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
            PRT_FEND1:res?.data[0]?.PRT_FEND1,
            PRT_MIDLE1:res?.data[0]?.PRT_MIDLE1,
            PRT_TEND1:res?.data[0]?.PRT_TEND1,
            PRT_TEMP1:res?.data[0]?.PRT_TEMP1,
            PRT_FEND2:res?.data[0]?.PRT_FEND2,
            PRT_MIDLE2:res?.data[0]?.PRT_MIDLE2,
            PRT_TEND2:res?.data[0]?.PRT_TEND2,
            PRT_TEMP2:res?.data[0]?.PRT_TEMP2,
            PRT_PEL_SRNO1:res?.data[0]?.PRT_PEL_SRNO1,
            PRT_PEL_INS_NAME1:res?.data[0]?.PRT_PEL_INS_NAME1,
            PRT_PEL_INS_ID1:res?.data[0]?.PRT_PEL_INS_ID1,
            PRT_PEEL_WINO:res?.data[0]?.PRT_PEEL_WINO,
            PRT_PEEL_DATE:res?.data[0]?.PRT_PEEL_DATE,
            PRT_PEEL_SHIFT:res?.data[0]?.PRT_PEEL_SHIFT,
            PRT_AIR_ENT_TEST:res?.data[0]?.PRT_AIR_ENT_TEST,
            PRT_AIRENT_WINO:res?.data[0]?.PRT_AIRENT_WINO,
            PRT_AIR_SRNO1:res?.data[0]?.PRT_AIR_SRNO1,
            PRT_AIR_INS_NAME1:res?.data[0]?.PRT_AIR_INS_NAME1,
            PRT_AIR_INS_ID1:res?.data[0]?.PRT_AIR_INS_ID1,
            PRT_REPAIR_AREA:res?.data[0]?.PRT_REPAIR_AREA,
            PRT_REPAIR_HOLIDAY:res?.data[0]?.PRT_REPAIR_HOLIDAY,
            PRT_REPAIR_RESULT:res?.data[0]?.PRT_REPAIR_RESULT,
            PRT_REP_SRNO1:res?.data[0]?.PRT_REP_SRNO1,
                        PRT_REP_SRNO2:res?.data[0]?.PRT_REP_SRNO2,
            PRT_REP_INS_NAME1:res?.data[0]?.PRT_REP_INS_NAME1,
            PRT_REP_INS_NAME2:res?.data[0]?.PRT_REP_INS_NAME2,
            PRT_REP_INS_ID1:res?.data[0]?.PRT_REP_INS_ID1,
            PRT_REP_INS_ID2:res?.data[0]?.PRT_REP_INS_ID2,
            PRT_REPAIR_WINO: res?.data[0]?.PRT_REPAIR_WINO
          }));
         
        })

        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  useEffect(() => {
    edHolDetData = holDetData;
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
          Peel Test Report
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
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              FEND
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_FEND1"
                              value={holDetData?.PRT_FEND1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_FEND1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              MIDDLE
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_MIDLE1"
                              value={holDetData?.PRT_MIDLE1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_MIDLE1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              T END
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_TEND1"
                              value={holDetData?.PRT_TEND1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_TEND1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              COLD TEMP
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_TEMP1"
                              value={holDetData?.PRT_TEMP1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_TEMP1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              FEND
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_FEND2"
                              value={holDetData?.PRT_FEND2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_FEND2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              MIDDLE
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_MIDLE2"
                              value={holDetData?.PRT_MIDLE2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_MIDLE2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              T END
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_TEND2"
                              value={holDetData?.PRT_TEND2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_TEND2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={4.6}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                              HOT TEMP
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.4}>
                            <MDInput
                              fullWidth
                              id="PRT_TEMP2"
                              value={holDetData?.PRT_TEMP2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_TEMP2: e.target.value?.toUpperCase(),
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
                              Peel Date 
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            {/* <MDInput
                              fullWidth
                              id="PRT_PEEL_DATE"
                              value={holDetData?.PRT_PEEL_DATE}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_PEEL_DATE: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            /> */}
                                                        <MDInput
                                                          type="datetime-local"
                                                          fullWidth
                                                          value={formatDateTimeLocal(holDetData?.PRT_PEEL_DATE)}
                                                          onChange={(e) => {
                                                            const dateTimeValue = e.target.value; // e.g., "2026-07-15T11:40"
                                                            // const timePart = dateTimeValue ? dateTimeValue.substring(11, 16) : ""; // Extracts "11:40"
                                                            setHolDetData((prev) => ({
                                                              ...prev,
                                                              PRT_PEEL_DATE: dateTimeValue,
                                                              // LP3_STIME_INDT: timePart, // Update the separate time field
                                                            }));
                                                          }}
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
                              Peel Shift
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="PRT_PEEL_SHIFT"
                              value={holDetData?.PRT_PEEL_SHIFT}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_PEEL_SHIFT: e.target.value?.toUpperCase(),
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
                              
                            </MDTypography>
                          </Grid>

                        </Grid>
                      </Grid>

                        <Grid item xs={12} md={1}>
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
                              SR.NO
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="PRT_PEL_SRNO1"
                              value={holDetData?.PRT_PEL_SRNO1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_PEL_SRNO1: e.target.value?.toUpperCase(),
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
                              Instrument Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={7.45}>
                            <MDInput
                              fullWidth
                              id="PRT_PEL_INS_NAME1"
                              value={holDetData?.PRT_PEL_INS_NAME1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_PEL_INS_NAME1: e.target.value?.toUpperCase(),
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="PRT_PEL_INS_ID1"
                              value={holDetData?.PRT_PEL_INS_ID1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_PEL_INS_ID1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={5}>
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
                              id="PRT_PEEL_WINO"
                              value={holDetData?.PRT_PEEL_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_PEEL_WINO: e.target.value?.toUpperCase(),
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
          Air Entrapment Test Report
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
                              Achieved Value
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.25}>
                            <MDInput
                              fullWidth
                              id="PRT_AIR_ENT_TEST"
                              value={holDetData?.PRT_AIR_ENT_TEST}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_AIR_ENT_TEST: e.target.value?.toUpperCase(),
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
                              id="PRT_AIRENT_WINO"
                              value={holDetData?.PRT_AIRENT_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_AIRENT_WINO: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={1.5}>
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
                              SR.NO
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="PRT_AIR_SRNO1"
                              value={holDetData?.PRT_AIR_SRNO1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_AIR_SRNO1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4.5}>
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
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="PRT_AIR_INS_NAME1"
                              value={holDetData?.PRT_AIR_INS_NAME1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_AIR_INS_NAME1: e.target.value?.toUpperCase(),
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.5}>
                            <MDInput
                              fullWidth
                              id="PRT_AIR_INS_ID1"
                              value={holDetData?.PRT_AIR_INS_ID1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_AIR_INS_ID1: e.target.value?.toUpperCase(),
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
          Repair Test Report
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
        <Grid item xs={12} md={4}>
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
                              Repair Area
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="PRT_REPAIR_AREA"
                              value={holDetData?.PRT_REPAIR_AREA}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REPAIR_AREA: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Holiday
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8}>
                            <MDInput
                              fullWidth
                              id="PRT_REPAIR_HOLIDAY"
                              value={holDetData?.PRT_REPAIR_HOLIDAY}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REPAIR_HOLIDAY: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={4}>
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
                              Result
                            </MDTypography>
                          </Grid>
                          <Grid item xs={8.1}>
                            <MDInput
                              fullWidth
                              id="PRT_REPAIR_RESULT"
                              value={holDetData?.PRT_REPAIR_RESULT}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REPAIR_RESULT: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={2}>
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
                           
                            </MDTypography>
                          </Grid>
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

                      <Grid item xs={12} md={1}>
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
                             {/* SR No. */}
                            </MDTypography>
                          </Grid>
                           <Grid item xs={10}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                             SR No.
                            </MDTypography>
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
                              {/* Instrument Name */}
                            </MDTypography>
                          </Grid>
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
                              Instrument Name
                            </MDTypography>
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
                              {/* Instrument Id /No. */}
                            </MDTypography>
                          </Grid>
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
                              Instrument Id /No.
                            </MDTypography>
                          </Grid>

                        </Grid>
                      </Grid>

                                              <Grid item xs={12} md={2}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={12}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                               Used Instrument
                            </MDTypography>
                          </Grid>
                        </Grid>
                      </Grid>

                           <Grid item xs={12} md={1}>
                         <Grid container alignItems="center" spacing={1}>
                           {/* <Grid item xs={5}>
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
                          </Grid> */}
                          <Grid item xs={12}>
                            <MDInput
                              fullWidth
                              id="PRT_REP_SRNO1"
                              value={holDetData?.PRT_REP_SRNO1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REP_SRNO1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      
                        <Grid item xs={12} md={4}>
                         <Grid container alignItems="center" spacing={1}>
                           {/* <Grid item xs={4}>
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
                          </Grid> */}
                          <Grid item xs={12}>
                            <MDInput
                              fullWidth
                              id="PRT_REP_INS_NAME1"
                              value={holDetData?.PRT_REP_INS_NAME1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REP_INS_NAME1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3.5}>
                         <Grid container alignItems="center" spacing={1}>
                           {/* <Grid item xs={4}>
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
                          </Grid> */}
                          <Grid item xs={12}>
                            <MDInput
                              fullWidth
                              id="PRT_REP_INS_ID1"
                              value={holDetData?.PRT_REP_INS_ID1}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REP_INS_ID1: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                                              <Grid item xs={12} md={2}>
                         <Grid container alignItems="center" spacing={1}>
                           <Grid item xs={12}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              style={{ marginTop: "8px", fontSize: "0.9rem" }}
                              noWrap
                            >
                               Reason Of Damage
                            </MDTypography>
                          </Grid>

                        </Grid>
                      </Grid>

                           <Grid item xs={12} md={1}>
                         <Grid container alignItems="center" spacing={1}>
                           {/* <Grid item xs={5}>
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
                          </Grid> */}
                          <Grid item xs={12}>
                            <MDInput
                              fullWidth
                              id="PRT_REP_SRNO2"
                              value={holDetData?.PRT_REP_SRNO2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REP_SRNO2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      
                        <Grid item xs={12} md={4}>
                         <Grid container alignItems="center" spacing={1}>
                           {/* <Grid item xs={4}>
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
                          </Grid> */}
                          <Grid item xs={12}>
                            <MDInput
                              fullWidth
                              id="PRT_REP_INS_NAME2"
                              value={holDetData?.PRT_REP_INS_NAME2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REP_INS_NAME2: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                        <Grid item xs={12} md={3.5}>
                         <Grid container alignItems="center" spacing={1}>
                           {/* <Grid item xs={4}>
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
                          </Grid> */}
                          <Grid item xs={12}>
                            <MDInput
                              fullWidth
                              id="PRT_REP_INS_ID2"
                              value={holDetData?.PRT_REP_INS_ID2}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REP_INS_ID2: e.target.value?.toUpperCase(),
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
                              Procedure / WI No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="PRT_REPAIR_WINO"
                              value={holDetData?.PRT_REPAIR_WINO}
                              disabled={false}
                              onChange={(e) => {
                                setHolDetData({
                                  ...holDetData,
                                  PRT_REPAIR_WINO: e.target.value?.toUpperCase(),
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
export {  edHolDetData };