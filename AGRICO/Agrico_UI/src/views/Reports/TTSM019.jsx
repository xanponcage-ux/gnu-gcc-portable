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
import MultipleSelect from "components/Select/MultiSelect";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet

import ReactSelect from "components/Select/ReactSelect";
import MonthPicker from "components/DateTime/DatePicker";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";

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
import TTSM020PlanModal from "./Modals/TTSM020PlanModal";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";

export default function TTSM019() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [valueRadio, setValueRadio] = React.useState("D");
  const [selectedPlant, setSelectedPlant] = useState([]);

  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);

  const [FGMATData, setFGMATData] = useState([]);
  const [FGMATDataTable, setFGMATDataTable] = useState(null);
  const [allValues, setAllValues] = useState({
    batch_id: "",
    mBatch: "",
  });

  const [matno, setmatno] = React.useState([]);
  const [selectedMATno, setselectMATno] = React.useState([]);

  const handleChange = (e) => {
    if (e.target.name == "order" && e.target.value.length > 10) {
      alertify.error("Order Size can not be greater than 10");
    } else {
      setAllValues({ ...allValues, [e.target.name]: e.target.value });
    }
  };

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
      //   getProdCat();
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
      var pageName = "TTSM019";

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
            Promise.all([getProcDetails(items[0], accessToken)]).finally(() => {
              resolve();
            });
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getProcDetails = (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/TTSM019/getFGMAT";
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
            // response.data.map((row) => {
            //   console.log(row);
            //   var obj = new Object();
            //   obj.label = row[0];
            //   obj.value = row[0];
            //   items.push(obj);
            // });
            response.data?.map((x) =>
                x ? items.push(x) : null
              );
            console.log(items);
            setmatno(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    //setFGMATDataTable([])  ;
    setFGMATData(null)  ;
   console.log("hello")
  };

  useEffect(() => {
       //Dynamically generate month columns based on todt
       console.log(selectedToDt)
    const monthColumns = generateMonthColumns(selectedToDt);
    const summarycolumns = [...FGMATColumnMonthlySummary, ...monthColumns];
      setFGMATDataTable(
        new Tabulator("#FGMATtable", {
          data: FGMATData,
          columns: valueRadio ==="D"? FGMATColumndetailed:summarycolumns,
          maxHeight: 400,
          layout: "fitDataFill",
          groupHeader: function(value, count, data, group) {
            // Use a <span> with a CSS class for better styling control
            return `<span class="tabulator-group-header">${value} <span class="count">(${count} item)</span></span>`;
          },
        })
      );
    
  }, [FGMATData]);

  //   const getProdCat = (accessToken) => {
  //     return new Promise((resolve) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + accessToken,
  //       },
  //     };

  //     setLoading(true);
  //     var url = "api/ttsm007/GetProdCat";
  //     axiosAPI
  //       .post(url, defaultOptions)
  //       .then((response) => {
  //         if (response.statusText != "" && response.statusText != "OK") {
  //           //reject(response.statusText);
  //         } else {
  //           var items = [];
  //           response.data.map((row) => {
  //             var obj = new Object();
  //             obj.label = row[0];
  //             obj.value = row[1];
  //             items.push(obj);
  //           });
  //           setProdCat(items);
  //         }
  //       })
  //       .finally((f) => {
  //         resolve()
  //       });
  //    })
  //  };

  const handlePlantChange = (value) => {
    //clear all data
    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setFGMATData([,]);
    setFGMATDataTable(null);
    //end clear all data

    setSelectedPlant(value);

    GetAuthorization().then((data) => {
      Promise.all([getProcDetails(value, data.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleProcessChange = (value) => {
    setselectMATno(value);
    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setFGMATData([,]);
    setFGMATDataTable(null);
  };

  const getFGMATData = () => {
    if (!selectedPlant?.value) {
      alertify.error("Please select Plant");
      return;
    }
    var url;
    console.log(selectedMATno)
    var data = {
      plant: selectedPlant.value ? selectedPlant.value : "",
      matno: selectedMATno ? selectedMATno.value : "",
      // frmDt: selectedFrmDt ? selectedFrmDt.toLocaleDateString('en-GB', {
      //   day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-') : "",
      // toDt: selectedToDt ? selectedToDt.toLocaleDateString('en-GB', {
      //   day: '2-digit', month: 'short', year: 'numeric'
      // }).replace(/ /g, '-') : ""
      frmDt: selectedFrmDt
        ? ("0" + selectedFrmDt.getDate()).slice(-2) +
          "-" +
          selectedFrmDt.toString().substr(4, 3) +
          "-" +
          selectedFrmDt.getFullYear()
        : "",
      toDt: selectedToDt
        ? ("0" + selectedToDt.getDate()).slice(-2) +
          "-" +
          selectedToDt.toString().substr(4, 3) +
          "-" +
          selectedToDt.getFullYear()
        : "",
      type: valueRadio
    };

   
    if(valueRadio==="D"){
    if (
      (data.frmDt == "" && data.toDt != "") ||
      (data.frmDt != "" && data.toDt == "")
    ) {
      alertify.error("From Date and To Date both are required.");
      return;
    }
    if (selectedFrmDt?.getTime() > selectedToDt?.getTime()) {
      alertify.error("From Date can not be greater than To Date");
      return;
    }
  }else {
    console.log(data,valueRadio);
    if (data.toDt === "")
     {
      alertify.error("To Date required for monthly summary.");
      return;
    }
  }

    data = { ...allValues, ...data };

    url = "api/TTSM019/getMatData";

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
          } else {
            if (response.data?.length == 0) {
              alertify.error("No Data found");
              setFGMATData([,]);
            } else {
              setFGMATData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };
  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
   // Helper function to generate month columns
   const generateMonthColumns = (date) => {
    const monthHeaders = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const targetMonthIndex = date?.getMonth();
    const year = date?.getFullYear();
    const monthColumns = [];
    let columns = [];

    for (let i = 0; i < 6; i++) {
        const monthIndex = (targetMonthIndex - i + 12) % 12;
        const monthName = monthNames[monthIndex];
        const displayYear = year - (i > targetMonthIndex ? 1 : 0); 
        const displayMonth=monthHeaders[monthIndex];
        //Sub-columns (unchanged)
        columns.push({
            title: `ORD QTY`,
            field: `${monthName}_ORD_QTY`,
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: (cell) => formatNumber(cell.getValue()),
            hozAlign: "center"
        });
        columns.push({
            title: `DISPATCHED`,
            field: `${monthName}_SUM_DISPATCH`,
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: (cell) => formatNumber(cell.getValue()),
            hozAlign: "center"
        });
        columns.push({
            title: `WIP QTY`,
            field: `${monthName}_WIP_QTY`,
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: (cell) => formatNumber(cell.getValue()),
            hozAlign: "center"
        });
        columns.push({
            title: `FG QTY`,
            field: `${monthName}_FG_STOCK`,
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: (cell) => formatNumber(cell.getValue()),
            hozAlign: "center"
        });
        columns.push({
            title: `BTD`,
            field: `${monthName}_BTD`,
            headerFilter: "input",
            headerFilterPlaceholder: "search...",
            formatter: (cell) => formatNumber(cell.getValue()),
            hozAlign: "center"
        });

          monthColumns.push({
              title: `${displayMonth} ${displayYear}`,
              columns: columns,
              headerHozAlign:"center"
          });
        columns = [];
    }
    return monthColumns;
};

  const formatNumber = (value) => {
    return value ? parseFloat(value).toFixed(3) : value;
  }
  const FGMATColumnMonthlySummary = [
    {
      title: "FG Mat",
      field: "ENC_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true
    },
    {
      title: "Mat Desc",
      field: "MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Mat Type",
      field: "ENC_PRINT_SPEC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
        {
      title: "ODIA",
      field: "ENC_ODIA",
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
      title: "Min. Width",
      field: "MAX_WIDTH",
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
      title: "Max. Width",
      field: "MAX_WIDTH",
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
      title: "Min. Thick",
      field: "MIN_THICK",
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
      title: "Max. Thick",
      field: "MAX_THICK",
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
      title: "Min.Length",
      field: "MIN_LEN",
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
      title: "Max.Length",
      field: "MAX_LEN",
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
      title: "SFG Mat.",
      field: "SFG_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value) {
      //     return value.toFixed(3);
      //   }
      //   return value;
      // },
    },
    {
      title: "SFG Mat. Desc",
      field: "SFG_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value) {
      //     return value.toFixed(3);
      //   }
      //   return value;
      // },
    },
    
  ];

  const FGMATColumndetailed = [
    {
      title: "FG Mat",
      field: "ENC_NO_MATNR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true
    },
    {
      title: "Mat Desc",
      field: "MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Ord Qty",
      field: "ORD_QTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Dispatched",
      field: "SUM_DISPATCH",
      headerFilter: "input",
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
      title: "Last 6 Mnth Disp",
      field: "LAST_SIX_MONTHS_DISPATCH",
      headerFilter: "input",
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
      title: "Last 6 Mnth Disp Month Count",
      field: "DISTINCT_MONTH_COUNT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",},
    {
      title: "WIP Qty",
      field: "WIP_QTY",
      headerFilter: "input",
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
      title: "FG Stock",
      field: "FG_STOCK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "BTD",
      field: "BTD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      width: 150 
    },
    {
      title: "ODIA",
      field: "ENC_ODIA",
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
      title: "Min. Width",
      field: "MAX_WIDTH",
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
      title: "Max. Width",
      field: "MAX_WIDTH",
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
      title: "Min. Thick",
      field: "MIN_THICK",
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
      title: "Max. Thick",
      field: "MAX_THICK",
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
      title: "Min.Length",
      field: "MIN_LEN",
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
      title: "Max.Length",
      field: "MAX_LEN",
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
      title: "SFG Mat.",
      field: "SFG_MAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value) {
      //     return value.toFixed(3);
      //   }
      //   return value;
      // },
    },
    {
      title: "SFG Mat. Desc",
      field: "SFG_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value) {
      //     return value.toFixed(3);
      //   }
      //   return value;
      // },
    },
  ];

  const downloadExcelFGMATTable = () => {
    if (FGMATDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = FGMATDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "TTSM019_FGMAT_Report" + ".xlsx";

    FGMATDataTable.download("xlsx", fileName, {
      sheetName: "TTSM019",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);

    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);

    setFGMATData([,]);
    setFGMATDataTable(null);
    setselectMATno([]);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Reports" page="Dispatch Analysis" />
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
                          value={selectedPlant}
                          onChange={handlePlantChange}
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
                          Material Type{" "}
                        </MDTypography>
                        {/* <ReactSelect
                          id="process"
                          options={matno}
                          onChange={handleProcessChange}
                          value={selectedMATno}
                        /> */}
                        <MultipleSelect
                              id="MaterialType"
                              value={selectedMATno}
                              setValue={handleProcessChange}
                              data={matno}
                              placeholder={"--Select--"}
                            />
                      </Grid>

                     {valueRadio==="D" &&
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
                          From Date{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedFrmDt}
                          onChange={(date) => setSelectedFrmDt(date)}
                        />
                      </Grid>
}
                      <Grid item xs={1}>
                            <Tooltip title="Data till 6 months before this date">
                              <MDTypography // Assuming MDTypography is your custom Typography component
                                fontWeight="regular"
                                fontSize="small"
                                textTransform="capitalize"
                                variant="h6"
                                color={"dark"}
                                noWrap
                              >
                                To Date
                              </MDTypography>
                            </Tooltip>
                            <DatePicker
                              id="toDt"
                              value={selectedToDt}
                              onChange={(date) => setSelectedToDt(date)}
                            />
                          </Grid>
                      <Grid item xs={1}>
                        <MDButton
                          style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => getFGMATData(true)}
                        >
                          Submit
                        </MDButton>
                      </Grid>
                      <Grid item xs={3}>
                            <FormControl>
                              <FormLabel id="demo-row-radio-buttons-group-label">
                                Report Type
                              </FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="row-radio-buttons-group"
                                value={valueRadio}
                                onChange={handleRadioChange}
                              >
                                <FormControlLabel
                                  value="D"
                                  control={<Radio />}
                                  label="Detailed"
                                />
                                <FormControlLabel
                                  value="S"
                                  control={<Radio />}
                                  label="Monthly Summary"
                                />
                              </RadioGroup>
                            </FormControl>
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
                          FGMAT Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelFGMATTable()}
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
                        
                        <div id="FGMATtable" >
                                          <style>
                          {`
                          .tabulator-group-header {
                            font-weight: bold;
                          }

                          .tabulator-group-header .count {
                            background-color: #ccc;
                            margin-left: 10px;
                            padding: 2px 5px;
                            border-radius: 3px;
                          }
                          `}
                        </style></div>
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {FGMATData?.length} of{" "}
                          {FGMATData?.length} entries
                        </p>
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
