import React, { useEffect, useState, useRef, forwardRef } from "react";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import FormControlLabel from "@mui/material/FormControlLabel";
import MDButton from "components/MDButton";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import MDAlert from "@mui/material/Alert";
import { GetAuthorization } from "utils";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../tabulatorCss.scss";

export default function LD08S002() {
  const [state, setState] = React.useState({
    checkedA: true,
  });
  const { columns, rows } = authorsTableData();
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [RMList, setRMList] = useState([]);
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [status, setStatus] = useState({ label: "WD", value: "WD" });
  const [pipeCreationTableData, setPipeCreationTableData] = useState([]);
  const [pipeCreationTable, setPipeCreationTable] = useState(null);
  const decisionList = [
    { label: "Release With Order", value: "Release With Order", id: 1 },
    { label: "Release without Order", value: "Release without Order", id: 2 },
  ];
  const [matNoList, setMatNoList] = useState([]);

  const handleStatusChange = (value) => {
    setLoading(true);
    console.log(value);
    setStatus(value);
    setRMList([]);
    setPipeNoList([]);
    setPipeCreationTableData([]);
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([
          getRmList(data.accessToken, value.value),
          // getPipeNoList(data.accessToken, value.value),
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };

  const fetchDetails = () => {
    setLoading(true);
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([
          getRmList(data.accessToken, "WD"),
          getPipeNoList(data.accessToken, "WD"),
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };
  //page load
  useEffect(() => {
    fetchDetails();
  }, []);

  const downloadExcelcustomerTableData = () => {
    if (selectedEndFacingTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedEndFacingTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD08S002" + ".xlsx";

    window.XLSX = XLSX;

    selectedEndFacingTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

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
      var pageName = "LD08S002";
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

  const getRmList = async (accessToken, status) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      status: status,
      pipeno: pipeno ? pipeno : "",
    };
    var url = "api/LD08S002/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_PAR_COIL_NO;
            obj.value = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });
          setRMList(items);
          Promise.all([getPipeNoList("", accessToken, status)]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getPipeNoList = async (value, accessToken, status) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: status,
      rmBatch: value.value ? value.value : "",
    };
    var url = "api/LD08S002/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response?.statusText != "" && response?.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response?.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            items.push(obj);
          });

          setPipeNoList(items);
          if (items.length > 0) {
            setPipeNo(items[0]);
          } else {
            setPipeNo(null);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getMaterialNo = async (decision) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      setLoading(true);
      let data = {
        type: decision,
        pipeid: pipeno.value || "",
      };
      var url = "api/LD08S002/getMaterialNo";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            console.log(response.data);
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row.TDM_DWN_MATNR_NO;
              obj.value = row.TDM_DWN_MATNR_NO;
              items.push(obj);
            });
            console.log("items: ", items);
            setMatNoList(items);
            console.log("matNoList: ", matNoList);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleRMBatchChange = (value) => {
    setrmBatchId(value);
    setPipeCreationTableData([]);
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([
          getPipeNoList(value, data.accessToken, status.value),
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setPipeCreationTableData([]);
  };

  const handleClearAll = (newToken = false) => {
    setrmBatchId(null);
    setPipeNo(null);
    setRMList([]);
    setPipeNoList([]);
    setPipeCreationTableData([]);
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([getRmList(data.accessToken, status.value)]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };

  const fillData = async () => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      if (!rmBatchId && !(pipeno && pipeno?.value)) {
        alertify.error("Please Select either RM Batch or Pipe ID");
        return;
      }

      // if (!pipeno || pipeno?.value === "") {
      //   alertify.error("Pipe Id cannot be blank");
      //   return;
      // }
      const dummyData = [];
      let data = {
        RM_BATCH: rmBatchId?.value || "",
        STATUS: status?.value,
      };
      if (pipeno && pipeno?.value) {
        data.PIPE_NO = pipeno?.value;
      } else {
        data.PIPE_NO = "";
      }

      let loopCounter = 1;

      const url1 = "api/LD08S002/getPipeInfo";
      const info = await axiosAPI.post(url1, data, defaultOptions);
      if (info?.status !== 200 || !info?.data || !info?.data[0]) {
        alertify.error("Failed to retrieve PIPE Info.");
        setLoading(false);
        return; // Stop execution if API call fails
      }
      loopCounter = info?.data?.length;
      console.log(loopCounter);
      let pipeInfo = info?.data[0];

      for (let i = 0; i < loopCounter; i++) {
        pipeInfo = info.data[i];
        const data = {
          LOM_ID_BATCH: info?.data[i]?.LOM_ID_BATCH,
          CURR_PROC: "W",
          // RESULT: RESULT.value,
          // REMARK: remark,
          LOM_ID_PAR_COIL_NO: info?.data[i]?.LOM_ID_PAR_COIL_NO,
          WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL,
          NEXT_PROC: "W",
          EWI_ID_ORDER_CUS: pipeInfo?.LOM_ID_ORDER_CUS,
          EWI_ID_ORD_ITEM_CUS: pipeInfo?.LOM_ID_ORD_ITEM_CUS,
          LOM_NO_MATNR: pipeInfo?.LOM_NO_MATNR,
          MATNR_DESC: pipeInfo?.MATNR_DESC,
          LOM_TDC_ACTL: pipeInfo?.LOM_TDC_ACTL,
          EWI_SEC1: pipeInfo?.LOM_SEC1,
          EWI_SEC2: pipeInfo?.LOM_SEC2,
          LENGTH: pipeInfo?.LENGTH,
          EWI_LENGTH: pipeInfo?.LENGTH,
          txtDecision: "Release With Order",
        };
        dummyData.push(data);
      }
      console.log(dummyData);
      setPipeCreationTableData(dummyData);
    } catch (error) {
      alertify.error("Error filling data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (newToken = false) => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    if (pipeCreationTableData.length !== 0) {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url;
      var tableData = pipeCreationTable.getData();
      if (status.value == "") {
        alertify.error("Please Select Status");
        return;
      }
      var newReworkData = [];
      var selectedRows = pipeCreationTable.getSelectedRows();
      if (selectedRows.length == 0) {
        alertify.error("Please select rows");
        return;
      }
      selectedRows.forEach(function (item) {
        newReworkData.push(item._row.data);
      });
      var data = {
        newReworkData: newReworkData,
        status: status.value,
      };
      console.log("data: ", data);
      setLoading(true);
      url = "api/LD08S002/insertpipedetails";
      // url = "";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.startsWith("Y-")) {
              alertify.success("Release  successfull");
              setShowSaveMsgSuccess(true);
              setShowSaveMsgError(false);
              setSaveMsg(response?.data);
              handleClearAll(true);
            } else {
              alertify.error(response?.data);
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
              setSaveMsg(response?.data);
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      alertify.error("No data available for  details !");
    }
  };

  useEffect(() => {
    const table = new Tabulator("#pipeCreationTable", {
      pagination: "local",
      paginationSize: 12,
      data: pipeCreationTableData,
      columns: pipeCreationColumn,
      // height: 400,
      layout: "fitDataFill",
      // rowFormatter: function (row) {
      //   var data = row.getData();
      //   if (data.txtDecision === "DOWNGRADE") {
      //     row.getElement().style.backgroundColor = "#D3E4EE";
      //   } else if (data.txtDecision === "SCRAP") {
      //     row.getElement().style.backgroundColor = "#F2EDDE";
      //   } else {
      //     row.getElement().style.backgroundColor = ""; // Or "white" or your default
      //   }
      // },
    });

    setPipeCreationTable(table);
    // return () => {
    //   //table.destroy();
    // };
    // }
  }, [pipeCreationTableData, matNoList]);

  const pipeCreationColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
    },
    {
      title: "Quality Operation",
      field: "CURR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "Pipe Id",
      field: "LOM_ID_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "RM Coil",
      field: "LOM_ID_PAR_COIL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "RM Weight(Kg)",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Rm Length",
      field: "EWI_LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 120,
    },

    // {
    //   title: "Remark",
    //   field: "REMARK",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell?.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    // },
    // {
    //   title: "Inspector",
    //   field: "INSPECTOR",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell?.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    // },

    // {
    //   title: "Length(mm)",
    //   field: "LENGTH",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   headerSort: false,
    //   editor: "number",
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 0 },
    //   formatter: function (cell, formatterParams) {
    //     var value = cell?.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    //   // cellEdited: (cell) => {
    //   //   var row = cell.getRow();
    //   //   var rl = cell._cell.row.data.txtSchPlantwt;
    //   //   console.log("rl: ", rl);
    //   //   if (isNaN(rl)) {
    //   //     alertify.error("Please enter a valid number");
    //   //     row.update({
    //   //       txtSchPlantwt: 0,
    //   //     });
    //   //   } else {
    //   //     row.update({
    //   //       txtSchPlantwt: rl,
    //   //     });
    //   //   }
    //   // },
    // },
    // {
    //   field: "PIPE_WEIGHT",
    //   title: "Parted Pipe Weight(KG)",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   headerSort: false,
    //   editor: "number",
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    //   formatter: function (cell, formatterParams) {
    //     var value = cell?.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    //   // cellEdited: (cell) => {
    //   //   var row = cell.getRow();
    //   //   var rl = cell._cell.row.data.txtSchPlantwt;
    //   //   console.log("rl: ", rl);
    //   //   if (isNaN(rl)) {
    //   //     alertify.error("Please enter a valid number");
    //   //     row.update({
    //   //       txtSchPlantwt: 0,
    //   //     });
    //   //   } else {
    //   //     row.update({
    //   //       txtSchPlantwt: rl,
    //   //     });
    //   //   }
    //   // },
    // },
    //   {
    //     title: "Decision",
    //     field: "txtDecision",
    //     headerFilter: "input",
    //     headerFilterPlaceholder: "search...",
    //     width: "200",
    //     editor: "list",
    //     editable: function(cell) {
    //         return status?.value === "WD"; // Disable if status is "WP"
    //     },
    //     editorParams: {
    //         allowEmpty: false,
    //         showListOnEmpty: true,
    //         values: status?.value === "WD"?decisionList:[],
    //     },
    //     formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         if (status?.value === "WP") {
    //             // If status is "WP", set the value to blank
    //             value = "";
    //         }
    //         cell.getElement().style["background-color"] = "#DA8EE7";
    //         cell.getElement().style["color"] = "#FFFFFF";
    //         return value;
    //     },
    // },
    {
      title: "Thickness",
      field: "EWI_SEC1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 100,
    },
    {
      title: "Odia",
      field: "EWI_SEC2",
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
      editor: false,
      width: 100,
    },
    {
      title: "Order",
      field: "EWI_ID_ORDER_CUS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 100,
    },
    {
      title: "Item",
      field: "EWI_ID_ORD_ITEM_CUS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 100,
    },
    {
      title: "Material No.",
      field: "LOM_NO_MATNR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 200,
    },
    {
      title: "Material Desc.",
      field: "MATNR_DESC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 300,
    },
    {
      title: "TDC",
      field: "LOM_TDC_ACTL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 100,
    },
  ];

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Quality" page="80 - Release" />
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
                          Filter
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
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
                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          RM Batch *
                        </MDTypography>

                        <ReactSelect
                          id="rmList"
                          options={RMList}
                          onChange={handleRMBatchChange}
                          variant="h6"
                          value={rmBatchId}
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
                          Pipe No *
                        </MDTypography>

                        <ReactSelect
                          id="pipenoList"
                          options={pipenoList}
                          onChange={handlePipeNoChange}
                          //onChange={handlePipeNoChange}
                          variant="h6"
                          value={pipeno}
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
                          Status *
                        </MDTypography>

                        <ReactSelect
                          id="status"
                          options={[
                            { label: "WD", value: "WD" },
                            { label: "WP", value: "WP" },
                          ]}
                          onChange={handleStatusChange}
                          variant="h6"
                          value={status}
                        />
                      </Grid>

                      <Grid item xs={1.5}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => fillData()}
                        >
                          Fill Data
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
                          Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => confirm(true)}
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
                        {pipeCreationTableData && (
                          <div id="pipeCreationTable" />
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
                          Showing 1 to {pipeCreationTableData.length} of{" "}
                          {pipeCreationTableData.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
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
        </>
      )}
    </DashboardLayout>
  );
}
