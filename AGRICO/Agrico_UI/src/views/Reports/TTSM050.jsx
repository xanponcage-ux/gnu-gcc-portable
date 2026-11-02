import React, { useEffect, useState, useMemo, useRef } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Preloader from "components/Preloader/Preloader";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ReactSelect from "components/Select/ReactSelect";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
// import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { Style } from "@mui/icons-material";
import Today from "@mui/icons-material/Today";
import MultipleSelect from "components/Select/MultiSelect";


export default function TTSM050() {
  const [loading, setLoading] = useState(true);
  const [isRestricted, setRestricted] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [isModelAcess,setModelAcces]=useState(false);
  const [finalcampignsdata, setfinalcampignsdata] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [tubeMills, setTubeMills] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const campaignTableRef = useRef(null);
  const [campaignData, setCampaignData] = useState([]);
  const [campaignDataTable, setCampaignDataTable] = useState([]);

  const podTableRef = useRef(null);
  const [campaignDataPOD, setCampaignDataPOD] = useState([]);
  const [campaignDataPODTable, setCampaignDataPODTable] = useState([]);

  
  const odTableRef = useRef(null);
  const [campaignDataOD, setCampaignDataOD] = useState([]);
  const [campaignDataODTable, setCampaignDataODTable] = useState([]);

  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [millList, setMillList] = useState([
    ['Mill-1'], ['Mill-2'], ['Mill-3'], ['Mill-4'], ['Mill-5'], ['Mill-6'], ['Mill-7'], ['Mill-8'],]);
  const [selectedMill, setSelectedMill] = useState([]);

  const [segmentList, setSegmentList] = useState([
    ['B&R'], ['Boiler'], ['CEW'], ['ERW'], ['ERW_GEN']]);
  const [selectedSegment, setSelectedSegment] = useState([]);

  const [zoneList, setZonetList] = useState([
    ['B&R'], ['Boiler'], ['North'], ['South'], ['West'],]);
  const [selectedZone, setSelectedZone] = useState([]);
  
  const [TTypeList, setTTypeList] = useState([
    ['APH'], ['BOT'], ['CBQ'], ['CEW'], ['COR'], ['ERW']]);
  const [selectedTType, setSelectedTType] = useState([]);

  /** --------------- Authintication logic --------------- **/
  const getScreenAuth = (plantCd, userId, pageName, accessToken) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/users/screenAuth";
      if (serverDetails.devMode == true) {
        // (userId = "198447"), (pageName = "TSMCPPF001");
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

  const validateUser = async (token) => {
    try {
      var plant = "";
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
        serverDetails.PersonalNo == ``
      ) {
        window.location.href = "#/signin";
      }
      var userId = serverDetails.PersonalNo;
      var pageName = "TTSM050";
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
          //   setRestricted(false); // Added temp to view screen
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML == "Y") {
          setAdmin(true);
          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW") {
            setModelAcces(true);
            alertify.success(
              "You are authorized to make changes from this page"
            );
          } else {
            alertify.error(
              "You are not authorized to make changes from this page"
            );
          }
        } else {
          alertify.error(
            "You are not authorized to make changes from this page"
          );
        }
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

  const getGroupPlantId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
        //serverDetails.PersonalNo
      };
      var url = "api/common/getGroupPlant";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
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
            // Promise.all([ getMatGrp(items[0], accessToken) ]).finally(() => {
            //     resolve();
            //   });
            resolve();
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {

      });
      setLoading(false);
    });
  }

  // page load
  useEffect(() => {
    fetchData();
  }, []);

  const handlePlantChange = (value) => {
    if (value) {
      setSelectedPlant(value);
      //   setfinalcampignsdata([]);
    }
    setSelectedMill(null);
    setSelectedSegment(null);
    setSelectedZone(null);
    setSelectedTType(null);
    setCampaignData(null);
    setCampaignDataPOD(null);
    setCampaignDataOD(null);
  };

  const handleMillChange = (value) => {
    if (value) {
      // const converted = value.map(v =>
      //   v.replace('Mill-', 'M-')
      // );
      setSelectedMill(value);
      //   setfinalcampignsdata([]);
    }
    setSelectedSegment(null);
    setSelectedZone(null);
    setSelectedTType(null);
    setCampaignData(null);
    setCampaignDataPOD(null);
    setCampaignDataOD(null);
  };

  const handleSegmentChange = (value) => {
    if (value) {
      setSelectedSegment(value);
      //   setfinalcampignsdata([]);
    }
    setSelectedZone(null);
    setSelectedTType(null);
    setCampaignData(null);
    setCampaignDataPOD(null);
    setCampaignDataOD(null);
  };

  const handleZoneChange = (value) => {
    if (value) {
      setSelectedZone(value);
      //   setfinalcampignsdata([]);
    }
    setSelectedTType(null);
    setCampaignData(null);
    setCampaignDataPOD(null);
    setCampaignDataOD(null);
  };

  const handleTTypeChange = (value) => {
    if (value) {
      setSelectedTType(value);
    }
    setCampaignData(null);
    setCampaignDataPOD(null);
    setCampaignDataOD(null);
  };

  const handleClearAll = () => {
    setSelectedPlant(null);
    setSelectedMill(null);
    setSelectedSegment(null);
    setSelectedZone(null);
    setSelectedTType(null);
    setCampaignData(null);
    setCampaignDataPOD(null);
    setCampaignDataOD(null);
  }

  const precise = (v, d = 3) => Number(Math.round(v + "e" + d) + "e-" + d);

  const getRunModel = async () => {
    GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
      setLoading(true);
      var url = "/api/TTSM050/runModel";
      axiosAPI.get(url,defaultOptions).then((response) => {
        if (response.status ==200) {
          alertify.success('Model executed Succesfully.');
        } else {
          alertify.error('Model not executed Succesfully. Please try again.');
        }
      }).catch((err) => {
        alertify.error('Model not executed Succesfully. Please try again. ' + err);
      }).finally(() => {
        setLoading(false);
        setCampaignData(null);
        setCampaignDataPOD(null);
        setCampaignDataOD(null);
      });
    });
  }

  const getCampaignData = async () => {
    if (selectedPlant == undefined || selectedPlant?.value == '') {
      alertify.error('Please select Plant');
      return;
    }
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      let token = await GetAuthorization()
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        Plant: selectedPlant?.value || '',
        Mill: selectedMill||[],
        Segment: selectedSegment||[],
        Zone: selectedZone||[],
        TType: selectedTType||[],
      };
      var url = "api/TTSM050/getCampaignData";
      axiosAPI.post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            let responsedata = response.data;
            responsedata = responsedata.map(row => ({
              ...row,
              TCD_BAL_SLIT_REQUIRED: precise(row.TCD_BAL_SLIT_REQUIRED || 0),
              TCD_BAL_TO_SCHD_1: precise(row.TCD_BAL_TO_SCHD_1 || 0),
              TCD_MES_BTP: precise(row.TCD_MES_BTP || 0),
              TCD_BTR_MES: precise(row.TCD_BTR_MES || 0),
              TCD_BTR_WITH_YIELD: precise(row.TCD_BTR_WITH_YIELD || 0),
              TCD_CAMPAIGN: precise(row.TCD_CAMPAIGN || 0),
              TCD_CRM_FG_1: precise(row.TCD_CRM_FG_1 || 0),
              TCD_BTD: precise(row.TCD_BTD || 0),
              TCD_CRM_CRS_1: precise(row.TCD_CRM_CRS_1 || 0),
              TCD_CRM_DESPATCH: precise(row.TCD_CRM_DESPATCH || 0),
              TCD_CRM_WIP_1: precise(row.TCD_CRM_WIP_1 || 0),
              TCD_GROUND_HR_STOCK: precise(row.TCD_GROUND_HR_STOCK || 0),
              TCD_OD: precise(row.TCD_OD || 0),
              TCD_MES_ROLLED: precise(row.TCD_MES_ROLLED || 0),
              TCD_SCHEDULED_1: precise(row.TCD_SCHEDULED_1 || 0),
              TCD_SLIT_AS_ON_DATE: precise(row.TCD_SLIT_AS_ON_DATE || 0),
              TCD_SLIT_COVERED: precise(row.TCD_SLIT_COVERED || 0),
              TCD_SLIT_5MT: precise(row.TCD_SLIT_5MT || 0),
              TCD_SLIT_ETO: precise(row.TCD_SLIT_ETO || 0),
              TCD_VISIBILITY_COVERED: precise(row.TCD_VISIBILITY_COVERED || 0),
            })
            );
            setCampaignData(responsedata);
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        }).finally(() => {
          setLoading(false);
        });
    });
  }

  const getCampaignDataPOD = async () => {
    if (selectedPlant == undefined || selectedPlant?.value == '') {
      alertify.error('Please select Plant');
      return;
    }
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      let token = await GetAuthorization()
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        Plant: selectedPlant?.value || '',
        Mill: selectedMill || [],
        Segment: selectedSegment || [],
        Zone: selectedZone || [],
        TType: selectedTType || [],
      };
      var url = "api/TTSM050/getCampaignDataByPOD";
      axiosAPI.post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            let responsedata = response.data;
            responsedata = responsedata.map(row => ({
              ...row,
              TCD_BAL_SLIT_REQUIRED: precise(row.TCD_BAL_SLIT_REQUIRED || 0),
              TCD_BAL_TO_SCHD_1: precise(row.TCD_BAL_TO_SCHD_1 || 0),
              TCD_MES_BTP: precise(row.TCD_MES_BTP || 0),
              TCD_BTR_MES: precise(row.TCD_BTR_MES || 0),
              TCD_GR_DONE: precise(row.TCD_GR_DONE || 0),
              TCD_DISPATCHED: precise(row.TCD_DISPATCHED || 0),
              TCD_CRM_FG_1: precise(row.TCD_CRM_FG_1 || 0),
              TCD_BTD: precise(row.TCD_BTD || 0),
              TCD_CRM_CRS_1: precise(row.TCD_CRM_CRS_1 || 0),
              TCD_CRM_DESPATCH: precise(row.TCD_CRM_DESPATCH || 0),
              TCD_CRM_WIP_1: precise(row.TCD_CRM_WIP_1 || 0),
              TCD_GROUND_HR_STOCK: precise(row.TCD_GROUND_HR_STOCK || 0),
              TCD_OD: precise(row.TCD_OD || 0),
              TCD_MES_ROLLED: precise(row.TCD_MES_ROLLED || 0),
              TCD_SCHEDULED_1: precise(row.TCD_SCHEDULED_1 || 0),
              TCD_SLIT_AS_ON_DATE: precise(row.TCD_SLIT_AS_ON_DATE || 0),
              TCD_SLIT_COVERED: precise(row.TCD_SLIT_COVERED || 0),
              TCD_SLIT_5MT: precise(row.TCD_SLIT_5MT || 0),
              TCD_SLIT_ETO: precise(row.TCD_SLIT_ETO || 0),
              TCD_VISIBILITY_COVERED: precise(row.TCD_VISIBILITY_COVERED || 0),
            })
            );
            setCampaignDataPOD(responsedata);
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        }).finally(() => {
          setLoading(false);
        });
    });
  }

  const getCampaignDataOD = async () => {
    if (selectedPlant == undefined || selectedPlant?.value == '') {
      alertify.error('Please select Plant');
      return;
    }
    return new Promise(async (resolve, reject) => {
      setLoading(true);
      let token = await GetAuthorization()
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        Plant: selectedPlant?.value || '',
        Mill: selectedMill || [],
        Segment: selectedSegment || [],
        Zone: selectedZone || [],
        TType: selectedTType || [],
      };
      var url = "api/TTSM050/getCampaignDataByOD";
      axiosAPI.post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            reject(response.statusText);
          } else {
            let responsedata = response.data;
            responsedata = responsedata.map(row => ({
              ...row,
              TCD_OD: precise(row.TCD_OD || 0),
              TCD_IDIA: precise(row.TCD_IDIA || 0),
              TCD_THICKNESS: precise(row.TCD_THICKNESS || 0),
              TCD_SFG_ODIA: precise(row.TCD_SFG_ODIA || 0),
              TCD_SFG_THICKNESS: precise(row.TCD_SFG_THICKNESS || 0),
              TCD_MES_BTP: precise(row.TCD_MES_BTP || 0),
              TCD_CURRENT_WIP_ORD: precise(row.TCD_CURRENT_WIP_ORD || 0),
              TCD_CURRENT_FG_MAT: precise(row.TCD_CURRENT_FG_MAT || 0),
              TCD_SIGN_OFF2: precise(row.TCD_SIGN_OFF2 || 0),
              TCD_GR_DONE: precise(row.TCD_GR_DONE || 0),
              TCD_MES_ROLLED: precise(row.TCD_MES_ROLLED || 0),
              TCD_BTR_MES: precise(row.TCD_BTR_MES || 0),
              TCD_SLIT_COVERED: precise(row.TCD_SLIT_COVERED || 0),
              TCD_SLIT_ETO: precise(row.TCD_SLIT_ETO || 0),
              TCD_SLIT_AS_ON_DATE: precise(row.TCD_SLIT_AS_ON_DATE || 0),
              TCD_CRM_FG_1: precise(row.TCD_CRM_FG_1 || 0),
              TCD_CRM_CRS_1: precise(row.TCD_CRM_CRS_1 || 0),
              TCD_VISIBILITY_COVERED: precise(row.TCD_VISIBILITY_COVERED || 0),
              TCD_BAL_SLIT_REQUIRED: precise(row.TCD_BAL_SLIT_REQUIRED || 0),
              TCD_CRM_BTD: precise(row.TCD_CRM_BTD||0),
              TCD_GROUND_HR_STOCK: precise(row.TCD_GROUND_HR_STOCK || 0),
              TCD_EXTRA_ORDER: precise(row.TCD_EXTRA_ORDER || 0),
              TCD_BAL_SLIT_ORDER_TO_LOG: precise(row.TCD_BAL_SLIT_ORDER_TO_LOG || 0),
            })
            );
            setCampaignDataOD(responsedata);
            resolve();
          }
        })
        .catch((err) => {
          reject(err);
        }).finally(() => {
          setLoading(false);
        });
    });
  }


  // Optional: right-align header & cells for numeric columns
  const rightAlign = { hozAlign: "center", headerHozAlign: "center" };


  const CompaignColumns = [
    {
      title: "Mill no.",
      field: "TCD_TUBE_MILL",
      // headerFilter: "input",
      headerHozAlign: "left",
      hozAlign: "left",
      minWidth: 140,
      tooltip: true,
    },
    {
      title: "P OD",
      field: "TCD_SIZE",
      ...rightAlign,
      minWidth: 110,
      tooltip: true,
    },
    {
      title: "MES BTP",
      field: "TCD_MES_BTP",
      ...rightAlign,
      minWidth: 160,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "MES Rolled",
      field: "TCD_MES_ROLLED",
      ...rightAlign,
      minWidth: 130,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "BTR with Yield",
      field: "TCD_BTR_WITH_YIELD",
      ...rightAlign,
      minWidth: 150,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "BAL. to Roll MES",
      field: "TCD_BTR_MES",
      ...rightAlign,
      minWidth: 160,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Campaign",
      field: "TCD_CAMPAIGN",
      headerHozAlign: "left",
      hozAlign: "left",
      minWidth: 120,
      tooltip: true,
      headerClass: "hdr-darkblue",
      cssClass: "col-darkblue",
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },

      // topCalc: "sum",
      // // format the top calc cell (optional)
      // topCalcFormatter: (cell) => {
      //   const n = Number(cell.getValue());
      //   return Number.isFinite(n) ? n.toFixed(3) : "";
      // },

    },

    // --- Styled columns per your screenshot color scheme ---
    {
      title: "Slit Covered",
      field: "TCD_SLIT_COVERED",
      ...rightAlign,
      minWidth: 140,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Slit covered >5",
      field: "TCD_SLIT_5MT",
      ...rightAlign,
      minWidth: 150,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
      // headerFormatter: coloredHeader("#69c36d"), // light green
      headerClass: "hdr-lightgreen",
      cssClass: "col-lightgreen"
    },
    {
      title: "Slit ETO",
      field: "TCD_SLIT_ETO",
      ...rightAlign,
      minWidth: 120,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
      // headerFormatter: coloredHeader("#b85a1e"), // orange-brown
      headerClass: "hdr-orange",
      cssClass: "col-orange"
    },
    {
      title: "Scheduled-1",
      field: "TCD_SCHEDULED_1",
      ...rightAlign,
      minWidth: 140,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
      // headerFormatter: coloredHeader("#15a153"), // green
    },
    {
      title: "Bal To Schd-1",
      field: "TCD_BAL_TO_SCHD_1",
      ...rightAlign,
      minWidth: 150,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
      // headerFormatter: coloredHeader("#f0b429", "#000"), // yellow, dark text
    },
    // --- End styled block ---

    {
      title: "Slit as on date",
      field: "TCD_SLIT_AS_ON_DATE",
      ...rightAlign,
      minWidth: 150,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "CRM FG",
      field: "TCD_CRM_FG_1",
      ...rightAlign,
      minWidth: 110,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "CRM CRS",
      field: "TCD_CRM_CRS_1",
      ...rightAlign,
      minWidth: 120,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Visibility Covered",
      field: "TCD_VISIBILITY_COVERED",
      ...rightAlign,
      minWidth: 160,
      tooltip: true,
      cssClass: 'col-lightblue',
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "CRM WIP",
      field: "TCD_CRM_WIP_1",
      ...rightAlign,
      minWidth: 110,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Bal Slit Required",
      field: "TCD_BAL_SLIT_REQUIRED",
      ...rightAlign,
      minWidth: 160,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "CRM BTD",
      field: "TCD_BTD",
      ...rightAlign,
      minWidth: 120,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "CRM Despatch",
      field: "TCD_CRM_DESPATCH",
      ...rightAlign,
      minWidth: 150,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Ground HR Stock",
      field: "TCD_GROUND_HR_STOCK",
      ...rightAlign,
      minWidth: 170,
      tooltip: true,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
  ];

  const buildGroupHeader = (table, value, count, data) => {
    const columns = table.getColumns();

    // Build width-aware grid template
    const gridTemplate = columns.map((col) => col.getWidth() + "px").join(" ");

    // Sum helper
    const sum = (field) => data.reduce((t, r) => t + (Number(r[field]) || 0), 0).toFixed(3);

    // Build one cell PER COLUMN (auto-aligned)
    const cells = columns.map((col, index) => {
      const field = col.getField();

      // First column → group name
      if (index === 0) {
        return `<div class="gh-cell gh-title"> ${value} (${count})</div>`;
      }

      // Numeric columns → totals
      if (
        [
          "TCD_MES_BTP",
          "TCD_MES_ROLLED",
          "TCD_BTR_WITH_YIELD",
          "TCD_BTR_MES",
          "TCD_CAMPAIGN",
          "TCD_SLIT_COVERED",
          "TCD_SLIT_5MT",
          "TCD_SLIT_ETO",
          "TCD_SCHEDULED_1",
          "TCD_BAL_TO_SCHD_1",
          "TCD_SLIT_AS_ON_DATE",
          "TCD_CRM_FG_1",
          "TCD_CRM_CRS_1",
          "TCD_VISIBILITY_COVERED",
          "TCD_CRM_WIP_1",
          "TCD_BAL_SLIT_REQUIRED",
          "TCD_BTD",
          "TCD_CRM_DESPATCH",
          "TCD_GROUND_HR_STOCK",
        ].includes(field)
      ) {
        return `<div style="display:flex;align-items:center;justify-content:center;
         text-align:center; ">${sum(field)}</div>`;
      }

      // Non-numeric columns → empty placeholder
      return `<div style="display:flex;align-items:center;justify-content:center;"></div>`;
    });

    return `
    <div class="group-header-grid" style="display:grid;font-weight:600;
     grid-template-columns:${gridTemplate}">
      ${cells.join("")}
    </div>
  `;
  };

  useEffect(() => {
    campaignTableRef.current= new Tabulator('#CompaignDtl', {
      data: campaignData,         // supply your dataset here
      columns: CompaignColumns,
      layout: "fitDataStretch",
      height: "450px",
      index: "TCD_TUBE_MILL",
      rowHeader: { headerSort: false },
      groupBy: "TCD_TUBE_MILL",
      groupValues: true,        // ✅ REQUIRED for export
      groupHeader: function (value, count, data, group) {
        return buildGroupHeader(group.getTable(), value, count, data);
      },

      columnCalcs: "table",   // ✅ overall totals only

    }
    )
  }, [campaignData]);

  //===== P.OD columns====
  const CampaignColumnsByPOD = [

    // ===== BASIC =====
    { title: "P OD",
      field: "TCD_SFG_ODIA",
      minWidth: 90, 
    },
    { title: "F-GRADE", 
      field: "TCD_FG_GRADE",  
      minWidth: 90, 
    },
    { title: "P THK", 
      field: "TCD_SFG_THICKNESS", 
      ...rightAlign, 
      minWidth: 90, 
    },
    { title: "P.Code", 
      field: "TCD_FG_PCODE", 
      minWidth: 80, 
    },

    // ===== MES =====
    { title: "MES BTP", 
      field: "TCD_MES_BTP", 
      ...rightAlign, 
      minWidth: 140 ,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "GR Done", 
      field: "TCD_GR_DONE", 
      ...rightAlign,
      minWidth: 100,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
     },
    { title: "Despatched", 
      field: "TCD_DISPATCHED", 
      ...rightAlign, 
      minWidth: 110, 
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "MES Rolled", 
      field: "TCD_MES_ROLLED", 
      ...rightAlign, 
      minWidth: 120,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "Current FG(Mat)", 
      field: "TCD_CURRENT_FG_MAT", 
      ...rightAlign, 
      minWidth: 150,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "Current WIP(Ord)", 
      field: "TCD_CURRENT_WIP_ORD", 
      ...rightAlign, 
      minWidth: 160,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    // ===== BAL TO ROLL (BLUE) =====
    {
      title: "BAL. to Roll MES",
      field: "TCD_BTR_MES",
      ...rightAlign,
      minWidth: 160,
      cssClass: "col-lightblue",
      mutator: (v, d) =>
        (
          (d.TCD_MES_BTP || 0) -
          (d.TCD_MES_ROLLED || 0) +
          (d.TCD_CURRENT_FG_MAT || 0) +
          (d.TCD_CURRENT_WIP_ORD || 0)
        ).toFixed(2),
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },  
    },

    // ===== SLITTING =====
    { title: "Slit Covered", 
      field: "TCD_SLIT_COVERED", 
      ...rightAlign, 
      minWidth: 130,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    {
      title: "Slit Covered >5",
      field: "TCD_SLIT_5MT",
      ...rightAlign,
      minWidth: 150,
      headerClass: "hdr-lightgreen",
      cssClass: "col-lightgreen",
      mutator: (v, d) => {
        const x = Number(d.TCD_SLIT_COVERED || 0);
        return x >= 5 ? x.toFixed(2) : "0.00";
      },
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    { title: "Slit ETO", 
      field: "TCD_SLIT_ETO", 
      ...rightAlign, 
      minWidth: 110,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "Scheduled", 
      field: "TCD_SCHEDULED_1", 
      ...rightAlign, 
      minWidth: 120,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 
    },
    { title: "Bal To Schd-1",
      field: "TCD_BAL_TO_SCHD_1", 
      ...rightAlign, 
      minWidth: 140,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 
    },
    { title: "Slit as on date", 
      field: "TCD_SLIT_AS_ON_DATE", 
      ...rightAlign, 
      minWidth: 150, 
    },

    // ===== CRM (ORANGE) =====
    { title: "CRM FG", 
      field: "TCD_CRM_FG_1", 
      ...rightAlign, 
      minWidth: 100,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 
    },
    { title: "CRM CRS", 
      field: "TCD_CRM_CRS_1", 
      ...rightAlign, 
      minWidth: 110,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Visibility Covered",
      field: "TCD_VISIBILITY_COVERED",
      ...rightAlign,
      minWidth: 160,
      cssClass: "col-lightblue",
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "CRM WIP", 
      field: "TCD_CRM_WIP_1", 
      ...rightAlign, 
      minWidth: 100,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "Bal Slit Required", 
      field: "TCD_BAL_SLIT_REQUIRED", 
      ...rightAlign, 
      minWidth: 150,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    // ===== CRM DISPATCH / BTD =====
    { title: "CRM Despatch", 
      field: "TCD_CRM_DESPATCH", 
      ...rightAlign, 
      minWidth: 140,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    {
      title: "CRM BTD",
      field: "TCD_CRM_BTD",
      ...rightAlign,
      minWidth: 120,
      mutator: (v, d) =>Math.abs((d.TCD_BAL_SLIT_REQUIRED || 0) -(d.TCD_CRM_DESPATCH || 0)).toFixed(2),
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    // ===== STOCK =====
    {
      title: "Ground HR Stock",
      field: "TCD_GROUND_HR_STOCK",
      ...rightAlign,
      minWidth: 160,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
  ];
  const buildGroupHeaderByPOD = (table, value, count, data) => {
    const columns = table.getColumns();

    // Build width-aware grid template
    const gridTemplate = columns.map((col) => col.getWidth() + "px").join(" ");

    // Sum helper
    const sum = (field) => data.reduce((t, r) => t + (Number(r[field]) || 0), 0).toFixed(3);

    // Build one cell PER COLUMN (auto-aligned)
    const cells = columns.map((col, index) => {
      const field = col.getField();

      // First column → group name
      if (index === 0) {
        return `<div class="gh-cell gh-title"> ${value} Total</div>`;
      }

      // Numeric columns → totals
      if (
        [
          "TCD_MES_BTP",
          "TCD_GR_DONE",
          "TCD_DISPATCHED",
          "TCD_MES_ROLLED",
          "TCD_CURRENT_FG_MAT",
          "TCD_CURRENT_WIP_ORD",
          "TCD_BTR_MES",
          "TCD_SLIT_COVERED",
          "TCD_SLIT_5MT",
          "TCD_SLIT_ETO",
          "TCD_SCHEDULED_1",
          "TCD_BAL_TO_SCHD_1",
          "TCD_SLIT_AS_ON_DATE",
          "TCD_CRM_FG_1",
          "TCD_CRM_CRS_1",
          "TCD_VISIBILITY_COVERED",
          "TCD_CRM_WIP_1",
          "TCD_BAL_SLIT_REQUIRED",
          "TCD_CRM_DESPATCH",
          "TCD_CRM_BTD",
          "TCD_GROUND_HR_STOCK",
        ].includes(field)
      ) {
        return `<div style="display:flex;align-items:center;justify-content:center;
         text-align:center; ">${sum(field)}</div>`;
      }

      // Non-numeric columns → empty placeholder
      return `<div style="display:flex;align-items:center;justify-content:center;"></div>`;
    });

    return `<div class="group-header-grid" style="display:grid;font-weight:600;
          grid-template-columns:${gridTemplate}">
      ${cells.join("")}
    </div>`;
  };

  useEffect(() => {
    podTableRef.current= new Tabulator('#CompaignDtlByPOD', {
      data: campaignDataPOD,         // supply your dataset here
      columns: CampaignColumnsByPOD,
      layout: "fitDataStretch",
      height: "450px",
      index: "TCD_SFG_ODIA",
      rowHeader: { headerSort: false },
      groupBy: "TCD_SFG_ODIA",
      groupValues: true,        // ✅ REQUIRED for export
      groupHeader: function (value, count, data, group) {
        return buildGroupHeaderByPOD(group.getTable(), value, count, data);
      },
      columnCalcs: "table",   // ✅ overall totals only
    }
    )
  }, [campaignDataPOD]);

  //===== P.OD columns====

  const CampaignColumnsByOD = [

    // ===== BASIC (LEFT ORANGE) =====
    { title: "OD", field: "TCD_OD", minWidth: 80,},
    { title: "ID",field: "TCD_IDIA", minWidth: 80,},
    { title: "THICKNESS", field: "TCD_THICKNESS", minWidth: 80,},
    { title: "P OD", field: "TCD_SFG_ODIA",...rightAlign, minWidth: 90,},
    { title: "F-GRADE", field: "TCD_FG_GRADE", minWidth: 90 },
    { title: "P THK", field: "TCD_SFG_THICKNESS", ...rightAlign, minWidth: 90 },
    { title: "P.Code", field: "TCD_FG_PCODE", minWidth: 80 },

    // ===== MES =====
    {
      title: "MES BTP", 
      field: "TCD_MES_BTP", 
      ...rightAlign, 
      minWidth: 120, 
      bottomCalc: "sum", 
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "Current WIP(Ord)", 
      field: "TCD_CURRENT_WIP_ORD", 
      ...rightAlign, 
      minWidth: 150,
       bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 

    },
    { title: "Current FG(Mat)",
       field: "TCD_CURRENT_FG_MAT", 
      ...rightAlign, 
      minWidth: 150, 
      bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 

    },
    { title: "Sign Off2", 
      field: "TCD_SIGN_OFF2", 
      ...rightAlign, 
      minWidth: 110, 
      bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 

    },
    { title: "GR Done", 
      field: "TCD_GR_DONE", 
      ...rightAlign, 
      minWidth: 110, 
      bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 

    },
    { title: "MES Rolled", 
      field: "TCD_MES_ROLLED", 
      ...rightAlign, 
      minWidth: 120, 
      bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 

    },

    // ===== BAL TO ROLL (BLUE) =====
    {
      title: "BAL. to Roll MES",
      field: "TCD_BTR_MES",
      ...rightAlign,
      minWidth: 140,
      mutator: (v, d) =>
        (
          (d.TCD_MES_BTP || 0)
          - (d.TCD_MES_ROLLED || 0)
          + (d.TCD_CURRENT_WIP_ORD || 0)
          + (d.TCD_CURRENT_FG_MAT || 0)
        ).toFixed(2),
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    // ===== SLITTING =====
    { title: "Slit Covered", 
      field: "TCD_SLIT_COVERED", 
      ...rightAlign, 
      minWidth: 120, 
      cssClass: "col-lightblue",
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "Slit ETO", 
      field: "TCD_SLIT_ETO", 
      ...rightAlign,
      minWidth: 100, 
      bottomCalc: "sum" ,
      cssClass: "col-red",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "Slit as on date", 
      field: "TCD_SLIT_AS_ON_DATE", 
      ...rightAlign, 
      minWidth: 130, 
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },

    // ===== CRM =====
    { title: "CRM FG", 
      field: "TCD_CRM_FG_1", 
      ...rightAlign,
      minWidth: 100, 
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
      const n = Number(cell.getValue());
      return Number.isFinite(n) ? n.toFixed(3) : "";
    }, 
    },
    { title: "CRM CRS", 
      field: "TCD_CRM_CRS_1", 
      ...rightAlign, 
      minWidth: 100, 
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
      const n = Number(cell.getValue());
      return Number.isFinite(n) ? n.toFixed(3) : "";
    }, 
     },
    {
      title: "Visibility Covered",
      field: "TCD_VISIBILITY_COVERED",
      ...rightAlign,
      minWidth: 140,
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    { title: "CRM WIP", 
      field: "TCD_CRM_WIP_1", 
      ...rightAlign,
      minWidth: 100, 
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 
    },
    { title: "Bal Slit Required", 
      field: "TCD_BAL_SLIT_REQUIRED", 
      ...rightAlign, 
      minWidth: 140, 
      bottomCalc: "sum",
      bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      }, 

    },

    // ===== CRM BTD =====
    {
      title: "CRM BTD",
      field: "TCD_CRM_BTD",
      ...rightAlign,
      minWidth: 100,
      mutator: (v, d) =>
        Math.abs(
          (d.TCD_BAL_SLIT_REQUIRED || 0) -
          (d.TCD_CRM_DESPATCH || 0)
        ).toFixed(2),
      bottomCalc: "sum",
     bottomCalcFormatter: (cell) => {
      const n = Number(cell.getValue());
      return Number.isFinite(n) ? n.toFixed(3) : "";
    },
    },

    // ===== STOCK / ORDERS =====
    {
      title: "Ground HR Stock",
      field: "TCD_GROUND_HR_STOCK",
      ...rightAlign, minWidth: 140,
      bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Extra Order",
      field: "TCD_EXTRA_ORDER",
      ...rightAlign,
      cssClass: "col-red",
      minWidth: 120,
      bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
    {
      title: "Bal slit order to log",
      field: "TCD_BAL_SLIT_ORDER_TO_LOG",
      ...rightAlign,
      minWidth: 160,
      bottomCalc: "sum",bottomCalcFormatter: (cell) => {
        const n = Number(cell.getValue());
        return Number.isFinite(n) ? n.toFixed(3) : "";
      },
    },
  ];

  const buildGroupHeaderByOD = (table, value, count, data) => {
    const columns = table.getColumns();

    // Build width-aware grid template
    const gridTemplate = columns.map((col) => col.getWidth() + "px").join(" ");

    // Sum helper
    const sum = (field) => data.reduce((t, r) => t + (Number(r[field]) || 0), 0).toFixed(3);

    // Build one cell PER COLUMN (auto-aligned)
    const cells = columns.map((col, index) => {
      const field = col.getField();

      // First column → group name
      if (index === 0) {
        return `<div class="gh-cell gh-title"> ${value} Total</div>`;
      }

      // Numeric columns → totals
      if (
        [
          "TCD_MES_BTP",
          "TCD_CURRENT_WIP_ORD",
          "TCD_CURRENT_FG_MAT",
          "TCD_SIGN_OFF2",
          "TCD_GR_DONE",
          "TCD_MES_ROLLED",
          "TCD_BTR_MES",
          "TCD_SLIT_COVERED",
          "TCD_SLIT_ETO",
          "TCD_SLIT_AS_ON_DATE",
          "TCD_CRM_FG_1",
          "TCD_CRM_CRS_1",
          "TCD_VISIBILITY_COVERED",
          "TCD_CRM_WIP_1",
          "TCD_BAL_SLIT_REQUIRED",
          "TCD_CRM_BTD",
          "TCD_GROUND_HR_STOCK",
          "TCD_EXTRA_ORDER",
          "TCD_BAL_SLIT_ORDER_TO_LOG"
        ].includes(field)
      ) {
        return `<div style="display:flex;align-items:center;justify-content:center;
         text-align:center; ">${sum(field)}</div>`;
      }

      // Non-numeric columns → empty placeholder
      return `<div style="display:flex;align-items:center;justify-content:center;"></div>`;
    });

    return `<div class="group-header-grid" style="display:grid;font-weight:600;
          grid-template-columns:${gridTemplate}">
      ${cells.join("")}
    </div>`;
  };

  useEffect(() => {
   odTableRef.current= new Tabulator('#CompaignDtlByOD', {
      data: campaignDataOD,         // supply your dataset here
      columns: CampaignColumnsByOD,
      layout: "fitDataStretch",
      height: "450px",
      index: "TCD_OD",
      rowHeader: { headerSort: false },
      groupBy: "TCD_OD",
      groupValues: true,        // ✅ REQUIRED for export

      groupHeader: function (value, count, data, group) {
        return buildGroupHeaderByOD(group.getTable(), value, count, data);
      },
      columnCalcs: "table",   // ✅ overall totals only
    }
    )
  }, [campaignDataOD]);

  const downloadCampaignTable = () => {
    if (!campaignTableRef.current) {
      alertify.error("Table not initialized");
      return;
    }
    const rowCount = campaignTableRef.current.getDataCount();
    if (rowCount === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    const fileName = "TTSM050_campaign_details.xlsx";
    campaignTableRef.current.download("xlsx", fileName, {
      sheetName: "Campaign Details",
      groupHeader: true,
      columnGroups: false,
      rowGroups: true,          // ✅ shows group rows in Excel

    });
  };
  const downloadCampaignPODTable = () => {
    if (!podTableRef.current) {
      alertify.error("Table not initialized");
      return;
    }
    const rowCount = podTableRef.current.getDataCount();
    if (rowCount === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    const fileName = "TTSM050_campaign_detailsByPod.xlsx";
    podTableRef.current.download("xlsx", fileName, {
      sheetName: "Campaign Details POD",
      groupHeader: true,
      columnGroups: false,
      rowGroups: true,          // ✅ shows group rows in Excel

    });
  };
  const downloadCampaignODTable = () => {
    if (!odTableRef.current) {
      alertify.error("Table not initialized");
      return;
    }
    const rowCount = odTableRef.current.getDataCount();
    if (rowCount === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    const fileName = "TTSM050_campaign_detailsByOD.xlsx";
    odTableRef.current.download("xlsx", fileName, {
      sheetName: "Campaign Details OD",
      groupHeader: true,
      columnGroups: false,
      rowGroups: true,          // ✅ shows group rows in Excel

    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Reports" page="Compaign Deatils" />
      <Grid container direction="row" justifyContent="center" alignItems="center">
        {loading && <Preloader />}
      </Grid>

      {isRestricted && (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}

      {isRestricted == false && (
        <>
          <style>
            {`
            .tabulator .tabulator-header,
            .tabulator .tabulator-header .tabulator-col,
            .tabulator .tabulator-header .tabulator-col .tabulator-col-content {
              background-image:none !important;
            }
            .tabulator .tabulator-header .hdr-green      { background:#15a153 !important; color:#fff !important; }
            .tabulator .tabulator-header .hdr-yellow     { background:#f0b429 !important; color:#000 !important; }
            .tabulator .tabulator-header .hdr-orange     { background:#d8742a !important; color:#fff !important; }
            .tabulator .tabulator-header .hdr-lightgreen { background:#1cdd3f !important; color:#0b2e13 !important; }
            .tabulator .tabulator-header .hdr-darkblue   { background:#0f5e78 !important; color:#fff !important; }
            .tabulator .tabulator-cell.col-green       { background:#40b512 !important; }
            .tabulator .tabulator-cell.col-yellow      { background:#fff6d8 !important; }
            .tabulator .tabulator-cell.col-orange      { background:#ffe9d9 !important; }
            .tabulator .tabulator-cell.col-lightgreen  { background:#1cdd3f !important; }
            .tabulator .tabulator-cell.col-darkblue    { background:#9ed6ed !important; }
            .tabulator .tabulator-cell.col-lightblue    { background:#d9f1f0 !important; }
            .tabulator .tabulator-cell.col-red         { color:#d60000 !important;  background:#ffffff !important; }
          `}
          </style>

          <Grid item xs={12} pt={6}>
            <Grid item xs={6}>
              <AppBar position="static">
                <Tabs
                  orientation={"horizontal"}
                  value={tabValue}
                  onChange={handleSetTabValue}
                >
                  <Tab label="compaign Summery By Mill" icon={<Today />} />
                  <Tab label="compaign Summery By P.OD" icon={<Today />} />
                  <Tab label="compaign Summery By OD " icon={<Today />} />
                </Tabs>
              </AppBar>
            </Grid>
            <Card >
              <MDBox
                mx={2}
                mt={0}
                py={0}
                px={3}
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
              <MDBox px={1} pt={1} pb={2}>
                <Grid container spacing={1}>
                  <Grid item xs={2.5} >
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                      Plant *
                    </MDTypography>
                    <ReactSelect
                      id="plant"
                      options={plant}
                      value={selectedPlant}
                      onChange={handlePlantChange}
                    />
                  </Grid>
                  <Grid item xs={2} >
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                      Mill
                    </MDTypography>
                    <MultipleSelect
                      id="mills"
                      data={millList}
                      value={selectedMill}
                      setValue={handleMillChange}
                      placeholder={"--Select--"}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                      Segment
                    </MDTypography>
                    <MultipleSelect
                      id="segment"
                      data={segmentList}
                      value={selectedSegment}
                      setValue={handleSegmentChange}
                      placeholder={"--Select--"}
                    />
                  </Grid>
                  <Grid item xs={2} >
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                      Zone
                    </MDTypography>
                    <MultipleSelect
                      id="mills"
                      data={zoneList}
                      value={selectedZone}
                      setValue={handleZoneChange}
                      placeholder={"--Select--"}
                    />
                  </Grid>
                  <Grid item xs={2} >
                    <MDTypography
                      fontWeight="regular"
                      fontSize="small"
                      textTransform="capitalize"
                      variant="h6"
                      color={"dark"}
                      noWrap
                    >
                      T-Type
                    </MDTypography>
                    <MultipleSelect
                      id="mills"
                      data={TTypeList}
                      value={selectedTType}
                      setValue={handleTTypeChange}
                      placeholder={"--Select--"}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    <MDButton
                      style={{ marginTop: "1.5rem" }}
                      size="small"
                      color="info"
                      onClick={() => tabValue == 0 ? getCampaignData() : tabValue == 1 ? getCampaignDataPOD() : getCampaignDataOD()}
                    >
                      Submit
                    </MDButton>
                  </Grid>
                  <Grid xs={2} paddingX={2}>
                    <MDButton
                      style={{ marginTop: "1.5rem" }}
                      size="small"
                      color="info"
                      disabled={!isModelAcess}
                      onClick={() => getRunModel()}
                    >
                      Run Model
                    </MDButton>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
          {tabValue == 0 && (
            <Grid mt={2}>
              <Card >
                <MDBox
                  mx={2}
                  mt={-3}
                  py={0}
                  px={3}
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
                        Compaign Deatails By Mills
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Download">
                        <IconButton
                          color="white"
                          onClick={() => downloadCampaignTable(true)}
                        >
                          <DownloadForOfflineIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox px={3} py={1.5}>
                  <Grid container spacing={1}>
                    <div id="CompaignDtl" />
                  </Grid>
                </MDBox>
              </Card>
            </Grid>)}
          {tabValue == 1 && (
            <Grid mt={2}>
              <Card >
                <MDBox
                  mx={2}
                  mt={-3}
                  py={0}
                  px={3}
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
                        Compaign Deatails By P.OD
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Download">
                        <IconButton
                          color="white"
                          onClick={() => downloadCampaignPODTable(true)}
                        >
                          <DownloadForOfflineIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox px={3} py={1.5}>
                  <Grid container spacing={1}>
                    <div id="CompaignDtlByPOD" />
                  </Grid>
                </MDBox>
              </Card>
            </Grid>)}
          {tabValue == 2 && (
            <Grid mt={2}>
              <Card >
                <MDBox
                  mx={2}
                  mt={-3}
                  py={0}
                  px={3}
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
                        Compaign Deatails By OD
                      </MDTypography>
                    </Grid>
                    <Grid item xs={2}>
                      <Tooltip title="Download">
                        <IconButton
                          color="white"
                          onClick={() => downloadCampaignODTable(true)}
                        >
                          <DownloadForOfflineIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>
                <MDBox px={3} py={1.5}>
                  <Grid container spacing={1}>
                    <div id="CompaignDtlByOD"/> 
                  </Grid>
                </MDBox>
              </Card>
            </Grid>)}
        </>
      )}
    </DashboardLayout>
  );
}
