import React, { useEffect, useState, useRef, forwardRef } from "react";

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";

import MDAlert from "@mui/material/Alert";
// Material Dashboard 2 React components
import { GetAuthorization } from "utils";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import Preloader from "components/Preloader/Preloader";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import ReactSelect from "components/Select/ReactSelect";
import DatePicker from "components/DateTime/DatePicker";
import MonthPicker from "components/DateTime/DatePicker";
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
import ClearAllIcon from "@mui/icons-material/ClearAll";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import DataTable from "examples/Tables/DataTable";
import breakpoints from "assets/theme/base/breakpoints";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import SaveIcon from "@mui/icons-material/Save";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// Data
import authorsTableData from "layouts/tables/data/authorsTableData";
import projectsTableData from "layouts/tables/data/projectsTableData";
import routes from "routes";

import axiosAPI from "../../axiosAPI";
import serverDetails from "../../variables/serverDetails";
import Tooltip from "@mui/material/Tooltip";
import EventRepeat from "@mui/icons-material/EventRepeat";
import Event from "@mui/icons-material/Event";
import Today from "@mui/icons-material/Today";

import "../../tabulatorCss.scss";
import { set } from "date-fns";

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
  const [rmBatchId, setrmBatchId] = useState(null);
  const [pipenoList, setPipeNoList] = useState([]);
  const [pipeno, setPipeNo] = useState(null);
  const [ordNo, setOrdNo] = useState("");
  const [ordItem, setOrdItem] = useState("");
  const [custName, setCustName] = useState("");
  const [SHIFT, setSHIFT] = useState([]);
  const [SHIFT_DATE, setSHIFT_DATE] = useState(null);
  const [prodOrdNo, setProdOrdNo] = useState("");
  const [nxtproc, setNxtproc] = useState("");
  const [nxtproc2, setNxtproc2] = useState("D");
  const [coatthkw1, setCoatTHKW1] = useState("");
  const [coatthkw2, setCoatTHKW2] = useState("");
  const [coatthkw3, setCoatTHKW3] = useState("");
  const [coatthkw4, setCoatTHKW4] = useState("");
  const [coatthkw5, setCoatTHKW5] = useState("");
  const [coatthkw6, setCoatTHKW6] = useState("");

  const [coatthkb1, setCoatTHKB1] = useState("");
  const [coatthkb2, setCoatTHKB2] = useState("");
  const [coatthkb3, setCoatTHKB3] = useState("");
  const [coatthkb4, setCoatTHKB4] = useState("");
  const [coatthkb5, setCoatTHKB5] = useState("");
  const [coatthkb6, setCoatTHKB6] = useState("");
  const [time, setTime] = useState("");
  const [inspectorname, setInspectorName] = useState("");
  const [selectedProcessDt, setSelectedProcessDt] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [result, setResult] = useState("");
  const [selectedResult, setSelectedResult] = React.useState([]);
  const [shift, setShift] = useState("");
  const [selectedShift, setSelectedShift] = React.useState(null);
  const [quetemp, setQueTemp] = useState("");
  const [coatingthickness, setCoatingThickness] = useState("");
  const [visualofcoatedpipe, setVisualOfCoatedPipe] = useState("");
  const [coatingstatus, setCoatingStatus] = useState("");
  const [testonpipe, setTestOnPipe] = useState("");
  // const [selectedLabTest, setSelectedLabTest] = React.useState([]);
  // const [selectedFieldTest, setSelectedFieldTest] = React.useState([]);
  const [labTestOptions, setLabTestOptions] = useState([]);
  const [fieldTestOptions, setFieldTestOptions] = useState([]);

  const [fieldtest, setFieldTest] = useState("");
  const [getThickTable, setThickTable] = useState([]);
  const [selectedThickTable, setSelectedThickTable] = useState(null);
  const [expanded, setExpanded] = useState(true);

    const [showSaveMsgSuccess, setShowSaveMsgSuccess] = useState(false);
    const [showSaveMsgError, setShowSaveMsgError] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");

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
        getLabTestOptions(data.accessToken).then(setLabTestOptions),
        getFieldTestOptions(data.accessToken).then(setFieldTestOptions),
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
      var pageName = "LD12S001";
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

  const setTableNull = () => {
    setThickTable([]);
  };

  useEffect(() => {
    if (getThickTable?.length > 0) {
      const table = new Tabulator("#ThickTableContainer", {
        pagination: "local",
        paginationSize: 12,
        data: getThickTable,
        columns: ThickColumns,
        rowFormatter: function(row) {
        const data = row.getData();
        if (Number(data.NO_OF_REC) > 0) {
        row.getElement().style.backgroundColor = "#FFE5E5";
        row.getElement().style.borderLeft = "5px solid #DC3545";
        row.getElement().style.fontWeight = "600";
        }
        else row.getElement().style.borderLeft = "5px solid #198754";
        },

        // height: 400,
        // initialSort: [
        //   { column: "ORDER_NO", dir: "asc" },
        //   { column: "ITEM", dir: "asc" },
        //   { column: "TBP_DIA_END_10", dir: "asc" },
        // ],
        layout: "fitDataFill",
      });

      setSelectedThickTable(table);
    } else {
      setSelectedThickTable(null);
    }
  }, [getThickTable]);
  const isRowEditable = (cell) => {
return Number(cell.getRow().getData().NO_OF_REC || 0) === 0;
};
  const handleClearAll = (newToken = false) => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");

    setRemarks("");
    setInspectorName("");
    setSelectedResult([]);
    setCoatTHKB1("");
    setCoatTHKB2("");
    setCoatTHKB3("");
    setCoatTHKB4("");
    setCoatTHKB5("");
    setCoatTHKB6("");
    setCoatTHKW1("");
    setCoatTHKW2("");
    setCoatTHKW3("");
    setCoatTHKW4("");
    setCoatTHKW5("");
    setCoatTHKW6("");
    setQueTemp("");
    setCoatingStatus("");
    setTestOnPipe("");
    // setSelectedLabTest([]);
    // setSelectedFieldTest([]);
    setThickTable([]);
    setSelectedThickTable(null);
  };

  const handleClearMain = (newToken = false) => {
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");

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

  const getTataDate = (value) => {
    setLoading(true);
    GetAuthorization().then((token) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };
      console.log(value);
      var url = "api/LD12S001/getTataDate";
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
  const getLabTestOptions = async (accessToken) => {
  var defaultOptions = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };

  let data = {};
  var url = "api/LD12S001/getLabTestList"; // Replace with your actual API endpoint
  
  try {
    const response = await axiosAPI.post(url, data, defaultOptions);
    if (response.statusText !== "" && response.statusText !== "OK") {
      return [];
    } else {
      var items = [];
      response.data.map((row) => {
        var obj = {
          label: row.CD_DESC, // Replace with actual field name
          value: row.CD_VALUE, // Replace with actual field name
        };
        items.push(obj);
      });
      return items;
    }
  } catch (error) {
    console.error("Error fetching lab test options:", error);
    return [];
  }
};
const formatMultiSelectLabels = (value, options = [], tagValue = "YES") => {
  if (tagValue === "NO" ) return "N/A";
  if (!value || value.trim() === "") return "Select...";

  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

  const labels = values.map((val) => {
    const found = options.find((opt) => opt.value === val);
    return found ? found.label : val;
  });

  return labels.join(", ");
};

const simpleCheckboxMultiSelectEditor = (
  cell,
  onRendered,
  success,
  cancel,
  editorParams
) => {
  const cellEl = cell.getElement();
  const rect = cellEl.getBoundingClientRect();
  const options = editorParams?.values || [];

  const currentValue = cell.getValue() || "";
  const selectedSet = new Set(
    currentValue
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  );

  // Placeholder element returned to Tabulator
  const holder = document.createElement("div");
  holder.style.width = "100%";
  holder.style.height = "100%";

  // Popup mounted on body so it never gets clipped by table
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.left = `${rect.left}px`;
  popup.style.top = `${rect.bottom + 4}px`;
  popup.style.minWidth = `${Math.max(rect.width, 220)}px`;
  popup.style.maxWidth = "320px";
  popup.style.maxHeight = "260px";
  popup.style.overflow = "hidden";
  popup.style.background = "#fff";
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
  popup.style.zIndex = "99999";
  popup.style.padding = "8px";
  popup.tabIndex = 0;

  const title = document.createElement("div");
  title.style.fontWeight = "600";
  title.style.fontSize = "13px";
  title.style.marginBottom = "8px";
  title.innerText = "Select options";
  popup.appendChild(title);

  const list = document.createElement("div");
  list.style.maxHeight = "170px";
  list.style.overflowY = "auto";
  list.style.border = "1px solid #eee";
  list.style.borderRadius = "6px";
  list.style.padding = "6px";
  list.style.marginBottom = "8px";

  if (options.length === 0) {
    const empty = document.createElement("div");
    empty.style.fontSize = "12px";
    empty.style.color = "#777";
    empty.innerText = "No options available";
    list.appendChild(empty);
  } else {
    options.forEach((opt) => {
      const row = document.createElement("label");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.padding = "6px";
      row.style.cursor = "pointer";
      row.style.fontSize = "13px";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = opt.value;
      checkbox.checked = selectedSet.has(opt.value);

      checkbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          selectedSet.add(opt.value);
        } else {
          selectedSet.delete(opt.value);
        }
      });

      const text = document.createElement("span");
      text.innerText = opt.label;

      row.appendChild(checkbox);
      row.appendChild(text);
      list.appendChild(row);
    });
  }

  popup.appendChild(list);

  const actions = document.createElement("div");
  actions.style.display = "flex";
  actions.style.justifyContent = "space-between";
  actions.style.gap = "8px";

  const clearBtn = document.createElement("button");
  clearBtn.type = "button";
  clearBtn.innerText = "Clear";
  clearBtn.style.padding = "6px 10px";
  clearBtn.style.border = "1px solid #ccc";
  clearBtn.style.borderRadius = "6px";
  clearBtn.style.background = "#f5f5f5";
  clearBtn.style.cursor = "pointer";

  const doneBtn = document.createElement("button");
  doneBtn.type = "button";
  doneBtn.innerText = "Done";
  doneBtn.style.padding = "6px 10px";
  doneBtn.style.border = "none";
  doneBtn.style.borderRadius = "6px";
  doneBtn.style.background = "#1976d2";
  doneBtn.style.color = "#fff";
  doneBtn.style.cursor = "pointer";

  actions.appendChild(clearBtn);
  actions.appendChild(doneBtn);
  popup.appendChild(actions);

  document.body.appendChild(popup);

  const repositionPopup = () => {
  const updatedRect = cellEl.getBoundingClientRect();
  popup.style.left = `${updatedRect.left}px`;
  popup.style.top = `${updatedRect.bottom + 4}px`;
  popup.style.minWidth = `${Math.max(updatedRect.width, 220)}px`;
};

