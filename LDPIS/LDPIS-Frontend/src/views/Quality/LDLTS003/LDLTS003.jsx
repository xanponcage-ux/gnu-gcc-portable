import React, { useEffect, useState } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DeleteIcon from '@mui/icons-material/Delete';
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import { GetAuthorization } from "../../../utils";
import routes from "routes";
import axiosAPI from "../../../axiosAPI";
import serverDetails from "../../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../../tabulatorCss.scss";
import MDInput from "components/MDInput";
import { AppBar, Tab, Tabs } from "@mui/material";
import TabIcon from "@mui/icons-material/Tab";
import LDLTS003LD from "./LDLTS003LD";
import LDLTS003ID from "./LDLTS003ID";
import LDLTS003MD from "./LDLTS003MD";
import LDLTS003GD from "./LDLTS003GD";
import LDLTS003SD from "./LDLTS003SD";

export default function LDLTS003() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);

  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [expandData, setExpandData] = useState(true);
  const [filterData, setFilterData] = useState({
    saleOrd: null,
    item: null,
    delCond: null,
  });
  const [salesOrdId, setSalesOrdId] = useState([]);
  const [itemData, setItemData] = useState([]);

  const [tabValue, setTabValue] = useState(0);

  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        validateUser(token);
        //page load functions here
        getOrderId(token.accessToken);
      });
    }
    fetchData();
  }, []);

  const validateUser = async (token) => {
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          token.refreshToken,
          serverDetails.REFRESH_KEY
        );

        plant = userDetails.payload.plant;
        serverDetails.PersonalNo = userDetails.payload.id;
        serverDetails.Plant = userDetails.payload.plant;
        serverDetails.Company = userDetails.payload.company;
      }

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LDLTS003";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML == "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW") {
            setReadWriteAccess(false);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
            setReadWriteAccess(true);
            alertify.error(
              "You are not authorized to make changes from this page"
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page"
          );
        }
        // }
      } else {
        setRestricted(true);
        setAdmin(false);
      }
    } catch {
      setRestricted(true);
      setAdmin(false);
      if (serverDetails.devMode == false) {
        window.location.href = "#/signin";
      }
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/users/screenAuth";

      if (serverDetails.devMode == true) {
        //(userId = "198447"), (pageName = "TSMCPPF001");
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          reject(null);
        } else {
          var encryptUserInfo = response.data;
          var authDetails = jwt.verify(
            encryptUserInfo,
            serverDetails.SCREEN_AUTH_KEY
          );
          if (authDetails) {
            resolve(authDetails);
          } else {
            reject(null);
          }
        }
      });
    });

  const getOrderId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        plant: "0780",
      };
      var url = "api/LDLTS003/getOrderId";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error fetching Data");
            return;
          } else {
            var items = [];
            res?.data?.map((row) => {
              var obj = new Object();
              obj.label = row.ENC_ID_ORDER;
              obj.value = row.ENC_ID_ORDER;
              items.push(obj);
            });
            setSalesOrdId(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getItemNo = (accessToken, ordId) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        orderId: ordId,
      };
      var url = "api/LDLTS003/getItemNo";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error fetching Data");
            return;
          } else {
            console.log("res.data: ", res.data);
            var items = [];
            res?.data?.map((row) => {
              var obj = new Object();
              obj.label = row.ENC_NO_ITEM;
              obj.value = row.ENC_NO_ITEM;
              items.push(obj);
            });
            setItemData(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const DeleteProcesssheet = async () => {

    const ordId = filterData?.saleOrd?.value;
    const itemNo = filterData?.item?.value;
    const pno = serverDetails.PersonalNo;

    if (!ordId || !itemNo) {
      alertify.error("Please select both Sales Order and Item");
      return;
    }

    let data1 = {
      orderId: ordId,
      itemNo: itemNo,
      pno: pno
    };
    // console.log(data1);

    GetAuthorization().then((token) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LDLTS003/DeleteProcesssheet";
      axiosAPI
        .post(url, data1, defaultOptions)
        .then((res) => {
          if (res.statusText !== "OK") {
            alertify.error("Error fetching Data");
            return;
          }
          if (res?.data?.rowsAffected > 0) {
            alertify.success("Process Sheet Deleted!");
            // setSalesOrdId();
            // setItemData([]);
            // Optional: Refresh data or clear filters here
            return;
          } else {
            alertify.error("Failed to delete process sheet");
            return;
          }
        })
        .catch((error) => alertify.error("Error fetching data: " + error));
    });
  };

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };

  const handlesalesOrdChange = async (e) => {
    // Update state with sale order and reset item
    setFilterData((prevState) => ({
      ...prevState,
      saleOrd: e,
      item: null, // Reset item when saleOrd is changed
    }));

    if (e) {
      await GetAuthorization().then((token) => {
        validateUser(token);
        getItemNo(token.accessToken, e.value);
      });
    } else {
      // If e is null, reset both saleOrd and item to null
      setFilterData((prevState) => ({
        ...prevState,
        saleOrd: null,
        item: null,
      }));
      handleClearAll();
    }
  };

  const handleItemChange = (e) => {
    setFilterData((prevState) => ({
      ...prevState,
      item: e,
    }));
    if (e === null) {
      handleClearAll();
      return;
    }
  };

  const handleDelCondChange = (e) => {
    setFilterData({ ...delCond, delCond: e.target.value.toUpperCase() });
  };

  // const downloadTableExcel = () => {
  //   if (tableData.length == 0) {
  //     alertify.error("No Data exists in table for Downloading");
  //     return;
  //   }
  //   var date = new Date();
  //   var fileName = "Pipe Decision" + ".xlsx";
  //   table.download("xlsx", fileName, {
  //     sheetName: "Sheet1",
  //   });
  // };

  // const handleClearAll = (newToken = false) => {
  //   // setSelectedPlant([]);
  //   setBatchId("");
  //   setMBatch("");
  //   setTableData([,]);
  //   setTable(null);
  // };

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
      {isRestricted && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}
      {isRestricted == false && (
        <>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={4}>
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
                      <Grid item xs={10}>
                        <MDTypography variant="h6" color="white">
                          Filter
                        </MDTypography>
                      </Grid>

                      <Grid item>
                        <Tooltip title="Delete Process Sheet">
                          <IconButton
                            color="white"
                             onClick={DeleteProcesssheet}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>

                      <Grid item>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleClearAll(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>



                    </Grid>
                  </MDBox>

                  {/* {expandData && ( */}
                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={1}>
                        <Grid item xs={12} md={3}>
                          <Grid container alignItems="center" spacing={1}>
                            <Grid item xs={4} zs={10}>
                              <MDTypography
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Sales Order
                              </MDTypography>
                            </Grid>
                            <Grid item xs={7.5}>
                              <ReactSelect
                                id="saleOrd"
                                options={salesOrdId}
                                onChange={handlesalesOrdChange}
                                value={filterData?.saleOrd}
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Item
                              </MDTypography>
                            </Grid>
                            <Grid item xs={6}>
                              <ReactSelect
                                id="item"
                                options={itemData}
                                onChange={handleItemChange}
                                value={filterData?.item}
                                style={{ marginLeft: "8px" }}
                              />
                              {/* <MDInput
                                  id="item"
                                  value={filterData?.item}
                                  onChange={(e) => {
                                    handleItemChange(e);
                                  }}
                                  style={{ marginLeft: "8px" }} // Optional: add some spacing between label and input
                                /> */}
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
                                style={{
                                  marginTop: "8px",
                                  fontSize: "0.9rem",
                                }}
                                noWrap
                              >
                                Delivery Condition
                              </MDTypography>
                            </Grid>
                            <Grid item xs={5}>
                              <MDInput
                                id="delCond"
                                value={filterData?.delCond}
                                onChange={(e) => {
                                  handleDelCondChange(e);
                                }}
                                style={{ marginLeft: "8px" }}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        {/* <Grid item xs={12} md={3}>
                            <Grid container alignItems="center" spacing={1}>
                              <Grid item xs={12}>
                                <MDButton
                                  // style={{ marginTop: "1.5rem" }}
                                  size="small"
                                  color="info"
                                  onClick={handleDisplay}
                                  style={{
                                    marginTop: "4px",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  DISPLAY DATA
                                </MDButton>
                              </Grid>
                            </Grid>
                          </Grid> */}
                      </Grid>
                    </Grid>
                  </MDBox>
                  {/* )} */}
                </Card>
              </Grid>
            </Grid>
            <Grid margin={1.5}></Grid>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Sales Details" />
                    <Tab label="Mill Details" />
                    <Tab label="Gauge Details" />
                    <Tab label="Lab Details" />
                    <Tab label="Instrument Details" />
                    {/* <Tab label="Coating Process Sheet" /> */}
                  </Tabs>
                </AppBar>
              </Grid>
              {tabValue == 0 && (
                <>
                  <LDLTS003SD
                    ordId={filterData?.saleOrd?.value ?? ""}
                    itemNo={filterData?.item?.value ?? ""}
                  >
                    {" "}
                  </LDLTS003SD>
                </>
              )}
              {tabValue == 1 && (
                <>
                  <LDLTS003MD
                    ordId={filterData?.saleOrd?.value ?? ""}
                    itemNo={filterData?.item?.value ?? ""}
                  ></LDLTS003MD>
                </>
              )}
              {tabValue == 2 && (
                <>
                  <LDLTS003GD
                    ordId={filterData?.saleOrd?.value ?? ""}
                    itemNo={filterData?.item?.value ?? ""}
                  >
                    {" "}
                  </LDLTS003GD>
                </>
              )}
              {tabValue == 3 && (
                <>
                  <LDLTS003LD
                    ordId={filterData?.saleOrd?.value ?? ""}
                    itemNo={filterData?.item?.value ?? ""}
                  ></LDLTS003LD>
                </>
              )}
              {tabValue == 4 && (
                <>
                  <LDLTS003ID
                    ordId={filterData?.saleOrd?.value ?? ""}
                    itemNo={filterData?.item?.value ?? ""}
                  ></LDLTS003ID>
                </>
              )}
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
