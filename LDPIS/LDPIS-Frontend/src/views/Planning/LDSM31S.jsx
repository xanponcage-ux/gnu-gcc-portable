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
import { GetAuthorization } from "utils";

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
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [btnSts, setBtnStatus] = React.useState(true);
  const [disableFiled, setDisableFiled] = React.useState(false);
  const [editable, setEditable] = React.useState(true);
  const [btnStsInqry, setBtnStatusInqry] = React.useState(true);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [plantList, setPlantList] = useState([]);
  const [orderDt, setOrderListDt] = useState([]);
  const [order, setOrderList] = useState([]);
  const [item, setItemList] = useState([]);
  const [tabValue, setTabValue] = useState(0);

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
  const [checkStatus, setCheckStatus] = useState(false);
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
    // { label: "PR Processed", value: "PR" },
    // { label: "RJ Deleted", value: "RJ" }
  ]);
  const [dateValue, setDateValue] = useState();

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
  const formattedDate = date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-").replace("Sept", "Sep");
  const [scheduleConfFilter, setScheduleConfFilter] = useState({
    planDate: formattedDate,
  });
  const [wipFilter, setWipFilter] = useState({});
  const { prevMonth, openOrders } = allValues;
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [open, setOpen] = React.useState(false);
  const [createScheduleBtnSts, setCreateScheduleBtnSts] = React.useState(false);
  const [selectedWorkCenter, setSelectedWorkCenter] = React.useState([]);
  const [wCenter, setwCenter] = React.useState([]);

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([getPlantList(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }

  //page load
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (tabValue === 0 && schedulingTable && schedulingTable.length > 0) {
      setSelectedSchedulingTable(
        new Tabulator("#selSchedulingTable", {
          maxHeight: 400,
          layout: "fitDataFill",
          data: schedulingTable,
          columns: selSchedulingTabl,
          selectable: 1,
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
          layout: "fitColumns",
          data: wipSchedule,
          columns: wipScheduleColumns,
        })
      );
    }
  }, [tabValue, schedulingTable, selectScheduleDetData, wipSchedule]);

  useEffect(() => {
    if (tabValue === 0) {
      setSelectedSchedulingDetailsTable(
        new Tabulator("#schedulingDetailsTable", {
          maxHeight: 400,
          layout: "fitDataFill",
          data: selectedCoilData,
          columns: gVDetailColumns,
        })
      );
    }
  }, [selectedCoilData]);

  useEffect(() => {
    if (orderDt && orderDt.length > 0) {
      setSelectOrderItemModal(
        new Tabulator("#modalTable", {
          height: 300,
          pagination: "local",
          paginationSize: 200,
          data: orderDt,
          columns: ordItmClm,
        })
      );
    }
  }, [orderDt]);

  if (selectedSchedulingTable != null) {
    selectedSchedulingTable.on("rowSelectionChanged", function (data, rows) {
      if (checkStatus == true) {
        setSelectedCoilDetailsData([,]);
        setCheckStatus(false);
      }
    });
  }

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

  const validateUser = async (token) => {
    try {
      var plant = "";
      var userDetails = jwt.verify(
        token.refreshToken,
        serverDetails.REFRESH_KEY
      );
      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LD01S002";

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
        if (response?.statusText != "" && response?.statusText != "OK") {
          reject(null);
        } else {
          var encryptUserInfo = response?.data;
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

  const getPlantList = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/common/getGroupPlant";
      axiosAPI
        .post(url, { adid: serverDetails.PersonalNo }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var items = response.data.map(([label, value]) => ({
              label,
              value,
            }));
            setPlantList(items);
            setScheduleFilter({ ...scheduleFilter, plant: items[0] });
            setScheduleConfFilter({ ...scheduleConfFilter, plant: items[0] });
            setWipFilter({ ...wipFilter, plant: items[0] });
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getOrderList = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let Plant = value ? value.value : scheduleFilter.plant.value;
      var url = "api/LD01S002/getAllOrderList";
      axiosAPI
        .post(url, { Plant }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
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
            setOrderList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getItemList = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var d = {
        Plant: value ? value.value : "",
        OrderId: scheduleFilter.order ? scheduleFilter.order.value : null,
      };
      var url = "api/LD01S002/getAllItemList";
      axiosAPI
        .post(url, d, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
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
          resolve();
        });
    });
  };

  const getItemListOnOrder = async (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var d = {
        Plant: scheduleFilter.plant ? scheduleFilter.plant.value : null,
        OrderId: value ? value.value : "",
      };
      var url = "api/LD01S002/getAllItemList";
      axiosAPI
        .post(url, d, defaultOptions)
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
  const [Merge, setMergetype] = useState(false);
  const [priority, setPriority] = React.useState([]);

  const mergeDetailsClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      width: 50,
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
        layout: "fitColumns",
        data: mbatchDetailsData,
        columns: mergeDetailsClm,
        selectable: 1,
      })
    );
  }, [mbatchDetailsData]);

  const getProcessList = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var d = {
        Plant: value ? value.value : "",
        tabValue: 1,
      };

      var url = "/api/LD01S002/getProcDesc";
      axiosAPI
        .post(url, { d }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var items = response.data.map(([value, label]) => ({
              label,
              value,
            }));
            setProcessDDL2(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getGorkCenterFilter = async (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM004/getWorkCenter";
      let data = {
        Plant: scheduleConfFilter.plant?.value,
        Process: value ? value.value : "",
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            let item = [];
            response.data.map((j, i) => {
              var a = j;
              var d = a[0].split(",");
              var trim = d[0].split(/\s/).join("");
              item.push({ label: d[0] + "--" + d[1], value: trim });
            });
            setwCenter(item);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getBatchIdList = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      let Plant = value ? value.value : "";

      var url = "/api/LD01S002/getBatchId";
      axiosAPI
        .post(url, { Plant }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var items = response.data.map(([value]) => ({
              label: value,
              value,
            }));
            setBatchDDL3(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getMergeTypeDetails = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      let Plant = value ? value.value : "";

      resolve();
      var url = "/api/LD01S002/getNoMergeDetails";
      axiosAPI
        .post(url, { Plant }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            if (response.data.rows.length != 0) {
              let d = response.data.rows[0][0] == "NO-MERGE" ? true : false;
              setMergetype(d);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getOdiaDDL = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "/api/LD01S002/getODIA";
      axiosAPI
        .post(url, { Plant: value ? value.value : "" }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var items = response.data.map(([value, label]) => ({
              label: value.toFixed(3),
              value,
            }));
            setOdiaDDL(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getIdiaDDL = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "/api/LD01S002/getIDIA";
      axiosAPI
        .post(url, { Plant: value ? value.value : "" }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var items = response.data.map(([value, label]) => ({
              label: value.toFixed(3),
              value,
            }));
            setIdiaDDL(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const filterWorkCenter = async (value) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      setLoading(true);
      var url = "/api/LD01S002/getWorkCenter";
      axiosAPI
        .post(
          url,
          {
            Plant: scheduleFilter ? scheduleFilter.plant.value : "",
            process: value ? value.value : "",
          },
          defaultOptions
        )
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
            setRollDDL(item);
            filterRoute(value, token.accessToken);
            getPriorityValue(value, token.accessToken);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const getPriorityValue = async (value, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    var url = "/api/LD01S002/getPrioity";
    axiosAPI
      .post(url, {}, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          setPriority(response.data[0][0]);
        }
      })
      .finally((f) => {});
  };

  const filterRoute = async (value, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    var url = "/api/LD01S002/getPath";
    axiosAPI
      .post(
        url,
        {
          Plant: scheduleFilter ? scheduleFilter.plant.value : "",
          Process: value ? value.value : "",
        },
        defaultOptions
      )
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
        } else {
          //var items = response.data.map(([value]) => ({ label: value, value }));
          let item = [];
          response.data.map((j, i) => {
            var a = j;
            var d = a;
            var trim = d[0].split(/\s/).join("");
            item.push({ label: d[0] + " --> " + d[1], value: trim });
          });
          setFlowPathDDL(item);
        }
      })
      .finally((f) => {});
  };

  const getRollDDL = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "/api/LD01S002/getWorkCenter";
      axiosAPI
        .post(url, { Plant: value ? value.value : "" }, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            let item = [];
            response.data.map((j, i) => {
              var a = j;
              var d = a[0].split(",");
              var trim = d[0].split(/\s/).join("");
              item.push({ label: d[0] + "--" + d[1], value: trim });
            });

            setRollDDL(item);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getFlowPathDDL = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "/api/LD01S002/getPath";
      axiosAPI
        .post(
          url,
          {
            Plant: value ? value.value : "",
            Process: scheduleFilter.process?.value ?? "",
          },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            // var items = response.data.map(([value]) => ({
            //   label: value,
            //   value,
            // }));
            let item = [];
            response.data.map((j, i) => {
              var a = j;
              var d = a;
              var trim = d[0].split(/\s/).join("");
              item.push({ label: d[0] + " --> " + d[1], value: trim });
            });
            setFlowPathDDL(item);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const saveScheduling = async () => {
    setSchedulingTable([]);
    setSelectedCoilDetailsData([]);
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setCreateScheduleBtnSts(false);
    setDisableFiled(false);
    setEditable(false);
    if (scheduleFilter.plant != undefined) {
      if (scheduleFilter.plant.value == undefined) {
        alertify.error("Please select plant!");
        return;
      }
    } else {
      alertify.error("Please select plant!");
      return;
    }

    if (scheduleFilter.process == undefined) {
      alertify.error("Please select process!");
      return;
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "/api/LD01S002/getOrder";

      var data = {
        Plant: scheduleFilter.plant ? scheduleFilter.plant.value : "",
        process: scheduleFilter.process ? scheduleFilter.process.value : "",
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
              setSchedulingTable([,]);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const saveSchedulingRef = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      setSchedulingTable([]);
      setSelectedCoilDetailsData([]);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(false);
      setCreateScheduleBtnSts(false);
      setDisableFiled(false);
      setEditable(false);
      if (scheduleFilter.plant != undefined) {
        if (scheduleFilter.plant.value == undefined) {
          alertify.error("Please select plant!");
          return;
        }
      } else {
        alertify.error("Please select plant!");
        return;
      }

      if (scheduleFilter.process == undefined) {
        alertify.error("Please select process!");
        return;
      }

      var url = "/api/LD01S002/getOrder";

      var data = {
        Plant: scheduleFilter.plant ? scheduleFilter.plant.value : "",
        process: scheduleFilter.process ? scheduleFilter.process.value : "",
        Odia: null,
        Idia: null,
        Order: null,
        Item: null,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            if (response.data[1].length != 0) {
              setSchedulingTable(response.data[1]);
            } else {
              alertify.error("No Data Found");
              setSchedulingTable([,]);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const btnCrtSchdl = async () => {
    if (scheduleFilter.plant.value != undefined) {
      if (scheduleFilter.roll == undefined) {
        alertify.error("Please select work center!");
        return;
      }

      if (scheduleFilter.flowPath == undefined) {
        alertify.error("Please select route!");
        return;
      }

      var selectedTable = selectedSchedulingdetailsTable.getData();

      if (selectedTable.length == 0) {
        alertify.error(
          "Coil details are not found hence schedule can not be created."
        );
        setLoading(false);
        return;
      }

      var flgCustno = false;
      selectedTable.forEach((item) => {
        if (item.LOM_NO_CAST == "n.a") {
          flgCustno = true;
        }
      });

      if (flgCustno == true) {
        alertify.error("Cust No is mandatory for schedule reation");
        setLoading(false);
        return;
      }

      var allotedFlg = false;
      selectedTable.forEach((item) => {
        if (item.ALLOT_FLAG == "PARTIAL") {
          allotedFlg = true;
        }
      });

      if (allotedFlg == true) {
        alertify.error(
          "Coil Is partially allotted . First allot the full quantity of coil and then proceed for scheduling."
        );
        setLoading(false);
        return;
      }

      selectedTable.forEach((item) => {
        if (item.Priority < priority) {
          alertify.error(
            "Todays last priority is " +
              priority +
              " please enter higher priority"
          );
          setLoading(false);
          return;
        }
      });

      setLoading(true);

      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        var mergeTypUrl = "/api/LD01S002/getNoMergeDetails";
        var dataMergeTyp = {
          Plant: scheduleFilter.plant.value,
        };
        axiosAPI
          .post(mergeTypUrl, dataMergeTyp, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              if (
                response.data.rows?.length != 0 &&
                response.data?.rows[0][0] == "MERGE"
              ) {
                if (selectRowsDt.length == 0) {
                  alertify.error("Please select nomination batch");
                  setLoading(false);
                  return;
                }

                var url = "/api/LD01S002/getMbatch";
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

                let schTon = sumGROSS_WT / 1000;
                if (schTon >= sumScheduleQty) {
                  alertify.error("Schedule qty. can't more than gross wt. !");
                  setLoading(false);
                  return;
                }

                if (selectedTable.length > 0) {
                  axiosAPI
                    .post(url, data, defaultOptions)
                    .then((response) => {
                      if (
                        response.statusText != "" &&
                        response.statusText != "OK"
                      ) {
                      } else {
                        if (response.data) {
                          var check = response.data.substring(0, 1);
                          if (check == "Y") {
                            var table = selectedTable;
                            var str = response.data.slice(2);
                            table.forEach((obj) => (obj["mBatch"] = str));
                            selectedSchedulingdetailsTable.replaceData(table);

                            var urlCrt = "/api/LD01S002/getCRTSchedule";

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
                              EOP_SFG_MATNR_BOM: selectRowsDt.TMA_SFG_MATNR, //SGF Material
                              P_NOMINATE_BATCH: selectRowsDt.LOM_ID_BATCH,
                              P_NOMINATE_MATNR: selectRowsDt.MATERIAL,
                              REMARKS: selectRowsDt.REMARKS,
                              Priority: selectRowsDt.Priority,
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
                                    var results =
                                      response.data.outBinds.LS_OUT_FLAG;
                                    if (results) {
                                      if (results.startsWith("Y-")) {
                                        setSelectedCoilDetailsData([,]);
                                        setScheduleFilter({
                                          ...scheduleFilter,
                                          order: "",
                                        });
                                        getOrderList(token.accessToken);
                                        saveSchedulingRef(token.accessToken);

                                        setShowSaveMsgSuccess(true);
                                        setShowSaveMsgError(false);
                                        setSaveMsg(results.replace("Y-", ""));
                                        setCreateScheduleBtnSts(true);
                                        setDisableFiled(true);
                                        setEditable(false);
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
                    setLoading(false);
                    return;
                  }
                  var urlCrt = "/api/LD01S002/getCRTSchedule";

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
                    Priority: coilDt.Priority,
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
                              setDisableFiled(true);
                              setEditable(false);
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
              } else if (
                response.data.rows?.length == 0 ||
                response.data?.rows[0][0] == "NO-MERGE"
              ) {
                var sumGROSS_WT = 0;
                selectedTable.forEach((item) => {
                  sumGROSS_WT += item.GROSS_WT;
                });

                var sumScheduleQty = 0;
                selectedTable.forEach((item) => {
                  sumScheduleQty += parseFloat(item.SCH_QTY);
                });

                var urlCrtall = "/api/LD01S002/getCRTScheduleAll";

                var data = {
                  adid: serverDetails.PersonalNo,
                  PlanPath: scheduleFilter.flowPath.value,
                  Plant: scheduleFilter.plant.value,
                  Process: scheduleFilter.process.value,
                  ORD_ID: scheduleFilter.order
                    ? scheduleFilter.order.value
                    : coilDt.ENC_ID_ORDER,
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
                  PROS_WT: selectedTable, //(all rows GROSS_WT sum)
                  GALVY_WT: 0,
                  rollchange: scheduleFilter.roll.value,
                  MOTHER_BATCH: "",
                  CL_WT: selectedTable, //(one rows GROSS_WT)
                  CL_MATNR: selectedTable, //selectedTable[0].MATERIAL, //Coil material
                  FG_WT: selectedTable,
                  P_SCH_TYPE_FL: valueRadio,
                  EOP_SFG_MATNR_BOM: selectedTable, //SGF Material
                  P_NOMINATE_BATCH: selectedTable, //selectRowsDt ? selectRowsDt.LOM_ID_BATCH : selectedTable,
                  P_NOMINATE_MATNR: selectedTable, //selectRowsDt ? selectRowsDt.MATERIAL : selectedTable
                  REMARKS: selectedTable,
                };

                axiosAPI
                  .post(urlCrtall, data, defaultOptions)
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
                            setSelectedCoilDetailsData([,]);
                            setScheduleFilter({ ...scheduleFilter, order: "" });
                            getOrderList(token.accessToken);
                            saveSchedulingRef(token.accessToken);

                            setShowSaveMsgSuccess(true);
                            setShowSaveMsgError(false);
                            setSaveMsg(results.replace("Y-", ""));
                            setCreateScheduleBtnSts(true);
                            setDisableFiled(true);
                            setEditable(false);
                          } else {
                            // document.querySelector('.select-row').disabled = false; //disableFiled
                            // document.querySelector('.select-row').checked = false;
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
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Please Select Plant!");
    }
  };

  const clearFilter = () => {
    setScheduleFilter({});
    setScheduleConfFilter({});
    setSchedulingTable([,]);
    setSelectedCoilDetailsData([]);
    setWipFilter({});
    setWipScheduleData([]);
    setScheduleDetailsData([]);
    setDateValue(null);
  };

  const clearFilterOrder = () => {
    setSchedulingTable([,]);
    setSelectedCoilDetailsData([,]);
    setDateValue(null);
  };

  const checkScheduleType = async () => {
    setSelectedRowsDt([]);
    setCreateScheduleBtnSts(false);
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);

    var selectedRows = selectedSchedulingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select Order Details Table");
      return;
    }

    if (selectedRows.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    setCheckStatus(true);

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "/api/LD01S002/getScheduleType";
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
            if (response.data.rows[0][0] > 0 && Merge == false) {
              setOpen(true);
            } else {
              checkBoxChanged();
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const checkBoxChanged = async () => {
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
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD01S002/getSfgMaterial";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            let res = [];
            var tableItems = {};
            if (response.data) {
              response.data.map((row) => {
                var rowArr = row.split(":");
                tableItems[rowArr[0]] = rowArr[0];
              });
              let keys = Object.keys(tableItems);
              for (let i = 0; i < keys.length; i++) {
                res.push({
                  x: keys[i],
                  y: SFGmaterialDesc[keys[i]],
                });
              }

              setSFGMaterialDesc(tableItems);
            } else {
              alertify.error("No Data Found");
            }

            var coilurl = "/api/LD01S002/coilDetails";
            var coilDt = {
              Plant: scheduleFilter.plant ? scheduleFilter.plant.value : "",
              Process: scheduleFilter.process
                ? scheduleFilter.process.value
                : "",
              RM_Mat: selectedRows[0]._row.data.RM_MATNR_BOM,
              Order: scheduleFilter.order
                ? scheduleFilter.order.value
                : selectedRows[0]._row.data.ENC_ID_ORDER,
              Item: scheduleFilter.item
                ? scheduleFilter.item.value
                : selectedRows[0]._row.data.ENC_NO_ITEM,
            };

            axiosAPI
              .post(coilurl, coilDt, defaultOptions)
              .then((response) => {
                if (response.statusText != "" && response.statusText != "OK") {
                } else {
                  if (response.data[1].length != 0) {
                    let result = response.data[1].map((dt) => {
                      (dt["ALLOT_FLAG"] = dt.ALLOT_FLAG),
                        (dt["LOM_ID_BATCH"] = dt.LOM_ID_BATCH);
                      dt["LOM_SEC1"] = dt.LOM_SEC1;
                      dt["LOM_SEC2"] = dt.LOM_SEC2;
                      dt["MATERIAL"] = dt.MATERIAL;
                      dt["MAKTX"] = dt.MAKTX;
                      dt["txtSFGMat"] = res[0] ? res[0].x : "";
                      dt["LOM_TDC_ACTL"] = dt.LOM_TDC_ACTL;
                      dt["AGE"] = dt.AGE;
                      dt["GROSS_WT"] = dt.GROSS_WT;
                      dt["PRC_WT"] = dt.PRC_WT;
                      dt["mBatch"] = "";
                      return dt;
                    });

                    let arr = [];
                    response.data[1].map((dt) => {
                      if (
                        dt.TMA_SFG_MATNR !== null &&
                        dt.TMA_SFG_MATNR !== ""
                      ) {
                        return arr.push(false);
                      } else {
                        return arr.push(true);
                      }
                    });

                    let arr1 = arr.every((v) => v === true);

                    setCreateScheduleBtnSts(arr1);
                    if (arr1) {
                      alertify.error("SFG Material not available !!!");
                    }

                    setSelectedCoilDetailsData(result);
                    setOrderDetailsDt(selectedRows[0]._row.data);
                    setLoading(false);
                  } else {
                    alertify.error("No Data Found");
                    setSelectedCoilDetailsData([]);
                    setOrderDetailsDt([]);
                    setLoading(false);
                  }
                }
              })
              .finally((f) => {
                setLoading(false);
              });
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
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
    var url = "api/LD01S002/getSfgMaterial";
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
    var url = "/api/LD01S002/getSchDetl";
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
      if (scheduleConfFilter.process == undefined) {
        alertify.error("Please select process !!");
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
      var url = "/api/LD01S002/getscheduleConf";

      if (dateValue == null) {
        alertify.error("Please Select Plan Production Date");
        setLoading(false);
        return;
      }
      var prdPDt = dateValue
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-").replace("Sept", "Sep");

      var selectedRows = selectedSchedulingConfirmTable.getSelectedRows();
      if (selectedRows.length == 0) {
        alertify.error("No rows selected");
        setLoading(false);
        return;
      }

      var today = new Date();
      var yesterday1 = new Date(new Date().setDate(new Date().getDate() - 1));
      let date = new Date(Date.parse(prdPDt));
      var newData = [];

      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });

      if (date >= yesterday1) {
        var data = {
          Plant: scheduleConfFilter.plant ? scheduleConfFilter.plant.value : "",
          shift: scheduleConfFilter.shift
            ? scheduleConfFilter.shift.value
            : "A",
          Prod_dt: prdPDt,
          dt: newData,
          CHK_PFS: true,
          Process: scheduleConfFilter.process
            ? scheduleConfFilter.process.value
            : "",
        };

        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              var results = response.data.outBinds.LS_OUT_FLAG;
              if (results) {
                alertify.success(results);
                saveInquiry();
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

  const onClickDelete = async () => {
    var url = "/api/LD01S002/getScheduleDel";

    var selectedRows = selectedSchedulingConfirmTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    var newData = [];

    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });
    setLoading(true);
    if (
      selectedRows[0]._row.data.EWI_CD_STATUS == "WC" ||
      selectedRows[0]._row.data.EWI_CD_STATUS == "CN"
    ) {
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
        var data = { Plant: scheduleConfFilter.plant.value, dt: newData };
        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText != "" && response.statusText != "OK") {
            } else {
              var results = response.data.outBinds.LS_OUT_FLAG;
              if (results) {
                alertify.success(results);
                saveInquiry();
              } else {
                alertify.error("No Data Found");
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    } else {
      alertify.error("Operation only available for WC And CN Status");
      setLoading(false);
      return;
    }
  };

  const saveInquiry = async () => {
    if (!scheduleConfFilter.plant) {
      alertify.error("Please select plant");
      return;
    }
    // var prdPDt = document.getElementById("prodPlnDt").value;
    if (dateValue != null) {
      var prdPDt = dateValue
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-").replace("Sept", "Sep");
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "/api/LD01S002/getInqDetl";
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
          : "",
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
    });
  };

  const saveWipFilter = async () => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");

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
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "/api/LD01S002/getWIPSchDetl";

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

  const submitSchedule = (cell) => {};

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
      title: "Length(m)",
      field: "ENC_LENGTH_MAX",
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
      title: "Ord Qty(TON)",
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
      title: "FG(TON)",
      field: "TOT_FG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined && value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    {
      title: "WIP(TON)",
      field: "TOT_WIP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined && value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    {
      title: "BTF(TON)",
      field: "WIP_KG_BTF",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

      formatter: function (cell, formatterParams) {
        //BTF  = Order qty- ( FG/1000)  ---- IF FG IS SHOWING in KG IN SCREEN
        let cal =
          cell._cell.row.data.ORDER_QNTY -
          parseFloat(cell._cell.row.data.TOT_FG);
        var value = cal;
        if (value != undefined && value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    {
      title: "BTR(TON)",
      field: "WIP_KG_BTR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",

      formatter: function (cell, formatterParams) {
        //BTR = Order Qty - ( FG/1000 + WIP /1000 ) – IF FG AND WIP showing kg in screen
        let cal =
          cell._cell.row.data.ORDER_QNTY -
          (parseFloat(cell._cell.row.data.TOT_FG) +
            parseFloat(cell._cell.row.data.TOT_WIP));
        var value = cal;
        if (value != undefined && value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    {
      title: "Alloted qty (TON)",
      field: "ALLOTED_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined && value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
    },
    {
      title: "BTA RM(TON)",
      field: "WIP_KG_BTA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        //BTA = Order qty - ( FG/1000 + WIP/1000 + ALLOTED)
        let cal =
          cell._cell.row.data.ORDER_QNTY -
          (parseFloat(cell._cell.row.data.TOT_FG) +
            parseFloat(cell._cell.row.data.TOT_WIP) +
            parseFloat(cell._cell.row.data.ALLOTED_QTY));
        var value = cal;
        if (value != undefined && value.length == 5) {
          return value;
        } else {
          var d = parseFloat(value).toFixed(3);
          return d;
        }
      },
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

  const scheduleConfirmColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: 50,
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
      width: 100,
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
      title: "FG Material No",
      field: "FG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG Material Description",
      field: "FG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Material",
      field: "SFG_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG Description",
      field: "SFG_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Material",
      field: "RM_MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RM Description",
      field: "RM_MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Tube Grade",
      field: "TUBE_GRADE",
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
    {
      title: "Work Center",
      field: "WORK_CENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule CRT By",
      field: "SCHD_CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Schedule Date",
      field: "SCHD_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Route",
      field: "ROUTE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const wipScheduleColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: 50,
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
      title: "Length",
      field: "EWI_LENGTH",
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
      title: "Qty(KG)",
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
      title: "Work Center",
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
    {
      title: "Planned Proc",
      field: "LOM_PLANNED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const gVDetailColumns = [
    {
      title: "Allotment Status",
      field: "ALLOT_FLAG",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value == "PARTIAL") {
          cell.getElement().style["color"] = "#ff0000";
          return value;
        } else {
          cell.getElement().style["color"] = "#00cc66";
          return value;
        }
      },
    },
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
    { title: "SFG Material", field: "TMA_SFG_MATNR" },
    {
      title: "Schedule Qty (KG)",
      field: "SCH_QTY",
      bottomCalc: "sum",
      bottomCalcParams: {
        precision: 3,
      },
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
      title: "Priority",
      field: "Priority",
      editor: "number",
      editorParams: {
        min: 0,
        max: 99,
        step: 10,
        elementAttributes: {
          maxlength: "10",
        },
        mask: "999999999",
        selectContents: true,
        verticalNavigation: "table",
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
      field: "REMARKS",
      editor: "input",
      width: 200,
      cellEdited: (cell) => {
        var d = !/[~`!@#$%\^&*()+=\-\[\]\\';,/{}|\\":<>\?]/g.test(
          cell._cell.row.data.remarks
        );
        if (d === true) {
          return cell._cell.row.data.remarks;
        } else {
          alertify.error("@ ; not supported in remarks filed !");
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "txtSFGMat",
      title: "SFG Material",
      width: "200",
      editor: "list",
      visible: false,
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: SFGmaterialDesc,
      },
      formatter: "lookup",
      formatterParams: SFGmaterialDesc,
      defaultValue: SFGmaterialDesc,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Schedule Qty (KG)",
      field: "SCH_QTY",
      editable: editable,
      bottomCalc: "sum",
      visible: false,
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
    { title: "Merge Batch", field: "mBatch", visible: false },
    { title: "Grade", field: "LOM_TDC_ACTL" },
    { title: "Age", field: "AGE" },
    { title: "Order", field: "LOM_ID_ORDER_CUS" },
    { title: "Item", field: "LOM_ID_ORD_ITEM_CUS" },
    { title: "Cust No", field: "LOM_NO_CAST" },
  ];

  const copyTable = (cell) => {
    //mBatch
    var array = getCustomerTable;
    var table = cell._cell.row.table;
    table.replaceData(array);
    setBtchData(array);
  };

  const setScheduleTypeVal = (d) => {
    setValueRadio(d);
    setOpen(false);
    checkBoxChanged();
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getMergeBatchDt = async () => {
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
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD01S002/getMergeBatchDetails";
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
              setMbatchDetailsData([]);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const onClickDeleteMergeDetails = async () => {
    var selectedRowsSchConfirm =
      selectedSchedulingConfirmTable.getSelectedRows();
    if (selectedRowsSchConfirm.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      if (
        selectedRowsSchConfirm[0]._row.data.EWI_CD_STATUS == "WC" ||
        selectedRowsSchConfirm[0]._row.data.EWI_CD_STATUS == "CN"
      ) {
        var url = "/api/LD01S002/getScheduleDelMerge";

        var selectedRows = selectedMergeDt.getSelectedRows();
        if (selectedRows.length == 0) {
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
                getMergeBatchDt();
              } else {
                alertify.error("No Data Found");
              }
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      } else {
        alertify.error("Operation only available for WC And CN Status");
        setLoading(false);
        return;
      }
    });
  };

  const createWipSch = async () => {
    var newData = [];
    var selectedRows = selectedSchedulingWipTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    selectedRows.forEach(function (item) {
      newData.push(item._row.data);
    });
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var data = {
        Plant: wipFilter.plant.value,
        process: wipFilter.process.value,
        dt: newData,
      };

      var url = "api/LD01S002/saveTubeWip";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response) {
              var results = response.data.errorString;
              if (results) {
                if (results.startsWith("Y-")) {
                  setShowSaveMsgSuccess(true);
                  setShowSaveMsgError(false);
                  setSaveMsg(results.replace("Y-", ""));
                  setDisableFiled(true);
                  setEditable(false);
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
    });
  };

  const handleWorkCenterChange = (value) => {
    setSelectedWorkCenter(value);
    if (value) {
    }
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Scheduling for Tubes"
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
                    size="medium"
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
        <DialogActions></DialogActions>
      </BootstrapDialog>
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
                          Plant *{" "}
                        </MDTypography>
                        <ReactSelect
                          id="plant"
                          options={plantList}
                          onChange={(e) => {
                            getProcessList(e);
                            setScheduleConfFilter({
                              ...scheduleConfFilter,
                              plant: e,
                            });
                          }}
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
                          onChange={(e) => {
                            getGorkCenterFilter(e);
                            setScheduleConfFilter({
                              ...scheduleConfFilter,
                              process: e,
                            });
                          }}
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
                      <Grid item xs={1.5} style={{ zIndex: 4 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Work Center{" "}
                        </MDTypography>
                        <ReactSelect
                          id="wCenter"
                          options={wCenter}
                          onChange={handleWorkCenterChange}
                          value={selectedWorkCenter}
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
                      <Grid item xs={1}>
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

                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Plan Production Date *
                        </MDTypography>
                        <DatePicker
                          id="prodPlnDt"
                          value={dateValue}
                          onChange={(date) => setDateValue(date)}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={1.5}>
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
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
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
                {Merge != true && (
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
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
