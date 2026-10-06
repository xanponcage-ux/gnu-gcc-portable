import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import SearchIcon from "@mui/icons-material/Search";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ClearAllIcon from "@mui/icons-material/ClearAll";
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { GetAuthorization } from "../../utils";
// Data
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";

export default function TubePlanning() {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [qualityDataTable, setqualityDataTable] = useState(null);
  const [qualityResultDataTable, setqualityResultDataTable] = useState(null);

  const [plant, setPlant] = useState([]);
  const [holdRsnList, setHoldRsnList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState([]);

  const [statusList, setStatusList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [orderItemList, setOrderItemList] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [selectedOrderItem, setSelectedOrderItem] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [qualityData, setqualityData] = useState([]);

  const [unloadCoilData, setUnloadCoilData] = useState([]);
  const [unloadCoilDataTable, setUnloadCoilDataTable] = useState(null);

  const [qualityResultData, setqualityResultData] = useState([]);
  const [bUnit, setBunit] = useState([]);
  // const [statusList, setStatusList] = useState([]);
  const [scrapMatNo, setScrapMatNo] = useState([]);

  const [allValues, setAllValues] = useState({
    batch: "",
    prodCd: "",
    // status : "",
    tdc: "",
    thickfrm: "",
    thickto: "",
  });

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const toInputUppercase = (e) => {
    e.target.value = ("" + e.target.value).toUpperCase();
  };

  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      GetAuthorization().then((token) => {
        validateUser(token);
        //page load functions here
        getGroupPlantId(token.accessToken);
      });
    }
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
      var pageName = "LDSM067";

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

  const getProcess = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM067/getprocess";
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
              obj.label = row.split(":")[1];
              obj.value = row.split(":")[0];
              items.push(obj);
            });
            setProcessList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getStatus = (e, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM067/getstatus";
      let data = {
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
              var obj = new Object();
              var temp = row.split(":");
              obj.label = temp[0] + " - " + temp[1];
              obj.value = temp[0];
              items.push(obj);
            });
            setStatusList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getGroupPlantId = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
      };
      var url = "api/common/getGroupPlant";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            setLoading(false);
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

            Promise.all([
              getProcess(items[0], token.accessToken),
              getStatus(items[0], token.accessToken),
              getHoldRsn(token.accessToken),
              getScrapMatNo(items[0], token.accessToken),
            ]).finally(() => {
              setLoading(false);
            });
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  const getHoldRsn = (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      let data = {
        adid: serverDetails.PersonalNo,
      };

      var url = "api/LDSM067/getholdrsn";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            var items = [];

            response.data.map((row) => {
              var obj = new Object();
              var val = row.split(":");
              obj.label = val[0] + " - " + val[1];
              obj.value = val[0] + " - " + val[1];
              items.push(obj);
            });
            setHoldRsnList(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getScrapMatNo = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LDSM067/getScrapMatNo";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var items = [];
            response.data.map((row) => {
              var obj = new Object();
              var val = row.split(":");
              obj.label = val[0] + " - " + val[1];
              obj.value = val[0];
              items.push(obj);
            });
            setScrapMatNo(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  //use Effect to render display data
  useEffect(() => {
    if (unloadCoilData && unloadCoilData.length > 0) {
      setUnloadCoilDataTable(
        new Tabulator("#unloadCoilTable", {
          data: unloadCoilData,
          columns: unloadCoilColumn,
          height: 300,
          layout: "fitDataFill",
        })
      );
    }
  }, [unloadCoilData]);

  const handlePlantChange = (value) => {
    setSelectedPlant(value);
    setUnloadCoilData([,]);
    setUnloadCoilDataTable(null);
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([
        getBusinessCd(value, token.accessToken),
        getProcess(value, token.accessToken),
        getHoldRsn(token.accessToken),
        getScrapMatNo(value, token.accessToken),
        getStatus(value, token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e);
    setUnloadCoilData([,]);
    setUnloadCoilDataTable(null);
  };

  const handleProcessChange = (e) => {
    setSelectedProcess(e);
    setUnloadCoilData([,]);
    setUnloadCoilDataTable(null);
  };

  const getCoilDataFnc = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getCoilData(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getCoilData = (accessToken) => {
    //If Session(CommonConstants.SPC_BUS_UNIT) = "TUBES" Or Session(CommonConstants.SPC_BUS_UNIT) = "LP" Then
    return new Promise((resolve) => {
      var data = {
        plant: selectedPlant ? selectedPlant.value : "",
        process: selectedProcess ? selectedProcess.value : "",
        //status : selectedStatus.value,
        status: selectedStatus ? selectedStatus.value : "",
      };

      data = { ...data, ...allValues };

      //filter criteria
      if (!data.plant) {
        alertify.error("Please select Plant ID");
        resolve();
        return;
      }

      if (
        (data.thickfrm && !data.thickto) ||
        (!data.thickfrm && data.thickto)
      ) {
        alertify.error("Thickness From and To should be mentioned");
        resolve();
        return;
      }

      if (data.thickfrm && data.thickto && data.thickfrm > data.thickto) {
        alertify.error("Thickness From can not be greater than Thickness To");
        resolve();
        return;
      }

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM067/getcoils";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setUnloadCoilData([,]);
            } else {
              var rows = [];
              for (var i in response.data) {
                var rowdata = response.data[i];
                rows.push({
                  LOM_CD_CURR_PROC: rowdata.LOM_CD_CURR_PROC,
                  LOM_CD_NEXT_PROC: rowdata.LOM_CD_NEXT_PROC,
                  LOM_CD_PROD: rowdata.LOM_CD_PROD,
                  LOM_CD_QLTY_ACTL: rowdata.LOM_CD_QLTY_ACTL,
                  LOM_CD_STATUS: rowdata.LOM_CD_STATUS,
                  LOM_CD_YRD: rowdata.LOM_CD_YRD,
                  LOM_ID_BATCH: rowdata.LOM_ID_BATCH,
                  LOM_ID_LOC_X: rowdata.LOM_ID_LOC_X,
                  LOM_ID_LOC_Y: rowdata.LOM_ID_LOC_Y,
                  LOM_ID_ORDER_CUS: rowdata.LOM_ID_ORDER_CUS,
                  LOM_ID_ORD_ITEM_CUS: rowdata.LOM_ID_ORD_ITEM_CUS,
                  LOM_ID_POS: rowdata.LOM_ID_POS,
                  LOM_LENGTH: rowdata.LOM_LENGTH,
                  LOM_MS_GROSS_CAL: rowdata.LOM_MS_GROSS_CAL,
                  LOM_SEC1: rowdata.LOM_SEC1,
                  LOM_SEC2: rowdata.LOM_SEC2,
                  LOM_TDC_ACTL: rowdata.LOM_TDC_ACTL,
                  HOLD_REASON: rowdata.HOLD_REASON,
                  MOTHER_COIL: rowdata.MOTHER_COIL,
                  MS_SCRAP: rowdata.MS_SCRAP,
                  OPERATOR_REMARKS: rowdata.OPERATOR_REMARKS,
                  PARENT_BATCH: rowdata.PARENT_BATCH,
                  RESIDUAL_WT: rowdata.RESIDUAL_WT,
                  MATNR: rowdata.MATNR,
                  MATNR_DESC: rowdata.MATNR_DESC,
                });
              }

              setUnloadCoilData(rows);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const saveUnloadCoils = () => {
    var selectedRows = unloadCoilDataTable.getSelectedRows();

    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        LOM_ID_BATCH: item._row.data.LOM_ID_BATCH,
        MS_SCRAP: item._row.data.MS_SCRAP,
        LOM_CD_STATUS: item._row.data.LOM_CD_STATUS,
        LOM_CD_CURR_PROC: item._row.data.LOM_CD_CURR_PROC,
        LOM_MS_GROSS_CAL: item._row.data.LOM_MS_GROSS_CAL,
        HOLD_REASON: item._row.data.HOLD_REASON
          ? item._row.data.HOLD_REASON.split("-")[0].trim()
          : item._row.data.HOLD_REASON,
        OPERATOR_REMARKS: item._row.data.OPERATOR_REMARKS,
        SCRAP_MATNR: item._row.data.SCRAP_MATNR
          ? item._row.data.SCRAP_MATNR.split("-")[0].trim()
          : item._row.data.SCRAP_MATNR,
      });
    });

    //no row selected alert
    if (selectedData.length == 0) {
      alertify.error("No rows selected from Display Table");
      return;
    }
    var data = {
      plant: selectedPlant.value,
      personalNo: serverDetails.PersonalNo,
      selectedData: selectedData,
    };

    setLoading(true);

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LDSM067/saveunloaddata";

      // api call
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            setLoading(false);
            alertify.error("Error Inserting Data");
          } else {
            response.data.res_n.map((val) => {
              alertify.error(val);
            });
            response.data.res_y.map((val) => {
              alertify.success(val);
            });
          }
          Promise.all([getCoilData(token.accessToken)]).finally(() => {
            setLoading(false);
          });
        })
        .catch(() => {
          setLoading(false);
        });
    });
  };

  const unloadCoilColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: "2%",
    },
    {
      title: "Batch ID",
      field: "LOM_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap(MT)",
      field: "MS_SCRAP",
      editor: "input",
      formatter: function (cell, formatterParams) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        var value = cell.getValue();
        // if (value) {
        //     return value.toFixed(3);
        // }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Hold Reason",
      field: "HOLD_REASON",
      editor: "list",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        searchEnabled: true,
        values: holdRsnList,
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Operator Remarks",
      field: "OPERATOR_REMARKS",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap Material No",
      field: "SCRAP_MATNR",
      editor: "list",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: scrapMatNo,
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "LOM_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      title: "Curr Proc",
      field: "LOM_CD_CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "LOM_CD_NEXT_PROC",
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
      title: "Qlty",
      field: "LOM_CD_QLTY_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Thick",
      field: "LOM_SEC1",
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
      title: "Width",
      field: "LOM_SEC2",
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
      title: "Length",
      field: "LOM_LENGTH",
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
      title: "TDC",
      field: "LOM_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Residual Wt",
      field: "RESIDUAL_WT",
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
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mother Batch",
      field: "MOTHER_COIL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Loc X",
      field: "LOM_ID_LOC_X",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Loc Y",
      field: "LOM_ID_LOC_Y",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Loc Z",
      field: "LOM_ID_POS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Loc Yard",
      field: "LOM_CD_YRD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material Desc.",
      field: "MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadExcelunloadCoilTableData = () => {
    if (unloadCoilData.length == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "Unload_Coil " + date.toString() + ".xlsx";
    unloadCoilDataTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);
    setSelectedProcess([]);

    setAllValues({});

    setUnloadCoilData([,]);
    setUnloadCoilDataTable(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="Unloading Coil / Batch"
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

                  <MDBox px={3} py={1}>
                    <Grid item xs={12}>
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
                            Plant <span style={{ color: "red" }}>*</span>
                          </MDTypography>
                          <ReactSelect
                            id="plant"
                            options={plant}
                            value={selectedPlant}
                            onChange={handlePlantChange}
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
                            id="process"
                            options={processList}
                            value={selectedProcess}
                            onChange={handleProcessChange}
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
                            Batch ID
                          </MDTypography>
                          <MDInput
                            label=""
                            name="batch"
                            inputProps={{ maxLength: 10 }}
                            value={allValues.batch || ""}
                            onChange={(e) => handleChange(e)}
                          />
                        </Grid>
                        {/* <Grid item xs={.75} style={{ zIndex: 5 }}>
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
                            inputProps={{ maxLength: 10 }}
                            value={allValues.prodCd || ""}
                            onChange={(e) => handleChange(e)}
                            onInput={toInputUppercase}
                          />
                        </Grid> */}

                        <Grid item xs={3}>
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
                          {/* <MDInput
                            label=""
                            name="status"
                            inputProps={{ maxLength: 10 }}
                            value={allValues.status || ""}
                            onChange={(e) => handleChange(e)}
                          /> */}
                          <ReactSelect
                            id="status"
                            options={statusList}
                            value={selectedStatus}
                            onChange={handleStatusChange}
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
                            Tdc
                          </MDTypography>
                          <MDInput
                            label=""
                            name="tdc"
                            inputProps={{ maxLength: 10 }}
                            value={allValues.tdc || ""}
                            onChange={(e) => handleChange(e)}
                            onInput={toInputUppercase}
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
                            Thickness
                          </MDTypography>

                          <Grid
                            item
                            alignItems="stretch"
                            style={{ display: "flex" }}
                          >
                            <MDInput
                              label="From"
                              name="thickfrm"
                              inputProps={{ maxLength: 10 }}
                              value={allValues.thickfrm || ""}
                              onChange={(e) => handleChange(e)}
                            />
                            <MDInput
                              label="To"
                              name="thickto"
                              inputProps={{ maxLength: 10 }}
                              value={allValues.thickto || ""}
                              onChange={(e) => handleChange(e)}
                            />
                          </Grid>
                          {/* <MDInput
                            label=""
                            name="thick"
                            inputProps={{ maxLength: 10 }}
                            value={allValues.thick || ""}
                            onChange={(e) => handleChange(e)}
                          /> */}
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => getCoilDataFnc(true)}
                          >
                            Submit
                          </MDButton>
                        </Grid>
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
                          Batch Details
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}>
                        <Tooltip title="Unload Coils">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => saveUnloadCoils(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelunloadCoilTableData()}
                          >
                            <DownloadForOfflineIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>
                  <MDBox px={3} py={1}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div id="unloadCoilTable" />
                        {/* <br /> */}
                        {/* <p
                                        color="black"
                                        style={{
                                          color: "black",
                                          paddingLeft: "1rem",
                                          marginTop: "-1rem",
                                        }}
                                      >
                                        Showing 1 to {qualityData.length} of{" "}
                                        {qualityData.length} entries
                                      </p> */}
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
