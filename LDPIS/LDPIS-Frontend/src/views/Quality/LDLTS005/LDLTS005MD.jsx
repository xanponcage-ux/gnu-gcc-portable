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

let mdHolDetData=null;

export default function LDLTS005MD(props) {
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
    FTP_EPOXY_0D1:"",
    FTP_EPOXY_0D2:"",
    FTP_EPOXY_0D3:"",
    FTP_EPOXY_90D1:"",
    FTP_EPOXY_90D2:"",
    FTP_EPOXY_90D3:"",
    FTP_EPOXY_180D1:"",
    FTP_EPOXY_180D2:"",
    FTP_EPOXY_180D3:"",
    FTP_EPOXY_270D1:"",
    FTP_EPOXY_270D2:"",
    FTP_EPOXY_270D3:"",
    FTP_ADHESIV_0D1:"",
    FTP_ADHESIV_0D2:"",
    FTP_ADHESIV_0D3:"",
    FTP_ADHESIV_90D1:"",
    FTP_ADHESIV_90D2:"",
    FTP_ADHESIV_90D3:"",
    FTP_ADHESIV_180D1:"",
    FTP_ADHESIV_180D2:"",
    FTP_ADHESIV_180D3:"",
    FTP_ADHESIV_270D1:"",
    FTP_ADHESIV_270D2:"",
    FTP_ADHESIV_270D3:"",
    FTP_TOTCOAT_0D1:"",
    FTP_TOTCOAT_0D2:"",
    FTP_TOTCOAT_0D3:"",
    FTP_TOTCOAT_90D1:"",
    FTP_TOTCOAT_90D2:"",
    FTP_TOTCOAT_90D3:"",
    FTP_TOTCOAT_180D1:"",
    FTP_TOTCOAT_180D2:"",
    FTP_TOTCOAT_180D3:"",
    FTP_TOTCOAT_270D1:"",
    FTP_TOTCOAT_270D2:"",
    FTP_TOTCOAT_270D3:"",
    FTP_TRL_SRNO1:"",
    FTP_TRL_INS_NAME1:"",
    FTP_TRL_INS_ID1:"",
    FTP_TRL_SRNO2:"",
    FTP_TRL_INS_NAME2:"",
    FTP_TRL_INS_ID2:"",
    FTP_TRL_SRNO3:"",
    FTP_TRL_INS_NAME3:"",
    FTP_TRL_INS_ID3:"",
    FTP_TRIAL_WINO:"",
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
      FTP_EPOXY_0D1:"",
    FTP_EPOXY_0D2:"",
    FTP_EPOXY_0D3:"",
    FTP_EPOXY_90D1:"",
    FTP_EPOXY_90D2:"",
    FTP_EPOXY_90D3:"",
    FTP_EPOXY_180D1:"",
    FTP_EPOXY_180D2:"",
    FTP_EPOXY_180D3:"",
    FTP_EPOXY_270D1:"",
    FTP_EPOXY_270D2:"",
    FTP_EPOXY_270D3:"",
    FTP_ADHESIV_0D1:"",
    FTP_ADHESIV_0D2:"",
    FTP_ADHESIV_0D3:"",
    FTP_ADHESIV_90D1:"",
    FTP_ADHESIV_90D2:"",
    FTP_ADHESIV_90D3:"",
    FTP_ADHESIV_180D1:"",
    FTP_ADHESIV_180D2:"",
    FTP_ADHESIV_180D3:"",
    FTP_ADHESIV_270D1:"",
    FTP_ADHESIV_270D2:"",
    FTP_ADHESIV_270D3:"",
    FTP_TOTCOAT_0D1:"",
    FTP_TOTCOAT_0D2:"",
    FTP_TOTCOAT_0D3:"",
    FTP_TOTCOAT_90D1:"",
    FTP_TOTCOAT_90D2:"",
    FTP_TOTCOAT_90D3:"",
    FTP_TOTCOAT_180D1:"",
    FTP_TOTCOAT_180D2:"",
    FTP_TOTCOAT_180D3:"",
    FTP_TOTCOAT_270D1:"",
    FTP_TOTCOAT_270D2:"",
    FTP_TOTCOAT_270D3:"",
    FTP_TRL_SRNO1:"",
    FTP_TRL_INS_NAME1:"",
    FTP_TRL_INS_ID1:"",
        FTP_TRL_SRNO2:"",
    FTP_TRL_INS_NAME2:"",
    FTP_TRL_INS_ID2:"",
    FTP_TRL_SRNO3:"",
    FTP_TRL_INS_NAME3:"",
    FTP_TRL_INS_ID3:"",
    FTP_TRIAL_WINO:"",
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
            FTP_EPOXY_0D1: res?.data[0]?.FTP_EPOXY_0D1,
            FTP_EPOXY_0D2: res?.data[0]?.FTP_EPOXY_0D2,
            FTP_EPOXY_0D3: res?.data[0]?.FTP_EPOXY_0D3,
            FTP_EPOXY_90D1: res?.data[0]?.FTP_EPOXY_90D1,
            FTP_EPOXY_90D2: res?.data[0]?.FTP_EPOXY_90D2,
            FTP_EPOXY_90D3: res?.data[0]?.FTP_EPOXY_90D3,
            FTP_EPOXY_180D1: res?.data[0]?.FTP_EPOXY_180D1,
            FTP_EPOXY_180D2: res?.data[0]?.FTP_EPOXY_180D2,
            FTP_EPOXY_180D3: res?.data[0]?.FTP_EPOXY_180D3,
            FTP_EPOXY_270D1: res?.data[0]?.FTP_EPOXY_270D1,
            FTP_EPOXY_270D2: res?.data[0]?.FTP_EPOXY_270D2,
            FTP_EPOXY_270D3: res?.data[0]?.FTP_EPOXY_270D3,
            FTP_ADHESIV_0D1: res?.data[0]?.FTP_ADHESIV_0D1,
            FTP_ADHESIV_0D2: res?.data[0]?.FTP_ADHESIV_0D2,
            FTP_ADHESIV_0D3: res?.data[0]?.FTP_ADHESIV_0D3,
            FTP_ADHESIV_90D1: res?.data[0]?.FTP_ADHESIV_90D1,
            FTP_ADHESIV_90D2: res?.data[0]?.FTP_ADHESIV_90D2,
            FTP_ADHESIV_90D3: res?.data[0]?.FTP_ADHESIV_90D3,
            FTP_ADHESIV_180D1: res?.data[0]?.FTP_ADHESIV_180D1,
            FTP_ADHESIV_180D2: res?.data[0]?.FTP_ADHESIV_180D2,
            FTP_ADHESIV_180D3: res?.data[0]?.FTP_ADHESIV_180D3,
            FTP_ADHESIV_270D1: res?.data[0]?.FTP_ADHESIV_270D1,
            FTP_ADHESIV_270D2: res?.data[0]?.FTP_ADHESIV_270D2,
            FTP_ADHESIV_270D3: res?.data[0]?.FTP_ADHESIV_270D3,
            FTP_TOTCOAT_0D1: res?.data[0]?.FTP_TOTCOAT_0D1,
            FTP_TOTCOAT_0D2: res?.data[0]?.FTP_TOTCOAT_0D2,
            FTP_TOTCOAT_0D3: res?.data[0]?.FTP_TOTCOAT_0D3,
            FTP_TOTCOAT_90D1: res?.data[0]?.FTP_TOTCOAT_90D1,
            FTP_TOTCOAT_90D2: res?.data[0]?.FTP_TOTCOAT_90D2,
            FTP_TOTCOAT_90D3: res?.data[0]?.FTP_TOTCOAT_90D3,
            FTP_TOTCOAT_180D1: res?.data[0]?.FTP_TOTCOAT_180D1,
            FTP_TOTCOAT_180D2: res?.data[0]?.FTP_TOTCOAT_180D2,
            FTP_TOTCOAT_180D3: res?.data[0]?.FTP_TOTCOAT_180D3,
            FTP_TOTCOAT_270D1: res?.data[0]?.FTP_TOTCOAT_270D1,
            FTP_TOTCOAT_270D2: res?.data[0]?.FTP_TOTCOAT_270D2,
            FTP_TOTCOAT_270D3: res?.data[0]?.FTP_TOTCOAT_270D3,
            FTP_TRL_SRNO1: res?.data[0]?.FTP_TRL_SRNO1,
            FTP_TRL_INS_NAME1: res?.data[0]?.FTP_TRL_INS_NAME1,
            FTP_TRL_INS_ID1: res?.data[0]?.FTP_TRL_INS_ID1,
            FTP_TRL_SRNO2: res?.data[0]?.FTP_TRL_SRNO2,
            FTP_TRL_INS_NAME2: res?.data[0]?.FTP_TRL_INS_NAME2,
            FTP_TRL_INS_ID2: res?.data[0]?.FTP_TRL_INS_ID2,
            FTP_TRL_SRNO3: res?.data[0]?.FTP_TRL_SRNO3,
            FTP_TRL_INS_NAME3: res?.data[0]?.FTP_TRL_INS_NAME3,
            FTP_TRL_INS_ID3: res?.data[0]?.FTP_TRL_INS_ID3,
            FTP_TRIAL_WINO: res?.data[0]?.FTP_TRIAL_WINO,
          }));
         
        })

        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };
  useEffect(() => {
    mdHolDetData = holDetData;
  }, [holDetData]); 

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
              EPOXY THICKNESS (micron)	
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
     POSITION 0 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_0D1"
     value={holDetData?.FTP_EPOXY_0D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_0D1: e.target.value?.toUpperCase(),
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
     POSITION 0 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_0D2"
     value={holDetData?.FTP_EPOXY_0D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_0D2: e.target.value?.toUpperCase(),
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
     POSITION 0 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_0D3"
     value={holDetData?.FTP_EPOXY_0D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_0D3: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_90D1"
     value={holDetData?.FTP_EPOXY_90D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_90D1: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_90D2"
     value={holDetData?.FTP_EPOXY_90D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_90D2: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_90D3"
     value={holDetData?.FTP_EPOXY_90D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_90D3: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_180D1"
     value={holDetData?.FTP_EPOXY_180D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_180D1: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_180D2"
     value={holDetData?.FTP_EPOXY_180D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_180D2: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_180D3"
     value={holDetData?.FTP_EPOXY_180D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_180D3: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_270D1"
     value={holDetData?.FTP_EPOXY_270D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_270D1: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_270D2"
     value={holDetData?.FTP_EPOXY_270D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_270D2: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_EPOXY_270D3"
     value={holDetData?.FTP_EPOXY_270D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_EPOXY_270D3: e.target.value?.toUpperCase(),
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
          EPOXY  + ADHESIVE THICKNESS (micron)	
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
     POSITION 0 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_0D1"
     value={holDetData?.FTP_ADHESIV_0D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_0D1: e.target.value?.toUpperCase(),
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
     POSITION 0 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_0D2"
     value={holDetData?.FTP_ADHESIV_0D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_0D2: e.target.value?.toUpperCase(),
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
     POSITION 0 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_0D3"
     value={holDetData?.FTP_ADHESIV_0D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_0D3: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_90D1"
     value={holDetData?.FTP_ADHESIV_90D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_90D1: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_90D2"
     value={holDetData?.FTP_ADHESIV_90D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_90D2: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_90D3"
     value={holDetData?.FTP_ADHESIV_90D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_90D3: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_180D1"
     value={holDetData?.FTP_ADHESIV_180D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_180D1: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_180D2"
     value={holDetData?.FTP_ADHESIV_180D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_180D2: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_180D3"
     value={holDetData?.FTP_ADHESIV_180D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_180D3: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_270D1"
     value={holDetData?.FTP_ADHESIV_270D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_270D1: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_270D2"
     value={holDetData?.FTP_ADHESIV_270D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_270D2: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_ADHESIV_270D3"
     value={holDetData?.FTP_ADHESIV_270D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_ADHESIV_270D3: e.target.value?.toUpperCase(),
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
          TOTAL COATING THICKNESS (mm)
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
     POSITION 0 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_0D1"
     value={holDetData?.FTP_TOTCOAT_0D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_0D1: e.target.value?.toUpperCase(),
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
     POSITION 0 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_0D2"
     value={holDetData?.FTP_TOTCOAT_0D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_0D2: e.target.value?.toUpperCase(),
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
     POSITION 0 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_0D3"
     value={holDetData?.FTP_TOTCOAT_0D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_0D3: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_90D1"
     value={holDetData?.FTP_TOTCOAT_90D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_90D1: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_90D2"
     value={holDetData?.FTP_TOTCOAT_90D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_90D2: e.target.value?.toUpperCase(),
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
     POSITION 90 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_90D3"
     value={holDetData?.FTP_TOTCOAT_90D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_90D3: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_180D1"
     value={holDetData?.FTP_TOTCOAT_180D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_180D1: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_180D2"
     value={holDetData?.FTP_TOTCOAT_180D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_180D2: e.target.value?.toUpperCase(),
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
     POSITION 180 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_180D3"
     value={holDetData?.FTP_TOTCOAT_180D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_180D3: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 1
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_270D1"
     value={holDetData?.FTP_TOTCOAT_270D1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_270D1: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 2
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_270D2"
     value={holDetData?.FTP_TOTCOAT_270D2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_270D2: e.target.value?.toUpperCase(),
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
     POSITION 270 degree 3
   </MDTypography>
 </Grid>
 <Grid item xs={5}>
   <MDInput
     fullWidth
     id="FTP_TOTCOAT_270D3"
     value={holDetData?.FTP_TOTCOAT_270D3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TOTCOAT_270D3: e.target.value?.toUpperCase(),
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
          USED INSTRUMENT
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
        <Grid item xs={12} md={1.5}>
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
     SR.NO
   </MDTypography>
 </Grid>
 <Grid item xs={6}>
   <MDInput
     fullWidth
     id="FTP_TRL_SRNO1"
     value={holDetData?.FTP_TRL_SRNO1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_SRNO1: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
<Grid item xs={12} md={5}>
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
     Instrument Name
   </MDTypography>
 </Grid>
 <Grid item xs={8}>
   <MDInput
     fullWidth
     id="FTP_TRL_INS_NAME1"
     value={holDetData?.FTP_TRL_INS_NAME1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_INS_NAME1: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
<Grid item xs={12} md={5}>
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
 <Grid item xs={6}>
   <MDInput
     fullWidth
     id="FTP_TRL_INS_ID1"
     value={holDetData?.FTP_TRL_INS_ID1}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_INS_ID1: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>

        <Grid item xs={12} md={1.5}>
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
     SR.NO
   </MDTypography>
 </Grid>
 <Grid item xs={6}>
   <MDInput
     fullWidth
     id="FTP_TRL_SRNO2"
     value={holDetData?.FTP_TRL_SRNO2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_SRNO2: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
<Grid item xs={12} md={5}>
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
     Instrument Name
   </MDTypography>
 </Grid>
 <Grid item xs={8}>
   <MDInput
     fullWidth
     id="FTP_TRL_INS_NAME2"
     value={holDetData?.FTP_TRL_INS_NAME2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_INS_NAME2: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
<Grid item xs={12} md={5}>
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
 <Grid item xs={6}>
   <MDInput
     fullWidth
     id="FTP_TRL_INS_ID2"
     value={holDetData?.FTP_TRL_INS_ID2}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_INS_ID2: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
        <Grid item xs={12} md={1.5}>
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
     SR.NO
   </MDTypography>
 </Grid>
 <Grid item xs={6}>
   <MDInput
     fullWidth
     id="FTP_TRL_SRNO3"
     value={holDetData?.FTP_TRL_SRNO3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_SRNO3: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
<Grid item xs={12} md={5}>
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
     Instrument Name
   </MDTypography>
 </Grid>
 <Grid item xs={8}>
   <MDInput
     fullWidth
     id="FTP_TRL_INS_NAME3"
     value={holDetData?.FTP_TRL_INS_NAME3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_INS_NAME3: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
<Grid item xs={12} md={5}>
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
 <Grid item xs={6}>
   <MDInput
     fullWidth
     id="FTP_TRL_INS_ID3"
     value={holDetData?.FTP_TRL_INS_ID3}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRL_INS_ID3: e.target.value?.toUpperCase(),
       });
     }}
     style={{ marginLeft: "8px" }}
   />
 </Grid>
</Grid>
</Grid>
<Grid item xs={12} md={6.5}>
<Grid container alignItems="center" spacing={1}>
  <Grid item xs={2.7}>
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
 <Grid item xs={8.9}>
   <MDInput
     fullWidth
     id="FTP_TRIAL_WINO"
     value={holDetData?.FTP_TRIAL_WINO}
     disabled={false}
     onChange={(e) => {
       setHolDetData({
         ...holDetData,
         FTP_TRIAL_WINO: e.target.value?.toUpperCase(),
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
export {  mdHolDetData };