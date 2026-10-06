import React, { useEffect, useState } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDAlert from "@mui/material/Alert";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import SaveIcon from "@mui/icons-material/Save";
import FunctionsIcon from "@mui/icons-material/Functions";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
// Data
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { DateTime } from "luxon";
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

export default function LDSM004() {
  const [loading, setLoading] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [processListItems, setProcessListItems] = useState([]);
  const [processListItemsTable, setProcessListItemsTable] = useState([]);
  const [odia, setOdia] = useState([]);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = React.useState([]);
  const [selectedProcess, setSelectedProcess] = React.useState([]);
  const [wCenter, setwCenter] = React.useState([]);
  const [selectedWorkCenter, setSelectedWorkCenter] = React.useState([]);
  const [selMbatch, setSelectMbatch] = React.useState([]);
  const [selDbatch, setSelectDbatch] = React.useState([]);
  const [selectIdea, setSelectIdea] = React.useState([]);
  const [selectOdia, setSelectOdia] = React.useState([]);
  const [dateValue, setDateValue] = useState(null);
  const [insertTable, setInsertTable] = useState(null);
  const [insertTableData, setInsertTableData] = React.useState([]);
  const [scarpDt, setScarpDt] = React.useState([]);
  const [modifyTableData, setModifyTableData] = React.useState([]);

  const [insertScrapTable, setInsertScrapTable] = useState(null);
  const [modifyTable, setModifyTable] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [gridModal, setSelectedGridTableModal] = useState(null);
  const [gridData, setGridData] = useState([]);
  const [motherBatch, setMotherBatch] = useState([]);
  const [daughterBatch, setDaughterBatch] = useState([]);
  const [gridtbl, setSelectedGridTable] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState([]);
  var customerTable = React.createRef();
  const [selectedRsnModalTable, setSelectRsnItemModal] = useState(null);
  const [rsnDt, setRsnListDt] = useState([]);
  const [cellPosition, setSelectedCellPosition] = useState(null);
  const [reasonDetailsTable, setReasonDetailsTable] = useState([]);
  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [scrapMatDescList, setScrapMatDescList] = useState([]);
  const [weightBtnSts, setWeightBtnSts] = useState(false);
  const [scheduleBtnSts, setScheduleBtnSts] = useState(false);
  // const [workCenter, setWorkCenter] = React.useState([]);
  const [workCenter, setWorkCenter] = React.useState("SLT1");
  const [productionType, setProductionType] = React.useState("");
  const [qtyType, setQtyType] = React.useState("");
  const [allValues, setAllValues] = useState({
    batchIdMother: "",
    batchIdDaughter: "",
    order: "",
    item: "",
    remarks: "",
  });
  const [tabValue, setTabValue] = useState(0);
  const [sumNetWt, setSumNetWt] = useState(0);
  const [sumSchWt, setSumSchWt] = useState(0);
  // const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [valueRadio, setValueRadio] = React.useState("S");
  const [Merge, setMergetype] = useState(true);
  const [mergeSchedule, setMergetypeSchedule] = useState(true);
  const [copyPrimeDt, setCopyPrimeDT] = React.useState([]);

  const iDia = [{ label: "True", value: "0" }];

  const activity = [
    { value: "SLT", label: "SLIT", id: 1 },
    { value: "REWIND", label: "REWIND", id: 2 },
  ];

  const [selectedActivity, setSelectedActivity] = React.useState("");

  var flagCopy = false;

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
  };

  const [startDateValue, setStartDateValue] = useState(null);
  const [endDateValue, setEndDateValue] = useState(null);

  function fetchData() {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      validateUser(token);
      //page load functions here
      Promise.all([
        getGroupPlantId(token.accessToken),
        getReasonList(token.accessToken),
      ]).finally(() => {
        setLoading(false);
      });
    });
  }

  //page load
  useEffect(() => {
    document.body.style.zoom = "90%";
    fetchData();
  }, []);

  useEffect(() => {
    if (
      tabValue == 0 &&
      insertTableData &&
      insertTableData.length > 0 &&
      (scrapMatDescList &&
        Object.keys(scrapMatDescList).length === 0 &&
        Object.getPrototypeOf(scrapMatDescList) === Object.prototype) == false
    ) {
      setInsertTable(
        new Tabulator("#insertTableDiv", {
          height: 250,
          data: insertTableData,
          columns: insertColumns,
        })
      );

      {
        selectedActivity === "SLIT" &&
          setInsertScrapTable(
            new Tabulator("#scarpTableDiv", {
              height: 250,
              data: scarpDt,
              columns: scrapColumns,
            })
          );
      }
    }
  }, [tabValue, insertTableData, scrapMatDescList, scarpDt, selectedActivity]);

  // useEffect(() => {
  //   if (tabValue == 1 && modifyTableData && modifyTableData.length > 0) {
  //     setModifyTable(
  //       new Tabulator("#modifyTableDiv", {
  //         height: 400,
  //         data: modifyTableData,
  //         columns: modifyColumns,
  //       })
  //     );
  //   }
  // }, [tabValue, modifyTableData]);

  useEffect(() => {
    if (tabValue == 0 && rsnDt && rsnDt.length > 0) {
      setSelectRsnItemModal(
        new Tabulator("#modalTable", {
          height: 300,
          pagination: "local",
          paginationSize: 200,
          data: rsnDt,
          columns: rnsItmClm,
        })
      );
    }
  }, [rsnDt]);

  var rnsItmClm = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
    },
    {
      title: "Reason Code",
      field: "CD_HOLD",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Reason Description",
      field: "CD_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const gridCol = [
    {
      formatter: "rowSelection",
      visible: mergeSchedule,
      width: 50,
      hozAlign: "center",
      frozen: true,
      headerSort: false,
    },
    { field: "LOM_ID_BATCH", title: "Batch Id", width: 150 },
    { field: "LOM_CD_QLTY_ACTL", title: "Qlty" },
    {
      field: "LOM_SEC1",
      title: "Thick",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      field: "LOM_SEC2",
      title: "Odia/Width",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Plan Wt.",
      field: "PLAN_WT",
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
      title: "Schedule Wt. " + qtyType + "",
      field: "SCHD_WT",
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
      field: "INPUT_WT",
      title: "Input Wt. (Ton)",
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
      field: "PROC_WT",
      title: "Proc Wt. (Ton)",
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
      title: "Res Wt. (Ton)",
      field: "LOM_MS_GROSS_CAL",
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
    { title: "Status", field: "LOM_CD_STATUS" },
    {
      title: "Next Proc",
      field: "NEXT_PROC",
    },
    { title: "Plan Proc", field: "EWI_PLANNED_PROC" },
    { title: "Planning Remarks", field: "PLANNING_REMARKS", width: 200 },
    { title: "FG Material", field: "FG_MATERIAL" },
    { title: "FG Material Desc", field: "FG_MATERIAL_DESC" },
    { title: "Order", field: "CUST_ORD" },
    { title: "Item", field: "CUST_ITEM" },
    { title: "RM Material", field: "RM_MATERIAL" },
    { title: "RM Material Desc", field: "RM_MATERIAL_DESC" },
    { title: "SFG Material", field: "SFG_MATERIAL" },
    { title: "SFG Material Desc", field: "SFG_MATERIAL_DESC" },
    { title: "Grade", field: "GRADE" },
    { title: "Work Center", field: "WORK_CENTER" },
    {
      field: "LOM_LENGTH",
      title: "Input Length",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { field: "LOM_TDC_ACTL", title: "Tdc" },

    {
      title: "Scrap Wt. (Ton)",
      field: "LOM_MS_SCRAP",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    { title: "Schedule CRT Date", field: "SCHD_CRT_DT" },
    { title: "Customer Name", field: "CUST_NM" },
  ];

  useEffect(() => {
    if (gridData && gridData.length > 0) {
      setSelectedGridTable(
        new Tabulator("#gridTable", {
          data: gridData,
          columns: gridCol,
          layout: "fitDataFill",
          //height: 250,
        })
      );
    }
  }, [gridData]);

  useEffect(() => {
    setTimeout(() => {
      //added timout and useeffect for performance issue --- sourav
      if (selMbatch ? selMbatch.value : null != null) {
        if (gridtbl != null) {
          gridtbl.selectRow();
        }
      }
    }, 1000);
  }, [gridtbl]);

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
      var pageName = "LD50S003";

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

  const getGroupPlantId = async (accessToken) => {
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
      var url = "api/LD50S003/getGroupPlant";
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
            setSelectedPlant(items[0]);
            Promise.all([
              getProcessList(items[0], accessToken),
              getScrapMatNo(items[0], accessToken),
              //getNoMergeDetails(items[0], accessToken),
            ]).finally(() => {
              resolve();
            });
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getProcessList = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LD50S003/getProcessList";
      let data = {
        plant: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            var items = [];
            var tableItems = {};
            response.data.map((row) => {
              var obj = new Object();
              obj.label = row[0];
              obj.value = row[1];
              items.push(obj);
              tableItems[row[0]] = row[1];
            });
            setProcessListItems(items);
            setProcessListItemsTable(tableItems);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getMotherBatchProcess = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LD50S003/getMCoilList";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            if (response.data) {
              var items = [];
              response.data.map((row) => {
                var obj = new Object();
                obj.label = row[0];
                obj.value = row[0];
                items.push(obj);
              });
              setMotherBatch(items);
            } else {
              alertify.error("No Data Found");
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getODIA = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };
      var url = "api/LD50S003/getODIA";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            var items = response.data.map(([value]) => ({
              label: value.toFixed(3),
              value,
            }));
            setOdia(items);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getShift = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      setLoading(true);
      var url = "api/LD50S003/getShiftStatus";

      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            setSelectedStatus({ value: response.data[0][0] });
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handlePlantChange = (value) => {
    clearFilterOnPlant();
    setSelectedPlant(value);
    if (value) {
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getProcessList(value, token.accessToken),
          getScrapMatNo(value, token.accessToken),
          //getNoMergeDetails(value, token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleProcessChange = (value) => {
    setSelectedProcess(value);
    if (Merge == false) {
      if (value ? value.value == "M" : null) {
        setMergetype(false);
      } else {
        setMergetype(true);
      }
    }
    if (value) {
      setSelectMbatch([]);
      setGridData([]);
      setInsertTableData([]);
      setScarpDt([]);
      setLoading(true);
      GetAuthorization().then((token) => {
        Promise.all([
          getODIA(value, token.accessToken),
          getPType(value, token.accessToken),
          // getWorkCenterFilter(value, token.accessToken),
          getMotherBatchProcess(value, token.accessToken),
          getShift(token.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const getPType = async (value, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LD50S003/getProductionType";
      let data = {
        Plant: selectedPlant.value,
        Process: value.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            setProductionType(response.data[0][0]);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const getActivity = async (batchId, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LD50S003/getActivity";
      let data = {
        batchId: batchId?.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            //reject(response.statusText);
            resolve();
          } else {
            if (
              res.data?.[1]?.[0]?.EWI_CAMP_NO !== undefined &&
              res.data?.[1]?.[0]?.EWI_CAMP_NO.length !== 0
            ) {
              setSelectedActivity(res.data[1]?.[0]?.EWI_CAMP_NO);
            }
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  const handleMotherBatchChange = (value) => {
    setSelectMbatch(value);
    setGridData([,]);
    setInsertTableData([,]);
    setScarpDt([,]);
    setSelectedActivity("");
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getActivity(value, token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  // Call on Submit button
  let resLen = 0;
  const getData = async () => {
    if (selectedPlant != null) {
      setInsertTableData([]);
      setSumNetWt(0);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(false);
      setSaveMsg("");
      setWeightBtnSts(false);
      setLoading(true);

      var prodStartDateVal = document.getElementById("prodStartDate").value;
      var prodEndDateVal = document.getElementById("prodEndDate").value;
      GetAuthorization().then((token) => {
        var defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };

        if (tabValue == 0) {
          if (selectedProcess == null || selectedProcess.value == undefined) {
            alertify.error("Please select Process");
            setLoading(false);
            return;
          }
          if (dateValue != null) {
            var d = new Date(dateValue);
            var prodDt =
              ("0" + d.getDate()).slice(-2) +
              "-" +
              d.toString().substr(4, 3) +
              "-" +
              d.getFullYear();
          } else {
            alertify.error("Please select Prod Dt for batch create");
            setLoading(false);
            return;
          }

          if (prodStartDateVal == "") {
            alertify.error("Please select Prod Start Dt for batch create");
            setLoading(false);
            return;
          }

          if (prodEndDateVal == "") {
            alertify.error("Please select Prod End Dt for batch create");
            setLoading(false);
            return;
          }

          if (selectedProcess.value != "M" && selMbatch == null) {
            alertify.error("Please select Mother Batch");
            setLoading(false);
            return;
          }

          var urlbatchDtl = "api/LD50S003/getBatchDtl";
          var databatchDtl = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Batch: selMbatch ? selMbatch.value : "",
            ProcLine: selectedProcess ? selectedProcess.value : "",
          };
          axiosAPI
            .post(urlbatchDtl, databatchDtl, defaultOptions)
            .then((response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                //reject(response.statusText);
              } else {
                if (response.data[1]) {
                  setGridData(response.data[1]);
                  setLoading(false);
                } else {
                  alertify.error("No Data Found");
                  setGridData([,]);
                  setLoading(false);
                }
              }
            })
            .catch((error) => {
              setLoading(false);
            });

          var pushBatch;
          var urlpdi = "api/LD50S003/getPdiDtl";

          var datapdi = {
            Plant: selectedPlant.value ? selectedPlant.value : "",
            Batch: selMbatch ? selMbatch.value : "",
            Process: selectedProcess.value,
            ProdDate: prodDt,
            MBatch: selMbatch ? selMbatch.value : "",
            BusUnit: "TUBES",
            Odia: selectOdia.value ? selectOdia.value : "",
            status: selectedStatus.value,
            prodEndDt: endDateValue,
          };
          axiosAPI
            .post(urlpdi, datapdi, defaultOptions)
            .then(async (response) => {
              if (response.statusText != "" && response.statusText != "OK") {
                //reject(response.statusText);
              } else {
                if (response.data == false) {
                  alertify.error(
                    "Mill code not found please correct the schedule"
                  );
                  return;
                }

                resLen = response.data[1].length;

                if (response.data[1].length != 0) {
                  // setInsertTableData(response.data[1]);
                  const updatedData = response.data[1].map((item) => ({
                    ...item,
                    BATCH_ID:
                      selectedActivity === "SLIT"
                        ? item.BATCH_ID
                        : selMbatch?.value,
                  }));
                  setInsertTableData(updatedData);
                } else {
                  // setInsertTableData([]);
                  setInsertTableData([
                    {},
                    ...[...Array(4)].map((it, i) => ({ id: i + 1 })),
                  ]);
                  setSumNetWt(0);
                  alertify.error("No Data Found");
                }
              }
            })
            .catch((error) => {})
            .finally((f) => {
              // Call Scrap Table
              if (resLen != 0 && selectedActivity !== "REWIND") {
                var scarpUrl = "api/LD50S003/getScrapProductionTable";
                var d = {
                  Plant: selectedPlant.value ? selectedPlant.value : "",
                  MBatch: selMbatch ? selMbatch.value : "",
                  Process: selectedProcess.value,
                };

                axiosAPI
                  .post(scarpUrl, d, defaultOptions)
                  .then((response) => {
                    if (
                      response.statusText != "" &&
                      response.statusText != "OK"
                    ) {
                    } else {
                      var result = response.data[1].map(function (el) {
                        var o = Object.assign({}, el);
                        o.ORDER_ID = pushBatch
                          ? pushBatch[0].EWI_ID_ORDER_CUS
                          : "";
                        o.ITEM = pushBatch
                          ? pushBatch[0].EWI_ID_ORD_ITEM_CUS
                          : "";
                        return o;
                      });
                      setScarpDt(result);
                    }
                  })
                  .finally((f) => {});
                // Call Scrap Table End
              }
            });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
      alertify.error("Please Select Plant!");
    }
  };

  const convertToDate = (str) => {
    try {
      var dateTimeArr = str.split(" ");
      var dateArr = dateTimeArr[0].split("-");
      var timeArr = dateTimeArr[1].split(":");
      var newDate = new Date(
        Number(dateArr[2]),
        Number(dateArr[1]) - 1,
        Number(dateArr[0]),
        Number(timeArr[0]),
        Number(timeArr[1])
      );
      return newDate;
    } catch {
      return null;
    }
  };

  // const onClickOutside = (e) => {
  //   if (insertTable != null) {
  //     var selectedRows = insertTable.getSelectedRows();
  //     if (selectedRows.length == 0) {
  //       alertify.error("Please select Prime Production table rows");
  //       return;
  //     }
  //   }

  //   if (insertScrapTable != null) {
  //     var selectedRowsScrap = insertScrapTable.getSelectedRows();
  //     if (selectedRowsScrap.length == 0) {
  //       alertify.error("Please select Scrap Production table rows");
  //       return;
  //     }
  //   }
  // };

  React.useEffect(() => {
    //added useEffect for hang issue --- sourav
    if (scheduleBtnSts == true) {
      gridtbl?.on("rowSelectionChanged", function (data, rows) {
        setWeightBtnSts(false);
        setSumNetWt(0);
        setSumSchWt(0);
        setInsertTableData([,]);
        setScarpDt([,]);
      });
    }
  }, [scheduleBtnSts, gridtbl]);

  if (insertScrapTable != null) {
    insertScrapTable.on("rowSelectionChanged", function (data, rows) {
      if (weightBtnSts == true) {
        setWeightBtnSts(false);
        setSumNetWt(0);
        setSumSchWt(0);
      }
    });
  }

  if (insertTable != null) {
    insertTable.on("rowSelectionChanged", function (data, rows) {
      if (weightBtnSts == true) {
        setWeightBtnSts(false);
        setSumNetWt(0);
        setSumSchWt(0);
      }
    });
  }

  const formatSysdate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace("Sept", "Sep")
      .toUpperCase()
      .replace(/ /g, "-");
  };

  // Call on Save button
  const insertSlitProd = async () => {
    if (selectedActivity === null) {
      alertify.error("Please select Activity!");
      return;
    }
    var selectedRows = insertTable.getSelectedRows();
    var selectedRowsScrap = insertScrapTable?.getSelectedRows();
    var url = "api/LD50S003/insertSlitProd";

    var newData = [];
    var scrapData = [];

    var invalidRow = false;
    var errDateMissing = false;
    var errDateValid = false;
    var errReason = false;
    var errRemarks = false;
    var totalNetWt = 0;
    var resWtBalance = 0;
    var errDateValidchk = true;
    selectedRows.forEach(function (item) {
      // var start = item._row.data.prdPStartDt;
      var start = startDateValue;
      // var end = item._row.data.prdPEndDt;
      var end = endDateValue;

      if (!start || start == "") {
        alertify.error("Both production start and end dates are required !");
        invalidRow = true;
        errDateMissing = true;
      }
      if (!end || end == "") {
        alertify.error("Both production start and end dates are required !");
        invalidRow = true;
        errDateMissing = true;
      }

      var startDt = convertToDate(start);
      var endDt = convertToDate(end);

      var difference = endDt.getTime() - startDt.getTime();
      var resultInMinutes = Math.round(difference / 60000);
      // Reducing the time duration for Husor plant.
      //if (resultInMinutes < 30) {
      //if (resultInMinutes < 10) {
      //     errDateValidchk = false;
      //     alertify.error("Minimum activity duration should be more than 10 min ! ");
      //     return;
      //} else
      if (resultInMinutes < 0) {
        errDateValidchk = false;
        alertify.error(
          "Prod start date cannot be greater than prod end date ! "
        );
        return;
      } else if (resultInMinutes > 150) {
        errDateValidchk = false;
        alertify.error(
          "Maximum activity duration should not exceed 150 min ! "
        );
        return;
      }

      if (startDt > endDt) {
        alertify.error("Production end date cannot be prior to start date !");
        invalidRow = true;
        errDateValid = true;
      } else {
        var timeDiff = (endDt - startDt) / (1000 * 60 * 60); // time diff in hrs
        item._row.data.prdTimeDiff = timeDiff;
      }

      var rsnSelect = item._row.data.ddlRsnHold;
      if (!rsnSelect) {
        item.ddlRsnHold = "N";
      } else {
        if (rsnSelect == "Y") {
          var code = item._row.data.CD_HOLD;
          if (!code || code == "") {
            alertify.error("Please select reason");
            invalidRow = true;
            errReason = true;
          }
          var remarks = item._row.data.HOLD_OP_REMARKS;
          if (!remarks || remarks.length == 0) {
            alertify.error("Please fill operator remarks");
            invalidRow = true;
            errRemarks = true;
          }
        }
      }
      totalNetWt += Number(item._row.data.EWI_MS_PIECE_ACTL);
      newData.push(item._row.data);
    });

    if (errDateValidchk == false) {
      return;
    }

    selectedRowsScrap?.forEach(function (item) {
      var rsnSelect = item._row.data.ddlRsnHold;
      if (!rsnSelect) {
        item.ddlRsnHold = "P1";
      } else {
        if (rsnSelect == "Y") {
          var code = item._row.data.CD_HOLD;
          if (!code || code == "") {
            alertify.error("Please select reason");
            invalidRow = true;
            errReason = true;
          }
        }
      }

      totalNetWt += Number(item._row.data.NET_WT);
      scrapData.push(item._row.data);
    });

    var batchDetails = gridData[0];
    var resWt_batchDtl = batchDetails.LOM_MS_GROSS_CAL;
    var scrpWt_batchDtl = batchDetails.LOM_MS_SCRAP;
    var schdlWt_batchDtl = batchDetails.SCHD_WT;

    setSumNetWt(totalNetWt);
    if (invalidRow) {
      if (errDateMissing) {
        alertify.error("Both production start and end dates are required !");
      }
      if (errDateValid) {
        alertify.error("Production end date cannot be prior to start date !");
      }
      if (errReason) {
        alertify.error("Please select reason");
      }
      if (errRemarks) {
        alertify.error("Please select remarks");
      }
      return;
    }

    resWtBalance = Number(scrpWt_batchDtl) - totalNetWt;
    if (resWtBalance < 0) {
      resWtBalance = 0;
    }
    var prdPDt = "";
    if (dateValue != null) {
      // var prdPDtStr = dateValue.toLocaleDateString('en-GB', {
      //     day: '2-digit', month: 'short', year: 'numeric'
      // });
      // prdPDt = prdPDtStr.replace('/', '-').replace('/', '-');
      var d = new Date(dateValue);
      prdPDt =
        ("0" + d.getDate()).slice(-2) +
        "-" +
        d.toString().substr(4, 3) +
        "-" +
        d.getFullYear();
    }

    var setBatchType = "";
    var selectedGridTable = gridtbl.getData();

    if (valueRadio == "M") {
      setBatchType = selectedGridTable[0].LOM_ID_BATCH;
    } else {
      var selectedRows = gridtbl.getSelectedRows();
      let d = selectedRows[0]._row.data.LOM_ID_BATCH;
      if (selMbatch.length != 0 || selMbatch.value != undefined) {
        setBatchType = selMbatch.value;
      } else {
        setBatchType = d;
      }
    }
    var data = {
      newData: newData,
      scrapData: scrapData,
      user: serverDetails.PersonalNo,
      Plant: selectedPlant.value ? selectedPlant.value : "",
      Batch: setBatchType, //Merge Batch/ Mother Batch
      Process: selectedProcess.value,
      ProdDate: prdPDt,
      Shift: selectedStatus.value,
      MBatch: selMbatch.value,
      BusUnit: "TUBES",
      Odia: selectOdia.value ? selectOdia.value : "",
      status: selectedStatus.value,
      order: "", //allValues.order,
      item: "", //allValues.item,
      totalNetWt: totalNetWt,
      resWt: resWtBalance,
      activity: selectedActivity.value,
      startDt: startDateValue, //formatSysdate(startDateValue),
      endDt: endDateValue, //formatSysdate(endDateValue),
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
            alertify.error(response?.error?.response?.data?.name);
            return;
          } else {
            setLoading(false);
            if (response.data) {
              var res = response.data.errorString.toString();
              if (res.toString().startsWith("N-")) {
                setShowSaveMsgSuccess(false);
                setShowSaveMsgError(true);
                setSaveMsg(res);
                alertify.error(res);
                return;
              } else {
                setShowSaveMsgSuccess(true);
                setShowSaveMsgError(false);
                setSaveMsg(res);
                setInsertTableData([,]);
                setScarpDt([,]);
                setGridData([,]);
                alertify.success(res);
                return;
              }
            } else {
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
              setSaveMsg("Error Occured !");
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
      setLoading(false);
    });
  };

  // Call on weight calcuation button
  const checkWeightCalculation = async () => {
    var selectedRows = insertTable?.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select Prime Production table rows");
      return;
    }
    var totalPrimeWt = 0; //To strore sum of prime batches in pdi grid
    selectedRows.forEach(function (item) {
      totalPrimeWt += Number(item._row.data.EWI_MS_PIECE_ACTL);
    });

    let netWtScrap = 0;
    var selectedRowsScrap = insertScrapTable.getSelectedRows();

    var totalScrapWt = 0; //to store scrap value in scrap grid
    selectedRowsScrap.forEach(function (item) {
      totalScrapWt += Number(item._row.data.NET_WT);
    });

    if (totalScrapWt === 0 && selectedRowsScrap?.length > 0) {
      alertify.error(
        "Scrap value cannot be 0. Pls enter value or deselect scrap row"
      );
      return;
    }

    var sumPrimeScrap = Number(totalPrimeWt) + Number(totalScrapWt);
    var totalInputWt = 0;
    // if (valueRadio == "M") {
    var selectedGridTable = gridData;
    selectedGridTable?.forEach(function (item) {
      totalInputWt += Number(item.PLAN_WT);
    });

    // } else {
    //   var selectedGridTable = gridtbl?.getSelectedRows();
    //   selectedGridTable.forEach(function (item) {
    //     totalInputWt += Number(item._row.data.PLAN_WT);
    //   });
    // }

    var primeScrap = sumPrimeScrap.toFixed(3); //this is sum of prime + scrap
    var totalResWt = totalInputWt.toFixed(3); //plan wt from 1st grid

    console.log("primeScrap: ", primeScrap);
    console.log("totalResWt: ", totalResWt);
    setSumSchWt(totalInputWt);
    setSumNetWt(totalPrimeWt);

    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD50S003/getResqtyval";
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : null,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
          } else {
            var resqtyvalresp = Number(response.data[0][0]);
            if (primeScrap != totalResWt) {
              alertify.error(
                "Sum of prime & Scrap(" +
                  primeScrap +
                  ") should match with Plan Wt(" +
                  totalResWt +
                  ")."
              );
              return;
            }
            if (selectedRowsScrap.length == 0 && selectedActivity === "SLIT") {
              alertify.confirm(
                "Scrap row is not selected , in this case scrap will not be posted. Will you continue without scrap ?",
                "",
                function () {
                  setSumSchWt(totalInputWt);
                  setSumNetWt(sumPrimeScrap);

                  //totalInputWt= calculated res wt. (04.12.23)/ sumPrimeScrap <= totalInputWt
                  if (
                    totalResWt - primeScrap <= resqtyvalresp &&
                    totalResWt - primeScrap > 0
                  ) {
                    alertify.error(
                      "Total Net wt(Prime + Scrap)(" +
                        primeScrap +
                        ") must be equal to Res wt(" +
                        totalResWt +
                        ")."
                    );
                    setWeightBtnSts(false);
                    return;
                  } else if (
                    totalResWt - primeScrap > resqtyvalresp ||
                    totalResWt == primeScrap
                  ) {
                    setWeightBtnSts(true);
                  } else {
                    alertify.error(
                      "Total Net wt(Prime + Scrap)(" +
                        primeScrap +
                        ") must be equal to Res wt(" +
                        totalResWt +
                        ")."
                    );
                    setWeightBtnSts(false);
                    return;
                  }
                },
                function () {
                  setWeightBtnSts(false);
                }
              );
            } else {
              setSumSchWt(totalInputWt);
              setSumNetWt(sumPrimeScrap);

              if (
                totalResWt - primeScrap <= resqtyvalresp &&
                totalResWt - primeScrap > 0
              ) {
                alertify.error(
                  "Total Net wt(Prime + Scrap)(" +
                    primeScrap +
                    ") must be equal to Res wt(" +
                    totalResWt +
                    ")."
                );
                setWeightBtnSts(false);
                return;
              } else if (
                totalResWt - primeScrap > resqtyvalresp ||
                totalResWt == primeScrap
              ) {
                setWeightBtnSts(true);
                return;
              } else {
                alertify.error(
                  "Total Net wt(Prime + Scrap)(" +
                    primeScrap +
                    ") must be equal to Res wt(" +
                    totalResWt +
                    ")."
                );
                setWeightBtnSts(false);
                return;
              }
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  var copyArr = [];

  const copyTable = async (cell) => {
    if (cell._cell.row.data.EWI_ID_ORDER_CUS != undefined) {
      copyArr = [];
      let dt = cell._cell.row.data;
      copyArr.push(dt);
      alertify.success("Copied!!");
      flagCopy = true;
    } else if (
      cell._cell.row.data.EWI_ID_ORDER_CUS == undefined &&
      flagCopy == false
    ) {
      alertify.error("Please click on row which you want to copy !!");
      flagCopy = false;
    } else {
      // if (productionType != "SFG") {
      //     alertify.error("Extra lot creation is not applicable for WIP Production");
      //     return;
      // };

      var array = insertTableData;
      var data = cell.getRow().getData();
      setSelectedCellPosition(cell._cell.row.position);
      var index = array.findIndex(({ id }) => id === cell._cell.row.data.id);

      if (dateValue != null) {
        // var prodDt = dateValue.toLocaleDateString('en-GB', {
        //     day: '2-digit', month: 'short', year: 'numeric'
        // }).replace(/ /g, '-');
        var d = new Date(dateValue);
        var prodDt =
          ("0" + d.getDate()).slice(-2) +
          "-" +
          d.toString().substr(4, 3) +
          "-" +
          d.getFullYear();
      } else {
        alertify.error("Please select Prod Dt for batch create");
        return;
      }

      setLoading(true);
      var url = "api/LD50S003/getBatchCount";
      var data = {
        Plant: selectedPlant.value ? selectedPlant.value : "",
        ProdDate: prodDt,
        MBatch: selMbatch.value,
        status: selectedStatus.value,
        Process: selectedProcess.value,
        count: cell._cell.row.position,
      };
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
            } else {
              array[index] = {
                id: cell._cell.row.position - 1,
                EWI_ID_WRK_INST: "", //insertTableData[0].EWI_ID_WRK_INST,
                BATCH_ID: response.data[0][0],
                EWI_ID_SCHEDULE: copyArr[0].EWI_ID_SCHEDULE,
                EWI_ID_ORDER_CUS: copyArr[0].EWI_ID_ORDER_CUS,
                EWI_ID_ORD_ITEM_CUS: copyArr[0].EWI_ID_ORD_ITEM_CUS,
                RM_PROD: copyArr[0].RM_PROD,
                EWI_CD_PROD: copyArr[0].EWI_CD_PROD,
                GRD_DESC: copyArr[0].GRD_DESC,
                EWI_CD_QLTY: copyArr[0].EWI_CD_QLTY,
                EWI_SEC1: copyArr[0].EWI_SEC1,
                NEXT_PROC: copyArr[0].NEXT_PROC,
                EWI_SEC2: copyArr[0].EWI_SEC2,
                EWI_LENGTH: copyArr[0].EWI_LENGTH,
                EWI_NO_PIECES: copyArr[0].EWI_NO_PIECES,
                EWI_MS_PIECE_ACTL: copyArr[0].EWI_MS_PIECE_ACTL,
                ddlWorkCenter: copyArr[0].ddlWorkCenter,
                EWI_MS_PIECE_ACTL: copyArr[0].EWI_MS_PIECE_ACTL,
                FG_MAT: copyArr[0].FG_MAT,
                FG_MAT_DESC: copyArr[0].FG_MAT_DESC,
                SFG_MAT: copyArr[0].SFG_MAT,
                RM_MAT: copyArr[0].RM_MAT,
                RM_MAT_DESC: copyArr[0].RM_MAT_DESC,
                ODIA: copyArr[0].ODIA,
                IDIA: copyArr[0].IDIA,
                SPEC: copyArr[0].SPEC,
                EWI_PLANNED_PROC: copyArr[0].EWI_PLANNED_PROC,
              };
              var table = cell._cell.row.table;
              table.replaceData(array);
              setInsertTableData(array);
            }
          })
          .finally((f) => {
            setLoading(false);
          });
      });
    }
  };

  const getReasonList = async (accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LD50S003/getRsnDetails";
      axiosAPI
        .post(url, {}, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var tableItems = {};
            response.data.map((row) => {
              var rowArr = row.split(":");
              tableItems[rowArr[0]] = rowArr[0] + "--" + rowArr[1];
            });
            setReasonDetailsTable(tableItems);
          }
        })
        .finally((f) => {
          resolve();
        });
    });
  };

  //scrap material api call
  const getScrapMatNo = async (plant, accessToken) => {
    return new Promise((resolve) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      };

      var url = "api/LDSM048/scrapmatno";
      var data = {
        plant: plant.value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            resolve();
          } else {
            var items = {};
            response.data.map((row) => {
              var obj = new Object();
              var rowArr = row.split(":");
              obj.label = rowArr[0] + "-" + rowArr[1];
              obj.value = rowArr[0];
              items[obj.value] = obj.label;
            });
            setScrapMatDescList(items);
          }
        })
        .finally((f) => {
          resolve();
          return true;
        });
    });
  };

  //check for editable field
  var editCheckFGMat = function (cell) {
    var data = cell.getRow().getData();
    return data.EWI_CD_QLTY == "SCRP" || data.EWI_CD_QLTY == "INVL";
  };

  const insertColumns = [
    {
      title:
        '<input type="checkbox" class="select-all-row" aria-label="select all rows" />',
      field: "IsSelected",
      formatter: function (cell, formatterParams, onRendered) {
        return '<input type="checkbox" class="select-row" aria-label="select this row" />';
      },
      width: 50,
      headerSort: false,
      headerFilter: false,
      cssClass: "text-center",
      frozen: true,
      //tooltips: false,
      resizable: false,
      cellClick: function (e, cell) {
        var element = cell.getElement();
        var chkbox = element.querySelector(".select-row");

        if (cell.getData().IsSelected) {
          cell.getRow().deselect();
          document.querySelector(".select-all-row").checked = false;
        } else {
          cell.getRow().select();
          if (
            cell.getColumn().getTable().getSelectedRows().length ===
            cell.getColumn().getTable().getDataCount()
          ) {
            document.querySelector(".select-all-row").checked = true;
          }
        }
        chkbox.checked = !cell.getData().IsSelected;
        cell.getData().IsSelected = !cell.getData().IsSelected;
      },
      headerClick: function (e, column) {
        if (
          column.getTable().getSelectedRows().length !==
          column.getTable().getDataCount()
        ) {
          document
            .querySelectorAll(".select-row,.select-all-row")
            .forEach((cb) => (cb.checked = true));
          column.getTable().selectRow();
        } else {
          document
            .querySelectorAll(".select-row,.select-all-row")
            .forEach((cb) => (cb.checked = false));
          column.getTable().deselectRow();
        }
        column
          .getCells()
          .forEach(
            (cell) => (cell.getData().IsSelected = !cell.getData().IsSelected)
          );
      },
    },
    {
      field: "EWI_ID_WRK_INST",
      title: "ID PDI",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      frozen: true,
      // cellClick: function (e, cell) {
      //   {
      //     copyTable(cell, true);
      //   }
      // },
    },
    {
      field: "BATCH_ID",
      title: "Batch No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 150,
      cellClick: function (e, cell) {
        {
          copyTable(cell, true);
        }
      },
    },

    {
      field: "EWI_ID_SCHEDULE",
      title: "Schedule Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      visible: false,
    },

    {
      field: "EWI_ID_ORDER_CUS",
      title: "Order Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      field: "EWI_ID_ORD_ITEM_CUS",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      field: "ODIA",
      title: "Odia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
    },
    {
      field: "IDIA",
      title: "Idia",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
    },
    {
      title: "Qlty",
      field: "EWI_CD_QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Grade",
      field: "EWI_NO_TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
    },
    {
      title: "Thick",
      field: "EWI_SEC1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      field: "EWI_SEC2",
      title: "Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: selectedActivity === "REWIND" ? null : "input",
      formatter: function (cell, formatterParams) {
        if (selectedActivity === "SLIT") {
          var value = cell?.getValue();
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          let val = parseFloat(value)?.toFixed(3);
          console.log(val);
          return val;
        } else {
          var value = cell.getValue();
          cell.getElement().style["background-color"] = "";
          cell.getElement().style["color"] = "";
          return value;
        }
      },
      // cellEdited: (cell) => {
      //   var value = cell.getValue();
      //   cell.setvalue(value);
      // },
    },
    {
      field: "EWI_LENGTH",
      title: "Length(m)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        }
      },
    },
    {
      field: "EWI_MS_PIECE_ACTL",
      title: "Net Wt. ", //+ qtyType + "",
      hozAlign: "right",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: selectedActivity === "REWIND" ? null : "input",
      formatter: function (cell, formatterParams) {
        if (selectedActivity === "SLIT") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
          var value = cell.getValue();
          // if (value != undefined) {
          var d = parseFloat(value).toFixed(3);
          console.log("d: ", d);
          return d;
        } else {
          var value = cell.getValue();
          cell.getElement().style["background-color"] = "";
          cell.getElement().style["color"] = "";
          return value;
        }

        // if (value.length == 5 && value != undefined) {
        //   return value;
        // } else if (value != "") {
        //   var d = parseFloat(value).toFixed(3);
        //   return d;
        // }
        // }
        // else {
        //   return 0;
        // }
      },
      //cellEdited: updateGrossWt,
      cellEdited: (cell) => {
        setWeightBtnSts(false);
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },

    {
      field: "prdPStartDt",
      title: "Prod Start Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      // width: 210,
      visible: false,
    },
    {
      field: "prdPEndDt",
      title: "Prod End Dt",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      visible: false,
      // width: 210,
      // editor: dateEditorLux,
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
    },

    {
      field: "prdTimeDiff",
      title: "prdTimeDiff",
      visible: false,
      download: false,
    },
    {
      field: "NEXT_PROC",
      title: "Next Proc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: processListItemsTable,
      },
      //formatter: "lookup",
      formatterParams: processListItemsTable,
    },
    {
      field: "ddlRsnHold",
      title: "Hold Flag",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "select",
      visible: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: [
          { label: "Y", value: "Y" },
          { label: "N", value: "N" },
        ],
      },
    },
    {
      field: "CD_HOLD",
      title: "Hold Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      minWidth: 200,
      editor: "list",
      visible: false,
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: reasonDetailsTable,
      },
      //formatter: "lookup",
      formatterParams: reasonDetailsTable,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "HOLD_OP_REMARKS",
      title: "Operator Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      minWidth: 200,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "FG_MAT",
      title: "FG Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editable: editCheckFGMat,
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: scrapMatDescList,
      },
      //formatter: "lookup",
      formatterParams: scrapMatDescList,
    },
    {
      title: "FG Material Desc",
      field: "FG_MAT_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SFG_MAT",
      title: "SFG Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SFG_MAT_DESC",
      title: "SFG Material Desc",
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
      title: "RM Material Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "SPEC",
      title: "Spec",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const scrapColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    // {
    //     "title": "ID PDI", "field": "IDPDI", "headerFilter": "input", "headerFilterPlaceholder": "search...", width: 200, frozen: true, formatter: function (cell, formatterParams) {
    //         var value = cell.getValue();
    //         cell.getElement().style["background-color"] = "#DA8EE7";
    //         cell.getElement().style["color"] = "#FFFFFF";
    //         return value;
    //     }
    // },
    {
      title: "Scrap Batch Id",
      field: "SCRAP_BATCH_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 190,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Order Id",
      field: "ORDER_ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 150,
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 100,
    },
    {
      title: "QLTY",
      field: "QLTY",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      width: 150,
    },
    {
      title: "Net Wt. " + qtyType + "",
      field: "NET_WT",
      headerFilter: "input",
      hozAlign: "right",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 120,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (value != undefined) {
          if (value.length == 5 && value != undefined) {
            return value;
          } else if (value != "") {
            var d = parseFloat(value).toFixed(3);
            return d;
          }
        } else {
          return 0;
        }
      },
      //cellEdited: updateGrossWtScrap,
      cellEdited: (cell) => {
        setWeightBtnSts(false);
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      title: "Material",
      field: "MATERIAL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
    {
      title: "Material Desc",
      field: "MATERIAL_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // width: 250,
    },
  ];

  const clearFilter = () => {
    setSelectedPlant([]);
    setSelectedProcess([]);
    setSelectMbatch([]);
    setSelectOdia([]);
    setSelectIdea([]);
    setAllValues({});
    setSelectedWorkCenter([]);
    setGridData([]);
    setInsertTableData([,]);
    setSumNetWt(0);
    setDateValue(null);
    setStartDateValue(null);
    setEndDateValue(null);
    setScarpDt([,]);
    setSelectedActivity("");
  };

  const clearFilterOnPlant = () => {
    setSelectedProcess([]);
    setSelectMbatch([]);
    setSelectOdia([]);
    setSelectIdea([]);
    setAllValues({});
    setMotherBatch([]);
    setGridData([]);
    setSelectedWorkCenter([]);
    setInsertTableData([,]);
    setSumNetWt(0);
    setDateValue(null);
    setStartDateValue(null);
    setEndDateValue(null);
    setScarpDt([,]);
  };

  const clearFilterOnDate = () => {
    setGridData([]);
    setInsertTableData([]);
    setScarpDt([]);
  };

  const handleClickOpen = (cell) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    var rsnDt = selectedRsnModalTable.getSelectedRows();
    var selectedTable = insertTable.getData();
    if (rsnDt.length > 1) {
      alertify.error("Only one row can be selected !");
      return;
    }

    var table = selectedTable;
    var index;
    var clickPos = cellPosition - 1;
    if (cellPosition !== null && cellPosition !== 1) {
      index = insertTableData.findIndex(({ id }) => id === clickPos);
    } else {
      index = 0;
    }
    var array = insertTableData;
    array[index] = {
      id: index,
      EWI_ID_WRK_INST: insertTableData[0].EWI_ID_WRK_INST,
      EWI_ID_SCHEDULE: insertTableData[0].EWI_ID_SCHEDULE,
      EWI_ID_ORDER_CUS: insertTableData[0].EWI_ID_ORDER_CUS,
      EWI_ID_ORD_ITEM_CUS: insertTableData[0].EWI_ID_ORD_ITEM_CUS,
      RM_PROD: insertTableData[0].RM_PROD,
      EWI_CD_PROD: insertTableData[0].EWI_CD_PROD,
      CD_HOLD: rsnDt[0]._row.data.CD_HOLD,
      CD_DESC: rsnDt[0]._row.data.CD_DESC,
      EWI_SEC2: insertTableData[0].EWI_SEC2,
      Qlty: insertTableData[0].Qlty,
      Thick: insertTableData[0].Thick,
      ddlRsnHold: "Y",
      NEXT_PROC: insertTableData[0].NEXT_PROC,
      EWI_LENGTH: insertTableData[0].EWI_LENGTH,
      EWI_NO_PIECES: insertTableData[0].EWI_NO_PIECES,
      EWI_MS_PIECE_ACTL: insertTableData[0].EWI_MS_PIECE_ACTL,
      EWI_MS_PIECE_ACTL: insertTableData[0].EWI_MS_PIECE_ACTL,
      FG_MAT: insertTableData[0].FG_MAT,
      FG_MAT_DESC: insertTableData[0].FG_MAT_DESC,
      SFG_MAT: insertTableData[0].SFG_MAT,
      RM_MAT: insertTableData[0].RM_MAT,
      RM_MAT_DESC: insertTableData[0].RM_MAT_DESC,
      ODIA: insertTableData[0].ODIA,
      IDIA: insertTableData[0].IDIA,
      GRD_DESC: insertTableData[0].GRD_DESC,
      EWI_CD_QLTY: insertTableData[0].EWI_CD_QLTY,
      EWI_SEC1: insertTableData[0].EWI_SEC1,
    };
    insertTable.replaceData(array);
    setInsertTableData(array);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="HR/CR Scheduling"
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
        ></BootstrapDialogTitle>
        <DialogContent>
          <div id="modalTable"></div>
          <Grid item xs={6}>
            <MDTypography
              fontWeight="regular"
              fontSize="small"
              textTransform="capitalize"
              variant="h6"
              color={"dark"}
              noWrap
            >
              Remarks{" "}
            </MDTypography>
            <MDInput
              name="remarks"
              value={allValues.remarks || ""}
              onChange={(e) => handleChange(e)}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            OK
          </Button>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>

      {isRestricted == false && (
        <MDBox pt={1} pb={3} py={1}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={1}
                  mt={-2}
                  py={-0.25}
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
                    <Grid item xs={2}>
                      <MDTypography variant="h6" color="white">
                        {productionType} Production
                      </MDTypography>
                    </Grid>
                    <Grid item xs={1}>
                      <Tooltip title="Clear" arrow>
                        <IconButton color="white" onClick={() => clearFilter()}>
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
                        Plant *{" "}
                      </MDTypography>
                      <ReactSelect
                        id="plant"
                        options={plant}
                        onChange={handlePlantChange}
                        value={selectedPlant}
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
                        Process *{" "}
                      </MDTypography>
                      <ReactSelect
                        id="process"
                        options={processListItems}
                        onChange={handleProcessChange}
                        value={selectedProcess}
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
                        Mother Batch *{" "}
                      </MDTypography>
                      <ReactSelect
                        id="batchIdMother"
                        options={motherBatch}
                        onChange={handleMotherBatchChange}
                        value={selMbatch}
                      />
                    </Grid>

                    <Grid item xs={1.8}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        {" "}
                        Prod Start Date *
                      </MDTypography>

                      <input
                        type="datetime-local"
                        style={{ height: "37px" }}
                        id="prodStartDate"
                        onChange={(e) => {
                          var d = new Date(e.target.value);
                          var startDt =
                            d.getFullYear() +
                            "-" +
                            ("0" + (d.getMonth() + 1)).slice(-2) +
                            "-" +
                            ("0" + d.getDate()).slice(-2) +
                            " " +
                            ("0" + d.getHours()).slice(-2) +
                            ":" +
                            ("0" + d.getMinutes()).slice(-2);
                          setStartDateValue(startDt), clearFilterOnDate();
                        }}
                      />
                    </Grid>

                    <Grid item xs={1.8}>
                      <MDTypography
                        fontWeight="regular"
                        fontSize="small"
                        textTransform="capitalize"
                        variant="h6"
                        color={"dark"}
                        noWrap
                      >
                        {" "}
                        Prod End Date *
                      </MDTypography>

                      <input
                        type="datetime-local"
                        style={{ height: "37px" }}
                        id="prodEndDate"
                        onChange={(e) => {
                          var d = new Date(e.target.value);
                          var prodDt =
                            ("0" + d.getDate()).slice(-2) +
                            "-" +
                            d.toString().substr(4, 3) +
                            "-" +
                            d.getFullYear();
                          var endDt =
                            d.getFullYear() +
                            "-" +
                            ("0" + (d.getMonth() + 1)).slice(-2) +
                            "-" +
                            ("0" + d.getDate()).slice(-2) +
                            " " +
                            ("0" + d.getHours()).slice(-2) +
                            ":" +
                            ("0" + d.getMinutes()).slice(-2); // Include minutes;
                          setDateValue(prodDt);
                          setEndDateValue(endDt), clearFilterOnDate();
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
                        {" "}
                        Prod Date *
                      </MDTypography>
                      <MDInput name="Pdate" value={dateValue} />
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
                        Activity *{" "}
                      </MDTypography>
                      <MDInput
                        id="activity"
                        disabled={true}
                        value={selectedActivity}
                        readOnly={true}
                        onChange={(e) => setSelectedActivity(e)}
                      />
                      {/* <ReactSelect
                        id="activity"
                        options={activity}
                        onChange={(e) => {
                          setSelectedActivity(e);
                        }}
                        value={selectedActivity}
                      /> */}
                    </Grid>

                    {/* <Grid item xs={2}>
                      <p align="center">Action</p>
                      <AppBar position="static">
                        <Tabs
                          orientation={"horizontal"}
                          value={tabValue}
                          onChange={handleSetTabValue}
                        >
                          <Tab label="Insert" />
                          <Tab label="Modify" disabled />
                        </Tabs>
                      </AppBar>
                    </Grid> */}

                    <Grid item xs={1.25}>
                      <MDButton
                        style={{ marginTop: "1.5rem" }}
                        size="small"
                        color="info"
                        onClick={() => getData(true)}
                      >
                        {" "}
                        Submit{" "}
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </Grid>

            {tabValue == 0 && (
              <>
                {selectedProcess != null && selectedProcess.value != "M" && (
                  <>
                    <Grid item xs={12}>
                      <div id="gridTable" />
                      <br />
                    </Grid>
                  </>
                )}
                <Grid item xs={12}>
                  <Card>
                    <MDBox
                      mx={2}
                      mt={-5}
                      py={0}
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
                        <Grid item xs={6}>
                          <MDTypography variant="h6" color="white">
                            Prime Production (Total Net Wt. :{" "}
                            {sumNetWt.toFixed(3)} {qtyType} )
                          </MDTypography>
                        </Grid>
                        <Grid item xs={1}>
                          {selectedActivity === "SLIT" && !weightBtnSts && (
                            <Tooltip title="Weight Calculation" arrow>
                              <IconButton
                                color="white"
                                onClick={() => checkWeightCalculation()}
                              >
                                <FunctionsIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {/* {setWeightBtnSts} */}

                          {(weightBtnSts || selectedActivity === "REWIND") && (
                            <Tooltip title="Save" arrow>
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => insertSlitProd(true)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                          )}
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
                          <div id="insertTableDiv" />

                          <br />
                          <p
                            color="black"
                            style={{
                              color: "black",
                              paddingLeft: "1rem",
                              marginTop: "-1rem",
                            }}
                          >
                            Showing 1 to {insertTableData.length} of{" "}
                            {insertTableData.length} entries
                          </p>
                        </Grid>
                      </Grid>
                    </MDBox>
                  </Card>
                </Grid>
                {selectedActivity === "SLIT" && (
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
                              Scrap Production
                            </MDTypography>
                          </Grid>
                          <Grid item xs={1}></Grid>
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
                            <div id="scarpTableDiv" />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>
                  </Grid>
                )}
              </>
            )}

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
      )}
    </DashboardLayout>
  );
}
