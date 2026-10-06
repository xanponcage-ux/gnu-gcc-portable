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
import AddIcon from '@mui/icons-material/Add';
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
export default function LDSC011() {
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

  const [selectedOrderData, setSelectedOrderData] = useState([]);
  const [selectedOrderTable, setSelectedOrderTable] = useState(null);
  const [empCounter, setEmpCounter] = useState(0);
  const [action, setAction] = useState([]);
  const [selectedAction, setSelectedAction] = React.useState({ label: "Display", value: "D" });
  const [selectedRouteMasterData, setSelectedRouteMasterData] = useState([]);
  const [selectedRouteMasterTable, setSelectedRouteMasterTable] =
    useState(null);
    const tableRef = useRef(null);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
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
        getCdValue(token.accessToken),
        getPathVal(token.accessToken)
      ]).finally(() => {
        setLoading(false);
      });
    });
  }

  useEffect(() => {
    fetchData();
    
  }, []);

  // useEffect(() => {
  //   let OrdCol;
  //   let tableData = [];

  //   if (selectedAction.value === "D") {
  //     OrdCol = orderColumns;
  //     tableData = selectedOrderData;
  //   } else if (selectedAction.value === "U") {
  //     OrdCol = orderColUpdation;
  //     tableData = selectedOrderData;
  //   } else {
  //     OrdCol = orderColInsert;
  //     tableData = []; // Initialize with empty data for Insert
  //   }

  //   if (tableRef.current) {
  //     tableRef.current.destroy();
  //   }

  //   if (tableData && tableData.length > 0 || selectedAction.value === "I") {
  //     const dataWithId = tableData.map((row, index) => ({
  //       id: index + 1,
  //       ...row,
  //     }));

  //     tableRef.current = new Tabulator("#orderTable", {
  //       data: dataWithId,
  //       columns: OrdCol,
  //       layout: "fitColumns",
  //       pagination: "local",
  //       paginationSize: 10,
  //       rowClick: function (e, row) {
  //         alert("Row " + row.getData().id + " Clicked!!!!");
  //       },
  //       idField: "id",
  //     });
  //   }
  // }, [selectedOrderData, selectedAction]);


  useEffect(() => {
    let OrdCol;
    console.log("Action",selectedAction.value)
    if (selectedAction.value === "D" ) {
      OrdCol = orderColumns;
    } else if (selectedAction.value === "U") {
      OrdCol = orderColUpdation;
     } 
     else if (selectedAction.value === "X") {
      OrdCol = orderColDeletion;
     } 
    else {
      OrdCol = orderColInsert;
    }
    

    if (selectedOrderData && selectedOrderData.length > 0) {
      if (tableRef.current) {
        tableRef.current.destroy();
      }
      
      const table = new Tabulator("#orderTable", {
        pagination: "local",
        paginationSize: 12,
        height: 400,
        layout: "fitDataFill",
        data: selectedOrderData,
        columns: OrdCol,
      });
      tableRef.current = table;
    }
  }, [selectedOrderData, selectedAction]);

  

  useEffect(() => {
    if (selectedPlant !== null) {
      // getBOMData();
    }
  }, [tabValue, selectedPlant]);

  //   Auththorization

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
      var pageName = "LDSC011";

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
            console.log("items",items)
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
            console.log("items",items)
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
    setSelectedAction(value)
    setSelectedOrderData([]);
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

  // Table Columns

  const orderColumns = [
    
    {
      title: "Plant",
      field: "OPD_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Path",
      field: "OPD_CD_PATH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Spec",
      field: "OPD_ORD_GRD",
      headerFilter: "input",
      hozAlign: "center",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Surface Cond",
      field: "OPD_SUR_COND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Geometric",
      field: "OPD_TUB_GEO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "End Finish",
      field: "OPD_END_FINISH",
      headerFilter: "input",
      //hozAlign: "right",
      headerFilterPlaceholder: "search...",
      
    },
    {
        title: "Created By",
        field: "OPD_CRT_BY",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Created On",
        field: "OPD_CRT_DT",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Updated By",
        field: "OPD_UPD_BY",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Updated On",
        field: "OPD_UPD_ON",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
      title: "Prog Id",
      field: "OPD_PROG_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sec cd",
      field: "OPD_SEC_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
    title: "Sec Desc",
    field: "OPR_SEC_DESC",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    }
    

  ];

  const orderColDeletion = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
  },
    {
      title: "Plant",
      field: "OPD_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Path",
      field: "OPD_CD_PATH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Spec",
      field: "OPD_ORD_GRD",
      headerFilter: "input",
      hozAlign: "center",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Surface Cond",
      field: "OPD_SUR_COND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "Geometric",
      field: "OPD_TUB_GEO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      
    },
    {
      title: "End Finish",
      field: "OPD_END_FINISH",
      headerFilter: "input",
      //hozAlign: "right",
      headerFilterPlaceholder: "search...",
      
    },
    {
        title: "Created By",
        field: "OPD_CRT_BY",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Created On",
        field: "OPD_CRT_DT",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Updated By",
        field: "OPD_UPD_BY",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Updated On",
        field: "OPD_UPD_ON",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
      title: "Prog Id",
      field: "OPD_PROG_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sec cd",
      field: "OPD_SEC_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
    title: "Sec Desc",
    field: "OPR_SEC_DESC",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    }
    

  ];

  const orderColInsert = [
    {
        formatter: "rowSelection",
        titleFormatter: "rowSelection",
        hozAlign: "center",
        headerSort: false,
    },
    {
      title: "Plant",
      field: "OPD_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input"
    },
   {
      title: "Path",
      field: "OPD_CD_PATH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        values: pathValOptions.reduce((obj, item) => {
          obj[item.value] = item.label;
          return obj;
        }, {}),
      },
    },
    {
      title: "Spec",
      field: "OPD_ORD_GRD",
      headerFilter: "input",
      hozAlign: "center",
      headerFilterPlaceholder: "search...",
      editor : "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Surface Cond",
      field: "OPD_SUR_COND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Geometric",
      field: "OPD_TUB_GEO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor : "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "End Finish",
      field: "OPD_END_FINISH",
      headerFilter: "input",
      //hozAlign: "right",
      headerFilterPlaceholder: "search...",
      editor : "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    
    {
      title: "ProgId",
      field: "OPD_PROG_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "Sec cd",
      field: "OPD_SEC_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        values: secCdOptions.reduce((obj, item) => {
          
          obj[item.label] = item.label; 
          return obj;
        }, {}),
      },
      cellEdited: (cell) => {
       
        const row = cell.getRow();
        const selectedLabel = cell.getValue(); 
        console.log("row",row)
        console.log("selectedLabel",selectedLabel)
        
        const selectedOption = secCdOptions.find(
          (option) => option.label === selectedLabel
        );
        console.log(selectedOption)

        if (selectedOption) {
          row.update({ OPR_SEC_DESC: selectedOption.value });
          
          
        }
      },
    },
    {
    title: "Sec Desc",
    field: "OPR_SEC_DESC",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    formatter: function (cell, formatterParams) {
      var value = cell.getValue();
      cell.getElement().style["background-color"] = "#DA8EE7";
      cell.getElement().style["color"] = "#FFFFFF";
      return value;
    },
    width : 200
    //editor : "input"
    }
    

  ];

  const addEmptyrows = () => {
    if (tableRef.current) {
      const newRow = {
        OPD_CD_EPA: selectedPlant.value ? selectedPlant.value : "",
        OPD_CD_PATH: "",
        OPD_ORD_GRD: "",
        OPD_SUR_COND: "",
        OPD_TUB_GEO: "",
        OPD_END_FINISH: "",
        OPD_PROG_ID: "LDSC011" ,
      };
      tableRef.current.addData([newRow]);
    }
  };

  const orderColUpdation = [
    {
        formatter: "rowSelection",
        titleFormatter: "rowSelection",
        hozAlign: "center",
        headerSort: false,
    },
    {
      title: "Plant",
      field: "OPD_CD_EPA",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "Path",
      field: "OPD_CD_PATH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        values: pathValOptions.reduce((obj, item) => {
          obj[item.value] = item.label;
          return obj;
        }, {}),
      },
    },
    {
      title: "Spec",
      field: "OPD_ORD_GRD",
      headerFilter: "input",
      hozAlign: "center",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "Surface Cond",
      field: "OPD_SUR_COND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"

    },
    {
      title: "Geometric",
      field: "OPD_TUB_GEO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
      title: "End Finish",
      field: "OPD_END_FINISH",
      headerFilter: "input",
      //hozAlign: "right",
      headerFilterPlaceholder: "search...",
      //editor : "input"
    },
    {
        title: "Created By",
        field: "OPD_CRT_BY",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Created On",
        field: "OPD_CRT_DT",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Updated By",
        field: "OPD_UPD_BY",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
        title: "Updated On",
        field: "OPD_UPD_ON",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
    },
    {
      title: "Prog Id",
      field: "OPD_PROG_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Sec cd",
      field: "OPD_SEC_CD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "select", 
      editorParams: {
        values: secCdOptions.reduce((obj, item) => {
          
          obj[item.label] = item.label; 
          return obj;
        }, {}),
      },
      cellEdited: (cell) => {
       
        const row = cell.getRow();
        const selectedLabel = cell.getValue(); 
        console.log("row",row)
        console.log("selectedLabel",selectedLabel)
        
        const selectedOption = secCdOptions.find(
          (option) => option.label === selectedLabel
        );
        console.log(selectedOption)

        if (selectedOption) {
          row.update({ OPR_SEC_DESC: selectedOption.value });
          
          
        }
      },
    },
    {
    title: "Sec Desc",
    field: "OPR_SEC_DESC",
    headerFilter: "input",
    headerFilterPlaceholder: "search...",
    //editor : "input"
    }

    

  ];
 

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setSelectedOrderTable([]);
  };

  const getOrderData = () => {
    var url;

    url = "api/LDSC011/getOrderData";
    var data = {
      plant: selectedPlant?.value,
      OrdGrd: grd ? grd : ""
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
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("No Data Found");
          } else {
            
              if (response.data.length == 0) {
                alertify.error("No Data Found");
                setSelectedOrderData([]);
              } else {
                setSelectedOrderData(response.data);
                
              }
             
            }
          
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };


  const updateData = async () => {
      
    
  //   if (selectedOrderTable.getSelectedRows()?.length === 0) {
  //     alertify.error('Please Select Rows to Update');
  //     return;
  //   }
    
  // let tableSelect = selectedOrderTable.getSelectedRows();
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

  
   const url =  "api/LDSC011/UpdateOrderData";
    
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
            
            alertify.error(response.statusText);
            //setE1Table([,]);
          } else {
            console.log(response)
            var res= response.data?.rowsAffected
            console.log("res",res)
            if (res >= 1 ) {
              console.log("msg",res)
              alertify.success("Row Updation Successfully !!!");
              getOrderData()
              
              //setE1Table([,]);
            } else {
              
                alertify.error("Row Updation Failed");

            }
          }
        })
        
      
    });
  };

  const InsertData = async () => {
      
    //console.log('hello')
    let tableSelect = tableRef.current.getSelectedRows();
    let selectedData = tableSelect.map((row) => row?._row?.data);
    let data = {
         adid: serverDetails.PersonalNo,
         rowData: selectedData,
    };
  
    
  
   const url =  "api/LDSC011/InsertOrderData";
    
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
            
            alertify.error(response);
            //setE1Table([,]);
          } else {
            console.log(response)
            var res= response.data?.rowsAffected
            console.log("res",res)
            if (res >= 1 ) {
              console.log("msg",res)
              alertify.success("Row Inserted Successfully !!!");
              getOrderData()

            } else {
              
                alertify.error("Row Insertion Failed");

            }
          }
        })
        
      
    });
  };

  const deleteData = async () => {
      
    //console.log('hello')
    let tableSelect = tableRef.current.getSelectedRows();
    let selectedData = tableSelect.map((row) => row?._row?.data);
    let data = {
         adid: serverDetails.PersonalNo,
         rowData: selectedData,
    };
  
    
  
   const url =  "api/LDSC011/DeleteOrderData";
    
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
            
            alertify.error(response);
            //setE1Table([,]);
          } else {
            console.log(response)
            var res= response.data?.rowsAffected
            console.log("res",res)
            if (res >= 1 ) {
              console.log("msg",res)
              alertify.success("Row Deleted Successfully !!!");
              getOrderData()

            } else {
              
                alertify.error("Row Deletion Failed");

            }
          }
        })
        
      
    });
  };
