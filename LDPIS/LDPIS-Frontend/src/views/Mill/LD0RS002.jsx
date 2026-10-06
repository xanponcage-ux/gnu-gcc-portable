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
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

export default function LD0RS002() {
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
  const [process, setProcess] = useState(null);
  const [valueRadio, setValueRadio] = React.useState("P");
  const [inspector, setInspector] = useState("");
  const [partCount, setPartCount] = useState(0);
  const [RESULT, setRESULT] = useState([]);
  const [remark, setRemark] = useState("");
  const [pipeCreationTableData, setPipeCreationTableData] = useState([]);
  const [pipeCreationTable, setPipeCreationTable] = useState(null);
  const decisionList = [
    { value: "PASS", label: "PASS", id: 1 },
    { value: "DOWNGRADE", label: "DOWNGRADE", id: 2 },
    { value: "SCRAP", label: "SCRAP", id: 3 },
  ];
  //   const [matNoList, setMatNoList] = useState([]);

  const [matNoListDown, setMatNoListDown] = useState([]);
  const [matNoListScrap, setMatNoListScrap] = useState([]);

  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  //Update Mat Tab
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => setTabValue(newValue);
  const [plant, setPlant] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState("");
  const [tableData, setTableData] = useState([]);
  const [table, setTable] = useState([]);
  const [matTabAccFlag, setMatTabAccFlag] = useState(0);
  const [spclComntAccess, setSpclComntAccess] = useState(0);
  const [surfCondLs, setSurfCondLs] = useState([]);
  const [endFinLs, setEndFinLs] = useState([]);
  const [iniGeometry, setIniGeometry] = useState([]); //to strore initial geometry value

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    setPipeCreationTableData([]);
    if (event.target.value === "NP") setPartCount(1);
    // selectedEndFacingTable([]);
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
          getRmList(data.accessToken, "RD"),
          getPipeNoList(data.accessToken, "RD"),
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
      });
  };

  const downloadExcelcustomerTableData = () => {
    console.log("table: ", table);
    if (table == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = table.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD0RS002 Tab 2" + ".xlsx";

    window.XLSX = XLSX;

    table.download("xlsx", fileName, {
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
      var pageName = "LD0RS002";
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
    var url = "api/LD0RS002/getRmList";
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
          Promise.all([getPipeNoList("", accessToken, data.status)]);
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
      status: "RD",
      rmBatch: value.value ? value.value : "",
    };
    var url = "api/LD0RS002/getPipeNoList";
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
        pipeid: pipeno?.value || "",
      };
      var url = "api/LD0RS002/getMaterialNo";
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
              obj.label = row.MAT_NO;
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

  const handleRMBatchChange = (value) => {
    console.log("value: ", value);
    setPipeNo(null);
    setPipeNoList([]);
    setrmBatchId(value);
    setPipeCreationTableData([]);

    let status = "RD";
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([getPipeNoList(value, data.accessToken, status)]).finally(
          () => {
            setLoading(false);
          }
        );
      });
    }
  };

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setPipeCreationTableData([]);
  };

  const handleClearAll = (newToken = false) => {
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
      if (pipeno === null || pipeno === "") {
        alertify.error("Select Pipe No.");
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
        RM_BATCH: pipeno.value || "",
      };
      let loopCounter = 1;
      if (valueRadio === "P") {
        if (partCount > 1 && partCount < 27) {
          loopCounter = partCount;
        } else {
          // Invalid partCount
          alertify.error("partCount must be greater than 1 and less than 27");
          return;
        }
      }
      const url1 = "api/LD0RS002/getPipeInfo";
      const info = await axiosAPI.post(url1, pipeid, defaultOptions);
      if (info?.status !== 200 || !info?.data || !info?.data[0]) {
        alertify.error("Failed to retrieve PIPE Info.");
        setLoading(false);
        return; // Stop execution if API call fails
      }
      const pipeInfo = info.data[0];
      setIniGeometry(pipeInfo?.GEO); //To keep track of geometry

      let pipeLenFlag = false;

      for (let i = 0; i < loopCounter; i++) {
        let new_pipeid;
        if (valueRadio === "P") {
          if (pipeno?.value?.length === 10) {
            pipeLenFlag = true;
            alertify.error("Pipe cannot be parted as pipe Length is 10");
            return;
          }
          const lastCharIndex = pipeno.value.length; // Get the index of the last character
          const newChar = String.fromCharCode(65 + i); // 65 is the ASCII code for 'A'
          new_pipeid = pipeno.value.slice(0, lastCharIndex) + newChar; // Replace last character
        } else {
          new_pipeid = pipeno?.value;
        }
        if (pipeLenFlag === true) {
          return;
        }
        const data = {
          PIPEID: new_pipeid,
          CURR_PROC: "R",
          // RESULT: RESULT.value,
          REMARK: remark,
          PARTNO: partCount,
          RM_BATCH:
            valueRadio === "P"
              ? pipeno?.value
              : info?.data[0]?.LOM_ID_PAR_COIL_NO,
          WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL,
          NEXT_PROC: "T",
          EWI_ID_ORDER_CUS: pipeInfo?.LOM_ID_ORDER_CUS,
          EWI_ID_ORD_ITEM_CUS: pipeInfo?.LOM_ID_ORD_ITEM_CUS,
          EWI_SEC1: pipeInfo?.LOM_SEC1,
          EWI_SEC2: pipeInfo?.LOM_SEC2,
          LENGTH: valueRadio === "NP" ? pipeInfo?.LENGTH : "",
          PIPE_LEN: pipeInfo?.LENGTH,
          INSPECTOR: inspector,
          txtDecision: "",
          txtMatNo: "",
          SUR_FIN: pipeInfo?.SUR_FIN,
          END_FIN: pipeInfo?.END_FIN,
          LOM_NO_MATNR: pipeInfo?.LOM_NO_MATNR,
          PIPE_WEIGHT:
            valueRadio === "NP" ? pipeInfo?.LOM_MS_PIECE_ACTL?.toFixed(3) : "",
          DEPTH_MM: pipeInfo?.DEPTH_MM,
          WIDTH_MM: pipeInfo?.WIDTH_MM,
          WALL_THICK_END: pipeInfo?.WALL_THICK_END,
          GEO: pipeInfo?.GEO,
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

  //Function to calculate pipe wt
  const calculatePipeWt = async (length, odia, thick, width, depth, geo) => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LD0RS002/getPipeWeight";
      let data = {
        p_plant: "0780",
        p_batch_id: pipeno?.value ?? "",
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

  //Function to calculate geometry
  const getGeometry = async (matNo) => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LD0RS002/getGeometry";
      let data = {
        matNo: matNo,
      };
      const resp = await axiosAPI.post(url, data, defaultOptions);
      let geometryVal = resp?.data?.[0]?.GEOMETRY;
      return geometryVal;
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

      var url;
      var tableData = pipeCreationTable.getData();
      if (inspector.length == 0) {
        alertify.error("Please enter Inspector Name");
        return;
      }
      var newReworkData = [];
      let lenWtFlag = false;
      let matNoFlag = false;
      let desFlag = false;
      tableData.forEach(function (item) {
        if (
          item.LENGTH !== 0 &&
          item.LENGTH !== "" &&
          item.LENGTH !== null &&
          item.LENGTH !== undefined &&
          item.PIPE_WEIGHT !== 0 &&
          item.PIPE_WEIGHT !== "" &&
          item.PIPE_WEIGHT !== null &&
          item.PIPE_WEIGHT !== undefined
        ) {
          if (!item?.txtDecision) {
            desFlag = true;
            return;
          }
          if (
            item.txtDecision !== "PASS" &&
            (item.txtMatNo === null || item.txtMatNo === "")
          ) {
            matNoFlag = true;
            return;
          }

          // Push valid items to newReworkData
          newReworkData.push(item);
        } else {
          lenWtFlag = true;
          return;
        }
      });

      //adding here to exit the function & err comes one time
      if (desFlag) {
        alertify.error("Please Select Decision!");
        return;
      }
      if (lenWtFlag === true) {
        alertify.error("Length or Parted Pipe Weight cannot be blank");
        return;
      }
      if (matNoFlag === true) {
        alertify.error("Material No. is mandatory for SCRAP & DOWNGRADE");
        return;
      }

      let totalPartPipes = parseFloat(
        pipeCreationTable.getCalcResults()?.bottom?.PIPE_WEIGHT || 0
      );
      let motherTotal = parseFloat(newReworkData?.[0]?.WEIGHT)?.toFixed(3);
      const tolerance = 0.00001; //Slightly smaller than the rounding precision

      totalPartPipes = totalPartPipes?.toFixed(3);

      const diffWt = Math.abs(totalPartPipes - motherTotal)?.toFixed(3);
      console.log("diffWt: ", diffWt);

      if (newReworkData.length > 0 && diffWt > tolerance) {
        alertify.error(
          "Total Mother weight not equal to parted pipes weight.Short by " +
            diffWt
        );
        return;
      }

      let totalPartPipesLength = parseFloat(
        pipeCreationTable.getCalcResults()?.bottom?.LENGTH || 0
      );
      let motherTotalLength = parseFloat(newReworkData?.[0]?.PIPE_LEN);
      const toleranceLength = 0.00001; //Slightly smaller than the rounding precision

      totalPartPipesLength = totalPartPipesLength?.toFixed(3);
      const diffLen = Math.abs(
        totalPartPipesLength - motherTotalLength
      )?.toFixed(3);

      if (newReworkData.length > 0 && diffLen > toleranceLength) {
        alertify.error(
          "Total Mother Length not equal to parted pipes Length.Short by " +
            diffLen
        );
        return;
      }

      var data = {
        newReworkData: newReworkData,
        parting: valueRadio,
      };
      console.log("data: ", data);
      setLoading(true);
      url = "api/LD0RS002/insertpipedetails";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            //reject(response.statusText);
          } else {
            if (response?.data?.errorString?.[0] === "Y") {
              let msg = "Rework Recorded successfully";
              setShowSaveMsgSuccess(true);
              setShowSaveMsgError(false);
              setSaveMsg(msg);
              alertify.success(msg);
              handleClearAll(true);
            } else {
              let msg = response?.data?.errorString;
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
      title: "No Of parts",
      field: "PARTNO",
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
      title: "Pipe Weight(Kg)",
      field: "WEIGHT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value)?.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Pipe Length(mm)",
      field: "PIPE_LEN",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return parseFloat(value)?.toFixed(2);
        }
        return value;
      },
      width: 120,
    },
    // {
    //   title: "Result",
    //   field: "RESULT",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   editor: "list",
    //   editorParams: {
    //     values: { OK: "OK", "NOT OK": "NOT OK" },
    //   },
    //   formatter: function (cell) {
    //     const value = cell?.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    // },

    {
      title: "New Length(mm)",
      field: "LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: valueRadio === "P" ? "input" : "",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 0 },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (valueRadio == "P") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        if (value) {
          return parseFloat(value)?.toFixed(2);
        }
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

        let odia = cell?.getData()?.EWI_SEC2;
        let length = value;
        let thick = cell?.getData()?.WALL_THICK_END;
        let depth = cell?.getData()?.DEPTH_MM;
        let width = cell?.getData()?.WIDTH_MM;
        let geo = cell?.getData()?.GEO;

        let pipeWtVal = await calculatePipeWt(
          length,
          odia,
          thick,
          width,
          depth,
          geo
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
      editor: valueRadio === "P" ? "number" : "",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (valueRadio == "P") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        if (value) {
          return parseFloat(value)?.toFixed(3);
        }
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
  editorParams: {
    allowEmpty: false,
    showListOnEmpty: true,
    values: decisionList,
  },
  formatter: function (cell, formatterParams) {
    var value = cell.getValue();
    cell.getElement().style["background-color"] = "#DA8EE7";
    cell.getElement().style["color"] = "#FFFFFF";
    return value;
  },
  cellEdited: async function (cell) {
    let row = cell?.getRow();
    let decisionVal = cell?.getValue();

    // Only recalculate weight for Parting mode
    if (valueRadio === "P") {
      let odia = cell?.getData()?.EWI_SEC2;
      let length = cell?.getData()?.LENGTH;
      let thick = cell?.getData()?.WALL_THICK_END;
      let depth = cell?.getData()?.DEPTH_MM;
      let width = cell?.getData()?.WIDTH_MM;
      let geo = iniGeometry;

      let pipeWtVal = await calculatePipeWt(
        length,
        odia,
        thick,
        width,
        depth,
        geo
      );

      // Reset the material number and update weight
      row.update({ txtMatNo: "", GEO: iniGeometry, PIPE_WEIGHT: pipeWtVal });
    } else {
      // For Non-Parting, only reset material number, don't update weight
      row.update({ txtMatNo: "", GEO: iniGeometry });
    }

    // Fetch material numbers if decision is not PASS
    if (decisionVal !== "PASS") {
      await getMaterialNo(decisionVal);
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
      cellEdited: async function (cell) {
  var value = cell.getValue();
  var decVal = cell?.getData()?.txtDecision;

  // Geometry & pipe wt should be updated only in case of DOWNGRADE and Parting mode
  if (decVal === "DOWNGRADE" && valueRadio === "P") {
    let geoVal = await getGeometry(value);

    let odia = cell?.getData()?.EWI_SEC2;
    let length = cell?.getData()?.LENGTH;
    let thick = cell?.getData()?.WALL_THICK_END;
    let depth = cell?.getData()?.DEPTH_MM;
    let width = cell?.getData()?.WIDTH_MM;
    let geo = geoVal;

    let pipeWtVal = await calculatePipeWt(
      length,
      odia,
      thick,
      width,
      depth,
      geo
    );
    var row = cell.getRow();
    row.update({
      GEO: geoVal,
      PIPE_WEIGHT: pipeWtVal,
    });
    return value;
  } else if (decVal === "DOWNGRADE" && valueRadio === "NP") {
    // For Non-Parting DOWNGRADE, only update geometry, not weight
    let geoVal = await getGeometry(value);
    var row = cell.getRow();
    row.update({
      GEO: geoVal,
    });
    return value;
  }
  return value;
}
    },

    {
  title: "Thick",
  field: "EWI_SEC1",
  headerFilterPlaceholder: "search...",
  headerFilter: "input",
  editor: valueRadio === "P" ? "input" : false, // Make uneditable for Non-Parting
  width: 100,
  formatter: function (cell, formatterParams) {
    var value = cell?.getValue();
    // Only highlight if Parting is selected
    if (valueRadio === "P") {
      cell.getElement().style["background-color"] = "#DA8EE7";
      cell.getElement().style["color"] = "#FFFFFF";
    } else {
      cell.getElement().style["background-color"] = "";
      cell.getElement().style["color"] = "";
    }
    if (value) {
          return parseFloat(value)?.toFixed(2);
        }
    return value;
  },
},
    {
      title: "Surf Cond",
      field: "SUR_FIN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "select",
      editorParams: {
        values: surfCondLs,
      },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";

        return value;
      },
    },
    {
      title: "End Fin",
      field: "END_FIN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      editor: "select",
      editorParams: {
        values: endFinLs,
      },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Wall Thick End",
      field: "WALL_THICK_END",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return parseFloat(value)?.toFixed(3);
        }
        return value;
      },
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
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value !== null && value !== undefined && value !== "") {
          return parseFloat(value)?.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Odia",
      field: "EWI_SEC2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      width: 100,
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value !== null && value !== undefined && value !== "") {
          return parseFloat(value)?.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Batch Mat No.",
      field: "LOM_NO_MATNR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
  ];

  //update material tab functions

  const tableCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      title: "Batch Id",
      field: "BATCHID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Thk",
      field: "THK",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(2);
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Len(mm)",
      field: "LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      title: "Sur Cond",
      field: "SUR_FIN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "End Fin",
      field: "END_FIN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Material No.",
      field: "MAT_NO",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 180,
      editorParams: {
        elementAttributes: {
          maxlength: "18", // Set maximum length
          oninput: "this.value = this.value.replace(/[^0-9]/g, '')", // Allow only numeric input
        },
      },
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: async function (cell) {
        var value = cell.getValue();

        // Ensure input is numeric
        if (value && !/^\d+$/.test(value)) {
          alertify.error("Only numeric values are allowed.");
          cell.setValue(null);
          return;
        }

        if (value && (value.length < 18 || value.length > 18)) {
          alertify.error("Enter Valid Material No.");
          cell.setValue(null);
          var row = cell.getRow();
          row.update({
            VALIDATE: "",
          });
          return;
        }
        if (value != "" && value != undefined && value != null) {
          let batchId = cell?.getData()?.BATCHID;
          let thick = cell?.getData()?.THK;
          let length = cell?.getData()?.LENGTH;
          let matnr = value;

          let validatnRes = await validateData(batchId, thick, length, matnr);
          console.log("validatnRes: ", validatnRes);
          var row = cell.getRow();
          row.update({
            VALIDATE: validatnRes,
          });

          //Spl Comment - pink , vald - NS
          let vald = validatnRes?.substr(0, 2);
          row.getCell("SPL_COMMENT").getElement().style["background-color"] =
            vald === "NS" && spclComntAccess === 1 ? "#DA8EE7" : "white";
          row.getCell("SPL_COMMENT").getElement().style["color"] =
            (vald === "NS" && spclComntAccess === 1) === "NS"
              ? "#FFFFFF"
              : "black";

          //Comment - pink , vald - NS or NN
          row.getCell("COMMENT").getElement().style["background-color"] =
            vald === "NS" || vald === "NN" ? "#DA8EE7" : "white";
          row.getCell("COMMENT").getElement().style["color"] =
            vald === "NS" || vald === "NN" ? "#FFFFFF" : "black";
        }
        return value;
      },
    },

    {
      title: "Comment",
      field: "COMMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 200,

      formatter: function (cell) {
        const value = cell.getValue();
        return value;
      },
    },
    {
      title: "Spl. Comment",
      field: "SPL_COMMENT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      width: 350,
      editable: function (cell) {
        const rowData = cell.getRow().getData();
        let validateRes = rowData.VALIDATE?.substr(0, 2);
        if (validateRes === "NS" && spclComntAccess === 1) return true;
        return false;
      },
      formatter: function (cell) {
        const value = cell.getValue();
        return value;
      },
    },
    {
      title: "Net Wt",
      field: "NET_WT",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(3);
        }
        return value;
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "ODIA",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return parseFloat(value).toFixed(2);
        }
        return value;
      },
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
      hozAlign: "right",
    },
    {
      title: "Batch Crt Dt",
      field: "BATCH_CRT_DT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Validate",
      field: "VALIDATE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      width: 200,
    },
  ];

  //page load
  useEffect(() => {
    fetchDetails();
    if (tabValue === 1) {
      getUserAccess();
      getDropdownLs();
      // handleSubmitBtn();
      getDataMatab();
    }
  }, [tabValue]);

  const handleSubmitBtn = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      Promise.all([getDataMatab(token.accessToken)]).finally(() => {
        setLoading(false);
      });
    });
  };

  const getDataMatab = async () => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    GetAuthorization().then(async (token) => {
      setLoading(true);

      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      // var data = {
      //   plant: selectedPlant?.value,
      // };

      var url = "api/LD0RS002/getMatTabData";

      await axiosAPI
        .post(url, "", defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error("No Data Found");
          } else {
            if (response.data.length == 0) {
              alertify.error("No Data Found");
              setTableData([,]);
              setLoading(false);
            } else {
              setTableData(response.data);
              setLoading(false);
            }
          }
        })
        .finally((f) => {
          // resolve();
          setLoading(false);
        });
    });
  };

  useEffect(() => {
    if (tableData && tableData.length > 0 && tabValue === 1) {
      setTable(
        new Tabulator("#table", {
          data: tableData,
          columns: tableCol,
          height: 400,
          layout: "fitDataFill",
          // selectable: 1,
          pagination: true,
          paginationSize: 20,
          paginationSizeSelector: [10, 20, 30, 40],
          paginationCounter: "rows",
        })
      );
    }
  }, [tabValue, tableData, matTabAccFlag]);

  let validateData = async (batchId, thick, length, matnr) => {
    setLoading(true);

    return new Promise((resolve, reject) => {
      GetAuthorization()
        .then((token) => {
          var defaultOptions = {
            headers: {
              Authorization: "Bearer " + token.accessToken,
            },
          };

          let data = {
            batchId: batchId ?? "",
            thick: thick ?? "",
            length: length ?? "",
            matnr: matnr ?? "",
          };

          var url = "api/LD0RS002/validateData";
          axiosAPI
            .post(url, data, defaultOptions)
            .then((res) => {
              if (res.statusText != "" && res.statusText != "OK") {
                alertify.error("Error!");
                setLoading(false);
                resolve(undefined);
              } else {
                console.log("res?.data: : ", res?.data);
                let result = res?.data?.[0]?.RESULT;
                console.log("result: ", result);
                setLoading(false);
                resolve(result);
              }
            })
            .catch((f) => {
              setLoading(false);
              reject(f); // Reject the promise if there's an error
            });
        })
        .catch((error) => {
          setLoading(false);
          reject(error);
        });
    });
  };

  const saveData = () => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    var selectedRows = table.getSelectedRows();

    if (selectedRows?.length === 0) {
      alertify.error("Please select a row");
      return;
    }

    console.log("selectedRows: ", selectedRows);

    //Attributes Check
    let iniMatNo = selectedRows[0]?._row.data.MAT_NO;
    let iniThk = selectedRows[0]?._row.data.THK;
    let iniLen = selectedRows[0]?._row.data.LENGTH;
    let iniSurFin = selectedRows[0]?._row.data.SUR_FIN;
    let iniEndFin = selectedRows[0]?._row.data.END_FIN;

    if (iniMatNo === "" || iniMatNo === null || iniMatNo === undefined) {
      alertify.error("Material No is required");
      return;
    }

    for (let i = 0; i < selectedRows.length; i++) {
      let matNo = selectedRows[i]?._row.data.MAT_NO;
      let thk = selectedRows[i]?._row.data.THK;
      let len = selectedRows[i]?._row.data.LENGTH;
      let surFin = selectedRows[i]?._row.data.SUR_FIN;
      let endFin = selectedRows[i]?._row.data.END_FIN;
      if (
        matNo != iniMatNo ||
        thk != iniThk ||
        len != iniLen ||
        surFin != iniSurFin ||
        endFin != iniEndFin
      ) {
        alertify.error(
          "Selected Rows must have same Attributes (Material No, Thick, Length, Surf Cond, End Fin)"
        );
        return;
      }
    }

    for (let i = 0; i < selectedRows.length; i++) {
      let valRes = selectedRows[i]?._row.data.VALIDATE?.substr(0, 2);
      let comment = selectedRows[i]?._row.data.COMMENT;
      let splCom = selectedRows[i]?._row.data.SPL_COMMENT;

      if (
        (valRes === "NN" || valRes === "NS") &&
        (comment === "" || comment === null || comment === undefined)
      ) {
        alertify.error("Comment is Required!");
        return;
      } else if (
        valRes === "NS" &&
        (splCom === "" || splCom === null || splCom === undefined)
      ) {
        alertify.error("Special Comment is Required!");
        return;
      }
    }

    var selectedData = [];
    selectedRows.forEach(function (item) {
      selectedData.push({
        batchId: item._row.data.BATCHID ?? "",
        surFin: item._row.data.SURF_COND ?? "",
        endFin: item._row.data.END_FIN ?? "",
        thick: item._row.data.THK ?? "",
        length: item._row.data.LENGTH ?? "",
        matnr: item._row.data.MAT_NO ?? "",
        comment: item._row.data.COMMENT ?? "",
        splComment: item._row.data.SPL_COMMENT ?? "",
      });
    });

    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var data = {
        selectedData: selectedData,
      };

      var url = "api/LD0RS002/saveData";
      axiosAPI
        .post(url, data, defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!");
            setLoading(false);
          } else {
            console.log("res?.data: : ", res?.data);
            if (res?.data?.substr(0, 1) === "Y") {
              alertify.success(res?.data);
              handleSubmitBtn();
              setShowSaveMsgSuccess(true);
              setShowSaveMsgError(false);
              setSaveMsg(res?.data);
              setLoading(false);
              return;
            } else {
              alertify.error(res?.data);
              setShowSaveMsgSuccess(false);
              setShowSaveMsgError(true);
              setSaveMsg(res?.data);
              setLoading(false);
              return;
            }
          }
        })
        .catch((f) => {
          setLoading(false);
        });
    });
  };

  //Users who can access mat tab & update spl comment
  const getUserAccess = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD0RS002/getUserAccess";
      axiosAPI
        .post(url, "", defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!");
            setLoading(false);
            return;
          } else {
            console.log("User Access: ", res?.data);

            //Users who has access to tab
            const userTabAcc =
              res?.data?.matTabAccess?.map((item) => ({
                label: item.USERS,
                value: item.USERS,
              })) || [];

            const userSplComntAcc =
              res?.data?.splComntAccess?.map((item) => ({
                label: item.USERS,
                value: item.USERS,
              })) || [];

            let sessionUser = serverDetails?.PersonalNo;
            console.log("sessionUser: ", sessionUser);
            //Users who can view material tab
            for (let i = 0; i < userTabAcc?.length; i++) {
              if (sessionUser === userTabAcc[i]?.value) {
                console.log("Its Inside access");
                setMatTabAccFlag(1);
                break;
              }
            }

            //Users who can edit spcl comment
            for (let i = 0; i < userSplComntAcc?.length; i++) {
              if (sessionUser === userSplComntAcc[i]?.value) {
                console.log("Its Inside SPCL access");
                setSpclComntAccess(1);
                break;
              }
            }

            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
          // resolve();
        });
    });
  };

  const getDropdownLs = () => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      var url = "api/LD0RS002/getDropdown";
      axiosAPI
        .post(url, "", defaultOptions)
        .then((res) => {
          if (res.statusText != "" && res.statusText != "OK") {
            alertify.error("Error!");
            setLoading(false);
            return;
          } else {
            const selectOption = { label: "--SELECT--", value: null };
            const rowEndFin =
              res?.data?.endFin?.map((item) => ({
                label: item.END_FIN,
                value: item.END_FIN,
              })) || [];
            setEndFinLs([selectOption, ...rowEndFin]);

            const rowSurfCond =
              res?.data?.surfCond?.map((item) => ({
                label: item.SURF_COND,
                value: item.SURF_COND,
              })) || [];

            // rowSurfCond = [selectOption, ...rowSurfCond];
            setSurfCondLs([selectOption, ...rowSurfCond]);

            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
          // resolve();
        });
    });
  };

  // useEffect(() => {
  //   console.log("tabValue:", tabValue);
  //   console.log("matTabAccFlag:", matTabAccFlag);
  //   console.log("spclComntAccess:", spclComntAccess);
  // }, [tabValue, matTabAccFlag, spclComntAccess]);

  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="R2 - Rework Bare FG" />
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
                <AppBar position="static">
                  <Tabs
                    orientation={"horizontal"}
                    value={tabValue}
                    onChange={handleSetTabValue}
                  >
                    <Tab label="FG Rework" value={0} />
                    <Tab label="Update FG Material" value={1} />
                  </Tabs>
                </AppBar>
              </Grid>
              <Grid item xs={12}>
                {tabValue === 0 && (
                  <>
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

                            <Grid item xs={1.5}>
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
                            <Grid item xs={3}>
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
                              {/* <Tooltip title="Download">
                                <IconButton
                                  color="white"
                                  onClick={() =>
                                    downloadExcelcustomerTableData()
                                  }
                                >
                                  <DownloadForOfflineIcon />
                                </IconButton>
                              </Tooltip> */}
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
                  </>
                )}

                {tabValue == 1 && matTabAccFlag == 0 && (
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <h4 style={{ color: "red", margin: "5rem" }}>
                      You are not authorized to view this Tab !
                    </h4>
                  </Grid>
                )}

                {tabValue == 1 && matTabAccFlag == 1 && (
                  <>
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
                              Data
                            </MDTypography>
                          </Grid>
                          <Grid item xs={2}></Grid>
                          <Grid item xs={2}>
                            <Tooltip title="Save">
                              <IconButton
                                color="white"
                                disabled={isReadWriteAccess}
                                onClick={() => saveData(true)}
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
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <div id="table" />
                          </Grid>
                        </Grid>
                      </MDBox>
                    </Card>

                    <Grid margin={"1rem"}></Grid>
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
                  </>
                )}
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
