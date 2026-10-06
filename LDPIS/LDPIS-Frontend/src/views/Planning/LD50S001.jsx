import React, { useEffect, useState, useRef, forwardRef } from "react";
import TableContainer from "../../components/tableContainer";
import { RadioInput, SelectInput, Input } from "../../components/input";
import "../../alertify.css";
import alertify from "alertifyjs";
import jwt from "jsonwebtoken";
import {
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  IconButton,
  Button,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import MDButton from "components/MDButton";
import ReactSelect from "components/Select/ReactSelect";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
//import { GetAuthorization, isFloat } from "../../utils";
import { GetAuthorization } from "utils";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import "tabulator-tables/dist/css/tabulator_simple.min.css"; //import Tabulator stylesheet
import Loader from "../../components/Preloader/Preloader";
import { useMaterialUIController } from "../../context";
import axiosAPI from "../../axiosAPI";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";
import routes from "routes";
import serverDetails from "../../variables/serverDetails";
import MDBox from "components/MDBox";

export const LD50S001 = () => {
  const [controller, dispatch] = useMaterialUIController();
  const { pageData, user } = controller;
  const [isAdmin, setAdmin] = React.useState(false);
  const [isReadWriteAccess, setReadWriteAccess] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [plantId, setPlantId] = React.useState("3734");

  const [tabledata1, setTableData1] = React.useState("");
  const [tabledata2, setTableData2] = React.useState("");
  const [totalLines, setTotalLines] = React.useState(0);
  const [table1, setTable1] = React.useState("");
  const [table2, setTable2] = React.useState("");
  const [allValues, setAllValues] = useState({
    batchId: "",
    tdc: "",
    widthFrm: "",
    widthTo: "",
    thkFrm: "",
    thkTo: "",
  });
  const handleChange = (e) => {
    setAllValues({ ...allValues, [e.target.name]: e.target.value });
    setTable1("");
    setTableData1("");
    setTable2("");
    setTableData2("");
  };
  const [plantIds, setPlantIds] = React.useState([
    {
      value: "3734",
      label: "3734",
    },
  ]);
  const [isRestricted, setRestricted] = React.useState(true);
  const [radioOp, setRadioOp] = React.useState("IN");
  const radioOptions = [
    { label: "Recieve to 3734", value: "IN" },
    { label: "Recieve to 0780", value: "XX" },
    { label: "Indent to 0780", value: "SV" },
  ];
  // const [selectInputData, setSelectInputData] = useState(plantIds);
  // useEffect(() => {
  //   if (radioOp === "IN" || radioOp === "") {
  //     setSelectInputData(plantIds);
  //   } else {
  //     setSelectInputData(["3734"]);
  //   }
  // }, [radioOp]);

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

  const validateUser = async (accessToken, refreshToken) => {
    try {
      var plant = "";
      //if (serverDetails.PersonalNo === ``)
      {
        var userDetails = jwt.verify(refreshToken, serverDetails.REFRESH_KEY);

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
      var pageName = "LD50S001";

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

  const loadData = () => {
    if (serverDetails.devMode) {
      setRestricted(false);
    }
    GetAuthorization().then(async (data) => {
      validateUser(data.accessToken, data.refreshToken);
      await LD50S001ConfirmApiCall("onLoad");
      await LD50S001ConfirmApiCall("data", plantId);
    });
  };

  React.useEffect(() => {
    loadData();
  }, []);

  React.useEffect(() => {
    const fetchDataForTable1 = () => {
      if (radioOp == "SV") {
        LD50S001ConfirmApiCall("data", "3734");
      } else if (radioOp == "XX") {
        LD50S001ConfirmApiCall("data", "0780");
      } else 
        LD50S001ConfirmApiCall("data", plantId);
    };
    fetchDataForTable1();
  }, [radioOp]);

  React.useEffect(() => {
    setTotalLines(tabledata1.length);
  }, [tabledata1]);

  const formatPlantId = (data) => {
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

  //Table Display
  React.useEffect(() => {
    //Table-Display-useState
    if (tabledata1?.length > 0) {
      setTable1(
        new Tabulator("#table1", {
          data: tabledata1,
          // selectable: multi,
          columns: column1,
          height: 380,
          pagination: true,
          paginationSize: 20,
        })
      );
    }
  }, [tabledata1]);

  React.useEffect(() => {
    //Table-Display-useState
    if (tabledata2?.length > 0) {
      setTable2(
        new Tabulator("#table2", {
          data: tabledata2,
          columns: column2,
          height: 300,
          layout: "fitDataFill",
          pagination: true,
          paginationSize: 20,
        })
      );
    }
  }, [tabledata2]);

  const column1 = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
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
      frozen: true,
    },
    // {
    //   field: "STORE_LOCATION",
    //   title: "Store Location",
    //   headerFilter: "input",
    //   editor: "select",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     cell.getElement().style["background-color"] = "#DA8EE7";
    //     cell.getElement().style["color"] = "#FFFFFF";
    //     return value;
    //   },
    //   editorParams: {
    //     allowEmpty: false,
    //     showListOnEmpty: true,
    //     //values: varVal,
    //   },
    //   headerFilterPlaceholder: "search...",
    // },
    {
      field: "EIC_ID_LOC_X",
      title: "Loc X",
      editor: "number",
      editorParams: {
        min: 0,
        max: 2,
        step: 1,
        elementAttributes: { maxlength: "2" },
      },
      //editorParams: { elementAttributes: { maxlength: "2" } },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        var value = cell.getValue();
        if (String(value).length > 2) {
          alertify.error("Enter 2 characters only!");
          var row = cell.getRow();
          row.update({
            EIC_ID_LOC_X: "",
          });
          return;
        }
      },
    },
    {
      field: "EIC_ID_LOC_Y",
      title: "Loc Y",
      //editor: "input",
      editor: "number",
      editorParams: {
        min: 0,
        max: 2,
        step: 1,
        elementAttributes: {
          maxlength: "2",
        },
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        var value = cell.getValue();
        if (String(value).length > 2) {
          alertify.error("Enter 2 characters only!");
          var row = cell.getRow();
          row.update({
            EIC_ID_LOC_Y: "",
          });
          return;
        }
      },
    },
    {
      field: "EIC_ID_POS",
      title: "Loc Z",
      editor: "number",
      editorParams: {
        min: 0,
        max: 2,
        step: 1,
        elementAttributes: {
          maxlength: "2",
        },
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        var value = cell.getValue();
        if (String(value).length > 2) {
          alertify.error("Enter 2 characters only!");
          var row = cell.getRow();
          row.update({
            EIC_ID_POS: "",
          });
          return;
        }
      },
    },
    {
      field: "EIC_CD_YRD",
      title: "YRD",
      editor: "number",
      editorParams: {
        min: 0,
        max: 2,
        step: 1,
        elementAttributes: { maxlength: "2" },
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        var value = cell.getValue();
        if (String(value).length > 2) {
          alertify.error("Enter 2 characters only!");
          var row = cell.getRow();
          row.update({
            EIC_CD_YRD: "",
          });
          return;
        }
      },
    },
    {
      field: "EIC_REMARKS",
      title: "Remarks",
      editor: "input",
      headerFilter: "input",
      width: "150",
      editorParams: {
        min: 0,
        max: 100,
        step: 1,
        elementAttributes: { maxlength: "100" },
      },
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
        cell.getElement().style["background-color"] = "#DA8EE7";
        cell.getElement().style["color"] = "#FFFFFF";
        return value;
      },
      cellEdited: (cell) => {
        var value = cell.getValue();
        if (String(value).length > 100) {
          alertify.error("Only 100 Characters Remarks are possible ");
          var row = cell.getRow();
          row.update({
            EIC_CD_YRD: "",
          });
          return;
        }
      },
    },
    {
      field: "STATUS_DESC",
      title: "Status Desc",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "EIC_NO_CAST",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
    // {
    //   field: "QUALITY_DESC",
    //   title: "Quality Desc / Grade",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      field: "EIC_SEC1",
      title: "Thick",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: "money",
    },
    {
      field: "EIC_SEC2",
      title: "Width",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      formatter: function (cell, formatterParams) {
        var value = cell.getValue();
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
      // formatter: function (cell, formatterParams) {
      //   var value = cell.getValue();
      //   if (value) {
      //     return value?.toFixed(3);
      //   }
      //   return value;
      // },
    },
    {
      field: "EIC_TDC_ACTL",
      title: "TDC",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   field: "PROD_GRP",
    //   title: "Prod Grp",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // { "field": "EPA_Passed_Proc", "title": "SPC Passed Proc", "headerFilter": "input", "headerFilterPlaceholder": "search..." },

    {
      field: "EIC_MS_PIECE_ACTL",
      title: "Net Weight(MT)",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
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
      field: "EIC_NO_MATNR",
      title: "Material No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "ARRIVAL_DATE",
      title: "Arrival Dt.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "AGE",
      title: "Age",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
     {
      field: "RECORD_CREATION",
      title: "Rec Creation Dt.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "OPERATOR_ID",
      title: "Operator ID",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "EIC_VEHICAL_NO",
      title: "Vehicle No.",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    // {
    //   field: "RESIDUAL_WEIGHT",
    //   title: "Residual Wt(MT)",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value?.toFixed(3);
    //     }
    //     return value?.toFixed(3);
    //   },
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    // },
    // {
    //   field: "MS_SCRAP",
    //   title: "Scrap Wt(MT)",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    //   formatter: function (cell, formatterParams) {
    //     var value = cell.getValue();
    //     if (value) {
    //       return value?.toFixed(3);
    //     }
    //     return value?.toFixed(3);
    //   },
    //   bottomCalc: "sum",
    //   bottomCalcParams: { precision: 3 },
    // },
    // {
    //   field: "VEHICAL_NO",
    //   title: "Vehicle No",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // { "field": "RESIDUAL_WEIGHT", "title": "Residual Weight", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" , bottomCalc:"sum", bottomCalcParams:{precision:3}},
    // { "field": "PRIME", "title": "Prime", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ARISING", "title": "Arising", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "BALANCE_SLIT_SEC", "title": "Balance Slit Sec", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "PROCESSED_PRM", "title": "Processsed Prm+Ars", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "MS_Scrap", "title": "Scrap", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "GROSS_YILED", "title": "Gross Yield%", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "PRIME_YIELD", "title": "Prime Yield%", "headerFilter": "input", "headerFilterPlaceholder": "search..." },

    // { "field": "ORDER_STATUS", "title": "Order Type", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ORDER_NO", "title": "SPC Order", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ORDER_ITEM", "title": "Item", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "ORDER_TYPE", "title": "Order Type", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // {
    //   field: "EIC_NO_MATNR",
    //   title: "Material Number",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "EIC_DT_LOADING",
    //   title: "Arrival Date",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // { "field": "TRANSIT_LEAD", "title": "Transit Lead Time(Days)", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "TIME", "title": "Time", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "EIC_DT_PIECE_UPD", "title": "Process Date", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "EIC_MS_PIECE_ACTL", "title": "SPC Weight", "headerFilter": "input", "headerFilterPlaceholder": "search...", formatter: "money" ,bottomCalc:"sum", bottomCalcParams:{precision:3} },
    // { "field": "BILLET", "title": "No of Billet", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "BILLET_PIECE", "title": "Billet Piece Wt", "headerFilter": "input", "headerFilterPlaceholder": "search..." ,bottomCalc:"sum", bottomCalcParams:{precision:3} },

    // { "field": "PROC_DAYS", "title": "No Proc Days", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // { "field": "INV_DAYS", "title": "No Inv Days", "headerFilter": "input", "headerFilterPlaceholder": "search..." },
    // {
    //   field: "AGE",
    //   title: "Age",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "EPA_AGE",
    //   title: "Age at Plant",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "EIC_CD_EPA",
    //   title: "Plant",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    {
      field: "EIC_ID_OP_DECSN",
      title: "Operator",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
    },
    {
      field: "MARK_CUST",
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
      field: "EIC_CD_EPA",
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
    // {
    //   field: "EIC_WO_NO",
    //   title: "Mill order",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "EIC_ITEM_NO",
    //   title: "Item",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
    // {
    //   field: "EIC_CD_EDGE",
    //   title: "Edge",
    //   headerFilter: "input",
    //   headerFilterPlaceholder: "search...",
    // },
  ];

  const column2 = [
    {
      formatter: "rowSelection",
      titleFormatter: "rowSelection",
      hozAlign: "center",
      download: false,
      headerSort: false,
      frozen: true,
    },
    {
      field: "BatchId",
      title: "Batch Id",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "CastNo",
      title: "Cast No",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "PROP",
      title: "Property",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "TEST_CD",
      title: "Test Code",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "TEST_PARA",
      title: "Test Para",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },
    {
      field: "PARA_VAL",
      title: "Para Val",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
    },

    {
      field: "PARA_CHG_VAL",
      title: "Data to be entered after real checking",
      headerFilter: "input",
      headerFilterPlaceholder: "search...",
      frozen: true,
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

  const getData = async (newToken = false) => {
    if (newToken) {
      const rsp = await GetAuthorization();
    }
    var defaultOptions = {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("tmm_accessToken"),
      },
    };
    // let batchId = allValues.batchId
    // if (!batchId) {
    //   alertify.error("Please select Batch Id !");
    //   return;
    // }

    setLoading(true);
    var url;
    let radioOpvalue = "IN";
    let plantvalue = "0780";
    if(radioOp === "XX"){
      radioOpvalue = "IN";
      plantvalue = "0780";
    }else if(radioOp === "IN"){
      radioOpvalue = "IN";
      plantvalue = "3734";
    }else{
      radioOpvalue = radioOp;
       plantvalue = "3734";
    }

    var data = {
      batchId: allValues.batchId,
      tdc: allValues.tdc,
      widthFrm: allValues.widthFrm,
      widthTo: allValues.widthTo,
      thkFrm: allValues.thkFrm,
      thkTo: allValues.thkTo,
      Status: radioOpvalue,
      Plant: plantvalue,
    };

    url = "api/LD50S001/getRawMaterialData";

    axiosAPI
      .post(url, data, defaultOptions)
      .then((response) => {
        if (response.statusText != "" && response.statusText != "OK") {
          //reject(response.statusText);
        } else {
          setTableData1(response.data);

          if (response.data.length == 0) {
            alertify.error("No Data Found");
            setTableData1([]);
          }
        }
      })
      .finally((f) => {
        setLoading(false);
      });
  };

  const tableUi1 = () => {
    return <div id="table1"></div>;
  };

  const tableUi2 = () => {
    return <div id="table2"></div>;
  };

  const procedureCall = (row) => {
    if (row?.length === 0) {
      return;
    }
    setLoading(true);
    GetAuthorization().then((token) => {
      axiosAPI({
        url: "api/LD50S001/LD50S001ConfirmApi",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token?.accessToken,
        },
        data: {
          type: "procedureCall",
          plantId: plantId,
          coilId: row,
        },
      })
        .then((res) => {
          if (res.statusText !== "" && res.statusText !== "OK") {
            alertify.error(res?.data?.err ? res.data.err : res?.toString());
          } else if (res?.data) {
            if (res.data?.N.length === 0) {
              alertify.success("Y- Conifrm Successful");
              // fetchData(0);
            } else {
              let failedCoils = res?.data?.N.join();
              alertify.error("All coils confirmed except " + failedCoils);
              // fetchData(0);
            }
            // table?.deselectRow();
          }
        })
        .catch((e) => {
          alertify.error(
            e?.error?.message ? e.error.message : "Something Wents wrong!"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const confirmData = (data) => {
    const gridData = table1?.getSelectedRows();
    if (gridData?.length === 0) {
      alertify.error("Please select a row!");
      return;
    }
    let coilIds = [];
    let check = true;
    // console.log(statusCheckData);
    for (let i = 0; i < gridData.length; i++) {
      //   if (
      //     !statusCheckData?.requestStatus.includes(
      //       gridData[i]?._row?.getData().STATUS
      //     )
      //   ) {
      //     check = false;
      //     break;
      //   }
      coilIds.push(gridData[i]?._row?.getData().COIL_ID);
    }
    // if (!check) {
    //   alertify.error("Confirm Request is not allowed");
    //   return;
    // }
    procedureCall(coilIds);
  };

  const Save = () => {
    console.log("SAVE in LD50S001");
    if (tabledata1.length === 0) {
      alertify.error("No data to inserted");
      return;
    }
    const selectedRows = table1.getSelectedRows();
    console.log("DATA", selectedRows);
    if (selectedRows?.length === 0) {
      alertify.error("No row selected");
      return;
    }
    const selectedData = table1.getSelectedRows()?.map((row) => {
    let radioOpvalue = "IN";
    if(radioOp === "XX"){
      radioOpvalue = "IN";
    }else{
      radioOpvalue = radioOp;
    }

      let varData = {};
      varData["NBT_EPA_CD"] = row._row.data.EIC_CD_EPA;
      varData["P_EIC_ID_COIL"] = row._row.data.EIC_ID_COIL;
      varData["NBT_EIC_NO_INVOICE"] = row._row.data.EIC_NO_INVOICE;
      varData["NBT_GR_DATE"] = row._row.data.EIC_DT_INVOICE;
      varData["P_EIC_ID_POS"] = row._row.data.EIC_ID_POS;
      varData["P_EIC_LOC_X"] = row._row.data.EIC_ID_LOC_X;
      varData["P_EIC_LOC_Y"] = row._row.data.EIC_ID_LOC_Y;
      varData["P_EIC_CD_YRD"] = row._row.data.EIC_CD_YRD;
      varData["P_EIC_REMARKS"] = row._row.data.EIC_REMARKS;
      varData["P_USER"] = serverDetails?.PersonalNo; //user;
      varData["P_STATUS"] = radioOpvalue;

      return varData;
    });
    setLoading(true);
    GetAuthorization().then((token) => {
      axiosAPI({
        url: "api/LD50S001/LD50S001SaveLDS003",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token?.accessToken,
        },
        data: selectedData,
      })
        .then((res) => {
          if (res.statusText !== "" && res.statusText !== "OK") {
            alertify.error(res?.data?.err ? res.data.err : res?.toString());
          } else {
            if (res.data == "Y") {
              alertify.success("Coil/Batch received successfully");
              setRadioOp("IN");
              setTable1([,]);
              LD50S001ConfirmApiCall("data", plantId);
            } else {
              alertify.error(res.data);
            }
          }
        })
        .catch((e) => {
          alertify.error(
            e?.error?.message ? e.error.message : "Something Wents wrong!"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const LD50S001ConfirmApiCall = async (tabVal, id, obj) => {
    setLoading(true);
    await GetAuthorization().then(async (token) => {
      let varParam = {};
      if (tabVal) {
           console.log('radioOp',radioOp);
        let radioOpvalue = "IN";
        if (radioOp === "XX" || radioOp === "IN"){
          radioOpvalue = "IN";
        }else if (radioOp === "SV"){
          radioOpvalue = "SV";
        }

        varParam = {
          route:
            tabVal === "data"
              ? "LD50S001GetData"
              : tabVal === "onLoad"
              ? "LD50S001GetPlantID"
              : tabVal === "searchData"
              ? "LD50S001GetTestParaData"
              : tabVal === "updateData"
              ? "LD50S001UpdateParaData"
              : null,
          NBT_CD_DEPT: pageData?.NBT_CD_DEPT,
          NBT_CD_COMPANY: pageData?.NBT_CD_COMPANY,
          NBT_PROC_CTR: pageData?.NBT_PROC_CTR,
          USER: user,
          plantId: id,
          Status: radioOpvalue,
          INPUTDATA: obj,
        };
      }
      console.log(varParam.Status);
      await axiosAPI({
        url: "api/LD50S001/LD50S001ConfirmApi",
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
            console.log(res.data);
            if (res.data.length === 0) {
              alertify.success("0 Rows Found");
              setTableData1(res.data);
            } else {
              setTableData1(res.data);
            }
          } else if (tabVal === "onLoad") {
            console.log(res.data);
            formatPlantId(res.data);
          } else if (tabVal === "searchData") {
            console.log(res.data);
            if (res.data.length === 0) {
              alertify.success("0 Rows found");
            }
            setTableData2(res.data);
          } else if (tabVal === "updateData") {
            return;
          }

          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          alertify.error(
            error?.error?.message
              ? error.error.message
              : " Something Went wrong!"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    });
  };

  const handleSearch = () => {
    if (table1.getSelectedRows().length === 0) {
      alertify.error("Please select a row ");
      return;
    }
    let data = table1.getSelectedRows()[0]._row.data;
    let batchId = data?.EIC_ID_COIL;
    let castNo = data?.EIC_NO_CAST;
    let inputObj = { Batchid: batchId, CastNo: castNo };
    LD50S001ConfirmApiCall("searchData", undefined, inputObj);
  };

  const handleUpdate = async () => {
    let data = table2.getRows();
    //console.log(pageData)
    //let batchID:string = table1.getSelectedRows()[0]?._row?.data.EIC_ID_COIL;
    let res = await data.map(async (row, index) => {
      let newData = data[index]._row.data;
      let obj = newData;
      console.log(obj);
      await LD50S001ConfirmApiCall("updateData", undefined, obj);
    });
    alertify.success(`Updated Successfully`);
    return;
  };

  const handleClearAll = () => {
    setAllValues({
      batchId: "",
      tdc: "",
      widthFrm: "",
      widthTo: "",
      thkFrm: "",
      thkTo: "",
    });
    setRadioOp("IN");
    setTable1("");
    setTableData1("");
  };

  return (
    <DashboardLayout>
      <DefaultNavbar
        routes={routes}
        module="Planning & Scheduling"
        page="Receive Raw Material"
      />
      <Grid container spacing={1} sx={{ pl: 1 }}>
        <Grid item xs={12}>
          {loading ? <Loader /> : null}
        </Grid>
        <Grid item xs={12}>
          {isRestricted && (
            <Grid item>
              <h4 style={{ color: "red", margin: "5rem" }}>
                You are not authorized to view this page !
              </h4>
            </Grid>
          )}
          {isRestricted === false && (
            <Grid item xs={12}>
              <MDBox pt={6} pb={3} py={10}>
                <TableContainer
                  title="Selection Details"
                  headerContainer={
                    <Tooltip title="Clear All">
                      <IconButton onClick={() => handleClearAll(true)}>
                        <ClearAllIcon sx={{ color: "#ffffff" }} />
                      </IconButton>
                    </Tooltip>
                  }
                >
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
                          Batch Id{" "}
                        </MDTypography>
                        <MDInput
                          name="batchId"
                          value={allValues.batchId || ""}
                          onChange={(e) => handleChange(e)}
                          // inputProps={{ maxLength: 11 }}
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
                          TDC{" "}
                        </MDTypography>
                        <MDInput
                          name="tdc"
                          value={allValues.tdc || ""}
                          onChange={(e) => handleChange(e)}
                          // inputProps={{ maxLength: 6 }}
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
                          Thickness From{" "}
                        </MDTypography>
                        <MDInput
                          name="thkFrm"
                          value={allValues.thkFrm || ""}
                          onChange={(e) => handleChange(e)}
                          // inputProps={{ maxLength: 11 }}
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
                          Thickness To{" "}
                        </MDTypography>
                        <MDInput
                          name="thkTo"
                          value={allValues.thkTo || ""}
                          onChange={(e) => handleChange(e)}
                          // inputProps={{ maxLength: 11 }}
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
                          Width From{" "}
                        </MDTypography>
                        <MDInput
                          name="widthFrm"
                          value={allValues.widthFrm || ""}
                          onChange={(e) => handleChange(e)}
                          // inputProps={{ maxLength: 11 }}
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
                          Width To{" "}
                        </MDTypography>
                        <MDInput
                          name="widthTo"
                          value={allValues.widthTo || ""}
                          onChange={(e) => handleChange(e)}
                          // inputProps={{ maxLength: 11 }}
                        />
                      </Grid>
                      <Grid item xs={4} sx={{ mt: 2.5 }}>
                        <RadioInput
                          id={"radioOption"}
                          style={{ marginTop: "1.5rem" }}
                          row={true}
                          value={radioOp}
                          data={radioOptions}
                          onChange={(e) => {
                            console.log(e,'EEEEEEEEEEE');
                            setRadioOp(e);
                            // handleClearAll();

                            if (radioOp == "SV") {
                              setPlantId("3734");
                            // }else if (radioOp == "IN") {
                            //   setPlantId("0780");
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={1}>
                        {" "}
                        <MDButton
                          style={{ marginTop: "1.5rem", marginLeft: "1rem" }}
                          size="small"
                          color="info"
                          onClick={() => getData(true)}
                        >
                          {" "}
                          Submit{" "}
                        </MDButton>{" "}
                      </Grid>

                      {/* <Grid container spacing={3}>
                    {radioOp && radioOp == "IN" 
                    // && (
                    //   <Grid item xs={3}>
                    //     <SelectInput
                    //       id="1"
                    //       value={plantId}
                    //       label="Plant"
                    //       data={plantIds}
                    //       onChange={(e) => {
                    //         setPlantId(e);
                    //         if (e.length > 1) {
                    //           // Only make the API call if radioOp is "IN" or empty
                    //           LD50S001ConfirmApiCall("data", e);
                    //         }
                    //       }}
                    //     />
                    //   </Grid>
                    // )
                    }
                    {radioOp && radioOp == "SV" 
                    // && (
                    //   <Grid item xs={3}>
                    //     <SelectInput
                    //       id="2"
                    //       value={plantId}
                    //       label="Plant"
                    //       data={[
                    //         {
                    //           key: 1,
                    //           value: "3734",
                    //           label: "3734",
                    //         },
                    //       ]}
                    //       onChange={(e) => {
                    //         setPlantId(e);
                    //         if (e.length > 1) {
                    //           // Only make the API call if radioOp is "IN" or empty
                    //           LD50S001ConfirmApiCall("data", e);
                    //         }
                    //       }}
                    //     />
                    //   </Grid>
                    // )
                    }
                    <Grid item xs={3} sx={{ mt: 1 }}>
                      <RadioInput
                        id={"radioOption"}
                        row={true}
                        value={radioOp}
                        data={radioOptions}
                        onChange={(e) => {
                          setRadioOp(e);
                          if (radioOp == "SV") {
                            setPlantId("3734");
                          }
                        }}
                      />
                    </Grid>
                  </Grid> */}
                    </Grid>
                  </MDBox>

                  {/* <Grid container spacing={3}>
                    {radioOp && radioOp == "IN" 
                    // && (
                    //   <Grid item xs={3}>
                    //     <SelectInput
                    //       id="1"
                    //       value={plantId}
                    //       label="Plant"
                    //       data={plantIds}
                    //       onChange={(e) => {
                    //         setPlantId(e);
                    //         if (e.length > 1) {
                    //           // Only make the API call if radioOp is "IN" or empty
                    //           LD50S001ConfirmApiCall("data", e);
                    //         }
                    //       }}
                    //     />
                    //   </Grid>
                    // )
                    }
                    {radioOp && radioOp == "SV" 
                    // && (
                    //   <Grid item xs={3}>
                    //     <SelectInput
                    //       id="2"
                    //       value={plantId}
                    //       label="Plant"
                    //       data={[
                    //         {
                    //           key: 1,
                    //           value: "3734",
                    //           label: "3734",
                    //         },
                    //       ]}
                    //       onChange={(e) => {
                    //         setPlantId(e);
                    //         if (e.length > 1) {
                    //           // Only make the API call if radioOp is "IN" or empty
                    //           LD50S001ConfirmApiCall("data", e);
                    //         }
                    //       }}
                    //     />
                    //   </Grid>
                    // )
                    }
                    <Grid item xs={3} sx={{ mt: 1 }}>
                      <RadioInput
                        id={"radioOption"}
                        row={true}
                        value={radioOp}
                        data={radioOptions}
                        onChange={(e) => {
                          setRadioOp(e);
                          if (radioOp == "SV") {
                            setPlantId("3734");
                          }
                        }}
                      />
                    </Grid>
                  </Grid> */}
                </TableContainer>

                <TableContainer
                  title="Plant Data"
                  headerContainer={
                    <Tooltip title="Request Indent">
                      <IconButton
                        onClick={() => {
                          // confirmData(plantId);
                          // saveData();
                          Save();
                        }}
                      >
                        <SaveIcon sx={{ color: "#ffffff" }} />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  {tabledata1?.length > 0 && tableUi1()}
                  <br />
                  <p
                    color="black"
                    style={{
                      color: "black",
                      paddingLeft: "1rem",
                      marginTop: "1rem",
                    }}
                  >
                    Showing 1 to {tabledata1.length} of {tabledata1.length}{" "}
                    entries
                  </p>
                </TableContainer>

                {/* {
            <Grid item xs={12}>
              <TableContainer
                title=" Test Parameter Verification"
                headerContainer={
                  <Tooltip title="Update">
                    <IconButton
                      onClick={() => {
                        handleUpdate();
                      }}
                    >
                      <SaveIcon sx={{ color: "#ffffff" }} />
                    </IconButton>
                  </Tooltip>
                }
              >
                {tabledata2?.length > 0 && tableUi2()}
              </TableContainer>
            </Grid>
          } */}
              </MDBox>
            </Grid>
          )}
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default LD50S001;
