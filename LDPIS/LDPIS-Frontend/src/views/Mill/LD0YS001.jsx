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
import MDAlert from "@mui/material/Alert";

export default function LD0YS001() {
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
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const filterRevision = useRef(0);
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [process, setProcess] = useState(null);
  const [valueRadio, setValueRadio] = React.useState("NP");
  const [inspector, setInspector] = useState("");
  const [partCount, setPartCount] = useState(0);
  const [RESULT, setRESULT] = useState([]);
  const [remark, setRemark] = useState("");
  const [pipeCreationTableData, setPipeCreationTableData] = useState([]);
  const [pipeCreationTable, setPipeCreationTable] = useState(null);
  const [nextStationOptions, setNextStationOptions] = useState([
  { label: "90", value: "A" },
  { label: "130", value: "E" },
]);

  const passRejectDecisionList = [
  { value: "P", label: "PASS" },
  { value: "R", label: "REJECT" },
];

const rejectOnlyDecisionList = [
  { value: "R", label: "REJECT" },
];

  const [matNoListDown, setMatNoListDown] = useState([]);
  const [matNoListScrap, setMatNoListScrap] = useState([]);

  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    setPipeCreationTableData([]);
    if (event.target.value === "NP") setPartCount(1);
    selectedEndFacingTable([]);
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
          getPipeNoList(data.accessToken),
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
    var fileName = "LD0YS001" + ".xlsx";

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
      var pageName = "LD0YS001";
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

  const getPipeNoList = async (accessToken) => {
    const response = await axiosAPI.post(
      "api/LD0YS001/getPipeNoList",
      { status: "YC", rmBatch: "" },
      { headers: { Authorization: "Bearer " + accessToken } }
    );
    setPipeNoList((Array.isArray(response.data) ? response.data : []).map((row) => ({
      label: row.LOM_ID_BATCH,
      value: row.LOM_ID_BATCH,
      parentCoilNo: row.LOM_ID_PAR_COIL_NO,
    })));
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
      };
      var url = "api/LD0YS001/getMaterialNo";
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
              obj.label = row.MAT_DESC;
              obj.value = row.MAT_NO;
              items.push(obj);
            });
            if (decision === "DOWNGRADE") {
              setMatNoListDown(items);
            } else if (decision === "SCRAP") {
              setMatNoListScrap(items);
            }
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };
  const canSelectPassDecision = (currProc) => {
  if (!currProc) return false;

  // If CURR_PROC is exactly D or starts with D, allow PASS
  return currProc.toString().trim().toUpperCase().charAt(0) === "G";
};
  const handlePipeNoChange = async (value) => {
    const revision = ++filterRevision.current;
    setPipeNo(value || null);
    setrmBatchId(value?.parentCoilNo != null
      ? { label: value.parentCoilNo, value: value.parentCoilNo } : null);
    setOrdNo("");
    setOrdItem("");
    setPipeCreationTableData([]);
    if (!value?.value) return;
    try {
      const token = await GetAuthorization();
      const response = await axiosAPI.post(
        "api/LD0YS001/getPipeInfo",
        { RM_BATCH: value.value, ORDNO: "", ORDITEM: "" },
        { headers: { Authorization: "Bearer " + token.accessToken } }
      );
      if (revision !== filterRevision.current) return;
      const row = response.data?.[0];
      if (!row) {
        alertify.error("No details found for the selected pipe.");
        return;
      }
      setOrdNo(String(row.LOM_ID_ORDER_CUS ?? ""));
      setOrdItem(String(row.LOM_ID_ORD_ITEM_CUS ?? ""));
      const parent = row.LOM_ID_PAR_COIL_NO ?? value.parentCoilNo;
      setrmBatchId(parent != null ? { label: parent, value: parent } : null);
    } catch (error) {
      if (revision === filterRevision.current) {
        alertify.error("Failed to retrieve pipe order details: " + error);
      }
    }
  };

  const handleOrderChange = (event) => {
    ++filterRevision.current;
    setOrdNo(event.target.value);
    setPipeNo(null);
    setrmBatchId(null);
    setPipeCreationTableData([]);
  };

  const handleItemChange = (event) => {
    ++filterRevision.current;
    setOrdItem(event.target.value);
    setPipeNo(null);
    setrmBatchId(null);
    setPipeCreationTableData([]);
  };

  const handleClearAll = (newToken = false) => {
    ++filterRevision.current;
    setOrdNo("");
    setOrdItem("");
    setrmBatchId(null);
    setPipeNo(null);
    setInspector("");
    setRemark("");
    setRESULT("");
    setPartCount("");
    setPipeCreationTableData([]);
    setShowSaveMsgError(false);
    setShowSaveMsgSuccess(false);
    setSaveMsg("");
  };

  const fillData = async () => {
    setLoading(true);
    try {
      const normalizedOrderNo = String(ordNo ?? "").trim();
      const normalizedOrderItem = String(ordItem ?? "").trim();
      const pipeMode = Boolean(pipeno?.value);
      const revision = filterRevision.current;
      if (!pipeMode && (!normalizedOrderNo || !normalizedOrderItem)) {
        alertify.error("Select Pipe No or enter both Order No and Order Item.");
        return;
      }
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      const dummyData = [];
      const pipeid = {
        // This API's legacy RM_BATCH parameter identifies the pipe.
        RM_BATCH: pipeMode ? pipeno.value : "",
        ORDNO: pipeMode ? "" : normalizedOrderNo,
        ORDITEM: pipeMode ? "" : normalizedOrderItem,
      };
      let loopCounter = 1;
      // if (valueRadio === "P") {
      //   if (partCount > 1 && partCount < 27) {
      //     loopCounter = partCount;
      //   } else {
      //     // Invalid partCount
      //     alertify.error("partCount must be greater than 1 and less than 27");
      //     return;
      //   }
      // }
      const url1 = "api/LD0YS001/getPipeInfo";
      const info = await axiosAPI.post(url1, pipeid, defaultOptions);
      if (revision !== filterRevision.current) return;
      if (info?.status !== 200 || !Array.isArray(info?.data) || !info.data.length) {
        alertify.error("Failed to retrieve PIPE Info.");
        setLoading(false);
        return; // Stop execution if API call fails
      }
      for (const pipeInfo of info.data) {
      const sourcePipe = String(pipeInfo.LOM_ID_BATCH ?? (pipeMode ? pipeno.value : ""));
      if (!sourcePipe || !String(pipeInfo.LOM_ID_PAR_COIL_NO ?? "").trim()) {
        alertify.error("Pipe info must include LOM_ID_BATCH and LOM_ID_PAR_COIL_NO for every pipe.");
        return;
      }
      let pipeLenFlag = false;

      for (let i = 0; i < loopCounter; i++) {
        let new_pipeid;
        if (valueRadio === "P") {
          if (sourcePipe.length === 10) {
            pipeLenFlag = true;
            alertify.error("Pipe cannot be parted as pipe Length is 10");
            return;
          }
          const lastCharIndex = sourcePipe.length; // Get the index of the last character
          const newChar = String.fromCharCode(65 + i); // 65 is the ASCII code for 'A'
          new_pipeid = sourcePipe.slice(0, lastCharIndex) + newChar; // Replace last character
        } else {
          new_pipeid = sourcePipe;
        }
        if (pipeLenFlag === true) {
          return;
        }
        const data = {
          PIPEID: new_pipeid,
          SOURCE_PIPE: sourcePipe,
          CURR_PROC: pipeInfo?.CURR_PROC,
          // RESULT: RESULT.value,
          NEXT_STATION: isQualityOperationD(pipeInfo?.CURR_PROC) ? "D" : "A",
          REMARK: remark,
          PARTNO: partCount,
          RM_BATCH:
            valueRadio === "P"
              ? sourcePipe
              : pipeInfo.LOM_ID_PAR_COIL_NO,
          WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL,
          NEXT_PROC: "T",
          EWI_ID_ORDER_CUS: pipeInfo?.LOM_ID_ORDER_CUS,
          EWI_ID_ORD_ITEM_CUS: pipeInfo?.LOM_ID_ORD_ITEM_CUS,
          EWI_SEC1: pipeInfo?.LOM_SEC1,
          EWI_SEC2: pipeInfo?.LOM_SEC2,
          EWI_LENGTH: pipeInfo?.LOM_LENGTH,
          LENGTH: pipeInfo?.LOM_LENGTH,
          PIPE_WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL?.toFixed(3),
          DEPTH_MM: pipeInfo?.DEPTH_MM,
          WIDTH_MM: pipeInfo?.WIDTH_MM,
          WALL_THICK_END: pipeInfo?.WALL_THICK_END,
          GEO: pipeInfo?.GEO,
          INSPECTOR: inspector,
          TBP_REMARKS: pipeInfo?.TBP_REMARK,
          txtDecision: "",
          txtMatNo: "",
        };
        dummyData.push(data);
      }
      }
      console.log(dummyData);
      setPipeCreationTableData(dummyData);
    } catch (error) {
      alertify.error("Error filling data: " + error);
    } finally {
      setLoading(false);
    }
  };

  //RESULT IS REMOVED
  const handleResultChange = (value) => {
    setRESULT(value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];
  const canChangeToStation130 = (currProc) => {
  if (!currProc) return false;
  
  // Extract the first character (A, B, C, D, etc.)
  const procChar = currProc.charAt(0).toUpperCase();
  
  // Allow change if process is D or above (D, E, F, etc.)
  // A=65, B=66, C=67, D=68 in ASCII
  return procChar.charCodeAt(0) >= 68;
};

  const confirm = async (newToken = false) => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    if (pipeCreationTableData.length !== 0) {
      if (newToken) {
        const rsp = await getAuthorization();
      }
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };

      var url = "";
      var tableData = pipeCreationTable.getData();
      if (inspector.length == 0) {
        alertify.error("Please enter Inspector Name");
        return;
      }
      var newReworkData = [];
      // let lenWtFlag = false;
      // let matNoFlag = false;
      for (const item of tableData) {
        
        // Decision validation
          if (
          item?.txtDecision === null ||
          item?.txtDecision === undefined ||
          item?.txtDecision.toString().trim() === ""
          ) {
          alertify.error(
          `Decision cannot be blank for Pipe ${item?.PIPEID || ""}`
          );
          return;
          }
        console.log("item: ", item);
        // Push valid items to newReworkData
        // newReworkData.push(item);

        newReworkData.push({
          pipeId: item?.PIPEID,
          rmBatch: item?.RM_BATCH,
          remark: item?.REMARK,
          inspector: item?.INSPECTOR,
          decision: item?.txtDecision,
          nextStation: item?.NEXT_STATION, // Add this line
          LENGTH:item?.LENGTH,
          PIPE_WEIGHT: item?.PIPE_WEIGHT
        });

        // }
        // else {
        //   lenWtFlag = true;
        //   return;
        // }
      };

      // if (lenWtFlag === true) {
      //   alertify.error("Length or Parted Pipe Weight cannot be blank");
      //   return;
      // }
      // if (matNoFlag === true) {
      //   alertify.error("Material No. is mandatory for SCRAP & DOWNGRADE");
      //   return;
      // }

      // let totalPartPipes = parseFloat(
      //   pipeCreationTable.getCalcResults()?.bottom?.PIPE_WEIGHT || 0
      // );
      // let motherTotal = parseFloat(newReworkData?.[0]?.WEIGHT)?.toFixed(3);
      // const tolerance = 0.00001; //Slightly smaller than the rounding precision

      // totalPartPipes = totalPartPipes?.toFixed(3);

      // const diffWt = Math.abs(totalPartPipes - motherTotal)?.toFixed(3);
      // console.log("diffWt: ", diffWt);

      // if (newReworkData.length > 0 && diffWt > tolerance) {
      //   alertify.error(
      //     "Total Mother weight not equal to parted pipes weight.Short by " +
      //       diffWt
      //   );
      //   return;
      // }

      // let totalPartPipesLength = parseFloat(
      //   pipeCreationTable.getCalcResults()?.bottom?.LENGTH || 0
      // );
      // let motherTotalLength = parseFloat(newReworkData?.[0]?.PIPE_LEN);
      // const toleranceLength = 0.00001; //Slightly smaller than the rounding precision

      // totalPartPipesLength = totalPartPipesLength?.toFixed(3);
      // const diffLen = Math.abs(
      //   totalPartPipesLength - motherTotalLength
      // )?.toFixed(3);

      // if (newReworkData.length > 0 && diffLen > toleranceLength) {
      //   alertify.error(
      //     "Total Mother Length not equal to parted pipes Length.Short by " +
      //       diffLen
      //   );
      //   return;
      // }

      var data = {
        newReworkData: newReworkData,
        // parting: valueRadio,
      };
      console.log("data: ", data);
      setLoading(true);
      url = "api/LD0YS001/insertpipedetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response?.statusText != "" && response?.statusText != "OK") {
            // ignore
          } else if (response?.data) {
            // New controller returns { error: boolean, message?: string, overallFlag?: string, perPipeResults?: [] }
            if (response.data.error === false) {
              const msg = "Rework Recorded successfully";
              setShowSaveMsgSuccess(true);
              setShowSaveMsgError(false);
              setSaveMsg(msg);
              alertify.success(msg);
              handleClearAll(true);
            } else {
              // Error case: prefer response.data.message, otherwise summarise perPipeResults
              let msg = response.data.message ?? "Operation failed";
              if ((!msg || msg === "") && Array.isArray(response.data.perPipeResults)) {
                msg = response.data.perPipeResults
                  .map((p) => (p.pipeId ? `${p.pipeId}: ${p.status} ${p.message || ""}` : p.message || ""))
                  .filter(Boolean)
                  .join("; ");
              }
              alertify.error(msg);
              setShowSaveMsgError(true);
              setShowSaveMsgSuccess(false);
              setSaveMsg(msg);
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

   //Function to calculate pipe wt
    const calculatePipeWt = async (length, odia, thick, width, depth, geo, sourcePipe) => {
      setLoading(true);
      try {
        const token = await GetAuthorization();
        const defaultOptions = {
          headers: {
            Authorization: "Bearer " + token.accessToken,
          },
        };
  
        const url = "api/LD0RS001/getPipeWeight";
        let data = {
          p_plant: "0780",
          p_batch_id: sourcePipe ?? "",
          p_length: length ?? "",
          p_od: odia ?? "",
          p_thickness: thick ?? "",
          p_depth: depth ?? "",
          p_width: width ?? "",
          p_geo: geo ?? "",
        };
        const resp = await axiosAPI.post(url, data, defaultOptions);
        if (
          resp.status !== 200 ||
          !resp.data ||
          !resp.data[0] ||
          !resp.data[0].WEIGHT
        ) {
          alertify.error("Failed to retrieve weight.");
          setLoading(false);
          return;
        }
        const weight = Number(resp?.data[0]?.WEIGHT);
        return weight;
      } catch (error) {
        alertify.error("Error filling data: " + error);
      } finally {
        setLoading(false);
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
      rowFormatter: function (row) {
        var data = row.getData();
        if (data.txtDecision === "DOWNGRADE") {
          row.getElement().style.backgroundColor = "#D3E4EE";
        } else if (data.txtDecision === "SCRAP") {
          row.getElement().style.backgroundColor = "#F2EDDE";
        } else {
          row.getElement().style.backgroundColor = ""; // Or "white" or your default
        }
      },
    });

    setPipeCreationTable(table);
    // return () => {
    //   //table.destroy();
    // };
    // }
  }, [pipeCreationTableData, matNoListDown, matNoListScrap]);

  const isQualityOperationD = (currProc) => {
  if (!currProc) return false;

  return currProc.toString().trim().toUpperCase() === "D";
};
  const pipeCreationColumn = [
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
      field: "PIPEID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    { 
      title: "RM Coil",
      field: "RM_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "Return Remarks",
      field: "TBP_REMARKS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
          title: "Pipe Wt(Kg)",
          field: "WEIGHT",
          headerFilterPlaceholder: "search...",
          headerFilter: "input",
          hozAlign: "right",
          formatter: function (cell, formatterParams) {
            var value = cell.getValue();
            if (value) {
              return value.toFixed(3);
            }
            return value;
          },
        },
        {
          title: "Len(mm)",
          field: "EWI_LENGTH",
          headerFilterPlaceholder: "search...",
          headerFilter: "input",
          hozAlign: "right",
        },  
        {
          title: "New Length(mm)",
          field: "LENGTH",
          headerFilter: "input",
          headerFilterPlaceholder: "search...",
          headerSort: false,
          editor: "input",//valueRadio === "P" ? "input" : "",
          hozAlign: "right",
          bottomCalc: "sum",
          visible:false,
          bottomCalcParams: { precision: 0 },
          formatter: function (cell, formatterParams) {
            var value = cell?.getValue();
            // if (valueRadio == "P") {
              cell.getElement().style["background-color"] = "#DA8EE7";
              cell.getElement().style["color"] = "#FFFFFF";
            // }
            return value;
          },
          cellEdited: async function (cell) {
            var value = cell.getValue();
            var row = cell?.getRow();
            // Check if value is a number
            if (isNaN(value) || value === "") {
              alertify.error("Please enter a valid number");
              row.update({
                LENGTH: 0,
              });
              return 0;
            }
    
            let odia = cell?.getData()?.OD;
            let length = value;
            let thick = cell?.getData()?.THICK;
            let depth = cell?.getData()?.DEPTH_MM;
            let width = cell?.getData()?.WIDTH_MM;
            let geo = cell?.getData()?.GEO;
    
            let pipeWtVal = await calculatePipeWt(
              length,
              odia,
              thick,
              width,
              depth,
              geo,
              row.getData().SOURCE_PIPE || row.getData().PIPEID
            );
            var row = cell.getRow();
            row.update({
              PIPE_WEIGHT: pipeWtVal,
            });
    
            return value;
          },
        },
        {
          field: "PIPE_WEIGHT",
          title: "Parted Pipe Weight(KG)",
          headerFilter: "input",
          headerFilterPlaceholder: "search...",
          headerSort: false,
          // editor: "number",//valueRadio === "P" ? "number" : "",
          bottomCalc: "sum",
          bottomCalcParams: { precision: 3 },
          hozAlign: "right",
          visible:false,
          formatter: function (cell, formatterParams) {
            var value = cell?.getValue();
            // if (valueRadio == "P") {
              cell.getElement().style["background-color"] = "#DA8EE7";
              cell.getElement().style["color"] = "#FFFFFF";
            // }
            return value;
          },
        },
        {
  title: "Next Station",
  field: "NEXT_STATION",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  width: "120",
  editor: false,
  formatter: function (cell) {
    const value = cell.getValue();

    cell.getElement().style["background-color"] = "#f5f5f5";
    cell.getElement().style["color"] = "#000000";

    return value;
  },
},

    {
      title: "Remark",
      field: "REMARK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Inspector",
      field: "INSPECTOR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },

   {
  title: "Decision",
  field: "txtDecision",
  headerFilter: "input",
  headerFilterPlaceholder: "search...",
  width: "100",
  editor: "list",

  editorParams: function (cell) {
    const currProc = cell?.getRow()?.getData()?.CURR_PROC;
    const allowPass = canSelectPassDecision(currProc);

    return {
      allowEmpty: true,
      showListOnEmpty:      true,
      values: allowPass ? passRejectDecisionList : rejectOnlyDecisionList,
    };
  },

  formatter: function (cell) {
    const value = cell.getValue();

    cell.getElement().style["background-color"] = "#DA8EE7";
    cell.getElement().style["color"] = "#FFFFFF";

    if (value === "P") return "PASS";
    if (value === "R") return "REJECT";

    return value;
  },

  cellEdited: async function (cell) {
    const row = cell?.getRow();
    const rowData = row?.getData();
    const currProc = rowData?.CURR_PROC;
    const newValue = cell?.getValue();

    const allowPass = canSelectPassDecision(currProc);

    // Extra validation in case value is pasted/updated manually
    if (!allowPass && newValue === "P") {
      alertify.error(
        `PASS is allowed only when Quality Operation is D. Current Quality Operation is ${currProc}.`
      );

      row.update({
        txtDecision: "R",
      });

      return false;
    }

    row.update({
      txtMatNo: "",
    });

    
    if (newValue !== "P") {
      await getMaterialNo(newValue);
    }
  },
},
    {
      title: "Material No.",
      field: "txtMatNo",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: "200",
      editor: "list",
      visible: false,
      //   editorParams: {
      //     allowEmpty: false,
      //     showListOnEmpty: true,
      //     values: matNoList,
      //   },
      editorParams: function (cell) {
        let decision = cell?.getRow()?.getData()?.txtDecision;

        if (decision === "DOWNGRADE") {
          return {
            allowEmpty: false,
            showListOnEmpty: true,
            values: matNoListDown,
          };
        }
        if (decision === "SCRAP") {
          return {
            allowEmpty: false,
            showListOnEmpty: true,
            values: matNoListScrap,
          };
        }
        return { allowEmpty: true, values: [] };
      },
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var decision = cell?.getRow()?.getData()?.txtDecision;

        if (decision !== "DOWNGRADE" && decision !== "SCRAP") {
          var editor = document.createElement("input");
          editor.readOnly = true;
          editor.style.padding = "3px";
          editor.style.width = "100%";
          editor.value = cell.getValue() || "";
          onRendered(() => editor.focus());

          editor.addEventListener("blur", function () {
            success(editor.value);
          });
          return editor;
        }
        var editor1 = document.createElement("select");
        editorParams.values.forEach((item) => {
          var option = document.createElement("option");
          option.value = item.value;
          option.text = item.label;
          editor1.appendChild(option);
        });

        editor1.value = cell.getValue();
        editor1.style.padding = "3px";
        editor1.style.width = "100%";

        onRendered(() => editor1.focus());
        editor1.addEventListener("change", function () {
          success(editor1.value);
        });

        return editor1;
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        var decision = cell?.getRow()?.getData().txtDecision;
        if (decision === "DOWNGRADE" || decision === "SCRAP") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        } else {
          cell.getElement().style["background-color"] = "white";
          cell.getElement().style["color"] = "black";
        }
        return value;
      },
    },
    {
      title: "Wall Thick End",
      field: "WALL_THICK_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
    },
    {
      title: "Geometry",
      field: "GEO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Depth(mm)",
      field: "DEPTH_MM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
    },
    {
      title: "Width(mm)",
      field: "WIDTH_MM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
    },
    {
      title: "Thick",
      field: "EWI_SEC1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia",
      field: "EWI_SEC2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(3);
        }
        return value;
      },
    },
    // {
    //   title: "Quality Operation",
    //   field: "CURR_PROC",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    // },
  ];

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="Y - Rework Internal Coating"
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
                          Pipe No {pipeno?.value ? "*" : ""}
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
                        <MDTypography fontWeight="regular" fontSize="small" variant="h6" color="dark" noWrap>
                          Order No {!pipeno?.value ? "*" : ""}
                        </MDTypography>
                        <MDInput name="ordNo" value={ordNo} onChange={handleOrderChange} fullWidth />
                      </Grid>
                      <Grid item xs={2}>
                        <MDTypography fontWeight="regular" fontSize="small" variant="h6" color="dark" noWrap>
                          Order Item {!pipeno?.value ? "*" : ""}
                        </MDTypography>
                        <MDInput name="ordItem" value={ordItem} onChange={handleItemChange} fullWidth />
                      </Grid>

                      {/* <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          No of Parts*
                        </MDTypography>
                        <MDInput
                          label=""
                          name="NoParts"
                          value={partCount}
                          onChange={(e) => {
                            setPartCount(e.target.value);
                            setPipeCreationTableData([]);
                          }}
                          disabled={valueRadio === "NP"} // Disable input if Non-Parting is selected
                        />
                      </Grid> */}
                      <Grid item xs={1.5}>
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
                            setPipeCreationTableData([]);
                          }}
                        />
                      </Grid>
                      {/* <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Result
                        </MDTypography>
                        <ReactSelect
                          options={ResultType}
                          onChange={handleResultChange}
                          value={RESULT}
                        />
                      </Grid> */}
                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Remark
                        </MDTypography>
                        <MDInput
                          label=""
                          name="remark"
                          value={remark}
                          onChange={(e) => {
                            setRemark(e.target.value);
                            setPipeCreationTableData([]);
                          }}
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
                      {/* <Grid item xs={3}>
                        <FormControl>
                          <FormLabel id="demo-row-radio-buttons-group-label">
                            Function
                          </FormLabel>
                          <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={valueRadio}
                            onChange={handleRadioChange}
                          >
                            <FormControlLabel
                              value="P"
                              control={<Radio />}
                              label="Parting"
                            />
                            <FormControlLabel
                              value="NP"
                              control={<Radio />}
                              label="Non-Parting"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Grid> */}
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

                <Grid marginTop={"1rem"}></Grid>
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
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}

