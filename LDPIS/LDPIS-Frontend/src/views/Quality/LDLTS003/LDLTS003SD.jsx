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
import SaveIcon from "@mui/icons-material/Save";

export default function LDLTS003SD(props) {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [expandData, setExpandData] = useState(true);
  const [expandSalesData, setExpandSalesData] = useState(true);

  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [markNm, setMarkNm] = useState(null);
  const [markBrand, setMarkBrand] = useState(null);
  const [licNo, setLicNo] = useState(null);

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

      const url = "api/LDLTS003/getOrdDetailSD";
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
            od: res?.data[0]?.ODIA?.toFixed(3) || "",
            spec: res?.data[0]?.SPEC || "",
            thk: res?.data[0]?.THICK || "",
            testPres: res?.data[0]?.TPS_SD_TEST_PRESSURE || "",
            grade: res?.data[0]?.GRADE || "",
            dest: res?.data[0]?.TPS_SD_DESTN || "",
            specGrade: res?.data[0]?.TPS_SD_SPEC_GRD || "",
            poRefNo: res?.data[0]?.TPS_SD_REF_NO || "",
          }));
          setMarkNm(res?.data[0]?.TPS_MARKING_NM);
          setMarkBrand(res?.data[0]?.TPS_MARKING_BRAND);
          setLicNo(res?.data[0]?.TPS_LICENSE_NO);
        })

        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  const updateData = async (ordId, itemNo) => {
    let data1 = {
      orderId: ordId,
      itemNo: itemNo,
      markNm: markNm ?? "",
      markBrand: markBrand ?? "",
      licNo: licNo ?? "",
      user: serverDetails?.PersonalNo,
    };

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS003/updateData";
      axiosAPI
        .post(url, data1, defaultOptions)
        .then((res) => {
          if (res.statusText !== "OK") {
            alertify.error("Error fetching Data");
            return;
          }
          if (res?.data?.rowsAffected > 0) {
            alertify.success("Updated!");
            handleDisplay(props.ordId, props.itemNo);
            return;
          } else {
            alertify.error("Failed");
            return;
          }
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
    }));
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Process Entry Sheet (Bare)"
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
                                genSalesData({
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
                                genSalesData({
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
                                genSalesData({
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
                                genSalesData({
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
                                genSalesData({
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
                                genSalesData({
                                  ...genSalesData,
                                  ordQnt: e.target.value?.toUpperCase(),
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
                                genSalesData({
                                  ...genSalesData,
                                  crtOn: e.target.value?.toUpperCase(),
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
                                genSalesData({
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
                                genSalesData({
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
                                genSalesData({
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
                                genSalesData({
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
                              Test Pressure
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="testPres"
                              value={genSalesData?.testPres}
                              disabled={true}
                              onChange={(e) => {
                                genSalesData({
                                  ...genSalesData,
                                  testPres: e.target.value?.toUpperCase(),
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
                                genSalesData({
                                  ...genSalesData,
                                  grade: e.target.value?.toUpperCase(),
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
                                genSalesData({
                                  ...genSalesData,
                                  dest: e.target.value?.toUpperCase(),
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
                                genSalesData({
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
                                genSalesData({
                                  ...genSalesData,
                                  poRefNo: e.target.value?.toUpperCase(),
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

            {/* Input Data */}
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={0}
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
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                      <Tooltip title={"Update"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          onClick={() =>
                            updateData(props?.ordId, props?.itemNo)
                          }
                          size="small"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={expandData ? "Hide" : "Show"}>
                        <IconButton
                          color="white"
                          aria-label="toggle"
                          size="small"
                          onClick={() => setExpandData(!expandData)}
                        >
                          {expandData ? (
                            <ExpandLessIcon fontSize="small" />
                          ) : (
                            <ExpandMoreIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>

                {expandData && (
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      {/* Input fields */}
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
                              Marking Name
                            </MDTypography>
                          </Grid>
                          <Grid item xs={9}>
                            <MDInput
                              fullWidth
                              id="markNm"
                              value={markNm}
                              onChange={(e) => {
                                setMarkNm(e.target.value);
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
                              Marking Brand
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="markBrand"
                              value={markBrand}
                              onChange={(e) => {
                                setMarkBrand(e.target.value);
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
                              Licence No.
                            </MDTypography>
                          </Grid>
                          <Grid item xs={6}>
                            <MDInput
                              fullWidth
                              id="licNo"
                              value={licNo}
                              onChange={(e) => {
                                setLicNo(e.target.value);
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
