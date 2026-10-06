import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
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
import MDAlert from "@mui/material/Alert";
import jwt from "jsonwebtoken";
import { styled } from "@mui/material/styles";
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import UploadFileIcon from "@mui/icons-material/UploadFile"; // Import for upload button

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

import * as XLSX from "xlsx"; // Import the XLSX library

export default function LDS080() {
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
  const [pipeNo, setPipeNo] = useState(null); // Changed initial to null
  const [prodOrdNo, setProdOrdNo] = useState("");
  const [nxtproc, setNxtproc] = useState("");

  const [RMList, setRMList] = useState([]); // Options for Parent Batch dropdown
  const [rmBatchId, setrmBatchId] = useState(null); // Selected Parent Batch value
  const [allPipeNoList, setAllPipeNoList] = useState([]); // All pipe numbers fetched from API
  const [filteredPipeNoList, setFilteredPipeNoList] = useState([]);
  const [selectedMill, setSelectedMill] = useState(null); // New state for selected mill

  const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
  const [showSaveMsgError, setShowSaveMsgError] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const [pipenoList, setPipeNoList] = useState([]);
  const [prodDate, setProdDate] = useState(null);
  const [shift, setShift] = useState("");
  const [result, setResult] = useState([]);
  const [poNo, setPoNo] = useState("");
  const [material, setMaterial] = useState("");
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [batchWeightData, setBatchWeightData] = useState([]);
  const [getTable, setTable] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [expanded, setExpanded] = useState(true);

  // State to hold the uploaded Excel data (array of objects, where each object is a row)
  const [uploadedExcelData, setUploadedExcelData] = useState([]);
  // Ref for the hidden file input to allow programmatic clearing
  const excelFileInputRef = useRef(null);

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
    {
      label: "Final Remarks1",
      value: "",
    },
    {
      label: "Final Remarks2",
      value: "",
    },
    {
      label: "Radial offset edg",
      value: "",
    },

    {
      label: "Diameter Body",
      value: "",
    },
    {
      label: "Diameter End",
      value: "",
    },

    {
      label: "Out of Round Body",
      value: "",
    },
    {
      label: "Out of Round end",
      value: "",
    },
    {
      label: "Bevel Angle F end",
      value: "",
    },
    {
      label: "Bevel Angle T end",
      value: "",
    },
    {
      label: "Squarness F End",
      value: "",
    },
    {
      label: "Squarness T End",
      value: "",
    },
    {
      label: "Root Face F end",
      value: "",
    },
    {
      label: "Root Face T end",
      value: "",
    },

    {
      label: "Wall thick Body",
      value: "",
    },
    {
      label: "Wall thick End",
      value: "",
    },

    {
      label: "ID Flash (D/H)",
      value: "",
    },
    {
      label: "Straightness Body",
      value: "",
    },
    {
      label: "Straightness End",
      value: "",
    },

    {
      label: "Width Min",
      value: "",
    },
    {
      label: "Width Max",
      value: "",
    },
    {
      label: "Depth Min",
      value: "",
    },
    {
      label: "Depth Max",
      value: "",
    },

    {
      label: "Squarness of Corner",
      value: "",
    },
    {
      label: "Radius of Corner",
      value: "",
    },
    {
      label: "Twist",
      value: "",
    },
    {
      label: "Concavity",
      value: "",
    },
    {
      label: "Convexity",
      value: "",
    },
    {
      label: "ECN%",
      value: "",
    },
  ];

  const [fieldValue, setFieldValue] = useState(fieldConst);

  var customerTable = React.createRef();

  //page load
  useEffect(() => {
    async function fetchData() {
      if (serverDetails.devMode) {
        setRestricted(false);
      }

      if (!initialLoad) {
        const response = await getAuthorization();
        if (response) {
          validateUser();
          setInitialLoad(true);
        }
      }
    }
    fetchData();
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
          if (response.statusText !== "" && response.statusText !== "OK") {
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
        serverDetails.PersonalNo === null ||
        serverDetails.PersonalNo === undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LD08S001";
      var authDetails = await getScreenAuth(plant, userId, pageName);
      if (authDetails) {
        setRestricted(false);
        if (authDetails.payload.PS_AUTH_DML === "Z") {
          setRestricted(true);
          setAdmin(false);
        } else if (authDetails.payload.PS_AUTH_DML === "Y") {
          setAdmin(true);
          if (authDetails.payload.LS_READ_WRITE_FLAG === "RL_RW") {
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
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      var url = "api/users/screenAuth";

      if (serverDetails.devMode === true) {
        //(userId = "198447"), (pageName = "TSMCPPF001");
      }
      var data = { plantCd: plantCd, user: userId, page: pageName };

      axiosAPI.post(url, data, defaultOptions).then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
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
        Promise.all([
          getRmList(data.accessToken, selectedMill ? selectedMill.value : ""),
          getAllPipeNoList(data.accessToken, selectedMill ? selectedMill.value : ""), // Pass selectedMill here initially
        ]).finally(() => {
          setLoading(false);
        });
      })
      .catch((e) => {
        alertify.error(e);
        setLoading(false);
      });
  };
  //page load
  useEffect(() => {
    fetchDetails();
  }, []);

  const getRmList = async (accessToken, millValue = "") => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    let data = {
      status: '8C',
      mill: millValue,
    };
    var url = "api/LD08S001/getRmList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_PAR_COIL_NO;
            obj.value = row.LOM_ID_PAR_COIL_NO;
            items.push(obj);
          });
          setRMList(items);
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getAllPipeNoList = async (accessToken, millValue = "") => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      status: '8C',
      rmBatch: "",
      mill: millValue, // Include millValue in the API request
    };
    var url = "api/LD08S001/getPipeNoList";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          //reject(response.statusText);
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_BATCH;
            obj.value = row.LOM_ID_BATCH;
            obj.parentCoilNo = row.LOM_ID_PAR_COIL_NO;
            obj.mill = row.LOM_MILL_NO; // Assuming MILL comes from the API response
            items.push(obj);
          });

          setAllPipeNoList(items); // Store all pipes
          setFilteredPipeNoList(items);

        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };


  const getNxtProc = async (accessToken, pipeno) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      CURR_PROC: "8",
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    var url = "api/LD08S001/getnxtproc";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.NXTPROC;
            obj.value = row.NXTPROC;
            items.push(obj);
          });
          if(items.length > 0) {
            setNxtproc(items[0].value);
          } else {
            setNxtproc("");
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getOrdDetails = async (accessToken, pipeno) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };

    let data = {
      PIPE_NO: pipeno.value ? pipeno.value : "",
    };
    var url = "api/LD02S001/getOrderDetails";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
        } else {
          var items = [];
          var orditem = [];
          var custname = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_ORDER_CUS;
            obj.value = row.LOM_ID_ORDER_CUS;
            items.push(obj);
          });
          response.data.map((row) => {
            var obj1 = new Object();
            obj1.label = row.LOM_ID_ORD_ITEM_CUS;
            obj1.value = row.LOM_ID_ORD_ITEM_CUS;
            orditem.push(obj1);
          });
          response.data.map((row) => {
            var obj2 = new Object();
            obj2.label = row.ENC_CUST_NAME;
            obj2.value = row.ENC_CUST_NAME;
            custname.push(obj2);
          });
          setOrdNo(items.length > 0 ? items[0].value : "");
          setOrdItem(orditem.length > 0 ? orditem[0].value : "");
          setCustName(custname.length > 0 ? custname[0].value : "");
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getPoNo = async (rmbatch, accessToken, value) => {
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    };
    let data = {
      RM_BATCH: rmbatch?.value ? rmbatch.value : "", // Use optional chaining for rmbatch
      PIPE_NO: value.value ? value.value : "",
    };

    var url = "api/LD08S001/getPoNo";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
        } else {
          var items = [];
          response.data.map((row) => {
            var obj = new Object();
            obj.label = row.LOM_ID_ORDER_CUS;
            obj.value = row.LOM_ID_ORDER_CUS;
            items.push(obj);
          });
          setPoNo(items.length > 0 ? items[0].value : "");
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
      var url = "api/LD08S001/getTataDate";
      let data = {
        prodEndDt: value,
      };
      axiosAPI
        .post(url, data, defaultOptions)
        .then((response) => {
          if (response.statusText !== "" && response.statusText !== "OK") {
            alertify.error("Error!");
          } else {
            setProdDate(response.data?.[0]?.[1]);
            setShift(response.data?.[0]?.[0]);
            setLoading(false);
          }
        })
        .finally((f) => {
          setLoading(false);
        });
    });
  };

  //Function to calculate pipe wt
  const calculatePipeWt = async (
    pipeId,
    length,
    odia,
    thick,
    width,
    depth,
    geo
  ) => {
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
        p_batch_id: pipeId ?? "",
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

  const validateData = async () => {
    setLoading(true);
    try {
      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const url = "api/LD08S001/validateDataMill80";
      const data = {
        p_batchid: rmBatchId?.value ?? "",
        p_ord: getTable?.[0]?.ORDER_NO ?? "",
        p_item: getTable?.[0]?.ITEM ?? "",
        p_TBP_WEIGHT: getTable?.[0]?.WEIGHT ?? "",
        p_TBP_PAR_COIL_NO: "" ?? "",
        p_TBP_ID_FIRST_PAR: "" ?? "",
        P_RESULT: result.value ?? "",
        p_TBP_HEAT_NO: "" ?? "",
        p_TBP_PIPE_OD_10: "", //getTable?.[0]?.OD ?? "",
        p_TBP_PIPE_THK_10: "", //getTable?.[0]?.THICK ?? "",
        p_TBP_PIPE_LNG_10: getTable?.[0]?.LENGTH ?? "",
        p_TBP_FLATNG_0_O_10: "",
        p_TBP_FLATNG_90_O_10: "",
        p_TBP_RBT_10: "",
        p_TBP_DIA_END_10:
          fieldValue?.filter((x) => x.label === "Diameter Body")[0].value ?? "",
        p_TBP_DIA_BODY_10:
          fieldValue?.filter((x) => x.label === "Diameter End")[0].value ?? "",
        p_TBP_OUT_ROUND_BODY_10:
          fieldValue?.filter((x) => x.label === "Out of Round Body")[0].value ??
          "",
        p_TBP_OUT_ROUND_END_10:
          fieldValue?.filter((x) => x.label === "Out of Round end")[0].value ??
          "",
        p_TBP_WALL_THK_BODY_10:
          fieldValue?.filter((x) => x.label === "Wall thick Body")[0].value ??
          "",
        p_TBP_WALL_THK_END_10:
          fieldValue?.filter((x) => x.label === "Wall thick End")[0].value ??
          "",
        p_TBP_STRGHTNES_T_END_10:
          fieldValue?.filter((x) => x.label === "Straightness End")[0].value ??
          "",
        p_TBP_SQOC_10:
          fieldValue?.filter((x) => x.label === "Squarness of Corner")[0]
            .value ?? "",
        p_TBP_ROC_10:
          fieldValue?.filter((x) => x.label === "Radius of Corner")[0].value ??
          "",
        p_TBP_ID_FLASH_10:
          fieldValue?.filter((x) => x.label === "ID Flash (D/H)")[0].value ??
          "",
        p_TBP_CONVX_10:
          fieldValue?.filter((x) => x.label === "Convexity")[0].value ?? "",
        p_TBP_CONCV_10:
          fieldValue?.filter((x) => x.label === "Concavity")[0].value ?? "",
        p_TBP_TWIST_10:
          fieldValue?.filter((x) => x.label === "Twist")[0].value ?? "",
        p_TBP_DEPTH_10: "",
        p_TBP_WIDTHS_10: "",
        p_TBP_SAMPLE_10: "",
        p_TBP_WLD_TEMP_10: "",
        p_TBP_MILL_SPD_10: "",
        p_TBP_CURRENTT_10: "",
        p_TBP_TEMP_QN_10: "",
        p_TBP_VOLTAGE_10: "",
        p_TBP_FREQUENCY_10: "",
        p_TBP_NORMZ_TEMP_10: "",
        p_TBP_WELD_POWER_10: "",
        p_TBP_VISUAL_INSP_80:
          fieldValue?.filter((x) => x.label === "Visual Inspection")[0].value ??
          "",
        p_TBP_ECN_PERCEN_80:
          fieldValue?.filter((x) => x.label === "ECN%")[0].value ?? "",
        p_TBP_B_ANGL_F_END_80:
          fieldValue?.filter((x) => x.label === "Bevel Angle F end")[0].value ??
          "",
        p_TBP_B_ANGL_T_END_80:
          fieldValue?.filter((x) => x.label === "Bevel Angle T end")[0].value ??
          "",
        p_TBP_ROOTFACE_F_END_80:
          fieldValue?.filter((x) => x.label === "Root Face F end")[0].value ??
          "",
        p_TBP_ROOTFACE_T_END_80:
          fieldValue?.filter((x) => x.label === "Root Face T end")[0].value ??
          "",
        p_TBP_STRGHTNES_F_END_80:
          fieldValue?.filter((x) => x.label === "Straightness End")[0].value ??
          "",
        p_TBP_SQU_F_END_80:
          fieldValue?.filter((x) => x.label === "Squarness F End")[0].value ??
          "",
        p_TBP_SQU_T_END_80:
          fieldValue?.filter((x) => x.label === "Squarness T End")[0].value ??
          "",
        p_TBP_ASL_NO_80: "",
        p_TBP_WID_MIN_80:
          fieldValue?.filter((x) => x.label === "Width Min")[0].value ?? "",
        p_TBP_WID_MAX_80:
          fieldValue?.filter((x) => x.label === "Width Max")[0].value ?? "",
        p_TBP_DEPTH_MIN_80:
          fieldValue?.filter((x) => x.label === "Depth Min")[0].value ?? "",
        p_TBP_DEPTH_MAX_80:
          fieldValue?.filter((x) => x.label === "Depth Max")[0].value ?? "",
        p_TBP_VDI_FINAL_RMK_1_80:
          fieldValue?.filter((x) => x.label === "Final Remarks1")[0].value ??
          "",
        p_TBP_VDI_FINAL_RMK_2_80:
          fieldValue?.filter((x) => x.label === "Final Remarks2")[0].value ??
          "",
        p_TBP_LEN_FT_80: getTable?.[0]?.LENGTH ?? "",
        p_TBP_LEN_INCH_80: getTable?.[0]?.LENGTH ?? "",
        p_TBP_RADIAL_OFF_80:
          fieldValue?.filter((x) => x.label === "Radial offset edg")[0].value ??
          "",
      };

      const resp = await axiosAPI.post(url, data, defaultOptions);

      if (resp?.data?.substr(0, 1) === "Y") {
        alertify.success(resp?.data);
        return;
      } else {
        alertify.error(resp?.data);
        return;
      }
    } catch (error) {
      console.log("error: ", error);
      alertify.error("Error filling data: " + error);
    } finally {
      setLoading(false);
    }
  };

  const handleMillChange = (value) => {
    setSelectedMill(value);
    // Clear other selections that depend on the mill
    setrmBatchId(null);
    setPipeNo(null);
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setPoNo("");
    setTable([]);
    setSelectedTable(null);
    setFieldValue(fieldConst);
    setResult([]);
    setUploadedExcelData([]); // Clear uploaded data on mill change
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ""; // Clear file input
    }
    const prodDateInput = document.getElementById("Pdate");
    if (prodDateInput) prodDateInput.value = null;
    const prodStartDateInput = document.getElementById("prodStartDate");
    if (prodStartDateInput) prodStartDateInput.value = "";
    const prodEndDateInput = document.getElementById("prodEndDate");
    if (prodEndDateInput) prodEndDateInput.value = "";

    setLoading(true);
    GetAuthorization().then((data) => {
      getAllPipeNoList(data.accessToken, value ? value.value : ""),
      getRmList(data.accessToken, value ? value.value : "")
      .finally(() => {
        setLoading(false);
      });
    }).catch((e) => {
      alertify.error(e);
      setLoading(false);
    });
  };


  const handleRMBatchChange = (value) => {
    setPipeNo(null); // Clear selected pipe when parent batch changes
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setNxtproc("");
    setPoNo("");
    setTable([]);
    setSelectedTable(null);
    setUploadedExcelData([]); // Clear uploaded data on RM batch change
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ""; // Clear file input
    }
    //setFieldValue(fieldConst);
   // setResult([]);
   //  Below code is to make Prod start Dt and End dt as null when Rm batch changes
    // const prodDateInput = document.getElementById("Pdate");
    // if (prodDateInput) prodDateInput.value = null;
    // const prodStartDateInput = document.getElementById("prodStartDate");
    // if (prodStartDateInput) prodStartDateInput.value = "";
    // const prodEndDateInput = document.getElementById("prodEndDate");
    // if (prodEndDateInput) prodEndDateInput.value = "";

    setrmBatchId(value); // Set the selected parent batch

    // Filter pipe list based on selected parent batch from the currently available allPipeNoList
    let newFilteredPipes = [];
    if (value) {
      newFilteredPipes = allPipeNoList.filter(pipe => pipe.parentCoilNo === value.value);
    } else {
      newFilteredPipes = allPipeNoList;
    }
    setFilteredPipeNoList(newFilteredPipes);

    if (newFilteredPipes.length > 0 && value !== null) {
      handlePipeNoChange(newFilteredPipes[0]);
    } else {
      setPipeNo(null);
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setNxtproc("");
      setPoNo("");
    }
  };

  const handlePipeNoChange = (value) => {
    setPipeNo(value); // value is now the full object { label, value, parentCoilNo, mill }

    // Update rmBatchId based on the selected Pipe ID's parentCoilNo
    if (value && value.parentCoilNo) {
      setrmBatchId({ label: value.parentCoilNo, value: value.parentCoilNo });
    } else {
      // setrmBatchId(null);
    }
    console.log(value,value.mill)
    // Update selectedMill based on the selected Pipe ID's mill
    // if (value && value.mill) {
    //   setSelectedMill({ label: value.mill, value: value.mill });
    // }
    // else {
    //   setSelectedMill(null);
    // }

    setTable([]);
    setSelectedTable(null);
    setUploadedExcelData([]); // Clear uploaded data on pipeNo change
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ""; // Clear file input
    }
    if (value) {
      setLoading(true);
      GetAuthorization().then((data) => {
        Promise.all([
          getOrdDetails(data.accessToken, value),
          getNxtProc(data.accessToken, value),
          getPoNo(rmBatchId, data.accessToken, value)
        ]).finally(() => {
          setLoading(false);
        });
      }).catch((e) => {
        alertify.error(e);
        setLoading(false);
      });
    } else {
      // If pipeNo is cleared, clear associated data
      setOrdNo("");
      setOrdItem("");
      setCustName("");
      setNxtproc("");
      setPoNo("");
    }
  };

  const setTableNull = () => {
    setTable([]);
  };

  const handleClearMain = (newToken = false) => {
    handleClearAll();
    setPipeNo(null); // Changed to null
    setPoNo("");
    setrmBatchId(null); // Changed to null
    setSelectedMill(null); // Clear selected mill
    setSelectedTable(null);
    setShift("");
    setProdDate("");
    setUploadedExcelData([]); // Clear uploaded Excel data
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ""; // Clear file input
    }

    // Re-fetch all pipes (without mill filter)
    setLoading(true);
    GetAuthorization().then((data) => {
      getAllPipeNoList(data.accessToken, ""),
      getRmList(data.accessToken, "")
      .finally(() => { // Pass empty string for no mill filter
        setLoading(false);
      });
    }).catch((e) => {
      alertify.error(e);
      setLoading(false);
    });

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
    setOrdNo("");
    setOrdItem("");
    setCustName("");
    setResult([]);
    setSelectedTable(null);
    setTable([]); // Use empty array, not [, ]
    setUploadedExcelData([]); // Clear uploaded Excel data
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ""; // Clear file input
    }
  };

  useEffect(() => {
    if (getTable?.length > 0) {
      if (selectedTable) {
        selectedTable.destroy(); // Destroy existing table instance
      }
      setSelectedTable(
        new Tabulator("#TableContainer", {
          pagination: "local",
          paginationSize: 12,
          data: getTable,
          columns: gridCol,
          height: 400,
          layout: "fitDataFill",
        })
      );
    } else if (selectedTable) {
      selectedTable.destroy(); // Destroy table if data is empty
      setSelectedTable(null);
    }

    return () => {
      if (selectedTable) {
        selectedTable.destroy(); // Cleanup on unmount
        setSelectedTable(null);
      }
    };
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
    setLoading(true);
    try {
      var prodStartDateInput = document.getElementById("prodStartDate").value;
      var prodEndDateInput = document.getElementById("prodEndDate").value;
      var currentTime = new Date();
      var prodEndDateCheck = new Date(prodEndDateInput);

      // Initial date/time validations
      if (prodEndDateCheck > currentTime) {
        alertify.error("The selected end date is greater than the current time.");
        setLoading(false);
        return;
      }
      if (new Date(prodStartDateInput) >= new Date(prodEndDateInput)) {
        alertify.error("Start time should be before end time");
        setLoading(false);
        return;
      }
      if (prodStartDateInput === "") {
        alertify.error("Please select Prod Start Dt");
        setLoading(false);
        return;
      }
      if (prodEndDateInput === "") {
        alertify.error("Please select Prod End Dt");
        setLoading(false);
        return;
      }
      var hoursDifference =
        (new Date(prodEndDateInput) - new Date(prodStartDateInput)) /
        (1000 * 60 * 60);
      if (hoursDifference > 5) {
        alertify.error("Date and Time difference should not be more than 5 Hrs");
        setLoading(false);
        return;
      }

      const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

      const currentDate = new Date();
      const formattedDate = formatDateToDDMMYYYY(currentDate);
      const formattedTime = currentDate.toTimeString().split(" ")[0];

      let apiFetchedData = []; // This will hold all data fetched from the API(s)

      if (uploadedExcelData.length > 0) {
        // Scenario: Excel file is uploaded
        const uniquePipeNos = [...new Set(uploadedExcelData.map(row => row["Pipe_No"]).filter(Boolean))];

        if (uniquePipeNos.length === 0) {
          alertify.error("Uploaded Excel file does not contain 'Pipe_No' column or valid pipe numbers.");
          setLoading(false);
          return;
        }

        // Loop through each unique Pipe_No from Excel and call API
        for (const pipeNum of uniquePipeNos) {
          const dataForApi = {
            STATUS: "8C",
            MILL: selectedMill ? selectedMill.value : "", // Use selectedMill from state
            RM_BATCH: "",
            PIPE_NO: pipeNum,
            ORDNO: "",
            ORDITEM: "",
          };
          const response = await axiosAPI.post(
            "api/LD08S001/getFillData",
            dataForApi,
            defaultOptions
          );
          if (response.status === 200 && response.data && response.data.length > 0) {
            apiFetchedData.push(...response.data);
          } else {
            console.warn(`No backend data found for Pipe_No: ${pipeNum} from uploaded Excel.`);
            // Optionally alert the user here or collect a list of failed pipes
          }
        }

        if (apiFetchedData.length === 0) {
          alertify.error("No data found in V_BARE_PDO for any of the Pipe IDs provided in the Excel file.");
          setLoading(false);
          return;
        }

      } else {
        // Scenario: No Excel file uploaded, use form inputs
        const inspector = fieldValue?.filter((x) => x.label === "Inspector Name")[0].value;
        if (!inspector) {
          alertify.error("Please enter Inspector Name.");
          setLoading(false);
          return;
        }
        if (result.length === 0) {
          alertify.error("Please select Result value.");
          setLoading(false);
          return;
        }

        const isOrdNoPresent = (ordNo && ordNo !== "");
        const isOrdItemPresent = (ordItem && ordItem !== "");

        if ((isOrdNoPresent && !isOrdItemPresent) || (!isOrdNoPresent && isOrdItemPresent)) {
            alertify.error("If Order No or Order Item is provided, both must be present.");
            setLoading(false);
            return;
        }

        const hasRmBatch = rmBatchId && rmBatchId.value;
        const hasPipeNo = pipeNo && pipeNo.value;
        const hasOrdNoAndItem = isOrdNoPresent && isOrdItemPresent; // Use the validated presence

        if (!hasRmBatch && !hasPipeNo && !hasOrdNoAndItem) {
          alertify.error("Please provide at least one identifier: Parent Batch, Pipe ID, or both Order No and Order Item.");
          setLoading(false);
          return;
        }

        if (hasOrdNoAndItem && (hasRmBatch || hasPipeNo)) {
          alertify.error("Order No/Item cannot be provided together with Parent Batch or Pipe ID. Please choose only one set of identifiers.");
          setLoading(false);
          return;
        }

        let dataForApi = {
          STATUS: "8C",
          MILL: selectedMill ? selectedMill.value : "",
          RM_BATCH: "",
          PIPE_NO: "",
          ORDNO: "",
          ORDITEM: "",
        };

        if (hasRmBatch) {
          dataForApi.RM_BATCH = rmBatchId.value;
        }
        if (hasPipeNo) {
          dataForApi.PIPE_NO = pipeNo.value;
        }
        if (hasOrdNoAndItem) {
          dataForApi.ORDNO = ordNo;
          dataForApi.ORDITEM = ordItem;
        }

        const response = await axiosAPI.post(
          "api/LD08S001/getFillData",
          dataForApi,
          defaultOptions
        );

        if (response.status !== 200 || !response.data) {
          throw new Error("Invalid response from API");
        }

        if (response.data.length === 0) {
          alertify.error("NO Data Found in V_BARE_PDO");
          setLoading(false);
          return;
        }
        apiFetchedData = response.data; // Assign the single response data
      }

      // --- Common processing after API calls ---

      // Create a map for quick lookup of uploaded Excel data by Pipe_No
      // The Excel data is assumed to have a 'Pipe_No' column for matching
      const excelDataMap = uploadedExcelData.reduce((acc, row) => {
        if (row["Pipe_No"]) { // Ensure Pipe_No exists in the excel row
          acc[row["Pipe_No"]] = row;
        }
        return acc;
      }, {});

      // Collect batch number and weight from the aggregated apiFetchedData
      const collectedData = apiFetchedData.map((row) => ({
        TBP_BATCH_NO: row.TBP_BATCH_NO || "",
        TBP_WEIGHT: row.TBP_WEIGHT || "",
        LOM_ID_PAR_COIL_NO:row.LOM_ID_PAR_COIL_NO || "",
        LOM_MILL_NO:row.LOM_MILL_NO|| "",
        // Other properties as needed
      }));
      setBatchWeightData(collectedData);

      let dummyData = apiFetchedData.map((row) => {
        const excelRow = excelDataMap[row.TBP_BATCH_NO]; // Find matching Excel row
        const getFieldValue = (label) => {
          const field = fieldValue.find(x => x.label === label);
          return field ? field.value : "";
        };

        // Helper to get value preferring Excel over form field over API row, or empty string
        const getValue = (excelKey, fieldLabel, apiField) => {
          if (excelRow && excelRow[excelKey] !== undefined) {
            return excelRow[excelKey];
          }
          if (fieldLabel) { // Check if fieldLabel is provided for manual input
            const formValue = getFieldValue(fieldLabel);
            if (formValue !== "") {
              return formValue;
            }
          }
          return apiField || "";
        };

        // For "Result", check Excel first, then the state variable `result`
        const getResultValue = () => {
          if (excelRow && excelRow["Result"] !== undefined) {
            return excelRow["Result"];
          }
          return result.value ? result.value : "";
        };


        return {
          Curr_Proc: "8",
          Next_Proc: row.NEXT_PROC || "",
          PLAN_PROC: row.PLAN_PROC || "",
          GRADE: row.GRADE || "",
          HEAT: row.HEAT || "",
          Pipe_No: row.TBP_BATCH_NO || "",
          PARENT_BATCH:row.LOM_ID_PAR_COIL_NO|| "",
          OD: row.TBP_PIPE_OD_10 || "",
          THICK: row.TBP_PIPE_THK_10 || "",
          LENGTH: row.TBP_PIPE_LNG_10 || "",
          WEIGHT: row.TBP_WEIGHT || "",
          ASL_NO: getValue("ASL No", null, row.TBP_ASL_NO_80), // Use excel, then API, no form field for this one
          Date: formattedDate,
          Time: formattedTime,
          ORDER_NO: row.ORDER_NO || "",
          ITEM: row.ITEM || "",
          CUST_NAME: row.CUST_NAME || "",
          Inspector_Name: getValue("Inspector Name", "Inspector Name"),
          Shift: shift || "",
          Shift_date: prodDate || "",
          Remarks: getValue("Remarks", "Remarks"),
          Final_Remarks1: getValue("Final Remarks1", "Final Remarks1"),
          Final_Remarks2: getValue("Final Remarks2", "Final Remarks2"),
          Visual_Inspection: getValue("Visual Inspection", "Visual Inspection"),
          TBP_DIA_BODY_10: getValue("Diameter Body", "Diameter Body"),
          TBP_DIA_END_10: getValue("Diameter End", "Diameter End"),
          TBP_OUT_ROUND_BODY_10: getValue("Out of Round Body", "Out of Round Body"),
          TBP_OUT_ROUND_END_10: getValue("Out of Round end", "Out of Round end"),
          TBP_SQOC_10: getValue("Squarness of Corner", "Squarness of Corner"),
          TBP_ROC_10: getValue("Radius of Corner", "Radius of Corner"),
          ECN: getValue("ECN%", "ECN%"),
          TBP_WALL_THK_BODY_10: getValue("Wall thick Body", "Wall thick Body"),
          TBP_WALL_THK_END_10: getValue("Wall thick End", "Wall thick End"),
          Bevel_Angle_F_end: getValue("Bevel Angle F end", "Bevel Angle F end"),
          Bevel_Angle_T_end: getValue("Bevel Angle T end", "Bevel Angle T end"),
          Squarness_F_End: getValue("Squarness F End", "Squarness F End"),
          Squarness_T_End: getValue("Squarness T End", "Squarness T End"),
          TBP_ID_FLASH_10: getValue("ID Flash (D/H)", "ID Flash (D/H)"),
          Radial_offset_edg: getValue("Radial offset edg", "Radial offset edg"),
          Straightness_F_end: getValue("Straightness Body", "Straightness Body"),
          TBP_STRGHTNES_T_END_10: getValue("Straightness End", "Straightness End"),
          Root_Face_F_end: getValue("Root Face F end", "Root Face F end"),
          Root_Face_T_end: getValue("Root Face T end", "Root Face T end"),
          Width_Min: getValue("Width Min", "Width Min"),
          Width_Max: getValue("Width Max", "Width Max"),
          Depth_Min: getValue("Depth Min", "Depth Min"),
          Depth_Max: getValue("Depth Max", "Depth Max"),
          TBP_TWIST_10: getValue("Twist", "Twist"),
          TBP_CONCV_10: getValue("Concavity", "Concavity"),
          TBP_CONVX_10: getValue("Convexity", "Convexity"),
          // PO_No: poNo ? poNo : "", // PO_No isn't mapped to excel/fieldvalue in the old code either
          Iss_EX_Batch: rmBatchId?.value ?? "",
          Result: getResultValue(), // Special handling for Result
          Material: row.TBP_NO_MATNR || "",
          Material_DESC: row.MAT_DESC || "",
          GEOMETRY: row.GEOMETRY || "",
          MILL: row.LOM_MILL_NO || "", // Include mill here
        };
      });

      setTable(dummyData);
    } catch (error) {
      console.log("error: ", error);
      alertify.error("Error fetching data: " + error);
      return [];
    } finally {
      setLoading(false);
    }
  };


  const gridCol = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      frozen: true,
    },

    {
      title: "Pipe No",
      field: "Pipe_No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Parent Batch",
      field: "PARENT_BATCH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Mill", // New Mill column
      field: "MILL",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Pipe OD",
      field: "OD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: false,
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
      title: "Thick",
      field: "THICK",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value.toFixed(2);
        }
        return value;
      },
    },
    {
      title: "Cast No",
      field: "HEAT",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
        {
      title: "Grade",
      field: "GRADE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },

    {
      title: "ASL No",
      field: "ASL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      // Changed to 'input' editor since it's a string from Excel
      editor: "input",
      width: "120",
      editorParams: {
        elementAttributes: {
          maxlength: 10, // Limit input to 10 characters
        },
      },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Length (mm)",
      field: "LENGTH",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // Changed to 'input' editor for consistency, ensure it's numeric in usage
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
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

        let pipeId = cell?.getData()?.Pipe_No;
        let odia = cell?.getData()?.OD;
        let length = value;
        let thick = cell?.getData()?.TBP_WALL_THK_END_10;
        let depth = cell?.getData()?.Depth_Max;
        let width = cell?.getData()?.Width_Max;
        let geo = cell?.getData()?.GEOMETRY;

        let pipeWtVal = await calculatePipeWt(
          pipeId,
          length,
          odia,
          thick,
          width,
          depth,
          geo
        );
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWtVal,
        });
        return value;
      },
    },
    {
      field: "WEIGHT",
      title: "Weight(KG)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      headerSort: false,
      hozAlign: "right",
      editor: "number",
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Order No.",
      field: "ORDER_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
    },
    {
      title: "Item",
      field: "ITEM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
    },
    {
      title: "Cust Name",
      field: "CUST_NAME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
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
      title: "Diameter Body",
      field: "TBP_DIA_BODY_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Diameter End",
      field: "TBP_DIA_END_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Out of Round Body",
      field: "TBP_OUT_ROUND_BODY_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Out of Round end",
      field: "TBP_OUT_ROUND_END_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Bevel Angle F end",
      field: "Bevel_Angle_F_end",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Bevel Angle T end",
      field: "Bevel_Angle_T_end",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Squarness F End",
      field: "Squarness_F_End",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Squarness T End",
      field: "Squarness_T_End",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Root Face F end",
      field: "Root_Face_F_end",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Root Face T end",
      field: "Root_Face_T_end",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },


    {
      title: "Wall thick Body",
      field: "TBP_WALL_THK_BODY_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Wall thick End",
      field: "TBP_WALL_THK_END_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
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

        let pipeId = cell?.getData()?.Pipe_No;
        let odia = cell?.getData()?.OD;
        let length = cell?.getData()?.LENGTH;
        let thick = value;
        let depth = cell?.getData()?.Depth_Max;
        let width = cell?.getData()?.Width_Max;
        let geo = cell?.getData()?.GEOMETRY;

        let pipeWtVal = await calculatePipeWt(
          pipeId,
          length,
          odia,
          thick,
          width,
          depth,
          geo
        );
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWtVal,
        });
        return value;
      },
    },


    {
      title: "ID Flash (D/H)",
      field: "TBP_ID_FLASH_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Straightness Body",
      field: "Straightness_F_end",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Straightness End",
      field: "TBP_STRGHTNES_T_END_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Width Min",
      field: "Width_Min",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },


    {
      title: "Width Max",
      field: "Width_Max",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        let geometry = cell?.getData()?.GEOMETRY;
        if (geometry !== "O") {
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

        let pipeId = cell?.getData()?.Pipe_No;
        let odia = cell?.getData()?.OD;
        let length = cell?.getData()?.LENGTH;
        let thick = cell?.getData()?.TBP_WALL_THK_END_10;
        let depth = value;
        let width = cell?.getData()?.Width_Max;
        let geo = cell?.getData()?.GEOMETRY;

        let pipeWtVal = await calculatePipeWt(
          pipeId,
          length,
          odia,
          thick,
          width,
          depth,
          geo
        );
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWtVal,
        });
        return value;
      },
    },
    {
      title: "Depth Min",
      field: "Depth_Min",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Depth Max",
      field: "Depth_Max",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        let geometry = cell?.getData()?.GEOMETRY;
        if (geometry !== "O") {
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

        let pipeId = cell?.getData()?.Pipe_No;
        let odia = cell?.getData()?.OD;
        let length = cell?.getData()?.LENGTH;
        let thick = cell?.getData()?.TBP_WALL_THK_END_10;
        let depth = value;
        let width = cell?.getData()?.Width_Max;
        let geo = cell?.getData()?.GEOMETRY;

        let pipeWtVal = await calculatePipeWt(
          pipeId,
          length,
          odia,
          thick,
          width,
          depth,
          geo
        );
        var row = cell.getRow();
        row.update({
          WEIGHT: pipeWtVal,
        });
        return value;
      },
    },

    {
      title: "Squarness of Corner",
      field: "TBP_SQOC_10",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      hozAlign: "right",
    },
    {
      title: "Radius of Corner",
      field: "TBP_ROC_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Twist",
      field: "TBP_TWIST_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Concavity",
      field: "TBP_CONCV_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "Convexity",
      field: "TBP_CONVX_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },

    {
      title: "ECN%",
      field: "ECN",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      hozAlign: "right",
    },


    {
      title: "Material",
      field: "Material",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      hozAlign: "right",
    },
    {
      title: "Material Desc",
      field: "Material_DESC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
      hozAlign: "right",
    },
    {
      title: "Curr Proc",
      field: "Curr_Proc",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: false,
    },
    {
      title: "Next Proc",
      field: "Next_Proc",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: false,
    },
    {
      title: "Planned Proc",
      field: "PLAN_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Date",
      field: "Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Time",
      field: "Time",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      // width: 3,
      title: "Inspector Name",
      field: "Inspector_Name",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },
    {
      title: "Shift(*)",
      field: "Shift",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: false,
    },
    {
      title: "Shift date(*)",
      field: "Shift_date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: false,
    },
    {
      title: "Remarks",
      field: "Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },
    {
      title: "Final Remarks1",
      field: "Final_Remarks1",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value && value.length > 10) { // Added null/undefined check for value
          alertify.error("Max 10 character allowed Final Remarks1");
          cell?.setValue("");
          return "";
        }
        return value;
      },
    },
    {
      title: "Final Remarks2",
      field: "Final_Remarks2",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value && value.length > 10) { // Added null/undefined check for value
          alertify.error("Max 10 character allowed in Final Remarks2");
          cell?.setValue("");
          return "";
        }
        return value;
      },
    },
    {
      title: "Visual Inspection",
      field: "Visual_Inspection",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
    },


    {
      title: "Radial offset edg",
      field: "Radial_offset_edg",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
    },

    {
      title: "Iss.EX.Batch",
      field: "Iss_EX_Batch",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "Geometry",
      field: "GEOMETRY",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
  ];

  const handleResultChange = (value) => {
    setResult(value);
  };

  const ResultType = [
    { label: "OK", value: "OK" },
    { label: "NOT OK", value: "NOT OK" },
  ];

  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${d}-${m}-${y} ${h}:${min}`;
  };

  const updateData = async (newToken = false) => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");
    const token = await GetAuthorization();

    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };
    var selectedRows = selectedTable?.getSelectedRows();
    if (selectedRows?.length === 0) {
      alertify.error("Please select rows");
      return;
    }
    var prodStartDateVal = document.getElementById("prodStartDate").value;
    var prodEndDateVal = document.getElementById("prodEndDate").value;
    var startDate = new Date(prodStartDateVal);
    var endDate = new Date(prodEndDateVal);
    var prodstartdt = formatDate(startDate);
    var prodenddt = formatDate(endDate);

    // Create a map for fast lookup of weights by Pipe_No
    const weightMap = batchWeightData.reduce((acc, item) => {
      acc[item.TBP_BATCH_NO] = item.TBP_WEIGHT;
      return acc;
    }, {});

    var newData = [];
    let hasError = false; // Flag to stop processing if an error occurs
    for (const item of selectedRows) { 
      if (hasError) break; // Stop if an error was found in a previous iteration

      const pipeNo = item._row.data.Pipe_No; // Get pipeNo for error messages

      const weight = item._row.data.WEIGHT
        ? parseFloat(item._row.data.WEIGHT)
        : 0;
      let batchOriginalWeight = weight;
      // Validate weight against the batch weight
      if (pipeNo in weightMap) {
        batchOriginalWeight = parseFloat(weightMap[pipeNo]);
        if (weight > batchOriginalWeight) {
          var msg = `Weight for ${pipeNo} cannot be greater than batch Original weight (${batchOriginalWeight}).`;
          alertify.error(msg);
          setShowSaveMsgSuccess(false);
          setShowSaveMsgError(true);
          setSaveMsg(msg);
          hasError = true; 
          continue; 
        }
      }

      // --- New Validation for Result ---
      const resultValue = item._row.data.Result;
      if (!resultValue || String(resultValue).trim() === "") { // Checks for null, undefined, or empty/whitespace string
        var msg = `Result cannot be empty for Pipe No: ${pipeNo}.`;
        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        hasError = true;
        continue;
      }

      // --- New Validation for Parent Batch (PAR_COIL_NO) ---
      const parentBatchValue = item._row.data.PARENT_BATCH;
      if (!parentBatchValue || String(parentBatchValue).trim() === "") { // Checks for null, undefined, or empty/whitespace string
        var msg = `Parent Batch cannot be empty for Pipe No: ${pipeNo}.`;
        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        hasError = true;
        continue;
      }

      newData.push({
        PLANT: "0780",
        BATCH_NO: item._row.data.Pipe_No ? item._row.data.Pipe_No : "",
        BATCH_PROC_NO: "8",
        CD_PROC: item._row.data.Curr_Proc ? item._row.data.Curr_Proc : "",
        NEXT_PROC: item._row.data.Next_Proc ? item._row.data.Next_Proc : "",
        PROD_DATE: prodDate,
        SHIFT: shift ? shift : "",
        WEIGHT: item._row.data.WEIGHT ? item._row.data.WEIGHT : 0,
        BATCH_SCRAP_WEIGHT: batchOriginalWeight - item._row.data.WEIGHT,
        STATUS: "8C",
        PAR_COIL_NO: parentBatchValue, // Use the validated value
        ID_FIRST_PAR: "",
        ID_ORDER_NO: item._row.data.ORDER_NO ? item._row.data.ORDER_NO : "",
        ITEM_NO: item._row.data.ITEM ? item._row.data.ITEM : "",
        QUALITY_CD: "",
        MATNR: item._row.data.Material ? item._row.data.Material : "",
        FLAG: "",
        START_DT: prodstartdt,
        END_DT: prodenddt,
        RESULT: resultValue, // Use the validated value
        REMARK: item._row.data.Remarks ? item._row.data.Remarks : "",
        HEAT_NO: "",
        INSP_NAME: item._row.data.Inspector_Name
          ? item._row.data.Inspector_Name
          : "",
        PIPE_OD_10: item._row.data.OD ? item._row.data.OD : "",
        PIPE_THK_10: item._row.data.THICK ? item._row.data.THICK : "",
        PIPE_LNG_10: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        TBP_DIA_BODY_10: item._row.data?.TBP_DIA_BODY_10,
        TBP_DIA_END_10: item._row.data?.TBP_DIA_END_10,
        TBP_OUT_ROUND_BODY_10: item._row.data?.TBP_OUT_ROUND_BODY_10,
        TBP_OUT_ROUND_END_10: item._row.data?.TBP_OUT_ROUND_END_10,
        TBP_SQOC_10: item._row.data?.TBP_SQOC_10,
        TBP_ROC_10: item._row.data?.TBP_ROC_10,
        TBP_WALL_THK_BODY_10: item._row.data?.TBP_WALL_THK_BODY_10,
        TBP_WALL_THK_END_10: item._row.data?.TBP_WALL_THK_END_10,
        TBP_STRGHTNES_T_END_10: item._row.data?.TBP_STRGHTNES_T_END_10,
        TBP_ID_FLASH_10: item._row.data?.TBP_ID_FLASH_10,
        TBP_TWIST_10: item._row.data?.TBP_TWIST_10,
        TBP_CONCV_10: item._row.data?.TBP_CONCV_10,
        TBP_CONVX_10: item._row.data?.TBP_CONVX_10,
        TBP_VISUAL_INSP_80: item._row.data.Visual_Inspection
          ? item._row.data.Visual_Inspection
          : "",
        TBP_ECN_PERCEN_80: item._row.data.ECN ? item._row.data.ECN : "",
        TBP_B_ANGL_F_END_80: item._row.data.Bevel_Angle_F_end
          ? item._row.data.Bevel_Angle_F_end
          : "",
        TBP_B_ANGL_T_END_80: item._row.data.Bevel_Angle_T_end
          ? item._row.data.Bevel_Angle_T_end
          : "",
        TBP_ROOTFACE_F_END_80: item._row.data.Root_Face_F_end
          ? item._row.data.Root_Face_F_end
          : "",
        TBP_ROOTFACE_T_END_80: item._row.data.Root_Face_T_end
          ? item._row.data.Root_Face_T_end
          : "",
        TBP_STRGHTNES_F_END_80: item._row.data.Straightness_F_end
          ? item._row.data.Straightness_F_end
          : "",
        TBP_SQU_F_END_80: item._row.data.Squarness_F_End
          ? item._row.data.Squarness_F_End
          : "",
        TBP_SQU_T_END_80: item._row.data.Squarness_T_End
          ? item._row.data.Squarness_T_End
          : "",
        TBP_ASL_NO_80: item._row.data.ASL_NO ? item._row.data.ASL_NO : "",
        TBP_WID_MIN_80: item._row.data.Width_Min
          ? item._row.data.Width_Min
          : "",
        TBP_WID_MAX_80: item._row.data.Width_Max
          ? item._row.data.Width_Max
          : "",
        TBP_DEPTH_MIN_80: item._row.data.Depth_Min
          ? item._row.data.Depth_Min
          : "",
        TBP_DEPTH_MAX_80: item._row.data.Depth_Max
          ? item._row.data.Depth_Max
          : "",
        TBP_VDI_FINAL_RMK_1_80: item._row.data.Final_Remarks1
          ? item._row.data.Final_Remarks1
          : "",
        TBP_VDI_FINAL_RMK_2_80: item._row.data.Final_Remarks2
          ? item._row.data.Final_Remarks2
          : "",
        TBP_LEN_FT_80: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        TBP_LEN_INCH_80: item._row.data.LENGTH ? item._row.data.LENGTH : "",
        TBP_RADIAL_OFF_80: item._row.data.Radial_offset_edg
          ? item._row.data.Radial_offset_edg
          : "",
        MILL: item._row.data.MILL ? item._row.data.MILL : "", // Include mill here
      });
    }

    if (hasError) { // If an error occurred during iteration, stop here
      setLoading(false);
      return;
    }

    setLoading(true);
    let data = {
      selectedRowsData: newData,
    };
    var url = "api/LD08S001/insertTempData";
    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText !== "" && response.statusText !== "OK") {
          console.log(response?.error?.response?.data?.message);
          alertify.error(response?.error?.response?.data?.message);
        } else {
          if (response.data?.failedCount > 0) {
            alertify.error(response.data?.message);
            setSelectedTable(null);
            setShowSaveMsgSuccess(false);
            setShowSaveMsgError(true);
            setSaveMsg(response.data?.message);
          } else {
            alertify.success(response.data?.message);
            setShowSaveMsgSuccess(true);
            setShowSaveMsgError(false);
            setSaveMsg(response.data?.message);
            setTable([]); // Use empty array, not [, ]
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
    if (selectedTable === null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var len = selectedTable.getData();
    if (len.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD08S001" + ".xlsx";
    window.XLSX = XLSX;
    selectedTable.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  // Function to handle Excel file upload (now reads all columns into objects)
  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          // Use sheet_to_json without { header: 1 } to get objects with headers as keys
          const json = XLSX.utils.sheet_to_json(worksheet);

          if (json.length > 0) {
            setUploadedExcelData(json);
            alertify.success(`Successfully loaded ${json.length} rows from Excel.`);
            console.log("Uploaded Excel Data for merging:", json);
          } else {
            alertify.error("No valid data found in the Excel file. Please ensure it has data rows and the first row contains headers.");
            setUploadedExcelData([]);
          }
        } catch (error) {
          alertify.error("Error reading Excel file: " + error.message);
          console.error("Error reading Excel file:", error);
          setUploadedExcelData([]);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Function to clear file input and uploaded data when 'choose file' is clicked
  const handleClearFileInput = () => {
    if (excelFileInputRef.current) {
      excelFileInputRef.current.value = ""; // Clear the file input element
    }
    setUploadedExcelData([]); // Clear any previously loaded Excel data
  };

  // Function to download an Excel template
  const handleDownloadTemplate = () => {
    const templateHeaders = [
      "Pipe_No", "Inspector Name", "Remarks", "Visual Inspection",
      "Final Remarks1", "Final Remarks2", "Radial offset edg",
      "Diameter Body", "Diameter End", "Out of Round Body", "Out of Round end",
      "Bevel Angle F end", "Bevel Angle T end", "Squarness F End",
      "Squarness T End", "Root Face F end", "Root Face T end",
      "Wall thick Body", "Wall thick End", "ID Flash (D/H)",
      "Straightness Body", "Straightness End", "Width Min", "Width Max",
      "Depth Min", "Depth Max", "Squarness of Corner", "Radius of Corner",
      "Twist", "Concavity", "Convexity", "ECN%", "Result", "ASL No"
    ];

    const ws = XLSX.utils.aoa_to_sheet([templateHeaders]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inspection Data Template");
    XLSX.writeFile(wb, "InspectionDataTemplate.xlsx");
  };


  return (
    <DashboardLayout>
      <DefaultNavbar routes={routes} module="Mill" page="80 - VDI" />
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
      {isRestricted === false && (
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

                    <Grid item xs={1}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Mill
                        </MDTypography>
                        <ReactSelect
                          id="millSelect"
                          options={[{ label: "MILL 1", value: "1" }, { label: "MILL 2", value: "2" }]}
                          onChange={handleMillChange}
                          variant="h6"
                          value={selectedMill}
                        />
                      </Grid>

                      <Grid item xs={1.75} >
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
                          menuPortalTarget={document.body} // Renders the dropdown menu directly into the body, outside of any parent overflows
                          styles={{
                            menuPortal: base => ({ ...base, zIndex: 9999 }) // Ensures it has a very high z-index
                          }}
                        />
                      </Grid>


                      <Grid item xs={1.75}>
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
                          options={filteredPipeNoList}
                          onChange={handlePipeNoChange}
                          variant="h6"
                          value={pipeNo}
                        />
                      </Grid>
                      <Grid item xs={2} style={{ zIndex: 3 }}>
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
                          name="Orderno"
                          //iseditable="false"
                          value={ordNo}
                          onChange={(e) =>{
                            setOrdNo(e.target.value)
                          }}
                        />
                      </Grid>
                      <Grid item xs={1} style={{ zIndex: 3 }}>
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
                          name="orderItem"
                          //iseditable="false"
                          value={ordItem}
                          onChange={(e) =>{
                            setOrdItem(e.target.value)
                          }}
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

                      <Grid item xs={1} style={{ zIndex: 3 }}>
                        <MDTypography
                          fontWeight="regular"
                          fontSize="small"
                          textTransform="capitalize"
                          variant="h6"
                          color={"dark"}
                          noWrap
                        >
                          Shift
                        </MDTypography>
                        <MDInput
                          name="Shift"
                          iseditable="false"
                          value={shift}
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
                                onChange={(e) => {
                                  const varVal = [];
                                  fieldValue.map((y) => {
                                    if (y.label === x.label) {
                                      y.value = e.target.value;
                                      varVal.push(y);
                                    } else {
                                      varVal.push(y);
                                    }
                                  });
                                  setFieldValue(varVal);
                                }}
                              />
                            ) : (
                              <MDInput
                                name={i}
                                value={x.value}
                                onChange={(e) => {
                                  const varVal = [];
                                  fieldValue.map((y) => {
                                    if (y.label === x.label) {
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
                              setResult(e);
                            }}
                            value={result}
                          />
                        </Grid>

                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={bindHydraData}
                          >
                            Fill Data
                          </MDButton>
                        </Grid>
                        <Grid item xs={1}>
                          <MDButton
                            style={{ marginTop: "1.5rem" }}
                            size="small"
                            color="info"
                            onClick={validateData}
                          >
                            Validate
                          </MDButton>
                        </Grid>
                        {/* Excel Upload MDInput with helperText and inputRef */}
                        <Grid item xs={3} style={{ zIndex: 5 }}>
                            <MDTypography
                              fontWeight="regular"
                              fontSize="small"
                              textTransform="capitalize"
                              variant="h6"
                              color={"dark"}
                              noWrap
                            >
                              Upload Inspection Data (Excel)
                            </MDTypography>
                            <MDInput
                              type="file"
                              inputRef={excelFileInputRef}
                              onChange={handleExcelUpload}
                              onClick={handleClearFileInput} 
                              accept=".xlsx, .xls"
                              sx={{ width: '100%', marginTop: '0.5rem' }}
                              helperText={
                                uploadedExcelData.length > 0
                                  ? `${uploadedExcelData.length} items loaded.`
                                  : ""
                              }
                              FormHelperTextProps={{
                                sx: {
                                  color: 'text.secondary', // Material-UI default for helper text
                                }
                              }}
                            />
                            </Grid>
                            <Grid item xs={3} style={{ zIndex: 5 }}>
                            <MDButton
                              style={{ marginTop: "2rem" }}
                              size="small"
                              color="success"
                              onClick={handleDownloadTemplate}
                            >
                              Download Template
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
                        {getTable && <div id="TableContainer" />}

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
                      // if (tabValue == 0) { // Assuming tabValue logic if applicable
                      //   setInsertTableData([]);
                      // }
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
        </>
      )}
    </DashboardLayout>
  );
}

/*
Expected Excel Column Names for Upload:

The uploaded Excel file should have a single sheet, with the first row as headers.
Each row in the Excel should correspond to a Pipe ID.

The "Pipe_No" column in your Excel is CRUCIAL for matching rows from API data with Excel data.

The following column names are expected in the Excel file for data that will override or supplement form inputs.
If a column is present in the Excel for a given Pipe_No, its value will be used instead of the manual form input or the API-fetched value for that specific `Pipe_No`.

- Pipe_No (e.g., "P12345")
- Inspector Name (e.g., "John Doe")
- Remarks (e.g., "Minor surface scratches")
- Visual Inspection (e.g., "OK")
- Final Remarks1 (e.g., "Passed")
- Final Remarks2 (e.g., "Quality A")
- Radial offset edg (e.g., 0.5)
- Diameter Body (e.g., 200.1)
- Diameter End (e.g., 200.2)
- Out of Round Body (e.g., 0.05)
- Out of Round end (e.g., 0.04)
- Bevel Angle F end (e.g., 30.0)
- Bevel Angle T end (e.g., 30.5)
- Squarness F End (e.g., 0.1)
- Squarness T End (e.g., 0.15)
- Root Face F end (e.g., 1.5)
- Root Face T end (e.g., 1.6)
- Wall thick Body (e.g., 10.0)
- Wall thick End (e.g., 9.9)
- ID Flash (D/H) (e.g., 0.02)
- Straightness Body (e.g., 1.2)
- Straightness End (e.g., 1.1)
- Width Min (e.g., 100.0)
- Width Max (e.g., 100.5)
- Depth Min (e.g., 50.0)
- Depth Max (e.g., 50.3)
- Squarness of Corner (e.g., 90.1)
- Radius of Corner (e.g., 5.0)
- Twist (e.g., 0.3)
- Concavity (e.g., 0.01)
- Convexity (e.g., 0.02)
- ECN% (e.g., 0.12)
- Result (Expected values: "OK" or "NOT OK")
- ASL No (e.g., "ASL001")
*/