//   const downloadExcelOrderTableData = () => {
//     if (selectedOrderData.length === 0) {
//       alertify.error("No Data exists in table for Downloading");
//       return;
//     }
//     var date = new Date();
//     var fileName = "LDSC011" + ".xlsx";
//     selectedOrderTable.download("xlsx", fileName, {
//       sheetName: "Sheet1",
//     });
//   };

  

  return (
    // <h1>Hello</h1>
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Common"
        page="Maintain Order Path"
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
                      <Grid item xs={2} style={{ zIndex: 5 }}>
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
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Order Grd*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="grd"
                          value={grd}
                          onChange={(e) => {
                            setGrd(e.target.value)
                            
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
                          onClick={() => getOrderData(true)}
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
               
                  <>
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
                              Order
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}>
                          <Tooltip title="Update">
                                <IconButton color="white"  
                                            onClick={() => updateData()}
                                            disabled={isDisplayMode || !isUpdateMode} >
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
                          
                          
                            {/* <Tooltip title="Download">
                              <IconButton
                                color="white"
                                onClick={() => downloadExcelOrderTableData()}
                              >
                                <DownloadForOfflineIcon />
                              </IconButton>
                            </Tooltip> */}
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
                          {selectedOrderData?.length > 0 && <div id="orderTable" />}
                            {/* <ReactTabulator
                                                    id="getCustomerTable"
                                                    ref={ref => { customerTable = ref }}
                                                    columns={inventoryInfoColumn} data={getCustomerTable} options={options}
                                                /> */}
                            <br />
                            <p
                              color="black"
                              style={{
                                color: "black",
                                paddingLeft: "1rem",
                                marginTop: "-1rem",
                              }}
                            >
                              Showing 1 to {selectedOrderData.length} of{" "}
                              {selectedOrderData.length} entries
                            </p>
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </>
                
                
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}


