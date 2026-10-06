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
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BackupIcon from "@mui/icons-material/Backup";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import Button from "@mui/material/Button";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
// Data


import FileSaver from "file-saver";
import MDAlert from "components/MDAlert";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import { ExcelRenderer, OutTable } from "react-excel-renderer";
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
import { GetAuthorization } from "utils";
import DeleteIcon from "@mui/icons-material/Delete";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";

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

export default function LDSC006() {
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState(null);
  const [isRestricted, setRestricted] = React.useState(false);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const [lengthMasterDt, setlengthMasterDt] = useState([]);
  const [lengthMasterDtStore, setlengthMasterDtStore] = useState([]);
  const [selectedBOMData, setSelectedBOMData] = useState([]);
  const [selectedBOMTable, setSelectedBOMTable] = useState(null);
  const [selectedRouteMasterData, setSelectedRouteMasterData] = useState([]);
  const [selectedRouteMasterTable, setSelectedRouteMasterTable] =
    useState(null);
  const [selectedFilterAction, setSelectedFilterAction] = React.useState({
    value: "CD",
    label: "Create Draft",
  });
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [excelValue, setExcelValue] = React.useState(null);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("Choose wisely");

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);

      Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (lengthMasterDt && lengthMasterDt.length > 0) {
      setSelectedBOMTable(
        new Tabulator("#lengthDtsplay", {
          maxHeight: 500,
          layout: "fitDataFill",
          data: lengthMasterDt,
          columns: displayColumns,
        })
      );
    }
  }, [tabValue, lengthMasterDt]);

  useEffect(() => {
    if (excelValue && excelValue.length > 0) {
      setSelectedRouteMasterTable(
        new Tabulator("#routeMasterTable", {
          layout: "fitDataFill",
          maxHeight: 400,
          data: excelValue,
          columns: routeMasterColumns,
        })
      );
    }
  }, [tabValue, excelValue]);

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
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LDSC006";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );

      if (authDetails) {
        debugger;
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
          resolve();
        });
    });
  };

  const getLengthMasterData = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSC006/getLengthMasterData";
      let data = {
        adid: serverDetails.PersonalNo,
        plant: selectedPlant.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setlengthMasterDt([,]);
              setLoading(false);
            }
            var rows = [];
            for (var i in response.data) {
              var rowdata = response.data[i];
              rows.push({
                rowId: i,
                TLM_CD_EPA: rowdata.TLM_CD_EPA,
                TLM_SFG_OD: rowdata.TLM_SFG_OD
                  ? rowdata.TLM_SFG_OD.toFixed(3)
                  : 0,
                TLM_FG_ID: rowdata.TLM_FG_ID ? rowdata.TLM_FG_ID.toFixed(3) : 0,
                TLM_FG_OD: rowdata.TLM_FG_OD ? rowdata.TLM_FG_OD.toFixed(3) : 0,
                TLM_FG_THK: rowdata.TLM_FG_THK
                  ? rowdata.TLM_FG_THK.toFixed(3)
                  : 0,
                TLM_FG_LENGTH: rowdata.TLM_FG_LENGTH
                  ? rowdata.TLM_FG_LENGTH.toFixed(3)
                  : 0,
                TLM_SFG_THK: rowdata.TLM_SFG_THK
                  ? rowdata.TLM_SFG_THK.toFixed(3)
                  : 0,
                TLM_SFG_LENGTH: rowdata.TLM_SFG_LENGTH
                  ? rowdata.TLM_SFG_LENGTH.toFixed(3)
                  : 0,
                TLM_TS_CREATE: new Date(rowdata.TLM_TS_CREATE)
                  .toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(/ /g, " "),
                TLM_TS_CRT_USER: rowdata.TLM_TS_CRT_USER
                  ? rowdata.TLM_TS_CRT_USER
                  : 0,
                TLM_TS_UPDATE: new Date(rowdata.TLM_TS_UPDATE)
                  .toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(/ /g, " "),
                TLM_TS_UPD_USER: rowdata.TLM_TS_UPD_USER,
              });
            }
            setlengthMasterDt(rows);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  var updateIcon = (cell, formatterParams, onRendered) => {
    return "<i class='fa-solid fa-floppy-disk' style='color:#49a3f1'></i>";
  };

  var deleteIcon = (cell, formatterParams, onRendered) => {
    return "<i class='fa-solid fa-trash' style='color:#49a3f1'></i>";
  };

  const displayColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
    },
    {
      title: "Plant",
      field: "TLM_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG OD",
      field: "TLM_SFG_OD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        return value;
      },
    },
    {
      title: "FG OD",
      field: "TLM_FG_OD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG ID",
      field: "TLM_FG_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "FG THK",
      field: "TLM_FG_THK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG LENGTH",
      field: "TLM_FG_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SFG THK",
      field: "TLM_SFG_THK",
      headerFilter: "input",
      editor: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "SFG LENGTH",
      field: "TLM_SFG_LENGTH",
      headerFilter: "input",
      editor: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Record Created On",
      field: "TLM_TS_CREATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Record Created By",
      field: "TLM_TS_CRT_USER",
      align: "center",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Record Updated On",
      field: "TLM_TS_UPDATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Record Updated By",
      field: "TLM_TS_UPD_USER",
      align: "center",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const updateLengthData = async (newToken = false) => {
    var selectedRows = selectedBOMTable.getSelectedRows();
    var newData = [];
    selectedRows.forEach(function (item) {
      var start = new Date();
      var upDt = start
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-").replace("Sept", "Sep");

      item._row.data.TLM_TS_UPDATE = upDt;
      newData.push(item._row.data);
    });

    if (newData.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSC006/updateLengthData";
      let data = {
        adid: serverDetails.PersonalNo,
        dt: newData,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data != 0) {
              
              alertify.success(response.data + "Row Updated Successfully !!!");
              getLengthMasterData();
              setLoading(false);
            } else {
              setLoading(false);
              alertify.error("Error Update");
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const deleteLengthData = async () => {
    var selectedRows = selectedBOMTable.getSelectedRows();
    var newData = [];
    selectedRows.forEach(function (item) {
      var start = new Date();
      var upDt = start
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, "-").replace("Sept", "Sep");

      item._row.data.TLM_TS_UPDATE = upDt;
      newData.push(item._row.data);
    });

    if (newData.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSC006/deleteLengthData";
      let data = {
        adid: serverDetails.PersonalNo,
        dt: newData,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data != 0) {
              
              alertify.success(response.data + "Row Deleted Successfully !!!");
              setLoading(false);
              getLengthMasterData();
            } else {
              setLoading(false);
              alertify.error("Error Delete");
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const updatePerviewData = async (newToken = false) => {
    
    var selectedRows = selectedRouteMasterTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("No rows selected");
      setLoading(false);
      return;
    }

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var newData = [];
      selectedRows.forEach(function (item) {
        newData.push(item._row.data);
      });

      var url = "api/LDSC006/perviewUpdateData";
      let data = {
        adid: serverDetails.PersonalNo,
        dt: newData,
        plant: selectedPlant.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.rowsAffSuc != 0) {
              alertify.success(
                response.data.rowsAffSuc + " Row Insert Successfully !!!"
              );
              setLoading(false);
            } else if (response.data.failRowSL.length != 0) {
              setLoading(false);
              alertify.error(
                response.data.failRowSL.toString() + " Serial no error insert"
              );
            } else {
              setLoading(false);
              alertify.error("Error");
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const routeMasterColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
    },
    {
      title: "Serial No",
      field: "SL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "FG OD",
      field: "TLM_FG_OD",
      headerFilter: "input",

      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "FG ID",
      field: "TLM_FG_ID",
      headerFilter: "input",

      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "SFG OD",
      field: "TLM_SFG_OD",
      headerFilter: "input",

      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        return value;
      },
    },

    {
      title: "FG THK",
      field: "TLM_FG_THK",
      headerFilter: "input",

      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "FG LENGTH",
      field: "TLM_FG_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        return value;
      },
    },
    {
      title: "SFG THK",
      field: "TLM_SFG_THK",
      headerFilter: "input",

      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();

        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
    {
      title: "SFG LENGTH",
      field: "TLM_SFG_LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
    },
  ];

  const downloadExcelBOMTableData = () => {
    if (selectedBOMData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSC006 " + date.toString() + ".xlsx";
    selectedBOMTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const downloadExcelRouteMasterTableData = () => {
    if (selectedRouteMasterData.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSC006 " + date.toString() + ".xlsx";
    selectedRouteMasterTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleCapture = async ({ target }) => {
    setExcelValue([,]);
    setSelectedFile(target.files[0]);
    ExcelRenderer(target.files[0], (err, resp) => {
      var rows = [];
      if (err) {
        alertify.error(err);
      } else {
        for (var i in resp.rows) {
          if (i == "0") {
            continue;
          }
          var rowdata = resp.rows[i];
          rows.push({
            SL: parseInt(i),
            PLANT: selectedPlant.value,
            TLM_SFG_OD: !isNaN(rowdata[0]) ? rowdata[0].toFixed(3) : 0,
            TLM_FG_OD: !isNaN(rowdata[1]) ? rowdata[1].toFixed(3) : 0,
            TLM_FG_ID: !isNaN(rowdata[2]) ? rowdata[2].toFixed(3) : 0,
            TLM_FG_THK: !isNaN(rowdata[3]) ? rowdata[3].toFixed(3) : 0,
            TLM_FG_LENGTH: !isNaN(rowdata[4]) ? rowdata[4].toFixed(3) : 0,
            TLM_SFG_THK: !isNaN(rowdata[5]) ? rowdata[5].toFixed(3) : 0,
            TLM_SFG_LENGTH: !isNaN(rowdata[6]) ? rowdata[6].toFixed(3) : 0,
          });
        }
        
        setExcelValue(rows);
      }
    });
  };

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
  };

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(" ");
    setError(false);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Common"
        page="Maintain Multiple Length Master"
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
              {/* <Grid item xs={12}> */}

              <Grid item xs={24}>
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
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                      {tabValue == 0 && (
                        <>
                          <Grid item xs={3} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Plant*{" "}
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plant}
                              onChange={handlePlantChange}
                              value={selectedPlant}
                            />
                          </Grid>

                          <Grid item xs={1}>
                            <MDButton
                              style={{ marginTop: "1.5rem" }}
                              size="small"
                              color="info"
                              onClick={() => getLengthMasterData(true)}
                            >
                              {" "}
                              Submit{" "}
                            </MDButton>
                          </Grid>
                        </>
                      )}

                      {tabValue == 1 && (
                        <>
                          {/* <Grid item xs={2}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Plant*{" "}
                            </MDTypography>
                            <ReactSelect
                              id="plant"
                              options={plant}
                              onChange={handlePlantChange}
                              value={selectedPlant}
                            />
                          </Grid> */}

                          <Grid item xs={1}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="midium"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Step 1.{" "}
                            </MDTypography>

                            <MDTypography
                              fontWeight="regular"
                              fontSize="midium"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Step 2.{" "}
                            </MDTypography>
                          </Grid>

                          <Grid item xs={3}>
                            <MDButton
                              size="small"
                              variant="text"
                              color="info"
                              href={"files/MultipleLengthSample.xlsx"}
                              download={
                                "MultipleLengthSample " + new Date().toString()
                              }
                            >
                              {" "}
                              Download Excel{" "}
                            </MDButton>

                            <div>
                              <input
                                inputprops={{
                                  accept:
                                    ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                                }}
                                id="faceImage"
                                type="file"
                                onChange={handleCapture}
                              />
                            </div>
                          </Grid>

                          <Grid item xs={4}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="midium"
                              textTransform="capitalize"
                              variant="h6"
                              color={"info"}
                              noWrap
                            >
                              Note : Selected file to upload in the same formate
                              as download in ster 2 above{" "}
                            </MDTypography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              {/* create tabs */}
              <Grid item xs={6}>
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="Display" icon={<TabIcon />} />
                    <Tab label="Maintain" icon={<TabIcon />} />
                  </Tabs>
                </AppBar>
              </Grid>
              {/* tabs controlled data */}
              <Grid item xs={12}>
                {tabValue == 0 && (
                  <>
                    <Card style={{ marginTop: "0.5rem" }}>
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
                              Display Length Master
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Update">
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => updateLengthData()}
                              >
                                <SystemUpdateAltIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => deleteLengthData()}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadExcelBOMTableData()}
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
                            <div id="lengthDtsplay" />

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {lengthMasterDt.length} of{" "}
                              {lengthMasterDt.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
                {tabValue == 1 && (
                  <>
                    <Card style={{ marginTop: "0.5rem" }}>
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
                              Preview Excel data
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}>
                            <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() =>
                                  downloadExcelRouteMasterTableData()
                                }
                              >
                                <DownloadForOfflineIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Save" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => updatePerviewData(true)}
                              >
                                <SaveIcon />
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
                            <div id="routeMasterTable" />

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            ></p>
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
