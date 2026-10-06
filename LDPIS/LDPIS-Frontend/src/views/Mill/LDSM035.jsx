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

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";

export default function LDSM035() {
  const [initialLoad, setInitialLoad] = useState(false);
  const [loading, setLoading] = React.useState(false);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [statusList, setStatusList] = useState([]);
  const [tdcList, setTdcList] = useState([]);
  const [selectTdc, setSelectTdc] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlantFG, setSelectedPlantFG] = useState([]);

  const [editableusers, setEditableUsers] = useState(false);
  const [userID,setUserID]= useState(null);

  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);

  const [fgBatchRevData, setFgBatchRevData] = useState([]);
  const [fgBatchRevDataTable, setFgBatchRevDataTable] = useState(null);

  const [fgMBatchRevData, setFgMBatchRevData] = useState([]);
  const [fgMBatchRevDataTable, setFgMBatchRevDataTable] = useState(null);

  const [allValuesFG, setAllValuesFG] = useState({
    batch_id: "",
    mBatch: "",
    process: "",
    custOrd: "",
    custItem: "",
    status: "",
    tdc: "",
    prodCD: "",
    qltyCD: "",
    thickFrm: "",
    thickTo: "",
    widthFrm: "",
    widthTo: "",
    length: "",
    ordType: "",
  });

  const handleChangeFG = (e) => {
    // if(e.target.name == "order" && e.target.value.length > 10){
    //         alertify.error("Order Size can not be greater than 10");
    // }else{
    setAllValuesFG({ ...allValuesFG, [e.target.name]: e.target.value });
    // }
  };

  const getStatusData = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM034/getStatusList";
      var data = {
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
            setStatusList(items);
            setSelectedStatus([]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getTdcData = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM035/getTdcList";
      var data = {
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
            setTdcList(items);
            setSelectTdc([]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  //page load
  useEffect(() => {
    function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }
      setLoading(true);
      GetAuthorization().then((token) => {
        validateUser(token);
        //page load functions here
        Promise.all([getGroupPlantId(token.accessToken)]).finally(() => {
          setLoading(false);
        });
      });
    }
    fetchData();
    if(userID)
      getUserIdsEditableMass();
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
      var pageName = "LDSM035";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        token.accessToken
      );
      setUserID(serverDetails.PersonalNo);
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
          console.log(editableusers);
          if (authDetails.payload.LS_READ_WRITE_FLAG == "RL_RW" ) {
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
      console.log(isRestricted,editableusers);
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
  useEffect(() => {
    // This will run when `userID` changes
    console.log(userID);
    if(userID)
      getUserIdsEditableMass();
    }, [userID]);

    
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
            setSelectedPlantFG(items[0]);
            Promise.all([
              getStatusData(items[0], accessToken),
              getTdcData(items[0], accessToken),
            ]).finally(() => {
              resolve();
            });
          }
        })
        .catch((f) => {
          resolve();
        });
    });
  };

  useEffect(() => {
    if (fgBatchRevData && fgBatchRevData.length > 0) {
      setFgBatchRevDataTable(
        new Tabulator("#fgbatchrev", {
          data: fgBatchRevData,
          columns: fgBatchRevColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [fgBatchRevData]);

  useEffect(() => {
    if (fgMBatchRevData && fgMBatchRevData.length > 0) {
      setFgMBatchRevDataTable(
        new Tabulator("#fgMbatchrev", {
          data: fgMBatchRevData,
          columns: fgMBatchRevColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [fgMBatchRevData]);

  const handlePlantChangeFG = (value) => {
    //clear all data
    setAllValuesFG({});
    setFgBatchRevData([,]);
    setFgMBatchRevData([,]);
    setFgBatchRevDataTable(null);
    setFgMBatchRevDataTable(null);
    setSelectTdc([]);
    setSelectedStatus([]);
    //end clear all data

    setSelectedPlantFG(value);
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([
        getStatusData(value, token.accessToken),
        getTdcData(value, token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getFGBatchReverseData = async (mBatch) => {
    var url;

    var data = {
      plant: selectedPlantFG.value ? selectedPlantFG.value : "",
    };

    if (data.plant == "") {
      alertify.error("Please select Plant");
      return;
    }
    if (
      !(allValuesFG.batch_id?.length > 0) &&
      !(allValuesFG.mBatch?.length > 0)
    ) {
      alertify.error("Please select MBatch Id OR Batch Id");
      return;
    }
    if (selectedStatus?.value) {
      allValuesFG.status = selectedStatus.value;
    } else {
      allValuesFG.status = "";
    }

    if (selectTdc?.value) {
      allValuesFG.tdc = selectTdc.value;
    } else {
      allValuesFG.tdc = "";
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      data = { ...allValuesFG, ...data };
      url = "api/LDSM035/getfgbatchrev";

      if (mBatch) {
        data.batch_id = "";
        data.mBatch = mBatch;
      }
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            setFgMBatchRevDataTable(null);
            setFgMBatchRevData([]);
            if (response.data.length == 0) {
              alertify.error("No Data found");
              if (!mBatch) {
                setFgBatchRevData([,]);
              }
            } else {
              if (mBatch) {
                setFgMBatchRevData(response.data);
              } else {
                setFgBatchRevData(response.data);
              }
            }
          }
          if (
            !mBatch &&
            data.batch_id !== "" &&
            response.data?.length > 0 &&
            response.data[0].LOM_ID_FIRST_PAR
          ) {
            getFGBatchReverseData(response.data[0].LOM_ID_FIRST_PAR);
          } else {
            setFgMBatchRevDataTable(null);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const saveFGBatchReverseData = async (newToken = false) => {
    var selectedRows = fgBatchRevDataTable.getSelectedRows();

    var selectedData = [];
    selectedRows.forEach(function (item) {
      //selectedData.push(item._row.data.LOM_ID_BATCH);
      // remove the scrap batch from the selected value.
      if (item._row.data.LOM_CD_QLTY_ACTL != "SCRP") {
        selectedData.push(item._row.data.LOM_ID_BATCH);
      }
      //Ended.
    });

    //no row selected alert
    if (selectedData.length == 0) {
      alertify.error("No rows selected from QA Decision Data Table");
      return;
    }

    var data = {
      personalNo: serverDetails.PersonalNo,
      selectedData: selectedData,
      plant: selectedPlantFG.value,
    };

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM035/savefgbatchrev";

      // api call
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          var msg = "";

          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            alertify.error("Process failed");
          } else {
            if (response.data.res_n.length == 0) {
              msg = "All Coil/Batch reversed successfully";
            } else {
              msg += "Coil ID : ";
              response.data.res_n.map((val) => {
                msg +=
                  val?.id?.toString() + " : " + val?.msg?.toString() + " , ";
              });
              if (response.data.res_y.length == 0) {
                msg += "failed.";
                alertify.error(msg);
              } else {
                msg += " failed and rest are successfully reversed.";
                alertify.success(msg);
              }
            }

            getFGBatchReverseData();
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const fgBatchRevColumn = [
    {
      formatter: function (cell, formatterParams, onRendered) {
        const data = cell.getRow().getData();
        if (data.LOM_CD_QLTY_ACTL != "SCRP") {
          var checkbox = document.createElement("input");

          checkbox.type = "checkbox";

          if (this.table.modExists("selectRow", true)) {
            checkbox.addEventListener("click", (e) => {
              e.stopPropagation();
            });

            if (typeof cell.getRow == "function") {
              var row = cell.getRow();
              if (row._getSelf().type == "row") {
                checkbox.addEventListener("change", (e) => {
                  row.toggleSelect();
                });

                checkbox.checked = row.isSelected && row.isSelected();
                this.table.modules.selectRow.registerRowSelectCheckbox(
                  row,
                  checkbox
                );
              } else {
                checkbox = "";
              }
            } else {
              checkbox.addEventListener("change", (e) => {
                if (this.table.modules.selectRow.selectedRows.length) {
                  this.table.deselectRow();
                } else {
                  this.table.selectRow(formatterParams.rowRange);
                }
              });

              this.table.modules.selectRow.registerHeaderSelectCheckbox(
                checkbox
              );
            }
          }
          return checkbox;
        }
        return null;
      },
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      hozAlign: "center",
      // cellClick: function(e, cell) {
      //   this.recalc();
      // }
    },
    // {
    //   titleFormatter: "rowSelection",
    //   formatter: "rowSelection",
    //   hozAlign: "center",
    //   headerSort: false,
    //   frozen: true
    // },
    {
      title: "Batch ID",
      field: "LOM_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Parent Batch",
      field: "LOM_ID_PAR_COIL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MBatch ID",
      field: "LOM_ID_FIRST_PAR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "LOM_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.",
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
      title: "Net Wt UOM", //"UOM",
      field: "UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap Wt(Ton)",
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
      title: "Grade/TDC",
      field: "LOM_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Creation Date",
      field: "LOM_TS_CREATION",
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
      title: "Order Type",
      field: "ORD_TYP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Curr Proc",
      field: "LOM_CD_CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Proc",
      field: "LOM_CD_PREV_PROC",
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
      title: "Plan Path",
      field: "LOM_PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed Proc",
      field: "LOM_PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Plan Path",
      field: "LOM_PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Passed Proc",
      field: "LOM_PASSED_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Sco",
    //   field: "LOM_ID_ORDER",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Item",
      field: "LOM_NO_ITEM",
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
  ];
  const fgMBatchRevColumn = [
    {
      title: "Batch ID",
      field: "LOM_ID_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Parent Batch",
      field: "LOM_ID_PAR_COIL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "MBatch ID",
      field: "LOM_ID_FIRST_PAR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Status",
      field: "LOM_CD_STATUS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Net Wt.",
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
      title: "Net Wt UOM", //"UOM",
      field: "UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Scrap Wt(Ton)",
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
      title: "Grade/TDC",
      field: "LOM_TDC_ACTL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },

    {
      title: "Creation Date",
      field: "LOM_TS_CREATION",
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
      title: "Order Type",
      field: "ORD_TYP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Curr Proc",
      field: "LOM_CD_CURR_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prev Proc",
      field: "LOM_CD_PREV_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "LOM_CD_NEXT_PROC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Sco",
    //   field: "LOM_ID_ORDER",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "Item",
      field: "LOM_NO_ITEM",
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
  ];

  const downloadExcelFgBatchRev = () => {
    if (fgBatchRevDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = fgBatchRevDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM035_Production_Reversal" + ".xlsx";
    var mfileName = "LDSM035_mBatch_Production_Reversal" + ".xlsx";

    fgBatchRevDataTable.download("xlsx", fileName, {
      sheetName: "LDSM035",
    });
    if (fgMBatchRevDataTable && fgBatchRevData?.length > 0) {
      fgMBatchRevDataTable.download("xlsx", mfileName, {
        sheetName: "LDSM035",
      });
    }
  };
  const getUserIdsEditableMass = async (value) => {
    setEditableUsers([]);
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      var url = "api/LDSM035/getUserIdsEditableMass";
      let data = {
        UserId: userID
      };
      console.log(data,userID);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response.data) {
              var items = [];
              console.log(response.data);
              response.data.map((row) => {
                var obj = new Object();
                console.log(row[0]);  
                items.push(row[0]);
              });
              console.log(items[0]);
              setEditableUsers(items[0]);
              console.log("editableusers: ", editableusers);
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
  const handleClearAll = (newToken = false) => {
    setSelectedPlantFG([]);
    setEditableUsers([]);
    setAllValuesFG({});

    setFgBatchRevData([,]);
    setSelectTdc([]);
    setSelectedStatus([]);
    setFgBatchRevDataTable(null);
    setFgMBatchRevDataTable(null);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="Production Reversal" />
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        {loading && <Preloader />}
      </Grid>
      {(isRestricted  &&  !editableusers ) || isRestricted ?(
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
      ):null}
      {isRestricted == false && editableusers == true && (
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
                          value={selectedPlantFG}
                          onChange={handlePlantChangeFG}
                        />
                      </Grid>

                      {/* 
                      <Grid item xs={1.25}>
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

                        <MDInput
                          type="text"
                          name="process"
                          value={allValuesFG.process || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          MBatch ID**
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="mBatch"
                          value={allValuesFG.mBatch || ""}
                          onInput={(e) => {
                            e.target.value = e.target?.value
                              ?.toString()
                              ?.slice(0, 10);
                          }}
                          onChange={(e) => handleChangeFG(e)}
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
                          Batch ID**
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="batch_id"
                          value={allValuesFG.batch_id || ""}
                          onInput={(e) => {
                            e.target.value = e.target?.value
                              ?.toString()
                              ?.slice(0, 10);
                          }}
                          onChange={(e) => handleChangeFG(e)}
                        />
                      </Grid>

                      {/* <Grid item xs={1.25}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Cust Ord
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="custOrd"
                          value={allValuesFG.custOrd || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Cust Item
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="custItem"
                          value={allValuesFG.custItem || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Status
                        </MDTypography>
                        <ReactSelect
                          id="status"
                          options={statusList}
                          value={selectedStatus}
                          onChange={(val) => setSelectedStatus(val)}
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
                          Tdc
                        </MDTypography>
                        <ReactSelect
                          id="tdc"
                          options={tdcList}
                          value={selectTdc}
                          onChange={(val) => setSelectTdc(val)}
                        />
                      </Grid> */}
                      {/* 
                      <Grid item xs={1.25}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Prod CD
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="prodCD"
                          value={allValuesFG.prodCD || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Qlty CD
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="qltyCD"
                          value={allValuesFG.qltyCD || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Thickness From
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="thickFrm"
                          value={allValuesFG.thickFrm || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Thickness To
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="thickTo"
                          value={allValuesFG.thickTo || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Width From
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="widthFrm"
                          value={allValuesFG.widthFrm || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Width To
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="widthTo"
                          value={allValuesFG.widthTo || ""}
                          onChange={(e) => handleChangeFG(e)}
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
                          Length
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="length"
                          value={allValuesFG.length || ""}
                          onChange={(e) => handleChangeFG(e)}
                        />
                      </Grid> */}

                      {/* <Grid item xs={1.25}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          ordType
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="ordType"
                          value={allValuesFG.ordType || ""}
                          onChange={(e) => handleChangeFG(e)}
                        />
                      </Grid> */}

                      {/* <Grid item xs={1}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap > From Date </MDTypography>
                                                <DatePicker id="frmDt" value={selectedFrmDt} onChange={(date) => setSelectedFrmDt(date)} />
                                            </Grid>

                                            <Grid item xs={1}>
                                                <MDTypography fontWeight="regular" fontSize="small" textTransform="capitalize" variant="h6" color={"dark"} noWrap > To Date </MDTypography>
                                                <DatePicker id="toDt" value={selectedToDt} onChange={(date) => setSelectedToDt(date)} />
                                            </Grid> */}

                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getFGBatchReverseData()}
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
                          Batch Details
                        </MDTypography>
                      </Grid>
                      {/* <Grid item xs={2}></Grid> */}
                      <Grid item xs={2}>
                        <Tooltip title="Reverse">
                          <IconButton
                            color="white"
                            disabled={isReadWriteAccess}
                            onClick={() => saveFGBatchReverseData(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelFgBatchRev()}
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
                        <div id="fgbatchrev" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {fgBatchRevData.length} of{" "}
                          {fgBatchRevData.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>
              {fgMBatchRevData.length ? (
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
                            MBatch Details
                          </MDTypography>
                        </Grid>
                        {/* <Grid item xs={2}></Grid> */}
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
                          <div id="fgMbatchrev" />
                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {fgMBatchRevData.length} of{" "}
                            {fgMBatchRevData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
              ) : null}
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
