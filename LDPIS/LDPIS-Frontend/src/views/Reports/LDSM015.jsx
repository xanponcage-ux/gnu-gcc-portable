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
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export default function LDSM015() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState([]);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);

  const [odData, setOdData] = useState([]);
  const [secData, setSecData] = useState([]);
  // const [odColumn, setOdColumn] = useState([]);
  // const [secColumn, setSecColumn] = useState([]);
  const [odTable, setOdTable] = useState(null);
  const [secTable, setSecTable] = useState(null);
  const [type, setType] = useState(null);

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const handleChange = (e) => {
    setOdData([,]);
    setSecData([,]);
    setOdTable(null);
setSecTable(null);
    setType(e);
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
      var pageName = "LDSM015";

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

  // useEffect(() => {
  //   if (resultData && resultData.length > 0) {
  //     setResultDataTable(
  //       new Tabulator("#resulttable", {
  //         data: resultData,
  //         columns: dColumn,
  //         maxHeight: 400,
  //         layout: "fitDataFill",
  //       })
  //     );
  //   }
  // }, [resultData, dColumn]);

  useEffect(() => {
    if (isOpen?.length > 0) {
      setDisplayData(isOpen)
    }
  }, [isOpen]);

  useEffect(() => {
    if (odData && odData.length > 0) {
      setOdTable(
        new Tabulator("#odtable", {
          data: odData,
          columns: odColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [odData]);

  useEffect(() => {
    console.log(secData);
    if (secData && secData.length > 0) {
      setSecTable(
        new Tabulator("#sectable", {
          data: secData,
          columns: secColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [secData]);

  const handlePlantChange = (value) => {
    //clear all data
    setType({});
    setOdData([,]);
    setSecData([,]);
    setOdTable(null);
setSecTable(null);
    
    //end clear all data

    setSelectedPlant(value);
  };

const odColumn=[{
  title: "PLANT",
  field: "PLANT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
}, 
{
  title: "Tentative TubeOD (mm)",
  field: "TentativeTubeOD(mm)",
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
  headerFilterPlaceholder: "search...",
},
{
  title: "WTS1(nos)",
  field: "WTS1_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color d0d0d0
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS1(KG)",
  field: "WTS1_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS2(nos)",
  field: "WTS2_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS2(KG)",
  field: "WTS2_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS3(nos)",
  field: "WTS3_NOS",
  headerFilter: "input",
  bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS3(KG)",
  field: "WTS3_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS4(nos)",
  field: "WTS4_NOS",
  headerFilter: "input",
  bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS4(KG)",
  field: "WTS4_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS5(nos)",
  field: "WTS5_NOS",
  headerFilter: "input",
  bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS5(KG)",
  field: "WTS5_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS6(nos)",
  field: "WTS6_NOS",
  headerFilter: "input",
  bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS6(KG)",
  field: "WTS6_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS7(nos)",
  field: "WTS7_NOS",
  headerFilter: "input",
  bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS7(KG)",
  field: "WTS7_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}]

const secColumn=[{
  title: "PLANT",
  field: "PLANT",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
}, 
{
  title: "THICK",
  field: "EIC_SEC1",
  headerFilter:"input",
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WIDTH",
  field: "EIC_SEC2",
  headerFilter: "input",
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    if (value) {
      return value.toFixed(3);
    }
    return value;
  },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS1(nos)",
  field: "WTS1_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS1(KG)",
  field: "WTS1_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS2(nos)",
  field: "WTS2_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS2(KG)",
  field: "WTS2_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS3(nos)",
  field: "WTS3_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS3(KG)",
  field: "WTS3_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS4(nos)",
  field: "WTS4_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS4(KG)",
  field: "WTS4_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS5(nos)",
  field: "WTS5_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS5(KG)",
  field: "WTS5_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS6(nos)",
  field: "WTS6_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS6(KG)",
  field: "WTS6_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#d0d0d0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS7(nos)",
  field: "WTS7_NOS",
  headerFilter: "input",
bottomCalc: "sum",
headerFormatter: (cell) => {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}, 
{
  title: "WTS7(KG)",
  field: "WTS7_WT",
bottomCalcFormatter: function (cell) {
      // Round the sum to 3 decimal places
      var value = cell.getValue();
      if (value) {
        return value.toFixed(3);
      }
      return value;
    },
  headerFilter: "input",
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
headerFormatter: function(cell) {
      cell.getElement().style.backgroundColor = '#f0f0f0'; // First color
      return cell.getValue();
    },
  headerFilterPlaceholder: "search...",
}]

 

  const onCellClick = (cell, element, resultRData) => {
    let varData = [];
    for (let i = 0; i < resultRData?.length; i++) {
      if (resultRData[i]?.tube == cell.getRow().getData()?.tube && resultRData[i]?.TUBE_THK?.toFixed(3) == element) {
        varData.push({
          EPR_ID_BATCH: resultRData[i]?.EPR_ID_BATCH,
          NET_WT: resultRData[i]?.QTY,
          THICK: resultRData[i]?.THICK,
          WIDTH: resultRData[i]?.WIDTH,
          ODIA: resultRData[i]?.ODIA,
          ORDR: resultRData[i]?.ORDR,
          ITEM: resultRData[i]?.ITEM,
          MBATCH: resultRData[i]?.MBATCH
        })
      }
    }
    setIsOpen(varData);
  }

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
    };
    if (data.plant == "") {
      alertify.error("Please select Plant");
      return;
    }
    if (data.plant == "0789") {
      alertify.error("This feature is not available for Hosur!");
      return;
    }
    if (
      !type?.value
    ) {
      alertify.error("Please select Type!");
      return;
    }
    // if (
    //   (data.frmDt == "" && data.toDt != "") ||
    //   (data.frmDt != "" && data.toDt == "")
    // ) {
    //   alertify.error("From Date and To Date both are required.");
    //   return;
    // }
    // const selectedFrmDtObj = new Date(selectedFrmDt);
    // const selectedToDtObj = new Date(selectedToDt);

    // if (selectedFrmDtObj?.getTime() > selectedToDtObj?.getTime()) {
    //   alertify.error("From Date can not be greater than To Date");
    //   return;
    // }
    // const diffInMonths = (selectedToDtObj.getFullYear() - selectedFrmDtObj.getFullYear()) * 12 + (selectedToDtObj.getMonth() - selectedFrmDtObj.getMonth());
    // const diffInDays = Math.floor(
    //   (selectedToDtObj - selectedFrmDtObj) / (1000 * 60 * 60 * 24)
    // );
    console.log("hello before data");
    data = {
      type: type?.value,
      plant: selectedPlant ? selectedPlant.value : "",
      // frmDt: selectedFrmDt
      //   ? ("0" + selectedFrmDt.getDate()).slice(-2) +
      //   "-" +
      //   selectedFrmDt.toString().substr(4, 3) +
      //   "-" +
      //   selectedFrmDt.getFullYear()
      //   : "",
      // toDt: selectedToDt
      //   ? ("0" + selectedToDt.getDate()).slice(-2) +
      //   "-" +
      //   selectedToDt.toString().substr(4, 3) +
      //   "-" +
      //   selectedToDt.getFullYear()
      //   : "",
    };
    if (type?.value == "O") {
      url = "api/LDSM015/getODData";
    }
    else{
    url = "api/LDSM015/getSectionData";
    }
    setLoading(true);
    console.log(url,"hello before data");
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          console.log(response.data);
          console.log(response.data[1]);
          if (response.data.length != 0) {
            if (type?.value == "O") {
              setOdData(response.data);
            }
            else{
              setSecData(response.data);
            }
          } else {
            setOdData([]);
            setSecData([]);
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const downloadExcelResultTable = () => {
    if(type?.value === "O"){
    if (odTable == null ) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = odTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM015_Strip_Width_Chart_Report_OD" + ".xlsx";

    odTable.download("xlsx", fileName, {
      sheetName: "LDSM015",
    });
  }
  else {
    if (secTable == null ) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = secTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM015_Strip_Width_Chart_Report_SEC" + ".xlsx";

    secTable.download("xlsx", fileName, {
      sheetName: "LDSM015",
    });
  }
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);

    setType({});

    setOdData([,]);
    setSecData([,]);
    setOdTable(null);
    setSecTable(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Reports"
        page="Strip Width Chart"
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
      {isRestricted !== false && (
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
                          Size Type*
                        </MDTypography>
                        <ReactSelect
                          id="Size"
                          options={[
                            { label: 'OD Wise', value: 'O' },
                            { label: 'Section Wise', value: 'S' } 
                            // { label: 'Section', value: 'S' }
                          ]}
                          value={type}
                          onChange={handleChange}
                        />
                      </Grid>
                      {/* <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          start Date**{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedFrmDt}
                          onChange={(date) => {
                            setSelectedFrmDt(date);
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
                          end Date**{" "}
                        </MDTypography>
                        <DatePicker
                          id="toDt"
                          value={selectedToDt}
                          onChange={(date) => {
                            setSelectedToDt(date);
                          }}
                        />
                      </Grid> */}

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
                          Strip Width Chart
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
                                {type?.value === 'O' ? (
                                  <div id="odtable" />
                                ) : (
                                  <div id="sectable" />
                                )}
                                <br />
                                <p
                                  color="black"
                                  style={{
                                    color: "black",
                                    paddingLeft: "1rem",
                                    marginTop: "-1rem",
                                  }}
                                >
                                  Showing 1 to {type?.value === 'O' ? odData.length : secData.length} of{" "}
                                  {type?.value === 'O' ? odData.length : secData.length} entries
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
      {/* <Dialog
        open={isOpen?.length > 0}
        fullWidth={true}
        maxWidth='md'
        onClose={() => { setDisplayData([]); setIsOpen([]) }}
      >
        <DialogTitle>Details</DialogTitle>

        <DialogContent>
          {loading && <Preloader />}
          <MDBox px={3} py={2}>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
            ></Grid>
            {<Grid container spacing={1}>
              {displayData.length > 0 && <Grid item xs={12}>
                <div id="tDisplay" />
                <br />
                <p
                  color="black"
                  style={{
                    color: "black",
                    paddingLeft: "1rem",
                    marginTop: "-1rem",
                  }}
                >
                  Showing 1 to {displayData.length} of{" "}
                  {displayData.length} entries
                </p>
              </Grid>}
            </Grid> }
          </MDBox>

        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog> */}
    </DashboardLayout>
  );
}
