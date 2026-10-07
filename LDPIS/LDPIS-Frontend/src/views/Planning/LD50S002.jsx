import React, { useEffect, useState, useRef } from "react";
import TableContainer from "../../components/tableContainer";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "../../alertify.css";
import alertify from "alertifyjs";
import { Grid, Tooltip, IconButton, Box } from "@mui/material";
import serverDetails from "../../variables/serverDetails";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import { ClearAll, ContentCopy } from "@mui/icons-material";
import { GetAuthorization } from "../../utils";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css";
import Loader from "../../components/Preloader/Preloader";
import { useMaterialUIController } from "../../context";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import MDBox from "components/MDBox";
import axiosAPI from "../../axiosAPI";
import jwt from "jsonwebtoken";
import MDButton from "components/MDButton";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";

export const LD50S002 = () => {
  const [controller] = useMaterialUIController();
  const { pageData } = controller;

  const [loading, setLoading] = useState(false);
  const [plantId, setPlantId] = useState("");
  const [tabledata1, setTableData1] = useState([]);
  const [tabledata2, setTableData2] = useState([]);
  const [tabledataDim, setTableDataDim] = useState([]);
  const [plantIds, setPlantIds] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [tdcList, setTdcList] = useState([]);
  const [holdrsn, setHoldrsn] = useState([]);
  const [isRestricted, setRestricted] = useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [saveBtnFlag, setSaveBtnFlag] = useState(true);

  // DOM container refs
  const table1Ref = useRef(null);
  const table2Ref = useRef(null);
  const tableDimRef = useRef(null);

  // Tabulator instance refs
  const table1Instance = useRef(null);
  const table2Instance = useRef(null);
  const tableDimInstance = useRef(null);

  // Component mounted ref to prevent memory leaks / unmounted state updates
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const validateUser = async (accessToken, refreshToken) => {
    try {
      let plant = "";
      let userDetails;
      try {
        userDetails = jwt.verify(
          localStorage.getItem("tmm_refreshToken"),
          serverDetails.REFRESH_KEY
        );
      } catch (err) {
        console.error("Token verification failed:", err);
        throw new Error("Invalid token");
      }

      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;

      if (!serverDetails.PersonalNo) {
        window.location.href = "#/signin";
        return;
      }

      const userId = serverDetails.PersonalNo;
      const pageName = "LD50S002";

      const authDetails = await getScreenAuth(plant, userId, pageName, accessToken);

      if (!isMounted.current) return;

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
    } catch (error) {
      if (isMounted.current) {
        setRestricted(true);
        setAdmin(false);
      }
      if (serverDetails.devMode === false) {
        window.location.href = "#/signin";
      }
    }

    if (serverDetails.devMode === true && isMounted.current) {
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
            if (authDetails) {
              resolve(authDetails);
            } else {
              reject(null);
            }
          }
        })
        .catch(() => reject(null));
    });

  const loadData = () => {
    if (serverDetails.devMode && isMounted.current) {
      setRestricted(false);
    }
    GetAuthorization().then(async (data) => {
      if (!isMounted.current) return;
      await validateUser(data.accessToken, data.refreshToken);
      await LD50S002ConfirmApiCall("onLoad");
      const defaultPlantId = "0780";
      await LD50S002ConfirmApiCall("data", defaultPlantId);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatPlantId = (data) => {
    if (data?.length > 0) {
      const options = data.map((row, index) => ({
        key: index,
        value: row["CD_VALUE"],
        label: `row["CDVALUE"] - {row["CD_DESC"]}`,
      }));
      options.push({
        key: options.length,
        value: "ALL",
        label: "All",
      });
      if (isMounted.current) setPlantIds(options);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getTdcList = async () => {
    LD50S002ConfirmApiCall("getTdcList", undefined, []);
  };

  const getHoldrsn = async () => {
    LD50S002ConfirmApiCall("getHoldrsn", undefined, []);
  };

  // Column definitions
  const column1 = [
    {
      formatter: "rowSelection",
      hozAlign: "center",
      headerSort: false,
    },
    {
      field: "EIC_ID_COIL",
      title: "Batch Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "EIC_CD_STATUS",
      title: "Status",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_NO_CAST",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      title: "Decision",
      field: "DECISION",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "list",
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        values: [
          { label: "PASS", value: "PASS" },
          { label: "DOWNGRADE", value: "DOWNGRADE" },
          { label: "RETURN", value: "RETURN" },
          { label: "HOLD", value: "HOLD" },
        ],
      },
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: function (cell) {
        const row = cell.getRow();
        const decision = cell.getValue();

        row.update({
          TDC_LIST: "",
          HOLD_RSN: "",
          REMARKS: "",
        });

        if (decision === "DOWNGRADE") {
          getTdcList();
        } else if (decision === "HOLD") {
          getHoldrsn();
        }

        if (decision === "HOLD" || decision === "RETURN") {
          setSaveBtnFlag(false);
        } else {
          setSaveBtnFlag(true);
        }

        const tdcCell = row.getCell("TDC_LIST");
        if (tdcCell) {
          tdcCell.getElement().innerHTML = tdcCell.getValue() || "";
          tdcCell.getElement().style["background-color"] =
            decision === "DOWNGRADE" ? "#DA8EE7" : "white";
          tdcCell.getElement().style["color"] =
            decision === "DOWNGRADE" ? "#FFFFFF" : "black";
        }

        const holdCell = row.getCell("HOLD_RSN");
        if (holdCell) {
          holdCell.getElement().innerHTML = holdCell.getValue() || "";
          holdCell.getElement().style["background-color"] =
            decision === "HOLD" ? "#DA8EE7" : "white";
          holdCell.getElement().style["color"] =
            decision === "HOLD" ? "#FFFFFF" : "black";
        }
      },
    },
    {
      title: "Tdc Downgrade",
      field: "TDC_LIST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: function (cell, onRendered, success) {
        const decision = cell.getRow().getData().DECISION;
        if (decision !== "DOWNGRADE") {
          const editor = document.createElement("input");
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

        const editor1 = document.createElement("select");
        tdcList.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.value;
          option.text = item.key;
          editor1.appendChild(option);
        });

        editor1.value = cell.getValue() || "";
        editor1.style.padding = "3px";
        editor1.style.width = "100%";
        onRendered(() => editor1.focus());
        editor1.addEventListener("change", function () {
          success(editor1.value);
          const row = cell.getRow();
          row.update({ REMARKS: "" });
        });
        return editor1;
      },
      formatter: function (cell) {
        const value = cell.getValue();
        const decision = cell.getRow().getData().DECISION;
        if (decision === "DOWNGRADE") {
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
      title: "Hold Reason",
      field: "HOLD_RSN",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: function (cell, onRendered, success) {
        const decision = cell.getRow().getData().DECISION;
        if (decision !== "HOLD") {
          const editor = document.createElement("input");
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

        const editor1 = document.createElement("select");
        holdrsn.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.key;
          option.text = item.value;
          editor1.appendChild(option);
        });

        editor1.value = cell.getValue() || "";
        editor1.style.padding = "3px";
        editor1.style.width = "100%";
        onRendered(() => editor1.focus());
        editor1.addEventListener("change", function () {
          success(editor1.value);
          const row = cell.getRow();
          row.update({ REMARKS: "" });
        });
        return editor1;
      },
      formatter: function (cell) {
        const value = cell.getValue();
        const decision = cell.getRow().getData().DECISION;
        if (decision === "HOLD") {
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
      field: "REMARKS",
      title: "Remarks",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
    },
    {
      field: "EIC_CD_PROD",
      title: "Prod",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_CD_QLTY_ACTL",
      title: "Quality",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_SEC1",
      title: "Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell) {
        const value = cell?.getValue();
        return value !== null && value !== undefined && typeof value === "number"
          ? value.toFixed(3)
          : value;
      },
    },
    {
      field: "EIC_SEC2",
      title: "Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell) {
        const value = cell?.getValue();
        return value !== null && value !== undefined && typeof value === "number"
          ? value.toFixed(3)
          : value;
      },
    },
    {
      field: "EIC_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell) {
        const value = cell?.getValue();
        return value !== null && value !== undefined && typeof value === "number"
          ? value.toFixed(3)
          : value;
      },
    },
    {
      field: "EIC_TDC_ACTL",
      title: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_MS_PIECE_ACTL",
      title: "Net Weight(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell) {
        const value = cell.getValue();
        return value !== null && value !== undefined && !isNaN(Number(value))
          ? Number(value).toFixed(3)
          : value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "RESIDUAL_WEIGHT",
      title: "Residual Wt(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      visible: false,
      formatter: function (cell) {
        const value = cell.getValue();
        return value !== null && value !== undefined && !isNaN(Number(value))
          ? Number(value).toFixed(3)
          : value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "MS_SCRAP",
      title: "Scrap Wt(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      visible: false,
      formatter: function (cell) {
        const value = cell.getValue();
        return value !== null && value !== undefined && !isNaN(Number(value))
          ? Number(value).toFixed(3)
          : value;
      },
      bottomCalc: "sum",
      bottomCalcParams: { precision: 3 },
    },
    {
      field: "VEHICAL_NO",
      title: "Vehicle No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_NO_MATNR",
      title: "Material Number",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
    },
    {
      field: "EIC_DT_LOADING",
      title: "Arrival Date",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EPA_AGE",
      title: "Age at Plant",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_ID_OP_DECSN",
      title: "Operator",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_MARK_CUST",
      title: "Mark Customer Code",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_MK_CUSTOMER",
      title: "Mark Customer",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_CD_PLANT",
      title: "Plant Code",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_WO_NO",
      title: "Mill order",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_ITEM_NO",
      title: "Item",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_CD_EDGE",
      title: "Edge",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
  ];

  const column2 = [
    {
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
      title: "",
      headerWordWrap: true,
    },
    {
      field: "BatchId",
      title: "Batch Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      headerWordWrap: true,
    },
    {
      field: "CastNo",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      headerWordWrap: true,
    },
    {
      field: "PROP",
      title: "Property",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      headerWordWrap: true,
    },
    {
      field: "TEST_CD",
      title: "Test Code",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      headerWordWrap: true,
    },
    {
      field: "TEST_PARA",
      title: "Test Para",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      headerWordWrap: true,
    },
    {
      field: "PARA_VAL",
      title: "Source Val",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      formatter: function (cell) {
        const value = cell.getValue();
        return value !== null && value !== undefined && typeof value === "number"
          ? value.toFixed(3)
          : value;
      },
      headerWordWrap: true,
    },
    {
      field: "PARA_MIN",
      title: "Para Min",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
    },
    {
      field: "PARA_MAX",
      title: "Para Max",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      formatter: function (cell) {
        const value = cell.getValue();
        return value !== null && value !== undefined && typeof value === "number"
          ? value.toFixed(3)
          : value;
      },
      headerWordWrap: true,
    },
    {
      field: "PARA_UNIT",
      title: "Para Unit",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      headerWordWrap: true,
    },
    {
      field: "TEST_PARA_VAL_COIL_SEQ",
      title: "PARA_SEQ",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      headerWordWrap: true,
    },
    {
      field: "TEST_PARA_VAL_COIL",
      title: "Existing Data for this Coil",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell) {
        const rowData = cell.getRow().getData();
        const paraMin = rowData?.PARA_MIN;
        const paraMax = rowData?.PARA_MAX;
        const value = cell.getValue();

        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFF";

        if (paraMin !== null && paraMin !== undefined && value < paraMin) {
          cell.getElement().style["background-color"] = "red";
        }
        if (paraMax !== null && paraMax !== undefined && value > paraMax) {
          cell.getElement().style["background-color"] = "red";
        }
        if ((paraMin === null || paraMin === undefined) && value < 0) {
          cell.getElement().style["background-color"] = "red";
        }

        return value !== null && value !== undefined && !isNaN(parseFloat(value))
          ? parseFloat(value).toFixed(3)
          : value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
      },
      cellEdited: (cell) => {
        const rowData = cell.getRow().getData();
        const paraMin = rowData?.PARA_MIN;
        const paraMax = rowData?.PARA_MAX;
        const value = cell.getValue();
        const cellVal = parseFloat(value);

        if (!isNaN(cellVal)) {
          const rowElement = cell.getRow().getElement();
          if (
            (paraMin !== null && paraMin !== undefined && cellVal < paraMin) ||
            (paraMax !== null && paraMax !== undefined && cellVal > paraMax)
          ) {
            rowElement.style["background-color"] = "yellow";
          } else {
            rowElement.style["background-color"] = "";
          }
          cell.setValue(cellVal);
        } else {
          cell.setValue(0);
        }
      },
      headerWordWrap: true,
    },
    {
      field: "TEST_PARA_VAL_CAST",
      title: "Existing Data for this Cast",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      headerWordWrap: true,
      formatter: function (cell) {
        const value = cell?.getValue();
        return value !== null && value !== undefined && typeof value === "number"
          ? value.toFixed(3)
          : value;
      },
    },
  ];

  const columnDim = [
    {
      field: "INP_CD_EPA",
      title: "Plant",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
    },
    {
      field: "INP_ID_BATCH",
      title: "Batch Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "INP_SEQ_NO",
      title: "Seq No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
    },
    {
      field: "INP_CD_STATUS",
      title: "Status",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
    },
    {
      field: "INP_WIDTH_TOP",
      title: "WIDTH_TOP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: { allowEmpty: false, showListOnEmpty: true },
    },
    {
      field: "INP_WIDTH_MIDDLE",
      title: "WIDTH_MIDDLE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: { allowEmpty: false, showListOnEmpty: true },
    },
    {
      field: "INP_WIDTH_BOTTOM",
      title: "WIDTH_BOTTOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: { allowEmpty: false, showListOnEmpty: true },
    },
    {
      field: "INP_THICK_TOP",
      title: "THICK_TOP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: { allowEmpty: false, showListOnEmpty: true },
    },
    {
      field: "INP_THICK_MIDDLE",
      title: "THICK_MIDDLE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: { allowEmpty: false, showListOnEmpty: true },
    },
    {
      field: "INP_THICK_BOTTOM",
      title: "THICK_BOTTOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell) {
        const value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: { allowEmpty: false, showListOnEmpty: true },
    },
  ];

  // Table 1 Initialization via Ref
  useEffect(() => {
    if (!table1Ref.current) return;

    if (table1Instance.current) {
      table1Instance.current.destroy();
      table1Instance.current = null;
    }

    if (tabledata1?.length > 0) {
      const newTable = new Tabulator(table1Ref.current, {
        data: tabledata1,
        columns: column1,
        layout: "fitDataFill",
        height: 250,
        pagination: "local",
        paginationSize: 20,
        selectable: 1,
      });

      newTable.on("rowSelectionChanged", function () {
        if (isMounted.current) setTableData2([]);
      });
      newTable.on("rowDeselected", function () {
        if (isMounted.current) setTableData2([]);
      });

      table1Instance.current = newTable;
    }

    return () => {
      if (table1Instance.current) {
        table1Instance.current.destroy();
        table1Instance.current = null;
      }
    };
  }, [tabledata1, tdcList, holdrsn]);

  // Table 2 Initialization via Ref
  useEffect(() => {
    if (tabValue === 0 && table2Ref.current && tabledata2?.length > 0) {
      if (table2Instance.current) {
        table2Instance.current.destroy();
        table2Instance.current = null;
      }

      table2Instance.current = new Tabulator(table2Ref.current, {
        data: tabledata2,
        columns: column2,
        height: 500,
        layout: "fitDataFill",
        rowFormatter: function (row) {
          const data = row.getData();
          const paraMin = data?.PARA_MIN ?? 0;
          const paraMax = data?.PARA_MAX ?? 99999;
          const testParaValCoil = data?.PARA_VAL ?? 0;

          if (testParaValCoil < paraMin || testParaValCoil > paraMax) {
            row.getElement().style.backgroundColor = "yellow";
          }
        },
      });
    }

    return () => {
      if (table2Instance.current) {
        table2Instance.current.destroy();
        table2Instance.current = null;
      }
    };
  }, [tabValue, tabledata2]);

  // Table Dim Initialization via Ref
  useEffect(() => {
    if (tabValue === 1 && tableDimRef.current && tabledataDim?.length > 0) {
      if (tableDimInstance.current) {
        tableDimInstance.current.destroy();
        tableDimInstance.current = null;
      }

      tableDimInstance.current = new Tabulator(tableDimRef.current, {
        data: tabledataDim,
        columns: columnDim,
        maxHeight: 500,
        layout: "fitDataFill",
      });
    }

    return () => {
      if (tableDimInstance.current) {
        tableDimInstance.current.destroy();
        tableDimInstance.current = null;
      }
    };
  }, [tabValue, tabledataDim]);

  const LD50S002ConfirmApiCall = async (tabVal, id, obj) => {
    if (isMounted.current) setLoading(true);
    try {
      const token = await GetAuthorization();
      let varParam = {};
      if (tabVal) {
        varParam = {
          route:
            tabVal === "data"
              ? "LD50S002GetData"
              : tabVal === "onLoad"
              ? "LD50S002GetPlantID"
              : tabVal === "searchData"
              ? "LD50S002GetTestParaData"
              : tabVal === "updateData"
              ? "LD50S002UpdateParaData"
              : tabVal === "updateDataDim"
              ? "LD50S002UpdateDimData"
              : tabVal === "getTdcList"
              ? "LD50S002getTdcListData"
              : tabVal === "getHoldrsn"
              ? "LD50S002getHoldrsnData"
              : null,
          NBT_CD_DEPT: pageData?.NBT_CD_DEPT,
          NBT_CD_COMPANY: pageData?.NBT_CD_COMPANY,
          NBT_PROC_CTR: pageData?.NBT_PROC_CTR,
          USER: serverDetails.PersonalNo,
          plantId: "0780",
          INPUTDATA: obj,
        };
      }

      const res = await axiosAPI({
        url: "api/LD50S002/LD50S002ConfirmApi",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token?.accessToken,
        },
        data: varParam,
      });

      if (!isMounted.current) return;

      if (res.statusText !== "" && res.statusText !== "OK") {
        alertify.error(res?.data?.err ? res.data.err : res?.toString());
      } else if (tabVal === "data") {
        if (res.data.length === 0) {
          alertify.success("0 Rows Found");
        }
        setTableData1(res.data);
      } else if (tabVal === "onLoad") {
        formatPlantId(res.data);
      } else if (tabVal === "searchData") {
        if (res.data?.results2?.length === 0) {
          alertify.success("0 Rows found");
        }
        setTableData2(res.data?.results2 || []);
        setTableDataDim(res.data?.resultsDim || []);
      } else if (tabVal === "updateData" || tabVal === "updateDataDim") {
        alertify.success(`${res?.data} row(s) saved!`);
        if (tabVal === "updateData") {
          setTableData2([]);
        } else {
          setTableDataDim([]);
        }
      } else if (tabVal === "getTdcList") {
        if (res.data.length === 0) {
          alertify.error("No Data Found");
          setTdcList([]);
        } else {
          const rows = res.data.map((item) => ({
            key: item?.TSL_TDC_NO,
            value: item?.TSL_TDC_NO,
          }));
          setTdcList(rows);
        }
      } else if (tabVal === "getHoldrsn") {
        if (res.data.length === 0) {
          alertify.error("No Data Found");
          setHoldrsn([]);
        } else {
          const rows = res.data.map((item) => ({
            key: item?.CD_VALUE,
            value: `item?.CDVALUE-{item?.CD_DESC}`,
            label: `item?.CDVALUE-{item?.CD_DESC}`,
          }));
          setHoldrsn(rows);
        }
      }
    } catch (error) {
      if (!isMounted.current) return;
      if (error?.error?.response?.data?.error) {
        alertify.error(error.error.response.data.error);
      } else {
        alertify.error("An unexpected error occurred.");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const passBatch = () => {
    const gridData = table1Instance.current?.getSelectedRows();
    if (!gridData || gridData.length === 0) {
      alertify.error("Please select a row!");
      return;
    }
    const newData = [];
    for (let i = 0; i < gridData.length; i++) {
      const rowData = gridData[i]?.getData();
      const decision = rowData?.DECISION;
      const tdc = rowData?.TDC_LIST;
      const hold = rowData?.HOLD_RSN;
      const remarks = rowData?.REMARKS;

      if (!decision) {
        alertify.error("Please select decision!");
        return;
      }
      if (!remarks) {
        alertify.error("Remarks is mandatory!");
        return;
      }
      if (decision === "DOWNGRADE" && !tdc) {
        alertify.error("Please select downgrade TDC!");
        return;
      }
      if (decision === "HOLD" && !hold) {
        alertify.error("Please select hold reason!");
        return;
      }
      newData.push(rowData);
    }

    setLoading(true);
    GetAuthorization().then((token) => {
      axiosAPI({
        url: "api/LD50S002/passBatch",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token?.accessToken,
        },
        data: {
          data: newData,
          p_flag: "PASS",
          P_USER: serverDetails.PersonalNo,
        },
      })
        .then((res) => {
          if (!isMounted.current) return;
          if (res.statusText !== "" && res.statusText !== "OK") {
            alertify.error(res?.data?.err ? res.data.err : res?.toString());
          } else if (res?.data) {
            const msg = res.data;
            if (res.data.startsWith("Y-")) {
              alertify.success(msg);
              const defaultPlantId = "0780";
              LD50S002ConfirmApiCall("data", defaultPlantId);
            } else {
              alertify.error(msg.toString().replace("N-", ""));
            }
          }
        })
        .catch((e) => {
          if (isMounted.current) {
            alertify.error(e?.error?.message ? e.error.message : e?.toString());
          }
        })
        .finally(() => {
          if (isMounted.current) setLoading(false);
        });
    });
  };

  const handleSearch = () => {
    if (!table1Instance.current) {
      alertify.error("Please get table data first");
      return;
    }
    const selectedRows = table1Instance.current.getSelectedRows();
    if (selectedRows.length === 0) {
      alertify.error("Please select a row ");
      return;
    }
    const data = selectedRows[0].getData();
    const batchId = data?.EIC_ID_COIL;
    const castNo = data?.EIC_NO_CAST;
    const decVal = data?.DECISION;
    const downTdc = data?.TDC_LIST;
    const tdcVal = data?.EIC_TDC_ACTL;

    if (decVal === "DOWNGRADE" && (!downTdc || downTdc === "")) {
      alertify.error("Please Select Downgrade TDC");
      return;
    }

    const inputObj = {
      Batchid: batchId,
      CastNo: castNo,
      PLANT: "0780",
      TDC: decVal === "DOWNGRADE" ? downTdc : tdcVal,
    };
    LD50S002ConfirmApiCall("searchData", undefined, inputObj);
  };

  const handleUpdate = async () => {
    if (!table2Instance.current) return;
    const data = table2Instance.current.getRows();
    const formattedData = data.map((row) => row.getData());

    const selectedRows = table1Instance.current?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      alertify.error("Please select a row in Plant Data");
      return;
    }
    const statusData = selectedRows[0].getData();
    const status = statusData?.EIC_CD_STATUS;
    if (status !== "SA" && status !== "SD") {
      alertify.error("Update can only be done in SA and SD status");
      return;
    }

    LD50S002ConfirmApiCall("updateData", undefined, formattedData);
  };

  const handleUpdateDim = async () => {
    if (!tableDimInstance.current) return;
    const data = tableDimInstance.current.getRows();
    const formattedData = data.map((row) => row.getData());
    let hasError = false;

    const selectedRows = table1Instance.current?.getSelectedRows();
    if (!selectedRows || selectedRows.length === 0) {
      alertify.error("Please select a row in Plant Data");
      return;
    }
    const statusData = selectedRows[0].getData();
    const status = statusData?.EIC_CD_STATUS;
    if (!["SA", "SD"].includes(status)) {
      alertify.error("Update can only be done in SA and SD status");
      return;
    }

    formattedData.forEach((row) => {
      if (row.PARA_MIN !== null && row.PARA_MIN !== undefined) {
        if (
          row.INP_WIDTH_TOP === null ||
          row.INP_WIDTH_TOP === "" ||
          row.INP_WIDTH_MIDDLE === null ||
          row.INP_WIDTH_MIDDLE === "" ||
          row.INP_WIDTH_BOTTOM === null ||
          row.INP_WIDTH_BOTTOM === "" ||
          row.INP_THICK_TOP === null ||
          row.INP_THICK_TOP === "" ||
          row.INP_THICK_MIDDLE === null ||
          row.INP_THICK_MIDDLE === "" ||
          row.INP_THICK_BOTTOM === null ||
          row.INP_THICK_BOTTOM === ""
        ) {
          hasError = true;
        }
      }
    });

    if (hasError) {
      alertify.error("Value cannot be null");
      return;
    }

    LD50S002ConfirmApiCall("updateDataDim", undefined, formattedData);
  };

  const downloadTestParaGrid = () => {
    if (!table2Instance.current) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    const data = table2Instance.current.getData();
    if (!data || data.length === 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    const fileName = "LD50S002.xlsx";
    table2Instance.current.download("xlsx", fileName, {
      sheetName: "Sheet1",
    });
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="RM Inspection"
      />
      <Grid container spacing={0} sx={{ pl: 1 }}>
        <Grid item xs={12}>
          {loading ? <Loader /> : null}
        </Grid>
        <Grid item xs={12}>
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
          {!isRestricted && (
            <MDBox pt={6} pb={3} py={10}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <TableContainer
                        title="Plant Data"
                        headerContainer={
                          <Grid container>
                            <Grid item>
                              <Tooltip title="Search">
                                <IconButton onClick={handleSearch}>
                                  <SearchIcon sx={{ color: "#ffffff" }} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            <Grid item>
                              <Tooltip title="Update">
                                <IconButton onClick={passBatch}>
                                  <SaveIcon sx={{ color: "#ffffff" }} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        }
                      >
                        <div ref={table1Ref}></div>
                        Showing {tabledata1?.length} of {tabledata1?.length} entries
                      </TableContainer>
                    </Grid>

                    <Grid item xs={12}>
                      <TableContainer
                        title="Test Parameter Verification"
                        headerContainer={
                          <Grid container>
                            <Grid item>
                              <Tooltip title="Update">
                                <IconButton
                                  onClick={() => {
                                    if (tabValue === 0) {
                                      handleUpdate();
                                    } else if (tabValue === 1) {
                                      handleUpdateDim();
                                    }
                                  }}
                                  disabled={!saveBtnFlag}
                                >
                                  <SaveIcon sx={{ color: "#ffffff" }} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            {tabValue === 0 && (
                              <Grid item>
                                <Tooltip title="Copy Source Val">
                                  <IconButton
                                    onClick={() => {
                                      table2Instance.current
                                        ?.getRows()
                                        .forEach((row) => {
                                          const srcValue = row
                                            .getCell("PARA_VAL")
                                            .getValue();
                                          row
                                            .getCell("TEST_PARA_VAL_COIL")
                                            .setValue(srcValue);
                                        });
                                    }}
                                    sx={{ marginLeft: "10px" }}
                                  >
                                    <ContentCopy sx={{ color: "#ffffff" }} />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            )}
                            <Grid item>
                              <Tooltip title="Clear Values">
                                <IconButton
                                  onClick={() => {
                                    if (tabValue === 0) {
                                      table2Instance.current
                                        ?.getRows()
                                        .forEach((row) => {
                                          row
                                            .getCell("TEST_PARA_VAL_COIL")
                                            .setValue("");
                                        });
                                    } else if (tabValue === 1) {
                                      tableDimInstance.current
                                        ?.getRows()
                                        .forEach((row) => {
                                          row.getCell("INP_WIDTH_TOP").setValue("");
                                          row
                                            .getCell("INP_WIDTH_MIDDLE")
                                            .setValue("");
                                          row
                                            .getCell("INP_WIDTH_BOTTOM")
                                            .setValue("");
                                          row.getCell("INP_THICK_TOP").setValue("");
                                          row
                                            .getCell("INP_THICK_MIDDLE")
                                            .setValue("");
                                          row
                                            .getCell("INP_THICK_BOTTOM")
                                            .setValue("");
                                        });
                                    }
                                  }}
                                  sx={{ marginLeft: "10px" }}
                                >
                                  <ClearAll sx={{ color: "#ffffff" }} />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                            {tabValue === 0 && (
                              <Grid item>
                                <Tooltip title="Copy CAST to COIL">
                                  <IconButton
                                    onClick={() => {
                                      table2Instance.current
                                        ?.getRows()
                                        .forEach((row) => {
                                          const castValue = row
                                            .getCell("TEST_PARA_VAL_CAST")
                                            .getValue();
                                          row
                                            .getCell("TEST_PARA_VAL_COIL")
                                            .setValue(castValue);
                                        });
                                    }}
                                    sx={{ marginLeft: "10px" }}
                                  >
                                    <ContentCopy sx={{ color: "#ffffff" }} />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            )}
                            <Grid item xs={1}>
                              <Tooltip title="Download" arrow>
                                <IconButton
                                  color="white"
                                  onClick={downloadTestParaGrid}
                                >
                                  <DownloadForOfflineIcon />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        }
                      >
                        <Box sx={{ width: "100%" }}>
                          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                              value={tabValue}
                              onChange={handleTabChange}
                              aria-label="Para tables"
                            >
                              <Tab label="Chem and Mech Para" />
                              <Tab label="Width and Thick para" />
                            </Tabs>
                          </Box>
                          {tabValue === 0 && (
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <div ref={table2Ref}></div>
                                <br />
                                <p
                                  style={{
                                    color: "black",
                                    paddingLeft: "1rem",
                                    marginTop: "-1rem",
                                  }}
                                >
                                  Showing {tabledata2?.length} of{" "}
                                  {tabledata2?.length} entries
                                </p>
                              </Grid>
                            </Grid>
                          )}
                          {tabValue === 1 && (
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <div ref={tableDimRef}></div>
                                <br />
                                <p
                                  style={{
                                    color: "black",
                                    paddingLeft: "1rem",
                                    marginTop: "-1rem",
                                  }}
                                >
                                  Showing {tabledataDim?.length} of{" "}
                                  {tabledataDim?.length} entries
                                </p>
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      </TableContainer>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MDBox>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default LD50S002;
