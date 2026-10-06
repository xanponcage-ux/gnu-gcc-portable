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

let sdHolDetData = null;

export default function LDLTS005SD(props) {
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
    EIT_EPOXY_HOLIDAY_TEST:"",
    EIT_EPOXY_WINO:"",
    EIT_EPX_SRNO1:"",
    EIT_EPX_INS_NAME1:"",
    EIT_EPX_INS_ID1:"",
    EIT_CROSS_CUT_TEST:"",
    EIT_CROSS_WINO:"",
    EIT_CSC_SRNO1:"",
    EIT_CSC_INS_NAME1:"",
    EIT_CSC_INS_ID1:"",
    EIT_IMPACT_TEST:"",
    EIT_IMPACT_WINO:"",
    EIT_IMP_SRNO1:"",
    EIT_IMP_INS_NAME1:"",
    EIT_IMP_INS_ID1:"",
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
      EIT_EPOXY_HOLIDAY_TEST:"",
      EIT_EPOXY_WINO:"",
      EIT_EPX_SRNO1:"",
      EIT_EPX_INS_NAME1:"",
      EIT_EPX_INS_ID1:"",
      EIT_CROSS_CUT_TEST:"",
      EIT_CROSS_WINO:"",
      EIT_CSC_SRNO1:"",
      EIT_CSC_INS_NAME1:"",
      EIT_CSC_INS_ID1:"",
      EIT_IMPACT_TEST:"",
      EIT_IMPACT_WINO:"",
      EIT_IMP_SRNO1:"",
      EIT_IMP_INS_NAME1:"",
      EIT_IMP_INS_ID1:"",
    }));
    
  };

  useEffect(() => {
    sdHolDetData = holDetData;
  }, [holDetData]); 

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
            // PRD_DATE_120: res?.data[0]?.PRD_DATE_120,
            // PRD_SHIFT_120: res?.data[0]?.PRD_SHIFT_120,
            EIT_EPOXY_HOLIDAY_TEST:res?.data[0]?.EIT_EPOXY_HOLIDAY_TEST,
            EIT_EPOXY_WINO:res?.data[0]?.EIT_EPOXY_WINO,
            EIT_EPX_SRNO1:res?.data[0]?.EIT_EPX_SRNO1,
            EIT_EPX_INS_NAME1:res?.data[0]?.EIT_EPX_INS_NAME1,
            EIT_EPX_INS_ID1:res?.data[0]?.EIT_EPX_INS_ID1,
            EIT_CROSS_CUT_TEST:res?.data[0]?.EIT_CROSS_CUT_TEST,
            EIT_CROSS_WINO:res?.data[0]?.EIT_CROSS_WINO,
            EIT_CSC_SRNO1:res?.data[0]?.EIT_CSC_SRNO1,
            EIT_CSC_INS_NAME1:res?.data[0]?.EIT_CSC_INS_NAME1,
            EIT_CSC_INS_ID1:res?.data[0]?.EIT_CSC_INS_ID1,
            EIT_IMPACT_TEST:res?.data[0]?.EIT_IMPACT_TEST,
            EIT_IMPACT_WINO:res?.data[0]?.EIT_IMPACT_WINO,
            EIT_IMP_SRNO1:res?.data[0]?.EIT_IMP_SRNO1,
            EIT_IMP_INS_NAME1:res?.data[0]?.EIT_IMP_INS_NAME1,
            EIT_IMP_INS_ID1:res?.data[0]?.EIT_IMP_INS_ID1,
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
          Epoxy Holiday Test
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
        <Grid item xs={12} md={7.5}>
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
         Achieved Value
       </MDTypography>
     </Grid>
     <Grid item xs={9.2}>
       <MDInput
         fullWidth
         id="EIT_EPOXY_HOLIDAY_TEST"
         value={holDetData?.EIT_EPOXY_HOLIDAY_TEST}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_EPOXY_HOLIDAY_TEST: e.target.value?.toUpperCase(),
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
         Procedure / WI No.
       </MDTypography>
     </Grid>
     <Grid item xs={8.25}>
       <MDInput
         fullWidth
         id="EIT_EPOXY_WINO"
         value={holDetData?.EIT_EPOXY_WINO}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_EPOXY_WINO: e.target.value?.toUpperCase(),
           });
         }}
         style={{ marginLeft: "8px" }}
       />
     </Grid>
   </Grid>
 </Grid>
   <Grid item xs={12} md={1.5}>
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
         SR.NO
       </MDTypography>
     </Grid>
     <Grid item xs={6}>
       <MDInput
         fullWidth
         id="EIT_EPX_SRNO1"
         value={holDetData?.EIT_EPX_SRNO1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_EPX_SRNO1: e.target.value?.toUpperCase(),
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
         Instrument Name
       </MDTypography>
     </Grid>
     <Grid item xs={8}>
       <MDInput
         fullWidth
         id="EIT_EPX_INS_NAME1"
         value={holDetData?.EIT_EPX_INS_NAME1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_EPX_INS_NAME1: e.target.value?.toUpperCase(),
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
         Instrument Id /No.
       </MDTypography>
     </Grid>
     <Grid item xs={8.25}>
       <MDInput
         fullWidth
         id="EIT_EPX_INS_ID1"
         value={holDetData?.EIT_EPX_INS_ID1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_EPX_INS_ID1: e.target.value?.toUpperCase(),
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
          Cross Cut Test Report	
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
        <Grid item xs={12} md={7.5}>
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
         Achieved Value
       </MDTypography>
     </Grid>
     <Grid item xs={9.2}>
       <MDInput
         fullWidth
         id="EIT_CROSS_CUT_TEST"
         value={holDetData?.EIT_CROSS_CUT_TEST}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_CROSS_CUT_TEST: e.target.value?.toUpperCase(),
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
         Procedure / WI No.
       </MDTypography>
     </Grid>
     <Grid item xs={8.25}>
       <MDInput
         fullWidth
         id="EIT_CROSS_WINO"
         value={holDetData?.EIT_CROSS_WINO}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_CROSS_WINO: e.target.value?.toUpperCase(),
           });
         }}
         style={{ marginLeft: "8px" }}
       />
     </Grid>
   </Grid>
 </Grid>
   <Grid item xs={12} md={1.5}>
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
         SR.NO
       </MDTypography>
     </Grid>
     <Grid item xs={6}>
       <MDInput
         fullWidth
         id="EIT_CSC_SRNO1"
         value={holDetData?.EIT_CSC_SRNO1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_CSC_SRNO1: e.target.value?.toUpperCase(),
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
         Instrument Name
       </MDTypography>
     </Grid>
     <Grid item xs={8}>
       <MDInput
         fullWidth
         id="EIT_CSC_INS_NAME1"
         value={holDetData?.EIT_CSC_INS_NAME1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_CSC_INS_NAME1: e.target.value?.toUpperCase(),
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
         Instrument Id /No.
       </MDTypography>
     </Grid>
     <Grid item xs={8.25}>
       <MDInput
         fullWidth
         id="EIT_CSC_INS_ID1"
         value={holDetData?.EIT_CSC_INS_ID1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_CSC_INS_ID1: e.target.value?.toUpperCase(),
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
              Impact Test Report	
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
        <Grid item xs={12} md={7.5}>
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
         Achieved Value
       </MDTypography>
     </Grid>
     <Grid item xs={9.2}>
       <MDInput
         fullWidth
         id="EIT_IMPACT_TEST"
         value={holDetData?.EIT_IMPACT_TEST}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_IMPACT_TEST: e.target.value?.toUpperCase(),
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
         Procedure / WI No.
       </MDTypography>
     </Grid>
     <Grid item xs={8.25}>
       <MDInput
         fullWidth
         id="EIT_IMPACT_WINO"
         value={holDetData?.EIT_IMPACT_WINO}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_IMPACT_WINO: e.target.value?.toUpperCase(),
           });
         }}
         style={{ marginLeft: "8px" }}
       />
     </Grid>
   </Grid>
 </Grid>
   <Grid item xs={12} md={1.5}>
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
         SR.NO
       </MDTypography>
     </Grid>
     <Grid item xs={6}>
       <MDInput
         fullWidth
         id="EIT_IMP_SRNO1"
         value={holDetData?.EIT_IMP_SRNO1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_IMP_SRNO1: e.target.value?.toUpperCase(),
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
         Instrument Name
       </MDTypography>
     </Grid>
     <Grid item xs={8}>
       <MDInput
         fullWidth
         id="EIT_IMP_INS_NAME1"
         value={holDetData?.EIT_IMP_INS_NAME1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_IMP_INS_NAME1: e.target.value?.toUpperCase(),
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
         Instrument Id /No.
       </MDTypography>
     </Grid>
     <Grid item xs={8.25}>
       <MDInput
         fullWidth
         id="EIT_IMP_INS_ID1"
         value={holDetData?.EIT_IMP_INS_ID1}
         disabled={false}
         onChange={(e) => {
           setHolDetData({
             ...holDetData,
             EIT_IMP_INS_ID1: e.target.value?.toUpperCase(),
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
export {  sdHolDetData };