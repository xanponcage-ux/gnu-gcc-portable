import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
// import { ReactTabulator, reactFormatter } from "react-tabulator";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
//import "react-tabulator/css/tabulator_simple.min.css";
//import "react-tabulator/css/tabulator_semanticui.min.css";
import ReactSelect from "components/Select/ReactSelect";
import MonthPicker from "components/DateTime/DatePicker";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import MDAlert from "@mui/material/Alert";
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
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import TabIcon from "@mui/icons-material/Tab";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import MoveUpIcon from "@mui/icons-material/MoveUp";
import SearchIcon from "@mui/icons-material/Search";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import SaveModal from "./Modals/SaveModal";
import ScrapModal from "./Modals/ScrapModal";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import { GetAuthorization } from "../../utils";
import "../../tabulatorCss.scss";
import LDSM048ConfirmModal from "./Modals/LDSM048ConfirmModal";
import LDSM048SplitNoModal from "./Modals/LDSM048SplitNoModal";
import LDSM048SplitModal from "./Modals/LDSM048SplitModal";
import LDSM048EditModal from "./Modals/LDSM048EditModal";

export default function TubePlanning() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [ordType, setOrdType] = useState([]);
  const [selectedOrderType, setSelectOrderType] = React.useState([]);
  const [customerDesc, setCustomerDesc] = useState([]);
  const [scrapDataTable, setScrapDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [selectedPcat, setSelectPcat] = React.useState([]);
  const [plant, setPlant] = useState([]);
  const [materialNo, setMaterialNo] = useState([]);
  const [scrapMaterialData, setScrapMaterialData] = useState([]);
  const [castNoList, setCastNoList] = useState([]);

  const [selectedScrapWt, setSelectedScrapWt] = useState([]);
  const [processListScrap, setProcessListScrap] = useState([]);
  const [selectedProcessScrap, setSelectedProcessScrap] = useState([]);

  const [procFrmDt, setProcFrmDt] = useState(null);
  const [procToDt, setProcToDt] = useState(null);
  const [decFrmDt, setDecFrmDt] = useState(null);
  const [decToDt, setDecToDt] = useState(null);

  const [selectedPlantMoM, setSelectedPlantMoM] = useState([]);
  const [selectedWidthOdiaMoM, setSelectedWidthOdiaMoM] = useState([]);
  const [selectedMatNoMoM, setSelectedMatNoMoM] = useState([]);
  const [selectedStatusMoM, setSelectedStatusMoM] = useState([]);

  const [selectedPlantSplit, setSelectedPlantSplit] = useState([]);
  const [selectedBatchSplit, setSelectedBatchSplit] = useState([]);
  const [selectedQtySplit, setSelectedQtySplit] = useState([]);
  const [selectedPiecesSplit, setSelectedPiecesSplit] = useState([]);
  const [selectedStatusSplit, setSelectedStatusSplit] = useState([]);

  const [selectedCastNo, setSelectedCastNo] = useState([]);
  const [selectedMaterialNo, setSelectedMaterialNo] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [finalMergedQnty, setFinalMergedQnty] = useState(0);
  const [finalMergedPcs, setFinalMergedPcs] = useState(0);
  const [totalActualQnty, setTotalActualQnty] = useState(0);
  const [totalActualPcs, setTotalActualPcs] = useState(0);
  const [upType, setUpType] = useState([]);
  const [selectedUpType, setSelectedUpType] = useState([]);
  const [status, setStatus] = useState([]);
  // const [selectedStatus, setSelectedStatus] = useState([]);
  const [action, setAction] = useState([]);
  const [selectedAction, setSelectedAction] = useState([]);
  const [selectCustomerDesc, setSelectCustomerDesc] = useState([]);
  const [reason, setReason] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [showScrapModal, setShowScrapModal] = useState(false);
  const [scrapmodalData, setScrapModalData] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState([]);

  const [showSplitNoModal, setShowSplitNoModal] = useState(false);
  const [splitNoModalData, setSplitNoModalData] = useState([]);

  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitModalData, setSplitModalData] = useState([]);
  const [splitNo, setSplitNo] = useState([]);
  const [splitType, setSplitType] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState([]);
  const [editModalBatchID, setEditModalBatchID] = useState([]);

  const [momTableData, setMomTableData] = useState([]);
  const [selectedMoMTableData, setSelectedMoMTableData] = useState(null);

  const [splitTableData, setSplitTableData] = useState([]);
  const [selectedSplitTableData, setSelectedSplitTableData] = useState(null);

  const [selectedProcess, setSelectedProcess] = useState([]);
  const [selectedProdType, setSelectedProdType] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedTonnage, setSelectedTonnage] = useState([]);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [bUnit, setBunit] = useState([]);

  const defaultHrForm = {
    runit: "P",
    ctype: "",
    rcode: "",
  };
  var mergedQnty = 0,
    mergedPcs = 0;

  const [filter, setFilter] = useState(defaultHrForm);
  const [scrapData, setScrapData] = React.useState([]);

  const [tabValue, setTabValue] = useState(2);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const [targetMatNoList, setTargetMatNoList] = useState([]);
  const [momWidthOdia, setMomWidthOdia] = useState([]);

  const [pageAuth, setPageAuth] = useState(0);

  var customerTable = React.createRef();
  const [allValues, setAllValues] = useState({
    status: "",
    prodCd: "",
    qltyCd: "",
    castNo: "",
    tdc: "",
    batch: "",
    mbatch: "",
    thickFrm: "",
    thickTo: "",
    widthFrm: "",
    widthTo: "",
    matNo: "",
    // scrpWt:""
  });

  const [statusMerging, setStatusMerging] = useState([]);
  const [selectedStatusMerging, setSelectedStatusMerging] = useState([]);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const [allValuesMoM, setAllValuesMoM] = useState({
    targetMatNo: "",
  });
  const [allValuesMoMFilter, setAllValuesMoMFilter] = useState({
    batch_id: "",
  });

  const handleChangeMoMFilter = (e) => {
    setAllValuesMoMFilter({
      ...allValuesMoMFilter,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeMoM = (e) => {
    setAllValuesMoM({ ...allValuesMoM, [e.target.name]: e.target.value });
  };

  const [allValuesMerging, setAllValuesMerging] = useState({
    plant: "",
    matNo: "",
    castNo: "",
  });
  const handleChangeMerging = (e) => {
    setAllValuesMerging({
      ...allValuesMerging,
      [e.target.name]: e.target.value,
    });
  };

  const [allValuesSplit, setAllValuesSplit] = useState({
    batch: "",
    qty: "",
    pcs: "",
  });
  const handleChangeSplit = (e) => {
    setAllValuesSplit({ ...allValuesSplit, [e.target.name]: e.target.value });
  };

  const [selectedPlantMerging, setSelectedPlantMerging] = useState({});
  const [mergingTableData, setMergingTableData] = useState([]);
  const [selectedMergingTableData, setSelectedMergingTableData] = useState([]);

  const upload_type = [
    { label: "ALL", value: "" },
    { label: "FG", value: "F" },
    { label: "Scrap", value: "S" },
  ];

  const scrapWt = [
    { label: "No value", value: "" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
    { label: "13", value: "13" },
    { label: "14", value: "14" },
    { label: "15", value: "15" },
    { label: "16", value: "16" },
    { label: "17", value: "17" },
    { label: "18", value: "18" },
    { label: "19", value: "19" },
    { label: "20", value: "20" },
    { label: "21", value: "21" },
    { label: "22", value: "22" },
    { label: "23", value: "23" },
    { label: "24", value: "24" },
    { label: "25", value: "25" },
  ];

  const status_type = [
    { label: "ALL", value: "" },
    { label: "E - Error", value: "E" },
    { label: "Y - Success", value: "Y" },
    { label: "A - Active", value: "A" },
  ];
  const action_type = [
    { label: "ALL", value: "" },
    { label: "A - Active", value: "A" },
    { label: "Y - Success", value: "Y" },
  ];

  // const splitStatusList = [
  //   { label: "KB", value: "KB" },
  //   { label: "WB", value: "WB" },
  //   { label: "WF", value: "WF" },
  //   { label: "KF", value: "KF" }, //@@@ Added as on date 11-04-2023.
  // ]

  const [sptBatchDetails, setSptBatchDetails] = useState([]);
  const [sptBatchDetailsTable, setSptBatchDetailsTable] = useState(null);

  const [sptSplitBatchDetails, setSptSplitBatchDetails] = useState([]);
  const [sptSplitBatchDetailsTable, setSptSplitBatchDetailsTable] =
    useState(null);

  const [splitStatus, setSplitStatus] = useState([]);
  const [selectedSplitStatus, setSelectedSplitStatus] = useState(null);

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      setLoading(true);
      Promise.all([
        getGroupPlantId(token.accessToken),
        getPageAuth(token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
      // getTargetMatNo();
      //     getProdCat();
    });
  }

  //page load
  useEffect(() => {
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
      var pageName = "LDSM048";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

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

  const getPageAuth = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        pno: serverDetails.PersonalNo,
      };
      var url = "api/LDSM048/getauth";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            setPageAuth(response.data);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getGroupPlantId = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        // adid: 151631,
        adid: serverDetails.PersonalNo,
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
            serverDetails.Plant = items[0].value;
            setSelectedPlantSplit(items[0]);
            setSelectedPlant(items[0]);
            setSelectedPlantMerging(items[0]);
            setSelectedPlantMoM(items[0]);
            Promise.all([
              getMoMWidthOdia(items[0], accessToken),
              getMaterialNo(items[0], accessToken),
              getSplitStatusList(items[0], accessToken),
              getMergingStatusList(items[0], accessToken),
              getCastNo(items[0], accessToken),

            ]).finally(() => {
              resolve();
            });
          }
        })
        .catch(() => {
          resolve();
        });
    });
  };
  const getSplitStatusList = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM048/getSplitStatus";
      let data = {
        plant: value.value,
      };
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
              obj.value = row[0];
              items.push(obj);
            });
            setSplitStatus(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getMergingStatusList = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM048/getMergingStatus";
      let data = {
        plant: value.value,
      };
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
              obj.value = row[0];
              items.push(obj);
            });
            setStatusMerging(items);
            //setSelectedStatusMerging(items[0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getScrapMaterialData = (e, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        plant: e.value,
      };
      var url = "api/LDSM048/getMaterialData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = new Object();
            response.data.map((row) => {
              var x = row.MATERIAL_NO + ":" + row.MATERIAL_DESC;
              var y = row.MATERIAL_NO;
              items[y] = x;
            });

            setScrapMaterialData(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getCastNo = (e, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        // adid: 151631,
        // adid : serverDetails.PersonalNo,
        plant: e.value,
      };
      var url = "api/LDSM048/castno";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row;
              obj.value = row;
              items.push(obj);
            });
            setCastNoList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getMaterialNo = (e, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        plant: e.value,
      };
      var url = "api/LDSM048/materialno";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row;
              obj.value = row;
              items.push(obj);
            });
            setMaterialNo(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  //for dateTime
  //date formatter
  var dateOnly = function (value, data, type, params, column) {
    if (value) {
      //var newVal = new Date(value).toISOString().substring(0, 10);
      var date = new Date(value);
      var year = date.getFullYear();
      var month = date.getMonth();
      var dt = date.getDate();
      if (dt < 10) {
        dt = "0" + dt;
      }
      //  if (month < 10) {
      //    month = "0" + month;
      //  }
      var newVal = dt + "-" + months[month] + "-" + year;
      return newVal;
    }
    return value;
  };
  //date time formatter
  var dateTimeOnly = function (value, data, type, params, column) {
    if (value) {
      //var newVal = new Date(value).toISOString().substring(0, 10);
      var date = new Date(value);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var dt = date.getDate();
      if (dt < 10) {
        dt = "0" + dt;
      }
      if (month < 10) {
        month = "0" + month;
      }
      var newVal =
        dt + "/" + month + "/" + year + " " + date.toLocaleTimeString();
      return newVal;
    }
    return value;
  };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getCustDesc = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/GetCustDesc";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });
            setCustomerDesc(items);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const getOrdTyp = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/GetOrdTyp";
      let data = {
        plant: value.value,
      };
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
            setOrdType(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getProdCat = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      setLoading(true);
      var url = "api/LDSM007/GetProdCat";
      axiosAPI
        .post(url, defaultOptions)
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
            setProdCat(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getMoMWidthOdia = async (e, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM048/momwidthodia";
      var data = {
        plant: e.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              // var val = row.split('-');
              var obj = new Object();
              obj.label = row.toFixed(3);
              obj.value = row.toFixed(3);
              items.push(obj);
            });
            setMomWidthOdia(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const updateFGData = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var selectedRows = fgDataTable.getSelectedRows();

      var selectedData = [];
      selectedRows.forEach(function (item) {
        selectedData.push({
          status: item._row.data.STATUS,
          ORDER_ID: item._row.data.SCO_ORDER_NO,
          ORER_ITEM: item._row.data.SCO_ORDER_ITEM,
          CHARG: item._row.data.BATCH,
          TIME_STAMP: item._row.data.TIME_STAMP,
        });
      });

      if (selectedData.length == 0) {
        alertify.error("No rows selected");
        return;
      }

      var data = {
        selectedData: selectedData,
      };

      var url = "api/LDSM022/updateFGData";

      // api call
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("Error Inserting Data");
          } else {
            alertify.success(`${response.data} row(s) updated successfully!`);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };
  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    serverDetails.Plant = value;
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getCustDesc(value, token.accessToken),
          getOrdTyp(value, token.accessToken),
          getScrapMaterialData(value, token.accessToken),
          getProcessDesc(value, token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const getProcessDesc = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM048/processdesc";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var val = row.split(":");
              var obj = new Object();
              obj.label = val[1];
              obj.value = val[0];
              items.push(obj);
            });
            setProcessListScrap(items);
          }
        })
        .finally(() => {
          resolve();
        });
    });
  };

  const handleScrapWtChange = (e) => {
    setSelectedScrapWt(e);
  };
  const handleUploadChange = (value) => {
    setSelectedUpType(value);
  };

  const handleProcessChange = (e) => {
    setSelectedProcess(e);
  };
  const handleProdTypeChange = (e) => {
    setSelectedProdType(e);
  };
  const handleStatusChange = (e) => {
    setSelectedStatus(e);
  };
  const handleTonnageChange = (e) => {
    setSelectedTonnage(e);
  };
  // const handleStatusChange = (value) => {
  //   setSelectedStatus(value);
  // };
  const handleActionChange = (value) => {
    setSelectedAction(value);
  };
  const handleCustomerChange = (value) => {
    setSelectCustomerDesc(value);
  };

  const handleOrdTypeChange = (value) => {
    setSelectOrderType(value);
  };

  const handlePCatChange = (value) => {
    setSelectPcat(value);
  };

  const getDataFnc = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getData(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  React.useEffect(() => {
    sptBatchDetailsTable?.on("rowSelectionChanged", function (data, rows) {
      setSplitTableData([,]);
    });
  }, [sptBatchDetailsTable]);

  const getData = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url;
      // alert(selectedPlant.value);
      var data = {
        plant: selectedPlant.value,
        process: selectedProcess.value,
        prodType: selectedProdType.value,
        status: selectedStatus.value,
        scrpWt: selectedScrapWt.value,
        tonnage: selectedTonnage.value,
        procFrmDt: procFrmDt
          ? procFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        procToDt: procToDt
          ? procToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        decFrmDt: decFrmDt
          ? decFrmDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
        decToDt: decToDt
          ? decToDt
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
            .replace(/ /g, "-").replace("Sept", "Sep")
          : "",
      };

      data = { ...data, ...allValues };

      url = "api/LDSM048/getScrapData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setScrapData([,]);
            } else {
              setScrapData(response.data);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleChangeSwitch = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };
  var editIcon = function (cell, formatterParams, onRendered) {
    return "<i class='fa-solid fa-edit' style='color:#49a3f1'></i>";
  };
  const showMaterialWindow = async (cell) => {
    setModalData(cell._cell.row.data);
    setShowModal(true);
  };
  // const showScrapMatWindow = async (cell) => {

  //   setScrapModalData(cell._cell.row.data);
  //   setShowScrapModal(true);
  // };

  const showConfrimWindow = async (cell) => {
    setShowConfirmModal(true);
    setConfirmModalData(cell._cell.row.data);
  };

  const showSplitNoWindow = async (cell) => {
    // if(cell._cell.row.data.LOM_CD_STATUS != "VF"){
    //   setShowSplitNoModal(true);
    // }

    setShowSplitNoModal(true);

    var selectedRows = sptBatchDetailsTable.getSelectedRows();
    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        dt: item._row.data,
      });
    });

    if (!(selectedRows.length > 0)) {
      alertify.error("Please select a row!");
      return;
    }

    var d = {
      bDt: selectedData[0],
      sDt: cell._cell.row.data,
    };

    setSplitModalData(d);
    // setSplitNoModalData(cell._cell.row.data);
  };

  const showEditWindow = async (cell, idBatch) => {
    setShowEditModal(true);
    setEditModalData(cell._cell.row.data);
    setEditModalBatchID(idBatch);
  };

  //count number of users over 18
  var MergeQntyCalc = function (props) {
    var tempData = selectedMergingTableData.getSelectedRows();

    //values - array of column values
    //data - all table data
    //calcParams - params passed from the column definition object

    //   var calc = 0;

    //   values.forEach(function(value){

    //       if(value > 18){
    //       calc ++;
    //       }
    //   });

    //   return calc;
  };

  var ActualQtySum = function (values, data, calcParams) {
    //values - array of column values
    //data - all table data
    //calcParams - params passed from the column definition object

    var sum = 0;

    values.forEach(function (value) {
      sum += value;
    });

    sum = sum.toFixed(3);
    setTotalActualQnty(sum);
    return sum;
  };

  var ActualPcsSum = function (values, data, calcParams) {
    //values - array of column values
    //data - all table data
    //calcParams - params passed from the column definition object

    var sum = 0;

    values.forEach(function (value) {
      sum += value;
    });
    setTotalActualPcs(sum);
    return sum;
  };

  const options = {
    height: 400,
    pagination: "local",
    paginationSize: 200,
    layout: "fitDataFill",
    downloadDataFormatter: (data) => data,
    downloadReady: (fileContents, blob) => blob,
    // responsiveLayout:"collapse",
    // responsiveLayoutCollapseStartOpen:false,
  };

  const ScrapColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },

    //added by lakhan
    // {
    //   title: '<input type="checkbox" class="select-all-row" aria-label="select all rows" />',
    //   field: 'IsSelected',
    //   formatter: function(cell, formatterParams, onRendered) {
    //     return '<input type="checkbox" class="select-row" aria-label="select this row" />';
    //   },
    //   width: 50,
    //   headerSort: false,
    //   headerFilter: false,
    //   cssClass: 'text-center',
    //   frozen: true,
    //   tooltips: false,
    //   resizable: false,
    //   cellClick: function(e, cell) {
    //     var element = cell.getElement();
    //     var chkbox = element.querySelector('.select-row');
    //     var temp = 0;
    //     if (cell.getData().IsSelected) {

    //       cell.getRow().deselect();
    //       document.querySelector('.select-all-row').checked = false;
    //     } else {
    //       var idCount = cell.getData().COUNT;
    //       var idHold = cell.getData().HOLD_TAG;
    //       var idBatch = cell.getData().LOM_ID_BATCH;

    //       if(idCount == 0){
    //         if(idHold == 'Y'){
    //           alertify.error("Batch is on Hold. It can only be Processed once it is released.");
    //         }else{
    //           showConfrimWindow(cell);
    //         }
    //       }else{
    //         if(idHold == 'Y'){
    //           alertify.error("Batch is on Hold. It can only be Processed once it is released.");
    //         }else{
    //           showEditWindow(cell , idBatch);
    //         }
    //       }

    //       cell.getRow().select();
    //       if (cell.getColumn().getTable().getSelectedRows().length === cell.getColumn().getTable().getDataCount()) {
    //         document.querySelector('.select-all-row').checked = true;
    //       }
    //     }
    //     chkbox.checked = !cell.getData().IsSelected;
    //     cell.getData().IsSelected = !cell.getData().IsSelected;

    //   },
    //   headerClick: function(e, column) {
    //     if (column.getTable().getSelectedRows().length !== column.getTable().getDataCount()) {
    //       document.querySelectorAll('.select-row,.select-all-row').forEach(cb => cb.checked = true);
    //       column.getTable().selectRow();
    //     } else {
    //       document.querySelectorAll('.select-row,.select-all-row').forEach(cb => cb.checked = false);
    //       column.getTable().deselectRow();
    //     }
    //     column.getCells().forEach(cell => cell.getData().IsSelected = !cell.getData().IsSelected);
    //   }

    // },
    //end by lakhan
    {
      title: "Batch",
      field: "LOM_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      cellClick: function (e, cell) {
        var data = cell.getData();

        var idCount = data.COUNT;
        var idHold = data.HOLD_TAG;
        var idBatch = data.LOM_ID_BATCH;

        if (idCount == 0) {
          if (idHold == "Y") {
            alertify.error(
              "Batch is on Hold. It can only be Processed once it is released."
            );
          } else {
            showConfrimWindow(cell);
          }
        } else {
          if (idHold == "Y") {
            alertify.error(
              "Batch is on Hold. It can only be Processed once it is released."
            );
          } else {
            showE;
            ditWindow(cell, idBatch);
          }
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#ADD8E6";
        //cell.getElement().style["color"] = "#ffffff";
        return value;
      },
    },
    {
      title: "Status",
      field: "LOM_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Scrap Material",
      field: "SCRP_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Weight",
      field: "LOM_MS_PIECE_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Res Wt.",
      field: "LOM_MS_GROSS_CAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Scrap Wt.",
      field: "LOM_MS_SCRAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Parent Batch",
      field: "LOM_ID_PAR_COIL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "LOM_ID_FIRST_PAR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TDC",
      field: "LOM_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod",
      field: "LOM_CD_PROD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Quality",
      field: "LOM_CD_QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Length",
      field: "LOM_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Thick",
      field: "LOM_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Width",
      field: "LOM_SEC2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Offcut Arising",
      field: "LOM_FL_OFF_CUT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "LOM_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "LOM_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Dt Scrap",
      field: "LOM_DT_SCRAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "No Pcs",
      field: "LOM_NO_PIECES",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SCO Order",
      field: "LOM_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "LOM_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FL sends SYS",
      field: "LOM_FL_SEND_SAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch Material",
      field: "LOM_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Invoice No",
      field: "LOM_NO_INVOICE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Invoice Dt",
      field: "LOM_DT_INVOICE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Production Dt",
      field: "LOM_TS_CREATION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed Process",
      field: "LOM_PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Current Process",
      field: "CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap Declared By",
      field: "SCRAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Batch St",
      field: "BatchSt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SCRAP_COUNT",
      field: "Count",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible: false,
    },
    {
      title: "Hold Tag",
      field: "HOLD_TAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Total Coil Scrap",
      field: "TotalCoilScrap",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];


  const mergeColumn = [
    {
      title:
        '<input type="checkbox" class="select-all-row" aria-label="select all rows" />',
      field: "IsSelected",
      formatter: function (cell, formatterParams, onRendered) {
        return '<input type="checkbox" class="select-row" aria-label="select this row" />';
      },
      width: 50,
      headerSort: false,
      headerFilter: false,
      cssClass: "text-center",
      frozen: true,
      tooltips: false,
      resizable: false,
      cellClick: function (e, cell) {
        var element = cell.getElement();
        var chkbox = element.querySelector(".select-row");
        var temp = 0;
        if (cell.getData().IsSelected) {
          mergedQnty -= Number(cell.getData().ACTUAL_QTY);
          mergedPcs -= Number(cell.getData().ACTUAL_PCS);

          cell.getRow().deselect();
          document.querySelector(".select-all-row").checked = false;
        } else {
          mergedQnty += Number(cell.getData().ACTUAL_QTY);
          mergedPcs += Number(cell.getData().ACTUAL_PCS);
          cell.getRow().select();
          if (
            cell.getColumn().getTable().getSelectedRows().length ===
            cell.getColumn().getTable().getDataCount()
          ) {
            document.querySelector(".select-all-row").checked = true;
          }
        }

        var mergQnty = mergedQnty.toFixed(3);
        setFinalMergedQnty(mergQnty);
        setFinalMergedPcs(mergedPcs);
        chkbox.checked = !cell.getData().IsSelected;
        cell.getData().IsSelected = !cell.getData().IsSelected;
      },
      headerClick: function (e, column) {
        if (
          column.getTable().getSelectedRows().length !==
          column.getTable().getDataCount()
        ) {
          document
            .querySelectorAll(".select-row,.select-all-row")
            .forEach((cb) => (cb.checked = true));
          column.getTable().selectRow();
        } else {
          document
            .querySelectorAll(".select-row,.select-all-row")
            .forEach((cb) => (cb.checked = false));
          column.getTable().deselectRow();
        }
        column
          .getCells()
          .forEach(
            (cell) => (cell.getData().IsSelected = !cell.getData().IsSelected)
          );
      },
    },
    {
      title: "Row ID",
      field: "rowId",
      hozAlign: "center",
      headerSort: false,
      download: false,
      visible: false,
    },
    {
      title: "Batch",
      field: "BATCH1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thick",
      field: "THK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Number",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width:200
    },
    {
      title: "ACTUAL_QTY_COPY",
      field: "ACTUAL_QTY_COPY",
      visible: false,
      download: false,
    },
    {
      title: "ACTUAL_PCS_COPY",
      field: "ACTUAL_PCS_COPY",
      visible: false,
      download: false,
    },
    {
      title: "Actual Qty",
      field: "ACTUAL_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: ActualQtySum,
      bottomCalcParams: { precision: 3 },

      formatter: function (cell, formatterParams) {

        var value = cell.getValue();
        if (value) {
          if (Number(cell._cell.row.data.ACTUAL_QTY_COPY) < Number(value)) {
            return Number(cell._cell.row.data.ACTUAL_QTY_COPY).toFixed(3);
          }
          if (0 > Number(value)) {
            value = 0;
            cell._cell.row.data.ACTUAL_QTY = 0;
          }
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Actual Pcs",
      field: "ACTUAL_PCS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      bottomCalc: ActualPcsSum,

      formatter: function (cell, formatterParams) {

        var value = cell.getValue();
        if (Number(cell._cell.row.data.ACTUAL_PCS_COPY) < Number(value)) {
          return Number(cell._cell.row.data.ACTUAL_PCS_COPY);
        }
        if (0 > Number(value)) {
          value = 0;
          cell._cell.row.data.ACTUAL_PCS = 0;
        }
        return value;
      },
    },
    {
      title: "Cast No",
      field: "CAST_NO",
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
      title: "Idia",
      field: "IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order No",
      field: "ORDER_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "ITEM",
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
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }
  ];



  //   LOM_idia              idia,
  //   LOM_id_order_cus      order_no,
  //   LOM_id_ord_item_cus   item,
  //   LOM_id_first_par      mother_batch,
  //   LOM_id_par_coil_no    parent_batch,

  const splitColumn = [
    {
      title: "Batch ID",
      field: "LOM_ID_BATCH",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant Code",
      field: "LOM_CD_EPA",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "LOM_CD_STATUS",
      headerFilterPlaceholder: "search...",
      width: "10%",
    },
    {
      title: "Qty(KG)",
      field: "LOM_MS_GROSS_CAL",
      headerFilterPlaceholder: "search...",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Pieces",
      field: "LOM_NO_PIECES",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseInt(value);
          // return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Split",
      field: "",
      headerFilterPlaceholder: "search...",
      cellClick: function (e, cell) {
        showSplitNoWindow(cell);
      },
      formatter: "handle",
      width: "9%",
    },
  ];

  const sptBatchDetailsColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
      width: "2%",
    },

    // {
    //   // title: '<input type="checkbox" class="select-all-row" aria-label="select all rows" />',
    //   field: 'IsSelected',
    //   formatter: function (cell, formatterParams, onRendered) {
    //     return '<input type="checkbox" class="select-row" aria-label="select this row" />';
    //   },
    //   width: 50,
    //   headerSort: false,
    //   headerFilter: false,
    //   cssClass: 'text-center',
    //   frozen: true,
    //   tooltips: false,
    //   resizable: false,
    //   // rowClick:function(e,row){
    //   // },
    //   cellClick: function (e, cell) {
    //     var element = cell.getElement();
    //     var chkbox = element.querySelector('.select-row');

    //     //single row select
    //     // document.querySelectorAll('.select-row,.select-all-row').forEach(cb => cb.checked = false);
    //     // cell.getTable().deselectRow();

    //     // setSptSplitBatchDetails([,]);
    //     // setSptSplitBatchDetailsTable(null);

    //     // var temp = 0;
    //     // if (cell.getData().IsSelected) {

    //     //   mergedQnty -= Number(cell.getData().ACTUAL_QTY);
    //     //   mergedPcs -= Number(cell.getData().ACTUAL_PCS);

    //     //   cell.getRow().deselect();
    //     //   document.querySelector('.select-all-row').checked = false;
    //     // } else {
    //     //   mergedQnty += Number(cell.getData().ACTUAL_QTY);
    //     //   mergedPcs += Number(cell.getData().ACTUAL_PCS);

    //     //   cell.getRow().select();
    //     //   if (cell.getColumn().getTable().getSelectedRows().length === cell.getColumn().getTable().getDataCount()) {
    //     //     document.querySelector('.select-all-row').checked = true;
    //     //   }
    //     // }

    //     // var mergQnty = mergedQnty.toFixed(3);
    //     // setFinalMergedQnty(mergQnty);
    //     // setFinalMergedPcs(mergedPcs);
    //     chkbox.checked = !cell.getData().IsSelected;
    //     cell.getData().IsSelected = !cell.getData().IsSelected;

    //   },
    //   // rowClick : function(e,cell){
    //   // },
    //   headerClick: function (e, column) {
    //     if (column.getTable().getSelectedRows().length !== column.getTable().getDataCount()) {
    //       document.querySelectorAll('.select-row,.select-all-row').forEach(cb => cb.checked = true);
    //       column.getTable().selectRow();
    //     } else {
    //       document.querySelectorAll('.select-row,.select-all-row').forEach(cb => cb.checked = false);
    //       column.getTable().deselectRow();
    //     }
    //     column.getCells().forEach(cell => cell.getData().IsSelected = !cell.getData().IsSelected);
    //   }

    // },
    {
      title: "Batch ID",
      field: "BATCH_ID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "PLANT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.(KG)",
      field: "NET_WT_KG",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Prime Tube No.",
      field: "PRIME_TUBE_NOS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Work Center",
      field: "WORK_CENT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "MOTHER_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickness",
      field: "THK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia",
      field: "ODIA",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LENGTH1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Grade",
      field: "GRADE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const sptSplitBatchDetailsColumn = [
    {
      title: "Split Batch ID",
      field: "SPLIT_BATCH_ID",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "PLANT",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.(KG)",
      field: "NET_WT_KG",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prime Tube No.",
      field: "PRIME_TUBE_NOS",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Work Center",
      field: "WORK_CENT",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "MOTHER_BATCH",
      headerFilterPlaceholder: "search...",
    },
  ];

  const momTransferColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
      width: "2%",
    },
    {
      title: "Plant",
      field: "PLANT",

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
      title: "Source Material No.",
      field: "MATNO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.(TON)",
      field: "NET_WT_KG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Status",
      field: "STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickenss",
      field: "THICKNESS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Width/Odia",
      field: "WIDTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Tdc",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Quality Cd.",
      field: "QCODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const handlePlantChangeMerging = (e) => {
    setSelectedPlantMerging(e);
    setSelectedStatusMerging("");
    if (e) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getMaterialNo(e, token.accessToken),
          getCastNo(e, token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleStatusMergingChange = (e) => {
    if (e) {
      setSelectedStatusMerging(e);
    } else {
      setSelectedStatusMerging([]);
    }
    setSelectedMaterialNo([]);
    setSelectedCastNo([]);
    setMergingTableData([,]);
  };
  const handleMaterialNoChange = (e) => {
    if (e) {
      setSelectedMaterialNo(e);
      setMergingTableData([,]);
    } else {
      setSelectedMaterialNo([]);
    }
  };

  const handleCastNoChange = (e) => {
    if (e) {
      setSelectedCastNo(e);
      setMergingTableData([,]);
    } else {
      setSelectedCastNo([]);
    }
  };

  const handlePlantChangeMoM = (e) => {
    setSelectedPlantMoM(e);

    // setAllValuesMoM({});
    // setMomTableData([,]);

    setSelectedWidthOdiaMoM([]);
    setAllValuesMoM({});
    setMomTableData([,]);
    setSelectedMoMTableData(null);
    setAllValuesMoMFilter({});

    setSelectedMoMTableData(null);
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getMoMWidthOdia(e, token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleWidthOdiaChangeMoM = (e) => {
    setSelectedWidthOdiaMoM(e);
  };

  const handleMatNoChangeMoM = (e) => {
    setSelectedMatNoMoM(e);
  };

  const handleStatusChangeMoM = (e) => {
    setSelectedStatusMoM(e);
  };

  const handlePlantChangeSplit = (e) => {
    serverDetails.Plant = e.value;
    setSelectedPlantSplit(e);

    setSplitTableData([,]);
    setSelectedSplitTableData(null);

    setSptBatchDetails([,]);
    setSptBatchDetailsTable(null);

    setSptSplitBatchDetails([,]);
    setSptSplitBatchDetailsTable(null);

    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([
        getBusinessCd(e, token.accessToken),
        getSplitStatusList(e, token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleStatusChangeSplit = (e) => {
    setSelectedStatusSplit(e);

    setSplitTableData([,]);
    setSelectedSplitTableData(null);

    setSptBatchDetails([,]);
    setSptBatchDetailsTable(null);

    setSptSplitBatchDetails([,]);
    setSptSplitBatchDetailsTable(null);
  };

  //get business code
  const getBusinessCd = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM007/getBUnitCd";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[1];
              obj.value = row[0];
              items.push(obj);
            });
            setBunit(items[0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleBatchChangeSplit = (e) => {
    setSelectedBatchSplit(e);
  };

  const handleQtyChangeSplit = (e) => {
    setSelectedQtySplit(e);
  };

  const handlePiecesChangeSplit = (e) => {
    setSelectedPiecesSplit(e);
  };

  const getMoMDataFnc = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getMoMData(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getMoMData = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      if (!selectedPlantMoM.value) {
        alertify.error("Please select Plant");
        resolve();
        return;
      }

      var widthOdia = [];
      // for(var item in selectedWidthOdiaMoM){

      //   widthOdia.push(item.value);
      // }
      selectedWidthOdiaMoM.forEach((item) => {
        widthOdia.push(item.value);
      });
      var data = {
        plant: selectedPlantMoM.value ? selectedPlantMoM.value : "",
        widthOdia: widthOdia,
        // matNo : selectedMatNoMoM.value ? selectedMatNoMoM.value :"",
        // status : selectedStatusMoM.value ? selectedStatusMoM.value : ""
      };

      data = { ...allValuesMoMFilter, ...data };

      var url = "api/LDSM048/momdata";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setMomTableData([,]);
            } else {
              setMomTableData(response.data);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const saveMoMData = () => {
    if (allValuesMoM.targetMatNo == "") {
      alertify.error("Please enter Target Material No.");
      return;
    }

    //get selected data
    var selectedRows = selectedMoMTableData.getSelectedRows();

    //conversion of data format
    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        PLANT: item._row.data.PLANT,
        BATCH_ID: item._row.data.BATCH_ID,
        MATNO: item._row.data.MATNO,
      });
    });

    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }
    setLoading(true);

    var data = {
      personalNo: serverDetails.PersonalNo,
      selectedData: selectedData,
      // targetMatNo : selectedMatNoMoM.value
    };

    data = { ...allValuesMoM, ...data };

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM048/savemomdata";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("Internal Server Error!");
          } else {
            if (response.data.failedBatches.length == 0) {
              alertify.success("MOM Transfer successful for all batches.");
            } else {
              alertify.error(
                "Could not transfer the following batches : ",
                response.data.failedBatches,
                " and rest are successfully transfered."
              );
            }
            Promise.all([getMoMData(token.accessToken)]).finally(() => {
              setLoading(false);
            });
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  const getSplitData = () => {
    var selectedRows = sptBatchDetailsTable.getSelectedRows();
    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        MOTHER_BATCH: item._row.data.MOTHER_BATCH,
        BATCH_ID: item._row.data.BATCH_ID,
        PLANT: item._row.data.PLANT,
      });
    });

    if (!(selectedRows.length > 0)) {
      alertify.error("Please select a row!");
      return;
    }

    setLoading(true);

    var data = {
      plant: selectedData[0]?.PLANT,
      batch_id: selectedData[0]?.BATCH_ID,
      mother_batch: selectedData[0]?.MOTHER_BATCH,
    };

    // data = {...allValuesSplit , ...data};

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM048/splitdata";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
          } else {
            // setScrapData(response.data);
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setSplitTableData([,]);
            } else {
              //handling response data
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  rowId: i,
                  LOM_ID_BATCH: rowdata.LOM_ID_BATCH,
                  LOM_CD_EPA: rowdata.LOM_CD_EPA,
                  LOM_CD_STATUS: rowdata.LOM_CD_STATUS,
                  LOM_MS_GROSS_CAL: rowdata.LOM_MS_GROSS_CAL,
                  LOM_NO_PIECES: rowdata.LOM_NO_PIECES,
                  PRODUCT_NM: rowdata.PRODUCT_NM,
                });
              }
              setSplitTableData(rows);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getSptBatchDetails = () => {
    if (!selectedPlantSplit.value) {
      alertify.error("Please select Plant");
      return;
    }

    setLoading(true);
    var data = {
      plant: selectedPlantSplit.value ? selectedPlantSplit.value : "",
      status: selectedStatusSplit ? selectedStatusSplit.value : "",
      // batch : selectedBatchSplit.value ? selectedBatchSplit.value :"",
      // qty : selectedQtySplit.value ? selectedQtySplit.value : "",
      // pieces : selectedPiecesSplit.value ? selectedPiecesSplit.value : ""
    };

    data = { ...allValuesSplit, ...data };

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM048/getsptbatchdetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setSptBatchDetails([,]);
            } else {
              //handling response data
              // var rows = [];
              // for (var i in response.data) {
              //   var rowdata = response.data[i];
              //   rows.push({
              //     rowId : i,
              //     LOM_ID_BATCH: rowdata.LOM_ID_BATCH,
              //     LOM_CD_EPA: rowdata.LOM_CD_EPA,
              //     LOM_CD_STATUS: rowdata.LOM_CD_STATUS,
              //     LOM_MS_GROSS_CAL : rowdata.LOM_MS_GROSS_CAL,
              //     LOM_NO_PIECES  : rowdata.LOM_NO_PIECES
              //   });
              // }
              setSptBatchDetails(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const saveSplitData = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      // if(!selectedPlantMoM.value){
      //   alertify.error("Please select Plant");
      //   return;
      // }

      // var data = {
      //   plant : selectedPlantMoM.value ? selectedPlantMoM.value : "",
      //   matNo : selectedMatNoMoM.value ? selectedMatNoMoM.value :"",
      //   status : selectedStatusMoM.value ? selectedStatusMoM.value : ""
      // };

      // data = {...allValuesMerging , ...data};

      // var url = "api/LDSM048/mergingdata";

      // axiosAPI
      //   .post(url, data, defaultOptions)
      //   .then((response) => {
      //     if (response.statusText != "" && response.statusText != "OK") {
      //       //reject(response.statusText);
      //       alertify.error("No Data Found");
      //     } else {
      //       // setScrapData(response.data);
      //       if(response.data.length == 0){
      //         alertify.error("No Data Found");
      //         setMergingTableData([,]);
      //       }else{
      //         //handling response data
      //         var rows = [];
      //         for (var i in response.data) {
      //           var rowdata = response.data[i];
      //           rows.push({
      //             rowId : i,
      //             ACTUAL_PCS : rowdata.ACTUAL_PCS,
      //             ACTUAL_QTY : rowdata.ACTUAL_QTY,
      //             BATCH1 : rowdata.BATCH1,
      //             LOM_NO_CAST : rowdata.LOM_NO_CAST,
      //             LOM_NO_MATNR : rowdata.LOM_NO_MATNR,
      //             LOM_CD_STATUS : rowdata.LOM_CD_STATUS
      //           });
      //         }
      //         setMergingTableData(rows);
      //       }
      //     }
      //   })
      //   .finally((f) => {
      //     resolve()
      //   });
    });
  };

  const getMergingDataFnc = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getMergingData(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getMergingData = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      if (!selectedPlantMerging.value) {
        alertify.error("Please select plant");
        resolve();
        return;
      }

      if (!selectedStatusMerging.value) {
        alertify.error("Please select Status");
        resolve();
        return;
      }

      // if (!selectedMaterialNo.value) {
      //   alertify.error("Please select material Number");
      //   resolve();
      //   return;
      // }

      var data = {
        plant: selectedPlantMerging.value,
        statusMerging: selectedStatusMerging.value,
        castNo: selectedCastNo.value,
        matNo: selectedMaterialNo.value,
      };

      // data = {...allValuesMerging , ...data};
      var url = "api/LDSM048/mergingdata";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("No Data Found");
          } else {
            // setScrapData(response.data);
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setMergingTableData([,]);
            } else {
              //handling response data
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  rowId: i,
                  ACTUAL_PCS: rowdata.ACTUAL_PCS,
                  ACTUAL_QTY: rowdata.ACTUAL_QTY,
                  BATCH1: rowdata.BATCH1,
                  CAST_NO: rowdata.CAST_NO,
                  GRADE: rowdata.GRADE,
                  IDIA: rowdata.IDIA,
                  ITEM: rowdata.ITEM,
                  LENGTH: rowdata.LENGTH,
                  MAT_NO: rowdata.MAT_NO,
                  MOTHER_BATCH: rowdata.MOTHER_BATCH,
                  ODIA: rowdata.ODIA,
                  ORDER_NO: rowdata.ORDER_NO,
                  PARENT_BATCH: rowdata.PARENT_BATCH,
                  PRODUCT_NAME: rowdata.PRODUCT_NAME,
                  STATUS: rowdata.STATUS,
                  THK: rowdata.THK
                });
              }
              setMergingTableData(rows);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const saveMergingData = () => {
    
    //get selected data
    var selectedRows = selectedMergingTableData.getSelectedRows();

    //conversion of data format
    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push(item._row.data);
    });


    //no row selected alert
    if (selectedRows.length < 2) {
      alertify.error("Please select more then one row!");
      return;
    }
    let MutiRowDataSelectorConst = true;

    let selectedRowVar = {
      MAT_NO: selectedRows[0]._row.data.MAT_NO,
      CAST_NO: selectedRows[0]._row.data.CAST_NO,
      THK: selectedRows[0]._row.data.THK,
      ODIA: selectedRows[0]._row.data.ODIA,
      ITEM: selectedRows[0]._row.data.ITEM,
      ORDER_NO: selectedRows[0]._row.data.ORDER_NO,
    };


    selectedRows.forEach(function (item) {
      if (
        selectedRowVar.MAT_NO !== item._row.data.MAT_NO ||
        selectedRowVar.CAST_NO !== item._row.data.CAST_NO ||
        selectedRowVar.THK !== item._row.data.THK ||
        selectedRowVar.ODIA !== item._row.data.ODIA ||
        selectedRowVar.ITEM !== item._row.data.ITEM ||
        selectedRowVar.ORDER_NO !== item._row.data.ORDER_NO
      ) {
        MutiRowDataSelectorConst = false;
      }
    });

    if (!MutiRowDataSelectorConst) {
      alertify.error(
        "Selected Material No, Cast No, Thickness, Odia, Order No, Item should be same!"
      );
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var data = {
        plant: selectedPlantMerging?.value,
        selectedData: selectedData,
        mergedQnty: finalMergedQnty,
        mergedPcs: finalMergedPcs,
        totalActualQnty: totalActualQnty,
        totalActualPcs: totalActualPcs,
        createdBy: serverDetails.PersonalNo,
      };

      var url = "api/LDSM048/savemergingdata";
      //   api call
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("Error Merging Data");
            setLoading(false);
          } else {

            if (response.data.merge_new.LS_OUT_FLAG.toString().startsWith("N-")) {
              alertify.error(response.data.merge_new.LS_OUT_FLAG);
              setLoading(false);
              return;
            }

            if (response.data.checkPass == "Y") {
              alertify.success(
                "Merge successfully with merge ID : " + response.data.merge_id
              );
             
              Promise.all([getMergingData(token.accessToken)]).finally(() => {
                setLoading(false);
              });
            } else {
              alertify.error(
                "Could not merge the following batches : ",
                response.data.failedBatches
              );
              setLoading(false);
            }
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  const postScrap = () => {
    //get selected data
    var selectedRows = scrapDataTable.getSelectedRows();

    //conversion of data format
    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push(item._row.data);
    });

    //no row selected alert
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    var data = {
      plant: serverDetails.Plant.value,
      selectedData: selectedData,
    };

    var url = "api/LDSM048/postscrap";
    //   api call
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            setLoading(false);
            alertify.error("Error posting Data");
          } else {
            if (response.data) {
              var res = response.data.errorString.toString();
              if (res.includes("Error")) {
                setShowSaveMsgSuccess(false);
                setShowSaveMsgError(true);
                setSaveMsg(res);
              } else {
                setShowSaveMsgSuccess(true);
                setShowSaveMsgError(false);
                setSaveMsg(res);
              }
              Promise.all([getData(token.accessToken)]).finally(() => {
                setLoading(false);
              });
            } else {
              setLoading(false);
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
              setSaveMsg("Error Occured !");
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    if (tabValue == 0) {
      if (scrapData && scrapData.length > 0) {
        setScrapDataTable(
          new Tabulator("#fgTable", {
            height: 400,
            // frozenRows: 2,
            //   pagination: "local", //enable local pagination.
            data: scrapData,
            columns: ScrapColumn,
            layout: "fitDataFill",
          })
        );
      }
    }
  }, [scrapData, tabValue]);

  useEffect(() => {
    if (tabValue == 1) {
      if (mergingTableData && mergingTableData.length > 0) {
        setSelectedMergingTableData(
          new Tabulator("#mergingTable", {
            data: mergingTableData, //link data to table
            columns: mergeColumn,
            height: 400,
            layout: "fitColumns",
          })
        );
      }
    }
  }, [mergingTableData, tabValue]);

  useEffect(() => {
    if (tabValue == 2) {
      if (splitTableData && splitTableData.length > 0) {
        setSelectedSplitTableData(
          new Tabulator("#splittingTable", {
            data: splitTableData, //link data to table
            columns: splitColumn,
            height: 100,
            layout: "fitColumns",
          })
        );
      }
    }
  }, [splitTableData, tabValue]);

  useEffect(() => {
    if (tabValue == 2) {
      if (sptBatchDetails && sptBatchDetails.length > 0) {
        setSptBatchDetailsTable(
          new Tabulator("#sptbatchdetails", {
            data: sptBatchDetails, //link data to table
            columns: sptBatchDetailsColumn,
            height: 200,
            layout: "fitColumns",
            selectable: 1,
          })
        );
      }
    }
  }, [sptBatchDetails, tabValue]);

  useEffect(() => {
    if (tabValue == 2) {
      if (sptSplitBatchDetails && sptSplitBatchDetails.length > 0) {
        setSptSplitBatchDetailsTable(
          new Tabulator("#sptsplitbatchdetails", {
            data: sptSplitBatchDetails, //link data to table
            columns: sptSplitBatchDetailsColumn,
            height: 200,
            layout: "fitColumns",
            // selectable : 1
          })
        );
      }
    }
  }, [sptSplitBatchDetails, tabValue]);

  useEffect(() => {
    if (tabValue == 3) {
      if (momTableData && momTableData.length > 0) {
        setSelectedMoMTableData(
          new Tabulator("#momTransferTable", {
            data: momTableData, //link data to table
            columns: momTransferColumn,
            height: 400,
            layout: "fitDataFill",
            selectable: true,
          })
        );
      }
    }
  }, [momTableData, tabValue]);

  const downloadExcelcustomerTableData = () => {
    var date = new Date();
    var fileName = "LDSM048_Scrap " + date.toString() + ".xlsx";
    scrapDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelMergingTableData = () => {
    var date = new Date();
    var fileName = "LDSM048_Merging " + date.toString() + ".xlsx";
    selectedMergingTableData.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelSplitTableData = () => {
    var date = new Date();
    var fileName = "LDSM048_Split " + date.toString() + ".xlsx";
    selectedSplitTableData.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelSptBatchDetails = () => {
    var date = new Date();
    var fileName = "LDSM048_BatchDetails " + date.toString() + ".xlsx";
    sptBatchDetailsTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelSplitBatchDetails = () => {
    var date = new Date();
    var fileName = "LDSM048_SplitBatchDetails " + date.toString() + ".xlsx";
    sptSplitBatchDetailsTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelMoMTableData = () => {
    var date = new Date();
    var fileName = "LDSM048_MOMTransfer " + date.toString() + ".xlsx";
    selectedMoMTableData.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAllMerging = (newToken = false) => {
    setSelectedPlantMerging({});
    setSelectedMaterialNo([]);
    setSelectedCastNo([]);
    setMergingTableData([,]);
    setSelectedMergingTableData(null);
    setSelectedStatusMerging("");
  };
  const handleClearAllScrap = (newToken = false) => {
    setAllValues({});
    setSelectedPlant([]);
    setSelectedProcess([]);
    setSelectedStatus([]);
    setSelectedAction([]);
    setProcFrmDt(null);
    setProcToDt(null);
    setDecFrmDt(null);
    setDecToDt(null);
    setScrapData([,]);
    setScrapDataTable(null);
    setSelectedTonnage([]);
  };

  const handleClearAllSpliting = (newToken = false) => {
    // setSelectedPiecesSplit([]);
    setSelectedPlantSplit([]);
    setSelectedBatchSplit([]);
    setAllValuesSplit({});
    // setSelectedQtySplit([]);
    setSelectedStatusSplit([]);

    setSplitTableData([,]);
    setSelectedSplitTableData(null);

    setSptBatchDetails([,]);
    setSptBatchDetailsTable(null);

    setSptSplitBatchDetails([,]);
    setSptSplitBatchDetailsTable(null);
  };

  const handleClearAllMoMTransfer = (newToken = false) => {
    setSelectedPlantMoM([]);
    // setSelectedMatNoMoM([]);
    // setSelectedStatusMoM([]);

    setSelectedWidthOdiaMoM([]);
    setAllValuesMoM({});
    setMomTableData([,]);
    setSelectedMoMTableData(null);
    setAllValuesMoMFilter({});
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Dispatch"
        page="Merging and Splitting of Batch"
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
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    {/* <Tab label="Scrap Posting" value={0} icon={<TabIcon />} /> */}
                    <Tab label="Spliting" value={2} icon={<CallSplitIcon />} />
                    <Tab label="Merging" value={1} icon={<CallMergeIcon />} />
                    <Tab
                      label="Material to Material Transfer"
                      value={3}
                      icon={<MoveUpIcon />}
                    />
                  </Tabs>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                {tabValue == 0 && (
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
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllScrap(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
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
                            style={{
                              zIndex: 5,
                            }}
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Status
                          </MDTypography>
                          <MDInput
                            label=""
                            name="status"
                            value={allValues.status || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>
                        <Grid item xs={2} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Process
                          </MDTypography>
                          <ReactSelect
                            id="upload_type"
                            options={processListScrap}
                            value={selectedProcess}
                            //onChange={({value }) => handlePlantChange(value)}
                            onChange={handleProcessChange}
                          />
                        </Grid>
                        {/* <Grid item xs={1.25} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Product Type
                          </MDTypography>
                          <ReactSelect
                            id="upload_type"
                            options={upload_type}
                            value={selectedProdType}
                            //onChange={({value }) => handlePlantChange(value)}
                            onChange={handleProdTypeChange}
                          />
                        </Grid> */}
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Prod Cd
                          </MDTypography>
                          <MDInput
                            label=""
                            name="prodCd"
                            value={allValues.prodCd || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>
                        {/* <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Qlty Cd
                          </MDTypography>
                          <MDInput
                            label=""
                            name="qltyCd"
                            value={allValues.qltyCd || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid> */}
                        <Grid item xs={1}>
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
                            label=""
                            name="castNo"
                            value={allValues.castNo || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>
                        {/* <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            TDC
                          </MDTypography>
                          <MDInput
                            label=""
                            name="tdc"
                            value={allValues.tdc || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid> */}
                        {/* <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Proc From Date
                          </MDTypography>

                          <MonthPicker id="procfrmdt" value={procFrmDt} onChange={(date) => setProcFrmDt(date)} />
                        </Grid> */}
                        {/* <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Proc To Date
                          </MDTypography>
                          <MonthPicker id="proctodt" value={procToDt} onChange={(date) => setProcToDt(date)} />
                        </Grid> */}
                        <Grid item xs={1.25}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Declare From Date
                          </MDTypography>

                          <MonthPicker
                            id="decfrmdt"
                            value={decFrmDt}
                            onChange={(date) => setDecFrmDt(date)}
                          />
                        </Grid>
                        <Grid item xs={1.25}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Declare To Date
                          </MDTypography>
                          <MonthPicker
                            id="dectodt"
                            value={decToDt}
                            onChange={(date) => setDecToDt(date)}
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
                            Batch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="batch"
                            value={allValues.batch || ""}
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
                            MBatch
                          </MDTypography>
                          <MDInput
                            label=""
                            name="mbatch"
                            value={allValues.mbatch || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Thickness Min
                          </MDTypography>

                          <MDInput
                            type="number"
                            name="thickTo"
                            value={allValues.thickTo || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Thickness Max
                          </MDTypography>
                          <MDInput
                            type="number"
                            name="thickFrm"
                            value={allValues.thickFrm || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Width Min
                          </MDTypography>

                          <MDInput
                            type="number"
                            name="widthTo"
                            value={allValues.widthTo || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Width Max
                          </MDTypography>

                          <MDInput
                            type="number"
                            name="widthFrm"
                            value={allValues.widthFrm || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>

                        {/* <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Material No
                          </MDTypography>
                          <MDInput
                            name="matNo"
                            value={allValues.matNo || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid> */}
                        {/* <Grid item xs={1.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            PR/SE/SC
                          </MDTypography>
                          <ReactSelect
                            id="status"
                            options={status_type}
                            value={selectedStatus}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleStatusChange}
                          />
                        </Grid> */}

                        <Grid item xs={1.25}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Scrap Wt {"<="}
                          </MDTypography>
                          {/* <MDInput
                            label=""
                            name="scrpWt"
                            value={allValues.scrpWt || ""}
                            onChange={(e) => handleChange(e)}
                          /> */}
                          <ReactSelect
                            id="scraptWt"
                            options={scrapWt}
                            value={selectedScrapWt}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleScrapWtChange}
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
                            Tonnage {"<="}
                          </MDTypography>
                          <ReactSelect
                            id="tonnage"
                            options={scrapWt}
                            value={selectedTonnage}
                            onChange={handleTonnageChange}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getDataFnc(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 1 && (
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
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllMerging(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={2}>
                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
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
                            value={selectedPlantMerging}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handlePlantChangeMerging}
                          />
                        </Grid>
                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Status
                          </MDTypography>
                          <ReactSelect
                            id="statusMerging"
                            options={statusMerging}
                            value={selectedStatusMerging}
                            onChange={(e) => handleStatusMergingChange(e)}
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
                            Material No
                          </MDTypography>
                          <ReactSelect
                            id="materialNo"
                            options={materialNo}
                            value={selectedMaterialNo}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleMaterialNoChange}
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
                            Cast No
                          </MDTypography>
                          <ReactSelect
                            id="castNo"
                            options={castNoList}
                            value={selectedCastNo}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleCastNoChange}
                          />
                          {/* <MDInput
                            name="castNo"
                            value={allValuesMerging.castNo || ""}
                            onChange={(e) => handleChangeMerging(e)}
                          /> */}
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getMergingDataFnc(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 2 && (
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
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllSpliting(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={2}>
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
                            value={selectedPlantSplit}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handlePlantChangeSplit}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Batch
                          </MDTypography>

                          <MDInput
                            name="batch"
                            value={allValuesSplit.batch || ""}
                            onChange={(e) => handleChangeSplit(e)}
                          />
                        </Grid>

                        <Grid item xs={1.2} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Status
                          </MDTypography>
                          <ReactSelect
                            id="splitstatus"
                            options={splitStatus}
                            value={selectedStatusSplit}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleStatusChangeSplit}
                          />
                        </Grid>
                        {/* 
                      <Grid item xs={1} >
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Qty
                          </MDTypography>

                          <MDInput
                            name="qty"
                            value={allValuesSplit.qty || ""}
                            onChange={(e) => handleChangeSplit(e)}
                          />
                      </Grid> */}
                        {/* 
                      <Grid item xs={1} >
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Pieces
                          </MDTypography>

                          <MDInput
                            name="pcs"
                            value={allValuesSplit.pcs || ""}
                            onChange={(e) => handleChangeSplit(e)}
                          />
                      </Grid> */}

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            // onClick={() => getSplitData(true)}
                            onClick={() => getSptBatchDetails(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 3 && pageAuth != 0 && (
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
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Clear All">
                            <IconButton
                              color="white"
                              onClick={() => handleClearAllMoMTransfer(true)}
                            >
                              <ClearAllIcon />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </MDBox>

                    <MDBox px={3} py={3}>
                      <Grid container spacing={2}>
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
                            value={selectedPlantMoM}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handlePlantChangeMoM}
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
                            Batch ID
                          </MDTypography>
                          <MDInput
                            label=""
                            name="batch_id"
                            value={allValuesMoMFilter.batch_id || ""}
                            onChange={(e) => handleChangeMoMFilter(e)}
                          />
                        </Grid>

                        <Grid item xs={2.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Width/Odia
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={momWidthOdia}
                            value={selectedWidthOdiaMoM}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleWidthOdiaChangeMoM}
                            isMulti={true}
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
                            Target Material No.
                          </MDTypography>
                          <MDInput
                            label=""
                            name="targetMatNo"
                            value={allValuesMoM.targetMatNo || ""}
                            onChange={(e) => handleChangeMoM(e)}
                          />
                          {/* <ReactSelect
                            id="plant"
                            options={targetMatNoList}
                            value={selectedMatNoMoM}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleMatNoChangeMoM}
                            isMulit={true}
                          /> */}
                        </Grid>
                        {/* <Grid item xs={2.5} style={{ zIndex: 5 }}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Status
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedStatusMoM}
                            // onChange={({value }) => handlePlantChange(value)}
                            onChange={handleStatusChangeMoM}
                          />
                        </Grid> */}

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getMoMDataFnc(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
              </Grid>

              <Grid item xs={12}>
                {tabValue == 2 && (
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
                            Batch Details
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Search Batch">
                            <IconButton
                              color="white"
                              onClick={() => getSplitData()}
                            >
                              <SearchIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelSptBatchDetails()}
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
                          <div id="sptbatchdetails" />

                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {sptBatchDetails.length} of{" "}
                            {sptBatchDetails.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
              </Grid>
              <Grid item xs={12}>
                {tabValue == 0 && (
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
                            Post Scrap/Arising Data
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="update">
                            <IconButton
                              color="white"
                              disabled={isReadWriteAccess}
                              onClick={() => postScrap(true)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelcustomerTableData()}
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
                          <div id="fgTable" />
                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {scrapData.length} of{" "}
                            {scrapData.length} entries
                          </p>
                        </Grid>
                        {showSaveMsgError && (
                          <Grid item xs={12}>
                            <MDAlert
                              color="error"
                              severity="error"
                              variant="filled"
                              onClose={() => {
                                setShowSaveMsgError(false);
                              }}
                            >
                              <MDTypography variant="body2" color="white">
                                <MDTypography
                                  variant="body2"
                                  fontWeight="medium"
                                  color="white"
                                >
                                  {saveMsg}
                                </MDTypography>
                              </MDTypography>
                            </MDAlert>
                          </Grid>
                        )}
                        {showSaveMsgSuccess && (
                          <Grid item xs={12}>
                            <MDAlert
                              color="success"
                              variant="filled"
                              onClose={() => {
                                setShowSaveMsgSuccess(false);
                                if (tabValue == 0) {
                                  setInsertTableData([]);
                                }
                              }}
                            >
                              <MDTypography variant="body2" color="white">
                                <MDTypography
                                  variant="body2"
                                  fontWeight="medium"
                                  color="white"
                                  fontSize="lg"
                                  textTransform="capitalize"
                                >
                                  {saveMsg}
                                </MDTypography>
                              </MDTypography>
                            </MDAlert>
                          </Grid>
                        )}
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 1 && (
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
                            Merging Data
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Merge">
                            <IconButton
                              color="white"
                              disabled={isReadWriteAccess}
                              onClick={() => saveMergingData(true)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelMergingTableData()}
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
                          <div id="mergingTable" />

                          <br />
                          <div>
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Merged Quantity : {finalMergedQnty}
                            </p>
                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Merged Pcs : {finalMergedPcs}
                            </p>
                          </div>
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            <br />
                            Showing 1 to {mergingTableData.length} of{" "}
                            {mergingTableData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 2 && (
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
                            Split Window
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          {/* <Tooltip title="Split">
                              <IconButton
                                color="white"
                                onClick={() => saveSplitData(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip> */}
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelSplitTableData()}
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
                        <Grid item xs={7}>
                          <div id="splittingTable" />

                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {splitTableData.length} of{" "}
                            {splitTableData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
                {tabValue == 3 && pageAuth != 0 && (
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
                            Material to Material Transfer Data
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          <Tooltip title="Save">
                            <IconButton
                              color="white"
                              disabled={isReadWriteAccess}
                              onClick={() => saveMoMData(true)}
                            >
                              <SaveIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelMoMTableData()}
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
                          <div id="momTransferTable" />

                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {momTableData.length} of{" "}
                            {momTableData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}

                {tabValue == 3 && pageAuth == 0 && (
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <h4 style={{ color: "red", margin: "5rem" }}>
                      You are not authorized to view this Tab !
                    </h4>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12}>
                {tabValue == 2 && (
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
                            Split Batch Details
                          </MDTypography>
                        </Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={1}>
                          {/* <Tooltip title="Split">
                              <IconButton
                                color="white"
                                onClick={() => getSptBatchDetails(true)}
                              >
                                <SearchIcon />
                              </IconButton>
                            </Tooltip> */}
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcelSplitBatchDetails()}
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
                          <div id="sptsplitbatchdetails" />

                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {sptSplitBatchDetails.length} of{" "}
                            {sptSplitBatchDetails.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                )}
              </Grid>
            </Grid>
          </MDBox>
          {showModal && (
            <SaveModal
              close={setShowModal}
              refreshTable={getData}
              data={modalData}
              dateOnlyFunc={dateOnly}
              dateTimeFunc={dateTimeOnly}
              filterData={filter}
              open={showModal}
              reason={reason}
            />
          )}
          {showScrapModal && (
            <ScrapModal
              close={setShowScrapModal}
              refreshTable={getData}
              data={scrapmodalData}
              dateOnlyFunc={dateOnly}
              dateTimeFunc={dateTimeOnly}
              filterData={filter}
              open={showScrapModal}
              reason={reason}
            />
          )}

          {showConfirmModal && (
            <LDSM048ConfirmModal
              open={showConfirmModal}
              close={setShowConfirmModal}
              confirmData={confirmModalData}
              openScrap={setShowScrapModal}
              scrapData={setScrapModalData}
            />
          )}

          {showSplitNoModal && (
            <LDSM048SplitNoModal
              open={showSplitNoModal}
              close={setShowSplitNoModal}
              // splitNoModalData = {splitNoModalData}
              openSplit={setShowSplitModal}
              splitNo={setSplitNo}
              splitType={setSplitType}
              
            />
          )}

          {showSplitModal && (
            <LDSM048SplitModal
              open={showSplitModal}
              close={setShowSplitModal}
              splitNo={splitNo}
              splitType={splitType}
              splitModalData={splitModalData}
              loading={setLoading}
              bUnit={bUnit}
              setSptSplitBatchDetails={setSptSplitBatchDetails}
              setSplitTableData={setSplitTableData}
              setSelectedSplitTableData={setSelectedSplitTableData}
              getSptBatchDetails={getSptBatchDetails}
            />
          )}

          {showEditWindow && (
            <LDSM048EditModal
              open={showEditModal}
              close={setShowEditModal}
              editData={editModalData}
              openScrap={setShowScrapModal}
              scrapData={setScrapModalData}
              idBatch={editModalBatchID}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
