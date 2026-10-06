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
import LDSM020PlanModal from "./Modals/LDSM020PlanModal";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { GetAuthorization } from "utils";

export default function LDSM013() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [tubesDataTable, setTubesDataTable] = useState(null);
  const [pCat, setProdCat] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState([]);

  const [selectedFrmDt, setSelectedFrmDt] = useState(null);
  const [selectedToDt, setSelectedToDt] = useState(null);

  const [defectData, setDefectData] = useState([]);
  const [defectDataTable, setDefectDataTable] = useState(null);
  const [allValues, setAllValues] = useState({
    batch_id: "",
    mBatch: "",
  });

  const [processDetails, setProcessDetails] = React.useState([]);
  const [selectedProcess, setSelectProcess] = React.useState([]);

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
      var pageName = "LDSM013";

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
      var url = "api/LDSM013/getProcDesc";
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
            setProcessDetails(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  useEffect(() => {
    if (defectData && defectData.length > 0) {
      setDefectDataTable(
        new Tabulator("#defecttable", {
          data: defectData,
          columns: defectColumn,
          maxHeight: 400,
          layout: "fitDataFill",
        })
      );
    }
  }, [defectData]);

  //   const getProdCat = (accessToken) => {
  //     return new Promise((resolve) => {
  //     var defaultOptions = {
  //       headers: {
  //         Authorization: "Bearer " + accessToken,
  //       },
  //     };

  //     setLoading(true);
  //     var url = "api/LDSM007/GetProdCat";
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
    setDefectData([,]);
    setDefectDataTable(null);
    //end clear all data

    setSelectedPlant(value);

    GetAuthorization().then((data) => {
      Promise.all([getProcDetails(value, data.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const handleProcessChange = (value) => {
    setSelectProcess(value);
    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);
    setDefectData([,]);
    setDefectDataTable(null);
  };

  const getDefectData = () => {
    if (!selectedPlant?.value) {
      alertify.error("Please select Plant");
      return;
    }
    var url;

    var data = {
      plant: selectedPlant.value ? selectedPlant.value : "",
      process: selectedProcess ? selectedProcess.value : "",
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
    };

    if (data.plant == "") {
      alertify.error("Please select Plant");
      return;
    }

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

    data = { ...allValues, ...data };

    url = "api/LDSM013/getdefectdata";

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
            if (response.data.length == 0) {
              alertify.error("No Data found");
              setDefectData([,]);
            } else {
              setDefectData(response.data);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const defectColumn = [
    {
      title: "Plant",
      field: "PLANT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Process",
      field: "PROCESS",
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
      title: "Batch Wt.",
      field: "BATCH_WT",
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
      title: "Batch UOM",
      field: "BATCH_UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Defect Booking By",
      field: "DefectBookingBy",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Defect Booked on",
      field: "DefectBookedon",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Cast",
      field: "CAST_NO",
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
      field: "MOTHER_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MATERIAL_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material discription",
      field: "RM_MATNR_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      title: "Thickness",
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
      title: "Prime Tube No.",
      field: "NO_OF_PRIME_TUBE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Qlty Cd.",
      field: "QLTY_CD",
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
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order",
      field: "ORD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Order Item",
      field: "ORD_ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Idia",
      field: "IDIA",
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
    // {
    //   title: "Defect Code",
    //   field: "DEFECT_CODE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Defect No.",
    //   field: "DEFECT_NM",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      title: "OPEN(nos)",
      field: "OPEN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "OPEN WT",
      field: "OPEN_WT",
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
      title: "JOINT(nos)",
      field: "JOINT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "JOINT(WT)",
      field: "JOINT_WT",
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
      title: "NEAR JOIN(nos)",
      field: "NEARJOIN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "NEAR JOIN(WT)",
      field: "NEARJOIN_WT",
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
      title: "SETUP(nos)",
      field: "SETUP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SETUP(WT)",
      field: "SETUP_WT",
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
      title: "TOOLMARK(nos)",
      field: "TOOLMARK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "TOOLMARK(WT)",
      field: "TOOLMARK_WT",
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
      title: "SCRATCH(nos)",
      field: "SCRATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SCRATCH(WT)",
      field: "SCRATCH_WT",
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
      title: "PICKUP(nos)",
      field: "PICKUP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "PICKUP(WT)",
      field: "PICKUP_WT",
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
      title: "OVERLAP(nos)",
      field: "OVERLAP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "OVERLAP(WT)",
      field: "OVERLAP_WT",
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
      title: "WEAK WELD(nos)",
      field: "WEAKWELD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WEAK WELD(WT)",
      field: "WEAKWELD_WT",
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
      title: "ROLL MARK(nos)",
      field: "ROLLMARK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ROLL MARK(WT)",
      field: "ROLLMARK_WT",
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
      title: "NFC(nos)",
      field: "NFC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "NFC(WT)",
      field: "NFC_WT",
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
      title: "RUST(nos)",
      field: "RUST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RUST(WT)",
      field: "RUST_WT",
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
      title: "RAW MATERIAL DEFECT(nos)",
      field: "RAWMATERIALDEFECT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "RAW MATERIAL DEFECT(WT)",
      field: "RAWMATERIALDEFECT_WT",
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
      title: "BEND(nos)",
      field: "BEND",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "BEND(WT)",
      field: "BEND_WT",
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
      title: "OTHERS(nos)",
      field: "OTHERS",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "OTHERS(WT)",
      field: "OTHERS_WT",
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
      title: "PITTING MARK(nos)",
      field: "PITTING_MARK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "PITTING MARK(WT)",
      field: "PITTING_MARK_WT",
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
      title: "ID LINE MARK(nos)",
      field: "ID_LINE_MARK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ID LINE MARK(WT)",
      field: "ID_LINE_MARK_WT",
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
      title: "ID BEAD LINE(nos)",
      field: "ID_BEAD_LINE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "ID BEAD LINE(WT)",
      field: "ID_BEAD_LINE_WT",
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
      title: "OD LINE(nos)",
      field: "OD_LINE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "OD LINE(WT)",
      field: "OD_LINE_WT",
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
      title: "SINK_TUBE(nos)",
      field: "SINK TUBE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "SINK_TUBE(WT)",
      field: "SINK TUBE_WT",
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
      title: "VIBRATION(nos)",
      field: "VIBRATION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "VIBRATION(WT)",
      field: "VIBRATION_WT",
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
    //Ended
    {
      title: "Wt(UOM)",
      field: "WT_UOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "WorkCenter(at tubemill)",
      field: "WORKCENTER",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   title: "Qlty Cd",
    //   field: "BATCH_QLTYCD",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Status",
    //   field: "BATCH_STATUS",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Thickness",
    //   field: "THICKNESS",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Odia",
    //   field: "ODIA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Grade",
    //   field: "GRADE",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Order No",
    //   field: "ORDERNO",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Order Item",
    //   field: "ORDERITEM",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Prime Tube Nos",
    //   field: "PRIME_TUBE_NOS",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Idia",
    //   field: "IDIA",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Recorded By",
    //   field: "BATCH_RECORDED_BY",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Recorded On",
    //   field: "BATCH_RECORDED_ON",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
  ];

  const downloadExcelDefectTable = () => {
    if (defectDataTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = defectDataTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LDSM013_Defect_Report" + ".xlsx";

    defectDataTable.download("xlsx", fileName, {
      sheetName: "LDSM013",
    });
  };

  const handleClearAll = (newToken = false) => {
    setSelectedPlant([]);

    setAllValues({});
    setSelectedFrmDt(null);
    setSelectedToDt(null);

    setDefectData([,]);
    setDefectDataTable(null);
    setSelectProcess([]);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Reports" page="Defect Report" />
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
                          Process{" "}
                        </MDTypography>
                        <ReactSelect
                          id="process"
                          options={processDetails}
                          onChange={handleProcessChange}
                          value={selectedProcess}
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
                          Batch ID
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="batch_id"
                          value={allValues.batch_id || ""}
                          onChange={(e) => handleChange(e)}
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
                          Mother Batch
                        </MDTypography>

                        <MDInput
                          type="text"
                          name="mBatch"
                          value={allValues.mBatch || ""}
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
                          {" "}
                          From Date{" "}
                        </MDTypography>
                        <DatePicker
                          id="frmDt"
                          value={selectedFrmDt}
                          onChange={(date) => setSelectedFrmDt(date)}
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
                          To Date{" "}
                        </MDTypography>
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
                          onClick={() => getDefectData(true)}
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
                          Defect Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelDefectTable()}
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
                        <div id="defecttable" />
                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {defectData.length} of{" "}
                          {defectData.length} entries
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
