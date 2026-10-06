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
import AddIcon from "@mui/icons-material/Add";
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
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
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
import MDAlert from "components/MDAlert";
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";

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
export default function LDSC012() {
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(false);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
  };
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState(null);
  const [grd, setGrd] = useState("");
  const [secCdOptions, setSecCdOptions] = useState([]);
  const [pathValOptions, setPathValOptions] = useState([]);
  const [plantList, setPlantList] = useState([]);
  const [CamputeStatus, setCamputeStatus] = useState(false);
  const [empCounter, setEmpCounter] = useState(0);
  const [action, setAction] = useState([]);
  const [selectedAction, setSelectedAction] = React.useState({
    label: "Display",
    value: "D",
  });
  const [selectedRouteMasterData, setSelectedRouteMasterData] = useState([]);
  const [selectedRouteMasterTable, setSelectedRouteMasterTable] =
    useState(null);
  const tableRef = useRef(null);
  const tabulatorInstance = useRef(null);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  //tab1 table
  const [downMatData, setDownMatData] = useState([]);
  const [downMatTable, setDownMatTable] = useState(null);
  //tab2 table
  const [tolThickData, setTolThickData] = useState([]);
  const [tolThickTable, setTolThickTable] = useState(null);
  //tab3 table
  const [tolWtData, setTolWtData] = useState([]);
  const [tolWtTable, setTolWtTable] = useState(null);
  //tab 4 table
  const [fgSpecData, setFgSpecData] = useState([]);
  const [fgSpectable, setFgSpecTable] = useState(null);
  //tab 5 table
  const [slitTdcData, setSlitTdcData] = useState([]);
  const [slitTdcTable, setSlitTdcTable] = useState(null);
  //tab 6 table
  const [rmTdcData, setRmTdcData] = useState([]);
  const [rmTdcTable, setRmTdcTable] = useState(null);

  // Page Load
  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      // getPlantList();
      Promise.all([
        getGroupPlantId(token.accessToken),
        // getCdValue(token.accessToken),
        // getPathVal(token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const downloadExcel = () => { 
    if (!tabulatorInstance.current || tabulatorInstance.current.getData().length === 0) {
      alertify.error("No Data exists in the current table for Downloading");
      return;
    }

    let fileName = "DataExport"; // Default filename
    switch (tabValue) {
      case 0:
        fileName = "Downgrade_Material_Data";
        break;
      case 1:
        fileName = "Tolerance_Thickness_Data";
        break;
      case 2:
        fileName = "Tolerance_Weight_Data";
        break;
      case 3:
        fileName = "Switchable_FG_Spec_Data";
        break;
      case 4:
        fileName = "Switchable_SLT_TDC_Data";
        break;
      case 5:
        fileName = "RM_TDC_Vs_FG_Spec_Data";
        break;
      default:
        fileName = "Unknown_Tab_Data";
    }

    
    const date = new Date();
    const timestamp = date.toISOString().slice(0, 19).replace(/-/g, "").replace(/:/g, "").replace("T", "_");
    fileName = `${fileName}_${timestamp}.xlsx`;

    
    tabulatorInstance.current.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };


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
      var pageName = "LDSC012";

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

  //get Plant id
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

  const getCdValue = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        //adid: serverDetails.PersonalNo,
        //serverDetails.PersonalNo
      };
      var url = "api/LDSC011/getCdValue";
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
            console.log("items", items);
            setSecCdOptions(items);
            // setPlant(items);
            // setSelectedPlant(items[0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getPathVal = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        //adid: serverDetails.PersonalNo,
        //serverDetails.PersonalNo
      };
      var url = "api/LDSC011/getPathVal";
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
            console.log("items", items);
            setPathValOptions(items);
            // setPlant(items);
            // setSelectedPlant(items[0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleActionChange = (value) => {
    setSelectedAction(value);
    setDownMatData([]);
  };

  const ActionType = [
    { label: "Display", value: "D" },
    { label: "Insert", value: "I" },
    { label: "Update", value: "U" },
    { label: "Delete", value: "X" },
  ];

  const isDisplayMode = selectedAction.value === "D";
  const isInsertMode = selectedAction.value === "I";
  const isUpdateMode = selectedAction.value === "U";
  const isDeleteMode = selectedAction.value === "X";

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setDownMatTable([]);
  };

  const updateData = async () => {
    //   if (downMatTable.getSelectedRows()?.length === 0) {
    //     alertify.error('Please Select Rows to Update');
    //     return;
    //   }

    // let tableSelect = downMatTable.getSelectedRows();
    // let selectedData = tableSelect.map((row) => row?._row?.data);

    if (tableRef.current.getSelectedRows()?.length === 0) {
      alertify.error("Please Select Rows to Update");
      return;
    }

    let tableSelect = tableRef.current.getSelectedRows();
    let selectedData = tableSelect.map((row) => row?._row?.data);
    let data = {
      adid: serverDetails.PersonalNo,
      rowData: selectedData,
    };

    const url = "api/LDSC011/UpdateOrderData";

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error(response.statusText);
          //setE1Table([,]);
        } else {
          console.log(response);
          var res = response.data?.rowsAffected;
          console.log("res", res);
          if (res >= 1) {
            console.log("msg", res);
            alertify.success("Row Updation Successfully !!!");
            getOrderData();

            //setE1Table([,]);
          } else {
            alertify.error("Row Updation Failed");
          }
        }
      });
    });
  };

  const InsertData = async () => {
    //console.log('hello')
    let tableSelect = tabulatorInstance.current.getSelectedRows();
    // console.log("tableSelect: ", tableSelect);

    if (tableSelect?.length === 0) {
      alertify.error("Please Select Row!");
      return;
    }

    let selectedData = tableSelect.map((row) => row?._row?.data);
    let data = {
      adid: serverDetails.PersonalNo,
      tabValue: tabValue,
      rowData: selectedData,
    };

    const url = "api/LDSC012/InsertData";

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          // console.log("response:::: ", response?.error?.response?.data?.name);

          alertify.error(response?.error?.response?.data?.name);
          return;
          //setE1Table([,]);
        } else {
          console.log(response);
          var res = response.data?.rowsAffected;
          console.log("res", res);
          if (res >= 1) {
            console.log("msg", res);
            alertify.success("Row Inserted Successfully !!!");
            getTabDisplayData();
          } else {
            alertify.error("Row Insertion Failed");
          }
        }
      });
    });
  };

  const deleteData = async () => {
    // Collect selected rows using Tabulator instance (preferred) or fallback to ref
    let tableSelect = [];
    if (tabulatorInstance.current && typeof tabulatorInstance.current.getSelectedRows === "function") {
      tableSelect = tabulatorInstance.current.getSelectedRows();
    } else if (tableRef.current && typeof tableRef.current.getSelectedRows === "function") {
      tableSelect = tableRef.current.getSelectedRows();
    }

    if (!tableSelect || tableSelect.length === 0) {
      alertify.error("Please Select Rows to Delete");
      return;
    }

    // Tabulator row components expose the row data differently depending on version
    // Try to read _row.data first (common in this codebase), otherwise fall back to getData()
    const selectedData = tableSelect.map((row) => {
      try {
        if (row?._row?.data) return row._row.data;
        if (typeof row.getData === "function") return row.getData();
        return row;
      } catch (e) {
        return row;
      }
    });

    const data = {
      adid: serverDetails.PersonalNo,
      rowData: selectedData,
    };

    const url = "api/LDSC012/DeleteData";

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error(response);
        } else {
          console.log(response);

          // Robustly sum any "rowsAffected" values found in the response (supports nested insertResult/deleteResult)
          const sumRowsAffected = (obj) => {
            if (obj == null) return 0;
            let sum = 0;
            if (typeof obj === "number") return obj;
            if (Array.isArray(obj)) {
              obj.forEach((item) => {
                sum += sumRowsAffected(item);
              });
              return sum;
            }
            if (typeof obj === "object") {
              for (const key in obj) {
                if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
                const val = obj[key];
                if (key === "rowsAffected") {
                  // rowsAffected may be a number or string depending on the backend wrapper
                  if (typeof val === "number") sum += val;
                  else if (typeof val === "string") sum += Number(val) || 0;
                } else {
                  sum += sumRowsAffected(val);
                }
              }
              return sum;
            }
            return 0;
          };

          let total = 0;
          try {
            total = sumRowsAffected(response.data);
          } catch (e) {
            total = 0;
          }

          console.log("delete rowsAffected total:", total, "response.data:", response.data);

          if (total >= 1) {
            alertify.success("Row Deleted Successfully !!!");
            // Use the submit button handler to refresh the table (requested)
            handleSubmitBtn();
          } else {
            alertify.error("Row Deletion Failed");
          }
        }
      }).catch((err) => {
        console.error('Delete API error', err);
        alertify.error('Error deleting rows');
      });
    });
  };
  //   const downloadExcelOrderTableData = () => {
  //     if (downMatData.length === 0) {
  //       alertify.error("No Data exists in table for Downloading");
  //       return;
  //     }
  //     var date = new Date();
  //     var fileName = "LDSC011" + ".xlsx";
  //     downMatTable.download("xlsx", fileName, {
  //       sheetName: "Sheet1",
  //     });
  //   };

  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = String(today.getFullYear()).slice(-2); // Get last two digits of the year
    return `${day}-${month}-${year}`;
  };

  const addEmptyrows = () => {
    let currDate = getFormattedDate();

    if (tabulatorInstance.current) {
      // Use the Tabulator instance
      // The logic for adding a row will depend on the current tab's schema
      let newRow = {};
      if (tabValue === 0) {
        newRow = {
          PLANT: selectedPlant.value ? selectedPlant.value : "",
          MAT_NO: "",
          DWN_MAT_NO: "",
          CATEGRY: "",
          FLAG: "",
          CRT_BY: serverDetails?.PersonalNo ?? "",
          CRT_DT: currDate,
        };
      } else if (tabValue === 1) {
        newRow = {
          CATE: "",
          SPEC: "",
          TOL_MIN: "",
          TOL_MAX: "",
          CRT_BY: serverDetails?.PersonalNo ?? "",
          CRT_DT: currDate,
          UPD_DT: "",
          UPD_BY: "",
        };
      } else if (tabValue === 2) {
        newRow = {
          CATE: "",
          SPEC: "",
          WT_TOL_PER: "",
          CRT_DT: currDate,
          CRT_BY: serverDetails?.PersonalNo ?? "",
          UPD_DT: "",
          UPD_BY: "",
        };
      } else if (tabValue === 3) {
        newRow = {
          RM_TDC: "",
          EQUIV_TDC: "",
          CRT_DT: currDate,
          CRT_BY: serverDetails?.PersonalNo ?? "",
          UPD_DT: "",
          UPD_BY: "",
        };
      } else if (tabValue === 4) {
        newRow = {
          SPEC: "",
          TDC: "",
          FLAG: "",
          REMARKS: "",
          CRT_DT: currDate,
          CRT_BY: serverDetails?.PersonalNo ?? "",
        };
      }
      tabulatorInstance.current.addData([newRow]); // Use addData on the instance
    }
  };

  const handleSubmitBtn = () => {
    getTabDisplayData();
  };

  const getTabDisplayData = () => {
    var url;

    url = "api/LDSC012/getTabDisplayData";
    var data = {
      plant: selectedPlant?.value,
      tabValue: tabValue,
    };
    
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((resp) => {
          if (resp.statusText != "" && resp.statusText != "OK") {
            alertify.error("Error!");
            return;
          } else {
            if (resp.data) {
              if (resp?.data?.length === 0) {
                alertify.error("No Data Found");
                if (tabValue === 0) setDownMatData([]);
                else if (tabValue === 1) setTolThickData([]);
                else if (tabValue === 2) setTolWtData([]);
                // else if (tabValue === 3) setFgSpecData([]);
                else if (tabValue === 3) setSlitTdcData([]);
                else if (tabValue === 4) setRmTdcData([]);
                return;
              } else {
                if (tabValue === 0) setDownMatData(resp.data);
                else if (tabValue === 1) setTolThickData(resp.data);
                else if (tabValue === 2) setTolWtData(resp.data);
                // else if (tabValue === 3) setFgSpecData(resp.data);
                else if (tabValue === 3) setSlitTdcData(resp.data);
                else if (tabValue === 4) setRmTdcData(resp.data);
              }
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  //   TAB1 CODE

  useEffect(() => {
    let columnsToUse;
    let dataToUse;

    switch (tabValue) {
      case 0:
        columnsToUse = downMatTabCol;
        dataToUse = downMatData;
        break;
      case 1:
        columnsToUse = TolThkTabCol;
        dataToUse = tolThickData;
        break;
      case 2:
        columnsToUse = TolWtTabCol;
        dataToUse = tolWtData;
        break;
      case 3:
        columnsToUse = slitTdcTabCol;
        dataToUse = slitTdcData;
        break;
      case 4:
        columnsToUse = rmTdcTabCol;
        dataToUse = rmTdcData;
        break;
      default:
        columnsToUse = "";
        dataToUse = "";
        break;
    }

    if (tableRef.current) {
      if (!tabulatorInstance.current) {
        // Initialize Tabulator only once if it doesn't exist
        tabulatorInstance.current = new Tabulator(tableRef.current, {
          pagination: "local",
          paginationSize: 12,
          height: 400,
          layout: "fitDataFill",
          data: dataToUse,
          columns: columnsToUse,
        });
      } else {
        tabulatorInstance.current.setColumns(columnsToUse);
        tabulatorInstance.current.setData(dataToUse);
      }
    }
    return () => {
      if (tabulatorInstance.current) {
        tabulatorInstance.current.destroy();
        tabulatorInstance.current = null;
      }
    };
  }, [
    tabValue,
    downMatData,
    tolThickData,
    tolWtData,
    fgSpecData,
    slitTdcData,
    rmTdcData,
  ]);

  //TAB 1 COL
  const downMatTabCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mat No",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 0 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 0 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Down Mat No.",
      field: "DWN_MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 0 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 0 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Category",
      field: "CATEGRY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 0 && selectedAction?.value === "I" ? "select" : false,
      editorParams: {
        values: ["SFG_VS_FGDN", "FG_MAT", "SFG_MAT"], // Fixed list of values
        listItemFormatter: function(value, title){
            // Optional: Customize how items appear in the dropdown list
            return title;
        }
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // Keep the styling condition from the original formatter
        if (tabValue === 0 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        } else {
          // Reset styling if the condition is not met, to prevent sticky styles
          cell.getElement().style["background-color"] = ""; // Or your default background
          cell.getElement().style["color"] = ""; // Or your default color
        }
        return value;
      },
    },
    {
      title: "Flag",
      field: "FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 0 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 0 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Created By",
      field: "CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created On",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  //   TAB2 COL
  const TolThkTabCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Category",
      field: "CATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 1 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 1 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Spec",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 1 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 1 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Tol Min",
      field: "TOL_MIN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 1 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 1 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Tol Max",
      field: "TOL_MAX",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 1 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 1 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Created On",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated On",
      field: "UPD_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated By",
      field: "UPD_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  //   TAB3 COL
  const TolWtTabCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Category",
      field: "CATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 2 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 2 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Spec",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 2 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 2 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Wt Tol",
      field: "WT_TOL_PER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 2 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 2 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Created On",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated On",
      field: "UPD_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated By",
      field: "UPD_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  //   TAB4 COL
  const slitTdcTabCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Rm TDC",
      field: "RM_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 3 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 3 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Equiv TDC",
      field: "EQUIV_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 3 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 3 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Created On",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated On",
      field: "UPD_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Updated By",
      field: "UPD_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  //   TAB5 COL
  const rmTdcTabCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Spec",
      field: "SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 4 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 4 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "TDC",
      field: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 4 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 4 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Flag",
      field: "FLAG",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 4 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 4 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: tabValue === 4 && selectedAction?.value === "I" ? "input" : "",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (tabValue === 4 && selectedAction?.value === "I") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
    },
    {
      title: "Created On",
      field: "CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Created By",
      field: "CRT_BY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Common"
        page="Maintain Master Data"
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
            <Grid container spacing={1}>
              {/* <Grid item xs={12}> */}

              <Grid item xs={12}>
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
                      <Grid item xs={2.5} style={{ zIndex: 5 }}>
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
                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Action*
                        </MDTypography>
                        <ReactSelect
                          options={ActionType}
                          onChange={(e) => {
                            handleActionChange(e);
                          }}
                          value={selectedAction}
                        />
                      </Grid>

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => handleSubmitBtn(true)}
                        >
                          {" "}
                          Submit{" "}
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <AppBar position="static">
                  <Tabs
                    // orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                    // indicatorColor="primary"
                    // indicator={(props) => (
                    //   <div
                    //     style={{
                    //       backgroundColor: "primary",
                    //       height: 3,
                    //       borderRadius: 3,
                    //       marginLeft: "auto",
                    //       marginRight: "auto",
                    //       left: 0,
                    //       right: 0,
                    //     }}
                    //   />
                    // )}
                  >
                    <Tab label="Downgrade material" icon={<TabIcon />} />
                    <Tab label="Tolerance Thick" icon={<TabIcon />} />
                    <Tab label="Tolerance Wt" icon={<TabIcon />} />
                    {/* <Tab label="Switchable FG Spec" icon={<TabIcon />} /> */}
                    <Tab label="Switchable SLT TDC" icon={<TabIcon />} />
                    <Tab label="RM TDC Vs FG Spec" icon={<TabIcon />} />
                  </Tabs>
                </AppBar>
              </Grid>

              <Grid item xs={12}>
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
                          Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => updateData()}
                            disabled={isDisplayMode || !isUpdateMode}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Add">
                          <IconButton
                            color="white"
                            onClick={() => addEmptyrows(true)}
                            disabled={isDisplayMode || !isInsertMode}
                          >
                            <LibraryAddIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="white"
                            onClick={() => deleteData(true)}
                            disabled={isDisplayMode || !isDeleteMode}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Insert">
                          <IconButton
                            color="white"
                            onClick={() => InsertData(true)}
                            disabled={isDisplayMode || !isInsertMode}
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                          <Tooltip title="Download">
                            <IconButton
                              color="white"
                              onClick={() => downloadExcel()}
                            >
                              <DownloadForOfflineIcon />
                            </IconButton>
                          </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
                <Card style={{ marginTop: "2rem" }}>
                  <MDBox px={3} py={2}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    ></Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        {/* The div where Tabulator will render. This MUST always be in the DOM. */}
                        {/* We use a ref here for more direct access, but ID would also work if unique and always present */}
                        <div id="tabtable" ref={tableRef} />

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to{" "}
                          {/* Dynamically show length based on the active data source */}
                          {tabValue === 0
                            ? downMatData.length
                            : tabValue === 1
                            ? tolThickData.length
                            : 0}{" "}
                          of{" "}
                          {tabValue === 0
                            ? downMatData.length
                            : tabValue === 1
                            ? tolThickData.length
                            : 0}{" "}
                          entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
                {/* {tabValue == 0 && (
                  <>
                    <Card style={{ marginTop: "2rem" }}>
                      <MDBox px={3} py={2}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="center"
                        ></Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            {downMatData?.length > 0 && <div id="tabtable" />}

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {downMatData.length} of{" "}
                              {downMatData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )}
                {tabValue == 1 && (
                  <>
                    <Card style={{ marginTop: "2rem" }}>
                      <MDBox px={3} py={2}>
                        <Grid
                          container
                          direction="row"
                          justifyContent="flex-end"
                          alignItems="center"
                        ></Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            {tolThickData?.length > 0 && <div id="tabtable" />}

                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {tolThickData.length} of{" "}
                              {tolThickData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                )} */}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
