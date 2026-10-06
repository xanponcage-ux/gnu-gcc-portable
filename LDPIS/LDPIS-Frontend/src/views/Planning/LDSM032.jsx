import React, { useEffect, useState, useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import Switch from "@mui/material/Switch";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";
import FormHelperText from "@mui/material/FormHelperText";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import IconButton from "@mui/material/IconButton";
import AlarmIcon from "@mui/icons-material/Alarm";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Button from "@mui/material/Button";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// Data
import MDAlert from "components/MDAlert";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import DeleteIcon from "@mui/icons-material/Delete";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";
import TabIcon from "@mui/icons-material/Tab";
import Tooltip from "@mui/material/Tooltip";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function LD01S002() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [btnSts, setBtnStatus] = React.useState(true);
  const [btnStsInqry, setBtnStatusInqry] = React.useState(true);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [plantList, setPlantList] = useState([]);
  const [orderDt, setOrderListDt] = useState([]);
  const [order, setOrderList] = useState([]);
  const [item, setItemList] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [selectedCoilData, setSelectedCoilDetailsData] = useState([]);
  const [coilDt, setOrderDetailsDt] = useState([]);
  const [selectScheduleDetData, setScheduleDetailsData] = useState([]);
  const [wipSchedule, setWipScheduleData] = useState([]);
  const [schedulingTable, setSchedulingTable] = useState([]);
  const [sourcePlantList, setSourcePlantList] = React.useState([]);
  const [plant, setPlant] = useState([
    { label: "-Select", value: "" },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
  ]);
  const [selectedSchedulingTable, setSelectedSchedulingTable] = useState(null);
  const [selectedModalTable, setSelectOrderItemModal] = useState(null);
  const [selectedSchedulingdetailsTable, setSelectedSchedulingDetailsTable] =
    useState(null);
  const [selectedSchedulingConfirmTable, setSelectedSchedulConfirmTable] =
    useState(null);
  const [selectedSchedulingWipTable, setSelectedSchedulWipTable] =
    useState(null);
  const [statusList, setStatusList] = useState([
    { label: "-Select", value: "0" },
    { label: "CN Confirmed", value: "CN" },
    { label: "WC Waiting for Confirmation", value: "WC" },
    { label: "PR Processed", value: "PR" },
    { label: "RJ Deleted", value: "RJ" },
  ]);
  const [dateValue, setDateValue] = useState(null);
  const selMonthRef = useRef(null);
  const prevMonthRef = useRef(null);
  const openOrdersRef = useRef(null);

  const [allValues, setAllValues] = useState({
    plant: "",
    ym: "",
    order: "",
    item: "",
    prevMonth: false,
    openOrders: false,
  });

  const [scheduleFilter, setScheduleFilter] = useState({});
  const date = new Date();
  // const formattedDate = date.toLocaleDateString('en-GB', {
  //     day: '2-digit', month: 'short', year: 'numeric'
  // }).replace(/ /g, '-');
  var formattedDate =
    ("0" + date.getDate()).slice(-2) +
    "-" +
    date.toString().substr(4, 3) +
    "-" +
    date.getFullYear();

  const [scheduleConfFilter, setScheduleConfFilter] = useState({
    planDate: formattedDate,
  });
  const [wipFilter, setWipFilter] = useState({});
  const { prevMonth, openOrders } = allValues;
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
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
          getPlantList();
          setInitialLoad(true);
        }
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (tabValue === 0) {
      setSelectedSchedulingTable(
        new Tabulator("#selSchedulingTable", {
          maxHeight: 400,
          layout: "fitDataFill",
          data: schedulingTable,
          columns: selSchedulingTabl,
        })
      );

      setSelectedSchedulingDetailsTable(
        new Tabulator("#schedulingDetailsTable", {
          maxHeight: 400,
          layout: "fitDataFill",
          data: selectedCoilData,
          columns: gVDetailColumns,
        })
      );
    } else if (tabValue === 1) {
      setSelectedSchedulConfirmTable(
        new Tabulator("#schedulingConfirmTable", {
          maxHeight: 400,
          layout: "fitDataFill",
          data: selectScheduleDetData,
          columns: scheduleConfirmColumns,
        })
      );
    } else if (tabValue === 2) {
      setSelectedSchedulWipTable(
        new Tabulator("#wipScheduleTable", {
          maxHeight: 400,
          layout: "fitDataFill",
          data: wipSchedule,
          columns: wipScheduleColumns,
        })
      );
    }
  }, [
    tabValue,
    schedulingTable,
    selectedCoilData,
    selectScheduleDetData,
    wipSchedule,
  ]);

  useEffect(() => {
    setSelectOrderItemModal(
      new Tabulator("#modalTable", {
        height: 300,
        pagination: "local",
        paginationSize: 200,
        data: orderDt,
        columns: ordItmClm,
      })
    );
  }, [orderDt]);

  var ordItmClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Order",
      field: "ORD",
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
      title: "Time Stamp",
      field: "DELV_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    async function fetchData() {
      // getSourcePlantList();
    }
    fetchData();
  }, [selectedPlant]);

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
      var pageName = "LDSM032";

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

  const getPlantList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/common/getGroupPlant";
    axiosAPI
      .post(url, { adid: serverDetails.PersonalNo }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = response.data.map(([label, value]) => ({ label, value }));
          setPlantList(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getOrderList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    let Plant = scheduleFilter.plant?.value;
    var url = "api/LDSM032/getAllOrderList";
    axiosAPI
      .post(url, { Plant }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          var orditems = [];

          response.data.map((j, i) => {
            var a = j;
            items.push({ label: a[0], value: a[0] });
            orditems.push({ label: a[1], value: a[1] });
          });
          const ids = orditems.map((o) => o.value);
          const filtered = orditems.filter(
            ({ value }, index) => !ids.includes(value, index + 1)
          );
          const ordrByItem = filtered.sort(function (a, b) {
            return a.value - b.value;
          });
          setOrderList(items);
          //setItemList(ordrByItem);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getItemList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    let Plant = scheduleFilter.plant?.value;
    var url = "api/LDSM032/getAllItemList";
    axiosAPI
      .post(url, { Plant }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var orditems = [];
          response.data.map((row) => {
            var objItm = new Object();
            objItm.label = row[0];
            objItm.value = row[0];
            orditems.push(objItm);
          });
          setItemList(orditems);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const [processDDL, setProcessDDL] = useState([]);
  const [processDDL2, setProcessDDL2] = useState([]);
  const [processDDL3, setProcessDDL3] = useState([]);
  const [batchDDL3, setBatchDDL3] = useState([]);
  const [odiaDDL, setOdiaDDL] = useState([]);
  const [idiaDDL, setIdiaDDL] = useState([]);
  const [rollDDL, setRollDDL] = useState([]);
  const [flowPathDDL, setFlowPathDDL] = useState([]);
  const [valueRadio, setValueRadio] = React.useState("N");
  const [SFGmaterialDesc, setSFGMaterialDesc] = React.useState([]);
  const [selectRowsDt, setSelectedRowsDt] = React.useState([]);
  const [mbatchDetailsData, setMbatchDetailsData] = React.useState([]);
  const [selectedMergeDt, setSelectMergeDt] = useState(null);

  const mergeDetailsClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Plant",
      field: "ERD_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Merge Batch",
      field: "MERGE_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Component Batch",
      field: "COMPONENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Component Batch Qty(kg)",
      field: "COMPONENT_BATCH_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Send Sap Flag",
      field: "SEND_SAP_FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Creation Date",
      field: "CREATION_DATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CREATED_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  useEffect(() => {
    setSelectMergeDt(
      new Tabulator("#mergeTable", {
        height: 300,
        data: mbatchDetailsData,
        columns: mergeDetailsClm,
      })
    );
  }, [mbatchDetailsData]);

  const getProcessList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    var d;
    if (tabValue == 0) {
      d = {
        Plant: scheduleFilter.plant?.value,
        tabValue: tabValue,
      };
    } else if (tabValue == 1) {
      d = {
        Plant: scheduleConfFilter.plant?.value,
        tabValue: tabValue,
      };
    } else if (tabValue == 2) {
      d = {
        Plant: wipFilter.plant?.value,
        tabValue: tabValue,
      };
    }
    // let Plant = scheduleFilter.plant?.value;
    // if (tabValue == 1) Plant = scheduleConfFilter.plant?.value;
    // else if (tabValue == 2) Plant = wipFilter.plant?.value;

    setLoading(true);
    var url = "/api/LDSM032/getProcDesc";
    axiosAPI
      .post(url, { d }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = response.data.map(([value, label]) => ({ label, value }));
          if (tabValue == 0) setProcessDDL(items);
          else if (tabValue == 1) setProcessDDL2(items);
          else if (tabValue == 2) setProcessDDL3(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getBatchIdList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    let Plant = scheduleConfFilter.plant?.value;

    setLoading(true);
    var url = "/api/LDSM032/getBatchId";
    axiosAPI
      .post(url, { Plant }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = response.data.map(([value]) => ({ label: value, value }));
          setBatchDDL3(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getOdiaDDL = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/LDSM032/getODIA";
    axiosAPI
      .post(url, { Plant: scheduleFilter.plant?.value ?? "" }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = response.data.map(([value, label]) => ({
            label: value.toFixed(3),
            value,
          }));
          setOdiaDDL(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getIdiaDDL = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/LDSM032/getIDIA";
    axiosAPI
      .post(url, { Plant: scheduleFilter.plant?.value ?? "" }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = response.data.map(([value, label]) => ({
            label: value.toFixed(3),
            value,
          }));
          setIdiaDDL(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getRollDDL = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/LDSM032/getWorkCenter";
    axiosAPI
      .post(url, { Plant: scheduleFilter.plant?.value ?? "" }, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          let item = [];
          response.data.map((j, i) => {
            var a = j;
            var d = a[0].split(",");
            var trim = d[0].split(/\s/).join("");
            item.push({ label: d[0] + "--" + d[1], value: trim });
          });
          //var items = response.data.map(([value, label]) => ({ label: value, value: value }));
          setRollDDL(item);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getFlowPathDDL = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/LDSM032/getPath";
    axiosAPI
      .post(
        url,
        {
          Plant: scheduleFilter.plant?.value ?? "",
          Process: scheduleFilter.process?.value ?? "",
        },
        defaultOptions
      )
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = response.data.map(([value]) => ({ label: value, value }));
          setFlowPathDDL(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const saveScheduling = async (newToken = false) => {
    if (scheduleFilter.plant.value == undefined) {
      alertify.error("Please select plant!");
      return;
    }
    if (scheduleFilter.flowPath == undefined) {
      alertify.error("Please select route!");
      return;
    }
    if (scheduleFilter.process == undefined) {
      alertify.error("Please select process!");
      return;
    }
    if (scheduleFilter.roll == undefined) {
      alertify.error("Please select work center!");
      return;
    }
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/LDSM032/getOrder";

    var data = {
      Plant: scheduleFilter.plant ? scheduleFilter.plant.value : "",
      Odia: scheduleFilter.odia ? scheduleFilter.odia.value : null,
      Idia: scheduleFilter.idia ? scheduleFilter.idia.value : null,
      Order: scheduleFilter.order ? scheduleFilter.order.value : null,
      Item: scheduleFilter.item ? scheduleFilter.item.value : null,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          if (response.data[1].length != 0) {
            setSchedulingTable(response.data[1]);
          } else {
            alertify.error("No Data Found");
            setSchedulingTable([]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const btnCrtSchdl = async (newToken = false) => {
    if (scheduleFilter.plant.value != undefined) {
      setLoading(true);
      if (newToken) {
        const rsp = await getAuthorization();
      }

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      var selectedTable = selectedSchedulingdetailsTable.getData();

      if (selectedTable.length == 0) {
        alertify.error(
          "Coil details are not found hence schedule can not be created."
        );
        setLoading(false);
        return;
      }

      var url = "/api/LDSM032/getMbatch";
      var iCoil = Array.prototype.map
        .call(selectedTable, function (item) {
          return item.LOM_ID_BATCH;
        })
        .join(",");

      var sumGROSS_WT = 0;
      selectedTable.forEach((item) => {
        sumGROSS_WT += item.GROSS_WT;
      });

      var sumScheduleQty = 0;
      selectedTable.forEach((item) => {
        sumScheduleQty += parseFloat(item.SCH_QTY);
      });

      var data = {
        Plant: scheduleFilter.plant.value,
        InputCoil: iCoil,
        coilLength: selectedTable.length,
        adid: serverDetails.PersonalNo,
        P_SCH_TYPE_FL: valueRadio,
      };

      if (selectedTable.length > 0) {
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              if (response.data) {
                var check = response.data.substring(0, 1);
                if (check == "Y") {
                  var table = selectedTable;
                  var str = response.data.slice(2);
                  table.forEach((obj) => (obj["mBatch"] = str));
                  selectedSchedulingdetailsTable.replaceData(table);

                  let schTon = sumScheduleQty / 1000;
                  if (schTon > sumGROSS_WT) {
                    alertify.error("Schedule qty. can't more than gross wt. !");
                    return;
                  }

                  if (!selectRowsDt.txtSFGMat) {
                    alertify.error("SFG Material is blank !");
                    return;
                  }
                  var urlCrt = "/api/LDSM032/getCRTSchedule";

                  var data = {
                    adid: serverDetails.PersonalNo,
                    PlanPath: scheduleFilter.flowPath.value,
                    Plant: scheduleFilter.plant.value,
                    Process: scheduleFilter.process.value,
                    ORD_ID: scheduleFilter.order.value,
                    ORD_ITM: scheduleFilter.item
                      ? parseInt(scheduleFilter.item.value)
                      : parseInt(coilDt.ENC_NO_ITEM),
                    ORD_QTY: coilDt.ORDER_QNTY,
                    IDIA: coilDt.ENC_IDIA,
                    ODIA: coilDt.ENC_SEC2_MAX
                      ? coilDt.ENC_SEC2_MAX
                      : scheduleFilter.odia.value.toFixed(3),
                    LENGTH: coilDt.ENC_LENGTH_MAX,
                    THICK: coilDt.ENC_SEC1_MAX,
                    GRADE: coilDt.CD_GRADE,
                    MATNR: coilDt.ENC_NO_MATNR,
                    PROS_WT: sumGROSS_WT, //(all rows GROSS_WT sum)
                    GALVY_WT: 0,
                    rollchange: scheduleFilter.roll.value,
                    MOTHER_BATCH: str,
                    CL_WT: sumGROSS_WT, //(all rows GROSS_WT sum)
                    CL_MATNR: selectedTable[0].MATERIAL, //Coil material
                    FG_WT: sumScheduleQty, //(all rows ScheduleQty sum)
                    P_SCH_TYPE_FL: valueRadio,
                    EOP_SFG_MATNR_BOM: selectRowsDt.txtSFGMat, //SGF Material
                    P_NOMINATE_BATCH: selectRowsDt.LOM_ID_BATCH,
                    P_NOMINATE_MATNR: selectRowsDt.MATERIAL,
                  };

                  axiosAPI
                    .post(urlCrt, data, defaultOptions)
                    .then((response) => {
                      if (
                        response.statusText != "" &&
                        response.statusText != "OK"
                      ) {
                      } else {
                        if (response) {
                          var results = response.data.outBinds.LS_OUT_FLAG;
                          if (results) {
                            if (results.startsWith("Y-")) {
                              setShowSaveMsgSuccess(true);
                              setShowSaveMsgError(false);
                              setSaveMsg(results.replace("Y-", ""));
                            } else {
                              setShowSaveMsgSuccess(false);
                              setShowSaveMsgError(true);
                              setSaveMsg(results.replace("N-", ""));
                            }
                          } else {
                            setShowSaveMsgSuccess(false);
                            setShowSaveMsgError(true);
                            setSaveMsg("Error Occured !");
                          }
                        } else {
                          alertify.error("No Data Found");
                        }
                      }
                    })
                    .finally((f) => {
                      setLoading(false);
                    });
                } else {
                  alertify.error("No mother batch found !");
                }
              } else {
                alertify.error("No Data Found !");
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      } else {
        if (sumScheduleQty > sumGROSS_WT) {
          alertify.error("Schedule qty. can't more than gross wt. !");
          return;
        }
        var urlCrt = "/api/LDSM032/getCRTSchedule";

        var data = {
          adid: serverDetails.PersonalNo,
          PlanPath: scheduleFilter.flowPath.value,
          Plant: scheduleFilter.plant.value,
          Process: scheduleFilter.process.value,
          ORD_ID: scheduleFilter.order.value,
          ORD_ITM: scheduleFilter.item
            ? parseInt(scheduleFilter.item.value)
            : parseInt(coilDt.EOP_NO_ITEM),
          ORD_QTY: coilDt.NET_BALANCE_TO_PROD,
          IDIA: coilDt.EOP_ID,
          ODIA: coilDt.EOP_OD,
          LENGTH: coilDt.EOP_LENGTH,
          THICK: coilDt.EOP_SEC1.toFixed(3),
          GRADE: coilDt.ENC_CD_GRADE,
          MATNR: coilDt.EOP_FG_MATNR,
          PROS_WT: sumGROSS_WT, //(all rows GROSS_WT sum)
          GALVY_WT: 0,
          rollchange: scheduleFilter.roll.value,
          MOTHER_BATCH: selectedTable[0].LOM_ID_BATCH,
          CL_WT: sumGROSS_WT, //(all rows GROSS_WT sum)
          CL_MATNR: selectedTable[0].MATERIAL,
          FG_WT: sumScheduleQty, //(all rows ScheduleQty sum)
          EOP_SFG_MATNR_BOM: coilDt.EOP_SFG_MATNR_BOM,
        };

        axiosAPI
          .post(urlCrt, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              if (response) {
                var results = response.data.outBinds.LS_OUT_FLAG;
                if (results) {
                  if (results.startsWith("Y-")) {
                    setShowSaveMsgSuccess(true);
                    setShowSaveMsgError(false);
                    setSaveMsg(results.replace("Y-", ""));
                  } else {
                    setShowSaveMsgSuccess(false);
                    setShowSaveMsgError(true);
                    setSaveMsg(results.replace("N-", ""));
                  }
                } else {
                  setShowSaveMsgSuccess(false);
                  setShowSaveMsgError(true);
                  setSaveMsg("Error Occured !");
                }
              } else {
                alertify.error("No Data Found");
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      }
    } else {
      alertify.error("Please Select Plant!");
    }

    // Call a SP for mother batch (MOTHER_BATCH)
  };

  var sqrBtn = () => {
    return "<i class='fa-solid fa-square' style='color:#49a3f1'></i>";
  };

  const btnPfsDisp = async (newToken = false) => {};

  const clearFilter = () => {
    setScheduleFilter({});
    setScheduleConfFilter({});
    setSchedulingTable([]);
    setSelectedCoilDetailsData([]);
    setWipFilter({});
    setWipScheduleData([]);
    setScheduleDetailsData([]);
    setDateValue(null);
  };

  const checkScheduleType = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedSchedulingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select Order Details Table");
      return;
    }

    if (selectedRows.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    setLoading(true);
    var url = "/api/LDSM032/getScheduleType";
    var data = {
      Plant: scheduleFilter.plant ? scheduleFilter.plant.value : "",
      RM_Mat: selectedRows[0]._row.data.RM_MATNR_BOM,
      Order: scheduleFilter.order
        ? scheduleFilter.order.value
        : selectedRows[0]._row.data.ENC_ID_ORDER,
      Item: scheduleFilter.item
        ? scheduleFilter.item.value
        : selectedRows[0]._row.data.ENC_NO_ITEM,
    };

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          if (response.data.rows[0][0] > 0) {
            setOpen(true);
          } else {
            checkBoxChanged(true);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const checkBoxChanged = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedSchedulingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    if (selectedRows.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    setLoading(true);
    var url = "/api/LDSM032/coilDetails";
    var data = {
      Plant: scheduleFilter.plant ? scheduleFilter.plant.value : "",
      RM_Mat: selectedRows[0]._row.data.RM_MATNR_BOM,
      Order: scheduleFilter.order
        ? scheduleFilter.order.value
        : selectedRows[0]._row.data.ENC_ID_ORDER,
      Item: scheduleFilter.item
        ? scheduleFilter.item.value
        : selectedRows[0]._row.data.ENC_NO_ITEM,
    };

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          if (response.data[1].length != 0) {
            setSelectedCoilDetailsData(response.data[1]);
            setOrderDetailsDt(selectedRows[0]._row.data);
            setLoading(false);
            getSFGMarerailDesc(true);
          } else {
            alertify.error("No Data Found");
            setSelectedCoilDetailsData([]);
            setOrderDetailsDt([]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const saveRearrange = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "/api/LDSM032/getSchDetl";
    var data = {
      Plant: scheduleConfFilter.plant.value,
      BatchID: scheduleConfFilter.batchId
        ? scheduleConfFilter.batchId.value
        : "",
      Process: scheduleConfFilter.process.value,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          if (response.data[1].length != 0) {
            setScheduleDetailsData(response.data[1]);
            setBtnStatus(false);
          } else {
            alertify.error("No Data Found");
            setScheduleDetailsData([]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const onClickConfirm = async (newToken = false) => {
    if (scheduleConfFilter.plant.value != undefined) {
      if (newToken) {
        const rsp = await getAuthorization();
      }

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      if (scheduleConfFilter.status) {
        if (scheduleConfFilter.status.value != "WC") {
          alertify.error(
            "Operation only available for WC Waiting for Confirmation Status"
          );
          setLoading(false);
          return;
        }
      } else {
        alertify.error(
          "Operation only available for WC Waiting for Confirmation Status"
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      var url = "/api/LDSM032/getscheduleConf";
      //var prdPDt = document.getElementById("prodPlnDt").value;
      if (dateValue == null) {
        alertify.error("Please Select Plan Production Date");
        setLoading(false);
        return;
      }
      // var prdPDt = dateValue.toLocaleDateString('en-GB', {
      //     day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-');

      var prdPDt =
        ("0" + dateValue.getDate()).slice(-2) +
        "-" +
        dateValue.toString().substr(4, 3) +
        "-" +
        dateValue.getFullYear();

      var selectedRows = selectedSchedulingConfirmTable.getSelectedRows();
      if (selectedRows.length == 0) {
        alertify.error("No rows selected");
        setLoading(false);
        return;
      }

      var today = new Date();
      var yesterday1 = new Date(new Date().setDate(new Date().getDate() - 1));
      let date = new Date(Date.parse(prdPDt));

      // if (date.toDateString() === today.toDateString() || date.toDateString() === yesterday1.toDateString()) {
      if (date >= yesterday1) {
        var data = {
          Plant: scheduleConfFilter.plant ? scheduleConfFilter.plant.value : "",
          shift: scheduleConfFilter.shift
            ? scheduleConfFilter.shift.value
            : "A",
          Prod_dt: prdPDt,
          dt: selectedRows[0]._row.data,
          CHK_PFS: true,
          Process: scheduleConfFilter.process.value,
        };

        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              var results = response.data.outBinds.LS_OUT_FLAG;
              if (results) {
                alertify.success(results);
                saveInquiry(true);
              } else {
                alertify.error("No Data Found");
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        alertify.error("Please select current date or Future date !");
      }
    } else {
      alertify.error("Please Select Plant!");
    }
  };

  const onClickDelete = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    if (scheduleConfFilter.status) {
      if (scheduleConfFilter.status.value != "WC") {
        alertify.error(
          "Operation only available for WC Waiting for Confirmation Status"
        );
        setLoading(false);
        return;
      }
    } else {
      alertify.error(
        "Operation only available for WC Waiting for Confirmation Status"
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    var url = "/api/LDSM032/getScheduleDel";

    var selectedRows = selectedSchedulingConfirmTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    var data = {
      Plant: scheduleConfFilter.plant.value,
      dt: selectedRows[0]._row.data,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var results = response.data.outBinds.LS_OUT_FLAG;
          if (results) {
            alertify.success(results);
            saveInquiry(true);
          } else {
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const saveInquiry = async (newToken = false) => {
    if (!scheduleConfFilter.plant) {
      alertify.error("Please select plant");
      return;
    }

    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    // var prdPDt = document.getElementById("prodPlnDt").value;
    if (dateValue != null) {
      // var prdPDt = dateValue.toLocaleDateString('en-GB', {
      //     day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-');
      var prdPDt =
        ("0" + dateValue.getDate()).slice(-2) +
        "-" +
        dateValue.toString().substr(4, 3) +
        "-" +
        dateValue.getFullYear();
    }

    setLoading(true);
    var url = "/api/LDSM032/getInqDetl";
    var data = {
      Plant: scheduleConfFilter.plant.value,
      Process: scheduleConfFilter.process
        ? scheduleConfFilter.process.value
        : null,
      BatchID: scheduleConfFilter.batchId
        ? scheduleConfFilter.batchId.value
        : null,
      Status: scheduleConfFilter.status
        ? scheduleConfFilter.status.value
        : null,
      OrdID: scheduleConfFilter.order ? scheduleConfFilter.order : null,
      OrdItm: scheduleConfFilter.item ? scheduleConfFilter.item : null,
      Prod_DT: prdPDt,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          setScheduleDetailsData(response.data[1]);
          if (response.data[1].length > 0) {
            setBtnStatus(false);
            setMbatchDetailsData([]);
          } else {
            alertify.error("No Data Found");
            setBtnStatusInqry(true);
            setScheduleDetailsData([]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const saveWipFilter = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    if (!wipFilter.plant) {
      alertify.error("Please select plant");
      return;
    }
    if (!wipFilter.batchId) {
      alertify.error("Please select batch");
      return;
    }
    if (!wipFilter.process) {
      alertify.error("Please select process");
      return;
    }

    setLoading(true);
    var url = "/api/LDSM032/getWIPSchDetl";

    var data = {
      plant: wipFilter.plant.value,
      BatchID: wipFilter.batchId,
      process: wipFilter.process.value,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          if (response.data[1].length != 0) {
            setWipScheduleData(response.data[1]);
          } else {
            alertify.error("No Data Found");
            setWipScheduleData([]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getSourcePlantList = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    setLoading(true);
    var url = "api/tsmcrmf001/getSourcePlantList";
    var data = { plant: selectedPlant.value };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            var rowArr = row.split(":");
            obj.label = rowArr[0] + "-" + rowArr[1];
            obj.value = rowArr[0];
            items.push(obj);
          });
          setSourcePlantList(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (tabValue == 0) {
      getOdiaDDL();
      getIdiaDDL();
      getRollDDL();
      getFlowPathDDL();
      getProcessList();
      getOrderList();
      getItemList();
    }
    if (tabValue == 1) {
      getBatchIdList();
      getProcessList();
      getOrderList();
      getItemList();
    }
  }, [
    scheduleFilter?.plant,
    scheduleFilter?.process,
    scheduleConfFilter?.plant,
    wipFilter?.plant,
    scheduleConfFilter?.batchId,
  ]);

  const options = {
    maxHeight: 400,
    //pagination: "local",
    //paginationSize: 12,
    layout: "fitDataFill",
    downloadDataFormatter: (data) => data,
    downloadReady: (fileContents, blob) => blob,
    // responsiveLayout:"collapse",
    // responsiveLayoutCollapseStartOpen:false,
  };

  const optionsClm = {
    maxHeight: 400,
    //pagination: "local",
    //paginationSize: 12,
    layout: "fitColumns",
    downloadDataFormatter: (data) => data,
    downloadReady: (fileContents, blob) => blob,
    // responsiveLayout:"collapse",
    // responsiveLayoutCollapseStartOpen:false,
  };

  const submitSchedule = (cell) => {};

  const selSchedulingTablOld2 = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    // {
    //     "field": "", "title": "", formatter: sqrBtn, cellClick: function (e, cell) {
    //         {
    //             submitSchedule(cell);
    //         }
    //     },
    // },
    {
      title: "Plant",
      field: "EOP_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "EOP_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "EOP_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickness",
      field: "EOP_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Grade",
      field: "ENC_CD_GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Length",
      field: "EOP_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Ord Qty",
      field: "ORDER_QNTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Disp Qty",
      field: "DISPATCHED",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Free Stock",
      field: "FREE_STOCK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WIP",
      field: "TOT_WIP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Net Bal To Produce",
      field: "NET_BALANCE_TO_PROD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Idia",
      field: "EOP_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "EOP_OD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "FG Material",
      field: "EOP_FG_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Desc",
      field: "EOP_FG_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material",
      field: "EOP_SFG_MATNR_BOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material Desc",
      field: "EOP_SFG_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material",
      field: "EOP_RM_MATNR_BOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material Desc",
      field: "EOP_RM_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cust Code",
      field: "EOP_CUST_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cust Name",
      field: "EOP_CUST_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "City",
      field: "EOP_CITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Edge",
      field: "EOP_ORD_EDGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  let selSchedulingTabl = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Plant",
      field: "ENC_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "ENC_ID_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "ENC_NO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickness",
      field: "ENC_SEC1_MAX",
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
      title: "Width/odia",
      field: "ENC_SEC2_MAX",
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
      field: "ENC_LENGTH_MAX",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Qty",
      field: "ORDER_QNTY",
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
      title: "Disp Qty",
      field: "DISPATCHED",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Free Stock",
      field: "FREE_STOCK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WIP",
      field: "TOT_WIP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Bal To Produce",
      field: "NET_BALANCE_TO_PROD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Idia",
      field: "ENC_IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "ENC_ODIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material",
      field: "ENC_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Desc",
      field: "MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material",
      field: "SFG_MATNR_BOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material Desc",
      field: "SFG_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material",
      field: "RM_MATNR_BOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material Desc",
      field: "RM_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Cust",
      field: "MARK_CUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mark Cust NM",
      field: "MARK_CUST_NM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "City",
      field: "CITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Edge",
      field: "ORD_EDGE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Grade",
      field: "CD_GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item Type",
      field: "ITEM_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mill",
      field: "MILL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Drae Type",
      field: "DRAW_TYPE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Geometry",
      field: "GEOMETRY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Category",
      field: "CATEGORY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SPEC",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sur Finish",
      field: "SUR_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Class",
      field: "CLASS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "End Finish",
      field: "END_FINISH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ins Code",
      field: "INS_CODE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const selSchedulingTablOld = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      field: "TRO_ID_ORDER",
      title: "Order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "TRO_NO_ITEM",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ODIA",
      title: "ODia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "IDIA",
      title: "IDia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    }, //SRC_QTY
    {
      field: "Thick",
      title: "Thickness",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "Length",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "Grade",
      title: "Grade",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ORD_QTY",
      title: "Plan Wt (kg)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "RES_WT",
      title: "Bal Qty (kg)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "PRC_WT",
      title: "Prc Wt (kg)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GALVY_WT",
      title: "Galvy Wt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GALV_BAL",
      title: "Galvy Bal Qty",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "GALV_PRC_QTY",
      title: "Galvy prc Wt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "Material",
      title: "FG Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MAT_DESC",
      title: "FG Material Description",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "RM_MAT",
      title: "RM Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "RM_MAT_DESC",
      title: "RM Material Description",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "TOLERANCE",
      title: "Tolerance",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "Cust_Name",
      title: "Customer Name",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "QLTY_REMARK",
      title: "Quality Remark",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "REMARK",
      title: "Planning Remark",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const scheduleConfirmColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Batch Id",
      field: "EWI_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "EWI_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "EWI_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "EWI_SEC2",
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
      title: "IDia",
      field: "EWI_IDIA",
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
    // { "title": "No of Pcs", "field": "EWI_NO_PIECES", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "No of Bndl", "field": "EWI_NO_PACK", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "SCO Order", "field": "EWI_NO_SCO_ORDER", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "title": "Item", "field": "EWI_NO_SCO_ITEM", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    {
      title: "Status",
      field: "EWI_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt",
      field: "EWI_MS_PIECE_ACTL",
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
      title: "Net Wt UOM",
      field: "EWI_UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule Date",
      field: "CR_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Customer Name",
      field: "ENC_CUST_NAME",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule Id",
      field: "EWI_ID_SCHEDULE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Logical Id",
      field: "EWI_L_SCO_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Priority",
      field: "EWI_PRIORITY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // { "title": "Work ID", "field": "EWI_ID_WRK_INST", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
  ];

  const wipScheduleColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "BatchID",
      field: "EWI_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Parent Batch",
      field: "EWI_ID_PARENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thickness",
      field: "EWI_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "IDia",
      field: "EWI_IDIA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "EWI_SEC2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Length",
      field: "EWI_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cust Order",
      field: "EWI_ID_ORDER_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "EWI_ID_ORD_ITEM_CUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qty",
      field: "LOM_MS_GROSS_CAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SCO Order",
      field: "EWI_NO_SCO_ORDER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Item",
      field: "EWI_NO_SCO_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Rollchange",
      field: "EWI_CAMP_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule Date",
      field: "CR_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const gVPFSColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      field: "FG_MAT",
      title: "FG Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ETC_SRC_MATNR",
      title: "RM Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MAT_DESC",
      title: "RM Material Description",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "BOM_QTY",
      title: "RM Req Ratio",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const gVDetailColumnsOld = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    { title: "Mother Batch", field: "MOTHER_BATCH" },
    { title: "RM Material", field: "MATNR" },
    { title: "RM Material Desc", field: "RM_MATNR_DESC" },
    { title: "RM Qty", field: "RAW_QTY" },
    { title: "SFG Qty", field: "SFG_QTY" },
    { title: "FG Qty", field: "FG_QTY" },
    { title: "Thickness", field: "THK" },
    { title: "Width", field: "WIDTH" },
    { title: "Grade", field: "GRADE" },
    { title: "Coil Age", field: "COIL_AGE" },
    { title: "Gross WT (kg)", field: "" },
    { title: "Balance Qty (kg)", field: "" }, //Logic Pending
    { title: "Schedule Qty (kg)", field: "", editor: "input" },
    { title: "Schedule Qty (kg)", field: "", editor: "input" },
  ];

  const gVDetailColumns = [
    { title: "Coil Id", field: "LOM_ID_BATCH", bottomCalc: () => "Total" },
    {
      title: "Thickness",
      field: "LOM_SEC1",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    {
      title: "ODia",
      field: "LOM_SEC2",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    { title: "RM Material", field: "MATERIAL" },
    { title: "RM Material Desc", field: "MAKTX" },
    {
      field: "txtSFGMat",
      title: "SFG Material",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: SFGmaterialDesc,
      },
      formatter: "lookup",
      formatterParams: SFGmaterialDesc,
      defaultValue: SFGmaterialDesc,
    },
    // {
    //     "field": "ddlNBatch", "title": "Nominate Batch", editor: "select", formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         cell.getElement().style["background-color"] = "#DA8EE7";
    //         cell.getElement().style["color"] = "#FFFFFF";
    //         return value;
    //     }, editor: "list",
    //     editorParams: {
    //         allowEmpty: false,
    //         showListOnEmpty: true,
    //         values: [
    //             { label: "Y", value: "Y" },
    //             { label: "N", value: "N" }
    //         ]
    //     },
    // },
    {
      title: "Nominate Batch",
      field: "ddlNBatch",
      formatter: function (cell, formatterParams, onRendered) {
        return '<input type="checkbox" class="select-row" aria-label="select this row" />';
      },
      hozAlign: "center",
      headerSort: false,
      headerFilter: false,
      cssClass: "text-center",
      tooltips: false,
      resizable: false,
      cellClick: function (e, cell) {
        var element = cell.getElement();
        var chkbox = element.querySelector(".select-row");
        if (cell.getData().IsSelected) {
          cell.getRow().deselect();
          document.querySelector(".select-row").checked = false;
        } else {
          document
            .querySelectorAll(".select-row")
            .forEach((cb) => (cb.checked = false));
          cell.getColumn().getTable().deselectRow();

          cell.getRow().select();
          if (
            cell.getColumn().getTable().getSelectedRows().length ===
            cell.getColumn().getTable().getDataCount()
          ) {
            document.querySelector("..select-row").checked = true;
          }
        }
        var getSelectedRowsDt = cell.getData();

        setSelectedRowsDt(getSelectedRowsDt);
        chkbox.checked = !cell.getData().IsSelected;
        cell.getData().IsSelected = !cell.getData().IsSelected;
      },
    },
    { title: "TDC", field: "LOM_TDC_ACTL" },
    // { "title": "Processing Wt", "field": "LOM_MS_GROSS_ACTL", formatter: "money", bottomCalc: "sum", bottomCalcParams: { precision: 3 } },
    { title: "Age", field: "AGE" },
    {
      title: "Gross Wt (MT)",
      field: "GROSS_WT",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Residual Wt (MT)",
      field: "PRC_WT",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    // {
    //     "title": "Schedule Qty (KG)", "field": "SCH_QTY", bottomCalc: "sum",
    //     bottomCalcParams: {
    //         precision: 3
    //     },
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (value) {
    //             return parseFloat(value).toFixed(3);
    //         }
    //         return value
    //     }
    // },
    {
      title: "Schedule Qty (KG)",
      field: "SCH_QTY",
      bottomCalc: "sum",
      bottomCalcParams: {
        precision: 3,
      },
      editor: "input",
      cellEdited: (cell) => {
        var schWtTon = cell._cell.row.data.SCH_QTY / 1000;
        if (cell._cell.row.data.GROSS_WT < schWtTon) {
          alertify.error("Schedule Qty should not be greater than Gross Wt !");
          return;
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    { title: "Merge Batch", field: "mBatch" },
  ];

  const copyTable = (cell) => {
    //mBatch
    var array = getCustomerTable;
    var table = cell._cell.row.table;
    table.replaceData(array);
    setBtchData(array);
  };

  const downloadExcelcustomerTableData = () => {
    var date = new Date();
    var fileName = "LD01S002 " + date.toString() + ".xlsx";
    selectedSchedulingTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  // const handleClose = () => {

  //     setOpen(false);
  //     var d = selectedModalTable.getSelectedRows();
  //     if (d.length == 0) {
  //         alertify.error("No row selected !");
  //         return;
  //     }
  //     var dt = d[0]._row.data;
  //     setOrderList([{ label: dt.ORD, value: dt.ORD }]);
  //     setItemList([{ label: dt.ITEM, value: dt.ITEM }])
  //     setScheduleFilter({
  //         ...scheduleFilter,
  //         order: dt.ORD,
  //     });
  //     setScheduleFilter({
  //         ...scheduleFilter,
  //         item: dt.ITEM,
  //     })
  // };

  const handleClickOpen = (cell) => {
    setOpen(true);
    getOrderList();
  };

  const setScheduleTypeVal = (d) => {
    setValueRadio(d);
    setOpen(false);
    checkBoxChanged(true);
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    // checkBoxChanged(true);
  };

  const getSFGMarerailDesc = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedSchedulingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      return;
    }

    if (selectedRows.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    var data = {
      plant: scheduleFilter.plant.value,
      FG_Mat: selectedRows[0]._row.data.ENC_NO_MATNR,
    };

    setLoading(true);
    var url = "api/LDSM032/getSfgMaterial";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          if (response.data) {
            var tableItems = {};
            response.data.map((row) => {
              var rowArr = row.split(":");
              tableItems[rowArr[0]] = rowArr[0];
            });
            setSFGMaterialDesc(tableItems);
          } else {
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getMergeBatchDt = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedSchedulingConfirmTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    if (selectedRows.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    var data = {
      Plant: scheduleConfFilter.plant.value,
      batchId: selectedRows[0]._row.data.EWI_ID_BATCH,
    };

    setLoading(true);
    var url = "api/LDSM032/getMergeBatchDetails";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          if (response.data[1].length != 0) {
            setMbatchDetailsData(response.data[1]);
            setBtnStatus(true);
          } else {
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const onClickDeleteMergeDetails = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    if (scheduleConfFilter.status) {
      if (scheduleConfFilter.status.value != "WC") {
        alertify.error(
          "Operation only available for WC Waiting for Confirmation Status"
        );
        setLoading(false);
        return;
      } else if (scheduleConfFilter.status.value != "CN") {
        alertify.error("Operation only available for CN Confirmed Status");
        setLoading(false);
        return;
      }
    } else {
      alertify.error("Please select Status !");
      setLoading(false);
      return;
    }

    setLoading(true);
    var url = "/api/LDSM032/getScheduleDelMerge";

    var selectedRows = selectedMergeDt.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    var selectedRowsSchConfirm =
      selectedSchedulingConfirmTable.getSelectedRows();
    if (selectedRowsSchConfirm.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    var data = {
      Plant: scheduleConfFilter.plant.value,
      dt: selectedRowsSchConfirm[0]._row.data,
      dt2: selectedRows[0]._row.data,
    };
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          var results = response.data.outBinds.LS_OUT_FLAG;
          if (results) {
            alertify.success(results);
          } else {
            alertify.error("No Data Found");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Tubes Rolling Schedule"
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
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Do you want to create new schedule or add in existing schedule ?
        </BootstrapDialogTitle>
        <DialogContent>
          <Grid item xs={12}>
            <MDBox px={1} py={1}>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <MDButton
                    style={{ marginTop: "1.5rem" }}
                    size="lerge"
                    color="info"
                    onClick={() => setScheduleTypeVal("N")}
                  >
                    {" "}
                    New schedule{" "}
                  </MDButton>
                </Grid>
                <Grid item xs={4}>
                  <MDButton
                    style={{ marginTop: "1.5rem" }}
                    size="small"
                    color="info"
                    onClick={() => setScheduleTypeVal("M")}
                  >
                    {" "}
                    Add in existing schedule{" "}
                  </MDButton>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </DialogContent>
        <DialogActions>
          {/* <MDButton style={{ marginTop: "1.5rem" }} size="small" color="info" onClick={handleClose} > Ok </MDButton> */}
        </DialogActions>
      </BootstrapDialog>
      {isRestricted == false && (
        <>
          <MDBox pt={6} pb={3} py={7}>
            <Grid container spacing={6}>
              {/* create tabs */}
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Scheduling" icon={<TabIcon />} />
                    <Tab
                      label="Schedule Confirmation/Rejection"
                      icon={<TabIcon />}
                    />
                    <Tab label="WIP Schedule" icon={<TabIcon />} />
                  </Tabs>
                </AppBar>
              </Grid>
              {/* tabs controlled data */}
              <Grid item xs={12}>
                {tabValue == 0 && (
                  <>
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
                              Filters
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Clear" arrow>
                              <IconButton
                                color="white"
                                onClick={() => clearFilter()}
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                          {/* <Grid item xs={1}>
                                                        <Tooltip title="Save Plan" arrow>
                                                            <IconButton color="white" onClick={() => checkBoxChanged(true)}>
                                                                <SaveIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip
                                                            title="Download"
                                                            arrow >
                                                            <IconButton color="white" onClick={() => downloadExcelcustomerTableData()}>
                                                                <DownloadForOfflineIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid> */}
                        </Grid>
                      </MDBox>

                      <MDBox px={3} py={3}>
                        <Grid container spacing={1}>
                          <Grid item xs={3} style={{ zIndex: 10 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Plant *{" "}
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plantList}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  plant: e,
                                })
                              }
                              value={
                                scheduleFilter?.plant ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
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
                              {" "}
                              Process{" "}
                            </MDTypography>
                            <ReactSelect
                              options={processDDL}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  process: e,
                                })
                              }
                              value={
                                scheduleFilter?.process ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={1} >
                                                        <MDButton style={{ marginTop: "1.5rem" }}
                                                            size="small" color="info" onClick={() => handleClickOpen()} > Order/Item </MDButton>
                                                    </Grid> */}
                          <Grid item xs={2} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Order{" "}
                            </MDTypography>
                            <ReactSelect
                              options={order}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  order: e,
                                })
                              }
                              value={
                                scheduleFilter?.order ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          <Grid item xs={1} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Item{" "}
                            </MDTypography>
                            <ReactSelect
                              options={item}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  item: e,
                                })
                              }
                              value={
                                scheduleFilter?.item ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={1.25}>
                                                        <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Order</MDTypography>
                                                        <MDInput name="order" value={allValues.order || ''} onChange={(e) => handleChange(e)} />
                                                    </Grid>
                                                    <Grid item xs={0.75}>
                                                        <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap >Item</MDTypography>
                                                        <MDInput name="item" value={allValues.item || ''} onChange={(e) => handleChange(e)} />
                                                    </Grid> */}
                          <Grid item xs={1.25} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              ODia{" "}
                            </MDTypography>
                            <ReactSelect
                              options={odiaDDL}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  odia: e,
                                })
                              }
                              value={
                                scheduleFilter?.odia ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          <Grid item xs={1.25} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Idia{" "}
                            </MDTypography>
                            <ReactSelect
                              options={idiaDDL}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  idia: e,
                                })
                              }
                              value={
                                scheduleFilter?.idia ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
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
                              {" "}
                              Work Center{" "}
                            </MDTypography>
                            <ReactSelect
                              options={rollDDL}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  roll: e,
                                })
                              }
                              value={
                                scheduleFilter?.roll ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          <Grid item xs={2} style={{ zIndex: 4 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Route{" "}
                            </MDTypography>
                            <ReactSelect
                              options={flowPathDDL}
                              onChange={(e) =>
                                setScheduleFilter({
                                  ...scheduleFilter,
                                  flowPath: e,
                                })
                              }
                              value={
                                scheduleFilter?.flowPath ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          <Grid item xs={3}>
                            <FormControl>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Schedule Type
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueRadio}
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="N"
                                  control={<Radio />}
                                  label="Create New Schedule"
                                />
                                <FormControlLabel
                                  value="M"
                                  control={<Radio />}
                                  label="Add in Existing Schedule"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => saveScheduling(true)}
                            >
                              {" "}
                              Submit{" "}
                            </MDButton>
                          </Grid>

                          {/* <Grid item xs={1} >
                                                    <MDButton style={{ marginTop: "1.5rem" }}
                                                        size="small" color="info" onClick={() => checkBoxChanged(true)} > Checked </MDButton>
                                                </Grid> */}
                        </Grid>
                      </MDBox>
                    </Card>

                    <Card style={{ marginTop: "2rem" }}>
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
                              Order Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Show Coil Details" arrow>
                              {/* <IconButton color="white" onClick={() => checkBoxChanged(true)}>
                                                                <FormatListBulletedIcon />
                                                            </IconButton> */}
                              <IconButton
                                color="white"
                                onClick={() => checkScheduleType(true)}
                              >
                                <FormatListBulletedIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          style={{ display: "none" }}
                        >
                          <Grid item xs={2}></Grid>
                          <Grid item xs={2}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ margin: "0.5rem" }}
                            >
                              Download
                            </MDButton>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="selSchedulingTable" />
                          </Grid>
                          {/* <Grid item xs={1}>
                                                        <FormControlLabel
                                                            control={<Checkbox />}
                                                            label="For PFS"
                                                            onChange={(e) =>
                                                                setScheduleConfFilter({
                                                                    ...scheduleConfFilter,
                                                                    pfs: e.target.checked,
                                                                })
                                                            }
                                                        />
                                                    </Grid> */}
                        </Grid>
                      </MDBox>
                    </Card>

                    <Card style={{ marginTop: "2rem" }}>
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
                              Scheduling Details
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Create Schedule" arrow>
                              <IconButton
                                color="white"
                                onClick={() => btnCrtSchdl(true)}
                              >
                                <AddCircleIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          style={{ display: "none" }}
                        >
                          <Grid item xs={2}></Grid>
                          <Grid item xs={2}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ margin: "0.5rem" }}
                            >
                              Download
                            </MDButton>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="schedulingDetailsTable" />
                          </Grid>
                        </Grid>
                        {showSaveMsgError && (
                          <Grid item xs={12}>
                            <MDAlert color="error" dismissible>
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
                            <MDAlert color="success" dismissible>
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
                      </MDBox>
                    </Card>
                  </>
                )}
                {tabValue == 1 && (
                  <>
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
                              Filters
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Clear" arrow>
                              <IconButton
                                color="white"
                                onClick={() => clearFilter()}
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>

                      <MDBox px={3} py={3}>
                        <Grid container spacing={1.5}>
                          <Grid item xs={3} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Plant *{" "}
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plantList}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  plant: e,
                                })
                              }
                              value={
                                scheduleConfFilter?.plant ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          <Grid item xs={2} style={{ zIndex: 10 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Process{" "}
                            </MDTypography>

                            <ReactSelect
                              options={processDDL2}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  process: e,
                                })
                              }
                              value={
                                scheduleConfFilter?.process ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          <Grid item xs={1.25} style={{ zIndex: 10 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Batch ID{" "}
                            </MDTypography>
                            {/* <MDInput
                                                            label=""
                                                            name="Batch ID"
                                                            value={scheduleConfFilter?.batchId ?? ""}
                                                            onChange={(e) =>
                                                                setScheduleConfFilter({
                                                                    ...scheduleConfFilter,
                                                                    batchId: e.target.value,
                                                                })
                                                            }
                                                        /> */}
                            <ReactSelect
                              options={batchDDL3}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  batchId: e,
                                })
                              }
                              value={
                                scheduleConfFilter?.batchId ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          <Grid item xs={1.5} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Status{" "}
                            </MDTypography>
                            <ReactSelect
                              id="status"
                              options={statusList}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  status: e,
                                })
                              }
                              value={
                                scheduleConfFilter?.status ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
                            />
                          </Grid>
                          {/* <Grid item xs={1}>
                                                        <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap > For PF </MDTypography>
                                                       
                                                        <FormControlLabel
                                                            control={<Checkbox />}
                                                            label="For PFS"
                                                            onChange={(e) =>
                                                                setScheduleConfFilter({
                                                                    ...scheduleConfFilter,
                                                                    pfs: e.target.checked,
                                                                })
                                                            }
                                                        />
                                                    </Grid> */}

                          <Grid item xs={1}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ marginTop: "1.5rem" }}
                              disabled={btnSts}
                              onClick={() => saveRearrange(true)}
                            >
                              Rearrangment
                            </MDButton>
                          </Grid>
                          <Grid item xs={1}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ marginTop: "1.5rem" }}
                              disabled={btnSts}
                              onClick={() => onClickConfirm(true)}
                            >
                              Confirm
                            </MDButton>
                          </Grid>

                          <Grid item xs={1}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ marginTop: "1.5rem" }}
                              onClick={() => saveInquiry(true)}
                            >
                              Enquiry
                            </MDButton>
                          </Grid>
                          <Grid item xs={1}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ marginTop: "1.5rem" }}
                              disabled={btnSts}
                              onClick={() => onClickDelete(true)}
                            >
                              Delete
                            </MDButton>
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
                              {" "}
                              Order{" "}
                            </MDTypography>
                            <MDInput
                              name="order"
                              value={scheduleConfFilter?.order ?? ""}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  order: e.target.value,
                                })
                              }
                            />
                          </Grid>
                          <Grid item xs={0.75}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Item{" "}
                            </MDTypography>
                            <MDInput
                              name="item"
                              value={scheduleConfFilter?.item ?? ""}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  item: e.target.value,
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={1.5} style={{ zIndex: 3 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Shift{" "}
                            </MDTypography>

                            <ReactSelect
                              id="plant"
                              options={plant}
                              value={scheduleConfFilter?.shift ?? ""}
                              onChange={(e) =>
                                setScheduleConfFilter({
                                  ...scheduleConfFilter,
                                  shift: e,
                                })
                              }
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
                              Plan Production Date{" "}
                            </MDTypography>
                            {/* <DatePicker id="prodPlnDt" /> */}
                            <DatePicker
                              id="prodPlnDt"
                              value={dateValue}
                              onChange={(date) => setDateValue(date)}
                            />
                            {/* <MDInput
                                                        label=""
                                                        name="Prod. Plan Date"
                                                        value={scheduleConfFilter?.planDate ?? ""}
                                                    /> */}
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>

                    <Card style={{ marginTop: "2rem" }}>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
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
                              Scheduling Details
                            </MDTypography>
                          </Grid>

                          <Grid item xs={1}>
                            <Tooltip title="Show Merge Batch Details" arrow>
                              <IconButton
                                color="white"
                                onClick={() => getMergeBatchDt(true)}
                              >
                                <FormatListBulletedIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          style={{ display: "none" }}
                        >
                          <Grid item xs={2}></Grid>
                          <Grid item xs={2}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ margin: "0.5rem" }}
                            >
                              Download
                            </MDButton>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="schedulingConfirmTable" />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>

                    <Card style={{ marginTop: "2rem" }}>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
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
                              Merge Detail
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => onClickDeleteMergeDetails(true)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          style={{ display: "none" }}
                        >
                          <Grid item xs={2}></Grid>
                          <Grid item xs={2}></Grid>
                        </Grid>

                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="mergeTable" />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
                {tabValue == 2 && (
                  <>
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
                              Filters
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Clear" arrow>
                              <IconButton
                                color="white"
                                onClick={() => clearFilter()}
                              >
                                <ClearAllIcon />
                              </IconButton>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </MDBox>

                      <MDBox px={3} py={3}>
                        <Grid container spacing={1}>
                          <Grid item xs={3} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {" "}
                              Plant *{" "}
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plantList}
                              onChange={(e) =>
                                setWipFilter({ ...wipFilter, plant: e })
                              }
                              //defaultValue={plantList[0]}
                              value={
                                wipFilter?.plant ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
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
                              {" "}
                              Process{" "}
                            </MDTypography>
                            <ReactSelect
                              options={processDDL3}
                              onChange={(e) =>
                                setWipFilter({ ...wipFilter, process: e })
                              }
                              value={
                                wipFilter?.process ?? {
                                  label: "-Select",
                                  value: "",
                                }
                              }
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
                              {" "}
                              Batch ID{" "}
                            </MDTypography>
                            <MDInput
                              label=""
                              name="Batch ID"
                              value={wipFilter?.batchId ?? ""}
                              onChange={(e) =>
                                setWipFilter({
                                  ...wipFilter,
                                  batchId: e.target.value,
                                })
                              }
                            />
                          </Grid>
                          <Grid item xs={1}>
                            {" "}
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => saveWipFilter(true)}
                            >
                              {" "}
                              Submit{" "}
                            </MDButton>{" "}
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                    <Card style={{ marginTop: "2rem" }}>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={1}
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
                              WIP Details
                            </MDTypography>
                          </Grid>
                          {/* <Grid item xs={1}>
                                                        <Tooltip title="Download" arrow>
                                                            <IconButton color="white" onClick={() => downloadExcelcustomerTableData()}>
                                                                <DownloadForOfflineIcon />
                                                            </IconButton>
                                                        </Tooltip>

                                                    </Grid> */}
                        </Grid>
                      </MDBox>
                      <MDBox px={3} py={3}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          style={{ display: "none" }}
                        >
                          <Grid item xs={2}></Grid>
                          <Grid item xs={2}>
                            <MDButton
                              size="small"
                              color="info"
                              style={{ margin: "0.5rem" }}
                            >
                              Download
                            </MDButton>
                          </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="wipScheduleTable" />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
