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

export default function LDLTS004SD(props) {
  console.log("props: ", props);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandSalesData, setExpandSalesData] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });

  const [genSalesData, setGenSalesData] = useState({
    custCd: "",
    custDesc: "",
    qapNum: "",
    poNum: "",
    procShtNum: "",
    ordQnt: "",
    crtOn: "",
    lenMtr: "",
    od: "",
    spec: "",
    thk: "",
    testPres: "",
    grade: "",
    dest: "",
    specGrade: "",
    poRefNo: "",
    coattype: "",
    poitemNo: "",
    inspAgency: "",
    TCP_CP1_CO_APPLI: "",
  });

  //page load
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

  const handleDisplay = async (ordId, itemNo) => {
    if (ordId === "" || itemNo === "") {
      handleClearAll();
    }

    let data1 = {
      orderId: ordId,
      itemNo: itemNo,
    };

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS004/getOrdDetailSD";
      axiosAPI
        .post(url, data1, defaultOptions)
        .then((res) => {
          console.log("res: ", res?.data[0]?.CREATE_ON);
          if (res.statusText !== "OK") {
            alertify.error("Error fetching Data");
            return;
          }
          if (res?.data?.length === 0) {
            alertify.error("No Data Found!");
            handleClearAll();
            return;
          }
          setGenSalesData((prevState) => ({
            ...prevState,
            custCd: res?.data[0]?.CUST_CD || "",
            custDesc: res?.data[0]?.CUST_DESC || "",
            qapNum: res?.data[0]?.TPS_SD_QAP_NO || "",
            poNum: filterData?.saleOrd?.value || "",
            procShtNum: res?.data[0]?.TPS_SD_PROC_SHEET || "",
            ordQnt: res?.data[0]?.QUANTITY?.toFixed(3) || "",
            crtOn: res?.data[0]?.CREATE_ON || "",
            lenMtr: res?.data[0]?.LEN || "",
            od: res?.data[0]?.ODIA || "",
            spec: res?.data[0]?.SPEC || "",
            thk: res?.data[0]?.THICK || "",
            testPres: res?.data[0]?.TPS_SD_TEST_PRESSURE || "",
            grade: res?.data[0]?.GRADE || "",
            dest: res?.data[0]?.TPS_SD_DESTN || "",
            specGrade: res?.data[0]?.TPS_SD_SPEC_GRD || "",
            poRefNo: res?.data[0]?.TPS_SD_REF_NO || "",
            coattype: res?.data[0]?.TCP_SD_IC_TYPE,
            poitemNo: res?.data[0]?.TCP_PO_ITEM_NO,
            inspAgency: res?.data[0]?.TCP_SD_INSP_AGEN,
            TCP_CP1_CO_APPLI: res?.data[0]?.TCP_CP1_CO_APPLI || "",
          }));

          // Temporary duplication: if SD response doesn't include TCP_CP1_CO_APPLI, fetch it from MD endpoint
          const urlMD = "api/LDLTS004/getOrdDetailMD";
          axiosAPI
            .post(urlMD, data1, defaultOptions)
            .then((resMD) => {
              if (resMD?.data?.length > 0) {
                setGenSalesData((prevState) => ({
                  ...prevState,
                  TCP_CP1_CO_APPLI: resMD?.data[0]?.TCP_CP1_CO_APPLI || "",
                }));
              }
            })
            .catch((err) => {
              // ignore MD fetch errors for now (temporary duplication)
            });
        })

        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  const handleClearAll = () => {
    // setFilterData((prevState) => ({
    //   ...prevState,
    //   saleOrd: null,
    //   item: null,
    //   delCond: null,
    // }));
    setGenSalesData((prevState) => ({
      ...prevState,
      custCd: "",
      custDesc: "",
      qapNum: "",
      poNum: "",
      procShtNum: "",
      ordQnt: "",
      crtOn: "",
      lenMtr: "",
      od: "",
      spec: "",
      thk: "",
      testPres: "",
      grade: "",
      dest: "",
      specGrade: "",
      poRefNo: "",
      coattype: "",
      poitemNo: "",
      inspAgency: "",
    }));
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
            {/* General Sales Data Grid */}
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
                        General Sales Data
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title={expandSalesData ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() => setExpandSalesData(!expandSalesData)}
                        >
                          {expandSalesData ? (
                            <ExpandLessIcon />
                          ) : (
                            <ExpandMoreIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandSalesData && (
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
                              Customer
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2.5}>
                            <MDInput
                              fullWidth
                              id="custCd"
                              value={genSalesData?.custCd}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  custCd: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                          <Grid item xs={6.5}>
                            <MDInput
                              fullWidth
                              id="custDesc"
                              value={genSalesData?.custDesc}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  custDesc: e.target.value?.toUpperCase(),
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
                              QAP Number
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="qapNum"
                              value={genSalesData?.qapNum}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  qapNum: e.target.value?.toUpperCase(),
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
                              PO Number
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="poNum"
                              value={genSalesData?.poNum}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  poNum: e.target.value?.toUpperCase(),
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
                              Process Sheet No
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="procShtNum"
                              value={genSalesData?.procShtNum}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  procShtNum: e.target.value?.toUpperCase(),
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
                              Order Quantity
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="ordQnt"
                              value={genSalesData?.ordQnt}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  ordQnt: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* <Grid item xs={12} md={6}>
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
                              Created On
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="crtOn"
                              value={genSalesData?.crtOn}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  crtOn: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid> */}
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
                              Len (MTR)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="lenMtr"
                              value={genSalesData?.lenMtr}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  lenMtr: e.target.value?.toUpperCase(),
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
                              OD (MM)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="od"
                              value={genSalesData?.od}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  od: e.target.value?.toUpperCase(),
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
                              Specification
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="spec"
                              value={genSalesData?.spec}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  spec: e.target.value?.toUpperCase(),
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
                              Thick (MM)
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="thk"
                              value={genSalesData?.thk}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  thk: e.target.value?.toUpperCase(),
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
                              Grade
                            </MDTypography>
                          </Grid>
                          <Grid item xs={5}>
                            <MDInput
                              fullWidth
                              id="grade"
                              value={genSalesData?.grade}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  grade: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      {/* <Grid item xs={12} md={6}>
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
                              Destination
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="dest"
                              value={genSalesData?.dest}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  dest: e.target.value?.toUpperCase(),
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>  */}
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
                              Coating Type
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="coattype"
                              value={genSalesData?.coattype} // CHANGE$
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  coattype: e.target.value?.toUpperCase(), // CHANGE$
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
                              Spec.& Grade
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="specGrade"
                              value={genSalesData?.specGrade}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  specGrade: e.target.value?.toUpperCase(),
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
                              PO Ref No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="poRefNo"
                              value={genSalesData?.poRefNo}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  poRefNo: e.target.value?.toUpperCase(),
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
                              PO Item No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="poitemNo"
                              value={genSalesData?.poitemNo}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  poitemNo: e.target.value?.toUpperCase(), //CHANGE$
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
                              Inspection Agency
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="inspAgency"
                              value={genSalesData?.inspAgency}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  inspAgency: e.target.value?.toUpperCase(), //CHANGE$
                                });
                              }}
                              style={{ marginLeft: "8px" }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* Moved field: Project Name (was Coating Application in CP1). Placed below Inspection Agency */}
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
                              Project Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="TCP_CP1_CO_APPLI"
                              value={genSalesData?.TCP_CP1_CO_APPLI}
                              disabled={true}
                              onChange={(e) => {
                                setGenSalesData({
                                  ...genSalesData,
                                  TCP_CP1_CO_APPLI: e.target.value?.toUpperCase(),
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
