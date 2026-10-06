import React, { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";
import ReactSelectCustom from "components/Select/ReactSelectCustom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { TabulatorFull as Tabulator } from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import ReactMultiSelect from "components/Select/ReactMultiSelect";
import MonthPicker from "components/DateTime/MonthPicker";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DatePicker from "components/DateTime/DatePicker";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";

import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import Tooltip from "@mui/material/Tooltip";
import SaveIcon from "@mui/icons-material/Save";
import {
  getAccordionDetailsUtilityClass,
  getDialogActionsUtilityClass,
} from "@mui/material";
import { FlareSharp, ReplySharp } from "@mui/icons-material";
import { isValid } from "date-fns";

export default function LDSM017() {
  //initialization
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [plantList, setPlantList] = useState([]);
  const [inputSelection, setInputSelection] = useState({
    Plant: "",
    BatchId: "",
    CastNo: "",
  });

  const [selectedCoilId, setSelectedCoilId] = useState([]);
  //page load
  useEffect(() => {
    async function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }

      if (initialLoad == false) {
        const response = await getAuthorization();
        if (response) {
          validateUser();
          //page load functions here
          getGroupPlantId();
          setInitialLoad(true);
        }
      }
    }
    fetchData();
  }, []);

  //START Autorization Code
  //get auth token
  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      var url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;
      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tmm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tmm_accessToken", response.data.accessToken);
            localStorage.setItem(
              "tmm_refreshToken",
              response.data.refreshToken
            );
            resolve(response.data);
          }
        });
    });
  //validate user on page load
  const validateUser = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    setLoading(true);
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(
          localStorage.getItem("tmm_refreshToken"),
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
      var pageName = "LDSM017";

      var authDetails = await getScreenAuth(plant, userId, pageName);

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
    } finally {
      setLoading(false);
    }

    if (serverDetails.devMode == true) {
      setRestricted(false);
      setAdmin(true);
    }
  };
  //get page authorization for user
  const getScreenAuth = (plantCd, userId, pageName) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
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
  //END Autorization Code

  //plant change of Test Result
  const handlePlantChange = (value) => {
    setInputSelection({
      ...inputSelection,
      Plant: value,
    });
  };
  //handle change event - input of Test Result
  const handleInputChange = (e) => {
    setInputSelection({
      ...inputSelection,
      [e.target.name]: e.target.value,
    });
  };

  //handle click event - Upload Test Result
  const handleUploadOnClick = () => {
    if (!inputSelection.Plant || inputSelection.Plant.length == 0) {
      alertify.error("Please select plant!");
      return;
    }
    if (!inputSelection.BatchId || inputSelection.BatchId.length == 0) {
      alertify.error("Please enter Batch No!");
      return;
    }
    console.log(inputSelection.Plant.value,inputSelection.Plant);
    UploadTestResultDetails(
      inputSelection.Plant.value,
      inputSelection.BatchId,
      inputSelection.CastNo,
      true
    );
  };

  //api call - get list authorised production stage
  const getGroupPlantId = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var userId = serverDetails.PersonalNo;

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/LDSM017/getAssignedPlantList";
    var data = {
      userId: userId,
    };

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          setPlantList([]);
        } else {
          if (response.data.length > 0) {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row.TEXT;
              obj.value = row.VAL;
              items.push(obj);
            });
            setPlantList(items);
          } else {
            setPlantList([]);
            alertify.error("Plant not assigned to your user id");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };
  // api to call - fetch coil id
  const getCoilId = async (plant, batchId, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      try {
        var url = "api/LDSM017/getCoilId";
        var data = {
          Plant: plant,
          BatchId: batchId,
        };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
              //reject(response.statusText);
            } else {
              var items = {};
              response.data.map((row) => {
                items[row[1]] = row[1];
              });
              setSelectedCoilId(items);
            }
          })
          .finally((f) => {
            resolve();
          });
      } catch {
        resolve();
      }
    });
  };
  //api call - update Test Result details
  const updateDta = () => {
   
   
    if (!inputSelection.Plant || inputSelection.Plant.length == 0) {
      alertify.error("Please select plant!");
      return;
    }
    if (!inputSelection.BatchId || inputSelection.BatchId.length == 0) {
      alertify.error("Please enter Batch No!");
      return;
    }
    setLoading(true);
    getAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var newData = [];
      newData.push(inputSelection.BatchId);
      // inputSelection.BatchId.forEach(function (item) {
        
      // });
      var url = "api/LDSM017/getBatchTrigger";

      axiosAPI
        .post(url, newData, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.errorString == "successfully recorded !") {
              alertify.success(response.data.errorString);
            } else {
              alertify.error(response.data.errorString);
            }
          }
        })
        .catch((error) => {
          setLoading(false);
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Data Exchange"
        page="Data Exchange/Transfer"
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
            <Grid container spacing={1} style={{ marginTop: "-1.5rem" }}>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} style={{ marginTop: "1.5rem" }}>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
                        px={2}
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                      >
                        <MDTypography variant="h6" color="white">
                          Update Test Result
                        </MDTypography>
                      </MDBox>
                      <MDBox px={3} py={1}>
                        <Grid container spacing={1}>
                          <Grid item xs={3} style={{ zIndex: 1 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Plant
                            </MDTypography>
                            <ReactSelect
                              id="Plant"
                              name="Plant"
                              options={plantList}
                              defaultValue={inputSelection.Plant}
                              onChange={handlePlantChange}
                            />
                          </Grid>
                          <Grid item xs={1.8}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Batch ID
                            </MDTypography>
                            <MDInput
                              fullWidth
                              id="BatchId"
                              name="BatchId"
                              onChange={handleInputChange}
                              value={inputSelection.BatchId}
                            />
                          </Grid>
                          {/* <Grid item xs={1.8}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Cast No
                            </MDTypography>
                            <MDInput
                              fullWidth
                              id="CastNo"
                              name="CastNo"
                              onChange={handleInputChange}
                              value={inputSelection.CastNo}
                            />
                          </Grid> */}
                          <Grid item xs={2}></Grid>
                          <Grid item xs={3}>
                            <MDButton
                              size="small"
                              color="info"
                              disabled={isReadWriteAccess}
                              style={{ marginTop: "1.5rem" }}
                              onClick={() => updateDta()}
                            >
                              Retrigger
                            </MDButton>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
