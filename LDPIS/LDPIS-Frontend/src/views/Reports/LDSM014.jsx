import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import ReactSelect from "components/Select/ReactSelect";
import MonthPicker from "components/DateTime/DatePicker";

import DatePicker from "components/DateTime/DatePicker";
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
import { styled } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import LDSM020PlanModal from "./Modals/LDSM020PlanModal";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SegmentIcon from "@mui/icons-material/Segment";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

import "../../tabulatorCss.scss";

export default function LDSM014() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);

  const [resultData, setResultData] = useState([]);
  const [resultDataTable, setResultDataTable] = useState(null);
  const [allValues, setAllValues] = useState({
    batch_id: "",
  });

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleChange = (e) => {
    if (e.target.name == "order" && e.target.value.length > 10) {
      alertify.error("Order Size can not be greater than 10");
    } else {
      setAllValues({ ...allValues, [e.target.name]: e.target.value });
    }
  };

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
          //   getProdCat();
          setInitialLoad(true);
        }
      }
    }
    fetchData();
  }, []);

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
      var pageName = "LDSM014";

      var authDetails = await getScreenAuth(plant, userId, pageName);

      if (authDetails) {
        // if (authDetails.payload.PS_AUTH_USER_SCR != "Y") {
        //   setRestricted(true);
        // } else {
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

  const getGroupPlantId = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    let data = {
      adid: serverDetails.PersonalNo,
    };
    var url = "api/common/getGroupPlant";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row[0];
            obj.value = row[1];
            items.push(obj);
          });
          setPlant(items);

          setSelectedPlant(items[0]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (resultData && resultData.length > 0) {
      setResultDataTable(
        new Tabulator("#resulttable", {
          data: resultData,
          columns: resultColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [resultData]);

  //   const getProdCat = async (newToken = false) => {
  //     if (newToken) {
  //       const rsp = await getAuthorization();
  //     }
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
  //       },
  //     };

  //     setLoading(true);
  //     var url = "api/LDSM007/GetProdCat";
  //     axiosAPI
  //       .post(url, defaultOptions)
  //       .then((response) => {
  //         if (response.statusText != "" && response.statusText != "OK") {
  //           //reject(response.statusText);
  //         } else {
  //           var items = [];
  //           response.data.map((row) => {
  //             var obj = new Object();
  //             obj.label = row[0];
  //             obj.value = row[1];
  //             items.push(obj);
  //           });
  //           setProdCat(items);
  //         }
  //       })
  //       .finally((f) => {
  //         setLoading(false);
  //       });
  //   };

  const handlePlantChange = (value) => {
    //clear all data
    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setResultData([,]);
    setResultDataTable(null);
    //end clear all data

    setSelectedPlant(value);
  };
  const getQualityResultData = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var url;

    var data = {
      plant: selectedPlant ? selectedPlant.value : "",
      // frmDt: selectedFrmDt ? selectedFrmDt.toLocaleDateString('en-GB', {
      //   day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-') : "",
      // toDt: selectedToDt ? selectedToDt.toLocaleDateString('en-GB', {
      //   day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-') : ""

      frmDt: selectedFrmDt
        ? ("0" + selectedFrmDt.getDate()).slice(-2) +
          "-" +
          selectedFrmDt.toString().substr(4, 3) +
          "-" +
          selectedFrmDt.getFullYear()
        : "",
      toDt: selectedToDt
        ? ("0" + selectedToDt.getDate()).slice(-2) +
          "-" +
          selectedToDt.toString().substr(4, 3) +
          "-" +
          selectedToDt.getFullYear()
        : "",
    };
    if (data.plant == "") {
      alertify.error("Please select Plant");
      return;
    }
    if (
      allValues.batch_id == "" &&
      (selectedToDt === null || selectedFrmDt === null)
    ) {
      alertify.error("Please enter Batch Id OR Prod Date!");
      return;
    }
    if (
      (data.frmDt == "" && data.toDt != "") ||
      (data.frmDt != "" && data.toDt == "")
    ) {
      alertify.error("From Date and To Date both are required.");
      return;
    }
    const selectedFrmDtObj = new Date(selectedFrmDt);
    const selectedToDtObj = new Date(selectedToDt);

    if (selectedFrmDtObj?.getTime() > selectedToDtObj?.getTime()) {
      alertify.error("From Date can not be greater than To Date");
      return;
    }
    // const diffInMonths = (selectedToDtObj.getFullYear() - selectedFrmDtObj.getFullYear()) * 12 + (selectedToDtObj.getMonth() - selectedFrmDtObj.getMonth());
    const diffInDays = Math.floor(
      (selectedToDtObj - selectedFrmDtObj) / (1000 * 60 * 60 * 24)
    );
    if (data.frmDt != "" && data.toDt != "" && diffInDays > 180) {
      alertify.error("Duration should be less than 6 months");
      return;
    }
    data = { ...allValues, ...data };

    url = "api/LDSM014/getQualityResultData";

    setLoading(true);

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          if (response.data.length == 0) {
            alertify.error("No Data found");
            setResultData([,]);
          } else {
            setResultData(response.data);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const resultColumn = [
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Process",
      field: "PROCESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch ID",
      field: "BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt",
      field: "NET_WT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt UOM",
      field: "NET_WT_UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "MOTHER_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "LOM_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material discription",
      field: "RM_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickness",
      field: "THK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "OD",
      field: "OD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Cast No",
      field: "LOM_NO_CAST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "C(%)",
      field: "C",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "P(%)",
      field: "P",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "S(%)",
      field: "S",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Si(%)",
      field: "SI",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MN(%)",
      field: "MN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Al(%)",
      field: "AL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Cr(%)",
      field: "CR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Cu(%)",
      field: "CU",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Nb(%)",
      field: "NB",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "V(%)",
      field: "V",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Ti(%)",
      field: "TI",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Ni(%)",
      field: "NI",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "UTS",
      field: "UTS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "YS(MPA)",
      field: "YS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TS(MPS)",
      field: "TS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RA",
      field: "RA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MAX_THK",
      field: "MAX_THK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MIN_THK",
      field: "MIN_THK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MAX_HEI",
      field: "MAX_HEIGHT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MIN_HEI",
      field: "MIN_HEIGHT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MAX_WIDTH",
      field: "MAX_WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MAX_WID",
      field: "MAX_WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MIN_WID",
      field: "MIN_WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "EL",
      field: "EL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ECT",
      field: "ECT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "CRUS_T",
      field: "CRUS_T",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FIN_C",
      field: "FIN_C",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MAX_LEN",
      field: "MAX_LEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value && typeof value === "number") {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "MIN_LEN",
      field: "MIN_LEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MAX_ID",
      field: "MAX_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MIN_OD",
      field: "MIN_OD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MAX_OD",
      field: "MAX_OD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MIN_ID",
      field: "MIN_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Flattening Test",
      field: "FLLAT_T",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "BEND",
      field: "BEND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Drift/Expansion Test",
      field: "DRIFTIN1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Eddy Current Testing",
      field: "ECT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hardness Test(HRB)",
      field: "HRB_RB",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Straightness",
      field: "STRAIGHT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Squareness",
      field: "SQUA_",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Radius Corner",
      field: "R_CORNER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd",
      field: "LOM_CD_QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TWIST",
      field: "TWIST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "DRIFTIN1",
      field: "DRIFTIN1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "HYDTEST",
      field: "HYDTEST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "R_FLATT",
      field: "R_FLATT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FLANGING",
      field: "FLANGING",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Specification",
      field: "Specification",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order No",
      field: "ORD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Production date",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Recorded By",
      field: "TCO_CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Recorded On",
      field: "TCO_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WorkCenter(at tubemill)",
      field: "WORKCENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadExcelResultTable = () => {
    if (resultDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = resultDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM014_Quality_Result_Report" + ".xlsx";

    resultDataTable.download("xlsx", fileName, {
      sheetName: "LDSM014",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);

    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);

    setResultData([,]);
    setResultDataTable(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Reports"
        page="Quality result report"
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
            <Grid container spacing={5}>
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
                          Filters
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
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
                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={2.5} style={{ zIndex: 5 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Plant*
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plant}
                          value={selectedPlant}
                          onChange={handlePlantChange}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Batch ID**
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="batch_id"
                          value={allValues.batch_id || ""}
                          onChange={(e) => handleChange(e)}
                        />
                      </Grid>
                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Production start Date**{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedFrmDt}
                          onChange={(date) => {
                            setSelectedFrmDt(date);
                            if (selectedToDt === null) {
                              setSelectedToDt(date);
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Production end Date**{" "}
                        </MDTypography>
                        <DatePicker
                          id="toDt"
                          value={selectedToDt}
                          onChange={(date) => {
                            setSelectedToDt(date);
                            if (selectedFrmDt === null) {
                              setSelectedFrmDt(date);
                            }
                          }}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getQualityResultData(true)}
                        >
                          Submit
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <MDBox
                    mx={2}
                    mt={-3}
                    py={0.25}
                    px={1}
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
                          Quality Result Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelResultTable()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={2}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div id="resulttable" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {resultData.length} of{" "}
                          {resultData.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
