import React, { useEffect, useState, useRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

// Material Dashboard / custom components
import { GetAuthorization } from "utils";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Preloader from "components/Preloader/Preloader";
import ReactSelect from "components/Select/ReactSelect";

// Tabulator
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

// Icons
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import SaveIcon from "@mui/icons-material/Save";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

// Routing / API / config
import routes from "routes";
import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";

// Misc
import alertify from "alertifyjs";
import "../../alertify.css";
import jwt from "jsonwebtoken";
import "../../tabulatorCss.scss";
import * as XLSX from "xlsx";

export default function TubePlanning() {
  const tableRef = useRef(null);
  const tabulatorInstanceRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [isAdmin, setAdmin] = useState(false);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = useState(true);

  const [rmBatchId, setrmBatchId] = useState(null);

  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);

  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");

  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null);

  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2] = useState("H");

  const [remarks, setRemarks] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [inspectorname, setInspectorName] = useState("");

  const [getThickTable, setThickTable] = useState([]);
  const [selectedThickTable, setSelectedThickTable] = useState(null);
  const [expanded, setExpanded] = useState(true);

  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // New Final Station Internal states
  const getNowDateTimeLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  };

  const [fieldNoInt, setFieldNoInt] = useState("");
  const [roughness, setRoughness] = useState("");

  const [dftF1, setDftF1] = useState("");
  const [dftF2, setDftF2] = useState("");
  const [dftF3, setDftF3] = useState("");
  const [dftF4, setDftF4] = useState("");

  const [dftT1, setDftT1] = useState("");
  const [dftT2, setDftT2] = useState("");
  const [dftT3, setDftT3] = useState("");
  const [dftT4, setDftT4] = useState("");

  const [cutBackFEnd, setCutBackFEnd] = useState("");
  const [cutBackTEnd, setCutBackTEnd] = useState("");

  const [visualInsp, setVisualInsp] = useState("");
  const [marking, setMarking] = useState(null);
  const [finalInspDate, setFinalInspDate] = useState(getNowDateTimeLocal());

  const [onlineTestW1, setOnlineTestW1] = useState("");
  const [finalStation, setFinalStation] = useState("");
  const [repairStation, setRepairStation] = useState(null);

  const [onlineTestB1, setOnlineTestB1] = useState("");
  const [onlineTestB2, setOnlineTestB2] = useState("");
  const [onlineTestB3, setOnlineTestB3] = useState("");

  const setTableNull = () => {
    setThickTable([]);
  };

  const formatDateForTable = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const formatDateTimeForSave = (dateValue) => {
    if (!dateValue) return "";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${month}-${year} ${hh}:${mm}`;
  };

  const fetchDetails = () => {
    setLoading(true);

    if (serverDetails.devMode) {
      setRestricted(false);
    }

    GetAuthorization()
      .then((data) => {
        validateUser();
        Promise.all([getPipeNoList(data.accessToken)]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        setLoading(false);
        alertify.error(e?.message || e);
      });
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const getAuthorization = () =>
    new Promise((resolve, reject) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      const url = serverDetails.baseURL + serverDetails.RefreshTokenAPI;

      axiosAPI
        .post(
          url,
          { refreshToken: localStorage.getItem("tmm_refreshToken") },
          defaultOptions
        )
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            reject(response.statusText);
          } else {
            localStorage.setItem("tmm_accessToken", response.data.accessToken);
            localStorage.setItem("tmm_refreshToken", response.data.refreshToken);
            resolve(response.data);
          }
        })
        .catch((err) => reject(err));
    });

  const validateUser = async (newToken = false) => {
    if (newToken) {
      await getAuthorization();
    }

    setLoading(true);

    try {
      let plant = "";

      const userDetails = jwt.verify(
        localStorage.getItem("tmm_refreshToken"),
        serverDetails.REFRESH_KEY
      );

      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo === undefined ||
        serverDetails.PersonalNo === ""
      ) {
        window.location.href = "#/signin";
        return;
      }

      const userId = serverDetails.PersonalNo;
      const pageName = "LD16S001";
      const authDetails = await getScreenAuth(plant, userId, pageName);

      if (authDetails) {
        setRestricted(false);

        if (authDetails.payload.PS_AUTH_DML === "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML === "Y") {
          setAdmin(true);

          if (authDetails.payload.LS_READ_WRITE_FLAG === "RL_RW") {
            setReadWriteAccess(false);
            alertify.success("You are authorized to make changes from this page");
          } else {
            setReadWriteAccess(true);
            alertify.error("You are not authorized to make changes from this page");
          }
        } else {
          alertify.error("You are not authorized to make changes from this page");
        }
      } else {
        setRestricted(true);
        setAdmin(false);
      }
    } catch (e) {
      setRestricted(true);
      setAdmin(false);

      if (serverDetails.devMode === false) {
        window.location.href = "#/signin";
      }
    } finally {
      setLoading(false);
    }

    if (serverDetails.devMode === true) {
      setRestricted(false);
      setAdmin(true);
    }
  };

  const getScreenAuth = (plantCd, userId, pageName) =>
    new Promise((resolve, reject) => {
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      const url = "api/users/screenAuth";
      const data = { plantCd, user: userId, page: pageName };

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            reject(null);
          } else {
            const encryptUserInfo = response.data;
            const authDetails = jwt.verify(
              encryptUserInfo,
              serverDetails.SCREEN_AUTH_KEY
            );
            if (authDetails) resolve(authDetails);
            else reject(null);
          }
        })
        .catch(() => reject(null));
    });

  useEffect(() => {
    if (!tableRef.current) return;

    if (tabulatorInstanceRef.current) {
      tabulatorInstanceRef.current.destroy();
      tabulatorInstanceRef.current = null;
    }

    if (getThickTable?.length > 0) {
      const table = new Tabulator(tableRef.current, {
        pagination: "local",
        paginationSize: 12,
        data: getThickTable,
        columns: ThickColumns,
        height: 400,
        layout: "fitDataFill",
        selectable: true,
      });

      tabulatorInstanceRef.current = table;
      setSelectedThickTable(table);
    } else {
      setSelectedThickTable(null);
    }

    return () => {
      if (tabulatorInstanceRef.current) {
        tabulatorInstanceRef.current.destroy();
        tabulatorInstanceRef.current = null;
      }
    };
  }, [getThickTable]);

  const handleClearAll = () => {
    setRemarks("");
    setSelectedResult(null);
    setInspectorName("");

    setFieldNoInt("");
    setRoughness("");

    setDftF1("");
    setDftF2("");
    setDftF3("");
    setDftF4("");

    setDftT1("");
    setDftT2("");
    setDftT3("");
    setDftT4("");

    setCutBackFEnd("");
    setCutBackTEnd("");

    setVisualInsp("");
    setMarking(null);
    setFinalInspDate(getNowDateTimeLocal());

    setOnlineTestW1("");
    setFinalStation("");
    setRepairStation(null);

    setOnlineTestB1("");
    setOnlineTestB2("");
    setOnlineTestB3("");

    setThickTable([]);
    setSelectedThickTable(null);
  };

  const handleClearMain = () => {
    handleClearAll();
    setPipeNo(null);
    setrmBatchId(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setThickTable([]);
    setSelectedThickTable(null);
    setSelectedShift(null);
    setSHIFT_DATE(null);

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

  const handleClearVal = () => {
    setNxtproc("");
    setPipeNo(null);
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");

    setRemarks("");
    setSelectedResult(null);
    setInspectorName("");

    setFieldNoInt("");
    setRoughness("");

    setDftF1("");
    setDftF2("");
    setDftF3("");
    setDftF4("");

    setDftT1("");
    setDftT2("");
    setDftT3("");
    setDftT4("");

    setCutBackFEnd("");
    setCutBackTEnd("");

    setVisualInsp("");
    setMarking(null);
    setFinalInspDate(getNowDateTimeLocal());

    setOnlineTestW1("");
    setFinalStation("");
    setRepairStation(null);

    setOnlineTestB1("");
    setOnlineTestB2("");
    setOnlineTestB3("");

    setThickTable([]);
    setSelectedThickTable(null);

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

  const handleVal = () => {
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");

    setRemarks("");
    setSelectedResult(null);
    setInspectorName("");

    setFieldNoInt("");
    setRoughness("");

    setDftF1("");
    setDftF2("");
    setDftF3("");
    setDftF4("");

    setDftT1("");
    setDftT2("");
    setDftT3("");
    setDftT4("");

    setCutBackFEnd("");
    setCutBackTEnd("");

    setVisualInsp("");
    setMarking(null);
    setFinalInspDate(getNowDateTimeLocal());

    setOnlineTestW1("");
    setFinalStation("");
    setRepairStation(null);

    setOnlineTestB1("");
    setOnlineTestB2("");
    setOnlineTestB3("");

    setThickTable([]);
    setSelectedThickTable(null);

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

  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization()
      .then((token) => {
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };

        const url = "api/LD12S001/getTataDate";
        const data = {
          prodEndDt: value,
        };

        axiosAPI
          .post(url, data, defaultOptions)
          .then((response) => {
            if (response.statusText === "" || response.statusText === "OK") {
              setSHIFT_DATE(response.data?.[0]?.[1] || "");
            }
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(() => setLoading(false));
  };

  const getPipeNoList = async (accessToken) => {
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    const data = {
      status: "HC",
      rmBatch: "",
    };

    const url = "api/LD12S001/getPipeNoList";

    return axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText === "" || response.statusText === "OK") {
          const items = [];
          response.data?.forEach((row) => {
            items.push({
              label: row.LOM_ID_BATCH,
              value: row.LOM_ID_BATCH,
              parentCoilNo: row.LOM_ID_PAR_COIL_NO,
            });
          });

          setPipeNoList(items);

          setPipeNo(null);
          setrmBatchId(null);
        }
      })
      .finally(() => {
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
    handleVal();

    if (value) {
      setLoading(true);
      GetAuthorization()
        .then((data) => {
          return Promise.all([
            getOrdDetails(data.accessToken, value),
            getNxtProc(data.accessToken, value),
          ]);
        })
        .finally(() => {
          setLoading(false);
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

    if (pipeno?.value) {
      setOrdItem("");
    }

    setOrdNo(value);
    setPipeNo(null);
    setrmBatchId(null);
    setCustName("");
    setNxtproc("");
    setThickTable([]);
    setSelectedThickTable(null);
  };

  const handleOrderItemChange = (event) => {
    setOrdItem(event.target.value);
    setPipeNo(null);
    setrmBatchId(null);
    setCustName("");
    setNxtproc("");
    setThickTable([]);
    setSelectedThickTable(null);
  };

  const getNxtProc = async (accessToken, selectedPipeNo) => {
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    const data = {
      CURR_PROC: "H",
      PIPE_NO: selectedPipeNo?.value ? selectedPipeNo.value : "",
    };

    const url = "api/LD03S001/getnxtproc";

    return axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText === "" || response.statusText === "OK") {
          const items = [];
          response.data?.forEach((row) => {
            items.push({
              label: row.NXTPROC,
              value: row.NXTPROC,
            });
          });

          setNxtproc(items?.[0]?.value || "");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getOrdDetails = async (accessToken, selectedPipeNo) => {
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    const data = {
      PIPE_NO: selectedPipeNo?.value ? selectedPipeNo.value : "",
    };

    const url = "api/LD02S001/getOrderDetails";

    return axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText === "" || response.statusText === "OK") {
          if (response.data?.length > 0) {
            setOrdNo(response.data[0]?.LOM_ID_ORDER_CUS || "");
            setOrdItem(response.data[0]?.LOM_ID_ORD_ITEM_CUS || "");
            setCustName(response.data[0]?.ENC_CUST_NAME || "");
          } else {
            setOrdNo("");
            setOrdItem("");
            setCustName("");
          }
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const bindThickData = async () => {
    try {
      setLoading(true);
      setThickTable([]);
      setSelectedThickTable(null);

      const prodStartDateVal =
        document.getElementById("prodStartDate")?.value || "";
      const prodEndDateVal =
        document.getElementById("prodEndDate")?.value || "";
      const currentTime = new Date();

      if (!prodStartDateVal) {
        alertify.error("Please select Prod Start Date");
        setLoading(false);
        return;
      }

      if (!prodEndDateVal) {
        alertify.error("Please select Prod End Date");
        setLoading(false);
        return;
      }

      const startDate = new Date(prodStartDateVal);
      const endDate = new Date(prodEndDateVal);

      if (endDate > currentTime) {
        alertify.error("The selected end date is greater than the current time.");
        setLoading(false);
        return;
      }

      if (startDate >= endDate) {
        alertify.error("Start time should be before end time");
        setLoading(false);
        return;
      }

      const hoursDifference = (currentTime - startDate) / (1000 * 60 * 60);
      if (hoursDifference > 72) {
        alertify.error("Start date must be within 72 hours of the current time.");
        setLoading(false);
        return;
      }

      const hasPipeNo = Boolean(pipeno?.value);
      const hasOrderNo = Boolean(String(ordNo || "").trim());
      const hasOrderItem = Boolean(String(ordItem || "").trim());

      if (!hasPipeNo && !hasOrderNo && !hasOrderItem) {
        alertify.error(
          "Please select Pipe No or enter both Order No and Order Item"
        );
        setLoading(false);
        return;
      }

      if (!hasPipeNo && hasOrderNo !== hasOrderItem) {
        alertify.error("Both Order No and Order Item are required");
        setLoading(false);
        return;
      }

      if (
        !SHIFT_DATE ||
        !selectedShift?.value ||
        !selectedResult?.value ||
        !String(remarks || "").trim() ||
        !String(inspectorname || "").trim()
      ) {
        alertify.error("All fields marked * are mandatory. Kindly fill.");
        setLoading(false);
        return;
      }

      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const requestData = {
        RM_BATCH: hasPipeNo ? rmBatchId?.value || "" : "",
        STATUS: "HC",
        PIPE_NO: hasPipeNo ? pipeno.value : "",
        ORDNO: hasPipeNo ? "" : String(ordNo || "").trim(),
        ORDITEM: hasPipeNo ? "" : String(ordItem || "").trim(),

      };

      const response = await axiosAPI.post(
        "api/LD16S001/getFillData",
        requestData,
        defaultOptions
      );

      if (response.status !== 200 || !response.data) {
        throw new Error("Invalid response from API");
      }

      if (response.data.length === 0) {
        alertify.error("No Data Found!");
        return;
      }

      const formattedTime = new Date().toTimeString().split(" ")[0];
      const finalInspDateDisplay = formatDateForTable(finalInspDate);
      const dtOfProcDisplay = SHIFT_DATE || formatDateForTable(prodEndDateVal);

      const tableRows = response.data.map((row) => ({
        C_PRC: nxtproc2 || "",
        N_PRC: row.NEXT_PROC || nxtproc || "",
        PIPE_NO: row.TBP_BATCH_NO || "",
        ASL_NO: row.ASL_NO || "",

        FIELD_NO: row.TBP_FLD_NO_130 || "",
        INT_FIELD_NO: fieldNoInt || "",

        LENGTH: row.TBP_PIPE_LNG_10 || 0,
        DT_OF_PROC: dtOfProcDisplay,
        REMARKS: remarks || "",

        ROUGHNESS: roughness || "",

        DFT_F1: dftF1 || "",
        DFT_F2: dftF2 || "",
        DFT_F3: dftF3 || "",
        DFT_F4: dftF4 || "",

        DFT_T1: dftT1 || "",
        DFT_T2: dftT2 || "",
        DFT_T3: dftT3 || "",
        DFT_T4: dftT4 || "",

        CUT_F: cutBackFEnd || "",
        CUT_T: cutBackTEnd || "",

        VISUAL: visualInsp || "",
        RESULT: selectedResult?.value || "",
        MARKING: marking?.value || "",

        FINAL_INSP_DATE: finalInspDateDisplay,
        FINAL_INSP_DATE_RAW: finalInspDate,

        OLT_W1: onlineTestW1 || "",
        FINAL_STATION: finalStation || "",
        REPAIR_STATION: repairStation?.value || "",

        HEAT_NO: row.LOM_NO_CAST || "",
        LOM_WORK_CENTER: row.LOM_WORK_CENTER || "",
        PIPE_WEIGHT: row?.LOM_MS_PIECE_ACTL
          ? Number(row.LOM_MS_PIECE_ACTL).toFixed(3)
          : "0.000",
        TIME: formattedTime,
        MATERIAL: row.TBP_NO_MATNR || "",

        OLT_TESTB1: onlineTestB1 || "",
        OLT_TESTB2: onlineTestB2 || "",
        OLT_TESTB3: onlineTestB3 || "",

        // Hidden/internal fields retained for save
        ORDER_NO: row.ORDER_NO || ordNo || "",
        ITEM: row.ITEM || ordItem || "",
        PARENT_BATCH: row.LOM_ID_PAR_COIL_NO || rmBatchId?.value || "",
        INSPECT_NAME: inspectorname || "",
        CUST_NAME: row.CUST_NAME || "",
        PLAN_PROC: row.PLAN_PROC || "",
        LOM_MS_PIECE_ACTL: row.LOM_MS_PIECE_ACTL || 0,
        TBP_BATCH_NO: row.TBP_BATCH_NO || "",
      }));

      setThickTable(tableRows);
    } catch (error) {
      console.error(error);
      alertify.error("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const updateData = async () => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");

    const token = await GetAuthorization();
    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    const selectedRows = selectedThickTable?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      const msg = "Please select rows";
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(true);
      setSaveMsg(msg);
      alertify.error(msg);
      return;
    }

    const prodStartDateVal =
      document.getElementById("prodStartDate")?.value || "";
    const prodEndDateVal = document.getElementById("prodEndDate")?.value || "";

    const prodstartdt = formatDateTimeForSave(prodStartDateVal);
    const prodenddt = formatDateTimeForSave(prodEndDateVal);

    const weightMap = getThickTable.reduce((acc, item) => {
      acc[item.PIPE_NO] = parseFloat(item.LOM_MS_PIECE_ACTL) || 0;
      return acc;
    }, {});

    const newData = [];
    let hasError = false;

    for (const item of selectedRows) {
      if (hasError) break;

      const rowData = item.getData ? item.getData() : item?._row?.data;
      const pipeNo = rowData?.PIPE_NO || "";

      const weight = rowData?.PIPE_WEIGHT ? parseFloat(rowData.PIPE_WEIGHT) : 0;
      let batchOriginalWeight = weight;

      if (pipeNo in weightMap) {
        batchOriginalWeight = weightMap[pipeNo];
        if (weight > batchOriginalWeight) {
          const msg = `Weight for ${pipeNo} cannot be greater than batch original weight (${batchOriginalWeight.toFixed(
            3
          )}).`;
          alertify.error(msg);
          setShowSaveMsgSuccess(false);
          setShowSaveMsgError(true);
          setSaveMsg(msg);
          hasError = true;
          continue;
        }
      }

      if (!rowData?.RESULT || String(rowData.RESULT).trim() === "") {
        const msg = `Result cannot be empty for Pipe No: ${pipeNo}.`;
        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        hasError = true;
        continue;
      }

      const parentBatchValue =
        rowData?.PARENT_BATCH || rmBatchId?.value || "";

      if (!parentBatchValue || String(parentBatchValue).trim() === "") {
        const msg = `Parent Batch cannot be empty for Pipe No: ${pipeNo}.`;
        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        hasError = true;
        continue;
      }

      const batchScrapWeight = batchOriginalWeight - weight;

      newData.push({
        PLANT: "0780",
        BATCH_NO: pipeNo ?? null,
        CD_PROC: rowData.C_PRC ?? null,
        BATCH_PROC_NO: "0",
        NEXT_PROC: rowData.N_PRC ?? null,
        PROD_DATE: SHIFT_DATE,
        SHIFT: selectedShift?.value ?? null,
        WEIGHT: weight,
        BATCH_SCRAP_WEIGHT: batchScrapWeight,
        STATUS: "HC",
        PAR_COIL_NO: parentBatchValue ?? null,
        ID_FIRST_PAR: null,

        ID_ORDER_NO: rowData.ORDER_NO ?? null,
        ITEM_NO: rowData.ITEM ?? null,
        MATNR: rowData.MATERIAL ?? null,
        HEAT_NO: rowData.HEAT_NO ?? null,

        START_DT: prodstartdt,
        END_DT: prodenddt,
        RESULT: rowData.RESULT ?? null,
        REMARK: rowData.REMARKS ?? null,
        INSP_NAME: rowData.INSPECT_NAME ?? inspectorname ?? null,

        PIPE_LNG_10: rowData.LENGTH ?? null,
        PIPE_WEIGHT: weight,

        // Final Station Internal fields
        TBP_FLD_NO_130: rowData.FIELD_NO ?? null,
        TBP_FIELDNO_INT_160: rowData.INT_FIELD_NO ?? null,
        TBP_ROUGH_100: rowData.ROUGHNESS ?? null,

        TBP_DFT_F1_160: rowData.DFT_F1 ?? null,
        TBP_DFT_F2_160: rowData.DFT_F2 ?? null,
        TBP_DFT_F3_160: rowData.DFT_F3 ?? null,
        TBP_DFT_F4_160: rowData.DFT_F4 ?? null,

        TBP_DFT_T1_160: rowData.DFT_T1 ?? null,
        TBP_DFT_T2_160: rowData.DFT_T2 ?? null,
        TBP_DFT_T3_160: rowData.DFT_T3 ?? null,
        TBP_DFT_T4_160: rowData.DFT_T4 ?? null,

        TBP_ME_FEND_150: rowData.CUT_F ?? null,
        TBP_UME_TEND_150: rowData.CUT_T ?? null,

        TBP_VISUAL_INSP_80: rowData.VISUAL ?? null,
        TBP_MARKING_160: rowData.MARKING ?? null,
        FINAL_INSP_DATE: formatDateTimeForSave(
          rowData.FINAL_INSP_DATE_RAW ?? finalInspDate
        ),

        TBP_ONLTESTW1_160: rowData.OLT_W1 ?? null,
        TBP_FINALSTATION_160: rowData.FINAL_STATION ?? null,
        TBP_REPAIR_ST_160: rowData.REPAIR_STATION ?? null,

        TBP_ONLTESTB1_160: rowData.OLT_TESTB1 ?? null,
        TBP_ONLTESTB2_160: rowData.OLT_TESTB2 ?? null,
        TBP_ONLTESTB3_160: rowData.OLT_TESTB3 ?? null,
        ASL_NO: rowData.ASL_NO ?? null,


        TBP_DFTW5_160: rowData.DFTW5 ?? null, // if control exists

        TBP_WORK_CENTER: rowData.LOM_WORK_CENTER ?? null,

        TBP_SHIFT_DN: selectedShift?.value ?? null,
      });
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    setLoading(true);

    const data = {
      selectedRowsData: newData,
    };

    const url = "api/LD16S001/insertTempData";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          const errMsg =
            response?.error?.response?.data?.message || "An error occurred.";
          alertify.error(errMsg);
          setShowSaveMsgSuccess(false);
          setShowSaveMsgError(true);
          setSaveMsg(errMsg);
        } else {
          if (response.data?.failedCount > 0) {
            alertify.error(response.data?.message);
            setShowSaveMsgSuccess(false);
            setShowSaveMsgError(true);
            setSaveMsg(response.data?.message);
          } else {
            alertify.success(response.data?.message);
            setShowSaveMsgSuccess(true);
            setShowSaveMsgError(false);
            setSaveMsg(response.data?.message);

            setSelectedThickTable(null);
            setThickTable([]);
            handleClearAll();
            handleClearMain();
            fetchDetails();
          }
        }
      })
      .catch((error) => {
        console.error("Error during update:", error);
        const errMsg =
          error?.response?.data?.message || "Failed to update data.";
        alertify.error(errMsg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(errMsg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResultChange = (value) => {
    setSelectedResult(value);
  };

  const handleShiftChange = (value) => {
    setSelectedShift(value);
  };

  const clearFilterOnDate = () => {
    setThickTable([]);
    setSelectedThickTable(null);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
    { label: "HOLD", value: "HOLD" },
  ];

  const ShiftType = [
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "C", value: "C" },
    { label: "D", value: "D" },
    { label: "N", value: "N" },
  ];

  const YesNoType = [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" },
  ];

  const ThickColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      title: "Mark",
      hozAlign: "center",
      headerSort: false,
      // width: 70,
    },
    {
      title: "C Prc",
      field: "C_PRC",
      headerFilter: "input",
      // width: 80,
    },
    {
      title: "N Prc",
      field: "N_PRC",
      headerFilter: "input",
      // width: 80,
    },
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilter: "input",
      // width: 140,
    },
    {
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      // width: 140,
    },
    {
      title: "ASL No",
      field: "ASL_NO",
      headerFilter: "input",
      // width: 110,
    },
    {
      title: "Field No",
      field: "FIELD_NO",
      headerFilter: "input",
      // width: 110,
    },
    {
      title: "Int. Field No",
      field: "INT_FIELD_NO",
      headerFilter: "input",
      editor: "input",
      // width: 120,
      formatter: function (cell) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return cell.getValue();
      },
    },
    {
      title: "Length",
      field: "LENGTH",
      headerFilter: "input",
      hozAlign: "right",
      // width: 100,
    },
    {
      title: "Dt of Proc",
      field: "DT_OF_PROC",
      headerFilter: "input",
      // width: 120,
    },
    {
      title: "Result",
      field: "RESULT",
      headerFilter: "input",
      editable: true,
      editor: "select",
      editorParams: {
        values: {
          OK: "OK",
          "NOT OK": "NOT OK",
          HOLD: "HOLD",
        },
      },
      width: 100,
      formatter: function (cell) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return cell.getValue();
      },
    },
    {
      title: "Inspector",
      field: "INSPECT_NAME",
      headerFilter: "input",
      editor: "input",
      // width: 120,
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilter: "input",
      editor: "input",
      // width: 140,
      formatter: function (cell) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return cell.getValue();
      },
    },
    {
      title: "Roughness",
      field: "ROUGHNESS",
      headerFilter: "input",
      editor: "input",
      // width: 110,
      formatter: function (cell) {
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return cell.getValue();
      },
    },
    {
      title: "DFT F1",
      field: "DFT_F1",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "DFT F2",
      field: "DFT_F2",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "DFT F3",
      field: "DFT_F3",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "DFT F4",
      field: "DFT_F4",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "DFT T1",
      field: "DFT_T1",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "DFT T2",
      field: "DFT_T2",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "DFT T3",
      field: "DFT_T3",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "DFT T4",
      field: "DFT_T4",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "Cut F",
      field: "CUT_F",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "Cut T",
      field: "CUT_T",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    {
      title: "Visual",
      field: "VISUAL",
      headerFilter: "input",
      editor: "input",
      // width: 90,
    },
    
    {
      title: "Marking",
      field: "MARKING",
      headerFilter: "input",
      editor: "select",
      editorParams: {
        values: {
          YES: "YES",
          NO: "NO",
        },
      },
      width: 100,
    },
    {
      title: "Final Insp. Date",
      field: "FINAL_INSP_DATE",
      headerFilter: "input",
      // width: 130,
    },
    {
      title: "OLT W1",
      field: "OLT_W1",
      headerFilter: "input",
      editor: "input",
      // width: 100,
    },
    {
      title: "Final Station",
      field: "FINAL_STATION",
      headerFilter: "input",
      editor: "input",
      // width: 130,
    },
    {
      title: "Repair Station",
      field: "REPAIR_STATION",
      headerFilter: "input",
      editor: "select",
      editorParams: {
        values: {
          YES: "YES",
          NO: "NO",
        },
      },
      // width: 130,
    },
    {
      title: "Heat No",
      field: "HEAT_NO",
      headerFilter: "input",
      // width: 120,
    },
    {
      title: "Work Center",
      field: "LOM_WORK_CENTER",
      headerFilter: "input",
      // width: 120,
    },
    {
      title: "Weight(MTS)",
      field: "PIPE_WEIGHT",
      headerFilter: "input",
      hozAlign: "right",
      // width: 120,
      formatter: function (cell) {
        const value = cell.getValue();
        if (value === null || value === undefined || value === "") return "";
        const num = Number(value);
        return isNaN(num) ? value : num.toFixed(3);
      },
    },
    {
      title: "Time",
      field: "TIME",
      headerFilter: "input",
      // width: 100,
    },
    {
      title: "Material",
      field: "MATERIAL",
      headerFilter: "input",
      // width: 170,
    },
    {
      title: "OLT TESTB1",
      field: "OLT_TESTB1",
      headerFilter: "input",
      editor: "input",
      // width: 110,
    },
    {
      title: "OLT TESTB2",
      field: "OLT_TESTB2",
      headerFilter: "input",
      editor: "input",
      // width: 110,
    },
    {
      title: "OLT TESTB3",
      field: "OLT_TESTB3",
      headerFilter: "input",
      editor: "input",
      // width: 110,
    },
  ];

  const downloadExcelThickTableData = () => {
    if (!selectedThickTable) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    const len = selectedThickTable.getData();
    if (!len || len.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    const fileName = "LD16S001_FinalStationInternal.xlsx";
    window.XLSX = XLSX;

    selectedThickTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Final Station Internal"
      />

      <Grid container direction="row" justifyContent="center" alignItems="center">
        {loading && <Preloader />}
      </Grid>

      {isRestricted && (
        <Grid container direction="row" justifyContent="center" alignItems="center">
          <h4 style={{ color: "red", margin: "5rem" }}>
            You are not authorized to view this page !
          </h4>
        </Grid>
      )}

      {isRestricted === false && (
        <>
          <MDBox pt={6} pb={3} py={10}>
            <Grid container spacing={5}>
              {/* Screen required for entry - kept as is */}
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
                          Screen required for entry
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>

                      <Grid item xs={1}>
                        <Tooltip title="Clear All">
                          <IconButton color="white" onClick={() => handleClearMain()}>
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
                          value={pipeno}
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
                          Prod Start Date *
                        </MDTypography>

                        <input
                          type="datetime-local"
                          style={{ height: "37px", width: "100%" }}
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
                          Prod End Date *
                        </MDTypography>

                        <input
                          type="datetime-local"
                          style={{ height: "37px", width: "100%" }}
                          id="prodEndDate"
                          onChange={(e) => {
                            const d = new Date(e.target.value);
                            const year = d.getFullYear();
                            const month = ("0" + (d.getMonth() + 1)).slice(-2);
                            const day = ("0" + d.getDate()).slice(-2);
                            const hours = ("0" + d.getHours()).slice(-2);
                            const minutes = ("0" + d.getMinutes()).slice(-2);

                            const oracleDate = `${year}-${month}-${day} ${hours}:${minutes}`;
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
                          Prod Date *
                        </MDTypography>
                        <MDInput
                          name="Pdate"
                          id="Pdate"
                          iseditable="false"
                          value={SHIFT_DATE || ""}
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
                          onChange={(e) => handleShiftChange(e)}
                          value={selectedShift}
                        />
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              {/* Final Station Internal entry panel */}
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
                      <Grid item xs={3}>
                        <MDTypography variant="h6" color="white">
                          Final Station Internal
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>

                      <Grid item xs={1}>
                        <Tooltip title="Show Elements">
                          <IconButton
                            color="white"
                            aria-label="toggle"
                            onClick={() => setExpanded(!expanded)}
                          >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Clear All">
                          <IconButton color="white" onClick={() => handleClearAll()}>
                            <ClearAllIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </MDBox>

                  {expanded && (
                    <MDBox px={3} py={3}>
                      <Grid container spacing={1.5}>
                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Next Process
                          </MDTypography>
                          <MDInput name="nxtproc" value={nxtproc} disabled={true} />
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
                            Curr Process
                          </MDTypography>
                          <MDInput name="nxtproc2" value={nxtproc2} disabled={true} />
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
                            Int. Field No
                          </MDTypography>
                          <MDInput
                            name="fieldNoInt"
                            value={fieldNoInt}
                            onChange={(e) => {
                              setFieldNoInt(e.target.value);
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
                            Roughness
                          </MDTypography>
                          <MDInput
                            name="roughness"
                            value={roughness}
                            onChange={(e) => {
                              setRoughness(e.target.value);
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
                            Final Insp Date
                          </MDTypography>
                          <input
                            type="datetime-local"
                            style={{ height: "37px", width: "100%" }}
                            value={finalInspDate}
                            onChange={(e) => {
                              setFinalInspDate(e.target.value);
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
                            Result *
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
                            Inspector *
                          </MDTypography>
                          <MDInput
                            name="inspectorname"
                            value={inspectorname}
                            onChange={(e) => {
                              setInspectorName(e.target.value);
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
                            Marking
                          </MDTypography>
                          <ReactSelect
                            options={YesNoType}
                            onChange={(e) => {
                              setMarking(e);
                              setTableNull();
                            }}
                            value={marking}
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
                            Visual
                          </MDTypography>
                          <MDInput
                            name="visualInsp"
                            value={visualInsp}
                            onChange={(e) => {
                              setVisualInsp(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT F1
                          </MDTypography>
                          <MDInput
                            value={dftF1}
                            onChange={(e) => {
                              setDftF1(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT F2
                          </MDTypography>
                          <MDInput
                            value={dftF2}
                            onChange={(e) => {
                              setDftF2(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT F3
                          </MDTypography>
                          <MDInput
                            value={dftF3}
                            onChange={(e) => {
                              setDftF3(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT F4
                          </MDTypography>
                          <MDInput
                            value={dftF4}
                            onChange={(e) => {
                              setDftF4(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT T1
                          </MDTypography>
                          <MDInput
                            value={dftT1}
                            onChange={(e) => {
                              setDftT1(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT T2
                          </MDTypography>
                          <MDInput
                            value={dftT2}
                            onChange={(e) => {
                              setDftT2(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT T3
                          </MDTypography>
                          <MDInput
                            value={dftT3}
                            onChange={(e) => {
                              setDftT3(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            DFT T4
                          </MDTypography>
                          <MDInput
                            value={dftT4}
                            onChange={(e) => {
                              setDftT4(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Cut Back FEND
                          </MDTypography>
                          <MDInput
                            value={cutBackFEnd}
                            onChange={(e) => {
                              setCutBackFEnd(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Cut Back TEND
                          </MDTypography>
                          <MDInput
                            value={cutBackTEnd}
                            onChange={(e) => {
                              setCutBackTEnd(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            OLT W1
                          </MDTypography>
                          <MDInput
                            value={onlineTestW1}
                            onChange={(e) => {
                              setOnlineTestW1(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Final Station
                          </MDTypography>
                          <MDInput
                            value={finalStation}
                            onChange={(e) => {
                              setFinalStation(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Repair Station
                          </MDTypography>
                          <ReactSelect
                            options={YesNoType}
                            onChange={(e) => {
                              setRepairStation(e);
                              setTableNull();
                            }}
                            value={repairStation}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            OLT B1
                          </MDTypography>
                          <MDInput
                            value={onlineTestB1}
                            onChange={(e) => {
                              setOnlineTestB1(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            OLT B2
                          </MDTypography>
                          <MDInput
                            value={onlineTestB2}
                            onChange={(e) => {
                              setOnlineTestB2(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1.2}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            OLT B3
                          </MDTypography>
                          <MDInput
                            value={onlineTestB3}
                            onChange={(e) => {
                              setOnlineTestB3(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={3}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Remarks *
                          </MDTypography>
                          <MDInput
                            name="remarks"
                            value={remarks}
                            onChange={(e) => {
                              setRemarks(e.target.value);
                              setTableNull();
                            }}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={() => bindThickData()}
                          >
                            Fill Data
                          </MDButton>
                        </Grid>
                      </Grid>
                    </MDBox>
                  )}
                </Card>
              </Grid>

              {/* Data Table */}
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
                      <Grid item xs={3}>
                        <MDTypography variant="h6" color="white">
                          Final Station Internal Data
                        </MDTypography>
                      </Grid>

                      <Grid item xs={2}></Grid>

                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton color="white" onClick={() => updateData()}>
                            <SaveIcon />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Download">
                          <IconButton
                            color="white"
                            onClick={() => downloadExcelThickTableData()}
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
                        {getThickTable?.length > 0 && (
                          <div ref={tableRef} id="ThickTableContainer" />
                        )}

                        <br />
                        <p
                          style={{
                            color: "black",
                            paddingLeft: "1rem",
                            marginTop: "-1rem",
                          }}
                        >
                          Showing 1 to {getThickTable.length} of{" "}
                          {getThickTable.length} entries
                        </p>
                      </Grid>
                    </Grid>
                  </MDBox>
                </Card>
              </Grid>

              {showSaveMsgError && (
                <Grid item xs={12}>
                  <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => {
                      setShowSaveMsgError(false);
                    }}
                  >
                    <MDTypography variant="body2" color="white">
                      <MDTypography variant="body2" fontWeight="medium" color="white">
                        {saveMsg}
                      </MDTypography>
                    </MDTypography>
                  </Alert>
                </Grid>
              )}

              {showSaveMsgSuccess && (
                <Grid item xs={12}>
                  <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => {
                      setShowSaveMsgSuccess(false);
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
                  </Alert>
                </Grid>
              )}
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}