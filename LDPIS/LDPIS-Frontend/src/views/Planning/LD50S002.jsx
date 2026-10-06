import React, { useEffect, useState, useRef, forwardRef } from "react";
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
  const [controller, dispatch] = useMaterialUIController();
  const { pageData, user } = controller;
  const [loading, setLoading] = React.useState(false);
  const [plantId, setPlantId] = React.useState("");
  const [tabledata1, setTableData1] = React.useState("");
  const [tabledata2, setTableData2] = React.useState([]);
  const [tabledataDim, setTableDataDim] = React.useState([]);
  const [table1, setTable1] = React.useState("");
  const [table2, setTable2] = React.useState(null);
  const [tableDim, setTableDim] = React.useState(null);
  const [plantIds, setPlantIds] = React.useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [tdcList, setTdcList] = React.useState([]);
  const [holdrsn, setHoldrsn] = React.useState([]);
  const [isRestricted, setRestricted] = React.useState(true);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [isAdmin, setAdmin] = React.useState(false);

  const [saveBtnFlag, setSaveBtnFlag] = React.useState(true);

  const validateUser = async (accessToken, refreshToken) => {
    try {
      console.log("Inside validateUser: ");
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      // {
      // var userDetails = jwt.verify(refreshToken, serverDetails.REFRESH_KEY);
      // console.log("userDetails:: ", userDetails);
      var userDetails;
      try {
        userDetails = jwt.verify(
          localStorage.getItem("tmm_refreshToken"),
          serverDetails.REFRESH_KEY
        );
        console.log("userDetails:: ", userDetails);
      } catch (err) {
        console.error("Token verification failed:", err);
        throw new Error("Invalid token");
      }

      plant = userDetails.payload.plant;
      serverDetails.PersonalNo = userDetails.payload.id;
      serverDetails.Plant = userDetails.payload.plant;
      serverDetails.Company = userDetails.payload.company;
      // }

      if (
        serverDetails.PersonalNo == null ||
        serverDetails.PersonalNo == undefined ||
        serverDetails.PersonalNo === ``
      ) {
        window.location.href = "#/signin";
      }

      var userId = serverDetails.PersonalNo;
      var pageName = "LD50S002";

      var authDetails = await getScreenAuth(
        plant,
        userId,
        pageName,
        accessToken
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
      } else {
        setRestricted(true);
        setAdmin(false);
      }
    } catch (error) {
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

  const getScreenAuth = (plantCd, userId, pageName) =>
    new Promise((resolve, reject) => {
      var defaultOptions = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
        },
      };
      console.log("userId: ", userId);
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

  const loadData = () => {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    console.log("Inside load data.");
    console.log("load data serverDetails: ", serverDetails);
    GetAuthorization().then(async (data) => {
      validateUser(data.accessToken, data.refreshToken);
      await LD50S002ConfirmApiCall("onLoad");
      const plantId = "0780";
      await LD50S002ConfirmApiCall("data", plantId);
    });
  };

  React.useEffect(() => {
    console.log("hii");
    loadData();
  }, []);

  const formatPlantId = (data) => {
    //console.log(data)
    if (data.length > 0) {
      let options = data.map((row, index) => {
        return {
          key: index,
          value: row["CD_VALUE"],
          label: row["CD_VALUE"] + " - " + row["CD_DESC"],
        };
      });
      options.push({
        key: options.length,
        value: "ALL",
        label: "All",
      });
      setPlantIds(options);
    }
  };

  React.useEffect(() => {
    if (tabledata1?.length > 0) {
      if (table1) {
        table1.destroy();
        setTable1(null);
      }

      const newTable = new Tabulator("#table1", {
        data: tabledata1,
        columns: column1,
        layout: "fitDataFill",
        height: 250,
        pagination: "local",
        paginationSize: 20,
        selectable: 1,
      });

      newTable.on("rowSelectionChanged", function (data, rows) {
        setTableData2([]);
      });
      newTable.on("rowDeselected", function (data, rows) {
        setTableData2([,]);
      });

      setTable1(newTable);
    }

    return () => {
      if (table1) {
        table1.destroy();
        setTable1(null);
      }
    };
  }, [tabledata1, tdcList, holdrsn]);

  // useEffect(() => {
  //   if (plantId.length > 1) {
  //     LD50S002ConfirmApiCall("data", plantId);
  //   }
  // }, [plantId]);

  React.useEffect(() => {
    if (tabValue === 0 && tabledata2?.length > 0) {
      setTable2(
        new Tabulator("#table2", {
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
        })
      );
    }

    // return () => {
    //   // Don't destroy the table unless it's needed (e.g., unmounting component)
    //   if (tabValue !== 0 && table2) {
    //     table2.destroy();
    //     setTable2(null);
    //   }
    // };
  }, [tabValue, tabledata2]);

  React.useEffect(() => {
    if (tabValue === 1 && tabledataDim?.length > 0) {
      setTableDim(
        new Tabulator("#tableDim", {
          data: tabledataDim,
          columns: columnDim,
          maxHeight: 500,
          layout: "fitDataFill",
        })
      );
    }

    // return () => {
    //   // Don't destroy the table unless it's needed (e.g., unmounting component)
    //   if (tabValue !== 1 && tableDim) {
    //     tableDim?.destroy();
    //     setTableDim(null);
    //   }
    // };
  }, [tabValue, tabledataDim]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const column1 = [
    {
      formatter: "rowSelection",
      // titleFormatter: "rowSelection",
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: function (cell) {
        var row = cell.getRow();
        var decision = cell.getValue();

        if (decision === "DOWNGRADE") {
          row.update({
            TDC_LIST: "",
            HOLD_RSN: "",
            REMARKS: "", // Clear REMARKS!
          });
          getTdcList();
        } else if (decision === "HOLD") {
          row.update({
            TDC_LIST: "",
            HOLD_RSN: "",
            REMARKS: "", // Clear REMARKS!
          });
          getHoldrsn();
        } else if (decision === "PASS" || decision === "RETURN") {
          row.update({
            TDC_LIST: "",
            HOLD_RSN: "",
            REMARKS: "", // Clear REMARKS!
          });
        }

        if (decision === "HOLD" || decision === "RETURN") {
          setSaveBtnFlag(false);
        }

        // updating bg of tdc downgrade based on decision
        row.getCell("TDC_LIST").getElement().innerHTML = row
          .getCell("TDC_LIST")
          .getValue();
        row.getCell("TDC_LIST").getElement().style["background-color"] =
          decision === "DOWNGRADE" ? "#DA8EE7" : "white";
        row.getCell("TDC_LIST").getElement().style["color"] =
          decision === "DOWNGRADE" ? "#FFFFFF" : "black";

        // updating bg of HOLD Reason based on decision
        row.getCell("HOLD_RSN").getElement().innerHTML = row
          .getCell("HOLD_RSN")
          .getValue();
        row.getCell("HOLD_RSN").getElement().style["background-color"] =
          decision === "HOLD" ? "#DA8EE7" : "white";
        row.getCell("HOLD_RSN").getElement().style["color"] =
          decision === "HOLD" ? "#FFFFFF" : "black";
      },
    },
    {
      title: "Tdc Downgrade",
      field: "TDC_LIST",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      // visible: tdcDownFlag,
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var decision = cell.getRow().getData().DECISION;

        if (decision !== "DOWNGRADE") {
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

        tdcList.forEach((item) => {
          var option = document.createElement("option");
          option.value = item.value;
          option.text = item.key;
          editor1.appendChild(option);
        });

        editor1.value = cell.getValue();
        editor1.style.padding = "3px";
        editor1.style.width = "100%";

        onRendered(() => editor1.focus());

        editor1.addEventListener("change", function () {
          success(editor1.value);

          var row = cell.getRow();
          row.update({ REMARKS: "" });
        });

        return editor1;
      },
      formatter: function (cell) {
        var value = cell.getValue();
        var decision = cell.getRow().getData().DECISION;
        if (decision == "DOWNGRADE") {
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
      editor: function (cell, onRendered, success, cancel, editorParams) {
        var decision = cell.getRow().getData().DECISION;

        if (decision !== "HOLD") {
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

        holdrsn.forEach((item) => {
          var option = document.createElement("option");
          option.value = item.key;
          option.text = item.value;
          editor1.appendChild(option);
        });

        editor1.value = cell.getValue();
        editor1.style.padding = "3px";
        editor1.style.width = "100%";

        onRendered(() => editor1.focus());

        editor1.addEventListener("change", function () {
          success(editor1.value);

          var row = cell.getRow();
          row.update({ REMARKS: "" });
        });

        return editor1;
      },
      formatter: function (cell) {
        var value = cell.getValue();
        var decision = cell.getRow().getData().DECISION;
        if (decision == "HOLD") {
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
        var value = cell.getValue();
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
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value;
      },
    },
    {
      field: "EIC_SEC2",
      title: "Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value;
      },
    },
    {
      field: "EIC_LENGTH",
      title: "Length",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      hozAlign: "right",
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value;
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value?.toFixed(3);
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value?.toFixed(3);
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value?.toFixed(3);
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
    // {
    //   field: "SALVAGING_REMARKS",
    //   title: "Salvaging Remarks",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "TOP_REMARKS",
    //   title: "Top Remarks",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "BOTTOM_REMARKS",
    //   title: "Bottom Remarks",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "FILE_NAME",
    //   title: "Salvaging File Name",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "WORK_CENTER",
    //   title: "Work Center",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "PASSED_PROC",
    //   title: "Mill Passed Process",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
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
      // width: 30,
      headerWordWrap: true,
    },
    {
      field: "BatchId",
      title: "Batch Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      // width: 100,
      headerWordWrap: true,
    },
    {
      field: "CastNo",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
      // width: 80,
      headerWordWrap: true,
    },
    {
      field: "PROP",
      title: "Property",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 30,
      headerWordWrap: true,
    },
    {
      field: "TEST_CD",
      title: "Test Code",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 80,
      headerWordWrap: true,
    },
    {
      field: "TEST_PARA",
      title: "Test Para",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 80,
      headerWordWrap: true,
    },
    {
      field: "PARA_VAL",
      title: "Source Val",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value;
      },
      headerWordWrap: true,
    },
    {
      field: "PARA_MIN",
      title: "Para Min",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 80,
      headerWordWrap: true,
    },
    {
      field: "PARA_MAX",
      title: "Para Max",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 80,
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        if (value) {
          return value?.toFixed(3);
        }
        return value;
      },
      headerWordWrap: true,
    },
    {
      field: "PARA_UNIT",
      title: "Para Unit",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 80,
      headerWordWrap: true,
    },

    {
      field: "TEST_PARA_VAL_COIL_SEQ",
      title: "PARA_SEQ",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 80,
      headerWordWrap: true,
    },
    {
      field: "TEST_PARA_VAL_COIL",
      title: "Existing Data for this Coil",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        let paraMin = cell?._cell?.row?.data?.PARA_MIN;
        let paraMax = cell?._cell?.row?.data?.PARA_MAX;
        var value = cell?.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFF";

        if (paraMin !== null && value < paraMin) {
          cell.getElement().style["background-color"] = "red";
        }
        if (paraMax !== null && value > paraMax) {
          cell.getElement().style["background-color"] = "red";
        }
        if (paraMin === null && value < 0) {
          cell.getElement().style["background-color"] = "red";
        }
        if (value !== null && value !== undefined) {
          return parseFloat(value).toFixed(3);
        }
        const cellVal = parseFloat(value);
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
      },
      cellEdited: (cell) => {
        let paraMin = cell?._cell?.row?.data?.PARA_MIN;
        let paraMax = cell?._cell?.row?.data?.PARA_MAX;
        let oldVal = cell.getOldValue();

        const value = cell.getValue();
        const cellVal = parseFloat(value);

        if (!isNaN(cellVal)) {
          if (
            //if paraMin or paraMax has value then change colour
            (paraMin !== null && cellVal < paraMin) ||
            (paraMax !== null && cellVal > paraMax)
          ) {
            const rowElement = cell.getRow().getElement();
            rowElement.style["background-color"] = "yellow";
          } else {
            const rowElement = cell.getRow().getElement();
            rowElement.style["background-color"] = "";
          }

          cell.setValue(cellVal);
        } else {
          cell.setValue(0);
        }
      },
      // width: 120,
      headerWordWrap: true,
    },
    {
      field: "TEST_PARA_VAL_CAST",
      title: "Existing Data for this Cast",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      // width: 120,
      headerWordWrap: true,
      formatter: function (cell, formatterParams) {
        var value = cell?.getValue();
        return value?.toFixed(3);
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
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        //values: varVal,
      },
    },
    {
      field: "INP_WIDTH_MIDDLE",
      title: "WIDTH_MIDDLE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        //values: varVal,
      },
    },
    {
      field: "INP_WIDTH_BOTTOM",
      title: "WIDTH_BOTTOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        //values: varVal,
      },
    },
    {
      field: "INP_THICK_TOP",
      title: "THICK_TOP",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        //values: varVal,
      },
    },
    {
      field: "INP_THICK_MIDDLE",
      title: "THICK_MIDDLE",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        //values: varVal,
      },
    },
    {
      field: "INP_THICK_BOTTOM",
      title: "THICK_BOTTOM",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: false,
      editor: "input",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      editorParams: {
        allowEmpty: false,
        showListOnEmpty: true,
        //values: varVal,
      },
    },
  ];

  const passBatch = () => {
    const gridData = table1?.getSelectedRows();
    if (gridData?.length === 0) {
      alertify.error("Please select a row!");
      return;
    }
    let newData = [];
    for (let i = 0; i < gridData.length; i++) {
      const rowData = gridData[i]?._row?.getData();
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
      if (decision == "DOWNGRADE" && !tdc) {
        alertify.error("Please select downgrade TDC!");
        return;
      }
      if (decision == "HOLD" && !hold) {
        alertify.error("Please select hold reason!");
        return;
      }
      newData.push(gridData[i]?._row?.getData());
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
          if (res.statusText !== "" && res.statusText !== "OK") {
            alertify.error(res?.data?.err ? res.data.err : res?.toString());
          } else if (res?.data) {
            var msg = res.data;
            if (res.data.startsWith("Y-")) {
              alertify.success(msg);
              const plantId = "0780";
              LD50S002ConfirmApiCall("data", plantId);
              //setTableData1([,]);
              //alertify.success("Y- Successfully Confirmed");
            } else {
              //let msg = res.data.outBinds.ls_out_flag;
              alertify.error(msg.toString().replace("N-", ""));
            }
          }
        })
        .catch((e) => {
          alertify.error(e?.error?.message ? e.error.message : e?.toString());
          // alertify.error(
          //   e?.error?.message ? e.error.message : "Something Wents wrong!"
          // );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const tableUi1 = () => {
    return <div id="table1"></div>;
  };

  const tableUi2 = () => {
    return <div id="table2"></div>;
  };

  const LD50S002ConfirmApiCall = async (tabVal, id, obj) => {
    setLoading(true);
    await GetAuthorization().then(async (token) => {
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

      if (table1 && table1?.getSelectedRows().length === 0) {
        alertify.error("Please select a row ");
        return;
      }
      
      // console.log("varParam: ", varParam);
      // console.log(pageData);
      
      await axiosAPI({
        url: "api/LD50S002/LD50S002ConfirmApi",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token?.accessToken,
        },
        data: varParam,
      })
        .then(async (res) => {
          if (res.statusText !== "" && res.statusText !== "OK") {
            alertify.error(res?.data?.err ? res.data.err : res?.toString());
          } else if (tabVal === "data") {
            if (res.data.length === 0) {
              alertify.success("0 Rows Found");
              setTableData1(res.data);
            } else {
              setTableData1(res.data);
            }
          } else if (tabVal === "onLoad") {
            formatPlantId(res.data);
          } else if (tabVal === "searchData") {
            if (res.data.length === 0) {
              alertify.success("0 Rows found");
            }
            // res?.data?.results2?.forEach((x) => {
            //   if (x.PROP == "C") return (x.PARA_VAL = x.TEST_PARA_VAL_CAST);
            // });
            setTableData2(res.data.results2);
            setTableDataDim(res.data.resultsDim);
          } else if (tabVal === "updateData" || tabVal === "updateDataDim") {
            alertify.success(`${res?.data} row(s) saved!`);
            if (tabVal === "updateData") {
              setTableData2([,]);
            } else {
              setTableDataDim([,]);
            }
          } else if (tabVal === "getTdcList") {
            if (res.data.length == 0) {
              alertify.error("No Data Found");
              setTdcList([,]);
              // console.log("TDC LIST EMPTIED at 932 while api call");
            } else {
              var rows = [];
              for (var i in res.data) {
                rows.push({
                  key: res?.data?.[i]?.TSL_TDC_NO,
                  value: res?.data?.[i]?.TSL_TDC_NO,
                });
              }
              console.log(rows);
              setTdcList(rows);
              // console.log("TDC LIST filled at 943 while api call");
            }
          } else if (tabVal === "getHoldrsn") {
            if (res.data.length == 0) {
              alertify.error("No Data Found");
              setHoldrsn([,]);
              // console.log("Hold Reason  EMPTIED at 932 while api call");
            } else {
              var rows = [];
              console.log("res: ", res);
              console.log("res.data: ", res.data);
              for (var i in res.data) {
                rows.push({
                  key: res?.data?.[i]?.CD_VALUE,
                  value:
                    res?.data?.[i]?.CD_VALUE + "-" + res?.data?.[i]?.CD_DESC,
                  label:
                    res?.data?.[i]?.CD_VALUE + "-" + res?.data?.[i]?.CD_DESC,
                });
              }
              console.log("rows: ", rows);
              setHoldrsn(rows);
              // console.log("Hold Reason filled at 943 while api call");
            }
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          console.log(error?.error?.response?.data?.error);
          if (
            error.error.response &&
            error.error.response.data &&
            error.error.response.data.error
          ) {
            // Get the error message
            const errorMessage = error.error.response.data.error;
            // Display the error message using alertify
            alertify.error(errorMessage);
          } else {
            // Handle other cases
            alertify.error("An unexpected error occurred.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleSearch = () => {
    if (!table1) {
      alertify.error("Please get table data first");
      return;
    }
    if (table1 && table1?.getSelectedRows().length === 0) {
      alertify.error("Please select a row ");
      return;
    }
    let data = table1.getSelectedRows()[0]._row.data;
    let batchId = data?.EIC_ID_COIL;
    let castNo = data?.EIC_NO_CAST;
    let decVal = data?.DECISION;
    let downTdc = data?.TDC_LIST;
    let tdcVal = data?.EIC_TDC_ACTL;

    if (decVal === "DOWNGRADE" && (downTdc === "" || downTdc === null)) {
      alertify.error("Please Select Downgrade TDC");
      return;
    }

    let inputObj = {
      Batchid: batchId,
      CastNo: castNo,
      PLANT: "0780",
      TDC: decVal === "DOWNGRADE" ? downTdc : tdcVal,
    };
    LD50S002ConfirmApiCall("searchData", undefined, inputObj);
  };

  const handleUpdate = async () => {
    let data = table2.getRows();
    let formattedData = data.map((row) => {
      return row.getData();
    });
    let statusData = table1.getSelectedRows()[0]._row.data;
      let status = statusData?.EIC_CD_STATUS;
      if(status != "SA" && status != "SD" )
      {
        alertify.error("Update can only be done in SA and SD status");
        return;
      }

    LD50S002ConfirmApiCall("updateData", undefined, formattedData);
    return;
  };

  const getTdcList = async () => {
    // let seqRes = await LD50S002ConfirmApiCall("genSeqNo")
    //let batchID:string = table1.getSelectedRows()[0]?._row?.data.EIC_ID_COIL;
    // let res = await data.map(async (row, index: number) => {
    //   let newData = data[index]._row.data;
    //   let obj = newData;
    //   await LD50S002ConfirmApiCall("updateData", undefined, data);
    // });
    let formattedData = [];

    console.log(formattedData);
    LD50S002ConfirmApiCall("getTdcList", undefined, formattedData);
    //alertify.success(`Updated Successfully`);
    return;
  };
  const getHoldrsn = async () => {
    let formattedData = [];

    LD50S002ConfirmApiCall("getHoldrsn", undefined, formattedData);
    return;
  };

  const handleUpdateDim = async () => {
    let data = tableDim.getRows();
    let formattedData = data.map((row) => row.getData());
    let hasError = false;

    let statusData = table1.getSelectedRows()[0]._row.data;
      let status = statusData?.EIC_CD_STATUS;
      if (!['SA', 'SD'].includes(status)) {
        alertify.error("Update can only be done in SA and SD status");
        return;
      }

    formattedData.forEach((row) => {
      if (row.PARA_MIN !== null) {
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
    return;
  };

  const downloadTestParaGrid = () => {
    console.log("Inside Grid");
    if (table2 == null) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var len = table2.getData();
    if (len == 0) {
      alertify.error("No Data exists in table for Downloading");
      return;
    }

    var fileName = "LD50S002" + ".xlsx";
    table2.download("xlsx", fileName, {
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
          {isRestricted == false && (
            <MDBox pt={6} pb={3} py={10}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Grid item xs={12}>
                    {/* <TableContainer title="Selection Details">
                      <Grid sx={{ display: "flex" }}>
                        <Grid item xs={3}>
                          <MDButton
                            size="small"
                            color="info"
                            style={{ margin: "1.5rem" }}
                            onClick={() => {
                              const plantId = "0780";
                              LD50S002ConfirmApiCall("data", plantId);
                            }}
                          >
                            Fetch
                          </MDButton>
                        </Grid>
                      </Grid>
                    </TableContainer> */}

                    {
                      <Grid item xs={12}>
                        <TableContainer
                          title="Plant Data"
                          headerContainer={
                            <Grid container>
                              <Grid item>
                                <Tooltip title="Search">
                                  <IconButton
                                    onClick={() => {
                                      handleSearch();
                                    }}
                                  >
                                    <SearchIcon sx={{ color: "#ffffff" }} />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                              <Grid item>
                                <Tooltip title="Update">
                                  <IconButton
                                    onClick={() => {
                                      passBatch();
                                    }}
                                  >
                                    <SaveIcon sx={{ color: "#ffffff" }} />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          }
                        >
                          {tabledata1?.length > 0 && tableUi1()}
                          Showing {tabledata1?.length} of {tabledata1?.length}{" "}
                          entries
                        </TableContainer>
                      </Grid>
                    }

                    {
                      <Grid item xs={12}>
                        <TableContainer
                          title="Test Parameter Verification"
                          headerContainer={
                            <Grid container>
                              <Grid item>
                                <Tooltip title="Update">
                                  <IconButton
                                    onClick={() => {
                                      if (tabValue == 0) {
                                        handleUpdate();
                                      } else if (tabValue == 1) {
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
                                        table2?.getRows().forEach((row) => {
                                          const srcValue = row
                                            .getCell("PARA_VAL")
                                            .getValue();
                                          row
                                            .getCell("TEST_PARA_VAL_COIL")
                                            .setValue(srcValue); // Copy values
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
                                {/* Button to clear values */}
                                <Tooltip title="Clear TEST_PARA_VAL_COIL">
                                  <IconButton
                                    onClick={() => {
                                      if (tabValue == 0) {
                                        table2.getRows().forEach((row) => {
                                          row
                                            .getCell("TEST_PARA_VAL_COIL")
                                            .setValue(""); // Clear values
                                        });
                                      } else if (tabValue == 1) {
                                        tableDim.getRows().forEach((row) => {
                                          row
                                            .getCell("INP_WIDTH_TOP")
                                            .setValue("");
                                          row
                                            .getCell("INP_WIDTH_MIDDLE")
                                            .setValue("");
                                          row
                                            .getCell("INP_WIDTH_BOTTOM")
                                            .setValue("");
                                          row
                                            .getCell("INP_THICK_TOP")
                                            .setValue("");
                                          row
                                            .getCell("INP_THICK_MIDDLE")
                                            .setValue("");
                                          row
                                            .getCell("INP_THICK_BOTTOM")
                                            .setValue(""); // Clear values
                                        });
                                      }
                                    }}
                                    sx={{ marginLeft: "10px" }}
                                  >
                                    <ClearAll sx={{ color: "#ffffff" }} />
                                  </IconButton>
                                </Tooltip>
                                {/* Button to copy values from TEST_PARA_VAL_CAST to TEST_PARA_VAL_COIL */}
                              </Grid>
                              {tabValue === 0 && (
                                <Grid item>
                                  <Tooltip title="Copy CAST to COIL">
                                    <IconButton
                                      onClick={() => {
                                        // if (tabValue == 0) {
                                        table2?.getRows().forEach((row) => {
                                          const castValue = row
                                            .getCell("TEST_PARA_VAL_CAST")
                                            .getValue();
                                          row
                                            .getCell("TEST_PARA_VAL_COIL")
                                            .setValue(castValue); // Copy values
                                        });
                                        // } else if (tabValue == 1) {
                                        //   alertify.error("Not for this tab");
                                        // }
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
                                    onClick={() => downloadTestParaGrid()}
                                  >
                                    <DownloadForOfflineIcon />
                                  </IconButton>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          }
                        >
                          <Box sx={{ width: "100%" }}>
                            <Box
                              sx={{ borderBottom: 1, borderColor: "divider" }}
                            >
                              <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="Para tables"
                              >
                                <Tab label="Chem and Mech Para" />
                                <Tab label="Width and Thick para" />
                              </Tabs>
                            </Box>
                            {tabValue === 0 && tabledata2?.length > 0 && (
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <div id="table2"></div>
                                  <br />
                                  <p
                                    color="black"
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
                            {tabValue === 1 && tabledataDim?.length > 0 && (
                              <Grid container spacing={2}>
                                <Grid item xs={12}>
                                  <div id="tableDim"></div>
                                  <br />
                                  <p
                                    color="black"
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
                    }
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
