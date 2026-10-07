import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components\
import { GetAuthorization } from "utils";
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
import { styled } from "@mui/material/styles";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";

// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import "../../tabulatorCss.scss";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function LDS090() {
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

  // const [rawMatTable, setrawMatTable] = useState(null);

  const [salesOrdNo, setSalesOrdNo] = useState("");
  const [pipeNo, setPipeNo] = useState(null);
  const [prodOrdNo, setProdOrdNo] = useState("");
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("A");
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [prodDate, setProdDate] = useState(null);
  const [shift, setShift] = useState([]);
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [result, setResult] = useState([]);
  const [poNo, setPoNo] = useState("");
  const [material, setMaterial] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [getTable, setTable] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const fieldConst = [
    {
      label: "Inspector Name",
      value: "",
    },
    {
      label: "Remarks",
      value: "",
    },
    {
      label: "Visual Inspection",
      value: "",
    },
  ];

  const [fieldValue, setFieldValue] = useState(fieldConst);

  var customerTable = React.createRef();

  //page load

  useEffect(() => {
    fetchDetails();
  }, []);

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
      var pageName = "LD09S001";
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

  //page load
  const fetchDetails = () => {
    setLoading(true);
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization()
      .then((data) => {
        validateUser(data.accessToken, data.refreshToken);
        Promise.all([getPipeNoList(data.accessToken)]).finally(() => {
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

  const getPipeNoList = async (accessToken) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "AC",
      rmBatch: "",
    };
    var url = "api/LD09S001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            obj.parentCoilNo = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });

          setPipeNoList(items);
          setPipeNo(null);
          setrmBatchId(null);
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
      CURR_PROC: "A",
      PIPE_NO: pipeno?.value || "",
    };
    //console.log("status",data.status)
    var url = "api/LD09S001/getnxtproc";
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
          setNxtproc(items[0]?.value || "");
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD09S001/getTataDate";
      let data = {
        prodEndDt: value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("Error!");
          } else {
            setProdDate(response.data?.[0]?.[1]);
            //setShift(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleClearVal = (newToken = false) => {
    setTable([]);
    setSelectedTable(null);
    setNxtproc("");
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setSelectedShift(null);
    setProdDate(null);
    setFieldValue(fieldConst);
    setResult(null);
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

  const handleVal = (newToken = false) => {
    setTable([]);
    setSelectedTable(null);
    //setNxtproc("")
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setSelectedShift(null);
    setProdDate(null);
    setFieldValue(fieldConst);
    setResult(null);
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
      PIPE_NO: pipeno?.value || "",
    };
    console.log("datarm", data);

    var url = "api/LD09S001/getOrderDetails";
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
          setOrdNo(items[0]?.value || "");
          setOrdItem(orditem[0]?.value || "");
          setCustName(custname[0]?.value || "");

          Promise.all([]);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setrmBatchId(
      value?.parentCoilNo
        ? { label: value.parentCoilNo, value: value.parentCoilNo }
        : null
    );
    console.log(value?.parentCoilNo);
    setTable([]);
    setSelectedTable(null);
    handleVal(true);
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getOrdDetails(data.accessToken, value),
          getNxtProc(data.accessToken, value),
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else {
      setrmBatchId(null);
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setNxtproc("");
    }
  };

  const handleOrderNoChange = (event) => {
    const value = event.target.value;

    // Editing an auto-filled order switches the screen to Order-Item search.
    // The item belonging to the previously selected pipe must not be retained.
    if (pipeNo?.value) {
      setOrdItem("");
    }

    setOrdNo(value);
    setPipeNo(null);
    setrmBatchId(null);
    setCustName("");
    setNxtproc("");
    setTable([]);
    setSelectedTable(null);
  };

  const handleOrderItemChange = (event) => {
    setOrdItem(event.target.value);
    setPipeNo(null);
    setrmBatchId(null);
    setCustName("");
    setNxtproc("");
    setTable([]);
    setSelectedTable(null);
  };

  const handleClearMain = (newToken = false) => {
    setPipeNo(null);
    setrmBatchId(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setTable([]);
    setSelectedShift(null);
    setSelectedTable(null);
    setProdDate("");
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

  const handleClearAll = (newToken = false) => {
    setFieldValue(fieldConst);
    setSelectedTable(null);
    setTable([]);
    setResult(null);
  };

  useEffect(() => {
    if (getTable?.length > 0) {
      const table = new Tabulator("#TableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getTable,
        columns: gridCol, //Column,
        // height: 200,
        layout: "fitDataFill",
      });
      setSelectedTable(table);
    } else {
      setSelectedTable(null);
    }
  }, [getTable]);

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const bindHydraData = async () => {
    try {
      console.log("Inside Fill Data");
      const prodStartDateInput = document.getElementById("prodStartDate").value;
      const prodEndDateInput = document.getElementById("prodEndDate").value;
      const inspector = fieldValue?.filter(
        (x) => x.label === "Inspector Name"
      )[0].value;
      var currentTime = new Date();
      var prodEndDateCheck = new Date(prodEndDateInput);

      //if productionendDt is greater than currentdate check
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

      const hasPipeNo = Boolean(pipeNo?.value);
      const hasOrderNo = Boolean(String(ordNo??"").trim());
      const hasOrderItem = Boolean(String(ordItem??"").trim());

      if (!hasPipeNo && !hasOrderNo && !hasOrderItem) {
        alertify.error(
          "Please select Pipe No or enter both Order No and Order Item"
        );
        return;
      }

      if (!hasPipeNo && hasOrderNo !== hasOrderItem) {
        alertify.error("Both Order No and Order Item are required");
        return;
      }
      if (!inspector) {
        alertify.error("Please enter Inspector");
        return;
      }
      if (!selectedShift) {
        alertify.error("Please select Shift");
        return;
      }
      if (!result?.value) {
        alertify.error("Please select Result value");
        return;
      }
      if (hasPipeNo && !nxtproc) {
        alertify.error("NxtProc is Mandatory");
        return;
      }

      // const dummyData = Array.from({ length: 10 }).map(() => {

      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const currentDate = new Date();
      const formattedDate = formatDateToDDMMYYYY(currentDate);
      const formattedTime = currentDate.toTimeString().split(" ")[0];

      let data = {
        RM_BATCH: hasPipeNo ? rmBatchId?.value || "" : "",
        STATUS: "AC",
        PIPE_NO: hasPipeNo ? pipeNo.value : "",
        ORDNO: hasPipeNo ? "" : String(ordNo?? "").trim(),
        ORDITEM: hasPipeNo ? "" : String(ordItem?? "").trim(),
      };

      const response = await axiosAPI.post(
        "api/LD09S001/getFillData",
        data,
        defaultOptions
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid response from API");
      }

      if (response.data.length == 0) {
        alertify.error("NO Data Found in V_BARE_PDO");
        return;
      }

      let dummyData = response.data.map((row, idx) => ({
        CUR_PROC: nxtproc2 ? nxtproc2 : "",
        NEXT_PROC: row.NEXT_PROC || "",
        ORDER_NO: row.ORDER_NO || "",
        ITEM: row.ITEM || "",
        PARENT_BATCH:
          row.LOM_ID_PAR_COIL_NO || rmBatchId?.value || "",
        TBP_ASL_NO_80: row.TBP_ASL_NO_80 || "",
        CUST_NAME: row.CUST_NAME || "",
        Pipe_No: row.TBP_BATCH_NO || "",
        LENGTH: row.TBP_PIPE_LNG_10 || "",
        TBP_HEAT_NO: row.TBP_HEAT_NO || "",
        WEIGHT: row.TBP_WEIGHT || "",
        LOM_NO_MATNR: row.TBP_NO_MATNR || "",
        // Prefer existing saved value (row.TBP_DIA_END_10) otherwise assign sequential index+1
        TBP_DIA_END_10: row?.TBP_DIA_END_10 ?? idx + 1,
        Date: formattedDate,
        Time: formattedTime,
        Inspector_Name: fieldValue?.filter(
          (x) => x.label === "Inspector Name"
        )[0].value
          ? fieldValue?.filter((x) => x.label === "Inspector Name")[0].value
          : "",

        Shift: selectedShift.value ? selectedShift.value : "",
        Shift_date: prodDate ? prodDate : "",
        Remarks: fieldValue?.filter((x) => x.label === "Remarks")[0]?.value
          ? fieldValue?.filter((x) => x.label === "Remarks")[0]?.value
          : "",

        Visual_Inspection: fieldValue?.filter(
          (x) => x.label === "Visual Inspection"
        )[0].value
          ? fieldValue.filter((x) => x.label === "Visual Inspection")[0]?.value
          : "",
        Result: result.value ? result.value : "",
      }));
      // );

      console.log("dummyData: ", dummyData);
      setTable(dummyData);
    } catch (error) {
      console.log("error: ", error);
      alertify.error("Error fetching data: ", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fillData();
  // }, [getTable]);

  const gridCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    // {
    //   title: "Seq No",
    //   field: "TBP_DIA_END_10",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   frozen: true,
    //   editor: "input",
    //   editorParams: {
    //     elementAttributes: { inputmode: "numeric", pattern: "[0-9]*" },
    //   },
    //   editable: true,
    //   // Tabulator passes (cell, value, parameters) to custom validators — previous code used the args reversed.
    //   validator: function (cell, value) {
    //     // Allow empty values (means not edited) so other validation can run at save time
    //     if (value === null || value === undefined || String(value).trim() === "") return true;
    //     // Only accept positive integers (1,2,...)
    //     return /^[1-9]\d*$/.test(String(value));
    //   },
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    // },
    {
      title: "Pipe No",
      field: "Pipe_No",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Curr Proc",
      field: "CUR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Nxt Proc",
      field: "NEXT_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Result",
      field: "Result",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
          // HOLD: "HOLD",
        },
      },
      defaultValue: "OK",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
      field: "Remarks",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Hold Reason",
      field: "HOLD_REASON",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      width: 150,
      visible:false,
      validator: function (value, cell) {
        return value ? true : false;
      },
      editable: function (cell) {
        const resultValue = cell.getRow().getData().Result;
        return resultValue === "HOLD";
      },
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Order No",
      field: "ORDER_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Order Item",
      field: "ITEM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "ASL No",
      field: "TBP_ASL_NO_80",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
      editor: "input",
    },
    {
      title: "Heat No",
      field: "TBP_HEAT_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    // {
    //   // width: 3,
    //   title: "Inspector Name",
    //   field: "Inspector_Name",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    // },
    {
      title: "Visual Inspection",
      field: "Visual_Inspection",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    
    {
      title: "Inspector",
      field: "Inspector_Name",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Weight (Ton)",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Prod Date",
      field: "Shift_Date",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    // {
    //   title: "Time",
    //   field: "Time",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   editor: "input",
    // },
    {
      title: "Material No.",
      field: "LOM_NO_MATNR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    
  ];

  const handleResultChange = (value) => {
    setResult(value);
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    // { label: "HOLD", value: "HOLD" },
  ];

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const formatDate = (dateString) => {
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

  const updateData = async (newToken = false) => {
    //debugger;
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

    var selectedRows = selectedTable.getSelectedRows();
    if (selectedRows.length == 0) {
      alertify.error("Please select rows");
      return;
    }

    // // Total rows produced by Fill Data (must save all rows at once)
    // const totalRows = getTable?.length || selectedTable.getData().length || selectedRows.length;
    // if (selectedRows.length !== totalRows) {
    //   alertify.error(`Please select all ${totalRows} rows before saving so sequences 1..${totalRows} can be validated`);
    //   return;
    // }

    // Collect and validate sequence numbers on selected rows
    // const seqs = [];
    // for (let i = 0; i < selectedRows.length; i++) {
    //   const raw = selectedRows[i]._row.data.TBP_DIA_END_10;
    //   const seqStr = raw === undefined || raw === null ? "" : String(raw).trim();
    //   if (!/^[1-9]\d*$/.test(seqStr)) {
    //     alertify.error("Seq No must be a positive integer for all selected rows");
    //     return;
    //   }
    //   seqs.push(Number(seqStr));
    // }

    // Ensure sequences cover exactly 1..N where N = totalRows
    // const expected = Array.from({ length: totalRows }, (_, i) => i + 1);
    // const missing = expected.filter((n) => !seqs.includes(n));
    // const duplicates = seqs.filter((v, i, a) => a.indexOf(v) !== i);
    // if (missing.length > 0 || duplicates.length > 0) {
    //   alertify.error(`Sequence numbers must contain all values 1..${totalRows} exactly once. Missing: ${missing.join(",")}${duplicates.length ? '; Duplicates: ' + [...new Set(duplicates)].join(',') : ''}`);
    //   return;
    // }

    const formatDate = (date) => {
      const d = date.getDate().toString().padStart(2, "0");
      const m = (date.getMonth() + 1).toString().padStart(2, "0");
      const y = date.getFullYear();
      const h = date.getHours().toString().padStart(2, "0");
      const min = date.getMinutes().toString().padStart(2, "0");
      // const s = date.getSeconds().toString().padStart(2, '0');
      return `${d}-${m}-${y} ${h}:${min}`;
    };

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
        BATCH_NO: item._row.data.Pipe_No ? item._row.data.Pipe_No : "",
        // TBP_DIA_END_10: item._row.data.TBP_DIA_END_10 ? item._row.data.TBP_DIA_END_10 : "",
        CUR_PROC: item._row.data.CUR_PROC ? item._row.data.CUR_PROC : "",
        BATCH_PROC_NO: 1,
        NEXT_PROC: item._row.data.NEXT_PROC ? item._row.data.NEXT_PROC : "",
        PROD_DATE: prodDate,
        SHIFT: selectedShift.value ? selectedShift.value : "",
        WEIGHT: item._row.data.WEIGHT ? item._row.data.WEIGHT : "",
        STATUS: "AC",
        PAR_COIL_NO:
          item._row.data.PARENT_BATCH || rmBatchId?.value || "",
        ID_FIRST_PAR: "",
        ORDER_NO: item._row.data.ORDER_NO ? item._row.data.ORDER_NO : "",
        ITEM: item._row.data.ITEM ? item._row.data.ITEM : "",
        QUALITY_CD: "",
        MATNR: item._row.data.LOM_NO_MATNR ? item._row.data.LOM_NO_MATNR : "",
        FLAG: "",
        START_DT: prodstartdt,
        END_DT: prodenddt,
        RESULT: item._row.data.Result ? item._row.data.Result : "",
        REMARK: item._row.data.Remarks ? item._row.data.Remarks : "",
        TBP_HEAT_NO: item._row.data.TBP_HEAT_NO
          ? item._row.data.TBP_HEAT_NO
          : "",
        INSP_NAME: item._row.data.Inspector_Name
          ? item._row.data.Inspector_Name
          : "",
        PIPE_LNG_10: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        TBP_VISUAL_INSP_80: item._row.data.Visual_Inspection
          ? item._row.data.Visual_Inspection
          : "",
        TBP_ASL_NO_80: item._row.data.TBP_ASL_NO_80
          ? item._row.data.TBP_ASL_NO_80
          : "",
        TBP_LEN_FT_80: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        TBP_LEN_INCH_80: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        HOLD_RSN: item._row.data.HOLD_REASON ? item._row.data.HOLD_REASON : "",
      });
    });
    console.log("newData:", newData);
    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    var url = "api/LD09S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        console.log("response.statusText", response.statusText);
        if (response.statusText != "" && response.statusText != "OK") {
          alertify.error("Error in Procedure");
        } else {
          if (response.data.failedCount > 0 && response.data.successfulPipes?.length) {
            const saved = new Set(response.data.successfulPipes);
            selectedTable.getRows().forEach((row) => {
              if (saved.has(String(row.getData().Pipe_No))) row.delete();
            });
          }
          const result = response.data;
          if (result.failedCount > 0 || result.successCount === 0) {
            alertify.error(result.message);
          } else {
            alertify.success(response.data.message);
            setTable([,]);
            setSelectedTable(null);
            handleClearAll();
            handleClearMain();
            fetchDetails();
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const downloadTableData = () => {
    console.log("Downloading");
    if (selectedTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = selectedTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD09S001" + ".xlsx";
    window.XLSX = XLSX;
    selectedTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="90-External Inpection Recording"
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
                            onClick={() => handleClearMain(true)}
                          >
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  <MDBox px={3} py={3}>
                    <Grid container spacing={1}>
                      <Grid item xs={1.75}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Pipe No
                        </MDTypography>

                        <ReactSelect
                          id="pipenoList"
                          options={pipenoList}
                          onChange={handlePipeNoChange}
                          variant="h6"
                          value={pipeNo}
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
                          Order No
                        </MDTypography>
                        <MDInput
                          name="ordNo"
                          value={ordNo}
                          onChange={handleOrderNoChange}
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
                          Order Item
                        </MDTypography>
                        <MDInput
                          name="ordItem"
                          value={ordItem}
                          onChange={handleOrderItemChange}
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
                          style={{ height: "37px" }}
                          id="prodEndDate"
                          onChange={(e) => {
                            var d = new Date(e.target.value);
                            var year = d.getFullYear();
                            var month = ("0" + (d.getMonth() + 1)).slice(-2);
                            var day = ("0" + d.getDate()).slice(-2);
                            var hours = ("0" + d.getHours()).slice(-2);
                            var minutes = ("0" + d.getMinutes()).slice(-2);

                            var oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;
                            getTataDate(oracleDate);
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
                          value={prodDate}
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
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

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
                          Data
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip
                          title={expanded ? "Hide Elements" : "Show Elements"}
                        >
                          <IconButton
                            color="white"
                            aria-label="toggle"
                            onClick={() => setExpanded(!expanded)}
                          >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>
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

                  {expanded && (
                    <MDBox px={3} py={3}>
                      <Grid container spacing={1}>
                        {fieldValue?.map((x, i) => (
                          <Grid item xs={x.width ? x.width : 1.5} key={i}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              {x.label}
                            </MDTypography>
                            {x.type === "Select" ? (
                              <ReactSelect
                                label=""
                                name="result"
                                options={[]}
                                value={x.value}
                                // readOnly={
                                //   x.label == "Next Process" ? true : false
                                // }
                                onChange={(e) => {
                                  const varVal = [];
                                  fieldValue.map((y) => {
                                    if (y.label == x.label) {
                                      y.value = e.target.value;
                                      varVal.push(y);
                                    } else {
                                      varVal.push(y);
                                    }
                                  });
                                  console.log(varVal);
                                  setFieldValue(varVal);
                                }}
                              />
                            ) : (
                              <MDInput
                                // label={x.label?.replace("(*)", "")}
                                name={i}
                                value={x.value}
                                // readOnly={true}
                                onChange={(e) => {
                                  const varVal = [];
                                  fieldValue.map((y) => {
                                    if (y.label == x.label) {
                                      y.value = e.target.value;
                                      varVal.push(y);
                                    } else {
                                      varVal.push(y);
                                    }
                                  });
                                  setFieldValue(varVal);
                                }}
                              />
                            )}
                          </Grid>
                        ))}

                        <Grid item xs={1.3}>
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
                            }}
                            value={result}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => bindHydraData()}
                          >
                            Fill Data
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  )}
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
                            // disabled={isReadWriteAccess}
                            onClick={() => updateData(true)}
                          >
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadTableData()}
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
                        {getTable?.length > 0 && <div id="TableContainer" />}

                        <br />
                        <p
                          color="black"
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getTable.length} of {getTable.length}{" "}
                          entries
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
