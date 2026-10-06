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

export default function LD0RS001() {
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
  const [matList, setMatList] = useState([]);
  const [material, setMaterial] = useState(null);
  const [decision, setDecision] = useState(null);
  const [decisionMatList, setDecisionMatList] = useState([]);
  const [decisionMat, setDecisionMat] = useState(null);
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
  const [matNoListDown, setMatNoListDown] = useState([]);
  const [matNoListScrap, setMatNoListScrap] = useState([]);
  const [iniGeometry, setIniGeometry] = useState([]); //to strore initial geometry value//

  // New state for mill selection
  const [mill, setMill] = useState({ value: "", label: "" });
  const millList = [
    { value: "1", label: "MILL 1" },
    { value: "2", label: "MILL 2" },
  ];

  const handleRadioChange = (event) => {
    setValueRadio(event.target.value);
    setPipeCreationTableData([]);
    if (event.target.value === "NP" ) setPartCount(1);
    // Assuming selectedEndFacingTable needs to be reset, though it's not defined in the provided snippet
    // selectedEndFacingTable([]); // Uncomment if selectedEndFacingTable is a state variable or defined elsewhere
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
          getRmList(data.accessToken, "RC", mill.value), // Pass mill.value here
          getPipeNoList(null, data.accessToken, "RC", mill.value), // Pass mill.value here
          getMatList(data.accessToken)
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
    var fileName = "LD0RS001" + ".xlsx";

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
    setLoading(true);
    if (newToken) {
      const rsp = await getAuthorization();
    }

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
      var pageName = "LD0RS001";
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
    setLoading(true);
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
    var url = "api/LD0RS001/getRmList";
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
          // When RMList is fetched, also update PipeNoList based on current mill.
          // Note: getPipeNoList is called in fetchDetails, but this might re-trigger it.
          // Consider if these should be truly sequential or parallel depending on API dependencies.
          // For now, keeping the fetchDetails parallel call is fine.
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  // Modified to accept `millSelection`
  const getPipeNoList = async (value, accessToken, status, millSelection) => {
    setLoading(true);
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "RC",
      mill: millSelection, // Use the passed millSelection value
      rmBatch: value?.value || "",
    };
    var url = "api/LD0RS001/getPipeNoList";
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

  const getMatList = async (accessToken) => {
    setLoading(true);
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: "RC",
      //mill: millSelection
    };
    var url = "api/LD0RS001/getMatList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response?.statusText != "" && response?.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response?.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_NO_MATNR;
            obj.value = row.LOM_NO_MATNR;
            items.push(obj);
          });

          setMatList(items);
          // if (items.length > 0) {
          //   setMaterial(items[0]);
          // } else {
          //   setMaterial(null);
          // }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getMaterialNo = async (decision,pipe) => {
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      if(!pipeno?.value && !material?.value && !rmBatchId?.value){
        alertify.error("Material must be selected before selecting decision.")
        return;
      }
      setLoading(true);
      let data = {
        type: decision,
        pipeid: !pipe || pipe === ""?pipeno?.value || "":pipe,
        material:material?.value||""
      };
      var url = "api/LD0RS001/getMaterialNo";
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
              obj.description =row.MAT_DESC;
              items.push(obj);
            });
            console.log("items: ", items);
            setDecisionMatList(items);
            if (decision == "DOWNGRADE") setMatNoListDown(items);
            else setMatNoListScrap(items);

            // console.log("matNoList: ", matNoList);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  const handleRMBatchChange = (value) => {
    //handleClearMain();
    setPipeNo(null);
    setPipeCreationTableData([]);
    setrmBatchId(value);
    let status = "RC";

    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getPipeNoList(value, data.accessToken, status, mill.value), // Pass current mill.value
          //getPoNo(value, data.accessToken, ""),
          // getMatNo(value, data.accessToken),
        ]).finally(() => {
          setLoading(false);
        });
      });
    } else { // If RMBatch is cleared, also clear PipeNoList
        setPipeNoList([]);
        setPipeNo(null);
    }
  };

  const handleDecisionChange = async (value) => {
    //handleClearMain();
    if(value.value != "PASS")
    {
    await getMaterialNo(value.value,"");
    }
    setDecision(value);
  };

  const handleDecisionMatChange = async (value) => {
    //handleClearMain();
    //await getMaterialNo(value.value);
    setDecisionMat(value);
  };

  const handleMaterialChange = (value) => {
    //handleClearMain();
    if (valueRadio === "P") {
        setMaterial(null);
        alertify.error("Material is not to be selected with parting");
        return;
      
    }
    setPipeNo(null);
    setrmBatchId(null);
    setPipeCreationTableData([]);
    setMaterial(value);
    // if (value) {
    //   setLoading(true);
    //   GetAuthorization().then((data) => {
    //     Promise.all([
    //       getPipeNoList(value, data.accessToken, status, mill.value), // Pass current mill.value
    //       //getPoNo(value, data.accessToken, ""),
    //       // getMatNo(value, data.accessToken),
    //     ]).finally(() => {
    //       setLoading(false);
    //     });
    //   });
    // } else { // If RMBatch is cleared, also clear PipeNoList
    //     setPipeNoList([]);
    //     setPipeNo(null);
    // }
  };

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setPipeCreationTableData([]);
  };

  // New function to handle mill change
  const handleMillChange = (value) => {
    setMill(value);
    setrmBatchId(null); // Clear Parent Batch when mill changes
    setPipeNo(null); // Clear Pipe No when mill changes
    setPipeNoList([]); // Clear Pipe No List
    setPipeCreationTableData([]);

    // Call getPipeNoList if a parent batch was selected before,
    // or just refresh the pipe list for the new mill.
    if (rmBatchId) {
        GetAuthorization().then((data) => {
            getPipeNoList(rmBatchId, data.accessToken, "RC", value.value);
        });
    } else {
        GetAuthorization().then((data) => {
            getPipeNoList(null, data.accessToken, "RC", value.value);
        });
    }
  };

  const handleClearAll = (newToken = false) => {
    setrmBatchId(null);
    setPipeNo(null);
    setInspector("");
    setRemark("");
    setRESULT([]);
    setPartCount(0); // Reset partCount to 0 or default
    setPipeCreationTableData([]);
    setMill({ value: "1", label: "MILL 1" }); // Reset mill to default
    setPipeNoList([]); // Clear pipe no list
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

      const url = "api/LD0RS001/getPipeWeight";
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

      const url = "api/LD0RS001/getGeometry";
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

  const fillData = async () => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      if (material?.value && valueRadio !== 'NP') {
        alertify.error("Material can only be selected when Process Type is Non-Parting.");
        setLoading(false);
        return;
      }

      if (material?.value && (rmBatchId?.value || pipeno?.value)) {
        alertify.error("If Material is selected, RM Batch and Pipe ID must be blank.");
        setLoading(false);
        return;
      }
  
      if (valueRadio === "P" && (!pipeno || pipeno?.value === "")) {
        alertify.error("Pipe Id cannot be blank for Parting");
        setLoading(false);
        return;
      }
      if (!pipeno && !rmBatchId && !material) {
        alertify.error("Either select RM batch or pipe or Material.");
        setLoading(false);
        return;
      }
  
      const dummyData = [];
      const payloadForGetPipeInfo = {
        PIPE_ID: pipeno?.value || "",
        material: material?.value || "",
        RM_BATCH: rmBatchId?.value,
      };
  
      const url1 = "api/LD0RS001/getPipeInfo";
  
      const info = await axiosAPI.post(
        url1,
        payloadForGetPipeInfo,
        defaultOptions
      );
  
      if (info?.status !== 200 || !info?.data || info?.data.length === 0) {
        alertify.error("Failed to retrieve PIPE Info or no data found.");
        setLoading(false);
        return;
      }
  
      // Since getPipeInfo returns the same columns, we can define a base structure
      // for the data object and then modify it based on valueRadio.
      let loopCounter;
  
      if (valueRadio === "P") {
        if (partCount > 1 && partCount < 27) {
          loopCounter = partCount;
        } else {
          alertify.error("partCount must be greater than 1 and less than 27");
          setLoading(false);
          return;
        }
  
        const pipeInfo = info.data[0]; // For 'P', we likely only care about the first pipe info
        setIniGeometry(pipeInfo?.GEO); // To keep track of geometry
  
        for (let i = 0; i < loopCounter; i++) {
          let new_pipeid;
          const lastCharIndex = pipeno.value.length;
          const newChar = String.fromCharCode(65 + i); // 65 is the ASCII code for 'A'
          new_pipeid = pipeno.value.slice(0, lastCharIndex) + newChar;
  
          const data = {
            PIPEID: new_pipeid, // Derived for 'P'
            CURR_PROC: "R",
            REMARK: remark,
            PARTNO: partCount,
            RM_BATCH: pipeno?.value,
            WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL,
            NEXT_PROC: "T",
            EWI_ID_ORDER_CUS: pipeInfo?.LOM_ID_ORDER_CUS,
            EWI_ID_ORD_ITEM_CUS: pipeInfo?.LOM_ID_ORD_ITEM_CUS,
            LOM_NO_MATNR: pipeInfo?.LOM_NO_MATNR,
            EWI_SEC1: pipeInfo?.LOM_SEC1,
            EWI_SEC2: pipeInfo?.LOM_SEC2,
            LENGTH: "", // Specific for 'P'
            EWI_LENGTH: pipeInfo?.LENGTH,
            INSPECTOR: inspector,
            txtDecision: "PASS",
            txtMatNo: "",
            PIPE_WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL?.toFixed(3),
            DEPTH_MM: pipeInfo?.DEPTH_MM,
            WIDTH_MM: pipeInfo?.WIDTH_MM,
            WALL_THICK_END: pipeInfo?.WALL_THICK_END,
            GEO: pipeInfo?.GEO,
            REMARKS: pipeInfo?.REMARKS,
          };
          dummyData.push(data);
        }
      } else {
        // Logic when valueRadio is NOT "P"
        loopCounter = info?.data?.length;
  
        for (let i = 0; i < loopCounter; i++) {
          const pipeInfo = info.data[i];
          const data = {
            PIPEID: pipeInfo?.LOM_ID_BATCH, // Using LOM_ID_BATCH as PIPEID for non-P
            CURR_PROC: "R",
            // REMARK: remark, // Only if applicable for this path
            PARTNO: i, // Not applicable for this path
            RM_BATCH: pipeInfo?.LOM_ID_PAR_COIL_NO, // Or LOM_ID_BATCH depending on exact source
            WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL,
            NEXT_PROC: "T",
            EWI_ID_ORDER_CUS: pipeInfo?.LOM_ID_ORDER_CUS,
            EWI_ID_ORD_ITEM_CUS: pipeInfo?.LOM_ID_ORD_ITEM_CUS,
            LOM_NO_MATNR: pipeInfo?.LOM_NO_MATNR,
            // MATNR_DESC: pipeInfo?.MATNR_DESC, // Still commented out as not in the SQL provided
            // LOM_TDC_ACTL: pipeInfo?.LOM_TDC_ACTL, // Still commented out as not in the SQL provided
            EWI_SEC1: pipeInfo?.LOM_SEC1,
            EWI_SEC2: pipeInfo?.LOM_SEC2,
            LENGTH: pipeInfo?.LENGTH, 
            EWI_LENGTH: pipeInfo?.LENGTH,
            INSPECTOR: inspector, 
            txtDecision: decision?.value,
            txtMatNo: decisionMat?.value,
            PIPE_WEIGHT: pipeInfo?.LOM_MS_PIECE_ACTL?.toFixed(3),
            DEPTH_MM: pipeInfo?.DEPTH_MM,
            WIDTH_MM: pipeInfo?.WIDTH_MM,
            WALL_THICK_END: pipeInfo?.WALL_THICK_END,
            GEO: pipeInfo?.GEO,
            REMARKS: pipeInfo?.REMARKS,
          };
          dummyData.push(data);
        }
      }
  
      console.log("Final dummyData:", dummyData);
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

  const confirm = async (newToken = false) => {
    if (pipeCreationTableData.length !== 0) {
      var url;
      var tableData;

      if (valueRadio === "P") {
        tableData = pipeCreationTable.getData(); // As it is
      } else {
        var selectedRows = pipeCreationTable.getSelectedRows();
        
        if (selectedRows.length === 0) {
          alertify.error("No rows selected.");
          return; 
        }
        tableData=[];
        // var selectedFirstTableData = [];
        selectedRows.forEach(function (item) {
        tableData.push(item._row.data);
        });
      }
      if (inspector.length == 0) {
        alertify.error("Please enter Inspector Name");
        return;
      }
      var newReworkData = [];
      let hasError = false;

      tableData.forEach(function (item) {
        console.log(item)
        // Check for invalid LENGTH or PIPE_WEIGHT
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
          // Check for txtMatNo if txtDecision is not "PASS"
          if (
            item.txtDecision !== "PASS" &&
            (item.txtMatNo === null || item.txtMatNo === "")
          ) {
            alertify.error(
              "txtMatNo cannot be blank or null when txtDecision is not 'PASS'"
            );
            hasError = true;
            return; // Exit the current iteration
          }

          // Push valid items to newReworkData
          newReworkData.push(item);
        } else {
          console.log("Hello1");
          alertify.error("Length or Weight cannot be blank");
          hasError = true;
          return; // Exit the current iteration
        }
      });

      if (hasError) {
        return; // Exit the function if there was an error.
      }

      if(valueRadio ==="P"){

      console.log("Hello2");
      const totalPartPipes =
        pipeCreationTable.getCalcResults()?.bottom?.PIPE_WEIGHT;
      let motherTotal = parseFloat(newReworkData?.[0]?.WEIGHT);
      const tolerance = 0.00001; //Slightly smaller than the rounding precision

      if (
        newReworkData.length > 0 &&
        Math.abs(totalPartPipes - motherTotal) > tolerance
      ) {
        alertify.error(
          "Total Mother weight not equal to parted pipes weight.Short by " +
            Math.abs(totalPartPipes - motherTotal)
        );
        return;
      }

      const totalPartPipesLength =
        pipeCreationTable.getCalcResults()?.bottom?.LENGTH;
      let motherTotalLength = parseFloat(newReworkData?.[0]?.EWI_LENGTH);
      const toleranceLength = 0.00001; //Slightly smaller than the rounding precision
    

      if (
        newReworkData.length > 0 &&
        Math.abs(totalPartPipesLength - motherTotalLength) > toleranceLength
      ) {
        alertify.error(
          "Total Mother Length not equal to parted pipes Length.Short by " +
            Math.abs(totalPartPipesLength - motherTotalLength)
        );
        return;
      }
    }
      var data = {
        newReworkData: newReworkData,
        parting: valueRadio,
      };
      console.log("data: ", data);
      setLoading(true);
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      url = "api/LD0RS001/insertpipedetails";
      // url = "";

      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText != "" && response.statusText != "OK") {
            alertify.error(response?.error?.response.data?.name);
          } else {
            if (response?.data?.errorString?.[0] === "Y") {
              alertify.success("Rework Recorded  successfully");
              handleClearAll(true);
            } else {
              alertify.error(response?.data?.errorString);
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
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      visible: valueRadio !== "P",
      headerSort: false,
      frozen: true,
    },
    {
      title: "New Pipe Id",
      field: "PIPEID",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "No parts",
      field: "PARTNO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
    },
    {
      title: "Pipe Id",
      field: "RM_BATCH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      title: "Remarks",
      field: "REMARKS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Len(mm)",
      field: "EWI_LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
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
      hozAlign: "right",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 0 },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (valueRadio == "P") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
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
        // var row = cell.getRow();
        // var rl = cell._cell.row.data.txtSchPlantwt;
        // console.log("rl: ", rl);
        // if (isNaN(rl)) {
        //   alertify.error("Please enter a valid number");
        //   row.update({
        //     txtSchPlantwt: 0,
        //   });
        // } else {
        //   row.update({
        //     txtSchPlantwt: rl,
        //   });
        // }
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
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (valueRadio == "P") {
          cell.getElement().style["background-color"] = "#DA8EE7";
          cell.getElement().style["color"] = "#FFFFFF";
        }
        return value;
      },
      // cellEdited: (cell) => {
      //   var row = cell.getRow();
      //   var rl = cell._cell.row.data.txtSchPlantwt;
      //   console.log("rl: ", rl);
      //   if (isNaN(rl)) {
      //     alertify.error("Please enter a valid number");
      //     row.update({
      //       txtSchPlantwt: 0,
      //     });
      //   } else {
      //     row.update({
      //       txtSchPlantwt: rl,
      //     });
      //   }
      // },
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
          values: decisionList, // Static decision list
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
          let pipe =cell?.getData()?.PIPEID;
          let partParent =cell?.getData()?.RM_BATCH;
          //Do Wt calculation only in case of parting
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
  
            // Reset the material number AND DESCRIPTION when decision changes
            row.update({
              txtMatNo: "",
             MATERIAL_DESC: "", // <-- Added: Clear Material Description
              GEO: iniGeometry,
              PIPE_WEIGHT: pipeWtVal,
            });
          } else {
              // If not 'P' and decision changes, just clear material no and description
              row.update({
                  txtMatNo: "",
                 MATERIAL_DESC: "", // <-- Added: Clear Material Description
              });
          }
  
  
          // Ensure getMaterialNo is called with the correct decision value
          if (decisionVal === "DOWNGRADE" || decisionVal === "SCRAP") {
            row.update({ MATERIAL_DESC: "" });
            await getMaterialNo(decisionVal,valueRadio ==="P"?partParent:pipe); // Fetch and set states dynamically
          }
  
          // Clear the material list AND description for invalid decisions
          if (decisionVal !== "DOWNGRADE" && decisionVal !== "SCRAP") {
            setMatNoListDown([]);
            setMatNoListScrap([]);
           row.update({ MATERIAL_DESC: "" }); // <-- Added: Clear Material Description
          }
        },
      },
      {
        title: "Select Material No.",
        field: "txtMatNo",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        editor: "list",
        editorParams: function (cell) {
          // Dynamically update the editorParams based on decision and state
          let decision = cell?.getRow()?.getData()?.txtDecision;
  
          // Return the correct material list based on state values
          if (decision === "DOWNGRADE") {
            return {
              allowEmpty: false,
              showListOnEmpty: true,
              values: matNoListDown, // List updated in getMaterialNo
            };
          }
          if (decision === "SCRAP") {
            return {
              allowEmpty: false,
              showListOnEmpty: true,
              values: matNoListScrap, // List updated in getMaterialNo
            };
          }
  
          // Default: Empty values for other decisions
          return { allowEmpty: true, values: [] };
        },
        editor: function (cell, onRendered, success, cancel, editorParams) {
          var decision = cell?.getRow()?.getData()?.txtDecision;
  
          // Disable selection for anything other than "DOWNGRADE" or "SCRAP"
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
  
          // Create a dropdown for "DOWNGRADE" or "SCRAP"
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
          var value = cell.getValue(); // This is the MAT_NO
          var row = cell.getRow();
          var decVal = row.getData().txtDecision;
          var materialDescription = "";
  
          if (value) { // Only try to find description if a value is selected
              if (decVal === "DOWNGRADE") {
                  const selectedMaterial = matNoListDown.find(item => item.value === value);
                  if (selectedMaterial) {
                      materialDescription = selectedMaterial.description;
                  }
              } else if (decVal === "SCRAP") {
                  const selectedMaterial = matNoListScrap.find(item => item.value === value);
                  if (selectedMaterial) {
                      materialDescription = selectedMaterial.description;
                  }
              }
          }
          // If value is empty, materialDescription will remain ""
  
          // Update the Material Description in the row
          row.update({
              MATERIAL_DESC: materialDescription // <-- Added: Set Material Description
          });
  
          //Geometry & pipe wt should be updated only in case of DOWNGRADE and Parting
          if (decVal === "DOWNGRADE" && valueRadio === "P") {
            let geoVal = await getGeometry(value);
  
            // Note: The variable 'value' here is the MAT_NO from cell.getValue()
            // Ensure calculatePipeWt uses the correct parameters
            let odia = cell?.getData()?.EWI_SEC2;
            let length = cell?.getData()?.LENGTH;
            let thick = cell?.getData()?.WALL_THICK_END;
            let depth = cell?.getData()?.DEPTH_MM;
            let width = cell?.getData()?.WIDTH_MM;
            let geo = geoVal; // Using geoVal obtained from getGeometry
  
            let pipeWtVal = await calculatePipeWt(
              length,
              odia,
              thick,
              width,
              depth,
              geo
            );
            row.update({
              GEO: geoVal,
              PIPE_WEIGHT: pipeWtVal,
            });
          }
          // No explicit return value needed here, row.update handles the change
        },
      },
      { // <-- NEW COLUMN DEFINITION
        title: "Material Desc",
        field: "MATERIAL_DESC",
        headerFilter: "input",
        headerFilterPlaceholder: "search...",
        width: "300",
        editor: false, // Make it read-only
        formatter: function(cell){
          return cell.getValue() || ""; // Ensure empty cells show as blank
        }
      },
    {
      title: "Pipe Material No",
      field: "LOM_NO_MATNR",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
    {
      title: "Quality Operation",
      field: "CURR_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      editor: "input",
      // formatter: function (cell, formatterParams) {
      //   var value = cell?.getValue();
      //   cell.getElement().style["background-color"] = "#DA8EE7";
      //   cell.getElement().style["color"] = "#FFFFFF";
      //   return value;
      // },
    },
  ];

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Mill"
        page="R1 - Rework Bare WIP"
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
                          Parent Batch
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
                          variant="h6"
                          value={pipeno}
                        />
                      </Grid>

                      {/* New Mill dropdown added here */}
                      <Grid item xs={1.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Mill *
                        </MDTypography>
                        <ReactSelect
                          id="millList"
                          options={millList}
                          onChange={handleMillChange}
                          variant="h6"
                          value={mill}
                        />
                      </Grid>
                      {/* End of new Mill dropdown */}
                      <Grid item xs={2.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Material No.
                        </MDTypography>

                        <ReactSelect
                          id="material"
                          options={matList}
                          onChange={handleMaterialChange}
                          variant="h6"
                          value={material}
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

                      <Grid item xs={2}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Decision
                        </MDTypography>

                        <ReactSelect
                          id="decision"
                          options={decisionList}
                          onChange={handleDecisionChange}
                          variant="h6"
                          value={decision}
                          isDisabled={valueRadio !== "NP" && !material} 
                        />
                      </Grid>
                      <Grid item xs={2.5}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Decision Material(Down/Scrap)
                        </MDTypography>

                        <ReactSelect
                          id="decision"
                          options={decisionMatList}
                          onChange={handleDecisionMatChange}
                          variant="h6"
                          value={decisionMat}
                          isDisabled={valueRadio !== "NP" && !material} 
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
              </Grid>
            </Grid>
          </MDBox>
        </>
      )}
    </DashboardLayout>
  );
}
