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
import MDButton from "components/MDButton";
import alertify from "alertifyjs";
import "../../alertify.css";
import "moment/locale/en-gb.js";
import jwt from "jsonwebtoken";

import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import { GetAuthorization } from "utils";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import AsyncSelect from "react-select/async";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "../../tabulatorCss.scss";

export default function TubePlanning() {
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

  const [rawMatTable, setrawMatTable] = useState(null);

  const [RMList, setRMList] = useState([]);
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("2");
  const [inspector, setInspector] = useState("");
  const [RESULT, setRESULT] = useState([]);
  const [selectedResult, setSelectedResult] = React.useState(null);
  const [pono, setPoNo] = useState("");
  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [SHIFT, setSHIFT] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [angle, setAngle] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [material, setMaterial] = useState("");
  const [remark, setRemark] = useState("");
  const [getEndFacingTable, setEndFacingTable] = useState([]);
  const [selectedEndFacingTable, setSelectedEndFacingTable] = useState(null);
  const [holdReasonOptions, setHoldReasonOptions] = useState([]);
  //const [valueRadio, setValueRadio] = React.useState("2C");
  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  //const [filter, setFilter] = useState(defaultHrForm);
  //const [rawMatData, setRawMatData] = React.useState([]);
  var customerTable = React.createRef();
  //const [orderwiseProd, setOrderwiseProd] = useState([]);
  const [orderwiseProdData, setOrderwiseProdData] = useState(null);
  const [expanded, setExpanded] = useState(true);
  const [allValues, setAllValues] = useState({
    pipeNo: "",
    nxtproc: nxtproc ? nxtproc : "",
    inspector: "",
    result: "",
    pono: "",
    selectedCalibDt: null,
    selectedCalibDueDt: null,
    selectedShiftDt: null,
    selectedGaugeId: null,
    gaugerange: "",
    material: "",
    remark: "",
  });

  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
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
          getRmList(data.accessToken),
          getPipeNoList(data.accessToken),
          //getInspector(serverDetails.PersonalNo)
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  // useEffect(() => {
  //  setInspector(serverDetails.PersonalNo);
  // }, []);

  const setTableNull = () => {
    setEndFacingTable([]);
  };

  // const getInspector = async (userid) => {

  //   console.log("inspector")
  //   setInspector(userid);

  // }

  const clearFilterOnDate = () => {
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
  };
  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log(value);
      var url = "api/LD02S002/getTataDate";
      let data = {
        prodEndDt: value,
      };
      console.log(data);
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            // if (response.data.length == 0) {
            //   alertify.error("No Data Found");
            //   setDateValue([,]);
            //   setLoading(false);
            // }
            var rows = [];

            console.log(response.data?.[0]?.[1]);
            setSHIFT_DATE(response.data?.[0]?.[1]);
            //setSHIFT(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const downloadExcelRMTableData = () => {
    console.log("Downloading");
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
    var fileName = "LD02S002" + ".xlsx";

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
      var pageName = "LD02S002";
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

  const updateApi = async (newToken = false) => {
    if (newToken) {
      const rsp = await getAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };

    var selectedRows = selectedEndFacingTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }
    const formatDate = (date) => {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear();
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      // const s = date.getSeconds().toString().padStart(2, '0');
      return `${d}-${m}-${y} ${h}:${min}`;
    };
    // var prodStartDateVal = formatDate(document.getElementById("prodStartDate").value);
    // var prodEndDateVal = formatDate(document.getElementById("prodEndDate").value);
    var currentTime = new Date();
    var prodStartDateVal = document.getElementById("prodStartDate").value;
    var prodEndDateVal = document.getElementById("prodEndDate").value;
    var startDate = new Date(prodStartDateVal);
    var endDate = new Date(prodEndDateVal);
    var prodstartdt = formatDate(startDate);
    var prodenddt = formatDate(endDate);
    var newData = [];
    selectedRows.forEach(function (item) {
      newData.push({
        PLANT: "0780",
        BATCH_NO: item._row.data.PIPE_NO ? item._row.data.PIPE_NO : "",
        FRD_FLAT_0_1: item._row.data.FRD_FLAT_0_1,
        FRD_FLAT_0_1_RESULT: item._row.data.FRD_FLAT_0_1_RESULT,
        FRD_FLAT_0_2: item._row.data.FRD_FLAT_0_2,
        FRD_FLAT_0_2_RESULT: item._row.data.FRD_FLAT_0_2_RESULT,
        FRD_FLAT_0_3: item._row.data.FRD_FLAT_0_3,
        FRD_FLAT_0_3_RESULT: item._row.data.FRD_FLAT_0_3_RESULT,
        FRD_FLAT_90_1: item._row.data.FRD_FLAT_90_1,
        FRD_FLAT_90_1_RESULT: item._row.data.FRD_FLAT_90_1_RESULT,
        FRD_FLAT_90_2: item._row.data.FRD_FLAT_90_2,
        FRD_FLAT_90_2_RESULT: item._row.data.FRD_FLAT_90_2_RESULT,
        FRD_FLAT_90_3: item._row.data.FRD_FLAT_90_3,
        FRD_FLAT_90_3_RESULT: item._row.data.FRD_FLAT_90_3_RESULT,
        FRD_MANDR_DIA: item._row.data.FRD_MANDR_DIA,
        FRD_MANDR_DIA_RESULT: item._row.data.FRD_MANDR_DIA_RESULT,
        FRD_FLAT_0_O_10: item._row.data.FRD_FLAT_0_O_10,
        FRD_FLAT_90_O_10: item._row.data.FRD_FLAT_90_O_10,
        FRD_RBT_10: item._row.data.FRD_RBT_10,
        PAR_COIL_NO: rmBatchId.value ? rmBatchId.value : "",
        ID_FIRST_PAR: item._row.data.ID_FIRST_PAR
          ? item._row.data.ID_FIRST_PAR
          : "",
        ID_ORDER_NO: item._row.data.ORDER_NO ? item._row.data.ORDER_NO : "", ////ordNo ? ordNo : "0",
        ITEM_NO: item._row.data.ITEM ? item._row.data.ITEM : "",
        MATNR: item._row.data.MATERIAL ? item._row.data.MATERIAL : "",
        REMARK: item._row.data.REMARK ? item._row.data.REMARK : "",
        HEAT_NO: item._row.data.HEAT_NO,
        LOM_ID_PAR_COIL_NO: item._row.data.LOM_ID_PAR_COIL_NO,
        ID_FIRST_PAR: item._row.data.LOM_ID_FIRST_PAR,
        INSPECTOR: item._row.data.INSPECTOR ? item._row.data.INSPECTOR : "",
        PROD_DATE: SHIFT_DATE,
        SHIFT: selectedShift.value ? selectedShift.value : "",
        START_DT: prodstartdt,
        END_DT: prodenddt,
      });
    });
    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    console.log(data);
    var url = "api/LD02S002/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error(response?.error?.response.data?.name);
        } else {
          var res = response.data[0][0];
          console.log("result20", res);
          if (res == "Y") {
            //console.log("msg",res[0])
            alertify.success("Rows Inserted Successfully !!!");
            setEndFacingTable([]);
            setSelectedEndFacingTable(null);
            handleMain();
            fetchDetails();
          } else {
            //alertify.error(response?.data[0]);
            alertify.alert(response?.data[0]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getOrdDetails = async (accessToken, pipeno) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      //RM_BATCH: value.value ? value.value : "",
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    console.log("datarm", data);

    var url = "api/LD02S002/getOrderDetails";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          var orditem = [];
          var custname = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_ORDER_CUS;
            obj.value = row.LOM_ID_ORDER_CUS;
            items.push(obj);
          });
          response.data.map((row) => {
            console.log(row);
            var obj1 = new Object();
            obj1.label = row.LOM_ID_ORD_ITEM_CUS;
            obj1.value = row.LOM_ID_ORD_ITEM_CUS;
            orditem.push(obj1);
          });
          response.data.map((row) => {
            console.log(row);
            var obj2 = new Object();
            obj2.label = row.ENC_CUST_NAME;
            obj2.value = row.ENC_CUST_NAME;
            custname.push(obj2);
          });
          console.log("items", items[0].value);
          setOrdNo(items[0].value);
          setOrdItem(orditem[0].value);
          setCustName(custname[0].value);

          Promise.all([]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getRmList = async (accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      status: "2C",
    };
    //console.log("status",data)
    var url = "api/LD02S002/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          var pipeno = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_PAR_COIL_NO;
            obj.value = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });
          // response.data.map((row) => {
          //   console.log(row);
          //   var obj1 = new Object();
          //   obj1.label = row.LOM_ID_BATCH;
          //   obj1.value = row.LOM_ID_BATCH
          //   pipeno.push(obj1);
          // });
          setRMList(items);
          setrmBatchId(items[0]);
          Promise.all([
            getPipeNoList(items[0], accessToken),
            //getMatNo("", accessToken,pipeno.value),
            //getPoNo(items[0], accessToken, pipeno)
          ]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getNxtProc = async (accessToken, pipeno) => {
    // if (newToken) {
    //   const rsp = await getAuthorization();
    // }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    //setLoading(true);
    let data = {
      CURR_PROC: "2",
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    //console.log("status",data.status)
    var url = "api/LD03S001/getnxtproc";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.NXTPROC;
            obj.value = row.NXTPROC;
            items.push(obj);
          });
          setNxtproc(items[0].value);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getPipeNoList = async (value, accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "2C",
      rmBatch: value.value ? value.value : "",
    };
    var url = "api/LD02S002/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          console.log(response.data);
          response.data.map((row) => {
            console.log(row);
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            items.push(obj);
          });

          setPipeNoList(items);
            setPipeNo(null);
          Promise.all([
            getOrdDetails(accessToken, items[0]),
            getNxtProc(accessToken, items[0]),
          ]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handleRMBatchChange = (value) => {
    //setPipeNo(null);
    setrmBatchId(value);
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    handleClearVal(true);

    console.log("pipeno", pipeno);

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getPipeNoList(value, data.accessToken),
          //getMatNo(value, data.accessToken,pipeno.value),
          //getPoNo(value, data.accessToken,"")
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
    //console.log(rmBatchId);
  };

  const handlePipeNoChange = (value) => {
    console.log(value)
    setPipeNo(value);
    // handleClearVal(true);

    let RmBatch = rmBatchId.value;
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getOrdDetails(data.accessToken, value),
          // getNxtProc(data.accessToken, value),
        ]).finally(() => {
          setLoading(false);
        });
      });
    }
  };

  const handleClearVal = (newToken = false) => {
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    setNxtproc("");
    setSelectedShift(null);
    setSelectedResult(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setInspector("");
    setSHIFT_DATE(null);
    setRemark("");
    setRESULT("");
    const prodDateInput = document.getElementById("Pdate");
    if (prodDateInput) {
      prodDateInput.value = null;
    }

    const prodStartDateInput = document.getElementById("prodStartDate");
    if (prodStartDateInput) {
      prodStartDateInput.value = "";
    }

    const prodEndDateInput = document.getElementById("prodEndDate");
    if (prodEndDateInput) {
      prodEndDateInput.value = "";
    }
  };

  const handleMain = (newToken = false) => {
    setPipeNo("");
    setrmBatchId("");
    setEndFacingTable([]);
    setSelectedEndFacingTable(null);
    setSelectedShift(null);
    setSelectedResult(null);
    setAngle("");
    setInspector("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    //setSelectedShiftDt(null)
    setSHIFT_DATE(null);
    setMaterial("");
    setRemark("");
    setRESULT("");
    const prodDateInput = document.getElementById("Pdate");
    if (prodDateInput) {
      prodDateInput.value = null;
    }

    const prodStartDateInput = document.getElementById("prodStartDate");
    if (prodStartDateInput) {
      prodStartDateInput.value = "";
    }

    const prodEndDateInput = document.getElementById("prodEndDate");
    if (prodEndDateInput) {
      prodEndDateInput.value = "";
    }
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    if (getEndFacingTable?.length > 0) {
      const table = new Tabulator("#endFacingTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getEndFacingTable,
        columns: endFacingColumn,
        height: 400,
        layout: "fitDataFill",
      });

      setSelectedEndFacingTable(table);
    } else {
      setSelectedEndFacingTable(null);
    }
  }, [getEndFacingTable]);

  const handleResultChange = (value) => {
    setSelectedResult(value);
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const bindEndFacingData = async () => {
    try {
      setLoading(true);
      setEndFacingTable([]);
      setSelectedEndFacingTable(null);
      var prodStartDateInput = document.getElementById("prodStartDate").value;
      var prodEndDateInput = document.getElementById("prodEndDate").value;
      var currentTime = new Date();
      //console.log("Result20",RESULT.value)
      var prodEndDateCheck = new Date(prodEndDateInput);
      if (prodEndDateCheck > currentTime) {
        alertify.error(
          "The selected end date is greater than the current time."
        );
        setLoading(false);
        return;
      }
      //if startdt is greater than endDt
      if (new Date(prodStartDateInput) >= new Date(prodEndDateInput)) {
        alertify.error("Start time should be before end time");
        setLoading(false);
        return;
      }

      // startdt must be in 72 hours of current date
      var hoursDifference =
        (currentTime - prodStartDateInput) / (1000 * 60 * 60);
      if (hoursDifference > 72) {
        alertify.error(
          "Start date must be within 72 hours of the current time."
        );
        setLoading(false);
        return;
      }
      if (prodStartDateInput == "") {
        alertify.error("Please select Prod Start Dt");
        setLoading(false);
        return;
      }
      if (prodEndDateInput == "") {
        alertify.error("Please select Prod End Dt");
        setLoading(false);
        return;
      }
      let data = {
        Result: selectedResult ? selectedResult : "",
        Inspector: inspector ? inspector : "",
        prodstartdt: prodStartDateInput ? prodStartDateInput : "",
        prodenddt: prodEndDateInput ? prodEndDateInput : "",
      };
      const formatDate = (date) => {
        const d = date.getDate().toString().padStart(2, "0");
        const m = (date.getMonth() + 1).toString().padStart(2, "0");
        const y = date.getFullYear();
        const h = date.getHours().toString().padStart(2, "0");
        const min = date.getMinutes().toString().padStart(2, "0");
        // const s = date.getSeconds().toString().padStart(2, '0');
        return `${d}-${m}-${y} ${h}:${min}`;
      };
      // var prodStartDateVal = formatDate(document.getElementById("prodStartDate").value);
      // var prodEndDateVal = formatDate(document.getElementById("prodEndDate").value);
      var currentTime = new Date();
      var startDate = new Date(data.prodstartdt);
      var endDate = new Date(data.prodenddt);
      var prodstartdtVal = formatDate(startDate);
      var prodenddtVal = formatDate(endDate);
      
      console.log(endDate, data,data.prodenddt,prodEndDateInput);

      // if (data.rmBatchId == "") {
      //   alertify.error("Please enter Batch Id!");
      //   return;
      // }
      if (data.Inspector == "") {
        alertify.error("Please enter Inspector!");
        return;
      }
      if (data.Result == "") {
        alertify.error("Please select Result!");
        return;
      }
      if (remark == "") {
        alertify.error("Please enter Remarks!");
        return;
      }

      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
     
      if (!rmBatchId?.value && !pipeno?.value) {
         alertify.error("RM Batch and Pipe No cannot both be empty.");
        return; 
      }


      let requestData = {
        RM_BATCH: rmBatchId?.value || "",
        STATUS: "2C",
        PIPE_NO: pipeno?.value|| ""
      };




      const response = await axiosAPI.post(
        "api/LD02S002/getFillData",
        requestData,
        defaultOptions
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid response from API");
      }
      console.log("response20", response.data);
      if (response.data.length == 0) {
        alertify.error("NO Data Found in V_BARE_PDO");
        return;
      }

      let dummyData = response.data.map((row) => ({
        CUR_PROC: nxtproc2 ? nxtproc2 : "",
        NXT_PROC: row.NEXT_PROC || "", //nxtproc ? nxtproc : "",
        PLAN_PROC: row.PLAN_PROC || "", //nxtproc ? nxtproc : "",
        //PIPE_NO: row.TBP_BATCH_NO || "",
        PIPE_NO: row.TBP_BATCH_NO || "",
        PIPE_OD: row.TBP_PIPE_OD_10 || "",
        PIPE_THICK: row.TBP_PIPE_THK_10 || "",
        PIPE_LEN: row.TBP_PIPE_LNG_10 || "",
        MATERIAL: row.TBP_NO_MATNR || "",
        ORDER_NO: row.ORDER_NO || "",
        HEAT_NO: row.HEAT_NO || "",
        LOM_ID_PAR_COIL_NO: row.LOM_ID_PAR_COIL_NO || "",
        LOM_ID_FIRST_PAR: row.LOM_ID_FIRST_PAR || "",
        FRD_FLAT_0_1: row.FRD_FLAT_0_1 ,
        FRD_FLAT_0_1_RESULT: row.FRD_FLAT_0_1_RESULT?row.FRD_FLAT_0_1_RESULT:selectedResult?.value,
        FRD_FLAT_0_2: row.FRD_FLAT_0_2,
        FRD_FLAT_0_2_RESULT: row.FRD_FLAT_0_2_RESULT ?row.FRD_FLAT_0_2_RESULT:selectedResult?.value,
        FRD_FLAT_0_3: row.FRD_FLAT_0_3,
        FRD_FLAT_0_3_RESULT: row.FRD_FLAT_0_3_RESULT?row.FRD_FLAT_0_3_RESULT:selectedResult?.value,
        FRD_FLAT_90_1: row.FRD_FLAT_90_1,
        FRD_FLAT_90_1_RESULT: row.FRD_FLAT_90_1_RESULT?row.FRD_FLAT_90_1_RESULT:selectedResult?.value,
        FRD_FLAT_90_2: row.FRD_FLAT_90_2,
        FRD_FLAT_90_2_RESULT: row.FRD_FLAT_90_2_RESULT?row.FRD_FLAT_90_2_RESULT:selectedResult?.value,
        FRD_FLAT_90_3: row.FRD_FLAT_90_3,
        FRD_FLAT_90_3_RESULT: row.FRD_FLAT_90_3_RESULT?row.FRD_FLAT_90_3_RESULT:selectedResult?.value,
        FRD_MANDR_DIA: row.FRD_MANDR_DIA,
        FRD_MANDR_DIA_RESULT: row.FRD_MANDR_DIA_RESULT?row.FRD_MANDR_DIA_RESULT:selectedResult?.value,
        FRD_FLAT_0_O_10: row.FRD_FLAT_0_O_10?row.FRD_FLAT_0_O_10:selectedResult?.value,
        FRD_FLAT_90_O_10: row.FRD_FLAT_90_O_10?row.FRD_FLAT_90_O_10:selectedResult?.value,
        FRD_RBT_10: row.FRD_RBT_10?row.FRD_RBT_10 : selectedResult?.value,
        FRD_START_DT: row.FRD_START_DT?row.FRD_START_DT:prodstartdtVal,
        FRD_END_DT: row.FRD_END_DT?row.FRD_END_DT:prodenddtVal,
        FRD_PROD_DATE:row.FRD_PROD_DATE?row.FRD_PROD_DATE:SHIFT_DATE,
        FRD_SHIFT:row.FRD_SHIFT?row.FRD_SHIFT:selectedShift.value ,
        ITEM: row.ITEM || "",
        CUST_NAME: row.CUST_NAME || "",
        INSPECTOR: row.FRD_INSP_NAME? row.FRD_INSP_NAME:inspector || "",
        RESULT: selectedResult.value || "",
        REMARK: remark || "",
      }));
      console.log(prodstartdtVal,prodenddtVal)
      setEndFacingTable(dummyData);
    } catch (error) {
      //console.error("Error fetching API data:", error);

      alertify.error("Error:" + error);
    } finally {
      setLoading(false);
    }
  };

  const endFacingColumn = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },

    {
      title: "FLAT 0-1",
      field: "FRD_FLAT_0_1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 0-1 Result",
      field: "FRD_FLAT_0_1_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 0-2",
      field: "FRD_FLAT_0_2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 0-2 Result",
      field: "FRD_FLAT_0_2_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 0-3",
      field: "FRD_FLAT_0_3",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 0-3 Result",
      field: "FRD_FLAT_0_3_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 90-1",
      field: "FRD_FLAT_90_1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 90-1 Result",
      field: "FRD_FLAT_90_1_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 90-2",
      field: "FRD_FLAT_90_2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 90-2 Result",
      field: "FRD_FLAT_90_2_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 90-3",
      field: "FRD_FLAT_90_3",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "FLAT 90-3 Result",
      field: "FRD_FLAT_90_3_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "MANDR_DIA",
      field: "FRD_MANDR_DIA",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "MANDR_DIA Result",
      field: "FRD_MANDR_DIA_RESULT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Flattening 0O",
      field: "FRD_FLAT_0_O_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          "": "--SELECT--",
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Flattening 90O",
      field: "FRD_FLAT_90_O_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          "": "--SELECT--",
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "RBT",
      field: "FRD_RBT_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          "": "--SELECT--",
          OK: "OK",
          "NOT OK": "NOT OK",
        },
      },
      defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    // {
    //   title: "Result",
    //   field: "RESULT",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   editable: true,
    //   editor: "select",
    //   editorParams: {
    //     values: {
    //       OK: "OK",
    //       "NOT OK": "NOT OK"
    //     },
    //   },
    //   defaultValue: "ok",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    // },
    {
      title: "Pipe OD",
      field: "PIPE_OD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Pipe Thick",
      field: "PIPE_THICK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Pipe Len",
      field: "PIPE_LEN",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    // {
    //   title: "Hold Reason",
    //   field: "HOLD_REASON",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   editor: "input",
    //   validator: function (value, cell) {
    //     return value ? true : false;
    //   },
    //   editable: function (cell) {
    //     const resultValue = cell.getRow().getData().RESULT;
    //     return resultValue === "HOLD";
    //   },
    //   formatter: function (cell) {
    //     const value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    // },
    {
      title: "Remarks",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Heat No",
      field: "HEAT_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Parent batch",
      field: "LOM_ID_PAR_COIL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "First Parent",
      field: "LOM_ID_FIRST_PAR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Order No.",
      field: "ORDER_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Curr Proc",
      field: "CUR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Next Proc",
      field: "NXT_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Planned Proc",
      field: "PLAN_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Inspector",
      field: "INSPECTOR",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Start Time",
      field: "FRD_START_DT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "End Time",
      field: "FRD_END_DT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Prod Date",
      field: "FRD_PROD_DATE",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Shift",
      field: "FRD_SHIFT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
  ];

  const tcmCRcoilLoadOptions = (inputValue, callback) => {
    // let varVal = pipenoList;
    setrmBatchId("");
    setTimeout(async () => {
      callback([{value: inputValue , label: inputValue}])
    }, 1000);
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Quality"
        page="20 - RBT & Flat (Recording)"
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
          <MDBox pt={0} pb={0} py={10}>
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
                          Filter
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Clear All">
                          <IconButton
                            color="white"
                            onClick={() => handleMain(true)}
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
                          Parent Batch*
                        </MDTypography>

                        <ReactSelect
                          id="rmList"
                          options={RMList}
                          onChange={handleRMBatchChange}
                          variant="h6"
                          value={rmBatchId}
                        />
                      </Grid>

                      {/* <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Pipe ID
                        </MDTypography>

                        <ReactSelect
                          id="pipenoList"
                          options={pipenoList}
                          onChange={handlePipeNoChange}
                          //onChange={handlePipeNoChange}
                          variant="h6"
                          value={pipeno}
                        />
                      </Grid> */}
                      <Grid item xs={2}>
                      <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Pipe ID
                        </MDTypography>
                        <AsyncSelect
                          // classNamePrefix='react_select'
                          cacheOptions
                          loadOptions={tcmCRcoilLoadOptions}
                          defaultOptions={pipenoList}
                          onChange={handlePipeNoChange}
                          value={pipeno}//{{ label: coilInfo.CoilId ?? "Choose" }}
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
                          {" "}
                          Prod Start Date *
                        </MDTypography>

                        <input
                          type="datetime-local"
                          //step="1" // Allows selection of seconds
                          style={{ height: "37px" }}
                          id="prodStartDate"
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
                          {" "}
                          Prod End Date *
                        </MDTypography>

                        <input
                          type="datetime-local"
                          //step="1" // Allows selection of seconds
                          style={{ height: "37px" }}
                          id="prodEndDate"
                          onChange={(e) => {
                            var d = new Date(e.target.value);
                            var d = new Date(e.target.value);
                            // Extract components
                            var year = d.getFullYear();
                            var month = ("0" + (d.getMonth() + 1)).slice(-2); // Months are 0-based
                            var day = ("0" + d.getDate()).slice(-2);
                            var hours = ("0" + d.getHours()).slice(-2);
                            var minutes = ("0" + d.getMinutes()).slice(-2);
                            //var seconds = ('0' + d.getSeconds()).slice(-2);

                            // Format to Oracle date string
                            var oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;

                            console.log(oracleDate);
                            getTataDate(oracleDate);
                            clearFilterOnDate();
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
                        <MDInput
                          name="Pdate"
                          id="Pdate"
                          iseditable="false"
                          value={SHIFT_DATE}
                        />
                      </Grid>
                      <Grid item xs={1.2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Shift*
                        </MDTypography>
                        <ReactSelect
                          options={ShiftType}
                          onChange={(e) => {
                            handleShiftChange(e);
                          }}
                          value={selectedShift}
                        />
                      </Grid>
                      <Grid item xs={1.3}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Inspector*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="inspector"
                          value={inspector}
                          onChange={(e) => {
                            setInspector(e.target.value);
                            setTableNull();
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
                          Result*
                        </MDTypography>
                        <ReactSelect
                          options={ResultType}
                          onChange={(e) => {
                            handleResultChange(e);
                            setTableNull();
                          }}
                          value={selectedResult}
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
                          Remarks*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="remark"
                          value={remark}
                          onChange={(e) => {
                            setRemark(e.target.value);
                            setTableNull();
                          }}
                        />
                      </Grid>

                      <Grid item xs={1} mt={3}>
                        <MDButton
                          //style={{ marginTop: "1.5rem" }}
                          size="small"
                          color="info"
                          onClick={() => bindEndFacingData()}
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
                          RBT and Flat. Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => updateApi(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelRMTableData()}
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
                        {getEndFacingTable?.length > 0 && (
                          <div id="endFacingTableContainer" />
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
                          Showing 1 to {getEndFacingTable.length} of{" "}
                          {getEndFacingTable.length} entries
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