const cleanup = () => {
  document.removeEventListener("mousedown", handleOutsideClick);
  window.removeEventListener("resize", repositionPopup);
  window.removeEventListener("scroll", repositionPopup, true);
  if (popup.parentNode) popup.parentNode.removeChild(popup);
};

const handleCloseAndSave = () => {
  const finalValue = Array.from(selectedSet).join(",");
  cleanup();
  success(finalValue);
};

const handleOutsideClick = (e) => {
  if (!popup.contains(e.target) && !cellEl.contains(e.target)) {
    handleCloseAndSave();
  }
};

clearBtn.addEventListener("click", () => {
  selectedSet.clear();
  const checkboxes = popup.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((cb) => {
    cb.checked = false;
  });
});

doneBtn.addEventListener("click", handleCloseAndSave);

popup.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    cleanup();
    cancel();
  }
  if (e.key === "Enter") {
    handleCloseAndSave();
  }
});

onRendered(() => {
  setTimeout(() => {
    popup.focus();
    document.addEventListener("mousedown", handleOutsideClick);
    window.addEventListener("resize", repositionPopup);
    window.addEventListener("scroll", repositionPopup, true);
    repositionPopup();
  }, 0);
});

  return holder;
};



const getFieldTestOptions = async (accessToken) => {
  var defaultOptions = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };

  let data = {};
  var url = "api/LD12S001/getFieldTestList"; // Replace with your actual API endpoint
  
  try {
    const response = await axiosAPI.post(url, data, defaultOptions);
    if (response.statusText !== "" && response.statusText !== "OK") {
      return [];
    } else {
      var items = [];
      response.data.map((row) => {
        var obj = {
          label: row.CD_DESC, // Replace with actual field name
          value: row.CD_VALUE, // Replace with actual field name
        };
        items.push(obj);
      });
      return items;
    }
  } catch (error) {
    console.error("Error fetching field test options:", error);
    return [];
  }
};

  const getPipeNoList = async (accessToken) => {
  const defaultOptions = {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  };

  const data = {
    status: "DC",
    rmBatch: "",
  };

  const url = "api/LD12S001/getPipeNoList";

  try {
    const response = await axiosAPI.post(url, data, defaultOptions);

    if (
      response.statusText !== "" &&
      response.statusText !== "OK"
    ) {
      setPipeNoList([]);
      return;
    }

    const items = (response.data || []).map((row) => ({
      label: row.LOM_ID_BATCH,
      value: row.LOM_ID_BATCH,
      parentCoilNo: row.LOM_ID_PAR_COIL_NO,

      // Carry NO_OF_REC with the selected Pipe object
      NO_OF_REC: Number(row.NO_OF_REC || 0),
    }));

    setPipeNoList(items);
    setPipeNo(null);
    setrmBatchId(null);
  } catch (error) {
    console.error("getPipeNoList error:", error);
    setPipeNoList([]);
    alertify.error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to retrieve Pipe No list."
    );
  }
};

  const calculatePipeWt = async (PIPE_ID,length, odia, thick, width, depth, geo) => {
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
            p_batch_id: PIPE_ID,
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

  const handlePipeNoChange = (value) => {
    setPipeNo(value);
    setrmBatchId(
      value?.parentCoilNo
        ? { label: value.parentCoilNo, value: value.parentCoilNo }
        : null
    );
    setThickTable([]);
    setSelectedThickTable(null);
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

    // Editing an order auto-filled from Pipe switches to Order-Item search.
    // Do not retain the Item belonging to the previously selected Pipe.
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

  const handleClearVal = (newToken = false) => {
    setNxtproc("");
    setPipeNo(null);
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setRemarks("");
    setInspectorName("");
    setSelectedResult([]);
    setCoatTHKB1("");
    setCoatTHKB2("");
    setCoatTHKB3("");
    setCoatTHKB4("");
    setCoatTHKB5("");
    setCoatTHKB6("");
    setCoatTHKW1("");
    setCoatTHKW2("");
    setCoatTHKW3("");
    setCoatTHKW4("");
    setCoatTHKW5("");
    setCoatTHKW6("");
    setQueTemp("");
    setCoatingStatus("");
    setTestOnPipe("");
    // setSelectedLabTest([]);
    // setSelectedFieldTest([]);
    setOrdNo("");
    setOrdItem("");
    setCustName("");

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

  const handleVal = (newToken = false) => {
    setSHIFT_DATE(null);
    setSelectedShift(null);
    setRemarks("");
    setInspectorName("");
    setSelectedResult([]);
    setCoatTHKB1("");
    setCoatTHKB2("");
    setCoatTHKB3("");
    setCoatTHKB4("");
    setCoatTHKB5("");
    setCoatTHKB6("");
    setCoatTHKW1("");
    setCoatTHKW2("");
    setCoatTHKW3("");
    setCoatTHKW4("");
    setCoatTHKW5("");
    setCoatTHKW6("");
    setQueTemp("");
    setCoatingStatus("");
    setTestOnPipe("");
    // setSelectedLabTest([]);
    // setSelectedFieldTest([]);
    setOrdNo("");
    setOrdItem("");
    setCustName("");

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
      CURR_PROC: "D",
      PIPE_NO: pipeno?.value || "",
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
          setNxtproc(items[0]?.value || "");
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const getCoatWt = async (
    newToken = false,
    W1,
    W2,
    W3,
    W4,
    W5,
    W6,
    W7,
    W8,
    W9,
    W10,
    W11,
    W12,
    LENGTH,
    OD
  ) => {
    const token = await GetAuthorization();
      const defaultOptions = {
        headers: {
          Authorization: "Bearer " + token.accessToken,
        },
      };

    let data = {
      W1: W1 ? W1 : "0",
      W2: W2 ? W2 : "0",
      W3: W3 ? W3 : "0",
      W4: W4 ? W4 : "0",
      W5: W5 ? W5 : "0",
      W6: W6 ? W6 : "0",
      W7: W7 ? W7 : "0",
      W8: W8 ? W8 : "0",
      W9: W9 ? W9 : "0",
      W10: W10 ? W10 : "0",
      W11: W11 ? W11 : "0",
      W12: W12 ? W12 : "0",
      OD: OD ? OD : "0",
      LENGTH: LENGTH ? LENGTH : "0",
    };

    var url = "api/LD12S001/getCoatWt";
    return axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          var coatWt = response.data[0].COAT_WT;
          return coatWt;
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
      PIPE_NO: pipeno?.value || "",
    };

    var url = "api/LD02S001/getOrderDetails";
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

  const bindThickData = async () => {
  try {
    setLoading(true);
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(false);
    setSaveMsg("");

    setThickTable([]);
    setSelectedThickTable(null);

    // ---------------------------------------------------------
    // 1. Prepare Pipe No, Order No and Order Item values
    // ---------------------------------------------------------

    const hasPipeNo = Boolean(pipeno?.value);

    const orderNoValue = String(ordNo || "").trim();

    const orderItemValue =
      typeof ordItem === "string"
        ? ordItem.trim()
        : ordItem?.value
        ? String(ordItem.value).trim()
        : String(ordItem || "").trim();

    const hasOrderNo = Boolean(orderNoValue);
    const hasOrderItem = Boolean(orderItemValue);

    /*
     * NO_OF_REC from the selected Pipe No option.
     *
     * This relaxation applies only when:
     * 1. A Pipe No is selected.
     * 2. The selected Pipe No has NO_OF_REC > 0.
     *
     * If the user searches using Order No + Order Item,
     * this condition will always remain false.
     */
    const selectedPipeNoOfRec = Number(
      pipeno?.NO_OF_REC || 0
    );

    const isExistingSelectedPipe =
      hasPipeNo && selectedPipeNoOfRec > 0;

    const selectedDecision =
      selectedResult?.value ||
      selectedResult?.label ||
      (typeof selectedResult === "string"
        ? selectedResult.trim()
        : "");

    // ---------------------------------------------------------
    // 2. Validate Pipe No or Order No + Order Item selection
    // ---------------------------------------------------------

    if (!hasPipeNo && !hasOrderNo && !hasOrderItem) {
      alertify.error(
        "Please select Pipe No or enter both Order No and Order Item"
      );
      return;
    }

    if (!hasPipeNo && hasOrderNo !== hasOrderItem) {
      alertify.error(
        "Both Order No and Order Item are required"
      );
      return;
    }

    // ---------------------------------------------------------
    // 3. Apply validation based on selected Pipe NO_OF_REC
    // ---------------------------------------------------------

    if (isExistingSelectedPipe) {
      /*
       * PIPE NO SELECTED AND NO_OF_REC > 0
       *
       * Only Decision/Result,PROD DATE is mandatory.
       * Production dates, thickness values, process date,
       * inspector, remarks and coating status are not mandatory.
       */
      if (!selectedDecision) {
        alertify.error(
          "Decision is mandatory for the selected Pipe No."
        );
        return;
      }
    } else {
      /*
       * COMPLETE OLD VALIDATION APPLIES WHEN:
       *
       * 1. Pipe No is selected and NO_OF_REC = 0, or
       * 2. No Pipe No is selected and Order No + Order Item
       *    are entered.
       */

      const prodStartElem =
        document.getElementById("prodStartDate");

      const prodEndElem =
        document.getElementById("prodEndDate");

      const prodStartDateInput =
        prodStartElem?.value || "";

      const prodEndDateInput =
        prodEndElem?.value || "";

      const currentTime = new Date();

      const prodEndDateCheck = prodEndDateInput
        ? new Date(prodEndDateInput)
        : null;

      // End date cannot be greater than current date/time
      if (
        prodEndDateCheck &&
        prodEndDateCheck > currentTime
      ) {
        alertify.error(
          "The selected end date is greater than the current time."
        );
        return;
      }

      // Start date must be before end date
      if (
        prodStartDateInput &&
        prodEndDateInput &&
        new Date(prodStartDateInput) >=
          new Date(prodEndDateInput)
      ) {
        alertify.error(
          "Start time should be before end time"
        );
        return;
      }

      // Start date must be within 72 hours
      if (prodStartDateInput) {
        const hoursDifference =
          (currentTime - new Date(prodStartDateInput)) /
          (1000 * 60 * 60);

        if (hoursDifference > 72) {
          alertify.error(
            "Start date must be within 72 hours of the current time."
          );
          return;
        }
      }

      if (prodStartDateInput === "") {
        alertify.error("Please select Prod Start Dt");
        return;
      }

      if (prodEndDateInput === "") {
        alertify.error("Please select Prod End Dt");
        return;
      }

      /*
       * Complete old mandatory-field validation.
       * Quenching Temp and Test on Pipe remain optional.
       */
      if (
        !selectedDecision ||
        !inspectorname ||
        !coatthkw1 ||
        !coatthkw2 ||
        !coatthkw3 ||
        !coatthkw4 ||
        !coatthkw5 ||
        !coatthkw6 ||
        !coatthkb1 ||
        !coatthkb2 ||
        !coatthkb3 ||
        !coatthkb4 ||
        !coatthkb5 ||
        !coatthkb6 ||
        !remarks ||
        !coatingstatus
      ) {
        alertify.error(
          "All fields marked * are mandatory. Kindly fill."
        );
        return;
      }
    }

    // ---------------------------------------------------------
    // 4. Get authorization
    // ---------------------------------------------------------

    const token = await GetAuthorization();

    const defaultOptions = {
      headers: {
        Authorization: "Bearer " + token.accessToken,
      },
    };

    // ---------------------------------------------------------
    // 5. Format process date
    // ---------------------------------------------------------

    const formatDate = (dateString) => {
      if (!dateString) {
        return "";
      }

      const date = new Date(dateString);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

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

    /*
     * selectedProcessDt can be empty for an existing Pipe.
     */
    const processdt = selectedProcessDt
      ? formatDate(selectedProcessDt)
      : null;

    const formattedTime = new Date()
      .toTimeString()
      .split(" ")[0];

    // ---------------------------------------------------------
    // 6. Prepare getFillData request
    // ---------------------------------------------------------

    const requestData = {
      RM_BATCH: hasPipeNo
        ? rmBatchId?.value ||
          pipeno?.parentCoilNo ||
          ""
        : "",

      STATUS: "DC",

      PIPE_NO: hasPipeNo
        ? pipeno.value
        : "",

      ORDNO: hasPipeNo
        ? ""
        : orderNoValue,

      ORDITEM: hasPipeNo
        ? ""
        : orderItemValue,

      W1: coatthkw1 || "",
      W2: coatthkw2 || "",
      W3: coatthkw3 || "",
      W4: coatthkw4 || "",
      W5: coatthkw5 || "",
      W6: coatthkw6 || "",

      W7: coatthkb1 || "",
      W8: coatthkb2 || "",
      W9: coatthkb3 || "",
      W10: coatthkb4 || "",
      W11: coatthkb5 || "",
      W12: coatthkb6 || "",
    };

    // ---------------------------------------------------------
    // 7. Call getFillData API
    // ---------------------------------------------------------

    const response = await axiosAPI.post(
      "api/LD12S001/getFillData",
      requestData,
      defaultOptions
    );

    if (
      response.status !== 200 ||
      !Array.isArray(response.data)
    ) {
      throw new Error(
        "Invalid response from getFillData API"
      );
    }

    if (response.data.length === 0) {
      alertify.error("NO Data Found!");
      return;
    }

    // ---------------------------------------------------------
    // 8. Map getFillData response
    // ---------------------------------------------------------

    const thickData = response.data.map((row) => {
      /*
       * For Pipe No selection, use NO_OF_REC from getPipeNoList.
       *
       * For Order No + Order Item search, use the row-level
       * NO_OF_REC returned by getFillData only for mapping data.
       * It does not affect the mandatory validation above.
       */
      const rowNoOfRec = hasPipeNo
        ? Number(
            row.NO_OF_REC ?? selectedPipeNoOfRec ?? 0
          )
        : Number(row.NO_OF_REC || 0);

      const alreadyExists = rowNoOfRec > 0;

      const actualPipeWeight = Number(
        row.LOM_MS_PIECE_ACTL || 0
      );
      console.log(row.TBP_SAMPLE_10);
      return {
        C_PRC: nxtproc2 || "",
        N_PRC: row.NEXT_PROC || "",

        PIPE_NO: row.TBP_BATCH_NO || "",
        TBP_DIA_END_10:
          row.TBP_DIA_END_10 || "",

        /*
         * Existing record:
         * Use existing remarks if returned by API.
         *
         * New record:
         * Use screen-level remarks.
         */
        REMARKS: alreadyExists
          ? row.TBP_REMARKS_120 ??
            row.TBP_REMARKS ??
            remarks ??
            ""
          : remarks || "",

        COAT_WT: Number(row.COAT_WT || 0),

        THK_W1: alreadyExists
          ? row.TBP_COT_THK_1_120
          : coatthkw1,

        THK_W2: alreadyExists
          ? row.TBP_COT_THK_2_120
          : coatthkw2,

        THK_W3: alreadyExists
          ? row.TBP_COT_THK_3_120
          : coatthkw3,

        THK_W4: alreadyExists
          ? row.TBP_COT_THK_4_120
          : coatthkw4,

        THK_W5: alreadyExists
          ? row.TBP_COT_THK_5_120
          : coatthkw5,

        THK_W6: alreadyExists
          ? row.TBP_COT_THK_6_120
          : coatthkw6,

        THK_B1: alreadyExists
          ? row.TBP_COT_THK_7_120
          : coatthkb1,

        THK_B2: alreadyExists
          ? row.TBP_COT_THK_8_120
          : coatthkb2,

        THK_B3: alreadyExists
          ? row.TBP_COT_THK_9_120
          : coatthkb3,

        THK_B4: alreadyExists
          ? row.TBP_COT_THK_10_120
          : coatthkb4,

        THK_B5: alreadyExists
          ? row.TBP_COT_THK_11_120
          : coatthkb5,

        THK_B6: alreadyExists
          ? row.TBP_COT_THK_12_120
          : coatthkb6,

        LENGTH: row.TBP_PIPE_LNG_10 || 0,
        OD: row.TBP_PIPE_OD_10 || "0",
        THICK: row.TBP_PIPE_THK_10 || "0",
        DEPTH_MM: row.DEPTH_MM || "0",
        WIDTH_MM: row.WIDTH_MM || "0",
        GEO: row.GEO || "0",

        LOM_MS_PIECE_ACTL: actualPipeWeight,
        LOM_LENGTH: row.TBP_PIPE_LNG_10 || 0,

        PIPE_WEIGHT: Number(
          actualPipeWeight.toFixed(3)
        ),

        LAB_TEST: alreadyExists
          ? row.LAB_TEST ??
            row.TBP_LAB_TST_120 ??
            ""
          : "",

        FIELD_TEST: alreadyExists
          ? row.FIELD_TEST ??
            row.TBP_FLD_TEST_120 ??
            ""
          : "",

        TAG: alreadyExists
          ? row.TBP_SAMPLE_10 || "NO"
          : "NO",

        Q_TEMP: alreadyExists
          ? row.TBP_QTEMP_120 ?? ""
          : quetemp || "",

        COAT_STAS: alreadyExists
          ? row.TBP_COAT_STAS_120 ?? ""
          : coatingstatus || "",

        TEST_PIP: alreadyExists
          ? row.TBP_TEST_PIP_120 ?? ""
          : testonpipe || "",

        /*
         * Always use the newly selected decision.
         */
        RESULT: selectedDecision,

        HOLD_REASON: alreadyExists
          ? row.TBP_HOLD_RSN ?? ""
          : "",

        HEAT_NO: row.TBP_HEAT_NO || "",
        MATERIAL: row.TBP_NO_MATNR || "",

        PROD_DT: alreadyExists
          ? formatDate(row.TBP_PROD_DATE) 
          : SHIFT_DATE,

        TIME: alreadyExists
          ? row.TBP_TIME_120 ??
            row.TIME ??
            formattedTime
          : formattedTime,

        ORDER_NO: row.ORDER_NO || "",
        ITEM: row.ITEM || "",

        PARENT_BATCH:
          row.LOM_ID_PAR_COIL_NO ||
          rmBatchId?.value ||
          pipeno?.parentCoilNo ||
          "",

        CUST_NAME: row.CUST_NAME || "",
        PLAN_PROC: row.PLAN_PROC || "",
        ASL_NO: row.ASL_NO || "",

        NO_OF_REC: rowNoOfRec,
      };
    });

    setThickTable(thickData);
  } catch (error) {
    console.error("bindThickData error:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      String(error);

    alertify.error(
      "Error fetching data: " + errorMessage
    );
  } finally {
    setLoading(false);
  }
};
  const showErrorAlert = (errorMessage) => {
  const styleErrorDialog = () => {
    const dialog = document.querySelector(".alertify .ajs-dialog");
    const header = document.querySelector(".alertify .ajs-header");
    const body = document.querySelector(".alertify .ajs-body");
    const content = document.querySelector(".alertify .ajs-content");
    const footer = document.querySelector(".alertify .ajs-footer");
    const commands = document.querySelector(".alertify .ajs-commands");
    const closeBtn = document.querySelector(".alertify .ajs-close");
    const okBtn = document.querySelector(".alertify .ajs-ok");

    if (dialog) {
      dialog.style.padding = "0";
      dialog.style.borderRadius = "6px";
      dialog.style.overflow = "hidden";
      dialog.style.maxWidth = "560px";
      dialog.style.backgroundColor = "#fff";
    }

    if (header) {
      header.style.margin = "0";
      header.style.padding = "16px 24px";
      header.style.backgroundColor = "#dc3545";
      header.style.color = "#fff";
      header.style.fontSize = "18px";
      header.style.fontWeight = "bold";
    }

    if (commands) {
      commands.style.top = "18px";
      commands.style.right = "18px";
      commands.style.margin = "0";
      commands.style.zIndex = "10";
    }

    if (closeBtn) {
      closeBtn.style.filter = "brightness(0) invert(1)";
      closeBtn.style.opacity = "1";
    }

    if (body) {
      body.style.margin = "0";
      body.style.padding = "0";
      body.style.minHeight = "auto";
    }

    if (content) {
      content.style.padding = "24px";
      content.style.color = "#333";
      content.style.fontSize = "16px";
      content.style.fontWeight = "normal";
      content.style.lineHeight = "1.5";
      content.style.whiteSpace = "pre-wrap";
    }

    if (footer) {
      footer.style.margin = "0";
      footer.style.padding = "12px 20px 18px 20px";
      footer.style.backgroundColor = "#fff";
      footer.style.borderTop = "none";
    }

    if (okBtn) {
      okBtn.style.minWidth = "100px";
      okBtn.style.minHeight = "38px";
      okBtn.style.border = "1px solid #333";
      okBtn.style.backgroundColor = "#fff";
      okBtn.style.color = "#111";
      okBtn.style.fontSize = "15px";
      okBtn.style.fontWeight = "500";
      okBtn.style.borderRadius = "3px";
    }
  };

  alertify
    .alert()
    .set({
      title: "Error:",
      message: errorMessage,
      labels: {
        ok: "OK",
      },
      onshow: styleErrorDialog,
      onfocus: styleErrorDialog,
    })
    .show();
};
  const updateData = async (newToken = false) => {
  setShowSaveMsgSuccess(false);
  setShowSaveMsgError(false);
  setSaveMsg("");

  const token = await GetAuthorization();
  const defaultOptions = {
    headers: {
      Authorization: "Bearer " + token.accessToken,
    },
  };

  var selectedRows = selectedThickTable?.getSelectedRows();
  if (!selectedRows || selectedRows.length === 0) {
    var msg = "Please select rows";
    setShowSaveMsgSuccess(false);
    setShowSaveMsgError(true);
    setSaveMsg(msg);
    alertify.error(msg);
    return;
  }

  // Format date helper
  const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${d}-${m}-${y} ${h}:${min}`;
  };

  var prodStartDateVal = document.getElementById("prodStartDate").value;
  var prodEndDateVal = document.getElementById("prodEndDate").value;
  var startDate = new Date(prodStartDateVal);
  var endDate = new Date(prodEndDateVal);
  var prodstartdt = formatDate(startDate);
  var prodenddt = formatDate(endDate);

  // Create a map for fast lookup of original weights by Pipe_No
  const weightMap = getThickTable.reduce((acc, item) => {
    acc[item.PIPE_NO] = parseFloat(item.LOM_MS_PIECE_ACTL) || 0;
    return acc;
  }, {});

  var newData = [];
  let hasError = false; // Flag to stop processing if an error occurs

  for (const item of selectedRows) {
    if (hasError) break; // Stop if an error was found in a previous iteration

    const pipeNo = item._row.data.PIPE_NO; // Get pipeNo for error messages

    // --- Validation for PIPE_WEIGHT vs Original Weight ---
    const weight = item._row.data.PIPE_WEIGHT
      ? parseFloat(item._row.data.PIPE_WEIGHT)
      : 0;
    let batchOriginalWeight = weight; // Default to current weight if not in map

    // if (pipeNo in weightMap) {
    //   batchOriginalWeight = weightMap[pipeNo];
    //   if (weight > batchOriginalWeight) {
    //     var msg = `Weight for ${pipeNo} cannot be greater than batch Original weight (${batchOriginalWeight.toFixed(3)}).`;
    //     alertify.error(msg);
    //     setShowSaveMsgSuccess(false);
    //     setShowSaveMsgError(true);
    //     setSaveMsg(msg);
    //     hasError = true;
    //     continue;
    //   }
    // }

    // --- Validation for Result ---
    const resultValue = item._row.data.RESULT;
    if (!resultValue || String(resultValue).trim() === "") {
      var msg = `Result cannot be empty for Pipe No: ${pipeNo}.`;
      alertify.error(msg);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(true);
      setSaveMsg(msg);
      hasError = true;
      continue;
    }

    // --- Validation for Hold Reason (if Result is HOLD) ---
    if (resultValue === "HOLD") {
      const holdReason = item._row.data.HOLD_REASON;
      if (!holdReason || String(holdReason).trim() === "") {
        var msg = `Hold Reason cannot be empty for Pipe No: ${pipeNo} when Result is HOLD.`;
        alertify.error(msg);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(msg);
        hasError = true;
        continue;
      }
    }

    // --- Validation for Parent Batch (PAR_COIL_NO) ---
    const parentBatchValue =
      item._row.data.PARENT_BATCH || rmBatchId?.value || "";
    if (!parentBatchValue || String(parentBatchValue).trim() === "") {
      var msg = `Parent Batch cannot be empty for Pipe No: ${pipeNo}.`;
      alertify.error(msg);
      setShowSaveMsgSuccess(false);
      setShowSaveMsgError(true);
      setSaveMsg(msg);
      hasError = true;
      continue;
    }
    console.log(formatDate(new Date()));
    // --- Calculate BATCH_SCRAP_WEIGHT ---
    const batchScrapWeight = batchOriginalWeight - weight;

    // --- Build Data Object ---
    newData.push({
      PLANT: "0780",
      BATCH_NO: pipeNo ?? null,
      CD_PROC: item._row.data.C_PRC ?? null,
      BATCH_PROC_NO: 0,
      NEXT_PROC: item._row.data.N_PRC ?? null,
      PROD_DATE: item._row.data.PROD_DT,
      SHIFT: selectedShift?.value ?? null,
      // Send only metal weight (PIPE_WEIGHT). Backend will compute total weight when inserting.
      WEIGHT: Number(weight || 0),
      BATCH_SCRAP_WEIGHT: batchScrapWeight,
      STATUS: "DC",
      PAR_COIL_NO: parentBatchValue ?? null,
      ID_FIRST_PAR: null,
      ID_ORDER_NO: item._row.data.ORDER_NO ?? null,
      ITEM_NO: item._row.data.ITEM ?? null,
      QUALITY_CD: null,
      MATNR: item._row.data.MATERIAL ?? null,
      FLAG: null,
      START_DT: item._row.data.NO_OF_REC==0?prodstartdt:formatDate(new Date()),
      END_DT: item._row.data.NO_OF_REC==0?prodenddt:formatDate(new Date()),
      RESULT: resultValue ?? null,
      REMARK: item._row.data.REMARKS ?? null,
      HEAT_NO: item._row.data.HEAT_NO ?? null,
      INSP_NAME: inspectorname ?? null,
      PIPE_LNG_10: item._row.data.LENGTH ?? null,
      COT_THK_1: item._row.data.THK_W1 ?? null,
      COT_THK_2: item._row.data.THK_W2 ?? null,
      COT_THK_3: item._row.data.THK_W3 ?? null,
      COT_THK_4: item._row.data.THK_W4 ?? null,
      COT_THK_5: item._row.data.THK_W5 ?? null,
      COT_THK_6: item._row.data.THK_W6 ?? null,
      COT_THK_7: item._row.data.THK_B1 ?? null,
      COT_THK_8: item._row.data.THK_B2 ?? null,
      COT_THK_9: item._row.data.THK_B3 ?? null,
      COT_THK_10: item._row.data.THK_B4 ?? null,
      COT_THK_11: item._row.data.THK_B5 ?? null,
      COT_THK_12: item._row.data.THK_B6 ?? null,
      COT_WT_VS: Number(item._row.data.COAT_WT ?? 0),
      COAT_STAS: item._row.data.COAT_STAS ?? null,
      TEST_PIP: item._row.data.TEST_PIP ?? null,
      LAB_TST: item._row.data.LAB_TEST ?? null,
      FLD_TEST: item._row.data.FIELD_TEST ?? null,
      TAG: item._row.data.TAG ?? null,
      HOLD_RSN: item._row.data.HOLD_REASON ?? null,
      TBP_QTEMP_120: item._row.data.Q_TEMP ?? null,
      LENGTH: item._row.data.LENGTH ?? null,
      PIPE_WEIGHT: Number(weight || 0),
    });
  }

  if (hasError) {
    // If an error occurred during iteration, stop here
    setLoading(false);
    return;
  }

  setLoading(true);
  let data = {
    selectedRowsData: newData,
  };
  var url = "api/LD12S001/insertTempData";

  axiosAPI
    .post(url, data, defaultOptions)
    .then((response) => {
      if (response.statusText !== "" && response.statusText !== "OK") {
        console.log(response?.error?.response?.data?.message);
        alertify.error(response?.error?.response?.data?.message);
        setShowSaveMsgSuccess(false);
        setShowSaveMsgError(true);
        setSaveMsg(response?.error?.response?.data?.message || "An error occurred.");
      } else {
        if (response.data?.failedCount > 0 || !response.data?.successCount) {
          if(response.data?.successCount > 0){
            setThickTable([]);
            setSelectedThickTable(null);
          }
          showErrorAlert(response.data?.message);
          setShowSaveMsgSuccess(false);
          setShowSaveMsgError(true);
          setSaveMsg(response.data?.message);
        } else {
          const successMessage = `Successfully saved ${response.data.successCount} pipe(s).`;
          alertify.success(successMessage);
          setSelectedThickTable(null);
          setThickTable([]);
          handleClearAll();
          handleClearMain();
          fetchDetails();
          // Clear handlers reset banners, so set the save outcome afterwards.
          setShowSaveMsgSuccess(true);
          setShowSaveMsgError(false);
          setSaveMsg(`${successMessage} ${response.data.message || ""}`);
        }
      }
    })
    .catch((error) => {
      console.error("Error during update:", error);
      const errMsg = error?.response?.data?.message || "Failed to update data.";
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

  // const handleLabTestChange = (value) => {
  //   setSelectedLabTest(value);
  // };
  // const handleFieldTestChange = (value) => {
  //   setSelectedFieldTest(value);
  // };

  const clearFilterOnDate = () => {
    setThickTable([]);
    setSelectedThickTable(null);
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

  const LabTestType = [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" },
  ];

  const FieldTestType = [
    { label: "YES", value: "YES" },
    { label: "NO", value: "NO" },
  ];

  const ThickColumns = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
      width: 50
    },
    {
      title: "Seq No",  
      field: "TBP_DIA_END_10",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      title: "Pipe No",
      field: "PIPE_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    {
      title: "ASL NO",
      field: "ASL_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
    },
    
    {
      title: "Result",
      field: "RESULT",
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
      //defaultValue: "ok",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      title: "Remarks",
      field: "REMARKS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
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
        const resultValue = cell.getRow().getData().RESULT;
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
      title: "Pipe Wt(Kg)",
      field: "LOM_MS_PIECE_ACTL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value;
      },
    },
    {
      title: "Length",
      field: "LOM_LENGTH",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      cell.getElement().style["background-color"] = "#DA8EE7";
      cell.getElement().style["color"] = "#FFFFFF";
      return value;
    },
    // Only editable when Result = OK
    editable: function (cell) {
      const resultValue = cell.getRow().getData().RESULT;
      return String(resultValue || "").toUpperCase() === "OK";
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
      let PIPE_ID = cell?.getData()?.PIPE_NO;

      // Recompute metal weight first
      let pipeWtVal = await calculatePipeWt(
        PIPE_ID,
        length,
        odia,
        thick,
        width,
        depth,
        geo
      );

      // Update metal weight in the row
      row.update({
        PIPE_WEIGHT: pipeWtVal,
      });

      // Now recompute coat weight using current THK values
      try {
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = length;
        var OD = odia;

        var coatWt = await getCoatWt(
          null,
          W1,
          W2,
          W3,
          W4,
          W5,
          W6,
          W7,
          W8,
          W9,
          W10,
          W11,
          W12,
          LENGTH,
          OD
        );

        // Ensure numeric
        coatWt = coatWt ? Number(coatWt) : 0;

        // Update coat weight in the row
        row.update({ COAT_WT: coatWt });

        // NOTE: saved WEIGHT will be computed at save-time as metal + coat
      } catch (error) {
        console.error(error);
      }

      return value;
    },
  },
        {
          field: "PIPE_WEIGHT",
          title: "New Pipe Weight(KG)",
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
    title: "TAG",
    field: "TAG",
    headerFilterPlaceholder: "search...",
    headerFilter: "input",
    editor: "select",
    editable: isRowEditable,
    editorParams: {
      values: {
        YES: "YES",
        NO: "NO",
      },
    },
    formatter: function (cell, formatterParams) {
      var value = cell.getValue();
      cell.getElement().style["background-color"] = "#FFE5B4";
      cell.getElement().style["color"] = "#000000";
      return value;
    },
    cellEdited: function(cell) {
      const tagValue = cell.getValue();
      const row = cell.getRow();
      
      // If TAG is changed to NO, clear LAB_TEST and FIELD_TEST
      if (tagValue === "NO" || tagValue === "N" || !isRowEditable(cell)) {
        row.update({
          LAB_TEST: "",
          FIELD_TEST: ""
        });
      }
    }
  },
  {
  title: "Lab Test",
  field: "LAB_TEST",
  headerFilterPlaceholder: "search...",
  headerFilter: "input",
  width: 220,
  editor: simpleCheckboxMultiSelectEditor,
  editorParams: {
    values: labTestOptions,
  },
  editable: function (cell) {
    const tagValue = cell.getRow().getData().TAG;
    // console.log(tagValue === "YES" &&  isRowEditable);
    // console.log(tagValue,isRowEditable);
    return tagValue === "YES" &&  isRowEditable(cell);
  },
  cellClick: function (e, cell) {
    const tagValue = cell.getRow().getData().TAG;
    if (tagValue === "YES" &&  isRowEditable(cell)) {
      cell.edit();
    }
  },
  formatter: function (cell) {
    const value = cell.getValue();
    const tagValue = cell.getRow().getData().TAG;

    if (tagValue === "NO" ||  !isRowEditable(cell) || tagValue === "N") {
      cell.getElement().style.backgroundColor = "#E0E0E0";
      cell.getElement().style.color = "#999999";
      return "N/A";
    }

    cell.getElement().style.backgroundColor = "#B4E5FF";
    cell.getElement().style.color = "#000000";

    return formatMultiSelectLabels(value, labTestOptions, tagValue);
  },
},
{
  title: "Field Test",
  field: "FIELD_TEST",
  headerFilterPlaceholder: "search...",
  headerFilter: "input",
  width: 220,
  editor: simpleCheckboxMultiSelectEditor,
  editorParams: {
    values: fieldTestOptions,
  },
  editable: function (cell) {
    const tagValue = cell.getRow().getData().TAG;
    return tagValue === "YES" &&  isRowEditable(cell);
  },
  cellClick: function (e, cell) {
    const tagValue = cell.getRow().getData().TAG;
    if (tagValue === "YES" &&  isRowEditable(cell)) {
      cell.edit();
    }
  },
  formatter: function (cell) {
    const value = cell.getValue();
    const tagValue = cell.getRow().getData().TAG;

    if (tagValue === "NO" ||   !isRowEditable(cell) || tagValue === "N") {
      cell.getElement().style.backgroundColor = "#E0E0E0";
      cell.getElement().style.color = "#999999";
      return "N/A";
    }

    cell.getElement().style.backgroundColor = "#B4E5FF";
    cell.getElement().style.color = "#000000";

    return formatMultiSelectLabels(value, fieldTestOptions, tagValue);
  },
},
  {
      title: "Coat WT(MTS)",
      field: "COAT_WT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: false,
      editable: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#F2F2F2";
        cell.getElement().style["color"] = "#000000";
        return value;
      },
    },
    {
      title: "THK W1",
      field: "THK_W1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();

        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },

    {
      title: "THK W2",
      field: "THK_W2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK W3",
      field: "THK_W3",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK W4",
      field: "THK_W4",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK W5",
      field: "THK_W5",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK W6",
      field: "THK_W6",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK B1",
      field: "THK_B1",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK B2",
      field: "THK_B2",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK B3",
      field: "THK_B3",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK B4",
      field: "THK_B4",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK B5",
      field: "THK_B5",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
    },
    {
      title: "THK B6",
      field: "THK_B6",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      editor: "input",
      editable: isRowEditable,
formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
      cellEdited: async (cell, accessToken) => {
        var row = cell.getRow();
        var W1 = row.getData().THK_W1;
        var W2 = row.getData().THK_W2;
        var W3 = row.getData().THK_W3;
        var W4 = row.getData().THK_W4;
        var W5 = row.getData().THK_W5;
        var W6 = row.getData().THK_W6;
        var W7 = row.getData().THK_B1;
        var W8 = row.getData().THK_B2;
        var W9 = row.getData().THK_B3;
        var W10 = row.getData().THK_B4;
        var W11 = row.getData().THK_B5;
        var W12 = row.getData().THK_B6;
        var LENGTH = row.getData().LENGTH;
        var OD = row.getData().OD;
        console.log("length", LENGTH);
        console.log("OD", OD);
        try {
          var coatWt = await getCoatWt(
            accessToken,
            W1,
            W2,
            W3,
            W4,
            W5,
            W6,
            W7,
            W8,
            W9,
            W10,
            W11,
            W12,
            LENGTH,
            OD
          );

          console.log("coatWt", coatWt);
          row.update({ COAT_WT: coatWt });
        } catch (error) {
          console.error(error);
        }
      },
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
      field: "C_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Next Proc",
      field: "N_PRC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Planned Proc",
      field: "PLAN_PROC",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "OD",
      field: "OD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      visible:false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
    },
    // {
    //   title: "Tag Flag",
    //   field: "TAG",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   title: "Lab Test",
    //   field: "LAB_TEST",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   editable: true,
    //   editor: "select",
    //   editorParams: {
    //     values: {
    //       YES: "YES",
    //       NO: "NO",
    //     },
    //   },
    // },

    // {
    //   title: "Field Test",
    //   field: "FIELD_TEST",
    //   headerFilterPlaceholder: "search...",
    //   headerFilter: "input",
    //   editable: true,
    //   width: 200,
    //   editor: "select",
    //   editorParams: {
    //     values: {
    //       YES: "YES",
    //       NO: "NO",
    //     },
    //   },
    // },
    {
      title: "Q Temp",
      field: "Q_TEMP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: isRowEditable,
    },
    {
      title: "Coat Stats",
      field: "COAT_STAS",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: isRowEditable,
    },
    {
      title: "Test on Pipe",
      field: "TEST_PIP",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      editable: isRowEditable,
    },
    {
      title: "Heat No",
      field: "HEAT_NO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // editor: "input",
    },
    {
      title: "Material",
      field: "MATERIAL",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Prod Dt",
      field: "PROD_DT",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Time",
      field: "TIME",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Odia",
      field: "OD",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        // cell.getElement().style["background-color"] = "#DA8EE7";
        // cell.getElement().style["color"] = "#FFFFFF";
        if (
value === null ||
value === undefined ||
value === ""
) {
return "";
}
 
const num = Number(value);
 
return isNaN(num) ? value : num.toFixed(2);
      },
    },
    {
      title: "Thick",
      field: "THICK",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Depth(mm)",
      field: "DEPTH_MM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Width(mm)",
      field: "WIDTH_MM",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Geometry",
      field: "GEO",
      headerFilterPlaceholder: "search...",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const downloadExcelThickTableData = () => {
    console.log("Downloading");
    if (selectedThickTable == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = selectedThickTable.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }
    var date = new Date();
    var fileName = "LD12S001" + ".xlsx";

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
        page="Thickness stage inspection(120)"
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
                          Screen required for entry
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

                            //console.log(oracleDate);
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
                          Entry of Thickness stage Inspect
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
                            Coat THK W1*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkw1"
                            value={coatthkw1}
                            onChange={(e) => {
                              setCoatTHKW1(e.target.value), setTableNull();
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
                            Coat THK W2*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkw2"
                            value={coatthkw2}
                            onChange={(e) => {
                              setCoatTHKW2(e.target.value), setTableNull();
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
                            Coat THK W3*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkw3"
                            value={coatthkw3}
                            onChange={(e) => {
                              setCoatTHKW3(e.target.value); setTableNull();
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
                            Coat THK W4*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkw4"
                            value={coatthkw4}
                            onChange={(e) => {
                              setCoatTHKW4(e.target.value), setTableNull();
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
                            Coat THK W5*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkw5"
                            value={coatthkw5}
                            onChange={(e) => {
                              setCoatTHKW5(e.target.value), setTableNull();
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
                            Coat THK W6*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkw6"
                            value={coatthkw6}
                            onChange={(e) => {
                              setCoatTHKW6(e.target.value), setTableNull();
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
                            Coat THK B1*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkb1"
                            value={coatthkb1}
                            onChange={(e) => {
                              setCoatTHKB1(e.target.value), setTableNull();
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
                            Coat THK B2*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkb2"
                            value={coatthkb2}
                            onChange={(e) => {
                              setCoatTHKB2(e.target.value), setTableNull();
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
                            Coat THK B3*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkb3"
                            value={coatthkb3}
                            onChange={(e) => {
                              setCoatTHKB3(e.target.value), setTableNull();
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
                            Coat THK B4*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkb4"
                            value={coatthkb4}
                            onChange={(e) => {
                              setCoatTHKB4(e.target.value), setTableNull();
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
                            Coat THK B5*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkb5"
                            value={coatthkb5}
                            onChange={(e) => {
                              setCoatTHKB5(e.target.value), setTableNull();
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
                            Coat THK B6*
                          
</MDTypography>
                          <MDInput
                            label=""
                            name="coatthkb6"
                            value={coatthkb6}
                            onChange={(e) => {
                              setCoatTHKB6(e.target.value), setTableNull();
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
                            {" "}
                            Date of process*{" "}
                          </MDTypography>
                          <DatePicker
                            id="prcdt"
                            value={selectedProcessDt}
                            onChange={(date) => {
                              setSelectedProcessDt(date), setTableNull();
                            }}
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

                        {/* <Grid item xs={1.5}>
                          <MDTypography
                            fontWeight="regular"
                            fontSize="small"
                            textTransform="capitalize"
                            variant="h6"
                            color={"dark"}
                            noWrap
                          >
                            Lab Test*
                          </MDTypography>
                          <ReactSelect
                            options={LabTestType}
                            onChange={(e) => {
                              handleLabTestChange(e);
                              setTableNull();
                            }}
                            value={selectedLabTest}
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
                            Field Test*
                          </MDTypography>
                          <ReactSelect
                            options={FieldTestType}
                            onChange={(e) => {
                              handleFieldTestChange(e);
                              setTableNull();
                            }}
                            value={selectedFieldTest}
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
                            Remarks*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="remarks"
                            style={{ backgroundColor: "#dac292" }}
                            value={remarks}
                            onChange={(e) => {
                              setRemarks(e.target.value), setTableNull();
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
                            Inspector Name*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="inspectorname"
                            style={{ backgroundColor: "#dac292" }}
                            value={inspectorname}
                            onChange={(e) => {
                              setInspectorName(e.target.value), setTableNull();
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
                            Coating status*
                          </MDTypography>
                          <MDInput
                            label=""
                            name="coatingstatus"
                            style={{ backgroundColor: "#dac292" }}
                            value={coatingstatus}
                            onChange={(e) => {
                              setCoatingStatus(e.target.value), setTableNull();
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
                            Test on Pipe
                          </MDTypography>
                          <MDInput
                            label=""
                            name="testonpipe"
                            style={{ backgroundColor: "#dac292" }}
                            value={testonpipe}
                            onChange={(e) => {
                              setTestOnPipe(e.target.value), setTableNull();
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
                            Quenching Temp
                          </MDTypography>
                          <MDInput
                            label=""
                            name="quetemp"
                            sx={{ "& input": {textAlign: "right",},}}
                            value={quetemp}
                            onChange={(e) => {
                              setQueTemp(e.target.value), setTableNull();
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
                         <Grid item xs={6}>
                                                <MDBox
                                                  sx={{
                                                    mt: "1.55rem",
                                                    px: 1,
                                                    py: 0.5,
                                                    border: "1px solid #ddd",
                                                    borderRadius: "5px",
                                                    backgroundColor: "#fafafa",
                                                    fontSize: "10.5px",
                                                    lineHeight: 1.2,
                                                    display: "flex",
                                                    gap: 1,
                                                    flexWrap: "wrap",
                                                    alignItems: "center",
                                                  }}
                                                >
                                                  <Box component="span">
                                                    <Box
                                                      component="span"
                                                      sx={{
                                                        display: "inline-block",
                                                        width: 12,
                                                        height: 12,
                                                        backgroundColor: "#dac292",
                                                        border: "1px solid #b8a174",
                                                        mr: 0.5,
                                                        verticalAlign: "middle",
                                                      }}
                                                    />
                                                    Text field
                                                  </Box>
                        
                                                  <Box component="span">
                                                    <Box
                                                      component="span"
                                                      sx={{
                                                        display: "inline-block",
                                                        width: 12,
                                                        height: 12,
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #bfc3c7",
                                                        mr: 0.5,
                                                        verticalAlign: "middle",
                                                      }}
                                                    />
                                                    Numeric field
                                                  </Box>
                        
                                                  
                        
                                                  <Box component="span">
                                                    <Box
                                                      component="span"
                                                      sx={{
                                                        // color: "red",
                                                        fontWeight: "bold",
                                                      }}
                                                    >
                                                      *
                                                    </Box>{" "}
                                                    Mandatory
                                                  </Box>
                                                  <Box component="span">
                                                    <Box
                                                      component="span"
                                                      sx={{
                                                        display: "inline-block",
                                                        width: 12,
                                                        height: 12,
                                                        backgroundColor: "#FFE5E5",
                                                        border: "1px solid #bfc3c7",
                                                        mr: 0.5,
                                                        verticalAlign: "middle",
                                                      }}
                                                    />
                                                    Rows in below table cannot be edit(RW-120)
                                                  </Box>
                                                </MDBox>
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
                          Thickness stage Data
                        </MDTypography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                      <Grid item xs={1}>
                        <Tooltip title="Update">
                          <IconButton
                            color="white"
                            onClick={() => updateData()}
                          >
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
                          <div id="ThickTableContainer" />
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
